import { useState } from 'react';

interface LocationFilterProps {
  locationEnabled: boolean;
  radius: number;
  onLocationToggle: (enabled: boolean, lat?: number, lng?: number) => void;
  onRadiusChange: (radius: number) => void;
}

const RADIUS_OPTIONS = [5, 10, 20, 30, 50, 100];

export function LocationFilter({ locationEnabled, radius, onLocationToggle, onRadiusChange }: LocationFilterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    if (locationEnabled) {
      onLocationToggle(false);
      setError(null);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocationToggle(true, position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable it in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <div className="location-filter">
      <div className="location-toggle-row">
        <button
          className={`location-toggle ${locationEnabled ? 'active' : ''}`}
          onClick={handleToggle}
          disabled={loading}
          aria-pressed={locationEnabled}
        >
          {loading ? (
            <span>📍 Getting location...</span>
          ) : locationEnabled ? (
            <span>📍 Nearby Mode ON</span>
          ) : (
            <span>📍 Find Near Me</span>
          )}
        </button>

        {locationEnabled && (
          <div className="radius-selector">
            <label htmlFor="radius-select">Radius:</label>
            <select
              id="radius-select"
              value={radius}
              onChange={(e) => onRadiusChange(parseInt(e.target.value))}
              aria-label="Select search radius"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p className="location-error">{error}</p>}
    </div>
  );
}
