import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, Wallet, Calendar as CalendarIcon, Download } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const AnalyticsDetail = () => {
  const { formatCurrency } = useCurrency();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [sumRes, flowRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/cashflow')
        ]);
        setSummary(sumRes.data);
        setData(flowRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 px-2 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1 tracking-tight">Advanced Analytics</h1>
          <p className="text-slate-500">Deep dive into your financial flows and behavior patterns.</p>
        </div>
        <div className="flex gap-3 self-stretch md:self-auto">
          <button className="flex-1 md:flex-none p-3 bg-card-bg border border-card-border rounded-xl text-slate-500 hover:text-foreground transition-colors flex justify-center shadow-lg">
            <CalendarIcon size={20} />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-emerald-500/20 active:scale-95 transition-all outline-none">
            <Download size={18} />
            <span>Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <TrendingUp className="text-emerald-500 mb-4" size={32} />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Earnings</h3>
          <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(summary.total_income)}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <TrendingDown className="text-red-500 mb-4" size={32} />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Burn</h3>
          <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(summary.total_expense)}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <Target className="text-blue-500 mb-4" size={32} />
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Net Flow</h3>
          <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{formatCurrency(summary.total_income - summary.total_expense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl shadow-xl min-h-[400px] sm:h-[500px] flex flex-col items-stretch relative overflow-hidden">
          <h3 className="text-xl font-black text-foreground mb-8 tracking-tighter">Flow Distribution</h3>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: 'rgba(16, 185, 129, 0.05)'}}
                  contentStyle={{ borderRadius: '24px', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: 12, color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: 20, textTransform: 'uppercase', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em'}} />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-xl min-h-[400px] sm:h-[500px] flex flex-col items-stretch relative overflow-hidden">
          <h3 className="text-xl font-black text-foreground mb-8 tracking-tighter">Financial Momentum</h3>
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: 12, color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: 20, textTransform: 'uppercase', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em'}} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: 'var(--background)'}} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: 'var(--background)'}} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetail;
