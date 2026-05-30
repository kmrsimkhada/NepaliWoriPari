import { useState, useEffect } from 'react';
import { Category, AUSTRALIAN_STATES } from '../types';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

interface RegisterBusinessProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterBusiness({ show, onClose, onSuccess }: RegisterBusinessProps) {
  const { token } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [state, setState] = useState('QLD');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (show) {
      // Fetch all subcategories (grouped by parent) for the dropdown
      fetch(`${API_BASE}/categories/all-subcategories`)
        .then((res) => res.json())
        .then((data: Category[]) => {
          setCategories(data);
        })
        .catch(() => setCategories([]));
    }
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, phone, email, categoryId: parseInt(categoryId), state, city, description, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setName('');
    setPhone('');
    setEmail('');
    setCategoryId('');
    setState('QLD');
    setCity('');
    setDescription('');
    setWebsite('');
    setError('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">✕</button>

        {step === 'form' && (
          <>
            <h2 className="modal-title">📋 List Your Business</h2>
            <p className="modal-subtitle">Add your business to NepaliWoriPari directory</p>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="reg-name">Business Name *</label>
                <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Himalayan Kitchen" />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">Phone Number *</label>
                <input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="04XX XXX XXX" />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="reg-category">Category *</label>
                <select id="reg-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {(cat as Category & { parent_name?: string }).parent_name ? `${(cat as Category & { parent_name?: string }).parent_name} → ` : ''}{cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-state">State *</label>
                  <select id="reg-state" value={state} onChange={(e) => setState(e.target.value)} required>
                    {AUSTRALIAN_STATES.filter((s) => s.value !== 'ALL').map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-city">City/Suburb *</label>
                  <input id="reg-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Brisbane" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-desc">Description</label>
                <textarea id="reg-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your business" rows={3} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-website">Website (optional)</label>
                <input id="reg-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.example.com" />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Business'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="register-success">
            <span className="success-icon">✅</span>
            <h2>Business Registered!</h2>
            <p>Your business has been added to NepaliWoriPari. Thank you!</p>
          </div>
        )}
      </div>
    </div>
  );
}
