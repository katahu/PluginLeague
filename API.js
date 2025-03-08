const routerAttack = {};

const routes = {};

let nameSwitch = "";
let upPockemon = "";
let = attackUp = "";
let imgSemant = [];
async function fetchAttack() {
  try {
    const response = await fetch("https://dce6373a41a58485.mokky.dev/attack");
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      Object.assign(routerAttack, data[0]);
    }
    nameSwitch = data[0].nameSwitch || "";
    upPockemon = data[0].upPockemon || "";
    attackUp = data[0].attackUp || "";
    imgSemant = data[0].imgSemant || [];
    console.log("Локации и мобы успешно загружены:", routerAttack);
  } catch (error) {
    console.error("Ошибка при загрузке маршрутов:", error);
  }
}

async function initializeAttack() {
  await fetchAttack();
}

initializeAttack();

async function fetchHeal() {
  try {
    const response = await fetch("https://dce6373a41a58485.mokky.dev/routers");
    const data = await response.json();

    const routesData = data[0];

    Object.assign(routes, routesData);

    console.log("Маршруты успешно загружены:", routes);
  } catch (error) {
    console.error("Ошибка при загрузке маршрутов:", error);
  }
}

async function initializeHeal() {
  await fetchHeal();
}
initializeHeal();
