const drops = {};

function checker() {
  console.log("Сработал");
  const alertElement = document.querySelector("#divAlerten .alerten.poke");
  if (!alertElement || alertElement.dataset.checked === "true") return;
  alertElement.dataset.checked = "true";

  const content = alertElement.querySelector(".divContent");

  const poke = content.querySelector(".wild .intextpoke").textContent.trim();
  const pokeCount = 1; // Значение по умолчанию

  // Если poke уже есть в объекте drops, увеличиваем счетчик, иначе добавляем новый
  if (!drops[poke]) {
    drops[poke] = [pokeCount];
  } else {
    drops[poke][0] += pokeCount;
  }

  const dropElements = content.querySelectorAll(".drop");

  dropElements.forEach((drop) => {
    const Etitle = drop.querySelector(".title");
    if (!Etitle) return;

    // Извлекаем title без содержимого <b>
    const title = Etitle.cloneNode(true);
    const bElement = title.querySelector("b");
    if (bElement) {
      bElement.remove();
    }
    const cleanTitle = title.textContent.trim();

    let itemCount = 1; // Значение по умолчанию
    const bElementOriginal = drop.querySelector("b");

    if (bElementOriginal) {
      itemCount = parseInt(bElementOriginal.textContent.trim().replace(/\D/g, "")) || 1; // Парсим количество, убирая все нечисловые символы
    }

    // Если cleanTitle уже есть в объекте drops, увеличиваем счетчик, иначе добавляем новый
    if (!drops[cleanTitle]) {
      drops[cleanTitle] = [itemCount];
    } else {
      drops[cleanTitle][0] += itemCount;
    }
  });

  // Создаем новый div для каждого массива и добавляем в dropMenu
  dropMenu.innerHTML = ""; // Очищаем старые элементы, если они были

  for (const [key, value] of Object.entries(drops)) {
    const dropItemDiv = document.createElement("div");
    dropItemDiv.classList.add("drop-item");
    dropItemDiv.innerHTML = `${key} <strong>x${value[0]}</strong>`;

    // Добавляем новый div в меню
    dropMenu.append(dropItemDiv);
  }
}
