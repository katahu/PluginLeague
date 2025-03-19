const delaySendPokemon = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 100) + 200));
let goSendMonst = false;
let monsterTeam = null;

async function captureMonstr() {
  try {
    // Определение пола противника
    const gender = divVisioFight.querySelector("#divFightH .gender");
    if (!gender) {
      console.log("Пол неизвестен, выход.");
      return;
    }

    const genderClasses = gender.classList;

    const isMale = genderClasses.contains("icon-sex-1");
    const isFemale = genderClasses.contains("icon-sex-2");
    const isNeutral = genderClasses.contains("icon-sex-3");

    // Фильтр по catchType
    if (
      (variableCatch === "male" && !isMale) ||
      (variableCatch === "female" && !isFemale) ||
      (variableCatch === "all" && !(isMale || isFemale || isNeutral))
    ) {
      console.log("Этот противник не подходит по условиям. Пропускаем.");
      surrender();
      return;
    }

    // Цикл боя: Атака "Сломанный меч", затем "Колыбельная"
    while (true) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));

      let clickAttack = allAttackClickable.find((el) => el.textContent.trim() === "Сломанный меч")?.parentElement;

      if (!clickAttack) break;

      await delayAttack();
      clickAttack.click();

      if (!(await checkI())) return;
      if (!(await checkHcatch())) break;
    }

    while (true) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));

      let clickAttack = allAttackClickable.find((el) => el.textContent.trim() === "Колыбельная")?.parentElement;

      if (!clickAttack) break;

      await delayAttack();
      clickAttack.click();

      if (!(await checkI())) return;

      const status = divVisioFight.querySelector("#divFightH .statusimg");
      if (status) {
        const bgPosition = window.getComputedStyle(status).backgroundPosition;
        if (bgPosition.includes("-225px")) break;
      }
    }

    // Использование предмета
    const ball = divVisioFight.querySelector("#divFightI .ball.clickable");
    if (ball) ball.click();

    const divElements = document.querySelector(".divElements");
    await observerElements(divElements);

    const targetElement = Array.from(divElements.querySelectorAll(".divElement")).find(
      (divElement) => divElement.querySelector(".text")?.textContent.trim() === "Использовать предмет..."
    );

    if (targetElement) targetElement.querySelector(".text").click();

    // Выбор предмета из hint
    const hint = document.querySelector(".hint-global");
    const hintItems = await observerHint(hint);

    const targetHint = Array.from(hintItems).find((item) =>
      item.querySelector("img")?.getAttribute("src").includes(`/${varibleBall}.`)
    );

    if (!targetHint) {
      playSound();
      return;
    }
    targetHint.click();
    await displayNone();
    await checkMonsterTeam();
    if (monsterTeam.length >= 5) {
      goSendMonst = true;
      moveHeal();
    }
  } catch (error) {
    console.error("Ошибка в capture:", error);
  }
}

async function observerTeam(divDockPanels) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          monsterTeam = divDockPanels.querySelectorAll(".divPokeTeam .pokemonBoxCard");
          if (monsterTeam.length > 0) {
            observer.disconnect();
            resolve(monsterTeam);
          }
        }
      }
    });

    observer.observe(divDockPanels, { childList: true, subtree: true });
  });
}

async function checkMonsterTeam() {
  const divDockIn = document.querySelectorAll(".divDockIn img");
  const divDockPanels = document.querySelector(".divDockPanels");
  const targetTeam = Array.from(divDockIn).find((el) => {
    const src = el.getAttribute("src");
    return src && src.includes("team");
  });
  targetTeam.click();
  monsterTeam = await observerTeam(divDockPanels);
  targetTeam.click();
}

async function sendMonstr() {
  await checkMonsterTeam();
  for (const el of Array.from(monsterTeam)) {
    const title = el.querySelector(".title").textContent.trim();
    if (title !== whoToCapture) {
      const send = el.querySelector(".icon-pc-deactivate");
      await delaySendPokemon();
      send.click();
    }
  }
  goSendMonst = false;
}

async function observerHint(hint) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const items = hint.querySelectorAll(".divItemFightlist .item.clickable");
          if (items.length > 0) {
            observer.disconnect();
            resolve(items);
          }
        }
      }
    });

    observer.observe(hint, { childList: true, subtree: true });
  });
}

async function checkHcatch() {
  const divFightH = divVisioFight.querySelector("#divFightH");
  const barHP = divFightH.querySelector(".barHP div");
  const styleWidth = barHP.style.width;
  const widthPercent = parseFloat(styleWidth);

  if (widthPercent <= 10) {
    return false;
  }
  return true;
}

async function displayNone() {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
          if (currentDisplayStyle === "none") {
            observer.disconnect();
            resolve();
          }
        }
      }
    });

    observer.observe(divVisioFight, { attributes: true, attributeFilter: ["style"] });
  });
}
