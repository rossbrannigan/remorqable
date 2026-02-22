'use client';

import dynamic from 'next/dynamic';
// CSS must be imported in the statically-loaded client component,
// not inside the dynamic() import — otherwise Turbopack won't process it
import 'leaflet/dist/leaflet.css';

const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

export default function MapWrapper() {
  return <MapClient />;
}
