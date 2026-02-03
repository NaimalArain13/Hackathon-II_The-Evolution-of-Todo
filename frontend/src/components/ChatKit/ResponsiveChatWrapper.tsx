/**
 * Responsive wrapper for chat components
 * Adapts the chat interface for different screen sizes
 */

import React, { useState, useEffect } from 'react';

interface ResponsiveChatWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveChatWrapper: React.FC<ResponsiveChatWrapperProps> = ({
  children,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className={`
        ${className}
        ${isMobile
          ? 'fixed inset-0 z-[9999] bg-white flex flex-col max-w-full max-h-full'
          : 'relative flex flex-col w-full h-full min-h-0 overflow-hidden'
        }
      `}
    >
      {children}
    </div>
  );
};