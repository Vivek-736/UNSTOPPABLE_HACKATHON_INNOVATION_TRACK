"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useInsuranceContract } from "@/lib/hooks/useInsuranceContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { authenticated, login } = usePrivy();
  const { createPolicy, loading } = useInsuranceContract();

  const [formData, setFormData] = useState({
    region: "",
    crop: "",
    coverageAmount: "0.01",
    premium: "0.001",
    durationDays: "30",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      await createPolicy(
        formData.crop,
        formData.region,
        formData.coverageAmount,
        parseInt(formData.durationDays),
        formData.premium
      );

      toast.success("Policy created successfully");
      router.push("/");
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Failed to create policy. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Image
            src="/pattern-grid.svg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative max-w-3xl w-full bg-white/85 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 mb-4">
              <Shield className="h-3 w-3 text-indigo-600" />
              <span>Step 1 · Connect wallet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-10">
              Connect your wallet first
            </h2>
            <Button
              onClick={login}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 h-11 text-sm sm:text-base"
            >
              Connect wallet to continue
            </Button>
          </div>

          <div className="hidden md:block shrink-0 w-52 h-52 relative">
            <div className="absolute inset-0 rounded-2xl bg-black overflow-hidden border border-gray-900/60 shadow-[0_16px_60px_rgba(15,23,42,0.6)]">
              <Image
                src="/register-farm.svg"
                alt="Abstract registration card above a farm grid"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <Image
          src="/pattern-grid.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 min-h-screen flex flex-col">
        <header className="flex items-center justify-between pb-4 lg:pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to overview</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center bg-black">
              <Shield className="h-3 w-3 text-indigo-400" />
            </div>
            <span>Step 2 · Define coverage</span>
          </div>
        </header>

        <main className="flex-1 flex items-center">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] gap-8 lg:gap-12 items-start w-full">
          <section className="relative z-10 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                Register a policy
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
                Farm, crop, dates.
              </h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-2 rounded-3xl border border-gray-200 bg-white/90 backdrop-blur shadow-sm p-6 sm:p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="region"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Region
                  </label>
                  <Input
                    id="region"
                    type="text"
                    placeholder="e.g., Punjab, India"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>

                <div>
                  <label
                    htmlFor="crop"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Crop type
                  </label>
                  <Input
                    id="crop"
                    type="text"
                    placeholder="e.g., Wheat, Rice, Cotton"
                    value={formData.crop}
                    onChange={(e) =>
                      setFormData({ ...formData, crop: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="coverageAmount"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Coverage Amount (ETH)
                  </label>
                  <Input
                    id="coverageAmount"
                    type="text"
                    placeholder="0.01"
                    value={formData.coverageAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, coverageAmount: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>

                <div>
                  <label
                    htmlFor="premium"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Premium (ETH)
                  </label>
                  <Input
                    id="premium"
                    type="text"
                    placeholder="0.001"
                    value={formData.premium}
                    onChange={(e) =>
                      setFormData({ ...formData, premium: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="durationDays"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                >
                  Duration (Days)
                </label>
                <Input
                  id="durationDays"
                  type="number"
                  placeholder="30"
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({ ...formData, durationDays: e.target.value })
                  }
                  required
                  className="w-full bg-white/80"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Coverage start
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
                  >
                    Coverage end
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    className="w-full bg-white/80"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 px-6 h-11 rounded-full text-sm sm:text-base"
                >
                  {loading ? "Creating policy…" : "Create on-chain policy"}
                </Button>
              </div>
            </form>
          </section>

          <section className="relative h-64 sm:h-80 md:h-96 lg:h-105 xl:h-115">
            <div className="absolute inset-0 rounded-3xl bg-black overflow-hidden border border-gray-900/70 shadow-[0_18px_80px_rgba(15,23,42,0.65)]">
              <Image
                src="/register-farm.svg"
                alt="Stylised policy form floating above a farm grid"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/20 to-transparent" />

              <div className="absolute left-5 right-5 bottom-5 flex flex-col gap-2 text-xs text-gray-100">
                <p className="uppercase tracking-[0.18em] text-[10px] text-gray-400">
                  Policy snapshot
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px]">Immutable on-chain record</span>
                </div>
              </div>
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}