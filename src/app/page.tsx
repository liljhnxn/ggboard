"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { GGBOARD_ABI, DEFAULT_CONTRACT_ADDRESS } from "@/contracts/config";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProfileSection } from "@/components/ProfileSection";
import { RecordMatchSection } from "@/components/RecordMatchSection";
import { PendingMatchesSection, MatchRecordData } from "@/components/PendingMatchesSection";
import { MatchHistorySection } from "@/components/MatchHistorySection";
import { LeaderboardSection, RankedPlayer } from "@/components/LeaderboardSection";
import { Footer } from "@/components/Footer";
import { ExternalLink } from "lucide-react";
import { isAddress } from "viem";

export default function Home() {
  const { address } = useAccount();

  // Active Mainnet Contract Address (strictly Mainnet)
  const contractAddress: `0x${string}` = DEFAULT_CONTRACT_ADDRESS;

  // Clear any legacy testnet cached address from previous sessions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ggboard_contract_address");
    }
  }, []);

  // 1. Read Total Gamers
  const {
    data: rawTotalGamers,
    refetch: refetchGamers,
  } = useReadContract({
    address: contractAddress,
    abi: GGBOARD_ABI,
    functionName: "totalGamers",
  });

  // 2. Read Total Matches
  const {
    data: rawTotalMatches,
    refetch: refetchMatchesCount,
  } = useReadContract({
    address: contractAddress,
    abi: GGBOARD_ABI,
    functionName: "totalMatches",
  });

  // 3. Read Player Profile
  const {
    data: rawProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useReadContract({
    address: contractAddress,
    abi: GGBOARD_ABI,
    functionName: "getPlayerProfile",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isAddress(contractAddress),
    },
  });

  // 4. Read All Matches
  const {
    data: rawAllMatches,
    isLoading: isLoadingMatches,
    refetch: refetchAllMatches,
  } = useReadContract({
    address: contractAddress,
    abi: GGBOARD_ABI,
    functionName: "getAllMatches",
    query: {
      enabled: isAddress(contractAddress),
    },
  });

  // 5. Read Leaderboard
  const {
    data: rawLeaderboard,
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard,
  } = useReadContract({
    address: contractAddress,
    abi: GGBOARD_ABI,
    functionName: "getLeaderboard",
    query: {
      enabled: isAddress(contractAddress),
    },
  });

  // Refetch everything
  const refetchAll = () => {
    refetchGamers();
    refetchMatchesCount();
    refetchProfile();
    refetchAllMatches();
    refetchLeaderboard();
  };

  // Format profile
  const formattedProfile = rawProfile
    ? {
        username: rawProfile.username,
        totalWins: Number(rawProfile.totalWins),
        totalLosses: Number(rawProfile.totalLosses),
        totalMatches: Number(rawProfile.totalMatches),
        isRegistered: Boolean(rawProfile.isRegistered),
        registeredAt: BigInt(rawProfile.registeredAt),
      }
    : undefined;

  // Format leaderboard
  const formattedLeaderboard: RankedPlayer[] = (rawLeaderboard || []).map((p) => ({
    playerAddress: p.playerAddress,
    username: p.username,
    totalWins: Number(p.totalWins),
    totalLosses: Number(p.totalLosses),
    totalMatches: Number(p.totalMatches),
    registeredAt: BigInt(p.registeredAt),
  }));

  // Format all matches
  const formattedMatches: MatchRecordData[] = (rawAllMatches || []).map((m) => ({
    matchId: BigInt(m.matchId),
    playerOne: m.playerOne,
    playerTwo: m.playerTwo,
    playerOneScore: Number(m.playerOneScore),
    playerTwoScore: Number(m.playerTwoScore),
    winner: m.winner,
    status: Number(m.status),
    timestamp: BigInt(m.timestamp),
  }));

  // Registered players list for quick mention/select
  const registeredPlayers = formattedLeaderboard.map((p) => ({
    playerAddress: p.playerAddress,
    username: p.username,
  }));

  const totalGamers = rawTotalGamers ? Number(rawTotalGamers) : 0;
  const totalMatches = rawTotalMatches ? Number(rawTotalMatches) : 0;
  const topPlayer = formattedLeaderboard.length > 0 ? formattedLeaderboard[0] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0e] text-[#f3f4f6]">
      {/* Navigation */}
      <Navbar
        username={formattedProfile?.isRegistered ? formattedProfile.username : undefined}
        isRegistered={formattedProfile?.isRegistered}
      />

      {/* Verified Mainnet Contract Top Telemetry Bar */}
      <div className="bg-[#0e111a] border-b border-white/5 py-2 px-4 text-[11px] font-mono text-warm-300">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          {/* Mainnet status & address */}
          <div className="flex items-center gap-2.5 truncate">
            {/* BOT Chain official logo */}
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="w-4 h-4 rounded object-contain shrink-0"
            />
            <span className="text-emerald-400 font-bold tracking-wide">BOT Chain Mainnet (677):</span>
            <a
              href={`https://scan.botchain.ai/address/${contractAddress}#code`}
              target="_blank"
              rel="noreferrer"
              className="text-[#ff6200] hover:text-[#ff7a1a] hover:underline font-mono truncate flex items-center gap-1 font-semibold"
              title="View verified Mainnet contract on BOT Chain Explorer"
            >
              <span>{contractAddress}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="flex items-center gap-3 shrink-0 text-[10px] text-warm-400">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-sm object-contain" />
              <span>botchain.ai</span>
            </a>
            <span>•</span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-sm object-contain" />
              <span>scan.botchain.ai</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Single-Page Sections */}
      <main className="flex-1">
        {/* Section B: Hero */}
        <Hero
          totalGamers={totalGamers}
          totalMatches={totalMatches}
          isRegistered={Boolean(formattedProfile?.isRegistered)}
          topPlayer={topPlayer}
        />

        {/* Section C: Gaming Profile */}
        <ProfileSection
          contractAddress={contractAddress}
          profile={formattedProfile}
          isLoadingProfile={isLoadingProfile}
          onRefresh={refetchAll}
        />

        {/* Section D: Record a Match */}
        <RecordMatchSection
          contractAddress={contractAddress}
          isRegistered={Boolean(formattedProfile?.isRegistered)}
          registeredPlayers={registeredPlayers}
          onRefresh={refetchAll}
        />

        {/* Section E: Pending Matches */}
        <PendingMatchesSection
          contractAddress={contractAddress}
          pendingMatches={formattedMatches}
          registeredPlayers={registeredPlayers}
          isLoading={isLoadingMatches}
          onRefresh={refetchAll}
        />

        {/* Section G: Public Leaderboard */}
        <LeaderboardSection
          leaderboard={formattedLeaderboard}
          isLoading={isLoadingLeaderboard}
        />

        {/* Section F: Match History */}
        <MatchHistorySection
          matches={formattedMatches}
          registeredPlayers={registeredPlayers}
          isLoading={isLoadingMatches}
        />
      </main>

      {/* Footer */}
      <Footer contractAddress={contractAddress} />
    </div>
  );
}
