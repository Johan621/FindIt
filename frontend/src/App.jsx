import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import SearchItems from './pages/SearchItems';
import AdminPanel from './pages/AdminPanel';
import ItemDetail from './pages/ItemDetail';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;