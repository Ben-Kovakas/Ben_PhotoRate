const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Gemini API Setup ---
// In CommonJS, __dirname is available globally, simplifying path resolution.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// --- End Gemini API Setup ---

/**
 * Analyzes a list of comments using the Gemini API.
 * @param {Array} comments - An array of comment objects from the database.
 * @returns {Promise<string>} A promise that resolves to the AI-generated summary.
 */
async function analyzeComments(comments) {
  try {
    const commentsJson = JSON.stringify(comments);
    
    // CHECKPOINT 3: Log the exact data being sent to the LLM API.
    console.log('[Checkpoint 3] Data being sent to AI for analysis:', commentsJson);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Based on the following comments data in JSON format, provide a short, one-sentence summary of the overall sentiment. Comments: ${commentsJson}`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: "Take these commennts about an image and do these things: 1) Summarize the overall sentiment of the comments in one sentence. 2) Suggest three tags that describe the image based on the comments.",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
    }
});
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("An error occurred during AI analysis:", error);
    return "Could not analyze comments at this time.";
  }
}

// Export the function using module.exports
module.exports = { analyzeComments };