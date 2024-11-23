import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# Load the datasets
file_path_1 = 'economic.csv'
file_path_2 = 'governance.csv'

data_1 = pd.read_csv(file_path_1)
data_2 = pd.read_csv(file_path_2)

# Merge datasets on 'Country Name' and 'Country Code'
merged_data = pd.merge(data_1, data_2, on=['Country Name', 'Country Code'], suffixes=('_econ', '_gov'))

# Select relevant columns (only country name and year-related columns)
columns_to_keep = ['Country Name'] + [col for col in merged_data.columns if '[YR' in col]
processed_data = merged_data[columns_to_keep]

# Clean and preprocess data (handling missing values and converting to numeric)
processed_data = processed_data.replace('..', pd.NA).dropna()
year_columns = processed_data.columns[1:]  # All columns except 'Country Name'
processed_data[year_columns] = processed_data[year_columns].apply(pd.to_numeric)

# Initialize a MinMaxScaler to scale year-related columns to the range [0, 1]
scaler = MinMaxScaler()

# Apply scaling to the year-related columns
processed_data[year_columns] = scaler.fit_transform(processed_data[year_columns])

# Aggregate (average) the scaled year columns for each country
aggregated_data = processed_data.groupby('Country Name').mean()

# Save the aggregated data
aggregated_data_path = 'aggregated_data_scaled.csv'
aggregated_data.to_csv(aggregated_data_path, index=True)

print(f"Aggregated and scaled data saved to {aggregated_data_path}")
