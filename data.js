const mainMenu = document.createElement("div");
mainMenu.classList.add("mainMenu");

const btnToggle = document.createElement("div");
btnToggle.classList.add("btn-toggle");
const dropMenu = document.createElement("div");
dropMenu.classList.add("dropMenu");

const noneDrop = document.createElement("span");
noneDrop.textContent = "Дроп отсутствует";
dropMenu.append(noneDrop);

const menuButtons = [
  {
    icon: "fa-light icons-fight",
    text: "Атака",
    onClick: () => {
      locationSearch();
      startBot();
      toggleConfirmInterceptor(true);
    },
  },
  {
    icon: "fa-light icons-heal",
    text: "Хил",
    onClick: () => {
      locationSearch();
      moveHeal();
    },
  },
  {
    icon: "fa-light icons-stop",
    text: "Стоп",
    onClick: () => {
      stopBot();
      toggleConfirmInterceptor(false);
    },
  },
  {
    icon: "fa-light icons-gear",
    text: "Бои",
    onClick: () => {
      menuFightTest.open();
    },
  },
  {
    icon: "fa-light icons-ball",
    text: "Монстры",
    onClick: () => {
      const controllerTableModal = new ModalMenu({
        text: "Монстры",
      });
      controllerTableModal.content.appendChild(controllerTable.table);
      controllerTableModal.open();
    },
  },
  {
    icon: "fa-light icons-update",
    text: "Обновить",
    onClick: () => fetchData(),
  },
  {
    icon: "fa-light icons-cloud",
    text: "Погода",
    onClick: () => menuWeather.open(),
  },
  {
    icon: "fa-light icons-lvlUP",
    text: "Прокачка",
    onClick: () => {
      menuUp.open();
    },
  },
  {
    icon: "fa-light icons-spider",
    text: "Ловля",
    onClick: () => menuCatch.open(),
  },
  {
    icon: "fa-light icons-bars",
    text: "Остальное",
    onClick: () => menuAdditionally.open(),
  },

  // {
  //   icon: "fa-light icons-questionTens",
  //   text: "Угадайка",
  //   onClick: () => HappyBirthday(),
  // },
  // {
  //   icon: "fa-light icons-coins",
  //   text: "Спекулянт",
  //   onClick: () => speculator(),
  // },
  {
    icon: "fa-light icons-list-drop",
    text: "Дроп",
    onClick: () => dropMenu.classList.toggle("active"),
  },
  // {
  //   text: "Возврат монстров(тест)",
  //   onClick: () => {
  //     backMonsterAll();
  //   },
  // },

  {
    text: "Манеж",
    onClick: () => {
      deleteManech();
    },
  },
  // {
  //   text: "Тест",
  //   onClick: () => {
  //     locationSearch();
  //   },
  // },
];

const menuFightTest = new ModalMenu({
  text: "Настройка боя",
  items: [
    {
      text: "Выбор атаки",
      onClick: () => {
        menuVariableAttack.open();
      },
    },
    {
      text: "Сменить/Добить монстра",
      onClick: () => {
        menuSwitchMonster.open();
      },
    },

    {
      type: "checkbox",
      text: "Включить добивание",
      storageKey: "isLoseMonster",
      onChange: (value) => {
        isLoseMonster = value;
      },
    },
    {
      type: "checkbox",
      text: "Если PP 0 стоп",
      storageKey: "ppStop",
      onChange: (value) => {
        ppStop = value;
      },
    },
  ],
});
const menuVariableAttack = new ModalMenu({
  text: "Выбор атаки",
  items: [
    {
      type: "radio",
      options: [
        { text: "Атака 1", value: "0" },
        { text: "Атака 2", value: "1" },
        { text: "Атака 3", value: "2" },
        { text: "Атака 4", value: "3" },
      ],
      groupOptions: {
        name: "variableAttack",
        storageKey: "variableAttack",
        onChange: (value) => {
          variableAttack = value;
        },
      },
    },
  ],
});
const menuSwitchMonster = new ModalMenu({
  text: "Сменить монстра",
  items: [
    {
      type: "input",
      placeholder: "Введите имя",
      storageKey: "nameSwitchMonster",
      onChange: (value) => {
        nameSwitchMonster = value;
      },
    },
    {
      text: "Выбор атаки",
      onClick: () => {
        menuVariableAttackAfter.open();
      },
    },
  ],
});
const menuVariableAttackAfter = new ModalMenu({
  text: "Выбор атаки",
  items: [
    {
      type: "radio",
      options: [
        { text: "Атака 1", value: "0" },
        { text: "Атака 2", value: "1" },
        { text: "Атака 3", value: "2" },
        { text: "Атака 4", value: "3" },
      ],
      groupOptions: {
        name: "variableAttackAfter",
        storageKey: "variableAttackAfter",
        onChange: (value) => {
          variableAttackAfter = value;
        },
      },
    },
  ],
});

