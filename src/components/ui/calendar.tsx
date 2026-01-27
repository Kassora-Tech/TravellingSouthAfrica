"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
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
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground font-semibold">
          Close
        </Button>
      )}
    </div>
  );
  
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-bold uppercase",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "", // Use default table row display
        head_cell:
          "w-[14.28%] p-2 border border-gray-200 text-center text-xs font-bold uppercase text-muted-foreground",
        row: "", // Use default table row display
        cell: "p-0 border border-gray-200 text-center text-sm relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-full w-full min-h-[40px] rounded-none p-2 font-normal"
        ),
        day_selected:
          "!bg-primary !text-primary-foreground font-bold hover:!bg-primary/90",
        day_today: "bg-muted",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "cursor-not-allowed text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      footer={props.mode === 'single' ? footer : undefined}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
