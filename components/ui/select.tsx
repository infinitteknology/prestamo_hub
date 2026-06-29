import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export { Select }
