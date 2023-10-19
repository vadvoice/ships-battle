import connnectMongoDb from '@/libs/mongodb';
import Stats from '@/modules/stats';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  try {
    await connnectMongoDb();
    const createdItem = await Stats.create(body);

    return NextResponse.json(
      { message: `Created ${createdItem._id}` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connnectMongoDb();
    const result = await Stats.find();
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
