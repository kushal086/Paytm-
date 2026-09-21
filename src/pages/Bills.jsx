import { useState } from 'react'
import {
  Building2, CalendarClock, CheckCircle2, Droplets, Loader2, Plus,
  ShieldCheck, Smartphone, Wifi, Zap,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { Modal, SectionHeader, StatusPill } from '../components/ui'
import PaymentRailRecommendation from '../components/PaymentRailRecommendation'
import { usePayments } from '../context/PaymentsContext'
import { formatCompactINR, formatINR } from '../lib/format'
import { recommendRail } from '../lib/rails'

const ICONS = { Zap, Wifi, Building2, Smartphone, ShieldCheck, Droplets }

const TONES = {
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-paytm-50 text-paytm-navy',
  violet: 'bg-violet-50 text-violet-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
}

export default function Bills() {
  const { bills, payBill, pushToast } = usePayments()
  const [confirming, setConfirming] = useState(null)
  const [processing, setProcessing] = useState(false)

  const due = bills.filter((b) => b.status === 'Due')
  const dueTotal = due.reduce((sum, b) => sum + b.amount, 0)
  const scheduledTotal = bills
    .filter((b) => b.status === 'Scheduled')
    .reduce((sum, b) => sum + b.amount, 0)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      payBill(confirming)
      setProcessing(false)
      setConfirming(null)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <header className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Bills &amp; Utilities</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Electricity, internet, rent and more — paid over the cheapest rail that fits.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            pushToast({ tone: 'info', title: 'Add a biller', body: 'Connect a new biller account to pay it here.' })
          }
          className="btn-secondary"
        >
          <Plus className="h-4 w-4" />
          Add Biller
        </button>
      </header>

      <div className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <MetricCard icon={CalendarClock} tone="amber" value={formatINR(dueTotal)} label="Due this week" sub={`${due.length} bills`} />
        <MetricCard icon={CheckCircle2} tone="sky" value={formatCompactINR(scheduledTotal)} label="Scheduled" sub="Auto-paid on due date" />
        <MetricCard icon={Zap} tone="emerald" value={bills.length} label="Connected billers" sub="Electricity, internet, rent & more" />
      </div>

      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <SectionHeader
          title="Your billers"
          subtitle="Small bills go out over UPI instantly. Large ones switch to NEFT automatically."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bills.map((bill) => {
            const Icon = ICONS[bill.icon] || Zap
            const rail = recommendRail(bill.amount)
            const isPaid = bill.status === 'Paid'
            return (
              <article
                key={bill.id}
                className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${TONES[bill.tone]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <StatusPill status={bill.status} />
                </div>

                <p className="mt-4 text-[16px] font-bold text-ink-900">{bill.biller}</p>
                <p className="text-[12.5px] text-slate-500">{bill.category} · {bill.consumer}</p>

                <p className="num mt-4 text-[26px] font-extrabold leading-none tracking-tight text-ink-900">
                  {formatINR(bill.amount)}
                </p>
                <p className="mt-1.5 text-[12.5px] text-slate-500">
                  {isPaid ? 'Paid today' : `Due: ${bill.due}`}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">
                    Recommended
                  </span>
                  <PaymentRailRecommendation amount={bill.amount} compact />
                </div>

                <button
                  type="button"
                  disabled={isPaid}
                  onClick={() => setConfirming(bill)}
                  className={`mt-4 w-full ${isPaid ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isPaid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Paid
                    </>
                  ) : (
                    `Pay Now · ${rail.name}`
                  )}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <Modal
        open={Boolean(confirming)}
        onClose={() => !processing && setConfirming(null)}
        title={processing ? 'Paying bill…' : `Pay ${confirming?.biller}?`}
        subtitle={
          confirming
            ? processing
              ? `Sending ${formatINR(confirming.amount)} over ${recommendRail(confirming.amount).name}.`
              : `${formatINR(confirming.amount)} will be debited from HDFC Bank ••4821.`
            : ''
        }
        footer={
          processing ? null : (
            <>
              <button type="button" className="btn-secondary" onClick={() => setConfirming(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handlePay}>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Payment
              </button>
            </>
          )
        }
      >
        {processing ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-9 w-9 animate-spin text-paytm-sky" />
            <p className="text-[13px] text-slate-500">Contacting biller…</p>
          </div>
        ) : (
          confirming && <PaymentRailRecommendation amount={confirming.amount} />
        )}
      </Modal>
    </div>
  )
}
