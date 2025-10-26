// Scramjet Popup Interception Script
// This script is injected into all proxied pages to intercept window.open calls

(function() {
  'use strict';
  
  // Only run once
  if (window.__scramjetPopupIntercepted) return;
  window.__scramjetPopupIntercepted = true;

  console.log('[Scramjet Inject] Popup interception script loaded');

  // Store the original window.open function
  const originalOpen = window.open;

  // Override window.open
  window.open = function(url, target, features) {
    console.log('[Scramjet Inject] window.open intercepted:', { url, target, features });

    // If opening in a new window/tab (_blank, _new, or no target)
    if (!target || target === '_blank' || target === '_new') {
      try {
        // Send message to parent window to create internal tab
        window.parent.postMessage({
          type: 'navigate',
          url: url || '',
          newWindow: true,
          target: target || '_blank',
          source: 'scramjet-inject'
        }, '*');
        
        console.log('[Scramjet Inject] Sent navigate message to parent');
        
        // Return null to prevent the actual popup
        return null;
      } catch (e) {
        console.error('[Scramjet Inject] Failed to send popup message:', e);
      }
    }

    // For same-window navigation (_self, _parent, _top), use original behavior
    console.log('[Scramjet Inject] Allowing same-window navigation');
    return originalOpen.call(this, url, target, features);
  };

  console.log('[Scramjet Inject] window.open successfully intercepted');
})();
