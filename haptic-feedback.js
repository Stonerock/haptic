/**
 * Haptic Feedback Library for Vanilla JavaScript
 * Works on iOS Safari 18.0+ and Android using the input[switch] element
 * Inspired by use-haptic library but without React dependency
 */

class HapticFeedback {
  constructor() {
    this.switchElement = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize the haptic feedback system
   * Creates a hidden input[switch] element that triggers iOS haptic feedback
   */
  init() {
    if (this.isInitialized) return;

    // Create a hidden container for the switch element
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
      pointer-events: none;
      opacity: 0;
    `;
    container.setAttribute('aria-hidden', 'true');

    // Create the input[switch] element
    // This is the key to iOS Safari 18.0+ haptic feedback
    this.switchElement = document.createElement('input');
    this.switchElement.type = 'checkbox';
    this.switchElement.setAttribute('switch', '');
    this.switchElement.tabIndex = -1;

    container.appendChild(this.switchElement);

    // Wait for DOM to be ready
    if (document.body) {
      document.body.appendChild(container);
      this.isInitialized = true;
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(container);
        this.isInitialized = true;
      });
    }
  }

  /**
   * Trigger haptic feedback
   * On iOS Safari 18.0+: uses input[switch] toggle
   * On Android: falls back to Vibration API
   */
  trigger() {
    if (!this.isInitialized || !this.switchElement) {
      console.warn('Haptic feedback not initialized');
      return;
    }

    // Toggle the switch to trigger haptic feedback on iOS
    this.switchElement.checked = !this.switchElement.checked;

    // Fallback to Vibration API for Android
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  /**
   * Check if haptic feedback is supported
   */
  isSupported() {
    // Check for Safari 18.0+ or Vibration API support
    const isSafari18Plus = this.checkSafariVersion() >= 18;
    const hasVibrationAPI = 'vibrate' in navigator;

    return isSafari18Plus || hasVibrationAPI;
  }

  /**
   * Check Safari version
   */
  checkSafariVersion() {
    const ua = navigator.userAgent;
    const safari = ua.match(/Version\/(\d+)/);
    return safari ? parseInt(safari[1], 10) : 0;
  }
}

// Create singleton instance
const haptic = new HapticFeedback();

/**
 * Simple API function to trigger haptic feedback
 */
function triggerHaptic() {
  haptic.trigger();
}

/**
 * Auto-initialize haptic feedback on common interactive elements
 * @param {string} selector - CSS selector for elements to add haptic feedback
 * @param {string} event - Event type to listen for (default: 'click')
 */
function initHapticElements(selector = '.haptic-feedback', event = 'click') {
  const addHapticToElements = () => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      // Avoid adding duplicate listeners
      if (element.hasAttribute('data-haptic-initialized')) return;

      element.addEventListener(event, () => {
        triggerHaptic();
      });

      element.setAttribute('data-haptic-initialized', 'true');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHapticToElements);
  } else {
    addHapticToElements();
  }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { triggerHaptic, initHapticElements, haptic };
} else {
  window.triggerHaptic = triggerHaptic;
  window.initHapticElements = initHapticElements;
  window.HapticFeedback = HapticFeedback;
}
