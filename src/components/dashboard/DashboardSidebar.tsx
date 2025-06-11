
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Flag,
  LayoutDashboard,
  ListChecks,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Mail,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LucideIcon,
  Package
} from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  subItems?: { label: string; path: string }[];
}

interface DashboardSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const DashboardSidebar = ({ isCollapsed, toggleSidebar }: DashboardSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    { 
      icon: BarChart3, 
      label: 'Global Dashboard', 
      path: '/dashboard',
      subItems: []
    },
    { 
      icon: Flag, 
      label: 'US Dashboard', 
      path: '/dashboard-us',
      subItems: []
    },
    { 
      icon: LayoutDashboard, 
      label: 'B2B Dashboard', 
      path: '/b2b',
      subItems: []
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      path: '/orders',
      subItems: []
    },
    { 
      icon: Package, 
      label: 'Products',
      path: '',
      subItems: [
        { label: 'Global Products', path: '/products' },
        { label: 'US Products', path: '/products/us' },
      ],
    },
    { 
      icon: Calendar, 
      label: 'Calendar', 
      path: '/calendar',
      subItems: []
    },
    { 
      icon: TrendingUp, 
      label: 'Analytics', 
      path: '/analytics',
      subItems: []
    },
    { 
      icon: Mail, 
      label: 'Marketing', 
      path: '/marketing',
      subItems: []
    },
    { 
      icon: HelpCircle, 
      label: 'Support', 
      path: '/support',
      subItems: []
    },
    { 
      icon: Settings, 
      label: 'Settings',
      path: '',
      subItems: [
        { label: 'Profile', path: '/profile' },
        { label: 'Account', path: '/account' },
      ],
    },
  ];

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 text-black transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <span className="font-bold text-black">Dashboard</span>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.subItems && item.subItems.length > 0 ? (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-md hover:bg-gray-100 text-black"
                  onClick={() => toggleSubMenu(item.label)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
                {openSubMenu === item.label && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        className={cn(
                          "group flex items-center rounded-md px-2 py-1 text-sm font-medium hover:bg-gray-100",
                          location.pathname === subItem.path
                            ? "bg-primary/10 text-primary"
                            : "text-black"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-100",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-black"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <Button variant="outline" className="w-full text-black border-gray-300" onClick={() => {
          signOut();
          navigate('/login');
        }}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
