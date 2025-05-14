let nonePP = false;
let countMonster = 0;
let isActiveBot = false;
let observerVisibleEnemy = null;
let mainObserver = null;
let isProcessingMainObserver = false;

const CRITICAL_PP = 0;

const attackHandlers = {
  Редкие: () => playSound(),
  Сдаться: () => surrender(),
  Ловить: () => captureMonster(),
  Сменить: () => changeMonster(),
  "Атака 1": () => useAttack(0),
  "Атака 2": () => useAttack(1),
  "Атака 3": () => useAttack(2),
  "Атака 4": () => useAttack(3),
  Частые: () => (levelingUP ? levelUpMonster() : useAttack()),
};

const fightContainer = document.querySelector("#divVisioFight");

async function startBot() {
  if (isActiveBot) {
    return;
  }
  isActiveBot = true;
  observerDrops();
  handleDeviceActions(true);
  const hasEnemy = () => Boolean(fightContainer.querySelector("#divFightH .pokemonBoxDummy"));
  if (isActiveFight()) {
    processBattleRules();
  }
  mainObserver = new MutationObserver(async (mutations) => {
    if (isProcessingMainObserver) return;
    isProcessingMainObserver = true;

    try {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          if (isActiveFight() && !hasEnemy()) {
            processBattleRules();
            break;
          }

          if (!isActiveFight() && hasEnemy()) {
            if (observerVisibleEnemy) observerVisibleEnemy.disconnect();

            if (await isVisubleEnemy()) {
              processBattleRules();
              break;
            }
          }
        }
      }
    } finally {
      isProcessingMainObserver = false;
    }
  });

  mainObserver.observe(fightContainer, {
    attributes: true,
    attributeFilter: ["style"],
  });

  async function isVisubleEnemy() {
    return new Promise((resolve) => {
      const divFightH = fightContainer.querySelector("#divFightH");

      if (observerVisibleEnemy) {
        observerVisibleEnemy.disconnect();
        observerVisibleEnemy = null;
      }

      observerVisibleEnemy = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observerVisibleEnemy.disconnect();
            observerVisibleEnemy = null;
            resolve(true);
            break;
          }
        }
      });

      observerVisibleEnemy.observe(divFightH, {
        childList: true,
        attributes: true,
      });
    });
  }
}

function processBattleRules() {
  if (isMonsterLimit && countMonster >= countMonsterLimit) {
    return;
  }

  const monster = document.querySelector("#divFightH .name");

  if (!isFightShine) {
    if (monster.classList.length > 1) {
      playSound();
      return;
    }
  }

  if (weatherLimit) {
    const weatherIcon = divVisioFight.querySelector("#divFightData #divFightWeather .iconweather");
    if (weatherIcon && variableWeather.split(",").some((w) => weatherIcon.classList.contains(w.trim()))) {
      playSound();
      return;
    }
  }

  const monsterName = monster?.textContent.trim();

  let actionFound = false;

  for (const [action, set] of Object.entries(controllerTable.setMap)) {
    if (set.has(monsterName)) {
      actionFound = true;

      if (action === "Сдаться") {
        const isAggressiveMonster = document.querySelector("#divFightData #divFightOptions .agro");
        if (levelingUP || isAggressiveMonster) {
          continue;
        }
      }

      if (action === "Ловить") {
        const canCapture = divVisioFight
          .querySelector("#divFightH .wildinfo .icon-ball")
          ?.classList.contains("greennumber");
        if (!canCapture) {
          continue;
        }
      }

      try {
        if (!attackHandlers[action]) {
          continue;
        }

        attackHandlers[action]();
        countMonster++;
        return;
      } catch (error) {
        console.error(`Ошибка при выполнении действия ${action}:`, error);
      }
    }
  }

  if (!actionFound) {
    playSound();
    return;
  }
}

