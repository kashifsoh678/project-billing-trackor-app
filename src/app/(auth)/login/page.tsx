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
import { useAuth } from '@/context/auth-context'
import { loginSchema } from '@/lib/validators'
import { toast } from 'react-hot-toast'

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
    const { login } = useAuth()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data)
            toast.success('Login successful! Welcome back.')
        } catch (error) {
            const apiError = error as { response?: { data?: { error?: string } } };
            const message = apiError.response?.data?.error || 'Login failed. Please check your credentials.';
            toast.error(message);
            setError('root', { message });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 auth-gradient ">
            <Card className="w-full max-w-md  border-white/10">
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
                            required
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            error={errors.password?.message}
                            required
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