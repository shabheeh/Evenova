import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCATIONS } from "@/constants/locations";
import { useState } from "react";

export function HeroSection() {
  const [location, setLocation] = useState<string | null>(null);
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Discover & Create{" "}
            <span className="text-primary">Extraordinary Events</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join millions who trust Evenova for their event experiences. Find
            amazing events near you or create your own unforgettable moments.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-card rounded-2xl shadow-lg border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search events in your area..."
                  className="pl-12 h-12 text-lg border-0 bg-background"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-6 whitespace-nowrap bg-transparent text-muted-foreground cursor-pointer"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    {location ? location : "Choose Location"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {LOCATIONS.map((loc) => (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`cursor-pointer ${
                        location === loc
                          ? "bg-muted font-medium"
                          : ""
                      }`}
                    >
                      {loc}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="h-12 px-8 text-lg font-semibold cursor-pointer">
                Search Events
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Music",
              "Business",
              "Food & Drink",
              "Sports",
              "Arts",
              "Technology",
            ].map((category) => (
              <Button
                key={category}
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
