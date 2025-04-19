document.addEventListener('DOMContentLoaded', () => {
  const updateSliderValue = (elementId) => {
    const input = document.getElementById(elementId);
    const valueSpan = input.nextElementSibling;
    valueSpan.textContent = input.value;
  };

  chrome.storage.local.get(['autoShow', 'fontSize'], (result) => {
    document.getElementById('auto-show').checked = result.autoShow ?? false;
    document.getElementById('font-size').value = result.fontSize || 16;
    updateSliderValue('font-size');
  });

  document.getElementById('auto-show').addEventListener('change', saveSettings);
  document.getElementById('font-size').addEventListener('input', () => {
    updateSliderValue('font-size');
    saveSettings();
  });

  function saveSettings() {
    const settings = {
      autoShow: document.getElementById('auto-show').checked,
      fontSize: document.getElementById('font-size').value
    };

    chrome.storage.local.set(settings, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: (settings) => {
            applySettings(settings);
          },
          args: [settings]
        });
      });
    });
  }
});