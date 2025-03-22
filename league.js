let currentLocation = null;
let currentRegion = null;

let isActiveSearch = false;
function toggleConfirmInterceptor(enabled) {
  window.dispatchEvent(new CustomEvent("toggleConfirmInterceptor", { detail: { enabled } }));
}

function locationSearch() {
  if (isActiveSearch) return;
  isActiveSearch = true;

  const divLocation = document.querySelector("#divLocTitleText");
  const divLocDescr = document.querySelector("#divLocDescr .locpath");

  if (!divLocation || !divLocDescr) {
    return;
  }

  const updateLocation = () => {
    currentLocation = divLocation.textContent.trim();
    return currentLocation;
  };
  const updateRegion = () => {
    currentRegion = divLocDescr.querySelector("b").textContent.trim();
    return currentRegion;
  };

  const observerLocation = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        updateLocation();
      }
    }
  });

  const observerRegion = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        updateRegion();
      }
    }
  });

  observerLocation.observe(divLocation, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  observerRegion.observe(divLocDescr, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  updateLocation();
  updateRegion();
}

function playSound() {
  const soundUrl = chrome.runtime.getURL("sound.mp3");

  const audio = new Audio(soundUrl);
  audio.play().catch((error) => {
    console.log("Sound URL:", soundUrl);
    console.error("Ошибка при воспроизведении звука:", error);
  });
}
