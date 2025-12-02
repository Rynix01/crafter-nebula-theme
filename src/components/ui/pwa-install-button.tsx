"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { usePWA } from '@/lib/hooks/usePWA';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PWAInstallButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const PWAInstallButton = ({ 
  className, 
  variant = "outline",
  size = "default" 
}: PWAInstallButtonProps) => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!isInstallable) return;
    
    setIsInstalling(true);
    try {
      await installApp();
    } finally {
      setIsInstalling(false);
    }
  };

  // Eğer uygulama zaten yüklüyse butonu gösterme
  if (isInstalled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700"
              disabled
            >
              <Check className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Uygulama zaten yüklü</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Eğer yüklenebilir değilse butonu gösterme
  if (!isInstallable) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            variant={variant}
            size={size}
            className={className}
          >
            {isInstalling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Uygulama İndir
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ana ekrana ekle</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Floating PWA Install Button (sayfanın sağ alt köşesinde)
export const FloatingPWAButton = () => {
  const { isInstallable, isInstalled } = usePWA();

  if (isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <PWAInstallButton
        variant="default"
        size="lg"
        className="shadow-2xl rounded-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary-foreground/20"
      />
    </div>
  );
};
