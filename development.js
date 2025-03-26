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

  const divFightH = divVisioFight?.querySelector("#divFightH .name");
  if (!divFightH) {
    console.log("Ошибка: не найден #divFightH .name");
    return;
  }

  const nameH = divFightH.textContent.trim();
  console.log("Опознанное имя:", nameH);
  if (!nameH || divFightH.classList.length > 1) {
    console.log("Ошибка: некорректное имя или у элемента больше одного класса");
    playSound();
    stopBot();
    return;
  }

  if (weather) {
    const weatherElem = divVisioFight?.querySelector(".iconweather");
    if (weatherElem && weatherElem.className.split(" ").some((cls) => arrWeather.includes(cls))) {
      playSound();
      return;
    }
  }

  console.log("Проверяем userMonsterList:", userMonsterList);
  for (const [key, handler] of Object.entries(attackHandlers)) {
    if (userMonsterList.has(key) && new Set(userMonsterList.get(key)).has(nameH)) {
      console.log(`Имя ${nameH} найдено в '${key}' userMonsterList, вызываем handler()`);
      handler();
      return;
    }
  }

  console.log("Проверяем monsterList:", monsterList);
  if (monsterList.has("Все") && new Set(monsterList.get("Все")).has(nameH)) {
    console.log(`Имя ${nameH} найдено в 'Все' monsterList, вызываем useAttack()`);
    useAttack(null, false);
    return;
  }

  console.log("Имя не найдено ни в userMonsterList, ни в monsterList. Завершаем с ошибкой.");
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
// [
//   {
//       "nameSwitch": "Чихон",
//       "imgSemant": [
//           "201_1",
//           "201_6",
//           "201_10",
//           "201_5",
//           "201_22"
//       ],
//       "Безлюдная дорога": {
//           "mob": {
//               "craft": [
//                   "Мотль"
//               ],
//               "attackTwo": [
//                   "Вупс"
//               ],
//               "attackThree": [
//                   ""
//               ],
//               "upPokemon": [],
//               "defeat": [
//                   "Волек",
//                   "Москилл",
//                   "Орлин"
//               ]
//           },
//           "attack": {
//               "craft": "Бур",
//               "attackTwo": "Слэм",
//               "attackThree": ""
//           }
//       },
//       "Дорога №2": {
//           "mob": {
//               "craft": [
//                   "Эфон",
//                   "Клуббиш",
//                   "Дроздор",
//                   "Астрания",
//                   "Вольтон"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": []
//           },
//           "attack": {
//               "craft": "Луч пузырей",
//               "attackTwo": "Луч пузырей",
//               "attackThree": "Сладкая пыльца"
//           }
//       },
//       "Дорога №3": {
//           "mob": {
//               "craft": [
//                   "Мотль"
//               ],
//               "attackTwo": [
//                   "Световол"
//               ],
//               "attackThree": [
//                   ""
//               ],
//               "upPokemon": [],
//               "defeat": [
//                   "Волек",
//                   "Орли",
//                   "Лалабир",
//                   "Лалабибер",
//                   "Стинни",
//                   "Айлур"
//               ]
//           },
//           "attack": {
//               "craft": "Бур",
//               "attackTwo": "Рассекающий ветер",
//               "attackThree": ""
//           }
//       },
//       "Пасека": {
//           "mob": {
//               "craft": [
//                   "Буллитум"
//               ],
//               "attackTwo": [],
//               "attackThree": [
//                   "Астрания"
//               ],
//               "upPokemon": [],
//               "defeat": [
//                   "Хани",
//                   "Москилл",
//                   "Дендино",
//                   "Мандракас",
//                   "Джуснель",
//                   "Хани",
//                   "Роялони"
//               ]
//           },
//           "attack": {
//               "craft": "Родниковая вода",
//               "attackTwo": "Лобовая атака",
//               "attackThree": "Режущий ветер"
//           }
//       },
//       "Лес вокруг воздушного стадиона": {
//           "mob": {
//               "craft": [
//                   "Редлик",
//                   "Дирбаг",
//                   "Грути",
//                   "Листотел"
//               ],
//               "attackTwo": [
//                   "Мотль"
//               ],
//               "attackThree": [
//                   "Агроспор"
//               ],
//               "upPokemon": [],
//               "defeat": [
//                   "Вьюнудль",
//                   "Лутка",
//                   "Булли",
//                   "Ополоз",
//                   "Пискун",
//                   "Орли"
//               ]
//           },
//           "attack": {
//               "craft": "Ярость",
//               "attackTwo": "Бур",
//               "attackThree": "Вышибала"
//           }
//       },
//       "Полицейский участок": {
//           "mob": {
//               "craft": [],
//               "attackTwo": [],
//               "attackThree": [
//                   ""
//               ],
//               "upPokemon": [
//                   "Лознудль",
//                   "Наклес",
//                   "Фемидон"
//               ],
//               "defeat": [
//                   "Шадо-Топ"
//               ]
//           },
//           "attack": {
//               "craft": "Водный хвост",
//               "attackTwo": "Вышибала",
//               "attackThree": ""
//           }
//       },
//       "Маршрут 16": {
//           "mob": {
//               "craft": [
//                   "Вупс"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "capture": [],
//               "defeat": [
//                   "Гюрзар",
//                   "Яркокрыл",
//                   "Орли",
//                   "Пискун"
//               ]
//           },
//           "attack": {
//               "craft": "Тонкие иглы",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Перевал": {
//           "mob": {
//               "craft": [
//                   "Рахнус"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": []
//           },
//           "attack": {
//               "craft": "Сверлящий клюв",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Старая дорога": {
//           "mob": {
//               "craft": [
//                   "Слизень"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Редлик",
//                   "Бонозавр"
//               ]
//           },
//           "attack": {
//               "craft": "Удар клювом",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Пещера Потатов": {
//           "mob": {
//               "craft": [
//                   "Потат"
//               ],
//               "attackTwo": [
//                   "Потатат"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": []
//           },
//           "attack": {
//               "craft": "Перекоп",
//               "attackTwo": "Удар исподтишка",
//               "attackThree": ""
//           }
//       },
//       "Горный тоннель": {
//           "mob": {
//               "craft": [],
//               "attackTwo": [
//                   "Крыскун",
//                   "Аспер",
//                   "Месьер",
//                   "Битав",
//                   "Ферон",
//                   "Потат"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": []
//           },
//           "attack": {
//               "craft": "Воздушная грация",
//               "attackTwo": "Когти",
//               "attackThree": "Дрожь земли"
//           }
//       },
//       "Уровень": {
//           "mob": {
//               "craft": [
//                   "Пустыномот",
//                   "Булавор",
//                   "Ленсирон",
//                   "Эверестор",
//                   ""
//               ],
//               "attackTwo": [
//                   "Полидрон",
//                   "Колокойн"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": []
//           },
//           "attack": {
//               "craft": "Энергетический шар",
//               "attackTwo": "Шар тьмы",
//               "attackThree": ""
//           }
//       },
//       "Зона сафари": {
//           "mob": {
//               "craft": [
//                   "Орланор",
//                   "Флегон",
//                   "Эфарол",
//                   "Драконор",
//                   "Чихон"
//               ],
//               "attackTwo": [
//                   "Саностридж",
//                   "Москилл",
//                   "Шмелевик",
//                   "Мантедж",
//                   "Пескомот"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Сазам",
//                   "Архолем"
//               ]
//           },
//           "attack": {
//               "craft": "Телекинез",
//               "attackTwo": "Скрытая сила",
//               "attackThree": ""
//           }
//       },
//       "Глухой колючий лес": {
//           "mob": {
//               "craft": [
//                   "Фоуль"
//               ],
//               "attackTwo": [
//                   "Трухля"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Пискун",
//                   "Лайкун"
//               ]
//           },
//           "attack": {
//               "craft": "Вакуумная волна",
//               "attackTwo": "Икс-Ножницы",
//               "attackThree": ""
//           }
//       },
//       "Старый коллектор": {
//           "mob": {
//               "craft": [
//                   "Месьер"
//               ],
//               "attackTwo": [
//                   "Лутер",
//                   "Заммлер"
//               ],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Орли",
//                   "Крыскун",
//                   "Пантир"
//               ]
//           },
//           "attack": {
//               "craft": "Обломок скалы",
//               "attackTwo": "Ледяные копья",
//               "attackThree": ""
//           }
//       },
//       "Электростанция": {
//           "mob": {
//               "craft": [
//                   "Октаселл"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Дуоселл",
//                   "Люминьон",
//                   "Грязень"
//               ]
//           },
//           "attack": {
//               "craft": "Когти",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Библиотека": {
//           "mob": {
//               "craft": [],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Пискун",
//                   "Крыскун",
//                   "Джипсон",
//                   "Мукун"
//               ],
//               "semant": [
//                   "Семант"
//               ]
//           },
//           "attack": {
//               "craft": "",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Лес Селена": {
//           "mob": {
//               "craft": [
//                   "Фоуль"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "defeat": [
//                   "Орли",
//                   "Редлик",
//                   "Сивун"
//               ]
//           },
//           "attack": {
//               "craft": "Тонкие иглы",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       },
//       "Крутой подъём": {
//           "mob": {
//               "craft": [
//                   "Феронт"
//               ],
//               "attackTwo": [],
//               "attackThree": [],
//               "upPokemon": [],
//               "capture": [],
//               "defeat": [
//                   "Скуллозавр",
//                   "Бонозавр"
//               ]
//           },
//           "attack": {
//               "craft": "Когти",
//               "attackTwo": "",
//               "attackThree": ""
//           }
//       }
//   }
// ]

