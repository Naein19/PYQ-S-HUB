'use client'

import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import Button from './ui/Button'
import { cn } from '@/lib/utils'

interface ConfirmActionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'primary'
    isLoading?: boolean
}

export default function ConfirmActionModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'primary',
    isLoading = false
}: ConfirmActionModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 sm:p-4">
            <div 
                className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={!isLoading ? onClose : undefined} 
            />
            
            <div className={cn(
                "relative w-full max-w-md bg-[var(--color-card)] border-4 rounded-sm shadow-[20px_20px_0px_var(--color-border)] overflow-hidden animate-in zoom-in-95 duration-200",
                variant === 'danger' ? "border-red-600" : "border-[var(--color-border)]"
            )}>
                <div className={cn(
                    "px-6 py-4 flex items-center justify-between text-white",
                    variant === 'danger' ? "bg-red-600" : "bg-[#111827]"
                )}>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {title.toUpperCase()}
                    </span>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="hover:rotate-90 transition-transform disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 sm:p-10">
                    <p className="text-sm font-bold text-[var(--color-text)] uppercase tracking-tight mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={onConfirm}
                            isLoading={isLoading}
                            variant={variant === 'danger' ? 'primary' : 'primary'} // Standard primary Button looks good
                            className={cn(
                                "flex-1 py-4 text-xs font-black uppercase tracking-widest",
                                variant === 'danger' && "bg-red-600 border-red-600 hover:bg-red-700"
                            )}
                        >
                            {confirmText.toUpperCase()}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-8 py-4 text-xs font-black uppercase tracking-widest"
                        >
                            {cancelText.toUpperCase()}
                        </Button>
                    </div>
                </div>

                <div className="bg-[var(--color-text)]/5 border-t border-[var(--color-border)]/10 px-6 py-2 flex items-center justify-end font-mono text-[8px] font-black text-[var(--color-text)]/30 uppercase tracking-[0.4em]">
                    <span>SECURITY_CLEARANCE_REQUIRED</span>
                </div>
            </div>
        </div>
    )
}
