import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SmokeTest({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 p-6", className)}>
      <p className="text-muted-foreground text-sm">registry smoke test</p>
      <Button>OK</Button>
    </div>
  )
}
