// src/app/safety.tsx/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

// NUEVA IMPORTACIÓN
import HorizontalTabBar from '@/components/common/horizontal-tab-bar'; // <-- Importa el nuevo componente

// --- Tipos de Datos ---
interface QuizCard {
  q: string; // Question
  a: string; // Answer
  status: 'new' | 'correct' | 'incorrect';
  reviewCounter: number;
  completedOnce: boolean; // Para saber si se ha respondido correctamente al menos una vez
}

interface QuizSection {
  name: string;
  questions: Array<{ q: string; a: string }>;
}

// --- Datos del Quiz ---
const sectionsData: QuizSection[] = [
  {
    name: "Seguridad General del Sitio",
    questions: [
      { q: "¿Cuál es el primer paso antes de comenzar cualquier trabajo de arboricultura?", a: "Una inspección completa del sitio de trabajo para identificar peligros como líneas eléctricas, terreno inestable y la condición del árbol." },
      { q: "Nombre 3 elementos esenciales del Equipo de Protección Personal (EPP) para un arborista.", a: "Casco, protección ocular y protección auditiva. Pantalones/chaparreras para motosierra y botas de seguridad también son cruciales." },
      { q: "¿Cuál es la distancia mínima de aproximación a líneas eléctricas con voltajes de hasta 50kV según ANSI Z133?", a: "10 pies (aproximadamente 3 metros)." },
      { q: "¿Qué debe incluir una reunión de seguridad previa al trabajo (tailgate meeting)?", a: "Discusión de los peligros específicos del día, asignación de tareas, plan de respuesta a emergencias y confirmación de la comunicación." },
      { q: "¿Por qué es crucial establecer una 'zona de caída' (drop zone)?", a: "Para mantener al personal y al público a salvo de la caída de ramas y escombros. Debe estar claramente marcada y controlada." },
      { q: "Pregunta Práctica: Estás a punto de podar un árbol grande cerca de una acera concurrida. ¿Qué medidas tomas para asegurar la seguridad pública?", a: "Establecer una zona de trabajo segura con conos y cinta de precaución, usar un vigía en el suelo para controlar el tráfico peatonal y comunicar claramente los peligros." }
    ]
  },
  {
    name: "Seguridad con la Motosierra",
    questions: [
      { q: "¿Qué es el 'retroceso' (kickback) de una motosierra y cómo se puede prevenir?", a: "Es una reacción violenta y ascendente de la barra guía. Se previene evitando cortar con la punta de la barra y manteniendo un agarre firme con ambas manos." },
      { q: "¿Qué EPP es obligatorio al operar una motosierra?", a: "Protección para la cabeza, ojos, oídos, manos, y chaparreras o pantalones resistentes a cortes, además de botas de seguridad." },
      { q: "¿Cómo se debe arrancar una motosierra de forma segura en el suelo?", a: "Colocando la bota en el mango trasero, una mano firme en el manillar delantero y tirando de la cuerda de arranque con la otra mano, asegurando que el freno de cadena esté activado." },
      { q: "Describe la postura corporal correcta para operar una motosierra.", a: "Pies separados a la altura de los hombros para un buen equilibrio, rodillas flexionadas y espalda recta para usar el cuerpo como palanca." },
      { q: "¿Cuándo se debe activar el freno de cadena?", a: "Antes de arrancar la sierra, al caminar (incluso distancias cortas) y cada vez que la sierra no esté cortando activamente." },
      { q: "Pregunta Práctica: Estás cortando una rama grande en el suelo. La rama está bajo tensión. ¿Dónde haces el primer corte para liberarla de forma segura?", a: "Realizar un pequeño corte en el lado de la compresión primero, seguido por el corte principal en el lado de la tensión para evitar que la sierra quede atrapada." }
    ]
  },
  {
    name: "Técnicas de Trepa Manual",
    questions: [
      { q: "¿Qué es un 'Punto de Anclaje' (Tie-In Point - TIP) y qué características debe tener uno bueno?", a: "Es el punto en el árbol donde se ancla la cuerda de trepa. Debe estar en una unión de ramas fuerte y viva, capaz de soportar la carga dinámica del trepador." },
      { q: "Nombra dos nudos de enganche (hitch) comúnmente usados por los arboristas para trepar.", a: "El Prusik y el Blake's Hitch son dos ejemplos clásicos. Nudos más modernos como el Tautline Hitch también son comunes." },
      { q: "¿Qué significa la regla de 'tres puntos de contacto' al trepar?", a: "Mantener siempre dos manos y un pie, o dos pies y una mano, en contacto estable con el árbol para asegurar la estabilidad." },
      { q: "¿Por qué es inseguro usar espuelas (gaffs) en un árbol que no va a ser removido?", a: "Porque las heridas que crean pueden abrir vías para enfermedades y plagas, dañando la salud del árbol a largo plazo." },
      { q: "¿Qué inspección debes realizar a tu cuerda de trepa antes de cada uso?", a: "Inspección visual y táctil en toda su longitud, buscando cortes, abrasiones, áreas vidriadas (por calor) o cualquier deformidad." },
      { q: "Pregunta Práctica: Estás a mitad de la trepa y necesitas posicionarte para un corte. ¿Qué sistema usas para mantenerte seguro y estable?", a: "Usar una eslinga de posicionamiento (lanyard) además de tu sistema principal de trepa. La eslinga proporciona un segundo punto de anclaje y permite un posicionamiento preciso." }
    ]
  },
  {
    name: "Operación de Camión Canasta",
    questions: [
      { q: "¿Qué se debe verificar en la inspección diaria de un camión canasta antes de su uso?", a: "Niveles de fluidos, controles operativos (superiores e inferiores), estado de las mangueras hidráulicas, y la estabilidad de los estabilizadores (outriggers)." },
      { q: "¿Por qué es crucial nivelar el camión antes de extender la pluma (boom)?", a: "Para asegurar la estabilidad del vehículo y prevenir un vuelco. El indicador de nivel del camión debe estar dentro de los límites especificados por el fabricante." },
      { q: "Cuando se trabaja desde una canasta, ¿es obligatorio usar un arnés y una eslinga?", a: "Sí, siempre. El trepador debe estar anclado al punto de anclaje designado en la canasta, no a la pluma ni al árbol." },
      { q: "¿Qué peligro representa el 'efecto látigo' (whiplash effect) en una canasta aérea?", a: "Si la pluma es golpeada o se mueve bruscamente, la canasta puede oscilar violentamente, pudiendo expulsar al operador o golpearlo contra un objeto." },
      { q: "¿Se puede usar un camión canasta para levantar o arrastrar cargas pesadas?", a: "No. Las canastas aéreas están diseñadas para posicionar personal, no para usarse como grúa, a menos que estén específicamente clasificadas para ello." },
      { q: "Pregunta Práctica: Estás operando la canasta y te das cuenta de que una rama que vas a cortar podría caer sobre los controles inferiores. ¿Qué haces?", a: "Detener el trabajo, reposicionar el camión o planificar el corte para que la rama caiga en una zona segura, lejos de los controles y del personal en tierra." }
    ]
  },
  {
    name: "Aparejos y Técnicas de Corte",
    questions: [
      { q: "Describe la diferencia entre un 'corte de muesca' (notch cut) y un 'corte de espalda' (back cut).", a: "El corte de muesca se hace en el lado hacia donde se quiere que caiga la pieza y dirige la caída. El corte de espalda se hace en el lado opuesto para liberar la pieza." },
      { q: "¿Qué es una 'bisagra' (hinge wood) y por qué es vital al talar un árbol?", a: "Es la madera que se deja sin cortar entre la muesca y el corte de espalda. Controla la velocidad y dirección de la caída del árbol." },
      { q: "¿Qué es un sistema de aparejo (rigging system) en arboricultura?", a: "Un sistema de cuerdas, poleas y dispositivos de fricción utilizado para bajar de forma controlada las secciones de un árbol que se está desmontando." },
      { q: "¿Cuál es la función de un 'dispositivo de fricción' (friction device) en un aparejo?", a: "Se ancla en la base del árbol para agregar fricción a la cuerda de aparejo, permitiendo al personal de tierra controlar el descenso de piezas pesadas." },
      { q: "Explica el concepto de 'ángulo de la cuerda' en el aparejo y por qué es importante.", a: "Ángulos agudos en la cuerda (menores a 45 grados) multiplican las fuerzas en el anclaje y el equipo, pudiendo causar fallas. Se deben buscar ángulos más amplios." },
      { q: "Pregunta Práctica: Necesitas remover una rama grande que cuelga sobre un techo. ¿Qué técnica de corte y aparejo usarías?", a: "Instalar un punto de anclaje de aparejo por encima de la rama. Atar la rama y hacer un corte de muesca inferior y luego un corte superior para liberarla, bajándola controladamente con el sistema de aparejo." }
    ]
  }
];

