import { useState, useEffect } from 'react';
import { Plus, Wallet, CreditCard, Landmark, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Accounts = () => {
  const { formatCurrency } = useCurrency();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Checking', initial_balance: 0 });

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts/');
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({ name: account.name, type: account.type, initial_balance: account.initial_balance });
    } else {
      setEditingAccount(null);
      setFormData({ name: '', type: 'Checking', initial_balance: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.id}`, formData);
      } else {
        await api.post('/accounts/', formData);
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account', error);
    }
  };

  const deleteAccount = async (id) => {
    if (window.confirm("Are you sure? This will affect associated transactions.")) {
      try {
        await api.delete(`/accounts/${id}`);
        setAccounts(accounts.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tighter">Liquid Vaults</h1>
          <p className="text-slate-500 text-sm">Manage your account balances and digital assets.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold"
        >
          <Plus size={18} />
          <span>New account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 uppercase tracking-widest font-black text-xs opacity-50">Synchronizing vaults...</div>
        ) : accounts.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
             <Wallet size={48} className="text-slate-200 mb-4" />
             <h3 className="text-xl font-bold mb-2 text-foreground">No accounts detected</h3>
             <button onClick={() => handleOpenModal()} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20">Establish first vault</button>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all h-full flex flex-col justify-between">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  acc.type === 'Checking' ? 'bg-blue-500/10 text-blue-500' :
                  acc.type === 'Credit' ? 'bg-red-500/10 text-red-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {acc.type === 'Checking' ? <Landmark size={24} /> :
                   acc.type === 'Credit' ? <CreditCard size={24} /> :
                   <Wallet size={24} />}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(acc)}
                    className="p-2.5 hover:bg-background/50 rounded-xl text-slate-400 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => deleteAccount(acc.id)}
                    className="p-2.5 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-1 text-foreground">{acc.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{acc.type} system</p>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available balance</span>
                  <span className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(acc.current_balance)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-card-bg sm:glass-card rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 border-t sm:border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-foreground">{editingAccount ? 'Sync account details' : 'Establish new vault'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-background/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Official name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground"
                  placeholder="HDFC Savings, Pocket Wallet, etc."
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Vault category</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground appearance-none"
                  required
                >
                  <option value="Checking">Checking / Savings</option>
                  <option value="Savings">Investment Account</option>
                  <option value="Credit">Credit Card</option>
                  <option value="Wallet">Digital Wallet / Cash</option>
                  <option value="Other">Other Assets</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Opening balance</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.initial_balance}
                    onChange={(e) => setFormData({...formData, initial_balance: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground text-xl"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all outline-none"
              >
                {editingAccount ? 'Update settings' : 'Finalize vault'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
