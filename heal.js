const divLoc = document.querySelector("#divLoc");
const divLocGo = divLoc.querySelector("#divLocGo");
const divLocNpc = divLoc.querySelector("#divLocNpc");
const delayHeal = () => new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));
let isHeal = false;
let noHeal = false;

async function moveHeal() {
  if (isHeal) return;
  isHeal = true;

  const route =
    userHeal[currentRegion]?.[currentLocation] ??
    userHeal[currentLocation] ??
    routeHeal[currentRegion]?.[currentLocation];

  if (!route) {
    console.error(`Маршрут для локации ${currentLocation} не найден.`);
    isHeal = false;
    return;
  }

  const isMobile = window.innerWidth <= 768;
  const btnSwitchWilds = document.querySelector(
    isMobile ? "#divDockUpper .btnSwitchWilds" : "#divInputButtons .btnSwitchWilds"
  );
  btnSwitchWilds.click();

  if (currentLocation === "Горный водопад") {
    const [pathToTarget, pathBack] = route;

    for (const buttonId of pathToTarget) {
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }

    await delayFast();
    await healNPC();
    await delayFast();

    for (const buttonId of pathBack) {
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }
  } else if (route[0]) {
    const path = route[0];

    for (let i = 1; i < path.length; i++) {
      const buttonId = path[i];
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }

    await delayFast();
    if (goSendMonst) await sendMonstr();
    await healNPC();
    await delayFast();

    for (let i = path.length - 2; i >= 0; i--) {
      const buttonId = path[i];
      const button = document.querySelector(`#${buttonId}`);
      if (button) {
        button.click();
        await controllerMutationMove();
        await delayHeal();
      } else {
        console.error(`Кнопка ${buttonId} не найдена.`);
        isHeal = false;
        return;
      }
    }
  }

  await delayHeal();
  btnSwitchWilds.click();
  isHeal = false;
}

async function healNPC() {
  const divElements = document.querySelector(".divElements");
  const btnLocHeal = divLocNpc.querySelector(".btnLocHeal").click();
  await controllerMutatioNPC(divElements);
  if (!noHeal) {
    const btnHeal = divElements.querySelector(".menuHealAll").click();
  }
}

