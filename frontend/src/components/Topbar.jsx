import { Menu, Search, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Topbar = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full flex items-center justify-between py-4 px-6 glass-card rounded-2xl shadow-md border-none">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl bg-background border border-card-border text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-background border border-card-border text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-90"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="h-8 w-px bg-card-border mx-1"></div>

        <Link to="/profile" className="flex items-center gap-3 cursor-pointer pl-1 rounded-full hover:bg-background/50 p-1 transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none mb-1 group-hover:text-emerald-500 transition-colors">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 leading-none">Premium</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shadow-sm group-hover:scale-105 transition-transform">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
