import { formatCompactINR } from '../lib/format'

/**
 * Hand-rolled SVG column chart — no chart library, so the visual language
 * stays consistent with the rest of the product.
 */
export default function BarChart({ series, height = 220 }) {
  const max = Math.max(...series.map((d) => d.value))
  const gridLines = 4

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        {/* Grid */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: gridLines + 1 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="num w-12 shrink-0 text-right text-[10.5px] font-semibold text-slate-400">
                {formatCompactINR((max * (gridLines - i)) / gridLines)}
              </span>
              <span className="h-px flex-1 bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Columns */}
        <div className="absolute inset-0 flex items-end gap-2 pl-[60px] sm:gap-4">
          {series.map((d, i) => {
            const pct = (d.value / max) * 100
            const isLast = i === series.length - 1
            return (
              <div key={d.month} className="group relative flex h-full flex-1 items-end">
                <div
                  className={[
                    'w-full rounded-t-lg transition-all duration-500 ease-out',
                    isLast
                      ? 'bg-gradient-to-t from-paytm-navy to-paytm-sky'
                      : 'bg-paytm-200 group-hover:bg-paytm-300',
                  ].join(' ')}
                  style={{ height: `${pct}%` }}
                />
                <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-[11.5px] font-semibold text-white opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
                  {d.month} · {formatCompactINR(d.value)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-2.5 flex gap-2 pl-[60px] sm:gap-4">
        {series.map((d, i) => (
          <span
            key={d.month}
            className={`flex-1 text-center text-[11.5px] font-semibold ${
              i === series.length - 1 ? 'text-ink-900' : 'text-slate-400'
            }`}
          >
            {d.month}
          </span>
        ))}
      </div>
    </div>
  )
}
