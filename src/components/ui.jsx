import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { avatarTone, initials } from '../lib/format'

export function Avatar({ name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-2xl',
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl font-bold ${avatarTone(name)} ${sizes[size]} ${className}`}
    >
      {initials(name)}
    </span>
  )
}

const STATUS_TONES = {
  Successful: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Matched: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Verified: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Ready: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Scheduled: 'bg-paytm-50 text-paytm-navy ring-1 ring-paytm-200',
  Available: 'bg-paytm-50 text-paytm-navy ring-1 ring-paytm-200',
  Draft: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Due: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'Pending Approval': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'Pending verification': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'Changes Requested': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'Coming soon': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  Failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Rejected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Unmatched: 'bg-red-50 text-red-700 ring-1 ring-red-200',
}

export function StatusPill({ status, className = '', icon = null }) {
  const tone = STATUS_TONES[status] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  return (
    <span className={`chip ${tone} ${className}`}>
      {icon}
      {status}
    </span>
  )
}

export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        <h2 className="text-[17px] font-bold tracking-tight text-ink-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink-900/45 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        role="presentation"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} animate-scale-in rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-2xl sm:p-7`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink-900"
        >
          <X className="h-4 w-4" />
        </button>
        {title && <h3 className="pr-8 text-lg font-bold tracking-tight text-ink-900">{title}</h3>}
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
        <div className={title ? 'mt-5' : ''}>{children}</div>
        {footer && <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}

const TOAST_ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  error: <XCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  info: <Info className="h-5 w-5 text-paytm-sky" />,
}

const TOAST_BARS = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-paytm-sky',
}

export function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto relative flex gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lift animate-slide-in-right"
        >
          <span className={`absolute inset-y-0 left-0 w-1 ${TOAST_BARS[t.tone] || TOAST_BARS.info}`} />
          <span className="mt-0.5">{TOAST_ICONS[t.tone] || TOAST_ICONS.info}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{t.body}</p>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
            className="h-fit rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-ink-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ProgressBar({ value, total, className = '', tone = 'bg-emerald-500' }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className={`h-full origin-left rounded-full ${tone} animate-grow-x`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function ProgressRing({ value, total, size = 132, stroke = 12, label, sublabel }) {
  const pct = total > 0 ? Math.min(1, value / total) : 0
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#10b981"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-xl font-extrabold tracking-tight text-ink-900">{label}</span>
        {sublabel && <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{sublabel}</span>}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="text-[15px] font-semibold text-ink-900">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-200/70 ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
    </div>
  )
}

export function VerifiedBadge({ label = 'Verified beneficiary', className = '' }) {
  return (
    <span className={`chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 ${className}`}>
      <CheckCircle2 className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
