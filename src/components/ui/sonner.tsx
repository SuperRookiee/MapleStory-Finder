"use client";

import { Toaster as SonnerToaster } from "sonner";
import { AlertTriangle, CheckCircle, Info, OctagonX } from "lucide-react";

export function Toaster() {
  return (
      <SonnerToaster
          richColors
          icons={{
          success: <CheckCircle size={18}/>,
          info: <Info size={18}/>,
          warning: <AlertTriangle size={18}/>,
          error: <OctagonX size={18}/>,
      }}/>
  );
}
