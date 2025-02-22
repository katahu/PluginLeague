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

function Button(option) {
  const { icon, text, onClick } = option;

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
  if (onClick) {
    // исправлено с "onclick" на "onClick"
    el.addEventListener("click", (e) => {
      e.stopPropagation();
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
      playSound();
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
    icon: "fa-light icons-list-drop",
    text: "Дроп",
    onClick: () => {
      dropMenu.classList.toggle("active");
    },
  },
];

// Добавление кнопок в btnMenu
menu.forEach((item) => {
  const button = Button(item);
  btnMenu.appendChild(button);
});
