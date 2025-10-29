# Supabase Kurulum Rehberi

Bu proje Supabase ile gerçek bir veritabanı kullanır. Her kullanıcının kendi verileri vardır ve tüm cihazlarda senkronize çalışır.

## 1. Supabase Hesabı Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın ve yeni bir proje oluşturun
4. Proje adını girin ve şifre belirleyin (şifreyi kaydedin, önemli!)
5. Region olarak en yakın bölgeyi seçin (örn: `West US (N. California)`)

## 2. Database Schema Kurulumu

1. Supabase Dashboard'da projenize girin
2. Sol menüden **SQL Editor**'ı seçin
3. "New query" butonuna tıklayın
4. `supabase-schema.sql` dosyasındaki tüm SQL kodunu kopyalayın
5. SQL Editor'a yapıştırın ve "Run" butonuna tıklayın
6. "Success!" mesajını görmelisiniz

## 3. API Anahtarlarını Alma

1. Sol menüden **Settings** → **API** seçin
2. Şu bilgileri kopyalayın:
   - **Project URL** (örnek: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (JWT token ile başlayan uzun string)

## 4. Environment Variables Ayarlama

1. Proje klasöründe `.env.local` dosyası oluşturun:
   ```bash
   cp .env.local.example .env.local
   ```

2. `.env.local` dosyasını açın ve Supabase'den aldığınız değerleri yapıştırın:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 5. Email Authentication Ayarları (Opsiyonel)

Supabase varsayılan olarak email doğrulama gerektirir. Development için kapatabilirsiniz:

1. Settings → **Authentication** → **Email** sekmesine gidin
2. "Enable email confirmations" seçeneğini kapatın (development için)

## 6. Projeyi Çalıştırma

```bash
npm install
npm run dev
```

## Önemli Notlar

- **Her kullanıcının kendi verileri**: Row Level Security (RLS) sayesinde kullanıcılar sadece kendi verilerini görür
- **Gerçek zamanlı senkronizasyon**: Bir cihazda yaptığınız değişiklikler diğer cihazlarda anında görünür
- **Güvenlik**: Tüm veriler Supabase cloud'da güvenli bir şekilde saklanır
- **Ücretsiz Tier**: Supabase'in ücretsiz planı çoğu kullanım için yeterlidir (500MB database, 2GB bandwidth)

## Sorun Giderme

- **"Invalid API key" hatası**: `.env.local` dosyasındaki değerleri kontrol edin
- **"Relation does not exist" hatası**: `supabase-schema.sql` dosyasını çalıştırmayı unutmuş olabilirsiniz
- **Login çalışmıyor**: Authentication → Email ayarlarını kontrol edin

