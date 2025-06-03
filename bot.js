const fightContainer = document.querySelector("#divVisioFight");

const attackHandlers = {
  Редкие: () => {
    play.sound(sounds.shine), messageAdd(`Напал редкий </b>${enemy.name}</b>`);
  },
  Сдаться: () => surrender(),
  Ловить: () => captureManager.capture(),
  Сменить: () => changeMonster(),
  "Атака 1": () => useAttack(0),
  "Атака 2": () => useAttack(1),
  "Атака 3": () => useAttack(2),
  "Атака 4": () => useAttack(3),
  Частые: () => (levelingUP ? levelUpMonster() : useAttack()),
};

const criticalPP = 0;
let countMonster = 0;
let isFightLose = false;

const enemy = {
  // _name: null,
  // isShine: false,
  // hp: null,
  // isCaptured: false,
  // gender: null,
  get name() {
    return divVisioFight.querySelector("#divFightH .pokemonBoxFight .title .name").textContent.trim();
  },
  get isShine() {
    return divVisioFight.querySelector("#divFightH .pokemonBoxFight .title .name").classList.length > 1;
  },
  get isCaptured() {
    return !!divVisioFight.querySelector("#divFightH .wildinfo .icon-ball")?.classList.contains("greennumber");
  },
  get hp() {
    return parseFloat(divVisioFight.querySelector("#divFightH .progressbar.barHP div")?.style.width);
  },
  get hasEnemy() {
    return !!fightContainer.querySelector("#divFightH .pokemonBoxDummy");
  },
  get gender() {
    return divVisioFight.querySelector("#divFightH .pokemonBoxFight .title .gender").classList;
  },
};
const my = {
  // _name: null,
  // isShine: false,
  // hp: null,
  // isCaptured: false,
  get name() {
    return divVisioFight.querySelector("#divFightI .pokemonBoxFight .title .name").textContent.trim();
  },
  get hp() {
    return parseFloat(divVisioFight.querySelector("#divFightI .progressbar.barHP div")?.style.width);
  },
  get hasMy() {
    return !!fightContainer.querySelector("#divFightI .pokemonBoxDummy");
  },
};

const isAgroLocation = () => !!document.querySelector("#divFightData #divFightOptions .agro");
// const isFight = () => fightContainer.style.display !== "none";

