(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VizArtPath = {})));
}(this, (function (exports) { 'use strict';

  var version = "2.0.4";

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

  function define$1 (constructor, factory, prototype) {
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

  define$1(Color, color, {
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

  define$1(Rgb, rgb, extend(Color, {
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

  define$1(Hsl, hsl, extend(Color, {
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

  define$1(Lab, lab, extend(Color, {
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

  define$1(Hcl, hcl, extend(Color, {
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

  define$1(Cubehelix, cubehelix, extend(Color, {
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

  function constant (x) {
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
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function (a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
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

  function array (a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) {
      x[i] = interpolate(a[i], b[i]);
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

  function reinterpolate (a, b) {
    return a = +a, b -= a, function (t) {
      return a + b * t;
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function object (a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || (typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") a = {};
    if (b === null || (typeof b === "undefined" ? "undefined" : _typeof(b)) !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate(a[k], b[k]);
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
        q.push({ i: i, x: reinterpolate(am, bm) });
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

  function interpolate (a, b) {
      var t = typeof b === "undefined" ? "undefined" : _typeof(b),
          c;
      return b == null || t === "boolean" ? constant(b) : (t === "number" ? reinterpolate : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? array : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : reinterpolate)(a, b);
  }

  function interpolateRound (a, b) {
    return a = +a, b -= a, function (t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity = {
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
    if (value === "none") return identity;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
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
        q.push({ i: i - 4, x: reinterpolate(xa, xb) }, { i: i - 2, x: reinterpolate(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: reinterpolate(a, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: reinterpolate(a, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i - 4, x: reinterpolate(xa, xb) }, { i: i - 2, x: reinterpolate(ya, yb) });
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

  var rainbow = cubehelix();

  function interpolateRainbow (t) {
    if (t < 0 || t > 1) t -= Math.floor(t);
    var ts = Math.abs(t - 0.5);
    rainbow.h = 360 * t - 100;
    rainbow.s = 1.5 - 1.5 * ts;
    rainbow.l = 0.8 - 0.9 * ts;
    return rainbow + "";
  }

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

  function descending (a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

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

  function sum (values, valueof) {
    var n = values.length,
        i = -1,
        value,
        sum = 0;

    if (valueof == null) {
      while (++i < n) {
        if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
      }
    } else {
      while (++i < n) {
        if (value = +valueof(values[i], i, values)) sum += value;
      }
    }

    return sum;
  }

  var prefix = "$";

  function Map$1() {}

  Map$1.prototype = map$1.prototype = {
    constructor: Map$1,
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
    var map = new Map$1();

    // Copy constructor.
    if (object instanceof Map$1) object.each(function (value, key) {
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

  function nest () {
    var keys = [],
        _sortKeys = [],
        _sortValues,
        _rollup,
        nest;

    function apply(array, depth, createResult, setResult) {
      if (depth >= keys.length) {
        if (_sortValues != null) array.sort(_sortValues);
        return _rollup != null ? _rollup(array) : array;
      }

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = map$1(),
          values,
          result = createResult();

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.each(function (values, key) {
        setResult(result, key, apply(values, depth, createResult, setResult));
      });

      return result;
    }

    function _entries(map, depth) {
      if (++depth > keys.length) return map;
      var array,
          sortKey = _sortKeys[depth - 1];
      if (_rollup != null && depth >= keys.length) array = map.entries();else array = [], map.each(function (v, k) {
        array.push({ key: k, values: _entries(v, depth) });
      });
      return sortKey != null ? array.sort(function (a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }

    return nest = {
      object: function object(array) {
        return apply(array, 0, createObject, setObject);
      },
      map: function map(array) {
        return apply(array, 0, createMap, setMap);
      },
      entries: function entries(array) {
        return _entries(apply(array, 0, createMap, setMap), 0);
      },
      key: function key(d) {
        keys.push(d);return nest;
      },
      sortKeys: function sortKeys(order) {
        _sortKeys[keys.length - 1] = order;return nest;
      },
      sortValues: function sortValues(order) {
        _sortValues = order;return nest;
      },
      rollup: function rollup(f) {
        _rollup = f;return nest;
      }
    };
  }

  function createObject() {
    return {};
  }

  function setObject(object, key, value) {
    object[key] = value;
  }

  function createMap() {
    return map$1();
  }

  function setMap(map, key, value) {
    map.set(key, value);
  }

  function Set() {}

  var proto = map$1.prototype;

  Set.prototype = set$1.prototype = {
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

  function set$1(object, f) {
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

  function keys (map) {
    var keys = [];
    for (var key in map) {
      keys.push(key);
    }return keys;
  }

  function entries (map) {
    var entries = [];
    for (var key in map) {
      entries.push({ key: key, value: map[key] });
    }return entries;
  }

  var array$2 = Array.prototype;

  var map$2 = array$2.map;
  var slice$1 = array$2.slice;

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

  function band() {
    var scale = ordinal().unknown(undefined),
        domain = scale.domain,
        ordinalRange = scale.range,
        range$$1 = [0, 1],
        step,
        bandwidth,
        round = false,
        paddingInner = 0,
        paddingOuter = 0,
        align = 0.5;

    delete scale.unknown;

    function rescale() {
      var n = domain().length,
          reverse = range$$1[1] < range$$1[0],
          start = range$$1[reverse - 0],
          stop = range$$1[1 - reverse];
      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
      if (round) step = Math.floor(step);
      start += (stop - start - step * (n - paddingInner)) * align;
      bandwidth = step * (1 - paddingInner);
      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
      var values = sequence(n).map(function (i) {
        return start + step * i;
      });
      return ordinalRange(reverse ? values.reverse() : values);
    }

    scale.domain = function (_) {
      return arguments.length ? (domain(_), rescale()) : domain();
    };

    scale.range = function (_) {
      return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
    };

    scale.rangeRound = function (_) {
      return range$$1 = [+_[0], +_[1]], round = true, rescale();
    };

    scale.bandwidth = function () {
      return bandwidth;
    };

    scale.step = function () {
      return step;
    };

    scale.round = function (_) {
      return arguments.length ? (round = !!_, rescale()) : round;
    };

    scale.padding = function (_) {
      return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingInner = function (_) {
      return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
    };

    scale.paddingOuter = function (_) {
      return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
    };

    scale.align = function (_) {
      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
    };

    scale.copy = function () {
      return band().domain(domain()).range(range$$1).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
    };

    return rescale();
  }

  function pointish(scale) {
    var copy = scale.copy;

    scale.padding = scale.paddingOuter;
    delete scale.paddingInner;
    delete scale.paddingOuter;

    scale.copy = function () {
      return pointish(copy());
    };

    return scale;
  }

  function point() {
    return pointish(band().paddingInner(1));
  }

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

  function reinterpolateClamp(reinterpolate$$1) {
    return function (a, b) {
      var r = reinterpolate$$1(a = +a, b = +b);
      return function (t) {
        return t <= 0 ? a : t >= 1 ? b : r(t);
      };
    };
  }

  function bimap(domain, range, deinterpolate, reinterpolate$$1) {
    var d0 = domain[0],
        d1 = domain[1],
        r0 = range[0],
        r1 = range[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate$$1(r1, r0);else d0 = deinterpolate(d0, d1), r0 = reinterpolate$$1(r0, r1);
    return function (x) {
      return r0(d0(x));
    };
  }

  function polymap(domain, range, deinterpolate, reinterpolate$$1) {
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
      r[i] = reinterpolate$$1(range[i], range[i + 1]);
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
  function continuous(deinterpolate, reinterpolate$$1) {
    var domain = unit,
        range = unit,
        interpolate$$1 = interpolate,
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
      return (input || (input = piecewise$$1(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate$$1) : reinterpolate$$1)))(+y);
    };

    scale.domain = function (_) {
      return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
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
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

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
    var scale = continuous(deinterpolateLinear, reinterpolate);

    scale.copy = function () {
      return copy(scale, linear$1());
    };

    return linearish(scale);
  }

  function nice (domain, interval) {
    domain = domain.slice();

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;

    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }

    domain[i0] = interval.floor(x0);
    domain[i1] = interval.ceil(x1);
    return domain;
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

  var minute = newInterval(function (date) {
    date.setTime(Math.floor(date / durationMinute) * durationMinute);
  }, function (date, step) {
    date.setTime(+date + step * durationMinute);
  }, function (start, end) {
    return (end - start) / durationMinute;
  }, function (date) {
    return date.getMinutes();
  });

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

  var day = newInterval(function (date) {
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function (date) {
    return date.getDate() - 1;
  });

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

  var utcMinute = newInterval(function (date) {
    date.setUTCSeconds(0, 0);
  }, function (date, step) {
    date.setTime(+date + step * durationMinute);
  }, function (start, end) {
    return (end - start) / durationMinute;
  }, function (date) {
    return date.getUTCMinutes();
  });

  var utcHour = newInterval(function (date) {
    date.setUTCMinutes(0, 0, 0);
  }, function (date, step) {
    date.setTime(+date + step * durationHour);
  }, function (start, end) {
    return (end - start) / durationHour;
  }, function (date) {
    return date.getUTCHours();
  });

  var utcDay = newInterval(function (date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function (start, end) {
    return (end - start) / durationDay;
  }, function (date) {
    return date.getUTCDate() - 1;
  });

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

  var durationSecond$1 = 1000,
      durationMinute$1 = durationSecond$1 * 60,
      durationHour$1 = durationMinute$1 * 60,
      durationDay$1 = durationHour$1 * 24,
      durationWeek$1 = durationDay$1 * 7,
      durationMonth = durationDay$1 * 30,
      durationYear = durationDay$1 * 365;

  function date$1(t) {
    return new Date(t);
  }

  function number$2(t) {
    return t instanceof Date ? +t : +new Date(+t);
  }

  function calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format) {
    var scale = continuous(deinterpolateLinear, reinterpolate),
        invert = scale.invert,
        domain = scale.domain;

    var formatMillisecond = format(".%L"),
        formatSecond = format(":%S"),
        formatMinute = format("%I:%M"),
        formatHour = format("%I %p"),
        formatDay = format("%a %d"),
        formatWeek = format("%b %d"),
        formatMonth = format("%B"),
        formatYear = format("%Y");

    var tickIntervals = [[second$$1, 1, durationSecond$1], [second$$1, 5, 5 * durationSecond$1], [second$$1, 15, 15 * durationSecond$1], [second$$1, 30, 30 * durationSecond$1], [minute$$1, 1, durationMinute$1], [minute$$1, 5, 5 * durationMinute$1], [minute$$1, 15, 15 * durationMinute$1], [minute$$1, 30, 30 * durationMinute$1], [hour$$1, 1, durationHour$1], [hour$$1, 3, 3 * durationHour$1], [hour$$1, 6, 6 * durationHour$1], [hour$$1, 12, 12 * durationHour$1], [day$$1, 1, durationDay$1], [day$$1, 2, 2 * durationDay$1], [week, 1, durationWeek$1], [month$$1, 1, durationMonth], [month$$1, 3, 3 * durationMonth], [year$$1, 1, durationYear]];

    function tickFormat(date$$1) {
      return (second$$1(date$$1) < date$$1 ? formatMillisecond : minute$$1(date$$1) < date$$1 ? formatSecond : hour$$1(date$$1) < date$$1 ? formatMinute : day$$1(date$$1) < date$$1 ? formatHour : month$$1(date$$1) < date$$1 ? week(date$$1) < date$$1 ? formatDay : formatWeek : year$$1(date$$1) < date$$1 ? formatMonth : formatYear)(date$$1);
    }

    function tickInterval(interval, start, stop, step) {
      if (interval == null) interval = 10;

      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // Otherwise, assume interval is already a time interval and use it.
      if (typeof interval === "number") {
        var target = Math.abs(stop - start) / interval,
            i = bisector(function (i) {
          return i[2];
        }).right(tickIntervals, target);
        if (i === tickIntervals.length) {
          step = tickStep(start / durationYear, stop / durationYear, interval);
          interval = year$$1;
        } else if (i) {
          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
          step = i[1];
          interval = i[0];
        } else {
          step = Math.max(tickStep(start, stop, interval), 1);
          interval = millisecond$$1;
        }
      }

      return step == null ? interval : interval.every(step);
    }

    scale.invert = function (y) {
      return new Date(invert(y));
    };

    scale.domain = function (_) {
      return arguments.length ? domain(map$2.call(_, number$2)) : domain().map(date$1);
    };

    scale.ticks = function (interval, step) {
      var d = domain(),
          t0 = d[0],
          t1 = d[d.length - 1],
          r = t1 < t0,
          t;
      if (r) t = t0, t0 = t1, t1 = t;
      t = tickInterval(interval, t0, t1, step);
      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
      return r ? t.reverse() : t;
    };

    scale.tickFormat = function (count, specifier) {
      return specifier == null ? tickFormat : format(specifier);
    };

    scale.nice = function (interval, step) {
      var d = domain();
      return (interval = tickInterval(interval, d[0], d[d.length - 1], step)) ? domain(nice(d, interval)) : scale;
    };

    scale.copy = function () {
      return copy(scale, calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format));
    };

    return scale;
  }

  function scaleTime () {
    return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
  }

  function sequential(interpolator) {
    var x0 = 0,
        x1 = 1,
        clamp = false;

    function scale(x) {
      var t = (x - x0) / (x1 - x0);
      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
    }

    scale.domain = function (_) {
      return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
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

  function constant$3 (x) {
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

    if (typeof value !== "function") value = constant$3(value);

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

  function parseTypenames(typenames) {
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
    var typenames = parseTypenames(typename + ""),
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

  function customEvent(event1, listener, that, args) {
    var event0 = event;
    event1.sourceEvent = event;
    event = event1;
    try {
      return listener.apply(that, args);
    } finally {
      event = event0;
    }
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

  function selectAll (selector) {
      return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([selector == null ? [] : selector], root);
  }

  function touch (node, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return point$1(node, touch);
      }
    }

    return null;
  }

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

  function parseTypenames$1(typenames, types) {
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
          T = parseTypenames$1(typename + "", _),
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

    if (schemeLen === 0) ; else if (dataLen === 1) {
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

  var defaultComposers = {
    opt: null,
    data: function data(_data, opt, cleanse) {
      return _data;
    },
    color: function color$$1(_color, data, opt) {
      return genericColor(_color);
    }
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
  var Map$2 = getNative(root$1, 'Map');

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
      'map': new (Map$2 || ListCache)(),
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
      if (!Map$2 || pairs$$1.length < LARGE_ARRAY_SIZE - 1) {
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
  var Uint8Array$1 = root$1.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
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
    return key == '__proto__' ? undefined : object[key];
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
  var objectProto$10 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

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
        } else if (!isObject(objValue) || srcIndex && isFunction(objValue)) {
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

  var BaseOpt = {
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

  var mergeOptions = function mergeOptions() {
    for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
      opts[_key] = arguments[_key];
    }

    var base = Object.assign({}, BaseOpt);

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
    var state = initState(containerId, opt, Object.assign({}, defaultComposers, composers));

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

  var DefaultCategoricalColor = {
    scheme: TheMetLight,
    type: Globals.ColorType.CATEGORICAL
  };

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  var wrapSVGText = function wrapSVGText(text, width) {
    text.each(function () {
      var text = select(this),
          words = text.text().split(/\s+/).reverse(),
          word = void 0,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4,

      // ems
      y = text.attr('y'),
          x = text.attr('x'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    });
  };

  /**
   * requestAnimationFrame version: "0.0.23" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
   * Available via the MIT license.
   * see: http://github.com/cagosta/requestAnimationFrame for details
   *
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
   * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
   * MIT license
   *
   */

  (function (global) {

      (function () {

          if (global.requestAnimationFrame) {

              return;
          }

          if (global.webkitRequestAnimationFrame) {
              // Chrome <= 23, Safari <= 6.1, Blackberry 10

              global.requestAnimationFrame = global['webkitRequestAnimationFrame'];
              global.cancelAnimationFrame = global['webkitCancelAnimationFrame'] || global['webkitCancelRequestAnimationFrame'];
              return;
          }

          // IE <= 9, Android <= 4.3, very old/rare browsers

          var lastTime = 0;

          global.requestAnimationFrame = function (callback) {

              var currTime = new Date().getTime();

              var timeToCall = Math.max(0, 16 - (currTime - lastTime));

              var id = global.setTimeout(function () {

                  callback(currTime + timeToCall);
              }, timeToCall);

              lastTime = currTime + timeToCall;

              return id; // return the id for cancellation capabilities
          };

          global.cancelAnimationFrame = function (id) {

              clearTimeout(id);
          };
      })();

      if (typeof define === 'function') {

          define(function () {

              return global.requestAnimationFrame;
          });
      }
  })(window);

  function nopropagation() {
    event.stopImmediatePropagation();
  }

  function noevent () {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function dragDisable (view) {
    var root = view.document.documentElement,
        selection$$1 = select(view).on("dragstart.drag", noevent, true);
    if ("onselectstart" in root) {
      selection$$1.on("selectstart.drag", noevent, true);
    } else {
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    }
  }

  function yesdrag(view, noclick) {
    var root = view.document.documentElement,
        selection$$1 = select(view).on("dragstart.drag", null);
    if (noclick) {
      selection$$1.on("click.drag", noevent, true);
      setTimeout(function () {
        selection$$1.on("click.drag", null);
      }, 0);
    }
    if ("onselectstart" in root) {
      selection$$1.on("selectstart.drag", null);
    } else {
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    }
  }

  function constant$6 (x) {
    return function () {
      return x;
    };
  }

  function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
    this.target = target;
    this.type = type;
    this.subject = subject;
    this.identifier = id;
    this.active = active;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this._ = dispatch;
  }

  DragEvent.prototype.on = function () {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  };

  // Ignore right-click, since that should open the context menu.
  function defaultFilter() {
    return !event.button;
  }

  function defaultContainer() {
    return this.parentNode;
  }

  function defaultSubject(d) {
    return d == null ? { x: event.x, y: event.y } : d;
  }

  function defaultTouchable() {
    return "ontouchstart" in this;
  }

  function drag () {
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        touchable = defaultTouchable,
        gestures = {},
        listeners = dispatch("start", "drag", "end"),
        active = 0,
        mousedownx,
        mousedowny,
        mousemoving,
        touchending,
        clickDistance2 = 0;

    function drag(selection$$1) {
      selection$$1.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    function mousedowned() {
      if (touchending || !filter.apply(this, arguments)) return;
      var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
      if (!gesture) return;
      select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
      dragDisable(event.view);
      nopropagation();
      mousemoving = false;
      mousedownx = event.clientX;
      mousedowny = event.clientY;
      gesture("start");
    }

    function mousemoved() {
      noevent();
      if (!mousemoving) {
        var dx = event.clientX - mousedownx,
            dy = event.clientY - mousedowny;
        mousemoving = dx * dx + dy * dy > clickDistance2;
      }
      gestures.mouse("drag");
    }

    function mouseupped() {
      select(event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(event.view, mousemoving);
      noevent();
      gestures.mouse("end");
    }

    function touchstarted() {
      if (!filter.apply(this, arguments)) return;
      var touches$$1 = event.changedTouches,
          c = container.apply(this, arguments),
          n = touches$$1.length,
          i,
          gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = beforestart(touches$$1[i].identifier, c, touch, this, arguments)) {
          nopropagation();
          gesture("start");
        }
      }
    }

    function touchmoved() {
      var touches$$1 = event.changedTouches,
          n = touches$$1.length,
          i,
          gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches$$1[i].identifier]) {
          noevent();
          gesture("drag");
        }
      }
    }

    function touchended() {
      var touches$$1 = event.changedTouches,
          n = touches$$1.length,
          i,
          gesture;

      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function () {
        touchending = null;
      }, 500); // Ghost clicks are delayed!
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches$$1[i].identifier]) {
          nopropagation();
          gesture("end");
        }
      }
    }

    function beforestart(id, container, point, that, args) {
      var p = point(container, id),
          s,
          dx,
          dy,
          sublisteners = listeners.copy();

      if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function () {
        if ((event.subject = s = subject.apply(that, args)) == null) return false;
        dx = s.x - p[0] || 0;
        dy = s.y - p[1] || 0;
        return true;
      })) return;

      return function gesture(type) {
        var p0 = p,
            n;
        switch (type) {
          case "start":
            gestures[id] = gesture, n = active++;break;
          case "end":
            delete gestures[id], --active; // nobreak
          case "drag":
            p = point(container, id), n = active;break;
        }
        customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
      };
    }

    drag.filter = function (_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$6(!!_), drag) : filter;
    };

    drag.container = function (_) {
      return arguments.length ? (container = typeof _ === "function" ? _ : constant$6(_), drag) : container;
    };

    drag.subject = function (_) {
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant$6(_), drag) : subject;
    };

    drag.touchable = function (_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$6(!!_), drag) : touchable;
    };

    drag.on = function () {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    };

    drag.clickDistance = function (_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };

    return drag;
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

  var emptyOn = dispatch("start", "end", "interrupt");
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
    var schedule = get$2(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$3(node, id) {
    var schedule = get$2(node, id);
    if (schedule.state > STARTING) throw new Error("too late; already started");
    return schedule;
  }

  function get$2(node, id) {
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
      var schedule$$1 = set$3(this, id),
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
      var schedule$$1 = set$3(this, id),
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
      var tween = get$2(this.node(), id).tween;
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
      var schedule$$1 = set$3(this, id);
      (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
    });

    return function (node) {
      return get$2(node, id).value[name];
    };
  }

  function interpolate$1 (a, b) {
      var c;
      return (typeof b === "number" ? reinterpolate : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
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
        i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
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

    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$2(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function () {
      set$3(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function () {
      set$3(this, id).duration = value;
    };
  }

  function transition_duration (value) {
    var id = this._id;

    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$2(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error();
    return function () {
      set$3(this, id).ease = value;
    };
  }

  function transition_ease (value) {
    var id = this._id;

    return arguments.length ? this.each(easeConstant(id, value)) : get$2(this.node(), id).ease;
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
        sit = start(name) ? init : set$3;
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

    return arguments.length < 2 ? get$2(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
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
          schedule(subgroup[i], name, id, i, subgroup, get$2(node, id));
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
          for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$2(node, id), k = 0, l = children.length; k < l; ++k) {
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
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
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
          var inherit = get$2(node, id0);
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

  function constant$7 (x) {
    return function () {
      return x;
    };
  }

  function BrushEvent (target, type, selection) {
    this.target = target;
    this.type = type;
    this.selection = selection;
  }

  function nopropagation$1() {
    event.stopImmediatePropagation();
  }

  function noevent$1 () {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  var MODE_DRAG = { name: "drag" },
      MODE_SPACE = { name: "space" },
      MODE_HANDLE = { name: "handle" },
      MODE_CENTER = { name: "center" };

  var X = {
    name: "x",
    handles: ["e", "w"].map(type),
    input: function input(x, e) {
      return x && [[x[0], e[0][1]], [x[1], e[1][1]]];
    },
    output: function output(xy) {
      return xy && [xy[0][0], xy[1][0]];
    }
  };

  var Y = {
    name: "y",
    handles: ["n", "s"].map(type),
    input: function input(y, e) {
      return y && [[e[0][0], y[0]], [e[1][0], y[1]]];
    },
    output: function output(xy) {
      return xy && [xy[0][1], xy[1][1]];
    }
  };

  var cursors = {
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };

  var flipX = {
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
  };

  var flipY = {
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
  };

  var signsX = {
    overlay: +1,
    selection: +1,
    n: null,
    e: +1,
    s: null,
    w: -1,
    nw: -1,
    ne: +1,
    se: +1,
    sw: -1
  };

  var signsY = {
    overlay: +1,
    selection: +1,
    n: -1,
    e: null,
    s: +1,
    w: null,
    nw: -1,
    ne: -1,
    se: +1,
    sw: +1
  };

  function type(t) {
    return { type: t };
  }

  // Ignore right-click, since that should open the context menu.
  function defaultFilter$1() {
    return !event.button;
  }

  function defaultExtent() {
    var svg = this.ownerSVGElement || this;
    return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
  }

  // Like d3.local, but with the name “__brush” rather than auto-generated.
  function local$1(node) {
    while (!node.__brush) {
      if (!(node = node.parentNode)) return;
    }return node.__brush;
  }

  function empty$1(extent) {
    return extent[0][0] === extent[1][0] || extent[0][1] === extent[1][1];
  }

  function brushSelection(node) {
    var state = node.__brush;
    return state ? state.dim.output(state.selection) : null;
  }

  function brushY() {
    return brush$1(Y);
  }

  function brush$1(dim) {
    var extent = defaultExtent,
        filter = defaultFilter$1,
        listeners = dispatch(brush, "start", "brush", "end"),
        handleSize = 6,
        touchending;

    function brush(group) {
      var overlay = group.property("__brush", initialize).selectAll(".overlay").data([type("overlay")]);

      overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", cursors.overlay).merge(overlay).each(function () {
        var extent = local$1(this).extent;
        select(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
      });

      group.selectAll(".selection").data([type("selection")]).enter().append("rect").attr("class", "selection").attr("cursor", cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");

      var handle = group.selectAll(".handle").data(dim.handles, function (d) {
        return d.type;
      });

      handle.exit().remove();

      handle.enter().append("rect").attr("class", function (d) {
        return "handle handle--" + d.type;
      }).attr("cursor", function (d) {
        return cursors[d.type];
      });

      group.each(redraw).attr("fill", "none").attr("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush touchstart.brush", started);
    }

    brush.move = function (group, selection$$1) {
      if (group.selection) {
        group.on("start.brush", function () {
          emitter(this, arguments).beforestart().start();
        }).on("interrupt.brush end.brush", function () {
          emitter(this, arguments).end();
        }).tween("brush", function () {
          var that = this,
              state = that.__brush,
              emit = emitter(that, arguments),
              selection0 = state.selection,
              selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(this, arguments) : selection$$1, state.extent),
              i = interpolate(selection0, selection1);

          function tween(t) {
            state.selection = t === 1 && empty$1(selection1) ? null : i(t);
            redraw.call(that);
            emit.brush();
          }

          return selection0 && selection1 ? tween : tween(1);
        });
      } else {
        group.each(function () {
          var that = this,
              args = arguments,
              state = that.__brush,
              selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(that, args) : selection$$1, state.extent),
              emit = emitter(that, args).beforestart();

          interrupt(that);
          state.selection = selection1 == null || empty$1(selection1) ? null : selection1;
          redraw.call(that);
          emit.start().brush().end();
        });
      }
    };

    function redraw() {
      var group = select(this),
          selection$$1 = local$1(this).selection;

      if (selection$$1) {
        group.selectAll(".selection").style("display", null).attr("x", selection$$1[0][0]).attr("y", selection$$1[0][1]).attr("width", selection$$1[1][0] - selection$$1[0][0]).attr("height", selection$$1[1][1] - selection$$1[0][1]);

        group.selectAll(".handle").style("display", null).attr("x", function (d) {
          return d.type[d.type.length - 1] === "e" ? selection$$1[1][0] - handleSize / 2 : selection$$1[0][0] - handleSize / 2;
        }).attr("y", function (d) {
          return d.type[0] === "s" ? selection$$1[1][1] - handleSize / 2 : selection$$1[0][1] - handleSize / 2;
        }).attr("width", function (d) {
          return d.type === "n" || d.type === "s" ? selection$$1[1][0] - selection$$1[0][0] + handleSize : handleSize;
        }).attr("height", function (d) {
          return d.type === "e" || d.type === "w" ? selection$$1[1][1] - selection$$1[0][1] + handleSize : handleSize;
        });
      } else {
        group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
      }
    }

    function emitter(that, args) {
      return that.__brush.emitter || new Emitter(that, args);
    }

    function Emitter(that, args) {
      this.that = that;
      this.args = args;
      this.state = that.__brush;
      this.active = 0;
    }

    Emitter.prototype = {
      beforestart: function beforestart() {
        if (++this.active === 1) this.state.emitter = this, this.starting = true;
        return this;
      },
      start: function start() {
        if (this.starting) this.starting = false, this.emit("start");
        return this;
      },
      brush: function brush() {
        this.emit("brush");
        return this;
      },
      end: function end() {
        if (--this.active === 0) delete this.state.emitter, this.emit("end");
        return this;
      },
      emit: function emit(type) {
        customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
      }
    };

    function started() {
      if (event.touches) {
        if (event.changedTouches.length < event.touches.length) return noevent$1();
      } else if (touchending) return;
      if (!filter.apply(this, arguments)) return;

      var that = this,
          type = event.target.__data__.type,
          mode = (event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : event.altKey ? MODE_CENTER : MODE_HANDLE,
          signX = dim === Y ? null : signsX[type],
          signY = dim === X ? null : signsY[type],
          state = local$1(that),
          extent = state.extent,
          selection$$1 = state.selection,
          W = extent[0][0],
          w0,
          w1,
          N = extent[0][1],
          n0,
          n1,
          E = extent[1][0],
          e0,
          e1,
          S = extent[1][1],
          s0,
          s1,
          dx,
          dy,
          moving,
          shifting = signX && signY && event.shiftKey,
          lockX,
          lockY,
          point0 = mouse(that),
          point = point0,
          emit = emitter(that, arguments).beforestart();

      if (type === "overlay") {
        state.selection = selection$$1 = [[w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]], [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]];
      } else {
        w0 = selection$$1[0][0];
        n0 = selection$$1[0][1];
        e0 = selection$$1[1][0];
        s0 = selection$$1[1][1];
      }

      w1 = w0;
      n1 = n0;
      e1 = e0;
      s1 = s0;

      var group = select(that).attr("pointer-events", "none");

      var overlay = group.selectAll(".overlay").attr("cursor", cursors[type]);

      if (event.touches) {
        group.on("touchmove.brush", moved, true).on("touchend.brush touchcancel.brush", ended, true);
      } else {
        var view = select(event.view).on("keydown.brush", keydowned, true).on("keyup.brush", keyupped, true).on("mousemove.brush", moved, true).on("mouseup.brush", ended, true);

        dragDisable(event.view);
      }

      nopropagation$1();
      interrupt(that);
      redraw.call(that);
      emit.start();

      function moved() {
        var point1 = mouse(that);
        if (shifting && !lockX && !lockY) {
          if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;else lockX = true;
        }
        point = point1;
        moving = true;
        noevent$1();
        move();
      }

      function move() {
        var t;

        dx = point[0] - point0[0];
        dy = point[1] - point0[1];

        switch (mode) {
          case MODE_SPACE:
          case MODE_DRAG:
            {
              if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
              if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
              break;
            }
          case MODE_HANDLE:
            {
              if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
              if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
              break;
            }
          case MODE_CENTER:
            {
              if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
              if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
              break;
            }
        }

        if (e1 < w1) {
          signX *= -1;
          t = w0, w0 = e0, e0 = t;
          t = w1, w1 = e1, e1 = t;
          if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
        }

        if (s1 < n1) {
          signY *= -1;
          t = n0, n0 = s0, s0 = t;
          t = n1, n1 = s1, s1 = t;
          if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
        }

        if (state.selection) selection$$1 = state.selection; // May be set by brush.move!
        if (lockX) w1 = selection$$1[0][0], e1 = selection$$1[1][0];
        if (lockY) n1 = selection$$1[0][1], s1 = selection$$1[1][1];

        if (selection$$1[0][0] !== w1 || selection$$1[0][1] !== n1 || selection$$1[1][0] !== e1 || selection$$1[1][1] !== s1) {
          state.selection = [[w1, n1], [e1, s1]];
          redraw.call(that);
          emit.brush();
        }
      }

      function ended() {
        nopropagation$1();
        if (event.touches) {
          if (event.touches.length) return;
          if (touchending) clearTimeout(touchending);
          touchending = setTimeout(function () {
            touchending = null;
          }, 500); // Ghost clicks are delayed!
          group.on("touchmove.brush touchend.brush touchcancel.brush", null);
        } else {
          yesdrag(event.view, moving);
          view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
        }
        group.attr("pointer-events", "all");
        overlay.attr("cursor", cursors.overlay);
        if (state.selection) selection$$1 = state.selection; // May be set by brush.move (on start)!
        if (empty$1(selection$$1)) state.selection = null, redraw.call(that);
        emit.end();
      }

      function keydowned() {
        switch (event.keyCode) {
          case 16:
            {
              // SHIFT
              shifting = signX && signY;
              break;
            }
          case 18:
            {
              // ALT
              if (mode === MODE_HANDLE) {
                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                mode = MODE_CENTER;
                move();
              }
              break;
            }
          case 32:
            {
              // SPACE; takes priority over ALT
              if (mode === MODE_HANDLE || mode === MODE_CENTER) {
                if (signX < 0) e0 = e1 - dx;else if (signX > 0) w0 = w1 - dx;
                if (signY < 0) s0 = s1 - dy;else if (signY > 0) n0 = n1 - dy;
                mode = MODE_SPACE;
                overlay.attr("cursor", cursors.selection);
                move();
              }
              break;
            }
          default:
            return;
        }
        noevent$1();
      }

      function keyupped() {
        switch (event.keyCode) {
          case 16:
            {
              // SHIFT
              if (shifting) {
                lockX = lockY = shifting = false;
                move();
              }
              break;
            }
          case 18:
            {
              // ALT
              if (mode === MODE_CENTER) {
                if (signX < 0) e0 = e1;else if (signX > 0) w0 = w1;
                if (signY < 0) s0 = s1;else if (signY > 0) n0 = n1;
                mode = MODE_HANDLE;
                move();
              }
              break;
            }
          case 32:
            {
              // SPACE
              if (mode === MODE_SPACE) {
                if (event.altKey) {
                  if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                  if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                  mode = MODE_CENTER;
                } else {
                  if (signX < 0) e0 = e1;else if (signX > 0) w0 = w1;
                  if (signY < 0) s0 = s1;else if (signY > 0) n0 = n1;
                  mode = MODE_HANDLE;
                }
                overlay.attr("cursor", cursors[type]);
                move();
              }
              break;
            }
          default:
            return;
        }
        noevent$1();
      }
    }

    function initialize() {
      var state = this.__brush || { selection: null };
      state.extent = extent.apply(this, arguments);
      state.dim = dim;
      return state;
    }

    brush.extent = function (_) {
      return arguments.length ? (extent = typeof _ === "function" ? _ : constant$7([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
    };

    brush.filter = function (_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$7(!!_), brush) : filter;
    };

    brush.handleSize = function (_) {
      return arguments.length ? (handleSize = +_, brush) : handleSize;
    };

    brush.on = function () {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? brush : value;
    };

    return brush;
  }

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

  function constant$8 (x) {
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
        cornerRadius = constant$8(0),
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
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$8(+_), arc) : innerRadius;
    };

    arc.outerRadius = function (_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$8(+_), arc) : outerRadius;
    };

    arc.cornerRadius = function (_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$8(+_), arc) : cornerRadius;
    };

    arc.padRadius = function (_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$8(+_), arc) : padRadius;
    };

    arc.startAngle = function (_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$8(+_), arc) : startAngle;
    };

    arc.endAngle = function (_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$8(+_), arc) : endAngle;
    };

    arc.padAngle = function (_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$8(+_), arc) : padAngle;
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

  var slice$3 = Array.prototype.slice;

  function identity$6 (x) {
    return x;
  }

  var top = 1,
      right = 2,
      bottom = 3,
      left = 4,
      epsilon$3 = 1e-6;

  function translateX(x) {
    return "translate(" + (x + 0.5) + ",0)";
  }

  function translateY(y) {
    return "translate(0," + (y + 0.5) + ")";
  }

  function number$3(scale) {
    return function (d) {
      return +scale(d);
    };
  }

  function center(scale) {
    var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
    if (scale.round()) offset = Math.round(offset);
    return function (d) {
      return +scale(d) + offset;
    };
  }

  function entering() {
    return !this.__axis;
  }

  function axis(orient, scale) {
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3,
        k = orient === top || orient === left ? -1 : 1,
        x = orient === left || orient === right ? "x" : "y",
        transform = orient === top || orient === bottom ? translateX : translateY;

    function axis(context) {
      var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues,
          format = tickFormat == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$6 : tickFormat,
          spacing = Math.max(tickSizeInner, 0) + tickPadding,
          range = scale.range(),
          range0 = +range[0] + 0.5,
          range1 = +range[range.length - 1] + 0.5,
          position = (scale.bandwidth ? center : number$3)(scale.copy()),
          selection = context.selection ? context.selection() : context,
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text");

      path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "#000"));

      tick = tick.merge(tickEnter);

      line = line.merge(tickEnter.append("line").attr("stroke", "#000").attr(x + "2", k * tickSizeInner));

      text = text.merge(tickEnter.append("text").attr("fill", "#000").attr(x, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

      if (context !== selection) {
        path = path.transition(context);
        tick = tick.transition(context);
        line = line.transition(context);
        text = text.transition(context);

        tickExit = tickExit.transition(context).attr("opacity", epsilon$3).attr("transform", function (d) {
          return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform");
        });

        tickEnter.attr("opacity", epsilon$3).attr("transform", function (d) {
          var p = this.parentNode.__axis;return transform(p && isFinite(p = p(d)) ? p : position(d));
        });
      }

      tickExit.remove();

      path.attr("d", orient === left || orient == right ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

      tick.attr("opacity", 1).attr("transform", function (d) {
        return transform(position(d));
      });

      line.attr(x + "2", k * tickSizeInner);

      text.attr(x, k * spacing).text(format);

      selection.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

      selection.each(function () {
        this.__axis = position;
      });
    }

    axis.scale = function (_) {
      return arguments.length ? (scale = _, axis) : scale;
    };

    axis.ticks = function () {
      return tickArguments = slice$3.call(arguments), axis;
    };

    axis.tickArguments = function (_) {
      return arguments.length ? (tickArguments = _ == null ? [] : slice$3.call(_), axis) : tickArguments.slice();
    };

    axis.tickValues = function (_) {
      return arguments.length ? (tickValues = _ == null ? null : slice$3.call(_), axis) : tickValues && tickValues.slice();
    };

    axis.tickFormat = function (_) {
      return arguments.length ? (tickFormat = _, axis) : tickFormat;
    };

    axis.tickSize = function (_) {
      return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    };

    axis.tickSizeInner = function (_) {
      return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    };

    axis.tickSizeOuter = function (_) {
      return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    };

    axis.tickPadding = function (_) {
      return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    };

    return axis;
  }

  function axisTop(scale) {
    return axis(top, scale);
  }

  function axisRight(scale) {
    return axis(right, scale);
  }

  function axisBottom(scale) {
    return axis(bottom, scale);
  }

  function axisLeft(scale) {
    return axis(left, scale);
  }

  var renderQueue = function renderQueue(func) {
    var _queue = [],

    // data to be rendered
    _rate = 1000,

    // number of calls per frame
    _invalidate = function _invalidate() {},

    // invalidate last render queue
    _clear = function _clear() {}; // clearing function

    var rq = function rq(data) {
      if (data) rq.data(data);
      _invalidate();
      _clear();
      rq.render();
    };

    rq.render = function () {
      var valid = true;
      _invalidate = rq.invalidate = function () {
        valid = false;
      };

      function doFrame() {
        if (!valid) return true;
        var chunk = _queue.splice(0, _rate);
        chunk.map(func);
        requestAnimationFrame(doFrame);
      }

      doFrame();
    };

    rq.data = function (data) {
      _invalidate();
      _queue = data.slice(0); // creates a copy of the data
      return rq;
    };

    rq.add = function (data) {
      _queue = _queue.concat(data);
    };

    rq.rate = function (value) {
      if (!arguments.length) return _rate;
      _rate = value;
      return rq;
    };

    rq.remaining = function () {
      return _queue.length;
    };

    // clear the canvas
    rq.clear = function (func) {
      if (!arguments.length) {
        _clear();
        return rq;
      }
      _clear = func;
      return rq;
    };

    rq.invalidate = _invalidate;

    return rq;
  };

  var w = function w(config) {
    return config.width - config.margin.right - config.margin.left;
  };

  var brushExtents = function brushExtents(state, config, pc) {
    return function (extents) {
      var brushes = state.brushes,
          brushNodes = state.brushNodes;

      if (typeof extents === 'undefined') {
        return Object.keys(config.dimensions).reduce(function (acc, cur) {
          var brush$$1 = brushes[cur];
          //todo: brush check
          if (brush$$1 !== undefined && brushSelection(brushNodes[cur]) !== null) {
            acc[cur] = brush$$1.extent();
          }

          return acc;
        }, {});
      } else {
        //first get all the brush selections
        var brushSelections = {};
        pc.g().selectAll('.brush').each(function (d) {
          brushSelections[d] = select(this);
        });

        // loop over each dimension and update appropriately (if it was passed in through extents)
        Object.keys(config.dimensions).forEach(function (d) {
          if (extents[d] === undefined) {
            return;
          }

          var brush$$1 = brushes[d];
          if (brush$$1 !== undefined) {
            var dim = config.dimensions[d];
            var yExtent = extents[d].map(dim.yscale);

            //update the extent
            //sets the brushable extent to the specified array of points [[x0, y0], [x1, y1]]
            brush$$1.extent([[-15, yExtent[1]], [15, yExtent[0]]]);

            //redraw the brush
            //https://github.com/d3/d3-brush#brush_move
            // For an x-brush, it must be defined as [x0, x1]; for a y-brush, it must be defined as [y0, y1].
            brushSelections[d].call(brush$$1).call(brush$$1.move, yExtent.reverse());

            //fire some events
            // brush.event(brushSelections[d]);
          }
        });

        //redraw the chart
        pc.renderBrushed();

        return pc;
      }
    };
  };

  var _this = undefined;

  var brushReset = function brushReset(state, config, pc) {
    return function (dimension) {
      var brushes = state.brushes;

      if (dimension === undefined) {
        config.brushed = false;
        if (pc.g() !== undefined && pc.g() !== null) {
          pc.g().selectAll('.brush').each(function (d) {
            select(this).call(brushes[d].move, null);
          });
          pc.renderBrushed();
        }
      } else {
        config.brushed = false;
        if (pc.g() !== undefined && pc.g() !== null) {
          pc.g().selectAll('.brush').each(function (d) {
            if (d !== dimension) return;
            select(this).call(brushes[d].move, null);
            brushes[d].event(select(this));
          });
          pc.renderBrushed();
        }
      }
      return _this;
    };
  };

  //https://github.com/d3/d3-brush/issues/10

  // data within extents
  var selected = function selected(state, config, brushGroup) {
    return function () {
      var brushNodes = state.brushNodes;

      var is_brushed = function is_brushed(p) {
        return brushSelection(brushNodes[p]) !== null;
      };

      var actives = Object.keys(config.dimensions).filter(is_brushed);
      var extents = actives.map(function (p) {
        var _brushRange = brushSelection(brushNodes[p]);

        if (typeof config.dimensions[p].yscale.invert === 'function') {
          return [config.dimensions[p].yscale.invert(_brushRange[1]), config.dimensions[p].yscale.invert(_brushRange[0])];
        } else {
          return _brushRange;
        }
      });
      // We don't want to return the full data set when there are no axes brushed.
      // Actually, when there are no axes brushed, by definition, no items are
      // selected. So, let's avoid the filtering and just return false.
      //if (actives.length === 0) return false;

      // Resolves broken examples for now. They expect to get the full dataset back from empty brushes
      if (actives.length === 0) return config.data;

      // test if within range
      var within = {
        date: function date(d, p, dimension) {
          if (typeof config.dimensions[p].yscale.bandwidth === 'function') {
            // if it is ordinal
            return extents[dimension][0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= extents[dimension][1];
          } else {
            return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
          }
        },
        number: function number(d, p, dimension) {
          if (typeof config.dimensions[p].yscale.bandwidth === 'function') {
            // if it is ordinal
            return extents[dimension][0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= extents[dimension][1];
          } else {
            return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
          }
        },
        string: function string(d, p, dimension) {
          return extents[dimension][0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= extents[dimension][1];
        }
      };

      return config.data.filter(function (d) {
        switch (brushGroup.predicate) {
          case 'AND':
            return actives.every(function (p, dimension) {
              return within[config.dimensions[p].type](d, p, dimension);
            });
          case 'OR':
            return actives.some(function (p, dimension) {
              return within[config.dimensions[p].type](d, p, dimension);
            });
          default:
            throw new Error('Unknown brush predicate ' + config.brushPredicate);
        }
      });
    };
  };

  var brushUpdated = function brushUpdated(config, pc, events) {
    return function (newSelection) {
      config.brushed = newSelection;
      events.call('brush', pc, config.brushed);
      pc.renderBrushed();
    };
  };

  var brushFor = function brushFor(state, config, pc, events, brushGroup) {
    return function (axis, _selector) {
      var brushRangeMax = config.dimensions[axis].type === 'string' ? config.dimensions[axis].yscale.range()[config.dimensions[axis].yscale.range().length - 1] : config.dimensions[axis].yscale.range()[0];

      var _brush = brushY(_selector).extent([[-15, 0], [15, brushRangeMax]]);

      _brush.on('start', function () {
        if (event.sourceEvent !== null) {
          events.call('brushstart', pc, config.brushed);
          event.sourceEvent.stopPropagation();
        }
      }).on('brush', function () {
        brushUpdated(config, pc, events)(selected(state, config, brushGroup)());
      }).on('end', function () {
        brushUpdated(config, pc, events)(selected(state, config, brushGroup)());
        events.call('brushend', pc, config.brushed);
      });

      state.brushes[axis] = _brush;
      state.brushNodes[axis] = _selector.node();

      return _brush;
    };
  };

  var install = function install(state, config, pc, events, brushGroup) {
    return function () {
      if (!pc.g()) {
        pc.createAxes();
      }

      // Add and store a brush for each axis.
      var brush$$1 = pc.g().append('svg:g').attr('class', 'brush').each(function (d) {
        select(this).call(brushFor(state, config, pc, events, brushGroup)(d, select(this)));
      });
      brush$$1.selectAll('rect').style('visibility', null).attr('x', -15).attr('width', 30);

      brush$$1.selectAll('rect.background').style('fill', 'transparent');

      brush$$1.selectAll('rect.extent').style('fill', 'rgba(255,255,255,0.25)').style('stroke', 'rgba(0,0,0,0.6)');

      brush$$1.selectAll('.resize rect').style('fill', 'rgba(0,0,0,0.1)');

      pc.brushExtents = brushExtents(state, config, pc);
      pc.brushReset = brushReset(state, config, pc);
      return pc;
    };
  };

  var uninstall = function uninstall(state, pc) {
    return function () {
      if (pc.g() !== undefined && pc.g() !== null) pc.g().selectAll('.brush').remove();

      state.brushes = {};
      delete pc.brushExtents;
      delete pc.brushReset;
    };
  };

  var BrushState = {
    brushes: {},
    brushNodes: {}
  };

  var install1DAxes = function install1DAxes(brushGroup, config, pc, events) {
    var state = Object.assign({}, BrushState);

    brushGroup.modes['1D-axes'] = {
      install: install(state, config, pc, events, brushGroup),
      uninstall: uninstall(state, pc),
      selected: selected(state, config, brushGroup),
      brushState: brushExtents(state, config, pc)
    };
  };

  var drawBrushes = function drawBrushes(brushes, config, pc, axis, selector$$1) {
    var brushSelection$$1 = selector$$1.selectAll('.brush').data(brushes, function (d) {
      return d.id;
    });

    brushSelection$$1.enter().insert('g', '.brush').attr('class', 'brush').attr('dimension', axis).attr('id', function (b) {
      return 'brush-' + Object.keys(config.dimensions).indexOf(axis) + '-' + b.id;
    }).each(function (brushObject) {
      brushObject.brush(select(this));
    });

    brushSelection$$1.each(function (brushObject) {
      select(this).attr('class', 'brush').selectAll('.overlay').style('pointer-events', function () {
        var brush$$1 = brushObject.brush;
        if (brushObject.id === brushes.length - 1 && brush$$1 !== undefined) {
          return 'all';
        } else {
          return 'none';
        }
      });
    });

    brushSelection$$1.exit().remove();
  };

  // data within extents
  var selected$1 = function selected(state, config, pc, events, brushGroup) {
    var brushes = state.brushes;

    var is_brushed = function is_brushed(p, pos) {
      var axisBrushes = brushes[p];

      for (var i = 0; i < axisBrushes.length; i++) {
        var brush$$1 = document.getElementById('brush-' + pos + '-' + i);

        if (brushSelection(brush$$1) !== null) {
          return true;
        }
      }

      return false;
    };

    var actives = Object.keys(config.dimensions).filter(is_brushed);
    var extents = actives.map(function (p) {
      var axisBrushes = brushes[p];

      return axisBrushes.map(function (d, i) {
        return brushSelection(document.getElementById('brush-' + Object.keys(config.dimensions).indexOf(p) + '-' + i));
      }).map(function (d, i) {
        if (d === null || d === undefined) {
          return null;
        } else if (typeof config.dimensions[p].yscale.invert === 'function') {
          return [config.dimensions[p].yscale.invert(d[1]), config.dimensions[p].yscale.invert(d[0])];
        } else {
          return d;
        }
      });
    });

    // We don't want to return the full data set when there are no axes brushed.
    // Actually, when there are no axes brushed, by definition, no items are
    // selected. So, let's avoid the filtering and just return false.
    //if (actives.length === 0) return false;

    // Resolves broken examples for now. They expect to get the full dataset back from empty brushes
    if (actives.length === 0) return config.data;

    // test if within range
    var within = {
      date: function date(d, p, i) {
        var dimExt = extents[i];

        if (typeof config.dimensions[p].yscale.bandwidth === 'function') {
          // if it is ordinal
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = dimExt[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var e = _step.value;

              if (e === null || e === undefined) {
                continue;
              }

              if (e[0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= e[1]) {
                return true;
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

          return false;
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = dimExt[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _e = _step2.value;

              if (_e === null || _e === undefined) {
                continue;
              }

              if (_e[0] <= d[p] && d[p] <= _e[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return false;
        }
      },
      number: function number(d, p, i) {
        var dimExt = extents[i];

        if (typeof config.dimensions[p].yscale.bandwidth === 'function') {
          // if it is ordinal
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = dimExt[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var e = _step3.value;

              if (e === null || e === undefined) {
                continue;
              }

              if (e[0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= e[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return false;
        } else {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = dimExt[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _e2 = _step4.value;

              if (_e2 === null || _e2 === undefined) {
                continue;
              }

              if (_e2[0] <= d[p] && d[p] <= _e2[1]) {
                return true;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          return false;
        }
      },
      string: function string(d, p, i) {
        var dimExt = extents[i];

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = dimExt[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var e = _step5.value;

            if (e === null || e === undefined) {
              continue;
            }

            if (e[0] <= config.dimensions[p].yscale(d[p]) && config.dimensions[p].yscale(d[p]) <= e[1]) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return false;
      }
    };

    return config.data.filter(function (d) {
      switch (brushGroup.predicate) {
        case 'AND':
          return actives.every(function (p, i) {
            return within[config.dimensions[p].type](d, p, i);
          });
        case 'OR':
          return actives.some(function (p, i) {
            return within[config.dimensions[p].type](d, p, i);
          });
        default:
          throw new Error('Unknown brush predicate ' + config.brushPredicate);
      }
    });
  };

  var brushUpdated$1 = function brushUpdated(config, pc, events) {
    return function (newSelection) {
      config.brushed = newSelection;
      events.call('brush', pc, config.brushed);
      pc.renderBrushed();
    };
  };

  var newBrush = function newBrush(state, config, pc, events, brushGroup) {
    return function (axis, _selector) {
      var brushes = state.brushes,
          brushNodes = state.brushNodes;

      var brushRangeMax = config.dimensions[axis].type === 'string' ? config.dimensions[axis].yscale.range()[config.dimensions[axis].yscale.range().length - 1] : config.dimensions[axis].yscale.range()[0];

      var brush$$1 = brushY().extent([[-15, 0], [15, brushRangeMax]]);
      var id = brushes[axis] ? brushes[axis].length : 0;
      var node = 'brush-' + Object.keys(config.dimensions).indexOf(axis) + '-' + id;

      if (brushes[axis]) {
        brushes[axis].push({
          id: id,
          brush: brush$$1,
          node: node
        });
      } else {
        brushes[axis] = [{ id: id, brush: brush$$1, node: node }];
      }

      if (brushNodes[axis]) {
        brushNodes[axis].push({ id: id, node: node });
      } else {
        brushNodes[axis] = [{ id: id, node: node }];
      }

      brush$$1.on('start', function () {
        if (event.sourceEvent !== null) {
          events.call('brushstart', pc, config.brushed);
          if (typeof event.sourceEvent.stopPropagation === 'function') {
            event.sourceEvent.stopPropagation();
          }
        }
      }).on('brush', function (e) {
        // record selections
        brushUpdated$1(config, pc, events)(selected$1(state, config, pc, events, brushGroup));
      }).on('end', function () {
        // Figure out if our latest brush has a selection
        var lastBrushID = brushes[axis][brushes[axis].length - 1].id;
        var lastBrush = document.getElementById('brush-' + Object.keys(config.dimensions).indexOf(axis) + '-' + lastBrushID);
        var selection$$1 = brushSelection(lastBrush);

        if (selection$$1 !== undefined && selection$$1 !== null && selection$$1[0] !== selection$$1[1]) {
          newBrush(state, config, pc, events, brushGroup)(axis, _selector);

          drawBrushes(brushes[axis], config, pc, axis, _selector);

          brushUpdated$1(config, pc, events)(selected$1(state, config, pc, events, brushGroup));
        } else {
          if (event.sourceEvent && event.sourceEvent.toString() === '[object MouseEvent]' && event.selection === null) {
            pc.brushReset(axis);
          }
        }

        events.call('brushend', pc, config.brushed);
      });

      return brush$$1;
    };
  };

  /**
   *
   * extents are in format of [[2,6], [3,5]]
   *
   * * @param state
   * @param config
   * @param pc
   * @returns {Function}
   */
  var brushExtents$1 = function brushExtents(state, config, pc, events, brushGroup) {
    return function (extents) {
      var brushes = state.brushes;

      if (typeof extents === 'undefined') {
        return Object.keys(config.dimensions).reduce(function (acc, cur, pos) {
          var axisBrushes = brushes[cur];

          if (axisBrushes === undefined || axisBrushes === null) {
            acc[cur] = [];
          } else {
            acc[cur] = axisBrushes.reduce(function (d, p, i) {
              var range = brushSelection(document.getElementById('brush-' + pos + '-' + i));
              if (range !== null) {
                d = d.push(range);
              }

              return d;
            }, []);
          }

          return acc;
        }, {});
      } else {
        // //first get all the brush selections
        // loop over each dimension and update appropriately (if it was passed in through extents)
        Object.keys(config.dimensions).forEach(function (d, pos) {
          if (extents[d] === undefined || extents[d] === null) {
            return;
          }

          var dim = config.dimensions[d];

          var yExtents = extents[d].map(function (e) {
            return e.map(dim.yscale);
          });

          var _bs = yExtents.map(function (e, j) {
            var _brush = newBrush(state, config, pc, events, brushGroup)(d, select('#brush-group-' + pos));
            //update the extent
            //sets the brushable extent to the specified array of points [[x0, y0], [x1, y1]]
            _brush.extent([[-15, e[1]], [15, e[0]]]);

            return {
              id: j,
              brush: _brush,
              ext: e
            };
          });

          brushes[d] = _bs;

          drawBrushes(_bs, config, pc, d, select('#brush-group-' + pos));

          //redraw the brush
          //https://github.com/d3/d3-brush#brush_move
          // For an x-brush, it must be defined as [x0, x1]; for a y-brush, it must be defined as [y0, y1].
          _bs.forEach(function (f, k) {
            select('#brush-' + pos + '-' + k).call(f.brush).call(f.brush.move, f.ext.reverse());
          });
        });

        //redraw the chart
        pc.renderBrushed();

        return pc;
      }
    };
  };

  var _this$1 = undefined;

  var brushReset$1 = function brushReset(state, config, pc) {
    return function (dimension) {
      var brushes = state.brushes;

      if (dimension === undefined) {
        if (pc.g() !== undefined && pc.g() !== null) {
          Object.keys(config.dimensions).forEach(function (d, pos) {
            var axisBrush = brushes[d];

            axisBrush.forEach(function (e, i) {
              var brush$$1 = document.getElementById('brush-' + pos + '-' + i);
              if (brushSelection(brush$$1) !== null) {
                pc.g().select('#brush-' + pos + '-' + i).call(e.brush.move, null);
              }
            });
          });

          pc.renderBrushed();
        }
      } else {
        if (pc.g() !== undefined && pc.g() !== null) {
          var axisBrush = brushes[dimension];
          var pos = Object.keys(config.dimensions).indexOf(dimension);

          axisBrush.forEach(function (e, i) {
            var brush$$1 = document.getElementById('brush-' + pos + '-' + i);
            if (brushSelection(brush$$1) !== null) {
              pc.g().select('#brush-' + pos + '-' + i).call(e.brush.move, null);

              if (typeof e.event === 'function') {
                e.event(select('#brush-' + pos + '-' + i));
              }
            }
          });

          pc.renderBrushed();
        }
      }
      return _this$1;
    };
  };

  var brushFor$1 = function brushFor(state, config, pc, events, brushGroup) {
    return function (axis, _selector) {
      var brushes = state.brushes;

      newBrush(state, config, pc, events, brushGroup)(axis, _selector);
      drawBrushes(brushes[axis], config, pc, axis, _selector);
    };
  };

  var install$1 = function install(state, config, pc, events, brushGroup) {
    return function () {
      if (!pc.g()) {
        pc.createAxes();
      }

      pc.g().append('svg:g').attr('id', function (d, i) {
        return 'brush-group-' + i;
      }).attr('class', 'brush-group').attr('dimension', function (d) {
        return d;
      }).each(function (d) {
        brushFor$1(state, config, pc, events, brushGroup)(d, select(this));
      });

      pc.brushExtents = brushExtents$1(state, config, pc, events, brushGroup);
      pc.brushReset = brushReset$1(state, config, pc);
      return pc;
    };
  };

  var uninstall$1 = function uninstall(state, pc) {
    return function () {
      if (pc.g() !== undefined && pc.g() !== null) pc.g().selectAll('.brush-group').remove();

      state.brushes = {};
      delete pc.brushExtents;
      delete pc.brushReset;
    };
  };

  var BrushState$1 = {
    brushes: {},
    brushNodes: {}
  };

  var install1DMultiAxes = function install1DMultiAxes(brushGroup, config, pc, events) {
    var state = Object.assign({}, BrushState$1);

    brushGroup.modes['1D-axes-multi'] = {
      install: install$1(state, config, pc, events, brushGroup),
      uninstall: uninstall$1(state, pc),
      selected: selected$1(state, config, brushGroup),
      brushState: brushExtents$1(state, config, pc)
    };
  };

  var uninstall$2 = function uninstall(state, pc) {
    return function () {
      pc.selection.select('svg').select('g#strums').remove();
      pc.selection.select('svg').select('rect#strum-events').remove();
      pc.on('axesreorder.strums', undefined);
      delete pc.brushReset;

      state.strumRect = undefined;
    };
  };

  // test if point falls between lines
  var containmentTest = function containmentTest(strum, width) {
    return function (p) {
      var p1 = [strum.p1[0] - strum.minX, strum.p1[1] - strum.minX],
          p2 = [strum.p2[0] - strum.minX, strum.p2[1] - strum.minX],
          m1 = 1 - width / p1[0],
          b1 = p1[1] * (1 - m1),
          m2 = 1 - width / p2[0],
          b2 = p2[1] * (1 - m2);

      var x = p[0],
          y = p[1],
          y1 = m1 * x + b1,
          y2 = m2 * x + b2;

      return y > Math.min(y1, y2) && y < Math.max(y1, y2);
    };
  };

  var crossesStrum = function crossesStrum(state, config) {
    return function (d, id) {
      var strum = state.strums[id],
          test = containmentTest(strum, state.strums.width(id)),
          d1 = strum.dims.left,
          d2 = strum.dims.right,
          y1 = config.dimensions[d1].yscale,
          y2 = config.dimensions[d2].yscale,
          point$$1 = [y1(d[d1]) - strum.minX, y2(d[d2]) - strum.minX];
      return test(point$$1);
    };
  };

  var selected$2 = function selected(brushGroup, state, config) {
    // Get the ids of the currently active strums.
    var ids = Object.getOwnPropertyNames(state.strums).filter(function (d) {
      return !isNaN(d);
    }),
        brushed = config.data;

    if (ids.length === 0) {
      return brushed;
    }

    var crossTest = crossesStrum(state, config);

    return brushed.filter(function (d) {
      switch (brushGroup.predicate) {
        case 'AND':
          return ids.every(function (id) {
            return crossTest(d, id);
          });
        case 'OR':
          return ids.some(function (id) {
            return crossTest(d, id);
          });
        default:
          throw new Error('Unknown brush predicate ' + config.brushPredicate);
      }
    });
  };

  var removeStrum = function removeStrum(state, pc) {
    var strum = state.strums[state.strums.active],
        svg = pc.selection.select('svg').select('g#strums');

    delete state.strums[state.strums.active];
    svg.selectAll('line#strum-' + strum.dims.i).remove();
    svg.selectAll('circle#strum-' + strum.dims.i).remove();
  };

  var onDragEnd = function onDragEnd(brushGroup, state, config, pc, events) {
    return function () {
      var strum = state.strums[state.strums.active];

      // Okay, somewhat unexpected, but not totally unsurprising, a mousclick is
      // considered a drag without move. So we have to deal with that case
      if (strum && strum.p1[0] === strum.p2[0] && strum.p1[1] === strum.p2[1]) {
        removeStrum(state, pc);
      }

      var brushed = selected$2(brushGroup, state, config);
      state.strums.active = undefined;
      config.brushed = brushed;
      pc.renderBrushed();
      events.call('brushend', pc, config.brushed);
    };
  };

  var drawStrum = function drawStrum(brushGroup, state, config, pc, events, strum, activePoint) {
    var _svg = pc.selection.select('svg').select('g#strums'),
        id = strum.dims.i,
        points = [strum.p1, strum.p2],
        _line = _svg.selectAll('line#strum-' + id).data([strum]),
        circles = _svg.selectAll('circle#strum-' + id).data(points),
        _drag = drag();

    _line.enter().append('line').attr('id', 'strum-' + id).attr('class', 'strum');

    _line.attr('x1', function (d) {
      return d.p1[0];
    }).attr('y1', function (d) {
      return d.p1[1];
    }).attr('x2', function (d) {
      return d.p2[0];
    }).attr('y2', function (d) {
      return d.p2[1];
    }).attr('stroke', 'black').attr('stroke-width', 2);

    _drag.on('drag', function (d, i) {
      var ev = event;
      i = i + 1;
      strum['p' + i][0] = Math.min(Math.max(strum.minX + 1, ev.x), strum.maxX);
      strum['p' + i][1] = Math.min(Math.max(strum.minY, ev.y), strum.maxY);
      drawStrum(brushGroup, state, config, pc, events, strum, i - 1);
    }).on('end', onDragEnd(brushGroup, state, config, pc, events));

    circles.enter().append('circle').attr('id', 'strum-' + id).attr('class', 'strum');

    circles.attr('cx', function (d) {
      return d[0];
    }).attr('cy', function (d) {
      return d[1];
    }).attr('r', 5).style('opacity', function (d, i) {
      return activePoint !== undefined && i === activePoint ? 0.8 : 0;
    }).on('mouseover', function () {
      select(this).style('opacity', 0.8);
    }).on('mouseout', function () {
      select(this).style('opacity', 0);
    }).call(_drag);
  };

  var onDrag = function onDrag(brushGroup, state, config, pc, events) {
    return function () {
      var ev = event,
          strum = state.strums[state.strums.active];

      // Make sure that the point is within the bounds
      strum.p2[0] = Math.min(Math.max(strum.minX + 1, ev.x - config.margin.left), strum.maxX);
      strum.p2[1] = Math.min(Math.max(strum.minY, ev.y - config.margin.top), strum.maxY);

      drawStrum(brushGroup, state, config, pc, events, strum, 1);
    };
  };

  var h = function h(config) {
    return config.height - config.margin.top - config.margin.bottom;
  };

  var dimensionsForPoint = function dimensionsForPoint(config, pc, xscale, p) {
    var dims = { i: -1, left: undefined, right: undefined };
    Object.keys(config.dimensions).some(function (dim, i) {
      if (xscale(dim) < p[0]) {
        dims.i = i;
        dims.left = dim;
        dims.right = Object.keys(config.dimensions)[pc.getOrderedDimensionKeys().indexOf(dim) + 1];
        return false;
      }
      return true;
    });

    if (dims.left === undefined) {
      // Event on the left side of the first axis.
      dims.i = 0;
      dims.left = pc.getOrderedDimensionKeys()[0];
      dims.right = pc.getOrderedDimensionKeys()[1];
    } else if (dims.right === undefined) {
      // Event on the right side of the last axis
      dims.i = Object.keys(config.dimensions).length - 1;
      dims.right = dims.left;
      dims.left = pc.getOrderedDimensionKeys()[Object.keys(config.dimensions).length - 2];
    }

    return dims;
  };

  // First we need to determine between which two axes the sturm was started.
  // This will determine the freedom of movement, because a strum can
  // logically only happen between two axes, so no movement outside these axes
  // should be allowed.
  var onDragStart = function onDragStart(state, config, pc, xscale) {
    return function () {
      var p = mouse(state.strumRect.node());

      p[0] = p[0] - config.margin.left;
      p[1] = p[1] - config.margin.top;

      var dims = dimensionsForPoint(config, pc, xscale, p);
      var strum = {
        p1: p,
        dims: dims,
        minX: xscale(dims.left),
        maxX: xscale(dims.right),
        minY: 0,
        maxY: h(config)
      };

      // Make sure that the point is within the bounds
      strum.p1[0] = Math.min(Math.max(strum.minX, p[0]), strum.maxX);
      strum.p2 = strum.p1.slice();

      state.strums[dims.i] = strum;
      state.strums.active = dims.i;
    };
  };

  var brushReset$2 = function brushReset(brushGroup, state, config, pc, events) {
    return function () {
      var ids = Object.getOwnPropertyNames(state.strums).filter(function (d) {
        return !isNaN(d);
      });

      ids.forEach(function (d) {
        state.strums.active = d;
        removeStrum(state, pc);
      });
      onDragEnd(brushGroup, state, config, pc, events)();
    };
  };

  // Checks if the first dimension is directly left of the second dimension.
  var consecutive = function consecutive(dimensions) {
    return function (first, second) {
      var keys$$1 = Object.keys(dimensions);

      return keys$$1.some(function (d, i) {
        return d === first ? i + i < keys$$1.length && dimensions[i + 1] === second : false;
      });
    };
  };

  var install$2 = function install(brushGroup, state, config, pc, events, xscale) {
    return function () {
      if (pc.g() === undefined || pc.g() === null) {
        pc.createAxes();
      }

      var _drag = drag();

      // Map of current strums. Strums are stored per segment of the PC. A segment,
      // being the area between two axes. The left most area is indexed at 0.
      state.strums.active = undefined;
      // Returns the width of the PC segment where currently a strum is being
      // placed. NOTE: even though they are evenly spaced in our current
      // implementation, we keep for when non-even spaced segments are supported as
      // well.
      state.strums.width = function (id) {
        return state.strums[id] === undefined ? undefined : state.strums[id].maxX - state.strums[id].minX;
      };

      pc.on('axesreorder.strums', function () {
        var ids = Object.getOwnPropertyNames(state.strums).filter(function (d) {
          return !isNaN(d);
        });

        if (ids.length > 0) {
          // We have some strums, which might need to be removed.
          ids.forEach(function (d) {
            var dims = state.strums[d].dims;
            state.strums.active = d;
            // If the two dimensions of the current strum are not next to each other
            // any more, than we'll need to remove the strum. Otherwise we keep it.
            if (!consecutive(config.dimensions)(dims.left, dims.right)) {
              removeStrum(state, pc);
            }
          });
          onDragEnd(brushGroup, state, config, pc, events)();
        }
      });

      // Add a new svg group in which we draw the strums.
      pc.selection.select('svg').append('g').attr('id', 'strums').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

      // Install the required brushReset function
      pc.brushReset = brushReset$2(brushGroup, state, config, pc, events);

      _drag.on('start', onDragStart(state, config, pc, xscale)).on('drag', onDrag(brushGroup, state, config, pc, events)).on('end', onDragEnd(brushGroup, state, config, pc, events));

      // NOTE: The styling needs to be done here and not in the css. This is because
      //       for 1D brushing, the canvas layers should not listen to
      //       pointer-events._.
      state.strumRect = pc.selection.select('svg').insert('rect', 'g#strums').attr('id', 'strum-events').attr('x', config.margin.left).attr('y', config.margin.top).attr('width', w(config)).attr('height', h(config) + 2).style('opacity', 0).call(_drag);
    };
  };

  var BrushState$2 = {
    strums: {},
    strumRect: {}
  };

  var install2DStrums = function install2DStrums(brushGroup, config, pc, events, xscale) {
    var state = Object.assign({}, BrushState$2);

    brushGroup.modes['2D-strums'] = {
      install: install$2(brushGroup, state, config, pc, events, xscale),
      uninstall: uninstall$2(state, pc),
      selected: selected$2(brushGroup, state, config),
      brushState: function brushState() {
        return state.strums;
      }
    };
  };

  var uninstall$3 = function uninstall(state, pc) {
    return function () {
      pc.selection.select('svg').select('g#arcs').remove();
      pc.selection.select('svg').select('rect#arc-events').remove();
      pc.on('axesreorder.arcs', undefined);

      delete pc.brushReset;

      state.strumRect = undefined;
    };
  };

  var hypothenuse = function hypothenuse(a, b) {
    return Math.sqrt(a * a + b * b);
  };

  // [0, 2*PI] -> [-PI/2, PI/2]
  var signedAngle = function signedAngle(angle) {
    return angle > Math.PI ? 1.5 * Math.PI - angle : 0.5 * Math.PI - angle;
  };

  /**
   * angles are stored in radians from in [0, 2*PI], where 0 in 12 o'clock.
   * However, one can only select lines from 0 to PI, so we compute the
   * 'signed' angle, where 0 is the horizontal line (3 o'clock), and +/- PI/2
   * are 12 and 6 o'clock respectively.
   */
  var containmentTest$1 = function containmentTest(arc$$1) {
    return function (a) {
      var startAngle = signedAngle(arc$$1.startAngle);
      var endAngle = signedAngle(arc$$1.endAngle);

      if (startAngle > endAngle) {
        var tmp = startAngle;
        startAngle = endAngle;
        endAngle = tmp;
      }

      // test if segment angle is contained in angle interval
      return a >= startAngle && a <= endAngle;
    };
  };

  var crossesStrum$1 = function crossesStrum(state, config) {
    return function (d, id) {
      var arc$$1 = state.arcs[id],
          test = containmentTest$1(arc$$1),
          d1 = arc$$1.dims.left,
          d2 = arc$$1.dims.right,
          y1 = config.dimensions[d1].yscale,
          y2 = config.dimensions[d2].yscale,
          a = state.arcs.width(id),
          b = y1(d[d1]) - y2(d[d2]),
          c = hypothenuse(a, b),
          angle = Math.asin(b / c); // rad in [-PI/2, PI/2]
      return test(angle);
    };
  };

  var selected$3 = function selected(brushGroup, state, config) {
    var ids = Object.getOwnPropertyNames(state.arcs).filter(function (d) {
      return !isNaN(d);
    });
    var brushed = config.data;

    if (ids.length === 0) {
      return brushed;
    }

    var crossTest = crossesStrum$1(state, config);

    return brushed.filter(function (d) {
      switch (brushGroup.predicate) {
        case 'AND':
          return ids.every(function (id) {
            return crossTest(d, id);
          });
        case 'OR':
          return ids.some(function (id) {
            return crossTest(d, id);
          });
        default:
          throw new Error('Unknown brush predicate ' + config.brushPredicate);
      }
    });
  };

  var removeStrum$1 = function removeStrum(state, pc) {
    var arc$$1 = state.arcs[state.arcs.active],
        svg = pc.selection.select('svg').select('g#arcs');

    delete state.arcs[state.arcs.active];
    state.arcs.active = undefined;
    svg.selectAll('line#arc-' + arc$$1.dims.i).remove();
    svg.selectAll('circle#arc-' + arc$$1.dims.i).remove();
    svg.selectAll('path#arc-' + arc$$1.dims.i).remove();
  };

  var onDragEnd$1 = function onDragEnd(brushGroup, state, config, pc, events) {
    return function () {
      var arc$$1 = state.arcs[state.arcs.active];

      // Okay, somewhat unexpected, but not totally unsurprising, a mousclick is
      // considered a drag without move. So we have to deal with that case
      if (arc$$1 && arc$$1.p1[0] === arc$$1.p2[0] && arc$$1.p1[1] === arc$$1.p2[1]) {
        removeStrum$1(state, pc);
      }

      if (arc$$1) {
        var angle = state.arcs.startAngle(state.arcs.active);

        arc$$1.startAngle = angle;
        arc$$1.endAngle = angle;
        arc$$1.arc.outerRadius(state.arcs.length(state.arcs.active)).startAngle(angle).endAngle(angle);
      }

      state.arcs.active = undefined;
      config.brushed = selected$3(brushGroup, state, config);
      pc.renderBrushed();
      events.call('brushend', pc, config.brushed);
    };
  };

  var drawStrum$1 = function drawStrum(brushGroup, state, config, pc, events, arc$$1, activePoint) {
    var svg = pc.selection.select('svg').select('g#arcs'),
        id = arc$$1.dims.i,
        points = [arc$$1.p2, arc$$1.p3],
        _line = svg.selectAll('line#arc-' + id).data([{ p1: arc$$1.p1, p2: arc$$1.p2 }, { p1: arc$$1.p1, p2: arc$$1.p3 }]),
        circles = svg.selectAll('circle#arc-' + id).data(points),
        _drag = drag(),
        _path = svg.selectAll('path#arc-' + id).data([arc$$1]);

    _path.enter().append('path').attr('id', 'arc-' + id).attr('class', 'arc').style('fill', 'orange').style('opacity', 0.5);

    _path.attr('d', arc$$1.arc).attr('transform', 'translate(' + arc$$1.p1[0] + ',' + arc$$1.p1[1] + ')');

    _line.enter().append('line').attr('id', 'arc-' + id).attr('class', 'arc');

    _line.attr('x1', function (d) {
      return d.p1[0];
    }).attr('y1', function (d) {
      return d.p1[1];
    }).attr('x2', function (d) {
      return d.p2[0];
    }).attr('y2', function (d) {
      return d.p2[1];
    }).attr('stroke', 'black').attr('stroke-width', 2);

    _drag.on('drag', function (d, i) {
      var ev = event;
      i = i + 2;

      arc$$1['p' + i][0] = Math.min(Math.max(arc$$1.minX + 1, ev.x), arc$$1.maxX);
      arc$$1['p' + i][1] = Math.min(Math.max(arc$$1.minY, ev.y), arc$$1.maxY);

      var angle = i === 3 ? state.arcs.startAngle(id) : state.arcs.endAngle(id);

      if (arc$$1.startAngle < Math.PI && arc$$1.endAngle < Math.PI && angle < Math.PI || arc$$1.startAngle >= Math.PI && arc$$1.endAngle >= Math.PI && angle >= Math.PI) {
        if (i === 2) {
          arc$$1.endAngle = angle;
          arc$$1.arc.endAngle(angle);
        } else if (i === 3) {
          arc$$1.startAngle = angle;
          arc$$1.arc.startAngle(angle);
        }
      }

      drawStrum(brushGroup, state, config, pc, events, arc$$1, i - 2);
    }).on('end', onDragEnd$1(brushGroup, state, config, pc, events));

    circles.enter().append('circle').attr('id', 'arc-' + id).attr('class', 'arc');

    circles.attr('cx', function (d) {
      return d[0];
    }).attr('cy', function (d) {
      return d[1];
    }).attr('r', 5).style('opacity', function (d, i) {
      return activePoint !== undefined && i === activePoint ? 0.8 : 0;
    }).on('mouseover', function () {
      select(this).style('opacity', 0.8);
    }).on('mouseout', function () {
      select(this).style('opacity', 0);
    }).call(_drag);
  };

  var onDrag$1 = function onDrag(brushGroup, state, config, pc, events) {
    return function () {
      var ev = event,
          arc$$1 = state.arcs[state.arcs.active];

      // Make sure that the point is within the bounds
      arc$$1.p2[0] = Math.min(Math.max(arc$$1.minX + 1, ev.x - config.margin.left), arc$$1.maxX);
      arc$$1.p2[1] = Math.min(Math.max(arc$$1.minY, ev.y - config.margin.top), arc$$1.maxY);
      arc$$1.p3 = arc$$1.p2.slice();
      drawStrum$1(brushGroup, state, config, pc, events, arc$$1, 1);
    };
  };

  // First we need to determine between which two axes the arc was started.
  // This will determine the freedom of movement, because a arc can
  // logically only happen between two axes, so no movement outside these axes
  // should be allowed.
  var onDragStart$1 = function onDragStart(state, config, pc, xscale) {
    return function () {
      var p = mouse(state.strumRect.node());

      p[0] = p[0] - config.margin.left;
      p[1] = p[1] - config.margin.top;

      var dims = dimensionsForPoint(config, pc, xscale, p);
      var arc$$1 = {
        p1: p,
        dims: dims,
        minX: xscale(dims.left),
        maxX: xscale(dims.right),
        minY: 0,
        maxY: h(config),
        startAngle: undefined,
        endAngle: undefined,
        arc: arc().innerRadius(0)
      };

      // Make sure that the point is within the bounds
      arc$$1.p1[0] = Math.min(Math.max(arc$$1.minX, p[0]), arc$$1.maxX);
      arc$$1.p2 = arc$$1.p1.slice();
      arc$$1.p3 = arc$$1.p1.slice();

      state.arcs[dims.i] = arc$$1;
      state.arcs.active = dims.i;
    };
  };

  var brushReset$3 = function brushReset(brushGroup, state, config, pc, events) {
    return function () {
      var ids = Object.getOwnPropertyNames(state.arcs).filter(function (d) {
        return !isNaN(d);
      });

      ids.forEach(function (d) {
        state.arcs.active = d;
        removeStrum$1(state, pc);
      });
      onDragEnd$1(brushGroup, state, config, pc, events)();
    };
  };

  // returns angles in [-PI/2, PI/2]
  var angle = function angle(p1, p2) {
    var a = p1[0] - p2[0],
        b = p1[1] - p2[1],
        c = hypothenuse(a, b);

    return Math.asin(b / c);
  };

  var endAngle = function endAngle(state) {
    return function (id) {
      var arc$$1 = state.arcs[id];
      if (arc$$1 === undefined) {
        return undefined;
      }
      var sAngle = angle(arc$$1.p1, arc$$1.p2),
          uAngle = -sAngle + Math.PI / 2;

      if (arc$$1.p1[0] > arc$$1.p2[0]) {
        uAngle = 2 * Math.PI - uAngle;
      }

      return uAngle;
    };
  };

  var startAngle = function startAngle(state) {
    return function (id) {
      var arc$$1 = state.arcs[id];
      if (arc$$1 === undefined) {
        return undefined;
      }

      var sAngle = angle(arc$$1.p1, arc$$1.p3),
          uAngle = -sAngle + Math.PI / 2;

      if (arc$$1.p1[0] > arc$$1.p3[0]) {
        uAngle = 2 * Math.PI - uAngle;
      }

      return uAngle;
    };
  };

  var length$1 = function length(state) {
    return function (id) {
      var arc$$1 = state.arcs[id];

      if (arc$$1 === undefined) {
        return undefined;
      }

      var a = arc$$1.p1[0] - arc$$1.p2[0],
          b = arc$$1.p1[1] - arc$$1.p2[1];

      return hypothenuse(a, b);
    };
  };

  var install$3 = function install(brushGroup, state, config, pc, events, xscale) {
    return function () {
      if (!pc.g()) {
        pc.createAxes();
      }

      var _drag = drag();

      // Map of current arcs. arcs are stored per segment of the PC. A segment,
      // being the area between two axes. The left most area is indexed at 0.
      state.arcs.active = undefined;
      // Returns the width of the PC segment where currently a arc is being
      // placed. NOTE: even though they are evenly spaced in our current
      // implementation, we keep for when non-even spaced segments are supported as
      // well.
      state.arcs.width = function (id) {
        var arc$$1 = state.arcs[id];
        return arc$$1 === undefined ? undefined : arc$$1.maxX - arc$$1.minX;
      };

      // returns angles in [0, 2 * PI]
      state.arcs.endAngle = endAngle(state);
      state.arcs.startAngle = startAngle(state);
      state.arcs.length = length$1(state);

      pc.on('axesreorder.arcs', function () {
        var ids = Object.getOwnPropertyNames(arcs).filter(function (d) {
          return !isNaN(d);
        });

        if (ids.length > 0) {
          // We have some arcs, which might need to be removed.
          ids.forEach(function (d) {
            var dims = arcs[d].dims;
            state.arcs.active = d;
            // If the two dimensions of the current arc are not next to each other
            // any more, than we'll need to remove the arc. Otherwise we keep it.
            if (!consecutive(dims)(dims.left, dims.right)) {
              removeStrum$1(state, pc);
            }
          });
          onDragEnd$1(brushGroup, state, config, pc, events)();
        }
      });

      // Add a new svg group in which we draw the arcs.
      pc.selection.select('svg').append('g').attr('id', 'arcs').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

      // Install the required brushReset function
      pc.brushReset = brushReset$3(brushGroup, state, config, pc, events);

      _drag.on('start', onDragStart$1(state, config, pc, xscale)).on('drag', onDrag$1(brushGroup, state, config, pc, events)).on('end', onDragEnd$1(brushGroup, state, config, pc, events));

      // NOTE: The styling needs to be done here and not in the css. This is because
      //       for 1D brushing, the canvas layers should not listen to
      //       pointer-events._.
      state.strumRect = pc.selection.select('svg').insert('rect', 'g#arcs').attr('id', 'arc-events').attr('x', config.margin.left).attr('y', config.margin.top).attr('width', w(config)).attr('height', h(config) + 2).style('opacity', 0).call(_drag);
    };
  };

  var BrushState$3 = {
    arcs: {},
    strumRect: {}
  };

  var installAngularBrush = function installAngularBrush(brushGroup, config, pc, events, xscale) {
    var state = Object.assign({}, BrushState$3);

    brushGroup.modes['angular'] = {
      install: install$3(brushGroup, state, config, pc, events, xscale),
      uninstall: uninstall$3(state, pc),
      selected: selected$3(brushGroup, state, config),
      brushState: function brushState() {
        return state.arcs;
      }
    };
  };

  // calculate 2d intersection of line a->b with line c->d
  // points are objects with x and y properties
  var intersection = function intersection(a, b, c, d) {
    return {
      x: ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / ((a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x)),
      y: ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / ((a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x))
    };
  };

  // Merges the canvases and SVG elements into one canvas element which is then passed into the callback
  // (so you can choose to save it to disk, etc.)
  var mergeParcoords = function mergeParcoords(pc) {
    return function (callback) {
      // Retina display, etc.
      var devicePixelRatio = window.devicePixelRatio || 1;

      // Create a canvas element to store the merged canvases
      var mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = pc.canvas.foreground.clientWidth * devicePixelRatio;
      mergedCanvas.height = (pc.canvas.foreground.clientHeight + 30) * devicePixelRatio;
      mergedCanvas.style.width = mergedCanvas.width / devicePixelRatio + 'px';
      mergedCanvas.style.height = mergedCanvas.height / devicePixelRatio + 'px';

      // Give the canvas a white background
      var context = mergedCanvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);

      // Merge all the canvases
      for (var key in pc.canvas) {
        context.drawImage(pc.canvas[key], 0, 24 * devicePixelRatio, mergedCanvas.width, mergedCanvas.height - 30 * devicePixelRatio);
      }

      // Add SVG elements to canvas
      var DOMURL = window.URL || window.webkitURL || window;
      var serializer = new XMLSerializer();
      var svgStr = serializer.serializeToString(pc.selection.select('svg').node());

      // Create a Data URI.
      var src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);
      var img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0, img.width * devicePixelRatio, img.height * devicePixelRatio);
        if (typeof callback === 'function') {
          callback(mergedCanvas);
        }
      };
      img.src = src;
    };
  };

  var selected$4 = function selected(config) {
    var actives = [];
    var extents = [];
    var ranges = {};
    //get brush selections from each node, convert to actual values
    //invert order of values in array to comply with the parcoords architecture
    if (config.brushes.length === 0) {
      var nodes = selectAll('.brush').nodes();
      for (var k = 0; k < nodes.length; k++) {
        if (brushSelection(nodes[k]) !== null) {
          actives.push(nodes[k].__data__);
          var values$$1 = [];
          var ranger = brushSelection(nodes[k]);
          if (typeof config.dimensions[nodes[k].__data__].yscale.domain()[0] === 'number') {
            for (var i = 0; i < ranger.length; i++) {
              if (actives.includes(nodes[k].__data__) && config.flipAxes.includes(nodes[k].__data__)) {
                values$$1.push(config.dimensions[nodes[k].__data__].yscale.invert(ranger[i]));
              } else if (config.dimensions[nodes[k].__data__].yscale() !== 1) {
                values$$1.unshift(config.dimensions[nodes[k].__data__].yscale.invert(ranger[i]));
              }
            }
            extents.push(values$$1);
            for (var ii = 0; ii < extents.length; ii++) {
              if (extents[ii].length === 0) {
                extents[ii] = [1, 1];
              }
            }
          } else {
            ranges[nodes[k].__data__] = brushSelection(nodes[k]);
            var dimRange = config.dimensions[nodes[k].__data__].yscale.range();
            var dimDomain = config.dimensions[nodes[k].__data__].yscale.domain();
            for (var j = 0; j < dimRange.length; j++) {
              if (dimRange[j] >= ranger[0] && dimRange[j] <= ranger[1] && actives.includes(nodes[k].__data__) && config.flipAxes.includes(nodes[k].__data__)) {
                values$$1.push(dimRange[j]);
              } else if (dimRange[j] >= ranger[0] && dimRange[j] <= ranger[1]) {
                values$$1.unshift(dimRange[j]);
              }
            }
            extents.push(values$$1);
            for (var _ii = 0; _ii < extents.length; _ii++) {
              if (extents[_ii].length === 0) {
                extents[_ii] = [1, 1];
              }
            }
          }
        }
      }
      // test if within range
      var within = {
        date: function date(d, p, dimension) {
          var category = d[p];
          var categoryIndex = config.dimensions[p].yscale.domain().indexOf(category);
          var categoryRangeValue = config.dimensions[p].yscale.range()[categoryIndex];
          return categoryRangeValue >= ranges[p][0] && categoryRangeValue <= ranges[p][1];
        },
        number: function number(d, p, dimension) {
          return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
        },
        string: function string(d, p, dimension) {
          var category = d[p];
          var categoryIndex = config.dimensions[p].yscale.domain().indexOf(category);
          var categoryRangeValue = config.dimensions[p].yscale.range()[categoryIndex];
          return categoryRangeValue >= ranges[p][0] && categoryRangeValue <= ranges[p][1];
        }
      };
      return config.data.filter(function (d) {
        return actives.every(function (p, dimension) {
          return within[config.dimensions[p].type](d, p, dimension);
        });
      });
    } else {
      // need to get data from each brush instead of each axis
      // first must find active axes by iterating through all brushes
      // then go through similiar process as above.
      var multiBrushData = [];

      var _loop = function _loop(idx) {
        var brush$$1 = config.brushes[idx];
        var values$$1 = [];
        var ranger = brush$$1.extent;
        var actives = [brush$$1.data];
        if (typeof config.dimensions[brush$$1.data].yscale.domain()[0] === 'number') {
          for (var _i = 0; _i < ranger.length; _i++) {
            if (actives.includes(brush$$1.data) && config.flipAxes.includes(brush$$1.data)) {
              values$$1.push(config.dimensions[brush$$1.data].yscale.invert(ranger[_i]));
            } else if (config.dimensions[brush$$1.data].yscale() !== 1) {
              values$$1.unshift(config.dimensions[brush$$1.data].yscale.invert(ranger[_i]));
            }
          }
          extents.push(values$$1);
          for (var _ii2 = 0; _ii2 < extents.length; _ii2++) {
            if (extents[_ii2].length === 0) {
              extents[_ii2] = [1, 1];
            }
          }
        } else {
          ranges[brush$$1.data] = brush$$1.extent;
          var _dimRange = config.dimensions[brush$$1.data].yscale.range();
          var _dimDomain = config.dimensions[brush$$1.data].yscale.domain();
          for (var _j = 0; _j < _dimRange.length; _j++) {
            if (_dimRange[_j] >= ranger[0] && _dimRange[_j] <= ranger[1] && actives.includes(brush$$1.data) && config.flipAxes.includes(brush$$1.data)) {
              values$$1.push(_dimRange[_j]);
            } else if (_dimRange[_j] >= ranger[0] && _dimRange[_j] <= ranger[1]) {
              values$$1.unshift(_dimRange[_j]);
            }
          }
          extents.push(values$$1);
          for (var _ii3 = 0; _ii3 < extents.length; _ii3++) {
            if (extents[_ii3].length === 0) {
              extents[_ii3] = [1, 1];
            }
          }
        }
        var within = {
          date: function date(d, p, dimension) {
            var category = d[p];
            var categoryIndex = config.dimensions[p].yscale.domain().indexOf(category);
            var categoryRangeValue = config.dimensions[p].yscale.range()[categoryIndex];
            return categoryRangeValue >= ranges[p][0] && categoryRangeValue <= ranges[p][1];
          },
          number: function number(d, p, dimension) {
            return extents[idx][0] <= d[p] && d[p] <= extents[idx][1];
          },
          string: function string(d, p, dimension) {
            var category = d[p];
            var categoryIndex = config.dimensions[p].yscale.domain().indexOf(category);
            var categoryRangeValue = config.dimensions[p].yscale.range()[categoryIndex];
            return categoryRangeValue >= ranges[p][0] && categoryRangeValue <= ranges[p][1];
          }
        };

        // filter data, but instead of returning it now,
        // put it into multiBrush data which is returned after
        // all brushes are iterated through.
        var filtered = config.data.filter(function (d) {
          return actives.every(function (p, dimension) {
            return within[config.dimensions[p].type](d, p, dimension);
          });
        });
        for (var z = 0; z < filtered.length; z++) {
          multiBrushData.push(filtered[z]);
        }
        actives = [];
        ranges = {};
      };

      for (var idx = 0; idx < config.brushes.length; idx++) {
        _loop(idx);
      }
      return multiBrushData;
    }
  };

  var brushPredicate = function brushPredicate(brushGroup, config, pc) {
    return function () {
      var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (predicate === null) {
        return brushGroup.predicate;
      }

      predicate = String(predicate).toUpperCase();
      if (predicate !== 'AND' && predicate !== 'OR') {
        throw new Error('Invalid predicate ' + predicate);
      }

      brushGroup.predicate = predicate;
      config.brushed = brushGroup.currentMode().selected();
      pc.renderBrushed();
      return pc;
    };
  };

  var brushMode = function brushMode(brushGroup, config, pc) {
    return function () {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (mode === null) {
        return brushGroup.mode;
      }

      if (pc.brushModes().indexOf(mode) === -1) {
        throw new Error('pc.brushmode: Unsupported brush mode: ' + mode);
      }

      // Make sure that we don't trigger unnecessary events by checking if the mode
      // actually changes.
      if (mode !== brushGroup.mode) {
        // When changing brush modes, the first thing we need to do is clearing any
        // brushes from the current mode, if any.
        if (brushGroup.mode !== 'None') {
          pc.brushReset();
        }

        // Next, we need to 'uninstall' the current brushMode.
        brushGroup.modes[brushGroup.mode].uninstall(pc);
        // Finally, we can install the requested one.
        brushGroup.mode = mode;
        brushGroup.modes[brushGroup.mode].install();
        if (mode === 'None') {
          delete pc.brushPredicate;
        } else {
          pc.brushPredicate = brushPredicate(brushGroup, config, pc);
        }
      }

      return pc;
    };
  };

  /**
   * dimension display names
   *
   * @param config
   * @param d
   * @returns {*}
   */
  var dimensionLabels = function dimensionLabels(config) {
    return function (d) {
      return config.dimensions[d].title ? config.dimensions[d].title : d;
    };
  };

  var flipAxisAndUpdatePCP = function flipAxisAndUpdatePCP(config, pc, axis) {
    return function (dimension) {
      pc.flip(dimension);
      pc.brushReset(dimension);
      select(this.parentElement).transition().duration(config.animationTime).call(axis.scale(config.dimensions[dimension].yscale));
      pc.render();
    };
  };

  var rotateLabels = function rotateLabels(config, pc) {
    if (!config.rotateLabels) return;

    var delta = event.deltaY;
    delta = delta < 0 ? -5 : delta;
    delta = delta > 0 ? 5 : delta;

    config.dimensionTitleRotation += delta;
    pc.svg.selectAll('text.label').attr('transform', 'translate(0,-5) rotate(' + config.dimensionTitleRotation + ')');
    event.preventDefault();
  };

  var _this$2 = undefined;

  var updateAxes = function updateAxes(config, pc, position, axis, flags) {
    return function () {
      var animationTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (animationTime === null) {
        animationTime = config.animationTime;
      }

      var g_data = pc.svg.selectAll('.dimension').data(pc.getOrderedDimensionKeys());
      // Enter
      g_data.enter().append('svg:g').attr('class', 'dimension').attr('transform', function (p) {
        return 'translate(' + position(p) + ')';
      }).style('opacity', 0).append('svg:g').attr('class', 'axis').attr('transform', 'translate(0,0)').each(function (d) {
        var axisElement = select(this).call(pc.applyAxisConfig(axis, config.dimensions[d]));

        axisElement.selectAll('path').style('fill', 'none').style('stroke', '#222').style('shape-rendering', 'crispEdges');

        axisElement.selectAll('line').style('fill', 'none').style('stroke', '#222').style('shape-rendering', 'crispEdges');
      }).append('svg:text').attr({
        'text-anchor': 'middle',
        y: 0,
        transform: 'translate(0,-5) rotate(' + config.dimensionTitleRotation + ')',
        x: 0,
        class: 'label'
      }).text(dimensionLabels(config)).on('dblclick', flipAxisAndUpdatePCP(config, pc, axis)).on('wheel', rotateLabels(config, pc));

      // Update
      g_data.attr('opacity', 0);
      g_data.select('.axis').transition().duration(animationTime).each(function (d) {
        select(this).call(pc.applyAxisConfig(axis, config.dimensions[d]));
      });
      g_data.select('.label').transition().duration(animationTime).text(dimensionLabels(config)).attr('transform', 'translate(0,-5) rotate(' + config.dimensionTitleRotation + ')');

      // Exit
      g_data.exit().remove();

      g = pc.svg.selectAll('.dimension');
      g.transition().duration(animationTime).attr('transform', function (p) {
        return 'translate(' + position(p) + ')';
      }).style('opacity', 1);

      pc.svg.selectAll('.axis').transition().duration(animationTime).each(function (d) {
        select(this).call(pc.applyAxisConfig(axis, config.dimensions[d]));
      });

      if (flags.brushable) pc.brushable();
      if (flags.reorderable) pc.reorderable();
      if (pc.brushMode() !== 'None') {
        var mode = pc.brushMode();
        pc.brushMode('None');
        pc.brushMode(mode);
      }
      return _this$2;
    };
  };

  /** adjusts an axis' default range [h()+1, 1] if a NullValueSeparator is set */
  var getRange = function getRange(config) {
    var h = config.height - config.margin.top - config.margin.bottom;

    if (config.nullValueSeparator == 'bottom') {
      return [h + 1 - config.nullValueSeparatorPadding.bottom - config.nullValueSeparatorPadding.top, 1];
    } else if (config.nullValueSeparator == 'top') {
      return [h + 1, 1 + config.nullValueSeparatorPadding.bottom + config.nullValueSeparatorPadding.top];
    }
    return [h + 1, 1];
  };

  var autoscale = function autoscale(config, pc, xscale, ctx) {
    return function () {
      // yscale
      var defaultScales = {
        date: function date(k) {
          var _extent = extent(config.data, function (d) {
            return d[k] ? d[k].getTime() : null;
          });
          // special case if single value
          if (_extent[0] === _extent[1]) {
            return point().domain(_extent).range(getRange(config));
          }
          if (config.flipAxes.includes(k)) {
            _extent = _extent.map(function (val) {
              return tempDate.unshift(val);
            });
          }
          return scaleTime().domain(_extent).range(getRange(config));
        },
        number: function number(k) {
          var _extent = extent(config.data, function (d) {
            return +d[k];
          });
          // special case if single value
          if (_extent[0] === _extent[1]) {
            return point().domain(_extent).range(getRange(config));
          }
          if (config.flipAxes.includes(k)) {
            _extent = _extent.map(function (val) {
              return tempDate.unshift(val);
            });
          }
          return linear$1().domain(_extent).range(getRange(config));
        },
        string: function string(k) {
          var counts = {},
              domain = [];
          // Let's get the count for each value so that we can sort the domain based
          // on the number of items for each value.
          config.data.map(function (p) {
            if (p[k] === undefined && config.nullValueSeparator !== 'undefined') {
              return null; // null values will be drawn beyond the horizontal null value separator!
            }
            if (counts[p[k]] === undefined) {
              counts[p[k]] = 1;
            } else {
              counts[p[k]] = counts[p[k]] + 1;
            }
          });
          if (config.flipAxes.includes(k)) {
            domain = Object.getOwnPropertyNames(counts).sort();
          } else {
            var tempArr = Object.getOwnPropertyNames(counts).sort();
            for (var i = 0; i < Object.getOwnPropertyNames(counts).length; i++) {
              domain.push(tempArr.pop());
            }
          }

          //need to create an ordinal scale for categorical data
          var categoricalRange = [];
          if (domain.length === 1) {
            //edge case
            domain = [' ', domain[0], ' '];
          }
          var addBy = getRange(config)[0] / (domain.length - 1);
          for (var j = 0; j < domain.length; j++) {
            if (categoricalRange.length === 0) {
              categoricalRange.push(0);
              continue;
            }
            categoricalRange.push(categoricalRange[j - 1] + addBy);
          }
          return ordinal().domain(domain).range(categoricalRange);
        }
      };
      Object.keys(config.dimensions).forEach(function (k) {
        if (config.dimensions[k].yscale === undefined || config.dimensions[k].yscale === null) config.dimensions[k].yscale = defaultScales[config.dimensions[k].type](k);
      });

      // xscale
      xscale.range([0, w(config)], 1);
      // Retina display, etc.
      var devicePixelRatio = window.devicePixelRatio || 1;

      // canvas sizes
      pc.selection.selectAll('canvas').style('margin-top', config.margin.top + 'px').style('margin-left', config.margin.left + 'px').style('width', w(config) + 2 + 'px').style('height', h(config) + 2 + 'px').attr('width', (w(config) + 2) * devicePixelRatio).attr('height', (h(config) + 2) * devicePixelRatio);
      // default styles, needs to be set when canvas width changes
      ctx.foreground.strokeStyle = config.color;
      ctx.foreground.lineWidth = 1.4;
      ctx.foreground.globalCompositeOperation = config.composite;
      ctx.foreground.globalAlpha = config.alpha;
      ctx.foreground.scale(devicePixelRatio, devicePixelRatio);
      ctx.brushed.strokeStyle = config.brushedColor;
      ctx.brushed.lineWidth = 1.4;
      ctx.brushed.globalCompositeOperation = config.composite;
      ctx.brushed.globalAlpha = config.alpha;
      ctx.brushed.scale(devicePixelRatio, devicePixelRatio);
      ctx.highlight.lineWidth = 3;
      ctx.highlight.scale(devicePixelRatio, devicePixelRatio);

      return this;
    };
  };

  var brushable = function brushable(config, pc, flags) {
    return function () {
      if (!pc.g()) {
        pc.createAxes();
      }

      var g = pc.g();

      // Add and store a brush for each axis.
      g.append('svg:g').attr('class', 'brush').each(function (d) {
        if (config.dimensions[d] !== undefined) {
          config.dimensions[d]['brush'] = brushY(select(this)).extent([[-15, 0], [15, config.dimensions[d].yscale.range()[0]]]);
          select(this).call(config.dimensions[d]['brush'].on('start', function () {
            if (event.sourceEvent !== null && !event.sourceEvent.ctrlKey) {
              pc.brushReset();
            }
          }).on('brush', function () {
            if (!event.sourceEvent.ctrlKey) {
              pc.brush();
            }
          }).on('end', function () {
            // save brush selection is ctrl key is held
            // store important brush information and
            // the html element of the selection,
            // to make a dummy selection element
            if (event.sourceEvent.ctrlKey) {
              var html = select(this).select('.selection').nodes()[0].outerHTML;
              html = html.replace('class="selection"', 'class="selection dummy' + ' selection-' + config.brushes.length + '"');
              var dat = select(this).nodes()[0].__data__;
              var brush$$1 = {
                id: config.brushes.length,
                extent: brushSelection(this),
                html: html,
                data: dat
              };
              config.brushes.push(brush$$1);
              select(select(this).nodes()[0].parentNode).select('.axis').nodes()[0].outerHTML += html;
              pc.brush();
              config.dimensions[d].brush.move(select(this, null));
              select(this).select('.selection').attr('style', 'display:none');
              pc.brushable();
            } else {
              pc.brush();
            }
          }));
          select(this).on('dblclick', function () {
            pc.brushReset(d);
          });
        }
      });

      flags.brushable = true;
      return this;
    };
  };

  var commonScale = function commonScale(config, pc) {
    return function (global, type) {
      var t = type || 'number';
      if (typeof global === 'undefined') {
        global = true;
      }

      // try to autodetect dimensions and create scales
      if (!Object.keys(config.dimensions).length) {
        pc.detectDimensions();
      }
      pc.autoscale();

      // scales of the same type
      var scales = Object.keys(config.dimensions).filter(function (p) {
        return config.dimensions[p].type == t;
      });

      if (global) {
        var _extent = extent(scales.map(function (d) {
          return config.dimensions[d].yscale.domain();
        }).reduce(function (cur, acc) {
          return cur.concat(acc);
        }));

        scales.forEach(function (d) {
          config.dimensions[d].yscale.domain(_extent);
        });
      } else {
        scales.forEach(function (d) {
          config.dimensions[d].yscale.domain(extent(config.data, function (d) {
            return +d[k];
          }));
        });
      }

      // update centroids
      if (config.bundleDimension !== null) {
        pc.bundleDimension(config.bundleDimension);
      }

      return this;
    };
  };

  var computeRealCentroids = function computeRealCentroids(dimensions, position) {
    return function (row) {
      return Object.keys(dimensions).map(function (d) {
        var x = position(d);
        var y = dimensions[d].yscale(row[d]);
        return [x, y];
      });
    };
  };

  var _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var isValid = function isValid(d) {
    return d !== null && d !== undefined;
  };

  var applyDimensionDefaults = function applyDimensionDefaults(config, pc) {
    return function (dims) {
      var types = pc.detectDimensionTypes(config.data);
      dims = dims ? dims : Object.keys(types);

      return dims.reduce(function (acc, cur, i) {
        var k = config.dimensions[cur] ? config.dimensions[cur] : {};
        acc[cur] = _extends$1({}, k, {
          orient: isValid(k.orient) ? k.orient : 'left',
          ticks: isValid(k.ticks) ? k.ticks : 5,
          innerTickSize: isValid(k.innerTickSize) ? k.innerTickSize : 6,
          outerTickSize: isValid(k.outerTickSize) ? k.outerTickSize : 0,
          tickPadding: isValid(k.tickPadding) ? k.tickPadding : 3,
          type: isValid(k.type) ? k.type : types[cur],
          index: isValid(k.index) ? k.index : i
        });

        return acc;
      }, {});
    };
  };

  /**
   * Create static SVG axes with dimension names, ticks, and labels.
   *
   * @param config
   * @param pc
   * @param xscale
   * @param flags
   * @param axis
   * @returns {Function}
   */
  var createAxes = function createAxes(config, pc, xscale, flags, axis) {
    return function () {
      if (pc.g() !== undefined) {
        pc.removeAxes();
      }
      // Add a group element for each dimension.
      pc._g = pc.svg.selectAll('.dimension').data(pc.getOrderedDimensionKeys(), function (d) {
        return d;
      }).enter().append('svg:g').attr('class', 'dimension').attr('transform', function (d) {
        return 'translate(' + xscale(d) + ')';
      });
      // Add an axis and title.
      pc._g.append('svg:g').attr('class', 'axis').attr('transform', 'translate(0,0)').each(function (d) {
        var axisElement = select(this).call(pc.applyAxisConfig(axis, config.dimensions[d]));

        axisElement.selectAll('path').style('fill', 'none').style('stroke', '#222').style('shape-rendering', 'crispEdges');

        axisElement.selectAll('line').style('fill', 'none').style('stroke', '#222').style('shape-rendering', 'crispEdges');
      }).append('svg:text').attr('text-anchor', 'middle').attr('y', 0).attr('transform', 'translate(0,-5) rotate(' + config.dimensionTitleRotation + ')').attr('x', 0).attr('class', 'label').text(dimensionLabels(config)).on('dblclick', flipAxisAndUpdatePCP(config, pc, axis)).on('wheel', rotateLabels(config, pc));

      if (config.nullValueSeparator == 'top') {
        pc.svg.append('line').attr('x1', 0).attr('y1', 1 + config.nullValueSeparatorPadding.top).attr('x2', w(config)).attr('y2', 1 + config.nullValueSeparatorPadding.top).attr('stroke-width', 1).attr('stroke', '#777').attr('fill', 'none').attr('shape-rendering', 'crispEdges');
      } else if (config.nullValueSeparator == 'bottom') {
        pc.svg.append('line').attr('x1', 0).attr('y1', h(config) + 1 - config.nullValueSeparatorPadding.bottom).attr('x2', w(config)).attr('y2', h(config) + 1 - config.nullValueSeparatorPadding.bottom).attr('stroke-width', 1).attr('stroke', '#777').attr('fill', 'none').attr('shape-rendering', 'crispEdges');
      }

      flags.axes = true;
      return this;
    };
  };

  var _this$3 = undefined;

  //draw dots with radius r on the axis line where data intersects
  var axisDots = function axisDots(config, pc, position) {
    return function (_r) {
      var r = _r || 0.1;
      var ctx = pc.ctx.marks;
      var startAngle = 0;
      var endAngle = 2 * Math.PI;
      ctx.globalAlpha = min([1 / Math.pow(config.data.length, 1 / 2), 1]);
      config.data.forEach(function (d) {
        entries(config.dimensions).forEach(function (p, i) {
          ctx.beginPath();
          ctx.arc(position(p), config.dimensions[p.key].yscale(d[p]), r, startAngle, endAngle);
          ctx.stroke();
          ctx.fill();
        });
      });
      return _this$3;
    };
  };

  var applyAxisConfig = function applyAxisConfig(axis, dimension) {
    var axisCfg = void 0;

    switch (dimension.orient) {
      case 'left':
        axisCfg = axisLeft(dimension.yscale);
        break;
      case 'right':
        axisCfg = axisRight(dimension.yscale);
        break;
      case 'top':
        axisCfg = axisTop(dimension.yscale);
        break;
      case 'bottom':
        axisCfg = axisBottom(dimension.yscale);
        break;
      default:
        axisCfg = axisLeft(dimension.yscale);
        break;
    }

    axisCfg.ticks(dimension.ticks).tickValues(dimension.tickValues).tickSizeInner(dimension.innerTickSize).tickSizeOuter(dimension.outerTickSize).tickPadding(dimension.tickPadding).tickFormat(dimension.tickFormat);

    return axisCfg;
  };

  // Jason Davies, http://bl.ocks.org/1341281
  var reorderable = function reorderable(config, pc, xscale, position, dragging, flags) {
    return function () {
      if (pc.g() === undefined) pc.createAxes();
      var g = pc.g();

      g.style('cursor', 'move').call(drag().on('start', function (d) {
        dragging[d] = this.__origin__ = xscale(d);
      }).on('drag', function (d) {
        dragging[d] = Math.min(w(config), Math.max(0, this.__origin__ += event.dx));
        pc.sortDimensions();
        xscale.domain(pc.getOrderedDimensionKeys());
        pc.render();
        g.attr('transform', function (d) {
          return 'translate(' + position(d) + ')';
        });
      }).on('end', function (d) {
        delete this.__origin__;
        delete dragging[d];
        select(this).transition().attr('transform', 'translate(' + xscale(d) + ')');
        pc.render();
      }));
      flags.reorderable = true;
      return this;
    };
  };

  // rescale for height, width and margins
  // TODO currently assumes chart is brushable, and destroys old brushes
  var resize = function resize(config, pc, flags, events) {
    return function () {
      // selection size
      pc.selection.select('svg').attr('width', config.width).attr('height', config.height);
      pc.svg.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');

      // FIXME: the current brush state should pass through
      if (flags.brushable) pc.brushReset();

      // scales
      pc.autoscale();

      // axes, destroys old brushes.
      if (pc.g()) pc.createAxes();
      if (flags.brushable) pc.brushable();
      if (flags.reorderable) pc.reorderable();

      events.call('resize', this, {
        width: config.width,
        height: config.height,
        margin: config.margin
      });

      return this;
    };
  };

  // Reorder dimensions, such that the highest value (visually) is on the left and
  // the lowest on the right. Visual values are determined by the data values in
  // the given row.
  var reorder = function reorder(config, pc, xscale) {
    return function (rowdata) {
      var firstDim = pc.getOrderedDimensionKeys()[0];

      pc.sortDimensionsByRowData(rowdata);
      // NOTE: this is relatively cheap given that:
      // number of dimensions < number of data items
      // Thus we check equality of order to prevent rerendering when this is the case.
      var reordered = firstDim !== pc.getOrderedDimensionKeys()[0];

      if (reordered) {
        xscale.domain(pc.getOrderedDimensionKeys());
        var highlighted = config.highlighted.slice(0);
        pc.unhighlight();

        var g = pc.g();
        g.transition().duration(1500).attr('transform', function (d) {
          return 'translate(' + xscale(d) + ')';
        });
        pc.render();

        // pc.highlight() does not check whether highlighted is length zero, so we do that here.
        if (highlighted.length !== 0) {
          pc.highlight(highlighted);
        }
      }
    };
  };

  var sortDimensions = function sortDimensions(config, position) {
    return function () {
      var copy = Object.assign({}, config.dimensions);
      var positionSortedKeys = Object.keys(config.dimensions).sort(function (a, b) {
        return position(a) - position(b) === 0 ? 1 : position(a) - position(b);
      });
      config.dimensions = {};
      positionSortedKeys.forEach(function (p, i) {
        config.dimensions[p] = copy[p];
        config.dimensions[p].index = i;
      });
    };
  };

  var sortDimensionsByRowData = function sortDimensionsByRowData(config) {
    return function (rowdata) {
      var copy = Object.assign({}, config.dimensions);
      var positionSortedKeys = Object.keys(config.dimensions).sort(function (a, b) {
        var pixelDifference = config.dimensions[a].yscale(rowdata[a]) - config.dimensions[b].yscale(rowdata[b]);

        // Array.sort is not necessarily stable, this means that if pixelDifference is zero
        // the ordering of dimensions might change unexpectedly. This is solved by sorting on
        // variable name in that case.
        return pixelDifference === 0 ? a.localeCompare(b) : pixelDifference;
      });
      config.dimensions = {};
      positionSortedKeys.forEach(function (p, i) {
        config.dimensions[p] = copy[p];
        config.dimensions[p].index = i;
      });
    };
  };

  var isBrushed = function isBrushed(config, brushGroup) {
    if (config.brushed && config.brushed.length !== config.data.length) return true;

    var object = brushGroup.currentMode().brushState();

    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        return true;
      }
    }
    return false;
  };

  var clear = function clear(config, pc, ctx, brushGroup) {
    return function (layer) {
      ctx[layer].clearRect(0, 0, w(config) + 2, h(config) + 2);

      // This will make sure that the foreground items are transparent
      // without the need for changing the opacity style of the foreground canvas
      // as this would stop the css styling from working
      if (layer === 'brushed' && isBrushed(config, brushGroup)) {
        ctx.brushed.fillStyle = pc.selection.style('background-color');
        ctx.brushed.globalAlpha = 1 - config.alphaOnBrushed;
        ctx.brushed.fillRect(0, 0, w(config) + 2, h(config) + 2);
        ctx.brushed.globalAlpha = config.alpha;
      }
      return this;
    };
  };

  var computeCentroids = function computeCentroids(config, position, row) {
    var centroids = [];

    var p = Object.keys(config.dimensions);
    var cols = p.length;
    var a = 0.5; // center between axes
    for (var i = 0; i < cols; ++i) {
      // centroids on 'real' axes
      var x = position(p[i]);
      var y = config.dimensions[p[i]].yscale(row[p[i]]);
      centroids.push($V([x, y]));

      // centroids on 'virtual' axes
      if (i < cols - 1) {
        var cx = x + a * (position(p[i + 1]) - x);
        var cy = y + a * (config.dimensions[p[i + 1]].yscale(row[p[i + 1]]) - y);
        if (config.bundleDimension !== null) {
          var leftCentroid = config.clusterCentroids.get(config.dimensions[config.bundleDimension].yscale(row[config.bundleDimension])).get(p[i]);
          var rightCentroid = config.clusterCentroids.get(config.dimensions[config.bundleDimension].yscale(row[config.bundleDimension])).get(p[i + 1]);
          var centroid = 0.5 * (leftCentroid + rightCentroid);
          cy = centroid + (1 - config.bundlingStrength) * (cy - centroid);
        }
        centroids.push($V([cx, cy]));
      }
    }

    return centroids;
  };

  var computeControlPoints = function computeControlPoints(smoothness, centroids) {
    var cols = centroids.length;
    var a = smoothness;
    var cps = [];

    cps.push(centroids[0]);
    cps.push($V([centroids[0].e(1) + a * 2 * (centroids[1].e(1) - centroids[0].e(1)), centroids[0].e(2)]));
    for (var col = 1; col < cols - 1; ++col) {
      var mid = centroids[col];
      var left = centroids[col - 1];
      var right = centroids[col + 1];

      var diff = left.subtract(right);
      cps.push(mid.add(diff.x(a)));
      cps.push(mid);
      cps.push(mid.subtract(diff.x(a)));
    }
    cps.push($V([centroids[cols - 1].e(1) + a * 2 * (centroids[cols - 2].e(1) - centroids[cols - 1].e(1)), centroids[cols - 1].e(2)]));
    cps.push(centroids[cols - 1]);

    return cps;
  };

  // draw single cubic bezier curve

  var singleCurve = function singleCurve(config, position, d, ctx) {
    var centroids = computeCentroids(config, position, d);
    var cps = computeControlPoints(config.smoothness, centroids);

    ctx.moveTo(cps[0].e(1), cps[0].e(2));

    for (var i = 1; i < cps.length; i += 3) {
      if (config.showControlPoints) {
        for (var j = 0; j < 3; j++) {
          ctx.fillRect(cps[i + j].e(1), cps[i + j].e(2), 2, 2);
        }
      }
      ctx.bezierCurveTo(cps[i].e(1), cps[i].e(2), cps[i + 1].e(1), cps[i + 1].e(2), cps[i + 2].e(1), cps[i + 2].e(2));
    }
  };

  // returns the y-position just beyond the separating null value line
  var getNullPosition = function getNullPosition(config) {
    if (config.nullValueSeparator == 'bottom') {
      return h(config) + 1;
    } else if (config.nullValueSeparator == 'top') {
      return 1;
    } else {
      console.log("A value is NULL, but nullValueSeparator is not set; set it to 'bottom' or 'top'.");
    }
    return h(config) + 1;
  };

  var singlePath = function singlePath(config, position, d, ctx) {
    entries(config.dimensions).forEach(function (p, i) {
      //p isn't really p
      if (i == 0) {
        ctx.moveTo(position(p.key), typeof d[p.key] == 'undefined' ? getNullPosition(config) : config.dimensions[p.key].yscale(d[p.key]));
      } else {
        ctx.lineTo(position(p.key), typeof d[p.key] == 'undefined' ? getNullPosition(config) : config.dimensions[p.key].yscale(d[p.key]));
      }
    });
  };

  // draw single polyline
  var colorPath = function colorPath(config, position, d, ctx) {
    ctx.beginPath();
    if (config.bundleDimension !== null && config.bundlingStrength > 0 || config.smoothness > 0) {
      singleCurve(config, position, d, ctx);
    } else {
      singlePath(config, position, d, ctx);
    }
    ctx.stroke();
  };

  var _functor = function _functor(v) {
    return typeof v === 'function' ? v : function () {
      return v;
    };
  };

  var pathBrushed = function pathBrushed(config, ctx, position) {
    return function (d, i) {
      if (config.brushedColor !== null) {
        ctx.brushed.strokeStyle = _functor(config.brushedColor)(d, i);
      } else {
        ctx.brushed.strokeStyle = _functor(config.color)(d, i);
      }
      return colorPath(config, position, d, ctx.brushed);
    };
  };

  var renderBrushedDefault = function renderBrushedDefault(config, ctx, position, pc, brushGroup) {
    return function () {
      pc.clear('brushed');

      if (isBrushed(config, brushGroup) && config.brushed !== false) {
        config.brushed.forEach(pathBrushed(config, ctx, position));
      }
    };
  };

  var renderBrushedQueue = function renderBrushedQueue(config, brushGroup, brushedQueue) {
    return function () {
      if (isBrushed(config, brushGroup)) {
        brushedQueue(config.brushed);
      } else {
        brushedQueue([]); // This is needed to clear the currently brushed items
      }
    };
  };

  var renderBrushed = function renderBrushed(config, pc, events) {
    return function () {
      if (!Object.keys(config.dimensions).length) pc.detectDimensions();

      pc.renderBrushed[config.mode]();
      events.call('render', this);
      return this;
    };
  };

  var brushReset$4 = function brushReset(config) {
    return function (dimension) {
      var brushesToKeep = [];
      for (var j = 0; j < config.brushes.length; j++) {
        if (config.brushes[j].data !== dimension) {
          brushesToKeep.push(config.brushes[j]);
        }
      }

      config.brushes = brushesToKeep;
      config.brushed = false;

      if (pc.g() !== undefined) {
        var nodes = selectAll('.brush').nodes();
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].__data__ === dimension) {
            // remove all dummy brushes for this axis or the real brush
            select(select(nodes[i]).nodes()[0].parentNode).selectAll('.dummy').remove();
            config.dimensions[dimension].brush.move(select(nodes[i], null));
          }
        }
      }

      return this;
    };
  };

  // a better "typeof" from this post: http://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable
  var toType = function toType(v) {
    return {}.toString.call(v).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

  // this descriptive text should live with other introspective methods
  var toString = function toString(config) {
    return function () {
      return 'Parallel Coordinates: ' + Object.keys(config.dimensions).length + ' dimensions (' + Object.keys(config.data[0]).length + ' total) , ' + config.data.length + ' rows';
    };
  };

  // pairs of adjacent dimensions
  var adjacentPairs = function adjacentPairs(arr) {
    var ret = [];
    for (var i = 0; i < arr.length - 1; i++) {
      ret.push([arr[i], arr[i + 1]]);
    }
    return ret;
  };

  var pathHighlight = function pathHighlight(config, ctx, position) {
    return function (d, i) {
      ctx.highlight.strokeStyle = _functor(config.color)(d, i);
      return colorPath(config, position, d, ctx.highlight);
    };
  };

  // highlight an array of data
  var highlight = function highlight(config, pc, canvas, events, ctx, position) {
    return function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (data === null) {
        return config.highlighted;
      }

      config.highlighted = data;
      pc.clear('highlight');
      selectAll([canvas.foreground, canvas.brushed]).classed('faded', true);
      data.forEach(pathHighlight(config, ctx, position));
      events.call('highlight', this, data);
      return this;
    };
  };

  // clear highlighting
  var unhighlight = function unhighlight(config, pc, canvas) {
    return function () {
      config.highlighted = [];
      pc.clear('highlight');
      selectAll([canvas.foreground, canvas.brushed]).classed('faded', false);
      return this;
    };
  };

  var removeAxes = function removeAxes(pc) {
    return function () {
      pc._g.remove();

      delete pc._g;
      return this;
    };
  };

  /**
   * Renders the polylines.
   * If no dimensions have been specified, it will attempt to detect quantitative
   * dimensions based on the first data entry. If scales haven't been set, it will
   * autoscale based on the extent for each dimension.
   *
   * @param config
   * @param pc
   * @param events
   * @returns {Function}
   */
  var render = function render(config, pc, events) {
    return function () {
      // try to autodetect dimensions and create scales
      if (!Object.keys(config.dimensions).length) {
        pc.detectDimensions();
      }
      pc.autoscale();

      pc.render[config.mode]();

      events.call('render', this);
      return this;
    };
  };

  var pathForeground = function pathForeground(config, ctx, position) {
    return function (d, i) {
      ctx.foreground.strokeStyle = _functor(config.color)(d, i);
      return colorPath(config, position, d, ctx.foreground);
    };
  };

  var renderDefault = function renderDefault(config, pc, ctx, position) {
    return function () {
      pc.clear('foreground');
      pc.clear('highlight');

      pc.renderBrushed.default();

      config.data.forEach(pathForeground(config, ctx, position));
    };
  };

  var renderDefaultQueue = function renderDefaultQueue(config, pc, foregroundQueue) {
    return function () {
      pc.renderBrushed.queue();
      foregroundQueue(config.data);
    };
  };

  // try to coerce to number before returning type
  var toTypeCoerceNumbers = function toTypeCoerceNumbers(v) {
    return parseFloat(v) == v && v !== null ? 'number' : toType(v);
  };

  // attempt to determine types of each dimension based on first row of data
  var detectDimensionTypes = function detectDimensionTypes(data) {
    return Object.keys(data[0]).reduce(function (acc, cur) {
      var key = isNaN(Number(cur)) ? cur : parseInt(cur);
      acc[key] = toTypeCoerceNumbers(data[0][cur]);

      return acc;
    }, {});
  };

  var getOrderedDimensionKeys = function getOrderedDimensionKeys(config) {
    return function () {
      return Object.keys(config.dimensions).sort(function (x, y) {
        return ascending(config.dimensions[x].index, config.dimensions[y].index);
      });
    };
  };

  var interactive = function interactive(flags) {
    return function () {
      flags.interactive = true;
      return this;
    };
  };

  var shadows = function shadows(flags, pc) {
    return function () {
      flags.shadows = true;
      pc.alphaOnBrushed(0.1);
      pc.render();
      return this;
    };
  };

  /**
   * Setup a new parallel coordinates chart.
   *
   * @param config
   * @param canvas
   * @param ctx
   * @returns {pc} a parcoords closure
   */
  var init$1 = function init(config, canvas, ctx) {
    /**
     * Create the chart within a container. The selector can also be a d3 selection.
     *
     * @param selection a d3 selection
     * @returns {pc} instance for chained api
     */
    var pc = function pc(selection$$1) {
      selection$$1 = pc.selection = select(selection$$1);

      config.width = selection$$1.node().clientWidth;
      config.height = selection$$1.node().clientHeight;
      // canvas data layers
      ['marks', 'foreground', 'brushed', 'highlight'].forEach(function (layer) {
        canvas[layer] = selection$$1.append('canvas').attr('class', layer).node();
        ctx[layer] = canvas[layer].getContext('2d');
      });

      // svg tick and brush layers
      pc.svg = selection$$1.append('svg').attr('width', config.width).attr('height', config.height).style('font', '14px sans-serif').style('position', 'absolute').append('svg:g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
      // for chained api
      return pc;
    };

    // for partial-application style programming
    return pc;
  };

  var flip = function flip(config) {
    return function (d) {
      //__.dimensions[d].yscale.domain().reverse();                               // does not work
      config.dimensions[d].yscale.domain(config.dimensions[d].yscale.domain().reverse()); // works

      return this;
    };
  };

  var detectDimensions = function detectDimensions(pc) {
    return function () {
      pc.dimensions(pc.applyDimensionDefaults());
      return this;
    };
  };

  var scale = function scale(config) {
    return function (d, domain) {
      config.dimensions[d].yscale.domain(domain);

      return this;
    };
  };

  var version$2 = "2.0.9";

  var DefaultConfig = {
    data: [],
    highlighted: [],
    dimensions: {},
    dimensionTitleRotation: 0,
    brushes: [],
    brushed: false,
    brushedColor: null,
    alphaOnBrushed: 0.0,
    mode: 'default',
    rate: 20,
    width: 600,
    height: 300,
    margin: { top: 24, right: 20, bottom: 12, left: 20 },
    nullValueSeparator: 'undefined', // set to "top" or "bottom"
    nullValueSeparatorPadding: { top: 8, right: 0, bottom: 8, left: 0 },
    color: '#069',
    composite: 'source-over',
    alpha: 0.7,
    bundlingStrength: 0.5,
    bundleDimension: null,
    smoothness: 0.0,
    showControlPoints: false,
    hideAxis: [],
    flipAxes: [],
    animationTime: 1100, // How long it takes to flip the axis when you double click
    rotateLabels: false
  };

  var _this$4 = undefined;

  var initState$1 = function initState(userConfig) {
    var config = Object.assign({}, DefaultConfig, userConfig);

    if (userConfig && userConfig.dimensionTitles) {
      console.warn('dimensionTitles passed in userConfig is deprecated. Add title to dimension object.');
      entries(userConfig.dimensionTitles).forEach(function (d) {
        if (config.dimensions[d.key]) {
          config.dimensions[d.key].title = config.dimensions[d.key].title ? config.dimensions[d.key].title : d.value;
        } else {
          config.dimensions[d.key] = {
            title: d.value
          };
        }
      });
    }

    var eventTypes = ['render', 'resize', 'highlight', 'brush', 'brushend', 'brushstart', 'axesreorder'].concat(keys(config));

    var events = dispatch.apply(_this$4, eventTypes),
        flags = {
      brushable: false,
      reorderable: false,
      axes: false,
      interactive: false,
      debug: false
    },
        xscale = point(),
        dragging = {},
        axis = axisLeft().ticks(5),
        ctx = {},
        canvas = {};

    var brush$$1 = {
      modes: {
        None: {
          install: function install(pc) {}, // Nothing to be done.
          uninstall: function uninstall(pc) {}, // Nothing to be done.
          selected: function selected() {
            return [];
          }, // Nothing to return
          brushState: function brushState() {
            return {};
          }
        }
      },
      mode: 'None',
      predicate: 'AND',
      currentMode: function currentMode() {
        return this.modes[this.mode];
      }
    };

    return {
      config: config,
      events: events,
      eventTypes: eventTypes,
      flags: flags,
      xscale: xscale,
      dragging: dragging,
      axis: axis,
      ctx: ctx,
      canvas: canvas,
      brush: brush$$1
    };
  };

  var computeClusterCentroids = function computeClusterCentroids(config, d) {
    var clusterCentroids = new Map();
    var clusterCounts = new Map();
    // determine clusterCounts
    config.data.forEach(function (row) {
      var scaled = config.dimensions[d].yscale(row[d]);
      if (!clusterCounts.has(scaled)) {
        clusterCounts.set(scaled, 0);
      }
      var count = clusterCounts.get(scaled);
      clusterCounts.set(scaled, count + 1);
    });

    config.data.forEach(function (row) {
      Object.keys(config.dimensions).map(function (p) {
        var scaled = config.dimensions[d].yscale(row[d]);
        if (!clusterCentroids.has(scaled)) {
          var _map = new Map();
          clusterCentroids.set(scaled, _map);
        }
        if (!clusterCentroids.get(scaled).has(p)) {
          clusterCentroids.get(scaled).set(p, 0);
        }
        var value = clusterCentroids.get(scaled).get(p);
        value += config.dimensions[p].yscale(row[p]) / clusterCounts.get(scaled);
        clusterCentroids.get(scaled).set(p, value);
      });
    });

    return clusterCentroids;
  };

  var _this$5 = undefined;

  var without = function without(arr, items) {
    items.forEach(function (el) {
      delete arr[el];
    });
    return arr;
  };

  var sideEffects = function sideEffects(config, ctx, pc, xscale, flags, brushedQueue, foregroundQueue) {
    return dispatch.apply(_this$5, Object.keys(config)).on('composite', function (d) {
      ctx.foreground.globalCompositeOperation = d.value;
      ctx.brushed.globalCompositeOperation = d.value;
    }).on('alpha', function (d) {
      ctx.foreground.globalAlpha = d.value;
      ctx.brushed.globalAlpha = d.value;
    }).on('brushedColor', function (d) {
      ctx.brushed.strokeStyle = d.value;
    }).on('width', function (d) {
      return pc.resize();
    }).on('height', function (d) {
      return pc.resize();
    }).on('margin', function (d) {
      return pc.resize();
    }).on('rate', function (d) {
      brushedQueue.rate(d.value);
      foregroundQueue.rate(d.value);
    }).on('dimensions', function (d) {
      config.dimensions = pc.applyDimensionDefaults(Object.keys(d.value));
      xscale.domain(pc.getOrderedDimensionKeys());
      pc.sortDimensions();
      if (flags.interactive) {
        pc.render().updateAxes();
      }
    }).on('bundleDimension', function (d) {
      if (!Object.keys(config.dimensions).length) pc.detectDimensions();
      pc.autoscale();
      if (typeof d.value === 'number') {
        if (d.value < Object.keys(config.dimensions).length) {
          config.bundleDimension = config.dimensions[d.value];
        } else if (d.value < config.hideAxis.length) {
          config.bundleDimension = config.hideAxis[d.value];
        }
      } else {
        config.bundleDimension = d.value;
      }

      config.clusterCentroids = computeClusterCentroids(config, config.bundleDimension);
      if (flags.interactive) {
        pc.render();
      }
    }).on('hideAxis', function (d) {
      pc.dimensions(pc.applyDimensionDefaults());
      pc.dimensions(without(config.dimensions, d.value));
    }).on('flipAxes', function (d) {
      if (d.value && d.value.length) {
        d.value.forEach(function (axis) {});
        pc.updateAxes(0);
      }
    });
  };

  var getset = function getset(obj, state, events, side_effects, pc) {
    Object.keys(state).forEach(function (key) {
      obj[key] = function (x) {
        if (!arguments.length) {
          return state[key];
        }
        if (key === 'dimensions' && Object.prototype.toString.call(x) === '[object Array]') {
          console.warn('pc.dimensions([]) is deprecated, use pc.dimensions({})');
          x = obj.applyDimensionDefaults(x);
        }
        var old = state[key];
        state[key] = x;
        side_effects.call(key, obj, { value: x, previous: old });
        events.call(key, obj, { value: x, previous: old });
        return obj;
      };
    });
  };

  // side effects for setters

  var d3_rebind = function d3_rebind(target, source, method) {
    return function () {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  };

  var _rebind = function _rebind(target, source, method) {
    target[method] = d3_rebind(target, source, source[method]);
    return target;
  };

  var bindEvents = function bindEvents(__, ctx, pc, xscale, flags, brushedQueue, foregroundQueue, events, axis) {
    var side_effects = sideEffects(__, ctx, pc, xscale, flags, brushedQueue, foregroundQueue);

    // create getter/setters
    getset(pc, __, events, side_effects, pc);

    // expose events
    // getter/setter with event firing
    _rebind(pc, events, 'on');

    _rebind(pc, axis, 'ticks', 'orient', 'tickValues', 'tickSubdivide', 'tickSize', 'tickPadding', 'tickFormat');
  };

  // misc

  var ParCoords = function ParCoords(userConfig) {
    var state = initState$1(userConfig);
    var config = state.config,
        events = state.events,
        flags = state.flags,
        xscale = state.xscale,
        dragging = state.dragging,
        axis = state.axis,
        ctx = state.ctx,
        canvas = state.canvas,
        brush$$1 = state.brush;

    var pc = init$1(config, canvas, ctx);

    var position = function position(d) {
      if (xscale.range().length === 0) {
        xscale.range([0, w(config)], 1);
      }
      return dragging[d] == null ? xscale(d) : dragging[d];
    };

    var brushedQueue = renderQueue(pathBrushed(config, ctx, position)).rate(50).clear(function () {
      return pc.clear('brushed');
    });

    var foregroundQueue = renderQueue(pathForeground(config, ctx, position)).rate(50).clear(function () {
      pc.clear('foreground');
      pc.clear('highlight');
    });

    bindEvents(config, ctx, pc, xscale, flags, brushedQueue, foregroundQueue, events, axis);

    // expose the state of the chart
    pc.state = config;
    pc.flags = flags;

    pc.autoscale = autoscale(config, pc, xscale, ctx);
    pc.scale = scale(config);
    pc.flip = flip(config);
    pc.commonScale = commonScale(config, pc);
    pc.detectDimensions = detectDimensions(pc);
    // attempt to determine types of each dimension based on first row of data
    pc.detectDimensionTypes = detectDimensionTypes;
    pc.applyDimensionDefaults = applyDimensionDefaults(config, pc);
    pc.getOrderedDimensionKeys = getOrderedDimensionKeys(config);

    //Renders the polylines.
    pc.render = render(config, pc, events);
    pc.renderBrushed = renderBrushed(config, pc, events);
    pc.render.default = renderDefault(config, pc, ctx, position);
    pc.render.queue = renderDefaultQueue(config, pc, foregroundQueue);
    pc.renderBrushed.default = renderBrushedDefault(config, ctx, position, pc, brush$$1);
    pc.renderBrushed.queue = renderBrushedQueue(config, brush$$1, brushedQueue);

    pc.compute_real_centroids = computeRealCentroids(config.dimensions, position);
    pc.shadows = shadows(flags, pc);
    pc.axisDots = axisDots(config, pc, position);
    pc.clear = clear(config, pc, ctx, brush$$1);
    pc.createAxes = createAxes(config, pc, xscale, flags, axis);
    pc.removeAxes = removeAxes(pc);
    pc.updateAxes = updateAxes(config, pc, position, axis, flags);
    pc.applyAxisConfig = applyAxisConfig;
    pc.brushable = brushable(config, pc, flags);
    pc.brushReset = brushReset$4(config);
    pc.selected = selected$4(config);
    pc.reorderable = reorderable(config, pc, xscale, position, dragging, flags);

    // Reorder dimensions, such that the highest value (visually) is on the left and
    // the lowest on the right. Visual values are determined by the data values in
    // the given row.
    pc.reorder = reorder(config, pc, xscale);
    pc.sortDimensionsByRowData = sortDimensionsByRowData(config);
    pc.sortDimensions = sortDimensions(config, position);

    // pairs of adjacent dimensions
    pc.adjacent_pairs = adjacentPairs;
    pc.interactive = interactive(flags);

    // expose internal state
    pc.xscale = xscale;
    pc.ctx = ctx;
    pc.canvas = canvas;
    pc.g = function () {
      return pc._g;
    };

    // rescale for height, width and margins
    // TODO currently assumes chart is brushable, and destroys old brushes
    pc.resize = resize(config, pc, flags, events);

    // highlight an array of data
    pc.highlight = highlight(config, pc, canvas, events, ctx, position);
    // clear highlighting
    pc.unhighlight = unhighlight(config, pc, canvas);

    // calculate 2d intersection of line a->b with line c->d
    // points are objects with x and y properties
    pc.intersection = intersection;

    // Merges the canvases and SVG elements into one canvas element which is then passed into the callback
    // (so you can choose to save it to disk, etc.)
    pc.mergeParcoords = mergeParcoords(pc);
    pc.brushModes = function () {
      return Object.getOwnPropertyNames(brush$$1.modes);
    };
    pc.brushMode = brushMode(brush$$1, config, pc);

    // install brushes
    install1DAxes(brush$$1, config, pc, events);
    install2DStrums(brush$$1, config, pc, events, xscale);
    installAngularBrush(brush$$1, config, pc, events, xscale);
    install1DMultiAxes(brush$$1, config, pc, events);

    pc.version = version$2;
    // this descriptive text should live with other introspective methods
    pc.toString = toString(config);
    pc.toType = toType;
    // try to coerce to number before returning type
    pc.toTypeCoerceNumbers = toTypeCoerceNumbers;

    return pc;
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var crossfilter = createCommonjsModule(function (module, exports) {
  (function (exports) {
    crossfilter.version = "1.3.12";
    function crossfilter_identity(d) {
      return d;
    }
    crossfilter.permute = permute;

    function permute(array, index) {
      for (var i = 0, n = index.length, copy = new Array(n); i < n; ++i) {
        copy[i] = array[index[i]];
      }
      return copy;
    }
    var bisect = crossfilter.bisect = bisect_by(crossfilter_identity);

    bisect.by = bisect_by;

    function bisect_by(f) {

      // Locate the insertion point for x in a to maintain sorted order. The
      // arguments lo and hi may be used to specify a subset of the array which
      // should be considered; by default the entire array is used. If x is already
      // present in a, the insertion point will be before (to the left of) any
      // existing entries. The return value is suitable for use as the first
      // argument to `array.splice` assuming that a is already sorted.
      //
      // The returned insertion point i partitions the array a into two halves so
      // that all v < x for v in a[lo:i] for the left side and all v >= x for v in
      // a[i:hi] for the right side.
      function bisectLeft(a, x, lo, hi) {
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (f(a[mid]) < x) lo = mid + 1;else hi = mid;
        }
        return lo;
      }

      // Similar to bisectLeft, but returns an insertion point which comes after (to
      // the right of) any existing entries of x in a.
      //
      // The returned insertion point i partitions the array into two halves so that
      // all v <= x for v in a[lo:i] for the left side and all v > x for v in
      // a[i:hi] for the right side.
      function bisectRight(a, x, lo, hi) {
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (x < f(a[mid])) hi = mid;else lo = mid + 1;
        }
        return lo;
      }

      bisectRight.right = bisectRight;
      bisectRight.left = bisectLeft;
      return bisectRight;
    }
    var heap = crossfilter.heap = heap_by(crossfilter_identity);

    heap.by = heap_by;

    function heap_by(f) {

      // Builds a binary heap within the specified array a[lo:hi]. The heap has the
      // property such that the parent a[lo+i] is always less than or equal to its
      // two children: a[lo+2*i+1] and a[lo+2*i+2].
      function heap(a, lo, hi) {
        var n = hi - lo,
            i = (n >>> 1) + 1;
        while (--i > 0) {
          sift(a, i, n, lo);
        }return a;
      }

      // Sorts the specified array a[lo:hi] in descending order, assuming it is
      // already a heap.
      function sort(a, lo, hi) {
        var n = hi - lo,
            t;
        while (--n > 0) {
          t = a[lo], a[lo] = a[lo + n], a[lo + n] = t, sift(a, 1, n, lo);
        }return a;
      }

      // Sifts the element a[lo+i-1] down the heap, where the heap is the contiguous
      // slice of array a[lo:lo+n]. This method can also be used to update the heap
      // incrementally, without incurring the full cost of reconstructing the heap.
      function sift(a, i, n, lo) {
        var d = a[--lo + i],
            x = f(d),
            child;
        while ((child = i << 1) <= n) {
          if (child < n && f(a[lo + child]) > f(a[lo + child + 1])) child++;
          if (x <= f(a[lo + child])) break;
          a[lo + i] = a[lo + child];
          i = child;
        }
        a[lo + i] = d;
      }

      heap.sort = sort;
      return heap;
    }
    var heapselect = crossfilter.heapselect = heapselect_by(crossfilter_identity);

    heapselect.by = heapselect_by;

    function heapselect_by(f) {
      var heap = heap_by(f);

      // Returns a new array containing the top k elements in the array a[lo:hi].
      // The returned array is not sorted, but maintains the heap property. If k is
      // greater than hi - lo, then fewer than k elements will be returned. The
      // order of elements in a is unchanged by this operation.
      function heapselect(a, lo, hi, k) {
        var queue = new Array(k = Math.min(hi - lo, k)),
            min,
            i,
            x,
            d;

        for (i = 0; i < k; ++i) {
          queue[i] = a[lo++];
        }heap(queue, 0, k);

        if (lo < hi) {
          min = f(queue[0]);
          do {
            if (x = f(d = a[lo]) > min) {
              queue[0] = d;
              min = f(heap(queue, 0, k)[0]);
            }
          } while (++lo < hi);
        }

        return queue;
      }

      return heapselect;
    }
    var insertionsort = crossfilter.insertionsort = insertionsort_by(crossfilter_identity);

    insertionsort.by = insertionsort_by;

    function insertionsort_by(f) {

      function insertionsort(a, lo, hi) {
        for (var i = lo + 1; i < hi; ++i) {
          for (var j = i, t = a[i], x = f(t); j > lo && f(a[j - 1]) > x; --j) {
            a[j] = a[j - 1];
          }
          a[j] = t;
        }
        return a;
      }

      return insertionsort;
    }
    // Algorithm designed by Vladimir Yaroslavskiy.
    // Implementation based on the Dart project; see lib/dart/LICENSE for details.

    var quicksort = crossfilter.quicksort = quicksort_by(crossfilter_identity);

    quicksort.by = quicksort_by;

    function quicksort_by(f) {
      var insertionsort = insertionsort_by(f);

      function sort(a, lo, hi) {
        return (hi - lo < quicksort_sizeThreshold ? insertionsort : quicksort)(a, lo, hi);
      }

      function quicksort(a, lo, hi) {
        // Compute the two pivots by looking at 5 elements.
        var sixth = (hi - lo) / 6 | 0,
            i1 = lo + sixth,
            i5 = hi - 1 - sixth,
            i3 = lo + hi - 1 >> 1,
            // The midpoint.
        i2 = i3 - sixth,
            i4 = i3 + sixth;

        var e1 = a[i1],
            x1 = f(e1),
            e2 = a[i2],
            x2 = f(e2),
            e3 = a[i3],
            x3 = f(e3),
            e4 = a[i4],
            x4 = f(e4),
            e5 = a[i5],
            x5 = f(e5);

        var t;

        // Sort the selected 5 elements using a sorting network.
        if (x1 > x2) t = e1, e1 = e2, e2 = t, t = x1, x1 = x2, x2 = t;
        if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
        if (x1 > x3) t = e1, e1 = e3, e3 = t, t = x1, x1 = x3, x3 = t;
        if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
        if (x1 > x4) t = e1, e1 = e4, e4 = t, t = x1, x1 = x4, x4 = t;
        if (x3 > x4) t = e3, e3 = e4, e4 = t, t = x3, x3 = x4, x4 = t;
        if (x2 > x5) t = e2, e2 = e5, e5 = t, t = x2, x2 = x5, x5 = t;
        if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
        if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;

        var pivot1 = e2,
            pivotValue1 = x2,
            pivot2 = e4,
            pivotValue2 = x4;

        // e2 and e4 have been saved in the pivot variables. They will be written
        // back, once the partitioning is finished.
        a[i1] = e1;
        a[i2] = a[lo];
        a[i3] = e3;
        a[i4] = a[hi - 1];
        a[i5] = e5;

        var less = lo + 1,
            // First element in the middle partition.
        great = hi - 2; // Last element in the middle partition.

        // Note that for value comparison, <, <=, >= and > coerce to a primitive via
        // Object.prototype.valueOf; == and === do not, so in order to be consistent
        // with natural order (such as for Date objects), we must do two compares.
        var pivotsEqual = pivotValue1 <= pivotValue2 && pivotValue1 >= pivotValue2;
        if (pivotsEqual) {

          // Degenerated case where the partitioning becomes a dutch national flag
          // problem.
          //
          // [ |  < pivot  | == pivot | unpartitioned | > pivot  | ]
          //  ^             ^          ^             ^            ^
          // left         less         k           great         right
          //
          // a[left] and a[right] are undefined and are filled after the
          // partitioning.
          //
          // Invariants:
          //   1) for x in ]left, less[ : x < pivot.
          //   2) for x in [less, k[ : x == pivot.
          //   3) for x in ]great, right[ : x > pivot.
          for (var k = less; k <= great; ++k) {
            var ek = a[k],
                xk = f(ek);
            if (xk < pivotValue1) {
              if (k !== less) {
                a[k] = a[less];
                a[less] = ek;
              }
              ++less;
            } else if (xk > pivotValue1) {

              // Find the first element <= pivot in the range [k - 1, great] and
              // put [:ek:] there. We know that such an element must exist:
              // When k == less, then el3 (which is equal to pivot) lies in the
              // interval. Otherwise a[k - 1] == pivot and the search stops at k-1.
              // Note that in the latter case invariant 2 will be violated for a
              // short amount of time. The invariant will be restored when the
              // pivots are put into their final positions.
              while (true) {
                var greatValue = f(a[great]);
                if (greatValue > pivotValue1) {
                  great--;
                  // This is the only location in the while-loop where a new
                  // iteration is started.
                  continue;
                } else if (greatValue < pivotValue1) {
                  // Triple exchange.
                  a[k] = a[less];
                  a[less++] = a[great];
                  a[great--] = ek;
                  break;
                } else {
                  a[k] = a[great];
                  a[great--] = ek;
                  // Note: if great < k then we will exit the outer loop and fix
                  // invariant 2 (which we just violated).
                  break;
                }
              }
            }
          }
        } else {

          // We partition the list into three parts:
          //  1. < pivot1
          //  2. >= pivot1 && <= pivot2
          //  3. > pivot2
          //
          // During the loop we have:
          // [ | < pivot1 | >= pivot1 && <= pivot2 | unpartitioned  | > pivot2  | ]
          //  ^            ^                        ^              ^             ^
          // left         less                     k              great        right
          //
          // a[left] and a[right] are undefined and are filled after the
          // partitioning.
          //
          // Invariants:
          //   1. for x in ]left, less[ : x < pivot1
          //   2. for x in [less, k[ : pivot1 <= x && x <= pivot2
          //   3. for x in ]great, right[ : x > pivot2
          for (var k = less; k <= great; k++) {
            var ek = a[k],
                xk = f(ek);
            if (xk < pivotValue1) {
              if (k !== less) {
                a[k] = a[less];
                a[less] = ek;
              }
              ++less;
            } else {
              if (xk > pivotValue2) {
                while (true) {
                  var greatValue = f(a[great]);
                  if (greatValue > pivotValue2) {
                    great--;
                    if (great < k) break;
                    // This is the only location inside the loop where a new
                    // iteration is started.
                    continue;
                  } else {
                    // a[great] <= pivot2.
                    if (greatValue < pivotValue1) {
                      // Triple exchange.
                      a[k] = a[less];
                      a[less++] = a[great];
                      a[great--] = ek;
                    } else {
                      // a[great] >= pivot1.
                      a[k] = a[great];
                      a[great--] = ek;
                    }
                    break;
                  }
                }
              }
            }
          }
        }

        // Move pivots into their final positions.
        // We shrunk the list from both sides (a[left] and a[right] have
        // meaningless values in them) and now we move elements from the first
        // and third partition into these locations so that we can store the
        // pivots.
        a[lo] = a[less - 1];
        a[less - 1] = pivot1;
        a[hi - 1] = a[great + 1];
        a[great + 1] = pivot2;

        // The list is now partitioned into three partitions:
        // [ < pivot1   | >= pivot1 && <= pivot2   |  > pivot2   ]
        //  ^            ^                        ^             ^
        // left         less                     great        right

        // Recursive descent. (Don't include the pivot values.)
        sort(a, lo, less - 1);
        sort(a, great + 2, hi);

        if (pivotsEqual) {
          // All elements in the second partition are equal to the pivot. No
          // need to sort them.
          return a;
        }

        // In theory it should be enough to call _doSort recursively on the second
        // partition.
        // The Android source however removes the pivot elements from the recursive
        // call if the second partition is too large (more than 2/3 of the list).
        if (less < i1 && great > i5) {
          var lessValue, greatValue;
          while ((lessValue = f(a[less])) <= pivotValue1 && lessValue >= pivotValue1) {
            ++less;
          }while ((greatValue = f(a[great])) <= pivotValue2 && greatValue >= pivotValue2) {
            --great;
          } // Copy paste of the previous 3-way partitioning with adaptions.
          //
          // We partition the list into three parts:
          //  1. == pivot1
          //  2. > pivot1 && < pivot2
          //  3. == pivot2
          //
          // During the loop we have:
          // [ == pivot1 | > pivot1 && < pivot2 | unpartitioned  | == pivot2 ]
          //              ^                      ^              ^
          //            less                     k              great
          //
          // Invariants:
          //   1. for x in [ *, less[ : x == pivot1
          //   2. for x in [less, k[ : pivot1 < x && x < pivot2
          //   3. for x in ]great, * ] : x == pivot2
          for (var k = less; k <= great; k++) {
            var ek = a[k],
                xk = f(ek);
            if (xk <= pivotValue1 && xk >= pivotValue1) {
              if (k !== less) {
                a[k] = a[less];
                a[less] = ek;
              }
              less++;
            } else {
              if (xk <= pivotValue2 && xk >= pivotValue2) {
                while (true) {
                  var greatValue = f(a[great]);
                  if (greatValue <= pivotValue2 && greatValue >= pivotValue2) {
                    great--;
                    if (great < k) break;
                    // This is the only location inside the loop where a new
                    // iteration is started.
                    continue;
                  } else {
                    // a[great] < pivot2.
                    if (greatValue < pivotValue1) {
                      // Triple exchange.
                      a[k] = a[less];
                      a[less++] = a[great];
                      a[great--] = ek;
                    } else {
                      // a[great] == pivot1.
                      a[k] = a[great];
                      a[great--] = ek;
                    }
                    break;
                  }
                }
              }
            }
          }
        }

        // The second partition has now been cleared of pivot elements and looks
        // as follows:
        // [  *  |  > pivot1 && < pivot2  | * ]
        //        ^                      ^
        //       less                  great
        // Sort the second partition using recursive descent.

        // The second partition looks as follows:
        // [  *  |  >= pivot1 && <= pivot2  | * ]
        //        ^                        ^
        //       less                    great
        // Simply sort it by recursive descent.

        return sort(a, less, great + 1);
      }

      return sort;
    }

    var quicksort_sizeThreshold = 32;
    var crossfilter_array8 = crossfilter_arrayUntyped,
        crossfilter_array16 = crossfilter_arrayUntyped,
        crossfilter_array32 = crossfilter_arrayUntyped,
        crossfilter_arrayLengthen = crossfilter_arrayLengthenUntyped,
        crossfilter_arrayWiden = crossfilter_arrayWidenUntyped;

    if (typeof Uint8Array !== "undefined") {
      crossfilter_array8 = function crossfilter_array8(n) {
        return new Uint8Array(n);
      };
      crossfilter_array16 = function crossfilter_array16(n) {
        return new Uint16Array(n);
      };
      crossfilter_array32 = function crossfilter_array32(n) {
        return new Uint32Array(n);
      };

      crossfilter_arrayLengthen = function crossfilter_arrayLengthen(array, length) {
        if (array.length >= length) return array;
        var copy = new array.constructor(length);
        copy.set(array);
        return copy;
      };

      crossfilter_arrayWiden = function crossfilter_arrayWiden(array, width) {
        var copy;
        switch (width) {
          case 16:
            copy = crossfilter_array16(array.length);break;
          case 32:
            copy = crossfilter_array32(array.length);break;
          default:
            throw new Error("invalid array width!");
        }
        copy.set(array);
        return copy;
      };
    }

    function crossfilter_arrayUntyped(n) {
      var array = new Array(n),
          i = -1;
      while (++i < n) {
        array[i] = 0;
      }return array;
    }

    function crossfilter_arrayLengthenUntyped(array, length) {
      var n = array.length;
      while (n < length) {
        array[n++] = 0;
      }return array;
    }

    function crossfilter_arrayWidenUntyped(array, width) {
      if (width > 32) throw new Error("invalid array width!");
      return array;
    }
    function crossfilter_filterExact(bisect, value) {
      return function (values) {
        var n = values.length;
        return [bisect.left(values, value, 0, n), bisect.right(values, value, 0, n)];
      };
    }

    function crossfilter_filterRange(bisect, range) {
      var min = range[0],
          max = range[1];
      return function (values) {
        var n = values.length;
        return [bisect.left(values, min, 0, n), bisect.left(values, max, 0, n)];
      };
    }

    function crossfilter_filterAll(values) {
      return [0, values.length];
    }
    function crossfilter_null() {
      return null;
    }
    function crossfilter_zero() {
      return 0;
    }
    function crossfilter_reduceIncrement(p) {
      return p + 1;
    }

    function crossfilter_reduceDecrement(p) {
      return p - 1;
    }

    function crossfilter_reduceAdd(f) {
      return function (p, v) {
        return p + +f(v);
      };
    }

    function crossfilter_reduceSubtract(f) {
      return function (p, v) {
        return p - f(v);
      };
    }
    exports.crossfilter = crossfilter;

    function crossfilter() {
      var crossfilter = {
        add: add,
        remove: removeData,
        dimension: dimension,
        groupAll: groupAll,
        size: size
      };

      var data = [],
          // the records
      n = 0,
          // the number of records; data.length
      m = 0,
          // a bit mask representing which dimensions are in use
      M = 8,
          // number of dimensions that can fit in `filters`
      filters = crossfilter_array8(0),
          // M bits per record; 1 is filtered out
      filterListeners = [],
          // when the filters change
      dataListeners = [],
          // when data is added
      removeDataListeners = []; // when data is removed

      // Adds the specified new records to this crossfilter.
      function add(newData) {
        var n0 = n,
            n1 = newData.length;

        // If there's actually new data to add…
        // Merge the new data into the existing data.
        // Lengthen the filter bitset to handle the new records.
        // Notify listeners (dimensions and groups) that new data is available.
        if (n1) {
          data = data.concat(newData);
          filters = crossfilter_arrayLengthen(filters, n += n1);
          dataListeners.forEach(function (l) {
            l(newData, n0, n1);
          });
        }

        return crossfilter;
      }

      // Removes all records that match the current filters.
      function removeData() {
        var newIndex = crossfilter_index(n, n),
            removed = [];
        for (var i = 0, j = 0; i < n; ++i) {
          if (filters[i]) newIndex[i] = j++;else removed.push(i);
        }

        // Remove all matching records from groups.
        filterListeners.forEach(function (l) {
          l(0, [], removed);
        });

        // Update indexes.
        removeDataListeners.forEach(function (l) {
          l(newIndex);
        });

        // Remove old filters and data by overwriting.
        for (var i = 0, j = 0, k; i < n; ++i) {
          if (k = filters[i]) {
            if (i !== j) filters[j] = k, data[j] = data[i];
            ++j;
          }
        }
        data.length = j;
        while (n > j) {
          filters[--n] = 0;
        }
      }

      // Adds a new dimension with the specified value accessor function.
      function dimension(value) {
        var dimension = {
          filter: filter,
          filterExact: filterExact,
          filterRange: filterRange,
          filterFunction: filterFunction,
          filterAll: filterAll,
          top: top,
          bottom: bottom,
          group: group,
          groupAll: groupAll,
          dispose: dispose,
          remove: dispose // for backwards-compatibility
        };

        var one = ~m & -~m,
            // lowest unset bit as mask, e.g., 00001000
        zero = ~one,
            // inverted one, e.g., 11110111
        values,
            // sorted, cached array
        index,
            // value rank ↦ object id
        newValues,
            // temporary array storing newly-added values
        newIndex,
            // temporary array storing newly-added index
        sort = quicksort_by(function (i) {
          return newValues[i];
        }),
            refilter = crossfilter_filterAll,
            // for recomputing filter
        refilterFunction,
            // the custom filter function in use
        indexListeners = [],
            // when data is added
        dimensionGroups = [],
            lo0 = 0,
            hi0 = 0;

        // Updating a dimension is a two-stage process. First, we must update the
        // associated filters for the newly-added records. Once all dimensions have
        // updated their filters, the groups are notified to update.
        dataListeners.unshift(preAdd);
        dataListeners.push(postAdd);

        removeDataListeners.push(removeData);

        // Incorporate any existing data into this dimension, and make sure that the
        // filter bitset is wide enough to handle the new dimension.
        m |= one;
        if (M >= 32 ? !one : m & -(1 << M)) {
          filters = crossfilter_arrayWiden(filters, M <<= 1);
        }
        preAdd(data, 0, n);
        postAdd(data, 0, n);

        // Incorporates the specified new records into this dimension.
        // This function is responsible for updating filters, values, and index.
        function preAdd(newData, n0, n1) {

          // Permute new values into natural order using a sorted index.
          newValues = newData.map(value);
          newIndex = sort(crossfilter_range(n1), 0, n1);
          newValues = permute(newValues, newIndex);

          // Bisect newValues to determine which new records are selected.
          var bounds = refilter(newValues),
              lo1 = bounds[0],
              hi1 = bounds[1],
              i;
          if (refilterFunction) {
            for (i = 0; i < n1; ++i) {
              if (!refilterFunction(newValues[i], i)) filters[newIndex[i] + n0] |= one;
            }
          } else {
            for (i = 0; i < lo1; ++i) {
              filters[newIndex[i] + n0] |= one;
            }for (i = hi1; i < n1; ++i) {
              filters[newIndex[i] + n0] |= one;
            }
          }

          // If this dimension previously had no data, then we don't need to do the
          // more expensive merge operation; use the new values and index as-is.
          if (!n0) {
            values = newValues;
            index = newIndex;
            lo0 = lo1;
            hi0 = hi1;
            return;
          }

          var oldValues = values,
              oldIndex = index,
              i0 = 0,
              i1 = 0;

          // Otherwise, create new arrays into which to merge new and old.
          values = new Array(n);
          index = crossfilter_index(n, n);

          // Merge the old and new sorted values, and old and new index.
          for (i = 0; i0 < n0 && i1 < n1; ++i) {
            if (oldValues[i0] < newValues[i1]) {
              values[i] = oldValues[i0];
              index[i] = oldIndex[i0++];
            } else {
              values[i] = newValues[i1];
              index[i] = newIndex[i1++] + n0;
            }
          }

          // Add any remaining old values.
          for (; i0 < n0; ++i0, ++i) {
            values[i] = oldValues[i0];
            index[i] = oldIndex[i0];
          }

          // Add any remaining new values.
          for (; i1 < n1; ++i1, ++i) {
            values[i] = newValues[i1];
            index[i] = newIndex[i1] + n0;
          }

          // Bisect again to recompute lo0 and hi0.
          bounds = refilter(values), lo0 = bounds[0], hi0 = bounds[1];
        }

        // When all filters have updated, notify index listeners of the new values.
        function postAdd(newData, n0, n1) {
          indexListeners.forEach(function (l) {
            l(newValues, newIndex, n0, n1);
          });
          newValues = newIndex = null;
        }

        function removeData(reIndex) {
          for (var i = 0, j = 0, k; i < n; ++i) {
            if (filters[k = index[i]]) {
              if (i !== j) values[j] = values[i];
              index[j] = reIndex[k];
              ++j;
            }
          }
          values.length = j;
          while (j < n) {
            index[j++] = 0;
          } // Bisect again to recompute lo0 and hi0.
          var bounds = refilter(values);
          lo0 = bounds[0], hi0 = bounds[1];
        }

        // Updates the selected values based on the specified bounds [lo, hi].
        // This implementation is used by all the public filter methods.
        function filterIndexBounds(bounds) {
          var lo1 = bounds[0],
              hi1 = bounds[1];

          if (refilterFunction) {
            refilterFunction = null;
            filterIndexFunction(function (d, i) {
              return lo1 <= i && i < hi1;
            });
            lo0 = lo1;
            hi0 = hi1;
            return dimension;
          }

          var i,
              j,
              k,
              added = [],
              removed = [];

          // Fast incremental update based on previous lo index.
          if (lo1 < lo0) {
            for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
              filters[k = index[i]] ^= one;
              added.push(k);
            }
          } else if (lo1 > lo0) {
            for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
              filters[k = index[i]] ^= one;
              removed.push(k);
            }
          }

          // Fast incremental update based on previous hi index.
          if (hi1 > hi0) {
            for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
              filters[k = index[i]] ^= one;
              added.push(k);
            }
          } else if (hi1 < hi0) {
            for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
              filters[k = index[i]] ^= one;
              removed.push(k);
            }
          }

          lo0 = lo1;
          hi0 = hi1;
          filterListeners.forEach(function (l) {
            l(one, added, removed);
          });
          return dimension;
        }

        // Filters this dimension using the specified range, value, or null.
        // If the range is null, this is equivalent to filterAll.
        // If the range is an array, this is equivalent to filterRange.
        // Otherwise, this is equivalent to filterExact.
        function filter(range) {
          return range == null ? filterAll() : Array.isArray(range) ? filterRange(range) : typeof range === "function" ? filterFunction(range) : filterExact(range);
        }

        // Filters this dimension to select the exact value.
        function filterExact(value) {
          return filterIndexBounds((refilter = crossfilter_filterExact(bisect, value))(values));
        }

        // Filters this dimension to select the specified range [lo, hi].
        // The lower bound is inclusive, and the upper bound is exclusive.
        function filterRange(range) {
          return filterIndexBounds((refilter = crossfilter_filterRange(bisect, range))(values));
        }

        // Clears any filters on this dimension.
        function filterAll() {
          return filterIndexBounds((refilter = crossfilter_filterAll)(values));
        }

        // Filters this dimension using an arbitrary function.
        function filterFunction(f) {
          refilter = crossfilter_filterAll;

          filterIndexFunction(refilterFunction = f);

          lo0 = 0;
          hi0 = n;

          return dimension;
        }

        function filterIndexFunction(f) {
          var i,
              k,
              x,
              added = [],
              removed = [];

          for (i = 0; i < n; ++i) {
            if (!(filters[k = index[i]] & one) ^ !!(x = f(values[i], i))) {
              if (x) filters[k] &= zero, added.push(k);else filters[k] |= one, removed.push(k);
            }
          }
          filterListeners.forEach(function (l) {
            l(one, added, removed);
          });
        }

        // Returns the top K selected records based on this dimension's order.
        // Note: observes this dimension's filter, unlike group and groupAll.
        function top(k) {
          var array = [],
              i = hi0,
              j;

          while (--i >= lo0 && k > 0) {
            if (!filters[j = index[i]]) {
              array.push(data[j]);
              --k;
            }
          }

          return array;
        }

        // Returns the bottom K selected records based on this dimension's order.
        // Note: observes this dimension's filter, unlike group and groupAll.
        function bottom(k) {
          var array = [],
              i = lo0,
              j;

          while (i < hi0 && k > 0) {
            if (!filters[j = index[i]]) {
              array.push(data[j]);
              --k;
            }
            i++;
          }

          return array;
        }

        // Adds a new group to this dimension, using the specified key function.
        function group(key) {
          var group = {
            top: top,
            all: all,
            reduce: reduce,
            reduceCount: reduceCount,
            reduceSum: reduceSum,
            order: order,
            orderNatural: orderNatural,
            size: size,
            dispose: dispose,
            remove: dispose // for backwards-compatibility
          };

          // Ensure that this group will be removed when the dimension is removed.
          dimensionGroups.push(group);

          var groups,
              // array of {key, value}
          groupIndex,
              // object id ↦ group id
          groupWidth = 8,
              groupCapacity = crossfilter_capacity(groupWidth),
              k = 0,
              // cardinality
          select,
              heap,
              reduceAdd,
              reduceRemove,
              reduceInitial,
              update = crossfilter_null,
              reset = crossfilter_null,
              resetNeeded = true,
              groupAll = key === crossfilter_null;

          if (arguments.length < 1) key = crossfilter_identity;

          // The group listens to the crossfilter for when any dimension changes, so
          // that it can update the associated reduce values. It must also listen to
          // the parent dimension for when data is added, and compute new keys.
          filterListeners.push(update);
          indexListeners.push(add);
          removeDataListeners.push(removeData);

          // Incorporate any existing data into the grouping.
          add(values, index, 0, n);

          // Incorporates the specified new values into this group.
          // This function is responsible for updating groups and groupIndex.
          function add(newValues, newIndex, n0, n1) {
            var oldGroups = groups,
                reIndex = crossfilter_index(k, groupCapacity),
                add = reduceAdd,
                initial = reduceInitial,
                k0 = k,
                // old cardinality
            i0 = 0,
                // index of old group
            i1 = 0,
                // index of new record
            j,
                // object id
            g0,
                // old group
            x0,
                // old key
            x1,
                // new key
            g,
                // group to add
            x; // key of group to add

            // If a reset is needed, we don't need to update the reduce values.
            if (resetNeeded) add = initial = crossfilter_null;

            // Reset the new groups (k is a lower bound).
            // Also, make sure that groupIndex exists and is long enough.
            groups = new Array(k), k = 0;
            groupIndex = k0 > 1 ? crossfilter_arrayLengthen(groupIndex, n) : crossfilter_index(n, groupCapacity);

            // Get the first old key (x0 of g0), if it exists.
            if (k0) x0 = (g0 = oldGroups[0]).key;

            // Find the first new key (x1), skipping NaN keys.
            while (i1 < n1 && !((x1 = key(newValues[i1])) >= x1)) {
              ++i1;
            } // While new keys remain…
            while (i1 < n1) {

              // Determine the lesser of the two current keys; new and old.
              // If there are no old keys remaining, then always add the new key.
              if (g0 && x0 <= x1) {
                g = g0, x = x0;

                // Record the new index of the old group.
                reIndex[i0] = k;

                // Retrieve the next old key.
                if (g0 = oldGroups[++i0]) x0 = g0.key;
              } else {
                g = { key: x1, value: initial() }, x = x1;
              }

              // Add the lesser group.
              groups[k] = g;

              // Add any selected records belonging to the added group, while
              // advancing the new key and populating the associated group index.
              while (!(x1 > x)) {
                groupIndex[j = newIndex[i1] + n0] = k;
                if (!(filters[j] & zero)) g.value = add(g.value, data[j]);
                if (++i1 >= n1) break;
                x1 = key(newValues[i1]);
              }

              groupIncrement();
            }

            // Add any remaining old groups that were greater than all new keys.
            // No incremental reduce is needed; these groups have no new records.
            // Also record the new index of the old group.
            while (i0 < k0) {
              groups[reIndex[i0] = k] = oldGroups[i0++];
              groupIncrement();
            }

            // If we added any new groups before any old groups,
            // update the group index of all the old records.
            if (k > i0) for (i0 = 0; i0 < n0; ++i0) {
              groupIndex[i0] = reIndex[groupIndex[i0]];
            }

            // Modify the update and reset behavior based on the cardinality.
            // If the cardinality is less than or equal to one, then the groupIndex
            // is not needed. If the cardinality is zero, then there are no records
            // and therefore no groups to update or reset. Note that we also must
            // change the registered listener to point to the new method.
            j = filterListeners.indexOf(update);
            if (k > 1) {
              update = updateMany;
              reset = resetMany;
            } else {
              if (!k && groupAll) {
                k = 1;
                groups = [{ key: null, value: initial() }];
              }
              if (k === 1) {
                update = updateOne;
                reset = resetOne;
              } else {
                update = crossfilter_null;
                reset = crossfilter_null;
              }
              groupIndex = null;
            }
            filterListeners[j] = update;

            // Count the number of added groups,
            // and widen the group index as needed.
            function groupIncrement() {
              if (++k === groupCapacity) {
                reIndex = crossfilter_arrayWiden(reIndex, groupWidth <<= 1);
                groupIndex = crossfilter_arrayWiden(groupIndex, groupWidth);
                groupCapacity = crossfilter_capacity(groupWidth);
              }
            }
          }

          function removeData() {
            if (k > 1) {
              var oldK = k,
                  oldGroups = groups,
                  seenGroups = crossfilter_index(oldK, oldK);

              // Filter out non-matches by copying matching group index entries to
              // the beginning of the array.
              for (var i = 0, j = 0; i < n; ++i) {
                if (filters[i]) {
                  seenGroups[groupIndex[j] = groupIndex[i]] = 1;
                  ++j;
                }
              }

              // Reassemble groups including only those groups that were referred
              // to by matching group index entries.  Note the new group index in
              // seenGroups.
              groups = [], k = 0;
              for (i = 0; i < oldK; ++i) {
                if (seenGroups[i]) {
                  seenGroups[i] = k++;
                  groups.push(oldGroups[i]);
                }
              }

              if (k > 1) {
                // Reindex the group index using seenGroups to find the new index.
                for (var i = 0; i < j; ++i) {
                  groupIndex[i] = seenGroups[groupIndex[i]];
                }
              } else {
                groupIndex = null;
              }
              filterListeners[filterListeners.indexOf(update)] = k > 1 ? (reset = resetMany, update = updateMany) : k === 1 ? (reset = resetOne, update = updateOne) : reset = update = crossfilter_null;
            } else if (k === 1) {
              if (groupAll) return;
              for (var i = 0; i < n; ++i) {
                if (filters[i]) return;
              }groups = [], k = 0;
              filterListeners[filterListeners.indexOf(update)] = update = reset = crossfilter_null;
            }
          }

          // Reduces the specified selected or deselected records.
          // This function is only used when the cardinality is greater than 1.
          function updateMany(filterOne, added, removed) {
            if (filterOne === one || resetNeeded) return;

            var i, k, n, g;

            // Add the added values.
            for (i = 0, n = added.length; i < n; ++i) {
              if (!(filters[k = added[i]] & zero)) {
                g = groups[groupIndex[k]];
                g.value = reduceAdd(g.value, data[k]);
              }
            }

            // Remove the removed values.
            for (i = 0, n = removed.length; i < n; ++i) {
              if ((filters[k = removed[i]] & zero) === filterOne) {
                g = groups[groupIndex[k]];
                g.value = reduceRemove(g.value, data[k]);
              }
            }
          }

          // Reduces the specified selected or deselected records.
          // This function is only used when the cardinality is 1.
          function updateOne(filterOne, added, removed) {
            if (filterOne === one || resetNeeded) return;

            var i,
                k,
                n,
                g = groups[0];

            // Add the added values.
            for (i = 0, n = added.length; i < n; ++i) {
              if (!(filters[k = added[i]] & zero)) {
                g.value = reduceAdd(g.value, data[k]);
              }
            }

            // Remove the removed values.
            for (i = 0, n = removed.length; i < n; ++i) {
              if ((filters[k = removed[i]] & zero) === filterOne) {
                g.value = reduceRemove(g.value, data[k]);
              }
            }
          }

          // Recomputes the group reduce values from scratch.
          // This function is only used when the cardinality is greater than 1.
          function resetMany() {
            var i, g;

            // Reset all group values.
            for (i = 0; i < k; ++i) {
              groups[i].value = reduceInitial();
            }

            // Add any selected records.
            for (i = 0; i < n; ++i) {
              if (!(filters[i] & zero)) {
                g = groups[groupIndex[i]];
                g.value = reduceAdd(g.value, data[i]);
              }
            }
          }

          // Recomputes the group reduce values from scratch.
          // This function is only used when the cardinality is 1.
          function resetOne() {
            var i,
                g = groups[0];

            // Reset the singleton group values.
            g.value = reduceInitial();

            // Add any selected records.
            for (i = 0; i < n; ++i) {
              if (!(filters[i] & zero)) {
                g.value = reduceAdd(g.value, data[i]);
              }
            }
          }

          // Returns the array of group values, in the dimension's natural order.
          function all() {
            if (resetNeeded) reset(), resetNeeded = false;
            return groups;
          }

          // Returns a new array containing the top K group values, in reduce order.
          function top(k) {
            var top = select(all(), 0, groups.length, k);
            return heap.sort(top, 0, top.length);
          }

          // Sets the reduce behavior for this group to use the specified functions.
          // This method lazily recomputes the reduce values, waiting until needed.
          function reduce(add, remove, initial) {
            reduceAdd = add;
            reduceRemove = remove;
            reduceInitial = initial;
            resetNeeded = true;
            return group;
          }

          // A convenience method for reducing by count.
          function reduceCount() {
            return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
          }

          // A convenience method for reducing by sum(value).
          function reduceSum(value) {
            return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
          }

          // Sets the reduce order, using the specified accessor.
          function order(value) {
            select = heapselect_by(valueOf);
            heap = heap_by(valueOf);
            function valueOf(d) {
              return value(d.value);
            }
            return group;
          }

          // A convenience method for natural ordering by reduce value.
          function orderNatural() {
            return order(crossfilter_identity);
          }

          // Returns the cardinality of this group, irrespective of any filters.
          function size() {
            return k;
          }

          // Removes this group and associated event listeners.
          function dispose() {
            var i = filterListeners.indexOf(update);
            if (i >= 0) filterListeners.splice(i, 1);
            i = indexListeners.indexOf(add);
            if (i >= 0) indexListeners.splice(i, 1);
            i = removeDataListeners.indexOf(removeData);
            if (i >= 0) removeDataListeners.splice(i, 1);
            return group;
          }

          return reduceCount().orderNatural();
        }

        // A convenience function for generating a singleton group.
        function groupAll() {
          var g = group(crossfilter_null),
              all = g.all;
          delete g.all;
          delete g.top;
          delete g.order;
          delete g.orderNatural;
          delete g.size;
          g.value = function () {
            return all()[0].value;
          };
          return g;
        }

        // Removes this dimension and associated groups and event listeners.
        function dispose() {
          dimensionGroups.forEach(function (group) {
            group.dispose();
          });
          var i = dataListeners.indexOf(preAdd);
          if (i >= 0) dataListeners.splice(i, 1);
          i = dataListeners.indexOf(postAdd);
          if (i >= 0) dataListeners.splice(i, 1);
          i = removeDataListeners.indexOf(removeData);
          if (i >= 0) removeDataListeners.splice(i, 1);
          m &= zero;
          return filterAll();
        }

        return dimension;
      }

      // A convenience method for groupAll on a dummy dimension.
      // This implementation can be optimized since it always has cardinality 1.
      function groupAll() {
        var group = {
          reduce: reduce,
          reduceCount: reduceCount,
          reduceSum: reduceSum,
          value: value,
          dispose: dispose,
          remove: dispose // for backwards-compatibility
        };

        var reduceValue,
            reduceAdd,
            reduceRemove,
            reduceInitial,
            resetNeeded = true;

        // The group listens to the crossfilter for when any dimension changes, so
        // that it can update the reduce value. It must also listen to the parent
        // dimension for when data is added.
        filterListeners.push(update);
        dataListeners.push(add);

        // For consistency; actually a no-op since resetNeeded is true.
        add(data, 0, n);

        // Incorporates the specified new values into this group.
        function add(newData, n0) {
          var i;

          if (resetNeeded) return;

          // Add the added values.
          for (i = n0; i < n; ++i) {
            if (!filters[i]) {
              reduceValue = reduceAdd(reduceValue, data[i]);
            }
          }
        }

        // Reduces the specified selected or deselected records.
        function update(filterOne, added, removed) {
          var i, k, n;

          if (resetNeeded) return;

          // Add the added values.
          for (i = 0, n = added.length; i < n; ++i) {
            if (!filters[k = added[i]]) {
              reduceValue = reduceAdd(reduceValue, data[k]);
            }
          }

          // Remove the removed values.
          for (i = 0, n = removed.length; i < n; ++i) {
            if (filters[k = removed[i]] === filterOne) {
              reduceValue = reduceRemove(reduceValue, data[k]);
            }
          }
        }

        // Recomputes the group reduce value from scratch.
        function reset() {
          var i;

          reduceValue = reduceInitial();

          for (i = 0; i < n; ++i) {
            if (!filters[i]) {
              reduceValue = reduceAdd(reduceValue, data[i]);
            }
          }
        }

        // Sets the reduce behavior for this group to use the specified functions.
        // This method lazily recomputes the reduce value, waiting until needed.
        function reduce(add, remove, initial) {
          reduceAdd = add;
          reduceRemove = remove;
          reduceInitial = initial;
          resetNeeded = true;
          return group;
        }

        // A convenience method for reducing by count.
        function reduceCount() {
          return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
        }

        // A convenience method for reducing by sum(value).
        function reduceSum(value) {
          return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
        }

        // Returns the computed reduce value.
        function value() {
          if (resetNeeded) reset(), resetNeeded = false;
          return reduceValue;
        }

        // Removes this group and associated event listeners.
        function dispose() {
          var i = filterListeners.indexOf(update);
          if (i >= 0) filterListeners.splice(i);
          i = dataListeners.indexOf(add);
          if (i >= 0) dataListeners.splice(i);
          return group;
        }

        return reduceCount();
      }

      // Returns the number of records in this crossfilter, irrespective of any filters.
      function size() {
        return n;
      }

      return arguments.length ? add(arguments[0]) : crossfilter;
    }

    // Returns an array of size n, big enough to store ids up to m.
    function crossfilter_index(n, m) {
      return (m < 0x101 ? crossfilter_array8 : m < 0x10001 ? crossfilter_array16 : crossfilter_array32)(n);
    }

    // Constructs a new array of size n, with sequential values from 0 to n - 1.
    function crossfilter_range(n) {
      var range = crossfilter_index(n, n);
      for (var i = -1; ++i < n;) {
        range[i] = i;
      }return range;
    }

    function crossfilter_capacity(w) {
      return w === 8 ? 0x100 : w === 16 ? 0x10000 : 0x100000000;
    }
  })(exports || commonjsGlobal);
  });

  var crossfilter$1 = crossfilter.crossfilter;

  //https://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
  var isNumeric = function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  var sortDim = function sortDim(state) {
    return function (_data) {
      var _direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'asc';

      var _options = state._options;


      if (_options.plots.dimensions != null) {
        console.log('dimensions have been already defined, no need to auto detect');
        return {};
      }

      var _dimensionList = [];
      var ndx = crossfilter$1(_data);
      var sample = _data[0];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var _k = _step.value;

          var _value = sample[_k];

          if (isNumeric(_value) || _value instanceof Date) {
            // nothing to do
            _dimensionList.push(_k);
          } else {
            // only massive string discrete values will cause performance problems
            var _dim = ndx.dimension(function (d) {
              return d[_k];
            });
            var size = _dim.group().size();

            if (size > 3000) ; else {
              _dimensionList.push(_k);
            }
          }
        };

        for (var _iterator = keys(sample)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

      _dimensionList.sort(function (a, b) {
        return _direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
      });

      var retDim = {};

      for (var i = 0; i < _dimensionList.length; i++) {
        var name = _dimensionList[i];
        retDim[name] = {
          title: name,
          index: i
        };
      }

      return retDim;
    };
  };

  var draw = function draw(state) {
    var _containerId = state._containerId,
        _options = state._options,
        _data = state._data,
        _color = state._color;


    if (!select(_containerId).classed('parcoords')) {
      select(_containerId).classed('parcoords', true);
    }

    var config = Object.assign({}, _options.plots);
    config.data = _data;

    if (!config.margin) {
      config.margin = _options.chart.margin;
    }

    state.parcoords = ParCoords(config)(_containerId);
    state.parcoords.evenScale(_options.plots.evenScale);
    state.parcoords.color(function (d) {
      return _options.plots.colorDimension ? _color(d[_options.plots.colorDimension]) : _options.plots.defaultColor;
    });

    // dimensions
    if (_options.plots.dimensions !== undefined && _options.plots.dimensions !== null) {
      state.parcoords.dimensions(_options.plots.dimensions);
    } else {
      state.parcoords.dimensions(sortDim(state)(_data, _options.plots.autoSortDimensions));
    }

    if (_options.plots.hideAxis !== null && _options.plots.hideAxis.length > 0) {
      state.parcoords.hideAxis(_options.plots.hideAxis);
    }

    if (_options.plots.bundleDimension) {
      state.parcoords.bundleDimension(_options.plots.bundleDimension);
    }

    state.parcoords.render();

    // Brush
    state.brushMode(_options.plots.brushMode);
    state.brushPredicate(_options.plots.brushPredicate);
  };

  var apiRender$2 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);
        select('svg').remove();
        draw(state);
      }
    };
  };

  var apiUpdate$1 = function apiUpdate$$1(state) {
    return {
      update: function update() {
        apiUpdate(state).update();
        draw(state);
      }
    };
  };

  var apiColor$1 = function apiColor(state) {
    return {
      color: function color(colorOptions) {
        var parcoords = state.parcoords,
            _options = state._options;

        _options.color = colorOptions;
        state._color = state._composers.color(colorOptions);

        parcoords.color(function (d) {
          return state._color(d[_options.plots.colorDimension]);
        }).render();
      }
    };
  };

  var apiColorDimension = function apiColorDimension(state) {
    return {
      colorDimension: function colorDimension(_dimension) {
        var _options = state._options,
            parcoords = state.parcoords,
            _data = state._data;


        _options.plots.colorDimension = _dimension;

        if (_dimension === undefined || _dimension === null) {
          parcoords.color(function (d) {
            return _options.plots.defaultColor;
          }).render();
          return;
        }

        var _dim = parcoords.dimensions()[_dimension];
        if (!_dim) {
          throw new Error('invalid dimension, please use getDimensions() firstly. ' + _dimension);
        }

        switch (_dim.type) {
          case FiledType.STRING:
            _options.color.scaleType = 'categorical';
            break;
          case FiledType.NUMBER:
          case FiledType.DATE:
            _options.color.scaleType = 'gradient';
            break;

          default:
            _options.color.scaleType = 'categorical';
            break;
        }

        state._color = categoricalColor(_options.color.scheme);

        var _color = state._color;


        switch (_dim.type) {
          case FiledType.STRING:
            break;
          case FiledType.NUMBER:
          case FiledType.DATE:
            _color.domain(extent(_data, function (d) {
              return d[_dimension];
            }));
            break;

          default:
            break;
        }

        parcoords.color(function (d) {
          return _color(d[_dimension]);
        }).render();
      }
    };
  };

  var apiSortDimensions = function apiSortDimensions(state) {
    return {
      sortDimensions: sortDim(state)
    };
  };

  var apiHideAxis = function apiHideAxis(state) {
    return {
      hideAxis: function hideAxis(_axis) {
        state.parcoords.hideAxis(_axis);
      }
    };
  };

  var apiAlpha = function apiAlpha(state) {
    return {
      alpha: function alpha(_alpha) {
        state._options.plots.alpha = _alpha;
        state.parcoords.alpha(_alpha);
      }
    };
  };

  var apiGetComposites = function apiGetComposites(state) {
    return {
      getComposites: function getComposites() {
        return ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darken', 'xor', 'copy'];
      }
    };
  };

  var apiEvenScale = function apiEvenScale(state) {
    return {
      evenScale: function evenScale(_evenScale) {
        state._options.plots.evenScale = _evenScale;
        state.parcoords.evenScale(_evenScale);
      }
    };
  };

  var apiBundleDimension = function apiBundleDimension(state) {
    return {
      /**
       * requires sylvester and lapack to run
       * try install them in your app: npm install --save sylvester, npm install --save lapack
       *
       * @param _dimension
       */
      bundleDimension: function bundleDimension(_dimension) {
        state._options.plots.bundleDimension = _dimension;
        state.parcoords.bundleDimension(_dimension);
      }
    };
  };

  var apiBundleStrength = function apiBundleStrength(state) {
    return {
      bundlingStrength: function bundlingStrength(_strength) {
        state._options.plots.bundlingStrength = _strength;
        state.parcoords.bundlingStrength(_strength);
      }
    };
  };

  var apiComposite = function apiComposite(state) {
    return {
      composite: function composite(_composite) {
        state._options.plots.composite = _composite;
        state.parcoords.composite(_composite);
      }
    };
  };

  var apiCurveSmoothness = function apiCurveSmoothness(state) {
    return {
      curveSmoothness: function curveSmoothness(_smoothness) {
        state._options.plots.smoothness = _smoothness;
        state.parcoords.smoothness(_smoothness);
      }
    };
  };

  var apiBrushMode = function apiBrushMode(state) {
    return {
      brushMode: function brushMode(_mode) {
        state._options.plots.brushMode = _mode;
        state.parcoords.brushMode(_mode);
      }
    };
  };

  var apiMode = function apiMode(state) {
    return {
      mode: function mode(_mode) {
        state._options.plots.mode = _mode;
        state.parcoords.mode(_mode);
      }
    };
  };

  var apiBrushPredicate = function apiBrushPredicate(state) {
    return {
      brushPredicate: function brushPredicate(_predicate) {
        state._options.plots.brushPredicate = _predicate;
        state.parcoords.brushPredicate(_predicate);
      }
    };
  };

  var apiGetDimensions = function apiGetDimensions(state) {
    return {
      getDimensions: function getDimensions() {
        return state.parcoords.dimensions();
      }
    };
  };

  var apiGetBrushModes = function apiGetBrushModes(state) {
    return {
      getBrushModes: function getBrushModes() {
        return state.parcoords.brushModes();
      }
    };
  };

  var apiResetBrushes = function apiResetBrushes(state) {
    return {
      resetBrushes: function resetBrushes() {
        state.parcoords.brushReset();
      }
    };
  };

  var DefaultOptions = {
    chart: {
      type: 'parallel_coordinates'
    },
    color: DefaultCategoricalColor,
    plots: {
      defaultColor: '#1f78b4',
      colorDimension: null,
      hideAxis: [],
      flipAxes: [],
      alpha: 0.7,
      bundlingStrength: 0.5,
      bundleDimension: null,
      composite: 'darken',
      smoothness: 0.0,
      showControlPoints: false,
      animationTime: 1100, // How long it takes to flip the axis when you double click
      brushMode: '1D-axes',
      brushPredicate: 'AND',
      mode: 'queue',
      nullValueSeparator: 'undefined', // set to "top" or "bottom"
      nullValueSeparatorPadding: { top: 8, right: 0, bottom: 8, left: 0 },
      dimensions: {},
      autoSortDimensions: 'asc',
      evenScale: null
    }
  };

  var composers = {
    opt: DefaultOptions
  };

  var index = factory(svgLayer, composers, [apiRender$2, apiUpdate$1, apiColor$1, apiColorDimension, apiSortDimensions, apiHideAxis, apiAlpha, apiGetComposites, apiEvenScale, apiBundleDimension, apiBundleStrength, apiComposite, apiCurveSmoothness, apiBrushMode, apiMode, apiBrushPredicate, apiGetDimensions, apiGetBrushModes, apiResetBrushes]);

  var _buildPartite = function _buildPartite(data, _p) {
    var sData = {};

    sData.keys = [set$1(data.map(function (d) {
      return d[0];
    })).values().sort(function (a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }), set$1(data.map(function (d) {
      return d[1];
    })).values().sort(function (a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    })];

    sData.data = [sData.keys[0].map(function (d) {
      return sData.keys[1].map(function (v) {
        return 0;
      });
    }), sData.keys[1].map(function (d) {
      return sData.keys[0].map(function (v) {
        return 0;
      });
    })];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var d = _step.value;

        var key0 = sData.keys[0].indexOf(d[0]);
        var key1 = sData.keys[1].indexOf(d[1]);

        if (sData.data[0]) {
          sData.data[0][key0][key1] = d[_p];
        }
        if (sData.data[1]) {
          sData.data[1][key1][key0] = d[_p];
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

    return sData;
  };

  var buildPartiteData = function buildPartiteData(data, opt) {
    var chartData = data.slice();

    var temp = chartData.map(function (d) {
      return [d[opt.data.source.accessor], d[opt.data.target.accessor], +d[opt.data.links[0].accessor], +d[opt.data.links[1].accessor]];
    });

    return [{
      data: _buildPartite(temp, 2),
      id: 'part_01',
      header: [opt.data.source.name, opt.data.target.name, opt.data.links[0].name]
    }, {
      data: _buildPartite(temp, 3),
      id: 'part_02',
      header: [opt.data.source.name, opt.data.target.name, opt.data.links[1].name]
    }];
  };

  var DefaultOptions$1 = {
    chart: { type: 'biPartite' },
    animation: {
      duration: {
        partite: 500
      }
    },
    data: {
      source: {
        name: null,
        type: Globals.DataType.STRING,
        accessor: null
      },

      target: {
        name: null,
        type: Globals.DataType.STRING,
        accessor: null
      },

      links: [{
        name: null,
        type: Globals.DataType.NUMBER,
        accessor: null
      }, {
        name: null,
        type: Globals.DataType.NUMBER,
        accessor: null
      }]
    },
    color: DefaultCategoricalColor,
    plots: {
      buffMargin: 1,
      minHeight: 14,
      gap: 110
    }
  };

  var apiRender$3 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);
        state.update();
      }
    };
  };

  var calculatePosition = function calculatePosition(a, s, e, b, m) {
    var total = sum(a);

    var _sum = 0,
        neededHeight = 0,
        leftoverHeight = e - s - 2 * b * a.length;

    var ret = a.map(function (d) {
      var percent = total === 0 ? 0 : d / total;
      var height = Math.max(percent * (e - s - 2 * b * a.length), m);
      height === m ? leftoverHeight -= m : neededHeight += height;

      return {
        percent: percent,
        value: d,
        height: height
      };
    });

    var scaleFact = leftoverHeight / Math.max(neededHeight, 1);

    ret.forEach(function (d) {
      d.percent = scaleFact * d.percent;
      d.height = d.height == m ? m : d.height * scaleFact;
      d.middle = _sum + b + d.height / 2;
      d.y = s + d.middle - d.percent * (e - s - 2 * b * a.length) / 2;
      d.h = d.percent * (e - s - 2 * b * a.length);
      d.percent = total == 0 ? 0 : d.value / total;
      _sum += 2 * b + d.height;
    });
    return ret;
  };

  var partiteLayout = function partiteLayout(data, height, buffMargin, minHeight) {
    var layoutApi = {
      mainBars: null,
      subBars: [[], []],
      edges: [],
      keys: data.keys
    };

    layoutApi.mainBars = [calculatePosition(data.data[0].map(function (d) {
      return sum(d);
    }), 0, height, buffMargin, minHeight), calculatePosition(data.data[1].map(function (d) {
      return sum(d);
    }), 0, height, buffMargin, minHeight)];

    layoutApi.mainBars.forEach(function (pos, p) {
      pos.forEach(function (bar, i) {
        calculatePosition(data.data[p][i], bar.y, bar.y + bar.h, 0, 0).forEach(function (sBar, j) {
          sBar.key1 = p === 0 ? i : j;
          sBar.key2 = p === 0 ? j : i;
          layoutApi.subBars[p].push(sBar);
        });
      });
    });
    layoutApi.subBars.forEach(function (sBar) {
      sBar.sort(function (a, b) {
        return a.key1 < b.key1 ? -1 : a.key1 > b.key1 ? 1 : a.key2 < b.key2 ? -1 : a.key2 > b.key2 ? 1 : 0;
      });
    });

    layoutApi.edges = layoutApi.subBars[0].map(function (p, i) {
      return {
        key1: p.key1,
        key2: p.key2,
        y1: p.y,
        y2: layoutApi.subBars[1][i].y,
        h1: p.h,
        h2: layoutApi.subBars[1][i].h
      };
    });

    return layoutApi;
  };

  var c1 = [-80, 80];
  var c3 = [60, 220];
  var b = 20;

  var bb = function bb(_options) {
    return (_options.chart.innerWidth - 2 * (c1[1] - c1[0]) - 2 * (c3[1] - c3[0]) - 4 * b) / 2;
  };

  var drawPart = function drawPart(state, data, id, p) {
    var _svg = state._svg,
        _options = state._options,
        _color = state._color;


    _svg.select('#' + id).append('g').attr('class', 'part' + p).attr('transform', 'translate(' + (p * (bb(_options) + b) + _options.plots.gap) + ',0)');
    _svg.select('#' + id).select('.part' + p).append('g').attr('class', 'subbars').attr('x', 50);
    _svg.select('#' + id).select('.part' + p).append('g').attr('class', 'mainbars');

    var mainbar = _svg.select('#' + id).select('.part' + p).select('.mainbars').selectAll('.mainbar').data(data.mainBars[p]).enter().append('g').attr('class', 'mainbar');

    mainbar.append('rect').attr('class', 'mainrect').attr('x', 60).attr('y', function (d) {
      return d.middle - d.height / 2;
    }).attr('width', b).attr('height', function (d) {
      return d.height;
    }).style('shape-rendering', 'auto').style('fill-opacity', 0).style('stroke-width', '0.5').style('stroke', 'black').style('stroke-opacity', 0);

    if (p < 1) {
      mainbar.append('text').attr('class', 'barlabel').attr('x', c1[1] - 30).attr('y', function (d) {
        return d.middle + 5;
      }).text(function (d, i) {
        return '(' + Math.round(100 * d.percent) + '%) ' + data.keys[p][i] + ' ';
      }).attr('text-anchor', 'end');
    } else {
      mainbar.append('text').attr('class', 'barlabel').attr('x', c1[1] + 10).attr('y', function (d) {
        return d.middle + 5;
      }).text(function (d, i) {
        return ' ' + data.keys[p][i] + ' (' + Math.round(100 * d.percent) + '%)';
      }).attr('text-anchor', 'start');
    }
    /*
     mainbar.append("text").attr("class","barlabel")
     .attr("x", c1[p]).attr("y",function(d){ return d.middle+5;})
     .text(function(d,i){ return " " + data.keys[p][i] + " ("+Math.round(100*d.percent)+"%)";})
     .attr("text-anchor","start" );
      mainbar.append("text").attr("class","barvalue")
     .attr("x", c2[p]).attr("y",function(d){ return d.middle+5;})
     .text(function(d,i){ return commaFormat(round(d.value)) ;})
     .attr("text-anchor","end");
      mainbar.append("text").attr("class","barpercent")
     .attr("x", c3[p]).attr("y",function(d){ return d.middle+5;})
     .text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;})
     .attr("text-anchor","end").style("fill","grey");
     */
    _svg.select('#' + id).select('.part' + p).select('.subbars').selectAll('.subbar').data(data.subBars[p]).enter().append('rect').attr('class', 'subbar').attr('x', 60).attr('y', function (d) {
      return d.y;
    }).attr('width', b).attr('height', function (d) {
      return d.h;
    }).style('fill', function (d) {
      return _color(d.key1);
    });
  };

  var edgePolygon = function edgePolygon(bb, d) {
    return [0, d.y1, bb, d.y2, bb, d.y2 + d.h2, 0, d.y1 + d.h1].join(' ');
  };

  var drawEdges = function drawEdges(state, data, id) {
    var _svg = state._svg,
        _color = state._color,
        _options = state._options;


    _svg.select('#' + id).append('g').attr('class', 'edges').attr('transform', 'translate(' + 190 + ',0)').attr('x', 60);

    _svg.select('#' + id).select('.edges').selectAll('.edge').data(data.edges).enter().append('polygon').attr('class', 'edge').attr('points', function (d) {
      return edgePolygon(bb(_options), d);
    }).style('fill', function (d) {
      return _color(d.key1);
    }).style('opacity', 0.5).each(function (d) {
      this._current = d;
    });
  };

  var commaFormat = format(',');

  var transitionPart = function transitionPart(state, data, id, p) {
    var _svg = state._svg,
        _options = state._options;


    var mainbar = _svg.select('#' + id).select('.part' + p).select('.mainbars').selectAll('.mainbar').data(data.mainBars[p]);

    mainbar.select('.mainrect').transition().duration(_options.animation.duration.partite).attr('y', function (d) {
      return d.middle - d.height / 2;
    }).attr('height', function (d) {
      return d.height;
    });

    mainbar.select('.barlabel').transition().duration(_options.animation.duration.partite).attr('y', function (d) {
      return d.middle + 5;
    });

    mainbar.select('.barvalue').transition().duration(_options.animation.duration.partite).attr('y', function (d) {
      return d.middle + 5;
    }).text(function (d) {
      return commaFormat(Math.round(d.value));
    });

    mainbar.select('.barpercent').transition().duration(_options.animation.duration.partite).attr('y', function (d) {
      return d.middle + 5;
    }).text(function (d) {
      return '( ' + Math.round(100 * d.percent) + '%)';
    });

    _svg.select('#' + id).select('.part' + p).select('.subbars').selectAll('.subbar').data(data.subBars[p]).transition().duration(_options.animation.duration.partite).attr('y', function (d) {
      return d.y;
    }).attr('height', function (d) {
      return d.h;
    });
  };

  var transitionEdges = function transitionEdges(state, data, id) {
    var _svg = state._svg,
        _options = state._options;


    _svg.select('#' + id).append('g').attr('class', 'edges').attr('transform', 'translate(' + 190 + ',0)');

    _svg.select('#' + id).select('.edges').selectAll('.edge').data(data.edges).transition().duration(_options.animation.duration.partite).attrTween('points', function (a) {
      var i = interpolate(this._current, a);
      this._current = i(0);

      return function (t) {
        return edgePolygon(bb(_options), i(t));
      };
    }).style('opacity', function (d) {
      return d.h1 == 0 || d.h2 == 0 ? 0 : 0.5;
    });
  };

  var transitionLayout = function transitionLayout(state, data, id) {
    transitionPart(state, data, id, 0);
    transitionPart(state, data, id, 1);
    transitionEdges(state, data, id);
  };

  var deSelectSegment = function deSelectSegment(state, m, s) {
    var _data = state._data,
        _options = state._options,
        _svg = state._svg;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

      for (var _iterator = _data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        transitionLayout(state, partiteLayout(k.data, _options.chart.innerHeight, _options.plots.buffMargin, _options.plots.minHeight), k.id);

        var selectedBar = _svg.select('#' + k.id).select('.part' + m).select('.mainbars').selectAll('.mainbar').filter(function (d, i) {
          return i === s;
        });

        selectedBar.select('.mainrect').style('stroke-opacity', 0);
        selectedBar.select('.barlabel').style('font-weight', 'normal');
        selectedBar.select('.barvalue').style('font-weight', 'normal');
        selectedBar.select('.barpercent').style('font-weight', 'normal');
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
  };

  var drawHeader = function drawHeader(state, header, id) {
    var _options = state._options;


    select('#' + id).select('.part0').append('g').attr('class', 'header').append('text').text(header[2]).style('font-size', '18').attr('x', c1[1] + bb(_options) / 2).attr('y', -10).style('text-anchor', 'middle').style('font-weight', 'bold');

    [0, 1].forEach(function (d) {
      var h = select('#' + id).select('.part' + d).append('g').attr('class', 'header');

      if (d < 1) {
        h.append('text').text(header[d]).attr('x', c1[1] - 50).attr('y', -10).style('fill', 'grey').attr('text-anchor', 'end');
      } else {
        h.append('text').text(header[d]).attr('x', c1[d] + 30).attr('y', -10).style('fill', 'grey').attr('text-anchor', 'start');
      }

      h.append('line').attr('x1', c1[d]).attr('y1', -2).attr('x2', c3[d]).attr('y2', -2).style('stroke', 'black').style('stroke-width', '1').style('shape-rendering', 'crispEdges');
    });
  };

  var selectSegment = function selectSegment(state, m, s) {
    var _svg = state._svg,
        _data = state._data,
        _options = state._options;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

      for (var _iterator = _data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        var newData = { keys: [], data: [] };

        newData.keys = k.data.keys.slice();
        newData.data[m] = k.data.data[m].slice();

        newData.data[1 - m] = k.data.data[1 - m].map(function (v) {
          return v.map(function (d, i) {
            return s == i ? d : 0;
          });
        });

        transitionLayout(state, partiteLayout(newData, _options.chart.innerHeight, _options.plots.buffMargin, _options.plots.minHeight), k.id);

        var selectedBar = _svg.select('#' + k.id).select('.part' + m).select('.mainbars').selectAll('.mainbar').filter(function (d, i) {
          return i === s;
        });

        selectedBar.select('.mainrect').style('stroke-opacity', 1);
        selectedBar.select('.barlabel').style('font-weight', 'bold');
        selectedBar.select('.barvalue').style('font-weight', 'bold');
        selectedBar.select('.barpercent').style('font-weight', 'bold');
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
  };

  var apiUpdate$2 = function apiUpdate(state) {
    return {
      update: function update() {
        var _svg = state._svg,
            _data = state._data,
            _options = state._options;


        state._color = state._composers.color(_options.color, _data, _options);

        _data.forEach(function (biP, s) {
          _svg.append('g').attr('id', biP.id).attr('transform', 'translate(' + _options.chart.width / 2 * s + ',0)');

          var partite = partiteLayout(biP.data, _options.chart.innerHeight, _options.plots.buffMargin, _options.plots.minHeight);

          drawPart(state, partite, biP.id, 0);
          drawPart(state, partite, biP.id, 1);
          drawEdges(state, partite, biP.id);
          drawHeader(state, biP.header, biP.id);

          [0, 1].forEach(function (p) {
            _svg.select('#' + biP.id).select('.part' + p).select('.mainbars').selectAll('.mainbar').on('mouseover', function (d, i) {
              return selectSegment(state, p, i);
            }).on('mouseout', function (d, i) {
              return deSelectSegment(state, p, i);
            });
          });
        });
      }
    };
  };

  var apiColor$2 = function apiColor(state) {
    return {
      color: function color(colorOpt) {
        state._options.color = colorOpt;
        state.update();
        var _options = state._options,
            _color = state._color;


        var _transition = transition().duration(_options.animation.duration.change);

        _transition.selectAll('.subbar').style('fill', function (d) {
          return _color(d.key1);
        });
        _transition.selectAll('.edge').style('fill', function (d) {
          return _color(d.key1);
        });
      }
    };
  };

  var composers$1 = {
    opt: DefaultOptions$1,
    data: buildPartiteData
  };

  var index$1 = factory(svgLayer, composers$1, [apiRender$3, apiUpdate$2, apiColor$2]);

  var DefaultOptions$2 = {
    chart: {
      type: 'chord'
    },
    color: DefaultCategoricalColor,
    data: {
      source: {
        accessor: null,
        name: null,
        formatter: null
      },
      target: {
        accessor: null,
        name: null,
        formatter: null
      },

      links: [{
        accessor: null,
        name: null,
        formatter: null
      }, {
        accessor: null,
        name: null,
        formatter: null
      }]
    },
    plots: {
      drawTicks: true
    },
    ordering: {
      name: 'row', //row, column or volume
      direction: 'asc'
    }
  };

  var cos$1 = Math.cos;
  var sin$1 = Math.sin;
  var pi$3 = Math.PI;
  var halfPi$2 = pi$3 / 2;
  var tau$3 = pi$3 * 2;
  var max$2 = Math.max;

  function compareValue(compare) {
    return function (a, b) {
      return compare(a.source.value + a.target.value, b.source.value + b.target.value);
    };
  }

  function chord () {
    var padAngle = 0,
        sortGroups = null,
        sortSubgroups = null,
        sortChords = null;

    function chord(matrix) {
      var n = matrix.length,
          groupSums = [],
          groupIndex = sequence(n),
          subgroupIndex = [],
          chords = [],
          groups = chords.groups = new Array(n),
          subgroups = new Array(n * n),
          k,
          x,
          x0,
          dx,
          i,
          j;

      // Compute the sum.
      k = 0, i = -1;while (++i < n) {
        x = 0, j = -1;while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(sequence(n));
        k += x;
      }

      // Sort groups…
      if (sortGroups) groupIndex.sort(function (a, b) {
        return sortGroups(groupSums[a], groupSums[b]);
      });

      // Sort subgroups…
      if (sortSubgroups) subgroupIndex.forEach(function (d, i) {
        d.sort(function (a, b) {
          return sortSubgroups(matrix[i][a], matrix[i][b]);
        });
      });

      // Convert the sum to scaling factor for [0, 2pi].
      // TODO Allow start and end angle to be specified?
      // TODO Allow padding to be specified as percentage?
      k = max$2(0, tau$3 - padAngle * n) / k;
      dx = k ? padAngle : tau$3 / n;

      // Compute the start and end angle for each group and subgroup.
      // Note: Opera has a bug reordering object literal properties!
      x = 0, i = -1;while (++i < n) {
        x0 = x, j = -1;while (++j < n) {
          var di = groupIndex[i],
              dj = subgroupIndex[di][j],
              v = matrix[di][dj],
              a0 = x,
              a1 = x += v * k;
          subgroups[dj * n + di] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: groupSums[di]
        };
        x += dx;
      }

      // Generate chords for each (non-empty) subgroup-subgroup link.
      i = -1;while (++i < n) {
        j = i - 1;while (++j < n) {
          var source = subgroups[j * n + i],
              target = subgroups[i * n + j];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? { source: target, target: source } : { source: source, target: target });
          }
        }
      }

      return sortChords ? chords.sort(sortChords) : chords;
    }

    chord.padAngle = function (_) {
      return arguments.length ? (padAngle = max$2(0, _), chord) : padAngle;
    };

    chord.sortGroups = function (_) {
      return arguments.length ? (sortGroups = _, chord) : sortGroups;
    };

    chord.sortSubgroups = function (_) {
      return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
    };

    chord.sortChords = function (_) {
      return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
    };

    return chord;
  }

  var slice$4 = Array.prototype.slice;

  function constant$9 (x) {
    return function () {
      return x;
    };
  }

  function defaultSource(d) {
    return d.source;
  }

  function defaultTarget(d) {
    return d.target;
  }

  function defaultRadius(d) {
    return d.radius;
  }

  function defaultStartAngle(d) {
    return d.startAngle;
  }

  function defaultEndAngle(d) {
    return d.endAngle;
  }

  function ribbon () {
    var source = defaultSource,
        target = defaultTarget,
        radius = defaultRadius,
        startAngle = defaultStartAngle,
        endAngle = defaultEndAngle,
        context = null;

    function ribbon() {
      var buffer,
          argv = slice$4.call(arguments),
          s = source.apply(this, argv),
          t = target.apply(this, argv),
          sr = +radius.apply(this, (argv[0] = s, argv)),
          sa0 = startAngle.apply(this, argv) - halfPi$2,
          sa1 = endAngle.apply(this, argv) - halfPi$2,
          sx0 = sr * cos$1(sa0),
          sy0 = sr * sin$1(sa0),
          tr = +radius.apply(this, (argv[0] = t, argv)),
          ta0 = startAngle.apply(this, argv) - halfPi$2,
          ta1 = endAngle.apply(this, argv) - halfPi$2;

      if (!context) context = buffer = path();

      context.moveTo(sx0, sy0);
      context.arc(0, 0, sr, sa0, sa1);
      if (sa0 !== ta0 || sa1 !== ta1) {
        // TODO sr !== tr?
        context.quadraticCurveTo(0, 0, tr * cos$1(ta0), tr * sin$1(ta0));
        context.arc(0, 0, tr, ta0, ta1);
      }
      context.quadraticCurveTo(0, 0, sx0, sy0);
      context.closePath();

      if (buffer) return context = null, buffer + "" || null;
    }

    ribbon.radius = function (_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$9(+_), ribbon) : radius;
    };

    ribbon.startAngle = function (_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$9(+_), ribbon) : startAngle;
    };

    ribbon.endAngle = function (_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$9(+_), ribbon) : endAngle;
    };

    ribbon.source = function (_) {
      return arguments.length ? (source = _, ribbon) : source;
    };

    ribbon.target = function (_) {
      return arguments.length ? (target = _, ribbon) : target;
    };

    ribbon.context = function (_) {
      return arguments.length ? (context = _ == null ? null : _, ribbon) : context;
    };

    return ribbon;
  }

  var Matrix = function () {
    function Matrix() {
      classCallCheck(this, Matrix);

      this._id = 0;
      this._matrix = [];
      this._dataStore;

      this._matrixIndex;
      this._indexHash;

      this._chordLayout;
      this._chordData = [];
      this._layoutCache = { groups: {}, chords: {} };

      this._filter = function () {};
      this._reduce = function () {};
    }

    createClass(Matrix, [{
      key: 'update',
      value: function update() {
        var _this = this;

        var objs = [];
        var entry = {};
        this._matrix = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.groups()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var group = _step.value;

            this._layoutCache.groups[group._id] = {
              startAngle: group.startAngle,
              endAngle: group.endAngle
            };
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.chords()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var chord = _step2.value;

            this._layoutCache.chords[this.chordID(chord)] = {
              source: {
                _id: chord.source._id,
                startAngle: chord.source.startAngle,
                endAngle: chord.source.endAngle
              },
              target: {
                _id: chord.target._id,
                startAngle: chord.target.startAngle,
                endAngle: chord.target.endAngle
              }
            };
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this._matrixIndex = Object.keys(this._indexHash);

        var _loop = function _loop(i) {
          if (!_this._matrix[i]) {
            _this._matrix[i] = [];
          }

          var _loop2 = function _loop2(j) {
            objs = _this._dataStore.filter(function (obj) {
              return _this._filter(obj, _this._indexHash[_this._matrixIndex[i]], _this._indexHash[_this._matrixIndex[j]]);
            });
            entry = _this._reduce(objs, _this._indexHash[_this._matrixIndex[i]], _this._indexHash[_this._matrixIndex[j]]);
            entry.valueOf = function () {
              return +this.value;
            };
            _this._matrix[i][j] = entry;
          };

          for (var j = 0; j < _this._matrixIndex.length; j++) {
            _loop2(j);
          }
        };

        for (var i = 0; i < this._matrixIndex.length; i++) {
          _loop(i);
        }

        this._chordData = this._chordLayout(this._matrix);
        return this._chordData;
      }
    }, {
      key: 'data',
      value: function data(_data) {
        this._dataStore = _data;
        return this;
      }
    }, {
      key: 'filter',
      value: function filter(func) {
        this._filter = func;
        return this;
      }
    }, {
      key: 'reduce',
      value: function reduce(func) {
        this._reduce = func;
        return this;
      }
    }, {
      key: 'layout',
      value: function layout(d3_chordLayout) {
        this._chordLayout = d3_chordLayout;
        return this;
      }
    }, {
      key: 'groups',
      value: function groups() {
        var _this2 = this;

        return this._chordData.groups ? this._chordData.groups.map(function (group) {
          group._id = _this2._matrixIndex[group.index];
          return group;
        }) : [];
      }
    }, {
      key: 'chords',
      value: function chords() {
        var _this3 = this;

        return this._chordData ? this._chordData.map(function (chord) {
          chord._id = _this3.chordID(chord);
          chord.source._id = _this3._matrixIndex[chord.source.index];
          chord.target._id = _this3._matrixIndex[chord.target.index];
          return chord;
        }) : [];
      }
    }, {
      key: 'addKey',
      value: function addKey(key, data) {
        if (!this._indexHash[key]) {
          this._indexHash[key] = { name: key, data: data || {} };
        }
      }
    }, {
      key: 'addKeys',
      value: function addKeys(props, fun) {
        for (var i = 0; i < this._dataStore.length; i++) {
          for (var j = 0; j < props.length; j++) {
            this.addKey(this._dataStore[i][props[j]], fun ? fun(this._dataStore[i], props[j]) : {});
          }
        }
        return this;
      }
    }, {
      key: 'resetKeys',
      value: function resetKeys() {
        this._indexHash = {};
        return this;
      }
    }, {
      key: 'chordID',
      value: function chordID(d) {
        var s = this._matrixIndex[d.source.index];
        var t = this._matrixIndex[d.target.index];
        return s < t ? s + '__' + t : t + '__' + s;
      }
    }, {
      key: 'groupTween',
      value: function groupTween(d3_arc) {
        var _this4 = this;

        return function (d, i) {
          var tween = void 0;
          var cached = _this4._layoutCache.groups[d._id];

          if (cached) {
            tween = object(cached, d);
          } else {
            tween = object({
              startAngle: d.startAngle,
              endAngle: d.startAngle
            }, d);
          }

          return function (t) {
            return d3_arc(tween(t));
          };
        };
      }
    }, {
      key: 'chordTween',
      value: function chordTween(d3_path) {
        var _this5 = this;

        return function (d, i) {
          var tween = void 0,
              groups = void 0;
          var cached = _this5._layoutCache.chords[d._id];

          if (cached) {
            if (d.source._id !== cached.source._id) {
              cached = { source: cached.target, target: cached.source };
            }
            tween = object(cached, d);
          } else {
            if (_this5._layoutCache.groups) {
              groups = [];
              for (var key in _this5._layoutCache.groups) {
                cached = _this5._layoutCache.groups[key];
                if (cached._id === d.source._id || cached._id === d.target._id) {
                  groups.push(cached);
                }
              }
              if (groups.length > 0) {
                cached = { source: groups[0], target: groups[1] || groups[0] };
                if (d.source._id !== cached.source._id) {
                  cached = { source: cached.target, target: cached.source };
                }
              } else {
                cached = d;
              }
            } else {
              cached = d;
            }

            tween = object({
              source: {
                startAngle: cached.source.startAngle,
                endAngle: cached.source.startAngle
              },
              target: {
                startAngle: cached.target.startAngle,
                endAngle: cached.target.startAngle
              }
            }, d);
          }

          return function (t) {
            return d3_path(tween(t));
          };
        };
      }
    }, {
      key: 'read',
      value: function read(d) {
        var g = void 0,
            m = {};

        if (d.source) {
          m.sname = d.source._id;
          m.sdata = d.source.value;
          m.svalue = +d.source.value;
          m.stotal = this._matrix[d.source.index].reduce(function (k, n) {
            return k + n;
          }, 0);
          m.tname = d.target._id;
          m.tdata = d.target.value;
          m.tvalue = +d.target.value;
          m.ttotal = this._matrix[d.target.index].reduce(function (k, n) {
            return k + n;
          }, 0);
        } else {
          g = this._indexHash[d._id];
          m.gname = g.name;
          m.gdata = g.data;
          m.gvalue = d.value;
        }
        m.mtotal = this._matrix.reduce(function (m1, n1) {
          return m1 + n1.reduce(function (m2, n2) {
            return m2 + n2;
          }, 0);
        }, 0);
        return m;
      }
    }]);
    return Matrix;
  }();

  var resetChords = function resetChords(_svg) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    _svg.selectAll('path.chord').transition().duration(250).style('opacity', 0.9);
  };

  var dimChords = function dimChords(_svg, d) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    _svg.selectAll('path.chord').transition().duration(250).style('opacity', function (p) {
      return d.source ? p._id === d._id ? 0.9 : 0.1 : p.source._id === d._id || p.target._id === d._id ? 0.9 : 0.1;
    });
  };

  var chordMouseover = function chordMouseover(_svg, d) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    dimChords(_svg, d);
  };

  var hideTooltip = function hideTooltip(_svg) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    resetChords(_svg);
  };

  var draw$1 = function draw(state) {
    var _matrix = state._matrix,
        _data = state._data,
        _options = state._options,
        _outerRadius = state._outerRadius,
        _svg = state._svg,
        _color = state._color;

    _matrix.data(_data).resetKeys().addKeys([_options.data.source.accessor, _options.data.target.accessor]).update();

    var innerRadius = _outerRadius / 1.1;
    var _arc = arc().innerRadius(innerRadius).outerRadius(innerRadius + 20);

    var _ribbon = ribbon().radius(innerRadius);

    var gChanged = _svg.selectAll('g.group').data(_matrix.groups(), function (d) {
      return d._id;
    });

    var gEnter = gChanged.enter().append('g').attr('class', 'group');

    var gExit = gChanged.exit();

    gEnter.append('path').style('pointer-events', 'none').style('fill', function (d) {
      return _color(d._id);
    }).attr('d', _arc);

    gEnter.append('text').attr('dy', '.35em')
    // .on("click", (d)=> {this._groupClick(d)})
    .on('mouseover', function (d, i) {
      dimChords(_svg, d);
    }).on('mouseout', resetChords(_svg)).text(function (d) {
      return d._id;
    });

    _svg.selectAll('g.group').select('path').transition().duration(2000).attrTween('d', _matrix.groupTween(_arc));

    _svg.selectAll('g.group').select('text').transition().duration(2000).attr('transform', function (d) {
      d.angle = (d.startAngle + d.endAngle) / 2;
      var r = 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')';
      var t = ' translate(' + (innerRadius + 26) + ')';
      return r + t + (d.angle > Math.PI ? ' rotate(180)' : ' rotate(0)');
    }).attr('text-anchor', function (d) {
      return d.angle > Math.PI ? 'end' : 'begin';
    });

    gExit.select('text').attr('fill', 'orange');
    gExit.select('path').remove();

    gExit.transition().duration(1000).style('opacity', 0).remove();

    var chords = _svg.selectAll('path.chord').data(_matrix.chords(), function (d) {
      return d._id;
    });

    chords.enter().append('path').attr('class', 'chord').style('fill', function (d) {
      return _color(d.source._id);
    }).attr('d', _ribbon).on('mousemove', function (d) {
      chordMouseover(_svg, d);
    }).on('mouseout', function (d) {
      hideTooltip(_svg, d);
    });

    chords.transition().duration(2000).attrTween('d', _matrix.chordTween(_ribbon));

    chords.exit().remove();

    // if (_options.plots.drawTicks === true) {
    //     _drawTicks(state);
    // }
  };

  var apiRender$4 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var _options = state._options;


        state._outerRadius = Math.min(_options.chart.innerWidth, _options.chart.innerHeight) / 2;

        state._s = function (d) {
          return d[_options.data.source.accessor];
        };
        state._t = function (d) {
          return d[_options.data.target.accessor];
        };
        state._l0 = function (d) {
          return d[_options.data.links[0].accessor];
        };
        state._l1 = function (d) {
          return d[_options.data.links[1].accessor];
        };

        var _container = state._container,
            _svg = state._svg,
            _s = state._s,
            _t = state._t,
            _l0 = state._l0,
            _l1 = state._l1;


        _container.attr('preserveAspectRatio', 'xMinYMin').attr('viewBox', '0 0 ' + _options.chart.width + ' ' + _options.chart.height);
        _svg.attr('transform', 'translate(' + _options.chart.width / 2 + ',' + _options.chart.height / 2 + ')');

        var _chord = chord().padAngle(0.05).sortGroups(descending).sortSubgroups(ascending);

        state._matrix = new Matrix().layout(_chord).filter(function (item, r, c) {
          return _s(item) === r.name && _t(item) === c.name || _s(item) === c.name && _t(item) === r.name;
        }).reduce(function (items, r, c) {
          var value = void 0;
          if (!items[0]) {
            value = 0;
          } else {
            value = items.reduce(function (m, n) {
              var _val0 = _l0(n) ? _l0(n) : 0;
              var _val1 = _l1(n) ? _l1(n) : 0;

              if (r === c) {
                return m + (_val0 + _val1);
              } else {
                return m + (_s(n) === r.name ? _val0 : _val1);
              }
            }, 0);
          }
          return { value: value, data: items };
        });

        draw$1(state);
      }
    };
  };

  var apiUpdate$3 = function apiUpdate$$1(state) {
    return {
      update: function update() {
        apiUpdate(state).update();
        draw$1(state);
      }
    };
  };

  var apiColor$3 = function apiColor(state) {
    return {
      color: function color(colorOptions) {
        state._options.color = colorOptions;
        state._color = state._composers.color(colorOptions);

        var _svg = state._svg,
            _color = state._color;


        var _trans = transition().duration(1250).delay(function (d, i) {
          return i * 50;
        });

        _svg.selectAll('g.group').select('path').transition(_trans).style('fill', function (d) {
          return _color(d._id);
        });

        _svg.selectAll('path.chord').transition(_trans).style('fill', function (d) {
          return _color(d.source._id);
        });
      }
    };
  };

  var composers$2 = {
    opt: DefaultOptions$2
  };

  var index$2 = factory(svgLayer, composers$2, [apiRender$4, apiUpdate$3, apiColor$3]);

  /** Detect free variable `global` from Node.js. */
  var freeGlobal$1 = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf$1 = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$3 = freeGlobal$1 || freeSelf$1 || Function('return this')();

  /** Built-in value references. */
  var _Symbol$1 = root$3.Symbol;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$2 = objectProto$a.toString;

  /** Built-in value references. */
  var symToStringTag$2 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$9.call(value, symToStringTag$2),
        tag = value[symToStringTag$2];

    try {
      value[symToStringTag$2] = undefined;
    } catch (e) {}

    var result = nativeObjectToString$2.call(value);
    {
      if (isOwn) {
        value[symToStringTag$2] = tag;
      } else {
        delete value[symToStringTag$2];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$3 = objectProto$b.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString$1(value) {
    return nativeObjectToString$3.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag$1 = '[object Null]',
      undefinedTag$1 = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$3 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag$1(value) {
    if (value == null) {
      return value === undefined ? undefinedTag$1 : nullTag$1;
    }
    return symToStringTag$3 && symToStringTag$3 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
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
  function isObject$1(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return value != null && (type == 'object' || type == 'function');
  }

  /** `Object#toString` result references. */
  var asyncTag$1 = '[object AsyncFunction]',
      funcTag$2 = '[object Function]',
      genTag$1 = '[object GeneratorFunction]',
      proxyTag$1 = '[object Proxy]';

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
  function isFunction$1(value) {
    if (!isObject$1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag$1(value);
    return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag$1 || tag == proxyTag$1;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData$1 = root$3['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey$1 = function () {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked$1(func) {
    return !!maskSrcKey$1 && maskSrcKey$1 in func;
  }

  /** Used for built-in method references. */
  var funcProto$3 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$3 = funcProto$3.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource$1(func) {
    if (func != null) {
      try {
        return funcToString$3.call(func);
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
  var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$4 = Function.prototype,
      objectProto$c = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$4 = funcProto$4.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative$1 = RegExp('^' + funcToString$4.call(hasOwnProperty$a).replace(reRegExpChar$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative$1(value) {
    if (!isObject$1(value) || isMasked$1(value)) {
      return false;
    }
    var pattern = isFunction$1(value) ? reIsNative$1 : reIsHostCtor$1;
    return pattern.test(toSource$1(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue$1(object, key) {
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
  function getNative$1(object, key) {
    var value = getValue$1(object, key);
    return baseIsNative$1(value) ? value : undefined;
  }

  var defineProperty$2 = function () {
    try {
      var func = getNative$1(Object, 'defineProperty');
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
  function baseAssignValue$1(object, key, value) {
    if (key == '__proto__' && defineProperty$2) {
      defineProperty$2(object, key, {
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
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor$1(fromRight) {
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
  var baseFor$1 = createBaseFor$1();

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes$1(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

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
  function isObjectLike$1(value) {
    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
  }

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments$1(value) {
    return isObjectLike$1(value) && baseGetTag$1(value) == argsTag$2;
  }

  /** Used for built-in method references. */
  var objectProto$d = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$d.propertyIsEnumerable;

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
  var isArguments$1 = baseIsArguments$1(function () {
    return arguments;
  }()) ? baseIsArguments$1 : function (value) {
    return isObjectLike$1(value) && hasOwnProperty$b.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
  };

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
  var isArray$1 = Array.isArray;

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
  function stubFalse$1() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports$3 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$3 = freeExports$3 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$3 = freeModule$3 && freeModule$3.exports === freeExports$3;

  /** Built-in value references. */
  var Buffer$2 = moduleExports$3 ? root$3.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer$1 = Buffer$2 ? Buffer$2.isBuffer : undefined;

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
  var isBuffer$1 = nativeIsBuffer$1 || stubFalse$1;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$2 = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint$1 = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex$1(value, length) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    length = length == null ? MAX_SAFE_INTEGER$2 : length;

    return !!length && (type == 'number' || type != 'symbol' && reIsUint$1.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$3 = 9007199254740991;

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
  function isLength$1(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$3;
  }

  /** `Object#toString` result references. */
  var argsTag$3 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$3 = '[object Function]',
      mapTag$1 = '[object Map]',
      numberTag$1 = '[object Number]',
      objectTag$2 = '[object Object]',
      regexpTag$1 = '[object RegExp]',
      setTag$1 = '[object Set]',
      stringTag$2 = '[object String]',
      weakMapTag$1 = '[object WeakMap]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$1 = '[object DataView]',
      float32Tag$1 = '[object Float32Array]',
      float64Tag$1 = '[object Float64Array]',
      int8Tag$1 = '[object Int8Array]',
      int16Tag$1 = '[object Int16Array]',
      int32Tag$1 = '[object Int32Array]',
      uint8Tag$1 = '[object Uint8Array]',
      uint8ClampedTag$1 = '[object Uint8ClampedArray]',
      uint16Tag$1 = '[object Uint16Array]',
      uint32Tag$1 = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags$1 = {};
  typedArrayTags$1[float32Tag$1] = typedArrayTags$1[float64Tag$1] = typedArrayTags$1[int8Tag$1] = typedArrayTags$1[int16Tag$1] = typedArrayTags$1[int32Tag$1] = typedArrayTags$1[uint8Tag$1] = typedArrayTags$1[uint8ClampedTag$1] = typedArrayTags$1[uint16Tag$1] = typedArrayTags$1[uint32Tag$1] = true;
  typedArrayTags$1[argsTag$3] = typedArrayTags$1[arrayTag$1] = typedArrayTags$1[arrayBufferTag$1] = typedArrayTags$1[boolTag$1] = typedArrayTags$1[dataViewTag$1] = typedArrayTags$1[dateTag$1] = typedArrayTags$1[errorTag$1] = typedArrayTags$1[funcTag$3] = typedArrayTags$1[mapTag$1] = typedArrayTags$1[numberTag$1] = typedArrayTags$1[objectTag$2] = typedArrayTags$1[regexpTag$1] = typedArrayTags$1[setTag$1] = typedArrayTags$1[stringTag$2] = typedArrayTags$1[weakMapTag$1] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray$1(value) {
      return isObjectLike$1(value) && isLength$1(value.length) && !!typedArrayTags$1[baseGetTag$1(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary$1(func) {
    return function (value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$4 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$4 = freeExports$4 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$4 = freeModule$4 && freeModule$4.exports === freeExports$4;

  /** Detect free variable `process` from Node.js. */
  var freeProcess$1 = moduleExports$4 && freeGlobal$1.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil$1 = function () {
    try {
      return freeProcess$1 && freeProcess$1.binding && freeProcess$1.binding('util');
    } catch (e) {}
  }();

  /* Node.js helper references. */
  var nodeIsTypedArray$1 = nodeUtil$1 && nodeUtil$1.isTypedArray;

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
  var isTypedArray$1 = nodeIsTypedArray$1 ? baseUnary$1(nodeIsTypedArray$1) : baseIsTypedArray$1;

  /** Used for built-in method references. */
  var objectProto$e = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$c = objectProto$e.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys$1(value, inherited) {
    var isArr = isArray$1(value),
        isArg = !isArr && isArguments$1(value),
        isBuff = !isArr && !isArg && isBuffer$1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes$1(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$c.call(value, key)) && !(skipIndexes && (
      // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' ||
      // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') ||
      // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
      // Skip index properties.
      isIndex$1(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$f = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype$1(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$f;

    return value === proto;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg$1(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = overArg$1(Object.keys, Object);

  /** Used for built-in method references. */
  var objectProto$g = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$d = objectProto$g.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype$1(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$d.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
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
  function isArrayLike$1(value) {
    return value != null && isLength$1(value.length) && !isFunction$1(value);
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
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
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys$1(object) {
    return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys(object);
  }

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor$1(object, iteratee, keys$1);
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function (collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike$1(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * Aggregates elements of `collection` on `accumulator` with keys transformed
   * by `iteratee` and values set by `setter`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function baseAggregator(collection, setter, iteratee, accumulator) {
    baseEach(collection, function (value, key, collection) {
      setter(accumulator, value, iteratee(value), collection);
    });
    return accumulator;
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear$1() {
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
  function eq$1(value, other) {
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
  function assocIndexOf$1(array, key) {
    var length = array.length;
    while (length--) {
      if (eq$1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto$1 = Array.prototype;

  /** Built-in value references. */
  var splice$1 = arrayProto$1.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete$1(key) {
    var data = this.__data__,
        index = assocIndexOf$1(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice$1.call(data, index, 1);
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
  function listCacheGet$1(key) {
    var data = this.__data__,
        index = assocIndexOf$1(data, key);

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
  function listCacheHas$1(key) {
    return assocIndexOf$1(this.__data__, key) > -1;
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
  function listCacheSet$1(key, value) {
    var data = this.__data__,
        index = assocIndexOf$1(data, key);

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
  function ListCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache$1.prototype.clear = listCacheClear$1;
  ListCache$1.prototype['delete'] = listCacheDelete$1;
  ListCache$1.prototype.get = listCacheGet$1;
  ListCache$1.prototype.has = listCacheHas$1;
  ListCache$1.prototype.set = listCacheSet$1;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear$1() {
    this.__data__ = new ListCache$1();
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
  function stackDelete$1(key) {
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
  function stackGet$1(key) {
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
  function stackHas$1(key) {
    return this.__data__.has(key);
  }

  /* Built-in method references that are verified to be native. */
  var Map$3 = getNative$1(root$3, 'Map');

  /* Built-in method references that are verified to be native. */
  var nativeCreate$1 = getNative$1(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear$1() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
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
  function hashDelete$1(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$h = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$e = objectProto$h.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet$1(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? undefined : result;
    }
    return hasOwnProperty$e.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$i = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$f = objectProto$i.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas$1(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$f.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$3 = '__lodash_hash_undefined__';

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
  function hashSet$1(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === undefined ? HASH_UNDEFINED$3 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash$1.prototype.clear = hashClear$1;
  Hash$1.prototype['delete'] = hashDelete$1;
  Hash$1.prototype.get = hashGet$1;
  Hash$1.prototype.has = hashHas$1;
  Hash$1.prototype.set = hashSet$1;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear$1() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash$1(),
      'map': new (Map$3 || ListCache$1)(),
      'string': new Hash$1()
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable$1(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
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
  function getMapData$1(map, key) {
    var data = map.__data__;
    return isKeyable$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
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
  function mapCacheDelete$1(key) {
    var result = getMapData$1(this, key)['delete'](key);
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
  function mapCacheGet$1(key) {
    return getMapData$1(this, key).get(key);
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
  function mapCacheHas$1(key) {
    return getMapData$1(this, key).has(key);
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
  function mapCacheSet$1(key, value) {
    var data = getMapData$1(this, key),
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
  function MapCache$1(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache$1.prototype.clear = mapCacheClear$1;
  MapCache$1.prototype['delete'] = mapCacheDelete$1;
  MapCache$1.prototype.get = mapCacheGet$1;
  MapCache$1.prototype.has = mapCacheHas$1;
  MapCache$1.prototype.set = mapCacheSet$1;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE$1 = 200;

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
  function stackSet$1(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache$1) {
      var pairs = data.__data__;
      if (!Map$3 || pairs.length < LARGE_ARRAY_SIZE$1 - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache$1(pairs);
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
  function Stack$1(entries) {
    var data = this.__data__ = new ListCache$1(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack$1.prototype.clear = stackClear$1;
  Stack$1.prototype['delete'] = stackDelete$1;
  Stack$1.prototype.get = stackGet$1;
  Stack$1.prototype.has = stackHas$1;
  Stack$1.prototype.set = stackSet$1;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$4 = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$4);
    return this;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache$1();
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!arraySome(other, function (othValue, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  /** Built-in value references. */
  var Uint8Array$2 = root$3.Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag$2 = '[object Boolean]',
      dateTag$2 = '[object Date]',
      errorTag$2 = '[object Error]',
      mapTag$2 = '[object Map]',
      numberTag$2 = '[object Number]',
      regexpTag$2 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$3 = '[object String]',
      symbolTag = '[object Symbol]';

  var arrayBufferTag$2 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol$1 ? _Symbol$1.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$2:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$2:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$2(object), new Uint8Array$2(other))) {
          return false;
        }
        return true;

      case boolTag$2:
      case dateTag$2:
      case numberTag$2:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq$1(+object, +other);

      case errorTag$2:
        return object.name == other.name && object.message == other.message;

      case regexpTag$2:
      case stringTag$3:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == other + '';

      case mapTag$2:
        var convert = mapToArray;

      case setTag$2:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /** Used for built-in method references. */
  var objectProto$j = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$2 = objectProto$j.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function (symbol) {
      return propertyIsEnumerable$2.call(object, symbol);
    });
  };

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys$1, getSymbols);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$k = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$g = objectProto$k.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$g.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  /* Built-in method references that are verified to be native. */
  var DataView = getNative$1(root$3, 'DataView');

  /* Built-in method references that are verified to be native. */
  var Promise$1 = getNative$1(root$3, 'Promise');

  /* Built-in method references that are verified to be native. */
  var Set$1 = getNative$1(root$3, 'Set');

  /* Built-in method references that are verified to be native. */
  var WeakMap = getNative$1(root$3, 'WeakMap');

  /** `Object#toString` result references. */
  var mapTag$3 = '[object Map]',
      objectTag$3 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$3 = '[object Set]',
      weakMapTag$2 = '[object WeakMap]';

  var dataViewTag$3 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource$1(DataView),
      mapCtorString = toSource$1(Map$3),
      promiseCtorString = toSource$1(Promise$1),
      setCtorString = toSource$1(Set$1),
      weakMapCtorString = toSource$1(WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag$1;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$3 && getTag(new Map$3()) != mapTag$3 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$3 || WeakMap && getTag(new WeakMap()) != weakMapTag$2) {
      getTag = function getTag(value) {
          var result = baseGetTag$1(value),
              Ctor = result == objectTag$3 ? value.constructor : undefined,
              ctorString = Ctor ? toSource$1(Ctor) : '';

          if (ctorString) {
              switch (ctorString) {
                  case dataViewCtorString:
                      return dataViewTag$3;
                  case mapCtorString:
                      return mapTag$3;
                  case promiseCtorString:
                      return promiseTag;
                  case setCtorString:
                      return setTag$3;
                  case weakMapCtorString:
                      return weakMapTag$2;
              }
          }
          return result;
      };
  }

  var getTag$1 = getTag;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$4 = '[object Arguments]',
      arrayTag$2 = '[object Array]',
      objectTag$4 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$l = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$h = objectProto$l.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray$1(object),
        othIsArr = isArray$1(other),
        objTag = objIsArr ? arrayTag$2 : getTag$1(object),
        othTag = othIsArr ? arrayTag$2 : getTag$1(other);

    objTag = objTag == argsTag$4 ? objectTag$4 : objTag;
    othTag = othTag == argsTag$4 ? objectTag$4 : othTag;

    var objIsObj = objTag == objectTag$4,
        othIsObj = othTag == objectTag$4,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer$1(object)) {
      if (!isBuffer$1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack$1());
      return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$h.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$h.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new Stack$1());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack$1());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike$1(value) && !isObjectLike$1(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
      COMPARE_UNORDERED_FLAG$2 = 2;

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack$1();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject$1(value);
  }

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys$1(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function (object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
    };
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function (object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike$1(value) && baseGetTag$1(value) == symbolTag$1;
  }

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray$1(value)) {
      return false;
    }
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function memoized() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache$1)();
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache$1;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function (key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function (string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
    string.replace(rePropName, function (match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
    });
    return result;
  });

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = _Symbol$1 ? _Symbol$1.prototype : undefined,
      symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray$1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString$1(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray$1(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString$1(value));
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : undefined;
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get$3(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength$1(length) && isIndex$1(key, length) && (isArray$1(object) || isArguments$1(object));
  }

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
      COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function (object) {
      var objValue = get$3(object, path);
      return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
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
  function identity$7(value) {
    return value;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function (object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function (object) {
      return baseGet(object, path);
    };
  }

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity$7;
    }
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
      return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }

  /**
   * Creates a function like `_.groupBy`.
   *
   * @private
   * @param {Function} setter The function to set accumulator values.
   * @param {Function} [initializer] The accumulator object initializer.
   * @returns {Function} Returns the new aggregator function.
   */
  function createAggregator(setter, initializer) {
    return function (collection, iteratee) {
      var func = isArray$1(collection) ? arrayAggregator : baseAggregator,
          accumulator = initializer ? initializer() : {};

      return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
    };
  }

  /** Used for built-in method references. */
  var objectProto$m = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$i = objectProto$m.hasOwnProperty;

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` thru `iteratee`. The order of grouped values
   * is determined by the order they occur in `collection`. The corresponding
   * value of each key is an array of elements responsible for generating the
   * key. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * _.groupBy([6.1, 4.2, 6.3], Math.floor);
   * // => { '4': [4.2], '6': [6.1, 6.3] }
   *
   * // The `_.property` iteratee shorthand.
   * _.groupBy(['one', 'two', 'three'], 'length');
   * // => { '3': ['one', 'two'], '5': ['three'] }
   */
  var groupBy = createAggregator(function (result, value, key) {
    if (hasOwnProperty$i.call(result, key)) {
      result[key].push(value);
    } else {
      baseAssignValue$1(result, key, [value]);
    }
  });

  var transformMatrix = function transformMatrix(_data, _opt) {
    var _sourceAccessor = _opt.data.source.accessor;
    var _targetAccessor = _opt.data.target.accessor;
    var _linkAccessor = _opt.data.link.accessor;
    var emptyPerc = _opt.plots.emptyPercent;
    var chartData = _data.slice();

    var sourceGroup = groupBy(chartData, _sourceAccessor);
    var targetGroup = groupBy(chartData, _targetAccessor);

    var sourceLabels = keys$1(sourceGroup);
    var targetLabels = keys$1(targetGroup);

    var rowLabels = sourceLabels.concat(targetLabels);
    var sourceDivide = sourceLabels.length;

    var rowLength = rowLabels.length;

    var matrix = [];
    var respondents = 0;

    for (var i = 0; i <= rowLength + 1; i++) {
      matrix[i] = [];
      for (var j = 0; j <= rowLength + 1; j++) {
        matrix[i][j] = 0;
      }
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = sourceLabels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sourceLabel = _step.value;

        var group = sourceGroup[sourceLabel];

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = group[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var gItem = _step3.value;

            var sourceIndex = sourceLabels.indexOf('' + gItem[_sourceAccessor]);
            var targetIndex = targetLabels.indexOf('' + gItem[_targetAccessor]);

            matrix[sourceIndex][targetIndex + 1 + sourceDivide] = +gItem[_linkAccessor];
            respondents = respondents + +gItem[_linkAccessor];
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = targetLabels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var targetLabel = _step2.value;

        var _group = targetGroup[targetLabel];

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = _group[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _gItem = _step4.value;

            var _sourceIndex = sourceLabels.indexOf('' + _gItem[_sourceAccessor]);
            var _targetIndex = targetLabels.indexOf('' + _gItem[_targetAccessor]);

            matrix[_targetIndex + 1 + sourceDivide][_sourceIndex] = +_gItem[_linkAccessor];

            respondents = respondents + +_gItem[_linkAccessor];
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    for (var _i = 0; _i < sourceDivide; _i++) {
      for (var _j = sourceDivide + 1; _j < rowLabels.length + 1; _j++) {
        if (matrix[_i][_j] === 0) {
          matrix[_i][_j] = 1;

          respondents = respondents + 1;
        }
      }
    }

    for (var _i2 = sourceDivide + 1; _i2 < rowLabels.length + 1; _i2++) {
      for (var _j2 = 0; _j2 < sourceDivide; _j2++) {
        if (matrix[_i2][_j2] === 0) {
          matrix[_i2][_j2] = 1;

          respondents = respondents + 1;
        }
      }
    }

    var emptyStroke = Math.round(respondents * emptyPerc);

    matrix[sourceDivide][rowLength + 1] = emptyStroke;
    matrix[rowLength + 1][sourceDivide] = emptyStroke;

    var offset = 2 * Math.PI * (emptyStroke / (respondents + emptyStroke)) / 4;

    return {
      rowLabel: sourceLabels.concat('').concat(targetLabels).concat(''),
      matrix: matrix,
      offset: offset
    };
  };

  var CustomChordLayout = function CustomChordLayout() {
    var π = Math.PI,
        τ = 2 * π;
    var chord = {},
        chords = void 0,
        groups = void 0,
        matrix = void 0,
        n = void 0,
        padding = 0,
        sortGroups = void 0,
        sortSubgroups = void 0,
        sortChords = void 0;

    function relayout() {
      var subgroups = {},
          groupSums = [],
          groupIndex = sequence(n),
          subgroupIndex = [],
          k = void 0,
          x = void 0,
          x0 = void 0,
          i = void 0,
          j = void 0;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(sequence(n).reverse());
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function (a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function (d, i) {
          d.sort(function (a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        var di = 0;
        while (++j < n) {
          di = groupIndex[i];
          var dj = subgroupIndex[di][j],
              v = matrix[di][dj],
              a0 = x,
              a1 = x += v * k;
          subgroups[di + '-' + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: (x - x0) / k
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + '-' + j],
              target = subgroups[j + '-' + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function (a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function (x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function (x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function (x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function (x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function (x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function () {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function () {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };

  var StretchedChordLayout = function StretchedChordLayout() {
    var source = d3_source,
        target = d3_target,
        radius = d3_svg_chordRadius,
        startAngle = d3_svg_arcStartAngle,
        endAngle = d3_svg_arcEndAngle,
        pullOutSize = 0;

    var π = Math.PI,
        halfπ = π / 2;

    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i),
          r = radius.call(self, subgroup, i),
          a0 = startAngle.call(self, subgroup, i) - halfπ,
          a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: [a0],
        a1: [a1],
        p0: [r * Math.cos(a0), r * Math.sin(a0)],
        p1: [r * Math.cos(a1), r * Math.sin(a1)]
      };
    }

    function arc(r, p, a) {
      var sign = p[0] >= 0 ? 1 : -1;
      return 'A' + r + ',' + r + ' 0 ' + +(a > π) + ',1 ' + (p[0] + sign * pullOutSize) + ',' + p[1];
    }

    function curve(p1) {
      var sign = p1[0] >= 0 ? 1 : -1;
      return 'Q 0,0 ' + (p1[0] + sign * pullOutSize) + ',' + p1[1];
    }

    /*
       M = moveto
       M x,y
       Q = quadratic Bézier curve
       Q control-point-x,control-point-y end-point-x, end-point-y
       A = elliptical Arc
       A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
       Z = closepath
        M251.5579641956022,87.98204731514328
       A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
       Q 0,0 -177.8355222451483,198.48621369706098
       A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
       Q 0,0 251.5579641956022,87.98204731514328
       Z
       */
    function chord(d, i) {
      var s = subgroup(this, source, d, i),
          t = subgroup(this, target, d, i);

      return 'M' + (s.p0[0] + pullOutSize) + ',' + s.p0[1] + arc(s.r, s.p1, s.a1 - s.a0) + curve(t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(s.p0) + 'Z';
    } //chord

    chord.radius = function (v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.pullOutSize = function (v) {
      if (!arguments.length) return pullOutSize;
      pullOutSize = v;
      return chord;
    };
    chord.source = function (v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function (v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function (v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function (v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };

    function d3_svg_chordRadius(d) {
      return d.radius;
    }

    function d3_source(d) {
      return d.source;
    }

    function d3_target(d) {
      return d.target;
    }

    function d3_svg_arcStartAngle(d) {
      return d.startAngle;
    }

    function d3_svg_arcEndAngle(d) {
      return d.endAngle;
    }

    function d3_functor(v) {
      return typeof v === 'function' ? v : function () {
        return v;
      };
    }

    return chord;
  };

  var apiRender$5 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var _options = state._options,
            _data = state._data,
            _svg = state._svg,
            _isMobileSize = state._isMobileSize;


        var outerRadius = Math.min(_options.chart.innerWidth, _options.chart.innerHeight) / 2 - (_isMobileSize ? 80 : 100);
        var innerRadius = outerRadius * _options.plots.innerRadiusRatio;
        var opacityDefault = _options.plots.opacityDefault;
        var opacityLow = _options.plots.opacityLow;
        var pullOutSize = _options.plots.pullOutSize;

        //////////////////////////////////////////////////////
        //////////////////// Titles on top ///////////////////
        //////////////////////////////////////////////////////
        var wrapper = _svg.append('g').attr('class', 'chordWrapper').attr('transform', 'translate(' + _options.chart.width / 2 + ',' + _options.chart.height / 2 + ')');

        var titleWrapper = _svg.append('g').attr('class', 'title-rapper');
        var titleOffset = _isMobileSize ? 15 : 40;
        var titleSeparate = _isMobileSize ? 30 : 0;

        var width = _options.chart.innerWidth;

        //Title	top left
        titleWrapper.append('text').attr('class', 'title left').style('font-size', _options.plots.fontSize).attr('x', width / 2 + _options.chart.margin.left - outerRadius - titleSeparate).attr('y', titleOffset).text(_options.data.source.name);
        titleWrapper.append('line').attr('class', 'titleLine left').attr('x1', (width / 2 + _options.chart.margin.left - outerRadius - titleSeparate) * 0.6).attr('x2', (width / 2 + _options.chart.margin.left - outerRadius - titleSeparate) * 1.4).attr('y1', titleOffset + 8).attr('y2', titleOffset + 8);
        //Title top right
        titleWrapper.append('text').attr('class', 'title right').style('font-size', _options.plots.fontSize).attr('x', width / 2 + _options.chart.margin.left + outerRadius + titleSeparate).attr('y', titleOffset).text(_options.data.target.name);
        titleWrapper.append('line').attr('class', 'titleLine right').attr('x1', (width / 2 + _options.chart.margin.left - outerRadius - titleSeparate) * 0.6 + 2 * (outerRadius + titleSeparate)).attr('x2', (width / 2 + _options.chart.margin.left - outerRadius - titleSeparate) * 1.4 + 2 * (outerRadius + titleSeparate)).attr('y1', titleOffset + 8).attr('y2', titleOffset + 8);

        ////////////////////////////////////////////////////////////
        /////////////////// Animated gradient //////////////////////
        ////////////////////////////////////////////////////////////

        var defs = wrapper.append('defs');
        var linearGradient = defs.append('linearGradient').attr('id', 'animatedGradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0').attr('spreadMethod', 'reflect');

        linearGradient.append('animate').attr('attributeName', 'x1').attr('values', '0%;100%')
        //	.attr("from","0%")
        //	.attr("to","100%")
        .attr('dur', '7s').attr('repeatCount', 'indefinite');

        linearGradient.append('animate').attr('attributeName', 'x2').attr('values', '100%;200%')
        //	.attr("from","100%")
        //	.attr("to","200%")
        .attr('dur', '7s').attr('repeatCount', 'indefinite');

        linearGradient.append('stop').attr('offset', '5%').attr('stop-color', '#E8E8E8');
        linearGradient.append('stop').attr('offset', '45%').attr('stop-color', '#A3A3A3');
        linearGradient.append('stop').attr('offset', '55%').attr('stop-color', '#A3A3A3');
        linearGradient.append('stop').attr('offset', '95%').attr('stop-color', '#E8E8E8');

        ////////////////////////////////////////////////////////////
        ////////////////////////// Data ////////////////////////////
        ////////////////////////////////////////////////////////////

        var chordData = transformMatrix(_data, _options);

        //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
        //invisible chord center vertically
        var rowLabel = chordData.rowLabel,
            matrix = chordData.matrix,
            offset = chordData.offset;


        var startAngle = function startAngle(d) {
          return d.startAngle + offset;
        };
        var endAngle = function endAngle(d) {
          return d.endAngle + offset;
        };

        // Returns an event handler for fading a given chord group
        var fade = function fade(opacity) {
          return function (d, i) {
            wrapper.selectAll('path.chord').filter(function (d) {
              return d.source.index !== i && d.target.index !== i && rowLabel[d.source.index] !== '';
            }).transition('fadeOnArc').style('opacity', opacity);
          };
        };

        // Fade function when hovering over chord
        var fadeOnChord = function fadeOnChord(d) {
          wrapper.selectAll('path.chord').transition('fadeOnChord').style('opacity', function (e) {
            return e.source.index === d.source.index && e.target.index === d.target.index ? opacityDefault : opacityLow;
          });
        };

        //Custom sort function of the chords to keep them in the original order
        var _chordLayout = CustomChordLayout() //d3.chord()
        .padding(_options.plots.chordPadding).sortChords(descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
        .matrix(matrix);

        var _arc = arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
        .endAngle(endAngle);

        var _chordPath = StretchedChordLayout() //Call the stretched chord function
        .radius(innerRadius).startAngle(startAngle).endAngle(endAngle).pullOutSize(pullOutSize);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw outer Arcs ///////////////////////
        ////////////////////////////////////////////////////////////

        var g = wrapper.selectAll('g.group').data(_chordLayout.groups).enter().append('g').attr('class', 'group').on('mouseover', fade(opacityLow)).on('mouseout', fade(opacityDefault));

        g.append('path').style('stroke', function (d, i) {
          return rowLabel[i] === '' ? 'none' : '#00A1DE';
        }).style('fill', function (d, i) {
          return rowLabel[i] === '' ? 'none' : '#00A1DE';
        }).style('pointer-events', function (d, i) {
          return rowLabel[i] === '' ? 'none' : 'auto';
        }).attr('d', _arc).attr('transform', function (d, i) {
          //Pull the two slices apart
          d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
          return 'translate(' + d.pullOutSize + ',' + 0 + ')';
        });

        ////////////////////////////////////////////////////////////
        ////////////////////// Append rowLabel ////////////////////////
        ////////////////////////////////////////////////////////////

        //The text also needs to be displaced in the horizontal directions
        //And also rotated with the offset in the clockwise direction
        g.append('text').each(function (d) {
          return d.angle = (d.startAngle + d.endAngle) / 2 + offset;
        }).attr('dy', '.35em').attr('class', 'titles').style('font-size', _isMobileSize ? '8px' : '10px').attr('text-anchor', function (d) {
          return d.angle > Math.PI ? 'end' : null;
        }).attr('transform', function (d, i) {
          var c = _arc.centroid(d);
          return 'translate(' + (c[0] + d.pullOutSize) + ',' + c[1] + ')' + 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + 20 + ',0)' + (d.angle > Math.PI ? 'rotate(180)' : '');
        }).text(function (d, i) {
          return rowLabel[i];
        }).call(wrapSVGText, 100);

        ////////////////////////////////////////////////////////////
        //////////////////// Draw inner chords /////////////////////
        ////////////////////////////////////////////////////////////

        wrapper.selectAll('path.chord').data(_chordLayout.chords).enter().append('path').attr('class', 'chord').style('stroke', 'none')
        //.style("fill", "#C4C4C4")
        .style('fill', 'url(#animatedGradient)') //An SVG Gradient to give the impression of a flow from left to right
        .style('opacity', function (d) {
          return rowLabel[d.source.index] === '' ? 0 : opacityDefault;
        }) //Make the dummy strokes have a zero opacity (invisible)
        .style('pointer-events', function (d, i) {
          return rowLabel[d.source.index] === '' ? 'none' : 'auto';
        }) //Remove pointer events from dummy strokes
        .attr('d', _chordPath).on('mouseover', fadeOnChord).on('mouseout', fade(opacityDefault));
      }
    };
  };

  var DefaultOpt = {
    chart: {
      type: 'stretched-chord'
    },
    data: {
      source: {
        accessor: null,
        name: null,
        formatter: null
      },
      target: {
        accessor: null,
        name: null,
        formatter: null
      },

      link: {
        accessor: null,
        name: null,
        formatter: null
      }
    },
    color: DefaultCategoricalColor,
    plots: {
      innerRadiusRatio: 0.95,
      opacityDefault: 0.7, //default opacity of chords
      opacityLow: 0.02, //hover opacity of those chords not hovered over
      pullOutSize: 150, //How many pixels should the two halves be pulled apart
      fontSize: '16px',
      emptyPercent: 0.01, //What % of the circle should become empty
      chordPadding: 0.02
    }
  };

  var composers$3 = {
    opt: DefaultOpt
  };

  var index$3 = factory(svgLayer, composers$3, [apiRender$5]);

  var CircularSankey = function CircularSankey() {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [],
        sinksRight = true;

    sankey.nodeWidth = function (_) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = +_;
      return sankey;
    };

    sankey.nodePadding = function (_) {
      if (!arguments.length) return nodePadding;
      nodePadding = +_;
      return sankey;
    };

    sankey.nodes = function (_) {
      if (!arguments.length) return nodes;
      nodes = _;
      return sankey;
    };

    sankey.links = function (_) {
      if (!arguments.length) return links;
      links = _;
      return sankey;
    };

    sankey.size = function (_) {
      if (!arguments.length) return size;
      size = _;
      return sankey;
    };

    sankey.sinksRight = function (_) {
      if (!arguments.length) return sinksRight;
      sinksRight = _;
      return sankey;
    };

    sankey.layout = function (iterations) {
      computeNodeLinks();
      computeNodeValues();
      computeNodeBreadths();
      computeNodeDepths(iterations);
      return sankey;
    };

    sankey.relayout = function () {
      computeLinkDepths();
      return sankey;
    };

    // SVG path data generator, to be used as "d" attribute on "path" element selection.
    sankey.link = function () {
      var curvature = 0.5;

      function link(d) {
        var xs = d.source.x + d.source.dx,
            xt = d.target.x,
            xi = reinterpolate(xs, xt),
            xsc = xi(curvature),
            xtc = xi(1 - curvature),
            ys = d.source.y + d.sy + d.dy / 2,
            yt = d.target.y + d.ty + d.dy / 2;

        if (!d.cycleBreaker) {
          return 'M' + xs + ',' + ys + 'C' + xsc + ',' + ys + ' ' + xtc + ',' + yt + ' ' + xt + ',' + yt;
        } else {
          var xdelta = 1.5 * d.dy + 0.05 * Math.abs(xs - xt);
          xsc = xs + xdelta;
          xtc = xt - xdelta;
          var xm = xi(0.5);
          var ym = reinterpolate(ys, yt)(0.5);
          var ydelta = (2 * d.dy + 0.1 * Math.abs(xs - xt) + 0.1 * Math.abs(ys - yt)) * (ym < size[1] / 2 ? -1 : 1);
          return 'M' + xs + ',' + ys + 'C' + xsc + ',' + ys + ' ' + xsc + ',' + (ys + ydelta) + ' ' + xm + ',' + (ym + ydelta) + 'S' + xtc + ',' + yt + ' ' + xt + ',' + yt;
        }
      }

      link.curvature = function (_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      nodes.forEach(function (node) {
        // Links that have this node as source.
        node.sourceLinks = [];
        // Links that have this node as target.
        node.targetLinks = [];
      });
      links.forEach(function (link) {
        var source = link.source,
            target = link.target;
        if (typeof source === 'number') source = link.source = nodes[link.source];
        if (typeof target === 'number') target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function (node) {
        node.value = Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value));
      });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      var remainingNodes = nodes,
          nextNodes = void 0,
          x = 0;

      // Work from left to right.
      // Keep updating the breath (x-position) of nodes that are target of recently updated nodes.
      while (remainingNodes.length && x < nodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function (node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(function (link) {
            if (nextNodes.indexOf(link.target) < 0 && !link.cycleBreaker) {
              nextNodes.push(link.target);
            }
          });
        });
        if (nextNodes.length == remainingNodes.length) {
          // There must be a cycle here. Let's search for a link that breaks it.
          findAndMarkCycleBreaker(nextNodes);
          // Start over.
          // TODO: make this optional?
          return computeNodeBreadths();
        } else {
          remainingNodes = nextNodes;
          ++x;
        }
      }

      // Optionally move pure sinks always to the right.
      if (sinksRight) {
        moveSinksRight(x);
      }

      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    // Find a link that breaks a cycle in the graph (if any).
    function findAndMarkCycleBreaker(nodes) {
      // Go through all nodes from the given subset and traverse links searching for cycles.
      var link = void 0;
      for (var n = nodes.length - 1; n >= 0; n--) {
        link = depthFirstCycleSearch(nodes[n], []);
        if (link) {
          return link;
        }
      }

      // Depth-first search to find a link that is part of a cycle.
      function depthFirstCycleSearch(cursorNode, path) {
        var target = void 0,
            link = void 0;
        for (var _n = cursorNode.sourceLinks.length - 1; _n >= 0; _n--) {
          link = cursorNode.sourceLinks[_n];
          if (link.cycleBreaker) {
            // Skip already known cycle breakers.
            continue;
          }

          // Check if target of link makes a cycle in current path.
          target = link.target;
          for (var l = 0; l < path.length; l++) {
            if (path[l].source == target) {
              // We found a cycle. Search for weakest link in cycle
              var weakest = link;
              for (; l < path.length; l++) {
                if (path[l].value < weakest.value) {
                  weakest = path[l];
                }
              }
              // Mark weakest link as (known) cycle breaker and abort search.
              weakest.cycleBreaker = true;
              return weakest;
            }
          }

          // Recurse deeper.
          path.push(link);
          link = depthFirstCycleSearch(target, path);
          path.pop();
          // Stop further search if we found a cycle breaker.
          if (link) {
            return link;
          }
        }
      }
    }

    function moveSinksRight(x) {
      nodes.forEach(function (node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function scaleNodeBreadths(kx) {
      nodes.forEach(function (node) {
        node.x *= kx;
      });
    }

    // Compute the depth (y-position) for each node.
    function computeNodeDepths(iterations) {
      // Group nodes by breath.
      var nodesByBreadth = nest().key(function (d) {
        return d.x;
      }).sortKeys(ascending).entries(nodes).map(function (d) {
        return d.values;
      });

      //
      initializeNodeDepth();
      resolveCollisions();
      computeLinkDepths();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= 0.99);
        resolveCollisions();
        computeLinkDepths();
        relaxLeftToRight(alpha);
        resolveCollisions();
        computeLinkDepths();
      }

      function initializeNodeDepth() {
        // Calculate vertical scaling factor.
        var ky = min(nodesByBreadth, function (nodes) {
          return (size[1] - (nodes.length - 1) * nodePadding) / sum(nodes, value);
        });

        nodesByBreadth.forEach(function (nodes) {
          nodes.forEach(function (node, i) {
            node.y = i;
            node.dy = node.value * ky;
          });
        });

        links.forEach(function (link) {
          link.dy = link.value * ky;
        });
      }

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function (nodes, breadth) {
          nodes.forEach(function (node) {
            if (node.targetLinks.length) {
              // Value-weighted average of the y-position of source node centers linked to this node.
              var y = sum(node.targetLinks, weightedSource) / sum(node.targetLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return (link.source.y + link.sy + link.dy / 2) * link.value;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function (nodes) {
          nodes.forEach(function (node) {
            if (node.sourceLinks.length) {
              // Value-weighted average of the y-positions of target nodes linked to this node.
              var y = sum(node.sourceLinks, weightedTarget) / sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedTarget(link) {
          return (link.target.y + link.ty + link.dy / 2) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function (nodes) {
          var node = void 0,
              dy = void 0,
              y0 = 0,
              n = nodes.length,
              i = void 0;

          // Push any overlapping nodes down.
          nodes.sort(ascendingDepth);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = node.y + node.dy + nodePadding;
          }

          // If the bottommost node goes outside the bounds, push it back up.
          dy = y0 - nodePadding - size[1];
          if (dy > 0) {
            y0 = node.y -= dy;

            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.y + node.dy + nodePadding - y0;
              if (dy > 0) node.y -= dy;
              y0 = node.y;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        return a.y - b.y;
      }
    }

    // Compute y-offset of the source endpoint (sy) and target endpoints (ty) of links,
    // relative to the source/target node's y-position.
    function computeLinkDepths() {
      nodes.forEach(function (node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function (node) {
        var sy = 0,
            ty = 0;
        node.sourceLinks.forEach(function (link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function (link) {
          link.ty = ty;
          ty += link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    // Y-position of the middle of a node.
    function center(node) {
      return node.y + node.dy / 2;
    }

    // Value property accessor.
    function value(x) {
      return x.value;
    }

    return sankey;
  };

  var VerticalSankey = function VerticalSankey() {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        // was 8, needs to be much bigger. these numbers are actually overwritten in the html when we instantiate the viz!
    size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = +_;
      return sankey;
    };

    sankey.nodePadding = function (_) {
      if (!arguments.length) return nodePadding;
      nodePadding = +_;
      return sankey;
    };

    sankey.nodes = function (_) {
      if (!arguments.length) return nodes;
      nodes = _;
      return sankey;
    };

    sankey.links = function (_) {
      if (!arguments.length) return links;
      links = _;
      return sankey;
    };

    sankey.size = function (_) {
      if (!arguments.length) return size;
      size = _;
      return sankey;
    };

    sankey.layout = function (iterations) {
      computeNodeLinks();
      computeNodeValues();

      // big changes here
      // change the order and depths (y pos) won't need iterations
      computeNodeDepths();
      computeNodeBreadths(iterations);

      computeLinkDepths();
      return sankey;
    };

    sankey.relayout = function () {
      computeLinkDepths();
      return sankey;
    };

    sankey.link = function () {
      var curvature = 0.5;

      // x0 = line start X
      // y0 = line start Y

      // x1 = line end X
      // y1 = line end Y

      // y2 = control point 1 (Y pos)
      // y3 = control point 2 (Y pos)

      function link(d) {
        // big changes here obviously, more comments to follow
        var x0 = d.source.x + d.sy + d.dy / 2,
            x1 = d.target.x + d.ty + d.dy / 2,
            y0 = d.source.y + nodeWidth,
            y1 = d.target.y,
            yi = reinterpolate(y0, y1),
            y2 = yi(curvature),
            y3 = yi(1 - curvature);

        // ToDo - nice to have - allow flow up or down! Plenty of use cases for starting at the bottom,
        // but main one is trickle down (economics, budgets etc), not up

        return 'M' + x0 + ',' + y0 + // start (of SVG path)
        'C' + x0 + ',' + y2 + // CP1 (curve control point)
        ' ' + x1 + ',' + y3 + // CP2
        ' ' + x1 + ',' + y1; // end
      }

      link.curvature = function (_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      nodes.forEach(function (node) {
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function (link) {
        var source = link.source,
            target = link.target;
        if (typeof source === 'number') source = link.source = nodes[link.source];
        if (typeof target === 'number') target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function (node) {
        node.value = Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value));
      });
    }

    // take a grouping of the nodes - the vertical columns
    // there shouldnt be 8 - there will be more, the total number of 1st level sources
    // then iterate over them and give them an incrementing x
    // because the data structure is ALL nodes, just flattened, don't just apply at the top level
    // then everything should have an X
    // THEN, for the Y
    // do the same thing, this time on the grouping of 8! i.e. 8 different Y values, not loads of different ones!
    function computeNodeBreadths(iterations) {
      var nodesByBreadth = nest().key(function (d) {
        return d.y;
      }).sortKeys(ascending).entries(nodes).map(function (d) {
        return d.values;
      }); // values! we are using the values also as a way to seperate nodes (not just stroke width)?

      // this bit is actually the node sizes (widths)
      //let ky = (size[1] - (nodes.length - 1) * nodePadding) / sum(nodes, value)
      // this should be only source nodes surely (level 1)
      var ky = (size[0] - (nodesByBreadth[0].length - 1) * nodePadding) / sum(nodesByBreadth[0], value);
      // I'd like them to be much bigger, this calc doesn't seem to fill the space!?

      nodesByBreadth.forEach(function (nodes) {
        nodes.forEach(function (node, i) {
          node.x = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach(function (link) {
        link.dy = link.value * ky;
      });

      resolveCollisions();

      for (var alpha = 1; iterations > 0; --iterations) {
        relaxLeftToRight(alpha);
        resolveCollisions();

        relaxRightToLeft(alpha *= 0.99);
        resolveCollisions();
      }

      // these relax methods should probably be operating on one level of the nodes, not all!?

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function (nodes, breadth) {
          nodes.forEach(function (node) {
            if (node.targetLinks.length) {
              var y = sum(node.targetLinks, weightedSource) / sum(node.targetLinks, value);
              node.x += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return center(link.source) * link.value;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function (nodes) {
          nodes.forEach(function (node) {
            if (node.sourceLinks.length) {
              var y = sum(node.sourceLinks, weightedTarget) / sum(node.sourceLinks, value);
              node.x += (y - center(node)) * alpha;
            }
          });
        });

        function weightedTarget(link) {
          return center(link.target) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function (nodes) {
          var node = void 0,
              dy = void 0,
              x0 = 0,
              n = nodes.length,
              i = void 0;

          // Push any overlapping nodes right.
          nodes.sort(ascendingDepth);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = x0 - node.x;
            if (dy > 0) node.x += dy;
            x0 = node.x + node.dy + nodePadding;
          }

          // If the rightmost node goes outside the bounds, push it left.
          dy = x0 - nodePadding - size[0]; // was size[1]
          if (dy > 0) {
            x0 = node.x -= dy;

            // Push any overlapping nodes left.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.x + node.dy + nodePadding - x0; // was y0
              if (dy > 0) node.x -= dy;
              x0 = node.x;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        //return a.y - b.y; // flows go up
        return b.x - a.x; // flows go down
        //return a.x - b.x;
      }
    }

    // this moves all end points (sinks!) to the most extreme bottom
    function moveSinksDown(y) {
      nodes.forEach(function (node) {
        if (!node.sourceLinks.length) {
          node.y = y - 1;
        }
      });
    }

    // shift their locations out to occupy the screen
    function scaleNodeBreadths(kx) {
      nodes.forEach(function (node) {
        node.y *= kx;
      });
    }

    function computeNodeDepths() {
      var remainingNodes = nodes,
          nextNodes = void 0,
          y = 0;

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function (node) {
          node.y = y;
          //node.dx = nodeWidth;
          node.sourceLinks.forEach(function (link) {
            if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
            }
          });
        });
        remainingNodes = nextNodes;
        ++y;
      }

      // move end points to the very bottom
      moveSinksDown(y);

      scaleNodeBreadths((size[1] - nodeWidth) / (y - 1));
    }

    // .ty is the offset in terms of node position of the link (target)
    function computeLinkDepths() {
      nodes.forEach(function (node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function (node) {
        var sy = 0,
            ty = 0;
        //ty = node.dy;
        node.sourceLinks.forEach(function (link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function (link) {
          // this is simply saying, for each target, keep adding the width of the link
          // so what if it was the other way round. start with full width then subtract?
          link.ty = ty;
          ty += link.dy;
          //ty -= link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        //return a.source.y - b.source.y;
        return a.source.x - b.source.x;
      }

      function ascendingTargetDepth(a, b) {
        //return a.target.y - b.target.y;
        return a.target.x - b.target.x;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }

    return sankey;
  };

  var draw$2 = function draw(state) {
    var _data = state._data,
        _options = state._options,
        _color = state._color,
        _containerId = state._containerId,
        _nodeGroup = state._nodeGroup,
        _linkGroup = state._linkGroup;


    var _layout = _options.plots.horizontal === true ? CircularSankey().nodeWidth(_options.plots.nodeWidth).nodePadding(_options.plots.nodePadding).size([_options.chart.innerWidth, _options.chart.innerHeight]).nodes(_data.nodes).links(_data.links).layout(_options.plots.layout) : VerticalSankey().nodeWidth(_options.plots.nodeWidth).nodePadding(_options.plots.nodePadding).size([_options.chart.innerWidth, _options.chart.innerHeight]).nodes(_data.nodes).links(_data.links).layout(_options.plots.layout);

    var path = _layout.link();

    // nodes
    var links = _linkGroup.selectAll('.sankey-link').data(_data.links);

    links.exit().transition().delay(_options.animation.duration.remove).style('stroke-opacity', 0).remove();

    links.attr('data-link-source', function (d, i) {
      return d.source.name;
    }).attr('data-link-target', function (d, i) {
      return d.target.name;
    }).transition().duration(_options.animation.duration.update).delay(function (d, i) {
      return i / _data.links.length * _options.animation.duration.update;
    }).attr('d', path).style('stroke-width', function (d) {
      return Math.max(1, d.dy);
    }).style('stroke', function (d) {
      return _options.plots.colorfulLink ? _color(d.source.name) : _options.plots.linkColor;
    }).style('stroke-opacity', _options.plots.linkOpacity);

    links.enter().append('path').attr('class', 'sankey-link').attr('d', path).attr('data-link-source', function (d, i) {
      return d.source.name;
    }).attr('data-link-target', function (d, i) {
      return d.target.name;
    }).style('fill', 'none').style('stroke-width', function (d) {
      return Math.max(1, d.dy);
    }).style('stroke', function (d) {
      return _options.plots.colorfulLink ? _color(d.source.name) : _options.plots.linkColor;
    }).style('stroke-opacity', _options.plots.linkOpacity);

    _linkGroup.selectAll('.sankey-link').classed('backwards', function (d) {
      return d.target.x < d.source.x;
    });

    var nodes = _nodeGroup.selectAll('.sankey-node').data(_data.nodes);

    nodes.exit().transition().duration(_options.animation.duration.remove).remove();

    nodes.transition().delay(_options.animation.duration.remove).attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

    var _drag = drag().subject(function (d) {
      return d;
    }).on('start', function () {
      this.parentNode.appendChild(this);
    }).on('end', function () {
      if (_options.plots.horizontal) {
        select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(_options.chart.innerHeight - d.dy, event.y))) + ')');
      } else {
        select(this).attr('transform', 'translate(' + (d.x = Math.max(0, Math.min(_options.chart.innerWidth - d.dy, event.x))) + ',' + d.y + ')');
      }

      _layout.relayout();
      links.attr('d', path);
    });

    nodes.call(_drag);

    nodes.select('.sankey-node-rect').transition().duration(_options.animation.duration.update).delay(function (d, i) {
      return i / _data.nodes.length * _options.animation.duration.update;
    }).attr('height', _options.plots.horizontal ? function (d) {
      return d.dy > 0 ? d.dy : 0.5;
    } : _layout.nodeWidth() > 0 ? _layout.nodeWidth() : 0.5).attr('width', _options.plots.horizontal ? _layout.nodeWidth() : function (d) {
      return d.dy;
    }).style('fill', function (d) {
      return d.color = _color(d.name);
    }).style('fill-opacity', _options.plots.nodeOpacity);

    nodes.select('title').text(function (d) {
      return d.name + '\n' + d.value;
    });

    if (_options.plots.horizontal === true) {
      nodes.select('.sankey-node-title').transition().duration(_options.animation.duration.update).delay(function (d, i) {
        return i / _data.nodes.length * _options.animation.duration.update;
      }).attr('x', -6).attr('y', function (d) {
        return d.dy / 2;
      }).attr('dy', '.35em').attr('text-anchor', 'end').attr('transform', null).text(function (d) {
        return d.name;
      }).filter(function (d) {
        return d.x < width / 2;
      }).attr('x', _options.plots.horizontal ? 6 + _layout.nodeWidth() : 0).attr('text-anchor', 'start').style('font-size', _options.plots.nodeFontSize + 'px');
    } else {
      nodes.select('.sankey-node-title').transition().duration(_options.animation.duration.update).delay(function (d, i) {
        return i / _data.nodes.length * _options.animation.duration.update;
      }).attr('text-anchor', 'middle')
      //.attr("transform", "rotate(-20)")
      .attr('x', function (d) {
        return d.dy / 2;
      }).attr('y', _layout.nodeWidth() / 2).attr('dy', '.35em').text(function (d) {
        return d.name;
      }).filter(function (d) {
        return d.x < _options.chart.innerWidth / 2;
      }).style('font-size', _options.plots.nodeFontSize + 'px');
    }

    var appendedNodes = nodes.enter().append('g').attr('class', 'sankey-node').attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    }).call(_drag);

    appendedNodes.append('rect').attr('class', 'sankey-node-rect').attr('height', _options.plots.horizontal ? function (d) {
      return d.dy > 0 ? d.dy : 0.5;
    } : _layout.nodeWidth() > 0 ? _layout.nodeWidth() : 0.5).attr('width', _options.plots.horizontal ? _layout.nodeWidth() : function (d) {
      return d.dy;
    }).style('fill', function (d) {
      return d.color = _color(d.name);
    }).style('fill-opacity', _options.plots.nodeOpacity).style('shape-rendering', 'crispEdges').append('title').text(function (d) {
      return d.name + '\n' + d.value;
    });

    if (_options.plots.horizontal === true) {
      appendedNodes.append('text').attr('class', 'sankey-node-title').attr('x', -6).attr('y', function (d) {
        return d.dy / 2;
      }).attr('dy', '.35em').attr('text-anchor', 'end').attr('transform', null).text(function (d) {
        return d.name;
      }).filter(function (d) {
        return d.x < _options.chart.innerWidth / 2;
      }).attr('x', 6 + _layout.nodeWidth()).attr('text-anchor', 'start').style('font-size', _options.plots.nodeFontSize + 'px');
    } else {
      appendedNodes.append('text').attr('text-anchor', 'middle')
      //.attr("transform", "rotate(-20)")
      .attr('x', function (d) {
        return d.dy / 2;
      }).attr('y', _layout.nodeWidth() / 2).attr('dy', '.35em').text(function (d) {
        return d.name;
      }).filter(function (d) {
        return d.x < _options.chart.innerWidth / 2;
      }).style('font-size', _options.plots.nodeFontSize + 'px');
    }

    // this._linkGroup.selectAll('.sankey-link')
    //     .on('mousemove', mouseOnPath)
    //     .on('mouseout', this._mouseOffPath);

    // nodeGroup.selectAll('.sankey-node-rect')
    //     .on('mousemove', mouseOnNode)
    //     .on('mouseout', mouseOffNode);

    select(_containerId).select('canvas').empty();
  };

  var apiRender$6 = function apiRender$$1(state) {
    return {
      render: function render(data) {
        apiRender(state).render(data);

        var _svg = state._svg;


        var _nodeGroup = _svg.append('g').attr('class', 'node-group');
        var _linkGroup = _svg.append('g').attr('class', 'link-group');

        state._nodeGroup = _nodeGroup;
        state._linkGroup = _linkGroup;

        draw$2(state);
      }
    };
  };

  var apiUpdate$4 = function apiUpdate(state) {
    return {
      update: function update() {
        draw$2(state);
      }
    };
  };

  var apiColor$4 = function apiColor(state) {
    return {
      color: function color(userColor) {
        state._options.color = userColor;
        state._color = state._composers.color(userColor);

        var _options = state._options,
            _nodeGroup = state._nodeGroup,
            _linkGroup = state._linkGroup,
            _data = state._data,
            _color = state._color;


        _nodeGroup.selectAll('.sankey-node-rect').transition().duration(_options.animation.duration.color).delay(function (d, i) {
          return i / _data.nodes.length * _options.animation.duration.color;
        }).style('fill', function (d) {
          return _color(d.name);
        });

        _linkGroup.selectAll('.sankey-link').transition().duration(_options.animation.duration.color).delay(function (d, i) {
          return i / _data.links.length * _options.animation.duration.color;
        }).style('stroke', function (d) {
          return _options.plots.colorfulLink ? _color(d.source.name) : _options.plots.linkColor;
        });
      }
    };
  };

  var Options = {
    chart: {
      type: 'sankey'
    },
    color: DefaultCategoricalColor,
    plots: {
      horizontal: true, // 'horizontal', 'vertical'
      layout: 32,
      nodeWidth: 15,
      nodePadding: 10,
      colorfulLink: true,
      linkColor: '#000',
      linkOpacity: 0.2,
      nodeOpacity: 1,
      nodeFontSize: 14,
      realTime: false,
      realTimeSpeed: 5000, // 5s
      realTimeInterval: 1 // 1s
    }
  };

  var composers$4 = {
    opt: Options
  };

  var index$4 = factory(svgLayer, composers$4, [apiRender$6, apiUpdate$4, apiColor$4]);

  // export { default as Clustergram } from './Clustergram';

  exports.version = version;
  exports.parallelCoordinates = index;
  exports.biPartite = index$1;
  exports.chord = index$2;
  exports.strentchedChord = index$3;
  exports.sankey = index$4;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vizart-path.standalone.js.map
