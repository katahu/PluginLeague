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

const upMenu = document.createElement("div");
upMenu.classList.add("menuBot", "menuSP");

const catchMenu = document.createElement("div");
catchMenu.classList.add("menuBot", "menuSP");

const varBall = document.createElement("div");
varBall.classList.add("menuBot", "bottom-right");

const varibleBallBTN = document.createElement("div");
varibleBallBTN.textContent = "Выбор монстроболла";
varibleBallBTN.classList.add("radioSpecial");
varibleBallBTN.addEventListener("click", () => {
  varBall.classList.toggle("active");
});
varibleBallBTN.append(varBall);

const backdrop = document.createElement("div");
backdrop.classList.add("backdrop");

document.body.append(btnToggle, menuContainer, backdrop);

const whoCapture = document.createElement("input");
whoCapture.type = "text";
whoCapture.value = whoToCapture;
whoCapture.placeholder = "Имя кем ловить";
whoCapture.addEventListener("input", (event) => {
  whoToCapture = event.target.value;
  setLocalStorageValue("whoToCapture", whoToCapture);
});

const inputUP = document.createElement("input");
inputUP.type = "text";
inputUP.value = upPockemon;
inputUP.placeholder = "Введите имя монстра";
inputUP.addEventListener("input", (event) => {
  upPockemon = event.target.value;
  setLocalStorageValue("upPockemon", upPockemon);
});

btnToggle.addEventListener("click", () => {
  const isActive = mainMenu.classList.toggle("active");
  backdrop.classList.toggle("active", isActive);
});

backdrop.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  backdrop.classList.remove("active");
  upMenu.classList.remove("active");
  catchMenu.classList.remove("active");
});

//
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
      controller();
      toggleConfirmInterceptor(true);
    },
  },
  {
    icon: "fa-light icons-heal",
    text: "Хил",
    onClick: () => moveHeal(),
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
      captureMonstr();
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
    text: "Мастербол ",
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
    text: "Даркбол ",
    name: "ball",
    value: "13",
    storageKey: "varibleBall",
    onClick: () => {
      varibleBall = "13";
    },
  },
];
mainMenuItems.forEach((item) => {
  const button = Button(item);
  mainMenu.append(button, dropMenu, upMenu, catchMenu);
});
menuModalUP.forEach((item) => {
  const button = Modal(item);
  upMenu.append(button, inputUP);
});
menuModalCatch.forEach((item) => {
  const button = Modal(item);
  catchMenu.append(button, whoCapture, varibleBallBTN);
});

menuModalVaribleBall.forEach((item) => {
  const button = Modal(item);
  varBall.append(button);
});
