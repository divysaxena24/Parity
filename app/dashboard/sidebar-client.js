"use client";

import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";

export function DashboardSidebarClient({ menuItems, isSignOutOnly }) {
  const { signOut } = useClerk();
  const pathname = usePathname();

  if (isSignOutOnly) {
    return (
      <button
        onClick={() => signOut()}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    );
  }

  return (
    <>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
              : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.name}
            </div>
            {isActive && <ChevronRight size={14} />}
          </Link>
        );
      })}
    </>
  );
}
