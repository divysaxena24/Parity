"use client";

import { motion } from "framer-motion";
import { Check, Heart, Trophy, Zap, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/actions/stripe";

export default function Pricing() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Monthly Impact",
      price: isYearly ? "19.99" : "24.99",
      description: "Ideal for regular golfers who want to contribute and track their performance monthly.",
      features: [
        "Store up to 5 latest golf scores",
        "Entry into Monthly Prize Draw",
        "Select and Support 1 Charity",
        "Basic performance analytics",
        "Stripe-secured payments",
        "Cancel anytime"
      ],
      cta: "Start Monthly",
      featured: false
    },
    {
      name: "Yearly Champion",
      price: isYearly ? "199.99" : "249.99",
      description: "For the committed golfer. Save 20% on your membership and increase your long-term impact.",
      features: [
        "Include all Monthly Impact perks",
        "20% Discount on annual rate",
        "Featured 'Impact Partner' badge",
        "Priority winner claim verification",
        "Early access to new features",
        "Year-end impact report"
      ],
      cta: "Join as Champion",
      featured: true
    }
  ];

  const handlePayment = async (planId) => {
    if (!isSignedIn) {
      router.push("/signup");
      return;
    }

    setLoading(true);
    const planType = isYearly ? "YEARLY" : "MONTHLY";
    const res = await createCheckoutSession(planType);
    
    if (res.url) {
      window.location.href = res.url;
    } else {
      setLoading(false);
      alert(res.error || "Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 pb-24">
      {/* Header */}
      <section className="py-16 sm:py-24 text-center px-4">
        <div className="mx-auto max-w-7xl">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
           Simple, <span className="text-emerald-600">Impact-Driven</span> Pricing
          </motion.h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose the membership that fits your play style. Every membership tier guarantees support for our partner charities.
          </p>
          
          {/* Toggle */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-7 w-12 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors"
            >
               <motion.div 
                 animate={{ x: isYearly ? 20 : 0 }}
                 className="h-5 w-5 rounded-full bg-emerald-600 shadow-md shadow-emerald-500/30"
               />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Yearly <span className="text-xs text-emerald-500">(Save 20%)</span></span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-5xl px-4">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-lg lg:max-w-none mx-auto">
            {plans.map((plan) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-6 sm:p-8 rounded-3xl border ${plan.featured ? 'border-emerald-500 bg-emerald-500/5 shadow-22xl shadow-emerald-500/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-600/30">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">/{isYearly ? 'year' : 'month'}</span>
                </div>
                
                <button
                  onClick={() => handlePayment(plan.id)}
                  disabled={loading}
                  className={`mt-10 flex w-full items-center justify-center gap-2 text-center py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${plan.featured ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' : 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100'}`}
                >
                   {loading && <Loader2 className="animate-spin" size={18} />}
                   {loading ? "Connecting..." : plan.cta}
                </button>

                <ul className="mt-10 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                   {plan.features.map((feature) => (
                     <li key={feature} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium leading-normal">{feature}</span>
                     </li>
                   ))}
                </ul>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Feature Teasers */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <Feature icon={<Zap className="text-emerald-500" />} title="Instant Impact" description="10% minimum donation from every subscription fee." />
            <Feature icon={<ShieldCheck className="text-emerald-500" />} title="Secure Payments" description="Everything processed safely via Stripe Test Mode." />
            <Feature icon={<Trophy className="text-emerald-500" />} title="Verified Wins" description="Transparent draw engine with public results." />
         </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center">
       <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 mb-4">
          {icon}
       </div>
       <h4 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
       <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
