# Fixovia Frontend 🛠️✨

Modern, high-performance on-demand home repair and services web application built with **React 18** and **Vite 6**.

## 🎨 Features

- **Warm Minimalist Design System**: Tailored stone palette (`#fafaf9`), crisp cards, warm coral accents (`#e11d48`), diffuse shadows, and smooth 300ms transitions.
- **Portals & Roles**:
  - 👨 **Customer Dashboard**: Instant auto-match or technician browsing, detailed service categories, photo-rich technician cards, live job status tracking, and Doorstep Safety PIN verification.
  - ⚡ **Partner / Worker Workspace**: Dispatch radar with 60-second response window, job verification via customer PIN, schedule and earnings wallet.
  - 🛡️ **Admin Control Center**: Verification KYC approvals, live marketplace metrics, dispute resolution, and audit logs.
- **Doorstep Safety OTP System**: 4-digit safety code generated for customers and verified by partners upon arrival.
- **Centralized API Client**: Fast async communication with the Fixovia Spring Boot backend (`/api/v1`) with fallback to local persistent state for demo reliability.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
Default API URL: `http://localhost:8080/api/v1`

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| 👨 **Customer** | `customer@fixovia.in` | `demo123` |
| ⚡ **Partner / Worker** | `worker@fixovia.in` | `demo123` |
| 🛡️ **Admin** | `admin@fixovia.in` | `demo123` |

*(Quick 1-click login buttons are also available on the Sign In page).*
