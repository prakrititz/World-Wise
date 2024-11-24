from fastapi import FastAPI, HTTPException
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
modelRisk_path = 'export_risk_model.joblib'
modelRisk = joblib.load(modelRisk_path)

# Load the aggregated data (same data used for training)
aggregated_data_path = 'aggregated_data_scaled.csv'
processed_data = pd.read_csv(aggregated_data_path)



# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
class GuideRequest(BaseModel):
    step_name: str
# Configure CORS
class IncentiveQuery(BaseModel):
    query: str

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
        finder = IncentiveFinder("AIzaSyAQwgGMrY-Ez-02A4Dn7t2X2dRbTgD27QQ")
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




# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}