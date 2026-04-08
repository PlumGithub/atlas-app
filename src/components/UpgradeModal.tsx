"use client";

import React from "react";
import TerminalWindow from "./ui/TerminalWindow";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const TIERS = [
  {
    name: "FREE",
    price: "$0/mo",
    features: [
      "5 signals/day",
      "basic substrate",
      "no connections",
    ],
    tierKey: "free" as const,
  },
  {
    name: "SIGNAL",
    price: "$9/mo",
    features: [
      "unlimited signals",
      "full substrate",
      "geographic pulls",
    ],
    tierKey: "signal" as const,
  },
  {
    name: "SUBSTRATE",
    price: "$19/mo",
    features: [
      "everything in signal",
      "connect with matches",
      "anonymous signaling",
    ],
    tierKey: "substrate" as const,
  },
];

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  if (!open) return null;

  async function checkout(tier: "signal" | "substrate") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 overflow-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-xs text-[#666666] mb-3">
          $ ls -la /tiers
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <TerminalWindow key={t.name} title={`tier — ${t.name.toLowerCase()}`}>
              <div className="font-mono text-sm space-y-3">
                <div className="text-white text-lg">{t.name}</div>
                <div className="text-[#c0a882]">{t.price}</div>
                <ul className="space-y-1 text-[#999999] text-xs">
                  {t.features.map((f) => (
                    <li key={f}>&gt; {f}</li>
                  ))}
                </ul>
                {t.tierKey === "free" ? (
                  <button
                    disabled
                    className="w-full border border-[#3a3a3a] text-[#666666] px-3 py-2 text-xs"
                  >
                    current
                  </button>
                ) : (
                  <button
                    onClick={() => checkout(t.tierKey as "signal" | "substrate")}
                    className="w-full border border-[#c0a882] text-[#c0a882] hover:bg-[#c0a882] hover:text-[#1a1a1a] px-3 py-2 text-xs transition-colors"
                  >
                    [upgrade →]
                  </button>
                )}
              </div>
            </TerminalWindow>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="font-mono text-xs text-[#666666] hover:text-[#c0a882]"
          >
            [esc] close
          </button>
        </div>
      </div>
    </div>
  );
}
