import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Auth/Login/Login'
import Signup from './Auth/Singup/Signup'
import UserDashboardLayout from './Pages/User/UserDashboardLayout'
import AdminDashboardLayout from './Pages/Admin/AdminDashboardLayout.jsx'
import RequireAuth from './authGuard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<RequireAuth requireUser><UserDashboardLayout /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth requireAdmin><AdminDashboardLayout /></RequireAuth>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
