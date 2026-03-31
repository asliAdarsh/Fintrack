import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Activity, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden font-sans">
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 80, 0],
          y: [0, 100, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-14 shadow-2xl backdrop-blur-3xl border border-white/20 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              initial={{ rotate: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 dark:bg-white shadow-2xl mb-6 relative group"
            >
              <Activity className="text-white dark:text-slate-900 group-hover:scale-110 transition-transform" size={40} />
              <div className="absolute -top-1 -right-1">
                 <div className="bg-emerald-500 rounded-full p-1 shadow-lg">
                    <Check size={14} className="text-white" />
                 </div>
              </div>
            </motion.div>
            <h1 className="text-4xl font-black text-foreground mb-3 tracking-tighter">Join the FinTrack Elite</h1>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest px-4 leading-relaxed">Start your premium financial journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 text-xs font-black uppercase tracking-widest text-red-500 bg-red-100 dark:bg-red-500/10 rounded-2xl text-center border border-red-200 dark:border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-500">Legal Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-500">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="name@fintrack.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-500">Secure Pin Code</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="Minimum 8 characters"
                  required
                  minLength="8"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <input type="checkbox" id="terms" required className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-500 bg-transparent focus:ring-emerald-500/50 transition-all cursor-pointer" />
              <label htmlFor="terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer select-none leading-relaxed">I agree to the <span className="text-emerald-500">Membership Terms</span> and secure data protocols.</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-xs bg-slate-900 dark:bg-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Onboarding...' : 'Request Access'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            Already verified? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">Sign In Here</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
