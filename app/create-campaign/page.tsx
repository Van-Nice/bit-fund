/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

const network = {
  ...STACKS_DEVNET,
  url: "http://localhost:20443",
};
const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = "campaigns";
const senderPrivateKey =
  "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";

interface Reward {
  description: string;
  amount: string;
}

interface FormData {
  projectName: string;
  projectDescription: string;
  fundingGoal: string;
  deadline: string;
  rewards: Reward[];
}

export default function CreateCampaign() {
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    projectDescription: "",
    fundingGoal: "",
    deadline: "",
    rewards: [{ description: "", amount: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txId, setTxId] = useState("");
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRewardChange = (
    index: number,
    field: "description" | "amount",
    value: string
  ) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards[index][field] = value;
    setFormData((prev) => ({ ...prev, rewards: updatedRewards }));
  };

  const addReward = () => {
    setFormData((prev) => ({
      ...prev,
      rewards: [...prev.rewards, { description: "", amount: "" }],
    }));
  };

  const removeReward = (index: number) => {
    if (formData.rewards.length > 1) {
      setFormData((prev) => ({
        ...prev,
        rewards: prev.rewards.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fundingGoal = parseFloat(formData.fundingGoal);
    if (!fundingGoal || fundingGoal <= 0) {
      setErrorMessage("Funding goal must be a positive number.");
      return;
    }

    const deadlineTime = new Date(formData.deadline).getTime();
    const currentTime = Date.now();
    if (deadlineTime <= currentTime) {
      setErrorMessage("Deadline must be in the future.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const timeDifference = (deadlineTime - currentTime) / 1000;
    const duration = Math.ceil(timeDifference / 600);
    const goalInMicroUnits = Math.floor(fundingGoal * 1e8);

    try {
      // Blockchain transaction
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

      const txIdResult = broadcastResponse.txid;
      setTxId(txIdResult);

      // Wait for the transaction to be mined (Devnet ~10s/block)
      await new Promise((resolve) => setTimeout(resolve, 15000));

      let campaignIdResult: number | undefined;
      try {
        // Fetch transaction details to get the campaign ID (optional)
        const txResponse = await fetch(
          `http://localhost:20443/v2/transactions/${txIdResult}`
        );

        if (txResponse.ok) {
          const txData = await txResponse.json();
          if (
            txData.tx_status === "success" &&
            txData.contract_call?.function_result
          ) {
            const result = txData.contract_call.function_result;
            const campaignIdMatch = result.match(/\(ok u(\d+)\)/);
            if (campaignIdMatch) {
              campaignIdResult = parseInt(campaignIdMatch[1], 10);
              setCampaignId(campaignIdResult);
              console.log(`Campaign ID: ${campaignIdResult}`);
            }
          }
        } else {
          console.warn(
            "Failed to fetch transaction details, continuing without campaign ID"
          );
        }
      } catch (error) {
        console.warn("Error fetching transaction details:", error);
        // Continue execution even if fetching transaction details fails
      }

      // Continue with database submission regardless of transaction details fetch
      const campaignData = {
        tx_id: txIdResult,
        project_name: formData.projectName,
        project_description: formData.projectDescription,
        funding_goal: goalInMicroUnits,
        deadline: new Date(deadlineTime).toISOString(),
        campaign_id: campaignIdResult,
      };

      // Add debugging before the API call
      console.log("Sending to API:", {
        data: campaignData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Send data to the API route
      const apiResponse = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(
          errorData.error || "Failed to save campaign to database"
        );
      }

      const apiData = await apiResponse.json();
      console.log("Campaign saved to database:", apiData);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Create Campaign</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-8"
          >
            <div className="mb-6">
              <label
                htmlFor="projectName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="projectDescription"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Project Description
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 h-32"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="fundingGoal"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
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
              <label
                htmlFor="deadline"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
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
                {campaignId !== null && ` | Campaign ID: ${campaignId}`}
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 text-red-500">{errorMessage}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-yellow-500 text-white font-bold py-2 px-4 rounded ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-600"
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
