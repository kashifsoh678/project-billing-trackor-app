import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useAuth } from '@/context/auth-context'
import { LogOut, Menu, User } from 'lucide-react'
import React from 'react'
import { toast } from 'react-hot-toast'

interface NavbarProps {
    onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { user, logout } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            toast.success('Logged out successfully')
        } catch (error) {
            console.error('Failed to logout', error)
            toast.error('Failed to logout. Please try again.')
        } finally {
            setIsLoggingOut(false)
            setIsLogoutModalOpen(false)
        }
    }

    if (!user) return null

    return (
        <>
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
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                description="Are you sure you want to log out? You will need to sign in again to access your projects."
                confirmText="Logout"
                variant="danger"
                isLoading={isLoggingOut}
            />
        </>
    )
}

export default Navbar
