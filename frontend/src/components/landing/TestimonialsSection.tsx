import { Quote } from "lucide-react";
import { defaultTestimonials } from "./data";
import type { TestimonialsSectionProps, Testimonial } from "./types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-primary-200 mb-4" />

      {/* Quote Text */}
      <p className="text-neutral-700 mb-6 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        {/* Avatar Placeholder */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
          {testimonial.author.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <div>
          {/* Author Name */}
          <p className="font-semibold text-neutral-900">
            {testimonial.author.name}
          </p>

          {/* Role & Company */}
          {(testimonial.author.role || testimonial.author.company) && (
            <p className="text-sm text-neutral-500">
              {testimonial.author.role}
              {testimonial.author.role && testimonial.author.company && " at "}
              {testimonial.author.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({
  overline = "TESTIMONIALS",
  title = "Loved by Thousands of Users",
  testimonials = defaultTestimonials,
}: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Overline */}
          {overline && (
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              {overline}
            </span>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2">
              {title}
            </h2>
          )}
        </div>

        {/* Testimonials Grid - 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
