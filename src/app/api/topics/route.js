import connnectMongoDb from '@/libs/mongodb';
import Topic from '@/modules/topic';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, age } = await request.json();
  try {
    await connnectMongoDb();
    const createdItem = await Topic.create({ name, age });

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
    const result = await Topic.find();
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.log('failed');
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
