import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventDetails } from "@/components/common/EventDetails";
import { TicketPurchase } from "@/components/common/TicketPurchase";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getEvent } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITESTRIPE_PUBLISHABLE_KEY);

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { eventId } = location.state || {};

  useEffect(() => {
    if (!eventId) {
      navigate("/events", { replace: true });
    }
  }, [eventId, navigate]);

  const {
    data: event,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading event details...
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Error Loading Event
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load event details"}
                </p>
                <div className="space-x-4">
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={() => navigate("/events")} variant="default">
                    Back to Events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The event you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button onClick={() => navigate("/events")} variant="default">
                  Back to Events
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {isFetching && !isLoading && (
            <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
              Updating...
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EventDetails event={event} />
            </div>
            <div className="lg:col-span-1">
              <Elements stripe={stripePromise}>
                <TicketPurchase event={event} />
              </Elements>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
