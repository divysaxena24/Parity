"use client";

import { Menu, ShieldCheck } from "lucide-react";

export default function AdminHeader({ onOpenSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:hidden">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <ShieldCheck size={18} />
          </div>
          <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Parity Admin</span>
        </div>
        
        <button 
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-emerald-600 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
