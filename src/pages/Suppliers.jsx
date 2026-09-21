import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Truck } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { SupplierTable } from '../components/tables'
import { EmptyState } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatCompactINR } from '../lib/format'

const FILTERS = ['All', 'Verified', 'Pending verification']

export default function Suppliers() {
  const navigate = useNavigate()
  const { suppliers, pushToast } = usePayments()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return suppliers.filter((s) => {
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      const matchesFilter = filter === 'All' || s.status === filter
      return matchesQuery && matchesFilter
    })
  }, [suppliers, query, filter])

  const totalOutflow = suppliers.reduce((sum, s) => sum + s.monthlyOutflow, 0)
  const outstanding = suppliers.reduce((sum, s) => sum + s.outstanding, 0)

  return (
    <div className="space-y-6">
      <header className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Suppliers</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Verified beneficiaries, payment history and what's outstanding — in one list.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            pushToast({
              tone: 'info',
              title: 'Add supplier',
              body: 'Bank account and UPI ID verification runs here in the full product.',
            })
          }
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Supplier
        </button>
      </header>

      <div className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <MetricCard value={suppliers.length} label="Active suppliers" sub="5 verified · 1 in verification" tone="sky" />
        <MetricCard value={formatCompactINR(totalOutflow)} label="Monthly outflow" sub="Across all suppliers" tone="violet" />
        <MetricCard value={formatCompactINR(outstanding)} label="Outstanding" sub="Unpaid invoices" tone="amber" />
      </div>

      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search suppliers"
              className="input h-10 py-0 pl-10 text-[14px]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  'rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
                  filter === f
                    ? 'bg-paytm-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <SupplierTable suppliers={filtered} onSelect={(s) => navigate(`/suppliers/${s.id}`)} />
        ) : (
          <EmptyState
            icon={Truck}
            title="No suppliers match your filters"
            body="Try a different search term or clear the status filter."
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setQuery('')
                  setFilter('All')
                }}
              >
                Clear filters
              </button>
            }
          />
        )}
      </section>
    </div>
  )
}
