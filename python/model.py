import torch
from torch.utils.data import DataLoader, TensorDataset
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.model_selection import train_test_split
import pandas as pd
import pickle

class BertBinaryClassifier:
    def __init__(self, model_name="bert-base-uncased", num_labels=2):
        self.model = BertForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)
        self.tokenizer = BertTokenizer.from_pretrained(model_name)

    def tokenize_data(self, texts, labels, max_length=128):
        tokenized_texts = self.tokenizer(texts, padding=True, truncation=True, max_length=max_length, return_tensors="pt")
        labels = torch.tensor(labels)
        return TensorDataset(tokenized_texts.input_ids, tokenized_texts.attention_mask, labels)

    def train(self, train_dataset, val_dataset=None, batch_size=32, epochs=3, learning_rate=2e-5):
        optimizer = torch.optim.AdamW(self.model.parameters(), lr=learning_rate)
        criterion = torch.nn.CrossEntropyLoss()

        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        if val_dataset:
            val_loader = DataLoader(val_dataset, batch_size=batch_size)

        for epoch in range(epochs):
            self.model.train()
            running_loss = 0.0
            for input_ids, attention_mask, labels in train_loader:
                optimizer.zero_grad()
                outputs = self.model(input_ids, attention_mask=attention_mask)
                loss = criterion(outputs.logits, labels)
                loss.backward()
                optimizer.step()
                running_loss += loss.item() * len(labels)

            epoch_loss = running_loss / len(train_dataset)
            print(f"Epoch {epoch + 1}/{epochs}, Training Loss: {epoch_loss:.4f}")

            if val_dataset:
                val_loss = self.evaluate(val_loader, criterion)
                print(f"Validation Loss: {val_loss:.4f}")

    def evaluate(self, data_loader, criterion):
        self.model.eval()
        running_loss = 0.0
        with torch.no_grad():
            for input_ids, attention_mask, labels in data_loader:
                outputs = self.model(input_ids, attention_mask=attention_mask)
                loss = criterion(outputs.logits, labels)
                running_loss += loss.item() * len(labels)
        return running_loss / len(data_loader.dataset)

    def predict(self, text):
        inputs = self.tokenizer(text, padding=True, truncation=True, return_tensors="pt")
        outputs = self.model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)
        return probabilities
    
print("Model loaded successfully!")