"use client";
import { useState, useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CartSheet } from "./CartSheet";

export function Navbar({ appName = "Hackathon App" }: { appName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300
      ${scrolled ? "bg-bg-surface/90 backdrop-blur-xl border-b border-border shadow-card" : "bg-transparent"}`}>
      <div className="wrap h-full flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-tx flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-p flex items-center justify-center text-white text-xs font-black">
            H
          </span>
          {appName}
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 mr-2">
            <Link href="/" className="text-sm font-medium hover:text-p transition-colors">Grabbit</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-p transition-colors">Wardrobe</Link>
            <Link href="/dashboard/profile" className="text-sm font-medium hover:text-p transition-colors">Profile</Link>
            <Link href="/dashboard/style" className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors">Ask Iris</Link>
          </div>
          
          <CartSheet />
          
          {isLoaded && isSignedIn && (
            <UserButton />
          )}
          {isLoaded && !isSignedIn && (
            <SignInButton>
              <button className="btn-primary text-sm">Get Started</button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
