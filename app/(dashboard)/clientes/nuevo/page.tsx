"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Factory,
  Zap,
  Receipt,
  Cpu,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Lightbulb,
  Wind,
  Gauge,
  Box,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stepper } from "@/components/ui/stepper";
import { SubTabs } from "@/components/ui/sub-tabs";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatNumber } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Invoice {
  period: string;
  kwh: number;
  demandKw: number;
  powerFactor: number;
  costMxn: number;
}

interface Equipment {
  category: string;
  name: string;
  [key: string]: string | number;
}

interface FormData {
  // Step 1 - Datos del Cliente
  companyName: string;
  rfc: string;
  industry: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  // Step 2 - Perfil de Planta
  totalArea: string;
  productionArea: string;
  officeArea: string;
  shiftsPerDay: string;
  hoursPerShift: string;
  daysPerWeek: string;
  operatingDaysPerYear: string;
  productionVolume: string;
  productionUnit: string;
  processDescription: string;
  // Step 3 - Infraestructura Electrica
  transformerCapacity: string;
  numTransformers: string;
  voltageLevel: string;
  numSubstations: string;
  hasGenerator: boolean;
  generatorCapacity: string;
  contractedDemand: string;
  cfeTariff: string;
  meterNumber: string;
  rpu: string;
}

const INITIAL_FORM: FormData = {
  companyName: "",
  rfc: "",
  industry: "",
  location: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  totalArea: "",
  productionArea: "",
  officeArea: "",
  shiftsPerDay: "1",
  hoursPerShift: "8",
  daysPerWeek: "5",
  operatingDaysPerYear: "300",
  productionVolume: "",
  productionUnit: "",
  processDescription: "",
  transformerCapacity: "",
  numTransformers: "1",
  voltageLevel: "",
  numSubstations: "0",
  hasGenerator: false,
  generatorCapacity: "",
  contractedDemand: "",
  cfeTariff: "",
  meterNumber: "",
  rpu: "",
};

const STEPS = [
  { label: "Cliente", description: "Datos generales" },
  { label: "Planta", description: "Perfil operativo" },
  { label: "Eléctrica", description: "Infraestructura" },
  { label: "Recibos", description: "CFE" },
  { label: "Equipos", description: "Inventario" },
  { label: "Resumen", description: "Revisión" },
];

const INDUSTRIES = [
  { value: "manufactura", label: "Manufactura" },
  { value: "alimentos", label: "Alimentos" },
  { value: "cemento", label: "Cemento" },
  { value: "acero", label: "Acero" },
  { value: "plasticos", label: "Plásticos" },
  { value: "hoteleria", label: "Hotelería" },
  { value: "agricultura", label: "Agricultura" },
  { value: "comercial", label: "Comercial" },
  { value: "otro", label: "Otro" },
];

const TARIFFS = [
  { value: "GDMTH", label: "GDMTH" },
  { value: "GDMTO", label: "GDMTO" },
  { value: "DIT", label: "DIT" },
  { value: "DIST", label: "DIST" },
  { value: "PDBT", label: "PDBT" },
];

