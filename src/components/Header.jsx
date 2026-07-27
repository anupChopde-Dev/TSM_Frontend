import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearTokens } from '../api/axiosClient'
import { toast } from 'react-toastify'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearTokens()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="w-full border border-slate-800 bg-slate-900/90  shadow-xl shadow-slate-950/20 backdrop-blur-xl transition-all duration-300 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-400">Dashboard</p>
          <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            Welcome back, ready for today?
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-700 bg-slate-950/90 text-slate-200 transition hover:border-cyan-400 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-white"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
