import { useState } from 'react';
import { useApp } from '../store';
import { Store, Receipt, Percent, Clock, Globe, Printer, Shield, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  const { settings } = useApp();
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'Umum', icon: Store },
    { id: 'tax', label: 'Pajak & Layanan', icon: Percent },
    { id: 'receipt', label: 'Struk & Printer', icon: Printer },
    { id: 'operation', label: 'Operasional', icon: Clock },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0">
        <nav className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 sticky top-0">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                activeSection === section.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <section.icon size={16} />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeSection === 'general' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pengaturan Umum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Nama Restoran</label>
                <input defaultValue={settings.restaurantName} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Mata Uang</label>
                <select defaultValue="IDR" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="IDR">Rupiah (Rp)</option>
                  <option value="USD">Dollar ($)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Zona Waktu</label>
                <select defaultValue="Asia/Jakarta" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Bahasa</label>
                <select defaultValue="id" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">Alamat</label>
                <textarea defaultValue="Jl. Contoh No. 123, Jakarta Selatan" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">No. Telepon</label>
                <input defaultValue="021-1234567" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                <input defaultValue="info@restaurant.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Save size={16} /> Simpan Perubahan
              </button>
            </div>
          </div>
        )}

        {activeSection === 'tax' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pajak & Biaya Layanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Tarif Pajak (%)</label>
                <input type="number" defaultValue={settings.taxRate} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">PPN yang dikenakan pada setiap transaksi</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Biaya Layanan (%)</label>
                <input type="number" defaultValue={settings.serviceChargeRate} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Service charge yang ditambahkan ke tagihan</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Batas Diskon Kasir (%)</label>
                <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Diskon maksimal yang bisa diberikan kasir tanpa otorisasi</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Batas Diskon Manajer (%)</label>
                <input type="number" defaultValue={25} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">Diskon maksimal yang bisa diberikan manajer</p>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        )}

        {activeSection === 'receipt' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pengaturan Struk & Printer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Printer Struk</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>EPSON TM-T82 - USB</option>
                  <option>EPSON TM-T82 - Network</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Printer Dapur</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>EPSON TM-T82 - Kitchen</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Ukuran Kertas</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>58mm</option>
                  <option>80mm</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Auto-cut</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Ya</option>
                  <option>Tidak</option>
                </select>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Preview Struk</h4>
              <div className="bg-white border border-dashed border-slate-300 rounded p-4 font-mono text-xs text-slate-600 space-y-1">
                <p className="text-center font-bold">RESTAURANT MANAGEMENT SYSTEM</p>
                <p className="text-center">Jl. Contoh No. 123, Jakarta</p>
                <p className="text-center">Telp: 021-1234567</p>
                <hr className="border-dashed" />
                <p>No: ORD-001 | 20 Jan 2025 12:30</p>
                <p>Kasir: Budi Prasetyo</p>
                <hr className="border-dashed" />
                <p>2x Nasi Goreng Spesial    Rp70.000</p>
                <p>2x Es Teh Manis           Rp16.000</p>
                <hr className="border-dashed" />
                <p className="flex justify-between"><span>Subtotal</span><span>Rp86.000</span></p>
                <p className="flex justify-between"><span>Pajak (10%)</span><span>Rp8.600</span></p>
                <p className="flex justify-between"><span>Layanan (5%)</span><span>Rp4.300</span></p>
                <p className="flex justify-between font-bold"><span>TOTAL</span><span>Rp98.900</span></p>
                <hr className="border-dashed" />
                <p className="text-center">Terima kasih atas kunjungan Anda!</p>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        )}

        {activeSection === 'operation' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Pengaturan Operasional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Jam Buka</label>
                <input type="time" defaultValue="10:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Jam Tutup</label>
                <input type="time" defaultValue="22:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Durasi Reservasi Default (menit)</label>
                <input type="number" defaultValue={120} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Target Waktu Masak (menit)</label>
                <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Metode Penilaian Persediaan</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Moving Weighted Average</option>
                  <option>FIFO</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Izinkan Stok Negatif</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Tidak</option>
                  <option>Ya (dengan otorisasi)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Keamanan & Hak Akses</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Role yang Tersedia</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Super Admin', 'Owner', 'General Manager', 'Restaurant Manager', 'Supervisor', 'Cashier', 'Waiter', 'Kitchen Staff', 'Chef', 'Inventory Staff', 'Purchasing Staff', 'Accountant', 'HR Staff'].map(role => (
                    <div key={role} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200">
                      <Shield size={14} className="text-blue-600" />
                      <span className="text-xs font-medium text-slate-700">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Audit Log</h4>
                <div className="space-y-2">
                  {[
                    { time: '12:30', action: 'Pembayaran', user: 'Budi Prasetyo', detail: 'ORD-001 - Rp98.900' },
                    { time: '12:15', action: 'Perubahan Harga', user: 'Ahmad Rizki', detail: 'Nasi Goreng: Rp32.000 → Rp35.000' },
                    { time: '11:45', action: 'Stok Opname', user: 'Maya Putri', detail: 'Beras: selisih -2 kg' },
                    { time: '10:30', action: 'Pembatalan', user: 'Dewi Sartika', detail: 'ORD-005 - Pembatalan oleh pelanggan' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs bg-white rounded-lg px-3 py-2 border border-slate-200">
                      <span className="text-slate-500 font-mono">{log.time}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">{log.action}</span>
                      <span className="text-slate-600">{log.user}</span>
                      <span className="text-slate-500 ml-auto">{log.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'backup' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Backup & Pemeliharaan</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-800">Backup Terakhir</p>
                  <p className="text-sm text-green-600">20 Januari 2025, 03:00 WIB (Otomatis)</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <Database size={14} className="inline mr-1" /> Backup Sekarang
                </button>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Jadwal Backup Otomatis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Frekuensi</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Setiap Hari</option>
                      <option>Setiap Minggu</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Waktu</label>
                    <input type="time" defaultValue="03:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Riwayat Backup</h4>
                <div className="space-y-2">
                  {['20 Jan 2025 - 03:00', '19 Jan 2025 - 03:00', '18 Jan 2025 - 03:00', '17 Jan 2025 - 03:00'].map((date, i) => (
                    <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-200">
                      <span className="text-xs text-slate-600">{date}</span>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700">Download</button>
                        <button className="text-xs text-green-600 hover:text-green-700">Restore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