const PERIODS = [
  "Ene 2025", "Feb 2025", "Mar 2025", "Abr 2025", "May 2025", "Jun 2025",
  "Jul 2025", "Ago 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dic 2025",
].map((p) => ({ value: p, label: p }));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NuevoClientePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Invoice form state
  const [invPeriod, setInvPeriod] = useState("");
  const [invKwh, setInvKwh] = useState("");
  const [invDemand, setInvDemand] = useState("");
  const [invPf, setInvPf] = useState("");
  const [invCost, setInvCost] = useState("");

  // Equipment form state
  const [eqCategory, setEqCategory] = useState("motores");
  const [eqFields, setEqFields] = useState<Record<string, string>>({});

  const update = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (currentStep === 0) return form.companyName.trim().length > 0;
    return true;
  };

  const goTo = (step: number) => {
    if (step >= 0 && step < STEPS.length) setCurrentStep(step);
  };

  /* ---- Invoice helpers ---- */
  const addInvoice = () => {
    if (!invPeriod || !invKwh) return;
    setInvoices((prev) => [
      ...prev,
      {
        period: invPeriod,
        kwh: Number(invKwh),
        demandKw: Number(invDemand) || 0,
        powerFactor: Number(invPf) || 0.9,
        costMxn: Number(invCost) || 0,
      },
    ]);
    setInvPeriod("");
    setInvKwh("");
    setInvDemand("");
    setInvPf("");
    setInvCost("");
  };

  const removeInvoice = (idx: number) =>
    setInvoices((prev) => prev.filter((_, i) => i !== idx));

  /* ---- Equipment helpers ---- */
  const eqCounts: Record<string, number> = {
    motores: equipment.filter((e) => e.category === "motores").length,
    iluminacion: equipment.filter((e) => e.category === "iluminacion").length,
    hvac: equipment.filter((e) => e.category === "hvac").length,
    aire: equipment.filter((e) => e.category === "aire").length,
    otros: equipment.filter((e) => e.category === "otros").length,
  };

  const addEquipment = () => {
    const name = eqFields.name?.trim();
    if (!name) return;
    setEquipment((prev) => [...prev, { category: eqCategory, name: eqFields.name, ...eqFields } as Equipment]);
    setEqFields({});
  };

  const removeEquipment = (idx: number) =>
    setEquipment((prev) => prev.filter((_, i) => i !== idx));

  const updateEq = (key: string, val: string) =>
    setEqFields((prev) => ({ ...prev, [key]: val }));

  /* ---------------------------------------------------------------- */
  /*  Step renderers                                                   */
  /* ---------------------------------------------------------------- */

  const renderStep1 = () => (
    <div className="space-y-6">
      <SectionHeader
        icon={Building2}
        title="Datos del Cliente"
        description="Información general de la empresa"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre de la empresa *"
          value={form.companyName}
          onChange={(e) => update("companyName", e.target.value)}
          placeholder="Ej: Cementos del Norte S.A."
        />
        <Input
          label="RFC"
          value={form.rfc}
          onChange={(e) => update("rfc", e.target.value)}
          placeholder="XAXX010101000"
        />
        <Select
          label="Industria"
          options={INDUSTRIES}
          placeholder="Seleccionar industria"
          value={form.industry}
          onChange={(e) => update("industry", e.target.value)}
        />
        <Input
          label="Ubicación / Ciudad"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Monterrey, NL"
        />
      </div>
      <div className="border-t border-nx-border pt-4">
        <p className="text-xs text-nx-text-muted mb-3 font-medium uppercase tracking-wider">Contacto Principal</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nombre"
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            placeholder="Ing. Juan Pérez"
          />
          <Input
            label="Email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            placeholder="juan@empresa.com"
          />
          <Input
            label="Teléfono"
            value={form.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
            placeholder="+52 81 1234 5678"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <SectionHeader
        icon={Factory}
        title="Perfil de Planta"
        description="Datos operativos y de producción"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Área total m²"
          type="number"
          value={form.totalArea}
          onChange={(e) => update("totalArea", e.target.value)}
          placeholder="5000"
        />
        <Input
          label="Área de producción m²"
          type="number"
          value={form.productionArea}
          onChange={(e) => update("productionArea", e.target.value)}
          placeholder="3500"
        />
        <Input
          label="Área de oficinas m²"
          type="number"
          value={form.officeArea}
          onChange={(e) => update("officeArea", e.target.value)}
          placeholder="500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Turnos por día"
          options={[
            { value: "1", label: "1 turno" },
            { value: "2", label: "2 turnos" },
            { value: "3", label: "3 turnos" },
          ]}
          value={form.shiftsPerDay}
          onChange={(e) => update("shiftsPerDay", e.target.value)}
        />
        <Input
          label="Horas por turno"
          type="number"
          value={form.hoursPerShift}
          onChange={(e) => update("hoursPerShift", e.target.value)}
        />
        <Select
          label="Días por semana"
          options={[
            { value: "5", label: "5 días" },
            { value: "6", label: "6 días" },
            { value: "7", label: "7 días" },
          ]}
          value={form.daysPerWeek}
          onChange={(e) => update("daysPerWeek", e.target.value)}
        />
        <Input
          label="Días operativos/año"
          type="number"
          value={form.operatingDaysPerYear}
          onChange={(e) => update("operatingDaysPerYear", e.target.value)}
        />
      </div>
      <div className="border-t border-nx-border pt-4">
        <p className="text-xs text-nx-text-muted mb-3 font-medium uppercase tracking-wider">Producción</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Volumen de producción (opcional)"
            type="number"
            value={form.productionVolume}
            onChange={(e) => update("productionVolume", e.target.value)}
            placeholder="1000"
          />
          <Input
            label="Unidad de producción"
            value={form.productionUnit}
            onChange={(e) => update("productionUnit", e.target.value)}
            placeholder="toneladas, piezas, m3..."
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Descripción del proceso"
            value={form.processDescription}
            onChange={(e) => update("processDescription", e.target.value)}
            placeholder="Describa brevemente el proceso productivo principal..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <SectionHeader
        icon={Zap}
        title="Infraestructura Eléctrica"
        description="Transformadores, subestaciones y contrato CFE"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Capacidad transformador kVA"
          type="number"
          value={form.transformerCapacity}
          onChange={(e) => update("transformerCapacity", e.target.value)}
          placeholder="1000"
        />
        <Select
          label="Número de transformadores"
          options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
          value={form.numTransformers}
          onChange={(e) => update("numTransformers", e.target.value)}
        />
        <Select
          label="Nivel de voltaje"
          options={[
            { value: "220V trifásico", label: "220V trifásico" },
            { value: "440V trifásico", label: "440V trifásico" },
            { value: "23kV", label: "23kV" },
          ]}
          placeholder="Seleccionar"
          value={form.voltageLevel}
          onChange={(e) => update("voltageLevel", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Subestaciones"
          options={[0, 1, 2, 3].map((n) => ({ value: String(n), label: String(n) }))}
          value={form.numSubstations}
          onChange={(e) => update("numSubstations", e.target.value)}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-nx-text">Planta de emergencia</label>
          <button
            type="button"
            onClick={() => update("hasGenerator", !form.hasGenerator)}
            className={`relative inline-flex h-10 w-20 items-center rounded-lg border transition-colors ${
              form.hasGenerator
                ? "bg-nx-primary border-nx-primary"
                : "bg-nx-surface border-nx-border"
            }`}
          >
            <span
              className={`inline-block h-7 w-7 rounded-md bg-white shadow transition-transform ${
                form.hasGenerator ? "translate-x-11" : "translate-x-1.5"
              }`}
            />
            <span
              className={`absolute text-xs font-medium ${
                form.hasGenerator ? "left-2.5 text-white" : "right-2.5 text-nx-text-muted"
              }`}
            >
              {form.hasGenerator ? "Sí" : "No"}
            </span>
          </button>
        </div>
        {form.hasGenerator && (
          <Input
            label="Capacidad generador kVA"
            type="number"
            value={form.generatorCapacity}
            onChange={(e) => update("generatorCapacity", e.target.value)}
            placeholder="500"
          />
        )}
      </div>
      <div className="border-t border-nx-border pt-4">
        <p className="text-xs text-nx-text-muted mb-3 font-medium uppercase tracking-wider">Contrato CFE</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Demanda contratada kW"
            type="number"
            value={form.contractedDemand}
            onChange={(e) => update("contractedDemand", e.target.value)}
            placeholder="800"
          />
          <Select
            label="Tarifa CFE"
            options={TARIFFS}
            placeholder="Seleccionar tarifa"
            value={form.cfeTariff}
            onChange={(e) => update("cfeTariff", e.target.value)}
          />
          <Input
            label="Número de medidor"
            value={form.meterNumber}
            onChange={(e) => update("meterNumber", e.target.value)}
            placeholder="ABC123456"
          />
          <Input
            label="RPU"
            value={form.rpu}
            onChange={(e) => update("rpu", e.target.value)}
            placeholder="123456789012"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <SectionHeader
        icon={Receipt}
        title="Recibos CFE"
        description="Captura los 12 recibos bimestrales del último año"
        badge={
          <Badge variant={invoices.length >= 12 ? "accent" : "primary"}>
            {invoices.length}/12 recibos
          </Badge>
        }
      />
      <ProgressBar
        value={(invoices.length / 12) * 100}
        label={`${invoices.length} de 12 recibos cargados`}
        color={invoices.length >= 12 ? "accent" : "primary"}
        size="sm"
      />
      <Card className="p-4">
        <p className="text-xs font-medium text-nx-text-secondary mb-3">Agregar recibo</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Select
            options={PERIODS}
            placeholder="Periodo"
            value={invPeriod}
            onChange={(e) => setInvPeriod(e.target.value)}
          />
          <Input
            type="number"
            placeholder="kWh totales"
            value={invKwh}
            onChange={(e) => setInvKwh(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Demanda kW"
            value={invDemand}
            onChange={(e) => setInvDemand(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Factor potencia"
            step="0.01"
            value={invPf}
            onChange={(e) => setInvPf(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Costo MXN"
            value={invCost}
            onChange={(e) => setInvCost(e.target.value)}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button size="sm" onClick={addInvoice} disabled={!invPeriod || !invKwh}>
            <Plus className="h-3.5 w-3.5" /> Agregar recibo
          </Button>
        </div>
      </Card>

      {invoices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nx-border text-left text-xs text-nx-text-muted">
                <th className="pb-2 font-medium">Periodo</th>
                <th className="pb-2 font-medium text-right">kWh</th>
                <th className="pb-2 font-medium text-right">Demanda kW</th>
                <th className="pb-2 font-medium text-right">FP</th>
                <th className="pb-2 font-medium text-right">Costo</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {invoices.map((inv, i) => (
                <tr key={i}>
                  <td className="py-2 text-nx-text">{inv.period}</td>
                  <td className="py-2 text-right text-nx-text">{formatNumber(inv.kwh)}</td>
                  <td className="py-2 text-right text-nx-text">{formatNumber(inv.demandKw)}</td>
                  <td className="py-2 text-right text-nx-text">{inv.powerFactor.toFixed(2)}</td>
                  <td className="py-2 text-right text-nx-text">{formatCurrency(inv.costMxn)}</td>
                  <td className="py-2">
                    <button
                      onClick={() => removeInvoice(i)}
                      className="text-nx-text-muted hover:text-nx-danger transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEquipmentForm = () => {
    switch (eqCategory) {
      case "motores":
        return (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="Nombre" value={eqFields.name || ""} onChange={(e) => updateEq("name", e.target.value)} />
            <Input type="number" placeholder="HP" value={eqFields.hp || ""} onChange={(e) => updateEq("hp", e.target.value)} />
            <Input type="number" placeholder="Voltaje" value={eqFields.voltage || ""} onChange={(e) => updateEq("voltage", e.target.value)} />
            <Input type="number" placeholder="Horas/día" value={eqFields.hoursDay || ""} onChange={(e) => updateEq("hoursDay", e.target.value)} />
            <Input type="number" placeholder="Eficiencia %" value={eqFields.efficiency || ""} onChange={(e) => updateEq("efficiency", e.target.value)} />
          </div>
        );
      case "iluminacion":
        return (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="Área" value={eqFields.name || ""} onChange={(e) => updateEq("name", e.target.value)} />
            <Select
              options={[
                { value: "LED", label: "LED" },
                { value: "Fluorescente T8", label: "Fluorescente T8" },
                { value: "Fluorescente T5", label: "Fluorescente T5" },
                { value: "Halógeno", label: "Halógeno" },
                { value: "HID", label: "HID" },
                { value: "Otro", label: "Otro" },
              ]}
              placeholder="Tipo lámpara"
              value={eqFields.lampType || ""}
              onChange={(e) => updateEq("lampType", e.target.value)}
            />
            <Input type="number" placeholder="Cantidad" value={eqFields.quantity || ""} onChange={(e) => updateEq("quantity", e.target.value)} />
            <Input type="number" placeholder="W/unidad" value={eqFields.wattsUnit || ""} onChange={(e) => updateEq("wattsUnit", e.target.value)} />
            <Input type="number" placeholder="Horas/día" value={eqFields.hoursDay || ""} onChange={(e) => updateEq("hoursDay", e.target.value)} />
          </div>
        );
      case "hvac":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input placeholder="Nombre" value={eqFields.name || ""} onChange={(e) => updateEq("name", e.target.value)} />
            <Select
              options={[
                { value: "Split", label: "Split" },
                { value: "Paquete", label: "Paquete" },
                { value: "Chiller", label: "Chiller" },
                { value: "Mini-split", label: "Mini-split" },
                { value: "VRF", label: "VRF" },
              ]}
              placeholder="Tipo"
              value={eqFields.hvacType || ""}
              onChange={(e) => updateEq("hvacType", e.target.value)}
            />
            <Input type="number" placeholder="Capacidad TR" value={eqFields.capacityTr || ""} onChange={(e) => updateEq("capacityTr", e.target.value)} />
            <Input type="number" placeholder="Horas/día" value={eqFields.hoursDay || ""} onChange={(e) => updateEq("hoursDay", e.target.value)} />
          </div>
        );
      case "aire":
        return (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="Nombre" value={eqFields.name || ""} onChange={(e) => updateEq("name", e.target.value)} />
            <Select
              options={[
                { value: "Tornillo", label: "Tornillo" },
                { value: "Pistón", label: "Pistón" },
                { value: "Scroll", label: "Scroll" },
                { value: "Centrífugo", label: "Centrífugo" },
              ]}
              placeholder="Tipo"
              value={eqFields.compType || ""}
              onChange={(e) => updateEq("compType", e.target.value)}
            />
            <Input type="number" placeholder="HP" value={eqFields.hp || ""} onChange={(e) => updateEq("hp", e.target.value)} />
            <Input type="number" placeholder="PSI" value={eqFields.psi || ""} onChange={(e) => updateEq("psi", e.target.value)} />
            <Input type="number" placeholder="Horas/día" value={eqFields.hoursDay || ""} onChange={(e) => updateEq("hoursDay", e.target.value)} />
          </div>
        );
      case "otros":
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input placeholder="Nombre" value={eqFields.name || ""} onChange={(e) => updateEq("name", e.target.value)} />
            <Input placeholder="Tipo" value={eqFields.eqType || ""} onChange={(e) => updateEq("eqType", e.target.value)} />
            <Input type="number" placeholder="kW" value={eqFields.kw || ""} onChange={(e) => updateEq("kw", e.target.value)} />
            <Input type="number" placeholder="Horas/día" value={eqFields.hoursDay || ""} onChange={(e) => updateEq("hoursDay", e.target.value)} />
          </div>
        );
    }
  };

  const renderStep5 = () => {
    const categoryEquipment = equipment.filter((e) => e.category === eqCategory);
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={Cpu}
          title="Inventario de Equipos"
          description="Registra los equipos principales por categoría"
          badge={<Badge variant="primary">{equipment.length} equipos</Badge>}
        />
        <SubTabs
          tabs={[
            { id: "motores", label: "Motores", count: eqCounts.motores },
            { id: "iluminacion", label: "Iluminación", count: eqCounts.iluminacion },
            { id: "hvac", label: "HVAC", count: eqCounts.hvac },
            { id: "aire", label: "Aire Comprimido", count: eqCounts.aire },
            { id: "otros", label: "Otros", count: eqCounts.otros },
          ]}
          active={eqCategory}
          onChange={(id) => {
            setEqCategory(id);
            setEqFields({});
          }}
        />
        <Card className="p-4">
          <p className="text-xs font-medium text-nx-text-secondary mb-3">Agregar equipo</p>
          {renderEquipmentForm()}
          <div className="mt-3 flex justify-end">
            <Button size="sm" onClick={addEquipment} disabled={!eqFields.name?.trim()}>
              <Plus className="h-3.5 w-3.5" /> Agregar equipo
            </Button>
          </div>
        </Card>

        {categoryEquipment.length > 0 && (
          <div className="space-y-2">
            {categoryEquipment.map((eq, i) => {
              const globalIdx = equipment.indexOf(eq);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-nx-border bg-nx-surface px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-nx-text">{eq.name}</span>
                    <div className="flex gap-2">
                      {Object.entries(eq)
                        .filter(([k]) => k !== "category" && k !== "name")
                        .map(([k, v]) => (
                          <Badge key={k} variant="default">
                            {k}: {v}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeEquipment(globalIdx)}
                    className="text-nx-text-muted hover:text-nx-danger transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderStep6 = () => {
    const totalKwh = invoices.reduce((s, inv) => s + inv.kwh, 0);
    const totalCost = invoices.reduce((s, inv) => s + inv.costMxn, 0);
    const completionPct = Math.round(
      ([
        form.companyName,
        form.industry,
        form.location,
        form.contactName,
        form.totalArea,
        form.transformerCapacity,
        form.cfeTariff,
      ].filter(Boolean).length /
        7) *
        100
    );

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={ClipboardCheck}
          title="Resumen del Cliente"
          description="Revisa la información antes de continuar"
          badge={
            <Badge variant={completionPct >= 80 ? "accent" : "warning"}>
              {completionPct}% completo
            </Badge>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client info card */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-nx-primary" />
              <h4 className="text-sm font-medium text-nx-text">Datos del Cliente</h4>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-nx-text font-medium">{form.companyName || "—"}</p>
              <p className="text-nx-text-muted">{form.rfc || "Sin RFC"}</p>
              <p className="text-nx-text-secondary">{INDUSTRIES.find((i) => i.value === form.industry)?.label || "—"} | {form.location || "—"}</p>
              {form.contactName && (
                <p className="text-nx-text-muted text-xs mt-2">
                  Contacto: {form.contactName} {form.contactEmail ? `(${form.contactEmail})` : ""}
                </p>
              )}
            </div>
          </Card>

          {/* Plant profile */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Factory className="h-4 w-4 text-nx-primary" />
              <h4 className="text-sm font-medium text-nx-text">Perfil de Planta</h4>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-nx-text-secondary">
                {form.totalArea ? `${formatNumber(Number(form.totalArea))} m²` : "—"} total
              </p>
              <p className="text-nx-text-secondary">
                {form.shiftsPerDay} turno(s) x {form.hoursPerShift}h | {form.daysPerWeek} días/sem
              </p>
              <p className="text-nx-text-muted">{form.operatingDaysPerYear} días/año</p>
            </div>
          </Card>

          {/* Infrastructure */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-nx-primary" />
              <h4 className="text-sm font-medium text-nx-text">Infraestructura</h4>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-nx-text-secondary">
                {form.transformerCapacity ? `${form.transformerCapacity} kVA` : "—"} ({form.numTransformers} transf.)
              </p>
              <p className="text-nx-text-secondary">{form.voltageLevel || "—"}</p>
              <p className="text-nx-text-secondary">Tarifa: {form.cfeTariff || "—"}</p>
              <p className="text-nx-text-secondary">
                Demanda contratada: {form.contractedDemand ? `${form.contractedDemand} kW` : "—"}
              </p>
              {form.hasGenerator && (
                <p className="text-nx-text-muted">Generador: {form.generatorCapacity} kVA</p>
              )}
            </div>
          </Card>

          {/* Invoices */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-4 w-4 text-nx-primary" />
              <h4 className="text-sm font-medium text-nx-text">Recibos CFE</h4>
            </div>
            <ProgressBar
              value={(invoices.length / 12) * 100}
              label={`${invoices.length}/12 recibos`}
              color={invoices.length >= 12 ? "accent" : "primary"}
              size="sm"
            />
            {invoices.length > 0 && (
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-nx-text-secondary">Consumo total: {formatNumber(totalKwh)} kWh</p>
                <p className="text-nx-text-secondary">Costo total: {formatCurrency(totalCost)}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Equipment summary */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-nx-primary" />
            <h4 className="text-sm font-medium text-nx-text">Inventario de Equipos</h4>
            <Badge variant="primary">{equipment.length} total</Badge>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { key: "motores", label: "Motores", icon: Gauge },
              { key: "iluminacion", label: "Iluminación", icon: Lightbulb },
              { key: "hvac", label: "HVAC", icon: Wind },
              { key: "aire", label: "Aire Comp.", icon: Wind },
              { key: "otros", label: "Otros", icon: Box },
            ].map((cat) => (
              <div
                key={cat.key}
                className="flex items-center gap-2 rounded-lg border border-nx-border bg-nx-surface px-3 py-2"
              >
                <cat.icon className="h-3.5 w-3.5 text-nx-text-muted" />
                <span className="text-xs text-nx-text-secondary">{cat.label}</span>
                <Badge>{eqCounts[cat.key]}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Certification readiness */}
        <Card>
          <h4 className="text-sm font-medium text-nx-text mb-4">Vista previa de certificaciones</h4>
          <div className="flex justify-center gap-8">
            <ProgressRing value={completionPct > 60 ? 45 : 20} color="primary" label="CONUEE" size={72} />
            <ProgressRing value={completionPct > 60 ? 30 : 10} color="accent" label="LEED" size={72} />
            <ProgressRing value={completionPct > 60 ? 35 : 15} color="warning" label="ISO 50001" size={72} />
          </div>
          <p className="text-xs text-nx-text-muted text-center mt-3">
            Los valores se calcularán con base en los datos capturados
          </p>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" disabled className="flex-1 opacity-60">
            Crear cliente y generar análisis
          </Button>
          <Button variant="secondary" disabled className="flex-1 opacity-60">
            Guardar borrador
          </Button>
        </div>
        <p className="text-xs text-nx-text-muted text-center">
          La creación de clientes y la generación de análisis estarán disponibles próximamente.
        </p>
      </div>
    );
  };

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

  /* ---------------------------------------------------------------- */
  /*  Layout                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="p-8 pb-28 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/clientes"
          className="rounded-lg p-2 hover:bg-nx-surface transition-colors text-nx-text-muted hover:text-nx-text"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-nx-text tracking-tight">Nuevo Cliente</h1>
          <p className="text-sm text-nx-text-muted mt-0.5">Asistente de onboarding - Captura de datos en planta</p>
        </div>
      </div>

      {/* Stepper */}
      <Card className="p-4">
        <Stepper steps={STEPS} current={currentStep} onStepClick={goTo} />
      </Card>

      {/* Step content */}
      <Card>{stepRenderers[currentStep]()}</Card>

      {/* Bottom nav bar */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-nx-border bg-nx-bg/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-8 py-4">
            <div>
              {currentStep > 0 && (
                <Button variant="secondary" onClick={() => goTo(currentStep - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-nx-text-muted">
                Paso {currentStep + 1} de {STEPS.length}
              </span>
              <Button onClick={() => goTo(currentStep + 1)} disabled={!canNext()}>
                Siguiente <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
