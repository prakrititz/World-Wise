import pandas as pd
import joblib
from fuzzywuzzy import process

# Load the trained model
model_path = 'export_risk_model.joblib'
model = joblib.load(model_path)

# Load the aggregated data (same data used for training)
aggregated_data_path = 'aggregated_data_scaled.csv'
processed_data = pd.read_csv(aggregated_data_path)

# Normalize the country name by removing quotes and converting to lowercase
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


# # Example usage
# country_name = 'United arab emirates'  # Replace with any country name
# risk = predict_risk(country_name, model, processed_data)
# if risk is not None:
#     print(f"The predicted risk for {country_name} is: {risk}")
