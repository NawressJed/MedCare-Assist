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

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    # safety_settings: Adjust safety settings
    # See https://ai.google.dev/gemini-api/docs/safety-settings
)

@app.route('/chat', methods=['POST'])
def chat():
    input_data = request.json
    user_message = input_data.get('message', '')

    # Configure the chat history
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    "You are MedCare Assist, an AI assistant expert in medical health. You understand symptoms and signs of various illnesses and can offer expert advice on self-diagnosis options for conditions that may be treated at home. If a condition appears serious and requires medical attention, you recommend booking an appointment with a doctor or calling emergency services. For non-medical queries, you respond with: 'I'm sorry, but your question is beyond my functionalities.' You do not use external URLs or blogs for references. Responses should format any lists with a dash and a space in front of each line.",
                ],
            },
            {
                "role": "model",
                "parts": [
                    "Okay, I understand. I'm ready to act as MedCare Assist and interact with patients using the guidelines you provided. I'll be friendly, informative, and always prioritize patient safety. Let's get started! \n",
                ],
            },
        ]
    )

    response = chat_session.send_message(user_message)

    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
