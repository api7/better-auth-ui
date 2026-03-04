"use client"

import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"

type PrefixedSlugInputProps = {
    slugPrefix?: string
    field: ComponentProps<typeof Input>
    placeholder: string
    className?: string
}

export function PrefixedSlugInput({
    slugPrefix,
    field,
    placeholder,
    className
}: PrefixedSlugInputProps) {
    const { className: fieldClassName, ...inputProps } = field

    if (slugPrefix) {
        return (
            <div
                className={cn(
                    "flex h-9 w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30"
                )}
            >
                <div className="shrink-0 px-3 text-muted-foreground text-sm">
                    {slugPrefix}
                </div>
                <div className="h-full w-px bg-border" />
                <Input
                    className={cn(
                        "h-full rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        className,
                        fieldClassName
                    )}
                    placeholder={placeholder}
                    {...inputProps}
                />
            </div>
        )
    }

    return (
        <Input
            className={cn(className, fieldClassName)}
            placeholder={placeholder}
            {...inputProps}
        />
    )
}
