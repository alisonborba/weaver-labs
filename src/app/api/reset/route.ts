import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import dataJson from '@/lib/data.json';
import fs from 'fs/promises';

export async function GET() {
  let responseMessage = 'Data reset failed';

  try {
    if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
      const redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      });

      await redis.set('data', dataJson);
      responseMessage = 'Data reset successfully - Redis DB';
    } else {
      const originalData = await fs.readFile(
        'src/lib/data-original.json',
        'utf-8'
      );
      await fs.writeFile('src/lib/data.json', originalData);
      responseMessage = 'Data reset successfully - File System JSON';
    }

    return NextResponse.json(responseMessage);
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json({ error: 'Redis fetch failed' }, { status: 500 });
  }
}
