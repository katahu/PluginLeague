// let nonePP = false;
// let countMonster = 0;

// const attackHandlers = {
//   Редкие: () => playSound(),
//   Сдаться: () => surrender(),
//   Ловить: () => captureMonster(),
//   "Атака 1": () => useAttack(0),
//   "Атака 2": () => useAttack(1),
//   "Атака 3": () => useAttack(2),
//   "Атака 4": () => useAttack(3),
//   Частые: () => (levelingUP ? levelUpMonster() : useAttack(null, false)),
// };

// const delayAttack = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 200) + 200));
// const delayFast = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1200) + 200));

// const divVisioFight = document.querySelector("#divVisioFight");
// let isActive = false;
// let observerControlller = null;

// async function controller() {
//   if (isActive) return;
//   await handleDeviceActions(true);
//   isActive = true;
//   const firstStart = window.getComputedStyle(divVisioFight).display;
//   if (firstStart === "block") {
//     controlleAttack();
//   }

//   observerControlller = new MutationObserver((mutationsList) => {
//     for (let mutation of mutationsList) {
//       if (mutation.type === "attributes" && mutation.attributeName === "style") {
//         const currentDisplayStyle = window.getComputedStyle(divVisioFight).display;
//         if (currentDisplayStyle == "none") {
//           setTimeout(() => {
//             checker();
//           }, 200);
//         } else {
//           controlleAttack();
//         }
//       }
//     }
//   });

//   observerControlller.observe(divVisioFight, {
//     attributes: true,
//     attributeFilter: ["style"],
//   });
// }
// async function stopBot() {
//   await handleDeviceActions(false);
//   if (observerControlller === null) return;
//   observerControlller.disconnect();
//   observerControlller = null;
//   isActive = false;
// }
// async function controllerMutationAtack() {
//   return new Promise((resolve) => {
//     const divFightI = divVisioFight.querySelector("#divFightI");

//     const observer = new MutationObserver((mutationsList) => {
//       for (let mutation of mutationsList) {
//         if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
//           observer.disconnect();
//           resolve();
//         }
//       }
//     });
//     observer.observe(divFightI, { childList: true });
//   });
// }

// function controlleAttack() {
//   if (isMonsterLimit && countMonster >= countMonsterLimit) {
//     stopBot();
//     return;
//   }

//   const nameElem = divVisioFight?.querySelector("#divFightH .name");
//   if (!nameElem) {
//     playSound();
//     stopBot();
//     return;
//   }

//   const monsterName = nameElem.textContent.trim();

//   if (!monsterName || nameElem.classList.length > 1) {
//     playSound();
//     stopBot();
//     return;
//   }

//   if (weatherLimit) {
//     const weatherIcon = divVisioFight.querySelector(".iconweather");
//     const shouldPlaySound = variableWeather.split(",").some((weather) => weatherIcon.classList.contains(weather));
//     if (shouldPlaySound) {
//       playSound();
//       return;
//     }
//   }

//   for (const [action, set] of Object.entries(controllerTable.setMap)) {
//     if (set.has(monsterName)) {
//       if (action === "Сдаться" && (levelingUP || document.querySelector("#divFightData #divFightOptions .agro"))) {
//         continue;
//       }

//       if (action === "Ловить") {
//         const canCaptureMonster = divVisioFight.querySelector("#divFightH .wildinfo .icon-ball");
//         if (!canCaptureMonster?.classList.contains("greennumber")) {
//           continue;
//         }
//       }

//       attackHandlers[action]?.();
//       countMonster++;
//       return;
//     }
//   }

//   console.log("Неизвестный монстр:", monsterName);
//   playSound();
//   stopBot();
// }

// async function useAttack(attackIndex, isSwitch, isFightLose) {
//   while (true) {
//     const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
//     let finalAttackIndex = attackIndex !== null ? attackIndex : isSwitch ? variableAttackAfter : variableAttack;

