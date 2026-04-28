import type { ActivitySummary, AnalyticsInsight } from "@stride-x/domain-types";

export function buildTrendInsight(athleteId: string, activities: ActivitySummary[]): AnalyticsInsight {
  const totalDistance = activities
    .filter((activity) => activity.userId === athleteId)
    .reduce((sum, activity) => sum + activity.distanceMeters, 0);

  return {
    id: `insight:${athleteId}:distance`,
    athleteId,
    title: "Training trend",
    summary: `Total tracked distance: ${Math.round(totalDistance)}m`,
    createdAt: new Date().toISOString()
  };
}
