import os
from supabase import create_client, Client
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url else None

class RetrievalAgent:
    @staticmethod
    def retrieve(queries: list) -> list:
        """
        Retrieves relevant legal chunks from Supabase pgvector using embeddings.
        """
        all_chunks = []
        for query in queries:
            response = client.embeddings.create(
                input=query,
                model="text-embedding-3-small"
            )
            query_embedding = response.data[0].embedding
            
            if supabase:
                # RPC call to pgvector match_documents function
                res = supabase.rpc(
                    'match_documents', 
                    {'query_embedding': query_embedding, 'match_threshold': 0.78, 'match_count': 5}
                ).execute()
                all_chunks.extend(res.data)
                
        return all_chunks
