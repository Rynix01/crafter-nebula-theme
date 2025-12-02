import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

// Alert types
export type StaticAlertType = "success" | "error" | "warning" | "info"

// Static Alert component props
interface StaticAlertProps {
  message: string
  type?: StaticAlertType
  title?: string
}

// Icon mapping for different alert types
const alertIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

// Color mapping for different alert types - using theme-compatible colors
const alertColors = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
}

// Background color mapping for different alert types - using theme-compatible colors
const alertBgColors = {
  success: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
  warning: "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
}

// Static Alert component
const StaticAlert: React.FC<StaticAlertProps> = ({
  message,
  type = "info",
  title,
}) => {
  const IconComponent = alertIcons[type]
  const iconColor = alertColors[type]
  const bgColor = alertBgColors[type]

  return (
    <div className={cn("border rounded-lg p-4", bgColor)}>
      <div className="flex items-start gap-3">
        <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium text-sm mb-1 text-foreground">
              {title}
            </h4>
          )}
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StaticAlert;
