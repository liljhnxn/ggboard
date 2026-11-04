"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GGBOARD_ABI } from "@/contracts/config";
import { Clock, Check, X, Shield, Swords, AlertCircle, Loader2, Trophy, User } from "lucide-react";

export interface MatchRecordData {
  matchId: bigint;
  playerOne: string;
  playerTwo: string;
  playerOneScore: number;
  playerTwoScore: number;
  winner: string;
  status: number; // 0: Pending, 1: Confirmed, 2: Rejected
  timestamp: bigint;
}

interface PendingMatchesSectionProps {
  contractAddress: `0x${string}`;
  pendingMatches: MatchRecordData[];
  registeredPlayers?: Array<{
    playerAddress: string;
    username: string;
  }>;
  isLoading: boolean;
  onRefresh: () => void;
}

export function PendingMatchesSection({
  contractAddress,
  pendingMatches,
  registeredPlayers = [],
  isLoading,
  onRefresh,
}: PendingMatchesSectionProps) {
  const { address, isConnected } = useAccount();
  const [activeActionMatchId, setActiveActionMatchId] = useState<bigint | null>(null);

  const {
    data: hash,
    isPending: isSubmittingAction,
    writeContract,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isTxSuccess) {
      setActiveActionMatchId(null);
      onRefresh();
      reset();
    }
  }, [isTxSuccess, onRefresh, reset]);

  const getUsername = (addr: string) => {
    const found = registeredPlayers.find(
      (p) => p.playerAddress.toLowerCase() === addr.toLowerCase()
    );
    return found ? found.username : `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConfirm = (matchId: bigint) => {
    setActiveActionMatchId(matchId);
    writeContract({
      address: contractAddress,
      abi: GGBOARD_ABI,
      functionName: "confirmMatch",
      args: [matchId],
    });
  };

  const handleReject = (matchId: bigint) => {
    setActiveActionMatchId(matchId);
    writeContract({
      address: contractAddress,
      abi: GGBOARD_ABI,
      functionName: "rejectMatch",
      args: [matchId],
    });
  };

  // Filter pending matches related to connected wallet
  const relevantPending = pendingMatches.filter((m) => {
    if (m.status !== 0) return false;
    if (!address) return true;
    return (
      m.playerOne.toLowerCase() === address.toLowerCase() ||
      m.playerTwo.toLowerCase() === address.toLowerCase()
    );
  });

  return (
    <section id="pending" className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6200] mb-2">
              <Clock className="w-4 h-4" />
              <span>Awaiting Peer Signature</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase flex items-center gap-3">
              <span>Pending Matches</span>
              {relevantPending.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#ff6200] text-white">
                  {relevantPending.length}
                </span>
              )}
            </h2>
          </div>
          <p className="text-sm text-warm-400 mt-2 md:mt-0 font-mono">
            Requires opponent confirmation before updating leaderboard
          </p>
        </div>

        {writeError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {writeError.message.includes("User rejected")
                ? "Transaction canceled in wallet."
                : writeError.message}
            </span>
          </div>
        )}

        {isWaitingTx && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Updating match state on Botchain Testnet... Please wait.</span>
          </div>
        )}

        {/* List of Pending Matches */}
        {isLoading ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f121b] border border-white/10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#ff6200] animate-spin" />
            <span className="text-xs font-mono text-warm-400">Loading pending matches from contract...</span>
          </div>
        ) : relevantPending.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f121b] border border-white/10 text-warm-400">
            <Clock className="w-10 h-10 mx-auto text-warm-600 mb-3 opacity-60" />
            <h3 className="font-display font-bold text-lg text-white mb-1 uppercase">
              No Pending Match Confirmations
            </h3>
            <p className="text-xs text-warm-400 max-w-md mx-auto font-sans">
              You have no matches waiting for your confirmation or pending verification from rivals. Record a new match to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantPending.map((match) => {
              const isOpponent = address && match.playerTwo.toLowerCase() === address.toLowerCase();
              const isSubmitter = address && match.playerOne.toLowerCase() === address.toLowerCase();
              const isProcessingThis =
                activeActionMatchId === match.matchId && (isSubmittingAction || isWaitingTx);

              return (
                <div
                  key={match.matchId.toString()}
                  className={`p-6 rounded-2xl bg-[#0f121b] border ${
                    isOpponent ? "border-[#ff6200]/40 shadow-glow" : "border-white/10"
                  } relative overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    {/* Header: Match ID + Role Badge */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <span className="text-xs font-mono font-bold text-warm-400">
                        MATCH #{match.matchId.toString()}
                      </span>
                      {isOpponent ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#ff6200]/20 text-[#ff7a1a] border border-[#ff6200]/40 font-bold animate-pulse">
                          Action Required
                        </span>
                      ) : isSubmitter ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Waiting for Opponent
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-white/5 text-warm-400">
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Battle Matchup Visual */}
                    <div className="grid grid-cols-5 items-center gap-2 mb-4">
                      {/* Player 1 */}
                      <div className="col-span-2 text-center p-3 rounded-xl bg-[#131722] border border-white/5">
                        <div className="text-[11px] font-mono text-warm-400 truncate mb-1">
                          {match.playerOne.toLowerCase() === address?.toLowerCase() ? "You (Submitter)" : getUsername(match.playerOne)}
                        </div>
                        <div className="font-display font-black text-2xl sm:text-3xl text-white">
                          {match.playerOneScore}
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="col-span-1 text-center font-display font-black text-sm text-[#ff6200]">
                        VS
                      </div>

                      {/* Player 2 */}
                      <div className="col-span-2 text-center p-3 rounded-xl bg-[#131722] border border-white/5">
                        <div className="text-[11px] font-mono text-warm-400 truncate mb-1">
                          {match.playerTwo.toLowerCase() === address?.toLowerCase() ? "You (Opponent)" : getUsername(match.playerTwo)}
                        </div>
                        <div className="font-display font-black text-2xl sm:text-3xl text-white">
                          {match.playerTwoScore}
                        </div>
                      </div>
                    </div>

                    {/* Reported Winner */}
                    <div className="p-2.5 rounded-lg bg-[#141825] border border-white/5 mb-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-warm-400">Reported Winner:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{getUsername(match.winner)}</span>
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-warm-500 mb-4">
                      Submitted: {new Date(Number(match.timestamp) * 1000).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  {isOpponent ? (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <p className="text-[11px] text-warm-300 font-mono">
                        Did this match happen with these exact scores?
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleConfirm(match.matchId)}
                          disabled={isProcessingThis}
                          className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          {isProcessingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Confirm Result</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(match.matchId)}
                          disabled={isProcessingThis}
                          className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 disabled:opacity-50 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {isProcessingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              <span>Reject Result</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-white/5 text-xs text-warm-400 font-mono flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span>Opponent ({getUsername(match.playerTwo)}) must confirm this result.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

