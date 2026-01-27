"use client"

import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isSameDay,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  className?: string
  mode?: "single"
  selected?: Date
  onSelect?: (date?: Date) => void
  disabled?: (date: Date) => boolean
  onClose?: () => void
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled: disabledProp,
  onClose,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateSelect = (day: Date) => {
    if (onSelect) {
      onSelect(day)
    }
  }

  const handleTodayClick = () => {
    if (onSelect) {
      const today = new Date();
      setCurrentMonth(today);
      onSelect(today);
    }
  };
    
  const handleClearClick = () => {
    if (onSelect) {
        onSelect(undefined);
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfWeek = getDay(monthStart) // 0=Sun, 1=Mon,...

    const blanks = Array(firstDayOfWeek).fill(null)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const totalSlots = [...blanks, ...days]

    const rows: (number | null)[][] = []
    let cells: (number | null)[] = []

    totalSlots.forEach((slot, i) => {
      cells.push(slot)
      if ((i + 1) % 7 === 0) {
        rows.push(cells)
        cells = []
      }
    })
    if (cells.length > 0) {
      rows.push(cells)
    }

    const lastRow = rows[rows.length-1];
    while(lastRow.length < 7) {
        lastRow.push(null);
    }

    return (
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((day, j) => {
              if (!day) {
                return <td key={j} className="border border-border" />
              }

              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              )

              const isSelected = selected && isSameDay(date, selected)
              const isCurrentDay = isToday(date)
              let isDisabled = false
              if (typeof disabledProp === 'function') {
                  isDisabled = disabledProp(date)
              }

              return (
                <td key={j} className={cn("border border-border p-0 text-center h-12 w-12", isDisabled && "text-muted-foreground")}>
                  <button
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    disabled={isDisabled}
                    className={cn(
                      "w-full h-full min-h-[40px] text-sm",
                      "hover:bg-accent/50 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                      {
                        "bg-primary text-primary-foreground font-bold hover:bg-primary/90": isSelected,
                        "bg-muted": !isSelected && isCurrentDay,
                      }
                    )}
                  >
                    {day}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <div className={cn("p-3 w-full bg-background", className)}>
      <div className="flex justify-center items-center relative mb-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 absolute left-0" onClick={handlePrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold uppercase text-center">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-0" onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <th key={day} className="p-2 border border-border text-center text-sm font-bold uppercase text-muted-foreground">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        {renderCells()}
      </table>
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleTodayClick} className="text-primary hover:text-primary font-semibold">
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearClick} className="text-destructive hover:text-destructive font-semibold">
            Clear
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground font-semibold">
              Close
            </Button>
          )}
        </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
