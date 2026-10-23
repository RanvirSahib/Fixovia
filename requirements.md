# Fixovia: Product Requirements Document (PRD) 🛠️✨

**Project Name**: Fixovia  
**Version**: 1.0.0 (Market-Ready Commercial Stage)  
**Workspace**: `C:\Fixovia`  
**Target Market**: Urban India (Tier 1 & Tier 2 Metros — Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Pune)  
**Design Aesthetic**: Modern Warm Minimalist Design System  

---

## 1. Executive Summary & Product Vision

**Fixovia** is an on-demand, mobile-first marketplace connecting homeowners and commercial establishments with background-verified, certified trade specialists (Electricians, Plumbers, AC Technicians, and Carpenters).

Moving beyond early prototypes, Fixovia is engineered for commercial viability with:
- **Warm, modern minimalism**: Warm stone surfaces, clean typography, photo-rich technician profiles, and subtle shadows.
- **Hybrid Booking Engine**: Customers can either hand-pick specific technicians or use 1-click Instant Auto-Match.
- **Doorstep Safety OTP**: A 4-digit security PIN shared between customer and worker upon arrival before work begins.
- **Dedicated, Role-Isolated Workspaces**: Clean separation between Customer Portal, Partner Workspace, and Admin Control Center (no confusing in-app role switchers).
- **Transparent Commercial Pricing**: Itemized breakdowns (Base Labor + Parts Estimate + 18% GST + Fixovia Protection Fee).

---

## 2. Target Personas & Core Workflows

### 2.1 The Customer (Homeowner / Tenant)
- **Goal**: Quickly find a reliable, verified repair pro at a fair price with zero friction.
- **Key Flow**:
  1. Search via floating search pill (Service, Slot, City/Pincode).
  2. Browse nearby technicians or choose Instant Auto-Match.
  3. Review technician rating (4.8+), badges, reviews, and visit rates.
  4. Complete 4-step booking modal (Service ➔ Slot ➔ Address ➔ Price Summary).
  5. Receive Doorstep Safety PIN and track technician state live.
  6. Verify pro at doorstep, inspect work, rate pro 5-stars, and download GST receipt.

### 2.2 The Service Partner (Electrician, Plumber, AC Tech, Carpenter)
- **Goal**: Receive a steady stream of high-paying local repair jobs without marketing overhead.
- **Key Flow**:
  1. Onboard via "Become a Partner" with KYC details.
  2. Toggle status between "Available" and "Offline".
  3. Receive real-time job dispatch cards with a **60-second pulsing radar timer**.
  4. Accept job ➔ Tap "On the Way" ➔ Tap "Arrived".
  5. Request customer's 4-digit Safety PIN and enter it in app to officially begin work.
  6. Complete job, input any parts cost, and receive instant credit in Partner Wallet.

### 2.3 The Administrator (Ops & Quality Assurance)
- **Goal**: Maintain high service quality, review KYC documents, and monitor platform metrics.
- **Key Flow**:
  1. Inspect pending technician verification queue (ID proof, background checks).
  2. 1-click Approve or Reject technician profiles.
  3. Monitor live booking volumes, revenue, and active workers across cities.

---

## 3. Core MVP Services Scope

Fixovia focuses on the four most critical, high-frequency emergency household repair trades:

| Category | Typical Repair Tasks | Pricing Model | Warranty Guarantee |
| :--- | :--- | :--- | :--- |
| ⚡ **Electrical** | Switchboard replacement, MCB tripping, fan installation, short circuit fix, inverter wiring | ₹199 inspection / fixed rate | 30-day rework warranty |
| 🔧 **Plumbing** | Tap leakage, drain unclogging, pipe fittings, geyser connection, sanitary repair | ₹199 inspection / fixed rate | 30-day rework warranty |
| ❄️ **AC Repair** | Deep jet-pump cleaning, gas refilling, compressor troubleshooting, cooling repair | ₹499 diagnostic / service rate | 60-day cooling warranty |
| 🔨 **Carpentry** | Door lock fix, hinge replacement, furniture assembly, wardrobe alignment, wood polish | ₹249 visit / fixed rate | 30-day rework warranty |

---

## 4. Visual Identity & Design System Requirements