const botManager = (() => {
  let isActive = false;
  let isProcessing = false;
  let mainObserver = null;
  let observerVisibleEnemy = null;

  async function start() {
    if (isActive) return;
    isActive = true;

    await screenLockManager.set(true);
    observerDrops();
    handleDeviceActions(true);

    if (isActiveFight()) processBattleRules();

    mainObserver = new MutationObserver(async (mutations) => {
      if (isProcessing) return;
      isProcessing = true;

      try {
        for (const mutation of mutations) {
          if (mutation.type === "attributes" && mutation.attributeName === "style") {
            if (isActiveFight() && !enemy.hasEnemy) {
              processBattleRules();
              break;
            }

            if (!isActiveFight() && enemy.hasEnemy) {
              if (observerVisibleEnemy) observerVisibleEnemy.disconnect();

              if (await isVisubleEnemy()) {
                processBattleRules();
                break;
              }
            }
          }
        }
      } finally {
        isProcessing = false;
      }
    });

    mainObserver.observe(fightContainer, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  function isVisubleEnemy() {
    return new Promise((resolve) => {
      const divFightH = fightContainer.querySelector("#divFightH");

      if (observerVisibleEnemy) observerVisibleEnemy.disconnect();

      observerVisibleEnemy = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observerVisibleEnemy.disconnect();
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

  async function stop() {
    isActive = false;
    isProcessing = false;
    await screenLockManager.set(false);

    mainObserver?.disconnect();
    mainObserver = null;

    observerVisibleEnemy?.disconnect();
    observerVisibleEnemy = null;

    observerDrop?.disconnect();
    observerDrop = null;
  }

  return { start, stop };
})();

function processBattleRules() {
  if (isMonsterLimit && countMonster >= countMonsterLimit) {
    botManager.stop();
    messageAdd(`Достигнут лимит монстров <b>${countMonsterLimit}</b>`);
    return;
  }

  if (!isFightShine) {
    if (enemy.isShine) {
      messageAdd(`Напал ${enemy.name} shine`);
      play.sound(sounds.shine);
      return;
    }
  }

  if (weatherLimit) {
    const weatherIcon = divVisioFight.querySelector("#divFightData #divFightWeather .iconweather");
    if (weatherIcon && variableWeather.split(",").some((w) => weatherIcon.classList.contains(w.trim()))) {
      // messageAdd(`Погода <b>${weatherIcon.classList.value}</b>`);
      play.sound(sounds.shine);
      return;
    }
  }

  let actionFound = false;

  for (const [action, set] of Object.entries(controllerTable.setMap)) {
    if (set.has(enemy.name)) {
      actionFound = true;

      if (action === "Сдаться") {
        if (isAgroLocation()) {
          continue;
        }
      }

      if (action === "Ловить") {
        if (!enemy.isCaptured) {
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
    messageAdd(`Неизвестный монстр <b>${enemy.name}</b>`);
    play.sound(sounds.shine);
    return;
  }
}

async function useAttack(index, isFightLose) {
  let attack;

  while (true) {
    attack = await findAttack(index ?? variableAttack);
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

    if (my.hasMy) {
      if (isFinishingOff) {
        changeMonster(true);
      }
      return;
    }
    // if (attack.randomAttack !== null && !isActiveFight()) {
    //   moveHeal();
    //   return;
    // }
    attack = await findAttack(index ?? variableAttack);

    if (!(await canBattleContinue(attack))) {
      if (isFightLose) {
        moveHeal();
      }
      return;
    }
  }
}
async function findAttack(option) {
  const diableAttack = ["Сломанный меч", "Подставной ход", "Разнонаправленный ток"];
  const attacks = [...divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle")];
  if (attacks.length === 0) {
    return null;
  }

  let attack;

  if (typeof option === "number") {
    attack = attacks[option].parentElement;
  } else if (typeof option === "string") {
    attack = attacks.find((a) => a.textContent.includes(option))?.parentElement;
  }

  const currentPP = +attack?.querySelector(".divMoveParams").textContent.split("/")[0];

  if ((!isFinishingOff && currentPP <= criticalPP) || (!isFinishingOff && my.hp <= criticalHP)) {
    // Проверяем выше атаки на несовпадение
    const randomAttack = attacks.find(
      (a) =>
        a.parentElement !== attack &&
        !a.parentElement.classList.contains("category3") &&
        !diableAttack.includes(a.textContent)
    )?.parentElement;
    return {
      attack,
      randomAttack,
    };
  }
  return { attack, randomAttack: null };
}
async function changeMonster(isFightLose) {
  const ball = divVisioFight.querySelector("#divFightI .ball.clickable");
  const hasMy = fightContainer.querySelector("#divFightI .pokemonBoxDummy.clickable");

  if (isFightLose && hasMy) {
    hasMy.click();
  } else {
    ball.click();
  }

  const monster = await monsterFound(nameSwitchMonster);
  if (!monster.isMonster) {
    if (!nameSwitchMonster) {
      messageAdd(`Не указан монстр для смены</b>`);
    } else {
      messageAdd(`Не найден монстр <b>${nameSwitchMonster}</b>`);
    }
    play.sound(sounds.shine);
    return;
  }

  await delayAttack();
  monster.monsterFound.click();

  await waitForFightOrMonster();
  if (my.name.toLowerCase() !== nameSwitchMonster.toLowerCase()) {
    messageAdd(`Не найден монстр <b>${nameSwitchMonster}</b>`);
    play.sound(sounds.shine);
    return;
  }

  if (isFightLose) {
    useAttack(variableAttackAfter, true);
    return;
  }
  useAttack(variableAttackAfter);
}
async function levelUpMonster() {
  if (isActiveHardLvl) {
    if (+fightContainer.querySelector("#divFightH .boxleft .lvl").textContent.trim() >= enemyHardlvl) {
      if (isAgroLocation()) {
        if (isFinishingOff) {
          changeMonster(true);
          return;
        }
        messageAdd(`Напал <b>${enemy.name}<b> выше </b>${enemyHardlvl}</b> уровня`);
        play.sound(sounds.shine);
        return;
      }
      surrender();
      return;
    }
  }
  while (true) {
    const attack = await findAttack(variableAttackUP);
    if (!attack.attack) {
      messageAdd(`Атака <b>${variableAttackUP}</b> для прокачки не найдена`);
      play.sound(sounds.shine);
      return;
    }
    console.log("attack", attack);
    if (!(await canBattleContinue(attack))) {
      return;
    }
    await delayAttack();
    if (attack.randomAttack !== null) {
      attack.randomAttack.click();
    } else {
      attack.attack.click();
    }

    const monster = await monsterFound(nameUpMonster);
    if (!monster.isMonster) {
      messageAdd(`Монстр <b>${nameUpMonster}</b> для прокачки не найден`);
      play.sound(sounds.shine);
      return;
    }
    if (+monster.monsterFound.querySelector(".shorts .lvl").textContent.trim() >= levelUpMaxMonster) {
      messageAdd(`Уровень <b>${nameUpMonster}</b> достиг <b>${levelUpMaxMonster}</b>`);
      play.sound(sounds.shine);
      return;
    }
    if (parseFloat(monster.monsterFound.querySelector(".progressbar.barHP div").style.width) < criticalHP) {
      if (isAgroLocation()) {
        if (isFinishingOff) {
          changeMonster(true);
          return;
        }
        messageAdd(`Хп у <b>${nameUpMonster}</b> меньше <b>${criticalHP} и не включен добиватель.</b>`);
        play.sound(sounds.shine);
        return;
      }
      await surrender();
      moveHeal();
      return;
    }

    monster.monsterFound.click();
    await updateFight();

    if (my.hasMy) {
      if (isFinishingOff) {
        changeMonster(true);
        return;
      }
      messageAdd(`Монстра <b>${nameUpMonster}</b> убили, добиватель отключен.`);
      play.sound(sounds.shine);
      return;
    }
    if (enemy.hasEnemy) {
      if (my.hp <= criticalHP) {
        moveHeal();
      }
      return;
    }
    if (my.name.toLowerCase() === nameUpMonster.toLowerCase()) {
      if (isAgroLocation()) {
        if (isFinishingOff) {
          changeMonster(true);
          return;
        }
        messageAdd(`После смены на <b>${nameUpMonster}</b> противник жив, добиватель отключен.`);
        play.sound(sounds.shine);
        return;
      }
      surrender();
      if (my.hp <= criticalHP) {
        moveHeal();
      }
      return;
    } else {
      const backupPP = +attack.querySelector(".divMoveParams").textContent.split("/")[0];
      const backupElement = document.createElement("div");
      backupElement.innerHTML = `<div><div class="divMoveParams">${backupPP - 1}/1</div></div>`;
      if (!(await canBattleContinue(backupElement))) {
        return;
      }
    }
  }
}

async function canBattleContinue(attack) {
  const currentPP = +attack.attack?.querySelector(".divMoveParams").textContent.split("/")[0];

  if (attack.randomAttack !== null && !isActiveFight()) {
    moveHeal();
    return false;
  }

  const currentCriticalHP = my.hp <= criticalHP;
  const currentCriticalPP = currentPP <= criticalPP;

  if (currentCriticalHP || currentCriticalPP) {
    if (isAgroLocation()) {
      if (!isActiveFight) {
        moveHeal();
        return false;
      }
      if (isFinishingOff) {
        changeMonster(true);
        return false;
      }
      if (attack.randomAttack !== null) {
        return true;
      }
      messageAdd(`Хп монстра или PP атаки меньше <b>${criticalHP} или ${criticalPP} и нет рандомной атаки.</b>`);
      play.sound(sounds.shine);
      return false;
    }

    if (isFinishingOff) {
      if (isActiveFight) {
        changeMonster(true);
        return false;
      }
      // Проследить момент. Обычный бой и добивание включено, но бой неактивен что будет делать?
    }
    surrender();
    await delayFast();
    moveHeal();
    return false;
  }
  if (enemy.hasEnemy) {
    return false;
  }
  return true;
}
//
async function monsterFound(nameMonster) {
  const divElements = document.querySelector(".divElements");

  await isAddElement(divElements);
  const monsters = divElements.querySelectorAll(".divElement");
  let isMonster = false;
  let monsterFound = null;
  for (const monster of monsters) {
    const monsterName = monster.querySelector(".name")?.textContent.trim().toLowerCase();
    if (monsterName === nameMonster.toLowerCase()) {
      monsterFound = monster;
      isMonster = true;
      break;
    }
  }
  return { monsterFound, isMonster };
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
const checkChangeMonster = (() => {
  let observer = null;

  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    return new Promise((resolve) => {
      const attacks = divVisioFight.querySelector("#divFightI .moves");

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            observer.disconnect();
            observer = null;
            resolve();
            break;
          }
        }
      });

      observer.observe(attacks, { attributes: true, attributeFilter: ["class"] });
    });
  };
})();

const updateFight = (() => {
  let observer = null;

  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    return new Promise((resolve) => {
      const divFightI = divVisioFight.querySelector("#divFightI");

      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            observer.disconnect();
            observer = null;
            resolve();
            return;
          }
        }
      });

      observer.observe(divFightI, { childList: true });
    });
  };
})();
async function waitForFightOrMonster() {
  const [p1, p2] = [checkChangeMonster(), updateFight()];
  await Promise.race([p1, p2]);

  checkChangeMonster();
  updateFight();

  return true;
}
