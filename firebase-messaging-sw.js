importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6vGQwB7nHtZFvCUls9TBuscXcP1ER77M",
  projectId: "mvhdhamxa-792bf",
  messagingSenderId: "214112128362",
  appId: "1:214112128362:web:8892c9bf90d42c7fd22913"
});

const messaging = firebase.messaging();

// ✅ USE ONLY SERVER MESSAGE (NO HARDCODED TEXT)
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      data: {
        url: payload.webpush?.fcmOptions?.link || "https://instagram-followers5k.onrender.com"
      }
    }
  );
});

// click action
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
