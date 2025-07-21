// This is the final, optimized version with a CORS fix for your main website.

exports.handler = async function (event) {
  // Define the allowed origin (your main website)
  const allowedOrigin = "https://cambridgebespoke.com";

  // Create the response headers
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  // 1. Get the message history from the chatbot's request.
  const { chatHistory } = JSON.parse(event.body);

  // 2. Get your secret API key from Netlify's environment variables.
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // 3. Define the System Prompt with the complete Knowledge Base.
  const systemPrompt = `You are the AI assistant for Cambridge Bespoke, a luxury bespoke cabinetry company. Your role is to embody the brand's sophisticated, knowledgeable, warm, and courteous tone.

**IMPORTANT RULES:**
1.  You MUST use the information provided in the "Company Knowledge Base" below to answer user questions. Do not make up information.
2.  If a user asks a question that is not covered in the knowledge base, you MUST respond with this exact text:** "That's an interesting question. While I can only provide information about Cambridge Bespoke's products and services, our design team may be able to help. Please contact them at info@cambridgebespoke.com, and they will be happy to assist."
3.  **If a user expresses interest in a consultation or asks you to arrange one, you MUST instruct them to click the 'Schedule Consultation' button and fill out the form. DO NOT ask for their name, email, or other details directly in the chat.**

---
**Company Knowledge Base Master File:**
[Your full knowledge base text is included here]
---

Keep responses concise and helpful based on the knowledge provided.
`;

  // 4. Prepare the request to the real Gemini API.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: chatHistory,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    }
  };

  try {
    // 5. Call the Gemini API from the server.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: response.status,
        headers, // Include headers in error response
        body: JSON.stringify({ error: 'Gemini API request failed', details: errorBody }),
      };
    }

    // 6. Send the successful response back to the chatbot.
    const data = await response.json();
    return {
      statusCode: 200,
      headers, // Include headers in success response
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers, // Include headers in error response
      body: JSON.stringify({ error: error.message }),
    };
  }
};
