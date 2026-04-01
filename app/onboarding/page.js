"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Trophy,
  Loader2
} from "lucide-react";
import { CHARITIES } from "@/constants/charities";
import { completeOnboarding } from "@/actions/onboarding";

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Selection States
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [donationPercentage, setDonationPercentage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharities = CHARITIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleComplete = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.set("charityId", selectedCharity.id);
    formData.set("donationPercentage", donationPercentage);
    
    const res = await completeOnboarding(formData);
    if (res.success) {
      // Force a full page reload to "/dashboard" to ensure session refresh
      window.location.href = "/dashboard";
    } else {
      setLoading(false);
      alert(res.error || "Failed to save your profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: CHARITY SELECTION */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center px-2">
                <Heart className="mx-auto text-emerald-500 mb-4 h-10 w-10 sm:h-12 sm:w-12" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">Choose Your Cause</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-400">Select the Impact Partner who will receive your contributions.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl mx-2 sm:mx-0">
                 <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                       type="text" 
                       placeholder="Search by name or cause..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredCharities.map(charity => (
                      <button
                        key={charity.id}
                        onClick={() => setSelectedCharity(charity)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${selectedCharity?.id === charity.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                      >
                         <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-slate-900 border border-white/10 shrink-0">
                            <Heart size={18} className={selectedCharity?.id === charity.id ? 'text-emerald-500 fill-emerald-500' : 'text-slate-500'} />
                         </div>
                         <div>
                            <span className="text-sm font-bold text-white block">{charity.name}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{charity.category}</span>
                         </div>
                         {selectedCharity?.id === charity.id && <CheckCircle2 className="ml-auto text-emerald-500" size={20} />}
                      </button>
                    ))}
                 </div>

                 <button 
                   disabled={!selectedCharity}
                   onClick={() => setStep(2)}
                   className="w-full mt-8 flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 disabled:opacity-30 shadow-xl shadow-white/5"
                 >
                    Next Step <ArrowRight size={18} />
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CONTRIBUTION SETTINGS */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center px-4">
                <Settings className="mx-auto text-emerald-500 mb-4 h-10 w-10 sm:h-12 sm:w-12" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">Impact Level</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-400">Set your monthly contribution percentage (Min 10%).</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl mx-2 sm:mx-0">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <Heart className="text-emerald-500 shrink-0" size={24} />
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Supporting</p>
                       <p className="text-base sm:text-lg font-bold text-white leading-tight">{selectedCharity?.name}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="sm:ml-auto text-xs font-bold text-slate-400 hover:text-white underline">Change Partner</button>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-white font-bold">Donation Share</span>
                       <span className="text-emerald-500 font-black text-3xl">{donationPercentage}%</span>
                    </div>
                    <input 
                       type="range" 
                       min="10" 
                       max="100" 
                       step="5"
                       value={donationPercentage}
                       onChange={(e) => setDonationPercentage(e.target.value)}
                       className="w-full h-3 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>PRD Minimum 10%</span>
                       <span>Philanthropist 100%</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => setStep(3)}
                   className="w-full mt-10 flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:bg-slate-100 shadow-xl shadow-white/5"
                 >
                    Review Your Profile <ArrowRight size={18} />
                 </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Trophy className="mx-auto text-emerald-500 mb-4" size={48} />
                <h1 className="text-4xl font-bold text-white tracking-tight">You're Ready</h1>
                <p className="mt-2 text-slate-400">Review your final impact settings and enter the platform.</p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
                 {/* Success Pattern */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[48px] -mr-16 -mt-16" />

                 <div className="space-y-8 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                       <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5">
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Charity Partner</p>
                          <p className="text-sm sm:text-base font-bold text-white leading-tight">{selectedCharity?.name}</p>
                       </div>
                       <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5">
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Donation Pledge</p>
                          <p className="font-bold text-white text-2xl sm:text-3xl">{donationPercentage}%</p>
                       </div>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed italic text-center">
                      "By confirming, you agree to these settings for your monthly draws. You can manage these at any time in your dashboard settings."
                    </p>

                    <div className="flex gap-4">
                       <button 
                         onClick={() => setStep(2)}
                         className="flex-1 rounded-2xl border border-white/10 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/5"
                       >
                          Previous
                       </button>
                       <button 
                         onClick={handleComplete}
                         disabled={loading}
                         className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                       >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : "Launch Dashboard"} <ArrowRight size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
