import { Business, PaginationInfo } from '../types';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  pagination: PaginationInfo | null;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function BusinessList({ businesses, pagination, loading, onPageChange }: BusinessListProps) {
  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <div className="loading-spinner"></div>
        <p>Loading businesses...</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <p className="empty-icon">🔍</p>
        <h3>No businesses found</h3>
        <p>Try changing your filters or search query</p>
      </div>
    );
  }

  return (
    <section className="business-section" aria-label="Business listings">
      <div className="business-list-header">
        <h2 className="section-title">
          Businesses {pagination && <span className="result-count">({pagination.total} results)</span>}
        </h2>
      </div>
      <div className="business-grid">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="pagination-button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="pagination-button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
