"use client";

import { useState, useEffect } from "react";
import { Bitcoin, Wallet, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

// Extend Window interface for LeatherProvider
declare global {
  interface Window {
    LeatherProvider?: any;
  }
}

export default function SignIn() {
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");

  // Configure app and user session for @stacks/connect
  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  // Check if Leather wallet is installed on mount
  useEffect(() => {
    const checkWalletInstallation = () => {
      const installed = typeof window !== "undefined" && !!window.LeatherProvider;
      setIsWalletInstalled(installed);

      if (installed && userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const stxAddress = userData.profile.stxAddress.mainnet; // Or .testnet
        setPublicKey(stxAddress);
      }
    };

    checkWalletInstallation();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");

    try {
      await showConnect({
        appDetails: {
          name: "BitFund",
          icon: "https://example.com/icon.png", // Replace with your app's icon URL
        },
        onFinish: () => {
          const userData = userSession.loadUserData();
          const stxAddress = userData.profile.stxAddress.mainnet; // Or .testnet
          setPublicKey(stxAddress);
          setIsConnecting(false);
        },
        onCancel: () => {
          setError("Wallet connection was canceled. Please try again if you wish to connect.");
          setIsConnecting(false);
        },
      });
    } catch (err) {
      console.error("Unexpected wallet connection error:", err);
      setError("An unexpected error occurred while connecting to the wallet.");
      setIsConnecting(false);
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
              <li>
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-yellow-500 transition-colors">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-yellow-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-yellow-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign In to BitFund</h1>

          {!publicKey ? (
            <>
              {isWalletInstalled ? (
                <div className="mb-6 flex items-center text-green-600">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>Leather wallet detected</span>
                </div>
              ) : (
                <div className="mb-6 flex items-center text-yellow-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>No Leather wallet detected. Please install the Leather wallet to continue.</span>
                </div>
              )}
              <Link href="/create-campaign">
                <button
                  onClick={connectWallet}
                  disabled={!isWalletInstalled || isConnecting}
                  className={`w-full bg-yellow-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center ${
                    (!isWalletInstalled || isConnecting) && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isConnecting ? (
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
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
              </Link>

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                  <XCircle className="mr-2 h-5 w-5" />
                  {error}
                </div>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                By connecting your wallet, you agree to our{" "}
                <Link href="#" className="text-yellow-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-yellow-500 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Wallet Connected!</h2>
              <p className="text-gray-600 mb-4">Your address: {publicKey}</p>
              <Link
                href="/dashboard"
                className="inline-block bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
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
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Start a Project
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Explore Projects
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Twitter
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Telegram
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">
                    Discord
                  </Link>
                </li>
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