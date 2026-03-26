# 🌾 KrishiMitra AI - Your Intelligent Farming Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

**KrishiMitra AI** is an AI-powered agricultural advisory platform that provides real-time, multilingual farming guidance to Indian farmers. Built with cutting-edge AI technology, it offers crop advisory, pest diagnosis, market prices, weather forecasts, and government scheme information — all in **11 Indian languages**.

![KrishiMitra AI Banner](./assets/banner.png)

---

## 🌟 Features

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **🌱 Crop Advisory** | AI-powered crop management, growth stage tips, and yield optimization |
| **🐛 Pest & Disease Diagnosis** | Upload crop photos for instant disease detection and treatment recommendations |
| **🌤 Weather Forecast** | 5-day weather predictions with farming-specific advisories |
| **📈 Market Prices (Mandi)** | Real-time APMC mandi prices with MSP comparison |
| **📋 Government Schemes** | Personalized scheme recommendations with direct application links |
| **💳 Credit & Finance** | Kisan Credit Card, loan options, and subsidy information |
| **🎤 Voice Input/Output** | Speak your questions in your native language |
| **📸 Photo Analysis** | Upload crop photos for pest/disease diagnosis |

### 🗣️ Multilingual Support

Communicate in your native language — **11 Indian languages supported**:

- **हिंदी** (Hindi)
- **বাংলা** (Bengali)
- **मराठी** (Marathi)
- **తెలుగు** (Telugu)
- **ગુજરાતી** (Gujarati)
- **தமிழ்** (Tamil)
- **ಕನ್ನಡ** (Kannada)
- **മലയാളം** (Malayalam)
- **ଓଡ଼ିଆ** (Odia)
- **ਪੰਜਾਬੀ** (Punjabi)
- **English**

### 🛡️ Safety & Compliance

- **5-Layer Compliance Check** - Ensures safe, accurate recommendations
- **Distress Detection** - Identifies farmer distress and provides helpline numbers
- **Audit Trail** - Complete logging of every query with reasoning chains
- **No Harmful Advice** - Pesticide dosage and safety validated

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Farmer (User)                           │
│         Web App / Mobile / Voice Interface                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  • Multilingual UI    • Voice Input    • Photo Upload       │
│  • Real-time Updates  • Markdown Render • TTS Playback      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                         │
│  • API Gateway    • Authentication    • Rate Limiting       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Orchestrator (LangGraph State Machine)         │
│                                                             │
│  1. Load Farmer → 2. Parse Intent → 3. Run Agents          │
│       ↓                  ↓                  ↓               │
│  6. Write Audit ← 5. Compliance ← 4. Synthesize            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    8 Specialized AI Agents                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐   │
│  │  Voice   │ │   Soil   │ │    Crop      │ │   Pest   │   │
│  │  Agent   │ │  Agent   │ │   Agent      │ │ Disease  │   │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐   │
│  │ Weather  │ │  Mandi   │ │   Scheme     │ │ Finance  │   │
│  │  Agent   │ │  Agent   │ │   Agent      │ │  Agent   │   │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services & Data                   │
│  • OpenAI GPT-4o    • Google Gemini    • Sarvam AI (STT/TTS)│
│  • IMD Weather      • eNAM Mandi       • Data.gov.in        │
│  • SQLite Database  • Audit Logs       • Scheme Database    │
└─────────────────────────────────────────────────────────────┘
```

### 8 AI Agents

| Agent | Purpose | Data Sources |
|-------|---------|--------------|
| **Voice Agent** | Intent classification using keyword matching | Hindi/English/Bengali keywords |
| **Soil Agent** | NPK analysis, fertilizer recommendations | Soil Health Card data |
| **Crop Agent** | Growth stage advisory, yield optimization | Crop management databases |
| **Pest Disease Agent** | Disease diagnosis, treatment plans | Plant pathology knowledge |
| **Weather Agent** | 5-day forecast, farming advisories | IMD (India Meteorological Dept) |
| **Mandi Agent** | Live market prices, MSP comparison | eNAM, APMC data |
| **Scheme Agent** | Government scheme matching | Ministry of Agriculture schemes |
| **Finance Agent** | Credit options, loan information | NABARD, KCC guidelines |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/ValteruGowtham/KrishiMitra-AI.git
cd KrishiMitra-AI
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys:
# - OPENAI_API_KEY
# - GEMINI_API_KEY
# - SARVAM_API_KEY
# - DATA_GOV_IN_API_KEY
# - IMD_API_KEY

# Start the backend server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8001
```

