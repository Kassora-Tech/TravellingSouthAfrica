"use client";

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface CustomCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  initialMonth?: Date;
  disabled?: (date: Date) => boolean;
}

export function CustomCalendar({
  selectedDate,
  onDateSelect,
  initialMonth,
  disabled,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialMonth || new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { year, month, daysInMonth, firstDayOfMonth, blanks } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...
    const blanks = Array(firstDayOfMonth).fill(null);
    return { year, month, daysInMonth, firstDayOfMonth, blanks };
  }, [currentDate]);

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const headerDate = currentDate.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
  }).toUpperCase();
  
  const monthNumber = (currentDate.getMonth() + 1).toString().padStart(2, '0');

  return (
    <div className="w-[350px] bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
            <div className="text-sm text-gray-500 font-bold">{monthNumber}</div>
            <div className="text-xl font-bold tracking-widest">{headerDate}</div>
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px calendar-grid">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-500 py-2 border-b">
            {day}
          </div>
        ))}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="border-r border-b"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = new Date(year, month, day);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isDisabled = disabled ? disabled(date) : false;

          return (
            <button
              key={day}
              disabled={isDisabled}
              onClick={() => onDateSelect(date)}
              className={cn(
                'relative text-center p-3 text-sm border-r border-b',
                'hover:bg-accent/50 disabled:text-muted-foreground disabled:hover:bg-transparent',
                {
                  'bg-primary text-primary-foreground hover:bg-primary/90': isSelected,
                  'bg-accent/30': isToday && !isSelected,
                  'cursor-not-allowed': isDisabled,
                }
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
