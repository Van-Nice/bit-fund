// src/index.ts (updated getContribution function)
import {
  makeContractCall,
  broadcastTransaction,
  fetchCallReadOnlyFunction,
  Cl,
  AnchorMode,
  PostConditionMode,
  cvToJSON,
  ClarityValue,
  contractPrincipalCV,
} from "@stacks/transactions";
import { STACKS_DEVNET } from "@stacks/network";

// Configuration for Clarinet Devnet
const network = {
  ...STACKS_DEVNET,
  url: "http://localhost:20443",
};
const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = "campaigns";
const senderPrivateKey =
  "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";
const mockSbtcContractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const mockSbtcContractName = "mock-sbtc";

// Function to create a campaign by calling create-campaign
async function createCampaign(goal: number, duration: number): Promise<string> {
  try {
    const functionArgs = [
      Cl.uint(goal),
      Cl.uint(duration),
    ];

    const txOptions = {
      contractAddress,
      contractName,
      functionName: "create-campaign",
      functionArgs,
      senderKey: senderPrivateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      validateWithAbi: false,
    };

    const transaction = await makeContractCall(txOptions);
    const serializedTx = transaction.serialize();
    console.log("Serialized TX:", Buffer.from(serializedTx).toString("hex"));

    const broadcastResponse = await broadcastTransaction({ transaction, network });
    if ("error" in broadcastResponse) {
      throw new Error(
        `Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`
      );
    }

    const txId = broadcastResponse.txid;
    console.log(`Transaction ID: ${txId}`);
    return txId;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

// Function to contribute sBTC to a campaign
async function contribute(campaignId: number, amount: number, donorPrivateKey: string): Promise<string> {
  try {
    const functionArgs: ClarityValue[] = [
      Cl.uint(campaignId),
      Cl.uint(amount),
      contractPrincipalCV(mockSbtcContractAddress, mockSbtcContractName),
    ];

    const txOptions = {
      contractAddress,
      contractName,
      functionName: "contribute",
      functionArgs,
      senderKey: donorPrivateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      validateWithAbi: false,
    };

    const transaction = await makeContractCall(txOptions);
    const serializedTx = transaction.serialize();
    console.log("Serialized TX:", Buffer.from(serializedTx).toString("hex"));

    const broadcastResponse = await broadcastTransaction({ transaction, network });
    if ("error" in broadcastResponse) {
      throw new Error(
        `Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`
      );
    }

    const txId = broadcastResponse.txid;
    console.log(`Contribution TX ID: ${txId}`);
    return txId;
  } catch (error) {
    console.error("Error contributing to campaign:", error);
    throw error;
  }
}

// Function to get a donor's contribution to a campaign
async function getContribution(campaignId: number, donor: string): Promise<number> {
  try {
    const functionArgs: ClarityValue[] = [
      Cl.uint(campaignId),
      Cl.principal(donor),
    ];

    const response = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-contribution",
      functionArgs,
      network,
      senderAddress: donor,
    });

    // Log raw response for debugging
    console.log("Raw response:", response);
    const result = cvToJSON(response);
    console.log("JSON result:", JSON.stringify(result, null, 2));

    // Correctly access the amount field
    const amount = result.value.amount.value;
    console.log(`Contribution amount for campaign ${campaignId} by ${donor}: ${amount} sBTC`);
    return amount;
  } catch (error) {
    console.error("Error fetching contribution:", error);
    throw error;
  }
}

async function main() {
  const goal = 10;
  const duration = 2;
  const campaignId = 1;
  const donor = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const donorPrivateKey = senderPrivateKey;

  try {
    const createTxId = await createCampaign(goal, duration);
    console.log(`Campaign created with TX ID: ${createTxId}`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s

    const contributeTxId = await contribute(campaignId, 5, donorPrivateKey);
    console.log(`Contributed with TX ID: ${contributeTxId}`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s

    const contribution = await getContribution(campaignId, donor);
    console.log(`Fetched contribution: ${contribution} sBTC`);
  } catch (err) {
    console.error("Failed to execute main:", err);
  }
}

main().catch(console.error);