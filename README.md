
# Indian AI Legal Chatbot

A production-ready Retrieval Augmented Generation (RAG) stack for answering Indian law and constitutional queries using vector embeddings and AI.

---

## Architecture and Workflow Overview

This project implements a Retrieval-Augmented Generation (RAG) AI chatbot for Indian constitutional law queries. It combines vector search, semantic embeddings, and large language model generation to deliver precise and contextual answers.

---

## Architecture Components

### 1. Data Preparation and Chunking

- Raw legal/constitutional text data (e.g., data scrapped from kaanoon) is preprocessed and split into semantically meaningful chunks to fit embedding model context limits.
- Each chunk contains metadata like article number and title for easy referencing.

### 2. Embedding Generation

- Semantic embeddings for each chunk are computed locally using models like SentenceTransformers (`all-mpnet-base-v2`).
- These dense vector representations encode the semantic meaning of the text chunks.

### 3. Vector Database (Pinecone)

- Embeddings are uploaded to a managed vector search engine (Pinecone), which supports efficient similarity queries.
- The Pinecone index stores embeddings alongside metadata for retrieval.

### 4. Retrieval Backend (FastAPI)

- Receives user queries from the frontend.
- Converts queries to embeddings and searches Pinecone for the most relevant document chunks.
- Returns the retrieved chunks as context for language model input.

### 5. Language Model Generation (LLM)

- Uses services like OpenRouter or other APIs.
- Receives user query + retrieved context to generate accurate and well-informed answers.

### 6. Frontend Chat Interface (Next.js)

- The user interacts with a responsive chatbot UI.
- Sends questions to the backend API.
- Displays AI answers enriched with legal citations and sources.

---

## Workflow Summary

1. **User submits query** → Frontend sends to FastAPI backend.  
2. **Backend embeds query** → Searches Pinecone for top-k relevant chunks.  
3. **Context retrieval** → Combines user input with retrieved texts to form a prompt.  
4. **Prompt sent to LLM API** → Answers are generated with legal grounding.  
5. **Answer displayed** → Frontend shows AI response with source references.

---

## Our Approach: From Web-Scraped JSON to Vector Embeddings

### Step 1: Web Scraping and JSON Extraction

- We begin by scraping relevant legal documents and Q&A pairs from online sources.
- The raw scraped data is stored as JSON files, preserving useful fields like article titles, questions, answers, and URLs.

### Step 2: Data Cleaning and Chunking

- Large textual documents in JSON are cleaned for HTML tags, whitespace, and extraneous characters.
- Documents and long answers are split into smaller chunks (~200-300 words) with overlapping text to capture context.
- Each chunk is assigned a unique ID and maintains metadata referencing the source article or URL.

### Step 3: Vector Embedding Generation

- Chunks are embedded using local SentenceTransformer models (`all-mpnet-base-v2`) that convert text into fixed-length dense vectors.
- These embeddings capture the semantic meaning of each text chunk.

### Step 4: Uploading to Pinecone Vector Database

- The generated vectors, along with their metadata, are batch uploaded (`upsert`) to a Pinecone vector database index.
- The index supports efficient similarity search to retrieve most relevant chunks based on user query vectors.

### Step 5: Retrieval-Augmented Generation Setup

- User queries are embedded similarly and used to query Pinecone for top relevant chunks.
- Retrieved chunks provide factual context that is included as augmented input to a large language model (LLM) for answer generation.
- This process allows precise, context-aware legal advice based on the curated knowledge base.

---

This end-to-end pipeline ensures a scalable and accurate legal AI assistant by leveraging powerful vector search combined with deep language models.

---

## How to Run the Project

1. **Clone the repository:**

```bash
git clone https://github.com/uju09/neura-hack.git

```

2. **Install Python dependencies (for backend):**

```bash
cd fastapi
pip install -r requirements.txt
```


3. **Start the FastAPI backend:**

```bash
export PINECONE_API_KEY="your_pinecone_api_key"
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

4. **Start the Next.js frontend:**




```bash
cd frontend
npm install
npm run dev
```

https://github.com/user-attachments/assets/44a9e4cf-aa82-4d1b-8a47-11a22f9727ca

<img width="1470" height="956" alt="ai_ss" src="https://github.com/user-attachments/assets/1f264bc3-190b-4e7c-9982-6155a0f7062f" />



