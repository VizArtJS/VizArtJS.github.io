document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VizArtHierarchy = {})));
}(this, (function (exports) { 'use strict';

var version = "0.6.0";

var colors = function (specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;
  while (i < n) {
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  }return colors;
};

var schemeAccent = colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

var schemeDark2 = colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

var schemePaired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

var schemePastel1 = colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

var schemePastel2 = colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

var schemeSet1 = colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

var schemeSet2 = colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

var schemeSet3 = colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var define = function (constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) {
    prototype[key] = definition[key];
  }return prototype;
}

function Color() {}

var _darker = 0.7;
var _brighter = 1 / _darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

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

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

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

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix$1) return new Cubehelix$1(o.h, o.s, o.l, o.opacity);
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
  return new Cubehelix$1(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix$1(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix$1(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix$1, cubehelix, extend(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Cubehelix$1(this.h, this.s, this.l * k, this.opacity);
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

var basis$1 = function (values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
};

var constant$1 = function (x) {
  return function () {
    return x;
  };
};

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

var interpolateArray = function (a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(nb),
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
};

var date = function (a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
};

var interpolateNumber = function (a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var interpolateObject = function (a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || (typeof a === "undefined" ? "undefined" : _typeof$1(a)) !== "object") a = {};
  if (b === null || (typeof b === "undefined" ? "undefined" : _typeof$1(b)) !== "object") b = {};

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
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");

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

var interpolateString = function (a, b) {
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
};

var interpolateValue = function (a, b) {
    var t = typeof b === "undefined" ? "undefined" : _typeof$1(b),
        c;
    return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? interpolateArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? interpolateObject : interpolateNumber)(a, b);
};

var interpolateRound = function (a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var identity$1 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

var decompose = function (a, b, c, d, e, f) {
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
};

var cssNode;
var cssRoot;
var cssView;
var svgNode;

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

var rho = Math.SQRT2;
var rho2 = 2;
var rho4 = 4;
var epsilon2 = 1e-12;

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
var interpolateZoom = function (p0, p1) {
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
};

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

var ramp = function (scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
};

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

var scheme$10 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors);

var interpolateBuPu = ramp(scheme$10);

var scheme$11 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors);

var interpolateGnBu = ramp(scheme$11);

var scheme$12 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors);

var interpolateOrRd = ramp(scheme$12);

var scheme$13 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors);

var interpolatePuBuGn = ramp(scheme$13);

var scheme$14 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors);

var interpolatePuBu = ramp(scheme$14);

var scheme$15 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors);

var interpolatePuRd = ramp(scheme$15);

var scheme$16 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors);

var interpolateRdPu = ramp(scheme$16);

var scheme$17 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors);

var interpolateYlGnBu = ramp(scheme$17);

var scheme$18 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors);

var interpolateYlGn = ramp(scheme$18);

var scheme$19 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors);

var interpolateYlOrBr = ramp(scheme$19);

var scheme$20 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors);

var interpolateYlOrRd = ramp(scheme$20);

var scheme$21 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors);

var interpolateBlues = ramp(scheme$21);

var scheme$22 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors);

var interpolateGreens = ramp(scheme$22);

var scheme$23 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors);

var interpolateGreys = ramp(scheme$23);

var scheme$24 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors);

var interpolatePurples = ramp(scheme$24);

var scheme$25 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors);

var interpolateReds = ramp(scheme$25);

var scheme$26 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors);

var interpolateOranges = ramp(scheme$26);

