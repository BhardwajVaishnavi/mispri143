import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning"
  title?: string
  description?: string
}

export function Alert({ 
  className, 
  variant = "default", 
  title,
  description,
  ...props 
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${className}`}
      {...props}
    >
      {title && <h5 className="mb-1 font-medium">{title}</h5>}
      {description && <div className="text-sm">{description}</div>}
    </div>
  )
}