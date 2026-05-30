import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryGrid } from './components/CategoryGrid';
import { BusinessList } from './components/BusinessList';
import { LocationFilter } from './components/LocationFilter';
import { RegisterBusiness } from './components/RegisterBusiness';
import { fetchCategoryStats, fetchSubcategories, fetchBusinesses, fetchNearbyBusinesses } from './api';
import { AustralianState, Business, Category, PaginationInfo } from './types';

function App() {
  const [selectedState, setSelectedState] = useState<AustralianState>('ALL');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Location state
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(10);
  const [showRegister, setShowRegister] = useState(false);

  // Fetch parent categories with business counts
  const loadParentCategories = useCallback(async () => {
    try {
      const data = await fetchCategoryStats(selectedState);
      setParentCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, [selectedState]);

  // Fetch subcategories when a parent is selected
  const loadSubcategories = useCallback(async () => {
    if (!selectedParent) {
      setSubcategories([]);
      return;
    }
    try {
      const data = await fetchSubcategories(selectedParent);
      setSubcategories(data);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
      setSubcategories([]);
    }
  }, [selectedParent]);

  // Fetch businesses
  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      let data;

      if (locationEnabled && userLat !== null && userLng !== null) {
        data = await fetchNearbyBusinesses({
          lat: userLat,
          lng: userLng,
          radius,
          category: selectedSubcategory || undefined,
          parentCategory: !selectedSubcategory ? selectedParent || undefined : undefined,
          page: currentPage,
          limit: 20,
        });
      } else {
        data = await fetchBusinesses({
          state: selectedState,
          category: selectedSubcategory || undefined,
          parentCategory: !selectedSubcategory ? selectedParent || undefined : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: 20,
        });
      }

      setBusinesses(data.businesses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load businesses:', error);
      setBusinesses([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedParent, selectedSubcategory, searchQuery, currentPage, locationEnabled, userLat, userLng, radius]);

  useEffect(() => {
    loadParentCategories();
  }, [loadParentCategories]);

  useEffect(() => {
    loadSubcategories();
  }, [loadSubcategories]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const handleStateChange = (state: AustralianState) => {
    setSelectedState(state);
    setCurrentPage(1);
  };

  const handleParentSelect = (slug: string | null) => {
    setSelectedParent(slug);
    setSelectedSubcategory(null);
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (slug: string | null) => {
    setSelectedSubcategory(slug);
    setCurrentPage(1);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationToggle = (enabled: boolean, lat?: number, lng?: number) => {
    setLocationEnabled(enabled);
    if (enabled && lat !== undefined && lng !== undefined) {
      setUserLat(lat);
      setUserLng(lng);
    } else {
      setUserLat(null);
      setUserLng(null);
    }
    setCurrentPage(1);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setCurrentPage(1);
  };

  return (
    <div className="app">
      <Header selectedState={selectedState} onStateChange={handleStateChange} />
      <main className="main-content">
        <div className="filters-row">
          <div className="filters-left">
            <LocationFilter
              locationEnabled={locationEnabled}
              radius={radius}
              onLocationToggle={handleLocationToggle}
              onRadiusChange={handleRadiusChange}
            />
            <button className="register-btn" onClick={() => setShowRegister(true)}>
              + List Your Business
            </button>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
        <CategoryGrid
          parentCategories={parentCategories}
          subcategories={subcategories}
          selectedParent={selectedParent}
          selectedSubcategory={selectedSubcategory}
          onParentSelect={handleParentSelect}
          onSubcategorySelect={handleSubcategorySelect}
        />
        <BusinessList
          businesses={businesses}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>🇳🇵 OzNepal</h3>
            <p>Connecting the Nepali community with trusted local businesses across Australia.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>List Your Business</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Community</h4>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OzNepal. Made with ❤️ for the Nepali community in Australia.</p>
        </div>
      </footer>
      <RegisterBusiness
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={loadBusinesses}
      />
    </div>
  );
}

export default App;
