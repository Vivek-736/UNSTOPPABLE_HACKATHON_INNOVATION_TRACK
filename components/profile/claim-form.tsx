"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInsuranceContract, type Policy } from "@/lib/hooks/useInsuranceContract";
import { Loader2, CheckCircle2, XCircle, CloudRain } from "lucide-react";
import { toast } from "sonner";

interface ClaimFormProps {
  policy: Policy;
  policyId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface VerificationResult {
  approve: boolean;
  reason: string;
  detailedSummary: string;
  weatherData: {
    rainfall: number;
    temperature: number;
    anomaly: string;
  } | null;
  usedWeatherAPI: boolean;
}

export function ClaimForm({ policy, policyId, onSuccess, onCancel }: ClaimFormProps) {
  const [claimReason, setClaimReason] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  const { submitClaim } = useInsuranceContract();

  const handleVerify = async () => {
    if (!claimReason.trim()) {
      toast.error("Please describe the reason for your claim");
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch("/api/verify-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop: policy.crop,
          region: policy.region,
          policyStart: new Date(policy.startDate * 1000).toISOString().split("T")[0],
          policyEnd: new Date(policy.endDate * 1000).toISOString().split("T")[0],
          claimDate: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      const result: VerificationResult = await response.json();
      setVerificationResult(result);

      if (result.approve) {
        toast.success("Claim verification passed");
      } else {
        toast.error("Claim verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify claim. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!verificationResult?.approve) {
      toast.error("Claim must be verified and approved first");
      return;
    }

    if (!submitClaim) {
      toast.error("Contract not loaded");
      return;
    }

    setSubmitting(true);

    try {
      await submitClaim(policyId, claimReason);
      toast.success("Claim approved! Payout transferred to your wallet.");
      setClaimSubmitted(true);
    } catch (error) {
      console.error("Claim submission error:", error);
      toast.error("Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white/90 backdrop-blur shadow-sm p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Claim</h3>
        <p className="text-sm text-gray-600">
          AI will verify weather conditions for {policy.crop} in {policy.region}
        </p>
      </div>

      <div>
        <label
          htmlFor="claimReason"
          className="block text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-2"
        >
          Claim Reason
        </label>
        <textarea
          id="claimReason"
          value={claimReason}
          onChange={(e) => setClaimReason(e.target.value)}
          placeholder="Describe the crop damage (e.g., Severe heatwave destroyed rice crops)"
          className="w-full min-h-25 px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={verifying || submitting || !!verificationResult}
        />
      </div>


      {verificationResult && (
        <div
          className={`rounded-2xl p-4 border ${
            verificationResult.approve
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3 mb-3">
            {verificationResult.approve ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900 mb-1">
                {verificationResult.approve ? "Claim Approved" : "Claim Rejected"}
              </p>
              <p className="text-xs text-gray-700">{verificationResult.reason}</p>
            </div>
          </div>

          {verificationResult.detailedSummary && (
            <div className="mt-3 pt-3 border-t border-gray-300/50">
              <p className="text-xs font-medium text-gray-700 mb-2">📊 Detailed Analysis</p>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {verificationResult.detailedSummary}
              </p>
            </div>
          )}

          {verificationResult.weatherData && (
            <div className="mt-3 pt-3 border-t border-gray-300/50">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="h-4 w-4 text-gray-600" />
                <p className="text-xs font-medium text-gray-700">Weather Data</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div>Rainfall: {verificationResult.weatherData.rainfall.toFixed(1)} mm</div>
                <div>Temp: {verificationResult.weatherData.temperature.toFixed(1)}°C</div>
                <div className="col-span-2">Status: {verificationResult.weatherData.anomaly}</div>
              </div>
            </div>
          )}

          {!verificationResult.usedWeatherAPI && (
            <p className="text-xs text-gray-600 mt-2 italic">
              * Weather API unavailable, used AI knowledge
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!verificationResult ? (
          <>
            <Button
              onClick={handleVerify}
              disabled={verifying || !claimReason.trim()}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify with AI"
              )}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
            >
              Cancel
            </Button>
          </>
        ) : verificationResult.approve ? (
          <>
            {!claimSubmitted ? (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <div className="w-full space-y-3">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-sm text-emerald-900">Payout Successful!</p>
                  </div>
                  <p className="text-xs text-emerald-800">Your claim has been processed and the payout has been transferred to your wallet.</p>
                </div>
                <Button
                  onClick={onCancel}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-full"
                >
                  Back to Profile
                </Button>
              </div>
            )}
          </>
        ) : (
          <Button
            onClick={onCancel}
            className="w-full bg-gray-600 text-white hover:bg-gray-700 rounded-full"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}