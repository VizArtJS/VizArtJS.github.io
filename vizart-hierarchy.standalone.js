
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VizArtHierarchy = {})));
}(this, (function (exports) { 'use strict';

  var version = "2.0.5";

  function ascending (a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector (compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
        }
        return lo;
      },
      right: function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function (d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  function number (x) {
    return x === null ? NaN : +x;
  }

  function extent (values, valueof) {
    var n = values.length,
        i = -1,
        value,
        min,
        max;

    if (valueof == null) {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          min = max = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = values[i]) != null) {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
    } else {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          min = max = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null) {
              if (min > value) min = value;
              if (max < value) max = value;
            }
          }
        }
      }
    }

    return [min, max];
  }

  function range (start, stop, step) {
    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        range = new Array(n);

    while (++i < n) {
      range[i] = start + i * step;
    }

    return range;
  }

  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function ticks (start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
          start = Math.ceil(start / step);
          stop = Math.floor(stop / step);
          ticks = new Array(n = Math.ceil(stop - start + 1));
          while (++i < n) {
              ticks[i] = (start + i) * step;
          }
      } else {
          start = Math.floor(start * step);
          stop = Math.ceil(stop * step);
          ticks = new Array(n = Math.ceil(start - stop + 1));
          while (++i < n) {
              ticks[i] = (start - i) / step;
          }
      }

      if (reverse) ticks.reverse();

      return ticks;
  }

  function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
  }

  function quantile (values, p, valueof) {
    if (valueof == null) valueof = number;
    if (!(n = values.length)) return;
    if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
    if (p >= 1) return +valueof(values[n - 1], n - 1, values);
    var n,
        i = (n - 1) * p,
        i0 = Math.floor(i),
        value0 = +valueof(values[i0], i0, values),
        value1 = +valueof(values[i0 + 1], i0 + 1, values);
    return value0 + (value1 - value0) * (i - i0);
  }

  function max (values, valueof) {
    var n = values.length,
        i = -1,
        value,
        max;

    if (valueof == null) {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          max = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = values[i]) != null && value > max) {
              max = value;
            }
          }
        }
      }
    } else {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          max = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null && value > max) {
              max = value;
            }
          }
        }
      }
    }

    return max;
  }

  function min (values, valueof) {
    var n = values.length,
        i = -1,
        value,
        min;

    if (valueof == null) {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = values[i]) != null && value >= value) {
          min = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = values[i]) != null && min > value) {
              min = value;
            }
          }
        }
      }
    } else {
      while (++i < n) {
        // Find the first comparable value.
        if ((value = valueof(values[i], i, values)) != null && value >= value) {
          min = value;
          while (++i < n) {
            // Compare the remaining values.
            if ((value = valueof(values[i], i, values)) != null && min > value) {
              min = value;
            }
          }
        }
      }
    }

    return min;
  }

  var prefix = "$";

  function Map() {}

  Map.prototype = map$1.prototype = {
    constructor: Map,
    has: function has(key) {
      return prefix + key in this;
    },
    get: function get(key) {
      return this[prefix + key];
    },
    set: function set(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function remove(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function clear() {
      for (var property in this) {
        if (property[0] === prefix) delete this[property];
      }
    },
    keys: function keys() {
      var keys = [];
      for (var property in this) {
        if (property[0] === prefix) keys.push(property.slice(1));
      }return keys;
    },
    values: function values() {
      var values = [];
      for (var property in this) {
        if (property[0] === prefix) values.push(this[property]);
      }return values;
    },
    entries: function entries() {
      var entries = [];
      for (var property in this) {
        if (property[0] === prefix) entries.push({ key: property.slice(1), value: this[property] });
      }return entries;
    },
    size: function size() {
      var size = 0;
      for (var property in this) {
        if (property[0] === prefix) ++size;
      }return size;
    },
    empty: function empty() {
      for (var property in this) {
        if (property[0] === prefix) return false;
      }return true;
    },
    each: function each(f) {
      for (var property in this) {
        if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    }
  };

  function map$1(object, f) {
    var map = new Map();

    // Copy constructor.
    if (object instanceof Map) object.each(function (value, key) {
      map.set(key, value);
    });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) {
          map.set(i, object[i]);
        } else while (++i < n) {
          map.set(f(o = object[i], i, object), o);
        }
      }

      // Convert object to map.
      else if (object) for (var key in object) {
          map.set(key, object[key]);
        }return map;
  }

  function Set() {}

  var proto = map$1.prototype;

  Set.prototype = set.prototype = {
    constructor: Set,
    has: proto.has,
    add: function add(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function set(object, f) {
    var set = new Set();

    // Copy constructor.
    if (object instanceof Set) object.each(function (value) {
      set.add(value);
    });

    // Otherwise, assume it’s an array.
    else if (object) {
        var i = -1,
            n = object.length;
        if (f == null) while (++i < n) {
          set.add(object[i]);
        } else while (++i < n) {
          set.add(f(object[i], i, object));
        }
      }

    return set;
  }

  var array$1 = Array.prototype;

  var map$2 = array$1.map;
  var slice$1 = array$1.slice;

  var implicit = { name: "implicit" };

  function ordinal(range) {
    var index = map$1(),
        domain = [],
        unknown = implicit;

    range = range == null ? [] : slice$1.call(range);

    function scale(d) {
      var key = d + "",
          i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function (_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = map$1();
      var i = -1,
          n = _.length,
          d,
          key;
      while (++i < n) {
        if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      }return scale;
    };

    scale.range = function (_) {
      return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
    };

    scale.unknown = function (_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function () {
      return ordinal().domain(domain).range(range).unknown(unknown);
    };

    return scale;
  }

  function define (constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) {
      prototype[key] = definition[key];
    }return prototype;
  }

  function Color() {}

  var _darker = 0.7;
  var _brighter = 1 / _darker;
  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex3 = /^#([0-9a-f]{3})$/,
      reHex6 = /^#([0-9a-f]{6})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function displayable() {
      return this.rgb().displayable();
    },
    toString: function toString() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
    ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
    : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
    : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
    : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
    : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
    : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
    : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
    : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function brighter(k) {
      k = k == null ? _brighter : Math.pow(_brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function darker(k) {
      k = k == null ? _darker : Math.pow(_darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function rgb() {
      return this;
    },
    displayable: function displayable() {
      return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
    },
    toString: function toString() {
      var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function brighter(k) {
      k = k == null ? _brighter : Math.pow(_brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function darker(k) {
      k = k == null ? _darker : Math.pow(_darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function rgb() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    displayable: function displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  var Kn = 18,
      Xn = 0.950470,
      // D65 standard referent
  Yn = 1,
      Zn = 1.088830,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var b = rgb2xyz(o.r),
        a = rgb2xyz(o.g),
        l = rgb2xyz(o.b),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function brighter(k) {
      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function darker(k) {
      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function rgb$$1() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);
      return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function brighter(k) {
      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
    },
    darker: function darker(k) {
      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
    },
    rgb: function rgb$$1() {
      return labConvert(this).rgb();
    }
  }));

  var A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;

  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
        // NaN if l=0 or l=1
    h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function brighter$$1(k) {
      k = k == null ? _brighter : Math.pow(_brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function darker$$1(k) {
      k = k == null ? _darker : Math.pow(_darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function rgb$$1() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
    }
  }));

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1,
        t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
  }

  function basis$1 (values) {
    var n = values.length - 1;
    return function (t) {
      var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant$1 (x) {
    return function () {
      return x;
    };
  }

  function linear(a, d) {
    return function (t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function (a, b) {
      return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color$$1 = gamma(y);

    function rgb$$1(start, end) {
      var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
          g = color$$1(start.g, end.g),
          b = color$$1(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function (t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$$1.gamma = rgbGamma;

    return rgb$$1;
  })(1);

  function rgbSpline(spline) {
    return function (colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i,
          color$$1;
      for (i = 0; i < n; ++i) {
        color$$1 = rgb(colors[i]);
        r[i] = color$$1.r || 0;
        g[i] = color$$1.g || 0;
        b[i] = color$$1.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color$$1.opacity = 1;
      return function (t) {
        color$$1.r = r(t);
        color$$1.g = g(t);
        color$$1.b = b(t);
        return color$$1 + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);

  function array$2 (a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) {
      x[i] = interpolateValue(a[i], b[i]);
    }for (; i < nb; ++i) {
      c[i] = b[i];
    }return function (t) {
      for (i = 0; i < na; ++i) {
        c[i] = x[i](t);
      }return c;
    };
  }

  function date (a, b) {
    var d = new Date();
    return a = +a, b -= a, function (t) {
      return d.setTime(a + b * t), d;
    };
  }

  function interpolateNumber (a, b) {
    return a = +a, b -= a, function (t) {
      return a + b * t;
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function object (a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || (typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") a = {};
    if (b === null || (typeof b === "undefined" ? "undefined" : _typeof(b)) !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolateValue(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function (t) {
      for (k in i) {
        c[k] = i[k](t);
      }return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function () {
      return b;
    };
  }

  function one(b) {
    return function (t) {
      return b(t) + "";
    };
  }

  function interpolateString (a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0,
        // scan index for next number in b
    am,
        // current match in a
    bm,
        // current match in b
    bs,
        // string preceding current number in b, if any
    i = -1,
        // index in s
    s = [],
        // string constants and placeholders
    q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) {
        // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else {
        // interpolate non-matching numbers
        s[++i] = null;
        q.push({ i: i, x: interpolateNumber(am, bm) });
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
      for (var i = 0, o; i < b; ++i) {
        s[(o = q[i]).i] = o.x(t);
      }return s.join("");
    });
  }

  function interpolateValue (a, b) {
      var t = typeof b === "undefined" ? "undefined" : _typeof(b),
          c;
      return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? array$2 : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : interpolateNumber)(a, b);
  }

  function interpolateRound (a, b) {
    return a = +a, b -= a, function (t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose (a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode, cssRoot, cssView, svgNode;

  function parseCss(value) {
    if (value === "none") return identity$1;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({ i: i - 4, x: interpolateNumber(xa, xb) }, { i: i - 2, x: interpolateNumber(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i - 4, x: interpolateNumber(xa, xb) }, { i: i - 2, x: interpolateNumber(ya, yb) });
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function (a, b) {
      var s = [],
          // string constants and placeholders
      q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function (t) {
        var i = -1,
            n = q.length,
            o;
        while (++i < n) {
          s[(o = q[i]).i] = o.x(t);
        }return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var rho = Math.SQRT2,
      rho2 = 2,
      rho4 = 4,
      epsilon2 = 1e-12;

  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }

  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }

  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function interpolateZoom (p0, p1) {
    var ux0 = p0[0],
        uy0 = p0[1],
        w0 = p0[2],
        ux1 = p1[0],
        uy1 = p1[1],
        w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function i(t) {
        return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
      };
    }

    // General case.
    else {
        var d1 = Math.sqrt(d2),
            b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
            b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
            r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
            r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        S = (r1 - r0) / rho;
        i = function i(t) {
          var s = t * S,
              coshr0 = cosh(r0),
              u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
          return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
        };
      }

    i.duration = S * 1000;

    return i;
  }

  function cubehelix$1(hue$$1) {
    return function cubehelixGamma(y) {
      y = +y;

      function cubehelix$$1(start, end) {
        var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function (t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix$$1.gamma = cubehelixGamma;

      return cubehelix$$1;
    }(1);
  }

  cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);

  function constant$2 (x) {
    return function () {
      return x;
    };
  }

  function number$1 (x) {
    return +x;
  }

  var unit = [0, 1];

  function deinterpolateLinear(a, b) {
    return (b -= a = +a) ? function (x) {
      return (x - a) / b;
    } : constant$2(b);
  }

  function deinterpolateClamp(deinterpolate) {
    return function (a, b) {
      var d = deinterpolate(a = +a, b = +b);
      return function (x) {
        return x <= a ? 0 : x >= b ? 1 : d(x);
      };
    };
  }

  function reinterpolateClamp(reinterpolate) {
    return function (a, b) {
      var r = reinterpolate(a = +a, b = +b);
      return function (t) {
        return t <= 0 ? a : t >= 1 ? b : r(t);
      };
    };
  }

  function bimap(domain, range$$1, deinterpolate, reinterpolate) {
    var d0 = domain[0],
        d1 = domain[1],
        r0 = range$$1[0],
        r1 = range$$1[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function (x) {
      return r0(d0(x));
    };
  }

  function polymap(domain, range$$1, deinterpolate, reinterpolate) {
    var j = Math.min(domain.length, range$$1.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range$$1 = range$$1.slice().reverse();
    }

    while (++i < j) {
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
    }

    return function (x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp());
  }

  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
  function continuous(deinterpolate, reinterpolate) {
    var domain = unit,
        range$$1 = unit,
        interpolate$$1 = interpolateValue,
        clamp = false,
        piecewise$$1,
        output,
        input;

    function rescale() {
      piecewise$$1 = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return (output || (output = piecewise$$1(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
    }

    scale.invert = function (y) {
      return (input || (input = piecewise$$1(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function (_) {
      return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
    };

    scale.range = function (_) {
      return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
    };

    scale.rangeRound = function (_) {
      return range$$1 = slice$1.call(_), interpolate$$1 = interpolateRound, rescale();
    };

    scale.clamp = function (_) {
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function (_) {
      return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
    };

    return rescale();
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal (x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i,
        coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
  }

  function exponent (x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup (grouping, thousands) {
    return function (value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals (numerals) {
    return function (value) {
      return value.replace(/[0-9]/g, function (i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    this.fill = match[1] || " ";
    this.align = match[2] || ">";
    this.sign = match[3] || "-";
    this.symbol = match[4] || "";
    this.zero = !!match[5];
    this.width = match[6] && +match[6];
    this.comma = !!match[7];
    this.precision = match[8] && +match[8].slice(1);
    this.trim = !!match[9];
    this.type = match[10] || "";
  }

  FormatSpecifier.prototype.toString = function () {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim (s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".":
          i0 = i1 = i;break;
        case "0":
          if (i0 === 0) i0 = i;i1 = i;break;
        default:
          if (i0 > 0) {
            if (!+s[i]) break out;i0 = 0;
          }break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto (x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded (x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": function _(x, p) {
      return (x * 100).toFixed(p);
    },
    "b": function b(x) {
      return Math.round(x).toString(2);
    },
    "c": function c(x) {
      return x + "";
    },
    "d": function d(x) {
      return Math.round(x).toString(10);
    },
    "e": function e(x, p) {
      return x.toExponential(p);
    },
    "f": function f(x, p) {
      return x.toFixed(p);
    },
    "g": function g(x, p) {
      return x.toPrecision(p);
    },
    "o": function o(x) {
      return Math.round(x).toString(8);
    },
    "p": function p(x, _p) {
      return formatRounded(x * 100, _p);
    },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function X(x) {
      return Math.round(x).toString(16).toUpperCase();
    },
    "x": function x(_x) {
      return Math.round(_x).toString(16);
    }
  };

  function identity$2 (x) {
    return x;
  }

  var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

  function formatLocale (locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$2,
        currency = locale.currency,
        decimal = locale.decimal,
        numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$2,
        percent = locale.percent || "%";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i,
            n,
            c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Perform the initial formatting.
          var valueNegative = value < 0;
          value = formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero during formatting, treat as positive.
          if (valueNegative && +value === 0) valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<":
            value = valuePrefix + value + valueSuffix + padding;break;
          case "=":
            value = valuePrefix + padding + value + valueSuffix;break;
          case "^":
            value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);break;
          default:
            value = padding + valuePrefix + value + valueSuffix;break;
        }

        return numerals(value);
      }

      format.toString = function () {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function (value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed (step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix (step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound (step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  function tickFormat (domain, count, specifier) {
    var start = domain[0],
        stop = domain[domain.length - 1],
        step = tickStep(start, stop, count == null ? 10 : count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s":
        {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
      case "":
      case "e":
      case "g":
      case "p":
      case "r":
        {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
      case "f":
      case "%":
        {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function (count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function (count, specifier) {
      return tickFormat(domain(), count, specifier);
    };

    scale.nice = function (count) {
      if (count == null) count = 10;

      var d = domain(),
          i0 = 0,
          i1 = d.length - 1,
          start = d[i0],
          stop = d[i1],
          step;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }

      step = tickIncrement(start, stop, count);

      if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
        step = tickIncrement(start, stop, count);
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
        step = tickIncrement(start, stop, count);
      }

      if (step > 0) {
        d[i0] = Math.floor(start / step) * step;
        d[i1] = Math.ceil(stop / step) * step;
        domain(d);
      } else if (step < 0) {
        d[i0] = Math.ceil(start * step) / step;
        d[i1] = Math.floor(stop * step) / step;
        domain(d);
      }

      return scale;
    };

    return scale;
  }

  function linear$1() {
    var scale = continuous(deinterpolateLinear, interpolateNumber);

    scale.copy = function () {
      return copy(scale, linear$1());
    };

    return linearish(scale);
  }

  function raise(x, exponent) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  }

  function pow() {
    var exponent = 1,
        scale = continuous(deinterpolate, reinterpolate),
        domain = scale.domain;

    function deinterpolate(a, b) {
      return (b = raise(b, exponent) - (a = raise(a, exponent))) ? function (x) {
        return (raise(x, exponent) - a) / b;
      } : constant$2(b);
    }

    function reinterpolate(a, b) {
      b = raise(b, exponent) - (a = raise(a, exponent));
      return function (t) {
        return raise(a + b * t, 1 / exponent);
      };
    }

    scale.exponent = function (_) {
      return arguments.length ? (exponent = +_, domain(domain())) : exponent;
    };

    scale.copy = function () {
      return copy(scale, pow().exponent(exponent));
    };

    return linearish(scale);
  }

  function sqrt() {
    return pow().exponent(0.5);
  }

  function quantile$1() {
    var domain = [],
        range$$1 = [],
        thresholds = [];

    function rescale() {
      var i = 0,
          n = Math.max(1, range$$1.length);
      thresholds = new Array(n - 1);
      while (++i < n) {
        thresholds[i - 1] = quantile(domain, i / n);
      }return scale;
    }

    function scale(x) {
      if (!isNaN(x = +x)) return range$$1[bisectRight(thresholds, x)];
    }

    scale.invertExtent = function (y) {
      var i = range$$1.indexOf(y);
      return i < 0 ? [NaN, NaN] : [i > 0 ? thresholds[i - 1] : domain[0], i < thresholds.length ? thresholds[i] : domain[domain.length - 1]];
    };

    scale.domain = function (_) {
      if (!arguments.length) return domain.slice();
      domain = [];
      for (var i = 0, n = _.length, d; i < n; ++i) {
        if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
      }domain.sort(ascending);
      return rescale();
    };

    scale.range = function (_) {
      return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
    };

    scale.quantiles = function () {
      return thresholds.slice();
    };

    scale.copy = function () {
      return quantile$1().domain(domain).range(range$$1);
    };

    return scale;
  }

  var t0$1 = new Date(),
      t1$1 = new Date();

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.ceil = function (date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function (date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function (date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function (start, stop, step) {
      var range = [];
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do {
        range.push(new Date(+start));
      } while ((offseti(start, step), floori(start), start < stop));
      return range;
    };

    interval.filter = function (test) {
      return newInterval(function (date) {
        if (date >= date) while (floori(date), !test(date)) {
          date.setTime(date - 1);
        }
      }, function (date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function (start, end) {
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      };

      interval.every = function (step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
          return field(d) % step === 0;
        } : function (d) {
          return interval.count(0, d) % step === 0;
        });
      };
    }

    return interval;
  }

  var millisecond = newInterval(function () {
    // noop
  }, function (date, step) {
    date.setTime(+date + step);
  }, function (start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function (k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function (date) {
      date.setTime(Math.floor(date / k) * k);
    }, function (date, step) {
      date.setTime(+date + step * k);
    }, function (start, end) {
      return (end - start) / k;
    });
  };
  var milliseconds = millisecond.range;

  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var second = newInterval(function (date) {
    date.setTime(Math.floor(date / durationSecond) * durationSecond);
  }, function (date, step) {
    date.setTime(+date + step * durationSecond);
  }, function (start, end) {
    return (end - start) / durationSecond;
  }, function (date) {
    return date.getUTCSeconds();
  });
  var seconds = second.range;

  var minute = newInterval(function (date) {
    date.setTime(Math.floor(date / durationMinute) * durationMinute);
  }, function (date, step) {
    date.setTime(+date + step * durationMinute);
  }, function (start, end) {
    return (end - start) / durationMinute;
  }, function (date) {
    return date.getMinutes();
  });
  var minutes = minute.range;

  var hour = newInterval(function (date) {
    var offset = date.getTimezoneOffset() * durationMinute % durationHour;
    if (offset < 0) offset += durationHour;
    date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
  }, function (date, step) {
    date.setTime(+date + step * durationHour);
  }, function (start, end) {
    return (end - start) / durationHour;
  }, function (date) {
    return date.getHours();
  });
  var hours = hour.range;

  var day = newInterval(function (date) {
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function (date) {
    return date.getDate() - 1;
  });
  var days = day.range;

  function weekday(i) {
    return newInterval(function (date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function (date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function (start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var sundays = sunday.range;
  var mondays = monday.range;

  var month = newInterval(function (date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setMonth(date.getMonth() + step);
  }, function (start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function (date) {
    return date.getMonth();
  });
  var months = month.range;

  var year = newInterval(function (date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function (start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function (date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function (k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function (date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };
  var years = year.range;

  var utcMinute = newInterval(function (date) {
    date.setUTCSeconds(0, 0);
  }, function (date, step) {
    date.setTime(+date + step * durationMinute);
  }, function (start, end) {
    return (end - start) / durationMinute;
  }, function (date) {
    return date.getUTCMinutes();
  });
  var utcMinutes = utcMinute.range;

  var utcHour = newInterval(function (date) {
    date.setUTCMinutes(0, 0, 0);
  }, function (date, step) {
    date.setTime(+date + step * durationHour);
  }, function (start, end) {
    return (end - start) / durationHour;
  }, function (date) {
    return date.getUTCHours();
  });
  var utcHours = utcHour.range;

  var utcDay = newInterval(function (date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function (start, end) {
    return (end - start) / durationDay;
  }, function (date) {
    return date.getUTCDate() - 1;
  });
  var utcDays = utcDay.range;

  function utcWeekday(i) {
    return newInterval(function (date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function (date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function (start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;

  var utcMonth = newInterval(function (date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function (start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function (date) {
    return date.getUTCMonth();
  });
  var utcMonths = utcMonth.range;

  var utcYear = newInterval(function (date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function (start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function (date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function (k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function (date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };
  var utcYears = utcYear.range;

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return { y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function (date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function (string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          var day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || (j = parse(d, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function format(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function () {
          return specifier;
        };
        return f;
      },
      parse: function parse(specifier) {
        var p = newParse(specifier += "", localDate);
        p.toString = function () {
          return specifier;
        };
        return p;
      },
      utcFormat: function utcFormat(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function () {
          return specifier;
        };
        return f;
      },
      utcParse: function utcParse(specifier) {
        var p = newParse(specifier, utcDate);
        p.toString = function () {
          return specifier;
        };
        return p;
      }
    };
  }

  var pads = { "-": "", "_": " ", "0": "0" },
      numberRe = /^\s*\d+/,
      // note: ignores next directive
  percentRe = /^%/,
      requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {},
        i = -1,
        n = names.length;
    while (++i < n) {
      map[names[i].toLowerCase()] = i;
    }return map;
  }

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  var locale$1;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    timeParse = locale$1.parse;
    utcFormat = locale$1.utcFormat;
    utcParse = locale$1.utcParse;
    return locale$1;
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
      return date.toISOString();
  }

  var formatIso = Date.prototype.toISOString ? formatIsoNative : utcFormat(isoSpecifier);

  function parseIsoNative(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  }

  var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : utcParse(isoSpecifier);

  function sequential(interpolator) {
    var x0 = 0,
        x1 = 1,
        k10 = 1,
        clamp = false;

    function scale(x) {
      var t = (x - x0) * k10;
      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
    }

    scale.domain = function (_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], k10 = x0 === x1 ? 0 : 1 / (x1 - x0), scale) : [x0, x1];
    };

    scale.clamp = function (_) {
      return arguments.length ? (clamp = !!_, scale) : clamp;
    };

    scale.interpolator = function (_) {
      return arguments.length ? (interpolator = _, scale) : interpolator;
    };

    scale.copy = function () {
      return sequential(interpolator).domain([x0, x1]).clamp(clamp);
    };

    return linearish(scale);
  }

  function colors (specifier) {
    var n = specifier.length / 6 | 0,
        colors = new Array(n),
        i = 0;
    while (i < n) {
      colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    }return colors;
  }

  var schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  var schemeAccent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

  var schemeDark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

  var schemePaired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

  var schemePastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

  var schemePastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

  var schemeSet1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

  var schemeSet2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

  var schemeSet3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

  function ramp (scheme) {
    return rgbBasis(scheme[scheme.length - 1]);
  }

  var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors);

  var interpolateBrBG = ramp(scheme);

  var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors);

  var interpolatePRGn = ramp(scheme$1);

  var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors);

  var interpolatePiYG = ramp(scheme$2);

  var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors);

  var interpolatePuOr = ramp(scheme$3);

  var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors);

  var interpolateRdBu = ramp(scheme$4);

  var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors);

  var interpolateRdGy = ramp(scheme$5);

  var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors);

  var interpolateRdYlBu = ramp(scheme$6);

  var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors);

  var interpolateRdYlGn = ramp(scheme$7);

  var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors);

  var interpolateSpectral = ramp(scheme$8);

  var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors);

  var interpolateBuGn = ramp(scheme$9);

  var scheme$a = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors);

  var interpolateBuPu = ramp(scheme$a);

  var scheme$b = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors);

  var interpolateGnBu = ramp(scheme$b);

  var scheme$c = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors);

  var interpolateOrRd = ramp(scheme$c);

  var scheme$d = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors);

  var interpolatePuBuGn = ramp(scheme$d);

  var scheme$e = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors);

  var interpolatePuBu = ramp(scheme$e);

  var scheme$f = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors);

  var interpolatePuRd = ramp(scheme$f);

  var scheme$g = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors);

  var interpolateRdPu = ramp(scheme$g);

  var scheme$h = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors);

  var interpolateYlGnBu = ramp(scheme$h);

  var scheme$i = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors);

  var interpolateYlGn = ramp(scheme$i);

  var scheme$j = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors);

  var interpolateYlOrBr = ramp(scheme$j);

  var scheme$k = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors);

  var interpolateYlOrRd = ramp(scheme$k);

  var scheme$l = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors);

  var interpolateBlues = ramp(scheme$l);

  var scheme$m = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors);

  var interpolateGreens = ramp(scheme$m);

  var scheme$n = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors);

  var interpolateGreys = ramp(scheme$n);

  var scheme$o = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors);

  var interpolatePurples = ramp(scheme$o);

  var scheme$p = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors);

  var interpolateReds = ramp(scheme$p);

  var scheme$q = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors);

  var interpolateOranges = ramp(scheme$q);

  function define$1 (constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend$1(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) {
      prototype[key] = definition[key];
    }return prototype;
  }

  function Color$1() {}

  var _darker$1 = 0.7;
  var _brighter$1 = 1 / _darker$1;
  var reI$1 = "\\s*([+-]?\\d+)\\s*",
      reN$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex3$1 = /^#([0-9a-f]{3})$/,
      reHex6$1 = /^#([0-9a-f]{6})$/,
      reRgbInteger$1 = new RegExp("^rgb\\(" + [reI$1, reI$1, reI$1] + "\\)$"),
      reRgbPercent$1 = new RegExp("^rgb\\(" + [reP$1, reP$1, reP$1] + "\\)$"),
      reRgbaInteger$1 = new RegExp("^rgba\\(" + [reI$1, reI$1, reI$1, reN$1] + "\\)$"),
      reRgbaPercent$1 = new RegExp("^rgba\\(" + [reP$1, reP$1, reP$1, reN$1] + "\\)$"),
      reHslPercent$1 = new RegExp("^hsl\\(" + [reN$1, reP$1, reP$1] + "\\)$"),
      reHslaPercent$1 = new RegExp("^hsla\\(" + [reN$1, reP$1, reP$1, reN$1] + "\\)$");

  var named$1 = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define$1(Color$1, color$1, {
    displayable: function displayable() {
      return this.rgb().displayable();
    },
    hex: function hex() {
      return this.rgb().hex();
    },
    toString: function toString() {
      return this.rgb() + "";
    }
  });

  function color$1(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3$1.exec(format)) ? (m = parseInt(m[1], 16), new Rgb$1(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
    ) : (m = reHex6$1.exec(format)) ? rgbn$1(parseInt(m[1], 16)) // #ff0000
    : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
    : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
    : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
    : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
    : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
    : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
    : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format]) : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0) : null;
  }

  function rgbn$1(n) {
    return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba$1(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb$1(r, g, b, a);
  }

  function rgbConvert$1(o) {
    if (!(o instanceof Color$1)) o = color$1(o);
    if (!o) return new Rgb$1();
    o = o.rgb();
    return new Rgb$1(o.r, o.g, o.b, o.opacity);
  }

  function rgb$1(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb$1(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$1(Rgb$1, rgb$1, extend$1(Color$1, {
    brighter: function brighter(k) {
      k = k == null ? _brighter$1 : Math.pow(_brighter$1, k);
      return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function darker(k) {
      k = k == null ? _darker$1 : Math.pow(_darker$1, k);
      return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function rgb() {
      return this;
    },
    displayable: function displayable() {
      return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: function hex() {
      return "#" + _hex(this.r) + _hex(this.g) + _hex(this.b);
    },
    toString: function toString() {
      var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function _hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla$1(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
    return new Hsl$1(h, s, l, a);
  }

  function hslConvert$1(o) {
    if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color$1)) o = color$1(o);
    if (!o) return new Hsl$1();
    if (o instanceof Hsl$1) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl$1(h, s, l, o.opacity);
  }

  function hsl$3(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl$1(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Hsl$1, hsl$3, extend$1(Color$1, {
    brighter: function brighter(k) {
      k = k == null ? _brighter$1 : Math.pow(_brighter$1, k);
      return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function darker(k) {
      k = k == null ? _darker$1 : Math.pow(_darker$1, k);
      return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function rgb() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb$1(hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb$1(h, m1, m2), hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    displayable: function displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb$1(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }

  var deg2rad$1 = Math.PI / 180;
  var rad2deg$1 = 180 / Math.PI;

  // https://beta.observablehq.com/@mbostock/lab-and-rgb
  var K = 18,
      Xn$1 = 0.96422,
      Yn$1 = 1,
      Zn$1 = 0.82521,
      t0$2 = 4 / 29,
      t1$2 = 6 / 29,
      t2$1 = 3 * t1$2 * t1$2,
      t3$1 = t1$2 * t1$2 * t1$2;

  function labConvert$1(o) {
    if (o instanceof Lab$1) return new Lab$1(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl$1) {
      if (isNaN(o.h)) return new Lab$1(o.l, 0, 0, o.opacity);
      var h = o.h * deg2rad$1;
      return new Lab$1(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab$1((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn$1),
        x,
        z;
    if (r === g && g === b) x = z = y;else {
      x = xyz2lab$1((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn$1);
      z = xyz2lab$1((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn$1);
    }
    return new Lab$1(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab$2(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert$1(l) : new Lab$1(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab$1(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define$1(Lab$1, lab$2, extend$1(Color$1, {
    brighter: function brighter(k) {
      return new Lab$1(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function darker(k) {
      return new Lab$1(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function rgb() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn$1 * lab2xyz$1(x);
      y = Yn$1 * lab2xyz$1(y);
      z = Zn$1 * lab2xyz$1(z);
      return new Rgb$1(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
    }
  }));

  function xyz2lab$1(t) {
    return t > t3$1 ? Math.pow(t, 1 / 3) : t / t2$1 + t0$2;
  }

  function lab2xyz$1(t) {
    return t > t1$2 ? t * t * t : t2$1 * (t - t0$2);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert$1(o) {
    if (o instanceof Hcl$1) return new Hcl$1(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab$1)) o = labConvert$1(o);
    if (o.a === 0 && o.b === 0) return new Hcl$1(NaN, 0, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * rad2deg$1;
    return new Hcl$1(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl$3(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert$1(h) : new Hcl$1(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl$1(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Hcl$1, hcl$3, extend$1(Color$1, {
    brighter: function brighter(k) {
      return new Hcl$1(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function darker(k) {
      return new Hcl$1(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function rgb() {
      return labConvert$1(this).rgb();
    }
  }));

  var A$1 = -0.14861,
      B$1 = +1.78277,
      C$1 = -0.29227,
      D$1 = -0.90649,
      E$1 = +1.97294,
      ED$1 = E$1 * D$1,
      EB$1 = E$1 * B$1,
      BC_DA$1 = B$1 * C$1 - D$1 * A$1;

  function cubehelixConvert$1(o) {
    if (o instanceof Cubehelix$1) return new Cubehelix$1(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb$1)) o = rgbConvert$1(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA$1 * b + ED$1 * r - EB$1 * g) / (BC_DA$1 + ED$1 - EB$1),
        bl = b - l,
        k = (E$1 * (g - l) - C$1 * bl) / D$1,
        s = Math.sqrt(k * k + bl * bl) / (E$1 * l * (1 - l)),
        // NaN if l=0 or l=1
    h = s ? Math.atan2(k, bl) * rad2deg$1 - 120 : NaN;
    return new Cubehelix$1(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix$3(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert$1(h) : new Cubehelix$1(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix$1(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define$1(Cubehelix$1, cubehelix$3, extend$1(Color$1, {
    brighter: function brighter$$1(k) {
      k = k == null ? _brighter$1 : Math.pow(_brighter$1, k);
      return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function darker$$1(k) {
      k = k == null ? _darker$1 : Math.pow(_darker$1, k);
      return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function rgb() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad$1,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb$1(255 * (l + a * (A$1 * cosh + B$1 * sinh)), 255 * (l + a * (C$1 * cosh + D$1 * sinh)), 255 * (l + a * (E$1 * cosh)), this.opacity);
    }
  }));

  var interpolateCubehelixDefault = cubehelixLong(cubehelix$3(300, 0.5, 0.0), cubehelix$3(-240, 0.5, 1.0));

  var warm = cubehelixLong(cubehelix$3(-100, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

  var cool = cubehelixLong(cubehelix$3(260, 0.75, 0.35), cubehelix$3(80, 1.50, 0.8));

  var c = cubehelix$3();

  function interpolateRainbow (t) {
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    c.h = 360 * t - 100;
    c.s = 1.5 - 1.5 * ts;
    c.l = 0.8 - 0.9 * ts;
    return c + "";
  }

  var c$1 = rgb$1(),
      pi_1_3 = Math.PI / 3,
      pi_2_3 = Math.PI * 2 / 3;

  function ramp$1(range) {
    var n = range.length;
    return function (t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }

  var interpolateViridis = ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

  var magma = ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

  var inferno = ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

  var plasma = ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

  var noop = { value: function value() {} };

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function (t) {
      var name = "",
          i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name: name };
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function on(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) {
          if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
        }return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);else if (callback == null) for (t in _) {
          _[t] = set$2(_[t], typename.name, null);
        }
      }

      return this;
    },
    copy: function copy() {
      var copy = {},
          _ = this._;
      for (var t in _) {
        copy[t] = _[t].slice();
      }return new Dispatch(copy);
    },
    call: function call(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
        args[i] = arguments[i + 2];
      }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
        t[i].value.apply(that, args);
      }
    },
    apply: function apply(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
        t[i].value.apply(that, args);
      }
    }
  };

  function get$1(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$2(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({ name: name, value: callback });
    return type;
  }

  function tree_add (d) {
    var x = +this._x.call(null, d),
        y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
  }

  function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = { data: d },
        x0 = tree._x0,
        y0 = tree._y0,
        x1 = tree._x1,
        y1 = tree._y1,
        xm,
        ym,
        xp,
        yp,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll(data) {
    var d,
        i,
        n = data.length,
        x,
        y,
        xz = new Array(n),
        yz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;

    // Compute the points and their extent.
    for (i = 0; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }

    // If there were no (valid) points, inherit the existing extent.
    if (x1 < x0) x0 = this._x0, x1 = this._x1;
    if (y1 < y0) y0 = this._y0, y1 = this._y1;

    // Expand the tree to cover the new points.
    this.cover(x0, y0).cover(x1, y1);

    // Add the new points.
    for (i = 0; i < n; ++i) {
      add(this, xz[i], yz[i], data[i]);
    }

    return this;
  }

  function tree_cover (x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

    var x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1;

    // If the quadtree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing quadrant boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else if (x0 > x || x > x1 || y0 > y || y > y1) {
        var z = x1 - x0,
            node = this._root,
            parent,
            i;

        switch (i = (y < (y0 + y1) / 2) << 1 | x < (x0 + x1) / 2) {
          case 0:
            {
              do {
                parent = new Array(4), parent[i] = node, node = parent;
              } while ((z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1));
              break;
            }
          case 1:
            {
              do {
                parent = new Array(4), parent[i] = node, node = parent;
              } while ((z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1));
              break;
            }
          case 2:
            {
              do {
                parent = new Array(4), parent[i] = node, node = parent;
              } while ((z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y));
              break;
            }
          case 3:
            {
              do {
                parent = new Array(4), parent[i] = node, node = parent;
              } while ((z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y));
              break;
            }
        }

        if (this._root && this._root.length) this._root = node;
      }

      // If the quadtree covers the point already, just return.
      else return this;

    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }

  function tree_data () {
    var data = [];
    this.visit(function (node) {
      if (!node.length) do {
        data.push(node.data);
      } while (node = node.next);
    });
    return data;
  }

  function tree_extent (_) {
      return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
  }

  function Quad (node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  function tree_find (x, y, radius) {
    var data,
        x0 = this._x0,
        y0 = this._y0,
        x1,
        y1,
        x2,
        y2,
        x3 = this._x1,
        y3 = this._y1,
        quads = [],
        node = this._root,
        q,
        i;

    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;else {
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    }

    while (q = quads.pop()) {

      // Stop searching if this quadrant can’t contain a closer node.
      if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue;

      // Bisect the current quadrant.
      if (node.length) {
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2;

        quads.push(new Quad(node[3], xm, ym, x2, y2), new Quad(node[2], x1, ym, xm, y2), new Quad(node[1], xm, y1, x2, ym), new Quad(node[0], x1, y1, xm, ym));

        // Visit the closest quadrant first.
        if (i = (y >= ym) << 1 | x >= xm) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
    }

    return data;
  }

  function tree_remove (d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1,
        x,
        y,
        xm,
        ym,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) {
      if (!(previous = node, node = node.next)) return this;
    }if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return next ? previous.next = next : delete previous.next, this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
      if (retainer) retainer[j] = node;else this._root = node;
    }

    return this;
  }

  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) {
      this.remove(data[i]);
    }return this;
  }

  function tree_root () {
    return this._root;
  }

  function tree_size () {
    var size = 0;
    this.visit(function (node) {
      if (!node.length) do {
        ++size;
      } while (node = node.next);
    });
    return size;
  }

  function tree_visit (callback) {
    var quads = [],
        q,
        node = this._root,
        child,
        x0,
        y0,
        x1,
        y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2,
            ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      }
    }
    return this;
  }

  function tree_visitAfter (callback) {
    var quads = [],
        next = [],
        q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child,
            x0 = q.x0,
            y0 = q.y0,
            x1 = q.x1,
            y1 = q.y1,
            xm = (x0 + x1) / 2,
            ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }

  function defaultX(d) {
    return d[0];
  }

  function tree_x (_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function defaultY(d) {
    return d[1];
  }

  function tree_y (_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = undefined;
  }

  function leaf_copy(leaf) {
    var copy = { data: leaf.data },
        next = copy;
    while (leaf = leaf.next) {
      next = next.next = { data: leaf.data };
    }return copy;
  }

  var treeProto = quadtree.prototype = Quadtree.prototype;

  treeProto.copy = function () {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy(node), copy;

    nodes = [{ source: node, target: copy._root = new Array(4) }];
    while (node = nodes.pop()) {
      for (var i = 0; i < 4; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });else node.target[i] = leaf_copy(child);
        }
      }
    }

    return copy;
  };

  treeProto.add = tree_add;
  treeProto.addAll = addAll;
  treeProto.cover = tree_cover;
  treeProto.data = tree_data;
  treeProto.extent = tree_extent;
  treeProto.find = tree_find;
  treeProto.remove = tree_remove;
  treeProto.removeAll = removeAll;
  treeProto.root = tree_root;
  treeProto.size = tree_size;
  treeProto.visit = tree_visit;
  treeProto.visitAfter = tree_visitAfter;
  treeProto.x = tree_x;
  treeProto.y = tree_y;

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace (name) {
    var prefix = name += "",
        i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
  }

  function creatorInherit(name) {
    return function () {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function () {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator (name) {
    var fullname = namespace(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
  }

  function none() {}

  function selector (selector) {
    return selector == null ? none : function () {
      return this.querySelector(selector);
    };
  }

  function selection_select (select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function empty() {
    return [];
  }

  function selectorAll (selector) {
    return selector == null ? empty : function () {
      return this.querySelectorAll(selector);
    };
  }

  function selection_selectAll (select) {
    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  var matcher = function matcher(selector) {
    return function () {
      return this.matches(selector);
    };
  };

  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!element.matches) {
      var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
      matcher = function matcher(selector) {
        return function () {
          return vendorMatches.call(this, selector);
        };
      };
    }
  }

  var matcher$1 = matcher;

  function selection_filter (match) {
    if (typeof match !== "function") match = matcher$1(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse (update) {
    return new Array(update.length);
  }

  function selection_enter () {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function appendChild(child) {
      return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function insertBefore(child, next) {
      return this._parent.insertBefore(child, next);
    },
    querySelector: function querySelector(selector) {
      return this._parent.querySelector(selector);
    },
    querySelectorAll: function querySelectorAll(selector) {
      return this._parent.querySelectorAll(selector);
    }
  };

  function constant$4 (x) {
    return function () {
      return x;
    };
  }

  var keyPrefix = "$"; // Protect against keys like “__proto__”.

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = {},
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) {
          exit[i] = node;
        } else {
          nodeByKeyValue[keyValue] = node;
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = keyPrefix + key.call(parent, data[i], i, data);
      if (node = nodeByKeyValue[keyValue]) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue[keyValue] = null;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
        exit[i] = node;
      }
    }
  }

  function selection_data (value, key) {
    if (!value) {
      data = new Array(this.size()), j = -1;
      this.each(function (d) {
        data[++j] = d;
      });
      return data;
    }

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$4(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = value.call(parent, parent && parent.__data__, j, parents),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength) {}
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit () {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_merge (selection$$1) {

    for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order () {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort (compare) {
    if (!compare) compare = ascending$1;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending$1(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call () {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes () {
    var nodes = new Array(this.size()),
        i = -1;
    this.each(function () {
      nodes[++i] = this;
    });
    return nodes;
  }

  function selection_node () {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size () {
    var size = 0;
    this.each(function () {
      ++size;
    });
    return size;
  }

  function selection_empty () {
    return !this.node();
  }

  function selection_each (callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function () {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function () {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function () {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function () {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function () {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function () {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr (name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }

    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
  }

  function defaultView (node) {
      return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
      node.document && node // node is a Window
      || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function () {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function () {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function () {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style (name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function () {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function () {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function () {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];else this[name] = v;
    };
  }

  function selection_property (name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function add(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function remove(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function contains(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node),
        i = -1,
        n = names.length;
    while (++i < n) {
      list.add(names[i]);
    }
  }

  function classedRemove(node, names) {
    var list = classList(node),
        i = -1,
        n = names.length;
    while (++i < n) {
      list.remove(names[i]);
    }
  }

  function classedTrue(names) {
    return function () {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function () {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function () {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed (name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()),
          i = -1,
          n = names.length;
      while (++i < n) {
        if (!list.contains(names[i])) return false;
      }return true;
    }

    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function () {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function () {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text (value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function () {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function () {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html (value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
  }

  function raise$1() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise () {
    return this.each(raise$1);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower () {
    return this.each(lower);
  }

  function selection_append (name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function () {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert (name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function () {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove () {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
  }

  function selection_cloneDeep() {
    return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
  }

  function selection_clone (deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum (value) {
      return arguments.length ? this.property("__data__", value) : this.node().__data__;
  }

  var filterEvents = {};

  if (typeof document !== "undefined") {
    var element$1 = document.documentElement;
    if (!("onmouseenter" in element$1)) {
      filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
    }
  }

  function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function (event) {
      var related = event.relatedTarget;
      if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
        listener.call(this, event);
      }
    };
  }

  function contextListener(listener, index, group) {
    return function (event1) {
      try {
        listener.call(this, this.__data__, index, group);
      } finally {
      }
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function (t) {
      var name = "",
          i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return { type: t, name: name };
    });
  }

  function onRemove(typename) {
    return function () {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;else delete this.__on;
    };
  }

  function onAdd(typename, value, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function (d, i, group) {
      var on = this.__on,
          o,
          listener = wrap(value, i, group);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, capture);
      o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
      if (!on) this.__on = [o];else on.push(o);
    };
  }

  function selection_on (typename, value, capture) {
    var typenames = parseTypenames$1(typename + ""),
        i,
        n = typenames.length,
        t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    if (capture == null) capture = false;
    for (i = 0; i < n; ++i) {
      this.each(on(typenames[i], value, capture));
    }return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function () {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function () {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch (type, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
  };

  function select (selector) {
      return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
  }

  function selectAll$1 (selector) {
      return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([selector == null ? [] : selector], root);
  }

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  };

  var toConsumableArray$1 = function toConsumableArray$$1(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof$1(global)) == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof$1(self)) == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$1 = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var _Symbol = root$1.Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
    return value != null && (type == 'object' || type == 'function');
  }

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'object';
  }

  /** `Object#toString` result references. */
  var stringTag = '[object String]';

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
  }

  var SchemeReds = 'Reds';
  var SchemeBlues = 'Blues';
  var SchemeGreens = 'Greens';
  var SchemeGreys = 'Greys';
  var SchemeOranges = 'Oranges';
  var SchemePurples = 'Purples';
  var SchemeBuGn = 'BuGn';
  var SchemeBuPu = 'BuPu';
  var SchemeGnBu = 'GnBu';
  var SchemeOrRd = 'OrRd';
  var SchemePuBuGn = 'PuBuGn';
  var SchemePuBu = 'PuBu';
  var SchemePuRd = 'PuRd';
  var SchemeRdPu = 'RdPu';
  var SchemeYlGnBu = 'YlGnBu';
  var SchemeYlGn = 'YlGn';
  var SchemeYlOrBr = 'YlOrBr';
  var SchemeYlOrRd = 'YlOrRd';
  var SchemeViridis = 'Viridis';
  var SchemeInferno = 'Inferno';
  var SchemeMagma = 'Magma';
  var SchemePlasma = 'Plasma';
  var SchemeWarm = 'Warm';
  var SchemeCool = 'Cool';
  var SchemeRainbow = 'Rainbow';
  var SchemeCubehelix = 'Cubehelix';

  var interpolateSequentialScheme = function interpolateSequentialScheme(_scheme) {
    if (!isFunction(_scheme) && !isString(_scheme)) {
      throw new Error(_scheme + 'is invalid');
    }

    // user specified interpolator
    if (isFunction(_scheme)) {
      return _scheme;
    }

    //shortcode for internal interpolators
    switch (_scheme) {
      // sequential single hue
      case SchemeBlues:
        return interpolateBlues;

      case SchemeGreens:
        return interpolateGreens;

      case SchemeGreys:
        return interpolateGreys;

      case SchemeOranges:
        return interpolateOranges;

      case SchemeReds:
        return interpolateReds;

      case SchemePurples:
        return interpolatePurples;

      // Sequential (Multi-Hue)
      case SchemeBuGn:
        return interpolateBuGn;

      case SchemeBuPu:
        return interpolateBuPu;

      case SchemeGnBu:
        return interpolateGnBu;

      case SchemeOrRd:
        return interpolateOrRd;

      case SchemePuBuGn:
        return interpolatePuBuGn;

      case SchemePuBu:
        return interpolatePuBu;

      case SchemePuRd:
        return interpolatePuRd;

      case SchemeRdPu:
        return interpolateRdPu;

      case SchemeYlGnBu:
        return interpolateYlGnBu;

      case SchemeYlGn:
        return interpolateYlGn;

      case SchemeYlOrBr:
        return interpolateYlOrBr;

      case SchemeYlOrRd:
        return interpolateYlOrRd;

      // R Color
      case SchemeViridis:
        return interpolateViridis;

      case SchemeInferno:
        return inferno;

      case SchemeMagma:
        return magma;

      case SchemePlasma:
        return plasma;

      case SchemeWarm:
        return warm;

      case SchemeCool:
        return cool;

      case SchemeRainbow:
        return interpolateRainbow;

      case SchemeCubehelix:
        return interpolateCubehelixDefault;

      default:
        return null;
    }
  };

  var SchemeAccent = 'Accent';
  var SchemeDark2 = 'Dark2';
  var SchemePaired = 'Paired';
  var SchemePastel1 = 'Pastel1';
  var SchemePastel2 = 'Pastel2';
  var SchemeSet1 = 'Set1';
  var SchemeSet2 = 'Set2';
  var SchemeSet3 = 'Set3';
  var SchemeCategory10 = 'Category10';

  var SchemeBrBG = 'BrBG';
  var SchemePRGn = 'PRGn';
  var SchemePiYG = 'PiYG';
  var SchemePuOr = 'PuOr';
  var SchemeRdBu = 'RdBu';
  var SchemeRdGy = 'RdGy';
  var SchemeRdYlBu = 'RdYlBu';
  var SchemeRdYlGn = 'RdYlGn';
  var SchemeSpectral = 'Spectral';

  var MetroRain3 = ['#79e70f', '#10d9ec', '#1f97e7'];

  var MetroRain8 = ['#abe70f', '#79e70f', '#0fe71f', '#0fe7d4', '#10d9ec', '#10c5ec', '#1fb2e7', '#1f97e7'];

  var TheMetLight = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

  /* taken from https://simplestatistics.org/ */

  /**
   * For a sorted input, counting the number of unique values
   * is possible in constant time and constant memory. This is
   * a simple implementation of the algorithm.
   *
   * Values are compared with `===`, so objects and non-primitive objects
   * are not handled in any special way.
   *
   * @param {Array<*>} x an array of any kind of value
   * @returns {number} count of unique values
   * @example
   * uniqueCountSorted([1, 2, 3]); // => 3
   * uniqueCountSorted([1, 1, 1]); // => 1
   */
  var uniqueCountSorted = function uniqueCountSorted(x /*: Array<any>*/) /*: number */{
    var uniqueValueCount = 0,
        lastSeenValue = void 0;
    for (var i = 0; i < x.length; i++) {
      if (i === 0 || x[i] !== lastSeenValue) {
        lastSeenValue = x[i];
        uniqueValueCount++;
      }
    }
    return uniqueValueCount;
  };

  /* taken from https://simplestatistics.org/ */

  /**
   * Sort an array of numbers by their numeric value, ensuring that the
   * array is not changed in place.
   *
   * This is necessary because the default behavior of .sort
   * in JavaScript is to sort arrays as string values
   *
   *     [1, 10, 12, 102, 20].sort()
   *     // output
   *     [1, 10, 102, 12, 20]
   *
   * @param {Array<number>} x input array
   * @return {Array<number>} sorted array
   * @private
   * @example
   * numericSort([3, 2, 1]) // => [1, 2, 3]
   */
  var numericSort = function numericSort(x /*: Array<number> */) /*: Array<number> */{
    return x
    // ensure the array is not changed in-place
    .slice()
    // comparator function that treats input as numeric
    .sort(function (a, b) {
      return a - b;
    });
  };

  /* taken from https://simplestatistics.org/ */

  /**
   * Create a new column x row matrix.
   *
   * @private
   * @param {number} columns
   * @param {number} rows
   * @return {Array<Array<number>>} matrix
   * @example
   * makeMatrix(10, 10);
   */
  function makeMatrix(columns, rows) {
    var matrix = [];
    for (var i = 0; i < columns; i++) {
      var column = [];
      for (var j = 0; j < rows; j++) {
        column.push(0);
      }
      matrix.push(column);
    }
    return matrix;
  }

  /**
   * Generates incrementally computed values based on the sums and sums of
   * squares for the data array
   *
   * @private
   * @param {number} j
   * @param {number} i
   * @param {Array<number>} sums
   * @param {Array<number>} sumsOfSquares
   * @return {number}
   * @example
   * ssq(0, 1, [-1, 0, 2], [1, 1, 5]);
   */
  function ssq(j, i, sums, sumsOfSquares) {
    var sji = void 0; // s(j, i)
    if (j > 0) {
      var muji = (sums[i] - sums[j - 1]) / (i - j + 1); // mu(j, i)
      sji = sumsOfSquares[i] - sumsOfSquares[j - 1] - (i - j + 1) * muji * muji;
    } else {
      sji = sumsOfSquares[i] - sums[i] * sums[i] / (i + 1);
    }
    if (sji < 0) {
      return 0;
    }
    return sji;
  }

  /**
   * Function that recursively divides and conquers computations
   * for cluster j
   *
   * @private
   * @param {number} iMin Minimum index in cluster to be computed
   * @param {number} iMax Maximum index in cluster to be computed
   * @param {number} cluster Index of the cluster currently being computed
   * @param {Array<Array<number>>} matrix
   * @param {Array<Array<number>>} backtrackMatrix
   * @param {Array<number>} sums
   * @param {Array<number>} sumsOfSquares
   */
  function fillMatrixColumn(iMin, iMax, cluster, matrix, backtrackMatrix, sums, sumsOfSquares) {
    if (iMin > iMax) {
      return;
    }

    // Start at midpoint between iMin and iMax
    var i = Math.floor((iMin + iMax) / 2);

    matrix[cluster][i] = matrix[cluster - 1][i - 1];
    backtrackMatrix[cluster][i] = i;

    var jlow = cluster; // the lower end for j

    if (iMin > cluster) {
      jlow = Math.max(jlow, backtrackMatrix[cluster][iMin - 1] || 0);
    }
    jlow = Math.max(jlow, backtrackMatrix[cluster - 1][i] || 0);

    var jhigh = i - 1; // the upper end for j
    if (iMax < matrix.length - 1) {
      jhigh = Math.min(jhigh, backtrackMatrix[cluster][iMax + 1] || 0);
    }

    var sji = void 0;
    var sjlowi = void 0;
    var ssqjlow = void 0;
    var ssqj = void 0;
    for (var j = jhigh; j >= jlow; --j) {
      sji = ssq(j, i, sums, sumsOfSquares);

      if (sji + matrix[cluster - 1][jlow - 1] >= matrix[cluster][i]) {
        break;
      }

      // Examine the lower bound of the cluster border
      sjlowi = ssq(jlow, i, sums, sumsOfSquares);

      ssqjlow = sjlowi + matrix[cluster - 1][jlow - 1];

      if (ssqjlow < matrix[cluster][i]) {
        // Shrink the lower bound
        matrix[cluster][i] = ssqjlow;
        backtrackMatrix[cluster][i] = jlow;
      }
      jlow++;

      ssqj = sji + matrix[cluster - 1][j - 1];
      if (ssqj < matrix[cluster][i]) {
        matrix[cluster][i] = ssqj;
        backtrackMatrix[cluster][i] = j;
      }
    }

    fillMatrixColumn(iMin, i - 1, cluster, matrix, backtrackMatrix, sums, sumsOfSquares);
    fillMatrixColumn(i + 1, iMax, cluster, matrix, backtrackMatrix, sums, sumsOfSquares);
  }

  /**
   * Initializes the main matrices used in Ckmeans and kicks
   * off the divide and conquer cluster computation strategy
   *
   * @private
   * @param {Array<number>} data sorted array of values
   * @param {Array<Array<number>>} matrix
   * @param {Array<Array<number>>} backtrackMatrix
   */
  function fillMatrices(data, matrix, backtrackMatrix) {
    var nValues = matrix[0].length;

    // Shift values by the median to improve numeric stability
    var shift = data[Math.floor(nValues / 2)];

    // Cumulative sum and cumulative sum of squares for all values in data array
    var sums = [];
    var sumsOfSquares = [];

    // Initialize first column in matrix & backtrackMatrix
    for (var i = 0, shiftedValue; i < nValues; ++i) {
      shiftedValue = data[i] - shift;
      if (i === 0) {
        sums.push(shiftedValue);
        sumsOfSquares.push(shiftedValue * shiftedValue);
      } else {
        sums.push(sums[i - 1] + shiftedValue);
        sumsOfSquares.push(sumsOfSquares[i - 1] + shiftedValue * shiftedValue);
      }

      // Initialize for cluster = 0
      matrix[0][i] = ssq(0, i, sums, sumsOfSquares);
      backtrackMatrix[0][i] = 0;
    }

    // Initialize the rest of the columns
    var iMin = void 0;
    for (var cluster = 1; cluster < matrix.length; ++cluster) {
      if (cluster < matrix.length - 1) {
        iMin = cluster;
      } else {
        // No need to compute matrix[K-1][0] ... matrix[K-1][N-2]
        iMin = nValues - 1;
      }

      fillMatrixColumn(iMin, nValues - 1, cluster, matrix, backtrackMatrix, sums, sumsOfSquares);
    }
  }

  /**
   * Ckmeans clustering is an improvement on heuristic-based clustering
   * approaches like Jenks. The algorithm was developed in
   * [Haizhou Wang and Mingzhou Song](http://journal.r-project.org/archive/2011-2/RJournal_2011-2_Wang+Song.pdf)
   * as a [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming) approach
   * to the problem of clustering numeric data into groups with the least
   * within-group sum-of-squared-deviations.
   *
   * Minimizing the difference within groups - what Wang & Song refer to as
   * `withinss`, or within sum-of-squares, means that groups are optimally
   * homogenous within and the data is split into representative groups.
   * This is very useful for visualization, where you may want to represent
   * a continuous variable in discrete color or style groups. This function
   * can provide groups that emphasize differences between data.
   *
   * Being a dynamic approach, this algorithm is based on two matrices that
   * store incrementally-computed values for squared deviations and backtracking
   * indexes.
   *
   * This implementation is based on Ckmeans 3.4.6, which introduced a new divide
   * and conquer approach that improved runtime from O(kn^2) to O(kn log(n)).
   *
   * Unlike the [original implementation](https://cran.r-project.org/web/packages/Ckmeans.1d.dp/index.html),
   * this implementation does not include any code to automatically determine
   * the optimal number of clusters: this information needs to be explicitly
   * provided.
   *
   * ### References
   * _Ckmeans.1d.dp: Optimal k-means Clustering in One Dimension by Dynamic
   * Programming_ Haizhou Wang and Mingzhou Song ISSN 2073-4859
   *
   * from The R Journal Vol. 3/2, December 2011
   * @param {Array<number>} x input data, as an array of number values
   * @param {number} nClusters number of desired classes. This cannot be
   * greater than the number of values in the data array.
   * @returns {Array<Array<number>>} clustered input
   * @throws {Error} if the number of requested clusters is higher than the size of the data
   * @example
   * ckmeans([-1, 2, -1, 2, 4, 5, 6, -1, 2, -1], 3);
   * // The input, clustered into groups of similar numbers.
   * //= [[-1, -1, -1, -1], [2, 2, 2], [4, 5, 6]]);
   */
  var ckmeans = function ckmeans(x /*: Array<number> */
  , nClusters /*: number */
  ) /*: Array<Array<number>> */{
    if (nClusters > x.length) {
      throw new Error('cannot generate more classes than there are data values');
    }

    var sorted = numericSort(x),


    // we'll use this as the maximum number of clusters
    uniqueCount = uniqueCountSorted(sorted);

    // if all of the input values are identical, there's one cluster
    // with all of the input in it.
    if (uniqueCount === 1) {
      return [sorted];
    }

    // named 'S' originally
    var matrix = makeMatrix(nClusters, sorted.length),


    // named 'J' originally
    backtrackMatrix = makeMatrix(nClusters, sorted.length);

    // This is a dynamic programming way to solve the problem of minimizing
    // within-cluster sum of squares. It's similar to linear regression
    // in this way, and this calculation incrementally computes the
    // sum of squares that are later read.
    fillMatrices(sorted, matrix, backtrackMatrix);

    // The real work of Ckmeans clustering happens in the matrix generation:
    // the generated matrices encode all possible clustering combinations, and
    // once they're generated we can solve for the best clustering groups
    // very quickly.
    var clusters = [],
        clusterRight = backtrackMatrix[0].length - 1;

    // Backtrack the clusters from the dynamic programming matrix. This
    // starts at the bottom-right corner of the matrix (if the top-left is 0, 0),
    // and moves the cluster target with the loop.
    for (var cluster = backtrackMatrix.length - 1; cluster >= 0; cluster--) {
      var clusterLeft = backtrackMatrix[cluster][clusterRight];

      // fill the cluster from the sorted input by taking a slice of the
      // array. the backtrack matrix makes this easy - it stores the
      // indexes where the cluster should start and end.
      clusters[cluster] = sorted.slice(clusterLeft, clusterRight + 1);

      if (cluster > 0) {
        clusterRight = clusterLeft - 1;
      }
    }

    return clusters;
  };

  var warn = function warn(msg) {
    if (console) {
      console.warn(msg);
    }
  };

  var _smartSequential = function _smartSequential(_scheme, _data) {
    var _scale = linear$1();

    var schemeLen = _scheme.length;
    var dataLen = _data.length;

    var theDarkest = _scheme[schemeLen - 1];

    if (schemeLen === 0) ;else if (dataLen === 1) {
      // use the darkest
      _scale = ordinal().domain(_data[0]).range([theDarkest]);
    } else if (dataLen === schemeLen) {
      // use every single color
      _scale.domain(_data).range(_scheme);
    } else if (dataLen < schemeLen) {
      // sort data from the smallest to the largest

      var _trimmed = new Array(dataLen);

      for (var i = dataLen - 2; i > 0; i--) {
        _trimmed[i] = _scheme[i];
      }

      _trimmed[0] = _scheme[0];
      _trimmed[dataLen - 1] = theDarkest;

      _scale.domain(_data).range(_trimmed);
    } else {
      // use kmeans
      var clusters = ckmeans(_data, schemeLen - 1);
      var breakpoints = clusters.map(function (d) {
        return d[d.length - 1];
      });
      var _domain = [clusters[0][0]].concat(breakpoints);

      _scale.domain(_domain).range(_scheme);
    }

    return _scale;
  };

  var gradientColor = function gradientColor(scheme$$1, _data) {
    var _scheme = void 0;

    if (!isString(scheme$$1) && !isArray(scheme$$1) && !isFunction(scheme$$1)) {
      warn('color scheme is invalid: should be string, array or d3 interpolator');
      warn('MetroRain3 will be used by default');
      _scheme = MetroRain3;
    } else {
      _scheme = scheme$$1;
    }

    if (isString(_scheme)) {
      var _interpolated = interpolateSequentialScheme(_scheme);
      if (_interpolated === null) {
        warn('color scheme is not found');
        warn('MetroRain3 will be used by default');
        _scheme = MetroRain3;

        return _smartSequential(_scheme, _data);
      } else {
        return sequential(_interpolated).domain(extent(_data));
      }
    } else if (isFunction(_scheme)) {
      return sequential(_scheme).domain(extent(_data));
    } else if (isArray(_scheme)) {
      return _smartSequential(_scheme, _data);
    }
  };

  var _distinctStops = function _distinctStops(scheme$$1, distinction) {
    var _color = sequential(scheme$$1).domain(extent(distinction));
    return distinction.sort(ascending).map(function (d) {
      return _color(d);
    });
  };

  var distinctColor = function distinctColor(scheme$$1) {
    var distinction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0.33, 0.66, 1];

    if (distinction.length < 2) {
      warn('distinction  must contains at least 3 elements, [0, 0.33, 0.66, 1] will be used by default');
    }

    var _distinction = distinction.length < 2 ? [0, 0.33, 0.66, 1] : distinction;

    var _scheme = void 0;

    if (!isString(scheme$$1) && !isArray(scheme$$1) && !isFunction(scheme$$1)) {
      warn('color scheme is invalid: should be string, array or d3 interpolator');
      warn(' MetroRain3 will be used by default');
      _scheme = MetroRain3;
    } else {
      _scheme = scheme$$1;
    }

    var _scale = quantile$1().domain(_distinction);

    if (isString(_scheme)) {
      var _interpolated = interpolateSequentialScheme(_scheme);

      if (_interpolated === null) {
        warn('color scheme is not found');
        warn('MetroRain3 will be used by default');

        _scheme = MetroRain3;
        _scale.range(_scheme);
      } else {
        _scale.range(_distinctStops(_interpolated, _distinction));
      }
    } else if (isFunction(_scheme)) {
      _scale.range(_distinctStops(_scheme, _distinction));
    } else if (isArray(_scheme)) {
      _scale.range(_scheme);
    }

    return _scale;
  };

  var interpolateDivergentScheme = function interpolateDivergentScheme(_scheme) {
    switch (_scheme) {
      // categorical
      case SchemeBrBG:
        return interpolateBrBG;

      case SchemePRGn:
        return interpolatePRGn;

      case SchemePiYG:
        return interpolatePiYG;

      case SchemePuOr:
        return interpolatePuOr;

      case SchemeRdBu:
        return interpolateRdBu;

      case SchemeRdGy:
        return interpolateRdGy;

      case SchemeRdYlBu:
        return interpolateRdYlBu;

      case SchemeRdYlGn:
        return interpolateRdYlGn;

      case SchemeSpectral:
        return interpolateSpectral;

      default:
        return null;
    }
  };

  var divergentColor = function divergentColor(scheme$$1) {
    warn('divergent not implemented yet');

    var _scheme = void 0;
    if (!isString(scheme$$1) && !isArray(scheme$$1) && !isFunction(scheme$$1)) {
      warn('color scheme is invalid: should be string, array or d3 interpolator');
      warn('SchemeRdYlGn will be used by default');
      _scheme = SchemeRdYlGn;
    } else {
      _scheme = scheme$$1;
    }

    if (isString(_scheme)) {
      var _interpolated = interpolateDivergentScheme(_scheme);

      if (_interpolated === null) {
        warn('color scheme is not found');
        warn('SchemeRdYlGn will be used by default');

        _scheme = SchemeRdYlGn;
        return sequential(interpolateDivergentScheme(_scheme));
      } else {
        return sequential(_interpolated);
      }
    } else if (isFunction(_scheme)) {
      return sequential(_scheme);
    } else {
      return null;
    }
  };

  var interpolateCategoricalScheme = function interpolateCategoricalScheme(_scheme) {
    switch (_scheme) {
      // categorical
      case SchemeAccent:
        return schemeAccent;

      case SchemeDark2:
        return schemeDark2;

      case SchemePaired:
        return schemePaired;

      case SchemePastel1:
        return schemePastel1;

      case SchemePastel2:
        return schemePastel2;

      case SchemeSet1:
        return schemeSet1;

      case SchemeSet2:
        return schemeSet2;

      case SchemeSet3:
        return schemeSet3;

      // categorical
      case SchemeCategory10:
        return schemeCategory10;

      default:
        return null;
    }
  };

  var _selectFromScheme = function _selectFromScheme(interpolator, distinction) {
    var scale = sequential(interpolator);

    if (distinction <= 1) {
      return scale(1);
    } else {
      //https://github.com/d3/d3-array#range
      return range(distinction).map(function (d) {
        return scale(d / (distinction - 1));
      });
    }
  };

  var categoricalColor = function categoricalColor(scheme$$1) {
    var distinction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!isString(scheme$$1) && !isArray(scheme$$1) && !isFunction(scheme$$1)) {
      warn('color scheme is invalid: should be string, array or d3 interpolator');
      warn('MetroRain8 will be used by default');
      scheme$$1 = MetroRain8;
    }

    var selectNum = distinction <= 1 ? 12 : distinction;
    // warn('categorical number is invalid: should be larger than 0');
    // warn('12 will be used by default');

    if (isString(scheme$$1)) {
      var colorSet = interpolateCategoricalScheme(scheme$$1) || interpolateSequentialScheme(scheme$$1) || interpolateDivergentScheme(scheme$$1);

      if (colorSet != null) {
        if (isArray(colorSet)) {
          return ordinal().range(colorSet);
        } else {
          return ordinal().range(_selectFromScheme(colorSet, selectNum));
        }
      } else {
        return ordinal().range(MetroRain8);
      }
    } else if (isFunction(scheme$$1)) {
      return ordinal().range(_selectFromScheme(scheme$$1, selectNum));
    } else {
      return ordinal().range(scheme$$1);
    }
  };

  var Globals = {
    DataType: {
      DATE: 'date',
      NUMBER: 'number',
      STRING: 'string'
    },

    ColorType: {
      GRADIENT: 'gradient',
      DISTINCT: 'distinct',
      CATEGORICAL: 'categorical',
      DIVERGENT: 'divergent'
    }
  };

  var genericColor = function genericColor(color, data) {
    var _scheme = color.scheme;
    var _type = color.type;

    switch (_type) {
      case Globals.ColorType.GRADIENT:
        return gradientColor(_scheme, data);

      case Globals.ColorType.DISTINCT:
        var _valMap = data ? color.distinction.map(function (d) {
          return max(data) * +d;
        }) : color.distinction;

        return distinctColor(_scheme, _valMap);

      case Globals.ColorType.DIVERGENT:
        return divergentColor(_scheme, data);

      case Globals.ColorType.CATEGORICAL:
        return categoricalColor(_scheme);

      default:
        warn('color type should be gradient, distinct, divergent or categorical');
        break;
    }
  };

  var DefaultDataComposer = function DefaultDataComposer(data, opt, cleanse) {
    return data;
  };
  var DefaultColorComposer = function DefaultColorComposer(color, data, opt) {
    return genericColor(color);
  };

  var makeComposers = function makeComposers(comp) {
    return {
      opt: comp.opt || null,
      data: comp.data || DefaultDataComposer,
      color: comp.color || DefaultColorComposer
    };
  };

  var apiOn = function apiOn(state) {
    return {
      on: function on(name, callback) {
        state._listeners.on(name, callback);
      }
    };
  };

  var apiColor = function apiColor(state) {
    return {
      color: function color(_color) {
        state._options.color = _color;
        state._color = genericColor(_color);
      }
    };
  };

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root$1['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return func + '';
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root$1, 'Map');

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map$1 || ListCache)(),
      'string': new Hash()
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs$$1 = data.__data__;
      if (!Map$1 || pairs$$1.length < LARGE_ARRAY_SIZE - 1) {
        pairs$$1.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs$$1);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  var defineProperty$1 = function () {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }();

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty$1) {
      defineProperty$1(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if (value !== undefined && !eq(object[key], value) || value === undefined && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /** Detect free variable `exports`. */
  var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root$1.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /** Built-in value references. */
  var Uint8Array = root$1.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = function () {
    function object() {}
    return function (proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = undefined;
      return result;
    };
  }();

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$5;

    return value === proto;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function () {
    return arguments;
  }()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty$4.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$1 = freeExports$1 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

  /** Built-in value references. */
  var Buffer$1 = moduleExports$1 ? root$1.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype,
      objectProto$7 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString$2.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
  }

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag$1 = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$2 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$2 = freeExports$2 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports$2 && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = function () {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$2 && freeModule$2.require && freeModule$2.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /**
   * Gets the value at `key`, unless `key` is "__proto__".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
    length = length == null ? MAX_SAFE_INTEGER$1 : length;

    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && (
      // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' ||
      // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') ||
      // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
      // Skip index properties.
      isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function (srcValue, key) {
      if (isObject(srcValue)) {
        stack || (stack = new Stack());
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity$4(value) {
    return value;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant$5(value) {
    return function () {
      return value;
    };
  }

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty$1 ? identity$4 : function (func, string) {
    return defineProperty$1(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant$5(string),
      'writable': true
    });
  };

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function () {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity$4), func + '');
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index === 'undefined' ? 'undefined' : _typeof$1(index);
    if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function (object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /**
   * This method is like `_.merge` except that it accepts `customizer` which
   * is invoked to produce the merged values of the destination and source
   * properties. If `customizer` returns `undefined`, merging is handled by the
   * method instead. The `customizer` is invoked with six arguments:
   * (objValue, srcValue, key, object, source, stack).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
   *   if (_.isArray(objValue)) {
   *     return objValue.concat(srcValue);
   *   }
   * }
   *
   * var object = { 'a': [1], 'b': [2] };
   * var other = { 'a': [3], 'b': [4] };
   *
   * _.mergeWith(object, other, customizer);
   * // => { 'a': [1, 3], 'b': [2, 4] }
   */
  var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
    baseMerge(object, source, srcIndex, customizer);
  });

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge$1 = createAssigner(function (object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  var MergeCustomizer = function MergeCustomizer(objValue, srcValue) {
    if (isArray(objValue)) {
      var hasObjDef = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = objValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var d = _step.value;

          if (isObject(d)) {
            hasObjDef = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (hasObjDef === false) {
        // copy rather than concat
        return srcValue;
      } else if (objValue.length === 0) {
        // target is placeholder but not template
        return srcValue;
      } else if (objValue.length === 1) {
        // the single and first value is used as template
        var _template = objValue[0];

        return srcValue.map(function (d) {
          return merge$1(Object.assign({}, _template), d);
        });
      } else {
        // target has multiple values, all source are merged by index

        return objValue.map(function (d, i) {
          var _tep = Object.assign({}, d);

          if (srcValue.length > i) {
            return merge$1(_tep, srcValue[i]);
          } else {
            return _tep;
          }
        });
      }
    }
  };

  var merge$1$1 = function merge$$1(target, source) {
    if (source === undefined || source === null) return target;

    mergeWith(target, source, MergeCustomizer);

    return target;
  };

  var apiOptions = function apiOptions(state) {
    return {
      options: function options(opt) {
        state._options = merge$1$1(state._options, opt);
        return state._options;
      }
    };
  };

  var apiData = function apiData(state) {
    return {
      data: function data(_data) {
        if (_data !== undefined && _data !== null) {
          state._data = state._composers.data(_data, state._options, true);
        }

        return state._data;
      }
    };
  };

  var renderSVG = function renderSVG(containerId, opt) {
    var container = select(containerId).append('svg').attr('width', opt.chart.width).attr('height', opt.chart.height).attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 ' + opt.chart.width + ' ' + opt.chart.height).classed('vizart-chart', true);

    var svg = container.append('g').attr('transform', 'translate(' + opt.chart.margin.left + ',' + opt.chart.margin.top + ')');

    return {
      container: container,
      svg: svg
    };
  };

  var apiRender = function apiRender(state) {
    return {
      render: function render(data) {
        state._data = state._composers.data(data, state._options, true);
        state._color = state._composers.color(state._options.color, state._data, state._options);

        var _renderSVG = renderSVG(state._containerId, state._options),
            container = _renderSVG.container,
            svg = _renderSVG.svg;

        state._container = container;
        state._svg = svg;
      }
    };
  };

  var apiUpdate = function apiUpdate(state) {
    return {
      update: function update() {
        state._data = state._composers.data(state._data, state._options, false);
        state._color = state._composers.color(state._options.color, state._data, state._options);
      }
    };
  };

  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  var uuid = function uuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  // isMobile
  var isMobile = function isMobile() {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))
    );
  };

  var containerWidth = function containerWidth(container) {
    return parseInt(container.node().getBoundingClientRect().width, 10) || 400;
  };
  var containerHeight = function containerHeight(container) {
    return parseInt(container.node().getBoundingClientRect().height, 10) || 300;
  };

  /*
   Sanitize and provide default for the container height.
   */
  var sanitizeHeight = function sanitizeHeight(container) {
    return container.node() === null ? 0 : containerHeight(container) || 300;
  };

  /*
   Sanitize and provide default for the container width.
   */
  var sanitizeWidth = function sanitizeWidth(container) {
    return container.node() === null ? 0 : containerWidth(container) || 400;
  };

  var isDefined = function isDefined(d) {
    return d !== undefined && d !== null && !Number.isNaN(d);
  };

  var assignContainerBound = function assignContainerBound(containerId, opt) {
    var _opt$chart = opt.chart,
        userWidth = _opt$chart.width,
        userHeight = _opt$chart.height,
        _opt$chart$margin = _opt$chart.margin,
        top = _opt$chart$margin.top,
        bottom = _opt$chart$margin.bottom,
        left = _opt$chart$margin.left,
        right = _opt$chart$margin.right;

    var container = select(containerId);

    // check if user setting is valid
    if (isDefined(userWidth)) {
      if (userWidth <= left + right) {
        warn('invalid width setting has been ignored');
        delete opt.chart['width'];
      }
    }

    if (isDefined(userHeight)) {
      if (userHeight <= top + bottom) {
        warn('invalid height setting has been ignored');
        delete opt.chart['height'];
      }
    }

    // user setting has priority
    if (!isDefined(opt.chart.width)) {
      opt.chart.width = sanitizeWidth(container);
    }

    if (!isDefined(opt.chart.height)) {
      opt.chart.height = sanitizeHeight(container);
    }

    opt.chart.innerWidth = opt.chart.width - left - right;
    opt.chart.innerHeight = opt.chart.height - top - bottom;

    return opt;
  };

  var baseOpt = function baseOpt() {
    return {
      // v1.0
      chart: {
        type: null,
        width: null,
        height: null,
        className: null,
        margin: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        background: {
          color: null,
          opacity: 1
        }
      },
      animation: {
        enabled: true,
        duration: {
          add: 500,
          update: 1000,
          remove: 500,
          color: 500,
          tooltip: 0,
          quickUpdate: 500
        }
      },
      events: {
        render: null,
        update: null,
        drilldown: null,
        drillup: null,
        drillupall: null,
        selection: null
      },
      color: {
        scheme: '', // string or array
        type: '',
        kmeans: true
      },
      plots: {},
      tooltip: {
        className: null,
        enabled: true,
        duration: 500,
        offset: [30, 30],
        formatter: function formatter() {}
      },
      data: {},

      // v2.0
      title: {
        enabled: false,
        text: null,
        style: '',
        align: 'center'
      },

      legend: {
        enabled: false
      }
    };
  };

  var mergeOptions = function mergeOptions() {
    for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
      opts[_key] = arguments[_key];
    }

    var base = Object.assign({}, baseOpt());

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = opts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var o = _step.value;

        merge$1$1(base, o);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return base;
  };

  var StandardDispatchers = {
    Rendered: 'rendered'
  };

  var initOpt = function initOpt(userOpt, composer) {
    var opt = composer.opt;

    if (typeof opt === 'function') {
      return opt(userOpt);
    } else if (Array.isArray(opt)) {
      return mergeOptions.apply(undefined, toConsumableArray$1(opt).concat([userOpt]));
    } else {
      return mergeOptions(opt, userOpt);
    }
  };

  var initState = function initState(containerId, opt, composers) {
    return {
      _isMobileSize: isMobile(),
      _id: uuid(),
      _listeners: dispatch(Object.values(StandardDispatchers)),
      _options: assignContainerBound(containerId, initOpt(opt, composers)),
      _data: [],
      _color: null,
      _container: null,
      _containerId: containerId,
      _composers: composers
    };
  };

  var svgLayer = function svgLayer(containerId, opt, composers) {
    var state = initState(containerId, opt, makeComposers(composers));

    return Object.assign(state, apiOn(state), apiColor(state), apiOptions(state), apiData(state), apiRender(state), apiUpdate(state));
  };

  var apiRender$1 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var container = state._container,
            containerId = state._containerId,
            frontCanvasId = state._frontCanvasId,
            hiddenCanvasId = state._hiddenCanvasId,
            opts = state._options;

        container.style('position', 'absolute').style('pointer-events', 'none');

        var detachedContainer = select(containerId).append('vizart-detached');
        var devicePixelRatio = window.devicePixelRatio || 1;
        var frontCanvas = select(containerId).append('canvas').attr('id', frontCanvasId).style('position', 'absolute').style('display', 'block').style('width', opts.chart.innerWidth + 'px').style('height', opts.chart.innerHeight + 'px').style('margin', opts.chart.margin.top + 'px 0 0 ' + opts.chart.margin.left + 'px ').attr('width', opts.chart.innerWidth * devicePixelRatio).attr('height', opts.chart.innerHeight * devicePixelRatio);

        var hiddenCanvas = select(containerId).append('canvas').attr('id', hiddenCanvasId).style('position', 'absolute').style('display', 'none').style('width', opts.chart.innerWidth + 'px').style('height', opts.chart.innerHeight + 'px').style('margin', opts.chart.margin.top + 'px 0 0 ' + opts.chart.margin.left + 'px ').attr('width', opts.chart.innerWidth * devicePixelRatio).attr('height', opts.chart.innerHeight * devicePixelRatio);

        var hiddenContext = hiddenCanvas.node().getContext('2d');
        var frontContext = frontCanvas.node().getContext('2d');

        hiddenContext.mozImageSmoothingEnabled = false;
        hiddenContext.webkitImageSmoothingEnabled = false;
        hiddenContext.msImageSmoothingEnabled = false;
        hiddenContext.imageSmoothingEnabled = false;

        var backingStoreRatio = frontContext.webkitBackingStorePixelRatio || frontContext.mozBackingStorePixelRatio || frontContext.msBackingStorePixelRatio || frontContext.oBackingStorePixelRatio || frontContext.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;
        var canvasScale = ratio;
        frontContext.scale(ratio, ratio);
        hiddenContext.scale(ratio, ratio);

        state._frontCanvas = frontCanvas;
        state._hiddenCanvas = hiddenCanvas;
        state._frontContext = frontContext;
        state._hiddenContext = hiddenContext;
        state._canvasScale = canvasScale;
        state._detachedContainer = detachedContainer;
      }
    };
  };

  var drawCell = function drawCell(context, cell) {
    if (!cell) return false;
    context.moveTo(cell[0][0], cell[0][1]);
    for (var j = 1, m = cell.length; j < m; ++j) {
      context.lineTo(cell[j][0], cell[j][1]);
    }
    context.closePath();
    return true;
  };

  var drawVoronoi = function drawVoronoi(context, diagram, color) {
    context.save();
    var polygons = diagram.polygons();

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = color;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = polygons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var p = _step.value;

        drawCell(context, p);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    context.stroke();
    context.closePath();
    context.restore();
  };

  /**
   * Collapse the quadtree into an array of rectangles.
   *
   * @param quadtree
   * @returns {Array}
   */
  var flattenQuadtree = function flattenQuadtree(quadtree$$1) {
    var nodes = [];
    quadtree$$1.visit(function (node, x0, y0, x1, y1) {
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      nodes.push(node);
    });
    return nodes;
  };

  var drawQuadtree = function drawQuadtree(context, diagram, color) {
    context.save();
    var rects = flattenQuadtree(diagram);

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = color;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = rects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var r = _step.value;

        context.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    context.stroke();
    context.closePath();

    context.restore();
  };

  var apiRevealVoronoi = function apiRevealVoronoi(state) {
    return {
      revealVoronoi: function revealVoronoi() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#ff5730';

        if (!state.hasOwnProperty(state, '_voronoi')) {
          console.error('voronoi is not enabled in chart');
          return;
        }

        drawVoronoi(state._frontContext, state._voronoi, color);
      }
    };
  };

  var apiRevealQuadtree = function apiRevealQuadtree(state) {
    return {
      revealQuadtree: function revealQuadtree() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#1f97e7';

        if (!state.hasOwnProperty(state, '_quadtree')) {
          console.error('quadtree is not enabled in chart');
          return;
        }

        drawQuadtree(state._frontContext, state._quadtree, color);
      }
    };
  };

  var CanvasState = function CanvasState() {
    return {
      _hiddenCanvasId: 'hidden-canvas' + uuid(),
      _frontCanvasId: 'front-canvas-' + uuid(),
      _frontCanvas: null,
      _hiddenCanvas: null,
      _frontContext: null,
      _hiddenContext: null,
      _detachedContainer: null,
      _voronoi: null,
      _quadtree: null,
      _animationState: null
    };
  };

  var canvasLayer = function canvasLayer(containerId, opt, composers) {
    var base = initState(containerId, opt, makeComposers(composers));
    var state = Object.assign(base, CanvasState());

    return Object.assign(state, apiOn(state), apiColor(state), apiOptions(state), apiData(state), apiRevealVoronoi(state), apiRevealQuadtree(state), apiRender$1(state), apiUpdate(state));
  };

  var compose = function compose(baseLayer, fns) {
    return fns.reduce(function (acc, cur) {
      acc = Object.assign(acc, cur(acc));
      return acc;
    }, baseLayer);
  };

  var factory = function factory(baseLayer, composers, apis) {
    return function (id, opt) {
      return compose(baseLayer(id, opt, composers), apis);
    };
  };

  var DefaultCategoricalColor = {
    scheme: TheMetLight,
    type: Globals.ColorType.CATEGORICAL
  };

  function defaultSeparation(a, b) {
    return a.parent === b.parent ? 1 : 2;
  }

  function meanX(children) {
    return children.reduce(meanXReduce, 0) / children.length;
  }

  function meanXReduce(x, c) {
    return x + c.x;
  }

  function maxY(children) {
    return 1 + children.reduce(maxYReduce, 0);
  }

  function maxYReduce(y, c) {
    return Math.max(y, c.y);
  }

  function leafLeft(node) {
    var children;
    while (children = node.children) {
      node = children[0];
    }return node;
  }

  function leafRight(node) {
    var children;
    while (children = node.children) {
      node = children[children.length - 1];
    }return node;
  }

  function cluster () {
    var separation = defaultSeparation,
        dx = 1,
        dy = 1,
        nodeSize = false;

    function cluster(root) {
      var previousNode,
          x = 0;

      // First walk, computing the initial x & y values.
      root.eachAfter(function (node) {
        var children = node.children;
        if (children) {
          node.x = meanX(children);
          node.y = maxY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });

      var left = leafLeft(root),
          right = leafRight(root),
          x0 = left.x - separation(left, right) / 2,
          x1 = right.x + separation(right, left) / 2;

      // Second walk, normalizing x & y to the desired size.
      return root.eachAfter(nodeSize ? function (node) {
        node.x = (node.x - root.x) * dx;
        node.y = (root.y - node.y) * dy;
      } : function (node) {
        node.x = (node.x - x0) / (x1 - x0) * dx;
        node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
      });
    }

    cluster.separation = function (x) {
      return arguments.length ? (separation = x, cluster) : separation;
    };

    cluster.size = function (x) {
      return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], cluster) : nodeSize ? null : [dx, dy];
    };

    cluster.nodeSize = function (x) {
      return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : nodeSize ? [dx, dy] : null;
    };

    return cluster;
  }

  function count(node) {
    var sum = 0,
        children = node.children,
        i = children && children.length;
    if (!i) sum = 1;else while (--i >= 0) {
      sum += children[i].value;
    }node.value = sum;
  }

  function node_count () {
    return this.eachAfter(count);
  }

  function node_each (callback) {
    var node = this,
        current,
        next = [node],
        children,
        i,
        n;
    do {
      current = next.reverse(), next = [];
      while (node = current.pop()) {
        callback(node), children = node.children;
        if (children) for (i = 0, n = children.length; i < n; ++i) {
          next.push(children[i]);
        }
      }
    } while (next.length);
    return this;
  }

  function node_eachBefore (callback) {
    var node = this,
        nodes = [node],
        children,
        i;
    while (node = nodes.pop()) {
      callback(node), children = node.children;
      if (children) for (i = children.length - 1; i >= 0; --i) {
        nodes.push(children[i]);
      }
    }
    return this;
  }

  function node_eachAfter (callback) {
    var node = this,
        nodes = [node],
        next = [],
        children,
        i,
        n;
    while (node = nodes.pop()) {
      next.push(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        nodes.push(children[i]);
      }
    }
    while (node = next.pop()) {
      callback(node);
    }
    return this;
  }

  function node_sum (value) {
    return this.eachAfter(function (node) {
      var sum = +value(node.data) || 0,
          children = node.children,
          i = children && children.length;
      while (--i >= 0) {
        sum += children[i].value;
      }node.value = sum;
    });
  }

  function node_sort (compare) {
    return this.eachBefore(function (node) {
      if (node.children) {
        node.children.sort(compare);
      }
    });
  }

  function node_path (end) {
    var start = this,
        ancestor = leastCommonAncestor(start, end),
        nodes = [start];
    while (start !== ancestor) {
      start = start.parent;
      nodes.push(start);
    }
    var k = nodes.length;
    while (end !== ancestor) {
      nodes.splice(k, 0, end);
      end = end.parent;
    }
    return nodes;
  }

  function leastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = a.ancestors(),
        bNodes = b.ancestors(),
        c = null;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
      c = a;
      a = aNodes.pop();
      b = bNodes.pop();
    }
    return c;
  }

  function node_ancestors () {
    var node = this,
        nodes = [node];
    while (node = node.parent) {
      nodes.push(node);
    }
    return nodes;
  }

  function node_descendants () {
    var nodes = [];
    this.each(function (node) {
      nodes.push(node);
    });
    return nodes;
  }

  function node_leaves () {
    var leaves = [];
    this.eachBefore(function (node) {
      if (!node.children) {
        leaves.push(node);
      }
    });
    return leaves;
  }

  function node_links () {
    var root = this,
        links = [];
    root.each(function (node) {
      if (node !== root) {
        // Don’t include the root’s parent, if any.
        links.push({ source: node.parent, target: node });
      }
    });
    return links;
  }

  function hierarchy(data, children) {
    var root = new Node(data),
        valued = +data.value && (root.value = data.value),
        node,
        nodes = [root],
        child,
        childs,
        i,
        n;

    if (children == null) children = defaultChildren;

    while (node = nodes.pop()) {
      if (valued) node.value = +node.data.value;
      if ((childs = children(node.data)) && (n = childs.length)) {
        node.children = new Array(n);
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = node.children[i] = new Node(childs[i]));
          child.parent = node;
          child.depth = node.depth + 1;
        }
      }
    }

    return root.eachBefore(computeHeight);
  }

  function node_copy() {
    return hierarchy(this).eachBefore(copyData);
  }

  function defaultChildren(d) {
    return d.children;
  }

  function copyData(node) {
    node.data = node.data.data;
  }

  function computeHeight(node) {
    var height = 0;
    do {
      node.height = height;
    } while ((node = node.parent) && node.height < ++height);
  }

  function Node(data) {
    this.data = data;
    this.depth = this.height = 0;
    this.parent = null;
  }

  Node.prototype = hierarchy.prototype = {
    constructor: Node,
    count: node_count,
    each: node_each,
    eachAfter: node_eachAfter,
    eachBefore: node_eachBefore,
    sum: node_sum,
    sort: node_sort,
    path: node_path,
    ancestors: node_ancestors,
    descendants: node_descendants,
    leaves: node_leaves,
    links: node_links,
    copy: node_copy
  };

  var slice$2 = Array.prototype.slice;

  function shuffle$1(array) {
    var m = array.length,
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  function enclose (circles) {
    var i = 0,
        n = (circles = shuffle$1(slice$2.call(circles))).length,
        B = [],
        p,
        e;

    while (i < n) {
      p = circles[i];
      if (e && enclosesWeak(e, p)) ++i;else e = encloseBasis(B = extendBasis(B, p)), i = 0;
    }

    return e;
  }

  function extendBasis(B, p) {
    var i, j;

    if (enclosesWeakAll(p, B)) return [p];

    // If we get here then B must have at least one element.
    for (i = 0; i < B.length; ++i) {
      if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
        return [B[i], p];
      }
    }

    // If we get here then B must have at least two elements.
    for (i = 0; i < B.length - 1; ++i) {
      for (j = i + 1; j < B.length; ++j) {
        if (enclosesNot(encloseBasis2(B[i], B[j]), p) && enclosesNot(encloseBasis2(B[i], p), B[j]) && enclosesNot(encloseBasis2(B[j], p), B[i]) && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
          return [B[i], B[j], p];
        }
      }
    }

    // If we get here then something is very wrong.
    throw new Error();
  }

  function enclosesNot(a, b) {
    var dr = a.r - b.r,
        dx = b.x - a.x,
        dy = b.y - a.y;
    return dr < 0 || dr * dr < dx * dx + dy * dy;
  }

  function enclosesWeak(a, b) {
    var dr = a.r - b.r + 1e-6,
        dx = b.x - a.x,
        dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }

  function enclosesWeakAll(a, B) {
    for (var i = 0; i < B.length; ++i) {
      if (!enclosesWeak(a, B[i])) {
        return false;
      }
    }
    return true;
  }

  function encloseBasis(B) {
    switch (B.length) {
      case 1:
        return encloseBasis1(B[0]);
      case 2:
        return encloseBasis2(B[0], B[1]);
      case 3:
        return encloseBasis3(B[0], B[1], B[2]);
    }
  }

  function encloseBasis1(a) {
    return {
      x: a.x,
      y: a.y,
      r: a.r
    };
  }

  function encloseBasis2(a, b) {
    var x1 = a.x,
        y1 = a.y,
        r1 = a.r,
        x2 = b.x,
        y2 = b.y,
        r2 = b.r,
        x21 = x2 - x1,
        y21 = y2 - y1,
        r21 = r2 - r1,
        l = Math.sqrt(x21 * x21 + y21 * y21);
    return {
      x: (x1 + x2 + x21 / l * r21) / 2,
      y: (y1 + y2 + y21 / l * r21) / 2,
      r: (l + r1 + r2) / 2
    };
  }

  function encloseBasis3(a, b, c) {
    var x1 = a.x,
        y1 = a.y,
        r1 = a.r,
        x2 = b.x,
        y2 = b.y,
        r2 = b.r,
        x3 = c.x,
        y3 = c.y,
        r3 = c.r,
        a2 = x1 - x2,
        a3 = x1 - x3,
        b2 = y1 - y2,
        b3 = y1 - y3,
        c2 = r2 - r1,
        c3 = r3 - r1,
        d1 = x1 * x1 + y1 * y1 - r1 * r1,
        d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
        d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
        ab = a3 * b2 - a2 * b3,
        xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
        xb = (b3 * c2 - b2 * c3) / ab,
        ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
        yb = (a2 * c3 - a3 * c2) / ab,
        A = xb * xb + yb * yb - 1,
        B = 2 * (r1 + xa * xb + ya * yb),
        C = xa * xa + ya * ya - r1 * r1,
        r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
    return {
      x: x1 + xa + xb * r,
      y: y1 + ya + yb * r,
      r: r
    };
  }

  function place(b, a, c) {
    var dx = b.x - a.x,
        x,
        a2,
        dy = b.y - a.y,
        y,
        b2,
        d2 = dx * dx + dy * dy;
    if (d2) {
      a2 = a.r + c.r, a2 *= a2;
      b2 = b.r + c.r, b2 *= b2;
      if (a2 > b2) {
        x = (d2 + b2 - a2) / (2 * d2);
        y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
        c.x = b.x - x * dx - y * dy;
        c.y = b.y - x * dy + y * dx;
      } else {
        x = (d2 + a2 - b2) / (2 * d2);
        y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
        c.x = a.x + x * dx - y * dy;
        c.y = a.y + x * dy + y * dx;
      }
    } else {
      c.x = a.x + c.r;
      c.y = a.y;
    }
  }

  function intersects(a, b) {
    var dr = a.r + b.r - 1e-6,
        dx = b.x - a.x,
        dy = b.y - a.y;
    return dr > 0 && dr * dr > dx * dx + dy * dy;
  }

  function score(node) {
    var a = node._,
        b = node.next._,
        ab = a.r + b.r,
        dx = (a.x * b.r + b.x * a.r) / ab,
        dy = (a.y * b.r + b.y * a.r) / ab;
    return dx * dx + dy * dy;
  }

  function Node$1(circle) {
    this._ = circle;
    this.next = null;
    this.previous = null;
  }

  function packEnclose(circles) {
    if (!(n = circles.length)) return 0;

    var a, b, c, n, aa, ca, i, j, k, sj, sk;

    // Place the first circle.
    a = circles[0], a.x = 0, a.y = 0;
    if (!(n > 1)) return a.r;

    // Place the second circle.
    b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
    if (!(n > 2)) return a.r + b.r;

    // Place the third circle.
    place(b, a, c = circles[2]);

    // Initialize the front-chain using the first three circles a, b and c.
    a = new Node$1(a), b = new Node$1(b), c = new Node$1(c);
    a.next = c.previous = b;
    b.next = a.previous = c;
    c.next = b.previous = a;

    // Attempt to place each remaining circle…
    pack: for (i = 3; i < n; ++i) {
      place(a._, b._, c = circles[i]), c = new Node$1(c);

      // Find the closest intersecting circle on the front-chain, if any.
      // “Closeness” is determined by linear distance along the front-chain.
      // “Ahead” or “behind” is likewise determined by linear distance.
      j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
      do {
        if (sj <= sk) {
          if (intersects(j._, c._)) {
            b = j, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sj += j._.r, j = j.next;
        } else {
          if (intersects(k._, c._)) {
            a = k, a.next = b, b.previous = a, --i;
            continue pack;
          }
          sk += k._.r, k = k.previous;
        }
      } while (j !== k.next);

      // Success! Insert the new circle c between a and b.
      c.previous = a, c.next = b, a.next = b.previous = b = c;

      // Compute the new closest circle pair to the centroid.
      aa = score(a);
      while ((c = c.next) !== b) {
        if ((ca = score(c)) < aa) {
          a = c, aa = ca;
        }
      }
      b = a.next;
    }

    // Compute the enclosing circle of the front chain.
    a = [b._], c = b;while ((c = c.next) !== b) {
      a.push(c._);
    }c = enclose(a);

    // Translate the circles to put the enclosing circle around the origin.
    for (i = 0; i < n; ++i) {
      a = circles[i], a.x -= c.x, a.y -= c.y;
    }return c.r;
  }

  function optional(f) {
    return f == null ? null : required(f);
  }

  function required(f) {
    if (typeof f !== "function") throw new Error();
    return f;
  }

  function constantZero() {
    return 0;
  }

  function constant$6 (x) {
    return function () {
      return x;
    };
  }

  function defaultRadius(d) {
    return Math.sqrt(d.value);
  }

  function pack$1 () {
    var radius = null,
        dx = 1,
        dy = 1,
        padding = constantZero;

    function pack(root) {
      root.x = dx / 2, root.y = dy / 2;
      if (radius) {
        root.eachBefore(radiusLeaf(radius)).eachAfter(packChildren(padding, 0.5)).eachBefore(translateChild(1));
      } else {
        root.eachBefore(radiusLeaf(defaultRadius)).eachAfter(packChildren(constantZero, 1)).eachAfter(packChildren(padding, root.r / Math.min(dx, dy))).eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
      }
      return root;
    }

    pack.radius = function (x) {
      return arguments.length ? (radius = optional(x), pack) : radius;
    };

    pack.size = function (x) {
      return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
    };

    pack.padding = function (x) {
      return arguments.length ? (padding = typeof x === "function" ? x : constant$6(+x), pack) : padding;
    };

    return pack;
  }

  function radiusLeaf(radius) {
    return function (node) {
      if (!node.children) {
        node.r = Math.max(0, +radius(node) || 0);
      }
    };
  }

  function packChildren(padding, k) {
    return function (node) {
      if (children = node.children) {
        var children,
            i,
            n = children.length,
            r = padding(node) * k || 0,
            e;

        if (r) for (i = 0; i < n; ++i) {
          children[i].r += r;
        }e = packEnclose(children);
        if (r) for (i = 0; i < n; ++i) {
          children[i].r -= r;
        }node.r = e + r;
      }
    };
  }

  function translateChild(k) {
    return function (node) {
      var parent = node.parent;
      node.r *= k;
      if (parent) {
        node.x = parent.x + k * node.x;
        node.y = parent.y + k * node.y;
      }
    };
  }

  function roundNode (node) {
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
  }

  function treemapDice (parent, x0, y0, x1, y1) {
    var nodes = parent.children,
        node,
        i = -1,
        n = nodes.length,
        k = parent.value && (x1 - x0) / parent.value;

    while (++i < n) {
      node = nodes[i], node.y0 = y0, node.y1 = y1;
      node.x0 = x0, node.x1 = x0 += node.value * k;
    }
  }

  function partition () {
    var dx = 1,
        dy = 1,
        padding = 0,
        round = false;

    function partition(root) {
      var n = root.height + 1;
      root.x0 = root.y0 = padding;
      root.x1 = dx;
      root.y1 = dy / n;
      root.eachBefore(positionNode(dy, n));
      if (round) root.eachBefore(roundNode);
      return root;
    }

    function positionNode(dy, n) {
      return function (node) {
        if (node.children) {
          treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
        }
        var x0 = node.x0,
            y0 = node.y0,
            x1 = node.x1 - padding,
            y1 = node.y1 - padding;
        if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
        if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
      };
    }

    partition.round = function (x) {
      return arguments.length ? (round = !!x, partition) : round;
    };

    partition.size = function (x) {
      return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
    };

    partition.padding = function (x) {
      return arguments.length ? (padding = +x, partition) : padding;
    };

    return partition;
  }

  function defaultSeparation$1(a, b) {
    return a.parent === b.parent ? 1 : 2;
  }

  // function radialSeparation(a, b) {
  //   return (a.parent === b.parent ? 1 : 2) / a.depth;
  // }

  // This function is used to traverse the left contour of a subtree (or
  // subforest). It returns the successor of v on this contour. This successor is
  // either given by the leftmost child of v or by the thread of v. The function
  // returns null if and only if v is on the highest level of its subtree.
  function nextLeft(v) {
    var children = v.children;
    return children ? children[0] : v.t;
  }

  // This function works analogously to nextLeft.
  function nextRight(v) {
    var children = v.children;
    return children ? children[children.length - 1] : v.t;
  }

  // Shifts the current subtree rooted at w+. This is done by increasing
  // prelim(w+) and mod(w+) by shift.
  function moveSubtree(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  }

  // All other shifts, applied to the smaller subtrees between w- and w+, are
  // performed by this function. To prepare the shifts, we have to adjust
  // change(w+), shift(w+), and change(w-).
  function executeShifts(v) {
    var shift = 0,
        change = 0,
        children = v.children,
        i = children.length,
        w;
    while (--i >= 0) {
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    }
  }

  // If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
  // returns the specified (default) ancestor.
  function nextAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
  }

  function TreeNode(node, i) {
    this._ = node;
    this.parent = null;
    this.children = null;
    this.A = null; // default ancestor
    this.a = this; // ancestor
    this.z = 0; // prelim
    this.m = 0; // mod
    this.c = 0; // change
    this.s = 0; // shift
    this.t = null; // thread
    this.i = i; // number
  }

  TreeNode.prototype = Object.create(Node.prototype);

  function treeRoot(root) {
    var tree = new TreeNode(root, 0),
        node,
        nodes = [tree],
        child,
        children,
        i,
        n;

    while (node = nodes.pop()) {
      if (children = node._.children) {
        node.children = new Array(n = children.length);
        for (i = n - 1; i >= 0; --i) {
          nodes.push(child = node.children[i] = new TreeNode(children[i], i));
          child.parent = node;
        }
      }
    }

    (tree.parent = new TreeNode(null, 0)).children = [tree];
    return tree;
  }

  // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
  function tree$1 () {
    var separation = defaultSeparation$1,
        dx = 1,
        dy = 1,
        nodeSize = null;

    function tree(root) {
      var t = treeRoot(root);

      // Compute the layout using Buchheim et al.’s algorithm.
      t.eachAfter(firstWalk), t.parent.m = -t.z;
      t.eachBefore(secondWalk);

      // If a fixed node size is specified, scale x and y.
      if (nodeSize) root.eachBefore(sizeNode);

      // If a fixed tree size is specified, scale x and y based on the extent.
      // Compute the left-most, right-most, and depth-most nodes for extents.
      else {
          var left = root,
              right = root,
              bottom = root;
          root.eachBefore(function (node) {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
            if (node.depth > bottom.depth) bottom = node;
          });
          var s = left === right ? 1 : separation(left, right) / 2,
              tx = s - left.x,
              kx = dx / (right.x + s + tx),
              ky = dy / (bottom.depth || 1);
          root.eachBefore(function (node) {
            node.x = (node.x + tx) * kx;
            node.y = node.depth * ky;
          });
        }

      return root;
    }

    // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
    // applied recursively to the children of v, as well as the function
    // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
    // node v is placed to the midpoint of its outermost children.
    function firstWalk(v) {
      var children = v.children,
          siblings = v.parent.children,
          w = v.i ? siblings[v.i - 1] : null;
      if (children) {
        executeShifts(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        } else {
          v.z = midpoint;
        }
      } else if (w) {
        v.z = w.z + separation(v._, w._);
      }
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    }

    // Computes all real x-coordinates by summing up the modifiers recursively.
    function secondWalk(v) {
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    }

    // The core of the algorithm. Here, a new subtree is combined with the
    // previous subtrees. Threads are used to traverse the inside and outside
    // contours of the left and right subtree up to the highest common level. The
    // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
    // superscript o means outside and i means inside, the subscript - means left
    // subtree and + means right subtree. For summing up the modifiers along the
    // contour, we use respective variables si+, si-, so-, and so+. Whenever two
    // nodes of the inside contours conflict, we compute the left one of the
    // greatest uncommon ancestors using the function ANCESTOR and call MOVE
    // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
    // Finally, we add a new thread (if necessary).
    function apportion(v, w, ancestor) {
      if (w) {
        var vip = v,
            vop = v,
            vim = w,
            vom = vip.parent.children[0],
            sip = vip.m,
            sop = vop.m,
            sim = vim.m,
            som = vom.m,
            shift;
        while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
          vom = nextLeft(vom);
          vop = nextRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) {
            moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          }
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        }
        if (vim && !nextRight(vop)) {
          vop.t = vim;
          vop.m += sim - sop;
        }
        if (vip && !nextLeft(vom)) {
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        }
      }
      return ancestor;
    }

    function sizeNode(node) {
      node.x *= dx;
      node.y = node.depth * dy;
    }

    tree.separation = function (x) {
      return arguments.length ? (separation = x, tree) : separation;
    };

    tree.size = function (x) {
      return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : nodeSize ? null : [dx, dy];
    };

    tree.nodeSize = function (x) {
      return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : nodeSize ? [dx, dy] : null;
    };

    return tree;
  }

  var noop$1 = { value: function value() {} };

  function dispatch$1() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch$1(_);
  }

  function Dispatch$1(_) {
    this._ = _;
  }

  function parseTypenames$2(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function (t) {
      var name = "",
          i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name: name };
    });
  }

  Dispatch$1.prototype = dispatch$1.prototype = {
    constructor: Dispatch$1,
    on: function on(typename, callback) {
      var _ = this._,
          T = parseTypenames$2(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) {
          if ((t = (typename = T[i]).type) && (t = get$2(_[t], typename.name))) return t;
        }return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$3(_[t], typename.name, callback);else if (callback == null) for (t in _) {
          _[t] = set$3(_[t], typename.name, null);
        }
      }

      return this;
    },
    copy: function copy() {
      var copy = {},
          _ = this._;
      for (var t in _) {
        copy[t] = _[t].slice();
      }return new Dispatch$1(copy);
    },
    call: function call(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
        args[i] = arguments[i + 2];
      }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
        t[i].value.apply(that, args);
      }
    },
    apply: function apply(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
        t[i].value.apply(that, args);
      }
    }
  };

  function get$2(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$3(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({ name: name, value: callback });
    return type;
  }

  var frame = 0,
      // is an animation frame pending?
  timeout = 0,
      // is a timeout pending?
  interval = 0,
      // are any timers active?
  pokeDelay = 1000,
      // how frequently we check for clock skew
  taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === "object" && performance.now ? performance : Date,
      setFrame = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
    setTimeout(f, 17);
  };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call = this._time = this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function restart(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function stop() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead,
        e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(),
        delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0,
        t1 = taskHead,
        t2,
        time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout$1 (callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart(function (elapsed) {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch$1("start", "end", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule (node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};else if (id in schedules) return;
    create$1(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get$3(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$4(node, id) {
    var schedule = get$3(node, id);
    if (schedule.state > STARTING) throw new Error("too late; already started");
    return schedule;
  }

  function get$3(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create$1(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        // Dispatch the interrupt event.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions. No interrupt event is dispatched
        // because the cancelled transitions never started. Note that this also
        // removes this transition from the pending list!
        else if (+i < id) {
            o.state = ENDED;
            o.timer.stop();
            delete schedules[i];
          }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function () {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(null, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) {
        return;
      } // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt (node, name) {
    var schedules = node.__transition,
        schedule$$1,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule$$1 = schedules[i]).name !== name) {
        empty = false;continue;
      }
      active = schedule$$1.state > STARTING && schedule$$1.state < ENDING;
      schedule$$1.state = ENDED;
      schedule$$1.timer.stop();
      if (active) schedule$$1.on.call("interrupt", node, node.__data__, schedule$$1.index, schedule$$1.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt (name) {
    return this.each(function () {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function () {
      var schedule$$1 = set$4(this, id),
          tween = schedule$$1.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule$$1.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error();
    return function () {
      var schedule$$1 = set$4(this, id),
          tween = schedule$$1.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = { name: name, value: value }, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule$$1.tween = tween1;
    };
  }

  function transition_tween (name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$3(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function () {
      var schedule$$1 = set$4(this, id);
      (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
    });

    return function (node) {
      return get$3(node, id).value[name];
    };
  }

  function interpolate (a, b) {
      var c;
      return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
  }

  function attrRemove$1(name) {
    return function () {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function () {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, interpolate$$1, value1) {
    var value00, interpolate0;
    return function () {
      var value0 = this.getAttribute(name);
      return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value1);
    };
  }

  function attrConstantNS$1(fullname, interpolate$$1, value1) {
    var value00, interpolate0;
    return function () {
      var value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value1);
    };
  }

  function attrFunction$1(name, interpolate$$1, value) {
    var value00, value10, interpolate0;
    return function () {
      var value0,
          value1 = value(this);
      if (value1 == null) return void this.removeAttribute(name);
      value0 = this.getAttribute(name);
      return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    };
  }

  function attrFunctionNS$1(fullname, interpolate$$1, value) {
    var value00, value10, interpolate0;
    return function () {
      var value0,
          value1 = value(this);
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      value0 = this.getAttributeNS(fullname.space, fullname.local);
      return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
    };
  }

  function transition_attr (name, value) {
    var fullname = namespace(name),
        i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname) : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value + ""));
  }

  function attrTweenNS(fullname, value) {
    function tween() {
      var node = this,
          i = value.apply(node, arguments);
      return i && function (t) {
        node.setAttributeNS(fullname.space, fullname.local, i(t));
      };
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    function tween() {
      var node = this,
          i = value.apply(node, arguments);
      return i && function (t) {
        node.setAttribute(name, i(t));
      };
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween (name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function () {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function () {
      init(this, id).delay = value;
    };
  }

  function transition_delay (value) {
    var id = this._id;

    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$3(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function () {
      set$4(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function () {
      set$4(this, id).duration = value;
    };
  }

  function transition_duration (value) {
    var id = this._id;

    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$3(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error();
    return function () {
      set$4(this, id).ease = value;
    };
  }

  function transition_ease (value) {
    var id = this._id;

    return arguments.length ? this.each(easeConstant(id, value)) : get$3(this.node(), id).ease;
  }

  function transition_filter (match) {
    if (typeof match !== "function") match = matcher$1(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge (transition$$1) {
    if (transition$$1._id !== this._id) throw new Error();

    for (var groups0 = this._groups, groups1 = transition$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function (t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0,
        on1,
        sit = start(name) ? init : set$4;
    return function () {
      var schedule$$1 = sit(this, id),
          on = schedule$$1.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule$$1.on = on1;
    };
  }

  function transition_on (name, listener) {
    var id = this._id;

    return arguments.length < 2 ? get$3(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function () {
      var parent = this.parentNode;
      for (var i in this.__transition) {
        if (+i !== id) return;
      }if (parent) parent.removeChild(this);
    };
  }

  function transition_remove () {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select (select$$1) {
    var name = this._name,
        id = this._id;

    if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$3(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll (select$$1) {
    var name = this._name,
        id = this._id;

    if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$3(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection$1 = selection.prototype.constructor;

  function transition_selection () {
    return new Selection$1(this._groups, this._parents);
  }

  function styleRemove$1(name, interpolate$$1) {
      var value00, value10, interpolate0;
      return function () {
          var value0 = styleValue(this, name),
              value1 = (this.style.removeProperty(name), styleValue(this, name));
          return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
      };
  }

  function styleRemoveEnd(name) {
      return function () {
          this.style.removeProperty(name);
      };
  }

  function styleConstant$1(name, interpolate$$1, value1) {
      var value00, interpolate0;
      return function () {
          var value0 = styleValue(this, name);
          return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value1);
      };
  }

  function styleFunction$1(name, interpolate$$1, value) {
      var value00, value10, interpolate0;
      return function () {
          var value0 = styleValue(this, name),
              value1 = value(this);
          if (value1 == null) value1 = (this.style.removeProperty(name), styleValue(this, name));
          return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
      };
  }

  function transition_style (name, value, priority) {
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
      return value == null ? this.styleTween(name, styleRemove$1(name, i)).on("end.style." + name, styleRemoveEnd(name)) : this.styleTween(name, typeof value === "function" ? styleFunction$1(name, i, tweenValue(this, "style." + name, value)) : styleConstant$1(name, i, value + ""), priority);
  }

  function styleTween(name, value, priority) {
    function tween() {
      var node = this,
          i = value.apply(node, arguments);
      return i && function (t) {
        node.style.setProperty(name, i(t), priority);
      };
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween (name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant$1(value) {
    return function () {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function () {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text (value) {
    return this.tween("text", typeof value === "function" ? textFunction$1(tweenValue(this, "text", value)) : textConstant$1(value == null ? "" : value + ""));
  }

  function transition_transition () {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$3(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function transition(name) {
    return selection().transition(name);
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var pi = Math.PI;

  var tau = 2 * Math.PI;

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        return defaultTiming.time = now(), defaultTiming;
      }
    }
    return timing;
  }

  function selection_transition (name) {
    var id, timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  var apiRender$2 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var _options = state._options,
            _data = state._data,
            _svg = state._svg,
            _color = state._color,
            _containerId = state._containerId;


        var _height = _options.chart.innerHeight;

        var xScale = linear$1().range([0, _options.chart.innerWidth]);
        var yScale = linear$1().range([0, _options.chart.innerHeight]);

        var _partition = partition().size([_options.chart.innerWidth, _options.chart.innerHeight]).padding(0).round(true);

        var _tree = hierarchy(_data).sum(function (d) {
          return d.size;
        });
        var _root = _partition(_tree);

        var rect = _svg.selectAll('.icicle-slice');
        var label = _svg.selectAll('.icicle-label');

        var clicked = function clicked(d) {
          xScale.domain([d.x0, d.x1]);
          yScale.domain([d.y0, _height]).range([d.depth ? 20 : 0, _height]);

          transition().selectAll(_containerId + ' .icicle-slice').duration(750).attr('x', function (d) {
            return xScale(d.x0);
          }).attr('y', function (d) {
            return yScale(d.y0);
          }).attr('width', function (d) {
            return xScale(d.x1) - xScale(d.x0);
          }).attr('height', function (d) {
            return yScale(d.y1) - yScale(d.y0);
          });

          transition().selectAll(_containerId + ' .icicle-slice').duration(_options.animation.duration.quickUpdate).attr('x', function (d) {
            return xScale(d.x0);
          }).attr('y', function (d) {
            return yScale(d.y0);
          }).attr('dx', 5).attr('dy', 20);
        };

        rect.data(_root.descendants()).enter().append('rect').attr('class', 'icicle-slice').attr('stroke', '#fff').attr('x', function (d) {
          return d.x0;
        }).attr('y', function (d) {
          return d.y0;
        }).attr('width', function (d) {
          return d.x1 - d.x0;
        }).attr('height', function (d) {
          return d.y1 - d.y0;
        }).attr('fill', function (d) {
          return _color(d.data.name);
        }).on('click', clicked);

        label.data(_root.descendants()).enter().append('text').attr('class', 'icicle-label').attr('x', function (d) {
          return xScale(d.x0);
        }).attr('y', function (d) {
          return yScale(d.y0);
        }).attr('dx', 5).attr('dy', 20).attr('text-anchor', 'start').text(function (d) {
          return d.data.name;
        }).style('color', 'white').style('font-size', '12px').on('click', clicked);
      }
    };
  };

  var apiColor$1 = function apiColor(state) {
    return {
      color: function color(colorOpt) {
        if (!colorOpt) {
          console.warn('color opt is null, either scheme or type is required');
          return;
        } else if (!colorOpt.type && !colorOpt.scheme) {
          console.warn('invalid color opt, either scheme or type is required');
          return;
        }

        if (colorOpt.type) {
          state._options.color.type = colorOpt.type;
        }

        if (colorOpt.scheme) {
          state._options.color.scheme = colorOpt.scheme;
        }

        var _options = state._options,
            _composers = state._composers,
            _containerId = state._containerId,
            _color = state._color;

        state._color = _composers.color(state._options.color);

        transition().selectAll(_containerId + ' .icicle-slice').duration(_options.animation.duration.update).attr('fill', function (d) {
          return _color(d.name);
        });
      }
    };
  };

  var opt = {
    chart: {
      type: 'icicle-tree'
    },
    color: DefaultCategoricalColor
  };

  var index$1 = factory(svgLayer, { opt: opt }, [apiRender$2, apiColor$1]);

  var diagonalHorizontal = function diagonalHorizontal(d) {
    return 'M' + d.y + ',' + d.x + 'C' + (d.parent.y + 100) + ',' + d.x + ' ' + (d.parent.y + 100) + ',' + d.parent.x + ' ' + d.parent.y + ',' + d.parent.x;
  };

  var draw = function draw(state) {
    var _options = state._options,
        _svg = state._svg,
        _color = state._color,
        _data = state._data;


    var _tree = _options.plots.mode === 'tree' ? tree$1().size([_options.chart.innerHeight, _options.chart.innerWidth]) : cluster().size([_options.chart.innerHeight, _options.chart.innerWidth]);

    var minValues = [];
    var maxValues = [];
    var nodeScale = sqrt();
    var nodeRadius = function nodeRadius(node) {
      //Set max for root node.
      if (node.depth === 0) {
        return nodeScale.range()[1];
      }

      // only one node in this depth
      if (minValues[node.depth] === maxValues[node.depth]) {
        return nodeScale.range()[1];
      }

      nodeScale.domain([minValues[node.depth], maxValues[node.depth]]);
      return nodeScale(node.value);
    };

    var root = hierarchy(_data).sum(function (d) {
      return d.size;
    }).sort(function (a, b) {
      return a.height - b.height || a.data.name.localeCompare(b.data.name);
    });

    var maxDepth = root.height;

    _tree(root);

    //We dynamically size based on how many first level nodes we have
    var scale = _options.plots.branchPadding === -1 ? Math.min(_options.chart.innerHeight, _options.chart.innerWidth) / root.descendants().length : Math.min(_options.chart.innerHeight, _options.chart.innerWidth) * _options.plots.branchPadding;

    nodeScale.range([1.5, scale / 2]);

    _tree.nodeSize([scale, 0]);
    var depthSpan = _options.plots.fixedSpan > 0 ? _options.plots.fixedSpan : _options.width / (maxDepth + 1);

    //Set max/min values

    var _loop = function _loop(i) {
      var vals = root.descendants().filter(function (d) {
        return d.depth === i;
      });
      maxValues[i] = max(vals, function (d) {
        return d.value;
      });
      minValues[i] = min(vals, function (d) {
        return d.value;
      });
    };

    for (var i = 1; i < maxDepth + 1; i++) {
      _loop(i);
    }

    var link = _svg.selectAll('.link').data(root.descendants().slice(1)).enter().append('path').attr('class', 'link').attr('d', diagonalHorizontal).style('fill', 'none').style('stroke-linecap', 'round').style('stroke-width', function (d) {
      return nodeRadius(d) * 2;
    }).style('stroke', function (d) {
      return _color(d.data.name);
    }).style('stroke-opacity', _options.plots.linkOpacity);

    var node = _svg.selectAll('.node').data(root.descendants()).enter().append('g').attr('class', function (d) {
      return 'node' + (d.children ? ' node--internal' : ' node--leaf');
    }).attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

    node.append('circle').attr('r', nodeRadius).style('stroke', function (d) {
      return _color(d.data.name);
    }).style('stroke-opacity', _options.plots.nodeStrokeOpacity).style('fill', function (d) {
      return _color(d.data.name);
    }).style('fill-opacity', _options.plots.nodeOpacity);

    node.append('text').attr('dy', 4).attr('x', function (d) {
      return d.children ? -_options.plots.textOffset : _options.plots.textOffset;
    }).style('text-anchor', function (d) {
      return d.children ? 'end' : 'start';
    }).text(function (d) {
      return d.data.name;
    });

    state.node = node;
    state.link = link;
    state.root = root;
  };

  var apiRender$3 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);
        draw(state);
      }
    };
  };

  var apiMode = function apiMode(state) {
    return {
      mode: function mode(_mode) {
        var _options = state._options,
            node = state.node,
            link = state.link,
            root = state.root,
            _containerId = state._containerId;

        _options.mode = _mode;

        var _tree = _options.mode === 'tree' ? tree().size([_options.chart.innerHeight, _options.chart.innerWidth]) : cluster().size([_options.chart.innerHeight, _options.chart.innerWidth]);

        _tree(root);

        var t = transition().duration(750);
        t.selectAll(_containerId + ' .node').attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')';
        });
        t.selectAll(_containerId + ' .link').attr('d', diagonalHorizontal);
      }
    };
  };

  var apiSort = function apiSort(state) {
    return {
      sort: function sort(field, direction) {
        state._options.ordering = {
          name: field,
          direction: direction
        };

        state.update();
      }
    };
  };

  var apiUpdate$1 = function apiUpdate(state) {
    return {
      update: function update() {
        draw(state);
      }
    };
  };

  var apiColor$2 = function apiColor(state) {
    return {
      color: function color(colorOptions) {
        if (!colorOptions) {
          console.warn('color opt is null, either scheme or type is required');
          return;
        } else if (!colorOptions.type && !colorOptions.scheme) {
          console.warn('invalid color opt, either scheme or type is required');
          return;
        }

        if (colorOptions.type) {
          state._options.color.type = colorOptions.type;
        }

        if (colorOptions.scheme) {
          state._options.color.scheme = colorOptions.scheme;
        }

        state._color = state._composers.color(state._options.color);

        var _options = state._options,
            _svg = state._svg,
            _color = state._color,
            _containerId = state._containerId;


        transition().selectAll(_containerId + ' .node circle').duration(duration.general).style('stroke', function (d) {
          return _color(d.data.name);
        }).style('stroke-opacity', _options.plots.nodeStrokeOpacity).style('fill', function (d) {
          return _color(d.data.name);
        }).style('fill-opacity', _options.plots.nodeOpacity);

        _svg.selectAll('.link path').style('stroke', function (d) {
          return _color(d.data.name);
        }).style('stroke-opacity', _options.plots.linkOpacity);
      }
    };
  };

  var DefaultOptions = {
    chart: {
      type: 'weighted-tree'
    },
    color: DefaultCategoricalColor,
    plots: {
      mode: 'tree',
      branchPadding: -1,
      fixedSpan: -1,
      nodeOpacity: 0.4,
      nodeStrokeOpacity: 0.6,
      linkOpacity: 0.35,
      textOffset: 12
    }
  };

  var index$2 = factory(svgLayer, { opt: DefaultOptions }, [apiRender$3, apiUpdate$1, apiColor$2, apiMode, apiSort]);

  var pi$1 = Math.PI,
      tau$1 = 2 * pi$1,
      epsilon$1 = 1e-6,
      tauEpsilon = tau$1 - epsilon$1;

  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  }

  function path() {
    return new Path();
  }

  Path.prototype = path.prototype = {
    constructor: Path,
    moveTo: function moveTo(x, y) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    },
    closePath: function closePath() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      }
    },
    lineTo: function lineTo(x, y) {
      this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
      this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
      this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    arcTo: function arcTo(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon$1)) ;

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
            this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
          }

          // Otherwise, draw an arc!
          else {
              var x20 = x2 - x0,
                  y20 = y2 - y0,
                  l21_2 = x21 * x21 + y21 * y21,
                  l20_2 = x20 * x20 + y20 * y20,
                  l21 = Math.sqrt(l21_2),
                  l01 = Math.sqrt(l01_2),
                  l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                  t01 = l / l01,
                  t21 = l / l21;

              // If the start tangent is not coincident with (x0,y0), line to.
              if (Math.abs(t01 - 1) > epsilon$1) {
                this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
              }

              this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
            }
    },
    arc: function arc(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._ += "M" + x0 + "," + y0;
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
          this._ += "L" + x0 + "," + y0;
        }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Does the angle go the wrong way? Flip the direction.
      if (da < 0) da = da % tau$1 + tau$1;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
      }

      // Is this arc non-empty? Draw an arc!
      else if (da > epsilon$1) {
          this._ += "A" + r + "," + r + ",0," + +(da >= pi$1) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
    },
    rect: function rect(x, y, w, h) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
    },
    toString: function toString() {
      return this._;
    }
  };

  function constant$7 (x) {
    return function constant() {
      return x;
    };
  }

  var abs = Math.abs;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var max$1 = Math.max;
  var min$1 = Math.min;
  var sin = Math.sin;
  var sqrt$1 = Math.sqrt;

  var epsilon$2 = 1e-12;
  var pi$2 = Math.PI;
  var halfPi$1 = pi$2 / 2;
  var tau$2 = 2 * pi$2;

  function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi$2 : Math.acos(x);
  }

  function asin(x) {
    return x >= 1 ? halfPi$1 : x <= -1 ? -halfPi$1 : Math.asin(x);
  }

  function arcInnerRadius(d) {
    return d.innerRadius;
  }

  function arcOuterRadius(d) {
    return d.outerRadius;
  }

  function arcStartAngle(d) {
    return d.startAngle;
  }

  function arcEndAngle(d) {
    return d.endAngle;
  }

  function arcPadAngle(d) {
    return d && d.padAngle; // Note: optional!
  }

  function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
    var x10 = x1 - x0,
        y10 = y1 - y0,
        x32 = x3 - x2,
        y32 = y3 - y2,
        t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
    return [x0 + t * x10, y0 + t * y10];
  }

  // Compute perpendicular offset line of length rc.
  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
    var x01 = x0 - x1,
        y01 = y0 - y1,
        lo = (cw ? rc : -rc) / sqrt$1(x01 * x01 + y01 * y01),
        ox = lo * y01,
        oy = -lo * x01,
        x11 = x0 + ox,
        y11 = y0 + oy,
        x10 = x1 + ox,
        y10 = y1 + oy,
        x00 = (x11 + x10) / 2,
        y00 = (y11 + y10) / 2,
        dx = x10 - x11,
        dy = y10 - y11,
        d2 = dx * dx + dy * dy,
        r = r1 - rc,
        D = x11 * y10 - x10 * y11,
        d = (dy < 0 ? -1 : 1) * sqrt$1(max$1(0, r * r * d2 - D * D)),
        cx0 = (D * dy - dx * d) / d2,
        cy0 = (-D * dx - dy * d) / d2,
        cx1 = (D * dy + dx * d) / d2,
        cy1 = (-D * dx + dy * d) / d2,
        dx0 = cx0 - x00,
        dy0 = cy0 - y00,
        dx1 = cx1 - x00,
        dy1 = cy1 - y00;

    // Pick the closer of the two intersection points.
    // TODO Is there a faster way to determine which intersection to use?
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

    return {
      cx: cx0,
      cy: cy0,
      x01: -ox,
      y01: -oy,
      x11: cx0 * (r1 / r - 1),
      y11: cy0 * (r1 / r - 1)
    };
  }

  function arc () {
    var innerRadius = arcInnerRadius,
        outerRadius = arcOuterRadius,
        cornerRadius = constant$7(0),
        padRadius = null,
        startAngle = arcStartAngle,
        endAngle = arcEndAngle,
        padAngle = arcPadAngle,
        context = null;

    function arc() {
      var buffer,
          r,
          r0 = +innerRadius.apply(this, arguments),
          r1 = +outerRadius.apply(this, arguments),
          a0 = startAngle.apply(this, arguments) - halfPi$1,
          a1 = endAngle.apply(this, arguments) - halfPi$1,
          da = abs(a1 - a0),
          cw = a1 > a0;

      if (!context) context = buffer = path();

      // Ensure that the outer radius is always larger than the inner radius.
      if (r1 < r0) r = r1, r1 = r0, r0 = r;

      // Is it a point?
      if (!(r1 > epsilon$2)) context.moveTo(0, 0);

      // Or is it a circle or annulus?
      else if (da > tau$2 - epsilon$2) {
          context.moveTo(r1 * cos(a0), r1 * sin(a0));
          context.arc(0, 0, r1, a0, a1, !cw);
          if (r0 > epsilon$2) {
            context.moveTo(r0 * cos(a1), r0 * sin(a1));
            context.arc(0, 0, r0, a1, a0, cw);
          }
        }

        // Or is it a circular or annular sector?
        else {
            var a01 = a0,
                a11 = a1,
                a00 = a0,
                a10 = a1,
                da0 = da,
                da1 = da,
                ap = padAngle.apply(this, arguments) / 2,
                rp = ap > epsilon$2 && (padRadius ? +padRadius.apply(this, arguments) : sqrt$1(r0 * r0 + r1 * r1)),
                rc = min$1(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
                rc0 = rc,
                rc1 = rc,
                t0,
                t1;

            // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
            if (rp > epsilon$2) {
              var p0 = asin(rp / r0 * sin(ap)),
                  p1 = asin(rp / r1 * sin(ap));
              if ((da0 -= p0 * 2) > epsilon$2) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
              if ((da1 -= p1 * 2) > epsilon$2) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
            }

            var x01 = r1 * cos(a01),
                y01 = r1 * sin(a01),
                x10 = r0 * cos(a10),
                y10 = r0 * sin(a10);

            // Apply rounded corners?
            if (rc > epsilon$2) {
              var x11 = r1 * cos(a11),
                  y11 = r1 * sin(a11),
                  x00 = r0 * cos(a00),
                  y00 = r0 * sin(a00);

              // Restrict the corner radius according to the sector angle.
              if (da < pi$2) {
                var oc = da0 > epsilon$2 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                    ax = x01 - oc[0],
                    ay = y01 - oc[1],
                    bx = x11 - oc[0],
                    by = y11 - oc[1],
                    kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt$1(ax * ax + ay * ay) * sqrt$1(bx * bx + by * by))) / 2),
                    lc = sqrt$1(oc[0] * oc[0] + oc[1] * oc[1]);
                rc0 = min$1(rc, (r0 - lc) / (kc - 1));
                rc1 = min$1(rc, (r1 - lc) / (kc + 1));
              }
            }

            // Is the sector collapsed to a line?
            if (!(da1 > epsilon$2)) context.moveTo(x01, y01);

            // Does the sector’s outer ring have rounded corners?
            else if (rc1 > epsilon$2) {
                t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
                t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

                context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

                // Have the corners merged?
                if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

                // Otherwise, draw the two corners and the ring.
                else {
                    context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                    context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                    context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                  }
              }

              // Or is the outer ring just a circular arc?
              else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

            // Is there no inner ring, and it’s a circular sector?
            // Or perhaps it’s an annular sector collapsed due to padding?
            if (!(r0 > epsilon$2) || !(da0 > epsilon$2)) context.lineTo(x10, y10);

            // Does the sector’s inner ring (or point) have rounded corners?
            else if (rc0 > epsilon$2) {
                t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
                t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

                context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

                // Have the corners merged?
                if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

                // Otherwise, draw the two corners and the ring.
                else {
                    context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
                    context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                    context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
                  }
              }

              // Or is the inner ring just a circular arc?
              else context.arc(0, 0, r0, a10, a00, cw);
          }

      context.closePath();

      if (buffer) return context = null, buffer + "" || null;
    }

    arc.centroid = function () {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
          a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$2 / 2;
      return [cos(a) * r, sin(a) * r];
    };

    arc.innerRadius = function (_) {
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$7(+_), arc) : innerRadius;
    };

    arc.outerRadius = function (_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$7(+_), arc) : outerRadius;
    };

    arc.cornerRadius = function (_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$7(+_), arc) : cornerRadius;
    };

    arc.padRadius = function (_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$7(+_), arc) : padRadius;
    };

    arc.startAngle = function (_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$7(+_), arc) : startAngle;
    };

    arc.endAngle = function (_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$7(+_), arc) : endAngle;
    };

    arc.padAngle = function (_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$7(+_), arc) : padAngle;
    };

    arc.context = function (_) {
      return arguments.length ? (context = _ == null ? null : _, arc) : context;
    };

    return arc;
  }

  function sign(x) {
    return x < 0 ? -1 : 1;
  }

  // Calculate the slopes of the tangents (Hermite-type interpolation) based on
  // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
  // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
  // NOV(II), P. 443, 1990.
  function slope3(that, x2, y2) {
    var h0 = that._x1 - that._x0,
        h1 = x2 - that._x1,
        s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
        s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
        p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }

  // Calculate a one-sided slope.
  function slope2(that, t) {
    var h = that._x1 - that._x0;
    return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
  }

  // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
  // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
  // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
  function _point$3(that, t0, t1) {
    var x0 = that._x0,
        y0 = that._y0,
        x1 = that._x1,
        y1 = that._y1,
        dx = (x1 - x0) / 3;
    that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
  }

  function MonotoneX(context) {
    this._context = context;
  }

  MonotoneX.prototype = {
    areaStart: function areaStart() {
      this._line = 0;
    },
    areaEnd: function areaEnd() {
      this._line = NaN;
    },
    lineStart: function lineStart() {
      this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
      this._point = 0;
    },
    lineEnd: function lineEnd() {
      switch (this._point) {
        case 2:
          this._context.lineTo(this._x1, this._y1);break;
        case 3:
          _point$3(this, this._t0, slope2(this, this._t0));break;
      }
      if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
      this._line = 1 - this._line;
    },
    point: function point(x, y) {
      var t1 = NaN;

      x = +x, y = +y;
      if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
      switch (this._point) {
        case 0:
          this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
        case 1:
          this._point = 2;break;
        case 2:
          this._point = 3;_point$3(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
        default:
          _point$3(this, this._t0, t1 = slope3(this, x, y));break;
      }

      this._x0 = this._x1, this._x1 = x;
      this._y0 = this._y1, this._y1 = y;
      this._t0 = t1;
    }
  };

  function MonotoneY(context) {
    this._context = new ReflectContext(context);
  }

  (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
    MonotoneX.prototype.point.call(this, y, x);
  };

  function ReflectContext(context) {
    this._context = context;
  }

  ReflectContext.prototype = {
    moveTo: function moveTo(x, y) {
      this._context.moveTo(y, x);
    },
    closePath: function closePath() {
      this._context.closePath();
    },
    lineTo: function lineTo(x, y) {
      this._context.lineTo(y, x);
    },
    bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
      this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
    }
  };

  var apiRender$4 = function apiRender$$1(state) {
      return {
          render: function render(data) {
              apiRender(state).render(data);

              var _options = state._options,
                  _svg = state._svg,
                  _data = state._data,
                  _color = state._color,
                  _containerId = state._containerId;

              // _color.domain( _data.map(d => d.name) );

              var radius = Math.min(_options.chart.innerWidth, _options.chart.innerHeight) / 2;

              _svg.attr('transform', 'translate(' + _options.chart.width / 2 + ',' + _options.chart.height / 2 + ')');

              // D3 Global Variables
              var root = hierarchy(_data).sum(function (d) {
                  return d.size;
              });
              var node = root;
              var x = linear$1().range([0, 2 * Math.PI]);
              var y = sqrt().range([0, radius]);
              // Calculate the d path for each slice.

              var _partition = partition();
              var _arc = arc().startAngle(function (d) {
                  return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
              }).endAngle(function (d) {
                  return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
              }).innerRadius(function (d) {
                  return Math.max(0, y(d.y0));
              }).outerRadius(function (d) {
                  return Math.max(0, y(d.y1));
              });

              // When switching data: interpolate the arcs in data space.
              var arcTweenData = function arcTweenData(a, i) {
                  // (a.x0s ? a.x0s : 0) -- grab the prev saved x0 or set to 0 (for 1st time through)
                  // avoids the stash() and allows the sunburst to grow into being
                  var oi = object({ x0: a.x0s ? a.x0s : 0, x1: a.x1s ? a.x1s : 0 }, a);
                  function tween(t) {
                      var b = oi(t);
                      a.x0s = b.x0;
                      a.x1s = b.x1;
                      return _arc(b);
                  }
                  if (i === 0) {
                      // If we are on the first arc, adjust the x domain to match the root node
                      // at the current zoom level. (We only need to do this once.)
                      var xd = array$2(x.domain(), [node.x0, node.x1]);
                      return function (t) {
                          x.domain(xd(t));
                          return tween(t);
                      };
                  } else {
                      return tween;
                  }
              };

              // When zooming: interpolate the scales.
              function arcTweenZoom(d) {
                  var xd = array$2(x.domain(), [d.x0, d.x1]);
                  var yd = array$2(y.domain(), [d.y0, 1]); // [d.y0, 1]
                  var yr = array$2(y.range(), [d.y0 ? 40 : 0, radius]);

                  return function (d, i) {
                      return i ? function (t) {
                          return _arc(d);
                      } : function (t) {
                          x.domain(xd(t));
                          y.domain(yd(t)).range(yr(t));
                          return _arc(d);
                      };
                  };
              }

              // Respond to slice click.
              function click(d) {
                  //Hide text while Sunburst transitions
                  transition().selectAll(_containerId + ' .node text').attr('opacity', 0);
                  node = d;
                  var updateTrans = transition().duration(1000).selectAll(_containerId + ' .node path').attrTween('d', arcTweenZoom(d));

                  if (_options.plots.drawLabels === true) {
                      updateTrans.on('end', function (e, i) {
                          // check if the animated element's data e lies within the visible angle span given in d
                          if (e.x0 > d.x0 && e.x0 < d.x1) {
                              // get a selection of the associated text element
                              var arcText = select(this.parentNode).select('text');
                              // fade in the text element and recalculate positions
                              arcText.transition().duration(750).attr('opacity', 1).attr('class', 'visible').attr('transform', function () {
                                  return 'rotate(' + computeTextRotation(e) + ')';
                              }).attr('x', function (d) {
                                  return y(d.y0);
                              }).text(function (d) {
                                  return d.data.name === 'root' ? '' : d.data.name;
                              });
                          }
                      });
                  }
              }

              function computeTextRotation(d) {
                  return (x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI * 180;
              }

              // Build the sunburst.
              var first_build = true;
              function _update() {
                  // todo: Determine how to size the slices.

                  if (first_build) {
                      // Add a <path d="[shape]" style="fill: [color];"><title>[popup text]</title></path>
                      //   to each <g> element; add click handler; save slice widths for tweening
                      _svg.selectAll('.node').data(_partition(root).descendants()).enter().append('g').attr('class', 'node');
                      _svg.selectAll('.node').append('path').style('fill', function (d) {
                          return d.parent ? _color(d.data.name) : 'white';
                      }) // Return white for root.
                      .on('click', click);

                      _svg.selectAll('.node').append('title').text(function (d) {
                          return d.data.name;
                      });

                      first_build = false;
                  } else {
                      _svg.selectAll('.node path').data(_partition(root).descendants());
                  }

                  var tweenTrans = transition().duration(1000).selectAll(_containerId + ' .node path').attrTween('d', arcTweenData);

                  if (_options.plots.drawLabels === true) {
                      tweenTrans.on('end', function (d, i) {
                          select(this.parentNode).append('text').attr('transform', function (d) {
                              return 'rotate(' + computeTextRotation(d) + ')';
                          }).attr('x', function (d) {
                              return y(d.y0);
                          }).attr('dx', '6') // margin
                          .attr('dy', '.35em') // vertical-align
                          .text(function (d) {
                              return d.data.name === 'root' ? '' : d.data.name;
                          });
                      });
                  }
              }

              _update(); // GO!
          }
      };
  };

  var apiColor$3 = function apiColor(state) {
    return {
      color: function color(colorOptions) {
        if (!colorOptions) {
          console.warn('color opt is null, either scheme or type is required');
          return;
        } else if (!colorOptions.type && !colorOptions.scheme) {
          console.warn('invalid color opt, either scheme or type is required');
          return;
        }

        if (colorOptions.type) {
          state._options.color.type = colorOptions.type;
        }

        if (colorOptions.scheme) {
          state._options.color.scheme = colorOptions.scheme;
        }

        var _containerId = state._containerId;

        state._color = state.composers.color(state._options.color);

        transition().selectAll(_containerId + ' .node path').duration(1250).attr('fill', function (d) {
          return state._color(d.data.name);
        });
      }
    };
  };

  var DefaultOptions$1 = {
    chart: {
      type: 'sunburst'
    },
    color: DefaultCategoricalColor,
    plots: {
      drawLabels: true
    }
  };

  var index$3 = factory(svgLayer, { opt: DefaultOptions$1 }, [apiRender$4, apiColor$3]);

  var checkParent = function checkParent(node, focus) {
    if (node.parent === undefined || node.parent === null) {
      return false;
    } else {
      if (node.parent === focus) {
        return true;
      } else {
        return checkParent(node.parent);
      }
    }
  };

  var sameBranch = function sameBranch(node, focus) {
    // no check on root node
    if (focus.parent === null) {
      return true;
    }

    // same node
    if (node === focus) {
      return true;
    }

    // same parent
    if (node.parent === focus.parent) {
      return true;
    }

    // descendant of focus
    return checkParent(node, focus);
  };

  //From http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
  var getLines = function getLines(ctx, text, maxWidth, fontSize, titleFont) {
    var words = text.split(' ');
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      ctx.font = fontSize + 'px ' + titleFont;
      var width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }; //function getLines

  //Adjusted from: http://blog.graphicsgen.com/2015/03/html5-canvas-rounded-text.html
  var drawCircularText$1 = function drawCircularText(ctx, text, fontSize, titleFont, centerX, centerY, radius, startAngle, kerning, textAlpha) {
    // startAngle:   In degrees, Where the text will be shown. 0 degrees if the top of the circle
    // kearning:     0 for normal gap between letters. Positive or negative number to expand/compact gap in pixels

    //Setup letters and positioning
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center'; // Ensure we draw in exact center
    ctx.font = fontSize + 'px ' + titleFont;
    ctx.fillStyle = 'rgba(255,255,255,' + textAlpha + ')';

    startAngle = startAngle * (Math.PI / 180); // convert to radians
    text = text.split('').reverse().join(''); // Reverse letters

    //Rotate 50% of total angle for center alignment
    for (var j = 0; j < text.length; j++) {
      var charWid = ctx.measureText(text[j]).width;
      startAngle += (charWid + (j === text.length - 1 ? 0 : kerning)) / radius / 2;
    } //for j

    ctx.save(); //Save the default state before doing any transformations
    ctx.translate(centerX, centerY); // Move to center
    ctx.rotate(startAngle); //Rotate into final start position

    //Now for the fun bit: draw, rotate, and repeat
    for (var _j = 0; _j < text.length; _j++) {
      var _charWid = ctx.measureText(text[_j]).width / 2; // half letter
      //Rotate half letter
      ctx.rotate(-_charWid / radius);
      //Draw the character at "top" or "bottom" depending on inward or outward facing
      ctx.fillText(text[_j], 0, -radius);
      //Rotate half letter
      ctx.rotate(-(_charWid + kerning) / radius);
    } //for j

    ctx.restore(); //Restore to state as it was before transformations
  }; //function drawCircularText

  var nextCol = 1;

  //Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
  //From: https://bocoup.com/weblog/2d-picking-in-canvas
  var genColor = function genColor() {
    var ret = [];
    // via http://stackoverflow.com/a/15804183
    if (nextCol < 16777215) {
      ret.push(nextCol & 0xff); // R
      ret.push((nextCol & 0xff00) >> 8); // G
      ret.push((nextCol & 0xff0000) >> 16); // B

      nextCol += 100; // This is exagerated for this example and would ordinarily be 1.
    }
    return 'rgb(' + ret.join(',') + ')';
  }; //function genColor

  var commaFormat = format(',');

  var drawBars = function drawBars(state, chosenContext, node, nodeX, nodeY, nodeR) {
    var _options = state._options,
        elementsPerBar = state.elementsPerBar,
        _color = state._color,
        showText = state.showText,
        textAlpha = state.textAlpha;


    var barDimVal = function barDimVal(d) {
      return d[_options.data.x.accessor];
    };
    var barMetVal = function barMetVal(d) {
      return d[_options.data.y.accessor];
    };

    //The barscale differs per node
    var barScale = linear$1().domain([0, max(node.data._data, barMetVal)]) //max value of bar charts in circle
    .range([0, nodeR]);

    //Variables for the bar chart
    var bars = node.data._data;
    var eachBarHeight = (1 - _options.plots.barChartHeightOffset) * 2 * nodeR * _options.plots.barChartHeight / elementsPerBar;
    var barHeight = eachBarHeight * 0.8;

    //Variables for the labels on the bars: Age

    var fontSizeLabels = Math.round(nodeR / 18);
    var drawLabelText = fontSizeLabels >= 6;

    //Variables for the value labels on the end of each bar
    var fontSizeValues = Math.round(nodeR / 22);
    var drawValueText = fontSizeValues >= 6;

    //Only draw the bars and all labels of each bar has a height of at least 1 pixel
    if (Math.round(barHeight) > 1) {
      //Loop over each bar
      for (var j = 0; j < bars.length; j++) {
        var bar = bars[j];

        bar.width = isNaN(barMetVal(bar)) ? 0 : barScale(barMetVal(bar));
        bar.barPiecePosition = nodeY + _options.plots.barChartHeightOffset * 2 * nodeR + j * eachBarHeight - _options.plots.barChartHeight * nodeR;

        //Draw the bar
        chosenContext.beginPath();
        chosenContext.fillStyle = _color(barDimVal(bar));
        chosenContext.fillRect(nodeX + -nodeR * 0.3, bar.barPiecePosition, bar.width, barHeight);
        chosenContext.fill();

        //Only draw the age labels if the font size is big enough
        if (drawLabelText && showText) {
          chosenContext.font = fontSizeLabels + 'px ' + _options.bodyFont;
          chosenContext.fillStyle = 'rgba(' + _options.plots.mainTextColor[0] + ',' + _options.plots.mainTextColor[1] + ',' + _options.plots.mainTextColor[2] + ',' + textAlpha + ')';
          chosenContext.textAlign = 'right';
          chosenContext.textBaseline = 'middle';
          chosenContext.fillText(barDimVal(bar), nodeX + -nodeR * 0.35, bar.barPiecePosition + 0.5 * barHeight);
        } //if

        //Only draw the value labels if the font size is big enough
        if (drawValueText && showText) {
          chosenContext.font = fontSizeValues + 'px ' + _options.bodyFont;
          var txt = commaFormat(barMetVal(bar));
          //Check to see if the bar is big enough to place the text inside it
          //If not, place the text outside the bar
          var textWidth = chosenContext.measureText(txt).width;
          var valuePos = textWidth * 1.1 > bar.width - nodeR * 0.03 ? 'left' : 'right';

          //Calculate the x position of the bar value label
          bar.valueLoc = nodeX + -nodeR * 0.3 + bar.width + (valuePos === 'left' ? nodeR * 0.03 : -nodeR * 0.03);

          //Draw the text
          chosenContext.fillStyle = valuePos === 'left' ? 'rgba(51,51,51,' + textAlpha + ')' : 'rgba(255,255,255,' + textAlpha + ')'; //#333333 or white
          chosenContext.textAlign = valuePos;
          chosenContext.textBaseline = 'middle';
          chosenContext.fillText(txt, bar.valueLoc, bar.barPiecePosition + 0.5 * barHeight);
        } //if
      } //for j
    } //if -> Math.round(barHeight) > 1
  };

  //The draw function of the canvas that gets called on each frame

  var commaFormat$1 = format(',');

  //The start angle in degrees for each of the non-node leaf titles
  var rotationText = [-14, 4, 23, -18, -10.5, -20, 20, 20, 46, -30, -25, -20, 20, 15, -30, -15, -45, 12, -15, -16, 15, 15, 5, 18, 5, 15, 20, -20, -25]; //The rotation of each arc text

  var drawCanvas = function drawCanvas(state, chosenContext) {
    var hidden = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var _hierarchy = state._hierarchy,
        _options = state._options,
        nodes = state.nodes,
        nodeCount = state.nodeCount,
        colToCircle = state.colToCircle,
        colorCircle = state.colorCircle,
        focus = state.focus,
        zoomInfo = state.zoomInfo,
        centerX = state.centerX,
        centerY = state.centerY,
        showText = state.showText,
        textAlpha = state.textAlpha,
        kids = state.kids,
        rootName = state.rootName;

    var _treeDepth = range(0, _hierarchy.height - 1, 1);
    //Clear canvas
    chosenContext.fillStyle = '#fff';
    chosenContext.rect(0, 0, _options.chart.innerWidth, _options.chart.innerHeight);
    chosenContext.fill();

    //Select our dummy nodes and draw the data to canvas.
    var node = null;
    // It's slightly faster than nodes.forEach()

    var _loop = function _loop(i) {
      node = nodes[i];

      //If the hidden canvas was send into this function and it does not yet have a color, generate a unique one
      if (hidden) {
        if (node.color == null) {
          // If we have never drawn the node to the hidden canvas get a new color for it and put it in the dictionary.
          node.color = genColor();
          colToCircle[node.color] = node;
        } //if
        // On the hidden canvas each rectangle gets a unique color.
        chosenContext.fillStyle = node.color;
      } else {
        chosenContext.fillStyle = node.children ? colorCircle(node.depth) : 'white';
      } //else

      var nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX,
          nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY,
          nodeR = node.r * zoomInfo.scale;

      //Use one node to reset the scale factor for the legend
      if (i === _treeDepth) state.scaleFactor = node.value / (nodeR * nodeR);

      //Draw each circle
      chosenContext.beginPath();
      chosenContext.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
      chosenContext.fill();

      //Draw the bars inside the circles (only in the visible canvas)
      //Only draw bars in leaf nodes
      if (node.data.hasOwnProperty('_data')) {
        //Only draw the bars that are in the same parent ID as the clicked on node
        if (sameBranch(node, focus) && !hidden) {
          var _fontSizeTitle = Math.round(nodeR / 10);

          //Variables for the bar title
          var drawTitle = _fontSizeTitle >= 8;

          //Only draw the title if the font size is big enough
          if (drawTitle && showText) {
            //First the light grey total text
            chosenContext.font = (_fontSizeTitle * 0.5 <= 5 ? 0 : Math.round(_fontSizeTitle * 0.5)) + 'px ' + _options.bodyFont;
            chosenContext.fillStyle = 'rgba(191,191,191,' + textAlpha + ')'; //"#BFBFBF";
            chosenContext.textAlign = 'center';
            chosenContext.textBaseline = 'middle';
            chosenContext.fillText(_options.plots.titleFn(commaFormat$1(node.data.size)), nodeX, nodeY + -0.75 * nodeR);

            //Get the text back in pieces that will fit inside the node
            var titleText = getLines(chosenContext, node.data.name, nodeR * 2 * 0.7, _fontSizeTitle, _options.titleFont);
            //Loop over all the pieces and draw each line
            titleText.forEach(function (txt, iterator) {
              chosenContext.font = _fontSizeTitle + 'px ' + _options.titleFont;
              chosenContext.fillStyle = 'rgba(' + _options.plots.mainTextColor[0] + ',' + _options.plots.mainTextColor[1] + ',' + _options.plots.mainTextColor[2] + ',' + textAlpha + ')';
              chosenContext.textAlign = 'center';
              chosenContext.textBaseline = 'middle';
              chosenContext.fillText(txt, nodeX, nodeY + (-0.65 + iterator * 0.125) * nodeR);
            }); //forEach
          }

          drawBars(state, chosenContext, node, nodeX, nodeY, nodeR);
        }
      }
    };

    for (var i = 0; i < nodeCount; i++) {
      _loop(i);
    } //for i

    var counter = 0; //Needed for the rotation of the arc titles

    //Do a second loop because the arc titles always have to be drawn on top
    for (var i = 0; i < nodeCount; i++) {
      node = nodes[i];

      var _nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX,
          _nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY,
          _nodeR = node.r * zoomInfo.scale;

      //Don't draw for leaf-nodes
      //And don't draw the arced label for the largest outer circle
      //And don't draw these things for the hidden layer
      //And only draw these while showText = true (so not during a zoom)
      //And hide those not close the the parent
      if (node.parent !== undefined && node.children !== undefined) {
        if (node.data.name !== rootName && !hidden && showText && kids.includes(node.data.name)) {
          //Calculate the best font size for the non-leaf nodes
          var fontSizeTitle = Math.round(_nodeR / 10);
          if (fontSizeTitle > 4) drawCircularText$1(chosenContext, node.data.name.replace(/,? and /g, ' & '), fontSizeTitle, _options.titleFont, _nodeX, _nodeY, _nodeR, rotationText[counter], 0, textAlpha);
        } //if
        counter = counter + 1;
      } //if
    } //for i
  }; //function _drawCanvas

  var commaFormat$2 = format(',');

  //Perform the interpolation and continuously change the zoomInfo while the "transition" occurs
  var interpolateZoom$1 = function interpolateZoom(state, dt) {
    var interpolator = state.interpolator,
        _cubicEase = state._cubicEase,
        duration = state.duration,
        zoomInfo = state.zoomInfo,
        diameter = state.diameter,
        _hiddenContext = state._hiddenContext,
        scaleFactor = state.scaleFactor;

    if (interpolator) {
      state.timeElapsed += dt;
      var t = _cubicEase(state.timeElapsed / duration); //mini this.interpolator that puts 0 - duration into 0 - 1 in a cubic-in-out fashion

      //Set the new zoom variables
      zoomInfo.centerX = interpolator(t)[0];
      zoomInfo.centerY = interpolator(t)[1];
      zoomInfo.scale = diameter / interpolator(t)[2];

      //After iteration is done remove the interpolater and set the fade text back into motion
      if (state.timeElapsed >= duration) {
        state.interpolator = null;
        state.showText = true;
        state.fadeText = true;
        state.timeElapsed = 0;

        //Draw the hidden canvas again, now that everything is settled in
        //to make sure it is in the same state as the visible canvas
        //This way the tooltip and click work correctly
        drawCanvas(state, _hiddenContext, true);

        //Update the texts in the legend
        select('.legendWrapper').selectAll('.legendText').text(function (d) {
          return commaFormat$2(Math.round(scaleFactor * d * d / 10) * 10);
        });
      } //if -> timeElapsed >= duration
    } //if -> this.interpolator
  }; //function _zoomToCanvas

  //Function that fades in the text - Otherwise the text will be jittery during the zooming
  var interpolateFadeText = function interpolateFadeText(state, dt) {
    var fadeText = state.fadeText,
        fadeTextDuration = state.fadeTextDuration,
        _cubicEase = state._cubicEase,
        _frontCanvasId = state._frontCanvasId;


    if (fadeText) {
      state.timeElapsed += dt;
      state.textAlpha = _cubicEase(state.timeElapsed / fadeTextDuration);
      if (state.timeElapsed >= fadeTextDuration) {
        //Enable click & mouseover events again
        select('#' + _frontCanvasId).style('pointer-events', 'auto');

        state.fadeText = false; //Jump from loop after fade in is done
        state.stopTimer = true; //After the fade is done, stop with the redraws / animation
      } //if
    } //if
  }; //function _interpolateFadeText

  var animate = function animate(state) {
    var _frontContext = state._frontContext;
    //This function runs during changes in the visual - during a zoom

    var dt = 0;

    var _timer = timer(function (elapsed) {
      interpolateZoom$1(state, elapsed - dt);
      interpolateFadeText(state, elapsed - dt);
      dt = elapsed;

      drawCanvas(state, _frontContext, false);

      if (state.stopTimer === true) {
        _timer.stop();
      }
    });
  };

  //Create the interpolation function between current view and the clicked on node

  var zoomToCanvas = function zoomToCanvas(state, focusNode) {
    var _frontCanvasId = state._frontCanvasId,
        vOld = state.vOld;
    //Temporarily disable click & mouseover events

    select('#' + _frontCanvasId).style('pointer-events', 'none');

    //Remove all previous popovers - if present
    select('.popoverWrapper').remove();
    selectAll$1('.popover').remove();

    //Set the new focus
    state.focus = focusNode;
    var focus = state.focus;

    var v = [focus.x, focus.y, focus.r * 2.05]; //The center and width of the new "viewport"

    //Create interpolation between current and new "viewport"
    state.interpolator = interpolateZoom(vOld, v);

    //Set the needed "zoom" variables
    state.duration = Math.max(1500, state.interpolator.duration); //Interpolation gives back a suggested duration
    state.timeElapsed = 0; //Set the time elapsed for the interpolateZoom function to 0
    state.showText = false; //Don't show text during the zoom
    state.vOld = v; //Save the "viewport" of the next state as the next "old" state

    //Only show the circle legend when not at a leaf node
    if (focusNode.data.hasOwnProperty('_data')) {
      select('#legendRowWrapper').style('opacity', 0);
      transition().select('.legendWrapper').duration(1000).style('opacity', 0);
    } else {
      select('#legendRowWrapper').style('opacity', 1);
      transition().select('.legendWrapper').duration(1000).delay(state.duration).style('opacity', 1);
    } //else

    //Start animation
    state.stopTimer = false;
    animate(state);
  }; //function _zoomToCanvas

  var enableMouseZoom = function enableMouseZoom(state) {
    var _containerId = state._containerId,
        mobileSize = state.mobileSize,
        root = state.root,
        fontCanvasDom = state.fontCanvasDom,
        colToCircle = state.colToCircle,
        _hiddenContext = state._hiddenContext,
        zoomInfo = state.zoomInfo,
        centerX = state.centerX,
        centerY = state.centerY,
        _options = state._options;
    //////////////////////////////////////////////////////////////
    //////////////// Mousemove functionality /////////////////////
    //////////////////////////////////////////////////////////////

    //Only run this if the user actually has a mouse

    if (!mobileSize) {
      var nodeOld = root;

      //Listen for mouse moves on the main canvas
      var mousemoveFunction = function mousemoveFunction(e) {
        if (!e) return;
        //Figure out where the mouse click occurred.
        var mouseX = e.offsetX; //e.layerX;
        var mouseY = e.offsetY; //e.layerY;

        // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
        // This will return that pixel's color
        var col = _hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
        //Our map uses these rgb strings as keys to nodes.
        var colString = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
        var node = colToCircle[colString];

        //Only change the popover if the user mouses over something new
        if (node !== nodeOld) {
          //Remove all previous popovers
          select('.popoverWrapper').remove();
          selectAll('.popover').remove();
          //Only continue when the user mouses over an actual node
          if (node) {
            //Only show a popover for the leaf nodes
            if (node.data.hasOwnProperty('_data')) {
              //Needed for placement
              var nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX,
                  nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY,
                  nodeR = node.r * zoomInfo.scale;

              //Create the wrapper div for the popover
              var div = document.createElement('div');
              div.setAttribute('class', 'popoverWrapper');
              document.getElementById(_containerId.substring(1)).appendChild(div);

              //Position the wrapper right above the circle
              select('.popoverWrapper').style({
                position: 'absolute',
                top: nodeY - nodeR,
                left: nodeX + _options.plots.padding * 5 / 4
              });

              //Show the tooltip
              $('.popoverWrapper').popover({
                placement: 'auto top',
                container: 'body',
                trigger: 'manual',
                html: true,
                animation: false,
                content: function content() {
                  return "<span class='nodeTooltip'>" + node.data.name + '</span>';
                }
              });
              $('.popoverWrapper').popover('show');
            }
          }
        }

        nodeOld = node;
      }; //function mousemoveFunction

      //document.getElementById(this._frontCanvasId).addEventListener("mousemove", mousemoveFunction);
      select(fontCanvasDom).on('mousemove', mousemoveFunction);
    } //if !mobileSize
  };

  var apiRender$5 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender$1(state).render(data);

        var _state = state,
            _options = _state._options,
            _data = _state._data,
            _color = _state._color,
            _hiddenContext = _state._hiddenContext,
            _frontCanvasId = _state._frontCanvasId,
            _canvasScale = _state._canvasScale;


        var barDimVal = function barDimVal(d) {
          return d[_options.data.x.accessor];
        };

        var centerX = _options.chart.innerWidth / 2;
        var centerY = _options.chart.innerHeight / 2;

        state.centerX = centerX;
        state.centerY = centerY;
        state.zoomInfo = {
          centerX: centerX,
          centerY: centerY,
          scale: 1
        };

        //////////////////////////////////////////////////////////////
        /////////////////////// Create Scales  ///////////////////////
        //////////////////////////////////////////////////////////////

        var diameter = Math.min(_options.chart.innerWidth * 0.9, _options.chart.innerHeight * 0.9);

        //Dataset to swtich between color of a circle (in the hidden canvas) and the node data
        state.colToCircle = {};

        var _hierarchy = hierarchy(_data, function (d) {
          return d.children;
        }).sum(function (d) {
          return d.size;
        });

        var _treeDepth = range(0, _hierarchy.height - 1, 1);
        state.colorCircle = ordinal().domain(_treeDepth).range(_options.plots.circleColors);

        var packLayout = pack$1().padding(1).size([diameter, diameter]);

        packLayout(_hierarchy);

        var barDimList = _hierarchy.leaves()[0].data._data.map(function (d) {
          return barDimVal(d);
        }).filter(function (ele, pos, arr) {
          return arr.indexOf(ele) === pos;
        });
        _color.domain(barDimList);

        var nodes = _hierarchy.descendants();

        //////////////////////////////////////////////////////////////
        ////////////// Create Circle Packing Data ////////////////////
        //////////////////////////////////////////////////////////////

        state = Object.assign(state, {
          _hierarchy: _hierarchy,
          nodes: nodes,
          root: _hierarchy,
          focus: _hierarchy,
          nodeCount: nodes.length,
          rootName: _hierarchy.data.name,
          nodeByName: {},
          elementsPerBar: barDimList.length,
          kids: [_hierarchy.data.name]
        });

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = state.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;

            state.nodeByName[d.data.name] = d;
          }

          //Setup the kids variable for the top (root) level
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        for (var i = 0; i < state.root.children.length; i++) {
          state.kids.push(state.root.children[i].name);
        }

        //Function to run oif a user clicks on the canvas
        var clickFunction = function clickFunction(e) {
          //Figure out where the mouse click occurred.
          var mouseX = e.offsetX * _canvasScale; //e.layerX;
          var mouseY = e.offsetY * _canvasScale; //e.layerY;

          // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
          // This will return that pixel's color
          var col = _hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
          //Our map uses these rgb strings as keys to nodes.
          var colString = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
          var node = state.colToCircle[colString];

          //If there was an actual node clicked on, zoom into this
          if (node) {
            //If the same node is clicked twice, set it to the top (root) level
            if (state.focus === node) node = state.root;

            //Save the names of the circle itself and first children
            //Needed to check which arc titles to show
            state.kids = [node.data.name];
            if (node.children !== undefined) {
              for (var _i = 0; _i < node.children.length; _i++) {
                state.kids.push(node.children[_i].data.name);
              } //for i
            } //if

            //Perform the zoom
            zoomToCanvas(state, node);
          } //if -> node
        }; //function clickFunction

        //Listen for clicks on the main canvas
        document.getElementById(_frontCanvasId).addEventListener('click', clickFunction);
        // canvas.on("click", clickFunction);
        enableMouseZoom(state);

        //////////////////////////////////////////////////////////////
        ///////////////////// Zoom Function //////////////////////////
        //////////////////////////////////////////////////////////////

        //Based on the generous help by Stephan Smola
        //http://bl.ocks.org/smoli/d7e4f9199c15d71258b5

        state = Object.assign(state, {
          diameter: diameter,
          fadeTextDuration: 750,
          fadeText: false,
          textAlpha: 1, //After a zoom is finished fade in the text;
          showText: true, //Only show the text while you're not zooming,
          duration: 1500,
          interpolator: null,
          timeElapsed: 0,
          _cubicEase: cubicInOut,
          scaleFactor: 1, //dummy value
          //Start the drawing loop. It will jump out of the loop once stopTimer becomes true
          stopTimer: false,
          vOld: [state.focus.x, state.focus.y, state.focus.r * 2.05]
        });

        //////////////////////////////////////////////////////////////
        /////////////////////// Initiate /////////////////////////////
        //////////////////////////////////////////////////////////////

        //First zoom to get the circles to the right location
        zoomToCanvas(state, state.root);
        //Draw the hidden canvas at least once
        drawCanvas(state, _hiddenContext, true);
        //Draw the legend

        // this.createLegend(scaleFactor);
        animate(state);
      }
    };
  };

  var apiNodeNames = function apiNodeNames(state) {
    return {
      nodeNames: function nodeNames() {
        var _hierarchy = state._hierarchy;

        var _names = [];

        _hierarchy.each(function (d) {
          _names.push(d.data.name);
        });

        return _names;
      }
    };
  };

  var apiSearch = function apiSearch(state) {
    return {
      //Needed in the global scope
      search: function search() {
        var _name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var nodeByName = state.nodeByName;

        if (!_name) {
          console.log(' search term cannot be empty');
          return;
        }

        var _node = nodeByName[_name];

        if (!_node) {
          console.log(' node: ' + _name + ' cannot be found');
          return;
        }

        zoomToCanvas(state, _node);
      }
    };
  };

  var commaFormat$3 = format(',');

  var apiCreateLegend = function apiCreateLegend(state) {
    return {
      //////////////////////////////////////////////////////////////
      ///////////// Function | The legend creation /////////////////
      //////////////////////////////////////////////////////////////

      createLegend: function createLegend(legendId) {
        var scaleFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        var legendSizes = [10, 30, 60];

        //select("#legendRowWrapper").style("opacity", 0);

        var width = parseInt(select(legendId).style('width'), 10),
            height = legendSizes[2] * 2 * 1.2;

        var legendCenter = -10,
            legendBottom = height,
            legendLineLength = legendSizes[2] * 1.3,
            textPadding = 5;

        //Create SVG for the legend
        var _legendSvg = select(legendId).append('svg').attr('width', width).attr('height', height).append('g').attr('class', 'legendWrapper').attr('transform', 'translate(' + width / 2 + ',' + 0 + ')').style('opacity', 0);

        //Draw the circles
        _legendSvg.selectAll('.legendCircle').data(legendSizes).enter().append('circle').attr('r', function (d) {
          return d;
        }).attr('class', 'legendCircle').attr('cx', legendCenter).attr('cy', function (d) {
          return legendBottom - d;
        });
        //Draw the line connecting the top of the circle to the number
        _legendSvg.selectAll('.legendLine').data(legendSizes).enter().append('line').attr('class', 'legendLine').attr('x1', legendCenter).attr('y1', function (d) {
          return legendBottom - 2 * d;
        }).attr('x2', legendCenter + legendLineLength).attr('y2', function (d) {
          return legendBottom - 2 * d;
        });
        //Place the value next to the line
        _legendSvg.selectAll('.legendText').data(legendSizes).enter().append('text').attr('class', 'legendText').attr('x', legendCenter + legendLineLength + textPadding).attr('y', function (d) {
          return legendBottom - 2 * d;
        }).attr('dy', '0.3em').text(function (d) {
          return commaFormat$3(Math.round(scaleFactor * d * d / 10) * 10);
        });

        //Slowly fade in so the scaleFactor is set to the correct value in the mean time :)
        transition().select(legendId + ' .legendWrapper').duration(1000).delay(500).style('opacity', 1);
      }
    };
  };

  var DefaultOptions$2 = {
    chart: {
      type: 'circle-pack'
    },
    color: DefaultCategoricalColor,
    renderer: 'canvas',
    data: {
      x: { name: 'dimension', type: 'string', accessor: 'MX' },
      y: { name: 'metric', type: 'number', accessor: 'MY' }
    },
    plots: {
      padding: 20,
      circleColors: ['#bdd7e7', '#6baed6', '#3182bd', '#08519c'],
      mainTextColor: [74, 74, 74], //"#4A4A4A",
      titleFont: 'Oswald',
      titleFn: function titleFn(d) {
        return 'Total ' + d;
      },
      bodyFont: 'Merriweather Sans',
      barChartHeight: 0.7,
      barChartHeightOffset: 0.15
    }
  };

  var index$4 = factory(canvasLayer, { opt: DefaultOptions$2 }, [apiRender$5, apiSearch, apiCreateLegend, apiNodeNames]);

  var apiRender$6 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var _options = state._options,
            _container = state._container,
            _svg = state._svg,
            _data = state._data,
            _color = state._color,
            _containerId = state._containerId;


        var _radius = Math.min(_options.chart.innerWidth, _options.chart.innerHeight) / 2;

        var _uuid = uuid();

        // id generation
        var _trailId = '#trail-' + _uuid;
        var _endLabelId = '#end-label-' + _uuid;

        var _uiConfig = _options.uiConfig;

        _container.attr('preserveAspectRatio', 'xMinYMin').attr('viewBox', '0 0 ' + _options.chart.width + ' ' + _options.chart.height);
        _svg.attr('transform', 'translate(' + _options.chart.width / 2 + ',' + _options.chart.height / 2 + ')');

        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        _svg.append('svg:circle').attr('r', _radius).style('opacity', 0);

        var _partition = partition().size([2 * Math.PI, _radius * _radius]);

        var _arc = arc().startAngle(function (d) {
          return d.x0;
        }).endAngle(function (d) {
          return d.x1;
        }).innerRadius(function (d) {
          return Math.sqrt(d.y0);
        }).outerRadius(function (d) {
          return Math.sqrt(d.y1);
        });

        // Basic setup of page elements.
        // Add the svg area.
        var trail = select(_uiConfig.sequence).append('svg:svg').attr('width', _options.chart.width).attr('height', 50).attr('id', _trailId.substr(1, _trailId.length - 1));
        // Add the label at the end, for the percentage.
        trail.append('svg:text').attr('id', _endLabelId.substr(1, _endLabelId.length - 1)).style('fill', '#000');

        // Turn the data into a d3 hierarchy and calculate the sums.
        var root = hierarchy(_data).sum(function (d) {
          return d.size;
        }).sort(function (a, b) {
          return b.value - a.value;
        });

        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = _partition(root).descendants().filter(function (d) {
          return d.x1 - d.x0 > 0.005;
        }); // 0.005 radians = 0.29 degrees

        var path = _svg.data([_data]).selectAll('path').data(nodes).enter().append('svg:path').attr('display', function (d) {
          return d.depth ? null : 'none';
        }).attr('d', _arc).attr('fill-rule', 'evenodd').style('fill', function (d) {
          return _color(d.data.name);
        }).style('opacity', 1).on('mouseover', mouseover);

        // Add the mouseleave handler to the bounding circle.
        _svg.on('mouseleave', mouseleave);

        // Total size of all segments; we set this later, after loading the data.
        // Get total size of the tree = value of root node from partition.
        var totalSize = path.datum().value;
        var breadcrumbs = _options.plots.breadcrumb;

        // Generate a string that describes the points of a breadcrumb polygon.
        function _breadcrumbPoints(d, i) {
          var points = [];

          points.push('0,0');
          points.push(breadcrumbs.w + ',0');
          points.push(breadcrumbs.w + breadcrumbs.t + ',' + breadcrumbs.h / 2);
          points.push(breadcrumbs.w + ',' + breadcrumbs.h);
          points.push('0,' + breadcrumbs.h);
          if (i > 0) {
            // Leftmost breadcrumb; don't include 6th vertex.
            points.push(breadcrumbs.t + ',' + breadcrumbs.h / 2);
          }
          return points.join(' ');
        }

        // Update the breadcrumb trail to show the current sequence and percentage.
        function _updateBreadcrumbs(nodeArray, percentageString) {
          // Data join; key function combines name and depth (= position in sequence).
          var trail = select(_trailId).selectAll('g').data(nodeArray, function (d) {
            return d.data.name + d.depth;
          });

          // Remove exiting nodes.
          trail.exit().remove();

          // Add breadcrumb and label for entering nodes.
          var entering = trail.enter().append('svg:g');

          entering.append('svg:polygon').attr('points', _breadcrumbPoints).style('fill', function (d) {
            return _color(d.data.name);
          });

          entering.append('svg:text').attr('x', (breadcrumbs.w + breadcrumbs.t) / 2).attr('y', breadcrumbs.h / 2).attr('dy', '0.35em').attr('text-anchor', 'middle').text(function (d) {
            return d.data.name;
          });

          // Merge enter and update selections; set position for all nodes.
          entering.merge(trail).attr('transform', function (d, i) {
            return 'translate(' + i * (breadcrumbs.w + breadcrumbs.s) + ', 0)';
          });

          // Now move and update the percentage at the end.
          select(_trailId).select(_endLabelId).attr('x', (nodeArray.length + 0.5) * (breadcrumbs.w + breadcrumbs.s)).attr('y', breadcrumbs.h / 2).attr('dy', '0.35em').attr('text-anchor', 'middle').text(percentageString);

          // Make the breadcrumb trail visible, if it's hidden.
          select(_trailId).style('visibility', '');
        }

        // Fade all but the current sequence, and show it in the breadcrumb trail.
        function mouseover(d) {
          var percentage = (100 * d.value / totalSize).toPrecision(3);
          var percentageString = percentage + '%';
          if (percentage < 0.1) {
            percentageString = '< 0.1%';
          }

          select(_uiConfig.percentage).text(percentageString);

          select(_uiConfig.explanation).style('visibility', '');

          var sequenceArray = d.ancestors().reverse();
          sequenceArray.shift(); // remove root node from the array
          _updateBreadcrumbs(sequenceArray, percentageString);

          // Fade all the segments.
          selectAll$1('path').style('opacity', 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          _svg.selectAll('path').filter(function (node) {
            return sequenceArray.indexOf(node) >= 0;
          }).style('opacity', 1);
        }

        // Restore everything to full opacity when moving off the visualization.
        function mouseleave(d) {
          // Hide the breadcrumb trail
          select(_trailId).style('visibility', 'hidden');

          // Deactivate all segments during transition.
          selectAll$1('path').on('mouseover', null);

          // Transition each segment to full opacity and then reactivate it.

          transition().selectAll(_containerId + ' path').duration(1000).style('opacity', 1).on('end', function () {
            select(this).on('mouseover', mouseover);
          });

          select(_uiConfig.explanation).style('visibility', 'hidden');
        }
      }
    };
  };

  var apiDrawLegend = function apiDrawLegend(state) {
    return {
      drawLegend: function drawLegend(_domId) {
        var _options = state._options,
            _color = state._color;

        var _legendMargin = _options.plots.legendMargin;
        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var legend = select(_domId).append('svg:svg').attr('width', _legendMargin.w).attr('height', _color.domain().length * (_legendMargin.h + _legendMargin.s));

        var g = legend.selectAll('g').data(_color.domain()).enter().append('svg:g').attr('transform', function (d, i) {
          return 'translate(0,' + i * (_legendMargin.h + _legendMargin.s) + ')';
        });

        g.append('svg:rect').attr('rx', _legendMargin.r).attr('ry', _legendMargin.r).attr('width', _legendMargin.w).attr('height', _legendMargin.h).style('fill', function (d) {
          return _color(d);
        });

        g.append('svg:text').attr('x', _legendMargin.w / 2).attr('y', _legendMargin.h / 2).attr('dy', '0.35em').attr('text-anchor', 'middle').text(function (d) {
          return d;
        });
      }
    };
  };

  var opt$1 = {
    chart: {
      type: 'sequential-sunburst'
    },
    color: DefaultCategoricalColor,
    plots: {
      breadcrumb: { w: 75, h: 30, s: 3, t: 10 },
      legendMargin: { w: 75, h: 30, s: 3, r: 3 }
    },
    uiConfig: {
      sequence: null,
      explanation: null,
      percentage: null
    }
  };

  var index$5 = factory(svgLayer, { opt: opt$1 }, [apiRender$6, apiDrawLegend]);

  // Take a 2-column CSV and transform it into a hierarchical structure suitable
  // for a partition layout. The first column is a sequence of step names, from
  // root to leaf, separated by hyphens. The second column is a count of how
  // often that sequence occurred.

  var buildHierarchy = function buildHierarchy(csv) {
    var root = { name: 'root', children: [] };

    for (var i = 0; i < csv.length; i++) {
      var sequence = csv[i][0];
      var size = +csv[i][1];

      if (isNaN(size)) {
        // e.g. if this is a header row
        continue;
      }
      var parts = sequence.split('-');
      var currentNode = root;
      for (var j = 0; j < parts.length; j++) {
        var children = currentNode['children'];
        var nodeName = parts[j];
        var childNode = void 0;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          var foundChild = false;
          for (var k = 0; k < children.length; k++) {
            if (children[k]['name'] == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = { name: nodeName, children: [] };
            children.push(childNode);
          }
          currentNode = childNode;
        } else {
          // Reached the end of the sequence; create a leaf node.
          childNode = { name: nodeName, size: size };
          children.push(childNode);
        }
      }
    }

    return root;
  };

  var diagonalVertical = function diagonalVertical(d) {
    return 'M' + d.source.x + ',' + d.source.y + 'C' + (d.source.x + d.target.x) / 2 + ',' + d.source.y + ' ' + (d.source.x + d.target.x) / 2 + ',' + d.target.y + ' ' + d.target.x + ',' + d.target.y;
  };

  var elbow = function elbow(d, i) {
    return 'M' + d.parent.y + ',' + d.parent.x + 'V' + d.x + 'H' + (d.y - 0);
  };

  exports.version = version;
  exports.icicleTree = index$1;
  exports.weightedTree = index$2;
  exports.sunburst = index$3;
  exports.circlePack = index$4;
  exports.sequentialSunburst = index$5;
  exports.buildHierarchy = buildHierarchy;
  exports.diagonalHorizontal = diagonalHorizontal;
  exports.diagonalVertical = diagonalVertical;
  exports.elbow = elbow;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vizart-hierarchy.standalone.js.map
