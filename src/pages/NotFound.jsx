import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="card">
      <EmptyState
        icon={Compass}
        title="This screen isn't part of the prototype"
        body="Every screen in the core payment journey is reachable from the sidebar or the dashboard."
        action={
          <button type="button" className="btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        }
      />
    </div>
  )
}
