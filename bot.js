let nonePP = false;
let countMonster = 0;

const attackHandlers = {
  Сдаться: () => surrender(),
  Поймать: () => captureMonster(),
  Прокачать: () => useAttack(null, false),
  "Сменить монстра": () => changeMonster(),
  "Первая атака": () => useAttack(0),
  "Вторая атака": () => useAttack(1),
  "Третья атака": () => useAttack(2),
  "Четвертая атака": () => useAttack(3),
  Семанты: () => captureSemant(),
  Все: () => (levelingUP ? levelUpMonster() : useAttack(null, false)),
};

const delayAttack = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 200) + 200));
const delayFast = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200) + 200));

const divVisioFight = document.querySelector("#divVisioFight");
let isActive = false;
let observerControlller = null;

async function controller() {
  if (isActive) return;
  await handleDeviceActions(true);
  isActive = true;
  const firstStart = window.getComputedStyle(divVisioFight).display;
  if (firstStart === "block") {
    if (!(await checkI())) return;
    if (!(await checkH())) return;
    controlleAttack();
  }

  observerControlller = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "style") {
        const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
        if (currentDisplayStyle == "none") {
          setTimeout(() => {
            checker();
          }, 200);
        } else {
          controlleAttack();
        }
      }
    }
  });

  observerControlller.observe(divVisioFight, {
    attributes: true,
    attributeFilter: ["style"],
  });
}
async function stopBot() {
  await handleDeviceActions(false);
  if (observerControlller === null) return;
  observerControlller.disconnect();
  observerControlller = null;
  isActive = false;
}
function controllerMutationAtack() {
  return new Promise((resolve) => {
    const divFightI = divVisioFight.querySelector("#divFightI");

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(divFightI, { childList: true });
  });
}

function controlleAttack() {
  if (isMonsterLimit && countMonster >= countMonsterLimit) {
    stopBot();
    return;
  }

  const nameElem = divVisioFight?.querySelector("#divFightH .name");
  if (!nameElem) {
    playSound();
    stopBot();
    return;
  }

  const monsterName = nameElem.textContent.trim();

  if (!monsterName || nameElem.classList.length > 1) {
    playSound();
    stopBot();
    return;
  }

  if (weatherLimit) {
    const weatherIcon = divVisioFight.querySelector(".iconweather");
    if (Array.isArray(variableWeather)) {
      const shouldPlaySound = variableWeather.some((weather) => weatherIcon.classList.contains(weather));
      if (shouldPlaySound) {
        playSound();
        return;
      }
    } else if (weatherIcon.classList.contains(variableWeather)) {
      playSound();
      return;
    }
  }

  for (const [action, handler] of Object.entries(attackHandlers)) {
    if (userMonsterList[action]?.includes(monsterName)) {
      if (action === "Сдаться" && document.querySelector("#divFightData #divFightOptions .agro")) {
        continue;
      }
      if (action === "Поймать") {
        const canCaptureMonster = divVisioFight.querySelector("#divFightH .wildinfo .icon-ball");
        if (!canCaptureMonster?.classList.contains("greennumber")) {
          continue;
        }
      }
      handler();
      countMonster++;
      return;
    }
  }

  if (monsterList.Все?.includes(monsterName)) {
    attackHandlers.Все();
    countMonster++;
    return;
  }

  console.log("Неизвестный монстр:", monsterName);
  playSound();
  stopBot();
}

async function useAttack(attackIndex, isSwitch) {
  while (true) {
    const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
    let finalAttackIndex = attackIndex !== null ? attackIndex : isSwitch ? variableAttackAfter : variableAttack;

    await checkI();

    if (nonePP) {
      const validAttacks = Array.from(attackElements)
        .map((el, i) => ({ el, index: i }))
        .filter(({ el, index }) => !el.classList.contains("category3") && index !== finalAttackIndex);

      if (validAttacks.length === 0) {
        console.error("Нет доступных атак без category3, отличных от текущей!");
        playSound();
        return;
      }

      const selected = validAttacks[Math.floor(Math.random() * validAttacks.length)];
      finalAttackIndex = selected.index;
    }

    if (!attackElements[finalAttackIndex]) {
      console.error(`Ошибка: Атака с индексом ${finalAttackIndex} не найдена`);
      playSound();
      return;
    }

    await delayAttack();
    attackElements[finalAttackIndex].parentElement.click();
    await controllerMutationAtack();

    if (!(await checkI()) || !(await checkH())) {
      return;
    }
  }
}

async function changeMonster() {
  const divElements = document.querySelector(".divElements");
  const divFightI = divVisioFight.querySelector("#divFightI");
  const ball = divFightI.querySelector(".ball.clickable");
  await delayFast();
  ball.click();

  await observerElements(divElements);
  const divElementList = divElements.querySelectorAll(".divElement");

  for (const divElement of divElementList) {
    const name = divElement.querySelector(".name");
    const nameText = name.textContent.trim();
    const filteredName = nameText.replace(/[^a-zA-Zа-яА-Я]/g, "");

    if (nameSwitchMonster.includes(filteredName)) {
      await delayFast();
      divElement.click();
      break;
    }
  }

  await controllerMutationAtack();
  useAttack(null, true);
}

