import React from 'react'
import Header from '../../components/Header'
import UserTaskBoard from './UserTaskBoard'

const UserDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Header />
        <main className="mt-6">
          <UserTaskBoard />
        </main>
      </div>
    </div>
  )
}

export default UserDashboardLayout
