import React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20', className)} {...props}>
    {children}
  </div>
))
Card.displayName = 'Card'

export default Card
