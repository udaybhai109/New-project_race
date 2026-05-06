export type ActivityType = "run" | "cycle" | "walk" | "swim" | "gym";

export type Activity = {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  startedAt: string;
  endedAt: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elevationGainMeters: number;
  averageHeartRate?: number;
  averagePaceSecondsPerKm?: number;
  visibility: "private" | "followers" | "public";
  mediaCount: number;
};

export type FeedPost = {
  id: string;
  athlete: string;
  avatar: string;
  title: string;
  type: ActivityType;
  distanceKm: number;
  duration: string;
  pace: string;
  city: string;
  kudos: number;
  comments: string[];
  photo: string;
  createdAt: string;
};

export type Challenge = {
  id: string;
  title: string;
  participantCount: number;
  progressPercent: number;
};

export type Club = {
  id: string;
  name: string;
  memberCount: number;
  city: string;
};

export type RoutePlan = {
  id: string;
  name: string;
  distanceKm: number;
  elevationMeters: number;
  popularity: number;
  surface: string;
};

export type RacePosition = {
  athleteId: string;
  name: string;
  lat: number;
  lng: number;
  checkpointCount: number;
  pace: string;
};

export type TrainingWorkout = {
  id: string;
  title: string;
  focus: string;
  duration: string;
  intensity: "easy" | "steady" | "hard";
};

export type Plan = {
  id: string;
  name: string;
  monthlyPrice: string;
  features: string[];
};
