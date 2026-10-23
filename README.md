# Fixovia — On-Demand Home Services & Skilled Repair Marketplace 🛠️✨

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-blue)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-cyan)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Fixovia** is a market-ready, modern on-demand home repair and local services platform designed for Indian households and commercial facilities. It connects homeowners with background-verified, certified trade specialists (Electricians, Plumbers, AC Technicians, Carpenters) with upfront transparent pricing, doorstep OTP safety verification, and instant auto-dispatch.

---

## 🎨 Visual Identity & Architecture

- **Warm Minimalist Aesthetic**: Warm stone backgrounds (`#fafaf9`), crisp white cards, warm coral accents (`#e11d48`), soft diffuse shadows, and smooth 300ms interactive transitions.
- **Dedicated Portals**:
  - 👨 **Customer App**: Floating search bar, category slider, photo-rich technician cards, hybrid booking (browse vs instant auto-match), and real-time order tracking with Doorstep Safety OTP.
  - ⚡ **Partner Workspace**: 60-second dispatch radar, OTP job start verification, and earnings wallet.
  - 🛡️ **Admin Control Center**: KYC technician document review, live metrics, and dispute handling.

---

## 📁 Monorepo Structure

```
C:\Fixovia\
├── backend/                  # Spring Boot 3 + PostgreSQL REST API
│   ├── src/main/java/com/worksaathi/ (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/   # application.properties & application-dev.properties
│   ├── src/test/java/        # JUnit 5 & Mockito test suites
│   └── pom.xml
│
├── frontend/                 # Modular React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Navbar, Footer, Toast
│   │   │   ├── discovery/    # HeroSection, CategorySlider, WorkerCard, SearchBar
│   │   │   └── booking/      # BookingModal (Multi-step + GST price breakdown)
│   │   ├── context/          # AuthContext (Role Routing), ToastContext
│   │   ├── pages/            # Home, FindWorkers, WorkerProfile, CustomerDashboard, WorkerDashboard, AdminDashboard, AuthPage
│   │   ├── services/         # Centralized API client (api.js)
│   │   └── styles/           # globals.css & animations.css (Keyframes & transitions)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Frontend (React 18 + Vite)
```bash
cd frontend
npm install
npm run dev
```
- App URL: `http://localhost:5173`

### 2. Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
- REST API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| 👨 **Customer** | `customer@fixovia.in` | `demo123` |
| ⚡ **Partner / Worker** | `worker@fixovia.in` | `demo123` |
| 🛡️ **Admin** | `admin@fixovia.in` | `demo123` |

*(1-click demo buttons are also available on the Sign In page).*
