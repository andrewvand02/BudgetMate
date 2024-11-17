from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict-expenses', methods=['POST'])
def predict_expenses():
    return jsonify({'predicted_expense': 123.45})  # Example value

if __name__ == '__main__':
    app.run(port=5001)  # Run on a separate port
