"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Trophy, Medal, Flame, ExternalLink, Shield, Percent, Swords, Search } from "lucide-react";

export interface RankedPlayer {
  playerAddress: string;
  username: string;
  totalWins: number;
  totalLosses: number;
  totalMatches: number;
  registeredAt: bigint;
}

interface LeaderboardSectionProps {
  leaderboard: RankedPlayer[];
  isLoading: boolean;
}

export function LeaderboardSection({ leaderboard, isLoading }: LeaderboardSectionProps) {
  const { address } = useAccount();
  const [search, setSearch] = useState("");

  const filteredLeaderboard = leaderboard.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return p.username.toLowerCase().includes(term) || p.playerAddress.toLowerCase().includes(term);
  });

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <section id="leaderboard" className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6200] mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Standings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
              Public Leaderboard
            </h2>
          </div>
          <p className="text-sm text-warm-400 mt-2 md:mt-0 font-mono">
            Ranked by confirmed wins • Tiebreaker: fewer losses
          </p>
        </div>

        {/* Top 3 Podium Highlights (if at least 1 registered player) */}
        {!isLoading && leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 p-6 rounded-2xl bg-[#0e111a] border border-slate-400/20 shadow-card relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-500/40 flex items-center justify-center font-display font-black text-slate-300 text-lg">
                    #2
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Silver Rival
                  </span>
                </div>
                {leaderboard[1] ? (
                  <>
                    <h3 className="font-display font-bold text-2xl text-white truncate mb-1">
                      {leaderboard[1].username}
                    </h3>
                    <p className="text-xs font-mono text-warm-400 truncate mb-4">
                      {truncate(leaderboard[1].playerAddress)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#141824] border border-white/5">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Wins</div>
                        <div className="font-display font-extrabold text-xl text-emerald-400">
                          {leaderboard[1].totalWins}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Losses</div>
                        <div className="font-display font-extrabold text-xl text-rose-400">
                          {leaderboard[1].totalLosses}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-warm-500 font-mono">
                    Position available
                  </div>
                )}
              </div>
            </div>

            {/* 1st Place - Apex Champion */}
            <div className="order-1 md:order-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1c1613] to-[#0e111a] border border-[#ff6200]/50 shadow-glow relative overflow-hidden flex flex-col justify-between scale-100 md:scale-105 z-10 clip-corner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6200]/15 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#e64000] flex items-center justify-center font-display font-black text-white text-xl shadow-glow">
                    #1
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#ff6200] uppercase tracking-wider bg-[#ff6200]/15 px-2.5 py-1 rounded-full border border-[#ff6200]/30">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    <span>Apex Champion</span>
                  </span>
                </div>
                {leaderboard[0] ? (
                  <>
                    <h3 className="font-display font-black text-3xl text-white truncate mb-1">
                      {leaderboard[0].username}
                    </h3>
                    <p className="text-xs font-mono text-warm-300 truncate mb-4">
                      {truncate(leaderboard[0].playerAddress)}
                    </p>
                    <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#171b29] border border-white/10 text-center">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Wins</div>
                        <div className="font-display font-black text-2xl text-emerald-400">
                          {leaderboard[0].totalWins}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Losses</div>
                        <div className="font-display font-black text-2xl text-rose-400">
                          {leaderboard[0].totalLosses}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Rate</div>
                        <div className="font-display font-black text-2xl text-amber-400">
                          {leaderboard[0].totalMatches > 0
                            ? Math.round((leaderboard[0].totalWins / leaderboard[0].totalMatches) * 100)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-warm-500 font-mono">
                    No champion crowned yet
                  </div>
                )}
              </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 p-6 rounded-2xl bg-[#0e111a] border border-amber-700/20 shadow-card relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-700/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-700/40 flex items-center justify-center font-display font-black text-amber-500 text-lg">
                    #3
                  </div>
                  <span className="text-xs font-mono text-amber-500/80 uppercase tracking-widest">
                    Bronze Contender
                  </span>
                </div>
                {leaderboard[2] ? (
                  <>
                    <h3 className="font-display font-bold text-2xl text-white truncate mb-1">
                      {leaderboard[2].username}
                    </h3>
                    <p className="text-xs font-mono text-warm-400 truncate mb-4">
                      {truncate(leaderboard[2].playerAddress)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#141824] border border-white/5">
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Wins</div>
                        <div className="font-display font-extrabold text-xl text-emerald-400">
                          {leaderboard[2].totalWins}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-warm-400">Losses</div>
                        <div className="font-display font-extrabold text-xl text-rose-400">
                          {leaderboard[2].totalLosses}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-warm-500 font-mono">
                    Position available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-xs font-mono text-warm-400">
            Total Registered Fighters: <strong className="text-white">{leaderboard.length}</strong>
          </span>
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ranked gamers..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#121520] border border-white/10 text-xs text-white placeholder-warm-500 focus:outline-none focus:border-[#ff6200] font-mono"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-2xl bg-[#0f121b] border border-white/10 overflow-hidden shadow-card">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-warm-400">
              Loading on-chain rankings...
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="p-12 text-center text-warm-400">
              <Trophy className="w-10 h-10 mx-auto text-warm-600 mb-3 opacity-60" />
              <h3 className="font-display font-bold text-lg text-white mb-1 uppercase">
                No Gamers Found
              </h3>
              <p className="text-xs text-warm-400 max-w-md mx-auto">
                {search
                  ? "No player matches your search keyword."
                  : "No players have registered yet. Connect your wallet and be the first!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#141824] text-[11px] font-mono uppercase text-warm-400 tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Rank</th>
                    <th className="py-3 px-4 sm:px-6">Gamer Handle</th>
                    <th className="py-3 px-4 sm:px-6 hidden sm:table-cell">Wallet Address</th>
                    <th className="py-3 px-4 text-center">Wins</th>
                    <th className="py-3 px-4 text-center">Losses</th>
                    <th className="py-3 px-4 text-center">Matches</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Win Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredLeaderboard.map((player, idx) => {
                    const isCurrentUser =
                      address && player.playerAddress.toLowerCase() === address.toLowerCase();
                    const rank = idx + 1;
                    const winPercent =
                      player.totalMatches > 0
                        ? Math.round((player.totalWins / player.totalMatches) * 100)
                        : 0;

                    const isTopThree = rank <= 3;

                    return (
                      <tr
                        key={player.playerAddress}
                        className={`transition-colors hover:bg-white/[0.02] ${
                          isCurrentUser ? "bg-[#ff6200]/10 font-medium" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          {rank === 1 ? (
                            <span className="w-7 h-7 rounded-lg bg-[#ff6200] text-black font-display font-black text-xs inline-flex items-center justify-center shadow-glow">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="w-7 h-7 rounded-lg bg-slate-400 text-black font-display font-black text-xs inline-flex items-center justify-center">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-display font-black text-xs inline-flex items-center justify-center">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-warm-400 pl-2">
                              #{rank}
                            </span>
                          )}
                        </td>

                        {/* Gamer Tag */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isTopThree ? "text-white font-display text-base" : "text-warm-200"}`}>
                              {player.username}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#ff6200]/20 text-[#ff6200] border border-[#ff6200]/40">
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Wallet Address */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap hidden sm:table-cell font-mono text-xs text-warm-400">
                          <a
                            href={`https://scan.bohr.life/address/${player.playerAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#ff6200] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{truncate(player.playerAddress)}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </td>

                        {/* Wins */}
                        <td className="py-4 px-4 text-center whitespace-nowrap font-display font-black text-emerald-400 text-base">
                          {player.totalWins}
                        </td>

                        {/* Losses */}
                        <td className="py-4 px-4 text-center whitespace-nowrap font-display font-black text-rose-400 text-base">
                          {player.totalLosses}
                        </td>

                        {/* Matches */}
                        <td className="py-4 px-4 text-center whitespace-nowrap font-mono text-xs text-warm-300">
                          {player.totalMatches}
                        </td>

                        {/* Win Rate */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap font-mono text-xs font-bold text-amber-400">
                          {winPercent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

