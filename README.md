# Bundle Builder

A multi-step React application that lets users configure a security system bundle by selecting cameras, subscription plans, sensors, and accessories — all powered by a local data source and persisted to the browser.

Built as a frontend take-home assignment inspired by a Figma design.

## Demo

[Live Demo] https://home-bundle-builder-theta.vercel.app/



## Features

- **Multi-step accordion builder** — four configurable sections: Cameras, Plans, Sensors, and Extra Protection. Only one section expands at a time.
- **Step navigation** — "Next" buttons guide users through each step sequentially.
- **Variant selection** — products with color or plan options display selectable chips with thumbnails; each variant tracks its own quantity independently.
- **Quantity steppers** — synchronized across product cards and the review panel.
- **Live review panel** — reflects every selection in real time with items grouped by category.
- **Dynamic pricing** — subtotal, bundle discount, savings percentage, shipping, and total are calculated reactively.
- **Bundle persistence** — save a configuration to LocalStorage and restore it automatically after a page refresh.
- **Satisfaction guarantee badge** — 100% satisfaction seal displayed in the order summary.
- **Responsive layout** — optimized for Desktop, Tablet, and Mobile viewports.
- **Data-driven UI** — all products and pricing are rendered from a local JSON file; adding new products requires zero component changes.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| State management | Context API + `useReducer` |
| Styling | Custom CSS with design-system custom properties |
| Icons | `lucide-react` |
| Data source | Local JSON (`src/data/bundle.json`) |
| Persistence | `localStorage` |
| Routing | `react-router-dom` (scaffolded) |

## Project Structure

```
src/
├── app/                    # App shell, providers wrapper
│   ├── App.jsx
│   └── providers.jsx
├── components/             # Shared/reusable UI components
│   └── QuantityControl.jsx
├── data/                   # Local data source
│   └── bundle.json
├── features/
│   ├── bundle-builder/     # Accordion builder, product cards, state
│   │   ├── components/
│   │   │   ├── BundleBuilder.jsx
│   │   │   ├── BundleSection.jsx
│   │   │   └── ProductCard.jsx
│   │   └── context/
│   │       ├── Ctx.js
│   │       ├── BundleBuilderContext.jsx
│   │       ├── actions.js
│   │       ├── bundleReducer.js
│   │       ├── initialState.js
│   │       └── useBundleBuilder.js
│   └── review/             # Order summary / checkout panel
│       └── components/
│           ├── ReviewItem.jsx
│           └── ReviewPanel.jsx
├── utils/                  # Pure utility functions
│   ├── price.js
│   ├── selections.js
│   └── storage.js
├── index.css               # Design system custom properties
├── App.css                 # All component styles
└── main.jsx                # Entry point
```

## Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

Produces a production build in `dist/`.

## State Management

The bundle's state — selected items, variant choices, quantities, and current step — is managed through React Context paired with `useReducer`.

**Why Context + `useReducer`:**

- The bundle state is complex enough that prop drilling would be impractical across four accordion sections, product cards, and the review panel.
- A reducer centralizes all state transitions (select variant, increment, decrement, save, restore) in one pure function, making the logic testable and predictable.
- Context provides a single provider at the app root so any component can read or dispatch actions without prop threading.
- No external dependency (Redux, Zustand) is necessary for this scope.

**What lives in the reducer:**

- `SELECT_VARIANT` — marks a variant as selected for a given product.
- `INCREMENT_QUANTITY` / `DECREMENT_QUANTITY` — adjusts the quantity for a specific variant or product.
- `SAVE_BUNDLE` — a meta-action intercepted by the provider to persist before dispatching.
- `RESTORE_BUNDLE` / `LOAD_BUNDLE` — hydrates state from LocalStorage and loads product data.
- `CHECKOUT` / `RESET_CHECKOUT` — toggles the checkout confirmation modal.

All price calculations are derived via `useMemo` from `selectedItems` and `bundleData` — they are never stored in state.

## Data Source

Products, variants, and pricing are defined in `src/data/bundle.json`. The application reads this file at startup via a static import and renders every section dynamically. No hardcoded product lists exist in any component.

**Benefits:**

