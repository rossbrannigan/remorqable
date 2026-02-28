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

const LOCATION_MAP: Record<string, { label: string; flag: string; description: string }> = {
  "cambodia":     { label: "Cambodia",     flag: "🇰🇭", description: "Ancient temples, bustling markets, and untouched coastlines — Cambodia through honest eyes." },
  "thailand":     { label: "Thailand",     flag: "🇹🇭", description: "From Bangkok's electric streets to the mountains of Chiang Mai — Thailand's endless contrasts." },
  "vietnam":      { label: "Vietnam",      flag: "🇻🇳", description: "Motorbikes, mountains, and street food — Vietnam from north to south." },
  "laos":         { label: "Laos",         flag: "🇱🇦", description: "The slow river life of Laos — one of Southeast Asia's last great frontiers." },
  "indonesia":    { label: "Indonesia",    flag: "🇮🇩", description: "Volcanoes, rice terraces, and ocean sunsets — Indonesia's incredible archipelago." },
  "malaysia":     { label: "Malaysia",     flag: "🇲🇾", description: "Rainforests, skyscrapers, and the finest street food in the region." },
  "myanmar":      { label: "Myanmar",      flag: "🇲🇲", description: "Golden pagodas and ancient kingdoms — Myanmar before the crowds arrive." },
  "philippines":  { label: "Philippines",  flag: "🇵🇭", description: "7,000 islands, crystal water, and some of the warmest people on earth." },
  "southeast-asia": { label: "Southeast Asia", flag: "🌏", description: "Stories from across the region — the roads less travelled." },
};

// Map slug back to the location string used in the API
const SLUG_TO_LOCATION: Record<string, string> = {
  "cambodia":       "Cambodia 🇰🇭",
  "thailand":       "Thailand 🇹🇭",
  "vietnam":        "Vietnam 🇻🇳",
  "laos":           "Laos 🇱🇦",
  "indonesia":      "Indonesia 🇮🇩",
  "malaysia":       "Malaysia 🇲🇾",
  "myanmar":        "Myanmar 🇲🇲",
  "philippines":    "Philippines 🇵🇭",
  "southeast-asia": "Southeast Asia 🌏",
};

interface VideoListItem {
  id: string;
  title: string;
  location: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

async function getVideosByLocation(location: string): Promise<VideoListItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/videos`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const all: VideoListItem[] = data.videos || [];
    return all.filter(v => v.location === location);
  } catch {
    return [];
  }
}

function YTIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function generateStaticParams() {
  return Object.keys(LOCATION_MAP).map(country => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const info = LOCATION_MAP[country];
  if (!info) return { title: 'Series not found' };

  const title = `${info.label} Travel Videos | Remorqable`;
  const description = info.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://remorqable.com/series/${country}`,
      siteName: 'The Remorqable Channel',
      images: [{ url: '/logo.png', width: 500, height: 500, alt: `${info.label} Travel | The Remorqable Channel` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
    alternates: {
      canonical: `https://remorqable.com/series/${country}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const info = LOCATION_MAP[country];
  if (!info) notFound();

  const locationString = SLUG_TO_LOCATION[country];
  const videos = await getVideosByLocation(locationString);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${info.label} Travel Videos | Remorqable`,
      "description": info.description,
      "url": `https://remorqable.com/series/${country}`,
      "publisher": {
        "@type": "Organization",
        "name": "The Remorqable Channel",
        "url": "https://remorqable.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://remorqable.com" },
        { "@type": "ListItem", "position": 2, "name": `${info.label} Travel Videos`, "item": `https://remorqable.com/series/${country}` },
      ],
    },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.dim, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          <Link href="/" style={{ color: C.dim, textDecoration: "none" }}>Home</Link>
          <span style={{ color: `${C.cream}20` }}>›</span>
          <span style={{ color: C.peach }}>{info.flag} {info.label}</span>
        </div>
      </div>

      {/* Hero header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 28px 56px" }}>
        <div style={{ height: 3, width: 44, background: C.orange, marginBottom: 24 }} />
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          letterSpacing: "0.04em",
          color: C.cream,
          lineHeight: 1,
          marginBottom: 16,
        }}>
          {info.flag} {info.label}
        </h1>
        <p style={{ color: C.dim, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, fontWeight: 300 }}>
          {info.description}
        </p>
        <p style={{ color: C.orange, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginTop: 16 }}>
          {videos.length} {videos.length === 1 ? 'video' : 'videos'}
        </p>
      </div>

      {/* Video grid */}
      <div style={{ background: C.bgAlt, padding: "56px 0 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
          {videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ color: C.dim, fontSize: "1rem", marginBottom: 24 }}>
                No videos found for {info.label} yet — check back soon!
              </p>
              <Link href="/" style={{ color: C.orange, textDecoration: "none", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                ← Back to all videos
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 26 }}>
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`} style={{ textDecoration: "none" }} className="group">
                  <div>
                    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: C.bgAlt }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}
                        className="group-hover:scale-105"
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,13,18,0.85) 0%, transparent 50%)" }} />
                      <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(10,13,18,0.72)", backdropFilter: "blur(8px)", border: `1px solid ${C.navy}`, padding: "4px 10px" }}>
                        <span style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: C.peach }}>{info.flag} {info.label}</span>
                      </div>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${C.cream}cc`, background: "rgba(10,13,18,0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s, transform 0.3s" }} className="group-hover:opacity-100 group-hover:scale-110">
                          <svg width={18} height={18} viewBox="0 0 24 24" fill={C.cream}><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 2px 4px" }}>
                      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.05em", color: C.cream, lineHeight: 1.2, transition: "color 0.2s" }} className="group-hover:text-[#ff914d]">
                        {video.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* All countries nav */}
          <div style={{ marginTop: 72, borderTop: `1px solid ${C.navy}`, paddingTop: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ height: 2, width: 24, background: C.orange }} />
              <span style={{ color: C.orange, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase" }}>More Series</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {Object.entries(LOCATION_MAP).filter(([slug]) => slug !== country).map(([slug, loc]) => (
                <Link
                  key={slug}
                  href={`/series/${slug}`}
                  style={{
                    border: `1px solid ${C.navy}`,
                    color: C.dim,
                    padding: "8px 18px",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  className="hover:border-[#ff914d] hover:text-[#ffd6bc]"
                >
                  {loc.flag} {loc.label}
                </Link>
              ))}
            </div>
          </div>
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
