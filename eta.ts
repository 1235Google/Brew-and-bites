import { TrackingStage, SavedAddress } from '../types';

export interface EtaMetrics {
  etaMinutes: number;
  remainingSeconds: number;
  trafficState: 'clear' | 'moderate' | 'heavy';
  isStopped: boolean;
  riderState: string;
  statusText: string;
  distanceStr: string;
  displayEtaStr: string;
  liveCountdownStr: string;
}

export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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

export const getTotalDeliverySeconds = (
  demoMode: boolean,
  weatherDelayMinutes: number = 4,
  selectedAddress?: SavedAddress | null
): number => {
  if (demoMode) {
    return 120; // 2 minutes in demo mode
  }
  // Calculate geodesic distance
  const baseDistance = selectedAddress?.latitude && selectedAddress?.longitude 
    ? getDistanceKm(selectedAddress.latitude + 0.0068, selectedAddress.longitude - 0.0113, selectedAddress.latitude, selectedAddress.longitude)
    : 2.8;

  // ~8 minutes preparation + 6 minutes per km
  const travelDurationMinutes = Math.round(baseDistance * 6);
  const totalMinutes = 8 + travelDurationMinutes + weatherDelayMinutes;
  return totalMinutes * 60;
};

export const getStageLimits = (totalSeconds: number) => {
  return {
    limitAccepted: Math.round(totalSeconds * 0.04),
    limitPreparing: Math.round(totalSeconds * 0.12),
    limitPacked: Math.round(totalSeconds * 0.32),
    limitAssigned: Math.round(totalSeconds * 0.36),
    limitDelivery: Math.round(totalSeconds * 0.44),
    limitNearby: Math.round(totalSeconds * 0.92),
    limitDelivered: totalSeconds
  };
};

export const getTransitProgress = (
  elapsedSeconds: number,
  demoMode: boolean,
  selectedAddress?: SavedAddress | null
): number => {
  const totalSeconds = getTotalDeliverySeconds(demoMode, 4, selectedAddress);
  const limits = getStageLimits(totalSeconds);
  if (elapsedSeconds < limits.limitDelivery) return 0;
  if (elapsedSeconds >= limits.limitDelivered) return 1;
  return (elapsedSeconds - limits.limitDelivery) / (limits.limitDelivered - limits.limitDelivery);
};

export const getRiderStateAtProgress = (p: number) => {
  if (p <= 0) return 'preparing';
  if (p >= 1) return 'delivered';
  // Stopped at traffic light 1
  if (p >= 0.15 && p <= 0.22) return 'stopped-light-1';
  // Stopped at traffic light 2
  if (p >= 0.62 && p <= 0.68) return 'stopped-light-2';
  // Near turns (slowing down)
  if ((p >= 0.40 && p <= 0.46) || (p >= 0.82 && p <= 0.88)) return 'slowing';
  return 'moving';
};

// Deterministic traffic state based on elapsedSeconds
export const getDeterministicTrafficState = (elapsedSeconds: number, demoMode: boolean): 'clear' | 'moderate' | 'heavy' => {
  const blockSize = demoMode ? 8 : 45; // Traffic state changes periodically
  const block = Math.floor(elapsedSeconds / blockSize);
  const states: ('clear' | 'moderate' | 'heavy')[] = ['clear', 'moderate', 'clear', 'heavy', 'moderate', 'clear'];
  return states[block % states.length];
};

