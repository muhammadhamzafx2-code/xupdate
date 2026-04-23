const express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 Serve static files (index.html, etc)
app.use(express.static(__dirname));

// 🔑 Load Firebase key from ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// fix newline issue
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 📦 Token storage
const TOKENS_FILE = "tokens.json";

function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

// 💾 Save token
app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!token) return res.send("No token");

  let tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    console.log("Saved token:", token);
  }

  res.send("Token saved");
});

// 🔔 Send notifications
function sendNotifications() {
  const tokens = getTokens();

  if (tokens.length === 0) {
    console.log("No tokens yet");
    return;
  }

  tokens.forEach(token => {
    admin.messaging().send({
      token,
      notification: {
        title: "Reminder",
        body: "Visit google.com"
      },
      webpush: {
        fcmOptions: {
          link: "https://www.google.com"
        }
      }
    })
    .then(() => console.log("Sent to:", token))
    .catch(err => console.log("Error:", err));
  });
}

// ⏱️ Every 1 hour
setInterval(sendNotifications, 3600000);

// 👉 For testing (optional)
// setInterval(seconst express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ✅ Load Firebase key from ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// ✅ Fix newline issue
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const TOKENS_FILE = "tokens.json";

// get tokens
function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

// save token
app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!token) return res.send("No token");

  let tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens));
ndNotifications, 10000);

// 🌐 Show index.html on homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
