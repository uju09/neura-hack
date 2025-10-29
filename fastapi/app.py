# app.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

# Load embedding model once
embed_model = SentenceTransformer('all-mpnet-base-v2')

# Initialize Pinecone client
api_key = "pcsk_5vDaVa_MLEpBSYAgnZfEQDV7sum2fimd8b31HcAhetwDqKLWYazdMu1WZRRGTMdEzhcGt1"
if not api_key:
    raise ValueError("Please set PINECONE_API_KEY environment variable")

pc = Pinecone(api_key=api_key)

index_name = "kaanoon"
dimension = 768  # all-mpnet-base-v2 uses 768 dimensions

# Create index if not exists
existing_indexes = pc.list_indexes().names()
if index_name not in existing_indexes:
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

index = pc.Index(index_name)

@app.post("/rag")
async def rag_search(request: QueryRequest):
    query = request.query
    query_embedding = embed_model.encode(query).tolist()

    response = index.query(
        vector=query_embedding,
        top_k=5,
        include_metadata=True
    )

    # Extract context and sources from matches
    context_parts = []
    sources = []
    
    for match in response.matches:
        if 'metadata' in match and 'text' in match.metadata:
            context_parts.append(match.metadata['text'])
        if 'metadata' in match and 'url' in match.metadata:
            sources.append(match.metadata['url'])
    
    context = "\n---\n".join(context_parts)

    return {
        "context": context, 
        "sources": sources,
        "matches_found": len(response.matches)
    }

@app.get("/")
async def root():
    return {"message": "RAG API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)