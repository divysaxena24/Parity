"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Heart, TrendingUp, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600 blur-[120px]" />
          <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-emerald-900 blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                <Trophy size={14} />
                <span>Impact Rewards</span>
              </div>
              <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-7xl">
                Play for the game. <span className="text-emerald-500">Win for the cause.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-400 leading-relaxed">
                Parity is the world&apos;s first subscription platform combining golf performance tracking with monthly rewards that give back. Every stroke you track supports a charity you believe in.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30"
                >
                  Join the Club
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                >
                  See How it Works
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 grayscale opacity-80 group-hover:grayscale-0">
                <div className="flex -space-x-3">
                  {['AT', 'SM', 'JW', 'ED'].map((initials, i) => (
                    <div key={i} className="h-10 w-10 border-2 border-slate-950 bg-slate-900 rounded-xl flex items-center justify-center text-[10px] font-black text-emerald-500 shadow-xl">
                       {initials}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.2em] italic">Join 2,500+ impact golfers</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-slate-900/50 overflow-hidden border border-white/5 relative p-4 group">
                 <div className="absolute inset-0 bg-[url('/dashboard_preview_hero_1775050200754.png')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[2s]" />
                 
                 {/* High-Fidelity Labels */}
                 <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase font-black text-white tracking-widest leading-none">Live impact feed</span>
                 </div>

                 {/* Mockup Dashboard UI Floating Elements */}
                 <div className="absolute inset-8 rounded-2xl border border-white/10 p-6 flex flex-col gap-6 ">
                   <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white"><Trophy size={16} /></div>
                        <div className="h-2 w-20 rounded-full bg-white/20" />
                     </div>
                     <div className="h-6 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-[8px] font-black uppercase text-emerald-500 tracking-widest">Active</div>
                   </div>

                   <div className="h-40 w-full rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 p-6 flex flex-col justify-end">
                     <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Stableford Performance</div>
                     <div className="flex gap-1 h-20 items-end">
                        {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                           <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-lg group-hover:bg-emerald-500/40 transition-all" style={{ height: `${h}%` }} />
                        ))}
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="h-28 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 p-4">
                        <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">Top Charity</div>
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-pink-500"><Heart size={16} fill="currentColor" /></div>
                           <div className="h-2 w-16 rounded-full bg-white/10" />
                        </div>
                     </div>
                     <div className="h-28 rounded-2xl bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/10 p-4">
                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-4">Next Prize Pool</div>
                        <p className="text-xl font-black text-white italic tracking-tighter">$14,200</p>
                     </div>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <Stat label="Total Raised" value="$450,000+" icon={<Heart size={20} className="text-emerald-500" />} />
            <Stat label="Active Golfers" value="2,542" icon={<Users size={20} className="text-emerald-500" />} />
            <Stat label="Monthly Prizes" value="$150,000" icon={<Trophy size={20} className="text-emerald-500" />} />
            <Stat label="Charities Supported" value="12" icon={<TrendingUp size={20} className="text-emerald-500" />} />
          </div>
        </div>
      </section>

      {/* How It Works - Brief */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900 overflow-hidden relative">
        <div className="absolute -right-20 top-0 h-96 w-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl uppercase italic mb-4">
             Social Impact Methodology
          </h2>
          <p className="mt-4 text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mb-16">
            Elite Golf Technology Meeting Global Altruism.
          </p>
          
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <Step
              number="01"
              title="Subscribe & Impact"
              description="Secure your membership and select a high-vetted global charity organization to receive your support with every tracked swing."
            />
            <Step
              number="02"
              title="Track Elite Data"
              description="Record your monthly Stableford performance. Our algorithm converts your technical data into pool entries for the monthly rewards."
            />
            <Step
              number="03"
              title="Global Contribution"
              description="Match your performance data against the draw to secure prizes, while our ledger automatically distributes funds to your impact partner."
            />
          </div>
        </div>
      </section>

      {/* Featured Charity Teaser */}
      <section className="bg-white py-24 dark:bg-slate-950 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                Empowering life <br className="hidden md:block" /> with every swing.
              </h2>
              <p className="mt-6 text-lg text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                We believe in the power of passion. Parity members have contributed hundreds of thousands to reforestation, medical research, and education programs globally.
              </p>
              <Link
                href="/charities"
                className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-600/10 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-500/10"
              >
                Explore Partner Ledgers <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6 relative">
               <div className="aspect-[4/5] rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col justify-end group hover:border-emerald-500 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 mb-4"><Heart size={20} /></div>
                  <h4 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-2">Sustainable <br /> Landscaping</h4>
                  <p className="text-[10px] font-black text-emerald-600 uppercase italic tracking-widest">GreenFairways Foundation</p>
               </div>
               <div className="aspect-[4/5] rounded-[2rem] bg-emerald-600/5 dark:bg-emerald-500/5 mt-10 border border-emerald-500/10 p-8 flex flex-col justify-end group hover:bg-emerald-600 transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="z-10 relative">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/30"><TrendingUp size={20} /></div>
                    <h4 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-2 group-hover:text-white transition-colors">Economic <br /> Growth</h4>
                    <p className="text-[10px] font-black text-emerald-600 uppercase italic tracking-widest group-hover:text-white transition-colors opacity-80">CleanWater Sports</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <div className="rounded-3xl bg-emerald-600 px-8 py-16 text-center text-white sm:px-16 sm:py-24 shadow-2xl shadow-emerald-500/20">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start your impact journey today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-emerald-100">
            Join the community of golfers who play for something bigger than a trophy. Enter your first score today.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-emerald-600 transition-all hover:bg-emerald-50 hover:shadow-lg"
            >
              Get Started Now
            </Link>
            <Link
              href="/pricing"
              className="rounded-full bg-emerald-700 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-emerald-800"
            >
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="flex flex-col items-center p-6 text-center group transition-all hover:scale-105">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 mb-4 transition-transform group-hover:rotate-12">
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">{label}</p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="flex flex-col items-center p-8 group">
      <div className="text-5xl font-black text-emerald-500/10 dark:text-emerald-500/5 mb-[-2rem] group-hover:text-emerald-500 transition-colors">
        {number}
      </div>
      <CheckCircle2 className="mb-4 text-emerald-600" size={32} />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
