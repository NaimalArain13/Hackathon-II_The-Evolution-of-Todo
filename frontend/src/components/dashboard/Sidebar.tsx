'use client';

/**
 * Sidebar Component
 * Feature: 007-dashboard-ui (User Story 8)
 *
 * Collapsible sidebar with navigation links and user profile:
 * - Navigation links for Dashboard/Tasks/Profile
 * - User profile display with avatar
 * - Logout button
 * - Collapse/expand toggle (desktop)
 * - Mobile drawer with hamburger menu
 * - Active section highlighting
 * - Smooth width transition animations
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { User } from '@/types/entities';

// Navigation items configuration
const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    section: 'dashboard' as const,
  },
  {
    label: 'Tasks',
    href: '/dashboard/tasks',
    icon: ListTodo,
    section: 'tasks' as const,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: UserIcon,
    section: 'profile' as const,
  },
];

type SectionType = 'dashboard' | 'tasks' | 'profile';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: User | null;
  onLogout: () => void;
}

/**
 * Get user initials from name
 */
function getInitials(name: string | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Determine active section based on pathname
 */
function getActiveSection(pathname: string): SectionType {
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname.startsWith('/dashboard/tasks')) return 'tasks';
  if (pathname.startsWith('/dashboard/profile')) return 'profile';
  return 'dashboard';
}

/**
 * Navigation Link Component
 */
interface NavLinkProps {
  item: (typeof navItems)[0];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function NavLink({ item, isActive, collapsed, onClick }: NavLinkProps) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground',
        collapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  // When collapsed, wrap in tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

/**
 * Sidebar Navigation Content (shared between desktop and mobile)
 */
interface SidebarContentProps {
  user: User | null;
  activeSection: SectionType;
  collapsed: boolean;
  onLogout: () => void;
  onNavClick?: () => void;
}

function SidebarContent({
  user,
  activeSection,
  collapsed,
  onLogout,
  onNavClick,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div
        className={cn(
          'flex h-16 items-center border-b px-4',
          collapsed && 'justify-center px-2'
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={onNavClick}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            T
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold"
              >
                TodoApp
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 p-3"
        role="navigation"
        aria-label="Main navigation"
      >
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={activeSection === item.section}
              collapsed={collapsed}
              onClick={onNavClick}
            />
          ))}
        </TooltipProvider>
      </nav>

      {/* User Profile & Logout */}
      <div className={cn('border-t p-3', collapsed && 'px-2')}>
        {/* User Info */}
        <div
          className={cn(
            'mb-3 flex items-center gap-3 rounded-lg p-2',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-medium">
                  {user?.name || 'User'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={onLogout}
                className={cn(
                  'w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                  collapsed && 'justify-center px-2'
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={10}>
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

/**
 * Desktop Sidebar
 */
function DesktopSidebar({
  collapsed,
  onToggleCollapse,
  user,
  onLogout,
  activeSection,
}: SidebarProps & { activeSection: SectionType }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 70 : 250 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative hidden h-screen flex-shrink-0 border-r bg-background md:flex md:flex-col"
      aria-expanded={!collapsed}
    >
      <SidebarContent
        user={user}
        activeSection={activeSection}
        collapsed={collapsed}
        onLogout={onLogout}
      />

      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </motion.aside>
  );
}

/**
 * Mobile Sidebar (Sheet/Drawer)
 */
interface MobileSidebarProps {
  user: User | null;
  onLogout: () => void;
  activeSection: SectionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MobileSidebar({
  user,
  onLogout,
  activeSection,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent
          user={user}
          activeSection={activeSection}
          collapsed={false}
          onLogout={() => {
            onLogout();
            onOpenChange(false);
          }}
          onNavClick={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Mobile Header with Hamburger Menu
 */
interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-14 items-center border-b bg-background px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="mr-3"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          T
        </div>
        <span className="font-semibold">TodoApp</span>
      </Link>
    </header>
  );
}

/**
 * Main Sidebar Component
 * Renders desktop sidebar and provides mobile drawer functionality
 */
export function Sidebar({
  collapsed,
  onToggleCollapse,
  user,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const activeSection = getActiveSection(pathname);

  return (
    <DesktopSidebar
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      user={user}
      onLogout={onLogout}
      activeSection={activeSection}
    />
  );
}

/**
 * Mobile Sidebar Wrapper
 * To be used with MobileHeader in the layout
 */
export function MobileSidebarWrapper({
  user,
  onLogout,
  open,
  onOpenChange,
}: Omit<MobileSidebarProps, 'activeSection'>) {
  const pathname = usePathname();
  const activeSection = getActiveSection(pathname);

  return (
    <MobileSidebar
      user={user}
      onLogout={onLogout}
      activeSection={activeSection}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

export default Sidebar;
