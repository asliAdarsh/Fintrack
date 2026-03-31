import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-500">
      <div className="glass-card p-12 rounded-3xl flex flex-col items-center text-center max-w-lg border border-white/20 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
        
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Construction size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          We're working hard to bring you this feature. The {title.toLowerCase()} module is currently under construction and will be available in the next update.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
