
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { B2BMenuItem } from './B2BMenuItem';

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
}

interface DashboardSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  className
}) => {
  const { user, signOut } = useAuth();
  
  const navItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
      href: '/dashboard',
      roles: ['CEO', 'CCO', 'Commercial Director', 'GCC Regional Manager', 'Marketing Director', 'Production Manager', 'Customer Support', 'Social Media Manager']
    },
    {
      name: 'Ad Creator',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      href: '/ad-creator',
      roles: ['CEO', 'CCO', 'Marketing Director', 'Social Media Manager']
    },
    {
      name: 'Calendar',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      href: '/calendar',
      roles: ['CEO', 'CCO', 'Marketing Director', 'Production Manager', 'Social Media Manager']
    },
    {
      name: 'Analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      href: '/analytics',
      roles: ['CEO', 'CCO', 'Commercial Director', 'GCC Regional Manager', 'Marketing Director']
    },
    {
      name: 'Customer Support',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
        </svg>
      ),
      href: '/support',
      roles: ['CEO', 'CCO', 'Customer Support']
    },
    {
      name: 'Marketing Tools',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      href: '/marketing',
      roles: ['CEO', 'CCO', 'Marketing Director', 'Social Media Manager']
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = user 
    ? navItems.filter(item => item.roles.includes(user.role))
    : [];

  return (
    <div 
      className={cn(
        "flex flex-col border-r border-luxury-gold/10 bg-luxury-black h-screen transition-all duration-200",
        isCollapsed ? "w-[70px]" : "w-[250px]",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-luxury-gold/10">
        {isCollapsed ? (
          <span className="text-luxury-gold text-2xl font-display">M</span>
        ) : (
          <span className="text-luxury-gold text-xl font-display tracking-wider">MIN NEW YORK</span>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <a 
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-luxury-gold/10 hover:text-luxury-gold"
              >
                <span className="text-luxury-gold/80">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </a>
            </li>
          ))}
          
          {/* B2B Leads Upload - Show for specific roles */}
          {user && ['CEO', 'CCO', 'Commercial Director', 'Marketing Director'].includes(user.role) && (
            <li>
              <B2BMenuItem />
            </li>
          )}
        </ul>
      </nav>
      
      {/* User section */}
      <div className="mt-auto border-t border-luxury-gold/10 p-4">
        <div className="flex items-center gap-3">
          {!isCollapsed && user && (
            <div className="flex-1 truncate">
              <div className="text-sm font-medium text-luxury-cream">{user.name}</div>
              <div className="text-xs text-luxury-cream/60">{user.role}</div>
            </div>
          )}
          
          {/* Collapse button */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-luxury-gold/10"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
          
          {!isCollapsed && (
            <LuxuryButton 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={signOut}
            >
              Logout
            </LuxuryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
