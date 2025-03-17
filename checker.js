const drops = new Map();

function checker() {
  const alertElement = document.querySelector("#divAlerten .alerten.poke");
  if (!alertElement || alertElement.dataset.checked === "true") return;
  alertElement.dataset.checked = "true";

  const content = alertElement.querySelector(".divContent");
  if (!content) return;

  const pokeElement = content.querySelector(".wild .intextpoke");
  if (!pokeElement) return;

  const poke = pokeElement.textContent.trim();
  const pokeCount = 1;

  updateDropCount(poke, pokeCount);

  const dropElements = content.querySelectorAll(".drop");
  dropElements.forEach((drop) => {
    const titleElement = drop.querySelector(".title");
    if (!titleElement) return;

    const cleanTitle = getCleanTitle(titleElement);

    let itemCount = 1;
    const countElement = drop.querySelector("b");
    if (countElement) {
      itemCount = parseInt(countElement.textContent.trim().replace(/\D/g, "")) || 1;
    }

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

  dropMenu.innerHTML = "";
  dropMenu.append(fragment);
}
