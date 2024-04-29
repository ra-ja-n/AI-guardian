from flask import Flask,request,jsonify
import pickle
from model2 import MultiClassifier

app = Flask(__name__)

with open("model_2_classifier.pkl" , "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["Post"])
def predict():

    input_text = request.json.get("text")

    # Perform prediction
    probabilities = model.predict(input_text)


    # Return the prediction
    return jsonify({"prediction": probabilities})

def model2_predict(input_text):
    # Perform prediction
    probabilities = model.predict(input_text)
    return probabilities

if __name__ == "__main__":
    app.run(debug=True)
