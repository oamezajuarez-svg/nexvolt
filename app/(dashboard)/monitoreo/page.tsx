"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { mockClientDetail } from "@/lib/mock-client-detail";
import { mockClients } from "@/lib/mock-data";
import {
  Activity,
  Wifi,
  WifiOff,
  Radio,
  Cpu,
  Users,
  CheckCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

const devices = mockClientDetail.monitoring_devices;
const clientsWithMonitoring = 1; // Only client "1" has devices

export default function MonitoreoPage() {
  const onlineCount = devices.filter((d) => d.status === "online").length;

  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        icon={Activity}
        title="Monitoreo en Tiempo Real"
        description="Estado de dispositivos IoT en todas las instalaciones"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total dispositivos"
          value={String(devices.length)}
          icon={Cpu}
          iconColor="text-nx-primary"
          iconBg="bg-nx-primary-bg"
        />
        <StatCard
          title="En línea"
          value={String(onlineCount)}
          icon={Wifi}
          iconColor="text-nx-accent"
          iconBg="bg-nx-accent-bg"
        />
        <StatCard
          title="Clientes con monitoreo"
          value={`${clientsWithMonitoring}`}
          subtitle={`de ${mockClients.length} clientes totales`}
          icon={Users}
          iconColor="text-nx-primary"
          iconBg="bg-nx-primary-bg"
        />
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          const statusColor =
            device.status === "online"
              ? "bg-nx-accent"
              : device.status === "offline"
              ? "bg-nx-danger"
              : "bg-nx-warning";

          const statusLabel =
            device.status === "online"
              ? "En línea"
              : device.status === "offline"
              ? "Desconectado"
              : "Alerta";

          return (
            <Card key={device.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-nx-text">{device.name}</h3>
                  <p className="text-xs text-nx-text-muted">{device.model}</p>
                  <p className="text-xs text-nx-text-muted">Industrias del Norte</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                  <span className="text-xs text-nx-text-muted">{statusLabel}</span>
                </div>
              </div>

              <div className="rounded-lg bg-nx-surface p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-nx-text-muted">Ubicación:</span>
                  <span className="text-nx-text">{device.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-nx-text-muted">Potencia:</span>
                  <span className="text-nx-text font-medium">
                    {formatNumber(device.last_reading.power_kw)} kW
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-nx-text-muted">Factor de potencia:</span>
                  <span className="text-nx-text font-medium">
                    {device.last_reading.power_factor.toFixed(3)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Placeholder cards for other clients */}
        {mockClients
          .filter((c) => c.id !== "1")
          .map((c) => (
            <Card key={c.id} className="flex flex-col items-center justify-center py-8 opacity-60">
              <WifiOff className="h-5 w-5 text-nx-text-muted mb-2" />
              <p className="text-xs font-medium text-nx-text">{c.name}</p>
              <p className="text-xs text-nx-text-muted">Sin dispositivos instalados</p>
            </Card>
          ))}
      </div>

      {/* CTA Card */}
      <Card className="border-nx-primary/30 bg-gradient-to-r from-nx-primary-bg/50 to-nx-card">
        <div className="flex items-start gap-4">
          <div className="rounded-xl p-3 bg-nx-primary-bg shrink-0">
            <Radio className="h-5 w-5 text-nx-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-nx-text">
              Desbloquea análisis en tiempo real
            </h3>
            <p className="text-xs text-nx-text-muted mt-1">
              Con monitoreo IoT podrás detectar anomalías en minutos, no en meses.
              Dispositivos compatibles: Carlo Gavazzi EM340, Schneider PM5560, Shelly
              Pro 3EM
            </p>

            <ul className="mt-3 space-y-1.5">
              {[
                "Detección de anomalías en tiempo real",
                "Factor de potencia minuto a minuto",
                "Armónicos y calidad de energía",
                "Alertas automáticas",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-xs text-nx-text">
                  <CheckCircle className="h-3.5 w-3.5 text-nx-accent shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
