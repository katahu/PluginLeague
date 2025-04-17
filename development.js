class Button {
  constructor(options) {
    if (Array.isArray(options)) {
      this.buttons = options.map((opt) => new Button(opt));
      return;
    }

    this.el = document.createElement("div");
    this.el.classList.add("menuItem");

    if (options.icon) {
      const i = document.createElement("i");
      i.classList.add(...options.icon.split(" "));
      this.el.prepend(i);
    }

    if (options.text) this.el.append(options.text);

    if (options.onClick) {
      this.el.addEventListener("click", (e) => {
        e.stopPropagation();
        options.onClick();
      });
    }
  }
}
class Radio {
  constructor(options, groupOptions = {}) {
    this.groupWrapper = document.createElement("div");
    this.groupWrapper.classList.add("radio-group");

    const storageKey = groupOptions.storageKey || `radio-group-${options[0].name}`;
    const savedValue = getLocalStorageValue(storageKey, null);

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
    this.inp.type = "text";

    if (options.placeholder) this.inp.placeholder = options.placeholder;
    this.inp.autocomplete = options.hasOwnProperty("autocomplete") ? "on" : "off";

    this.el.append(this.inp);
    const savedValue = options.storageKey ? getLocalStorageValue(options.storageKey, null) : null;
    this.inp.value = savedValue !== null ? savedValue : "";
    this.inp.addEventListener("input", (e) => {
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