async function levelUpMonster() {
  const divElements = document.querySelector(".divElements");
  const divFightI = divVisioFight.querySelector("#divFightI");
  while (true) {
    const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
    await checkI();

    let finalAttackElement;

    if (nonePP) {
      const validAttacks = Array.from(attackElements).filter(
        (el) => !el.classList.contains("category3") && el.textContent.trim() !== variableAttackUP
      );

      if (validAttacks.length === 0) {
        console.error("Нет доступных атак без category3 и не равных", variableAttackUP);
        playSound();
        return;
      }

      finalAttackElement = validAttacks[Math.floor(Math.random() * validAttacks.length)];
    } else {
      finalAttackElement = Array.from(attackElements).find((el) => el.textContent.trim() === variableAttackUP);

      if (!finalAttackElement) {
        console.error("Атака не найдена:", variableAttackUP);
        playSound();
        return;
      }
    }

    await delayFast();
    finalAttackElement.parentElement.click();
    if (nonePP) {
      await controllerMutationAtack();
      moveHeal();
      return;
    }

    await observerElements(divElements);

    const divElementList = divElements.querySelectorAll(".divElement");

    for (const divElement of divElementList) {
      const nameText = divElement.querySelector(".name").textContent.trim();
      if (nameText.replace(/[^a-zA-Zа-яА-Я]/g, "") === nameUpMonster) {
        await delayFast();

        const barHP = divElement.querySelector(".barHP div");
        if (parseFloat(barHP.style.width) <= 30) {
          if (window.getComputedStyle(divVisioFight).display !== "none") {
            await surrender();
          }
          await delayFast();
          moveHeal();
          return;
        }

        divElement.click();
        break;
      }
    }

    await controllerMutationAtack();
    if (window.getComputedStyle(divVisioFight).display === "none") return;
  }
}

async function semant() {
  const divVisioFight = document.querySelector("#divVisioFight");
  const divHImage = divVisioFight.querySelector("#divFightH .image img");
  console.log(divHImage);

  const src = divHImage.getAttribute("src");
  console.log("SRC изображения:", src);

  // Проверяем точное совпадение
  if (imgSemant.some((img) => src.includes(`/${img}.`))) {
    console.log("Нашли точное совпадение:", imgSemant);
    playSound();
  } else {
    console.log("Не нашли точное совпадение.");
    surrender();
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

async function checkI() {
  const divFightI = document.querySelector("#divFightI");
  const barHP = divFightI.querySelector(".barHP div");

  if (parseFloat(barHP.style.width) <= 30) {
    if (window.getComputedStyle(divVisioFight).display !== "none") {
      await surrender();
    }
    await delayFast();
    moveHeal();
    return false;
  }
  // ОТКЛЮЧИТЬ КОГДА ЗАКОНЧУ КАЧ
  // const barEXP = divFightI.querySelector(".barEXP div");
  // const styleWidthEXP = barEXP.style.width; // Получаем строку вида "99.5781%"
  // const widthPercentEXP = parseFloat(styleWidthEXP); // Преобразуем в число 99.5781
  // console.log(widthPercentEXP);
  // if (widthPercentEXP >= 90) {
  //   playSound();
  //   return false;
  // }

  const allAttack = divFightI.querySelector(".moves");
  const divMoveParamsElements = allAttack.querySelectorAll(".divMoveParams");

  for (const element of divMoveParamsElements) {
    const text = element.textContent.trim();
    const [current, total] = text.split("/").map(Number);
    if (current <= 0) {
      if (window.getComputedStyle(divVisioFight).display !== "none") {
        if (document.querySelector("#divFightData #divFightOptions .agro")) {
          nonePP = true;
          return true;
        }
        await surrender();
      }
      await delayFast();
      moveHeal();
      return false;
    }
  }
  return true;
}
async function checkH() {
  const divFightH = divVisioFight.querySelector("#divFightH");
  const barHP = divFightH.querySelector(".barHP div");

  if (!barHP || parseFloat(barHP.style.width) <= 0) {
    return false;
  } else {
    return true;
  }
}

async function surrender() {
  const divFightButtons = divVisioFight.querySelector("#divFightButtons");
  const buttons = divFightButtons.querySelectorAll("div");
  let defeatButton = null;
  let closeButton = null;
  buttons.forEach((button) => {
    const buttonText = button.textContent.trim();
    if (buttonText === "Сдаться") {
      defeatButton = button;
    }
    if (buttonText === "Закрыть") {
      closeButton = button;
    }
  });

  await delayFast();
  defeatButton.click();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(async (mutation) => {
      if (mutation.target === closeButton && mutation.attributeName === "style") {
        const closeButtonStyle = getComputedStyle(closeButton).display;
        if (closeButtonStyle !== "none" && closeButtonStyle !== "") {
          await delayFast();
          closeButton.click();
          observer.disconnect();
        }
      }
    });
  });
  observer.observe(divFightButtons, { attributes: true, childList: true, subtree: true });
}
