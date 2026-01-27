"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onClose?: () => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onClose,
  ...props
}: CalendarProps) {
  const handleTodayClick = () => {
    if (props.onSelect) {
      const onSelect = props.onSelect as (date: Date | undefined) => void;
      onSelect(new Date());
    }
  };

  const handleClearClick = () => {
    if (props.onSelect) {
      const onSelect = props.onSelect as (date: Date | undefined) => void;
      onSelect(undefined);
    }
  };

  const footer = (
    <div className="flex items-center justify-between pt-3 mt-2 border-t">
      <Button variant="ghost" size="sm" onClick={handleTodayClick} className="text-primary hover:text-primary font-semibold">
        Today
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClearClick} className="text-destructive hover:text-destructive font-semibold">
        Clear
      </Button>
      <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground font-semibold">
        Close
      </Button>
    </div>
  );
  
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      footer={footer}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
