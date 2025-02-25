/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Bitcoin, Wallet, PlusCircle, MinusCircle, Calendar, DollarSign, Send } from "lucide-react";
import Link from "next/link";
import { createCampaign } from "@/utils/createCampaign";

declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
    };
  }
}

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

interface BalanceResponse {
  fungible_tokens: {
    [key: string]: {
      balance: string;
    };
  };
}

export default function CreateCampaign() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [sbtcBalance, setSbtcBalance] = useState<number | null>(null);

  const STACKS_API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || "http://localhost:20443";
  const SBTC_CONTRACT = process.env.NEXT_PUBLIC_SBTC_CONTRACT || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc::sbtc";

  useEffect(() => {
    const detectWallet = async () => {
      if (window.LeatherProvider) {
        try {
          const response = await window.LeatherProvider.request("getAddresses");
          const addresses = response?.result?.addresses;
          const stxAddress = addresses?.find((addr: { symbol: string; }) => addr.symbol === "STX")?.address;
          if (stxAddress) {
            setWalletAddress(stxAddress);
            setIsWalletConnected(true);
          }
        } catch (err) {
          // Silently fail if wallet isn’t connected yet
        }
      }
    };
    detectWallet();
  }, []);

  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      getSbtcBalance(walletAddress)
        .then((balance) => setSbtcBalance(balance))
        .catch((err) => console.error("Failed to fetch sBTC balance:", err));
    }
  }, [isWalletConnected, walletAddress]);

  async function getSbtcBalance(address: string): Promise<number> {
    console.log("Fetching sBTC balance for:", address);
    const url = `${STACKS_API_URL}/extended/v1/address/${address}/balances`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`No balance data found for ${address}: HTTP ${response.status}`);
        return 0;
      }
      const data: BalanceResponse = await response.json();
      const sbtcBalance = parseInt(data.fungible_tokens[SBTC_CONTRACT]?.balance || "0", 10);
      return sbtcBalance;
    } catch (err) {
      console.error("Error fetching sBTC balance:", err);
      return 0;
    }
  }

  const connectWallet = async () => {
    if (!window.LeatherProvider) {
      setError("Leather wallet not detected. Please install the Leather wallet extension.");
      return;
    }
    try {
      const response = await window.LeatherProvider.request("getAddresses");
      const addresses = response?.result?.addresses;
      const stxAddress = addresses?.find((addr: { symbol: string; }) => addr.symbol === "STX")?.address;
      if (stxAddress) {
        setWalletAddress(stxAddress);
        setIsWalletConnected(true);
        setError("");
      } else {
        setError("No Stacks address found in wallet response");
      }
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    projectDescription: "",
    fundingGoal: "",
    deadline: "",
    rewards: [{ description: "", amount: "" }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRewardChange = (index: number, field: "description" | "amount", value: string) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards[index][field] = value;
    setFormData((prevData) => ({ ...prevData, rewards: updatedRewards }));
  };

  const addReward = () => {
    setFormData((prevData) => ({
      ...prevData,
      rewards: [...prevData.rewards, { description: "", amount: "" }],
    }));
  };

  const removeReward = (index: number) => {
    if (formData.rewards.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        rewards: prevData.rewards.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected) {
      setError("Please connect your Leather wallet before submitting.");
      return;
    }

    const fundingGoal = parseFloat(formData.fundingGoal);
    if (isNaN(fundingGoal) || fundingGoal <= 0) {
      setError("Please enter a valid funding goal greater than 0.");
      return;
    }

    const deadlineTime = new Date(formData.deadline).getTime();
    const currentTime = new Date().getTime();
    if (isNaN(deadlineTime) || deadlineTime <= currentTime) {
      setError("Please select a valid deadline in the future.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const timeDifference = (deadlineTime - currentTime) / 1000;
      const averageBlockTime = 600;
      const duration = Math.ceil(timeDifference / averageBlockTime);
      const goalInMicroUnits = Math.floor(fundingGoal * 1e8);
      const txIdResult = await createCampaign(goalInMicroUnits, duration);
      setTxId(txIdResult);
      console.log(`Campaign created! Transaction ID: ${txIdResult}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Failed to create campaign: ${errorMessage}`);
      console.error("Failed to create campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold">BitFund</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link href="/campaigns" className="hover:text-yellow-500 transition-colors">Campaigns</Link></li>
              <li><Link href="#" className="hover:text-yellow-500 transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Create Campaign</h1>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
            <div className="mb-6">
              <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="projectDescription" className="block text-gray-700 text-sm font-bold mb-2">
                Project Description
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="fundingGoal" className="block text-gray-700 text-sm font-bold mb-2">
                Funding Goal (sBTC)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="fundingGoal"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  step="0.00000001"
                  min="0.00000001"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">
                Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rewards (Optional)</label>
              {formData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Reward description"
                    value={reward.description}
                    onChange={(e) => handleRewardChange(index, "description", e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  />
                  <input
                    type="number"
                    placeholder="Amount (sBTC)"
                    value={reward.amount}
                    onChange={(e) => handleRewardChange(index, "amount", e.target.value)}
                    className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    step="0.00000001"
                    min="0"
                  />
                  {formData.rewards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReward(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove reward"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addReward}
                className="mt-2 text-yellow-500 hover:text-yellow-700 flex items-center"
                aria-label="Add reward"
              >
                <PlusCircle className="h-5 w-5 mr-1" />
                Add Reward
              </button>
            </div>

            {!isWalletConnected && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={connectWallet}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Leather Wallet
                </button>
              </div>
            )}

            {isWalletConnected && (
              <div className="mb-6 text-gray-700">
                <p>Connected Address: {walletAddress}</p>
                {sbtcBalance !== null && (
                  <p className="mt-2">sBTC Balance: {(sbtcBalance / 1e8).toFixed(8)} sBTC</p>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 text-red-500" role="alert">
                {error}
              </div>
            )}

            {txId && (
              <div className="mb-6 text-green-500" role="status">
                Campaign Created! Transaction ID: {txId}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={!isWalletConnected || isSubmitting}
                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
                  (!isWalletConnected || isSubmitting) && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Create Campaign
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About BitFund</h3>
              <p className="text-sm text-gray-400">Empowering innovators through Bitcoin-based crowdfunding.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">How It Works</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Start a Project</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Explore Projects</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Twitter</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Telegram</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-yellow-500 transition-colors">Discord</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} BitFund. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}