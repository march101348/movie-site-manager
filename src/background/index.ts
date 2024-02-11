chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message", message);

  if (message.type === "getSiteList") {
    getRegisteredContentScripts().then((sites) => {
      sendResponse(sites);
    });
  } else if (message.type === "addSite") {
    chrome.scripting
      .registerContentScripts([
        {
          id: message.site,
          js: ["src/content/index.ts.js"],
          persistAcrossSessions: true,
          matches: [message.site],
          runAt: "document_end",
        },
      ])
      .then(() => {
        getRegisteredContentScripts().then((sites) => {
          sendResponse(sites);
        });
      });
  } else if (message.type === "removeSite") {
    chrome.scripting
      .unregisterContentScripts({ ids: [message.site] })
      .then(() => {
        getRegisteredContentScripts().then((sites) => {
          sendResponse(sites);
        });
      });
  } else if (message.type === "addUrl") {
    chrome.storage.local.get("urls", (data) => {
      const urls: string[] = data.urls || [];
      urls.includes(message.url) ||
        chrome.storage.local.set({ urls: [...urls, message.url] });
    });
  } else if (message.type === "getUrls") {
    chrome.storage.local.get("urls", (data) => {
      sendResponse(data.urls || []);
    });
  }
  return true;
});

const getRegisteredContentScripts = () => {
  return chrome.scripting.getRegisteredContentScripts().then((scripts) => {
    return scripts.map((script) => script.matches?.[0]);
  });
};