### 4.1 Color Tokens
- **Background**: Soft Warm Stone (`#fafaf9` / `#f5f5f4`)
- **Card Surfaces**: Pure Elevated White (`#ffffff`) with subtle border (`#e7e5e4`)
- **Primary Brand Accent**: Warm Coral / Rose (`#e11d48` / `#be123c`)
- **Secondary Accent**: Forest Teal (`#0f766e` / `#115e59`)
- **Typography**: Charcoal (`#1c1917`), Slate (`#57534e`), Muted (`#a8a29e`)
- **Status Indicators**:
  - Success / Approved: Emerald (`#10b981`)
  - Pending / Active: Amber (`#f59e0b`)
  - Urgent / Expiring: Coral (`#e11d48`)

### 4.2 Interactive Animations & Transitions
- **Hover Lift**: Cards elevate by `-4px` with enhanced diffuse shadow on hover (`transition: all 0.3s ease`).
- **Page Transitions**: Smooth fade-in (`fadeIn 0.35s ease`) on route switch.
- **Staggered Grids**: Worker and category cards cascade with 100ms staggered animation delays.
- **Skeleton Shimmer**: Linear gradient shimmer loading states during async data fetches.
- **Directional Slide**: Booking modal transitions between steps with directional slides (left/right).
- **Pulse Radar**: Incoming job alerts on the Partner Workspace pulse with a 60-second countdown bar.

---

## 5. Functional Requirements Specification

### 5.1 Discovery & Search
- **FR-01 (Hero Search Bar)**: Floating pill search bar allowing input for Service Type, Time Slot (Today/Tomorrow/Custom), and Pincode/Area.
- **FR-02 (Category Slider)**: Horizontal scrollable strip of service categories with pricing anchors ("From ₹199").
- **FR-03 (Worker Filtering & Sorting)**: Real-time filtering by category, maximum hourly rate slider (₹200 - ₹2,000), minimum star rating (4.0+, 4.5+, 4.8+), and availability toggle.
- **FR-04 (Worker Profile View)**: Complete technician portfolio displaying experience years, completed jobs count, background check status, verified customer reviews, and direct booking trigger.

### 5.2 Hybrid Booking & Checkout
- **FR-05 (4-Step Booking Modal)**:
  - Step 1: Specific service task selection + problem description text.
  - Step 2: Date selection (Today, Tomorrow, Custom date) + time slot (Morning, Afternoon, Evening).
  - Step 3: Exact service address with landmark and optional gate instructions.
  - Step 4: Transparent price summary with itemized GST, platform fee, and payment method choice.
- **FR-06 (Price Breakdown Calculation)**:
  $$\text{Subtotal} = \text{Base Labor} + \text{Parts Estimate}$$
  $$\text{GST} = \text{round}(\text{Subtotal} \times 0.18)$$
  $$\text{Total Amount} = \text{Subtotal} + \text{GST} + ₹29 \text{ (Platform Fee)}$$

### 5.3 Doorstep Safety OTP System
- **FR-07 (OTP Generation)**: When a booking is accepted by a technician, a secure 4-digit PIN is generated and visible exclusively to the customer.
- **FR-08 (OTP Verification)**: The technician cannot advance the job state to `IN_PROGRESS` without entering the correct customer PIN upon physical doorstep arrival.

