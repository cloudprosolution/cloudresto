import { useState } from 'react';
import { useApp, formatCurrency } from '../store';
import { Package, AlertTriangle, TrendingDown, Search, ArrowUpCircle, ArrowDownCircle, RefreshCw, Trash2 } from 'lucide-react';

export default function Inventory() {
  const { ingredients } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showMovement, setShowMovement] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment' | 'waste'>('in');

  const categories = ['Semua', ...Array.from(new Set(ingredients.map(i => i.category)))];
  
  const filtered = ingredients.filter(i => {
    const matchCat = activeCategory === 'Semua' || i.category === activeCategory;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStockCount = ingredients.filter(i => i.stock <= i.minStock).length;
  const totalValue = ingredients.reduce((sum, i) => sum + (i.stock * i.costPerUnit), 0);

  const getStockStatus = (item: typeof ingredients[0]) => {
    const ratio = item.stock / item.minStock;
    if (ratio <= 0.5) return { label: 'Kritis', color: 'bg-red-100 text-red-700', barColor: 'bg-red-500' };
    if (ratio <= 1) return { label: 'Rendah', color: 'bg-amber-100 text-amber-700', barColor: 'bg-amber-500' };
    if (ratio <= 1.5) return { label: 'Cukup', color: 'bg-blue-100 text-blue-700', barColor: 'bg-blue-500' };
    return { label: 'Aman', color: 'bg-green-100 text-green-700', barColor: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Item</p>
              <p className="text-xl font-bold text-slate-800">{ingredients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowUpCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Nilai Persediaan</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Stok Rendah</p>
              <p className="text-xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Stok Habis</p>
              <p className="text-xl font-bold text-red-600">{ingredients.filter(i => i.stock === 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setMovementType('in'); setShowMovement(true); }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
          <ArrowUpCircle size={16} /> Penerimaan
        </button>
        <button onClick={() => { setMovementType('out'); setShowMovement(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
          <ArrowDownCircle size={16} /> Pengeluaran
        </button>
        <button onClick={() => { setMovementType('adjustment'); setShowMovement(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <RefreshCw size={16} /> Penyesuaian
        </button>
        <button onClick={() => { setMovementType('waste'); setShowMovement(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
          <Trash2 size={16} /> Waste
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari bahan baku..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nama Bahan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stok</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Min. Stok</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Harga/unit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nilai</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const status = getStockStatus(item);
                const stockPercent = Math.min(100, (item.stock / (item.minStock * 3)) * 100);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{item.code}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.unit}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-bold text-slate-800">{item.stock} {item.unit}</p>
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 ml-auto">
                        <div className={`h-full rounded-full ${status.barColor}`} style={{ width: `${stockPercent}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">{item.minStock} {item.unit}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700">{formatCurrency(item.costPerUnit)}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">{formatCurrency(item.stock * item.costPerUnit)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {showMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {movementType === 'in' ? 'Penerimaan Bahan' : movementType === 'out' ? 'Pengeluaran Bahan' : movementType === 'adjustment' ? 'Penyesuaian Stok' : 'Pencatatan Waste'}
              </h3>
              <button onClick={() => setShowMovement(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Bahan Baku</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih bahan baku</option>
                  {ingredients.map(i => (
                    <option key={i.id} value={i.id}>{i.code} - {i.name} (Stok: {i.stock} {i.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Jumlah</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Referensi</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="No. PO / No. Dokumen" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Catatan</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Catatan tambahan" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowMovement(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                <button onClick={() => setShowMovement(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
