# Dimas Lab — Experiments & Technical Playground

## 1. Concept

**Dimas Lab** adalah halaman khusus di portfolio yang berisi mini-project dan technical experiments.

Tujuannya bukan membuat banyak aplikasi besar, tetapi menunjukkan kemampuan:

- Mengeksplorasi teknologi.
- Mengintegrasikan third-party API.
- Membuat proof of concept.
- Membuat realtime feature.
- Mengolah data.
- Membuat AI integration.
- Menyelesaikan technical problem.

Semua experiment diusahakan menggunakan deployment yang sederhana:

> **Next.js + Vercel + Supabase**

External API hanya digunakan jika memang dibutuhkan oleh experiment.

---

# 2. Main Architecture

```text
                     VERCEL
                       │
                ┌──────┴──────┐
                │             │
             Next.js       API Routes
                │             │
                └──────┬──────┘
                       │
                    SUPABASE
                       │
          ┌────────────┼────────────┐
          │            │            │
      PostgreSQL     Storage      Realtime
          │
       pgvector
```

### Vercel

Digunakan untuk:

- Next.js frontend
- Server Components
- Server Actions
- API Routes / Route Handlers
- Server-side integration
- Environment variables
- Cron jika diperlukan

### Supabase

Digunakan untuk:

- PostgreSQL
- Authentication
- Storage
- Realtime
- pgvector
- Row Level Security

---

# 3. General Technology Stack

## Core

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Route Handlers
- Server Actions

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## File Storage

- Supabase Storage

## Realtime

- Supabase Realtime

## Vector Search

- pgvector

## Deployment

- Vercel
- Supabase

---

# 4. Experiment 01 — AI Chatbot

## Objective

Membuat mini AI customer assistant yang dapat langsung digunakan dari portfolio.

Tidak menggunakan n8n.

Flow:

```text
User
 ↓
Next.js Chat UI
 ↓
/api/chat
 ↓
Gemini API
 ↓
Response
 ↓
Chat UI
```

## Features

- Chat interface
- Conversation history
- Loading state
- Error handling
- Markdown response
- Clear conversation
- Streaming response jika provider mendukung

## Optional Database

Supabase dapat menyimpan:

```text
conversations
messages
```

Sehingga user dapat melihat riwayat percakapan.

## Stack

- Next.js
- TypeScript
- Supabase
- Gemini API

---

# 5. Experiment 02 — AI Knowledge Base

## Objective

Membuat aplikasi sederhana yang memungkinkan user mengupload dokumen lalu bertanya berdasarkan isi dokumen.

Flow:

```text
Upload Document
       ↓
Supabase Storage
       ↓
Text Extraction
       ↓
Chunking
       ↓
Embedding
       ↓
Supabase PostgreSQL
+ pgvector
       ↓
Semantic Search
       ↓
Gemini
       ↓
Answer + Citation
```

## Features

- Upload PDF/TXT/Markdown
- Document list
- Processing status
- Semantic search
- Chat interface
- Source citation
- Document preview
- Conversation history

## Database

```text
documents
document_chunks
conversations
messages
```

## Important

Untuk deployment Vercel, jangan membuat proses document processing yang terlalu berat.

MVP sebaiknya:

- Membatasi ukuran file.
- Membatasi jumlah dokumen.
- Menggunakan processing yang sesuai dengan serverless execution.
- Menghindari model LLM lokal besar.
- Menggunakan external embedding/LLM API atau model ringan.

Ollama/local LLM **bukan requirement**.

---

# 6. Experiment 03 — Payment Playground

## Objective

Menunjukkan kemampuan integrasi payment gateway, webhook, verification, dan transaction lifecycle.

Tidak perlu membuat marketplace.

Flow:

```text
Create Payment
      ↓
Payment Gateway
      ↓
Payment URL
      ↓
User Payment
      ↓
Webhook
      ↓
Vercel API Route
      ↓
Verify Event
      ↓
Supabase
      ↓
Update Transaction
```

