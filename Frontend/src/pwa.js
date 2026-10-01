import { registerSW } from 'virtual:pwa-register';

// Register service worker
// immediate: true — activates the new SW as soon as it's ready
registerSW({
  immediate: true,
  onOfflineReady() {
    // App is fully cached and ready to work offline
    console.log('[PWA] App ready to work offline');
  },
  onNeedRefresh() {
    // New version available — auto-update is on so this just fires silently
    console.log('[PWA] New version available, updating…');
  },
});

// Offline / Online detection
if (typeof window !== 'undefined') {
  const OFFLINE_URL = '/offline.html';
  let isRedirecting = false;

  // Smooth fade + redirect helper
  function redirectWithFade(url) {
    if (isRedirecting) return;
    isRedirecting = true;
    document.documentElement.classList.add('going-offline');
    setTimeout(() => {
      window.location.replace(url);
    }, 240);
  }

  // Real connectivity check — avoids captive portal false positives
  async function isReallyOnline() {
    try {
      const res = await fetch('https://www.gstatic.com/generate_204', {
        method: 'HEAD',
        cache:  'no-store',
        signal: AbortSignal.timeout(5000),
      });
      return res.status === 204 || res.ok;
    } catch {
      return false;
    }
  }

  // Go offline → redirect to offline.html
  function goOffline() {
    if (window.location.pathname === OFFLINE_URL) return; // already there
    redirectWithFade(OFFLINE_URL);
  }

  // offline.html handles its OWN online redirect internally
  // pwa.js only needs to handle the case where the app is loaded
  // normally and the connection drops mid-session
  window.addEventListener('offline', goOffline);

  // If app boots with no internet, redirect immediately
  if (!navigator.onLine) {
    goOffline();
  }
}