import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_city: string;
  user_state: string;
}

interface ReviewSectionProps {
  businessId: number;
  businessName: string;
  show: boolean;
  onClose: () => void;
}

export function ReviewSection({ businessId, businessName, show, onClose }: ReviewSectionProps) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState('0');
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [canReview, setCanReview] = useState(false);

  const isSeeker = user?.role === 'seeker';

  useEffect(() => {
    if (show) {
      loadReviews();
      if (isSeeker && token) {
        checkCanReview();
      }
    }
  }, [show, businessId]);

  const checkCanReview = async () => {
    try {
      const res = await fetch(`${API_BASE}/service-requests/can-review/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCanReview(data.canReview);
      }
    } catch {
      setCanReview(false);
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/${businessId}`);
      const data = await res.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch {
      console.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/reviews/${businessId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setRating(0);
        setComment('');
        loadReviews();
      }
    } catch {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="review-title">Reviews for {businessName}</h2>

        <div className="review-summary">
          <span className="review-avg">⭐ {averageRating}</span>
          <span className="review-count">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
        </div>

        {/* Review form - only for seekers who have used the service */}
        {isSeeker && canReview && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)"
              rows={3}
              className="review-textarea"
            />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="review-submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {!user && (
          <p className="review-login-hint">Login as a service seeker to leave a review.</p>
        )}

        {isSeeker && !canReview && (
          <p className="review-login-hint">You can leave a review after using this service. Request the service first.</p>
        )}

        {/* Reviews list */}
        <div className="reviews-list">
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-user">
                    <strong>{review.user_name}</strong>
                    {review.user_city && <span className="review-location">{review.user_city}, {review.user_state}</span>}
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
