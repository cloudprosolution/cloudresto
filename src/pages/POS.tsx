import { useState, useMemo } from 'react';
import { useApp, formatCurrency, OrderItem } from '../store';
import { Search, Plus, Minus, Trash2, X, ShoppingBag, CreditCard, Banknote, QrCode, Receipt, User, Clock } from 'lucide-react';

interface CartItem {
  menuItem: any;
  quantity: number;
  notes: string;
}

export default function POS() {
  const { menuItems, tables, orders, addOrder, settings } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<string>('');

  const categories = ['Semua', ...Array.from(new Set(menuItems.map(m => m.category)))];

  const filteredMenu = useMemo(() => {
    return menuItems.filter(m => {
      const matchCategory = activeCategory === 'Semua' || m.category === activeCategory;
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch && m.available;
    });
  }, [search, activeCategory, menuItems]);

  const availableTables = tables.filter(t => t.status === 'available' || t.status === 'occupied');

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id);
      if (existing) {
        return prev.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItem: item, quantity: 1, notes: '' }];
    });
  };

  const updateQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) return updated.filter((_, i) => i !== index);
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discount = 0;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * settings.taxRate / 100);
  const serviceCharge = Math.round(taxableAmount * settings.serviceChargeRate / 100);
  const total = taxableAmount + tax + serviceCharge;
  const change = Math.max(0, parseInt(cashReceived || '0') - total);

  const processPayment = () => {
    if (cart.length === 0) return;
    const orderNumber = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder = {
      id: `o${Date.now()}`,
      orderNumber,
      tableId: orderType === 'dine-in' ? selectedTable : undefined,
      type: orderType,
      items: cart.map((item, i) => ({
        id: `oi${Date.now()}_${i}`,
        menuItem: item.menuItem,
        quantity: item.quantity,
        notes: item.notes,
        status: 'new' as const,
        station: item.menuItem.station,
        createdAt: new Date(),
      })),
      status: 'paid' as const,
      subtotal,
      discount,
      tax,
      serviceCharge,
      total,
      paymentMethod,
      createdAt: new Date(),
      paidAt: new Date(),
      cashier: 'Budi Prasetyo',
      waiter: 'Sari Wulandari',
    };
    addOrder(newOrder);
    setLastOrder(orderNumber);
    setShowSuccess(true);
    setCart([]);
    setSelectedTable('');
    setCashReceived('');
    setShowPayment(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left - Menu */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-300 transition-all text-left group"
              >
                <div className="w-full h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl mb-2">
                  {item.category === 'Minuman' ? '🥤' : item.category === 'Dessert' ? '🍰' : item.category === 'Paket' ? '🍱' : '🍽️'}
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency(item.price)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-96 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100">
        {/* Order Type */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex gap-2 mb-3">
            {(['dine-in', 'takeaway', 'delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  orderType === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'dine-in' ? 'Dine In' : type === 'takeaway' ? 'Takeaway' : 'Delivery'}
              </button>
            ))}
          </div>
          {orderType === 'dine-in' && (
            <select
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Meja</option>
              {availableTables.map(t => (
                <option key={t.id} value={t.id}>Meja {t.number} - {t.area} ({t.capacity} orang) {t.status === 'occupied' ? '⚠️ Terisi' : '✅ Kosong'}</option>
              ))}
            </select>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ShoppingBag size={48} />
              <p className="mt-2 text-sm">Keranjang kosong</p>
              <p className="text-xs">Klik menu untuk menambahkan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.menuItem.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(item.menuItem.price)} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(index, -1)} className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(index, 1)} className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{formatCurrency(item.menuItem.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t border-slate-100 p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Pajak ({settings.taxRate}%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Layanan ({settings.serviceChargeRate}%)</span>
              <span className="font-medium">{formatCurrency(serviceCharge)}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bayar ({cart.length} item)
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-slate-800">Pembayaran</h3>
              <button onClick={() => setShowPayment(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-5">
              <p className="text-center text-3xl font-bold text-blue-600 mb-6">{formatCurrency(total)}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { id: 'cash', label: 'Tunai', icon: Banknote },
                  { id: 'card', label: 'Kartu', icon: CreditCard },
                  { id: 'qris', label: 'QRIS', icon: QrCode },
                  { id: 'transfer', label: 'Transfer', icon: Receipt },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <method.icon size={18} />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Uang Diterima</label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={e => setCashReceived(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <div className="flex gap-2 mt-2">
                    {[total, total + 10000, total + 50000, 100000, 200000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setCashReceived(amount.toString())}
                        className="flex-1 py-1.5 text-xs bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                  {parseInt(cashReceived) >= total && (
                    <p className="text-center mt-3 text-lg font-bold text-green-600">
                      Kembalian: {formatCurrency(change)}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={paymentMethod === 'cash' && parseInt(cashReceived || '0') < total}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
          <div>
            <p className="font-semibold">Pembayaran Berhasil!</p>
            <p className="text-sm text-green-100">No. {lastOrder}</p>
          </div>
        </div>
      )}
    </div>
  );
}
