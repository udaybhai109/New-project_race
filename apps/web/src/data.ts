import type { Challenge, Club, FeedPost, Plan, RacePosition, RoutePlan, TrainingWorkout } from "./types";

export const demoStats = {
  weeklyDistanceKm: 42.8,
  trainingLoad: 76,
  recovery: 88,
  streakDays: 9,
  elevationMeters: 614,
  activeMinutes: 318
};

export const feedSeed: FeedPost[] = [
  {
    id: "feed-1",
    athlete: "Demo Runner",
    avatar: "DR",
    title: "Marine Drive tempo",
    type: "run",
    distanceKm: 12.4,
    duration: "58:12",
    pace: "4:41/km",
    city: "Mumbai",
    kudos: 38,
    comments: ["Strong finish", "Clean splits"],
    photo: "linear-gradient(135deg, #92e1ff 0%, #18323f 52%, #b9ff53 100%)",
    createdAt: "Today"
  },
  {
    id: "feed-2",
    athlete: "Aisha K",
    avatar: "AK",
    title: "Bandra hill repeats",
    type: "run",
    distanceKm: 8.1,
    duration: "42:08",
    pace: "5:12/km",
    city: "Mumbai",
    kudos: 51,
    comments: ["Those climbs count twice"],
    photo: "linear-gradient(135deg, #ff7b54 0%, #24262b 46%, #47c7ff 100%)",
    createdAt: "1h ago"
  }
];

export const challengesSeed: Challenge[] = [
  { id: "challenge_april_100k", title: "Run 100 km this month", participantCount: 12034, progressPercent: 62 },
  { id: "challenge_city_streak", title: "14 day city streak", participantCount: 8421, progressPercent: 43 },
  { id: "challenge_climb_600", title: "Climb 600 m this week", participantCount: 2198, progressPercent: 78 }
];

export const clubsSeed: Club[] = [
  { id: "club_mumbai_runners", name: "Mumbai Runners", memberCount: 412, city: "Mumbai" },
  { id: "club_hyrox_india", name: "Hyrox India", memberCount: 166, city: "Delhi" },
  { id: "club_coastal_cycles", name: "Coastal Cycles", memberCount: 289, city: "Chennai" }
];

export const routesSeed: RoutePlan[] = [
  { id: "route-marine", name: "Marine Drive Sprint Loop", distanceKm: 5.2, elevationMeters: 12, popularity: 94, surface: "road" },
  { id: "route-sanjay", name: "Sanjay Park Trail", distanceKm: 11.8, elevationMeters: 246, popularity: 81, surface: "trail" },
  { id: "route-lake", name: "Powai Lake Recovery", distanceKm: 7.4, elevationMeters: 48, popularity: 76, surface: "mixed" }
];

export const racePositionsSeed: RacePosition[] = [
  { athleteId: "bib-107", name: "Demo Runner", lat: 19.076, lng: 72.8777, checkpointCount: 3, pace: "4:36/km" },
  { athleteId: "bib-221", name: "Aisha K", lat: 19.079, lng: 72.874, checkpointCount: 3, pace: "4:42/km" },
  { athleteId: "bib-318", name: "Rohan V", lat: 19.081, lng: 72.871, checkpointCount: 2, pace: "4:58/km" }
];

export const workoutsSeed: TrainingWorkout[] = [
  { id: "workout-easy", title: "35 minute aerobic base", focus: "low heart-rate control", duration: "35 min", intensity: "easy" },
  { id: "workout-tempo", title: "Tempo ladder", focus: "threshold pace", duration: "48 min", intensity: "steady" },
  { id: "workout-race", title: "10K sharpening", focus: "fast finish", duration: "44 min", intensity: "hard" }
];

export const plansSeed: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "0",
    features: ["tracking", "feed", "clubs", "basic challenges"]
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "399 INR",
    features: ["advanced analytics", "adaptive plans", "offline routes", "race spectator tools"]
  },
  {
    id: "organizer",
    name: "Organizer",
    monthlyPrice: "custom",
    features: ["event pages", "live timing", "category results", "sponsor placements"]
  }
];

export const integrationProviders = [
  { id: "strava", label: "Strava import", scopes: ["activities:read", "profile:read"] },
  { id: "garmin", label: "Garmin Connect", scopes: ["activities:read", "health:read"] },
  { id: "healthkit", label: "Apple Health", scopes: ["workouts", "heart_rate"] },
  { id: "health_connect", label: "Health Connect", scopes: ["workouts", "steps", "heart_rate"] }
];
