"use client";

import { motion } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info,
  History
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DrawsPage() {
  const [activeDraw, setActiveDraw] = useState({
    id: "d-oct-2025",
    month: "October",
    year: 2025,
    pool: 152400,
    status: "OPEN",
    deadline: "Oct 28, 2025",
  });

  const recentDraws = [
    { id: "d-sep-2025", month: "September", status: "COMPLETED", numbers: [12, 24, 7, 33, 41], totalPool: 145000, winners: 124 },
    { id: "d-aug-2025", month: "August", status: "COMPLETED", numbers: [5, 18, 29, 44, 2], totalPool: 138000, winners: 98 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/5 pb-8 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Monthly Draws</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">View eligibility and explore previous winning results.</p>
        </div>
      </div>

      {/* Active Draw Hero */}
      <div className="rounded-3xl bg-slate-900 p-8 text-white dark:bg-emerald-950/20 shadow-2xl shadow-emerald-500/10 border border-white/5 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-600/20 blur-[100px]" />
        
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">
            Active Prize Pool
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter">${activeDraw.pool.toLocaleString()}</h2>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-400 font-medium">
             <div className="flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /> Deadline: {activeDraw.deadline}</div>
             <div className="flex items-center gap-2"><Target size={16} className="text-emerald-500" /> Mode: Random Selection</div>
          </div>
        </div>

        <div className="w-full lg:w-96 rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/10 z-10">
           <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-400">Your Eligibility</h3>
           <div className="space-y-4">
              <EligibilityItem label="Monthly Sub Active" complete={false} />
              <EligibilityItem label="5 Valid Scores Entry" complete={false} />
              <EligibilityItem label="Region Compliance" complete={true} />
              
              <Link 
                href="/dashboard/scores" 
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-slate-900 hover:bg-emerald-50 transition-colors"
              >
                Complete Entry <ArrowRight size={16} />
              </Link>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Draw Rules Info */}
        <div className="lg:col-span-1">
           <div className="rounded-3xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-2 flex items-center gap-2"><Info size={16} /> Strategy & Rules</h3>
              <div className="space-y-6">
                 <RuleItem 
                   title="Latest 5 Mechanism" 
                   description="We use your 5 most recently recorded scores as your entry numbers for the draw calculation."
                 />
                 <RuleItem 
                   title="Match Tiers" 
                   description="Winners are awarded based on 3, 4, or 5 matching numbers between user entries and the draw result."
                 />
                 <RuleItem 
                   title="Jackpot Rollover" 
                   description="If no 5-match winners exist for a month, the jackpot portion rolls over to the following month's pool."
                 />
              </div>
           </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold px-2">
             <History size={20} className="text-emerald-600" /> Recent Draw Results
           </div>
           
           <div className="space-y-4">
             {recentDraws.map((draw) => (
                <div key={draw.id} className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm group hover:border-emerald-500/30 transition-all">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                         <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           {draw.month} {draw.year} Results
                           <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-widest text-slate-500">Official</span>
                         </h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                           Total Prize Pool: ${draw.totalPool.toLocaleString()} | {draw.winners} Total Winners
                         </p>
                      </div>
                      <div className="flex gap-2">
                         {draw.numbers.map((num, i) => (
                            <div key={i} className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm dark:bg-emerald-950">
                               {num}
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             ))}
           </div>

           <button className="w-full py-4 text-center text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:underline">
             Explore Complete Archive
           </button>
        </div>
      </div>
    </div>
  );
}

function EligibilityItem({ label, complete }) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-medium text-slate-300">{label}</span>
       {complete ? (
         <CheckCircle2 size={16} className="text-emerald-400" />
       ) : (
         <AlertCircle size={16} className="text-amber-500" />
       )}
    </div>
  );
}

function RuleItem({ title, description }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-white/5">
       <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
       <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{description}</p>
    </div>
  );
}
