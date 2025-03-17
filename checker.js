const drops = new Map(); // Используем Map для хранения данных

// const noneDrop = document.createElement("span");
// noneDrop.classList.add("none-drop");
// noneDrop.textContent = "Дроп отсутствует";
// dropMenu.append(noneDrop);

function checker() {
  const alertElement = document.querySelector("#divAlerten .alerten.poke");
  if (!alertElement || alertElement.dataset.checked === "true") return;
  alertElement.dataset.checked = "true";

  const content = alertElement.querySelector(".divContent");
  if (!content) return;

  const pokeElement = content.querySelector(".wild .intextpoke");
  if (!pokeElement) return;

  const poke = pokeElement.textContent.trim();
  const pokeCount = 1; // Значение по умолчанию

  // Обновляем счетчик для poke
  updateDropCount(poke, pokeCount);

  const dropElements = content.querySelectorAll(".drop");
  dropElements.forEach((drop) => {
    const titleElement = drop.querySelector(".title");
    if (!titleElement) return;

    // Извлекаем title без содержимого <b>
    const cleanTitle = getCleanTitle(titleElement);

    let itemCount = 1; // Значение по умолчанию
    const countElement = drop.querySelector("b");
    if (countElement) {
      itemCount = parseInt(countElement.textContent.trim().replace(/\D/g, "")) || 1;
    }

    // Обновляем счетчик для cleanTitle
    updateDropCount(cleanTitle, itemCount);
  });

  updateDropMenu();
}

function getCleanTitle(titleElement) {
  const title = titleElement.cloneNode(true);
  const bElement = title.querySelector("b");
  if (bElement) {
    bElement.remove();
  }
  return title.textContent.trim();
}

function updateDropCount(key, count) {
  if (!drops.has(key)) {
    drops.set(key, count);
  } else {
    drops.set(key, drops.get(key) + count);
  }
}

function updateDropMenu() {
  if (!dropMenu) return;

  const fragment = document.createDocumentFragment();

  for (const [key, value] of drops.entries()) {
    const dropItemDiv = document.createElement("div");
    dropItemDiv.classList.add("drop-item");
    dropItemDiv.textContent = `${key} x${value}`;
    fragment.append(dropItemDiv);
  }
  if (noneDrop) {
    noneDrop.remove();
  }

  dropMenu.innerHTML = ""; // Очищаем старое содержимое
  dropMenu.append(fragment); // Добавляем новые элементы
}
