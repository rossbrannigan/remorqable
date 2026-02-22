'use client';

import { useEffect, useRef, useState } from 'react';

const C = {
  bg:     "#0a0d12",
  bgAlt:  "#0e1118",
  navy:   "#112241",
  orange: "#ff914d",
  cream:  "#f5ede0",
  dim:    "rgba(245,237,224,0.45)",
};

// Centre coordinates for each location tag returned by /api/videos
const LOCATION_COORDS: Record<string, [number, number]> = {
  "Cambodia 🇰🇭":     [12.5657, 104.9910],
  "Thailand 🇹🇭":     [15.8700, 100.9925],
  "Vietnam 🇻🇳":      [16.0544, 108.2022],
  "Laos 🇱🇦":         [17.9757, 102.6331],
  "Indonesia 🇮🇩":    [-0.7893, 113.9213],
  "Malaysia 🇲🇾":     [4.2105,  101.9758],
  "Myanmar 🇲🇲":      [19.1633,  96.0785],
  "Philippines 🇵🇭":  [12.8797, 121.7740],
  "Southeast Asia 🌏": [10.0,   106.0],
};

const LOCATION_FLAGS: Record<string, string> = {
  "Cambodia 🇰🇭":     "🇰🇭",
  "Thailand 🇹🇭":     "🇹🇭",
  "Vietnam 🇻🇳":      "🇻🇳",
  "Laos 🇱🇦":         "🇱🇦",
  "Indonesia 🇮🇩":    "🇮🇩",
  "Malaysia 🇲🇾":     "🇲🇾",
  "Myanmar 🇲🇲":      "🇲🇲",
  "Philippines 🇵🇭":  "🇵🇭",
  "Southeast Asia 🌏": "🌏",
};

const LOCATION_SLUG: Record<string, string> = {
  "Cambodia 🇰🇭":     "cambodia",
  "Thailand 🇹🇭":     "thailand",
  "Vietnam 🇻🇳":      "vietnam",
  "Laos 🇱🇦":         "laos",
  "Indonesia 🇮🇩":    "indonesia",
  "Malaysia 🇲🇾":     "malaysia",
  "Myanmar 🇲🇲":      "myanmar",
  "Philippines 🇵🇭":  "philippines",
  "Southeast Asia 🌏": "southeast-asia",
};

interface Video { id: string; title: string; location: string; }

export default function MapClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Fetch videos from the existing API
      let videos: Video[] = [];
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        videos = data.videos || [];
      } catch {
        // fall through — map still renders with empty pins
      }

      if (cancelled || !containerRef.current || mapRef.current) return;

      // 2. Group video IDs by location string
      const byLocation: Record<string, string[]> = {};
      for (const v of videos) {
        if (!byLocation[v.location]) byLocation[v.location] = [];
        byLocation[v.location].push(v.id);
      }

      // 3. Add any known locations that have no videos yet
      for (const loc of Object.keys(LOCATION_COORDS)) {
        if (!byLocation[loc]) byLocation[loc] = [];
      }

      // 4. Load Leaflet and build the map
      const L = await import('leaflet');
      if (cancelled || !containerRef.current || mapRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: [10, 108],
        zoom: 5,
        zoomControl: false,
      });
      mapRef.current = map;

      // CartoDB Voyager — colorful, clearly readable, same domain as dark_all (CSP already allows it)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Force Leaflet to recalculate tile coverage after the flex layout settles
      setTimeout(() => map.invalidateSize(), 150);

      // 5. Add one pin per location
      for (const [locLabel, videoIds] of Object.entries(byLocation)) {
        const coords = LOCATION_COORDS[locLabel];
        if (!coords) continue;

        const flag  = LOCATION_FLAGS[locLabel] || '📍';
        const slug  = LOCATION_SLUG[locLabel]  || '';
        const hasVideos = videoIds.length > 0;

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:38px;height:38px;border-radius:50%;
            background:${hasVideos ? C.orange : C.bgAlt};
            border:2px solid ${hasVideos ? C.cream : C.orange};
            display:flex;align-items:center;justify-content:center;
            font-size:16px;cursor:pointer;
            box-shadow:0 0 ${hasVideos ? '16px rgba(255,145,77,0.6)' : '6px rgba(17,34,65,0.9)'};
            transition:transform 0.2s;
          ">${flag}</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -24],
        });

        const countLabel = hasVideos
          ? `<span style="color:${C.orange};font-size:9px;letter-spacing:0.2em;">${videoIds.length} video${videoIds.length !== 1 ? 's' : ''}</span>`
          : `<span style="color:rgba(245,237,224,0.3);font-size:9px;letter-spacing:0.2em;">Coming soon</span>`;

        // Thumbnails side-by-side (max 2) to keep popup compact
        const thumbs = videoIds.length > 0
          ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px;">
              ${videoIds.slice(0, 2).map(id => `
                <a href="/videos/${id}" style="display:block;text-decoration:none;">
                  <img src="https://img.youtube.com/vi/${id}/mqdefault.jpg"
                    alt="video" style="width:100%;height:52px;object-fit:cover;border-radius:2px;border:1px solid ${C.navy};" />
                </a>`).join('')}
            </div>`
          : '';

        const seriesLink = slug
          ? `<a href="/series/${slug}" style="display:inline-block;margin-top:8px;color:${C.orange};font-size:9px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">View series →</a>`
          : '';

        const popupContent = `
          <div style="background:${C.bgAlt};padding:12px 14px;width:200px;font-family:system-ui,sans-serif;">
            <div style="color:${C.cream};font-size:13px;font-weight:600;letter-spacing:0.04em;margin-bottom:3px;">
              ${flag} ${locLabel.replace(/\s[\u{1F1E6}-\u{1F1FF}]{2}/u, '').trim()}
            </div>
            ${countLabel}
            ${thumbs}
            ${seriesLink}
          </div>`;

        L.marker(coords, { icon })
          .addTo(map)
          .bindPopup(L.popup({
            maxWidth: 240,
            className: 'remorq-popup',
            // Keep popup 80px from top (clears sticky nav) and 10px from other edges
            autoPanPaddingTopLeft: L.point(10, 80),
            autoPanPaddingBottomRight: L.point(10, 10),
          }).setContent(popupContent));
      }

      if (!cancelled) setStatus('ready');
    }

    init().catch(() => setStatus('error'));

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
          <span style={{ color: C.dim, fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Loading map…</span>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <style>{`
        .remorq-popup .leaflet-popup-content-wrapper {
          background: transparent;
          border: 1px solid ${C.navy};
          border-radius: 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.85);
          padding: 0;
        }
        .remorq-popup .leaflet-popup-content { margin: 0; }
        .remorq-popup .leaflet-popup-tip-container { display: none; }
        .remorq-popup .leaflet-popup-close-button {
          color: rgba(245,237,224,0.35) !important;
          top: 6px !important; right: 8px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a {
          background: ${C.bgAlt} !important;
          color: ${C.cream} !important;
          border-color: ${C.navy} !important;
          border-radius: 0 !important;
        }
        .leaflet-control-zoom a:hover { background: ${C.navy} !important; }
        .leaflet-control-attribution {
          background: rgba(10,13,18,0.75) !important;
          color: rgba(245,237,224,0.25) !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: rgba(245,237,224,0.25) !important; }
      `}</style>
    </div>
  );
}
