"use client";

import { useEffect, useState } from "react";
import { Ingredient } from "@/lib/types";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "", min_quantity: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchIngredients() {
    const res = await fetch("/api/ingredients");
    const data = await res.json();
    setIngredients(data);
    setLoading(false);
  }

  useEffect(() => { fetchIngredients(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        quantity: parseFloat(form.quantity) || 0,
        unit: form.unit,
        min_quantity: parseFloat(form.min_quantity) || 0,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    setForm({ name: "", quantity: "", unit: "", min_quantity: "" });
    fetchIngredients();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ingredients</h1>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Add ingredient</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Name (e.g. Chicken breast)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="col-span-2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Quantity (e.g. 500)"
            value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            required
            placeholder="Unit (e.g. g, ml, count)"
            value={form.unit}
            onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Low-stock alert at (e.g. 100)"
            value={form.min_quantity}
            onChange={e => setForm(f => ({ ...f, min_quantity: e.target.value }))}
            className="col-span-2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
        >
          Add
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : ingredients.length === 0 ? (
        <p className="text-gray-500 text-sm">No ingredients yet. Add one above.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Unit</th>
              <th className="pb-2 font-medium">Low-stock at</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ing => (
              <tr
                key={ing.id}
                className={`border-b border-gray-100 ${ing.quantity <= ing.min_quantity ? "bg-red-50 text-red-700" : ""}`}
              >
                <td className="py-2">{ing.name}</td>
                <td className="py-2">{ing.quantity}</td>
                <td className="py-2">{ing.unit}</td>
                <td className="py-2">{ing.min_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
