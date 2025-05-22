require("dotenv").config();
const fs = require("fs/promises");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PDF_PATH = "Sprinklr.pdf";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const textContent = data.text;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `SYSTEM:
    You are an expert document analyst and summarizer. Follow these steps precisely:
    1. Identify logical chapters or thematic sections in teh provided text.
    2. For each chapter: - Label it "Chapter 1", "Chapter2" etc and write one medium length paragraph capturing its key ideas.
    3. After all chapters, write a concise "Conclusion" paragraphn that synthesizes the document's overall message and takeways.
    
    USER:
    ${textContent}`.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    console.log("--------Document Summary-------\n");
    console.log(summary);
  } catch (error) {
    console.error("Error", error);
  }
}

summarizePDF(PDF_PATH);
