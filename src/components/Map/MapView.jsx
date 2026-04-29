import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Vite's broken default Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const CATEGORY_COLORS = {
  food:       '#F59E0B',
  attraction: '#6366F1',
  nature:     '#10B981',
  hotel:      '#0EA5E9',
  shopping:   '#F43F5E',
  nightlife:  '#8B5CF6',
  experience: '#14B8A6',
  other:      '#64748B',
};
const CATEGORY_EMOJI = {
  food: '🍜', attraction: '🏛️', nature: '🌿', hotel: '🛏️',
  shopping: '🛍️', nightlife: '🌙', experience: '✨', other: '📍',
};

function createSpotIcon(category, label) {
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;
  const emoji = CATEGORY_EMOJI[category] ?? '📍';
  const inner = label != null
    ? `<span style="font-size:11px;font-weight:900;color:white;line-height:1">${label}</span>`
    : `<span style="font-size:13px;line-height:1">${emoji}</span>`;
  return L.divIcon({
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};border:2.5px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:pointer">${inner}</div>`,
    className: '',
    iconSize:    [30, 30],
    iconAnchor:  [15, 15],
    popupAnchor: [0, -18],
  });
}

// Auto-fit map to the given spots whenever they change
function FitBounds({ spots }) {
  const map = useMap();
  useEffect(() => {
    const coords = spots
      .filter(s => s.coordinates?.lat && s.coordinates?.lng)
      .map(s => [s.coordinates.lat, s.coordinates.lng]);
    if (coords.length === 0) return;
    if (coords.length === 1) { map.setView(coords[0], 14); return; }
    map.fitBounds(coords, { padding: [48, 48], maxZoom: 14 });
  }, [spots]);
  return null;
}

export default function MapView({ spots = [], route = [], onSpotClick, className = '' }) {
  const spotsWithCoords = spots.filter(s => s.coordinates?.lat && s.coordinates?.lng);

  // Default center: SE Asia if no spots
  const defaultCenter = [13.75, 100.5];
  const defaultZoom   = spotsWithCoords.length ? 5 : 6;

  const routeCoords = route
    .filter(s => s.coordinates?.lat && s.coordinates?.lng)
    .map(s => [s.coordinates.lat, s.coordinates.lng]);

  return (
    <div className={`rounded-[2rem] overflow-hidden border border-white/10 ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {/* Route polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: '#14b8a6', weight: 2.5, opacity: 0.7, dashArray: '6 4' }}
          />
        )}

        {/* Spot markers with clustering */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={cluster => L.divIcon({
            html: `<div style="width:36px;height:36px;border-radius:50%;background:#14b8a6;border:2.5px solid white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:white;box-shadow:0 2px 10px rgba(20,184,166,0.5)">${cluster.getChildCount()}</div>`,
            className: '',
            iconSize: [36, 36],
          })}
        >
          {spotsWithCoords.map((spot, i) => (
            <Marker
              key={spot.id}
              position={[spot.coordinates.lat, spot.coordinates.lng]}
              icon={createSpotIcon(spot.category, routeCoords.length > 1 ? i + 1 : null)}
              eventHandlers={{ click: () => onSpotClick?.(spot) }}
            >
              <Popup className="leaflet-popup-dark">
                <div style={{ minWidth: 160, fontFamily: 'inherit' }}>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#14b8a6', marginBottom: 4 }}>
                    {CATEGORY_EMOJI[spot.category]} {spot.category}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
                    {spot.name}
                  </p>
                  {spot.address && (
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{spot.address}</p>
                  )}
                  {spot.notes && (
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{spot.notes}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <FitBounds spots={spotsWithCoords} />
      </MapContainer>
    </div>
  );
}
