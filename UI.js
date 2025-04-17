// const btnToggle = document.createElement("div");
// btnToggle.classList.add("btn-toggle");

// const menuContainer = document.createElement("div");
// menuContainer.classList.add("menuContainer");

// const mainMenu = document.createElement("div");
// mainMenu.classList.add("mainMenu");
// menuContainer.append(mainMenu);

// const dropMenu = document.createElement("div");
// dropMenu.classList.add("dropMenu");

// const noneDrop = document.createElement("span");
// noneDrop.textContent = "Дроп отсутствует";
// dropMenu.append(noneDrop);

// const backdrop = document.createElement("div");
// backdrop.classList.add("backdrop");

// document.body.append(btnToggle, menuContainer, backdrop);

// function CreateMenu(option) {
//   const { header, classList, buttonArray } = option;

//   const el = document.createElement("div");
//   el.classList.add(...classList.split(" "));
//   if (header) {
//     const headerEl = document.createElement("div");
//     headerEl.classList.add("modal-header");
//     headerEl.textContent = header;
//     el.append(headerEl);
//   }
//   if (buttonArray) {
//     buttonArray.forEach((item) => {
//       const button = Modal(item);
//       el.append(button);
//     });
//   }

//   return el;
// }
// function Button(option) {
//   const { icon, text, regularText, checkbox, localStorageKey, onClick } = option;

//   const el = document.createElement("div");
//   el.classList.add("menuItem");
//   if (text || regularText) {
//     if (text) {
//       el.textContent = text;
//     }
//     if (regularText) {
//       el.innerHTML = regularText;
//     }
//   }

//   if (icon) {
//     const i = document.createElement("i");
//     i.classList.add(...icon.split(" "));
//     el.prepend(i);
//   }

//   if (checkbox) {
//     const label = document.createElement("label");
//     label.classList.add("toggle");
//     const input = document.createElement("input");
//     input.type = "checkbox";
//     input.checked = getLocalStorageValue(localStorageKey, option.defaultValue ?? false);

//     const slider = document.createElement("span");
//     slider.classList.add("slider");
//     label.append(input, slider);
//     el.append(label);

//     input.addEventListener("change", (e) => {
//       localStorage.setItem(localStorageKey, JSON.stringify(e.target.checked));
//       if (option.onClick) option.onClick(e);
//     });
//   }

//   if (onClick) {
//     el.addEventListener("click", (e) => {
//       e.stopPropagation();
//       const checkbox = el.querySelector('input[type="checkbox"]');
//       if (checkbox) {
//         checkbox.checked = !checkbox.checked;
//       }
//       onClick(e);
//     });
//   }

//   return el;
// }
// function Modal(option) {
//   const { text, value, name, storageKey, onClick } = option;

//   const el = document.createElement("label");
//   el.classList.add("Radio");

//   const input = document.createElement("input");
//   input.type = "radio";
//   input.value = value;
//   input.name = name;

//   const storedValue = getLocalStorageValue(storageKey, "");
//   if (storedValue === value) {
//     input.checked = true;
//   }

//   input.addEventListener("click", () => {
//     setLocalStorageValue(storageKey, value);
//     if (onClick) onClick();
//   });

//   const radio = document.createElement("div");
//   radio.classList.add("Radio-main");

//   if (text) {
//     const span = document.createElement("span");
//     span.classList.add("label");
//     span.textContent = text;
//     radio.appendChild(span);
//   }
//   el.append(input, radio);

//   return el;
// }
// function allButton(options) {
//   const { classList, text, storage, onClick, input, placeholder, value } = options;

//   const el = document.createElement("div");
//   if (classList) {
//     el.classList.add(...classList.split(" "));
//   }

//   if (text) el.textContent = text;

//   if (input) {
//     let inputEl = document.createElement("input");
//     inputEl.type = "text";
//     inputEl.placeholder = placeholder || "";
//     inputEl.value = value || "";
//     el.append(inputEl);

//     if (storage) {
//       inputEl.addEventListener("change", (e) => {
//         setLocalStorageValue(storage, e.target.value);
//       });
//     }
//   }

//   if (onClick) {
//     el.addEventListener("click", (e) => {
//       e.stopPropagation();
//       onClick(e);
//     });
//   } else if (storage && !input) {
//     el.addEventListener("click", (e) => {
//       e.stopPropagation();
//       setLocalStorageValue(storage, true);
//     });
//   }

