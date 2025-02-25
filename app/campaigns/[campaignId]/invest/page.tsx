"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Cl, makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode } from "@stacks/transactions";
import Wallet from "../../../components/Wallet";
 // ✅ Import Wallet component

export default function InvestPage() {
  const params = useParams();
  const campaignId = parseInt(params.campaignId, 10); // Get campaign ID from URL
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState("");

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
    const contributionAmount = Math.round(amount * 1e8); // Convert sBTC to micro-units
    if (!Number.isInteger(contributionAmount)) {
      setError("Invalid amount. Must be an integer in micro-units.");
      return;
    }
    
    try {
      const functionArgs = [
        Cl.uint(campaignId),
        Cl.uint(contributionAmount),
        Cl.principal(`${contractAddress}.${sbtcContract}`)
      ];

      console.log("📝 Sending transaction...");
      console.log("🔹 Arguments:", functionArgs);

      const txOptions = {
        contractAddress,
        contractName,
        functionName: "contribute",
        functionArgs,
        senderKey: senderPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        validateWithAbi: false,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network });

      if ("error" in broadcastResponse) {
        console.error("❌ Transaction Failed: ", broadcastResponse);
        throw new Error(broadcastResponse.error);
      }

      console.log("✅ Transaction Successful! TX ID:", broadcastResponse.txid);
      setTxId(broadcastResponse.txid);
    } catch (error) {
      console.error("❌ Transaction Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Invest in Campaign {campaignId}</h1>

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

      {txId && <p className="text-green-500 mt-4">Transaction Sent! TX ID: {txId}</p>}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
}
