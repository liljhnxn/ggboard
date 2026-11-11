const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const isMainnet = chainId === 677;

  const networkName = isMainnet ? "Botchain Mainnet" : "Botchain Testnet";
  const currencySymbol = isMainnet ? "BOT" : "BOHR";
  const explorerBase = isMainnet ? "https://scan.botchain.ai" : "https://scan.bohr.life";

  console.log(`Starting deployment of GGBoard to ${networkName} (Chain ID: ${chainId})...`);

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deploying with account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${hre.ethers.formatEther(balance)} ${currencySymbol}`);
    if (balance === 0n) {
      throw new Error(`⚠️ Account balance is 0 ${currencySymbol}. Fund the account with gas before deploying.`);
    }
  } else {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }

  // Fetch optimal gas price from network
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log(`Using gas price: ${hre.ethers.formatUnits(gasPrice, "gwei")} Gwei`);

  const GGBoard = await hre.ethers.getContractFactory("GGBoard");
  const ggboard = await GGBoard.deploy({
    gasPrice: gasPrice,
  });

  console.log("Waiting for deployment transaction to be confirmed on-chain...");
  await ggboard.waitForDeployment();

  const contractAddress = await ggboard.getAddress();
  const deploymentTx = ggboard.deploymentTransaction();
  const receipt = await deploymentTx.wait();

  const gasUsed = receipt.gasUsed;
  const actualCost = gasUsed * receipt.gasPrice;

  console.log("\n========================================");
  console.log(`🎉 GGBoard deployed successfully on ${networkName}!`);
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", receipt.hash);
  console.log("Gas Used:", gasUsed.toString());
  console.log(`Actual Cost: ${hre.ethers.formatEther(actualCost)} ${currencySymbol}`);
  console.log("Explorer:", `${explorerBase}/address/${contractAddress}`);
  console.log("========================================\n");

  // Save deployed address and ABI to frontend
  const deploymentsDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const contractArtifact = await hre.artifacts.readArtifact("GGBoard");

  const deploymentData = {
    address: contractAddress,
    chainId: chainId,
    network: networkName,
    currencySymbol: currencySymbol,
    deployedAt: new Date().toISOString(),
    txHash: receipt.hash,
    gasUsed: gasUsed.toString(),
    actualCost: hre.ethers.formatEther(actualCost),
    abi: contractArtifact.abi,
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "GGBoardDeployment.json"),
    JSON.stringify(deploymentData, null, 2)
  );

  // Update .env
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }

    if (envContent.includes("NEXT_PUBLIC_CHAIN_ID=")) {
      envContent = envContent.replace(/NEXT_PUBLIC_CHAIN_ID=.*/, `NEXT_PUBLIC_CHAIN_ID=${chainId}`);
    } else {
      envContent += `NEXT_PUBLIC_CHAIN_ID=${chainId}\n`;
    }

    fs.writeFileSync(envPath, envContent);
  }

  console.log("Updated src/contracts/GGBoardDeployment.json and .env");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
