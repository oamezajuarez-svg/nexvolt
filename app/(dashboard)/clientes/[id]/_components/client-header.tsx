"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { ClientDetail } from "@/lib/types";

export function ClientHeader({ client }: { client: ClientDetail }) {
  return (
    <>
      {/* Header */}
      <div>
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-nx-text-muted hover:text-nx-text transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-nx-text tracking-tight">
              {client.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-nx-text-secondary">
              <span>{client.industry}</span>
              <span className="text-nx-border">|</span>
              <span>{client.location}</span>
              <span className="text-nx-border">|</span>
              <span className="font-mono text-xs text-nx-text-muted">{client.rfc}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="accent">Activo</Badge>
            <p className="text-xs text-nx-text-muted">Tarifa {client.tariff}</p>
            <p className="text-xs text-nx-text-muted">{client.rpu}</p>
          </div>
        </div>
      </div>

      {/* Client info bar */}
      <Card className="!p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <p className="text-xs text-nx-text-muted">Contacto</p>
            <p className="text-nx-text font-medium mt-0.5">{client.contact_name}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Email</p>
            <p className="text-nx-primary mt-0.5 text-xs">{client.contact_email}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Telefono</p>
            <p className="text-nx-text-secondary mt-0.5">{client.contact_phone}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Demanda contratada</p>
            <p className="text-nx-text font-medium mt-0.5">{client.contracted_demand_kw} kW</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Tension</p>
            <p className="text-nx-text-secondary mt-0.5">{client.supply_voltage}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Medidor</p>
            <p className="text-nx-text-secondary mt-0.5 font-mono text-xs">
              {client.meter_number}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
