"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useFarmerProfile } from "@/lib/hooks/useFarmerProfile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, ArrowLeft, Calendar, MapPin, Wheat } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const { authenticated, logout } = usePrivy();
  const { policies, loading, hasProfile } = useFarmerProfile();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to view your profile</p>
          <Link href="/">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">You haven&apos;t registered your farm yet</p>
          <Link href="/register">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Register Your Farm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          
          <Button 
            onClick={logout}
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-50"
          >
            Disconnect
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-black mb-2">Your Farm Profile</h1>
          <p className="text-gray-600">Manage your crop insurance policies</p>
        </div>

        <div className="space-y-6">
          {policies.map((policy, index) => {
            const startDate = new Date(policy.startDate * 1000).toLocaleDateString();
            const endDate = new Date(policy.endDate * 1000).toLocaleDateString();
            // eslint-disable-next-line react-hooks/purity
            const isActive = policy.active && Date.now() / 1000 < policy.endDate;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">Policy #{index + 1}</h3>
                    <div className="flex items-center space-x-2">
                      {isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Region</p>
                      <p className="text-black font-medium">{policy.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Wheat className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Crop Type</p>
                      <p className="text-black font-medium">{policy.crop}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Coverage Period</p>
                      <p className="text-black font-medium">
                        {startDate} - {endDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/register">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Add New Policy
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}