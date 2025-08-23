import { useEffect, useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { LOCATIONS } from "@/constants/locations";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

interface EventsSearchProps {
  searchQuery: string;
  location: string;
  selectedDate: Date | undefined;
  onFiltersChange: (
    searchQuery: string,
    location: string,
    selectedDate: Date | undefined
  ) => void;
}

export const EventsSearch = ({
  searchQuery,
  location,
  selectedDate,
  onFiltersChange,
}: EventsSearchProps) => {

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localLocation, setLocalLocation] = useState(location);
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | undefined>(
    selectedDate
  );

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setLocalLocation(location);
    setLocalSelectedDate(selectedDate);
  }, [searchQuery, location, selectedDate]);

  const handleSearch = () => {
    onFiltersChange(localSearchQuery, localLocation, localSelectedDate);
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(localSearchQuery, localLocation, localSelectedDate);
    }, 300); 

    return () => clearTimeout(timer);
  }, [localSearchQuery, localLocation, localSelectedDate, onFiltersChange]);

  const isAfterToday = (date: Date) => {
    const todayStart = dayjs().startOf("day");
    return dayjs(date).isSameOrAfter(todayStart, "day");
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Select value={localLocation} onValueChange={setLocalLocation}>
            <SelectTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem
                  key={loc}
                  value={loc.toLowerCase().replace(/\s+/g, "-")}
                >
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left flex items-center text-muted-foreground gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {localSelectedDate
                  ? format(localSelectedDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarPicker
                mode="single"
                selected={localSelectedDate}
                onSelect={setLocalSelectedDate}
                disabled={(date) => !isAfterToday(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSearch}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            Search Events
          </Button>
        </div>
      </div>
    </div>
  );
};
