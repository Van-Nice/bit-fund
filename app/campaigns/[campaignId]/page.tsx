import Image from "next/image"
import { Bitcoin, Calendar, Shield, ExternalLink } from "lucide-react"

const campaign = {
  id: 1,
  name: "Decentralized Energy Grid",
  description:
    "Our project aims to revolutionize the energy sector by creating a decentralized energy grid powered by blockchain technology. This innovative system will enable peer-to-peer energy trading, allowing individuals and businesses to buy, sell, and trade excess energy directly with each other.\n\nKey features of our decentralized energy grid include:\n\n1. Peer-to-peer energy trading\n2. Smart contract-based transactions\n3. Integration with renewable energy sources\n4. Real-time energy consumption and production tracking\n5. Incentive mechanisms for energy conservation\n\nBy leveraging blockchain technology, we can create a more efficient, transparent, and sustainable energy ecosystem. This project has the potential to reduce energy costs, promote the adoption of renewable energy sources, and empower consumers to take control of their energy usage and production.",
  creator: "EnergyChain Labs",
  creatorImage: "/placeholder.svg?height=100&width=100",
  category: "Technology",
  goal: 5,
  current: 3.2,
  backers: 128,
  deadline: "2025-06-30",
  image: "/placeholder.svg?height=400&width=800",
  rewards: [
    { amount: 0.01, description: "Early Supporter: Get exclusive project updates and a digital badge." },
    { amount: 0.05, description: "Beta Tester: Early access to the platform and a personalized energy report." },
    { amount: 0.1, description: "Energy Pioneer: All previous rewards + a limited edition physical coin." },
    {
      amount: 0.5,
      description: "Grid Innovator: All previous rewards + 1-year free premium features on the platform.",
    },
  ],
  backersList: [
    { name: "Satoshi N.", amount: 0.5 },
    { name: "Alice B.", amount: 0.1 },
    { name: "Bob C.", amount: 0.05 },
    { name: "Charlie D.", amount: 0.01 },
  ],
  smartContractAddress: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
}

export default function CampaignDetails() {
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
              <h1 className="text-4xl font-bold mb-4">{campaign.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src={campaign.creatorImage || "/placeholder.svg"}
                  alt={campaign.creator}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-600">{campaign.creator}</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">{campaign.category}</span>
              </div>
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.name}
                width={800}
                height={400}
                className="w-full rounded-lg mb-8"
              />

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">About this project</h2>
                <p className="text-gray-600 whitespace-pre-line">{campaign.description}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Rewards</h2>
                <div className="space-y-4">
                  {campaign.rewards.map((reward, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{reward.amount} BTC</span>
                        <span className="text-yellow-500">Pledge</span>
                      </div>
                      <p className="text-gray-600">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Backers</h2>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-yellow-500" />
                    <span className="ml-2 text-gray-600">Show backers</span>
                  </label>
                </div>
                <div className="space-y-4">
                  {campaign.backersList.map((backer, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{backer.name}</span>
                      <span className="text-yellow-500">{backer.amount} BTC</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Verify Smart Contract</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="h-5 w-5" />
                  <span>Smart Contract Address:</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <code className="bg-gray-100 px-2 py-1 rounded">{campaign.smartContractAddress}</code>
                  <a href="#" className="text-yellow-500 hover:underline flex items-center">
                    Verify <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((campaign.current / campaign.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${(campaign.current / campaign.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{campaign.current} BTC</div>
                <div className="text-gray-600 mb-6">raised of {campaign.goal} BTC goal</div>
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold">{campaign.backers}</div>
                    <div className="text-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.ceil(
                        (new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </div>
                    <div className="text-gray-600">days to go</div>
                  </div>
                </div>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Invest in this project
                </button>
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Campaign ends on {new Date(campaign.deadline).toLocaleDateString()}</span>
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

