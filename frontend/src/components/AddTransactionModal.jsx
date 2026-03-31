import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Wallet, Tags, Calendar, AlignLeft, DollarSign, ChevronDown, Check, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const AddTransactionModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'Expense',
    custom_type_name: 'Custom',
    account_id: '',
    category_id: '',
    date: new Date().toISOString().slice(0, 16)
  });
  
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [accRes, catRes] = await Promise.all([
            api.get('/accounts/'),
            api.get('/categories/')
          ]);
          setAccounts(accRes.data);
          setCategories(catRes.data);
          
          if (initialData) {
            setFormData({
              title: initialData.title,
              amount: initialData.amount,
              type: initialData.type === 'Income' || initialData.type === 'Expense' ? initialData.type : 'Custom',
              custom_type_name: initialData.type,
              account_id: initialData.account_id,
              category_id: initialData.category_id,
              date: new Date(initialData.date).toISOString().slice(0, 16)
            });
          } else {
            if (accRes.data && accRes.data.length > 0) {
              setFormData(prev => ({ ...prev, account_id: accRes.data[0].id }));
            }
            if (catRes.data && catRes.data.length > 0) {
              const firstCategory = catRes.data.find(c => c.type === formData.type);
              if (firstCategory) {
                setFormData(prev => ({ ...prev, category_id: firstCategory.id }));
              } else {
                setFormData(prev => ({ ...prev, category_id: catRes.data[0].id }));
              }
            }
            setFormData(prev => ({
              ...prev,
              title: '',
              amount: '',
              date: new Date().toISOString().slice(0, 16)
            }));
          }
        } catch (err) {
          console.error("Failed to load form data", err);
        }
      };
      
      fetchData();
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.amount || !formData.account_id || !formData.category_id) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const finalType = formData.type === 'Custom' ? formData.custom_type_name : formData.type;
      const dataToSend = {
        ...formData,
        type: finalType,
        amount: parseFloat(formData.amount)
      };

      if (initialData) {
        await api.put(`/transactions/${initialData.id}`, dataToSend);
      } else {
        await api.post('/transactions/', dataToSend);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.type === formData.type || (formData.type === 'Custom' && c.type === 'Expense')
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-card-bg sm:glass-card rounded-t-3xl sm:rounded-3xl p-6 md:p-8 shadow-2xl border-t sm:border border-card-border z-[110]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-foreground tracking-tighter">{initialData ? 'Edit Entry' : 'Add Entry'}</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-background hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="flex p-1.5 bg-background rounded-2xl shadow-inner border border-card-border">
              {['Expense', 'Income', 'Custom'].map((type) => (
                <div key={type} className="flex-1 relative">
                  {type === 'Custom' && formData.type === 'Custom' ? (
                    <div className="flex items-center bg-card-bg shadow-md rounded-xl px-2 h-full">
                      <input 
                        autoFocus
                        className="w-full bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-blue-500 px-1"
                        value={formData.custom_type_name}
                        onChange={(e) => setFormData({...formData, custom_type_name: e.target.value})}
                        onBlur={() => setIsEditingCustom(false)}
                      />
                      <Edit3 size={12} className="text-blue-300" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, type, category_id: categories.find(c => c.type === (type === 'Custom' ? 'Expense' : type))?.id || ''});
                      }}
                      className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                        formData.type === type 
                          ? 'bg-card-bg shadow-md ' + (type === 'Expense' ? 'text-red-500' : type === 'Income' ? 'text-emerald-500' : 'text-blue-500')
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {type === 'Custom' ? formData.custom_type_name : type}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-slate-500">Transaction Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full pl-4 pr-4 py-4 text-2xl font-black rounded-2xl border border-card-border bg-background focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 text-foreground"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-slate-500">Log Entry Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full pl-4 pr-4 py-4 rounded-2xl border border-card-border bg-background font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-foreground"
                  placeholder="Where did it go?"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomField 
                label="Source Account" 
                icon={<Wallet size={18} />} 
                value={formData.account_id}
                options={accounts.map(a => ({ id: a.id, label: a.name }))}
                onChange={(id) => setFormData({...formData, account_id: id})}
              />
              <CustomField 
                label="Tag Category" 
                icon={<Tags size={18} />} 
                value={formData.category_id}
                options={filteredCategories.length > 0 ? filteredCategories.map(c => ({ id: c.id, label: c.name })) : [{id: '', label: 'No Categories'}]}
                onChange={(id) => setFormData({...formData, category_id: id})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-slate-500">Timestamp</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full pl-4 pr-4 py-4 rounded-2xl border border-card-border bg-background font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || accounts.length === 0}
              className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs bg-emerald-500 hover:bg-emerald-600 shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : initialData ? 'Update Entry' : 'Finalize Record'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CustomField = ({ label, icon, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, opensUp: false });
  const selectedLabel = options.find(o => o.id === value)?.label || "Select Option";

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const spaceBelow = window.innerHeight - rect.bottom;
      const opensUp = spaceBelow < 250;

      setDropdownPos({
        top: opensUp ? (rect.top + scrollY - 10) : (rect.bottom + scrollY + 4),
        left: rect.left,
        width: rect.width,
        opensUp
      });
    }
  }, [isOpen]);

  return (
    <div className="space-y-1.5 relative">
      <label className="text-[10px] font-black uppercase tracking-widest pl-1 text-slate-500">{label}</label>
      <div 
        ref={triggerRef}
        className="relative group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
        <div className="w-full pl-11 pr-10 py-4 rounded-2xl border border-card-border bg-background font-bold text-sm transition-all flex items-center justify-between text-foreground">
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[8000]" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: dropdownPos.opensUp ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              transform: dropdownPos.opensUp ? 'translateY(-100%)' : 'none'
            }}
            className="z-[9000] bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-y-auto max-h-64"
          >
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`px-4 py-3 text-sm font-bold flex items-center justify-between hover:bg-background/50 cursor-pointer ${value === opt.id ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.id);
                  setIsOpen(false);
                }}
              >
                {opt.label}
                {value === opt.id && <Check size={16} />}
              </div>
            ))}
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
};

export default AddTransactionModal;
