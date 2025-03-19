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
  const soundUrl = chrome.runtime.getURL("sound.mp3");

  const audio = new Audio(soundUrl);
  audio.play().catch((error) => {
    console.log("Sound URL:", soundUrl);
    console.error("Ошибка при воспроизведении звука:", error);
  });
}

locationSearch();