var ascending = function (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function (compare) {
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
};

function ascendingComparator(f) {
  return function (d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

function pair(a, b) {
  return [a, b];
}

var number = function (x) {
  return x === null ? NaN : +x;
};

var extent = function (values, valueof) {
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
};

var identity$2 = function (x) {
  return x;
};

var range = function (start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function (start, stop, count) {
    var reverse = stop < start,
        i = -1,
        n,
        ticks,
        step;

    if (reverse) n = start, start = stop, stop = n;

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
};

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

var sturges = function (values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var threshold = function (values, p, valueof) {
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
};

var max = function (values, valueof) {
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
};

var min = function (values, valueof) {
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
};

function length(d) {
  return d.length;
}

var prefix = "$";

function Map$2() {}

Map$2.prototype = map$2.prototype = {
  constructor: Map$2,
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

function map$2(object, f) {
  var map = new Map$2();

  // Copy constructor.
  if (object instanceof Map$2) object.each(function (value, key) {
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

function Set$1() {}

var proto = map$2.prototype;

Set$1.prototype = set$1.prototype = {
  constructor: Set$1,
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
  var set = new Set$1();

  // Copy constructor.
  if (object instanceof Set$1) object.each(function (value) {
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

var map$4 = array$1.map;
var slice$1 = array$1.slice;

var implicit = { name: "implicit" };

function ordinal(range) {
  var index = map$2(),
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
    domain = [], index = map$2();
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

var constant$3 = function (x) {
  return function () {
    return x;
  };
};

var number$1 = function (x) {
  return +x;
};

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : constant$3(b);
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
      interpolate = interpolateValue,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
  }

  scale.invert = function (y) {
    return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = map$4.call(_, number$1), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
  };

  scale.rangeRound = function (_) {
    return range$$1 = slice$1.call(_), interpolate = interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  return rescale();
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
var formatDecimal = function (x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i,
      coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
};

var exponent = function (x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

var formatGroup = function (grouping, thousands) {
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
};

var formatNumerals = function (numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
};

var formatDefault = function (x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".":
        i0 = i1 = i;break;
      case "0":
        if (i0 === 0) i0 = i;i1 = i;break;
      case "e":
        break out;
      default:
        if (i0 > 0) i0 = 0;break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

var prefixExponent;

var formatPrefixAuto = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
};

var formatRounded = function (x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
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

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width == null ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0)) + this.type;
};

var identity$4 = function (x) {
  return x;
};

var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

var formatLocale = function (locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$4,
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
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? type ? 6 : 12 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

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

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? sign === "(" ? sign : "-" : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

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
};

var locale$1;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale$1 = formatLocale(definition);
  format = locale$1.format;
  formatPrefix = locale$1.formatPrefix;
  return locale$1;
}

var precisionFixed = function (step) {
  return Math.max(0, -exponent(Math.abs(step)));
};

var precisionPrefix = function (step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
};

var precisionRound = function (step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
};

var tickFormat = function (domain, count, specifier) {
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
};

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

function deinterpolate(a, b) {
  return (b = Math.log(b / a)) ? function (x) {
    return Math.log(x / a) / b;
  } : constant$3(b);
}

function reinterpolate(a, b) {
  return a < 0 ? function (t) {
    return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
  } : function (t) {
    return Math.pow(b, t) * Math.pow(a, 1 - t);
  };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
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
    } : constant$3(b);
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

function quantile() {
  var domain = [],
      range$$1 = [],
      thresholds = [];

  function rescale() {
    var i = 0,
        n = Math.max(1, range$$1.length);
    thresholds = new Array(n - 1);
    while (++i < n) {
      thresholds[i - 1] = threshold(domain, i / n);
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
    return quantile().domain(domain).range(range$$1);
  };

  return scale;
}

var t0$1 = new Date();
var t1$1 = new Date();

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

var durationSecond$1 = 1e3;
var durationMinute$1 = 6e4;
var durationHour$1 = 36e5;
var durationDay$1 = 864e5;
var durationWeek$1 = 6048e5;

var second = newInterval(function (date) {
  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
}, function (date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function (start, end) {
  return (end - start) / durationSecond$1;
}, function (date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function (date) {
  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
}, function (date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getMinutes();
});

var hour = newInterval(function (date) {
  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
  if (offset < 0) offset += durationHour$1;
  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getHours();
});

var day = newInterval(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
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
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
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
  date.setTime(+date + step * durationMinute$1);
}, function (start, end) {
  return (end - start) / durationMinute$1;
}, function (date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * durationHour$1);
}, function (start, end) {
  return (end - start) / durationHour$1;
}, function (date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / durationDay$1;
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
    return (end - start) / durationWeek$1;
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

var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

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

var locale$2;
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
  locale$2 = formatLocale$1(definition);
  timeFormat = locale$2.format;
  timeParse = locale$2.parse;
  utcFormat = locale$2.utcFormat;
  utcParse = locale$2.utcParse;
  return locale$2;
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

var colors$1 = function (s) {
  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
};

var schemeCategory10 = colors$1("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var schemeCategory20b = colors$1("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

var schemeCategory20c = colors$1("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

var schemeCategory20 = colors$1("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

var interpolateCubehelixDefault = cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow = cubehelix();

var interpolateRainbow = function (t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  rainbow.h = 360 * t - 100;
  rainbow.s = 1.5 - 1.5 * ts;
  rainbow.l = 0.8 - 0.9 * ts;
  return rainbow + "";
};

function ramp$1(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var interpolateViridis = ramp$1(colors$1("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp$1(colors$1("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp$1(colors$1("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp$1(colors$1("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/* @flow */

/**
 * [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
 * is a simple way to find a fitted line
 * between a set of coordinates. This algorithm finds the slope and y-intercept of a regression line
 * using the least sum of squares.
 *
 * @param {Array<Array<number>>} data an array of two-element of arrays,
 * like `[[0, 1], [2, 3]]`
 * @returns {Object} object containing slope and intersect of regression line
 * @example
 * linearRegression([[0, 0], [1, 1]]); // => { m: 1, b: 0 }
 */

function linearRegression(data /*: Array<Array<number>> */) /*: { m: number, b: number } */{

    var m, b;

    // Store data length in a local variable to reduce
    // repeated object property lookups
    var dataLength = data.length;

    //if there's only one point, arbitrarily choose a slope of 0
    //and a y-intercept of whatever the y of the initial point is
    if (dataLength === 1) {
        m = 0;
        b = data[0][1];
    } else {
        // Initialize our sums and scope the `m` and `b`
        // variables that define the line.
        var sumX = 0,
            sumY = 0,
            sumXX = 0,
            sumXY = 0;

        // Use local variables to grab point values
        // with minimal object property lookups
        var point, x, y;

        // Gather the sum of all x values, the sum of all
        // y values, and the sum of x^2 and (x*y) for each
        // value.
        //
        // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
        for (var i = 0; i < dataLength; i++) {
            point = data[i];
            x = point[0];
            y = point[1];

            sumX += x;
            sumY += y;

            sumXX += x * x;
            sumXY += x * y;
        }

        // `m` is the slope of the regression line
        m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);

        // `b` is the y-intercept of the line.
        b = sumY / dataLength - m * sumX / dataLength;
    }

    // Return both values as an object.
    return {
        m: m,
        b: b
    };
}

var linear_regression = linearRegression;

/* @flow */

/**
 * Given the output of `linearRegression`: an object
 * with `m` and `b` values indicating slope and intercept,
 * respectively, generate a line function that translates
 * x values into y values.
 *
 * @param {Object} mb object with `m` and `b` members, representing
 * slope and intersect of desired line
 * @returns {Function} method that computes y-value at any given
 * x-value on the line.
 * @example
 * var l = linearRegressionLine(linearRegression([[0, 0], [1, 1]]));
 * l(0) // = 0
 * l(2) // = 2
 * linearRegressionLine({ b: 0, m: 1 })(1); // => 1
 * linearRegressionLine({ b: 1, m: 1 })(1); // => 2
 */

function linearRegressionLine(mb /*: { b: number, m: number }*/) /*: Function */{
    // Return a function that computes a `y` value for each
    // x value it is given, based on the values of `b` and `a`
    // that we just computed.
    return function (x) {
        return mb.b + mb.m * x;
    };
}

var linear_regression_line = linearRegressionLine;

/* @flow */

/**
 * Our default sum is the [Kahan-Babuska algorithm](https://pdfs.semanticscholar.org/1760/7d467cda1d0277ad272deb2113533131dc09.pdf).
 * This method is an improvement over the classical
 * [Kahan summation algorithm](https://en.wikipedia.org/wiki/Kahan_summation_algorithm).
 * It aims at computing the sum of a list of numbers while correcting for
 * floating-point errors. Traditionally, sums are calculated as many
 * successive additions, each one with its own floating-point roundoff. These
 * losses in precision add up as the number of numbers increases. This alternative
 * algorithm is more accurate than the simple way of calculating sums by simple
 * addition.
 *
 * This runs on `O(n)`, linear time in respect to the array.
 *
 * @param {Array<number>} x input
 * @return {number} sum of all input numbers
 * @example
 * sum([1, 2, 3]); // => 6
 */

function sum$1(x /*: Array<number> */) /*: number */{

    // If the array is empty, we needn't bother computing its sum
    if (x.length === 0) {
        return 0;
    }

    // Initializing the sum as the first number in the array
    var sum = x[0];

    // Keeping track of the floating-point error correction
    var correction = 0;

    var transition;

    for (var i = 1; i < x.length; i++) {
        transition = sum + x[i];

        // Here we need to update the correction in a different fashion
        // if the new absolute value is greater than the absolute sum
        if (Math.abs(sum) >= Math.abs(x[i])) {
            correction += sum - transition + x[i];
        } else {
            correction += x[i] - transition + sum;
        }

        sum = transition;
    }

    // Returning the corrected sum
    return sum + correction;
}

var sum_1 = sum$1;

/* @flow */



/**
 * The mean, _also known as average_,
 * is the sum of all values over the number of values.
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x sample of one or more data points
 * @throws {Error} if the the length of x is less than one
 * @returns {number} mean
 * @example
 * mean([0, 10]); // => 5
 */
function mean$1(x /*: Array<number> */) /*:number*/{
    // The mean of no numbers is null
    if (x.length === 0) {
        throw new Error('mean requires at least one data point');
    }

    return sum_1(x) / x.length;
}

var mean_1 = mean$1;

/* @flow */



/**
 * The sum of deviations to the Nth power.
 * When n=2 it's the sum of squared deviations.
 * When n=3 it's the sum of cubed deviations.
 *
 * @param {Array<number>} x
 * @param {number} n power
 * @returns {number} sum of nth power deviations
 * @example
 * var input = [1, 2, 3];
 * // since the variance of a set is the mean squared
 * // deviations, we can calculate that with sumNthPowerDeviations:
 * var variance = sumNthPowerDeviations(input) / input.length;
 */
function sumNthPowerDeviations(x /*: Array<number> */, n /*: number */) /*:number*/{
    var meanValue = mean_1(x),
        sum = 0,
        tempValue,
        i;

    // This is an optimization: when n is 2 (we're computing a number squared),
    // multiplying the number by itself is significantly faster than using
    // the Math.pow method.
    if (n === 2) {
        for (i = 0; i < x.length; i++) {
            tempValue = x[i] - meanValue;
            sum += tempValue * tempValue;
        }
    } else {
        for (i = 0; i < x.length; i++) {
            sum += Math.pow(x[i] - meanValue, n);
        }
    }

    return sum;
}

var sum_nth_power_deviations = sumNthPowerDeviations;

/* @flow */



/**
 * The [variance](http://en.wikipedia.org/wiki/Variance)
 * is the sum of squared deviations from the mean.
 *
 * This is an implementation of variance, not sample variance:
 * see the `sampleVariance` method if you want a sample measure.
 *
 * @param {Array<number>} x a population of one or more data points
 * @returns {number} variance: a value greater than or equal to zero.
 * zero indicates that all values are identical.
 * @throws {Error} if x's length is 0
 * @example
 * variance([1, 2, 3, 4, 5, 6]); // => 2.9166666666666665
 */
function variance$1(x /*: Array<number> */) /*:number*/{
    // The variance of no numbers is null
    if (x.length === 0) {
        throw new Error('variance requires at least one data point');
    }

    // Find the mean of squared deviations between the
    // mean value and each value.
    return sum_nth_power_deviations(x, 2) / x.length;
}

var variance_1 = variance$1;

/* @flow */



/**
 * The [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
 * is the square root of the variance. This is also known as the population
 * standard deviation. It's useful for measuring the amount
 * of variation or dispersion in a set of values.
 *
 * Standard deviation is only appropriate for full-population knowledge: for
 * samples of a population, {@link sampleStandardDeviation} is
 * more appropriate.
 *
 * @param {Array<number>} x input
 * @returns {number} standard deviation
 * @example
 * variance([2, 4, 4, 4, 5, 5, 7, 9]); // => 4
 * standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]); // => 2
 */
function standardDeviation(x /*: Array<number> */) /*:number*/{
    if (x.length === 1) {
        return 0;
    }
    var v = variance_1(x);
    return Math.sqrt(v);
}

var standard_deviation = standardDeviation;

/* @flow */

/**
 * The [R Squared](http://en.wikipedia.org/wiki/Coefficient_of_determination)
 * value of data compared with a function `f`
 * is the sum of the squared differences between the prediction
 * and the actual value.
 *
 * @param {Array<Array<number>>} x input data: this should be doubly-nested
 * @param {Function} func function called on `[i][0]` values within the dataset
 * @returns {number} r-squared value
 * @example
 * var samples = [[0, 0], [1, 1]];
 * var regressionLine = linearRegressionLine(linearRegression(samples));
 * rSquared(samples, regressionLine); // = 1 this line is a perfect fit
 */

function rSquared(x /*: Array<Array<number>> */, func /*: Function */) /*: number */{
    if (x.length < 2) {
        return 1;
    }

    // Compute the average y value for the actual
    // data set in order to compute the
    // _total sum of squares_
    var sum = 0,
        average;
    for (var i = 0; i < x.length; i++) {
        sum += x[i][1];
    }
    average = sum / x.length;

    // Compute the total sum of squares - the
    // squared difference between each point
    // and the average of all points.
    var sumOfSquares = 0;
    for (var j = 0; j < x.length; j++) {
        sumOfSquares += Math.pow(average - x[j][1], 2);
    }

    // Finally estimate the error: the squared
    // difference between the estimate and the actual data
    // value at each point.
    var err = 0;
    for (var k = 0; k < x.length; k++) {
        err += Math.pow(x[k][1] - func(x[k][0]), 2);
    }

    // As the error grows larger, its ratio to the
    // sum of squares increases and the r squared
    // value grows lower.
    return 1 - err / sumOfSquares;
}

var r_squared = rSquared;

/* @flow */

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

function numericSort(x /*: Array<number> */) /*: Array<number> */{
    return x
    // ensure the array is not changed in-place
    .slice()
    // comparator function that treats input as numeric
    .sort(function (a, b) {
        return a - b;
    });
}

var numeric_sort = numericSort;

/* @flow */

/**
 * The [mode](http://bit.ly/W5K4Yt) is the number that appears in a list the highest number of times.
 * There can be multiple modes in a list: in the event of a tie, this
 * algorithm will return the most recently seen mode.
 *
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs in `O(n)` because the input is sorted.
 *
 * @param {Array<number>} sorted a sample of one or more data points
 * @returns {number} mode
 * @throws {Error} if sorted is empty
 * @example
 * modeSorted([0, 0, 1]); // => 0
 */

function modeSorted(sorted /*: Array<number> */) /*:number*/{

    // Handle edge cases:
    // The mode of an empty list is undefined
    if (sorted.length === 0) {
        throw new Error('mode requires at least one data point');
    } else if (sorted.length === 1) {
        return sorted[0];
    }

    // This assumes it is dealing with an array of size > 1, since size
    // 0 and 1 are handled immediately. Hence it starts at index 1 in the
    // array.
    var last = sorted[0],

    // store the mode as we find new modes
    value = NaN,

    // store how many times we've seen the mode
    maxSeen = 0,

    // how many times the current candidate for the mode
    // has been seen
    seenThis = 1;

    // end at sorted.length + 1 to fix the case in which the mode is
    // the highest number that occurs in the sequence. the last iteration
    // compares sorted[i], which is undefined, to the highest number
    // in the series
    for (var i = 1; i < sorted.length + 1; i++) {
        // we're seeing a new number pass by
        if (sorted[i] !== last) {
            // the last number is the new mode since we saw it more
            // often than the old one
            if (seenThis > maxSeen) {
                maxSeen = seenThis;
                value = last;
            }
            seenThis = 1;
            last = sorted[i];
            // if this isn't a new number, it's one more occurrence of
            // the potential mode
        } else {
            seenThis++;
        }
    }
    return value;
}

var mode_sorted = modeSorted;

/* @flow */



/**
 * The [mode](http://bit.ly/W5K4Yt) is the number that appears in a list the highest number of times.
 * There can be multiple modes in a list: in the event of a tie, this
 * algorithm will return the most recently seen mode.
 *
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs on `O(nlog(n))` because it needs to sort the array internally
 * before running an `O(n)` search to find the mode.
 *
 * @param {Array<number>} x input
 * @returns {number} mode
 * @example
 * mode([0, 0, 1]); // => 0
 */
function mode(x /*: Array<number> */) /*:number*/{
    // Sorting the array lets us iterate through it below and be sure
    // that every time we see a new number it's new and we'll never
    // see the same number twice
    return mode_sorted(numeric_sort(x));
}

var mode_1 = mode;

/* @flow */
/* globals Map: false */

/**
 * The [mode](http://bit.ly/W5K4Yt) is the number that appears in a list the highest number of times.
 * There can be multiple modes in a list: in the event of a tie, this
 * algorithm will return the most recently seen mode.
 *
 * modeFast uses a Map object to keep track of the mode, instead of the approach
 * used with `mode`, a sorted array. As a result, it is faster
 * than `mode` and supports any data type that can be compared with `==`.
 * It also requires a
 * [JavaScript environment with support for Map](https://kangax.github.io/compat-table/es6/#test-Map),
 * and will throw an error if Map is not available.
 *
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * @param {Array<*>} x a sample of one or more data points
 * @returns {?*} mode
 * @throws {ReferenceError} if the JavaScript environment doesn't support Map
 * @throws {Error} if x is empty
 * @example
 * modeFast(['rabbits', 'rabbits', 'squirrels']); // => 'rabbits'
 */

function modeFast /*::<T>*/(x /*: Array<T> */) /*: ?T */{

    // This index will reflect the incidence of different values, indexing
    // them like
    // { value: count }
    var index = new Map();

    // A running `mode` and the number of times it has been encountered.
    var mode;
    var modeCount = 0;

    for (var i = 0; i < x.length; i++) {
        var newCount = index.get(x[i]);
        if (newCount === undefined) {
            newCount = 1;
        } else {
            newCount++;
        }
        if (newCount > modeCount) {
            mode = x[i];
            modeCount = newCount;
        }
        index.set(x[i], newCount);
    }

    if (modeCount === 0) {
        throw new Error('mode requires at last one data point');
    }

    return mode;
}

var mode_fast = modeFast;

/* @flow */

/**
 * The min is the lowest number in the array. This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x sample of one or more data points
 * @throws {Error} if the the length of x is less than one
 * @returns {number} minimum value
 * @example
 * min([1, 5, -10, 100, 2]); // => -10
 */

function min$1(x /*: Array<number> */) /*:number*/{

    if (x.length === 0) {
        throw new Error('min requires at least one data point');
    }

    var value = x[0];
    for (var i = 1; i < x.length; i++) {
        // On the first iteration of this loop, min is
        // undefined and is thus made the minimum element in the array
        if (x[i] < value) {
            value = x[i];
        }
    }
    return value;
}

var min_1 = min$1;

/* @flow */

/**
 * This computes the maximum number in an array.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x sample of one or more data points
 * @returns {number} maximum value
 * @throws {Error} if the the length of x is less than one
 * @example
 * max([1, 2, 3, 4]);
 * // => 4
 */

function max$1(x /*: Array<number> */) /*:number*/{

    if (x.length === 0) {
        throw new Error('max requires at least one data point');
    }

    var value = x[0];
    for (var i = 1; i < x.length; i++) {
        // On the first iteration of this loop, max is
        // undefined and is thus made the maximum element in the array
        if (x[i] > value) {
            value = x[i];
        }
    }
    return value;
}

var max_1 = max$1;

/* @flow */

/**
 * The minimum is the lowest number in the array. With a sorted array,
 * the first element in the array is always the smallest, so this calculation
 * can be done in one step, or constant time.
 *
 * @param {Array<number>} x input
 * @returns {number} minimum value
 * @example
 * minSorted([-100, -10, 1, 2, 5]); // => -100
 */

function minSorted(x /*: Array<number> */) /*:number*/{
  return x[0];
}

var min_sorted = minSorted;

/* @flow */

/**
 * The maximum is the highest number in the array. With a sorted array,
 * the last element in the array is always the largest, so this calculation
 * can be done in one step, or constant time.
 *
 * @param {Array<number>} x input
 * @returns {number} maximum value
 * @example
 * maxSorted([-100, -10, 1, 2, 5]); // => 5
 */

function maxSorted(x /*: Array<number> */) /*:number*/{
  return x[x.length - 1];
}

var max_sorted = maxSorted;

/* @flow */

/**
 * The simple [sum](https://en.wikipedia.org/wiki/Summation) of an array
 * is the result of adding all numbers together, starting from zero.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input
 * @return {number} sum of all input numbers
 * @example
 * sumSimple([1, 2, 3]); // => 6
 */

function sumSimple(x /*: Array<number> */) /*: number */{
    var value = 0;
    for (var i = 0; i < x.length; i++) {
        value += x[i];
    }
    return value;
}

var sum_simple = sumSimple;

/* @flow */

/**
 * The [product](https://en.wikipedia.org/wiki/Product_(mathematics)) of an array
 * is the result of multiplying all numbers together, starting using one as the multiplicative identity.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x input
 * @return {number} product of all input numbers
 * @example
 * product([1, 2, 3, 4]); // => 24
 */

function product(x /*: Array<number> */) /*: number */{
    var value = 1;
    for (var i = 0; i < x.length; i++) {
        value *= x[i];
    }
    return value;
}

var product_1 = product;

/* @flow */

/**
 * This is the internal implementation of quantiles: when you know
 * that the order is sorted, you don't need to re-sort it, and the computations
 * are faster.
 *
 * @param {Array<number>} x sample of one or more data points
 * @param {number} p desired quantile: a number between 0 to 1, inclusive
 * @returns {number} quantile value
 * @throws {Error} if p ix outside of the range from 0 to 1
 * @throws {Error} if x is empty
 * @example
 * quantileSorted([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
 */

function quantileSorted(x /*: Array<number> */, p /*: number */) /*:number*/{
    var idx = x.length * p;
    if (x.length === 0) {
        throw new Error('quantile requires at least one data point.');
    } else if (p < 0 || p > 1) {
        throw new Error('quantiles must be between 0 and 1');
    } else if (p === 1) {
        // If p is 1, directly return the last element
        return x[x.length - 1];
    } else if (p === 0) {
        // If p is 0, directly return the first element
        return x[0];
    } else if (idx % 1 !== 0) {
        // If p is not integer, return the next element in array
        return x[Math.ceil(idx) - 1];
    } else if (x.length % 2 === 0) {
        // If the list has even-length, we'll take the average of this number
        // and the next value, if there is one
        return (x[idx - 1] + x[idx]) / 2;
    } else {
        // Finally, in the simple case of an integer value
        // with an odd-length list, return the x value at the index.
        return x[idx];
    }
}

var quantile_sorted = quantileSorted;

/* @flow */

var quickselect_1 = quickselect;

/**
 * Rearrange items in `arr` so that all items in `[left, k]` range are the smallest.
 * The `k`-th element will have the `(k - left + 1)`-th smallest value in `[left, right]`.
 *
 * Implements Floyd-Rivest selection algorithm https://en.wikipedia.org/wiki/Floyd-Rivest_algorithm
 *
 * @private
 * @param {Array<number>} arr input array
 * @param {number} k pivot index
 * @param {number} left left index
 * @param {number} right right index
 * @returns {undefined}
 * @example
 * var arr = [65, 28, 59, 33, 21, 56, 22, 95, 50, 12, 90, 53, 28, 77, 39];
 * quickselect(arr, 8);
 * // = [39, 28, 28, 33, 21, 12, 22, 50, 53, 56, 59, 65, 90, 77, 95]
 */
function quickselect(arr /*: Array<number> */, k /*: number */, left /*: number */, right /*: number */) {
    left = left || 0;
    right = right || arr.length - 1;

    while (right > left) {
        // 600 and 0.5 are arbitrary constants chosen in the original paper to minimize execution time
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n);
            if (m - n / 2 < 0) sd *= -1;
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            quickselect(arr, k, newLeft, newRight);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);
        if (arr[right] > t) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (arr[i] < t) {
                i++;
            }while (arr[j] > t) {
                j--;
            }
        }

        if (arr[left] === t) swap(arr, left, j);else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/* @flow */




/**
 * The [quantile](https://en.wikipedia.org/wiki/Quantile):
 * this is a population quantile, since we assume to know the entire
 * dataset in this library. This is an implementation of the
 * [Quantiles of a Population](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
 * algorithm from wikipedia.
 *
 * Sample is a one-dimensional array of numbers,
 * and p is either a decimal number from 0 to 1 or an array of decimal
 * numbers from 0 to 1.
 * In terms of a k/q quantile, p = k/q - it's just dealing with fractions or dealing
 * with decimal values.
 * When p is an array, the result of the function is also an array containing the appropriate
 * quantiles in input order
 *
 * @param {Array<number>} x sample of one or more numbers
 * @param {number} p the desired quantile, as a number between 0 and 1
 * @returns {number} quantile
 * @example
 * quantile([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
 */
function quantile$1(x /*: Array<number> */, p /*: Array<number> | number */) {
    var copy = x.slice();

    if (Array.isArray(p)) {
        // rearrange elements so that each element corresponding to a requested
        // quantile is on a place it would be if the array was fully sorted
        multiQuantileSelect(copy, p);
        // Initialize the result array
        var results = [];
        // For each requested quantile
        for (var i = 0; i < p.length; i++) {
            results[i] = quantile_sorted(copy, p[i]);
        }
        return results;
    } else {
        var idx = quantileIndex(copy.length, p);
        quantileSelect(copy, idx, 0, copy.length - 1);
        return quantile_sorted(copy, p);
    }
}

function quantileSelect(arr, k, left, right) {
    if (k % 1 === 0) {
        quickselect_1(arr, k, left, right);
    } else {
        k = Math.floor(k);
        quickselect_1(arr, k, left, right);
        quickselect_1(arr, k + 1, k + 1, right);
    }
}

function multiQuantileSelect(arr, p) {
    var indices = [0];
    for (var i = 0; i < p.length; i++) {
        indices.push(quantileIndex(arr.length, p[i]));
    }
    indices.push(arr.length - 1);
    indices.sort(compare);

    var stack = [0, indices.length - 1];

    while (stack.length) {
        var r = Math.ceil(stack.pop());
        var l = Math.floor(stack.pop());
        if (r - l <= 1) continue;

        var m = Math.floor((l + r) / 2);
        quantileSelect(arr, indices[m], indices[l], indices[r]);

        stack.push(l, m, m, r);
    }
}

function compare(a, b) {
    return a - b;
}

function quantileIndex(len /*: number */, p /*: number */) /*:number*/{
    var idx = len * p;
    if (p === 1) {
        // If p is 1, directly return the last index
        return len - 1;
    } else if (p === 0) {
        // If p is 0, directly return the first index
        return 0;
    } else if (idx % 1 !== 0) {
        // If index is not integer, return the next index in array
        return Math.ceil(idx) - 1;
    } else if (len % 2 === 0) {
        // If the list has even-length, we'll return the middle of two indices
        // around quantile to indicate that we need an average value of the two
        return idx - 0.5;
    } else {
        // Finally, in the simple case of an integer index
        // with an odd-length list, return the index
        return idx;
    }
}

var quantile_1 = quantile$1;

/* @flow */



/**
 * The [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range) is
 * a measure of statistical dispersion, or how scattered, spread, or
 * concentrated a distribution is. It's computed as the difference between
 * the third quartile and first quartile.
 *
 * @param {Array<number>} x sample of one or more numbers
 * @returns {number} interquartile range: the span between lower and upper quartile,
 * 0.25 and 0.75
 * @example
 * interquartileRange([0, 1, 2, 3]); // => 2
 */
function interquartileRange(x /*: Array<number> */) {
    // Interquartile range is the span between the upper quartile,
    // at `0.75`, and lower quartile, `0.25`
    var q1 = quantile_1(x, 0.75),
        q2 = quantile_1(x, 0.25);

    if (typeof q1 === 'number' && typeof q2 === 'number') {
        return q1 - q2;
    }
}

var interquartile_range = interquartileRange;

/* @flow */



/**
 * The [median](http://en.wikipedia.org/wiki/Median) is
 * the middle number of a list. This is often a good indicator of 'the middle'
 * when there are outliers that skew the `mean()` value.
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * The median isn't necessarily one of the elements in the list: the value
 * can be the average of two elements if the list has an even length
 * and the two central values are different.
 *
 * @param {Array<number>} x input
 * @returns {number} median value
 * @example
 * median([10, 2, 5, 100, 2, 1]); // => 3.5
 */
function median$1(x /*: Array<number> */) /*:number*/{
  return +quantile_1(x, 0.5);
}

var median_1 = median$1;

/* @flow */



/**
 * The [Median Absolute Deviation](http://en.wikipedia.org/wiki/Median_absolute_deviation) is
 * a robust measure of statistical
 * dispersion. It is more resilient to outliers than the standard deviation.
 *
 * @param {Array<number>} x input array
 * @returns {number} median absolute deviation
 * @example
 * medianAbsoluteDeviation([1, 1, 2, 2, 4, 6, 9]); // => 1
 */
function medianAbsoluteDeviation(x /*: Array<number> */) {
    // The mad of nothing is null
    var medianValue = median_1(x),
        medianAbsoluteDeviations = [];

    // Make a list of absolute deviations from the median
    for (var i = 0; i < x.length; i++) {
        medianAbsoluteDeviations.push(Math.abs(x[i] - medianValue));
    }

    // Find the median value of that list
    return median_1(medianAbsoluteDeviations);
}

var median_absolute_deviation = medianAbsoluteDeviation;

/* @flow */

/**
 * Split an array into chunks of a specified size. This function
 * has the same behavior as [PHP's array_chunk](http://php.net/manual/en/function.array-chunk.php)
 * function, and thus will insert smaller-sized chunks at the end if
 * the input size is not divisible by the chunk size.
 *
 * `x` is expected to be an array, and `chunkSize` a number.
 * The `x` array can contain any kind of data.
 *
 * @param {Array} x a sample
 * @param {number} chunkSize size of each output array. must be a positive integer
 * @returns {Array<Array>} a chunked array
 * @throws {Error} if chunk size is less than 1 or not an integer
 * @example
 * chunk([1, 2, 3, 4, 5, 6], 2);
 * // => [[1, 2], [3, 4], [5, 6]]
 */

function chunk(x /*:Array<any>*/, chunkSize /*:number*/) /*:?Array<Array<any>>*/{

    // a list of result chunks, as arrays in an array
    var output = [];

    // `chunkSize` must be zero or higher - otherwise the loop below,
    // in which we call `start += chunkSize`, will loop infinitely.
    // So, we'll detect and throw in that case to indicate
    // invalid input.
    if (chunkSize < 1) {
        throw new Error('chunk size must be a positive number');
    }

    if (Math.floor(chunkSize) !== chunkSize) {
        throw new Error('chunk size must be an integer');
    }

    // `start` is the index at which `.slice` will start selecting
    // new array elements
    for (var start = 0; start < x.length; start += chunkSize) {

        // for each chunk, slice that part of the array and add it
        // to the output. The `.slice` function does not change
        // the original array.
        output.push(x.slice(start, start + chunkSize));
    }
    return output;
}

var chunk_1 = chunk;

/* @flow */

/**
 * Sampling with replacement is a type of sampling that allows the same
 * item to be picked out of a population more than once.
 *
 * @param {Array<*>} x an array of any kind of value
 * @param {number} n count of how many elements to take
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @return {Array} n sampled items from the population
 * @example
 * var sample = sampleWithReplacement([1, 2, 3, 4], 2);
 * sampleWithReplacement; // = [2, 4] or any other random sample of 2 items
 */

function sampleWithReplacement /*::<T>*/(x /*:Array<T>*/
, n /*: number */
, randomSource /*:Function*/) {

    if (x.length === 0) {
        return [];
    }

    // a custom random number source can be provided if you want to use
    // a fixed seed or another random number generator, like
    // [random-js](https://www.npmjs.org/package/random-js)
    randomSource = randomSource || Math.random;

    var length = x.length;
    var sample = [];

    for (var i = 0; i < n; i++) {
        var index = Math.floor(randomSource() * length);

        sample.push(x[index]);
    }

    return sample;
}

var sample_with_replacement = sampleWithReplacement;

/* @flow */

/**
 * A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * in-place - which means that it **will change the order of the original
 * array by reference**.
 *
 * This is an algorithm that generates a random [permutation](https://en.wikipedia.org/wiki/Permutation)
 * of a set.
 *
 * @param {Array} x sample of one or more numbers
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @returns {Array} x
 * @example
 * var x = [1, 2, 3, 4];
 * shuffleInPlace(x);
 * // x is shuffled to a value like [2, 1, 4, 3]
 */

function shuffleInPlace(x /*:Array<any>*/, randomSource /*:Function*/) /*:Array<any>*/{

    // a custom random number source can be provided if you want to use
    // a fixed seed or another random number generator, like
    // [random-js](https://www.npmjs.org/package/random-js)
    randomSource = randomSource || Math.random;

    // store the current length of the x to determine
    // when no elements remain to shuffle.
    var length = x.length;

    // temporary is used to hold an item when it is being
    // swapped between indices.
    var temporary;

    // The index to swap at each stage.
    var index;

    // While there are still items to shuffle
    while (length > 0) {
        // chose a random index within the subset of the array
        // that is not yet shuffled
        index = Math.floor(randomSource() * length--);

        // store the value that we'll move temporarily
        temporary = x[length];

        // swap the value at `x[length]` with `x[index]`
        x[length] = x[index];
        x[index] = temporary;
    }

    return x;
}

var shuffle_in_place = shuffleInPlace;

/* @flow */



/**
 * A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * is a fast way to create a random permutation of a finite set. This is
 * a function around `shuffle_in_place` that adds the guarantee that
 * it will not modify its input.
 *
 * @param {Array} x sample of 0 or more numbers
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @return {Array} shuffled version of input
 * @example
 * var shuffled = shuffle([1, 2, 3, 4]);
 * shuffled; // = [2, 3, 1, 4] or any other random permutation
 */
function shuffle$1 /*::<T>*/(x /*:Array<T>*/, randomSource /*:Function*/) {
  // slice the original array so that it is not modified
  var sample = x.slice();

  // and then shuffle that shallow-copied array, in place
  return shuffle_in_place(sample.slice(), randomSource);
}

var shuffle_1 = shuffle$1;

/* @flow */



/**
 * Create a [simple random sample](http://en.wikipedia.org/wiki/Simple_random_sample)
 * from a given array of `n` elements.
 *
 * The sampled values will be in any order, not necessarily the order
 * they appear in the input.
 *
 * @param {Array<any>} x input array. can contain any type
 * @param {number} n count of how many elements to take
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @return {Array} subset of n elements in original array
 * @example
 * var values = [1, 2, 4, 5, 6, 7, 8, 9];
 * sample(values, 3); // returns 3 random values, like [2, 5, 8];
 */
function sample /*:: <T> */(x /*: Array<T> */
, n /*: number */
, randomSource /*: Function */) /*: Array<T> */{
  // shuffle the original array using a fisher-yates shuffle
  var shuffled = shuffle_1(x, randomSource);

  // and then return a subset of it - the first `n` elements.
  return shuffled.slice(0, n);
}

var sample_1 = sample;

/* @flow */

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

function uniqueCountSorted(x /*: Array<any>*/) /*: number */{
    var uniqueValueCount = 0,
        lastSeenValue;
    for (var i = 0; i < x.length; i++) {
        if (i === 0 || x[i] !== lastSeenValue) {
            lastSeenValue = x[i];
            uniqueValueCount++;
        }
    }
    return uniqueValueCount;
}

var unique_count_sorted = uniqueCountSorted;

/* @flow */



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
    var sji; // s(j, i)
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

    var sji;
    var sjlowi;
    var ssqjlow;
    var ssqj;
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
    var iMin;
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
function ckmeans(x /*: Array<number> */, nClusters /*: number */) /*: Array<Array<number>> */{

    if (nClusters > x.length) {
        throw new Error('cannot generate more classes than there are data values');
    }

    var sorted = numeric_sort(x),

    // we'll use this as the maximum number of clusters
    uniqueCount = unique_count_sorted(sorted);

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
}

var ckmeans_1 = ckmeans;

/* @flow */



/**
 * Given an array of x, this will find the extent of the
 * x and return an array of breaks that can be used
 * to categorize the x into a number of classes. The
 * returned array will always be 1 longer than the number of
 * classes because it includes the minimum value.
 *
 * @param {Array<number>} x an array of number values
 * @param {number} nClasses number of desired classes
 * @returns {Array<number>} array of class break positions
 * @example
 * equalIntervalBreaks([1, 2, 3, 4, 5, 6], 4); //= [1, 2.25, 3.5, 4.75, 6]
 */
function equalIntervalBreaks(x /*: Array<number> */, nClasses /*:number*/) /*: Array<number> */{

    if (x.length < 2) {
        return x;
    }

    var theMin = min_1(x),
        theMax = max_1(x);

    // the first break will always be the minimum value
    // in the xset
    var breaks = [theMin];

    // The size of each break is the full range of the x
    // divided by the number of classes requested
    var breakSize = (theMax - theMin) / nClasses;

    // In the case of nClasses = 1, this loop won't run
    // and the returned breaks will be [min, max]
    for (var i = 1; i < nClasses; i++) {
        breaks.push(breaks[0] + breakSize * i);
    }

    // the last break will always be the
    // maximum.
    breaks.push(theMax);

    return breaks;
}

var equal_interval_breaks = equalIntervalBreaks;

/* @flow */



/**
 * [Sample covariance](https://en.wikipedia.org/wiki/Sample_mean_and_sampleCovariance) of two datasets:
 * how much do the two datasets move together?
 * x and y are two datasets, represented as arrays of numbers.
 *
 * @param {Array<number>} x a sample of two or more data points
 * @param {Array<number>} y a sample of two or more data points
 * @throws {Error} if x and y do not have equal lengths
 * @throws {Error} if x or y have length of one or less
 * @returns {number} sample covariance
 * @example
 * sampleCovariance([1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1]); // => -3.5
 */
function sampleCovariance(x /*:Array<number>*/, y /*:Array<number>*/) /*:number*/{

    // The two datasets must have the same length which must be more than 1
    if (x.length !== y.length) {
        throw new Error('sampleCovariance requires samples with equal lengths');
    }

    if (x.length < 2) {
        throw new Error('sampleCovariance requires at least two data points in each sample');
    }

    // determine the mean of each dataset so that we can judge each
    // value of the dataset fairly as the difference from the mean. this
    // way, if one dataset is [1, 2, 3] and [2, 3, 4], their covariance
    // does not suffer because of the difference in absolute values
    var xmean = mean_1(x),
        ymean = mean_1(y),
        sum = 0;

    // for each pair of values, the covariance increases when their
    // difference from the mean is associated - if both are well above
    // or if both are well below
    // the mean, the covariance increases significantly.
    for (var i = 0; i < x.length; i++) {
        sum += (x[i] - xmean) * (y[i] - ymean);
    }

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // the covariance is weighted by the length of the datasets.
    return sum / besselsCorrection;
}

var sample_covariance = sampleCovariance;

/* @flow */



/**
 * The [sample variance](https://en.wikipedia.org/wiki/Variance#Sample_variance)
 * is the sum of squared deviations from the mean. The sample variance
 * is distinguished from the variance by the usage of [Bessel's Correction](https://en.wikipedia.org/wiki/Bessel's_correction):
 * instead of dividing the sum of squared deviations by the length of the input,
 * it is divided by the length minus one. This corrects the bias in estimating
 * a value from a set that you don't know if full.
 *
 * References:
 * * [Wolfram MathWorld on Sample Variance](http://mathworld.wolfram.com/SampleVariance.html)
 *
 * @param {Array<number>} x a sample of two or more data points
 * @throws {Error} if the length of x is less than 2
 * @return {number} sample variance
 * @example
 * sampleVariance([1, 2, 3, 4, 5]); // => 2.5
 */
function sampleVariance(x /*: Array<number> */) /*:number*/{
    // The variance of no numbers is null
    if (x.length < 2) {
        throw new Error('sampleVariance requires at least two data points');
    }

    var sumSquaredDeviationsValue = sum_nth_power_deviations(x, 2);

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // Find the mean value of that list
    return sumSquaredDeviationsValue / besselsCorrection;
}

var sample_variance = sampleVariance;

/* @flow */



/**
 * The [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
 * is the square root of the variance.
 *
 * @param {Array<number>} x input array
 * @returns {number} sample standard deviation
 * @example
 * sampleStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9]).toFixed(2);
 * // => '2.14'
 */
function sampleStandardDeviation(x /*:Array<number>*/) /*:number*/{
  // The standard deviation of no numbers is null
  var sampleVarianceX = sample_variance(x);
  return Math.sqrt(sampleVarianceX);
}

var sample_standard_deviation = sampleStandardDeviation;

/* @flow */




/**
 * The [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence) is
 * a measure of how correlated two datasets are, between -1 and 1
 *
 * @param {Array<number>} x first input
 * @param {Array<number>} y second input
 * @returns {number} sample correlation
 * @example
 * sampleCorrelation([1, 2, 3, 4, 5, 6], [2, 2, 3, 4, 5, 60]).toFixed(2);
 * // => '0.69'
 */
function sampleCorrelation(x /*: Array<number> */, y /*: Array<number> */) /*:number*/{
    var cov = sample_covariance(x, y),
        xstd = sample_standard_deviation(x),
        ystd = sample_standard_deviation(y);

    return cov / xstd / ystd;
}

var sample_correlation = sampleCorrelation;

/* @flow */



/**
 * [Skewness](http://en.wikipedia.org/wiki/Skewness) is
 * a measure of the extent to which a probability distribution of a
 * real-valued random variable "leans" to one side of the mean.
 * The skewness value can be positive or negative, or even undefined.
 *
 * Implementation is based on the adjusted Fisher-Pearson standardized
 * moment coefficient, which is the version found in Excel and several
 * statistical packages including Minitab, SAS and SPSS.
 *
 * @since 4.1.0
 * @param {Array<number>} x a sample of 3 or more data points
 * @returns {number} sample skewness
 * @throws {Error} if x has length less than 3
 * @example
 * sampleSkewness([2, 4, 6, 3, 1]); // => 0.590128656384365
 */
function sampleSkewness(x /*: Array<number> */) /*:number*/{

    if (x.length < 3) {
        throw new Error('sampleSkewness requires at least three data points');
    }

    var meanValue = mean_1(x);
    var tempValue;
    var sumSquaredDeviations = 0;
    var sumCubedDeviations = 0;

    for (var i = 0; i < x.length; i++) {
        tempValue = x[i] - meanValue;
        sumSquaredDeviations += tempValue * tempValue;
        sumCubedDeviations += tempValue * tempValue * tempValue;
    }

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    var besselsCorrection = x.length - 1;

    // Find the mean value of that list
    var theSampleStandardDeviation = Math.sqrt(sumSquaredDeviations / besselsCorrection);

    var n = x.length,
        cubedS = Math.pow(theSampleStandardDeviation, 3);

    return n * sumCubedDeviations / ((n - 1) * (n - 2) * cubedS);
}

var sample_skewness = sampleSkewness;

/* @flow */



/**
 * [Kurtosis](http://en.wikipedia.org/wiki/Kurtosis) is
 * a measure of the heaviness of a distribution's tails relative to its
 * variance. The kurtosis value can be positive or negative, or even undefined.
 *
 * Implementation is based on Fisher's excess kurtosis definition and uses 
 * unbiased moment estimators. This is the version found in Excel and available 
 * in several statistical packages, including SAS and SciPy.
 *
 * @param {Array<number>} x a sample of 4 or more data points
 * @returns {number} sample kurtosis
 * @throws {Error} if x has length less than 4
 * @example
 * sampleKurtosis([1, 2, 2, 3, 5]); // => 1.4555765595463122
 */
function sampleKurtosis(x /*: Array<number> */) /*:number*/{

    var n = x.length;

    if (n < 4) {
        throw new Error('sampleKurtosis requires at least four data points');
    }

    var meanValue = mean_1(x);
    var tempValue;
    var secondCentralMoment = 0;
    var fourthCentralMoment = 0;

    for (var i = 0; i < n; i++) {
        tempValue = x[i] - meanValue;
        secondCentralMoment += tempValue * tempValue;
        fourthCentralMoment += tempValue * tempValue * tempValue * tempValue;
    }

    return (n - 1) / ((n - 2) * (n - 3)) * (n * (n + 1) * fourthCentralMoment / (secondCentralMoment * secondCentralMoment) - 3 * (n - 1));
}

var sample_kurtosis = sampleKurtosis;

/* @flow */

/**
 * Implementation of [Heap's Algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm)
 * for generating permutations.
 *
 * @param {Array} elements any type of data
 * @returns {Array<Array>} array of permutations
 */

function permutationsHeap /*:: <T> */(elements /*: Array<T> */) /*: Array<Array<T>> */{
    var indexes = new Array(elements.length);
    var permutations = [elements.slice()];

    for (var i = 0; i < elements.length; i++) {
        indexes[i] = 0;
    }

    for (i = 0; i < elements.length;) {
        if (indexes[i] < i) {

            // At odd indexes, swap from indexes[i] instead
            // of from the beginning of the array
            var swapFrom = 0;
            if (i % 2 !== 0) {
                swapFrom = indexes[i];
            }

            // swap between swapFrom and i, using
            // a temporary variable as storage.
            var temp = elements[swapFrom];
            elements[swapFrom] = elements[i];
            elements[i] = temp;

            permutations.push(elements.slice());
            indexes[i]++;
            i = 0;
        } else {
            indexes[i] = 0;
            i++;
        }
    }

    return permutations;
}

var permutations_heap = permutationsHeap;

/* @flow */
/**
 * Implementation of Combinations
 * Combinations are unique subsets of a collection - in this case, k x from a collection at a time.
 * https://en.wikipedia.org/wiki/Combination
 * @param {Array} x any type of data
 * @param {int} k the number of objects in each group (without replacement)
 * @returns {Array<Array>} array of permutations
 * @example
 * combinations([1, 2, 3], 2); // => [[1,2], [1,3], [2,3]]
 */

function combinations(x /*: Array<any> */, k /*: number */) {
    var i;
    var subI;
    var combinationList = [];
    var subsetCombinations;
    var next;

    for (i = 0; i < x.length; i++) {
        if (k === 1) {
            combinationList.push([x[i]]);
        } else {
            subsetCombinations = combinations(x.slice(i + 1, x.length), k - 1);
            for (subI = 0; subI < subsetCombinations.length; subI++) {
                next = subsetCombinations[subI];
                next.unshift(x[i]);
                combinationList.push(next);
            }
        }
    }
    return combinationList;
}

var combinations_1 = combinations;

/* @flow */
/**
 * Implementation of [Combinations](https://en.wikipedia.org/wiki/Combination) with replacement
 * Combinations are unique subsets of a collection - in this case, k x from a collection at a time.
 * 'With replacement' means that a given element can be chosen multiple times.
 * Unlike permutation, order doesn't matter for combinations.
 * 
 * @param {Array} x any type of data
 * @param {int} k the number of objects in each group (without replacement)
 * @returns {Array<Array>} array of permutations
 * @example
 * combinationsReplacement([1, 2], 2); // => [[1, 1], [1, 2], [2, 2]]
 */

function combinationsReplacement(x /*: Array<any> */
, k /*: number */) {

    var combinationList = [];

    for (var i = 0; i < x.length; i++) {
        if (k === 1) {
            // If we're requested to find only one element, we don't need
            // to recurse: just push `x[i]` onto the list of combinations.
            combinationList.push([x[i]]);
        } else {
            // Otherwise, recursively find combinations, given `k - 1`. Note that
            // we request `k - 1`, so if you were looking for k=3 combinations, we're
            // requesting k=2. This -1 gets reversed in the for loop right after this
            // code, since we concatenate `x[i]` onto the selected combinations,
            // bringing `k` back up to your requested level.
            // This recursion may go many levels deep, since it only stops once
            // k=1.
            var subsetCombinations = combinationsReplacement(x.slice(i, x.length), k - 1);

            for (var j = 0; j < subsetCombinations.length; j++) {
                combinationList.push([x[i]].concat(subsetCombinations[j]));
            }
        }
    }

    return combinationList;
}

var combinations_replacement = combinationsReplacement;

/* @flow */

/**
 * When adding a new value to a list, one does not have to necessary
 * recompute the mean of the list in linear time. They can instead use
 * this function to compute the new mean by providing the current mean,
 * the number of elements in the list that produced it and the new
 * value to add.
 *
 * @since 2.5.0
 * @param {number} mean current mean
 * @param {number} n number of items in the list
 * @param {number} newValue the added value
 * @returns {number} the new mean
 *
 * @example
 * addToMean(14, 5, 53); // => 20.5
 */

function addToMean(mean /*: number*/, n /*: number */, newValue /*: number */) /*: number */{
  return mean + (newValue - mean) / (n + 1);
}

var add_to_mean = addToMean;

/* @flow */

/**
 * When combining two lists of values for which one already knows the means,
 * one does not have to necessary recompute the mean of the combined lists in
 * linear time. They can instead use this function to compute the combined
 * mean by providing the mean & number of values of the first list and the mean
 * & number of values of the second list.
 *
 * @since 3.0.0
 * @param {number} mean1 mean of the first list
 * @param {number} n1 number of items in the first list
 * @param {number} mean2 mean of the second list
 * @param {number} n2 number of items in the second list
 * @returns {number} the combined mean
 *
 * @example
 * combineMeans(5, 3, 4, 3); // => 4.5
 */

function combineMeans(mean1 /*: number*/, n1 /*: number */, mean2 /*: number*/, n2 /*: number */) /*: number */{
  return (mean1 * n1 + mean2 * n2) / (n1 + n2);
}

var combine_means = combineMeans;

/* @flow */



/**
 * When combining two lists of values for which one already knows the variances,
 * one does not have to necessary recompute the variance of the combined lists
 * in linear time. They can instead use this function to compute the combined
 * variance by providing the variance, mean & number of values of the first list
 * and the variance, mean & number of values of the second list.
 *
 * @since 3.0.0
 * @param {number} variance1 variance of the first list
 * @param {number} mean1 mean of the first list
 * @param {number} n1 number of items in the first list
 * @param {number} variance2 variance of the second list
 * @param {number} mean2 mean of the second list
 * @param {number} n2 number of items in the second list
 * @returns {number} the combined mean
 *
 * @example
 * combineVariances(14 / 3, 5, 3, 8 / 3, 4, 3); // => 47 / 12
 */
function combineVariances(variance1 /*: number*/
, mean1 /*: number*/
, n1 /*: number */
, variance2 /*: number*/
, mean2 /*: number*/
, n2 /*: number */) /*: number */{

  var newMean = combine_means(mean1, n1, mean2, n2);

  return (n1 * (variance1 + Math.pow(mean1 - newMean, 2)) + n2 * (variance2 + Math.pow(mean2 - newMean, 2))) / (n1 + n2);
}

var combine_variances = combineVariances;

/* @flow */

/**
 * The [Geometric Mean](https://en.wikipedia.org/wiki/Geometric_mean) is
 * a mean function that is more useful for numbers in different
 * ranges.
 *
 * This is the nth root of the input numbers multiplied by each other.
 *
 * The geometric mean is often useful for
 * **[proportional growth](https://en.wikipedia.org/wiki/Geometric_mean#Proportional_growth)**: given
 * growth rates for multiple years, like _80%, 16.66% and 42.85%_, a simple
 * mean will incorrectly estimate an average growth rate, whereas a geometric
 * mean will correctly estimate a growth rate that, over those years,
 * will yield the same end value.
 *
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x sample of one or more data points
 * @returns {number} geometric mean
 * @throws {Error} if x is empty
 * @throws {Error} if x contains a negative number
 * @example
 * var growthRates = [1.80, 1.166666, 1.428571];
 * var averageGrowth = geometricMean(growthRates);
 * var averageGrowthRates = [averageGrowth, averageGrowth, averageGrowth];
 * var startingValue = 10;
 * var startingValueMean = 10;
 * growthRates.forEach(function(rate) {
 *   startingValue *= rate;
 * });
 * averageGrowthRates.forEach(function(rate) {
 *   startingValueMean *= rate;
 * });
 * startingValueMean === startingValue;
 */

function geometricMean(x /*: Array<number> */) {
    // The mean of no numbers is null
    if (x.length === 0) {
        throw new Error('geometricMean requires at least one data point');
    }

    // the starting value.
    var value = 1;

    for (var i = 0; i < x.length; i++) {
        // the geometric mean is only valid for positive numbers
        if (x[i] <= 0) {
            throw new Error('geometricMean requires only positive numbers as input');
        }

        // repeatedly multiply the value by each number
        value *= x[i];
    }

    return Math.pow(value, 1 / x.length);
}

var geometric_mean = geometricMean;

/* @flow */

/**
 * The [Harmonic Mean](https://en.wikipedia.org/wiki/Harmonic_mean) is
 * a mean function typically used to find the average of rates.
 * This mean is calculated by taking the reciprocal of the arithmetic mean
 * of the reciprocals of the input numbers.
 *
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * This runs on `O(n)`, linear time in respect to the array.
 *
 * @param {Array<number>} x sample of one or more data points
 * @returns {number} harmonic mean
 * @throws {Error} if x is empty
 * @throws {Error} if x contains a negative number
 * @example
 * harmonicMean([2, 3]).toFixed(2) // => '2.40'
 */

function harmonicMean(x /*: Array<number> */) {
    // The mean of no numbers is null
    if (x.length === 0) {
        throw new Error('harmonicMean requires at least one data point');
    }

    var reciprocalSum = 0;

    for (var i = 0; i < x.length; i++) {
        // the harmonic mean is only valid for positive numbers
        if (x[i] <= 0) {
            throw new Error('harmonicMean requires only positive numbers as input');
        }

        reciprocalSum += 1 / x[i];
    }

    // divide n by the the reciprocal sum
    return x.length / reciprocalSum;
}

var harmonic_mean = harmonicMean;

/* @flow */



/**
 * The [median](http://en.wikipedia.org/wiki/Median) is
 * the middle number of a list. This is often a good indicator of 'the middle'
 * when there are outliers that skew the `mean()` value.
 * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
 * a method of finding a typical or central value of a set of numbers.
 *
 * The median isn't necessarily one of the elements in the list: the value
 * can be the average of two elements if the list has an even length
 * and the two central values are different.
 *
 * @param {Array<number>} sorted input
 * @returns {number} median value
 * @example
 * medianSorted([10, 2, 5, 100, 2, 1]); // => 52.5
 */
function medianSorted(sorted /*: Array<number> */) /*:number*/{
  return quantile_sorted(sorted, 0.5);
}

var median_sorted = medianSorted;

/* @flow */

/**
 * When removing a value from a list, one does not have to necessary
 * recompute the mean of the list in linear time. They can instead use
 * this function to compute the new mean by providing the current mean,
 * the number of elements in the list that produced it and the value to remove.
 *
 * @since 3.0.0
 * @param {number} mean current mean
 * @param {number} n number of items in the list
 * @param {number} value the value to remove
 * @returns {number} the new mean
 *
 * @example
 * subtractFromMean(20.5, 6, 53); // => 14
 */

function subtractFromMean(mean /*: number*/, n /*: number */, value /*: number */) /*: number */{
  return (mean * n - value) / (n - 1);
}

var subtract_from_mean = subtractFromMean;

/* @flow */

/**
 * The Root Mean Square (RMS) is
 * a mean function used as a measure of the magnitude of a set
 * of numbers, regardless of their sign.
 * This is the square root of the mean of the squares of the
 * input numbers.
 * This runs on `O(n)`, linear time in respect to the array
 *
 * @param {Array<number>} x a sample of one or more data points
 * @returns {number} root mean square
 * @throws {Error} if x is empty
 * @example
 * rootMeanSquare([-1, 1, -1, 1]); // => 1
 */

function rootMeanSquare(x /*: Array<number> */) /*:number*/{
    if (x.length === 0) {
        throw new Error('rootMeanSquare requires at least one data point');
    }

    var sumOfSquares = 0;
    for (var i = 0; i < x.length; i++) {
        sumOfSquares += Math.pow(x[i], 2);
    }

    return Math.sqrt(sumOfSquares / x.length);
}

var root_mean_square = rootMeanSquare;

/* @flow */




/**
 * This is to compute [a one-sample t-test](https://en.wikipedia.org/wiki/Student%27s_t-test#One-sample_t-test), comparing the mean
 * of a sample to a known value, x.
 *
 * in this case, we're trying to determine whether the
 * population mean is equal to the value that we know, which is `x`
 * here. usually the results here are used to look up a
 * [p-value](http://en.wikipedia.org/wiki/P-value), which, for
 * a certain level of significance, will let you determine that the
 * null hypothesis can or cannot be rejected.
 *
 * @param {Array<number>} x sample of one or more numbers
 * @param {number} expectedValue expected value of the population mean
 * @returns {number} value
 * @example
 * tTest([1, 2, 3, 4, 5, 6], 3.385).toFixed(2); // => '0.16'
 */
function tTest(x /*: Array<number> */, expectedValue /*: number */) /*:number*/{
  // The mean of the sample
  var sampleMean = mean_1(x);

  // The standard deviation of the sample
  var sd = standard_deviation(x);

  // Square root the length of the sample
  var rootN = Math.sqrt(x.length);

  // returning the t value
  return (sampleMean - expectedValue) / (sd / rootN);
}

var t_test = tTest;

/* @flow */




/**
 * This is to compute [two sample t-test](http://en.wikipedia.org/wiki/Student's_t-test).
 * Tests whether "mean(X)-mean(Y) = difference", (
 * in the most common case, we often have `difference == 0` to test if two samples
 * are likely to be taken from populations with the same mean value) with
 * no prior knowledge on standard deviations of both samples
 * other than the fact that they have the same standard deviation.
 *
 * Usually the results here are used to look up a
 * [p-value](http://en.wikipedia.org/wiki/P-value), which, for
 * a certain level of significance, will let you determine that the
 * null hypothesis can or cannot be rejected.
 *
 * `diff` can be omitted if it equals 0.
 *
 * [This is used to confirm or deny](http://www.monarchlab.org/Lab/Research/Stats/2SampleT.aspx)
 * a null hypothesis that the two populations that have been sampled into
 * `sampleX` and `sampleY` are equal to each other.
 *
 * @param {Array<number>} sampleX a sample as an array of numbers
 * @param {Array<number>} sampleY a sample as an array of numbers
 * @param {number} [difference=0]
 * @returns {number} test result
 * @example
 * ss.tTestTwoSample([1, 2, 3, 4], [3, 4, 5, 6], 0); //= -2.1908902300206643
 */
function tTestTwoSample(sampleX /*: Array<number> */
, sampleY /*: Array<number> */
, difference /*: number */) {
    var n = sampleX.length,
        m = sampleY.length;

    // If either sample doesn't actually have any values, we can't
    // compute this at all, so we return `null`.
    if (!n || !m) {
        return null;
    }

    // default difference (mu) is zero
    if (!difference) {
        difference = 0;
    }

    var meanX = mean_1(sampleX),
        meanY = mean_1(sampleY),
        sampleVarianceX = sample_variance(sampleX),
        sampleVarianceY = sample_variance(sampleY);

    if (typeof meanX === 'number' && typeof meanY === 'number' && typeof sampleVarianceX === 'number' && typeof sampleVarianceY === 'number') {
        var weightedVariance = ((n - 1) * sampleVarianceX + (m - 1) * sampleVarianceY) / (n + m - 2);

        return (meanX - meanY - difference) / Math.sqrt(weightedVariance * (1 / n + 1 / m));
    }
}

var t_test_two_sample = tTestTwoSample;

/* @flow */

/**
 * [Bayesian Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
 *
 * This is a naïve bayesian classifier that takes
 * singly-nested objects.
 *
 * @class
 * @example
 * var bayes = new BayesianClassifier();
 * bayes.train({
 *   species: 'Cat'
 * }, 'animal');
 * var result = bayes.score({
 *   species: 'Cat'
 * })
 * // result
 * // {
 * //   animal: 1
 * // }
 */

function BayesianClassifier() {
    // The number of items that are currently
    // classified in the model
    this.totalCount = 0;
    // Every item classified in the model
    this.data = {};
}

/**
 * Train the classifier with a new item, which has a single
 * dimension of Javascript literal keys and values.
 *
 * @param {Object} item an object with singly-deep properties
 * @param {string} category the category this item belongs to
 * @return {undefined} adds the item to the classifier
 */
BayesianClassifier.prototype.train = function (item, category) {
    // If the data object doesn't have any values
    // for this category, create a new object for it.
    if (!this.data[category]) {
        this.data[category] = {};
    }

    // Iterate through each key in the item.
    for (var k in item) {
        var v = item[k];
        // Initialize the nested object `data[category][k][item[k]]`
        // with an object of keys that equal 0.
        if (this.data[category][k] === undefined) {
            this.data[category][k] = {};
        }
        if (this.data[category][k][v] === undefined) {
            this.data[category][k][v] = 0;
        }

        // And increment the key for this key/value combination.
        this.data[category][k][v]++;
    }

    // Increment the number of items classified
    this.totalCount++;
};

/**
 * Generate a score of how well this item matches all
 * possible categories based on its attributes
 *
 * @param {Object} item an item in the same format as with train
 * @returns {Object} of probabilities that this item belongs to a
 * given category.
 */
BayesianClassifier.prototype.score = function (item) {
    // Initialize an empty array of odds per category.
    var odds = {},
        category;
    // Iterate through each key in the item,
    // then iterate through each category that has been used
    // in previous calls to `.train()`
    for (var k in item) {
        var v = item[k];
        for (category in this.data) {
            // Create an empty object for storing key - value combinations
            // for this category.
            odds[category] = {};

            // If this item doesn't even have a property, it counts for nothing,
            // but if it does have the property that we're looking for from
            // the item to categorize, it counts based on how popular it is
            // versus the whole population.
            if (this.data[category][k]) {
                odds[category][k + '_' + v] = (this.data[category][k][v] || 0) / this.totalCount;
            } else {
                odds[category][k + '_' + v] = 0;
            }
        }
    }

    // Set up a new object that will contain sums of these odds by category
    var oddsSums = {};

    for (category in odds) {
        // Tally all of the odds for each category-combination pair -
        // the non-existence of a category does not add anything to the
        // score.
        oddsSums[category] = 0;
        for (var combination in odds[category]) {
            oddsSums[category] += odds[category][combination];
        }
    }

    return oddsSums;
};

var bayesian_classifier = BayesianClassifier;

/* @flow */

/**
 * This is a single-layer [Perceptron Classifier](http://en.wikipedia.org/wiki/Perceptron) that takes
 * arrays of numbers and predicts whether they should be classified
 * as either 0 or 1 (negative or positive examples).
 * @class
 * @example
 * // Create the model
 * var p = new PerceptronModel();
 * // Train the model with input with a diagonal boundary.
 * for (var i = 0; i < 5; i++) {
 *     p.train([1, 1], 1);
 *     p.train([0, 1], 0);
 *     p.train([1, 0], 0);
 *     p.train([0, 0], 0);
 * }
 * p.predict([0, 0]); // 0
 * p.predict([0, 1]); // 0
 * p.predict([1, 0]); // 0
 * p.predict([1, 1]); // 1
 */

function PerceptronModel() {
    // The weights, or coefficients of the model;
    // weights are only populated when training with data.
    this.weights = [];
    // The bias term, or intercept; it is also a weight but
    // it's stored separately for convenience as it is always
    // multiplied by one.
    this.bias = 0;
}

/**
 * **Predict**: Use an array of features with the weight array and bias
 * to predict whether an example is labeled 0 or 1.
 *
 * @param {Array<number>} features an array of features as numbers
 * @returns {number} 1 if the score is over 0, otherwise 0
 */
PerceptronModel.prototype.predict = function (features) {

    // Only predict if previously trained
    // on the same size feature array(s).
    if (features.length !== this.weights.length) {
        return null;
    }

    // Calculate the sum of features times weights,
    // with the bias added (implicitly times one).
    var score = 0;
    for (var i = 0; i < this.weights.length; i++) {
        score += this.weights[i] * features[i];
    }
    score += this.bias;

    // Classify as 1 if the score is over 0, otherwise 0.
    if (score > 0) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * **Train** the classifier with a new example, which is
 * a numeric array of features and a 0 or 1 label.
 *
 * @param {Array<number>} features an array of features as numbers
 * @param {number} label either 0 or 1
 * @returns {PerceptronModel} this
 */
PerceptronModel.prototype.train = function (features, label) {
    // Require that only labels of 0 or 1 are considered.
    if (label !== 0 && label !== 1) {
        return null;
    }
    // The length of the feature array determines
    // the length of the weight array.
    // The perceptron will continue learning as long as
    // it keeps seeing feature arrays of the same length.
    // When it sees a new data shape, it initializes.
    if (features.length !== this.weights.length) {
        this.weights = features;
        this.bias = 1;
    }
    // Make a prediction based on current weights.
    var prediction = this.predict(features);
    // Update the weights if the prediction is wrong.
    if (prediction !== label) {
        var gradient = label - prediction;
        for (var i = 0; i < this.weights.length; i++) {
            this.weights[i] += gradient * features[i];
        }
        this.bias += gradient;
    }
    return this;
};

var perceptron = PerceptronModel;

/* @flow */

/**
 * We use `ε`, epsilon, as a stopping criterion when we want to iterate
 * until we're "close enough". Epsilon is a very small number: for
 * simple statistics, that number is **0.0001**
 *
 * This is used in calculations like the binomialDistribution, in which
 * the process of finding a value is [iterative](https://en.wikipedia.org/wiki/Iterative_method):
 * it progresses until it is close enough.
 *
 * Below is an example of using epsilon in [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent),
 * where we're trying to find a local minimum of a function's derivative,
 * given by the `fDerivative` method.
 *
 * @example
 * // From calculation, we expect that the local minimum occurs at x=9/4
 * var x_old = 0;
 * // The algorithm starts at x=6
 * var x_new = 6;
 * var stepSize = 0.01;
 *
 * function fDerivative(x) {
 *   return 4 * Math.pow(x, 3) - 9 * Math.pow(x, 2);
 * }
 *
 * // The loop runs until the difference between the previous
 * // value and the current value is smaller than epsilon - a rough
 * // meaure of 'close enough'
 * while (Math.abs(x_new - x_old) > ss.epsilon) {
 *   x_old = x_new;
 *   x_new = x_old - stepSize * fDerivative(x_old);
 * }
 *
 * console.log('Local minimum occurs at', x_new);
 */

var epsilon = 0.0001;

var epsilon_1 = epsilon;

/* @flow */

/**
 * A [Factorial](https://en.wikipedia.org/wiki/Factorial), usually written n!, is the product of all positive
 * integers less than or equal to n. Often factorial is implemented
 * recursively, but this iterative approach is significantly faster
 * and simpler.
 *
 * @param {number} n input, must be an integer number 1 or greater
 * @returns {number} factorial: n!
 * @throws {Error} if n is less than 0 or not an integer
 * @example
 * factorial(5); // => 120
 */

function factorial(n /*: number */) /*: number */{

    // factorial is mathematically undefined for negative numbers
    if (n < 0) {
        throw new Error('factorial requires a non-negative value');
    }

    if (Math.floor(n) !== n) {
        throw new Error('factorial requires an integer input');
    }

    // typically you'll expand the factorial function going down, like
    // 5! = 5 * 4 * 3 * 2 * 1. This is going in the opposite direction,
    // counting from 2 up to the number in question, and since anything
    // multiplied by 1 is itself, the loop only needs to start at 2.
    var accumulator = 1;
    for (var i = 2; i <= n; i++) {
        // for each number up to and including the number `n`, multiply
        // the accumulator my that number.
        accumulator *= i;
    }
    return accumulator;
}

var factorial_1 = factorial;

/* @flow */

/**
 * The [Bernoulli distribution](http://en.wikipedia.org/wiki/Bernoulli_distribution)
 * is the probability discrete
 * distribution of a random variable which takes value 1 with success
 * probability `p` and value 0 with failure
 * probability `q` = 1 - `p`. It can be used, for example, to represent the
 * toss of a coin, where "1" is defined to mean "heads" and "0" is defined
 * to mean "tails" (or vice versa). It is
 * a special case of a Binomial Distribution
 * where `n` = 1.
 *
 * @param {number} p input value, between 0 and 1 inclusive
 * @returns {number[]} values of bernoulli distribution at this point
 * @throws {Error} if p is outside 0 and 1
 * @example
 * bernoulliDistribution(0.3); // => [0.7, 0.3]
 */

function bernoulliDistribution(p /*: number */) /*: number[] */{
    // Check that `p` is a valid probability (0 ≤ p ≤ 1)
    if (p < 0 || p > 1) {
        throw new Error('bernoulliDistribution requires probability to be between 0 and 1 inclusive');
    }

    return [1 - p, p];
}

var bernoulli_distribution = bernoulliDistribution;

/* @flow */



/**
 * The [Binomial Distribution](http://en.wikipedia.org/wiki/Binomial_distribution) is the discrete probability
 * distribution of the number of successes in a sequence of n independent yes/no experiments, each of which yields
 * success with probability `probability`. Such a success/failure experiment is also called a Bernoulli experiment or
 * Bernoulli trial; when trials = 1, the Binomial Distribution is a Bernoulli Distribution.
 *
 * @param {number} trials number of trials to simulate
 * @param {number} probability
 * @returns {number[]} output
 */
function binomialDistribution(trials /*: number */
, probability /*: number */) /*: ?number[] */{
    // Check that `p` is a valid probability (0 ≤ p ≤ 1),
    // that `n` is an integer, strictly positive.
    if (probability < 0 || probability > 1 || trials <= 0 || trials % 1 !== 0) {
        return undefined;
    }

    // We initialize `x`, the random variable, and `accumulator`, an accumulator
    // for the cumulative distribution function to 0. `distribution_functions`
    // is the object we'll return with the `probability_of_x` and the
    // `cumulativeProbability_of_x`, as well as the calculated mean &
    // variance. We iterate until the `cumulativeProbability_of_x` is
    // within `epsilon` of 1.0.
    var x = 0,
        cumulativeProbability = 0,
        cells = [],
        binomialCoefficient = 1;

    // This algorithm iterates through each potential outcome,
    // until the `cumulativeProbability` is very close to 1, at
    // which point we've defined the vast majority of outcomes
    do {
        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        cells[x] = binomialCoefficient * Math.pow(probability, x) * Math.pow(1 - probability, trials - x);
        cumulativeProbability += cells[x];
        x++;
        binomialCoefficient = binomialCoefficient * (trials - x + 1) / x;
        // when the cumulativeProbability is nearly 1, we've calculated
        // the useful range of this distribution
    } while (cumulativeProbability < 1 - epsilon_1);

    return cells;
}

var binomial_distribution = binomialDistribution;

/* @flow */



/**
 * The [Poisson Distribution](http://en.wikipedia.org/wiki/Poisson_distribution)
 * is a discrete probability distribution that expresses the probability
 * of a given number of events occurring in a fixed interval of time
 * and/or space if these events occur with a known average rate and
 * independently of the time since the last event.
 *
 * The Poisson Distribution is characterized by the strictly positive
 * mean arrival or occurrence rate, `λ`.
 *
 * @param {number} lambda location poisson distribution
 * @returns {number[]} values of poisson distribution at that point
 */
function poissonDistribution(lambda /*: number */) /*: ?number[] */{
    // Check that lambda is strictly positive
    if (lambda <= 0) {
        return undefined;
    }

    // our current place in the distribution
    var x = 0,

    // and we keep track of the current cumulative probability, in
    // order to know when to stop calculating chances.
    cumulativeProbability = 0,

    // the calculated cells to be returned
    cells = [],
        factorialX = 1;

    // This algorithm iterates through each potential outcome,
    // until the `cumulativeProbability` is very close to 1, at
    // which point we've defined the vast majority of outcomes
    do {
        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        cells[x] = Math.exp(-lambda) * Math.pow(lambda, x) / factorialX;
        cumulativeProbability += cells[x];
        x++;
        factorialX *= x;
        // when the cumulativeProbability is nearly 1, we've calculated
        // the useful range of this distribution
    } while (cumulativeProbability < 1 - epsilon_1);

    return cells;
}

var poisson_distribution = poissonDistribution;

/* @flow */

/**
 * **Percentage Points of the χ2 (Chi-Squared) Distribution**
 *
 * The [χ2 (Chi-Squared) Distribution](http://en.wikipedia.org/wiki/Chi-squared_distribution) is used in the common
 * chi-squared tests for goodness of fit of an observed distribution to a theoretical one, the independence of two
 * criteria of classification of qualitative data, and in confidence interval estimation for a population standard
 * deviation of a normal distribution from a sample standard deviation.
 *
 * Values from Appendix 1, Table III of William W. Hines & Douglas C. Montgomery, "Probability and Statistics in
 * Engineering and Management Science", Wiley (1980).
 */

var chiSquaredDistributionTable = {
    '1': {
        '0.995': 0,
        '0.99': 0,
        '0.975': 0,
        '0.95': 0,
        '0.9': 0.02,
        '0.5': 0.45,
        '0.1': 2.71,
        '0.05': 3.84,
        '0.025': 5.02,
        '0.01': 6.63,
        '0.005': 7.88
    },
    '2': {
        '0.995': 0.01,
        '0.99': 0.02,
        '0.975': 0.05,
        '0.95': 0.1,
        '0.9': 0.21,
        '0.5': 1.39,
        '0.1': 4.61,
        '0.05': 5.99,
        '0.025': 7.38,
        '0.01': 9.21,
        '0.005': 10.6
    },
    '3': {
        '0.995': 0.07,
        '0.99': 0.11,
        '0.975': 0.22,
        '0.95': 0.35,
        '0.9': 0.58,
        '0.5': 2.37,
        '0.1': 6.25,
        '0.05': 7.81,
        '0.025': 9.35,
        '0.01': 11.34,
        '0.005': 12.84
    },
    '4': {
        '0.995': 0.21,
        '0.99': 0.3,
        '0.975': 0.48,
        '0.95': 0.71,
        '0.9': 1.06,
        '0.5': 3.36,
        '0.1': 7.78,
        '0.05': 9.49,
        '0.025': 11.14,
        '0.01': 13.28,
        '0.005': 14.86
    },
    '5': {
        '0.995': 0.41,
        '0.99': 0.55,
        '0.975': 0.83,
        '0.95': 1.15,
        '0.9': 1.61,
        '0.5': 4.35,
        '0.1': 9.24,
        '0.05': 11.07,
        '0.025': 12.83,
        '0.01': 15.09,
        '0.005': 16.75
    },
    '6': {
        '0.995': 0.68,
        '0.99': 0.87,
        '0.975': 1.24,
        '0.95': 1.64,
        '0.9': 2.2,
        '0.5': 5.35,
        '0.1': 10.65,
        '0.05': 12.59,
        '0.025': 14.45,
        '0.01': 16.81,
        '0.005': 18.55
    },
    '7': {
        '0.995': 0.99,
        '0.99': 1.25,
        '0.975': 1.69,
        '0.95': 2.17,
        '0.9': 2.83,
        '0.5': 6.35,
        '0.1': 12.02,
        '0.05': 14.07,
        '0.025': 16.01,
        '0.01': 18.48,
        '0.005': 20.28
    },
    '8': {
        '0.995': 1.34,
        '0.99': 1.65,
        '0.975': 2.18,
        '0.95': 2.73,
        '0.9': 3.49,
        '0.5': 7.34,
        '0.1': 13.36,
        '0.05': 15.51,
        '0.025': 17.53,
        '0.01': 20.09,
        '0.005': 21.96
    },
    '9': {
        '0.995': 1.73,
        '0.99': 2.09,
        '0.975': 2.7,
        '0.95': 3.33,
        '0.9': 4.17,
        '0.5': 8.34,
        '0.1': 14.68,
        '0.05': 16.92,
        '0.025': 19.02,
        '0.01': 21.67,
        '0.005': 23.59
    },
    '10': {
        '0.995': 2.16,
        '0.99': 2.56,
        '0.975': 3.25,
        '0.95': 3.94,
        '0.9': 4.87,
        '0.5': 9.34,
        '0.1': 15.99,
        '0.05': 18.31,
        '0.025': 20.48,
        '0.01': 23.21,
        '0.005': 25.19
    },
    '11': {
        '0.995': 2.6,
        '0.99': 3.05,
        '0.975': 3.82,
        '0.95': 4.57,
        '0.9': 5.58,
        '0.5': 10.34,
        '0.1': 17.28,
        '0.05': 19.68,
        '0.025': 21.92,
        '0.01': 24.72,
        '0.005': 26.76
    },
    '12': {
        '0.995': 3.07,
        '0.99': 3.57,
        '0.975': 4.4,
        '0.95': 5.23,
        '0.9': 6.3,
        '0.5': 11.34,
        '0.1': 18.55,
        '0.05': 21.03,
        '0.025': 23.34,
        '0.01': 26.22,
        '0.005': 28.3
    },
    '13': {
        '0.995': 3.57,
        '0.99': 4.11,
        '0.975': 5.01,
        '0.95': 5.89,
        '0.9': 7.04,
        '0.5': 12.34,
        '0.1': 19.81,
        '0.05': 22.36,
        '0.025': 24.74,
        '0.01': 27.69,
        '0.005': 29.82
    },
    '14': {
        '0.995': 4.07,
        '0.99': 4.66,
        '0.975': 5.63,
        '0.95': 6.57,
        '0.9': 7.79,
        '0.5': 13.34,
        '0.1': 21.06,
        '0.05': 23.68,
        '0.025': 26.12,
        '0.01': 29.14,
        '0.005': 31.32
    },
    '15': {
        '0.995': 4.6,
        '0.99': 5.23,
        '0.975': 6.27,
        '0.95': 7.26,
        '0.9': 8.55,
        '0.5': 14.34,
        '0.1': 22.31,
        '0.05': 25,
        '0.025': 27.49,
        '0.01': 30.58,
        '0.005': 32.8
    },
    '16': {
        '0.995': 5.14,
        '0.99': 5.81,
        '0.975': 6.91,
        '0.95': 7.96,
        '0.9': 9.31,
        '0.5': 15.34,
        '0.1': 23.54,
        '0.05': 26.3,
        '0.025': 28.85,
        '0.01': 32,
        '0.005': 34.27
    },
    '17': {
        '0.995': 5.7,
        '0.99': 6.41,
        '0.975': 7.56,
        '0.95': 8.67,
        '0.9': 10.09,
        '0.5': 16.34,
        '0.1': 24.77,
        '0.05': 27.59,
        '0.025': 30.19,
        '0.01': 33.41,
        '0.005': 35.72
    },
    '18': {
        '0.995': 6.26,
        '0.99': 7.01,
        '0.975': 8.23,
        '0.95': 9.39,
        '0.9': 10.87,
        '0.5': 17.34,
        '0.1': 25.99,
        '0.05': 28.87,
        '0.025': 31.53,
        '0.01': 34.81,
        '0.005': 37.16
    },
    '19': {
        '0.995': 6.84,
        '0.99': 7.63,
        '0.975': 8.91,
        '0.95': 10.12,
        '0.9': 11.65,
        '0.5': 18.34,
        '0.1': 27.2,
        '0.05': 30.14,
        '0.025': 32.85,
        '0.01': 36.19,
        '0.005': 38.58
    },
    '20': {
        '0.995': 7.43,
        '0.99': 8.26,
        '0.975': 9.59,
        '0.95': 10.85,
        '0.9': 12.44,
        '0.5': 19.34,
        '0.1': 28.41,
        '0.05': 31.41,
        '0.025': 34.17,
        '0.01': 37.57,
        '0.005': 40
    },
    '21': {
        '0.995': 8.03,
        '0.99': 8.9,
        '0.975': 10.28,
        '0.95': 11.59,
        '0.9': 13.24,
        '0.5': 20.34,
        '0.1': 29.62,
        '0.05': 32.67,
        '0.025': 35.48,
        '0.01': 38.93,
        '0.005': 41.4
    },
    '22': {
        '0.995': 8.64,
        '0.99': 9.54,
        '0.975': 10.98,
        '0.95': 12.34,
        '0.9': 14.04,
        '0.5': 21.34,
        '0.1': 30.81,
        '0.05': 33.92,
        '0.025': 36.78,
        '0.01': 40.29,
        '0.005': 42.8
    },
    '23': {
        '0.995': 9.26,
        '0.99': 10.2,
        '0.975': 11.69,
        '0.95': 13.09,
        '0.9': 14.85,
        '0.5': 22.34,
        '0.1': 32.01,
        '0.05': 35.17,
        '0.025': 38.08,
        '0.01': 41.64,
        '0.005': 44.18
    },
    '24': {
        '0.995': 9.89,
        '0.99': 10.86,
        '0.975': 12.4,
        '0.95': 13.85,
        '0.9': 15.66,
        '0.5': 23.34,
        '0.1': 33.2,
        '0.05': 36.42,
        '0.025': 39.36,
        '0.01': 42.98,
        '0.005': 45.56
    },
    '25': {
        '0.995': 10.52,
        '0.99': 11.52,
        '0.975': 13.12,
        '0.95': 14.61,
        '0.9': 16.47,
        '0.5': 24.34,
        '0.1': 34.28,
        '0.05': 37.65,
        '0.025': 40.65,
        '0.01': 44.31,
        '0.005': 46.93
    },
    '26': {
        '0.995': 11.16,
        '0.99': 12.2,
        '0.975': 13.84,
        '0.95': 15.38,
        '0.9': 17.29,
        '0.5': 25.34,
        '0.1': 35.56,
        '0.05': 38.89,
        '0.025': 41.92,
        '0.01': 45.64,
        '0.005': 48.29
    },
    '27': {
        '0.995': 11.81,
        '0.99': 12.88,
        '0.975': 14.57,
        '0.95': 16.15,
        '0.9': 18.11,
        '0.5': 26.34,
        '0.1': 36.74,
        '0.05': 40.11,
        '0.025': 43.19,
        '0.01': 46.96,
        '0.005': 49.65
    },
    '28': {
        '0.995': 12.46,
        '0.99': 13.57,
        '0.975': 15.31,
        '0.95': 16.93,
        '0.9': 18.94,
        '0.5': 27.34,
        '0.1': 37.92,
        '0.05': 41.34,
        '0.025': 44.46,
        '0.01': 48.28,
        '0.005': 50.99
    },
    '29': {
        '0.995': 13.12,
        '0.99': 14.26,
        '0.975': 16.05,
        '0.95': 17.71,
        '0.9': 19.77,
        '0.5': 28.34,
        '0.1': 39.09,
        '0.05': 42.56,
        '0.025': 45.72,
        '0.01': 49.59,
        '0.005': 52.34
    },
    '30': {
        '0.995': 13.79,
        '0.99': 14.95,
        '0.975': 16.79,
        '0.95': 18.49,
        '0.9': 20.6,
        '0.5': 29.34,
        '0.1': 40.26,
        '0.05': 43.77,
        '0.025': 46.98,
        '0.01': 50.89,
        '0.005': 53.67
    },
    '40': {
        '0.995': 20.71,
        '0.99': 22.16,
        '0.975': 24.43,
        '0.95': 26.51,
        '0.9': 29.05,
        '0.5': 39.34,
        '0.1': 51.81,
        '0.05': 55.76,
        '0.025': 59.34,
        '0.01': 63.69,
        '0.005': 66.77
    },
    '50': {
        '0.995': 27.99,
        '0.99': 29.71,
        '0.975': 32.36,
        '0.95': 34.76,
        '0.9': 37.69,
        '0.5': 49.33,
        '0.1': 63.17,
        '0.05': 67.5,
        '0.025': 71.42,
        '0.01': 76.15,
        '0.005': 79.49
    },
    '60': {
        '0.995': 35.53,
        '0.99': 37.48,
        '0.975': 40.48,
        '0.95': 43.19,
        '0.9': 46.46,
        '0.5': 59.33,
        '0.1': 74.4,
        '0.05': 79.08,
        '0.025': 83.3,
        '0.01': 88.38,
        '0.005': 91.95
    },
    '70': {
        '0.995': 43.28,
        '0.99': 45.44,
        '0.975': 48.76,
        '0.95': 51.74,
        '0.9': 55.33,
        '0.5': 69.33,
        '0.1': 85.53,
        '0.05': 90.53,
        '0.025': 95.02,
        '0.01': 100.42,
        '0.005': 104.22
    },
    '80': {
        '0.995': 51.17,
        '0.99': 53.54,
        '0.975': 57.15,
        '0.95': 60.39,
        '0.9': 64.28,
        '0.5': 79.33,
        '0.1': 96.58,
        '0.05': 101.88,
        '0.025': 106.63,
        '0.01': 112.33,
        '0.005': 116.32
    },
    '90': {
        '0.995': 59.2,
        '0.99': 61.75,
        '0.975': 65.65,
        '0.95': 69.13,
        '0.9': 73.29,
        '0.5': 89.33,
        '0.1': 107.57,
        '0.05': 113.14,
        '0.025': 118.14,
        '0.01': 124.12,
        '0.005': 128.3
    },
    '100': {
        '0.995': 67.33,
        '0.99': 70.06,
        '0.975': 74.22,
        '0.95': 77.93,
        '0.9': 82.36,
        '0.5': 99.33,
        '0.1': 118.5,
        '0.05': 124.34,
        '0.025': 129.56,
        '0.01': 135.81,
        '0.005': 140.17
    }
};

var chi_squared_distribution_table = chiSquaredDistributionTable;

/* @flow */




/**
 * The [χ2 (Chi-Squared) Goodness-of-Fit Test](http://en.wikipedia.org/wiki/Goodness_of_fit#Pearson.27s_chi-squared_test)
 * uses a measure of goodness of fit which is the sum of differences between observed and expected outcome frequencies
 * (that is, counts of observations), each squared and divided by the number of observations expected given the
 * hypothesized distribution. The resulting χ2 statistic, `chiSquared`, can be compared to the chi-squared distribution
 * to determine the goodness of fit. In order to determine the degrees of freedom of the chi-squared distribution, one
 * takes the total number of observed frequencies and subtracts the number of estimated parameters. The test statistic
 * follows, approximately, a chi-square distribution with (k − c) degrees of freedom where `k` is the number of non-empty
 * cells and `c` is the number of estimated parameters for the distribution.
 *
 * @param {Array<number>} data
 * @param {Function} distributionType a function that returns a point in a distribution:
 * for instance, binomial, bernoulli, or poisson
 * @param {number} significance
 * @returns {number} chi squared goodness of fit
 * @example
 * // Data from Poisson goodness-of-fit example 10-19 in William W. Hines & Douglas C. Montgomery,
 * // "Probability and Statistics in Engineering and Management Science", Wiley (1980).
 * var data1019 = [
 *     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 *     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 *     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
 *     2, 2, 2, 2, 2, 2, 2, 2, 2,
 *     3, 3, 3, 3
 * ];
 * ss.chiSquaredGoodnessOfFit(data1019, ss.poissonDistribution, 0.05)); //= false
 */
function chiSquaredGoodnessOfFit(data /*: Array<number> */
, distributionType /*: Function */
, significance /*: number */) /*: boolean */{
    // Estimate from the sample data, a weighted mean.
    var inputMean = mean_1(data),

    // Calculated value of the χ2 statistic.
    chiSquared = 0,

    // Degrees of freedom, calculated as (number of class intervals -
    // number of hypothesized distribution parameters estimated - 1)
    degreesOfFreedom,

    // Number of hypothesized distribution parameters estimated, expected to be supplied in the distribution test.
    // Lose one degree of freedom for estimating `lambda` from the sample data.
    c = 1,

    // The hypothesized distribution.
    // Generate the hypothesized distribution.
    hypothesizedDistribution = distributionType(inputMean),
        observedFrequencies = [],
        expectedFrequencies = [],
        k;

    // Create an array holding a histogram from the sample data, of
    // the form `{ value: numberOfOcurrences }`
    for (var i = 0; i < data.length; i++) {
        if (observedFrequencies[data[i]] === undefined) {
            observedFrequencies[data[i]] = 0;
        }
        observedFrequencies[data[i]]++;
    }

    // The histogram we created might be sparse - there might be gaps
    // between values. So we iterate through the histogram, making
    // sure that instead of undefined, gaps have 0 values.
    for (i = 0; i < observedFrequencies.length; i++) {
        if (observedFrequencies[i] === undefined) {
            observedFrequencies[i] = 0;
        }
    }

    // Create an array holding a histogram of expected data given the
    // sample size and hypothesized distribution.
    for (k in hypothesizedDistribution) {
        if (k in observedFrequencies) {
            expectedFrequencies[+k] = hypothesizedDistribution[k] * data.length;
        }
    }

    // Working backward through the expected frequencies, collapse classes
    // if less than three observations are expected for a class.
    // This transformation is applied to the observed frequencies as well.
    for (k = expectedFrequencies.length - 1; k >= 0; k--) {
        if (expectedFrequencies[k] < 3) {
            expectedFrequencies[k - 1] += expectedFrequencies[k];
            expectedFrequencies.pop();

            observedFrequencies[k - 1] += observedFrequencies[k];
            observedFrequencies.pop();
        }
    }

    // Iterate through the squared differences between observed & expected
    // frequencies, accumulating the `chiSquared` statistic.
    for (k = 0; k < observedFrequencies.length; k++) {
        chiSquared += Math.pow(observedFrequencies[k] - expectedFrequencies[k], 2) / expectedFrequencies[k];
    }

    // Calculate degrees of freedom for this test and look it up in the
    // `chiSquaredDistributionTable` in order to
    // accept or reject the goodness-of-fit of the hypothesized distribution.
    degreesOfFreedom = observedFrequencies.length - c - 1;
    return chi_squared_distribution_table[degreesOfFreedom][significance] < chiSquared;
}

var chi_squared_goodness_of_fit = chiSquaredGoodnessOfFit;

/* @flow */

/**
 * The [Z-Score, or Standard Score](http://en.wikipedia.org/wiki/Standard_score).
 *
 * The standard score is the number of standard deviations an observation
 * or datum is above or below the mean. Thus, a positive standard score
 * represents a datum above the mean, while a negative standard score
 * represents a datum below the mean. It is a dimensionless quantity
 * obtained by subtracting the population mean from an individual raw
 * score and then dividing the difference by the population standard
 * deviation.
 *
 * The z-score is only defined if one knows the population parameters;
 * if one only has a sample set, then the analogous computation with
 * sample mean and sample standard deviation yields the
 * Student's t-statistic.
 *
 * @param {number} x
 * @param {number} mean
 * @param {number} standardDeviation
 * @return {number} z score
 * @example
 * zScore(78, 80, 5); // => -0.4
 */

function zScore(x /*:number*/, mean /*:number*/, standardDeviation /*:number*/) /*:number*/{
  return (x - mean) / standardDeviation;
}

var z_score = zScore;

/* @flow */

var SQRT_2PI = Math.sqrt(2 * Math.PI);

function cumulativeDistribution(z) {
    var sum = z,
        tmp = z;

    // 15 iterations are enough for 4-digit precision
    for (var i = 1; i < 15; i++) {
        tmp *= z * z / (2 * i + 1);
        sum += tmp;
    }
    return Math.round((0.5 + sum / SQRT_2PI * Math.exp(-z * z / 2)) * 1e4) / 1e4;
}

/**
 * A standard normal table, also called the unit normal table or Z table,
 * is a mathematical table for the values of Φ (phi), which are the values of
 * the cumulative distribution function of the normal distribution.
 * It is used to find the probability that a statistic is observed below,
 * above, or between values on the standard normal distribution, and by
 * extension, any normal distribution.
 *
 * The probabilities are calculated using the
 * [Cumulative distribution function](https://en.wikipedia.org/wiki/Normal_distribution#Cumulative_distribution_function).
 * The table used is the cumulative, and not cumulative from 0 to mean
 * (even though the latter has 5 digits precision, instead of 4).
 */
var standardNormalTable /*: Array<number> */ = [];

for (var z = 0; z <= 3.09; z += 0.01) {
    standardNormalTable.push(cumulativeDistribution(z));
}

var standard_normal_table = standardNormalTable;

/* @flow */



/**
 * **[Cumulative Standard Normal Probability](http://en.wikipedia.org/wiki/Standard_normal_table)**
 *
 * Since probability tables cannot be
 * printed for every normal distribution, as there are an infinite variety
 * of normal distributions, it is common practice to convert a normal to a
 * standard normal and then use the standard normal table to find probabilities.
 *
 * You can use `.5 + .5 * errorFunction(x / Math.sqrt(2))` to calculate the probability
 * instead of looking it up in a table.
 *
 * @param {number} z
 * @returns {number} cumulative standard normal probability
 */
function cumulativeStdNormalProbability(z /*:number */) /*:number */{

    // Calculate the position of this value.
    var absZ = Math.abs(z),

    // Each row begins with a different
    // significant digit: 0.5, 0.6, 0.7, and so on. Each value in the table
    // corresponds to a range of 0.01 in the input values, so the value is
    // multiplied by 100.
    index = Math.min(Math.round(absZ * 100), standard_normal_table.length - 1);

    // The index we calculate must be in the table as a positive value,
    // but we still pay attention to whether the input is positive
    // or negative, and flip the output value as a last step.
    if (z >= 0) {
        return standard_normal_table[index];
    } else {
        // due to floating-point arithmetic, values in the table with
        // 4 significant figures can nevertheless end up as repeating
        // fractions when they're computed here.
        return +(1 - standard_normal_table[index]).toFixed(4);
    }
}

var cumulative_std_normal_probability = cumulativeStdNormalProbability;

/* @flow */

/**
 * **[Gaussian error function](http://en.wikipedia.org/wiki/Error_function)**
 *
 * The `errorFunction(x/(sd * Math.sqrt(2)))` is the probability that a value in a
 * normal distribution with standard deviation sd is within x of the mean.
 *
 * This function returns a numerical approximation to the exact value.
 *
 * @param {number} x input
 * @return {number} error estimation
 * @example
 * errorFunction(1).toFixed(2); // => '0.84'
 */

function errorFunction(x /*: number */) /*: number */{
    var t = 1 / (1 + 0.5 * Math.abs(x));
    var tau = t * Math.exp(-Math.pow(x, 2) - 1.26551223 + 1.00002368 * t + 0.37409196 * Math.pow(t, 2) + 0.09678418 * Math.pow(t, 3) - 0.18628806 * Math.pow(t, 4) + 0.27886807 * Math.pow(t, 5) - 1.13520398 * Math.pow(t, 6) + 1.48851587 * Math.pow(t, 7) - 0.82215223 * Math.pow(t, 8) + 0.17087277 * Math.pow(t, 9));
    if (x >= 0) {
        return 1 - tau;
    } else {
        return tau - 1;
    }
}

var error_function = errorFunction;

/* @flow */

/**
 * The Inverse [Gaussian error function](http://en.wikipedia.org/wiki/Error_function)
 * returns a numerical approximation to the value that would have caused
 * `errorFunction()` to return x.
 *
 * @param {number} x value of error function
 * @returns {number} estimated inverted value
 */

function inverseErrorFunction(x /*: number */) /*: number */{
    var a = 8 * (Math.PI - 3) / (3 * Math.PI * (4 - Math.PI));

    var inv = Math.sqrt(Math.sqrt(Math.pow(2 / (Math.PI * a) + Math.log(1 - x * x) / 2, 2) - Math.log(1 - x * x) / a) - (2 / (Math.PI * a) + Math.log(1 - x * x) / 2));

    if (x >= 0) {
        return inv;
    } else {
        return -inv;
    }
}

var inverse_error_function = inverseErrorFunction;

/* @flow */




/**
 * The [Probit](http://en.wikipedia.org/wiki/Probit)
 * is the inverse of cumulativeStdNormalProbability(),
 * and is also known as the normal quantile function.
 *
 * It returns the number of standard deviations from the mean
 * where the p'th quantile of values can be found in a normal distribution.
 * So, for example, probit(0.5 + 0.6827/2) ≈ 1 because 68.27% of values are
 * normally found within 1 standard deviation above or below the mean.
 *
 * @param {number} p
 * @returns {number} probit
 */
function probit(p /*: number */) /*: number */{
    if (p === 0) {
        p = epsilon_1;
    } else if (p >= 1) {
        p = 1 - epsilon_1;
    }
    return Math.sqrt(2) * inverse_error_function(2 * p - 1);
}

var probit_1 = probit;

/* @flow */

/**
 * [Sign](https://en.wikipedia.org/wiki/Sign_function) is a function 
 * that extracts the sign of a real number
 * 
 * @param {Number} x input value
 * @returns {Number} sign value either 1, 0 or -1
 * @throws {TypeError} if the input argument x is not a number
 * @private
 * 
 * @example
 * sign(2); // => 1
 */

function sign(x /*: number */) /*: number */{
    if (typeof x === 'number') {
        if (x < 0) {
            return -1;
        } else if (x === 0) {
            return 0;
        } else {
            return 1;
        }
    } else {
        throw new TypeError('not a number');
    }
}

var sign_1 = sign;

/* @flow */


/**
 * [Bisection method](https://en.wikipedia.org/wiki/Bisection_method) is a root-finding 
 * method that repeatedly bisects an interval to find the root.
 * 
 * This function returns a numerical approximation to the exact value.
 * 
 * @param {Function} func input function
 * @param {Number} start - start of interval
 * @param {Number} end - end of interval
 * @param {Number} maxIterations - the maximum number of iterations
 * @param {Number} errorTolerance - the error tolerance
 * @returns {Number} estimated root value
 * @throws {TypeError} Argument func must be a function
 * 
 * @example
 * bisect(Math.cos,0,4,100,0.003); // => 1.572265625
 */
function bisect$1(func /*: (x: any) => number */
, start /*: number */
, end /*: number */
, maxIterations /*: number */
, errorTolerance /*: number */) /*:number*/{

    if (typeof func !== 'function') throw new TypeError('func must be a function');

    for (var i = 0; i < maxIterations; i++) {
        var output = (start + end) / 2;

        if (func(output) === 0 || Math.abs((end - start) / 2) < errorTolerance) {
            return output;
        }

        if (sign_1(func(output)) === sign_1(func(start))) {
            start = output;
        } else {
            end = output;
        }
    }

    throw new Error('maximum number of iterations exceeded');
}

var bisect_1 = bisect$1;

var index = createCommonjsModule(function (module) {
/* @flow */
'use strict';

// # simple-statistics
//
// A simple, literate statistics system.

var ss = module.exports = {};

// Linear Regression
ss.linearRegression = linear_regression;
ss.linearRegressionLine = linear_regression_line;
ss.standardDeviation = standard_deviation;
ss.rSquared = r_squared;
ss.mode = mode_1;
ss.modeFast = mode_fast;
ss.modeSorted = mode_sorted;
ss.min = min_1;
ss.max = max_1;
ss.minSorted = min_sorted;
ss.maxSorted = max_sorted;
ss.sum = sum_1;
ss.sumSimple = sum_simple;
ss.product = product_1;
ss.quantile = quantile_1;
ss.quantileSorted = quantile_sorted;
ss.iqr = ss.interquartileRange = interquartile_range;
ss.medianAbsoluteDeviation = ss.mad = median_absolute_deviation;
ss.chunk = chunk_1;
ss.sampleWithReplacement = sample_with_replacement;
ss.shuffle = shuffle_1;
ss.shuffleInPlace = shuffle_in_place;
ss.sample = sample_1;
ss.ckmeans = ckmeans_1;
ss.uniqueCountSorted = unique_count_sorted;
ss.sumNthPowerDeviations = sum_nth_power_deviations;
ss.equalIntervalBreaks = equal_interval_breaks;

// sample statistics
ss.sampleCovariance = sample_covariance;
ss.sampleCorrelation = sample_correlation;
ss.sampleVariance = sample_variance;
ss.sampleStandardDeviation = sample_standard_deviation;
ss.sampleSkewness = sample_skewness;
ss.sampleKurtosis = sample_kurtosis;

// combinatorics
ss.permutationsHeap = permutations_heap;
ss.combinations = combinations_1;
ss.combinationsReplacement = combinations_replacement;

// measures of centrality
ss.addToMean = add_to_mean;
ss.combineMeans = combine_means;
ss.combineVariances = combine_variances;
ss.geometricMean = geometric_mean;
ss.harmonicMean = harmonic_mean;
ss.mean = ss.average = mean_1;
ss.median = median_1;
ss.medianSorted = median_sorted;
ss.subtractFromMean = subtract_from_mean;

ss.rootMeanSquare = ss.rms = root_mean_square;
ss.variance = variance_1;
ss.tTest = t_test;
ss.tTestTwoSample = t_test_two_sample;
// ss.jenks = require('./src/jenks');

// Classifiers
ss.bayesian = bayesian_classifier;
ss.perceptron = perceptron;

// Distribution-related methods
ss.epsilon = epsilon_1; // We make ε available to the test suite.
ss.factorial = factorial_1;
ss.bernoulliDistribution = bernoulli_distribution;
ss.binomialDistribution = binomial_distribution;
ss.poissonDistribution = poisson_distribution;
ss.chiSquaredGoodnessOfFit = chi_squared_goodness_of_fit;

// Normal distribution
ss.zScore = z_score;
ss.cumulativeStdNormalProbability = cumulative_std_normal_probability;
ss.standardNormalTable = standard_normal_table;
ss.errorFunction = ss.erf = error_function;
ss.inverseErrorFunction = inverse_error_function;
ss.probit = probit_1;

// Root-finding methods
ss.bisect = bisect_1;
});

var index_1 = index.ckmeans;
var index_2 = index.equalIntervalBreaks;

var chroma = createCommonjsModule(function (module, exports) {
/**
 * @license
 *
 * chroma.js - JavaScript library for color conversions
 * 
 * Copyright (c) 2011-2017, Gregor Aisch
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

(function () {
  var Color,
      DEG2RAD,
      LAB_CONSTANTS,
      PI,
      PITHIRD,
      RAD2DEG,
      TWOPI,
      _guess_formats,
      _guess_formats_sorted,
      _input,
      _interpolators,
      abs,
      atan2,
      _bezier,
      _blend,
      blend_f,
      brewer,
      burn,
      chroma,
      clip_rgb,
      cmyk2rgb,
      colors,
      cos,
      css2rgb,
      darken,
      dodge,
      each,
      floor,
      hcg2rgb,
      hex2rgb,
      hsi2rgb,
      hsl2css,
      hsl2rgb,
      hsv2rgb,
      interpolate,
      interpolate_hsx,
      interpolate_lab,
      interpolate_num,
      interpolate_rgb,
      lab2lch,
      lab2rgb,
      lab_xyz,
      lch2lab,
      lch2rgb,
      lighten,
      limit,
      log,
      luminance_x,
      m,
      max,
      multiply,
      normal,
      num2rgb,
      overlay,
      pow,
      rgb2cmyk,
      rgb2css,
      rgb2hcg,
      rgb2hex,
      rgb2hsi,
      rgb2hsl,
      rgb2hsv,
      rgb2lab,
      rgb2lch,
      rgb2luminance,
      rgb2num,
      rgb2temperature,
      rgb2xyz,
      rgb_xyz,
      rnd,
      root,
      round,
      screen,
      sin,
      sqrt,
      temperature2rgb,
      type,
      unpack,
      w3cx11,
      xyz_lab,
      xyz_rgb,
      slice = [].slice;

  type = function () {

    /*
    for browser-safe type checking+
    ported from jQuery's $.type
     */
    var classToType, len, name, o, ref;
    classToType = {};
    ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (o = 0, len = ref.length; o < len; o++) {
      name = ref[o];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function (obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  }();

  limit = function limit(x, min, max) {
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 1;
    }
    if (x < min) {
      x = min;
    }
    if (x > max) {
      x = max;
    }
    return x;
  };

  unpack = function unpack(args) {
    if (args.length >= 3) {
      return [].slice.call(args);
    } else {
      return args[0];
    }
  };

  clip_rgb = function clip_rgb(rgb) {
    var i, o;
    rgb._clipped = false;
    rgb._unclipped = rgb.slice(0);
    for (i = o = 0; o < 3; i = ++o) {
      if (i < 3) {
        if (rgb[i] < 0 || rgb[i] > 255) {
          rgb._clipped = true;
        }
        if (rgb[i] < 0) {
          rgb[i] = 0;
        }
        if (rgb[i] > 255) {
          rgb[i] = 255;
        }
      } else if (i === 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0;
        }
        if (rgb[i] > 1) {
          rgb[i] = 1;
        }
      }
    }
    if (!rgb._clipped) {
      delete rgb._unclipped;
    }
    return rgb;
  };

  PI = Math.PI, round = Math.round, cos = Math.cos, floor = Math.floor, pow = Math.pow, log = Math.log, sin = Math.sin, sqrt = Math.sqrt, atan2 = Math.atan2, max = Math.max, abs = Math.abs;

  TWOPI = PI * 2;

  PITHIRD = PI / 3;

  DEG2RAD = PI / 180;

  RAD2DEG = 180 / PI;

  chroma = function chroma() {
    if (arguments[0] instanceof Color) {
      return arguments[0];
    }
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, arguments, function () {});
  };

  _interpolators = [];

  if ('object' !== "undefined" && module !== null && module.exports != null) {
    module.exports = chroma;
  }

  if (typeof undefined === 'function' && undefined.amd) {
    undefined([], function () {
      return chroma;
    });
  } else {
    root = 'object' !== "undefined" && exports !== null ? exports : this;
    root.chroma = chroma;
  }

  chroma.version = '1.3.4';

  _input = {};

  _guess_formats = [];

  _guess_formats_sorted = false;

  Color = function () {
    function Color() {
      var arg, args, chk, len, len1, me, mode, o, w;
      me = this;
      args = [];
      for (o = 0, len = arguments.length; o < len; o++) {
        arg = arguments[o];
        if (arg != null) {
          args.push(arg);
        }
      }
      mode = args[args.length - 1];
      if (_input[mode] != null) {
        me._rgb = clip_rgb(_input[mode](unpack(args.slice(0, -1))));
      } else {
        if (!_guess_formats_sorted) {
          _guess_formats = _guess_formats.sort(function (a, b) {
            return b.p - a.p;
          });
          _guess_formats_sorted = true;
        }
        for (w = 0, len1 = _guess_formats.length; w < len1; w++) {
          chk = _guess_formats[w];
          mode = chk.test.apply(chk, args);
          if (mode) {
            break;
          }
        }
        if (mode) {
          me._rgb = clip_rgb(_input[mode].apply(_input, args));
        }
      }
      if (me._rgb == null) {
        console.warn('unknown format: ' + args);
      }
      if (me._rgb == null) {
        me._rgb = [0, 0, 0];
      }
      if (me._rgb.length === 3) {
        me._rgb.push(1);
      }
    }

    Color.prototype.toString = function () {
      return this.hex();
    };

    Color.prototype.clone = function () {
      return chroma(me._rgb);
    };

    return Color;
  }();

  chroma._input = _input;

  /**
  	ColorBrewer colors for chroma.js
  
  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  	Pennsylvania State University.
  
  	Licensed under the Apache License, Version 2.0 (the "License"); 
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at	
  	http://www.apache.org/licenses/LICENSE-2.0
  
  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.
  
      @preserve
   */

  chroma.brewer = brewer = {
    OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
    PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
    BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
    Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
    YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
    YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
    Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
    Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
    Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
    Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],
    Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
    PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
    PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
    RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
    BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
    RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
    PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
    Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
    Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
    Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
    Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
    Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
    Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
  };

  (function () {
    var key, results;
    results = [];
    for (key in brewer) {
      results.push(brewer[key.toLowerCase()] = brewer[key]);
    }
    return results;
  })();

  /**
  	X11 color names
  
  	http://www.w3.org/TR/css3-color/#svg-color
   */

  w3cx11 = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflower: '#6495ed',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    laserlemon: '#ffff54',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrod: '#fafad2',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    maroon2: '#7f0000',
    maroon3: '#b03060',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    purple2: '#7f007f',
    purple3: '#a020f0',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
  };

  chroma.colors = colors = w3cx11;

  lab2rgb = function lab2rgb() {
    var a, args, b, g, l, r, x, y, z;
    args = unpack(arguments);
    l = args[0], a = args[1], b = args[2];
    y = (l + 16) / 116;
    x = isNaN(a) ? y : y + a / 500;
    z = isNaN(b) ? y : y - b / 200;
    y = LAB_CONSTANTS.Yn * lab_xyz(y);
    x = LAB_CONSTANTS.Xn * lab_xyz(x);
    z = LAB_CONSTANTS.Zn * lab_xyz(z);
    r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  xyz_rgb = function xyz_rgb(r) {
    return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow(r, 1 / 2.4) - 0.055);
  };

  lab_xyz = function lab_xyz(t) {
    if (t > LAB_CONSTANTS.t1) {
      return t * t * t;
    } else {
      return LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
    }
  };

  LAB_CONSTANTS = {
    Kn: 18,
    Xn: 0.950470,
    Yn: 1,
    Zn: 1.088830,
    t0: 0.137931034,
    t1: 0.206896552,
    t2: 0.12841855,
    t3: 0.008856452
  };

  rgb2lab = function rgb2lab() {
    var b, g, r, ref, ref1, x, y, z;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    ref1 = rgb2xyz(r, g, b), x = ref1[0], y = ref1[1], z = ref1[2];
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

  rgb_xyz = function rgb_xyz(r) {
    if ((r /= 255) <= 0.04045) {
      return r / 12.92;
    } else {
      return pow((r + 0.055) / 1.055, 2.4);
    }
  };

  xyz_lab = function xyz_lab(t) {
    if (t > LAB_CONSTANTS.t3) {
      return pow(t, 1 / 3);
    } else {
      return t / LAB_CONSTANTS.t2 + LAB_CONSTANTS.t0;
    }
  };

  rgb2xyz = function rgb2xyz() {
    var b, g, r, ref, x, y, z;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = rgb_xyz(r);
    g = rgb_xyz(g);
    b = rgb_xyz(b);
    x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.Xn);
    y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS.Yn);
    z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS.Zn);
    return [x, y, z];
  };

  chroma.lab = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['lab']), function () {});
  };

  _input.lab = lab2rgb;

  Color.prototype.lab = function () {
    return rgb2lab(this._rgb);
  };

  _bezier = function bezier(colors) {
    var I, I0, I1, c, lab0, lab1, lab2, lab3, ref, ref1, ref2;
    colors = function () {
      var len, o, results;
      results = [];
      for (o = 0, len = colors.length; o < len; o++) {
        c = colors[o];
        results.push(chroma(c));
      }
      return results;
    }();
    if (colors.length === 2) {
      ref = function () {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      }(), lab0 = ref[0], lab1 = ref[1];
      I = function I(t) {
        var i, lab;
        lab = function () {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push(lab0[i] + t * (lab1[i] - lab0[i]));
          }
          return results;
        }();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 3) {
      ref1 = function () {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      }(), lab0 = ref1[0], lab1 = ref1[1], lab2 = ref1[2];
      I = function I(t) {
        var i, lab;
        lab = function () {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push((1 - t) * (1 - t) * lab0[i] + 2 * (1 - t) * t * lab1[i] + t * t * lab2[i]);
          }
          return results;
        }();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 4) {
      ref2 = function () {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      }(), lab0 = ref2[0], lab1 = ref2[1], lab2 = ref2[2], lab3 = ref2[3];
      I = function I(t) {
        var i, lab;
        lab = function () {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push((1 - t) * (1 - t) * (1 - t) * lab0[i] + 3 * (1 - t) * (1 - t) * t * lab1[i] + 3 * (1 - t) * t * t * lab2[i] + t * t * t * lab3[i]);
          }
          return results;
        }();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 5) {
      I0 = _bezier(colors.slice(0, 3));
      I1 = _bezier(colors.slice(2, 5));
      I = function I(t) {
        if (t < 0.5) {
          return I0(t * 2);
        } else {
          return I1((t - 0.5) * 2);
        }
      };
    }
    return I;
  };

  chroma.bezier = function (colors) {
    var f;
    f = _bezier(colors);
    f.scale = function () {
      return chroma.scale(f);
    };
    return f;
  };

  /*
      chroma.js
  
      Copyright (c) 2011-2013, Gregor Aisch
      All rights reserved.
  
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are met:
  
      * Redistributions of source code must retain the above copyright notice, this
        list of conditions and the following disclaimer.
  
      * Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.
  
      * The name Gregor Aisch may not be used to endorse or promote products
        derived from this software without specific prior written permission.
  
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
      AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
      IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
      DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
      INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
      BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
      DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
      OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
      EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  
      @source: https://github.com/gka/chroma.js
   */

  chroma.cubehelix = function (start, rotations, hue, gamma, lightness) {
    var dh, dl, f;
    if (start == null) {
      start = 300;
    }
    if (rotations == null) {
      rotations = -1.5;
    }
    if (hue == null) {
      hue = 1;
    }
    if (gamma == null) {
      gamma = 1;
    }
    if (lightness == null) {
      lightness = [0, 1];
    }
    dh = 0;
    if (type(lightness) === 'array') {
      dl = lightness[1] - lightness[0];
    } else {
      dl = 0;
      lightness = [lightness, lightness];
    }
    f = function f(fract) {
      var a, amp, b, cos_a, g, h, l, r, sin_a;
      a = TWOPI * ((start + 120) / 360 + rotations * fract);
      l = pow(lightness[0] + dl * fract, gamma);
      h = dh !== 0 ? hue[0] + fract * dh : hue;
      amp = h * l * (1 - l) / 2;
      cos_a = cos(a);
      sin_a = sin(a);
      r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
      g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
      b = l + amp * (+1.97294 * cos_a);
      return chroma(clip_rgb([r * 255, g * 255, b * 255]));
    };
    f.start = function (s) {
      if (s == null) {
        return start;
      }
      start = s;
      return f;
    };
    f.rotations = function (r) {
      if (r == null) {
        return rotations;
      }
      rotations = r;
      return f;
    };
    f.gamma = function (g) {
      if (g == null) {
        return gamma;
      }
      gamma = g;
      return f;
    };
    f.hue = function (h) {
      if (h == null) {
        return hue;
      }
      hue = h;
      if (type(hue) === 'array') {
        dh = hue[1] - hue[0];
        if (dh === 0) {
          hue = hue[1];
        }
      } else {
        dh = 0;
      }
      return f;
    };
    f.lightness = function (h) {
      if (h == null) {
        return lightness;
      }
      if (type(h) === 'array') {
        lightness = h;
        dl = h[1] - h[0];
      } else {
        lightness = [h, h];
        dl = 0;
      }
      return f;
    };
    f.scale = function () {
      return chroma.scale(f);
    };
    f.hue(hue);
    return f;
  };

  chroma.random = function () {
    var code, digits, i, o;
    digits = '0123456789abcdef';
    code = '#';
    for (i = o = 0; o < 6; i = ++o) {
      code += digits.charAt(floor(Math.random() * 16));
    }
    return new Color(code);
  };

  chroma.average = function (colors, mode) {
    var A, alpha, c, cnt, dx, dy, first, i, l, len, o, xyz, xyz2;
    if (mode == null) {
      mode = 'rgb';
    }
    l = colors.length;
    colors = colors.map(function (c) {
      return chroma(c);
    });
    first = colors.splice(0, 1)[0];
    xyz = first.get(mode);
    cnt = [];
    dx = 0;
    dy = 0;
    for (i in xyz) {
      xyz[i] = xyz[i] || 0;
      cnt.push(!isNaN(xyz[i]) ? 1 : 0);
      if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
        A = xyz[i] / 180 * PI;
        dx += cos(A);
        dy += sin(A);
      }
    }
    alpha = first.alpha();
    for (o = 0, len = colors.length; o < len; o++) {
      c = colors[o];
      xyz2 = c.get(mode);
      alpha += c.alpha();
      for (i in xyz) {
        if (!isNaN(xyz2[i])) {
          xyz[i] += xyz2[i];
          cnt[i] += 1;
          if (mode.charAt(i) === 'h') {
            A = xyz[i] / 180 * PI;
            dx += cos(A);
            dy += sin(A);
          }
        }
      }
    }
    for (i in xyz) {
      xyz[i] = xyz[i] / cnt[i];
      if (mode.charAt(i) === 'h') {
        A = atan2(dy / cnt[i], dx / cnt[i]) / PI * 180;
        while (A < 0) {
          A += 360;
        }
        while (A >= 360) {
          A -= 360;
        }
        xyz[i] = A;
      }
    }
    return chroma(xyz, mode).alpha(alpha / l);
  };

  _input.rgb = function () {
    var k, ref, results, v;
    ref = unpack(arguments);
    results = [];
    for (k in ref) {
      v = ref[k];
      results.push(v);
    }
    return results;
  };

  chroma.rgb = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['rgb']), function () {});
  };

  Color.prototype.rgb = function (round) {
    if (round == null) {
      round = true;
    }
    if (round) {
      return this._rgb.map(Math.round).slice(0, 3);
    } else {
      return this._rgb.slice(0, 3);
    }
  };

  Color.prototype.rgba = function (round) {
    if (round == null) {
      round = true;
    }
    if (!round) {
      return this._rgb.slice(0);
    }
    return [Math.round(this._rgb[0]), Math.round(this._rgb[1]), Math.round(this._rgb[2]), this._rgb[3]];
  };

  _guess_formats.push({
    p: 3,
    test: function test(n) {
      var a;
      a = unpack(arguments);
      if (type(a) === 'array' && a.length === 3) {
        return 'rgb';
      }
      if (a.length === 4 && type(a[3]) === "number" && a[3] >= 0 && a[3] <= 1) {
        return 'rgb';
      }
    }
  });

  hex2rgb = function hex2rgb(hex) {
    var a, b, g, r, rgb, u;
    if (hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if (hex.length === 4 || hex.length === 7) {
        hex = hex.substr(1);
      }
      if (hex.length === 3) {
        hex = hex.split("");
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      u = parseInt(hex, 16);
      r = u >> 16;
      g = u >> 8 & 0xFF;
      b = u & 0xFF;
      return [r, g, b, 1];
    }
    if (hex.match(/^#?([A-Fa-f0-9]{8})$/)) {
      if (hex.length === 9) {
        hex = hex.substr(1);
      }
      u = parseInt(hex, 16);
      r = u >> 24 & 0xFF;
      g = u >> 16 & 0xFF;
      b = u >> 8 & 0xFF;
      a = round((u & 0xFF) / 0xFF * 100) / 100;
      return [r, g, b, a];
    }
    if (_input.css != null && (rgb = _input.css(hex))) {
      return rgb;
    }
    throw "unknown color: " + hex;
  };

  rgb2hex = function rgb2hex(channels, mode) {
    var a, b, g, hxa, r, str, u;
    if (mode == null) {
      mode = 'rgb';
    }
    r = channels[0], g = channels[1], b = channels[2], a = channels[3];
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16);
    str = str.substr(str.length - 6);
    hxa = '0' + round(a * 255).toString(16);
    hxa = hxa.substr(hxa.length - 2);
    return "#" + function () {
      switch (mode.toLowerCase()) {
        case 'rgba':
          return str + hxa;
        case 'argb':
          return hxa + str;
        default:
          return str;
      }
    }();
  };

  _input.hex = function (h) {
    return hex2rgb(h);
  };

  chroma.hex = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['hex']), function () {});
  };

  Color.prototype.hex = function (mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    return rgb2hex(this._rgb, mode);
  };

  _guess_formats.push({
    p: 4,
    test: function test(n) {
      if (arguments.length === 1 && type(n) === "string") {
        return 'hex';
      }
    }
  });

  hsl2rgb = function hsl2rgb() {
    var args, b, c, g, h, i, l, o, r, ref, s, t1, t2, t3;
    args = unpack(arguments);
    h = args[0], s = args[1], l = args[2];
    if (s === 0) {
      r = g = b = l * 255;
    } else {
      t3 = [0, 0, 0];
      c = [0, 0, 0];
      t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      t1 = 2 * l - t2;
      h /= 360;
      t3[0] = h + 1 / 3;
      t3[1] = h;
      t3[2] = h - 1 / 3;
      for (i = o = 0; o <= 2; i = ++o) {
        if (t3[i] < 0) {
          t3[i] += 1;
        }
        if (t3[i] > 1) {
          t3[i] -= 1;
        }
        if (6 * t3[i] < 1) {
          c[i] = t1 + (t2 - t1) * 6 * t3[i];
        } else if (2 * t3[i] < 1) {
          c[i] = t2;
        } else if (3 * t3[i] < 2) {
          c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6;
        } else {
          c[i] = t1;
        }
      }
      ref = [round(c[0] * 255), round(c[1] * 255), round(c[2] * 255)], r = ref[0], g = ref[1], b = ref[2];
    }
    if (args.length > 3) {
      return [r, g, b, args[3]];
    } else {
      return [r, g, b];
    }
  };

  rgb2hsl = function rgb2hsl(r, g, b) {
    var h, l, min, ref, s;
    if (r !== void 0 && r.length >= 3) {
      ref = r, r = ref[0], g = ref[1], b = ref[2];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = Number.NaN;
    } else {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }
    if (r === max) {
      h = (g - b) / (max - min);
    } else if (g === max) {
      h = 2 + (b - r) / (max - min);
    } else if (b === max) {
      h = 4 + (r - g) / (max - min);
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
    return [h, s, l];
  };

  chroma.hsl = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['hsl']), function () {});
  };

  _input.hsl = hsl2rgb;

  Color.prototype.hsl = function () {
    return rgb2hsl(this._rgb);
  };

  hsv2rgb = function hsv2rgb() {
    var args, b, f, g, h, i, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, s, t, v;
    args = unpack(arguments);
    h = args[0], s = args[1], v = args[2];
    v *= 255;
    if (s === 0) {
      r = g = b = v;
    } else {
      if (h === 360) {
        h = 0;
      }
      if (h > 360) {
        h -= 360;
      }
      if (h < 0) {
        h += 360;
      }
      h /= 60;
      i = floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          ref = [v, t, p], r = ref[0], g = ref[1], b = ref[2];
          break;
        case 1:
          ref1 = [q, v, p], r = ref1[0], g = ref1[1], b = ref1[2];
          break;
        case 2:
          ref2 = [p, v, t], r = ref2[0], g = ref2[1], b = ref2[2];
          break;
        case 3:
          ref3 = [p, q, v], r = ref3[0], g = ref3[1], b = ref3[2];
          break;
        case 4:
          ref4 = [t, p, v], r = ref4[0], g = ref4[1], b = ref4[2];
          break;
        case 5:
          ref5 = [v, p, q], r = ref5[0], g = ref5[1], b = ref5[2];
      }
    }
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  rgb2hsv = function rgb2hsv() {
    var b, delta, g, h, min, r, ref, s, v;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    v = max / 255.0;
    if (max === 0) {
      h = Number.NaN;
      s = 0;
    } else {
      s = delta / max;
      if (r === max) {
        h = (g - b) / delta;
      }
      if (g === max) {
        h = 2 + (b - r) / delta;
      }
      if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    }
    return [h, s, v];
  };

  chroma.hsv = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['hsv']), function () {});
  };

  _input.hsv = hsv2rgb;

  Color.prototype.hsv = function () {
    return rgb2hsv(this._rgb);
  };

  num2rgb = function num2rgb(num) {
    var b, g, r;
    if (type(num) === "number" && num >= 0 && num <= 0xFFFFFF) {
      r = num >> 16;
      g = num >> 8 & 0xFF;
      b = num & 0xFF;
      return [r, g, b, 1];
    }
    console.warn("unknown num color: " + num);
    return [0, 0, 0, 1];
  };

  rgb2num = function rgb2num() {
    var b, g, r, ref;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    return (r << 16) + (g << 8) + b;
  };

  chroma.num = function (num) {
    return new Color(num, 'num');
  };

  Color.prototype.num = function (mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    return rgb2num(this._rgb, mode);
  };

  _input.num = num2rgb;

  _guess_formats.push({
    p: 1,
    test: function test(n) {
      if (arguments.length === 1 && type(n) === "number" && n >= 0 && n <= 0xFFFFFF) {
        return 'num';
      }
    }
  });

  hcg2rgb = function hcg2rgb() {
    var _c, _g, args, b, c, f, g, h, i, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, t, v;
    args = unpack(arguments);
    h = args[0], c = args[1], _g = args[2];
    c = c / 100;
    g = g / 100 * 255;
    _c = c * 255;
    if (c === 0) {
      r = g = b = _g;
    } else {
      if (h === 360) {
        h = 0;
      }
      if (h > 360) {
        h -= 360;
      }
      if (h < 0) {
        h += 360;
      }
      h /= 60;
      i = floor(h);
      f = h - i;
      p = _g * (1 - c);
      q = p + _c * (1 - f);
      t = p + _c * f;
      v = p + _c;
      switch (i) {
        case 0:
          ref = [v, t, p], r = ref[0], g = ref[1], b = ref[2];
          break;
        case 1:
          ref1 = [q, v, p], r = ref1[0], g = ref1[1], b = ref1[2];
          break;
        case 2:
          ref2 = [p, v, t], r = ref2[0], g = ref2[1], b = ref2[2];
          break;
        case 3:
          ref3 = [p, q, v], r = ref3[0], g = ref3[1], b = ref3[2];
          break;
        case 4:
          ref4 = [t, p, v], r = ref4[0], g = ref4[1], b = ref4[2];
          break;
        case 5:
          ref5 = [v, p, q], r = ref5[0], g = ref5[1], b = ref5[2];
      }
    }
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  rgb2hcg = function rgb2hcg() {
    var _g, b, c, delta, g, h, min, r, ref;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    c = delta * 100 / 255;
    _g = min / (255 - delta) * 100;
    if (delta === 0) {
      h = Number.NaN;
    } else {
      if (r === max) {
        h = (g - b) / delta;
      }
      if (g === max) {
        h = 2 + (b - r) / delta;
      }
      if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    }
    return [h, c, _g];
  };

  chroma.hcg = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['hcg']), function () {});
  };

  _input.hcg = hcg2rgb;

  Color.prototype.hcg = function () {
    return rgb2hcg(this._rgb);
  };

  css2rgb = function css2rgb(css) {
    var aa, ab, hsl, i, m, o, rgb, w;
    css = css.toLowerCase();
    if (chroma.colors != null && chroma.colors[css]) {
      return hex2rgb(chroma.colors[css]);
    }
    if (m = css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = o = 0; o <= 2; i = ++o) {
        rgb[i] = +rgb[i];
      }
      rgb[3] = 1;
    } else if (m = css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = w = 0; w <= 3; i = ++w) {
        rgb[i] = +rgb[i];
      }
    } else if (m = css.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = aa = 0; aa <= 2; i = ++aa) {
        rgb[i] = round(rgb[i] * 2.55);
      }
      rgb[3] = 1;
    } else if (m = css.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = ab = 0; ab <= 2; i = ++ab) {
        rgb[i] = round(rgb[i] * 2.55);
      }
      rgb[3] = +rgb[3];
    } else if (m = css.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= 0.01;
      hsl[2] *= 0.01;
      rgb = hsl2rgb(hsl);
      rgb[3] = 1;
    } else if (m = css.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= 0.01;
      hsl[2] *= 0.01;
      rgb = hsl2rgb(hsl);
      rgb[3] = +m[4];
    }
    return rgb;
  };

  rgb2css = function rgb2css(rgba) {
    var mode;
    mode = rgba[3] < 1 ? 'rgba' : 'rgb';
    if (mode === 'rgb') {
      return mode + '(' + rgba.slice(0, 3).map(round).join(',') + ')';
    } else if (mode === 'rgba') {
      return mode + '(' + rgba.slice(0, 3).map(round).join(',') + ',' + rgba[3] + ')';
    } else {}
  };

  rnd = function rnd(a) {
    return round(a * 100) / 100;
  };

  hsl2css = function hsl2css(hsl, alpha) {
    var mode;
    mode = alpha < 1 ? 'hsla' : 'hsl';
    hsl[0] = rnd(hsl[0] || 0);
    hsl[1] = rnd(hsl[1] * 100) + '%';
    hsl[2] = rnd(hsl[2] * 100) + '%';
    if (mode === 'hsla') {
      hsl[3] = alpha;
    }
    return mode + '(' + hsl.join(',') + ')';
  };

  _input.css = function (h) {
    return css2rgb(h);
  };

  chroma.css = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['css']), function () {});
  };

  Color.prototype.css = function (mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    if (mode.slice(0, 3) === 'rgb') {
      return rgb2css(this._rgb);
    } else if (mode.slice(0, 3) === 'hsl') {
      return hsl2css(this.hsl(), this.alpha());
    }
  };

  _input.named = function (name) {
    return hex2rgb(w3cx11[name]);
  };

  _guess_formats.push({
    p: 5,
    test: function test(n) {
      if (arguments.length === 1 && w3cx11[n] != null) {
        return 'named';
      }
    }
  });

  Color.prototype.name = function (n) {
    var h, k;
    if (arguments.length) {
      if (w3cx11[n]) {
        this._rgb = hex2rgb(w3cx11[n]);
      }
      this._rgb[3] = 1;
      this;
    }
    h = this.hex();
    for (k in w3cx11) {
      if (h === w3cx11[k]) {
        return k;
      }
    }
    return h;
  };

  lch2lab = function lch2lab() {

    /*
    Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
    These formulas were invented by David Dalrymple to obtain maximum contrast without going
    out of gamut if the parameters are in the range 0-1.
    
    A saturation multiplier was added by Gregor Aisch
     */
    var c, h, l, ref;
    ref = unpack(arguments), l = ref[0], c = ref[1], h = ref[2];
    h = h * DEG2RAD;
    return [l, cos(h) * c, sin(h) * c];
  };

  lch2rgb = function lch2rgb() {
    var L, a, args, b, c, g, h, l, r, ref, ref1;
    args = unpack(arguments);
    l = args[0], c = args[1], h = args[2];
    ref = lch2lab(l, c, h), L = ref[0], a = ref[1], b = ref[2];
    ref1 = lab2rgb(L, a, b), r = ref1[0], g = ref1[1], b = ref1[2];
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  lab2lch = function lab2lch() {
    var a, b, c, h, l, ref;
    ref = unpack(arguments), l = ref[0], a = ref[1], b = ref[2];
    c = sqrt(a * a + b * b);
    h = (atan2(b, a) * RAD2DEG + 360) % 360;
    if (round(c * 10000) === 0) {
      h = Number.NaN;
    }
    return [l, c, h];
  };

  rgb2lch = function rgb2lch() {
    var a, b, g, l, r, ref, ref1;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    ref1 = rgb2lab(r, g, b), l = ref1[0], a = ref1[1], b = ref1[2];
    return lab2lch(l, a, b);
  };

  chroma.lch = function () {
    var args;
    args = unpack(arguments);
    return new Color(args, 'lch');
  };

  chroma.hcl = function () {
    var args;
    args = unpack(arguments);
    return new Color(args, 'hcl');
  };

  _input.lch = lch2rgb;

  _input.hcl = function () {
    var c, h, l, ref;
    ref = unpack(arguments), h = ref[0], c = ref[1], l = ref[2];
    return lch2rgb([l, c, h]);
  };

  Color.prototype.lch = function () {
    return rgb2lch(this._rgb);
  };

  Color.prototype.hcl = function () {
    return rgb2lch(this._rgb).reverse();
  };

  rgb2cmyk = function rgb2cmyk(mode) {
    var b, c, f, g, k, m, r, ref, y;
    if (mode == null) {
      mode = 'rgb';
    }
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = r / 255;
    g = g / 255;
    b = b / 255;
    k = 1 - Math.max(r, Math.max(g, b));
    f = k < 1 ? 1 / (1 - k) : 0;
    c = (1 - r - k) * f;
    m = (1 - g - k) * f;
    y = (1 - b - k) * f;
    return [c, m, y, k];
  };

  cmyk2rgb = function cmyk2rgb() {
    var alpha, args, b, c, g, k, m, r, y;
    args = unpack(arguments);
    c = args[0], m = args[1], y = args[2], k = args[3];
    alpha = args.length > 4 ? args[4] : 1;
    if (k === 1) {
      return [0, 0, 0, alpha];
    }
    r = c >= 1 ? 0 : 255 * (1 - c) * (1 - k);
    g = m >= 1 ? 0 : 255 * (1 - m) * (1 - k);
    b = y >= 1 ? 0 : 255 * (1 - y) * (1 - k);
    return [r, g, b, alpha];
  };

  _input.cmyk = function () {
    return cmyk2rgb(unpack(arguments));
  };

  chroma.cmyk = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['cmyk']), function () {});
  };

  Color.prototype.cmyk = function () {
    return rgb2cmyk(this._rgb);
  };

  _input.gl = function () {
    var i, k, o, rgb, v;
    rgb = function () {
      var ref, results;
      ref = unpack(arguments);
      results = [];
      for (k in ref) {
        v = ref[k];
        results.push(v);
      }
      return results;
    }.apply(this, arguments);
    for (i = o = 0; o <= 2; i = ++o) {
      rgb[i] *= 255;
    }
    return rgb;
  };

  chroma.gl = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['gl']), function () {});
  };

  Color.prototype.gl = function () {
    var rgb;
    rgb = this._rgb;
    return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]];
  };

  rgb2luminance = function rgb2luminance(r, g, b) {
    var ref;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = luminance_x(r);
    g = luminance_x(g);
    b = luminance_x(b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  luminance_x = function luminance_x(x) {
    x /= 255;
    if (x <= 0.03928) {
      return x / 12.92;
    } else {
      return pow((x + 0.055) / 1.055, 2.4);
    }
  };

  _interpolators = [];

  interpolate = function interpolate(col1, col2, f, m) {
    var interpol, len, o, res;
    if (f == null) {
      f = 0.5;
    }
    if (m == null) {
      m = 'rgb';
    }

    /*
    interpolates between colors
    f = 0 --> me
    f = 1 --> col
     */
    if (type(col1) !== 'object') {
      col1 = chroma(col1);
    }
    if (type(col2) !== 'object') {
      col2 = chroma(col2);
    }
    for (o = 0, len = _interpolators.length; o < len; o++) {
      interpol = _interpolators[o];
      if (m === interpol[0]) {
        res = interpol[1](col1, col2, f, m);
        break;
      }
    }
    if (res == null) {
      throw "color mode " + m + " is not supported";
    }
    return res.alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
  };

  chroma.interpolate = interpolate;

  Color.prototype.interpolate = function (col2, f, m) {
    return interpolate(this, col2, f, m);
  };

  chroma.mix = interpolate;

  Color.prototype.mix = Color.prototype.interpolate;

  interpolate_rgb = function interpolate_rgb(col1, col2, f, m) {
    var xyz0, xyz1;
    xyz0 = col1._rgb;
    xyz1 = col2._rgb;
    return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
  };

  _interpolators.push(['rgb', interpolate_rgb]);

  Color.prototype.luminance = function (lum, mode) {
    var cur_lum, eps, max_iter, _test;
    if (mode == null) {
      mode = 'rgb';
    }
    if (!arguments.length) {
      return rgb2luminance(this._rgb);
    }
    if (lum === 0) {
      this._rgb = [0, 0, 0, this._rgb[3]];
    } else if (lum === 1) {
      this._rgb = [255, 255, 255, this._rgb[3]];
    } else {
      eps = 1e-7;
      max_iter = 20;
      _test = function test(l, h) {
        var lm, m;
        m = l.interpolate(h, 0.5, mode);
        lm = m.luminance();
        if (Math.abs(lum - lm) < eps || !max_iter--) {
          return m;
        }
        if (lm > lum) {
          return _test(l, m);
        }
        return _test(m, h);
      };
      cur_lum = rgb2luminance(this._rgb);
      this._rgb = (cur_lum > lum ? _test(chroma('black'), this) : _test(this, chroma('white'))).rgba();
    }
    return this;
  };

  temperature2rgb = function temperature2rgb(kelvin) {
    var b, g, r, temp;
    temp = kelvin / 100;
    if (temp < 66) {
      r = 255;
      g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
      b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
    } else {
      r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
      g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
      b = 255;
    }
    return [r, g, b];
  };

  rgb2temperature = function rgb2temperature() {
    var b, eps, g, maxTemp, minTemp, r, ref, rgb, temp;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    minTemp = 1000;
    maxTemp = 40000;
    eps = 0.4;
    while (maxTemp - minTemp > eps) {
      temp = (maxTemp + minTemp) * 0.5;
      rgb = temperature2rgb(temp);
      if (rgb[2] / rgb[0] >= b / r) {
        maxTemp = temp;
      } else {
        minTemp = temp;
      }
    }
    return round(temp);
  };

  chroma.temperature = chroma.kelvin = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['temperature']), function () {});
  };

  _input.temperature = _input.kelvin = _input.K = temperature2rgb;

  Color.prototype.temperature = function () {
    return rgb2temperature(this._rgb);
  };

  Color.prototype.kelvin = Color.prototype.temperature;

  chroma.contrast = function (a, b) {
    var l1, l2, ref, ref1;
    if ((ref = type(a)) === 'string' || ref === 'number') {
      a = new Color(a);
    }
    if ((ref1 = type(b)) === 'string' || ref1 === 'number') {
      b = new Color(b);
    }
    l1 = a.luminance();
    l2 = b.luminance();
    if (l1 > l2) {
      return (l1 + 0.05) / (l2 + 0.05);
    } else {
      return (l2 + 0.05) / (l1 + 0.05);
    }
  };

  chroma.distance = function (a, b, mode) {
    var d, i, l1, l2, ref, ref1, sum_sq;
    if (mode == null) {
      mode = 'lab';
    }
    if ((ref = type(a)) === 'string' || ref === 'number') {
      a = new Color(a);
    }
    if ((ref1 = type(b)) === 'string' || ref1 === 'number') {
      b = new Color(b);
    }
    l1 = a.get(mode);
    l2 = b.get(mode);
    sum_sq = 0;
    for (i in l1) {
      d = (l1[i] || 0) - (l2[i] || 0);
      sum_sq += d * d;
    }
    return Math.sqrt(sum_sq);
  };

  chroma.deltaE = function (a, b, L, C) {
    var L1, L2, a1, a2, b1, b2, c1, c2, c4, dH2, delA, delB, delC, delL, f, h1, ref, ref1, ref2, ref3, sc, sh, sl, t, v1, v2, v3;
    if (L == null) {
      L = 1;
    }
    if (C == null) {
      C = 1;
    }
    if ((ref = type(a)) === 'string' || ref === 'number') {
      a = new Color(a);
    }
    if ((ref1 = type(b)) === 'string' || ref1 === 'number') {
      b = new Color(b);
    }
    ref2 = a.lab(), L1 = ref2[0], a1 = ref2[1], b1 = ref2[2];
    ref3 = b.lab(), L2 = ref3[0], a2 = ref3[1], b2 = ref3[2];
    c1 = sqrt(a1 * a1 + b1 * b1);
    c2 = sqrt(a2 * a2 + b2 * b2);
    sl = L1 < 16.0 ? 0.511 : 0.040975 * L1 / (1.0 + 0.01765 * L1);
    sc = 0.0638 * c1 / (1.0 + 0.0131 * c1) + 0.638;
    h1 = c1 < 0.000001 ? 0.0 : atan2(b1, a1) * 180.0 / PI;
    while (h1 < 0) {
      h1 += 360;
    }
    while (h1 >= 360) {
      h1 -= 360;
    }
    t = h1 >= 164.0 && h1 <= 345.0 ? 0.56 + abs(0.2 * cos(PI * (h1 + 168.0) / 180.0)) : 0.36 + abs(0.4 * cos(PI * (h1 + 35.0) / 180.0));
    c4 = c1 * c1 * c1 * c1;
    f = sqrt(c4 / (c4 + 1900.0));
    sh = sc * (f * t + 1.0 - f);
    delL = L1 - L2;
    delC = c1 - c2;
    delA = a1 - a2;
    delB = b1 - b2;
    dH2 = delA * delA + delB * delB - delC * delC;
    v1 = delL / (L * sl);
    v2 = delC / (C * sc);
    v3 = sh;
    return sqrt(v1 * v1 + v2 * v2 + dH2 / (v3 * v3));
  };

  Color.prototype.get = function (modechan) {
    var channel, i, me, mode, ref, src;
    me = this;
    ref = modechan.split('.'), mode = ref[0], channel = ref[1];
    src = me[mode]();
    if (channel) {
      i = mode.indexOf(channel);
      if (i > -1) {
        return src[i];
      } else {
        return console.warn('unknown channel ' + channel + ' in mode ' + mode);
      }
    } else {
      return src;
    }
  };

  Color.prototype.set = function (modechan, value) {
    var channel, i, me, mode, ref, src;
    me = this;
    ref = modechan.split('.'), mode = ref[0], channel = ref[1];
    if (channel) {
      src = me[mode]();
      i = mode.indexOf(channel);
      if (i > -1) {
        if (type(value) === 'string') {
          switch (value.charAt(0)) {
            case '+':
              src[i] += +value;
              break;
            case '-':
              src[i] += +value;
              break;
            case '*':
              src[i] *= +value.substr(1);
              break;
            case '/':
              src[i] /= +value.substr(1);
              break;
            default:
              src[i] = +value;
          }
        } else {
          src[i] = value;
        }
      } else {
        console.warn('unknown channel ' + channel + ' in mode ' + mode);
      }
    } else {
      src = value;
    }
    return chroma(src, mode).alpha(me.alpha());
  };

  Color.prototype.clipped = function () {
    return this._rgb._clipped || false;
  };

  Color.prototype.alpha = function (a) {
    if (arguments.length) {
      return chroma.rgb([this._rgb[0], this._rgb[1], this._rgb[2], a]);
    }
    return this._rgb[3];
  };

  Color.prototype.darken = function (amount) {
    var lab, me;
    if (amount == null) {
      amount = 1;
    }
    me = this;
    lab = me.lab();
    lab[0] -= LAB_CONSTANTS.Kn * amount;
    return chroma.lab(lab).alpha(me.alpha());
  };

  Color.prototype.brighten = function (amount) {
    if (amount == null) {
      amount = 1;
    }
    return this.darken(-amount);
  };

  Color.prototype.darker = Color.prototype.darken;

  Color.prototype.brighter = Color.prototype.brighten;

  Color.prototype.saturate = function (amount) {
    var lch, me;
    if (amount == null) {
      amount = 1;
    }
    me = this;
    lch = me.lch();
    lch[1] += amount * LAB_CONSTANTS.Kn;
    if (lch[1] < 0) {
      lch[1] = 0;
    }
    return chroma.lch(lch).alpha(me.alpha());
  };

  Color.prototype.desaturate = function (amount) {
    if (amount == null) {
      amount = 1;
    }
    return this.saturate(-amount);
  };

  Color.prototype.premultiply = function () {
    var a, rgb;
    rgb = this.rgb();
    a = this.alpha();
    return chroma(rgb[0] * a, rgb[1] * a, rgb[2] * a, a);
  };

  _blend = function blend(bottom, top, mode) {
    if (!_blend[mode]) {
      throw 'unknown blend mode ' + mode;
    }
    return _blend[mode](bottom, top);
  };

  blend_f = function blend_f(f) {
    return function (bottom, top) {
      var c0, c1;
      c0 = chroma(top).rgb();
      c1 = chroma(bottom).rgb();
      return chroma(f(c0, c1), 'rgb');
    };
  };

  each = function each(f) {
    return function (c0, c1) {
      var i, o, out;
      out = [];
      for (i = o = 0; o <= 3; i = ++o) {
        out[i] = f(c0[i], c1[i]);
      }
      return out;
    };
  };

  normal = function normal(a, b) {
    return a;
  };

  multiply = function multiply(a, b) {
    return a * b / 255;
  };

  darken = function darken(a, b) {
    if (a > b) {
      return b;
    } else {
      return a;
    }
  };

  lighten = function lighten(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  screen = function screen(a, b) {
    return 255 * (1 - (1 - a / 255) * (1 - b / 255));
  };

  overlay = function overlay(a, b) {
    if (b < 128) {
      return 2 * a * b / 255;
    } else {
      return 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
    }
  };

  burn = function burn(a, b) {
    return 255 * (1 - (1 - b / 255) / (a / 255));
  };

  dodge = function dodge(a, b) {
    if (a === 255) {
      return 255;
    }
    a = 255 * (b / 255) / (1 - a / 255);
    if (a > 255) {
      return 255;
    } else {
      return a;
    }
  };

  _blend.normal = blend_f(each(normal));

  _blend.multiply = blend_f(each(multiply));

  _blend.screen = blend_f(each(screen));

  _blend.overlay = blend_f(each(overlay));

  _blend.darken = blend_f(each(darken));

  _blend.lighten = blend_f(each(lighten));

  _blend.dodge = blend_f(each(dodge));

  _blend.burn = blend_f(each(burn));

  chroma.blend = _blend;

  chroma.analyze = function (data) {
    var len, o, r, val;
    r = {
      min: Number.MAX_VALUE,
      max: Number.MAX_VALUE * -1,
      sum: 0,
      values: [],
      count: 0
    };
    for (o = 0, len = data.length; o < len; o++) {
      val = data[o];
      if (val != null && !isNaN(val)) {
        r.values.push(val);
        r.sum += val;
        if (val < r.min) {
          r.min = val;
        }
        if (val > r.max) {
          r.max = val;
        }
        r.count += 1;
      }
    }
    r.domain = [r.min, r.max];
    r.limits = function (mode, num) {
      return chroma.limits(r, mode, num);
    };
    return r;
  };

  chroma.scale = function (colors, positions) {
    var _classes, _colorCache, _colors, _correctLightness, _domain, _fixed, _max, _min, _mode, _nacol, _out, _padding, _pos, _spread, _useCache, classifyValue, f, getClass, getColor, resetCache, setColors, tmap;
    _mode = 'rgb';
    _nacol = chroma('#ccc');
    _spread = 0;
    _fixed = false;
    _domain = [0, 1];
    _pos = [];
    _padding = [0, 0];
    _classes = false;
    _colors = [];
    _out = false;
    _min = 0;
    _max = 1;
    _correctLightness = false;
    _colorCache = {};
    _useCache = true;
    setColors = function setColors(colors) {
      var c, col, o, ref, ref1, w;
      if (colors == null) {
        colors = ['#fff', '#000'];
      }
      if (colors != null && type(colors) === 'string' && chroma.brewer != null) {
        colors = chroma.brewer[colors] || chroma.brewer[colors.toLowerCase()] || colors;
      }
      if (type(colors) === 'array') {
        colors = colors.slice(0);
        for (c = o = 0, ref = colors.length - 1; 0 <= ref ? o <= ref : o >= ref; c = 0 <= ref ? ++o : --o) {
          col = colors[c];
          if (type(col) === "string") {
            colors[c] = chroma(col);
          }
        }
        _pos.length = 0;
        for (c = w = 0, ref1 = colors.length - 1; 0 <= ref1 ? w <= ref1 : w >= ref1; c = 0 <= ref1 ? ++w : --w) {
          _pos.push(c / (colors.length - 1));
        }
      }
      resetCache();
      return _colors = colors;
    };
    getClass = function getClass(value) {
      var i, n;
      if (_classes != null) {
        n = _classes.length - 1;
        i = 0;
        while (i < n && value >= _classes[i]) {
          i++;
        }
        return i - 1;
      }
      return 0;
    };
    tmap = function tmap(t) {
      return t;
    };
    classifyValue = function classifyValue(value) {
      var i, maxc, minc, n, val;
      val = value;
      if (_classes.length > 2) {
        n = _classes.length - 1;
        i = getClass(value);
        minc = _classes[0] + (_classes[1] - _classes[0]) * (0 + _spread * 0.5);
        maxc = _classes[n - 1] + (_classes[n] - _classes[n - 1]) * (1 - _spread * 0.5);
        val = _min + (_classes[i] + (_classes[i + 1] - _classes[i]) * 0.5 - minc) / (maxc - minc) * (_max - _min);
      }
      return val;
    };
    getColor = function getColor(val, bypassMap) {
      var c, col, i, k, o, p, ref, t;
      if (bypassMap == null) {
        bypassMap = false;
      }
      if (isNaN(val)) {
        return _nacol;
      }
      if (!bypassMap) {
        if (_classes && _classes.length > 2) {
          c = getClass(val);
          t = c / (_classes.length - 2);
          t = _padding[0] + t * (1 - _padding[0] - _padding[1]);
        } else if (_max !== _min) {
          t = (val - _min) / (_max - _min);
          t = _padding[0] + t * (1 - _padding[0] - _padding[1]);
          t = Math.min(1, Math.max(0, t));
        } else {
          t = 1;
        }
      } else {
        t = val;
      }
      if (!bypassMap) {
        t = tmap(t);
      }
      k = Math.floor(t * 10000);
      if (_useCache && _colorCache[k]) {
        col = _colorCache[k];
      } else {
        if (type(_colors) === 'array') {
          for (i = o = 0, ref = _pos.length - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
            p = _pos[i];
            if (t <= p) {
              col = _colors[i];
              break;
            }
            if (t >= p && i === _pos.length - 1) {
              col = _colors[i];
              break;
            }
            if (t > p && t < _pos[i + 1]) {
              t = (t - p) / (_pos[i + 1] - p);
              col = chroma.interpolate(_colors[i], _colors[i + 1], t, _mode);
              break;
            }
          }
        } else if (type(_colors) === 'function') {
          col = _colors(t);
        }
        if (_useCache) {
          _colorCache[k] = col;
        }
      }
      return col;
    };
    resetCache = function resetCache() {
      return _colorCache = {};
    };
    setColors(colors);
    f = function f(v) {
      var c;
      c = chroma(getColor(v));
      if (_out && c[_out]) {
        return c[_out]();
      } else {
        return c;
      }
    };
    f.classes = function (classes) {
      var d;
      if (classes != null) {
        if (type(classes) === 'array') {
          _classes = classes;
          _domain = [classes[0], classes[classes.length - 1]];
        } else {
          d = chroma.analyze(_domain);
          if (classes === 0) {
            _classes = [d.min, d.max];
          } else {
            _classes = chroma.limits(d, 'e', classes);
          }
        }
        return f;
      }
      return _classes;
    };
    f.domain = function (domain) {
      var c, d, k, len, o, ref, w;
      if (!arguments.length) {
        return _domain;
      }
      _min = domain[0];
      _max = domain[domain.length - 1];
      _pos = [];
      k = _colors.length;
      if (domain.length === k && _min !== _max) {
        for (o = 0, len = domain.length; o < len; o++) {
          d = domain[o];
          _pos.push((d - _min) / (_max - _min));
        }
      } else {
        for (c = w = 0, ref = k - 1; 0 <= ref ? w <= ref : w >= ref; c = 0 <= ref ? ++w : --w) {
          _pos.push(c / (k - 1));
        }
      }
      _domain = [_min, _max];
      return f;
    };
    f.mode = function (_m) {
      if (!arguments.length) {
        return _mode;
      }
      _mode = _m;
      resetCache();
      return f;
    };
    f.range = function (colors, _pos) {
      setColors(colors, _pos);
      return f;
    };
    f.out = function (_o) {
      _out = _o;
      return f;
    };
    f.spread = function (val) {
      if (!arguments.length) {
        return _spread;
      }
      _spread = val;
      return f;
    };
    f.correctLightness = function (v) {
      if (v == null) {
        v = true;
      }
      _correctLightness = v;
      resetCache();
      if (_correctLightness) {
        tmap = function tmap(t) {
          var L0, L1, L_actual, L_diff, L_ideal, max_iter, pol, t0, t1;
          L0 = getColor(0, true).lab()[0];
          L1 = getColor(1, true).lab()[0];
          pol = L0 > L1;
          L_actual = getColor(t, true).lab()[0];
          L_ideal = L0 + (L1 - L0) * t;
          L_diff = L_actual - L_ideal;
          t0 = 0;
          t1 = 1;
          max_iter = 20;
          while (Math.abs(L_diff) > 1e-2 && max_iter-- > 0) {
            (function () {
              if (pol) {
                L_diff *= -1;
              }
              if (L_diff < 0) {
                t0 = t;
                t += (t1 - t) * 0.5;
              } else {
                t1 = t;
                t += (t0 - t) * 0.5;
              }
              L_actual = getColor(t, true).lab()[0];
              return L_diff = L_actual - L_ideal;
            })();
          }
          return t;
        };
      } else {
        tmap = function tmap(t) {
          return t;
        };
      }
      return f;
    };
    f.padding = function (p) {
      if (p != null) {
        if (type(p) === 'number') {
          p = [p, p];
        }
        _padding = p;
        return f;
      } else {
        return _padding;
      }
    };
    f.colors = function (numColors, out) {
      var dd, dm, i, o, ref, result, results, samples, w;
      if (arguments.length < 2) {
        out = 'hex';
      }
      result = [];
      if (arguments.length === 0) {
        result = _colors.slice(0);
      } else if (numColors === 1) {
        result = [f(0.5)];
      } else if (numColors > 1) {
        dm = _domain[0];
        dd = _domain[1] - dm;
        result = function () {
          results = [];
          for (var o = 0; 0 <= numColors ? o < numColors : o > numColors; 0 <= numColors ? o++ : o--) {
            results.push(o);
          }
          return results;
        }.apply(this).map(function (i) {
          return f(dm + i / (numColors - 1) * dd);
        });
      } else {
        colors = [];
        samples = [];
        if (_classes && _classes.length > 2) {
          for (i = w = 1, ref = _classes.length; 1 <= ref ? w < ref : w > ref; i = 1 <= ref ? ++w : --w) {
            samples.push((_classes[i - 1] + _classes[i]) * 0.5);
          }
        } else {
          samples = _domain;
        }
        result = samples.map(function (v) {
          return f(v);
        });
      }
      if (chroma[out]) {
        result = result.map(function (c) {
          return c[out]();
        });
      }
      return result;
    };
    f.cache = function (c) {
      if (c != null) {
        return _useCache = c;
      } else {
        return _useCache;
      }
    };
    return f;
  };

  if (chroma.scales == null) {
    chroma.scales = {};
  }

  chroma.scales.cool = function () {
    return chroma.scale([chroma.hsl(180, 1, .9), chroma.hsl(250, .7, .4)]);
  };

  chroma.scales.hot = function () {
    return chroma.scale(['#000', '#f00', '#ff0', '#fff'], [0, .25, .75, 1]).mode('rgb');
  };

  chroma.analyze = function (data, key, filter) {
    var add, k, len, o, r, val, visit;
    r = {
      min: Number.MAX_VALUE,
      max: Number.MAX_VALUE * -1,
      sum: 0,
      values: [],
      count: 0
    };
    if (filter == null) {
      filter = function filter() {
        return true;
      };
    }
    add = function add(val) {
      if (val != null && !isNaN(val)) {
        r.values.push(val);
        r.sum += val;
        if (val < r.min) {
          r.min = val;
        }
        if (val > r.max) {
          r.max = val;
        }
        r.count += 1;
      }
    };
    visit = function visit(val, k) {
      if (filter(val, k)) {
        if (key != null && type(key) === 'function') {
          return add(key(val));
        } else if (key != null && type(key) === 'string' || type(key) === 'number') {
          return add(val[key]);
        } else {
          return add(val);
        }
      }
    };
    if (type(data) === 'array') {
      for (o = 0, len = data.length; o < len; o++) {
        val = data[o];
        visit(val);
      }
    } else {
      for (k in data) {
        val = data[k];
        visit(val, k);
      }
    }
    r.domain = [r.min, r.max];
    r.limits = function (mode, num) {
      return chroma.limits(r, mode, num);
    };
    return r;
  };

  chroma.limits = function (data, mode, num) {
    var aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, assignments, best, centroids, cluster, clusterSizes, dist, i, j, kClusters, limits, max_log, min, min_log, mindist, n, nb_iters, newCentroids, o, p, pb, pr, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, repeat, sum, tmpKMeansBreaks, v, value, values, w;
    if (mode == null) {
      mode = 'equal';
    }
    if (num == null) {
      num = 7;
    }
    if (type(data) === 'array') {
      data = chroma.analyze(data);
    }
    min = data.min;
    max = data.max;
    sum = data.sum;
    values = data.values.sort(function (a, b) {
      return a - b;
    });
    if (num === 1) {
      return [min, max];
    }
    limits = [];
    if (mode.substr(0, 1) === 'c') {
      limits.push(min);
      limits.push(max);
    }
    if (mode.substr(0, 1) === 'e') {
      limits.push(min);
      for (i = o = 1, ref = num - 1; 1 <= ref ? o <= ref : o >= ref; i = 1 <= ref ? ++o : --o) {
        limits.push(min + i / num * (max - min));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'l') {
      if (min <= 0) {
        throw 'Logarithmic scales are only possible for values > 0';
      }
      min_log = Math.LOG10E * log(min);
      max_log = Math.LOG10E * log(max);
      limits.push(min);
      for (i = w = 1, ref1 = num - 1; 1 <= ref1 ? w <= ref1 : w >= ref1; i = 1 <= ref1 ? ++w : --w) {
        limits.push(pow(10, min_log + i / num * (max_log - min_log)));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'q') {
      limits.push(min);
      for (i = aa = 1, ref2 = num - 1; 1 <= ref2 ? aa <= ref2 : aa >= ref2; i = 1 <= ref2 ? ++aa : --aa) {
        p = (values.length - 1) * i / num;
        pb = floor(p);
        if (pb === p) {
          limits.push(values[pb]);
        } else {
          pr = p - pb;
          limits.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
        }
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'k') {

      /*
      implementation based on
      http://code.google.com/p/figue/source/browse/trunk/figue.js#336
      simplified for 1-d input values
       */
      n = values.length;
      assignments = new Array(n);
      clusterSizes = new Array(num);
      repeat = true;
      nb_iters = 0;
      centroids = null;
      centroids = [];
      centroids.push(min);
      for (i = ab = 1, ref3 = num - 1; 1 <= ref3 ? ab <= ref3 : ab >= ref3; i = 1 <= ref3 ? ++ab : --ab) {
        centroids.push(min + i / num * (max - min));
      }
      centroids.push(max);
      while (repeat) {
        for (j = ac = 0, ref4 = num - 1; 0 <= ref4 ? ac <= ref4 : ac >= ref4; j = 0 <= ref4 ? ++ac : --ac) {
          clusterSizes[j] = 0;
        }
        for (i = ad = 0, ref5 = n - 1; 0 <= ref5 ? ad <= ref5 : ad >= ref5; i = 0 <= ref5 ? ++ad : --ad) {
          value = values[i];
          mindist = Number.MAX_VALUE;
          for (j = ae = 0, ref6 = num - 1; 0 <= ref6 ? ae <= ref6 : ae >= ref6; j = 0 <= ref6 ? ++ae : --ae) {
            dist = abs(centroids[j] - value);
            if (dist < mindist) {
              mindist = dist;
              best = j;
            }
          }
          clusterSizes[best]++;
          assignments[i] = best;
        }
        newCentroids = new Array(num);
        for (j = af = 0, ref7 = num - 1; 0 <= ref7 ? af <= ref7 : af >= ref7; j = 0 <= ref7 ? ++af : --af) {
          newCentroids[j] = null;
        }
        for (i = ag = 0, ref8 = n - 1; 0 <= ref8 ? ag <= ref8 : ag >= ref8; i = 0 <= ref8 ? ++ag : --ag) {
          cluster = assignments[i];
          if (newCentroids[cluster] === null) {
            newCentroids[cluster] = values[i];
          } else {
            newCentroids[cluster] += values[i];
          }
        }
        for (j = ah = 0, ref9 = num - 1; 0 <= ref9 ? ah <= ref9 : ah >= ref9; j = 0 <= ref9 ? ++ah : --ah) {
          newCentroids[j] *= 1 / clusterSizes[j];
        }
        repeat = false;
        for (j = ai = 0, ref10 = num - 1; 0 <= ref10 ? ai <= ref10 : ai >= ref10; j = 0 <= ref10 ? ++ai : --ai) {
          if (newCentroids[j] !== centroids[i]) {
            repeat = true;
            break;
          }
        }
        centroids = newCentroids;
        nb_iters++;
        if (nb_iters > 200) {
          repeat = false;
        }
      }
      kClusters = {};
      for (j = aj = 0, ref11 = num - 1; 0 <= ref11 ? aj <= ref11 : aj >= ref11; j = 0 <= ref11 ? ++aj : --aj) {
        kClusters[j] = [];
      }
      for (i = ak = 0, ref12 = n - 1; 0 <= ref12 ? ak <= ref12 : ak >= ref12; i = 0 <= ref12 ? ++ak : --ak) {
        cluster = assignments[i];
        kClusters[cluster].push(values[i]);
      }
      tmpKMeansBreaks = [];
      for (j = al = 0, ref13 = num - 1; 0 <= ref13 ? al <= ref13 : al >= ref13; j = 0 <= ref13 ? ++al : --al) {
        tmpKMeansBreaks.push(kClusters[j][0]);
        tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1]);
      }
      tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a, b) {
        return a - b;
      });
      limits.push(tmpKMeansBreaks[0]);
      for (i = am = 1, ref14 = tmpKMeansBreaks.length - 1; am <= ref14; i = am += 2) {
        v = tmpKMeansBreaks[i];
        if (!isNaN(v) && limits.indexOf(v) === -1) {
          limits.push(v);
        }
      }
    }
    return limits;
  };

  hsi2rgb = function hsi2rgb(h, s, i) {

    /*
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
     */
    var args, b, g, r;
    args = unpack(arguments);
    h = args[0], s = args[1], i = args[2];
    if (isNaN(h)) {
      h = 0;
    }
    h /= 360;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      g = 1 - (b + r);
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      b = 1 - (r + g);
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      r = 1 - (g + b);
    }
    r = limit(i * r * 3);
    g = limit(i * g * 3);
    b = limit(i * b * 3);
    return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1];
  };

  rgb2hsi = function rgb2hsi() {

    /*
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
     */
    var b, g, h, i, min, r, ref, s;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    TWOPI = Math.PI * 2;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    i = (r + g + b) / 3;
    s = 1 - min / i;
    if (s === 0) {
      h = 0;
    } else {
      h = (r - g + (r - b)) / 2;
      h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
      h = Math.acos(h);
      if (b > g) {
        h = TWOPI - h;
      }
      h /= TWOPI;
    }
    return [h * 360, s, i];
  };

  chroma.hsi = function () {
    return function (func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor(),
          result = func.apply(child, args);
      return Object(result) === result ? result : child;
    }(Color, slice.call(arguments).concat(['hsi']), function () {});
  };

  _input.hsi = hsi2rgb;

  Color.prototype.hsi = function () {
    return rgb2hsi(this._rgb);
  };

  interpolate_hsx = function interpolate_hsx(col1, col2, f, m) {
    var dh, hue, hue0, hue1, lbv, lbv0, lbv1, res, sat, sat0, sat1, xyz0, xyz1;
    if (m === 'hsl') {
      xyz0 = col1.hsl();
      xyz1 = col2.hsl();
    } else if (m === 'hsv') {
      xyz0 = col1.hsv();
      xyz1 = col2.hsv();
    } else if (m === 'hcg') {
      xyz0 = col1.hcg();
      xyz1 = col2.hcg();
    } else if (m === 'hsi') {
      xyz0 = col1.hsi();
      xyz1 = col2.hsi();
    } else if (m === 'lch' || m === 'hcl') {
      m = 'hcl';
      xyz0 = col1.hcl();
      xyz1 = col2.hcl();
    }
    if (m.substr(0, 1) === 'h') {
      hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
      hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2];
    }
    if (!isNaN(hue0) && !isNaN(hue1)) {
      if (hue1 > hue0 && hue1 - hue0 > 180) {
        dh = hue1 - (hue0 + 360);
      } else if (hue1 < hue0 && hue0 - hue1 > 180) {
        dh = hue1 + 360 - hue0;
      } else {
        dh = hue1 - hue0;
      }
      hue = hue0 + f * dh;
    } else if (!isNaN(hue0)) {
      hue = hue0;
      if ((lbv1 === 1 || lbv1 === 0) && m !== 'hsv') {
        sat = sat0;
      }
    } else if (!isNaN(hue1)) {
      hue = hue1;
      if ((lbv0 === 1 || lbv0 === 0) && m !== 'hsv') {
        sat = sat1;
      }
    } else {
      hue = Number.NaN;
    }
    if (sat == null) {
      sat = sat0 + f * (sat1 - sat0);
    }
    lbv = lbv0 + f * (lbv1 - lbv0);
    return res = chroma[m](hue, sat, lbv);
  };

  _interpolators = _interpolators.concat(function () {
    var len, o, ref, results;
    ref = ['hsv', 'hsl', 'hsi', 'hcl', 'lch', 'hcg'];
    results = [];
    for (o = 0, len = ref.length; o < len; o++) {
      m = ref[o];
      results.push([m, interpolate_hsx]);
    }
    return results;
  }());

  interpolate_num = function interpolate_num(col1, col2, f, m) {
    var n1, n2;
    n1 = col1.num();
    n2 = col2.num();
    return chroma.num(n1 + (n2 - n1) * f, 'num');
  };

  _interpolators.push(['num', interpolate_num]);

  interpolate_lab = function interpolate_lab(col1, col2, f, m) {
    var res, xyz0, xyz1;
    xyz0 = col1.lab();
    xyz1 = col2.lab();
    return res = new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
  };

  _interpolators.push(['lab', interpolate_lab]);
}).call(commonjsGlobal);
});

