import { cn } from "@/lib/utils"
import { RiLoaderLine } from "@remixicon/react"
import type { SVGProps } from "react"

function Spinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <RiLoaderLine data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
