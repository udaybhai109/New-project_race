import type { Activity, ActivityType } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

type ApiEnvelope<T> = { data: T };

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      ...init
    });

    if (!response.ok) return null;
    const body = await response.json();
    return "data" in body ? (body as ApiEnvelope<T>).data : (body as T);
  } catch {
    return null;
  }
}

export function login(email: string, password: string) {
  return request<{ accessToken: string; userId: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function signup(email: string, displayName: string, countryCode: string) {
  return request<{ userId: string; nextStep: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, displayName, countryCode })
  });
}

export function sendOtp(email: string) {
  return request<{ demoCode: string; expiresInSeconds: number }>("/auth/otp/send", {
    method: "POST",
    body: JSON.stringify({ email })
  });
}

export function verifyOtp(email: string, code: string) {
  return request<{ verified: boolean; accessToken: string | null; userId: string | null }>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ email, code })
  });
}

export function createActivity(input: {
  title: string;
  type: ActivityType;
  distanceMeters: number;
  movingTimeSeconds: number;
  averageHeartRate: number;
  visibility: Activity["visibility"];
}) {
  return request<{ success: boolean; activityId: string }>("/activities", {
    method: "POST",
    body: JSON.stringify({
      userId: "user_demo",
      ...input,
      elapsedTimeSeconds: input.movingTimeSeconds,
      elevationGainMeters: 24,
      mediaCount: 1,
      streams: [
        { lat: 19.076, lng: 72.8777, heartRate: input.averageHeartRate },
        { lat: 19.079, lng: 72.874, heartRate: input.averageHeartRate + 4 },
        { lat: 19.081, lng: 72.871, heartRate: input.averageHeartRate - 2 }
      ]
    })
  });
}

export function listActivities() {
  return request<{ data?: Activity[] } | Activity[]>("/activities");
}

export function listChallenges() {
  return request<Array<{ id: string; title: string; participantCount: number; progressPercent: number }>>("/challenges");
}

export function joinChallenge(id: string) {
  return request<{ joined: boolean; challengeId: string }>(`/challenges/${id}/join`, {
    method: "POST",
    body: JSON.stringify({ userId: "user_demo" })
  });
}

export function startRace(eventId: string) {
  return request<{ eventId: string; status: "live"; checkpoints: Array<{ id: string; lat: number; lng: number }> }>(`/events/${eventId}/race/start`, {
    method: "POST",
    body: JSON.stringify({})
  });
}

export function pushLivePosition(eventId: string, athleteId: string) {
  return request<{ athleteId: string; progress: unknown }>(`/events/${eventId}/live`, {
    method: "POST",
    body: JSON.stringify({
      athleteId,
      lat: 19.076 + Math.random() / 100,
      lng: 72.8777 - Math.random() / 100,
      recordedAt: new Date().toISOString(),
      paceSecondsPerKm: 280
    })
  });
}

export function sendCheer(eventId: string, message: string) {
  return request<{ id: string; message: string }>(`/events/${eventId}/cheers`, {
    method: "POST",
    body: JSON.stringify({
      fromUserId: "user_demo",
      toAthleteId: "bib-107",
      message
    })
  });
}

export function createCheckout(planId: string, countryCode: string) {
  return request<{ provider: string; checkoutUrl: string; demoMode: boolean; paymentMethods: string[] }>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({
      userId: "user_demo",
      planId,
      countryCode,
      successUrl: window.location.href,
      cancelUrl: window.location.href
    })
  });
}

export function connectIntegration(provider: string, scopes: string[]) {
  return request<{ id: string; provider: string; status: string }>("/integrations", {
    method: "POST",
    body: JSON.stringify({
      userId: "user_demo",
      provider,
      scopes
    })
  });
}
