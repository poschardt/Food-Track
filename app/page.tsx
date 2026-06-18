import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Food Track</h1>
      <p className="text-gray-600">Track your ingredients and recipes. Powered by Claude.</p>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/ingredients"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <div className="text-2xl mb-2">🥕</div>
          <div className="font-semibold">Ingredients</div>
          <div className="text-sm text-gray-500 mt-1">Manage your pantry inventory</div>
        </Link>

        <Link
          href="/recipes"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <div className="text-2xl mb-2">📖</div>
          <div className="font-semibold">Recipes</div>
          <div className="text-sm text-gray-500 mt-1">Save and cook your recipes</div>
        </Link>
      </div>
    </div>
  );
}
