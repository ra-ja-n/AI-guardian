import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet31
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask,request,jsonify
import PyPDF2
import docx

app = Flask(__name__)

def preprocess_text(text):
    # Tokenize the text
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords and non-alphabetic tokens
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    
    # Lemmatize tokens
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
    
    # Join tokens into a single string
    preprocessed_text = ' '.join(lemmatized_tokens)
    
    return preprocessed_text

def get_synonyms(word):
    synonyms = set()
    for syn in wordnet31.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name())
    return synonyms

def extract_keywords(document, keywords):
    # Preprocess document and keywords
    preprocessed_document = preprocess_text(document)
    preprocessed_keywords = [preprocess_text(keyword) for keyword in keywords]
    
    # Expand keywords with synonyms
    expanded_keywords = set(keywords)
    for keyword in keywords:
        expanded_keywords.update(get_synonyms(keyword))
    
    # Vectorize the document and keywords
    vectorizer = TfidfVectorizer()
    vectorized_text = vectorizer.fit_transform([preprocessed_document] + list(expanded_keywords))
    
    # Calculate cosine similarity between document and keywords
    similarities = cosine_similarity(vectorized_text[0:1], vectorized_text[1:])[0]
    
    # Sort keywords based on similarity score
    sorted_keywords = [(keyword, similarity) for keyword, similarity in zip(list(expanded_keywords), similarities)]
    sorted_keywords.sort(key=lambda x: x[1], reverse=True)
    num_keywords = len(sorted_keywords)
    
    # Extract top N keywords
    top_keywords = [keyword for keyword, _ in sorted_keywords[:num_keywords]]
    
    return top_keywords

def extract_similar_keywords(text,keywords):
    # Your keyword extraction logic here
    
    similar_keywords = []
    for keyword in text:
        for given_keyword in keywords:
            if are_similar(keyword, given_keyword):
                similar_keywords.append(keyword)
                break
    
    return similar_keywords

def are_similar(word1, word2):
    synsets1 = wordnet31.synsets(word1)
    synsets2 = wordnet31.synsets(word2)
    for synset1 in synsets1:
        for synset2 in synsets2:
            if synset1.wup_similarity(synset2) is not None and synset1.wup_similarity(synset2) > 0.8:
                return True
    return False

def convert_pdf_to_plain_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        text = ''
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extractText()
        return text

def convert_docx_to_plain_text(docx_path):
    doc = docx.Document(docx_path)
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text

def convert_to_plain_text(file_path):
    if file_path.endswith('.pdf'):
        return convert_pdf_to_plain_text(file_path)
    elif file_path.endswith('.docx'):
        return convert_docx_to_plain_text(file_path)
    else:
        raise ValueError("Unsupported file format. Only PDF and Word files are supported.")



@app.route("/extract", methods=["Post"])
def extract():
    
    input_text = request.json.get("text")

    keywords = ["virus", "copyrighted information","halucinations", "insider trading", "malware deployment", "phishing", "ransomware", "recruitment activities","self development", "self harming", "trojan horse", "voilence"]

    extracted_keywords = extract_keywords(input_text, keywords)
    similar_keywords = extract_similar_keywords(extracted_keywords,keywords)
    print(similar_keywords)
    return jsonify({"extracted": similar_keywords})

if __name__ == "__main__":
    app.run(debug=True)