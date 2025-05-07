chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_URLS") {
    const { mainUrls, backupUrls } = message;

    (async () => {
      try {
        let responses = await Promise.allSettled(mainUrls.map((url) => fetch(url)));

        for (let i = 0; i < responses.length; i++) {
          if (responses[i].status !== "fulfilled" || !responses[i].value.ok) {
            console.warn(`Основной запрос не удался: ${mainUrls[i]}`);
            const backupResponse = await fetch(backupUrls[i]);
            responses[i] = { status: "fulfilled", value: backupResponse };
          }
        }

        const jsonData = await Promise.all(responses.map((res) => res.value.json()));

        sendResponse({ success: true, data: jsonData });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();

    return true;
  }
});
