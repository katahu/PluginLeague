const attackHandlers = {
  craft: (attack) => handleCraftAndAttackTwo("craft", attack),
  attackTwo: (attack) => handleCraftAndAttackTwo("attackTwo", attack),
  attackThree: (attack) => switchMob("attackThree", attack),
  upPokemon: (attack) => handleUpPokemon(attack),
  defeat: () => defeat(),
};
const delayAttack = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 200) + 200));
const delayFast = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200) + 200));

const divVisioFight = document.querySelector("#divVisioFight");
let isActive = false;
let observerControlller;
async function controller() {
  if (isActive) return;
  isActive = true;
  const firstStart = window.getComputedStyle(divVisioFight).display;
  if (firstStart === "block") {
    if (!(await checkI())) return;
    if (!(await checkH())) return;
    controlleAttack();
  }
  // Создаем экземпляр MutationObserver
  observerControlller = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "style") {
        // Получаем текущее значение display
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

  // Настраиваем наблюдение за изменением атрибутов
  observerControlller.observe(divVisioFight, {
    attributes: true, // Следим за изменениями атрибутов
    attributeFilter: ["style"], // Следим только за изменениями стиля
  });
}
function stopBot() {
  observerControlller.disconnect();
  observerControlller = null;
  isActive = false;
}
function controllerMutationAtack() {
  return new Promise((resolve) => {
    const divFightI = divVisioFight.querySelector("#divFightI");

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
    observer.observe(divFightI, { childList: true });
  });
}

function controlleAttack() {
  const divFightH = divVisioFight.querySelector("#divFightH");
  const ElementNameH = divFightH.querySelector(".name");
  if (!ElementNameH) return;
  const nameH = ElementNameH.textContent.trim();

  if (!ElementNameH || ElementNameH.classList.length > 1 || !ElementNameH.classList.contains("name")) {
    playSound();
    stopBot();
    return;
  }
  const locationData = routerAttack[currentLocation];
  const { mob, attack } = locationData;
  // Универсальная проверка
  for (const [type, names] of Object.entries(mob)) {
    if (names.includes(nameH)) {
      const handler = attackHandlers[type];
      if (handler) {
        handler(attack[type]);
        return;
      }
    }
  }
  playSound();
  stopBot();
}
async function handleCraftAndAttackTwo(type, attack) {
  while (true) {
    // Зацикливаем клик
    // Получаем все элементы с селектором ".moves .divMoveTitle" внутри элемента с ID "divFightI"
    const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));
    let clickAtack = null;

    // Проходим по каждому элементу и проверяем его текст
    allAttackClickable.forEach((element) => {
      if (element.textContent.trim() === attack) {
        clickAtack = element.parentElement;
      }
    });
    // ОТКЛЮЧИТЬ КОГДА ЗАКОНЧУ КАЧ
    // if (!(await checkI())) return;

    await delayAttack();
    clickAtack.click();

    await controllerMutationAtack();

    if (!(await checkI())) return;
    if (!(await checkH())) return;
  }
}

async function switchMob(type, attack) {
  const divFightI = divVisioFight.querySelector("#divFightI");
  const ball = divFightI.querySelector(".ball.clickable");
  await delayFast();
  ball.click();

  const divElements = document.querySelector(".divElements");

  if (!divElements) {
    console.error("divElements не найден");
    return;
  }

  function observerElements() {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observer.disconnect(); // Останавливаем наблюдателя
            resolve(); // Завершаем промис
          }
        }
      });

      observer.observe(divElements, { childList: true }); // Отслеживаем добавление дочерних узлов
    });
  }

  await observerElements();
  const divElementList = divElements.querySelectorAll(".divElement"); // Здесь исправлено

  for (const divElement of divElementList) {
    const name = divElement.querySelector(".name");
    const nameText = name.textContent.trim();
    const namealfavit = nameText.replace(/[^a-zA-Zа-яА-Я]/g, "");
    if (namealfavit === nameSwitch) {
      await delayFast(); // Делаем задержку
      divElement.click(); // Кликаем на нужный элемент
      break; // Выходим из цикла, чтобы не кликать на другие элементы
    }
  }
  await controllerMutationAtack();
  handleCraftAndAttackTwo(type, attack);
}

async function checkI() {
  const divFightI = document.querySelector("#divFightI");
  const barHP = divFightI.querySelector(".barHP div");

  const styleWidth = barHP.style.width; // Получаем строку вида "99.5781%"
  const widthPercent = parseFloat(styleWidth); // Преобразуем в число 99.5781
  // console.log(widthPercent);
  if (widthPercent <= 30) {
    const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
    if (currentDisplayStyle !== "none") {
      await defeat();
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

  // Перебор всех найденных элементов
  for (const element of divMoveParamsElements) {
    const text = element.textContent.trim();
    // Разделяем текст по символу `/`
    const [current, total] = text.split("/").map(Number);

    if (current <= 1) {
      const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
      if (currentDisplayStyle !== "none") {
        await defeat();
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
  if (!barHP) return false;
  // Извлечение значения ширины из атрибута style
  const styleWidth = barHP.style.width; // Получаем строку вида "99.5781%"
  const widthPercent = parseFloat(styleWidth); // Преобразуем в число 99.5781
  if (widthPercent <= 0) {
    return false;
  }
  return true;
}
async function defeat() {
  // const divFightButtons = divVisioFight.querySelector("#divFightData #divFightButtons");
  // MOBILE
  const divFightButtons = divVisioFight.querySelector("#divFightButtons");
  const buttons = divFightButtons.querySelectorAll("div");
  let defeatButton = null;
  let closeButton = null;

  // Находим кнопки "Сдаться" и "Закрыть"
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
