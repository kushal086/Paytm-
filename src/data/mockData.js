// All data in this prototype is mock data for a fictional business:
// "Sharma Industries Pvt. Ltd." — a mid-sized packaging & distribution business.

export const business = {
  name: 'Sharma Industries',
  legalName: 'Sharma Industries Pvt. Ltd.',
  gstin: '29AABCS1429B1ZQ',
  bank: 'HDFC Bank ••4821',
  city: 'Bengaluru, Karnataka',
  plan: 'Business Pro',
}

export const currentUser = {
  name: 'Rahul Mehta',
  role: 'Finance Manager',
  email: 'rahul@sharmaindustries.in',
}

export const owner = {
  name: 'Anita Sharma',
  role: 'Business Owner',
  email: 'anita@sharmaindustries.in',
}

export const dashboardStats = {
  paymentsToday: 572000,
  upcomingPayments: 1842000,
  pendingApprovals: 12,
  paymentsThisMonth: 47,
}

export const categories = [
  {
    id: 'supplier',
    title: 'Supplier Payments',
    pending: 382000,
    count: 8,
    icon: 'Truck',
    tone: 'sky',
    route: '/pay/supplier',
    cta: 'Pay a supplier',
  },
  {
    id: 'salary',
    title: 'Salaries',
    pending: 120000,
    count: 3,
    icon: 'Users',
    tone: 'emerald',
    route: '/salaries',
    cta: 'Run payroll',
  },
  {
    id: 'bills',
    title: 'Bills & Utilities',
    pending: 42500,
    count: 4,
    icon: 'Zap',
    tone: 'amber',
    route: '/bills',
    cta: 'Pay bills',
  },
  {
    id: 'other',
    title: 'Other Expenses',
    pending: 28000,
    count: 2,
    icon: 'Wallet',
    tone: 'violet',
    route: '/pay',
    cta: 'Make a payment',
  },
]

