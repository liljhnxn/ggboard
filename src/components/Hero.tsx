"use client";

import React from "react";
import { useAccount, useConnect } from "wagmi";
import { Users, Swords, Trophy, Flame, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  totalGamers: number;
  totalMatches: number;
  isRegistered: boolean;
  topPlayer?: {
    username: string;
    totalWins: number;
    totalMatches: number;
  };
}

export function Hero({ totalGamers, totalMatches, isRegistered, topPlayer }: HeroProps) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <section id="home" className="relative pt-12 pb-20 overflow-hidden bg-cyber-grid">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#ff6200]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live on Botchain Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161a25] border border-[#ff6200]/30 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6200] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6200]"></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-wide text-warm-200">
                100% On-Chain • Botchain Testnet (968)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
              Your Game. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] via-[#ff5500] to-[#e64000] drop-shadow-[0_0_35px_rgba(255,98,0,0.35)]">
                Your Record.
              </span> <br />
              Your Glory.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-warm-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Track your victories, record your matches, and climb the leaderboard. Your gaming achievements, permanently recorded on-chain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {!isConnected ? (
                <button
                  onClick={() => {
                    const metaMask = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
                    if (metaMask) connect({ connector: metaMask });
                  }}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] text-white font-bold text-sm tracking-wide uppercase shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 group clip-corner-sm"
                >
                  <span>Connect Wallet to Play</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : !isRegistered ? (
                <a
                  href="#profile"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] text-white font-bold text-sm tracking-wide uppercase shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 group clip-corner-sm"
                >
                  <span>Create Gamer Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <a
                  href="#record"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] text-white font-bold text-sm tracking-wide uppercase shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 group clip-corner-sm"
                >
                  <Swords className="w-4 h-4" />
                  <span>Record New Match</span>
                </a>
              )}

              <a
                href="#leaderboard"
                className="px-6 py-3.5 rounded-xl bg-[#141722] hover:bg-[#1b202e] border border-white/10 hover:border-white/20 text-warm-200 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-[#ff6200]" />
                <span>View Leaderboard</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
              <div className="p-4 rounded-xl bg-[#11141c]/80 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-warm-400 text-xs uppercase font-mono mb-1">
                  <Users className="w-3.5 h-3.5 text-[#ff6200]" />
                  <span>Total Gamers</span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {totalGamers}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#11141c]/80 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-warm-400 text-xs uppercase font-mono mb-1">
                  <Swords className="w-3.5 h-3.5 text-[#ff6200]" />
                  <span>Matches Logged</span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {totalMatches}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#11141c]/80 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-warm-400 text-xs uppercase font-mono mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff6200]" />
                  <span>Verification</span>
                </div>
                <div className="font-display font-bold text-lg sm:text-xl text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>Peer Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Leaderboard Preview / Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative card border glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#ff6200]/40 via-amber-500/10 to-transparent blur-md opacity-75" />

              <div className="relative rounded-2xl bg-[#0e111a] border border-white/10 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#ff6200] animate-pulse" />
                    <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
                      Competitive Podium
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Live On-Chain
                  </span>
                </div>

                {/* Leaderboard highlight preview */}
                <div className="my-6 space-y-3">
                  {topPlayer ? (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#1f1915] to-[#141824] border border-[#ff6200]/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ff6200] flex items-center justify-center font-display font-black text-black text-lg shadow-glow">
                          #1
                        </div>
                        <div>
                          <div className="font-bold text-white text-base flex items-center gap-1.5">
                            {topPlayer.username}
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="text-xs text-warm-400 font-mono">
                            {topPlayer.totalMatches} matches played
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-display font-black text-xl text-[#ff6200]">
                          {topPlayer.totalWins} W
                        </span>
                        <div className="text-[10px] uppercase font-mono text-emerald-400">
                          Apex Gamer
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center border border-dashed border-white/10 rounded-xl bg-[#121520]">
                      <Trophy className="w-8 h-8 text-warm-500 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-warm-200">The #1 Rank is Unclaimed!</p>
                      <p className="text-xs text-warm-400 mt-1">
                        Register your gamer profile and record your first match to claim the crown.
                      </p>
                    </div>
                  )}

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 rounded-lg bg-[#121520] border border-white/5 text-left">
                      <div className="text-xs font-bold text-white mb-0.5">Anti-Cheat Rule</div>
                      <div className="text-[11px] text-warm-400">
                        Opponent must confirm results to update stats.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#121520] border border-white/5 text-left">
                      <div className="text-xs font-bold text-white mb-0.5">Zero DBs / No Backend</div>
                      <div className="text-[11px] text-warm-400">
                        100% immutable Solidity state on Botchain.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="#leaderboard"
                    className="text-xs font-mono text-[#ff6200] hover:text-[#ff7a1a] transition-colors inline-flex items-center gap-1"
                  >
                    <span>View all ranked competitors</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

