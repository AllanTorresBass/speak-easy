'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Globe, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut,
  Volume2,
  VolumeX,
  Volume1,
  BookMarked
} from 'lucide-react';
import Link from 'next/link';
import { useThemeToggle } from '@/contexts/theme-context';
import { useLanguage } from '@/contexts/language-context';
import { useSession, signOut } from 'next-auth/react';
import { audioPronunciation } from '@/lib/audio-pronunciation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useThemeToggle();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-40 h-[65px]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SpeakEasy
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Promova Quick Access */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/vocabulary/promova">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Promova
                </Link>
              </Button>
              
              {/* Volume Control */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Audio Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ volume: 1.0 })}>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Full Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ volume: 0.7 })}>
                    <Volume1 className="w-4 h-4 mr-2" />
                    Medium Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ volume: 0.4 })}>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Low Volume
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ speed: 0.8 })}>
                    Slow Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ speed: 1.0 })}>
                    Normal Speed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => audioPronunciation.updateSettings({ speed: 1.2 })}>
                    Fast Speed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="w-4 h-4 mr-2" />
                    {t('common.language')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                  <DropdownMenuItem>Deutsch</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 