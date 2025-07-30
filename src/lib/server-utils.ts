import fs from 'fs/promises';
import path from 'path';
import { AppData } from '@/types';
import { Redis } from '@upstash/redis';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/lib/data.json');

// Helper function to read data
export async function readData(): Promise<AppData> {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    const redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
    const data = await redis.get('data');
    return data as AppData;
  } else {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  }
}

// Helper function to write data
export async function writeData(data: AppData): Promise<void> {
  if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
    const redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
    await redis.set('data', data);
  } else {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  }
}