var pi = Math.PI;
var tau = 2 * pi;
var epsilon$2 = 1e-6;
var tauEpsilon = tau - epsilon$2;

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
    else if (!(l01_2 > epsilon$2)) {}

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$2) || !r) {
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
                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21;

            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > epsilon$2) {
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
    else if (Math.abs(this._x1 - x0) > epsilon$2 || Math.abs(this._y1 - y0) > epsilon$2) {
        this._ += "L" + x0 + "," + y0;
      }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon$2) {
        this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
  },
  rect: function rect(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function toString() {
    return this._;
  }
};

var constant$4 = function (x) {
  return function constant() {
    return x;
  };
};

var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max$3 = Math.max;
var min$3 = Math.min;
var sin = Math.sin;
var sqrt$1 = Math.sqrt;

var epsilon$3 = 1e-12;
var pi$1 = Math.PI;
var halfPi = pi$1 / 2;
var tau$1 = 2 * pi$1;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
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
      d = (dy < 0 ? -1 : 1) * sqrt$1(max$3(0, r * r * d2 - D * D)),
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

var arc = function () {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$4(0),
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
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$3)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$3) {
        context.moveTo(r1 * cos(a0), r1 * sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon$3) {
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
              rp = ap > epsilon$3 && (padRadius ? +padRadius.apply(this, arguments) : sqrt$1(r0 * r0 + r1 * r1)),
              rc = min$3(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1;

          // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
          if (rp > epsilon$3) {
            var p0 = asin(rp / r0 * sin(ap)),
                p1 = asin(rp / r1 * sin(ap));
            if ((da0 -= p0 * 2) > epsilon$3) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > epsilon$3) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * cos(a01),
              y01 = r1 * sin(a01),
              x10 = r0 * cos(a10),
              y10 = r0 * sin(a10);

          // Apply rounded corners?
          if (rc > epsilon$3) {
            var x11 = r1 * cos(a11),
                y11 = r1 * sin(a11),
                x00 = r0 * cos(a00),
                y00 = r0 * sin(a00);

            // Restrict the corner radius according to the sector angle.
            if (da < pi$1) {
              var oc = da0 > epsilon$3 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                  ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt$1(ax * ax + ay * ay) * sqrt$1(bx * bx + by * by))) / 2),
                  lc = sqrt$1(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = min$3(rc, (r0 - lc) / (kc - 1));
              rc1 = min$3(rc, (r1 - lc) / (kc + 1));
            }
          }

          // Is the sector collapsed to a line?
          if (!(da1 > epsilon$3)) context.moveTo(x01, y01);

          // Does the sector’s outer ring have rounded corners?
          else if (rc1 > epsilon$3) {
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
          if (!(r0 > epsilon$3) || !(da0 > epsilon$3)) context.lineTo(x10, y10);

          // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > epsilon$3) {
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
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function (_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : padAngle;
  };

  arc.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };

  return arc;
};

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2; // proceed
      default:
        this._context.lineTo(x, y);break;
    }
  }
};

