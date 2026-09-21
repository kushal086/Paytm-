import { NavLink } from 'react-router-dom'
import {
  ArrowUpRight, Banknote, LayoutDashboard, ListChecks, Receipt, Settings,
  Sparkles, Truck, Users, Wallet, Zap, X, UploadCloud,
} from 'lucide-react'
import { business } from '../data/mockData'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/pay', label: 'Pay', icon: Banknote },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/salaries', label: 'Salaries', icon: Users },
  { to: '/bills', label: 'Bills', icon: Zap },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/reconciliation', label: 'Reconciliation', icon: ListChecks },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const SECONDARY = [
  { to: '/bulk-payments', label: 'Bulk Payments', icon: UploadCloud },
  { to: '/insights', label: 'Payment Insights', icon: Sparkles },
  { to: '/approvals', label: 'Approvals', icon: Wallet },
]

export default function Sidebar({ open, onClose, pendingApprovals = 0 }) {
  const link = ({ isActive }) =>
    [
      'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all duration-200',
      isActive
        ? 'bg-white/[0.12] text-white'
        : 'text-white/60 hover:bg-white/[0.08] hover:text-white',
    ].join(' ')

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-[2px] lg:hidden animate-fade-in"
          onClick={onClose}
          role="presentation"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-paytm-navy',
          'transition-transform duration-300 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-paytm-sky">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M7 17V7h4.2a3.4 3.4 0 0 1 0 6.8H9.4" stroke="#012970" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-extrabold tracking-tight text-white">Paytm</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paytm-sky">Business</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={link} onClick={onClose}>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-paytm-sky" />}
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-paytm-sky' : ''}`} />
                  <span className="flex-1">{label}</span>
                  {label === 'Overview' && pendingApprovals > 0 && (
                    <span className="num rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-ink-900">
                      {pendingApprovals}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          <p className="px-3.5 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            Workflows
          </p>
          {SECONDARY.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={link} onClick={onClose}>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-paytm-sky" />}
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-paytm-sky' : ''}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/10">
          <p className="text-[11px] font-bold uppercase tracking-wider text-paytm-sky">Paying from</p>
          <p className="mt-1.5 text-[13px] font-semibold text-white">{business.bank}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/55">
            Keep your existing bank. Paytm only manages the payment.
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-paytm-sky">
            Manage accounts <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </aside>
    </>
  )
}
