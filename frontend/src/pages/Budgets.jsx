import { useState, useEffect } from 'react';
import { Plus, Target, PiggyBank, Pencil, Trash2, X, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Budgets = () => {
  const { formatCurrency } = useCurrency();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ amount: 0, period: 'Monthly' });

  const fetchBudgets = async () => {
    try {
      const bRes = await api.get('/budgets/');
      setBudgets(bRes.data);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({ amount: budget.amount, period: budget.period || 'Monthly' });
    } else {
      setEditingBudget(null);
      setFormData({ amount: 0, period: 'Monthly' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget.id}`, formData);
      } else {
        await api.post('/budgets/', formData);
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget', error);
    }
  };

  const deleteBudget = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/budgets/${id}`);
        setBudgets(budgets.filter(b => b.id !== id));
      } catch (error) {
        console.error("Error deleting budget", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tighter">Financial Ceilings</h1>
          <p className="text-slate-500 text-sm">Define your limits and track your utilization in real-time.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold"
        >
          <Plus size={18} />
          <span>Set New Ceiling</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 uppercase tracking-widest font-black text-xs opacity-50 text-[10px] uppercase">Syncing goals...</div>
        ) : budgets.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
            <Target size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No Limits Set</h3>
            <button onClick={() => handleOpenModal()} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20">Establish First Budget</button>
          </div>
        ) : (
          budgets.map((budget) => {
            const percent = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const remaining = Math.max(0, budget.amount - budget.spent);
            
            return (
              <div key={budget.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group shadow-xl transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${percent > 90 ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                      <Target size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground text-lg leading-tight uppercase tracking-widest">{budget.period}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Ceiling</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(budget)} 
                      className="p-2 hover:bg-background/50 rounded-xl text-slate-400 transition-colors"
                    >
                      <Pencil size={18}/>
                    </button>
                    <button 
                      onClick={() => deleteBudget(budget.id)} 
                      className="p-2 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Used</p>
                      <p className={`font-black text-xl tabular-nums leading-none ${percent > 90 ? 'text-red-500' : 'text-foreground'}`}>{formatCurrency(budget.spent)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Remaining</p>
                      <p className="font-black text-xl text-slate-400 leading-none tabular-nums tracking-tighter">{formatCurrency(remaining)}</p>
                    </div>
                  </div>

                  <div className="w-full bg-background/50 border border-card-border rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${percent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, percent || 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{Math.round(percent)}% Recorded</span>
                    <span>Goal: {formatCurrency(budget.amount)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-card-bg sm:glass-card rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 border-t sm:border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-foreground">{editingBudget ? 'Update Goal' : 'Define Goal'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:bg-background/50 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Budget Ceiling</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground text-xl"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Recurrence Period</label>
                <div className="relative group">
                    <select 
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground appearance-none shadow-sm"
                    >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all outline-none">
                {editingBudget ? 'Update Goal' : 'Establish Ceiling'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
