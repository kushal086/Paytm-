import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Banknote, CheckCircle2, Loader2, Search, Users, Wallet,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { RailBadge, TableShell } from '../components/tables'
import { Avatar, Modal, SectionHeader, StatusPill } from '../components/ui'
import { usePayments } from '../context/PaymentsContext'
import { payrollSummary } from '../data/mockData'
import { formatCompactINR, formatINR } from '../lib/format'

export default function Salaries() {
  const navigate = useNavigate()
  const { employees, runPayroll } = usePayments()
  const [query, setQuery] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees
    return employees.filter(
      (e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q),
    )
  }, [employees, query])

  const total = employees.reduce((sum, e) => sum + e.amount, 0)

  const handleRun = () => {
    setProcessing(true)
    setTimeout(() => {
      runPayroll(total, employees.length)
      setProcessing(false)
      setConfirming(false)
      setPaid(true)
    }, 1600)
  }

  return (
    <div className="space-y-6">
      <header className="flex animate-fade-up flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink-900">Salary Payments</h1>
          <p className="mt-2 text-[15px] text-slate-500">
            {payrollSummary.month} payroll · one approval, {employees.length} bank transfers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={paid}
          className="btn-primary"
        >
          <Wallet className="h-4 w-4" />
          {paid ? 'Payroll processed' : 'Run Payroll'}
        </button>
      </header>

      <div className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <MetricCard icon={Users} tone="emerald" value={employees.length} label="Employees" sub={`${payrollSummary.month} cycle`} />
        <MetricCard icon={Banknote} tone="sky" value={formatINR(total)} label="Total payroll" sub="Paid over NEFT in one batch" />
        <MetricCard
          icon={CheckCircle2}
          tone={paid ? 'emerald' : 'amber'}
          value={paid ? 'Paid' : 'Ready'}
          label="Payroll status"
          sub={paid ? 'Settled today' : 'Awaiting your approval'}
        />
      </div>

      <section className="card animate-fade-up overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SectionHeader title="Employees" subtitle="Salary amounts are pulled from your payroll sheet." />
          <div className="relative min-w-0 flex-1 sm:max-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees"
              className="input h-10 py-0 pl-10 text-[14px]"
            />
          </div>
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          <TableShell>
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="th">Employee</th>
                <th className="th">Department</th>
                <th className="th">Account</th>
                <th className="th text-right">Amount</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="row-hover">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} size="sm" />
                      <span className="font-semibold text-ink-900">{e.name}</span>
                    </div>
                  </td>
                  <td className="td text-slate-600">{e.department}</td>
                  <td className="td num text-[13px] text-slate-500">{e.bank} · {e.account}</td>
                  <td className="td num text-right font-semibold">{formatINR(e.amount)}</td>
                  <td className="td"><StatusPill status={paid ? 'Paid' : e.status} /></td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </div>

        {/* Sticky batch footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/80 px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">Payments</p>
              <p className="num text-[20px] font-extrabold tracking-tight text-ink-900">{employees.length} payments</p>
            </div>
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
              <p className="num text-[20px] font-extrabold tracking-tight text-ink-900">{formatINR(total)}</p>
            </div>
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-500">Paid over</p>
              <RailBadge rail="NEFT" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => (paid ? navigate('/transactions') : setConfirming(true))}
            className="btn-primary"
          >
            {paid ? 'View transactions' : 'Review & Pay'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <Modal
        open={confirming}
        onClose={() => !processing && setConfirming(false)}
        title={processing ? 'Processing payroll…' : 'Run September payroll?'}
        subtitle={
          processing
            ? `Sending ${employees.length} salary payments over NEFT.`
            : `${employees.length} employees will be paid ${formatINR(total)} from HDFC Bank ••4821.`
        }
        footer={
          processing ? null : (
            <>
              <button type="button" className="btn-secondary" onClick={() => setConfirming(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleRun}>
                <CheckCircle2 className="h-4 w-4" />
                Approve &amp; Pay {formatCompactINR(total)}
              </button>
            </>
          )
        }
      >
        {processing ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-9 w-9 animate-spin text-paytm-sky" />
            <p className="text-[13px] text-slate-500">Batch initiated · do not close this window</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <dl className="space-y-2.5 text-[13.5px]">
              {[
                ['Employees', `${employees.length}`],
                ['Total amount', formatINR(total)],
                ['Payment method', 'NEFT (bulk transfer)'],
                ['Debited from', 'HDFC Bank ••4821'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="num font-semibold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}
