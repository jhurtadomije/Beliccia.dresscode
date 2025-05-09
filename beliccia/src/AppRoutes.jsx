import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import App from './App';
import Novias from './pages/Novias';
import Accesorios from './pages/Accesorios';
import Invitadas from './pages/Invitadas';
import Visitanos from './pages/Visitanos';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="novias" element={<Novias />} />
        <Route path="accesorios" element={<Accesorios />} />
        <Route path="invitadas" element={<Invitadas />} />
        <Route path="visitanos" element={<Visitanos />} />
      </Route>
    </Routes>
  );
}
