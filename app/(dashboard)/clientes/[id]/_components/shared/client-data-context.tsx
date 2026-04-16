"use client";

import { createContext, useContext } from "react";
import type { ClientDetail } from "@/lib/types";

interface ClientDataContextType {
  client: ClientDetail;
  orgId: string;
}

const ClientDataContext = createContext<ClientDataContextType | null>(null);

export function ClientDataProvider({
  client,
  orgId,
  children,
}: {
  client: ClientDetail;
  orgId: string;
  children: React.ReactNode;
}) {
  return (
    <ClientDataContext.Provider value={{ client, orgId }}>
      {children}
    </ClientDataContext.Provider>
  );
}

export function useClientData(): ClientDataContextType {
  const context = useContext(ClientDataContext);
  if (!context) {
    throw new Error("useClientData must be used within a ClientDataProvider");
  }
  return context;
}
