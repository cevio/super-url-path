const list = {
  any: '.+',
  string: '[a-zA-Z0-9]+',
  number: '\\d+'
}

const NotFoundError = (name) => {
  return new Error('can not find the type of ' + name);
}

module.exports = class SuperUrlPath {
  static addType(name, value) {
    if (typeof value !== 'string') {
      throw new Error('SuperUrlPath.addType excpect a value of string, but got a value of ' + typeof value);
    }
    list[name] = value;
  }

  constructor(path) {
    this.path = path;
    this.init();
  }

  init() {
    const chunks = this.path.split('/');
    const params = {};
    const match_tree = [];
    const exec_tree = [];
    let _idx = 0;
    this.deep = chunks.length;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const exec = /\{([^\}]+)\}/.test(chunk);
      if (!exec) {
        const delta = transformRegExp(chunk);
        match_tree.push(delta);
        exec_tree.push(delta);
        continue;
      }
      const pathArray = chunk.split(/\{([^\}]+)\}/g);
      const match_pathes = [];
      const exec_pathes = [];
      for (let j = 0; j < pathArray.length; j++) {
        const item = pathArray[j];
        if (j % 2 === 1) {
          const { token, regexp, ignore } = format(item);
          params[token] = {
            index: ++_idx,
            regexp, ignore
          };
          exec_pathes.push(ignore ? '(.+?)?' : '(.+?)');
          if (!list[regexp]) throw NotFoundError(regexp);
          if (ignore) {
            match_pathes.push(`(${list[regexp]})?`);
          } else {
            match_pathes.push(`(${list[regexp]})`);
          }
        } else {
          const _value = transformRegExp(item);
          exec_pathes.push(_value);
          match_pathes.push(_value);
        }
      }
      match_tree.push(match_pathes.join(''));
      exec_tree.push(exec_pathes.join(''));
    }
    this.match_regexp = new RegExp('^' + match_tree.join('\\/') + '$');
    this.exec_regexp = new RegExp('^' + exec_tree.join('\\/') + '$');
    this.params = params;
  }

  router(options) {
    let path = this.path;
    for (const i in this.params) {
      const param = this.params[i];
      if (!list[param.regexp]) throw NotFoundError(param.regexp);
      const reg = new RegExp('^' + list[param.regexp] + '$');
      if (param.ignore) {
        if (options[i]) {
          if (!reg.test(options[i])) {
            throw new Error(`the optional parameter ${i} is not the specified data type<${param.regexp}>`);
          }
        }
      } else {
        if (!options[i]) throw new Error(`'${i}<${param.regexp}>' is required on '${this.path}'`);
        if (!reg.test(options[i])) {
          throw new Error(`parameter ${i} is not the specified data type<${param.regexp}>`);
        }
      }
      path = path.replace(new RegExp(`\\{\\s*?${i}(\\?)?\\:[^\\}]+\\}`), options[i] || '');
    }
    return path;
  }

  match(url) {
    return this.match_regexp.test(url);
  }

  exec(url) {
    if (!this.match(url)) return;
    const exec = this.exec_regexp.exec(url);
    const res = {};
    for (const i in this.params) {
      res[i] = exec[this.params[i].index];
    }
    return res;
  }
}

function format(exp) {
  const _exp = exp.split(':');
  let token = _exp[0].trim();
  const regexp = _exp[1] ? _exp[1].trim() : 'any';
  const ignore = token[token.length - 1] === '?';
  if (ignore) {
    token = token.substr(0, token.length - 1);
  }
  return {
    token, regexp, ignore
  }
}

function transformRegExp(str) {
  const detail = '^$.*+-?=!:|\/()[]{}';
  for (let i = 0; i < detail.length; i++) {
    str = str.replace(new RegExp('\\' + detail[i], 'g'), `\\${detail[i]}`);
  }
  return str;
}