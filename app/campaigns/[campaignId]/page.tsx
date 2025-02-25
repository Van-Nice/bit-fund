import Image from "next/image";
import Link from "next/link";
import { Bitcoin, Calendar, Shield, ExternalLink } from "lucide-react";
import { CampaignService } from "../../../utils/services/CampaignService";
import { verifyDatabaseConnection } from "../../../utils/data-source";

// Add this type definition at the top of your file
type Reward = {
  amount: number;
  description: string;
};

async function getCampaign(id: string) {
  try {
    await verifyDatabaseConnection();
    const campaignService = new CampaignService();
    const campaign = await campaignService.getCampaignById(id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    return campaign;
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw error;
  }
}

export default async function CampaignDetails({
  params,
}: {
  params: { campaignId: string };
}) {
  const campaign = await getCampaign(params.campaignId);

  // Mock data for features not yet in database
  const mockData = {
    creator: "Anonymous",
    creatorImage: "/placeholder.svg?height=100&width=100",
    category: "Technology",
    current: 0,
    backers: 0,
    image: "/placeholder.svg?height=400&width=800",
    rewards: [
      {
        amount: 0.01,
        description: "Early Supporter: Get exclusive project updates",
      }
    ] as Reward[],  // Add the type assertion here
    backersList: [],
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
                <Link
                  href="/"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-yellow-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Contact
                </Link>
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
              <h1 className="text-4xl font-bold mb-4">
                {campaign.project_name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src={mockData.creatorImage}
                  alt={mockData.creator}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-600">{mockData.creator}</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {mockData.category}
                </span>
              </div>
              <Image
                src={mockData.image}
                alt={campaign.project_name}
                width={800}
                height={400}
                className="w-full rounded-lg mb-8"
              />

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  About this project
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {campaign.project_description}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Rewards</h2>
                <div className="space-y-4">
                  {mockData.rewards.map((reward, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">
                          {reward.amount} BTC
                        </span>
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
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-yellow-500"
                    />
                    <span className="ml-2 text-gray-600">Show backers</span>
                  </label>
                </div>
                <div className="space-y-4">
                  {mockData.backersList.map((backer, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{backer.name}</span>
                      <span className="text-yellow-500">
                        {backer.amount} BTC
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Smart Contract Details
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="h-5 w-5" />
                  <span>Transaction ID:</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {campaign.tx_id}
                  </code>
                  <Link
                    href={`https://explorer.stacks.co/txid/${campaign.tx_id}`}
                    target="_blank"
                    className="text-yellow-500 hover:underline flex items-center"
                  >
                    Verify <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="text-3xl font-bold mb-2">
                  {mockData.current} BTC
                </div>
                <div className="text-gray-600 mb-6">
                  raised of {campaign.funding_goal / 1e8} sBTC goal
                </div>
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold">{mockData.backers}</div>
                    <div className="text-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.ceil(
                        (new Date(campaign.deadline).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </div>
                    <div className="text-gray-600">days to go</div>
                  </div>
                </div>
                <Link
                  href={`/campaigns/${campaign.id}/invest`}
                  className="block w-full bg-yellow-500 text-center text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Invest in this project
                </Link>
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Campaign ends on{" "}
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
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
              <p className="text-sm text-gray-400">
                Empowering innovators through Bitcoin-based crowdfunding.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Start a Project
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Explore Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="text-sm text-gray-400">
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Telegram
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
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
  );
}
