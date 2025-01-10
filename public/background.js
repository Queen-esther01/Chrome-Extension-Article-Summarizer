chrome.runtime.onInstalled.addListener(() => {
    console.log("InSummary extension installed");
    //  chrome.action.setBadgeText({ text: "ON" })
});

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

console.log('InSummary extension background script loaded');
chrome.action.onClicked.addListener(async (tab) => {
    console.log("InSummary extension clicked", tab);
    const article = document.querySelector("article");
    console.log(article)
    // if(tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
        // const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        // const nextState = prevState === "ON" ? "OFF" : "ON";
        // await chrome.action.setBadgeText({ tabId: tab.id, text: nextState });

        // if(nextState === "ON"){
        //     await chrome.scripting.insertCSS({
        //         files: ['index.css'],
        //         target: { tabId: tab.id }
        //     })
        // }
        // else if(nextState === "OFF"){
        //     await chrome.scripting.removeCSS({
        //         files: ['index.css'],
        //         target: { tabId: tab.id }
        //     })
        // }
    // }
})