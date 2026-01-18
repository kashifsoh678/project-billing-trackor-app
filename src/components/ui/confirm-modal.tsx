'use client';

import React from 'react';
import Modal from './modal';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    isLoading = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="ghost" size='sm' onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}
                        disabled={isLoading}
                        size='sm'
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </Modal>
    );
};
