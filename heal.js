const divLoc = document.querySelector("#divLoc");
const divLocGo = divLoc.querySelector("#divLocGo");
const divLocNpc = divLoc.querySelector("#divLocNpc");
const delayHeal = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
let isActiveHeal = false;
let isDisabledHeal = false;

async function moveHeal() {
  if (isActiveHeal) return;
  isActiveHeal = true;

  const route =
    userHeal[currentRegion]?.[currentLocation] ??
    userHeal[currentLocation] ??
    routeHeal[currentRegion]?.[currentLocation];

  if (!route) {
    console.error(`Маршрут для локации ${currentLocation} не найден.`);
    isActiveHeal = false;
    return;
  }

  await handleDeviceActions(false);

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
        isActiveHeal = false;
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
        isActiveHeal = false;
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
        isActiveHeal = false;
        return;
      }
    }

    await delayFast();
    if (isSendMonstr) await sendMonstr();
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
        isActiveHeal = false;
        return;
      }
    }
  }

  await delayHeal();
  await handleDeviceActions(true);
  isActiveHeal = false;
}

async function healNPC() {
  const divElements = document.querySelector(".divElements");
  const btnLocHeal = divLocNpc.querySelector(".btnLocHeal").click();
  await controllerMutatioNPC(divElements);
  if (!isDisabledHeal) {
    const btnHeal = divElements.querySelector(".menuHealAll").click();
  }
}

function controllerMutatioNPC(targetNode) {
  return new Promise((resolve) => {
    let styleChanged = false;
    let nodesAdded = false;

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          nodesAdded = true;
        }
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          styleChanged = true;
        }
      }
      if (nodesAdded && styleChanged) {
        isDisabledHeal = false;
      } else if (styleChanged) {
        isDisabledHeal = true;
      }
      observer.disconnect();
      resolve();
    });

    observer.observe(targetNode, {
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
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
