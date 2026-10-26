'use client';

export function initOneSignal() {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  if (!appId || typeof window === 'undefined') return;

  // Dynamically load OneSignal SDK
  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.defer = true;
  script.onload = () => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      await OneSignal.init({
        appId,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
        notifyButton: {
          enable: true,
          size: 'medium',
          theme: 'default',
          position: 'bottom-left',
          offset: { bottom: '80px', left: '10px', right: 'auto' },
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Get sale alerts!',
            'tip.state.subscribed': 'You are subscribed!',
            'tip.state.blocked': 'You blocked notifications',
            'message.prenotify': 'Click to subscribe to sale & restock alerts',
            'message.action.subscribed': 'Thanks for subscribing!',
            'message.action.resubscribed': 'You are now subscribed again!',
            'message.action.unsubscribed': 'You will not receive notifications again',
            'dialog.main.title': 'Manage Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': 'Follow these steps to allow notifications:',
          },
        },
        welcomeNotification: {
          title: 'Tauheed Textile',
          message: 'Welcome! You will now get exclusive sale alerts 🎉',
        },
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: 'push',
                autoPrompt: false,
                text: {
                  actionMessage: 'Get instant alerts for new arrivals and exclusive sales from Tauheed Textile!',
                  acceptButton: 'Yes, Notify Me!',
                  cancelButton: 'No Thanks',
                },
                delay: { pageViews: 2, timeDelay: 10 },
              },
            ],
          },
        },
      });
    });
  };
  document.head.appendChild(script);
}
