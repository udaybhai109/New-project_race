create table if not exists activity_stream_points (
  activity_id uuid not null,
  ts timestamptz not null,
  latitude double precision not null,
  longitude double precision not null,
  altitude_meters double precision,
  distance_meters double precision,
  heart_rate integer,
  cadence integer,
  power_watts integer,
  speed_mps double precision,
  primary key (activity_id, ts)
);

create table if not exists sensor_streams (
  activity_id uuid not null,
  ts timestamptz not null,
  sensor_type text not null,
  numeric_value double precision,
  text_value text,
  primary key (activity_id, sensor_type, ts)
);

create table if not exists live_positions (
  live_race_id uuid not null,
  athlete_user_id uuid not null,
  ts timestamptz not null,
  latitude double precision not null,
  longitude double precision not null,
  speed_mps double precision,
  rank integer,
  primary key (live_race_id, athlete_user_id, ts)
);

create table if not exists timing_events (
  event_id uuid not null,
  bib_number text not null,
  checkpoint_code text not null,
  ts timestamptz not null,
  elapsed_ms bigint not null,
  source text not null,
  payload jsonb not null default '{}'::jsonb,
  primary key (event_id, bib_number, checkpoint_code, ts)
);

