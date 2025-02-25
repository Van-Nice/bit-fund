"use client";

import { useState, useEffect } from "react";
import { connect, getLocalStorage, disconnect, isConnected } from "@stacks/connect";

export default function Wallet() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // 🟢 Auto-load wallet connection on page load
  useEffect(() => {
    if (isConnected()) {
      const data = getLocalStorage();
      console.log("🛠 Wallet Data:", data); // Debugging the data structure

      if (data && data.addresses) {
        // ✅ Select the correct address (mainnet or testnet)
        const address = data.addresses.mainnet || data.addresses.testnet;
        if (address) {
          setSelectedAddress(address.address); // ✅ Use the correct field
          setWalletConnected(true);
        }
      }
    }
  }, []);

  // 🟢 Connect the Wallet
  const handleConnect = async () => {
    try {
      const response = await connect();
      console.log("🔹 Connect Response:", response); // Debugging the response structure

      if (response && response.addresses) {
        const address = response.addresses.mainnet || response.addresses.testnet;
        if (address) {
          setSelectedAddress(address.address);
          setWalletConnected(true);
        }
      }
    } catch (error) {
      console.error("❌ Wallet Connection Error:", error);
    }
  };

  // 🛑 Disconnect the Wallet
  const handleDisconnect = () => {
    disconnect();
    setSelectedAddress(null);
    setWalletConnected(false);
  };

  return (
    <div className="p-4">
      {!walletConnected ? (
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-semibold">Connected Address:</p>
          <p className="text-gray-700 break-all">{selectedAddress}</p>

          <button
            onClick={handleDisconnect}
            className="mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
