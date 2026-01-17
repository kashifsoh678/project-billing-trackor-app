'use client'

import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { LogIn } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: LoginFormValues) => {
        console.log('Login data:', data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 ">
            <Card className="w-full max-w-md glass border-white/10">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <LogIn size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email"
                            placeholder="name@example.com"
                            type="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Button type="submit" size='lg' className="w-full text-lg font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage