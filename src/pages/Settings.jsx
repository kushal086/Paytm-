import { useState } from 'react'
import {
  BookOpen, Building2, Check, Code2, Landmark, ListChecks, ShieldCheck,
  Sparkles, Users, Workflow,
} from 'lucide-react'
import { Avatar, SectionHeader, StatusPill } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { business, businessServices, teamMembers } from '../data/mockData'

const ICONS = { Workflow, ListChecks, ShieldCheck, Code2, BookOpen, Landmark }

const TONES = {
  sky: 'bg-paytm-50 text-paytm-navy',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
}

const APPROVAL_RULES = [
  { id: 'r1', range: 'Up to ₹1,00,000', rule: 'Finance Manager can pay directly', on: true },
  { id: 'r2', range: '₹1,00,000 – ₹10,00,000', rule: 'Owner approval required', on: true },
  { id: 'r3', range: 'Above ₹10,00,000', rule: 'Owner approval + second approver', on: true },
  { id: 'r4', range: 'New beneficiaries', rule: 'Always require owner approval', on: true },
]

export default function Settings() {
  const { pushToast } = usePayments()
  const [rules, setRules] = useState(APPROVAL_RULES)

  const toggleRule = (id) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, on: !r.on } : r)))
  }

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Settings</h1>
        <p className="mt-2 text-[15px] text-slate-500">
          Your business, your team, and the services that run on top of your payments.
        </p>
      </header>

      {/* Business profile */}
      <section className="card animate-fade-up p-6 sm:p-7" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={business.name} size="xl" />
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight text-ink-900">{business.legalName}</h2>
              <p className="mt-1 text-[13.5px] text-slate-500">{business.city}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  KYC verified
                </span>
                <span className="chip bg-paytm-50 text-paytm-navy">{business.plan}</span>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">
          {[
            ['GSTIN', business.gstin],
            ['Primary bank account', business.bank],
            ['Settlement', 'Direct from your bank'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
              <dd className="num mt-1 text-[14.5px] font-semibold text-ink-900">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-paytm-200 bg-paytm-50/60 p-4">
          <Building2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-paytm-navy" />
          <p className="text-[13px] leading-relaxed text-paytm-navy">
            <span className="font-bold">Your bank stays your bank.</span> Paytm never holds your
            money — payments are initiated from your existing account over UPI, NEFT or RTGS.
          </p>
        </div>
      </section>

      {/* Business services */}
      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <SectionHeader
          title="Business services"
          subtitle="Everything running on top of your payments, in one place."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {businessServices.map((svc) => {
            const Icon = ICONS[svc.icon] || Sparkles
            return (
              <article
                key={svc.id}
                className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${TONES[svc.tone]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <StatusPill status={svc.status} />
                </div>
                <p className="mt-4 text-[15px] font-bold text-ink-900">{svc.name}</p>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{svc.desc}</p>
                <button
                  type="button"
                  onClick={() =>
                    pushToast({
                      tone: 'info',
                      title: svc.name,
                      body:
                        svc.status === 'Active'
                          ? 'Already enabled for your business.'
                          : 'Our team will get in touch to set this up.',
                    })
                  }
                  className="mt-4 self-start text-[13px] font-bold text-paytm-sky transition hover:text-paytm-navy"
                >
                  {svc.status === 'Active' ? 'Manage' : svc.status === 'Available' ? 'Enable' : 'Join waitlist'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Approval rules */}
        <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '160ms' }}>
          <div className="border-b border-slate-100 px-5 py-4">
            <SectionHeader title="Approval rules" subtitle="Who can pay what, without asking." />
          </div>
          <ul className="divide-y divide-slate-100">
            {rules.map((r) => (
              <li key={r.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="num text-[14px] font-bold text-ink-900">{r.range}</p>
                  <p className="text-[12.5px] text-slate-500">{r.rule}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={r.on}
                  onClick={() => toggleRule(r.id)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                    r.on ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      r.on ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Team */}
        <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <SectionHeader title="Team & permissions" subtitle="Maker-checker across your finance team." />
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <ul className="divide-y divide-slate-100">
            {teamMembers.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-4">
                <Avatar name={m.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-ink-900">{m.name}</p>
                  <p className="truncate text-[12.5px] text-slate-500">{m.role}</p>
                </div>
                <span className="hidden max-w-[190px] truncate text-right text-[12px] text-slate-500 sm:block">
                  {m.permission}
                </span>
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
