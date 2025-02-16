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
  const { text, onClick } = option;

  const el = document.createElement("div");

  el.classList.add("btn-bot");
  if (text) {
    el.textContent = text;
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
    text: "Атака",
    onClick: () => {
      controller();
      playSound();
    },
  },
  {
    text: "Хил",
    onClick: () => {
      moveHeal();
    },
  },
  {
    text: "Стоп",
    onClick: () => {
      stopBot();
    },
  },
  {
    text: "Обновить",
    onClick: () => {
      fetchAttack(), fetchHeal();
    },
  },
  {
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
