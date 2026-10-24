import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dbDir = path.resolve(process.cwd(), 'server/db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'siwi.sqlite');
export const db = new DatabaseSync(dbPath);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CONTENT_EDITOR',
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      parent_id TEXT,
      featured_image TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'PUBLISHED',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      primary_category_id TEXT,
      featured_image TEXT,
      packaging_type TEXT,
      available_pack_sizes TEXT,
      shelf_life TEXT,
      storage_conditions TEXT,
      processing_info TEXT,
      industrial_applications TEXT,
      seo_title TEXT,
      seo_description TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_specifications (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT,
      display_order INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      document_type TEXT NOT NULL,
      product_id TEXT,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER,
      is_public INTEGER DEFAULT 1,
      status TEXT DEFAULT 'PUBLISHED',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      storage_key TEXT UNIQUE,
      original_filename TEXT NOT NULL,
      file_name TEXT,
      title TEXT,
      file_url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      alt_text TEXT,
      caption TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      media_asset_id TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      alt_text_override TEXT,
      caption_override TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (media_asset_id) REFERENCES media_assets(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_images_media_asset_id ON product_images(media_asset_id);
    CREATE INDEX IF NOT EXISTS idx_product_images_featured ON product_images(product_id, is_featured);

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      reference_no TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      company_name TEXT NOT NULL,
      business_email TEXT NOT NULL,
      phone_number TEXT,
      country TEXT NOT NULL,
      product_of_interest TEXT NOT NULL,
      estimated_volume TEXT,
      preferred_packaging TEXT,
      destination_port TEXT,
      enquiry_details TEXT NOT NULL,
      status TEXT DEFAULT 'NEW',
      internal_notes TEXT,
      assigned_to TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content_json TEXT NOT NULL,
      status TEXT DEFAULT 'PUBLISHED',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Non-destructive column migrations for existing databases
  try {
    const mediaCols = (db.prepare("PRAGMA table_info(media_assets)").all() as any[]).map((c: any) => c.name);
    if (!mediaCols.includes('storage_key')) {
      db.exec('ALTER TABLE media_assets ADD COLUMN storage_key TEXT');
    }
    if (!mediaCols.includes('original_filename')) {
      db.exec('ALTER TABLE media_assets ADD COLUMN original_filename TEXT');
    }
    if (!mediaCols.includes('caption')) {
      db.exec('ALTER TABLE media_assets ADD COLUMN caption TEXT');
    }
    if (!mediaCols.includes('created_by')) {
      db.exec('ALTER TABLE media_assets ADD COLUMN created_by TEXT');
    }
    if (!mediaCols.includes('updated_at')) {
      db.exec('ALTER TABLE media_assets ADD COLUMN updated_at TEXT');
    }
  } catch (err) {
    console.warn('[DB Migration Warning]:', err);
  }

  seedInitialData();
  seedMediaAndProductImages();
  seedPages();
}

function seedInitialData() {
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (userCheck.count === 0) {
    const now = new Date().toISOString();

    // 1. Admin User
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run('usr_admin_1', 'admin@siwiglobal.com', 'admin123', 'Harshvardhan', 'Patil', 'SUPER_ADMIN', now, now);

    // 2. Categories
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `);
    insertCat.run('cat_dehydrated', 'Dehydrated Vegetable Products', 'dehydrated-vegetables', 'Export-grade dehydrated onion, garlic, and value-added vegetable ingredients for international food processors.', 1, now);
    insertCat.run('cat_other', 'Other Products', 'other-products', 'Flexible commercial commodity sourcing for international trade partners.', 2, now);

    // 3. Products
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, slug, short_description, description, status, featured, display_order, primary_category_id,
        featured_image, packaging_type, available_pack_sizes, shelf_life, storage_conditions, processing_info,
        industrial_applications, seo_title, seo_description, published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'PUBLISHED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProd.run(
      'prod_1',
      'Onion Powder',
      'onion-powder',
      'Dehydrated onion in fine, aromatic powder form for commercial food processing, seasonings, and culinary manufacturing.',
      'Our dehydrated onion powder is produced from selected Indian white and red onions through controlled dehydration and milling. The resulting fine powder provides consistent pungent aroma, natural sweetness, and immediate culinary dispersibility. Free from artificial fillers, additives, and preservatives, engineered for high-volume seasoning blenders and food processors.',
      1, 1, 'cat_dehydrated',
      '/assets/images/onion_powder_macro.jpg',
      'Multi-wall paper bags with food-grade inner PE liner, corrugated outer export cartons',
      '20 kg, 25 kg bags',
      '12–24 months under recommended storage',
      'Store in a cool, dry place away from direct sunlight and ambient humidity',
      'Selected raw onions undergo sorting, washing, peeling, slicing, controlled dehydration, metal detection, and cryogenic/ambient fine milling.',
      'Spice blends & rubs, dry soups, sauce manufacturing, instant gravies, meat marinades, extruded snacks, culinary services.',
      'Onion Powder Export | SIWI Global Ventures',
      'Premium dehydrated onion powder sourced and exported from India by SIWI Global Ventures for international commercial food manufacturers.',
      now, now, now
    );

    insertProd.run(
      'prod_2',
      'Garlic Powder',
      'garlic-powder',
      'Pure dehydrated garlic processed into a silky fine powder with robust aroma for food manufacturing and culinary formulation.',
      'Manufactured from selected Indian garlic bulbs, dehydrated under precise temperature controls to retain volatile allicin notes and authentic pungent flavour. Ideal for seasoning applications where smooth texture and instant flavour dispersion are critical.',
      1, 2, 'cat_dehydrated',
      '/assets/images/garlic_powder_macro.jpg',
      'Kraft paper bags with heavy-gauge poly liner, export carton boxes',
      '20 kg, 25 kg net weight',
      '18–24 months',
      'Cool, dry warehouse conditions below 25°C',
      'Inspected garlic cloves cleaned, peeled, dehydrated, pulverized, and sieved to fine mesh consistency.',
      'Instant seasonings, bakery mixes, savory snacks, ready meals, condiment manufacturing.',
      'Garlic Powder Export | SIWI Global Ventures',
      'Export-grade dehydrated garlic powder from India with verified aroma and high purity.',
      now, now, now
    );

    insertProd.run(
      'prod_3',
      'Garlic Granules',
      'garlic-granules',
      'Uniform dehydrated garlic granules offering clean texture, distinct particle release, and extended shelf stability.',
      'Controlled particle size dehydrated garlic granules that deliver distinct visual texture and sustained flavor release in culinary preparations, spice mills, and institutional food service blends.',
      1, 3, 'cat_dehydrated',
      '/assets/images/garlic_granules_macro.jpg',
      'Poly-lined multi-ply paper bags',
      '20 kg, 25 kg',
      '18 months',
      'Low humidity, sealed storage away from heat',
      'Selected garlic dried and coarsely crushed into calibrated mesh fractions.',
      'Table seasonings, spice grinders, bread coatings, pizza toppings, processed meats.',
      'Dehydrated Garlic Granules | SIWI Global Ventures',
      'High-grade dehydrated garlic granules exported from Mumbai, India to global markets.',
      now, now, now
    );

    insertProd.run(
      'prod_4',
      'Dehydrated Fried Onions',
      'dehydrated-fried-onions',
      'Crispy, dehydrated fried onion ribbons with delicate golden crunch and sweet savory depth for international foodservice and processing.',
      'Prepared by slicing premium fresh onions, frying in refined oil until golden, and carefully dehydrating to achieve an irresistible crispy texture without greasiness. Retains crispness over long transit and storage.',
      1, 4, 'cat_dehydrated',
      '/assets/images/fried_onions_macro.jpg',
      'Sealed moisture-barrier pouches inside heavy-duty cartons',
      '10 kg, 15 kg cartons',
      '12 months',
      'Keep tightly sealed in ambient cool environment',
      'Continuous frying and low-temperature moisture extraction under sanitary conditions.',
      'Burger toppings, noodle bowls, salad garnishes, gourmet ready-to-eat meals, soups.',
      'Dehydrated Fried Onions | SIWI Global Ventures',
      'Crispy golden fried onions exported for international culinary foodservice and manufacturing.',
      now, now, now
    );

    insertProd.run(
      'prod_5',
      'Birista',
      'birista',
      'Traditional deep-caramelized crispy fried onions prepared with authentic culinary care for premium culinary and commercial catering applications.',
      'Birista represents the pinnacle of caramelized fried onion craftsmanship. Deep amber-brown ribbons fried to uniform crispness, imparting authentic slow-cooked umami depth to Mughlai and international gourmet recipes.',
      1, 5, 'cat_dehydrated',
      '/assets/images/birista_macro.jpg',
      'Nitrogen-flushed foil bags in export cartons',
      '5 kg, 10 kg export packs',
      '12 months',
      'Cool and dry storage, protect from oxygen exposure',
      'Precision frying, oil drainage, and protective atmosphere packaging.',
      'Biryani formulation, curry pastes, restaurant commissary kitchens, institutional foodservice.',
      'Authentic Birista Fried Onions | SIWI Global Ventures',
      'Premium artisanal Birista crispy fried onions exported directly from India.',
      now, now, now
    );

    insertProd.run(
      'prod_6',
      'Onion Kibbles',
      'onion-kibbles',
      'Coarsely cut dehydrated onion flakes with excellent rehydration ratio for soups, sauces, stews, and food preparation.',
      'Onion kibbles consist of dehydrated onion flakes that readily reconstitute in liquid with texture, appearance, and flavour closely mimicking freshly cut onions.',
      1, 6, 'cat_dehydrated',
      '/assets/images/onion_kibbles_macro.jpg',
      'Multi-ply kraft bags with airtight inner liner',
      '20 kg, 25 kg bags',
      '18 months',
      'Dry warehouse, ambient temperatures',
      'Sliced raw onions dried in hot air dehydration tunnels, sieved for uniform flake geometry.',
      'Canned foods, dried soups, ready meals, meat stews, catering bases.',
      'Dehydrated Onion Kibbles | SIWI Global Ventures',
      'Export-quality dehydrated onion kibbles and flakes from Mumbai, India.',
      now, now, now
    );

    insertProd.run(
      'prod_8',
      'Other Products',
      'other-products',
      'Flexible international trade and export sourcing capabilities tailored to verified commercial client specifications.',
      'Beyond our core dehydrated vegetable collections, SIWI Global Ventures leverages extensive domestic sourcing networks to facilitate trade in verified Indian commodities upon buyer inquiry.',
      0, 7, 'cat_other',
      '/assets/images/mumbai_trade_port.jpg',
      'Customized to commodity specification',
      'Bulk / Commercial containers',
      'Per specification',
      'Per commodity requirement',
      'Verified domestic supply chain aggregation and export logistics coordination.',
      'International commodity trade, industrial supply, tailored commercial sourcing.',
      'Global Product Sourcing | SIWI Global Ventures',
      'Tailored B2B product sourcing and export trade coordination from Mumbai, India.',
      now, now, now
    );

    // 4. Product Specifications
    const insertSpec = db.prepare(`
      INSERT INTO product_specifications (id, product_id, name, value, unit, display_order, is_public)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    insertSpec.run('spec_1_1', 'prod_1', 'Product Form', 'Fine Powder', '', 1);
    insertSpec.run('spec_1_2', 'prod_1', 'Appearance', 'Free-flowing powder without lumps', '', 2);
    insertSpec.run('spec_1_3', 'prod_1', 'Colour', 'Creamish white to pale yellow', '', 3);
    insertSpec.run('spec_1_4', 'prod_1', 'Particle Size', '80 – 100', 'Mesh', 4);
    insertSpec.run('spec_1_5', 'prod_1', 'Origin', 'India', '', 5);

    insertSpec.run('spec_2_1', 'prod_2', 'Product Form', 'Fine Powder', '', 1);
    insertSpec.run('spec_2_2', 'prod_2', 'Appearance', 'Homogeneous fine powder', '', 2);
    insertSpec.run('spec_2_3', 'prod_2', 'Colour', 'Ivory to creamy white', '', 3);
    insertSpec.run('spec_2_4', 'prod_2', 'Particle Size', '80 – 100', 'Mesh', 4);
    insertSpec.run('spec_2_5', 'prod_2', 'Origin', 'India', '', 5);

    insertSpec.run('spec_3_1', 'prod_3', 'Product Form', 'Coarse Granules', '', 1);
    insertSpec.run('spec_3_2', 'prod_3', 'Particle Size', '24 – 40 / 40 – 60', 'Mesh', 2);
    insertSpec.run('spec_3_3', 'prod_3', 'Colour', 'Golden cream', '', 3);
    insertSpec.run('spec_3_4', 'prod_3', 'Origin', 'India', '', 4);

    insertSpec.run('spec_4_1', 'prod_4', 'Product Form', 'Crispy Sliced Ribbons', '', 1);
    insertSpec.run('spec_4_2', 'prod_4', 'Colour', 'Golden brown', '', 2);
    insertSpec.run('spec_4_3', 'prod_4', 'Texture', 'Crisp and brittle', '', 3);
    insertSpec.run('spec_4_4', 'prod_4', 'Origin', 'India', '', 4);

    insertSpec.run('spec_5_1', 'prod_5', 'Product Form', 'Caramelized Crispy Onion Flakes', '', 1);
    insertSpec.run('spec_5_2', 'prod_5', 'Colour', 'Deep amber-brown', '', 2);
    insertSpec.run('spec_5_3', 'prod_5', 'Culinary Grade', 'Gourmet Artisanal', '', 3);
    insertSpec.run('spec_5_4', 'prod_5', 'Origin', 'India', '', 4);

    insertSpec.run('spec_6_1', 'prod_6', 'Product Form', 'Coarse Dehydrated Kibbles', '', 1);
    insertSpec.run('spec_6_2', 'prod_6', 'Flake Dimensions', '3 – 8', 'mm', 2);
    insertSpec.run('spec_6_3', 'prod_6', 'Rehydration Rate', 'High', '', 3);
    insertSpec.run('spec_6_4', 'prod_6', 'Origin', 'India', '', 4);

    // 5. Site Settings
    const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
    insertSetting.run('company_name', 'SIWI Global Ventures');
    insertSetting.run('tagline', 'Serving with trust, delivering with quality.');
    insertSetting.run('phone', '+91 83696 35619');
    insertSetting.run('email', 'siwiglobalventure@gmail.com');
    insertSetting.run('location', 'Mumbai, Maharashtra, India');
    insertSetting.run('founder', 'Harshvardhan Patil');
    insertSetting.run('registered_address', 'G-3 Riverview Saraswati, Lt Road, Opposite Dahisar Station, Dahisar West, Mumbai-400068');
    insertSetting.run('gst_no', '27BGPPP7746J1ZN');
    insertSetting.run('iec_no', 'GBPPP7746J');
    insertSetting.run('primary_export_focus', 'Dehydrated Vegetable Products (Onion & Garlic)');
    insertSetting.run('secondary_export_focus', 'Agricultural & Traded Commodities');

    // 7. Audit Log
    const insertAudit = db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertAudit.run('aud_1', 'usr_admin_1', 'INITIALIZE_SYSTEM', 'SYSTEM', 'ROOT', 'Seeded initial SIWI Global Ventures product catalogue and business data', now);
  }
}

function seedMediaAndProductImages() {
  const mediaCount = (db.prepare('SELECT COUNT(*) as count FROM media_assets').get() as { count: number }).count;
  if (mediaCount > 0) return;

  const now = new Date().toISOString();
  const insertMedia = db.prepare(`
    INSERT INTO media_assets (
      id, storage_key, original_filename, file_name, title, file_url,
      mime_type, file_size, width, height, alt_text, caption, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'usr_admin_1', ?, ?)
  `);

  const initialAssets = [
    {
      id: 'med_onion_powder',
      key: 'products/onion_powder_macro.jpg',
      name: 'onion_powder_macro.jpg',
      title: 'Onion Powder Macro Texture',
      url: '/assets/images/onion_powder_macro.jpg',
      mime: 'image/jpeg',
      size: 827211,
      w: 1200,
      h: 900,
      alt: 'Dehydrated Onion Powder fine particle texture study',
    },
    {
      id: 'med_garlic_powder',
      key: 'products/garlic_powder_macro.jpg',
      name: 'garlic_powder_macro.jpg',
      title: 'Garlic Powder Macro Texture',
      url: '/assets/images/garlic_powder_macro.jpg',
      mime: 'image/jpeg',
      size: 734845,
      w: 1200,
      h: 900,
      alt: 'Pure dehydrated Garlic Powder ivory texture',
    },
    {
      id: 'med_garlic_granules',
      key: 'products/garlic_granules_macro.jpg',
      name: 'garlic_granules_macro.jpg',
      title: 'Garlic Granules Macro',
      url: '/assets/images/garlic_granules_macro.jpg',
      mime: 'image/jpeg',
      size: 834891,
      w: 1200,
      h: 900,
      alt: 'Uniform dehydrated Garlic Granules crystals',
    },
    {
      id: 'med_fried_onions',
      key: 'products/fried_onions_macro.jpg',
      name: 'fried_onions_macro.jpg',
      title: 'Fried Onions Golden Crispy',
      url: '/assets/images/fried_onions_macro.jpg',
      mime: 'image/jpeg',
      size: 825791,
      w: 1200,
      h: 900,
      alt: 'Golden crispy fried onion ribbons',
    },
    {
      id: 'med_birista',
      key: 'products/birista_macro.jpg',
      name: 'birista_macro.jpg',
      title: 'Artisanal Birista Fried Onions',
      url: '/assets/images/birista_macro.jpg',
      mime: 'image/jpeg',
      size: 938872,
      w: 1200,
      h: 900,
      alt: 'Authentic Indian Birista deep-caramelized crispy onions',
    },
    {
      id: 'med_onion_kibbles',
      key: 'products/onion_kibbles_macro.jpg',
      name: 'onion_kibbles_macro.jpg',
      title: 'Onion Kibbles Flakes',
      url: '/assets/images/onion_kibbles_macro.jpg',
      mime: 'image/jpeg',
      size: 852138,
      w: 1200,
      h: 900,
      alt: 'Dehydrated Onion Kibbles coarsely cut flakes',
    },
    {
      id: 'med_mumbai_port',
      key: 'products/mumbai_trade_port.jpg',
      name: 'mumbai_trade_port.jpg',
      title: 'Mumbai Maritime Logistics Port',
      url: '/assets/images/mumbai_trade_port.jpg',
      mime: 'image/jpeg',
      size: 833102,
      w: 1200,
      h: 900,
      alt: 'Mumbai container terminal maritime export hub',
    },
    {
      id: 'med_hero_still_life',
      key: 'products/hero_still_life.jpg',
      name: 'hero_still_life.jpg',
      title: 'Commercial Dehydrated Ingredients Study',
      url: '/assets/images/hero_still_life.jpg',
      mime: 'image/jpeg',
      size: 854864,
      w: 1200,
      h: 900,
      alt: 'Authentic spice and dehydrated ingredients composition',
    },
    {
      id: 'med_global_map',
      key: 'products/global_trade_map.jpg',
      name: 'global_trade_map.jpg',
      title: 'Global Trade Network Mumbai Hub',
      url: '/assets/images/global_trade_map.jpg',
      mime: 'image/jpeg',
      size: 789313,
      w: 1200,
      h: 900,
      alt: 'International maritime export routes centered on Mumbai',
    },
  ];

  for (const a of initialAssets) {
    insertMedia.run(
      a.id,
      a.key,
      a.name,
      a.name,
      a.title,
      a.url,
      a.mime,
      a.size,
      a.w,
      a.h,
      a.alt,
      a.title,
      now,
      now
    );
  }

  // Connect product image galleries
  const insertProdImg = db.prepare(`
    INSERT INTO product_images (
      id, product_id, media_asset_id, display_order, is_featured, alt_text_override, caption_override, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const productLinks = [
    { prodId: 'prod_1', mediaId: 'med_onion_powder', order: 1, featured: 1, alt: 'Onion Powder Primary Macro' },
    { prodId: 'prod_1', mediaId: 'med_hero_still_life', order: 2, featured: 0, alt: 'Dehydrated Ingredients Macro Composition' },
    { prodId: 'prod_2', mediaId: 'med_garlic_powder', order: 1, featured: 1, alt: 'Garlic Powder Primary Macro' },
    { prodId: 'prod_2', mediaId: 'med_hero_still_life', order: 2, featured: 0, alt: 'Culinary Processing Overview' },
    { prodId: 'prod_3', mediaId: 'med_garlic_granules', order: 1, featured: 1, alt: 'Garlic Granules Macro' },
    { prodId: 'prod_4', mediaId: 'med_fried_onions', order: 1, featured: 1, alt: 'Dehydrated Crispy Fried Onions' },
    { prodId: 'prod_4', mediaId: 'med_birista', order: 2, featured: 0, alt: 'Caramelized Onion Variation' },
    { prodId: 'prod_5', mediaId: 'med_birista', order: 1, featured: 1, alt: 'Authentic Indian Birista' },
    { prodId: 'prod_5', mediaId: 'med_fried_onions', order: 2, featured: 0, alt: 'Golden Fried Ribbon Comparison' },
    { prodId: 'prod_6', mediaId: 'med_onion_kibbles', order: 1, featured: 1, alt: 'Dehydrated Onion Kibbles' },
    { prodId: 'prod_6', mediaId: 'med_hero_still_life', order: 2, featured: 0, alt: 'Bulk Ingredient Sampling' },
    { prodId: 'prod_8', mediaId: 'med_mumbai_port', order: 1, featured: 1, alt: 'Mumbai Commercial Port Trade Operations' },
    { prodId: 'prod_8', mediaId: 'med_global_map', order: 2, featured: 0, alt: 'Global Trade Supply Routes' },
  ];

  productLinks.forEach((link, idx) => {
    insertProdImg.run(`pi_${idx + 1}`, link.prodId, link.mediaId, link.order, link.featured, link.alt, null, now, now);
  });
}

function seedPages() {
  const pageCount = (db.prepare('SELECT COUNT(*) as count FROM site_pages').get() as { count: number }).count;
  const now = new Date().toISOString();

  if (pageCount === 0) {
    const insertPage = db.prepare(`
      INSERT INTO site_pages (id, slug, title, content_json, status, updated_at)
      VALUES (?, ?, ?, ?, 'PUBLISHED', ?)
    `);

    insertPage.run(
      'page_home',
      'home',
      'Homepage',
      JSON.stringify({
        eyebrow: 'India · International Trade',
        headline: 'Indian products. Global possibilities.',
        description: 'SIWI Global Ventures connects quality Indian products with international markets through dependable trade partnerships and a focus on quality.',
        hero_statement: 'Export-grade dehydrated onion, garlic, and value-added vegetable ingredients for international food processors.',
      }),
      now
    );

    insertPage.run(
      'page_about',
      'about',
      'About Us',
      JSON.stringify({
        eyebrow: 'Company & Foundation · International Trade',
        headline: 'Connecting Indian products with global opportunity.',
        tagline: 'Serving with trust, delivering with quality.',
        founder_quote: 'Our commitment is transparent trade, verified specifications, and long-term partnerships with commercial importers worldwide.',
      }),
      now
    );

    insertPage.run(
      'page_contact',
      'contact',
      'Contact Us',
      JSON.stringify({
        eyebrow: 'Commercial Trade Desk',
        headline: 'Direct commercial engagement with our Mumbai desk.',
        office_hours: 'Monday through Saturday, 09:00 - 19:00 IST',
      }),
      now
    );
  }
}
