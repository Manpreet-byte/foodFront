import React, { useEffect, useRef, useState } from 'react';

// Lightweight Leaflet loader + map picker using OpenStreetMap + Nominatim search
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

export default function MapPicker({ initialAddress = '', onSelect }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadLeaflet().then((L) => {
      if (!mounted) return;
      leafletMapRef.current = L.map(mapRef.current, { center: [20, 0], zoom: 2 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      // click to set marker
      leafletMapRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.setLatLng(e.latlng);
        else markerRef.current = L.marker(e.latlng).addTo(leafletMapRef.current);
        // reverse geocode for address
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const display = data.display_name || '';
          onSelect && onSelect({ address: display, latitude: lat, longitude: lng });
        } catch (err) {
          onSelect && onSelect({ address: '', latitude: lat, longitude: lng });
        }
      });
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load Leaflet', err);
      setLoading(false);
    });

    return () => {
      mounted = false;
      try { if (leafletMapRef.current) leafletMapRef.current.remove(); } catch (e) {}
    };
  }, [onSelect]);

  const doSearch = async () => {
    const q = searchRef.current.value;
    if (!q) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=5`);
      const items = await res.json();
      if (!items || items.length === 0) return;
      const first = items[0];
      const lat = parseFloat(first.lat);
      const lon = parseFloat(first.lon);
      const L = window.L;
      if (L && leafletMapRef.current) {
        leafletMapRef.current.setView([lat, lon], 15);
        if (markerRef.current) markerRef.current.setLatLng([lat, lon]);
        else markerRef.current = L.marker([lat, lon]).addTo(leafletMapRef.current);
      }
      onSelect && onSelect({ address: first.display_name || q, latitude: lat, longitude: lon });
    } catch (err) {
      console.error('Geocode error', err);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
        <input ref={searchRef} defaultValue={initialAddress} placeholder="Search address or place" className="flex-1 border p-2 rounded" />
        <button type="button" onClick={doSearch} className="bg-green-600 text-white px-4 rounded">Search</button>
      </div>
      <div ref={mapRef} style={{ height: 300 }} className="rounded bg-gray-100">
        {loading && <div className="p-4 text-center text-sm text-gray-500">Loading map...</div>}
      </div>
    </div>
  );
}
