import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";

// Initialize Irys uploader with environment variables
export const getIrysUploader = async () => {
  const privateKey = process.env.IRYS_PRIVATE_KEY;
  const network = process.env.IRYS_NETWORK || 'devnet';
  const rpcUrl = process.env.IRYS_ETH_RPC;
  
  if (!privateKey) {
    throw new Error('IRYS_PRIVATE_KEY environment variable is required');
  }

  if (network === 'devnet' && !rpcUrl) {
    throw new Error('IRYS_ETH_RPC environment variable is required for devnet');
  }

  // Debug: Log wallet address (first few characters for security)
  const walletAddress = privateKey.startsWith('0x') ? 
    privateKey.slice(0, 10) + '...' : 
    '0x' + privateKey.slice(0, 8) + '...';
  console.log(`Using wallet: ${walletAddress} on ${network}`);

  // Configure Irys uploader
  if (network === 'mainnet') {
    const irysUploader = await Uploader(Ethereum)
      .withWallet(privateKey)
      .mainnet();
    return irysUploader;
  } else {
    const irysUploader = await Uploader(Ethereum)
      .withWallet(privateKey)
      .withRpc(rpcUrl!)
      .devnet();
    return irysUploader;
  }
};

// Helper function to get the public URL for an uploaded file
export const getIrysUrl = (transactionId: string): string => {
  const network = process.env.IRYS_NETWORK || 'devnet';
  const gateway = network === 'mainnet' ? 'https://gateway.irys.xyz' : 'https://devnet.irys.xyz';
  return `${gateway}/${transactionId}`;
};

// Helper function to upload data to Irys
export const uploadToIrys = async (
  data: Buffer | string,
  contentType: string,
  tags?: Array<{ name: string; value: string }>
): Promise<{ transactionId: string; url: string }> => {
  try {
    console.log('Starting Irys upload...');
    const irysUploader = await getIrysUploader();
    
    // Debug: Check balance before upload
    try {
      const balance = await irysUploader.getBalance();
      console.log(`Wallet balance: ${balance} wei`);
    } catch (balanceError) {
      console.log('Could not check balance:', balanceError);
    }
    
    // Prepare tags
    const uploadTags = [
      { name: 'Content-Type', value: contentType },
      { name: 'App-Name', value: 'ProofCampus' },
      { name: 'App-Version', value: '1.0.0' },
      ...(tags || [])
    ];

    console.log('Uploading data to Irys...');
    // Upload the data
    const receipt = await irysUploader.upload(data, { tags: uploadTags });
    
    console.log('Upload successful:', receipt.id);
    return {
      transactionId: receipt.id,
      url: getIrysUrl(receipt.id)
    };
  } catch (error) {
    console.error('Error uploading to Irys:', error);
    throw new Error(`Failed to upload to Irys: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 