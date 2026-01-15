# EAP Frontend

Frontend application for the EAP platform, built with React, TypeScript, and Vite. This repository contains all frontend code, UI logic, client-side integrations, and design system configuration.

## Overview

The EAP Frontend is a modern React application responsible for:

- User interface and user experience
- Client-side routing
- API communication with the backend
- Global state management
- Design system integration (Ant Design + custom styles)
  The project follows a scalable, modular architecture with clear separation of concerns and strict development conventions.

## Tech Stack

**Core:** React 19, TypeScript, Vite (rolldown-vite 7.2.5)  
**UI & Styling:** Ant Design, styled-components  
**State & Data:** Redux Toolkit, React Redux, Axios (REST)  
**Routing:** React Router  
**Code Quality:** ESLint, Prettier

## Project Structure

```
src/
├── components/ # Reusable UI components
│ ├── common/ # Generic UI components
│ └── features/ # Feature-specific components
├── pages/ # Route-level pages/screens
├── services/ # API clients and external services
│ └── api/ # Axios setup and HTTP logic
├── state/ # Redux slices (one per feature/domain)
├── store/ # Redux store configuration
├── hooks/ # Custom React hooks (typed)
├── utils/ # Utility functions
├── styles/ # Global styles and themes
│ ├── GlobalStyle.ts
│ ├── theme.ts
├── App.tsx
└── main.tsx
```

## Architecture & Guidelines

- **Component-based architecture:** Build small, reusable components that focus on a single responsibility.
- **Page structure:** Pages coordinate the UI, manage state, and handle data fetching.
- **Separation of concerns:**
  - **State logic:** lives in `state/`
  - **UI logic:** lives in `components/`
  - **API logic:** lives in `services/`
- **Store configuration:** Set up in `store/` to combine reducers and middleware.
- **Design principle:** Prefer **composition over inheritance** for flexibility and maintainability.
- **Documentation:** Record major architectural decisions in the `eap-architecture` repository (ADRs – Architecture Decision Records).

## Redux Overview

- **One slice per domain/feature:** Each feature or domain should have its own Redux slice.
- **Store setup:** The store combines reducers and middleware only—no UI logic belongs here.
- **Typed hooks:** Always use typed hooks (`useAppDispatch`, `useAppSelector`) for type safety.
- **Data flow:**  
  `Page` → dispatch action → `Slice` → state update → component re-render

## Absolute Imports

- **Alias:** All absolute imports use the `@/` alias, which points to `src/`.
- **Example:**

```ts
import Button from "@/components/common/Button";
import HomePage from "@/pages/homePage/HomePage";
import api from "@/services/api/axios";
```

- ❌ relative imports like ../../.. are not allowed.

## Styling & Theming

- **Global Styles:** Defined in `src/styles/GlobalStyle.ts`. Includes CSS reset, base typography, and CSS variables. Applied once at the application root.
- **Design Tokens:** Defined in `src/styles/theme.ts`. Shared across `styled-components` and Ant Design. Includes colors, spacing, and border-radius.

## State Management

- Global state is managed using **Redux Toolkit**.
- One slice per domain/feature (each feature has its own piece of state).
- **No UI logic** should be included inside slices — slices only handle data and state updates.

### Example

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  name: "user slice",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {}, // Define actions here
});

export default userSlice.reducer;
```

- This userSlice manages only user-related state.

- Components can use this slice to read or update the user state.

- No buttons, forms, or UI logic are inside the slice — just data.

## Routing

- Client-side routing is handled via **React Router**.
- Routes are defined in `App.tsx`.
- Each page corresponds to a folder under `src/pages`.

## Axios Setup

- Axios is configured once in `src/services/api/axios.ts`.
- **All network requests** must use this Axios instance.

## Environment Configuration

- Environment variables are defined using **.env files** in the project root.
- All variable names **must start with `VITE_`**.
- `.env` files are **not committed** to version control.

**Example:**

```env
VITE_API_URL=http://localhost:8000
```

## Development Workflow

- **Install dependencies:**

```bash
npm install
```

- **Start the development server:**

```bash
npm run dev
```

- **Access the app:**

```text
 Open http://localhost:5173 in your browser.
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

- **Commit Message Format:**

```text
type(scope): description (EAP-XXX)
```

Example:

```text
feat(auth): add login page (EAP-123)
```

## Code Formatting & Linting

- **Prettier:** Automatically formats your code.
- **ESLint:** Enforces code quality and best practices.
- Fully integrated using `eslint-plugin-prettier`.

### Commands

- **Check for linting and formatting errors:**

```bash
npm run lint
```

- **Automatically format code:**

```bash
npm run format
```

- **VS Code Integration**

Add the following to your VS Code settings to format on save:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Scripts

| Command         | Description               |
| --------------- | ------------------------- |
| npm install     | Install dependencies      |
| npm run dev     | Start development server  |
| npm run build   | Build for production      |
| npm run preview | Preview production build  |
| npm run lint    | ESLint check              |
| npm run format  | Format code with Prettier |

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
[State / Redux Slices] ──> triggers re-render
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
