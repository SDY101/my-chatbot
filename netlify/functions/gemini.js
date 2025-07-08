// This is your new secure backend function.
// It runs on Netlify's servers, not in the browser.

exports.handler = async function (event) {
  // 1. Get the message history from the chatbot's request.
  const { chatHistory } = JSON.parse(event.body);

  // 2. Get your secret API key from Netlify's environment variables.
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // 3. Prepare the request to the real Gemini API.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: chatHistory };

  try {
    // 4. Call the Gemini API from the server.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // If the API call fails, send back an error.
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Gemini API request failed' }),
      };
    }

    // 5. Send the successful response back to the chatbot.
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Handle any other errors.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