var curveLinear = function (context) {
  return new Linear(context);
};

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

function sign$2(x) {
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
  return (sign$2(s0) + sign$2(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
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

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function (name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
};

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

var creator = function (name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
};

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

var selection_on = function (typename, value, capture) {
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
};

var sourceEvent = function () {
  var current = event,
      source;
  while (source = current.sourceEvent) {
    current = source;
  }return current;
};

var point$1 = function (node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
};

var mouse$1 = function (node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point$1(node, event);
};

function none$2() {}

var selector = function (selector) {
  return selector == null ? none$2 : function () {
    return this.querySelector(selector);
  };
};

var selection_select = function (select) {
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
};

function empty() {
  return [];
}

var selectorAll = function (selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function (select) {
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
};

var selection_filter = function (match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function (update) {
  return new Array(update.length);
};

var selection_enter = function () {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

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

var constant$5 = function (x) {
  return function () {
    return x;
  };
};

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

var selection_data = function (value, key) {
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

  if (typeof value !== "function") value = constant$5(value);

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
};

var selection_exit = function () {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_merge = function (selection$$1) {

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
};

var selection_order = function () {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function (compare) {
  if (!compare) compare = ascending$2;

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
};

function ascending$2(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function () {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function () {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
};

var selection_node = function () {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function () {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
};

var selection_empty = function () {
  return !this.node();
};

var selection_each = function (callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

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

var selection_attr = function (name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
};

var defaultView = function (node) {
    return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
    node.document && node // node is a Window
    || node.defaultView; // node is a Document
};

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

var selection_style = function (name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
};

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

var selection_property = function (name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
};

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

var selection_classed = function (name, value) {
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
};

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

var selection_text = function (value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
};

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

var selection_html = function (value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
};

function raise$1() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function () {
  return this.each(raise$1);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function () {
  return this.each(lower);
};

var selection_append = function (name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function (name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function () {
  return this.each(remove);
};

var selection_datum = function (value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
};

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

var selection_dispatch = function (type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
};

var root$1 = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root$1);
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
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function (selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root$1);
};

var selectAll$1 = function (selector) {
    return typeof selector === "string" ? new Selection([document.querySelectorAll(selector)], [document.documentElement]) : new Selection([selector == null ? [] : selector], root$1);
};

var constant$6 = function (x) {
  return function () {
    return x;
  };
};

function x$1(d) {
  return d[0];
}

function y$1(d) {
  return d[1];
}

function RedBlackTree() {
  this._ = null; // root node
}

function RedBlackNode(node) {
  node.U = // parent node
  node.C = // color - true for red, false for black
  node.L = // left node
  node.R = // right node
  node.P = // previous node
  node.N = null; // next node
}

RedBlackTree.prototype = {
  constructor: RedBlackTree,

  insert: function insert(after, node) {
    var parent, grandpa, uncle;

    if (after) {
      node.P = after;
      node.N = after.N;
      if (after.N) after.N.P = node;
      after.N = node;
      if (after.R) {
        after = after.R;
        while (after.L) {
          after = after.L;
        }after.L = node;
      } else {
        after.R = node;
      }
      parent = after;
    } else if (this._) {
      after = RedBlackFirst(this._);
      node.P = null;
      node.N = after;
      after.P = after.L = node;
      parent = after;
    } else {
      node.P = node.N = null;
      this._ = node;
      parent = null;
    }
    node.L = node.R = null;
    node.U = parent;
    node.C = true;

    after = node;
    while (parent && parent.C) {
      grandpa = parent.U;
      if (parent === grandpa.L) {
        uncle = grandpa.R;
        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.R) {
            RedBlackRotateLeft(this, parent);
            after = parent;
            parent = after.U;
          }
          parent.C = false;
          grandpa.C = true;
          RedBlackRotateRight(this, grandpa);
        }
      } else {
        uncle = grandpa.L;
        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.L) {
            RedBlackRotateRight(this, parent);
            after = parent;
            parent = after.U;
          }
          parent.C = false;
          grandpa.C = true;
          RedBlackRotateLeft(this, grandpa);
        }
      }
      parent = after.U;
    }
    this._.C = false;
  },

  remove: function remove(node) {
    if (node.N) node.N.P = node.P;
    if (node.P) node.P.N = node.N;
    node.N = node.P = null;

    var parent = node.U,
        sibling,
        left = node.L,
        right = node.R,
        next,
        red;

    if (!left) next = right;else if (!right) next = left;else next = RedBlackFirst(right);

    if (parent) {
      if (parent.L === node) parent.L = next;else parent.R = next;
    } else {
      this._ = next;
    }

    if (left && right) {
      red = next.C;
      next.C = node.C;
      next.L = left;
      left.U = next;
      if (next !== right) {
        parent = next.U;
        next.U = node.U;
        node = next.R;
        parent.L = node;
        next.R = right;
        right.U = next;
      } else {
        next.U = parent;
        parent = next;
        node = next.R;
      }
    } else {
      red = node.C;
      node = next;
    }

    if (node) node.U = parent;
    if (red) return;
    if (node && node.C) {
      node.C = false;return;
    }

    do {
      if (node === this._) break;
      if (node === parent.L) {
        sibling = parent.R;
        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateLeft(this, parent);
          sibling = parent.R;
        }
        if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
          if (!sibling.R || !sibling.R.C) {
            sibling.L.C = false;
            sibling.C = true;
            RedBlackRotateRight(this, sibling);
            sibling = parent.R;
          }
          sibling.C = parent.C;
          parent.C = sibling.R.C = false;
          RedBlackRotateLeft(this, parent);
          node = this._;
          break;
        }
      } else {
        sibling = parent.L;
        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateRight(this, parent);
          sibling = parent.L;
        }
        if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
          if (!sibling.L || !sibling.L.C) {
            sibling.R.C = false;
            sibling.C = true;
            RedBlackRotateLeft(this, sibling);
            sibling = parent.L;
          }
          sibling.C = parent.C;
          parent.C = sibling.L.C = false;
          RedBlackRotateRight(this, parent);
          node = this._;
          break;
        }
      }
      sibling.C = true;
      node = parent;
      parent = parent.U;
    } while (!node.C);

    if (node) node.C = false;
  }
};

function RedBlackRotateLeft(tree, node) {
  var p = node,
      q = node.R,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.R = q.L;
  if (p.R) p.R.U = p;
  q.L = p;
}

function RedBlackRotateRight(tree, node) {
  var p = node,
      q = node.L,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.L = q.R;
  if (p.L) p.L.U = p;
  q.R = p;
}

function RedBlackFirst(node) {
  while (node.L) {
    node = node.L;
  }return node;
}

function createEdge(left, right, v0, v1) {
  var edge = [null, null],
      index = edges.push(edge) - 1;
  edge.left = left;
  edge.right = right;
  if (v0) setEdgeEnd(edge, left, right, v0);
  if (v1) setEdgeEnd(edge, right, left, v1);
  cells[left.index].halfedges.push(index);
  cells[right.index].halfedges.push(index);
  return edge;
}

function createBorderEdge(left, v0, v1) {
  var edge = [v0, v1];
  edge.left = left;
  return edge;
}

function setEdgeEnd(edge, left, right, vertex) {
  if (!edge[0] && !edge[1]) {
    edge[0] = vertex;
    edge.left = left;
    edge.right = right;
  } else if (edge.left === right) {
    edge[1] = vertex;
  } else {
    edge[0] = vertex;
  }
}

// Liang–Barsky line clipping.
function clipEdge(edge, x0, y0, x1, y1) {
  var a = edge[0],
      b = edge[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
  return true;
}

function connectEdge(edge, x0, y0, x1, y1) {
  var v1 = edge[1];
  if (v1) return true;

  var v0 = edge[0],
      left = edge.left,
      right = edge.right,
      lx = left[0],
      ly = left[1],
      rx = right[0],
      ry = right[1],
      fx = (lx + rx) / 2,
      fy = (ly + ry) / 2,
      fm,
      fb;

  if (ry === ly) {
    if (fx < x0 || fx >= x1) return;
    if (lx > rx) {
      if (!v0) v0 = [fx, y0];else if (v0[1] >= y1) return;
      v1 = [fx, y1];
    } else {
      if (!v0) v0 = [fx, y1];else if (v0[1] < y0) return;
      v1 = [fx, y0];
    }
  } else {
    fm = (lx - rx) / (ry - ly);
    fb = fy - fm * fx;
    if (fm < -1 || fm > 1) {
      if (lx > rx) {
        if (!v0) v0 = [(y0 - fb) / fm, y0];else if (v0[1] >= y1) return;
        v1 = [(y1 - fb) / fm, y1];
      } else {
        if (!v0) v0 = [(y1 - fb) / fm, y1];else if (v0[1] < y0) return;
        v1 = [(y0 - fb) / fm, y0];
      }
    } else {
      if (ly < ry) {
        if (!v0) v0 = [x0, fm * x0 + fb];else if (v0[0] >= x1) return;
        v1 = [x1, fm * x1 + fb];
      } else {
        if (!v0) v0 = [x1, fm * x1 + fb];else if (v0[0] < x0) return;
        v1 = [x0, fm * x0 + fb];
      }
    }
  }

  edge[0] = v0;
  edge[1] = v1;
  return true;
}

function clipEdges(x0, y0, x1, y1) {
  var i = edges.length,
      edge;

  while (i--) {
    if (!connectEdge(edge = edges[i], x0, y0, x1, y1) || !clipEdge(edge, x0, y0, x1, y1) || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon$4 || Math.abs(edge[0][1] - edge[1][1]) > epsilon$4)) {
      delete edges[i];
    }
  }
}

function createCell(site) {
  return cells[site.index] = {
    site: site,
    halfedges: []
  };
}

function cellHalfedgeAngle(cell, edge) {
  var site = cell.site,
      va = edge.left,
      vb = edge.right;
  if (site === vb) vb = va, va = site;
  if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
  if (site === va) va = edge[1], vb = edge[0];else va = edge[0], vb = edge[1];
  return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
}

function cellHalfedgeStart(cell, edge) {
  return edge[+(edge.left !== cell.site)];
}

function cellHalfedgeEnd(cell, edge) {
  return edge[+(edge.left === cell.site)];
}

function sortCellHalfedges() {
  for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) {
    if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
      var index = new Array(m),
          array = new Array(m);
      for (j = 0; j < m; ++j) {
        index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
      }index.sort(function (i, j) {
        return array[j] - array[i];
      });
      for (j = 0; j < m; ++j) {
        array[j] = halfedges[index[j]];
      }for (j = 0; j < m; ++j) {
        halfedges[j] = array[j];
      }
    }
  }
}

function clipCells(x0, y0, x1, y1) {
  var nCells = cells.length,
      iCell,
      cell,
      site,
      iHalfedge,
      halfedges,
      nHalfedges,
      start,
      startX,
      startY,
      end,
      endX,
      endY,
      cover = true;

  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = cells[iCell]) {
      site = cell.site;
      halfedges = cell.halfedges;
      iHalfedge = halfedges.length;

      // Remove any dangling clipped edges.
      while (iHalfedge--) {
        if (!edges[halfedges[iHalfedge]]) {
          halfedges.splice(iHalfedge, 1);
        }
      }

      // Insert any border edges as necessary.
      iHalfedge = 0, nHalfedges = halfedges.length;
      while (iHalfedge < nHalfedges) {
        end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
        start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
        if (Math.abs(endX - startX) > epsilon$4 || Math.abs(endY - startY) > epsilon$4) {
          halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end, Math.abs(endX - x0) < epsilon$4 && y1 - endY > epsilon$4 ? [x0, Math.abs(startX - x0) < epsilon$4 ? startY : y1] : Math.abs(endY - y1) < epsilon$4 && x1 - endX > epsilon$4 ? [Math.abs(startY - y1) < epsilon$4 ? startX : x1, y1] : Math.abs(endX - x1) < epsilon$4 && endY - y0 > epsilon$4 ? [x1, Math.abs(startX - x1) < epsilon$4 ? startY : y0] : Math.abs(endY - y0) < epsilon$4 && endX - x0 > epsilon$4 ? [Math.abs(startY - y0) < epsilon$4 ? startX : x0, y0] : null)) - 1);
          ++nHalfedges;
        }
      }

      if (nHalfedges) cover = false;
    }
  }

  // If there weren’t any edges, have the closest site cover the extent.
  // It doesn’t matter which corner of the extent we measure!
  if (cover) {
    var dx,
        dy,
        d2,
        dc = Infinity;

    for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
      if (cell = cells[iCell]) {
        site = cell.site;
        dx = site[0] - x0;
        dy = site[1] - y0;
        d2 = dx * dx + dy * dy;
        if (d2 < dc) dc = d2, cover = cell;
      }
    }

    if (cover) {
      var v00 = [x0, y0],
          v01 = [x0, y1],
          v11 = [x1, y1],
          v10 = [x1, y0];
      cover.halfedges.push(edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1, edges.push(createBorderEdge(site, v01, v11)) - 1, edges.push(createBorderEdge(site, v11, v10)) - 1, edges.push(createBorderEdge(site, v10, v00)) - 1);
    }
  }

  // Lastly delete any cells with no edges; these were entirely clipped.
  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = cells[iCell]) {
      if (!cell.halfedges.length) {
        delete cells[iCell];
      }
    }
  }
}

