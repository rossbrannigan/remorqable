"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const YT_CHANNEL  = "https://www.youtube.com/@remorqable";
const MUSIC_URL   = "/music/raude.mp3";

const FALLBACK_IDS = [
  "CEkTnyL3YP0","6y2aKbhVqAc","qev1ZlpbYvg",
  "8AxpvZQN9Nw","tMHegUoaTCo","Uqi_GYRAx-g",
];

const C = {
  bg:     "#0a0d12",
  bgAlt:  "#0e1118",
  navy:   "#112241",
  peach:  "#ffd6bc",
  sky:    "#3dafcc",
  orange: "#ff914d",
  green:  "#009244",
  red:    "#c60001",
  cream:  "#f5ede0",
  dim:    "rgba(245,237,224,0.45)",
};

type Video = { id: string; title: string; location: string; mood?: string[] };

function YTIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero Mashup
   NOTE: Browsers block unmuted autoplay in cross-origin iframes
   (YouTube). The background video must be muted. The Raude audio
   track is the site's audio layer instead — toggle in the nav.
───────────────────────────────────────────────────────────── */
function HeroMashup({ videoIds }: { videoIds: string[] }) {
  const ids = videoIds.length > 0 ? videoIds : FALLBACK_IDS;
  const [current, setCurrent] = useState(0);
  const [fading,  setFading]  = useState(false);
  const [nextIdx, setNextIdx] = useState(1 % Math.max(ids.length, 1));

  useEffect(() => {
    if (ids.length <= 1) return;
    const interval = setInterval(() => {
      const n = (current + 1) % ids.length;
      setNextIdx(n);
      setFading(true);
      setTimeout(() => {
        setCurrent(n);
        setFading(false);
      }, 2500);
    }, 25000);
    return () => clearInterval(interval);
  }, [current, ids.length]);

  const src = (id: string) =>
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&showinfo=0&rel=0&modestbranding=1` +
    `&iv_load_policy=3&disablekb=1&playsinline=1&start=5`;

  const dotCount = Math.min(ids.length, 10);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Current clip */}
      <div style={{ position: "absolute", inset: 0, transition: "opacity 2.5s ease", opacity: fading ? 0 : 1 }}>
        <iframe
          key={`cur-${ids[current]}`}
          src={src(ids[current])}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: "absolute", width: "160%", height: "160%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "none", pointerEvents: "none" }}
        />
      </div>
      {/* Next clip — preloads during fade */}
      <div style={{ position: "absolute", inset: 0, transition: "opacity 2.5s ease", opacity: fading ? 1 : 0 }}>
        <iframe
          key={`nxt-${ids[nextIdx]}`}
          src={src(ids[nextIdx])}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: "absolute", width: "160%", height: "160%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "none", pointerEvents: "none" }}
        />
      </div>
      {/* Progress dots */}
      <div style={{ position: "absolute", bottom: 78, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 5 }}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <div key={i} style={{
            width: i === current % dotCount ? 22 : 5,
            height: 5, borderRadius: 3,
            background: i === current % dotCount ? C.orange : `${C.cream}28`,
            transition: "all 0.6s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Video Card ──────────────────────────────────────────────── */
function VideoCard({ video, index }: { video: Video; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/videos/${video.id}`}>
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: C.bgAlt, cursor: "pointer" }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}
            className="group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,13,18,0.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(10,13,18,0.72)", backdropFilter: "blur(8px)", border: `1px solid ${C.navy}`, padding: "4px 11px" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.peach }}>{video.location}</span>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${C.cream}cc`, background: "rgba(10,13,18,0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s, transform 0.3s" }} className="group-hover:opacity-100 group-hover:scale-110">
              <svg width={20} height={20} viewBox="0 0 24 24" fill={C.cream}><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
        <div style={{ padding: "13px 2px 4px" }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.05em", color: C.cream, lineHeight: 1.2, transition: "color 0.2s" }} className="group-hover:text-[#ff914d]">
            {video.title || "Watch Now"}
          </h3>
          <p style={{ fontSize: "0.78rem", color: C.dim, marginTop: 4 }}>{video.location}</p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Lightbox ────────────────────────────────────────────────── */
function Lightbox({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,13,18,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 920 }}
      >
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.navy}`, color: C.dim, padding: "5px 16px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>✕ Close</button>
        </div>
        <div style={{ aspectRatio: "16/9" }}>
          <iframe style={{ width: "100%", height: "100%", border: "none" }} src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} allow="autoplay; fullscreen" allowFullScreen />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function Page() {
  const [musicOn,  setMusicOn]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videos,   setVideos]   = useState<Video[]>([]);
  const [videoIds, setVideoIds] = useState<string[]>(FALLBACK_IDS);
  const [loading,  setLoading]  = useState(true);
  const [musicError, setMusicError] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const audioRef                = useRef<HTMLAudioElement>(null);
  const containerRef            = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  /* ── Fetch all videos from server API route ── */
  useEffect(() => {
    fetch("/api/videos")
      .then(r => r.json())
      .then(data => {
        if (data.videos?.length > 0) {
          setVideos(data.videos);
          setVideoIds(data.videos.map((v: Video) => v.id));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Music toggle ─────────────────────────────────────────── */
  const toggleMusic = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.volume = 0.5;
      setMusicError(false);
      try {
        await a.play();
        setMusicOn(true);
      } catch (err) {
        const name = (err as Error)?.name;
        if (name === "NotAllowedError") {
          // Autoplay blocked by browser — not an error, just needs user gesture
        } else {
          console.warn("Audio play failed:", err);
          setMusicError(true);
        }
      }
    }
  }, [musicOn]);

  /* ── Auto-start music on first user interaction ─────────── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const tryPlay = () => {
      a.volume = 0.5;
      a.play().then(() => setMusicOn(true)).catch(() => {});
    };
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const displayVideos: Video[] = videos.length > 0
    ? videos
    : FALLBACK_IDS.map(id => ({ id, title: "Watch Now", location: "Southeast Asia 🌏", mood: [] }));
  const availableLocations = [...new Set(videos.map(v => v.location))].sort();
  const availableMoods = [...new Set(videos.flatMap(v => v.mood || []))].sort();
  const filteredVideos = displayVideos
    .filter(v => !locationFilter || v.location === locationFilter)
    .filter(v => !moodFilter || (v.mood || []).includes(moodFilter));

  return (
    <div ref={containerRef} style={{ background: C.bg, minHeight: "100vh", color: C.cream, overflowX: "hidden" }}>

      {/* Raude music */}
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
        preload="auto"
        onError={() => setMusicError(true)}
      />

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: scrolled ? 62 : 76,
        background: scrolled ? `${C.bg}f0` : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.navy}` : "none",
        transition: "all 0.35s ease", display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <a href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <Image src="/logo.png" alt="The Remorqable Channel" width={42} height={42} style={{ display: "block" }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.1em" }}>
              <span style={{ color: C.cream }}>The </span>
              <span style={{ color: C.orange }}>Remorq</span>
              <span style={{ color: C.cream }}>able Channel</span>
            </span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>

            {/* ── Music toggle ── */}
            <button
              onClick={toggleMusic}
              title={musicError ? "Music file missing — add raude.mp3 to /public/music/" : musicOn ? "Pause music" : "Play Raude"}
              style={{
                background: "none",
                border: `1px solid ${musicError ? C.red : musicOn ? C.orange : C.navy}`,
                color: musicError ? C.red : musicOn ? C.orange : C.dim,
                width: 36, height: 36, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {musicOn ? (
                /* Equaliser bars when playing */
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 13 }}>
                  {[1, 0.55, 0.85, 0.4].map((h, i) => (
                    <div key={i} style={{
                      width: 3, borderRadius: 2, background: C.orange,
                      height: `${h * 100}%`,
                      animation: `line-drop ${0.5 + i * 0.15}s ease infinite alternate`,
                    }} />
                  ))}
                </div>
              ) : (
                /* Music note when paused */
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              )}
            </button>

            <a href="#videos" style={{ color: C.dim, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>
              Videos
            </a>

            <Link href="/map" style={{ color: C.dim, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>
              Map
            </Link>

            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, background: C.red, color: "white", padding: "8px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              <YTIcon size={14} /> Subscribe
            </a>
          </div>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        <HeroMashup videoIds={videoIds} />

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(155deg, ${C.navy}d0 0%, rgba(10,13,18,0.35) 55%, ${C.bg} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, ${C.bg} 100%)` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 0.035, mixBlendMode: "overlay", pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* Content */}
        <motion.div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", opacity: heroOpacity }}>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}
          >
            <div style={{ position: "relative", width: 148, height: 148 }}>
              <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `1px dashed ${C.navy}`, animation: "spin-slow 28s linear infinite" }} />
              {[0, 90, 180, 270].map((deg, i) => (
                <div key={deg} style={{
                  position: "absolute", width: 7, height: 7, borderRadius: "50%",
                  background: [C.orange, C.sky, C.green, C.red][i],
                  top: "50%", left: "50%", transformOrigin: "0 0",
                  transform: `rotate(${deg}deg) translateX(82px) translateY(-3.5px)`,
                  animation: "counter-spin 28s linear infinite",
                }} />
              ))}
              <div style={{ width: 148, height: 148, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.navy}`, boxShadow: `0 0 0 1px ${C.sky}30, 0 20px 60px rgba(10,13,18,0.9)`, animation: "bob 7s ease-in-out infinite" }}>
                <Image src="/logo.png" alt="The Remorqable Channel" width={148} height={148} priority style={{ display: "block" }} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ height: 1, width: 44, background: C.orange, opacity: 0.6 }} />
            <span style={{ color: C.peach, fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", fontWeight: 300 }}>Southeast Asia & Beyond</span>
            <div style={{ height: 1, width: 44, background: C.orange, opacity: 0.6 }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4.5rem, 14vw, 11rem)", lineHeight: 0.88, letterSpacing: "0.03em", textShadow: `0 8px 60px rgba(10,13,18,0.9)` }}
          >
            <span style={{ color: C.cream }}>THE</span><br />
            <span style={{ color: C.orange }}>REMORQ</span><span style={{ color: C.cream }}>ABLE</span><br />
            <span style={{ color: `${C.peach}70`, fontSize: "0.38em", letterSpacing: "0.4em" }}>CHANNEL</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 16, color: C.dim, fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 300 }}>
            Travel Stories Worth Watching
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            style={{ marginTop: 38, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, background: C.red, color: "white", padding: "14px 34px", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 8px 36px ${C.red}55`, transition: "transform 0.25s, box-shadow 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 48px ${C.red}75`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 36px ${C.red}55`; }}>
              <YTIcon size={17} /> Subscribe Free
            </a>
            <a href="#videos"
              style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.sky}55`, color: C.sky, padding: "14px 34px", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s" }}
              onMouseEnter={e => (e.currentTarget.style.background = `${C.sky}14`)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Watch Videos ↓
            </a>
          </motion.div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
          <span style={{ color: `${C.cream}25`, fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 50, background: `linear-gradient(to bottom, ${C.orange}70, transparent)`, animation: "bob 2.5s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ══ TICKER ═══════════════════════════════════════════════ */}
      <div style={{ overflow: "hidden", borderTop: `1px solid ${C.navy}`, borderBottom: `1px solid ${C.navy}`, background: C.bgAlt, padding: "12px 0" }}>
        <div style={{ display: "flex", gap: 52, animation: "marquee 40s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].flatMap((_, ai) =>
            ["🇰🇭 Cambodia","🇹🇭 Thailand","🇻🇳 Vietnam","🇱🇦 Laos","🇲🇲 Myanmar","🇮🇩 Indonesia","🇵🇭 Philippines","🇲🇾 Malaysia","🌏 Going Global"].map((d, i) => (
              <span key={`${ai}-${i}`} style={{ color: `${C.cream}20`, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", flexShrink: 0 }}>
                {d}<span style={{ color: `${C.orange}40`, margin: "0 18px" }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ ABOUT ════════════════════════════════════════════════ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 72, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ height: 3, width: 44, background: C.orange, marginBottom: 28 }} />
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.1, color: C.cream }}>
              The world is<br />
              <em style={{ color: C.orange }}>unforgettably</em><br />
              remorqable.
            </h2>
            <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
              {[
                { val: loading ? "…" : `${displayVideos.length}`, label: "Videos",        col: C.orange },
                { val: "SE Asia",                                  label: "Base",           col: C.sky   },
                { val: "🌏",                                        label: "Growing Global", col: C.green },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: s.col, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: C.dim, marginTop: 5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.navy}`, flexShrink: 0 }}>
                <Image src="/logo.png" alt="" width={72} height={72} style={{ display: "block" }} />
              </div>
              <p style={{ color: C.dim, fontSize: "0.95rem", lineHeight: 1.8, fontWeight: 300 }}>
                From the ancient temples of Angkor to the electric streets of Bangkok,{" "}
                <strong style={{ color: C.cream, fontWeight: 500 }}>The Remorqable Channel</strong>{" "}
                takes you beyond the tourist trail — into the living, breathing soul of Southeast Asia.
              </p>
            </div>
            <p style={{ color: `${C.cream}38`, fontSize: "0.88rem", lineHeight: 1.9, fontWeight: 300, borderLeft: `2px solid ${C.navy}`, paddingLeft: 18 }}>
              Raw. Cinematic. Honest travel storytelling. Born in Cambodia, riding the remorque into the unknown — growing global one adventure at a time.
            </p>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 32, color: C.orange, fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", textDecoration: "none", fontWeight: 500, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Subscribe Free on YouTube →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ MAP THE JOURNEY ══════════════════════════════════════ */}
      <section style={{ borderTop: `1px solid ${C.navy}`, background: C.bg, padding: "80px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 60, alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ height: 3, width: 44, background: C.orange, marginBottom: 24 }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "0.04em", color: C.cream, lineHeight: 1, marginBottom: 16 }}>
              Map the Journey
            </h2>
            <p style={{ color: C.dim, fontSize: "0.95rem", lineHeight: 1.8, fontWeight: 300, maxWidth: 420, marginBottom: 32 }}>
              Every road taken, every border crossed — plotted on a living map of Southeast Asia. Click any pin to jump straight to the video.
            </p>
            <Link href="/map"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.orange}`, color: C.orange, padding: "12px 32px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${C.orange}14`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
              Open the Map →
            </Link>
          </motion.div>

          {/* Decorative map preview */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <Link href="/map" style={{ display: "block", textDecoration: "none", position: "relative" }}>
              <div style={{ position: "relative", aspectRatio: "16/9", background: C.bgAlt, border: `1px solid ${C.navy}`, overflow: "hidden" }}>
                {/* Grid lines suggesting a map */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.navy}55 1px, transparent 1px), linear-gradient(90deg, ${C.navy}55 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
                {/* Decorative "pins" */}
                {[
                  { top: "38%", left: "28%", label: "🇰🇭" },
                  { top: "28%", left: "42%", label: "🇹🇭" },
                  { top: "22%", left: "52%", label: "🇻🇳" },
                  { top: "26%", left: "36%", label: "🇱🇦" },
                  { top: "58%", left: "55%", label: "🇮🇩" },
                ].map((pin, i) => (
                  <div key={i} style={{ position: "absolute", top: pin.top, left: pin.left, transform: "translate(-50%, -50%)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.bgAlt, border: `2px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, boxShadow: `0 0 10px ${C.orange}55` }}>
                      {pin.label}
                    </div>
                  </div>
                ))}
                {/* Overlay CTA */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,13,18,0.45)" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.2em", color: C.cream, marginBottom: 8 }}>Explore the Map</div>
                    <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: C.orange }}>Click to open →</div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ VIDEO GRID ═══════════════════════════════════════════ */}
      <section id="videos" style={{ background: C.bgAlt, padding: "80px 0 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ marginBottom: 48, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ height: 2, width: 32, background: C.orange }} />
                <span style={{ color: C.orange, fontSize: 10, letterSpacing: "0.55em", textTransform: "uppercase" }}>All Episodes</span>
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 3.8rem)", letterSpacing: "0.04em", color: C.cream, lineHeight: 1 }}>
                Watch the Journey
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ color: C.dim, fontSize: 11 }}>
                {loading ? "Loading…" : `${filteredVideos.length}${locationFilter ? ` in ${locationFilter}` : " videos"}`}
              </span>
              <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
                style={{ color: `${C.cream}28`, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
                onMouseLeave={e => (e.currentTarget.style.color = `${C.cream}28`)}>
                View all on YouTube →
              </a>
            </div>
          </div>

          {/* Location filter buttons */}
          {availableLocations.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              <button
                onClick={() => setLocationFilter(null)}
                style={{
                  background: locationFilter === null ? C.orange : "transparent",
                  border: `1px solid ${locationFilter === null ? C.orange : C.navy}`,
                  color: locationFilter === null ? C.bg : C.dim,
                  padding: "6px 16px",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                All
              </button>
              {availableLocations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc === locationFilter ? null : loc)}
                  style={{
                    background: locationFilter === loc ? C.orange : "transparent",
                    border: `1px solid ${locationFilter === loc ? C.orange : C.navy}`,
                    color: locationFilter === loc ? C.bg : C.dim,
                    padding: "6px 16px",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}

          {/* Mood filter chips */}
          {availableMoods.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              <span style={{ color: C.dim, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", alignSelf: "center", marginRight: 4 }}>Mood:</span>
              {availableMoods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setMoodFilter(mood === moodFilter ? null : mood)}
                  style={{
                    background: moodFilter === mood ? C.sky : "transparent",
                    border: `1px solid ${moodFilter === mood ? C.sky : C.navy}`,
                    color: moodFilter === mood ? C.bg : C.dim,
                    padding: "6px 16px",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 26 }}>
            {filteredVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 60 }}>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.navy}`, color: C.sky, padding: "13px 40px", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${C.sky}12`; e.currentTarget.style.borderColor = C.sky; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.navy; }}>
              <YTIcon size={15} /> See all videos on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ═══════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", padding: "130px 28px", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.navy} 0%, ${C.bg} 60%)` }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.05, pointerEvents: "none" }}>
          <Image src="/logo.png" alt="" width={650} height={650} />
        </div>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ position: "relative", zIndex: 2 }}>
          <p style={{ color: C.peach, fontSize: 10, letterSpacing: "0.65em", textTransform: "uppercase", marginBottom: 22 }}>New videos every week</p>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(3rem, 8vw, 6.5rem)", lineHeight: 1.05, color: C.cream, marginBottom: 44 }}>
            Your next<br /><em style={{ color: C.orange }}>adventure</em><br />awaits.
          </h2>
          <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.red, color: "white", padding: "17px 50px", fontWeight: 700, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", boxShadow: `0 12px 55px ${C.red}50`, transition: "transform 0.25s, box-shadow 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 65px ${C.red}70`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 12px 55px ${C.red}50`; }}>
            <YTIcon size={20} /> Subscribe on YouTube
          </a>
        </motion.div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${C.navy}`, background: "#080a0e", padding: "50px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.navy}` }}>
            <Image src="/logo.png" alt="" width={64} height={64} style={{ display: "block" }} />
          </div>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.14em", color: `${C.cream}40` }}>
            THE <span style={{ color: C.orange }}>REMORQ</span>ABLE CHANNEL
          </p>
          <p style={{ color: `${C.cream}18`, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase" }}>
            © {new Date().getFullYear()} The Remorqable Channel · remorqable.com
          </p>
          <p style={{ color: `${C.cream}14`, fontSize: 11, fontStyle: "italic" }}>A remorque for every road.</p>
          <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 7, color: `${C.cream}28`, fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", textDecoration: "none", marginTop: 4, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
            onMouseLeave={e => (e.currentTarget.style.color = `${C.cream}28`)}>
            <YTIcon size={13} /> YouTube Channel ↗
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {lightbox && <Lightbox videoId={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
