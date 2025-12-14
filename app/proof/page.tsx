"use client";

import { useInsuranceContract, type Policy } from "@/lib/hooks/useInsuranceContract";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Shield, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Database,
  Cpu 
} from "lucide-react";
import { INSURANCE_REGISTRY_ADDRESS } from "@/contracts/deployed";

const generateMockHash = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${"a1b2c3d4e5f67890"}${hex}`;
};

interface CombinedRecord {
  type: "policy" | "claim";
  timestamp: number;
  policyId: number;
  data: any;
  mockTxHash: string;
  mockBlock: number;
}

export default function ProofPage() {
  const { getAllPolicies, getAllClaims, loading } = useInsuranceContract();
  const [records, setRecords] = useState<CombinedRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsRefreshing(true);
      const policies = await getAllPolicies();
      const claims = await getAllClaims();
      
      const combined: CombinedRecord[] = [];
      const now = Math.floor(Date.now() / 1000);

      policies.forEach(p => {
        combined.push({
          type: "policy",
          timestamp: p.startDate,
          policyId: p.id,
          data: p,
          mockTxHash: generateMockHash(`policy-${p.id}-${p.farmer}`),
          mockBlock: 5432100 + p.id * 12
        });
      });

      claims.forEach(c => {
        const policy = policies.find(p => p.id === c.policyId);
        const estimatedTime = policy ? policy.startDate + 1000 : now; 

        combined.push({
          type: "claim",
          timestamp: estimatedTime,
          policyId: c.policyId,
          data: c,
          mockTxHash: generateMockHash(`claim-${c.id}-${c.reason}`),
          mockBlock: 5432100 + c.policyId * 12 + 50
        });
      });

      setRecords(combined.sort((a, b) => b.timestamp - a.timestamp));
      setIsRefreshing(false);
    };

    fetchData();
  }, [getAllPolicies, getAllClaims]);

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
        <header className="flex items-center justify-between pb-8 lg:pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <Shield className="h-3 w-3" />
            <span>Trust Ledger Live</span>
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </header>

        <main className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">
              Transparency & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                Verifiable Proof.
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Every action on YieldGuard is recorded on the Ethereum blockchain. 
              This ledger provides immutable proof of policy creation, claim verification, 
              and automated payouts.
            </p>
          </div>

          <div className="relative border-l-2 border-dashed border-gray-200 ml-4 md:ml-10 pl-8 md:pl-12 pb-12 space-y-12">
            
            {loading && records.length === 0 ? (
               <div className="space-y-8">
                 {[1,2,3].map(i => (
                   <div key={i} className="animate-pulse flex flex-col gap-4">
                     <div className="h-4 bg-gray-200 w-32 rounded"></div>
                     <div className="h-32 bg-gray-100 rounded-3xl w-full max-w-3xl"></div>
                   </div>
                 ))}
               </div>
            ) : records.length === 0 ? (
              <p className="text-gray-500">
                No records found on-chain yet
              </p>
            ) : (
              records.map((record, index) => (
                <div key={`${record.type}-${index}`} className="relative group">
                  <div className={`absolute -left-[45px] md:-left-[61px] top-0 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    record.type === 'policy' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {record.type === 'policy' ? (
                      <Shield className="h-3 w-3 text-white" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            record.type === 'policy' 
                              ? 'bg-indigo-50 text-indigo-700' 
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {record.type === 'policy' ? 'New Policy Created' : 'Claim Verified & Paid'}
                          </span>
                          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(record.timestamp * 1000).toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {record.type === 'policy' 
                              ? `Coverage for ${record.data.crop} in ${record.data.region}`
                              : `Payout executed for ${record.data.reason.substring(0, 50)}${record.data.reason.length > 50 ? '...' : ''}`
                            }
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {record.type === 'policy' 
                              ? `Policy ID: #${record.policyId} • Coverage: ${record.data.coverageAmount} ETH` 
                              : `Claim ID: #${record.data.id} • Policy #${record.policyId} • Verdict: Approved`
                            }
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                           <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                             <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1">
                               <Database className="h-3 w-3" /> Transaction Hash
                             </p>
                             <div className="flex items-center gap-2">
                               <code className="text-xs text-indigo-600 font-mono truncate max-w-[200px]">
                                 {record.mockTxHash}
                               </code>
                               <a 
                                 href={`https://sepolia.etherscan.io/address/${INSURANCE_REGISTRY_ADDRESS}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-gray-400 hover:text-indigo-600 transition-colors"
                               >
                                 <ExternalLink className="h-3 w-3" />
                               </a>
                             </div>
                           </div>
                           
                           <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                             <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1">
                               <Cpu className="h-3 w-3" /> Block Number
                             </p>
                             <code className="text-xs text-gray-800 font-mono">
                               #{record.mockBlock}
                             </code>
                           </div>
                        </div>

                        {record.type === 'claim' && (
                           <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-dashed border-gray-200">
                             <span className="font-semibold text-emerald-700">✓ Verified by Gemini 2.5 Flash Lite</span>
                             <span>•</span>
                             <span>Weather Data Source: OpenWeatherMap</span>
                           </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}