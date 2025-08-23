import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  User,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/types/event.types";


interface EventDetailsProps {
  event: Event;
}

export const EventDetails = ({ event }: EventDetailsProps) => {

  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM do, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };


  const formatLocation = () => {
    if (event.isOnline) {
      return "Online Event";
    }
    if (event.location) {
      return `${event.location.venue}, ${event.location.city}, ${event.location.state}`;
    }
    return "Location TBD";
  };

  const formatFullAddress = () => {
    if (event.isOnline) {
      return event.onlineLink || "Online event - link will be provided";
    }
    if (event.location) {
      return `${event.location.address}, ${event.location.city}, ${event.location.state} ${event.location.zip}`;
    }
    return "Address to be announced";
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=400&width=800";
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-emerald-600 hover:bg-emerald-700">
            {event.category}
          </Badge>
          {event.isOnline && (
            <Badge className="bg-blue-600 hover:bg-blue-700">
              <Globe className="h-3 w-3 mr-1" />
              Online
            </Badge>
          )}
          {event.status === "featured" && (
            <Badge className="bg-purple-600 hover:bg-purple-700">
              Featured
            </Badge>
          )}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <span>{formatDate(new Date(event.startDateTime))}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <span>
              {formatTime(new Date(event.startDateTime))} -{" "}
              {formatTime(new Date(event.endDateTime))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {event.isOnline ? (
              <Globe className="h-5 w-5 text-emerald-600" />
            ) : (
              <MapPin className="h-5 w-5 text-emerald-600" />
            )}
            <span className="truncate">{formatLocation()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span>{event.attendeesCount.toLocaleString()} attending</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">About This Event</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {event.isOnline ? "Event Details" : "Location"}
          </h2>
          <div className="space-y-2">
            {event.isOnline ? (
              <>
                <p className="font-medium">Online Event</p>
                <p className="text-muted-foreground">
                  {event.onlineLink ? (
                    <a
                      href={event.onlineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      Join Event Link
                    </a>
                  ) : (
                    "Event link will be provided closer to the event date"
                  )}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">
                  {event.location?.venue || "Venue TBD"}
                </p>
                <p className="text-muted-foreground">{formatFullAddress()}</p>
              </>
            )}
          </div>
          {/* {!event.isOnline && (
            <div className="mt-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Map would be displayed here
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* Judges Information */}
      {event.needJudges && event.judges && event.judges.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Judges</h2>
            <div className="space-y-4">
              {event.judges.map((judge, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{judge.name}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {judge.expertise}
                    </p>
                    {judge.bio && (
                      <p className="text-sm text-muted-foreground">
                        {judge.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Organizer</h2>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">{event.organizer.name}</p>
              <p className="text-sm text-muted-foreground">
                {event.organizer.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Capacity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Event Capacity</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Attendees</span>
                <span>
                  {event.attendeesCount} / {event.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (event.attendeesCount / event.capacity) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
