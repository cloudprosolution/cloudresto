import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface MenuItem {
  id: string; name: string; category: string; price: number; cost: number;
  image?: string; available: boolean; station: string; prepTime: number;
  description: string;
}

export interface OrderItem {
  id: string; menuItem: MenuItem; quantity: number; notes: string;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';
  station: string; createdAt: Date;
}

export interface Order {
  id: string; orderNumber: string; tableId?: string; type: 'dine-in' | 'takeaway' | 'delivery';
  items: OrderItem[]; status: 'active' | 'paid' | 'cancelled';
  subtotal: number; discount: number; tax: number; serviceCharge: number;
  total: number; paymentMethod?: string; createdAt: Date; paidAt?: Date;
  cashier: string; waiter: string; customerName?: string;
}

export interface Table {
  id: string; number: number; area: string; capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'dirty' | 'maintenance';
  currentOrderId?: string;
}

export interface Reservation {
  id: string; customerName: string; phone: string; date: string;
  time: string; guests: number; tableId?: string; area: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
  notes: string; bookingNumber: string;
}

export interface Ingredient {
  id: string; code: string; name: string; category: string;
  unit: string; purchaseUnit: string; conversionRate: number;
  stock: number; minStock: number; costPerUnit: number;
  location: string; supplier?: string;
}

export interface StockMovement {
  id: string; ingredientId: string; type: 'in' | 'out' | 'adjustment' | 'waste' | 'transfer';
  quantity: number; date: Date; reference: string; notes: string;
}

export interface Supplier {
  id: string; name: string; contact: string; phone: string;
  email: string; address: string;
}

export interface PurchaseOrder {
  id: string; poNumber: string; supplierId: string; items: { ingredientId: string; quantity: number; unitPrice: number }[];
  total: number; status: 'draft' | 'sent' | 'received' | 'partial' | 'cancelled';
  createdAt: Date; receivedAt?: Date;
}

export interface Employee {
  id: string; name: string; role: string; position: string;
  branch: string; phone: string; email: string; status: 'active' | 'inactive';
}

export interface DailySales {
  date: string; revenue: number; transactions: number; avgTransaction: number;
  foodSales: number; drinkSales: number;
}

// Mock Data
const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Nasi Goreng Spesial', category: 'Makanan', price: 35000, cost: 10500, available: true, station: 'hot-kitchen', prepTime: 10, description: 'Nasi goreng dengan telur, ayam, dan sayuran' },
  { id: 'm2', name: 'Mie Goreng Seafood', category: 'Makanan', price: 38000, cost: 12000, available: true, station: 'hot-kitchen', prepTime: 12, description: 'Mie goreng dengan udang dan cumi' },
  { id: 'm3', name: 'Ayam Bakar Madu', category: 'Makanan', price: 42000, cost: 15000, available: true, station: 'hot-kitchen', prepTime: 15, description: 'Ayam bakar dengan saus madu spesial' },
  { id: 'm4', name: 'Sate Ayam (10 tusuk)', category: 'Makanan', price: 30000, cost: 9000, available: true, station: 'hot-kitchen', prepTime: 8, description: 'Sate ayam dengan bumbu kacang' },
  { id: 'm5', name: 'Gado-Gado', category: 'Makanan', price: 25000, cost: 7500, available: true, station: 'cold-kitchen', prepTime: 5, description: 'Sayuran segar dengan bumbu kacang' },
  { id: 'm6', name: 'Soto Ayam', category: 'Makanan', price: 28000, cost: 8500, available: true, station: 'hot-kitchen', prepTime: 7, description: 'Soto ayam kuning dengan pelengkap' },
  { id: 'm7', name: 'Es Teh Manis', category: 'Minuman', price: 8000, cost: 2000, available: true, station: 'beverage', prepTime: 2, description: 'Teh manis dingin segar' },
  { id: 'm8', name: 'Jus Alpukat', category: 'Minuman', price: 18000, cost: 5500, available: true, station: 'beverage', prepTime: 3, description: 'Jus alpukat segar dengan susu' },
  { id: 'm9', name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 22000, cost: 6000, available: true, station: 'beverage', prepTime: 3, description: 'Kopi susu dengan gula aren asli' },
  { id: 'm10', name: 'Es Jeruk Peras', category: 'Minuman', price: 15000, cost: 4000, available: true, station: 'beverage', prepTime: 3, description: 'Jeruk peras segar dengan es' },
  { id: 'm11', name: 'Pancake Madu', category: 'Dessert', price: 25000, cost: 7000, available: true, station: 'dessert', prepTime: 8, description: 'Pancake fluffy dengan madu dan buah' },
  { id: 'm12', name: 'Es Krim 3 Scoop', category: 'Dessert', price: 20000, cost: 6000, available: true, station: 'dessert', prepTime: 2, description: 'Pilihan rasa: vanilla, coklat, strawberry' },
  { id: 'm13', name: 'Paket Hemat A', category: 'Paket', price: 45000, cost: 14000, available: true, station: 'hot-kitchen', prepTime: 12, description: 'Nasi Goreng + Es Teh + Kerupuk' },
  { id: 'm14', name: 'Rendang Sapi', category: 'Makanan', price: 48000, cost: 18000, available: false, station: 'hot-kitchen', prepTime: 5, description: 'Rendang sapi empuk bumbu Padang' },
  { id: 'm15', name: 'Nasi Uduk Komplit', category: 'Makanan', price: 32000, cost: 10000, available: true, station: 'hot-kitchen', prepTime: 5, description: 'Nasi uduk dengan ayam, tempe, dan sambal' },
];

