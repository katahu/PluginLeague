const dropMenu = document.createElement("div");
dropMenu.classList.add("drop-menu");
document.body.append(dropMenu);

const btnToggle = document.createElement("div");
btnToggle.classList.add("btn-toggle");
document.body.appendChild(btnToggle);

const btnMenu = document.createElement("div");
btnMenu.classList.add("btn-menu");
document.body.appendChild(btnMenu);

btnToggle.addEventListener("click", () => {
  btnMenu.classList.toggle("active");
});

function getLocalStorageValue(key, defaultValue) {
  const stored = localStorage.getItem(key);
  return stored !== null ? JSON.parse(stored) : defaultValue;
}
let weather = getLocalStorageValue("weather", false);

function Button(option) {
  const { icon, text, checkbox, localStorageKey, onClick } = option;

  const el = document.createElement("div");

  el.classList.add("btn-bot");
  if (text) {
    el.textContent = text;
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

    input.checked = getLocalStorageValue(option.localStorageKey, option.defaultValue ?? false);

    const slider = document.createElement("span");
    slider.classList.add("slider");
    label.append(input, slider);
    el.append(label);

    input.addEventListener("change", (e) => {
      localStorage.setItem(option.localStorageKey, JSON.stringify(e.target.checked));
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
    onClick: () => {
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
    onClick: () => {
      fetchAttack(), fetchHeal();
    },
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
    icon: "fa-light icons-list-drop",
    text: "Дроп",
    onClick: () => {
      dropMenu.classList.toggle("active");
    },
  },
];

menu.forEach((item) => {
  const button = Button(item);
  btnMenu.appendChild(button);
});
