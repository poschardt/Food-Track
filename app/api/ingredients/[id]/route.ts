import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Ingredient } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const ingredient = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(id) as Ingredient | undefined;
  if (!ingredient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(ingredient);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, quantity, unit, min_quantity } = body;

  const db = getDb();
  const existing = db.prepare('SELECT id FROM ingredients WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    db.prepare(
      'UPDATE ingredients SET name = ?, quantity = ?, unit = ?, min_quantity = ? WHERE id = ?'
    ).run(name, quantity, unit, min_quantity, id);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      return NextResponse.json({ error: `Ingredient "${name}" already exists` }, { status: 409 });
    }
    throw err;
  }

  const updated = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(id) as Ingredient;
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM ingredients WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare('DELETE FROM ingredients WHERE id = ?').run(id);
  return new NextResponse(null, { status: 204 });
}
