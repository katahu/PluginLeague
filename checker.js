let observerDrop = null;
const arrDrops = [];
function observerDrops() {
  if (observerDrop) return;

  observerDrop = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const addedNode = mutation.addedNodes[0];
        controllerDrops(addedNode);
      }
    });
  });

  observerDrop.observe(document.querySelector("#divAlerten"), {
    childList: true,
    subtree: false,
  });
}
function controllerDrops(addedNode) {
  const divContent = addedNode.querySelector(".divContainer");
  if (!divContent.parentElement.matches(".alerten.poke, .alerten.getting.plus")) return;

  const intextpoke = divContent.querySelector(".intextpoke")?.textContent.trim();

  if (intextpoke) {
    const existingMonster = arrDrops.find((item) => item.name === intextpoke);
    if (existingMonster) {
      existingMonster.count += 1;
      updateDropList(intextpoke, existingMonster.count);
    } else {
      arrDrops.push({ name: intextpoke, count: 1 });
      updateDropList(intextpoke, 1);
    }
  }

  const dropList = divContent.querySelectorAll(".drop");

  for (const nameDrop of dropList) {
    const dropName = nameDrop
      .querySelector(".title")
      .innerHTML.replace(/<b[^>]*>.*?<\/b>/gi, "")
      .trim();
    let amount = +nameDrop.querySelector(".amount")?.textContent.trim();
    if (amount === 0) {
      amount = 1;
    }
    const existingItem = arrDrops.find((item) => item.name === dropName);
    if (existingItem) {
      existingItem.count += amount;
      updateDropList(dropName, existingItem.count);
    } else {
      arrDrops.push({ name: dropName, count: amount });
      updateDropList(dropName, amount);
    }
  }
}
function updateDropList(itemName, itemCount) {
  const itemId = `item-${itemName.replace(/[^\p{L}\d]/gu, "-")}`;
  let itemDiv = dropMenu.querySelector(`#${itemId}`);
  if (itemDiv) {
    itemDiv.textContent = `${itemName} x${itemCount}`;
  } else {
    if (noneDrop) {
      noneDrop.remove();
    }
    itemDiv = document.createElement("div");
    itemDiv.id = itemId;
    itemDiv.textContent = `${itemName} x${itemCount}`;
    dropMenu.append(itemDiv);
  }
}
