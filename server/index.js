// This should be the very first line to ensure environment variables are loaded
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// Using the recommended library for Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration to allow requests from your frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173' // Make sure this matches your Vite dev server port!
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize Google Generative AI with your API key
// Ensure process.env.GEMINI_API_KEY matches the key in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients.
You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention,
but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.`;

// POST endpoint to generate a recipe
app.post('/generate-recipe', async (req, res) => {
    const { ingredients } = req.body; // Expect an array of ingredients

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients list is empty.' });
    }

    try {
        // Use gemini-1.5-flash for efficiency, or gemini-1.5-pro for higher quality
        // Note: "gemini-2.0-flash" is not a standard model name. It's likely "gemini-1.5-flash" or "gemini-pro"
        // I'll default to "gemini-1.5-flash" as it's a good balance.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const userPrompt = `I have the following ingredients: ${ingredients.join(', ')}. What recipe can I make?`;

        // Combine system prompt and user prompt as parts of the content
        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "user", parts: [{ text: userPrompt }] }
            ]
        });

        const response = await result.response;
        const text = response.text(); // Get the text from the response
        res.json({ recipeText: text }); // Send the generated text in a JSON object
    } catch (error) {
        console.error('Error calling Gemini API for recipe:', error);
        // Provide more specific error details if available from the API
        if (error.response && error.response.data) {
            console.error('Gemini API Error Details:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to generate recipe.', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});