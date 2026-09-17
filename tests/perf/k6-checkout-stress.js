import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },  // Ramp-up to 20 users
    { duration: "1m", target: 50 },   // Spike to 50 concurrent users
    { duration: "30s", target: 100 }, // Peak stress at 100 users
    { duration: "30s", target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<1200"], // 95% of requests must complete below 1.2s
    http_req_failed: ["rate<0.05"],    // Error rate must remain below 5%
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Scenario 1: Browse Shop Catalog
  const catalogRes = http.get(`${BASE_URL}/shop`);
  check(catalogRes, {
    "catalog status is 200": (r) => r.status === 200,
    "catalog response time < 1000ms": (r) => r.timings.duration < 1000,
  });
  sleep(1);

  // Scenario 2: Validate Coupon API Endpoint
  const couponPayload = JSON.stringify({
    code: "TAUHEED10",
    subtotal: 7500,
  });
  const couponRes = http.post(`${BASE_URL}/api/coupons/verify`, couponPayload, {
    headers: { "Content-Type": "application/json" },
  });
  check(couponRes, {
    "coupon response is 200 or 429 (rate-limited)": (r) => r.status === 200 || r.status === 429,
  });
  sleep(1);

  // Scenario 3: Order Tracking Lookup
  const trackPayload = JSON.stringify({
    orderNumber: "TT-2026-0001",
    phone: "03001234567",
  });
  const trackRes = http.post(`${BASE_URL}/api/orders/track`, trackPayload, {
    headers: { "Content-Type": "application/json" },
  });
  check(trackRes, {
    "tracking endpoint responds < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(2);
}