// Función para mezclar un array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default function SafetyModulesPage() {
  const { toast } = useToast();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [activeDeck, setActiveDeck] = useState<QuizCard[]>([]);
  const [currentCard, setCurrentCard] = useState<QuizCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [elaboration, setElaboration] = useState<string | null>(null);
  const [isElaborating, setIsElaborating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // Controla si se muestra el quiz o el mensaje inicial/final

  // Obtener las etiquetas de las secciones para la barra de pestañas
  const sectionLabels = sectionsData.map(section => section.name);

  const getProgress = useCallback(() => {
    const completedCount = activeDeck.filter(card => card.completedOnce).length;
    const totalCount = activeDeck.length;
    return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  }, [activeDeck]);

  const displayMessage = useCallback((sectionName: string, isCompleted: boolean = false) => {
    setQuizStarted(false); // Oculta la interfaz del quiz
    setShowAnswer(false); // Oculta la respuesta si estaba visible
    setElaboration(null); // Oculta la elaboración
    setIsElaborating(false); // Oculta el spinner de elaboración

    if (isCompleted) {
      toast({
        title: "Sección Completada",
        description: `¡Felicidades! Has completado la sección ${sectionName}.`,
        variant: "default",
      });
    }
  }, [toast]);

  const loadSection = useCallback(() => {
    setQuizStarted(true); // Muestra la interfaz del quiz
    setShowAnswer(false);
    setElaboration(null);
    setIsElaborating(false);

    const initialDeck: QuizCard[] = sectionsData[currentSectionIndex].questions.map(card => ({
      ...card,
      status: 'new',
      reviewCounter: 0,
      completedOnce: false
    }));
    shuffleArray(initialDeck);
    setActiveDeck(initialDeck);
    
    // Muestra la primera tarjeta
    // Pequeño delay para asegurar que el estado se actualice antes de mostrar
    setTimeout(() => { 
      showNextCard(initialDeck);
    }, 0);
  }, [currentSectionIndex]);

  // Nueva función para manejar el clic en las pestañas
  const handleTabClick = useCallback((label: string) => {
    const newIndex = sectionLabels.indexOf(label);
    if (newIndex !== -1 && newIndex !== currentSectionIndex) {
      setCurrentSectionIndex(newIndex);
      // El useEffect de abajo se encargará de llamar a displayMessage para la nueva sección.
    }
  }, [currentSectionIndex, sectionLabels]);

  const showNextCard = useCallback((deck?: QuizCard[]) => {
    const deckToUse = deck || activeDeck; // Permite pasar el deck recién cargado

    setShowAnswer(false);
    setElaboration(null);
    setIsElaborating(false);

    // Decrementar contadores de revisión para todas las tarjetas en espera
    const updatedDeck = deckToUse.map(card => {
      if (card.reviewCounter > 0) {
        return { ...card, reviewCounter: card.reviewCounter - 1 };
      }
      return card;
    });
    setActiveDeck(updatedDeck);

    let eligibleCards = updatedDeck.filter(card => card.reviewCounter <= 0 && !card.completedOnce);

    if (eligibleCards.length === 0) {
      eligibleCards = updatedDeck.filter(card => card.reviewCounter <= 0); // Revisa si hay tarjetas para repasar
      if (eligibleCards.length === 0) {
        // Si no quedan tarjetas elegibles, la sección está completa
        displayMessage(sectionsData[currentSectionIndex].name, true);
        return;
      }
    }

    // Priorizar tarjetas incorrectas, luego nuevas, luego correctas para repasar
    const nextCard = eligibleCards.find(c => c.status === 'incorrect') || eligibleCards.find(c => c.status === 'new') || eligibleCards[0];

    setCurrentCard(nextCard);
  }, [activeDeck, currentSectionIndex, displayMessage]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (!currentCard) return;

    const updatedDeck = activeDeck.map(card => {
      if (card.q === currentCard.q) { // Identifica la tarjeta actual
        return {
          ...card,
          status: isCorrect ? 'correct' : 'incorrect',
          reviewCounter: isCorrect ? 10 : 3, // Revisar después de X tarjetas
          completedOnce: isCorrect ? true : card.completedOnce,
        };
      }
      return card;
    });
    setActiveDeck(updatedDeck);

    const allCompleted = updatedDeck.every(card => card.completedOnce);
    if (allCompleted) {
      displayMessage(sectionsData[currentSectionIndex].name, true);
    } else {
      showNextCard(updatedDeck); // Pasa el deck actualizado a showNextCard
    }
  }, [activeDeck, currentCard, currentSectionIndex, displayMessage, showNextCard]);

  // Simulando la elaboración sin una API Key
  const handleElaborate = useCallback(async () => {
    if (!currentCard) return;

    setIsElaborating(true);
    setElaboration(null); // Limpiar cualquier elaboración anterior

    // Simular un tiempo de carga
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mensaje de elaboración simulado
    setElaboration(
      "Esta es una elaboración de ejemplo. " +
      "La seguridad en el trabajo de arboricultura es fundamental para protegerte a ti y a quienes te rodean. " +
      "No seguir las reglas puede llevar a accidentes graves, como caídas desde alturas, cortes severos con motosierras, " +
      "o electrocuciones por contacto con líneas eléctricas. " +
      "Por ejemplo, si no usas casco, una rama pequeña que caiga podría causar una lesión cerebral grave. " +
      "Siempre prioriza tu EPP y las directrices de seguridad."
    );
    setIsElaborating(false);
  }, [currentCard, toast]);


  // --- Efecto de inicialización al cargar la página ---
  useEffect(() => {
    // Al cambiar la sección, resetear el estado del quiz y mostrar el mensaje de bienvenida de la nueva sección
    displayMessage(sectionsData[currentSectionIndex].name, false);
    setActiveDeck([]); // Limpiar el deck activo para la nueva sección
    setCurrentCard(null); // Asegurar que no hay tarjeta activa
  }, [currentSectionIndex, displayMessage]);


  return (
    <div className="flex flex-col min-h-screen bg-quiz-background-light p-4 items-center">
      <Card className="w-full max-w-2xl text-center shadow-lg rounded-quiz-lg p-6 flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-gray-800">Tarjetas de Estudio de Seguridad para Arboristas</h1>

        {/* Sección de Navegación con Horizontal Tab Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <HorizontalTabBar
            labels={sectionLabels}
            activeTab={sectionsData[currentSectionIndex].name}
            onTabClick={handleTabClick}
          />
        </div>

        {/* Progress Bar */}
        {quizStarted && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            {/* El color de Progress ya usa 'bg-primary' por defecto, que ahora es naranja */}
            <Progress value={getProgress()} className="h-full rounded-full bg-quiz-success-green" />
          </div>
        )}

        {/* Flashcard Display Area */}
        {quizStarted && currentCard && (
          <div className="bg-quiz-section-bg rounded-quiz-md p-6 flex flex-col justify-between items-center shadow-inner min-h-[200px]">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              {sectionsData[currentSectionIndex].name}
            </p>
            <div className="flex-grow flex flex-col justify-center items-center w-full">
              <div className="text-2xl font-semibold text-gray-800 mb-5 min-h-[80px] flex items-center justify-center text-center w-full">
                {currentCard.q}
              </div>
              {showAnswer && (
                <div className="text-xl font-normal text-gray-700 min-h-[80px] flex items-center justify-center text-center w-full animate-in fade-in duration-300">
                  {currentCard.a}
                </div>
              )}
              {isElaborating ? (
                <div className="flex justify-center items-center h-[50px]">
                  <Loader2 className="h-6 w-6 animate-spin text-quiz-action" /> {/* CAMBIADO: Usando 'text-quiz-action' */}
                </div>
              ) : (
                elaboration && (
                  // CAMBIADO: Usando las nuevas clases de colores para elaboración
                  <div className="bg-quiz-elaboration-green border-l-4 border-quiz-elaboration-border text-quiz-elaboration-text p-4 rounded-quiz-md mt-4 text-sm text-left shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {elaboration}
                  </div>
                )
              )}
            </div>
            <div className="w-full flex flex-col items-center gap-4 mt-auto">
              {!showAnswer && (
                <Button
                  onClick={() => setShowAnswer(true)}
                  // CAMBIADO: Usando 'bg-quiz-action' y sus variantes de hover
                  className="button-primary w-full max-w-xs bg-quiz-action hover:bg-quiz-action-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Revelar Respuesta
                </Button>
              )}
              {showAnswer && (
                <>
                  <div className="flex justify-center gap-4 w-full max-w-md">
                    <Button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 bg-quiz-success-green hover:bg-quiz-success-green-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                    >
                      Correcto (revisar en 10 tarjetas)
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      className="flex-1 bg-quiz-danger-red hover:bg-quiz-danger-red-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                    >
                      Incorrecto (revisar en 3 tarjetas)
                    </Button>
                  </div>
                  <Button
                    onClick={handleElaborate}
                    disabled={isElaborating}
                    // CAMBIADO: Usando 'bg-quiz-action' y sus variantes de hover
                    className={cn(
                      "w-full max-w-xs bg-quiz-action hover:bg-quiz-action-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg",
                      isElaborating && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-md"
                    )}
                  >
                    {isElaborating ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "✨ Elaborar Respuesta ✨"
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Section Completion / Welcome Message */}
        {!quizStarted && (
          // CAMBIADO: Usando las nuevas clases de colores para el cuadro de mensaje
          <div className="bg-quiz-message-blue text-quiz-message-blue-text p-5 rounded-quiz-md font-medium flex flex-col gap-4">
            <p className="text-lg">
              Bienvenido a la sección {sectionsData[currentSectionIndex].name}. Haz clic en "Iniciar Sección" para comenzar.
            </p>
            <Button
              onClick={loadSection}
              // CAMBIADO: Usando 'bg-quiz-action' y sus variantes de hover
              className="bg-quiz-action hover:bg-quiz-action-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Iniciar Sección
            </Button>
            {/* Si todas las tarjetas de la sección actual están completadas, muestra el botón para la siguiente sección */}
            {activeDeck.length > 0 && activeDeck.every(card => card.completedOnce) && currentSectionIndex < sectionsData.length - 1 && (
              <Button
                onClick={() => {
                  setCurrentSectionIndex(prev => prev + 1);
                  // displayMessage para la nueva sección se llamará a través del useEffect
                }}
                className="bg-quiz-action hover:bg-quiz-action-darker py-3 rounded-quiz-sm font-semibold shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Ir a la Siguiente Sección
              </Button>
            )}
            {/* Mensaje de completado si todas las secciones están finalizadas */}
            {currentSectionIndex === sectionsData.length - 1 && activeDeck.length > 0 && activeDeck.every(card => card.completedOnce) && (
              <p className="text-lg font-bold">¡Has completado todas las secciones!</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}