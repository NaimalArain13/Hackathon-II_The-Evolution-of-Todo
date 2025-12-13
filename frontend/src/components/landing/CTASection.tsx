import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CTASectionProps } from "./types";

export function CTASection({
  title = "Ready to Get Organized?",
  subtitle = "Join thousands of users who have transformed their productivity with TaskFlow.",
  buttonText = "Create Free Account",
  buttonHref = "/signup",
  trustText = "Free forever • No credit card required",
}: CTASectionProps) {
  return (
    <section id="cta" className="relative py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg lg:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* CTA Button - "Create Free Account" */}
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-white text-primary-600 hover:bg-primary-50 group"
          >
            <Link href={buttonHref}>
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Trust Text */}
          {trustText && (
            <p className="text-sm text-primary-200 mt-6">{trustText}</p>
          )}
        </div>
      </div>
    </section>
  );
}
