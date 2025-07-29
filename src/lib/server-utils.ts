import fs from 'fs/promises';
import path from 'path';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/lib/data.json');

// Helper function to read data
export async function readData() {
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write data
export async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}
