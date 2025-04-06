from flask import Flask, request, jsonify
from pipeline import predict, load_safe_domains
import joblib
from flask_cors import CORS


# API Initialization
app = Flask(__name__)
CORS(app)

# load the model and scaler
model = joblib.load(r'D:\Projects\MaliciousUrlDetection\backend\url_classifier_model.joblib')
scaler = joblib.load(r'D:\Projects\MaliciousUrlDetection\backend\url_classifier_scaler.joblib')
load_safe_domains()

# Define the API endpoint
@app.route('/detect', methods=['POST'])
def api():
    url = request.json['url'] # Get the URL from the request(from the frontend)
    return jsonify(predict(url, model, scaler)) # Return the prediction result as JSON

if __name__ == '__main__':
    app.run(debug=True)
