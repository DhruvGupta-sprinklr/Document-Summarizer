require("dotenv").config();
const fs = require("fs/promises");
const pdf = require("pdf-parse");

const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const PDF_PATH = "sample2.pdf";

const SUMMARIZER_OPTIONS = {
  length: "medium",
  format: "paragraph",
  model: "summarize-xlarge",
  temperature: 0.3,
};

async function summarizePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    const textContent = data.text;

    const response = await cohere.summarize({
      text: textContent,
      ...SUMMARIZER_OPTIONS,
    });

    console.log("--------Document Summary-------\n");
    console.log(response.summary);
  } catch (error) {
    console.error("Error", error);
  }
}

summarizePDF(PDF_PATH);
