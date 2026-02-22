/**
 * Remorqable — Map the Journey
 *
 * This file is the foundation for the interactive map feature.
 * Each entry pins a location on the map and links to the video(s) that cover it.
 *
 * HOW TO ADD: When you publish a new video, add an entry here with the YouTube
 * video ID, the place name, and approximate lat/lng coordinates.
 *
 * To implement the map UI, install a mapping library:
 *   npm install leaflet react-leaflet
 * or use Mapbox GL JS (requires a free API key):
 *   npm install mapbox-gl
 */

export interface Location {
  id: string;          // unique key
  place: string;       // display name
  country: string;     // matches series slug (e.g. "cambodia")
  lat: number;
  lng: number;
  videoIds: string[];  // YouTube video IDs that feature this place
  tags?: string[];     // optional mood tags
}

export const LOCATIONS: Location[] = [
  // ── Cambodia ──────────────────────────────────────────────────
  {
    id: "phnom-penh",
    place: "Phnom Penh",
    country: "cambodia",
    lat: 11.5564,
    lng: 104.9282,
    videoIds: [], // Add YouTube video IDs here, e.g. ["CEkTnyL3YP0"]
    tags: ["🌙 Night Life", "🍜 Food & Markets"],
  },
  {
    id: "siem-reap",
    place: "Siem Reap / Angkor",
    country: "cambodia",
    lat: 13.3671,
    lng: 103.8448,
    videoIds: [],
    tags: ["🎬 Cinematic", "🏍 Adventure"],
  },
  {
    id: "koh-rong",
    place: "Koh Rong",
    country: "cambodia",
    lat: 10.7823,
    lng: 103.2437,
    videoIds: [],
    tags: ["☕ Slow Travel", "🎬 Cinematic"],
  },

  // ── Thailand ───────────────────────────────────────────────────
  {
    id: "bangkok",
    place: "Bangkok",
    country: "thailand",
    lat: 13.7563,
    lng: 100.5018,
    videoIds: [],
    tags: ["🌙 Night Life", "🍜 Food & Markets"],
  },
  {
    id: "chiang-mai",
    place: "Chiang Mai",
    country: "thailand",
    lat: 18.7883,
    lng: 98.9853,
    videoIds: [],
    tags: ["☕ Slow Travel", "🏍 Adventure"],
  },

  // ── Vietnam ────────────────────────────────────────────────────
  {
    id: "hanoi",
    place: "Hanoi",
    country: "vietnam",
    lat: 21.0285,
    lng: 105.8542,
    videoIds: [],
    tags: ["🍜 Food & Markets"],
  },
  {
    id: "ho-chi-minh",
    place: "Ho Chi Minh City",
    country: "vietnam",
    lat: 10.8231,
    lng: 106.6297,
    videoIds: [],
    tags: ["🌙 Night Life", "💰 Budget Travel"],
  },

  // ── Laos ───────────────────────────────────────────────────────
  {
    id: "luang-prabang",
    place: "Luang Prabang",
    country: "laos",
    lat: 19.8845,
    lng: 102.1348,
    videoIds: [],
    tags: ["☕ Slow Travel", "🎬 Cinematic"],
  },
];

/** Get all locations for a given country slug */
export function getLocationsByCountry(country: string): Location[] {
  return LOCATIONS.filter(l => l.country === country);
}

/** Get all locations that feature a specific video */
export function getLocationsByVideo(videoId: string): Location[] {
  return LOCATIONS.filter(l => l.videoIds.includes(videoId));
}
