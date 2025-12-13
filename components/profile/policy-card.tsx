"use client";

import type { Policy } from "@/lib/hooks/useInsuranceContract";
import { Calendar, MapPin, Wheat, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PolicyCardProps {
  index: number;
  policy: Policy;
}

export function PolicyCard({ index, policy }: PolicyCardProps) {
  const startMs = policy.startDate * 1000;
  const endMs = policy.endDate * 1000;
  const startDateLabel = new Date(startMs).toLocaleDateString();
  const endDateLabel = new Date(endMs).toLocaleDateString();

  return (
    <div className="border border-gray-200 rounded-3xl p-6 sm:p-7 bg-white/90 backdrop-blur-sm hover:border-indigo-300 hover:shadow-sm transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500 mb-1">
            Policy
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            #{index + 1}
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Region</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 wrap-break-word">
              {policy.region}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Wheat className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Crop</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 wrap-break-word">
              {policy.crop}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Coverage</p>
            <p className="text-sm sm:text-base font-medium text-gray-900">
              {startDateLabel} – {endDateLabel}
            </p>
          </div>
        </div>
      </div>

      {policy.active && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href={`/claim?policy=${index}`}>
            <Button className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 h-10 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Submit Claim
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}