var circlePool = [];

var firstCircle;

function Circle() {
  RedBlackNode(this);
  this.x = this.y = this.arc = this.site = this.cy = null;
}

function attachCircle(arc) {
  var lArc = arc.P,
      rArc = arc.N;

  if (!lArc || !rArc) return;

  var lSite = lArc.site,
      cSite = arc.site,
      rSite = rArc.site;

  if (lSite === rSite) return;

  var bx = cSite[0],
      by = cSite[1],
      ax = lSite[0] - bx,
      ay = lSite[1] - by,
      cx = rSite[0] - bx,
      cy = rSite[1] - by;

  var d = 2 * (ax * cy - ay * cx);
  if (d >= -epsilon2$1) return;

  var ha = ax * ax + ay * ay,
      hc = cx * cx + cy * cy,
      x = (cy * ha - ay * hc) / d,
      y = (ax * hc - cx * ha) / d;

  var circle = circlePool.pop() || new Circle();
  circle.arc = arc;
  circle.site = cSite;
  circle.x = x + bx;
  circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

  arc.circle = circle;

  var before = null,
      node = circles._;

  while (node) {
    if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
      if (node.L) node = node.L;else {
        before = node.P;break;
      }
    } else {
      if (node.R) node = node.R;else {
        before = node;break;
      }
    }
  }

  circles.insert(before, circle);
  if (!before) firstCircle = circle;
}

function detachCircle(arc) {
  var circle = arc.circle;
  if (circle) {
    if (!circle.P) firstCircle = circle.N;
    circles.remove(circle);
    circlePool.push(circle);
    RedBlackNode(circle);
    arc.circle = null;
  }
}

var beachPool = [];

function Beach() {
  RedBlackNode(this);
  this.edge = this.site = this.circle = null;
}

function createBeach(site) {
  var beach = beachPool.pop() || new Beach();
  beach.site = site;
  return beach;
}

function detachBeach(beach) {
  detachCircle(beach);
  beaches.remove(beach);
  beachPool.push(beach);
  RedBlackNode(beach);
}

function removeBeach(beach) {
  var circle = beach.circle,
      x = circle.x,
      y = circle.cy,
      vertex = [x, y],
      previous = beach.P,
      next = beach.N,
      disappearing = [beach];

  detachBeach(beach);

  var lArc = previous;
  while (lArc.circle && Math.abs(x - lArc.circle.x) < epsilon$4 && Math.abs(y - lArc.circle.cy) < epsilon$4) {
    previous = lArc.P;
    disappearing.unshift(lArc);
    detachBeach(lArc);
    lArc = previous;
  }

  disappearing.unshift(lArc);
  detachCircle(lArc);

  var rArc = next;
  while (rArc.circle && Math.abs(x - rArc.circle.x) < epsilon$4 && Math.abs(y - rArc.circle.cy) < epsilon$4) {
    next = rArc.N;
    disappearing.push(rArc);
    detachBeach(rArc);
    rArc = next;
  }

  disappearing.push(rArc);
  detachCircle(rArc);

  var nArcs = disappearing.length,
      iArc;
  for (iArc = 1; iArc < nArcs; ++iArc) {
    rArc = disappearing[iArc];
    lArc = disappearing[iArc - 1];
    setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
  }

  lArc = disappearing[0];
  rArc = disappearing[nArcs - 1];
  rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);

  attachCircle(lArc);
  attachCircle(rArc);
}

function addBeach(site) {
  var x = site[0],
      directrix = site[1],
      lArc,
      rArc,
      dxl,
      dxr,
      node = beaches._;

  while (node) {
    dxl = leftBreakPoint(node, directrix) - x;
    if (dxl > epsilon$4) node = node.L;else {
      dxr = x - rightBreakPoint(node, directrix);
      if (dxr > epsilon$4) {
        if (!node.R) {
          lArc = node;
          break;
        }
        node = node.R;
      } else {
        if (dxl > -epsilon$4) {
          lArc = node.P;
          rArc = node;
        } else if (dxr > -epsilon$4) {
          lArc = node;
          rArc = node.N;
        } else {
          lArc = rArc = node;
        }
        break;
      }
    }
  }

  createCell(site);
  var newArc = createBeach(site);
  beaches.insert(lArc, newArc);

  if (!lArc && !rArc) return;

  if (lArc === rArc) {
    detachCircle(lArc);
    rArc = createBeach(lArc.site);
    beaches.insert(newArc, rArc);
    newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
    attachCircle(lArc);
    attachCircle(rArc);
    return;
  }

  if (!rArc) {
    // && lArc
    newArc.edge = createEdge(lArc.site, newArc.site);
    return;
  }

  // else lArc !== rArc
  detachCircle(lArc);
  detachCircle(rArc);

  var lSite = lArc.site,
      ax = lSite[0],
      ay = lSite[1],
      bx = site[0] - ax,
      by = site[1] - ay,
      rSite = rArc.site,
      cx = rSite[0] - ax,
      cy = rSite[1] - ay,
      d = 2 * (bx * cy - by * cx),
      hb = bx * bx + by * by,
      hc = cx * cx + cy * cy,
      vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];

  setEdgeEnd(rArc.edge, lSite, rSite, vertex);
  newArc.edge = createEdge(lSite, site, null, vertex);
  rArc.edge = createEdge(site, rSite, null, vertex);
  attachCircle(lArc);
  attachCircle(rArc);
}

function leftBreakPoint(arc, directrix) {
  var site = arc.site,
      rfocx = site[0],
      rfocy = site[1],
      pby2 = rfocy - directrix;

  if (!pby2) return rfocx;

  var lArc = arc.P;
  if (!lArc) return -Infinity;

  site = lArc.site;
  var lfocx = site[0],
      lfocy = site[1],
      plby2 = lfocy - directrix;

  if (!plby2) return lfocx;

  var hl = lfocx - rfocx,
      aby2 = 1 / pby2 - 1 / plby2,
      b = hl / plby2;

  if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;

  return (rfocx + lfocx) / 2;
}

function rightBreakPoint(arc, directrix) {
  var rArc = arc.N;
  if (rArc) return leftBreakPoint(rArc, directrix);
  var site = arc.site;
  return site[1] === directrix ? site[0] : Infinity;
}

var epsilon$4 = 1e-6;
var epsilon2$1 = 1e-12;
var beaches;
var cells;
var circles;
var edges;

function triangleArea(a, b, c) {
  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
}

function lexicographic(a, b) {
  return b[1] - a[1] || b[0] - a[0];
}

function Diagram(sites, extent) {
  var site = sites.sort(lexicographic).pop(),
      x,
      y,
      circle;

  edges = [];
  cells = new Array(sites.length);
  beaches = new RedBlackTree();
  circles = new RedBlackTree();

  while (true) {
    circle = firstCircle;
    if (site && (!circle || site[1] < circle.y || site[1] === circle.y && site[0] < circle.x)) {
      if (site[0] !== x || site[1] !== y) {
        addBeach(site);
        x = site[0], y = site[1];
      }
      site = sites.pop();
    } else if (circle) {
      removeBeach(circle.arc);
    } else {
      break;
    }
  }

  sortCellHalfedges();

  if (extent) {
    var x0 = +extent[0][0],
        y0 = +extent[0][1],
        x1 = +extent[1][0],
        y1 = +extent[1][1];
    clipEdges(x0, y0, x1, y1);
    clipCells(x0, y0, x1, y1);
  }

  this.edges = edges;
  this.cells = cells;

  beaches = circles = edges = cells = null;
}

Diagram.prototype = {
  constructor: Diagram,

  polygons: function polygons() {
    var edges = this.edges;

    return this.cells.map(function (cell) {
      var polygon = cell.halfedges.map(function (i) {
        return cellHalfedgeStart(cell, edges[i]);
      });
      polygon.data = cell.site.data;
      return polygon;
    });
  },

  triangles: function triangles() {
    var triangles = [],
        edges = this.edges;

    this.cells.forEach(function (cell, i) {
      if (!(m = (halfedges = cell.halfedges).length)) return;
      var site = cell.site,
          halfedges,
          j = -1,
          m,
          s0,
          e1 = edges[halfedges[m - 1]],
          s1 = e1.left === site ? e1.right : e1.left;

      while (++j < m) {
        s0 = s1;
        e1 = edges[halfedges[j]];
        s1 = e1.left === site ? e1.right : e1.left;
        if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
          triangles.push([site.data, s0.data, s1.data]);
        }
      }
    });

    return triangles;
  },

  links: function links() {
    return this.edges.filter(function (edge) {
      return edge.right;
    }).map(function (edge) {
      return {
        source: edge.left.data,
        target: edge.right.data
      };
    });
  },

  find: function find(x, y, radius) {
    var that = this,
        i0,
        i1 = that._found || 0,
        n = that.cells.length,
        cell;

    // Use the previously-found cell, or start with an arbitrary one.
    while (!(cell = that.cells[i1])) {
      if (++i1 >= n) return null;
    }var dx = x - cell.site[0],
        dy = y - cell.site[1],
        d2 = dx * dx + dy * dy;

    // Traverse the half-edges to find a closer cell, if any.
    do {
      cell = that.cells[i0 = i1], i1 = null;
      cell.halfedges.forEach(function (e) {
        var edge = that.edges[e],
            v = edge.left;
        if ((v === cell.site || !v) && !(v = edge.right)) return;
        var vx = x - v[0],
            vy = y - v[1],
            v2 = vx * vx + vy * vy;
        if (v2 < d2) d2 = v2, i1 = v.index;
      });
    } while (i1 !== null);

    that._found = i0;

    return radius == null || d2 <= radius * radius ? cell.site : null;
  }
};

var voronoi = function () {
  var x = x$1,
      y = y$1,
      extent = null;

  function voronoi(data) {
    return new Diagram(data.map(function (d, i) {
      var s = [Math.round(x(d, i, data) / epsilon$4) * epsilon$4, Math.round(y(d, i, data) / epsilon$4) * epsilon$4];
      s.index = i;
      s.data = d;
      return s;
    }), extent);
  }

  voronoi.polygons = function (data) {
    return voronoi(data).polygons();
  };

  voronoi.links = function (data) {
    return voronoi(data).links();
  };

  voronoi.triangles = function (data) {
    return voronoi(data).triangles();
  };

  voronoi.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant$6(+_), voronoi) : x;
  };

  voronoi.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant$6(+_), voronoi) : y;
  };

  voronoi.extent = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
  };

  voronoi.size = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
  };

  return voronoi;
};

