import { cn } from '@/lib/utils'
import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, required, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        className={cn(
                            'flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 mt-1 text-sm placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 resize-y',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className
                        )}
                        ref={ref}
                        required={required}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'

export { Textarea }
