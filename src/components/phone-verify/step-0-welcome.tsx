"use client";

import { Button } from "@/components/ui/button";

interface Step0WelcomeProps {
  onNext: () => void;
}

export default function Step0Welcome({ onNext }: Step0WelcomeProps) {
  return (
    <div className="text-center animate-step-enter">
      <h1 className="text-4xl font-bold text-primary mb-4 font-headline">
        Bienvenido
      </h1>
      <p className="text-muted-foreground mb-8">
        Haz clic para iniciar sesión o registrarte.
      </p>
      <Button onClick={onNext} size="lg" className="px-8 py-3 text-lg">
        Empezar
      </Button>
    </div>
  );
}
