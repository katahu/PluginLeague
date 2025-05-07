let teamMonster = null;
let isSendMonstr = false;
const statusMonster = {
  Насмешка: "-840px 0px",
  Колыбельная: "-225px 0px",
  Споры: "-225px 0px",
  "Парализующая пыльца": "-180px 0px",
};

async function captureMonster() {
  const genderElement = divVisioFight.querySelector("#divFightH .gender");
  const genderClasses = genderElement.classList;

  const genderMap = {
    male: "icon-sex-1",
    female: "icon-sex-2",
    neutral: "icon-sex-3",
  };

  if (variableGender !== "Все") {
    const expectedClass = genderMap[variableGender];
    if (!genderClasses.contains(expectedClass)) {
      surrender();
      return;
    }
  }
  while (true) {
    const allAttack = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
    let indexAttack = -1;

    for (let i = 0; i < allAttack.length; i++) {
      if (allAttack[i].textContent.trim() === "Сломанный меч") {
        indexAttack = i;
        break;
      }
    }

    if (indexAttack === -1) {
      return;
    }

    const attackResult = await findAttackIndex({ indexAttack });
    if (!attackResult) {
      console.log("Не удалось найти атаку");
      return;
    }
    const { index, element } = attackResult;

    if (!(await canBattleContinue(attackResult.element))) {
      console.log("Невозможно продолжить бой");
      return;
    }

    await delayAttack();
    console.log(`Кликаем на атаку с индексом ${index}`);
    element.click();
    await isUpdateFight();

    const updatedAttack = await getUpdatedAttackElement(index);
    if (!(await canBattleContinue(updatedAttack))) {
      console.log("Невозможно продолжить бой после обновления");
      return;
    }
    if (await hasEnemyHP()) break;
  }

  while (true) {
    const allAttack = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
    let indexAttack = -1;

    for (let i = 0; i < allAttack.length; i++) {
      if (allAttack[i].textContent.trim() === variableStatus) {
        indexAttack = i;
        break;
      }
    }

    if (indexAttack === -1) {
      console.log("Атаки нет");
      return;
    }

    const attackResult = await findAttackIndex({ indexAttack });
    if (!attackResult) {
      console.log("Не удалось найти атаку");
      return;
    }
    const { index, element } = attackResult;

    if (!(await canBattleContinue(attackResult.element))) {
      console.log("Невозможно продолжить бой");
      return;
    }
    await delayAttack();
    console.log(`Кликаем на атаку с индексом ${index}`);
    element.click();

    await isUpdateFight();

    if (await hasStatus()) break;
    const updatedAttack = await getUpdatedAttackElement(index);
    if (!(await canBattleContinue(updatedAttack))) {
      console.log("Невозможно продолжить бой после обновления");
      return;
    }
    if (await hasEnemyHP()) break;
  }
  const ball = divVisioFight.querySelector("#divFightI .ball.clickable").click();

  // Открыли меню
  const divElements = document.querySelector(".divElements");
  await observerElements(divElements);
  const divElementList = divElements.querySelectorAll(".divElement");
  for (const divElement of divElementList) {
    if (divElement.querySelector(".text").textContent.trim() === "Использовать предмет...") {
      await delayFast();
      divElement.click();
      break;
    }
  }
  // Выбрали предмет
  const hint = document.querySelector(".hint-global");
  const hintItems = await observerHint(hint);
  const regex = new RegExp(`/${variableMonsterBall}.png`);
  let foundBall = false;
  for (const hintItem of hintItems) {
    const img = hintItem.querySelector("img");

    if (regex.test(img.src)) {
      await delayFast();
      hintItem.click();
      foundBall = true;
      break;
    }
  }
  if (!foundBall) {
    playSound();
    return;
  }
  await displayNone();
  triggerHealFullTeam(true);
}
async function hasEnemyHP() {
  const hpElement = divVisioFight.querySelector("#divFightH .progressbar.barHP div");
  let enemyHP = hpElement?.style.width;
  enemyHP = parseFloat(enemyHP);
  if (enemyHP <= 10) {
    return true;
  }
  return false;
}

async function hasStatus() {
  const statusAll = divVisioFight.querySelectorAll("#divFightH .statusimg");

  for (const status of statusAll) {
    const currentPosition = status.style.backgroundPosition;
    const expectedPosition = statusMonster[variableStatus];

    if (currentPosition === expectedPosition) {
      return true;
    }
  }
  return false;
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
async function triggerHealFullTeam(useDefault = true) {
  const teamButton = document.querySelector('.divDockIn img[src*="team"]');
  teamButton.click();

  const divDockPanels = document.querySelector(".divDockPanels");
  divDockPanels.style.display = "none";

  const team = divDockPanels.querySelector(".divPokeTeam");

  await new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(team, { childList: true });
  });

  teamButton.click();

  const teamCountMonster = team.querySelectorAll(".pokemonBoxCard");
  if (!useDefault) teamMonster = teamCountMonster;
  if (useDefault && teamCountMonster.length >= 6) {
    isSendMonstr = true;
    moveHeal();
  }
}
async function sendMonstersToNursery() {
  await triggerHealFullTeam(false);
  for (const item of teamMonster) {
    // Удалить компьютед лишний гемор
    const span = item.querySelector(".icon.icomoon.icon-star-fill.starter").style.display;
    if (span === "none") {
      item.querySelector(".icon-pc-deactivate").parentElement.click();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}
