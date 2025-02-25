"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Cl,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from "@stacks/transactions";
import { STACKS_DEVNET } from "@stacks/network";
import Wallet from "../../../components/Wallet";
import { getCampaignIdFromTx } from "../../../../utils/transactions";
import { openContractCall } from "@stacks/connect";

// Add environment variables
const contractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME || "campaigns";
const sbtcContract = process.env.NEXT_PUBLIC_SBTC_CONTRACT || "sbtc";
const networkUrl =
  process.env.NEXT_PUBLIC_STACKS_API_URL || "http://localhost:20443";

// Create network configuration
const network = {
  ...STACKS_DEVNET,
  url: networkUrl,
};

type Campaign = {
  id: string;
  tx_id: string;
  project_name: string;
  project_description: string;
  funding_goal: number;
  deadline: Date;
  campaign_id?: number;
};

export default function InvestPage() {
  const params = useParams();
  const campaignId = parseInt(params.campaignId, 10);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(
          `/api/campaigns?id=${params.campaignId as string}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch campaign");
        }
        const data = await response.json();
        console.log("📊 Fetched Campaign Data:", {
          id: data.id,
          tx_id: data.tx_id,
          campaign_id: data.campaign_id || "Not set",
        });
        setCampaign(data);

        // If we have a transaction ID but no campaign ID, try to fetch it
        if (data.tx_id && !data.campaign_id) {
          console.log(
            "🔍 No campaign_id found, attempting to fetch from transaction..."
          );
          const campaignId = await getCampaignIdFromTx(data.tx_id);
          if (campaignId) {
            console.log("✅ Found campaign_id from transaction:", campaignId);
            const updatedCampaign = { ...data, campaign_id: campaignId };
            setCampaign(updatedCampaign);

            console.log("📝 Updating database with campaign_id...");
            // Optionally update the database with the new campaign ID
            const updateResponse = await fetch(`/api/campaigns/${data.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ campaign_id: campaignId }),
            });

            if (updateResponse.ok) {
              console.log("✅ Database updated successfully with campaign_id");
            } else {
              console.error("❌ Failed to update database with campaign_id");
            }
          } else {
            console.log("⚠️ Could not find campaign_id from transaction");
          }
        } else {
          console.log("ℹ️ Campaign already has campaign_id:", data.campaign_id);
        }
      } catch (error) {
        setError("Failed to load campaign details");
        console.error("❌ Error:", error);
      }
    };

    if (params.campaignId) {
      fetchCampaign();
    }
  }, [params.campaignId]);

  const handleInvest = async () => {
    if (!campaignId || isNaN(campaignId)) {
      setError("Invalid Campaign ID. Please refresh and try again.");
      return;
    }

    const amount = parseFloat(investmentAmount.trim());
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive investment amount.");
      return;
    }
    const contributionAmount = Math.round(amount * 1e8);
    if (!Number.isInteger(contributionAmount)) {
      setError("Invalid amount. Must be an integer in micro-units.");
      return;
    }

    try {
      const functionArgs = [
        Cl.uint(campaignId),
        Cl.uint(contributionAmount),
        Cl.principal(`${contractAddress}.${sbtcContract}`),
      ];

      console.log("📝 Sending transaction...");
      console.log("🔹 Arguments:", functionArgs);

      await openContractCall({
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: "contribute",
        functionArgs,
        network: { url: networkUrl },
        onFinish: async (data) => {
          console.log("✅ Transaction submitted:", data.txId);
          setTxId(data.txId);

          // Wait for transaction to be mined
          await new Promise((resolve) => setTimeout(resolve, 15000));

          try {
            const response = await fetch(
              `${networkUrl}/v2/transactions/${data.txId}`
            );
            if (!response.ok) {
              console.warn("Transaction status check failed, will retry later");
              return;
            }

            const txData = await response.json();
            if (txData.tx_status === "success") {
              console.log("✅ Transaction confirmed!");
            } else {
              console.warn("⚠️ Transaction status:", txData.tx_status);
            }
          } catch (error) {
            console.error("❌ Error checking transaction status:", error);
          }
        },
        onCancel: () => {
          console.log("Transaction canceled");
          setError("Transaction canceled by user");
        },
      });
    } catch (error) {
      console.error("❌ Transaction Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Invest in Campaign {campaignId}
      </h1>

      {campaign && (
        <div className="mb-4 text-sm text-gray-600">
          <div>Campaign Transaction ID: {campaign.tx_id}</div>
          {campaign.campaign_id ? (
            <div>Campaign ID: {campaign.campaign_id}</div>
          ) : (
            <div>Campaign ID: Not yet available</div>
          )}
        </div>
      )}

      {/* ✅ Include Wallet Connection */}
      <Wallet />

      <input
        type="number"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        placeholder="Enter sBTC amount"
        className="border rounded px-4 py-2 mt-4"
      />

      <button
        onClick={handleInvest}
        className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
      >
        Invest
      </button>

      {txId && (
        <p className="text-green-500 mt-4">Transaction Sent! TX ID: {txId}</p>
      )}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
}
