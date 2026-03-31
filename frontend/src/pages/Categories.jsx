import { useState, useEffect } from 'react';
import { Plus, Tag, Pencil, Trash2, PieChart, X } from 'lucide-react';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Expense', color_code: '#3b82f6', icon: 'Tag' });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        type: category.type, 
        color_code: category.color_code, 
        icon: category.icon 
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', type: 'Expense', color_code: '#3b82f6', icon: 'Tag' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories/', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category', error);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure? This will affect existing transactions in this category.")) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting category", error);
      }
    }
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', 
    '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-slate-500 text-sm">Organize your spending with custom labels and colors.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 font-bold"
        >
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 uppercase tracking-widest font-black text-xs opacity-50">Fetching your categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
             <PieChart size={48} className="text-slate-300 mb-4" />
             <h3 className="text-xl font-bold mb-2">No Categories Found</h3>
             <button onClick={() => handleOpenModal()} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold">Create First</button>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="glass-card p-5 rounded-3xl relative overflow-hidden group shadow-xl flex flex-col justify-between h-32 md:h-36">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: cat.color_code }} />
              
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: cat.color_code }}>
                  <Tag size={20} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 hover:bg-background/50 rounded-lg text-slate-400 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-foreground truncate">{cat.name}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${cat.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>{cat.type}</p>
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
              <h2 className="text-2xl font-black text-foreground">{editingCategory ? 'Edit Identity' : 'New Category'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:bg-background/50 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-1.5 block text-slate-500">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl border border-card-border bg-background font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-foreground"
                  placeholder="Grocery, Rent, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Expense'})}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${formData.type === 'Expense' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-sm' : 'border-card-border text-slate-400'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Income'})}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${formData.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm' : 'border-card-border text-slate-400'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest mb-3 block text-slate-500 text-center">Identity Color</label>
                <div className="flex flex-wrap justify-center gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({...formData, color_code: c})}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${formData.color_code === c ? 'border-card-bg scale-125 shadow-lg' : 'border-transparent opacity-60'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="submit" 
                  className="w-full py-4.5 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {editingCategory ? 'Update Identity' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
