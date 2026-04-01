"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, X, Trash2, LogOut } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  variant = "warning" // warning, danger, info
}) {
  if (!isOpen) return null;

  const variants = {
    warning: {
       icon: <AlertTriangle size={24} className="text-amber-500" />,
       bg: "bg-amber-500/10",
       border: "border-amber-500/20",
       button: "bg-amber-600 hover:bg-amber-700"
    },
    danger: {
       icon: <Trash2 size={24} className="text-red-500" />,
       bg: "bg-red-500/10",
       border: "border-red-500/20",
       button: "bg-red-600 hover:bg-red-700"
    },
    info: {
       icon: <LogOut size={24} className="text-emerald-500" />,
       bg: "bg-emerald-500/10",
       border: "border-emerald-500/20",
       button: "bg-emerald-600 hover:bg-emerald-700"
    }
  };

  const style = variants[variant] || variants.warning;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl backdrop-blur-xl"
        >
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center">
             <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${style.bg} ${style.border} border shadow-lg`}>
                {style.icon}
             </div>
             
             <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
             <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8">
                {message}
             </p>

             <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-bold text-zinc-400 hover:bg-white/5 transition-all"
                >
                   Cancel
                </button>
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all ${style.button}`}
                >
                   {confirmText}
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
