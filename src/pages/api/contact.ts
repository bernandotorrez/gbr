import type { APIRoute } from 'astro';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { sanitizeText, sanitizePhoneNumber, sanitizeEmail } from '../../lib/sanitize';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { nama, no_hp, email, tipe_rumah_diminati, pesan, recaptcha_token } = body;

    // 1. Google reCAPTCHA v3 Server-Side Secret Key Verification
    const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;
    if (secretKey && !secretKey.includes('placeholder')) {
      if (!recaptcha_token) {
        return new Response(
          JSON.stringify({ success: false, error: 'Token verifikasi keamanan tidak ditemukan.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: recaptcha_token
        })
      });

      const verifyData = await verifyRes.json();
      // Google risk score: 0.0 (bot) - 1.0 (human). Threshold >= 0.5
      if (!verifyData.success || (verifyData.score !== undefined && verifyData.score < 0.5)) {
        console.warn('reCAPTCHA score too low:', verifyData);
        return new Response(
          JSON.stringify({ success: false, error: 'Aktivitas mencurigakan terdeteksi oleh sistem keamanan.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Strict Input Sanitization
    const cleanNama = sanitizeText(nama || '').slice(0, 100);
    const cleanNoHp = sanitizePhoneNumber(no_hp || '').slice(0, 20);
    const cleanEmail = email ? sanitizeEmail(email) : null;
    const cleanTipe = tipe_rumah_diminati ? sanitizeText(tipe_rumah_diminati).slice(0, 80) : null;
    const cleanPesan = sanitizeText(pesan || '').slice(0, 1000);

    if (cleanNama.length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nama minimal 3 karakter.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (cleanNoHp.length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nomor WhatsApp minimal 10 digit.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (cleanPesan.length < 5) {
      return new Response(
        JSON.stringify({ success: false, error: 'Pesan minimal 5 karakter.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Save Lead into Supabase
    if (!isSupabaseConfigured()) {
      return new Response(
        JSON.stringify({ success: true, message: 'Simulated submission (development mode)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabase.from('leads').insert([
      {
        nama: cleanNama,
        no_hp: cleanNoHp,
        email: cleanEmail,
        tipe_rumah_diminati: cleanTipe,
        pesan: cleanPesan
      }
    ]);

    if (error) {
      console.error('Error inserting lead to Supabase:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Contact API Error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
