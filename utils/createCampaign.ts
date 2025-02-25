// /utils/createCampaign.ts
import { openContractCall } from "@stacks/connect";
import { Cl } from "@stacks/transactions";

export async function createCampaign(goalInMicroUnits: number, duration: number): Promise<string> {
  if (!window.LeatherProvider) {
    throw new Error("Leather wallet not detected. Please install and connect it.");
  }

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || "campaigns";
  const NETWORK_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || "http://localhost:20443";

  const functionArgs = [Cl.uint(goalInMicroUnits), Cl.uint(duration)];

  return new Promise((resolve, reject) => {
    openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "create-campaign",
      functionArgs,
      network: { url: NETWORK_URL },
      onFinish: (data) => {
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error("Transaction canceled by user."));
      },
    });
  });
}