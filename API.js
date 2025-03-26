let routeHeal = {};
let userHeal = {};
let nameUpMonster = getLocalStorageValue("nameUpMonster", "");
let attackUp = getLocalStorageValue("attackUp", "");
let variableCatch = getLocalStorageValue("varibleCatch", "");
let varibleBall = getLocalStorageValue("varibleBall", "");
let statusAttack = getLocalStorageValue("statusAttack", "");
let weather = getLocalStorageValue("weather", false);
let imgSemant = [];

let monsterList = new Map();
let userMonsterList = new Map();

async function fetchData() {
  const endpoints = [
    { url: "https://dce6373a41a58485.mokky.dev/monster", name: "monsterList" },
    { url: "https://dce6373a41a58485.mokky.dev/userMonster", name: "userMonsterList" },
    { url: "https://65f9a7ef3909a9a65b190bd2.mockapi.io/heal", name: "routeHeal" },
  ];

  try {
    const responses = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(endpoint.url).then(async (res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
      )
    );

    responses.forEach((data, index) => {
      const { name } = endpoints[index];
      if (Array.isArray(data) && data.length > 0) {
        if (name === "monsterList") {
          monsterList = new Map(Object.entries(data[0]));
        } else if (name === "userMonsterList") {
          userMonsterList = new Map(Object.entries(data[0]));
        }
        console.log(`${name} успешно загружен:`, data[0]);
      } else {
        console.warn(`Данные ${name} пусты или имеют неверный формат`);
      }
    });
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
