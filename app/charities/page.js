"use client";

import { motion } from "framer-motion";
import { Search, Filter, Heart, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CHARITIES } from "@/constants/charities";

export default function Charities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(CHARITIES.map(c => c.category))];

  const filteredCharities = CHARITIES.filter(charity => {
    const matchesSearch = charity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          charity.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || charity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-950 pb-24">
      {/* Header */}
      <section className="bg-slate-50 dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl"
          >
            The <span className="text-emerald-600">Impact</span> Network
          </motion.h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover the verified charities we partner with and choose the causes that resonate most with your journey.
          </p>
          
          {/* Search & Filter Bar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search charities..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full rounded-full border border-slate-200 bg-white py-4 pl-12 pr-6 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 shadow-sm"
               />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-4 md:px-0">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                 >
                    {cat}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        {filteredCharities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities.map((charity, index) => (
              <motion.div 
                key={charity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                   {/* Fallback pattern */}
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-slate-900" />
                   {charity.featured && (
                      <div className="absolute top-4 left-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                        Featured Impact
                      </div>
                   )}
                   <div className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                      <Heart size={18} className="text-white" />
                   </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6">
                   <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{charity.category}</span>
                   </div>
                   <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                     {charity.name}
                   </h3>
                   <p className="mb-6 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                     {charity.shortDescription}
                   </p>
                   
                   <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-900">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Latest Impact</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{charity.impactValue}</span>
                      </div>
                      <Link 
                        href={`/charities/${charity.slug}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-emerald-500"
                      >
                         <ArrowRight size={18} />
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
             <div className="mx-auto mb-4 h-16 w-16 text-slate-300">
                <Search size={64} />
             </div>
             <h3 className="text-xl font-bold dark:text-white">No charities found</h3>
             <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
             <button 
               onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
               className="mt-6 text-emerald-600 font-bold hover:underline"
             >
               Clear all filters
             </button>
          </div>
        )}
      </section>

      {/* Quick CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-slate-900 p-8 text-white dark:bg-emerald-950/20 md:p-12 border border-white/5">
            <div className="text-left">
               <h3 className="text-2xl font-bold">Have a charity in mind?</h3>
               <p className="mt-2 text-slate-400">Recommend a verified charity for our network.</p>
            </div>
            <Link 
              href="/support"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 shrink-0"
            >
               Contact Partnership Team <ExternalLink size={14} />
            </Link>
         </div>
      </section>
    </div>
  );
}
