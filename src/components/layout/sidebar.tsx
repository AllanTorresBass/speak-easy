'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
              BookOpen, 
              GraduationCap, 
              Target, 
              BarChart3,
              Settings,
              Menu,
              X,
              Home,
              Users,
              Trophy,
              Calendar,
              BookMarked,
              Brain
            } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
              { 
                name: 'Dashboard', 
                href: '/dashboard', 
                icon: Home,
                description: 'Overview and progress'
              },
              { 
                name: 'Vocabulary', 
                href: '/vocabulary', 
                icon: BookOpen,
                description: 'Word lists and practice'
              },
              { 
                name: 'Grammar', 
                href: '/grammar', 
                icon: GraduationCap,
                description: 'Lessons and exercises'
              },
              { 
                name: 'Advanced Learning', 
                href: '/advanced-learning', 
                icon: Brain,
                description: 'AI-powered learning features'
              },
              { 
                name: 'Practice', 
                href: '/practice', 
                icon: Target,
                description: 'Interactive sessions'
              },
              { 
                name: 'Progress', 
                href: '/progress', 
                icon: BarChart3,
                description: 'Learning analytics'
              },
              { 
                name: 'Community', 
                href: '/community', 
                icon: Users,
                description: 'Connect with learners'
              },
              { 
                name: 'Achievements', 
                href: '/achievements', 
                icon: Trophy,
                description: 'Badges and rewards'
              },
              { 
                name: 'Schedule', 
                href: '/schedule', 
                icon: Calendar,
                description: 'Study planning'
              },
              { 
                name: 'Resources', 
                href: '/resources', 
                icon: BookMarked,
                description: 'Additional materials'
              },
              { 
                name: 'Settings', 
                href: '/settings', 
                icon: Settings,
                description: 'Account preferences'
              },
            ];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">SpeakEasy</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto py-3",
                    collapsed ? "px-2" : "px-4"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    collapsed ? "mr-0" : "mr-3"
                  )} />
                  {!collapsed && (
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-center text-sm text-muted-foreground">
            <p>SpeakEasy v1.0</p>
            <p className="text-xs">Learning made easy</p>
          </div>
        </div>
      )}
    </div>
  );
} 