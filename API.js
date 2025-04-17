// let imgSemant = [];

// Обычные атаки
let variableAttack = getLocalStorageValue("variableAttack", "");
// Смена монстра и атака после смены
let nameSwitchMonster = getLocalStorageValue("nameSwitchMonster", "");
let variableAttackAfter = getLocalStorageValue("variableAttackAfter", "");
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

let userHeal = {};
let routeHeal = {};
let monsterList = {};
let userMonsterList = {};
async function fetchData() {
  const mainUrls = [
    "https://dce6373a41a58485.mokky.dev/heal",
    "https://dce6373a41a58485.mokky.dev/userHeal",
    "https://dce6373a41a58485.mokky.dev/monster",
    "https://dce6373a41a58485.mokky.dev/userMonster",
  ];

  const backupUrls = [
    "https://65f9a7ef3909a9a65b190bd2.mockapi.io/heal",
    "https://backup-server.com/userHeal",
    "https://65f9a7ef3909a9a65b190bd2.mockapi.io/attack",
    "https://backup-server.com/userMonster",
  ];

  try {
    let responses = await Promise.allSettled(mainUrls.map((url) => fetch(url)));

    for (let i = 0; i < responses.length; i++) {
      if (responses[i].status !== "fulfilled" || !responses[i].value.ok) {
        console.warn(`Основной запрос не удался: ${mainUrls[i]}`);
        const backupResponse = await fetch(backupUrls[i]);
        responses[i] = { status: "fulfilled", value: backupResponse };
      }
    }

    const jsonData = await Promise.all(responses.map((res) => res.value.json()));

    routeHeal = jsonData[0][0];
    userHeal = jsonData[1][0];
    monsterList = jsonData[2][0];
    userMonsterList = jsonData[3][0];

    console.log("monsterList", monsterList);
    console.log("userMonsterList", userMonsterList);
    console.log("routeHeal", routeHeal);
    console.log("userHeal", userHeal);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
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
