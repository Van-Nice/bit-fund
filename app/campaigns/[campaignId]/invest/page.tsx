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

// ✅ Define Stacks Contract Variables
const network = {
  ...STACKS_DEVNET,
  url: "http://localhost:3999", // Adjust based on your Devnet setup
};
const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = "campaigns";
const sbtcContract = "mock-sbtc";
const senderPrivateKey = "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";

export default function InvestPage() {
  const params = useParams();
  let campaignId = parseInt(params?.campaignId, 10);

  // ✅ Hardcode a test Campaign ID if undefined
  if (isNaN(campaignId)) {
    console.warn("⚠️ Warning: Invalid campaign ID. Using default campaign ID: 1");
    campaignId = 1; // Set a default campaign ID for testing
  }

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ✅ Debugging campaign ID on page load
  useEffect(() => {
    console.log("✅ Current Campaign ID:", campaignId);
  }, [campaignId]);

  const handleInvest = async () => {
    // ✅ Convert investment amount to micro-units (integer)
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

    console.log("🔍 Debugging Transaction:");
    console.log("✔️ Campaign ID:", campaignId);
    console.log("✔️ Contribution Amount (micro-units):", contributionAmount);

    try {
      const functionArgs = [
        Cl.uint(campaignId), // ✅ Ensure it's correctly passed
        Cl.uint(contributionAmount),
        Cl.principal(`${contractAddress}.${sbtcContract}`),
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Invest in Campaign {campaignId}</h1>

      <input
        type="number"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        placeholder="Enter sBTC amount"
        className="border border-gray-300 px-4 py-2 rounded-lg mb-4"
      />

      <button
        onClick={handleInvest}
        className="bg-yellow-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition"
      >
        Invest
      </button>

      {txId && (
        <p className="mt-4 text-green-500">
          ✅ Transaction Sent! TX ID: <br />
          <a
            href={`http://localhost:3999/extended/v1/tx/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {txId}
          </a>
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-500">
          ❌ Error: {error}
        </p>
      )}
    </div>
  );
}
