import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreateEventForm } from "@/components/forms/CreateEventForm";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Create Your Event
              </h1>
              <p className="text-xl text-muted-foreground">
                Share your amazing event with the world and start selling
                tickets
              </p>
            </div>
            <CreateEventForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
