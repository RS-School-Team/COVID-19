const shuffle = (arr) => {
  const result = [...arr];
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = result[j];
    result[j] = result[i];
    result[i] = temp;
  }
  return result;
};
const create = (el, classNames, child, parent, ...dataAttr) => {
  let element = null;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! Give a proper tag name');
  }

  if (classNames) element.classList.add(...classNames.split(' '));

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object') {
    element.appendChild(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      }
      if (attrName.match(/id|value|src|id|type|placeholder|href|alt|title|target/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
};

const importAll = (r) => r.keys().map(r);

const importAllSVG = (r) => {
  const names = [...r.keys()];
  return [names, r.keys().map(r)];
};

const findTarget = (target, lookingAction) => {
  let pointTarget = target;
  while (pointTarget) {
    if (pointTarget.dataset) {
      if (pointTarget.dataset[lookingAction]) {
        const action = pointTarget.dataset[lookingAction];
        const { name } = pointTarget.dataset;
        if (action) return { action, name };
      }
    }
    pointTarget = pointTarget.parentNode;
  }
  return false;
};

const qs = (selector, scope) => (scope || document).querySelector(selector);

const fullScreenSwitcher = (name) => {
  const container = qs(`.${name}__container`);
  container.classList.toggle('full-screen');
};

export { create, importAll, findTarget, shuffle, qs, fullScreenSwitcher, importAllSVG };
