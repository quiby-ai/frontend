"use client"

import * as React from "react"
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: DateRange
  onValueChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const formatDate = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) {
      return placeholder
    }
    
    if (range.from && !range.to) {
      return formatDate(range.from)
    }
    
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`
    }
    
    return placeholder
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      
      // Ensure end date doesn't exceed today
      if (range.to && range.to > today) {
        range = { ...range, to: today }
      }
      
      // Ensure start date is before end date
      if (range.from && range.to && range.from > range.to) {
        range = { ...range, to: range.from }
      }
    }
    
    onValueChange(range)
    
    // Close when both dates are selected
    if (range?.from && range?.to) {
      setOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal h-12",
              !value && "text-muted-foreground",
              "rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20",
              "active:scale-[0.98] touch-manipulation"
            )}
            disabled={disabled}
          >
            <div className="flex items-center flex-1 min-w-0">
              <CalendarIcon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate font-medium">{formatDateRange(value)}</span>
            </div>
            <div className="ml-2 opacity-60 flex-shrink-0">
              {open ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="center"
          side="bottom"
          sideOffset={8}
        >
          <Calendar
            mode="range"
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={1}
            disabled={(date) => {
              const today = new Date()
              today.setHours(23, 59, 59, 999)
              return date > today
            }}
            initialFocus
            className="rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}