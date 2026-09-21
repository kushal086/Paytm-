import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Building2, CheckCircle2, Clock, FileText, Pencil,
  Send, ShieldCheck, UserCheck,
} from 'lucide-react'
import PaymentStepper from '../components/PaymentStepper'
import { RailBadge } from '../components/tables'
import { Avatar, EmptyState, StatusPill } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatINR } from '../lib/format'
import { RAILS } from '../lib/rails'

export default function PaymentReview() {
  const navigate = useNavigate()
  const { draft, submitForApproval, saveDraft, currentUser, owner } = usePayments()
  const [sent, setSent] = useState(draft?.status === 'Pending Approval')

  if (!draft) {
    return (
      <div className="card mx-auto max-w-2xl">
        <EmptyState
          icon={FileText}
          title="No payment to review yet"
          body="Create a payment first — pick a supplier, enter the amount, and we'll bring you back here."
          action={
            <Link to="/pay" className="btn-primary">
              Make a Payment
            </Link>
          }
        />
      </div>
    )
  }

  const railMeta = RAILS[draft.rail] || RAILS.NEFT

  const handleSend = () => {
    submitForApproval()
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PaymentStepper current={sent ? 3 : 2} className="animate-fade-up" />

      {sent ? (
        <div className="card animate-fade-up overflow-hidden">
          <div className="border-b border-emerald-100 bg-emerald-50/60 px-6 py-8 text-center sm:px-8">
            <span className="mx-auto flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-emerald-500 text-white">
              <Send className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-[22px] font-extrabold tracking-tight text-ink-900">
              Payment request sent to the business owner.
            </h1>
            <p className="mt-2 text-[14px] text-slate-600">
              {owner.name} will be notified on the Paytm Business app. Nothing has been debited yet.
            </p>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <Avatar name={draft.recipientShort || draft.recipient} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-ink-900">{draft.recipient}</p>
                <p className="truncate text-[12.5px] text-slate-500">
                  {draft.reference} · {draft.date}
                </p>
              </div>
              <div className="text-right">
                <p className="num text-[20px] font-extrabold tracking-tight text-ink-900">
                  {formatINR(draft.amount)}
                </p>
                <StatusPill status="Pending Approval" className="mt-1" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/approvals')}
                className="btn-primary flex-1"
              >
                View Payment
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1"
              >
                Back to Dashboard
              </button>
            </div>

            <p className="text-center text-[12.5px] text-slate-400">
              In this prototype you can approve it yourself as the owner.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
            <button
              type="button"
              onClick={() => navigate('/pay/supplier')}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-ink-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit payment
            </button>
            <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900 sm:text-[32px]">
              Review this payment
            </h1>
            <p className="mt-2 text-[15px] text-slate-500">
              Check the details before it goes to {owner.name} for approval.
            </p>
          </div>

          {/* Payment summary */}
          <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-[15px] font-bold text-ink-900">Payment summary</h2>
              <button
                type="button"
                onClick={() => navigate('/pay/supplier')}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-paytm-sky transition hover:text-paytm-navy"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Avatar name={draft.recipientShort || draft.recipient} size="lg" />
                  <div className="min-w-0">
                    <p className="text-[17px] font-bold text-ink-900">{draft.recipient}</p>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {draft.bank || 'State Bank of India'} · {draft.accountNumber || 'XXXXXXXX4821'}
                    </p>
                    <span className="chip mt-2 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Beneficiary verified
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Amount</p>
                  <p className="num mt-1 text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
                    {formatINR(draft.amount)}
                  </p>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                {[
                  { k: 'Invoice', v: draft.reference, icon: FileText },
                  { k: 'Payment date', v: draft.date, icon: Clock },
                  { k: 'Debited from', v: 'HDFC Bank ••4821', icon: Building2 },
                ].map(({ k, v, icon: Icon }) => (
                  <div key={k} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
                      <dd className="num mt-0.5 text-[14.5px] font-semibold text-ink-900">{v}</dd>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                      Payment method
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-2">
                      <RailBadge rail={draft.rail} />
                      <span className="text-[12.5px] text-slate-500">Arrives {railMeta.arrival.toLowerCase()}</span>
                    </dd>
                  </div>
                </div>
              </dl>

              {draft.invoiceFile && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-paytm-navy">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-ink-900">{draft.invoiceFile}</span>
                    <span className="block text-[12px] text-slate-500">Invoice attached to this payment</span>
                  </span>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                </div>
              )}
            </div>
          </section>

          {/* Approval workflow */}
          <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: '180ms' }}>
            <h2 className="text-[15px] font-bold text-ink-900">Approval workflow</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Payments above ₹1,00,000 need the business owner's approval.
            </p>

            <div className="mt-5 space-y-0">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <CheckCircle2 className="h-[18px] w-[18px]" />
                  </span>
                  <span className="my-1 w-0.5 flex-1 rounded-full bg-slate-200" />
                </div>
                <div className="pb-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Created by</p>
                  <p className="mt-0.5 text-[15px] font-bold text-ink-900">{currentUser.name}</p>
                  <p className="text-[12.5px] text-slate-500">{currentUser.role} · Just now</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400">
                  <UserCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Approved by</p>
                  <p className="mt-0.5 text-[15px] font-bold text-slate-400">Pending</p>
                  <p className="text-[12.5px] text-slate-500">{owner.name} · {owner.role}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '220ms' }}>
            <button type="button" onClick={handleSend} className="btn-primary flex-1">
              <Send className="h-4 w-4" />
              Send for Approval
            </button>
            <button
              type="button"
              onClick={() => {
                saveDraft()
                navigate('/dashboard')
              }}
              className="btn-secondary flex-1"
            >
              Save as Draft
            </button>
          </div>
        </>
      )}
    </div>
  )
}
