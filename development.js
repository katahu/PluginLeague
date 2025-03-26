let attackNumber = getLocalStorageValue("attackNumber", "");
let attackNumberAfter = getLocalStorageValue("attackNumberAfter", "");
let switchMonster = getLocalStorageValue("switchMonster", "");

const menuModalAttack = [
  {
    text: "Атака 1",
    name: "attack",
    value: "0",
    storageKey: "attackNumber",
    onClick: () => {
      attackNumber = 0;
      console.log(attackNumber);
    },
  },
  {
    text: "Атака 2",
    name: "attack",
    value: "1",
    storageKey: "attackNumber",
    onClick: () => {
      attackNumber = 1;
      console.log(attackNumber);
    },
  },
  {
    text: "Атака 3",
    name: "attack",
    value: "2",
    storageKey: "attackNumber",
    onClick: () => {
      attackNumber = 2;
      console.log(attackNumber);
    },
  },
  {
    text: "Атака 4",
    name: "attack",
    value: "3",
    storageKey: "attackNumber",
    onClick: () => {
      attackNumber = 3;
      console.log(attackNumber);
    },
  },
];

const menuModalAfterAttack = [
  {
    text: "Атака 1",
    name: "attackAfter",
    value: "0",
    storageKey: "attackNumberAfter",
    onClick: () => {
      attackNumberAfter = 0;
      console.log(attackNumberAfter);
    },
  },
  {
    text: "Атака 2",
    name: "attackAfter",
    value: "1",
    storageKey: "attackNumberAfter",
    onClick: () => {
      attackNumberAfter = 1;
      console.log(attackNumberAfter);
    },
  },
  {
    text: "Атака 3",
    name: "attackAfter",
    value: "2",
    storageKey: "attackNumberAfter",
    onClick: () => {
      attackNumberAfter = 2;
      console.log(attackNumberAfter);
    },
  },
  {
    text: "Атака 4",
    name: "attackAfter",
    value: "3",
    storageKey: "attackNumberAfter",
    onClick: () => {
      attackNumberAfter = 3;
      console.log(attackNumberAfter);
    },
  },
];

const menuFight = ButtonMenu({
  header: "Настройка боев",
  classList: "menuBot menuSP",
});
const attackMenu = ButtonMenu({
  header: "Атаки",
  classList: "menuBot menuStatus",
  buttonArray: menuModalAttack,
});
const monsterMenu = ButtonMenu({
  header: "Смена монстра",
  classList: "menuBot menuStatus",
});
const afterAttackMenu = ButtonMenu({
  header: "Атаки",
  classList: "menuBot menuStatus",
  buttonArray: menuModalAfterAttack,
});
const openAttackMenuButton = document.createElement("div");
openAttackMenuButton.textContent = "Выбор атаки";
openAttackMenuButton.classList.add("btnMenuOpen");
openAttackMenuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  attackMenu.classList.toggle("active");
});
const afterOpenAttackMenuButton = document.createElement("div");
afterOpenAttackMenuButton.textContent = "Выбор атаки";
afterOpenAttackMenuButton.classList.add("btnMenuOpen");
afterOpenAttackMenuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  afterAttackMenu.classList.toggle("active");
});

const openMonsterMenuButton = document.createElement("div");
openMonsterMenuButton.textContent = "Сменить монстра";
openMonsterMenuButton.classList.add("btnMenuOpen");
openMonsterMenuButton.addEventListener("click", (event) => {
  event.stopPropagation();
  monsterMenu.classList.toggle("active");
});

//
const monsterNameInput = document.createElement("input");
monsterNameInput.type = "text";
monsterNameInput.classList.add("monsterNameInput");
monsterNameInput.placeholder = "Имя   на кого сменить";
monsterNameInput.value = getLocalStorageValue("switchMonster", "");
monsterNameInput.addEventListener("input", (event) => {
  const newValue = event.target.value;
  setLocalStorageValue("switchMonster", newValue);
  console.log(newValue);
});
//
//
monsterMenu.append(monsterNameInput, afterOpenAttackMenuButton, afterAttackMenu);
menuFight.append(openAttackMenuButton, openMonsterMenuButton, attackMenu, monsterMenu);

mainMenuItems.forEach((item) => {
  const button = Button(item);
  mainMenu.append(button, dropMenu, menuFight, upMenu, catchMenu);
});

