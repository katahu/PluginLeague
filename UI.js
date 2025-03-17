const dropMenu = document.createElement("div");
dropMenu.classList.add("drop-menu");
document.body.appendChild(dropMenu);

const btnToggle = document.createElement("div");
btnToggle.classList.add("btn-toggle");
document.body.appendChild(btnToggle);

const menuContainer = document.createElement("div");
menuContainer.classList.add("menuContainer");
document.body.append(menuContainer);

const mainMenu = document.createElement("div");
mainMenu.classList.add("main-menu");
menuContainer.append(mainMenu);

const backdrop = document.createElement("div");
backdrop.classList.add("backdrop");
menuContainer.append(backdrop);

btnToggle.addEventListener("click", () => {
  const isActive = mainMenu.classList.toggle("active");
  backdrop.classList.toggle("active", isActive);
});

backdrop.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  backdrop.classList.remove("active");
});

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

const menu = [
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
      settingMenu.classList.toggle("active");
    },
  },
  {
    icon: "fa-light icons-list-drop",
    text: "Дроп",
    onClick: () => {
      dropMenu.classList.toggle("active");
    },
  },
];

menu.forEach((item) => {
  const button = Button(item);
  mainMenu.appendChild(button);
});
