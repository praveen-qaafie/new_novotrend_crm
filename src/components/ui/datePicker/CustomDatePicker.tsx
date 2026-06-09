"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CustomDatePickerProps {
  label?: string;
  selected: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomDatePicker({
  label,
  selected,
  onChange,
  placeholder = "Select Date",
  disabled = false,
  className = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Label */}
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}

      {/* Input Field */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-700 shadow-sm transition-all hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
      >
        <span>{selected ? format(selected, "dd/MM/yyyy") : placeholder}</span>

        <CalendarIcon size={18} className="text-gray-500" />
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            captionLayout="dropdown"
            // fromYear={1990}
            // toYear={2035}
          />
        </div>
      )}
    </div>
  );
}
