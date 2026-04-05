import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Card from '@/models/Card';
import { CARD_MAX_NAME_LENGTH } from '@/types';
import { z } from 'zod';

const createSchema = z.object({
  cardNumber: z.string().min(1),
  name: z.string().min(1).max(CARD_MAX_NAME_LENGTH),
  designId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const cards = await Card.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json({ cards });
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    await connectDB();
    const card = await Card.create({ ...data, userId });

    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
