let currentLocation = null;

function locationSearch() {
  const divLocation = document.querySelector("#divLocTitleText");

  if (!divLocation) {
    return;
  }

  // Функция для обработки изменений
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

  // Создаем экземпляр MutationObserver
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        updateLocation();
      }
    }
  });

  // Настроим наблюдатель, чтобы отслеживать изменения дочерних узлов и текстовых узлов
  observer.observe(divLocation, {
    childList: true, // Наблюдать за добавлением или удалением дочерних узлов
    // subtree: true, // Наблюдать за всеми потомками (не только за непосредственными дочерними элементами)
    characterData: true, // Наблюдать за изменениями текстового содержимого
  });

  // Начальное обновление
  updateLocation();
}

function playSound() {
  // const extensionId = chrome.runtime.id; // Получить ID расширения

  const soundUrl = chrome.runtime.getURL("sound.wav");

  // Создаем объект Audio и запускаем воспроизведение
  const audio = new Audio(soundUrl);
  audio.play().catch((error) => {
    console.error("Ошибка при воспроизведении звука:", error);
  });
}

locationSearch();
