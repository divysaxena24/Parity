"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Heart, 
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { createCharity, updateCharity, deleteCharity } from "@/actions/charities";
import ConfirmationModal from "./ConfirmationModal";

export default function CharityManager({ initialCharities }) {
  const [charities, setCharities] = useState(initialCharities);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({ type: null, charity: null }); // type: 'add' | 'edit'
  const [deletingCharity, setDeletingCharity] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      category: formData.get('category'),
      shortDescription: formData.get('shortDescription'),
      fullDescription: formData.get('fullDescription'),
      image: formData.get('image'),
      isFeatured: formData.get('isFeatured') === 'on'
    };

    let result;
    if (modalState.type === 'edit') {
      result = await updateCharity(modalState.charity.id, data);
    } else {
      result = await createCharity(data);
    }

    if (result.success) {
      window.location.reload(); 
    } else {
      setMessage({ type: 'error', text: result.error });
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCharity) return;
    const result = await deleteCharity(deletingCharity.id);
    if (result.success) {
      setCharities(charities.filter(c => c.id !== deletingCharity.id));
      setMessage({ type: 'success', text: `Charity Organization removed.` });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setDeletingCharity(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="w-full md:max-w-none">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">Impact Partners</h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-bold italic opacity-80">Manage global charities and social pledges.</p>
        </div>
        <button
          onClick={() => setModalState({ type: 'add' })}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-[10px] font-black uppercase text-white tracking-widest transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} /> Add New Partner
        </button>
      </div>

      {message && (
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}
         >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message.text}
         </motion.div>
      )}

      {/* Filter Bar */}
      <div className="relative max-w-md text-zinc-900 dark:text-white">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
         <input 
           type="text" 
           placeholder="Search organizations..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-6 text-sm outline-none focus:border-emerald-500 transition-all dark:border-zinc-800 dark:bg-black shadow-sm font-bold"
         />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredCharities.map((charity) => (
           <motion.div 
             key={charity.id}
             layout
             className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-black shadow-sm hover:border-emerald-500/30 transition-all"
           >
              <div className="flex items-start justify-between mb-8">
                 <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-500/10 shadow-inner">
                    <Heart size={28} />
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setModalState({ type: 'edit', charity })}
                      className="p-2.5 rounded-xl text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:text-emerald-600 transition-colors"
                    >
                       <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeletingCharity(charity)}
                      className="p-2.5 rounded-xl text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:text-red-600 transition-colors">
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter italic leading-none">{charity.name}</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-widest mb-4 italic opacity-80">{charity.category}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-8 font-medium">
                 {charity.short_description}
              </p>
              
              <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                 <Link 
                   href={`/charity/${charity.slug}`} 
                   target="_blank"
                   className={`h-11 w-11 rounded-full flex items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-emerald-600 hover:text-white transition-all shadow-sm`}
                 >
                    <ExternalLink size={18} />
                 </Link>
                 <div className="text-right">
                    <span className="text-[9px] font-black text-zinc-400 uppercase block leading-none tracking-widest">Impact Axis</span>
                    <span className="text-[11px] font-black italic text-emerald-600 uppercase tracking-tighter">/{charity.slug}</span>
                 </div>
              </div>
           </motion.div>
         ))}

         {filteredCharities.length === 0 && (
           <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem]">
              <Heart size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px] italic">No partners match high-fidelity criteria.</p>
           </div>
         )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
         {modalState.type && (
           <div className="fixed inset-0 z-50 flex items-start lg:items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 overflow-y-auto pt-20 lg:pt-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl rounded-[2.5rem] bg-white p-8 sm:p-12 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl mb-12 lg:my-auto"
              >
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic leading-none">
                       {modalState.type === 'edit' ? 'Update Partner' : 'Onboard Partner'}
                    </h2>
                    <button 
                      onClick={() => setModalState({ type: null, charity: null })}
                      className="p-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                       <X size={20} className="text-zinc-400" />
                    </button>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Input name="name" label="Organization Identity" defaultValue={modalState.charity?.name} placeholder="e.g. GreenFairways" required />
                       <Input name="slug" label="Impact Axis / Slug" defaultValue={modalState.charity?.slug} placeholder="e.g. green-fairways" required />
                       <Input name="category" label="Sector" defaultValue={modalState.charity?.category} placeholder="e.g. Environment" required />
                       <Input name="image" label="Visual Asset URL" defaultValue={modalState.charity?.image} placeholder="e.g. /charity-green.jpg" />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Universal Mission Preview</label>
                       <textarea 
                         name="shortDescription"
                         defaultValue={modalState.charity?.short_description} 
                         required
                         rows={2}
                         className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold italic"
                         placeholder="Short mission summary..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Detailed Social Impact Narrative</label>
                       <textarea 
                         name="fullDescription"
                         defaultValue={modalState.charity?.full_description} 
                         rows={4}
                         className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold italic leading-relaxed"
                         placeholder="Full detailed impact story..."
                       />
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <input type="checkbox" name="isFeatured" defaultChecked={modalState.charity?.is_featured} id="isFeatured" className="h-5 w-5 accent-emerald-600 rounded-lg cursor-pointer" />
                        <label htmlFor="isFeatured" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Promote to Platform Hero</label>
                    </div>
                    
                    <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                       <button 
                         disabled={isSubmitting}
                         className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-12 py-5 text-[11px] font-black uppercase text-white tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50 italic"
                       >
                          {isSubmitting ? 'Syncing...' : (
                             <>
                                <Save size={18} />
                                {modalState.type === 'edit' ? 'Finalize Updates' : 'Secure Partnership'}
                             </>
                          )}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      <ConfirmationModal 
        isOpen={!!deletingCharity}
        onClose={() => setDeletingCharity(null)}
        onConfirm={handleDelete}
        title="Sever Partner Link?"
        message={`This will permanently remove ${deletingCharity?.name} from the platform. Safety Protocol: Action will fail if active subscribers are currently pledged to this impact axis.`}
        confirmText="Confirm Removal"
        variant="danger"
      />
    </div>
  );
}

function Input({ label, name, defaultValue, placeholder, required = false }) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">{label}</label>
       <input 
         type="text" 
         name={name}
         defaultValue={defaultValue} 
         placeholder={placeholder}
         required={required}
         className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 py-4 px-6 text-sm outline-none transition-all font-black italic focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
       />
    </div>
  );
}
