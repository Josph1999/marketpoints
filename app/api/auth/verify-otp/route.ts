import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, signToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const schema = z.object({
  phoneNumber: z.string().regex(/^5\d{8}$/, 'Invalid Georgian phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, otp, firstName, lastName } = schema.parse(body);

    const isValid = verifyOTP(phoneNumber, otp);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber, firstName, lastName });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();
    }

    const token = signToken(user._id.toString());

    return NextResponse.json({
      token,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
