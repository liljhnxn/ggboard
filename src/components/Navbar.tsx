"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/lib/wagmi";
import { Shield, Swords, Trophy, History, Wallet, ChevronDown, LogOut, AlertTriangle, ExternalLink, Menu, X } from "lucide-react";

interface NavbarProps {
  username?: string;
  isRegistered?: boolean;
}

export function Navbar({ username, isRegistered }: NavbarProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchainMainnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { label: "Home", href: "#home", icon: Shield },
    { label: "Profile", href: "#profile", icon: Shield },
    { label: "Record Match", href: "#record", icon: Swords },
    { label: "Pending", href: "#pending", icon: Swords },
    { label: "Leaderboard", href: "#leaderboard", icon: Trophy },
    { label: "Match History", href: "#history", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090a0e]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-[#ff6200] to-[#b33e00] flex items-center justify-center font-display font-black text-2xl text-white shadow-glow group-hover:scale-105 transition-transform clip-corner-sm">
            GG
            <div className="absolute inset-0 border border-white/30 rounded-lg pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-wider text-warm-100 flex items-center gap-1">
              GGBOARD
              <span className="inline-block w-2 h-2 rounded-full bg-[#ff6200] animate-pulse" />
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-warm-400">
              Botchain Mainnet (677)
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#12151d] px-3 py-1.5 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-warm-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-[#ff6200]" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Wallet Connection */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Wrong Network Indicator */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-all animate-pulse"
              title="Click to switch to Botchain Mainnet"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Switch to Mainnet</span>
            </button>
          )}

          {/* Network Badge */}
          {isConnected && !isWrongNetwork && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141822] border border-white/10 text-xs font-mono text-warm-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span>Botchain Mainnet (677)</span>
            </div>
          )}

          {/* Connect / Wallet Button */}
          {!isConnected ? (
            <button
              onClick={() => {
                const metaMask = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
                if (metaMask) connect({ connector: metaMask });
              }}
              disabled={isConnecting}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff6200] to-[#e65500] hover:from-[#ff731a] hover:to-[#ff6200] text-white font-semibold text-sm shadow-glow transition-all active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[#141824] hover:bg-[#1a1f30] border border-white/10 transition-all text-sm font-medium text-warm-100 group"
              >
                <div className="w-7 h-7 rounded-md bg-[#ff6200]/20 border border-[#ff6200]/40 flex items-center justify-center text-xs font-bold text-[#ff6200]">
                  {username ? username.slice(0, 2).toUpperCase() : "GG"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">
                    {username || "Unregistered Gamer"}
                  </span>
                  <span className="text-[11px] font-mono text-warm-400 leading-tight">
                    {address ? truncateAddress(address) : ""}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-warm-400 group-hover:text-white transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12151f] border border-white/10 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-[11px] font-mono uppercase text-warm-400">Connected Wallet</p>
                    <p className="text-xs font-mono text-warm-200 break-all">{address}</p>
                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 text-[11px] text-[#ff6200] hover:underline flex items-center gap-1"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#141822] text-warm-200 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0e1118] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-[#151824] text-xs font-medium text-warm-200 hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
          </div>
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold text-center border border-amber-500/40"
            >
              Switch to Botchain Mainnet
            </button>
          )}
          {!isConnected ? (
            <button
              onClick={() => {
                const metaMask = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
                if (metaMask) connect({ connector: metaMask });
              }}
              className="w-full py-2.5 rounded-lg bg-[#ff6200] text-white font-semibold text-sm"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-warm-300">{address ? truncateAddress(address) : ""}</span>
              <button
                onClick={() => disconnect()}
                className="text-xs text-rose-400 hover:underline"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
