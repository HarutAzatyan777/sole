// ./components/Analytics.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-9MPC29P63H"; // Ձեր GA4 ID

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

// Base functions
export function sendPageView(path) {
  gtag('config', GA_MEASUREMENT_ID, { page_path: path });
}

export function sendEvent(eventName, params = {}) {
  gtag('event', eventName, params);
}

export function sendConversion(conversionName, params = {}) {
  gtag('event', conversionName, { ...params, send_to: GA_MEASUREMENT_ID });
}

export function setUserProperty(propertyName, value) {
  gtag('set', { [propertyName]: value });
}

export function trackScrollDepth() {
  let tracked = new Set();
  function checkScroll() {
    const scroll = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const perc = Math.floor((scroll / docHeight) * 100 / 25) * 25; // 25%, 50%, 75%, 100%
    if (perc && !tracked.has(perc)) {
      tracked.add(perc);
      sendEvent('scroll_depth', { percent: perc });
    }
  }
  window.addEventListener('scroll', checkScroll);
}

// Auto-track clicks on <a> and <button>
function trackClicks() {
  function handleClick(e) {
    const tag = e.target.tagName.toLowerCase();
    let name = '';
    if (tag === 'a') name = e.target.innerText || e.target.href;
    else if (tag === 'button') name = e.target.innerText || 'button';
    if (name) {
      sendEvent('click', { element: tag, name });
    }
  }
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    sendPageView(location.pathname);
    trackScrollDepth();
    const cleanupClicks = trackClicks();
    return cleanupClicks;
  }, [location]);

  return null;
}
