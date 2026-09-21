import { TrendingDown, TrendingUp } from 'lucide-react'

const TONES = {
  sky: 'bg-paytm-50 text-paytm-navy',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
  rose: 'bg-rose-50 text-rose-600',
}

export default function MetricCard({
  icon: Icon,
  value,
  label,
  sub,
  trend,
  tone = 'sky',
  onClick,
  className = '',
}) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'card group p-5 text-left transition-all duration-200',
        onClick ? 'hover:-translate-y-0.5 hover:shadow-lift hover:border-paytm-200' : '',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tone]}`}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        {trend && (
          <span
            className={`chip ${
              trend.direction === 'up' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      <p className="num mt-4 text-[28px] font-extrabold leading-none tracking-tight text-ink-900">
        {value}
      </p>
      <p className="mt-2 text-[13.5px] font-semibold text-ink-700">{label}</p>
      {sub && <p className="mt-1 text-[12.5px] text-slate-500">{sub}</p>}
    </Wrapper>
  )
}
