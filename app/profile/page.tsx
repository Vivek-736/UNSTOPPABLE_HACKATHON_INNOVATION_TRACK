"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useFarmerProfile } from "@/lib/hooks/useFarmerProfile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PolicyCard } from "@/components/profile/policy-card";

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
          {policies.map((policy, index) => (
            <PolicyCard key={index} index={index} policy={policy} />
          ))}
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