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
  isLoseMonster: false,
  variableWeather: "w3,w4",
  weatherLimit: false,
  levelingUP: false,
  nameUpMonster: "",
  variableAttackUP: "Замедленная бомба",
  variableGender: "Все",
  variableStatus: "Колыбельная",
  variableMonsterBall: "1",
  countMonsterLimit: null,
  isMonsterLimit: false,
  CRITICAL_HP_PERCENT: 20,
};

const config = {};
Object.entries(DEFAULT_CONFIG).forEach(([key, defaultValue]) => {
  config[key] = getConfigValue(key, defaultValue);
});

let variableAttack = config.variableAttack;
let isFightShine = config.isFightShine;
let nameSwitchMonster = config.nameSwitchMonster.toLowerCase();
let variableAttackAfter = config.variableAttackAfter;
let isLoseMonster = config.isLoseMonster;
let variableWeather = config.variableWeather;
let weatherLimit = config.weatherLimit;
let levelingUP = config.levelingUP;
let nameUpMonster = config.nameUpMonster;
let variableAttackUP = config.variableAttackUP;
let variableGender = config.variableGender;
let variableStatus = config.variableStatus;
let variableMonsterBall = config.variableMonsterBall;
let countMonsterLimit = config.countMonsterLimit;
let isMonsterLimit = config.isMonsterLimit;
let CRITICAL_HP_PERCENT = config.CRITICAL_HP_PERCENT;

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
