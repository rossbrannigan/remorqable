# 🎬 The Remorqable Channel — Landing Page Setup

## 🚀 Quick Deploy (2 minutes)

```bash
npm install
npm run dev     # preview at localhost:3000
```

Push to GitHub → Import on **Vercel** or **Netlify** → Done!
Add your domain `remorqable.com` in Settings → Domains.

---

## ✏️ Step 1 — Add Your YouTube Video IDs

Open `app/page.tsx`, find the `VIDEOS` array at the top, and replace `"VIDEO_ID_1"` etc with real IDs:

```ts
const VIDEOS = [
  {
    id: "abc123XYZ",   // ← your video ID from youtube.com/watch?v=abc123XYZ
    title: "Streets of Phnom Penh",
    location: "Phnom Penh, Cambodia",
    description: "The chaos, the colour, the charm...",
  },
  // up to 6 videos
];
```

Thumbnails are auto-fetched from YouTube — no extra work needed!

---

## 🎵 Step 2 — Add Your Raude Music Track

1. Download the Raude track (confirm it's free/licensed for web use)
2. Place the `.mp3` file in `/public/music/` e.g. `raude-track.mp3`
3. In `app/page.tsx` update:
   ```ts
   const MUSIC_URL = "/music/raude-track.mp3";
   ```

The music player button appears in the navbar automatically once the file is ready.

---

## 🔗 Step 3 — Update Your Channel URL

Find `YOUTUBE_CHANNEL` near the top of `app/page.tsx`:
```ts
const YOUTUBE_CHANNEL = "https://www.youtube.com/@TheRemorqableChannel";
```
Replace with your exact YouTube channel URL.

---

## 🎨 Brand Colours

| Name     | Hex       | Used for                          |
|----------|-----------|-----------------------------------|
| Gold     | `#f0c060` | Accents, Q letter, CTA buttons    |
| Navy     | `#1a3a5c` | Secondary buttons, depth          |
| Dark     | `#0a0604` | Background — deep warm black      |

Logo is automatically used from `/public/logo.png` ✓

---

## 📁 File Structure

```
app/
  page.tsx        ← All landing page content (edit this)
  layout.tsx      ← HTML head, Google Fonts, metadata
  globals.css     ← Animations, scrollbar, base styles
public/
  logo.png        ← Your Remorqable logo ✓
  music/
    raude-track.mp3   ← Add your Raude track here
```
