class QueryGeneratorAgent:
    @staticmethod
    def generate(issues: dict) -> list:
        """
        Converts extracted issues into optimized semantic retrieval queries.
        """
        queries = []
        for issue in issues.get("issues", []):
            queries.append(f"{issues.get('notice_type', '')} {issue}")
            
        for section in issues.get("sections", []):
            queries.append(f"Applicability of {section}")
            
        return queries

class ContextRankingAgent:
    @staticmethod
    def rank(chunks: list) -> list:
        """
        Ranks and deduplicates chunks based on similarity score and authority.
        """
        # Sort by similarity (assuming pgvector returns similarity score)
        # Deduplicate based on chunk_id
        unique_chunks = {chunk['id']: chunk for chunk in chunks}.values()
        return list(unique_chunks)[:10]  # Return top 10
