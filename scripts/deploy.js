const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment of GGBoard to Botchain Testnet (Chain ID: 968)...");

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deploying with account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "BOHR");
    if (balance === 0n) {
      console.warn("⚠️ Warning: Deployer account balance is 0 BOHR! You will need testnet tokens for gas.");
    }
  } else {
    throw new Error("No deployer signer found. Please check PRIVATE_KEY in .env");
  }

  const GGBoard = await hre.ethers.getContractFactory("GGBoard");
  const ggboard = await GGBoard.deploy();
  await ggboard.waitForDeployment();

  const contractAddress = await ggboard.getAddress();
  console.log("\n========================================");
  console.log("🎉 GGBoard deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Explorer:", `https://scan.bohr.life/address/${contractAddress}`);
  console.log("========================================\n");

  // Save deployed address and ABI to frontend
  const deploymentsDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const contractArtifact = await hre.artifacts.readArtifact("GGBoard");

  const deploymentData = {
    address: contractAddress,
    chainId: 968,
    network: "Botchain Testnet",
    deployedAt: new Date().toISOString(),
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
    fs.writeFileSync(envPath, envContent);
  }

  console.log("Saved contract address to src/contracts/GGBoardDeployment.json and updated .env");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
