-- ============================================================
-- NexVolt v2 — Initial Database Schema
-- ============================================================

-- ─── Organizations (clients/companies) ───
CREATE TABLE organizations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  rfc             text UNIQUE,
  industry        text,
  location        text,
  status          text NOT NULL DEFAULT 'prospect' CHECK (status IN ('active', 'prospect', 'inactive')),
  tariff          text,
  monthly_cost    numeric(12, 2) DEFAULT 0,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  contracted_demand_kw  numeric(10, 2),
  supply_voltage  text,
  meter_number    text,
  rpu             text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ─── User profiles (extends auth.users) ───
CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  name            text,
  role            text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  avatar_url      text,
  created_at      timestamptz DEFAULT now()
);

-- ─── CFE Invoices ───
CREATE TABLE cfe_invoices (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id             uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period                      text NOT NULL,
  month_index                 int,
  consumption_base_kwh        numeric(12, 2),
  consumption_intermedia_kwh  numeric(12, 2),
  consumption_punta_kwh       numeric(12, 2),
  total_kwh                   numeric(12, 2),
  demand_max_kw               numeric(10, 2),
  demand_contracted_kw        numeric(10, 2),
  demand_billed_kw            numeric(10, 2),
  power_factor                numeric(5, 3),
  power_factor_penalty_pct    numeric(5, 2),
  cost_energy                 numeric(12, 2),
  cost_demand                 numeric(12, 2),
  cost_distribution           numeric(12, 2),
  cost_transmission           numeric(12, 2),
  cost_power_factor           numeric(12, 2),
  subtotal                    numeric(12, 2),
  iva                         numeric(12, 2),
  total_cost                  numeric(12, 2),
  tariff                      text,
  pdf_url                     text,
  created_at                  timestamptz DEFAULT now(),
  UNIQUE(organization_id, period)
);

-- ─── Anomalies ───
CREATE TABLE anomalies (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id         uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source                  text NOT NULL CHECK (source IN ('cfe', 'monitoring')),
  severity                text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category                text,
  title                   text NOT NULL,
  description             text,
  detected_at             timestamptz DEFAULT now(),
  period                  text,
  financial_impact_monthly numeric(12, 2) DEFAULT 0,
  status                  text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

-- ─── Proposed Solutions ───
CREATE TABLE proposed_solutions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  anomaly_ids         uuid[],
  type                text,
  name                text NOT NULL,
  description         text,
  urgency             text CHECK (urgency IN ('immediate', 'short_term', 'medium_term')),
  impact              text CHECK (impact IN ('high', 'medium', 'low')),
  investment          numeric(14, 2),
  monthly_savings     numeric(12, 2),
  annual_savings      numeric(12, 2),
  roi_months          numeric(6, 1),
  payback_date        date,
  co2_reduction_tons  numeric(8, 2),
  status              text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected', 'installed')),
  created_at          timestamptz DEFAULT now()
);

-- ─── Projects ───
CREATE TABLE projects (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                text NOT NULL,
  type                text,
  status              text NOT NULL DEFAULT 'proposal' CHECK (status IN ('proposal', 'approved', 'in_progress', 'installed', 'monitoring')),
  investment          numeric(14, 2),
  estimated_savings   numeric(12, 2),
  roi_months          numeric(6, 1),
  start_date          date,
  created_at          timestamptz DEFAULT now()
);

-- ─── Alerts ───
CREATE TABLE alerts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type            text NOT NULL CHECK (type IN ('danger', 'warning', 'info')),
  message         text NOT NULL,
  timestamp       timestamptz DEFAULT now(),
  read            boolean DEFAULT false
);

-- ─── Monitoring Devices (IoT stub) ───
CREATE TABLE monitoring_devices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text,
  model           text,
  location        text,
  status          text DEFAULT 'offline',
  last_reading    jsonb,
  created_at      timestamptz DEFAULT now()
);

-- ─── Audit Log ───
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES profiles(id),
  action      text NOT NULL,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_cfe_invoices_org ON cfe_invoices(organization_id);
CREATE INDEX idx_anomalies_org ON anomalies(organization_id);
CREATE INDEX idx_solutions_org ON proposed_solutions(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_alerts_org ON alerts(organization_id);
CREATE INDEX idx_devices_org ON monitoring_devices(organization_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cfe_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposed_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ─── Helper: get current user's role ───
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ─── Helper: get current user's organization_id ───
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ─── Profiles ───
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- ─── Organizations ───
CREATE POLICY "Admins can do everything with organizations"
  ON organizations FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own organization"
  ON organizations FOR SELECT
  USING (id = public.get_user_org_id());

-- ─── CFE Invoices ───
CREATE POLICY "Admins can do everything with invoices"
  ON cfe_invoices FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own invoices"
  ON cfe_invoices FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- ─── Anomalies ───
CREATE POLICY "Admins can do everything with anomalies"
  ON anomalies FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own anomalies"
  ON anomalies FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- ─── Proposed Solutions ───
CREATE POLICY "Admins can do everything with solutions"
  ON proposed_solutions FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own solutions"
  ON proposed_solutions FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- ─── Projects ───
CREATE POLICY "Admins can do everything with projects"
  ON projects FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- ─── Alerts ───
CREATE POLICY "Admins can do everything with alerts"
  ON alerts FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own alerts"
  ON alerts FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Clients can mark own alerts as read"
  ON alerts FOR UPDATE
  USING (organization_id = public.get_user_org_id());

-- ─── Monitoring Devices ───
CREATE POLICY "Admins can do everything with devices"
  ON monitoring_devices FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Clients can view own devices"
  ON monitoring_devices FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- ─── Audit Log ───
CREATE POLICY "Anyone authenticated can insert audit logs"
  ON audit_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all audit logs"
  ON audit_log FOR SELECT
  USING (public.get_user_role() = 'admin');

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Auto-update updated_at on organizations
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Storage bucket for invoice PDFs
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload invoices"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'invoices' AND public.get_user_role() = 'admin');

CREATE POLICY "Authenticated users can view invoices"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'invoices' AND auth.uid() IS NOT NULL);
