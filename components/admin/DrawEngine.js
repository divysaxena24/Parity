"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  Send, 
  History, 
  Zap, 
  CheckCircle2 
} from "lucide-react";
import { generateDrawNumbers } from "@/lib/draw-engine";
import { publishDraw } from "@/actions/draws";
import ConfirmationModal from "./ConfirmationModal";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DrawEngine({ initialHistory }) {
  const [mode, setMode] = useState("RANDOM");
  const [simulation, setSimulation] = useState(null);
  const [history, setHistory] = useState(initialHistory);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const handleSimulate = () => {
    const numbers = generateDrawNumbers(mode);
    setSimulation({
      numbers,
      month: currentMonth + 1,
      year: currentYear,
      pool: 15240 * (Math.random() + 5), // Simulating a pool of ~$75k-90k
    });
  };

  const handlePublish = async () => {
    if (!simulation) return;
    const result = await publishDraw(
      simulation.month, 
      simulation.year, 
      simulation.numbers, 
      simulation.pool
    );

    if (result.success) {
      setHistory([{ 
        id: Date.now().toString(), 
        month: simulation.month, 
        year: simulation.year, 
        draw_numbers: simulation.numbers, 
        total_pool: simulation.pool,
        status: 'COMPLETED' 
      }, ...history]);
      setMessage({ type: "success", text: `${MONTHS[simulation.month-1]} draw Published.` });
      setSimulation(null);
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Draw Control Panel */}
      <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-black shadow-sm">
             <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
                <Trophy size={18} className="text-emerald-600" /> {MONTHS[currentMonth]} {currentYear} Cycle
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Generation Logic</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setMode("RANDOM")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${mode === 'RANDOM' ? 'border-emerald-600 bg-emerald-500/5 text-emerald-600' : 'border-zinc-100 text-zinc-500 hover:border-zinc-300 dark:border-zinc-800'}`}
                      >
                         <Zap size={20} />
                         <span className="text-xs font-bold">Random</span>
                      </button>
                      <button 
                        onClick={() => setMode("ALGORITHMIC")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${mode === 'ALGORITHMIC' ? 'border-emerald-600 bg-emerald-500/5 text-emerald-600' : 'border-zinc-100 text-zinc-500 hover:border-zinc-300 dark:border-zinc-800'}`}
                      >
                         <Target size={20} />
                         <span className="text-xs font-bold">Algorithmic</span>
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Monthly Quorum</label>
                   <div className="space-y-4">
                      <StatusItem label="Qualified Golders" value="Live Data Sync" complete={true} />
                      <StatusItem label="Prize Pool Calculation" value="Automated" complete={true} />
                   </div>
                </div>
             </div>

             <div className="mt-12 flex items-center gap-4">
                <button 
                  onClick={handleSimulate}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-4 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <RotateCcw size={18} /> Simulate
                </button>
                <button 
                  disabled={!simulation}
                  onClick={() => setIsPublishModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  <Send size={18} /> Publish Official Results
                </button>
             </div>
          </div>

          <AnimatePresence>
             {simulation && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="rounded-3xl bg-zinc-950 p-8 text-white dark:bg-emerald-950/20 shadow-2xl border border-white/5"
               >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                     <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                          Simulation Results Preview
                        </div>
                        <div className="flex gap-4">
                           {simulation.numbers.map((n, i) => (
                             <div key={i} className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-2xl font-black text-emerald-400">
                                {n}
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Projected Pool</span>
                        <span className="text-3xl font-black text-white">${simulation.pool.toLocaleString()}</span>
                     </div>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>
      </div>

      <div className="lg:col-span-1 space-y-6">
         <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold px-2">
           <History size={18} className="text-emerald-600" /> Cycle Audit History
         </div>
         <div className="space-y-4">
            {history.length > 0 ? history.map((d) => (
              <div key={d.id} className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-black shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-bold">{MONTHS[d.month-1]} {d.year}</span>
                     <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-widest underline">Verified</span>
                  </div>
                  <div className="flex gap-2">
                     {d.draw_numbers.map((n, i) => (
                        <div key={i} className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs dark:bg-zinc-900">
                           {n}
                        </div>
                     ))}
                  </div>
              </div>
            )) : (
              <div className="p-8 text-center text-zinc-400 text-xs italic">No previous draws documented.</div>
            )}
         </div>
      </div>

      <ConfirmationModal 
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublish}
        title="Publish Official Results?"
        message={`This will finalize the ${MONTHS[currentMonth]} ${currentYear} cycle and broadcast these numbers to all subscribers. This action is irreversible and audits will be logged.`}
        confirmText="Confirm Publication"
        variant="info"
      />
    </div>
  );
}

function StatusItem({ label, value, complete }) {
  return (
    <div className="flex items-center justify-between text-xs font-medium">
       <span className="text-zinc-500">{label}</span>
       <span className="flex items-center gap-2 text-zinc-900 dark:text-white">
          {value}
          <CheckCircle2 size={14} className={complete ? 'text-emerald-600' : 'text-zinc-300'} />
       </span>
    </div>
  );
}
