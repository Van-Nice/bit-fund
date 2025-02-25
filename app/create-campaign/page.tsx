"use client";

import React, { useState, useEffect } from "react";
import { Bitcoin, Wallet, PlusCircle, MinusCircle, Calendar, DollarSign, Send } from "lucide-react";
import { openContractDeploy } from "@stacks/connect";

// Extend Window interface for LeatherProvider
declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
    };
  }
}

export default function CreateCampaign() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    fundingGoal: "",
    deadline: "",
    rewards: [{ description: "", amount: "" }],
  });

  console.log("Component initialized with initial state");

  // Check wallet connection on mount
  useEffect(() => {
    console.log("useEffect triggered for wallet detection");
    const detectWallet = async () => {
      console.debug("Starting wallet detection");
      if (window.LeatherProvider) {
        console.info("LeatherProvider detected in window object");
        try {
          console.log("Requesting wallet addresses");
          const response = await window.LeatherProvider.request('getAddresses');
          console.debug("Wallet response received:", response);
          if (response.result?.addresses) {
            const stxAddress = response.result.addresses[0].address;
            console.info("Wallet address retrieved:", stxAddress);
            setWalletAddress(stxAddress);
            setIsWalletConnected(true);
            console.debug("Wallet state updated - connected:", true, "address:", stxAddress);
          } else {
            console.log("No addresses found in wallet response");
          }
        } catch (err) {
          console.error("Wallet detection failed:", err);
        }
      } else {
        console.log("LeatherProvider not found in window object");
      }
    };
    detectWallet();
  }, []);

  const connectWallet = async () => {
    console.log("connectWallet function called");
    if (window.LeatherProvider) {
      console.info("Attempting wallet connection");
      try {
        console.debug("Sending getAddresses request to wallet");
        const response = await window.LeatherProvider.request('getAddresses');
        console.debug("Wallet connection response:", response);
        if (response.result?.addresses) {
          const stxAddress = response.result.addresses[0].address;
          console.info("Successfully connected wallet with address:", stxAddress);
          setWalletAddress(stxAddress);
          setIsWalletConnected(true);
          setError("");
          console.debug("Wallet state updated after connection");
        } else {
          console.log("No addresses returned from wallet");
          setError("No addresses found in wallet response");
        }
      } catch (err) {
        console.error("Wallet connection error:", err);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      console.log("Leather wallet extension not detected");
      setError("Leather wallet not detected. Please install the Leather wallet extension.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log("handleInputChange triggered");
    const { name, value } = e.target;
    console.debug("Input changed - name:", name, "value:", value);
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      console.debug("New form data:", newData);
      return newData;
    });
  };

  const handleRewardChange = (index: number, field: "description" | "amount", value: string) => {
    console.log("handleRewardChange triggered", { index, field, value });
    const updatedRewards = [...formData.rewards];
    updatedRewards[index][field] = value;
    console.debug("Updated rewards array:", updatedRewards);
    setFormData((prevData) => {
      const newData = { ...prevData, rewards: updatedRewards };
      console.debug("New form data with updated rewards:", newData);
      return newData;
    });
  };

  const addReward = () => {
    console.log("addReward function called");
    setFormData((prevData) => {
      const newRewards = [...prevData.rewards, { description: "", amount: "" }];
      console.debug("Added new reward, new rewards array:", newRewards);
      const newData = { ...prevData, rewards: newRewards };
      console.debug("New form data after adding reward:", newData);
      return newData;
    });
  };

  const removeReward = (index: number) => {
    console.log("removeReward function called with index:", index);
    setFormData((prevData) => {
      const newRewards = prevData.rewards.filter((_, i) => i !== index);
      console.debug("Removed reward at index", index, "new rewards array:", newRewards);
      const newData = { ...prevData, rewards: newRewards };
      console.debug("New form data after removing reward:", newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    if (!isWalletConnected) {
      console.log("Submission blocked: Wallet not connected");
      setError("Please connect your Leather wallet before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    console.info("Starting contract deployment process...");
    console.debug("Form data being submitted:", formData);

    let deploymentStatus: "success" | "canceled" | "error" | null = null; // Track the outcome

    try {
      const contractCode = `
      (define-public (write-message (message (string-utf8 500)))
          (begin
              (print message)
              (ok "Message printed")
          )
      )
    `;
      const contractName = `write-message-${Date.now()}`;
      console.debug("Generated contract name:", contractName);
      console.debug("Contract code to deploy:", contractCode);

      console.log("Initiating contract deployment with openContractDeploy...");
      openContractDeploy({
        contractName,
        codeBody: contractCode,
        appDetails: {name: "BitFund", icon: "https://example.com/icon.png"},
        onFinish: (data) => {
          console.info("Contract deployment finished successfully");
          console.debug("Deployment data:", data);
          console.log("Transaction ID:", data.txId);
          const deployedContractAddress = `${walletAddress}.${contractName}`;
          setContractAddress(deployedContractAddress);
          console.debug("Deployed contract address set:", deployedContractAddress);
          setTxId(data.txId);
          setIsSubmitting(false);
          deploymentStatus = "success"; // Set status to success
        },
        onCancel: () => {
          console.log("Contract deployment canceled by user");
          setError("Deployment canceled by user.");
          setIsSubmitting(false);
          deploymentStatus = "canceled"; // Set status to canceled
        },
      });

      console.info("openContractDeploy promise resolved");
      // Now check the outcome
      if (deploymentStatus === "success") {
        console.log("Deployment was successful!");
      } else if (deploymentStatus === "canceled") {
        console.log("Deployment was canceled by the user.");
      } else {
        console.warn("Unexpected state: deploymentStatus not set.");
      }

    } catch (err) {
      console.error("Error during contract deployment:", err);
      setError("Failed to deploy contract. Please try again.");
      setIsSubmitting(false);
      deploymentStatus = "error"; // Set status to error
      console.log("Deployment failed with error.");
    }

    // Optional: Final status check outside the try-catch
    console.debug("Final deployment status:", deploymentStatus);
  };

  console.log("Rendering component with current state", {
    isWalletConnected,
    walletAddress,
    isSubmitting,
    error,
    txId,
    contractAddress,
    formData,
  });

  return (
    <div className="min-h-screen flex flex-col">
      {console.debug("Rendering header")}
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

      {console.debug("Rendering main content")}
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Deploy Simple Contract</h1>

          {console.debug("Rendering form")}
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
              />
            </div>

            <div className="mb-6">
              <label htmlFor="fundingGoal" className="block text-gray-700 text-sm font-bold mb-2">
                Funding Goal (STX)
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
                />
              </div>
            </div>

            {console.debug("Rendering rewards section")}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rewards (Optional)</label>
              {formData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center mb-2">
                  {console.debug("Rendering reward input", { index, reward })}
                  <input
                    type="text"
                    placeholder="Reward description"
                    value={reward.description}
                    onChange={(e) => handleRewardChange(index, "description", e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  />
                  <input
                    type="number"
                    placeholder="Amount (STX)"
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
                {console.debug("Rendering connect wallet button")}
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
                {console.debug("Rendering connected address:", walletAddress)}
                Connected Address: {walletAddress}
              </div>
            )}
            {error && (
              <div className="mb-6 text-red-500">
                {console.debug("Rendering error message:", error)}
                {error}
              </div>
            )}
            {txId && (
              <div className="mb-6 text-green-500">
                {console.debug("Rendering success message", { txId, contractAddress })}
                Contract Deployed! TX ID: {txId}
                {contractAddress && <div>Contract Address: {contractAddress}</div>}
              </div>
            )}

            {console.debug("Rendering submit button", { isWalletConnected, isSubmitting })}
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
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Deploy Contract
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {console.debug("Rendering footer")}
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