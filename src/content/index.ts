const checkAndAddUrl = () => {
  const url = window.location.href;
  chrome.runtime.sendMessage({ type: "addUrl", url });
};

const getUrls = async (): Promise<string[]> => {
  const baseUrl = window.location.origin;
  return new Promise((res) => {
    chrome.runtime.sendMessage(
      { type: "getUrls", baseUrl },
      (urls: string[]) => {
        res(urls);
      }
    );
  });
};

const chkIcon = document.createElement("img");
const imgUrl = chrome.runtime.getURL('src/assets/check-symbol-4794.svg');
chkIcon.src = imgUrl;
chkIcon.style.width = "28px";
chkIcon.style.position = "absolute";
chkIcon.style.right = "0";
chkIcon.style.top = "0";
checkAndAddUrl();
getUrls().then((urls) => {
  console.log("urls", urls)
  const links = document.links;
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const img = link.querySelector("img")?.parentElement;
    if (urls.includes(link.href)) {
      img?.appendChild(chkIcon.cloneNode());
    }
  }
});