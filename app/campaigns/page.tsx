import { Search, Filter, ArrowUpDown, Bitcoin } from "lucide-react";
import Link from "next/link";
import { CampaignService } from "../../utils/services/CampaignService";
import { verifyDatabaseConnection } from "../../utils/data-source";

async function getCampaigns() {
  try {
    await verifyDatabaseConnection();
    const campaignService = new CampaignService();
    const campaigns = await campaignService.getAllCampaigns();
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

export default async function ExploreCampaigns() {
  const campaigns = await getCampaigns();

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
                <Link href="/campaigns" className="text-yellow-500">
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
          <h1 className="text-4xl font-bold mb-8">Explore Campaigns</h1>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3 relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <label htmlFor="category-select" className="sr-only">
                  Select Category
                </label>
                <select
                  id="category-select"
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Education</option>
                  <option>Environment</option>
                  <option>Art</option>
                  <option>Business</option>
                </select>
                <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">
                  Sort By
                </label>
                <select
                  id="sort-select"
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option>Sort By</option>
                  <option>Newest</option>
                  <option>Most Funded</option>
                  <option>Ending Soon</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Campaign cards mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {campaigns.map((campaign) => (
              <Link
                href={`/campaigns/${campaign.id}`}
                key={campaign.id}
                className="block hover:no-underline"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {campaign.project_name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {campaign.project_description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Goal: {campaign.funding_goal / 1e8} sBTC</span>
                      <span>
                        Deadline:{" "}
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                1
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-yellow-500 font-medium"
              >
                3
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                4
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                5
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </nav>
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

