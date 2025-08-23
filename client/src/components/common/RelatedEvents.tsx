"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface RelatedEventsProps {
  currentEventId: string;
  category: string;
}

const getRelatedEvents = (category: string, currentId: string) => {
  const allEvents = [
    {
      id: "2",
      name: "AI & Machine Learning Workshop",
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-03-20",
      time: "14:00",
      location: "Tech Hub, San Francisco",
      price: 149,
      attendees: 45,
      category: "Workshop",
    },
    {
      id: "3",
      name: "Startup Pitch Night",
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-03-25",
      time: "18:00",
      location: "Innovation Center, SF",
      price: 25,
      attendees: 120,
      category: "Networking",
    },
    {
      id: "4",
      name: "Blockchain Developer Conference",
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-04-02",
      time: "09:00",
      location: "Convention Center, SF",
      price: 399,
      attendees: 280,
      category: "Conference",
    },
  ];

  return allEvents.filter((event) => event.id !== currentId).slice(0, 3);
};

export function RelatedEvents({
  currentEventId,
  category,
}: RelatedEventsProps) {
  const relatedEvents = getRelatedEvents(category, currentEventId);

  if (relatedEvents.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        You might also like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedEvents.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-emerald-600">
                {event.category}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2">
                {event.name}
              </h3>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-emerald-600">
                  ${event.price}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href={`/events/${event.id}`}>View Event</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
