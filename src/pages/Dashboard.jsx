import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, BadgeIndianRupee, CalendarClock, CheckCircle2, ClipboardCheck,
  FileSpreadsheet, Plus, Receipt, Truck, UploadCloud, Users, Wallet, Zap,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { TransactionTable, UpcomingTable, ViewAllLink } from '../components/tables'
import { SectionHeader } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { categories, dashboardStats, suppliers } from '../data/mockData'
import { formatCompactINR, formatINR } from '../lib/format'

const ICONS = { Truck, Users, Zap, Wallet }

const CAT_TONES = {
  sky: { wrap: 'bg-paytm-50 text-paytm-navy', ring: 'group-hover:border-paytm-300' },
  emerald: { wrap: 'bg-emerald-50 text-emerald-600', ring: 'group-hover:border-emerald-300' },
  amber: { wrap: 'bg-amber-50 text-amber-600', ring: 'group-hover:border-amber-300' },
  violet: { wrap: 'bg-violet-50 text-violet-600', ring: 'group-hover:border-violet-300' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { transactions, upcoming, approvalQueue, startPayment } = usePayments()
  const recent = transactions.filter((t) => t.status === 'Successful').slice(0, 5)
  const pendingApprovals = dashboardStats.pendingApprovals + approvalQueue.length

  const handleUpcomingAction = (row) => {
    if (row.status === 'Pending Approval') {
      navigate('/approvals')
      return
    }
    const supplier = suppliers.find((s) => s.id === row.supplierId)
    if (supplier) {
      startPayment({
        supplierId: supplier.id,
        recipient: supplier.name,
        recipientShort: supplier.shortName,
        amount: row.amount,
        reference: row.invoice,
        category: 'Supplier',
        date: 'Today',
      })
      navigate('/pay/supplier')
    } else {
      navigate('/bills')
    }
  }

  return (
    <div className="space-y-7">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-paytm-navy p-7 text-white shadow-lift sm:p-9 animate-fade-up">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-paytm-sky/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-paytm-sky/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="chip bg-white/10 text-paytm-sky ring-1 ring-white/15">
              <BadgeIndianRupee className="h-3.5 w-3.5" />
              Outbound payments
            </span>
            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[38px]">
              Business Payments
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Pay suppliers, employees and bills from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/pay')}
                className="btn bg-paytm-sky px-5 py-3 text-sm font-bold text-paytm-navy shadow-[0_10px_30px_-12px_rgba(0,186,242,0.9)] transition hover:-translate-y-px hover:brightness-105"
              >
                <Plus className="h-4 w-4" />
                Make a Payment
              </button>
              <button
                type="button"
                onClick={() => navigate('/bulk-payments')}
                className="btn border border-white/25 bg-white/[0.08] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Payment File
              </button>
            </div>
          </div>

          {/* The 30-second pitch, on the screen itself. */}
          <div className="grid w-full max-w-md shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">Today, without Paytm</p>
              <ul className="mt-2.5 space-y-1.5 text-[12.5px] text-white/60">
                {['Bank app', 'UPI app', 'Excel sheet', 'Accountant follow-ups'].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-paytm-sky/40 bg-paytm-sky/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-paytm-sky">With Paytm Business</p>
              <ul className="mt-2.5 space-y-1.5 text-[12.5px] font-medium text-white/85">
                {['Create', 'Approve', 'Pay', 'Track & reconcile'].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-paytm-sky" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-white/10 pt-2.5 text-[11.5px] leading-snug text-white/55">
                Over UPI, NEFT &amp; RTGS — from your existing bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's overview */}
      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <SectionHeader title="Today's overview" subtitle="21 September 2026 · Sharma Industries Pvt. Ltd." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={BadgeIndianRupee}
            tone="sky"
            value={formatCompactINR(dashboardStats.paymentsToday)}
            label="Payments Today"
            sub="9 payments across UPI & NEFT"
            onClick={() => navigate('/transactions')}
          />
          <MetricCard
            icon={CalendarClock}
            tone="violet"
            value={formatCompactINR(dashboardStats.upcomingPayments)}
            label="Upcoming Payments"
            sub="Due in the next 7 days"
            trend={{ direction: 'up', value: '14%' }}
            onClick={() => navigate('/transactions')}
          />
          <MetricCard
            icon={ClipboardCheck}
            tone="amber"
            value={pendingApprovals}
            label="Pending Approvals"
            sub="Waiting on Anita Sharma"
            onClick={() => navigate('/approvals')}
          />
          <MetricCard
            icon={Receipt}
            tone="emerald"
            value={dashboardStats.paymentsThisMonth}
            label="Payments This Month"
            sub="46 auto-reconciled"
            onClick={() => navigate('/reconciliation')}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <SectionHeader
          title="Payment categories"
          subtitle="Paytm routes each one over the right rail automatically."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => {
            const Icon = ICONS[cat.icon]
            const tone = CAT_TONES[cat.tone]
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(cat.route)}
                className={`card group flex flex-col p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${tone.ring}`}
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tone.wrap}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[15px] font-bold text-ink-900">{cat.title}</p>
                <p className="num mt-1.5 text-[20px] font-extrabold tracking-tight text-ink-900">
                  {formatCompactINR(cat.pending)}
                  <span className="ml-1.5 text-[12.5px] font-semibold text-slate-500">pending</span>
                </p>
                <p className="mt-1 text-[12.5px] text-slate-500">{cat.count} payments queued</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-paytm-sky transition group-hover:gap-2.5">
                  {cat.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Upcoming + shortcuts */}
      <section className="grid grid-cols-1 gap-5 animate-fade-up xl:grid-cols-3" style={{ animationDelay: '180ms' }}>
        <div className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <SectionHeader title="Upcoming payments" subtitle="Approve or schedule before the due date." />
            <ViewAllLink to="/transactions" />
          </div>
          <UpcomingTable rows={upcoming} onPay={handleUpcomingAction} />
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-[15px] font-bold text-ink-900">Pay many at once</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Upload an Excel or CSV of supplier, salary or bill payments. Paytm validates every
              beneficiary before anything moves.
            </p>
            <button
              type="button"
              onClick={() => navigate('/bulk-payments')}
              className="btn-secondary mt-4 w-full"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Upload Payment File
            </button>
          </div>

          <div className="card bg-gradient-to-br from-paytm-50 to-white p-5">
            <p className="text-[15px] font-bold text-ink-900">Month to date</p>
            <dl className="mt-4 space-y-3">
              {[
                ['Paid this month', formatINR(1842000)],
                ['Auto-reconciled', '46 of 47'],
                ['Manual effort saved', '~9 hours'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-[13px] text-slate-600">{k}</dt>
                  <dd className="num text-[14px] font-bold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => navigate('/insights')}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-paytm-sky transition hover:gap-2.5"
            >
              View payment insights
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Recent payments */}
      <section className="card overflow-hidden animate-fade-up" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <SectionHeader title="Recent payments" subtitle="Settled over the rail Paytm selected." />
          <ViewAllLink to="/transactions" />
        </div>
        <TransactionTable transactions={recent} />
      </section>
    </div>
  )
}
