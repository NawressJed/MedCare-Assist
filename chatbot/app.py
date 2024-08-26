from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure the Google Generative AI SDK
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No API key found. Please set the GEMINI_API_KEY environment variable.")

genai.configure(api_key=api_key)

# Create the model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config
)

# Initialize the chat session with improved message style
chat_session = model.start_chat(
    history=[
        {
            "role": "user",
            "parts": [
                "You are MedCare Assist, a friendly and expert AI assistant..."
            ],
        },
        {
            "role": "model",
            "parts": [
                "Okay, I understand. I'm ready to act as MedCare Assist and interact with patients..."
            ],
        },
    ]
)

def format_response(text):
    # List of delimiters to break lines after
    delimiters = ['?', 'How long have you had the fever?', 'Are there any other symptoms you\'re experiencing, like chills, body aches, headache, cough, or sore throat?', 'Have you taken any medications for the fever?']
    for delimiter in delimiters:
        text = text.replace(delimiter, delimiter + "\n\n")
    return text

@app.route('/chat', methods=['POST'])
def chat():
    input_message = request.json.get('message')
    if not input_message:
        return jsonify({'error': 'No message provided'}), 400

    # Send message to the chatbot
    response = chat_session.send_message(input_message)

    # Format the response for better readability
    formatted_response = format_response(response.text)
    formatted_response = formatted_response.replace("**", "").replace("*", "")  # Removing markdown for simplicity

    # Return the formatted response text
    return jsonify({'response': formatted_response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
