import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { db, initDatabase } from './db/database.ts';
import { getStorageProvider } from './storage/index.ts';
import { LocalStorageProvider } from './storage/localStorage.ts';
import { validateAndInspectImage } from './utils/imageUtils.ts';

// Initialize SQLite database
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory multer upload for safe buffer validation and processing
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Admin authentication middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.headers['x-admin-token'] as string);

  if (token && token.startsWith('siwi_admin_token_')) {
    const userId = token.replace('siwi_admin_token_', '');
    const user = db.prepare('SELECT id, email, role, is_active FROM admin_users WHERE id = ? AND is_active = 1').get(userId);
    if (user) {
      (req as any).user = user;
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Administrative authentication required. Please log in with valid credentials.',
  });
}

// ==========================================
// MEDIA ASSET DELIVERY ROUTE
// ==========================================
app.get('/api/public/media/*key', async (req, res) => {
  try {
    const rawKey = (req.params as any).key;
    const key = Array.isArray(rawKey) ? rawKey.join('/') : String(rawKey || '');
    const storage = getStorageProvider();
    if (storage instanceof LocalStorageProvider) {
      const filePath = storage.getStoragePath(key);
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('Asset not found');
      }
      const stat = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mimeMap: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.redirect(storage.getPublicUrl(key));
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// 1. Get Published Products with Featured Images & Gallery Counts
app.get('/api/public/products', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             COALESCE(
               (SELECT ma.file_url FROM product_images pi JOIN media_assets ma ON pi.media_asset_id = ma.id WHERE pi.product_id = p.id AND pi.is_featured = 1 LIMIT 1),
               (SELECT ma.file_url FROM product_images pi JOIN media_assets ma ON pi.media_asset_id = ma.id WHERE pi.product_id = p.id ORDER BY pi.display_order ASC LIMIT 1),
               p.featured_image
             ) as resolved_featured_image,
             (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count
      FROM products p
      LEFT JOIN categories c ON p.primary_category_id = c.id
      WHERE p.status = 'PUBLISHED'
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.short_description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.display_order ASC`;

    const products = db.prepare(query).all(...params);

    // Fetch specifications for each product
    const getSpecs = db.prepare(`SELECT * FROM product_specifications WHERE product_id = ? AND is_public = 1 ORDER BY display_order ASC`);
    const enriched = products.map((prod: any) => ({
      ...prod,
      featured_image: prod.resolved_featured_image || prod.featured_image || '/assets/images/hero_still_life.jpg',
      specifications: getSpecs.all(prod.id),
    }));

    res.json({ success: true, data: enriched });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get Single Product by Slug with Complete Gallery Records
app.get('/api/public/products/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const product: any = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.primary_category_id = c.id
      WHERE p.slug = ? AND p.status = 'PUBLISHED'
    `).get(slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const specifications = db.prepare(`
      SELECT * FROM product_specifications WHERE product_id = ? AND is_public = 1 ORDER BY display_order ASC
    `).all(product.id);

    // Fetch product gallery images from product_images + media_assets
    const images = db.prepare(`
      SELECT pi.id as product_image_id, pi.media_asset_id, pi.display_order, pi.is_featured,
             COALESCE(pi.alt_text_override, ma.alt_text, ma.title) as alt_text,
             COALESCE(pi.caption_override, ma.caption) as caption,
             ma.file_url, ma.original_filename, ma.mime_type, ma.file_size, ma.width, ma.height
      FROM product_images pi
      JOIN media_assets ma ON pi.media_asset_id = ma.id
      WHERE pi.product_id = ?
      ORDER BY pi.display_order ASC
    `).all(product.id) as any[];

    // Determine featured image
    const featuredImg = images.find(img => img.is_featured === 1) || images[0];
    const resolvedFeaturedUrl = featuredImg?.file_url || product.featured_image || '/assets/images/hero_still_life.jpg';

    // Fetch related products in same category
    const relatedProducts = db.prepare(`
      SELECT id, name, slug, short_description, featured_image
      FROM products
      WHERE primary_category_id = ? AND id != ? AND status = 'PUBLISHED'
      LIMIT 3
    `).all(product.primary_category_id, product.id);

    res.json({
      success: true,
      data: {
        ...product,
        featured_image: resolvedFeaturedUrl,
        images,
        specifications,
        relatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get Categories
app.get('/api/public/categories', (_req, res) => {
  try {
    const categories = db.prepare(`
      SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC
    `).all();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Get Site Settings
app.get('/api/public/site-settings', (_req, res) => {
  try {
    const rows = db.prepare(`SELECT key, value FROM site_settings`).all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Submit Trade Enquiry
app.post('/api/public/enquiries', (req, res) => {
  try {
    const {
      full_name,
      company_name,
      business_email,
      phone_number,
      country,
      product_of_interest,
      estimated_volume,
      preferred_packaging,
      destination_port,
      enquiry_details,
    } = req.body;

    if (!full_name || !company_name || !business_email || !country || !product_of_interest || !enquiry_details) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields: Name, Company, Email, Country, Product, and Details.',
      });
    }

    const id = 'enq_' + Date.now();
    const reference_no = 'SIWI-ENQ-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (
        id, reference_no, full_name, company_name, business_email, phone_number,
        country, product_of_interest, estimated_volume, preferred_packaging,
        destination_port, enquiry_details, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?, ?)
    `).run(
      id,
      reference_no,
      full_name,
      company_name,
      business_email,
      phone_number || '',
      country,
      product_of_interest,
      estimated_volume || '',
      preferred_packaging || '',
      destination_port || '',
      enquiry_details,
      now,
      now
    );

    // Record audit log
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, 'SYSTEM', 'ENQUIRY_RECEIVED', 'ENQUIRY', ?, ?, ?)
    `).run('aud_' + Date.now(), id, `Buyer enquiry from ${company_name} for ${product_of_interest}`, now);

    res.json({
      success: true,
      message: 'Your trade enquiry has been received by SIWI Global Ventures.',
      data: {
        reference_no,
        full_name,
        product_of_interest,
        created_at: now,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Submit Contact Form
app.post('/api/public/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const id = 'enq_' + Date.now();
    const reference_no = 'SIWI-MSG-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO enquiries (
        id, reference_no, full_name, company_name, business_email, phone_number,
        country, product_of_interest, estimated_volume, preferred_packaging,
        destination_port, enquiry_details, status, created_at, updated_at
      ) VALUES (?, ?, ?, 'Direct Contact', ?, '', 'Not Specified', ?, '', '', '', ?, 'NEW', ?, ?)
    `).run(id, reference_no, name, email, subject || 'General Enquiry', message, now, now);

    res.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you shortly.',
      reference_no,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMIN API ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM admin_users WHERE email = ? AND is_active = 1').get(email);

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    // In production this would be an encrypted JWT/cookie session.
    const token = 'siwi_admin_token_' + user.id;

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Dashboard KPI
app.get('/api/admin/dashboard', (_req, res) => {
  try {
    const totalProducts = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
    const publishedProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'PUBLISHED'").get() as any).c;
    const draftProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'DRAFT'").get() as any).c;
    const archivedProducts = (db.prepare("SELECT COUNT(*) as c FROM products WHERE status = 'ARCHIVED'").get() as any).c;

    const totalEnquiries = (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as any).c;
    const newEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'NEW'").get() as any).c;
    const pendingEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status IN ('NEW', 'IN_PROGRESS', 'REVIEWED')").get() as any).c;

    const recentEnquiries = db.prepare(`
      SELECT id, reference_no, full_name, company_name, product_of_interest, country, status, created_at
      FROM enquiries
      ORDER BY created_at DESC
      LIMIT 5
    `).all();

    const recentlyUpdatedProducts = db.prepare(`
      SELECT id, name, slug, status, updated_at
      FROM products
      ORDER BY updated_at DESC
      LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          publishedProducts,
          draftProducts,
          archivedProducts,
          totalEnquiries,
          newEnquiries,
          pendingEnquiries,
        },
        recentEnquiries,
        recentlyUpdatedProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Products List
app.get('/api/admin/products', (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.primary_category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (category && category !== 'all') {
      query += ` AND p.primary_category_id = ?`;
      params.push(category);
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.short_description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.display_order ASC, p.updated_at DESC`;
    const products = db.prepare(query).all(...params);
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Get Product by ID
app.get('/api/admin/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product: any = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const specifications = db.prepare(`SELECT * FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC`).all(id);
    const images = db.prepare(`
      SELECT pi.id, pi.product_id, pi.media_asset_id, pi.display_order, pi.is_featured,
             pi.alt_text_override, pi.caption_override,
             COALESCE(pi.alt_text_override, ma.alt_text, ma.title) as alt_text,
             COALESCE(pi.caption_override, ma.caption) as caption,
             ma.file_url, ma.storage_key, ma.original_filename, ma.mime_type, ma.file_size, ma.width, ma.height
      FROM product_images pi
      JOIN media_assets ma ON pi.media_asset_id = ma.id
      WHERE pi.product_id = ?
      ORDER BY pi.display_order ASC
    `).all(id);

    res.json({ success: true, data: { ...product, specifications, images } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Create Product (with one-go multiple image upload & media asset linking)
app.post(
  '/api/admin/products',
  (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      memoryUpload.array('files', 15)(req, res, next);
    } else {
      next();
    }
  },
  async (req, res) => {
    try {
      const {
        name,
        slug,
        short_description,
        description,
        status,
        primary_category_id,
        featured_image,
        packaging_type,
        available_pack_sizes,
        shelf_life,
        storage_conditions,
        processing_info,
        industrial_applications,
        seo_title,
        seo_description,
        specifications,
        media_asset_ids,
        featured_index,
      } = req.body;

      if (!name || !slug || !short_description) {
        return res.status(400).json({ success: false, message: 'Name, Slug, and Short Description are required.' });
      }

      // Check unique slug
      const existingSlug = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
      if (existingSlug) {
        return res.status(400).json({ success: false, message: `A product with URL slug "${slug}" already exists. Please choose a different slug or title.` });
      }

      const id = 'prod_' + Date.now();
      const now = new Date().toISOString();
      const userId = (req as any).user?.id || 'usr_admin_1';

      // Insert product base record
      db.prepare(`
        INSERT INTO products (
          id, name, slug, short_description, description, status, primary_category_id,
          featured_image, packaging_type, available_pack_sizes, shelf_life, storage_conditions,
          processing_info, industrial_applications, seo_title, seo_description, published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        name,
        slug,
        short_description,
        description || '',
        status || 'DRAFT',
        primary_category_id || 'cat_dehydrated',
        featured_image || '',
        packaging_type || '',
        available_pack_sizes || '',
        shelf_life || '',
        storage_conditions || '',
        processing_info || '',
        industrial_applications || '',
        seo_title || name + ' | SIWI Global Ventures',
        seo_description || short_description,
        status === 'PUBLISHED' ? now : null,
        now,
        now
      );

      // Handle specifications (array or JSON string)
      let parsedSpecs: any[] = [];
      if (typeof specifications === 'string') {
        try {
          parsedSpecs = JSON.parse(specifications);
        } catch {
          parsedSpecs = [];
        }
      } else if (Array.isArray(specifications)) {
        parsedSpecs = specifications;
      }

      if (parsedSpecs.length > 0) {
        const insertSpec = db.prepare(`
          INSERT INTO product_specifications (id, product_id, name, value, unit, display_order, is_public)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        parsedSpecs.forEach((spec: any, idx: number) => {
          if (spec.name && spec.value) {
            insertSpec.run('spec_' + Date.now() + '_' + idx, id, spec.name, spec.value, spec.unit || '', idx + 1, spec.is_public !== false ? 1 : 0);
          }
        });
      }

      // Handle raw image files uploaded in this request
      const rawFiles = (req.files as Express.Multer.File[]) || [];
      if (rawFiles.length === 0 && (req as any).file) {
        rawFiles.push((req as any).file);
      }

      // Handle media_asset_ids (from existing Media Library)
      let parsedMediaAssetIds: string[] = [];
      if (typeof media_asset_ids === 'string') {
        try {
          const parsed = JSON.parse(media_asset_ids);
          parsedMediaAssetIds = Array.isArray(parsed) ? parsed : [media_asset_ids];
        } catch {
          parsedMediaAssetIds = media_asset_ids.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(media_asset_ids)) {
        parsedMediaAssetIds = media_asset_ids;
      }

      let nextOrder = 1;
      let finalFeaturedUrl = featured_image || '';
      const chosenFeaturedIdx = parseInt(featured_index !== undefined ? String(featured_index) : '0', 10);
      const storage = getStorageProvider();

      // Process uploaded files
      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];
        const validation = validateAndInspectImage(file.buffer, file.mimetype, file.originalname);
        if (!validation.isValid) {
          // If a file is invalid, remove created product and return error
          db.prepare('DELETE FROM products WHERE id = ?').run(id);
          return res.status(400).json({ success: false, message: `File "${file.originalname}": ${validation.error}` });
        }

        const uploadResult = await storage.uploadFile(file.buffer, file.originalname, validation.detectedMime || file.mimetype);
        const medId = 'med_' + Date.now() + '_' + i;
        const title = path.parse(file.originalname).name.replace(/[-_]+/g, ' ');

        db.prepare(`
          INSERT INTO media_assets (
            id, storage_key, original_filename, file_name, title, file_url,
            mime_type, file_size, width, height, alt_text, caption, created_by, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          medId,
          uploadResult.storageKey,
          file.originalname,
          file.originalname,
          title,
          uploadResult.fileUrl,
          validation.detectedMime || file.mimetype,
          uploadResult.fileSize,
          validation.width || null,
          validation.height || null,
          title,
          null,
          userId,
          now,
          now
        );

        const isThisFeatured = i === chosenFeaturedIdx || (i === 0 && !finalFeaturedUrl);
        const piId = 'pi_' + Date.now() + '_' + i;

        db.prepare(`
          INSERT INTO product_images (
            id, product_id, media_asset_id, display_order, is_featured, alt_text_override, caption_override, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          piId,
          id,
          medId,
          nextOrder++,
          isThisFeatured ? 1 : 0,
          title,
          null,
          now,
          now
        );

        if (isThisFeatured) {
          finalFeaturedUrl = uploadResult.fileUrl;
        }
      }

      // Process existing media assets attached
      for (let j = 0; j < parsedMediaAssetIds.length; j++) {
        const assetId = parsedMediaAssetIds[j];
        const asset: any = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(assetId);
        if (asset) {
          const isThisFeatured = (!finalFeaturedUrl && rawFiles.length === 0 && j === 0);
          const piId = 'pi_' + Date.now() + '_asset_' + j;

          db.prepare(`
            INSERT INTO product_images (
              id, product_id, media_asset_id, display_order, is_featured, alt_text_override, caption_override, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            piId,
            id,
            assetId,
            nextOrder++,
            isThisFeatured ? 1 : 0,
            asset.title || asset.alt_text || null,
            null,
            now,
            now
          );

          if (isThisFeatured) {
            finalFeaturedUrl = asset.file_url;
          }
        }
      }

      // If featured image was updated, persist on products table
      if (finalFeaturedUrl && finalFeaturedUrl !== featured_image) {
        db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(finalFeaturedUrl, now, id);
      }

      // Audit log
      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
        VALUES (?, ?, 'CREATE_PRODUCT', 'PRODUCT', ?, ?, ?)
      `).run(
        'aud_' + Date.now(),
        userId,
        id,
        `Created product ${name} (${slug}) with ${rawFiles.length + parsedMediaAssetIds.length} images`,
        now
      );

      res.json({
        success: true,
        data: {
          id,
          name,
          slug,
          featured_image: finalFeaturedUrl,
          images_count: rawFiles.length + parsedMediaAssetIds.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Admin Update Product
app.patch('/api/admin/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product: any = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      slug,
      short_description,
      description,
      status,
      primary_category_id,
      featured_image,
      packaging_type,
      available_pack_sizes,
      shelf_life,
      storage_conditions,
      processing_info,
      industrial_applications,
      seo_title,
      seo_description,
      specifications,
    } = req.body;

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        short_description = COALESCE(?, short_description),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        primary_category_id = COALESCE(?, primary_category_id),
        featured_image = COALESCE(?, featured_image),
        packaging_type = COALESCE(?, packaging_type),
        available_pack_sizes = COALESCE(?, available_pack_sizes),
        shelf_life = COALESCE(?, shelf_life),
        storage_conditions = COALESCE(?, storage_conditions),
        processing_info = COALESCE(?, processing_info),
        industrial_applications = COALESCE(?, industrial_applications),
        seo_title = COALESCE(?, seo_title),
        seo_description = COALESCE(?, seo_description),
        updated_at = ?
      WHERE id = ?
    `).run(
      name ?? null,
      slug ?? null,
      short_description ?? null,
      description ?? null,
      status ?? null,
      primary_category_id ?? null,
      featured_image ?? null,
      packaging_type ?? null,
      available_pack_sizes ?? null,
      shelf_life ?? null,
      storage_conditions ?? null,
      processing_info ?? null,
      industrial_applications ?? null,
      seo_title ?? null,
      seo_description ?? null,
      now,
      id
    );

    // Update specs if provided
    if (specifications && Array.isArray(specifications)) {
      db.prepare('DELETE FROM product_specifications WHERE product_id = ?').run(id);
      const insertSpec = db.prepare(`
        INSERT INTO product_specifications (id, product_id, name, value, unit, display_order, is_public)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      specifications.forEach((spec: any, idx: number) => {
        insertSpec.run('spec_' + Date.now() + '_' + idx, id, spec.name, spec.value, spec.unit || '', idx + 1, spec.is_public !== false ? 1 : 0);
      });
    }

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, 'usr_admin_1', 'UPDATE_PRODUCT', 'PRODUCT', ?, ?, ?)
    `).run('aud_' + Date.now(), id, `Updated product ${name || product.name}`, now);

    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Publish Product
app.post('/api/admin/products/:id/publish', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    db.prepare(`UPDATE products SET status = 'PUBLISHED', published_at = ?, updated_at = ? WHERE id = ?`).run(now, now, id);
    res.json({ success: true, message: 'Product published.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Unpublish Product
app.post('/api/admin/products/:id/unpublish', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    db.prepare(`UPDATE products SET status = 'DRAFT', updated_at = ? WHERE id = ?`).run(now, id);
    res.json({ success: true, message: 'Product moved to draft.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Archive Product
app.post('/api/admin/products/:id/archive', (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();
    db.prepare(`UPDATE products SET status = 'ARCHIVED', updated_at = ? WHERE id = ?`).run(now, id);
    res.json({ success: true, message: 'Product archived.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Enquiries List
app.get('/api/admin/enquiries', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `SELECT * FROM enquiries WHERE 1=1`;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (company_name LIKE ? OR full_name LIKE ? OR product_of_interest LIKE ? OR reference_no LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;
    const enquiries = db.prepare(query).all(...params);
    res.json({ success: true, data: enquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Get Enquiry by ID
app.get('/api/admin/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, data: enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Update Enquiry Status & Notes
app.patch('/api/admin/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, internal_notes, assigned_to } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE enquiries SET
        status = COALESCE(?, status),
        internal_notes = COALESCE(?, internal_notes),
        assigned_to = COALESCE(?, assigned_to),
        updated_at = ?
      WHERE id = ?
    `).run(status ?? null, internal_notes ?? null, assigned_to ?? null, now, id);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, 'usr_admin_1', 'UPDATE_ENQUIRY', 'ENQUIRY', ?, ?, ?)
    `).run('aud_' + Date.now(), id, `Updated enquiry status to ${status || 'unchanged'}`, now);

    res.json({ success: true, message: 'Enquiry updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Purge All Closed Enquiries
app.delete('/api/admin/enquiries/closed/purge', (_req, res) => {
  try {
    const closedCount: any = db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'CLOSED'").get();
    if (!closedCount || closedCount.count === 0) {
      return res.json({ success: true, message: 'No closed enquiries found to delete.', deletedCount: 0 });
    }

    db.prepare("DELETE FROM enquiries WHERE status = 'CLOSED'").run();

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, 'usr_admin_1', 'PURGE_CLOSED_ENQUIRIES', 'ENQUIRY', 'BATCH', ?, ?)
    `).run('aud_' + Date.now(), `Purged ${closedCount.count} closed enquiries`, now);

    res.json({
      success: true,
      message: `Successfully deleted ${closedCount.count} closed enquiry record${closedCount.count === 1 ? '' : 's'}.`,
      deletedCount: closedCount.count,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Delete Single Enquiry
app.delete('/api/admin/enquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    const enquiry: any = db.prepare('SELECT id, reference_no, status FROM enquiries WHERE id = ?').get(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, 'usr_admin_1', 'DELETE_ENQUIRY', 'ENQUIRY', ?, ?, ?)
    `).run('aud_' + Date.now(), id, `Deleted enquiry ${enquiry.reference_no} (Status: ${enquiry.status})`, now);

    res.json({
      success: true,
      message: `Enquiry ${enquiry.reference_no} deleted successfully.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Categories CRUD
app.get('/api/admin/categories', (_req, res) => {
  try {
    const categories = db.prepare(`SELECT * FROM categories ORDER BY display_order ASC`).all();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/categories', (req, res) => {
  try {
    const { name, slug, description, display_order } = req.body;
    const id = 'cat_' + Date.now();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO categories (id, name, slug, description, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(id, name, slug, description || '', display_order || 0, now);
    res.json({ success: true, data: { id, name, slug } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Settings
app.get('/api/admin/settings', (_req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as any[];
    const settings: Record<string, string> = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/admin/settings', (req, res) => {
  try {
    const updates = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(updates)) {
      stmt.run(key, String(value));
    }
    res.json({ success: true, message: 'Site settings updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Audit Log
app.get('/api/admin/audit-log', (_req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50').all();
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// CENTRAL MEDIA LIBRARY ENDPOINTS
// ==========================================

// 1. Get Media Assets with real usage analytics
app.get('/api/admin/media', requireAdminAuth, (req, res) => {
  try {
    const { search, mime_type, product_id, usage } = req.query;
    let query = `
      SELECT ma.*,
             COUNT(pi.id) as usage_count,
             GROUP_CONCAT(p.name, '||') as used_in_products,
             GROUP_CONCAT(p.id, '||') as used_in_product_ids,
             MAX(CASE WHEN p.status = 'PUBLISHED' THEN 1 ELSE 0 END) as is_used_in_published
      FROM media_assets ma
      LEFT JOIN product_images pi ON ma.id = pi.media_asset_id
      LEFT JOIN products p ON pi.product_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (ma.original_filename LIKE ? OR ma.title LIKE ? OR ma.alt_text LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (mime_type && mime_type !== 'all') {
      query += ` AND ma.mime_type LIKE ?`;
      params.push(`%${mime_type}%`);
    }

    if (product_id) {
      query += ` AND pi.product_id = ?`;
      params.push(product_id);
    }

    query += ` GROUP BY ma.id`;

    if (usage === 'used') {
      query += ` HAVING usage_count > 0`;
    } else if (usage === 'unused') {
      query += ` HAVING usage_count = 0`;
    }

    query += ` ORDER BY ma.created_at DESC`;

    const rawAssets = db.prepare(query).all(...params) as any[];
    const assets = rawAssets.map(a => ({
      ...a,
      usage_count: Number(a.usage_count || 0),
      is_used_in_published: Boolean(a.is_used_in_published),
      used_in_products: a.used_in_products ? a.used_in_products.split('||').filter(Boolean) : [],
      used_in_product_ids: a.used_in_product_ids ? a.used_in_product_ids.split('||').filter(Boolean) : [],
    }));

    const storage = getStorageProvider();
    res.json({
      success: true,
      data: assets,
      storage_provider: storage.name,
      is_cloud: storage.isCloud,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Upload Single or Multiple Media Assets
app.post('/api/admin/media/upload', requireAdminAuth, memoryUpload.array('files', 10), async (req, res) => {
  try {
    const rawFiles = (req.files as Express.Multer.File[]) || [];
    if (rawFiles.length === 0 && (req as any).file) {
      rawFiles.push((req as any).file);
    }

    if (rawFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No media file provided for upload.' });
    }

    const storage = getStorageProvider();
    const uploadedAssets: any[] = [];
    const now = new Date().toISOString();
    const userId = (req as any).user?.id || 'usr_admin_1';

    for (const file of rawFiles) {
      const validation = validateAndInspectImage(file.buffer, file.mimetype, file.originalname);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: `Validation rejected "${file.originalname}": ${validation.error}`,
        });
      }

      const storageResult = await storage.uploadFile(
        file.buffer,
        file.originalname,
        validation.detectedMime || file.mimetype
      );

      const id = 'med_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const title = path.parse(file.originalname).name.replace(/[-_]+/g, ' ');

      db.prepare(`
        INSERT INTO media_assets (
          id, storage_key, original_filename, file_name, title, file_url,
          mime_type, file_size, width, height, alt_text, caption, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        storageResult.storageKey,
        file.originalname,
        file.originalname,
        title,
        storageResult.fileUrl,
        validation.detectedMime || file.mimetype,
        storageResult.fileSize,
        validation.width || null,
        validation.height || null,
        title,
        null,
        userId,
        now,
        now
      );

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
        VALUES (?, ?, 'UPLOAD_MEDIA', 'MEDIA_ASSET', ?, ?, ?)
      `).run('aud_' + Date.now(), userId, id, `Uploaded media asset "${file.originalname}" (${(file.size / 1024).toFixed(1)} KB)`, now);

      uploadedAssets.push({
        id,
        storage_key: storageResult.storageKey,
        original_filename: file.originalname,
        file_url: storageResult.fileUrl,
        mime_type: validation.detectedMime || file.mimetype,
        file_size: storageResult.fileSize,
        width: validation.width,
        height: validation.height,
        alt_text: title,
        title,
        created_at: now,
      });
    }

    res.json({
      success: true,
      data: uploadedAssets.length === 1 ? uploadedAssets[0] : uploadedAssets,
      count: uploadedAssets.length,
      storage_provider: storage.name,
      is_cloud: storage.isCloud,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get Single Media Asset by ID
app.get('/api/admin/media/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const asset: any = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    const usages = db.prepare(`
      SELECT p.id as product_id, p.name as product_name, p.slug as product_slug, p.status as product_status,
             pi.id as product_image_id, pi.is_featured, pi.display_order
      FROM product_images pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.media_asset_id = ?
    `).all(id) as any[];

    res.json({
      success: true,
      data: {
        ...asset,
        usages,
        usage_count: usages.length,
        is_used_in_published: usages.some(u => u.product_status === 'PUBLISHED'),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Update Media Asset Metadata (alt text, caption, title)
app.patch('/api/admin/media/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { alt_text, caption, title } = req.body;
    const now = new Date().toISOString();

    const asset = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    db.prepare(`
      UPDATE media_assets SET
        alt_text = COALESCE(?, alt_text),
        caption = COALESCE(?, caption),
        title = COALESCE(?, title),
        updated_at = ?
      WHERE id = ?
    `).run(alt_text ?? null, caption ?? null, title ?? null, now, id);

    res.json({ success: true, message: 'Media asset metadata updated successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Replace Existing Media Asset File (Preserving Relationships)
app.post('/api/admin/media/:id/replace', requireAdminAuth, memoryUpload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No replacement file provided.' });
    }

    const asset: any = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    const validation = validateAndInspectImage(file.buffer, file.mimetype, file.originalname);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const storage = getStorageProvider();
    const uploadResult = await storage.uploadFile(
      file.buffer,
      file.originalname,
      validation.detectedMime || file.mimetype
    );

    // Delete old physical storage file if storage key changed
    if (asset.storage_key && asset.storage_key !== uploadResult.storageKey) {
      await storage.deleteFile(asset.storage_key);
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE media_assets SET
        storage_key = ?,
        original_filename = ?,
        file_name = ?,
        file_url = ?,
        mime_type = ?,
        file_size = ?,
        width = ?,
        height = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      uploadResult.storageKey,
      file.originalname,
      file.originalname,
      uploadResult.fileUrl,
      validation.detectedMime || file.mimetype,
      uploadResult.fileSize,
      validation.width || null,
      validation.height || null,
      now,
      id
    );

    // Synchronize products where this asset was the featured image
    db.prepare(`
      UPDATE products
      SET featured_image = ?, updated_at = ?
      WHERE id IN (SELECT product_id FROM product_images WHERE media_asset_id = ? AND is_featured = 1)
    `).run(uploadResult.fileUrl, now, id);

    res.json({
      success: true,
      message: 'Media asset replaced successfully.',
      data: {
        id,
        storage_key: uploadResult.storageKey,
        file_url: uploadResult.fileUrl,
        original_filename: file.originalname,
        file_size: uploadResult.fileSize,
        width: validation.width,
        height: validation.height,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Safely Delete Media Asset
app.delete('/api/admin/media/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const asset: any = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Media asset not found.' });
    }

    // Safety checks: check if used in products
    const usages = db.prepare(`
      SELECT p.id, p.name, p.status, pi.is_featured
      FROM product_images pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.media_asset_id = ?
    `).all(id) as any[];

    const publishedUsages = usages.filter(u => u.status === 'PUBLISHED');
    if (publishedUsages.length > 0) {
      const names = publishedUsages.map(u => `"${u.name}"`).join(', ');
      return res.status(409).json({
        success: false,
        message: `Deletion blocked: This media asset is actively used by published product(s) [${names}]. Remove it from their product galleries before deleting.`,
      });
    }

    if (usages.length > 0) {
      const names = usages.map(u => `"${u.name}"`).join(', ');
      return res.status(409).json({
        success: false,
        message: `Deletion blocked: This media asset is attached to product drafts [${names}]. Remove product associations first.`,
      });
    }

    // Delete from storage
    const storage = getStorageProvider();
    if (asset.storage_key) {
      await storage.deleteFile(asset.storage_key);
    }

    db.prepare('DELETE FROM media_assets WHERE id = ?').run(id);

    const now = new Date().toISOString();
    const userId = (req as any).user?.id || 'usr_admin_1';
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'DELETE_MEDIA', 'MEDIA_ASSET', ?, ?, ?)
    `).run('aud_' + Date.now(), userId, id, `Deleted media asset "${asset.original_filename || asset.title}"`, now);

    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// PRODUCT GALLERY & IMAGE MANAGEMENT ENDPOINTS
// ==========================================

// 7. Get Product Images Gallery
app.get('/api/admin/products/:id/images', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const images = db.prepare(`
      SELECT pi.id, pi.product_id, pi.media_asset_id, pi.display_order, pi.is_featured,
             pi.alt_text_override, pi.caption_override,
             COALESCE(pi.alt_text_override, ma.alt_text, ma.title) as alt_text,
             COALESCE(pi.caption_override, ma.caption) as caption,
             ma.file_url, ma.storage_key, ma.original_filename, ma.mime_type, ma.file_size, ma.width, ma.height
      FROM product_images pi
      JOIN media_assets ma ON pi.media_asset_id = ma.id
      WHERE pi.product_id = ?
      ORDER BY pi.display_order ASC
    `).all(id);

    res.json({ success: true, data: images });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Add Image to Product Gallery (by existing media_asset_id or direct file upload)
app.post('/api/admin/products/:id/images', requireAdminAuth, memoryUpload.array('files', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const product: any = db.prepare('SELECT id, name FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const rawFiles = (req.files as Express.Multer.File[]) || [];
    if (rawFiles.length === 0 && (req as any).file) {
      rawFiles.push((req as any).file);
    }

    const { media_asset_id, alt_text_override, caption_override, is_featured } = req.body;
    const now = new Date().toISOString();
    const userId = (req as any).user?.id || 'usr_admin_1';

    const existingImages = db.prepare('SELECT id, is_featured, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC').all(id) as any[];
    let nextOrder = existingImages.length > 0 ? Math.max(...existingImages.map(img => img.display_order)) + 1 : 1;
    const hasFeatured = existingImages.some(img => img.is_featured === 1);

    const addedImages: any[] = [];

    // Case 1: Attach existing MediaAsset from library
    if (media_asset_id) {
      const asset: any = db.prepare('SELECT * FROM media_assets WHERE id = ?').get(media_asset_id);
      if (!asset) {
        return res.status(404).json({ success: false, message: 'Media asset not found.' });
      }

      const shouldBeFeatured = is_featured === true || is_featured === '1' || is_featured === 1 || !hasFeatured;
      if (shouldBeFeatured) {
        db.prepare('UPDATE product_images SET is_featured = 0 WHERE product_id = ?').run(id);
      }

      const piId = 'pi_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      db.prepare(`
        INSERT INTO product_images (
          id, product_id, media_asset_id, display_order, is_featured, alt_text_override, caption_override, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        piId,
        id,
        media_asset_id,
        nextOrder++,
        shouldBeFeatured ? 1 : 0,
        alt_text_override || null,
        caption_override || null,
        now,
        now
      );

      if (shouldBeFeatured) {
        db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(asset.file_url, now, id);
      }

      addedImages.push({
        id: piId,
        product_id: id,
        media_asset_id,
        file_url: asset.file_url,
        is_featured: shouldBeFeatured ? 1 : 0,
        display_order: nextOrder - 1,
      });
    }
    // Case 2: Upload new files directly into product gallery
    else if (rawFiles.length > 0) {
      const storage = getStorageProvider();
      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];
        const validation = validateAndInspectImage(file.buffer, file.mimetype, file.originalname);
        if (!validation.isValid) {
          return res.status(400).json({ success: false, message: `File "${file.originalname}": ${validation.error}` });
        }

        const uploadResult = await storage.uploadFile(file.buffer, file.originalname, validation.detectedMime || file.mimetype);
        const medId = 'med_' + Date.now() + '_' + i;
        const title = path.parse(file.originalname).name.replace(/[-_]+/g, ' ');

        db.prepare(`
          INSERT INTO media_assets (
            id, storage_key, original_filename, file_name, title, file_url,
            mime_type, file_size, width, height, alt_text, caption, created_by, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          medId,
          uploadResult.storageKey,
          file.originalname,
          file.originalname,
          title,
          uploadResult.fileUrl,
          validation.detectedMime || file.mimetype,
          uploadResult.fileSize,
          validation.width || null,
          validation.height || null,
          title,
          null,
          userId,
          now,
          now
        );

        const shouldBeFeatured = (i === 0 && !hasFeatured) || is_featured === true || is_featured === '1';
        if (shouldBeFeatured) {
          db.prepare('UPDATE product_images SET is_featured = 0 WHERE product_id = ?').run(id);
        }

        const piId = 'pi_' + Date.now() + '_' + i;
        db.prepare(`
          INSERT INTO product_images (
            id, product_id, media_asset_id, display_order, is_featured, alt_text_override, caption_override, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          piId,
          id,
          medId,
          nextOrder++,
          shouldBeFeatured ? 1 : 0,
          alt_text_override || title,
          caption_override || null,
          now,
          now
        );

        if (shouldBeFeatured) {
          db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(uploadResult.fileUrl, now, id);
        }

        addedImages.push({
          id: piId,
          product_id: id,
          media_asset_id: medId,
          file_url: uploadResult.fileUrl,
          is_featured: shouldBeFeatured ? 1 : 0,
          display_order: nextOrder - 1,
        });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Please provide either media_asset_id or files to upload.' });
    }

    res.json({
      success: true,
      message: 'Product gallery updated successfully.',
      data: addedImages,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. Update Product Image (Set Featured, Change Order, Edit Alt Text/Caption)
app.patch('/api/admin/products/:id/images/:imageId', requireAdminAuth, (req, res) => {
  try {
    const { id, imageId } = req.params;
    const { is_featured, display_order, alt_text_override, caption_override } = req.body;
    const now = new Date().toISOString();

    const pImage: any = db.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?').get(imageId, id);
    if (!pImage) {
      return res.status(404).json({ success: false, message: 'Product image association not found.' });
    }

    if (is_featured === 1 || is_featured === true || is_featured === '1') {
      db.prepare('UPDATE product_images SET is_featured = 0, updated_at = ? WHERE product_id = ?').run(now, id);
      db.prepare('UPDATE product_images SET is_featured = 1, updated_at = ? WHERE id = ?').run(now, imageId);

      const asset: any = db.prepare('SELECT file_url FROM media_assets WHERE id = ?').get(pImage.media_asset_id);
      if (asset) {
        db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(asset.file_url, now, id);
      }
    }

    db.prepare(`
      UPDATE product_images SET
        display_order = COALESCE(?, display_order),
        alt_text_override = COALESCE(?, alt_text_override),
        caption_override = COALESCE(?, caption_override),
        updated_at = ?
      WHERE id = ?
    `).run(
      display_order ?? null,
      alt_text_override ?? null,
      caption_override ?? null,
      now,
      imageId
    );

    res.json({ success: true, message: 'Product image details updated.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 10. Reorder Product Images Gallery
app.post('/api/admin/products/:id/images/reorder', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body; // array of { id: string, display_order: number }
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Expected order array with item IDs and order numbers.' });
    }

    const stmt = db.prepare('UPDATE product_images SET display_order = ?, updated_at = ? WHERE id = ? AND product_id = ?');
    const now = new Date().toISOString();
    for (const item of order) {
      stmt.run(item.display_order, now, item.id, id);
    }

    res.json({ success: true, message: 'Gallery ordering persisted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 11. Remove Image Association from Product (Preserves Media Asset in Library)
app.delete('/api/admin/products/:id/images/:imageId', requireAdminAuth, (req, res) => {
  try {
    const { id, imageId } = req.params;
    const target: any = db.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?').get(imageId, id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Product image association not found.' });
    }

    db.prepare('DELETE FROM product_images WHERE id = ?').run(imageId);

    // If removed image was featured, promote the first remaining image
    if (target.is_featured === 1) {
      const next: any = db.prepare(`
        SELECT pi.*, ma.file_url
        FROM product_images pi
        JOIN media_assets ma ON pi.media_asset_id = ma.id
        WHERE pi.product_id = ?
        ORDER BY pi.display_order ASC
        LIMIT 1
      `).get(id);

      const now = new Date().toISOString();
      if (next) {
        db.prepare('UPDATE product_images SET is_featured = 1, updated_at = ? WHERE id = ?').run(now, next.id);
        db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(next.file_url, now, id);
      } else {
        db.prepare('UPDATE products SET featured_image = NULL, updated_at = ? WHERE id = ?').run(now, id);
      }
    }

    res.json({ success: true, message: 'Image successfully removed from product gallery.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 12. Replace Product Image with New Upload or Existing Asset
app.post('/api/admin/products/:id/images/:imageId/replace', requireAdminAuth, memoryUpload.single('file'), async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const { new_media_asset_id } = req.body;
    const file = req.file;
    const now = new Date().toISOString();
    const userId = (req as any).user?.id || 'usr_admin_1';

    const existing: any = db.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?').get(imageId, id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product image not found.' });
    }

    let targetMediaId = new_media_asset_id;
    let targetFileUrl = '';

    if (file) {
      const validation = validateAndInspectImage(file.buffer, file.mimetype, file.originalname);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, message: validation.error });
      }

      const storage = getStorageProvider();
      const uploadResult = await storage.uploadFile(file.buffer, file.originalname, validation.detectedMime || file.mimetype);
      targetMediaId = 'med_' + Date.now();
      const title = path.parse(file.originalname).name.replace(/[-_]+/g, ' ');

      db.prepare(`
        INSERT INTO media_assets (
          id, storage_key, original_filename, file_name, title, file_url,
          mime_type, file_size, width, height, alt_text, caption, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        targetMediaId,
        uploadResult.storageKey,
        file.originalname,
        file.originalname,
        title,
        uploadResult.fileUrl,
        validation.detectedMime || file.mimetype,
        uploadResult.fileSize,
        validation.width || null,
        validation.height || null,
        title,
        null,
        userId,
        now,
        now
      );
      targetFileUrl = uploadResult.fileUrl;
    } else if (new_media_asset_id) {
      const asset: any = db.prepare('SELECT file_url FROM media_assets WHERE id = ?').get(new_media_asset_id);
      if (!asset) {
        return res.status(404).json({ success: false, message: 'Selected media asset not found.' });
      }
      targetFileUrl = asset.file_url;
    } else {
      return res.status(400).json({ success: false, message: 'Must provide either a replacement file or new_media_asset_id.' });
    }

    db.prepare('UPDATE product_images SET media_asset_id = ?, updated_at = ? WHERE id = ?').run(targetMediaId, now, imageId);

    if (existing.is_featured === 1) {
      db.prepare('UPDATE products SET featured_image = ?, updated_at = ? WHERE id = ?').run(targetFileUrl, now, id);
    }

    res.json({
      success: true,
      message: 'Product gallery image replaced successfully.',
      data: {
        id: imageId,
        media_asset_id: targetMediaId,
        file_url: targetFileUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Users
app.get('/api/admin/users', (_req, res) => {
  try {
    const users = db.prepare('SELECT id, email, first_name, last_name, role, is_active, created_at FROM admin_users ORDER BY created_at ASC').all();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Admin User
app.post('/api/admin/users', (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const authUserId = token?.startsWith('siwi_admin_token_') ? token.replace('siwi_admin_token_', '') : 'usr_admin_1';

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'All fields (email, password, first name, last name) are required.' });
    }

    const emailTrimmed = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({ success: false, message: 'Invalid email format provided.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(emailTrimmed);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An administrative account with this email address already exists.' });
    }

    const validRoles = ['SUPER_ADMIN', 'CONTENT_EDITOR', 'ENQUIRY_MANAGER', 'VIEWER'];
    const assignedRole = validRoles.includes(role) ? role : 'CONTENT_EDITOR';
    const id = 'usr_admin_' + Date.now();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(id, emailTrimmed, String(password), String(first_name).trim(), String(last_name).trim(), assignedRole, now, now);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'CREATE_ADMIN_USER', 'ADMIN_USER', ?, ?, ?)
    `).run('aud_' + Date.now(), authUserId, id, `Created admin account for ${first_name} ${last_name} (${emailTrimmed}, role: ${assignedRole})`, now);

    res.status(201).json({
      success: true,
      message: 'Administrator account created successfully.',
      data: {
        id,
        email: emailTrimmed,
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        role: assignedRole,
        is_active: 1,
        created_at: now,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Admin User Status / Role
app.patch('/api/admin/users/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, role } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const authUserId = token?.startsWith('siwi_admin_token_') ? token.replace('siwi_admin_token_', '') : 'usr_admin_1';

    const targetUser: any = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    if (id === authUserId && is_active === 0) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrative account.' });
    }

    if (is_active === 0 && targetUser.role === 'SUPER_ADMIN') {
      const superAdminCount: any = db.prepare("SELECT COUNT(*) as c FROM admin_users WHERE role = 'SUPER_ADMIN' AND is_active = 1").get();
      if (superAdminCount.c <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot deactivate the sole remaining active Super Administrator.' });
      }
    }

    const newActive = is_active !== undefined ? (is_active ? 1 : 0) : targetUser.is_active;
    const newRole = role !== undefined ? role : targetUser.role;
    const now = new Date().toISOString();

    db.prepare('UPDATE admin_users SET is_active = ?, role = ?, updated_at = ? WHERE id = ?').run(newActive, newRole, now, id);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'UPDATE_ADMIN_STATUS', 'ADMIN_USER', ?, ?, ?)
    `).run('aud_' + Date.now(), authUserId, id, `Updated user ${targetUser.email} (active: ${newActive}, role: ${newRole})`, now);

    res.json({
      success: true,
      message: 'Admin user status updated successfully.',
      data: { id, is_active: newActive, role: newRole },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Secondary Admin User
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const authUserId = token?.startsWith('siwi_admin_token_') ? token.replace('siwi_admin_token_', '') : 'usr_admin_1';

    if (id === authUserId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own administrative account.' });
    }

    if (id === 'usr_admin_1') {
      return res.status(403).json({ success: false, message: 'The primary root administrator account cannot be deleted.' });
    }

    const targetUser: any = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);

    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'DELETE_ADMIN_USER', 'ADMIN_USER', ?, ?, ?)
    `).run('aud_' + Date.now(), authUserId, id, `Deleted operator account ${targetUser.email}`, now);

    res.json({ success: true, message: `Admin account ${targetUser.email} deleted successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Logged-in Admin Credentials (Email / ID and Password)
app.put('/api/admin/users/me/credentials', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const userId = token?.startsWith('siwi_admin_token_') ? token.replace('siwi_admin_token_', '') : 'usr_admin_1';

    const currentUser: any = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(userId);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Active administrative session not found.' });
    }

    const { current_password, new_email, first_name, last_name, new_password } = req.body;

    if (!current_password) {
      return res.status(400).json({ success: false, message: 'Your current administrative password is required to authorize credentials changes.' });
    }

    if (currentUser.password_hash !== current_password) {
      return res.status(403).json({ success: false, message: 'Current password verification failed. Please enter your valid current password.' });
    }

    let updatedEmail = currentUser.email;
    if (new_email && new_email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      const emailTrimmed = new_email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        return res.status(400).json({ success: false, message: 'Invalid format for new email address.' });
      }
      const existing = db.prepare('SELECT id FROM admin_users WHERE email = ? AND id != ?').get(emailTrimmed, userId);
      if (existing) {
        return res.status(409).json({ success: false, message: 'This email is already in use by another administrator.' });
      }
      updatedEmail = emailTrimmed;
    }

    let updatedPassword = currentUser.password_hash;
    if (new_password) {
      if (String(new_password).length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }
      updatedPassword = String(new_password);
    }

    const updatedFirstName = first_name !== undefined ? String(first_name).trim() : currentUser.first_name;
    const updatedLastName = last_name !== undefined ? String(last_name).trim() : currentUser.last_name;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE admin_users
      SET email = ?, password_hash = ?, first_name = ?, last_name = ?, updated_at = ?
      WHERE id = ?
    `).run(updatedEmail, updatedPassword, updatedFirstName, updatedLastName, now, userId);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, 'UPDATE_CREDENTIALS', 'ADMIN_USER', ?, ?, ?)
    `).run('aud_' + Date.now(), userId, userId, `Updated admin credentials (email: ${updatedEmail}, password_changed: ${!!new_password})`, now);

    res.json({
      success: true,
      message: 'Administrative credentials updated successfully.',
      data: {
        id: userId,
        email: updatedEmail,
        first_name: updatedFirstName,
        last_name: updatedLastName,
        role: currentUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin CMS Pages
app.get('/api/admin/pages', (_req, res) => {
  try {
    const pages = db.prepare('SELECT id, slug, title, content_json, status, updated_at FROM site_pages ORDER BY id ASC').all();
    res.json({ success: true, data: pages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/pages/:id', (req, res) => {
  try {
    const page = db.prepare('SELECT id, slug, title, content_json, status, updated_at FROM site_pages WHERE id = ? OR slug = ?').get(req.params.id, req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }
    res.json({ success: true, data: page });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/pages/:id', (req, res) => {
  try {
    const { title, content_json, status } = req.body;
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT id FROM site_pages WHERE id = ? OR slug = ?').get(req.params.id, req.params.id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }

    db.prepare(`
      UPDATE site_pages
      SET title = COALESCE(?, title),
          content_json = COALESCE(?, content_json),
          status = COALESCE(?, status),
          updated_at = ?
      WHERE id = ?
    `).run(title || null, typeof content_json === 'object' ? JSON.stringify(content_json) : content_json || null, status || null, now, existing.id);

    const updated = db.prepare('SELECT id, slug, title, content_json, status, updated_at FROM site_pages WHERE id = ?').get(existing.id);
    res.json({ success: true, message: 'Page content updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Global JSON error handling middleware (handles Multer errors, payload limits, etc.)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File upload exceeds maximum allowed size limit of 10MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`SIWI Global Ventures API Server running on port ${PORT}`);
});
