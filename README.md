# Frontend for Upload Image

This is a small React + Vite frontend to work with the existing Express backend at `/api/images`.

Features
- Upload an image with optional title (POST /api/images)
- List images from the backend (GET /api/images)
- Copy image URL to clipboard and open image in new tab

Quick start
1. Install dependencies

```bash
cd frontend
npm install
```

2. Set API base URL (optional)

By default the app will call relative `/api/images` (useful if you serve frontend from same host). For development, set `VITE_API_URL` to your backend URL, e.g. `http://localhost:5000`.

On Linux/macOS:

```bash
export VITE_API_URL=http://localhost:5000
npm run dev
```

On Windows (PowerShell):

```powershell
$env:VITE_API_URL = 'http://localhost:5000'
npm run dev
```

Notes
- The backend expects the form field to be named `image` and optional `title` in the same multipart/form-data payload.
- If your backend requires CORS, enable it on the Express server or run the frontend from the same origin.

