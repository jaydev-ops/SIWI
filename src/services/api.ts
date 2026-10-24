import { Product, Category, SiteSettings, Enquiry, MediaAsset, ProductImage, SitePage, AdminUser } from '../types';

const API_BASE = '/api';

function getAuthHeaders(isJson = true): Record<string, string> {
  const token = localStorage.getItem('siwi_admin_token');
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public API
  async getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/public/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/public/products/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    const json = await res.json();
    return json.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/public/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data;
  },

  async getSiteSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/public/site-settings`);
    if (!res.ok) throw new Error('Failed to fetch site settings');
    const json = await res.json();
    return json.data;
  },

  async submitEnquiry(payload: {
    full_name: string;
    company_name: string;
    business_email: string;
    phone_number?: string;
    country: string;
    product_of_interest: string;
    estimated_volume?: string;
    preferred_packaging?: string;
    destination_port?: string;
    enquiry_details: string;
  }): Promise<{ reference_no: string; message: string }> {
    const res = await fetch(`${API_BASE}/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit enquiry');
    }
    return {
      reference_no: json.data.reference_no,
      message: json.message,
    };
  },

  async submitContact(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ reference_no: string; message: string }> {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit contact');
    }
    return {
      reference_no: json.reference_no,
      message: json.message,
    };
  },

  // Admin API
  async adminLogin(email: string, password: string):Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Invalid administrative credentials');
    }
    return json.data;
  },

  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    const json = await res.json();
    return json.data;
  },

  async getAdminProducts(params?: { status?: string; category?: string; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/admin/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch admin products');
    const json = await res.json();
    return json.data;
  },

  async getAdminProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    const json = await res.json();
    return json.data;
  },

  async createProduct(data: any, files?: File[]): Promise<any> {
    const hasFiles = Array.isArray(files) && files.length > 0;
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    let headers: Record<string, string>;
    let body: any;

    if (isFormData) {
      headers = getAuthHeaders(false);
      body = data;
    } else if (hasFiles) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (val === undefined || val === null) return;
        if (key === 'specifications' || key === 'media_asset_ids' || typeof val === 'object') {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });
      files.forEach((f) => formData.append('files', f));
      headers = getAuthHeaders(false);
      body = formData;
    } else {
      headers = getAuthHeaders(true);
      body = JSON.stringify(data);
    }

    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers,
      body,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create product');
    return json.data;
  },

  async updateProduct(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update product');
    return json;
  },

  async publishProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}/publish`, { method: 'POST' });
    return res.json();
  },

  async unpublishProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}/unpublish`, { method: 'POST' });
    return res.json();
  },

  async archiveProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${id}/archive`, { method: 'POST' });
    return res.json();
  },

  async getAdminEnquiries(params?: { status?: string; search?: string }): Promise<Enquiry[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/admin/enquiries?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    const json = await res.json();
    return json.data;
  },

  async getAdminEnquiryById(id: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`);
    if (!res.ok) throw new Error('Failed to fetch enquiry');
    const json = await res.json();
    return json.data;
  },

  async updateEnquiry(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteEnquiry(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete enquiry');
    return json;
  },

  async purgeClosedEnquiries(): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const res = await fetch(`${API_BASE}/admin/enquiries/closed/purge`, {
      method: 'DELETE',
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to purge closed enquiries');
    return json;
  },

  async getAdminCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/admin/categories`);
    const json = await res.json();
    return json.data;
  },

  async createCategory(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`);
    const json = await res.json();
    return json.data;
  },

  async updateAdminSettings(settings: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Media Library APIs
  async getAdminMedia(params?: { search?: string; mime_type?: string; usage?: string; product_id?: string }): Promise<MediaAsset[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.mime_type) query.append('mime_type', params.mime_type);
    if (params?.usage) query.append('usage', params.usage);
    if (params?.product_id) query.append('product_id', params.product_id);
    const res = await fetch(`${API_BASE}/admin/media?${query.toString()}`, {
      headers: getAuthHeaders(false),
    });
    const json = await res.json();
    return json.data || [];
  },

  async getAdminMediaById(id: string): Promise<MediaAsset> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      headers: getAuthHeaders(false),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch media asset');
    return json.data;
  },

  async uploadAdminMedia(files: File[] | FileList): Promise<MediaAsset[]> {
    const formData = new FormData();
    const fileArray = Array.from(files);
    fileArray.forEach((f) => formData.append('files', f));

    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to upload media files');
    return Array.isArray(json.data) ? json.data : [json.data];
  },

  async updateAdminMedia(id: string, data: { alt_text?: string; caption?: string; title?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update media');
    return json;
  },

  async replaceAdminMedia(id: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/admin/media/${id}/replace`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to replace media');
    return json;
  },

  async deleteAdminMedia(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete media asset');
    return json;
  },

  // Product Gallery APIs
  async getAdminProductImages(productId: string): Promise<ProductImage[]> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
      headers: getAuthHeaders(false),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch product gallery images');
    return json.data || [];
  },

  async addAdminProductImage(
    productId: string,
    payload: {
      media_asset_id?: string;
      files?: File[] | FileList;
      alt_text_override?: string;
      caption_override?: string;
      is_featured?: boolean;
    }
  ): Promise<any> {
    if (payload.files && payload.files.length > 0) {
      const formData = new FormData();
      Array.from(payload.files).forEach((f) => formData.append('files', f));
      if (payload.is_featured) formData.append('is_featured', '1');
      if (payload.alt_text_override) formData.append('alt_text_override', payload.alt_text_override);
      if (payload.caption_override) formData.append('caption_override', payload.caption_override);

      const res = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to upload and attach image');
      return json;
    } else {
      const res = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to attach media asset');
      return json;
    }
  },

  async updateAdminProductImage(
    productId: string,
    imageId: string,
    data: {
      is_featured?: boolean;
      display_order?: number;
      alt_text_override?: string;
      caption_override?: string;
    }
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}/images/${imageId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update image details');
    return json;
  },

  async reorderAdminProductImages(
    productId: string,
    order: { id: string; display_order: number }[]
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}/images/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ order }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reorder images');
    return json;
  },

  async deleteAdminProductImage(productId: string, imageId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to remove image from gallery');
    return json;
  },

  async replaceAdminProductImage(
    productId: string,
    imageId: string,
    payload: { file?: File; new_media_asset_id?: string }
  ): Promise<any> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      const res = await fetch(`${API_BASE}/admin/products/${productId}/images/${imageId}/replace`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to replace image');
      return json;
    } else {
      const res = await fetch(`${API_BASE}/admin/products/${productId}/images/${imageId}/replace`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to replace image');
      return json;
    }
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    return json.data || [];
  },

  async createAdminUser(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }): Promise<{ success: boolean; message: string; data: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create admin user');
    return json;
  },

  async updateAdminUserStatus(id: string, data: { is_active?: number; role?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update admin user');
    return json;
  },

  async deleteAdminUser(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete admin user');
    return json;
  },

  async updateMyCredentials(data: {
    current_password: string;
    new_email?: string;
    first_name?: string;
    last_name?: string;
    new_password?: string;
  }): Promise<{ success: boolean; message: string; data: any }> {
    const res = await fetch(`${API_BASE}/admin/users/me/credentials`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update credentials');
    return json;
  },

  async getAdminAuditLog(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/audit-log`);
    const json = await res.json();
    return json.data;
  },

  async getAdminPages(): Promise<SitePage[]> {
    const res = await fetch(`${API_BASE}/admin/pages`, {
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    return json.data || [];
  },

  async getAdminPageById(id: string): Promise<SitePage> {
    const res = await fetch(`${API_BASE}/admin/pages/${id}`, {
      headers: getAuthHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch page');
    return json.data;
  },

  async updateAdminPage(id: string, payload: { title?: string; content_json?: any; status?: string }): Promise<SitePage> {
    const res = await fetch(`${API_BASE}/admin/pages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update page');
    return json.data;
  },
};
