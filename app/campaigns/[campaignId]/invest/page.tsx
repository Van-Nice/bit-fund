"use client"

import { useState } from "react"
import Image from "next/image"
import { Bitcoin, Wallet, AlertCircle, CheckCircle2 } from "lucide-react"

// Placeholder campaign data (replace with actual data fetching)
const campaign = {
  id: 1,
  name: "Decentralized Energy Grid",
  description: "Creating a peer-to-peer energy trading platform using blockchain technology.",
  creator: "EnergyChain Labs",
  goal: 5,
  current: 3.2,
  backers: 128,
  deadline: "2025-06-30",
  image: "/placeholder.svg?height=400&width=800",
}

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState("")

  const connectWallet = () => {
    // Placeholder function for wallet connection
    // Replace with actual Stacks wallet connection logic
    setIsWalletConnected(true)
    setError("")
  }

  const handleInvest = () => {
    if (!isWalletConnected) {
      setError("Please connect your wallet first.")
      return
    }

    const amount = Number.parseFloat(investmentAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid investment amount.")
      return
    }

    // Placeholder for actual investment logic
    // Replace with actual sBTC transaction logic
    console.log(`Investing ${amount} sBTC into campaign ${campaign.id}`)
    setIsConfirmed(true)
    setError("")
  }

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
                <a href="/" className="hover:text-yellow-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/campaigns" className="hover:text-yellow-500 transition-colors">
                  Campaigns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold mb-6">Invest in {campaign.name}</h1>

              {!isConfirmed ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Investment Details</h2>
                    <p className="text-gray-600">Enter the amount of sBTC you want to invest in this campaign.</p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount (sBTC)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">sBTC</span>
                      </div>
                      <input
                        type="number"
                        name="investment-amount"
                        id="investment-amount"
                        className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-16 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  {!isWalletConnected && (
                    <button
                      onClick={connectWallet}
                      className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center"
                    >
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </button>
                  )}

                  {isWalletConnected && (
                    <button
                      onClick={handleInvest}
                      className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Confirm Investment
                    </button>
                  )}

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
                      Thank you for investing {investmentAmount} sBTC in {campaign.name}.
                    </p>
                    <a href={`/campaigns/${campaign.id}`} className="text-yellow-500 hover:underline">
                      Return to Campaign Page
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Campaign Summary</h2>
                <Image
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.name}
                  width={400}
                  height={200}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{campaign.name}</h3>
                <p className="text-gray-600 mb-4">{campaign.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-semibold">{campaign.goal} sBTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised:</span>
                    <span className="font-semibold">{campaign.current} sBTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Backers:</span>
                    <span className="font-semibold">{campaign.backers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${(campaign.current / campaign.goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{Math.round((campaign.current / campaign.goal) * 100)}% funded</span>
                    <span>
                      {Math.ceil(
                        (new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days left
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    How It Works
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Start a Project
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Explore Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Twitter
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Telegram
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-yellow-500 transition-colors">
                    Discord
                  </a>
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
  )
}

