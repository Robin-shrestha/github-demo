# Component Libraries & Design Systems

A reference for what component libraries are, how to pick one, and the main categories of components they provide. This is library-agnostic — the concepts apply whether you end up using MUI, Ant Design, Chakra UI, Mantine, a headless library, or something else entirely.

## Component library vs. design system

**What it is:** A component library is a package of pre-built, reusable UI components (buttons, inputs, cards, etc.) with a working implementation you import and use. A design system is broader — it's the set of rules a product follows (colors, spacing, typography, tone) that a component library usually *implements* in code.

**Why the distinction matters:** "We use MUI" describes the library (the code). "We follow Material Design" describes the design system (the rules) that library happens to implement by default. A team can use one library's components while overriding its theme to match a completely different visual language — the library and the design system aren't locked together.

## Why use one instead of hand-rolled components

**What it replaces:** Hand-building every button, form field, and modal from scratch with plain HTML elements and custom CSS.

**Why it's used:** Consistency (every button behaves and looks the same without manual upkeep across a codebase), accessibility that's already handled for you (keyboard navigation, ARIA attributes, focus management — these are easy to get wrong by hand), and speed (a dropdown, a modal, or a toast notification is a working component away instead of something you design, build, and test yourself).

**Trade-off:** You inherit the library's opinions (markup structure, default styling approach, bundle size) and its release cycle. Hand-rolled components stay exactly as small and as customized as you make them, at the cost of building and maintaining everything yourself.

## How to choose one

There's no single right answer — the right library depends on the project. Things worth weighing:

**Styling approach.** Some libraries ship components with a specific look you theme. Others are headless — unstyled, accessible behavior only, and you supply all the CSS yourself. Utility-first CSS setups are often paired with a headless library rather than used alone for complex interactive components (a dropdown needs more than CSS — it needs keyboard handling, focus trapping, and positioning logic).

**Theming and customization.** How much can you change the visual design before you're fighting the library's defaults? Some libraries are built to be deeply themed; others assume you'll mostly keep their default look.

**Bundle size.** Pulling in a full component library adds real weight to a project. Whether components can be imported individually (so unused ones are tree-shaken out) matters for production apps.

**Accessibility.** Does the library handle keyboard navigation, screen readers, and focus management out of the box, or is that left to you?

**TypeScript support.** Are the component prop types accurate and well-maintained, or bolted on afterward?

**Ecosystem and maintenance.** Is it actively maintained? Is there a large enough community that examples and answers exist for the problem you're stuck on?

A few well-known options, each making different trade-offs: **MUI** (Material Design, broad component set, deeply themeable), **Ant Design** (enterprise/admin-dashboard focused, opinionated look), **Mantine** (modern, hooks-heavy, broad component set), **Chakra UI** (accessibility-focused, simpler styling API), and headless options like **Radix UI** or **shadcn/ui** (unstyled primitives, or components you copy directly into your project, paired with your own CSS or Tailwind for full styling control).

## Categories of components

Regardless of which library you pick, most group their components into similar categories:

**Input components** — collect data from the user: text fields, selects/dropdowns, checkboxes, radio buttons, switches, sliders, date pickers.

**Interactive / action components** — things the user clicks to trigger something: buttons, icon buttons, button groups, floating action buttons, toggle buttons.

**Navigation components** — help the user move around: navbars/app bars, tabs, breadcrumbs, side drawers, menus, steppers, pagination.

**Feedback components** — communicate status back to the user: alerts/banners, toasts/snackbars, dialogs/modals, progress indicators (spinners, progress bars), skeleton loaders, tooltips, popovers.

**Layout / structural components** — arrange other components on the page: grids, stacks, boxes, containers, cards, dividers.

**Data display components** — present information: tables, lists, chips/tags, avatars, badges, typography.

## Quick recap

| Category | Purpose | Examples |
|---|---|---|
| Input | Collect data from the user | Text field, select, checkbox, radio, switch, date picker |
| Interactive | Trigger an action | Button, icon button, toggle button |
| Navigation | Move between views | Navbar, tabs, breadcrumbs, drawer, menu, pagination |
| Feedback | Communicate status | Alert, toast/snackbar, dialog/modal, progress indicator, tooltip |
| Layout | Arrange other components | Grid, stack, card, container, divider |
| Data display | Present information | Table, list, chip/tag, avatar, badge, typography |
