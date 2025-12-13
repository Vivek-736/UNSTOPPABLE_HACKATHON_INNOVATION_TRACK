"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/lib/hooks/useFarmerProfile";
import Link from "next/link";
import Image from "next/image";
import { Wheat, Shield, FileText, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const { login, authenticated, logout } = usePrivy();
  const { hasProfile } = useFarmerProfile();

  const primaryCta = authenticated
    ? hasProfile
      ? { href: "/profile", label: "View My Coverage" }
      : { href: "/register", label: "Insure My Crop" }
    : null;

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

      <header className="relative border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg border border-gray-900 flex items-center justify-center bg-black">
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                YieldGuard
              </span>
              <span className="text-[11px] text-gray-400">
                On-chain crop insurance
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {authenticated && hasProfile && (
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  View profile
                </Button>
              </Link>
            )}

            {authenticated ? (
              <Button
                onClick={logout}
                className="bg-black text-white hover:bg-gray-900 px-4 py-2 h-9 text-sm rounded-full"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={login}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 h-9 text-sm rounded-full"
              >
                Connect wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
          <section className="relative z-10">
            <div className="inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-600 mb-6">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>Auto-credit on crop failure · Sepolia testnet</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-5">
              Insurance that pays out
              <span className="block">before the dust settles.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mb-8">
              YieldGuard watches weather and on-chain oracles so your farmers
              are automatically credited when crops fail. No paperwork, no
              chasing agents—just deterministic payouts.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              {primaryCta ? (
                <Link href={primaryCta.href} className="inline-flex">
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 h-11 rounded-full text-sm sm:text-base font-medium flex items-center gap-2">
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={login}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-10 h-11 rounded-full text-sm sm:text-base font-medium flex items-center gap-2"
                >
                  Connect wallet to start
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Smart contracts live on Sepolia</span>
              </div>
            </div>
          </section>

          <section className="relative h-65 sm:h-80 md:h-95 lg:h-110 xl:h-120">
            <div className="absolute inset-0 rounded-3xl bg-black shadow-[0_18px_80px_rgba(15,23,42,0.65)] overflow-hidden border border-gray-900/70">
              <Image
                src="/hero-farm.svg"
                alt="Abstract illustration of farmland secured by blockchain payouts"
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

              <div className="absolute left-5 right-5 bottom-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mb-1">
                    Live safeguard
                  </p>
                  <p className="text-sm text-gray-100 max-w-xs">
                    When a linked oracle flags a severe yield loss, payouts are
                    streamed directly to farmers’ wallets.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/10 border border-emerald-400/40 px-3 py-1.5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-medium text-emerald-100">
                      Auto-credit armed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-16 lg:mt-24 border-t border-gray-200/80 pt-12 lg:pt-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-1">
                <Wheat className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Farmer-first coverage</h3>
              <p className="text-sm text-gray-600">
                Register a policy once and let the protocol detect failures.
                No claims office, no manual paperwork—just a farmer and their
                wallet.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-1">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Deterministic payouts</h3>
              <p className="text-sm text-gray-600">
                Policies live on Ethereum, so every rule is auditable. If the
                conditions are met, the payout must happen.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-1">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Single source of truth</h3>
              <p className="text-sm text-gray-600">
                Farmer details, crop region, and coverage windows are all held
                in a single registry, ready for integrations.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-gray-200/80 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <p>
            © 2025 YieldGuard · Built for resilient harvests.
          </p>
          <p className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>Prototype on Sepolia testnet</span>
          </p>
        </div>
      </footer>
    </div>
  );
}