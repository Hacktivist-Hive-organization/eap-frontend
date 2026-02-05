# EAP Frontend

Frontend application for the EAP platform, built with React, TypeScript, and Vite. This repository contains all frontend
code, UI logic, client-side integrations, and design system configuration.

## Overview

The EAP Frontend is a modern React application responsible for:

- User interface and user experience
- Client-side routing
- API communication with the backend
- Global state management
- Design system integration (shadcn/ui + Tailwind CSS)

The project follows a scalable, modular architecture with clear separation of concerns and strict development
conventions.

## Tech Stack

**Core:** React 19, TypeScript, Vite (rolldown-vite)
**UI & Styling:** Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React (icons)
**State & Data:** Redux Toolkit, React Redux, TanStack React Query, Axios (REST)
**Routing:** React Router
**Testing:** Vitest, Testing Library
**Code Quality:** Biome (linting + formatting)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Generic UI components
│   ├── features/        # Feature-specific components
│   └── ui/              # shadcn/ui components
├── pages/               # Route-level pages/screens
├── services/            # API clients and external services
│   └── api/             # Axios setup and HTTP logic
├── store/               # Redux store configuration
│   └── slices/          # Redux slices (one per feature/domain)
├── context/             # React context providers
│   └── query-context/   # TanStack Query provider
├── hooks/               # Custom React hooks (typed)
├── lib/                 # Utility functions (cn, etc.)
├── utils/               # Additional utilities
├── assets/              # Static assets (images, icons)
├── index.css            # Global styles and Tailwind imports
├── App.tsx
└── main.tsx
```

## Running the Application

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Access the app at http://localhost:5173

### Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Running Tests

```bash
npm run test
```

With coverage:

```bash
npm run test:coverage
```

## Pre-Push Checklist

Before pushing your changes, ensure your code passes linting and formatting checks:

### 1. Check for Linting and Formatting Errors

```bash
npm run lint
```

This runs Biome to check for code quality issues and formatting problems.

### 2. Auto-Fix Issues

To automatically fix linting and formatting issues:

```bash
npm run format
```

For fixes that require unsafe transformations:

```bash
npm run format:unsafe
```

### 3. Run Tests

Ensure all tests pass:

```bash
npm run test
```

### Recommended Workflow Before Push

```bash
npm run format && npm run lint && npm run test
```

## Scripts

| Command                 | Description                             |
|-------------------------|-----------------------------------------|
| `npm install`           | Install dependencies                    |
| `npm run dev`           | Start development server                |
| `npm run build`         | Build for production                    |
| `npm run preview`       | Preview production build                |
| `npm run lint`          | Check linting and formatting with Biome |
| `npm run format`        | Auto-fix linting and formatting issues  |
| `npm run format:unsafe` | Auto-fix with unsafe transformations    |
| `npm run test`          | Run tests with Vitest                   |
| `npm run test:coverage` | Run tests with coverage report          |

## Architecture & Guidelines

- **Component-based architecture:** Build small, reusable components that focus on a single responsibility.
- **Page structure:** Pages coordinate the UI, manage state, and handle data fetching.
- **Separation of concerns:**
    - **State logic:** lives in `store/slices/`
    - **UI logic:** lives in `components/`
    - **API logic:** lives in `services/`
- **Store configuration:** Set up in `store/` to combine reducers and middleware.
- **Design principle:** Prefer **composition over inheritance** for flexibility and maintainability.
- **Documentation:** Record major architectural decisions in the `eap-architecture` repository (ADRs – Architecture
  Decision Records).

## Redux Overview

- **One slice per domain/feature:** Each feature or domain should have its own Redux slice.
- **Store setup:** The store combines reducers and middleware only—no UI logic belongs here.
- **Typed hooks:** Always use typed hooks (`useAppDispatch`, `useAppSelector`) for type safety.
- **Data flow:**
  `Page` → dispatch action → `Slice` → state update → component re-render

## TanStack React Query

- Used for server state management and data fetching
- Query client is configured in `src/context/query-context/`
- Use for API calls that benefit from caching, background refetching, and optimistic updates

## Absolute Imports

- **Alias:** All absolute imports use the `@/` alias, which points to `src/`.
- **Example:**

```ts
import { Button } from '@/components/ui/button';
import { HomePage } from '@/pages/HomePage';
import api from '@/services/api';
```

- Relative imports like `../../..` are not allowed.

## Styling & Theming

- **Tailwind CSS v4:** Utility-first CSS framework configured via `index.css`
- **shadcn/ui:** Pre-built accessible components using Radix UI primitives
- **Utility functions:** Use `cn()` from `@/lib/utils` for conditional class merging

### Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

## State Management

- Global state is managed using **Redux Toolkit**.
- One slice per domain/feature (each feature has its own piece of state).
- **No UI logic** should be included inside slices — slices only handle data and state updates.

### Example

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  name: 'user slice',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}, // Define actions here
});

export default userSlice.reducer;
```

