import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  Heart, 
  Trophy, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Zap,
  X
} from "lucide-react";
import Link from "next/link";
import { adminLogout } from "@/actions/admin-auth";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleLogout = async () => {
    await adminLogout();
  };

  const menuItems = [
    { name: "Global Analytics", href: "/admin", icon: <BarChart3 size={18} /> },
    { name: "Users & Subs", href: "/admin/users", icon: <Users size={18} /> },
    { name: "Charity Management", href: "/admin/charities", icon: <Heart size={18} /> },
    { name: "Monthly Draw Engine", href: "/admin/draws", icon: <Trophy size={18} /> },
    { name: "Winner Verification", href: "/admin/winners", icon: <ShieldCheck size={18} /> },
    { name: "Reporting Center", href: "/admin/reports", icon: <Zap size={18} /> },
    { name: "Access Control", href: "/admin/management", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">System Access</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Administrator</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 lg:hidden text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                      isActive 
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl shadow-zinc-900/10" 
                      : "text-zinc-500 hover:bg-zinc-100/50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 italic tracking-tight">
                      {item.icon}
                      {item.name}
                    </div>
                    {isActive && <ChevronRight size={14} />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
             <div className="rounded-2xl bg-zinc-950 p-4 text-white dark:bg-emerald-950/20 border border-white/5">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Admin Safety</p>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-bold italic opacity-80">
                  Verify winner proof documentation thoroughly before clicking Mark Paid. All actions are audited.
                </p>
             </div>
             
             <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 uppercase tracking-widest italic"
              >
                <LogOut size={18} />
                Sign Out
              </button>
          </div>
        </div>

        <ConfirmationModal 
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="Admin Logout"
          message="Are you sure you want to terminate your administrative session? You will need to login again to access platform controls."
          confirmText="Sign Out"
          variant="info"
        />
      </aside>
    </>
  );
}
