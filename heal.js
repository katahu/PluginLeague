const divLoc = document.querySelector("#divLoc");
const divLocGo = divLoc.querySelector("#divLocGo");
const divLocNpc = divLoc.querySelector("#divLocNpc");
const delayHeal = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
let isHeal = false;
// Функция для перемещения по маршруту
async function moveHeal() {
  if (isHeal) return;
  isHeal = true;
  const route = routes[currentLocation];

  if (!route) {
    console.error(`Маршрут для локации ${currentLocation} не найден.`);
    return;
  }

  const btnSwitchWilds = document.querySelector("#divInputButtons .btnSwitchWilds");
  btnSwitchWilds.click();

  // Находим маршруты для перемещения
  const pathToTarget = route[0];
  const pathBack = route[1];

  // Движение по первому маршруту
  for (let buttonId of pathToTarget) {
    const button = document.querySelector(`#${buttonId}`);
    if (button) {
      button.click();
      await controllerMutationMove();
      await delayHeal();
    } else {
      console.error(`Кнопка ${buttonId} не найдена.`);
      return;
    }
  }

  await delayFast();
  await healNPC();
  await delayFast();
  // Движение по второму маршруту
  console.log(`Начинаем обратный путь.`);
  for (let buttonId of pathBack) {
    const button = document.querySelector(`#${buttonId}`);
    if (button) {
      button.click();
      await controllerMutationMove();
      await delayHeal();
    } else {
      console.error(`Кнопка ${buttonId} не найдена.`);
      return;
    }
  }
  await delayFast();
  btnSwitchWilds.click();
  isHeal = false;
}

async function healNPC() {
  const divElements = document.querySelector(".divElements");
  const btnLocHeal = divLocNpc.querySelector(".btnLocHeal").click();

  await controllerMutatioNPC(divElements);

  const btnHeal = divElements.querySelector(".menuHealAll").click();

  function controllerMutatioNPC(targetNode) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observer.disconnect();
            resolve();
          }
        }
      });

      observer.observe(targetNode, { childList: true });
    });
  }
}

// Контроллер для перемещения
function controllerMutationMove() {
  return new Promise((resolve) => {
    // Как только добавился узел, то передаем промис и отключаем наблюдение
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect(); // Отключаем наблюдение
          resolve(); // Разрешаем промис
        }
      }
    });

    // Наблюдаем за изменениями дочерних элементов
    observer.observe(divLocGo, { childList: true });
  });
}
