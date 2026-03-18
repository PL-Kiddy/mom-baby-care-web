import { useEffect } from 'react'
import { IconX } from './Icons'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#0b0e18]/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-pink-200/50 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-[#fce7ef] px-6 py-4">
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-background-light hover:text-text-main transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
