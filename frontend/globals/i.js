const modules = import.meta.glob('../images/*.jsx', { eager: true });

const i = {};

for (const path in modules) {
  const component = path.split('/').pop().replace(/\.jsx$/, '');
  i[component] = modules[path].default;
}

window.i = new Proxy(i, {
  get: (obj, prop) => {
    if (i[prop] === undefined) {
      throw new Error(`icons.${prop}`);
    }

    return function (style) {
      if (typeof style != 'object') throw new Error(`${prop} DOES NOT HAVE STYLE`);
      return i[prop](style, prop);
    }
  }
});
