import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth.jsx';
import { Shell } from './components/Shell.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { NotePage } from './pages/NotePage.jsx';
import { Register } from './pages/Register.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/notes/:id" element={<NotePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
