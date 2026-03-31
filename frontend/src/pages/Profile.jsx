import { useState, useEffect } from 'react';
import { User, Mail, Shield, Smartphone, Activity, Wallet, Tags, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState({
    accountsCount: 0,
    categoriesCount: 0,
    transactionsCount: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }

    const fetchProfileStats = async () => {
      try {
        const [accRes, catRes, transRes] = await Promise.all([
          api.get('/accounts/'),
          api.get('/categories/'),
          api.get('/transactions/')
        ]);
        setStats({
          accountsCount: accRes.data.length,
          categoriesCount: catRes.data.length,
          transactionsCount: transRes.data.length
        });
      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      }
    };
    fetchProfileStats();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await api.put('/auth/profile', { name: formData.name });
      
      const updatedUser = { ...user, name: res.data.name };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-2 sm:px-0">
      <div className="flex flex-col items-center gap-6 mb-12 text-center mt-6 md:mt-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-2xl border-4 border-white dark:border-slate-800 relative group overflow-hidden">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] uppercase tracking-widest font-bold">
            Edit
          </div>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-1 tracking-tight">{user?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">FinTrack Premium Member</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-center font-bold text-sm border animate-in slide-in-from-top-2 ${
          message.type === 'success' 
            ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20' 
            : 'bg-red-100 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-card p-4 md:p-6 rounded-3xl text-center border border-white/20 dark:border-slate-800 shadow-xl">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
            <Wallet size={20} />
          </div>
          <p className="text-2xl md:text-3xl font-black text-foreground">{stats.accountsCount}</p>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active Accounts</p>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-3xl text-center border border-white/20 dark:border-slate-800 shadow-xl">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Activity size={20} />
          </div>
          <p className="text-2xl md:text-3xl font-black text-foreground">{stats.transactionsCount}</p>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Logs</p>
        </div>
        <div className="glass-card p-4 md:p-6 rounded-3xl text-center border border-white/20 dark:border-slate-800 shadow-xl">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
            <Tags size={20} />
          </div>
          <p className="text-2xl md:text-3xl font-black text-foreground">{stats.categoriesCount}</p>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Categories</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/20 dark:border-slate-800 shadow-xl">
        <div className="p-5 md:p-8 border-b border-white/10 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-black text-foreground">User Information</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] md:text-xs font-bold transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 md:p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={14} />
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="p-1.5 md:p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Display Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-emerald-500/30 outline-none focus:ring-2 focus:ring-emerald-500/20 text-foreground font-bold text-sm md:text-base"
                    placeholder="Enter name"
                    autoFocus
                  />
                ) : (
                  <div className="flex justify-between items-center bg-white/5 dark:bg-slate-900 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/10 dark:border-slate-800 overflow-hidden">
                    <span className="font-bold text-foreground text-sm md:text-base truncate">{user?.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/5 dark:border-slate-800 opacity-60 overflow-hidden">
                  <span className="font-bold text-foreground text-sm md:text-base truncate">{user?.email}</span>
                </div>
                {isEditing && <p className="text-[9px] md:text-[10px] text-slate-400 mt-1 pl-1 italic">Email cannot be changed directly.</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                <Shield size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</p>
                <div className="flex justify-between items-center bg-white/5 dark:bg-slate-900 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/10 dark:border-slate-800">
                  <span className="font-bold text-foreground text-sm md:text-base">••••••••</span>
                  <button type="button" className="text-[10px] md:text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">Change</button>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
