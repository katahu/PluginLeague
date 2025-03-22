let routeAttack = {};
let routeHeal = {};
let userHeal = {};
let nameSwitch = "";
let upPockemon = getLocalStorageValue("upPockemon", "");
let attackUp = getLocalStorageValue("attackUp", "");
let variableCatch = getLocalStorageValue("varibleCatch", "");
let varibleBall = getLocalStorageValue("varibleBall", "");
let statusAttack = getLocalStorageValue("statusAttack", "");
let weather = getLocalStorageValue("weather", false);
let imgSemant = [];

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
  } catch (error) {
    console.error("Ошибка в загрузке:", error);
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
