import { Link } from 'react-router-dom'
import { useAdminPerformers, useAdminInquiries } from '@talent/sdk'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'

export function AdminDashboard() {
  const { data: performersData, isLoading: loadingPerformers } = useAdminPerformers({ limit: 100 })
  const { data: inquiriesData, isLoading: loadingInquiries } = useAdminInquiries({ limit: 100 })

  const performers = performersData?.pages.flatMap((p) => p.data) ?? []
  const inquiries = inquiriesData?.pages.flatMap((p) => p.data) ?? []

  const published = performers.filter((p) => p.isPublished).length
  const featured = performers.filter((p) => p.isFeatured).length
  const pending = performers.filter((p) => !p.isPublished).length

  const stats = [
    { label: 'Total Performers', value: performers.length, href: '/admin/performers' },
    { label: 'Published', value: published, href: '/admin/performers' },
    { label: 'Pending Review', value: pending, href: '/admin/performers' },
    { label: 'Featured', value: featured, href: '/admin/performers' },
  ]

  const recentInquiries = inquiries.slice(0, 6)

  return (
    <div>
      <FadeIn>
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Overview</p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight-display uppercase text-foreground mb-12 leading-none">
          Dashboard
        </h1>
      </FadeIn>

      {/* Stats grid — connected border */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-black mb-16">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="group bg-background p-6 border-b border-r border-black hover:bg-black transition-colors duration-100"
            >
              {loadingPerformers ? (
                <Skeleton className="h-10 w-16 mb-3" />
              ) : (
                <p className="font-display text-4xl font-extrabold text-foreground group-hover:text-white mb-3 leading-none">
                  {stat.value}
                </p>
              )}
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground group-hover:text-white/60 transition-colors">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* Recent inquiries */}
      <FadeIn delay={0.2}>
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">Recent Inquiries</p>
          <Link
            to="/admin/inquiries"
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            All →
          </Link>
        </div>

        {loadingInquiries ? (
          <div className="border-t border-l border-black">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full border-b border-r border-black" />
            ))}
          </div>
        ) : recentInquiries.length === 0 ? (
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground py-8 border-t border-black">
            No inquiries yet.
          </p>
        ) : (
          <div className="border-t border-l border-black">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex items-center gap-4 px-4 py-3 border-b border-r border-black bg-background hover:bg-muted transition-colors"
              >
                <span className="font-sans text-sm text-foreground w-40 truncate shrink-0">{inq.name}</span>
                <span className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground truncate flex-1">{inq.email}</span>
                <span className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground w-28 text-right shrink-0">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  )
}
