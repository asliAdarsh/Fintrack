import { useState } from 'react';
import { User, Shield, Moon, Sun, Smartphone, LogOut, ChevronRight, Download, Upload, Coins } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, currencyMap } = useCurrency();
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await api.get('/transactions/');
      const transactions = response.data;
      
      if (transactions.length === 0) {
        alert("No transactions to export.");
        return;
      }

      const headers = ["ID", "Title", "Amount", "Type", "Category ID", "Account ID", "Date"];
      const rows = transactions.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        t.type,
        t.category_id,
        t.account_id,
        t.date
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export transactions.");
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    document.getElementById('csv-import-input').click();
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Importing ${file.name}... (Data parsing in progress)`);
    }
  };

  const sections = [
    {
      title: 'Global Settings',
      items: [
        { 
          id: 'appearance', 
          icon: theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />, 
          label: 'Appearance', 
          desc: `Current mode: ${theme === 'dark' ? 'Dark' : 'Light'}`,
          action: toggleTheme,
          control: <div className="w-12 h-6 bg-background rounded-full relative p-1 cursor-pointer border border-card-border" onClick={toggleTheme}>
            <div className={`w-4 h-4 bg-emerald-500 rounded-full shadow-sm transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        },
        {
          id: 'currency',
          icon: <Coins size={20} />,
          label: 'Local Currency',
          desc: `Active: ${currencyMap[currency]?.code} (${currencyMap[currency]?.symbol})`,
          control: (
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-background border border-card-border rounded-xl px-3 py-1.5 text-xs font-bold outline-none text-foreground"
            >
              {Object.keys(currencyMap).map(key => (
                <option key={key} value={key}>{currencyMap[key].code}</option>
              ))}
            </select>
          )
        }
      ]
    },
    {
      title: 'Data Management',
      items: [
        { 
          icon: <Download size={20} />, 
          label: 'Export Data', 
          desc: 'Download your transactions as CSV', 
          action: handleExportCSV,
          control: exporting ? <div className="text-xs font-bold text-emerald-500 animate-pulse">Exporting...</div> : <ChevronRight size={18} className="text-slate-400" />
        },
        { 
          icon: <Upload size={20} />, 
          label: 'Import Data', 
          desc: 'Upload transactions from CSV file', 
          action: handleImportClick,
          control: <ChevronRight size={18} className="text-slate-400" />
        }
      ]
    },
    {
      title: 'Account Management',
      items: [
        { icon: <User size={20} />, label: 'Profile Information', desc: 'Name, email, and avatar', link: true },
        { icon: <Shield size={20} />, label: 'Security', desc: 'Password and two-factor', link: true },
        { icon: <Smartphone size={20} />, label: 'Connected Devices', desc: 'Manage active sessions', link: true }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-card-bg">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1">{user?.username}</h1>
          <p className="text-slate-500">{user?.email}</p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-tighter">
            PRO LICENSE
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">{section.title}</h3>
            <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  onClick={item.action}
                  className={`flex items-center justify-between p-5 hover:bg-background/50 transition-colors cursor-pointer ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-card-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background border border-card-border flex items-center justify-center text-slate-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  {item.control ? item.control : item.link ? <ChevronRight size={18} className="text-slate-400" /> : null}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-8">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl border-2 border-red-500/10 text-red-500 font-black text-lg hover:bg-red-500/10 transition-all group shadow-xl shadow-red-500/5"
          >
            <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
            Logout from FinTrack
          </button>
        </div>
      </div>
      <input 
        type="file" 
        id="csv-import-input" 
        className="hidden" 
        accept=".csv" 
        onChange={handleFileImport}
      />
    </div>
  );
};

export default Settings;
