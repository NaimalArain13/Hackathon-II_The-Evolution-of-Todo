import {
  LandingNavbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  AppPreviewSection,
  TestimonialsSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section - id="hero" is set in component */}
        <HeroSection />

        {/* Features Section - id="features" is set in component */}
        <FeaturesSection />

        {/* How It Works Section - id="how-it-works" is set in component */}
        <HowItWorksSection />

        {/* App Preview Section - id="app-preview" is set in component */}
        <AppPreviewSection />

        {/* Testimonials Section - id="testimonials" is set in component */}
        <TestimonialsSection />

        {/* CTA Section - id="cta" is set in component */}
        <CTASection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
