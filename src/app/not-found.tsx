import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-6xl font-extrabold text-primary">404</h1>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Page Not Found</h2>
                <p className="text-muted-foreground text-lg">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="pt-4">
                    <Link href="/">
                        <Button size="lg" className="w-full sm:w-auto">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
