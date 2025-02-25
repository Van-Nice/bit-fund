import { STACKS_DEVNET } from "@stacks/network";

export async function getCampaignIdFromTx(txId: string): Promise<number | null> {
  try {
    const networkUrl = process.env.NEXT_PUBLIC_STACKS_API_URL || "http://localhost:20443";
    const response = await fetch(`${networkUrl}/v2/transactions/${txId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transaction details');
    }

    const txData = await response.json();
    
    if (
      txData.tx_status === "success" &&
      txData.contract_call?.function_result
    ) {
      const result = txData.contract_call.function_result;
      const campaignIdMatch = result.match(/\(ok u(\d+)\)/);
      if (campaignIdMatch) {
        return parseInt(campaignIdMatch[1], 10);
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }
}