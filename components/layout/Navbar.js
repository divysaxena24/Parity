"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const isDashboard = pathname?.startsWith("/dashboard");

  const navLinks = [
    { name: "How it Works", href: "/how-it-works" },
    { name: "Charities", href: "/charities" },
    { name: "Pricing", href: "/pricing" },
    { name: "Admin Login", href: "/admin/login" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-white/70 backdrop-blur-md dark:bg-black/70">
      <div className="relative flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8 max-w-full">
        {/* Left: Logo */}
        <div className="absolute left-4 sm:left-6 lg:left-8 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition-transform group-hover:scale-110 shadow-sm shadow-emerald-500/20">
              <Trophy size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Parity</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-500"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-600 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-500 shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            )}
            {isLoaded && !isSignedIn && (
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-500">
                    Log in
                  </button>
                </SignInButton>
                <Link
                  href="/signup"
                  className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/5 bg-white px-4 py-4 dark:bg-slate-950 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-100 dark:border-slate-800" />
            {isLoaded && isSignedIn && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-emerald-600"
              >
                Dashboard
              </Link>
            )}
            {isLoaded && !isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-left text-base font-medium text-slate-600 dark:text-slate-400"
                  >
                    Log in
                  </button>
                </SignInButton>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-emerald-600 py-2 text-center text-base font-medium text-white shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
