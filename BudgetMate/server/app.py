from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/receive-expenses', methods=['POST'])
def receive_expenses():
    data = request.json
    user_id = data.get('userId')
    weekly_expenses = data.get('weeklyExpenses')

    # Process the received data as needed
    print(f"Weekly expenses received for user {user_id}: {weekly_expenses}")

    # Example: Save to a database or analyze further
    # save_to_database(user_id, weekly_expenses)

    return jsonify({"message": "Expenses received successfully!"}), 200

if __name__ == '__main__':
    app.run(port=5001)  # Run on a separate port
