require("dotenv").config();
const fs = require("fs/promises");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PDF_PATH = "sample.pdf";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const textContent = data.text;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following document in a medium-length paragraph:\n\n${textContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    console.log("--------Document Summary-------\n");
    console.log(summary);
  } catch (error) {
    console.error("Error", error);
  }
}

summarizePDF(PDF_PATH);
