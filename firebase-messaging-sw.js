importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6vGQwB7nHtZFvCUls9TBuscXcP1ER77M",
  projectId: "mvhdhamxa-792bf",
  messagingSenderId: "214112128362",
  appId: "1:214112128362:web:8892c9bf90d42c7fd22913"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(() => {
  self.registration.showNotification("Reminder", {
    body: "Visit google.com",
    data: { url: "https://google.com" }
  });
});

self.addEventListener("notificationclick", e => {
  e.waitUntil(clients.openWindow("https://google.com"));
});
