import * as React from "react"
import { cn } from "~/lib/utils"

export function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "text-[32px] font-[600]",
                className
            )}
            {...props}
        />
    )
}