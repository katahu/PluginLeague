const alerten = document.getElementById("divAlerten");
const dropItems = new Map(); // Хранилище дропа
const monsters = new Map(); // Хранилище монстров

function checkItem() {
  const monsterElement = alerten.querySelector(".wild .intextpoke");
  if (!monsterElement || monsterElement.dataset.checked === "true") return;
  monsterElement.dataset.checked = "true";
  const monster = monsterElement.textContent.trim();

  // Увеличиваем счётчик монстра
  if (monsters.has(monster)) {
    const existingMonster = monsters.get(monster);
    existingMonster.count += 1;
    existingMonster.countSpan.textContent = `x${existingMonster.count}`;
    existingMonster.countSpan.classList.add("count-update");
    setTimeout(() => existingMonster.countSpan.classList.remove("count-update"), 300);
  } else {
    const newMonster = document.createElement("div");
    newMonster.classList.add("drop-monster", "drop-new"); // Добавляем класс анимации

    const nameSpan = document.createElement("span");
    nameSpan.textContent = monster;

    const countSpan = document.createElement("span");
    countSpan.textContent = "x1";
    countSpan.classList.add("count-span");

    newMonster.append(nameSpan, countSpan);
    drop.appendChild(newMonster);

    setTimeout(() => {
      newMonster.classList.remove("drop-new"); // Убираем класс анимации после завершения
    }, 300);

    monsters.set(monster, { count: 1, element: newMonster, countSpan });
  }

  console.log("Монстр:", monster);

  const items = alerten.querySelectorAll(".drop");
  let hasDrop = false;

  items.forEach((item) => {
    const nameItem = item.querySelector(".title");
    if (!nameItem) return;

    const nameIsolate = nameItem.cloneNode(true);
    const bElement = nameIsolate.querySelector("b");
    if (bElement) {
      bElement.remove();
    }
    const itemName = nameIsolate.textContent.trim();
    const countElement = item.querySelector(".amount");
    const itemCount = countElement ? parseInt(countElement.textContent.trim(), 10) : 1;

    console.log(itemName, itemCount);

    if (dropItems.has(itemName)) {
      const existingItem = dropItems.get(itemName);
      existingItem.count += itemCount;
      existingItem.countSpan.textContent = `x${existingItem.count}`;
      existingItem.countSpan.classList.add("count-update");
      setTimeout(() => existingItem.countSpan.classList.remove("count-update"), 300);
    } else {
      const newItem = document.createElement("div");
      newItem.classList.add("drop-item", "drop-new"); // Добавляем класс анимации

      const nameSpan = document.createElement("span");
      nameSpan.textContent = itemName;

      const countSpan = document.createElement("span");
      countSpan.textContent = `x${itemCount}`;
      countSpan.classList.add("count-span");

      newItem.append(nameSpan, countSpan);
      drop.appendChild(newItem);

      setTimeout(() => {
        newItem.classList.remove("drop-new"); // Убираем класс анимации после завершения
      }, 300);

      dropItems.set(itemName, { count: itemCount, element: newItem, countSpan });
    }
    hasDrop = true;
  });

  if (hasDrop) {
    subtitle.remove(); // Удаляем "Дроп отсутствует", если есть дроп
  }
}
