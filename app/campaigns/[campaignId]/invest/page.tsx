"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { makeContractCall, broadcastTransaction, Cl, AnchorMode, PostConditionMode } from "@stacks/transactions";
import { STACKS_DEVNET } from "@stacks/network";
import { Bitcoin, AlertCircle, CheckCircle2 } from "lucide-react";

// ✅ Devnet Config
const network = {
  ...STACKS_DEVNET,
  url: process.env.NEXT_PUBLIC_STACKS_NODE_URL || "http://localhost:3999",
};

// ✅ Ensure contract details are properly loaded
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = process.env.NEXT_PUBLIC_CONTRACT_NAME || "campaigns";
const sbtcContract = process.env.NEXT_PUBLIC_SBTC_CONTRACT || "mock-sbtc";
const senderPrivateKey = process.env.NEXT_PUBLIC_SENDER_PRIVATE_KEY || "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601"; // ✅ HARDCODED PRIVATE KEY

export default function InvestPage() {
  const { campaignId } = useParams();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [randomCampaignId, setRandomCampaignId] = useState<number | null>(null);

  // ✅ Generate a Random Campaign ID (1-5) when the page loads
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    console.log("📌 Random Campaign ID:", randomId);
    setRandomCampaignId(randomId);
  }, []);

  // ✅ Handle Investment (Calls Contribute Function)
  const handleInvest = async () => {
    if (randomCampaignId === null) {
      setError("Campaign ID not assigned. Please refresh and try again.");
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
      // ✅ Use the generated random campaign ID
      const functionArgs = [
        Cl.uint(randomCampaignId),
        Cl.uint(contributionAmount),
        Cl.principal(`${contractAddress}.${sbtcContract}`),
      ];

      console.log("📝 Sending Contribution Transaction...", functionArgs);

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
        throw new Error(broadcastResponse.error);
      }

      setTxId(broadcastResponse.txid);
      console.log("✅ Contribution successful! TX ID:", broadcastResponse.txid);
      setIsConfirmed(true);
    } catch (error) {
      console.error("❌ Transaction Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold">BitFund</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">
            Invest in Campaign {randomCampaignId ?? "Loading..."}
          </h1>

          {!isConfirmed ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Investment Details</h2>
              <p className="text-gray-600">Enter the amount of sBTC you want to invest.</p>

              <div className="mt-4">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter sBTC amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={handleInvest}
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md font-semibold hover:bg-yellow-600 transition-colors"
              >
                Confirm Investment
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Investment Confirmed!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for investing {investmentAmount} sBTC in Campaign {randomCampaignId}.
                </p>
                <p className="text-gray-500">Transaction ID: {txId}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
