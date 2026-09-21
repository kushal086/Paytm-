import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, ListChecks, Receipt, Search } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { TransactionTable } from '../components/tables'
import { EmptyState, SectionHeader } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatCompactINR } from '../lib/format'

const FILTER_GROUPS = [
  { label: 'Category', key: 'type', options: ['All', 'Supplier', 'Salary', 'Bills'] },
  { label: 'Rail', key: 'rail', options: ['All', 'UPI', 'NEFT', 'RTGS'] },
  { label: 'Status', key: 'status', options: ['All', 'Successful', 'Pending', 'Failed'] },
]

// The table calls utility payments "Utility"; the filter chip says "Bills".
const TYPE_ALIASES = { Bills: ['Utility'], Supplier: ['Supplier'], Salary: ['Salary'] }

export default function Transactions() {
  const navigate = useNavigate()
  const { transactions, pushToast } = usePayments()
  const [filters, setFilters] = useState({ type: 'All', rail: 'All', status: 'All' })
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((t) => {
      const typeOk =
        filters.type === 'All' || (TYPE_ALIASES[filters.type] || [filters.type]).includes(t.type)
      const railOk = filters.rail === 'All' || t.rail === filters.rail
      const statusOk = filters.status === 'All' || t.status === filters.status
      const queryOk =
        !q ||
        t.recipient.toLowerCase().includes(q) ||
        String(t.utr).toLowerCase().includes(q) ||
        String(t.invoice).toLowerCase().includes(q)
      return typeOk && railOk && statusOk && queryOk
    })
  }, [transactions, filters, query])

  const totals = useMemo(() => {
    const success = filtered.filter((t) => t.status === 'Successful')
    return {
      count: filtered.length,
      value: success.reduce((sum, t) => sum + t.amount, 0),
      pending: filtered.filter((t) => t.status === 'Pending').length,
      failed: filtered.filter((t) => t.status === 'Failed').length,
    }
  }, [filtered])

  const resetFilters = () => {
    setFilters({ type: 'All', rail: 'All', status: 'All' })
    setQuery('')
  }

  return (
    <div className="space-y-6">
      <header className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Transactions</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Every outbound payment, across every rail, with its UTR.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              pushToast({ tone: 'success', title: 'Statement exported', body: 'transactions-sep-2026.xlsx' })
            }
            className="btn-secondary"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button type="button" onClick={() => navigate('/reconciliation')} className="btn-primary">
            <ListChecks className="h-4 w-4" />
            Reconciliation
          </button>
        </div>
      </header>

      <div className="grid animate-fade-up grid-cols-2 gap-4 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
        <MetricCard value={totals.count} label="Payments shown" sub="Matching your filters" tone="sky" />
        <MetricCard value={formatCompactINR(totals.value)} label="Value settled" sub="Successful payments only" tone="emerald" />
        <MetricCard value={totals.pending} label="Pending" sub="Awaiting settlement" tone="amber" />
        <MetricCard value={totals.failed} label="Failed" sub="Needs a retry" tone="rose" />
      </div>

      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="space-y-4 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader title="All transactions" subtitle={`${filtered.length} of ${transactions.length} payments`} />
            <div className="relative min-w-0 flex-1 sm:max-w-[280px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipient, UTR or invoice"
                className="input h-10 py-0 pl-10 text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {FILTER_GROUPS.map((group) => (
              <div key={group.key} className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </span>
                {group.options.map((opt) => {
                  const active = filters[group.key] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, [group.key]: opt }))}
                      className={[
                        'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
                        active
                          ? 'bg-paytm-navy text-white shadow-[0_6px_14px_-8px_rgba(1,41,112,0.9)]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                      ].join(' ')}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <TransactionTable transactions={filtered} />
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions match these filters"
            body="Try clearing a filter or searching for a different recipient."
            action={
              <button type="button" className="btn-secondary" onClick={resetFilters}>
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </div>
  )
}
