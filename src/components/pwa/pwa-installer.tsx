'use client';

// Type definition for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  canInstall: boolean;
  isStandalone: boolean;
}

export function PWAInstaller() {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: true,
    hasServiceWorker: false,
    canInstall: false,
    isStandalone: false
  });
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    checkPWAStatus();
    registerServiceWorker();
    setupEventListeners();
  }, []);

  const checkPWAStatus = () => {
    const isOnline = navigator.onLine;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const canInstall = 'serviceWorker' in navigator && 'PushManager' in window;

    setPwaStatus(prev => ({
      ...prev,
      isOnline,
      isStandalone,
      canInstall
    }));
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        setPwaStatus(prev => ({
          ...prev,
          hasServiceWorker: true
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                showUpdateNotification();
              }
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const setupEventListeners = () => {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setPwaStatus(prev => ({ ...prev, isInstalled: true }));
      setShowInstallPrompt(false);
      setInstallPrompt(null);
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      setPwaStatus(prev => ({ ...prev, isOnline: true }));
    });

    window.addEventListener('offline', () => {
      setPwaStatus(prev => ({ ...prev, isOnline: false }));
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.cacheName);
        }
      });
    }
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    setIsInstalling(true);
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    } finally {
      setIsInstalling(false);
      setShowInstallPrompt(false);
      setInstallPrompt(null);
    }
  };

  const showUpdateNotification = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.postMessage({
        type: 'SKIP_WAITING'
      });
    }
  };

  const refreshApp = () => {
    window.location.reload();
  };

  const openAppSettings = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          // Open service worker settings in browser
          window.open('chrome://serviceworker-internals/', '_blank');
        }
      });
    }
  };

  if (!pwaStatus.canInstall) {
    return null; // Don't show PWA installer if not supported
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>SpeakEasy App</span>
        </CardTitle>
        <CardDescription>
          Install SpeakEasy as a mobile app for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Connection Status</span>
            <div className="flex items-center space-x-2">
              {pwaStatus.isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={pwaStatus.isOnline ? 'default' : 'destructive'}>
                {pwaStatus.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Service Worker</span>
            <div className="flex items-center space-x-2">
              {pwaStatus.hasServiceWorker ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <Badge variant={pwaStatus.hasServiceWorker ? 'default' : 'secondary'}>
                {pwaStatus.hasServiceWorker ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">App Mode</span>
            <div className="flex items-center space-x-2">
              {pwaStatus.isStandalone ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Smartphone className="h-4 w-4 text-blue-600" />
              )}
              <Badge variant={pwaStatus.isStandalone ? 'default' : 'outline'}>
                {pwaStatus.isStandalone ? 'Standalone' : 'Browser'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Install Button */}
        {showInstallPrompt && !pwaStatus.isInstalled && (
          <Button 
            onClick={handleInstall} 
            disabled={isInstalling}
            className="w-full"
          >
            {isInstalling ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isInstalling ? 'Installing...' : 'Install App'}
          </Button>
        )}

        {/* Already Installed */}
        {pwaStatus.isInstalled && (
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 dark:text-green-300">
              SpeakEasy is installed as an app!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshApp}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openAppSettings}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* PWA Benefits */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Works offline</p>
          <p>✓ App-like experience</p>
          <p>✓ Push notifications</p>
          <p>✓ Faster loading</p>
        </div>
      </CardContent>
    </Card>
  );
} 