//     if (nonePP) {
//       const validAttacks = Array.from(attackElements)
//         .map((el, i) => ({ el, index: i }))
//         .filter(({ el, index }) => !el.classList.contains("category3") && index !== finalAttackIndex);

//       if (validAttacks.length === 0) {
//         console.error("Нет доступных атак без category3, отличных от текущей!");
//         playSound();
//         return;
//       }

//       const selected = validAttacks[Math.floor(Math.random() * validAttacks.length)];
//       finalAttackIndex = selected.index;
//     }

//     if (!attackElements[finalAttackIndex]) {
//       console.error(`Ошибка: Атака с индексом ${finalAttackIndex} не найдена`);
//       playSound();
//       return;
//     }
//     if (!(await canContinueAttack(finalAttackIndex))) return;

//     await delayAttack();
//     attackElements[finalAttackIndex].parentElement.click();
//     await controllerMutationAtack();

//     if (!(await canContinueAttack(finalAttackIndex))) return;
//     if (isFightLose) {
//       if (!(await canBattleContinue())) {
//         await delayFast();
//         moveHeal();
//         return;
//       }
//     }
//     if (!(await canBattleContinue())) return;
//   }
// }
// async function changeMonster(isFightLose = false) {
//   const divElements = document.querySelector(".divElements");
//   const divFightI = divVisioFight.querySelector("#divFightI");
//   const ball = divFightI.querySelector(".ball.clickable");

//   const noneMonster = divFightI.querySelector(".pokemonBoxDummy.clickable");
//   if (isLoseMonster && noneMonster) {
//     await delayFast();
//     noneMonster.click();
//   } else {
//     await delayFast();
//     ball.click();
//   }

//   await observerElements(divElements);
//   const divElementList = divElements.querySelectorAll(".divElement");

//   for (const divElement of divElementList) {
//     const monsterName = divElement.querySelector(".name")?.textContent.toLowerCase();
//     if (!monsterName) {
//       console.log("Не удалось найти имя монстра");
//       return;
//     }
//     if (nameSwitchMonster === monsterName) {
//       await delayFast();
//       divElement.click();
//       break;
//     }
//   }

//   await controllerMutationAtack();
//   if (isFightLose) {
//     useAttack(null, true, true);
//     return;
//   }
//   useAttack(null, true);
// }

// async function levelUpMonster() {
//   const divElements = document.querySelector(".divElements");
//   while (true) {
//     const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");

//     let finalAttackIndex;

//     const attackIndex = Array.from(attackElements).findIndex((el) => el.textContent.trim() === variableAttackUP);

//     if (attackIndex === -1) {
//       console.error(`Атака с названием "${variableAttackUP}" не найдена`);
//       playSound();
//       return;
//     }

//     finalAttackIndex = attackIndex;

//     if (!(await canContinueAttack(finalAttackIndex))) return;

//     if (nonePP) {
//       const validAttacks = Array.from(attackElements)
//         .map((el, i) => ({ el, index: i }))
//         .filter(({ el, index }) => !el.classList.contains("category3") && index !== finalAttackIndex);

//       if (validAttacks.length === 0) {
//         console.error("Нет доступных атак без category3, отличных от текущей!");
//         playSound();
//         return;
//       }

//       const selected = validAttacks[Math.floor(Math.random() * validAttacks.length)];
//       finalAttackIndex = selected.index;
//     }

//     if (!attackElements[finalAttackIndex]) {
//       console.error(`Ошибка: Атака с индексом ${finalAttackIndex} не найдена`);
//       playSound();
//       return;
//     }

//     await delayAttack();
//     attackElements[finalAttackIndex].parentElement.click();

//     await observerElements(divElements);

//     const divElementList = divElements.querySelectorAll(".divElement");

//     for (const divElement of divElementList) {
//       const nameText = divElement.querySelector(".name").textContent.trim();
//       if (nameText.replace(/[^a-zA-Zа-яА-Я]/g, "") === nameUpMonster) {
//         await delayFast();

