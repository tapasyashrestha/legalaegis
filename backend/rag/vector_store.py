import os
from supabase import create_client, Client
from openai import OpenAI
from backend.rag.chunker import chunk_text

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url else None

def ingest_document(text: str, metadata: dict):
    """
    Chunks document, generates embeddings, and stores in Supabase pgvector.
    """
    chunks = chunk_text(text, chunk_size=800, overlap=100)
    
    for i, chunk in enumerate(chunks):
        # Generate embedding
        response = client.embeddings.create(
            input=chunk,
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding
        
        # Store in Supabase
        if supabase:
            supabase.table("legal_embeddings").insert({
                "chunk_id": f"{metadata.get('document_name')}_chunk_{i}",
                "document_name": metadata.get("document_name"),
                "document_type": metadata.get("document_type"),
                "source": metadata.get("source"),
                "chunk_text": chunk,
                "embedding": embedding
            }).execute()
