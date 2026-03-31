import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Tags, 
  Wallet, 
  PieChart, 
  CalendarDays, 
  BadgePercent,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Accounts', path: '/accounts', icon: Wallet },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Loans', path: '/loans', icon: BadgePercent },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-72 bg-card-bg text-card-foreground border-r border-card-border h-screen py-8 shadow-sm transition-colors duration-300">
        <SidebarContent navItems={navItems} setIsOpen={setIsOpen} logout={logout} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-card-bg text-card-foreground shadow-2xl flex flex-col py-8 md:hidden transition-colors duration-300"
          >
            <div className="absolute top-4 right-4 focus:outline-none">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-background border border-card-border rounded-xl text-slate-500 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
            </div>
            <SidebarContent navItems={navItems} setIsOpen={setIsOpen} logout={logout} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ navItems, setIsOpen, logout }) => (
  <>
    <div className="px-6 mb-12">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/20">
          F
        </div>
        <span className="text-2xl font-black text-foreground tracking-tighter">
          FinTrack
        </span>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hidden-scrollbar">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => clsx(
            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-bold text-sm",
            isActive 
              ? "bg-emerald-500 dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-emerald-500/20 dark:shadow-white/5" 
              : "text-slate-400 hover:bg-background hover:text-foreground"
          )}
          onClick={() => setIsOpen(false)}
        >
          <item.icon size={20} className={clsx("transition-transform group-hover:scale-110")} />
          {item.name}
        </NavLink>
      ))}
    </nav>

    <div className="px-4 mt-8">
      <button
        onClick={logout}
        className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-black text-xs uppercase tracking-widest group"
      >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        Log Out
      </button>
    </div>
  </>
);

export default Sidebar;