//   return el;
// }
// const mainMenuItems = [
//   {
//     icon: "fa-light icons-fight",
//     text: "Атака",
//     onClick: () => {
//       locationSearch();
//       controller();
//       toggleConfirmInterceptor(true);
//     },
//   },
//   {
//     icon: "fa-light icons-heal",
//     text: "Хил",
//     onClick: () => {
//       locationSearch();
//       moveHeal();
//     },
//   },
//   {
//     icon: "fa-light icons-stop",
//     text: "Стоп",
//     onClick: () => {
//       stopBot();
//       toggleConfirmInterceptor(false);
//     },
//   },
//   {
//     icon: "fa-light icons-gear",
//     text: "Настройка",
//     onClick: () => {
//       menuFight.classList.toggle("active");
//     },
//   },

//   {
//     icon: "fa-light icons-update",
//     text: "Обновить",
//     onClick: () => fetchData(),
//   },
//   {
//     icon: "fa-light icons-cloud",
//     text: "Погода",
//     checkbox: true,
//     defaultValue: false,
//     localStorageKey: "weather",
//     onClick: () => {
//       weather = !weather;
//       localStorage.setItem("weather", JSON.stringify(weather));
//     },
//   },
//   {
//     icon: "fa-light icons-lvlUP",
//     text: "Прокачка",
//     onClick: () => {
//       upMenu.classList.toggle("active");
//     },
//   },
//   {
//     icon: "fa-light icons-spider",
//     text: "Поимка",
//     onClick: () => {
//       captureMenu.classList.toggle("active");
//     },
//   },
//   {
//     icon: "fa-light icons-list-drop",
//     text: "Дроп",
//     onClick: () => {
//       dropMenu.classList.toggle("active");
//     },
//   },
//   {
//     text: "Тест",
//     onClick: () => {
//       locationSearch();
//       switchMob();
//     },
//   },
// ];
// const menuModalUP = [
//   {
//     text: "Замедленная бомба",
//     name: "time",
//     value: "Замедленная бомба",
//     storageKey: "attackUp",
//     onClick: () => {
//       attackUp = "Замедленная бомба";
//     },
//   },
//   {
//     text: "Крик банши",
//     name: "time",
//     value: "Крик банши",
//     storageKey: "attackUp",
//     onClick: () => {
//       attackUp = "Крик банши";
//     },
//   },
// ];
// const menuModalStatus = [
//   {
//     text: "Колыбельная",
//     name: "statusAttack",
//     value: "Колыбельная",
//     storageKey: "statusAttack",
//     onClick: () => {
//       variableGender = "Колыбельная";
//     },
//   },
//   {
//     text: "Споры",
//     name: "statusAttack",
//     value: "Споры",
//     storageKey: "statusAttack",
//     onClick: () => {
//       variableGender = "Споры";
//     },
//   },
//   {
//     text: "Насмешка",
//     name: "statusAttack",
//     value: "Насмешка",
//     storageKey: "statusAttack",
//     onClick: () => {
//       variableGender = "Насмешка";
//     },
//   },
// ];
// const menuModalCapture = [
//   {
//     text: "Мальчик",
//     name: "catch",
//     value: "male",
//     storageKey: "variableGender",
//     onClick: () => {
//       variableGender = "male";
//     },
//   },
//   {
//     text: "Девочка",
//     name: "catch",
//     value: "female",
//     storageKey: "variableGender",
//     onClick: () => {
//       variableGender = "female";
//     },
//   },
//   {
//     text: "Все",
//     name: "catch",
//     value: "all",
//     storageKey: "variableGender",
//     onClick: () => {
//       variableGender = "all";
//     },
//   },
// ];
// const menuModalBall = [
//   {
//     text: "Монстробол",
//     name: "ball",
//     value: "1",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "1";
//     },
//   },
//   {
//     text: "Гритбол",
//     name: "ball",
//     value: "2",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "2";
//     },
//   },
//   {
//     text: "Мастербол",
//     name: "ball",
//     value: "3",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "3";
//     },
//   },
//   {
//     text: "Ультрабол",
//     name: "ball",
//     value: "4",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "4";
//     },
//   },
//   {
//     text: "Даркбол",
//     name: "ball",
//     value: "13",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "13";
//     },
//   },
//   {
//     text: "Супердаркбол",
//     name: "ball",
//     value: "18",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "18";
//     },
//   },
//   {
//     text: "Браконьера",
//     name: "ball",
//     value: "30",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "30";
//     },
//   },
//   {
//     text: "Люксбол",
//     name: "ball",
//     value: "5",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "5";
//     },
//   },
//   {
//     text: "Френдбол",
//     name: "ball",
//     value: "7",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "7";
//     },
//   },
//   {
//     text: "Лавбол",
//     name: "ball",
//     value: "9",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "9";
//     },
//   },
//   {
//     text: "Фастбол",
//     name: "ball",
//     value: "6",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "6";
//     },
//   },
//   {
//     text: "Трансбол",
//     name: "ball",
//     value: "16",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "16";
//     },
//   },
//   {
//     text: "Нестбол",
//     name: "ball",
//     value: "12",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "12";
//     },
//   },
//   {
//     text: "Багбол",
//     name: "ball",
//     value: "101",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "101";
//     },
//   },
//   {
//     text: "Блэкбол",
//     name: "ball",
//     value: "102",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "102";
//     },
//   },
//   {
//     text: "Электробол",
//     name: "ball",
//     value: "104",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "104";
//     },
//   },
//   {
//     text: "Файтбол",
//     name: "ball",
//     value: "105",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "105";
//     },
//   },
//   {
//     text: "Фаербол",
//     name: "ball",
//     value: "106",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "106";
//     },
//   },
//   {
//     text: "Флайбол",
//     name: "ball",
//     value: "107",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "107";
//     },
//   },
//   {
//     text: "Гостбол",
//     name: "ball",
//     value: "108",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "108";
//     },
//   },
//   {
//     text: "Грасбол",
//     name: "ball",
//     value: "109",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "109";
//     },
//   },
//   {
//     text: "Граундбол",
//     name: "ball",
//     value: "110",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "110";
//     },
//   },
//   {
//     text: "Айсбол",
//     name: "ball",
//     value: "111",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "111";
//     },
//   },
//   {
//     text: "Нормобол",
//     name: "ball",
//     value: "112",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "112";
//     },
//   },
//   {
//     text: "Токсикбол",
//     name: "ball",
//     value: "113",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "113";
//     },
//   },
//   {
//     text: "Псибол",
//     name: "ball",
//     value: "114",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "114";
//     },
//   },
//   {
//     text: "Стоунбол",
//     name: "ball",
//     value: "115",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "115";
//     },
//   },
//   {
//     text: "Стилбол",
//     name: "ball",
//     value: "116",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "116";
//     },
//   },
//   {
//     text: "Дайвбол",
//     name: "ball",
//     value: "117",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "117";
//     },
//   },
//   {
//     text: "Фейбол",
//     name: "ball",
//     value: "118",
//     storageKey: "variableBall",
//     onClick: () => {
//       variableBall = "118";
//     },
//   },
// ];
// const menuModalAttack = [
//   {
//     text: "Атака 1",
//     name: "attack",
//     value: "0",
//     storageKey: "attackNumber",
//     onClick: () => {
//       attackNumber = 0;
//       console.log(attackNumber);
//     },
//   },
//   {
//     text: "Атака 2",
//     name: "attack",
//     value: "1",
//     storageKey: "attackNumber",
//     onClick: () => {
//       attackNumber = 1;
//       console.log(attackNumber);
//     },
//   },
//   {
//     text: "Атака 3",
//     name: "attack",
//     value: "2",
//     storageKey: "attackNumber",
//     onClick: () => {
//       attackNumber = 2;
//       console.log(attackNumber);
//     },
//   },
//   {
//     text: "Атака 4",
//     name: "attack",
//     value: "3",
//     storageKey: "attackNumber",
//     onClick: () => {
//       attackNumber = 3;
//       console.log(attackNumber);
//     },
//   },
// ];
// const menuModalAfterAttack = [
//   {
//     text: "Атака 1",
//     name: "attackAfter",
//     value: "0",
//     storageKey: "attackNumberAfter",
//     onClick: () => {
//       attackNumberAfter = 0;
//       console.log(attackNumberAfter);
//     },
//   },
//   {
//     text: "Атака 2",
//     name: "attackAfter",
//     value: "1",
//     storageKey: "attackNumberAfter",
//     onClick: () => {
//       attackNumberAfter = 1;
//       console.log(attackNumberAfter);
//     },
//   },
//   {
//     text: "Атака 3",
//     name: "attackAfter",
//     value: "2",
//     storageKey: "attackNumberAfter",
//     onClick: () => {
//       attackNumberAfter = 2;
//       console.log(attackNumberAfter);
//     },
//   },
//   {
//     text: "Атака 4",
//     name: "attackAfter",
//     value: "3",
//     storageKey: "attackNumberAfter",
//     onClick: () => {
//       attackNumberAfter = 3;
//       console.log(attackNumberAfter);
//     },
//   },
// ];
// //

