async function catchMonster() {
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

    console.log("Определен пол:", isMale ? "Мужчина" : isFemale ? "Женщина" : "Бесполый");

    // Фильтр по catchType
    if (
      (varibleCatch === "male" && !isMale) ||
      (varibleCatch === "female" && !isFemale) ||
      (varibleCatch === "all" && !(isMale || isFemale || isNeutral))
    ) {
      console.log("Этот противник не подходит по условиям. Пропускаем.");
      return;
    }

    // Цикл боя: Атака "Сломанный меч", затем "Колыбельная"
    while (true) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));

      let clickAtack = allAttackClickable.find((el) => el.textContent.trim() === "Сломанный меч")?.parentElement;

      if (!clickAtack) break;

      await delayAttack();
      clickAtack.click();

      if (!(await checkI())) return;
      if (!(await checkHcatch())) break;
    }

    while (true) {
      const allAttackClickable = Array.from(divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle"));

      let clickAtack = allAttackClickable.find((el) => el.textContent.trim() === "Колыбельная")?.parentElement;

      if (!clickAtack) break;

      await delayAttack();
      clickAtack.click();

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
      item.querySelector("img")?.getAttribute("src").includes(`/2.`)
    );

    if (targetHint) targetHint.click();

    // Проверяем сколько в команде

    // const divDockIn = document.querySelectorAll(".divDockIn img");
    // console.log(divDockIn);

    // if (divDockIn.length > 0) {
    //   const targetTeam = Array.from(divDockIn).find((el) => {
    //     const src = el.getAttribute("src");
    //     return src && src.includes("team"); // Проверяем, содержит ли src "team"
    //   });

    //   if (targetTeam) {
    //     targetTeam.click(); // Клик по элементу
    //     targetTeam.click(); // Клик по элементу
    //     console.log("Клик по элементу:", targetTeam);
    //   } else {
    //     console.error("Элемент с 'src', содержащим 'team', не найден.");
    //   }
    // } else {
    //   console.error("Элементы .divDockIn img не найдены на странице.");
    // }

    // const divPokeTeam = document.querySelector(".divDockPanels .divPokeTeam");
    // const monstAll = divPokeTeam.querySelectorAll(".pokemonBoxCard");
    // console.log("Количество покемонов в команде:", monstAll);
  } catch (error) {
    console.error("Ошибка в catchMonster:", error);
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

async function checkHcatch() {
  const divFightH = divVisioFight.querySelector("#divFightH");
  const barHP = divFightH.querySelector(".barHP div");
  const styleWidth = barHP.style.width;
  const widthPercent = parseFloat(styleWidth);
  if (widthPercent <= 5) {
    return false;
  }
  return true;
}
