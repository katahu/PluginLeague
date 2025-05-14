class Button {
  constructor(options, parent = null) {
    if (Array.isArray(options)) {
      this.buttons = options.map((opt) => new Button(opt, parent));
      return;
    }

    this.el = document.createElement("div");
    this.el.classList.add("menuItem");

    if (options.icon) {
      const icon = document.createElement("i");
      icon.classList.add(...options.icon.split(" "));
      this.el.prepend(icon);
    }

    if (options.text) {
      this.el.append(options.text);
    }

    if (options.onClick) {
      this.el.addEventListener("click", (e) => {
        e.stopPropagation();
        options.onClick();
      });
    }

    if (parent) {
      parent.appendChild(this.el);

      if (options.separatorAfter) {
        const separator = document.createElement("div");
        separator.classList.add("hrMenu");
        parent.append(separator);
      }
    }
  }
}
class Radio {
  constructor(options, groupOptions = {}) {
    this.groupWrapper = document.createElement("div");
    this.groupWrapper.classList.add("radio-group");

    const storageKey = groupOptions.storageKey || `radio-group-${options[0].name}`;
    const savedValue = storageKey in config ? config[storageKey] : getLocalStorageValue(storageKey, null);

    this.buttons = options.map((opt) => {
      const el = document.createElement("label");
      el.classList.add("Radio");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = groupOptions.name;
      input.value = opt.value;
      input.checked = opt.value === savedValue;
      input.classList.add("Radio-input");

      const radioMain = document.createElement("div");
      radioMain.classList.add("Radio-main");

      const text = document.createElement("span");
      text.classList.add("Radio-label");
      text.textContent = opt.text || "";

      radioMain.append(text);
      el.append(input, radioMain);

      input.addEventListener("change", () => {
        if (input.checked) {
          setLocalStorageValue(storageKey, input.value);
          if (groupOptions.onChange) groupOptions.onChange(input.value);
        }
      });

      this.groupWrapper.appendChild(el);
      return { el, input };
    });

    this.el = this.groupWrapper;
  }
}
class Checkbox {
  constructor(options) {
    this.el = document.createElement("div");
    this.el.classList.add("menuItem");

    this.label = document.createElement("label");
    this.label.classList.add("toggle");

    const savedValue = options.storageKey ? getLocalStorageValue(options.storageKey, null) : null;

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.checked = savedValue !== null ? savedValue : false;

    this.widget = document.createElement("span");
    this.widget.classList.add("slider");

    this.label.append(this.input, this.widget);
    this.el.append(this.label);
    this.el.prepend(options.text);
    this.el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.input.checked = !this.input.checked;
      this.input.dispatchEvent(new Event("change"));
    });

    this.input.addEventListener("change", () => {
      if (options.storageKey) {
        setLocalStorageValue(options.storageKey, this.input.checked);
      }
      if (options.onChange) {
        options.onChange(this.input.checked);
      }
    });
  }
}
class Inpute {
  constructor(options) {
    this.el = document.createElement("div");
    this.el.classList.add("menuItem", "modal-input");

    this.inp = document.createElement("input");
    if (options.classList) this.inp.classList.add(...options.classList.split(" "));
    this.inp.type = "text";
    if (options.text) {
      this.el.textContent = options.text;
    }
    if (options.placeholder) this.inp.placeholder = options.placeholder;
    this.inp.autocomplete = options.hasOwnProperty("autocomplete") ? "on" : "off";

    this.el.append(this.inp);
    const savedValue = options.storageKey ? getLocalStorageValue(options.storageKey, null) : null;
    this.inp.value = savedValue !== null ? savedValue : "";
    this.inp.addEventListener("input", (e) => {
      if (options.number) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      }
      options.onChange(e.target.value);
      setLocalStorageValue(options.storageKey, e.target.value);
    });
  }
}
class ModalMenu {
  static stack = [];

