import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { checkRateLimit } from "../src/lib/rateLimit";
import { internalError, jsonError, firstZodMessage } from "../src/lib/http";
import { trackOrderSchema, verifyCouponSchema, adminLoginSchema } from "../src/lib/validation";
import { timingSafeCompare } from "../src/lib/adminSession";

describe("Phase 2 [SEC-01]: Input Validation & Fuzzing (Zod Schemas)", () => {
  it("should enforce strict Pakistani phone number formats in order tracking", () => {
    // Valid phone formats
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "03001234567" }).success).toBe(true);
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "+923001234567" }).success).toBe(true);
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "03400262732" }).success).toBe(true);

    // Invalid formats (fuzzed / attacks)
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "12345" }).success).toBe(false);
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "phone-string" }).success).toBe(false);
    expect(trackOrderSchema.safeParse({ orderNumber: "TT-2026-0001", phone: "03001234567<script>alert(1)</script>" }).success).toBe(false);
    expect(trackOrderSchema.safeParse({ orderNumber: "", phone: "03001234567" }).success).toBe(false);
  });

  it("should validate and cap coupon code verification input lengths", () => {
    const valid = verifyCouponSchema.safeParse({ code: "TAUHEED10", subtotal: 5000 });
    expect(valid.success).toBe(true);

    // Excessive length fuzzing
    const fuzzed = verifyCouponSchema.safeParse({ code: "A".repeat(100), subtotal: 5000 });
    expect(fuzzed.success).toBe(false);

    // Negative subtotal tampering
    const negative = verifyCouponSchema.safeParse({ code: "TAUHEED10", subtotal: -100 });
    expect(negative.success).toBe(false);
  });

  it("should validate admin login credentials payload bounds", () => {
    const valid = adminLoginSchema.safeParse({
      username: "superadmin",
      password: "SuperSecretPassword123!",
      pin: "123456",
    });
    expect(valid.success).toBe(true);

    // Missing master PIN should fail
    const missingPin = adminLoginSchema.safeParse({
      username: "superadmin",
      password: "SuperSecretPassword123!",
    });
    expect(missingPin.success).toBe(false);
  });
});

describe("Phase 2 [SEC-02]: Timing-Safe Authentication & Brute-Force Defense", () => {
  it("should execute constant-time string comparison reliably", () => {
    const masterKey = "Tauheed_Master_Super_Secret_Key_9921!";
    expect(timingSafeCompare(masterKey, masterKey)).toBe(true);
    expect(timingSafeCompare(masterKey, "WrongKey")).toBe(false);
    expect(timingSafeCompare(masterKey, masterKey.slice(0, -1))).toBe(false);
    expect(timingSafeCompare("", masterKey)).toBe(false);
  });

  it("should isolate rate limiting across different IP addresses", () => {
    const ipA = "192.168.1.10";
    const ipB = "192.168.1.20";

    // Exhaust limit for IP A
    for (let i = 0; i < 3; i++) {
      checkRateLimit(`test_${ipA}`, 3, 60000);
    }
    const ipABlocked = checkRateLimit(`test_${ipA}`, 3, 60000);
    expect(ipABlocked.success).toBe(false);

    // IP B must remain unaffected
    const ipBActive = checkRateLimit(`test_${ipB}`, 3, 60000);
    expect(ipBActive.success).toBe(true);
    expect(ipBActive.remaining).toBe(2);
  });
});

describe("Phase 2 [SEC-03]: Zero-Leak Error Sanitization (CWE-209 Defense)", () => {
  it("should return a generic 500 error message without revealing stack traces or labels", async () => {
    const response = internalError("Sensitive DB Query SELECT * FROM users FAILED", new Error("Neon Postgres DB down"));
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Something went wrong. Please try again later.");
    expect(json.stack).toBeUndefined();
    expect(json.details).toBeUndefined();
  });

  it("should extract human-friendly error messages from Zod issues without crashes", () => {
    const parsed = trackOrderSchema.safeParse({ orderNumber: "", phone: "bad" });
    if (!parsed.success) {
      const msg = firstZodMessage(parsed.error);
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});
