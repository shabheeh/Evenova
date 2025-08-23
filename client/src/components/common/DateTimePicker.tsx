import dayjs from "dayjs";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useEffect, useState } from "react";

dayjs.extend(isSameOrAfter);

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hourCycle?: 12 | 24;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled = false,
  className,
  hourCycle = 24,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value
  );

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "";
    const dayjsDate = dayjs(date);
    const dateStr = dayjsDate.format("MMMM D, YYYY");
    const timeStr =
      hourCycle === 12 ? dayjsDate.format("h:mm A") : dayjsDate.format("HH:mm");
    return `${dateStr} at ${timeStr}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const currentTime = selectedDate
        ? dayjs(selectedDate)
        : dayjs().startOf("day");

      const newDateTime = dayjs()
        .year(year)
        .month(month)
        .date(day)
        .hour(currentTime.hour())
        .minute(currentTime.minute())
        .second(0)
        .millisecond(0);

      const jsDate = newDateTime.toDate();
      setSelectedDate(jsDate);
      onChange?.(jsDate);
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const currentDate = selectedDate ? dayjs(selectedDate) : dayjs();
    const newDateTime = currentDate
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0);

    const jsDate = newDateTime.toDate();
    setSelectedDate(jsDate);
    onChange?.(jsDate);
  };

  const isAfterToday = (date: Date) => {
    const todayStart = dayjs().startOf("day");
    return dayjs(date).isSameOrAfter(todayStart, "day");
  };

  const hours =
    hourCycle === 12
      ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))
      : Array.from({ length: 24 }, (_, i) => i);

  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const getCurrentHour = () => {
    if (!selectedDate) return hourCycle === 12 ? 12 : 0;
    const hour = dayjs(selectedDate).hour();
    return hourCycle === 12
      ? hour === 0
        ? 12
        : hour > 12
        ? hour - 12
        : hour
      : hour;
  };

  const getCurrentMinute = () =>
    selectedDate ? dayjs(selectedDate).minute() : 0;

  const getPeriod = () => {
    if (!selectedDate || hourCycle === 24) return "AM";
    return dayjs(selectedDate).hour() >= 12 ? "PM" : "AM";
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left flex items-center gap-2 cursor-pointer",
              !selectedDate && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
            {selectedDate ? formatDateTime(selectedDate) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => !isAfterToday(date)}
            initialFocus
            className="[&_.rdp-day_selected:not(.rdp-day_today)]:bg-transparent [&_.rdp-day_selected:not(.rdp-day_today)]:border-primary [&_.rdp-day_selected:not(.rdp-day_today)]:border-2 [&_.rdp-day_selected:not(.rdp-day_today)]:text-primary [&_.rdp-day_selected:not(.rdp-day_today)]:font-medium"
          />

          <div className="p-3 border-t">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={getCurrentHour().toString()}
                  onValueChange={(hour) => {
                    let hourNum = parseInt(hour);
                    if (hourCycle === 12) {
                      const period = getPeriod();
                      if (hourNum === 12) {
                        hourNum = period === "AM" ? 0 : 12;
                      } else {
                        hourNum = period === "AM" ? hourNum : hourNum + 12;
                      }
                    }
                    handleTimeChange(hourNum, getCurrentMinute());
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span>:</span>

                <Select
                  value={getCurrentMinute().toString()}
                  onValueChange={(minute) => {
                    const currentHour = getCurrentHour();
                    let actualHour = currentHour;
                    if (hourCycle === 12) {
                      const period = getPeriod();
                      if (currentHour === 12) {
                        actualHour = period === "AM" ? 0 : 12;
                      } else {
                        actualHour =
                          period === "AM" ? currentHour : currentHour + 12;
                      }
                    }
                    handleTimeChange(actualHour, parseInt(minute));
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute.toString()}>
                        {minute.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hourCycle === 12 && (
                  <Select
                    value={getPeriod()}
                    onValueChange={(period: "AM" | "PM") => {
                      if (!selectedDate) return;
                      const currentDate = dayjs(selectedDate);
                      const currentHour = currentDate.hour();

                      let newHour = currentHour;
                      if (period === "AM" && currentHour >= 12) {
                        newHour = currentHour - 12;
                      } else if (period === "PM" && currentHour < 12) {
                        newHour = currentHour + 12;
                      }

                      handleTimeChange(newHour, getCurrentMinute());
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <Button onClick={() => setIsOpen(false)} className="w-full mt-3">
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
