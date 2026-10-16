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

Useful commands:

```bash
npm run build
npm test
npm start
```

The API provides `GET /api/health` and `POST /api/analyze`. The analyze endpoint accepts a multipart `receipt` file in JPG, PNG, or PDF format, up to 10 MB, and returns the sample items and tax/tip rates.

## Backend structure

- `backend/server.js` creates the Express app and starts the server.
- `backend/routes/` maps API paths to controller handlers.
- `backend/controllers/` handles request and response behavior.
- `backend/services/` contains the mock receipt analysis.
- `backend/config/` configures in-memory receipt uploads and limits.
- `backend/middleware/` handles API errors.
- `backend/utils.js` validates uploaded file signatures.
