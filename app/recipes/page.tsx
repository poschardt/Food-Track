"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then(r => r.json())
      .then(data => { setRecipes(data); setLoading(false); });
  }, []);

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

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500 text-sm">No recipes yet. Add one to get started.</p>
      ) : (
        <div className="space-y-3">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-colors">
              <div className="font-semibold">{recipe.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""} ·{" "}
                {new Date(recipe.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
