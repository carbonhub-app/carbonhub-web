"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { Slider } from "@/components/ui/slider";
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { userDatas } from "@/types/wallet";

interface EmissionQuota {
  year: string;
  available_quota: number;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<userDatas | null>(null);
  const [emissionQuota, setEmissionQuota] = useState<EmissionQuota | null>(null);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const { address } = useWallet();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        if (parsedData.connectedAt) {
          parsedData.connectedAt = new Date(parsedData.connectedAt);
        }
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  // Fetch user's balance
  const fetchBalance = async () => {
    if (!address) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/swap/balance`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        // Update userData with ECFCH balance
        setUserData(prev => {
          const newData = {
            carbonCredits: data.data.ECFCH.balance,
            connectedAt: prev?.connectedAt || new Date(),
            totalTransactions: prev?.totalTransactions || 0
          };
          return newData;
        });
      } else {
        throw new Error(data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      toast.error('Failed to fetch token balance');
    }
  };

  // Fetch balance on component mount and when wallet changes
  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);

  // Fetch emission quota
  useEffect(() => {
    const fetchEmissionQuota = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/emission/quota`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success' && data.data.length > 0) {
          // Get the most recent year's quota
          setEmissionQuota(data.data[0]);
        } else {
          throw new Error(data.message || 'Failed to fetch emission quota');
        }
      } catch (error) {
        console.error('Error fetching emission quota:', error);
        toast.error('Failed to fetch emission quota');
      }
    };

    fetchEmissionQuota();
  }, []);

  const handleWithdraw = async () => {
    if (!emissionQuota) return;
    
    if (withdrawAmount <= 0 || withdrawAmount > emissionQuota.available_quota) {
      toast.error('Invalid withdrawal amount');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/emission/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount: withdrawAmount }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setEmissionQuota({
          ...emissionQuota,
          available_quota: emissionQuota.available_quota - withdrawAmount
        });
        toast.success('Successfully withdrew emission quota');
        setIsWithdrawDialogOpen(false);
      } else {
        throw new Error(data.message || 'Failed to withdraw emission quota');
      }
    } catch (error) {
      console.error('Error withdrawing emission quota:', error);
      toast.error('Failed to withdraw emission quota');
    }
  };

  // Helper function to truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Connected Wallet:</span>
          <span className="font-mono bg-muted px-2 py-1 rounded">
            {address ? truncateAddress(address) : "Not connected"}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Solana
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Current Carbon Credits</h2>
          <p className="text-3xl font-bold">{userData?.carbonCredits || 0}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Ready to trade or offset
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Wallet Connection</h2>
          <p className="text-3xl font-bold text-green-500">Active</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Connected since{" "}
            {userData?.connectedAt
              ? new Date(userData.connectedAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Annual Emission Quota</h2>
          <p className="text-3xl font-bold">{emissionQuota?.available_quota.toFixed(2) || 0} tons</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Remaining for {emissionQuota?.year || new Date().getFullYear()}
          </p>
          <Button 
            onClick={() => setIsWithdrawDialogOpen(true)}
            className="mt-4 w-full"
            disabled={!emissionQuota || emissionQuota.available_quota <= 0}
          >
            Withdraw Quota
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Carbon Credit Activity</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Weekly
            </Button>
            <Button variant="outline" size="sm">
              Monthly
            </Button>
            <Button variant="outline" size="sm">
              Yearly
            </Button>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              Carbon tracking chart will appear here
            </p>
            <p className="text-sm text-slate-400">
              Connect your carbon sources to start tracking
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Wallet Activity</h2>

          {userData?.totalTransactions === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                No transactions yet
              </p>
              <p className="text-sm text-slate-400">
                Start by purchasing or earning carbon credits
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="2" x2="12" y2="22"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Wallet Connected</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Phantom wallet authenticated successfully
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {userData?.connectedAt
                        ? new Date(userData.connectedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>

          <div className="space-y-6">
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="font-medium mb-2 text-primary">
                🎉 Wallet Connected!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Your Phantom wallet is now connected to CarbonHub. You&apos;re
                ready to start tracking and trading carbon credits.
              </p>
              <div className="text-xs text-slate-500 font-mono">
                {address ? truncateAddress(address) : "N/A"}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Next Steps:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Complete your profile setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span>Connect your carbon sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span>Start tracking emissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span>Explore carbon marketplace</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Emission Quota</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Amount to Withdraw (tons)
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="number"
                    min="0"
                    max={emissionQuota?.available_quota || 0}
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Math.min(Number(e.target.value), emissionQuota?.available_quota || 0))}
                    className="w-32 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded px-3 py-2 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-slate-500">tons</span>
                </div>
                <Slider
                  value={[withdrawAmount]}
                  onValueChange={(value) => setWithdrawAmount(value[0])}
                  max={emissionQuota?.available_quota || 0}
                  step={0.01}
                  className="w-full"
                />
                <div className="mt-2 text-sm text-slate-500">
                  Available: {emissionQuota?.available_quota.toFixed(2) || 0} tons
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