async function useAttack(indexAttack, isFightLose) {
  if (await hasMy()) {
    if (isLoseMonster) {
      changeMonster(true);
    }
    return;
  }
  while (true) {
    if (!indexAttack) {
      indexAttack = variableAttack;
    }
    if (!indexAttack && isFightLose) {
      indexAttack = variableAttackAfter;
    }

    const attackResult = await findAttackIndex({ indexAttack });
    if (!attackResult) {
      return;
    }

    const { index, element } = attackResult;

    if (!(await canBattleContinue(attackResult.element))) {
      return;
    }

    await delayAttack();
    element.click();

    await isUpdateFight();

    if (await hasMy()) {
      if (isLoseMonster) {
        changeMonster(true);
      }

      return;
    }
    const updatedAttack = await getUpdatedAttackElement(index);
    if (!(await canBattleContinue(updatedAttack))) {
      if (isFightLose) {
        moveHeal();
      }
      return;
    }
    if (!hasEnemy()) {
      return;
    }
  }
}

async function levelUpMonster() {
  let isSwitch = false;
  while (true) {
    const attackResult = await findAttackIndex({ nameUpAttack: variableAttackUP });
    if (!attackResult) {
      return;
    }
    const { index, element } = attackResult;

    if (!(await canBattleContinue(attackResult.element))) {
      return;
    }

    await delayAttack();
    element.click();

    const divElements = document.querySelector(".divElements");
    await isAddElement(divElements);

    const monsterElement = divElements.querySelectorAll(".divElement");
    for (const monster of monsterElement) {
      const monsterName = monster.querySelector(".name")?.textContent.trim().toLowerCase();
      if (monsterName === nameUpMonster.toLowerCase()) {
        await delayFast();
        let myHP = monster.querySelector(".progressbar.barHP div")?.style.width;
        myHP = parseFloat(myHP);
        if (myHP < CRITICAL_HP_PERCENT) {
          if (divVisioFight.querySelector("#divFightData #divFightOptions .agro")) {
            if (isLoseMonster) {
              changeMonster(true);
              return;
            }
            return;
          }
          await surrender();
          moveHeal();
          return;
        }
        monster.click();
        isSwitch = true;
        break;
      }
    }

    await isUpdateFight();
    const updatedAttack = await getUpdatedAttackElement(index);

    if (isSwitch && hasEnemy()) {
      const backupPP = +element.querySelector(".divMoveParams").textContent.split("/")[0];
      const backupElement = document.createElement("div");
      backupElement.innerHTML = `<div class="divMoveParams">${backupPP - 1}/1</div>`;
      const virtualObject = { element: backupElement };
      await canBattleContinue(virtualObject);
      return;
    }
    if (await canBattleContinue(updatedAttack)) {
      return;
    }
    if (await hasEnemy()) {
      return;
    }
  }
}

async function findAttackIndex(option = {}) {
  // Невызывать параметры атаки одновременно!!!
  const { indexAttack, nameUpAttack, nameSwitch, nameTaunt } = option;
  const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");

  let finalAttackIndex;

  if (nameUpAttack) {
    finalAttackIndex = Array.from(attackElements).findIndex((el) => el.textContent.trim() === nameUpAttack);
    if (finalAttackIndex === -1) {
      return null;
    }
  }

  if (nameSwitch) {
    finalAttackIndex = Array.from(attackElements).findIndex((el) => el.textContent.trim() === nameSwitch);
    if (finalAttackIndex === -1) {
      return null;
    }
  }
  if (nameTaunt) {
    finalAttackIndex = Array.from(attackElements).findIndex((el) => el.textContent.trim() === nameTaunt);
    if (finalAttackIndex === -1) {
      return null;
    }
  }
  if (indexAttack !== undefined) {
    finalAttackIndex = indexAttack;
  }

  if (finalAttackIndex === undefined) {
    return null;
  }

  if (nonePP) {
    const validAttacks = Array.from(attackElements)
      .map((el, i) => ({ el, index: i }))
      .filter(({ el, index }) => !el.classList.contains("category3") && index !== finalAttackIndex);

    if (validAttacks.length === 0) {
      return null;
    }

    finalAttackIndex = validAttacks[Math.floor(Math.random() * validAttacks.length)].index;
  }
  return {
    index: finalAttackIndex,
    element: attackElements[finalAttackIndex].parentElement,
  };
}
async function getUpdatedAttackElement(index) {
  const updateAttackElement = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
  return {
    element: updateAttackElement[index].parentElement,
  };
}

