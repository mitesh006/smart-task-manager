import React, { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import gsap from 'gsap'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = true }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.05 }
      )
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-sm glass-card border-mist-800/50 rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        {/* Decorative Top Border */}
        <div className={`absolute top-0 left-0 w-full h-1 ${isDestructive ? 'bg-gradient-to-r from-rose-dim/50 via-rose to-rose-dim/50' : 'bg-gradient-to-r from-gold/50 via-gold to-gold/50'}`} />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${isDestructive ? 'bg-rose/10 text-rose' : 'bg-amber/10 text-amber'}`}>
            <AlertTriangle size={20} />
          </div>

          {/* Text content */}
          <div className="flex-1 mt-1">
            <h3 className="text-lg font-heading font-semibold text-mist-50 mb-2">
              {title}
            </h3>
            <p className="text-sm text-mist-400 leading-relaxed mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`btn-sm rounded-lg font-semibold px-4 py-2 transition-all duration-300 ${isDestructive ? 'bg-rose/10 text-rose hover:bg-rose hover:text-white border border-rose/20 hover:border-rose/50 shadow-[0_0_15px_rgba(244,63,94,0)] hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-gold/10 text-gold hover:bg-gold hover:text-void border border-gold/20 hover:border-gold/50'}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button (top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mist-600 hover:text-mist-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
