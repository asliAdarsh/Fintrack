import { useState, useEffect } from 'react';
import { Plus, Landmark, PiggyBank, ArrowDownLeft, ArrowUpRight, Calendar as CalIcon, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Loans = () => {
  const { formatCurrency } = useCurrency();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans/');
      setLoans(response.data);
    } catch (error) {
      console.error('Failed to fetch loans', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tighter">Debt & Credit</h1>
          <p className="text-slate-500 text-sm">Monitor your liabilities and personal lendings.</p>
        </div>
        <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold">
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 uppercase tracking-widest font-black text-xs opacity-50">Syncing ledgers...</div>
        ) : loans.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
            <CalIcon size={48} className="text-slate-200 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Debts Logged</h3>
            <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20">Add First</button>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="glass-card p-6 rounded-3xl shadow-xl relative overflow-hidden group">
               <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${loan.type === 'Owed' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {loan.type === 'Owed' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                 </div>
                 <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">{loan.type}</div>
               </div>
               <h3 className="text-xl font-black text-foreground mb-1">{loan.title}</h3>
               <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter mb-4">{formatCurrency(loan.amount)}</p>
               <div className="flex justify-between items-center pt-4 border-t border-card-border">
                  <span className="text-xs font-bold text-slate-400">Due {new Date(loan.due_date).toLocaleDateString()}</span>
                  <button className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all transition-colors"><Trash2 size={18} /></button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Loans;
