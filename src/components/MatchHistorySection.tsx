"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { MatchRecordData } from "./PendingMatchesSection";
import { History, Search, Trophy, XCircle, Clock, ExternalLink, ShieldCheck, Filter } from "lucide-react";

interface MatchHistorySectionProps {
  matches: MatchRecordData[];
  registeredPlayers?: Array<{
    playerAddress: string;
    username: string;
  }>;
  isLoading: boolean;
}

export function MatchHistorySection({
  matches,
  registeredPlayers = [],
  isLoading,
}: MatchHistorySectionProps) {
  const { address } = useAccount();
  const [filterType, setFilterType] = useState<"all" | "mine" | "confirmed" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getPlayerLabel = (addr: string) => {
    const found = registeredPlayers.find(
      (p) => p.playerAddress.toLowerCase() === addr.toLowerCase()
    );
    if (found) return found.username;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const filteredMatches = matches.filter((m) => {
    // Type filter
    if (filterType === "mine") {
      if (!address) return false;
      const isPart =
        m.playerOne.toLowerCase() === address.toLowerCase() ||
        m.playerTwo.toLowerCase() === address.toLowerCase();
      if (!isPart) return false;
    } else if (filterType === "confirmed") {
      if (m.status !== 1) return false;
    } else if (filterType === "rejected") {
      if (m.status !== 2) return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const p1Label = getPlayerLabel(m.playerOne).toLowerCase();
      const p2Label = getPlayerLabel(m.playerTwo).toLowerCase();
      const p1Addr = m.playerOne.toLowerCase();
      const p2Addr = m.playerTwo.toLowerCase();
      const matchIdStr = m.matchId.toString();

      return (
        p1Label.includes(term) ||
        p2Label.includes(term) ||
        p1Addr.includes(term) ||
        p2Addr.includes(term) ||
        matchIdStr.includes(term)
      );
    }

    return true;
  });

  return (
    <section id="history" className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6200] mb-2">
              <History className="w-4 h-4" />
              <span>Immutable Ledger</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
              Match History
            </h2>
          </div>
          <p className="text-sm text-warm-400 mt-2 md:mt-0 font-mono">
            Every match result cryptographically verified on Botchain
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tab Filter */}
          <div className="inline-flex p-1 rounded-xl bg-[#121520] border border-white/5 overflow-x-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                filterType === "all"
                  ? "bg-[#ff6200] text-white font-bold"
                  : "text-warm-400 hover:text-white"
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilterType("mine")}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                filterType === "mine"
                  ? "bg-[#ff6200] text-white font-bold"
                  : "text-warm-400 hover:text-white"
              }`}
            >
              My Matches
            </button>
            <button
              onClick={() => setFilterType("confirmed")}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                filterType === "confirmed"
                  ? "bg-[#ff6200] text-white font-bold"
                  : "text-warm-400 hover:text-white"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterType("rejected")}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
                filterType === "rejected"
                  ? "bg-[#ff6200] text-white font-bold"
                  : "text-warm-400 hover:text-white"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by player or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121520] border border-white/5 text-xs text-white placeholder-warm-500 focus:outline-none focus:border-[#ff6200] font-mono"
            />
          </div>
        </div>

        {/* Matches Feed / Table */}
        {isLoading ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f121b] border border-white/10">
            <span className="text-xs font-mono text-warm-400">Loading match records...</span>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f121b] border border-white/10 text-warm-400">
            <History className="w-10 h-10 mx-auto text-warm-600 mb-3 opacity-60" />
            <h3 className="font-display font-bold text-lg text-white mb-1 uppercase">
              No Matches Found
            </h3>
            <p className="text-xs text-warm-400 max-w-md mx-auto">
              {searchTerm
                ? "No match records match your search criteria."
                : "No matches recorded in this category yet. Submit the first match record above!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((m) => {
              const isUserP1 = address && m.playerOne.toLowerCase() === address.toLowerCase();
              const isUserP2 = address && m.playerTwo.toLowerCase() === address.toLowerCase();
              const isUserInMatch = isUserP1 || isUserP2;
              const userWon = isUserInMatch && address && m.winner.toLowerCase() === address.toLowerCase();

              // Outcome styling: Green for win, Red for loss
              let cardBorder = "border-white/5";
              let badgeBg = "bg-white/5 text-warm-300";
              let statusLabel = "Pending";

              if (m.status === 1) {
                // Confirmed
                statusLabel = "Confirmed";
                if (isUserInMatch) {
                  if (userWon) {
                    cardBorder = "border-emerald-500/30 bg-emerald-950/10";
                    badgeBg = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
                  } else {
                    cardBorder = "border-rose-500/30 bg-rose-950/10";
                    badgeBg = "bg-rose-500/20 text-rose-400 border border-rose-500/40";
                  }
                } else {
                  cardBorder = "border-white/10";
                  badgeBg = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
                }
              } else if (m.status === 2) {
                // Rejected
                statusLabel = "Rejected";
                cardBorder = "border-rose-500/20 opacity-80";
                badgeBg = "bg-rose-500/20 text-rose-400 border border-rose-500/30";
              } else {
                // Pending
                statusLabel = "Pending Confirmation";
                badgeBg = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
              }

              return (
                <div
                  key={m.matchId.toString()}
                  className={`p-4 sm:p-5 rounded-2xl bg-[#0f121b] border ${cardBorder} shadow-card transition-all hover:border-[#ff6200]/30`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Match Info & Combatants */}
                    <div className="flex items-center gap-4">
                      {/* Match Status Indicator */}
                      <div className="shrink-0">
                        {m.status === 1 ? (
                          isUserInMatch ? (
                            userWon ? (
                              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-display font-black text-xs">
                                WIN
                              </div>
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-display font-black text-xs">
                                LOSS
                              </div>
                            )
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#141824] border border-white/10 flex items-center justify-center text-[#ff6200] font-mono text-xs font-bold">
                              #{m.matchId.toString()}
                            </div>
                          )
                        ) : m.status === 2 ? (
                          <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                            <XCircle className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Clock className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Combatants & Scores */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${m.winner.toLowerCase() === m.playerOne.toLowerCase() && m.status === 1 ? "text-emerald-400 font-display font-extrabold" : "text-white"}`}>
                            {getPlayerLabel(m.playerOne)}
                            {isUserP1 && " (You)"}
                          </span>
                          
                          <span className="px-2 py-0.5 rounded bg-[#161a27] text-xs font-display font-black text-[#ff6200] border border-white/5">
                            {m.playerOneScore} - {m.playerTwoScore}
                          </span>

                          <span className={`font-bold text-sm ${m.winner.toLowerCase() === m.playerTwo.toLowerCase() && m.status === 1 ? "text-emerald-400 font-display font-extrabold" : "text-white"}`}>
                            {getPlayerLabel(m.playerTwo)}
                            {isUserP2 && " (You)"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono text-warm-400">
                          <span>Match ID: #{m.matchId.toString()}</span>
                          <span>•</span>
                          <span>{new Date(Number(m.timestamp) * 1000).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status badge & winner tag */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider ${badgeBg}`}>
                        {statusLabel}
                      </span>
                      {m.status === 1 && (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>Winner: {getPlayerLabel(m.winner)}</span>
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

