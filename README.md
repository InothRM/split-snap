# Split Snap

Split Snap is a React/Vite frontend with an Express API. Receipt uploads are validated and analyzed using mock data; no OCR or AI is used, and uploaded files are held in memory only.

The landing-page pizza photo is stored locally at `frontend/public/images/pizza-hero.jpg` and sourced from [Unsplash](https://images.unsplash.com/photo-1513104890138-7c749659a591).

## Run locally

Install dependencies from the repository root, then start both apps:

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The frontend proxies `/api` requests to the Express server at `http://localhost:3001`.

Create a local backend environment file for the Labd key:

```bash
copy backend\.env.example backend\.env
```

Then update `backend/.env` with your Labd API key:

```env
LABD_API_KEY=your_labd_api_key_here
LABD_API_URL=https://agent.thedevlabs.io/v1/api/chat
```

Keep the key on the server only. Do not expose it in frontend code or source control. If the key is missing or invalid, the app automatically falls back to the mock receipt data so the prototype keeps working.

Useful commands:

```bash
npm run build
npm test
npm start
```

The API provides `GET /api/health` and `POST /api/analyze`. The analyze endpoint accepts a multipart `receipt` file in JPG, PNG, or PDF format, up to 10 MB, and returns the sample items and tax/tip rates. With a valid Labd key configured, the backend asks Labd for a JSON receipt breakdown and falls back to mock data if the request fails or the key is missing.

## Deploy to Vercel as one project with multiple services

Import the repository as a single Vercel project with the repository root as the **Root Directory**. The root [vercel.json](./vercel.json) defines two services:

- `backend` builds from `backend/` and is publicly routed under `/api/*`.
- `frontend` builds from `frontend/` and receives all other public paths.

Both services share the project's deployment domain. The frontend calls `/api/analyze`, which is routed to the backend by the top-level rewrite. No service binding is needed because the static frontend uses this public same-origin API route and does not make a server-side service-to-service call. No `VITE_API_URL` or `FRONTEND_URL` deployment environment variables are required.

## Backend structure

- `backend/server.js` creates the Express app and starts the server.
- `backend/routes/` maps API paths to controller handlers.
- `backend/controllers/` handles request and response behavior.
- `backend/services/` contains the mock receipt analysis.
- `backend/config/` configures in-memory receipt uploads and limits.
- `backend/middleware/` handles API errors.
- `backend/utils.js` validates uploaded file signatures.
