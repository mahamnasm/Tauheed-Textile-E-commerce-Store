import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha';

export async function POST(req: NextRequest) {
  try {
    const { token, action } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 });
    }
    const result = await verifyRecaptchaToken(token);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: 'Verification error' }, { status: 500 });
  }
}
