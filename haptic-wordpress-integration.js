/**
 * WordPress Theme Integration for Haptic Feedback
 * Add this to your theme's JavaScript file or enqueue it separately
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {

    // Initialize haptic feedback for WordPress buttons
    // Targets: Gutenberg buttons, form buttons, navigation items, etc.
    const selectors = [
      '.wp-block-button__link',           // Gutenberg buttons
      '.wp-block-button a',                // Button block links
      'button[type="submit"]',             // Form submit buttons
      '.wp-element-button',                // WordPress element buttons
      'a.button',                          // Generic button links
      '.wp-block-navigation-item__content' // Navigation items (optional)
    ].join(', ');

    // Add haptic feedback to all matching elements
    const elements = document.querySelectorAll(selectors);

    console.log(`Haptic feedback initialized for ${elements.length} elements`);

    elements.forEach(function(element) {
      element.addEventListener('click', function(e) {
        // Trigger haptic feedback
        if (window.triggerHaptic) {
          window.triggerHaptic();
        }
      });

      // Optional: Add visual indicator that haptic is enabled
      element.classList.add('haptic-enabled');
    });

    // Custom event for manually triggering haptic feedback
    document.addEventListener('haptic:trigger', function() {
      if (window.triggerHaptic) {
        window.triggerHaptic();
      }
    });

    // Support for dynamically added elements (AJAX, etc.)
    if (window.MutationObserver) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              const newElements = node.querySelectorAll ? node.querySelectorAll(selectors) : [];
              newElements.forEach(function(element) {
                if (!element.classList.contains('haptic-enabled')) {
                  element.addEventListener('click', function() {
                    if (window.triggerHaptic) {
                      window.triggerHaptic();
                    }
                  });
                  element.classList.add('haptic-enabled');
                }
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  });

})();
