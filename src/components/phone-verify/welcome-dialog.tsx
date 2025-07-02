"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WelcomeDialogProps {
  open: boolean;
  onConfirm: () => void;
}

export default function WelcomeDialog({ open, onConfirm }: WelcomeDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline">¡Bienvenido de Nuevo!</AlertDialogTitle>
          <AlertDialogDescription>
            Hola, es genial verte de nuevo. Serás redirigido para iniciar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
