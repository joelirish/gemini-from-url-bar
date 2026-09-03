// ==UserScript==
// @name         Gemini Root Prompt Staging
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://gemini.google.com/*
// @updateURL    https://raw.githubusercontent.com/joelirish/gemini-from-url-bar/refs/heads/main/gemini-prompt-staging.user.js
// @downloadURL  https://raw.githubusercontent.com/joelirish/gemini-from-url-bar/refs/heads/main/gemini-prompt-staging.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (!query) return;

        // Function to find and populate Gemini's input area safely
        const attemptPopulate = setInterval(() => {
            // Gemini uses a rich-text editable div or text area for its prompt box
            const textBox = document.querySelector('rich-textarea div[contenteditable="true"]') || 
                          document.querySelector('div[contenteditable="true"].ql-editor') ||
                          document.querySelector('textarea');

            if (textBox) {
                clearInterval(attemptPopulate);
                
                // Focus the box and insert the text cleanly without firing Enter
                textBox.focus();
                
                // If it's a contenteditable div, modern web apps respond best to direct text insertion or innerHTML
                if (textBox.getAttribute('contenteditable') === 'true') {
                    textBox.innerHTML = decodeURIComponent(query);
                } else {
                    textBox.value = decodeURIComponent(query);
                }

                // Dispatch an input event so Gemini's UI recognizes the text change
                textBox.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Clean up the URL parameter so refreshing doesn't re-trigger it
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }, 500);
    });
})();