async function changeMonster(isFightLose = false) {
  const ball = divVisioFight.querySelector("#divFightI .ball.clickable");
  const noneMyMonster = divVisioFight.querySelector("#divFightI .pokemonBoxDummy.clickable");
  await delayFast();
  if (isLoseMonster && noneMyMonster) {
    noneMyMonster.click();
  } else {
    ball.click();
  }

  const divElements = document.querySelector(".divElements");
  await isAddElement(divElements);
  const monsterElement = divElements.querySelectorAll(".divElement");
  let monsterFound = false;
  for (const monster of monsterElement) {
    const monsterName = monster.querySelector(".name")?.textContent.trim().toLowerCase();
    if (monsterName === nameSwitchMonster.toLowerCase()) {
      await delayAttack();
      monster.click();
      monsterFound = true;
      break;
    }
  }

  if (!monsterFound) {
    return;
  }

  await isUpdateFight();
  if (isFightLose) {
    useAttack(variableAttackAfter, true);
    return;
  }
  useAttack(variableAttackAfter);
}

async function canBattleContinue(elementAttack) {
  const isActiveFight = divVisioFight.style.display !== "none";

  const attackElement = elementAttack.element ? elementAttack : { element: elementAttack };

  const isAgroLocation = !!divVisioFight.querySelector("#divFightData #divFightOptions .agro");

  let myHP = document.querySelector("#divFightI .progressbar.barHP div")?.style.width;
  if (!myHP) {
    return false;
  }
  myHP = parseFloat(myHP);

  const currentPP = +attackElement.element.querySelector(".divMoveParams").textContent.split("/")[0];

  const isCriticalHP = myHP <= CRITICAL_HP_PERCENT;
  const isCriticalPP = currentPP <= CRITICAL_PP;

  if (isCriticalHP || isCriticalPP) {
    const resourceType = isCriticalHP ? "HP" : "PP";
    const resourceValue = isCriticalHP ? myHP : currentPP;
    const criticalThreshold = isCriticalHP ? CRITICAL_HP_PERCENT : CRITICAL_PP;

    if (isAgroLocation) {
      if (!isActiveFight) {
        moveHeal();
        return false;
      }
      if (isLoseMonster) {
        changeMonster(true);
        return false;
      }
      playSound();
      return false;
    }

    if (isLoseMonster) {
      if (isActiveFight) {
        changeMonster(true);
        return false;
      }
      moveHeal();
      return false;
    }

    surrender();

    await delayFast();
    moveHeal();
    return false;
  }

  if (!isActiveFight) {
    return false;
  }

  return true;
}

async function surrender() {
  let defeatButton = null;
  let closeButton = null;
  for (const button of document.querySelectorAll("#divFightButtons .button")) {
    if (button.textContent.includes("Сдаться")) {
      defeatButton = button;
    }
    if (button.textContent.includes("Закрыть")) {
      closeButton = button;
      break;
    }
  }

  if (defeatButton.style.display !== "none") defeatButton.click();

  await new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target === closeButton && mutation.attributeName === "style") {
          observer.disconnect();
          resolve();
        }
      });
    });
    observer.observe(closeButton, { attributes: true });
  });

  await delayFast();
  closeButton.click();
}
async function hasEnemy() {
  return !!fightContainer.querySelector("#divFightH .pokemonBoxDummy");
}
async function hasMy() {
  return !!fightContainer.querySelector("#divFightI .pokemonBoxDummy");
}
async function isAddElement(targetElement) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
          return;
        }
      }
    });
    observer.observe(targetElement, { childList: true });
  });
}
async function isUpdateFight() {
  return new Promise((resolve) => {
    const divFightI = divVisioFight.querySelector("#divFightI");

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
          return;
        }
      }
    });
    observer.observe(divFightI, { childList: true });
  });
}
function stopBot() {
  isActiveBot = false;
  isProcessingMainObserver = false;
  if (mainObserver) {
    mainObserver.disconnect();
    mainObserver = null;
  }
  if (observerVisibleEnemy) {
    observerVisibleEnemy.disconnect();
    observerVisibleEnemy = null;
  }
  if (observerDrop) {
    observerDrop.disconnect();
    observerDrop = null;
  }
}

async function observerElements(divElements) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(divElements, { childList: true });
  });
}
