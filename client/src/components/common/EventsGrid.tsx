import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Calendar, MapPin, Users, Globe } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/event.types";
import { useNavigate } from "react-router-dom";

interface EventsGridProps {
  events?: Event[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  totalCount?: number;
}

export function EventsGrid({
  events = [],
  loading = false,
  error,
  onRefresh,
  onLoadMore,
  hasMore = false,
  totalCount = 0,
}: EventsGridProps) {
  // const [sortBy, setSortBy] = useState("date");
  // const [likedEvents, setLikedEvents] = useState<number[]>([]);

  // const toggleLike = (eventId: number) => {
  //   setLikedEvents((prev) =>
  //     prev.includes(eventId)
  //       ? prev.filter((id) => id !== eventId)
  //       : [...prev, eventId]
  //   );
  // };

  const navigate = useNavigate();

  const getMinPrice = (tickets: Event["tickets"]): number => {
    if (!tickets || tickets.length === 0) return 0;
    return Math.min(...tickets.map((ticket) => ticket.price));
  };

  const formatLocation = (event: Event): string => {
    if (event.isOnline) return "Online";
    if (event.location) {
      return `${event.location.venue}, ${event.location.city}, ${event.location.state}`;
    }
    return "Location TBD";
  };

  const handleViewDetails = (id: string) => {
    navigate("/event", { state: { eventId: id } });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-2">Error loading events</p>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Loading events...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing {events.length} of {totalCount} event
          {totalCount !== 1 ? "s" : ""}
          {loading && <span className="ml-2">(Loading...)</span>}
        </p>
        {/* <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {events.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No events found</p>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => {
              const minPrice = getMinPrice(event.tickets);
              const maxPrice =
                event.tickets.length > 0
                  ? Math.max(...event.tickets.map((ticket) => ticket.price))
                  : 0;
              const locationString = formatLocation(event);

              return (
                <Card
                  key={event.id}
                  className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=200&width=300";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-900"
                      >
                        {event.category}
                      </Badge>
                    </div>
                    {event.isOnline && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          <Globe className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                    )}
                    {/* <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => toggleLike(event.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedEvents.includes(event.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div> */}
                    {event.status === "featured" && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {event.organizer?.name || "Unknown Organizer"}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {format(
                              new Date(event.startDateTime),
                              "MMM dd, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{locationString}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{event.attendeesCount} attending</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{event.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-lg font-bold text-emerald-600">
                          {minPrice === 0
                            ? "Free"
                            : minPrice === maxPrice
                            ? `₹${minPrice}`
                            : `₹${minPrice} - ₹${maxPrice}`}
                        </div>
                        <Button
                          onClick={() => handleViewDetails(event.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {hasMore && events.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Events"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
