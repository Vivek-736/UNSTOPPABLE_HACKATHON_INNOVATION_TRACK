"use client";

import type { Policy } from "@/lib/hooks/useInsuranceContract";
import { Calendar, MapPin, Wheat } from "lucide-react";

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
    </div>
  );
}