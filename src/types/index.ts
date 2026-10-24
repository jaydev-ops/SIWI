export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProductSpecification {
  id: string;
  product_id: string;
  name: string;
  value: string;
  unit?: string;
  display_order: number;
  is_public: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  status: ProductStatus;
  featured: number;
  display_order: number;
  primary_category_id: string;
  category_name?: string;
  category_slug?: string;
  featured_image: string;
  packaging_type?: string;
  available_pack_sizes?: string;
  shelf_life?: string;
  storage_conditions?: string;
  processing_info?: string;
  industrial_applications?: string;
  seo_title?: string;
  seo_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  specifications?: ProductSpecification[];
  images?: ProductImage[];
  relatedProducts?: {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    featured_image: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  featured_image?: string;
  display_order: number;
  is_active: number;
  created_at: string;
}

export type EnquiryStatus = 'NEW' | 'REVIEWED' | 'IN_PROGRESS' | 'AWAITING_CUSTOMER' | 'CONVERTED' | 'CLOSED';

export interface Enquiry {
  id: string;
  reference_no: string;
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
  status: EnquiryStatus;
  internal_notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  founder: string;
  registered_address?: string;
  gst_no?: string;
  iec_no?: string;
  primary_export_focus?: string;
  secondary_export_focus?: string;
  [key: string]: string | undefined;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'ENQUIRY_MANAGER' | 'VIEWER';
  is_active?: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  media_asset_id: string;
  display_order: number;
  is_featured: number | boolean;
  alt_text_override?: string;
  caption_override?: string;
  alt_text?: string;
  caption?: string;
  file_url: string;
  storage_key?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  storage_key?: string;
  original_filename: string;
  file_name?: string;
  title?: string;
  file_url: string;
  alt_text?: string;
  caption?: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  usage_count?: number;
  used_in_products?: string[];
  used_in_product_ids?: string[];
  is_used_in_published?: boolean;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  content_json: string;
  status: string;
  updated_at: string;
}

