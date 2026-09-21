import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarClock, Sparkles, TrendingUp, Truck, Users, Wallet, Zap } from 'lucide-react'
import BarChart from '../components/BarChart'
import MetricCard from '../components/MetricCard'
import { RailBadge } from '../components/tables'
import { ProgressBar, SectionHeader } from '../components/ui'
import { insights } from '../data/mockData'
import { formatCompactINR, formatINR } from '../lib/format'

const INSIGHT_TONES = {
  amber: 'border-amber-200 bg-amber-50/70 text-amber-900',
  sky: 'border-paytm-200 bg-paytm-50/70 text-paytm-navy',
  emerald: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
}

const INSIGHT_ICON_TONES = {
  amber: 'bg-amber-100 text-amber-700',
  sky: 'bg-paytm-100 text-paytm-navy',
  emerald: 'bg-emerald-100 text-emerald-700',
}

export default function Insights() {
  const navigate = useNavigate()
  const previous = insights.series[insights.series.length - 2].value
  const current = insights.series[insights.series.length - 1].value
  const change = Math.round(((current - previous) / previous) * 100)

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <div className="flex items-center gap-2.5">
          <span className="chip bg-paytm-50 text-paytm-navy ring-1 ring-paytm-200">
            <Sparkles className="h-3.5 w-3.5" />
            Payment Insights
          </span>
        </div>
        <h1 className="mt-4 text-[28px] font-extrabold tracking-tight text-ink-900">
          Where your money goes
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Because every outbound payment runs through one place, you get a view of business
          cash outflow that no single bank statement can give you.
        </p>
      </header>

      <div className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '60ms' }}>
        <MetricCard
          icon={Wallet}
          tone="sky"
          value={formatCompactINR(insights.monthlyTotal)}
          label="Monthly outgoing payments"
          sub="September 2026"
          trend={{ direction: 'up', value: `${change}%` }}
        />
        {insights.breakdown.slice(0, 3).map((b, i) => (
          <MetricCard
            key={b.label}
            icon={[Truck, Users, Zap][i]}
            tone={['emerald', 'amber', 'violet'][i]}
            value={formatCompactINR(b.value)}
            label={b.label}
            sub={`${Math.round((b.value / insights.monthlyTotal) * 100)}% of outflow`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="card flex animate-fade-up flex-col p-6 lg:col-span-2" style={{ animationDelay: '120ms' }}>
          <SectionHeader
            title="Monthly outbound payments"
            subtitle="Last 6 months, across UPI, NEFT and RTGS."
            action={
              <span className="chip bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                {change}% vs Aug
              </span>
            }
          />
          <div className="mt-7 flex-1">
            <BarChart series={insights.series} height={300} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-4">
            {[
              ['6-month total', formatCompactINR(insights.series.reduce((sum, d) => sum + d.value, 0))],
              ['Monthly average', formatCompactINR(insights.series.reduce((sum, d) => sum + d.value, 0) / insights.series.length)],
              ['Highest month', 'Sep 2026'],
              ['Payments made', '620'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
                <dd className="num mt-1 text-[16px] font-extrabold tracking-tight text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card animate-fade-up p-6" style={{ animationDelay: '150ms' }}>
          <SectionHeader title="Where it went" subtitle="September 2026" />
          <div className="mt-5 space-y-4">
            {insights.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className={`h-2.5 w-2.5 rounded-full ${b.tone}`} />
                    {b.label}
                  </span>
                  <span className="num font-bold text-ink-900">{formatCompactINR(b.value)}</span>
                </div>
                <ProgressBar value={b.value} total={insights.monthlyTotal} tone={b.tone} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Rail mix</p>
            <div className="mt-3 space-y-2.5">
              {insights.railSplit.map((r) => (
                <div key={r.rail} className="flex items-center justify-between gap-3">
                  <RailBadge rail={r.rail} />
                  <span className="text-[12.5px] text-slate-500">{r.count} payments</span>
                  <span className="num text-[13px] font-bold text-ink-900">{r.share}%</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-slate-400">
              Chosen automatically — the merchant never picked a rail.
            </p>
          </div>
        </section>
      </div>

      <section className="space-y-4 animate-fade-up" style={{ animationDelay: '180ms' }}>
        <SectionHeader title="What we noticed" subtitle="Generated from your payment history." />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {insights.cards.map((c) => (
            <article key={c.id} className={`rounded-2xl border p-5 ${INSIGHT_TONES[c.tone]}`}>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${INSIGHT_ICON_TONES[c.tone]}`}>
                {c.tone === 'sky' ? <CalendarClock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </span>
              <p className="mt-3.5 text-[14.5px] font-bold leading-snug">{c.title}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed opacity-80">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card animate-fade-up flex flex-wrap items-center justify-between gap-4 p-6" style={{ animationDelay: '220ms' }}>
        <div>
          <p className="text-[15px] font-bold text-ink-900">
            {formatINR(1842000)} is due in the next 7 days
          </p>
          <p className="mt-1 text-[13px] text-slate-500">
            Across 14 suppliers, 1 payroll run and 4 utility bills.
          </p>
        </div>
        <button type="button" onClick={() => navigate('/transactions')} className="btn-primary">
          Review upcoming payments
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  )
}
