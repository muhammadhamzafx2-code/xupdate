const express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// file to store tokens
const TOKENS_FILE = "tokens.json";

// load tokens
function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

// save token
app.post("/save-token", (req, res) => {
  const { token } = req.body;
  let tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens));
  }

  res.send("Token saved");
});

// send to ALL users every 1 hour
setInterval(() => {
  const tokens = getTokens();

  tokens.forEach(token => {
    const message = {
      token,
      notification: {
        title: "Reminder",
        body: "Visit google.com"
      }
    };

    admin.messaging().send(message)
      .then(() => console.log("Sent to:", token))
      .catch(err => console.log("Error:", err));
  });

}, 3600000);

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running"));
