import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang dipilih.' }, { status: 400 });
    }

    // Validasi tipe file gambar & dokumen (PDF, CSV, Excel)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.csv', '.xlsx'];
    const originalExt = path.extname(file.name).toLowerCase();

    if (!validExtensions.includes(originalExt)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Harap upload gambar (JPG, PNG, WEBP), file PDF, atau Excel/CSV.' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal ukuran file adalah 15MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan folder public/uploads ada
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Buat nama file unik dan aman
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `zahris-${timestamp}-${randomStr}${originalExt}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      originalName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error('Error uploading file:', err);
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan saat mengunggah file.' },
      { status: 500 }
    );
  }
}
