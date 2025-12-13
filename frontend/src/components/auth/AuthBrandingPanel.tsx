import { CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthBrandingPanelProps {
  className?: string;
}

/**
 * Right-side branding panel for auth pages
 * Shows gradient background with logo and tagline
 * Hidden on mobile, visible on tablet and desktop
 */
export function AuthBrandingPanel({ className }: AuthBrandingPanelProps) {
  return (
    <div className={cn('lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-white" />
        <div className="absolute bottom-20 right-10 w-20 h-20 rounded-full bg-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <CheckSquare className="h-10 w-10 text-white" />
          </div>
          <span className="text-4xl font-bold">TaskFlow</span>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl font-semibold text-center mb-4">
          Organize Your Life,
          <br />
          One Task at a Time
        </h2>

        <p className="text-white/80 text-center max-w-sm mb-12">
          The simple, beautiful way to manage your tasks. Stay organized, boost productivity, and
          never miss a deadline.
        </p>

        {/* Feature highlights */}
        <div className="space-y-4">
          <FeatureItem icon="✓" text="Easy task management" />
          <FeatureItem icon="✓" text="Priority & status tracking" />
          <FeatureItem icon="✓" text="Secure & private" />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/90">
      <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-sm">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
