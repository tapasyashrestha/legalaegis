from openai import OpenAI
import json
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class IssueSpotterAgent:
    @staticmethod
    def analyze(text: str) -> dict:
        """
        Detects notice type, sections, deadlines, and issues.
        """
        prompt = f"""
        Analyze the following legal/GST notice and extract:
        - notice_type
        - sections (list)
        - issues (list)
        - deadlines (list)
        
        Notice Text:
        {text}
        
        Return ONLY valid JSON.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
