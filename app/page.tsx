"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/lib/hooks/useFarmerProfile";
import Link from "next/link";
import { Wheat, Shield, FileText } from "lucide-react";

export default function Home() {
  const { login, authenticated, logout } = usePrivy();
  const { hasProfile } = useFarmerProfile();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-black">YieldGuard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {authenticated && hasProfile && (
              <Link href="/profile">
                <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
                  View Profile
                </Button>
              </Link>
            )}
            
            {authenticated ? (
              <Button 
                onClick={logout}
                className="bg-black text-white hover:bg-gray-800"
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={login}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Decentralized Crop Insurance
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Secure your harvest with blockchain-based insurance. Transparent, immutable, and trustworthy protection for your crops.
          </p>

          {authenticated ? (
            hasProfile ? (
              <div className="flex justify-center space-x-4">
                <Link href="/profile">
                  <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    View My Profile
                </Button>
                </Link>
              </div>
            ) : (
              <Link href="/register">
                <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Register Your Farm
                </Button>
              </Link>
            )
          ) : (
            <Button 
              onClick={login}
              size="lg" 
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Get Started
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-12 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <Wheat className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Crop Protection</h3>
            <p className="text-gray-600">
              Comprehensive coverage for your agricultural investments against natural risks
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Blockchain Security</h3>
            <p className="text-gray-600">
              Immutable records on Ethereum ensure transparency and trust in every policy
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Smart Contracts</h3>
            <p className="text-gray-600">
              Automated policy management with transparent and verifiable execution
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 YieldGuard. Securing harvests on the blockchain.</p>
        </div>
      </footer>
    </div>
  );
}