import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, FileSpreadsheet, Loader2, RotateCcw, ShieldCheck,
  Trash2, UploadCloud,
} from 'lucide-react'
import { RailBadge, TableShell } from '../components/tables'
import { Avatar, ProgressBar, SectionHeader } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { bulkFileRows } from '../data/mockData'
import { formatCompactINR, formatINR } from '../lib/format'
import { recommendRail } from '../lib/rails'

export default function BulkPayments() {
  const navigate = useNavigate()
  const { bulk, uploadBulkFile, validateBulk, approveBulk, resetBulk } = usePayments()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const { stage, file, summary } = bulk
  const hasFile = stage !== 'idle' && stage !== 'uploading'

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer?.files?.[0]
    uploadBulkFile(dropped?.name)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="animate-fade-up">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900 sm:text-[32px]">
          Make multiple payments at once
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Upload supplier, salary or other payment instructions. Paytm verifies every
          beneficiary, picks a rail per payment, and sends the whole batch for one approval.
        </p>
      </header>

      {/* Upload area */}
      {stage === 'idle' || stage === 'uploading' ? (
        <section className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            disabled={stage === 'uploading'}
            className={[
              'flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-all duration-200',
              dragging
                ? 'border-paytm-sky bg-paytm-50 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-paytm-sky hover:bg-paytm-50/40',
            ].join(' ')}
          >
            {stage === 'uploading' ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-paytm-sky" />
                <p className="mt-5 text-[17px] font-bold text-ink-900">Reading your file…</p>
                <p className="mt-1.5 text-[13.5px] text-slate-500">Parsing payment instructions</p>
              </>
            ) : (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-paytm-50 text-paytm-navy">
                  <UploadCloud className="h-7 w-7" />
                </span>
                <p className="mt-5 text-[18px] font-bold text-ink-900">Upload Excel / CSV</p>
                <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-slate-500">
                  Upload supplier, salary or other payment instructions. Drag a file here or
                  click to browse.
                </p>
                <span className="btn-primary mt-6">
                  <FileSpreadsheet className="h-4 w-4" />
                  Choose a file
                </span>
                <span className="mt-4 text-[12px] text-slate-400">
                  .xlsx, .xls or .csv · up to 5,000 rows
                </span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={(e) => uploadBulkFile(e.target.files?.[0]?.name)}
          />
        </section>
      ) : (
        <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '60ms' }}>
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-ink-900">{file}</p>
              <p className="text-[12.5px] text-slate-500">
                {summary?.fileSize} · {summary?.count} payment instructions
              </p>
            </div>
            <button
              type="button"
              onClick={resetBulk}
              className="btn-ghost text-slate-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>

          {/* Batch summary */}
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-7">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">In this file</p>
              <p className="num mt-2 text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
                {summary?.count} payments
              </p>
              <p className="num mt-2 text-[26px] font-extrabold leading-none tracking-tight text-paytm-navy">
                {formatINR(summary?.total || 0)}
              </p>
              <p className="mt-3 text-[13px] text-slate-500">
                Debited from HDFC Bank ••4821 once approved.
              </p>
            </div>

            <div className="space-y-3.5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Breakdown</p>
              {summary?.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className={`h-2.5 w-2.5 rounded-full ${b.tone}`} />
                      {b.label}
                      <span className="text-slate-400">· {b.count}</span>
                    </span>
                    <span className="num font-bold text-ink-900">{formatCompactINR(b.value)}</span>
                  </div>
                  <ProgressBar
                    value={b.value}
                    total={summary.total}
                    tone={b.tone}
                    className="mt-1.5 h-1.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Validation */}
          <div className="border-t border-slate-100 bg-slate-50/60 p-6 sm:p-7">
            {stage === 'uploaded' && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[15px] font-bold text-ink-900">Ready to validate</p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    We'll check every beneficiary account and payment instruction before anything moves.
                  </p>
                </div>
                <button type="button" onClick={validateBulk} className="btn-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Validate Payments
                </button>
              </div>
            )}

            {stage === 'validating' && (
              <div className="flex items-center gap-4">
                <Loader2 className="h-6 w-6 shrink-0 animate-spin text-paytm-sky" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-bold text-ink-900">Validating {summary?.count} payments…</p>
                  <p className="mt-0.5 text-[12.5px] text-slate-500">
                    Checking beneficiary names, account numbers and IFSC codes
                  </p>
                  <ProgressBar value={1} total={1} tone="bg-paytm-sky" className="mt-3 h-1.5" />
                </div>
              </div>
            )}

            {(stage === 'validated' || stage === 'approved') && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    `${summary?.count} beneficiaries verified`,
                    `${summary?.count} payment instructions valid`,
                  ].map((line) => (
                    <div
                      key={line}
                      className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"
                    >
                      <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-emerald-600" />
                      <span className="text-[13.5px] font-semibold text-emerald-900">{line}</span>
                    </div>
                  ))}
                </div>

                {stage === 'approved' ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-[14.5px] font-bold text-ink-900">Batch approved and queued</p>
                        <p className="text-[12.5px] text-slate-500">
                          {summary?.count} payments · {formatINR(summary?.total || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={resetBulk} className="btn-secondary">
                        <RotateCcw className="h-4 w-4" />
                        Upload another
                      </button>
                      <button type="button" onClick={() => navigate('/transactions')} className="btn-primary">
                        View transactions
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[13px] text-slate-500">
                      Nothing has been debited yet. One approval sends the whole batch.
                    </p>
                    <button type="button" onClick={approveBulk} className="btn-primary">
                      Review &amp; Approve
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Row preview */}
      {hasFile && (
        <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
          <div className="border-b border-slate-100 px-5 py-4">
            <SectionHeader
              title="Payment instructions"
              subtitle={`Showing the first ${bulkFileRows.length} of ${summary?.count} rows · rail chosen per payment.`}
            />
          </div>
          <TableShell>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="th">Beneficiary</th>
                <th className="th">Type</th>
                <th className="th">Reference</th>
                <th className="th text-right">Amount</th>
                <th className="th">Rail</th>
                <th className="th">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bulkFileRows.map((row) => {
                const rail = recommendRail(row.amount)
                const validated = stage === 'validated' || stage === 'approved'
                return (
                  <tr key={row.id} className="row-hover">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.beneficiary} size="sm" />
                        <span className="truncate font-semibold text-ink-900">{row.beneficiary}</span>
                      </div>
                    </td>
                    <td className="td">
                      <span className="chip bg-slate-100 text-slate-600">{row.type}</span>
                    </td>
                    <td className="td num text-slate-600">{row.reference}</td>
                    <td className="td num text-right font-semibold">{formatINR(row.amount)}</td>
                    <td className="td"><RailBadge rail={rail.id} /></td>
                    <td className="td">
                      {validated ? (
                        <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : stage === 'validating' ? (
                        <span className="chip bg-slate-100 text-slate-500">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Checking
                        </span>
                      ) : (
                        <span className="chip bg-slate-100 text-slate-500">Not checked</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </TableShell>
        </section>
      )}
    </div>
  )
}
