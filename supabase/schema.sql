-- ==============================================================
-- RUMAH JAHIT ZAHRIS - PRODUCTION DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ==============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  business_name TEXT NOT NULL DEFAULT 'Rumah Jahit ZAHRIS',
  tagline TEXT DEFAULT 'Jahit Sesuai Keinginan, Hasil Rapi, Nyaman Dipakai.',
  whatsapp TEXT NOT NULL DEFAULT '6281288997766',
  address TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  instagram TEXT DEFAULT '@rumahjahit.zahris',
  description TEXT,
  min_dp_percent INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS (KATALOG PO & SAMPLE)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  estimated_min_days INTEGER NOT NULL DEFAULT 5,
  estimated_max_days INTEGER NOT NULL DEFAULT 7,
  is_po BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL,
  sizes JSONB DEFAULT '["S", "M", "L", "XL", "Custom"]'::jsonb,
  allow_custom_size BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FABRICS (PILIHAN BAHAN OLEH ZAHRIS)
CREATE TABLE IF NOT EXISTS fabrics (
  id TEXT PRIMARY KEY DEFAULT ('fab-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_per_meter INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  is_in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DELIVERY AREAS (WILAYAH PENGANTARAN)
CREATE TABLE IF NOT EXISTS delivery_areas (
  id TEXT PRIMARY KEY DEFAULT ('area-' || uuid_generate_v4()::text),
  district TEXT NOT NULL,
  village TEXT NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT ('cust-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  total_orders INTEGER DEFAULT 1,
  total_spent INTEGER DEFAULT 0,
  last_order_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS (PESANAN CUSTOMER)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || uuid_generate_v4()::text),
  order_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  dp_required INTEGER NOT NULL,
  dp_paid INTEGER NOT NULL DEFAULT 0,
  remaining_amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  production_status TEXT NOT NULL DEFAULT 'PENDING',
  delivery_method TEXT NOT NULL DEFAULT 'PICKUP',
  delivery_address TEXT,
  delivery_area_id TEXT REFERENCES delivery_areas(id) ON DELETE SET NULL,
  measurements JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
  id TEXT PRIMARY KEY DEFAULT ('sh-' || uuid_generate_v4()::text),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT DEFAULT 'Admin'
);

-- 8. PAYMENTS (PENCATATAN PEMBAYARAN)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT ('pay-' || uuid_generate_v4()::text),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'DP' atau 'FINAL'
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BULK ORDERS (PESANAN BORONGAN)
CREATE TABLE IF NOT EXISTS bulk_orders (
  id TEXT PRIMARY KEY DEFAULT ('blk-' || uuid_generate_v4()::text),
  submission_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  target_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  clothing_type TEXT NOT NULL,
  fabric_provider TEXT NOT NULL,
  fabric_type TEXT,
  size_mode TEXT NOT NULL,
  measurement_option TEXT NOT NULL,
  measurement_location TEXT,
  desired_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY DEFAULT ('test-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(production_status);
CREATE INDEX IF NOT EXISTS idx_bulk_submission ON bulk_orders(submission_number);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- RLS (ROW LEVEL SECURITY) POLICIES
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public can read active products, fabrics, delivery areas, settings, and testimonials
CREATE POLICY "Public read business settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read fabrics" ON fabrics FOR SELECT USING (is_in_stock = true);
CREATE POLICY "Public read delivery areas" ON delivery_areas FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);

-- Public can insert new orders and bulk orders
CREATE POLICY "Public create order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order history" ON order_status_history FOR SELECT USING (true);
CREATE POLICY "Public create bulk order" ON bulk_orders FOR INSERT WITH CHECK (true);

-- Authenticated admins have full CRUD access
CREATE POLICY "Admins full access settings" ON business_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access fabrics" ON fabrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access delivery_areas" ON delivery_areas FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access orders" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access order history" ON order_status_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access payments" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access bulk orders" ON bulk_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access customers" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access testimonials" ON testimonials FOR ALL TO authenticated USING (true);
