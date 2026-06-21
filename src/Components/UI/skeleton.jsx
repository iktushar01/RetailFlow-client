import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[skeleton-shimmer_1.5s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-background/50 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
