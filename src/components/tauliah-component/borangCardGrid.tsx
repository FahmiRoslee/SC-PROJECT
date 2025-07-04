"use client"

import { FormCard, type FormCardData } from "./borangCard"
import { cn } from "@components/lib/utils"

interface FormCardsGridProps {
  forms: FormCardData[]
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function FormCardsGrid({ forms, className, columns = 3 }: FormCardsGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-8", gridClasses[columns], className)}>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  )
}
