"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TbBuildingFactory, TbUser, TbChevronDown, TbWallet } from "react-icons/tb";
import gsap from "gsap";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

import { useWallet } from "@/context/WalletContext";
import { useWalletModal } from "@/context/WalletModalContext";
import { useRouter } from "next/navigation";
import { accountTypes, ChallengeResponses, VerifyResponses } from "@/types/wallet";


export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const { address, signMessage, connected, connecting, disconnect } = useWallet();
  const { setVisible: setWalletModalVisible, visible: walletModalVisible } = useWalletModal();
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      setError(null);
      setWalletModalVisible(false);
    }
  }, [connected, setWalletModalVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };

    if (loginDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loginDropdownOpen]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleLogin = async (accountType: accountTypes) => {
    if (!address || !signMessage) {
      setWalletModalVisible(true);
      toast.error('Please connect your wallet first through the "Select Wallet" button.', {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      return;
    }

    try {
      const challengeResponse = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/auth/request-challenge',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: address,
          type: accountType,
        }),
      });

      const challengeData: ChallengeResponses = await challengeResponse.json();
      if (challengeData.status === 'error') {
        throw new Error(challengeData.data?.challenge || 'Failed to fetch challenge');
      }

      const challengeMessage = challengeData.data.challenge;

      const encodedMessage = new TextEncoder().encode(challengeMessage);
      const signature = await signMessage(encodedMessage);

      const verifyResponse = await fetch(process.env.NEXT_PUBLIC_API_HOST + '/auth/verify-signature',  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: address,
          challenge: challengeMessage,
          signature: Buffer.from(signature).toString('base64'),
        }),
      });

      const verifyResult: VerifyResponses = await verifyResponse.json();

      if (verifyResult.data.type !== accountType) {
        toast.error('Invalid account type.', {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
        return;
      }

      if (verifyResult.status === 'success') {
        localStorage.setItem('token', verifyResult.data.token);
        localStorage.setItem('accountType', verifyResult.data.type);
        localStorage.setItem('publicKey', verifyResult.data.publicKey);
        
        router.push("/dashboard");
      } else {
        toast.error('Signature verification failed.', {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('Signing failed.', {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  const handleUserLogin = () => {
    handleLogin("user");
    setLoginDropdownOpen(false);
  };

  const handleCompanyLogin = () => {
    handleLogin("company");
    setLoginDropdownOpen(false);
  };

  const handleWalletButtonClick = () => {
    if (connected && address) {
      localStorage.removeItem('accountType');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      disconnect().catch(e => console.error("Error disconnecting", e));
    } else {
      setWalletModalVisible(true);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none"
      >
        <nav className="pointer-events-auto bg-black/70 backdrop-blur-md shadow-xl rounded-4xl max-w-7xl w-[95vw] mx-auto px-6 py-3 flex items-center justify-between gap-4 border border-white/10">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-full.png"
              alt="Carbon Hub"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <ul className="hidden md:flex flex-1 justify-center items-center gap-8">
            <li>
              <Link
                href="/"
                className="text-white/90 font-normal text-base hover:text-primary transition-colors duration-200 hover:color-primary"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#roadmap"
                className="text-white/90 font-normal text-base hover:text-primary transition-colors duration-200"
              >
                Roadmap
              </Link>
            </li>
            <li>
              <Link
                href="#why"
                className="text-white/90 font-normal text-base hover:text-primary transition-colors duration-200"
              >
                Why Carbon Hub
              </Link>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={loginDropdownRef}>
              <Button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                disabled={connecting}
                variant="outline"
                className="text-white/80 border-white/20 hover:border-primary hover:text-primary bg-transparent flex items-center gap-2 px-4 py-2 h-10"
              >
                {connecting && !connected ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    Login
                    <TbChevronDown className={`transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </Button>
              
              {loginDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden min-w-[160px] z-50">
                  <button
                    onClick={handleUserLogin}
                    className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <TbUser className="text-lg" />
                    User Login
                  </button>
                  <button
                    onClick={handleCompanyLogin}
                    className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2 font-medium border-t border-white/10"
                  >
                    <TbBuildingFactory className="text-lg" />
                    Company Login
                  </button>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleWalletButtonClick}
              disabled={connecting}
              className="text-white flex items-center gap-2 px-4 py-2 h-10"
            >
              <TbWallet className="text-lg" />
              {connected && address ? truncateAddress(address) : (connecting ? 'Connecting...' : 'Select Wallet')}
            </Button>
          </div>

          <button
            className="md:hidden flex items-center justify-center text-white hover:text-primary transition-colors duration-200 focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute top-16 left-0 w-full flex justify-center md:hidden z-50">
              <div className="bg-black/90 backdrop-blur-md rounded-xl shadow-lg py-4 px-6 flex flex-col items-center gap-4 border border-white/10 max-w-xs w-[90vw]">
                <Link
                  href="/"
                  className="text-white/90 font-medium text-base hover:text-primary transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#roadmap"
                  className="text-white/90 font-medium text-base hover:text-primary transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Roadmap
                </Link>
                <Link
                  href="#why"
                  className="text-white/90 font-medium text-base hover:text-primary transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Why Carbon Hub
                </Link>
                
                {!connected ? (
                  <div className="w-full flex flex-col gap-3">
                    <Button
                      onClick={() => { handleUserLogin(); setMenuOpen(false); }}
                      disabled={connecting}
                      variant="outline"
                      className="w-full text-white/80 border-white/20 hover:border-primary hover:text-primary bg-transparent flex items-center gap-2 justify-center h-10"
                    >
                      {connecting && !connected ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connecting...
                        </div>
                      ) : ( <><TbUser className="text-lg" /> User Login</> )}
                    </Button>
                    <Button
                      onClick={() => { handleCompanyLogin(); setMenuOpen(false); }}
                      disabled={connecting}
                      variant="outline"
                      className="w-full text-white/80 border-white/20 hover:border-primary hover:text-primary bg-transparent flex items-center gap-2 justify-center h-10"
                    >
                       {connecting && !connected ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connecting...
                        </div>
                      ) : ( <><TbBuildingFactory className="text-lg" /> Company Login</>)}
                    </Button>
                    <Button
                      onClick={() => { handleWalletButtonClick(); setMenuOpen(false); }}
                      disabled={connecting}
                      className="w-full text-white flex items-center gap-2 justify-center h-10"
                    >
                      <TbWallet className="text-lg" />
                      {connecting ? 'Connecting...' : 'Select Wallet'}
                    </Button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    <div className="text-white/80 text-sm text-center">
                      {truncateAddress(address || "")}
                    </div>
                    <Button
                      onClick={handleWalletButtonClick}
                      className="w-full text-white flex items-center gap-2 justify-center h-10"
                    >
                      <TbWallet className="text-lg" />
                      Disconnect
                    </Button>
                    <Link href="/dashboard" className="w-full" onClick={() => setMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="bg-primary text-white font-semibold flex items-center gap-2 w-full justify-center rounded-lg shadow-md hover:bg-primary/90 transition-all duration-200 h-10"
                      >
                        Dashboard <TbBuildingFactory className="ml-1 text-lg" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm max-w-xs text-center">
              {error.message}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
