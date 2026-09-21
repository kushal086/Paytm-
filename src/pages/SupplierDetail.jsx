import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Banknote, CalendarClock, CheckCircle2, CreditCard, Phone,
  Receipt, Send, ShieldCheck, Smartphone,
} from 'lucide-react'
import { RailBadge, TableShell } from '../components/tables'
import { Avatar, EmptyState, SectionHeader, StatusPill } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatCompactINR, formatINR } from '../lib/format'

export default function SupplierDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { suppliers, startPayment } = usePayments()
  const supplier = suppliers.find((s) => s.id === id)

  if (!supplier) {
    return (
      <div className="card mx-auto max-w-2xl">
        <EmptyState
          icon={Receipt}
          title="Supplier not found"
          body="This supplier isn't in the prototype's list."
          action={<Link to="/suppliers" className="btn-primary">Back to Suppliers</Link>}
        />
      </div>
    )
  }

  const payNow = () => {
    startPayment({
      supplierId: supplier.id,
      recipient: supplier.name,
      recipientShort: supplier.shortName,
      amount: supplier.outstanding || 0,
      reference: supplier.upcoming?.invoice || '',
      category: 'Supplier',
      date: 'Today',
      bank: supplier.bank,
      accountNumber: supplier.accountNumber,
      ifsc: supplier.ifsc,
    })
    navigate('/pay/supplier')
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/suppliers')}
        className="inline-flex animate-fade-up items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All suppliers
      </button>

      <header className="card animate-fade-up p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={supplier.shortName} size="xl" />
            <div className="min-w-0">
              <h1 className="text-[24px] font-extrabold tracking-tight text-ink-900">{supplier.name}</h1>
              <p className="mt-1 text-[14px] text-slate-500">
                {supplier.category} · Paying since {supplier.since}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <StatusPill
                  status={supplier.status}
                  icon={supplier.status === 'Verified' ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                />
                <span className="chip bg-slate-100 text-slate-600">GSTIN {supplier.gstin}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={payNow} className="btn-primary">
              <Send className="h-4 w-4" />
              Pay this supplier
            </button>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">
          {[
            ['Last payment', formatINR(supplier.lastPayment), supplier.lastPaymentDate],
            ['Monthly outflow', formatCompactINR(supplier.monthlyOutflow), 'Average, last 6 months'],
            ['Outstanding', formatINR(supplier.outstanding), supplier.outstanding ? 'Unpaid invoices' : 'All settled'],
          ].map(([k, v, note]) => (
            <div key={k}>
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
              <dd className="num mt-1 text-[22px] font-extrabold tracking-tight text-ink-900">{v}</dd>
              <p className="mt-0.5 text-[12.5px] text-slate-500">{note}</p>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="animate-fade-up space-y-5 lg:col-span-2" style={{ animationDelay: '120ms' }}>
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <SectionHeader title="Payment history" subtitle="Every payment, with the rail it used." />
            </div>
            <TableShell>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="th">Date</th>
                  <th className="th">Invoice</th>
                  <th className="th text-right">Amount</th>
                  <th className="th">Rail</th>
                  <th className="th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplier.history.map((h) => (
                  <tr key={h.id} className="row-hover">
                    <td className="td whitespace-nowrap text-slate-600">{h.date}</td>
                    <td className="td num font-semibold">{h.invoice}</td>
                    <td className="td num text-right font-semibold">{formatINR(h.amount)}</td>
                    <td className="td"><RailBadge rail={h.rail} /></td>
                    <td className="td"><StatusPill status={h.status} /></td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          </section>

          <section className="card p-6">
            <SectionHeader title="Outstanding & upcoming" />
            {supplier.upcoming ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600">
                    <CalendarClock className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-ink-900">
                      {supplier.upcoming.invoice} · due {supplier.upcoming.due}
                    </p>
                    <p className="text-[12.5px] text-slate-600">Not yet paid</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="num text-[18px] font-extrabold text-ink-900">
                    {formatINR(supplier.upcoming.amount)}
                  </span>
                  <button type="button" onClick={payNow} className="btn-sky px-4 py-2 text-[13px]">
                    Pay now
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-[13.5px] font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Nothing outstanding with this supplier.
              </p>
            )}
          </section>
        </div>

        <aside className="animate-fade-up space-y-5" style={{ animationDelay: '180ms' }}>
          <section className="card p-6">
            <SectionHeader title="Bank account" />
            <div className="mt-4 space-y-3.5">
              {[
                [Banknote, 'Bank', supplier.bank],
                [CreditCard, 'Account number', supplier.accountNumber],
                [Receipt, 'IFSC', supplier.ifsc],
                [Smartphone, 'UPI ID', supplier.upiId],
              ].map(([Icon, k, v]) => (
                <div key={k} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">{k}</p>
                    <p className="num truncate text-[13.5px] font-semibold text-ink-900">{v}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-[12.5px] leading-relaxed text-emerald-800">
                {supplier.status === 'Verified'
                  ? 'Account name matched with bank records. Payments to this beneficiary are safe to approve.'
                  : 'Penny-drop verification is in progress. Payments can be created but need extra approval.'}
              </p>
            </div>
          </section>

          <section className="card p-6">
            <SectionHeader title="Contact" />
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={supplier.contact} size="md" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-ink-900">{supplier.contact}</p>
                <p className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                  <Phone className="h-3 w-3" />
                  {supplier.phone}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
