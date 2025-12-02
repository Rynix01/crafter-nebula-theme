"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"

// Alert types
export type AlertType = "success" | "error" | "warning" | "info"

// Alert configuration interface
export interface AlertConfig {
  message: string
  type?: AlertType
  title?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
}

// Alert component props
interface AlertProps extends AlertConfig {
  isOpen: boolean
  onClose: () => void
}

// Icon mapping for different alert types
const alertIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

// Color mapping for different alert types
const alertColors = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
}

// Alert component
const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  title,
  confirmText = "Tamam",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  showCancel = false,
  isOpen,
  onClose,
}) => {
  const IconComponent = alertIcons[type]
  const iconColor = alertColors[type]

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <IconComponent className={cn("h-5 w-5", iconColor)} />
            {title && (
              <AlertDialogTitle className="text-left">
                {title}
              </AlertDialogTitle>
            )}
          </div>
          <AlertDialogDescription className="text-left">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel onClick={handleCancel}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Global alert function
export const alert = (config: AlertConfig): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create container for the alert
    const container = document.createElement("div")
    container.id = "alert-container"
    document.body.appendChild(container)

    // Create root
    const root = createRoot(container)

    let isOpen = true

    const handleClose = () => {
      isOpen = false
      root.unmount()
      document.body.removeChild(container)
      resolve(false)
    }

    const handleConfirm = () => {
      if (config.onConfirm) {
        config.onConfirm()
      }
      resolve(true)
    }

    const handleCancel = () => {
      if (config.onCancel) {
        config.onCancel()
      }
      resolve(false)
    }

    // Auto-close functionality
    if (config.autoClose !== false) {
      const delay = config.autoCloseDelay || 5000
      setTimeout(() => {
        if (isOpen) {
          handleClose()
        }
      }, delay)
    }

    // Render the alert
    root.render(
      <Alert
        {...config}
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    )
  })
}

// Convenience functions for different alert types
export const alertSuccess = (message: string, title?: string) =>
  alert({ message, type: "success", title })

export const alertError = (message: string, title?: string) =>
  alert({ message, type: "error", title })

export const alertWarning = (message: string, title?: string) =>
  alert({ message, type: "warning", title })

export const alertInfo = (message: string, title?: string) =>
  alert({ message, type: "info", title })

// Confirmation dialog
export const confirm = (
  message: string,
  title?: string,
  confirmText?: string,
  cancelText?: string
): Promise<boolean> =>
  alert({
    message,
    title,
    type: "warning",
    confirmText: confirmText || "Evet",
    cancelText: cancelText || "Hayır",
    showCancel: true,
  })

// Export the Alert component for direct use
export { Alert }
