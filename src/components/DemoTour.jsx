import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react'

export const DEMO_STEPS = [
  {
    route: '/dashboard',
    title: 'One place for every business payment',
    body: 'Suppliers, salaries and bills — created, approved, paid and reconciled here. Your bank account does not change.',
    tag: 'Overview',
  },
  {
    route: '/pay/supplier',
    title: 'Pay ABC Packaging ₹4,80,000',
    body: 'You pick the supplier and the amount. Paytm picks the rail — NEFT for this one — and shows it as secondary information.',
    tag: 'Create',
  },
  {
    route: '/pay/review',
    title: 'Review, then send for approval',
    body: 'Maker-checker built in. Rahul creates the payment; Anita, the owner, approves it.',
    tag: 'Review',
  },
  {
    route: '/approvals',
    title: 'The owner approves and pays',
    body: 'One screen with everything needed to decide: verified beneficiary, attached invoice, amount and rail.',
    tag: 'Approve',
  },
  {
    route: '/transactions',
    title: 'Every payment, every rail, one ledger',
    body: 'UPI, NEFT and RTGS payments land in the same place with UTRs — no switching between apps.',
    tag: 'Track',
  },
  {
    route: '/reconciliation',
    title: 'Invoices close themselves',
    body: 'The payment is matched back to invoice INV-4821 automatically. This is the part that usually lives in Excel.',
    tag: 'Reconcile',
  },
]

export default function DemoTour({ step, onNext, onBack, onExit }) {
  const current = DEMO_STEPS[step]
  if (!current) return null
  const isLast = step === DEMO_STEPS.length - 1

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-5 sm:px-6">
      <div className="pointer-events-auto w-full max-w-xl animate-fade-up overflow-hidden rounded-2xl bg-paytm-navy text-white shadow-lift ring-1 ring-white/10">
        <div className="flex items-start gap-4 p-5">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paytm-sky text-paytm-navy">
            <Play className="h-4 w-4 fill-current" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="chip bg-paytm-sky/20 text-paytm-sky">{current.tag}</span>
              <span className="num text-[11.5px] font-semibold text-white/50">
                Step {step + 1} of {DEMO_STEPS.length}
              </span>
            </div>
            <p className="mt-2 text-[15px] font-bold leading-snug">{current.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/65">{current.body}</p>
          </div>

          <button
            type="button"
            onClick={onExit}
            aria-label="Exit demo"
            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-3">
          <div className="flex flex-1 gap-1.5">
            {DEMO_STEPS.map((s, i) => (
              <span
                key={s.route + s.tag}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i <= step ? 'bg-paytm-sky' : 'bg-white/15'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onBack}
            disabled={step === 0}
            className="btn rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <button
            type="button"
            onClick={isLast ? onExit : onNext}
            className="btn rounded-lg bg-paytm-sky px-4 py-1.5 text-[13px] font-bold text-paytm-navy transition hover:brightness-105"
          >
            {isLast ? 'Finish' : 'Next'}
            {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
