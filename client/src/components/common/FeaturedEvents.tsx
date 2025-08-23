import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { NavLink as Link } from "react-router-dom";

const featuredEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "March 15, 2024",
    time: "9:00 AM",
    location: "San Francisco, CA",
    price: "$299",
    organizer: "TechCorp Events",
    attendees: 1250,
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Jazz Under the Stars",
    date: "March 22, 2024",
    time: "7:30 PM",
    location: "Central Park, NY",
    price: "$45",
    organizer: "NYC Music Collective",
    attendees: 500,
    category: "Music",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Startup Pitch Competition",
    date: "March 28, 2024",
    time: "2:00 PM",
    location: "Austin, TX",
    price: "Free",
    organizer: "Austin Entrepreneurs",
    attendees: 300,
    category: "Business",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    date: "April 5, 2024",
    time: "12:00 PM",
    location: "Miami Beach, FL",
    price: "$85",
    organizer: "Culinary Arts Society",
    attendees: 800,
    category: "Food & Drink",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Digital Art Exhibition",
    date: "April 12, 2024",
    time: "6:00 PM",
    location: "Los Angeles, CA",
    price: "$25",
    organizer: "Modern Art Gallery",
    attendees: 200,
    category: "Arts",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Marathon Training Workshop",
    date: "April 18, 2024",
    time: "8:00 AM",
    location: "Chicago, IL",
    price: "$35",
    organizer: "Chicago Runners Club",
    attendees: 150,
    category: "Sports",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export function FeaturedEvents() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
            Popular Events Near You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover trending events in your area and join thousands of others
            for unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredEvents.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {event.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} attending
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      by {event.organizer}
                    </p>
                    <p className="font-semibold text-lg text-primary">
                      {event.price}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button className="w-full">Get Tickets</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            <Link to="/events">
              Load More Events
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
