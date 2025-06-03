const messageManager = (() => {
  const activeObservers = [];
  let isActive = false;
  let observer = null;
  let myName = null;

  function start() {
    if (isActive) return;
    isActive = true;
    searchMyName();
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && node.matches("div.post.mine")) {
            if (node.querySelector(".users .label").textContent.trim() !== myName) {
              play.sound(sounds.alert);
              observerText(node);
              if (isAntiBot) {
                antiBot();
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function observerText(message) {
    const span = message.querySelector("span.text");

    const textObserver = new MutationObserver(() => {
      play.sound(sounds.alert);
      if (isAntiBot) {
        antiBot();
      }
      clearTimeout(observerEntry.timeoutId);
      observerEntry.timeoutId = setTimeout(disconnectObserver, 60000);
    });

    textObserver.observe(span, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    function disconnectObserver() {
      textObserver.disconnect();
      const index = activeObservers.indexOf(observerEntry);
      if (index !== -1) activeObservers.splice(index, 1);
    }

    const observerEntry = {
      observer: textObserver,
      span,
      timeoutId: setTimeout(disconnectObserver, 60000),
    };

    activeObservers.push(observerEntry);
  }
  function stop() {
    isActive = false;
    observer?.disconnect();
    observer = null;
    for (const observerEntry of activeObservers) {
      observerEntry.observer.disconnect();
      clearTimeout(observerEntry.timeoutId);
    }
    activeObservers.length = 0;
  }
  function searchMyName() {
    myName = document.querySelector("#divDockUser .trainer .label")?.textContent.trim();
    if (!myName) {
      myName = document.querySelector("#divOnline #divOnlineUser .trainer .label")?.textContent.trim();
    }
  }
  return { start, stop };
})();
function antiBot() {
  if (!isAntiBot) return;
  if (variableAntiBot === "stop") {
    botManager.stop();
  }
  if (variableAntiBot === "pause") {
    botManager.stop();
    setTimeout(() => {
      botManager.start();
    }, 300000);
  }
}
const startMessage = (() => {
  const body = document.querySelector("body");
  const observer = new MutationObserver(() => {
    if (body.classList.contains("game")) {
      if (isAntiBot) {
        messageManager.start();
      }
      if (notification) {
        messageManager.start();
      }
      observer.disconnect();
    }
  });
  observer.observe(body, { attributes: true, attributeFilter: ["class"] });
})();
const notificationWrap = document.createElement("div");
notificationWrap.classList.add("BnotificationWrap");
document.body.appendChild(notificationWrap);

const arrMessage = [];

function messageAdd(text) {
  const el = document.createElement("div");
  el.classList.add("item-notification");
  el.innerHTML = text;

  const xMark = document.createElement("i");
  xMark.classList.add("fa-light", "icons-xMark");
  el.appendChild(xMark);

  notificationWrap.appendChild(el);

  arrMessage.push(el);

  setTimeout(() => {
    el.classList.add("opening");
  }, 10);

  function removeFromArray() {
    const index = arrMessage.indexOf(el);
    if (index !== -1) {
      arrMessage.splice(index, 1);
    }
  }

  function swap(e) {
    if (e.target === el) {
      if (el.classList.contains("opening")) {
        setTimeout(() => {
          el.classList.remove("opening");
          el.classList.add("closing");
        }, 8000);
      } else if (el.classList.contains("closing")) {
        el.removeEventListener("animationend", swap);
        el.remove();
        removeFromArray();
      }
    }
  }

  el.addEventListener("animationend", swap);
  xMark.addEventListener("click", () => {
    el.classList.remove("opening");
    el.classList.add("closing");
  });
}
function clearAllMessages() {
  const messagesToClear = [...arrMessage];
  messagesToClear.forEach((el) => {
    el.classList.remove("opening");
    el.classList.add("closing");
  });
}
