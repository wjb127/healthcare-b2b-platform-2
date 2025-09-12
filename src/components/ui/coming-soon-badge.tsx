import { Badge } from "./badge"

interface ComingSoonBadgeProps {
  text?: string
  className?: string
}

export function ComingSoonBadge({ text = "준비 중", className = "" }: ComingSoonBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`bg-slate-100 text-slate-500 border-slate-300 text-xs ${className}`}
    >
      {text}
    </Badge>
  )
}