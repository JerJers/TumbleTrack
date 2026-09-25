-- Run this once against your Neon database before deploying.
-- Safe to run more than once (IF NOT EXISTS guards).

CREATE TABLE IF NOT EXISTS clothing (
  id                SERIAL PRIMARY KEY,
  device_id         TEXT        NOT NULL,
  name              TEXT        NOT NULL,
  category          TEXT        NOT NULL DEFAULT '',
  last_washed_date  DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loads (
  id            SERIAL PRIMARY KEY,
  device_id     TEXT        NOT NULL,
  load_date     DATE        NOT NULL,
  load_type     TEXT        NOT NULL,
  weight        NUMERIC     NOT NULL CHECK (weight > 0),
  weight_unit   TEXT        NOT NULL DEFAULT 'kg',
  cost          NUMERIC     NOT NULL CHECK (cost >= 0),
  notes         TEXT        NOT NULL DEFAULT '',
  clothing_ids  INTEGER[]   NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clothing_device_idx ON clothing (device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS loads_device_idx ON loads (device_id, load_date DESC);
