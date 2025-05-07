async function HappyBirthday() {
  while (true) {
    const npcText = document.querySelector(".divNpc .divNpcPhrase")?.textContent.trim();

    console.log("Текст NPC:", npcText);

    // Сначала проверяем общие шаблоны вопросов
    let isAttackSetQuestion = npcText.includes("По набору атак определите");
    let isGenocodeQuestion = npcText.includes("Укажите возможный генокод монстра в яйце после разведения");

    // Ищем вопросы с ключевыми словами для известных шаблонов
    let foundAnswer = null;
    if (isAttackSetQuestion || isGenocodeQuestion) {
      foundAnswer = answers.find((item) => item.key && npcText.includes(item.key));
    }

    // Если не нашли по ключевым словам, используем обычный поиск
    if (!foundAnswer) {
      foundAnswer = answers.find(
        (item) =>
          npcText.toLowerCase().includes(item.question.toLowerCase()) ||
          item.question.toLowerCase().includes(npcText.toLowerCase())
      );
    }

    if (!foundAnswer) {
      console.log("Вопрос не найден в базе");
      return;
    }
    console.log("Найден вопрос:", foundAnswer.question);

    // Остальная часть функции остается без изменений
    let answerFound = false;

    for (const button of document.querySelectorAll(".divNpc .divNpcAnswers .button.nobg.txtgray2.withtext")) {
      if (button.textContent.trim().toLowerCase().includes(foundAnswer.answer.toLowerCase())) {
        await delayFast();
        button.click();
        answerFound = true;
        break;
      }
    }

    if (!answerFound) {
      console.log("Ответ не найден. Варианты:");
      const answerButtons = document.querySelectorAll(".divNpc .divNpcAnswers .button.nobg.txtgray2.withtext");
      answerButtons.forEach((btn) => console.log("-", btn.textContent.trim()));
      return;
    }

    await observerBirthday();

    let nextClicked = false;
    for (const button of document.querySelectorAll(".divNpc .divNpcAnswers .button.nobg.txtgray2.withtext")) {
      if (button.textContent.trim().includes("Следующий вопрос!")) {
        button.click();
        nextClicked = true;
        break;
      }
    }
    if (!nextClicked) {
      console.log("Кнопка 'Следующий вопрос!' не найдена");
      return;
    }

    await observerBirthday();
  }
}
async function observerBirthday() {
  const textNpc = document.querySelector(".divNpc .divNpcPhrase");
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          resolve();
          observer.disconnect();
          return;
        }
      });
    });
    observer.observe(textNpc, { childList: true, subtree: true });
  });
}

