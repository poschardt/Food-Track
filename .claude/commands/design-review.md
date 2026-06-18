# Design Review

Read the file at this path: $ARGUMENTS

Review the Tailwind CSS classes in that file for the following issues:

1. **Color contrast** — body text should use `text-gray-700`+, secondary text `text-gray-500`+. Flag anything using `text-gray-400` or lighter.
2. **Placeholder text** — inputs need `placeholder:text-gray-400` explicitly. Browser default placeholder color is often too faint; never rely on it.
3. **Focus states** — every interactive element (links, buttons, inputs) needs `focus:outline-none focus:ring-2 focus:ring-*` so keyboard users can see where they are.
4. **Alert/status states** — never use text color alone for alerts (e.g. `text-red-600`). Always pair with a background (`bg-red-50`) so the state is visible at a glance.
5. **Hover feedback** — interactive elements (cards, buttons) should change visually on hover so users know they're clickable.
6. **Dark mode bleed** — check `app/globals.css`. This app is light-mode only; there should be no `@media (prefers-color-scheme: dark)` block overriding body background.

For each issue found, show:
- The element or className string that has the problem
- The recommended fix (exact Tailwind classes to use)
- One sentence explaining why it matters

If no issues are found, say so and give the file a pass.
