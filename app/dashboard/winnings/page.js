"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Wallet, 
  ExternalLink,
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Upload,
  History,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WinningsPage() {
  const [winnings, setWinnings] = useState([
    { id: "w1", month: "September", amount: 1500.00, status: "APPROVED", payout: "PAID", proof: "/checked.png" },
    { id: "w2", month: "October", amount: 12500.00, status: "PENDING", payout: "PENDING", proof: null },
  ]);

  const totalWon = winnings.reduce((acc, w) => acc + w.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/5 pb-8 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Winnings</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Track your prize history and verify your claims.</p>
        </div>
      </div>

      {/* Stats Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-slate-900 p-8 text-white dark:bg-emerald-950/20 shadow-2xl shadow-emerald-500/10 border border-white/5 flex items-center justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-600/10 blur-[100px]" />
           <div className="z-10">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-4">Lifetime Winnings</span>
              <h2 className="text-5xl font-black mb-2 tracking-tighter">${totalWon.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                 <ShieldCheck size={14} className="text-emerald-500" /> All payouts are verified and secure
              </div>
           </div>
           <Wallet size={64} className="text-white/5 absolute right-8 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-8">
           <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 dark:bg-emerald-950 shrink-0">
              <Zap size={32} />
           </div>
           <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Claims</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4 leading-relaxed line-clamp-2">Upload your scorecard proof immediately after a draw to accelerate the verification process.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* History / Verification List */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-2 flex items-center gap-2"><History size={16} /> Prize Audit History</h3>
            
            <div className="space-y-4">
               {winnings.map((win, i) => (
                  <motion.div 
                    key={win.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
                   >
                     <div className="flex items-center gap-6">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${win.payout === 'PAID' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950' : 'bg-amber-50 text-amber-600 dark:bg-amber-950'}`}>
                           <Trophy size={18} />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">{win.month} Prize</h4>
                           <p className="text-2xl font-black text-slate-950 dark:text-emerald-500">${win.amount.toLocaleString()}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                           <StatusBadge status={win.status} label="Verification" />
                           <StatusBadge status={win.payout} label="Payout" />
                        </div>
                        
                        {win.proof ? (
                           <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:underline">
                             View Proof <ExternalLink size={12} />
                           </button>
                        ) : (
                           <button className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900">
                             <Upload size={14} /> Upload Proof
                           </button>
                        )}
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Payout Information */}
         <div className="lg:col-span-1">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm sticky top-24">
               <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Payout Information</h3>
               
               <div className="space-y-6">
                  <div className="flex items-start gap-3">
                     <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-slate-500 dark:text-slate-400">Claims are processed within 3-5 business days after proof upload.</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-slate-500 dark:text-slate-400">Funds are directly deposited into your bank account via Stripe Payouts.</p>
                  </div>
               </div>
               
               <hr className="my-8 border-slate-200 dark:border-slate-800" />
               
               <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight size={14} /> Claim Requirements</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">You must upload a clear screenshot or photograph of your finalized Stableford scorecard for the qualifying matches played.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }) {
  const getColors = () => {
    switch (status) {
      case 'PAID':
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex items-center gap-2 mb-1">
       <span className="text-[9px] font-bold text-slate-400 uppercase">{label}:</span>
       <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest ${getColors()}`}>
         {status}
       </span>
    </div>
  );
}
