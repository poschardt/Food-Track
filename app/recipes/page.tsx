"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const url = query.trim() ? `/api/recipes?q=${encodeURIComponent(query.trim())}` : "/api/recipes";
      fetch(url)
        .then(r => r.json())
        .then(data => { setRecipes(data); setLoading(false); });
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          href="/recipes/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
        >
          + Add recipe
        </Link>
      </div>

      <input
        type="search"
        placeholder="Search by name or ingredient…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {query.trim() ? `No recipes found for "${query.trim()}".` : "No recipes yet. Add one to get started."}
        </p>
      ) : (
        <div className="space-y-3">
          {recipes.map(recipe => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-green-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            >
              <div className="font-semibold">{recipe.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""} ·{" "}
                {new Date(recipe.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
