-- ==============================================================
-- RUMAH JAHIT ZAHRIS - SEED DATA
-- ==============================================================

-- 1. BUSINESS SETTINGS
INSERT INTO business_settings (id, business_name, tagline, whatsapp, address, opening_hours, instagram, description, min_dp_percent)
VALUES (
  'default',
  'Rumah Jahit ZAHRIS',
  'Jahit Sesuai Keinginan, Hasil Rapi, Nyaman Dipakai.',
  '6281288997766',
  'Jl. Kemakmuran No. 18, Cipete Selatan, Jakarta Selatan',
  'Senin – Sabtu: 08:30 – 17:30 WIB (Minggu: Dengan Perjanjian)',
  '@rumahjahit.zahris',
  'Rumah Jahit ZAHRIS (Salamah Zahris, sejak 2018) adalah usaha jasa jahit keluarga terpercaya yang melayani jasa jahit custom, pre-order pakaian sample, pesanan borongan seragam, dan vermak pakaian dengan pengerjaan rapi dan nyaman dipakai.',
  50
) ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  whatsapp = EXCLUDED.whatsapp;

-- 2. PRODUCTS
INSERT INTO products (id, name, slug, category, price, estimated_min_days, estimated_max_days, is_po, is_active, description, sizes, allow_custom_size, images)
VALUES
(
  'prod-1',
  'Gamis Aira',
  'gamis-aira',
  'Gamis',
  185000,
  5,
  7,
  true,
  true,
  'Gamis anggun bernuansa modest modern dengan siluet jatuh yang anggun, lipit vertikal rapi, dan aksen bordir tailoring halus pada bagian dada. Cocok untuk pengajian, silaturahmi, maupun acara semi-formal keluarga.',
  '["S", "M", "L", "XL", "Custom"]'::jsonb,
  true,
  '["/images/product-gamis-aira.jpg"]'::jsonb
),
(
  'prod-2',
  'Kemeja Formal ZAHRIS',
  'kemeja-formal-zahris',
  'Kemeja',
  150000,
  4,
  6,
  true,
  true,
  'Kemeja pria lengan panjang dengan kerah kaku presisi, potongan tailor fit yang ergonomis, serta manset pergelangan berkancing ganda. Menggunakan katun toyobo fodu premium yang sejuk dan tidak mudah kusut.',
  '["S", "M", "L", "XL", "Custom"]'::jsonb,
  true,
  '["/images/product-kemeja-formal.jpg"]'::jsonb
),
(
  'prod-3',
  'Dress Family Sarimbit',
  'dress-family-sarimbit',
  'Dress & Sarimbit',
  225000,
  7,
  10,
  true,
  true,
  'Koleksi busana sarimbit keluarga yang dirancang serasi untuk momen Lebaran dan resepsi keluarga. Kombinasi kain batik tulis/cap dengan aksen polos premium, dijahit detail dengan furing katun adem.',
  '["S", "M", "L", "XL", "Custom"]'::jsonb,
  true,
  '["/images/product-sarimbit.jpg"]'::jsonb
),
(
  'prod-4',
  'Celana Chino Custom Fit',
  'celana-chino-custom-fit',
  'Celana',
  135000,
  3,
  5,
  true,
  true,
  'Celana chino pria/wanita dengan potongan semi-slim atau reguler sesuai kenyamanan Anda. Jahitan bar-tack ganda di titik tekanan untuk ketahanan maksimal.',
  '["S", "M", "L", "XL", "Custom"]'::jsonb,
  true,
  '["/images/product-celana.jpg"]'::jsonb
),
(
  'prod-5',
  'Tunik Modern ZAHRIS',
  'tunik-modern-zahris',
  'Tunik',
  165000,
  4,
  7,
  true,
  true,
  'Atasan tunik berpotongan asimetris modern dengan bukaan kancing depan ramah busui. Bahan jatuh halus dan tidak menerawang, sangat nyaman untuk aktivitas sehari-hari maupun kantor.',
  '["S", "M", "L", "XL", "Custom"]'::jsonb,
  true,
  '["/images/product-tunik.jpg"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. FABRICS
INSERT INTO fabrics (id, name, category, price_per_meter, description, is_in_stock)
VALUES
('fab-1', 'Katun Toyobo Fodu', 'Katun Premium', 45000, 'Kain katun impor Jepang dengan serat rapat, tidak menerawang, permukaan halus, sangat adem dan menyerap keringat.', true),
('fab-2', 'Linen Pure Look', 'Linen', 55000, 'Bahan berserat natural yang mewah, tekstur khas yang artistik, kuat, dan semakin lembut setelah dicuci berkali-kali.', true),
('fab-3', 'Rayon Twill Premium', 'Rayon', 38000, 'Tenunan twill yang kokoh namun tetap super jatuh (flowy), adem sepoi-sepoi, pas untuk gamis kasual dan homedress elegan.', true),
('fab-4', 'Wolfis Grade A Exclusive', 'Woolpeach', 35000, 'Bahan favorit untuk gamis dan hijab syar''i: jatuh sempurna, tebal tidak transparan, tidak mudah kusut, dan mudah disetrika.', true),
('fab-5', 'Silk Satin Roberto Cavalli', 'Satin Sutra', 48000, 'Satin berkualitas tinggi yang tidak gerah dan tidak licin berlebihan. Kilau lembut doff yang sangat mewah untuk gaun pesta.', true),
('fab-6', 'Japan Drill Unione', 'Drill', 50000, 'Pilihan utama seragam kantor, almamater, dan celana formal. Tebal, kokoh, tahan gesekan, serta warna awet tidak pudar.', true)
ON CONFLICT (id) DO NOTHING;

-- 4. DELIVERY AREAS
INSERT INTO delivery_areas (id, district, village, delivery_fee, is_active, notes)
VALUES
('area-1', 'Kebayoran Baru', 'Gandaria Utara', 15000, true, 'Radius 3 km dari Rumah Jahit ZAHRIS'),
('area-2', 'Kebayoran Baru', 'Cipete Utara', 15000, true, 'Wilayah terdekat Rumah Jahit'),
('area-3', 'Cilandak', 'Cipete Selatan', 15000, true, 'Wilayah sekitar Fatmawati & Cipete'),
('area-4', 'Cilandak', 'Gandaria Selatan', 20000, true, 'Radius 5 km'),
('area-5', 'Mampang Prapatan', 'Pela Mampang', 20000, true, 'Radius 6 km'),
('area-6', 'Pasar Minggu', 'Ragunan & Cilandak Timur', 25000, true, 'Radius 7 km')
ON CONFLICT (id) DO NOTHING;

-- 5. TESTIMONIALS
INSERT INTO testimonials (id, name, role, comment, rating, is_active)
VALUES
('test-1', 'Ibu Hj. Ratna Juwita', 'Pelanggan Jahit Custom & Sarimbit', 'Sudah langganan sejak 2019 di Rumah Jahit ZAHRIS. Jahitannya rapi sekali, jatuhnya pas di badan, dan tidak pernah meleset dari janji tanggal selesai. Keluarga selalu jahit di sini.', 5, true),
('test-2', 'Bpk Bambang Trihatmojo', 'Koordinator Seragam Kantor', 'Pesan 80 pcs seragam kemeja kantor. Tim ZAHRIS datang langsung ke kantor kami untuk pengukuran karyawan. Hasilnya memuaskan, bahan Toyobo yang disediakan juga dingin dan nyaman.', 5, true),
('test-3', 'Kak Nabila Syafitri', 'Pre-Order Gamis Aira', 'Pesan Gamis Aira via WhatsApp, pilih custom size karena saya tinggi 172cm. Pas sampai hasilnya pas banget! Obrasannya bersih dan rapi, worth it banget!', 5, true)
ON CONFLICT (id) DO NOTHING;
