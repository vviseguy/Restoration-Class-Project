const https = require('https');
const express = require('express');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DEFAULT_MODEL = 'gpt-4o-mini'; // change to gpt-4o-mini?

// Load context from a local file
const context = fs.readFileSync('context.txt', 'utf-8');

// Function to make the request to the OpenAI API
function makeOpenAIRequest(model, text, callback) {
  const prompt = `Context: ${context}\n\nText: ${text}`;
  
  console.log(`[Model Queried] ${model}`);

  // Log the request timestamp and prompt snippet
  console.log(`[${new Date().toISOString()}] Sending request with prompt: ${text.slice(0, 100)}...`);


  const data = JSON.stringify({
    model: model,
    messages: [
      { role: "system", content: "You are an AI that assists with finding relevant cross-references to scriptural texts." },
      { role: "user", content: prompt }
    ]
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        const responseJson = JSON.parse(responseBody);
        const messageContent = responseJson.choices[0].message.content;

        // Log the response timestamp and response snippet
        console.log(`[${new Date().toISOString()}] Received response: ${messageContent.slice(0, 100)}...`);

        // Extract URLs and their descriptions from the response
        const links = [];
        const urlRegex = /- URL: (https?:\/\/[^\s]+)\n\s+- Description: (.+)/g;
        let match;
        while ((match = urlRegex.exec(messageContent)) !== null) {
          links.push({ url: match[1], description: match[2] });
        }

        callback(null, links);
      } else {
        callback(new Error(`Failed with status code: ${res.statusCode}`), null);
      }
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.write(data);
  req.end();
}

// Endpoint to handle cross-reference requests
app.post('/cross-reference', (req, res) => {
  const { text, model = DEFAULT_MODEL } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  makeOpenAIRequest(model, text, (error, links) => {
    if (error) {
      console.error('Error with OpenAI API:', error.message);
      return res.status(500).json({ error: 'Failed to process the request' });
    } 

    res.json({ links });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
