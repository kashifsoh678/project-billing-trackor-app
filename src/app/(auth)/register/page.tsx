'use client'

import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { registerSchema } from '@/lib/validators'
import { toast } from 'react-hot-toast'

type SignupFormValues = z.infer<typeof registerSchema>

const SignupPage: React.FC = () => {
    const { register: registerUser } = useAuth()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await registerUser(data)
            toast.success('Registration successful! Please sign in.')
        } catch (error) {
            const apiError = error as { response?: { data?: { error?: string } } };
            const message = apiError.response?.data?.error || 'Registration failed. Please try again.';
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
                            <UserPlus size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Sign up to start tracking your project billing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            required
                            {...register('name')}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="m@example.com"
                            error={errors.email?.message}
                            required
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            required
                            {...register('password')}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.confirmPassword?.message}
                            required
                            {...register('confirmPassword')}
                        />
                        <Button type="submit" size='lg' className="w-full text-lg font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
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
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignupPage