"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col text-foreground bg-background overflow-x-hidden">
      <main className={`flex-1 ${isAdmin ? "" : "pt-10"}`}>
        {children}
      </main>
    </div>
  );
}