// let testManipulate = { all: [], kill: [] };

// // Создаем элементы интерфейса
// const menuMonstr = document.createElement("div");
// menuMonstr.classList.add("menuMonstr");

// const containerAll = document.createElement("div");
// containerAll.classList.add("containerAll");

// const containerKill = document.createElement("div");
// containerKill.classList.add("containerKill");

// menuMonstr.append(containerAll, containerKill);
// document.body.append(menuMonstr);

// // Оптимизированная обработка данных
// function processTestData(data) {
//   try {
//     if (Array.isArray(data) && data.length) data = data[0];
//     return {
//       all: Array.isArray(data?.all) ? data.all : [],
//       kill: Array.isArray(data?.kill) ? data.kill : [],
//     };
//   } catch (error) {
//     console.error("Ошибка обработки данных:", error);
//     return { all: [], kill: [] };
//   }
// }
// // Добавляем поисковый input
// const searchInput = document.createElement("input");
// searchInput.setAttribute("type", "text");
// searchInput.setAttribute("placeholder", "Поиск...");
// searchInput.classList.add("searchInput");
// menuMonstr.prepend(searchInput);

// // Функция поиска
// searchInput.addEventListener("input", function () {
//   const searchText = this.value.toLowerCase().trim();

//   // Удаляем предыдущую подсветку
//   document.querySelectorAll(".highlight").forEach((el) => {
//     el.classList.remove("highlight");
//   });

