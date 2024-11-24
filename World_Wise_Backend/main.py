from fastapi import FastAPI, HTTPException,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import logging
from data import checklist_data
from pydantic import BaseModel
import pandas as pd
import joblib
from fuzzywuzzy import process
from test import *
from incentive_finder import IncentiveFinder
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from document_summarizer import DocumentSummarizer
from negotiation import *
import uvicorn
from typing import Optional
import json


modelRisk_path = 'export_risk_model.joblib'
modelRisk = joblib.load(modelRisk_path)

# Load the aggregated data (same data used for training)
aggregated_data_path = 'aggregated_data_scaled.csv'
processed_data = pd.read_csv(aggregated_data_path)



# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
config = Config('.env')
app = FastAPI()
class GuideRequest(BaseModel):
    step_name: str
# Configure CORS
class IncentiveQuery(BaseModel):
    query: str

app.add_middleware(
    SessionMiddleware,
    secret_key=config("SECRET_KEY") ,# Change this to a secure secret key
    max_age = 3600
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
class SummarizeQuery(BaseModel):
    file: UploadFile = File(...)

class NegotiationRequest(BaseModel):
    currentOffer: str
    targetPrice: str
    role: str
    context: str

class IncentiveQuery(BaseModel):
    query: str

GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET')
FRONTEND_URL = config('FRONTEND_URL')
GOOGLE_GEMINI_KEY = config("GOOGLE_GEMINI_KEY")
# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@app.get('/api/auth/google')
async def google_login(request: Request):
    """Initiate Google OAuth login"""
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get('/api/auth/callback')
async def auth_callback(request: Request):
    """Handle the Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        
        # Get user info from Google
        user = token.get('userinfo')
        if user:
            # Store user info in session
            user_data = {
                'id': user.get('sub'),
                'email': user.get('email'),
                'name': user.get('name'),
                'picture': user.get('picture'),
                'email_verified': user.get('email_verified')
            }
            request.session['user'] = user_data
            
            # Redirect to frontend with success
            return RedirectResponse(
                url=f"{FRONTEND_URL}?auth=success&user={json.dumps(user_data)}",
                status_code=status.HTTP_302_FOUND
            )
        
        return RedirectResponse(
            url=f"{FRONTEND_URL}?auth=error&message=Failed to get user info",
            status_code=status.HTTP_302_FOUND
        )
        
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}?auth=error&message={str(e)}",
            status_code=status.HTTP_302_FOUND
        )

@app.get('/api/auth/user')
async def get_current_user(request: Request):
    """Get the current authenticated user"""
    user = request.session.get('user')
    if user:
        return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )

@app.post('/api/auth/logout')
async def logout(request: Request):
    """Logout the current user"""
    request.session.pop('user', None)
    return {"message": "Logged out successfully"}

@app.get('/api/auth/check')
async def check_auth(request: Request):
    """Check if user is authenticated"""
    user = request.session.get('user')
    return {
        "authenticated": user is not None,
        "user": user
    }
    
# Configure Gemini
try:
    genai.configure(api_key=GOOGLE_GEMINI_KEY)
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    logger.error(f"Failed to initialize Gemini: {e}")
    raise

class ChatMessage(BaseModel):
    content: str


def normalize_country_name(name):
    """Normalize country names by removing quotes and converting to lowercase."""
    if isinstance(name, str):
        return name.strip().replace('"', '').lower()
    return None

# Function to predict risk for a given country
def predict_risk(country_name, model, processed_data, threshold=80):
    """
    Predict export risk for a given country name.
    
    Args:
        country_name (str): Input country name.
        model: Trained machine learning model.
        processed_data (DataFrame): Data used for predictions.
        threshold (int): Minimum similarity score to accept a match (default: 80).

    Returns:
        float or None: Predicted risk score, or None if no valid match found.
    """
    # Normalize the input country name
    normalized_name = normalize_country_name(country_name)
    
    # Find the closest match for the country name
    match_result = process.extractOne(normalized_name, processed_data['Country Name'].apply(normalize_country_name))
    
    if match_result is None or match_result[1] < threshold:
        # Reject the match if no valid match found or similarity score is too low
        print(f"No valid match found for country: {country_name}")
        return None
    
    # Extract match and score safely
    match = match_result[0]  # Best match
    score = match_result[1]  # Similarity score (used for validation)

    #print(f"Matched '{country_name}' with '{match}' (Score: {score})")

    # Extract the row corresponding to the matched country
    country_row = processed_data[processed_data['Country Name'].apply(normalize_country_name) == match]
    
    # Extract features (using the year columns for prediction)
    year_columns = [col for col in processed_data.columns if '[YR' in col]
    country_features = country_row[year_columns].values.reshape(1, -1)  # Ensure the shape matches the model input
    
    # Make prediction using the trained model
    risk = model.predict(country_features)
    return risk[0]



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
class RiskAnalysisRequest(BaseModel):
    country: str


@app.post("/incentives")
async def get_incentives(query: IncentiveQuery):
    try:
        finder = IncentiveFinder(GOOGLE_GEMINI_KEY)
        result = finder.find_incentives(query.query)
        return {"response": result}
    except Exception as e:
        logger.error(f"Error in incentives endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )


@app.post("/risk-analysis")
async def analyze_risk(request: RiskAnalysisRequest):
    try:
        risk_score = predict_risk(request.country, modelRisk, processed_data)
        
        if risk_score is None:
            return {
                "risk_score": 0,
                "analysis": "Please verify the country name and try again. We're continuously expanding our database."
            }
        
        prompt = f"""
        Create a comprehensive export risk analysis for {request.country} with a risk score of {risk_score:.2f}:

        ## Risk Assessment
        - Current risk level and score interpretation
        - Key economic indicators affecting the score
        - Regional market position

        ## Market Analysis
        - Trade opportunities and strengths
        - Competitive advantages
        - Growth potential sectors

        ## Risk Mitigation
        - Recommended safety measures
        - Insurance and documentation requirements
        - Best practices for this market

        ## Strategic Recommendations
        - Entry strategy suggestions
        - Partnership opportunities
        - Timeline considerations
        """
        
        analysis = model.generate_content(prompt)
        
        return {
            "risk_score": float(risk_score),
            "analysis": analysis.text
        }
    except Exception as e:
        logger.error(f"Risk analysis error: {e}")
        raise HTTPException(status_code=500, detail="Error processing risk analysis")


@app.post("/detailed-guide")
async def get_detailed_guide(request: GuideRequest):
    prompt = f"""
    Create a comprehensive export guide for {request.step_name}:

    Structure your response with these sections:
    1. Overview and Purpose
       - Key benefits
       - When this document is needed
       - Validity period

    2. Step-by-Step Process
       - Detailed preparation steps
       - Required information for each field
       - Document submission process
       - Processing timeline

    3. Required Documents
       - List of supporting documents
       - Format specifications
       - Special requirements

    4. Best Practices
       - Industry standards
       - Quality checks
       - Professional tips

    5. Common Pitfalls
       - Frequent mistakes
       - How to avoid them
       - Solution strategies

    6. Legal Compliance
       - Regulatory requirements
       - Important regulations
       - Compliance checklist

    7. Cost Considerations
       - Fee structure
       - Additional charges
       - Payment methods

    8. Expert Tips
       - Time-saving strategies
       - Efficiency improvements
       - Professional recommendations

    Format the response in clear markdown using:
    - ## for main sections
    - ### for subsections
    - ✓ for checkpoints
    - 📌 for important notes
    - ⚠️ for warnings
    - 💡 for tips
    - 🔍 for detailed explanations
    """
    
    response = model.generate_content(prompt)
    return {"response": response.text}


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

@app.post("/summarize")
async def summarize_docs(file: UploadFile = File(...)):
    try:
        finder = DocumentSummarizer(config("GROQ_API_KEY"))
        result = finder.process_document(file)
        return {"response": result}
    except Exception as e:
        logger.error(f"Error in incentives endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )

@app.post("/negotiation")
async def get_negotiation_strategy(request: NegotiationRequest):
    try:
        coach = NegotiationCoach()  # Remove the API key from constructor
        
        current_offer = float(request.currentOffer)
        target_price = float(request.targetPrice)
        
        result = coach.suggest_counter_offer(
            current_offer=current_offer,
            target_price=target_price,
            iam=request.role,
            negotiation_context=request.context
        )
        
        logger.info(f"Negotiation response generated: {result}")
        return result
        
    except ValueError as ve:
        logger.error(f"Value error in negotiation: {ve}")
        raise HTTPException(status_code=400, detail="Invalid numeric values provided")
    except Exception as e:
        logger.error(f"Error in negotiation endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
