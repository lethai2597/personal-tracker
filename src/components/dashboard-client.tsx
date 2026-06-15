"use client";

import { App } from "@/app";
import { ConfirmProvider } from "./confirm-dialog";
import { TooltipProvider } from "./ui/tooltip";

export function DashboardClient({ userEmail }: { userEmail: string }) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      <ConfirmProvider>
        <App userEmail={userEmail} />
      </ConfirmProvider>
    </TooltipProvider>
  );
}
