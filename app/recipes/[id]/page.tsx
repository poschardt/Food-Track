"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Recipe } from "@/lib/types";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", raw_text: "", servings: "1" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: Recipe) => {
        setRecipe(data);
        setForm({ name: data.name, raw_text: data.raw_text, servings: String(data.servings) });
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, raw_text: form.raw_text, servings: parseInt(form.servings) || 1 }),
    });

    setSaving(false);
    if (!res.ok) { setError("Failed to save"); return; }
    const updated: Recipe = await res.json();
    setRecipe(updated);
    setEditing(false);
  }

  async function handleDelete() {
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    router.push("/recipes");
  }

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>;
  if (!recipe) return (
    <div className="space-y-4">
      <p className="text-gray-500">Recipe not found.</p>
      <Link href="/recipes" className="text-sm text-green-700 hover:underline">← Back to recipes</Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <Link href="/recipes" className="text-sm text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded">
        ← Back to recipes
      </Link>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h1 className="text-xl font-bold">Edit recipe</h1>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Recipe name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Servings</label>
            <input
              type="number"
              min="1"
              value={form.servings}
              onChange={e => setForm(f => ({ ...f, servings: e.target.value }))}
              className="w-24 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recipe text</label>
            <textarea
              required
              rows={12}
              value={form.raw_text}
              onChange={e => setForm(f => ({ ...f, raw_text: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 resize-y"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setError(""); }}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{recipe.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""} · added {new Date(recipe.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Edit
              </button>
              {confirmDelete ? (
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-600">Sure?</span>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-red-200 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-600 mb-3">Recipe</h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{recipe.raw_text}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