### 5.4 Dedicated Portals & State Machines
- **FR-09 (Customer Portal)**: Active booking card displaying live status stepper (`Requested` ➔ `Accepted` ➔ `On the Way` ➔ `Arrived` ➔ `In Progress` ➔ `Completed`), 4-digit Safety PIN display, and past booking history with review ratings.
- **FR-10 (Partner Workspace)**: Live job dispatch radar with 60s countdown timer, state advancement action buttons, and wallet ledger (Today's earnings, Week total, Pending payout).
- **FR-11 (Admin Control Center)**: Platform metrics dashboard (Total users, active workers, pending KYC, daily revenue) and 1-click KYC verification queue for newly registered technicians.
- **FR-12 (Clean Authentication)**: Clean tabbed interface separating Customer login and Partner onboarding. Strict role-based redirect upon login.

---

## 6. Technical Architecture & Tech Stack

### 6.1 Frontend (`C:\Fixovia\frontend`)
- **Framework**: React 18 (SPA)
- **Bundler & Tooling**: Vite 6, Vitest, Testing Library
- **State Management**: React Context (`AuthContext`, `ToastContext`)
- **Styling**: Vanilla CSS with custom properties (`globals.css`) and pure CSS keyframe animations (`animations.css`)
- **Responsive Layout**: Mobile-first responsive with dedicated sticky bottom navigation bar on screens `< 768px`.

### 6.2 Backend (`C:\Fixovia\backend`)
- **Framework**: Spring Boot 3.2.0 (Java 17)
- **Security**: Spring Security 6 with stateless JWT Bearer token authentication and BCrypt password hashing.
- **Data Access**: Spring Data JPA with Hibernate ORM.
- **Database**: PostgreSQL 18 (local port 1104, database `worksaathi_dev` / `fixovia_dev`).
- **Real-Time**: Spring WebSocket with STOMP messaging for instant job alerts and chat.
- **Documentation**: SpringDoc OpenAPI 3 & Swagger UI (`/swagger-ui/index.html`).

---

## 7. Data Models & API Endpoints

### 7.1 Core Entities
- **User**: `id`, `name`, `email`, `phone`, `password`, `role` (`CUSTOMER`, `WORKER`, `ADMIN`), `active`, `createdAt`.
- **Worker**: `id`, `user_id`, `bio`, `experienceYears`, `hourlyRate`, `dailyRate`, `availabilityStatus`, `verificationStatus`, `averageRating`, `totalReviews`.
- **Job**: `id`, `customer_id`, `worker_id`, `serviceType`, `status` (`REQUESTED`, `ACCEPTED`, `ON_THE_WAY`, `ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `scheduledDate`, `timeSlot`, `address`, `landmark`, `safetyPin`, `totalAmount`, `createdAt`.
- **Review**: `id`, `job_id`, `customer_id`, `worker_id`, `rating` (1-5), `comment`, `createdAt`.

### 7.2 Core REST Endpoints (`/api/v1`)
- `POST /auth/register` — Register customer or worker partner.
- `POST /auth/login` — Authenticate and issue JWT access token.
- `GET  /services` — List all active service categories.
- `GET  /workers` — Discover and filter verified service professionals.
- `POST /jobs` — Create a new service booking.
- `GET  /jobs/customer` — Fetch active and past bookings for logged-in customer.
- `GET  /jobs/worker` — Fetch assigned jobs and requests for logged-in technician.
- `POST /jobs/{id}/accept` — Worker accepts incoming booking.
- `POST /jobs/{id}/start` — Worker submits 4-digit PIN to begin service.
- `POST /jobs/{id}/complete` — Worker completes service.
- `POST /jobs/{id}/cancel` — Customer cancels requested booking.
- `GET  /admin/dashboard` — Platform operational metrics.
- `POST /admin/workers/{id}/verify` — Admin verifies technician KYC.

---

## 8. Non-Functional Requirements (NFR)

1. **Performance**:
   - Initial bundle size under 250 KB gzipped.
   - Page load & First Contentful Paint (FCP) under 1.2s.
   - Smooth 60 FPS transitions and animations.
2. **Security**:
   - Stateless JWT authentication with 24-hour token expiration.
   - Passwords encrypted using BCrypt (strength 10).
   - Strict CORS policy restricting requests to authorized Vite origins.
   - Role-based endpoint guards via Spring Security (`@PreAuthorize`).
3. **Ergonomics & Accessibility**:
   - Touch-friendly hit targets (minimum 44x44px for buttons).
   - High color contrast ratio (WCAG AA compliant).
   - Mobile-first responsive views down to 360px viewport width.

---

## 9. Verification & Quality Assurance Standards

1. **Automated Testing**:
   - Frontend: Vitest suite asserting API client, navigation, and state handlers.
   - Backend: JUnit 5 & Mockito test suites asserting 100% pass rate across `AuthService`, `JobService`, `WorkerService`, and `AdminService`.
2. **Live Service Health**:
   - `GET http://localhost:8080/api/v1` returns status `UP & RUNNING`.
   - `GET http://localhost:5173` renders Fixovia marketplace without JavaScript errors.
