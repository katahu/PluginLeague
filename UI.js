const dropMenu = document.createElement("div");
dropMenu.classList.add("drop-menu");
document.body.append(dropMenu);

const buttonAtack = document.createElement("div");
buttonAtack.textContent = "Атака";
buttonAtack.classList.add("btn-bot");
buttonAtack.addEventListener("click", () => {
  controller();
  playSound();
});

const buttonHeal = document.createElement("div");
buttonHeal.textContent = "Хил";
buttonHeal.classList.add("btn-bot");
document.body.append(buttonHeal);
buttonHeal.addEventListener("click", () => {
  moveHeal();
});
const btnStop = document.createElement("div");
btnStop.classList.add("btn-bot");
btnStop.textContent = "Стоп";
btnStop.addEventListener("click", () => {
  stopBot();
});
const btnToggleDrop = document.createElement("div");
btnToggleDrop.classList.add("btn-bot");
btnToggleDrop.textContent = "Дроп";
btnToggleDrop.addEventListener("click", () => {
  dropMenu.classList.toggle("active");
});

const btnToggle = document.createElement("div");
btnToggle.classList.add("btn-toggle");
document.body.appendChild(btnToggle);

const btnMenu = document.createElement("div");
btnMenu.classList.add("btn-menu");
btnMenu.append(buttonAtack, buttonHeal, btnStop, btnToggleDrop);
document.body.appendChild(btnMenu);

btnToggle.addEventListener("click", () => {
  btnMenu.classList.toggle("active");
});
