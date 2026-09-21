import { useState } from 'react'
import { Check, Clock, IndianRupee, Info, Route } from 'lucide-react'
import { RAILS, recommendRail } from '../lib/rails'
import { Modal } from './ui'

/**
 * The rail is deliberately quiet. The merchant is paying a supplier —
 * which network carries the money is Paytm's problem, shown for confidence
 * and overridable, never asked for up front.
 */
export default function PaymentRailRecommendation({ amount, rail, onChange, compact = false }) {
  const [picking, setPicking] = useState(false)
  const recommended = recommendRail(amount)
  const active = rail && RAILS[rail] ? { ...RAILS[rail], reason: rail === recommended.id ? recommended.reason : 'Selected manually for this payment.' } : recommended
  const isOverridden = rail && rail !== recommended.id

  if (compact) {
    return (
      <span className={`chip border ${active.tone}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${active.dot}`} />
        {active.name}
      </span>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
            <Route className="h-3.5 w-3.5" />
            Recommended payment method
          </div>
          {onChange && (
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="text-[13px] font-bold text-paytm-sky transition hover:text-paytm-navy"
            >
              Change
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="num text-[26px] font-extrabold leading-none tracking-tight text-ink-900">
            {active.name}
          </span>
          <span className={`chip border ${active.tone}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${active.dot}`} />
            {isOverridden ? 'Chosen by you' : 'Chosen by Paytm'}
          </span>
        </div>

        <p className="mt-2 flex items-start gap-2 text-[13.5px] leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          {active.reason}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
          <div>
            <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
              <Clock className="h-3 w-3" />
              Estimated arrival
            </p>
            <p className="mt-1 text-[15px] font-bold text-ink-900">{active.arrival}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
              <IndianRupee className="h-3 w-3" />
              Fee
            </p>
            <p className="mt-1 text-[15px] font-bold text-ink-900">{active.fee}</p>
          </div>
        </div>
      </div>

      <Modal
        open={picking}
        onClose={() => setPicking(false)}
        title="Change payment method"
        subtitle="Paytm picks the right rail for you. You can override it for this payment."
      >
        <div className="space-y-2.5">
          {Object.values(RAILS).map((r) => {
            const selected = active.id === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onChange?.(r.id)
                  setPicking(false)
                }}
                className={[
                  'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
                  selected
                    ? 'border-paytm-sky bg-paytm-50/60 shadow-ring'
                    : 'border-slate-200 hover:border-paytm-200 hover:bg-slate-50',
                ].join(' ')}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    selected ? 'border-paytm-sky bg-paytm-sky' : 'border-slate-300'
                  }`}
                >
                  {selected && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-bold text-ink-900">{r.name}</span>
                    {r.id === recommended.id && (
                      <span className="chip bg-emerald-50 text-emerald-700">Recommended</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-slate-500">{r.fullName}</span>
                  <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-600">
                    <span>Arrives {r.arrival.toLowerCase()}</span>
                    <span>Fee {r.fee}</span>
                  </span>
                  <span className="mt-1 block text-[11.5px] text-slate-400">{r.limit}</span>
                </span>
              </button>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
