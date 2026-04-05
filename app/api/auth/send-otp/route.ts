import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  phoneNumber: z.string().regex(/^5\d{8}$/, 'Invalid Georgian phone number'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber } = schema.parse(body);

    const otp = generateOTP();
    storeOTP(phoneNumber, otp);

    // In production, send OTP via SMS (Twilio / Georgian SMS provider)
    // For development, log OTP to console
    console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);

    return NextResponse.json({
      success: true,
      expiresIn: 300,
      // Remove this in production:
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
