import { useState } from 'react';
import { useApp, formatCurrency } from '../store';
import { Plus, Edit, Search, Filter, Eye, EyeOff, ChefHat, DollarSign, Percent } from 'lucide-react';

export default function MenuPage() {
  const { menuItems } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const categories = ['Semua', ...Array.from(new Set(menuItems.map(m => m.category)))];
  
  const filtered = menuItems.filter(m => {
    const matchCat = activeCategory === 'Semua' || m.category === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectedItem = menuItems.find(m => m.id === showDetail);

  // Recipe simulation
  const recipeData: Record<string, { ingredient: string; qty: number; unit: string; cost: number }[]> = {
    m1: [
      { ingredient: 'Nasi Matang', qty: 200, unit: 'gram', cost: 2800 },
      { ingredient: 'Telur Ayam', qty: 1, unit: 'butir', cost: 2500 },
      { ingredient: 'Daging Ayam', qty: 50, unit: 'gram', cost: 1750 },
      { ingredient: 'Bumbu Dasar', qty: 1, unit: 'porsi', cost: 1250 },
      { ingredient: 'Minyak Goreng', qty: 30, unit: 'ml', cost: 1080 },
      { ingredient: 'Pelengkap', qty: 1, unit: 'porsi', cost: 1120 },
    ],
    m2: [
      { ingredient: 'Mie', qty: 150, unit: 'gram', cost: 3000 },
      { ingredient: 'Udang', qty: 50, unit: 'gram', cost: 3500 },
      { ingredient: 'Cumi', qty: 50, unit: 'gram', cost: 2500 },
      { ingredient: 'Bumbu', qty: 1, unit: 'porsi', cost: 1500 },
      { ingredient: 'Minyak Goreng', qty: 30, unit: 'ml', cost: 1080 },
      { ingredient: 'Sayuran', qty: 1, unit: 'porsi', cost: 420 },
    ],
    m3: [
      { ingredient: 'Ayam Potong', qty: 200, unit: 'gram', cost: 7000 },
      { ingredient: 'Madu', qty: 30, unit: 'ml', cost: 2500 },
      { ingredient: 'Bumbu Marinasi', qty: 1, unit: 'porsi', cost: 2000 },
      { ingredient: 'Nasi Putih', qty: 200, unit: 'gram', cost: 2800 },
      { ingredient: 'Lalapan', qty: 1, unit: 'porsi', cost: 700 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md"
        >
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari menu berdasarkan nama..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Menu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Harga Jual</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">HPP</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Margin</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Food Cost</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stasiun</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const margin = item.price - item.cost;
                const marginPercent = ((margin / item.price) * 100).toFixed(1);
                const foodCost = ((item.cost / item.price) * 100).toFixed(1);
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg">
                          {item.category === 'Minuman' ? '🥤' : item.category === 'Dessert' ? '🍰' : '🍽️'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.prepTime} menit</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-right text-sm text-red-600">{formatCurrency(item.cost)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(margin)}</span>
                      <span className="text-xs text-slate-500 ml-1">({marginPercent}%)</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        parseFloat(foodCost) <= 30 ? 'bg-green-100 text-green-700' :
                        parseFloat(foodCost) <= 40 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{foodCost}%</span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600">{item.station}</td>
                    <td className="px-4 py-3 text-center">
                      {item.available ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Eye size={10} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <EyeOff size={10} /> Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setShowDetail(item.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <ChefHat size={16} />
                        </button>
                        <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedItem.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedItem.description}</p>
                </div>
                <button onClick={() => setShowDetail(null)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <DollarSign size={16} className="mx-auto text-blue-600" />
                  <p className="text-lg font-bold text-blue-700 mt-1">{formatCurrency(selectedItem.price)}</p>
                  <p className="text-xs text-blue-600">Harga Jual</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <Percent size={16} className="mx-auto text-red-600" />
                  <p className="text-lg font-bold text-red-700 mt-1">{formatCurrency(selectedItem.cost)}</p>
                  <p className="text-xs text-red-600">HPP</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <DollarSign size={16} className="mx-auto text-green-600" />
                  <p className="text-lg font-bold text-green-700 mt-1">{((1 - selectedItem.cost / selectedItem.price) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-green-600">Margin</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ChefHat size={18} /> Komposisi Resep
              </h4>
              {recipeData[selectedItem.id] ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-xs font-semibold text-slate-500">Bahan</th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-500">Jumlah</th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-500">Biaya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeData[selectedItem.id].map((r, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <td className="py-2 text-sm text-slate-700">{r.ingredient}</td>
                        <td className="py-2 text-sm text-right text-slate-600">{r.qty} {r.unit}</td>
                        <td className="py-2 text-sm text-right font-medium text-slate-800">{formatCurrency(r.cost)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-2 text-sm text-slate-800">Total HPP</td>
                      <td></td>
                      <td className="py-2 text-sm text-right text-red-600">
                        {formatCurrency(recipeData[selectedItem.id].reduce((s, r) => s + r.cost, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-500 italic">Resep belum diatur untuk menu ini.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Tambah Menu Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Nama Menu</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama menu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Kategori</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Makanan</option>
                    <option>Minuman</option>
                    <option>Dessert</option>
                    <option>Paket</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Stasiun Dapur</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Hot Kitchen</option>
                    <option>Cold Kitchen</option>
                    <option>Beverage</option>
                    <option>Dessert</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Harga Jual</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Estimasi Waktu (menit)</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Deskripsi</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Deskripsi menu" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
