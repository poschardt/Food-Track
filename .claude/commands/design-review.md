# Design Review

Read the file at this path: $ARGUMENTS

Review the Tailwind CSS classes in that file for the following issues:

1. **Color contrast** — body text should use `text-gray-700`+, secondary text `text-gray-500`+. Flag anything using `text-gray-400` or lighter.
2. **Focus states** — every interactive element (links, buttons, inputs) needs `focus:outline-none focus:ring-2 focus:ring-*` so keyboard users can see where they are.
3. **Alert/status states** — never use text color alone for alerts (e.g. `text-red-600`). Always pair with a background (`bg-red-50`) so the state is visible at a glance.
4. **Hover feedback** — interactive elements (cards, buttons) should change visually on hover so users know they're clickable.

For each issue found, show:
- The element or className string that has the problem
- The recommended fix (exact Tailwind classes to use)
- One sentence explaining why it matters

If no issues are found, say so and give the file a pass.
