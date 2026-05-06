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

  createCheckout(input: { userId: string; planId: string; countryCode: string; successUrl?: string; cancelUrl?: string }) {
    const provider = this.resolveProvider(input.countryCode);
    const configuredUrl = this.getConfiguredCheckoutUrl(provider);
    const fallbackUrl = input.successUrl ?? "http://localhost:5173";

    return {
      userId: input.userId,
      planId: input.planId,
      countryCode: input.countryCode,
      provider,
      checkoutUrl: configuredUrl ?? fallbackUrl,
      demoMode: !configuredUrl,
      paymentMethods: this.paymentMethods(provider, input.countryCode),
      cancelUrl: input.cancelUrl ?? fallbackUrl
    };
  }

  private resolveProvider(countryCode: string) {
    const normalized = countryCode.toUpperCase();
    if (normalized === "IN") return "razorpay";
    if (["US", "CA", "GB", "AU", "SG", "AE"].includes(normalized)) return "stripe";
    return "paypal";
  }

  private getConfiguredCheckoutUrl(provider: string) {
    if (provider === "razorpay") return process.env.RAZORPAY_CHECKOUT_URL;
    if (provider === "stripe") return process.env.STRIPE_CHECKOUT_URL;
    return process.env.PAYPAL_CHECKOUT_URL;
  }

  private paymentMethods(provider: string, countryCode: string) {
    if (provider === "razorpay" || countryCode.toUpperCase() === "IN") {
      return ["UPI", "cards", "netbanking", "wallets"];
    }

    if (provider === "stripe") {
      return ["cards", "wallets", "bank redirects"];
    }

    return ["PayPal balance", "cards", "local wallets"];
  }
}
