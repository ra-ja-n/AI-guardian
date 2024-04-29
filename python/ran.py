import redis
import json
import pickle
from model import BertBinaryClassifier
import pickle
from model2 import MultiClassifier



with open("clt_C_clt_V_classifier.pkl" , "rb") as f:
    model1 = pickle.load(f)

with open("model_2_classifier.pkl" , "rb") as f:
    model2 = pickle.load(f)
# Connect to Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Define the name of the Redis queue
queue_name = 'message'

def pop_from_queue():
    # Pop an item from the queue
    item = redis_client.brpop(queue_name, timeout=0)  # Blocking pop with timeout 0
    if item is not None:
        item_json = item[1].decode('utf-8')  # Decode bytes to string
        item_dict = json.loads(item_json)  # Convert JSON string to Python dictionary
        # Extract username
        id = f"{item_dict['id']}"
        prompt = f"{item_dict['message']}"
        return [id, prompt]
    else:
        return None

if __name__ == '__main__':
    # Example usage: continuously pop items from the queue
    while True:
        [id, prompt] = pop_from_queue()
        print("Extracted id:", id)
        print("Extracted promp:", prompt)
        probabilities = model1.predict(prompt)
        prob_positive_class = probabilities[0][1].item()
        prediction = 1 if prob_positive_class >= 0.5 else 0
        print("Prediction:", prediction)
        if prediction == 1:
            print("This is a positive message")
            redis_client.publish('positive', json.dumps({'id': id, 'valid': True, 'message': prompt}))
        else:
            category = model2.predict(prompt)
            if category == 0:
                category="copyrighted information"
            elif category == 1:
                category="halucinations"
            elif category == 2:
               category="insider trading" 
            elif category == 3:
                category="malware deployment"
            elif category == 4:
                category="phishing"
            elif category == 5:
                category="ransomware"
            elif category == 6:
                category="recruitment activities"
            elif category == 7:
                category="self development"
            elif category == 8:
                category="self harming"
            elif category == 9:
                category="trojan horse"
            elif category == 10:
                category="voilence"
            elif category == 11:
                category="virus"
            print("This is a negative message")
            redis_client.publish('model2', json.dumps({'id': id, 'category': category, 'message': prompt}))
            



        
