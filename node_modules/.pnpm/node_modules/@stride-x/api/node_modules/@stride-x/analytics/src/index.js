"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTrendInsight = buildTrendInsight;
function buildTrendInsight(athleteId, activities) {
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
//# sourceMappingURL=index.js.map