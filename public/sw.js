self.addEventListener('push', function (event) {
    const pushData = JSON.parse(event.data.text());

    const title = pushData.title;
    const options = {
        body: pushData.body,
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
});
