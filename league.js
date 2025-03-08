let currentLocation = null;
function toggleConfirmInterceptor(enabled) {
  window.dispatchEvent(new CustomEvent("toggleConfirmInterceptor", { detail: { enabled } }));
}
function locationSearch() {
  const divLocation = document.querySelector("#divLocTitleText");

  if (!divLocation) {
    return;
  }

  const updateLocation = () => {
    if (divLocation) {
      currentLocation = divLocation.textContent;
    }
  };
  // С вырезанами цифрами
  // const updateLocation = () => {
  //   if (divLocation && divLocation.textContent.startsWith("Уровень")) {
  //     currentLocation = divLocation.textContent.replace(/\d+/g, "").trim();
  //   }
  // };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        updateLocation();
      }
    }
  });

  observer.observe(divLocation, {
    childList: true,
    characterData: true,
  });

  updateLocation();
}

function playSound() {
  // const extensionId = chrome.runtime.id; // Получить ID расширения

  const soundUrl = chrome.runtime.getURL("sound.wav");

  const audio = new Audio(soundUrl);
  audio.play().catch((error) => {
    console.error("Ошибка при воспроизведении звука:", error);
  });
}

locationSearch();
