import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Settings = () => {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="mt-2 text-sm text-slate-400">Configure system preferences and access controls.</p>
        </div>
        <Button variant="secondary">Save settings</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm font-semibold text-white">System Mode</p>
          <p className="mt-2 text-sm text-slate-400">Production</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm font-semibold text-white">Notifications</p>
          <p className="mt-2 text-sm text-slate-400">Email alerts enabled</p>
        </div>
      </div>
    </Card>
  )
}

export default Settings
