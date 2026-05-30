import { AustralianState, AUSTRALIAN_STATES } from '../types';

interface HeaderProps {
  selectedState: AustralianState;
  onStateChange: (state: AustralianState) => void;
}

export function Header({ selectedState, onStateChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1 className="header-title">🇳🇵 OzNepal</h1>
          <p className="header-subtitle">All Nepali Oz Businesses in One Place</p>
        </div>
        <div className="header-controls">
          <label htmlFor="state-select" className="state-label">
            State/Territory:
          </label>
          <select
            id="state-select"
            className="state-select"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value as AustralianState)}
            aria-label="Select Australian state or territory"
          >
            {AUSTRALIAN_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
