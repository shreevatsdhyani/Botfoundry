# 🤖 BotFoundry — AI Chatbot Builder Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Build, deploy, and manage custom AI chatbots powered by your own documents.**

</div>


## Overview

BotFoundry is a full-stack platform that lets you create custom AI chatbots trained on your own documents (PDF, DOCX, TXT). It uses a **Retrieval-Augmented Generation (RAG)** pipeline to provide accurate, context-aware answers grounded in your content, with an integrated AI agent layer for tasks like calculations, web search, and date/time queries.

### What it does

- Upload your documents → BotFoundry processes and indexes them
- Ask questions → Get answers sourced directly from your content
- Expose a REST API → Integrate your chatbot into any application
- Manage everything → Via a clean web dashboard

---

## Features

### Core Features

| Feature | Description |
|---|---|
| **RAG Pipeline** | Document ingestion → chunking → vector embeddings → FAISS similarity search → LLM generation |
| **Multi-format Upload** | Supports PDF, DOCX, and TXT files (up to 10MB each) |
| **AI Agent Tools** | Built-in calculator, datetime, and DuckDuckGo web search |
| **Public REST API** | Each chatbot gets its own authenticated API endpoint |
| **API Key Management** | Create, name, expire, and revoke keys per chatbot |
| **Conversation History** | Context-aware responses using last 5 turns of history |
| **Analytics Dashboard** | Tracks conversations, messages, response times, and API usage |
| **Swagger Docs** | Auto-generated interactive API documentation |

### Authentication & Security

- JWT-based authentication (access + refresh tokens)
- Brute-force protection (5 failed attempts → 15-minute lockout)
- API keys hashed with SHA-256 (never stored in plaintext)
- Rate limiting via SlowAPI (60 req/min on public endpoints)
- File upload validation (extension, MIME type, size)
- CORS protection

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Web Framework | FastAPI 0.115.0 |
| Language | Python 3.11+ |
| ORM | SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| LLM | Groq API — LLaMA 3.1 8B |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` (384-dim) |
| Vector Store | FAISS |
| Auth | JWT (python-jose) + bcrypt |
| Rate Limiting | SlowAPI |
| Document Parsing | PyPDF2, python-docx |

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.4 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Markdown | React Markdown + syntax highlighting |

---

## Architecture

![BotFoundry Architecture Diagram](./Botfoundry/public/architecture-diagram.png)

### System Architecture

The system is organized into multiple layers:

- **Client Layer**: Web UI (Next.js), External Apps (via API), and future mobile clients
- **API Gateway**: FastAPI application with CORS, rate limiting, and authentication middleware
- **Business Logic**: Service layer handling authentication, chatbot management, and RAG pipeline
- **Data Layer**: SQLAlchemy ORM managing relational database and vector store (FAISS)
- **External Services**: Groq LLM, HuggingFace embeddings, DuckDuckGo search

### RAG Pipeline Flow

**Document Ingestion Phase:**
Upload File → Validate → Extract Text → Split into Chunks (500 chars, 50 overlap) → Generate Embeddings (HuggingFace) → Store in FAISS Index → Save Chatbot to DB + Generate API Key

**Query Processing Phase:**
User Query → Detect Intent (Agent vs RAG) → Route to appropriate handler → Generate Response using LLaMA 3.1 8B via Groq → Return with source attribution

### Authentication & Security

**JWT Authentication (Web UI)**
- Login → Verify Password (bcrypt) → Issue JWT (30 min access) + Refresh Token (7 days)
- Store tokens in localStorage → Attach JWT as Bearer header on all requests
- Auto-refresh before expiry

**API Key Authentication (External)**
- Request with X-API-Key header → SHA-256 hash → DB lookup
- Verify chatbot is active → Check rate limit (60 req/min)
- Process query → Increment usage counters

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Groq API key ([get one free](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/botfoundry.git
cd botfoundry
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_jwt_secret_key_here
DATABASE_URL=sqlite:///./botfoundry.db
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```