## Routing

- Client-side routing is handled via **React Router**.
- Routes are defined in `App.tsx`.
- Each page corresponds to a folder under `src/pages`.

## Axios Setup

- Axios is configured in `src/services/api/api.ts`.
- **All network requests** must use this Axios instance.

## Environment Configuration

- Environment variables are defined using **.env files** in the project root.
- All variable names **must start with `VITE_`**.
- `.env` files are **not committed** to version control.

**Example:**

```env
VITE_API_URL=http://localhost:8000
```

## Git Workflow

- **Branches:**
    - `main` — production-ready code
    - `dev` — integration branch
    - `feature/EAP-XXX-description` — feature development

- **Rules:**
    - Never commit directly to `main` or `dev`
    - Always work on a **feature branch**
    - All changes must go through **Pull Requests**

- **PR Title Convention:**
    - Format: `EAP-XXX: description`
    - The number XXX is the Jira user story number. This convention enables automatic linking between pull requests and
      Jira tickets for full traceability.

  Example:
  ```
  EAP-123: Add access request endpoint
  ```

## VS Code Integration

Add the following to your VS Code settings for the best development experience:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

## Data Flow

```
[Pages]
│
│ dispatch actions / read state
▼
[Components] ──> renders UI ──> can use hooks
│
│ calls service functions
▼
[Services / API]
│
│ Axios requests to backend
▼
[Backend API] ──> returns data
│
│ updates Redux state
▼
[Store / Redux Slices] ──> triggers re-render
│
└──> Components reflect updated state
```

## Summary

- **Pages:** Coordinate components, manage state, and handle API calls.
- **Components:** Pure UI elements that are reusable across the app.
- **State:** Managed in Redux slices with typed hooks for safety and clarity.
- **Services:** Handle all backend communication via Axios.
- **Store:** Combines reducers and middleware to manage global state.

## Related Repositories

- **[eap-architecture](https://github.com/anastasiiaryzh/eap-architecture):** Platform decisions and API specifications.
- **[eap-backend](https://github.com/AbeerAlkhouri/eap-backend):** Backend services.
- **[eap-qa](https://github.com/funda-it31/eap-qa):** Test automation and QA.

## Running in container

The following instructions are for running the frontend in a container while
fastapi runs directly on the same host without a container.

### 1. Change Vite to run on 0.0.0.0 instead of on localhost

In the "dev" script in package.JSON, add the --host flag to the vite command:

```bash
"vite --host"
```

This way, later when Vite will run inside a container, it'll make vite listen not only
to the container's localhost, but to all interfaces. Thus, Vite will listen to messages coming from the host.

---

### 2. Configure CORS in FastAPI

In FastAPI, make sure localhost:5173 is in the allowed CORS origins. This works for both running Vite in a
container and running Vite directly on the machine.

```python
CORS_ALLOWED_ORIGINS: list[str] = [
    "http://localhost:5173",
]
```

Explanation:  
The browser sends a request to localhost:5173 and since the machine's port 5173 will be mapped to a port in the frontend container, the request will reach the container. But the browser is not aware that this is what happens behind the scenes, and so, it also doesn't know that the response came from a container. As far as it's concerned, it got the frontend from the machine's localhost and this is the page's origin. Result: Any API requests from this JS will have origin http://localhost:5173.

---

### 3. Create the image

```bash
docker build --no-cache -t my_frontend_image .
```

---

### 4. Run a container

```bash
docker run -p 5173:5173 --name frontend_container my_frontend_image
```

Explanation:

- Inside the container, Vite will run on its default port of 5173.
- In step 1 we already set Vite to listen to all network interfaces and not just the container's localhost.
- That took care of the IP level, but we will also need the correct port. The browser will send messages to localhost:5173, and since we mapped the ports, Docker will be forward it to the container's eth0 (the container's virtual Ethernet interface) on port 5173. Since Vite is listening to all interfaces (0.0.0.0) on port 5173, the request will reach it.
