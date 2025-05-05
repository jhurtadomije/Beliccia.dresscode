import { Routes, Route } from 'react-router-dom';
import Contact from './components/Contact';
import App from './App';
import Novias from './pages/Novias';
import Madrinas from './pages/Madrinas';
import Invitadas from './pages/Invitadas';
import Visitanos from './pages/Visitanos';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/visitanos" element={<Visitanos />} />
      <Route path="/novias" element={<Novias />} />
      <Route path="/madrinas" element={<Madrinas />} />
      <Route path="/invitadas" element={<Invitadas />} />
    </Routes>
  );
}
