import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("entitlements/:userId")
  entitlements(@Param("userId") userId: string) {
    return { data: this.billingService.currentEntitlements(userId) };
  }

  @Post("checkout")
  checkout(@Body() body: { userId: string; planId: string; countryCode: string; successUrl?: string; cancelUrl?: string }) {
    return { data: this.billingService.createCheckout(body) };
  }

  @Post("webhooks/stripe")
  stripeWebhook(@Body() body: Record<string, unknown>) {
    return {
      data: {
        accepted: true,
        eventType: body.type ?? "unknown"
      }
    };
  }
}
