// src/index.ts
import {
  makeContractCall,
  broadcastTransaction,
  Cl,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { STACKS_DEVNET } from '@stacks/network';

// Configuration for Clarinet Devnet
const network = {
  ...STACKS_DEVNET,
  url: 'http://localhost:20443', // Override default URL to match Devnet.toml
};
const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Deployer address from Devnet.toml
const contractName = 'campaigns';
const senderPrivateKey = '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601'; // Deployer secret key from Devnet.toml

// Function to create a campaign by calling create-campaign
async function createCampaign(goal: number, duration: number): Promise<string> {
  try {
    // Construct Clarity arguments for create-campaign (goal: uint, duration: uint)
    const functionArgs = [
      Cl.uint(goal),    // Convert goal to Clarity uint
      Cl.uint(duration), // Convert duration to Clarity uint
    ];

    // Transaction options for makeContractCall
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'create-campaign',
      functionArgs,
      senderKey: senderPrivateKey,
      network,
      anchorMode: AnchorMode.Any,           // Suitable for Devnet
      postConditionMode: PostConditionMode.Deny, // No post-conditions
      validateWithAbi: false,               // Skip ABI validation for simplicity
    };

    // Build the contract call transaction
    const transaction = await makeContractCall(txOptions);

    // Serialize the transaction (optional, for debugging)
    const serializedTx = transaction.serialize();
    console.log('Serialized TX:', Buffer.from(serializedTx).toString('hex'));    
    
    // Broadcast the transaction to the Devnet network
    const broadcastResponse = await broadcastTransaction({ transaction, network });    // Check for broadcast errors
    if ('error' in broadcastResponse) {
      throw new Error(`Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`);
    }

    const txId = broadcastResponse.txid;
    console.log(`Transaction ID: ${txId}`);
    return txId;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const goal = 10;    // Goal of 10 sBTC
  const duration = 2; // Duration of 2 blocks
  try {
    const txId = await createCampaign(goal, duration);
    console.log(`Campaign created with TX ID: ${txId}`);
  } catch (err) {
    console.error('Failed to create campaign:', err);
  }
}

main().catch(console.error);