from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Initialize Flask app
app = Flask(__name__)

@app.route('/api/receive-expenses', methods=['POST'])
def receive_expenses():
    """API endpoint to receive user expenses and predict the next week's spend."""
    data = request.json # get the data from node.js backend
    user_expenses = data.get('weeklyExpenses') #extract weeklyExpenses
    user_id = data.get("userId") #extract user id 

    # Prepare the data
    records = []
    for year, weeks in user_expenses.items():
        for week, categories in weeks.items():
            total_spend = sum(categories.values()) #Add all the category totals together for the week
            records.append({
                "Week": week, #Week number
                "Total Spend": total_spend, #Total spent for that week
            })

    df = pd.DataFrame(records) #DataFrame this data

    # Ensure sufficient data for training
    if len(df) < 2:
        return jsonify({"error": "Insufficient data to train the model."}), 400

    # Prepare features and target
    X = df[["Week"]]  # Use 'Week' as the feature (you could also use other features like week numbers if needed)
    y = df["Total Spend"]

    # Split data into train-test (use 80-20 split for simplicity)
    train_size = int(0.8 * len(df))
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # Train the model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred) #error info
    rmse = mean_squared_error(y_test, y_pred, squared=False) #error info

    # Predict next week's spend (using the next week value as the feature)
    next_week_data = pd.DataFrame({"Week": [int(df["Week"].max()) + 1]})
    next_week_pred = model.predict(next_week_data) #Prediction data

    return jsonify({ #Return some info, including predicted for next week
        "message": "Model trained and prediction generated successfully!",
        "mean_absolute_error": mae,
        "root_mean_squared_error": rmse,
        "predicted_next_week_spend": next_week_pred[0],
        "user_id": user_id,
    })


if __name__ == '__main__':
    app.run(port=5001)
