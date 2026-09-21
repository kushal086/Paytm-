import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Search, Sparkles } from 'lucide-react'
import { ReconciliationTable } from '../components/tables'
import { EmptyState, ProgressBar, ProgressRing, SectionHeader } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { reconciliationSummary, seedMatchedCount } from '../data/mockData'
import { formatCompactINR, formatINR } from '../lib/format'

const FILTERS = ['All', 'Matched', 'Pending']

export default function Reconciliation() {
  const { invoices, pushToast } = usePayments()
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  const matched = invoices.filter((i) => i.reconciliation === 'Matched').length
  const pending = invoices.length - matched

  // The seeded month has 47 payments; the prototype only lists the notable
  // invoices, so the headline counts track the seeded month plus live changes.
  const totalPayments = reconciliationSummary.payments
  const reconciled = Math.min(
    totalPayments,
    reconciliationSummary.reconciled + Math.max(0, matched - seedMatchedCount),
  )
  const stillPending = Math.max(0, totalPayments - reconciled)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return invoices.filter((i) => {
      const filterOk = filter === 'All' || i.reconciliation === filter
      const queryOk = !q || i.id.toLowerCase().includes(q) || i.recipient.toLowerCase().includes(q)
      return filterOk && queryOk
    })
  }, [invoices, filter, query])

  return (
    <div className="space-y-6">
      <header className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Reconciliation</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-500">
            Every payment is matched back to its invoice automatically — the work that
            normally happens in a spreadsheet at the end of the month.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            pushToast({
              tone: 'success',
              title: 'Report downloaded',
              body: 'reconciliation-sep-2026.xlsx',
            })
          }
          className="btn-primary"
        >
          <Download className="h-4 w-4" />
          Download Reconciliation Report
        </button>
      </header>

      {/* Month summary */}
      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '60ms' }}>
        <div className="grid grid-cols-1 gap-6 p-6 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
          <div className="flex items-center gap-6">
            <ProgressRing
              value={reconciled}
              total={totalPayments}
              label={`${Math.round((reconciled / totalPayments) * 100)}%`}
              sublabel="Matched"
            />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
                {reconciliationSummary.month}
              </p>
              <p className="num mt-1.5 text-[30px] font-extrabold leading-none tracking-tight text-ink-900">
                {reconciled} / {totalPayments}
              </p>
              <p className="mt-1.5 text-[13.5px] text-slate-500">payments reconciled</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {reconciled} reconciled
                </span>
                {stillPending > 0 && (
                  <span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {stillPending} pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:border-l lg:border-slate-100 lg:pl-10">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {[
                ['Payments', totalPayments],
                ['Value', formatCompactINR(reconciliationSummary.value)],
                ['Manual effort saved', '~9 hrs'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">{k}</p>
                  <p className="num mt-1 text-[22px] font-extrabold tracking-tight text-ink-900">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-ink-700">{reconciled} / {totalPayments} reconciled</span>
                <span className="text-slate-500">{Math.round((reconciled / totalPayments) * 100)}%</span>
              </div>
              <ProgressBar value={reconciled} total={totalPayments} />
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-paytm-200 bg-paytm-50/60 p-3.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-paytm-sky" />
              <p className="text-[12.5px] leading-relaxed text-paytm-navy">
                Paytm matches UTR, amount and invoice reference. Anything it can't match is
                flagged for your accountant instead of being missed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice table */}
      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
          <SectionHeader title="Invoices & payments" subtitle="Matched automatically as each payment settles." />
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoice"
                className="input h-10 py-0 pl-10 text-[14px]"
              />
            </div>
            <div className="flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={[
                    'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
                    filter === f ? 'bg-paytm-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  ].join(' ')}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length ? (
          <ReconciliationTable rows={filtered} />
        ) : (
          <EmptyState
            icon={FileSpreadsheet}
            title="No invoices match"
            body="Clear the filter or search for a different invoice number."
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFilter('All')
                  setQuery('')
                }}
              >
                Clear filters
              </button>
            }
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4">
          <p className="text-[13px] text-slate-600">
            <span className="num font-bold text-ink-900">{matched}</span> of{' '}
            <span className="num font-bold text-ink-900">{invoices.length}</span> listed invoices matched
            {pending > 0 && ` · ${pending} awaiting payment`}
          </p>
          <p className="num text-[13px] font-semibold text-ink-900">
            {formatINR(invoices.reduce((sum, i) => sum + i.amount, 0))} across listed invoices
          </p>
        </div>
      </section>
    </div>
  )
}
