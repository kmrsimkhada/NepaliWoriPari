import { BusinessResponse, Category } from '../types';

const API_BASE = '/api';

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchSubcategories(parentSlug: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories/${parentSlug}/subcategories`);
  if (!response.ok) throw new Error('Failed to fetch subcategories');
  return response.json();
}

export async function fetchCategoryStats(state: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/businesses/state/${state}/stats`);
  if (!response.ok) throw new Error('Failed to fetch category stats');
  return response.json();
}

export async function fetchBusinesses(params: {
  state?: string;
  category?: string;
  parentCategory?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BusinessResponse> {
  const searchParams = new URLSearchParams();
  if (params.state && params.state !== 'ALL') searchParams.set('state', params.state);
  if (params.category) searchParams.set('category', params.category);
  if (params.parentCategory) searchParams.set('parentCategory', params.parentCategory);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`${API_BASE}/businesses?${searchParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch businesses');
  return response.json();
}

export async function fetchNearbyBusinesses(params: {
  lat: number;
  lng: number;
  radius?: number;
  category?: string;
  parentCategory?: string;
  page?: number;
  limit?: number;
}): Promise<BusinessResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('lat', params.lat.toString());
  searchParams.set('lng', params.lng.toString());
  if (params.radius) searchParams.set('radius', params.radius.toString());
  if (params.category) searchParams.set('category', params.category);
  if (params.parentCategory) searchParams.set('parentCategory', params.parentCategory);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`${API_BASE}/businesses/nearby?${searchParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch nearby businesses');
  return response.json();
}