// Погода
const menuWeather = new ModalMenu({
  text: "Настройка погоды",
  items: [
    {
      type: "radio",
      options: [
        { text: "Град", value: "w3" },
        { text: "Песчаная буря", value: "w4" },
        { text: "Град/Песчаная буря", value: "w3,w4" },
      ],
      groupOptions: {
        name: "variableWeather",
        storageKey: "variableWeather",
        onChange: (value) => {
          variableWeather = value;
        },
      },
    },
    {
      type: "checkbox",
      text: "Включить ограничение погоды",
      storageKey: "weatherLimit",
      onChange: (value) => {
        weatherLimit = value;
      },
    },
  ],
});
// Ловли
const menuCatch = new ModalMenu({
  text: "Настройка ловли",
  items: [
    {
      type: "radio",
      options: [
        { text: "Мальчик", value: "Мальчик" },
        { text: "Девочка", value: "Девочка" },
        { text: "Все", value: "Все" },
      ],
      groupOptions: {
        name: "variableGender",
        storageKey: "variableGender",
        onChange: (value) => {
          variableGender = value;
        },
      },
    },
    {
      text: "Выбор статуса",
      onClick: () => menuStatus.open(),
    },
    { text: "Выбор монстроболла", onClick: () => menuMonsterBall.open() },
  ],
});
const menuStatus = new ModalMenu({
  text: "Выбор статуса",
  items: [
    {
      type: "radio",
      options: [
        { text: "Колыбельная", value: "Колыбельная" },
        { text: "Споры", value: "Споры" },
        { text: "Парализующая пыльца", value: "Парализующая пыльца" },
        { text: "Насмешка", value: "Насмешка" },
      ],
      groupOptions: {
        name: "variableStatus",
        storageKey: "variableStatus",
        onChange: (value) => {
          variableStatus = value;
        },
      },
    },
  ],
});
const menuMonsterBall = new ModalMenu({
  text: "Выбор монстроболла",
  items: [
    {
      type: "radio",
      options: [
        { text: "Монстробол", value: "1" },
        { text: "Гритбол", value: "2" },
        { text: "Мастербол", value: "3" },
        { text: "Ультрабол", value: "4" },
        { text: "Даркбол", value: "13" },
        { text: "Супердаркбол", value: "18" },
        { text: "Браконьера", value: "30" },
        { text: "Люксбол", value: "5" },
        { text: "Френдбол", value: "7" },
        { text: "Лавбол", value: "9" },
        { text: "Фастбол", value: "6" },
        { text: "Трансбол", value: "16" },
        { text: "Нестбол", value: "12" },
        { text: "Багбол", value: "101" },
        { text: "Блэкбол", value: "102" },
        { text: "Электробол", value: "104" },
        { text: "Файтбол", value: "105" },
        { text: "Фаербол", value: "106" },
        { text: "Флайбол", value: "107" },
        { text: "Гостбол", value: "108" },
        { text: "Грасбол", value: "109" },
        { text: "Граундбол", value: "110" },
        { text: "Айсбол", value: "111" },
        { text: "Нормобол", value: "112" },
        { text: "Токсикбол", value: "113" },
        { text: "Псибол", value: "114" },
        { text: "Стоунбол", value: "115" },
        { text: "Стилбол", value: "116" },
        { text: "Дайвбол", value: "117" },
        { text: "Фейбол", value: "118" },
      ],
      groupOptions: {
        name: "variableMonsterBall",
        storageKey: "variableMonsterBall",
        onChange: (value) => {
          variableMonsterBall = value;
        },
      },
    },
  ],
});
// Настройка прокачки
const menuUp = new ModalMenu({
  text: "Настройка прокачки",
  items: [
    {
      type: "input",
      placeholder: "Введите имя",
      storageKey: "nameUpMonster",
      onChange: (value) => {
        nameUpMonster = value;
        setLocalStorageValue("nameUpMonster", value);
      },
    },
    {
      type: "radio",
      options: [
        { text: "Замедленная бомба", value: "Замедленная бомба" },
        { text: "Крик банши", value: "Крик банши" },
      ],
      groupOptions: {
        name: "variableAttackUP",
        storageKey: "variableAttackUP",
        onChange: (value) => {
          variableAttackUP = value;
        },
      },
    },
    {
      type: "checkbox",
      text: "Включить прокачку",
      storageKey: "levelingUP",
      onChange: (value) => {
        levelingUP = value;
      },
    },
  ],
});
//  Ограничение монстров
const menuLimitMonster = new ModalMenu({
  text: "Ограничение монстров",
  items: [
    {
      type: "input",
      placeholder: "Количество монстров",
      storageKey: "countMonsterLimit",
      onChange: (value) => {
        countMonsterLimit = value;
        setLocalStorageValue("countMonsterLimit", value);
      },
    },
    {
      type: "checkbox",
      text: "Включить ограничение монстров",
      storageKey: "isMonsterLimit",
      onChange: (value) => {
        isMonsterLimit = value;
      },
    },
  ],
});
//  Дополнительно
const menuAdditionally = new ModalMenu({
  text: "Дополнительно",
  items: [
    {
      text: "Ограничение монстров",
      onClick: () => {
        menuLimitMonster.open();
      },
    },
  ],
});

const menuButton = new Button(menuButtons);
menuButton.buttons.forEach((btn) => {
  mainMenu.append(btn.el);
});
mainMenu.append(dropMenu);
btnToggle.addEventListener("click", () => {
  mainMenu.classList.toggle("open");
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ModalMenu.stack.length > 0) {
    const lastModal = ModalMenu.stack[ModalMenu.stack.length - 1];
    lastModal.close();
    controllerTable.closeMenu();
  }
});

document.body.append(btnToggle, mainMenu);
// menuButton.buttons.forEach((btn) => document.body.append(btn.el));


