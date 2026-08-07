import React, { useState } from 'react'
import { Menu, LayoutGrid, Users as UsersIcon, BarChart3, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearTokens } from '../../api/axiosClient'
import { toast } from 'react-toastify'
import Button from '../../components/ui/Button'
import ProjectList from './ProjectList'
import Users from './Users'
import Reports from './Reports'
import TaskList from './TaskList'

const navItems = [
  // { id: 'overview', label: 'Overview', icon: <LayoutGrid size={18} /> },
  { id: 'users', label: 'Users', icon: <UsersIcon size={18} /> },
  { id: 'projects', label: 'Projects', icon: <LayoutGrid size={18} /> },
  { id: 'tasks', label: 'Task List', icon: <SettingsIcon size={18} /> },
  // { id: 'reports', label: 'Reports', icon: <BarChart3 size={18} /> },
]

const AdminDashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('users')
  const navigate = useNavigate()

  const handleLogout = () => {
    clearTokens()
    localStorage.removeItem('isAdmin')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-slate-900 border-r border-slate-800 transition-all duration-300`}>
          <div className="flex h-20 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <LayoutGrid size={20} />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin</p>
                  <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 text-slate-200 transition hover:border-cyan-400"
            >
              <Menu size={18} />
            </button>
          </div>

          <nav className="mt-6 space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  activeItem === item.id
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {!collapsed && item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-800 px-4 py-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-500/10 px-3 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20"
            >
              <LogOut size={18} />
              {!collapsed && 'Sign Out'}
            </button>
          </div>
        </aside>

         <main className="flex h-screen flex-1 flex-col overflow-hidden px-2">
      {/* Scrollable Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Header */}
        {/* <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Admin Panel
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back, Administrator
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage users, reports, settings, and system activity from one
              place.
            </p>
          </div>
        </div> */}

        {/* Stats */}
      

        {/* <section className="mt-3 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Users
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">1,268</h2>

            <p className="mt-2 text-sm text-slate-400">
              Active users in the last 30 days
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Reports
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">56</h2>

            <p className="mt-2 text-sm text-slate-400">
              Issues and task reports pending review
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Server
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">Stable</h2>

            <p className="mt-2 text-sm text-slate-400">
              All monitored services are healthy
            </p>
          </div>
        </section> */}

        {/* Dynamic Content */}
        <section className="mt-3 flex-1 rounded-t-3xl border border-slate-800 bg-slate-900/80 p-4">
          {activeItem === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-white">
                Admin Overview
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Use the sidebar to switch between admin sections. This area can
                be replaced with dynamic content or child routes.
              </p>
            </div>
          )}

          {activeItem === "users" && <Users />}
          {activeItem === "projects" && <ProjectList />}
          {activeItem === "tasks" && <TaskList />}

          {activeItem === "reports" && <Reports />}

        </section>
      </div>
    </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
