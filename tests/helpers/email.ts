import { google, gmail_v1 } from 'googleapis';

// Dibuat saat dipakai, supaya .env sudah terbaca lebih dulu
function buatGmailClient(): gmail_v1.Gmail {
  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return google.gmail({ version: 'v1', auth });
}

// Email unik di setiap run, tetapi semuanya masuk ke inbox yang sama
export function buatEmailUnik(): string {
  const alamat = process.env.GMAIL_ADDRESS;
  if (!alamat) throw new Error('GMAIL_ADDRESS belum diisi di .env');

  const [nama, domain] = alamat.split('@');
  return `${nama}+test${Date.now()}@${domain}`;
}

// Isi email di Gmail berbentuk base64 dan bisa bersarang
function ambilHtml(part?: gmail_v1.Schema$MessagePart): string {
  if (!part) return '';

  if (part.mimeType === 'text/html' && part.body?.data) {
    return Buffer.from(part.body.data, 'base64url').toString('utf-8');
  }

  for (const anak of part.parts ?? []) {
    const hasil = ambilHtml(anak);
    if (hasil) return hasil;
  }
  return '';
}

// Cari link berdasarkan teks tombolnya
function cariLink(html: string, teksTombol: string): string | null {
  const regex = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  for (const m of html.matchAll(regex)) {
    const teks = m[2].replace(/<[^>]+>/g, '').trim();
    if (teks.includes(teksTombol)) {
      return m[1].replace(/&amp;/g, '&');
    }
  }
  return null;
}

export async function ambilLinkKonfirmasi(
  email: string,
  teksTombol = 'Konfirmasi email saya'
): Promise<string> {
  const gmail = buatGmailClient();

  // Cek inbox berulang sampai email sampai (maks sekitar 40 detik)
  for (let i = 0; i < 20; i++) {
    const daftar = await gmail.users.messages.list({
      userId: 'me',
      q: `to:${email}`,
      maxResults: 1,
    });

    const id = daftar.data.messages?.[0]?.id;

    if (id) {
      const pesan = await gmail.users.messages.get({
        userId: 'me',
        id,
        format: 'full',
      });

      const html = ambilHtml(pesan.data.payload);
      const link = cariLink(html, teksTombol);
      if (link) return link;
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error(`Email konfirmasi untuk ${email} tidak ditemukan`);
}