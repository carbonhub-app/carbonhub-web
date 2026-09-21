"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { connected, connecting } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // If not connecting and not connected, redirect to home
    if (!connecting && !connected) {
      router.push("/");
    }
  }, [connected, connecting, router]);

  // Show loading while checking authentication
  if (connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Connecting to wallet...</p>
          <p className="text-sm text-muted-foreground">
            Please approve the connection in your wallet
          </p>
        </div>
      </div>
    );
  }

  // Show loading while not connected (redirect in progress)
  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Authentication required</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to connect wallet...
          </p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