function controllerMutatioNPC(targetNode) {
  return new Promise((resolve) => {
    let styleChanged = false;
    let nodesAdded = false;

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          nodesAdded = true;
        }
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          styleChanged = true;
        }
      }
      if (nodesAdded && styleChanged) {
        noHeal = false;
      } else if (styleChanged) {
        noHeal = true;
      }
      observer.disconnect();
      resolve();
    });

    observer.observe(targetNode, {
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
}

// Контроллер для перемещения
function controllerMutationMove() {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(divLocGo, { childList: true });
  });
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
//       "о.Селен": {
//           "Безлюдная дорога": {
//               "mob": {
//                   "craft": [
//                       "Мотль"
//                   ],
//                   "attackTwo": [
//                       "Вупс"
//                   ],
//                   "attackThree": [
//                       ""
//                   ],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Волек",
//                       "Москилл",
//                       "Орлин"
//                   ]
//               },
//               "attack": {
//                   "craft": "Бур",
//                   "attackTwo": "Слэм",
//                   "attackThree": ""
//               }
//           },
//           "Дорога №3": {
//               "mob": {
//                   "craft": [
//                       "Мотль"
//                   ],
//                   "attackTwo": [
//                       "Световол"
//                   ],
//                   "attackThree": [
//                       ""
//                   ],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Волек",
//                       "Орли",
//                       "Лалабир",
//                       "Лалабибер",
//                       "Стинни",
//                       "Айлур"
//                   ]
//               },
//               "attack": {
//                   "craft": "Бур",
//                   "attackTwo": "Рассекающий ветер",
//                   "attackThree": ""
//               }
//           },
//           "Пасека": {
//               "mob": {
//                   "craft": [
//                       "Буллитум"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [
//                       "Астрания"
//                   ],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Хани",
//                       "Москилл",
//                       "Дендино",
//                       "Мандракас",
//                       "Джуснель",
//                       "Хани",
//                       "Роялони"
//                   ]
//               },
//               "attack": {
//                   "craft": "Родниковая вода",
//                   "attackTwo": "Лобовая атака",
//                   "attackThree": "Режущий ветер"
//               }
//           },
//           "Лес вокруг воздушного стадиона": {
//               "mob": {
//                   "craft": [
//                       "Редлик",
//                       "Дирбаг",
//                       "Грути",
//                       "Листотел"
//                   ],
//                   "attackTwo": [
//                       "Мотль"
//                   ],
//                   "attackThree": [
//                       "Агроспор"
//                   ],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Вьюнудль",
//                       "Лутка",
//                       "Булли",
//                       "Ополоз",
//                       "Пискун",
//                       "Орли"
//                   ]
//               },
//               "attack": {
//                   "craft": "Ярость",
//                   "attackTwo": "Бур",
//                   "attackThree": "Вышибала"
//               }
//           },
//           "Полицейский участок": {
//               "mob": {
//                   "craft": [],
//                   "attackTwo": [],
//                   "attackThree": [
//                       ""
//                   ],
//                   "upPokemon": [
//                       "Лознудль",
//                       "Наклес",
//                       "Фемидон"
//                   ],
//                   "defeat": [
//                       "Шадо-Топ"
//                   ]
//               },
//               "attack": {
//                   "craft": "Водный хвост",
//                   "attackTwo": "Вышибала",
//                   "attackThree": ""
//               }
//           },
//           "Маршрут 16": {
//               "mob": {
//                   "craft": [
//                       "Вупс"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "capture": [],
//                   "defeat": [
//                       "Гюрзар",
//                       "Яркокрыл",
//                       "Орли",
//                       "Пискун"
//                   ]
//               },
//               "attack": {
//                   "craft": "Тонкие иглы",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Перевал": {
//               "mob": {
//                   "craft": [
//                       "Рахнус"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": []
//               },
//               "attack": {
//                   "craft": "Сверлящий клюв",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Старая дорога": {
//               "mob": {
//                   "craft": [
//                       "Слизень"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Редлик",
//                       "Бонозавр"
//                   ]
//               },
//               "attack": {
//                   "craft": "Удар клювом",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Пещера Потатов": {
//               "mob": {
//                   "craft": [
//                       "Потат"
//                   ],
//                   "attackTwo": [
//                       "Потатат"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": []
//               },
//               "attack": {
//                   "craft": "Перекоп",
//                   "attackTwo": "Удар исподтишка",
//                   "attackThree": ""
//               }
//           },
//           "Горный тоннель": {
//               "mob": {
//                   "craft": [],
//                   "attackTwo": [
//                       "Крыскун",
//                       "Аспер",
//                       "Месьер",
//                       "Битав",
//                       "Ферон",
//                       "Потат"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": []
//               },
//               "attack": {
//                   "craft": "Воздушная грация",
//                   "attackTwo": "Когти",
//                   "attackThree": "Дрожь земли"
//               }
//           },
//           "Уровень": {
//               "mob": {
//                   "craft": [
//                       "Пустыномот",
//                       "Булавор",
//                       "Ленсирон",
//                       "Эверестор",
//                       ""
//                   ],
//                   "attackTwo": [
//                       "Полидрон",
//                       "Колокойн"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": []
//               },
//               "attack": {
//                   "craft": "Энергетический шар",
//                   "attackTwo": "Шар тьмы",
//                   "attackThree": ""
//               }
//           },
//           "Зона сафари": {
//               "mob": {
//                   "craft": [
//                       "Орланор",
//                       "Флегон",
//                       "Эфарол",
//                       "Драконор",
//                       "Чихон"
//                   ],
//                   "attackTwo": [
//                       "Саностридж",
//                       "Москилл",
//                       "Шмелевик",
//                       "Мантедж",
//                       "Пескомот"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Сазам",
//                       "Архолем"
//                   ]
//               },
//               "attack": {
//                   "craft": "Телекинез",
//                   "attackTwo": "Скрытая сила",
//                   "attackThree": ""
//               }
//           },
//           "Глухой колючий лес": {
//               "mob": {
//                   "craft": [
//                       "Фоуль"
//                   ],
//                   "attackTwo": [
//                       "Трухля"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Пискун",
//                       "Лайкун"
//                   ]
//               },
//               "attack": {
//                   "craft": "Вакуумная волна",
//                   "attackTwo": "Икс-Ножницы",
//                   "attackThree": ""
//               }
//           },
//           "Старый коллектор": {
//               "mob": {
//                   "craft": [
//                       "Месьер"
//                   ],
//                   "attackTwo": [
//                       "Лутер",
//                       "Заммлер"
//                   ],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Орли",
//                       "Крыскун",
//                       "Пантир"
//                   ]
//               },
//               "attack": {
//                   "craft": "Обломок скалы",
//                   "attackTwo": "Ледяные копья",
//                   "attackThree": ""
//               }
//           },
//           "Электростанция": {
//               "mob": {
//                   "craft": [
//                       "Октаселл"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Дуоселл",
//                       "Люминьон",
//                       "Грязень"
//                   ]
//               },
//               "attack": {
//                   "craft": "Когти",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Библиотека": {
//               "mob": {
//                   "craft": [],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Пискун",
//                       "Крыскун",
//                       "Джипсон",
//                       "Мукун"
//                   ],
//                   "semant": [
//                       "Семант"
//                   ]
//               },
//               "attack": {
//                   "craft": "",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Лес Селена": {
//               "mob": {
//                   "craft": [
//                       "Фоуль"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": [
//                       "Орли",
//                       "Редлик",
//                       "Сивун"
//                   ]
//               },
//               "attack": {
//                   "craft": "Тонкие иглы",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           },
//           "Крутой подъём": {
//               "mob": {
//                   "craft": [
//                       "Феронт"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "capture": [],
//                   "defeat": [
//                       "Скуллозавр",
//                       "Бонозавр"
//                   ]
//               },
//               "attack": {
//                   "craft": "Когти",
//                   "attackTwo": "",
//                   "attackThree": ""
//               }
//           }
//       },
//       "Восточный Джото": {
//           "Дорога №2": {
//               "mob": {
//                   "craft": [
//                       "Эфон",
//                       "Клуббиш",
//                       "Дроздор",
//                       "Астрания",
//                       "Вольтон"
//                   ],
//                   "attackTwo": [],
//                   "attackThree": [],
//                   "upPokemon": [],
//                   "defeat": []
//               },
//               "attack": {
//                   "craft": "Луч пузырей",
//                   "attackTwo": "Луч пузырей",
//                   "attackThree": "Сладкая пыльца"
//               }
//           }
//       }
//   }
// ]
