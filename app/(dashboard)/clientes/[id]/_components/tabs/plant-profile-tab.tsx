"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field-group";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { mockPlantProfile } from "@/lib/mock-plant-profile";
import { CONUEE_DIAGNOSTIC_SECTIONS } from "@/lib/standards/efficiency";
import { useClientData } from "../shared/client-data-context";
import {
  Building2,
  Clock,
  Factory,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const plant = mockPlantProfile;

const areaSegments = [
  {
    label: "Produccion",
    value: plant.production_area_m2,
    pct: (plant.production_area_m2 / plant.total_area_m2) * 100,
    color: "bg-nx-primary",
  },
  {
    label: "Oficinas",
    value: plant.office_area_m2,
    pct: (plant.office_area_m2 / plant.total_area_m2) * 100,
    color: "bg-nx-accent",
  },
  {
    label: "Almacen",
    value: plant.warehouse_area_m2,
    pct: (plant.warehouse_area_m2 / plant.total_area_m2) * 100,
    color: "bg-nx-warning",
  },
];

export function PlantProfileSection() {
  const { client } = useClientData();

  const utilizationPct =
    plant.transformer_capacity_kva > 0
      ? (client.contracted_demand_kw / plant.transformer_capacity_kva) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left column: Facility info ── */}
        <div className="space-y-6">
          {/* Superficie */}
          <Card>
            <SectionHeader
              title="Superficie"
              description="Distribucion de areas de la planta"
              icon={Building2}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <FieldGroup
                label="Area total"
                value={formatNumber(plant.total_area_m2)}
                unit="m²"
              />
              <FieldGroup
                label="Area de produccion"
                value={formatNumber(plant.production_area_m2)}
                unit="m²"
              />
              <FieldGroup
                label="Oficinas"
                value={formatNumber(plant.office_area_m2)}
                unit="m²"
              />
              <FieldGroup
                label="Almacen / Bodega"
                value={formatNumber(plant.warehouse_area_m2)}
                unit="m²"
              />
            </div>

            {/* Visual proportion bar */}
            <div className="mt-4">
              <p className="text-xs text-nx-text-muted mb-2">
                Distribucion de area
              </p>
              <div className="flex h-3 rounded-full overflow-hidden">
                {areaSegments.map((seg) => (
                  <div
                    key={seg.label}
                    className={`${seg.color} transition-all`}
                    style={{ width: `${seg.pct}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-2">
                {areaSegments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                    <span className="text-[11px] text-nx-text-muted">
                      {seg.label} ({seg.pct.toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Horario de operacion */}
          <Card>
            <SectionHeader
              title="Horario de operacion"
              description="Turnos y dias de trabajo"
              icon={Clock}
            />
            <div className="mt-4 grid grid-cols-3 gap-4">
              <FieldGroup
                label="Turnos por dia"
                value={plant.shifts_per_day}
              />
              <FieldGroup
                label="Horas por turno"
                value={plant.hours_per_shift}
                unit="h"
              />
              <FieldGroup
                label="Dias por semana"
                value={plant.days_per_week}
              />
            </div>
            <div className="mt-3 text-xs text-nx-text-muted">
              Total:{" "}
              <span className="font-medium text-nx-text">
                {plant.shifts_per_day * plant.hours_per_shift} h/dia
              </span>{" "}
              ·{" "}
              <span className="font-medium text-nx-text">
                {formatNumber(plant.operating_days_per_year)} dias/ano
              </span>
            </div>
          </Card>

          {/* Produccion */}
          <Card>
            <SectionHeader
              title="Produccion"
              description="Volumen y proceso productivo"
              icon={Factory}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {plant.production_volume !== null && (
                <FieldGroup
                  label="Volumen anual"
                  value={formatNumber(plant.production_volume)}
                  unit={plant.production_unit ?? ""}
                />
              )}
              <FieldGroup
                label="Dias operativos"
                value={formatNumber(plant.operating_days_per_year)}
                unit="dias/ano"
              />
            </div>
            <div className="mt-4 p-3 rounded-lg bg-nx-surface">
              <p className="text-xs text-nx-text-muted mb-1">
                Descripcion del proceso
              </p>
              <p className="text-xs text-nx-text leading-relaxed">
                {plant.process_description}
              </p>
            </div>
          </Card>
        </div>

        {/* ── Right column: Electrical infrastructure ── */}
        <div className="space-y-6">
          {/* Transformer */}
          <Card>
            <SectionHeader
              title="Infraestructura electrica"
              description="Transformadores, voltaje y subestaciones"
              icon={Zap}
            />

            <div className="mt-4 space-y-4">
              {/* Transformer utilization gauge */}
              <div className="p-4 rounded-lg bg-nx-surface">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-nx-text-muted">
                    Utilizacion del transformador
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      utilizationPct > 90
                        ? "text-nx-danger"
                        : utilizationPct > 75
                        ? "text-nx-warning"
                        : "text-nx-accent"
                    }`}
                  >
                    {utilizationPct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-nx-card overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      utilizationPct > 90
                        ? "bg-nx-danger"
                        : utilizationPct > 75
                        ? "bg-nx-warning"
                        : "bg-nx-accent"
                    }`}
                    style={{ width: `${Math.min(100, utilizationPct)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-nx-text-muted">
                  <span>
                    Demanda contratada:{" "}
                    {formatNumber(client.contracted_demand_kw)} kW
                  </span>
                  <span>
                    Capacidad:{" "}
                    {formatNumber(plant.transformer_capacity_kva)} kVA
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup
                  label="Capacidad transformador"
                  value={formatNumber(plant.transformer_capacity_kva)}
                  unit="kVA"
                />
                <FieldGroup
                  label="No. transformadores"
                  value={plant.transformer_count}
                />
                <FieldGroup
                  label="Nivel de voltaje"
                  value={plant.voltage_level}
                />
                <FieldGroup
                  label="Subestaciones"
                  value={plant.substation_count}
                />
              </div>

              {/* Generator */}
              {plant.has_generator && (
                <div className="p-3 rounded-lg border border-nx-border">
                  <p className="text-xs font-medium text-nx-text mb-2">
                    Planta de emergencia
                  </p>
                  <FieldGroup
                    label="Capacidad generador"
                    value={
                      plant.generator_capacity_kva
                        ? formatNumber(plant.generator_capacity_kva)
                        : "N/D"
                    }
                    unit="kVA"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* CFE info */}
          <Card>
            <SectionHeader title="Datos CFE" description="Contrato de suministro" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <FieldGroup label="No. Medidor" value={client.meter_number} />
              <FieldGroup label="RPU" value={client.rpu} />
              <FieldGroup label="Tarifa" value={client.tariff} />
              <FieldGroup
                label="Demanda contratada"
                value={formatNumber(client.contracted_demand_kw)}
                unit="kW"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* ── Bottom: CONUEE compliance ── */}
      <Card>
        <SectionHeader
          title="Cumplimiento CONUEE"
          description="Diagnostico energetico — secciones cubiertas con los datos disponibles"
          icon={ShieldCheck}
        />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONUEE_DIAGNOSTIC_SECTIONS.slice(0, 2).map((section) => (
            <div
              key={section.number}
              className="flex items-start gap-3 p-3 rounded-lg bg-nx-surface"
            >
              <CheckCircle2 className="h-4 w-4 text-nx-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-nx-text">
                  Seccion {section.number}: {section.title}
                </p>
                <p className="text-[11px] text-nx-text-muted mt-0.5">
                  {section.description}
                </p>
                <Badge variant="accent" className="mt-1.5">
                  Completo
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-nx-text-muted mt-3 border-t border-nx-border/50 pt-2">
          Referencia: CONUEE — Lineamientos de Diagnostico Energetico para
          Usuarios de Patron de Alto Consumo (9 secciones)
        </p>
      </Card>
    </div>
  );
}
