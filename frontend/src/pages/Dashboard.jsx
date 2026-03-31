import { useState, useEffect } from 'react';
import { Plus, Wallet, ArrowUpRight, ArrowDownRight, MoreHorizontal, Target, TrendingUp, TrendingDown, Pencil, BarChart3, LineChart as MomentumIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import AddTransactionModal from '../components/AddTransactionModal';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { formatCurrency } = useCurrency();
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const [accRes, budRes, txRes, sumRes, flowRes] = await Promise.all([
        api.get('/accounts/'),
        api.get('/budgets/'),
        api.get('/transactions/'),
        api.get('/analytics/summary'),
        api.get('/analytics/cashflow')
      ]);
      setAccounts(accRes.data);
      setBudgets(budRes.data);
      setTransactions(txRes.data.slice(0, 5));
      setSummary(sumRes.data);
      setChartData(flowRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 w-full px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter">Finance Command</h1>
          <p className="text-slate-500 text-sm">Real-time pulse of your financial ecosystem.</p>
        </div>
        <button 
          onClick={() => {setEditingTransaction(null); setIsModalOpen(true);}}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 flex items-center justify-center gap-2 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold"
        >
          <Plus size={20} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Vault Balances</h2>
            <Link to="/accounts" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
            {accounts.length === 0 ? (
              <div className="flex-shrink-0 w-64 h-32 rounded-3xl border-2 border-dashed border-card-border flex items-center justify-center text-slate-400 font-bold text-sm">Add Account</div>
            ) : accounts.map((acc) => (
              <div key={acc.id} className="flex-shrink-0 w-64 h-32 rounded-3xl glass-card p-5 group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Wallet size={18} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{acc.type}</div>
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1 truncate">{acc.name}</h4>
                <p className="text-2xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(acc.current_balance)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Budget Health</h2>
              <Link to="/budgets" className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600">Set Goal</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          {budgets.length === 0 ? (
            <div className="flex-shrink-0 w-64 h-32 rounded-3xl border-2 border-dashed border-card-border flex items-center justify-center text-slate-400 font-bold text-sm">Define First Goal</div>
          ) : budgets.map((bud) => {
            const utilization = bud.amount > 0 ? (bud.spent / bud.amount) * 100 : 0;
            return (
              <div key={bud.id} className="flex-shrink-0 w-64 h-32 rounded-3xl glass-card p-5 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${utilization > 90 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Target size={18} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{bud.period}</div>
                </div>
                <h4 className="text-xs font-black text-slate-400 mb-1 uppercase tracking-widest leading-none truncate">Ceiling {formatCurrency(bud.amount)}</h4>
                <div className="w-full bg-background/50 rounded-full h-2 mb-2 overflow-hidden shadow-inner border border-card-border">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${utilization > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, utilization)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                  <p className="text-slate-500">{Math.round(utilization)}% Logged</p>
                  <p className="text-foreground">{formatCurrency(bud.spent)}</p>
                </div>
              </div>
            );
          })}
        </div>
        </section>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Earnings</h3>
            </div>
            <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(summary.total_income)}</p>
          </div>
          
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg">
                <TrendingDown size={20} />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Burn</h3>
            </div>
            <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(summary.total_expense)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-3xl min-h-[300px] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-emerald-500" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Weekly Distribution</h3>
                    </div>
                    <Link to="/analytics" className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Go to Charts</Link>
                </div>
                <div className="flex-1 mt-auto">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 8}} />
                            <Tooltip 
                                cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                                contentStyle={{ borderRadius: '16px', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900, color: 'var(--foreground)' }}
                            />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl min-h-[300px] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <MomentumIcon size={16} className="text-blue-500" />
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Momentum</h3>
                    </div>
                </div>
                <div className="flex-1 mt-auto">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 8}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900, color: 'var(--foreground)' }}
                            />
                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{r: 3, fill: 'var(--background)'}} />
                            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{r: 3, fill: 'var(--background)'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <section className="glass-card rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-card-border flex justify-between items-center">
            <h2 className="text-xl font-black text-foreground tracking-tighter">Activity Feed</h2>
            <Link to="/transactions" className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600">Full History</Link>
          </div>
          <div className="divide-y divide-card-border">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found.</div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-background/40 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'Income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-none mb-1">{tx.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-lg font-black tabular-nums tracking-tighter ${tx.type === 'Income' ? 'text-emerald-500' : 'text-foreground'}`}>
                      {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <button 
                      onClick={() => handleEditTransaction(tx)}
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;
