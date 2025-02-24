import { NextRequest, NextResponse } from 'next/server';
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  StacksNetwork,
} from '@stacks/transactions';

// Custom local network configuration
const localNetwork = {
  url: 'http://localhost:20443/v2', // Default Clarinet local endpoint
  fetchFn: fetch, // Use the default fetch function
} as StacksNetwork;

export async function POST(req: NextRequest) {
  const { contractCode, contractName } = await req.json();

  // Validate input
  if (!contractCode || !contractName) {
    return NextResponse.json(
      { error: 'Missing contractCode or contractName' },
      { status: 400 }
    );
  }

  try {
    const privateKey = process.env.STACKS_PRIVATE_KEY; // Note: Removed NEXT_PUBLIC_ prefix
    if (!privateKey) {
      throw new Error('STACKS_PRIVATE_KEY not set in environment variables');
    }

    // Use the local network instead of StacksTestnet
    const network = localNetwork;

    const txOptions = {
      contractName,              // Name of the Clarity contract
      codeBody: contractCode,    // Clarity contract code as a string
      senderKey: privateKey,     // Private key from Clarinet's pre-funded account
      network,                   // Local testnet network
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    // Create contract deployment transaction
    const transaction = await makeContractDeploy(txOptions);

    // Broadcast transaction to the local Stacks blockchain
    const broadcastResponse = await broadcastTransaction(transaction, network);
    const txId = broadcastResponse.txid;

    // Return the transaction ID to the client
    return NextResponse.json({ txId }, { status: 200 });
  } catch (error) {
    console.error('Error deploying contract:', error);
    return NextResponse.json(
      { error: 'Failed to deploy contract' },
      { status: 500 }
    );
  }
}