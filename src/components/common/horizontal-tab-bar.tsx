// src/components/common/horizontal-tab-bar.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface HorizontalTabBarProps {
  labels: string[];
  onTabClick: (label: string) => void;
  activeTab: string; // La pestaña activa, controlada por el componente padre
}

const HorizontalTabBar: React.FC<HorizontalTabBarProps> = ({ labels, activeTab, onTabClick }) => {
  // Verificación defensiva y console.log para depuración, puedes eliminarlos después de confirmar que todo funciona
  // console.log("HorizontalTabBar: Valor de 'labels' recibido:", labels);
  // if (!labels || !Array.isArray(labels)) {
  //   console.error("HorizontalTabBar: 'labels' prop es inválida o no es un array:", labels);
  //   return null;
  // }

  return (
    // Contenedor principal de la barra de pestañas.
    // w-full: Asegura que ocupe todo el ancho disponible.
    // overflow-hidden: Previene cualquier desbordamiento no deseado del contenedor.
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div
        // Clases clave para la responsividad:
        // overflow-x-auto: Permite el desplazamiento horizontal si el contenido es demasiado ancho.
        // whitespace-nowrap: Evita que el texto de las pestañas se envuelva, manteniendo todo en una línea.
        // flex: Habilita el flexbox para organizar las pestañas en una fila.
        // justify-start: Alinea las pestañas al inicio (izquierda) por defecto en pantallas pequeñas.
        // sm:justify-center: Centra las pestañas en pantallas 'sm' (640px) y más grandes,
        //                     proporcionando una mejor estética en pantallas más amplias.
        // py-2 px-4: Padding vertical y horizontal para el área de las pestañas.
        className="overflow-x-auto whitespace-nowrap py-2 px-4 flex justify-start sm:justify-center"
      >
        {labels.map((label) => (
          <button
            key={label}
            className={cn(
              "px-4 py-2 focus:outline-none transition-colors duration-200 relative pb-3",
              // Responsividad de texto:
              // text-base: Usa un tamaño de fuente base para pantallas pequeñas (generalmente 16px).
              // sm:text-lg: Aumenta el tamaño de la fuente a 'lg' (generalmente 18px) en pantallas 'sm' y más grandes,
              //              mejorando la legibilidad en pantallas de mayor resolución.
              "text-base sm:text-lg",
              // mx-2: Margen horizontal para separar las pestañas.
              // flex-grow-0 flex-shrink-0: Asegura que los botones de las pestañas no intenten crecer o encogerse
              //                           de forma inesperada dentro del contenedor flex, manteniendo su tamaño basado en el contenido.
              "mx-2 flex-grow-0 flex-shrink-0",
              activeTab === label
                ? 'font-bold text-primary' // Usa el color primary del tema para la pestaña activa
                : 'text-muted-foreground font-normal hover:text-foreground'
            )}
            onClick={() => onTabClick(label)}
          >
            {label}
            {activeTab === label && (
              // Indicador de la pestaña activa.
              // absolute bottom-0 left-0 right-0: Posiciona el subrayado para que ocupe el ancho completo de la pestaña.
              // h-1 bg-primary: Altura y color del subrayado.
              // rounded-t-sm: Esquinas redondeadas en la parte superior del subrayado.
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-sm"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HorizontalTabBar;