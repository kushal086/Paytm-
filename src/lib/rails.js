// The merchant never picks a rail. This function does, and every screen
// reads from here so the recommendation is identical everywhere.

export const RAILS = {
  UPI: {
    id: 'UPI',
    name: 'UPI',
    fullName: 'Unified Payments Interface',
    arrival: 'Instantly',
    fee: '₹0',
    limit: 'Up to ₹1,00,000 per payment',
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  NEFT: {
    id: 'NEFT',
    name: 'NEFT',
    fullName: 'National Electronic Funds Transfer',
    arrival: 'Today',
    fee: '₹0 / As applicable',
    limit: 'No upper limit · settled in batches',
    tone: 'bg-paytm-50 text-paytm-navy border-paytm-200',
    dot: 'bg-paytm-sky',
  },
  RTGS: {
    id: 'RTGS',
    name: 'RTGS',
    fullName: 'Real Time Gross Settlement',
    arrival: 'Within 30 minutes',
    fee: 'As applicable',
    limit: 'For payments of ₹2,00,000 and above',
    tone: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
}

export const UPI_MAX = 100000
export const RTGS_MIN = 1000000

export function recommendRail(amount) {
  const value = Number(amount) || 0

  if (value > 0 && value <= UPI_MAX) {
    return {
      ...RAILS.UPI,
      reason: 'Instant transfer, available 24x7 for this payment amount.',
    }
  }

  if (value >= RTGS_MIN) {
    return {
      ...RAILS.RTGS,
      reason: 'High-value payment — settled individually and in real time.',
    }
  }

  return {
    ...RAILS.NEFT,
    reason: 'Suitable for this payment amount and beneficiary.',
  }
}

export function railBadgeClass(rail) {
  return RAILS[rail]?.tone || 'bg-slate-100 text-slate-700 border-slate-200'
}
