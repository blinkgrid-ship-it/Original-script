import Navbar from "../landing/Navbar";
import Hero from "../landing/Hero";
import ProjectorMetaphor from "../landing/ProjectorMetaphor";
import PathwayPreviews from "../landing/PathwayPreviews";
import ChroniclePreview from "../landing/ChroniclePreview";
import CommunityShowcase from "../landing/CommunityShowcase";
import CTAFooter from "../landing/CTAFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProjectorMetaphor />
      <PathwayPreviews />
      <ChroniclePreview />
      <CommunityShowcase />
      <CTAFooter />
    </div>
  );
}