var noop$1 = { value: function value() {} };

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
        if ((t = (typename = T[i]).type) && (t = get$2(_[t], typename.name))) return t;
      }return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$4(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set$4(_[t], typename.name, null);
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

function get$2(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$4(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = (typeof performance === "undefined" ? "undefined" : _typeof$1(performance)) === "object" && performance.now ? performance : Date;
var setFrame = (typeof window === "undefined" ? "undefined" : _typeof$1(window)) === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
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
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, delay);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clockNow, interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

var timeout$1 = function (callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
};

var emptyOn = dispatch("start", "end", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

var schedule = function (node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
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
};

function init(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
  return schedule;
}

function set$3(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
  return schedule;
}

function get$1$1(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
  return schedule;
}

function create(node, id, self) {
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

var interrupt = function (node, name) {
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
};

var selection_interrupt = function (name) {
  return this.each(function () {
    interrupt(this, name);
  });
};

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

var transition_tween = function (name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get$1$1(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
};

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function () {
    var schedule$$1 = set$3(this, id);
    (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
  });

  return function (node) {
    return get$1$1(node, id).value[name];
  };
}

var interpolate = function (a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
};

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

var transition_attr = function (name, value) {
  var fullname = namespace(name),
      i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname) : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value + ""));
};

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

var transition_attrTween = function (name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
};

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

var transition_delay = function (value) {
  var id = this._id;

  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$1$1(this.node(), id).delay;
};

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

var transition_duration = function (value) {
  var id = this._id;

  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$1$1(this.node(), id).duration;
};

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    set$3(this, id).ease = value;
  };
}

var transition_ease = function (value) {
  var id = this._id;

  return arguments.length ? this.each(easeConstant(id, value)) : get$1$1(this.node(), id).ease;
};

var transition_filter = function (match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
};

var transition_merge = function (transition$$1) {
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
};

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

var transition_on = function (name, listener) {
  var id = this._id;

  return arguments.length < 2 ? get$1$1(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
};

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;
    for (var i in this.__transition) {
      if (+i !== id) return;
    }if (parent) parent.removeChild(this);
  };
}

var transition_remove = function () {
  return this.on("end.remove", removeFunction(this._id));
};

var transition_select = function (select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$1$1(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
};

var transition_selectAll = function (select$$1) {
  var name = this._name,
      id = this._id;

  if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$1$1(node, id), k = 0, l = children.length; k < l; ++k) {
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
};

var Selection$1 = selection.prototype.constructor;

var transition_selection = function () {
  return new Selection$1(this._groups, this._parents);
};

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

var transition_style = function (name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this.styleTween(name, styleRemove$1(name, i)).on("end.style." + name, styleRemoveEnd(name)) : this.styleTween(name, typeof value === "function" ? styleFunction$1(name, i, tweenValue(this, "style." + name, value)) : styleConstant$1(name, i, value + ""), priority);
};

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

var transition_styleTween = function (name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
};

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

var transition_text = function (value) {
  return this.tween("text", typeof value === "function" ? textFunction$1(tweenValue(this, "text", value)) : textConstant$1(value == null ? "" : value + ""));
};

var transition_transition = function () {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$1$1(node, id0);
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
};

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

var exponent$1 = 3;

var polyIn = function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
}(exponent$1);

var polyOut = function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
}(exponent$1);

var polyInOut = function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
}(exponent$1);

var overshoot = 1.70158;

var backIn = function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;

  return backIn;
}(overshoot);

var backOut = function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
}(overshoot);

var backInOut = function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
}(overshoot);

var tau$2 = 2 * Math.PI;
var amplitude = 1;
var period = 0.3;

var elasticIn = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function (a) {
    return custom(a, p * tau$2);
  };
  elasticIn.period = function (p) {
    return custom(a, p);
  };

  return elasticIn;
}(amplitude, period);

var elasticOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function (a) {
    return custom(a, p * tau$2);
  };
  elasticOut.period = function (p) {
    return custom(a, p);
  };

  return elasticOut;
}(amplitude, period);

var elasticInOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function (a) {
    return custom(a, p * tau$2);
  };
  elasticInOut.period = function (p) {
    return custom(a, p);
  };

  return elasticInOut;
}(amplitude, period);

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

var selection_transition = function (name) {
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
};

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var GRADIENT = 'gradient';
var DISTINCT = 'distinct';
var CATEGORICAL = 'categorical';
// Categorical
var Accent = 'Accent';
var Dark2 = 'Dark2';
var Paired = 'Paired';
var Pastel1 = 'Pastel1';
var Pastel2 = 'Pastel2';
var Set1 = 'Set1';
var Set2 = 'Set2';
var Set3 = 'Set3';

var Category10 = 'Category10';
var Category20 = 'Category20';
var Category20b = 'Category20b';
var Category20c = 'Category20c';

var interpolateCategorical = function interpolateCategorical(_name) {
    switch (_name) {
        // categorical
        case Accent:
            return schemeAccent;

        case Dark2:
            return schemeDark2;

        case Paired:
            return schemePaired;

        case Pastel1:
            return schemePastel1;

        case Pastel2:
            return schemePastel2;

        case Set1:
            return schemeSet1;

        case Set2:
            return schemeSet2;

        case Set3:
            return schemeSet3;

        // categorical
        case Category10:
            return schemeCategory10;

        case Category20:
            return schemeCategory20;

        case Category20b:
            return schemeCategory20b;

        case Category20c:
            return schemeCategory20c;

        default:
            return undefined;
    }
};

// Diverging
var BrBG = 'BrBG';
var PRGn = 'PRGn';
var PiYG = 'PiYG';
var PuOr = 'PuOr';
var RdBu = 'RdBu';
var RdGy = 'RdGy';
var RdYlBu = 'RdYlBu';
var RdYlGn = 'RdYlGn';
var Spectral = 'Spectral';

var interpolateDiverging = function interpolateDiverging(_name) {
    switch (_name) {
        // Diverging
        case BrBG:
            return interpolateBrBG;

        case PRGn:
            return interpolatePRGn;

        case PiYG:
            return interpolatePiYG;

        case PuOr:
            return interpolatePuOr;

        case RdBu:
            return interpolateRdBu;

        case RdGy:
            return interpolateRdGy;

        case RdYlBu:
            return interpolateRdYlBu;

        case RdYlGn:
            return interpolateRdYlGn;

        case Spectral:
            return interpolateSpectral;

        default:
            return undefined;
    }
};

// Sequential (Single Hue)
var Blues = 'Blues';
var Greens = 'Greens';
var Greys = 'Greys';
var Oranges = 'Oranges';
var Purples = 'Purples';
var Reds = 'Reds';

// Sequential (Multi-Hue)
var BuGn = 'BuGn';
var BuPu = 'BuPu';
var GnBu = 'GnBu';
var OrRd = 'OrRd';
var PuBuGn = 'PuBuGn';
var PuBu = 'PuBu';
var PuRd = 'PuRd';
var RdPu = 'RdPu';
var YlGnBu = 'YlGnBu';
var YlGn = 'YlGn';
var YlOrBr = 'YlOrBr';
var YlOrRd = 'YlOrRd';

var Viridis = 'Viridis';
var Inferno = 'Inferno';
var Magma = 'Magma';
var Plasma = 'Plasma';
var Warm = 'Warm';
var Cool = 'Cool';
var Rainbow = 'Rainbow';
var Cubehelix = 'Cubehelix';

var interpolateSequential = function interpolateSequential(_name) {
    switch (_name) {

        // sequential single hue
        case Blues:
            return interpolateBlues;

        case Greens:
            return interpolateGreens;

        case Greys:
            return interpolateGreys;

        case Oranges:
            return interpolateOranges;

        case Reds:
            return interpolateReds;

        case Purples:
            return interpolatePurples;

        // Sequential (Multi-Hue)
        case BuGn:
            return interpolateBuGn;

        case BuPu:
            return interpolateBuPu;

        case GnBu:
            return interpolateGnBu;

        case OrRd:
            return interpolateOrRd;

        case PuBuGn:
            return interpolatePuBuGn;

        case PuBu:
            return interpolatePuBu;

        case PuRd:
            return interpolatePuRd;

        case RdPu:
            return interpolateRdPu;

        case YlGnBu:
            return interpolateYlGnBu;

        case YlGn:
            return interpolateYlGn;

        case YlOrBr:
            return interpolateYlOrBr;

        case YlOrRd:
            return interpolateYlOrRd;

        // R Color
        case Viridis:
            return interpolateViridis;

        case Inferno:
            return inferno;

        case Magma:
            return magma;

        case Plasma:
            return plasma;

        case Warm:
            return warm;

        case Cool:
            return cool;

        case Rainbow:
            return interpolateRainbow;

        case Cubehelix:
            return interpolateCubehelixDefault;

        default:
            return undefined;
    }
};

var interpolatePreset = function interpolatePreset(_name) {
    return interpolateCategorical(_name) || interpolateDiverging(_name) || interpolateSequential(_name);
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
var isArray = Array.isArray;

var _typeof = typeof Symbol === "function" && _typeof$1(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof$1(obj);
};

var classCallCheck = function classCallCheck(instance, Constructor) {
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

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var _Symbol = root.Symbol;

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
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag$1] = tag;
        } else {
            delete value[symToStringTag$1];
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
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

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
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
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
function isObjectLike(value) {
    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
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
    var index$$1 = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index$$1 < length) {
        result[index$$1] = iteratee(array[index$$1], index$$1, array);
    }
    return result;
}

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
        index$$1 = assocIndexOf(data, key);

    if (index$$1 < 0) {
        return false;
    }
    var lastIndex = data.length - 1;
    if (index$$1 == lastIndex) {
        data.pop();
    } else {
        splice.call(data, index$$1, 1);
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
        index$$1 = assocIndexOf(data, key);

    return index$$1 < 0 ? undefined : data[index$$1][1];
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
        index$$1 = assocIndexOf(data, key);

    if (index$$1 < 0) {
        ++this.size;
        data.push([key, value]);
    } else {
        data[index$$1][1] = value;
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
    var index$$1 = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index$$1 < length) {
        var entry = entries[index$$1];
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
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

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

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

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
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

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
            return funcToString$1.call(func);
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
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
var Map$1 = getNative(root, 'Map');

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
    var index$$1 = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index$$1 < length) {
        var entry = entries[index$$1];
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
    var index$$1 = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index$$1 < length) {
        var entry = entries[index$$1];
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

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

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
    this.__data__.set(value, HASH_UNDEFINED$2);
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
    var index$$1 = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache();
    while (++index$$1 < length) {
        this.add(values[index$$1]);
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
    var index$$1 = -1,
        length = array == null ? 0 : array.length;

    while (++index$$1 < length) {
        if (predicate(array[index$$1], index$$1, array)) {
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
var COMPARE_PARTIAL_FLAG$2 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;

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
function equalArrays(array, other, bitmask, customizer, equalFunc, stack$$1) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack$$1.get(array);
    if (stacked && stack$$1.get(other)) {
        return stacked == other;
    }
    var index$$1 = -1,
        result = true,
        seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : undefined;

    stack$$1.set(array, other);
    stack$$1.set(other, array);

    // Ignore non-index properties.
    while (++index$$1 < arrLength) {
        var arrValue = array[index$$1],
            othValue = other[index$$1];

        if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index$$1, other, array, stack$$1) : customizer(arrValue, othValue, index$$1, array, other, stack$$1);
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
                if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack$$1))) {
                    return seen.push(othIndex);
                }
            })) {
                result = false;
                break;
            }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack$$1))) {
            result = false;
            break;
        }
    }
    stack$$1['delete'](array);
    stack$$1['delete'](other);
    return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
    var index$$1 = -1,
        result = Array(map.size);

    map.forEach(function (value, key) {
        result[++index$$1] = [key, value];
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
function setToArray(set$$1) {
    var index$$1 = -1,
        result = Array(set$$1.size);

    set$$1.forEach(function (value) {
        result[++index$$1] = value;
    });
    return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag$1 = '[object String]';
var symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

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
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack$$1) {
    switch (tag) {
        case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
            }
            object = object.buffer;
            other = other.buffer;

        case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
                return false;
            }
            return true;

        case boolTag:
        case dateTag:
        case numberTag:
            // Coerce booleans to `1` or `0` and dates to milliseconds.
            // Invalid dates are coerced to `NaN`.
            return eq(+object, +other);

        case errorTag:
            return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag$1:
            // Coerce regexes to strings and treat strings, primitives and objects,
            // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
            // for more details.
            return object == other + '';

        case mapTag:
            var convert = mapToArray;

        case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3;
            convert || (convert = setToArray);

            if (object.size != other.size && !isPartial) {
                return false;
            }
            // Assume cyclic values are equal.
            var stacked = stack$$1.get(object);
            if (stacked) {
                return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG$2;

            // Recursively compare objects (susceptible to call stack limits).
            stack$$1.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack$$1);
            stack$$1['delete'](object);
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
    var index$$1 = -1,
        length = values.length,
        offset = array.length;

    while (++index$$1 < length) {
        array[offset + index$$1] = values[index$$1];
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
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
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
    var index$$1 = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index$$1 < length) {
        var value = array[index$$1];
        if (predicate(value, index$$1, array)) {
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
var objectProto$7 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

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
    return arrayFilter(nativeGetSymbols(object), function (symbol$$1) {
        return propertyIsEnumerable.call(object, symbol$$1);
    });
};

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
    var index$$1 = -1,
        result = Array(n);

    while (++index$$1 < n) {
        result[index$$1] = iteratee(index$$1);
    }
    return result;
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

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
    return isObjectLike(value) && hasOwnProperty$7.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
};

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
var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

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

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

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
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

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
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$2 = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$1] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag] = false;

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
var freeExports$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

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

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

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
        if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && (
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

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$11;

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
function overArg(func, transform) {
    return function (arg) {
        return func(transform(arg));
    };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
        if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
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
function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
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
function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

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
function equalObjects(object, other, bitmask, customizer, equalFunc, stack$$1) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
        return false;
    }
    var index$$1 = objLength;
    while (index$$1--) {
        var key = objProps[index$$1];
        if (!(isPartial ? key in other : hasOwnProperty$5.call(other, key))) {
            return false;
        }
    }
    // Assume cyclic values are equal.
    var stacked = stack$$1.get(object);
    if (stacked && stack$$1.get(other)) {
        return stacked == other;
    }
    var result = true;
    stack$$1.set(object, other);
    stack$$1.set(other, object);

    var skipCtor = isPartial;
    while (++index$$1 < objLength) {
        key = objProps[index$$1];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack$$1) : customizer(objValue, othValue, key, object, other, stack$$1);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack$$1) : compared)) {
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
    stack$$1['delete'](object);
    stack$$1['delete'](other);
    return result;
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map$1);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set);
var weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map$1 && getTag(new Map$1()) != mapTag$2 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$2 || WeakMap && getTag(new WeakMap()) != weakMapTag$1) {
    getTag = function getTag(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$2 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
            switch (ctorString) {
                case dataViewCtorString:
                    return dataViewTag$2;
                case mapCtorString:
                    return mapTag$2;
                case promiseCtorString:
                    return promiseTag;
                case setCtorString:
                    return setTag$2;
                case weakMapCtorString:
                    return weakMapTag$1;
            }
        }
        return result;
    };
}

var getTag$1 = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';
var arrayTag = '[object Array]';
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

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
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack$$1) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag : getTag$1(object),
        othTag = othIsArr ? arrayTag : getTag$1(other);

    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;

    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
            return false;
        }
        objIsArr = true;
        objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
        stack$$1 || (stack$$1 = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack$$1) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack$$1);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$1)) {
        var objIsWrapped = objIsObj && hasOwnProperty$4.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty$4.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
                othUnwrapped = othIsWrapped ? other.value() : other;

            stack$$1 || (stack$$1 = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack$$1);
        }
    }
    if (!isSameTag) {
        return false;
    }
    stack$$1 || (stack$$1 = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack$$1);
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
function baseIsEqual(value, other, bitmask, customizer, stack$$1) {
    if (value === other) {
        return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack$$1);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;

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
    var index$$1 = matchData.length,
        length = index$$1,
        noCustomizer = !customizer;

    if (object == null) {
        return !length;
    }
    object = Object(object);
    while (index$$1--) {
        var data = matchData[index$$1];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
        }
    }
    while (++index$$1 < length) {
        data = matchData[index$$1];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
            if (objValue === undefined && !(key in object)) {
                return false;
            }
        } else {
            var stack$$1 = new Stack();
            if (customizer) {
                var result = customizer(objValue, srcValue, key, object, source, stack$$1);
            }
            if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack$$1) : result)) {
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
    return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
    var result = keys(object),
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
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
    if (isArray(value)) {
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
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

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
var reLeadingDot = /^\./;
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
    if (reLeadingDot.test(string)) {
        result.push('');
    }
    string.replace(rePropName, function (match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
    });
    return result;
});

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

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
    if (isArray(value)) {
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
function toString(value) {
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
    if (isArray(value)) {
        return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
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

    var index$$1 = 0,
        length = path.length;

    while (object != null && index$$1 < length) {
        object = object[toKey(path[index$$1++])];
    }
    return index$$1 && index$$1 == length ? object : undefined;
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
function get$1(object, path, defaultValue) {
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

    var index$$1 = -1,
        length = path.length,
        result = false;

    while (++index$$1 < length) {
        var key = toKey(path[index$$1]);
        if (!(result = object != null && hasFunc(object, key))) {
            break;
        }
        object = object[key];
    }
    if (result || ++index$$1 != length) {
        return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
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
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;

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
        var objValue = get$1(object, path);
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
function identity$$1(value) {
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
        return identity$$1;
    }
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
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
        var index$$1 = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
            var key = props[fromRight ? length : ++index$$1];
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

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
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
        if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index$$1 = fromRight ? length : -1,
            iterable = Object(collection);

        while (fromRight ? index$$1-- : ++index$$1 < length) {
            if (iteratee(iterable[index$$1], index$$1, iterable) === false) {
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
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
    var index$$1 = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function (value, key, collection) {
        result[++index$$1] = iteratee(value, key, collection);
    });
    return result;
}

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee, 3));
}

/**
 *
 *
 * @param _data
 * @param _scheme
 * @returns {*}
 * @private
 */
var _smartSequential = function _smartSequential(_data, _scheme) {
    var _scale = linear$1();

    var schemeLen = _scheme.length;
    var dataLen = _data.length;

    var theDarkest = _scheme[schemeLen - 1];

    if (schemeLen === 0) {
        // nothing to do
    } else if (dataLen === 1) {
        // use the darkest
        _scale = ordinal().domain(_data[0]).range([theDarkest]);
    } else if (dataLen === schemeLen) {
        // use every single color
        _scale.domain(_data).range(_scheme);
    } else if (dataLen < schemeLen) {
        // sort data from the smallest to the largest

        var _trimmed = new Array(dataLen);

        var increment = (schemeLen - 1) / (dataLen - 1);
        var index$$1 = schemeLen - 1;

        for (var i = dataLen - 2; i > 0; i--) {
            index$$1 -= increment;
            _trimmed[i] = _scheme[i];
        }

        _trimmed[0] = _scheme[0];
        _trimmed[dataLen - 1] = theDarkest;

        _scale.domain(_data).range(_trimmed);
    } else {
        // use kmeans
        var clusters = index_1(_data, schemeLen - 1);
        var breakpoints = clusters.map(function (d) {
            return d[d.length - 1];
        });
        var _domain = [_data[0]].concat(breakpoints);

        _scale.domain(_domain).range(_scheme);
    }

    return _scale;
};

// todo quantile needs to bee refactored
var makeColorScale = function makeColorScale(colorOptions) {
    var _data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var _type = colorOptions.type;
    var _scheme = colorOptions.scheme;

    var _scale = void 0;
    if (isString(_scheme)) {
        var _internalScale = interpolatePreset(_scheme);

        // built-in
        switch (_type) {
            case GRADIENT:
                _scale = sequential(_internalScale);

                var _extent = extent(_data);
                _scale.domain(_extent);
                break;

            case DISTINCT:
                var scaleArr = [];

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = colorOptions.distinction[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var d = _step.value;

                        scaleArr.push(_internalScale(d));
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

                _scale = quantile().range(scaleArr);

                var _valMap = colorOptions.distinction ? map(colorOptions.distinction, function (d) {
                    return max(_data) * +d;
                }) : extent(_data);

                _scale.domain(_valMap);

                break;

            case CATEGORICAL:
                _scale = ordinal(_internalScale);
                break;
            default:
                console.log('color type is not supported ' + _type);

                break;
        }
    } else if (isArray(_scheme)) {
        switch (_type) {
            case GRADIENT:
                _scale = _smartSequential(_data, _scheme);

                break;

            case DISTINCT:
                _scale = quantile();

                var _valMap2 = colorOptions.distinction ? map(colorOptions.distinction, function (d) {
                    return max(_data) * +d;
                }) : extent(_data);

                _scale.domain(_valMap2);
                _scale.range(_scheme);
                break;

            case CATEGORICAL:
                _scale = ordinal().range(_scheme);

                break;

            default:
                console.log('color type is not supported ' + _type);

                break;
        }
    }

    return _scale;
};

/**
 * General condition for selecting the color space
 *
 * @param _schema {
 *      h: [min, max],
 *      c: [min, max],
 *      l: [min, max]
 * }
 * @return sub color space
 */
var HclSelector = function () {
    function HclSelector(preset) {
        classCallCheck(this, HclSelector);

        var hmin = preset.hmin;
        var hmax = preset.hmax;
        var cmin = preset.cmin;
        var cmax = preset.cmax;
        var lmin = preset.lmin;
        var lmax = preset.lmax;

        if (hmin < hmax) {
            this.hcondition = function (hcl) {
                return hcl[0] >= hmin && hcl[0] <= hmax;
            };
        } else {
            this.hcondition = function (hcl) {
                return hcl[0] >= hmin || hcl[0] <= hmax;
            };
        }
        this.ccondition = function (hcl) {
            return hcl[1] >= cmin && hcl[1] <= cmax;
        };
        this.lcondition = function (hcl) {
            return hcl[2] >= lmin && hcl[2] <= lmax;
        };
    }

    createClass(HclSelector, [{
        key: "validate",
        value: function validate(hcl) {
            return this.hcondition(hcl) && this.ccondition(hcl) && this.lcondition(hcl);
        }
    }]);
    return HclSelector;
}();

var confusionLines = {
    "Protanope": {
        x: 0.7465,
        y: 0.2535,
        m: 1.273463,
        yint: -0.073894
    },
    "Deuteranope": {
        x: 1.4,
        y: -0.4,
        m: 0.968437,
        yint: 0.003331
    },
    "Tritanope": {
        x: 0.1748,
        y: 0.0,
        m: 0.062921,
        yint: 0.292119
    }
};

var simulate_cache = {};

var simulate = function simulate(lab$$1, type) {
    var _amount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    // WARNING: may return [NaN, NaN, NaN]

    var amount = _amount;
    // Cache
    var key = lab$$1.join('-') + '-' + type + '-' + amount;
    var cache = simulate_cache[key];
    if (cache) return cache;

    // Get data from type
    var confuse_x = confusionLines[type].x;
    var confuse_y = confusionLines[type].y;
    var confuse_m = confusionLines[type].m;
    var confuse_yint = confusionLines[type].yint;

    // Code adapted from http://galacticmilk.com/labs/Color-Vision/Javascript/Color.Vision.Simulate.js
    var color = chroma.lab(lab$$1[0], lab$$1[1], lab$$1[2]);
    var sr = color.rgb()[0];
    var sg = color.rgb()[1];
    var sb = color.rgb()[2];
    var dr = sr; // destination color
    var dg = sg;
    var db = sb;
    // Convert source color into XYZ color space
    var pow_r = Math.pow(sr, 2.2);
    var pow_g = Math.pow(sg, 2.2);
    var pow_b = Math.pow(sb, 2.2);
    var X = pow_r * 0.412424 + pow_g * 0.357579 + pow_b * 0.180464; // RGB->XYZ (sRGB:D65)
    var Y = pow_r * 0.212656 + pow_g * 0.715158 + pow_b * 0.0721856;
    var Z = pow_r * 0.0193324 + pow_g * 0.119193 + pow_b * 0.950444;
    // Convert XYZ into xyY Chromacity Coordinates (xy) and Luminance (Y)
    var chroma_x = X / (X + Y + Z);
    var chroma_y = Y / (X + Y + Z);
    // Generate the "Confusion Line" between the source color and the Confusion Point
    var m = (chroma_y - confuse_y) / (chroma_x - confuse_x); // slope of Confusion Line
    var yint = chroma_y - chroma_x * m; // y-intercept of confusion line (x-intercept = 0.0)
    // How far the xy coords deviate from the simulation
    var deviate_x = (confuse_yint - yint) / (m - confuse_m);
    var deviate_y = m * deviate_x + yint;
    // Compute the simulated color's XYZ coords
    X = deviate_x * Y / deviate_y;
    Z = (1.0 - (deviate_x + deviate_y)) * Y / deviate_y;
    // Neutral grey calculated from luminance (in D65)
    var neutral_X = 0.312713 * Y / 0.329016;
    var neutral_Z = 0.358271 * Y / 0.329016;
    // Difference between simulated color and neutral grey
    var diff_X = neutral_X - X;
    var diff_Z = neutral_Z - Z;
    var diff_r = diff_X * 3.24071 + diff_Z * -0.498571; // XYZ->RGB (sRGB:D65)
    var diff_g = diff_X * -0.969258 + diff_Z * 0.0415557;
    var diff_b = diff_X * 0.0556352 + diff_Z * 1.05707;
    // Convert to RGB color space
    dr = X * 3.24071 + Y * -1.53726 + Z * -0.498571; // XYZ->RGB (sRGB:D65)
    dg = X * -0.969258 + Y * 1.87599 + Z * 0.0415557;
    db = X * 0.0556352 + Y * -0.203996 + Z * 1.05707;
    // Compensate simulated color towards a neutral fit in RGB space
    var fit_r = ((dr < 0.0 ? 0.0 : 1.0) - dr) / diff_r;
    var fit_g = ((dg < 0.0 ? 0.0 : 1.0) - dg) / diff_g;
    var fit_b = ((db < 0.0 ? 0.0 : 1.0) - db) / diff_b;
    var adjust = Math.max( // highest value
    fit_r > 1.0 || fit_r < 0.0 ? 0.0 : fit_r, fit_g > 1.0 || fit_g < 0.0 ? 0.0 : fit_g, fit_b > 1.0 || fit_b < 0.0 ? 0.0 : fit_b);
    // Shift proportional to the greatest shift
    dr = dr + adjust * diff_r;
    dg = dg + adjust * diff_g;
    db = db + adjust * diff_b;
    // Apply gamma correction
    dr = Math.pow(dr, 1.0 / 2.2);
    dg = Math.pow(dg, 1.0 / 2.2);
    db = Math.pow(db, 1.0 / 2.2);
    // Anomylize colors
    dr = sr * (1.0 - amount) + dr * amount;
    dg = sg * (1.0 - amount) + dg * amount;
    db = sb * (1.0 - amount) + db * amount;
    var dcolor = chroma.rgb(dr, dg, db);
    var result = dcolor.lab();
    simulate_cache[key] = result;
    return result;
};

// http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
var _cmcDistance = function _cmcDistance(lab1, lab2, l, c) {
    var L1 = lab1[0];
    var L2 = lab2[0];
    var a1 = lab1[1];
    var a2 = lab2[1];
    var b1 = lab1[2];
    var b2 = lab2[2];
    var C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    var C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    var deltaC = C1 - C2;
    var deltaL = L1 - L2;
    var deltaa = a1 - a2;
    var deltab = b1 - b2;
    var deltaH = Math.sqrt(Math.pow(deltaa, 2) + Math.pow(deltab, 2) + Math.pow(deltaC, 2));
    var H1 = Math.atan2(b1, a1) * (180 / Math.PI);
    while (H1 < 0) {
        H1 += 360;
    }
    var F = Math.sqrt(Math.pow(C1, 4) / (Math.pow(C1, 4) + 1900));
    var T = 164 <= H1 && H1 <= 345 ? 0.56 + Math.abs(0.2 * Math.cos(H1 + 168)) : 0.36 + Math.abs(0.4 * Math.cos(H1 + 35));
    var S_L = lab1[0] < 16 ? 0.511 : 0.040975 * L1 / (1 + 0.01765 * L1);
    var S_C = 0.0638 * C1 / (1 + 0.0131 * C1) + 0.638;
    var S_H = S_C * (F * T + 1 - F);
    var result = Math.sqrt(Math.pow(deltaL / (l * S_L), 2) + Math.pow(deltaC / (c * S_C), 2) + Math.pow(deltaH / S_H, 2));
    return result;
};

var _euclidianDistance = function _euclidianDistance(lab1, lab2) {
    return Math.sqrt(Math.pow(lab1[0] - lab2[0], 2) + Math.pow(lab1[1] - lab2[1], 2) + Math.pow(lab1[2] - lab2[2], 2));
};

var compromiseDistance = function compromiseDistance(lab1, lab2) {
    var distances = [];
    var coeffs = [];
    distances.push(_cmcDistance(lab1, lab2, 2, 1));
    coeffs.push(1000);
    var types = ['Protanope', 'Deuteranope', 'Tritanope'];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var type = _step.value;

            var lab1_cb = simulate(lab1, type);
            var lab2_cb = simulate(lab2, type);
            if (!(lab1_cb.some(isNaN) || lab2_cb.some(isNaN))) {
                var c = void 0;
                switch (type) {
                    case 'Protanope':
                        c = 100;
                        break;
                    case 'Deuteranope':
                        c = 500;
                        break;
                    case 'Tritanope':
                        c = 1;
                        break;
                }
                distances.push(_cmcDistance(lab1_cb, lab2_cb, 2, 1));
                coeffs.push(c);
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

    var total = 0;
    var count = 0;
    distances.forEach(function (d, i) {
        total += coeffs[i] * d;
        count += coeffs[i];
    });
    return total / count;
};

var distanceColorblind = function distanceColorblind(lab1, lab2, type) {
    var lab1_cb = simulate(lab1, type);
    var lab2_cb = simulate(lab2, type);
    return _cmcDistance(lab1_cb, lab2_cb, 2, 1);
};

var getColorDistance = function getColorDistance(lab1, lab2) {
    var _type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Default';

    switch (_type) {
        case 'Default':
            return _euclidianDistance(lab1, lab2);
        case 'Euclidian':
            return _euclidianDistance(lab1, lab2);
        case 'CMC':
            return _cmcDistance(lab1, lab2, 2, 1);
        case 'Compromise':
            return compromiseDistance(lab1, lab2);
        default:
            return distanceColorblind(lab1, lab2, _type);
    }
};

var validateLab = function validateLab(lab$$1) {
    // Code from Chroma.js 2016

    var LAB_CONSTANTS = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034, // 4 / 29
        t1: 0.206896552, // 6 / 29
        t2: 0.12841855, // 3 * t1 * t1
        t3: 0.008856452 // t1 * t1 * t1
    };

    var l = lab$$1[0];
    var a = lab$$1[1];
    var b = lab$$1[2];

    var y = (l + 16) / 116;
    var x = isNaN(a) ? y : y + a / 500;
    var z = isNaN(b) ? y : y - b / 200;

    y = LAB_CONSTANTS.Yn * lab_xyz(y);
    x = LAB_CONSTANTS.Xn * lab_xyz(x);
    z = LAB_CONSTANTS.Zn * lab_xyz(z);

    var r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z); // D65 -> sRGB
    var g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;

    function xyz_rgb(r) {
        return Math.round(255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055));
    }

    function lab_xyz(t) {
        return t > LAB_CONSTANTS.t1 ? t * t * t : LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
    }
};

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

/** Detect free variable `exports`. */
var freeExports$2 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined;
var allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

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
    var index$$1 = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index$$1 < length) {
        array[index$$1] = source[index$$1];
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

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

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

/** `Object#toString` result references. */
var objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$12 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

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
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
}

/** Used for built-in method references. */
var objectProto$13 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

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
    if (!(hasOwnProperty$10.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
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

    var index$$1 = -1,
        length = props.length;

    while (++index$$1 < length) {
        var key = props[index$$1];

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
var objectProto$14 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

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
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$11.call(object, key)))) {
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
function keysIn$1(object) {
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
    return copyObject(value, keysIn$1(value));
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
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack$$1) {
    var objValue = object[key],
        srcValue = source[key],
        stacked = stack$$1.get(srcValue);

    if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack$$1) : undefined;

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
        stack$$1.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack$$1);
        stack$$1['delete'](srcValue);
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
function baseMerge(object, source, srcIndex, customizer, stack$$1) {
    if (object === source) {
        return;
    }
    baseFor(source, function (srcValue, key) {
        if (isObject(srcValue)) {
            stack$$1 || (stack$$1 = new Stack());
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack$$1);
        } else {
            var newValue = customizer ? customizer(object[key], srcValue, key + '', object, source, stack$$1) : undefined;

            if (newValue === undefined) {
                newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
        }
    }, keysIn$1);
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
            index$$1 = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index$$1 < length) {
            array[index$$1] = args[start + index$$1];
        }
        index$$1 = -1;
        var otherArgs = Array(start + 1);
        while (++index$$1 < start) {
            otherArgs[index$$1] = args[index$$1];
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
function constant(value) {
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
var baseSetToString = !defineProperty$1 ? identity$$1 : function (func, string) {
    return defineProperty$1(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
    });
};

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

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
    return setToString(overRest(func, start, identity$$1), func + '');
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
function isIterateeCall(value, index$$1, object) {
    if (!isObject(object)) {
        return false;
    }
    var type = typeof index$$1 === 'undefined' ? 'undefined' : _typeof(index$$1);
    if (type == 'number' ? isArrayLike(object) && isIndex(index$$1, object.length) : type == 'string' && index$$1 in object) {
        return eq(object[index$$1], value);
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
        var index$$1 = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined : customizer;
            length = 1;
        }
        object = Object(object);
        while (++index$$1 < length) {
            var source = sources[index$$1];
            if (source) {
                assigner(object, source, index$$1, customizer);
            }
        }
        return object;
    });
}

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
var merge = createAssigner(function (object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
});

var Duration$1 = {
    COLOR: 500,
    SORT: 500,
    APPEND: 750,
    CHANGE: 1000,
    EXIT: 500,
    AXIS: 750,
    TOOLTIP: 200,
    QuickChange: 500
};

var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var uuid = function uuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var formatter = format(".0%");

var LinearGradient = function () {
    function LinearGradient(scheme$$1) {
        classCallCheck(this, LinearGradient);

        this._id = uuid();
        this._scheme = scheme$$1;
        this.colorStops = this._makeColorStops();
        this._layer;
    }

    createClass(LinearGradient, [{
        key: 'id',
        value: function id() {
            return '#' + this._id;
        }
    }, {
        key: 'render',
        value: function render(_svg) {
            this._layer = _svg.append("linearGradient").attr("id", this._id).attr("gradientUnits", "userSpaceOnUse").attr("x1", '0%').attr("y1", '100%').attr("x2", '0%').attr("y2", '0%');

            this._layer.selectAll("stop").data(this.colorStops).enter().append("stop").attr("offset", function (d) {
                return d.offset;
            }).attr("stop-color", function (d) {
                return d.color;
            }).attr('stop-opacity', 1);
        }
    }, {
        key: 'update',
        value: function update(_scheme, _dataLength) {
            this._scheme = _scheme;
            this.colorStops = this._makeColorStops();

            this._layer.selectAll("stop").data(this.colorStops).transition().duration(Duration$1.CHANGE).delay(function (d, i) {
                return i / _dataLength * Duration$1.CHANGE;
            }).attr("offset", function (d) {
                return d.offset;
            }).attr("stop-color", function (d) {
                return d.color;
            });
        }
    }, {
        key: '_makeColorStops',
        value: function _makeColorStops() {
            var scheme$$1 = this._scheme;

            if (isString(scheme$$1)) {
                var _seqScale = sequential(interpolatePreset(scheme$$1));
                _seqScale.domain([0, 1]); // explicit domain, not really need to do so

                var _data = range(0, 1, 0.1);
                _data.push(1); // range is 0-0.9

                return _data.map(function (d) {
                    return {
                        offset: formatter(d),
                        color: _seqScale(d)
                    };
                });
            } else if (isArray(scheme$$1)) {
                var count = scheme$$1.length;

                if (count > 1) {
                    var steps = index_2([0, 1], count - 1);

                    return steps.map(function (d, i) {
                        return {
                            offset: formatter(d),
                            color: scheme$$1[i]
                        };
                    });
                } else {
                    console.log('linear gradient requires at least two colors');
                }
            }
        }
    }, {
        key: 'link',
        value: function link(selector$$1) {}
    }, {
        key: 'top',
        value: function top() {
            return this.colorStops[this.colorStops.length - 1].color;
        }
    }, {
        key: 'scheme',
        get: function get$$1() {
            return this._scheme;
        },
        set: function set$$1(scheme$$1) {
            this._scheme = scheme$$1;
        }
    }]);
    return LinearGradient;
}();

