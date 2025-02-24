"use client";
import React, { useState, useEffect } from "react";
import { Bitcoin, Wallet, Send, AlertCircle, CheckCircle } from "lucide-react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { openContractCall } from "@stacks/connect";
import {
  AnchorMode,
  PostConditionMode,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  uintCV,
  StacksTestnet,
} from "@stacks/transactions";

export default function WalletConnection() {
  const [isWalletDetected, setIsWalletDetected] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [error, setError] = useState("");

  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  useEffect(() => {
    const detectWallet = async () => {
      if (window.LeatherProvider) {
        setIsWalletDetected(true);
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const stxAddress = userData.profile.stxAddress.testnet; // Updated to testnet
          setWalletAddress(stxAddress);
          setIsWalletConnected(true);
        }
      } else {
        setIsWalletDetected(false);
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
        const stxAddress = userData.profile.stxAddress.testnet; // Updated to testnet
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

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!transactionAmount || isNaN(parseFloat(transactionAmount)) || parseFloat(transactionAmount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setTransactionStatus("Investing sBTC...");
    setError("");
    try {
      const amountInSmallestUnit = Math.floor(parseFloat(transactionAmount) * 100000000);
      const assetInfo = "ST123.sbtc-token::sbtc"; // Replace with actual testnet sBTC token identifier
      const txOptions = {
        network: new StacksTestnet(), // Updated to StacksTestnet
        anchorMode: AnchorMode.Any,
        contractAddress: "ST1234567890ABCDEF", // Replace with actual testnet crowdfunding contract address
        contractName: "crowdfunding",
        functionName: "invest",
        functionArgs: [uintCV(amountInSmallestUnit)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardFungiblePostCondition(
            walletAddress,
            FungibleConditionCode.Equal,
            uintCV(amountInSmallestUnit),
            assetInfo
          ),
        ],
        onFinish: (data) => {
          setTransactionStatus(`Investment successful! TX ID: ${data.txId}`);
          setTransactionAmount("");
        },
      };
      await openContractCall(txOptions);
    } catch (err) {
      setError("Transaction failed: " + err.message);
      setTransactionStatus("");
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
          <h1 className="text-3xl font-bold mb-8">Leather Wallet Connection</h1>

          <div className="bg-white shadow-md rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Wallet Status</h2>
            {isWalletDetected ? (
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Leather wallet detected</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600 mb-4">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Leather wallet not detected. Please install the Leather wallet extension.</span>
              </div>
            )}

            {!isWalletConnected ? (
              <button
                onClick={connectWallet}
                disabled={!isWalletDetected}
                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
                  !isWalletDetected && "opacity-50 cursor-not-allowed"
                }`}
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </button>
            ) : (
              <div className="text-green-600">
                <p className="font-semibold">Wallet Connected</p>
                <p className="text-sm">Address: {walletAddress}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Sample Transaction</h2>
            <form onSubmit={handleTransaction}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (sBTC)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0.001"
                  step="0.000001"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!isWalletConnected}
                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
                  !isWalletConnected && "opacity-50 cursor-not-allowed"
                }`}
              >
                <Send className="h-5 w-5 mr-2" />
                Send Transaction
              </button>
            </form>

            {transactionStatus && (
              <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-md">{transactionStatus}</div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
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