## UI

```text
PAYMENT PLAYGROUND

Amount
Rp 100.000

Gateway

○ Xendit
○ BayarCash

[ CREATE PAYMENT ]
```

## Transaction Lifecycle

```text
CREATED
   ↓
PENDING
   ↓
WEBHOOK RECEIVED
   ↓
VERIFIED
   ↓
PAID
```

Failure:

```text
PENDING
   ↓
FAILED
```

## Features

- Create payment
- Generate payment URL
- Payment status
- Webhook handler
- Signature verification
- Idempotency
- Transaction timeline
- Webhook event log
- Retry simulation

## Supabase Tables

```text
transactions
payment_events
```

## Security

- Payment credentials hanya di Vercel Environment Variables.
- Jangan expose secret key ke client.
- Gunakan sandbox/test credentials.
- Validate webhook signature.
- Implementasikan idempotency.

---

# 7. Experiment 04 — Maps & Routing

## Objective

Membuat interactive route planner menggunakan layanan open/free.

Flow:

```text
User
 ↓
Next.js
 ↓
Leaflet
 ↓
OpenStreetMap
 ↓
OSRM
 ↓
Route Result
```

## Features

### Basic

- Origin
- Destination
- Calculate route
- Map visualization
- Distance
- Duration

### Advanced

- Multiple destinations
- Alternative routes
- Saved routes
- Route history
- Route optimization
- Geolocation

## Optional Supabase

Jika ingin menyimpan data:

```text
saved_routes
route_history
favorite_locations
```

## Stack

- Next.js
- Leaflet
- OpenStreetMap
- OSRM
- Supabase

---

# 8. Experiment 05 — Realtime Chat

## Objective

Menunjukkan kemampuan realtime application tanpa membuat WebSocket server sendiri.

Gunakan **Supabase Realtime**.

Flow:

```text
User A
 ↓
Next.js
 ↓
Supabase
 ↓
Realtime
 ↓
User B
```

## UI

```text
ROOM #123

Dimas:
Halo

Guest:
Halo juga

Dimas:
Testing realtime 👋
```

## Features

- Create room
- Join room
- Send message
- Typing indicator
- Online presence
- Message history
- Read status
- Online/offline status

## Stack

- Next.js
- Supabase Realtime
- Supabase PostgreSQL

---

# 9. Experiment 06 — Realtime Dashboard

## Objective

Membuat dashboard yang datanya berubah secara realtime.

Contoh:

```text
ACTIVE USERS        1,284
ONLINE USERS          427
ORDERS TODAY          382
ERROR RATE           0.8%
```

Chart dan metric berubah ketika data di database berubah.

Flow:

```text
Database Event
      ↓
Supabase Realtime
      ↓
Next.js Client
      ↓
Update UI
```

## Features

- Realtime metrics
- Live chart
- Activity feed
- Online users
- Event timeline

## Stack

- Next.js
- Supabase Realtime
- PostgreSQL
- Recharts / ApexCharts

---

# 10. Experiment 07 — AI Document Summarizer

## Objective

User upload dokumen dan mendapatkan summary otomatis.

Flow:

```text
Upload PDF
    ↓
Supabase Storage
    ↓
Text Extraction
    ↓
Gemini
    ↓
Summary
```

Output:

```text
SUMMARY

Key Points

• ...
• ...
• ...

Important Topics

Authentication
API Security
Authorization
```

## Features

- PDF upload
- Text extraction
- AI summarization
- Key points
- Summary length selection
- Copy result

## Stack

- Next.js
- Supabase Storage
- Gemini API

---

# 11. Experiment 08 — OCR Playground

## Objective

Mengubah gambar menjadi text dan memproses hasilnya.

Flow:

```text
Upload Image
      ↓
Supabase Storage
      ↓
OCR API
      ↓
Extract Text
      ↓
Structured Data
```

Contoh:

