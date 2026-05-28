[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/shreevats14119011622-ipuacins-projects/v0-botfoundry-dashboard)
https://v0-botfoundry-dashboard.vercel.app/

# 🤖 BotFoundry - AI Chatbot Builder Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Transform your documents into intelligent AI chatbots in minutes**


</div>


## 🎯 **Overview**

BotFoundry is a production-ready AI chatbot builder that enables users to create intelligent, context-aware chatbots from their documents. Using advanced **Retrieval-Augmented Generation (RAG)** technology, your chatbots can answer questions based on your uploaded documents with high accuracy.

### **What Makes BotFoundry Different?**

- ✅ **No Code Required** - Simple web interface for chatbot creation
- ✅ **RAG Technology** - Accurate, context-aware responses from your documents
- ✅ **Public API** - Share chatbots via REST API with API key authentication
- ✅ **AI Agents** - Built-in tools for calculations, web search, and datetime
- ✅ **Production Ready** - JWT auth, rate limiting, security best practices
- ✅ **Beautiful UI** - Modern, responsive Next.js frontend with dark mode

---

## ✨ **Key Features**

### **🔐 Authentication & Security**
- JWT-based authentication (30-min access, 7-day refresh tokens)
- Bcrypt password hashing
- API key authentication with SHA-256 hashing
- Rate limiting (per-user and per-API-key)
- Brute force protection (5 attempts → 15-min lockout)
- File upload validation (extension, MIME type, size)
- CORS protection

### **🤖 Chatbot Creation (RAG Pipeline)**
- Upload multiple documents (PDF, TXT, DOCX)
- Automatic text extraction and chunking (500 chars, 50 overlap)
- Vector embeddings using HuggingFace (all-MiniLM-L6-v2)
- FAISS vector database for similarity search
- Real-time processing status
- Automatic API key generation

### **💬 Intelligent Chat**
- Context-aware responses from your documents
- Source attribution (shows which documents were used)
- Conversation history tracking
- Response time metrics
- Beautiful markdown formatting (headings, lists, code blocks)
- Conversation persistence

### **🛠️ AI Agent Tools**
- **Calculator** - Mathematical operations
- **DateTime** - Current date/time information
- **Web Search** - DuckDuckGo integration for real-time information
- Automatic intent detection

### **🔑 API Key Management**
- Create multiple API keys per chatbot
- Named keys for organization
- Optional expiration dates
- Usage tracking (total requests, last used)
- Secure one-time key display
- Revocation support

### **📊 Analytics & Monitoring**
- Conversation count
- Total messages
- Average response time
- Accuracy scores
- API usage statistics
- Last active timestamps

### **🌐 Public API**
- RESTful API for chatbot integration
- API key authentication
- Rate limiting (60 requests/minute)
- JSON request/response
- Comprehensive error handling
- CORS enabled for cross-origin requests

---

## 🛠️ **Tech Stack**

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Backend runtime |
| FastAPI | 0.115.0 | Web framework |
| Uvicorn | 0.30.0 | ASGI server |
| SQLAlchemy | 2.0.35 | ORM |
| SQLite | 3.x | Database (dev) |
| LangChain | 0.3.7 | LLM framework |
| FAISS | 1.9.0 | Vector database |
| HuggingFace | Latest | Embeddings model |
| Groq | Latest | LLM provider (LLaMA 3.1) |
| python-jose | 3.3.0 | JWT tokens |
| passlib | 1.7.4 | Password hashing |
| slowapi | 0.1.9 | Rate limiting |

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.4 | React framework |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Shadcn/ui | Latest | UI components |
| React Markdown | Latest | Markdown rendering |

### **AI/ML**
- **LLM**: Groq (LLaMA 3.1 8B Instant)
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2
- **Vector Store**: FAISS (file-based)
- **Document Loaders**: PyPDF, UnstructuredWordDocumentLoader
- **Text Splitter**: RecursiveCharacterTextSplitter

---

## 🏗️ **Architecture**

![Architecture Diagram](./public/architecture-diagram.png)

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🚀 **Quick Start**

### **Prerequisites**

