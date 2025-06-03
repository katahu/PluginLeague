let isSendMonstr = false;
const captureManager = (() => {
  const criticalHP = 25;
  let teamMonster = null;
  let countCapture = 0;
  const maxAttempts = 3;
  let attack = null;
  const statusMonster = {
    Насмешка: "-840px 0px",
    Колыбельная: "-225px 0px",
    Споры: "-225px 0px",
    "Парализующая пыльца": "-180px 0px",
    "Блуждающие огни": "-120px 0px",
    "Семена-пиявки": "-210px 0px",
  };
  const arrGender = {
    Мальчик: "icon-sex-1",
    Девочка: "icon-sex-2",
    Все: "icon-sex-3",
  };

  async function capture() {
    if (variableGender !== "Все") {
      const expectedGender = arrGender[variableGender];
      if (!enemy.gender.contains(expectedGender)) {
        if (isAgroLocation()) {
          if (isFinishingOff) {
            changeMonster();
            return;
          }
          play.sound(sounds.shine);
          return;
        }
        surrender();
        return;
      }
    }
    while (true) {
      while (true) {
        if (enemy.name === "Эни") {
          if (!(await isTaunt())) {
            return;
          }
        }
        if (enemy.hp <= criticalHP) break;
        const allAttack = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
        let indexAttack = -1;

        for (let i = 0; i < allAttack.length; i++) {
          if (allAttack[i].textContent.trim() === variableCatchAttack) {
            indexAttack = i;
            break;
          }
        }

        if (indexAttack === -1) return;

        attack = await findAttack(indexAttack);
        if (!attack) {
          return;
        }

        if (!(await canBattleContinue(attack))) {
          return;
        }

        await delayAttack();
        if (attack.randomAttack !== null) {
          attack.randomAttack.click();
        } else {
          attack.attack.click();
        }
        await updateFight();

        attack = await findAttack(indexAttack);
        if (!(await canBattleContinue(attack))) {
          return;
        }

        if (enemy.hp <= criticalHP) break;
      }

      while (true) {
        if (enemy.name === "Эни") {
          if (!(await isTaunt())) {
            return;
          }
        }

        if (await hasStatus()) break;
        const allAttack = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
        let indexAttack = -1;

        for (let i = 0; i < allAttack.length; i++) {
          if (allAttack[i].textContent.trim() === variableStatus) {
            indexAttack = i;
            break;
          }
        }

        if (indexAttack === -1) {
          return;
        }

        attack = await findAttack(indexAttack);
        if (!attack) {
          return;
        }
        if (!(await canBattleContinue(attack))) {
          return;
        }

        await delayAttack();
        if (attack.randomAttack !== null) {
          attack.randomAttack.click();
        } else {
          attack.attack.click();
        }

        await updateFight();

        if (await hasStatus()) break;

        attack = await findAttack(indexAttack);
        if (!(await canBattleContinue(attack))) {
          return;
        }
      }

      const ball = divVisioFight.querySelector("#divFightI .ball.clickable").click();

      const divElements = document.querySelector(".divElements");
      await isAddElement(divElements);
      const divElementList = divElements.querySelectorAll(".divElement");
      for (const divElement of divElementList) {
        if (divElement.querySelector(".text").textContent.trim() === "Использовать предмет...") {
          await delayFast();
          divElement.click();
          break;
        }
      }

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
          countCapture++;
          break;
        }
      }

      if (!foundBall) {
        play.sound(sounds.shine);
        return;
      }

      await updateFight();

      if (!isActiveFight()) {
        triggerHealFullTeam(true);
        break;
      }
      if (countCapture >= maxAttempts) {
        if (!isAgroLocation()) {
          await surrender();
          moveHeal();
          return;
        }
        changeMonster(true);
        countCapture = 0;
        return;
      }
      if (isAgroLocation()) {
        if (isFinishingOff) {
          changeMonster(true);
          countCapture = 0;
          return;
        }
        countCapture = 0;
        await surrender();
        moveHeal();
        return;
      }
    }
  }

  async function hasStatus() {
    const statusAll = divVisioFight.querySelectorAll("#divFightH .statusimg");

    for (const status of statusAll) {
      const currentPosition = status.style.backgroundPosition;
      const expectedPosition = statusMonster[variableStatus];

      if (currentPosition === expectedPosition || currentPosition === variableStatus[variableCatchAttack]) {
        return true;
      }
    }
    return false;
  }
  async function isTaunt() {
    const isFightLose = () => {
      const buttons = document.querySelectorAll("#divFightButtons .button.withtext");
      for (const button of buttons) {
        if (button.textContent.trim() === "Закрыть" && button.style.display !== "none") {
          button.click();
          return true;
        }
      }
    };
    while (true) {
      const statusElements = divVisioFight.querySelectorAll("#divFightH .statusimg");

      for (const statusElement of statusElements) {
        if (statusElement.style.backgroundPosition === statusMonster["Насмешка"]) {
          return true;
        }
      }

      const attack = await findAttack("Насмешка");
      if (attack.randomAttack !== null) {
        attack.randomAttack.click();
      } else {
        attack.attack.click();
      }

      await updateFight();

      attack = await findAttack("Насмешка");
      if (!(await canBattleContinue(attack))) {
        return false;
      }
      if (isFightLose()) {
        return false;
      }
    }
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
      const span = item.querySelector(".icon.icomoon.icon-star-fill.starter").style.display;
      if (span === "none") {
        item.querySelector(".icon-pc-deactivate").parentElement.click();
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
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
  return {
    capture,
    isTaunt,
    hasStatus,
    sendMonstersToNursery,
    observerHint,
  };
})();