// const statusMenu = CreateMenu({
//   header: "Статусы",
//   classList: "menuBot menuStatus",
//   buttonArray: menuModalStatus,
// });
// const menuFight = CreateMenu({
//   header: "Настройка боев",
//   classList: "menuBot menuSP",
// });
// const attackMenu = CreateMenu({
//   header: "Атаки",
//   classList: "menuBot menuStatus",
//   buttonArray: menuModalAttack,
// });
// const monsterMenu = CreateMenu({
//   header: "Смена монстра",
//   classList: "menuBot menuStatus",
// });
// const afterAttackMenu = CreateMenu({
//   header: "Атаки",
//   classList: "menuBot menuStatus",
//   buttonArray: menuModalAfterAttack,
// });
// const captureMenu = CreateMenu({
//   header: "Настройка поимки",
//   classList: "menuBot menuSP",
//   buttonArray: menuModalCapture,
// });

// const upMenu = CreateMenu({
//   header: "Настройка прокачки",
//   classList: "menuBot menuSP",
//   buttonArray: menuModalUP,
// });

// const ballMenu = CreateMenu({
//   header: "Монстоболлы",
//   classList: "menuBot menuBall",
//   buttonArray: menuModalBall,
// });
// //

// const inputUP = allButton({
//   classLisst: "inputUP",
//   input: true,
//   storage: "nameUpMonster",
//   placeholder: "Введите имя монстра",
//   value: nameUpMonster,
// });
// const openBallMenuButton = allButton({
//   classList: "btnMenuOpen",
//   text: "Выбор монстроболла",
//   onClick: () => {
//     ballMenu.classList.toggle("active");
//   },
// });
// const openStatusMenuButton = allButton({
//   classList: "btnMenuOpen",
//   text: "Выбор статуса",
//   onClick: () => {
//     statusMenu.classList.toggle("active");
//   },
// });
// const openAttackMenuButton = allButton({
//   classList: "btnMenuOpen",
//   text: "Выбор атаки",
//   onClick: () => {
//     attackMenu.classList.toggle("active");
//   },
// });
// const afterOpenAttackMenuButton = allButton({
//   classList: "btnMenuOpen",
//   text: "Выбор атаки",
//   onClick: () => {
//     afterAttackMenu.classList.toggle("active");
//   },
// });
// const openMonsterMenuButton = allButton({
//   classList: "btnMenuOpen",
//   text: "Сменить монстра",
//   onClick: () => {
//     monsterMenu.classList.toggle("active");
//   },
// });
// const monsterNameInput = allButton({
//   classList: "monsterNameInput",
//   input: true,
//   storage: "switchMonster",
//   placeholder: "На кого сменить",
//   value: getLocalStorageValue("switchMonster", ""),
// });

// //

// upMenu.append(inputUP);
// captureMenu.append(openStatusMenuButton, openBallMenuButton, ballMenu, statusMenu);
// monsterMenu.append(monsterNameInput, afterOpenAttackMenuButton, afterAttackMenu);
// menuFight.append(openAttackMenuButton, openMonsterMenuButton, attackMenu, monsterMenu);

// mainMenuItems.forEach((item) => {
//   const button = Button(item);
//   mainMenu.append(button, dropMenu, menuFight, upMenu, captureMenu);
// });

// btnToggle.addEventListener("click", () => {
//   const isActive = mainMenu.classList.toggle("active");
//   backdrop.classList.toggle("active", isActive);
// });

// backdrop.addEventListener("click", () => {
//   mainMenu.classList.remove("active");
//   menuFight.classList.remove("active");
//   attackMenu.classList.remove("active");
//   afterAttackMenu.classList.remove("active");
//   monsterMenu.classList.remove("active");
//   backdrop.classList.remove("active");
//   upMenu.classList.remove("active");
//   statusMenu.classList.remove("active");
//   ballMenu.classList.remove("active");
//   captureMenu.classList.remove("active");
// });
