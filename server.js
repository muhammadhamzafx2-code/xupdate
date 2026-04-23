const express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔑 Load Firebase key from environment variable (Render)
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 📦 File to store tokens
const TOKENS_FILE = "tokens.json";

// 📥 Get saved tokens
function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

// 💾 Save token API
app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send("No token provided");
  }

  let tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    console.log("New token saved");
  } else {
    console.log("Token already exists");
  }

  res.send("Token saved");
});

// 🔔 Send notification to all users
function sendNotifications() {
  const tokens = getTokens();

  if (tokens.length === 0) {
    console.log("No tokens found");
    return;
  }

  tokens.forEach(token => {
    const message = {
      token: token,
      notification: {
        title: "Reminder",
        body: "Visit google.com"
      },
      webpush: {
        fcmOptions: {
          link: "https://www.google.com"
        }
      }
    };

    admin.messaging().send(message)
      .then(() => console.log("Sent to:", token))
      .catch(err => console.log("Error sending:", err));
  });
}

// ⏱️ Run every 1 hour
setInterval(sendNotifications, 3600000);

// 👉 For testing (optional: send every 10 seconds)
// setInterval(sendNotifications, 10000);

// 🌐 Basic route
app.get("/", (req, res) => {
  res.send("Notification server is running");
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
