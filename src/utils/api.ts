import type { Listing, ListingFormData, NewsItem, NewsFormData, ApiResponse, UploadResponse, FeaturedSetting } from '../types';

// Base URL - uses Vite proxy in development, direct in production
const BASE_URL = import.meta.env.PROD ? '' : '';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다.',
    };
  }
}

// ==========================================
// Listings API
// ==========================================

export async function fetchListings(): Promise<Listing[]> {
  const response = await apiCall<Listing[]>('/listings');
  return response.data || [];
}

export async function fetchListing(id: number): Promise<Listing | null> {
  const response = await apiCall<Listing>(`/listings/${id}`);
  return response.data || null;
}

export async function createListing(
  listing: ListingFormData,
  token: string
): Promise<ApiResponse<{ id: number; message: string }>> {
  return apiCall('/listings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listing),
  });
}

export async function updateListing(
  id: number,
  listing: Partial<ListingFormData>,
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiCall(`/listings/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listing),
  });
}

export async function deleteListing(
  id: number,
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiCall(`/listings/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ==========================================
// News API
// ==========================================

export async function fetchNews(): Promise<NewsItem[]> {
  const response = await apiCall<NewsItem[]>('/news');
  return response.data || [];
}

export async function fetchNewsItem(id: number): Promise<NewsItem | null> {
  const response = await apiCall<NewsItem>(`/news/${id}`);
  return response.data || null;
}

export async function createNews(
  news: NewsFormData,
  token: string
): Promise<ApiResponse<{ id: number; message: string }>> {
  return apiCall('/news', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
}

export async function updateNews(
  id: number,
  news: Partial<NewsFormData>,
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiCall(`/news/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(news),
  });
}

export async function deleteNews(
  id: number,
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiCall(`/news/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ==========================================
// Featured Settings API
// ==========================================

export async function fetchFeaturedSettings(): Promise<FeaturedSetting[]> {
  const response = await apiCall<FeaturedSetting[]>('/featured');
  return response.data || [];
}

export async function updateFeaturedSettings(
  settings: Partial<FeaturedSetting>[],
  token: string
): Promise<ApiResponse<{ message: string }>> {
  return apiCall('/featured', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ settings }),
  });
}

// ==========================================
// Upload API
// ==========================================

export async function uploadImage(
  file: File,
  token: string
): Promise<ApiResponse<UploadResponse>> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || '이미지 업로드에 실패했습니다.',
      };
    }

    return data;
  } catch (error) {
    console.error('Image upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.',
    };
  }
}

// ==========================================
// Auth Helper
// ==========================================

export function verifyPassword(password: string): boolean {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '큰문admin2024';
  return password === adminPassword;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
