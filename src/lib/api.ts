const API_BASE = '/api';

export interface ClipboardShare {
  id?: string;
  passcode?: string;
  slug?: string;
  content_type: 'text' | 'image' | 'file';
  content_text?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
  expires_at?: string;
}

export interface Review {
  id?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const api = {
  shares: {
    async create(formData: FormData) {
      const response = await fetch(`${API_BASE}/shares`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create share');
      }

      return response.json();
    },

    async getByPasscode(passcode: string): Promise<ClipboardShare> {
      const response = await fetch(`${API_BASE}/shares/by-passcode/${passcode}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retrieve share');
      }

      const data = await response.json();
      return data;
    },

    async getBySlug(slug: string): Promise<ClipboardShare> {
      const response = await fetch(`${API_BASE}/shares/by-slug/${slug}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retrieve share');
      }

      const data = await response.json();
      return data;
    },
  },

  reviews: {
    async create(review: { rating: number; comment?: string }) {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      return response.json();
    },

    async list(params?: { limit?: number; offset?: number; rating?: number }): Promise<Review[]> {
      const query = new URLSearchParams();
      if (params?.limit) query.set('limit', params.limit.toString());
      if (params?.offset) query.set('offset', params.offset.toString());
      if (params?.rating) query.set('rating', params.rating.toString());

      const response = await fetch(`${API_BASE}/reviews?${query.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
      }

      const data = await response.json();
      return data.reviews;
    },

    async getStats(): Promise<ReviewStats> {
      const response = await fetch(`${API_BASE}/reviews/stats`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch stats');
      }

      const data = await response.json();
      return data.stats;
    },
  },
};
