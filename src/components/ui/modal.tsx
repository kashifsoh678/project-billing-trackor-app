'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="relative w-full max-w-lg rounded-xl shadow-lg border border-border animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <CardHeader className='p-6 border-b border-border'>
                    <CardTitle className='text-lg font-semibold flex items-center justify-between   '>
                        {title}
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                            <X size={18} />
                        </Button>
                    </CardTitle>
                </CardHeader>

                <CardContent className='p-6'>
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}

export default Modal
