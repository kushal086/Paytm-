import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, ArrowRight, Building2, Calendar, CheckCircle2, FileText,
  Loader2, MessageSquare, ShieldCheck, ThumbsUp, UserCircle2, X,
} from 'lucide-react'
import PaymentStepper from '../components/PaymentStepper'
import { RailBadge } from '../components/tables'
import { Avatar, EmptyState, Modal, StatusPill } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatINR } from '../lib/format'
import { RAILS } from '../lib/rails'

export default function OwnerApproval() {
  const navigate = useNavigate()
  const {
    approvalQueue, approveAndPay, rejectPayment, requestChanges, owner, currentUser,
  } = usePayments()

  const [confirming, setConfirming] = useState(null)
  const [processing, setProcessing] = useState(false)

  const payment = approvalQueue[0]

  if (!payment) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="card">
          <EmptyState
            icon={ThumbsUp}
            title="Nothing waiting on you"
            body="Payments sent for approval appear here. Create one to see the owner's approval experience."
            action={
              <Link to="/pay/supplier" className="btn-primary">
                Create a payment
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const railMeta = RAILS[payment.rail] || RAILS.NEFT

  const handleConfirm = () => {
    setProcessing(true)
    // A short delay so the prototype shows the processing state rather than
    // teleporting to success.
    setTimeout(() => {
      const record = approveAndPay(payment)
      setProcessing(false)
      setConfirming(null)
      navigate(`/pay/success/${record.id}`)
    }, 1400)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PaymentStepper current={3} className="animate-fade-up" />

      <header className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="chip bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            Action needed
          </span>
          <span className="chip bg-slate-100 text-slate-600">
            <UserCircle2 className="h-3.5 w-3.5" />
            Signed in as {owner.name} · {owner.role}
          </span>
        </div>
        <h1 className="mt-4 text-[28px] font-extrabold tracking-tight text-ink-900 sm:text-[32px]">
          Payment requires your approval
        </h1>
        <p className="mt-2 text-[15px] text-slate-500">
          {approvalQueue.length === 1
            ? '1 payment is waiting.'
            : `${approvalQueue.length} payments are waiting.`}{' '}
          Nothing is debited until you approve.
        </p>
      </header>

      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="bg-gradient-to-br from-paytm-navy to-[#063a8f] px-6 py-7 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <Avatar name={payment.recipientShort || payment.recipient} size="lg" className="ring-2 ring-white/25" />
              <div className="min-w-0">
                <p className="text-[18px] font-bold leading-tight">{payment.recipient}</p>
                <p className="mt-1 text-[13px] text-white/65">
                  Invoice #{String(payment.reference || '').replace(/^INV-/, '')} · Due {payment.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] font-bold uppercase tracking-wider text-white/50">Amount</p>
              <p className="num mt-1 text-[36px] font-extrabold leading-none tracking-tight">
                {formatINR(payment.amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              icon: ShieldCheck,
              label: 'Beneficiary',
              value: 'Verified',
              note: `${payment.bank || 'State Bank of India'} · ${payment.accountNumber || 'XXXXXXXX4821'}`,
              good: true,
            },
            {
              icon: FileText,
              label: 'Invoice',
              value: payment.invoiceFile ? 'Attached' : 'Not attached',
              note: payment.invoiceFile || 'No document attached to this payment',
              good: Boolean(payment.invoiceFile),
            },
          ].map(({ icon: Icon, label, value, note, good }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4 sm:px-8">
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  good ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                <p className="truncate text-[12.5px] text-slate-500">{note}</p>
              </div>
              <span className={`chip ${good ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {good && <CheckCircle2 className="h-3.5 w-3.5" />}
                {value}
              </span>
            </div>
          ))}

          <div className="flex items-center gap-4 px-6 py-4 sm:px-8">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paytm-50 text-paytm-navy">
              <ArrowRight className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Payment method</p>
              <p className="truncate text-[12.5px] text-slate-500">
                Chosen by Paytm · arrives {railMeta.arrival.toLowerCase()} · fee {railMeta.fee}
              </p>
            </div>
            <RailBadge rail={payment.rail} />
          </div>

          <div className="flex items-center gap-4 px-6 py-4 sm:px-8">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Building2 className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Created by</p>
              <p className="truncate text-[12.5px] text-slate-500">
                {payment.createdBy || currentUser.name} · {currentUser.role}
              </p>
            </div>
            <StatusPill status="Pending Approval" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:px-8">
          <button
            type="button"
            onClick={() => setConfirming('approve')}
            className="btn bg-emerald-600 px-5 py-3 text-sm text-white shadow-[0_10px_26px_-12px_rgba(5,150,105,0.9)] transition hover:-translate-y-px hover:bg-emerald-700 sm:flex-[2]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve &amp; Pay
          </button>
          <button
            type="button"
            onClick={() => rejectPayment(payment.id, `${payment.recipientShort || payment.recipient} · ${formatINR(payment.amount)}`)}
            className="btn-danger flex-1"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
          <button
            type="button"
            onClick={() => requestChanges(payment.id)}
            className="btn-secondary flex-1"
          >
            <MessageSquare className="h-4 w-4" />
            Request Changes
          </button>
        </div>
      </section>

      {approvalQueue.length > 1 && (
        <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '180ms' }}>
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-[15px] font-bold text-ink-900">Also waiting on you</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {approvalQueue.slice(1).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={p.recipientShort || p.recipient} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink-900">{p.recipient}</p>
                  <p className="truncate text-[12px] text-slate-500">{p.reference} · {p.date}</p>
                </div>
                <span className="num text-[14px] font-bold text-ink-900">{formatINR(p.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Modal
        open={confirming === 'approve'}
        onClose={() => !processing && setConfirming(null)}
        title={processing ? 'Processing payment…' : 'Confirm this payment'}
        subtitle={
          processing
            ? `Sending ${formatINR(payment.amount)} over ${payment.rail}. Do not close this window.`
            : `Confirm payment of ${formatINR(payment.amount)} to ${payment.recipient}?`
        }
        footer={
          processing ? null : (
            <>
              <button type="button" className="btn-secondary" onClick={() => setConfirming(null)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn bg-emerald-600 px-5 py-3 text-sm text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Payment
              </button>
            </>
          )
        }
      >
        {processing ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="h-9 w-9 animate-spin text-paytm-sky" />
            <div className="w-full max-w-xs space-y-2.5">
              {[
                'Verifying beneficiary account',
                `Initiating ${payment.rail} transfer`,
                'Matching against invoice',
              ].map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 text-[13px] text-slate-600 animate-fade-in"
                  style={{ animationDelay: `${i * 380}ms` }}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <Avatar name={payment.recipientShort || payment.recipient} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-ink-900">{payment.recipient}</p>
                <p className="truncate text-[12px] text-slate-500">{payment.reference}</p>
              </div>
              <RailBadge rail={payment.rail} />
            </div>
            <dl className="mt-4 space-y-2 border-t border-slate-200 pt-3.5 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Amount</dt>
                <dd className="num font-bold text-ink-900">{formatINR(payment.amount)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Debited from</dt>
                <dd className="font-semibold text-ink-900">HDFC Bank ••4821</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Arrives
                </dt>
                <dd className="font-semibold text-ink-900">{railMeta.arrival}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}
