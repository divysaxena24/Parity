"use client";

import { 
  User, 
  CreditCard, 
  Heart, 
  Shield, 
  Save, 
  Loader2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { CHARITIES } from "@/constants/charities";
import { createCheckoutSession } from "@/actions/stripe";

export default function SettingsClient({ userData, clerkUser }) {
  const { openUserProfile } = useClerk();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [percentage, setPercentage] = useState(userData?.donation_percentage || 10);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard size={18} /> },
    { id: "impact", label: "Impact Partner", icon: <Heart size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const handleUpgrade = async () => {
    setLoading(true);
    const result = await createCheckoutSession("MONTHLY");
    if (result.url) {
      window.location.href = result.url;
    } else {
      setLoading(false);
      alert(result.error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Tab Navigation */}
      <div className="w-full lg:w-64 space-y-1">
         {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
               activeTab === tab.id 
               ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl" 
               : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
             }`}
           >
              {tab.icon}
              {tab.label}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
         <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: 10 }}
           animate={{ opacity: 1, x: 0 }}
           className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
         >
            {activeTab === "profile" && (
              <form onSubmit={handleUpdate} className="space-y-6">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Display Name" defaultValue={userData?.name || clerkUser?.fullName} />
                    <Input label="Email Address" defaultValue={userData?.email || clerkUser?.primaryEmailAddress?.emailAddress} disabled />
                 </div>
                 <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                       {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                       {success ? "Saved Changes!" : "Save Changes"}
                    </button>
                 </div>
              </form>
            )}

            {activeTab === "impact" && (
               <div className="space-y-10">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">My Impact Partner</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Choose the organization that receives your platform contributions.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CHARITIES.map((c) => (
                          <button
                             key={c.id}
                             className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${c.id === userData?.active_charity_id ? 'border-emerald-600 bg-emerald-500/5 dark:bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                          >
                             <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shrink-0">
                                <Heart size={18} className={c.id === userData?.active_charity_id ? 'text-emerald-600 fill-emerald-600' : 'text-slate-300'} />
                             </div>
                             <div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white block mb-0.5">{c.name}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{c.category}</span>
                             </div>
                          </button>
                        ))}
                     </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Donation Percentage</h3>
                        <button 
                          onClick={async () => {
                            setLoading(true);
                            const formData = new FormData();
                            formData.set("donationPercentage", percentage);
                            formData.set("charityId", userData?.active_charity_id);
                            const { updateCharitySettings } = await import("@/actions/charity");
                            const res = await updateCharitySettings(formData);
                            setLoading(false);
                            if (res.success) setSuccess(true);
                          }}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          {loading ? "Saving..." : success ? "Saved!" : "Save Preference"}
                        </button>
                     </div>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Increase your impact by pledging a higher percentage of your subscription fee (Min 10%).</p>
                     <div className="flex items-center gap-8 max-w-sm">
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          className="flex-1 accent-emerald-600" 
                          value={percentage} 
                          onChange={(e) => setPercentage(e.target.value)}
                        />
                        <div className="h-12 w-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg dark:bg-slate-950 border border-white/5 shadow-xl shadow-slate-950/20">
                           {percentage}%
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === "subscription" && (
              <div className="flex flex-col items-center py-12 text-center">
                  <CreditCard size={48} className={userData?.subscription_status === 'ACTIVE' ? 'text-emerald-500 mb-6' : 'text-slate-300 mb-6'} />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {userData?.subscription_status === 'ACTIVE' ? 'Active Plan Status' : 'No Active Membership'}
                  </h3>
                  
                  {userData?.subscription_status === 'ACTIVE' ? (
                    <>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Standard Monthly • $24.99/mo
                      </div>
                      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Your next billing cycle begins in 14 days. You can manage your Stripe details or cancel through our secure billing portal.</p>
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          const { createPortalSession } = await import("@/actions/stripe");
                          const res = await createPortalSession();
                          if (res.url) {
                            window.location.href = res.url;
                          } else {
                            setLoading(false);
                            alert(res.error);
                          }
                        }}
                        disabled={loading}
                        className="mt-10 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 disabled:opacity-50"
                      >
                         {loading ? <Loader2 className="animate-spin" size={16} /> : "Go to Stripe Customer Portal"} <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">Upgrade to a Parity membership to join the monthly draws and support your favorite charities with every round.</p>
                      <button 
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="mt-10 flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-xl shadow-emerald-500/20"
                      >
                         {loading ? <Loader2 className="animate-spin" size={18} /> : "Upgrade to Pro Member"} <ArrowRight size={16} />
                      </button>
                    </>
                  )}

                  <div className="mt-12 flex items-center gap-3">
                     <CheckCircle2 size={16} className={userData?.subscription_status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-200'} />
                     <span className="text-xs text-slate-400 font-medium tracking-tight">Secure billing processed via Stripe.</span>
                  </div>
              </div>
            )}

            {activeTab === "security" && (
               <div className="space-y-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security & Access</h3>
                  <div className="space-y-6">
                     <p className="text-sm text-slate-500 leading-relaxed italic">Authentication and security settings are managed via Clerk Identity.</p>
                     <button 
                       onClick={() => openUserProfile()}
                       className="rounded-full bg-zinc-900 px-8 py-4 text-sm font-bold text-white dark:bg-white dark:text-black transition-all hover:opacity-80"
                     >
                        Manage Security Profile
                     </button>
                  </div>
               </div>
            )}
         </motion.div>
      </div>
    </div>
  );
}

function Input({ label, defaultValue, disabled, type = "text" }) {
  return (
    <div className="space-y-1.5">
       <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
       <input 
         type={type}
         defaultValue={defaultValue} 
         disabled={disabled}
         className={`w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 px-5 text-sm outline-none transition-all focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed font-medium' : ''}`}
       />
    </div>
  );
}
