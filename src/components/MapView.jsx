import React, { useEffect, useRef, useState } from 'react';

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function MapView({ latitude, longitude, height = 200 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadLeaflet().then((L) => {
      if (!mounted) return;
      mapInstance.current = L.map(mapRef.current, { center: [latitude || 0, longitude || 0], zoom: latitude && longitude ? 15 : 2, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(mapInstance.current);
      if (latitude && longitude) markerRef.current = L.marker([latitude, longitude]).addTo(mapInstance.current);
      setLoading(false);
    }).catch((err) => {
      console.error('Leaflet load error', err);
      setLoading(false);
    });

    return () => {
      mounted = false;
      try { if (mapInstance.current) mapInstance.current.remove(); } catch (e) {}
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstance.current && mapInstance.current.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude]);

  return (
    <div style={{ height }} className="rounded overflow-hidden border">
      {loading && <div className="p-4 text-center text-sm text-gray-500">Loading map...</div>}
      <div ref={mapRef} style={{ height: '100%' }} />
    </div>
  );
}