const initialTables: Table[] = [
  { id: 't1', number: 1, area: 'Indoor', capacity: 2, status: 'available' },
  { id: 't2', number: 2, area: 'Indoor', capacity: 2, status: 'occupied', currentOrderId: 'o1' },
  { id: 't3', number: 3, area: 'Indoor', capacity: 4, status: 'available' },
  { id: 't4', number: 4, area: 'Indoor', capacity: 4, status: 'reserved' },
  { id: 't5', number: 5, area: 'Indoor', capacity: 6, status: 'available' },
  { id: 't6', number: 6, area: 'Outdoor', capacity: 4, status: 'occupied', currentOrderId: 'o2' },
  { id: 't7', number: 7, area: 'Outdoor', capacity: 4, status: 'available' },
  { id: 't8', number: 8, area: 'Outdoor', capacity: 8, status: 'dirty' },
  { id: 't9', number: 9, area: 'VIP', capacity: 6, status: 'available' },
  { id: 't10', number: 10, area: 'VIP', capacity: 8, status: 'reserved' },
  { id: 't11', number: 11, area: 'VIP', capacity: 10, status: 'available' },
  { id: 't12', number: 12, area: 'Smoking Area', capacity: 4, status: 'available' },
];

const initialIngredients: Ingredient[] = [
  { id: 'i1', code: 'BRG-001', name: 'Beras', category: 'Bahan Pokok', unit: 'kg', purchaseUnit: 'karung (25kg)', conversionRate: 25, stock: 45, minStock: 20, costPerUnit: 14000, location: 'Gudang Utama', supplier: 's1' },
  { id: 'i2', code: 'MYK-001', name: 'Minyak Goreng', category: 'Bahan Pokok', unit: 'liter', purchaseUnit: 'jerigen (5L)', conversionRate: 5, stock: 18, minStock: 10, costPerUnit: 18000, location: 'Gudang Utama', supplier: 's1' },
  { id: 'i3', code: 'AYM-001', name: 'Daging Ayam', category: 'Protein', unit: 'kg', purchaseUnit: 'kg', conversionRate: 1, stock: 12, minStock: 8, costPerUnit: 35000, location: 'Cold Storage', supplier: 's2' },
  { id: 'i4', code: 'TLR-001', name: 'Telur Ayam', category: 'Protein', unit: 'butir', purchaseUnit: 'tray (30 butir)', conversionRate: 30, stock: 120, minStock: 60, costPerUnit: 2500, location: 'Cold Storage', supplier: 's2' },
  { id: 'i5', code: 'BMB-001', name: 'Bumbu Dasar', category: 'Bumbu', unit: 'porsi', purchaseUnit: 'kg', conversionRate: 20, stock: 8, minStock: 5, costPerUnit: 25000, location: 'Dapur', supplier: 's3' },
  { id: 'i6', code: 'TH-001', name: 'Teh Celup', category: 'Minuman', unit: 'pcs', purchaseUnit: 'box (50 pcs)', conversionRate: 50, stock: 200, minStock: 100, costPerUnit: 1500, location: 'Gudang Utama', supplier: 's4' },
  { id: 'i7', code: 'GUL-001', name: 'Gula Pasir', category: 'Bahan Pokok', unit: 'kg', purchaseUnit: 'karung (50kg)', conversionRate: 50, stock: 30, minStock: 15, costPerUnit: 16000, location: 'Gudang Utama', supplier: 's1' },
  { id: 'i8', code: 'ALP-001', name: 'Alpukat', category: 'Buah', unit: 'kg', purchaseUnit: 'kg', conversionRate: 1, stock: 5, minStock: 3, costPerUnit: 25000, location: 'Cold Storage', supplier: 's5' },
  { id: 'i9', code: 'KPI-001', name: 'Kopi Bubuk', category: 'Minuman', unit: 'gram', purchaseUnit: 'kg', conversionRate: 1000, stock: 2000, minStock: 500, costPerUnit: 150, location: 'Gudang Utama', supplier: 's4' },
  { id: 'i10', code: 'SUS-001', name: 'Susu UHT', category: 'Minuman', unit: 'liter', purchaseUnit: 'karton (12L)', conversionRate: 12, stock: 15, minStock: 6, costPerUnit: 18000, location: 'Cold Storage', supplier: 's4' },
];