Start the backend:

```bash
python main.py
# Runs on http://localhost:5000
# Swagger docs: http://localhost:5000/docs
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. First run

1. Open `http://localhost:3000`
2. Register an account
3. Click **Create Chatbot**
4. Upload a PDF or text file
5. Wait ~30–60 seconds for processing
6. Start chatting — or copy your API key for external use

---

## Project Structure

```
botfoundry/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env
│   ├── botfoundry.db            # SQLite database (dev)
│   ├── uploads/                 # Uploaded documents
│   ├── vector_stores/           # FAISS indexes per chatbot
│   │
│   ├── routers/
│   │   ├── auth.py              # /auth/* endpoints
│   │   ├── chatbots.py          # /chatbots/* endpoints
│   │   └── public_api.py        # /api/v1/* endpoints
│   │
│   ├── services/
│   │   ├── rag_service.py       # ChatbotManager, RAG pipeline
│   │   ├── agent_service.py     # Calculator, search, datetime tools
│   │   └── auth_service.py      # Token generation, validation
│   │
│   ├── models/
│   │   ├── database.py          # SQLAlchemy models
│   │   └── schemas.py           # Pydantic request/response schemas
│   │
│   └── middleware/
│       ├── rate_limiter.py
│       └── auth_guard.py
│
├── frontend/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── chatbots/[id]/
│   │
│   ├── components/              # Reusable React components
│   ├── lib/
│   │   ├── api.ts               # Axios API client
│   │   └── auth.ts              # Auth helpers
│   └── types/                   # TypeScript type definitions
│
├── README.md
├── ARCHITECTURE.md
└── ARCHITECTURE_DIAGRAMS.md
```

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user | No |
| `POST` | `/auth/login` | Login, returns JWT tokens | No |
| `POST` | `/auth/logout` | Invalidate token | Yes (JWT) |
| `GET` | `/auth/me` | Get current user info | Yes (JWT) |

### Chatbot Management

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/chatbots` | List all user's chatbots | Yes (JWT) |
| `POST` | `/chatbots/create` | Create chatbot (multipart) | Yes (JWT) |
| `GET` | `/chatbots/{id}` | Get chatbot details + stats | Yes (JWT) |
| `PUT` | `/chatbots/{id}` | Update name/description | Yes (JWT) |
| `DELETE` | `/chatbots/{id}` | Delete chatbot | Yes (JWT) |
| `PATCH` | `/chatbots/{id}/status` | Toggle active/inactive | Yes (JWT) |
| `POST` | `/chatbots/{id}/chat` | Chat (web UI) | Yes (JWT) |

### API Key Management

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/chatbots/{id}/keys` | List API keys | Yes (JWT) |
| `POST` | `/chatbots/{id}/keys` | Create new API key | Yes (JWT) |
| `DELETE` | `/chatbots/{id}/keys/{key_id}` | Delete API key | Yes (JWT) |

### Public API (External Integrations)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/{bot_id}/chat` | Chat with a chatbot | Yes (API Key) |

#### Public API Usage Example

```bash
curl -X POST http://localhost:5000/api/v1/bot_5d60d070.../chat \
  -H "X-API-Key: sk_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this document about?"}'
```

Response:

```json
{
  "answer": "This document covers...",
  "sources": ["handbook.pdf (chunk 3)", "faq.txt (chunk 1)"],
  "response_time_ms": 1240,
  "conversation_id": "conv_abc123"
}
```

#### Error Responses

| Status | Meaning |
|---|---|
| `401` | Invalid or missing API key |
| `404` | Chatbot not found |
| `400` | Chatbot is inactive |
| `422` | Missing required fields |
| `429` | Rate limit exceeded (60 req/min) |

---

## Testing Guide

### Full Test Scenario (~30 minutes)

