const delaySendPokemon = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 100) + 200));
let isSendMonstr = false;
let monsterTeam = null;

const status = {
  Насмешка: "-840px 0px",
  Колыбельная: "-225px 0px",
  Споры: "-225px 0px",
};

async function captureMonstr() {
  try {
    const gender = divVisioFight.querySelector("#divFightH .gender");
    if (!gender) {
      playSound();
      return;
    }
    const genderClasses = gender.classList;

    const isMale = genderClasses.contains("icon-sex-1");
    const isFemale = genderClasses.contains("icon-sex-2");
    const isNeutral = genderClasses.contains("icon-sex-3");

    if (
      (variableCatch === "male" && !isMale) ||
      (variableCatch === "female" && !isFemale) ||
      (variableCatch === "all" && !(isMale || isFemale || isNeutral))
    ) {
      surrender();
      return;
    }

    while (true) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));

      let clickAttack = allAttackClickable.find((el) => el.textContent.trim() === "Сломанный меч")?.parentElement;

      if (!clickAttack) break;

      await delayAttack();
      clickAttack.click();

      if (!(await checkI())) return;
      if (!(await checkHcatch())) break;
    }

    let statusApplied = false;

    while (!statusApplied) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));
      let clickAttack = allAttackClickable.find((el) => el.textContent.trim() === statusAttack)?.parentElement;

      if (!clickAttack) {
        break;
      }

      await delayAttack();
      clickAttack.click();

      if (!(await checkI())) {
        break;
      }
      const statusElements = divVisioFight.querySelectorAll("#divFightH .statusimg");

      if (statusElements.length > 0) {
        const cleanedStatusAttack = statusAttack.replace(/\s+/g, " ").trim();
        const expectedPosition = status[cleanedStatusAttack];
        if (!expectedPosition) {
          break;
        }

        for (const statusElement of statusElements) {
          const bgPosition = window.getComputedStyle(statusElement).backgroundPosition;

          if (bgPosition.includes(expectedPosition)) {
            statusApplied = true;
            break;
          }
        }
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
      isSendMonstr = true;
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
    const whoToCapture = el.querySelector(".icon-star-fill.starter").style.display;
    if (whoToCapture === "none") {
      const send = el.querySelector(".icon-pc-deactivate");
      await delaySendPokemon();
      send.click();
    }
  }
  isSendMonstr = false;
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