const attackHandlers = {
  Сдаться: () => surrender(),
  Поймать: () => captureMonster(),
  Прокачать: () => levelUpMonster(),
  "Сменить монстра": () => changeMonster(),
  "Первая атака": () => useAttack(0),
  "Вторая атака": () => useAttack(1),
  "Третья атака": () => useAttack(2),
  "Четвертая атака": () => useAttack(3),
  Семанты: () => captureSemant(),
  Все: () => useAttack(null, false),
};

function controlleAttack() {
  console.log("Запуск controlleAttack");
  const mnsH = divVisioFight.querySelector("#divFightH .name");
  if (!mnsH) {
    console.log("Ошибка: не найден #divFightH .name");
    return;
  }

  const nameH = mnsH.textContent.trim();
  console.log("Опознанное имя:", nameH);
  if (!nameH || mnsH.classList.length > 1) {
    console.log("Ошибка: некорректное имя или у элемента больше одного класса");
    playSound();
    stopBot();
    return;
  }

  if (weather) {
    const weatherElem = divVisioFight.querySelector(".iconweather");
    if (weatherElem && weatherElem.className.split(" ").some((cls) => arrWeather.includes(cls))) {
      playSound();
      return;
    }
  }

  console.log("Проверяем userTest:", userTest);
  for (const [key, handler] of Object.entries(attackHandlers)) {
    if (new Set(userTest[key] || []).has(nameH)) {
      console.log(`Имя ${nameH} найдено в '${key}' userTest, вызываем handler()`);
      handler();
      return;
    }
  }

  console.log("Проверяем test:", test);
  if (new Set(test["Все"] || []).has(nameH)) {
    console.log(`Имя ${nameH} найдено в 'Все' test, вызываем useAttack()`);
    useAttack(null, false);
    return;
  }

  console.log("Имя не найдено ни в userTest, ни в test. Завершаем с ошибкой.");
  playSound();
  stopBot();
}

async function useAttack(attackIndex, isSwitch) {
  while (true) {
    const attackElements = divVisioFight.querySelectorAll("#divFightI .moves .divMoveTitle");
    const finalAttackIndex = attackIndex !== null ? attackIndex : isSwitch ? attackNumberAfter : attackNumber;

    if (!attackElements[finalAttackIndex]) {
      console.error(`Ошибка: Атака с индексом ${finalAttackIndex} не найдена`);
      playSound();
      stopBot();
      return;
    }

    await delayAttack();
    attackElements[finalAttackIndex].click();

    await controllerMutationAtack();

    if (!(await checkI()) || !(await checkH())) {
      return;
    }
  }
}

async function changeMonster() {
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
    const filteredName = nameText.replace(/[^a-zA-Zа-яА-Я]/g, "");

    if (switchMonster.includes(filteredName)) {
      await delayFast();
      divElement.click();
      break;
    }
  }

  await controllerMutationAtack();
  useAttack(null, true);
}

async function levelUpMonster() {
  const divElements = document.querySelector(".divElements");
  const divFightI = divVisioFight.querySelector("#divFightI");
  while (true) {
    let clickAtack = null;
    for (const element of divFightI.querySelectorAll("#divFightI .moves .divMoveTitle")) {
      if (element.textContent.trim() === attackUp) {
        clickAtack = element.parentElement;
        break;
      }
    }

    if (!clickAtack) return;
    if (!(await checkI())) return;

    await delayFast();
    clickAtack.click();
    await observerElements(divElements);

    const divElementList = divElements.querySelectorAll(".divElement");

    for (const divElement of divElementList) {
      const nameText = divElement.querySelector(".name").textContent.trim();
      if (nameText.replace(/[^a-zA-Zа-яА-Я]/g, "") === nameUpMonster) {
        await delayFast();

        const barHP = divElement.querySelector(".barHP div");
        if (parseFloat(barHP.style.width) <= 30) {
          if (window.getComputedStyle(divVisioFight).display !== "none") {
            await surrender();
          }
          await delayFast();
          moveHeal();
          return;
        }

        divElement.click();
        break;
      }
    }

    await controllerMutationAtack();
  }
}

