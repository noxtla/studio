"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importamos cn para combinar clases de Tailwind

interface Step0WelcomeProps {
  onNext: () => void;
}

export default function Step0Welcome({ onNext }: Step0WelcomeProps) {
  return (
    // El div principal se centra con mx-auto y tiene un ancho máximo para evitar que el contenido se estire demasiado en pantallas muy grandes.
    // Añadimos px-4 para padding horizontal en móviles, y lo removemos en sm: para que el contenedor padre maneje el espaciado.
    <div className="text-center animate-step-enter px-4 sm:px-0 max-w-lg mx-auto">
      {/* Título "Welcome" */}
      {/* text-4xl en móvil, sm:text-5xl en tabletas, md:text-6xl en escritorio */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 sm:mb-6 font-headline">
        Welcome
      </h1>

      {/* Subtítulo */}
      {/* text-base en móvil, sm:text-lg en tabletas, md:text-xl en escritorio */}
      {/* max-w-prose para que el texto no sea demasiado ancho y sea más legible en pantallas grandes */}
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-prose mx-auto">
        Click to log in or sign up.
      </p>

      {/* Botón "Get Started" */}
      <Button
        onClick={onNext}
        // Eliminamos size="lg" para tener control total sobre el tamaño del botón con clases custom.
        // w-full en móvil para ocupar todo el ancho, max-w-sm para limitar el ancho en pantallas más grandes y centrarlo.
        // py-4 en móvil, sm:py-5 en tabletas, md:py-6 en escritorio (padding vertical responsivo).
        // text-xl en móvil, sm:text-2xl en tabletas, md:text-3xl en escritorio (tamaño de texto responsivo).
        // rounded-lg para un toque más suave y moderno en un botón grande.
        // Transiciones y efectos hover para una mejor interacción de usuario.
        className={cn(
          "w-full max-w-sm mx-auto", // Se adapta al ancho y se centra
          "py-4 sm:py-5 md:py-6",     // Padding vertical responsivo
          "text-xl sm:text-2xl md:text-3xl", // Tamaño de texto responsivo
          "font-semibold",            // Mantiene el peso de la fuente
          "rounded-lg",               // Bordes más redondeados
          "transition-all duration-300 ease-in-out", // Animación suave
          "transform hover:scale-105 hover:shadow-lg" // Efecto al pasar el ratón
        )}
        variant="default" // Aseguramos que usa el estilo de botón primario
      >
        Get Started
      </Button>
    </div>
  );
}