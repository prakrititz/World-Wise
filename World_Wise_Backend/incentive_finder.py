import os
import google.generativeai as genai

class IncentiveFinder:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.content = self.load_incentives()
        
    def load_incentives(self):
        try:
            with open('Incentives.txt', 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            return None
        
    def find_incentives(self, query):
        if not self.content:
            return "Loading incentives data..."
            
        prompt = f"""
Context from Export Incentives Database:
{self.content}

Query: {query}
Provide specific export incentives and schemes relevant to the query.
Include eligibility criteria and benefits where applicable.
"""
        
        response = self.model.generate_content(prompt)
        return response.text
