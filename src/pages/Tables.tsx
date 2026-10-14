import { useState } from 'react';
import { useApp, formatCurrency } from '../store';
import { Users, Clock, Coffee, AlertCircle, CheckCircle, XCircle, Wrench } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  available: { label: 'Tersedia', color: 'text-green-700', bg: 'bg-green-50 border-green-300', icon: CheckCircle },
  occupied: { label: 'Terisi', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-300', icon: Users },
  reserved: { label: 'Dipesan', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-300', icon: Clock },
  dirty: { label: 'Perlu Dibersihkan', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-300', icon: AlertCircle },
  maintenance: { label: 'Maintenance', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-300', icon: Wrench },
};

export default function Tables() {
  const { tables, orders, updateTable } = useApp();
  const [selectedArea, setSelectedArea] = useState('Semua');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const areas = ['Semua', ...Array.from(new Set(tables.map(t => t.area)))];
  const filteredTables = selectedArea === 'Semua' ? tables : tables.filter(t => t.area === selectedArea);

  const getOrderForTable = (tableId: string) => orders.find(o => o.tableId === tableId && o.status === 'active');

  const handleStatusChange = (tableId: string, newStatus: string) => {
    updateTable(tableId, { status: newStatus as any });
  };

  const selectedTableData = selectedTable ? tables.find(t => t.id === selectedTable) : null;
  const selectedOrder = selectedTable ? getOrderForTable(selectedTable) : null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedArea === area ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className={`w-3 h-3 rounded-full ${config.bg.split(' ')[0]}`} />
              {config.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map(table => {
          const config = statusConfig[table.status];
          const order = getOrderForTable(table.id);
          const isSelected = selectedTable === table.id;
          return (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } ${config.bg}`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-slate-700">{table.number}</span>
                </div>
                <p className="text-xs font-medium text-slate-600">{table.area}</p>
                <p className={`text-xs font-semibold mt-1 ${config.color}`}>{config.label}</p>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-500">
                  <Users size={10} />
                  <span>{table.capacity}</span>
                </div>
                {order && (
                  <div className="mt-2 px-2 py-1 bg-white/70 rounded text-xs font-medium text-slate-700">
                    {formatCurrency(order.total)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Table Detail Panel */}
      {selectedTableData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Meja {selectedTableData.number}</h3>
              <p className="text-sm text-slate-500">{selectedTableData.area} • Kapasitas {selectedTableData.capacity} orang</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[selectedTableData.status].bg} ${statusConfig[selectedTableData.status].color}`}>
              {statusConfig[selectedTableData.status].label}
            </span>
          </div>

          {selectedOrder && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-800">{selectedOrder.orderNumber}</p>
                  <p className="text-xs text-slate-500">
                    <Clock size={12} className="inline mr-1" />
                    {Math.round((Date.now() - new Date(selectedOrder.createdAt).getTime()) / 60000)} menit yang lalu
                  </p>
                </div>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedOrder.total)}</p>
              </div>
              <div className="space-y-1">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.quantity}× {item.menuItem.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'preparing' ? 'bg-amber-100 text-amber-700' :
                      item.status === 'ready' ? 'bg-green-100 text-green-700' :
                      item.status === 'served' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-700'
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selectedTableData.status === 'available' && (
              <>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'occupied')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Tempatkan Tamu
                </button>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'reserved')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                  Reservasi
                </button>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'maintenance')} className="px-4 py-2 bg-slate-500 text-white rounded-lg text-sm font-medium hover:bg-slate-600">
                  Maintenance
                </button>
              </>
            )}
            {selectedTableData.status === 'occupied' && (
              <>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'dirty')} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
                  Selesai Makan
                </button>
              </>
            )}
            {selectedTableData.status === 'dirty' && (
              <button onClick={() => handleStatusChange(selectedTableData.id, 'available')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                Tandai Bersih
              </button>
            )}
            {selectedTableData.status === 'reserved' && (
              <>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'occupied')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Check-in
                </button>
                <button onClick={() => handleStatusChange(selectedTableData.id, 'available')} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                  Batalkan
                </button>
              </>
            )}
            {selectedTableData.status === 'maintenance' && (
              <button onClick={() => handleStatusChange(selectedTableData.id, 'available')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                Selesai Maintenance
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = tables.filter(t => t.status === key).length;
          return (
            <div key={key} className={`${config.bg} border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
              <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