export const suppliers = [
  {
    id: 'sup-abc',
    name: 'ABC Packaging Pvt. Ltd.',
    shortName: 'ABC Packaging',
    category: 'Packaging materials',
    lastPayment: 480000,
    lastPaymentDate: '28 Aug 2026',
    monthlyOutflow: 1820000,
    status: 'Verified',
    bank: 'State Bank of India',
    accountNumber: 'XXXXXXXX4821',
    ifsc: 'SBIN0001234',
    upiId: 'abcpackaging@sbi',
    gstin: '29AACCA1234M1Z8',
    contact: 'Suresh Nair',
    phone: '+91 98450 21134',
    since: 'Mar 2022',
    outstanding: 480000,
    upcoming: { amount: 480000, due: 'Today', invoice: 'INV-4821' },
    history: [
      { id: 'h1', date: '28 Aug 2026', invoice: 'INV-4702', amount: 512000, rail: 'NEFT', status: 'Successful' },
      { id: 'h2', date: '30 Jul 2026', invoice: 'INV-4588', amount: 438000, rail: 'NEFT', status: 'Successful' },
      { id: 'h3', date: '27 Jun 2026', invoice: 'INV-4461', amount: 496500, rail: 'NEFT', status: 'Successful' },
      { id: 'h4', date: '29 May 2026', invoice: 'INV-4330', amount: 374000, rail: 'NEFT', status: 'Successful' },
    ],
  },
  {
    id: 'sup-xyz',
    name: 'XYZ Traders',
    shortName: 'XYZ Traders',
    category: 'Raw material trading',
    lastPayment: 72500,
    lastPaymentDate: '18 Sep 2026',
    monthlyOutflow: 740000,
    status: 'Verified',
    bank: 'ICICI Bank',
    accountNumber: 'XXXXXXXX7719',
    ifsc: 'ICIC0004412',
    upiId: 'xyztraders@icici',
    gstin: '29AAFCX8812K1ZP',
    contact: 'Meena Iyer',
    phone: '+91 99012 77410',
    since: 'Jan 2023',
    outstanding: 18200,
    upcoming: { amount: 18200, due: '25 Sep', invoice: 'INV-4830' },
    history: [
      { id: 'h1', date: '18 Sep 2026', invoice: 'INV-4817', amount: 72500, rail: 'UPI', status: 'Successful' },
      { id: 'h2', date: '04 Sep 2026', invoice: 'INV-4779', amount: 96400, rail: 'UPI', status: 'Successful' },
      { id: 'h3', date: '21 Aug 2026', invoice: 'INV-4690', amount: 84200, rail: 'UPI', status: 'Successful' },
    ],
  },
  {
    id: 'sup-rajesh',
    name: 'Rajesh Logistics',
    shortName: 'Rajesh Logistics',
    category: 'Freight & transport',
    lastPayment: 18000,
    lastPaymentDate: '21 Sep 2026',
    monthlyOutflow: 210000,
    status: 'Verified',
    bank: 'Axis Bank',
    accountNumber: 'XXXXXXXX3390',
    ifsc: 'UTIB0000921',
    upiId: 'rajeshlogistics@axis',
    gstin: '29AAKCR4410N1ZR',
    contact: 'Rajesh Kumar',
    phone: '+91 98861 30021',
    since: 'Aug 2021',
    outstanding: 72500,
    upcoming: { amount: 72500, due: 'Tomorrow', invoice: 'INV-4828' },
    history: [
      { id: 'h1', date: '21 Sep 2026', invoice: 'INV-4815', amount: 18000, rail: 'UPI', status: 'Successful' },
      { id: 'h2', date: '12 Sep 2026', invoice: 'INV-4801', amount: 24600, rail: 'UPI', status: 'Successful' },
      { id: 'h3', date: '02 Sep 2026', invoice: 'INV-4766', amount: 31200, rail: 'UPI', status: 'Successful' },
    ],
  },
  {
    id: 'sup-sunrise',
    name: 'Sunrise Chemicals Pvt. Ltd.',
    shortName: 'Sunrise Chemicals',
    category: 'Industrial chemicals',
    lastPayment: 264000,
    lastPaymentDate: '16 Sep 2026',
    monthlyOutflow: 980000,
    status: 'Verified',
    bank: 'Kotak Mahindra Bank',
    accountNumber: 'XXXXXXXX8842',
    ifsc: 'KKBK0008112',
    upiId: 'sunrisechem@kotak',
    gstin: '29AAGCS7741L1ZM',
    contact: 'Farhan Qureshi',
    phone: '+91 97400 88120',
    since: 'Nov 2022',
    outstanding: 0,
    upcoming: null,
    history: [
      { id: 'h1', date: '16 Sep 2026', invoice: 'INV-4808', amount: 264000, rail: 'NEFT', status: 'Successful' },
      { id: 'h2', date: '19 Aug 2026', invoice: 'INV-4671', amount: 318000, rail: 'NEFT', status: 'Successful' },
    ],
  },
  {
    id: 'sup-glenmark',
    name: 'Deccan Steel Works',
    shortName: 'Deccan Steel',
    category: 'Steel & fabrication',
    lastPayment: 1240000,
    lastPaymentDate: '09 Sep 2026',
    monthlyOutflow: 1240000,
    status: 'Verified',
    bank: 'Bank of Baroda',
    accountNumber: 'XXXXXXXX1188',
    ifsc: 'BARB0DECCAN',
    upiId: 'deccansteel@bob',
    gstin: '29AADCD9921P1ZT',
    contact: 'Vikram Patil',
    phone: '+91 90084 11209',
    since: 'Feb 2024',
    outstanding: 0,
    upcoming: null,
    history: [
      { id: 'h1', date: '09 Sep 2026', invoice: 'INV-4790', amount: 1240000, rail: 'RTGS', status: 'Successful' },
    ],
  },
  {
    id: 'sup-print',
    name: 'Nova Print Solutions',
    shortName: 'Nova Print',
    category: 'Printing & labels',
    lastPayment: 42800,
    lastPaymentDate: '14 Sep 2026',
    monthlyOutflow: 168000,
    status: 'Pending verification',
    bank: 'Canara Bank',
    accountNumber: 'XXXXXXXX5521',
    ifsc: 'CNRB0002231',
    upiId: 'novaprint@canara',
    gstin: '29AAJCN3310H1ZV',
    contact: 'Priya Raghavan',
    phone: '+91 98801 55217',
    since: 'Jul 2026',
    outstanding: 28000,
    upcoming: null,
    history: [
      { id: 'h1', date: '14 Sep 2026', invoice: 'INV-4805', amount: 42800, rail: 'UPI', status: 'Successful' },
    ],
  },
]

