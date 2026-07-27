import React from 'react'
import { cn } from '../../lib/utils'

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <table ref={ref} className={cn('min-w-full border-collapse text-left text-sm text-slate-200', className)} {...props} />
))
Table.displayName = 'Table'

export const TableHeader = ({ className, ...props }) => (
  <thead className={cn('bg-slate-950/80', className)} {...props} />
)

export const TableBody = ({ className, ...props }) => (
  <tbody className={cn('divide-y divide-slate-800', className)} {...props} />
)

export const TableRow = ({ className, ...props }) => (
  <tr className={cn('transition hover:bg-slate-800/40', className)} {...props} />
)

export const TableHead = ({ className, ...props }) => (
  <th className={cn('px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400', className)} {...props} />
)

export const TableCell = ({ className, ...props }) => (
  <td className={cn('px-6 py-4 text-sm text-slate-300', className)} {...props} />
)
