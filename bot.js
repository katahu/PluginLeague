const attackHandlers = {
  craft: (attack) => handleCraftAndAttackTwo("craft", attack),
  attackTwo: (attack) => handleCraftAndAttackTwo("attackTwo", attack),
  attackThree: (attack) => switchMob("attackThree", attack),
  upPokemon: () => handleUpPokemon(),
  defeat: () => defeat(),
  semant: () => semant(),
};
const arrWeather = ["w3", "w4"];
const delayAttack = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 200) + 200));
const delayFast = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200) + 200));

const divVisioFight = document.querySelector("#divVisioFight");
let isActive = false;
let observerControlller = null;

async function controller() {
  if (isActive) return;
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
function stopBot() {
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
  const mnsH = divVisioFight.querySelector("#divFightH .name");
  const nameH = mnsH.textContent.trim();

  if (!mnsH || mnsH.classList.length > 1) {
    playSound();
    stopBot();
    return;
  }
  if (weather) {
    const weather = divVisioFight.querySelector(".iconweather");
    const weatherClasses = weather.className.split(" ");
    const hasWeatherClass = weatherClasses.some((cls) => arrWeather.includes(cls));
    if (hasWeatherClass) {
      playSound();
      return;
    }
  }
  const locationData = routerAttack[currentLocation];
  const { mob, attack } = locationData;

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
    const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));
    let clickAtack = null;

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
    const namealfavit = nameText.replace(/[^a-zA-Zа-яА-Я]/g, "");
    if (namealfavit === nameSwitch) {
      await delayFast();
      divElement.click();
      break;
    }
  }
  await controllerMutationAtack();
  handleCraftAndAttackTwo(type, attack);
}

async function handleUpPokemon() {
  const divElements = document.querySelector(".divElements");
  const divFightI = divVisioFight.querySelector("#divFightI");
  const allAttackClickable = Array.from(divFightI.querySelectorAll("#divFightI .moves .divMoveTitle"));
  let clickAtack = null;

  allAttackClickable.forEach((element) => {
    if (element.textContent.trim() === attackUp) {
      clickAtack = element.parentElement;
    }
  });
  if (!(await checkI())) return;
  await delayFast();
  clickAtack.click();
  await observerElements(divElements);

  const divElementList = divElements.querySelectorAll(".divElement");
  for (const divElement of divElementList) {
    const name = divElement.querySelector(".name");
    const nameText = name.textContent.trim();
    const namealfavit = nameText.replace(/[^a-zA-Zа-яА-Я]/g, "");
    if (namealfavit === upPockemon) {
      await delayFast();
      const barHP = divElement.querySelector(".barHP div");
      const styleWidth = barHP.style.width;
      const widthPercent = parseFloat(styleWidth);
      if (widthPercent <= 30) {
        const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
        if (currentDisplayStyle !== "none") {
          await defeat();
        }
        await delayFast();
        moveHeal();
        return;
      }

      divElement.click();
      break;
    }
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
    defeat();
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

  const styleWidth = barHP.style.width;
  const widthPercent = parseFloat(styleWidth);
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

  for (const element of divMoveParamsElements) {
    const text = element.textContent.trim();

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

  const styleWidth = barHP.style.width;
  const widthPercent = parseFloat(styleWidth);
  if (widthPercent <= 0) {
    return false;
  }
  return true;
}
async function defeat() {
  // ТОЛЬКО В ПОДЗЕМКЕ
  // playSound();
  // return;
  // const divFightButtons = divVisioFight.querySelector("#divFightData #divFightButtons");
  // MOBILE
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
