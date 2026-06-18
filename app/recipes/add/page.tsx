"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRecipePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", raw_text: "", servings: "1" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        raw_text: form.raw_text,
        servings: parseInt(form.servings) || 1,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/recipes");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add recipe</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">Recipe name</label>
          <input
            required
            placeholder="e.g. Chicken Tikka Masala"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
          <p className="text-xs text-gray-500 mb-2">Paste the full recipe — ingredients and instructions. Claude will extract the ingredients in Phase 2.</p>
          <textarea
            required
            placeholder="Paste your recipe here..."
            rows={10}
            value={form.raw_text}
            onChange={e => setForm(f => ({ ...f, raw_text: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 resize-y"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save recipe"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/recipes")}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
