from openai import OpenAI
import os
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ReportGeneratorAgent:
    @staticmethod
    def generate(issues: dict, context_chunks: list) -> dict:
        """
        Generates the legal report using ONLY retrieved context.
        """
        context_text = "\n\n".join([f"Source: {c['source']}\n{c['chunk_text']}" for c in context_chunks])
        
        prompt = f"""
        You are an expert Legal AI Assistant. Generate a structured report for this notice.
        
        Notice Issues:
        {json.dumps(issues, indent=2)}
        
        Retrieved Legal Context (MUST USE THESE FOR CONCLUSIONS):
        {context_text}
        
        Requirements:
        - Never answer using internal knowledge.
        - Every legal conclusion must be grounded in the retrieved documents.
        - Generate: Summary, Severity (High/Medium/Low), Consequences, Required Documents, Next Steps.
        
        Return JSON.
        """
        
        response = client.chat.completions.create(
            model="gpt-4-turbo", # or gpt-4.1 if available
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
