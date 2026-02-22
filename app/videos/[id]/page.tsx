import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const C = {
  bg:     "#0a0d12",
  bgAlt:  "#0e1118",
  navy:   "#112241",
  peach:  "#ffd6bc",
  sky:    "#3dafcc",
  orange: "#ff914d",
  red:    "#c60001",
  cream:  "#f5ede0",
  dim:    "rgba(245,237,224,0.45)",
};

interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
  tags: string[];
  viewCount: string;
  likeCount: string;
  duration: string;
  durationISO: string;
  totalSeconds: number;
}

interface VideoListItem {
  id: string;
  title: string;
  location: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getVideo(id: string): Promise<VideoData | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/videos/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getAllVideos(): Promise<VideoListItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/videos`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.videos || [];
  } catch {
    return [];
  }
}

function guessLocation(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("cambodia") || t.includes("phnom penh") || t.includes("angkor") || t.includes("siem reap") || t.includes("koh rong")) return "Cambodia 🇰🇭";
  if (t.includes("thailand") || t.includes("bangkok") || t.includes("chiang mai") || t.includes("phuket") || t.includes("thai")) return "Thailand 🇹🇭";
  if (t.includes("vietnam") || t.includes("hanoi") || t.includes("ho chi minh") || t.includes("saigon")) return "Vietnam 🇻🇳";
  if (t.includes("laos") || t.includes("luang prabang")) return "Laos 🇱🇦";
  if (t.includes("indonesia") || t.includes("bali")) return "Indonesia 🇮🇩";
  if (t.includes("malaysia") || t.includes("kuala lumpur")) return "Malaysia 🇲🇾";
  if (t.includes("myanmar") || t.includes("burma")) return "Myanmar 🇲🇲";
  if (t.includes("philippines") || t.includes("manila")) return "Philippines 🇵🇭";
  return "Southeast Asia 🌏";
}

const LOCATION_SLUGS: Record<string, string> = {
  "Cambodia 🇰🇭": "cambodia",
  "Thailand 🇹🇭": "thailand",
  "Vietnam 🇻🇳": "vietnam",
  "Laos 🇱🇦": "laos",
  "Indonesia 🇮🇩": "indonesia",
  "Malaysia 🇲🇾": "malaysia",
  "Myanmar 🇲🇲": "myanmar",
  "Philippines 🇵🇭": "philippines",
  "Southeast Asia 🌏": "southeast-asia",
};

interface Chapter {
  time: string;
  title: string;
  seconds: number;
}

function parseChapters(description: string): Chapter[] {
  const lines = description.split('\n');
  const chapters: Chapter[] = [];
  // Matches: "0:00 Intro", "1:23 Title", "1:23:45 Title"
  const timePattern = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s+(.+)/;
  for (const line of lines) {
    const match = line.trim().match(timePattern);
    if (match) {
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = parseInt(match[2]);
      const secs = parseInt(match[3]);
      const title = match[4].trim();
      if (!title) continue;
      const totalSeconds = hours * 3600 + minutes * 60 + secs;
      const timeStr = hours > 0
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        : `${minutes}:${secs.toString().padStart(2, '0')}`;
      chapters.push({ time: timeStr, title, seconds: totalSeconds });
    }
  }
  return chapters;
}

function cleanDescription(description: string, hasChapters: boolean): string {
  if (!hasChapters) return description;
  const timePattern = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s+.+/;
  return description
    .split('\n')
    .filter(line => !line.trim().match(timePattern))
    .join('\n')
    .trim();
}

function YTIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) return { title: 'Video not found' };

  const description = video.description.length > 160
    ? video.description.substring(0, 157) + '...'
    : video.description;

  const ogImage = video.thumbnails.maxres?.url || video.thumbnails.high.url;
  const location = guessLocation(video.title + " " + video.description);

  return {
    title: `${video.title} | Remorqable`,
    description,
    keywords: video.tags?.join(', '),
    openGraph: {
      title: `${video.title} | Remorqable`,
      description,
      images: [{ url: ogImage, width: 1280, height: 720 }],
      type: 'video.other',
      url: `https://remorqable.com/videos/${id}`,
      siteName: 'The Remorqable Channel',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${video.title} | Remorqable`,
      description,
      images: [ogImage],
      site: '@remorqable',
    },
    alternates: {
      canonical: `https://remorqable.com/videos/${id}`,
    },
    other: {
      'geo.region': location.includes('Cambodia') ? 'KH' :
                    location.includes('Thailand') ? 'TH' :
                    location.includes('Vietnam') ? 'VN' : 'AS',
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [video, allVideos] = await Promise.all([getVideo(id), getAllVideos()]);
  if (!video) notFound();

  const location = guessLocation(video.title + " " + video.description);
  const seriesSlug = LOCATION_SLUGS[location] || location.split(' ')[0].toLowerCase();
  const chapters = parseChapters(video.description);
  const cleanDesc = cleanDescription(video.description, chapters.length > 0);

  // Related: same location first, then fill from others; exclude current
  const others = allVideos.filter(v => v.id !== id);
  const sameLocation = others.filter(v => v.location === location);
  const different = others.filter(v => v.location !== location);
  const related = [...sameLocation, ...different].slice(0, 8);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": [
      video.thumbnails.maxres?.url,
      video.thumbnails.high.url,
      video.thumbnails.medium.url,
    ].filter(Boolean),
    "uploadDate": video.publishedAt,
    "duration": video.durationISO,
    "embedUrl": `https://www.youtube.com/embed/${video.id}`,
    "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
    "publisher": {
      "@type": "Organization",
      "name": "The Remorqable Channel",
      "url": "https://remorqable.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://remorqable.com/logo.png"
      }
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": parseInt(video.viewCount)
    },
    ...(video.tags?.length > 0 && { "keywords": video.tags.join(', ') }),
  };

  const viewCountNum = parseInt(video.viewCount);
  const likeCountNum = parseInt(video.likeCount);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.cream }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Sticky Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${C.bg}f0`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.navy}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image src="/logo.png" alt="Remorqable" width={36} height={36} style={{ borderRadius: "50%" }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "0.1em" }}>
              <span style={{ color: C.cream }}>The </span>
              <span style={{ color: C.orange }}>Remorq</span>
              <span style={{ color: C.cream }}>able Channel</span>
            </span>
          </Link>
          <a
            href="https://www.youtube.com/@remorqable"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, background: C.red, color: "white", padding: "8px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
          >
            <YTIcon /> Subscribe
          </a>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.dim, letterSpacing: "0.25em", textTransform: "uppercase", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: C.dim, textDecoration: "none" }}>Home</Link>
          <span style={{ color: `${C.cream}20` }}>›</span>
          <Link href={`/series/${seriesSlug}`} style={{ color: C.peach, textDecoration: "none" }}>{location}</Link>
          <span style={{ color: `${C.cream}20` }}>›</span>
          <span style={{ color: `${C.cream}40`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "min(280px, 40vw)" }}>{video.title}</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px 80px" }}>
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Left: Video + info */}
          <div style={{ flex: "1 1 600px", minWidth: 0 }}>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "0.04em",
              color: C.cream,
              lineHeight: 1.1,
              marginBottom: 18,
            }}>
              {video.title}
            </h1>

            {/* Stats row */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 20, fontSize: 12, color: C.dim }}>
              <span style={{
                background: C.navy,
                border: `1px solid ${C.navy}`,
                padding: "4px 12px",
                color: C.peach,
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}>
                {location}
              </span>
              <span>{new Date(video.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>👁 {viewCountNum.toLocaleString()} views</span>
              {likeCountNum > 0 && (
                <span>♥ {likeCountNum.toLocaleString()} likes</span>
              )}
              <span>⏱ {video.duration}</span>
            </div>

            {/* YouTube embed */}
            <div style={{ aspectRatio: "16/9", background: C.bgAlt, marginBottom: 22, overflow: "hidden" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                title={video.title}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {video.tags.slice(0, 14).map((tag, i) => (
                  <span key={i} style={{
                    background: `${C.navy}60`,
                    border: `1px solid ${C.navy}`,
                    color: C.sky,
                    padding: "3px 10px",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Chapters */}
            {chapters.length > 0 && (
              <div style={{ background: C.bgAlt, border: `1px solid ${C.navy}`, padding: "20px 24px", marginBottom: 24 }}>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.3em",
                  color: C.orange,
                  marginBottom: 14,
                  textTransform: "uppercase",
                }}>
                  Chapters
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {chapters.map((ch, i) => (
                    <a
                      key={i}
                      href={`https://www.youtube.com/watch?v=${video.id}&t=${ch.seconds}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "8px 0",
                        borderBottom: `1px solid ${C.navy}40`,
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: C.orange, minWidth: 46, flexShrink: 0 }}>{ch.time}</span>
                      <span style={{ fontSize: 13, color: C.dim }}>{ch.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ borderTop: `1px solid ${C.navy}40`, paddingTop: 24, marginBottom: 28 }}>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.3em",
                color: C.dim,
                marginBottom: 14,
                textTransform: "uppercase",
              }}>
                About this video
              </h2>
              <div style={{ color: `${C.cream}70`, lineHeight: 1.85, fontSize: "0.875rem", whiteSpace: "pre-line" }}>
                {cleanDesc}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.red,
                  color: "white",
                  padding: "12px 28px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                <YTIcon /> Watch on YouTube
              </a>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: `1px solid ${C.navy}`,
                  color: C.dim,
                  padding: "12px 28px",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                ← Back to Channel
              </Link>
            </div>
          </div>

          {/* Right: Related videos sidebar */}
          <aside style={{ flex: "0 1 340px", minWidth: "280px" }}>
            <div style={{ position: "sticky", top: 80 }}>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ height: 2, width: 24, background: C.orange }} />
                <span style={{ color: C.orange, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase" }}>Related Videos</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {related.map(rv => (
                  <Link key={rv.id} href={`/videos/${rv.id}`} style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 120, height: 68, flexShrink: 0, background: C.bgAlt, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${rv.id}/mqdefault.jpg`}
                        alt={rv.title}
                        width={120}
                        height={68}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "0.9rem",
                        letterSpacing: "0.04em",
                        color: C.cream,
                        lineHeight: 1.25,
                        marginBottom: 4,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                      }}>
                        {rv.title}
                      </p>
                      <span style={{ fontSize: 10, color: C.peach, letterSpacing: "0.15em", textTransform: "uppercase" }}>{rv.location}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Series link */}
              <div style={{ marginTop: 24, padding: "16px 20px", background: C.bgAlt, border: `1px solid ${C.navy}` }}>
                <p style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim, marginBottom: 6 }}>
                  Explore series
                </p>
                <Link href={`/series/${seriesSlug}`} style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.06em",
                  color: C.orange,
                  textDecoration: "none",
                }}>
                  All {location} videos →
                </Link>
              </div>

              {/* Subscribe CTA */}
              <div style={{ marginTop: 14, padding: "20px", background: `${C.navy}40`, border: `1px solid ${C.navy}` }}>
                <p style={{ fontSize: 11, color: C.dim, marginBottom: 12, lineHeight: 1.6 }}>
                  New travel stories every week from Southeast Asia and beyond.
                </p>
                <a
                  href="https://www.youtube.com/@remorqable"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: C.red,
                    color: "white",
                    padding: "10px 20px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <YTIcon /> Subscribe Free
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.navy}`, background: "#080a0e", padding: "40px 28px", textAlign: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.14em", color: `${C.cream}40` }}>
            THE <span style={{ color: C.orange }}>REMORQ</span>ABLE CHANNEL
          </p>
        </Link>
        <p style={{ color: `${C.cream}18`, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", marginTop: 12 }}>
          © {new Date().getFullYear()} The Remorqable Channel · A remorque for every road.
        </p>
      </footer>
    </div>
  );
}
