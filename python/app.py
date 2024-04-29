from flask import Flask,request,jsonify
from model import BertBinaryClassifier
import pickle

app = Flask(__name__)

with open("clt_C_clt_V_classifier.pkl" , "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["Post"])
def predict():

    input_text = request.json.get("text")

    # Perform prediction
    probabilities = model.predict(input_text)

    # Extract the probability of the positive class
    prob_positive_class = probabilities[0][1].item()

    # Convert probability to binary prediction (0 or 1)
    prediction = 1 if prob_positive_class >= 0.5 else 0

    # Return the prediction
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
