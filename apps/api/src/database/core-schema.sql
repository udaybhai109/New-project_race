create extension if not exists postgis;
create extension if not exists pg_trgm;

create table if not exists users (
  id uuid primary key,
  username text unique not null,
  email text unique not null,
  tier text not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists user_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  city text,
  region text,
  country_code text,
  bio text
);

create table if not exists user_identities (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  provider_subject text not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_subject)
);

create table if not exists user_devices (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  platform text not null,
  push_token text,
  device_label text,
  last_seen_at timestamptz
);

create table if not exists privacy_settings (
  user_id uuid primary key references users(id) on delete cascade,
  default_visibility text not null default 'followers',
  hide_start_finish boolean not null default true,
  allow_heatmap boolean not null default false
);

create table if not exists follows (
  follower_user_id uuid not null references users(id) on delete cascade,
  followee_user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_user_id, followee_user_id)
);

create table if not exists clubs (
  id uuid primary key,
  name text not null,
  slug text unique not null,
  city text,
  region text,
  country_code text,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists club_memberships (
  club_id uuid not null references clubs(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create table if not exists activities (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  visibility text not null default 'followers',
  started_at timestamptz not null,
  ended_at timestamptz not null,
  timezone text not null,
  route_polyline text,
  start_point geography(point, 4326),
  end_point geography(point, 4326),
  created_at timestamptz not null default now()
);

create table if not exists activity_stats (
  activity_id uuid primary key references activities(id) on delete cascade,
  distance_meters numeric not null default 0,
  moving_time_seconds integer not null default 0,
  elapsed_time_seconds integer not null default 0,
  elevation_gain_meters numeric not null default 0,
  average_pace_seconds_per_km numeric,
  average_speed_mps numeric,
  average_heart_rate numeric,
  max_heart_rate numeric,
  average_cadence numeric,
  average_power_watts numeric,
  calories numeric
);

create table if not exists activity_media (
  id uuid primary key,
  activity_id uuid not null references activities(id) on delete cascade,
  media_type text not null,
  storage_key text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists routes (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  encoded_polyline text not null,
  distance_meters numeric,
  ascent_meters numeric,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists segments (
  id uuid primary key,
  route_id uuid references routes(id),
  name text not null,
  start_point geography(point, 4326) not null,
  end_point geography(point, 4326) not null,
  city text,
  region text,
  country_code text,
  active boolean not null default true
);

create table if not exists segment_efforts (
  id uuid primary key,
  segment_id uuid not null references segments(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  elapsed_time_seconds integer not null,
  average_speed_mps numeric,
  effort_rank integer,
  created_at timestamptz not null default now()
);

create table if not exists challenges (
  id uuid primary key,
  title text not null,
  description text,
  metric text not null,
  goal_value numeric not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  scope text not null default 'global'
);

create table if not exists challenge_participants (
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  progress_value numeric not null default 0,
  joined_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create table if not exists events (
  id uuid primary key,
  organizer_user_id uuid references users(id),
  name text not null,
  slug text unique not null,
  description text,
  status text not null default 'draft',
  city text,
  region text,
  country_code text,
  venue text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists event_categories (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  code text not null,
  label text not null,
  distance_meters numeric not null
);

create table if not exists event_registrations (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  category_id uuid references event_categories(id),
  user_id uuid not null references users(id) on delete cascade,
  bib_number text,
  status text not null default 'registered',
  registered_at timestamptz not null default now()
);

create table if not exists live_races (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  category_id uuid references event_categories(id),
  status text not null default 'pending',
  started_at timestamptz,
  ended_at timestamptz
);

create table if not exists timing_checkpoints (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  code text not null,
  name text not null,
  sequence_no integer not null,
  distance_meters numeric not null
);

create table if not exists official_results (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  live_race_id uuid references live_races(id),
  athlete_user_id uuid references users(id),
  bib_number text not null,
  category_code text not null,
  elapsed_ms bigint not null,
  rank_overall integer,
  rank_category integer,
  status text not null default 'provisional',
  updated_at timestamptz not null default now()
);

create table if not exists race_cheers (
  id uuid primary key,
  live_race_id uuid not null references live_races(id) on delete cascade,
  athlete_user_id uuid references users(id),
  sender_user_id uuid references users(id),
  message text not null,
  delivery_channel text not null,
  created_at timestamptz not null default now()
);

create table if not exists event_records (
  id uuid primary key,
  event_id uuid not null references events(id) on delete cascade,
  category_code text not null,
  metric text not null,
  metric_value numeric not null,
  athlete_user_id uuid references users(id),
  achieved_at timestamptz
);

create table if not exists leaderboard_scopes (
  id uuid primary key,
  type text not null,
  label text not null,
  segment_id uuid references segments(id),
  event_id uuid references events(id),
  club_id uuid references clubs(id),
  city text,
  region text,
  country_code text,
  window text not null
);

create table if not exists leaderboard_entries (
  scope_id uuid not null references leaderboard_scopes(id) on delete cascade,
  athlete_user_id uuid not null references users(id) on delete cascade,
  rank integer not null,
  score numeric not null,
  stat_label text not null,
  updated_at timestamptz not null default now(),
  primary key (scope_id, athlete_user_id)
);

create table if not exists leaderboard_snapshots (
  id uuid primary key,
  scope_id uuid not null references leaderboard_scopes(id) on delete cascade,
  captured_at timestamptz not null default now(),
  payload jsonb not null
);

create table if not exists leaderboard_windows (
  id uuid primary key,
  scope_id uuid not null references leaderboard_scopes(id) on delete cascade,
  athlete_user_id uuid not null references users(id) on delete cascade,
  payload jsonb not null,
  captured_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null default 'stripe',
  external_customer_id text not null,
  external_subscription_id text not null,
  tier text not null,
  status text not null,
  current_period_end timestamptz
);

create table if not exists activity_sync_jobs (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  status text not null,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text
);

create index if not exists idx_activities_user_started_at on activities (user_id, started_at desc);
create index if not exists idx_segments_start_point on segments using gist (start_point);
create index if not exists idx_segments_end_point on segments using gist (end_point);
create index if not exists idx_event_registrations_event on event_registrations (event_id, status);
create index if not exists idx_official_results_event on official_results (event_id, rank_overall);

