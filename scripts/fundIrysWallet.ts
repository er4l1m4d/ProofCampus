// scripts/fundIrysWallet.ts
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const privateKey = process.env.IRYS_PRIVATE_KEY;
  const network = process.env.IRYS_NETWORK || 'devnet';
  const rpcUrl = process.env.IRYS_ETH_RPC;
  
  if (!privateKey) {
    throw new Error('IRYS_PRIVATE_KEY environment variable is required. Please check your .env.local file.');
  }

  if (network === 'devnet' && !rpcUrl) {
    throw new Error('IRYS_ETH_RPC environment variable is required for devnet. Please check your .env.local file.');
  }

  // Configure Irys uploader
  let irysUploader;
  if (network === 'mainnet') {
    irysUploader = await Uploader(Ethereum)
      .withWallet(privateKey)
      .mainnet();
  } else {
    irysUploader = await Uploader(Ethereum)
      .withWallet(privateKey)
      .withRpc(rpcUrl!)
      .devnet();
  }

  // Get wallet address
  const address = irysUploader.address;
  console.log(`🔐 Wallet address: ${address}`);

  // Check balance
  const balance = await irysUploader.getBalance();
  console.log(`💰 Current Irys balance: ${balance} wei`);

  const minBalance = BigInt("1000000000000000"); // 0.001 ETH in wei
  if (balance.gte(minBalance)) {
    console.log("✅ Wallet has enough balance.");
    return;
  }

  console.log(`⚠️ Low balance. Funding with 0.005 ETH on Sepolia...`);

  // Fund the wallet
  const fundAmount = BigInt("5000000000000000"); // 0.005 ETH in wei
  const fundTx = await irysUploader.fund(fundAmount);
  console.log("✅ Funded Irys wallet!");
  console.log("🧾 Transaction ID:", fundTx.id);

  const newBalance = await irysUploader.getBalance();
  console.log(`🔁 New balance: ${newBalance} wei`);
}

main().catch(console.error); 