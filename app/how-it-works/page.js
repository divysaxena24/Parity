"use client";

import { motion } from "framer-motion";
import { Check, Trophy, Heart, CreditCard, ClipboardCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Join the Movement",
      description: "Sign up and choose between our Monthly or Yearly impact plans. Every subscription feeds directly into the prize pool and charity contributions.",
      icon: <CreditCard className="text-emerald-500" />,
      details: ["Secure Stripe payments", "Choose your subscription tier", "Immediate access to dashboard"]
    },
    {
      title: "2. Support Your Cause",
      description: "Select one of our partner charities. You can decide what percentage of your subscription fee goes directly to them (minimum 10%).",
      icon: <Heart className="text-emerald-500" />,
      details: ["12+ verified charities", "Adjustable donation percentage", "Transparent impact tracking"]
    },
    {
      title: "3. Track Your Scores",
      description: "Enter your latest Stableford golf scores. Our platform only keeps your latest 5 scores to ensure active participation and fair play.",
      icon: <ClipboardCheck className="text-emerald-500" />,
      details: ["Stableford 1-45 range", "Automatic 'Latest 5' rule", "Historical performance charts"]
    },
    {
      title: "4. Enter the Draw",
      description: "Your latest 5 scores act as your monthly entry numbers. We use a sophisticated draw engine to generate winning sets.",
      icon: <Trophy className="text-emerald-500" />,
      details: ["Monthly official draws", "Match 3, 4, or 5 categories", "Jackpot rollover mechanics"]
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 pb-24">
      {/* Header */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-emerald-500 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl"
          >
            How Parity Works
          </motion.h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A transparent, impact-driven ecosystem for golfers who want their passion to make a difference.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 mb-6">
                  {step.icon}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{step.title}</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400">
                        <Check size={12} />
                      </div>
                      <span className="text-sm font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 aspect-video rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                 <span className="text-slate-400 font-mono text-sm uppercase tracking-widest">Visual Illustration {index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Prize Logic */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
           <Trophy size={48} className="mx-auto text-emerald-500 mb-8" />
           <h2 className="text-3xl font-bold mb-6">Transparent Prize Distribution</h2>
           <p className="text-slate-400 text-lg mb-12">
             We allocate 40% of our total subscription revenue to the monthly prize pool. Another 40% goes directly to partner charities, with the remaining 20% covering platform operations and compliance.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PrizeCategory title="5-Match" share="40%" description="Jackpot level reward for perfect score synchronization." />
              <PrizeCategory title="4-Match" share="35%" description="Significant monthly payout for high-tier performance." />
              <PrizeCategory title="3-Match" share="25%" description="Consistent rewards distributed to all qualifiers." />
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
         <h2 className="text-3xl font-bold dark:text-white mb-8">Ready to play with purpose?</h2>
         <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30"
          >
            Get Started <ArrowRight size={20} />
          </Link>
      </section>
    </div>
  );
}

function PrizeCategory({ title, share, description }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
       <h3 className="text-xl font-bold text-emerald-400 mb-2">{title}</h3>
       <div className="text-3xl font-black mb-4">{share} <span className="text-xs font-normal text-slate-500">of pool</span></div>
       <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
