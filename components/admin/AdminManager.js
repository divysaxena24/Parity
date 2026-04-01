"use client";

import { useState } from "react";
import { createAdmin } from "@/actions/admin-auth";
import { deleteAdmin } from "@/actions/management";
import { seedPlatformData } from "@/actions/seed";
import { 
  UserPlus, 
  ShieldAlert, 
  Trash2, 
  Mail, 
  Key, 
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import ConfirmationModal from "./ConfirmationModal";

export default function AdminManager({ initialAdmins }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);

  async function handleAddAdmin(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await createAdmin(email, password);

    if (result.success) {
      setMessage({ type: "success", text: "New administrator added successfully." });
      setAdmins([{ email, created_at: new Date().toISOString() }, ...admins]);
      e.target.reset();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to add administrator." });
    }
    setSubmitting(false);
  }

  async function handleDelete() {
    if (!deletingAdmin) return;
    const result = await deleteAdmin(deletingAdmin.email);
    if (result.success) {
      setAdmins(admins.filter(a => a.email !== deletingAdmin.email));
      setMessage({ type: "success", text: "Access revoked successfully." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setDeletingAdmin(null);
  }

  async function handleSeed() {
    setSeeding(true);
    const result = await seedPlatformData();
    if (result.success) {
      setMessage({ type: "success", text: "Platform successfully seeded with sample records." });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setSeeding(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Add New Admin Form */}
      <div className="lg:col-span-1 space-y-6">
         <div className="rounded-3xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-black shadow-sm h-fit">
            <div className="mb-6 flex items-center gap-3">
               <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <UserPlus size={20} />
               </div>
               <h3 className="text-lg font-bold">Add Administrator</h3>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Account</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                     <input 
                       required
                       name="email"
                       type="email"
                       className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none focus:border-emerald-500 transition-all text-sm font-bold"
                       placeholder="colleague@parity.com"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Initial Password</label>
                  <div className="relative">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                     <input 
                       required
                       name="password"
                       type="password"
                       className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 outline-none focus:border-emerald-500 transition-all text-sm font-bold"
                       placeholder="••••••••"
                     />
                  </div>
               </div>

               {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
                  >
                     {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                     {message.text}
                  </motion.div>
               )}

               <button 
                 disabled={submitting}
                 className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
               >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : "Authorize User"}
               </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
               <div className="flex gap-3 text-zinc-400">
                  <ShieldAlert size={32} className="shrink-0" />
                  <p className="text-[10px] font-medium leading-relaxed">
                     Adding an administrator grants full control over the platform. Ensure the recipient is verified and uses a unique, secure password.
                  </p>
               </div>
            </div>
         </div>

         {/* Seeding Tool (One-time utility) */}
         <div className="rounded-3xl border border-dotted border-zinc-200 p-6 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <Database size={14} /> Platform Data Seed
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mb-4 leading-relaxed font-medium">
               Populate the database with high-fidelity sample golfers, draw history, and winner claims to see full dashboard KPIs.
            </p>
            <button 
              disabled={seeding}
              onClick={handleSeed}
              className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
            >
               {seeding ? <Loader2 size={14} className="animate-spin" /> : "Initialize Sample Records"}
            </button>
         </div>
      </div>

      {/* Admin List */}
      <div className="lg:col-span-2">
         <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden dark:border-zinc-800 dark:bg-black shadow-sm">
            <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
               <h3 className="text-sm sm:text-lg font-black tracking-tight uppercase">High-Level Administrators</h3>
               <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-500 uppercase tracking-widest italic leading-none">Encrypted Persistence</span>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
               <table className="w-full text-left min-w-[600px] lg:min-w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                     <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Admin Identity</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-black tracking-tighter">Auth Created</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                     {admins.length > 0 ? (
                       admins.map((admin, idx) => (
                         <motion.tr 
                           key={idx} 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group"
                         >
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 uppercase">
                                     {admin.email.charAt(0)}
                                  </div>
                                  <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{admin.email}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2 text-zinc-400 font-bold italic text-xs tracking-tighter">
                                  <Calendar size={14} />
                                  <span>{new Date(admin.created_at).toLocaleDateString()}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <button 
                                 onClick={() => setDeletingAdmin(admin)}
                                 className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </td>
                         </motion.tr>
                       ))
                     ) : (
                       <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-sm font-bold italic text-zinc-500 uppercase tracking-widest">No additional administrators identified.</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deletingAdmin}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleDelete}
        title="Revoke Admin Access?"
        message={`This will permanently terminate ${deletingAdmin?.email}'s session and access to the Parity administrative platform. This action is irreversible and recorded in the audit logs.`}
        confirmText="Revoke Access"
        variant="danger"
      />
    </div>
  );
}
