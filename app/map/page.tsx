import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LOCATIONS } from '../locations';
import MapWrapper from './MapWrapper';

export const metadata: Metadata = {
  title: 'Map the Journey | Remorqable',
  description: 'Explore every destination in the Remorqable travel series — from Cambodia\'s ancient temples to the mountains of Chiang Mai.',
  openGraph: {
    title: 'Map the Journey | Remorqable',
    description: 'Explore every destination in the Remorqable travel series across Southeast Asia.',
    type: 'website',
    url: 'https://remorqable.com/map',
    siteName: 'The Remorqable Channel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Map the Journey | Remorqable',
    description: 'Explore every destination in the Remorqable travel series across Southeast Asia.',
  },
  alternates: {
    canonical: 'https://remorqable.com/map',
  },
};

const C = {
  bg:     "#0a0d12",
  bgAlt:  "#0e1118",
  navy:   "#112241",
  peach:  "#ffd6bc",
  orange: "#ff914d",
  red:    "#c60001",
  cream:  "#f5ede0",
  dim:    "rgba(245,237,224,0.45)",
};

function YTIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Map the Journey | Remorqable",
  "description": "Interactive map of all Remorqable travel destinations across Southeast Asia.",
  "url": "https://remorqable.com/map",
  "publisher": {
    "@type": "Organization",
    "name": "The Remorqable Channel",
    "url": "https://remorqable.com",
  },
};

export default function MapPage() {
  const totalPins = LOCATIONS.length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.cream, display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Sticky Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${C.bg}f0`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.navy}`,
        flexShrink: 0,
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

      {/* Header bar */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 28px 16px", width: "100%", flexShrink: 0 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.dim, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>
          <Link href="/" style={{ color: C.dim, textDecoration: "none" }}>Home</Link>
          <span style={{ color: `${C.cream}20` }}>›</span>
          <span style={{ color: C.peach }}>Map the Journey</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ height: 3, width: 44, background: C.orange, marginBottom: 12 }} />
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "0.04em",
              color: C.cream,
              lineHeight: 1,
              marginBottom: 8,
            }}>
              Map the Journey
            </h1>
            <p style={{ color: C.dim, fontSize: "0.9rem", maxWidth: 480, fontWeight: 300 }}>
              Every destination filmed across Southeast Asia — click a pin to explore.
            </p>
          </div>
          <p style={{ color: C.orange, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase" }}>
            {totalPins} locations
          </p>
        </div>
      </div>

      {/* Map */}
      <div style={{ height: "60vh", minHeight: 480, position: "relative" }}>
        <MapWrapper />
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.navy}`, background: "#080a0e", padding: "28px", textAlign: "center", flexShrink: 0 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.14em", color: `${C.cream}40` }}>
            THE <span style={{ color: C.orange }}>REMORQ</span>ABLE CHANNEL
          </p>
        </Link>
        <p style={{ color: `${C.cream}18`, fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", marginTop: 10 }}>
          © {new Date().getFullYear()} The Remorqable Channel · A remorque for every road.
        </p>
      </footer>
    </div>
  );
}