Backend will run on: **http://localhost:8001**
API Documentation: **http://localhost:8001/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### 4. Access the Application

Open your browser and navigate to: **http://localhost:3000**

---

## 📁 Project Structure

```
KrishiMitra-AI/
├── backend/                    # FastAPI Backend
│   ├── api/
│   │   └── routes/            # API endpoints (advisory, farmer, schemes, etc.)
│   ├── agents/                # 8 AI agent implementations
│   │   ├── base.py           # Base agent class
│   │   └── agents.py         # All 8 specialized agents
│   ├── orchestrator/          # LangGraph state machine
│   │   └── orchestrator.py   # 6-node workflow
│   ├── services/              # External API integrations
│   │   ├── sarvam.py         # STT/TTS (Indian languages)
│   │   ├── weather.py        # IMD weather
│   │   └── mandi.py          # eNAM market prices
│   ├── db/                    # Database layer
│   │   ├── models.py         # SQLAlchemy models
│   │   └── seed.py           # Initial data seeding
│   ├── compliance/            # Safety & guardrails
│   │   ├── guardrails.py     # 5-layer compliance check
│   │   └── audit.py          # Audit trail logging
│   ├── schemas.py             # Pydantic models
│   ├── main.py                # FastAPI application entry
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   │   ├── AdvisoryPage.jsx      # Main advisory interface
│   │   │   ├── MarketRatesPage.jsx   # Mandi prices
│   │   │   ├── SchemesPage.jsx       # Government schemes
│   │   │   └── AboutPage.jsx         # About page
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useSpeechRecognition.js  # Voice input
│   │   │   └── useCamera.js          # Photo capture
│   │   ├── services/          # API client
│   │   │   └── api.js        # Axios API wrapper
│   │   ├── App.jsx            # Main app with routing
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── .env                       # Environment variables (API keys)
├── .env.example               # Environment template
├── requirements.txt           # Python dependencies
├── krishimitra.db             # SQLite database
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### Advisory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/advisory` | Submit text query for advisory |
| `POST` | `/api/v1/advisory/with-photo` | Submit query with crop photo |

### Farmer Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/farmer/register` | Register new farmer |
| `GET` | `/api/v1/farmer/{farmer_id}` | Get farmer profile |

### Market Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/mandi/prices` | Get live mandi prices |
| `GET` | `/api/v1/mandi/msp` | Get MSP list |
| `GET` | `/api/v1/mandi/states` | Get available states |
| `GET` | `/api/v1/mandi/crops` | Get available crops |

### Government Schemes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/schemes` | List all schemes (with filters) |

### Speech Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/stt` | Speech-to-text (Sarvam AI) |
| `POST` | `/api/v1/tts` | Text-to-speech (Sarvam AI) |

### Health & Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | System health check |
| `GET` | `/api/v1/languages` | Supported languages |

---

## 🎯 Example Usage

### 1. Submit Advisory Query (Hindi)

```bash
curl -X POST http://localhost:8001/api/v1/advisory \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "demo_farmer",
    "text_input": "मेरे गेहूं के पत्ते पीले पड़ रहे हैं",
    "language": "hi",
    "language_code": "hi-IN"
  }'
```

### 2. Submit with Photo (Bengali)

```bash
curl -X POST http://localhost:8001/api/v1/advisory/with-photo \
  -F "farmer_id=demo_farmer" \
  -F "text_input=আমার গমের পাতা হলুদ হয়ে যাচ্ছে" \
  -F "language=bn" \
  -F "language_code=bn-IN" \
  -F "photo=@wheat_leaf.jpg"
```