//   if (!searchText) return;

//   // Ищем совпадения во всех элементах
//   ["all", "kill"].forEach((type) => {
//     const container = type === "all" ? containerAll : containerKill;
//     const items = container.querySelectorAll(".item");

//     items.forEach((item) => {
//       const text = item.textContent.toLowerCase();
//       if (text.includes(searchText)) {
//         item.classList.add("highlight");

//         // Прокручиваем контейнер к найденному элементу
//         item.scrollIntoView({ behavior: "smooth", block: "nearest" });
//       }
//     });
//   });
// });

// // Оптимизированный рендеринг
// function renderData() {
//   try {
//     [containerAll, containerKill].forEach((container) => (container.innerHTML = ""));
//     ["all", "kill"].forEach((type) => {
//       const container = type === "all" ? containerAll : containerKill;
//       const data = testManipulate[type];
//       if (data.length) {
//         const fragment = document.createDocumentFragment();
//         data.forEach((item, index) => fragment.appendChild(createElement(item, index, type)));
//         container.appendChild(fragment);
//       } else {
//         container.textContent = `Нет элементов в ${type}`;
//       }
//     });
//   } catch (error) {
//     console.error("Ошибка рендеринга:", error);
//     [containerAll, containerKill].forEach((c) => (c.textContent = "Ошибка отображения данных"));
//   }
// }

// // Улучшенное создание элемента
// function createElement(item, index, type) {
//   const element = document.createElement("div");
//   element.className = "item";
//   element.textContent = item?.name || item?.title || JSON.stringify(item) || "Пустой элемент";
//   element.onclick = () => moveItem(index, type);
//   return element;
// }

// // Перемещение элемента
// function moveItem(index, sourceType) {
//   try {
//     if (!Array.isArray(testManipulate[sourceType])) throw new Error(`Неверная структура ${sourceType}`);
//     const targetType = sourceType === "all" ? "kill" : "all";
//     testManipulate[targetType].push(...testManipulate[sourceType].splice(index, 1));
//     renderData();
//   } catch (error) {
//     console.error("Ошибка перемещения элемента:", error);
//   }
// }
