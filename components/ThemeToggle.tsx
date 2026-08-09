"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[72px] h-10 rounded-full bg-border" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center w-[72px] h-10 p-1 rounded-full transition-colors focus:outline-none border border-transparent hover:border-border/50 shadow-inner ${
        isDark ? "bg-[#1A1A1A]" : "bg-[#EBE5DB]"
      }`}
    >
      {/* Sliding Handle */}
      <div 
        className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isDark ? "bg-[#333333] translate-x-[32px]" : "bg-white translate-x-0"
        }`} 
      />

      {/* Sun Icon */}
      <div className="absolute left-1 w-8 h-8 flex items-center justify-center pointer-events-none z-10">
        <Sun className={`w-[18px] h-[18px] transition-colors duration-300 ${
          isDark ? "text-[#666666]" : "text-[#7B6A58]"
        }`} />
      </div>

      {/* Moon Icon */}
      <div className="absolute right-1 w-8 h-8 flex items-center justify-center pointer-events-none z-10 pl-[2px]">
        <Moon className={`w-[18px] h-[18px] transition-colors duration-300 ${
          isDark ? "text-[#EBE5DB]" : "text-[#7B6A58]"
        }`} />
      </div>
    </button>
  );
}
