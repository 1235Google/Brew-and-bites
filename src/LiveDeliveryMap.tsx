import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Compass, Navigation, Store, Home, ShieldCheck, ZoomIn, ZoomOut, Target, Sun, Moon, AlertTriangle } from 'lucide-react';
import { TrackingStage, SavedAddress } from '../types';
import { getEtaMetrics, getTotalDeliverySeconds, getStageLimits } from '../utils/eta';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveDeliveryMapProps {
  currentStage: TrackingStage;
  isDarkMode: boolean;
  demoMode: boolean;
  elapsedSeconds: number;
  selectedAddress: SavedAddress | null;
}

// Timeline steps simulating actual traffic delays, stop lights, and turns
interface TimelineStep {
  t: number;        // Linear progress (0 to 1)
  f: number;        // Distance fraction (0 to 1) along path
  status: string;   // Human status
  state: 'accelerating' | 'moving' | 'slowing' | 'stopped' | 'arrived';
}

const TIMELINE_STEPS: TimelineStep[] = [
  { t: 0, f: 0, status: 'Leaving Brew & Bites Café', state: 'accelerating' },
  { t: 0.08, f: 0.08, status: 'Leaving Brew & Bites Café', state: 'moving' },
  { t: 0.15, f: 0.18, status: 'Waiting at Park Road Traffic Light 🔴', state: 'stopped' },
  { t: 0.22, f: 0.18, status: 'Waiting at Park Road Traffic Light 🔴', state: 'stopped' },
  { t: 0.25, f: 0.22, status: 'Crossing Park Road Expressway', state: 'accelerating' },
  { t: 0.35, f: 0.40, status: 'Cruising near City Mall', state: 'moving' },
  { t: 0.42, f: 0.52, status: 'Slowing for Lavender Boulevard Turn', state: 'slowing' },
  { t: 0.46, f: 0.55, status: 'Entering Lavender Boulevard', state: 'moving' },
  { t: 0.55, f: 0.70, status: 'Approaching Sector 4 Roundabout', state: 'moving' },
  { t: 0.62, f: 0.78, status: 'Stopped at Roundabout Light 🔴', state: 'stopped' },
  { t: 0.68, f: 0.78, status: 'Stopped at Roundabout Light 🔴', state: 'stopped' },
  { t: 0.72, f: 0.82, status: 'Navigating Sector 4 Roundabout 🟢', state: 'accelerating' },
  { t: 0.80, f: 0.90, status: 'Entering Green Avenue residential gates', state: 'moving' },
  { t: 0.84, f: 0.93, status: 'Slowing for Maple Avenue turn', state: 'slowing' },
  { t: 0.88, f: 0.95, status: 'Approaching destination (600 m away)', state: 'moving' },
  { t: 0.92, f: 0.97, status: 'Entering Apartment Lane (250 m away)', state: 'moving' },
  { t: 0.96, f: 0.99, status: 'Arriving outside lobby entrance', state: 'slowing' },
  { t: 1.0, f: 1.0, status: 'Delivered Successfully! 🏡', state: 'arrived' }
];

// Helper to calculate geodesic distance in meters (Haversine Formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to compute bearing angle (0 deg = East, -90 = North, 90 = South, 180 = West)
function getBearingAngle(p1: [number, number], p2: [number, number]): number {
  const lat1 = p1[0], lng1 = p1[1];
  const lat2 = p2[0], lng2 = p2[1];
  const dy = lat2 - lat1;
  const dx = lng2 - lng1;
  return Math.atan2(-dy, dx) * 180 / Math.PI; // Invert dy so North is -90, South is 90
}

const getRouteWaypoints = (selectedAddress: SavedAddress | null, geocodedCoords: [number, number] | null): [number, number][] => {
  const destLat = geocodedCoords ? geocodedCoords[0] : (selectedAddress?.latitude || 20.3558);
  const destLng = geocodedCoords ? geocodedCoords[1] : (selectedAddress?.longitude || 85.8155);
  
  // Restaurant offset, e.g., 0.0068 degrees latitude and 0.0113 degrees longitude
  const restLat = destLat + 0.0068;
  const restLng = destLng - 0.0113;

  return [
    [restLat, restLng], // Restaurant: Brew & Bites Café
    [restLat, restLng + 0.0035], // Turn 1
    [restLat - 0.0030, restLng + 0.0035], // Turn 2
    [restLat - 0.0030, restLng + 0.0085], // Turn 3
    [restLat - 0.0052, restLng + 0.0085], // Turn 4
    [destLat, destLng] // Selected Destination
  ];
};

