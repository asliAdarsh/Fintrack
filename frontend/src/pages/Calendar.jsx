import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';

const Calendar = () => {
  const { formatCurrency } = useCurrency();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions/');
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getTransactionsForDay = (day) => {
    if (!day) return [];
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getDate() === day && 
             d.getMonth() === currentDate.getMonth() && 
             d.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 px-2 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tighter">Event Horizon</h1>
          <p className="text-slate-500 text-sm">Visualize your cash flow patterns across the lunar cycle.</p>
        </div>
        <div className="flex items-center gap-4 glass-card p-2 rounded-2xl shadow-sm self-stretch md:self-auto justify-between border border-card-border overflow-hidden">
          <button 
            onClick={prevMonth} 
            className="p-2 hover:bg-background/50 rounded-xl transition-colors text-slate-500"
          >
            <ChevronLeft size={20}/>
          </button>
          <span className="font-black text-foreground px-4 min-w-[140px] text-center uppercase tracking-widest text-xs">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={nextMonth} 
            className="p-2 hover:bg-background/50 rounded-xl transition-colors text-slate-500"
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative border border-card-border">
        <div className="grid grid-cols-7 bg-background/50 border-b border-card-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-l border-card-border">
          {days.map((day, idx) => {
            const dayTransactions = getTransactionsForDay(day);
            const dailyIncome = dayTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
            const dailyExpense = dayTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);

            return (
              <div 
                key={idx} 
                className={`min-h-[100px] sm:min-h-[140px] p-2 border-b border-r border-card-border transition-all duration-300 ${
                  day ? 'bg-card-bg/20 hover:bg-background/40 group' : 'bg-background/10'
                }`}
              >
                {day && (
                  <>
                    <span className="text-xs font-black text-slate-300 dark:text-slate-600 mb-2 block group-hover:text-slate-400 transition-colors">{day}</span>
                    <div className="space-y-1.5 mt-2">
                      {dailyIncome > 0 && (
                        <div className="flex items-center gap-1 text-[8px] sm:text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg font-black uppercase tracking-tighter shadow-sm">
                          <ArrowUpRight size={10} />
                          {formatCurrency(dailyIncome)}
                        </div>
                      )}
                      {dailyExpense > 0 && (
                        <div className="flex items-center gap-1 text-[8px] sm:text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 p-1.5 rounded-lg font-black uppercase tracking-tighter shadow-sm">
                          <ArrowDownRight size={10} />
                          {formatCurrency(dailyExpense)}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
