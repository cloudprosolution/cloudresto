import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import Kitchen from './pages/Kitchen';
import MenuPage from './pages/Menu';
import Inventory from './pages/Inventory';
import Purchasing from './pages/Purchasing';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import SettingsPage from './pages/Settings';
import GuidePage from './pages/Guide';
import { BookOpen, ArrowRight } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isGuide = location.pathname === '/guide';

  if (isGuide) {
    return <GuidePage />;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm shadow-md relative z-50">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <BookOpen size={16} />
          <span className="font-medium">👋 Developer Laravel? Baca panduan lengkap struktur folder & IDE di sini:</span>
          <Link
            to="/guide"
            className="inline-flex items-center gap-1 px-3 py-1 bg-white text-amber-600 rounded-full text-xs font-bold hover:bg-amber-50 transition-colors"
          >
            Buka Panduan <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchasing" element={<Purchasing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
