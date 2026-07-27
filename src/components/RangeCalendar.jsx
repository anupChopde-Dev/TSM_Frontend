import React, { useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameMonth, isSameDay, isBefore, isAfter } from 'date-fns'

const WeekHeader = () => {
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa']
  return (
    <div className="grid grid-cols-7 text-xs text-slate-400 mb-2">
      {days.map(d => <div key={d} className="text-center">{d}</div>)}
    </div>
  )
}

const RangeCalendar = ({ selected = { from: undefined, to: undefined }, onSelect }) => {
  const [viewMonth, setViewMonth] = useState(selected.from || new Date())

  const start = startOfWeek(startOfMonth(viewMonth))
  const end = endOfWeek(endOfMonth(viewMonth))

  const days = []
  for (let dt = start; dt <= end; dt = addDays(dt, 1)) {
    days.push(dt)
  }

  function clickDay(d) {
    const { from, to } = selected || {}
    if (!from || (from && to)) {
      onSelect({ from: d, to: undefined })
      return
    }
    // from exists and to not set
    if (isBefore(d, from)) {
      onSelect({ from: d, to: undefined })
      return
    }
    onSelect({ from, to: d })
  }

  function dayClass(d) {
    const { from, to } = selected || {}
    if (from && isSameDay(d, from) && !to) return 'day-selected'
    if (from && isSameDay(d, from)) return 'day-range-start'
    if (to && isSameDay(d, to)) return 'day-range-end'
    if (from && to && (isAfter(d, from) && isBefore(d, to))) return 'day-range-middle'
    return ''
  }

  return (
    <div className="w-[560px]">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setViewMonth(subMonths(viewMonth,1))} className="text-slate-300 px-2 py-1 rounded hover:bg-slate-800">‹</button>
        <div className="text-md text-slate-200 font-medium">{format(viewMonth, 'MMMM yyyy')}</div>
        <button type="button" onClick={() => setViewMonth(addMonths(viewMonth,1))} className="text-slate-300 px-2 py-1 rounded hover:bg-slate-800">›</button>
      </div>

      <WeekHeader />

      <div className="grid grid-cols-7 gap-2 w-full">
        {days.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => clickDay(d)}
            className={`rc-day text-sm h-12 w-12 inline-flex items-center justify-center ${!isSameMonth(d, viewMonth) ? 'opacity-40' : ''} ${dayClass(d)}`}
          >
            {format(d, 'd')}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RangeCalendar
