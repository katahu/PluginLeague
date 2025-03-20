let routeAttack = {};
let routeHeal = {};
let userHeal = {};
let nameSwitch = "";
let upPockemon = getLocalStorageValue("upPockemon", "");
let attackUp = getLocalStorageValue("attackUp", "");
let variableCatch = getLocalStorageValue("varibleCatch", "");
let varibleBall = getLocalStorageValue("varibleBall", "");
let statusAttack = getLocalStorageValue("statusAttack", "");
let weather = getLocalStorageValue("weather", false);
let imgSemant = [];
async function fetchData() {
  try {
    const attackResponse = await fetch("https://65f9a7ef3909a9a65b190bd2.mockapi.io/attack");
    if (!attackResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для атаки: ${attackResponse.status}`);
    }
    const attackData = await attackResponse.json();

    const { nameSwitch, imgSemant } = attackData[0];
    Object.assign(routeAttack, attackData[0]);

    console.log("Локации и мобы успешно загружены:", routeAttack);

    const healResponse = await fetch("https://dce6373a41a58485.mokky.dev/heal");
    if (!healResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для лечения: ${healResponse.status}`);
    }
    const healData = await healResponse.json();

    Object.assign(routeHeal, healData[0]);
    routeHeal = healData[0];

    const userHealResponse = await fetch("https://dce6373a41a58485.mokky.dev/vip");
    if (!userHealResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для лечения: ${userHealResponse.status}`);
    }
    const userHealData = await userHealResponse.json();

    Object.assign(userHeal, userHealData[0]);
    userHeal = userHealData[0];
    console.log("Пользовательский маршрут загружен", userHeal);
    console.log("Маршрут для лечения успешно загружены", routeHeal);
  } catch (error) {
    console.error("Ошибка в загрузке:", error);
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
