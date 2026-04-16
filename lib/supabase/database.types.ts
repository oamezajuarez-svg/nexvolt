export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          rfc: string | null;
          industry: string | null;
          location: string | null;
          status: "active" | "prospect" | "inactive";
          tariff: string | null;
          monthly_cost: number;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          contracted_demand_kw: number | null;
          supply_voltage: string | null;
          meter_number: string | null;
          rpu: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rfc?: string | null;
          industry?: string | null;
          location?: string | null;
          status?: "active" | "prospect" | "inactive";
          tariff?: string | null;
          monthly_cost?: number;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          contracted_demand_kw?: number | null;
          supply_voltage?: string | null;
          meter_number?: string | null;
          rpu?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["organization_id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: "admin" | "client";
          organization_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: "admin" | "client";
          organization_id?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      cfe_invoices: {
        Row: {
          id: string;
          organization_id: string;
          period: string;
          month_index: number | null;
          consumption_base_kwh: number | null;
          consumption_intermedia_kwh: number | null;
          consumption_punta_kwh: number | null;
          total_kwh: number | null;
          demand_max_kw: number | null;
          demand_contracted_kw: number | null;
          demand_billed_kw: number | null;
          power_factor: number | null;
          power_factor_penalty_pct: number | null;
          cost_energy: number | null;
          cost_demand: number | null;
          cost_distribution: number | null;
          cost_transmission: number | null;
          cost_power_factor: number | null;
          subtotal: number | null;
          iva: number | null;
          total_cost: number | null;
          tariff: string | null;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          period: string;
          month_index?: number | null;
          consumption_base_kwh?: number | null;
          consumption_intermedia_kwh?: number | null;
          consumption_punta_kwh?: number | null;
          total_kwh?: number | null;
          demand_max_kw?: number | null;
          demand_contracted_kw?: number | null;
          demand_billed_kw?: number | null;
          power_factor?: number | null;
          power_factor_penalty_pct?: number | null;
          cost_energy?: number | null;
          cost_demand?: number | null;
          cost_distribution?: number | null;
          cost_transmission?: number | null;
          cost_power_factor?: number | null;
          subtotal?: number | null;
          iva?: number | null;
          total_cost?: number | null;
          tariff?: string | null;
          pdf_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cfe_invoices"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "cfe_invoices_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      anomalies: {
        Row: {
          id: string;
          organization_id: string;
          source: "cfe" | "monitoring";
          severity: "critical" | "high" | "medium" | "low";
          category: string | null;
          title: string;
          description: string | null;
          detected_at: string;
          period: string | null;
          financial_impact_monthly: number;
          status: "active" | "acknowledged" | "resolved";
        };
        Insert: {
          id?: string;
          organization_id: string;
          source: "cfe" | "monitoring";
          severity: "critical" | "high" | "medium" | "low";
          category?: string | null;
          title: string;
          description?: string | null;
          period?: string | null;
          financial_impact_monthly?: number;
          status?: "active" | "acknowledged" | "resolved";
        };
        Update: Partial<Database["public"]["Tables"]["anomalies"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "anomalies_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      proposed_solutions: {
        Row: {
          id: string;
          organization_id: string;
          anomaly_ids: string[] | null;
          type: string | null;
          name: string;
          description: string | null;
          urgency: "immediate" | "short_term" | "medium_term" | null;
          impact: "high" | "medium" | "low" | null;
          investment: number | null;
          monthly_savings: number | null;
          annual_savings: number | null;
          roi_months: number | null;
          payback_date: string | null;
          co2_reduction_tons: number | null;
          status: "proposed" | "approved" | "rejected" | "installed";
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          anomaly_ids?: string[] | null;
          type?: string | null;
          name: string;
          description?: string | null;
          urgency?: "immediate" | "short_term" | "medium_term" | null;
          impact?: "high" | "medium" | "low" | null;
          investment?: number | null;
          monthly_savings?: number | null;
          annual_savings?: number | null;
          roi_months?: number | null;
          payback_date?: string | null;
          co2_reduction_tons?: number | null;
          status?: "proposed" | "approved" | "rejected" | "installed";
        };
        Update: Partial<Database["public"]["Tables"]["proposed_solutions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "proposed_solutions_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: string | null;
          status: "proposal" | "approved" | "in_progress" | "installed" | "monitoring";
          investment: number | null;
          estimated_savings: number | null;
          roi_months: number | null;
          start_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          type?: string | null;
          status?: "proposal" | "approved" | "in_progress" | "installed" | "monitoring";
          investment?: number | null;
          estimated_savings?: number | null;
          roi_months?: number | null;
          start_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      alerts: {
        Row: {
          id: string;
          organization_id: string;
          type: "danger" | "warning" | "info";
          message: string;
          timestamp: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          organization_id: string;
          type: "danger" | "warning" | "info";
          message: string;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "alerts_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      monitoring_devices: {
        Row: {
          id: string;
          organization_id: string;
          name: string | null;
          model: string | null;
          location: string | null;
          status: string;
          last_reading: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name?: string | null;
          model?: string | null;
          location?: string | null;
          status?: string;
          last_reading?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["monitoring_devices"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "monitoring_devices_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      equipment: {
        Row: {
          id: string;
          organization_id: string;
          category: "motor" | "lighting" | "hvac" | "compressed_air" | "other";
          name: string;
          location: string | null;
          brand: string | null;
          model: string | null;
          age_years: number | null;
          condition: "good" | "fair" | "poor" | null;
          hours_per_day: number | null;
          days_per_year: number | null;
          notes: string | null;
          specs: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          category: "motor" | "lighting" | "hvac" | "compressed_air" | "other";
          name: string;
          location?: string | null;
          brand?: string | null;
          model?: string | null;
          age_years?: number | null;
          condition?: "good" | "fair" | "poor" | null;
          hours_per_day?: number | null;
          days_per_year?: number | null;
          notes?: string | null;
          specs?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["equipment"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "equipment_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
