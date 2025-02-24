"use client";

import React, { useState, useEffect } from "react";
import { Bitcoin, Wallet, PlusCircle, MinusCircle, Calendar, DollarSign, Send } from "lucide-react";
import { AppConfig, UserSession, showConnect, openContractDeploy } from "@stacks/connect";
import { StacksNetwork } from "@stacks/network";

export default function CreateCampaign() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    fundingGoal: "",
    deadline: "",
    rewards: [{ description: "", amount: "" }],
  });

  // Configure app and user session
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  // Local testnet configuration (Clarinet)
  const localNetwork = {
    url: "http://localhost:20443/v2",
    fetchFn: fetch,
  } as StacksNetwork;

  // Check wallet connection on mount
  useEffect(() => {
    const detectWallet = async () => {
      if (window.LeatherProvider) {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const stxAddress = userData.profile.stxAddress.testnet; // Use testnet address
          setWalletAddress(stxAddress);
          setIsWalletConnected(true);
        }
      }
    };
    detectWallet();
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: "BitFund",
        icon: "https://example.com/icon.png", // Replace with your app's icon
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        const stxAddress = userData.profile.stxAddress.testnet;
        setWalletAddress(stxAddress);
        setIsWalletConnected(true);
        setError("");
      },
      onCancel: () => {
        setError("Connection canceled by user.");
      },
      userSession,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRewardChange = (index: number, field: "description" | "amount", value: string) => {
    const updatedRewards = [...formData.rewards];
    updatedRewards[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      rewards: updatedRewards,
    }));
  };

  const addReward = () => {
    setFormData((prevData) => ({
      ...prevData,
      rewards: [...prevData.rewards, { description: "", amount: "" }],
    }));
  };

  const removeReward = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      rewards: prevData.rewards.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected) {
      setError("Please connect your wallet before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Example contract code (replace with your campaign contract)
      const contractCode = `
        (define-data-var campaign-creator principal tx-sender)
        (define-data-var campaign-title (string-ascii 100) "${formData.projectName}")
        (define-data-var deadline uint u${Math.floor(new Date(formData.deadline).getTime() / 1000)})
        (define-data-var funding-goal uint u${Math.round(parseFloat(formData.fundingGoal) * 1000000)})
        (define-data-var total-raised uint u0)
        (define-map donations principal uint)
        (define-public (donate (amount uint))
          (begin
            (ok true)
          )
        )
      `;
      const contractName = `campaign-${Date.now()}`; // Unique name

      await openContractDeploy({
        contractName,
        codeBody: contractCode,
        network: localNetwork,
        appDetails: { name: "BitFund", icon: "https://example.com/icon.png" },
        onFinish: (data) => {
          setTxId(data.txId);
          setIsSubmitting(false);
          console.log("Contract deployed! TX ID:", data.txId);
        },
        onCancel: () => {
          setError("Deployment canceled by user.");
          setIsSubmitting(false);
        },
      });
    } catch (err) {
      console.error("Error deploying contract:", err);
      setError("Failed to create campaign. Please try again.");
      setIsSubmitting(false);
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
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-yellow-500 transition-colors">Home</a></li>
              <li><a href="/campaigns" className="hover:text-yellow-500 transition-colors">Campaigns</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Create a New Campaign</h1>

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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                required
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
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  step="0.000001"
                  min="0"
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
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
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
                    step="0.000001"
                    min="0"
                  />
                  <button type="button" onClick={() => removeReward(index)} className="text-red-500 hover:text-red-700">
                    <MinusCircle className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addReward}
                className="mt-2 text-yellow-500 hover:text-yellow-700 flex items-center"
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
                  Connect Wallet
                </button>
              </div>
            )}

            {error && <div className="mb-6 text-red-500">{error}</div>}
            {txId && <div className="mb-6 text-green-500">Contract Deployed! TX ID: {txId}</div>}

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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">How It Works</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Start a Project</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Explore Projects</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Twitter</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Telegram</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-500 transition-colors">Discord</a></li>
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