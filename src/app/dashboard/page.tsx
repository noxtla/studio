// src/app/dashboard/page.tsx
"use client";

import { type FC } from 'react';
import Link from 'next/link';
import { BookHeart, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Definición simplificada de MenuItemProps
interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  href: string; // Ahora href es obligatorio ya que es un botón de navegación directa
  isPrimary?: boolean;
}

// Componente MenuItem simplificado para solo manejar enlaces
const MenuItem: FC<MenuItemProps> = ({ title, icon: Icon, href, isPrimary = true }) => {
  const content = (
    <Card
      className={cn(
        "w-full flex flex-col items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg border-none shadow-none",
        isPrimary ? "bg-card p-4 sm:p-6 h-full" : "bg-secondary p-3",
        "cursor-pointer" // Siempre un cursor de puntero ya que es navegable
      )}
    >
      <CardContent className={cn(
        "flex-1 flex flex-col items-center justify-center text-center gap-2",
        isPrimary ? "space-y-2 sm:space-y-3" : "space-y-1.5",
        "p-0" // Asegura que el padding del CardContent es cero
      )}>
        <Icon className={cn("text-primary", isPrimary ? "h-10 w-10 sm:h-12 sm:w-12" : "h-6 w-6")} />
        <p className={cn("font-medium text-foreground", isPrimary ? "text-base sm:text-lg" : "text-sm")}>{title}</p>
      </CardContent>
    </Card>
  );

  return (
    <Link href={href} passHref legacyBehavior>
      <a className="flex h-full w-full">
        {content}
      </a>
    </Link>
  );
};

export default function DashboardPage() {
  const primaryMenuItems: MenuItemProps[] = [
    // CAMBIADO: La ruta ahora es solo /safety
    { title: 'Safety', icon: BookHeart, href: '/safety/page.tsx' },
  ];

  const secondaryMenuItems: MenuItemProps[] = [];

  return (
    <div className="flex flex-col min-h-screen bg-background p-2 sm:p-4">
      {/* Sección del encabezado */}
      <Card className="w-full max-w-md mx-auto mb-6 bg-primary text-primary-foreground shadow-lg rounded-lg animate-step-enter">
        <CardHeader className="py-4">
          <CardTitle className="text-3xl font-headline text-center">
            Dashboard Principal
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Área de contenido principal para el botón de "Safety" */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-2">
        <div className="w-full max-w-xs h-[180px] sm:h-[200px]">
          {primaryMenuItems.map((item) => (
            <div key={item.title} className="flex h-full">
              <MenuItem {...item} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-auto pt-4 sm:pt-6 pb-2 flex flex-row justify-center items-center gap-2 sm:gap-4">
        {/* Aquí no se renderizará nada porque secondaryMenuItems está vacío */}
      </div>
    </div>
  );
}