var Voronoi = function () {
    function Voronoi(_chart, baseLayer, _voronoiSelector) {
        classCallCheck(this, Voronoi);

        console.log(_chart);
        this._voronoi = voronoi().x(_chart._x).y(_chart._y).extent([[0, 0], [_chart._options.width, _chart._options.height]]);

        this._svg = _chart._svg;
        this.voronoiGroup;
        this.voronoiSelector = _voronoiSelector;
        this.baseLayer = baseLayer;
    }

    createClass(Voronoi, [{
        key: 'render',
        value: function render(_data) {
            this.update(_data);
        }
    }, {
        key: 'update',
        value: function update(_data) {
            this._svg.select('.voronoi-group').remove();

            this.voronoiGroup = this._svg.append("g").attr("class", "voronoi-group");

            this.voronoiGroup.selectAll(".voronoi-web").data(this._voronoi(_data)).enter().append("path").attr("d", function (d) {
                return "M" + d.join("L") + "Z";
            }).datum(function (d) {
                return d.point;
            }).attr("class", 'voronoi-web').attr("data-voronoi", this.voronoiSelector).style("stroke", "#2074A0").style("fill", "none").style('stroke', '#7EB852').style('stroke-opacity', 1).style("pointer-events", "all").on("mouseover", this.mouseOn).on("mouseout", this.mouseOff);
        }
    }, {
        key: 'mouseOn',
        value: function mouseOn(d, i) {
            var selector$$1 = this.baseLayer.select("[data-voronoi=\"" + this.voronoiSelector + "\"]");
            // append 1es to bubbles that will be used to show the precise data points.
            // translate their location based on margins
            // this._svg.append("g")
            //     .attr("class", "vizart-scatter-guide")
            //     .append("line")
            //     .attr("x1", +selector.attr("cx"))
            //     .attr("x2", +selector.attr("cx"))
            //     .attr("y1", +selector.attr("cy"))
            //     .attr("y2", this._options.height)
            //     .style("stroke", selector.style("fill"))
            //     .style('stroke-dasharray', '10, 5')
            //     .transition()
            //     .delay(200)
            //     .duration(400)
            //     .styleTween("opacity",  interpolate(0, .7));
            //
            // this._svg.append("g")
            //     .attr("class", "vizart-scatter-guide")
            //     .append("line")
            //     .attr("x1", +selector.attr("cx"))
            //     .attr("x2", 0)
            //     .attr("y1", +selector.attr("cy"))
            //     .attr("y2", +selector.attr("cy"))
            //     .style("stroke", selector.style("fill"))
            //     .style('stroke-dasharray', '10, 5')
            //     .transition()
            //     .delay(200)
            //     .duration(400)
            //     .styleTween("opacity", interpolate(0, .7));

            // function to move mouseover item to front of SVG stage, in case
            // another bubble overlaps it
            selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };

            // skip this functionality for IE9, which doesn't like it

            selector$$1.moveToFront();

            tooltip.transition().duration(Duration.TOOLTIP).style("opacity", .9);

            var coordinates = mouse(this);
            var x = coordinates[0];
            var y = coordinates[1];

            var html = this._options.analytics.metrics.length > 1 ? Tooltip.multiMetric(this._getDimension().name, this._getMetric().name, this._getRadius().name, this._getDimensionVal(d), this._getMetricValue(d), this._getRadiusValue(d), this._c(d)) : Tooltip.noHandle(this._getDimension().name + ' ' + this._getDimensionVal(d), this._getMetric().name, this._getMetricValue(d), this._c(d));

            tooltip.style("left", x + 80 + _z(d) + 5 + "px").style("top", y + 40 + "px").html(html);
        }
    }, {
        key: 'mouseOff',

        // what happens when we leave a bubble?
        value: function mouseOff(d, i, isCircle) {
            tooltip.transition().duration(Duration.TOOLTIP).style("opacity", 0);

            // fade out guide lines, then remove them
            selectAll(".vizart-scatter-guide").transition().duration(100).styleTween("opacity", function () {
                return interpolateValue(.7, 0);
            }).remove();
        }
    }]);
    return Voronoi;
}();

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
    var index$$1 = -1,
        length = array == null ? 0 : array.length;

    while (++index$$1 < length) {
        if (iteratee(array[index$$1], index$$1, array) === false) {
            break;
        }
    }
    return array;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
    return object && copyObject(source, keysIn$1(source), object);
}

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function (object) {
    var result = [];
    while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
    }
    return result;
};

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
    return copyObject(source, getSymbolsIn(source), object);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

/** Used for built-in method references. */
var objectProto$15 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$15.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty$12.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index$$1 = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
        accumulator = array[++index$$1];
    }
    while (++index$$1 < length) {
        accumulator = iteratee(accumulator, array[index$$1], index$$1, array);
    }
    return accumulator;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$2 = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG$2) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set$$1, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set$$1.add(value);
    return set$$1;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$3 = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set$$1, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set$$1), CLONE_DEEP_FLAG$3) : setToArray(set$$1);
    return arrayReduce(array, addSetEntry, new set$$1.constructor());
}

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol$$1) {
    return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol$$1)) : {};
}

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]';
var dateTag$3 = '[object Date]';
var mapTag$4 = '[object Map]';
var numberTag$3 = '[object Number]';
var regexpTag$3 = '[object RegExp]';
var setTag$4 = '[object Set]';
var stringTag$4 = '[object String]';
var symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]';
var dataViewTag$4 = '[object DataView]';
var float32Tag$2 = '[object Float32Array]';
var float64Tag$2 = '[object Float64Array]';
var int8Tag$2 = '[object Int8Array]';
var int16Tag$2 = '[object Int16Array]';
var int32Tag$2 = '[object Int32Array]';
var uint8Tag$2 = '[object Uint8Array]';
var uint8ClampedTag$2 = '[object Uint8ClampedArray]';
var uint16Tag$2 = '[object Uint16Array]';
var uint32Tag$2 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
        case arrayBufferTag$3:
            return cloneArrayBuffer(object);

        case boolTag$3:
        case dateTag$3:
            return new Ctor(+object);

        case dataViewTag$4:
            return cloneDataView(object, isDeep);

        case float32Tag$2:case float64Tag$2:
        case int8Tag$2:case int16Tag$2:case int32Tag$2:
        case uint8Tag$2:case uint8ClampedTag$2:case uint16Tag$2:case uint32Tag$2:
            return cloneTypedArray(object, isDeep);

        case mapTag$4:
            return cloneMap(object, isDeep, cloneFunc);

        case numberTag$3:
        case stringTag$4:
            return new Ctor(object);

        case regexpTag$3:
            return cloneRegExp(object);

        case setTag$4:
            return cloneSet(object, isDeep, cloneFunc);

        case symbolTag$3:
            return cloneSymbol(object);
    }
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]';
var arrayTag$2 = '[object Array]';
var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var errorTag$2 = '[object Error]';
var funcTag$2 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
var mapTag$3 = '[object Map]';
var numberTag$2 = '[object Number]';
var objectTag$4 = '[object Object]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$3 = '[object String]';
var symbolTag$2 = '[object Symbol]';
var weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
var float32Tag$1 = '[object Float32Array]';
var float64Tag$1 = '[object Float64Array]';
var int8Tag$1 = '[object Int8Array]';
var int16Tag$1 = '[object Int16Array]';
var int32Tag$1 = '[object Int32Array]';
var uint8Tag$1 = '[object Uint8Array]';
var uint8ClampedTag$1 = '[object Uint8ClampedArray]';
var uint16Tag$1 = '[object Uint16Array]';
var uint32Tag$1 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$3] = cloneableTags[arrayTag$2] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag$1] = cloneableTags[float64Tag$1] = cloneableTags[int8Tag$1] = cloneableTags[int16Tag$1] = cloneableTags[int32Tag$1] = cloneableTags[mapTag$3] = cloneableTags[numberTag$2] = cloneableTags[objectTag$4] = cloneableTags[regexpTag$2] = cloneableTags[setTag$3] = cloneableTags[stringTag$3] = cloneableTags[symbolTag$2] = cloneableTags[uint8Tag$1] = cloneableTags[uint8ClampedTag$1] = cloneableTags[uint16Tag$1] = cloneableTags[uint32Tag$1] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] = cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack$$1) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG$1,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

    if (customizer) {
        result = object ? customizer(value, key, object, stack$$1) : customizer(value);
    }
    if (result !== undefined) {
        return result;
    }
    if (!isObject(value)) {
        return value;
    }
    var isArr = isArray(value);
    if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
            return copyArray(value, result);
        }
    } else {
        var tag = getTag$1(value),
            isFunc = tag == funcTag$2 || tag == genTag$1;

        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag$4 || tag == argsTag$3 || isFunc && !object) {
            result = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
            }
        } else {
            if (!cloneableTags[tag]) {
                return object ? value : {};
            }
            result = initCloneByTag(value, tag, baseClone, isDeep);
        }
    }
    // Check for circular references and return its corresponding clone.
    stack$$1 || (stack$$1 = new Stack());
    var stacked = stack$$1.get(value);
    if (stacked) {
        return stacked;
    }
    stack$$1.set(value, result);

    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;

    var props = isArr ? undefined : keysFunc(value);
    arrayEach(props || value, function (subValue, key) {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack$$1));
    });
    return result;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

var BaseOpt = {
    // v1.0
    chart: {
        type: null,
        width: null,
        height: null,
        className: null,
        margin: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
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
        schema: '', // string or array
        type: '',
        kmeans: true
    },
    plots: {},
    tooltip: {
        className: null,
        enabled: true,
        duration: 500,
        formatter: function formatter() {}
    },
    data: {},

    // v2.0
    title: {
        enabled: false,
        text: null,
        style: '',
        align: "center"
    },

    legend: {
        enabled: false

        // credits: {
        //     enabled: true,
        //     href: 'http://www.smartsct.com',
        //     text: 'Powered By ExceedData',
        //     position: '',
        //     style: ''
        // },
        // noData : {
        //     enabled: false
        // },
        // loading: {
        //     hideDuration: 100,
        //     labelStyle: { "fontWeight": "bold", "position": "relative", "top": "45%" },
        //     showDuration: 100,
        //     style: ""
        // },


    } };

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
                var _tep = cloneDeep(_template);
                return merge(_tep, d);
            });
        } else {
            // target has multiple values, all source are merged by index

            return objValue.map(function (d, i) {
                var _tep = cloneDeep(d);

                if (srcValue.length > i) {
                    return merge(_tep, srcValue[i]);
                } else {
                    return _tep;
                }
            });
        }
    }
};

var mergeOptions = function mergeOptions(_target, _source) {
    mergeWith(_target, _source, MergeCustomizer);

    return _target;
};

var mergeBase = function mergeBase() {
    for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
        opts[_key] = arguments[_key];
    }

    var _base = cloneDeep(BaseOpt);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = opts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var o = _step.value;

            mergeOptions(_base, o);
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

    return _base;
};

var DefaultCategoricalColor = {
    scheme: ['#E5EEC1', '#A2D4AB', '#3EACA8', '#547A82', '#5A5050'],
    type: 'categorical'
};

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
    return value === undefined;
}

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
    return value === null;
}

/** `Object#toString` result references. */
var numberTag$4 = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
    return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag$4;
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN$1(value) {
    // An `NaN` primitive is the only value that is not equal to itself.
    // Perform the `toStringTag` check first to avoid errors with some
    // ActiveX objects in IE.
    return isNumber(value) && value != +value;
}

var check = function check(d) {
    return isUndefined(d) || isNull(d) || isNaN$1(d) ? false : true;
};

/*
 Sanitize and provide default for the container height.
 */
var sanitizeHeight = function sanitizeHeight(height, container) {
    return container.node() === null ? 0 : height || parseInt(container.node().getBoundingClientRect().height, 10) || 300;
};

/*
 Sanitize and provide default for the container width.
 */
var sanitizeWidth = function sanitizeWidth(width, container) {
    return container.node() === null ? 0 : width || parseInt(container.node().getBoundingClientRect().width, 10) || 400;
};

/*
 Calculate the available height for a chart.
 */
var availableHeight = function availableHeight(height, container, margin) {
    return Math.max(0, sanitizeHeight(height, container) - margin.top - margin.bottom);
};

/*
 Calculate the available width for a chart.
 */
var availableWidth = function availableWidth(width, container, margin) {
    return Math.max(0, sanitizeWidth(width, container) - margin.left - margin.right);
};

//Trying to figure out how to detect touch devices (exept for laptops with touch screens)
//Since there's no need to have a mouseover function for touch
//There has to be a more foolproof way than this...
//var mobileSize = true;
//if (!("ontouchstart" in document.documentElement) | window.innerWidth > 900) mobileSize = false;
var mobileAndTabletCheck = function mobileAndTabletCheck() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var AbstractChart = function () {
    function AbstractChart(containerId, _userOptions) {
        classCallCheck(this, AbstractChart);

        this._isMobileSize = mobileAndTabletCheck();
        this._containerId = containerId;
        this._options = this.createOptions(_userOptions);
        this._options.chart.width = sanitizeWidth(this._options.chart.width, select(containerId));
        this._options.chart.height = sanitizeHeight(this._options.chart.height, select(containerId));
        this._options.chart.innerWidth = availableWidth(this._options.chart.width, select(containerId), this._options.chart.margin);
        this._options.chart.innerHeight = availableHeight(this._options.chart.height, select(containerId), this._options.chart.margin);

        this._data;
        this._colorScale;
    }

    createClass(AbstractChart, [{
        key: 'render',
        value: function render(_data) {
            this.data(_data);
            this._colorScale = this._provideColorScale();

            this._container = select(this._containerId).append("svg").attr("width", this._options.chart.width).attr("height", this._options.chart.height).attr('class', 'vizart-chart');
            this._svg = this._container.append("g").attr("transform", "translate(" + this._options.chart.margin.left + "," + this._options.chart.margin.top + ")");

            this._tooltip = select(this._containerId).append("div").attr('id', 'tooltip-' + uuid()).attr('class', 'vizart-tooltip').style("opacity", 0);
        }
    }, {
        key: 'update',
        value: function update() {
            this._colorScale = this._provideColorScale();
        }
    }, {
        key: 'data',
        value: function data(_data) {
            if (check(_data) === true) {
                this._data = _data;
            }
            return this._data;
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOptions) {
            throw new Error('this is an abstract method');
        }
    }, {
        key: 'options',
        value: function options(_options) {
            if (check(_options) === true) {
                mergeOptions(this._options, _options);
            }

            return this._options;
        }
    }, {
        key: 'transitionColor',
        value: function transitionColor(colorOptions) {
            this._options.color = colorOptions;
            this._colorScale = this._provideColorScale();
        }
    }, {
        key: '_provideColorScale',
        value: function _provideColorScale() {
            return makeColorScale(this._options.color);
        }

        //todo not a nice way to use 'this', need to improve

    }, {
        key: '_bindTooltip',
        value: function _bindTooltip(_selector) {
            var polar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var that = this;

            function _mouseMove(d) {
                that._tooltip.transition().duration(that._options.tooltip.duration).style("opacity", 1);

                var coordinates = mouse$1(this);
                var x = coordinates[0];
                var y = coordinates[1];

                if (polar === true) {
                    that._tooltip.style("left", x + that._options.chart.width / 2 + "px").style("top", y + that._options.chart.height / 2 + 90 + "px").html(that._getTooltipHTML(d));
                } else {
                    that._tooltip.style("left", x < 40 ? x : x - 22 + "px").style("top", y < 40 ? y + 34 : y - 34 + "px").html(that._getTooltipHTML(d));
                }
            }

            function _mouseOut() {
                that._tooltip.transition().duration(that._options.tooltip.duration).style("opacity", 0);
            }

            _selector.on("mousemove", _mouseMove).on("mouseout", _mouseOut);
        }
    }, {
        key: '_getTooltipHTML',
        value: function _getTooltipHTML(d) {
            throw new Error('tooltip is not defined in _getTooltipHTML');
        }
    }]);
    return AbstractChart;
}();

var NoMargin = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
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

var cluster = function () {
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
};

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;else while (--i >= 0) {
    sum += children[i].value;
  }node.value = sum;
}

var node_count = function () {
  return this.eachAfter(count);
};

var node_each = function (callback) {
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
};

var node_eachBefore = function (callback) {
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
};

var node_eachAfter = function (callback) {
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
};

var node_sum = function (value) {
  return this.eachAfter(function (node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) {
      sum += children[i].value;
    }node.value = sum;
  });
};

var node_sort = function (compare) {
  return this.eachBefore(function (node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
};

var node_path = function (end) {
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
};

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

var node_ancestors = function () {
  var node = this,
      nodes = [node];
  while (node = node.parent) {
    nodes.push(node);
  }
  return nodes;
};

var node_descendants = function () {
  var nodes = [];
  this.each(function (node) {
    nodes.push(node);
  });
  return nodes;
};

var node_leaves = function () {
  var leaves = [];
  this.eachBefore(function (node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
};

var node_links = function () {
  var root = this,
      links = [];
  root.each(function (node) {
    if (node !== root) {
      // Don’t include the root’s parent, if any.
      links.push({ source: node.parent, target: node });
    }
  });
  return links;
};

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

var slice$3 = Array.prototype.slice;

function shuffle$3(array) {
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

var enclose = function (circles) {
  var i = 0,
      n = (circles = shuffle$3(slice$3.call(circles))).length,
      B = [],
      p,
      e;

  while (i < n) {
    p = circles[i];
    if (e && enclosesWeak(e, p)) ++i;else e = encloseBasis(B = extendBasis(B, p)), i = 0;
  }

  return e;
};

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

function place(a, b, c) {
  var ax = a.x,
      ay = a.y,
      da = b.r + c.r,
      db = a.r + c.r,
      dx = b.x - ax,
      dy = b.y - ay,
      dc = dx * dx + dy * dy;
  if (dc) {
    var x = 0.5 + ((db *= db) - (da *= da)) / (2 * dc),
        y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
    c.x = ax + x * dx + y * dy;
    c.y = ay + x * dy - y * dx;
  } else {
    c.x = ax + db;
    c.y = ay;
  }
}

function intersects(a, b) {
  var dx = b.x - a.x,
      dy = b.y - a.y,
      dr = a.r + b.r;
  return dr * dr - 1e-6 > dx * dx + dy * dy;
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

var constant$7 = function (x) {
  return function () {
    return x;
  };
};

function defaultRadius(d) {
  return Math.sqrt(d.value);
}

var pack$1 = function () {
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
    return arguments.length ? (padding = typeof x === "function" ? x : constant$7(+x), pack) : padding;
  };

  return pack;
};

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

var roundNode = function (node) {
  node.x0 = Math.round(node.x0);
  node.y0 = Math.round(node.y0);
  node.x1 = Math.round(node.x1);
  node.y1 = Math.round(node.y1);
};

var treemapDice = function (parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (x1 - x0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.y0 = y0, node.y1 = y1;
    node.x0 = x0, node.x1 = x0 += node.value * k;
  }
};

var partition = function () {
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
};

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
var tree = function () {
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
};

var treemapSlice = function (parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.x0 = x0, node.x1 = x1;
    node.y0 = y0, node.y1 = y0 += node.value * k;
  }
};

function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx,
      dy,
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {
    dx = x1 - x0, dy = y1 - y0;

    // Find the next non-empty node.
    do {
      sumValue = nodes[i1++].value;
    } while (!sumValue && i1 < n);
    minValue = maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; i1 < n; ++i1) {
      sumValue += nodeValue = nodes[i1].value;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) {
        sumValue -= nodeValue;break;
      }
      minRatio = newRatio;
    }

    // Position and record the row orientation.
    rows.push(row = { value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1) });
    if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
    value -= sumValue, i0 = i1;
  }

  return rows;
}

var DefaultOptions = {
    chart: {
        type: 'icicle-tree',
        margin: NoMargin
    },
    color: DefaultCategoricalColor
};

