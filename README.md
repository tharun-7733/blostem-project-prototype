# 🌿 Blostem — AI-Powered AgriFinance Platform

> A prototype combining two AI-driven tools for Indian agriculture and personal finance: **CropWise** (ML crop recommendation) and **RichPerson FD Advisor** (voice-first Fixed Deposit advisor).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up the Flask Backend (CropWise)](#2-set-up-the-flask-backend-cropwise)
  - [3. Configure Supabase (FD Advisor)](#3-configure-supabase-fd-advisor)
  - [4. Run the Frontend](#4-run-the-frontend)
- [CropWise — Crop Recommendation Engine](#cropwise--crop-recommendation-engine)
  - [How It Works](#how-it-works)
  - [Input Parameters](#input-parameters)
  - [Supported Crops](#supported-crops)
  - [API Reference](#api-reference)
- [RichPerson FD Advisor](#richperson-fd-advisor)
  - [How It Works](#how-it-works-1)
  - [Supported Languages](#supported-languages)
  - [Speech Pipeline](#speech-pipeline)
- [Speech-to-Text Model](#speech-to-text-model)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

**Blostem** is a prototype platform built for Indian users at the intersection of agriculture and personal finance. It ships two distinct AI products under one roof:

| Product | Description |
|---|---|
| **CropWise** | ML-powered crop recommendation using soil & climate parameters |
| **RichPerson FD Advisor** | Multilingual voice-first chatbot for Fixed Deposit guidance |

---

## Features

### CropWise
- 🌾 Crop recommendations powered by a **Gaussian Mixture Model (GMM)**
- 📊 Accepts 7 soil/environment parameters via interactive sliders
- 🗓️ Season-aware selection (Kharif / Rabi / Zaid)
- 🔄 Shows primary recommendation + alternative suitable crops with cluster match info
- 📱 Fully responsive, animated UI with particle system

### RichPerson FD Advisor
- 🎤 **Voice-first** interaction — speak your FD question, hear the answer
- 🌐 **9 Indian language** support (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati)
- 🤖 Powered by **Gemini 2.5 Flash** (with 1.5 Flash fallback) via Supabase Edge Functions
- 📜 Maintains conversation history (last 6 exchanges) for contextual responses
- 💰 Indian-context aware: TDS, Section 80C, lakh/crore denominations, major Indian banks

---

## Architecture

```
┌─────────────────────────────────────────────┐
│               Browser (Frontend)             │
│  index.html · css/style.css · js/*.js        │
│                                              │
│  ┌─────────────┐    ┌──────────────────────┐ │
│  │  CropWise   │    │  RichPerson FD       │ │
│  │  (Form UI)  │    │  Advisor (Voice UI)  │ │
│  └──────┬──────┘    └────────┬─────────────┘ │
└─────────│────────────────────│───────────────┘
          │ POST /predict       │ POST /functions/v1/fd-advisor
          ▼                    ▼
┌─────────────────┐   ┌──────────────────────────┐
│  Flask API      │   │  Supabase Edge Function  │
│  server/app.py  │   │  (Deno / TypeScript)     │
│  Port 5000      │   └────────────┬─────────────┘
│                 │                │ Gemini API
│  GMM Model      │                ▼
│  + Scaler       │   ┌──────────────────────────┐
│  + Cluster Map  │   │  Google Gemini 2.5 Flash  │
└─────────────────┘   └──────────────────────────┘
```

---

## Project Structure

```
blostem-project-prototype/
│
├── index.html                        # Main SPA — both CropWise & FD Advisor UIs
├── package.json                      # npm scripts (dev server)
├── .gitignore
│
├── css/
│   └── style.css                     # All styles (glassmorphism design system)
│
├── js/
│   ├── app.js                        # CropWise: particles, sliders, form, API calls
│   ├── gemini.js                     # FD Advisor: Gemini API client via Supabase
│   ├── speech.js                     # Speech recognition & synthesis module
│   ├── ui.js                         # UI state management (mic, transcript, history)
│   ├── config.js                     # 🔒 Supabase credentials (gitignored)
│   └── config.example.js             # Template for config.js
│
├── server/                           # CropWise Flask backend
│   ├── app.py                        # Flask API server
│   ├── requirements.txt              # Python dependencies
│   └── models/
│       ├── crop_clustering_model.pkl # Trained GMM model
│       ├── scaler.pkl                # Feature scaler (StandardScaler)
│       └── cluster_mapping.csv      # Cluster ID → crop name mapping
│
├── supabase/
│   └── functions/
│       └── fd-advisor/
│           └── index.ts              # Supabase Edge Function (Deno)
│
└── Speech to Text model/             # Fine-tuned Whisper model (LoRA adapter)
    ├── adapter_model.safetensors     # LoRA weights (~12 MB)
    ├── adapter_config.json           # PEFT adapter config
    ├── tokenizer.json                # Whisper tokenizer
    ├── tokenizer_config.json
    ├── processor_config.json
    ├── asr_model_train.ipynb         # ASR training notebook
    └── stt_model_train.ipynb         # STT fine-tuning notebook
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Python | ≥ 3.10 |
| pip | latest |
| Supabase CLI | latest (for Edge Functions) |
| Supabase account | — |
| Google Gemini API key | — |

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/blostem-project-prototype.git
cd blostem-project-prototype
```

---

### 2. Set Up the Flask Backend (CropWise)

```bash
cd server

# Create a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The Flask API will start at `http://127.0.0.1:5000`.

> **Note:** The pre-trained GMM model, scaler, and cluster mapping are already included in `server/models/`. No model training is required to run the app.

---

### 3. Configure Supabase (FD Advisor)

#### 3a. Copy the config template

```bash
cp js/config.example.js js/config.js
```

Then edit `js/config.js` and fill in your Supabase project credentials:

```js
const CONFIG = {
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
};
```

> `config.js` is gitignored — your keys will never be committed.

#### 3b. Deploy the Edge Function

```bash
# Log in to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Set the Gemini API key as a secret
supabase secrets set GEMINI_API_KEY=<your-gemini-api-key>

# Deploy the Edge Function
supabase functions deploy fd-advisor
```

---

### 4. Run the Frontend

```bash
# From the project root
npm run dev
```

This starts a local static server via `npx serve`. Open `http://localhost:3000` (or the port shown) in your browser.

> **Browser compatibility:** The FD Advisor's voice features rely on the **Web Speech API**, which is best supported in **Google Chrome** and **Microsoft Edge**. Firefox has limited support.

---

## CropWise — Crop Recommendation Engine

### How It Works

1. The user adjusts sliders for soil composition and environmental conditions.
2. On form submit, the browser sends a JSON payload to `POST http://127.0.0.1:5000/predict`.
3. The Flask server scales the features and runs them through a **Gaussian Mixture Model (GMM)** trained on 22 Indian crop types.
4. The model returns a **cluster ID**, which is mapped to a ranked list of suitable crops.
5. The frontend enriches the result with crop metadata (season, water needs, growing period).

### Input Parameters

| Parameter | Range | Unit |
|---|---|---|
| Nitrogen (N) | 0 – 140 | kg/ha |
| Phosphorus (P) | 5 – 145 | kg/ha |
| Potassium (K) | 5 – 205 | kg/ha |
| pH | 3.5 – 10 | — |
| Temperature | 8 – 44 | °C |
| Humidity | 14 – 100 | % |
| Rainfall | 20 – 300 | mm |

### Supported Crops

22 crop types across all major Indian growing seasons:

| Kharif (Jun–Oct) | Rabi (Nov–Mar) | Zaid (Mar–Jun) |
|---|---|---|
| Rice, Maize | Chickpea, Kidney Beans | Watermelon |
| Pigeonpeas, Mothbeans | Lentil, Grapes | Muskmelon |
| Mungbean, Blackgram | Apple, Orange | Mungbean |
| Banana, Mango | Pomegranate | — |
| Papaya, Coconut | — | — |
| Cotton, Jute, Coffee | — | — |

### API Reference

#### `POST /predict`

**Request Body:**

```json
{
  "N": 50,
  "P": 50,
  "K": 50,
  "temperature": 25.0,
  "humidity": 60,
  "ph": 6.5,
  "rainfall": 150
}
```

**Success Response:**

```json
{
  "success": true,
  "cluster": 3,
  "primary": "rice",
  "recommendations": [
    {
      "name": "rice",
      "season": ["kharif"],
      "water": "High",
      "period": "120-150 days"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Missing required field: N"
}
```

#### `GET /health`

Returns `{ "status": "ok" }` — use to verify the server is running.

---

## RichPerson FD Advisor

A voice-first conversational AI for Indian Fixed Deposit guidance.

### How It Works

1. User clicks the mic button and speaks their FD question.
2. The browser's **Web Speech API** transcribes speech to text.
3. The transcript + conversation history is sent to the **Supabase Edge Function** (`fd-advisor`).
4. The Edge Function calls **Gemini 2.5 Flash** (falls back to 1.5 Flash on 503) with an India-specific system prompt.
5. The response is returned as plain text and read aloud via the **Web Speech Synthesis API**.

### Supported Languages

| Language | Code |
|---|---|
| English | `en-IN` |
| Hindi | `hi-IN` |
| Telugu | `te-IN` |
| Tamil | `ta-IN` |
| Kannada | `kn-IN` |
| Malayalam | `ml-IN` |
| Bengali | `bn-IN` |
| Marathi | `mr-IN` |
| Gujarati | `gu-IN` |

### Speech Pipeline

```
Mic → Web Speech API (STT) → Supabase Edge Function
   → Gemini 2.5 Flash → Plain text → Web Speech Synthesis (TTS) → Speaker
```

**Key behaviors:**
- Responses are intentionally in **plain text** (no markdown) for clean TTS playback.
- The last 6 conversation turns are sent as history for context continuity.
- Users can replay the last response with the **Listen** button.
- Automatic language detection for TTS voice — prefers Google voices when available.

---

## Speech-to-Text Model

The `Speech to Text model/` directory contains a **LoRA fine-tune** of [Whisper Large v3 Turbo](https://huggingface.co/openai/whisper-large-v3-turbo) built with [PEFT 0.18.1](https://github.com/huggingface/peft).

| File | Description |
|---|---|
| `adapter_model.safetensors` | LoRA adapter weights (~12.5 MB) |
| `adapter_config.json` | PEFT adapter configuration |
| `tokenizer.json` | Whisper tokenizer vocab (~3.7 MB) |
| `tokenizer_config.json` | Tokenizer settings |
| `processor_config.json` | Whisper feature extractor config |
| `asr_model_train.ipynb` | ASR model training notebook |
| `stt_model_train.ipynb` | STT fine-tuning experiment notebook |

> **Note:** This model is not wired into the live web app (which uses the browser's native Web Speech API). It represents a custom STT model trained as part of the broader Blostem research effort — intended for future integration or offline inference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES Modules) |
| **ML Backend** | Python, Flask, scikit-learn (GMM), pandas, NumPy, joblib |
| **AI / LLM** | Google Gemini 2.5 Flash (via Supabase Edge Functions) |
| **Edge Functions** | Supabase (Deno runtime, TypeScript) |
| **Speech** | Web Speech API (browser-native STT + TTS) |
| **Custom STT** | Whisper Large v3 Turbo + LoRA (PEFT) |
| **Fonts** | Inter (Google Fonts) |
| **Dev Server** | `npx serve` |

---

## Environment Variables

### Frontend (`js/config.js`)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous public key |

### Supabase Secrets (Edge Function)

| Secret | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |

Set via: `supabase secrets set GEMINI_API_KEY=<key>`

---

## Deployment

### Flask Backend

The `requirements.txt` includes **Gunicorn** for production serving:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Consider deploying to **Railway**, **Render**, **Fly.io**, or any container-based platform. Update `API_URL` in `js/app.js` to point to your deployed backend URL.

### Frontend

The frontend is a **static site** — deploy to any static host:

- **Vercel:** `vercel deploy`
- **Netlify:** drag-and-drop `index.html` or use the CLI
- **GitHub Pages:** push to a `gh-pages` branch

### Supabase Edge Functions

Already handled via `supabase functions deploy fd-advisor` (see [Getting Started](#3-configure-supabase-fd-advisor)).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

<div align="center">
  <p>Built with 🌱 for Indian farmers and investors</p>
</div>

