import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { toIsoDate } from "../../lib/date";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  /** ISO yyyy-mm-dd, or "" for no date. */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  /** Show a "clear" action when a date is set. */
  clearable?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  clearable = true,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex flex-1 items-center gap-2 rounded-[var(--radius-inner)] bg-surface-muted px-3.5 py-2.5 text-sm outline-none transition-colors",
              "focus:bg-surface-sunken focus:ring-2 focus:ring-accent/40 data-[state=open]:bg-surface-sunken",
              value ? "text-ink" : "text-ink-faint",
            )}
          >
            <CalendarClock size={15} className="shrink-0 text-ink-faint" />
            <span className="flex-1 text-left">
              {selected ? format(selected, "dd/MM/yyyy", { locale: vi }) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => {
              onChange(d ? toIsoDate(d) : "");
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {clearable && value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 rounded-[var(--radius-inner)] bg-surface-muted px-3 py-2.5 text-xs font-medium text-ink-soft transition-colors hover:bg-surface-hover"
        >
          Bỏ
        </button>
      ) : null}
    </div>
  );
}
