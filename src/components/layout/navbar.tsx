'use client'

import React from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
    onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    // Mock user data
    const user = {
        name: 'Admin User',
        role: 'Admin',
        // In a real app, this would be a URL
        avatar: null
    }

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden -ml-2 text-muted-foreground"
                    onClick={onMenuClick}
                >
                    <Menu size={24} />
                </Button>
                {/* Brand or Page Title could go here if needed, but Sidebar has brand */}
                <span className="md:hidden text-lg font-bold">BillTrack</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end  w-40">
                        <p className="text-sm font-medium leading-none truncate line-clamp-1">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate line-clamp-1">{user.role}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                        <User size={18} />
                    </div>
                </div>

                <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    )
}

export default Navbar
