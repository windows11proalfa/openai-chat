import Express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = Express();
const port = process.env.PORT || 3000; // You can set a specific port in .env or default to 3000

// Initialize OpenAI
const openai = new OpenAI();

app.use(bodyParser.json()); // for parsing application/json
app.use(Express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
// POST endpoint for processing chat messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message; // Expecting { message: "User's question or statement" }

  if (!userMessage) {
    return res.status(400).send({ error: "No message provided" });
  }

  try {
    const completion = await axios.get("https://api.nekolabs.web.id/text-generation/grok/3-jailbreak/v2?text="+userMessage)

    // Send back the AI's response
    const aiResponse = completion.data.result;
    res.send({ message: aiResponse });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).send({ error: "Failed to process the request" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
