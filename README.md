# Paytm Business Payments

A high-fidelity, clickable prototype for a business **outbound** payments product —
one place for a merchant to create, approve, pay, track and reconcile supplier,
salary and bill payments, while the money still moves over **UPI, NEFT or RTGS**
from their existing bank account.

Paytm is the payment-management and workflow layer. It does not replace the
merchant's bank.

## Run it

```bash
npm install
npm run dev     # http://localhost:5173
```

`npm run build` produces a static bundle in `dist/`.

## The main journey

Dashboard → Make a Payment → Supplier → enter ₹4,80,000 → Review →
Send for Approval → Owner approves → Payment Success → Transactions →
Reconciliation (invoice INV-4821 flips to **Matched**).

Press **▶ View Demo** in the top bar to be walked through it in six guided steps.

## The core idea, in the UI

The merchant never picks a payment rail. They pick *who* and *how much*, and the
rail is derived and shown as quiet, overridable secondary information:

| Amount | Rail | Arrival |
| --- | --- | --- |
| ≤ ₹1,00,000 | UPI | Instantly |
| ₹1,00,001 – ₹9,99,999 | NEFT | Today |
| ≥ ₹10,00,000 | RTGS | Within 30 minutes |

That single rule lives in `src/lib/rails.js` and every screen reads from it.

## Screens

`/dashboard` · `/pay` · `/pay/supplier` · `/pay/review` · `/approvals` ·
`/pay/success/:id` · `/suppliers` (+ detail) · `/salaries` · `/bills` ·
`/transactions` · `/reconciliation` · `/bulk-payments` · `/insights` · `/settings`

## Stack

React 18, Vite, Tailwind CSS, lucide-react, React Router. Mock data only — no
backend. All payment, approval, reconciliation and bulk-upload state is held in
`src/context/PaymentsContext.jsx`, so paying a supplier really does update the
transaction ledger and close out its invoice.

Charts are hand-rolled SVG (`src/components/BarChart.jsx`) to keep the visual
language consistent.

All amounts use Indian digit grouping (₹4,80,000 / ₹18,42,000) via
`src/lib/format.js`.
