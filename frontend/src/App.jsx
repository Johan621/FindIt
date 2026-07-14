import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ReportItem = lazy(() => import('./pages/ReportItem'));
const SearchItems = lazy(() => import('./pages/SearchItems'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const ItemDetail = lazy(() => import('./pages/ItemDetail'));
const Reports = lazy(() => import('./pages/Reports'));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center px-6">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full border-2 border-cyan-400/30 border-t-cyan-300 animate-spin" />
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Loading view</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/items/:id"
              element={
                <ProtectedRoute>
                  <ItemDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </AuthProvider>
  );
}

export default App;