import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Ingredient } from '@/lib/types';

export async function GET() {
  const db = getDb();
  const ingredients = db.prepare('SELECT * FROM ingredients ORDER BY name ASC').all() as Ingredient[];
  return NextResponse.json(ingredients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, quantity, unit, min_quantity } = body;

  if (!name || !unit) {
    return NextResponse.json({ error: 'name and unit are required' }, { status: 400 });
  }

  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO ingredients (name, quantity, unit, min_quantity) VALUES (?, ?, ?, ?)'
  );

  try {
    const result = stmt.run(name, quantity ?? 0, unit, min_quantity ?? 0);
    const created = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(result.lastInsertRowid) as Ingredient;
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      return NextResponse.json({ error: `Ingredient "${name}" already exists` }, { status: 409 });
    }
    throw err;
  }
}
