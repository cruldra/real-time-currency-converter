import useContextmenu from "@/hooks/useContextmenu";

chrome.runtime.onInstalled.addListener(async () => {
  const { createContextmenu } = await useContextmenu();

  await createContextmenu(true);
});
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  console.log("next. i need to identify the source currency and amount");
  /*const url =
    "https://google." + item.menuItemId + "/search?q=" + item.selectionText;*/
  // await chrome.tabs.create({ url: url, index: tab.index + 1 });
});