async function checkI() {
  const divFightI = document.querySelector("#divFightI");
  const barHP = divFightI.querySelector(".barHP div");

  if (parseFloat(barHP.style.width) <= 30) {
    if (window.getComputedStyle(divVisioFight).display !== "none") {
      await surrender();
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
      if (window.getComputedStyle(divVisioFight).display !== "none") {
        await surrender();
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

  if (!barHP || parseFloat(barHP.style.width) <= 0) {
    return false;
  } else {
    return true;
  }
}

// const items = document.querySelectorAll(".mw-redirect");

// for (const item of items) {
//   // Получаем текст элемента и оставляем только буквы (удаляем всё остальное)
//   const text = item.textContent;
//   const lettersOnly = text.replace(/[^a-zA-Zа-яА-Я]/g, "");
//   console.log(lettersOnly);
// }

// const items = document.querySelectorAll(".mw-redirect");
// const names = Array.from(items)
//   .map((item) => item.textContent.replace(/[^a-zA-Zа-яА-Я]/g, "")) // оставляем только буквы
//   .filter((name) => name.length > 0); // убираем пустые строки

// // Удаляем дубликаты
// const uniqueNames = [...new Set(names)];

// // Сортируем по алфавиту (опционально)
// uniqueNames.sort((a, b) => a.localeCompare(b));

// const jsonOutput = JSON.stringify(uniqueNames, null, 2);
// copy(jsonOutput); // Копируем в буфер обмена
// console.log(jsonOutput);
{
  "Айлур",
    "Амбрук",
    "Астрания",
    "Бугибум",
    "Булли",
    "Волек",
    "Вольтон",
    "Вупс",
    "Вьюнудль",
    "Голона",
    "Грандинг",
    "Грути",
    "Дендино",
    "Джорбик",
    "Джуснель",
    "Дирбаг",
    "Дроздор",
    "Заммлер",
    "Илполь",
    "Каллея",
    "Камолино",
    "Капель",
    "Кваяд",
    "Кислипс",
    "Клуббиш",
    "Коккон",
    "Кокцинус",
    "Корнис",
    "Крыскун",
    "Лайкун",
    "Лалабир",
    "Ленси",
    "Лептибаг",
    "Либеллт",
    "Листотел",
    "Лопыш",
    "Лутер",
    "Лутка",
    "Малор",
    "Мармаус",
    "Месьер",
    "Москилл",
    "Мотль",
    "Ненуль",
    "Ниньо",
    "Нинья",
    "Омутоль",
    "Ополоз",
    "Орлармор",
    "Орли",
    "Орлин",
    "Пантир",
    "Пикан",
    "Пискун",
    "Покут",
    "Поркуш",
    "Прутти",
    "Птерра",
    "Пылизар",
    "Рановак",
    "Рахнус",
    "Редлик",
    "Рокмит",
    "Рошер",
    "Световол",
    "Сенс",
    "Сивинг",
    "Сивун",
    "Скалоб",
    "Скулфиш",
    "Спибаг",
    "Сплешер",
    "Стинни",
    "Ферон",
    "Фокут",
    "Фоуль",
    "Шелтер",
    "Шмелевик",
    "Шримпер",
    "Шумышь",
    "Эфон",
    "Огнесёл",
    "Вулкемел",
    "Грюмышь",
    "Злобстер",
    "Клошар",
    "Кнурр",
    "Криселла",
    "Кроттор",
    "Листвотел",
    "Лифуду",
    "Мантедж",
    "Мукун",
    "Огнесл",
    "Остер",
    "Питонстр",
    "Потат",
    "Потатат",
    "Пынюх",
    "Ракода",
    "Рокиб",
    "Саванна",
    "Скорпимер",
    "Сомасин",
    "Толириб",
    "Триодонт",
    "Тусклофиш",
    "Унгну",
    "Ураллер",
    "Флегон",
    "Фоснейл",
    "Фрыкон",
    "Хани",
    "Хеджайс",
    "Хорсилт",
    "Цианея",
    "Эмброзавр",
    "Эстерелла",
    "Абимон",
    "Анемон",
    "Арахнус",
    "Баттинун",
    "Баттнайти",
    "Вартфиш",
    "Волшбан",
    "Дендилино",
    "Джипсон",
    "Ирлин",
    "Кензи",
    "Кикип",
    "Клыкула",
    "Крак",
    "Лемурил",
    "Льдинкус",
    "Метурнус",
    "Муваг",
    "Пальмер",
    "Пелисир",
    "Путун",
    "Ротенот",
    "Скайт",
    "Стинни",
    "Термола";
}
