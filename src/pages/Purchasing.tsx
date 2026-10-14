import { useState } from 'react';
import { useApp, formatCurrency } from '../store';
import { Truck, Plus, FileText, CheckCircle, Clock, AlertCircle, Package, Search } from 'lucide-react';

const mockPOs = [
  { id: 'po1', poNumber: 'PO-2025-001', supplier: 'PT Sembako Jaya', date: '2025-01-18', items: 5, total: 3500000, status: 'received' },
  { id: 'po2', poNumber: 'PO-2025-002', supplier: 'CV Protein Segar', date: '2025-01-19', items: 3, total: 2100000, status: 'received' },
  { id: 'po3', poNumber: 'PO-2025-003', supplier: 'PT Minuman Prima', date: '2025-01-20', items: 4, total: 1800000, status: 'sent' },
  { id: 'po4', poNumber: 'PO-2025-004', supplier: 'UD Bumbu Nusantara', date: '2025-01-20', items: 2, total: 750000, status: 'draft' },
  { id: 'po5', poNumber: 'PO-2025-005', supplier: 'Tani Buah Segar', date: '2025-01-21', items: 3, total: 1250000, status: 'sent' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100', icon: FileText },
  sent: { label: 'Terkirim', color: 'text-blue-700', bg: 'bg-blue-100', icon: Clock },
  received: { label: 'Diterima', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  partial: { label: 'Sebagian', color: 'text-amber-700', bg: 'bg-amber-100', icon: AlertCircle },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100', icon: AlertCircle },
};

export default function Purchasing() {
  const { suppliers, ingredients } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers' | 'receiving'>('orders');
  const [showForm, setShowForm] = useState(false);

  const filteredPOs = mockPOs.filter(po => 
    po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {[
            { id: 'orders', label: 'Purchase Order', icon: FileText },
            { id: 'suppliers', label: 'Supplier', icon: Truck },
            { id: 'receiving', label: 'Penerimaan', icon: Package },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md">
          <Plus size={16} /> Buat PO
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nomor PO atau supplier..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">No. PO</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Item</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map(po => {
                  const config = statusConfig[po.status];
                  return (
                    <tr key={po.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-blue-600">{po.poNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{po.supplier}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{new Date(po.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{po.items}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-slate-800">{formatCurrency(po.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>{config.label}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {supplier.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate">{supplier.name}</h4>
                  <p className="text-xs text-slate-500">{supplier.contact}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-slate-600 flex items-center gap-2">📞 {supplier.phone}</p>
                <p className="text-xs text-slate-600 flex items-center gap-2">✉️ {supplier.email}</p>
                <p className="text-xs text-slate-600 flex items-center gap-2">📍 {supplier.address}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Menyupply: {ingredients.filter(i => i.supplier === supplier.id).length} bahan baku
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receiving Tab */}
      {activeTab === 'receiving' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Penerimaan Barang Terbaru</h3>
          <div className="space-y-3">
            {mockPOs.filter(po => po.status === 'received').map(po => (
              <div key={po.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-semibold text-green-800">{po.poNumber}</p>
                  <p className="text-sm text-green-600">{po.supplier} • {po.items} item</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-800">{formatCurrency(po.total)}</p>
                  <p className="text-xs text-green-600">{new Date(po.date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create PO Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Buat Purchase Order</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Supplier</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Item Pesanan</label>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <select className="col-span-5 px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">Pilih bahan</option>
                        {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                      </select>
                      <input type="number" className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Qty" />
                      <input type="number" className="col-span-3 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Harga" />
                      <button className="col-span-2 px-2 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm">Hapus</button>
                    </div>
                  ))}
                </div>
                <button className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700">+ Tambah Item</button>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Catatan</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Catatan untuk supplier" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">Simpan Draft</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Kirim PO</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