export const LiveDeliveryMap: React.FC<LiveDeliveryMapProps> = ({
  currentStage,
  isDarkMode,
  demoMode,
  elapsedSeconds,
  selectedAddress
}) => {
  const [geocodedCoords, setGeocodedCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!selectedAddress) {
      setGeocodedCoords(null);
      return;
    }

    const isMjWoods = 
      selectedAddress.houseNumber?.toLowerCase().includes('mj woods') ||
      selectedAddress.name?.toLowerCase().includes('mj woods') ||
      selectedAddress.street?.toLowerCase().includes('natwar') ||
      selectedAddress.area?.toLowerCase().includes('andharua') ||
      selectedAddress.pincode === '751029';

    let isMounted = true;
    
    const fetchCoords = async () => {
      try {
        if (isMjWoods) {
          // 1. Try primary query
          const primaryQuery = 'MJ Woods, Natwar Vatika, Near Ganesh Institute of Management Studies (GIMS), Andharua, Jagannathprasad, Bhubaneswar, Odisha 751029, India';
          const primaryUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(primaryQuery)}`;
          
          try {
            const res = await fetch(primaryUrl, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'BrewBitesApp/1.0 (souvikdashbbsr@gmail.com)'
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                if (isMounted) {
                  setGeocodedCoords([lat, lon]);
                  return;
                }
              }
            }
          } catch (e) {
            console.warn('Primary MJ Woods query failed, trying fallback landmark...', e);
          }

          // 2. Try fallback query (Landmark)
          const fallbackQuery = 'Ganesh Institute of Management Studies (GIMS), Andharua, Jagannathprasad, Bhubaneswar, Odisha 751029';
          const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fallbackQuery)}`;
          
          try {
            const res = await fetch(fallbackUrl, {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'BrewBitesApp/1.0 (souvikdashbbsr@gmail.com)'
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                if (isMounted) {
                  setGeocodedCoords([lat, lon]);
                  return;
                }
              }
            }
          } catch (e) {
            console.warn('Fallback GIMS query failed, using hardcoded high-fidelity coordinates...', e);
          }

          // 3. Fallback to exact coordinates if Nominatim failed to resolve both
          if (isMounted) {
            setGeocodedCoords([20.3164, 85.7355]);
          }
          return;
        }

        const addressString = `${selectedAddress.houseNumber ? selectedAddress.houseNumber + ', ' : ''}${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.city === 'Odisha' ? '' : selectedAddress.city + ', '}India`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addressString)}`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BrewBitesApp/1.0 (souvikdashbbsr@gmail.com)'
          }
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (isMounted) {
            setGeocodedCoords([lat, lon]);
          }
        } else {
          const broaderString = `${selectedAddress.area}, ${selectedAddress.city}, India`;
          const urlBroader = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(broaderString)}`;
          const resB = await fetch(urlBroader, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'BrewBitesApp/1.0 (souvikdashbbsr@gmail.com)'
            }
          });
          const dataB = await resB.json();
          if (dataB && dataB.length > 0) {
            const lat = parseFloat(dataB[0].lat);
            const lon = parseFloat(dataB[0].lon);
            if (isMounted) {
              setGeocodedCoords([lat, lon]);
            }
          }
        }
      } catch (err) {
        console.error('Nominatim geocoding failed:', err);
      }
    };

    fetchCoords();

    return () => {
      isMounted = false;
    };
  }, [selectedAddress]);

  // Compute dynamic waypoints
  const waypoints = useMemo(() => getRouteWaypoints(selectedAddress, geocodedCoords), [selectedAddress, geocodedCoords]);

  const { cumulativeDistances, totalRouteDistance } = useMemo(() => {
    const cumD: number[] = [0];
    let totalD = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const d = getDistance(
        waypoints[i][0], waypoints[i][1],
        waypoints[i + 1][0], waypoints[i + 1][1]
      );
      totalD += d;
      cumD.push(totalD);
    }
    return { cumulativeDistances: cumD, totalRouteDistance: totalD };
  }, [waypoints]);

  // Map and Markers references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const basePolylineRef = useRef<L.Polyline | null>(null);
  const activePolylineRef = useRef<L.Polyline | null>(null);
  const activeGlowPolylineRef = useRef<L.Polyline | null>(null);
  
  const restaurantMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);

  // States
  const [progress, setProgress] = useState(0); // Linear transit progress: 0 to 1
  const [trafficState, setTrafficState] = useState<'clear' | 'moderate' | 'heavy'>('clear');
  const [mapDarkMode, setMapDarkMode] = useState<boolean>(isDarkMode);
  const [isLocating, setIsLocating] = useState(false);

  // Synchronize map dark mode state with app's general theme
  useEffect(() => {
    setMapDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Periodic automatic updates to simulated traffic conditions
  useEffect(() => {
    if (currentStage === TrackingStage.DELIVERED) return;
    const interval = setInterval(() => {
      const states: ('clear' | 'moderate' | 'heavy')[] = ['clear', 'moderate', 'heavy'];
      const randomState = states[Math.floor(Math.random() * states.length)];
      setTrafficState(randomState);
    }, 12000);
    return () => clearInterval(interval);
  }, [currentStage]);

  // Interpolate simulated timeline metrics (stops, turns, etc.)
  const timeline = (() => {
    if (progress <= 0) return TIMELINE_STEPS[0];
    if (progress >= 1) return TIMELINE_STEPS[TIMELINE_STEPS.length - 1];

    for (let i = 0; i < TIMELINE_STEPS.length - 1; i++) {
      const stepA = TIMELINE_STEPS[i];
      const stepB = TIMELINE_STEPS[i + 1];
      if (progress >= stepA.t && progress <= stepB.t) {
        const ratio = (progress - stepA.t) / (stepB.t - stepA.t);
        const f = stepA.f + (stepB.f - stepA.f) * ratio;
        return {
          t: progress,
          f,
          status: stepA.status,
          state: stepA.state
        };
      }
    }
    return TIMELINE_STEPS[TIMELINE_STEPS.length - 1];
  })();

  // Find exact coordinate [lat, lng] and rotation angle for any distance fraction f
  const getPointAtDistanceFraction = (f: number): { coords: [number, number]; angle: number } => {
    const targetD = f * totalRouteDistance;

    if (targetD <= 0) {
      return { coords: waypoints[0], angle: getBearingAngle(waypoints[0], waypoints[1]) };
    }
    if (targetD >= totalRouteDistance) {
      return { coords: waypoints[waypoints.length - 1], angle: getBearingAngle(waypoints[waypoints.length - 2], waypoints[waypoints.length - 1]) };
    }

    // Find active polyline segment
    for (let i = 0; i < waypoints.length - 1; i++) {
      const startD = cumulativeDistances[i];
      const endD = cumulativeDistances[i + 1];
      if (targetD >= startD && targetD <= endD) {
        const ratio = (targetD - startD) / (endD - startD);
        const startNode = waypoints[i];
        const endNode = waypoints[i + 1];
        
        const lat = startNode[0] + (endNode[0] - startNode[0]) * ratio;
        const lng = startNode[1] + (endNode[1] - startNode[1]) * ratio;
        const angle = getBearingAngle(startNode, endNode);
        return { coords: [lat, lng], angle };
      }
    }
    return { coords: waypoints[waypoints.length - 1], angle: 0 };
  };

  const currentRiderPoint = getPointAtDistanceFraction(timeline.f);

  // Dynamic status descriptor depending on current stage or progress
  const getCurrentStreetName = () => {
    if (currentStage === TrackingStage.DELIVERED) {
      return 'Delivered Successfully! 🏡';
    }
    if (progress === 0) {
      switch (currentStage) {
        case TrackingStage.PLACED:
          return 'Transmitting culinary specifications...';
        case TrackingStage.ACCEPTED:
          return 'Brew & Bites queued your recipe!';
        case TrackingStage.PREPARING:
          return 'Baristas brewing fresh delicacies... 👨‍🍳';
        case TrackingStage.PACKED:
          return 'Order beautifully sealed inside lockbox 📦';
        case TrackingStage.ASSIGNED:
          return 'Rahul Sharma is verifying token custody...';
        default:
          return 'Resting at Brew & Bites Café';
      }
    }
    return timeline.status;
  };

  // Dynamic ETA & Distance calculators matching user specs
  const etaMetrics = getEtaMetrics(elapsedSeconds, demoMode, currentStage, 4, selectedAddress);

  const simulatedEta = etaMetrics.etaMinutes;
  const simulatedDistance = etaMetrics.distanceStr;
  const displayEtaStr = etaMetrics.displayEtaStr;

  // Create Rider dynamic HTML Icon structure
  const createRiderIcon = (angle: number) => {
    return L.divIcon({
      className: 'custom-rider-div-icon',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 transform transition-transform duration-100" style="transform: rotate(${angle}deg);">
          <div class="absolute -inset-1.5 bg-indigo-500/30 rounded-xl animate-pulse"></div>
          <div class="w-9 h-9 rounded-xl bg-white border-2 border-indigo-500 shadow-lg flex items-center justify-center text-lg relative z-10">
            🛵
          </div>
          <div class="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-[6px] font-black text-white px-0.5 rounded-full leading-none shadow-xs border border-white z-20">
            ▲
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  // Generate popup HTML block for Rahul Sharma
  const getRiderPopupContent = (etaStr: string, distance: string, traffic: string) => {
    const trafficBadge = traffic === 'heavy' 
      ? '<span class="text-[8px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">🔴 Heavy</span>'
      : traffic === 'moderate'
        ? '<span class="text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">🟡 Moderate</span>'
        : '<span class="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">🟢 Clear</span>';

    return `
      <div class="text-left font-sans text-xs space-y-1.5 p-1 min-w-[170px]">
        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span class="font-black text-[9px] text-indigo-400 uppercase tracking-widest">Delivery Partner</span>
          <span class="text-[9px] font-black text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/15">★ 4.9</span>
        </div>
        <div class="font-extrabold text-white text-sm">Rahul Sharma</div>
        <div class="text-[10px] text-gray-300">Honda Activa EV Scooter</div>
        <div class="text-[9px] font-mono text-indigo-300 font-extrabold uppercase">KA-05-AB-4587</div>
        
        <div class="flex items-center justify-between pt-1">
          <span class="text-[8px] text-gray-400 uppercase tracking-wider">Road Traffic:</span>
          ${trafficBadge}
        </div>

        <div class="grid grid-cols-2 gap-2 border-t border-white/10 pt-1.5 mt-1.5">
          <div>
            <span class="text-[8px] text-gray-400 block uppercase tracking-wider">ETA</span>
            <span class="font-black text-white text-xs block">${currentStage === TrackingStage.DELIVERED ? 'Arrived' : etaStr}</span>
          </div>
          <div>
            <span class="text-[8px] text-gray-400 block uppercase tracking-wider">Distance</span>
            <span class="font-black text-indigo-400 text-xs block">${distance}</span>
          </div>
        </div>
      </div>
    `;
  };

  // 3. Setup and synchronize linear animation loop based on elapsed order seconds
  useEffect(() => {
    let animationFrameId: number;

    if (currentStage === TrackingStage.OUT_FOR_DELIVERY || currentStage === TrackingStage.NEARBY) {
      const totalSeconds = getTotalDeliverySeconds(demoMode, 4, selectedAddress);
      const limits = getStageLimits(totalSeconds);
      const transitStartSec = limits.limitDelivery;
      const transitEndSec = limits.limitDelivered;
      const totalTransitSec = transitEndSec - transitStartSec;
      
      const initialFraction = Math.min(1, Math.max(0, (elapsedSeconds - transitStartSec) / totalTransitSec));
      const durationMs = totalTransitSec * 1000;
      const targetElapsedMs = initialFraction * durationMs;
      
      const animationStart = performance.now() - targetElapsedMs;
      
      const updateLoop = (timestamp: number) => {
        const elapsed = timestamp - animationStart;
        const currentProgress = Math.min(elapsed / durationMs, 1);
        
        setProgress(currentProgress);
        
        if (currentProgress < 1 && (currentStage === TrackingStage.OUT_FOR_DELIVERY || currentStage === TrackingStage.NEARBY)) {
          animationFrameId = requestAnimationFrame(updateLoop);
        }
      };
      
      animationFrameId = requestAnimationFrame(updateLoop);
    } else if (
      currentStage === TrackingStage.PLACED ||
      currentStage === TrackingStage.ACCEPTED ||
      currentStage === TrackingStage.PREPARING ||
      currentStage === TrackingStage.PACKED ||
      currentStage === TrackingStage.ASSIGNED
    ) {
      setProgress(0);
    } else if (currentStage === TrackingStage.DELIVERED) {
      setProgress(1);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [currentStage, demoMode, elapsedSeconds, selectedAddress]);

  // 4. Instantiate Leaflet map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // Turn off default Leaflet grey controls
      attributionControl: false,
      scrollWheelZoom: true,
      fadeAnimation: true
    }).setView(waypoints[waypoints.length - 1], 14.5);

    mapRef.current = map;

    // Inject OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Build the underlying complete path polyline (represented as light grey / slate)
    const basePolyline = L.polyline(waypoints, {
      color: mapDarkMode ? '#334155' : '#cbd5e1',
      weight: 6,
      opacity: 0.85,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);
    basePolylineRef.current = basePolyline;

    // Build active neon-green polyline path with bottom glow effect
    const activeGlowPolyline = L.polyline([], {
      color: '#34d399',
      weight: 10,
      opacity: 0.35,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);
    activeGlowPolylineRef.current = activeGlowPolyline;

    const activePolyline = L.polyline([], {
      color: '#10b981',
      weight: 5.5,
      opacity: 0.95,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);
    activePolylineRef.current = activePolyline;

    // Add Restaurant Node with custom HTML Pin and beautiful popup
    const restIcon = L.divIcon({
      className: 'custom-rest-icon',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute -inset-1.5 bg-indigo-500/20 rounded-xl animate-ping"></div>
          <div class="w-9 h-9 rounded-xl bg-indigo-600 border-2 border-white flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-110">
            🏪
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    const restMarker = L.marker(waypoints[0], { icon: restIcon })
      .bindPopup(`
        <div class="p-1 font-sans text-xs text-center space-y-1">
          <div class="font-extrabold text-white text-sm">Brew & Bites Café</div>
          <div class="text-[10px] text-indigo-300 uppercase tracking-widest font-black">🏪 Kitchen Counter</div>
          <div class="text-[10px] text-gray-300 pt-1">${currentStage === TrackingStage.PREPARING ? 'Preparing Fresh Food' : 'Order Handed Over'}</div>
        </div>
      `, { className: 'custom-leaflet-popup', closeButton: false })
      .addTo(map);
    restaurantMarkerRef.current = restMarker;

    // Add Destination Node with custom HTML pin
    const destIcon = L.divIcon({
      className: 'custom-dest-icon',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute -inset-1.5 bg-emerald-500/20 rounded-xl animate-pulse"></div>
          <div class="w-9 h-9 rounded-xl bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-110">
            🏡
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    const destMarker = L.marker(waypoints[waypoints.length - 1], { icon: destIcon })
      .bindPopup(`
        <div class="p-1 font-sans text-xs text-center space-y-1">
          <div class="font-extrabold text-white text-sm">Delivery Address</div>
          <div class="text-[10px] text-emerald-400 uppercase tracking-widest font-black">🏡 Customer Location</div>
          <div class="text-[10px] text-gray-300 pt-1">${selectedAddress?.houseNumber || 'HSR Heights'}, ${selectedAddress?.street || 'Apartment 405'}</div>
        </div>
      `, { className: 'custom-leaflet-popup', closeButton: false })
      .addTo(map);
    destinationMarkerRef.current = destMarker;

    // Create Initial Rider Marker
    const riderMarker = L.marker(waypoints[0], { icon: createRiderIcon(0) })
      .bindPopup(getRiderPopupContent('25 mins', '2.8 km', 'clear'), { className: 'custom-leaflet-popup', closeButton: false })
      .addTo(map);
    riderMarkerRef.current = riderMarker;

    // Fit route bounds elegantly on start
    map.fitBounds(basePolyline.getBounds(), { padding: [40, 40] });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 4b. React and animate Map beautifully when selectedAddress / waypoints update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update base polyline with new path
    if (basePolylineRef.current) {
      basePolylineRef.current.setLatLngs(waypoints);
    }

    // Move restaurant and destination markers
    if (restaurantMarkerRef.current) {
      restaurantMarkerRef.current.setLatLng(waypoints[0]);
    }

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setLatLng(waypoints[waypoints.length - 1]);
      destinationMarkerRef.current.setPopupContent(`
        <div class="p-1 font-sans text-xs text-center space-y-1">
          <div class="font-extrabold text-white text-sm">Delivery Address</div>
          <div class="text-[10px] text-emerald-400 uppercase tracking-widest font-black">🏡 Customer Location</div>
          <div class="text-[10px] text-gray-300 pt-1">${selectedAddress?.houseNumber || 'HSR Heights'}, ${selectedAddress?.street || 'Apartment 405'}</div>
        </div>
      `);
    }

    // Reset rider marker to start if progress is zero
    if (riderMarkerRef.current && progress === 0) {
      riderMarkerRef.current.setLatLng(waypoints[0]);
    }

    // Fly smoothly to the new location (zoom 18)
    map.flyTo(waypoints[waypoints.length - 1], 18, {
      animate: true,
      duration: 1.8
    });
  }, [waypoints, selectedAddress]);

  // 5. React to progress, theme, and traffic changes to keep Map layers in absolute sync
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Keep base polyline color adjusted to dark theme
    if (basePolylineRef.current) {
      basePolylineRef.current.setStyle({
        color: mapDarkMode ? '#334155' : '#cbd5e1'
      });
    }

    // Slice coordinates to construct the active neon path
    const activeCoords: [number, number][] = [];
    activeCoords.push(waypoints[0]); // Starts at restaurant

    const targetD = timeline.f * totalRouteDistance;

    // Append all fully traversed nodes
    for (let i = 1; i < waypoints.length; i++) {
      if (cumulativeDistances[i] < targetD) {
        activeCoords.push(waypoints[i]);
      } else {
        break;
      }
    }

    // Finally append the exact current interpolated rider position
    activeCoords.push(currentRiderPoint.coords);

    // Update active polylines
    if (activePolylineRef.current) {
      activePolylineRef.current.setLatLngs(activeCoords);
    }
    if (activeGlowPolylineRef.current) {
      activeGlowPolylineRef.current.setLatLngs(activeCoords);
    }

    // Move Rider and rotate orientation
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(currentRiderPoint.coords);
      riderMarkerRef.current.setIcon(createRiderIcon(currentRiderPoint.angle));
      
      // Keep popup content updated in real-time
      riderMarkerRef.current.setPopupContent(
        getRiderPopupContent(displayEtaStr, simulatedDistance, trafficState)
      );
    }

    // Automatically follow rider if they are in transit
    if (currentStage === TrackingStage.OUT_FOR_DELIVERY && !isLocating) {
      map.panTo(currentRiderPoint.coords, { animate: true, duration: 0.5 });
    }
  }, [timeline.f, mapDarkMode, trafficState, currentStage, displayEtaStr, simulatedDistance, waypoints, cumulativeDistances, totalRouteDistance]);

  // 6. Action Handlers for Custom Controls
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleCenterMap = () => {
    if (mapRef.current && basePolylineRef.current) {
      mapRef.current.fitBounds(basePolylineRef.current.getBounds(), {
        padding: [40, 40],
        animate: true,
        duration: 0.8
      });
    }
  };

  const handleLocateMe = () => {
    if (!mapRef.current) return;
    setIsLocating(true);
    
    // Zoom in on Customer Location
    mapRef.current.setView(waypoints[waypoints.length - 1], 17, {
      animate: true,
      duration: 1
    });

    // Flash/pulse highlight
    setTimeout(() => {
      setIsLocating(false);
      destinationMarkerRef.current?.openPopup();
    }, 1100);
  };

  const toggleLocalDarkMode = () => {
    setMapDarkMode(prev => !prev);
  };

  return (
    <div className={`glass-panel rounded-[32px] p-6 text-left border relative overflow-hidden transition-all duration-500 ${
      isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
    }`} id="live-tracking-map-container">
      
      {/* Dynamic CSS Overrides for Premium Glassmorphic Leaflet Popups */}
      <style>{`
        /* custom container dimensions */
        #leaflet-delivery-map {
          background: ${mapDarkMode ? '#0f172a' : '#f1f5f9'} !important;
          transition: background 0.5s ease;
        }

        /* Ultimate Premium midnight dark tiles filter */
        .map-dark-theme .leaflet-tile-container {
          filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%);
        }

        /* Glassmorphic Popup Style */
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.88) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: white !important;
          border-radius: 16px !important;
          padding: 6px 10px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4) !important;
        }

        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.88) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        .custom-leaflet-popup .leaflet-popup-content {
          margin: 4px !important;
          line-height: 1.4 !important;
        }

        .leaflet-popup {
          margin-bottom: 24px !important;
        }
      `}</style>

      {/* Map Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-500 animate-spin-slow shrink-0" />
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">OSM Live Smart Navigation</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
          isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Continuous Vector Route</span>
        </div>
      </div>

      {/* Map stage & Map control layers */}
      <div className="relative w-full rounded-[24px] overflow-hidden border border-white/20 shadow-2xl">
        
        {/* LEAFLET CONTAINER */}
        <div 
          ref={mapContainerRef}
          id="leaflet-delivery-map" 
          className={`w-full h-[300px] sm:h-[350px] relative ${mapDarkMode ? 'map-dark-theme' : ''}`}
        />

        {/* CUSTOM TOP-RIGHT BUTTONS: ZOOM CONTROL */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-gray-900 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-gray-900 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* CUSTOM BOTTOM-RIGHT BUTTONS: LOCATION & RECENTER */}
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col sm:flex-row gap-2">
          {/* Map dark/light toggle */}
          <button
            onClick={toggleLocalDarkMode}
            className="w-9 h-9 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-gray-900 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Toggle Map Dark Mode"
          >
            {mapDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-400" />}
          </button>

          {/* Recenter Map */}
          <button
            onClick={handleCenterMap}
            className="px-3 h-9 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-900 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Recenter Complete Route"
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-400 rotate-45" />
            <span className="hidden xs:inline">Fit Route</span>
          </button>

          {/* Locate Me (Simulated) */}
          <button
            onClick={handleLocateMe}
            className="px-3 h-9 rounded-xl bg-indigo-600/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 shadow-md transition-all active:scale-90 cursor-pointer"
            title="Focus On My Apartment"
          >
            <Target className={`w-3.5 h-3.5 text-white ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Locate Me</span>
          </button>
        </div>

      </div>

      {/* Map status summary */}
      <div className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'
      }`}>
        <div className="space-y-0.5">
          <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest">Rider Location Status</span>
          <span className="text-xs font-bold block transition-all text-gray-800 dark:text-gray-100" id="driver-street-label">
            {getCurrentStreetName()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div>
            <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest">Remaining Dist.</span>
            <span className="text-xs font-mono font-black text-indigo-500 block">
              {simulatedDistance}
            </span>
          </div>
          <div className="text-right sm:text-left">
            <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest font-sans">ETA</span>
            <span className="text-xs font-black text-amber-500 block">
              {currentStage === TrackingStage.DELIVERED ? 'Delivered' : `${simulatedEta} mins`}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
