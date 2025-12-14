import { UserPlus, PlusCircle, CheckCircle } from "lucide-react";
import { defaultSteps } from "./data";
import type { HowItWorksSectionProps, Step } from "./types";

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  UserPlus,
  PlusCircle,
  CheckCircle,
};

interface StepCardProps {
  step: Step;
  isLast: boolean;
}

function StepCard({ step, isLast }: StepCardProps) {
  const IconComponent = iconMap[step.icon];

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connecting Line (hidden on last item and mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 border-t-2 border-dashed border-neutral-300 -z-10" />
      )}

      {/* Number Circle with Icon */}
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-primary-200">
          {IconComponent && (
            <IconComponent className="w-8 h-8 text-primary-500" />
          )}
        </div>
        {/* Step Number Badge */}
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {step.number}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 text-sm max-w-xs">{step.description}</p>
    </div>
  );
}

export function HowItWorksSection({
  overline = "HOW IT WORKS",
  title = "Get Started in 3 Simple Steps",
  steps = defaultSteps,
}: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-20 bg-primary-50">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2">
            {title}
          </h2>
        </div>

        {/* Steps Grid - 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
