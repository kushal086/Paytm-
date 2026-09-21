import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Clock, FileText } from 'lucide-react'
import { formatCompactINR, formatINR } from '../lib/format'
import { railBadgeClass, RAILS } from '../lib/rails'
import { Avatar, StatusPill } from './ui'

export function RailBadge({ rail }) {
  const meta = RAILS[rail]
  return (
    <span className={`chip border ${railBadgeClass(rail)}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta?.dot || 'bg-slate-400'}`} />
      {rail}
    </span>
  )
}

export function TableShell({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[640px] border-collapse">{children}</table>
    </div>
  )
}

export function SupplierTable({ suppliers, onSelect }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/60">
          <th className="th">Supplier</th>
          <th className="th text-right">Last Payment</th>
          <th className="th text-right">Monthly Outflow</th>
          <th className="th">Status</th>
          <th className="th" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {suppliers.map((s) => (
          <tr
            key={s.id}
            className="row-hover cursor-pointer"
            onClick={() => onSelect?.(s)}
          >
            <td className="td">
              <div className="flex items-center gap-3">
                <Avatar name={s.shortName} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{s.shortName}</p>
                  <p className="truncate text-[12.5px] text-slate-500">{s.category}</p>
                </div>
              </div>
            </td>
            <td className="td num text-right">
              <p className="font-semibold">{formatCompactINR(s.lastPayment)}</p>
              <p className="text-[12.5px] font-normal text-slate-500">{s.lastPaymentDate}</p>
            </td>
            <td className="td num text-right font-semibold">{formatCompactINR(s.monthlyOutflow)}</td>
            <td className="td">
              <StatusPill
                status={s.status}
                icon={s.status === 'Verified' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              />
            </td>
            <td className="td text-right">
              <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:text-paytm-sky" />
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

export function TransactionTable({ transactions, compact = false }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/60">
          <th className="th">Date</th>
          <th className="th">Recipient</th>
          {!compact && <th className="th">Type</th>}
          <th className="th text-right">Amount</th>
          <th className="th">Rail</th>
          <th className="th">Status</th>
          {!compact && <th className="th">UTR</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <tr key={t.id} className={`row-hover ${t.isNew ? 'bg-emerald-50/40' : ''}`}>
            <td className="td whitespace-nowrap text-slate-600">{t.date}</td>
            <td className="td">
              <div className="flex items-center gap-3">
                <Avatar name={t.recipient} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{t.recipient}</p>
                  {t.invoice && t.invoice !== '—' && (
                    <p className="truncate text-[12px] text-slate-500">{t.invoice}</p>
                  )}
                </div>
              </div>
            </td>
            {!compact && (
              <td className="td">
                <span className="chip bg-slate-100 text-slate-600">{t.type}</span>
              </td>
            )}
            <td className="td num text-right font-semibold">{formatINR(t.amount)}</td>
            <td className="td"><RailBadge rail={t.rail} /></td>
            <td className="td"><StatusPill status={t.status} /></td>
            {!compact && (
              <td className="td num text-[12.5px] text-slate-500">{t.utr}</td>
            )}
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

export function UpcomingTable({ rows, onPay }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/60">
          <th className="th">Recipient</th>
          <th className="th text-right">Amount</th>
          <th className="th">Due</th>
          <th className="th">Status</th>
          <th className="th" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((r) => (
          <tr key={r.id} className="row-hover">
            <td className="td">
              <div className="flex items-center gap-3">
                <Avatar name={r.recipient} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">{r.recipient}</p>
                  <p className="truncate text-[12px] text-slate-500">{r.invoice}</p>
                </div>
              </div>
            </td>
            <td className="td num text-right font-semibold">{formatINR(r.amount)}</td>
            <td className="td">
              <span className={r.due === 'Today' ? 'font-semibold text-amber-700' : 'text-slate-600'}>
                {r.due}
              </span>
            </td>
            <td className="td"><StatusPill status={r.status} /></td>
            <td className="td text-right">
              <button
                type="button"
                onClick={() => onPay?.(r)}
                className="btn rounded-lg border border-slate-300 px-3 py-1.5 text-[12.5px] font-bold text-paytm-navy transition hover:border-paytm-sky hover:bg-paytm-50"
              >
                {r.status === 'Pending Approval' ? 'Review' : 'Pay now'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

export function ReconciliationTable({ rows }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/60">
          <th className="th">Invoice</th>
          <th className="th">Recipient</th>
          <th className="th text-right">Amount</th>
          <th className="th">Payment</th>
          <th className="th">Reconciliation</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((r) => (
          <tr key={r.id} className={`row-hover ${r.isNew ? 'bg-emerald-50/40' : ''}`}>
            <td className="td">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="num font-semibold text-ink-900">{r.id}</p>
                  <p className="text-[12px] text-slate-500">{r.date}</p>
                </div>
              </div>
            </td>
            <td className="td text-ink-900">{r.recipient}</td>
            <td className="td num text-right font-semibold">{formatINR(r.amount)}</td>
            <td className="td"><RailBadge rail={r.rail} /></td>
            <td className="td">
              <div className="flex flex-col gap-1">
                <StatusPill
                  status={r.reconciliation}
                  className="w-fit"
                  icon={r.reconciliation === 'Matched' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                />
                <span className="text-[11.5px] text-slate-400">{r.note}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

export function ViewAllLink({ to, children = 'View all' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[13px] font-bold text-paytm-sky transition hover:text-paytm-navy"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  )
}
