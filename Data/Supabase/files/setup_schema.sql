-- ============================================================
-- Ohio OneSource Providers — Supabase schema setup
-- Run this in the Supabase SQL Editor BEFORE importing the CSV.
-- ============================================================

create table if not exists providers (
  id                      bigint generated always as identity primary key,
  business_name           text,
  business_type_category  text,
  business_type           text,
  address_line1           text,
  address_line2           text,
  city                    text,
  state                   text,
  zip                     text,
  county                  text,
  phone                   text,
  website                 text,
  email                   text,
  latitude                double precision,
  longitude               double precision,
  active                  boolean,
  credential_status       text,
  licensed_beds           integer,
  certified_beds          integer,
  data_source             text,
  created_at              timestamptz default now()
);

-- Helpful indexes for the common lookups
create index if not exists idx_providers_county   on providers (county);
create index if not exists idx_providers_category on providers (business_type_category);
create index if not exists idx_providers_active    on providers (active);

-- ============================================================
-- OPTIONAL: geo proximity (PostGIS) for radius search,
-- replicating the ODH "facilities within X miles" feature.
-- ============================================================
-- create extension if not exists postgis;
-- alter table providers add column geom geography(Point, 4326);
-- update providers
--   set geom = st_setsrid(st_makepoint(longitude, latitude), 4326)::geography
--   where latitude is not null and longitude is not null;
-- create index if not exists idx_providers_geom on providers using gist (geom);
--
-- Example: all providers within 10 miles of a point
-- select business_name, city
-- from providers
-- where st_dwithin(geom, st_makepoint(-80.65, 41.24)::geography, 16093);  -- 10 mi in meters
