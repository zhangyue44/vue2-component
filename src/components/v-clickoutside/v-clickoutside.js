const ctx = "@@clickoutsideContext";
const nodeList = [];
let seed = 0;
let startClick = null;

document.addEventListener("mousedown", (e) => {
  startClick = e;
});
document.addEventListener("mouseup", (e) => {
  console.log(nodeList);
  nodeList.forEach((node) => node[ctx].documentHandler(e, startClick));
});

function createDocumentHandler(el, binding, vnode, excludes) {
  return function (mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    ) {
      return;
    }
    if (excludes && (excludes.includes(mousedown.target) || excludes.includes(mouseup.target))) {
      return;
    }
    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      methodName: binding.expression,
      bindingFn: binding.value === "function" ? binding.value : binding.value.fn,
      documentHandler: createDocumentHandler(el, binding, vnode, binding.value.excludes),
    };
  },
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode, binding.value.excludes);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = typeof binding.value === "function" ? binding.value : binding.value.fn;
  },
  unbind(el) {
    const len = nodeList.length;
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  },
};
