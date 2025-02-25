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
const orchestratorUrl = "http://localhost:20445"; // Default orchestrator port

// Define the interface for campaign details
interface CampaignDetails {
  creator: string;
  goal: number;
  endBlockHeight: number;
  totalFunded: number;
  funded: boolean;
}

async function getCampaign(campaignId: number): Promise<CampaignDetails | null> {
  try {
    const functionArgs: ClarityValue[] = [Cl.uint(campaignId)];
    const response = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-campaign",
      functionArgs,
      network,
      senderAddress: contractAddress,
    });

    console.log("Raw response:", response);
    const result = cvToJSON(response);
    console.log("JSON result:", JSON.stringify(result, null, 2));

    // Check if the campaign exists (type includes "optional" and has a "value")
    if (result.value && typeof result.value === "object") {
      const campaign = result.value.value; // Access the inner tuple
      return {
        creator: campaign.creator.value,
        goal: parseInt(campaign.goal.value),
        endBlockHeight: parseInt(campaign["end-block-height"].value),
        totalFunded: parseInt(campaign["total-funded"].value),
        funded: campaign.funded.value === true, // Boolean value directly
      };
    } else {
      console.log(`Campaign ${campaignId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw error;
  }
}

async function createCampaign(goal: number, duration: number): Promise<string> {
  try {
    const functionArgs = [Cl.uint(goal), Cl.uint(duration)];
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
      throw new Error(`Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`);
    }
    const txId = broadcastResponse.txid;
    console.log(`Transaction ID: ${txId}`);
    return txId;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

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
      throw new Error(`Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`);
    }
    const txId = broadcastResponse.txid;
    console.log(`Contribution TX ID: ${txId}`);
    return txId;
  } catch (error) {
    console.error("Error contributing to campaign:", error);
    throw error;
  }
}

async function getContribution(campaignId: number, donor: string): Promise<number> {
  try {
    const functionArgs: ClarityValue[] = [Cl.uint(campaignId), Cl.principal(donor)];
    const response = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-contribution",
      functionArgs,
      network,
      senderAddress: donor,
    });
    console.log("Raw response:", response);
    const result = cvToJSON(response);
    console.log("JSON result:", JSON.stringify(result, null, 2));
    const amount = result.value.amount.value;
    console.log(`Contribution amount for campaign ${campaignId} by ${donor}: ${amount} sBTC`);
    return amount;
  } catch (error) {
    console.error("Error fetching contribution:", error);
    throw error;
  }
}

// async function withdrawFunds(campaignId: number, creatorPrivateKey: string): Promise<string> {
//   try {
//     const functionArgs: ClarityValue[] = [
//       Cl.uint(campaignId),
//       contractPrincipalCV(mockSbtcContractAddress, mockSbtcContractName),
//     ];
//     const txOptions = {
//       contractAddress,
//       contractName,
//       functionName: "withdraw-funds",
//       functionArgs,
//       senderKey: creatorPrivateKey,
//       network,
//       anchorMode: AnchorMode.Any,
//       postConditionMode: PostConditionMode.Deny,
//       validateWithAbi: false,
//     };
//     const transaction = await makeContractCall(txOptions);
//     const serializedTx = transaction.serialize();
//     console.log("Serialized TX:", Buffer.from(serializedTx).toString("hex"));
//     const broadcastResponse = await broadcastTransaction({ transaction, network });
//     if ("error" in broadcastResponse) {
//       throw new Error(`Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`);
//     }
//     const txId = broadcastResponse.txid;
//     console.log(`Withdraw TX ID: ${txId}`);

//     // Wait and check result
//     await new Promise(resolve => setTimeout(resolve, 10000));
//     const response = await fetch(`http://localhost:20443/v2/transactions/${txId}`);
//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`API error: ${response.status} - ${text}`);
//     }
//     const result = await response.json();
//     console.log("Transaction result:", result);
//     if (result.tx_status !== "success" || result.contract_call.function_result !== "(ok true)") {
//       throw new Error(`Withdraw failed: ${result.contract_call.function_result}`);
//     }
//     return txId;
//   } catch (error) {
//     console.error("Error withdrawing funds:", error);
//     throw error;
//   }
// }

async function refund(campaignId: number, donorPrivateKey: string): Promise<string> {
  try {
    // Construct the function arguments for the refund function
    const functionArgs: ClarityValue[] = [
      Cl.uint(campaignId),
      contractPrincipalCV(mockSbtcContractAddress, mockSbtcContractName),
    ];

    // Create transaction options for makeContractCall
    const txOptions = {
      contractAddress,
      contractName,
      functionName: "refund",
      functionArgs,
      senderKey: donorPrivateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      validateWithAbi: false,
    };

    // Create the transaction
    const transaction = await makeContractCall(txOptions);

    // Serialize and log the transaction
    const serializedTx = transaction.serialize();
    console.log("Serialized TX:", Buffer.from(serializedTx).toString("hex"));

    // Broadcast the transaction
    const broadcastResponse = await broadcastTransaction({ transaction, network });
    if ("error" in broadcastResponse) {
      throw new Error(`Broadcast failed: ${broadcastResponse.error} - ${broadcastResponse.reason}`);
    }

    const txId = broadcastResponse.txid;
    console.log(`Refund TX ID: ${txId}`);

    // Wait for transaction confirmation (10 seconds delay)
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Fetch transaction result
    const response = await fetch(`http://localhost:20443/v2/transactions/${txId}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    console.log("Transaction result:", result);

    // Check if the transaction was successful
    if (result.tx_status !== "success" || result.contract_call.function_result !== "(ok true)") {
      throw new Error(`Refund failed: ${result.contract_call.function_result}`);
    }

    return txId;
  } catch (error) {
    console.error("Error refunding contribution:", error);
    throw error;
  }
}

// async function skipBlocks(numBlocks: number): Promise<void> {
//   try {
//     const response = await fetch(`${orchestratorUrl}/mine_blocks`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ num_blocks: numBlocks }),
//     });
//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Failed to skip blocks: ${response.status} - ${text}`);
//     }
//     const result = await response.json();
//     console.log(`Mined ${numBlocks} blocks:`, result);
//   } catch (error) {
//     console.error("Error skipping blocks:", error);
//     throw error;
//   }
// }

async function main() {
  const goal = 20; // Set a higher goal to ensure it's not met
  const duration = 1; // Campaign ends after 1 block
  const campaignId = 10;
  const donor = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const donorPrivateKey = senderPrivateKey;

  try {
    // Create a campaign
    const createTxId = await createCampaign(goal, duration);
    console.log(`Campaign created with TX ID: ${createTxId}`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Contribute to the campaign
    const contributeTxId = await contribute(campaignId, 10, donorPrivateKey);
    console.log(`Contributed with TX ID: ${contributeTxId}`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Fetch contribution amount
    const contribution = await getContribution(campaignId, donor);
    console.log(`Fetched contribution: ${contribution} sBTC`);

    const campaignDetails = await getCampaign(campaignId);
    if (campaignDetails) {
      console.log("Campaign Details:", campaignDetails);
    } else {
      console.log("Campaign not found.");
    }


  } catch (err) {
    console.error("Failed to execute main:", err);
  }
  
}

main().catch(console.error);