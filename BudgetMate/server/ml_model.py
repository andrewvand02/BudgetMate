import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from database import fetch_expenses

def prepare_data(user_id):
    # Fetch expense data from the database
    data = fetch_expenses(user_id)

    # Convert to DataFrame
    df = pd.DataFrame(data, columns=['user_id', 'year', 'week', 'category', 'amount'])

    # Pivot the data to have categories as columns
    df_pivot = df.pivot_table(index=['year', 'week'], columns='category', values='amount', aggfunc='sum').fillna(0)

    # Reset index for easier handling
    df_pivot = df_pivot.reset_index()

    # Feature Engineering: Add features like month and previous week's expense for each category
    df_pivot['month'] = df_pivot['week'].apply(lambda x: (x - 1) // 4 + 1)  # Basic month feature
    df_pivot['previous_week'] = df_pivot['Groceries'].shift(1)  # Previous week's expense for Groceries
    df_pivot = df_pivot.fillna(0)

    return df_pivot

def train_model(user_id, category):
    df_pivot = prepare_data(user_id)

    # Define features and target
    X = df_pivot[['year', 'week', 'month', 'previous_week']]  # Features
    y = df_pivot[category]  # Target (expenses for the given category)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize the model
    model = LinearRegression()

    # Train the model
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f"Mean Squared Error for {category}: {mse}")

    return model

def predict_expenses(user_id):
    # Get a list of all categories from the user's expenses
    df_pivot = prepare_data(user_id)
    categories = df_pivot.columns[4:]  # All columns from the 5th column onwards are categories

    predictions = {}

    # Fetch the most recent data for the user (latest week)
    latest_data = df_pivot.iloc[-1]  # Get the latest row (last week data)
    latest_week = latest_data['week']
    latest_year = latest_data['year']
    latest_month = latest_data['month']
    previous_week_expenses = latest_data['previous_week']

    # Generate the next week's features
    next_week = latest_week + 1
    next_year = latest_year if latest_week < 52 else latest_year + 1  # If week 52, increment the year
    next_month = (next_week - 1) // 4 + 1  # Adjust month based on the next week

    # Prepare the next week's feature set
    next_week_data = {
        'year': [next_year],
        'week': [next_week],
        'month': [next_month],
        'previous_week': [previous_week_expenses]  # Use previous week's expenses
    }
    next_week_df = pd.DataFrame(next_week_data)

    for category in categories:
        # Train the model for each category
        model = train_model(user_id, category)
        
        # Predict the next week's expenses for the category
        next_week_expense = model.predict(next_week_df)
        predictions[category] = next_week_expense[0]

    return predictions