- Adding a new camera or accessory requires only editing the JSON file.
- The same data feeds both the bundle builder and the review panel — no duplication.
- Swapping the local file for an API response later requires changing only the provider's initialization.

## Persistence

The "Save my system for later" button serializes `{ selectedItems, currentStep }` to `localStorage` under a single key. On page load, the provider checks for a saved bundle and dispatches `RESTORE_BUNDLE` to rehydrate the state.

The save action records a content hash to avoid redundant writes and to display a brief "Bundle saved!" toast. The save button is disabled when the state has not changed since the last save.

## Responsive Design

The layout uses three breakpoints following Tailwind conventions:

| Breakpoint | Layout behavior |
|---|---|
| **Desktop (≥1024px)** | Side-by-side grid: 1.6fr builder, 0.8fr sticky review panel. Two product cards per row. |
| **Tablet (768–1023px)** | Stacked vertically (builder above review). Product cards displayed in a horizontal scrollable row with fixed 210px width. Reduced padding throughout. |
| **Mobile (<768px)** | Single-column layout. One product card per row. Compact spacing and smaller typography. Quantity controls and thumbnails scale down. |

The review panel adapts its badge size, thumbnail dimensions, font sizes, and column widths across all breakpoints.

## Decisions

- **No CSS framework** — Custom CSS with design-system custom properties (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--transition-*`) provides full control without framework overhead. All tokens are centralized in `src/index.css`.
- **No external state library** — `useReducer` + Context is sufficient for this application's complexity. Adding Redux or Zustand would introduce unnecessary dependencies.
- **Derived pricing** — Prices are never stored in state. `calculateSubtotal`, `calculateDiscount`, `calculateSavings`, and `calculateTotal` are pure functions that derive values from `selectedItems` and `bundleData` via `useMemo`. This guarantees the summary is always consistent with selections.
- **Separate review items component** — The review panel uses `ReviewItem` instead of `ProductCard` because an order summary has a fundamentally different layout (compact rows, no card shadows, dividers instead of borders) than a product selection card.
- **Data-driven sections** — `SECTION_DEFS` maps each category to its locale and description. The builder iterates over this array; adding a new step requires only appending to the array and the JSON.

## Tradeoffs

- **Local JSON instead of an API** — The assignment treats a backend as optional. Static JSON keeps the setup frictionless and the project self-contained. Migrating to an API would require replacing only the provider's data-loading logic.
- **External image URLs** — Product images are served from Wyze's CDN. They will not render offline and may break if the remote URLs change. A production version would bundle images or upload them to a controlled CDN.
- **Prototype checkout** — The "Checkout" button opens a confirmation modal and does not connect to a payment gateway, create an order, or send data anywhere. It demonstrates the UI flow only.
- **No unit test suite** — A reducer test (`bundleReducer.test.js`) exists as a starting point, but the project lacks comprehensive unit and integration tests (see Future Improvements).

## Limitations

- No backend or API integration.
- No authentication or user accounts.
- No server-side persistence — data survives only in the browser's LocalStorage.
- No real checkout or payment processing.
- Images are loaded from external URLs and require an internet connection.
- The accessibility review is incomplete — some ARIA attributes and keyboard interactions could be improved.

## Future Improvements

- **Backend / API** — Replace the local JSON with a REST or GraphQL endpoint so products can be managed server-side.
- **Authentication** — Add user login so bundles can be saved to an account and accessed across devices.
- **Unit tests** — Expand coverage for the reducer, utility functions, and component rendering with Vitest + React Testing Library.
- **Integration tests** — Test the full add-to-bundle → review → checkout flow with Playwright or Cypress.
- **Animations** — Enhance the accordion expand/collapse with layout animations (`framer-motion` or CSS `grid-template-rows` transition).
- **Performance** — Memoize list renders with `React.memo` for large product catalogs and virtualize the review item list if it grows.
- **Error boundaries** — Wrap each section in an error boundary so a data issue in one category never crashes the entire page.
- **Accessibility** — Audit with axe-core, improve focus management in the accordion, and add full keyboard navigation for the stepper and variant chips.
- **Empty states** — Show richer empty-state illustrations when no products are selected in a category.

## Author

Mariam Ibrahim
