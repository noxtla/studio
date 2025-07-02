"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Loader2, Phone } from "lucide-react";

interface Step1PhoneInputProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

export default function Step1PhoneInput({
  phoneNumber,
  setPhoneNumber,
  onNext,
  onBack,
  isProcessing,
}: Step1PhoneInputProps) {
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").substring(0, 10);
    const areaCode = digits.substring(0, 3);
    const middle = digits.substring(3, 6);
    const last = digits.substring(6, 10);

    let formatted = "";
    if (digits.length > 0) {
      formatted = `(${areaCode}`;
    }
    if (digits.length > 3) {
      formatted += `) ${middle}`;
    }
    if (digits.length > 6) {
      formatted += `-${last}`;
    }

    setPhoneNumber(formatted);
  };

  const canProceed = phoneNumber.replace(/\D/g, "").length === 10; // Modified to only check length

  return (
    <div className="w-full animate-step-enter">
      <div className="mb-6 flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center justify-center font-semibold space-x-3 text-foreground text-2xl sm:text-3xl font-headline">
          <Phone className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span>Ingresa tu Teléfono</span>
        </div>
        <p className="text-muted-foreground text-center">
          Ingresa tu número de teléfono de 10 dígitos para continuar.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="tel"
          id="phone-number-input"
          name="phoneNumber"
          placeholder="(555) 555-5555"
          className="w-full px-4 py-2 text-lg text-center h-14"
          value={phoneNumber}
          onChange={handlePhoneInput}
          disabled={isProcessing}
        />
      </div>

      <div className="w-full mt-8 flex justify-between">
        <Button onClick={onBack} variant="ghost" disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={onNext} disabled={!canProceed || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
