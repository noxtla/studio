// src/app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Step0Welcome from "@/components/phone-verify/step-0-welcome";
import Step1PhoneInput from "@/components/phone-verify/step-1-phone-input";
import WelcomeDialog from "@/components/phone-verify/welcome-dialog";
// import NotFoundDialog from "@/components/phone-verify/not-found-dialog"; // <-- ELIMINADO/COMENTADO: Ya no necesitamos importar este diálogo

type DialogState = "closed" | "welcome"; // <-- MODIFICADO: 'not-found' ya no es un estado posible

export default function Home() {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("closed");

  const router = useRouter();

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

    // const isUserFound = Math.random() > 0.3; // <-- ELIMINADO: Ya no simulamos si el usuario es encontrado
    const isUserFound = true; // <-- AÑADIDO: Siempre consideramos que el usuario es encontrado para el demo

    if (isUserFound) {
      setDialogState("welcome");
    } else {
      // Este bloque ya no se alcanzará, pero lo dejamos como comentario para referencia
      // setDialogState("not-found");
    }
  };

  const handleWelcomeDialogConfirm = () => {
    setDialogState("closed");
    setIsProcessing(false);
    router.push("/dashboard");
  };

  // const handleNotFoundDialogClose = () => { // <-- ELIMINADO: Esta función ya no es necesaria
  //   setDialogState("closed");
  //   setIsProcessing(false);
  // };
  
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
        onConfirm={handleWelcomeDialogConfirm}
      />
      {/* <NotFoundDialog // <-- ELIMINADO/COMENTADO: Ya no se renderiza el diálogo de no encontrado
        open={dialogState === "not-found"}
        onConfirm={handleNotFoundDialogClose}
      /> */}
    </main>
  );
}