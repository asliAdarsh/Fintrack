import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden font-sans">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-10 sm:p-14 shadow-2xl backdrop-blur-3xl border border-white/20 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.1 }}
              initial={{ rotate: -10 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 dark:bg-white shadow-2xl mb-6 relative group"
            >
              <Activity className="text-white dark:text-slate-900 group-hover:scale-110 transition-transform" size={40} />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={20} className="text-emerald-500 animate-pulse" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-black text-foreground mb-3 tracking-tighter">Sign In to FinTrack</h1>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest">Premium Financial Sync</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 text-xs font-black uppercase tracking-widest text-red-500 bg-red-100 dark:bg-red-500/10 rounded-2xl text-center border border-red-200 dark:border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-500">Corporate Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="name@fintrack.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Pin</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <input type="checkbox" id="rem" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-500 bg-transparent focus:ring-emerald-500/50 transition-all cursor-pointer" />
              <label htmlFor="rem" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer select-none">Remember this station</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4.5 px-6 rounded-2xl text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-xs bg-slate-900 dark:bg-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Access Vault'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            Secure Member Area. <Link to="/signup" className="text-emerald-500 hover:text-emerald-400 transition-colors">Apply for Account</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