```text
STORE
Indomaret

DATE
12 Aug 2026

TOTAL
Rp 87.500
```

## Features

- Image upload
- OCR
- Text extraction
- Structured data extraction
- Copy result

---

# 12. Experiment 09 — API Monitor

## Objective

Membuat mini API monitoring dashboard.

User memasukkan endpoint:

```text
https://api.example.com/health
```

Dashboard:

```text
API MONITOR

API                  STATUS     RESPONSE

API Production       ● UP       142ms
API Staging          ● UP       231ms
Payment API          ● UP       387ms
Auth API             ● DOWN     ---
```

## Features

- HTTP health check
- Response time
- Status code
- Uptime history
- Error log
- Response headers

## Important Vercel Limitation

Jangan membuat monitoring dengan infinite-running worker.

Gunakan:

- Vercel Cron untuk scheduled checks.
- Supabase untuk menyimpan hasil monitoring.

Flow:

```text
Vercel Cron
     ↓
API Check
     ↓
Supabase
     ↓
Dashboard
```

---

# 13. Recommended Initial Experiments

Tidak perlu membuat semuanya.

Prioritas utama:

## 01 — AI Chatbot

```text
Next.js
+
Gemini
+
Supabase
```

Menunjukkan AI integration.

## 02 — Payment Playground

```text
Next.js
+
Payment Gateway
+
Webhook
+
Supabase
```

Menunjukkan API integration dan backend logic.

## 03 — Maps & Routing

```text
Next.js
+
Leaflet
+
OpenStreetMap
+
OSRM
```

Menunjukkan maps dan routing.

## 04 — Realtime Chat

```text
Next.js
+
Supabase Realtime
```

Menunjukkan realtime application.

Keempatnya sudah cukup untuk Dimas Lab versi pertama.

---

# 14. Recommended Project Structure

```text
app/
├── lab/
│   ├── page.tsx
│   │
│   ├── ai-chatbot/
│   │   └── page.tsx
│   │
│   ├── payment-playground/
│   │   └── page.tsx
│   │
│   ├── maps-routing/
│   │   └── page.tsx
│   │
│   └── realtime-chat/
│       └── page.tsx
│
├── api/
│   ├── chat/
│   ├── payments/
│   ├── webhooks/
│   ├── routing/
│   └── monitoring/
│
components/
├── lab/
├── chat/
├── payment/
├── maps/
└── realtime/

lib/
├── supabase/
├── ai/
├── payments/
├── maps/
└── utils/
```

---

# 15. Supabase Structure

## Authentication

Gunakan:

```text
Supabase Auth
```

## Database

Minimal:

```text
profiles

conversations
messages

transactions
payment_events

saved_routes

chat_rooms
chat_messages

monitoring_endpoints
monitoring_results
```

Tidak semua experiment wajib menggunakan semua tabel.

---

# 16. Environment Variables

Contoh:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

XENDIT_SECRET_KEY=
XENDIT_WEBHOOK_TOKEN=

BAYARCASH_API_KEY=
BAYARCASH_SECRET=
```

Secret key hanya boleh digunakan server-side.

Jangan menggunakan prefix `NEXT_PUBLIC_` untuk secret.

---

# 17. Deployment Strategy

## Vercel

Deploy:

```text
Next.js Application
```

Vercel menangani:

- Build
- Hosting
- Serverless Functions
- API Routes
- Environment Variables
- Cron

## Supabase

Menangani:

```text
Auth
PostgreSQL
Storage
Realtime
pgvector
```

## External Services

Hanya jika diperlukan:

```text
Gemini
Xendit
BayarCash
OSRM
OpenStreetMap
```

---

# 18. Services We Intentionally Avoid

Untuk menjaga deployment sederhana:

```text
❌ VPS
❌ Docker server
❌ Redis server
❌ BullMQ
❌ n8n
❌ Self-hosted LLM
❌ Custom WebSocket server
❌ Separate backend server
```

Bukan berarti teknologi tersebut buruk.

Tujuannya adalah memastikan project dapat dikelola dengan:

```text
GitHub
   ↓
