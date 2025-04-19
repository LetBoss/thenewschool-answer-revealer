chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    autoShow: false,
    fontSize: 16
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkUpdate') {
    chrome.runtime.requestUpdateCheck();
  }
});