import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Users, Calendar, TrendingUp } from "lucide-react";
import { NavLink as Link } from "react-router-dom";
export function CreateEventCTA() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Turn Your Ideas Into{" "}
              <span className="text-primary">Amazing Events</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Whether you're planning a small gathering or a large conference,
              Evenova provides all the tools you need to create, promote, and
              manage successful events.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your event in minutes with our intuitive builder
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Reach More People</h3>
                  <p className="text-sm text-muted-foreground">
                    Promote to our community of millions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track Success</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed analytics and insights
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Professional Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Everything you need for event management
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="text-lg px-8">
              <Link to="/create-event">Start Creating Your Event</Link>
            </Button>
          </div>

          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-0">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Event creation interface"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
