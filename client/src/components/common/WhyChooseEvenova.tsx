import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Heart, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-level security with 99.9% uptime guarantee. Your events and data are always protected.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create and publish events in minutes. Our platform is optimized for speed and efficiency.",
  },
  {
    icon: Heart,
    title: "Community Focused",
    description:
      "Join a vibrant community of event creators and attendees who share your passion.",
  },
  {
    icon: Award,
    title: "Industry Leading",
    description:
      "Trusted by over 1 million event organizers worldwide with award-winning customer support.",
  },
];

export function WhyChooseEvenova() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
            Why Choose Evenova?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're more than just an event platform. We're your partner in
            creating memorable experiences that bring people together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              1M+
            </div>
            <div className="text-muted-foreground">Event Organizers</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              50M+
            </div>
            <div className="text-muted-foreground">Tickets Sold</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              180+
            </div>
            <div className="text-muted-foreground">Countries</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              99.9%
            </div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
