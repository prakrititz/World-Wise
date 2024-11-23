import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

# Load datasets
file_path = 'aggregated_data_scaled.csv'

data_1 = pd.read_csv(file_path)

# Merge datasets
merged_data = data_1

# Select relevant columns
columns_to_keep = ['Country Name'] + [col for col in merged_data.columns if '[YR' in col]
processed_data = merged_data[columns_to_keep]

# Clean and preprocess data
processed_data = processed_data.replace('..', pd.NA).dropna()
year_columns = processed_data.columns[1:]
processed_data[year_columns] = processed_data[year_columns].apply(pd.to_numeric)

# Create features and target
features = processed_data.iloc[:, 1:].mean(axis=1)  # Use average as a single feature
processed_data['Risk'] = (features.max() - features) / (features.max() - features.min()) * 10
processed_data.to_csv("aggregated_risk", index=True)
# Prepare data for training
X = processed_data.iloc[:, 1:-1]  # Feature columns
y = processed_data['Risk']        # Target column

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(random_state=42, n_estimators=100)
model.fit(X_train, y_train)

# Test model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"Mean Absolute Error: {mae}")

# Save the model
model_path = 'export_risk_model.joblib'
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")