**1. Authentication**
- Register a new user at `http://localhost:3000`
- Logout and log back in
- Try wrong password 5 times → expect 15-minute lockout

**2. Create a Chatbot**
- Click **Create Chatbot**
- Upload 2–3 files (PDF, TXT, DOCX)
- Wait for processing (20–60 seconds)
- Save the displayed API key (shown only once)

**3. Test Chat**
- Ask document-specific questions
- Test agent tools:
  - `"Calculate 456 * 789"` → calculator
  - `"What's today's date?"` → datetime
  - `"Search for latest AI news"` → web search
- Verify source attribution in responses
- Ask follow-up questions to test conversation memory

**4. API Key Management**
- Create 2 additional keys with custom names
- Set expiration on one key (30 days)
- Delete a key and verify it stops working

**5. Public API (Postman / cURL)**

```
Method:  POST
URL:     http://localhost:5000/api/v1/{YOUR_BOT_ID}/chat
Headers: X-API-Key: sk_...
         Content-Type: application/json
Body:    {"query": "Your question here"}
```

Test cases:
- Valid request → answer returned
- Wrong API key → `401`
- Invalid bot ID → `404`
- Missing header → `422`
- 65+ requests in 1 min → `429`

**6. Database Persistence**
- Create a chatbot, then stop both servers
- Restart and verify chatbot, keys, and conversations all persist

**7. Swagger UI**
- Open `http://localhost:5000/docs`
- Click **Authorize** and enter your JWT token
- Test endpoints directly from the browser

### File Upload Security Testing

```
✅ Valid PDF    → Accepted
❌ .exe file   → Rejected
❌ .php file   → Rejected
❌ File > 10MB → Rejected
```

---

## Security

BotFoundry uses a defense-in-depth approach:

| Layer | Implementation |
|---|---|
| Password storage | bcrypt hashing |
| JWT tokens | RS256, 30-minute expiry |
| Refresh tokens | 7-day expiry, rotation on use |
| API keys | SHA-256 hashed, never stored plaintext |
| Rate limiting | SlowAPI — 60 req/min public, 100 req/min auth |
| Brute force | 5 failed logins → 15-minute IP lockout |
| File uploads | Extension allowlist + MIME validation + 10MB cap |
| CORS | Explicit origin allowlist |
| SQL injection | Parameterized queries via SQLAlchemy ORM |

---

## Performance

| Operation | Expected Time |
|---|---|
| Chatbot creation (3 files) | 20–60 seconds |
| Chat response | 1–3 seconds |
| Public API response | 0.5–2 seconds |
| Page load | < 1 second |
| File upload (5MB) | 2–10 seconds |

### Known Limitations

- SQLite supports ~100 concurrent connections (use PostgreSQL for production)
- FAISS is in-memory; large document sets require more RAM
- No horizontal scaling without shared storage for vector indexes

---

## Deployment

### Environment Variables (Production)

```env
GROQ_API_KEY=your_production_groq_key
SECRET_KEY=a_long_random_secret_string
DATABASE_URL=postgresql://user:pass@host:5432/botfoundry
UPLOAD_DIR=/var/botfoundry/uploads
CORS_ORIGINS=https://yourdomain.com
```

### Docker (Recommended)

```bash
docker-compose up --build
```

### Manual

```bash
# Backend
uvicorn main:app --host 0.0.0.0 --port 5000 --workers 4

# Frontend
npm run build
npm start
```

### Production Checklist

- [ ] Switch `DATABASE_URL` to PostgreSQL
- [ ] Set a strong `SECRET_KEY` (min 32 chars)
- [ ] Configure HTTPS / SSL termination
- [ ] Set `CORS_ORIGINS` to your actual domain
- [ ] Configure file storage (S3 recommended)
- [ ] Set up log aggregation
- [ ] Enable database backups

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation update
refactor: Code refactor
test:     Tests
chore:    Build/config changes
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
