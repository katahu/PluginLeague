const fightContainer = document.querySelector("#divVisioFight");
const CRITICAL_HP_PERCENT = 20;
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
const delayFast = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200) + 200));
const delayAttack = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 200) + 200));
let nonePP = false;
let countMonster = 0;

let isActiveBot = false;
let observerVisubleEnemy = null;
let mainObserver = null;

// 
async function startBot() {
  if (isActiveBot) return;
  isActiveBot = true;

  await handleDeviceActions(true);
  const isFightVisible = () => fightContainer.style.display !== "none";
  const hasNoEnemy = () => !!document.querySelector("#divFightH .pokemonBoxDummy");

  if (isFightVisible()) {
    processBattleRules();
  }

  mainObserver = new MutationObserver(async function (mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "style") {
        if (isFightVisible()) {
          if (hasNoEnemy()) {
            // Если врага НЕТ
            await isVisubleEnemy();
            processBattleRules();
          } else {
            processBattleRules();
          }
        }else{
          checker()
        }
      }
    }
  });

  mainObserver.observe(fightContainer, {
    attributes: true,
    attributeFilter: ["style"],
  });

  async function isVisubleEnemy() {
    return new Promise((resolve) => {
      const divFightH = fightContainer.querySelector("#divFightH");

      if (observerVisubleEnemy) {
        observerVisubleEnemy.disconnect();
        observerVisubleEnemy = null;
      }

      observerVisubleEnemy = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observerVisubleEnemy.disconnect();
            observerVisubleEnemy = null;
            resolve(true);
            break;
          }
        }
      });

      observerVisubleEnemy.observe(divFightH, {
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

  if (monster.classList.length > 1) {
    playSound();
    return;
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
  console.log("🔄 Начинаем процесс прокачки монстра");
  let isSwitch = false;
  while (true) {
    console.log("🔍 Ищем атаку для прокачки: " + variableAttackUP);
    const attackResult = await findAttackIndex({ nameUpAttack: variableAttackUP });
    if (!attackResult) {
      console.log("❌ Атака для прокачки не найдена, выходим из функции");
      return;
    }
    const { index, element } = attackResult;
    console.log(`✅ Найдена атака для прокачки с индексом ${index}`);

    if (!(await canBattleContinue(attackResult.element))) {
      console.log("⚠️ Невозможно продолжить бой, выходим из функции");
      return;
    }

    await delayAttack();
    console.log("🖱️ Кликаем по атаке для прокачки");
    element.click();

    const divElements = document.querySelector(".divElements");
    console.log("⏳ Ожидаем появления элементов для выбора монстра");
    await isAddElement(divElements);

    const monsterElement = divElements.querySelectorAll(".divElement");
    console.log(`📋 Найдено ${monsterElement.length} монстров для выбора`);
    for (const monster of monsterElement) {
      const monsterName = monster.querySelector(".name")?.textContent.trim().toLowerCase();
      console.log(`👀 Проверяем монстра: ${monsterName}`);
      if (monsterName === nameUpMonster.toLowerCase()) {
        console.log(`✅ Найден целевой монстр для прокачки: ${monsterName}`);
        await delayFast();
        let myHP = monster.querySelector(".progressbar.barHP div")?.style.width;
        myHP = parseFloat(myHP);
        console.log(`❤️ HP монстра для прокачки: ${myHP}%`);
        if (myHP < CRITICAL_HP_PERCENT) {
          console.log(`⚠️ Критически низкое HP (${myHP}%), проверяем возможность сдаться`);
          if (divVisioFight.querySelector("#divFightData #divFightOptions .agro")) {
            console.log("❌ Находимся в агрессивной локации, нельзя сдаться");
            return;
          }
          console.log("🏳️ Сдаемся и идем лечиться");
          await surrender();
          moveHeal();
          return;
        }
        console.log("🖱️ Кликаем по монстру для прокачки");
        monster.click();
        isSwitch = true;
        break;
      }
    }

    console.log("⏳ Ожидаем обновления боя");
    await isUpdateFight();
    const updatedAttack = await getUpdatedAttackElement(index);
    console.log("✅ Бой обновлен");

    if (isSwitch && hasEnemy()) {
      console.log("🔄 Произошла смена монстра и враг умер");
      const backupPP = +element.querySelector(".divMoveParams").textContent.split("/")[0];
      const backupElement = document.createElement("div");
      backupElement.innerHTML = `<div class="divMoveParams">${backupPP - 1}/1</div>`;
      const virtualObject = { element: backupElement };
      await canBattleContinue(virtualObject);
      return;
    }
    if (await canBattleContinue(updatedAttack)) {
      console.log("✅ Бой может продолжаться, выходим из функции");
      return;
    }
    if (await hasEnemy()) {
      console.log("👾 Враг все еще присутствует, выходим из функции");
      return;
    }
  }
}

async function findAttackIndex(option = {}) {
  // Невызывать параметры атаки одновременно!!!
  const { indexAttack, nameUpAttack, nameSwitch } = option;
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
  console.log("🔍 Проверяем возможность продолжения боя");
  const isActiveFight = divVisioFight.style.display !== "none";

  const attackElement = elementAttack.element ? elementAttack : { element: elementAttack };
  console.log("✅ Получен элемент атаки для проверки");

  const isAgroLocation = divVisioFight.querySelector("#divFightData #divFightOptions .agro");
  console.log(`🌍 Агрессивная локация: ${isAgroLocation ? "да" : "нет"}`);

  let myHP = document.querySelector("#divFightI .progressbar.barHP div")?.style.width;

  if (!myHP) {
    console.log("❌ Не удалось получить значение HP, возвращаем false");
    return false;
  }

  myHP = parseFloat(myHP);
  console.log(`❤️ Текущее HP: ${myHP}%`);

  if (myHP <= CRITICAL_HP_PERCENT) {
    console.log(`⚠️ Критически низкое HP (${myHP}% <= ${CRITICAL_HP_PERCENT}%)`);

    if (isAgroLocation) {
      console.log("🔴 Находимся в агрессивной локации");
      if (!isActiveFight) {
        console.log("Противник убит переходим для хила");
        moveHeal();
        return false;
      }
      if (isLoseMonster) {
        console.log("🔄 Пытаемся сменить монстра в режиме проигрыша");
        changeMonster(true);
        return false;
      }
      console.log("🔊 Воспроизводим звук предупреждения");
      playSound();
      return false;
    }

    if (isLoseMonster) {
      console.log("🔄 Пытаемся сменить монстра");
      changeMonster(true);
      return false;
    }

    console.log("🏳️ Сдаемся из-за низкого HP");
    surrender();

    await delayFast();
    console.log("💊 Идем лечиться");
    moveHeal();
    return false;
  }

  const currentPP = +attackElement.element.querySelector(".divMoveParams").textContent.split("/")[0];
  console.log(`🔋 Текущее PP атаки: ${currentPP}`);

  if (currentPP <= CRITICAL_PP) {
    console.log(`⚠️ Критически низкое PP (${currentPP} <= ${CRITICAL_PP})`);

    if (isAgroLocation) {
      console.log("🔴 Находимся в агрессивной локации с низким PP");
      if (!isActiveFight) {
        console.log("Противник убит переходим для хила");
        moveHeal();
        return false;
      }
      if (isLoseMonster) {
        console.log("🔄 Пытаемся сменить монстра в режиме проигрыша");
        changeMonster(true);
        return false;
      }
     
      playSound()
      return false;
    }

    if (isLoseMonster) {
      console.log("🔄 Пытаемся сменить монстра из-за низкого PP");
      changeMonster(true);
      return false;
    }

    console.log("🏳️ Сдаемся из-за низкого PP");
    surrender();

    await delayFast();
    console.log("💊 Идем лечиться из-за низкого PP");
    moveHeal();
    return false;
  }

  if (!isActiveFight) {
    console.log("❌ Бой неактивен, возвращаем false");
    return false;
  }
  console.log("✅ Бой может продолжаться (достаточно HP и PP)");
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
  if (mainObserver) {
    console.log("Отключаем основной");
    mainObserver.disconnect();
    mainObserver = null;
  }
  if (observerVisubleEnemy) {
    console.log("Останавливаем за вгаром");
    observerVisubleEnemy.disconnect();
    observerVisubleEnemy = null;
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
