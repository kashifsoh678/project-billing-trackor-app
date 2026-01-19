import React, { useState } from 'react'
import { Eye, EyeOff, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type, required, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === 'password'
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={inputType}
                        className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 mt-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50',
                            (isPassword || type === 'date') && 'pr-10',
                            error && 'border-destructive',
                            className
                        )}
                        ref={ref}
                        aria-required={required}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                        >
                            {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                    {type === 'date' && (
                        <button
                            type="button"
                            onClick={(e) => {
                                const input = e.currentTarget.parentElement?.querySelector('input')
                                if (input && 'showPicker' in input) {
                                    (input as HTMLInputElement).showPicker()
                                }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                        >
                            <Calendar size={18} />
                        </button>
                    )}
                </div>
                {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
