let routeHeal = {};

async function fetchData() {
  const mainUrls = ["https://dce6373a41a58485.mokky.dev/heal"];

  const backupUrls = ["https://65f9a7ef3909a9a65b190bd2.mockapi.io/heal"];

  chrome.runtime.sendMessage({ type: "FETCH_URLS", mainUrls, backupUrls }, (response) => {
    if (response.success) {
      const [routeHealData] = response.data;
      routeHeal = routeHealData[0];
    } else {
      console.error("Ошибка при получении данных из background.js:", response.error);
    }
  });
}
fetchData();

const DEFAULT_CONFIG = {
  variableAttack: "0",
  isFightShine: false,
  nameSwitchMonster: "",
  variableAttackAfter: "0",
  isFinishingOff: false,
  variableWeather: "w3,w4",
  weatherLimit: false,
  levelingUP: false,
  nameUpMonster: "",
  levelUpMaxMonster: 100,
  enemyHardlvl: "",
  isActiveHardLvl: false,
  variableAttackUP: "Замедленная бомба",
  variableGender: "Все",
  variableCatchAttack: "Сломанный меч",
  variableStatus: "Колыбельная",
  variableMonsterBall: "1",
  countMonsterLimit: null,
  isMonsterLimit: false,
  criticalHP: 20,
  isAntiBot: false,
  themeBot: false,
  variableAntiBot: "stop",
  notification: false,
};

const config = {};
Object.entries(DEFAULT_CONFIG).forEach(([key, defaultValue]) => {
  config[key] = getConfigValue(key, defaultValue);
});

let variableAttack = +config.variableAttack;
let isFightShine = config.isFightShine;
let nameSwitchMonster = config.nameSwitchMonster;
let variableAttackAfter = +config.variableAttackAfter;
let variableWeather = config.variableWeather;
let weatherLimit = config.weatherLimit;
let levelingUP = config.levelingUP;
let isFinishingOff = config.isFinishingOff;
let nameUpMonster = config.nameUpMonster;
let levelUpMaxMonster = +config.levelUpMaxMonster;
let enemyHardlvl = +config.enemyHardlvl;
let isActiveHardLvl = config.isActiveHardLvl;
let variableAttackUP = config.variableAttackUP;
let variableGender = config.variableGender;
let variableCatchAttack = config.variableCatchAttack;
let variableStatus = config.variableStatus;
let variableMonsterBall = config.variableMonsterBall;
let countMonsterLimit = config.countMonsterLimit;
let isMonsterLimit = config.isMonsterLimit;
let criticalHP = config.criticalHP;
let isAntiBot = config.isAntiBot;
let themeBot = config.themeBot;
let variableAntiBot = config.variableAntiBot;
let notification = config.notification;

function getConfigValue(key, defaultValue) {
  const value = localStorage.getItem(key);

  if (value === null) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Ошибка парсинга JSON для ключа "${key}":`, error);
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
}

function updateConfig(key, value) {
  config[key] = value;
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorageValue(key, defaultValue) {
  if (key in config) {
    return config[key];
  }

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
  if (key in config) {
    updateConfig(key, value);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}
if (themeBot) {
  document.body.classList.toggle("bt-dark");
}
