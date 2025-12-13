import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "./types";

export function HeroSection({
  badge = "Your Personal Task Manager",
  headline = "Organize Your Life, One Task at a Time",
  subheadline = "The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and never miss a deadline.",
  primaryCTA = { text: "Get Started Free", href: "/signup" },
  secondaryCTA = { text: "See How It Works", href: "#how-it-works" },
  trustText = "No credit card required",
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-100 via-primary-50 to-white -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left relative z-10">
            {/* Badge */}
            {badge && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 border border-primary-200">
                ✨ {badge}
              </span>
            )}

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA - "Get Started Free" */}
              <Button size="lg" asChild className="group">
                <Link href={primaryCTA.href}>
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Secondary CTA - "See How It Works" */}
              {secondaryCTA && (
                <Button size="lg" variant="outline" asChild>
                  <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
                </Button>
              )}
            </div>

            {/* Trust Text */}
            {trustText && (
              <p className="text-sm text-neutral-500 mt-6">{trustText}</p>
            )}
          </div>

          {/* Right: Hero Image Placeholder */}
          <div className="relative lg:block">
            {/* App Preview Placeholder with Shadow and Rounded Corners */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden border border-primary-300">
              {/* Mock App Interface */}
              <div className="absolute inset-4 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
                {/* Mock Header */}
                <div className="h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-xl flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-white text-sm font-medium">TaskFlow</div>
                  <div className="w-8 h-8 bg-white/20 rounded-full" />
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-4 bg-neutral-50">
                  {/* Task Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-neutral-800 rounded w-24" />
                    <div className="h-8 w-20 bg-primary-500 rounded-lg" />
                  </div>
                  {/* Task Cards */}
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-primary-500 rounded bg-primary-50" />
                        <div className="h-4 bg-neutral-700 rounded w-32" />
                        <div className="ml-auto px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Medium</div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div className="h-4 bg-neutral-400 rounded w-40 line-through" />
                        <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Done</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-red-400 rounded bg-red-50" />
                        <div className="h-4 bg-neutral-700 rounded w-28" />
                        <div className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">High</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Success Notification */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Task Complete!</p>
                    <p className="text-xs text-green-600">Just now</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -top-2 -left-2 bg-white rounded-lg shadow-xl p-3 border border-primary-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Completed</p>
                    <p className="text-sm font-bold text-primary-600">12 tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
