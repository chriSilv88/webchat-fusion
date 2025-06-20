
# WebChat Fusion: AI Assistant Powered by FastAPI and Next.js

WebChat Fusion is a hybrid web application that combines the power of a responsive React frontend (via Next.js) with the flexibility of a Python-based FastAPI backend. It is designed to facilitate intelligent conversations with website content, leveraging LLMs and modern retrieval techniques.

![Interface Preview](images/chatbot.png)

## Highlights

- **Smart Web Content Handling**: Integrates LangChain for dynamic data parsing and retrieval from online resources.
- **Flexible LLM Backend**: Easily configurable to support different language models, including GPT-based APIs.
- **Modern UI/UX**: Built with developer-friendly technologies like Tailwind CSS and Radix UI for a sleek interface.

## System Structure

The backend logic is hosted via FastAPI and routed through Next.js middleware to expose all APIs under a unified `/backend/` path. Environment-based routing ensures smooth deployment locally and on cloud platforms.

- Development API server: `http://127.0.0.1:8000`
- Frontend interface: `http://localhost:3000`

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an `.env` file in the root directory:
   ```env
   OPENAI_TOKEN=your-api-key-here
   ```
3. Launch the full stack environment:
   ```bash
   npm run dev
   ```

## Launch Backend in Isolation

```bash
conda create -n fusion-bot python=3.10
conda activate fusion-bot
pip install -r requirements.txt
uvicorn api.main:app --reload
```

## Memory & Chat History (Work in Progress)

Options considered:
- Temporary memory via server variables
- Redis or similar in-memory cache
- Structured persistence using relational or NoSQL DBs

## Retrieval-Augmented Response System

The assistant fetches data from external sources, breaks it into sections, embeds them for vector storage, and performs semantic search to enrich model responses with contextually accurate insights.

## Context Pipeline Modules

Custom logic for:
- HTML parsing
- Data chunking
- Embedding with vector stores
- Query-aware context resolution

## Background & Validation

WebChat Fusion was originally developed as part of an enterprise-grade internal assistant for automating documentation retrieval and conversational support within a multilingual knowledge base. The architecture was refined across multiple deployments in private cloud environments, with attention to fast response time, modularity, and privacy-focused vector search integration.
