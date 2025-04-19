let isEnabled = false;
let originalStyles = null;
let originalClasses = null;

function saveOriginalState(element) {
  originalStyles = {
    display: element.style.display,
    fontSize: element.style.fontSize,
    opacity: element.style.opacity,
    height: element.style.height,
    overflow: element.style.overflow
  };
  originalClasses = element.className;
}

function applySettings(settings) {
  const answerElement = document.querySelector('article#acceptedAnswer');
  const authButton = document.querySelector('button[jsaction="click:;"]');

  if (answerElement) {
    if (settings.autoShow) {
      if (!originalStyles) saveOriginalState(answerElement);
      answerElement.className = '';
      answerElement.style.cssText = `
                display: block !important;
                opacity: 1 !important;
                height: auto !important;
                overflow: visible !important;
                font-size: ${settings.fontSize}px !important;
                padding-left: 20px !important;
            `;

      const hiddenElements = answerElement.querySelectorAll('[style*="display: none"], [style*="opacity: 0"]');
      hiddenElements.forEach(el => {
        el.style.cssText = 'display: block !important; opacity: 1 !important;';
      });
    } else {
      if (originalStyles) {
        answerElement.className = originalClasses;
        answerElement.style.cssText = `
                    display: ${originalStyles.display} !important;
                    opacity: ${originalStyles.opacity} !important;
                    height: ${originalStyles.height} !important;
                    overflow: ${originalStyles.overflow} !important;
                    font-size: ${originalStyles.fontSize} !important;
                `;
      }
    }
  }

  if (authButton) {
    authButton.style.display = settings.autoShow ? 'none' : 'block';
  }
}

chrome.storage.local.get(['autoShow', 'fontSize'], (settings) => {
  isEnabled = settings.autoShow ?? false;
  applySettings(settings);
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateSettings') {
    isEnabled = request.settings.autoShow;
    applySettings(request.settings);
  }
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      const answerElement = document.querySelector('article#acceptedAnswer');
      if (answerElement) {
        chrome.storage.local.get(['autoShow', 'fontSize'], (settings) => {
          applySettings(settings);
        });
      }
    }
  });
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});