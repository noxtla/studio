// src/app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'; // NUEVO: Importar useRouter
import Step0Welcome from "@/components/phone-verify/step-0-welcome";
import Step1PhoneInput from "@/components/phone-verify/step-1-phone-input";
import WelcomeDialog from "@/components/phone-verify/welcome-dialog";
import NotFoundDialog from "@/components/phone-verify/not-found-dialog";

type DialogState = "closed" | "welcome" | "not-found";

export default function Home() {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("closed");

  const router = useRouter(); // NUEVO: Inicializar useRouter

  const restartForm = () => {
    setPhoneNumber("");
    setIsProcessing(false);
    setDialogState("closed");
    setStep(0);
  };

  const handleVerifyPhone = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate random response
    const isUserFound = Math.random() > 0.3;

    if (isUserFound) {
      setDialogState("welcome");
      // NO REDIRIGIMOS AQUÍ DIRECTAMENTE, lo hacemos al confirmar el diálogo
    } else {
      setDialogState("not-found");
    }
  };

  // NUEVO: Función para manejar la confirmación del diálogo de bienvenida y redirigir
  const handleWelcomeDialogConfirm = () => {
    setDialogState("closed"); // Cierra el diálogo
    setIsProcessing(false); // Detiene el estado de procesamiento
    router.push("/dashboard"); // Redirige al usuario a la nueva página
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      handleVerifyPhone();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNotFoundDialogClose = () => {
    setDialogState("closed");
    setIsProcessing(false);
    // Podrías decidir aquí si quieres reiniciar el formulario o no para el caso de "no encontrado"
    // Actualmente, no lo reinicia, solo cierra el diálogo y permite intentar de nuevo.
  };
  
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        {step === 0 && <Step0Welcome onNext={handleNext} />}
        {step === 1 && (
          <Step1PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={handleNext}
            onBack={handleBack}
            isProcessing={isProcessing}
          />
        )}
      </div>

      <WelcomeDialog
        open={dialogState === "welcome"}
        onConfirm={handleWelcomeDialogConfirm} // MODIFICADO: Ahora llama a la nueva función
      />
      <NotFoundDialog
        open={dialogState === "not-found"}
        onConfirm={handleNotFoundDialogClose}
      />
    </main>
  );
}