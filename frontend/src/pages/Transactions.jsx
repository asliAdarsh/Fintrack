import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Trash2, Calendar as CalIcon, Tag, Wallet, Pencil } from 'lucide-react';
import api from '../services/api';
import AddTransactionModal from '../components/AddTransactionModal';
import { useCurrency } from '../context/CurrencyContext';

const Transactions = () => {
  const { formatCurrency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions/');
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const deleteTransaction = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entry Log</h1>
          <p className="text-slate-500 text-sm">Review and manage your detailed transaction history.</p>
        </div>
        <button 
          onClick={() => {setEditingTransaction(null); setIsModalOpen(true);}}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-card-border flex flex-col sm:flex-row justify-between gap-4 bg-card-bg/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Ledger Entries</h2>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm border border-card-border rounded-xl bg-background/50 text-slate-500 font-bold hover:bg-background transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse text-slate-400">
               <CalIcon size={48} className="mb-4 opacity-20" />
               <p className="font-black tracking-widest text-[10px] uppercase">Syncing history...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <Search size={48} className="text-slate-200 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">No Entries Found</h3>
              <button onClick={() => setIsModalOpen(true)} className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Add First Entry</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="text-[10px] uppercase bg-background/50 text-slate-400 tracking-widest border-b border-card-border">
                  <tr>
                    <th className="px-6 py-4 font-black">Details</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black text-right">Amount</th>
                    <th className="px-6 py-4 font-black text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-background/40 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <span className="font-bold text-base text-foreground block leading-none mb-1">{tx.title}</span>
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1">
                              <Tag size={10} /> Cat #{tx.category_id} • <Wallet size={10} /> Acc #{tx.account_id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-5 text-right font-black text-lg ${tx.type === 'Income' ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleEditTransaction(tx)} 
                            className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(tx.id)} 
                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setEditingTransaction(null);}} 
        onSuccess={fetchTransactions} 
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