const suppliers: Supplier[] = [
  { id: 's1', name: 'PT Sembako Jaya', contact: 'Budi Santoso', phone: '021-5551234', email: 'budi@sembakojaya.com', address: 'Jl. Pasar Baru No. 10, Jakarta' },
  { id: 's2', name: 'CV Protein Segar', contact: 'Andi Wijaya', phone: '021-5555678', email: 'andi@proteinsegar.com', address: 'Jl. Raya Bogor Km. 25' },
  { id: 's3', name: 'UD Bumbu Nusantara', contact: 'Siti Rahayu', phone: '021-5559012', email: 'siti@bumbunusantara.com', address: 'Jl. Matraman No. 45, Jakarta' },
  { id: 's4', name: 'PT Minuman Prima', contact: 'Dedi Kurniawan', phone: '021-5553456', email: 'dedi@minumanprima.com', address: 'Jl. Industri No. 8, Bekasi' },
  { id: 's5', name: 'Tani Buah Segar', contact: 'Rina Marlina', phone: '021-5557890', email: 'rina@tanibuah.com', address: 'Jl. Cibadak No. 12, Bandung' },
];

const employees: Employee[] = [
  { id: 'e1', name: 'Ahmad Rizki', role: 'Super Admin', position: 'Administrator', branch: 'Cabang Pusat', phone: '081234567890', email: 'ahmad@rms.com', status: 'active' },
  { id: 'e2', name: 'Dewi Sartika', role: 'Restaurant Manager', position: 'Manajer', branch: 'Cabang Pusat', phone: '081234567891', email: 'dewi@rms.com', status: 'active' },
  { id: 'e3', name: 'Budi Prasetyo', role: 'Cashier', position: 'Kasir', branch: 'Cabang Pusat', phone: '081234567892', email: 'budi@rms.com', status: 'active' },
  { id: 'e4', name: 'Sari Wulandari', role: 'Waiter', position: 'Pelayan', branch: 'Cabang Pusat', phone: '081234567893', email: 'sari@rms.com', status: 'active' },
  { id: 'e5', name: 'Joko Susilo', role: 'Kitchen Staff', position: 'Chef', branch: 'Cabang Pusat', phone: '081234567894', email: 'joko@rms.com', status: 'active' },
  { id: 'e6', name: 'Maya Putri', role: 'Inventory Staff', position: 'Staff Gudang', branch: 'Cabang Pusat', phone: '081234567895', email: 'maya@rms.com', status: 'active' },
  { id: 'e7', name: 'Rudi Hartono', role: 'Kitchen Staff', position: 'Cook', branch: 'Cabang Pusat', phone: '081234567896', email: 'rudi@rms.com', status: 'active' },
  { id: 'e8', name: 'Lina Kusuma', role: 'Cashier', position: 'Kasir', branch: 'Cabang Pusat', phone: '081234567897', email: 'lina@rms.com', status: 'active' },
];

const initialReservations: Reservation[] = [
  { id: 'r1', customerName: 'Keluarga Tanoto', phone: '08111222333', date: '2025-01-20', time: '19:00', guests: 6, tableId: 't9', area: 'VIP', status: 'confirmed', notes: 'Ulang tahun anak, perlu kue', bookingNumber: 'RSV-20250120-001' },
  { id: 'r2', customerName: 'PT Maju Bersama', phone: '08111222444', date: '2025-01-20', time: '12:00', guests: 8, tableId: 't10', area: 'VIP', status: 'confirmed', notes: 'Meeting bisnis, butuh proyektor', bookingNumber: 'RSV-20250120-002' },
  { id: 'r3', customerName: 'Ibu Ratna', phone: '08111222555', date: '2025-01-21', time: '18:30', guests: 4, area: 'Indoor', status: 'pending', notes: 'Dekat jendela', bookingNumber: 'RSV-20250121-001' },
  { id: 'r4', customerName: 'Pak Hendra', phone: '08111222666', date: '2025-01-20', time: '20:00', guests: 2, area: 'Outdoor', status: 'checked-in', notes: '', bookingNumber: 'RSV-20250120-003' },
];

