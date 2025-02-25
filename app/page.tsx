import Image from "next/image"
import { Bitcoin, ArrowRight, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Crowdfund the Future with Bitcoin</h1>
            <p className="text-xl mb-8">Join the revolution of decentralized funding for innovative projects</p>
            <Link href="/create-campaign">
              <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-colors inline-flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose BitFund?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-yellow-500 rounded-full p-4 inline-block mb-4">
                  <Bitcoin className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Bitcoin-Native</h3>
                <p className="text-gray-600">
                  Fund and receive contributions in Bitcoin, the world&apos;s leading cryptocurrency.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500 rounded-full p-4 inline-block mb-4">
                  <Users className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Global Community</h3>
                <p className="text-gray-600">Connect with a worldwide network of backers and innovators.</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-500 rounded-full p-4 inline-block mb-4">
                  <Shield className="h-10 w-10 text-gray-900" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-gray-600">
                  Leverage blockchain technology for unparalleled security and transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-yellow-500 mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Create a Project</h3>
                <p className="text-gray-600">Submit your innovative idea and set your funding goal in Bitcoin.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-yellow-500 mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Share & Promote</h3>
                <p className="text-gray-600">Spread the word about your project to our global community of backers.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-yellow-500 mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Get Funded</h3>
                <p className="text-gray-600">Receive Bitcoin contributions and bring your project to life.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((project) => (
                <div key={project} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=400`}
                    alt={`Project ${project}`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Project Title {project}</h3>
                    <p className="text-gray-600 mb-4">A brief description of the project and its goals.</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-500 font-semibold">1.5 BTC raised</span>
                      <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                        Back Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-yellow-500 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Fund the Future?</h2>
            <p className="text-xl text-gray-900 mb-8">Join BitFund today and be part of the next big innovation.</p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors inline-flex items-center">
              Start Your Project
              <Zap className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
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
                  <a href="/create-campaign" className="hover:text-yellow-500 transition-colors">
                    Start a Project
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/campaigns" className="hover:text-yellow-500 transition-colors">
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

