(() => {
  'use strict';
  const notice = document.getElementById('ad-redirect-notice');
  const countdown = document.getElementById('ad-redirect-countdown');
  const cancel = document.getElementById('ad-redirect-cancel');
  const adLink = document.querySelector('a.sponsor-panel');
  const destination = 'https://auctionr.org/4/0b89540dd2e1de0b3ed25d2e39f53c7e';
  const storageKey = 'sponsored-redirect-noticed-v1';
  if (!notice || !countdown || !cancel || !adLink) return;
  // Run at most once per tab session. If storage is unavailable, keep reading safe.
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, '1');
  } catch { return; }
  let remaining = 6;
  let timer = null;
  let stopped = false;
  const stop = () => {
    stopped = true;
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    notice.hidden = true;
  };
  const tick = () => {
    if (stopped || document.visibilityState !== 'visible') return;
    remaining -= 1;
    countdown.textContent = String(remaining);
    if (remaining <= 0) {
      stop();
      // Ordinary same-tab navigation, not a simulated click or pop-up.
      window.location.assign(destination);
    }
  };
  notice.hidden = false;
  countdown.textContent = String(remaining);
  cancel.addEventListener('click', stop);
  // A manual ad visit must not also cause a second, timed visit.
  adLink.addEventListener('click', stop);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', event => { if (event.persisted) stop(); });
  const updateTimer = () => {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    if (!stopped && document.visibilityState === 'visible') {
      timer = window.setInterval(tick, 1000);
    }
  };
  document.addEventListener('visibilitychange', updateTimer);
  updateTimer();
})();
