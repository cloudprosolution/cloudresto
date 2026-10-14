import { useApp, formatCurrency } from '../store';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, AlertTriangle, Users, ChefHat, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const categoryData = [
  { name: 'Makanan', value: 65, amount: 3180000 },
  { name: 'Minuman', value: 25, amount: 1225000 },
  { name: 'Dessert', value: 7, amount: 343000 },
  { name: 'Paket', value: 3, amount: 147000 },
];

const topMenus = [
  { name: 'Nasi Goreng Spesial', qty: 45, revenue: 1575000 },
  { name: 'Es Teh Manis', qty: 62, revenue: 496000 },
  { name: 'Ayam Bakar Madu', qty: 28, revenue: 1176000 },
  { name: 'Kopi Susu Gula Aren', qty: 35, revenue: 770000 },
  { name: 'Mie Goreng Seafood', qty: 22, revenue: 836000 },
];

export default function Dashboard() {
  const { orders, tables, ingredients, dailySales } = useApp();

  const todayRevenue = 4900000;
  const todayTransactions = 92;
  const avgTransaction = 53261;
  const totalCOGS = 1617000;
  const grossProfit = todayRevenue - totalCOGS;
  const grossMargin = ((grossProfit / todayRevenue) * 100).toFixed(1);
  const activeOrders = orders.filter(o => o.status === 'active').length;
  const lowStockItems = ingredients.filter(i => i.stock <= i.minStock * 1.2).length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;

  const stats = [
    { label: 'Pendapatan Hari Ini', value: formatCurrency(todayRevenue), change: '+12.5%', up: true, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
    { label: 'Transaksi', value: todayTransactions.toString(), change: '+8.2%', up: true, icon: ShoppingBag, color: 'from-green-500 to-green-600' },
    { label: 'Rata-rata Transaksi', value: formatCurrency(avgTransaction), change: '+3.8%', up: true, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Laba Kotor', value: formatCurrency(grossProfit), change: `${grossMargin}%`, up: true, icon: ArrowUpRight, color: 'from-amber-500 to-amber-600' },
  ];

  const alerts = [
    { type: 'warning', message: `${lowStockItems} bahan baku mendekati stok minimum`, icon: AlertTriangle },
    { type: 'info', message: `${activeOrders} pesanan aktif sedang diproses`, icon: ChefHat },
    { type: 'success', message: `${availableTables} meja tersedia dari ${tables.length} total`, icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change} dari kemarin
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Grafik Penjualan 7 Hari Terakhir</h3>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
              <option>7 Hari</option>
              <option>30 Hari</option>
              <option>3 Bulan</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(v) => new Date(v).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Penjualan per Kategori</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-600">{cat.name}</span>
                </div>
                <span className="font-medium text-slate-800">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Status */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Status Meja</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{availableTables}</p>
              <p className="text-xs text-green-700">Tersedia</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{occupiedTables}</p>
              <p className="text-xs text-blue-700">Terisi</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{tables.filter(t => t.status === 'reserved').length}</p>
              <p className="text-xs text-amber-700">Dipesan</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{tables.filter(t => t.status === 'dirty').length}</p>
              <p className="text-xs text-orange-700">Perlu Dibersihkan</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-600 mb-2">Pesanan Aktif ({activeOrders})</h4>
            <div className="space-y-2">
              {orders.filter(o => o.status === 'active').map(order => (
                <div key={order.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">Meja {tables.find(t => t.id === order.tableId)?.number || '-'}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{formatCurrency(order.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Menu */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Menu Terlaris Hari Ini</h3>
          <div className="space-y-3">
            {topMenus.map((menu, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{menu.name}</p>
                  <p className="text-xs text-slate-500">{menu.qty} porsi</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">{formatCurrency(menu.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & HPP */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-3">Notifikasi</h3>
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' : alert.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <alert.icon size={16} className={alert.type === 'warning' ? 'text-amber-600' : alert.type === 'success' ? 'text-green-600' : 'text-blue-600'} />
                  <p className={`text-sm ${alert.type === 'warning' ? 'text-amber-700' : alert.type === 'success' ? 'text-green-700' : 'text-blue-700'}`}>{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-3">Ringkasan HPP</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Pendapatan Kotor</span>
                <span className="text-sm font-semibold">{formatCurrency(todayRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">HPP Barang Terjual</span>
                <span className="text-sm font-semibold text-red-600">-{formatCurrency(totalCOGS)}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Laba Kotor</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(grossProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Margin Laba Kotor</span>
                <span className="text-sm font-bold text-green-600">{grossMargin}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Perbandingan Penjualan Makanan vs Minuman</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Bar dataKey="foodSales" name="Makanan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="drinkSales" name="Minuman" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
