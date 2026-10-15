import { useState } from 'react';
import { useApp, formatCurrency } from '../store';
import { BarChart3, TrendingUp, Package, DollarSign, ChefHat, Download, Printer, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const hourlyData = [
  { hour: '10:00', orders: 5, revenue: 250000 },
  { hour: '11:00', orders: 12, revenue: 620000 },
  { hour: '12:00', orders: 25, revenue: 1350000 },
  { hour: '13:00', orders: 18, revenue: 950000 },
  { hour: '14:00', orders: 8, revenue: 420000 },
  { hour: '17:00', orders: 10, revenue: 530000 },
  { hour: '18:00', orders: 20, revenue: 1080000 },
  { hour: '19:00', orders: 28, revenue: 1520000 },
  { hour: '20:00', orders: 22, revenue: 1180000 },
  { hour: '21:00', orders: 12, revenue: 640000 },
];

const hppData = [
  { menu: 'Nasi Goreng', harga: 35000, hpp: 10500, margin: 70, foodCost: 30 },
  { menu: 'Mie Goreng', harga: 38000, hpp: 12000, margin: 68.4, foodCost: 31.6 },
  { menu: 'Ayam Bakar', harga: 42000, hpp: 15000, margin: 64.3, foodCost: 35.7 },
  { menu: 'Sate Ayam', harga: 30000, hpp: 9000, margin: 70, foodCost: 30 },
  { menu: 'Gado-Gado', harga: 25000, hpp: 7500, margin: 70, foodCost: 30 },
  { menu: 'Es Teh', harga: 8000, hpp: 2000, margin: 75, foodCost: 25 },
  { menu: 'Jus Alpukat', harga: 18000, hpp: 5500, margin: 69.4, foodCost: 30.6 },
  { menu: 'Kopi Susu', harga: 22000, hpp: 6000, margin: 72.7, foodCost: 27.3 },
];

const paymentMethods = [
  { name: 'Tunai', value: 45, amount: 2205000 },
  { name: 'QRIS', value: 25, amount: 1225000 },
  { name: 'Transfer', value: 18, amount: 882000 },
  { name: 'Kartu', value: 12, amount: 588000 },
];

export default function Reports() {
  const { dailySales } = useApp();
  const [activeReport, setActiveReport] = useState('sales');

  const reports = [
    { id: 'sales', label: 'Penjualan', icon: BarChart3 },
    { id: 'hpp', label: 'HPP & Profit', icon: DollarSign },
    { id: 'kitchen', label: 'Dapur', icon: ChefHat },
    { id: 'inventory', label: 'Inventori', icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Report Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {reports.map(report => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeReport === report.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <report.icon size={16} /> {report.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Printer size={14} /> Cetak
          </button>
        </div>
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Penjualan per Jam Hari Ini</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="revenue" name="Pendapatan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Metode Pembayaran</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {paymentMethods.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {paymentMethods.map((pm, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-slate-600">{pm.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-slate-800">{pm.value}%</span>
                      <span className="text-xs text-slate-500 ml-2">{formatCurrency(pm.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Sales Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Riwayat Penjualan 7 Hari</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Tanggal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Transaksi</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Rata-rata</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Makanan</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Minuman</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((day, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">{day.transactions}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">{formatCurrency(day.avgTransaction)}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">{formatCurrency(day.foodSales)}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-600">{formatCurrency(day.drinkSales)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-800">{formatCurrency(day.revenue)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-4 py-3 text-sm text-blue-800">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-800">{dailySales.reduce((s, d) => s + d.transactions, 0)}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-800">{formatCurrency(Math.round(dailySales.reduce((s, d) => s + d.avgTransaction, 0) / dailySales.length))}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-800">{formatCurrency(dailySales.reduce((s, d) => s + d.foodSales, 0))}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-800">{formatCurrency(dailySales.reduce((s, d) => s + d.drinkSales, 0))}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-800">{formatCurrency(dailySales.reduce((s, d) => s + d.revenue, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HPP Report */}
      {activeReport === 'hpp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Pendapatan Bersih</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(4900000)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500">HPP Total</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(1617000)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Laba Kotor</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(3283000)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500">Margin Laba Kotor</p>
              <p className="text-xl font-bold text-green-600">67.0%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Analisis HPP per Menu</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Menu</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Harga Jual</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">HPP</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Laba Kotor</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Food Cost %</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {hppData.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.menu}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">{formatCurrency(item.harga)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(item.hpp)}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">{formatCurrency(item.harga - item.hpp)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.foodCost <= 30 ? 'bg-green-100 text-green-700' :
                        item.foodCost <= 35 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{item.foodCost}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{item.margin}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Perbandingan HPP vs Harga Jual</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hppData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="menu" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="harga" name="Harga Jual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hpp" name="HPP" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Kitchen Report */}
      {activeReport === 'kitchen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-xs text-slate-500">Total Pesanan</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-green-600">8.5</p>
              <p className="text-xs text-slate-500">Rata-rata Waktu (mnt)</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-amber-600">5</p>
              <p className="text-xs text-slate-500">Pesanan Terlambat</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-red-600">3</p>
              <p className="text-xs text-slate-500">Item Dibatalkan</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Performa Stasiun Dapur</h3>
            <div className="space-y-4">
              {[
                { name: 'Hot Kitchen', orders: 85, avgTime: 10, onTime: 92 },
                { name: 'Beverage', orders: 45, avgTime: 3, onTime: 98 },
                { name: 'Cold Kitchen', orders: 15, avgTime: 5, onTime: 95 },
                { name: 'Dessert', orders: 11, avgTime: 6, onTime: 94 },
              ].map((station, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32">
                    <p className="text-sm font-medium text-slate-700">{station.name}</p>
                    <p className="text-xs text-slate-500">{station.orders} pesanan</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Ketepatan Waktu</span>
                      <span className="text-xs font-bold text-slate-700">{station.onTime}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div className={`h-full rounded-full ${station.onTime >= 95 ? 'bg-green-500' : station.onTime >= 90 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${station.onTime}%` }} />
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-sm font-bold text-slate-700">{station.avgTime} mnt</p>
                    <p className="text-xs text-slate-500">avg time</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-blue-600">10</p>
              <p className="text-xs text-slate-500">Total Item</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-green-600">{formatCurrency(2847000)}</p>
              <p className="text-xs text-slate-500">Nilai Persediaan</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-amber-600">2</p>
              <p className="text-xs text-slate-500">Stok Rendah</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-xs text-slate-500">Stok Habis</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">Pergerakan Stok 7 Hari Terakhir</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailySales.map(d => ({ date: d.date, masuk: Math.random() * 500000 + 200000, keluar: Math.random() * 300000 + 100000 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="masuk" name="Masuk" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="keluar" name="Keluar" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
