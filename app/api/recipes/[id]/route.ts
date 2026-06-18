import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Recipe } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe | undefined;
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(recipe);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, raw_text, servings } = body;

  const db = getDb();
  const existing = db.prepare('SELECT id FROM recipes WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare(
    'UPDATE recipes SET name = ?, raw_text = ?, servings = ? WHERE id = ?'
  ).run(name, raw_text, servings, id);

  const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as Recipe;
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM recipes WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
  return new NextResponse(null, { status: 204 });
}
