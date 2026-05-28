import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function PublicShell() {
  const location = useLocation()

  const navLinkClass = (path: string) =>
    cn(
      'font-mono text-label-mono tracking-agency uppercase transition-colors',
      location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
        ? 'text-foreground underline decoration-1 underline-offset-4'
        : 'text-muted-foreground hover:text-foreground',
    )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background border-b border-black">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4 md:px-16 h-16">
          <Link
            to="/"
            className="font-mono text-label-mono font-bold tracking-agency text-foreground"
          >
            TALENT / AGENCY
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/roster" className={navLinkClass('/roster')}>Roster</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
          </nav>

          <Link
            to="/login"
            className="font-mono text-label-mono font-bold tracking-agency uppercase px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-100"
          >
            Login
          </Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-black bg-background">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto px-4 md:px-16 py-12 gap-6">
          <div className="font-mono text-label-mono font-bold tracking-agency text-foreground">
            TALENT / AGENCY
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/roster" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">Roster</Link>
            <Link to="/about" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="font-mono text-label-mono tracking-agency text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
          <div className="font-mono text-label-mono tracking-agency text-muted-foreground">
            ©2025 TALENT / AGENCY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AdminShell() {
  const location = useLocation()

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
        <div className="px-6 py-4 border-t border-black">
          <Link
            to="/"
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Public Site
          </Link>
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
      <header className="border-b border-black px-8 py-5 flex items-center justify-between">
        <Link to="/" className="font-mono text-label-mono font-bold tracking-agency uppercase text-foreground">
          TALENT / AGENCY
        </Link>
        <span className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">My Profile</span>
      </header>
      <main className="max-w-3xl mx-auto px-8 py-16">
        <Outlet />
      </main>
    </div>
  )
}
