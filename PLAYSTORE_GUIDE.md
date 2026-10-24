# ROYAL SHOES — GOOGLE PLAY STORE & MOBILE APP LAUNCH GUIDE
**Official Mobile App & Store Management Suite | Black & Gold Edition**

This guide explains how to install the **ROYAL SHOES** application on your mobile phone immediately, and how to publish it to the **Google Play Store** whenever you are ready.

---

## 1. APP SPECIFICATIONS

- **App Name:** `ROYAL SHOES`
- **Package ID:** `com.royalshoes.store`
- **Platform:** Android & Web (PWA / Capacitor / TWA)
- **Primary Color:** `#080808` (Luxury Deep Black)
- **Accent Color:** `#D4AF37` (Royal Gold)
- **Production Server:** `https://royalshoes.store`
- **Default Start URL:** `/admin` (or `/` with instant executive switch)

---

## 2. METHOD 1: INSTANT INSTALL ON ANDROID (NO WAITING)

You and your customers do not need to wait for Google Play Store review to start using the app on your Android phone today:

1. Open **Google Chrome** or **Samsung Internet** on your Android phone.
2. Visit: **`https://royalshoes.store/admin`** (or `https://royalshoes.store`).
3. You will see a luxury gold popup at the bottom: **`📲 INSTALL ROYAL SHOES APP`**.
4. Tap **`INSTALL APP`** (or tap the 3 dots in Chrome and select **`Install App`** / **`Add to Home screen`**).
5. The **ROYAL SHOES** icon will appear on your phone's home screen and app drawer.
6. When opened, it runs in **fullscreen standalone app mode** (without any browser address bar), with full access to live orders, stock adjustments, customer WhatsApp confirmation, and real-time sales reports!

---

## 3. METHOD 2: GOOGLE PLAY STORE PUBLISHING (STEP-BY-STEP)

When you are ready to launch **ROYAL SHOES** on the Google Play Store for the public, follow these exact steps:

### Option A: Via PWABuilder (Google-Approved Trusted Web Activity) — Easiest & Fastest
1. Open [PWABuilder.com](https://www.pwabuilder.com) on your computer.
2. Enter your live website URL: `https://royalshoes.store` and click **Start**.
3. It will verify your `manifest.json`, Service Worker, and 512x512 Gold & Black icons (all 100% compliant).
4. Click **Package for Stores** > **Android**.
5. Configure package settings:
   - **Package ID:** `com.royalshoes.store`
   - **App Name:** `ROYAL SHOES`
   - **Launcher Name:** `Royal Shoes`
   - **Theme color:** `#080808`
   - **Nav color:** `#080808`
6. Click **Generate Package**. PWABuilder will automatically compile and download a ready-to-upload **`.aab` (Android App Bundle)** signed and formatted for Google Play!

---

### Option B: Via Native Capacitor & Android Studio (Direct Local Build)

#### Step 1: Install Capacitor Android Dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

#### Step 2: Initialize Android Project
```bash
npx cap add android
```
This generates the native `android/` folder with `AndroidManifest.xml`, gradle scripts, and native Android wrappers.

#### Step 3: Sync Assets
```bash
npx cap sync
```

#### Step 4: Open in Android Studio
```bash
npx cap open android
```

#### Step 5: Generate Production Keystore (One-Time)
Run in terminal to generate your release signature:
```bash
keytool -genkey -v -keystore royalshoes-key.keystore -alias royalshoes -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 6: Build Signed `.aab` for Google Play
1. In Android Studio, go to top menu: **`Build > Generate Signed Bundle / APK`**.
2. Select **`Android App Bundle`** (`.aab`).
3. Select your `royalshoes-key.keystore` file.
4. Choose **`release`** variant and click **Finish**.
5. Android Studio outputs your final `app-release.aab` file!

---

## 4. GOOGLE PLAY CONSOLE UPLOAD CHECKLIST

1. Log in to your [Google Play Console](https://play.google.com/console).
2. Click **Create App**:
   - **App name:** `ROYAL SHOES`
   - **Default language:** English (or Urdu)
   - **App or game:** App
   - **Free or paid:** Free
3. In **Store Presence > Main Store Listing**:
   - Short description: `Handcrafted luxury footwear, real-time catalog, and royal privilege shopping.`
   - Full description: `Step into elegance with ROYAL SHOES. Handcrafted luxury footwear, artisanal leather bags, and refined accessories with nationwide delivery across Pakistan.`
   - App icon: Upload `public/brand/icon-512.png`.
   - Feature graphic: Upload `public/hero/hero-campaign.jpg` (1024x500).
4. In **Release > Production**:
   - Create new release and upload the `app-release.aab` file.
   - Enter release notes: `Initial release of ROYAL SHOES VIP luxury footwear application.`
5. Click **Review & Rollout to Production**!

---

## 5. FEATURES AVAILABLE INSIDE THE ROYAL SHOES APP

| Feature | Location | Capability |
| :--- | :--- | :--- |
| **Live Order Lifecycle** | `/admin/orders` | Pending, Confirmed, Shipped, Delivered, Cancelled tracking. |
| **WhatsApp Customer Messaging** | `/admin/orders` | 1-click automated WhatsApp order confirmation and courier tracking. |
| **Catalog & Products** | `/admin/products` | Add new shoes, edit pricing, manage sizes, colors, and images. |
| **Stock & Inventory Reserves** | `/admin/stock` | Real-time pairs count, `+1/-1` quick adjust, low-stock warnings (< 3 pairs). |
| **Sales & Revenue Intelligence**| `/admin/reports` | Today, 7-day, monthly revenue, 14-day graph, and top-selling models. |
| **VIP Promo Codes Desk** | `/admin/promos` | Create percentage, fixed, or free-shipping vouchers with customer limits. |
| **Manual Payment Verification** | `/admin/payments` | Validate Easypaisa TRX IDs and direct bank receipts before dispatch. |
| **Executive Store Settings** | `/admin/settings` | Delivery fees, WhatsApp concierge number, and top announcement bar. |
