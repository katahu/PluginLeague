const divLoc = document.querySelector("#divLoc");
const divLocGo = divLoc.querySelector("#divLocGo");
const divLocNpc = divLoc.querySelector("#divLocNpc");
const delayHeal = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
let isActiveHeal = false;
let isDisabledHeal = false;

async function moveHeal() {
  if (isActiveHeal) return;
  isActiveHeal = true;

  const matchingRoutes = Object.entries(routeHeal)
    .filter(([key]) => key.startsWith(currentLocation))
    .map(([_, value]) => value);

  if (!matchingRoutes.length) {
    console.error(`Маршрут для локации ${currentLocation} не найден.`);
    isActiveHeal = false;
    return;
  }

  await handleDeviceActions(false);

  let successful = false;
  let route;

  for (const r of matchingRoutes) {
    route = r;
    const path = route[0];

    try {
      for (let i = 1; i < path.length; i++) {
        const buttonId = path[i];
        const button = document.querySelector(`#${buttonId}`);
        if (!button) throw new Error(`Кнопка ${buttonId} не найдена.`);
        button.click();
        await controllerMutationMove();
        await delayHeal();
      }

      successful = true;
      break;
    } catch (e) {
      console.warn(e.message);
      continue;
    }
  }

  if (!successful) {
    console.error(`Ни один маршрут для ${currentLocation} не сработал.`);
    await delayHeal();
    await handleDeviceActions(true);
    isActiveHeal = false;
    nonePP = false;
    return;
  }

  await delayFast();

  if (isSendMonstr) await sendMonstersToNursery();

  while (true) {
    await healNPC();
    if (!(await hasActiveInfection())) break;
  }

  await delayFast();

  if (route.length > 1) {
    const returnPath = route[1];
    for (let i = 0; i < returnPath.length; i++) {
      const buttonId = returnPath[i];
      const button = document.querySelector(`#${buttonId}`);
      if (!button) throw new Error(`Кнопка ${buttonId} не найдена.`);
      button.click();
      await controllerMutationMove();
      await delayHeal();
    }
  } else {
    const path = route[0];
    for (let i = path.length - 2; i >= 0; i--) {
      const buttonId = path[i];
      const button = document.querySelector(`#${buttonId}`);
      if (!button) throw new Error(`Кнопка ${buttonId} не найдена.`);
      button.click();
      await controllerMutationMove();
      await delayHeal();
    }
  }

  await delayHeal();
  await handleDeviceActions(true);
  isActiveHeal = false;
  nonePP = false;
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
async function hasActiveInfection() {
  await delayHeal();
  const element = document.querySelector(
    '#divAlerten .alerten.warning .divContainer .divContent:not([data-checked="true"])'
  );
  if (element?.textContent.includes("Не все монстры были вылечены из-за инфекции.")) {
    element.setAttribute("data-checked", "true");
    return true;
  }
  return false;
}
