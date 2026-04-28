
  # Basa AI

  Modern Next.js frontend for Basa AI using the App Router and TypeScript.

  ## Project name

  Project name: Basa AI

  ## Tech stack

  - Next.js 15 (App Router)
  - React 18 + TypeScript
  - Redux Toolkit + React Redux
  - Tailwind CSS
  - ESLint + Prettier

  ## Scripts

  - `npm run dev`: Start local development server
  - `npm run build`: Create production build
  - `npm run start`: Run production server
  - `npm run typecheck`: Run TypeScript checks
  - `npm run lint`: Run lint checks

  ## Folder structure

  ```text
  src/
    app/
      layout.tsx
      providers.tsx
      loading.tsx
      error.tsx
      not-found.tsx
      (marketing)/
      (auth)/
      (dashboard)/
      products/[id]/
      components/
      pages/
    components/
      layout/
      shared/
      ui/
    redux/
      store.ts
      hooks.ts
      provider.tsx
      slices/
    styles/
  ```

  ## Migration summary

  This frontend was migrated from a React Vite-style structure to Next.js App Router.

  Completed migration tasks:

  - Replaced client bootstrap and router usage with Next.js file-based routing
  - Moved page routing to `src/app/**/page.tsx`
  - Added route groups for marketing, auth, and dashboard flows
  - Added root metadata and global app layout
  - Added global loading, error, and not-found route handling
  - Added Redux Toolkit scaffolding with typed hooks
  - Converted navigation to `next/link` and `next/navigation`
  - Removed legacy Vite config from the project

  ## Redux setup (prepared for later API integration)

  - Store configuration: `src/redux/store.ts`
  - Provider wrapper for App Router: `src/redux/provider.tsx`
  - Typed hooks: `useAppDispatch`, `useAppSelector`, `useAppStore`
  - Example UI slice: `src/redux/slices/ui-slice.ts`

  ## Notes

  - Backend and API integration are intentionally not implemented in this repository.
  - This project currently focuses on frontend rendering, structure, and routing readiness.

  ## Original design source

  https://www.figma.com/design/DWfgNKGOa1FQUb8uU3ZEvp/Complete-responsive-prototype
  