  constructor(options) {
    this.el = document.createElement("div");
    this.el.classList.add("modalContainer");

    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("backdrop");

    this.modalWrapper = document.createElement("div");
    this.modalWrapper.classList.add("modalWrapper");
    this.content = document.createElement("div");
    this.content.classList.add("modalContent", "custom-scroll");

    if (options.text) {
      this.header = document.createElement("div");
      this.header.classList.add("modalHeader");
      this.header.textContent = options.text;

      this.hr = document.createElement("div");
      this.hr.classList.add("modalHr");
      this.modalWrapper.append(this.header, this.hr);
    }

    this.modalWrapper.append(this.content);
    this.el.append(this.backdrop, this.modalWrapper);

    if (options.items) {
      this.addItems(options.items);
    }

    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.close();
        controllerTable.closeMenu();
      }
    });
  }

  addItems(items) {
    if (Array.isArray(items)) {
      items.forEach((item) => this.addItem(item));
    } else {
      this.addItem(items);
    }
  }

  addItem(item) {
    if (item?.el instanceof HTMLElement) {
      this.content.append(item.el);
      return;
    }

    let element;
    switch (item.type) {
      case "radio":
        element = new Radio(item.options || [], item.groupOptions || {});
        break;
      case "checkbox":
        element = new Checkbox(item);
        break;
      case "input":
        element = new Inpute(item);
        break;
      case "button":
      default:
        element = new Button(item);
        break;
    }

    if (element?.el) {
      this.content.append(element.el);
    }
  }

  open() {
    document.body.appendChild(this.el);
    this.el.style.transition = "none";
    this.el.classList.remove("open", "closing");

    requestAnimationFrame(() => {
      this.el.style.transition = "";
      this.el.classList.add("open");
    });

    ModalMenu.stack.push(this);
    return this;
  }

  close() {
    if (!this.el.classList.contains("open")) return this;

    this.el.classList.remove("open");
    this.el.classList.add("closing");

    const onTransitionEnd = () => {
      this.el.removeEventListener("transitionend", onTransitionEnd);
      this.el.classList.remove("closing");
      if (this.el.parentNode) {
        document.body.removeChild(this.el);
      }
    };

    this.el.addEventListener("transitionend", onTransitionEnd);
    const index = ModalMenu.stack.indexOf(this);
    if (index > -1) ModalMenu.stack.splice(index, 1);

    return this;
  }
}
class ContorllerTable {
  constructor() {
    this.setAll = new Set(getLocalStorageValue("setAll", arrMonstersAll));
    this.setAutoSetting = new Set(getLocalStorageValue("setAutoSetting", arrFightMonsters));
    this.setFight = new Set(getLocalStorageValue("setFight", []));
    this.setCapture = new Set(getLocalStorageValue("setCapture", []));
    this.setSurrender = new Set(getLocalStorageValue("setSurrender", []));
    this.setSwitch = new Set(getLocalStorageValue("setSwitch", []));
    this.setAttackOne = new Set(getLocalStorageValue("setAttackOne", []));
    this.setAttackTwo = new Set(getLocalStorageValue("setAttackTwo", []));
    this.setAttackThree = new Set(getLocalStorageValue("setAttackThree", []));
    this.setAttackFour = new Set(getLocalStorageValue("setAttackFour", []));
    this.setMap = {
      Редкие: this.setAll,
      Частые: this.setFight,
      Ловить: this.setCapture,
      Сдаться: this.setSurrender,
      Сменить: this.setSwitch,
      "Атака 1": this.setAttackOne,
      "Атака 2": this.setAttackTwo,
      "Атака 3": this.setAttackThree,
      "Атака 4": this.setAttackFour,
    };

    this.currentOpenMenu = null;

    const categoryArr = Object.keys(this.setMap);

    this.table = document.createElement("div");
    this.table.classList.add("table-control");

    this.tableHeader = document.createElement("div");
    this.tableHeader.classList.add("tableHeaderMenu");

    this.category = document.createElement("div");
    this.category.classList.add("category", "custom-scroll");

    this.categoryBlocks = {};

    categoryArr.forEach((name) => {
      const block = document.createElement("div");
      block.classList.add("category-block");

      const header = document.createElement("div");
      header.classList.add("category-header");
      header.textContent = name;

      const content = document.createElement("div");
      content.classList.add("category-content", "custom-scroll");

      block.append(header, content);
      this.category.appendChild(block);

      this.categoryBlocks[name] = content;
    });

    this.input = document.createElement("input");
    this.input.classList.add("input-search");
    this.input.placeholder = "Поиск монстра...";
    this.debouncedSearch = this.debounce(this.searchMonster.bind(this), 200);
    this.input.addEventListener("input", (e) => {
      this.debouncedSearch(e.target.value);
    });

    this.autoSetting = document.createElement("div");
    this.autoSetting.classList.add("auto-settings");
    this.autoSetting.textContent = "Автонастройка";
    this.autoSetting.addEventListener("click", () => {
      for (const item of this.setAutoSetting) {
        // Если элемент есть в setAll, удаляем его из setAll и добавляем в setFight
        if (this.setAll.has(item)) {
          this.setAll.delete(item);
          this.setFight.add(item);
        }
      }

      setLocalStorageValue("setAll", Array.from(this.setAll));
      setLocalStorageValue("setFight", Array.from(this.setFight));

      // Перерисовываем все данные
      this.renderInitial();
    });
    this.tableHeader.append(this.input, this.autoSetting);
    this.table.append(this.tableHeader, this.category);

    this.renderInitial();
    this.setupInternalClickListener();
  }

