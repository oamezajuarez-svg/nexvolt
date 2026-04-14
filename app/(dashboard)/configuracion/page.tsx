"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import {
  Settings,
  User,
  Building2,
  Plug,
  Key,
  Bell,
} from "lucide-react";

const iotIntegrations = [
  { name: "Carlo Gavazzi EM340", description: "Medidor de energía trifásico" },
  { name: "Schneider PM5560", description: "Power meter de alta precisión" },
  { name: "Shelly Pro 3EM", description: "Monitor WiFi compacto" },
];

const notifications = [
  { label: "Alertas críticas por email", defaultOn: true },
  { label: "Resumen semanal", defaultOn: true },
  { label: "Nuevas anomalías detectadas", defaultOn: false },
];

export default function ConfiguracionPage() {
  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        icon={Settings}
        title="Configuración"
        description="Administra tu cuenta y preferencias"
      />

      {/* Perfil */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg p-2 bg-nx-primary-bg">
            <User className="h-4 w-4 text-nx-primary" />
          </div>
          <h3 className="text-sm font-medium text-nx-text">Perfil</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldGroup label="Nombre" value="Oscar Ameza" />
          <FieldGroup label="Email" value="oamezajuarez@gmail.com" />
          <FieldGroup label="Rol" value="Administrador" />
        </div>
      </Card>

      {/* Empresa */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg p-2 bg-nx-primary-bg">
            <Building2 className="h-4 w-4 text-nx-primary" />
          </div>
          <h3 className="text-sm font-medium text-nx-text">Empresa</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Nombre de empresa" value="NexVolt" />
          <FieldGroup label="Plan" value="Piloto" />
        </div>
      </Card>

      {/* Integraciones IoT */}
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg p-2 bg-nx-primary-bg">
            <Plug className="h-4 w-4 text-nx-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-nx-text">Integraciones IoT</h3>
            <p className="text-xs text-nx-text-muted">
              Configura la conexión con dispositivos de monitoreo
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {iotIntegrations.map((int) => (
            <div
              key={int.name}
              className="flex items-center justify-between rounded-lg border border-nx-border bg-nx-surface/50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-nx-text">{int.name}</p>
                <p className="text-xs text-nx-text-muted">{int.description}</p>
              </div>
              <button
                disabled
                className="rounded-lg bg-nx-surface px-3 py-1.5 text-xs font-medium text-nx-text-muted opacity-50 cursor-not-allowed border border-nx-border"
              >
                Configurar
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* API Keys */}
      <Card className="opacity-60">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-lg p-2 bg-nx-surface">
            <Key className="h-4 w-4 text-nx-text-muted" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-nx-text">API Keys</h3>
            <p className="text-xs text-nx-text-muted">
              Próximamente — Acceso programático a datos de NexVolt
            </p>
          </div>
        </div>
      </Card>

      {/* Notificaciones */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg p-2 bg-nx-primary-bg">
            <Bell className="h-4 w-4 text-nx-primary" />
          </div>
          <h3 className="text-sm font-medium text-nx-text">Notificaciones</h3>
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.label}
              className="flex items-center justify-between rounded-lg border border-nx-border bg-nx-surface/50 px-4 py-3"
            >
              <span className="text-sm text-nx-text">{notif.label}</span>
              {/* Visual toggle (non-functional) */}
              <div
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notif.defaultOn ? "bg-nx-primary" : "bg-nx-surface"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                    notif.defaultOn ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
