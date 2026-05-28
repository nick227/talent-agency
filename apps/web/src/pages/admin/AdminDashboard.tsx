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

  const stats = [
    { label: 'Total Performers', value: performers.length, href: '/admin/performers' },
    { label: 'Published', value: published, href: '/admin/performers' },
    { label: 'Featured', value: featured, href: '/admin/performers' },
    { label: 'Total Inquiries', value: inquiries.length, href: '/admin/inquiries' },
  ]

  const recentInquiries = inquiries.slice(0, 5)

  return (
    <div>
      <FadeIn>
        <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-8">Overview</p>
        <h1 className="font-display font-300 tracking-tight-display text-foreground text-4xl md:text-5xl leading-none mb-12">
          Dashboard
        </h1>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-16">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="bg-background p-6 hover:bg-accent transition-colors group"
            >
              {loadingPerformers || loadingInquiries ? (
                <Skeleton className="h-10 w-16 mb-2" />
              ) : (
                <p className="font-display font-300 text-4xl text-foreground mb-2">{stat.value}</p>
              )}
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </FadeIn>

      {/* Recent inquiries */}
      <FadeIn delay={0.2}>
        <div className="flex items-baseline justify-between mb-6">
          <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Recent Inquiries</p>
          <Link to="/admin/inquiries" className="text-[10px] tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors">
            All →
          </Link>
        </div>

        {loadingInquiries ? (
          <div className="space-y-px">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : recentInquiries.length === 0 ? (
          <p className="text-xs text-muted-foreground py-8">No inquiries yet.</p>
        ) : (
          <div className="space-y-px">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="bg-surface flex items-center gap-6 px-4 py-3 text-xs">
                <span className="text-foreground font-sans font-400 w-36 truncate">{inq.name}</span>
                <span className="text-muted-foreground truncate flex-1">{inq.email}</span>
                <span className="text-[10px] tracking-agency uppercase text-muted-foreground w-28 text-right">
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
