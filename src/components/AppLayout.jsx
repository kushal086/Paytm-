import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import DemoTour, { DEMO_STEPS } from './DemoTour'
import { ToastStack } from './ui'
import { usePayments } from '../context/PaymentsContext'
import { suppliers } from '../data/mockData'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { toasts, dismissToast, approvalQueue, draft, startPayment, submitForApproval } = usePayments()

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [location.pathname])

  // The demo must never land on an empty form, so it seeds the flagship
  // payment before walking into the create / review / approve screens.
  const seedDemoPayment = useCallback(() => {
    const abc = suppliers.find((s) => s.id === 'sup-abc')
    const existing = draft && draft.supplierId === abc.id ? draft : null
    if (existing) return existing
    return startPayment({
      supplierId: abc.id,
      recipient: abc.name,
      recipientShort: abc.shortName,
      amount: 480000,
      reference: 'INV-4821',
      category: 'Supplier',
      date: 'Today',
      invoiceFile: 'INV-4821.pdf',
    })
  }, [draft, startPayment])

  const goToStep = useCallback(
    (index) => {
      const step = DEMO_STEPS[index]
      if (!step) return
      const payment = index >= 1 ? seedDemoPayment() : null
      if (index === 3) {
        // The owner can only approve what has actually been submitted.
        submitForApproval(payment)
      }
      setDemoStep(index)
      navigate(step.route)
    },
    [navigate, seedDemoPayment, submitForApproval],
  )

  const startDemo = useCallback(() => {
    if (demoStep !== null) {
      setDemoStep(null)
      return
    }
    setDemoStep(0)
    navigate(DEMO_STEPS[0].route)
  }, [demoStep, navigate])

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pendingApprovals={approvalQueue.length}
      />

      <div className="lg:pl-[264px]">
        <TopNavbar
          onMenu={() => setMenuOpen(true)}
          onStartDemo={startDemo}
          demoActive={demoStep !== null}
        />
        <main className="mx-auto w-full max-w-[1320px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>

      {demoStep !== null && (
        <DemoTour
          step={demoStep}
          onNext={() => goToStep(demoStep + 1)}
          onBack={() => goToStep(demoStep - 1)}
          onExit={() => setDemoStep(null)}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
