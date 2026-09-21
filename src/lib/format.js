// Indian numbering-system helpers. Every amount in this prototype is in ₹.

export function formatINR(value, { decimals = 0, symbol = true } = {}) {
  const n = Number(value) || 0
  const negative = n < 0
  const abs = Math.abs(n)
  const fixed = abs.toFixed(decimals)
  const [whole, fraction] = fixed.split('.')

  // Indian grouping: last 3 digits, then pairs of 2.
  const last3 = whole.slice(-3)
  const rest = whole.slice(0, -3)
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3

  return `${negative ? '-' : ''}${symbol ? '₹' : ''}${grouped}${fraction ? `.${fraction}` : ''}`
}

// ₹4,80,000 -> ₹4.8L ; ₹1,24,00,000 -> ₹1.24Cr ; ₹38,450 -> ₹38.4K
export function formatCompactINR(value, { symbol = true } = {}) {
  const n = Number(value) || 0
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  const p = symbol ? '₹' : ''
  const trim = (x, d) => Number(x.toFixed(d)).toString()

  if (abs >= 1e7) return `${sign}${p}${trim(abs / 1e7, 2)}Cr`
  if (abs >= 1e5) return `${sign}${p}${trim(abs / 1e5, 2)}L`
  if (abs >= 1000) return `${sign}${p}${trim(abs / 1000, 1)}K`
  return `${sign}${p}${abs}`
}

export function parseAmount(input) {
  if (typeof input === 'number') return input
  const cleaned = String(input || '').replace(/[^0-9.]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

// 4,80,000 grouping while the merchant types.
export function formatAmountInput(input) {
  const raw = String(input || '').replace(/[^0-9]/g, '')
  if (!raw) return ''
  return formatINR(Number(raw), { symbol: false })
}

export function initials(name = '') {
  return name
    .replace(/(Pvt|Ltd|Limited|Private|Inc|LLP|\.)/gi, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const AVATAR_TONES = [
  'bg-paytm-100 text-paytm-navy',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
]

export function avatarTone(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 997
  return AVATAR_TONES[h % AVATAR_TONES.length]
}

export function todayLabel() {
  return '21 Sep 2026'
}

export function generateUTR(rail = 'NEFT') {
  const prefix = rail === 'UPI' ? 'UPI' : 'SBIN'
  const digits = Math.floor(100000000 + Math.random() * 899999999)
  return `${prefix}2${digits}`
}
