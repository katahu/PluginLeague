const routerAttack = {};

const routes = {};
async function fetchAttack() {
  try {
    const response = await fetch("https://dce6373a41a58485.mokky.dev/attack");
    const data = await response.json();

    // Преобразуем массив в объект
    if (Array.isArray(data) && data.length > 0) {
      Object.assign(routerAttack, data[0]);
    }

    console.log("Локации и мобы успешно загружены:", routerAttack);
  } catch (error) {
    console.error("Ошибка при загрузке маршрутов:", error);
  }
}

async function initializeAttack() {
  await fetchAttack();
}
// Запускаем инициализацию при загрузке страницы
initializeAttack();

async function fetchHeal() {
  try {
    const response = await fetch("https://dce6373a41a58485.mokky.dev/routers");
    const data = await response.json();

    // Получаем первый объект из массива
    const routesData = data[0];

    // Копируем все маршруты в routes
    Object.assign(routes, routesData);

    console.log("Маршруты успешно загружены:", routes);
  } catch (error) {
    console.error("Ошибка при загрузке маршрутов:", error);
  }
}

// Создание и запуск маршрута после загрузки маршрутов
async function initializeHeal() {
  await fetchHeal();
}
initializeHeal();
