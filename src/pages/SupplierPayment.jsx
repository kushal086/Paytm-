import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Calendar, Check, ChevronDown, FileUp, Paperclip,
  Search, ShieldCheck, X,
} from 'lucide-react'
import PaymentStepper from '../components/PaymentStepper'
import PaymentRailRecommendation from '../components/PaymentRailRecommendation'
import { Avatar, StatusPill, VerifiedBadge } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { formatAmountInput, formatCompactINR, formatINR, parseAmount } from '../lib/format'
import { recommendRail } from '../lib/rails'

const QUICK_AMOUNTS = [12500, 480000, 1200000]
const DATE_OPTIONS = ['Today', 'Tomorrow', '24 Sep 2026', '01 Oct 2026']

export default function SupplierPayment() {
  const navigate = useNavigate()
  const { suppliers, draft, startPayment, pushToast } = usePayments()

  const [supplierId, setSupplierId] = useState(draft?.supplierId || 'sup-abc')
  const [amountText, setAmountText] = useState(
    draft?.amount ? formatAmountInput(String(draft.amount)) : '4,80,000',
  )
  const [reference, setReference] = useState(draft?.reference || 'INV-4821')
  const [date, setDate] = useState(draft?.date || 'Today')
  const [rail, setRail] = useState(draft?.rail || null)
  const [invoiceFile, setInvoiceFile] = useState(draft?.invoiceFile || null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [touched, setTouched] = useState(false)
  const pickerRef = useRef(null)

  const supplier = suppliers.find((s) => s.id === supplierId) || suppliers[0]
  const amount = parseAmount(amountText)
  const recommended = recommendRail(amount)
  const effectiveRail = rail || recommended.id
  const amountError = touched && amount <= 0 ? 'Enter a payment amount' : ''

  useEffect(() => {
    const onClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // A manual rail override stops making sense once the amount moves out of range.
  useEffect(() => {
    setRail(null)
  }, [supplierId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return suppliers
    return suppliers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    )
  }, [suppliers, query])

  const handleContinue = () => {
    setTouched(true)
    if (amount <= 0) {
      pushToast({ tone: 'error', title: 'Amount required', body: 'Enter how much you want to pay.' })
      return
    }
    startPayment({
      supplierId: supplier.id,
      recipient: supplier.name,
      recipientShort: supplier.shortName,
      amount,
      reference: reference.trim() || '—',
      date,
      rail: effectiveRail,
      category: 'Supplier',
      invoiceFile,
      bank: supplier.bank,
      accountNumber: supplier.accountNumber,
      ifsc: supplier.ifsc,
    })
    navigate('/pay/review')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <PaymentStepper current={1} className="animate-fade-up" />

      <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <button
          type="button"
          onClick={() => navigate('/pay')}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900 sm:text-[32px]">
          Pay a supplier
        </h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Tell us who and how much. We'll take care of how it gets there.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Form */}
        <div className="card animate-fade-up p-6 sm:p-7 lg:col-span-3 lg:self-start" style={{ animationDelay: '120ms' }}>
          <div className="space-y-6">
            {/* Supplier picker */}
            <div ref={pickerRef} className="relative">
              <label className="label" htmlFor="supplier-trigger">Supplier</label>
              <button
                id="supplier-trigger"
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-300 bg-white p-3 text-left transition hover:border-paytm-sky focus:outline-none focus-visible:ring-4 focus-visible:ring-paytm-sky/15"
              >
                <Avatar name={supplier.shortName} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-ink-900">{supplier.name}</span>
                  <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">
                    {supplier.bank} · {supplier.accountNumber}
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${pickerOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {supplier.status === 'Verified' ? (
                  <VerifiedBadge />
                ) : (
                  <StatusPill status="Pending verification" />
                )}
                <span className="chip bg-slate-100 text-slate-600">
                  Paying since {supplier.since}
                </span>
                <span className="chip bg-slate-100 text-slate-600">
                  Avg {formatCompactINR(supplier.monthlyOutflow)}/month
                </span>
              </div>

              {pickerOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                  <div className="relative border-b border-slate-100 p-2.5">
                    <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search suppliers"
                      className="input h-10 py-0 pl-9 text-[14px]"
                    />
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1.5">
                    {filtered.length === 0 && (
                      <p className="px-3 py-6 text-center text-[13px] text-slate-500">No suppliers match "{query}"</p>
                    )}
                    {filtered.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSupplierId(s.id)
                          setPickerOpen(false)
                          setQuery('')
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-50 ${
                          s.id === supplierId ? 'bg-paytm-50/70' : ''
                        }`}
                      >
                        <Avatar name={s.shortName} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold text-ink-900">{s.name}</span>
                          <span className="block truncate text-[12px] text-slate-500">{s.category}</span>
                        </span>
                        {s.status === 'Verified' && <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
                        {s.id === supplierId && <Check className="h-4 w-4 shrink-0 text-paytm-sky" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="label" htmlFor="amount">Payment amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[24px] font-bold text-slate-400">
                  ₹
                </span>
                <input
                  id="amount"
                  inputMode="numeric"
                  value={amountText}
                  onChange={(e) => setAmountText(formatAmountInput(e.target.value))}
                  onBlur={() => setTouched(true)}
                  placeholder="0"
                  className={`num input h-16 pl-10 text-[26px] font-extrabold tracking-tight ${
                    amountError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''
                  }`}
                />
              </div>
              {amountError ? (
                <p className="mt-2 text-[12.5px] font-semibold text-red-600">{amountError}</p>
              ) : (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-slate-400">Try:</span>
                  {QUICK_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmountText(formatAmountInput(String(a)))
                        setRail(null)
                      }}
                      className="chip bg-slate-100 text-slate-600 transition hover:bg-paytm-50 hover:text-paytm-navy"
                    >
                      {formatINR(a)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="reference">Reference / Invoice</label>
                <input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="INV-4821"
                  className="input"
                />
                <p className="mt-2 text-[12px] text-slate-400">Used to auto-reconcile this payment.</p>
              </div>

              <div>
                <label className="label" htmlFor="date">Payment date</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input cursor-pointer appearance-none pl-10"
                  >
                    {DATE_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="mt-2 text-[12px] text-slate-400">Scheduled payments run automatically.</p>
              </div>
            </div>

            {/* Invoice upload */}
            <div>
              <span className="label">Upload invoice <span className="font-normal text-slate-400">(optional)</span></span>
              {invoiceFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600">
                    <Paperclip className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-ink-900">{invoiceFile}</span>
                    <span className="block text-[12px] text-emerald-700">Attached · 184 KB</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setInvoiceFile(null)}
                    aria-label="Remove invoice"
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-ink-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInvoiceFile(`${reference.trim() || 'invoice'}.pdf`)}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-[13.5px] font-semibold text-slate-500 transition hover:border-paytm-sky hover:bg-paytm-50/50 hover:text-paytm-navy"
                >
                  <FileUp className="h-4 w-4" />
                  Click to attach the invoice PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary rail */}
        <aside className="animate-fade-up space-y-4 lg:col-span-2" style={{ animationDelay: '180ms' }}>
          <div className="card p-6">
            <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">You are paying</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={supplier.shortName} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-ink-900">{supplier.name}</p>
                <p className="truncate text-[12.5px] text-slate-500">{supplier.category}</p>
              </div>
            </div>
            <p className="num mt-5 text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
              {formatINR(amount)}
            </p>
            <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-[13px]">
              {[
                ['Reference', reference.trim() || '—'],
                ['Payment date', date],
                ['Debited from', 'HDFC Bank ••4821'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="num truncate font-semibold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <PaymentRailRecommendation amount={amount} rail={rail} onChange={setRail} />

          <button type="button" onClick={handleContinue} className="btn-primary w-full">
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-[12px] leading-relaxed text-slate-400">
            You'll review everything before this payment goes out.
          </p>
        </aside>
      </div>
    </div>
  )
}
