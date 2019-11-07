const express = require("express");
const bodyParser = require("body-parser");
const getPublicKey = require("../src/parse-email/utils/getPublicKey");

const app = express();
app.use(bodyParser.json());

app.post("/api/getPublicKeys", async (req, res) => {
  try {
    const entries = req.body;
    if (!entries) return res.sendStatus(500);

    const results = await Promise.all(entries.map(getPublicKey));

    return res.json(results);
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
});

module.exports = app;
