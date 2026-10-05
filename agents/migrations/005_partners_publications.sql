CREATE TABLE IF NOT EXISTS partner_offers (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  campaign_id uuid NOT NULL REFERENCES outreach_campaigns(id),
  status text NOT NULL DEFAULT 'draft',
  terms jsonb NOT NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL UNIQUE REFERENCES creators(id),
  external_partner_id text UNIQUE,
  referral_code text UNIQUE,
  referral_url text,
  promo_code text UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES partners(id),
  campaign_id uuid NOT NULL REFERENCES outreach_campaigns(id),
  platform text NOT NULL,
  url text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  disclosure_required boolean NOT NULL DEFAULT true,
  erid_required boolean NOT NULL DEFAULT false,
  erid text,
  last_checked_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS publication_checks (
  id uuid PRIMARY KEY,
  publication_id uuid NOT NULL REFERENCES publications(id),
  reachable boolean NOT NULL,
  referral_present boolean NOT NULL,
  disclosure_present boolean NOT NULL,
  erid_present boolean NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referral_metrics (
  id bigserial PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES partners(id),
  measured_at timestamptz NOT NULL DEFAULT now(),
  visits integer NOT NULL DEFAULT 0,
  registrations integer NOT NULL DEFAULT 0,
  installations integer NOT NULL DEFAULT 0,
  payments integer NOT NULL DEFAULT 0,
  revenue numeric(14, 2) NOT NULL DEFAULT 0,
  commission numeric(14, 2) NOT NULL DEFAULT 0,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (partner_id, measured_at)
);

CREATE TABLE IF NOT EXISTS payout_requests (
  id uuid PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES partners(id),
  period text NOT NULL,
  amount numeric(14, 2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'blocked',
  external_operation_id text UNIQUE,
  approved_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, period)
);
