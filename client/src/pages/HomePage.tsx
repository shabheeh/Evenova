import { CreateEventCTA } from "@/components/common/CreateEventCta";
import { FeaturedEvents } from "@/components/common/FeaturedEvents";
import { HeroSection } from "@/components/common/HeroSection";
import { WhyChooseEvenova } from "@/components/common/WhyChooseEvenova";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedEvents />
        <CreateEventCTA />
        <WhyChooseEvenova />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage