import Image from "next/image"
import { Bitcoin, Wallet, BarChart, PlusCircle, ExternalLink } from "lucide-react"

const user = {
  name: "Alice Nakamoto",
  avatar: "/placeholder.svg?height=100&width=100",
  totalInvested: 2.5,
  totalRaised: 5.8,
  campaignsCreated: 2,
  campaignsInvested: 5,
}

const userCampaigns = [
  {
    id: 1,
    name: "Decentralized Energy Grid",
    goal: 5,
    current: 3.2,
    deadline: "2025-06-30",
    status: "Active",
  },
  {
    id: 2,
    name: "Bitcoin Education Platform",
    goal: 2,
    current: 2.6,
    deadline: "2025-04-15",
    status: "Funded",
  },
]

const userInvestments = [
  {
    id: 3,
    name: "Eco-Friendly Bitcoin Mining",
    invested: 0.5,
    currentValue: 0.65,
    reward: "Beta Tester Access",
    status: "Active",
  },
  {
    id: 4,
    name: "Bitcoin Art Gallery",
    invested: 0.1,
    currentValue: 0.12,
    reward: "Limited Edition NFT",
    status: "Active",
  },
  {
    id: 5,
    name: "Lightning Network Expansion",
    invested: 0.3,
    currentValue: 0.35,
    reward: "Early Adopter Badge",
    status: "Active",
  },
]

export default function UserDashboard() {
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
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">Welcome to your dashboard</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md mb-8">
                <div className="flex border-b">
                  <button className="px-6 py-3 font-semibold text-yellow-500 border-b-2 border-yellow-500">
                    My Campaigns
                  </button>
                  <button className="px-6 py-3 text-gray-500 hover:text-yellow-500">My Investments</button>
                </div>

                {/* My Campaigns */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Campaigns</h2>
                    <button className="flex items-center text-yellow-500 hover:underline">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Create New Campaign
                    </button>
                  </div>
                  <div className="space-y-4">
                    {userCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              campaign.status === "Active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Goal: {campaign.goal} BTC</span>
                          <span>Raised: {campaign.current} BTC</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{ width: `${(campaign.current / campaign.goal) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Ends on {new Date(campaign.deadline).toLocaleDateString()}</span>
                          <a href={`/campaigns/${campaign.id}`} className="text-yellow-500 hover:underline">
                            View Details
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Investments */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">My Investments</h2>
                  <div className="space-y-4">
                    {userInvestments.map((investment) => (
                      <div key={investment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{investment.name}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {investment.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Invested: {investment.invested} BTC</span>
                          <span>Current Value: {investment.currentValue} BTC</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Reward: {investment.reward}</span>
                          <a href={`/campaigns/${investment.id}`} className="text-yellow-500 hover:underline">
                            View Campaign
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Total Invested</span>
                    </div>
                    <span className="font-semibold">{user.totalInvested} BTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Total Raised</span>
                    </div>
                    <span className="font-semibold">{user.totalRaised} BTC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PlusCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Campaigns Created</span>
                    </div>
                    <span className="font-semibold">{user.campaignsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bitcoin className="h-5 w-5 text-yellow-500 mr-2" />
                      <span>Campaigns Invested</span>
                    </div>
                    <span className="font-semibold">{user.campaignsInvested}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                    Withdraw Funds
                  </button>
                </div>
                <div className="mt-4">
                  <a href="#" className="text-sm text-center block text-yellow-500 hover:underline">
                    View Transaction History <ExternalLink className="inline h-4 w-4" />
                  </a>
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

