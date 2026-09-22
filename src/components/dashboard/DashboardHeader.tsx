"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { TbWallet } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { useWalletModal } from "@/context/WalletModalContext";


export default function DashboardHeader() {
  const { address, connecting, connected, disconnect } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleWalletButtonClick = () => {
    if (connected && address) {
      // Clear localStorage before disconnecting
      localStorage.removeItem('accountType');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      disconnect().catch(e => console.error("Error disconnecting", e));
    } else {
      setWalletModalVisible(true);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="font-bold text-xl">
              <Image
                src="/logo-full.png"
                alt="CarbonHub Logo"
                width={180}
                height={50}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
            </div>

            <ThemeToggle />

            <Button
              onClick={handleWalletButtonClick}
              disabled={connecting}
              className="bg-primary text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-200"
            >
              <TbWallet className="text-lg" />
              {connected && address ? truncateAddress(address) : (connecting ? 'Connecting...' : 'Select Wallet')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
