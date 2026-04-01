"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-600 blur-[120px]" />
         <div className="absolute bottom-0 left-0 h-96 w-96 bg-emerald-600/30 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-transform group-hover:scale-110 shadow-lg shadow-emerald-500/30">
              <Trophy size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Parity</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to track your scores and impact.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn 
            routing="hash"
            signUpUrl="/signup"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl p-2",
                formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-sm font-bold shadow-lg shadow-emerald-500/20",
                footer: "hidden", // Hide clerk footer to keep it clean
                header: "hidden", // Hide clerk header to use our custom one
                socialButtonsBlockButton: "border-slate-200 dark:border-slate-800",
                formFieldInput: "rounded-xl border-slate-200 focus:border-emerald-500 bg-slate-50 dark:bg-slate-950",
              }
            }}
          />
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
