"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  User, 
  Trophy, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  ShieldX
} from "lucide-react";
import { updateWinnerStatus, finalizePayout } from "@/actions/winners";
import ConfirmationModal from "./ConfirmationModal";

export default function WinnerManagement({ initialClaims }) {
  const [claims, setClaims] = useState(initialClaims);
  const [confirmingAction, setConfirmingAction] = useState(null); // { id, status }
  const [message, setMessage] = useState(null);

  const handleUpdate = async () => {
    if (!confirmingAction) return;
    const { id, status } = confirmingAction;
    
    const result = await updateWinnerStatus(id, status);
    
    if (result.success) {
      setClaims(claims.map(c => c.id === id ? { ...c, status } : c));
      setMessage({ type: "success", text: `Claim has been ${status.toLowerCase()} successfully.` });
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setConfirmingAction(null);
  };

  return (
    <div className="space-y-8">
      {message && (
         <motion.div 
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
         >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {message.text}
         </motion.div>
      )}

      {claims.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
           <Trophy size={48} className="mx-auto text-zinc-200 mb-4" />
           <p className="text-zinc-500 font-medium tracking-tight">No prize claims currently awaiting audit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {claims.map((claim) => (
             <motion.div 
               key={claim.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black group"
             >
                <div className="mb-6 flex items-center justify-between">
                   <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {claim.status === 'PENDING' ? <Clock size={12} /> : claim.status === 'APPROVED' ? <ShieldCheck size={12} /> : <ShieldX size={12} />}
                      {claim.status}
                   </div>
                   <span className="text-xs font-bold text-zinc-400">{new Date(claim.created_at).toLocaleDateString()}</span>
                </div>

                <div className="mb-6 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center dark:bg-zinc-900 border border-zinc-100 dark:border-white/5">
                         <User size={18} className="text-zinc-400" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none mb-1">{claim.user_name}</span>
                         <span className="text-[11px] text-zinc-400 font-medium">{claim.user_email}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-500/10 text-emerald-600">
                         <Trophy size={18} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-emerald-600 leading-none mb-1">${claim.amount.toLocaleString()} Potential</span>
                         <span className="text-[11px] text-zinc-400 font-medium">{claim.month} {claim.year} Draw</span>
                      </div>
                   </div>
                </div>

                <div className="mb-8 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-inner">
                   <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      <span>Verification Proof</span>
                      <ImageIcon size={14} className="text-zinc-300" />
                   </div>
                   {claim.proof_url ? (
                      <div className="relative aspect-video rounded-lg bg-zinc-200 overflow-hidden">
                         <img src={claim.proof_url} alt="Proof" className="h-full w-full object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold underline">Review Full Size</span>
                         </div>
                      </div>
                   ) : (
                      <div className="py-8 text-center text-zinc-400 italic text-xs">No screenshot provided.</div>
                   )}
                </div>

                {claim.status === 'PENDING' && (
                  <div className="flex gap-3">
                     <button 
                       onClick={() => setConfirmingAction({ id: claim.id, status: 'REJECTED' })}
                       className="flex-1 rounded-xl border border-red-200 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
                     >
                        Reject
                     </button>
                     <button 
                       onClick={() => setConfirmingAction({ id: claim.id, status: 'APPROVED' })}
                       className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                     >
                        Approve
                     </button>
                  </div>
                )}
             </motion.div>
           ))}
        </div>
      )}

      <ConfirmationModal 
        isOpen={!!confirmingAction}
        onClose={() => setConfirmingAction(null)}
        onConfirm={handleUpdate}
        title={confirmingAction?.status === 'APPROVED' ? "Approve Prize Claim?" : "Reject Prize Claim?"}
        message={confirmingAction?.status === 'APPROVED' 
          ? "This will mark the golfer as verified. The prize amount will be added to the official payouts list. This action is audited."
          : "Are you sure you want to reject this claim? The user will be notified and the amount will remain in the prize pool."
        }
        confirmText={confirmingAction?.status === 'APPROVED' ? "Approve Payout" : "Reject Claim"}
        variant={confirmingAction?.status === 'APPROVED' ? "info" : "danger"}
      />
    </div>
  );
}
