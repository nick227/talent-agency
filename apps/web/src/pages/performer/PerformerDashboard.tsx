import { Link } from 'react-router-dom'
import { useMyPerformerProfile, useCurrentUser } from '@talent/sdk'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'

export function PerformerDashboard() {
  const { data: me } = useCurrentUser()
  const { data, isLoading } = useMyPerformerProfile()
  const profile = data?.data

  return (
    <div>
      <FadeIn>
        <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-8">
          Welcome back
        </p>
        <h1 className="font-display font-300 tracking-tight-display text-foreground text-4xl md:text-5xl leading-none mb-16">
          {isLoading ? <Skeleton className="h-12 w-64" /> : profile?.displayName ?? me?.data?.email}
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : profile ? (
          <div className="space-y-px max-w-lg">
            {/* Status */}
            <div className="bg-surface px-4 py-5 flex items-center justify-between">
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Profile Status</p>
              <p className="text-xs tracking-agency uppercase text-foreground">
                {profile.isPublished ? 'Published' : 'Not Published'}
              </p>
            </div>

            {profile.isFeatured && (
              <div className="bg-surface px-4 py-5 flex items-center justify-between">
                <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Featured</p>
                <p className="text-xs text-foreground">On Homepage</p>
              </div>
            )}

            <div className="bg-surface px-4 py-5 flex items-center justify-between">
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Category</p>
              <p className="text-xs tracking-agency uppercase text-foreground">{profile.category}</p>
            </div>

            {profile.location && (
              <div className="bg-surface px-4 py-5 flex items-center justify-between">
                <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Location</p>
                <p className="text-xs text-foreground">{profile.location}</p>
              </div>
            )}

            <div className="bg-surface px-4 py-5 flex items-center justify-between">
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Portfolio Items</p>
              <p className="text-xs text-foreground">{profile.mediaItems?.length ?? 0}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Your performer profile hasn't been set up yet. Contact your agent.
          </p>
        )}
      </FadeIn>

      {profile?.isPublished && (
        <FadeIn delay={0.2}>
          <div className="mt-12">
            <Link
              to={`/performers/${profile.id}`}
              className="text-xs tracking-agency uppercase text-foreground border-b border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
            >
              View Public Profile →
            </Link>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
