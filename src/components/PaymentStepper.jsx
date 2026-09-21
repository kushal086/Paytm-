import { Check } from 'lucide-react'

const STEPS = ['Recipient', 'Details', 'Review', 'Approval', 'Paid']

export default function PaymentStepper({ current = 0, className = '' }) {
  return (
    <ol className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300',
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-paytm-navy text-white ring-4 ring-paytm-navy/10'
                      : 'bg-slate-200 text-slate-500',
                ].join(' ')}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={[
                  'hidden truncate text-[13px] font-semibold sm:block',
                  active ? 'text-ink-900' : done ? 'text-emerald-700' : 'text-slate-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  done ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
