# Contributing to Intelly Clinical Suite

Thank you for contributing to **Intelly Clinical Suite**. Follow these engineering, design, and verification standards to keep the codebase maintainable, accessible, and consistent.

---

## 1. Development Setup

```bash
git clone <your-repository-url>
cd intelly-clinical-suite
npm install
cp .env.example .env
npm run dev
```

The unified Express + Vite development server listens on `http://localhost:3000`.

---

## 2. Branching & Commit Conventions

- Create descriptive feature or fix branches from `main`:
  - `feat/<short-scope>` (e.g., `feat/d3-revenue-chart`)
  - `fix/<short-scope>` (e.g., `fix/date-range-filter`)
  - `docs/<short-scope>` (e.g., `docs/architecture-update`)
- Write concise, imperative commit messages summarizing **what** changed and **why**.

---

## 3. Coding & Design Standards

### TypeScript & React
- Keep strict TypeScript compilation passing (`npm run lint`) with zero `any` escapes in domain models (`src/types.ts`).
- Prefer cohesive functional components and keep business/filtering calculations inside `src/utils/` rather than presentation JSX.
- Avoid duplicating Zustand state into local component state when the value already belongs to `useStore`.

### Styling, Themes & Typography
- Use **Tailwind CSS v4** utilities and warm pastel editorial tokens (`#F6F2EA` alabaster, `#FFFEFC` ivory, `#171614` obsidian anchor, `#6D9E83` muted sage, `#E8C46A` butter, `#C87D55` terracotta).
- Preserve the existing typography stack (`Playfair Display`, `Inter`, `Space Grotesk`, `JetBrains Mono`) and use `tabular-nums` for all numeric KPIs, timers, and ledger amounts.
- Ensure every new component supports both **Light** and **Dark** (`dark:`) surfaces as well as **Galaxy** mode cleanly.
- Do not modify `FloatingSidebar.tsx` hover/collapse behavior unless explicitly scoped by an approved issue.

### Scrolling & Accessibility
- Add `data-lenis-prevent` to any internally scrollable popover, dropdown, or modal so nested scrolling works reliably alongside `Lenis`.
- Respect `prefers-reduced-motion` for SVG transitions, smooth scrolling, and motion choreography.
- Use semantic HTML buttons, links, form labels, and visible keyboard focus rings.

### Documentation
- Update `README.md`, `CHANGELOG.md`, and relevant files in `/docs/` whenever adding workspaces, endpoints, or data contracts.
- Keep technical Markdown documentation concise and free of emojis.

---

## 4. Pre-Pull Request Checklist

Before opening a pull request, run and confirm:

```bash
npm run lint   # Passes tsc --noEmit with 0 errors
npm run build  # Produces dist/ and dist/server.cjs cleanly
```

Verify in a browser:
1. Interactive charts (`D3RevenueChart`, `ClinicalInfographics`) resize cleanly across desktop, tablet, and mobile viewports.
2. Both Light and Dark modes maintain accessible contrast.
3. Date range filtering updates KPIs, charts, and PDF/CSV exports consistently.
4. No secrets or `.env` values are staged in version control.
