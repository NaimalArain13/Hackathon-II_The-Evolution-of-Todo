import { Check } from "lucide-react";
import type { AppPreviewSectionProps } from "./types";

const defaultBenefits = [
  "Clean, intuitive interface",
  "Works on all your devices",
  "Lightning-fast performance",
  "Free to use forever",
];

export function AppPreviewSection({
  overline = "APP PREVIEW",
  title = "See TaskFlow in Action",
  benefits = defaultBenefits,
}: AppPreviewSectionProps) {
  return (
    <section id="app-preview" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Benefits List */}
          <div className="order-2 lg:order-1">
            {/* Overline */}
            {overline && (
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
                {overline}
              </span>
            )}

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2 mb-8">
              {title}
            </h2>

            {/* Benefits List with Checkmarks */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-neutral-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: App Screenshot Placeholder */}
          <div className="order-1 lg:order-2">
            {/* Screenshot Container with Shadow and Rounded Corners */}
            <div className="relative">
              {/* Main Screenshot */}
              <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
                {/* Mock Dashboard Interface */}
                <div className="h-full flex flex-col">
                  {/* Mock Sidebar */}
                  <div className="flex h-full">
                    <div className="w-16 bg-primary-600 flex flex-col items-center py-4 gap-4">
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                      <div className="w-8 h-8 bg-white/40 rounded-lg" />
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                      <div className="w-8 h-8 bg-white/20 rounded-lg" />
                    </div>

                    {/* Mock Main Content */}
                    <div className="flex-1 bg-white p-4">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-24 bg-neutral-200 rounded" />
                        <div className="h-8 w-20 bg-primary-500 rounded-lg" />
                      </div>

                      {/* Task Cards */}
                      <div className="space-y-3">
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-primary-500 rounded" />
                            <div className="h-4 w-32 bg-neutral-200 rounded" />
                            <div className="ml-auto h-5 w-14 bg-amber-100 rounded text-xs" />
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div className="h-4 w-40 bg-neutral-200 rounded line-through opacity-50" />
                            <div className="ml-auto h-5 w-14 bg-green-100 rounded text-xs" />
                          </div>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-neutral-300 rounded" />
                            <div className="h-4 w-28 bg-neutral-200 rounded" />
                            <div className="ml-auto h-5 w-14 bg-red-100 rounded text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-8 bg-neutral-900/10 blur-xl rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