export const getEtaMetrics = (
  elapsedSeconds: number,
  demoMode: boolean,
  currentStage: TrackingStage,
  weatherDelayMinutes: number,
  selectedAddress?: SavedAddress | null
): EtaMetrics => {
  const totalSeconds = getTotalDeliverySeconds(demoMode, weatherDelayMinutes, selectedAddress);
  const limits = getStageLimits(totalSeconds);

  // If stage is already delivered, return terminal metrics instantly
  if (currentStage === TrackingStage.DELIVERED || elapsedSeconds >= totalSeconds) {
    return {
      etaMinutes: 0,
      remainingSeconds: 0,
      trafficState: 'clear',
      isStopped: false,
      riderState: 'delivered',
      statusText: 'Delivered Successfully! 🏡',
      distanceStr: 'Arriving',
      displayEtaStr: 'Delivered',
      liveCountdownStr: '0:00'
    };
  }

  // Calculate remaining seconds
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  // remainingMinutes = ceil(remainingSeconds / 60)
  const etaMinutes = Math.max(1, Math.ceil(remainingSeconds / 60));

  // Display ETA string
  const displayEtaStr = `${etaMinutes} min`;

  // Live countdown string
  const liveMins = Math.floor(remainingSeconds / 60);
  const liveSecs = remainingSeconds % 60;
  const liveCountdownStr = `${liveMins}:${liveSecs < 10 ? '0' + liveSecs : liveSecs}`;

  // Traffic State
  const trafficState = getDeterministicTrafficState(elapsedSeconds, demoMode);

  // Transit Progress
  const currentP = getTransitProgress(elapsedSeconds, demoMode, selectedAddress);
  const riderState = getRiderStateAtProgress(currentP);
  const isStopped = riderState.startsWith('stopped-');

  // Status text examples
  let statusText = 'Preparing your fresh food...';
  if (currentStage === TrackingStage.PLACED) statusText = 'Leaving Brew & Bites Café';
  else if (currentStage === TrackingStage.ACCEPTED) statusText = 'Preparing Brew & Bites ingredients';
  else if (currentStage === TrackingStage.PREPARING) statusText = 'Cooking at Brew & Bites Café';
  else if (currentStage === TrackingStage.PACKED) statusText = 'Packing your order';
  else if (currentStage === TrackingStage.ASSIGNED) statusText = 'Assigning Courier...';
  else if (currentStage === TrackingStage.OUT_FOR_DELIVERY || currentStage === TrackingStage.NEARBY) {
    if (riderState === 'stopped-light-1') {
      statusText = 'Waiting at Park Road Traffic Light 🔴';
    } else if (riderState === 'stopped-light-2') {
      statusText = 'Stopped at Roundabout Light 🔴';
    } else if (currentP < 0.15) {
      statusText = 'Leaving Brew & Bites Café';
    } else if (currentP < 0.35) {
      statusText = 'Crossing Park Road';
    } else if (currentP < 0.50) {
      statusText = 'Near City Mall';
    } else if (currentP < 0.62) {
      statusText = 'Crossing River Bridge';
    } else if (currentP < 0.72) {
      statusText = 'Entering Green Avenue';
    } else if (currentP < 0.85) {
      statusText = 'Approaching Your Area';
    } else if (remainingSeconds > 45) {
      statusText = '600 m Away';
    } else if (remainingSeconds > 15) {
      statusText = '250 m Away';
    } else {
      statusText = 'Arriving';
    }
  }

  // Distance tracking
  const baseDistance = selectedAddress?.latitude && selectedAddress?.longitude 
    ? getDistanceKm(selectedAddress.latitude + 0.0068, selectedAddress.longitude - 0.0113, selectedAddress.latitude, selectedAddress.longitude)
    : 2.8;
  const remainingKm = baseDistance * (1 - currentP);
  let distanceStr = '2.8 km';
  if (remainingKm <= 0.05 || remainingSeconds < 10) {
    distanceStr = 'Arriving';
  } else if (remainingKm <= 0.25 || remainingSeconds < 30) {
    distanceStr = `${Math.round(remainingKm * 1000)} m`;
  } else if (remainingKm < 1.0) {
    distanceStr = `${Math.round(remainingKm * 1000)} m`;
  } else {
    distanceStr = `${remainingKm.toFixed(1)} km`;
  }

  return {
    etaMinutes,
    remainingSeconds,
    trafficState,
    isStopped,
    riderState,
    statusText,
    distanceStr,
    displayEtaStr,
    liveCountdownStr
  };
};