const dailySalesData: DailySales[] = [
  { date: '2025-01-14', revenue: 4500000, transactions: 85, avgTransaction: 52941, foodSales: 3200000, drinkSales: 1300000 },
  { date: '2025-01-15', revenue: 5200000, transactions: 98, avgTransaction: 53061, foodSales: 3700000, drinkSales: 1500000 },
  { date: '2025-01-16', revenue: 3800000, transactions: 72, avgTransaction: 52778, foodSales: 2700000, drinkSales: 1100000 },
  { date: '2025-01-17', revenue: 6100000, transactions: 115, avgTransaction: 53043, foodSales: 4300000, drinkSales: 1800000 },
  { date: '2025-01-18', revenue: 7200000, transactions: 135, avgTransaction: 53333, foodSales: 5100000, drinkSales: 2100000 },
  { date: '2025-01-19', revenue: 6800000, transactions: 128, avgTransaction: 53125, foodSales: 4800000, drinkSales: 2000000 },
  { date: '2025-01-20', revenue: 4900000, transactions: 92, avgTransaction: 53261, foodSales: 3500000, drinkSales: 1400000 },
];

const initialOrders: Order[] = [
  {
    id: 'o1', orderNumber: 'ORD-001', tableId: 't2', type: 'dine-in',
    items: [
      { id: 'oi1', menuItem: menuItems[0], quantity: 2, notes: 'Pedas level 3', status: 'preparing', station: 'hot-kitchen', createdAt: new Date(Date.now() - 600000) },
      { id: 'oi2', menuItem: menuItems[6], quantity: 2, notes: '', status: 'ready', station: 'beverage', createdAt: new Date(Date.now() - 600000) },
    ],
    status: 'active', subtotal: 86000, discount: 0, tax: 8600, serviceCharge: 4300, total: 98900,
    createdAt: new Date(Date.now() - 600000), cashier: 'Budi Prasetyo', waiter: 'Sari Wulandari'
  },
  {
    id: 'o2', orderNumber: 'ORD-002', tableId: 't6', type: 'dine-in',
    items: [
      { id: 'oi3', menuItem: menuItems[2], quantity: 1, notes: '', status: 'accepted', station: 'hot-kitchen', createdAt: new Date(Date.now() - 300000) },
      { id: 'oi4', menuItem: menuItems[8], quantity: 1, notes: 'Extra shot', status: 'new', station: 'beverage', createdAt: new Date(Date.now() - 300000) },
    ],
    status: 'active', subtotal: 64000, discount: 0, tax: 6400, serviceCharge: 3200, total: 73600,
    createdAt: new Date(Date.now() - 300000), cashier: 'Budi Prasetyo', waiter: 'Sari Wulandari'
  },
];

// Context
interface AppState {
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  employees: Employee[];
  reservations: Reservation[];
  dailySales: DailySales[];
  currentUser: { name: string; role: string };
  settings: {
    restaurantName: string;
    currency: string;
    taxRate: number;
    serviceChargeRate: number;
    timezone: string;
  };
  // Actions
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  addReservation: (res: Reservation) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  addStockMovement: (movement: StockMovement) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const addOrder = (order: Order) => setOrders(prev => [...prev, order]);
  
  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const updateOrderItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, items: o.items.map(i => i.id === itemId ? { ...i, status } : i) };
      }
      return o;
    }));
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addReservation = (res: Reservation) => setReservations(prev => [...prev, res]);
  
  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const addStockMovement = (movement: StockMovement) => {
    setStockMovements(prev => [...prev, movement]);
  };

  return (
    <AppContext.Provider value={{
      menuItems, tables, orders, ingredients, suppliers, employees, reservations,
      dailySales: dailySalesData,
      currentUser: { name: 'Ahmad Rizki', role: 'Super Admin' },
      settings: {
        restaurantName: 'Restaurant Management System',
        currency: 'Rp',
        taxRate: 10,
        serviceChargeRate: 5,
        timezone: 'Asia/Jakarta',
      },
      addOrder, updateOrder, updateOrderItemStatus, updateTable,
      addReservation, updateReservation, updateIngredient, addStockMovement,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
