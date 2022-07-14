const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const word = req.path;
  const response = { word: "", phonetics: "" };
  if (word) {
    response.word = word.replace("/", "");
    const url = "https://dictionary.com/browse" + word;
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    const selector = ".pron-spell-content";
    response.phonetics = $(selector).text().replace(/\[|\]/g, "").trim();
    res.send(JSON.stringify(response));
  } else {
    res.sendStatus(404);
    res.send(JSON.stringify(response));
  }
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;

