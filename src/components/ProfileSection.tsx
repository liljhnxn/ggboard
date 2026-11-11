"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GGBOARD_ABI } from "@/contracts/config";
import { User, Shield, Trophy, XCircle, Percent, Copy, Check, ExternalLink, Loader2, Gamepad2, ArrowRight } from "lucide-react";

interface ProfileSectionProps {
  contractAddress: `0x${string}`;
  profile?: {
    username: string;
    totalWins: number;
    totalLosses: number;
    totalMatches: number;
    isRegistered: boolean;
    registeredAt: bigint;
  };
  isLoadingProfile: boolean;
  onRefresh: () => void;
}

export function ProfileSection({
  contractAddress,
  profile,
  isLoadingProfile,
  onRefresh,
}: ProfileSectionProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [usernameInput, setUsernameInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    data: hash,
    isPending: isRegistering,
    writeContract,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isWaitingTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isTxSuccess) {
      onRefresh();
      setUsernameInput("");
      reset();
    }
  }, [isTxSuccess, onRefresh, reset]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setFormError("Please enter a username.");
      return;
    }
    if (trimmed.length < 2) {
      setFormError("Username must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 32) {
      setFormError("Username cannot exceed 32 characters.");
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: GGBOARD_ABI,
        functionName: "registerProfile",
        args: [trimmed],
      });
    } catch (err: any) {
      setFormError(err?.message || "Failed to initiate registration");
    }
  };

  const winRate =
    profile && profile.totalMatches > 0
      ? Math.round((profile.totalWins / profile.totalMatches) * 100)
      : 0;

  return (
    <section id="profile" className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ff6200] mb-2">
              <Shield className="w-4 h-4" />
              <span>Gamer Identification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
              Gaming Profile
            </h2>
          </div>
          <p className="text-sm text-warm-400 mt-2 md:mt-0 font-mono">
            Identity & match records verified on Botchain Mainnet (677)
          </p>
        </div>

        {/* Not Connected State */}
        {!isConnected ? (
          <div className="rounded-2xl bg-[#0f121a] border border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-[#ff6200]/15 border border-[#ff6200]/30 flex items-center justify-center text-[#ff6200] mx-auto mb-4 shadow-glow">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-2 uppercase">
              Connect Wallet to View Profile
            </h3>
            <p className="text-warm-300 text-sm max-w-md mx-auto mb-6">
              Connect your MetaMask wallet to view your on-chain battle stats, track win rate, or register your gamer tag.
            </p>
            <button
              onClick={() => {
                const metaMask = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
                if (metaMask) connect({ connector: metaMask });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] text-white font-bold text-sm uppercase tracking-wider shadow-glow transition-all inline-flex items-center gap-2"
            >
              <span>Connect MetaMask</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : isLoadingProfile ? (
          <div className="rounded-2xl bg-[#0f121a] border border-white/10 p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#ff6200] animate-spin" />
            <span className="text-sm font-mono text-warm-300">Fetching on-chain gamer profile...</span>
          </div>
        ) : profile?.isRegistered ? (
          /* Registered Profile View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Identity Card */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0f121b] border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6200]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6200] to-[#b33e00] flex items-center justify-center text-white font-display font-black text-2xl shadow-glow clip-corner-sm">
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Registered Fighter
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-warm-400">
                    Gamer Tag
                  </span>
                  <h3 className="font-display font-black text-3xl text-white uppercase tracking-wide">
                    {profile.username}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-[#141824] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-warm-400">
                    <span>Wallet Address</span>
                    <button
                      onClick={handleCopy}
                      className="text-[#ff6200] hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy full address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono text-warm-200 break-all select-all">
                    {address}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-warm-400 font-mono">
                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#ff6200] hover:underline flex items-center gap-1"
                    >
                      <span>Botchain Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>
                      Joined: {profile.registeredAt ? new Date(Number(profile.registeredAt) * 1000).toLocaleDateString() : "Genesis"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Stats Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0f121b] border border-white/10 shadow-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-warm-400">Wins</span>
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">
                    {profile.totalWins}
                  </span>
                  <div className="text-[11px] font-mono text-warm-400 mt-1">Confirmed victories</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f121b] border border-white/10 shadow-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-warm-400">Losses</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <span className="font-display font-black text-3xl sm:text-4xl text-rose-400">
                    {profile.totalLosses}
                  </span>
                  <div className="text-[11px] font-mono text-warm-400 mt-1">Defeats accepted</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f121b] border border-white/10 shadow-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-warm-400">Total Matches</span>
                  <Shield className="w-4 h-4 text-[#ff6200]" />
                </div>
                <div>
                  <span className="font-display font-black text-3xl sm:text-4xl text-white">
                    {profile.totalMatches}
                  </span>
                  <div className="text-[11px] font-mono text-warm-400 mt-1">Completed bouts</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f121b] border border-white/10 shadow-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-warm-400">Win Rate</span>
                  <Percent className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="font-display font-black text-3xl sm:text-4xl text-amber-400">
                    {winRate}%
                  </span>
                  <div className="w-full bg-[#1b202e] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="col-span-2 sm:col-span-4 p-4 rounded-xl bg-[#131722] border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-warm-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>On-chain profile active & ready for matches</span>
                </div>
                <button
                  onClick={onRefresh}
                  className="text-[#ff6200] hover:underline"
                >
                  Refresh stats
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Unregistered: Registration Form */
          <div className="max-w-2xl mx-auto rounded-2xl bg-[#0f121b] border border-[#ff6200]/30 p-8 sm:p-10 shadow-glow relative">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-xl bg-[#ff6200]/15 text-[#ff6200] mb-3">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wide">
                Register Your Gamer Profile
              </h3>
              <p className="text-warm-300 text-sm mt-1">
                Your wallet is connected, but you haven't created your on-chain gamer tag yet. Each wallet can register once.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-warm-300 mb-1.5">
                  Choose Gamer Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setFormError("");
                  }}
                  placeholder="e.g. ShadowViper, ApexStriker"
                  maxLength={32}
                  disabled={isRegistering || isWaitingTx}
                  className="w-full px-4 py-3 rounded-xl bg-[#141824] border border-white/10 text-white placeholder-warm-500 focus:outline-none focus:border-[#ff6200] focus:ring-1 focus:ring-[#ff6200] transition-colors font-sans"
                />
                <span className="text-[11px] font-mono text-warm-500 mt-1 block">
                  1-32 characters. Permanently tied to wallet on Botchain.
                </span>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {formError}
                </div>
              )}

              {writeError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {writeError.message.includes("User rejected")
                    ? "Transaction rejected in wallet."
                    : writeError.message}
                </div>
              )}

              {isWaitingTx && (
                <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Registering gamer handle on BOT Chain Mainnet... Please wait for confirmation.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isRegistering || isWaitingTx || !usernameInput.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2"
              >
                {isRegistering || isWaitingTx ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming on-chain...</span>
                  </>
                ) : (
                  <>
                    <span>Register Gamer Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}

