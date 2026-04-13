"use client";

import { Card, CardTitle, CardValue } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConsumptionChart } from "@/components/charts/consumption-chart";
import { mockClients, mockAlerts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingDown,
  Leaf,
  FolderKanban,
  Building2,
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const kpis = [
  {
    label: "Ahorro total generado",
    value: "$2.4M",
    change: 12.3,
    icon: TrendingDown,
    color: "text-nx-accent",
    bg: "bg-nx-accent/10",
  },
  {
    label: "CO₂ evitado",
    value: "148 ton",
    change: 8.7,
    icon: Leaf,
    color: "text-nx-accent",
    bg: "bg-nx-accent/10",
  },
  {
    label: "Proyectos activos",
    value: "12",
    change: 3,
    icon: FolderKanban,
    color: "text-nx-primary",
    bg: "bg-nx-primary/10",
  },
  {
    label: "Clientes activos",
    value: "8",
    change: 2,
    icon: Building2,
    color: "text-nx-primary",
    bg: "bg-nx-primary/10",
  },
];

const alertIcons = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertColors = {
  danger: "text-nx-danger",
  warning: "text-nx-warning",
  info: "text-nx-primary",
};

const statusLabels: Record<string, { label: string; variant: "accent" | "primary" | "default" }> = {
  active: { label: "Activo", variant: "accent" },
  prospect: { label: "Prospecto", variant: "primary" },
  inactive: { label: "Inactivo", variant: "default" },
};

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-nx-text tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-nx-text-muted mt-1">
          Resumen de tu cartera de gestión energética
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle>{kpi.label}</CardTitle>
                <CardValue>{kpi.value}</CardValue>
              </div>
              <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs">
              {kpi.change > 0 ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-nx-accent" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-nx-danger" />
              )}
              <span className={kpi.change > 0 ? "text-nx-accent" : "text-nx-danger"}>
                {kpi.change > 0 ? "+" : ""}
                {kpi.change}%
              </span>
              <span className="text-nx-text-muted ml-1">vs mes anterior</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart + Alerts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Consumption Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-nx-text">
                Consumo agregado de cartera
              </h3>
              <p className="text-xs text-nx-text-muted mt-0.5">
                kWh y costo — últimos 12 meses
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-nx-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-nx-primary" />
                Consumo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-nx-accent" />
                Costo
              </span>
            </div>
          </div>
          <ConsumptionChart />
        </Card>

        {/* Alerts */}
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-4">
            Alertas recientes
          </h3>
          <div className="space-y-3">
            {mockAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className="flex gap-3 rounded-lg border border-nx-border bg-nx-surface/50 p-3"
                >
                  <Icon
                    className={`h-4 w-4 mt-0.5 shrink-0 ${alertColors[alert.type]}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-nx-text-secondary">
                      {alert.client_name}
                    </p>
                    <p className="text-xs text-nx-text-muted mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Clients table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-nx-text">Clientes</h3>
          <Badge variant="primary">{mockClients.length} total</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nx-border text-left text-xs text-nx-text-muted">
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">Industria</th>
                <th className="pb-3 font-medium">Ubicación</th>
                <th className="pb-3 font-medium">Tarifa</th>
                <th className="pb-3 font-medium text-right">Costo mensual</th>
                <th className="pb-3 font-medium text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {mockClients.map((client) => {
                const st = statusLabels[client.status];
                return (
                  <tr
                    key={client.id}
                    className="hover:bg-nx-surface/50 transition-colors"
                  >
                    <td className="py-3 font-medium text-nx-text">
                      {client.name}
                    </td>
                    <td className="py-3 text-nx-text-secondary">
                      {client.industry}
                    </td>
                    <td className="py-3 text-nx-text-secondary">
                      {client.location}
                    </td>
                    <td className="py-3">
                      <Badge>{client.tariff}</Badge>
                    </td>
                    <td className="py-3 text-right text-nx-text">
                      {formatCurrency(client.monthly_cost)}
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
