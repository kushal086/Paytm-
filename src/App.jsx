import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import MakePayment from './pages/MakePayment'
import SupplierPayment from './pages/SupplierPayment'
import PaymentReview from './pages/PaymentReview'
import OwnerApproval from './pages/OwnerApproval'
import PaymentSuccess from './pages/PaymentSuccess'
import Suppliers from './pages/Suppliers'
import SupplierDetail from './pages/SupplierDetail'
import Salaries from './pages/Salaries'
import Bills from './pages/Bills'
import Transactions from './pages/Transactions'
import Reconciliation from './pages/Reconciliation'
import BulkPayments from './pages/BulkPayments'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pay" element={<MakePayment />} />
        <Route path="/pay/supplier" element={<SupplierPayment />} />
        <Route path="/pay/review" element={<PaymentReview />} />
        <Route path="/pay/success/:id" element={<PaymentSuccess />} />
        <Route path="/approvals" element={<OwnerApproval />} />
        <Route path="/approvals/:id" element={<OwnerApproval />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
        <Route path="/salaries" element={<Salaries />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reconciliation" element={<Reconciliation />} />
        <Route path="/bulk-payments" element={<BulkPayments />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
