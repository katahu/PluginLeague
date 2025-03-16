let routerAttack = {};
let routes = {};
let nameSwitch = "";
let upPockemon = "";
let attackUp = "";
let imgSemant = [];

async function fetchData() {
  try {
    const attackResponse = await fetch("https://dce6373a41a58485.mokky.dev/attack");
    if (!attackResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для атаки: ${attackResponse.status}`);
    }
    const attackData = await attackResponse.json();

    const { nameSwitch, upPockemon, attackUp, imgSemant } = attackData[0];
    Object.assign(routerAttack, attackData[0]);

    console.log("Локации и мобы успешно загружены:", routerAttack);

    const healResponse = await fetch("https://dce6373a41a58485.mokky.dev/routers");
    if (!healResponse.ok) {
      throw new Error(`Ошибка при загрузке данных для лечения: ${healResponse.status}`);
    }
    const healData = await healResponse.json();

    Object.assign(routes, healData[0]);
    routes = healData[0];

    console.log("Маршрут для лечения успешно загружены", routes);
  } catch (error) {
    console.error("Ошибка в загрузке:", error);
  }
}
fetchData();
