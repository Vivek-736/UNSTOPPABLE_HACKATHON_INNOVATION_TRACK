"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useInsuranceContract } from "@/lib/hooks/useInsuranceContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { createPolicy, loading } = useInsuranceContract();

  const [formData, setFormData] = useState({
    region: "",
    crop: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const startTimestamp = Math.floor(new Date(formData.startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000);

      await createPolicy(
        formData.region,
        formData.crop,
        startTimestamp,
        endTimestamp
      );

      alert("Policy created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating policy:", error);
      alert("Failed to create policy. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-black mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to register your farm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-black mb-4">Register Your Farm</h1>
          <p className="text-gray-600">
            Create your crop insurance policy on the blockchain
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-lg p-8">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-black mb-2">
              Region
            </label>
            <Input
              id="region"
              type="text"
              placeholder="e.g., Punjab, India"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-black mb-2">
              Crop Type
            </label>
            <Input
              id="crop"
              type="text"
              placeholder="e.g., Wheat, Rice, Cotton"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-black mb-2">
              Coverage Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-black mb-2">
              Coverage End Date
            </label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-6 text-lg"
          >
            {loading ? "Creating Policy..." : "Create Insurance Policy"}
          </Button>
        </form>
      </main>
    </div>
  );
}