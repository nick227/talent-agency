import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useCurrentUser, useLogout } from '@talent/sdk'
import { toast } from 'sonner'

function SiteHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: me } = useCurrentUser()
  const logout = useLogout()
  const user = me?.data

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      toast.success('Signed out')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Logout failed')
    }
  }

  const navLinkClass = (path: string) =>
    cn(
      'font-mono text-label-mono tracking-agency uppercase transition-colors',
      location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
        ? 'text-foreground underline decoration-1 underline-offset-4'
        : 'text-muted-foreground hover:text-foreground',
    )

  const portalPath = user?.role === 'ADMIN' ? '/admin/performers' : '/dashboard'

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-black">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4 md:px-16 h-16">
        <Link
          to="/"
          className="font-mono text-label-mono font-bold tracking-agency text-foreground"
        >
          TALENT / AGENCY
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/talent" className={navLinkClass('/talent')}>Talent</Link>
          <Link to="/about" className={navLinkClass('/about')}>About</Link>
          <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={portalPath}
                className={navLinkClass(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
              >
                {user.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logout.isPending}
                className="font-mono text-label-mono font-bold tracking-agency uppercase px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-100 disabled:opacity-40"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden md:block font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Join
              </Link>
              <Link
                to="/login"
                className="font-mono text-label-mono font-bold tracking-agency uppercase px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-100"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-black bg-background">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto px-4 md:px-16 py-12 gap-6">
        <div className="font-mono text-label-mono font-bold tracking-agency text-foreground">
          TALENT / AGENCY
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/talent" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">Talent</Link>
          <Link to="/about" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
        </div>
        <div className="font-mono text-label-mono tracking-agency text-muted-foreground">
          ©2025 TALENT / AGENCY. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  )
}

export function PublicShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}

export function AdminShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useLogout()

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      toast.success('Signed out')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Logout failed')
    }
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/performers', label: 'Performers' },
    { to: '/admin/inquiries', label: 'Inquiries' },
  ]

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-56 shrink-0 border-r border-black flex flex-col">
        <div className="px-6 py-5 border-b border-black">
          <Link to="/" className="font-mono text-label-mono font-bold tracking-agency text-foreground">
            TALENT / AGENCY
          </Link>
          <p className="font-mono text-[11px] tracking-agency uppercase text-muted-foreground mt-1">Admin</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center px-6 py-3 font-mono text-label-mono tracking-agency uppercase transition-colors',
                  active
                    ? 'bg-black text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 py-4 border-t border-black space-y-3">
          <Link
            to="/"
            className="block font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Public Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PerformerShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-16 py-12">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
