import { Category } from '../types';

interface CategoryGridProps {
  parentCategories: Category[];
  subcategories: Category[];
  selectedParent: string | null;
  selectedSubcategory: string | null;
  onParentSelect: (slug: string | null) => void;
  onSubcategorySelect: (slug: string | null) => void;
}

export function CategoryGrid({
  parentCategories,
  subcategories,
  selectedParent,
  selectedSubcategory,
  onParentSelect,
  onSubcategorySelect,
}: CategoryGridProps) {
  return (
    <section className="category-section" aria-label="Business categories">
      <h2 className="section-title">Browse by Category</h2>

      {/* Parent Categories */}
      <div className="category-grid">
        <button
          className={`category-card ${selectedParent === null ? 'active' : ''}`}
          onClick={() => onParentSelect(null)}
          aria-pressed={selectedParent === null}
        >
          <span className="category-icon">📋</span>
          <span className="category-name">All Categories</span>
        </button>
        {parentCategories.map((category) => (
          <button
            key={category.id}
            className={`category-card ${selectedParent === category.slug ? 'active' : ''}`}
            onClick={() => onParentSelect(selectedParent === category.slug ? null : category.slug)}
            aria-pressed={selectedParent === category.slug}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            {category.business_count && parseInt(category.business_count) > 0 && (
              <span className="category-count">{category.business_count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Subcategories - shown when a parent is selected */}
      {selectedParent && subcategories.length > 0 && (
        <div className="subcategory-section">
          <h3 className="subcategory-title">
            {parentCategories.find((c) => c.slug === selectedParent)?.icon}{' '}
            {parentCategories.find((c) => c.slug === selectedParent)?.name}
          </h3>
          <div className="subcategory-grid">
            <button
              className={`subcategory-card ${selectedSubcategory === null ? 'active' : ''}`}
              onClick={() => onSubcategorySelect(null)}
              aria-pressed={selectedSubcategory === null}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                className={`subcategory-card ${selectedSubcategory === sub.slug ? 'active' : ''}`}
                onClick={() => onSubcategorySelect(selectedSubcategory === sub.slug ? null : sub.slug)}
                aria-pressed={selectedSubcategory === sub.slug}
              >
                <span>{sub.icon}</span> {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
