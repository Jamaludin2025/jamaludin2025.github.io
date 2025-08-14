<meta name='viewport' content='width=device-width, initial-scale=1'/>// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration (sama dengan di aplikasi utama)
firebase.initializeApp({
    apiKey: "AIzaSyASXJiNqbekENXpk7C5U5XjE6gImfNUBwg",
    authDomain: "pustakapribadi-25.firebaseapp.com",
    databaseURL: "https://pustakapribadi-25-default-rtdb.firebaseio.com",
    projectId: "pustakapribadi-25",
    storageBucket: "pustakapribadi-25.firebasestorage.app",
    messagingSenderId: "828550020946",
    appId: "1:828550020946:web:65322f2092d1927c43c48b"
});

const messaging = firebase.messaging();

// Handle background messages (ketika aplikasi tidak aktif/tertutup)
messaging.onBackgroundMessage((payload) => {
    console.log('Background Message received:', payload);
    
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Notifikasi Baru';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'Anda memiliki pesan baru',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'voucher-notification',
        requireInteraction: true,
        data: payload.data || {},
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open',
                title: 'Buka Aplikasi'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ]
    };

    // Tampilkan notifikasi browser
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click (ketika user klik notifikasi)
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Buka atau fokus ke aplikasi
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Cari tab yang sudah terbuka
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes(location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Jika tidak ada tab terbuka, buka yang baru
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed:', event);
});