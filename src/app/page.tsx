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
import { Settings, Check, Edit2, ShieldAlert } from "lucide-react";
import { isAddress } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();

  // Active contract address state (defaults to env or fallback)
  const [contractAddress, setContractAddress] = useState<`0x${string}`>(DEFAULT_CONTRACT_ADDRESS);
  const [addressInput, setAddressInput] = useState<string>("");
  const [showConfig, setShowConfig] = useState(false);

  // Sync contract address if saved in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ggboard_contract_address");
      if (saved && isAddress(saved)) {
        setContractAddress(saved as `0x${string}`);
        setAddressInput(saved);
      } else {
        setAddressInput(contractAddress);
      }
    }
  }, [contractAddress]);

  const handleSaveContractAddress = () => {
    if (isAddress(addressInput)) {
      setContractAddress(addressInput as `0x${string}`);
      if (typeof window !== "undefined") {
        localStorage.setItem("ggboard_contract_address", addressInput);
      }
      setShowConfig(false);
      refetchAll();
    }
  };

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

      {/* Contract configuration banner (if contract is default or configured) */}
      <div className="bg-[#121520] border-b border-white/5 py-1.5 px-4 text-[11px] font-mono text-warm-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#ff6200]" />
            <span className="hidden sm:inline">Botchain Mainnet Contract:</span>
            <span className="text-warm-200 truncate">{contractAddress}</span>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[#ff6200] hover:text-[#ff7a1a] flex items-center gap-1 shrink-0 ml-2"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showConfig ? "Hide Config" : "Contract Config"}</span>
          </button>
        </div>
      </div>

      {/* Contract Address Edit Modal/Drawer */}
      {showConfig && (
        <div className="bg-[#10131d] border-b border-[#ff6200]/30 py-4 px-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-mono uppercase text-warm-400 mb-1">
                GGBoard Deployed Contract Address (Botchain Mainnet - Chain 677)
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value.trim())}
                placeholder="0x..."
                className="w-full px-3 py-1.5 rounded-lg bg-[#161a28] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#ff6200]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-4">
              <button
                onClick={handleSaveContractAddress}
                className="px-4 py-2 rounded-lg bg-[#ff6200] hover:bg-[#ff731a] text-white font-bold text-xs font-mono uppercase transition-colors"
              >
                Apply Address
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="px-3 py-2 rounded-lg bg-[#181d2a] hover:bg-[#202738] text-warm-400 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

