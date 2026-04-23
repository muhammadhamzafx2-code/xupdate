const express = require("express");
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
    console.log("Saved token");
  }

  res.send("OK");
});

// send notifications
function sendNotifications() {
  const tokens = getTokens();

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
    .then(() => console.log("Sent"))
    .catch(err => console.log(err));
  });
}

// every 1 hour
setInterval(sendNotifications, 3600000);

// test (optional)
// setInterval(sendNotifications, 10000);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(process.env.PORT || 3000);
