import React from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const reports = [
  { id: 'r1', title: 'Weekly Summary', status: 'Pending' },
  { id: 'r2', title: 'Server Uptime', status: 'Completed' },
  { id: 'r3', title: 'User Audit', status: 'In review' },
]

const Reports = () => {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Reports</h2>
          <p className="mt-2 text-sm text-slate-400">Review the latest system and user reports.</p>
        </div>
        <Button variant="secondary">Generate report</Button>
      </div>

      <div className="mt-6 space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">{report.title}</p>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">{report.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default Reports
