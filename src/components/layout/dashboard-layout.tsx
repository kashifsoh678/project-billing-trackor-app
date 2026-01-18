'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderKanban, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Navbar from './navbar'

const SidebarItem = ({
    icon: Icon,
    label,
    href,
    isActive,
}: {
    icon: React.ElementType
    label: string
    href: string
    isActive?: boolean
}) => {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
        >
            <Icon size={20} className={cn(isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
            <span className="font-medium">{label}</span>
        </Link>
    )
}

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const pathname = usePathname()

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: FolderKanban, label: 'Projects', href: '/projects' },
    ]

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                            B
                        </div>
                        <span className="text-xl font-bold tracking-tight">BillTrack</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            isActive={pathname.startsWith(item.href)}
                        />
                    ))}
                </div>


            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                <Navbar />

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
