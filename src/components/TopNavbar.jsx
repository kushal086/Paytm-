import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Menu, Play, Search, ShieldCheck } from 'lucide-react'
import { business, currentUser, notifications } from '../data/mockData'
import { Avatar } from './ui'

export default function TopNavbar({ onMenu, onStartDemo, demoActive }) {
  const navigate = useNavigate()
  const [openPanel, setOpenPanel] = useState(null)
  const wrapRef = useRef(null)
  const unread = notifications.filter((n) => n.unread).length

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenPanel(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toneDot = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    sky: 'bg-paytm-sky',
    slate: 'bg-slate-400',
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg p-2 text-ink-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search suppliers, invoices, UTR…"
            className="input h-11 py-0 pl-10 text-[14px]"
            onFocus={() => setOpenPanel(null)}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 lg:block">
            ⌘K
          </kbd>
        </div>

        <div className="flex-1 md:hidden" />

        <div ref={wrapRef} className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={onStartDemo}
            className={[
              'btn hidden h-10 items-center gap-2 rounded-xl px-3.5 text-[13px] font-bold transition sm:inline-flex',
              demoActive
                ? 'bg-paytm-sky text-white'
                : 'bg-paytm-50 text-paytm-navy ring-1 ring-paytm-200 hover:bg-paytm-100',
            ].join(' ')}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            View Demo
          </button>

          <button
            type="button"
            onClick={onStartDemo}
            aria-label="View demo"
            className="btn h-10 w-10 rounded-xl bg-paytm-50 text-paytm-navy ring-1 ring-paytm-200 sm:hidden"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
          </button>

          <button
            type="button"
            className="rounded-xl p-2.5 text-ink-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === 'notif' ? null : 'notif')}
              className="relative rounded-xl p-2.5 text-ink-700 transition hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {openPanel === 'notif' && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[min(360px,calc(100vw-2rem))] animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">Notifications</p>
                  <span className="text-[11px] font-semibold text-paytm-sky">Mark all read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setOpenPanel(null)
                        navigate('/approvals')
                      }}
                      className="flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[n.tone]}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-snug text-ink-900">{n.title}</span>
                        <span className="mt-0.5 block truncate text-[12px] text-slate-500">{n.body}</span>
                        <span className="mt-1 block text-[11px] text-slate-400">{n.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
              className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2 transition hover:bg-slate-100"
            >
              <Avatar name={business.name} size="sm" />
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-[13px] font-bold text-ink-900">{business.name}</span>
                <span className="block text-[11px] text-slate-500">{currentUser.role}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
            </button>

            {openPanel === 'profile' && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[min(300px,calc(100vw-2rem))] animate-scale-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                <div className="border-b border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={business.name} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink-900">{business.legalName}</p>
                      <p className="truncate text-[12px] text-slate-500">GSTIN {business.gstin}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    KYC verified · {business.plan}
                  </div>
                </div>
                <div className="p-2">
                  <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Signed in as
                  </p>
                  <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                    <Avatar name={currentUser.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink-900">{currentUser.name}</p>
                      <p className="truncate text-[11.5px] text-slate-500">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenPanel(null)
                      navigate('/settings')
                    }}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-ink-700 transition hover:bg-slate-100"
                  >
                    Business settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