  renderInitial() {
    Object.values(this.categoryBlocks).forEach((block) => (block.innerHTML = ""));
    for (const [category, set] of Object.entries(this.setMap)) {
      set.forEach((name) => {
        const item = this.createItem(name, category);
        this.categoryBlocks[category].appendChild(item);
      });
    }
  }

  createItem(name, currentCategory) {
    const item = document.createElement("div");
    item.textContent = name;
    item.classList.add("category-item");

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.currentOpenMenu === item) {
        this.closeMenu();
      } else {
        this.closeMenu();
        this.showMoveMenu(name, currentCategory, item);
      }
    });

    return item;
  }

  showMoveMenu(name, fromCategory, itemElement) {
    this.closeMenu();

    const menu = document.createElement("div");
    menu.classList.add("moveMenu", "custom-scroll");

    const menuHeader = document.createElement("div");
    menuHeader.classList.add("moveMenu-header");
    menuHeader.innerHTML = `Переместить <b>${name}</b> в`;

    const menuHr = document.createElement("div");
    menuHr.classList.add("modalHr");

    const contentMenu = document.createElement("div");
    contentMenu.classList.add("moveMenuContent");

    menu.append(menuHeader, menuHr, contentMenu);

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    contentMenu.addEventListener("click", (e) => {
      if (e.target.classList.contains("moveMenu-btn")) {
        const toCategory = e.target.textContent;
        this.moveItem(name, fromCategory, toCategory, itemElement);
        this.closeMenu();
      }
    });

    for (const toCategory in this.setMap) {
      if (toCategory !== fromCategory) {
        const btn = document.createElement("div");
        btn.classList.add("moveMenu-btn");
        btn.textContent = toCategory;
        contentMenu.appendChild(btn);
      }
    }

    this.category.appendChild(menu);
    this.currentOpenMenu = menu;
  }

  closeMenu() {
    if (this.currentOpenMenu) {
      this.currentOpenMenu.remove();
      this.currentOpenMenu = null;
    }
  }

  moveItem(name, fromCategory, toCategory, itemElement) {
    this.setMap[fromCategory].delete(name);
    this.setMap[toCategory].add(name);

    const newContainer = this.categoryBlocks[toCategory];
    const newItem = this.createItem(name, toCategory);

    newContainer.appendChild(newItem);
    itemElement.remove();

    for (const [category, set] of Object.entries(this.setMap)) {
      setLocalStorageValue(
        category === "Редкие"
          ? "setAll"
          : category === "Частые"
          ? "setFight"
          : category === "Ловить"
          ? "setCapture"
          : category === "Сдаться"
          ? "setSurrender"
          : category === "Сменить"
          ? "setSwitch"
          : category === "Атака 1"
          ? "setAttackOne"
          : category === "Атака 2"
          ? "setAttackTwo"
          : category === "Атака 3"
          ? "setAttackThree"
          : "setAttackFour",
        Array.from(set)
      );
    }
  }

  setupInternalClickListener() {
    this.table.addEventListener("click", () => {
      if (this.currentOpenMenu) {
        this.closeMenu();
      }
    });
  }

  debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  searchMonster(value) {
    const searchTerm = value.trim().toLowerCase();

    const allItems = this.table.querySelectorAll(".category-item");
    let exactMatch = null;
    let partialMatch = null;

    allItems.forEach((item) => {
      item.classList.remove("found");

      const itemText = item.textContent.toLowerCase();

      if (searchTerm && itemText.includes(searchTerm)) {
        item.classList.add("found");

        if (itemText === searchTerm) {
          exactMatch = item;
        } else if (!partialMatch) {
          partialMatch = item;
        }
      }
    });
    const matchToScroll = exactMatch || partialMatch;
    if (matchToScroll) {
      matchToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}
const controllerTable = new ContorllerTable();
