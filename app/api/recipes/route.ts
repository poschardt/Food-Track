import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Recipe } from '@/lib/types';

export async function GET() {
  const db = getDb();
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all() as Recipe[];
  return NextResponse.json(recipes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, raw_text, servings } = body;

  if (!name || !raw_text) {
    return NextResponse.json({ error: 'name and raw_text are required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO recipes (name, raw_text, servings) VALUES (?, ?, ?)'
  ).run(name, raw_text, servings ?? 1);

  const created = db.prepare('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid) as Recipe;
  return NextResponse.json(created, { status: 201 });
}
