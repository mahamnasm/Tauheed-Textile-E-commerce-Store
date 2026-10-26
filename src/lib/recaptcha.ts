/**
 * Google reCAPTCHA v3 utility
 * Get your site key at: https://www.google.com/recaptcha/admin
 */

declare global {
  interface Window {
    grecaptcha: any;
    OneSignalDeferred: any[];
  }
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    if (!window.grecaptcha) {
      resolve(null);
      return;
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => resolve(token))
        .catch(() => resolve(null));
    });
  });
}

export async function verifyRecaptchaToken(
  token: string,
  minScore = 0.5
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return { success: true }; // skip if not configured

  try {
    const res = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: 'POST' }
    );
    const data = await res.json();
    if (!data.success || data.score < minScore) {
      return { success: false, score: data.score, error: 'reCAPTCHA verification failed' };
    }
    return { success: true, score: data.score };
  } catch {
    return { success: true }; // fail open to not break orders
  }
}
