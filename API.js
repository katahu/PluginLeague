let routeAttack = {};
let routeHeal = {};
let userHeal = {};
let nameSwitch = "";
let nameUpMonster = getLocalStorageValue("nameUpMonster", "");
let attackUp = getLocalStorageValue("attackUp", "");
let variableCatch = getLocalStorageValue("varibleCatch", "");
let varibleBall = getLocalStorageValue("varibleBall", "");
let statusAttack = getLocalStorageValue("statusAttack", "");
let weather = getLocalStorageValue("weather", false);
let imgSemant = [];
let test = new Map();
let userTest = new Map();

async function fetchData() {
  try {
    const attackResponse = await fetch("https://65f9a7ef3909a9a65b190bd2.mockapi.io/attack");
    if (!attackResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для атаки: ${attackResponse.status}`);
    }
    const attackData = await attackResponse.json();

    const { nameSwitch, imgSemant } = attackData[0];
    Object.assign(routeAttack, attackData[0]);

    console.log("Локации и мобы успешно загружены:", routeAttack);

    const healResponse = await fetch("https://65f9a7ef3909a9a65b190bd2.mockapi.io/heal");
    if (!healResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для лечения: ${healResponse.status}`);
    }
    const healData = await healResponse.json();

    Object.assign(routeHeal, healData[0]);
    routeHeal = healData[0];

    const userHealResponse = await fetch("https://dce6373a41a58485.mokky.dev/vip");
    if (!userHealResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для лечения: ${userHealResponse.status}`);
    }
    const userHealData = await userHealResponse.json();

    Object.assign(userHeal, userHealData[0]);
    userHeal = userHealData[0];
    console.log("Пользовательский маршрут загружен", userHeal);
    console.log("Маршрут для лечения успешно загружены", routeHeal);
    const testResponse = await fetch("https://dce6373a41a58485.mokky.dev/test");
    if (!testResponse.ok) throw new Error(`HTTP error! status: ${testResponse.status}`);

    const testData = await testResponse.json();
    test = testData[0];
    console.log("Тестовые данные успешно загружены:", test);

    const testUserResponse = await fetch("https://dce6373a41a58485.mokky.dev/userTest");
    if (!testUserResponse.ok) throw new Error(`HTTP error! status: ${testUserResponse.status}`);

    const testUserData = await testUserResponse.json();
    userTest = testUserData[0];
    console.log("Пользовательские данные успешно загружены:", userTest);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}
fetchData();

function getLocalStorageValue(key, defaultValue) {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Ошибка парсинга JSON для ключа "${key}":`, error);
    return defaultValue;
  }
}

function setLocalStorageValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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
