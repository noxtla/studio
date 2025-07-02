// src/app/dashboard/page.tsx
"use client";

import { type FC } from 'react';
import Link from 'next/link';
import { BookHeart, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Still need Card for the Dashboard header
import { cn } from '@/lib/utils';

// Definition of MenuItemProps interface
interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  href: string;
  isPrimary?: boolean;
}

// MenuItem component (UPDATED to apply card styles directly to Link)
const MenuItem: FC<MenuItemProps> = ({ title, icon: Icon, href, isPrimary = true }) => {
  return (
    // CAMBIO CLAVE AQUÍ:
    // 1. El componente Link ahora es el que recibe todas las clases de estilo de la Card.
    //    Esto lo convierte en el elemento clickable que se ve y se comporta como una tarjeta.
    // 2. Se eliminó `passHref` y `legacyBehavior` de Link, ya que no son necesarios con esta estructura.
    // 3. CardContent se usa solo para estructurar el contenido interno (ícono y texto).
    <Link
      href={href}
      // Combinamos las clases de estilo de la Card y las específicas del MenuItem directamente en el Link
      className={cn(
        "w-full h-full flex flex-col items-center justify-center", // Sizing and centering within its parent container
        "rounded-lg border-none shadow-none", // Overrides default Card border/shadow
        "transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg", // Hover effects
        "cursor-pointer", // Visual feedback for clickability
        isPrimary ? "bg-card p-4 sm:p-6" : "bg-secondary p-3" // Background and padding based on type
      )}
    >
      {/* Content for the card, using CardContent for its inherent padding/layout if desired,
          or just a simple div if CardContent doesn't add necessary value here.
          We'll keep CardContent as it provides a consistent internal structure. */}
      <CardContent className={cn(
        "flex-1 flex flex-col items-center justify-center text-center gap-2",
        isPrimary ? "space-y-2 sm:space-y-3" : "space-y-1.5",
        "p-0" // Ensure no additional padding from CardContent itself as Link already has padding
      )}>
        <Icon className={cn("text-primary", isPrimary ? "h-10 w-10 sm:h-12 sm:w-12" : "h-6 w-6")} />
        <p className={cn("font-medium text-foreground", isPrimary ? "text-base sm:text-lg" : "text-sm")}>{title}</p>
      </CardContent>
    </Link>
  );
};

export default function DashboardPage() {
  const primaryMenuItems: MenuItemProps[] = [
    { title: 'Safety', icon: BookHeart, href: '/spage.tsx' }, // Href correctly points to /safety.tsx
  ];

  const secondaryMenuItems: MenuItemProps[] = [];

  return (
    <div className="flex flex-col min-h-screen bg-background p-2 sm:p-4">
      {/* This Card for the dashboard header remains unchanged */}
      <Card className="w-full max-w-md mx-auto mb-6 bg-primary text-primary-foreground shadow-lg rounded-lg animate-step-enter">
        <CardHeader className="py-4">
          <CardTitle className="text-3xl font-headline text-center">
            Main Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Main content area for the "Safety" button */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2">
        <div className="w-full max-w-xs h-[180px] sm:h-[200px]">
          {primaryMenuItems.map((item) => (
            <div key={item.title} className="flex h-full">
              <MenuItem {...item} />
            </div>
          ))}
        </div>
      </div>

      {/* Secondary content area (remains empty) */}
      <div className="w-full mt-auto pt-4 sm:pt-6 pb-2 flex flex-row justify-center items-center gap-2 sm:gap-4">
        {/* No secondary items to render */}
      </div>
    </div>
  );
}