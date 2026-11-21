# Dr. Adarsh Raghavan — Endocrine, Scarless & Breast Surgery Practice

Official clinical practice and super-specialty surgical website for **Dr. Adarsh Raghavan** (MBBS, MS, MCh Endocrine Surgery).

## Key Highlights & Features
- **Surgical Specialties**: Thyroid & Parathyroid (with IONM Recurrent Laryngeal Nerve Voice Preservation), Scarless Endoscopic Surgery (TOETVA & BABA), Laparoscopic/Retroperitoneoscopic Adrenalectomy, and Breast Conservation Surgery (BCS) & Oncoplasty.
- **Academic Foundation**: M.Ch Endocrine Surgery from Madras Medical College (MMC), MS from Kilpauk Medical College, and MBBS from Annamalai University. Recipient of International Travel Grant Awards from the Japan Surgical Society (JSS) and Asian Association of Endocrine Surgeons (AAES).
- **Dual Practice Locations in Chennai**:
  - **SIMS Hospital (SRM Institutes for Medical Science)**, 100 Feet Road, Vadapalani, Chennai - 600026 (Mon–Sat: 10:00 AM – 3:00 PM).
  - **Lifeline Multispeciality Hospitals**, New Avadi Road, Kilpauk, Chennai - 600010 (Mon–Sat: 4:30 PM – 7:30 PM).
- **Interactive AI Health Assistant**: Intelligent in-app chat engine trained on Dr. Adarsh's Chennai practice with smart offline local fallback + OpenAI/Gemini support.
- **Interactive Patient Hub**: Clinical guides for Thyroid Nodules/TIRADS, Scarless TOETVA, Parathyroid & Calcium, RLN Voice Safety, and Breast Lump Triple Assessment.
- **Clinical & Academic Gallery**: Categorized case library with fullscreen lightbox and secure admin upload portal.
- **Direct Appointment Booking Engine**: Integrated appointment form with instant feedback and email notifications.
- **Live Announcement Banner**: Top-of-page announcement bar with real-time editing via the admin portal.
- **Full Backend & Deployment Ready**: Express server with out-of-the-box file-based database, optional MySQL support, and Apache `.htaccess` rewrite rules for cPanel.

---

## Quick Start (Local Development)

### 1. Install Dependencies
```powershell
cd c:\Users\dines\CascadeProjects\dr-adarsh-raghavan-endocrine-surgery
npm install
```

### 2. Start Frontend
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Start Backend API Server
```powershell
npm run server
```
The server will run on `http://localhost:3002`.

---

## Production Build & cPanel Deployment

### 1. Build the Static Assets
```powershell
npm run build
```
This generates an optimized production bundle in the `dist/` directory.

### 2. cPanel Static Hosting:
1. Zip the contents of the `dist/` folder.
2. Log into your cPanel File Manager and navigate to `public_html` (or your subdomain folder).
3. Upload and extract the zip file.
4. The included `.htaccess` file ensures clean single-page routing without 404 errors on refresh.

### 3. Node.js Full-Stack cPanel Hosting:
1. In cPanel, click **Setup Node.js App**.
2. Select Node.js version 20 or higher.
3. Set the application startup file to `server/server.js`.
4. Run `npm install` and restart the application.

---

## Admin Portal Access
- Click **Practice Portal** in the Gallery section or **Staff Portal** in the footer.
- Default Admin Key: `Adarsh*321` (can be customized in `.env.local` or server environment).
