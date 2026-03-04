# Baszucki Take-Home: Health Resource Finder

React + Vite app for browsing, searching, filtering, and sorting health resources from local JSON data.

A responsive React application that allows users to browse, search, filter, and sort health-related educational resources from a local dataset. Designed to simulate a scalable content exploration experience similar to Metabolic Mind's growing library.

## Tech Stack

- React 18
- Vite 5
- Local JSON dataset (`src/data/resources.json`)

## Data Source

This project uses a local static JSON file located at:
`src/data/resources.json`

No backend or API server is required to run the project.

## Browser Support

Tested on:
- Chrome (latest)
- Edge (latest)

## Assumptions and Key Decisions

- Data remains local in `src/data/resources.json` to keep scope focused on frontend behavior and avoid backend setup overhead.
- Filtering and sorting run in memory, so results update immediately with user interactions.
- A small intentional async delay is used in the Suggest Resource submit flow to display a realistic loading state (`Saving...`).
- A global loading spinner is intentionally omitted because browse/filter interactions are local and effectively instant.
- Local React hooks (`useState`, `useMemo`, `useCallback`) provide sufficient state and performance management for this scope.
- Filter state is synchronized with URL query parameters so views can be shared/bookmarked.
- Suggested submissions are stored in browser local storage and are not persisted to a backend/database.

## What I'd Improve with More Time

- Add pagination (or infinite scroll) to support larger resource collections.
- Introduce a backend service and persistent database, then migrate the current static dataset.
- Recommended stack: ASP.NET Core Web API (.NET 8) + PostgreSQL (or SQL Server) with Entity Framework Core.
- Add RESTful API endpoints for querying by search, filters, and sort.
- Move data loading to asynchronous API calls from the frontend.
- Add caching (server-side and/or client-side) so repeated filter/sort interactions avoid unnecessary database requests.
- Add a review workflow for submitted suggestions (save to backend + notify team via email/Slack/Teams for editorial approval).

## Prerequisites (What to download)

Before running locally, install:

1. **Node.js (LTS)**
   - Recommended: Node 18+ (Node 20 LTS also works well)
   - Download: https://nodejs.org/
  - `npm` is installed automatically with Node.js
2. **Git** (optional, only if cloning via command line)
   - Download: https://git-scm.com/downloads

Verify installation:

```powershell
node -v
npm -v
```

## Get the project

### Option A: Clone with Git

```powershell
git clone <>
cd Baszucki_TakeHome
```

### Option B: Download ZIP

1. Download the repository as ZIP
2. Extract it
3. Open terminal in the extracted project folder (`Baszucki_TakeHome`)

## Run locally

From the project root:

```powershell
npm install
npm run dev
```

The app starts on:

- `http://localhost:5173`

## Build and preview production

Create production build:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Available scripts

- `npm run dev` – start development server
- `npm run build` – create production build
- `npm run preview` – preview production build locally

## Common issues / troubleshooting

### 1) `npm` or `node` command not found

- Reinstall Node.js from https://nodejs.org/
- Close and reopen terminal after install

### 2) Port `5173` already in use

This project uses a fixed Vite port (`5173`). If that port is occupied, stop the other process or free the port.

### 3) Dependencies fail to install

Try cleaning install artifacts and reinstall:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### 4) Favicon/UI changes not showing

Browser cache can be aggressive. Hard refresh:

- Windows: `Ctrl + F5`

## Project structure

```
src/
  components/
    FiltersPanel.jsx
    ResourceCard.jsx
    ResourceGrid.jsx
    SearchBar.jsx
    SortDropdown.jsx
    SuggestResourceForm.jsx
  hooks/
    useResources.js
    useUrlFilters.js
  utils/
    filterUtils.js
    suggestResourceFormUtils.js
  data/
    resources.json
  App.jsx
  main.jsx
  index.css
public/
  favicon.svg
```