//         const barHP = divElement.querySelector(".barHP div");
//         if (parseFloat(barHP.style.width) <= 30) {
//           if (window.getComputedStyle(divVisioFight).display !== "none") {
//             await surrender();
//           }
//           await delayFast();
//           moveHeal();
//           return;
//         }

//         divElement.click();
//         break;
//       }
//     }

//     await controllerMutationAtack();
//     if (!(await canBattleContinue())) return;
//   }
// }

// // async function semant() {
// //   const divVisioFight = document.querySelector("#divVisioFight");
// //   const divHImage = divVisioFight.querySelector("#divFightH .image img");
// //   console.log(divHImage);

// //   const src = divHImage.getAttribute("src");
// //   console.log("SRC изображения:", src);

// //   // Проверяем точное совпадение
// //   if (imgSemant.some((img) => src.includes(`/${img}.`))) {
// //     console.log("Нашли точное совпадение:", imgSemant);
// //     playSound();
// //   } else {
// //     console.log("Не нашли точное совпадение.");
// //     surrender();
// //   }
// // }

// async function canContinueAttack(attackIndex = null) {
//   let myHp = document.querySelector("#divFightI .progressbar.barHP div")?.style.width;
//   if (!myHp && isLoseMonster) {
//     changeMonster(true);
//     return false;
//   }
//   myHp = parseFloat(myHp);
//   if (myHp <= 20) {
//     if (divVisioFight.style.display !== "none") {
//       if (document.querySelector("#divFightData #divFightOptions .agro")) {
//         if (isLoseMonster) {
//           changeMonster(true);
//           return false;
//         }
//         playSound();
//         return false;
//       }
//       if (isLoseMonster) {
//         changeMonster(true);
//         return false;
//       } else {
//         await surrender();
//         return;
//       }
//     }
//     await delayFast();
//     moveHeal();
//     return false;
//   }

//   const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveInfo.clickable");
//   const ppElement = +attackElements[attackIndex].querySelector(".divMoveParams").textContent.split("/")[0];
//   if (ppElement <= 0) {
//     if (divVisioFight.style.display !== "none") {
//       if (document.querySelector("#divFightData #divFightOptions .agro")) {
//         if (isLoseMonster) {
//           changeMonster(true);
//           return false;
//         }
//         if (ppStop) {
//           playSound();
//           return false;
//         }
//         nonePP = true;
//         return true;
//       }
//       if (isLoseMonster) {
//         changeMonster(true);
//         return false;
//       } else {
//         await surrender();
//       }
//     }
//     await delayFast();
//     moveHeal();
//     return false;
//   }

//   return true;
// }
// async function canBattleContinue(isCapture = false) {
//   let hpOpponent = document.querySelector("#divFightH .progressbar.barHP div")?.style.width;
//   if (!hpOpponent) return false;

//   hpOpponent = parseFloat(hpOpponent);

//   if (isCapture) {
//     if (hpOpponent <= 10) return false;
//   } else {
//     if (hpOpponent <= 0) {
//       return false;
//     }
//   }

//   return true;
// }

// async function surrender() {
//   const divFightButtons = divVisioFight.querySelector("#divFightButtons");
//   const buttons = divFightButtons.querySelectorAll("div");
//   let defeatButton = null;
//   let closeButton = null;
//   buttons.forEach((button) => {
//     const buttonText = button.textContent.trim();
//     if (buttonText === "Сдаться") {
//       defeatButton = button;
//     }
//     if (buttonText === "Закрыть") {
//       closeButton = button;
//     }
//   });

//   await delayFast();
//   defeatButton.click();

//   const observer = new MutationObserver((mutations) => {
//     mutations.forEach(async (mutation) => {
//       if (mutation.target === closeButton && mutation.attributeName === "style") {
//         const closeButtonStyle = getComputedStyle(closeButton).display;
//         if (closeButtonStyle !== "none" && closeButtonStyle !== "") {
//           await delayFast();
//           closeButton.click();
//           observer.disconnect();
//         }
//       }
//     });
//   });
//   observer.observe(divFightButtons, { attributes: true, childList: true, subtree: true });
// }
