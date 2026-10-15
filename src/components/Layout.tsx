import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store';
import {
  LayoutDashboard, ShoppingCart, Grid3X3, CalendarDays, ChefHat,
  UtensilsCrossed, Package, Truck, BarChart3, Users, Settings,
  Menu, X, Bell, LogOut, ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pos', label: 'Point of Sale', icon: ShoppingCart },
  { path: '/tables', label: 'Manajemen Meja', icon: Grid3X3 },
  { path: '/reservations', label: 'Reservasi', icon: CalendarDays },
  { path: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { path: '/menu', label: 'Menu & Resep', icon: UtensilsCrossed },
  { path: '/inventory', label: 'Inventori', icon: Package },
  { path: '/purchasing', label: 'Pembelian', icon: Truck },
  { path: '/reports', label: 'Laporan', icon: BarChart3 },
  { path: '/employees', label: 'Karyawan', icon: Users },
  { path: '/settings', label: 'Pengaturan', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
            🍽️
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight">RMS</h1>
              <p className="text-[10px] text-slate-400">Restaurant Management</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center h-12 border-t border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">🍽️</div>
                <h1 className="font-bold text-sm">RMS</h1>
              </div>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="py-4">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={24} className="text-slate-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-slate-500">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-dot" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500">{currentUser.role}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <Settings size={16} /> Pengaturan
                  </button>
                  <hr className="my-1" />
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