### 3. Get Mandi Prices

```bash
curl "http://localhost:8001/api/v1/mandi/prices?crop=wheat&state=Rajasthan"
```

### 4. Get Government Schemes

```bash
curl "http://localhost:8001/api/v1/schemes?category=insurance&state=Rajasthan"
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📊 Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Web framework |
| **LangGraph** | Agent orchestration |
| **LangChain** | LLM integration |
| **OpenAI GPT-4o** | Primary LLM |
| **Google Gemini** | Secondary LLM |
| **Sarvam AI** | Indian language STT/TTS |
| **SQLAlchemy** | ORM |
| **SQLite** | Database |
| **Pydantic** | Data validation |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **React Router** | Navigation |
| **Axios** | HTTP client |
| **Lucide React** | Icons |
| **React Markdown** | Markdown rendering |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Google Gemini
GEMINI_API_KEY=AIzaSy...

# Sarvam AI (Indian language STT/TTS)
SARVAM_API_KEY=sk_...

# Data.gov.in (AgMarkNet mandi prices)
DATA_GOV_IN_API_KEY=579b464d...
DATA_GOV_IN_RESOURCE_ID=...

# IMD Weather
IMD_API_KEY=sk-live-...

# Database
DATABASE_URL=sqlite:///./krishimitra.db

# App Config
APP_ENV=development
DEBUG=true
```

---

## 📈 Performance

- **Response Time**: ~5-10 seconds for full advisory (8 agents)
- **Language Support**: 11 Indian languages
- **Concurrent Users**: Supports 50+ concurrent requests
- **Database**: SQLite (can be upgraded to PostgreSQL)

---

## 🚧 Roadmap

### Phase 1 (Completed) ✅
- [x] 8 AI agents implementation
- [x] LangGraph orchestrator
- [x] Multilingual support (11 languages)
- [x] Voice input/output
- [x] Photo upload for pest diagnosis
- [x] Compliance layer
- [x] Audit trail

### Phase 2 (In Progress) 🚧
- [ ] WhatsApp integration
- [ ] SMS advisory support
- [ ] Offline mode (PWA)
- [ ] Farmer community forum
- [ ] Crop price prediction (ML model)

### Phase 3 (Planned) 📋
- [ ] Mobile apps (iOS/Android)
- [ ] Regional language expansion (22+ languages)
- [ ] Satellite imagery integration
- [ ] IoT sensor integration
- [ ] Marketplace for farm produce

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write tests for new features
- Document all API endpoints
- Update README for significant changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by the **KrishiMitra AI Team**

### Key Contributors
- [Your Name] - Initial work
- [Contributors](https://github.com/ValteruGowtham/KrishiMitra-AI/graphs/contributors)

---

## 📞 Support & Contact

### Farmer Helplines
- **Kisan Call Centre**: 1800-180-1551 (Toll-free, 24/7)
- **KVK Support**: 1800-425-1122

### Technical Support
- **GitHub Issues**: https://github.com/ValteruGowtham/KrishiMitra-AI/issues
- **Email**: support@krishimitra.ai

### Emergency Distress Support
If you or someone you know is experiencing farming-related distress:
- **National Helpline**: 1800-180-1551
- **Kiran Mental Health**: 1800-599-0019

---

## 🙏 Acknowledgments

- **Ministry of Agriculture & Farmers Welfare** - Government schemes data
- **IMD (India Meteorological Department)** - Weather data
- **eNAM** - Market price data
- **Sarvam AI** - Indian language STT/TTS services
- **OpenAI** - GPT-4o language models
- **Google** - Gemini AI models

---

## 📊 Statistics

- 🌾 **8 AI Agents** working together
- 🗣️ **11 Indian Languages** supported
- ⚡ **<10s** response time
- ✅ **5-Layer** compliance check
- 📋 **100%** audit trail coverage

---

## 🌟 Show Your Support

If this project helps you, please give it a ⭐️ star on GitHub!

**Happy Farming! 🌾**

---

*Last Updated: March 26, 2026*
