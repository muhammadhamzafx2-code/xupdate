importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6vGQwB7nHtZFvCUls9TBuscXcP1ER77M",
  authDomain: "mvhdhamxa-792bf.firebaseapp.com",
  projectId: "mvhdhamxa-792bf",
  messagingSenderId: "214112128362",
  appId: "1:214112128362:web:8892c9bf90d42c7fd22913"
});

const messaging = firebase.messaging();

// background notification
messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification("Reminder", {
    body: "Visit google.com",
    icon: "https://www.google.com/favicon.ico",
    data: {
      url: "https://www.google.com"
    }
  });
});

// 🔥 CLICK ACTION
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
