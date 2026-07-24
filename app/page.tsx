import dynamic from "next/dynamic";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { FloatingActions } from "@/components/floating-actions";
import { Hero } from "@/components/sections/hero";
import { LiveDashboard } from "@/components/sections/live-dashboard";

/**
 * Above-the-fold sections are imported eagerly; everything below is
 * code-split so the initial bundle stays small. All of them still render
 * on the server, so crawlers see the full page.
 */
const skeleton = () => <div className="min-h-[60vh]" aria-hidden />;

const AiBooking = dynamic(() => import("@/components/sections/ai-booking").then((m) => m.AiBooking), {
  loading: skeleton,
});
const Services = dynamic(() => import("@/components/sections/services").then((m) => m.Services), {
  loading: skeleton,
});
const WhyChooseUs = dynamic(
  () => import("@/components/sections/why-choose-us").then((m) => m.WhyChooseUs),
  { loading: skeleton },
);
const VirtualTour = dynamic(
  () => import("@/components/sections/virtual-tour").then((m) => m.VirtualTour),
  { loading: skeleton },
);
const Doctors = dynamic(() => import("@/components/sections/doctors").then((m) => m.Doctors), {
  loading: skeleton,
});
const EmergencyBanner = dynamic(
  () => import("@/components/sections/emergency-banner").then((m) => m.EmergencyBanner),
  { loading: skeleton },
);
const Testimonials = dynamic(
  () => import("@/components/sections/testimonials").then((m) => m.Testimonials),
  { loading: skeleton },
);
const Statistics = dynamic(
  () => import("@/components/sections/statistics").then((m) => m.Statistics),
  { loading: skeleton },
);
const Gallery = dynamic(() => import("@/components/sections/gallery").then((m) => m.Gallery), {
  loading: skeleton,
});
const Faq = dynamic(() => import("@/components/sections/faq").then((m) => m.Faq), {
  loading: skeleton,
});
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact), {
  loading: skeleton,
});

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <LiveDashboard />
        <AiBooking />
        <Services />
        <WhyChooseUs />
        <VirtualTour />
        <Doctors />
        <EmergencyBanner />
        <Testimonials />
        <Statistics />
        <Gallery />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
