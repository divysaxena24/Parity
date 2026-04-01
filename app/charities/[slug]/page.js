"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, Target, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { CHARITIES } from "@/constants/charities";

export default function CharityDetail() {
  const { slug } = useParams();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const charity = CHARITIES.find(c => c.slug === slug);

  if (!charity) return notFound();

  const handleOneTimeDonation = async (amount) => {
    if (!isSignedIn) {
      router.push("/signup");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/donations/one-time", {
      method: "POST",
      body: JSON.stringify({
        amount,
        charityId: charity.id,
        charityName: charity.name
      })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
      alert(data.error || "Payment failed. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 pb-24">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 bg-slate-900 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 h-[400px] w-[600px] bg-emerald-600 blur-[150px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <Link 
            href="/charities"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-12 sm:mb-8"
          >
             <ArrowLeft size={16} /> <span className="uppercase tracking-widest text-[10px] font-bold">Back to Charities</span>
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 mb-4 text-center md:text-left">
             <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-emerald-600 flex items-center justify-center p-4 shadow-xl shadow-emerald-600/30 shrink-0">
                <Heart size={40} className="text-white sm:size-48" />
             </div>
             <div className="flex-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{charity.category}</span>
                <h1 className="text-3xl sm:text-5xl font-bold mt-2 leading-tight">{charity.name}</h1>
             </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-0 w-full md:w-auto">
                 <Link 
                   href="/dashboard/settings"
                   className="rounded-full bg-emerald-600 px-8 py-4 text-center text-sm font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30"
                 >
                    Set as Impact Partner
                 </Link>
                 <button 
                   onClick={() => handleOneTimeDonation(25)}
                   disabled={loading}
                   className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 disabled:opacity-50"
                 >
                    {loading ? "Connecting..." : "One-time $25 Donation"}
                 </button>
              </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            <div className="lg:col-span-2">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About the Organization</h2>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {charity.fullDescription}
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-12 mb-8">Our Primary Goals</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     <Goal icon={<Target className="text-emerald-500" />} text="Direct environmental impact through verified reforestation." />
                     <Goal icon={<Globe className="text-emerald-500" />} text="Improving lives across 25+ countries globally." />
                     <Goal icon={<CheckCircle2 className="text-emerald-500" />} text="Transparent reporting and direct funding models." />
                     <Goal icon={<Users iconSize={20} className="text-emerald-500" />} text="Community-led management for sustainable growth." />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-16 sm:mt-20 mb-8 px-2 border-l-4 border-emerald-500">Upcoming Impact Events</h3>
                  <div className="space-y-4">
                     <ImpactEvent 
                       date="May 12, 2026" 
                       title={`${charity.name} Annual Golf Fundraiser`} 
                       location="Pebble Beach, CA"
                       description="Join senior leaders and professional golfers in an 18-hole scramble (as per PRD Section 08)."
                     />
                     <ImpactEvent 
                       date="June 04, 2026" 
                       title="Sustainability Summit & Gala" 
                       location="The Dorchester, London"
                       description="An evening of celebration highlighting our shared impact milestones for the year."
                     />
                  </div>
               </motion.div>
            </div>
            
            <aside className="lg:col-span-1">
               <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 sticky top-24">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Impact Statistics</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                     <ImpactStat label="Verified Impact" value={charity.impactValue} />
                     <ImpactStat label="Direct Funding" value="85% of contributions" />
                     <ImpactStat label="Admin Overhead" value="< 5%" />
                  </div>
                  
                  <hr className="my-8 border-slate-200 dark:border-slate-800" />
                  
                  <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400 hover:underline">
                     <Globe size={18} />
                     <span className="text-sm font-semibold">Visit Official Website</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mt-4">
                     <Calendar size={18} />
                     <span className="text-sm font-semibold">Partner since Jan 2024</span>
                  </div>
               </div>
            </aside>
         </div>
      </section>

      {/* Related impact card */}
      <section className="mx-auto max-w-7xl px-4 py-16">
         <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-emerald-500/10 blur-[80px] z-0" />
             <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Every swing you take counts.</h3>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                  By selecting {charity.name} as your impact partner, 40% of your platform subscription goes directly to their verified missions.
                </p>
                <Link href="/signup" className="text-emerald-500 font-bold hover:underline">
                  Join Parity and support {charity.name} today.
                </Link>
             </div>
         </div>
      </section>
    </div>
  );
}

function Goal({ icon, text }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50">
       <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 shrink-0">
          {icon}
       </div>
       <span className="text-sm font-medium text-slate-700 dark:text-slate-400 leading-snug">{text}</span>
    </div>
  );
}

function ImpactStat({ label, value }) {
  return (
    <div className="flex flex-col">
       <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</span>
       <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none">{value}</span>
    </div>
  );
}

function ImpactEvent({ date, title, location, description }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/20 group">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
             <Calendar size={14} className="text-emerald-500" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{date}</span>
          </div>
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 w-fit">Open for Registration</span>
       </div>
       <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3 group-hover:text-emerald-600 transition-colors leading-tight">{title}</h4>
       <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{description}</p>
       <div className="mt-4 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 py-1 px-3 rounded-full w-fit">Location: {location}</div>
    </div>
  );
}

function Users({ className, iconSize }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
