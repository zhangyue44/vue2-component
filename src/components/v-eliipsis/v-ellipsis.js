const trim = function trim(string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};
const hasClass = function hasClass(el, cls) {
  if (!el || !cls || cls.indexOf(" ") !== -1) {
    return false;
  }
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return " ".concat(el.className, " ").indexOf(" ".concat(cls, " ")) > -1;
};
const addClass = function addClass(el, cls) {
  let curClass = el.className;
  const classes = (cls || "").split(" ");
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }
    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " ".concat(clsName);
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};
const removeClass = function removeClass(el, cls) {
  const classes = cls.split(" ");
  let curClass = " ".concat(el.className, " ");
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }
    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" ".concat(clsName, " "), " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};
const updateCls = (el, binding) => {
  addClass(el, "h-yueEllipsis");
  // 处理修饰符
  binding.modifiers.block ? addClass(el, "display-block") : removeClass(el, "display-block");
  binding.modifiers.nonFull ? addClass(el, "non-full") : removeClass(el, "non-full");
};

const hover = (e) => {
  const t = e.target;
  t.title = t.clientWidth < t.scrollWidth ? t.innerText : "";
};
export default {
  bind(el, binding) {
    updateCls(el, binding);
    el.addEventListener("mouseenter", hover);
  },
  update(el, binding) {
    updateCls(el, binding);
  },
  unbind(el) {
    removeClass(el, "h-ellipsis display-block non-full");
    el.removeEventListener("mouseenter", hover);
  },
};
