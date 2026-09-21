import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Layers, MoreHorizontal, Truck, Users, Zap } from 'lucide-react'
import PaymentStepper from '../components/PaymentStepper'
import { usePayments } from '../context/PaymentsContext'

const OPTIONS = [
  {
    id: 'supplier',
    title: 'Supplier',
    body: 'Pay an existing supplier',
    icon: Truck,
    route: '/pay/supplier',
    tone: 'bg-paytm-50 text-paytm-navy group-hover:bg-paytm-navy group-hover:text-white',
    border: 'hover:border-paytm-navy',
    meta: '6 saved suppliers · all verified',
  },
  {
    id: 'employee',
    title: 'Employee',
    body: 'Pay salary / reimbursement',
    icon: Users,
    route: '/salaries',
    tone: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    border: 'hover:border-emerald-500',
    meta: '42 employees on payroll',
  },
  {
    id: 'bill',
    title: 'Bill or Utility',
    body: 'Pay electricity, internet, rent, etc.',
    icon: Zap,
    route: '/bills',
    tone: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-500',
    meta: '4 bills due this week',
  },
  {
    id: 'other',
    title: 'Other',
    body: 'Make another business payment',
    icon: MoreHorizontal,
    route: '/pay/supplier',
    tone: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    border: 'hover:border-violet-500',
    meta: 'GST, rent, vendors and more',
  },
]

export default function MakePayment() {
  const navigate = useNavigate()
  const { pushToast } = usePayments()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PaymentStepper current={0} className="animate-fade-up" />

      <header className="animate-fade-up text-center" style={{ animationDelay: '60ms' }}>
        <h1 className="text-[30px] font-extrabold tracking-tight text-ink-900 sm:text-[34px]">
          Who do you want to pay?
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-slate-500">
          Start with the recipient and the amount. Paytm picks the right payment method —
          UPI, NEFT or RTGS — and moves the money from your existing bank account.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 animate-fade-up sm:grid-cols-2" style={{ animationDelay: '120ms' }}>
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => navigate(opt.route)}
              className={`card group flex items-start gap-4 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${opt.border}`}
            >
              <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${opt.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold text-ink-900">{opt.title}</span>
                <span className="mt-1 block text-[13.5px] text-slate-500">{opt.body}</span>
                <span className="mt-3 block text-[12px] font-semibold text-slate-400">{opt.meta}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-paytm-sky" />
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 animate-fade-up sm:grid-cols-2" style={{ animationDelay: '180ms' }}>
        <button
          type="button"
          onClick={() => navigate('/bulk-payments')}
          className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-left transition hover:border-paytm-sky hover:bg-white"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Layers className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block text-[14px] font-bold text-ink-900">Pay many at once</span>
            <span className="block text-[12.5px] text-slate-500">Upload an Excel or CSV file</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            pushToast({
              tone: 'info',
              title: 'Beneficiary added',
              body: 'In the full product this opens account & UPI verification.',
            })
          }
          className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-left transition hover:border-paytm-sky hover:bg-white"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Building2 className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block text-[14px] font-bold text-ink-900">Pay someone new</span>
            <span className="block text-[12.5px] text-slate-500">Add a bank account or UPI ID</span>
          </span>
        </button>
      </div>
    </div>
  )
}
