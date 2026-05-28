import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
      <p className="text-xs uppercase tracking-agency text-muted-foreground">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm max-w-xs font-sans">{description}</p>
      )}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
