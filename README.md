# Haptic Feedback Integration Guide for WordPress

## Overview

This haptic feedback solution works on:
- ✅ **iOS Safari 18.0+** (uses `input[switch]` element)
- ✅ **Android Chrome/Firefox** (uses Vibration API)
- ❌ iOS Safari < 18.0 (no haptic support)

Unlike the `use-haptic` React library, this is **vanilla JavaScript** and works with traditional WordPress themes.

## Files Created

1. **haptic-feedback.js** - Core haptic feedback library
2. **haptic-wordpress-integration.js** - WordPress-specific integration
3. **haptic-demo.html** - Demo page for testing
4. **HAPTIC-INTEGRATION-GUIDE.md** - This file

## Quick Start

### Option 1: Test Locally First

1. Open `haptic-demo.html` on your iPhone (iOS 18.0+) using Safari
2. Tap the buttons to test haptic feedback
3. If it works, proceed to WordPress integration

### Option 2: Integrate into WordPress Theme

#### Step 1: Upload Files to Your Theme

Upload these files to your WordPress theme directory:

```
/wp-content/themes/boostii-theme/assets/js/
├── haptic-feedback.js
└── haptic-wordpress-integration.js
```

#### Step 2: Enqueue Scripts in functions.php

Add this to your theme's `functions.php`:

```php
function enqueue_haptic_feedback() {
    // Enqueue core haptic library
    wp_enqueue_script(
        'haptic-feedback',
        get_template_directory_uri() . '/assets/js/haptic-feedback.js',
        array(),
        '1.0.0',
        true // Load in footer
    );

    // Enqueue WordPress integration
    wp_enqueue_script(
        'haptic-wordpress-integration',
        get_template_directory_uri() . '/assets/js/haptic-wordpress-integration.js',
        array('haptic-feedback'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_haptic_feedback');
```

#### Step 3: Test on Your Site

1. Visit your WordPress site on an iPhone (iOS 18.0+)
2. Click any button (Gutenberg buttons, navigation, etc.)
3. You should feel haptic feedback!

### Option 3: Add to Existing Theme JS

If you already have a theme JavaScript file (like `app.js`), you can:

1. Copy the contents of `haptic-feedback.js` into your existing JS file
2. Copy the contents of `haptic-wordpress-integration.js` into your existing JS file
3. Make sure they load in the correct order

## Manual Integration

### Add Haptic to Specific Elements

```javascript
// Add haptic to a specific button
document.querySelector('#my-button').addEventListener('click', function() {
    triggerHaptic();
});

// Add haptic to all elements with a class
document.querySelectorAll('.haptic-button').forEach(function(button) {
    button.addEventListener('click', triggerHaptic);
});
```

### Trigger Haptic on Custom Events

```javascript
// Form submission
document.querySelector('form').addEventListener('submit', function() {
    triggerHaptic();
});

// Custom event
document.addEventListener('quiz-answer-selected', function() {
    triggerHaptic();
});
```

### Using Custom Events (WordPress Way)

```javascript
// Trigger haptic feedback from anywhere in your code
document.dispatchEvent(new Event('haptic:trigger'));
```

## Current WordPress Site Integration

Based on your site structure at `koutsi.boostii.fi`, haptic feedback will be automatically added to:

- ✅ "Löydä lajisi Koutsin avulla" button
- ✅ Navigation menu items
- ✅ Language switcher links
- ✅ Any Gutenberg buttons
- ✅ Form submit buttons

## Advanced Configuration

### Customize Which Elements Get Haptic

Edit the `selectors` array in `haptic-wordpress-integration.js`:

```javascript
const selectors = [
    '.wp-block-button__link',           // Keep these
    '.my-custom-button',                // Add your custom selectors
    '.quiz-answer-button'               // Example: quiz buttons
].join(', ');
```

### Add Visual Feedback (Optional)

Add CSS to show which elements have haptic enabled:

```css
.haptic-enabled {
    position: relative;
}

.haptic-enabled::after {
    content: '📳';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 12px;
    opacity: 0.5;
}
```

## Troubleshooting

### Haptic Not Working on iOS?

1. **Check iOS version**: Must be iOS 18.0 or later
   - Go to Settings > General > About
   - Look for "Software Version"

2. **Check Safari version**: Must be Safari 18.0+
   - Open Safari, go to any page
   - Check User Agent in Web Inspector

3. **Check browser console**:
   - Open Safari Dev Tools (Settings > Safari > Advanced > Web Inspector)
   - Look for initialization messages

4. **Verify scripts are loading**:
   - Open browser DevTools > Network tab
   - Reload page
   - Check if `haptic-feedback.js` loads successfully

### Haptic Not Working on Android?

1. **Check browser**: Works best in Chrome/Firefox
2. **Check permissions**: Some browsers require user interaction first
3. **Test vibration**: Go to chrome://flags and enable vibration

### Scripts Not Loading?

1. Check file paths in `functions.php`
2. Clear WordPress cache (if using a cache plugin)
3. Check browser console for 404 errors

## Browser Compatibility

| Browser | Version | Haptic Support |
|---------|---------|----------------|
| iOS Safari | 18.0+ | ✅ Yes (via input[switch]) |
| iOS Safari | < 18.0 | ❌ No |
| Android Chrome | All | ✅ Yes (via Vibration API) |
| Android Firefox | All | ✅ Yes (via Vibration API) |
| Desktop Safari | Any | ⚠️ No (no vibration hardware) |
| Desktop Chrome | Any | ⚠️ No (no vibration hardware) |

## Performance Notes

- The haptic feedback script is very lightweight (~2KB)
- Uses a single hidden `input[switch]` element
- No external dependencies
- Minimal DOM manipulation

## Accessibility Considerations

- The hidden switch element is properly hidden with `aria-hidden="true"`
- Does not interfere with screen readers
- Does not change focus or navigation
- Purely tactile feedback (no visual changes)

## Example: Quiz Integration

For your Boostii Koutsi quiz, add haptic to answer selections:

```javascript
// In your quiz JavaScript
document.querySelectorAll('.quiz-answer').forEach(function(answer) {
    answer.addEventListener('click', function() {
        // Trigger haptic when answer is selected
        triggerHaptic();

        // Your existing quiz logic here
        selectAnswer(this);
    });
});
```

## Next Steps

1. ✅ Test the demo page locally
2. ✅ Upload files to your WordPress theme
3. ✅ Add enqueue code to functions.php
4. ✅ Test on iOS 18.0+ device
5. ✅ Customize selectors if needed
6. ✅ Add to custom quiz/interactive elements

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify iOS/Safari version requirements
3. Test with the demo HTML file first
4. Check that scripts are loading correctly

## Credits

Inspired by the `use-haptic` React library by @posaune0423
Adapted for vanilla JavaScript and WordPress by Claude Code
