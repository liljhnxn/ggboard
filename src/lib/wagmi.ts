import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    name: "Botchain",
    symbol: "BOHR",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
    public: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http(),
  },
  ssr: true,
});

