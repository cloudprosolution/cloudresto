import { useState } from 'react';
import { useApp } from '../store';
import { Calendar, Clock, Users, Phone, Plus, CheckCircle, XCircle, AlertCircle, UserCheck } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Menunggu', color: 'text-amber-700', bg: 'bg-amber-100' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-100' },
  'checked-in': { label: 'Check-in', color: 'text-green-700', bg: 'bg-green-100' },
  completed: { label: 'Selesai', color: 'text-slate-700', bg: 'bg-slate-100' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100' },
  'no-show': { label: 'No Show', color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function Reservations() {
  const { reservations, updateReservation, tables } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-01-20');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredReservations = reservations.filter(r => r.date === selectedDate);

  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
              Daftar
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
              Timeline
            </button>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md">
          <Plus size={16} /> Reservasi Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{filteredReservations.length}</p>
          <p className="text-xs text-slate-500">Total Reservasi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-bold text-amber-600">{filteredReservations.filter(r => r.status === 'pending').length}</p>
          <p className="text-xs text-slate-500">Menunggu Konfirmasi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-bold text-green-600">{filteredReservations.filter(r => r.status === 'confirmed').length}</p>
          <p className="text-xs text-slate-500">Dikonfirmasi</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p className="text-2xl font-bold text-slate-600">{filteredReservations.reduce((s, r) => s + r.guests, 0)}</p>
          <p className="text-xs text-slate-500">Total Tamu</p>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(10,1fr)] gap-1">
              <div className="text-xs font-semibold text-slate-500 py-2">Jam</div>
              {timeSlots.map(slot => (
                <div key={slot} className="text-xs font-semibold text-slate-500 py-2 text-center">{slot}</div>
              ))}
              {filteredReservations.map(res => {
                const startIdx = timeSlots.indexOf(res.time);
                const config = statusConfig[res.status];
                return (
                  <div key={res.id} className="contents">
                    <div className="text-xs text-slate-700 py-3 font-medium truncate">{res.customerName}</div>
                    {timeSlots.map((_, i) => (
                      <div key={i} className={`py-2 px-1 rounded text-xs text-center ${
                        i === startIdx ? `${config.bg} ${config.color} font-medium` : ''
                      }`}>
                        {i === startIdx ? `${res.guests} tamu` : ''}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
              <Calendar size={48} className="mx-auto text-slate-300" />
              <p className="mt-3 text-slate-500">Tidak ada reservasi untuk tanggal ini</p>
            </div>
          ) : (
            filteredReservations.map(res => {
              const config = statusConfig[res.status];
              return (
                <div key={res.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {res.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{res.customerName}</h4>
                        <p className="text-xs text-slate-500 font-mono">{res.bookingNumber}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1"><Clock size={14} /> {res.time}</span>
                          <span className="flex items-center gap-1"><Users size={14} /> {res.guests} tamu</span>
                          <span className="flex items-center gap-1"><Phone size={14} /> {res.phone}</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{res.area}</span>
                        </div>
                        {res.notes && <p className="text-xs text-amber-600 mt-1 italic">📝 {res.notes}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <div className="flex gap-1">
                        {res.status === 'pending' && (
                          <>
                            <button onClick={() => updateReservation(res.id, { status: 'confirmed' })} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                              Konfirmasi
                            </button>
                            <button onClick={() => updateReservation(res.id, { status: 'cancelled' })} className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
                              Tolak
                            </button>
                          </>
                        )}
                        {res.status === 'confirmed' && (
                          <button onClick={() => updateReservation(res.id, { status: 'checked-in' })} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1">
                            <UserCheck size={12} /> Check-in
                          </button>
                        )}
                        {res.status === 'checked-in' && (
                          <button onClick={() => updateReservation(res.id, { status: 'completed' })} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                            Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Reservasi Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Nama Pelanggan</label>
                <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama lengkap" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">No. Telepon</label>
                  <input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="08xxx" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Jumlah Tamu</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Tanggal</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Jam</label>
                  <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Area</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Indoor</option>
                  <option>Outdoor</option>
                  <option>VIP</option>
                  <option>Smoking Area</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Catatan</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Permintaan khusus" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Simpan Reservasi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
