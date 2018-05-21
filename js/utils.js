let utils = (function (window) {
  // get style
  let getCss = function (ele, attr) {

    if ("getComputedStyle" in window) {
      let val = window.getComputedStyle(ele, null)[attr];
      if (!isNaN(val)) {
        let reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
        reg.test(val) ? val = parseFloat(val) : null;
      }
      return val;
    } else {
      return;
    }
  };
  // set single style
  let setCss = function (ele, attr, val) {
    if (!isNaN(val)) {
      if (!/^(opacity|zIndex)$/.test(attr)) {
        val += "px";
      }
    }
    ele.style[attr] = val;
  };
  // set group style
  let setGroupCss = function (ele, options) {
    for (let attr in options) {
      if (options.hasOwnProperty(attr)) {
        setCss(ele, attr, options[attr]);
      }
    }
  };
  // all in one to get, set, set group style
  let css = function (...arg) {
    let fn = getCss;
    let len = arg.length;
    if (len >= 3) {
      fn = setCss;
    }
    len === 2 && (typeof arg[1] === "object") ? fn = setGroupCss : null;
    return fn(...arg);
  };

  // each: iterate array, array like, object
  let each = function (obj, callback) {
    // array or array like
    if ("length" in obj) {
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i];
        let res = callback && callback(item, i, item);
        if (res === false) {
          break;
        }
      }
    }
    // object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let val = obj[key];
        let res = callback && callback(val, key, val);
        if (res === false) {
          break;
        }
      }
    }
  };

  return { css, each }

})(window);


(function () {
  // linear animation function
  let effect = {
    Linear: (t, b, c, d) => t / d * c + b
  };

  window.animate = function animate(ele, target, duration=1000, callback) {
    let interval = 17;

    // handle 3rd argument
    if (typeof duration === "function") {
      callback = duration;
      duration = 1000;
    }

    // prepare datas
    let time = 0;
    let begin = {};
    let change = {};
    utils.each(target, (key, value) => {
      begin[key] = utils.css(ele, key);
      change[key] = target[key] - begin[key];
    });

    // animating
    clearInterval(ele.animateTimer);
    ele.animateTimer = setInterval(() => {
      time += interval;
      // animation end
      if (time >= duration) {
        clearInterval(ele.animateTimer);
        utils.css(ele, target);
        callback && callback.call(ele);
        return;
      }
      // get and set current ele style
      utils.each(target, (key, value) => {
        let current = effect.Linear(time, begin[key], change[key], duration);
        utils.css(ele, key, current);
      });
    }, interval);
  };
})();