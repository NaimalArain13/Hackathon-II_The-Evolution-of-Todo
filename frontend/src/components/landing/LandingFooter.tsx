import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { footerLinkGroups, defaultSocialLinks } from "./data";
import type { LandingFooterProps } from "./types";

const iconMap: Record<string, React.ElementType> = {
  Twitter,
  Github,
  Linkedin,
};

export function LandingFooter({
  logo = { text: "TaskFlow" },
  tagline = "The simple, beautiful way to manage your tasks.",
  linkGroups = footerLinkGroups,
  socialLinks = defaultSocialLinks,
  copyrightText = `© ${new Date().getFullYear()} TaskFlow. All rights reserved.`,
}: LandingFooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-primary-400 transition-colors"
            >
              {logo.text}
            </Link>
            <p className="mt-4 text-sm">{tagline}</p>

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialLinks.map((social) => {
                  const IconComponent = iconMap[social.icon];
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {IconComponent && <IconComponent size={20} />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link Groups */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                      {...(link.isExternal && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-sm">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