//
const arrManesh = [
  "Желтый",
  "Сиреневый",
  "Иссиня-чёрный зал",
  "Голубой",
  "Бежевый",
  "Фиолетовый",
  "Синий",
  "Пурпурный",
  "Ультрамариновый",
  "Серебряный",
];
async function deleteManech() {
  console.log("[deleteManech] Запуск функции удаления кнопок Манежа");

  // 1. Поиск NPC "Работник Манежа"
  console.log('[deleteManech] Ищем NPC "Работник Манежа"...');
  const npcList = document.querySelectorAll("#divLocNpc .button");
  console.log(`[deleteManech] Найдено NPC: ${npcList.length}`);

  let npcClicked = false;
  for (const npc of npcList) {
    const npcName = npc.textContent.trim();
    console.log(`[deleteManech] Проверяем NPC: "${npcName}"`);

    if (npcName === "*Работник Манежа") {
      console.log("[deleteManech] Найден Работник Манежа, кликаем...");
      npc.click();
      npcClicked = true;
      break;
    }
  }

  if (!npcClicked) {
    console.warn("[deleteManech] Работник Манежа не найден!");
    return;
  }

  // 2. Ожидание загрузки диалога (например, через MutationObserver)
  console.log("[deleteManech] Ожидаем загрузку диалога...");
  await observerBirthday();

  // 3. Поиск и скрытие кнопок из массива arrManesh
  console.log("[deleteManech] Ищем кнопки для скрытия...");
  const buttons = document.querySelectorAll(".divNpc .divNpcAnswers .button");
  console.log(`[deleteManech] Найдено кнопок: ${buttons.length}`);

  let hiddenButtonsCount = 0;
  for (const btn of buttons) {
    const btnText = btn.textContent.trim();
    console.log(`[deleteManech] Проверяем кнопку: "${btnText}"`);

    if (arrManesh.some((color) => btnText.includes(color))) {
      console.log(`[deleteManech] Скрываем кнопку: "${btnText}"`);
      btn.remove();
      hiddenButtonsCount++;
    }
  }

  console.log(`[deleteManech] Готово! Скрыто кнопок: ${hiddenButtonsCount}`);

  const btnMahech = document.querySelector(".divNpc .divNpcAnswers .button");
  if (btnMahech.textContent !== "Радужный зал (Лимит: 90 раз)") {
    btnMahech.click();
  }

  await controllerMutationMovePersonal();
  const masterManech = searchNPC(document.querySelectorAll("#divLocNpc .button"), "*Мастер зала");
  if (masterManech) {
    masterManech.click();
  }
  await observerBirthday();
  console.log("Изменение в тектсе нпс");
  const masterfight = searchNPC(
    document.querySelectorAll(".divNpcAnswers .button"),
    "Да! *Переборов удивление, отвечаете вы. А куда же ещё денешься, выйти-то нельзя...*"
  );
  if (masterfight) {
    masterfight.click();
  }

  await waitForFightVisible();

  masterManech.click();

  await observerBirthday();
  const masterfight2 = searchNPC(document.querySelectorAll(".divNpcAnswers .button"), "Спасибо за бой...");
  if (masterfight2) {
    masterfight2.click();
  }
  return;
}
function waitForFightVisible() {
  const isFightVisible = () => fightContainer.style.display === "none";

  return new Promise((resolve) => {
    const mainObserver = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          if (isFightVisible()) {
            resolve();
            mainObserver.disconnect();
          }
        }
      }
    });

    mainObserver.observe(fightContainer, {
      attributes: true,
      attributeFilter: ["style"],
    });
  });
}
let activeSpeculator = false;
async function speculator() {
  if (activeSpeculator) {
    return;
  }

  activeSpeculator = true;
  while (true) {
    let npcSpec = null;

    while (!npcSpec) {
      const btnCharacters = document.querySelectorAll("#divLocNpc .button");

      npcSpec = searchNPC(btnCharacters, "*Спекулянт");

      if (!npcSpec) {
        await new Promise((resolve) => setTimeout(resolve, 300000));

        const newNpcList = document.querySelectorAll("#divLocNpc .button");

        npcSpec = searchNPC(newNpcList, "*Спекулянт");

        if (!npcSpec) {
          await goMadam();
        }
      }
    }

    if (!npcSpec) {
      console.log("[speculator] ВНИМАНИЕ! npcSpec все еще null после выхода из цикла!");
      console.log("[speculator] Перезапускаем внешний цикл");
      continue;
    }

    npcSpec.click();

    await observerBirthday();

    let dialogButtons = document.querySelectorAll(".divNpc .divNpcAnswers .button");

    const questionBtn = searchNPC(dialogButtons, "А это законно?");

    if (questionBtn) {
      await delayFast();
      questionBtn.click();
    }

    await observerBirthday();

    dialogButtons = document.querySelectorAll(".divNpc .divNpcAnswers .button");

    const buyBtn = searchNPC(dialogButtons, "Беру!");

    if (buyBtn) {
      await delayFast();
      buyBtn.click();
    }

    await new Promise((resolve) => setTimeout(resolve, 3.9e6));
  }
}

function searchNPC(npcList, searchText) {
  for (const npc of npcList) {
    const npcText = npc.textContent.trim();

    if (npcText === searchText) {
      return npc;
    }
  }

  return null;
}

async function goMadam() {
  const locMadam = document.querySelectorAll("#divLocGo .button");

  const btnMadam = searchNPC(locMadam, "Салон мадам д'Одёр");

  if (btnMadam) {
    await delayFast();
    btnMadam.click();
  }

  await controllerMutationMove();

  const locFair = document.querySelectorAll("#divLocGo .button");

  const btnFair = searchNPC(locFair, "Ярмарка");

  if (btnFair) {
    await delayFast();
    btnFair.click();
  }

  await controllerMutationMove();
}
function controllerMutationMovePersonal() {
  const divLocNpc = document.querySelector("#divLocNpc");
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(divLocNpc, { childList: true });
  });
}
