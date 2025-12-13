"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useFarmerProfile } from "@/lib/hooks/useFarmerProfile";
import { ClaimForm } from "@/components/profile/claim-form";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function ClaimPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { policies, loading, refresh } = useFarmerProfile();

  const policyIndex = parseInt(searchParams.get("policy") || "0", 10);

  if (!authenticated) {
    router.push("/profile");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Image
            src="/pattern-grid.svg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading policy...</p>
        </div>
      </div>
    );
  }

  const policy = policies[policyIndex];

  if (!policy) {
    router.push("/profile");
    return null;
  }

  const handleSuccess = () => {
    refresh();
    router.push("/profile");
  };

  const handleCancel = () => {
    router.push("/profile");
  };

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
            href="/profile"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to profile</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center bg-black">
              <Shield className="h-3 w-3 text-indigo-400" />
            </div>
            <span>AI Claim Verification</span>
          </div>
        </header>

        <main className="flex-1 flex items-center">
          <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                Submit insurance claim
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
                AI-powered verification.
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                Our AI will verify weather conditions for your {policy.crop} in{" "}
                {policy.region} and automatically approve or reject your claim.
              </p>
            </div>

            <ClaimForm
              policy={policy}
              policyId={policyIndex + 1}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <ClaimPageContent />
    </Suspense>
  );
}