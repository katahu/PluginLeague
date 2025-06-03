// Автореклама

// let adText = getLocalStorageValue("adText", "Привет");
// let isAdActive = getLocalStorageValue("isAdActive", false);
// const adTimer = () => new Promise((resolve) => setTimeout(resolve, 600000 + Math.random() * 120000));
// async function showAd() {
//   while (isAdActive) {
//     if (adText === "") {
//       console.log("adText пустой");
//       return;
//     }
//     if (!isAdActive) return;
//     const textPush = document.querySelector("#divInputFields .txtInput");
//     textPush.value = "";
//     textPush.value = `${adText}`;

//     const send = divInputFields.querySelector(".button.color-active.btnSend.justicon");
//     console.log("Нажали на кнопку", send);
//     send.click();
//     await new Promise((resolve) => {
//       const observer = new MutationObserver((mutationsList) => {
//         for (let mutation of mutationsList) {
//           if (mutation.type === "attributes" && mutation.attributeName === "style") {
//             const currentStyle = send.getAttribute("style");
//             console.log("Новые стили:", currentStyle);
//             observer.disconnect();
//             resolve();
//           }
//         }
//       });

//       observer.observe(send, {
//         attributes: true,
//         attributeFilter: ["style"],
//       });
//     });
//     console.log("Запущен таймер");
//     await adTimer();
//   }
// }

// {
//   type: "checkbox",
//   text: "Автореклама",
//   storageKey: "isAdActive",
//   onChange: (value) => {
//     isAdActive = value;
//     if (isAdActive) {
//       showAd();
//       console.log("Вызвали рекламу");
//     }
//   },
// },
// const btn = document.createElement("div");
// btn.textContent = "🎉";
// btn.addEventListener("click", showAd);
// document.body.appendChild(btn);

// Автоспарка

// Возврат монстров после спарки
async function backMonsterAll() {
  const teamButton = document.querySelector('.divDockIn img[src*="team"]');
  teamButton.click();
  const teamMonster = document.querySelector(".divDockPanels .divPokeTeam");

  await new Promise((resolve) => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          observer.disconnect();
          resolve();
        }
      }
    });
    observer.observe(teamMonster, { childList: true });
  });

  const teamCountMonster = teamMonster.querySelectorAll(".pokemonBoxCard");

  for (const monster of teamCountMonster) {
    if (monster.querySelector(".icon.icomoon.icon-star-fill.starter").style.display == "none") {
      const ball = monster.querySelector(".ball.clickable").click();
      const divElements = document.querySelector(".divElements");
      if (!divElements) {
        await observerElements(divElements);
      }
      const divElementList = divElements.querySelectorAll(".divElement");
      for (const divElement of divElementList) {
        if (divElement.querySelector(".text").textContent.trim() === "В обмен (с передачей прав хозяина)") {
          divElement.click();
          break;
        }
      }
    }
  }
}

// let count = null;
// const monsters = document.querySelectorAll(".divFarm #divFarmList .pokemonBoxTiny");
// for (const monster of monsters) {
//   if (count >= 5) {
//     break;
//   }
//   if (!monster.querySelector(".name").classList.contains("shine")) {
//     if (!(+monster.querySelector(".lvl").textContent.trim() <= 1)) {
//       count++;
//       monster.querySelector(".button.btnBack.justicon").click();
//       await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (600 - 400 + 1)) + 400));
//     }
//   }
// }

// function setFightArea() {
//   const fight = document.querySelector("#divVisioFight");
//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (
//         mutation.type === "attributes" &&
//         mutation.attributeName === "class" &&
//         !mutation.target.classList.contains("none")
//       ) {
//         play.sound(sounds.alert);
//       }
//     }
//   });
//   observer.observe(fight, { attributes: true, attributeFilter: ["class"] });
// }
