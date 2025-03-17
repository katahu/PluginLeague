const settingMenu = document.createElement("div");
settingMenu.classList.add("setting-menu");
document.body.appendChild(settingMenu);

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

const modal = [
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

const inputUP = document.createElement("input");
inputUP.type = "text";
inputUP.value = upPockemon;
inputUP.placeholder = "Введите имя";
inputUP.addEventListener("input", (event) => {
  upPockemon = event.target.value;
  setLocalStorageValue("upPockemon", upPockemon);
});

modal.forEach((item) => {
  const button = Modal(item);
  settingMenu.append(button, inputUP);
});
