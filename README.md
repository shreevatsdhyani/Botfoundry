# BotFoundry Backend API v2.0

FastAPI-based backend for BotFoundry AI chatbot platform with authentication, multi-chatbot support, and AI agent capabilities.

## 🚀 Features

- **User Authentication** - JWT-based auth with register/login
- **Multi-Chatbot Management** - Each user can create multiple chatbots
- **RAG (Retrieval-Augmented Generation)** - Document-based chatbots using LangChain + FAISS
- **AI Agent Tools** - Web search, calculator, datetime queries
- **API Key System** - Unique API keys per chatbot for public access
- **Conversation History** - Track all conversations and messages
- **Analytics** - Real-time statistics and metrics
- **Auto-Generated Docs** - Swagger UI at `/docs`

## 📦 Installation

### 1. Install Dependencies

```bash
cd ai
pip install -r requirements.txt
```

### 2. Setup Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Required
GROQ_API_KEY=your-groq-api-key
SECRET_KEY=your-secret-key-min-32-chars

# Optional (defaults work)
DATABASE_URL=sqlite:///./botfoundry.db
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Run Server

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

Server will start at: `http://localhost:5000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:5000/docs
- **ReDoc**: http://localhost:5000/redoc

## 🔐 Authentication Flow

### Register
```bash
POST /auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass123",
  "full_name": "John Doe"
}
```

### Login
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}

# Returns:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Use Token
Add to request headers:
```
Authorization: Bearer <access_token>
```

## 🤖 Creating a Chatbot

```bash
POST /chatbots/create
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- name: "Customer Support Bot"
- description: "Answers customer questions"
- files: [file1.pdf, file2.docx, file3.txt]
```

Response:
```json
{
  "chatbot_id": "bot_abc123",
  "name": "Customer Support Bot",
  "status": "active",
  "api_key": "sk_xyz789...",
  "api_endpoint": "/api/v1/bot_abc123/chat",
  "documents_processed": 3,
  "chunks_created": 150
}
```

## 💬 Chat with Your Chatbot

### Authenticated (Your chatbots)
```bash
POST /chatbots/{chatbot_id}/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "What are your business hours?",
  "conversation_id": "conv_123" // optional
}
```

### Public API (With API key)
```bash
POST /api/v1/{chatbot_id}/chat
Content-Type: application/x-www-form-urlencoded

api_key=sk_xyz789...&query=What are your business hours?
```

Or JSON:
```bash
POST /api/v1/{chatbot_id}/chat
Content-Type: application/json

{
  "query": "What are your business hours?",
  "api_key": "sk_xyz789..."
}
```

## 🛠 AI Agent Capabilities

The chatbot automatically detects and handles:

### 1. Web Search
```
Query: "Search for latest AI news"
Query: "Find information about FastAPI"
Query: "What's happening with ChatGPT?"
```

### 2. Calculator
```
Query: "Calculate 25 * 48 + 120"
Query: "What is 15% of 200?"
Query: "Solve (10 + 5) * 3"
```

### 3. DateTime
```
Query: "What day is it today?"
Query: "What's the current time?"
Query: "Tell me today's date"
```

## 📊 Database Schema

### Users
- `id`, `email`, `username`, `hashed_password`
- `full_name`, `is_active`, `is_premium`
- `created_at`, `updated_at`

### Chatbots
- `id`, `chatbot_id` (bot_xxx)
- `name`, `description`, `status`
- `user_id` (foreign key)
- `vector_store_path`
- Stats: `total_conversations`, `total_messages`, `avg_response_time`

### API Keys
- `id`, `key` (sk_xxx)
- `chatbot_id`, `is_active`
- `total_requests`, `last_used`

### Conversations
- `id`, `conversation_id` (conv_xxx)
- `chatbot_id`, `user_id`
- `started_at`, `message_count`

### Messages
- `id`, `conversation_id`
- `role` (user/assistant)
- `content`, `timestamp`
- `response_time`, `sources`, `agent_actions`

## 🔑 API Endpoints Summary

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Chatbots
- `POST /chatbots/create` - Create chatbot (with files)
- `GET /chatbots` - List my chatbots
- `GET /chatbots/{id}` - Get chatbot details
- `DELETE /chatbots/{id}` - Delete chatbot
- `PATCH /chatbots/{id}/status` - Toggle active/inactive

### Chat
- `POST /chatbots/{id}/chat` - Chat (authenticated)
- `POST /api/v1/{id}/chat` - Chat (public with API key)

### API Keys
- `POST /chatbots/{id}/api-keys` - Generate API key
- `GET /chatbots/{id}/api-keys` - List API keys
- `DELETE /chatbots/{id}/api-keys/{key_id}` - Revoke key

### Conversations
- `GET /chatbots/{id}/conversations` - List conversations

### Health
- `GET /` - API info
- `GET /health` - Health check

## 🧪 Testing

```bash
# Install dev dependencies
pip install pytest httpx

# Run tests
pytest
```

## 🚢 Deployment

### Option 1: Railway
```bash
railway login
railway init
railway up
```

### Option 2: Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Option 3: Docker
```bash
docker build -t botfoundry-api .
docker run -p 5000:5000 botfoundry-api
```

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | `sqlite:///./botfoundry.db` | Database connection string |
| `SECRET_KEY` | Yes | - | JWT secret (min 32 chars) |
| `GROQ_API_KEY` | Yes | - | Groq API key for LLM |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | LLM model name |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000` | CORS origins (comma-separated) |
| `MAX_FILE_SIZE_MB` | No | `10` | Max upload file size |

## 🐛 Troubleshooting

### Database locked error
```bash
rm botfoundry.db  # Delete and recreate
python main.py
```

### CORS errors
Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

### Import errors
```bash
pip install --upgrade -r requirements.txt
```

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

**Built with ❤️ using FastAPI, LangChain, and Groq**
