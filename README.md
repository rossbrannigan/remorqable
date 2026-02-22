# The Remorqable Channel — Landing Page

## 🚀 Deploy in 3 steps

1. **Push to GitHub** → drag this folder into a new repo
2. **Import to Vercel** → vercel.com → Add New Project → select repo
3. **Add environment variable** in Vercel settings:
   - `YT_API_KEY` = your YouTube Data API v3 key

---

## 🎵 IMPORTANT — Music setup (Raude.mp3)

The music file is **not included** in this zip (too large for code repos).

After unzipping, copy your Raude mp3 here:
```
public/music/raude.mp3
```

That's it. The toggle button in the nav will then work.

If the file is missing, the music button turns red as a reminder.

---

## 🎬 Hero video

The background video cycles through all your YouTube videos automatically.
It is muted (browsers require this for autoplay in iframes — it's a browser rule,
not a code issue). The Raude music is the audio layer instead.

---

## 📺 Videos

All videos load automatically from your YouTube channel via the API.
No code changes needed when you upload new videos — they appear automatically.

