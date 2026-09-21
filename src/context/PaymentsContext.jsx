import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  bills as seedBills,
  bulkSummary,
  currentUser,
  employees as seedEmployees,
  invoices as seedInvoices,
  owner,
  suppliers as seedSuppliers,
  transactions as seedTransactions,
  upcomingPayments as seedUpcoming,
} from '../data/mockData'
import { recommendRail } from '../lib/rails'
import { generateUTR } from '../lib/format'

const PaymentsContext = createContext(null)

let toastSeq = 0

export function PaymentsProvider({ children }) {
  const [suppliers] = useState(seedSuppliers)
  const [employees] = useState(seedEmployees)
  const [bills, setBills] = useState(seedBills)
  const [transactions, setTransactions] = useState(seedTransactions)
  const [invoices, setInvoices] = useState(seedInvoices)
  const [upcoming, setUpcoming] = useState(seedUpcoming)

  // The payment currently being created / reviewed / approved.
  const [draft, setDraft] = useState(null)
  // Payments waiting on the owner.
  const [approvalQueue, setApprovalQueue] = useState([])
  // Completed payments keyed by id, for the success screen.
  const [completed, setCompleted] = useState({})

  const [toasts, setToasts] = useState([])
  const [bulk, setBulk] = useState({ stage: 'idle', file: null, summary: null })

  const pushToast = useCallback((toast) => {
    toastSeq += 1
    const id = `toast-${toastSeq}`
    setToasts((prev) => [...prev, { id, tone: 'success', ...toast }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const startPayment = useCallback((payload) => {
    const amount = Number(payload.amount) || 0
    const rail = payload.rail || recommendRail(amount).id
    const next = {
      id: `pay-${Date.now()}`,
      category: 'Supplier',
      status: 'Draft',
      createdBy: currentUser.name,
      approvedBy: null,
      date: 'Today',
      ...payload,
      amount,
      rail,
    }
    setDraft(next)
    return next
  }, [])

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  // Accepts an explicit payment so callers that just created one (the demo
  // tour) don't have to wait for the draft state to settle.
  const submitForApproval = useCallback((payment) => {
    const source = payment || draft
    if (!source) return null
    const submitted = { ...source, status: 'Pending Approval', submittedAt: 'Just now' }
    setDraft(submitted)
    setApprovalQueue((queue) =>
      queue.some((p) => p.id === submitted.id) ? queue : [submitted, ...queue],
    )
    pushToast({
      tone: 'success',
      title: 'Sent for approval',
      body: `${owner.name} has been notified.`,
    })
    return submitted
  }, [draft, pushToast])

  const saveDraft = useCallback(() => {
    setDraft((prev) => (prev ? { ...prev, status: 'Draft' } : prev))
    pushToast({ tone: 'info', title: 'Saved as draft', body: 'You can finish this payment later.' })
  }, [pushToast])

  const rejectPayment = useCallback(
    (id, reason = 'Rejected by owner') => {
      setApprovalQueue((queue) => queue.filter((p) => p.id !== id))
      setDraft((prev) => (prev && prev.id === id ? { ...prev, status: 'Rejected' } : prev))
      pushToast({ tone: 'error', title: 'Payment rejected', body: reason })
    },
    [pushToast],
  )

  const requestChanges = useCallback(
    (id) => {
      setApprovalQueue((queue) => queue.filter((p) => p.id !== id))
      setDraft((prev) => (prev && prev.id === id ? { ...prev, status: 'Changes Requested' } : prev))
      pushToast({
        tone: 'warning',
        title: 'Changes requested',
        body: `Sent back to ${currentUser.name} for edits.`,
      })
    },
    [pushToast],
  )

  // Approve + settle. Returns the completed payment record.
  const approveAndPay = useCallback(
    (payment) => {
      const utr = generateUTR(payment.rail)
      const record = {
        ...payment,
        status: 'Successful',
        approvedBy: owner.name,
        utr,
        paidOn: '21 Sep 2026',
      }

      setCompleted((prev) => ({ ...prev, [record.id]: record }))
      setApprovalQueue((queue) => queue.filter((p) => p.id !== record.id))
      setDraft((prev) => (prev && prev.id === record.id ? record : prev))

      setTransactions((prev) => [
        {
          id: `txn-${record.id}`,
          date: '21 Sep',
          dateFull: '21 Sep 2026',
          recipient: record.recipientShort || record.recipient,
          type: record.category || 'Supplier',
          amount: record.amount,
          rail: record.rail,
          status: 'Successful',
          utr,
          invoice: record.reference || '—',
          isNew: true,
        },
        ...prev,
      ])

      // This is the product point: paying also closes the books.
      if (record.reference) {
        setInvoices((prev) => {
          const exists = prev.some((inv) => inv.id === record.reference)
          if (exists) {
            return prev.map((inv) =>
              inv.id === record.reference
                ? { ...inv, reconciliation: 'Matched', rail: record.rail, note: `Auto-matched with UTR ${utr}`, isNew: true }
                : inv,
            )
          }
          return [
            {
              id: record.reference,
              recipient: record.recipientShort || record.recipient,
              amount: record.amount,
              rail: record.rail,
              reconciliation: 'Matched',
              date: '21 Sep 2026',
              note: `Auto-matched with UTR ${utr}`,
              isNew: true,
            },
            ...prev,
          ]
        })
      }

      setUpcoming((prev) => prev.filter((u) => u.invoice !== record.reference))

      return record
    },
    [],
  )

  const payBill = useCallback(
    (bill) => {
      const rail = recommendRail(bill.amount).id
      const utr = generateUTR(rail)
      setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, status: 'Paid' } : b)))
      setTransactions((prev) => [
        {
          id: `txn-${bill.id}-${Date.now()}`,
          date: '21 Sep',
          dateFull: '21 Sep 2026',
          recipient: bill.biller,
          type: 'Utility',
          amount: bill.amount,
          rail,
          status: 'Successful',
          utr,
          invoice: `BILL-${bill.id.toUpperCase()}`,
          isNew: true,
        },
        ...prev,
      ])
      pushToast({
        tone: 'success',
        title: `${bill.biller} paid`,
        body: `Paid over ${rail} · UTR ${utr}`,
      })
    },
    [pushToast],
  )

  const runPayroll = useCallback(
    (total, count) => {
      const utr = generateUTR('NEFT')
      setTransactions((prev) => [
        {
          id: `txn-payroll-${Date.now()}`,
          date: '21 Sep',
          dateFull: '21 Sep 2026',
          recipient: `Payroll · ${count} employees`,
          type: 'Salary',
          amount: total,
          rail: 'NEFT',
          status: 'Successful',
          utr,
          invoice: 'PAY-0926',
          isNew: true,
        },
        ...prev,
      ])
      pushToast({
        tone: 'success',
        title: 'Payroll processed',
        body: `${count} salary payments sent over NEFT.`,
      })
    },
    [pushToast],
  )

  const uploadBulkFile = useCallback((fileName) => {
    setBulk({ stage: 'uploading', file: fileName || bulkSummary.fileName, summary: null })
    setTimeout(() => {
      setBulk({ stage: 'uploaded', file: fileName || bulkSummary.fileName, summary: bulkSummary })
    }, 900)
  }, [])

  const validateBulk = useCallback(() => {
    setBulk((prev) => ({ ...prev, stage: 'validating' }))
    setTimeout(() => {
      setBulk((prev) => ({ ...prev, stage: 'validated' }))
    }, 1400)
  }, [])

  const approveBulk = useCallback(() => {
    setBulk((prev) => ({ ...prev, stage: 'approved' }))
    pushToast({
      tone: 'success',
      title: '60 payments queued',
      body: '₹24,37,000 sent for processing over UPI, NEFT and RTGS.',
    })
  }, [pushToast])

  const resetBulk = useCallback(() => {
    setBulk({ stage: 'idle', file: null, summary: null })
  }, [])

  const getPayment = useCallback(
    (id) => completed[id] || approvalQueue.find((p) => p.id === id) || (draft && draft.id === id ? draft : null),
    [completed, approvalQueue, draft],
  )

  const value = useMemo(
    () => ({
      suppliers,
      employees,
      bills,
      transactions,
      invoices,
      upcoming,
      draft,
      approvalQueue,
      completed,
      toasts,
      bulk,
      currentUser,
      owner,
      startPayment,
      updateDraft,
      submitForApproval,
      saveDraft,
      approveAndPay,
      rejectPayment,
      requestChanges,
      payBill,
      runPayroll,
      uploadBulkFile,
      validateBulk,
      approveBulk,
      resetBulk,
      getPayment,
      pushToast,
      dismissToast,
    }),
    [
      suppliers, employees, bills, transactions, invoices, upcoming, draft, approvalQueue,
      completed, toasts, bulk, startPayment, updateDraft, submitForApproval, saveDraft,
      approveAndPay, rejectPayment, requestChanges, payBill, runPayroll, uploadBulkFile,
      validateBulk, approveBulk, resetBulk, getPayment, pushToast, dismissToast,
    ],
  )

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
}

export function usePayments() {
  const ctx = useContext(PaymentsContext)
  if (!ctx) throw new Error('usePayments must be used inside <PaymentsProvider>')
  return ctx
}
