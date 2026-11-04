"use client";

import React from "react";
import { Shield, ExternalLink, Flame } from "lucide-react";

interface FooterProps {
  contractAddress: string;
}

export function Footer({ contractAddress }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-[#08090d] py-12 text-warm-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff6200] flex items-center justify-center font-display font-black text-black text-base shadow-glow">
              GG
            </div>
            <div>
              <div className="text-white font-display font-bold text-sm tracking-wide">
                GGBOARD ON-CHAIN
              </div>
              <div className="text-[11px] text-warm-500">
                Autonomous, peer-verified competitive scoreboard
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#ff6200] transition-colors"
            >
              RPC: https://rpc.bohr.life
            </a>
            <span>•</span>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#ff6200] transition-colors"
            >
              Botchain Explorer
            </a>
            <span>•</span>
            <span>Chain ID: 968</span>
          </div>

          <div className="text-center md:text-right">
            <div className="text-[11px] text-warm-500">
              Contract Address:
            </div>
            <a
              href={`https://scan.bohr.life/address/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#ff6200] hover:underline flex items-center justify-center md:justify-end gap-1"
            >
              <span>{contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-warm-600">
          No backend • No centralized database • 100% On-Chain Solidity Smart Contract
        </div>
      </div>
    </footer>
  );
}

