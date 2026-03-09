// Listing types
export interface Listing {
  id: number;
  image: string;
  price: string;
  title: string;
  type: "매매" | "전세";
  specs: {
    size: string;
    bed: number;
    bath: number;
  };
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ListingFormData {
  image: string;
  price: string;
  title: string;
  type: "매매" | "전세";
  specs: {
    size: string;
    bed: number;
    bath: number;
  };
  tags: string[];
}

// News types
export interface NewsItem {
  id: number;
  category: "뉴스" | "팁";
  image: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewsFormData {
  category: "뉴스" | "팁";
  image?: string;
  title: string;
  description: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Featured Settings
export interface FeaturedSetting {
  id: string;
  title: string;
  price_25: string;
  price_34: string;
}
