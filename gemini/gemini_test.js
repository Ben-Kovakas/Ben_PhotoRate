
const { GoogleGenerativeAI } = require('@google/generative-ai');

//.env file stuff... currently not using...
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config({ path: path.resolve(__dirname, '../.env') });


// Pass the API key directly to the constructor
const genAI = new GoogleGenerativeAI('AIzaSyC8L1GQkqm7P_dvgssP5oW7LZGiDTJhO08');

async function run() {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Structure the prompt correctly
    const prompt = "Explain in 3 sentences or less the recent rise of gambling and it's effect on youth.";
    

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: "You speak like Yoda from Star Wars.",
      generationConfig: {
        thinkingConfig: {
            thinkingBudget: 0
      },
    },
    });

    // Get the text from the response
    const response = await result.response;
    const text = response.text();
    console.log(text);

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

 run();