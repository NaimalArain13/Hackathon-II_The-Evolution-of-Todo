import { CheckSquare, Flag, BarChart3, Shield } from "lucide-react";
import { defaultFeatures } from "./data";
import type { FeaturesSectionProps, Feature } from "./types";

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ElementType> = {
  CheckSquare,
  Flag,
  BarChart3,
  Shield,
};

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const IconComponent = iconMap[feature.icon];

  return (
    <div className="p-6 rounded-xl bg-neutral-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Icon Container */}
      <div
        className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {IconComponent && (
          <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesSection({
  overline = "FEATURES",
  title = "Everything You Need to Stay Organized",
  subtitle = "Powerful features designed to help you manage tasks effortlessly",
  features = defaultFeatures,
}: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 bg-white">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mt-2 mb-4">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Feature Cards Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
