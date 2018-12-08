
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet')) :
  typeof define === 'function' && define.amd ? define(['exports', 'leaflet'], factory) :
  (factory((global.VizArtGeo = {}),global.L$1));
}(this, (function (exports,L$1) { 'use strict';

  L$1 = L$1 && L$1.hasOwnProperty('default') ? L$1['default'] : L$1;

  var version = "2.0.1";

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

  function sequence (start, stop, step) {
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

  function threshold (values, p, valueof) {
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
    hex: function hex() {
      return this.rgb().hex();
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

  // https://beta.observablehq.com/@mbostock/lab-and-rgb
  var K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn),
        x,
        z;
    if (r === g && g === b) x = z = y;else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
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
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function darker(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function rgb$$1() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
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
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function darker(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
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

  var rgb$1 = (function rgbGamma(y) {
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
      x[i] = value(a[i], b[i]);
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

  function number$1 (a, b) {
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
        i[k] = value(a[k], b[k]);
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

  function string (a, b) {
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
        q.push({ i: i, x: number$1(am, bm) });
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

  function value (a, b) {
      var t = typeof b === "undefined" ? "undefined" : _typeof(b),
          c;
      return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? number$1 : t === "string" ? (c = color(b)) ? (b = c, rgb$1) : string : b instanceof color ? rgb$1 : b instanceof Date ? date : Array.isArray(b) ? array$2 : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number$1)(a, b);
  }

  function interpolateRound (a, b) {
    return a = +a, b -= a, function (t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var rho = Math.SQRT2;

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

  function number$2 (x) {
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

  function bimap(domain, range, deinterpolate, reinterpolate) {
    var d0 = domain[0],
        d1 = domain[1],
        r0 = range[0],
        r1 = range[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function (x) {
      return r0(d0(x));
    };
  }

  function polymap(domain, range, deinterpolate, reinterpolate) {
    var j = Math.min(domain.length, range.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++i < j) {
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range[i], range[i + 1]);
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
        range = unit,
        interpolate$$1 = value,
        clamp = false,
        piecewise$$1,
        output,
        input;

    function rescale() {
      piecewise$$1 = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return (output || (output = piecewise$$1(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
    }

    scale.invert = function (y) {
      return (input || (input = piecewise$$1(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function (_) {
      return arguments.length ? (domain = map$2.call(_, number$2), rescale()) : domain.slice();
    };

    scale.range = function (_) {
      return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
    };

    scale.rangeRound = function (_) {
      return range = slice$1.call(_), interpolate$$1 = interpolateRound, rescale();
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
    var scale = continuous(deinterpolateLinear, number$1);

    scale.copy = function () {
      return copy(scale, linear$1());
    };

    return linearish(scale);
  }

  function quantile$$1() {
    var domain = [],
        range = [],
        thresholds = [];

    function rescale() {
      var i = 0,
          n = Math.max(1, range.length);
      thresholds = new Array(n - 1);
      while (++i < n) {
        thresholds[i - 1] = threshold(domain, i / n);
      }return scale;
    }

    function scale(x) {
      if (!isNaN(x = +x)) return range[bisectRight(thresholds, x)];
    }

    scale.invertExtent = function (y) {
      var i = range.indexOf(y);
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
      return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
    };

    scale.quantiles = function () {
      return thresholds.slice();
    };

    scale.copy = function () {
      return quantile$$1().domain(domain).range(range);
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
      var range = [],
          previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do {
        range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      } while (previous < start && start < stop);
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
      "f": formatMicroseconds,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
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
      "f": formatUTCMicroseconds,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
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
      "f": parseMicroseconds,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
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
            i = parseSpecifier(d, specifier, string += "", 0),
            week,
            day$$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
            week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = newDate(newYear(d.y)), day$$1 = week.getDay();
            week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
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
      requoteRe = /[\\^$*+?|[\]().{}]/g;

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

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
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
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
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

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0] * 1000, i + n[0].length) : -1;
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

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
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

  function formatWeekdayNumberMonday(d) {
    var day$$1 = d.getDay();
    return day$$1 === 0 ? 7 : day$$1;
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatWeekNumberISO(d, p) {
    var day$$1 = d.getDay();
    d = day$$1 >= 4 || day$$1 === 0 ? thursday(d) : thursday.ceil(d);
    return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
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

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
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

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekNumberISO(d, p) {
    var day$$1 = d.getUTCDay();
    d = day$$1 >= 4 || day$$1 === 0 ? utcThursday(d) : utcThursday.ceil(d);
    return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
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

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
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

  var interpolateCubehelixDefault = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

  var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var c = cubehelix();

  function interpolateRainbow (t) {
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    c.h = 360 * t - 100;
    c.s = 1.5 - 1.5 * ts;
    c.l = 0.8 - 0.9 * ts;
    return c + "";
  }

  var c$1 = rgb(),
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

  var event = null;

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
      var event0 = event; // Events can be reentrant (e.g., focus).
      event = event1;
      try {
        listener.call(this, this.__data__, index, group);
      } finally {
        event = event0;
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

  function sourceEvent () {
    var current = event,
        source;
    while (source = current.sourceEvent) {
      current = source;
    }return current;
  }

  function point$1 (node, event) {
    var svg = node.ownerSVGElement || node;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }

    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  }

  function mouse (node) {
    var event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point$1(node, event);
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

  var MetroCold5 = ['#1bcebf', '#24bbd2', '#1572ca', '#1f33a1', '#5f26c1'];

  var MetroRain3 = ['#79e70f', '#10d9ec', '#1f97e7'];

  var MetroRain8 = ['#abe70f', '#79e70f', '#0fe71f', '#0fe7d4', '#10d9ec', '#10c5ec', '#1fb2e7', '#1f97e7'];

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

    var _scale = quantile$$1().domain(_distinction);

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
      return sequence(distinction).map(function (d) {
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

  var genericColor = function genericColor(color$$1, data) {
    var _scheme = color$$1.scheme;
    var _type = color$$1.type;

    switch (_type) {
      case Globals.ColorType.GRADIENT:
        return gradientColor(_scheme, data);

      case Globals.ColorType.DISTINCT:
        var _valMap = data ? color$$1.distinction.map(function (d) {
          return max(data) * +d;
        }) : color$$1.distinction;

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
  var DefaultColorComposer = function DefaultColorComposer(color$$1, data, opt) {
    return genericColor(color$$1);
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
      color: function color$$1(_color) {
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

  var getDimension = function getDimension(opt) {
    return opt.data.x;
  };
  var getMetric = function getMetric(opt) {
    return opt.data.y[0];
  };
  var getDimensionVal = function getDimensionVal(opt) {
    return function (d) {
      return d[getDimension(opt).accessor];
    };
  };
  var getMetricVal = function getMetricVal(opt) {
    return function (d) {
      return d[getMetric(opt).accessor];
    };
  };

  // Adds floating point numbers with twice the normal precision.
  // Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
  // Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
  // 305–363 (1997).
  // Code adapted from GeographicLib by Charles F. F. Karney,
  // http://geographiclib.sourceforge.net/

  function adder () {
    return new Adder();
  }

  function Adder() {
    this.reset();
  }

  Adder.prototype = {
    constructor: Adder,
    reset: function reset() {
      this.s = // rounded value
      this.t = 0; // exact error
    },
    add: function add(y) {
      _add(temp, y, this.t);
      _add(this, temp.s, this.s);
      if (this.s) this.t += temp.t;else this.s = temp.t;
    },
    valueOf: function valueOf() {
      return this.s;
    }
  };

  var temp = new Adder();

  function _add(adder, a, b) {
    var x = adder.s = a + b,
        bv = x - a,
        av = x - bv;
    adder.t = a - av + (b - bv);
  }

  var pi = Math.PI;
  var tau = pi * 2;

  var abs = Math.abs;
  var sqrt$1 = Math.sqrt;

  function noop$1() {}

  function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
      streamGeometryType[geometry.type](geometry, stream);
    }
  }

  var streamObjectType = {
    Feature: function Feature(object, stream) {
      streamGeometry(object.geometry, stream);
    },
    FeatureCollection: function FeatureCollection(object, stream) {
      var features = object.features,
          i = -1,
          n = features.length;
      while (++i < n) {
        streamGeometry(features[i].geometry, stream);
      }
    }
  };

  var streamGeometryType = {
    Sphere: function Sphere(object, stream) {
      stream.sphere();
    },
    Point: function Point(object, stream) {
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    },
    MultiPoint: function MultiPoint(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;
      while (++i < n) {
        object = coordinates[i], stream.point(object[0], object[1], object[2]);
      }
    },
    LineString: function LineString(object, stream) {
      streamLine(object.coordinates, stream, 0);
    },
    MultiLineString: function MultiLineString(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;
      while (++i < n) {
        streamLine(coordinates[i], stream, 0);
      }
    },
    Polygon: function Polygon(object, stream) {
      streamPolygon(object.coordinates, stream);
    },
    MultiPolygon: function MultiPolygon(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;
      while (++i < n) {
        streamPolygon(coordinates[i], stream);
      }
    },
    GeometryCollection: function GeometryCollection(object, stream) {
      var geometries = object.geometries,
          i = -1,
          n = geometries.length;
      while (++i < n) {
        streamGeometry(geometries[i], stream);
      }
    }
  };

  function streamLine(coordinates, stream, closed) {
    var i = -1,
        n = coordinates.length - closed,
        coordinate;
    stream.lineStart();
    while (++i < n) {
      coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    }stream.lineEnd();
  }

  function streamPolygon(coordinates, stream) {
    var i = -1,
        n = coordinates.length;
    stream.polygonStart();
    while (++i < n) {
      streamLine(coordinates[i], stream, 1);
    }stream.polygonEnd();
  }

  function geoStream (object, stream) {
    if (object && streamObjectType.hasOwnProperty(object.type)) {
      streamObjectType[object.type](object, stream);
    } else {
      streamGeometry(object, stream);
    }
  }

  var areaRingSum = adder();

  var areaSum = adder();

  var // previous 3D point
  deltaSum = adder();

  var sum$1 = adder();

  var lengthSum = adder();

  function identity$5 (x) {
    return x;
  }

  var areaSum$1 = adder(),
      areaRingSum$1 = adder(),
      x00,
      y00,
      x0$1,
      y0$1;

  var areaStream$1 = {
    point: noop$1,
    lineStart: noop$1,
    lineEnd: noop$1,
    polygonStart: function polygonStart() {
      areaStream$1.lineStart = areaRingStart$1;
      areaStream$1.lineEnd = areaRingEnd$1;
    },
    polygonEnd: function polygonEnd() {
      areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop$1;
      areaSum$1.add(abs(areaRingSum$1));
      areaRingSum$1.reset();
    },
    result: function result() {
      var area = areaSum$1 / 2;
      areaSum$1.reset();
      return area;
    }
  };

  function areaRingStart$1() {
    areaStream$1.point = areaPointFirst$1;
  }

  function areaPointFirst$1(x, y) {
    areaStream$1.point = areaPoint$1;
    x00 = x0$1 = x, y00 = y0$1 = y;
  }

  function areaPoint$1(x, y) {
    areaRingSum$1.add(y0$1 * x - x0$1 * y);
    x0$1 = x, y0$1 = y;
  }

  function areaRingEnd$1() {
    areaPoint$1(x00, y00);
  }

  var x0$2 = Infinity,
      y0$2 = x0$2,
      x1 = -x0$2,
      y1 = x1;

  var boundsStream$1 = {
    point: boundsPoint$1,
    lineStart: noop$1,
    lineEnd: noop$1,
    polygonStart: noop$1,
    polygonEnd: noop$1,
    result: function result() {
      var bounds = [[x0$2, y0$2], [x1, y1]];
      x1 = y1 = -(y0$2 = x0$2 = Infinity);
      return bounds;
    }
  };

  function boundsPoint$1(x, y) {
    if (x < x0$2) x0$2 = x;
    if (x > x1) x1 = x;
    if (y < y0$2) y0$2 = y;
    if (y > y1) y1 = y;
  }

  // TODO Enforce positive area for exterior, negative area for interior?

  var X0$1 = 0,
      Y0$1 = 0,
      Z0$1 = 0,
      X1$1 = 0,
      Y1$1 = 0,
      Z1$1 = 0,
      X2$1 = 0,
      Y2$1 = 0,
      Z2$1 = 0,
      x00$1,
      y00$1,
      x0$3,
      y0$3;

  var centroidStream$1 = {
    point: centroidPoint$1,
    lineStart: centroidLineStart$1,
    lineEnd: centroidLineEnd$1,
    polygonStart: function polygonStart() {
      centroidStream$1.lineStart = centroidRingStart$1;
      centroidStream$1.lineEnd = centroidRingEnd$1;
    },
    polygonEnd: function polygonEnd() {
      centroidStream$1.point = centroidPoint$1;
      centroidStream$1.lineStart = centroidLineStart$1;
      centroidStream$1.lineEnd = centroidLineEnd$1;
    },
    result: function result() {
      var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1] : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1] : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1] : [NaN, NaN];
      X0$1 = Y0$1 = Z0$1 = X1$1 = Y1$1 = Z1$1 = X2$1 = Y2$1 = Z2$1 = 0;
      return centroid;
    }
  };

  function centroidPoint$1(x, y) {
    X0$1 += x;
    Y0$1 += y;
    ++Z0$1;
  }

  function centroidLineStart$1() {
    centroidStream$1.point = centroidPointFirstLine;
  }

  function centroidPointFirstLine(x, y) {
    centroidStream$1.point = centroidPointLine;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }

  function centroidPointLine(x, y) {
    var dx = x - x0$3,
        dy = y - y0$3,
        z = sqrt$1(dx * dx + dy * dy);
    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }

  function centroidLineEnd$1() {
    centroidStream$1.point = centroidPoint$1;
  }

  function centroidRingStart$1() {
    centroidStream$1.point = centroidPointFirstRing;
  }

  function centroidRingEnd$1() {
    centroidPointRing(x00$1, y00$1);
  }

  function centroidPointFirstRing(x, y) {
    centroidStream$1.point = centroidPointRing;
    centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
  }

  function centroidPointRing(x, y) {
    var dx = x - x0$3,
        dy = y - y0$3,
        z = sqrt$1(dx * dx + dy * dy);

    X1$1 += z * (x0$3 + x) / 2;
    Y1$1 += z * (y0$3 + y) / 2;
    Z1$1 += z;

    z = y0$3 * x - x0$3 * y;
    X2$1 += z * (x0$3 + x);
    Y2$1 += z * (y0$3 + y);
    Z2$1 += z * 3;
    centroidPoint$1(x0$3 = x, y0$3 = y);
  }

  function PathContext(context) {
    this._context = context;
  }

  PathContext.prototype = {
    _radius: 4.5,
    pointRadius: function pointRadius(_) {
      return this._radius = _, this;
    },
    polygonStart: function polygonStart() {
      this._line = 0;
    },
    polygonEnd: function polygonEnd() {
      this._line = NaN;
    },
    lineStart: function lineStart() {
      this._point = 0;
    },
    lineEnd: function lineEnd() {
      if (this._line === 0) this._context.closePath();
      this._point = NaN;
    },
    point: function point(x, y) {
      switch (this._point) {
        case 0:
          {
            this._context.moveTo(x, y);
            this._point = 1;
            break;
          }
        case 1:
          {
            this._context.lineTo(x, y);
            break;
          }
        default:
          {
            this._context.moveTo(x + this._radius, y);
            this._context.arc(x, y, this._radius, 0, tau);
            break;
          }
      }
    },
    result: noop$1
  };

  var lengthSum$1 = adder(),
      lengthRing,
      x00$2,
      y00$2,
      x0$4,
      y0$4;

  var lengthStream$1 = {
    point: noop$1,
    lineStart: function lineStart() {
      lengthStream$1.point = lengthPointFirst$1;
    },
    lineEnd: function lineEnd() {
      if (lengthRing) lengthPoint$1(x00$2, y00$2);
      lengthStream$1.point = noop$1;
    },
    polygonStart: function polygonStart() {
      lengthRing = true;
    },
    polygonEnd: function polygonEnd() {
      lengthRing = null;
    },
    result: function result() {
      var length = +lengthSum$1;
      lengthSum$1.reset();
      return length;
    }
  };

  function lengthPointFirst$1(x, y) {
    lengthStream$1.point = lengthPoint$1;
    x00$2 = x0$4 = x, y00$2 = y0$4 = y;
  }

  function lengthPoint$1(x, y) {
    x0$4 -= x, y0$4 -= y;
    lengthSum$1.add(sqrt$1(x0$4 * x0$4 + y0$4 * y0$4));
    x0$4 = x, y0$4 = y;
  }

  function PathString() {
    this._string = [];
  }

  PathString.prototype = {
    _radius: 4.5,
    _circle: circle$1(4.5),
    pointRadius: function pointRadius(_) {
      if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
      return this;
    },
    polygonStart: function polygonStart() {
      this._line = 0;
    },
    polygonEnd: function polygonEnd() {
      this._line = NaN;
    },
    lineStart: function lineStart() {
      this._point = 0;
    },
    lineEnd: function lineEnd() {
      if (this._line === 0) this._string.push("Z");
      this._point = NaN;
    },
    point: function point(x, y) {
      switch (this._point) {
        case 0:
          {
            this._string.push("M", x, ",", y);
            this._point = 1;
            break;
          }
        case 1:
          {
            this._string.push("L", x, ",", y);
            break;
          }
        default:
          {
            if (this._circle == null) this._circle = circle$1(this._radius);
            this._string.push("M", x, ",", y, this._circle);
            break;
          }
      }
    },
    result: function result() {
      if (this._string.length) {
        var result = this._string.join("");
        this._string = [];
        return result;
      } else {
        return null;
      }
    }
  };

  function circle$1(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }

  function geoPath (projection, context) {
    var pointRadius = 4.5,
        projectionStream,
        contextStream;

    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        geoStream(object, projectionStream(contextStream));
      }
      return contextStream.result();
    }

    path.area = function (object) {
      geoStream(object, projectionStream(areaStream$1));
      return areaStream$1.result();
    };

    path.measure = function (object) {
      geoStream(object, projectionStream(lengthStream$1));
      return lengthStream$1.result();
    };

    path.bounds = function (object) {
      geoStream(object, projectionStream(boundsStream$1));
      return boundsStream$1.result();
    };

    path.centroid = function (object) {
      geoStream(object, projectionStream(centroidStream$1));
      return centroidStream$1.result();
    };

    path.projection = function (_) {
      return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$5) : (projection = _).stream, path) : projection;
    };

    path.context = function (_) {
      if (!arguments.length) return context;
      contextStream = _ == null ? (context = null, new PathString()) : new PathContext(context = _);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return path;
    };

    path.pointRadius = function (_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };

    return path.projection(projection).context(context);
  }

  function geoTransform (methods) {
    return {
      stream: transformer(methods)
    };
  }

  function transformer(methods) {
    return function (stream) {
      var s = new TransformStream();
      for (var key in methods) {
        s[key] = methods[key];
      }s.stream = stream;
      return s;
    };
  }

  function TransformStream() {}

  TransformStream.prototype = {
    constructor: TransformStream,
    point: function point(x, y) {
      this.stream.point(x, y);
    },
    sphere: function sphere() {
      this.stream.sphere();
    },
    lineStart: function lineStart() {
      this.stream.lineStart();
    },
    lineEnd: function lineEnd() {
      this.stream.lineEnd();
    },
    polygonStart: function polygonStart() {
      this.stream.polygonStart();
    },
    polygonEnd: function polygonEnd() {
      this.stream.polygonEnd();
    }
  };

  var tooltipMarkup = function tooltipMarkup(d, state, _c) {
      return '\n    <div class="tooltip-content" style="border-color: ' + _c(d) + ';">\n        <div class="tooltip-header">' + getDimensionVal(state)(d) + '</div>\n        <div class="tooltip-row">\n            <div class="col">' + getMetric(state).name + ' </div>\n            <div class="col">' + getMetricVal(state)(d) + ' </div>\n        </div>\n    </div>\n    ';
  };

  var apiRender$2 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        state._data = state._composers.data(data, state._options);
        state._color = state._composers.color(state._options.color, state._data, state._options);

        var _options = state._options,
            _containerId = state._containerId,
            _data = state._data;


        var _getMetricVal = getMetricVal(_options);

        var _mapId = 'map-' + uuid();

        var _array = data.map(_getMetricVal);
        state._color = genericColor(_options.color, _array);

        var _color = state._color;


        var _c = function _c(d) {
          return _getMetricVal(d) === 0 ? _options.plots.emptyDataColor : _color(_getMetricVal(d));
        };

        var _canvasLayer = select(_containerId).append('div').attr('id', _mapId).attr('class', 'vizart-chart').style('width', _options.chart.innerWidth + 'px').style('height', _options.chart.innerHeight + 'px').style('top', _options.chart.margin.top + 'px').style('left', _options.chart.margin.left + 'px').style('position', 'relative');

        var _tooltip = select(_containerId).append('div').attr('id', 'tooltip-' + uuid()).attr('class', 'vizart-tooltip').style('opacity', 0);

        var _map = new L.Map(_mapId).setView(_options.map.center, _options.map.zoomLevel);

        var _tileLayer = new L.TileLayer(_options.map.tileLayer, _options.map.layerOptions);

        _map.addLayer(_tileLayer);

        var _svg = select(_map.getPanes().overlayPane).append('svg').style('position', 'relative').attr('class', 'vizart-map');

        var g = _svg.append('g').attr('class', 'leaflet-zoom-hide');

        var projectPoint = function projectPoint(x, y) {
          var point = _map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
        };

        var transform = geoTransform({ point: projectPoint });
        var path = geoPath().projection(transform);

        var svgPath = g.selectAll('path').data(_data.features).enter().append('path').attr('class', 'path').attr('fill-opacity', _options.plots.fillOpacity).attr('stroke', _options.plots.stroke).attr('stroke-width', _options.plots.strokeWidth).attr('fill', _c);

        var reset = function reset() {
          var bounds$$1 = path.bounds(_data);
          var topLeft = bounds$$1[0];
          var bottomRight = bounds$$1[1];

          _svg.attr('width', bottomRight[0] - topLeft[0]).attr('height', bottomRight[1] - topLeft[1]).style('left', topLeft[0] + 'px').style('top', topLeft[1] + 'px');

          g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

          svgPath.attr('d', path);
        };

        // according to http://stackoverflow.com/questions/40915225/event-viewreset-is-not-fired-in-leaflet-version-1-0-2
        _map.on('zoom', reset);

        reset();

        svgPath.on('mousemove', function (d) {
          _tooltip.style('opacity', 1);

          var coordinates = mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];

          _tooltip.style('left', x < 40 ? x : x - 22 + 'px').style('top', y < 40 ? y + 34 : y - 34 + 'px').html(tooltipMarkup(d, _options, _c));
        }).on('mouseout', function () {
          return _tooltip.style('opacity', 0);
        });
      }
    };
  };

  var apiColor$1 = function apiColor(state) {
    return {
      color: function color(colorOptions) {
        state._options.color = colorOptions;
        state._color = state._composers.color(colorOptions);

        var _svg = state._svg,
            _options = state._options,
            _c = state._c;

        _svg.selectAll('.path').transition().duration(_options.animation.duration.quickUpdate).delay(function (d, i) {
          return i * 50;
        }).attr('fill', _c);
      }
    };
  };

  var apiChangeRasterLayer = function apiChangeRasterLayer(state) {
    return {
      changeRasterLayer: function changeRasterLayer(_rasterLayer, _token) {
        var _options = state._options,
            _map = state._map;

        _options.map.tileLayer = _rasterLayer;
        _options.map.layerOptions.id = _token;

        _map.removeLayer(state._tileLayer);

        state._tileLayer = new L$1.TileLayer(_options.map.tileLayer, _options.map.layerOptions);

        _map.addLayer(state._tileLayer);
      }
    };
  };

  var type = "FeatureCollection";
  var features = [{
  	type: "Feature",
  	id: "01",
  	properties: {
  		name: "Alabama"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-87.359296, 35.00118], [-85.606675, 34.984749], [-85.431413, 34.124869], [-85.184951, 32.859696], [-85.069935, 32.580372], [-84.960397, 32.421541], [-85.004212, 32.322956], [-84.889196, 32.262709], [-85.058981, 32.13674], [-85.053504, 32.01077], [-85.141136, 31.840985], [-85.042551, 31.539753], [-85.113751, 31.27686], [-85.004212, 31.003013], [-85.497137, 30.997536], [-87.600282, 30.997536], [-87.633143, 30.86609], [-87.408589, 30.674397], [-87.446927, 30.510088], [-87.37025, 30.427934], [-87.518128, 30.280057], [-87.655051, 30.247195], [-87.90699, 30.411504], [-87.934375, 30.657966], [-88.011052, 30.685351], [-88.10416, 30.499135], [-88.137022, 30.318396], [-88.394438, 30.367688], [-88.471115, 31.895754], [-88.241084, 33.796253], [-88.098683, 34.891641], [-88.202745, 34.995703], [-87.359296, 35.00118]]]
  	}
  }, {
  	type: "Feature",
  	id: "02",
  	properties: {
  		name: "Alaska"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-131.602021, 55.117982], [-131.569159, 55.28229], [-131.355558, 55.183705], [-131.38842, 55.01392], [-131.645836, 55.035827], [-131.602021, 55.117982]]], [[[-131.832052, 55.42469], [-131.645836, 55.304197], [-131.749898, 55.128935], [-131.832052, 55.189182], [-131.832052, 55.42469]]], [[[-132.976733, 56.437924], [-132.735747, 56.459832], [-132.631685, 56.421493], [-132.664547, 56.273616], [-132.878148, 56.240754], [-133.069841, 56.333862], [-132.976733, 56.437924]]], [[[-133.595627, 56.350293], [-133.162949, 56.317431], [-133.05341, 56.125739], [-132.620732, 55.912138], [-132.472854, 55.780691], [-132.4619, 55.671152], [-132.357838, 55.649245], [-132.341408, 55.506844], [-132.166146, 55.364444], [-132.144238, 55.238474], [-132.029222, 55.276813], [-131.97993, 55.178228], [-131.958022, 54.789365], [-132.029222, 54.701734], [-132.308546, 54.718165], [-132.385223, 54.915335], [-132.483808, 54.898904], [-132.686455, 55.046781], [-132.746701, 54.997489], [-132.916486, 55.046781], [-132.889102, 54.898904], [-132.73027, 54.937242], [-132.626209, 54.882473], [-132.675501, 54.679826], [-132.867194, 54.701734], [-133.157472, 54.95915], [-133.239626, 55.090597], [-133.223195, 55.22752], [-133.453227, 55.216566], [-133.453227, 55.320628], [-133.277964, 55.331582], [-133.102702, 55.42469], [-133.17938, 55.588998], [-133.387503, 55.62186], [-133.420365, 55.884753], [-133.497042, 56.0162], [-133.639442, 55.923092], [-133.694212, 56.070969], [-133.546335, 56.142169], [-133.666827, 56.311955], [-133.595627, 56.350293]]], [[[-133.738027, 55.556137], [-133.546335, 55.490413], [-133.414888, 55.572568], [-133.283441, 55.534229], [-133.420365, 55.386352], [-133.633966, 55.430167], [-133.738027, 55.556137]]], [[[-133.907813, 56.930849], [-134.050213, 57.029434], [-133.885905, 57.095157], [-133.343688, 57.002049], [-133.102702, 57.007526], [-132.932917, 56.82131], [-132.620732, 56.667956], [-132.653593, 56.55294], [-132.817901, 56.492694], [-133.042456, 56.520078], [-133.201287, 56.448878], [-133.420365, 56.492694], [-133.66135, 56.448878], [-133.710643, 56.684386], [-133.688735, 56.837741], [-133.869474, 56.843218], [-133.907813, 56.930849]]], [[[-134.115936, 56.48174], [-134.25286, 56.558417], [-134.400737, 56.722725], [-134.417168, 56.848695], [-134.296675, 56.908941], [-134.170706, 56.848695], [-134.143321, 56.952757], [-133.748981, 56.772017], [-133.710643, 56.596755], [-133.847566, 56.574848], [-133.935197, 56.377678], [-133.836612, 56.322908], [-133.957105, 56.092877], [-134.110459, 56.142169], [-134.132367, 55.999769], [-134.230952, 56.070969], [-134.291198, 56.350293], [-134.115936, 56.48174]]], [[[-134.636246, 56.28457], [-134.669107, 56.169554], [-134.806031, 56.235277], [-135.178463, 56.67891], [-135.413971, 56.810356], [-135.331817, 56.914418], [-135.424925, 57.166357], [-135.687818, 57.369004], [-135.419448, 57.566174], [-135.298955, 57.48402], [-135.063447, 57.418296], [-134.849846, 57.407343], [-134.844369, 57.248511], [-134.636246, 56.728202], [-134.636246, 56.28457]]], [[[-134.712923, 58.223407], [-134.373353, 58.14673], [-134.176183, 58.157683], [-134.187137, 58.081006], [-133.902336, 57.807159], [-134.099505, 57.850975], [-134.148798, 57.757867], [-133.935197, 57.615466], [-133.869474, 57.363527], [-134.083075, 57.297804], [-134.154275, 57.210173], [-134.499322, 57.029434], [-134.603384, 57.034911], [-134.6472, 57.226604], [-134.575999, 57.341619], [-134.608861, 57.511404], [-134.729354, 57.719528], [-134.707446, 57.829067], [-134.784123, 58.097437], [-134.91557, 58.212453], [-134.953908, 58.409623], [-134.712923, 58.223407]]], [[[-135.857603, 57.330665], [-135.715203, 57.330665], [-135.567326, 57.149926], [-135.633049, 57.023957], [-135.857603, 56.996572], [-135.824742, 57.193742], [-135.857603, 57.330665]]], [[[-136.279328, 58.206976], [-135.978096, 58.201499], [-135.780926, 58.28913], [-135.496125, 58.168637], [-135.64948, 58.037191], [-135.59471, 57.987898], [-135.45231, 58.135776], [-135.107263, 58.086483], [-134.91557, 57.976944], [-135.025108, 57.779775], [-134.937477, 57.763344], [-134.822462, 57.500451], [-135.085355, 57.462112], [-135.572802, 57.675713], [-135.556372, 57.456635], [-135.709726, 57.369004], [-135.890465, 57.407343], [-136.000004, 57.544266], [-136.208128, 57.637374], [-136.366959, 57.829067], [-136.569606, 57.916698], [-136.558652, 58.075529], [-136.421728, 58.130299], [-136.377913, 58.267222], [-136.279328, 58.206976]]], [[[-147.079854, 60.200582], [-147.501579, 59.948643], [-147.53444, 59.850058], [-147.874011, 59.784335], [-147.80281, 59.937689], [-147.435855, 60.09652], [-147.205824, 60.271782], [-147.079854, 60.200582]]], [[[-147.561825, 60.578491], [-147.616594, 60.370367], [-147.758995, 60.156767], [-147.956165, 60.227967], [-147.791856, 60.474429], [-147.561825, 60.578491]]], [[[-147.786379, 70.245291], [-147.682318, 70.201475], [-147.162008, 70.15766], [-146.888161, 70.185044], [-146.510252, 70.185044], [-146.099482, 70.146706], [-145.858496, 70.168614], [-145.622988, 70.08646], [-145.195787, 69.993352], [-144.620708, 69.971444], [-144.461877, 70.026213], [-144.078491, 70.059075], [-143.914183, 70.130275], [-143.497935, 70.141229], [-143.503412, 70.091936], [-143.25695, 70.119321], [-142.747594, 70.042644], [-142.402547, 69.916674], [-142.079408, 69.856428], [-142.008207, 69.801659], [-141.712453, 69.790705], [-141.433129, 69.697597], [-141.378359, 69.63735], [-141.208574, 69.686643], [-141.00045, 69.648304], [-141.00045, 60.304644], [-140.53491, 60.22249], [-140.474664, 60.310121], [-139.987216, 60.184151], [-139.696939, 60.342983], [-139.088998, 60.359413], [-139.198537, 60.091043], [-139.045183, 59.997935], [-138.700135, 59.910304], [-138.623458, 59.767904], [-137.604747, 59.242118], [-137.445916, 58.908024], [-137.265177, 59.001132], [-136.827022, 59.159963], [-136.580559, 59.16544], [-136.465544, 59.285933], [-136.476498, 59.466672], [-136.301236, 59.466672], [-136.25742, 59.625503], [-135.945234, 59.663842], [-135.479694, 59.800766], [-135.025108, 59.565257], [-135.068924, 59.422857], [-134.959385, 59.280456], [-134.701969, 59.247595], [-134.378829, 59.033994], [-134.400737, 58.973748], [-134.25286, 58.858732], [-133.842089, 58.727285], [-133.173903, 58.152206], [-133.075318, 57.998852], [-132.867194, 57.845498], [-132.560485, 57.505928], [-132.253777, 57.21565], [-132.368792, 57.095157], [-132.05113, 57.051341], [-132.127807, 56.876079], [-131.870391, 56.804879], [-131.837529, 56.602232], [-131.580113, 56.613186], [-131.087188, 56.405062], [-130.78048, 56.366724], [-130.621648, 56.268139], [-130.468294, 56.240754], [-130.424478, 56.142169], [-130.101339, 56.114785], [-130.002754, 55.994292], [-130.150631, 55.769737], [-130.128724, 55.583521], [-129.986323, 55.276813], [-130.095862, 55.200136], [-130.336847, 54.920812], [-130.687372, 54.718165], [-130.785957, 54.822227], [-130.917403, 54.789365], [-131.010511, 54.997489], [-130.983126, 55.08512], [-131.092665, 55.189182], [-130.862634, 55.298721], [-130.928357, 55.337059], [-131.158389, 55.200136], [-131.284358, 55.287767], [-131.426759, 55.238474], [-131.843006, 55.457552], [-131.700606, 55.698537], [-131.963499, 55.616383], [-131.974453, 55.49589], [-132.182576, 55.588998], [-132.226392, 55.704014], [-132.083991, 55.829984], [-132.127807, 55.955953], [-132.324977, 55.851892], [-132.522147, 56.076446], [-132.642639, 56.032631], [-132.719317, 56.218847], [-132.527624, 56.339339], [-132.341408, 56.339339], [-132.396177, 56.487217], [-132.297592, 56.67891], [-132.450946, 56.673433], [-132.768609, 56.837741], [-132.993164, 57.034911], [-133.51895, 57.177311], [-133.507996, 57.577128], [-133.677781, 57.62642], [-133.639442, 57.790728], [-133.814705, 57.834544], [-134.072121, 58.053622], [-134.143321, 58.168637], [-134.586953, 58.206976], [-135.074401, 58.502731], [-135.282525, 59.192825], [-135.38111, 59.033994], [-135.337294, 58.891593], [-135.140124, 58.617746], [-135.189417, 58.573931], [-135.05797, 58.349376], [-135.085355, 58.201499], [-135.277048, 58.234361], [-135.430402, 58.398669], [-135.633049, 58.426053], [-135.91785, 58.382238], [-135.912373, 58.617746], [-136.087635, 58.814916], [-136.246466, 58.75467], [-136.876314, 58.962794], [-136.931084, 58.902547], [-136.586036, 58.836824], [-136.317666, 58.672516], [-136.213604, 58.667039], [-136.180743, 58.535592], [-136.043819, 58.382238], [-136.388867, 58.294607], [-136.591513, 58.349376], [-136.59699, 58.212453], [-136.859883, 58.316515], [-136.947514, 58.393192], [-137.111823, 58.393192], [-137.566409, 58.590362], [-137.900502, 58.765624], [-137.933364, 58.869686], [-138.11958, 59.02304], [-138.634412, 59.132579], [-138.919213, 59.247595], [-139.417615, 59.379041], [-139.746231, 59.505011], [-139.718846, 59.641934], [-139.625738, 59.598119], [-139.5162, 59.68575], [-139.625738, 59.88292], [-139.488815, 59.992458], [-139.554538, 60.041751], [-139.801, 59.833627], [-140.315833, 59.696704], [-140.92925, 59.745996], [-141.444083, 59.871966], [-141.46599, 59.970551], [-141.706976, 59.948643], [-141.964392, 60.019843], [-142.539471, 60.085566], [-142.873564, 60.091043], [-143.623905, 60.036274], [-143.892275, 59.997935], [-144.231845, 60.140336], [-144.65357, 60.206059], [-144.785016, 60.29369], [-144.834309, 60.441568], [-145.124586, 60.430614], [-145.223171, 60.299167], [-145.738004, 60.474429], [-145.820158, 60.551106], [-146.351421, 60.408706], [-146.608837, 60.238921], [-146.718376, 60.397752], [-146.608837, 60.485383], [-146.455483, 60.463475], [-145.951604, 60.578491], [-146.017328, 60.666122], [-146.252836, 60.622307], [-146.345944, 60.737322], [-146.565022, 60.753753], [-146.784099, 61.044031], [-146.866253, 60.972831], [-147.172962, 60.934492], [-147.271547, 60.972831], [-147.375609, 60.879723], [-147.758995, 60.912584], [-147.775426, 60.808523], [-148.032842, 60.781138], [-148.153334, 60.819476], [-148.065703, 61.005692], [-148.175242, 61.000215], [-148.350504, 60.803046], [-148.109519, 60.737322], [-148.087611, 60.594922], [-147.939734, 60.441568], [-148.027365, 60.277259], [-148.219058, 60.332029], [-148.273827, 60.249875], [-148.087611, 60.217013], [-147.983549, 59.997935], [-148.251919, 59.95412], [-148.399797, 59.997935], [-148.635305, 59.937689], [-148.755798, 59.986981], [-149.067984, 59.981505], [-149.05703, 60.063659], [-149.204907, 60.008889], [-149.287061, 59.904827], [-149.418508, 59.997935], [-149.582816, 59.866489], [-149.511616, 59.806242], [-149.741647, 59.729565], [-149.949771, 59.718611], [-150.031925, 59.61455], [-150.25648, 59.521442], [-150.409834, 59.554303], [-150.579619, 59.444764], [-150.716543, 59.450241], [-151.001343, 59.225687], [-151.308052, 59.209256], [-151.406637, 59.280456], [-151.592853, 59.159963], [-151.976239, 59.253071], [-151.888608, 59.422857], [-151.636669, 59.483103], [-151.47236, 59.472149], [-151.423068, 59.537872], [-151.127313, 59.669319], [-151.116359, 59.778858], [-151.505222, 59.63098], [-151.828361, 59.718611], [-151.8667, 59.778858], [-151.702392, 60.030797], [-151.423068, 60.211536], [-151.379252, 60.359413], [-151.297098, 60.386798], [-151.264237, 60.545629], [-151.406637, 60.720892], [-151.06159, 60.786615], [-150.404357, 61.038554], [-150.245526, 60.939969], [-150.042879, 60.912584], [-149.741647, 61.016646], [-150.075741, 61.15357], [-150.207187, 61.257632], [-150.47008, 61.246678], [-150.656296, 61.29597], [-150.711066, 61.252155], [-151.023251, 61.180954], [-151.165652, 61.044031], [-151.477837, 61.011169], [-151.800977, 60.852338], [-151.833838, 60.748276], [-152.080301, 60.693507], [-152.13507, 60.578491], [-152.310332, 60.507291], [-152.392486, 60.304644], [-152.732057, 60.173197], [-152.567748, 60.069136], [-152.704672, 59.915781], [-153.022334, 59.888397], [-153.049719, 59.691227], [-153.345474, 59.620026], [-153.438582, 59.702181], [-153.586459, 59.548826], [-153.761721, 59.543349], [-153.72886, 59.433811], [-154.117723, 59.368087], [-154.1944, 59.066856], [-153.750768, 59.050425], [-153.400243, 58.968271], [-153.301658, 58.869686], [-153.444059, 58.710854], [-153.679567, 58.612269], [-153.898645, 58.606793], [-153.920553, 58.519161], [-154.062953, 58.4863], [-153.99723, 58.376761], [-154.145107, 58.212453], [-154.46277, 58.059098], [-154.643509, 58.059098], [-154.818771, 58.004329], [-154.988556, 58.015283], [-155.120003, 57.955037], [-155.081664, 57.872883], [-155.328126, 57.829067], [-155.377419, 57.708574], [-155.547204, 57.785251], [-155.73342, 57.549743], [-156.045606, 57.566174], [-156.023698, 57.440204], [-156.209914, 57.473066], [-156.34136, 57.418296], [-156.34136, 57.248511], [-156.549484, 56.985618], [-156.883577, 56.952757], [-157.157424, 56.832264], [-157.20124, 56.766541], [-157.376502, 56.859649], [-157.672257, 56.607709], [-157.754411, 56.67891], [-157.918719, 56.657002], [-157.957058, 56.514601], [-158.126843, 56.459832], [-158.32949, 56.48174], [-158.488321, 56.339339], [-158.208997, 56.295524], [-158.510229, 55.977861], [-159.375585, 55.873799], [-159.616571, 55.594475], [-159.676817, 55.654722], [-159.643955, 55.829984], [-159.813741, 55.857368], [-160.027341, 55.791645], [-160.060203, 55.720445], [-160.394296, 55.605429], [-160.536697, 55.473983], [-160.580512, 55.567091], [-160.668143, 55.457552], [-160.865313, 55.528752], [-161.232268, 55.358967], [-161.506115, 55.364444], [-161.467776, 55.49589], [-161.588269, 55.62186], [-161.697808, 55.517798], [-161.686854, 55.408259], [-162.053809, 55.074166], [-162.179779, 55.15632], [-162.218117, 55.03035], [-162.470057, 55.052258], [-162.508395, 55.249428], [-162.661749, 55.293244], [-162.716519, 55.222043], [-162.579595, 55.134412], [-162.645319, 54.997489], [-162.847965, 54.926289], [-163.00132, 55.079643], [-163.187536, 55.090597], [-163.220397, 55.03035], [-163.034181, 54.942719], [-163.373752, 54.800319], [-163.14372, 54.76198], [-163.138243, 54.696257], [-163.329936, 54.74555], [-163.587352, 54.614103], [-164.085754, 54.61958], [-164.332216, 54.531949], [-164.354124, 54.466226], [-164.638925, 54.389548], [-164.847049, 54.416933], [-164.918249, 54.603149], [-164.710125, 54.663395], [-164.551294, 54.88795], [-164.34317, 54.893427], [-163.894061, 55.041304], [-163.532583, 55.046781], [-163.39566, 54.904381], [-163.291598, 55.008443], [-163.313505, 55.128935], [-163.105382, 55.183705], [-162.880827, 55.183705], [-162.579595, 55.446598], [-162.245502, 55.682106], [-161.807347, 55.89023], [-161.292514, 55.983338], [-161.078914, 55.939523], [-160.87079, 55.999769], [-160.816021, 55.912138], [-160.931036, 55.813553], [-160.805067, 55.736876], [-160.766728, 55.857368], [-160.509312, 55.868322], [-160.438112, 55.791645], [-160.27928, 55.76426], [-160.273803, 55.857368], [-160.536697, 55.939523], [-160.558604, 55.994292], [-160.383342, 56.251708], [-160.147834, 56.399586], [-159.830171, 56.541986], [-159.326293, 56.667956], [-158.959338, 56.848695], [-158.784076, 56.782971], [-158.641675, 56.810356], [-158.701922, 56.925372], [-158.658106, 57.034911], [-158.378782, 57.264942], [-157.995396, 57.41282], [-157.688688, 57.609989], [-157.705118, 57.719528], [-157.458656, 58.497254], [-157.07527, 58.705377], [-157.119086, 58.869686], [-158.039212, 58.634177], [-158.32949, 58.661562], [-158.40069, 58.760147], [-158.564998, 58.803962], [-158.619768, 58.913501], [-158.767645, 58.864209], [-158.860753, 58.694424], [-158.701922, 58.480823], [-158.893615, 58.387715], [-159.0634, 58.420577], [-159.392016, 58.760147], [-159.616571, 58.929932], [-159.731586, 58.929932], [-159.808264, 58.803962], [-159.906848, 58.782055], [-160.054726, 58.886116], [-160.235465, 58.902547], [-160.317619, 59.072332], [-160.854359, 58.88064], [-161.33633, 58.743716], [-161.374669, 58.667039], [-161.752577, 58.552023], [-161.938793, 58.656085], [-161.769008, 58.776578], [-161.829255, 59.061379], [-161.955224, 59.36261], [-161.703285, 59.48858], [-161.911409, 59.740519], [-162.092148, 59.88292], [-162.234548, 60.091043], [-162.448149, 60.178674], [-162.502918, 59.997935], [-162.760334, 59.959597], [-163.171105, 59.844581], [-163.66403, 59.795289], [-163.9324, 59.806242], [-164.162431, 59.866489], [-164.189816, 60.02532], [-164.386986, 60.074613], [-164.699171, 60.29369], [-164.962064, 60.337506], [-165.268773, 60.578491], [-165.060649, 60.68803], [-165.016834, 60.890677], [-165.175665, 60.846861], [-165.197573, 60.972831], [-165.120896, 61.076893], [-165.323543, 61.170001], [-165.34545, 61.071416], [-165.591913, 61.109754], [-165.624774, 61.279539], [-165.816467, 61.301447], [-165.920529, 61.416463], [-165.915052, 61.558863], [-166.106745, 61.49314], [-166.139607, 61.630064], [-165.904098, 61.662925], [-166.095791, 61.81628], [-165.756221, 61.827233], [-165.756221, 62.013449], [-165.674067, 62.139419], [-165.044219, 62.539236], [-164.912772, 62.659728], [-164.819664, 62.637821], [-164.874433, 62.807606], [-164.633448, 63.097884], [-164.425324, 63.212899], [-164.036462, 63.262192], [-163.73523, 63.212899], [-163.313505, 63.037637], [-163.039658, 63.059545], [-162.661749, 63.22933], [-162.272887, 63.486746], [-162.075717, 63.514131], [-162.026424, 63.448408], [-161.555408, 63.448408], [-161.13916, 63.503177], [-160.766728, 63.771547], [-160.766728, 63.837271], [-160.952944, 64.08921], [-160.974852, 64.237087], [-161.26513, 64.395918], [-161.374669, 64.532842], [-161.078914, 64.494503], [-160.79959, 64.609519], [-160.783159, 64.719058], [-161.144637, 64.921705], [-161.413007, 64.762873], [-161.664946, 64.790258], [-161.900455, 64.702627], [-162.168825, 64.680719], [-162.234548, 64.620473], [-162.541257, 64.532842], [-162.634365, 64.384965], [-162.787719, 64.324718], [-162.858919, 64.49998], [-163.045135, 64.538319], [-163.176582, 64.401395], [-163.253259, 64.467119], [-163.598306, 64.565704], [-164.304832, 64.560227], [-164.80871, 64.450688], [-165.000403, 64.434257], [-165.411174, 64.49998], [-166.188899, 64.576658], [-166.391546, 64.636904], [-166.484654, 64.735489], [-166.413454, 64.872412], [-166.692778, 64.987428], [-166.638008, 65.113398], [-166.462746, 65.179121], [-166.517516, 65.337952], [-166.796839, 65.337952], [-167.026871, 65.381768], [-167.47598, 65.414629], [-167.711489, 65.496784], [-168.072967, 65.578938], [-168.105828, 65.682999], [-167.541703, 65.819923], [-166.829701, 66.049954], [-166.3313, 66.186878], [-166.046499, 66.110201], [-165.756221, 66.09377], [-165.690498, 66.203309], [-165.86576, 66.21974], [-165.88219, 66.312848], [-165.186619, 66.466202], [-164.403417, 66.581218], [-163.981692, 66.592172], [-163.751661, 66.553833], [-163.872153, 66.389525], [-163.828338, 66.274509], [-163.915969, 66.192355], [-163.768091, 66.060908], [-163.494244, 66.082816], [-163.149197, 66.060908], [-162.749381, 66.088293], [-162.634365, 66.039001], [-162.371472, 66.028047], [-162.14144, 66.077339], [-161.840208, 66.02257], [-161.549931, 66.241647], [-161.341807, 66.252601], [-161.199406, 66.208786], [-161.128206, 66.334755], [-161.528023, 66.395002], [-161.911409, 66.345709], [-161.87307, 66.510017], [-162.174302, 66.68528], [-162.502918, 66.740049], [-162.601503, 66.89888], [-162.344087, 66.937219], [-162.015471, 66.778388], [-162.075717, 66.652418], [-161.916886, 66.553833], [-161.571838, 66.438817], [-161.489684, 66.55931], [-161.884024, 66.718141], [-161.714239, 67.002942], [-161.851162, 67.052235], [-162.240025, 66.991988], [-162.639842, 67.008419], [-162.700088, 67.057712], [-162.902735, 67.008419], [-163.740707, 67.128912], [-163.757138, 67.254881], [-164.009077, 67.534205], [-164.211724, 67.638267], [-164.534863, 67.725898], [-165.192096, 67.966884], [-165.493328, 68.059992], [-165.794559, 68.081899], [-166.243668, 68.246208], [-166.681824, 68.339316], [-166.703731, 68.372177], [-166.375115, 68.42147], [-166.227238, 68.574824], [-166.216284, 68.881533], [-165.329019, 68.859625], [-164.255539, 68.930825], [-163.976215, 68.985595], [-163.532583, 69.138949], [-163.110859, 69.374457], [-163.023228, 69.609966], [-162.842489, 69.812613], [-162.470057, 69.982398], [-162.311225, 70.108367], [-161.851162, 70.311014], [-161.779962, 70.256245], [-161.396576, 70.239814], [-160.837928, 70.343876], [-160.487404, 70.453415], [-159.649432, 70.792985], [-159.33177, 70.809416], [-159.298908, 70.760123], [-158.975769, 70.798462], [-158.658106, 70.787508], [-158.033735, 70.831323], [-157.420318, 70.979201], [-156.812377, 71.285909], [-156.565915, 71.351633], [-156.522099, 71.296863], [-155.585543, 71.170894], [-155.508865, 71.083263], [-155.832005, 70.968247], [-155.979882, 70.96277], [-155.974405, 70.809416], [-155.503388, 70.858708], [-155.476004, 70.940862], [-155.262403, 71.017539], [-155.191203, 70.973724], [-155.032372, 71.148986], [-154.566832, 70.990155], [-154.643509, 70.869662], [-154.353231, 70.8368], [-154.183446, 70.7656], [-153.931507, 70.880616], [-153.487874, 70.886093], [-153.235935, 70.924431], [-152.589656, 70.886093], [-152.26104, 70.842277], [-152.419871, 70.606769], [-151.817408, 70.546523], [-151.773592, 70.486276], [-151.187559, 70.382214], [-151.182082, 70.431507], [-150.760358, 70.49723], [-150.355064, 70.491753], [-150.349588, 70.436984], [-150.114079, 70.431507], [-149.867617, 70.508184], [-149.462323, 70.519138], [-149.177522, 70.486276], [-148.78866, 70.404122], [-148.607921, 70.420553], [-148.350504, 70.305537], [-148.202627, 70.349353], [-147.961642, 70.316491], [-147.786379, 70.245291]]], [[[-152.94018, 58.026237], [-152.945657, 57.982421], [-153.290705, 58.048145], [-153.044242, 58.305561], [-152.819688, 58.327469], [-152.666333, 58.562977], [-152.496548, 58.354853], [-152.354148, 58.426053], [-152.080301, 58.311038], [-152.080301, 58.152206], [-152.480117, 58.130299], [-152.655379, 58.059098], [-152.94018, 58.026237]]], [[[-153.958891, 57.538789], [-153.67409, 57.670236], [-153.931507, 57.69762], [-153.936983, 57.812636], [-153.723383, 57.889313], [-153.570028, 57.834544], [-153.548121, 57.719528], [-153.46049, 57.796205], [-153.455013, 57.96599], [-153.268797, 57.889313], [-153.235935, 57.998852], [-153.071627, 57.933129], [-152.874457, 57.933129], [-152.721103, 57.993375], [-152.469163, 57.889313], [-152.469163, 57.599035], [-152.151501, 57.620943], [-152.359625, 57.42925], [-152.74301, 57.505928], [-152.60061, 57.379958], [-152.710149, 57.275896], [-152.907319, 57.325188], [-152.912796, 57.128019], [-153.214027, 57.073249], [-153.312612, 56.991095], [-153.498828, 57.067772], [-153.695998, 56.859649], [-153.849352, 56.837741], [-154.013661, 56.744633], [-154.073907, 56.969187], [-154.303938, 56.848695], [-154.314892, 56.919895], [-154.523016, 56.991095], [-154.539447, 57.193742], [-154.742094, 57.275896], [-154.627078, 57.511404], [-154.227261, 57.659282], [-153.980799, 57.648328], [-153.958891, 57.538789]]], [[[-154.53397, 56.602232], [-154.742094, 56.399586], [-154.807817, 56.432447], [-154.53397, 56.602232]]], [[[-155.634835, 55.923092], [-155.476004, 55.912138], [-155.530773, 55.704014], [-155.793666, 55.731399], [-155.837482, 55.802599], [-155.634835, 55.923092]]], [[[-159.890418, 55.28229], [-159.950664, 55.068689], [-160.257373, 54.893427], [-160.109495, 55.161797], [-160.005433, 55.134412], [-159.890418, 55.28229]]], [[[-160.520266, 55.358967], [-160.33405, 55.358967], [-160.339527, 55.249428], [-160.525743, 55.128935], [-160.690051, 55.211089], [-160.794113, 55.134412], [-160.854359, 55.320628], [-160.79959, 55.380875], [-160.520266, 55.358967]]], [[[-162.256456, 54.981058], [-162.234548, 54.893427], [-162.349564, 54.838658], [-162.437195, 54.931766], [-162.256456, 54.981058]]], [[[-162.415287, 63.634624], [-162.563165, 63.536039], [-162.612457, 63.62367], [-162.415287, 63.634624]]], [[[-162.80415, 54.488133], [-162.590549, 54.449795], [-162.612457, 54.367641], [-162.782242, 54.373118], [-162.80415, 54.488133]]], [[[-165.548097, 54.29644], [-165.476897, 54.181425], [-165.630251, 54.132132], [-165.685021, 54.252625], [-165.548097, 54.29644]]], [[[-165.73979, 54.15404], [-166.046499, 54.044501], [-166.112222, 54.121178], [-165.980775, 54.219763], [-165.73979, 54.15404]]], [[[-166.364161, 60.359413], [-166.13413, 60.397752], [-166.084837, 60.326552], [-165.88219, 60.342983], [-165.685021, 60.277259], [-165.646682, 59.992458], [-165.750744, 59.89935], [-166.00816, 59.844581], [-166.062929, 59.745996], [-166.440838, 59.855535], [-166.6161, 59.850058], [-166.994009, 59.992458], [-167.125456, 59.992458], [-167.344534, 60.074613], [-167.421211, 60.206059], [-167.311672, 60.238921], [-166.93924, 60.206059], [-166.763978, 60.310121], [-166.577762, 60.321075], [-166.495608, 60.392275], [-166.364161, 60.359413]]], [[[-166.375115, 54.01164], [-166.210807, 53.934962], [-166.5449, 53.748746], [-166.539423, 53.715885], [-166.117699, 53.852808], [-166.112222, 53.776131], [-166.282007, 53.683023], [-166.555854, 53.622777], [-166.583239, 53.529669], [-166.878994, 53.431084], [-167.13641, 53.425607], [-167.306195, 53.332499], [-167.623857, 53.250345], [-167.793643, 53.337976], [-167.459549, 53.442038], [-167.355487, 53.425607], [-167.103548, 53.513238], [-167.163794, 53.611823], [-167.021394, 53.715885], [-166.807793, 53.666592], [-166.785886, 53.732316], [-167.015917, 53.754223], [-167.141887, 53.825424], [-167.032348, 53.945916], [-166.643485, 54.017116], [-166.561331, 53.880193], [-166.375115, 54.01164]]], [[[-168.790446, 53.157237], [-168.40706, 53.34893], [-168.385152, 53.431084], [-168.237275, 53.524192], [-168.007243, 53.568007], [-167.886751, 53.518715], [-167.842935, 53.387268], [-168.270136, 53.244868], [-168.500168, 53.036744], [-168.686384, 52.965544], [-168.790446, 53.157237]]], [[[-169.74891, 52.894344], [-169.705095, 52.795759], [-169.962511, 52.790282], [-169.989896, 52.856005], [-169.74891, 52.894344]]], [[[-170.148727, 57.221127], [-170.28565, 57.128019], [-170.313035, 57.221127], [-170.148727, 57.221127]]], [[[-170.669036, 52.697174], [-170.603313, 52.604066], [-170.789529, 52.538343], [-170.816914, 52.636928], [-170.669036, 52.697174]]], [[[-171.742517, 63.716778], [-170.94836, 63.5689], [-170.488297, 63.69487], [-170.280174, 63.683916], [-170.093958, 63.612716], [-170.044665, 63.492223], [-169.644848, 63.4265], [-169.518879, 63.366254], [-168.99857, 63.338869], [-168.686384, 63.295053], [-168.856169, 63.147176], [-169.108108, 63.180038], [-169.376478, 63.152653], [-169.513402, 63.08693], [-169.639372, 62.939052], [-169.831064, 63.075976], [-170.055619, 63.169084], [-170.263743, 63.180038], [-170.362328, 63.2841], [-170.866206, 63.415546], [-171.101715, 63.421023], [-171.463193, 63.306007], [-171.73704, 63.366254], [-171.852055, 63.486746], [-171.742517, 63.716778]]], [[[-172.432611, 52.390465], [-172.41618, 52.275449], [-172.607873, 52.253542], [-172.569535, 52.352127], [-172.432611, 52.390465]]], [[[-173.626584, 52.14948], [-173.495138, 52.105664], [-173.122706, 52.111141], [-173.106275, 52.07828], [-173.549907, 52.028987], [-173.626584, 52.14948]]], [[[-174.322156, 52.280926], [-174.327632, 52.379511], [-174.185232, 52.41785], [-173.982585, 52.319265], [-174.059262, 52.226157], [-174.179755, 52.231634], [-174.141417, 52.127572], [-174.333109, 52.116618], [-174.738403, 52.007079], [-174.968435, 52.039941], [-174.902711, 52.116618], [-174.656249, 52.105664], [-174.322156, 52.280926]]], [[[-176.469116, 51.853725], [-176.288377, 51.870156], [-176.288377, 51.744186], [-176.518409, 51.760617], [-176.80321, 51.61274], [-176.912748, 51.80991], [-176.792256, 51.815386], [-176.775825, 51.963264], [-176.627947, 51.968741], [-176.627947, 51.859202], [-176.469116, 51.853725]]], [[[-177.153734, 51.946833], [-177.044195, 51.897541], [-177.120872, 51.727755], [-177.274226, 51.678463], [-177.279703, 51.782525], [-177.153734, 51.946833]]], [[[-178.123152, 51.919448], [-177.953367, 51.913971], [-177.800013, 51.793479], [-177.964321, 51.651078], [-178.123152, 51.919448]]], [[[173.107557, 52.992929], [173.293773, 52.927205], [173.304726, 52.823143], [172.90491, 52.762897], [172.642017, 52.927205], [172.642017, 53.003883], [173.107557, 52.992929]]]]
  	}
  }, {
  	type: "Feature",
  	id: "04",
  	properties: {
  		name: "Arizona"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-109.042503, 37.000263], [-109.04798, 31.331629], [-111.074448, 31.331629], [-112.246513, 31.704061], [-114.815198, 32.492741], [-114.72209, 32.717295], [-114.524921, 32.755634], [-114.470151, 32.843265], [-114.524921, 33.029481], [-114.661844, 33.034958], [-114.727567, 33.40739], [-114.524921, 33.54979], [-114.497536, 33.697668], [-114.535874, 33.933176], [-114.415382, 34.108438], [-114.256551, 34.174162], [-114.136058, 34.305608], [-114.333228, 34.448009], [-114.470151, 34.710902], [-114.634459, 34.87521], [-114.634459, 35.00118], [-114.574213, 35.138103], [-114.596121, 35.324319], [-114.678275, 35.516012], [-114.738521, 36.102045], [-114.371566, 36.140383], [-114.251074, 36.01989], [-114.152489, 36.025367], [-114.048427, 36.195153], [-114.048427, 37.000263], [-110.499369, 37.00574], [-109.042503, 37.000263]]]
  	}
  }, {
  	type: "Feature",
  	id: "05",
  	properties: {
  		name: "Arkansas"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-94.473842, 36.501861], [-90.152536, 36.496384], [-90.064905, 36.304691], [-90.218259, 36.184199], [-90.377091, 35.997983], [-89.730812, 35.997983], [-89.763673, 35.811767], [-89.911551, 35.756997], [-89.944412, 35.603643], [-90.130628, 35.439335], [-90.114197, 35.198349], [-90.212782, 35.023087], [-90.311367, 34.995703], [-90.251121, 34.908072], [-90.409952, 34.831394], [-90.481152, 34.661609], [-90.585214, 34.617794], [-90.568783, 34.420624], [-90.749522, 34.365854], [-90.744046, 34.300131], [-90.952169, 34.135823], [-90.891923, 34.026284], [-91.072662, 33.867453], [-91.231493, 33.560744], [-91.056231, 33.429298], [-91.143862, 33.347144], [-91.089093, 33.13902], [-91.16577, 33.002096], [-93.608485, 33.018527], [-94.041164, 33.018527], [-94.041164, 33.54979], [-94.183564, 33.593606], [-94.380734, 33.544313], [-94.484796, 33.637421], [-94.430026, 35.395519], [-94.616242, 36.501861], [-94.473842, 36.501861]]]
  	}
  }, {
  	type: "Feature",
  	id: "06",
  	properties: {
  		name: "California"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-123.233256, 42.006186], [-122.378853, 42.011663], [-121.037003, 41.995232], [-120.001861, 41.995232], [-119.996384, 40.264519], [-120.001861, 38.999346], [-118.71478, 38.101128], [-117.498899, 37.21934], [-116.540435, 36.501861], [-115.85034, 35.970598], [-114.634459, 35.00118], [-114.634459, 34.87521], [-114.470151, 34.710902], [-114.333228, 34.448009], [-114.136058, 34.305608], [-114.256551, 34.174162], [-114.415382, 34.108438], [-114.535874, 33.933176], [-114.497536, 33.697668], [-114.524921, 33.54979], [-114.727567, 33.40739], [-114.661844, 33.034958], [-114.524921, 33.029481], [-114.470151, 32.843265], [-114.524921, 32.755634], [-114.72209, 32.717295], [-116.04751, 32.624187], [-117.126467, 32.536556], [-117.24696, 32.668003], [-117.252437, 32.876127], [-117.329114, 33.122589], [-117.471515, 33.297851], [-117.7837, 33.538836], [-118.183517, 33.763391], [-118.260194, 33.703145], [-118.413548, 33.741483], [-118.391641, 33.840068], [-118.566903, 34.042715], [-118.802411, 33.998899], [-119.218659, 34.146777], [-119.278905, 34.26727], [-119.558229, 34.415147], [-119.875891, 34.40967], [-120.138784, 34.475393], [-120.472878, 34.448009], [-120.64814, 34.579455], [-120.609801, 34.858779], [-120.670048, 34.902595], [-120.631709, 35.099764], [-120.894602, 35.247642], [-120.905556, 35.450289], [-121.004141, 35.461243], [-121.168449, 35.636505], [-121.283465, 35.674843], [-121.332757, 35.784382], [-121.716143, 36.195153], [-121.896882, 36.315645], [-121.935221, 36.638785], [-121.858544, 36.6114], [-121.787344, 36.803093], [-121.929744, 36.978355], [-122.105006, 36.956447], [-122.335038, 37.115279], [-122.417192, 37.241248], [-122.400761, 37.361741], [-122.515777, 37.520572], [-122.515777, 37.783465], [-122.329561, 37.783465], [-122.406238, 38.15042], [-122.488392, 38.112082], [-122.504823, 37.931343], [-122.701993, 37.893004], [-122.937501, 38.029928], [-122.97584, 38.265436], [-123.129194, 38.451652], [-123.331841, 38.566668], [-123.44138, 38.698114], [-123.737134, 38.95553], [-123.687842, 39.032208], [-123.824765, 39.366301], [-123.764519, 39.552517], [-123.85215, 39.831841], [-124.109566, 40.105688], [-124.361506, 40.259042], [-124.410798, 40.439781], [-124.158859, 40.877937], [-124.109566, 41.025814], [-124.158859, 41.14083], [-124.065751, 41.442061], [-124.147905, 41.715908], [-124.257444, 41.781632], [-124.213628, 42.000709], [-123.233256, 42.006186]]]
  	}
  }, {
  	type: "Feature",
  	id: "08",
  	properties: {
  		name: "Colorado"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-107.919731, 41.003906], [-105.728954, 40.998429], [-104.053011, 41.003906], [-102.053927, 41.003906], [-102.053927, 40.001626], [-102.042974, 36.994786], [-103.001438, 37.000263], [-104.337812, 36.994786], [-106.868158, 36.994786], [-107.421329, 37.000263], [-109.042503, 37.000263], [-109.042503, 38.166851], [-109.058934, 38.27639], [-109.053457, 39.125316], [-109.04798, 40.998429], [-107.919731, 41.003906]]]
  	}
  }, {
  	type: "Feature",
  	id: "09",
  	properties: {
  		name: "Connecticut"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-73.053528, 42.039048], [-71.799309, 42.022617], [-71.799309, 42.006186], [-71.799309, 41.414677], [-71.859555, 41.321569], [-71.947186, 41.338], [-72.385341, 41.261322], [-72.905651, 41.28323], [-73.130205, 41.146307], [-73.371191, 41.102491], [-73.655992, 40.987475], [-73.727192, 41.102491], [-73.48073, 41.21203], [-73.55193, 41.294184], [-73.486206, 42.050002], [-73.053528, 42.039048]]]
  	}
  }, {
  	type: "Feature",
  	id: "10",
  	properties: {
  		name: "Delaware"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-75.414089, 39.804456], [-75.507197, 39.683964], [-75.611259, 39.61824], [-75.589352, 39.459409], [-75.441474, 39.311532], [-75.403136, 39.065069], [-75.189535, 38.807653], [-75.09095, 38.796699], [-75.047134, 38.451652], [-75.693413, 38.462606], [-75.786521, 39.722302], [-75.616736, 39.831841], [-75.414089, 39.804456]]]
  	}
  }, {
  	type: "Feature",
  	id: "11",
  	properties: {
  		name: "District of Columbia"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-77.035264, 38.993869], [-76.909294, 38.895284], [-77.040741, 38.791222], [-77.117418, 38.933623], [-77.035264, 38.993869]]]
  	}
  }, {
  	type: "Feature",
  	id: "12",
  	properties: {
  		name: "Florida"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-85.497137, 30.997536], [-85.004212, 31.003013], [-84.867289, 30.712735], [-83.498053, 30.647012], [-82.216449, 30.570335], [-82.167157, 30.356734], [-82.046664, 30.362211], [-82.002849, 30.564858], [-82.041187, 30.751074], [-81.948079, 30.827751], [-81.718048, 30.745597], [-81.444201, 30.707258], [-81.383954, 30.27458], [-81.257985, 29.787132], [-80.967707, 29.14633], [-80.524075, 28.461713], [-80.589798, 28.41242], [-80.56789, 28.094758], [-80.381674, 27.738757], [-80.091397, 27.021277], [-80.03115, 26.796723], [-80.036627, 26.566691], [-80.146166, 25.739673], [-80.239274, 25.723243], [-80.337859, 25.465826], [-80.304997, 25.383672], [-80.49669, 25.197456], [-80.573367, 25.241272], [-80.759583, 25.164595], [-81.077246, 25.120779], [-81.170354, 25.224841], [-81.126538, 25.378195], [-81.351093, 25.821827], [-81.526355, 25.903982], [-81.679709, 25.843735], [-81.800202, 26.090198], [-81.833064, 26.292844], [-82.041187, 26.517399], [-82.09048, 26.665276], [-82.057618, 26.878877], [-82.172634, 26.917216], [-82.145249, 26.791246], [-82.249311, 26.758384], [-82.566974, 27.300601], [-82.692943, 27.437525], [-82.391711, 27.837342], [-82.588881, 27.815434], [-82.720328, 27.689464], [-82.851774, 27.886634], [-82.676512, 28.434328], [-82.643651, 28.888914], [-82.764143, 28.998453], [-82.802482, 29.14633], [-82.994175, 29.179192], [-83.218729, 29.420177], [-83.399469, 29.518762], [-83.410422, 29.66664], [-83.536392, 29.721409], [-83.640454, 29.885717], [-84.02384, 30.104795], [-84.357933, 30.055502], [-84.341502, 29.902148], [-84.451041, 29.929533], [-84.867289, 29.743317], [-85.310921, 29.699501], [-85.299967, 29.80904], [-85.404029, 29.940487], [-85.924338, 30.236241], [-86.29677, 30.362211], [-86.630863, 30.395073], [-86.910187, 30.373165], [-87.518128, 30.280057], [-87.37025, 30.427934], [-87.446927, 30.510088], [-87.408589, 30.674397], [-87.633143, 30.86609], [-87.600282, 30.997536], [-85.497137, 30.997536]]]
  	}
  }, {
  	type: "Feature",
  	id: "13",
  	properties: {
  		name: "Georgia"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-83.109191, 35.00118], [-83.322791, 34.787579], [-83.339222, 34.683517], [-83.005129, 34.469916], [-82.901067, 34.486347], [-82.747713, 34.26727], [-82.714851, 34.152254], [-82.55602, 33.94413], [-82.325988, 33.81816], [-82.194542, 33.631944], [-81.926172, 33.462159], [-81.937125, 33.347144], [-81.761863, 33.160928], [-81.493493, 33.007573], [-81.42777, 32.843265], [-81.416816, 32.629664], [-81.279893, 32.558464], [-81.121061, 32.290094], [-81.115584, 32.120309], [-80.885553, 32.032678], [-81.132015, 31.693108], [-81.175831, 31.517845], [-81.279893, 31.364491], [-81.290846, 31.20566], [-81.400385, 31.13446], [-81.444201, 30.707258], [-81.718048, 30.745597], [-81.948079, 30.827751], [-82.041187, 30.751074], [-82.002849, 30.564858], [-82.046664, 30.362211], [-82.167157, 30.356734], [-82.216449, 30.570335], [-83.498053, 30.647012], [-84.867289, 30.712735], [-85.004212, 31.003013], [-85.113751, 31.27686], [-85.042551, 31.539753], [-85.141136, 31.840985], [-85.053504, 32.01077], [-85.058981, 32.13674], [-84.889196, 32.262709], [-85.004212, 32.322956], [-84.960397, 32.421541], [-85.069935, 32.580372], [-85.184951, 32.859696], [-85.431413, 34.124869], [-85.606675, 34.984749], [-84.319594, 34.990226], [-83.618546, 34.984749], [-83.109191, 35.00118]]]
  	}
  }, {
  	type: "Feature",
  	id: "15",
  	properties: {
  		name: "Hawaii"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-155.634835, 18.948267], [-155.881297, 19.035898], [-155.919636, 19.123529], [-155.886774, 19.348084], [-156.062036, 19.73147], [-155.925113, 19.857439], [-155.826528, 20.032702], [-155.897728, 20.147717], [-155.87582, 20.26821], [-155.596496, 20.12581], [-155.284311, 20.021748], [-155.092618, 19.868393], [-155.092618, 19.736947], [-154.807817, 19.523346], [-154.983079, 19.348084], [-155.295265, 19.26593], [-155.514342, 19.134483], [-155.634835, 18.948267]]], [[[-156.587823, 21.029505], [-156.472807, 20.892581], [-156.324929, 20.952827], [-156.00179, 20.793996], [-156.051082, 20.651596], [-156.379699, 20.580396], [-156.445422, 20.60778], [-156.461853, 20.783042], [-156.631638, 20.821381], [-156.697361, 20.919966], [-156.587823, 21.029505]]], [[[-156.982162, 21.210244], [-157.080747, 21.106182], [-157.310779, 21.106182], [-157.239579, 21.221198], [-156.982162, 21.210244]]], [[[-157.951581, 21.697691], [-157.842042, 21.462183], [-157.896811, 21.325259], [-158.110412, 21.303352], [-158.252813, 21.582676], [-158.126843, 21.588153], [-157.951581, 21.697691]]], [[[-159.468693, 22.228955], [-159.353678, 22.218001], [-159.298908, 22.113939], [-159.33177, 21.966061], [-159.446786, 21.872953], [-159.764448, 21.987969], [-159.726109, 22.152277], [-159.468693, 22.228955]]]]
  	}
  }, {
  	type: "Feature",
  	id: "16",
  	properties: {
  		name: "Idaho"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-116.04751, 49.000239], [-116.04751, 47.976051], [-115.724371, 47.696727], [-115.718894, 47.42288], [-115.527201, 47.302388], [-115.324554, 47.258572], [-115.302646, 47.187372], [-114.930214, 46.919002], [-114.886399, 46.809463], [-114.623506, 46.705401], [-114.612552, 46.639678], [-114.322274, 46.645155], [-114.464674, 46.272723], [-114.492059, 46.037214], [-114.387997, 45.88386], [-114.568736, 45.774321], [-114.497536, 45.670259], [-114.546828, 45.560721], [-114.333228, 45.456659], [-114.086765, 45.593582], [-113.98818, 45.703121], [-113.807441, 45.604536], [-113.834826, 45.522382], [-113.736241, 45.330689], [-113.571933, 45.128042], [-113.45144, 45.056842], [-113.456917, 44.865149], [-113.341901, 44.782995], [-113.133778, 44.772041], [-113.002331, 44.448902], [-112.887315, 44.394132], [-112.783254, 44.48724], [-112.471068, 44.481763], [-112.241036, 44.569394], [-112.104113, 44.520102], [-111.868605, 44.563917], [-111.819312, 44.509148], [-111.616665, 44.547487], [-111.386634, 44.75561], [-111.227803, 44.580348], [-111.047063, 44.476286], [-111.047063, 42.000709], [-112.164359, 41.995232], [-114.04295, 41.995232], [-117.027882, 42.000709], [-117.027882, 43.830007], [-116.896436, 44.158624], [-116.97859, 44.240778], [-117.170283, 44.257209], [-117.241483, 44.394132], [-117.038836, 44.750133], [-116.934774, 44.782995], [-116.830713, 44.930872], [-116.847143, 45.02398], [-116.732128, 45.144473], [-116.671881, 45.319735], [-116.463758, 45.61549], [-116.545912, 45.752413], [-116.78142, 45.823614], [-116.918344, 45.993399], [-116.92382, 46.168661], [-117.055267, 46.343923], [-117.038836, 46.426077], [-117.044313, 47.762451], [-117.033359, 49.000239], [-116.04751, 49.000239]]]
  	}
  }, {
  	type: "Feature",
  	id: "17",
  	properties: {
  		name: "Illinois"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-90.639984, 42.510065], [-88.788778, 42.493634], [-87.802929, 42.493634], [-87.83579, 42.301941], [-87.682436, 42.077386], [-87.523605, 41.710431], [-87.529082, 39.34987], [-87.63862, 39.169131], [-87.512651, 38.95553], [-87.49622, 38.780268], [-87.62219, 38.637868], [-87.655051, 38.506421], [-87.83579, 38.292821], [-87.950806, 38.27639], [-87.923421, 38.15042], [-88.000098, 38.101128], [-88.060345, 37.865619], [-88.027483, 37.799896], [-88.15893, 37.657496], [-88.065822, 37.482234], [-88.476592, 37.389126], [-88.514931, 37.285064], [-88.421823, 37.153617], [-88.547792, 37.071463], [-88.914747, 37.224817], [-89.029763, 37.213863], [-89.183118, 37.038601], [-89.133825, 36.983832], [-89.292656, 36.994786], [-89.517211, 37.279587], [-89.435057, 37.34531], [-89.517211, 37.537003], [-89.517211, 37.690357], [-89.84035, 37.903958], [-89.949889, 37.88205], [-90.059428, 38.013497], [-90.355183, 38.216144], [-90.349706, 38.374975], [-90.179921, 38.632391], [-90.207305, 38.725499], [-90.10872, 38.845992], [-90.251121, 38.917192], [-90.470199, 38.961007], [-90.585214, 38.867899], [-90.661891, 38.928146], [-90.727615, 39.256762], [-91.061708, 39.470363], [-91.368417, 39.727779], [-91.494386, 40.034488], [-91.50534, 40.237135], [-91.417709, 40.379535], [-91.401278, 40.560274], [-91.121954, 40.669813], [-91.09457, 40.823167], [-90.963123, 40.921752], [-90.946692, 41.097014], [-91.111001, 41.239415], [-91.045277, 41.414677], [-90.656414, 41.463969], [-90.344229, 41.589939], [-90.311367, 41.743293], [-90.179921, 41.809016], [-90.141582, 42.000709], [-90.168967, 42.126679], [-90.393521, 42.225264], [-90.420906, 42.329326], [-90.639984, 42.510065]]]
  	}
  }, {
  	type: "Feature",
  	id: "18",
  	properties: {
  		name: "Indiana"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-85.990061, 41.759724], [-84.807042, 41.759724], [-84.807042, 41.694001], [-84.801565, 40.500028], [-84.817996, 39.103408], [-84.894673, 39.059592], [-84.812519, 38.785745], [-84.987781, 38.780268], [-85.173997, 38.68716], [-85.431413, 38.730976], [-85.42046, 38.533806], [-85.590245, 38.451652], [-85.655968, 38.325682], [-85.83123, 38.27639], [-85.924338, 38.024451], [-86.039354, 37.958727], [-86.263908, 38.051835], [-86.302247, 38.166851], [-86.521325, 38.040881], [-86.504894, 37.931343], [-86.729448, 37.893004], [-86.795172, 37.991589], [-87.047111, 37.893004], [-87.129265, 37.788942], [-87.381204, 37.93682], [-87.512651, 37.903958], [-87.600282, 37.975158], [-87.682436, 37.903958], [-87.934375, 37.893004], [-88.027483, 37.799896], [-88.060345, 37.865619], [-88.000098, 38.101128], [-87.923421, 38.15042], [-87.950806, 38.27639], [-87.83579, 38.292821], [-87.655051, 38.506421], [-87.62219, 38.637868], [-87.49622, 38.780268], [-87.512651, 38.95553], [-87.63862, 39.169131], [-87.529082, 39.34987], [-87.523605, 41.710431], [-87.42502, 41.644708], [-87.118311, 41.644708], [-86.822556, 41.759724], [-85.990061, 41.759724]]]
  	}
  }, {
  	type: "Feature",
  	id: "19",
  	properties: {
  		name: "Iowa"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-91.368417, 43.501391], [-91.215062, 43.501391], [-91.204109, 43.353514], [-91.056231, 43.254929], [-91.176724, 43.134436], [-91.143862, 42.909881], [-91.067185, 42.75105], [-90.711184, 42.636034], [-90.639984, 42.510065], [-90.420906, 42.329326], [-90.393521, 42.225264], [-90.168967, 42.126679], [-90.141582, 42.000709], [-90.179921, 41.809016], [-90.311367, 41.743293], [-90.344229, 41.589939], [-90.656414, 41.463969], [-91.045277, 41.414677], [-91.111001, 41.239415], [-90.946692, 41.097014], [-90.963123, 40.921752], [-91.09457, 40.823167], [-91.121954, 40.669813], [-91.401278, 40.560274], [-91.417709, 40.379535], [-91.527248, 40.412397], [-91.729895, 40.615043], [-91.833957, 40.609566], [-93.257961, 40.582182], [-94.632673, 40.571228], [-95.7664, 40.587659], [-95.881416, 40.719105], [-95.826646, 40.976521], [-95.925231, 41.201076], [-95.919754, 41.453015], [-96.095016, 41.540646], [-96.122401, 41.67757], [-96.062155, 41.798063], [-96.127878, 41.973325], [-96.264801, 42.039048], [-96.44554, 42.488157], [-96.631756, 42.707235], [-96.544125, 42.855112], [-96.511264, 43.052282], [-96.434587, 43.123482], [-96.560556, 43.222067], [-96.527695, 43.397329], [-96.582464, 43.479483], [-96.451017, 43.501391], [-91.368417, 43.501391]]]
  	}
  }, {
  	type: "Feature",
  	id: "20",
  	properties: {
  		name: "Kansas"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-101.90605, 40.001626], [-95.306337, 40.001626], [-95.207752, 39.908518], [-94.884612, 39.831841], [-95.109167, 39.541563], [-94.983197, 39.442978], [-94.824366, 39.20747], [-94.610765, 39.158177], [-94.616242, 37.000263], [-100.087706, 37.000263], [-102.042974, 36.994786], [-102.053927, 40.001626], [-101.90605, 40.001626]]]
  	}
  }, {
  	type: "Feature",
  	id: "21",
  	properties: {
  		name: "Kentucky"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-83.903347, 38.769315], [-83.678792, 38.632391], [-83.519961, 38.703591], [-83.142052, 38.626914], [-83.032514, 38.725499], [-82.890113, 38.758361], [-82.846298, 38.588575], [-82.731282, 38.561191], [-82.594358, 38.424267], [-82.621743, 38.123036], [-82.50125, 37.931343], [-82.342419, 37.783465], [-82.293127, 37.668449], [-82.101434, 37.553434], [-81.969987, 37.537003], [-82.353373, 37.268633], [-82.720328, 37.120755], [-82.720328, 37.044078], [-82.868205, 36.978355], [-82.879159, 36.890724], [-83.070852, 36.852385], [-83.136575, 36.742847], [-83.673316, 36.600446], [-83.689746, 36.584015], [-84.544149, 36.594969], [-85.289013, 36.627831], [-85.486183, 36.616877], [-86.592525, 36.655216], [-87.852221, 36.633308], [-88.071299, 36.677123], [-88.054868, 36.496384], [-89.298133, 36.507338], [-89.418626, 36.496384], [-89.363857, 36.622354], [-89.215979, 36.578538], [-89.133825, 36.983832], [-89.183118, 37.038601], [-89.029763, 37.213863], [-88.914747, 37.224817], [-88.547792, 37.071463], [-88.421823, 37.153617], [-88.514931, 37.285064], [-88.476592, 37.389126], [-88.065822, 37.482234], [-88.15893, 37.657496], [-88.027483, 37.799896], [-87.934375, 37.893004], [-87.682436, 37.903958], [-87.600282, 37.975158], [-87.512651, 37.903958], [-87.381204, 37.93682], [-87.129265, 37.788942], [-87.047111, 37.893004], [-86.795172, 37.991589], [-86.729448, 37.893004], [-86.504894, 37.931343], [-86.521325, 38.040881], [-86.302247, 38.166851], [-86.263908, 38.051835], [-86.039354, 37.958727], [-85.924338, 38.024451], [-85.83123, 38.27639], [-85.655968, 38.325682], [-85.590245, 38.451652], [-85.42046, 38.533806], [-85.431413, 38.730976], [-85.173997, 38.68716], [-84.987781, 38.780268], [-84.812519, 38.785745], [-84.894673, 39.059592], [-84.817996, 39.103408], [-84.43461, 39.103408], [-84.231963, 38.895284], [-84.215533, 38.807653], [-83.903347, 38.769315]]]
  	}
  }, {
  	type: "Feature",
  	id: "22",
  	properties: {
  		name: "Louisiana"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-93.608485, 33.018527], [-91.16577, 33.002096], [-91.072662, 32.887081], [-91.143862, 32.843265], [-91.154816, 32.640618], [-91.006939, 32.514649], [-90.985031, 32.218894], [-91.105524, 31.988862], [-91.341032, 31.846462], [-91.401278, 31.621907], [-91.499863, 31.643815], [-91.516294, 31.27686], [-91.636787, 31.265906], [-91.565587, 31.068736], [-91.636787, 30.997536], [-89.747242, 30.997536], [-89.845827, 30.66892], [-89.681519, 30.449842], [-89.643181, 30.285534], [-89.522688, 30.181472], [-89.818443, 30.044549], [-89.84035, 29.945964], [-89.599365, 29.88024], [-89.495303, 30.039072], [-89.287179, 29.88024], [-89.30361, 29.754271], [-89.424103, 29.699501], [-89.648657, 29.748794], [-89.621273, 29.655686], [-89.69795, 29.513285], [-89.506257, 29.387316], [-89.199548, 29.348977], [-89.09001, 29.2011], [-89.002379, 29.179192], [-89.16121, 29.009407], [-89.336472, 29.042268], [-89.484349, 29.217531], [-89.851304, 29.310638], [-89.851304, 29.480424], [-90.032043, 29.425654], [-90.021089, 29.283254], [-90.103244, 29.151807], [-90.23469, 29.129899], [-90.333275, 29.277777], [-90.563307, 29.283254], [-90.645461, 29.129899], [-90.798815, 29.086084], [-90.963123, 29.179192], [-91.09457, 29.190146], [-91.220539, 29.436608], [-91.445094, 29.546147], [-91.532725, 29.529716], [-91.620356, 29.73784], [-91.883249, 29.710455], [-91.888726, 29.836425], [-92.146142, 29.715932], [-92.113281, 29.622824], [-92.31045, 29.535193], [-92.617159, 29.579009], [-92.97316, 29.715932], [-93.2251, 29.776178], [-93.767317, 29.726886], [-93.838517, 29.688547], [-93.926148, 29.787132], [-93.690639, 30.143133], [-93.767317, 30.334826], [-93.696116, 30.438888], [-93.728978, 30.575812], [-93.630393, 30.679874], [-93.526331, 30.93729], [-93.542762, 31.15089], [-93.816609, 31.556184], [-93.822086, 31.775262], [-94.041164, 31.994339], [-94.041164, 33.018527], [-93.608485, 33.018527]]]
  	}
  }, {
  	type: "Feature",
  	id: "23",
  	properties: {
  		name: "Maine"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-70.703921, 43.057759], [-70.824413, 43.128959], [-70.807983, 43.227544], [-70.966814, 43.34256], [-71.032537, 44.657025], [-71.08183, 45.303304], [-70.649151, 45.440228], [-70.720352, 45.511428], [-70.556043, 45.664782], [-70.386258, 45.735983], [-70.41912, 45.796229], [-70.260289, 45.889337], [-70.309581, 46.064599], [-70.210996, 46.327492], [-70.057642, 46.415123], [-69.997395, 46.694447], [-69.225147, 47.461219], [-69.044408, 47.428357], [-69.033454, 47.242141], [-68.902007, 47.176418], [-68.578868, 47.285957], [-68.376221, 47.285957], [-68.233821, 47.357157], [-67.954497, 47.198326], [-67.790188, 47.066879], [-67.779235, 45.944106], [-67.801142, 45.675736], [-67.456095, 45.604536], [-67.505388, 45.48952], [-67.417757, 45.379982], [-67.488957, 45.281397], [-67.346556, 45.128042], [-67.16034, 45.160904], [-66.979601, 44.804903], [-67.187725, 44.646072], [-67.308218, 44.706318], [-67.406803, 44.596779], [-67.549203, 44.624164], [-67.565634, 44.531056], [-67.75185, 44.54201], [-68.047605, 44.328409], [-68.118805, 44.476286], [-68.222867, 44.48724], [-68.173574, 44.328409], [-68.403606, 44.251732], [-68.458375, 44.377701], [-68.567914, 44.311978], [-68.82533, 44.311978], [-68.830807, 44.459856], [-68.984161, 44.426994], [-68.956777, 44.322932], [-69.099177, 44.103854], [-69.071793, 44.043608], [-69.258008, 43.923115], [-69.444224, 43.966931], [-69.553763, 43.840961], [-69.707118, 43.82453], [-69.833087, 43.720469], [-69.986442, 43.742376], [-70.030257, 43.851915], [-70.254812, 43.676653], [-70.194565, 43.567114], [-70.358873, 43.528776], [-70.369827, 43.435668], [-70.556043, 43.320652], [-70.703921, 43.057759]]]
  	}
  }, {
  	type: "Feature",
  	id: "24",
  	properties: {
  		name: "Maryland"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-75.994645, 37.95325], [-76.016553, 37.95325], [-76.043938, 37.95325], [-75.994645, 37.95325]]], [[[-79.477979, 39.722302], [-75.786521, 39.722302], [-75.693413, 38.462606], [-75.047134, 38.451652], [-75.244304, 38.029928], [-75.397659, 38.013497], [-75.671506, 37.95325], [-75.885106, 37.909435], [-75.879629, 38.073743], [-75.961783, 38.139466], [-75.846768, 38.210667], [-76.000122, 38.374975], [-76.049415, 38.303775], [-76.257538, 38.320205], [-76.328738, 38.500944], [-76.263015, 38.500944], [-76.257538, 38.736453], [-76.191815, 38.829561], [-76.279446, 39.147223], [-76.169907, 39.333439], [-76.000122, 39.366301], [-75.972737, 39.557994], [-76.098707, 39.536086], [-76.104184, 39.437501], [-76.367077, 39.311532], [-76.443754, 39.196516], [-76.460185, 38.906238], [-76.55877, 38.769315], [-76.514954, 38.539283], [-76.383508, 38.380452], [-76.399939, 38.259959], [-76.317785, 38.139466], [-76.3616, 38.057312], [-76.591632, 38.216144], [-76.920248, 38.292821], [-77.018833, 38.446175], [-77.205049, 38.358544], [-77.276249, 38.479037], [-77.128372, 38.632391], [-77.040741, 38.791222], [-76.909294, 38.895284], [-77.035264, 38.993869], [-77.117418, 38.933623], [-77.248864, 39.026731], [-77.456988, 39.076023], [-77.456988, 39.223901], [-77.566527, 39.306055], [-77.719881, 39.322485], [-77.834897, 39.601809], [-78.004682, 39.601809], [-78.174467, 39.694917], [-78.267575, 39.61824], [-78.431884, 39.623717], [-78.470222, 39.514178], [-78.765977, 39.585379], [-78.963147, 39.437501], [-79.094593, 39.470363], [-79.291763, 39.300578], [-79.488933, 39.20747], [-79.477979, 39.722302]]]]
  	}
  }, {
  	type: "Feature",
  	id: "25",
  	properties: {
  		name: "Massachusetts"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-70.917521, 42.887974], [-70.818936, 42.871543], [-70.780598, 42.696281], [-70.824413, 42.55388], [-70.983245, 42.422434], [-70.988722, 42.269079], [-70.769644, 42.247172], [-70.638197, 42.08834], [-70.660105, 41.962371], [-70.550566, 41.929509], [-70.539613, 41.814493], [-70.260289, 41.715908], [-69.937149, 41.809016], [-70.008349, 41.672093], [-70.484843, 41.5516], [-70.660105, 41.546123], [-70.764167, 41.639231], [-70.928475, 41.611847], [-70.933952, 41.540646], [-71.120168, 41.496831], [-71.196845, 41.67757], [-71.22423, 41.710431], [-71.328292, 41.781632], [-71.383061, 42.01714], [-71.530939, 42.01714], [-71.799309, 42.006186], [-71.799309, 42.022617], [-73.053528, 42.039048], [-73.486206, 42.050002], [-73.508114, 42.08834], [-73.267129, 42.745573], [-72.456542, 42.729142], [-71.29543, 42.696281], [-71.185891, 42.789389], [-70.917521, 42.887974]]]
  	}
  }, {
  	type: "Feature",
  	id: "26",
  	properties: {
  		name: "Michigan"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-83.454238, 41.732339], [-84.807042, 41.694001], [-84.807042, 41.759724], [-85.990061, 41.759724], [-86.822556, 41.759724], [-86.619909, 41.891171], [-86.482986, 42.115725], [-86.357016, 42.252649], [-86.263908, 42.444341], [-86.209139, 42.718189], [-86.231047, 43.013943], [-86.526801, 43.594499], [-86.433693, 43.813577], [-86.499417, 44.07647], [-86.269385, 44.34484], [-86.220093, 44.569394], [-86.252954, 44.689887], [-86.088646, 44.73918], [-86.066738, 44.903488], [-85.809322, 44.947303], [-85.612152, 45.128042], [-85.628583, 44.766564], [-85.524521, 44.750133], [-85.393075, 44.930872], [-85.387598, 45.237581], [-85.305444, 45.314258], [-85.031597, 45.363551], [-85.119228, 45.577151], [-84.938489, 45.75789], [-84.713934, 45.768844], [-84.461995, 45.653829], [-84.215533, 45.637398], [-84.09504, 45.494997], [-83.908824, 45.484043], [-83.596638, 45.352597], [-83.4871, 45.358074], [-83.317314, 45.144473], [-83.454238, 45.029457], [-83.322791, 44.88158], [-83.273499, 44.711795], [-83.333745, 44.339363], [-83.536392, 44.246255], [-83.585684, 44.054562], [-83.82667, 43.988839], [-83.958116, 43.758807], [-83.908824, 43.671176], [-83.667839, 43.589022], [-83.481623, 43.714992], [-83.262545, 43.972408], [-82.917498, 44.070993], [-82.747713, 43.994316], [-82.643651, 43.851915], [-82.539589, 43.435668], [-82.523158, 43.227544], [-82.413619, 42.975605], [-82.517681, 42.614127], [-82.681989, 42.559357], [-82.687466, 42.690804], [-82.797005, 42.652465], [-82.922975, 42.351234], [-83.125621, 42.236218], [-83.185868, 42.006186], [-83.437807, 41.814493], [-83.454238, 41.732339]]], [[[-85.508091, 45.730506], [-85.49166, 45.610013], [-85.623106, 45.588105], [-85.568337, 45.75789], [-85.508091, 45.730506]]], [[[-87.589328, 45.095181], [-87.742682, 45.199243], [-87.649574, 45.341643], [-87.885083, 45.363551], [-87.791975, 45.500474], [-87.781021, 45.675736], [-87.989145, 45.796229], [-88.10416, 45.922199], [-88.531362, 46.020784], [-88.662808, 45.987922], [-89.09001, 46.135799], [-90.119674, 46.338446], [-90.229213, 46.508231], [-90.415429, 46.568478], [-90.026566, 46.672539], [-89.851304, 46.793032], [-89.413149, 46.842325], [-89.128348, 46.990202], [-88.996902, 46.995679], [-88.887363, 47.099741], [-88.575177, 47.247618], [-88.416346, 47.373588], [-88.180837, 47.455742], [-87.956283, 47.384542], [-88.350623, 47.077833], [-88.443731, 46.973771], [-88.438254, 46.787555], [-88.246561, 46.929956], [-87.901513, 46.908048], [-87.633143, 46.809463], [-87.392158, 46.535616], [-87.260711, 46.486323], [-87.008772, 46.530139], [-86.948526, 46.469893], [-86.696587, 46.437031], [-86.159846, 46.667063], [-85.880522, 46.68897], [-85.508091, 46.678016], [-85.256151, 46.754694], [-85.064458, 46.760171], [-85.02612, 46.480847], [-84.82895, 46.442508], [-84.63178, 46.486323], [-84.549626, 46.4206], [-84.418179, 46.502754], [-84.127902, 46.530139], [-84.122425, 46.179615], [-83.990978, 46.031737], [-83.793808, 45.993399], [-83.7719, 46.091984], [-83.580208, 46.091984], [-83.476146, 45.987922], [-83.563777, 45.911245], [-84.111471, 45.976968], [-84.374364, 45.933153], [-84.659165, 46.053645], [-84.741319, 45.944106], [-84.70298, 45.850998], [-84.82895, 45.872906], [-85.015166, 46.00983], [-85.338305, 46.091984], [-85.502614, 46.097461], [-85.661445, 45.966014], [-85.924338, 45.933153], [-86.209139, 45.960537], [-86.324155, 45.905768], [-86.351539, 45.796229], [-86.663725, 45.703121], [-86.647294, 45.834568], [-86.784218, 45.861952], [-86.838987, 45.725029], [-87.069019, 45.719552], [-87.17308, 45.659305], [-87.326435, 45.423797], [-87.611236, 45.122565], [-87.589328, 45.095181]]], [[[-88.805209, 47.976051], [-89.057148, 47.850082], [-89.188594, 47.833651], [-89.177641, 47.937713], [-88.547792, 48.173221], [-88.668285, 48.008913], [-88.805209, 47.976051]]]]
  	}
  }, {
  	type: "Feature",
  	id: "27",
  	properties: {
  		name: "Minnesota"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-92.014696, 46.705401], [-92.091373, 46.749217], [-92.29402, 46.667063], [-92.29402, 46.075553], [-92.354266, 46.015307], [-92.639067, 45.933153], [-92.869098, 45.719552], [-92.885529, 45.577151], [-92.770513, 45.566198], [-92.644544, 45.440228], [-92.75956, 45.286874], [-92.737652, 45.117088], [-92.808852, 44.750133], [-92.545959, 44.569394], [-92.337835, 44.552964], [-92.233773, 44.443425], [-91.927065, 44.333886], [-91.877772, 44.202439], [-91.592971, 44.032654], [-91.43414, 43.994316], [-91.242447, 43.775238], [-91.269832, 43.616407], [-91.215062, 43.501391], [-91.368417, 43.501391], [-96.451017, 43.501391], [-96.451017, 45.297827], [-96.681049, 45.412843], [-96.856311, 45.604536], [-96.582464, 45.818137], [-96.560556, 45.933153], [-96.598895, 46.332969], [-96.719387, 46.437031], [-96.801542, 46.656109], [-96.785111, 46.924479], [-96.823449, 46.968294], [-96.856311, 47.609096], [-97.053481, 47.948667], [-97.130158, 48.140359], [-97.16302, 48.545653], [-97.097296, 48.682577], [-97.228743, 49.000239], [-95.152983, 49.000239], [-95.152983, 49.383625], [-94.955813, 49.372671], [-94.824366, 49.295994], [-94.69292, 48.775685], [-94.588858, 48.715438], [-94.260241, 48.699007], [-94.221903, 48.649715], [-93.838517, 48.627807], [-93.794701, 48.518268], [-93.466085, 48.545653], [-93.466085, 48.589469], [-93.208669, 48.644238], [-92.984114, 48.62233], [-92.726698, 48.540176], [-92.655498, 48.436114], [-92.50762, 48.447068], [-92.370697, 48.222514], [-92.304974, 48.315622], [-92.053034, 48.359437], [-92.009219, 48.266329], [-91.713464, 48.200606], [-91.713464, 48.112975], [-91.565587, 48.041775], [-91.264355, 48.080113], [-91.083616, 48.178698], [-90.837154, 48.238944], [-90.749522, 48.091067], [-90.579737, 48.123929], [-90.377091, 48.091067], [-90.141582, 48.112975], [-89.873212, 47.987005], [-89.615796, 48.008913], [-89.637704, 47.954144], [-89.971797, 47.828174], [-90.437337, 47.729589], [-90.738569, 47.625527], [-91.171247, 47.368111], [-91.357463, 47.20928], [-91.642264, 47.028541], [-92.091373, 46.787555], [-92.014696, 46.705401]]]
  	}
  }, {
  	type: "Feature",
  	id: "28",
  	properties: {
  		name: "Mississippi"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-88.471115, 34.995703], [-88.202745, 34.995703], [-88.098683, 34.891641], [-88.241084, 33.796253], [-88.471115, 31.895754], [-88.394438, 30.367688], [-88.503977, 30.323872], [-88.744962, 30.34578], [-88.843547, 30.411504], [-89.084533, 30.367688], [-89.418626, 30.252672], [-89.522688, 30.181472], [-89.643181, 30.285534], [-89.681519, 30.449842], [-89.845827, 30.66892], [-89.747242, 30.997536], [-91.636787, 30.997536], [-91.565587, 31.068736], [-91.636787, 31.265906], [-91.516294, 31.27686], [-91.499863, 31.643815], [-91.401278, 31.621907], [-91.341032, 31.846462], [-91.105524, 31.988862], [-90.985031, 32.218894], [-91.006939, 32.514649], [-91.154816, 32.640618], [-91.143862, 32.843265], [-91.072662, 32.887081], [-91.16577, 33.002096], [-91.089093, 33.13902], [-91.143862, 33.347144], [-91.056231, 33.429298], [-91.231493, 33.560744], [-91.072662, 33.867453], [-90.891923, 34.026284], [-90.952169, 34.135823], [-90.744046, 34.300131], [-90.749522, 34.365854], [-90.568783, 34.420624], [-90.585214, 34.617794], [-90.481152, 34.661609], [-90.409952, 34.831394], [-90.251121, 34.908072], [-90.311367, 34.995703], [-88.471115, 34.995703]]]
  	}
  }, {
  	type: "Feature",
  	id: "29",
  	properties: {
  		name: "Missouri"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-91.833957, 40.609566], [-91.729895, 40.615043], [-91.527248, 40.412397], [-91.417709, 40.379535], [-91.50534, 40.237135], [-91.494386, 40.034488], [-91.368417, 39.727779], [-91.061708, 39.470363], [-90.727615, 39.256762], [-90.661891, 38.928146], [-90.585214, 38.867899], [-90.470199, 38.961007], [-90.251121, 38.917192], [-90.10872, 38.845992], [-90.207305, 38.725499], [-90.179921, 38.632391], [-90.349706, 38.374975], [-90.355183, 38.216144], [-90.059428, 38.013497], [-89.949889, 37.88205], [-89.84035, 37.903958], [-89.517211, 37.690357], [-89.517211, 37.537003], [-89.435057, 37.34531], [-89.517211, 37.279587], [-89.292656, 36.994786], [-89.133825, 36.983832], [-89.215979, 36.578538], [-89.363857, 36.622354], [-89.418626, 36.496384], [-89.484349, 36.496384], [-89.539119, 36.496384], [-89.533642, 36.249922], [-89.730812, 35.997983], [-90.377091, 35.997983], [-90.218259, 36.184199], [-90.064905, 36.304691], [-90.152536, 36.496384], [-94.473842, 36.501861], [-94.616242, 36.501861], [-94.616242, 37.000263], [-94.610765, 39.158177], [-94.824366, 39.20747], [-94.983197, 39.442978], [-95.109167, 39.541563], [-94.884612, 39.831841], [-95.207752, 39.908518], [-95.306337, 40.001626], [-95.552799, 40.264519], [-95.7664, 40.587659], [-94.632673, 40.571228], [-93.257961, 40.582182], [-91.833957, 40.609566]]]
  	}
  }, {
  	type: "Feature",
  	id: "30",
  	properties: {
  		name: "Montana"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-104.047534, 49.000239], [-104.042057, 47.861036], [-104.047534, 45.944106], [-104.042057, 44.996596], [-104.058488, 44.996596], [-105.91517, 45.002073], [-109.080842, 45.002073], [-111.05254, 45.002073], [-111.047063, 44.476286], [-111.227803, 44.580348], [-111.386634, 44.75561], [-111.616665, 44.547487], [-111.819312, 44.509148], [-111.868605, 44.563917], [-112.104113, 44.520102], [-112.241036, 44.569394], [-112.471068, 44.481763], [-112.783254, 44.48724], [-112.887315, 44.394132], [-113.002331, 44.448902], [-113.133778, 44.772041], [-113.341901, 44.782995], [-113.456917, 44.865149], [-113.45144, 45.056842], [-113.571933, 45.128042], [-113.736241, 45.330689], [-113.834826, 45.522382], [-113.807441, 45.604536], [-113.98818, 45.703121], [-114.086765, 45.593582], [-114.333228, 45.456659], [-114.546828, 45.560721], [-114.497536, 45.670259], [-114.568736, 45.774321], [-114.387997, 45.88386], [-114.492059, 46.037214], [-114.464674, 46.272723], [-114.322274, 46.645155], [-114.612552, 46.639678], [-114.623506, 46.705401], [-114.886399, 46.809463], [-114.930214, 46.919002], [-115.302646, 47.187372], [-115.324554, 47.258572], [-115.527201, 47.302388], [-115.718894, 47.42288], [-115.724371, 47.696727], [-116.04751, 47.976051], [-116.04751, 49.000239], [-111.50165, 48.994762], [-109.453274, 49.000239], [-104.047534, 49.000239]]]
  	}
  }, {
  	type: "Feature",
  	id: "31",
  	properties: {
  		name: "Nebraska"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-103.324578, 43.002989], [-101.626726, 42.997512], [-98.499393, 42.997512], [-98.466531, 42.94822], [-97.951699, 42.767481], [-97.831206, 42.866066], [-97.688806, 42.844158], [-97.217789, 42.844158], [-96.692003, 42.657942], [-96.626279, 42.515542], [-96.44554, 42.488157], [-96.264801, 42.039048], [-96.127878, 41.973325], [-96.062155, 41.798063], [-96.122401, 41.67757], [-96.095016, 41.540646], [-95.919754, 41.453015], [-95.925231, 41.201076], [-95.826646, 40.976521], [-95.881416, 40.719105], [-95.7664, 40.587659], [-95.552799, 40.264519], [-95.306337, 40.001626], [-101.90605, 40.001626], [-102.053927, 40.001626], [-102.053927, 41.003906], [-104.053011, 41.003906], [-104.053011, 43.002989], [-103.324578, 43.002989]]]
  	}
  }, {
  	type: "Feature",
  	id: "32",
  	properties: {
  		name: "Nevada"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-117.027882, 42.000709], [-114.04295, 41.995232], [-114.048427, 37.000263], [-114.048427, 36.195153], [-114.152489, 36.025367], [-114.251074, 36.01989], [-114.371566, 36.140383], [-114.738521, 36.102045], [-114.678275, 35.516012], [-114.596121, 35.324319], [-114.574213, 35.138103], [-114.634459, 35.00118], [-115.85034, 35.970598], [-116.540435, 36.501861], [-117.498899, 37.21934], [-118.71478, 38.101128], [-120.001861, 38.999346], [-119.996384, 40.264519], [-120.001861, 41.995232], [-118.698349, 41.989755], [-117.027882, 42.000709]]]
  	}
  }, {
  	type: "Feature",
  	id: "33",
  	properties: {
  		name: "New Hampshire"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-71.08183, 45.303304], [-71.032537, 44.657025], [-70.966814, 43.34256], [-70.807983, 43.227544], [-70.824413, 43.128959], [-70.703921, 43.057759], [-70.818936, 42.871543], [-70.917521, 42.887974], [-71.185891, 42.789389], [-71.29543, 42.696281], [-72.456542, 42.729142], [-72.544173, 42.80582], [-72.533219, 42.953697], [-72.445588, 43.008466], [-72.456542, 43.150867], [-72.379864, 43.572591], [-72.204602, 43.769761], [-72.116971, 43.994316], [-72.02934, 44.07647], [-72.034817, 44.322932], [-71.700724, 44.41604], [-71.536416, 44.585825], [-71.629524, 44.750133], [-71.4926, 44.914442], [-71.503554, 45.013027], [-71.361154, 45.270443], [-71.131122, 45.243058], [-71.08183, 45.303304]]]
  	}
  }, {
  	type: "Feature",
  	id: "34",
  	properties: {
  		name: "New Jersey"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-74.236547, 41.14083], [-73.902454, 40.998429], [-74.022947, 40.708151], [-74.187255, 40.642428], [-74.274886, 40.489074], [-74.001039, 40.412397], [-73.979131, 40.297381], [-74.099624, 39.760641], [-74.411809, 39.360824], [-74.614456, 39.245808], [-74.795195, 38.993869], [-74.888303, 39.158177], [-75.178581, 39.240331], [-75.534582, 39.459409], [-75.55649, 39.607286], [-75.561967, 39.629194], [-75.507197, 39.683964], [-75.414089, 39.804456], [-75.145719, 39.88661], [-75.129289, 39.963288], [-74.82258, 40.127596], [-74.773287, 40.215227], [-75.058088, 40.417874], [-75.069042, 40.543843], [-75.195012, 40.576705], [-75.205966, 40.691721], [-75.052611, 40.866983], [-75.134765, 40.971045], [-74.882826, 41.179168], [-74.828057, 41.288707], [-74.69661, 41.359907], [-74.236547, 41.14083]]]
  	}
  }, {
  	type: "Feature",
  	id: "35",
  	properties: {
  		name: "New Mexico"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-107.421329, 37.000263], [-106.868158, 36.994786], [-104.337812, 36.994786], [-103.001438, 37.000263], [-103.001438, 36.501861], [-103.039777, 36.501861], [-103.045254, 34.01533], [-103.067161, 33.002096], [-103.067161, 31.999816], [-106.616219, 31.999816], [-106.643603, 31.901231], [-106.528588, 31.786216], [-108.210008, 31.786216], [-108.210008, 31.331629], [-109.04798, 31.331629], [-109.042503, 37.000263], [-107.421329, 37.000263]]]
  	}
  }, {
  	type: "Feature",
  	id: "36",
  	properties: {
  		name: "New York"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-73.343806, 45.013027], [-73.332852, 44.804903], [-73.387622, 44.618687], [-73.294514, 44.437948], [-73.321898, 44.246255], [-73.436914, 44.043608], [-73.349283, 43.769761], [-73.404052, 43.687607], [-73.245221, 43.523299], [-73.278083, 42.833204], [-73.267129, 42.745573], [-73.508114, 42.08834], [-73.486206, 42.050002], [-73.55193, 41.294184], [-73.48073, 41.21203], [-73.727192, 41.102491], [-73.655992, 40.987475], [-73.22879, 40.905321], [-73.141159, 40.965568], [-72.774204, 40.965568], [-72.587988, 40.998429], [-72.28128, 41.157261], [-72.259372, 41.042245], [-72.100541, 40.992952], [-72.467496, 40.845075], [-73.239744, 40.625997], [-73.562884, 40.582182], [-73.776484, 40.593136], [-73.935316, 40.543843], [-74.022947, 40.708151], [-73.902454, 40.998429], [-74.236547, 41.14083], [-74.69661, 41.359907], [-74.740426, 41.431108], [-74.89378, 41.436584], [-75.074519, 41.60637], [-75.052611, 41.754247], [-75.173104, 41.869263], [-75.249781, 41.863786], [-75.35932, 42.000709], [-79.76278, 42.000709], [-79.76278, 42.252649], [-79.76278, 42.269079], [-79.149363, 42.55388], [-79.050778, 42.690804], [-78.853608, 42.783912], [-78.930285, 42.953697], [-79.012439, 42.986559], [-79.072686, 43.260406], [-78.486653, 43.375421], [-77.966344, 43.369944], [-77.75822, 43.34256], [-77.533665, 43.233021], [-77.391265, 43.276836], [-76.958587, 43.271359], [-76.695693, 43.34256], [-76.41637, 43.523299], [-76.235631, 43.528776], [-76.230154, 43.802623], [-76.137046, 43.961454], [-76.3616, 44.070993], [-76.312308, 44.196962], [-75.912491, 44.366748], [-75.764614, 44.514625], [-75.282643, 44.848718], [-74.828057, 45.018503], [-74.148916, 44.991119], [-73.343806, 45.013027]]]
  	}
  }, {
  	type: "Feature",
  	id: "37",
  	properties: {
  		name: "North Carolina"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-80.978661, 36.562108], [-80.294043, 36.545677], [-79.510841, 36.5402], [-75.868676, 36.551154], [-75.75366, 36.151337], [-76.032984, 36.189676], [-76.071322, 36.140383], [-76.410893, 36.080137], [-76.460185, 36.025367], [-76.68474, 36.008937], [-76.673786, 35.937736], [-76.399939, 35.987029], [-76.3616, 35.943213], [-76.060368, 35.992506], [-75.961783, 35.899398], [-75.781044, 35.937736], [-75.715321, 35.696751], [-75.775568, 35.581735], [-75.89606, 35.570781], [-76.147999, 35.324319], [-76.482093, 35.313365], [-76.536862, 35.14358], [-76.394462, 34.973795], [-76.279446, 34.940933], [-76.493047, 34.661609], [-76.673786, 34.694471], [-76.991448, 34.667086], [-77.210526, 34.60684], [-77.555573, 34.415147], [-77.82942, 34.163208], [-77.971821, 33.845545], [-78.179944, 33.916745], [-78.541422, 33.851022], [-79.675149, 34.80401], [-80.797922, 34.820441], [-80.781491, 34.935456], [-80.934845, 35.105241], [-81.038907, 35.044995], [-81.044384, 35.149057], [-82.276696, 35.198349], [-82.550543, 35.160011], [-82.764143, 35.066903], [-83.109191, 35.00118], [-83.618546, 34.984749], [-84.319594, 34.990226], [-84.29221, 35.225734], [-84.09504, 35.247642], [-84.018363, 35.41195], [-83.7719, 35.559827], [-83.498053, 35.565304], [-83.251591, 35.718659], [-82.994175, 35.773428], [-82.775097, 35.997983], [-82.638174, 36.063706], [-82.610789, 35.965121], [-82.216449, 36.156814], [-82.03571, 36.118475], [-81.909741, 36.304691], [-81.723525, 36.353984], [-81.679709, 36.589492], [-80.978661, 36.562108]]]
  	}
  }, {
  	type: "Feature",
  	id: "38",
  	properties: {
  		name: "North Dakota"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-97.228743, 49.000239], [-97.097296, 48.682577], [-97.16302, 48.545653], [-97.130158, 48.140359], [-97.053481, 47.948667], [-96.856311, 47.609096], [-96.823449, 46.968294], [-96.785111, 46.924479], [-96.801542, 46.656109], [-96.719387, 46.437031], [-96.598895, 46.332969], [-96.560556, 45.933153], [-104.047534, 45.944106], [-104.042057, 47.861036], [-104.047534, 49.000239], [-97.228743, 49.000239]]]
  	}
  }, {
  	type: "Feature",
  	id: "39",
  	properties: {
  		name: "Ohio"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-80.518598, 41.978802], [-80.518598, 40.636951], [-80.666475, 40.582182], [-80.595275, 40.472643], [-80.600752, 40.319289], [-80.737675, 40.078303], [-80.830783, 39.711348], [-81.219646, 39.388209], [-81.345616, 39.344393], [-81.455155, 39.410117], [-81.57017, 39.267716], [-81.685186, 39.273193], [-81.811156, 39.0815], [-81.783771, 38.966484], [-81.887833, 38.873376], [-82.03571, 39.026731], [-82.221926, 38.785745], [-82.172634, 38.632391], [-82.293127, 38.577622], [-82.331465, 38.446175], [-82.594358, 38.424267], [-82.731282, 38.561191], [-82.846298, 38.588575], [-82.890113, 38.758361], [-83.032514, 38.725499], [-83.142052, 38.626914], [-83.519961, 38.703591], [-83.678792, 38.632391], [-83.903347, 38.769315], [-84.215533, 38.807653], [-84.231963, 38.895284], [-84.43461, 39.103408], [-84.817996, 39.103408], [-84.801565, 40.500028], [-84.807042, 41.694001], [-83.454238, 41.732339], [-83.065375, 41.595416], [-82.933929, 41.513262], [-82.835344, 41.589939], [-82.616266, 41.431108], [-82.479343, 41.381815], [-82.013803, 41.513262], [-81.739956, 41.485877], [-81.444201, 41.672093], [-81.011523, 41.852832], [-80.518598, 41.978802], [-80.518598, 41.978802]]]
  	}
  }, {
  	type: "Feature",
  	id: "40",
  	properties: {
  		name: "Oklahoma"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-100.087706, 37.000263], [-94.616242, 37.000263], [-94.616242, 36.501861], [-94.430026, 35.395519], [-94.484796, 33.637421], [-94.868182, 33.74696], [-94.966767, 33.861976], [-95.224183, 33.960561], [-95.289906, 33.87293], [-95.547322, 33.878407], [-95.602092, 33.933176], [-95.8376, 33.834591], [-95.936185, 33.889361], [-96.149786, 33.840068], [-96.346956, 33.686714], [-96.423633, 33.774345], [-96.631756, 33.845545], [-96.850834, 33.845545], [-96.922034, 33.960561], [-97.173974, 33.736006], [-97.256128, 33.861976], [-97.371143, 33.823637], [-97.458774, 33.905791], [-97.694283, 33.982469], [-97.869545, 33.851022], [-97.946222, 33.987946], [-98.088623, 34.004376], [-98.170777, 34.113915], [-98.36247, 34.157731], [-98.488439, 34.064623], [-98.570593, 34.146777], [-98.767763, 34.135823], [-98.986841, 34.223454], [-99.189488, 34.2125], [-99.260688, 34.404193], [-99.57835, 34.415147], [-99.698843, 34.382285], [-99.923398, 34.573978], [-100.000075, 34.563024], [-100.000075, 36.501861], [-101.812942, 36.501861], [-103.001438, 36.501861], [-103.001438, 37.000263], [-102.042974, 36.994786], [-100.087706, 37.000263]]]
  	}
  }, {
  	type: "Feature",
  	id: "41",
  	properties: {
  		name: "Oregon"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-123.211348, 46.174138], [-123.11824, 46.185092], [-122.904639, 46.08103], [-122.811531, 45.960537], [-122.762239, 45.659305], [-122.247407, 45.549767], [-121.809251, 45.708598], [-121.535404, 45.725029], [-121.217742, 45.670259], [-121.18488, 45.604536], [-120.637186, 45.746937], [-120.505739, 45.697644], [-120.209985, 45.725029], [-119.963522, 45.823614], [-119.525367, 45.911245], [-119.125551, 45.933153], [-118.988627, 45.998876], [-116.918344, 45.993399], [-116.78142, 45.823614], [-116.545912, 45.752413], [-116.463758, 45.61549], [-116.671881, 45.319735], [-116.732128, 45.144473], [-116.847143, 45.02398], [-116.830713, 44.930872], [-116.934774, 44.782995], [-117.038836, 44.750133], [-117.241483, 44.394132], [-117.170283, 44.257209], [-116.97859, 44.240778], [-116.896436, 44.158624], [-117.027882, 43.830007], [-117.027882, 42.000709], [-118.698349, 41.989755], [-120.001861, 41.995232], [-121.037003, 41.995232], [-122.378853, 42.011663], [-123.233256, 42.006186], [-124.213628, 42.000709], [-124.356029, 42.115725], [-124.432706, 42.438865], [-124.416275, 42.663419], [-124.553198, 42.838681], [-124.454613, 43.002989], [-124.383413, 43.271359], [-124.235536, 43.55616], [-124.169813, 43.8081], [-124.060274, 44.657025], [-124.076705, 44.772041], [-123.97812, 45.144473], [-123.939781, 45.659305], [-123.994551, 45.944106], [-123.945258, 46.113892], [-123.545441, 46.261769], [-123.370179, 46.146753], [-123.211348, 46.174138]]]
  	}
  }, {
  	type: "Feature",
  	id: "42",
  	properties: {
  		name: "Pennsylvania"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-79.76278, 42.252649], [-79.76278, 42.000709], [-75.35932, 42.000709], [-75.249781, 41.863786], [-75.173104, 41.869263], [-75.052611, 41.754247], [-75.074519, 41.60637], [-74.89378, 41.436584], [-74.740426, 41.431108], [-74.69661, 41.359907], [-74.828057, 41.288707], [-74.882826, 41.179168], [-75.134765, 40.971045], [-75.052611, 40.866983], [-75.205966, 40.691721], [-75.195012, 40.576705], [-75.069042, 40.543843], [-75.058088, 40.417874], [-74.773287, 40.215227], [-74.82258, 40.127596], [-75.129289, 39.963288], [-75.145719, 39.88661], [-75.414089, 39.804456], [-75.616736, 39.831841], [-75.786521, 39.722302], [-79.477979, 39.722302], [-80.518598, 39.722302], [-80.518598, 40.636951], [-80.518598, 41.978802], [-80.518598, 41.978802], [-80.332382, 42.033571], [-79.76278, 42.269079], [-79.76278, 42.252649]]]
  	}
  }, {
  	type: "Feature",
  	id: "44",
  	properties: {
  		name: "Rhode Island"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-71.196845, 41.67757], [-71.120168, 41.496831], [-71.317338, 41.474923], [-71.196845, 41.67757]]], [[[-71.530939, 42.01714], [-71.383061, 42.01714], [-71.328292, 41.781632], [-71.22423, 41.710431], [-71.344723, 41.726862], [-71.448785, 41.578985], [-71.481646, 41.370861], [-71.859555, 41.321569], [-71.799309, 41.414677], [-71.799309, 42.006186], [-71.530939, 42.01714]]]]
  	}
  }, {
  	type: "Feature",
  	id: "45",
  	properties: {
  		name: "South Carolina"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-82.764143, 35.066903], [-82.550543, 35.160011], [-82.276696, 35.198349], [-81.044384, 35.149057], [-81.038907, 35.044995], [-80.934845, 35.105241], [-80.781491, 34.935456], [-80.797922, 34.820441], [-79.675149, 34.80401], [-78.541422, 33.851022], [-78.716684, 33.80173], [-78.935762, 33.637421], [-79.149363, 33.380005], [-79.187701, 33.171881], [-79.357487, 33.007573], [-79.582041, 33.007573], [-79.631334, 32.887081], [-79.866842, 32.755634], [-79.998289, 32.613234], [-80.206412, 32.552987], [-80.430967, 32.399633], [-80.452875, 32.328433], [-80.660998, 32.246279], [-80.885553, 32.032678], [-81.115584, 32.120309], [-81.121061, 32.290094], [-81.279893, 32.558464], [-81.416816, 32.629664], [-81.42777, 32.843265], [-81.493493, 33.007573], [-81.761863, 33.160928], [-81.937125, 33.347144], [-81.926172, 33.462159], [-82.194542, 33.631944], [-82.325988, 33.81816], [-82.55602, 33.94413], [-82.714851, 34.152254], [-82.747713, 34.26727], [-82.901067, 34.486347], [-83.005129, 34.469916], [-83.339222, 34.683517], [-83.322791, 34.787579], [-83.109191, 35.00118], [-82.764143, 35.066903]]]
  	}
  }, {
  	type: "Feature",
  	id: "46",
  	properties: {
  		name: "South Dakota"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-104.047534, 45.944106], [-96.560556, 45.933153], [-96.582464, 45.818137], [-96.856311, 45.604536], [-96.681049, 45.412843], [-96.451017, 45.297827], [-96.451017, 43.501391], [-96.582464, 43.479483], [-96.527695, 43.397329], [-96.560556, 43.222067], [-96.434587, 43.123482], [-96.511264, 43.052282], [-96.544125, 42.855112], [-96.631756, 42.707235], [-96.44554, 42.488157], [-96.626279, 42.515542], [-96.692003, 42.657942], [-97.217789, 42.844158], [-97.688806, 42.844158], [-97.831206, 42.866066], [-97.951699, 42.767481], [-98.466531, 42.94822], [-98.499393, 42.997512], [-101.626726, 42.997512], [-103.324578, 43.002989], [-104.053011, 43.002989], [-104.058488, 44.996596], [-104.042057, 44.996596], [-104.047534, 45.944106]]]
  	}
  }, {
  	type: "Feature",
  	id: "47",
  	properties: {
  		name: "Tennessee"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-88.054868, 36.496384], [-88.071299, 36.677123], [-87.852221, 36.633308], [-86.592525, 36.655216], [-85.486183, 36.616877], [-85.289013, 36.627831], [-84.544149, 36.594969], [-83.689746, 36.584015], [-83.673316, 36.600446], [-81.679709, 36.589492], [-81.723525, 36.353984], [-81.909741, 36.304691], [-82.03571, 36.118475], [-82.216449, 36.156814], [-82.610789, 35.965121], [-82.638174, 36.063706], [-82.775097, 35.997983], [-82.994175, 35.773428], [-83.251591, 35.718659], [-83.498053, 35.565304], [-83.7719, 35.559827], [-84.018363, 35.41195], [-84.09504, 35.247642], [-84.29221, 35.225734], [-84.319594, 34.990226], [-85.606675, 34.984749], [-87.359296, 35.00118], [-88.202745, 34.995703], [-88.471115, 34.995703], [-90.311367, 34.995703], [-90.212782, 35.023087], [-90.114197, 35.198349], [-90.130628, 35.439335], [-89.944412, 35.603643], [-89.911551, 35.756997], [-89.763673, 35.811767], [-89.730812, 35.997983], [-89.533642, 36.249922], [-89.539119, 36.496384], [-89.484349, 36.496384], [-89.418626, 36.496384], [-89.298133, 36.507338], [-88.054868, 36.496384]]]
  	}
  }, {
  	type: "Feature",
  	id: "48",
  	properties: {
  		name: "Texas"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-101.812942, 36.501861], [-100.000075, 36.501861], [-100.000075, 34.563024], [-99.923398, 34.573978], [-99.698843, 34.382285], [-99.57835, 34.415147], [-99.260688, 34.404193], [-99.189488, 34.2125], [-98.986841, 34.223454], [-98.767763, 34.135823], [-98.570593, 34.146777], [-98.488439, 34.064623], [-98.36247, 34.157731], [-98.170777, 34.113915], [-98.088623, 34.004376], [-97.946222, 33.987946], [-97.869545, 33.851022], [-97.694283, 33.982469], [-97.458774, 33.905791], [-97.371143, 33.823637], [-97.256128, 33.861976], [-97.173974, 33.736006], [-96.922034, 33.960561], [-96.850834, 33.845545], [-96.631756, 33.845545], [-96.423633, 33.774345], [-96.346956, 33.686714], [-96.149786, 33.840068], [-95.936185, 33.889361], [-95.8376, 33.834591], [-95.602092, 33.933176], [-95.547322, 33.878407], [-95.289906, 33.87293], [-95.224183, 33.960561], [-94.966767, 33.861976], [-94.868182, 33.74696], [-94.484796, 33.637421], [-94.380734, 33.544313], [-94.183564, 33.593606], [-94.041164, 33.54979], [-94.041164, 33.018527], [-94.041164, 31.994339], [-93.822086, 31.775262], [-93.816609, 31.556184], [-93.542762, 31.15089], [-93.526331, 30.93729], [-93.630393, 30.679874], [-93.728978, 30.575812], [-93.696116, 30.438888], [-93.767317, 30.334826], [-93.690639, 30.143133], [-93.926148, 29.787132], [-93.838517, 29.688547], [-94.002825, 29.68307], [-94.523134, 29.546147], [-94.70935, 29.622824], [-94.742212, 29.787132], [-94.873659, 29.672117], [-94.966767, 29.699501], [-95.016059, 29.557101], [-94.911997, 29.496854], [-94.895566, 29.310638], [-95.081782, 29.113469], [-95.383014, 28.867006], [-95.985477, 28.604113], [-96.045724, 28.647929], [-96.226463, 28.582205], [-96.23194, 28.642452], [-96.478402, 28.598636], [-96.593418, 28.724606], [-96.664618, 28.697221], [-96.401725, 28.439805], [-96.593418, 28.357651], [-96.774157, 28.406943], [-96.801542, 28.226204], [-97.026096, 28.039988], [-97.256128, 27.694941], [-97.404005, 27.333463], [-97.513544, 27.360848], [-97.540929, 27.229401], [-97.425913, 27.262263], [-97.480682, 26.99937], [-97.557359, 26.988416], [-97.562836, 26.840538], [-97.469728, 26.758384], [-97.442344, 26.457153], [-97.332805, 26.353091], [-97.30542, 26.161398], [-97.217789, 25.991613], [-97.524498, 25.887551], [-97.650467, 26.018997], [-97.885976, 26.06829], [-98.198161, 26.057336], [-98.466531, 26.221644], [-98.669178, 26.238075], [-98.822533, 26.369522], [-99.030656, 26.413337], [-99.173057, 26.539307], [-99.266165, 26.840538], [-99.446904, 27.021277], [-99.424996, 27.174632], [-99.50715, 27.33894], [-99.479765, 27.48134], [-99.605735, 27.640172], [-99.709797, 27.656603], [-99.879582, 27.799003], [-99.934351, 27.979742], [-100.082229, 28.14405], [-100.29583, 28.280974], [-100.399891, 28.582205], [-100.498476, 28.66436], [-100.629923, 28.905345], [-100.673738, 29.102515], [-100.799708, 29.244915], [-101.013309, 29.370885], [-101.062601, 29.458516], [-101.259771, 29.535193], [-101.413125, 29.754271], [-101.851281, 29.803563], [-102.114174, 29.792609], [-102.338728, 29.869286], [-102.388021, 29.765225], [-102.629006, 29.732363], [-102.809745, 29.524239], [-102.919284, 29.190146], [-102.97953, 29.184669], [-103.116454, 28.987499], [-103.280762, 28.982022], [-103.527224, 29.135376], [-104.146119, 29.381839], [-104.266611, 29.513285], [-104.507597, 29.639255], [-104.677382, 29.924056], [-104.688336, 30.181472], [-104.858121, 30.389596], [-104.896459, 30.570335], [-105.005998, 30.685351], [-105.394861, 30.855136], [-105.602985, 31.085167], [-105.77277, 31.167321], [-105.953509, 31.364491], [-106.205448, 31.468553], [-106.38071, 31.731446], [-106.528588, 31.786216], [-106.643603, 31.901231], [-106.616219, 31.999816], [-103.067161, 31.999816], [-103.067161, 33.002096], [-103.045254, 34.01533], [-103.039777, 36.501861], [-103.001438, 36.501861], [-101.812942, 36.501861]]]
  	}
  }, {
  	type: "Feature",
  	id: "49",
  	properties: {
  		name: "Utah"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-112.164359, 41.995232], [-111.047063, 42.000709], [-111.047063, 40.998429], [-109.04798, 40.998429], [-109.053457, 39.125316], [-109.058934, 38.27639], [-109.042503, 38.166851], [-109.042503, 37.000263], [-110.499369, 37.00574], [-114.048427, 37.000263], [-114.04295, 41.995232], [-112.164359, 41.995232]]]
  	}
  }, {
  	type: "Feature",
  	id: "50",
  	properties: {
  		name: "Vermont"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-71.503554, 45.013027], [-71.4926, 44.914442], [-71.629524, 44.750133], [-71.536416, 44.585825], [-71.700724, 44.41604], [-72.034817, 44.322932], [-72.02934, 44.07647], [-72.116971, 43.994316], [-72.204602, 43.769761], [-72.379864, 43.572591], [-72.456542, 43.150867], [-72.445588, 43.008466], [-72.533219, 42.953697], [-72.544173, 42.80582], [-72.456542, 42.729142], [-73.267129, 42.745573], [-73.278083, 42.833204], [-73.245221, 43.523299], [-73.404052, 43.687607], [-73.349283, 43.769761], [-73.436914, 44.043608], [-73.321898, 44.246255], [-73.294514, 44.437948], [-73.387622, 44.618687], [-73.332852, 44.804903], [-73.343806, 45.013027], [-72.308664, 45.002073], [-71.503554, 45.013027]]]
  	}
  }, {
  	type: "Feature",
  	id: "51",
  	properties: {
  		name: "Virginia"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-75.397659, 38.013497], [-75.244304, 38.029928], [-75.375751, 37.860142], [-75.512674, 37.799896], [-75.594828, 37.569865], [-75.802952, 37.197433], [-75.972737, 37.120755], [-76.027507, 37.257679], [-75.939876, 37.564388], [-75.671506, 37.95325], [-75.397659, 38.013497]]], [[[-76.016553, 37.95325], [-75.994645, 37.95325], [-76.043938, 37.95325], [-76.016553, 37.95325]]], [[[-78.349729, 39.464886], [-77.82942, 39.130793], [-77.719881, 39.322485], [-77.566527, 39.306055], [-77.456988, 39.223901], [-77.456988, 39.076023], [-77.248864, 39.026731], [-77.117418, 38.933623], [-77.040741, 38.791222], [-77.128372, 38.632391], [-77.248864, 38.588575], [-77.325542, 38.446175], [-77.281726, 38.342113], [-77.013356, 38.374975], [-76.964064, 38.216144], [-76.613539, 38.15042], [-76.514954, 38.024451], [-76.235631, 37.887527], [-76.3616, 37.608203], [-76.246584, 37.389126], [-76.383508, 37.285064], [-76.399939, 37.159094], [-76.273969, 37.082417], [-76.410893, 36.961924], [-76.619016, 37.120755], [-76.668309, 37.065986], [-76.48757, 36.95097], [-75.994645, 36.923586], [-75.868676, 36.551154], [-79.510841, 36.5402], [-80.294043, 36.545677], [-80.978661, 36.562108], [-81.679709, 36.589492], [-83.673316, 36.600446], [-83.136575, 36.742847], [-83.070852, 36.852385], [-82.879159, 36.890724], [-82.868205, 36.978355], [-82.720328, 37.044078], [-82.720328, 37.120755], [-82.353373, 37.268633], [-81.969987, 37.537003], [-81.986418, 37.454849], [-81.849494, 37.285064], [-81.679709, 37.20291], [-81.55374, 37.208387], [-81.362047, 37.339833], [-81.225123, 37.235771], [-80.967707, 37.290541], [-80.513121, 37.482234], [-80.474782, 37.421987], [-80.29952, 37.509618], [-80.294043, 37.690357], [-80.184505, 37.849189], [-79.998289, 37.997066], [-79.921611, 38.177805], [-79.724442, 38.364021], [-79.647764, 38.594052], [-79.477979, 38.457129], [-79.313671, 38.413313], [-79.209609, 38.495467], [-78.996008, 38.851469], [-78.870039, 38.763838], [-78.404499, 39.169131], [-78.349729, 39.464886]]]]
  	}
  }, {
  	type: "Feature",
  	id: "53",
  	properties: {
  		name: "Washington"
  	},
  	geometry: {
  		type: "MultiPolygon",
  		coordinates: [[[[-117.033359, 49.000239], [-117.044313, 47.762451], [-117.038836, 46.426077], [-117.055267, 46.343923], [-116.92382, 46.168661], [-116.918344, 45.993399], [-118.988627, 45.998876], [-119.125551, 45.933153], [-119.525367, 45.911245], [-119.963522, 45.823614], [-120.209985, 45.725029], [-120.505739, 45.697644], [-120.637186, 45.746937], [-121.18488, 45.604536], [-121.217742, 45.670259], [-121.535404, 45.725029], [-121.809251, 45.708598], [-122.247407, 45.549767], [-122.762239, 45.659305], [-122.811531, 45.960537], [-122.904639, 46.08103], [-123.11824, 46.185092], [-123.211348, 46.174138], [-123.370179, 46.146753], [-123.545441, 46.261769], [-123.72618, 46.300108], [-123.874058, 46.239861], [-124.065751, 46.327492], [-124.027412, 46.464416], [-123.895966, 46.535616], [-124.098612, 46.74374], [-124.235536, 47.285957], [-124.31769, 47.357157], [-124.427229, 47.740543], [-124.624399, 47.88842], [-124.706553, 48.184175], [-124.597014, 48.381345], [-124.394367, 48.288237], [-123.983597, 48.162267], [-123.704273, 48.167744], [-123.424949, 48.118452], [-123.162056, 48.167744], [-123.036086, 48.080113], [-122.800578, 48.08559], [-122.636269, 47.866512], [-122.515777, 47.882943], [-122.493869, 47.587189], [-122.422669, 47.318818], [-122.324084, 47.346203], [-122.422669, 47.576235], [-122.395284, 47.800789], [-122.230976, 48.030821], [-122.362422, 48.123929], [-122.373376, 48.288237], [-122.471961, 48.468976], [-122.422669, 48.600422], [-122.488392, 48.753777], [-122.647223, 48.775685], [-122.795101, 48.8907], [-122.756762, 49.000239], [-117.033359, 49.000239]]], [[[-122.718423, 48.310145], [-122.586977, 48.35396], [-122.608885, 48.151313], [-122.767716, 48.227991], [-122.718423, 48.310145]]], [[[-123.025132, 48.583992], [-122.915593, 48.715438], [-122.767716, 48.556607], [-122.811531, 48.419683], [-123.041563, 48.458022], [-123.025132, 48.583992]]]]
  	}
  }, {
  	type: "Feature",
  	id: "54",
  	properties: {
  		name: "West Virginia"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-80.518598, 40.636951], [-80.518598, 39.722302], [-79.477979, 39.722302], [-79.488933, 39.20747], [-79.291763, 39.300578], [-79.094593, 39.470363], [-78.963147, 39.437501], [-78.765977, 39.585379], [-78.470222, 39.514178], [-78.431884, 39.623717], [-78.267575, 39.61824], [-78.174467, 39.694917], [-78.004682, 39.601809], [-77.834897, 39.601809], [-77.719881, 39.322485], [-77.82942, 39.130793], [-78.349729, 39.464886], [-78.404499, 39.169131], [-78.870039, 38.763838], [-78.996008, 38.851469], [-79.209609, 38.495467], [-79.313671, 38.413313], [-79.477979, 38.457129], [-79.647764, 38.594052], [-79.724442, 38.364021], [-79.921611, 38.177805], [-79.998289, 37.997066], [-80.184505, 37.849189], [-80.294043, 37.690357], [-80.29952, 37.509618], [-80.474782, 37.421987], [-80.513121, 37.482234], [-80.967707, 37.290541], [-81.225123, 37.235771], [-81.362047, 37.339833], [-81.55374, 37.208387], [-81.679709, 37.20291], [-81.849494, 37.285064], [-81.986418, 37.454849], [-81.969987, 37.537003], [-82.101434, 37.553434], [-82.293127, 37.668449], [-82.342419, 37.783465], [-82.50125, 37.931343], [-82.621743, 38.123036], [-82.594358, 38.424267], [-82.331465, 38.446175], [-82.293127, 38.577622], [-82.172634, 38.632391], [-82.221926, 38.785745], [-82.03571, 39.026731], [-81.887833, 38.873376], [-81.783771, 38.966484], [-81.811156, 39.0815], [-81.685186, 39.273193], [-81.57017, 39.267716], [-81.455155, 39.410117], [-81.345616, 39.344393], [-81.219646, 39.388209], [-80.830783, 39.711348], [-80.737675, 40.078303], [-80.600752, 40.319289], [-80.595275, 40.472643], [-80.666475, 40.582182], [-80.518598, 40.636951]]]
  	}
  }, {
  	type: "Feature",
  	id: "55",
  	properties: {
  		name: "Wisconsin"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-90.415429, 46.568478], [-90.229213, 46.508231], [-90.119674, 46.338446], [-89.09001, 46.135799], [-88.662808, 45.987922], [-88.531362, 46.020784], [-88.10416, 45.922199], [-87.989145, 45.796229], [-87.781021, 45.675736], [-87.791975, 45.500474], [-87.885083, 45.363551], [-87.649574, 45.341643], [-87.742682, 45.199243], [-87.589328, 45.095181], [-87.627666, 44.974688], [-87.819359, 44.95278], [-87.983668, 44.722749], [-88.043914, 44.563917], [-87.928898, 44.536533], [-87.775544, 44.640595], [-87.611236, 44.837764], [-87.403112, 44.914442], [-87.238804, 45.166381], [-87.03068, 45.22115], [-87.047111, 45.089704], [-87.189511, 44.969211], [-87.468835, 44.552964], [-87.545512, 44.322932], [-87.540035, 44.158624], [-87.644097, 44.103854], [-87.737205, 43.8793], [-87.704344, 43.687607], [-87.791975, 43.561637], [-87.912467, 43.249452], [-87.885083, 43.002989], [-87.76459, 42.783912], [-87.802929, 42.493634], [-88.788778, 42.493634], [-90.639984, 42.510065], [-90.711184, 42.636034], [-91.067185, 42.75105], [-91.143862, 42.909881], [-91.176724, 43.134436], [-91.056231, 43.254929], [-91.204109, 43.353514], [-91.215062, 43.501391], [-91.269832, 43.616407], [-91.242447, 43.775238], [-91.43414, 43.994316], [-91.592971, 44.032654], [-91.877772, 44.202439], [-91.927065, 44.333886], [-92.233773, 44.443425], [-92.337835, 44.552964], [-92.545959, 44.569394], [-92.808852, 44.750133], [-92.737652, 45.117088], [-92.75956, 45.286874], [-92.644544, 45.440228], [-92.770513, 45.566198], [-92.885529, 45.577151], [-92.869098, 45.719552], [-92.639067, 45.933153], [-92.354266, 46.015307], [-92.29402, 46.075553], [-92.29402, 46.667063], [-92.091373, 46.749217], [-92.014696, 46.705401], [-91.790141, 46.694447], [-91.09457, 46.864232], [-90.837154, 46.95734], [-90.749522, 46.88614], [-90.886446, 46.754694], [-90.55783, 46.584908], [-90.415429, 46.568478]]]
  	}
  }, {
  	type: "Feature",
  	id: "56",
  	properties: {
  		name: "Wyoming"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-109.080842, 45.002073], [-105.91517, 45.002073], [-104.058488, 44.996596], [-104.053011, 43.002989], [-104.053011, 41.003906], [-105.728954, 40.998429], [-107.919731, 41.003906], [-109.04798, 40.998429], [-111.047063, 40.998429], [-111.047063, 42.000709], [-111.047063, 44.476286], [-111.05254, 45.002073], [-109.080842, 45.002073]]]
  	}
  }, {
  	type: "Feature",
  	id: "72",
  	properties: {
  		name: "Puerto Rico"
  	},
  	geometry: {
  		type: "Polygon",
  		coordinates: [[[-66.448338, 17.984326], [-66.771478, 18.006234], [-66.924832, 17.929556], [-66.985078, 17.973372], [-67.209633, 17.956941], [-67.154863, 18.19245], [-67.269879, 18.362235], [-67.094617, 18.515589], [-66.957694, 18.488204], [-66.409999, 18.488204], [-65.840398, 18.433435], [-65.632274, 18.367712], [-65.626797, 18.203403], [-65.730859, 18.186973], [-65.834921, 18.017187], [-66.234737, 17.929556], [-66.448338, 17.984326]]]
  	}
  }];
  var UsGEO = {
  	type: type,
  	features: features
  };

  var DefaultOptions = {
    chart: {
      type: 'choropleth'
    },
    plots: {
      emptyDataColor: '#ffffff',
      fillOpacity: 0.8,
      stroke: '#ffffff',
      strokeDashArray: '5,1',
      strokeHighlight: '#8f8d8b',
      strokeWidth: 1.5,
      strokeWidthHighlight: 3
    },
    color: {
      scheme: MetroCold5,
      type: Globals.ColorType.GRADIENT
    },
    map: {
      tileLayer: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RhcmUiLCJhIjoiNGQxOGM0Yzk0ZjQ2ZjJhMGMyY2I3ZDBlYTEzNmJjM2MifQ.fBHV208tbilSeMaNQIa9zQ',
      layerOptions: {
        maxZoom: 18,
        detectRetina: true,
        id: 'stare.op5mde27'
      },
      center: [37.8, -96.9],
      zoomLevel: 4
    }
  };

  var composers = {
    opt: DefaultOptions,
    data: function data(_data, opt) {
      var geo = Object.assign({}, opt.geojson ? opt.geojson : UsGEO);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var d = _step.value;

          var province = d.properties.name;
          var datum = _data.find(function (cDatum) {
            return getDimensionVal(opt)(cDatum) === province;
          });

          if (!datum) {
            d[getMetric(opt).accessor] = 0;
          } else {
            d[getMetric(opt).accessor] = getMetricVal(opt)(datum);
          }

          d[getDimension(opt).accessor] = province;
        };

        for (var _iterator = geo.features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
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

      return geo;
    },

    color: function color(colorOpt, data, opt) {
      var _array = data.features.map(getMetricVal(opt));
      return gradientColor(colorOpt, _array);
    }
  };
  var index = factory(svgLayer, composers, [apiRender$2, apiColor$1, apiChangeRasterLayer]);

  exports.version = version;
  exports.choropleth = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vizart-geo.standalone.js.map
