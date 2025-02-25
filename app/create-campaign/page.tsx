"use client";

import React, { useState } from "react";
import {
  makeContractCall,
  broadcastTransaction,
  Cl,
  AnchorMode,
  PostConditionMode,
} from "@stacks/transactions";
import { STACKS_DEVNET } from "@stacks/network";

// Network and contract configuration
const network = {
  ...STACKS_DEVNET,
  url: "http://localhost:20443",
};
const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = "campaigns";
const senderPrivateKey =
  "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";

// Simple form data interface
interface FormData {
  fundingGoal: string;
  deadline: string;
}

export default function CreateCampaign() {
  const [formData, setFormData] = useState<FormData>({
    fundingGoal: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txId, setTxId] = useState("");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the campaign creation transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fundingGoal = parseFloat(formData.fundingGoal);
    if (!fundingGoal || fundingGoal <= 0) return;

    const deadlineTime = new Date(formData.deadline).getTime();
    const currentTime = Date.now();
    if (deadlineTime <= currentTime) return;

    setIsSubmitting(true);

    const timeDifference = (deadlineTime - currentTime) / 1000;
    const duration = Math.ceil(timeDifference / 600); // Assuming 10-minute blocks
    const goalInMicroUnits = Math.floor(fundingGoal * 1e8); // sBTC uses 8 decimals

    try {
      const functionArgs = [Cl.uint(goalInMicroUnits), Cl.uint(duration)];
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
      const broadcastResponse = await broadcastTransaction({
        transaction,
        network,
      });

      if ("error" in broadcastResponse) {
        throw new Error(broadcastResponse.error);
      }

      setTxId(broadcastResponse.txid);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Create Campaign</h1>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
            <div className="mb-6">
              <label htmlFor="fundingGoal" className="block text-gray-700 text-sm font-bold mb-2">
                Funding Goal (sBTC)
              </label>
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                step="0.00000001"
                min="0.00000001"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>

            {txId && (
              <div className="mb-6 text-green-500">
                Campaign Created! TX ID: {txId}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-yellow-500 text-white font-bold py-2 px-4 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}