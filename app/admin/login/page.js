"use client";

import { useState } from "react";
import { adminLogin } from "@/actions/admin-auth";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    const result = await adminLogin(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 relative">
      {/* Home Button */}
      <Link 
        href="/" 
        className="fixed top-8 left-8 z-50 flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-black text-zinc-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5"
      >
        <ArrowLeft size={14} /> Go Home
      </Link>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-emerald-600/10 blur-[150px]" />
         <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] bg-emerald-900/5 blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/40">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Gateway</h1>
            <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest font-bold">Parity Platform Control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
              <input
                required
                name="email"
                type="email"
                placeholder="admin@parity.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-emerald-500 focus:bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Secure Password</label>
              <input
                required
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-emerald-500 focus:bg-white/10"
              />
            </div>

            {error && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm font-semibold text-red-500 border border-red-500/20"
               >
                  <AlertCircle size={18} /> {error}
               </motion.div>
            )}

            <button
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/40 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Access Terminal
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
                Unauthorized access is strictly prohibited. <br /> All sessions are monitored and logged.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
