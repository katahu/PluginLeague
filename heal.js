const divLoc = document.querySelector("#divLoc");
const divLocGo = divLoc.querySelector("#divLocGo");
const divLocNpc = divLoc.querySelector("#divLocNpc");
const delayHeal = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
let isHeal = false;

async function moveHeal() {
  if (isHeal) return;
  isHeal = true;

  const route = userHeal[currentLocation] || routeHeal[currentLocation];
  if (!route) {
    console.error(`Маршрут для локации ${currentLocation} не найден.`);
    isHeal = false;
    return;
  }

  const isMobile = window.innerWidth <= 768;
  const btnSwitchWilds = document.querySelector(
    isMobile ? "#divDockUpper .btnSwitchWilds" : "#divInputButtons .btnSwitchWilds"
  );
  btnSwitchWilds.click();

  if (currentLocation === "Горный водопад") {
    const [pathToTarget, pathBack] = route;

    for (const buttonId of pathToTarget) {
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }

    await delayFast();
    await healNPC();
    await delayFast();

    for (const buttonId of pathBack) {
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }
  } else if (route[0]) {
    const path = route[0];

    for (let i = 1; i < path.length; i++) {
      const buttonId = path[i];
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }

    await delayFast();
    await healNPC();
    await delayFast();

    for (let i = path.length - 2; i >= 0; i--) {
      const buttonId = path[i];
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }
  }

  await delayHeal();
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
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(divLocGo, { childList: true });
  });
}
