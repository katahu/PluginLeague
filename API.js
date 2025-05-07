// Обычные атаки
let variableAttack = +getLocalStorageValue("variableAttack", "");
let ppStop = getLocalStorageValue("ppStop", false);
// Смена монстра и атака после смены
let nameSwitchMonster = getLocalStorageValue("nameSwitchMonster", "").toLowerCase();
let variableAttackAfter = +getLocalStorageValue("variableAttackAfter", "");
// Добивание
let isLoseMonster = getLocalStorageValue("isLoseMonster", "");
// Погода
let variableWeather = getLocalStorageValue("variableWeather", "");
let weatherLimit = getLocalStorageValue("weatherLimit", false);
// Прокачка
let levelingUP = getLocalStorageValue("levelingUP", false);
let nameUpMonster = getLocalStorageValue("nameUpMonster", "");
let variableAttackUP = getLocalStorageValue("variableAttackUP", "");
// Поимка
let variableGender = getLocalStorageValue("variableGender", "");
let variableStatus = getLocalStorageValue("variableStatus", "");
let variableMonsterBall = getLocalStorageValue("variableMonsterBall", "");

// Дополнительно
let countMonsterLimit = Number(getLocalStorageValue("countMonsterLimit", ""));
let isMonsterLimit = getLocalStorageValue("isMonsterLimit", false);
// День рождение
// let answers = [];
let routeHeal = {};

async function fetchData() {
  const mainUrls = [
    "https://dce6373a41a58485.mokky.dev/heal",
    // "https://795c42529e7865a0.mokky.dev/answers",
  ];

  const backupUrls = [
    "https://65f9a7ef3909a9a65b190bd2.mockapi.io/heal",
  ];

  chrome.runtime.sendMessage({ type: "FETCH_URLS", mainUrls, backupUrls }, (response) => {
    if (response.success) {
      const [routeHealData,  answersData] = response.data;

      routeHeal = routeHealData[0];

      // answers = answersData;
    
      console.log("routeHeal", routeHeal);

      // console.log("answer", answers);
    } else {
      console.error("Ошибка при получении данных из background.js:", response.error);
    }
  });
}
fetchData();
function getLocalStorageValue(key, defaultValue) {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Ошибка парсинга JSON для ключа "${key}":`, error);
    return defaultValue;
  }
}

function setLocalStorageValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
