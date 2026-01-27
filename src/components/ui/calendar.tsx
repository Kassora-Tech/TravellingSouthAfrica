"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, CaptionLabelProps } from "react-day-picker"
import { format, isValid } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomCaptionLabel({ displayMonth }: CaptionLabelProps) {
    if (!isValid(displayMonth)) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 text-lg">
            <span className="font-bold text-muted-foreground">{format(displayMonth, "MM")}</span>
            <span className="font-bold uppercase">{format(displayMonth, "MMMM")}</span>
            <span className="font-bold text-muted-foreground">{format(displayMonth, "yyyy")}</span>
        </div>
    )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "hidden", // We use a component to render the label
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 border-b",
        head_cell:
          "text-muted-foreground font-bold text-xs uppercase text-center p-2",
        row: "grid grid-cols-7 w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-full font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: CustomCaptionLabel,
      }}
      formatters={{
        formatWeekdayName: (day) => format(day, 'EEE').toUpperCase(),
      }}
      weekStartsOn={0} // Sunday
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
