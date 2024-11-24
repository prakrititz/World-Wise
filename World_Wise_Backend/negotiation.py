import os
from groq import Groq
from typing import Dict, List, Union
import time
from starlette.config import Config
config = Config('.env')

class NegotiationCoach:
    def __init__(self):
        self.client = Groq(api_key=config("GROQ_API_KEY"))
        self.conversation_history = []  # Initialize the conversation history
        
    def _get_system_prompt(self) -> str:
        return """You are an expert negotiation coach providing real-time strategic advice. 
        Analyze offers, suggest counter-offers, and provide tactical recommendations.
        Focus on:
        - Identifying leverage points
        - Suggesting specific counter-offers with rationale
        - Highlighting potential risks and opportunities
        - Maintaining professionalism and ethics
        Be concise, direct, and practical in your advice."""

    def _format_messages(self) -> List[Dict[str, str]]:
        messages = [{"role": "system", "content": self._get_system_prompt()}]
        for msg in self.conversation_history:
            messages.append(msg)
        return messages


    def suggest_counter_offer(self, 
                            current_offer: float,
                            target_price: float,
                            iam: str,
                            negotiation_context: str) -> Dict[str, Union[float, str]]:
        
        prompt = f"""
        Based on:
        - other party's Current offer: ${current_offer:,.2f}
        - budget(if i am a buyer)/Target price(if i am a seller): ${target_price:,.2f}
        - I am: {iam}
        - Context: {negotiation_context}

        Provide:
        1. Specific counter-offer amount and persuasive reason that i should say to the other party to agree on my price.
        note that if i am a  buyer i want go get the product at as low price as possible from the budget and therefore i would like to reduce the current price. And if i am a  seller i want to sell the product at as high price as possible from the target price and therefore i would like increase the current price.
        """
        
        self.conversation_history.append({"role": "user", "content": prompt})
        
        try:
            completion = self.client.chat.completions.create(
                messages=self._format_messages(),
                model="llama3-8b-8192",
            )
            
            response = completion.choices[0].message.content
            self.conversation_history.append({"role": "assistant", "content": response})
            
            return {
                "suggestion": response
            }
        
        except Exception as e:
            return {
                "suggestion": f"Error generating counter-offer: {str(e)}",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "status": "error"
            }
