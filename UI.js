const btnToggle = document.createElement("div");
btnToggle.classList.add("btn-toggle");

const menuContainer = document.createElement("div");
menuContainer.classList.add("menuContainer");

const mainMenu = document.createElement("div");
mainMenu.classList.add("mainMenu");
menuContainer.append(mainMenu);

const dropMenu = document.createElement("div");
dropMenu.classList.add("dropMenu");

const noneDrop = document.createElement("span");
noneDrop.textContent = "Дроп отсутствует";
dropMenu.append(noneDrop);

const backdrop = document.createElement("div");
backdrop.classList.add("backdrop");

document.body.append(btnToggle, menuContainer, backdrop);

const inputUP = document.createElement("input");
inputUP.type = "text";
inputUP.value = upPockemon;
inputUP.placeholder = "Введите имя монстра";
inputUP.addEventListener("input", (event) => {
  upPockemon = event.target.value;
  setLocalStorageValue("upPockemon", upPockemon);
});
const varibleBallBTN = document.createElement("div");
varibleBallBTN.textContent = "Выбор монстроболла";
varibleBallBTN.classList.add("radioSpecial");
varibleBallBTN.addEventListener("click", (event) => {
  event.stopPropagation();
  varBall.classList.toggle("active");
});
const variblуStatusAttack = document.createElement("div");
variblуStatusAttack.textContent = "Статусная атака";
variblуStatusAttack.classList.add("radioSpecial");
variblуStatusAttack.addEventListener("click", (event) => {
  event.stopPropagation();
  varStatusAttack.classList.toggle("active");
});
btnToggle.addEventListener("click", () => {
  const isActive = mainMenu.classList.toggle("active");
  backdrop.classList.toggle("active", isActive);
});

