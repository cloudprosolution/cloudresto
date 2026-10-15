import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Clock, AlertTriangle, Check, ChefHat, Coffee, Flame, IceCream } from 'lucide-react';

const stationConfig: Record<string, { label: string; icon: any; color: string }> = {
  'hot-kitchen': { label: 'Hot Kitchen', icon: Flame, color: 'from-red-500 to-orange-500' },
  'cold-kitchen': { label: 'Cold Kitchen', icon: ChefHat, color: 'from-green-500 to-emerald-500' },
  'beverage': { label: 'Beverage', icon: Coffee, color: 'from-blue-500 to-cyan-500' },
  'dessert': { label: 'Dessert', icon: IceCream, color: 'from-pink-500 to-purple-500' },
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  accepted: 'bg-amber-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  served: 'bg-slate-400',
  cancelled: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
  new: 'Baru',
  accepted: 'Diterima',
  preparing: 'Diproses',
  ready: 'Siap',
  served: 'Disajikan',
  cancelled: 'Batal',
};

export default function Kitchen() {
  const { orders, updateOrderItemStatus } = useApp();
  const [selectedStation, setSelectedStation] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allItems = orders
    .filter(o => o.status === 'active')
    .flatMap(order =>
      order.items
        .filter(item => item.status !== 'served' && item.status !== 'cancelled')
        .map(item => ({ ...item, orderNumber: order.orderNumber, tableId: order.tableId, orderId: order.id }))
    );

  const filteredItems = selectedStation === 'all'
    ? allItems
    : allItems.filter(item => item.station === selectedStation);

  const getElapsedTime = (date: Date) => {
    const mins = Math.floor((currentTime.getTime() - new Date(date).getTime()) / 60000);
    return mins;
  };

  const getNextStatus = (current: string): string | null => {
    const flow: Record<string, string> = {
      new: 'accepted',
      accepted: 'preparing',
      preparing: 'ready',
      ready: 'served',
    };
    return flow[current] || null;
  };

  const handleStatusChange = (orderId: string, itemId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      updateOrderItemStatus(orderId, itemId, nextStatus as any);
    }
  };

  const stations = Object.entries(stationConfig);

  return (
    <div className={`space-y-4 ${fullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-bold ${fullscreen ? 'text-white' : 'text-slate-800'}`}>
            🍳 Kitchen Display System
          </h2>
          <span className={`text-sm ${fullscreen ? 'text-slate-300' : 'text-slate-500'}`}>
            {currentTime.toLocaleTimeString('id-ID')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex gap-1 p-1 rounded-lg ${fullscreen ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
            <button
              onClick={() => setSelectedStation('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedStation === 'all' ? 'bg-blue-600 text-white' : fullscreen ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Semua ({allItems.length})
            </button>
            {stations.map(([key, config]) => {
              const count = allItems.filter(i => i.station === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedStation(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    selectedStation === key ? 'bg-blue-600 text-white' : fullscreen ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <config.icon size={12} />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${fullscreen ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-600'}`}
          >
            {fullscreen ? 'Keluar' : 'Layar Penuh'}
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 ${fullscreen ? 'text-slate-400' : 'text-slate-400'}`}>
          <ChefHat size={64} />
          <p className="mt-4 text-lg font-medium">Tidak ada pesanan</p>
          <p className="text-sm">Pesanan baru akan muncul di sini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredItems.map(item => {
            const elapsed = getElapsedTime(item.createdAt);
            const isUrgent = elapsed > 15;
            const station = stationConfig[item.station];

            return (
              <div
                key={item.id}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isUrgent ? 'border-red-400 shadow-lg shadow-red-100' : 'border-slate-200'
                } ${fullscreen ? 'bg-slate-800' : 'bg-white'}`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${station.color} px-4 py-2 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <station.icon size={14} className="text-white" />
                    <span className="text-xs font-bold text-white">{station.label}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                    isUrgent ? 'bg-red-600 animate-pulse' : 'bg-white/20'
                  }`}>
                    <Clock size={10} />
                    {elapsed} mnt
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${fullscreen ? 'text-white' : 'text-slate-800'}`}>
                      #{item.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      fullscreen ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Meja {item.tableId ? item.tableId.replace('t', '') : 'TA'}
                    </span>
                  </div>

                  <div className={`mb-3 ${fullscreen ? 'text-white' : 'text-slate-800'}`}>
                    <p className="text-lg font-bold">{item.quantity}× {item.menuItem.name}</p>
                    {item.notes && (
                      <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    {getNextStatus(item.status) && (
                      <button
                        onClick={() => handleStatusChange(item.orderId, item.id, item.status)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-md"
                      >
                        <Check size={12} />
                        {statusLabels[getNextStatus(item.status)!]}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${fullscreen ? '' : ''}`}>
        {(['new', 'accepted', 'preparing', 'ready'] as const).map(status => {
          const count = filteredItems.filter(i => i.status === status).length;
          return (
            <div key={status} className={`rounded-lg p-3 text-center ${fullscreen ? 'bg-slate-800' : 'bg-white border border-slate-100'}`}>
              <p className={`text-2xl font-bold ${fullscreen ? 'text-white' : 'text-slate-800'}`}>{count}</p>
              <p className={`text-xs font-medium ${statusColors[status]} px-2 py-0.5 rounded-full inline-block text-white`}>
                {statusLabels[status]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
