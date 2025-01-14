const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Route to get today's historic event
app.get("/today-in-history", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "long",
      day: "numeric",
    });

    const prompt = `What is an interesting and great thing that happened in the world on ${today} in history? Provide the response in 40 words.`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ event: response.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching historic event:", error);
    res.status(500).json({ error: "Failed to fetch historic event." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
