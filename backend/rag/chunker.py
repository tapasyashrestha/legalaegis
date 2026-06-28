import re

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list:
    """
    Semantic chunking with overlap.
    """
    # Simple whitespace-based token approximation
    words = re.split(r'\s+', text)
    chunks = []
    
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += (chunk_size - overlap)
        
    return chunks
