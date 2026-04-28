import { Injectable } from "@nestjs/common";

@Injectable()
export class BillingService {
  currentEntitlements(userId: string) {
    return {
      userId,
      tier: "premium",
      features: ["advanced_analytics", "ai_coaching_preview", "organizer_dashboard_access"]
    };
  }
}