export const upcomingPayments = [
  { id: 'up-1', recipient: 'ABC Packaging', supplierId: 'sup-abc', amount: 480000, due: 'Today', status: 'Pending Approval', invoice: 'INV-4821', type: 'Supplier' },
  { id: 'up-2', recipient: 'Rajesh Logistics', supplierId: 'sup-rajesh', amount: 72500, due: 'Tomorrow', status: 'Scheduled', invoice: 'INV-4828', type: 'Supplier' },
  { id: 'up-3', recipient: 'BESCOM', supplierId: null, amount: 38450, due: '24 Sep', status: 'Scheduled', invoice: 'BILL-0924', type: 'Utility' },
  { id: 'up-4', recipient: 'XYZ Traders', supplierId: 'sup-xyz', amount: 18200, due: '25 Sep', status: 'Pending', invoice: 'INV-4830', type: 'Supplier' },
]

const baseTransactions = [
  { id: 'txn-1000', date: '21 Sep', dateFull: '21 Sep 2026', recipient: 'ABC Packaging', type: 'Supplier', amount: 480000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2884210077', invoice: 'INV-4812' },
  { id: 'txn-1001', date: '21 Sep', dateFull: '21 Sep 2026', recipient: 'Rajesh Logistics', type: 'Supplier', amount: 18000, rail: 'UPI', status: 'Successful', utr: 'UPI2884120933', invoice: 'INV-4815' },
  { id: 'txn-1002', date: '20 Sep', dateFull: '20 Sep 2026', recipient: 'BESCOM', type: 'Utility', amount: 38450, rail: 'UPI', status: 'Successful', utr: 'UPI2884008471', invoice: 'BILL-0824' },
  { id: 'txn-1003', date: '20 Sep', dateFull: '20 Sep 2026', recipient: 'Employee 12', type: 'Salary', amount: 52000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2773910228', invoice: 'PAY-0926' },
  { id: 'txn-1004', date: '19 Sep', dateFull: '19 Sep 2026', recipient: 'XYZ Traders', type: 'Supplier', amount: 72500, rail: 'UPI', status: 'Successful', utr: 'UPI2883711094', invoice: 'INV-4817' },
  { id: 'txn-1005', date: '18 Sep', dateFull: '18 Sep 2026', recipient: 'Airtel Business', type: 'Utility', amount: 8400, rail: 'UPI', status: 'Successful', utr: 'UPI2883512207', invoice: 'BILL-0818' },
  { id: 'txn-1006', date: '17 Sep', dateFull: '17 Sep 2026', recipient: 'Sunrise Chemicals', type: 'Supplier', amount: 264000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2773410882', invoice: 'INV-4808' },
  { id: 'txn-1007', date: '16 Sep', dateFull: '16 Sep 2026', recipient: 'Nova Print Solutions', type: 'Supplier', amount: 42800, rail: 'UPI', status: 'Successful', utr: 'UPI2883108844', invoice: 'INV-4805' },
  { id: 'txn-1008', date: '15 Sep', dateFull: '15 Sep 2026', recipient: 'Prestige Estates (Rent)', type: 'Other', amount: 185000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2772988120', invoice: 'RENT-0926' },
  { id: 'txn-1009', date: '14 Sep', dateFull: '14 Sep 2026', recipient: 'Employee 08', type: 'Salary', amount: 61000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2772744019', invoice: 'PAY-0926' },
  { id: 'txn-1010', date: '12 Sep', dateFull: '12 Sep 2026', recipient: 'Rajesh Logistics', type: 'Supplier', amount: 24600, rail: 'UPI', status: 'Successful', utr: 'UPI2882410338', invoice: 'INV-4801' },
  { id: 'txn-1011', date: '11 Sep', dateFull: '11 Sep 2026', recipient: 'ICICI Lombard (Insurance)', type: 'Other', amount: 46200, rail: 'NEFT', status: 'Successful', utr: 'SBIN2772210447', invoice: 'INS-0926' },
  { id: 'txn-1012', date: '09 Sep', dateFull: '09 Sep 2026', recipient: 'Deccan Steel Works', type: 'Supplier', amount: 1240000, rail: 'RTGS', status: 'Successful', utr: 'SBIN2771844021', invoice: 'INV-4790' },
  { id: 'txn-1013', date: '08 Sep', dateFull: '08 Sep 2026', recipient: 'ACT Fibernet', type: 'Utility', amount: 5600, rail: 'UPI', status: 'Successful', utr: 'UPI2881744820', invoice: 'BILL-0808' },
  { id: 'txn-1014', date: '06 Sep', dateFull: '06 Sep 2026', recipient: 'Nova Print Solutions', type: 'Supplier', amount: 19400, rail: 'UPI', status: 'Failed', utr: '—', invoice: 'INV-4784' },
  { id: 'txn-1015', date: '05 Sep', dateFull: '05 Sep 2026', recipient: 'Employee 21', type: 'Salary', amount: 48000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2771208833', invoice: 'PAY-0926' },
  { id: 'txn-1016', date: '04 Sep', dateFull: '04 Sep 2026', recipient: 'XYZ Traders', type: 'Supplier', amount: 96400, rail: 'UPI', status: 'Successful', utr: 'UPI2880944112', invoice: 'INV-4779' },
  { id: 'txn-1017', date: '03 Sep', dateFull: '03 Sep 2026', recipient: 'BESCOM', type: 'Utility', amount: 41200, rail: 'UPI', status: 'Successful', utr: 'UPI2880710224', invoice: 'BILL-0803' },
  { id: 'txn-1018', date: '02 Sep', dateFull: '02 Sep 2026', recipient: 'Rajesh Logistics', type: 'Supplier', amount: 31200, rail: 'UPI', status: 'Successful', utr: 'UPI2880488210', invoice: 'INV-4766' },
  { id: 'txn-1019', date: '01 Sep', dateFull: '01 Sep 2026', recipient: 'GST Payment (Sep)', type: 'Other', amount: 318000, rail: 'NEFT', status: 'Successful', utr: 'SBIN2770188442', invoice: 'GST-0926' },
  { id: 'txn-1020', date: '01 Sep', dateFull: '01 Sep 2026', recipient: 'Employee 03', type: 'Salary', amount: 54000, rail: 'NEFT', status: 'Pending', utr: '—', invoice: 'PAY-0926' },
]

export const transactions = baseTransactions

export const recentPayments = baseTransactions.slice(0, 5)

export const invoices = [
  { id: 'INV-4821', recipient: 'ABC Packaging', amount: 480000, rail: 'NEFT', reconciliation: 'Pending', date: '21 Sep 2026', note: 'Awaiting payment' },
  { id: 'INV-4817', recipient: 'XYZ Traders', amount: 72500, rail: 'UPI', reconciliation: 'Matched', date: '19 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4815', recipient: 'Rajesh Logistics', amount: 18000, rail: 'UPI', reconciliation: 'Matched', date: '21 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4808', recipient: 'Sunrise Chemicals', amount: 264000, rail: 'NEFT', reconciliation: 'Matched', date: '17 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4805', recipient: 'Nova Print Solutions', amount: 42800, rail: 'UPI', reconciliation: 'Matched', date: '16 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4801', recipient: 'Rajesh Logistics', amount: 24600, rail: 'UPI', reconciliation: 'Matched', date: '12 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4790', recipient: 'Deccan Steel Works', amount: 1240000, rail: 'RTGS', reconciliation: 'Matched', date: '09 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'INV-4779', recipient: 'XYZ Traders', amount: 96400, rail: 'UPI', reconciliation: 'Matched', date: '04 Sep 2026', note: 'Auto-matched with UTR' },
  { id: 'BILL-0824', recipient: 'BESCOM', amount: 38450, rail: 'UPI', reconciliation: 'Matched', date: '20 Sep 2026', note: 'Auto-matched with biller ref' },
  { id: 'RENT-0926', recipient: 'Prestige Estates', amount: 185000, rail: 'NEFT', reconciliation: 'Matched', date: '15 Sep 2026', note: 'Auto-matched with UTR' },
]

// How many of the listed invoices start out matched. The reconciliation screen
// counts live changes against this rather than a hardcoded number.
export const seedMatchedCount = invoices.filter((i) => i.reconciliation === 'Matched').length

export const reconciliationSummary = {
  month: 'September 2026',
  payments: 47,
  value: 1842000,
  reconciled: 46,
  pending: 1,
}

const EMPLOYEE_AMOUNTS = [
  48000, 62000, 54000, 15500, 17500, 14500, 20500, 16500, 18500, 13500,
  21500, 16000, 18000, 15500, 17500, 14500, 20500, 16500, 18500, 13500,
  21500, 16000, 18000, 15500, 17500, 14500, 20500, 16500, 18500, 13500,
  21500, 16000, 18000, 15500, 17500, 14500, 20500, 16500, 18500, 13500,
  21500, 22000,
]

const EMPLOYEE_DEPTS = ['Operations', 'Sales', 'Finance', 'Warehouse', 'Production', 'Admin']

export const employees = EMPLOYEE_AMOUNTS.map((amount, i) => ({
  id: `emp-${String(i + 1).padStart(2, '0')}`,
  name: `Employee ${String(i + 1).padStart(2, '0')}`,
  department: EMPLOYEE_DEPTS[i % EMPLOYEE_DEPTS.length],
  amount,
  bank: ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'][i % 4],
  account: `XXXXXXXX${1000 + i * 7}`,
  status: 'Ready',
}))

export const payrollSummary = {
  month: 'September 2026',
  employeeCount: 42,
  total: 840000,
}

export const bills = [
  { id: 'bill-1', biller: 'BESCOM', category: 'Electricity', icon: 'Zap', amount: 38450, due: '24 Sep', consumer: 'Consumer No. 8814 2290', status: 'Due', tone: 'amber' },
  { id: 'bill-2', biller: 'ACT Fibernet', category: 'Internet', icon: 'Wifi', amount: 5600, due: '26 Sep', consumer: 'Account 1129 8840', status: 'Due', tone: 'sky' },
  { id: 'bill-3', biller: 'Prestige Estates', category: 'Rent', icon: 'Building2', amount: 185000, due: '01 Oct', consumer: 'Unit 4, Peenya Industrial Area', status: 'Scheduled', tone: 'violet' },
  { id: 'bill-4', biller: 'Airtel Business', category: 'Mobile', icon: 'Smartphone', amount: 8400, due: '27 Sep', consumer: '12 corporate connections', status: 'Due', tone: 'rose' },
  { id: 'bill-5', biller: 'ICICI Lombard', category: 'Insurance', icon: 'ShieldCheck', amount: 46200, due: '05 Oct', consumer: 'Policy GRP-44120', status: 'Scheduled', tone: 'emerald' },
  { id: 'bill-6', biller: 'BWSSB Water', category: 'Other bills', icon: 'Droplets', amount: 12400, due: '28 Sep', consumer: 'RR No. 4412 8890', status: 'Due', tone: 'slate' },
]

export const insights = {
  monthlyTotal: 8240000,
  breakdown: [
    { label: 'Supplier payments', value: 5420000, tone: 'bg-paytm-sky' },
    { label: 'Salaries', value: 1860000, tone: 'bg-emerald-500' },
    { label: 'Bills & utilities', value: 680000, tone: 'bg-amber-500' },
    { label: 'Other', value: 280000, tone: 'bg-violet-500' },
  ],
  series: [
    { month: 'Apr', value: 6180000 },
    { month: 'May', value: 6740000 },
    { month: 'Jun', value: 7120000 },
    { month: 'Jul', value: 6890000 },
    { month: 'Aug', value: 7230000 },
    { month: 'Sep', value: 8240000 },
  ],
  railSplit: [
    { rail: 'UPI', share: 34, count: 412 },
    { rail: 'NEFT', share: 48, count: 186 },
    { rail: 'RTGS', share: 18, count: 22 },
  ],
  cards: [
    { id: 'i1', tone: 'amber', title: 'Your supplier payments increased 14% this month.', body: 'Driven mainly by ABC Packaging and Deccan Steel Works. Review before the next cycle.' },
    { id: 'i2', tone: 'sky', title: '₹18.4L of payments are due in the next 7 days.', body: 'Across 14 suppliers, 1 payroll run and 4 utility bills.' },
    { id: 'i3', tone: 'emerald', title: 'You saved ~9 hours of manual reconciliation.', body: '46 of 47 payments this month matched to invoices automatically.' },
  ],
}

export const bulkFileRows = [
  { id: 'b1', beneficiary: 'ABC Packaging Pvt. Ltd.', type: 'Supplier', amount: 480000, reference: 'INV-4821' },
  { id: 'b2', beneficiary: 'Sunrise Chemicals Pvt. Ltd.', type: 'Supplier', amount: 264000, reference: 'INV-4808' },
  { id: 'b3', beneficiary: 'Deccan Steel Works', type: 'Supplier', amount: 312000, reference: 'INV-4840' },
  { id: 'b4', beneficiary: 'XYZ Traders', type: 'Supplier', amount: 96400, reference: 'INV-4830' },
  { id: 'b5', beneficiary: 'Rajesh Logistics', type: 'Supplier', amount: 72500, reference: 'INV-4828' },
  { id: 'b6', beneficiary: 'Employee 01', type: 'Salary', amount: 48000, reference: 'PAY-0926' },
  { id: 'b7', beneficiary: 'Employee 02', type: 'Salary', amount: 62000, reference: 'PAY-0926' },
  { id: 'b8', beneficiary: 'Employee 03', type: 'Salary', amount: 54000, reference: 'PAY-0926' },
  { id: 'b9', beneficiary: 'BESCOM', type: 'Bill', amount: 38450, reference: 'BILL-0924' },
  { id: 'b10', beneficiary: 'Prestige Estates', type: 'Bill', amount: 185000, reference: 'RENT-0926' },
]

export const bulkSummary = {
  fileName: 'september-payments-batch.xlsx',
  fileSize: '184 KB',
  count: 60,
  total: 2437000,
  breakdown: [
    { label: 'Supplier payments', value: 1270000, count: 31, tone: 'bg-paytm-sky' },
    { label: 'Salaries', value: 840000, count: 21, tone: 'bg-emerald-500' },
    { label: 'Bills', value: 330000, count: 8, tone: 'bg-amber-500' },
  ],
}

export const notifications = [
  { id: 'n1', title: 'Payment of ₹4,80,000 needs your approval', body: 'ABC Packaging Pvt. Ltd. · Invoice INV-4821', time: '12 min ago', unread: true, tone: 'amber' },
  { id: 'n2', title: 'Payment to Rajesh Logistics successful', body: '₹18,000 paid over UPI · UTR UPI2884120933', time: '1 hr ago', unread: true, tone: 'emerald' },
  { id: 'n3', title: 'BESCOM bill due in 3 days', body: '₹38,450 · Auto-pay is off for this biller', time: '3 hrs ago', unread: true, tone: 'sky' },
  { id: 'n4', title: 'September payroll is ready', body: '42 employees · ₹8,40,000', time: 'Yesterday', unread: false, tone: 'slate' },
]

export const businessServices = [
  { id: 'svc-1', name: 'Payment Management', desc: 'Approvals, scheduling, maker-checker and payment limits across your team.', icon: 'Workflow', status: 'Active', tone: 'sky' },
  { id: 'svc-2', name: 'Reconciliation', desc: 'Automatic invoice-to-payment matching with UTR capture and exports.', icon: 'ListChecks', status: 'Active', tone: 'emerald' },
  { id: 'svc-3', name: 'Advanced Approvals', desc: 'Multi-level approvals, amount-based routing and spend policies.', icon: 'ShieldCheck', status: 'Active', tone: 'violet' },
  { id: 'svc-4', name: 'API Integrations', desc: 'Trigger payouts and pull payment status from your own systems.', icon: 'Code2', status: 'Available', tone: 'slate' },
  { id: 'svc-5', name: 'Accounting Integrations', desc: 'Two-way sync with Tally, Zoho Books and QuickBooks.', icon: 'BookOpen', status: 'Available', tone: 'amber' },
  { id: 'svc-6', name: 'Financial Services', desc: 'Working-capital lines and supplier credit, based on your payment history.', icon: 'Landmark', status: 'Coming soon', tone: 'rose' },
]

export const teamMembers = [
  { id: 'tm-1', name: 'Anita Sharma', role: 'Business Owner', permission: 'Approve & pay · No limit', email: 'anita@sharmaindustries.in' },
  { id: 'tm-2', name: 'Rahul Mehta', role: 'Finance Manager', permission: 'Create payments up to ₹10,00,000', email: 'rahul@sharmaindustries.in' },
  { id: 'tm-3', name: 'Neha Kulkarni', role: 'Accounts Executive', permission: 'Create payments up to ₹1,00,000', email: 'neha@sharmaindustries.in' },
  { id: 'tm-4', name: 'Imran Shaikh', role: 'Auditor', permission: 'View & export only', email: 'imran@sharmaindustries.in' },
]
