"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, X, Shirt, Search, Sparkles, BarChart2, Heart, User, Clock } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { CartDrawer } from "./CartDrawer";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Wardrobe", href: "/dashboard", icon: Shirt },
    { name: "Grab", href: "/dashboard/grab", icon: Search },
    { name: "Style with Iris", href: "/dashboard/style", icon: Sparkles },
    { name: "History", href: "/dashboard/history", icon: Clock },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-surface border-b border-border z-40 flex items-center justify-between px-4">
        <span className="font-display font-bold text-xl tracking-tight text-tx">Fits.</span>
        <div className="flex items-center gap-2">
          <CartDrawer />
          <button onClick={() => setIsOpen(!isOpen)} className="text-tx">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-[240px] bg-bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        {/* Header */}
        <div className="h-24 flex justify-between items-center px-6 border-b border-border/50">
          <Link href="/dashboard" onClick={closeSidebar} className="font-display font-bold text-3xl tracking-tight text-tx hover:opacity-80 transition-opacity flex items-center gap-2">
            Fits.
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <CartDrawer />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={closeSidebar}
                className={`
                  px-8 py-3 text-sm font-medium transition-all flex items-center gap-3
                  ${isActive 
                    ? "border-l-2 border-p bg-tx/5 text-tx" 
                    : "border-l-2 border-transparent text-tx-muted hover:text-tx hover:bg-tx/5"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-p' : ''}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-border flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-none border border-border" } }} />
            <div className="flex flex-col">
              <span className="font-body font-medium text-sm text-tx leading-none">My Account</span>
              <span className="text-[10px] text-tx-muted mt-1 uppercase tracking-widest font-bold">14 pieces</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
