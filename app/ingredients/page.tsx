"use client";

import { useEffect, useState } from "react";
import { Ingredient } from "@/lib/types";

type EditForm = { name: string; quantity: string; unit: string; min_quantity: string };

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "", min_quantity: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", quantity: "", unit: "", min_quantity: "" });
  const [editError, setEditError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function fetchIngredients() {
    const res = await fetch("/api/ingredients");
    setIngredients(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchIngredients(); }, []);

  async function handleAdd(e: React.FormEvent) {
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
      setError((await res.json()).error ?? "Something went wrong");
      return;
    }
    setForm({ name: "", quantity: "", unit: "", min_quantity: "" });
    fetchIngredients();
  }

  function startEdit(ing: Ingredient) {
    setEditingId(ing.id);
    setEditForm({ name: ing.name, quantity: String(ing.quantity), unit: ing.unit, min_quantity: String(ing.min_quantity) });
    setEditError("");
    setConfirmDeleteId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleSave(id: number) {
    setEditError("");
    const res = await fetch(`/api/ingredients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        quantity: parseFloat(editForm.quantity) || 0,
        unit: editForm.unit,
        min_quantity: parseFloat(editForm.min_quantity) || 0,
      }),
    });
    if (!res.ok) {
      setEditError((await res.json()).error ?? "Failed to save");
      return;
    }
    setEditingId(null);
    fetchIngredients();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    fetchIngredients();
  }

  const inputCls = "border rounded-lg px-2 py-1 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 w-full";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ingredients</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Add ingredient</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Name (e.g. Chicken breast)"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="col-span-2 border rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Quantity (e.g. 500)"
            value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            required
            placeholder="Unit (e.g. g, ml, count)"
            value={form.unit}
            onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Low-stock alert at (e.g. 100)"
            value={form.min_quantity}
            onChange={e => setForm(f => ({ ...f, min_quantity: e.target.value }))}
            className="col-span-2 border rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {editError && <p className="text-red-600 text-sm px-5 pt-3">{editError}</p>}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Qty</th>
                <th className="px-3 py-3 font-medium">Unit</th>
                <th className="px-3 py-3 font-medium">Alert at</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {ingredients.map(ing => {
                const isLow = ing.quantity <= ing.min_quantity;
                const isEditing = editingId === ing.id;
                const isConfirming = confirmDeleteId === ing.id;

                if (isEditing) {
                  return (
                    <tr key={ing.id} className="border-b border-gray-100 bg-green-50">
                      <td className="px-5 py-2">
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                      </td>
                      <td className="px-3 py-2">
                        <input value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} className={inputCls} />
                      </td>
                      <td className="px-3 py-2">
                        <input value={editForm.unit} onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))} className={inputCls} />
                      </td>
                      <td className="px-3 py-2">
                        <input value={editForm.min_quantity} onChange={e => setEditForm(f => ({ ...f, min_quantity: e.target.value }))} className={inputCls} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleSave(ing.id)} className="text-green-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded text-xs">Save</button>
                          <button onClick={cancelEdit} className="text-gray-500 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-300 rounded text-xs">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={ing.id} className={`border-b border-gray-100 ${isLow ? "bg-red-50 text-red-700" : ""}`}>
                    <td className="px-5 py-2.5">{ing.name}</td>
                    <td className="px-3 py-2.5">{ing.quantity}</td>
                    <td className="px-3 py-2.5">{ing.unit}</td>
                    <td className="px-3 py-2.5">{ing.min_quantity}</td>
                    <td className="px-3 py-2.5">
                      {isConfirming ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-500">Sure?</span>
                          <button onClick={() => handleDelete(ing.id)} className="text-red-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded text-xs">Delete</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-300 rounded text-xs">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => startEdit(ing)} className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded text-xs">Edit</button>
                          <button onClick={() => { setConfirmDeleteId(ing.id); setEditingId(null); }} className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded text-xs">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
