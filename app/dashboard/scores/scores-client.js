"use client";

import { useState } from "react";
import { addScore, deleteScore } from "@/actions/scores";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  Info,
  CheckCircle2,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScoresClient({ initialScores, isSubscriber }) {
  const [scores, setScores] = useState(initialScores);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    const res = await addScore(new FormData(e.target));
    if (res.error) {
      setError(res.error);
    } else {
      setShowAddForm(false);
      // Refresh scores (In real app, revalidatePath handles this, but we update locally for speed)
      window.location.reload(); 
    }
    setFormLoading(false);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this score?")) {
      const res = await deleteScore(id);
      if (res.success) {
        window.location.reload();
      }
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/5 pb-8 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Score Tracking</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your latest 5 Stableford scores.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
        >
          {showAddForm ? "Cancel" : <><Plus size={18} /> New Score</>}
        </button>
      </div>

      {/* Rule Hint */}
      <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 flex gap-4 text-blue-700 dark:text-blue-300">
        <Info size={20} className="shrink-0" />
        <p className="text-sm font-medium leading-relaxed">
          <strong>Pro Rule:</strong> We only track your **latest 5 scores**. When you add a new one, the oldest record is automatically retired to ensure current performance is reflected in the draws.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scores List */}
        <div className="lg:col-span-2 space-y-4">
           {scores.length > 0 ? (
             <div className="space-y-4">
               <AnimatePresence>
                 {scores.map((score, i) => (
                   <motion.div
                     key={score.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     transition={{ delay: i * 0.05 }}
                     className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 group"
                   >
                     <div className="flex items-center gap-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                           <Trophy size={18} />
                        </div>
                        <div>
                           <p className="text-2xl font-black text-slate-900 dark:text-white">{score.score} pts</p>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar size={12} />
                              {new Date(score.date_played).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                           </div>
                        </div>
                     </div>
                     <button
                        onClick={() => handleDelete(score.id)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
           ) : (
             <div className="rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center dark:border-slate-800">
                <ClipboardList className="mx-auto mb-4 text-slate-300" size={48} />
                <h3 className="text-xl font-bold dark:text-white">No scores yet</h3>
                <p className="text-slate-500 dark:text-slate-400">Track your first performance to qualify for rewards.</p>
             </div>
           )}
        </div>

        {/* Action Sidebar / Form */}
        <div className="space-y-8">
           {showAddForm && (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="rounded-3xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:bg-emerald-950/10 shadow-xl shadow-emerald-500/5"
             >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Record New Performance</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600">
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stableford Score (1-45)</label>
                    <input
                      name="score"
                      type="number"
                      required
                      min="1"
                      max="45"
                      placeholder="e.g. 36"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm focus:border-emerald-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date Played</label>
                    <input
                      name="datePlayed"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm focus:border-emerald-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {formLoading ? "Recording..." : "Add Score"}
                  </button>
                </form>
             </motion.div>
           )}

           <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
               <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Score Eligibility</h3>
               <div className="space-y-6">
                  <EligibilityItem label="Monthly Quorum" value={`${scores.length}/5`} complete={scores.length >= 5} />
                  <EligibilityItem label="Active Subscription" value={isSubscriber ? "Yes" : "Check Status"} complete={isSubscriber} />
                  <EligibilityItem label="Verification Ready" value="Yes" complete={true} />
               </div>
               
               <hr className="my-8 border-slate-200 dark:border-slate-800" />
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 Eligible users with 5 scores by the 28th of each month will be automatically entered into the draw.
               </p>
           </div>
        </div>
      </div>
    </>
  );
}

function EligibilityItem({ label, value, complete }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-semibold">{label}</span>
       </div>
       <div className={`text-xs font-bold flex items-center gap-1 ${complete ? 'text-emerald-600' : 'text-amber-500'}`}>
          {complete && <CheckCircle2 size={12} />} {value}
       </div>
    </div>
  );
}
