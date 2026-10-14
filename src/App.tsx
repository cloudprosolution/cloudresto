import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppProvider>
  );
}