- Python 3.11+ ([Download](https://www.python.org/downloads/))
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### **Installation**

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/botfoundry.git
cd botfoundry
```

**2. Backend Setup**
```bash
cd ai
pip install -r requirements.txt
python main.py
```

Backend will start at: **http://localhost:5000**

**3. Frontend Setup** (New terminal)
```bash
cd Botfoundry
npm install
npm run dev
```

Frontend will start at: **http://localhost:3000**

**4. Open Application**
- Navigate to: **http://localhost:3000**
- Register a new account
- Create your first chatbot!

### **Environment Configuration**

**Backend (`.env` in `ai/` folder):**
```env
# Database
DATABASE_URL=sqlite:///./botfoundry.db

# JWT Authentication
SECRET_KEY=your-256-bit-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Groq API (Get free key: https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_FOLDER=uploads
VECTOR_STORE_FOLDER=rag_bot_store
```

**Frontend (`.env.local` in `Botfoundry/` folder):** (Optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📖 **Documentation**

### **Core Guides**
- [Architecture Overview](./ARCHITECTURE.md) - Detailed system architecture
- [API Documentation](./API.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Database Schema](./HOW_TO_VIEW_DATABASE.md) - Database structure
- [Security Analysis](./LEAD_AI_ENGINEER_ANALYSIS.md) - Security audit report
- [Modularization Guide](./MODULARIZATION_GUIDE.md) - Code refactoring plan

### **User Guides**
- [Creating Chatbots](./docs/CREATING_CHATBOTS.md)
- [Using the Chat Interface](./docs/CHAT_INTERFACE.md)
- [Managing API Keys](./docs/API_KEYS.md)
- [Testing Features](./docs/TESTING.md)

### **Developer Guides**
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Development Workflow](./docs/DEVELOPMENT.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

---

## 🔑 **API Reference**

### **Base URL**
```
Development: http://localhost:5000
Production: https://your-domain.com
```

### **Authentication**

**User Authentication (JWT)**
```bash
# Register
POST /auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "Full Name"
}

# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get Current User
GET /auth/me
Headers: Authorization: Bearer <jwt_token>
```

**API Key Authentication (Public API)**
```bash
# Chat with Chatbot
POST /api/v1/{chatbot_id}/chat
Headers: X-API-Key: <your_api_key>
{
  "query": "What is this about?"
}
```

### **Chatbot Management**

```bash
# Create Chatbot
POST /chatbots/create
Headers: Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
Body:
  - name: "My Chatbot"
  - description: "Customer support bot"
  - files: [file1.pdf, file2.txt]

# List Chatbots
GET /chatbots
Headers: Authorization: Bearer <jwt_token>

# Get Chatbot Details
GET /chatbots/{chatbot_id}
Headers: Authorization: Bearer <jwt_token>

# Update Chatbot Status
PATCH /chatbots/{chatbot_id}/status?status=active
Headers: Authorization: Bearer <jwt_token>

# Delete Chatbot
DELETE /chatbots/{chatbot_id}
Headers: Authorization: Bearer <jwt_token>
```

### **Chat**

```bash
# Chat (Authenticated)
POST /chatbots/{chatbot_id}/chat
Headers: Authorization: Bearer <jwt_token>
{
  "query": "Your question here",
  "conversation_id": "conv_xxxxx" // optional
}

# Chat (Public API)
POST /api/v1/{chatbot_id}/chat
Headers: X-API-Key: <your_api_key>
{
  "query": "Your question here"
}
```

### **API Keys**

```bash
# Create API Key
POST /chatbots/{chatbot_id}/api-keys
Headers: Authorization: Bearer <jwt_token>
{
  "name": "Mobile App Key",
  "expires_in_days": 30 // optional
}

# List API Keys
GET /chatbots/{chatbot_id}/api-keys
Headers: Authorization: Bearer <jwt_token>

# Delete API Key
DELETE /chatbots/{chatbot_id}/api-keys/{key_id}
Headers: Authorization: Bearer <jwt_token>
```

### **Interactive Documentation**

- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

Complete API documentation: [API.md](./API.md)

---

## 🚢 **Deployment**

### **Production Checklist**

- [ ] Change `SECRET_KEY` to strong random value
- [ ] Set `DATABASE_URL` to PostgreSQL
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set up file storage (S3/GCS)
- [ ] Migrate to managed vector DB (Pinecone)
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure error tracking (Sentry)
- [ ] Set up CI/CD pipeline
- [ ] Load testing
- [ ] Backup strategy

### **Quick Deploy**

**Backend (Railway/Render)**
```bash
# Deploy to Railway
cd ai
railway init
railway up

# Or deploy to Render
# 1. Connect GitHub repo
# 2. Point to ai/ directory
# 3. Add environment variables
# 4. Deploy
```

**Frontend (Vercel)**
```bash
# Deploy to Vercel
cd Botfoundry
vercel --prod

# Or use Vercel dashboard
# 1. Connect GitHub repo
# 2. Auto-deploys on push
```

**Database (Production)**
- Use PostgreSQL instead of SQLite
- Recommended: Supabase, Neon, Railway

**Vector Store (Production)**
- Migrate from FAISS to Pinecone/Weaviate/Qdrant
- Required for scaling beyond 1,000 chatbots

Detailed deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 **Project Structure**

```
botfoundry/
├── ai/                          # Backend (FastAPI)
│   ├── main.py                  # Main application entry
│   ├── auth.py                  # Authentication logic
│   ├── models.py                # Database models (SQLAlchemy)
│   ├── schemas.py               # Pydantic schemas
│   ├── database.py              # Database configuration
│   ├── config.py                # Environment configuration
│   ├── chatbot_manager.py       # RAG pipeline logic
│   ├── agent_tools.py           # AI agent tools
│   ├── security.py              # Security utilities
│   ├── errors.py                # Custom exceptions
│   ├── constants.py             # Application constants
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   ├── botfoundry.db            # SQLite database (auto-created)
│   ├── uploads/                 # Uploaded documents
│   └── rag_bot_store/           # FAISS vector stores
│
├── Botfoundry/                  # Frontend (Next.js)
│   ├── app/                     # Next.js app directory
│   │   ├── page.tsx             # Dashboard
│   │   ├── login/page.tsx       # Login/Register
│   │   ├── my-chatbots/         # Chatbot list
│   │   ├── create-chatbot/      # Create chatbot
│   │   └── chatbot/[id]/        # Chatbot detail
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn components
│   │   ├── auth-provider.tsx    # Auth context
│   │   ├── chatbots-provider.tsx# Chatbot context
│   │   ├── chatbot-card.tsx     # Chatbot card
│   │   ├── api-key-display.tsx  # API key management
│   │   └── chatbot-test-interface.tsx # Chat UI
│   ├── lib/                     # Utilities
│   │   └── api.ts               # API client
│   ├── package.json             # Node dependencies
│   ├── tailwind.config.ts       # Tailwind configuration
│   └── next.config.js           # Next.js configuration
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md          # Architecture details
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── ...                      # Other docs
│
├── README.md                    # This file
├── LICENSE                      # MIT License
└── .gitignore                   # Git ignore rules
```

---

## 🧪 **Testing**

### **Backend Tests**
```bash
cd ai
pytest                           # Run all tests
pytest tests/test_auth.py        # Test authentication
pytest --cov                     # Coverage report
```

### **Frontend Tests**
```bash
cd Botfoundry
npm test                         # Run tests
npm run test:watch               # Watch mode
npm run test:coverage            # Coverage report
```

### **End-to-End Tests**
```bash
cd Botfoundry
npm run test:e2e                 # Playwright E2E tests
```

### **Manual Testing**
See [Testing Guide](./docs/TESTING.md) for comprehensive manual testing checklist.

---

## 🐛 **Known Issues & Limitations**

### **Current Limitations**
- **SQLite**: Max ~100 concurrent users (use PostgreSQL for production)
- **FAISS**: File-based, doesn't scale beyond 1,000 chatbots (migrate to Pinecone)
- **File Storage**: Local disk (use S3/GCS for production)
- **No Streaming**: LLM responses not streamed (add for better UX)
- **Basic Reranking**: No cross-encoder reranking (40% accuracy improvement possible)

### **Security Notes**
- Bcrypt warning is harmless (version detection issue)
- API keys shown only once on creation (by design)
- Rate limits are in-memory (reset on restart - use Redis for production)

### **Planned Improvements**
- [ ] Add response streaming
- [ ] Implement cross-encoder reranking
- [ ] Add conversation history UI
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] Team collaboration features

---

## 📈 **Performance**

### **Expected Metrics**

```
Chatbot Creation:    20-60 seconds
Chat Response:       1-3 seconds
API Response:        0.5-2 seconds
Page Load:           <1 second
File Upload:         2-10 seconds

Max Concurrent:      100 users (SQLite)
                     10,000 users (PostgreSQL + optimizations)

Request Throughput:  10 req/s (current)
                     100 req/s (with async/await)
```

### **Optimization Opportunities**

**Immediate (2-3 days each):**
- Add database indexes → 100x faster queries
- Implement caching (Redis) → 70% latency reduction
- Async/await refactor → 10x throughput
- PostgreSQL migration → Scale to 10K users

**Short-term (1 week each):**
- Migrate to Pinecone → Unlimited chatbots
- Add cross-encoder → 40% better accuracy
- Response streaming → Better UX
- CDN for static files → Faster page loads

---

## 🤝 **Contributing**

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### **Development Setup**
```bash
# Fork and clone
git clone https://github.com/yourusername/botfoundry.git
cd botfoundry

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
# ...

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

### **Code Standards**
- Python: PEP 8, type hints, docstrings
- TypeScript: ESLint, Prettier
- Commits: Conventional Commits format
- Tests: Minimum 70% coverage

---

## 📄 **License**

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **FastAPI** - Modern Python web framework
- **Next.js** - React framework for production
- **LangChain** - LLM application framework
- **Groq** - Fast LLM inference
- **HuggingFace** - ML models and embeddings
- **Shadcn/ui** - Beautiful UI components

---

## 📞 **Support**

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/botfoundry/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/botfoundry/discussions)
- **Email**: support@botfoundry.com

---

## 🗺️ **Roadmap**

### **Q2 2026**
- [ ] Response streaming
- [ ] Conversation history UI
- [ ] Analytics dashboard
- [ ] PostgreSQL migration guide

### **Q3 2026**
- [ ] Vector DB migration (Pinecone)
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Mobile app (beta)

### **Q4 2026**
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Custom LLM support
- [ ] Enterprise features

---

<div align="center">


</div>