var IcicleTree = function (_AbstractChart) {
    inherits(IcicleTree, _AbstractChart);

    function IcicleTree(canvasId, _userOptions) {
        classCallCheck$1(this, IcicleTree);
        return possibleConstructorReturn(this, (IcicleTree.__proto__ || Object.getPrototypeOf(IcicleTree)).call(this, canvasId, _userOptions));
    }

    createClass$1(IcicleTree, [{
        key: 'render',
        value: function render(_data) {
            var _this2 = this;

            get(IcicleTree.prototype.__proto__ || Object.getPrototypeOf(IcicleTree.prototype), 'render', this).call(this, _data);
            var _height = this._options.chart.innerHeight;
            var that = this;

            var xScale = linear$1().range([0, this._options.chart.innerWidth]);

            var yScale = linear$1().range([0, this._options.chart.innerHeight]);

            var _partition = partition().size([this._options.chart.innerWidth, this._options.chart.innerHeight]).padding(0).round(true);

            var _tree = hierarchy(this._data).sum(function (d) {
                return d.size;
            });
            var _root = _partition(_tree);

            var rect = this._svg.selectAll('.icicle-slice');
            var label = this._svg.selectAll(".icicle-label");

            function clicked(d) {
                xScale.domain([d.x0, d.x1]);
                yScale.domain([d.y0, _height]).range([d.depth ? 20 : 0, _height]);

                that._svg.selectAll('.icicle-slice').transition().duration(750).attr("x", function (d) {
                    return xScale(d.x0);
                }).attr("y", function (d) {
                    return yScale(d.y0);
                }).attr("width", function (d) {
                    return xScale(d.x1) - xScale(d.x0);
                }).attr("height", function (d) {
                    return yScale(d.y1) - yScale(d.y0);
                });

                that._svg.selectAll('.icicle-label').transition().duration(that._options.animation.duration.quickUpdate).attr("x", function (d) {
                    return xScale(d.x0);
                }).attr("y", function (d) {
                    return yScale(d.y0);
                }).attr("dx", 5).attr("dy", 20);
            }

            rect.data(_root.descendants()).enter().append('rect').attr('class', 'icicle-slice').attr('stroke', '#fff').attr("x", function (d) {
                return d.x0;
            }).attr("y", function (d) {
                return d.y0;
            }).attr("width", function (d) {
                return d.x1 - d.x0;
            }).attr("height", function (d) {
                return d.y1 - d.y0;
            }).attr('fill', function (d) {
                return _this2._colorScale(d.data.name);
            }).on("click", clicked);

            label.data(_root.descendants()).enter().append("text").attr('class', 'icicle-label').attr("x", function (d) {
                return xScale(d.x0);
            }).attr("y", function (d) {
                return yScale(d.y0);
            }).attr("dx", 5).attr("dy", 20).attr("text-anchor", "start").text(function (d) {
                return d.data.name;
            }).style("color", "white").style('font-size', "12px").on("click", clicked);
        }
    }, {
        key: 'update',
        value: function update() {
            throw new Error('No function yet.');
        }
    }, {
        key: 'transitionColor',
        value: function transitionColor(colorOptions) {
            var _this3 = this;

            get(IcicleTree.prototype.__proto__ || Object.getPrototypeOf(IcicleTree.prototype), 'transitionColor', this).call(this, colorOptions);

            this._svg.selectAll('.icicle-slice').transition().duration(this._options.animation.duration.update).attr('fill', function (d) {
                return _this3._colorScale(d.name);
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return mergeBase(DefaultOptions, _userOpt);
        }
    }]);
    return IcicleTree;
}(AbstractChart);

var diagonalHorizontal = function diagonalHorizontal(d) {
    return "M" + d.y + "," + d.x + "C" + (d.parent.y + 100) + "," + d.x + " " + (d.parent.y + 100) + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x;
};

var elbow = function elbow(d, i) {
    return "M" + d.parent.y + "," + d.parent.x + "V" + d.x + "H" + (d.y - 0);
};

var DefaultOptions$1 = {
    chart: {
        type: 'weighted-tree',
        margin: NoMargin
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

var duration = {
    general: 1250,
    easing: 750,
    axis: 750
};

var HorizontalTree = function (_AbstractChart) {
    inherits(HorizontalTree, _AbstractChart);

    function HorizontalTree(canvasId, _userOptions) {
        classCallCheck$1(this, HorizontalTree);

        var _this = possibleConstructorReturn(this, (HorizontalTree.__proto__ || Object.getPrototypeOf(HorizontalTree)).call(this, canvasId, _userOptions));

        _this._tree = tree().size([_this._options.chart.innerHeight, _this._options.chart.innerWidth]);

        _this._cluster = cluster().size([_this._options.chart.innerHeight, _this._options.chart.innerWidth]);

        _this.root;
        _this.node;
        _this.link;

        _this.minValues = [];
        _this.maxValues = [];
        _this.nodeScale = sqrt();
        _this.nodeRadius = function (node) {
            //Set max for root node.
            if (node.depth === 0) {
                return _this.nodeScale.range()[1];
            }

            // only one node in this depth
            if (_this.minValues[node.depth] === _this.maxValues[node.depth]) {
                return _this.nodeScale.range()[1];
            }

            _this.nodeScale.domain([_this.minValues[node.depth], _this.maxValues[node.depth]]);
            return _this.nodeScale(node.value);
        };

        _this.depthSpan;
        _this.maxDepth;
        return _this;
    }

    createClass$1(HorizontalTree, [{
        key: 'layoutTree',
        value: function layoutTree() {
            var _this2 = this;

            this.root = hierarchy(this._data).sum(function (d) {
                return d.size;
            }).sort(function (a, b) {
                return a.height - b.height || a.data.name.localeCompare(b.data.name);
            });

            this.maxDepth = this.root.height;

            this._tree(this.root);

            //We dynamically size based on how many first level nodes we have
            var scale = void 0;
            if (this._options.plots.branchPadding == -1) {
                scale = Math.min(this._options.chart.innerHeight, this._options.chart.innerWidth) / this.root.descendants().length;
                console.log("scale = " + scale);
            } else {
                scale = Math.min(this._options.chart.innerHeight, this._options.chart.innerWidth) * this._options.plots.branchPadding;
            }

            this.nodeScale.range([1.5, scale / 2]);

            this._tree.nodeSize([scale, 0]);
            this.depthSpan = this._options.plots.fixedSpan > 0 ? this._options.plots.fixedSpan : this._options.width / (this.maxDepth + 1);

            //Set max/min values

            var _loop = function _loop(i) {
                var vals = _this2.root.descendants().filter(function (d) {
                    return d.depth === i;
                });
                _this2.maxValues[i] = max(vals, function (d) {
                    return d.value;
                });
                _this2.minValues[i] = min(vals, function (d) {
                    return d.value;
                });
            };

            for (var i = 1; i < this.maxDepth + 1; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'render',
        value: function render(_data) {
            get(HorizontalTree.prototype.__proto__ || Object.getPrototypeOf(HorizontalTree.prototype), 'render', this).call(this, _data);

            this.update();
        }
    }, {
        key: 'update',
        value: function update() {
            var _this3 = this;

            get(HorizontalTree.prototype.__proto__ || Object.getPrototypeOf(HorizontalTree.prototype), 'update', this).call(this);
            this.layoutTree();

            this.link = this._svg.selectAll(".link").data(this.root.descendants().slice(1)).enter().append("path").attr("class", "link").attr("d", diagonalHorizontal).style('fill', 'none').style("stroke-linecap", "round").style("stroke-width", function (d) {
                return _this3.nodeRadius(d) * 2;
            }).style("stroke", function (d) {
                return _this3._colorScale(d.data.name);
            }).style("stroke-opacity", this._options.plots.linkOpacity);

            this.node = this._svg.selectAll(".node").data(this.root.descendants()).enter().append("g").attr("class", function (d) {
                return "node" + (d.children ? " node--internal" : " node--leaf");
            }).attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

            this.node.append("circle").attr("r", this.nodeRadius).style("stroke", function (d) {
                return _this3._colorScale(d.data.name);
            }).style("stroke-opacity", this._options.plots.nodeStrokeOpacity).style("fill", function (d) {
                return _this3._colorScale(d.data.name);
            }).style("fill-opacity", this._options.plots.nodeOpacity);

            this.node.append("text").attr("dy", 4).attr("x", function (d) {
                return d.children ? -_this3._options.plots.textOffset : _this3._options.plots.textOffset;
            }).style("text-anchor", function (d) {
                return d.children ? "end" : "start";
            }).text(function (d) {
                return d.data.name;
            });
        }
    }, {
        key: 'mode',
        value: function mode(_mode) {
            this._options.mode = _mode;

            (_mode === "tree" ? this._tree : this._cluster)(this.root);

            var t = transition().duration(750);
            this.node.transition(t).attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
            this.link.transition(t).attr("d", diagonalHorizontal);
        }
    }, {
        key: 'sort',
        value: function sort(field, direction) {
            this._options.ordering = {
                name: field,
                direction: direction
            };

            self.update();
        }
    }, {
        key: '_clickNode',


        // Toggle children on click.
        value: function _clickNode(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            this._update(d);
        }
    }, {
        key: 'transitionColor',
        value: function transitionColor(colorOptions) {
            var _this4 = this;

            get(HorizontalTree.prototype.__proto__ || Object.getPrototypeOf(HorizontalTree.prototype), 'transitionColor', this).call(this, colorOptions);

            this._svg.selectAll('.node circle').transition().duration(duration.general).style("stroke", function (d) {
                return _this4._colorScale(d.data.name);
            }).style("stroke-opacity", this._options.plots.nodeStrokeOpacity).style("fill", function (d) {
                return _this4._colorScale(d.data.name);
            }).style("fill-opacity", this._options.plots.nodeOpacity);

            this._svg.selectAll(".link path").style("stroke", function (d) {
                return _this4._colorScale(d.data.name);
            }).style("stroke-opacity", this._options.plots.linkOpacity);
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return mergeBase(DefaultOptions$1, _userOpt);
        }
    }]);
    return HorizontalTree;
}(AbstractChart);

var DefaultOptions$2 = {
    chart: {
        type: 'sunburst',
        margin: NoMargin
    },
    color: DefaultCategoricalColor,
    plots: {
        drawLabels: true
    }
};

var Sunburst = function (_AbstractChart) {
    inherits(Sunburst, _AbstractChart);

    function Sunburst(canvasId, _userOptions) {
        classCallCheck$1(this, Sunburst);

        var _this = possibleConstructorReturn(this, (Sunburst.__proto__ || Object.getPrototypeOf(Sunburst)).call(this, canvasId, _userOptions));

        _this.radius = Math.min(_this._options.chart.innerWidth, _this._options.chart.innerHeight) / 2;
        return _this;
    }

    createClass$1(Sunburst, [{
        key: 'render',
        value: function render(_data) {
            get(Sunburst.prototype.__proto__ || Object.getPrototypeOf(Sunburst.prototype), 'render', this).call(this, _data);

            this._svg.attr("transform", "translate(" + this._options.chart.width / 2 + "," + this._options.chart.height / 2 + ")");

            // D3 Global Variables
            var root = hierarchy(this._data).sum(function (d) {
                return d.size;
            });
            var node = root; // Save root for tweening
            var x = linear$1().range([0, 2 * Math.PI]);
            var y = sqrt().range([0, this.radius]);
            var _svg = this._svg;
            var _colorScale = this._colorScale;
            var radius = this.radius;
            var that = this;
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
                var oi = interpolateObject({ x0: a.x0s ? a.x0s : 0, x1: a.x1s ? a.x1s : 0 }, a);
                function tween(t) {
                    var b = oi(t);
                    a.x0s = b.x0;
                    a.x1s = b.x1;
                    return _arc(b);
                }
                if (i === 0) {
                    // If we are on the first arc, adjust the x domain to match the root node
                    // at the current zoom level. (We only need to do this once.)
                    var xd = interpolateArray(x.domain(), [node.x0, node.x1]);
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
                var xd = interpolateArray(x.domain(), [d.x0, d.x1]);
                var yd = interpolateArray(y.domain(), [d.y0, 1]); // [d.y0, 1]
                var yr = interpolateArray(y.range(), [d.y0 ? 40 : 0, radius]);

                return function (d, i) {
                    return i ? function (t) {
                        return _arc(d);
                    } : function (t) {
                        x.domain(xd(t));y.domain(yd(t)).range(yr(t));return _arc(d);
                    };
                };
            }

            // Respond to slice click.
            function click(d) {
                //Hide text while Sunburst transitions
                _svg.selectAll(".node text").transition().attr("opacity", 0);
                node = d;
                var updateTrans = _svg.transition().duration(1000).selectAll(".node path").attrTween("d", arcTweenZoom(d));

                if (that._options.plots.drawLabels === true) {
                    updateTrans.on("end", function (e, i) {
                        // check if the animated element's data e lies within the visible angle span given in d
                        if (e.x0 > d.x0 && e.x0 < d.x1) {
                            // get a selection of the associated text element
                            var arcText = select(this.parentNode).select("text");
                            // fade in the text element and recalculate positions
                            arcText.transition().duration(750).attr("opacity", 1).attr("class", "visible").attr("transform", function () {
                                return "rotate(" + computeTextRotation(e) + ")";
                            }).attr("x", function (d) {
                                return y(d.y0);
                            }).text(function (d) {
                                return d.data.name === "root" ? "" : d.data.name;
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
                    _svg.selectAll(".node").data(_partition(root).descendants()).enter().append("g").attr('class', 'node');
                    _svg.selectAll(".node").append("path").style("fill", function (d) {
                        return d.parent ? _colorScale(d.data.name) : "white";
                    }) // Return white for root.
                    .on("click", click);

                    _svg.selectAll(".node").append("title").text(function (d) {
                        return d.data.name;
                    });

                    first_build = false;
                } else {
                    _svg.selectAll(".node path").data(_partition(root).descendants());
                }

                var tweenTrans = _svg.transition().duration(1000).selectAll(".node path").attrTween("d", arcTweenData);

                if (that._options.plots.drawLabels === true) {
                    tweenTrans.on('end', function (d, i) {
                        select(this.parentNode).append("text").attr("transform", function (d) {
                            return "rotate(" + computeTextRotation(d) + ")";
                        }).attr("x", function (d) {
                            return y(d.y0);
                        }).attr("dx", "6") // margin
                        .attr("dy", ".35em") // vertical-align
                        .text(function (d) {
                            return d.data.name === "root" ? "" : d.data.name;
                        });
                    });
                }
            }

            _update(); // GO!
        }
    }, {
        key: 'update',
        value: function update() {
            get(Sunburst.prototype.__proto__ || Object.getPrototypeOf(Sunburst.prototype), 'update', this).call(this);

            if (this._data) {
                this._colorScale.domain(this._data.map(function (d) {
                    return d.name;
                }));
            }
        }
    }, {
        key: 'transitionColor',
        value: function transitionColor(colorOptions) {
            var _this2 = this;

            get(Sunburst.prototype.__proto__ || Object.getPrototypeOf(Sunburst.prototype), 'transitionColor', this).call(this, colorOptions);

            this._svg.selectAll(".node path").transition().duration(1250).attr("fill", function (d) {
                return _this2._colorScale(d.data.name);
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return mergeBase(DefaultOptions$2, _userOpt);
        }
    }]);
    return Sunburst;
}(AbstractChart);

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined$1(value) {
  return value === undefined;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = (typeof global === 'undefined' ? 'undefined' : _typeof$1(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf$1 = (typeof self === 'undefined' ? 'undefined' : _typeof$1(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$3 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/** Built-in value references. */
var _Symbol$1 = root$3.Symbol;

/** Used for built-in method references. */
var objectProto$2$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2$1 = objectProto$2$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1$1 = objectProto$2$1.toString;

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
  var isOwn = hasOwnProperty$2$1.call(value, symToStringTag$2),
      tag = value[symToStringTag$2];

  try {
    value[symToStringTag$2] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$2] = tag;
    } else {
      delete value[symToStringTag$2];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$3$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$2 = objectProto$3$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString$2.call(value);
}

/** `Object#toString` result references. */
var nullTag$1 = '[object Null]';
var undefinedTag$1 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1$1 = _Symbol$1 ? _Symbol$1.toStringTag : undefined;

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
  return symToStringTag$1$1 && symToStringTag$1$1 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
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
  var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag$1 = '[object AsyncFunction]';
var funcTag$1$1 = '[object Function]';
var genTag$1$1 = '[object GeneratorFunction]';
var proxyTag$1 = '[object Proxy]';

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
  return tag == funcTag$1$1 || tag == genTag$1$1 || tag == asyncTag$1 || tag == proxyTag$1;
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
var funcProto$2$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2$1 = funcProto$2$1.toString;

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
      return funcToString$2$1.call(func);
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
var funcProto$1$1 = Function.prototype;
var objectProto$1$1 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1$1 = funcProto$1$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1$1 = objectProto$1$1.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' + funcToString$1$1.call(hasOwnProperty$1$1).replace(reRegExpChar$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
var HASH_UNDEFINED$1$1 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3$1 = objectProto$4$1.hasOwnProperty;

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
    return result === HASH_UNDEFINED$1$1 ? undefined : result;
  }
  return hasOwnProperty$3$1.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$5$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4$1 = objectProto$5$1.hasOwnProperty;

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
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$4$1.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2$1 = '__lodash_hash_undefined__';

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
  data[key] = nativeCreate$1 && value === undefined ? HASH_UNDEFINED$2$1 : value;
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

/* Built-in method references that are verified to be native. */
var Map$3 = getNative$1(root$3, 'Map');

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

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$3 = '__lodash_hash_undefined__';

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
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED$3);
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
function setCacheHas$1(value) {
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
function SetCache$1(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache$1();
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd$1;
SetCache$1.prototype.has = setCacheHas$1;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
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
function cacheHas$1(cache, key) {
  return cache.has(key);
}

/* Built-in method references that are verified to be native. */
var Set$2 = getNative$1(root$3, 'Set');

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$2() {
  // No operation performed.
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray$1(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used as references for various `Number` constants. */
var INFINITY$1$1 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set$2 && 1 / setToArray$1(new Set$2([, -0]))[1] == INFINITY$1$1) ? noop$2 : function (values) {
  return new Set$2(values);
};

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE$1) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray$1(set);
    }
    isCommon = false;
    includes = cacheHas$1;
    seen = new SetCache$1();
  } else {
    seen = iteratee ? [] : result;
  }
  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1$1 = 9007199254740991;

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
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1$1;
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
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'object';
}

/** `Object#toString` result references. */
var stringTag$1$1 = '[object String]';

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
function isString$1(value) {
  return typeof value == 'string' || !isArray$1(value) && isObjectLike$1(value) && baseGetTag$1(value) == stringTag$1$1;
}

/** `Object#toString` result references. */
var symbolTag$1$1 = '[object Symbol]';

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
function isSymbol$1(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'symbol' || isObjectLike$1(value) && baseGetTag$1(value) == symbolTag$1$1;
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol$1(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;
var MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? remainder ? result - remainder : result : 0;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap$1(props, function (key) {
    return object[key];
  });
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
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag$1$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$1(value) && baseGetTag$1(value) == argsTag$1$1;
}

/** Used for built-in method references. */
var objectProto$7$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6$1 = objectProto$7$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1$1 = objectProto$7$1.propertyIsEnumerable;

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
  return isObjectLike$1(value) && hasOwnProperty$6$1.call(value, 'callee') && !propertyIsEnumerable$1$1.call(value, 'callee');
};

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
var freeExports$1$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1$1 = freeExports$1$1 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1$1 = freeModule$1$1 && freeModule$1$1.exports === freeExports$1$1;

/** Built-in value references. */
var Buffer$1$1 = moduleExports$1$1 ? root$3.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer$1 = Buffer$1$1 ? Buffer$1$1.isBuffer : undefined;

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
  length = length == null ? MAX_SAFE_INTEGER$2 : length;
  return !!length && (typeof value == 'number' || reIsUint$1.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/** `Object#toString` result references. */
var argsTag$2$1 = '[object Arguments]';
var arrayTag$1$1 = '[object Array]';
var boolTag$1$1 = '[object Boolean]';
var dateTag$1$1 = '[object Date]';
var errorTag$1$1 = '[object Error]';
var funcTag$2$1 = '[object Function]';
var mapTag$1$1 = '[object Map]';
var numberTag$1$1 = '[object Number]';
var objectTag$1$1 = '[object Object]';
var regexpTag$1$1 = '[object RegExp]';
var setTag$1$1 = '[object Set]';
var stringTag$2$1 = '[object String]';
var weakMapTag$1$1 = '[object WeakMap]';

var arrayBufferTag$1$1 = '[object ArrayBuffer]';
var dataViewTag$1$1 = '[object DataView]';
var float32Tag$1$1 = '[object Float32Array]';
var float64Tag$1$1 = '[object Float64Array]';
var int8Tag$1$1 = '[object Int8Array]';
var int16Tag$1$1 = '[object Int16Array]';
var int32Tag$1$1 = '[object Int32Array]';
var uint8Tag$1$1 = '[object Uint8Array]';
var uint8ClampedTag$1$1 = '[object Uint8ClampedArray]';
var uint16Tag$1$1 = '[object Uint16Array]';
var uint32Tag$1$1 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags$1 = {};
typedArrayTags$1[float32Tag$1$1] = typedArrayTags$1[float64Tag$1$1] = typedArrayTags$1[int8Tag$1$1] = typedArrayTags$1[int16Tag$1$1] = typedArrayTags$1[int32Tag$1$1] = typedArrayTags$1[uint8Tag$1$1] = typedArrayTags$1[uint8ClampedTag$1$1] = typedArrayTags$1[uint16Tag$1$1] = typedArrayTags$1[uint32Tag$1$1] = true;
typedArrayTags$1[argsTag$2$1] = typedArrayTags$1[arrayTag$1$1] = typedArrayTags$1[arrayBufferTag$1$1] = typedArrayTags$1[boolTag$1$1] = typedArrayTags$1[dataViewTag$1$1] = typedArrayTags$1[dateTag$1$1] = typedArrayTags$1[errorTag$1$1] = typedArrayTags$1[funcTag$2$1] = typedArrayTags$1[mapTag$1$1] = typedArrayTags$1[numberTag$1$1] = typedArrayTags$1[objectTag$1$1] = typedArrayTags$1[regexpTag$1$1] = typedArrayTags$1[setTag$1$1] = typedArrayTags$1[stringTag$2$1] = typedArrayTags$1[weakMapTag$1$1] = false;

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
var freeExports$2$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2$1 = freeExports$2$1 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2$1 = freeModule$2$1 && freeModule$2$1.exports === freeExports$2$1;

/** Detect free variable `process` from Node.js. */
var freeProcess$1 = moduleExports$2$1 && freeGlobal$1.process;

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
var objectProto$6$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5$1 = objectProto$6$1.hasOwnProperty;

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
    if ((inherited || hasOwnProperty$5$1.call(value, key)) && !(skipIndexes && (
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
var objectProto$9$1 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$9$1;

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
var nativeKeys$1 = overArg$1(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$8$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7$1 = objectProto$8$1.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys$1(object) {
  if (!isPrototype$1(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7$1.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
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
function keys$2(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys$1(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values$1(object) {
  return object == null ? [] : baseValues(object, keys$2(object));
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike$1(collection) ? collection : values$1(collection);
  fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax$1(length + fromIndex, 0);
  }
  return isString$1(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
}

/** Used for built-in method references. */
var objectProto$10$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8$1 = objectProto$10$1.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty$8$1.call(object, key);
}

/** Used to match property names within property paths. */
var reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp$1 = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey$1(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$1(value)) {
    return true;
  }
  return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) || object != null && value in Object(object);
}

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

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
function memoize$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
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
  memoized.cache = new (memoize$1.Cache || MapCache$1)();
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = MapCache$1;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE$1 = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped$1(func) {
  var result = memoize$1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$1) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var reLeadingDot$1 = /^\./;
var rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar$1 = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath$1 = memoizeCapped$1(function (string) {
  var result = [];
  if (reLeadingDot$1.test(string)) {
    result.push('');
  }
  string.replace(rePropName$1, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar$1, '$1') : number || match);
  });
  return result;
});

/** Used as references for various `Number` constants. */
var INFINITY$3 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1$1 = _Symbol$1 ? _Symbol$1.prototype : undefined;
var symbolToString$1 = symbolProto$1$1 ? symbolProto$1$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$1(value, baseToString$1) + '';
  }
  if (isSymbol$1(value)) {
    return symbolToString$1 ? symbolToString$1.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$3 ? '-0' : result;
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
  return value == null ? '' : baseToString$1(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath$1(value, object) {
  if (isArray$1(value)) {
    return value;
  }
  return isKey$1(value, object) ? [value] : stringToPath$1(toString$1(value));
}

/** Used as references for various `Number` constants. */
var INFINITY$4 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey$1(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$4 ? '-0' : result;
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
function hasPath$1(object, path, hasFunc) {
  path = castPath$1(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey$1(path[index]);
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
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath$1(object, path, baseHas);
}

//Adjusted from: http://blog.graphicsgen.com/2015/03/html5-canvas-rounded-text.html
var drawCircularText = function drawCircularText(ctx, text, fontSize, titleFont, centerX, centerY, radius, startAngle, kerning, textAlpha) {
    // startAngle:   In degrees, Where the text will be shown. 0 degrees if the top of the circle
    // kearning:     0 for normal gap between letters. Positive or negative number to expand/compact gap in pixels

    //Setup letters and positioning
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center'; // Ensure we draw in exact center
    ctx.font = fontSize + "px " + titleFont;
    ctx.fillStyle = "rgba(255,255,255," + textAlpha + ")";

    startAngle = startAngle * (Math.PI / 180); // convert to radians
    text = text.split("").reverse().join(""); // Reverse letters

    //Rotate 50% of total angle for center alignment
    for (var j = 0; j < text.length; j++) {
        var charWid = ctx.measureText(text[j]).width;
        startAngle += (charWid + (j == text.length - 1 ? 0 : kerning)) / radius / 2;
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
    var col = "rgb(" + ret.join(',') + ")";
    return col;
}; //function genColor

//From http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
var getLines = function getLines(ctx, text, maxWidth, fontSize, titleFont) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        ctx.font = fontSize + "px " + titleFont;
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}; //function getLines

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull$1(value) {
  return value === null;
}

var _checkParent = function _checkParent(node, focus) {
    if (isUndefined$1(node.parent) || isNull$1(node.parent)) {
        return false;
    } else {
        if (node.parent === focus) {
            return true;
        } else {
            return _checkParent(node.parent);
        }
    }

    return false;
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
    return _checkParent(node, focus);
};

var DefaultOptions$3 = {
    chart: {
        type: 'circle-pack',
        margin: NoMargin
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
        titleFont: "Oswald",
        titleFn: function titleFn(d) {
            return 'Total ' + d;
        },
        bodyFont: "Merriweather Sans",
        barChartHeight: 0.7,
        barChartHeightOffset: 0.15
    }
};

var commaFormat = format(',');
//The start angle in degrees for each of the non-node leaf titles
var rotationText = [-14, 4, 23, -18, -10.5, -20, 20, 20, 46, -30, -25, -20, 20, 15, -30, -15, -45, 12, -15, -16, 15, 15, 5, 18, 5, 15, 20, -20, -25]; //The rotation of each arc text

var CirclePack = function (_AbstractChart) {
    inherits(CirclePack, _AbstractChart);

    function CirclePack(canvasId, _userOptions) {
        classCallCheck$1(this, CirclePack);

        var _this = possibleConstructorReturn(this, (CirclePack.__proto__ || Object.getPrototypeOf(CirclePack)).call(this, canvasId, _userOptions));

        _this.barDimVal = function (d) {
            return d[_this._options.data.x.accessor];
        };
        _this.barMetVal = function (d) {
            return d[_this._options.data.y.accessor];
        };

        _this._fontCanvasId = 'canvas-' + uuid();
        _this._fontCanvasDom = '#' + _this._fontCanvasId;
        _this._hiddenCanvasId = "hiddenCanvas-" + uuid();
        return _this;
    }

    createClass$1(CirclePack, [{
        key: 'render',
        value: function render(_data) {
            var _this2 = this;

            this.data(_data);
            this._colorScale = this._provideColorScale();

            var layoutData = this._data;

            //Create the visible canvas and this.context
            var canvas = select(this._containerId).append("canvas").attr("id", this._fontCanvasId).attr("width", this._options.chart.innerWidth).attr("height", this._options.chart.innerHeight);

            this.context = canvas.node().getContext("2d");
            this.context.clearRect(0, 0, this._options.chart.innerWidth, this._options.chart.innerHeight);

            //Create a hidden canvas in which each circle will have a different color
            //We can use this to capture the clicked/hovered over on circle
            var hiddenCanvas = select(this._containerId).append("canvas").attr("id", this._hiddenCanvasId).attr("width", this._options.chart.innerWidth).attr("height", this._options.chart.innerHeight).style("display", "none");

            this.hiddenContext = hiddenCanvas.node().getContext("2d");
            this.hiddenContext.clearRect(0, 0, this._options.chart.innerWidth, this._options.chart.innerHeight);

            this.centerX = this._options.chart.innerWidth / 2;
            this.centerY = this._options.chart.innerHeight / 2;

            //////////////////////////////////////////////////////////////
            /////////////////////// Create Scales  ///////////////////////
            //////////////////////////////////////////////////////////////


            this.diameter = Math.min(this._options.chart.innerWidth * 0.9, this._options.chart.innerHeight * 0.9);
            var radius = this.diameter / 2;

            this.zoomInfo = {
                centerX: this.centerX,
                centerY: this.centerY,
                scale: 1
            };

            //Dataset to swtich between color of a circle (in the hidden canvas) and the node data
            this.colToCircle = {};

            this._hierarchy = hierarchy(layoutData, function (d) {
                return d.children;
            }).sum(function (d) {
                return d.size;
            });

            var _treeDepth = range(0, this._hierarchy.height - 1, 1);
            this.colorCircle = ordinal().domain(_treeDepth).range(this._options.plots.circleColors);

            var packLayout = pack$1().padding(1).size([this.diameter, this.diameter]);

            packLayout(this._hierarchy);

            //////////////////////////////////////////////////////////////
            ////////////// Create Circle Packing Data ////////////////////
            //////////////////////////////////////////////////////////////

            this.nodes = this._hierarchy.descendants();
            this.root = this._hierarchy;
            this.focus = this.root;
            this.nodeCount = this.nodes.length;
            this.rootName = this.root.data.name;

            this.nodeByName = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var d = _step.value;

                    this.nodeByName[d.data.name] = d;
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

            var sampleLeaf = this._hierarchy.leaves()[0];

            var barDimList = uniq(sampleLeaf.data._data, this.barDimVal);
            this._colorScale.domain(barDimList);
            this.elementsPerBar = barDimList.length;

            //Default values for variables - set to root
            this.kids = [this.rootName]; //needed to check which arced titles to show - only those close to the parent node

            //Setup the kids variable for the top (root) level
            for (var i = 0; i < this.root.children.length; i++) {
                this.kids.push(this.root.children[i].name);
            }

            //Function to run oif a user clicks on the canvas
            var clickFunction = function clickFunction(e) {
                //Figure out where the mouse click occurred.
                var mouseX = e.offsetX; //e.layerX;
                var mouseY = e.offsetY; //e.layerY;

                // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
                // This will return that pixel's color
                var col = _this2.hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
                //Our map uses these rgb strings as keys to nodes.
                var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                var node = _this2.colToCircle[colString];

                //If there was an actual node clicked on, zoom into this
                if (node) {
                    //If the same node is clicked twice, set it to the top (root) level
                    if (_this2.focus === node) node = _this2.root;

                    //Save the names of the circle itself and first children
                    //Needed to check which arc titles to show
                    _this2.kids = [node.data.name];
                    if (!isUndefined$1(node.children)) {
                        for (var _i = 0; _i < node.children.length; _i++) {
                            _this2.kids.push(node.children[_i].data.name);
                        } //for i
                    } //if

                    //Perform the zoom
                    _this2._zoomToCanvas(node);
                } //if -> node
            }; //function clickFunction

            //Listen for clicks on the main canvas
            document.getElementById(this._fontCanvasId).addEventListener("click", clickFunction);
            // canvas.on("click", clickFunction);
            this._enableMouseZoom();

            //////////////////////////////////////////////////////////////
            ///////////////////// Zoom Function //////////////////////////
            //////////////////////////////////////////////////////////////

            //Based on the generous help by Stephan Smola
            //http://bl.ocks.org/smoli/d7e4f9199c15d71258b5

            this._cubicEase = cubicInOut;
            this.timeElapsed = 0;
            this.interpolator = null;
            this.duration = 1500; //Starting duration
            this.vOld = [this.focus.x, this.focus.y, this.focus.r * 2.05];

            //Text fading variables
            this.showText = true; //Only show the text while you're not zooming
            this.textAlpha = 1; //After a zoom is finished fade in the text;
            this.fadeText = false;
            this.fadeTextDuration = 750;

            //////////////////////////////////////////////////////////////
            /////////////////////// Initiate /////////////////////////////
            //////////////////////////////////////////////////////////////

            //First zoom to get the circles to the right location
            this._zoomToCanvas(this.root);
            //Draw the hidden canvas at least once
            this._drawCanvas(this.hiddenContext, true);
            //Draw the legend
            this.scaleFactor = 1; //dummy value
            // this.createLegend(scaleFactor);

            //Start the drawing loop. It will jump out of the loop once stopTimer becomes true
            this.stopTimer = false;
            this._animate();
        } //drawAll


    }, {
        key: '_enableMouseZoom',
        value: function _enableMouseZoom() {
            var _this3 = this;

            //////////////////////////////////////////////////////////////
            //////////////// Mousemove functionality /////////////////////
            //////////////////////////////////////////////////////////////

            //Only run this if the user actually has a mouse
            if (!this.mobileSize) {
                var nodeOld = this.root;

                //Listen for mouse moves on the main canvas
                var mousemoveFunction = function mousemoveFunction(e) {
                    if (!e) return;
                    //Figure out where the mouse click occurred.
                    var mouseX = e.offsetX; //e.layerX;
                    var mouseY = e.offsetY; //e.layerY;

                    // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
                    // This will return that pixel's color
                    var col = _this3.hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
                    //Our map uses these rgb strings as keys to nodes.
                    var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                    var node = _this3.colToCircle[colString];

                    //Only change the popover if the user mouses over something new
                    if (node !== nodeOld) {
                        //Remove all previous popovers
                        select('.popoverWrapper').remove();
                        selectAll$1('.popover').remove();
                        //Only continue when the user mouses over an actual node
                        if (node) {
                            //Only show a popover for the leaf nodes
                            if (has(node.data, '_data')) {
                                //Needed for placement
                                var nodeX = (node.x - _this3.zoomInfo.centerX) * _this3.zoomInfo.scale + _this3.centerX,
                                    nodeY = (node.y - _this3.zoomInfo.centerY) * _this3.zoomInfo.scale + _this3.centerY,
                                    nodeR = node.r * _this3.zoomInfo.scale;

                                //Create the wrapper div for the popover
                                var div = document.createElement('div');
                                div.setAttribute('class', 'popoverWrapper');
                                document.getElementById(_this3._containerId.substring(1)).appendChild(div);

                                //Position the wrapper right above the circle
                                select(".popoverWrapper").style({
                                    'position': 'absolute',
                                    'top': nodeY - nodeR,
                                    'left': nodeX + _this3._options.plots.padding * 5 / 4
                                });

                                //Show the tooltip
                                $(".popoverWrapper").popover({
                                    placement: 'auto top',
                                    container: 'body',
                                    trigger: 'manual',
                                    html: true,
                                    animation: false,
                                    content: function content() {
                                        return "<span class='nodeTooltip'>" + node.data.name + "</span>";
                                    }
                                });
                                $(".popoverWrapper").popover('show');
                            }
                        }
                    }

                    nodeOld = node;
                }; //function mousemoveFunction

                //document.getElementById(this._frontCanvasId).addEventListener("mousemove", mousemoveFunction);
                select(this._fontCanvasDom).on("mousemove", mousemoveFunction);
            } //if !mobileSize
        }

        //The draw function of the canvas that gets called on each frame

    }, {
        key: '_drawCanvas',
        value: function _drawCanvas(chosenContext) {
            var _this4 = this;

            var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var _treeDepth = range(0, this._hierarchy.height - 1, 1);
            //Clear canvas
            chosenContext.fillStyle = "#fff";
            chosenContext.rect(0, 0, this._options.chart.innerWidth, this._options.chart.innerHeight);
            chosenContext.fill();

            //Select our dummy nodes and draw the data to canvas.
            var node = null;
            // It's slightly faster than nodes.forEach()

            var _loop = function _loop(i) {
                node = _this4.nodes[i];

                //If the hidden canvas was send into this function and it does not yet have a color, generate a unique one
                if (hidden) {
                    if (node.color == null) {
                        // If we have never drawn the node to the hidden canvas get a new color for it and put it in the dictionary.
                        node.color = genColor();
                        _this4.colToCircle[node.color] = node;
                    } //if
                    // On the hidden canvas each rectangle gets a unique color.
                    chosenContext.fillStyle = node.color;
                } else {
                    chosenContext.fillStyle = node.children ? _this4.colorCircle(node.depth) : "white";
                } //else

                var nodeX = (node.x - _this4.zoomInfo.centerX) * _this4.zoomInfo.scale + _this4.centerX,
                    nodeY = (node.y - _this4.zoomInfo.centerY) * _this4.zoomInfo.scale + _this4.centerY,
                    nodeR = node.r * _this4.zoomInfo.scale;

                //Use one node to reset the scale factor for the legend
                if (i === _treeDepth) _this4.scaleFactor = node.value / (nodeR * nodeR);

                //Draw each circle
                chosenContext.beginPath();
                chosenContext.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
                chosenContext.fill();

                //Draw the bars inside the circles (only in the visible canvas)
                //Only draw bars in leaf nodes
                if (has(node.data, '_data')) {
                    //Only draw the bars that are in the same parent ID as the clicked on node
                    if (sameBranch(node, _this4.focus) && !hidden) {

                        //Variables for the bar title
                        var drawTitle = true;
                        var _fontSizeTitle = Math.round(nodeR / 10);
                        if (_fontSizeTitle < 8) drawTitle = false;

                        //Only draw the title if the font size is big enough
                        if (drawTitle & _this4.showText) {
                            //First the light grey total text
                            chosenContext.font = (_fontSizeTitle * 0.5 <= 5 ? 0 : Math.round(_fontSizeTitle * 0.5)) + "px " + _this4._options.bodyFont;
                            chosenContext.fillStyle = "rgba(191,191,191," + _this4.textAlpha + ")"; //"#BFBFBF";
                            chosenContext.textAlign = "center";
                            chosenContext.textBaseline = "middle";
                            chosenContext.fillText(_this4._options.plots.titleFn(commaFormat(node.data.size)), nodeX, nodeY + -0.75 * nodeR);

                            //Get the text back in pieces that will fit inside the node
                            var titleText = getLines(chosenContext, node.data.name, nodeR * 2 * 0.7, _fontSizeTitle, _this4._options.titleFont);
                            //Loop over all the pieces and draw each line
                            titleText.forEach(function (txt, iterator) {
                                chosenContext.font = _fontSizeTitle + "px " + _this4._options.titleFont;
                                chosenContext.fillStyle = "rgba(" + _this4._options.plots.mainTextColor[0] + "," + _this4._options.plots.mainTextColor[1] + "," + _this4._options.plots.mainTextColor[2] + "," + _this4.textAlpha + ")";
                                chosenContext.textAlign = "center";
                                chosenContext.textBaseline = "middle";
                                chosenContext.fillText(txt, nodeX, nodeY + (-0.65 + iterator * 0.125) * nodeR);
                            }); //forEach
                        }

                        _this4._drawBars(chosenContext, node, nodeX, nodeY, nodeR);
                    }
                }
            };

            for (var i = 0; i < this.nodeCount; i++) {
                _loop(i);
            } //for i

            var counter = 0; //Needed for the rotation of the arc titles

            //Do a second loop because the arc titles always have to be drawn on top
            for (var i = 0; i < this.nodeCount; i++) {
                node = this.nodes[i];

                var _nodeX = (node.x - this.zoomInfo.centerX) * this.zoomInfo.scale + this.centerX,
                    _nodeY = (node.y - this.zoomInfo.centerY) * this.zoomInfo.scale + this.centerY,
                    _nodeR = node.r * this.zoomInfo.scale;

                //Don't draw for leaf-nodes
                //And don't draw the arced label for the largest outer circle
                //And don't draw these things for the hidden layer
                //And only draw these while showText = true (so not during a zoom)
                //And hide those not close the the parent
                if (!isUndefined$1(node.parent) && !isUndefined$1(node.children)) {
                    if (node.data.name !== this.rootName & !hidden & this.showText & includes(this.kids, node.data.name) >= 0) {
                        //Calculate the best font size for the non-leaf nodes
                        var fontSizeTitle = Math.round(_nodeR / 10);
                        if (fontSizeTitle > 4) drawCircularText(chosenContext, node.data.name.replace(/,? and /g, ' & '), fontSizeTitle, this._options.titleFont, _nodeX, _nodeY, _nodeR, rotationText[counter], 0, this.textAlpha);
                    } //if
                    counter = counter + 1;
                } //if
            } //for i
        } //function _drawCanvas

    }, {
        key: '_drawBars',
        value: function _drawBars(chosenContext, node, nodeX, nodeY, nodeR) {
            //The barscale differs per node
            var barScale = linear$1().domain([0, max(node.data._data, this.barMetVal)]) //max value of bar charts in circle
            .range([0, nodeR]);

            //Variables for the bar chart
            var bars = node.data._data;
            var totalOffset = nodeX + -nodeR * 0.3;
            var eachBarHeight = (1 - this._options.plots.barChartHeightOffset) * 2 * nodeR * this._options.plots.barChartHeight / this.elementsPerBar;
            var barHeight = eachBarHeight * 0.8;

            //Variables for the labels on the bars: Age
            var drawLabelText = true;
            var fontSizeLabels = Math.round(nodeR / 18);
            if (fontSizeLabels < 6) drawLabelText = false;

            //Variables for the value labels on the end of each bar
            var drawValueText = true;
            var fontSizeValues = Math.round(nodeR / 22);
            if (fontSizeValues < 6) drawValueText = false;

            //Only draw the bars and all labels of each bar has a height of at least 1 pixel
            if (Math.round(barHeight) > 1) {
                //Loop over each bar
                for (var j = 0; j < bars.length; j++) {
                    var bar = bars[j];

                    bar.width = isNaN(this.barMetVal(bar)) ? 0 : barScale(this.barMetVal(bar));
                    bar.barPiecePosition = nodeY + this._options.plots.barChartHeightOffset * 2 * nodeR + j * eachBarHeight - this._options.plots.barChartHeight * nodeR;

                    //Draw the bar
                    chosenContext.beginPath();
                    chosenContext.fillStyle = this._colorScale(this.barDimVal(bar));
                    chosenContext.fillRect(nodeX + -nodeR * 0.3, bar.barPiecePosition, bar.width, barHeight);
                    chosenContext.fill();

                    //Only draw the age labels if the font size is big enough
                    if (drawLabelText & this.showText) {
                        chosenContext.font = fontSizeLabels + "px " + this._options.bodyFont;
                        chosenContext.fillStyle = "rgba(" + this._options.plots.mainTextColor[0] + "," + this._options.plots.mainTextColor[1] + "," + this._options.plots.mainTextColor[2] + "," + this.textAlpha + ")";
                        chosenContext.textAlign = "right";
                        chosenContext.textBaseline = "middle";
                        chosenContext.fillText(this.barDimVal(bar), nodeX + -nodeR * 0.35, bar.barPiecePosition + 0.5 * barHeight);
                    } //if

                    //Only draw the value labels if the font size is big enough
                    if (drawValueText & this.showText) {
                        chosenContext.font = fontSizeValues + "px " + this._options.bodyFont;
                        var txt = commaFormat(this.barMetVal(bar));
                        //Check to see if the bar is big enough to place the text inside it
                        //If not, place the text outside the bar
                        var textWidth = chosenContext.measureText(txt).width;
                        var valuePos = textWidth * 1.1 > bar.width - nodeR * 0.03 ? "left" : "right";

                        //Calculate the x position of the bar value label
                        bar.valueLoc = nodeX + -nodeR * 0.3 + bar.width + (valuePos === "left" ? nodeR * 0.03 : -nodeR * 0.03);

                        //Draw the text
                        chosenContext.fillStyle = valuePos === "left" ? "rgba(51,51,51," + this.textAlpha + ")" : "rgba(255,255,255," + this.textAlpha + ")"; //#333333 or white
                        chosenContext.textAlign = valuePos;
                        chosenContext.textBaseline = "middle";
                        chosenContext.fillText(txt, bar.valueLoc, bar.barPiecePosition + 0.5 * barHeight);
                    } //if
                } //for j
            } //if -> Math.round(barHeight) > 1
        }

        //Perform the interpolation and continuously change the this.zoomInfo while the "transition" occurs

    }, {
        key: '_interpolateZoom',
        value: function _interpolateZoom(dt) {
            var _this5 = this;

            if (this.interpolator) {
                this.timeElapsed += dt;
                var t = this._cubicEase(this.timeElapsed / this.duration); //mini this.interpolator that puts 0 - duration into 0 - 1 in a cubic-in-out fashion

                //Set the new zoom variables
                this.zoomInfo.centerX = this.interpolator(t)[0];
                this.zoomInfo.centerY = this.interpolator(t)[1];
                this.zoomInfo.scale = this.diameter / this.interpolator(t)[2];

                //After iteration is done remove the interpolater and set the fade text back into motion
                if (this.timeElapsed >= this.duration) {
                    this.interpolator = null;
                    this.showText = true;
                    this.fadeText = true;
                    this.timeElapsed = 0;

                    //Draw the hidden canvas again, now that everything is settled in
                    //to make sure it is in the same state as the visible canvas
                    //This way the tooltip and click work correctly
                    this._drawCanvas(this.hiddenContext, true);

                    //Update the texts in the legend
                    select(".legendWrapper").selectAll(".legendText").text(function (d) {
                        return commaFormat(Math.round(_this5.scaleFactor * d * d / 10) * 10);
                    });
                } //if -> timeElapsed >= duration
            } //if -> this.interpolator
        } //function _zoomToCanvas

        //Function that fades in the text - Otherwise the text will be jittery during the zooming

    }, {
        key: '_interpolateFadeText',
        value: function _interpolateFadeText(dt) {
            if (this.fadeText) {
                this.timeElapsed += dt;
                this.textAlpha = this._cubicEase(this.timeElapsed / this.fadeTextDuration);
                if (this.timeElapsed >= this.fadeTextDuration) {
                    //Enable click & mouseover events again
                    select(this._fontCanvasDom).style("pointer-events", "auto");

                    this.fadeText = false; //Jump from loop after fade in is done
                    this.stopTimer = true; //After the fade is done, stop with the redraws / animation
                } //if
            } //if
        } //function _interpolateFadeText


        //This function runs during changes in the visual - during a zoom

    }, {
        key: '_animate',
        value: function _animate() {
            var _this6 = this;

            var dt = 0;

            var _timer = timer(function (elapsed) {
                _this6._interpolateZoom(elapsed - dt);
                _this6._interpolateFadeText(elapsed - dt);
                dt = elapsed;

                _this6._drawCanvas(_this6.context, false);

                if (_this6.stopTimer === true) {
                    _timer.stop();
                }
            });
        } //function _animate


        //Create the interpolation function between current view and the clicked on node

    }, {
        key: '_zoomToCanvas',
        value: function _zoomToCanvas(focusNode) {

            //Temporarily disable click & mouseover events
            select(this._fontCanvasDom).style("pointer-events", "none");

            //Remove all previous popovers - if present
            select('.popoverWrapper').remove();
            selectAll$1('.popover').remove();

            //Set the new focus
            this.focus = focusNode;
            var v = [this.focus.x, this.focus.y, this.focus.r * 2.05]; //The center and width of the new "viewport"

            //Create interpolation between current and new "viewport"
            this.interpolator = interpolateZoom(this.vOld, v);

            //Set the needed "zoom" variables
            this.duration = Math.max(1500, this.interpolator.duration); //Interpolation gives back a suggested duration
            this.timeElapsed = 0; //Set the time elapsed for the interpolateZoom function to 0
            this.showText = false; //Don't show text during the zoom
            this.vOld = v; //Save the "viewport" of the next state as the next "old" state

            //Only show the circle legend when not at a leaf node
            if (has(focusNode.data, '_data')) {
                select("#legendRowWrapper").style("opacity", 0);
                select(".legendWrapper").transition().duration(1000).style("opacity", 0);
            } else {
                select("#legendRowWrapper").style("opacity", 1);
                select(".legendWrapper").transition().duration(1000).delay(this.duration).style("opacity", 1);
            } //else

            //Start animation
            this.stopTimer = false;
            this._animate();
        } //function _zoomToCanvas

        //Needed in the global scope

    }, {
        key: 'search',
        value: function search() {
            var _name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            if (!check(_name)) {
                console.log(' search term cannot be empty');
                return;
            }

            var _node = this.nodeByName[_name];

            if (!_node) {
                console.log(' node: ' + _name + ' cannot be found');
                return;
            }

            this._zoomToCanvas(_node);
        }
    }, {
        key: 'nodeNames',
        value: function nodeNames() {
            var _names = [];

            this._hierarchy.each(function (d) {
                _names.push(d.data.name);
            });

            return _names;
        }

        //////////////////////////////////////////////////////////////
        ///////////// Function | The legend creation /////////////////
        //////////////////////////////////////////////////////////////

    }, {
        key: 'createLegend',
        value: function createLegend(legendId) {
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
            var _legendSvg = select(legendId).append("svg").attr("width", width).attr("height", height).append("g").attr("class", "legendWrapper").attr("transform", "translate(" + width / 2 + "," + 0 + ")").style("opacity", 0);

            //Draw the circles
            _legendSvg.selectAll(".legendCircle").data(legendSizes).enter().append("circle").attr('r', function (d) {
                return d;
            }).attr('class', "legendCircle").attr('cx', legendCenter).attr('cy', function (d) {
                return legendBottom - d;
            });
            //Draw the line connecting the top of the circle to the number
            _legendSvg.selectAll(".legendLine").data(legendSizes).enter().append("line").attr('class', "legendLine").attr('x1', legendCenter).attr('y1', function (d) {
                return legendBottom - 2 * d;
            }).attr('x2', legendCenter + legendLineLength).attr('y2', function (d) {
                return legendBottom - 2 * d;
            });
            //Place the value next to the line
            _legendSvg.selectAll(".legendText").data(legendSizes).enter().append("text").attr('class', "legendText").attr('x', legendCenter + legendLineLength + textPadding).attr('y', function (d) {
                return legendBottom - 2 * d;
            }).attr('dy', '0.3em').text(function (d) {
                return commaFormat(Math.round(scaleFactor * d * d / 10) * 10);
            });

            //Slowly fade in so the scaleFactor is set to the correct value in the mean time :)
            select(".legendWrapper").transition().duration(1000).delay(500).style("opacity", 1);
        } //createLegend

    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return mergeBase(DefaultOptions$3, _userOpt);
        }
    }]);
    return CirclePack;
}(AbstractChart);

var DefaultOptions$4 = {
    chart: {
        type: 'sequential-sunburst',
        margin: NoMargin
    },
    color: DefaultCategoricalColor,
    plots: {
        breadcrumb: { w: 75, h: 30, s: 3, t: 10 },
        legendMargin: { w: 75, h: 30, s: 3, r: 3 }
    }
};

var SequentialSunburst = function (_AbstractChart) {
    inherits(SequentialSunburst, _AbstractChart);

    function SequentialSunburst(canvasId, _userOptions, uiConfig) {
        classCallCheck$1(this, SequentialSunburst);

        var _this = possibleConstructorReturn(this, (SequentialSunburst.__proto__ || Object.getPrototypeOf(SequentialSunburst)).call(this, canvasId, _userOptions));

        _this.outerRadius = Math.min(_this._options.chart.innerWidth, _this._options.chart.innerHeight) / 2;
        _this._radius = _this.outerRadius;

        var _uuid = uuid();
        // id generation
        _this._trailId = '#trail-' + _uuid;
        _this._endLabelId = '#end-label-' + _uuid;
        _this._uiConfig = uiConfig;
        return _this;
    }

    createClass$1(SequentialSunburst, [{
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return mergeBase(DefaultOptions$4, _userOpt);
        }
    }, {
        key: 'render',
        value: function render(_data) {
            var _this2 = this;

            get(SequentialSunburst.prototype.__proto__ || Object.getPrototypeOf(SequentialSunburst.prototype), 'render', this).call(this, _data);

            this._container.attr("preserveAspectRatio", "xMinYMin").attr("viewBox", "0 0 " + this._options.chart.width + " " + this._options.chart.height);
            this._svg.attr("transform", "translate(" + this._options.chart.width / 2 + "," + this._options.chart.height / 2 + ")");

            // Bounding circle underneath the sunburst, to make it easier to detect
            // when the mouse leaves the parent g.
            this._svg.append("svg:circle").attr("r", this._radius).style("opacity", 0);

            // Total size of all segments; we set this later, after loading the data.
            var totalSize = 0;
            var _partition = partition().size([2 * Math.PI, this._radius * this._radius]);

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
            this._initializeBreadcrumbTrail();

            // Turn the data into a d3 hierarchy and calculate the sums.
            var root = hierarchy(this._data).sum(function (d) {
                return d.size;
            }).sort(function (a, b) {
                return b.value - a.value;
            });

            // For efficiency, filter nodes to keep only those large enough to see.
            var nodes = _partition(root).descendants().filter(function (d) {
                return d.x1 - d.x0 > 0.005; // 0.005 radians = 0.29 degrees
            });

            var path = this._svg.data([this._data]).selectAll("path").data(nodes).enter().append("svg:path").attr("display", function (d) {
                return d.depth ? null : "none";
            }).attr("d", _arc).attr("fill-rule", "evenodd").style("fill", function (d) {
                return _this2._colorScale(d.data.name);
            }).style("opacity", 1).on("mouseover", mouseover);

            // Add the mouseleave handler to the bounding circle.
            this._svg.on("mouseleave", mouseleave);

            // Get total size of the tree = value of root node from partition.
            totalSize = path.datum().value;

            var that = this;

            var trailId = this._trailId;
            var endLabelId = this._endLabelId;
            var breadcrumbs = this._options.plots.breadcrumb;
            var uiConfig = this._uiConfig;

            // Generate a string that describes the points of a breadcrumb polygon.
            function _breadcrumbPoints(d, i) {
                var points = [];

                points.push("0,0");
                points.push(breadcrumbs.w + ",0");
                points.push(breadcrumbs.w + breadcrumbs.t + "," + breadcrumbs.h / 2);
                points.push(breadcrumbs.w + "," + breadcrumbs.h);
                points.push("0," + breadcrumbs.h);
                if (i > 0) {
                    // Leftmost breadcrumb; don't include 6th vertex.
                    points.push(breadcrumbs.t + "," + breadcrumbs.h / 2);
                }
                return points.join(" ");
            }

            // Update the breadcrumb trail to show the current sequence and percentage.
            function _updateBreadcrumbs(nodeArray, percentageString) {
                // Data join; key function combines name and depth (= position in sequence).
                var trail = select(trailId).selectAll("g").data(nodeArray, function (d) {
                    return d.data.name + d.depth;
                });

                // Remove exiting nodes.
                trail.exit().remove();

                // Add breadcrumb and label for entering nodes.
                var entering = trail.enter().append("svg:g");

                entering.append("svg:polygon").attr("points", _breadcrumbPoints).style("fill", function (d) {
                    return that._colorScale(d.data.name);
                });

                entering.append("svg:text").attr("x", (breadcrumbs.w + breadcrumbs.t) / 2).attr("y", breadcrumbs.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(function (d) {
                    return d.data.name;
                });

                // Merge enter and update selections; set position for all nodes.
                entering.merge(trail).attr("transform", function (d, i) {
                    return "translate(" + i * (breadcrumbs.w + breadcrumbs.s) + ", 0)";
                });

                // Now move and update the percentage at the end.
                select(trailId).select(endLabelId).attr("x", (nodeArray.length + 0.5) * (breadcrumbs.w + breadcrumbs.s)).attr("y", breadcrumbs.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(percentageString);

                // Make the breadcrumb trail visible, if it's hidden.
                select(trailId).style("visibility", "");
            }

            // Fade all but the current sequence, and show it in the breadcrumb trail.
            function mouseover(d) {
                var percentage = (100 * d.value / totalSize).toPrecision(3);
                var percentageString = percentage + "%";
                if (percentage < 0.1) {
                    percentageString = "< 0.1%";
                }

                select(uiConfig.percentage).text(percentageString);

                select(uiConfig.explanation).style("visibility", "");

                var sequenceArray = d.ancestors().reverse();
                sequenceArray.shift(); // remove root node from the array
                _updateBreadcrumbs(sequenceArray, percentageString);

                // Fade all the segments.
                selectAll$1("path").style("opacity", 0.3);

                // Then highlight only those that are an ancestor of the current segment.
                that._svg.selectAll("path").filter(function (node) {
                    return sequenceArray.indexOf(node) >= 0;
                }).style("opacity", 1);
            }

            // Restore everything to full opacity when moving off the visualization.
            function mouseleave(d) {
                // Hide the breadcrumb trail
                select(trailId).style("visibility", "hidden");

                // Deactivate all segments during transition.
                selectAll$1("path").on("mouseover", null);

                // Transition each segment to full opacity and then reactivate it.
                selectAll$1("path").transition().duration(1000).style("opacity", 1).on("end", function () {
                    select(this).on("mouseover", mouseover);
                });

                select(uiConfig.explanation).style("visibility", "hidden");
            }
        }
    }, {
        key: '_initializeBreadcrumbTrail',
        value: function _initializeBreadcrumbTrail() {
            // Add the svg area.
            var trail = select(this._uiConfig.sequence).append("svg:svg").attr("width", this._options.chart.width).attr("height", 50).attr("id", this._trailId.substr(1, this._trailId.length - 1));
            // Add the label at the end, for the percentage.
            trail.append("svg:text").attr("id", this._endLabelId.substr(1, this._endLabelId.length - 1)).style("fill", "#000");
        }
    }, {
        key: 'drawLegend',
        value: function drawLegend(_domId) {
            var _this3 = this;

            var _legendMargin = this._options.plots.legendMargin;
            // Dimensions of legend item: width, height, spacing, radius of rounded rect.
            var legend = select(_domId).append("svg:svg").attr("width", _legendMargin.w).attr("height", this._colorScale.domain().length * (_legendMargin.h + _legendMargin.s));

            var g = legend.selectAll("g").data(this._colorScale.domain()).enter().append("svg:g").attr("transform", function (d, i) {
                return "translate(0," + i * (_legendMargin.h + _legendMargin.s) + ")";
            });

            g.append("svg:rect").attr("rx", _legendMargin.r).attr("ry", _legendMargin.r).attr("width", _legendMargin.w).attr("height", _legendMargin.h).style("fill", function (d) {
                return _this3._colorScale(d);
            });

            g.append("svg:text").attr("x", _legendMargin.w / 2).attr("y", _legendMargin.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(function (d) {
                return d;
            });
        }
    }]);
    return SequentialSunburst;
}(AbstractChart);

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.

var buildHierarchy = function buildHierarchy(csv) {
    var root = { "name": "root", "children": [] };

    for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];

        if (isNaN(size)) {
            // e.g. if this is a header row
            continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode = void 0;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                    if (children[k]["name"] == nodeName) {
                        childNode = children[k];
                        foundChild = true;
                        break;
                    }
                }
                // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                    childNode = { "name": nodeName, "children": [] };
                    children.push(childNode);
                }
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = { "name": nodeName, "size": size };
                children.push(childNode);
            }
        }
    }

    return root;
};

var diagonalVertical = function diagonalVertical(d) {
    return "M" + d.source.x + "," + d.source.y + "C" + (d.source.x + d.target.x) / 2 + "," + d.source.y + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y + " " + d.target.x + "," + d.target.y;
};

exports.version = version;
exports.IcicleTree = IcicleTree;
exports.WeightedTree = HorizontalTree;
exports.Sunburst = Sunburst;
exports.CirclePack = CirclePack;
exports.SequentialSunburst = SequentialSunburst;
exports.buildHierarchy = buildHierarchy;
exports.diagonalHorizontal = diagonalHorizontal;
exports.diagonalVertical = diagonalVertical;
exports.elbow = elbow;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vizart-hierarchy.standalone.js.map