//
function ButtonMenu(option) {
  const { header, classList, buttonArray } = option;

  const el = document.createElement("div");
  el.classList.add(...classList.split(" "));
  if (header) {
    const headerEl = document.createElement("div");
    headerEl.classList.add("modal-header");
    headerEl.textContent = header;
    el.append(headerEl);
  }

  buttonArray.forEach((item) => {
    const button = Modal(item);
    el.append(button);
  });

  return el;
}
function Button(option) {
  const { icon, text, regularText, checkbox, localStorageKey, onClick } = option;

  const el = document.createElement("div");
  el.classList.add("menuItem");
  if (text || regularText) {
    if (text) {
      el.textContent = text;
    }
    if (regularText) {
      el.innerHTML = regularText;
    }
  }

  if (icon) {
    const i = document.createElement("i");
    i.classList.add(...icon.split(" "));
    el.prepend(i);
  }

  if (checkbox) {
    const label = document.createElement("label");
    label.classList.add("toggle");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = getLocalStorageValue(localStorageKey, option.defaultValue ?? false);

    const slider = document.createElement("span");
    slider.classList.add("slider");
    label.append(input, slider);
    el.append(label);

    input.addEventListener("change", (e) => {
      localStorage.setItem(localStorageKey, JSON.stringify(e.target.checked));
      if (option.onClick) option.onClick(e);
    });
  }

  if (onClick) {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const checkbox = el.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      onClick(e);
    });
  }

  return el;
}
function Modal(option) {
  const { text, value, name, storageKey, onClick } = option;

  const el = document.createElement("label");
  el.classList.add("Radio");

  const input = document.createElement("input");
  input.type = "radio";
  input.value = value;
  input.name = name;

  const storedValue = getLocalStorageValue(storageKey, "");
  if (storedValue === value) {
    input.checked = true;
  }

  input.addEventListener("click", () => {
    setLocalStorageValue(storageKey, value);
    if (onClick) onClick();
  });

  const radio = document.createElement("div");
  radio.classList.add("Radio-main");

  if (text) {
    const span = document.createElement("span");
    span.classList.add("label");
    span.textContent = text;
    radio.appendChild(span);
  }
  el.append(input, radio);

  return el;
}
const mainMenuItems = [
  {
    icon: "fa-light icons-fight",
    text: "Атака",
    onClick: () => {
      locationSearch();
      controller();
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
    icon: "fa-light icons-update",
    text: "Обновить",
    onClick: () => fetchData(),
  },
  {
    icon: "fa-light icons-cloud",
    text: "Погода",
    checkbox: true,
    defaultValue: false,
    localStorageKey: "weather",
    onClick: () => {
      weather = !weather;
      localStorage.setItem("weather", JSON.stringify(weather));
    },
  },
  {
    icon: "fa-light icons-lvlUP",
    text: "Прокачка",
    onClick: () => {
      upMenu.classList.toggle("active");
    },
  },
  {
    icon: "fa-light icons-spider",
    text: "Поимка",
    onClick: () => {
      catchMenu.classList.toggle("active");
    },
  },
  {
    icon: "fa-light icons-list-drop",
    text: "Дроп",
    onClick: () => {
      dropMenu.classList.toggle("active");
    },
  },
  {
    text: "Тест",
    onClick: () => {
      sendMonstr();
    },
  },
];
const menuModalUP = [
  {
    text: "Замедленная бомба",
    name: "time",
    value: "Замедленная бомба",
    storageKey: "attackUp",
    onClick: () => {
      attackUp = "Замедленная бомба";
    },
  },
  {
    text: "Крик банши",
    name: "time",
    value: "Крик банши",
    storageKey: "attackUp",
    onClick: () => {
      attackUp = "Крик банши";
    },
  },
];
const modalStatusAttack = [
  {
    text: "Колыбельная",
    name: "statusAttack",
    value: "Колыбельная",
    storageKey: "statusAttack",
    onClick: () => {
      variableCatch = "Колыбельная";
    },
  },
  {
    text: "Споры",
    name: "statusAttack",
    value: "Споры",
    storageKey: "statusAttack",
    onClick: () => {
      variableCatch = "Споры";
    },
  },
  {
    text: "Насмешка",
    name: "statusAttack",
    value: "Насмешка",
    storageKey: "statusAttack",
    onClick: () => {
      variableCatch = "Насмешка";
    },
  },
];
const menuModalCatch = [
  {
    text: "Мальчик",
    name: "catch",
    value: "male",
    storageKey: "varibleCatch",
    onClick: () => {
      variableCatch = "male";
    },
  },
  {
    text: "Девочка",
    name: "catch",
    value: "female",
    storageKey: "varibleCatch",
    onClick: () => {
      variableCatch = "female";
    },
  },
  {
    text: "Все",
    name: "catch",
    value: "all",
    storageKey: "varibleCatch",
    onClick: () => {
      variableCatch = "all";
    },
  },
];

const menuModalVaribleBall = [
  {
    text: "Монстробол",
    name: "ball",
    value: "1",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "1";
    },
  },
  {
    text: "Гритбол",
    name: "ball",
    value: "2",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "2";
    },
  },
  {
    text: "Мастербол",
    name: "ball",
    value: "3",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "3";
    },
  },
  {
    text: "Ультрабол",
    name: "ball",
    value: "4",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "4";
    },
  },
  {
    text: "Даркбол",
    name: "ball",
    value: "13",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "13";
    },
  },
  {
    text: "Супердаркбол",
    name: "ball",
    value: "18",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "18";
    },
  },
  {
    text: "Браконьера",
    name: "ball",
    value: "30",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "30";
    },
  },
  {
    text: "Люксбол",
    name: "ball",
    value: "5",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "5";
    },
  },
  {
    text: "Френдбол",
    name: "ball",
    value: "7",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "7";
    },
  },
  {
    text: "Лавбол",
    name: "ball",
    value: "9",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "9";
    },
  },
  {
    text: "Фастбол",
    name: "ball",
    value: "6",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "6";
    },
  },
  {
    text: "Трансбол",
    name: "ball",
    value: "16",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "16";
    },
  },
  {
    text: "Нестбол",
    name: "ball",
    value: "12",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "12";
    },
  },
  {
    text: "Багбол",
    name: "ball",
    value: "101",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "101";
    },
  },
  {
    text: "Блэкбол",
    name: "ball",
    value: "102",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "102";
    },
  },
  {
    text: "Электробол",
    name: "ball",
    value: "104",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "104";
    },
  },
  {
    text: "Файтбол",
    name: "ball",
    value: "105",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "105";
    },
  },
  {
    text: "Фаербол",
    name: "ball",
    value: "106",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "106";
    },
  },
  {
    text: "Флайбол",
    name: "ball",
    value: "107",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "107";
    },
  },
  {
    text: "Гостбол",
    name: "ball",
    value: "108",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "108";
    },
  },
  {
    text: "Грасбол",
    name: "ball",
    value: "109",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "109";
    },
  },
  {
    text: "Граундбол",
    name: "ball",
    value: "110",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "110";
    },
  },
  {
    text: "Айсбол",
    name: "ball",
    value: "111",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "111";
    },
  },
  {
    text: "Нормобол",
    name: "ball",
    value: "112",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "112";
    },
  },
  {
    text: "Токсикбол",
    name: "ball",
    value: "113",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "113";
    },
  },
  {
    text: "Псибол",
    name: "ball",
    value: "114",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "114";
    },
  },
  {
    text: "Стоунбол",
    name: "ball",
    value: "115",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "115";
    },
  },
  {
    text: "Стилбол",
    name: "ball",
    value: "116",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "116";
    },
  },
  {
    text: "Дайвбол",
    name: "ball",
    value: "117",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "117";
    },
  },
  {
    text: "Фейбол",
    name: "ball",
    value: "118",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "118";
    },
  },
];

const catchMenu = ButtonMenu({
  header: "Настройка поимки",
  classList: "menuBot menuSP",
  buttonArray: menuModalCatch,
});

const upMenu = ButtonMenu({
  header: "Настройка прокачки",
  classList: "menuBot menuSP",
  buttonArray: menuModalUP,
});

const varBall = ButtonMenu({
  header: "Монстоболлы",
  classList: "menuBot menuBall",
  buttonArray: menuModalVaribleBall,
});

const varStatusAttack = ButtonMenu({
  header: "Статусы",
  classList: "menuBot menuStatus",
  buttonArray: modalStatusAttack,
});

upMenu.append(inputUP);
catchMenu.append(variblуStatusAttack, varibleBallBTN, varBall, varStatusAttack);

mainMenuItems.forEach((item) => {
  const button = Button(item);
  mainMenu.append(button, dropMenu, upMenu, catchMenu);
});

backdrop.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  backdrop.classList.remove("active");
  upMenu.classList.remove("active");
  varStatusAttack.classList.remove("active");
  varBall.classList.remove("active");
  catchMenu.classList.remove("active");
});
