"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { GGBOARD_ABI } from "@/contracts/config";
import { Swords, AlertCircle, CheckCircle2, Loader2, Trophy, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

interface RecordMatchSectionProps {
  contractAddress: `0x${string}`;
  isRegistered: boolean;
  registeredPlayers?: Array<{
    playerAddress: string;
    username: string;
  }>;
  onRefresh: () => void;
}

export function RecordMatchSection({
  contractAddress,
  isRegistered,
  registeredPlayers = [],
  onRefresh,
}: RecordMatchSectionProps) {
  const { address } = useAccount();
  const [opponent, setOpponent] = useState("");
  const [myScore, setMyScore] = useState<string>("");
  const [opponentScore, setOpponentScore] = useState<string>("");
  const [validationError, setValidationError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    data: hash,
    isPending: isSubmitting,
    writeContract,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isTxSuccess) {
      setShowSuccessModal(true);
      setOpponent("");
      setMyScore("");
      setOpponentScore("");
      onRefresh();
      reset();
    }
  }, [isTxSuccess, onRefresh, reset]);

  // Projected winner calculation
  const parsedMyScore = parseInt(myScore, 10);
  const parsedOpponentScore = parseInt(opponentScore, 10);
  const hasValidScores = !isNaN(parsedMyScore) && !isNaN(parsedOpponentScore) && parsedMyScore >= 0 && parsedOpponentScore >= 0;

  const projectedWinner = useMemo(() => {
    if (!hasValidScores) return null;
    if (parsedMyScore === parsedOpponentScore) return "tied";
    return parsedMyScore > parsedOpponentScore ? "you" : "opponent";
  }, [hasValidScores, parsedMyScore, parsedOpponentScore]);

  // Find opponent in registered list if any
  const opponentProfile = useMemo(() => {
    if (!opponent || !isAddress(opponent)) return null;
    return registeredPlayers.find(
      (p) => p.playerAddress.toLowerCase() === opponent.toLowerCase()
    );
  }, [opponent, registeredPlayers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!isRegistered) {
      setValidationError("You must register your gaming profile before recording matches.");
      return;
    }

    if (!isAddress(opponent)) {
      setValidationError("Please enter a valid opponent wallet address (0x...).");
      return;
    }

    if (address && opponent.toLowerCase() === address.toLowerCase()) {
      setValidationError("Cannot record a match against your own wallet.");
      return;
    }

    if (!hasValidScores) {
      setValidationError("Please enter valid numeric scores for both players.");
      return;
    }

    if (parsedMyScore === parsedOpponentScore) {
      setValidationError("Scores cannot be tied. A clear winner must be determined.");
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: GGBOARD_ABI,
        functionName: "submitMatch",
        args: [opponent as `0x${string}`, parsedMyScore, parsedOpponentScore],
      });
    } catch (err: any) {
      setValidationError(err?.message || "Failed to submit match transaction");
    }
  };

  return (
    <section id="record" className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6200] mb-2">
              <Swords className="w-4 h-4" />
              <span>Match Verification Protocol</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
              Record a Match
            </h2>
          </div>
          <p className="text-sm text-warm-400 mt-2 md:mt-0 font-mono">
            Peer-verified: Opponent confirmation required
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Submission Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0f121b] border border-white/10 p-6 sm:p-8 shadow-card relative">
              
              {!isRegistered && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
                  <span>
                    You must register a gaming profile in the Profile section above before submitting match results.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Opponent Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-warm-300">
                      Opponent Wallet Address
                    </label>
                    {opponentProfile && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{opponentProfile.username}</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => {
                      setOpponent(e.target.value.trim());
                      setValidationError("");
                    }}
                    placeholder="0x..."
                    disabled={!isRegistered || isSubmitting || isWaitingTx}
                    className="w-full px-4 py-3 rounded-xl bg-[#141824] border border-white/10 text-white placeholder-warm-500 font-mono text-sm focus:outline-none focus:border-[#ff6200] focus:ring-1 focus:ring-[#ff6200] transition-colors"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-warm-500">
                      Quick select from active rivals:
                    </span>
                    {registeredPlayers
                      .filter((p) => address && p.playerAddress.toLowerCase() !== address.toLowerCase())
                      .slice(0, 3)
                      .map((p) => (
                        <button
                          type="button"
                          key={p.playerAddress}
                          onClick={() => setOpponent(p.playerAddress)}
                          className="px-2 py-0.5 rounded bg-[#181d2a] hover:bg-[#202738] border border-white/5 text-[11px] font-mono text-warm-300 hover:text-white transition-colors"
                        >
                          {p.username}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Score inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-warm-300 mb-2">
                      Your Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={myScore}
                      onChange={(e) => {
                        setMyScore(e.target.value);
                        setValidationError("");
                      }}
                      placeholder="0"
                      disabled={!isRegistered || isSubmitting || isWaitingTx}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0e1119] border border-white/10 text-2xl font-display font-black text-white text-center focus:outline-none focus:border-[#ff6200]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#131722] border border-white/5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-warm-300 mb-2">
                      Opponent's Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={opponentScore}
                      onChange={(e) => {
                        setOpponentScore(e.target.value);
                        setValidationError("");
                      }}
                      placeholder="0"
                      disabled={!isRegistered || isSubmitting || isWaitingTx}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0e1119] border border-white/10 text-2xl font-display font-black text-white text-center focus:outline-none focus:border-[#ff6200]"
                    />
                  </div>
                </div>

                {/* Live Projected Result Card */}
                {hasValidScores && (
                  <div className="p-3.5 rounded-xl bg-[#131622] border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-warm-400">Projected Outcome:</span>
                    {projectedWinner === "tied" ? (
                      <span className="text-amber-400 font-bold">Scores tied — must have a winner!</span>
                    ) : projectedWinner === "you" ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>You Win ({parsedMyScore} - {parsedOpponentScore})</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">
                        Opponent Wins ({parsedOpponentScore} - {parsedMyScore})
                      </span>
                    )}
                  </div>
                )}

                {/* Validation and error messages */}
                {validationError && (
                  <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {writeError && (
                  <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    {writeError.message.includes("User rejected")
                      ? "Transaction canceled by user in wallet."
                      : writeError.message}
                  </div>
                )}

                {isWaitingTx && (
                  <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Publishing match to Botchain testnet... Pending confirmation.</span>
                  </div>
                )}

                {/* Submit Match Button */}
                <button
                  type="submit"
                  disabled={!isRegistered || isSubmitting || isWaitingTx}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2 clip-corner-sm"
                >
                  {isSubmitting || isWaitingTx ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Botchain...</span>
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4" />
                      <span>Submit Match</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Verification Protocol Explainer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-[#0f121b] border border-white/10 p-6 shadow-card space-y-4">
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6200]" />
                How Match Verification Works
              </h3>

              <div className="space-y-3 text-xs text-warm-300 leading-relaxed font-sans">
                <div className="p-3 rounded-xl bg-[#131622] border border-white/5">
                  <div className="font-bold text-white mb-1 font-mono text-[11px] text-[#ff6200]">
                    STEP 1: SUBMISSION
                  </div>
                  <div>
                    You submit the score. The contract creates a <strong className="text-white">Pending Match Record</strong> on Botchain.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131622] border border-white/5">
                  <div className="font-bold text-white mb-1 font-mono text-[11px] text-[#ff6200]">
                    STEP 2: PEER CONFIRMATION
                  </div>
                  <div>
                    Your opponent must review and confirm the result from their wallet. If the scores are incorrect, they can reject it.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131622] border border-white/5">
                  <div className="font-bold text-white mb-1 font-mono text-[11px] text-[#ff6200]">
                    STEP 3: STATS UPDATE
                  </div>
                  <div>
                    Only when the opponent confirms does the contract increment the winner's wins, loser's losses, and leaderboard rank!
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-warm-400">
                Network: Botchain Testnet • Chain ID: 968
              </div>
            </div>
          </div>

        </div>

        {/* Success Modal / Notification */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="max-w-md w-full rounded-2xl bg-[#10141f] border border-[#ff6200]/40 p-6 sm:p-8 text-center shadow-2xl relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide mb-2">
                Match Record Submitted!
              </h3>
              <p className="text-sm text-warm-300 leading-relaxed mb-6 font-sans">
                Your match has been recorded on Botchain with <strong className="text-amber-400">Pending status</strong>.
                <br /><br />
                The opponent must confirm this result before it will count toward either player's wins, losses, and leaderboard rankings.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#pending"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#ff6200] hover:bg-[#ff731a] text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>View Pending Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="py-3 px-5 rounded-xl bg-[#171b29] hover:bg-[#202538] text-warm-200 text-xs font-mono transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

