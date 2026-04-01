"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShieldCheck, 
  CreditCard, 
  MoreHorizontal, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserCog,
  Crown,
  ChevronDown
} from "lucide-react";
import { deleteUser, updateUserStatus, updateUserRole } from "@/actions/users";
import ConfirmationModal from "./ConfirmationModal";

export default function UserTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingUser, setDeletingUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "All" || u.subscription_status === statusFilter)
  );

  const handleDelete = async () => {
    if (!deletingUser) return;
    const result = await deleteUser(deletingUser.id);
    if (result.success) {
      setUsers(users.filter(u => u.id !== deletingUser.id));
      setMessage({ type: "success", text: `User ${deletingUser.name} removed successfully.` });
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setDeletingUser(null);
  };

  const handleRoleUpdate = async (id, role) => {
     const result = await updateUserRole(id, role);
     if (result.success) {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
        setMessage({ type: "success", text: `User role updated to ${role}.` });
     } else {
        setMessage({ type: "error", text: result.error });
     }
     setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 max-w-4xl">
         <div className="relative flex-1 w-full text-zinc-900 dark:text-white">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-12 pr-6 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white shadow-sm"
            />
         </div>
         <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {["All", "ACTIVE", "INACTIVE", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all border ${statusFilter === status ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xl' : 'bg-white text-zinc-500 border-zinc-100 dark:bg-black dark:border-zinc-800 hover:border-emerald-500'}`}
              >
                 {status}
              </button>
            ))}
         </div>
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

      {/* Table - Mobile Responsive wrapper */}
      <div className="rounded-3xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black shadow-sm overflow-x-auto scrollbar-hide">
         <div className="relative min-w-[800px] lg:min-w-full">
            <table className="w-full text-left border-separate border-spacing-0">
               <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest first:rounded-tl-3xl">User Profile</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subscription</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Charity Impact</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Joined</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right last:rounded-tr-3xl">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredUsers.map((user, idx) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group"
                    >
                       <td className={`px-8 py-4 ${idx === filteredUsers.length - 1 ? 'rounded-bl-3xl' : ''}`}>
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 dark:bg-zinc-900">
                                {user.name?.[0] || 'U'}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                  {user.name}
                                  {user.role === 'ADMIN' && <ShieldCheck size={12} className="text-emerald-600" />}
                                </span>
                                <span className="text-[11px] text-zinc-400 font-medium">{user.email}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${user.subscription_status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : user.subscription_status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                             <CreditCard size={12} /> {user.subscription_status}
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{user.charity_name || 'None Selected'}</span>
                       </td>
                       <td className="px-8 py-4 text-xs text-zinc-400 font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                       </td>
                       <td className={`px-8 py-4 text-right last:pr-4 ${idx === filteredUsers.length - 1 ? 'rounded-br-3xl' : ''}`}>
                          <div className="flex items-center justify-end gap-2 pr-4 relative">
                             <button
                               onClick={() => setDeletingUser(user)}
                               className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                             >
                                <Trash2 size={16} />
                             </button>
                             
                             <div className="relative">
                                <button 
                                  onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                                  className={`p-2 rounded-lg transition-all ${activeMenuId === user.id ? 'bg-zinc-100 text-emerald-600 dark:bg-zinc-900' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                                >
                                   <MoreHorizontal size={18} />
                                </button>

                                <AnimatePresence>
                                   {activeMenuId === user.id && (
                                     <>
                                       <div 
                                         className="fixed inset-0 z-10" 
                                         onClick={() => setActiveMenuId(null)} 
                                       />
                                       <motion.div
                                         initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                         className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-100 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 z-20"
                                       >
                                          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Manage Role</div>
                                          <button 
                                            onClick={() => handleRoleUpdate(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all"
                                          >
                                             {user.role === 'ADMIN' ? <UserCog size={14} /> : <Crown size={14} className="text-amber-500" />}
                                             {user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                                          </button>

                                          <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
                                          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Override Status</div>
                                          
                                          <button 
                                            onClick={() => {
                                              updateUserStatus(user.id, 'ACTIVE');
                                              setUsers(users.map(u => u.id === user.id ? { ...u, subscription_status: 'ACTIVE' } : u));
                                              setActiveMenuId(null);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
                                          >
                                             <CheckCircle2 size={14} /> Force Active
                                          </button>
                                          
                                          <button 
                                            onClick={() => {
                                              updateUserStatus(user.id, 'INACTIVE');
                                              setUsers(users.map(u => u.id === user.id ? { ...u, subscription_status: 'INACTIVE' } : u));
                                              setActiveMenuId(null);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                                          >
                                             <AlertCircle size={14} /> Force Inactive
                                          </button>
                                       </motion.div>
                                     </>
                                   )}
                                </AnimatePresence>
                             </div>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Delete Golfer?"
        message={`Are you sure you want to permanently delete ${deletingUser?.name}? All their scores, history, and active subscriptions will be erased. This action CANNOT be undone.`}
        confirmText="Confirm Deletion"
        variant="danger"
      />
    </div>
  );
}
