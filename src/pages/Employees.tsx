import { useState } from 'react';
import { useApp } from '../store';
import { Users, Plus, Search, Clock, Calendar, Phone, Mail, Edit, Shield } from 'lucide-react';

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-700',
  'Restaurant Manager': 'bg-purple-100 text-purple-700',
  'Cashier': 'bg-blue-100 text-blue-700',
  'Waiter': 'bg-green-100 text-green-700',
  'Kitchen Staff': 'bg-amber-100 text-amber-700',
  'Inventory Staff': 'bg-cyan-100 text-cyan-700',
};

const scheduleData = [
  { day: 'Senin', shifts: [{ name: 'Budi Prasetyo', role: 'Kasir', shift: 'Pagi (08:00-16:00)' }, { name: 'Joko Susilo', role: 'Chef', shift: 'Pagi (08:00-16:00)' }, { name: 'Sari Wulandari', role: 'Pelayan', shift: 'Siang (12:00-20:00)' }] },
  { day: 'Selasa', shifts: [{ name: 'Lina Kusuma', role: 'Kasir', shift: 'Pagi (08:00-16:00)' }, { name: 'Rudi Hartono', role: 'Cook', shift: 'Siang (12:00-20:00)' }, { name: 'Sari Wulandari', role: 'Pelayan', shift: 'Pagi (08:00-16:00)' }] },
  { day: 'Rabu', shifts: [{ name: 'Budi Prasetyo', role: 'Kasir', shift: 'Siang (12:00-20:00)' }, { name: 'Joko Susilo', role: 'Chef', shift: 'Pagi (08:00-16:00)' }, { name: 'Maya Putri', role: 'Staff Gudang', shift: 'Pagi (08:00-16:00)' }] },
  { day: 'Kamis', shifts: [{ name: 'Lina Kusuma', role: 'Kasir', shift: 'Pagi (08:00-16:00)' }, { name: 'Rudi Hartono', role: 'Cook', shift: 'Pagi (08:00-16:00)' }, { name: 'Sari Wulandari', role: 'Pelayan', shift: 'Siang (12:00-20:00)' }] },
  { day: 'Jumat', shifts: [{ name: 'Budi Prasetyo', role: 'Kasir', shift: 'Pagi (08:00-16:00)' }, { name: 'Joko Susilo', role: 'Chef', shift: 'Siang (12:00-20:00)' }, { name: 'Sari Wulandari', role: 'Pelayan', shift: 'Pagi (08:00-16:00)' }] },
];

export default function Employees() {
  const { employees } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'schedule' | 'attendance'>('list');
  const [showForm, setShowForm] = useState(false);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {[
            { id: 'list', label: 'Data Karyawan', icon: Users },
            { id: 'schedule', label: 'Jadwal Shift', icon: Calendar },
            { id: 'attendance', label: 'Kehadiran', icon: Clock },
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
          <Plus size={16} /> Tambah Karyawan
        </button>
      </div>

      {/* List View */}
      {activeTab === 'list' && (
        <>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(emp => (
              <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate">{emp.name}</h4>
                    <p className="text-xs text-slate-500">{emp.position}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[emp.role] || 'bg-slate-100 text-slate-600'}`}>
                      {emp.role}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <p className="text-xs text-slate-600 flex items-center gap-2"><Phone size={12} /> {emp.phone}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-2"><Mail size={12} /> {emp.email}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-2"><Shield size={12} /> {emp.branch}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    <Edit size={12} className="inline mr-1" /> Edit
                  </button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Schedule View */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Hari</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Karyawan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Posisi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Shift</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((day, di) => (
                  day.shifts.map((shift, si) => (
                    <tr key={`${di}-${si}`} className="border-b border-slate-50 hover:bg-slate-50">
                      {si === 0 && (
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800" rowSpan={day.shifts.length}>
                          {day.day}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-slate-700">{shift.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{shift.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          shift.shift.includes('Pagi') ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>{shift.shift}</span>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance View */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Rekap Kehadiran Hari Ini</h3>
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Karyawan</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Jam Masuk</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Jam Pulang</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Total Jam</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {employees.filter(e => e.status === 'active').map((emp, i) => {
                const statuses = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Hadir', 'Hadir', 'Hadir'];
                const status = statuses[i % statuses.length];
                return (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === 'Hadir' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>{status}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">{status === 'Hadir' ? '07:55' : '-'}</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">{status === 'Hadir' ? '16:05' : '-'}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-slate-700">{status === 'Hadir' ? '8j 10m' : '-'}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">{status === 'Izin' ? 'Sakit' : 'Tepat Waktu'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Tambah Karyawan</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Nama Lengkap</label>
                  <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">No. Telepon</label>
                  <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Jabatan</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Kasir</option>
                    <option>Pelayan</option>
                    <option>Chef</option>
                    <option>Cook</option>
                    <option>Staff Gudang</option>
                    <option>Manajer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Role</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Cashier</option>
                    <option>Waiter</option>
                    <option>Kitchen Staff</option>
                    <option>Inventory Staff</option>
                    <option>Restaurant Manager</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
