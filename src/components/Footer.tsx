"use client";

import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface FooterProps {
  contractAddress: string;
}

export function Footer({ contractAddress }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#07080c] py-14 text-warm-300 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-white/5">
          {/* GGBoard Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6200] to-[#b33e00] flex items-center justify-center font-display font-black text-white text-lg shadow-glow clip-corner-sm">
              GG
            </div>
            <div>
              <div className="text-white font-display font-black text-base tracking-wider uppercase">
                GGBOARD ON-CHAIN
              </div>
              <div className="text-[11px] text-warm-400">
                Autonomous, peer-verified competitive gaming scoreboard
              </div>
            </div>
          </div>

          {/* BOT Chain Ecosystem Showcase Section with Official Logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#0e111a] border border-[#ff6200]/30 shadow-card">
            {/* BOT Chain Logo & Name */}
            <div className="flex items-center gap-3 pr-2 sm:border-r border-white/10">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="w-9 h-9 rounded-lg object-contain bg-black border border-white/10 p-0.5"
              />
              <div>
                <div className="text-white font-display font-bold text-xs tracking-wider flex items-center gap-1.5">
                  <span>BOT CHAIN</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-warm-400">
                  Mainnet (Chain ID 677)
                </div>
              </div>
            </div>

            {/* Required Ecosystem Links with Logo in front */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1a2030] text-warm-200 hover:text-white border border-white/10 hover:border-[#ff6200]/50 transition-all font-semibold group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded-sm object-contain"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#ff6200]" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141824] hover:bg-[#1a2030] text-warm-200 hover:text-white border border-white/10 hover:border-[#ff6200]/50 transition-all font-semibold group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded-sm object-contain"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#ff6200]" />
              </a>
            </div>
          </div>
        </div>

        {/* Network & Mainnet Contract Details Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[11px] text-warm-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-white">Network:</strong> BOT Chain Mainnet (Chain ID 677)
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">Native Token:</strong> BOT
            </span>
            <span>•</span>
            <a
              href="https://rpc.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#ff6200] transition-colors"
            >
              RPC: https://rpc.botchain.ai
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Mainnet Contract:</span>
            <a
              href={`https://scan.botchain.ai/address/${contractAddress}#code`}
              target="_blank"
              rel="noreferrer"
              className="text-[#ff6200] hover:text-[#ff7a1a] hover:underline flex items-center gap-1 font-mono font-bold"
              title="View verified Mainnet contract on BOT Chain Explorer"
            >
              <span>{contractAddress}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Copyright & Architecture Note */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-warm-500">
          <div>
            100% On-Chain Architecture • Zero Centralized Databases • Pure Solidity Verification
          </div>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="text-warm-300 hover:text-[#ff6200] font-semibold flex items-center gap-1 transition-colors"
            >
              <img src="/botchain-logo.png" alt="BOT Chain" className="w-3.5 h-3.5 rounded-sm object-contain" />
              <span>BOT Chain</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
