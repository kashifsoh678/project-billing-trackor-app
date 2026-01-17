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

const signupSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string().min(8, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type SignupFormValues = z.infer<typeof signupSchema>

const SignupPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: SignupFormValues) => {
        console.log('Signup data:', data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 ">
            <Card className="w-full max-w-md glass border-white/10">
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
                            {...register('name')}
                        />
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
                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            type="password"
                            error={errors.confirmPassword?.message}
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