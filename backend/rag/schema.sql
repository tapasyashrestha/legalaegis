-- Run this in Supabase SQL Editor to create the vector table

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE legal_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id TEXT,
    document_name TEXT,
    document_type TEXT,
    section_number TEXT,
    source TEXT,
    topic TEXT,
    page_number INTEGER,
    chunk_text TEXT,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  document_name text,
  chunk_text text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    legal_embeddings.id,
    legal_embeddings.document_name,
    legal_embeddings.chunk_text,
    1 - (legal_embeddings.embedding <=> query_embedding) AS similarity
  FROM legal_embeddings
  WHERE 1 - (legal_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
