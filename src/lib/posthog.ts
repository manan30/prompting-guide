import posthog from 'posthog-js';

const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let isInitialized = false;

export function initPostHog() {
  if (typeof window === 'undefined' || isInitialized || !posthogKey) {
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    loaded: (instance) => {
      instance.register({
        site: 'prompting-guide'
      });
    }
  });

  isInitialized = true;
}

export function trackEvent(eventName: string, properties: Record<string, string | number | boolean> = {}) {
  if (!posthogKey || typeof window === 'undefined') {
    return;
  }

  if (!isInitialized) {
    initPostHog();
  }

  posthog.capture(eventName, {
    site: 'prompting-guide',
    ...properties
  });
}
