import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, Check, CheckCircle2, Copy, Download, FileCheck2, Receipt,
} from 'lucide-react'
import PaymentStepper from '../components/PaymentStepper'
import { RailBadge } from '../components/tables'
import { Avatar, EmptyState } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatINR } from '../lib/format'

export default function PaymentSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPayment, pushToast } = usePayments()
  const payment = getPayment(id)

  if (!payment) {
    return (
      <div className="card mx-auto max-w-2xl">
        <EmptyState
          icon={Receipt}
          title="Payment not found"
          body="This payment isn't in the current session. Start a new one to see the success screen."
          action={<Link to="/pay" className="btn-primary">Make a Payment</Link>}
        />
      </div>
    )
  }

  const copyUTR = async () => {
    try {
      await navigator.clipboard.writeText(payment.utr)
      pushToast({ tone: 'success', title: 'UTR copied', body: payment.utr })
    } catch {
      pushToast({ tone: 'info', title: 'UTR', body: payment.utr })
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PaymentStepper current={4} className="animate-fade-up" />

      <section className="card animate-fade-up overflow-hidden">
        <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-emerald-50 to-white px-6 py-10 text-center sm:px-10">
          <span className="relative mx-auto flex h-[74px] w-[74px] items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/25" style={{ animationDuration: '2.4s' }} />
            <span className="relative flex h-[74px] w-[74px] animate-pop items-center justify-center rounded-full bg-emerald-500 shadow-[0_14px_36px_-12px_rgba(16,185,129,0.9)]">
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </span>
          </span>

          <h1 className="mt-6 text-[24px] font-extrabold tracking-tight text-ink-900">Payment Successful</h1>

          <p className="num mt-5 text-[42px] font-extrabold leading-none tracking-tight text-ink-900 sm:text-[48px]">
            {formatINR(payment.amount)}
          </p>
          <p className="mt-3 text-[14px] text-slate-500">paid to</p>
          <div className="mt-2 flex items-center justify-center gap-2.5">
            <Avatar name={payment.recipientShort || payment.recipient} size="sm" />
            <p className="text-[16px] font-bold text-ink-900">{payment.recipient}</p>
          </div>
        </div>

        <dl className="divide-y divide-slate-100 px-6 sm:px-10">
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-[13px] font-semibold text-slate-500">UTR</dt>
            <dd className="flex items-center gap-2">
              <span className="num text-[14px] font-bold text-ink-900">{payment.utr}</span>
              <button
                type="button"
                onClick={copyUTR}
                aria-label="Copy UTR"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink-900"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-[13px] font-semibold text-slate-500">Payment method</dt>
            <dd><RailBadge rail={payment.rail} /></dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-[13px] font-semibold text-slate-500">Date</dt>
            <dd className="num text-[14px] font-semibold text-ink-900">{payment.paidOn || '21 Sep 2026'}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-[13px] font-semibold text-slate-500">Debited from</dt>
            <dd className="text-[14px] font-semibold text-ink-900">HDFC Bank ••4821</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-[13px] font-semibold text-slate-500">Status</dt>
            <dd>
              <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Successful
              </span>
            </dd>
          </div>
        </dl>

        {/* Reconciliation is the reason this product exists — say it here. */}
        <div className="mx-6 mb-6 mt-2 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:mx-10">
          <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-[13.5px] font-bold text-ink-900">
              Invoice {payment.reference} has been marked as Paid.
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-emerald-800/80">
              Matched automatically against UTR {payment.utr}. No spreadsheet entry needed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/reconciliation')}
              className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-700 transition hover:gap-2.5"
            >
              View in reconciliation
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      <div className="grid animate-fade-up grid-cols-1 gap-3 sm:grid-cols-3" style={{ animationDelay: '120ms' }}>
        <button
          type="button"
          onClick={() =>
            pushToast({
              tone: 'success',
              title: 'Receipt downloaded',
              body: `payment-receipt-${payment.utr}.pdf`,
            })
          }
          className="btn-secondary"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </button>
        <button type="button" onClick={() => navigate('/transactions')} className="btn-secondary">
          <Receipt className="h-4 w-4" />
          View Transaction
        </button>
        <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
