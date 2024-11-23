from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import logging
from data import checklist_data
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Configure Gemini
try:
    genai.configure(api_key="AIzaSyAQwgGMrY-Ez-02A4Dn7t2X2dRbTgD27QQ")
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    logger.error(f"Failed to initialize Gemini: {e}")
    raise

class ChatMessage(BaseModel):
    content: str

def generate_export_response(user_message: str) -> str:
    try:
        # More detailed context with specific examples
        context = """
        I am Ani an AI assistant specializing in export documentation and processes for India. I provide detailed, 
        practical guidance on export-related matters.
        Please provide specific, actionable advice based on the user's query.
        """

        # Structured prompt with clear instructions
        prompt = f"""
        Context: {context}

        User Query: {user_message}

        Please provide a detailed, practical response focusing on:
        - Specific steps or requirements
        - Relevant documentation needed
        - Common pitfalls to avoid
        - Timeline expectations
        - Next steps

        Response:
        """

        # Generate response with safety settings
        response = model.generate_content(
            prompt,
            generation_config={
                'temperature': 0.7,
                'top_p': 0.8,
                'top_k': 40,
                'max_output_tokens': 1024,
            }
        )

        # Check if response is empty or invalid
        if not response.text or len(response.text.strip()) < 10:
            raise ValueError("Generated response is too short or empty")

        return response.text.strip()

    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise

@app.post("/chat")
async def chat_endpoint(message: ChatMessage):
    try:
        if not message.content.strip():
            raise HTTPException(status_code=400, detail="Message content cannot be empty")

        logger.info(f"Received chat message: {message.content[:100]}...")
        response = generate_export_response(message.content)
        
        if not response:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate response"
            )

        return {"response": response}

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )
@app.get("/checklist")
async def get_checklist():
    return {"data": checklist_data}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}