Vercel
   ↓
Supabase
```

---

# 19. Experiment Detail Page

Contoh:

```text
/lab/ai-chatbot
```

Struktur:

```text
AI CHATBOT

AI customer assistant built with
Next.js and Gemini.

[ LIVE DEMO ]

────────────────────────────

Problem

Apa masalah yang ingin diselesaikan?

────────────────────────────

Solution

Bagaimana sistem menyelesaikannya?

────────────────────────────

Architecture

[ Architecture Diagram ]

────────────────────────────

Technologies

Next.js
TypeScript
Gemini
Supabase

────────────────────────────

Technical Challenges

Apa bagian tersulit?

────────────────────────────

Implementation

Bagaimana sistem bekerja?

────────────────────────────

Result

Apa hasilnya?
```

---

# 20. Lab Card

```text
┌────────────────────────────────────────┐
│ 🤖                                     │
│                                        │
│ AI CHATBOT                             │
│                                        │
│ AI assistant powered by Gemini         │
│ and Next.js.                           │
│                                        │
│ Gemini · Next.js · Supabase             │
│                                        │
│ [ VIEW ]                [ LIVE DEMO ]  │
└────────────────────────────────────────┘
```

Status:

```text
● LIVE
● EXPERIMENTAL
● ARCHIVED
```

---

# 21. Important Principle

Jangan membuat experiment hanya sebagai screenshot.

Setiap experiment sebaiknya:

```text
Explain
   ↓
Interact
   ↓
See Result
   ↓
Understand Technology
```

Contoh payment:

```text
Payment Playground

Amount
Rp 100.000

Gateway
Xendit

[CREATE PAYMENT]

Transaction Timeline
✓ Created
✓ Gateway Response
✓ Webhook Received
✓ Verified
✓ Paid
```

Recruiter/client harus dapat melihat kemampuan teknis secara langsung.

---

# 22. Serverless Design Rules

Karena aplikasi berjalan di Vercel:

### Jangan

- Menjalankan proses CPU-heavy terlalu lama.
- Mengandalkan local filesystem sebagai permanent storage.
- Membuat worker yang harus hidup terus.
- Menjalankan LLM besar di server.
- Menyimpan secret di client.

### Gunakan

- Supabase Storage untuk file.
- Supabase PostgreSQL untuk persistent data.
- Supabase Realtime untuk realtime.
- Vercel Functions untuk API.
- Vercel Cron untuk scheduled jobs.
- External AI API untuk inference.
- pgvector untuk semantic search.

---

# 23. Definition of Done

Sebuah experiment dianggap selesai jika:

- [ ] Memiliki tujuan yang jelas.
- [ ] Bisa dibuka dari `/lab`.
- [ ] Memiliki detail page.
- [ ] Bisa memiliki live demo jika memungkinkan.
- [ ] Memiliki technical explanation.
- [ ] Menampilkan teknologi yang digunakan.
- [ ] Memiliki error handling.
- [ ] Tidak menggunakan production credentials.
- [ ] Responsive.
- [ ] UI konsisten dengan portfolio utama.
- [ ] Bisa di-deploy ke Vercel.
- [ ] Data persistent menggunakan Supabase jika diperlukan.

---

# 24. Final Concept

Dimas Lab bukan kumpulan project random.

Posisikan sebagai:

> **A technical playground where I experiment with APIs, AI, realtime systems, payment infrastructure, maps and emerging technologies.**

Project utama portfolio menunjukkan **produk yang benar-benar dibangun**.

Dimas Lab menunjukkan:

> **how I explore technology and solve technical problems.**

Target deployment:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Supabase
```

Dengan pendekatan ini, Dimas Lab tetap terlihat sophisticated tetapi infrastrukturnya sederhana, murah, dan mudah dipelihara.
