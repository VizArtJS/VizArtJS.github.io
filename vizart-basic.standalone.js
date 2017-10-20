(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VizArtBasic = {})));
}(this, (function (exports) { 'use strict';

var version = "1.1.2";

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

var sourceEvent = function () {
  var current = event,
      source;
  while (source = current.sourceEvent) {
    current = source;
  }return current;
};

var point = function (node, event) {
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

var mouse = function (node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

function none() {}

var selector = function (selector) {
  return selector == null ? none : function () {
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

var constant = function (x) {
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

  if (typeof value !== "function") value = constant(value);

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
  if (!compare) compare = ascending;

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

function ascending(a, b) {
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

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function () {
  return this.each(raise);
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
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function (selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
};

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
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set$1(_[t], typename.name, null);
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

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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







var get$2 = function get(object, property, receiver) {
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





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === "object" && performance.now ? performance : Date;
var setFrame = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
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

function set(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
  return schedule;
}

function get(node, id) {
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

var basisClosed = function (values) {
  var n = values.length;
  return function (t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
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
var rgbBasisClosed = rgbSpline(basisClosed);

var interpolateArray = function (a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(nb),
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
};

var date = function (a, b) {
  var d = new Date();
  return a = +a, b -= a, function (t) {
    return d.setTime(a + b * t), d;
  };
};

var reinterpolate = function (a, b) {
  return a = +a, b -= a, function (t) {
    return a + b * t;
  };
};

var object = function (a, b) {
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
};

var interpolate = function (a, b) {
    var t = typeof b === "undefined" ? "undefined" : _typeof(b),
        c;
    return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? reinterpolate : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? interpolateArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : reinterpolate)(a, b);
};

var interpolateRound = function (a, b) {
  return a = +a, b -= a, function (t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var identity = {
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

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule$$1 = set(this, id),
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
    var schedule$$1 = set(this, id),
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
    var tween = get(this.node(), id).tween;
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
    var schedule$$1 = set(this, id);
    (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
  });

  return function (node) {
    return get(node, id).value[name];
  };
}

var interpolate$1 = function (a, b) {
    var c;
    return (typeof b === "number" ? reinterpolate : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
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

function attrConstant$1(name, interpolate, value1) {
  var value00, interpolate0;
  return function () {
    var value0 = this.getAttribute(name);
    return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate, value1) {
  var value00, interpolate0;
  return function () {
    var value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
  };
}

function attrFunction$1(name, interpolate, value) {
  var value00, value10, interpolate0;
  return function () {
    var value0,
        value1 = value(this);
    if (value1 == null) return void this.removeAttribute(name);
    value0 = this.getAttribute(name);
    return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

function attrFunctionNS$1(fullname, interpolate, value) {
  var value00, value10, interpolate0;
  return function () {
    var value0,
        value1 = value(this);
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

var transition_attr = function (name, value) {
  var fullname = namespace(name),
      i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
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

  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get(this.node(), id).delay;
};

function durationFunction(id, value) {
  return function () {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    set(this, id).duration = value;
  };
}

var transition_duration = function (value) {
  var id = this._id;

  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get(this.node(), id).duration;
};

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    set(this, id).ease = value;
  };
}

var transition_ease = function (value) {
  var id = this._id;

  return arguments.length ? this.each(easeConstant(id, value)) : get(this.node(), id).ease;
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
      sit = start(name) ? init : set;
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

  return arguments.length < 2 ? get(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
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

var transition_select = function (select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
};

var transition_selectAll = function (select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
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

function styleRemove$1(name, interpolate) {
    var value00, value10, interpolate0;
    return function () {
        var value0 = styleValue(this, name),
            value1 = (this.style.removeProperty(name), styleValue(this, name));
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
}

function styleRemoveEnd(name) {
    return function () {
        this.style.removeProperty(name);
    };
}

function styleConstant$1(name, interpolate, value1) {
    var value00, interpolate0;
    return function () {
        var value0 = styleValue(this, name);
        return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
    };
}

function styleFunction$1(name, interpolate, value) {
    var value00, value10, interpolate0;
    return function () {
        var value0 = styleValue(this, name),
            value1 = value(this);
        if (value1 == null) value1 = (this.style.removeProperty(name), styleValue(this, name));
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
    };
}

var transition_style = function (name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
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
        var inherit = get(node, id0);
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

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal || freeSelf || Function('return this')();

var _Symbol = root$2.Symbol;

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var ascending$1 = function (a, b) {
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
    return ascending$1(f(d), x);
  };
}

var ascendingBisect = bisector(ascending$1);
var bisectRight = ascendingBisect.right;

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

var min$1 = function (values, valueof) {
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

var sum = function (values, valueof) {
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
};

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
    var values = range(n).map(function (i) {
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

function point$1() {
  return pointish(band().paddingInner(1));
}

var constant$4 = function (x) {
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
  } : constant$4(b);
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
      interpolate$$1 = interpolate,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function (y) {
    return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = map$4.call(_, number$1), rescale()) : domain.slice();
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
var formatDecimal = function (x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i,
      coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
};

var exponent$1 = function (x) {
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
        e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
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

var precisionFixed = function (step) {
  return Math.max(0, -exponent$1(Math.abs(step)));
};

var precisionPrefix = function (step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
};

var precisionRound = function (step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
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

function linear$2() {
  var scale = continuous(deinterpolateLinear, reinterpolate);

  scale.copy = function () {
    return copy(scale, linear$2());
  };

  return linearish(scale);
}

var nice = function (domain, interval) {
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
};

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
    }domain.sort(ascending$1);
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

var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;

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

var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

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

  var tickIntervals = [[second$$1, 1, durationSecond], [second$$1, 5, 5 * durationSecond], [second$$1, 15, 15 * durationSecond], [second$$1, 30, 30 * durationSecond], [minute$$1, 1, durationMinute], [minute$$1, 5, 5 * durationMinute], [minute$$1, 15, 15 * durationMinute], [minute$$1, 30, 30 * durationMinute], [hour$$1, 1, durationHour], [hour$$1, 3, 3 * durationHour], [hour$$1, 6, 6 * durationHour], [hour$$1, 12, 12 * durationHour], [day$$1, 1, durationDay], [day$$1, 2, 2 * durationDay], [week, 1, durationWeek], [month$$1, 1, durationMonth], [month$$1, 3, 3 * durationMonth], [year$$1, 1, durationYear]];

  function tickFormat(date) {
    return (second$$1(date) < date ? formatMillisecond : minute$$1(date) < date ? formatSecond : hour$$1(date) < date ? formatMinute : day$$1(date) < date ? formatHour : month$$1(date) < date ? week(date) < date ? formatDay : formatWeek : year$$1(date) < date ? formatMonth : formatYear)(date);
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
        step = tickStep(start, stop, interval);
        interval = millisecond$$1;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function (y) {
    return new Date(invert(y));
  };

  scale.domain = function (_) {
    return arguments.length ? domain(map$4.call(_, number$2)) : domain().map(date$1);
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

var scaleTime = function () {
  return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};

var colors = function (s) {
  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
};

var schemeCategory10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var schemeCategory20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

var schemeCategory20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

var schemeCategory20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

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

function ramp(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var interpolateViridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

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

var colors$1 = function (specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;
  while (i < n) {
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  }return colors;
};

var schemeAccent = colors$1("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

var schemeDark2 = colors$1("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

var schemePaired = colors$1("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

var schemePastel1 = colors$1("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

var schemePastel2 = colors$1("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

var schemeSet1 = colors$1("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

var schemeSet2 = colors$1("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

var schemeSet3 = colors$1("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

var ramp$1 = function (scheme) {
  return rgbBasis(scheme[scheme.length - 1]);
};

var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors$1);

var interpolateBrBG = ramp$1(scheme);

var scheme$1 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors$1);

var interpolatePRGn = ramp$1(scheme$1);

var scheme$2 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors$1);

var interpolatePiYG = ramp$1(scheme$2);

var scheme$3 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors$1);

var interpolatePuOr = ramp$1(scheme$3);

var scheme$4 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors$1);

var interpolateRdBu = ramp$1(scheme$4);

var scheme$5 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors$1);

var interpolateRdGy = ramp$1(scheme$5);

var scheme$6 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors$1);

var interpolateRdYlBu = ramp$1(scheme$6);

var scheme$7 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors$1);

var interpolateRdYlGn = ramp$1(scheme$7);

var scheme$8 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors$1);

var interpolateSpectral = ramp$1(scheme$8);

var scheme$9 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors$1);

var interpolateBuGn = ramp$1(scheme$9);

var scheme$10 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors$1);

var interpolateBuPu = ramp$1(scheme$10);

var scheme$11 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors$1);

var interpolateGnBu = ramp$1(scheme$11);

var scheme$12 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors$1);

var interpolateOrRd = ramp$1(scheme$12);

var scheme$13 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors$1);

var interpolatePuBuGn = ramp$1(scheme$13);

var scheme$14 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors$1);

var interpolatePuBu = ramp$1(scheme$14);

var scheme$15 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors$1);

var interpolatePuRd = ramp$1(scheme$15);

var scheme$16 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors$1);

var interpolateRdPu = ramp$1(scheme$16);

var scheme$17 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors$1);

var interpolateYlGnBu = ramp$1(scheme$17);

var scheme$18 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors$1);

var interpolateYlGn = ramp$1(scheme$18);

var scheme$19 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors$1);

var interpolateYlOrBr = ramp$1(scheme$19);

var scheme$20 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors$1);

var interpolateYlOrRd = ramp$1(scheme$20);

var scheme$21 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors$1);

var interpolateBlues = ramp$1(scheme$21);

var scheme$22 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors$1);

var interpolateGreens = ramp$1(scheme$22);

var scheme$23 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors$1);

var interpolateGreys = ramp$1(scheme$23);

var scheme$24 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors$1);

var interpolatePurples = ramp$1(scheme$24);

var scheme$25 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors$1);

var interpolateReds = ramp$1(scheme$25);

var scheme$26 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors$1);

var interpolateOranges = ramp$1(scheme$26);

var constant$5 = function (x) {
  return function () {
    return x;
  };
};

function x(d) {
  return d[0];
}

function y(d) {
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
    if (!connectEdge(edge = edges[i], x0, y0, x1, y1) || !clipEdge(edge, x0, y0, x1, y1) || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon || Math.abs(edge[0][1] - edge[1][1]) > epsilon)) {
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
        if (Math.abs(endX - startX) > epsilon || Math.abs(endY - startY) > epsilon) {
          halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end, Math.abs(endX - x0) < epsilon && y1 - endY > epsilon ? [x0, Math.abs(startX - x0) < epsilon ? startY : y1] : Math.abs(endY - y1) < epsilon && x1 - endX > epsilon ? [Math.abs(startY - y1) < epsilon ? startX : x1, y1] : Math.abs(endX - x1) < epsilon && endY - y0 > epsilon ? [x1, Math.abs(startX - x1) < epsilon ? startY : y0] : Math.abs(endY - y0) < epsilon && endX - x0 > epsilon ? [Math.abs(startY - y0) < epsilon ? startX : x0, y0] : null)) - 1);
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
  while (lArc.circle && Math.abs(x - lArc.circle.x) < epsilon && Math.abs(y - lArc.circle.cy) < epsilon) {
    previous = lArc.P;
    disappearing.unshift(lArc);
    detachBeach(lArc);
    lArc = previous;
  }

  disappearing.unshift(lArc);
  detachCircle(lArc);

  var rArc = next;
  while (rArc.circle && Math.abs(x - rArc.circle.x) < epsilon && Math.abs(y - rArc.circle.cy) < epsilon) {
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
    if (dxl > epsilon) node = node.L;else {
      dxr = x - rightBreakPoint(node, directrix);
      if (dxr > epsilon) {
        if (!node.R) {
          lArc = node;
          break;
        }
        node = node.R;
      } else {
        if (dxl > -epsilon) {
          lArc = node.P;
          rArc = node;
        } else if (dxr > -epsilon) {
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

var epsilon = 1e-6;
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
  var x$$1 = x,
      y$$1 = y,
      extent = null;

  function voronoi(data) {
    return new Diagram(data.map(function (d, i) {
      var s = [Math.round(x$$1(d, i, data) / epsilon) * epsilon, Math.round(y$$1(d, i, data) / epsilon) * epsilon];
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
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$5(+_), voronoi) : x$$1;
  };

  voronoi.y = function (_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$5(+_), voronoi) : y$$1;
  };

  voronoi.extent = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
  };

  voronoi.size = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
  };

  return voronoi;
};

var tree_add = function (d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
};

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

var tree_cover = function (x, y) {
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
};

var tree_data = function () {
  var data = [];
  this.visit(function (node) {
    if (!node.length) do {
      data.push(node.data);
    } while (node = node.next);
  });
  return data;
};

var tree_extent = function (_) {
    return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
};

var Quad = function (node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
};

var tree_find = function (x, y, radius) {
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
};

var tree_remove = function (d) {
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
};

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) {
    this.remove(data[i]);
  }return this;
}

var tree_root = function () {
  return this._root;
};

var tree_size = function () {
  var size = 0;
  this.visit(function (node) {
    if (!node.length) do {
      ++size;
    } while (node = node.next);
  });
  return size;
};

var tree_visit = function (callback) {
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
};

var tree_visitAfter = function (callback) {
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
};

function defaultX(d) {
  return d[0];
}

var tree_x = function (_) {
  return arguments.length ? (this._x = _, this) : this._x;
};

function defaultY(d) {
  return d[1];
}

var tree_y = function (_) {
  return arguments.length ? (this._y = _, this) : this._y;
};

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

function arrayMap(array, iteratee) {
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
    return arrayMap(props, function (key) {
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
function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}

var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};

var asyncGenerator$1 = function () {
    function AwaitValue(value) {
        this.value = value;
    }

    function AsyncGenerator(gen) {
        var front, back;

        function send(key, arg) {
            return new Promise(function (resolve, reject) {
                var request = {
                    key: key,
                    arg: arg,
                    resolve: resolve,
                    reject: reject,
                    next: null
                };

                if (back) {
                    back = back.next = request;
                } else {
                    front = back = request;
                    resume(key, arg);
                }
            });
        }

        function resume(key, arg) {
            try {
                var result = gen[key](arg);
                var value = result.value;

                if (value instanceof AwaitValue) {
                    Promise.resolve(value.value).then(function (arg) {
                        resume("next", arg);
                    }, function (arg) {
                        resume("throw", arg);
                    });
                } else {
                    settle(result.done ? "return" : "normal", result.value);
                }
            } catch (err) {
                settle("throw", err);
            }
        }

        function settle(type, value) {
            switch (type) {
                case "return":
                    front.resolve({
                        value: value,
                        done: true
                    });
                    break;

                case "throw":
                    front.reject(value);
                    break;

                default:
                    front.resolve({
                        value: value,
                        done: false
                    });
                    break;
            }

            front = front.next;

            if (front) {
                resume(front.key, front.arg);
            } else {
                back = null;
            }
        }

        this._invoke = send;

        if (typeof gen.return !== "function") {
            this.return = undefined;
        }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
        AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
            return this;
        };
    }

    AsyncGenerator.prototype.next = function (arg) {
        return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
        return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
        return this._invoke("return", arg);
    };

    return {
        wrap: function wrap(fn) {
            return function () {
                return new AsyncGenerator(fn.apply(this, arguments));
            };
        },
        await: function _await(value) {
            return new AwaitValue(value);
        }
    };
}();

var classCallCheck$1 = function classCallCheck$$1(instance, Constructor) {
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

var get$3 = function get(object, property, receiver) {
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

var inherits$1 = function inherits$$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
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

var possibleConstructorReturn$1 = function possibleConstructorReturn$$1(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
};

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = (typeof global === 'undefined' ? 'undefined' : _typeof$1(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf$1 = (typeof self === 'undefined' ? 'undefined' : _typeof$1(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$4 = freeGlobal$2 || freeSelf$1 || Function('return this')();

/** Built-in value references. */
var _Symbol$2 = root$4.Symbol;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$2 = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag$1$1 = _Symbol$2 ? _Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$2(value) {
    var isOwn = hasOwnProperty$2.call(value, symToStringTag$1$1),
        tag = value[symToStringTag$1$1];

    try {
        value[symToStringTag$1$1] = undefined;
        var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$2.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag$1$1] = tag;
        } else {
            delete value[symToStringTag$1$1];
        }
    }
    return result;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1$1 = objectProto$3.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$2(value) {
    return nativeObjectToString$1$1.call(value);
}

/** `Object#toString` result references. */
var nullTag$1 = '[object Null]';
var undefinedTag$1 = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$2 = _Symbol$2 ? _Symbol$2.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$2(value) {
    if (value == null) {
        return value === undefined ? undefinedTag$1 : nullTag$1;
    }
    return symToStringTag$2 && symToStringTag$2 in Object(value) ? getRawTag$2(value) : objectToString$2(value);
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
    return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'object';
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
    return isObjectLike(value) && baseGetTag$2(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$1$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$1$1.propertyIsEnumerable;

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
    return isObjectLike(value) && hasOwnProperty$1.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
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
var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root$4.Buffer : undefined;

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
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
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
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag$2(value)];
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
var freeExports$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal$2.process;

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
var objectProto$2$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1$1 = objectProto$2$1.hasOwnProperty;

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
        if ((inherited || hasOwnProperty$1$1.call(value, key)) && !(skipIndexes && (
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
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

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
        if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
            result.push(key);
        }
    }
    return result;
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
function isObject$2(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
    return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag$1 = '[object AsyncFunction]';
var funcTag$1$1 = '[object Function]';
var genTag$1 = '[object GeneratorFunction]';
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
function isFunction$2(value) {
    if (!isObject$2(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag$2(value);
    return tag == funcTag$1$1 || tag == genTag$1 || tag == asyncTag$1 || tag == proxyTag$1;
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
    return value != null && isLength(value.length) && !isFunction$2(value);
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
function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
}

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
function isUndefined$2(value) {
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
var numberTag$1 = '[object Number]';

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
    return typeof value == 'number' || isObjectLike(value) && baseGetTag$2(value) == numberTag$1;
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
    return isUndefined$2(d) || isNull(d) || isNaN$1(d) ? false : true;
};

var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var uuid = function uuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var svgString2Image = function svgString2Image(svgString, width, height, name) {
    var serializer = new XMLSerializer();
    var imgsrc = 'data:image/svg+xml;base64,' + btoa(serializer.serializeToString(svgString)); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = canvas.width / devicePixelRatio + "px";
    canvas.style.height = canvas.height / devicePixelRatio + "px";

    var image = new Image();
    image.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // canvas.toBlob( function(blob) {
        //     let filesize = Math.round( blob.length/1024 ) + ' KB';
        //     if ( callback ) callback( blob, filesize );
        // });

        var canvasdata = canvas.toDataURL("image/png");

        // download the data
        var a = document.createElement("a");
        a.download = name;
        a.href = canvasdata;
        a.click();
    };

    image.src = imgsrc;
};

var exportPNG = function exportPNG(chart, name) {
    svgString2Image(chart._container.node(), chart.options().chart.innerWidth, chart.options().chart.innerHeight, name || chart.options().title.text || 'chart.png');
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

var containerWidth = function containerWidth(container) {
    return parseInt(container.node().getBoundingClientRect().width, 10) || 300;
};
var containerHeight = function containerHeight(container) {
    return parseInt(container.node().getBoundingClientRect().height, 10) || 400;
};

/*
 Sanitize and provide default for the container height.
 */
var sanitizeHeight = function sanitizeHeight(height, container) {
    return container.node() === null ? 0 : height || containerHeight(container) || 300;
};

/*
 Sanitize and provide default for the container width.
 */
var sanitizeWidth = function sanitizeWidth(width, container) {
    return container.node() === null ? 0 : width || containerWidth(container) || 400;
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

/*
 Gets the browser window size
 Returns object with height and width properties
 */
var assignBound = function assignBound(containerId, _opt) {
    _opt.chart.width = sanitizeWidth(_opt.chart.width, select(containerId));
    _opt.chart.height = sanitizeHeight(_opt.chart.height, select(containerId));
    _opt.chart.innerWidth = availableWidth(_opt.chart.width, select(containerId), _opt.chart.margin);
    _opt.chart.innerHeight = availableHeight(_opt.chart.height, select(containerId), _opt.chart.margin);
};

var resizeBound = function resizeBound(containerId, _opt, _size) {
    if (!check(_size) || !check(_size.width) || !!check(_size.height)) {
        // recalculate width and height
        delete _opt.chart['width'];
        delete _opt.chart['height'];
    }

    assignBound(containerId, _opt);
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
var coreJsData = root$4['__core-js_shared__'];

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
var objectProto$6 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$4).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
    if (!isObject$2(value) || isMasked(value)) {
        return false;
    }
    var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
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
var Map$1 = getNative(root$4, 'Map');

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
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

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
    return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

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
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
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
        var pairs = data.__data__;
        if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
        }
        data = this.__data__ = new MapCache(pairs);
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
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}

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

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

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
    if (!(hasOwnProperty$7.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
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
    if (!isObject$2(object)) {
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
function keysIn$1(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
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

/** Detect free variable `exports`. */
var freeExports$2 = (typeof exports === 'undefined' ? 'undefined' : _typeof$1(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && (typeof module === 'undefined' ? 'undefined' : _typeof$1(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root$4.Buffer : undefined;
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
var objectProto$11 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$11.propertyIsEnumerable;

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
        return propertyIsEnumerable$1.call(object, symbol);
    });
};

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

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

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
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
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

/* Built-in method references that are verified to be native. */
var DataView = getNative(root$4, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$4, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root$4, 'Set');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root$4, 'WeakMap');

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$2 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$2 = '[object WeakMap]';

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
var getTag = baseGetTag$2;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$2 || Map$1 && getTag(new Map$1()) != mapTag$2 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$2 || WeakMap && getTag(new WeakMap()) != weakMapTag$2) {
    getTag = function getTag(value) {
        var result = baseGetTag$2(value),
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
                    return weakMapTag$2;
            }
        }
        return result;
    };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

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
    if (length && typeof array[0] == 'string' && hasOwnProperty$9.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

/** Built-in value references. */
var Uint8Array = root$4.Uint8Array;

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
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
        accumulator = array[++index];
    }
    while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
}

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
function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
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
function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG$3) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
}

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol$2 ? _Symbol$2.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
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

/** `Object#toString` result references. */
var boolTag$2 = '[object Boolean]';
var dateTag$2 = '[object Date]';
var mapTag$3 = '[object Map]';
var numberTag$3 = '[object Number]';
var regexpTag$2 = '[object RegExp]';
var setTag$3 = '[object Set]';
var stringTag$2 = '[object String]';
var symbolTag$1 = '[object Symbol]';

var arrayBufferTag$2 = '[object ArrayBuffer]';
var dataViewTag$3 = '[object DataView]';
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
        case arrayBufferTag$2:
            return cloneArrayBuffer(object);

        case boolTag$2:
        case dateTag$2:
            return new Ctor(+object);

        case dataViewTag$3:
            return cloneDataView(object, isDeep);

        case float32Tag$2:case float64Tag$2:
        case int8Tag$2:case int16Tag$2:case int32Tag$2:
        case uint8Tag$2:case uint8ClampedTag$2:case uint16Tag$2:case uint32Tag$2:
            return cloneTypedArray(object, isDeep);

        case mapTag$3:
            return cloneMap(object, isDeep, cloneFunc);

        case numberTag$3:
        case stringTag$2:
            return new Ctor(object);

        case regexpTag$2:
            return cloneRegExp(object);

        case setTag$3:
            return cloneSet(object, isDeep, cloneFunc);

        case symbolTag$1:
            return cloneSymbol(object);
    }
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
        if (!isObject$2(proto)) {
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
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var funcTag$2 = '[object Function]';
var genTag$1$1 = '[object GeneratorFunction]';
var mapTag$1 = '[object Map]';
var numberTag$2 = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var symbolTag = '[object Symbol]';
var weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';
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
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag$1] = cloneableTags[float64Tag$1] = cloneableTags[int8Tag$1] = cloneableTags[int16Tag$1] = cloneableTags[int32Tag$1] = cloneableTags[mapTag$1] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag] = cloneableTags[uint8Tag$1] = cloneableTags[uint8ClampedTag$1] = cloneableTags[uint16Tag$1] = cloneableTags[uint32Tag$1] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] = cloneableTags[weakMapTag$1] = false;

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
function baseClone(value, bitmask, customizer, key, object, stack) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG$1,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

    if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
        return result;
    }
    if (!isObject$2(value)) {
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
            isFunc = tag == funcTag$2 || tag == genTag$1$1;

        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag$1 || tag == argsTag$2 || isFunc && !object) {
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
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
        return stacked;
    }
    stack.set(value, result);

    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;

    var props = isArr ? undefined : keysFunc(value);
    arrayEach(props || value, function (subValue, key) {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
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
        align: "center"
    },

    legend: {
        enabled: false
    }
};

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
var objectProto$13 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

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
    if (!isObjectLike(value) || baseGetTag$2(value) != objectTag$3) {
        return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    var Ctor = hasOwnProperty$10.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
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
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = object[key],
        srcValue = source[key],
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
            } else if (!isObject$2(objValue) || srcIndex && isFunction$2(objValue)) {
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
        if (isObject$2(srcValue)) {
            stack || (stack = new Stack());
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
            var newValue = customizer ? customizer(object[key], srcValue, key + '', object, source, stack) : undefined;

            if (newValue === undefined) {
                newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
        }
    }, keysIn$1);
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
function identity$1(value) {
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
function constant$2(value) {
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
var baseSetToString = !defineProperty$1 ? identity$1 : function (func, string) {
    return defineProperty$1(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant$2(string),
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
    return setToString(overRest(func, start, identity$1), func + '');
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
    if (!isObject$2(object)) {
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
var merge = createAssigner(function (object, source, srcIndex) {
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

                if (isObject$2(d)) {
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

// cold, dark metropolis


var MetroRain3 = ['#79e70f', '#10d9ec', '#1f97e7'];

var MetroRain8 = ['#abe70f', '#79e70f', '#0fe71f', '#0fe7d4', '#10d9ec', '#10c5ec', '#1fb2e7', '#1f97e7'];

/**
 * Ellsworth Kelly's Spectrum V in the Met
 * http://www.metmuseum.org/art/collection/search/489800
 *
 */
var withinRange = function withinRange(min, max$$1, d) {
    return d >= min && d <= max$$1;
};
var hcondition = function hcondition(preset, hcl) {
    return withinRange(preset.hmin, preset.hmax, hcl[0]);
};
var ccondition = function ccondition(preset, hcl) {
    return withinRange(preset.cmin, preset.cmax, hcl[1]);
};
var lcondition = function lcondition(preset, hcl) {
    return withinRange(preset.lmin, preset.lmax, hcl[2]);
};

var selectHCL = function selectHCL(preset, hcl) {
    return hcondition(preset, hcl) && ccondition(preset, hcl) && lcondition(preset, hcl);
};

var HclSelector = function () {
    function HclSelector(preset) {
        classCallCheck$1(this, HclSelector);

        this.preset = preset;
    }

    createClass$1(HclSelector, [{
        key: "validate",
        value: function validate(hcl) {
            return selectHCL(this.preset, hcl);
        }
    }]);
    return HclSelector;
}();

var stringTag$3 = '[object String]';

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
    return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag$2(value) == stringTag$3;
}

/** `Object#toString` result references. */
var symbolTag$2 = '[object Symbol]';

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
    return (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'symbol' || isObjectLike(value) && baseGetTag$2(value) == symbolTag$2;
}

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current,
                result = value;
        }
    }
    return result;
}

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
    return value > other;
}

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max$1(array) {
    return array && array.length ? baseExtremum(array, identity$1, baseGt) : undefined;
}

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
    return value < other;
}

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
    return array && array.length ? baseExtremum(array, identity$1, baseLt) : undefined;
}

/* taken from https://simplestatistics.org/ */

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
var equalIntervalBreaks = function equalIntervalBreaks(x /*: Array<number> */, nClasses /*:number*/) /*: Array<number> */{

    if (x.length < 2) {
        return x;
    }

    var theMin = min(x),
        theMax = max$1(x);

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
};

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
    if (!isFunction$2(_scheme) && !isString(_scheme)) {
        throw new Error(_scheme + 'is invalid');
    }

    // user specified interpolator
    if (isFunction$2(_scheme)) {
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

var linearStops = function linearStops(scheme) {
    var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    if (isString(scheme) || isFunction$2(scheme)) {
        var interpolator = interpolateSequentialScheme(scheme);

        var offsets = range(0, 1, 0.1);
        offsets.push(1); // range is 0-0.9

        if (interpolator != null) {
            var seqScale = sequential(interpolator).domain([0, 1]); // explicit domain, not really need to do so

            return offsets.map(function (d) {
                return {
                    offset: d,
                    color: seqScale(d)
                };
            });
        } else {
            // fade out a single hue
            return offsets.map(function (d) {
                var _hsl = hsl(scheme);
                _hsl.opacity = opacity * d;

                return {
                    offset: d,
                    color: _hsl
                };
            });
        }
    } else if (isArray(scheme)) {
        var count = scheme.length;

        if (count > 1) {
            var steps = equalIntervalBreaks([0, 1], count - 1);

            return steps.map(function (d, i) {
                return {
                    offset: d,
                    color: scheme[i]
                };
            });
        } else {
            console.log('linear gradient requires at least two colors');
        }
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
var SchemeCategory20 = 'Category20';
var SchemeCategory20b = 'Category20b';
var SchemeCategory20c = 'Category20c';

var SchemeBrBG = "BrBG";
var SchemePRGn = "PRGn";
var SchemePiYG = "PiYG";
var SchemePuOr = "PuOr";
var SchemeRdBu = "RdBu";
var SchemeRdGy = "RdGy";
var SchemeRdYlBu = "RdYlBu";
var SchemeRdYlGn = "RdYlGn";
var SchemeSpectral = "Spectral";

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
var ckmeans = function ckmeans(x /*: Array<number> */, nClusters /*: number */) /*: Array<Array<number>> */{

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
    var _scale = linear$2();

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

var gradientColor = function gradientColor(scheme, _data) {
    var _scheme = void 0;

    if (!isString(scheme) && !isArray(scheme) && !isFunction$2(scheme)) {
        warn('color scheme is invalid: should be string, array or d3 interpolator');
        warn('MetroRain3 will be used by default');
        _scheme = MetroRain3;
    } else {
        _scheme = scheme;
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
    } else if (isFunction$2(_scheme)) {
        return sequential(_scheme).domain(extent(_data));
    } else if (isArray(_scheme)) {
        return _smartSequential(_scheme, _data);
    }
};

var _distinctStops = function _distinctStops(scheme, distinction) {
    var _color = sequential(scheme).domain(extent(distinction));
    return distinction.sort(ascending$1).map(function (d) {
        return _color(d);
    });
};

var distinctColor = function distinctColor(scheme) {
    var distinction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0.33, 0.66, 1];

    if (distinction.length < 2) {
        warn('distinction  must contains at least 3 elements, [0, 0.33, 0.66, 1] will be used by default');
    }

    var _distinction = distinction.length < 2 ? [0, 0.33, 0.66, 1] : distinction;

    var _scheme = void 0;

    if (!isString(scheme) && !isArray(scheme) && !isFunction$2(scheme)) {
        warn('color scheme is invalid: should be string, array or d3 interpolator');
        warn(' MetroRain3 will be used by default');
        _scheme = MetroRain3;
    } else {
        _scheme = scheme;
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
    } else if (isFunction$2(_scheme)) {
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

var divergentColor = function divergentColor(scheme) {
    warn('divergent not implemented yet');

    var _scheme = void 0;
    if (!isString(scheme) && !isArray(scheme) && !isFunction$2(scheme)) {
        warn('color scheme is invalid: should be string, array or d3 interpolator');
        warn('SchemeRdYlGn will be used by default');
        _scheme = SchemeRdYlGn;
    } else {
        _scheme = scheme;
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
    } else if (isFunction$2(_scheme)) {
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

        case SchemeCategory20:
            return schemeCategory20;

        case SchemeCategory20b:
            return schemeCategory20b;

        case SchemeCategory20c:
            return schemeCategory20c;

        default:
            return null;
    }
};

var _selectFromScheme = function _selectFromScheme(interpolator, num) {
    var scale = sequential(interpolator);

    if (num <= 1) {
        return scale(1);
    } else {
        //https://github.com/d3/d3-array#range
        return range(num).map(function (d) {
            return scale(d / (num - 1));
        });
    }
};

var categoricalColor = function categoricalColor(scheme) {
    var _num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var _scheme = scheme;
    if (!isString(scheme) && !isArray(scheme) && !isFunction$2(scheme)) {
        warn('color scheme is invalid: should be string, array or d3 interpolator');
        warn('MetroRain8 will be used by default');
        _scheme = MetroRain8;
    }

    var selectNum = _num <= 1 ? 12 : _num;
    // warn('categorical number is invalid: should be larger than 0');
    // warn('12 will be used by default');

    if (isString(_scheme)) {
        var colorSet = interpolateCategoricalScheme(_scheme) || interpolateSequentialScheme(_scheme) || interpolateDivergentScheme(_scheme);

        if (colorSet != null) {
            if (isArray(colorSet)) {
                return ordinal().range(colorSet);
            } else {
                return ordinal().range(_selectFromScheme(colorSet, selectNum));
            }
        } else {
            return ordinal().range(MetroRain8);
        }
    } else if (isFunction$2(_scheme)) {
        return ordinal().range(_selectFromScheme(_scheme, selectNum));
    } else {
        return ordinal().range(_scheme);
    }
};

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
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache();
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
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
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
        seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : undefined;

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

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]';
var dateTag$3 = '[object Date]';
var errorTag$2 = '[object Error]';
var mapTag$4 = '[object Map]';
var numberTag$4 = '[object Number]';
var regexpTag$3 = '[object RegExp]';
var setTag$4 = '[object Set]';
var stringTag$4 = '[object String]';
var symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]';
var dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol$2 ? _Symbol$2.prototype : undefined;
var symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : undefined;

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
        case dataViewTag$4:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
            }
            object = object.buffer;
            other = other.buffer;

        case arrayBufferTag$3:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
                return false;
            }
            return true;

        case boolTag$3:
        case dateTag$3:
        case numberTag$4:
            // Coerce booleans to `1` or `0` and dates to milliseconds.
            // Invalid dates are coerced to `NaN`.
            return eq(+object, +other);

        case errorTag$2:
            return object.name == other.name && object.message == other.message;

        case regexpTag$3:
        case stringTag$4:
            // Coerce regexes to strings and treat strings, primitives and objects,
            // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
            // for more details.
            return object == other + '';

        case mapTag$4:
            var convert = mapToArray;

        case setTag$4:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3;
            convert || (convert = setToArray);

            if (object.size != other.size && !isPartial) {
                return false;
            }
            // Assume cyclic values are equal.
            var stacked = stack.get(object);
            if (stacked) {
                return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG$2;

            // Recursively compare objects (susceptible to call stack limits).
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack['delete'](object);
            return result;

        case symbolTag$3:
            if (symbolValueOf$1) {
                return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
            }
    }
    return false;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;

/** Used for built-in method references. */
var objectProto$15 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$15.hasOwnProperty;

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
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4,
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
        if (!(isPartial ? key in other : hasOwnProperty$12.call(other, key))) {
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

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]';
var arrayTag$2 = '[object Array]';
var objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var objectProto$14 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

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
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag$2 : getTag$1(object),
        othTag = othIsArr ? arrayTag$2 : getTag$1(other);

    objTag = objTag == argsTag$3 ? objectTag$4 : objTag;
    othTag = othTag == argsTag$3 ? objectTag$4 : othTag;

    var objIsObj = objTag == objectTag$4,
        othIsObj = othTag == objectTag$4,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
            return false;
        }
        objIsArr = true;
        objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$1)) {
        var objIsWrapped = objIsObj && hasOwnProperty$11.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty$11.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
                othUnwrapped = othIsWrapped ? other.value() : other;

            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
    }
    if (!isSameTag) {
        return false;
    }
    stack || (stack = new Stack());
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
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
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
            var stack = new Stack();
            if (customizer) {
                var result = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result === undefined ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
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
    return value === value && !isObject$2(value);
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
    var type = typeof value === 'undefined' ? 'undefined' : _typeof$1(value);
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
var symbolProto$2 = _Symbol$2 ? _Symbol$2.prototype : undefined;
var symbolToString = symbolProto$2 ? symbolProto$2.toString : undefined;

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
function get$1$1(object, path, defaultValue) {
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
        var objValue = get$1$1(object, path);
        return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
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
        return identity$1;
    }
    if ((typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) == 'object') {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
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
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function (value, key, collection) {
        result[++index] = iteratee(value, key, collection);
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

var genericColor = function genericColor(_color, _data) {
    var _scheme = _color.scheme;
    var _type = _color.type;

    switch (_type) {
        case Globals.ColorType.GRADIENT:
            return gradientColor(_scheme, _data);

        case Globals.ColorType.DISTINCT:
            var _valMap = _data ? map(_color.distinction, function (d) {
                return max(_data) * +d;
            }) : _color.distinction;

            return distinctColor(_scheme, _valMap);

        case Globals.ColorType.DIVERGENT:
            return divergentColor(_scheme, _data);

        case Globals.ColorType.CATEGORICAL:
            return categoricalColor(_scheme);

        default:
            warn('color type should be gradient, distinct, divergent or categorical');
            break;
    }
};

var StandardDispatchers = {
    Rendered: 'rendered'
};

var AbstractChart = function () {
    function AbstractChart(containerId, _userOptions) {
        classCallCheck$1(this, AbstractChart);

        this._isMobileSize = mobileAndTabletCheck();
        this._containerId = containerId;
        this._options = this.createOptions(_userOptions);

        assignBound(containerId, this._options);

        this._id = uuid();
        this._data;
        this._color;
        this._container;
        this._listeners = dispatch(values(StandardDispatchers));
    }

    createClass$1(AbstractChart, [{
        key: 'render',
        value: function render(_data) {
            this.data(_data);
            this._color = this._provideColor();

            this._container = select(this._containerId).append("svg").attr("width", this._options.chart.width).attr("height", this._options.chart.height).attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 " + this._options.chart.width + " " + this._options.chart.height).classed("vizart-chart", true);

            this._svg = this._container.append("g").attr("transform", "translate(" + this._options.chart.margin.left + "," + this._options.chart.margin.top + ")");
        }
    }, {
        key: 'update',
        value: function update() {
            this._color = this._provideColor();
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
        key: 'on',
        value: function on(_name, _callback) {
            this._listeners.on(_name, _callback);
        }
    }, {
        key: 'resize',
        value: function resize(_size) {
            resizeBound(this._containerId, this._options, _size);

            this._container.attr("width", this._options.chart.width).attr("height", this._options.chart.height);

            this._listeners.call('resize');
        }
    }, {
        key: 'transitionColor',
        value: function transitionColor(colorOptions) {
            this._options.color = colorOptions;
            this._color = this._provideColor();
        }
    }, {
        key: '_provideColor',
        value: function _provideColor() {
            return genericColor(this._options.color);
        }
    }, {
        key: 'export',
        value: function _export() {
            exportPNG(this);
        }
    }]);
    return AbstractChart;
}();

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

var applyVoronoi = function applyVoronoi(context, opt, finalState) {
    var voronoiDiagram = voronoi().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).extent([[-1, -1], [context.canvas.width + 1, context.canvas.height + 1]]);

    return voronoiDiagram(finalState);
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

var drawCircularText = function drawCircularText(ctx, text, fontSize, titleFont, color, centerX, centerY, radius, startAngle, kerning) {
    //Setup letters and positioning
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center'; // Ensure we draw in exact center
    ctx.font = fontSize + "px " + titleFont;
    ctx.fillStyle = color;

    // startAngle = startAngle * (Math.PI / 180); // convert to radians
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

/**
 * Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
 * via http://stackoverflow.com/a/15804183
 *
 * @param dataIndex
 * @returns {string}
 */
var genColorByIndex = function genColorByIndex(dataIndex) {
    var ret = [];
    if (dataIndex < 16777215) {
        ret.push(dataIndex & 0xff); // R
        ret.push((dataIndex & 0xff00) >> 8); // G
        ret.push((dataIndex & 0xff0000) >> 16); // B
    }
    return "rgb(" + ret.join(',') + ")";
};

/**
 * add linear gradient, x0, y0 -> x1, y1
 *
 * @param context CanvasRenderingContext2D
 * @param scheme color scheme
 * @param opacity fill opacity
 */
var radialGradient = function radialGradient(context, scheme, opacity, centerX, centerY, innerRadius, outerRadius) {
    var grd = context.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);

    var stops = linearStops(scheme, opacity);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = stops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value,
                offset = _step$value.offset,
                color = _step$value.color;

            grd.addColorStop(offset, color);
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

    return grd;
};

/**
 * add linear gradient, x0, y0 -> x1, y1
 *
 * @param context CanvasRenderingContext2D
 * @param scheme color scheme
 * @param opacity fill opacity
 */
var verticalGradient = function verticalGradient(context, scheme) {
    var opacity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var grd = context.createLinearGradient(context.canvas.clientWidth / 2, context.canvas.clientHeight, context.canvas.clientWidth / 2, 0);

    var stops = linearStops(scheme);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = stops[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value,
                offset = _step$value.offset,
                color = _step$value.color;

            if (opacity < 1) {
                var hslColor = hsl(color);
                hslColor.opacity = opacity;
                grd.addColorStop(offset, hslColor);
            } else {
                grd.addColorStop(offset, color);
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

    return grd;
};

var AbstractCanvasChart = function (_AbstractChart) {
    inherits$1(AbstractCanvasChart, _AbstractChart);

    function AbstractCanvasChart(canvasId, _userOptions) {
        classCallCheck$1(this, AbstractCanvasChart);

        var _this = possibleConstructorReturn$1(this, (AbstractCanvasChart.__proto__ || Object.getPrototypeOf(AbstractCanvasChart)).call(this, canvasId, _userOptions));

        _this._fontCanvasId = 'front-canvas' + uuid();
        _this._frontCanvasId = 'color-canvas-' + uuid();
        _this._frontCanvas;
        _this._hiddenCanvas;
        _this._frontContext;
        _this._hiddenContext;
        _this._detachedContainer;
        return _this;
    }

    createClass$1(AbstractCanvasChart, [{
        key: 'render',
        value: function render(_data) {
            get$3(AbstractCanvasChart.prototype.__proto__ || Object.getPrototypeOf(AbstractCanvasChart.prototype), 'render', this).call(this, _data);

            this._detachedContainer = select(this._containerId).append('vizart-detached');

            var devicePixelRatio = window.devicePixelRatio || 1;

            this._frontCanvas = select(this._containerId).append("canvas").attr("id", this._fontCanvasId).style('display', 'block').style("width", this._options.chart.innerWidth + "px").style("height", this._options.chart.innerHeight + "px").style('margin', this._options.chart.margin.top + 'px 0 0 ' + this._options.chart.margin.left + 'px ').attr('width', this._options.chart.innerWidth * devicePixelRatio).attr('height', this._options.chart.innerHeight * devicePixelRatio);

            this._hiddenCanvas = select(this._containerId).append("canvas").attr("id", this._frontCanvasId).style('display', 'none').style("width", this._options.chart.innerWidth + "px").style("height", this._options.chart.innerHeight + "px").style('margin', this._options.chart.margin.top + 'px 0 0 ' + this._options.chart.margin.left + 'px ').attr('width', this._options.chart.innerWidth * devicePixelRatio).attr('height', this._options.chart.innerHeight * devicePixelRatio);

            this._hiddenContext = this._hiddenCanvas.node().getContext("2d");
            this._frontContext = this._frontCanvas.node().getContext('2d');

            this._hiddenContext.mozImageSmoothingEnabled = false;
            this._hiddenContext.webkitImageSmoothingEnabled = false;
            this._hiddenContext.msImageSmoothingEnabled = false;
            this._hiddenContext.imageSmoothingEnabled = false;

            var backingStoreRatio = this._frontContext.webkitBackingStorePixelRatio || this._frontContext.mozBackingStorePixelRatio || this._frontContext.msBackingStorePixelRatio || this._frontContext.oBackingStorePixelRatio || this._frontContext.backingStorePixelRatio || 1;

            var ratio = devicePixelRatio / backingStoreRatio;
            this._canvasScale = ratio;
            this._frontContext.scale(ratio, ratio);
            this._hiddenContext.scale(ratio, ratio);

            this._container.style('position', 'absolute')
            // .style('top', 0)
            // .style('left', 0)
            .style('pointer-events', 'none');

            this._animate();
        }
    }, {
        key: 'update',
        value: function update() {
            get$3(AbstractCanvasChart.prototype.__proto__ || Object.getPrototypeOf(AbstractCanvasChart.prototype), 'update', this).call(this);
            this._animate();
        }
    }, {
        key: '_animate',
        value: function _animate() {}
    }, {
        key: 'transitionColor',
        value: function transitionColor(color) {
            this._options.color = color;

            this.update();
        }
    }, {
        key: 'sort',
        value: function sort(accessor, direction) {
            this._options.ordering = {
                accessor: accessor,
                direction: direction
            };

            this.update();
        }
    }, {
        key: 'revealVoronoi',
        value: function revealVoronoi() {
            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#ff5730";

            drawVoronoi(this._frontContext, this._voronoi, color);
        }
    }, {
        key: 'revealQuadtree',
        value: function revealQuadtree() {
            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#1f97e7';

            drawQuadtree(this._frontContext, this._quadtree, color);
        }
    }]);
    return AbstractCanvasChart;
}(AbstractChart);

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
var getTransparentColor = function getTransparentColor(c, alpha) {
    var hslColorSpace = hsl(c);
    hslColorSpace.opacity = alpha;

    return hslColorSpace;
};

var tooltipMarkup = function tooltipMarkup(d, chartContext) {
    return "\n    <div class=\"tooltip-content\" style=\"border-color: " + (d.c ? d.c : chartContext._c(d)) + ";\">\n        <div class=\"tooltip-header\">" + chartContext._getDimensionVal(d) + "</div>\n        <div class=\"tooltip-row\">\n            <div class=\"col\">" + chartContext._getMetric().name + " </div>\n            <div class=\"col\">" + chartContext._getMetricVal(d) + " </div>\n        </div>\n    </div>\n    ";
};

var AbstractCartesianChart = function (_AbstractCanvasChart) {
    inherits(AbstractCartesianChart, _AbstractCanvasChart);

    function AbstractCartesianChart(canvasId, _userOptions) {
        classCallCheck(this, AbstractCartesianChart);

        var _this = possibleConstructorReturn(this, (AbstractCartesianChart.__proto__ || Object.getPrototypeOf(AbstractCartesianChart)).call(this, canvasId, _userOptions));

        _this._getMetric = function () {
            return _this._options.data.y[0];
        };
        _this._getDimension = function () {
            return _this._options.data.x;
        };
        _this._getDimensionVal = function (d) {
            return d[_this._getDimension().accessor];
        };
        _this._getMetricVal = function (d) {
            return d[_this._getMetric().accessor];
        };
        _this._x = function (d) {
            return _this._getDimension().scale(_this._getDimensionVal(d));
        };
        _this._y = function (d) {
            return _this._getMetric().scale(_this._getMetricVal(d));
        };

        _this._c = function (d) {
            if (d.color) {
                return d.color;
            }

            switch (_this._options.color.type) {
                case Globals.ColorType.CATEGORICAL:
                    return _this._color(_this._getDimensionVal(d));
                case Globals.ColorType.GRADIENT:
                case Globals.ColorType.DISTINCT:
                    return _this._color(_this._getMetricVal(d));
                default:
                    return _this._color(_this._getMetricVal(d));
            }
        };
        return _this;
    }

    createClass(AbstractCartesianChart, [{
        key: 'render',
        value: function render(_data) {
            get$2(AbstractCartesianChart.prototype.__proto__ || Object.getPrototypeOf(AbstractCartesianChart.prototype), 'render', this).call(this, _data);

            this._tooltip = select(this._containerId).append("div").attr('id', 'tooltip-' + uuid()).attr('class', 'vizart-tooltip').style("opacity", 0);
        }
    }, {
        key: 'sort',
        value: function sort(_accessor, direction) {
            this._options.ordering = {
                accessor: _accessor,
                direction: direction
            };

            this.update();
        }
    }, {
        key: 'tooltip',
        value: function tooltip(d) {
            return tooltipMarkup(d, this);
        }
    }]);
    return AbstractCartesianChart;
}(AbstractCanvasChart);

var Stacks = {
    Expand: 'expand',
    Zero: 'zero',
    Silhouette: 'silhouette',
    Wiggle: 'wiggle',
    Divergent: 'divergent'
};

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

function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

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

function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  return index < 0 ? undefined : data[index][1];
}

function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

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

var coreJsData$1 = root$2['__core-js_shared__'];

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

var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1$1 = Function.prototype;
var objectProto$3$1 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1$1 = funcProto$1$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2$1 = objectProto$3$1.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' + funcToString$1$1.call(hasOwnProperty$2$1).replace(reRegExpChar$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative$1 : reIsHostCtor$1;
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

function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

var Map$3 = getNative$1(root$2, 'Map');

var nativeCreate$1 = getNative$1(Object, 'create');

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

function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

function mapCacheDelete$1(key) {
  var result = getMapData$1(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

function mapCacheGet$1(key) {
  return getMapData$1(this, key).get(key);
}

function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

function mapCacheSet$1(key, value) {
  var data = getMapData$1(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

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

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var defineProperty$1$1 = function () {
  try {
    var func = getNative$1(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

function baseAssignValue$1(object, key, value) {
  if (key == '__proto__' && defineProperty$1$1) {
    defineProperty$1$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var objectProto$6$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5$1 = objectProto$6$1.hasOwnProperty;

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
function assignValue$1(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$5$1.call(object, key) && eq$1(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue$1(object, key, value);
  }
}

function copyObject$1(source, props, object, customizer) {
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
      baseAssignValue$1(object, key, newValue);
    } else {
      assignValue$1(object, key, newValue);
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

var argsTag$2$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$1(value) && baseGetTag(value) == argsTag$2$1;
}

var objectProto$8$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7$1 = objectProto$8$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1$1 = objectProto$8$1.propertyIsEnumerable;

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
  return isObjectLike$1(value) && hasOwnProperty$7$1.call(value, 'callee') && !propertyIsEnumerable$1$1.call(value, 'callee');
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

var freeExports$1$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1$1 = freeExports$1$1 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1$1 = freeModule$1$1 && freeModule$1$1.exports === freeExports$1$1;

/** Built-in value references. */
var Buffer$1$1 = moduleExports$1$1 ? root$2.Buffer : undefined;

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
var MAX_SAFE_INTEGER$1$1 = 9007199254740991;

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
  length = length == null ? MAX_SAFE_INTEGER$1$1 : length;
  return !!length && (typeof value == 'number' || reIsUint$1.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$2 = 9007199254740991;

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
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$2;
}

var argsTag$3$1 = '[object Arguments]';
var arrayTag$2$1 = '[object Array]';
var boolTag$2$1 = '[object Boolean]';
var dateTag$2$1 = '[object Date]';
var errorTag$2$1 = '[object Error]';
var funcTag$3 = '[object Function]';
var mapTag$2$1 = '[object Map]';
var numberTag$2$1 = '[object Number]';
var objectTag$2$1 = '[object Object]';
var regexpTag$2$1 = '[object RegExp]';
var setTag$2$1 = '[object Set]';
var stringTag$2$1 = '[object String]';
var weakMapTag$2$1 = '[object WeakMap]';

var arrayBufferTag$2$1 = '[object ArrayBuffer]';
var dataViewTag$2$1 = '[object DataView]';
var float32Tag$2$1 = '[object Float32Array]';
var float64Tag$2$1 = '[object Float64Array]';
var int8Tag$2$1 = '[object Int8Array]';
var int16Tag$2$1 = '[object Int16Array]';
var int32Tag$2$1 = '[object Int32Array]';
var uint8Tag$2$1 = '[object Uint8Array]';
var uint8ClampedTag$2$1 = '[object Uint8ClampedArray]';
var uint16Tag$2$1 = '[object Uint16Array]';
var uint32Tag$2$1 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags$1 = {};
typedArrayTags$1[float32Tag$2$1] = typedArrayTags$1[float64Tag$2$1] = typedArrayTags$1[int8Tag$2$1] = typedArrayTags$1[int16Tag$2$1] = typedArrayTags$1[int32Tag$2$1] = typedArrayTags$1[uint8Tag$2$1] = typedArrayTags$1[uint8ClampedTag$2$1] = typedArrayTags$1[uint16Tag$2$1] = typedArrayTags$1[uint32Tag$2$1] = true;
typedArrayTags$1[argsTag$3$1] = typedArrayTags$1[arrayTag$2$1] = typedArrayTags$1[arrayBufferTag$2$1] = typedArrayTags$1[boolTag$2$1] = typedArrayTags$1[dataViewTag$2$1] = typedArrayTags$1[dateTag$2$1] = typedArrayTags$1[errorTag$2$1] = typedArrayTags$1[funcTag$3] = typedArrayTags$1[mapTag$2$1] = typedArrayTags$1[numberTag$2$1] = typedArrayTags$1[objectTag$2$1] = typedArrayTags$1[regexpTag$2$1] = typedArrayTags$1[setTag$2$1] = typedArrayTags$1[stringTag$2$1] = typedArrayTags$1[weakMapTag$2$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
    return isObjectLike$1(value) && isLength$1(value.length) && !!typedArrayTags$1[baseGetTag(value)];
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

var freeExports$2$1 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2$1 = freeExports$2$1 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2$1 = freeModule$2$1 && freeModule$2$1.exports === freeExports$2$1;

/** Detect free variable `process` from Node.js. */
var freeProcess$1 = moduleExports$2$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil$1 = function () {
  try {
    return freeProcess$1 && freeProcess$1.binding && freeProcess$1.binding('util');
  } catch (e) {}
}();

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

var objectProto$7$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6$1 = objectProto$7$1.hasOwnProperty;

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
    if ((inherited || hasOwnProperty$6$1.call(value, key)) && !(skipIndexes && (
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
var objectProto$10$1 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$10$1;

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

var nativeKeys$1 = overArg$1(Object.keys, Object);

var objectProto$9$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8$1 = objectProto$9$1.hasOwnProperty;

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
    if (hasOwnProperty$8$1.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction(value);
}

function keys$2(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys$1(object);
}

function baseAssign$1(object, source) {
  return object && copyObject$1(source, keys$2(source), object);
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
function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var objectProto$11$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9$1 = objectProto$11$1.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn$1(object) {
  if (!isObject(object)) {
    return nativeKeysIn$1(object);
  }
  var isProto = isPrototype$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$9$1.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

function keysIn$1$1(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object, true) : baseKeysIn$1(object);
}

function baseAssignIn$1(object, source) {
  return object && copyObject$1(source, keysIn$1$1(source), object);
}

var freeExports$3 = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$3 = freeExports$3 && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$3 = freeModule$3 && freeModule$3.exports === freeExports$3;

/** Built-in value references. */
var Buffer$2 = moduleExports$3 ? root$2.Buffer : undefined;
var allocUnsafe$1 = Buffer$2 ? Buffer$2.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer$1(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe$1 ? allocUnsafe$1(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$1(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
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
function arrayFilter$1(array, predicate) {
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
function stubArray$1() {
  return [];
}

var objectProto$12$1 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$2 = objectProto$12$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols$1 = !nativeGetSymbols$1$1 ? stubArray$1 : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter$1(nativeGetSymbols$1$1(object), function (symbol) {
    return propertyIsEnumerable$2.call(object, symbol);
  });
};

function copySymbols$1(source, object) {
  return copyObject$1(source, getSymbols$1(source), object);
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush$1(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var getPrototype$1 = overArg$1(Object.getPrototypeOf, Object);

var nativeGetSymbols$2 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn$1 = !nativeGetSymbols$2 ? stubArray$1 : function (object) {
  var result = [];
  while (object) {
    arrayPush$1(result, getSymbols$1(object));
    object = getPrototype$1(object);
  }
  return result;
};

function copySymbolsIn$1(source, object) {
  return copyObject$1(source, getSymbolsIn$1(source), object);
}

function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush$1(result, symbolsFunc(object));
}

function getAllKeys$1(object) {
  return baseGetAllKeys$1(object, keys$2, getSymbols$1);
}

function getAllKeysIn$1(object) {
  return baseGetAllKeys$1(object, keysIn$1$1, getSymbolsIn$1);
}

var DataView$1 = getNative$1(root$2, 'DataView');

var Promise$1$1 = getNative$1(root$2, 'Promise');

var Set$2 = getNative$1(root$2, 'Set');

var WeakMap$1 = getNative$1(root$2, 'WeakMap');

var mapTag$3$1 = '[object Map]';
var objectTag$3$1 = '[object Object]';
var promiseTag$1 = '[object Promise]';
var setTag$3$1 = '[object Set]';
var weakMapTag$3 = '[object WeakMap]';

var dataViewTag$3$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString$1 = toSource$1(DataView$1);
var mapCtorString$1 = toSource$1(Map$3);
var promiseCtorString$1 = toSource$1(Promise$1$1);
var setCtorString$1 = toSource$1(Set$2);
var weakMapCtorString$1 = toSource$1(WeakMap$1);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag$1$1 = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView$1 && getTag$1$1(new DataView$1(new ArrayBuffer(1))) != dataViewTag$3$1 || Map$3 && getTag$1$1(new Map$3()) != mapTag$3$1 || Promise$1$1 && getTag$1$1(Promise$1$1.resolve()) != promiseTag$1 || Set$2 && getTag$1$1(new Set$2()) != setTag$3$1 || WeakMap$1 && getTag$1$1(new WeakMap$1()) != weakMapTag$3) {
    getTag$1$1 = function getTag(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$3$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource$1(Ctor) : '';

        if (ctorString) {
            switch (ctorString) {
                case dataViewCtorString$1:
                    return dataViewTag$3$1;
                case mapCtorString$1:
                    return mapTag$3$1;
                case promiseCtorString$1:
                    return promiseTag$1;
                case setCtorString$1:
                    return setTag$3$1;
                case weakMapCtorString$1:
                    return weakMapTag$3;
            }
        }
        return result;
    };
}

var getTag$2 = getTag$1$1;

/** Used for built-in method references. */
var objectProto$13$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10$1 = objectProto$13$1.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray$1(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$10$1.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var Uint8Array$1 = root$2.Uint8Array;

function cloneArrayBuffer$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
  return result;
}

function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(dataView.buffer) : dataView.buffer;
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
function addMapEntry$1(map, pair) {
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
function arrayReduce$1(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray$1(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var CLONE_DEEP_FLAG$3$1 = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap$1(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray$1(map), CLONE_DEEP_FLAG$3$1) : mapToArray$1(map);
  return arrayReduce$1(array, addMapEntry$1, new map.constructor());
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags$1 = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
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
function addSetEntry$1(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
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

var CLONE_DEEP_FLAG$4 = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet$1(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray$1(set), CLONE_DEEP_FLAG$4) : setToArray$1(set);
  return arrayReduce$1(array, addSetEntry$1, new set.constructor());
}

var symbolProto$1$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf$1$1 = symbolProto$1$1 ? symbolProto$1$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol$1(symbol) {
  return symbolValueOf$1$1 ? Object(symbolValueOf$1$1.call(symbol)) : {};
}

function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var boolTag$3$1 = '[object Boolean]';
var dateTag$3$1 = '[object Date]';
var mapTag$4$1 = '[object Map]';
var numberTag$3$1 = '[object Number]';
var regexpTag$3$1 = '[object RegExp]';
var setTag$4$1 = '[object Set]';
var stringTag$3$1 = '[object String]';
var symbolTag$2$1 = '[object Symbol]';

var arrayBufferTag$3$1 = '[object ArrayBuffer]';
var dataViewTag$4$1 = '[object DataView]';
var float32Tag$3 = '[object Float32Array]';
var float64Tag$3 = '[object Float64Array]';
var int8Tag$3 = '[object Int8Array]';
var int16Tag$3 = '[object Int16Array]';
var int32Tag$3 = '[object Int32Array]';
var uint8Tag$3 = '[object Uint8Array]';
var uint8ClampedTag$3 = '[object Uint8ClampedArray]';
var uint16Tag$3 = '[object Uint16Array]';
var uint32Tag$3 = '[object Uint32Array]';

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
function initCloneByTag$1(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$3$1:
      return cloneArrayBuffer$1(object);

    case boolTag$3$1:
    case dateTag$3$1:
      return new Ctor(+object);

    case dataViewTag$4$1:
      return cloneDataView$1(object, isDeep);

    case float32Tag$3:case float64Tag$3:
    case int8Tag$3:case int16Tag$3:case int32Tag$3:
    case uint8Tag$3:case uint8ClampedTag$3:case uint16Tag$3:case uint32Tag$3:
      return cloneTypedArray$1(object, isDeep);

    case mapTag$4$1:
      return cloneMap$1(object, isDeep, cloneFunc);

    case numberTag$3$1:
    case stringTag$3$1:
      return new Ctor(object);

    case regexpTag$3$1:
      return cloneRegExp$1(object);

    case setTag$4$1:
      return cloneSet$1(object, isDeep, cloneFunc);

    case symbolTag$2$1:
      return cloneSymbol$1(object);
  }
}

var objectCreate$1 = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate$1 = function () {
  function object() {}
  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate$1) {
      return objectCreate$1(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

function initCloneObject$1(object) {
  return typeof object.constructor == 'function' && !isPrototype$1(object) ? baseCreate$1(getPrototype$1(object)) : {};
}

var CLONE_DEEP_FLAG$2$1 = 1;
var CLONE_FLAT_FLAG$1 = 2;
var CLONE_SYMBOLS_FLAG$2 = 4;

/** `Object#toString` result references. */
var argsTag$1$1 = '[object Arguments]';
var arrayTag$1$1 = '[object Array]';
var boolTag$1$1 = '[object Boolean]';
var dateTag$1$1 = '[object Date]';
var errorTag$1$1 = '[object Error]';
var funcTag$2$1 = '[object Function]';
var genTag$2 = '[object GeneratorFunction]';
var mapTag$1$1 = '[object Map]';
var numberTag$1$1 = '[object Number]';
var objectTag$1$1 = '[object Object]';
var regexpTag$1$1 = '[object RegExp]';
var setTag$1$1 = '[object Set]';
var stringTag$1$1 = '[object String]';
var symbolTag$1$1 = '[object Symbol]';
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

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags$1 = {};
cloneableTags$1[argsTag$1$1] = cloneableTags$1[arrayTag$1$1] = cloneableTags$1[arrayBufferTag$1$1] = cloneableTags$1[dataViewTag$1$1] = cloneableTags$1[boolTag$1$1] = cloneableTags$1[dateTag$1$1] = cloneableTags$1[float32Tag$1$1] = cloneableTags$1[float64Tag$1$1] = cloneableTags$1[int8Tag$1$1] = cloneableTags$1[int16Tag$1$1] = cloneableTags$1[int32Tag$1$1] = cloneableTags$1[mapTag$1$1] = cloneableTags$1[numberTag$1$1] = cloneableTags$1[objectTag$1$1] = cloneableTags$1[regexpTag$1$1] = cloneableTags$1[setTag$1$1] = cloneableTags$1[stringTag$1$1] = cloneableTags$1[symbolTag$1$1] = cloneableTags$1[uint8Tag$1$1] = cloneableTags$1[uint8ClampedTag$1$1] = cloneableTags$1[uint16Tag$1$1] = cloneableTags$1[uint32Tag$1$1] = true;
cloneableTags$1[errorTag$1$1] = cloneableTags$1[funcTag$2$1] = cloneableTags$1[weakMapTag$1$1] = false;

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
function baseClone$1(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$2$1,
      isFlat = bitmask & CLONE_FLAT_FLAG$1,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$2;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray$1(value);
  if (isArr) {
    result = initCloneArray$1(value);
    if (!isDeep) {
      return copyArray$1(value, result);
    }
  } else {
    var tag = getTag$2(value),
        isFunc = tag == funcTag$2$1 || tag == genTag$2;

    if (isBuffer$1(value)) {
      return cloneBuffer$1(value, isDeep);
    }
    if (tag == objectTag$1$1 || tag == argsTag$1$1 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject$1(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn$1(value, baseAssignIn$1(result, value)) : copySymbols$1(value, baseAssign$1(result, value));
      }
    } else {
      if (!cloneableTags$1[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag$1(value, tag, baseClone$1, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack$1());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull ? isFlat ? getAllKeysIn$1 : getAllKeys$1 : isFlat ? keysIn : keys$2;

  var props = isArr ? undefined : keysFunc(value);
  arrayEach$1(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue$1(result, key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var CLONE_DEEP_FLAG$1$1 = 1;
var CLONE_SYMBOLS_FLAG$1$1 = 4;

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
function cloneDeep$1(value) {
  return baseClone$1(value, CLONE_DEEP_FLAG$1$1 | CLONE_SYMBOLS_FLAG$1$1);
}

/** Used for built-in method references. */
var objectProto$14$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11$1 = objectProto$14$1.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty$11$1.call(object, key);
}

var symbolTag$3$1 = '[object Symbol]';

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
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike$1(value) && baseGetTag(value) == symbolTag$3$1;
}

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
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$1(value)) {
    return true;
  }
  return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) || object != null && value in Object(object);
}

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

var INFINITY$1$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$2$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolToString$1 = symbolProto$2$1 ? symbolProto$2$1.toString : undefined;

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
  return result == '0' && 1 / value == -INFINITY$1$1 ? '-0' : result;
}

function toString$1(value) {
  return value == null ? '' : baseToString$1(value);
}

function castPath$1(value, object) {
  if (isArray$1(value)) {
    return value;
  }
  return isKey$1(value, object) ? [value] : stringToPath$1(toString$1(value));
}

var INFINITY$2 = 1 / 0;

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
  return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
}

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

function has(object, path) {
  return object != null && hasPath$1(object, path, baseHas);
}

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
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome$1(array, predicate) {
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
function cacheHas$1(cache, key) {
  return cache.has(key);
}

var COMPARE_PARTIAL_FLAG$3$1 = 1;
var COMPARE_UNORDERED_FLAG$2$1 = 2;

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
function equalArrays$1(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3$1,
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
      seen = bitmask & COMPARE_UNORDERED_FLAG$2$1 ? new SetCache$1() : undefined;

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
      if (!arraySome$1(other, function (othValue, othIndex) {
        if (!cacheHas$1(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
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

var COMPARE_PARTIAL_FLAG$4$1 = 1;
var COMPARE_UNORDERED_FLAG$3$1 = 2;

/** `Object#toString` result references. */
var boolTag$4 = '[object Boolean]';
var dateTag$4 = '[object Date]';
var errorTag$3 = '[object Error]';
var mapTag$5 = '[object Map]';
var numberTag$4$1 = '[object Number]';
var regexpTag$4 = '[object RegExp]';
var setTag$5 = '[object Set]';
var stringTag$4$1 = '[object String]';
var symbolTag$4 = '[object Symbol]';

var arrayBufferTag$4 = '[object ArrayBuffer]';
var dataViewTag$5 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$3 = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf$2 = symbolProto$3 ? symbolProto$3.valueOf : undefined;

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
function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$5:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$4:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
        return false;
      }
      return true;

    case boolTag$4:
    case dateTag$4:
    case numberTag$4$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq$1(+object, +other);

    case errorTag$3:
      return object.name == other.name && object.message == other.message;

    case regexpTag$4:
    case stringTag$4$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag$5:
      var convert = mapToArray$1;

    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4$1;
      convert || (convert = setToArray$1);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$3$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$4:
      if (symbolValueOf$2) {
        return symbolValueOf$2.call(object) == symbolValueOf$2.call(other);
      }
  }
  return false;
}

var COMPARE_PARTIAL_FLAG$5$1 = 1;

/** Used for built-in method references. */
var objectProto$16 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$13 = objectProto$16.hasOwnProperty;

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
function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5$1,
      objProps = getAllKeys$1(object),
      objLength = objProps.length,
      othProps = getAllKeys$1(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$13.call(other, key))) {
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

var COMPARE_PARTIAL_FLAG$2$1 = 1;

/** `Object#toString` result references. */
var argsTag$4 = '[object Arguments]';
var arrayTag$3 = '[object Array]';
var objectTag$4$1 = '[object Object]';

/** Used for built-in method references. */
var objectProto$15$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$12$1 = objectProto$15$1.hasOwnProperty;

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
function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray$1(object),
      othIsArr = isArray$1(other),
      objTag = objIsArr ? arrayTag$3 : getTag$2(object),
      othTag = othIsArr ? arrayTag$3 : getTag$2(other);

  objTag = objTag == argsTag$4 ? objectTag$4$1 : objTag;
  othTag = othTag == argsTag$4 ? objectTag$4$1 : othTag;

  var objIsObj = objTag == objectTag$4$1,
      othIsObj = othTag == objectTag$4$1,
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
    return objIsArr || isTypedArray$1(object) ? equalArrays$1(object, other, bitmask, customizer, equalFunc, stack) : equalByTag$1(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2$1)) {
    var objIsWrapped = objIsObj && hasOwnProperty$12$1.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$12$1.call(other, '__wrapped__');

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
  return equalObjects$1(object, other, bitmask, customizer, equalFunc, stack);
}

function baseIsEqual$1(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike$1(value) && !isObjectLike$1(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep$1(value, other, bitmask, customizer, baseIsEqual$1, stack);
}

var COMPARE_PARTIAL_FLAG$1$1 = 1;
var COMPARE_UNORDERED_FLAG$1$1 = 2;

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
function baseIsMatch$1(object, source, matchData, customizer) {
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
      if (!(result === undefined ? baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$1$1 | COMPARE_UNORDERED_FLAG$1$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}

function isStrictComparable$1(value) {
  return value === value && !isObject(value);
}

function getMatchData$1(object) {
  var result = keys$2(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable$1(value)];
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
function matchesStrictComparable$1(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

function baseMatches$1(source) {
  var matchData = getMatchData$1(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch$1(object, source, matchData);
  };
}

function baseGet$1(object, path) {
  path = castPath$1(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$1(path[index++])];
  }
  return index && index == length ? object : undefined;
}

function get$4(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$1(object, path);
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
function baseHasIn$1(object, key) {
  return object != null && key in Object(object);
}

function hasIn$1(object, path) {
  return object != null && hasPath$1(object, path, baseHasIn$1);
}

var COMPARE_PARTIAL_FLAG$6 = 1;
var COMPARE_UNORDERED_FLAG$4 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty$1(path, srcValue) {
  if (isKey$1(path) && isStrictComparable$1(srcValue)) {
    return matchesStrictComparable$1(toKey$1(path), srcValue);
  }
  return function (object) {
    var objValue = get$4(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn$1(object, path) : baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG$6 | COMPARE_UNORDERED_FLAG$4);
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
function identity$5(value) {
  return value;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty$1(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

function basePropertyDeep$1(path) {
  return function (object) {
    return baseGet$1(object, path);
  };
}

function property$1(path) {
  return isKey$1(path) ? baseProperty$1(toKey$1(path)) : basePropertyDeep$1(path);
}

function baseIteratee$1(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity$5;
  }
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
    return isArray$1(value) ? baseMatchesProperty$1(value[0], value[1]) : baseMatches$1(value);
  }
  return property$1(value);
}

function createFind(findIndexFunc) {
  return function (collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike$1(collection)) {
      var iteratee = baseIteratee$1(predicate, 3);
      collection = keys$2(collection);
      predicate = function predicate(key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

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
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var INFINITY$3 = 1 / 0;
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
  if (value === INFINITY$3 || value === -INFINITY$3) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? remainder ? result - remainder : result : 0;
}

var nativeMax$1 = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax$1(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee$1(predicate, 3), index);
}

var find = createFind(findIndex);

var isSeriesDefined = function isSeriesDefined(opt) {
  return check(opt.data.s) && check(opt.data.s.accessor);
};

var getAllDataDef = function getAllDataDef(opt) {
    var allFields = [].concat(opt.data.x, opt.data.y);

    if (isSeriesDefined(opt)) {
        allFields = allFields.concat([opt.data.s]);
    }

    return allFields;
};

var getSortDef = function getSortDef(opt) {
    var allFields = getAllDataDef(opt);

    var _field = find(allFields, function (o) {
        return o.accessor === opt.ordering.accessor;
    });

    if (!check(_field)) {
        throw new Error('ordering accessor is invalid');
    }

    return _field;
};

var sortData = function sortData(_data, _options) {
    if (has(_options, 'ordering')) {
        var _field = getSortDef(_options);

        var _accessor = _field.accessor;

        if (check(_accessor)) {
            switch (_field.type) {
                case Globals.DataType.STRING:
                    _data.sort(function (a, b) {
                        return _options.ordering.direction === 'asc' ? a[_accessor].localeCompare(b[_accessor]) : b[_accessor].localeCompare(a[_accessor]);
                    });
                    break;
                default:
                    _data.sort(function (a, b) {
                        return _options.ordering.direction === 'asc' ? a[_accessor] - b[_accessor] : b[_accessor] - a[_accessor];
                    });

                    break;
            }
        }
    }
};

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

var dateTag$5 = '[object Date]';

/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */
function baseIsDate(value) {
  return isObjectLike$1(value) && baseGetTag(value) == dateTag$5;
}

var nodeIsDate = nodeUtil$1 && nodeUtil$1.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
var isDate = nodeIsDate ? baseUnary$1(nodeIsDate) : baseIsDate;

var cleanse = function cleanse(_data, _options) {
    var _allFields = getAllDataDef(_options);

    return _data.map(function (d) {
        var _d = d;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _allFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _dim = _step.value;

                switch (_dim.type) {
                    case Globals.DataType.DATE:
                        if (isNull$1(_dim.format) || isUndefined(_dim.format)) {
                            if (!isDate(d[_dim.accessor])) {
                                throw new Error(_dim.accessor + '\'s date format is not specified.');
                            } else {
                                _d[_dim.accessor] = d[_dim.accessor];
                            }
                        } else {
                            if (isFunction(_dim.format)) {
                                _d[_dim.accessor] = _dim.format(d[_dim.accessor]);
                            } else {
                                var parser = timeParse(_dim.format);
                                _d[_dim.accessor] = parser(d[_dim.accessor]);
                            }
                        }

                        break;

                    case Globals.DataType.NUMBER:
                        _d[_dim.accessor] = toNumber(d[_dim.accessor]);

                        break;
                    case Globals.DataType.STRING:
                        _d[_dim.accessor] = toString$1(d[_dim.accessor]);
                        break;

                    default:
                        _d[_dim.accessor] = d[_dim.accessor];
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

        return _d;
    });
};

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

function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}

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
function noop$1() {
  // No operation performed.
}

var INFINITY$4 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set$2 && 1 / setToArray$1(new Set$2([, -0]))[1] == INFINITY$4) ? noop$1 : function (values) {
  return new Set$2(values);
};

var LARGE_ARRAY_SIZE$2 = 200;

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
  } else if (length >= LARGE_ARRAY_SIZE$2) {
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

function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
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

var baseFor$1 = createBaseFor$1();

function baseForOwn$1(object, iteratee) {
  return object && baseFor$1(object, iteratee, keys$2);
}

function createBaseEach$1(eachFunc, fromRight) {
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

var baseEach$1 = createBaseEach$1(baseForOwn$1);

function baseMap$1(collection, iteratee) {
  var index = -1,
      result = isArrayLike$1(collection) ? Array(collection.length) : [];

  baseEach$1(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

function map$5(collection, iteratee) {
  var func = isArray$1(collection) ? arrayMap$1 : baseMap$1;
  return func(collection, baseIteratee$1(iteratee, 3));
}

var isYSort = function isYSort(opt) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = opt.data.y[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var y = _step.value;

            if (opt.ordering.accessor === y.accessor) {
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
};

var isBar = function isBar(options) {
    return options.chart.type === 'bar' || options.chart.type === 'bar_horizontal' || options.chart.type === 'bar_grouped' || options.chart.type === 'bar_stacked' || options.chart.type === 'bar_expanded';
};

var updateDimensionScale = function updateDimensionScale(data, opt) {
    var dim = opt.data.x;

    if (isBar(opt)) {
        dim.values = uniq(map$5(data, dim.accessor));

        dim.scale = band().domain(dim.values).range([0, opt.chart.innerWidth]).paddingInner(.1).paddingOuter(.6);

        return;
    }

    if (isYSort(opt)) {
        dim.values = uniq(map$5(data, dim.accessor));
        dim.scale = point$1().domain(dim.values).range([0, opt.chart.innerWidth]);

        return;
    }

    switch (dim.type) {
        case Globals.DataType.DATE:
            dim.values = uniq(map$5(data, dim.accessor));

            var _range = extent(data, function (d) {
                return d[dim.accessor];
            });

            dim.min = _range[0];
            dim.max = _range[1];

            dim.scale = scaleTime().domain(opt.ordering.direction === 'asc' ? _range : _range.reverse()).range([0, opt.chart.innerWidth]).interpolate(interpolateRound);

            break;

        case Globals.DataType.NUMBER:
            // todo number format
            dim.values = uniq(map$5(data, dim.accessor));

            var _rangeNm = extent(data, function (d) {
                return d[dim.accessor];
            });

            dim.min = _rangeNm[0];
            dim.max = _rangeNm[1];

            dim.scale = linear$2().domain(opt.ordering.direction === 'asc' ? _rangeNm : _rangeNm.reverse()).range([0, opt.chart.innerWidth]);

            break;
        case Globals.DataType.STRING:
            dim.values = uniq(map$5(data, dim.accessor));
            dim.scale = point$1().domain(dim.values).range([0, opt.chart.innerWidth]);

            break;

        default:
            break;
    }
};

var numberTag$5 = '[object Number]';

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
function isNumber$1(value) {
  return typeof value == 'number' || isObjectLike$1(value) && baseGetTag(value) == numberTag$5;
}

function isNaN$1$1(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber$1(value) && value != +value;
}

var _judgeMax = function _judgeMax(maxLength) {
    return Math.pow(10, maxLength);
};

var _maxLength = function _maxLength(max) {
    if (max >= 1) {
        return Math.round(max).toString().length;
    } else {
        var maxLength = 0;
        while (max < Math.pow(10, maxLength - 1)) {
            maxLength = maxLength - 1;
        }
        return maxLength;
    }
};

// ticks only positive
var _tickPositive = function _tickPositive(range, ticks, tier) {
    var min = 0;
    var max = range[1];
    var adjust = 0.9525;
    var maxTicks = 0;

    if (typeof ticks == 'number' && !isNaN$1$1(parseInt(ticks)) && isFinite(ticks) && ticks > 0) {
        maxTicks = ticks;
    }

    if (max - min == 0 || min == 0 && max == 1) {
        return [min, 1, maxTicks == 0 ? 5 : Math.min(maxTicks, 5)];
    } else if (maxTicks == 1) {
        return [min, max, 1];
    }

    if (typeof tier == 'number' && !isNaN$1$1(parseFloat(tier)) && isFinite(tier) && tier > 0 && max / tier <= maxTicks) {
        var current = tier;
        var maxRange = range[1];
        var _ticks = 1;
        while (true) {
            if (max < adjust * current) {
                maxRange = current;
                break;
            } else {
                current = current + tier;
                _ticks = _ticks + 1;
            }
        }
        return [min, maxRange, _ticks];
    } else {
        var maxLength = _maxLength(max);
        var _maxRange = _judgeMax(maxLength);
        var unit = 5;
        var multiplier = 1;

        if (maxTicks == 0) {
            if (max < adjust * _maxRange / 5) {
                unit = 50;
            } else if (max < adjust * _maxRange / 2) {
                unit = 20;
            } else if (max < adjust * _maxRange) {
                unit = 10;
            }
        } else {
            multiplier = maxTicks;
            unit = Math.pow(10, maxTicks.toString().length);
            if (max < adjust * _maxRange * 2 / unit) {
                unit = unit * 5;
            } else if (max < adjust * _maxRange * 5 / unit) {
                unit = unit * 2;
            }
        }

        var _tier = _maxRange / unit;
        var _current = _tier * multiplier;
        var _ticks2 = 1;

        while (true) {
            if (max < adjust * _current) {
                _maxRange = _current;
                break;
            } else {
                _current = _current + _tier * multiplier;
                _ticks2 = _ticks2 + 1;
            }
        }

        if (maxTicks == 0) {
            //control # of ticks to 7 or below
            switch (_ticks2) {
                case 10:
                    _ticks2 = 5;break;
                case 9:
                    _ticks2 = 3;break;
                case 8:
                    _ticks2 = 4;break;
            }
        } else {
            var minTicks = maxTicks;
            while (max < adjust * (_maxRange - _tier * _ticks2)) {
                _maxRange = _maxRange - _tier * _ticks2;
                minTicks--;
            }
            _ticks2 = minTicks;
        }

        if (maxLength < 0) {
            var precision = Math.pow(10, -1 * maxLength + 2);
            _maxRange = Math.round(_maxRange * precision) / precision;
        }

        return [min, _maxRange, _ticks2];
    }
};

// contains both positive and negative
var tickBothNegativeAndPositive = function tickBothNegativeAndPositive(range, ticks, tier) {
    var adjust = 0.9525;
    var maxTicks = 0;

    if (typeof ticks == 'number' && !isNaN$1$1(parseInt(ticks)) && isFinite(ticks) && ticks > 0) {
        maxTicks = ticks;
    }
    if (maxTicks == 1) {
        return [range[0], range[1], 1];
    }

    if (typeof tier == 'number' && !isNaN$1$1(parseFloat(tier)) && isFinite(tier) && tier > 0 && (Math.abs(range[0]) + Math.abs(range[1])) / tier <= maxTicks) {
        var minRange = range[0];
        var current = tier * -1;
        var _ticks3 = 1;
        while (true) {
            if (minRange > adjust * current) {
                minRange = current;
                break;
            } else {
                current = current - tier;
                _ticks3 = _ticks3 + 1;
            }
        }

        var maxRange = range[1];
        current = tier;

        while (true) {
            if (range < adjust * current) {
                maxRange = current;
                break;
            } else {
                current = current + tier;
                _ticks3 = _ticks3 + 1;
            }
        }
        return [minRange, maxRange, _ticks3];
    } else {
        var absmin = Math.abs(range[0]);
        var min = absmin < range[1] ? absmin : range[1];
        var max = absmin > range[1] ? absmin : range[1];

        var maxLength = _maxLength(max);
        var _maxRange2 = _judgeMax(maxLength);
        var _minRange = min;
        var unit = 5;
        var multiplier = 1;

        if (maxTicks == 0) {
            if (max < adjust * _maxRange2 / 5) {
                unit = 50;
            } else if (max < adjust * _maxRange2 / 2) {
                unit = 20;
            } else if (max < adjust * _maxRange2) {
                unit = 10;
            }
        } else {
            multiplier = maxTicks;
            unit = Math.pow(10, maxTicks.toString().length);
            if (max < adjust * _maxRange2 * 2 / unit) {
                unit = unit * 5;
            } else if (max < adjust * _maxRange2 * 5 / unit) {
                unit = unit * 2;
            }
        }

        var _tier2 = _maxRange2 / unit;
        var _current2 = _tier2 * multiplier;
        var _ticks4 = 1;

        while (true) {
            if (max < adjust * _current2) {
                _maxRange2 = _current2;
                break;
            } else {
                _current2 = _current2 + _tier2 * multiplier;
                _ticks4 = _ticks4 + 1;
            }
        }

        //calculate min
        _current2 = _tier2 * multiplier;
        while (true) {
            if (min < adjust * _current2) {
                _minRange = _current2;
                break;
            } else {
                _current2 = _current2 + _tier2 * multiplier;
                _ticks4 = _ticks4 + 1;
            }
        }

        if (maxTicks > 0) {
            var minTicks = maxTicks;
            while (max < adjust * (_maxRange2 - _tier2 * _ticks4)) {
                _maxRange2 = _maxRange2 - _tier2 * _ticks4;
                minTicks--;
            }
            while (min < adjust * (_minRange - _tier2 * _ticks4)) {
                _minRange = _minRange - _tier2 * _ticks4;
                minTicks--;
            }
            _ticks4 = minTicks;
        }

        return absmin < range[1] ? [_minRange * -1, _maxRange2, _ticks4] : [_maxRange2 * -1, _minRange, _ticks4];
    }
};

var tickRange = function tickRange(range, ticks, tier) {
    if (range.length == 0 || isUndefined(range[0]) || isNull$1(range[0]) || isNaN$1$1(range[0]) || isUndefined(range[1]) || isNull$1(range[1]) || isNaN$1$1(range[1])) {
        return [0, 1];
    } else if (range[0] >= 0) {
        //positive chart, adjust max scale only
        return _tickPositive(range, ticks, tier);
    } else if (range[1] <= 0) {
        //pure negative scale, we can use the position scale just reverse it
        var scale = _tickPositive([range[1] * -1, range[0] * -1], ticks, tier);
        return [scale[1] * -1, scale[0] * -1];
    } else {
        //mixed scale
        return tickBothNegativeAndPositive(range, ticks, tier);
    }
};

var isValid = function isValid(d) {
    return !isUndefined(d) && !isNull$1(d) && isNumber$1(d);
};

var updateMetricScale = function updateMetricScale(data, opt) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var _step$value = slicedToArray(_step.value, 2),
                i = _step$value[0],
                x = _step$value[1];

            var yList = opt.data.y.filter(function (d) {
                return d.yAxis === i;
            });
            var rangeList = yList.map(function (d) {
                return extent(data, function (datum) {
                    return datum[d.accessor];
                });
            });

            var universalMin = min$1(rangeList, function (d) {
                return d[0];
            });
            var universalMax = max(rangeList, function (d) {
                return d[1];
            });

            if (isValid(x.min)) {
                if (x.min > universalMin) {
                    console.error('invalid yAxis min detected, auto scale will be used');
                } else {
                    universalMin = x.min;
                }
            }

            if (isValid(x.max)) {
                if (x.max < universalMax) {
                    console.error('invalid yAxis max detected, auto scale will be used');
                } else {
                    universalMax = x.max;
                }
            }

            x.min = universalMin;
            x.max = universalMax;
        };

        for (var _iterator = opt.yAxis.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = opt.data.y[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var m = _step2.value;

            m.yAxis = m.yAxis || 0;

            if (opt.yAxis.length < m.yAxis + 1) {
                throw new Error('invalid yAxis definition for data y: ' + m.accessor);
            }

            var axisDef = opt.yAxis[m.yAxis];
            var range = [axisDef.min, axisDef.max];

            var _tickedRange = tickRange(range, opt.yAxis[m.yAxis].ticks, opt.yAxis[m.yAxis].tier);

            m.ticksMin = _tickedRange[0];
            m.ticksMax = _tickedRange[1];
            m.ticksTier = _tickedRange[2];

            m.min = range[0];
            m.max = range[1];

            m.scale = linear$2().domain([m.ticksMin, m.ticksMax]).range([opt.chart.innerHeight, 0]);
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
};

var updateOptionScales = function updateOptionScales(data, opt) {
    updateDimensionScale(data, opt);
    updateMetricScale(data, opt);
};

var processCartesianData = function processCartesianData(data, opt) {
    var cleanseData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var copy = cloneDeep$1(data);
    // a cleansed copy of data.
    var cleansed = cleanseData === true ? cleanse(copy, opt) : copy;

    sortData(cleansed, opt);
    updateOptionScales(cleansed, opt);

    return cleansed;
};

var pi$1 = Math.PI;
var tau$1 = 2 * pi$1;
var epsilon$1 = 1e-6;
var tauEpsilon = tau$1 - epsilon$1;

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
    else if (!(l01_2 > epsilon$1)) {}

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

var constant$6 = function (x) {
  return function constant() {
    return x;
  };
};

var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max$1$1 = Math.max;
var min$2 = Math.min;
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
      d = (dy < 0 ? -1 : 1) * sqrt$1(max$1$1(0, r * r * d2 - D * D)),
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
      cornerRadius = constant$6(0),
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
              rc = min$2(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
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
              rc0 = min$2(rc, (r0 - lc) / (kc - 1));
              rc1 = min$2(rc, (r1 - lc) / (kc + 1));
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
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$6(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$6(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$6(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$6(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$6(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$6(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$6(+_), arc) : padAngle;
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

function x$1(p) {
  return p[0];
}

function y$1(p) {
  return p[1];
}

var line = function () {
  var x$$1 = x$1,
      y$$1 = y$1,
      defined = constant$6(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function (_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$6(+_), line) : x$$1;
  };

  line.y = function (_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$6(+_), line) : y$$1;
  };

  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$6(!!_), line) : defined;
  };

  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
};

var area = function () {
  var x0 = x$1,
      x1 = null,
      y0 = constant$6(0),
      y1 = y$1,
      defined = constant$6(true),
      context = null,
      curve = curveLinear,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return line().defined(defined).curve(curve).context(context);
  }

  area.x = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$6(+_), x1 = null, area) : x0;
  };

  area.x0 = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$6(+_), area) : x0;
  };

  area.x1 = function (_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$6(+_), area) : x1;
  };

  area.y = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$6(+_), y1 = null, area) : y0;
  };

  area.y0 = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$6(+_), area) : y0;
  };

  area.y1 = function (_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$6(+_), area) : y1;
  };

  area.lineX0 = area.lineY0 = function () {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function () {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function () {
    return arealine().x(x1).y(y0);
  };

  area.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$6(!!_), area) : defined;
  };

  area.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
};

var descending$1 = function (a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

var identity$7 = function (d) {
  return d;
};

var pie = function () {
  var value = identity$7,
      sortValues = descending$1,
      sort = null,
      startAngle = constant$6(0),
      endAngle = constant$6(tau$2),
      padAngle = constant$6(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau$2, Math.max(-tau$2, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function (i, j) {
      return sortValues(arcs[i], arcs[j]);
    });else if (sort != null) index.sort(function (i, j) {
      return sort(data[i], data[j]);
    });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$6(+_), pie) : value;
  };

  pie.sortValues = function (_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function (_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$6(+_), pie) : startAngle;
  };

  pie.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$6(+_), pie) : endAngle;
  };

  pie.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$6(+_), pie) : padAngle;
  };

  return pie;
};

var curveRadialLinear = curveRadial(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function areaStart() {
    this._curve.areaStart();
  },
  areaEnd: function areaEnd() {
    this._curve.areaEnd();
  },
  lineStart: function lineStart() {
    this._curve.lineStart();
  },
  lineEnd: function lineEnd() {
    this._curve.lineEnd();
  },
  point: function point(a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function (_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

var radialLine = function () {
  return lineRadial(line().curve(curveRadialLinear));
};

var radialArea = function () {
  var a = area().curve(curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;

  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function () {
    return lineRadial(x0());
  }, delete a.lineX0;
  a.lineEndAngle = function () {
    return lineRadial(x1());
  }, delete a.lineX1;
  a.lineInnerRadius = function () {
    return lineRadial(y0());
  }, delete a.lineY0;
  a.lineOuterRadius = function () {
    return lineRadial(y1());
  }, delete a.lineY1;

  a.curve = function (_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return a;
};

var slice$2 = Array.prototype.slice;

var noop$3 = function () {};

function _point(that, x, y) {
  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 3:
        _point(this, this._x1, this._y1); // proceed
      case 2:
        this._context.lineTo(this._x1, this._y1);break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
      default:
        _point(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

var curveBasis = function (context) {
  return new Basis(context);
};

function BasisClosed(context) {
  this._context = context;
}

BasisClosed.prototype = {
  areaStart: noop$3,
  areaEnd: noop$3,
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x2, this._y2);
          this._context.closePath();
          break;
        }
      case 2:
        {
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
          this._context.closePath();
          break;
        }
      case 3:
        {
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        }
    }
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._x2 = x, this._y2 = y;break;
      case 1:
        this._point = 2;this._x3 = x, this._y3 = y;break;
      case 2:
        this._point = 3;this._x4 = x, this._y4 = y;this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);break;
      default:
        _point(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

var curveBasisClosed = function (context) {
  return new BasisClosed(context);
};

function BasisOpen(context) {
  this._context = context;
}

BasisOpen.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;var x0 = (this._x0 + 4 * this._x1 + x) / 6,
            y0 = (this._y0 + 4 * this._y1 + y) / 6;this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);break;
      case 3:
        this._point = 4; // proceed
      default:
        _point(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

var curveBasisOpen = function (context) {
  return new BasisOpen(context);
};

function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function lineStart() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function lineEnd() {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;
        this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
      }
    }

    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function point(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

var curveBundle = (function custom(beta) {

  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function (beta) {
    return custom(+beta);
  };

  return bundle;
})(0.85);

function _point$1(that, x, y) {
  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);break;
      case 3:
        _point$1(this, this._x1, this._y1);break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;this._x1 = x, this._y1 = y;break;
      case 2:
        this._point = 3; // proceed
      default:
        _point$1(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCardinal = (function custom(tension) {

  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: noop$3,
  areaEnd: noop$3,
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
      case 2:
        {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._x3 = x, this._y3 = y;break;
      case 1:
        this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
      case 2:
        this._point = 3;this._x5 = x, this._y5 = y;break;
      default:
        _point$1(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCardinalClosed = (function custom(tension) {

  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
      case 3:
        this._point = 4; // proceed
      default:
        _point$1(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCardinalOpen = (function custom(tension) {

  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function _point$2(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > epsilon$2) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > epsilon$2) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);break;
      case 3:
        this.point(this._x2, this._y2);break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3; // proceed
      default:
        _point$2(this, x, y);break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCatmullRom = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: noop$3,
  areaEnd: noop$3,
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
      case 2:
        {
          this._context.lineTo(this._x3, this._y3);
          this._context.closePath();
          break;
        }
      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;this._x3 = x, this._y3 = y;break;
      case 1:
        this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
      case 2:
        this._point = 3;this._x5 = x, this._y5 = y;break;
      default:
        _point$2(this, x, y);break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCatmullRomClosed = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
      case 3:
        this._point = 4; // proceed
      default:
        _point$2(this, x, y);break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCatmullRomOpen = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function LinearClosed(context) {
  this._context = context;
}

LinearClosed.prototype = {
  areaStart: noop$3,
  areaEnd: noop$3,
  lineStart: function lineStart() {
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._point) this._context.closePath();
  },
  point: function point(x, y) {
    x = +x, y = +y;
    if (this._point) this._context.lineTo(x, y);else this._point = 1, this._context.moveTo(x, y);
  }
};

var curveLinearClosed = function (context) {
  return new LinearClosed(context);
};

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

function monotoneX(context) {
  return new MonotoneX(context);
}

function monotoneY(context) {
  return new MonotoneY(context);
}

function Natural(context) {
  this._context = context;
}

Natural.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function lineEnd() {
    var x = this._x,
        y = this._y,
        n = x.length;

    if (n) {
      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
      if (n === 2) {
        this._context.lineTo(x[1], y[1]);
      } else {
        var px = controlPoints(x),
            py = controlPoints(y);
        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
        }
      }
    }

    if (this._line || this._line !== 0 && n === 1) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function point(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
function controlPoints(x) {
  var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
  for (i = 1; i < n - 1; ++i) {
    a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
  }a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
  for (i = 1; i < n; ++i) {
    m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
  }a[n - 1] = r[n - 1] / b[n - 1];
  for (i = n - 2; i >= 0; --i) {
    a[i] = (r[i] - a[i + 1]) / b[i];
  }b[n - 1] = (x[n] + a[n - 1]) / 2;
  for (i = 0; i < n - 1; ++i) {
    b[i] = 2 * x[i + 1] - a[i + 1];
  }return [a, b];
}

var curveNatural = function (context) {
  return new Natural(context);
};

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2; // proceed
      default:
        {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);
            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;
            this._context.lineTo(x1, this._y);
            this._context.lineTo(x1, y);
          }
          break;
        }
    }
    this._x = x, this._y = y;
  }
};

var curveStep = function (context) {
  return new Step(context, 0.5);
};

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

var none$1 = function (series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];
    for (j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
};

var none$2 = function (series) {
  var n = series.length,
      o = new Array(n);
  while (--n >= 0) {
    o[n] = n;
  }return o;
};

function stackValue(d, key) {
  return d[key];
}

var stack = function () {
  var keys = constant$6([]),
      order = none$2,
      offset = none$1,
      value = stackValue;

  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }
      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function (_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant$6(slice$2.call(_)), stack) : keys;
  };

  stack.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$6(+_), stack) : value;
  };

  stack.order = function (_) {
    return arguments.length ? (order = _ == null ? none$2 : typeof _ === "function" ? _ : constant$6(slice$2.call(_)), stack) : order;
  };

  stack.offset = function (_) {
    return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
  };

  return stack;
};

var stackOffsetExpand = function (series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) {
      y += series[i][j][1] || 0;
    }if (y) for (i = 0; i < n; ++i) {
      series[i][j][1] /= y;
    }
  }
  none$1(series, order);
};

var stackOffsetDiverging = function (series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = yp;
      }
    }
  }
};

var stackOffsetSilhouette = function (series, order) {
  if (!((n = series.length) > 0)) return;
  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) {
      y += series[i][j][1] || 0;
    }s0[j][1] += s0[j][0] = -y / 2;
  }
  none$1(series, order);
};

var stackOffsetWiggle = function (series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;
      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }
      s1 += sij0, s2 += s3 * sij0;
    }
    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }
  s0[j - 1][1] += s0[j - 1][0] = y;
  none$1(series, order);
};

var ascending$2 = function (series) {
  var sums = series.map(sum$1);
  return none$2(series).sort(function (a, b) {
    return sums[a] - sums[b];
  });
};

function sum$1(series) {
  var s = 0,
      i = -1,
      n = series.length,
      v;
  while (++i < n) {
    if (v = +series[i][1]) s += v;
  }return s;
}

var stackOrderDescending = function (series) {
  return ascending$2(series).reverse();
};

var stackOrderInsideOut = function (series) {
  var n = series.length,
      i,
      j,
      sums = series.map(sum$1),
      order = none$2(series).sort(function (a, b) {
    return sums[b] - sums[a];
  }),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];
    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
};

var stackOrderReverse = function (series) {
  return none$2(series).reverse();
};

var getSeriesOrdering = function getSeriesOrdering(opt) {
    switch (opt.ordering.direction) {
        case 'asc':
            return ascending$2;
        case 'desc':
            return stackOrderDescending;
        case 'none':
            return none$2;
        case 'reverse':
            return stackOrderReverse;
        default:
            return none$2;
    }
};

var getStack = function getStack(opt) {
    var stackLayout = stack();
    var ordering = getSeriesOrdering(opt);

    switch (opt.plots.stackMethod) {
        case Stacks.Expand:
            stackLayout.offset(stackOffsetExpand).order(ordering);
            break;
        case Stacks.Zero:
            stackLayout.offset(none$1).order(ordering);
            break;
        case Stacks.Silhouette:
            stackLayout.offset(stackOffsetSilhouette).order(stackOrderInsideOut);
            break;
        case Stacks.Wiggle:
            stackLayout.offset(stackOffsetWiggle).order(stackOrderInsideOut);
            break;
        case Stacks.Divergent:
            stackLayout.offset(stackOffsetDiverging).order(stackOrderInsideOut);
            break;

        default:
            stackLayout.offset(none$1);
            break;
    }

    return stackLayout;
};

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

function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach$1(collection, function (value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

function createAggregator(setter, initializer) {
  return function (collection, iteratee) {
    var func = isArray$1(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee$1(iteratee, 2), accumulator);
  };
}

var objectProto$17 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$14 = objectProto$17.hasOwnProperty;

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
  if (hasOwnProperty$14.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue$1(result, key, [value]);
  }
});

var transformSeriesToMatrix = function transformSeriesToMatrix(data, opt) {
    var matrix = [];

    var _getDimension = function _getDimension() {
        return opt.data.x;
    };
    var _getDimensionVal = function _getDimensionVal(d) {
        return d[_getDimension().accessor];
    };
    var _getMetric = function _getMetric() {
        return opt.data.y[0];
    };
    var _getMetricValue = function _getMetricValue(d) {
        return d[_getMetric().accessor];
    };

    var dimensionGroup = groupBy(data, function (d) {
        return _getDimensionVal(d);
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = _getDimension().values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _dim = _step.value;

            var _t = {};

            _t[_getDimension().accessor] = _dim;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = opt.data.s.values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _s = _step2.value;

                    _t[_s] = 0;
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

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = dimensionGroup[_dim][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _v = _step3.value;

                    _t[_v[opt.data.s.accessor]] = _getMetricValue(_v);
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

            matrix.push(_t);
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

    return matrix;
};

var generateStackLayout = function generateStackLayout(data, opt) {
    if (isSeriesDefined(opt)) {
        opt.data.s.values = uniq(map$5(data, opt.data.s.accessor));
    } else {
        opt.data.s.values = opt.data.y.map(function (d) {
            return d.accessor;
        });
    }

    var matrix = isSeriesDefined(opt) ? transformSeriesToMatrix(data, opt) : data;

    var stack = getStack(opt);
    stack.keys(opt.data.s.values);
    var layout = stack(matrix);

    return layout.map(function (d) {
        var metric = find(opt.data.y, function (e) {
            return e.accessor === d.key;
        });

        return {
            label: metric ? metric.name : d.key,
            key: d.key,
            values: d.map(function (e) {
                return {
                    y0: e[0],
                    y1: e[1],
                    y: metric ? metric.scale(e.data[metric.accessor]) : opt.data.y[0].scale(e.data[d.key]),
                    data: e.data
                };
            })
        };
    });
};

var rescaleStackedMetric = function rescaleStackedMetric(nestedData, opt) {
    var _min = min$1(nestedData.map(function (d) {
        return min$1(d.values.map(function (e) {
            return e.y0;
        }));
    }));
    var _max = max(nestedData.map(function (d) {
        return max(d.values.map(function (e) {
            return e.y1;
        }));
    }));

    return opt.plots.stackMethod === Stacks.Expand ? [0, 1, 5] : tickRange([_min, _max], opt.yAxis[0].ticks, opt.yAxis[0].tier);
};

var processStackedData = function processStackedData(data, opt) {
    var cleanse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var copy = processCartesianData(data, opt, cleanse);
    var nestedData = generateStackLayout(copy, opt);

    var minY = 0;
    var maxY = 0;

    if (opt.plots.stackLayout === true) {
        var _range = rescaleStackedMetric(nestedData, opt);
        minY = _range[0];
        maxY = _range[1];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = opt.data.y[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var m = _step.value;

                m.scale = linear$2().domain([minY, maxY]).range([opt.chart.innerHeight, 0]);
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
    } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = opt.data.y[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _m = _step2.value;

                minY = Math.min(minY, _m.min);
                maxY = Math.max(maxY, _m.max);
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
    }

    return {
        maxY: maxY,
        minY: minY,
        original: data,
        nested: nestedData
    };
};

var AbstractBasicCartesianChart = function (_AbstractCartesianCha) {
    inherits(AbstractBasicCartesianChart, _AbstractCartesianCha);

    function AbstractBasicCartesianChart(canvasId, _userOptions) {
        classCallCheck(this, AbstractBasicCartesianChart);
        return possibleConstructorReturn(this, (AbstractBasicCartesianChart.__proto__ || Object.getPrototypeOf(AbstractBasicCartesianChart)).call(this, canvasId, _userOptions));
    }

    createClass(AbstractBasicCartesianChart, [{
        key: 'update',
        value: function update() {
            get$2(AbstractBasicCartesianChart.prototype.__proto__ || Object.getPrototypeOf(AbstractBasicCartesianChart.prototype), 'update', this).call(this);
            this._data = processCartesianData(this._data, this._options, false);
        }
    }, {
        key: 'data',
        value: function data(_data) {
            if (check(_data) === true) {
                this._data = processCartesianData(_data, this._options, true);
            }

            return this._data;
        }
    }, {
        key: '_provideColor',
        value: function _provideColor() {
            var _array = this._data.map(this._getMetricVal);
            return genericColor(this._options.color, _array);
        }
    }]);
    return AbstractBasicCartesianChart;
}(AbstractCartesianChart);

var slice$3 = Array.prototype.slice;

var identity$8 = function (x) {
  return x;
};

var top = 1;
var right = 2;
var bottom = 3;
var left = 4;
var epsilon$3 = 1e-6;

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
        format = tickFormat == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$8 : tickFormat,
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





function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

var stringTag$5 = '[object String]';

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
  return typeof value == 'string' || !isArray$1(value) && isObjectLike$1(value) && baseGetTag(value) == stringTag$5;
}

var nativeIsFinite = root$2.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite$1(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

var isTickDiv = function isTickDiv(data, units) {
  return (data.length - 1) % units === 0;
};

var updateXAxisTicks = function updateXAxisTicks(data, opt, xAxis) {
    var getDimensionVal = function getDimensionVal(d) {
        return d[opt.data.x.accessor];
    };

    var maxTicks = opt.xAxis.ticks > 0 ? opt.xAxis.ticks : 31;
    if (data.length <= maxTicks) {
        xAxis.ticks(data.length);
        return;
    }

    var units = 10;
    if (maxTicks <= 10) {
        units = maxTicks;
        while (units > 1) {
            //minimum 1
            if (isTickDiv(data, units)) {
                break;
            }
            --units;
        }
    } else {
        if (isTickDiv(5)) {
            units = isTickDiv(data, 10) ? 10 : 5;
        } else if (isTickDiv(data, 7)) {
            units = 7;
        } else if (isTickDiv(data, 8)) {
            units = 8;
        } else if (isTickDiv(data, 9)) {
            units = 9;
        } else if (isTickDiv(data, 11)) {
            units = 11;
        } else if (maxTicks >= 12 && isTickDiv(data, 12)) {
            units = 12;
        } else if (maxTicks >= 13 && isTickDiv(data, 13)) {
            units = 13;
        } else if (isTickDiv(data, 6)) {
            units = 6;
        }
        //use default here
    }

    if (units > 1) {
        var current = 0;
        var index = 0;
        var lastIndex = data.length - 1;
        var increment = Math.floor((data.length - 1) / units);
        var arr = new Array(units + (isTickDiv(data, units) ? 1 : 2));

        while (current < lastIndex) {
            arr[index++] = getDimensionVal(data[current]);
            current += increment;
        }
        arr[index] = getDimensionVal(data[lastIndex]);
        xAxis.tickValues(arr);
    } else {
        xAxis.ticks(null);
    }
};

var rotateXTicks = function rotateXTicks(_selector, angle) {
    var transition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var _rotate = "rotate(-" + angle + ")";

    var _tickText = _selector.selectAll('.x.axis .tick text');

    if (transition === true) {
        _tickText.transition().duration(300);
    }

    if (angle === 90) {
        _tickText.attr("transform", _rotate).attr("dx", -10).attr("dy", -6).style("text-anchor", "end");
    } else if (angle === 0) {
        _tickText.attr("transform", _rotate).attr("dx", 0).attr("dy", 10).style("text-anchor", "middle");
    } else if (angle === 60 || angle === 45) {
        _tickText.attr("transform", _rotate).attr("dx", -10).attr("dy", 0).style("text-anchor", "end");
    } else if (angle === 75) {
        _tickText.attr("transform", _rotate).attr("dx", -10).attr("dy", -4).style("text-anchor", "end");
    } else if (angle === 30) {
        _tickText.attr("transform", _rotate).attr("dx", -5).attr("dy", 7).style("text-anchor", "end");
    }
};

var transitionTicks = function transitionTicks(svg, data, opt, xAxis, yAxis) {
    var transition = svg.transition().duration(opt.animation.duration.update);
    var delay = function delay(d, i) {
        return i / data.length * opt.animation.duration.update;
    };

    transition.select(".x.axis").delay(delay).call(xAxis);

    transition.select(".y.axis").delay(delay).call(yAxis);

    svg.select('.x.axis').selectAll('.tick').attr('opacity', opt.xAxis.showTicks === true ? 1 : 0);
    svg.select('.y.axis').selectAll('.tick').attr('opacity', opt.yAxis[0].showTicks === true ? 1 : 0);
    rotateXTicks(svg, opt.xAxis.labelAngle, false);
};

var cnTimeFormat = function cnTimeFormat(date) {
    var CN = formatLocale$1({
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        "shortDays": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "shortMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    });

    var formatMillisecond = CN.format(".%L"),
        formatSecond = CN.format(":%S"),
        formatMinute = CN.format("%I:%M"),
        formatHour = CN.format("%I %p"),
        formatDay = CN.format("%a %d"),
        formatWeek = CN.format("%b %d"),
        formatMonth = CN.format("%B"),
        formatYear = CN.format("%Y");

    return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? sunday(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
};

var updateAxis = function updateAxis(svg, data, opt) {
    var dimension = opt.data.x;
    var metric = opt.data.y[0];
    var xScale = dimension.scale;
    var yScale = metric.scale;
    var xAxis = axisBottom();
    var yAxis = axisLeft();

    //scale ticks, bar is special because every column is distinct
    if (isBar(opt) === true) {
        updateXAxisTicks(data, opt, xAxis);
    } else {
        if (dimension.type === Globals.DataType.DATE) {
            if (opt.xAxis.ticks > 0) {
                //follow user specification
                xAxis.ticks(Math.min(data.length, opt.xAxis.ticks));
            } else if (data.length > 31) {
                xAxis.ticks(10);
            } else {
                xAxis.ticks(data.length);
            }
        } else if (dimension.type === Globals.DataType.NUMBER) {
            if (opt.ordering.accessor !== opt.data.y[0].accessor) {
                if (opt.xAxis.ticks > 0) {
                    //follow user specification
                    xAxis.ticks(Math.min(data.length, opt.xAxis.ticks));
                } else {
                    xAxis.ticks(null);
                }
            } else {
                updateXAxisTicks(data, opt, xAxis);
            }
        } else if (dimension.type === Globals.DataType.STRING) {
            updateXAxisTicks(data, opt, xAxis);
        }
    }

    yScale.nice();

    //tick formats
    if (isString$1(opt.yAxis[0].tickFormat)) {
        yAxis.tickFormat(format(opt.yAxis[0].tickFormat));
    } else {
        yAxis.tickFormat(null);
    }

    if (isString$1(opt.xAxis.tickFormat) && opt.xAxis.tickFormat.length > 0) {
        xAxis.tickFormat(format(opt.xAxis.tickFormat));
    } else if (dimension.type === Globals.DataType.DATE) {
        if (opt.locale === 'zh') {
            xAxis.tickFormat(cnTimeFormat);
        } else {
            xAxis.tickFormat(null);
        }
    } else {
        xAxis.tickFormat(null);
    }

    xAxis.scale(xScale);
    yAxis.scale(yScale);
    if (isNumber$1(opt.yAxis[0].ticks) && isFinite$1(opt.yAxis[0].ticks) && opt.yAxis[0].ticks > 0) {
        yAxis.ticks(metric.ticksTier);
    }

    transitionTicks(svg, data, opt, xAxis, yAxis);

    return {
        x: xAxis,
        y: yAxis
    };
};

var renderAxis = function renderAxis(svg, data, opt) {
    var _updateAxis = updateAxis(svg, data, opt),
        _xAxis = _updateAxis.x,
        _yAxis = _updateAxis.y;

    var xAxis = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + opt.chart.innerHeight + ")").call(_xAxis);

    var yAxis = svg.append("g").attr("class", "y axis").call(_yAxis);

    if (opt.yAxis.length > 0 && opt.yAxis[0].title.text != null) {
        svg.append("text").attr('class', 'axis-label').attr("transform", "rotate(-90)").attr("y", 0 - opt.chart.margin.left + opt.yAxis[0].title.offset).attr("x", 0 - opt.chart.innerHeight / 2).attr("dy", "1em").style("text-anchor", "middle").text(opt.yAxis[0].title.text);
    }

    if (opt.xAxis.title.text != null) {
        svg.append("text").attr('class', 'axis-label').attr("transform", "translate(" + opt.chart.innerWidth / 2 + " ," + (opt.chart.innerHeight + opt.chart.margin.top + opt.xAxis.title.offset) + ")").style("text-anchor", "middle").text(opt.xAxis.title.text);
    }

    xAxis.selectAll('.tick').attr('opacity', opt.xAxis.showTicks === true ? 1 : 0);
    yAxis.selectAll('.tick').attr('opacity', opt.yAxis[0].showTicks === true ? 1 : 0);

    rotateXTicks(svg, opt.xAxis.labelAngle, false);
};

var AbstractBasicCartesianChartWithAxes = function (_AbstractBasicCartesi) {
    inherits(AbstractBasicCartesianChartWithAxes, _AbstractBasicCartesi);

    function AbstractBasicCartesianChartWithAxes(canvasId, _userOptions) {
        classCallCheck(this, AbstractBasicCartesianChartWithAxes);
        return possibleConstructorReturn(this, (AbstractBasicCartesianChartWithAxes.__proto__ || Object.getPrototypeOf(AbstractBasicCartesianChartWithAxes)).call(this, canvasId, _userOptions));
    }

    createClass(AbstractBasicCartesianChartWithAxes, [{
        key: 'render',
        value: function render(_data) {
            get$2(AbstractBasicCartesianChartWithAxes.prototype.__proto__ || Object.getPrototypeOf(AbstractBasicCartesianChartWithAxes.prototype), 'render', this).call(this, _data);
            renderAxis(this._svg, this._data, this._options);
        }
    }, {
        key: 'update',
        value: function update() {
            get$2(AbstractBasicCartesianChartWithAxes.prototype.__proto__ || Object.getPrototypeOf(AbstractBasicCartesianChartWithAxes.prototype), 'update', this).call(this);
            updateAxis(this._svg, this._data, this._options);
        }
    }]);
    return AbstractBasicCartesianChartWithAxes;
}(AbstractBasicCartesianChart);

var CartesianOptions = {
    color: {
        scheme: MetroRain3,
        type: Globals.ColorType.GRADIENT
    },
    chart: {
        margin: {
            left: 60,
            bottom: 50,
            right: 10,
            top: 20
        }
    },
    ordering: {
        accessor: null,
        direction: 'asc'
    },

    xAxis: {
        showTicks: true,
        allowDecimals: false,
        scale: null,
        ticks: 0,
        tickFormat: null,
        max: null,
        min: null,
        labelAngle: 0,

        title: {
            text: null,
            style: null,
            offset: 10
        }
    },

    yAxis: [{
        showTicks: true,
        allowDecimals: false,
        scale: null,
        max: null,
        min: null,
        ticks: 0,
        tier: 6,
        title: {
            text: null,
            style: null,
            offset: 10
        }
    }],

    data: {
        x: {
            accessor: null,
            type: Globals.DataType.NUMBER,
            formatter: null
        },
        y: [{
            accessor: null,
            type: Globals.DataType.NUMBER,
            formatter: null,
            yAxis: 0,
            tooltip: {
                valueSuffix: null
            }
        }]
    }

};

var createCartesianOpt = function createCartesianOpt(_chartOpt, _userOpt) {
    var cartesianOpt = mergeBase(CartesianOptions, _chartOpt, _userOpt);

    if (!has(_userOpt, 'ordering')) {
        cartesianOpt.ordering.accessor = cartesianOpt.data.x.accessor;
    }

    return cartesianOpt;
};

var sortSelector = function sortSelector(selector, opt) {
    var field = getSortDef(opt);
    var accessor = opt.ordering.accessor;
    var direction = opt.ordering.direction;

    selector.sort(function (a, b) {
        if (field.type === Globals.DataType.STRING) {
            return direction === 'asc' ? a[accessor].localeCompare(b[accessor]) : b[accessor].localeCompare(a[accessor]);
        } else {
            return direction === 'asc' ? a[accessor] - b[accessor] : b[accessor] - a[accessor];
        }
    });
};

var drawVerticalLabel = function drawVerticalLabel(context, node, opt) {
    if (node.attr('dimension')) {
        context.save();

        context.translate(node.attr('x'), opt.chart.innerHeight);
        context.rotate(-Math.PI / 2);
        context.textAlign = "bottom";
        context.textBaseline = 'middle';

        context.strokeStyle = 'rgba(255,255,255, 0.7)';
        context.lineWidth = 4;
        context.strokeText(node.attr('dimension'), 5, node.attr('width') / 2);

        context.fillStyle = opt.plots.barLabel.color;
        context.fillText(node.attr('dimension'), 5, node.attr('width') / 2);

        context.restore();
    }
};

var drawMetricOntTop = function drawMetricOntTop(context, node, opt) {
    context.save();

    context.translate(node.attr('x'), node.attr('y'));
    context.textAlign = "center";
    // context.textBaseline = 'middle';

    context.fillStyle = opt.plots.metricLabel.color;
    context.fillText(node.attr('metric'), node.attr('width') / 2, -opt.plots.metricLabel.offset);

    context.restore();
};

var drawRects = function drawRects(context, selection, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    selection.each(function (d) {
        context.save();

        var node = select(this);

        context.beginPath();
        context.fillStyle = node.attr('fill');
        context.globalAlpha = node.attr('opacity');
        context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        context.fill();

        context.restore();

        if (opt.plots.barLabel.enabled === true) drawVerticalLabel(context, node, opt);
        if (opt.plots.metricLabel.enabled === true) drawMetricOntTop(context, node, opt);
    });
};

var drawHiddenRects = function drawHiddenRects(context, selection) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var colorMap = new Map();

    selection.each(function (d, i) {
        context.save();

        var node = select(this);
        var color = genColorByIndex(i + 1);
        context.beginPath();
        context.fillStyle = color;
        context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        context.fill();

        context.restore();

        colorMap.set(color, d);
    });

    return colorMap;
};

var hasNegativeValue = function hasNegativeValue(data, opt) {
    var hasNegative = false;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        dataLoop: for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = opt.data.y[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _y = _step2.value;

                    if (d[_y.accessor] < 0) {
                        hasNegative = true;
                        break dataLoop;
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

    return hasNegative;
};

var BarOpt = {
    chart: { type: 'bar' },
    plots: {
        barLabel: {
            enabled: false,
            color: 'black'
        },
        metricLabel: {
            enabled: false,
            color: 'black',
            offset: 10
        }
    }
};

var Bar = function (_AbstractBasicCartesi) {
    inherits(Bar, _AbstractBasicCartesi);

    function Bar(canvasId, _userOptions) {
        classCallCheck(this, Bar);

        var _this = possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).call(this, canvasId, _userOptions));

        _this._w = function () {
            if (isUndefined(_this._getDimension().scale.bandwidth) || !isFunction(_this._getDimension().scale.bandwidth)) {
                var evenWidth = Math.ceil(_this._options.chart.innerWidth / _this._data.length);

                return evenWidth > 1 ? evenWidth - 1 : 0.1;
            } else {
                return _this._getDimension().scale.bandwidth();
            }
        };
        _this._h = function (d) {
            return _this._options.chart.innerHeight - _this._y(d);
        };
        _this._zero = function () {
            return _this._getMetric().scale(0);
        };

        // We also make a map/dictionary to keep track of colors associated with node.
        _this.colToNode;
        return _this;
    }

    createClass(Bar, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var _hasNegative = hasNegativeValue(this._data, this._options);

            var drawCanvasInTransition = function drawCanvasInTransition() {
                return function (t) {
                    drawRects(_this2._frontContext, _this2._detachedContainer.selectAll('.bar'), _this2._options);
                };
            };

            var dataUpdate = this._detachedContainer.selectAll('.bar').data(this._data);
            var dataJoin = dataUpdate.enter();
            var dataRemove = dataUpdate.exit();

            var exitTransition = transition().duration(this._options.animation.duration.remove).each(function () {
                dataRemove.transition().attr("y", _hasNegative ? _this2._y(0) : _this2._options.chart.innerHeight).attr("height", 0).tween("remove.rects", drawCanvasInTransition);

                dataRemove.remove();
            });

            var updateTransition = exitTransition.transition().duration(this._options.animation.duration.update).each(function () {
                dataUpdate.attr('dimension', _this2._getDimensionVal).attr('metric', _this2._getMetricVal).transition("update-rect-transition").delay(function (d, i) {
                    return i / _this2._data.length * _this2._options.animation.duration.update;
                }).attr('fill', _this2._c).attr("x", _this2._x).attr('width', _this2._w).attr("y", function (d) {
                    return _this2._getMetricVal(d) > 0 ? _this2._y(d) : _this2._zero();
                }).attr("height", function (d) {
                    return _hasNegative ? Math.abs(_this2._y(d) - _this2._zero()) : _this2._h(d);
                }).tween("update.rects", drawCanvasInTransition);
            });

            var enterTransition = updateTransition.transition().duration(this._options.animation.duration.add).each(function () {
                dataJoin.append("rect").attr('class', 'bar').attr('fill', _this2._c).attr('opacity', 1).attr("x", _this2._x).attr('width', _this2._w).attr('dimension', _this2._getDimensionVal).attr('metric', _this2._getMetricVal).attr("y", _hasNegative ? _this2._zero(0) : _this2._options.chart.innerHeight).attr("height", 0).transition().duration(_this2._options.animation.duration.add).delay(function (d, i) {
                    return i / _this2._data.length * _this2._options.animation.duration.add;
                }).attr("y", function (d) {
                    return _this2._getMetricVal(d) > 0 ? _this2._y(d) : _this2._zero();
                }).attr("height", function (d) {
                    return _hasNegative ? Math.abs(_this2._y(d) - _this2._zero()) : _this2._h(d);
                }).tween("append.rects", drawCanvasInTransition);
            });

            var that = this;
            enterTransition.on('end', function () {
                var colorMap = drawHiddenRects(_this2._hiddenContext, _this2._detachedContainer.selectAll('.bar'));

                // shadow color?
                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];
                    // This will return that pixel's color


                    var col = that._hiddenContext.getImageData(mx * that._canvasScale, my * that._canvasScale, 1, 1).data;
                    //Our map uses these rgb strings as keys to nodes.
                    var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                    var node = colorMap.get(colString);

                    if (node) {
                        that._tooltip.html(that.tooltip(node)).transition().duration(that._options.animation.tooltip).style("left", mx + that._options.tooltip.offset[0] + "px").style("top", my + that._options.tooltip.offset[1] + "px").style("opacity", 1);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);
                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'sortDetached',
        value: function sortDetached() {
            var _this3 = this;

            this._detachedContainer.selectAll(".bar").transition().duration(this._options.animation.duration.update).delay(function (d, i) {
                return i / _this3._data.length * _this3._options.animation.duration.update;
            }).attr("x", this._x);
        }
    }, {
        key: 'sort',
        value: function sort(field, direction) {
            var _this4 = this;

            this._options.ordering = {
                accessor: field,
                direction: direction
            };

            this._data = get$2(Bar.prototype.__proto__ || Object.getPrototypeOf(Bar.prototype), 'data', this).call(this, this._data);
            sortSelector(this._detachedContainer.selectAll('.bar'), this._options);

            var drawCanvasInTransition = function drawCanvasInTransition() {
                return function (t) {
                    drawRects(_this4._frontContext, _this4._detachedContainer.selectAll('.bar'), _this4._options);
                };
            };

            this._detachedContainer.selectAll(".bar").transition().duration(this._options.animation.duration.update).delay(function (d, i) {
                return i / _this4._data.length * _this4._options.animation.duration.update;
            }).attr("x", this._x).tween("append.rects", drawCanvasInTransition);

            this.axes.update(this._svg, this._data);
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOptions) {
            return createCartesianOpt(BarOpt, _userOptions);
        }
    }]);
    return Bar;
}(AbstractBasicCartesianChartWithAxes);

var drawHiddenCanvas = function drawHiddenCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    var colorMap = new Map();

    var radius = Math.min(opt.chart.innerWidth, opt.chart.innerHeight) / 2;
    var arcDiagram = arc().outerRadius(radius * 0.8).innerRadius(function () {
        return opt.plots.isDonut ? radius * opt.plots.innerRadiusRatio : 0;
    }).context(context);

    var pieDiagram = pie().sort(null).value(function (d) {
        return d.y;
    });

    var slices = pieDiagram(state);

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = slices.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = slicedToArray(_step.value, 2),
                i = _step$value[0],
                s = _step$value[1];

            context.beginPath();
            arcDiagram(s);
            var color = genColorByIndex(i + 1);
            context.fillStyle = color;
            context.fill();

            colorMap.set(color, s);
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

    context.restore();

    return colorMap;
};

var percentFormat = format(".00%");

var limitSliceValues = function limitSliceValues(data, opt, color) {
    var minPct = opt.plots.labelMinPercentage;
    var total = sum(data, function (d) {
        return d.y;
    });

    var maxTicks = opt.xAxis.ticks > 0 ? opt.xAxis.ticks : 31;
    var maxLength = data.length;
    var maxData = void 0;

    if (minPct === 0) {
        maxData = data;
    }

    if (maxLength > maxTicks) {
        var maxIndividual = maxTicks - 1;
        var etcTotal = 0;
        var etcData = [];
        var i = void 0;

        maxData = new Array();

        for (i = 0; i < maxIndividual; ++i) {
            maxData[i] = data[i];

            
        }

        for (i = maxIndividual; i < maxLength; ++i) {
            etcTotal += data[i].y;
            etcData.push(data[i]);
        }

        maxData[maxIndividual] = {
            y: etcTotal,
            c: color(etcTotal),
            alpha: opt.plots.opacity,
            data: etcData,
            label: opt.plots.othersTitle
        };

        
    } else {
        maxData = data;
    }

    // this.consecutiveSmalls = !noTwoSmalls;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = maxData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;

            d.p = percentFormat(d.y / total);
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

    return maxData;
};

var centroidOnArc = function centroidOnArc(arc, context, radius, slice) {
    var _arc$centroid = arc.centroid(slice),
        _arc$centroid2 = slicedToArray(_arc$centroid, 2),
        x = _arc$centroid2[0],
        y = _arc$centroid2[1];
    // pythagorean theorem for hypotenuse


    var h = Math.sqrt(x * x + y * y);

    return [x / h * radius, y / h * radius];
};

var drawControlPoint = function drawControlPoint(context, slice, centroid, opt) {
    context.save();

    context.beginPath();
    context.fillStyle = slice.data.c;
    context.globalAlpha = slice.data.alpha;
    context.arc(centroid[0], centroid[1], opt.plots.labelControlPointRadius, 0, 2 * Math.PI, false);
    context.fill();

    context.strokeStyle = 'white';
    context.strokeWidth = 4;
    context.stroke();
    context.closePath();

    context.restore();
};

var midAngle = function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
};

var getLinePosition = function getLinePosition(centroid, d2) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;

    var pos = [];
    var angle = midAngle(d2) / Math.PI * 180;

    pos[0] = angle > 180 ? centroid[0] - offset : centroid[0] + offset;
    pos[1] = centroid[1];

    if (angle <= 0 || angle >= 360) {
        pos[1] -= offset;
    } else if (angle == 180) {
        pos[1] += offset;
    } else if (angle <= 30) {
        pos[1] -= (30 - angle) / 30 * offset;
    } else if (angle >= 150) {
        if (angle < 180) {
            pos[1] += (angle - 150) / 30 * offset;
        } else if (angle <= 210) {
            pos[1] += (210 - angle) / 30 * offset;
        } else if (angle >= 330) {
            pos[1] -= (angle - 330) / 30 * offset;
        }
    }
    return pos;
};

var drawPolyLine = function drawPolyLine(context, slice, centroid, opt) {
    var start = centroid;
    var end = getLinePosition(centroid, slice, opt.plots.labelOffset);

    context.save();
    context.beginPath();
    context.strokeStyle = slice.data.c;
    context.strokeWidth = 4;

    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();

    context.translate(end[0], end[1]);
    context.textAlign = end[0] > start[0] ? "start" : 'end';
    context.textBaseline = 'middle';
    context.fillStyle = 'black';
    context.fillText(slice.data.label + ': ' + slice.data.p, end[0] > start[0] ? 5 : -5, 0);
    context.restore();
};

var drawCanvas = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var radius = Math.min(opt.chart.innerWidth, opt.chart.innerHeight) / 2 - opt.plots.outerRadiusMargin;
    var arcDiagram = arc().outerRadius(radius).innerRadius(function () {
        return opt.plots.isDonut ? radius * opt.plots.innerRadiusRatio : 0;
    }).context(context);

    var pieDiagram = pie().sort(null).value(function (d) {
        return d.y;
    });

    var slices = pieDiagram(state);

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = slices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            context.beginPath();
            arcDiagram(s);
            context.fillStyle = s.data.c;
            context.fill();

            var outerArc = arc().innerRadius(radius).outerRadius(radius).context(context);
            var centroid = centroidOnArc(outerArc, context, radius, s);

            drawControlPoint(context, s, centroid, opt);
            drawPolyLine(context, s, centroid, opt);
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

    context.restore();
};

var animateStates = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var DefaultOptions = {
    chart: {
        type: 'pie'
    },
    plots: {
        othersTitle: 'Others',
        isDonut: false,
        opacity: 0.8,
        innerRadiusRatio: 0.4,
        outerRadiusMargin: 70,
        labelOffset: 20,
        labelControlPointRadius: 6,
        labelPosition: 'auto',
        labelMinPercentage: 0.01
    }
};

var Pie = function (_AbstractBasicCartesi) {
    inherits(Pie, _AbstractBasicCartesi);

    function Pie(canvasId, _userOptions) {
        classCallCheck(this, Pie);
        return possibleConstructorReturn(this, (Pie.__proto__ || Object.getPrototypeOf(Pie)).call(this, canvasId, _userOptions));
    }

    createClass(Pie, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var initialState = this.previousState ? this.previousState : this._data.map(function (d) {
                return {
                    y: 0,
                    c: _this2._c(d),
                    alpha: 0,
                    data: d,
                    p: '0%',
                    label: _this2._getDimensionVal(d)
                };
            });

            var finalState = this._data.map(function (d) {
                return {
                    y: _this2._y(d),
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    data: d,
                    label: _this2._getDimensionVal(d),
                    p: ''
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var transformedInitial = limitSliceValues(initialState, this._options, this._color);
            var transformedFinal = limitSliceValues(finalState, this._options, this._color);

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates(transformedInitial, transformedFinal, opt.animation.duration.update, ctx, opt).then(function (res) {
                var colorMap = drawHiddenCanvas(that._hiddenContext, res, opt, that);
                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var col = that._hiddenContext.getImageData(mx * that._canvasScale, my * that._canvasScale, 1, 1).data;
                    var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                    var node = colorMap.get(colString);

                    if (node) {
                        var html = void 0;
                        if (isArray$1(node.data.data)) {
                            var n = {};
                            n[that._getDimension().accessor] = node.data.label;
                            n[that._getMetric().accessor] = sum(node.data.data.map(function (d) {
                                return d.data;
                            }), that._getMetricVal);
                            html = that.tooltip(n);
                        } else {
                            html = that.tooltip(node.data.data);
                        }

                        that._tooltip.html(html).transition().duration(that._options.animation.tooltip).style("left", mx + that._options.tooltip.offset[0] + "px").style("top", my + that._options.tooltip.offset[1] + "px").style("opacity", 1);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianOpt(DefaultOptions, _userOpt);
        }
    }, {
        key: '_provideColor',
        value: function _provideColor() {
            // pie's other slice may contain value out of range
            return this._data.length > 1 ? get$2(Pie.prototype.__proto__ || Object.getPrototypeOf(Pie.prototype), '_provideColor', this).call(this).clamp(true) : get$2(Pie.prototype.__proto__ || Object.getPrototypeOf(Pie.prototype), '_provideColor', this).call(this);
        }
    }]);
    return Pie;
}(AbstractBasicCartesianChart);

var nodeColor = function nodeColor(opt) {
    var stops = linearStops(opt.color.scheme);
    return stops[stops.length - 1].color;
};

var drawPoints = function drawPoints(context, particles, opt, hidden) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = particles.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = slicedToArray(_step.value, 2),
                i = _step$value[0],
                p = _step$value[1];

            context.save();

            context.beginPath();
            context.fillStyle = hidden === true ? genColorByIndex(i) : nodeColor(opt);
            context.globalAlpha = p.alpha;
            context.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
            context.fill();

            context.restore();
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

var Curves = {
    LINEAR: 'linear',
    LINEAR_CLOSED: 'linear-closed',
    STEP: 'step',
    STEP_BEFORE: 'step-before',
    STEP_AFTER: 'step-after',
    BASIS: 'basis',
    BASIS_OPEN: 'basis-open',
    BASIS_CLOSED: 'basis-closed',
    BUNDLE: 'bundle',
    CARDINAL: 'cardinal',
    CARDINAL_OPEN: 'cardinal-open',
    CARDINAL_CLOSED: 'cardinal-closed',
    MONOTONE_X: 'monotoneX',
    MONOTONE_Y: 'monotoneY',
    NATURAL: 'natural',
    CATMULL_ROM: 'catmull-rom',
    CATMULL_ROM_CLOSED: 'catmull-rom-closed',
    CATMULL_ROM_OPEN: 'catmull-rom-open'
};

var interpolateCurve = function interpolateCurve(_curve, _shapes) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = _shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _shape = _step.value;

            switch (_curve) {
                case Curves.LINEAR:
                    _shape.curve(curveLinear);

                    break;
                case Curves.LINEAR_CLOSED:
                    _shape.curve(curveLinearClosed);

                    break;
                case Curves.STEP:
                    _shape.curve(curveStep);

                    break;
                case Curves.STEP_BEFORE:
                    _shape.curve(stepBefore);

                    break;
                case Curves.STEP_AFTER:
                    _shape.curve(stepAfter);

                    break;
                case Curves.BASIS:
                    _shape.curve(curveBasis);

                    break;
                case Curves.BASIS_OPEN:
                    _shape.curve(curveBasisOpen);

                    break;
                case Curves.BASIS_CLOSED:
                    _shape.curve(curveBasisClosed);

                    break;
                case Curves.BUNDLE:
                    _shape.curve(curveBundle);

                    break;
                case Curves.CARDINAL:
                    _shape.curve(curveCardinal);

                    break;
                case Curves.CARDINAL_OPEN:
                    _shape.curve(curveCardinalOpen);

                    break;
                case Curves.CARDINAL_CLOSED:
                    _shape.curve(curveCardinalClosed);

                    break;
                case Curves.MONOTONE_X:
                    _shape.curve(monotoneX);
                    break;
                case Curves.MONOTONE_Y:
                    _shape.curve(monotoneY);
                    break;
                case Curves.NATURAL:
                    _shape.curve(curveNatural);
                    break;

                case Curves.CATMULL_ROM:
                    _shape.curve(curveCatmullRom);
                    break;

                case Curves.CARDINAL_CLOSED:
                    _shape.curve(curveCatmullRomClosed);
                    break;

                case Curves.CARDINAL_OPEN:
                    _shape.curve(curveCatmullRomOpen);
                    break;

                default:
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
};

var drawArea = function drawArea(context, particles, opt) {
    context.save();

    var curve = area().x(function (d) {
        return d.x;
    }).y0(context.canvas.height).y1(function (d) {
        return d.y;
    }).context(context);

    interpolateCurve(opt.plots.curve, [curve]);
    context.beginPath();
    curve(particles);
    context.lineWidth = opt.plots.strokeWidth;
    var gradientStyle = verticalGradient(context, opt.color.scheme, opt.plots.areaOpacity);
    context.fillStyle = gradientStyle;
    context.strokeStyle = nodeColor(opt);
    context.stroke();

    context.fill();
    context.closePath();

    context.restore();
};

var drawLine = function drawLine(context, particles, opt) {
    context.save();

    var curve = line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).context(context);
    interpolateCurve(opt.plots.curve, [curve]);

    context.beginPath();
    curve(particles);
    context.lineWidth = opt.plots.strokeWidth;
    var gradientStyle = verticalGradient(context, opt.color.scheme, 1);
    context.strokeStyle = gradientStyle;

    context.stroke();
    context.closePath();
    context.restore();
};

var drawCanvas$2 = function drawCanvas(context, particles, opt) {
    var hidden = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (hidden === true) {
        drawPoints(context, particles, opt, true);
    } else {
        if (opt.plots.drawArea === true) {
            drawArea(context, particles, opt);
        } else {
            drawLine(context, particles, opt);
        }

        if (opt.plots.showDots === true) {
            drawPoints(context, particles, opt, false);
        }
    }
};

var animateStates$2 = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$2(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var highlightNode = function highlightNode(context, opt, datum, x, y) {
    context.save();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.highlightNodeColor ? opt.plots.highlightNodeColor : getTransparentColor(datum.c, 0.9);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.arc(x, y, 6, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.closePath();

    context.restore();
};

var AreaOpt = {
    chart: {
        type: 'area_horizontal'
    },
    plots: {
        areaOpacity: 0.3,
        curve: 'basis',
        strokeWidth: 2,
        highlightNodeColor: '#F03E1E',
        nodeRadius: 4,
        drawArea: true,
        showDots: false
    }
};

var Area = function (_AbstractBasicCartesi) {
    inherits(Area, _AbstractBasicCartesi);

    function Area(canvasId, _userOptions) {
        classCallCheck(this, Area);
        return possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, canvasId, _userOptions));
    }

    createClass(Area, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var stops = linearStops(this._options.color.scheme);
            var nodeColor = stops[stops.length - 1].color;

            var initialState = this.previousState ? this.previousState : this._data.map(function (d) {
                return {
                    x: _this2._x(d),
                    y: _this2._frontCanvas.node().height,
                    r: _this2._options.plots.nodeRadius,
                    c: nodeColor,
                    alpha: 0,
                    data: d
                };
            });

            var finalState = this._data.map(function (d) {
                return {
                    x: _this2._x(d),
                    y: _this2._y(d),
                    r: _this2._options.plots.nodeRadius,
                    c: nodeColor,
                    alpha: 1,
                    data: d
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$2(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                _this2._voronoi = applyVoronoi(ctx, opt, res);
                // this._quadtree = applyQuadtree(ctx, opt, res);

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 100;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);

                    if (closest) {
                        that._tooltip.html(that.tooltip(closest.data.data)).transition().duration(that._options.animation.tooltip).style("left", mx + opt.tooltip.offset[0] + "px").style("top", my + opt.tooltip.offset[1] + "px").style("opacity", 1);

                        drawCanvas$2(ctx, res, opt, false);
                        highlightNode(ctx, opt, closest.data, closest[0], closest[1]);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                        drawCanvas$2(ctx, res, opt, false);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                    drawCanvas$2(ctx, res, opt, false);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianOpt(AreaOpt, _userOpt);
        }
    }]);
    return Area;
}(AbstractBasicCartesianChartWithAxes);

var DefaultOptions$1 = {
    chart: {
        type: 'line'
    },
    plots: {
        curve: 'linear',
        strokeWidth: 3,
        nodeRadius: 4,
        highlightNodeColor: '#F03E1E',
        drawArea: false,
        showDots: true
    }
};

var Line = function (_Area) {
    inherits(Line, _Area);

    function Line(canvasId, _userOptions) {
        classCallCheck(this, Line);
        return possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, canvasId, _userOptions));
    }

    createClass(Line, [{
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianOpt(DefaultOptions$1, _userOpt);
        }
    }]);
    return Line;
}(Area);

var updateRadiusScale = function updateRadiusScale(opt, data) {
    var radiusDef = opt.r;

    if (check(radiusDef.scale) && isFunction(radiusDef.scale)) {
        opt.data.r.scale = radiusDef.scale;
    } else {
        if (check(opt.data.r) && check(opt.data.r.accessor)) {
            var range = extent(data, function (d) {
                return d[opt.data.r.accessor];
            });

            opt.data.r.min = range[0];
            opt.data.r.max = range[1];

            opt.data.r.scale = linear$2().domain([opt.data.r.min, opt.data.r.max]).range([radiusDef.min, radiusDef.max]);
        } else {
            opt.data.r.scale = null;
        }
    }
};

var drawCanvas$4 = function drawCanvas(context, particles) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            context.save();

            context.beginPath();
            context.fillStyle = p.c;
            context.globalAlpha = p.alpha;
            context.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
            context.fill();

            context.restore();
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

var animateStates$4 = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$4(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var highlightNode$2 = function highlightNode(context, p) {
    context.save();
    context.beginPath();
    context.fillStyle = color(p.c).brighter().toString();
    context.globalAlpha = 1;
    context.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
};

var ScatterOptions = {
    chart: {
        type: 'scatter'
    },
    plots: {
        opacity: 1
    },

    r: {
        scale: null,
        max: 20,
        min: 6,
        default: 8
    },

    data: {
        r: {
            accessor: null,
            type: Globals.DataType.NUMBER,
            formatter: null
        }
    }
};

var Scatter = function (_AbstractBasicCartesi) {
    inherits(Scatter, _AbstractBasicCartesi);

    function Scatter(canvasId, _userOptions) {
        classCallCheck(this, Scatter);

        var _this = possibleConstructorReturn(this, (Scatter.__proto__ || Object.getPrototypeOf(Scatter)).call(this, canvasId, _userOptions));

        _this._getRadius = function () {
            return _this._options.data.r;
        };
        _this._getRadiusValue = function (d) {
            return d[_this._getRadius().accessor];
        };
        _this._r = function (d) {
            return isNull$1(_this._getRadius().scale) ? _this._options.r.default : _this._getRadius().scale(_this._getRadiusValue(d));
        };
        return _this;
    }

    createClass(Scatter, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var initialState = this.previousState ? this.previousState : this._data.map(function (d, i) {
                return {
                    id: i,
                    x: _this2._x(d),
                    y: _this2._frontCanvas.node().height,
                    r: _this2._r(d),
                    c: _this2._c(d),
                    alpha: 0,
                    data: d
                };
            });

            var finalState = this._data.map(function (d, i) {
                return {
                    id: i,
                    x: _this2._x(d),
                    y: _this2._y(d),
                    r: _this2._r(d),
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    data: d
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$4(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                that._voronoi = applyVoronoi(ctx, opt, res);

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 100;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);

                    if (closest) {
                        that._tooltip.html(that.tooltip(closest.data.data)).transition().duration(that._options.animation.tooltip).style("left", mx + opt.tooltip.offset[0] + "px").style("top", my + opt.tooltip.offset[1] + "px").style("opacity", 1);

                        drawCanvas$4(ctx, finalState);
                        highlightNode$2(ctx, closest.data);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                        drawCanvas$4(ctx, finalState);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                    drawCanvas$4(ctx, finalState);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'data',
        value: function data(_data) {
            if (_data) {
                get$2(Scatter.prototype.__proto__ || Object.getPrototypeOf(Scatter.prototype), 'data', this).call(this, _data);
                updateRadiusScale(this._options, _data);
            }

            return this._data;
        }
    }, {
        key: 'hexbinLayout',
        value: function hexbinLayout() {
            drawHexbin(this._frontContext, this.previousState, this._options);
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianOpt(ScatterOptions, _userOpt);
        }
    }]);
    return Scatter;
}(AbstractBasicCartesianChartWithAxes);

var AbstractStackedCartesianChart = function (_AbstractCartesianCha) {
    inherits(AbstractStackedCartesianChart, _AbstractCartesianCha);

    function AbstractStackedCartesianChart(canvasId, _userOptions) {
        classCallCheck(this, AbstractStackedCartesianChart);

        var _this = possibleConstructorReturn(this, (AbstractStackedCartesianChart.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChart)).call(this, canvasId, _userOptions));

        _this._getSeries = function () {
            return _this._options.data.s;
        };
        _this._s = function (d) {
            return d[_this._getSeries().accessor];
        };
        _this._y1 = function (d) {
            return _this._getMetric().scale(d.y1);
        };
        _this._y0 = function (d) {
            return _this._getMetric().scale(d.y0);
        };
        _this._c = function (d) {
            return has(d, 'key') ? _this._color(d.key) : _this._color(_this._s(d));
        };
        return _this;
    }

    createClass(AbstractStackedCartesianChart, [{
        key: 'render',
        value: function render(_data) {
            get$2(AbstractStackedCartesianChart.prototype.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChart.prototype), 'render', this).call(this, _data);
        }
    }, {
        key: 'update',
        value: function update() {
            this.data(this._data.original);

            get$2(AbstractStackedCartesianChart.prototype.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChart.prototype), 'update', this).call(this);
        }
    }, {
        key: 'data',
        value: function data(_data) {
            if (check(_data) === true) {
                this._data = processStackedData(_data, this._options, true);
            }

            return this._data;
        }
    }, {
        key: '_provideColor',
        value: function _provideColor() {
            var _num = this._data && this._data.nested ? this._data.nested.length : 0;

            return categoricalColor(this._options.color.scheme, _num);
        }
    }]);
    return AbstractStackedCartesianChart;
}(AbstractCartesianChart);

var AbstractStackedCartesianChartWithAxes = function (_AbstractStackedCarte) {
    inherits(AbstractStackedCartesianChartWithAxes, _AbstractStackedCarte);

    function AbstractStackedCartesianChartWithAxes(canvasId, _userOptions) {
        classCallCheck(this, AbstractStackedCartesianChartWithAxes);
        return possibleConstructorReturn(this, (AbstractStackedCartesianChartWithAxes.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChartWithAxes)).call(this, canvasId, _userOptions));
    }

    createClass(AbstractStackedCartesianChartWithAxes, [{
        key: 'render',
        value: function render(_data) {
            get$2(AbstractStackedCartesianChartWithAxes.prototype.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChartWithAxes.prototype), 'render', this).call(this, _data);
            renderAxis(this._svg, this._data.nested[0].values.map(function (d) {
                return d.data;
            }), this._options);
        }
    }, {
        key: 'update',
        value: function update() {
            get$2(AbstractStackedCartesianChartWithAxes.prototype.__proto__ || Object.getPrototypeOf(AbstractStackedCartesianChartWithAxes.prototype), 'update', this).call(this);
            updateAxis(this._svg, this._data.nested[0].values.map(function (d) {
                return d.data;
            }), this._options);
        }
    }]);
    return AbstractStackedCartesianChartWithAxes;
}(AbstractStackedCartesianChart);

var CartesianStackedOptions = {
    chart: {
        margin: {
            left: 60,
            bottom: 50,
            right: 10,
            top: 20
        }
    },
    color: {
        scheme: MetroRain8,
        type: Globals.ColorType.CATEGORICAL
    },
    ordering: {
        accessor: null,
        direction: 'asc'
    },

    series: {
        allowDecimals: false,
        scale: null,
        max: null,
        min: null,
        ticks: 0,
        title: {
            text: '',
            style: ''
        }
    },

    xAxis: {
        showTicks: true,
        allowDecimals: false,
        scale: null,
        ticks: 0,
        tickFormat: null,
        max: null,
        min: null,
        labelAngle: 0,

        title: {
            text: null,
            style: null
        }
    },

    yAxis: [{
        showTicks: true,
        allowDecimals: false,
        scale: null,
        max: null,
        min: null,
        ticks: 0,
        title: {
            text: null,
            style: null
        }
    }],

    data: {
        s: {
            accessor: null,
            type: Globals.DataType.STRING,
            formatter: function formatter() {}
        },
        x: {
            accessor: null,
            type: Globals.DataType.STRING,
            formatter: function formatter() {}
        },
        y: [{
            accessor: null,
            type: Globals.DataType.NUMBER,
            formatter: function formatter() {},
            yAxis: 0
        }]
    }

};

var createCartesianStackedOpt = function createCartesianStackedOpt(_chartOpt, _userOpt) {
    var cartesianOpt = mergeBase(CartesianStackedOptions, _chartOpt, _userOpt);

    cartesianOpt.ordering.accessor = cartesianOpt.data.x.accessor;

    return cartesianOpt;
};

var drawCanvas$6 = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var curve = opt.plots.stackLayout === true ? area().x(function (d) {
        return d.x;
    }).y0(function (d) {
        return d.y0;
    }).y1(function (d) {
        return d.y1;
    }).context(context) : area().x(function (d) {
        return d.x;
    }).y0(opt.chart.innerHeight).y1(function (d) {
        return d.y;
    }).context(context);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            context.save();

            var color = n.c;
            var hslColorSpace = hsl(color);
            hslColorSpace.opacity = n.alpha;

            interpolateCurve(opt.plots.curve, [curve]);
            context.beginPath();
            curve(n.values);
            context.lineWidth = opt.plots.strokeWidth;
            context.strokeStyle = color;
            context.stroke();

            context.fillStyle = hslColorSpace;

            context.fill();
            context.closePath();

            context.restore();
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

var animateStates$6 = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$6(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var highlightArea = function highlightArea(context, state, opt, highlighted) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var curve = opt.plots.stackLayout === true ? area().x(function (d) {
        return d.x;
    }).y0(function (d) {
        return d.y0;
    }).y1(function (d) {
        return d.y1;
    }).context(context) : area().x(function (d) {
        return d.x;
    }).y0(opt.chart.innerHeight).y1(function (d) {
        return d.y;
    }).context(context);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            context.save();
            var color = n.c;
            var hslColorSpace = hsl(color);
            hslColorSpace.opacity = n.key === highlighted.key ? 0.6 : 0.2;

            interpolateCurve(opt.plots.curve, [curve]);
            context.beginPath();
            curve(n.values);
            context.lineWidth = opt.plots.strokeWidth;
            context.strokeStyle = n.key === highlighted.key ? color : hslColorSpace;
            context.stroke();

            context.fillStyle = hslColorSpace;

            context.fill();
            context.closePath();
            context.restore();
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

var highlightNode$4 = function highlightNode(context, opt, c, x, y) {
    context.save();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.highlightNodeColor ? opt.plots.highlightNodeColor : getTransparentColor(c, 0.9);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.arc(x, y, 6, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.closePath();

    context.restore();
};

var StackedOptions = {
    chart: {
        type: 'area_stacked'
    },
    animation: {
        duration: {
            curve: 500
        }
    },
    plots: {
        stackLayout: true,
        stackMethod: Stacks.Zero,
        showDots: false,
        curve: 'basis',
        strokeWidth: 2,
        highlightNodeColor: '#F03E1E',
        opacityArea: 0.7
    }
};

var AreaMultiOptions = {
    chart: {
        type: 'area_multi'
    },
    animation: {
        duration: {
            curve: 500
        }
    },
    plots: {
        stackLayout: false,
        stackMethod: Stacks.Zero,
        showDots: false,
        highlightNodeColor: '#F03E1E',
        curve: 'basis',
        strokeWidth: 2,
        opacityArea: 0.7
    }
};

var ExpandedOptions = {
    chart: {
        type: 'area_expanded'
    },
    animation: {
        duration: {
            curve: 500
        }
    },
    plots: {
        stackLayout: true,
        stackMethod: Stacks.Expand,
        highlightNodeColor: '#F03E1E',
        showDots: false,
        curve: 'basis',
        strokeWidth: 2,
        opacityArea: 0.7
    }
};

var StackedArea = function (_AbstractStackedCarte) {
    inherits(StackedArea, _AbstractStackedCarte);

    function StackedArea(canvasId, _userOptions) {
        classCallCheck(this, StackedArea);
        return possibleConstructorReturn(this, (StackedArea.__proto__ || Object.getPrototypeOf(StackedArea)).call(this, canvasId, _userOptions));
    }

    createClass(StackedArea, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var initialState = this.previousState ? this.previousState : this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: 0,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            c: _this2._c(d),
                            x: _this2._x(e.data),
                            y: _this2._options.chart.innerHeight,
                            y0: _this2._y0(e),
                            y1: _this2._y1(e),
                            data: e.data
                        };
                    })
                };
            });

            var finalState = this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacityArea,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            c: _this2._c(d),
                            x: _this2._x(e.data),
                            y: e.y,
                            y0: _this2._y0(e),
                            y1: _this2._y1(e),
                            data: e.data
                        };
                    })
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$6(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                that._voronoi = applyVoronoi(ctx, opt, res.reduce(function (acc, p) {
                    acc = acc.concat(p.values);
                    return acc;
                }, []));

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 40;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);

                    if (closest) {
                        closest.data.data[that._getMetric().accessor] = closest.data.data[closest.data.key];

                        that._tooltip.html(that.tooltip(closest.data.data)).transition().duration(that._options.animation.tooltip).style("left", mx + opt.tooltip.offset[0] + "px").style("top", my + opt.tooltip.offset[1] + "px").style("opacity", 1);

                        highlightArea(ctx, res, opt, closest.data);
                        highlightNode$4(ctx, opt, closest.data.c, closest[0], closest[1]);
                    } else {
                        drawCanvas$6(ctx, res, opt);

                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                    }
                }

                function mouseOutHandler() {
                    drawCanvas$6(ctx, res, opt);

                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: '_updateLayout',
        value: function _updateLayout(_opt) {
            this._options.chart.type = _opt.chart.type;
            this._options.plots.stackLayout = _opt.plots.stackLayout;
            this._options.plots.stackMethod = _opt.plots.stackMethod;

            this.update();
        }
    }, {
        key: 'stackLayout',
        value: function stackLayout() {
            this._updateLayout(StackedOptions);
        }
    }, {
        key: 'expandLayout',
        value: function expandLayout() {
            this._updateLayout(ExpandedOptions);
        }
    }, {
        key: 'groupedLayout',
        value: function groupedLayout() {
            this._updateLayout(AreaMultiOptions);
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(StackedOptions, _userOpt);
        }
    }]);
    return StackedArea;
}(AbstractStackedCartesianChartWithAxes);

var drawCanvas$8 = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var curve = area().x(function (d) {
        return d.x;
    }).y0(function (d) {
        return d.y0;
    }).y1(function (d) {
        return d.y1;
    }).curve(curveCardinal).context(context);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            context.save();

            var color = n.c;
            var hslColorSpace = hsl(color);
            hslColorSpace.opacity = n.alpha;

            context.beginPath();
            curve(n.values);
            context.lineWidth = opt.plots.strokeWidth;
            context.strokeStyle = color;
            context.stroke();
            context.fillStyle = hslColorSpace;
            context.fill();
            context.closePath();

            context.restore();
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

var animateStates$8 = function animateStates(initialState, finalState, duration, context, opt) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$8(context, interpolateParticles(t), opt);

            if (t === 1) {
                batchRendering.stop();
                // final state as result
                resolve(interpolateParticles(t));
            }
        });
    });
};

var highlightNode$6 = function highlightNode(context, opt, datum, x, y) {
    context.save();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.highlightNodeColor ? opt.plots.highlightNodeColor : getTransparentColor(datum.c, 0.9);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.arc(x, y, 6, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.closePath();

    context.restore();
};

var DefaultOptions$2 = {
    chart: {
        type: 'stream'
    },
    plots: {
        stackLayout: true,
        stackMethod: Stacks.Wiggle,
        highlightNodeColor: '#F03E1E',
        opacityArea: 0.7,
        dotRadius: 8
    }
};

var Stream = function (_AbstractStackedCarte) {
    inherits(Stream, _AbstractStackedCarte);

    function Stream(canvasId, _userOptions) {
        classCallCheck(this, Stream);
        return possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this, canvasId, _userOptions));
    }

    createClass(Stream, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var _min = min$1(this._data.nested.map(function (d) {
                return min$1(d.values.map(function (e) {
                    return e.y0;
                }));
            }));

            this._getMetric().scale.domain([_min, this._data.maxY]);

            var initialState = this.previousState ? this.previousState : this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    alpha: 0,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: e.y,
                            y0: _this2._options.chart.innerHeight / 2,
                            y1: _this2._options.chart.innerHeight / 2,
                            data: e.data
                        };
                    })
                };
            });

            var finalState = this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacityArea,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: e.y,
                            y0: _this2._y0(e),
                            y1: _this2._y1(e),
                            data: e.data
                        };
                    })
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$8(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                that._voronoi = applyVoronoi(ctx, opt, res.reduce(function (acc, p) {
                    acc = acc.concat(p.values.map(function (d) {
                        var n = d;
                        n.y = d.y1;
                        return n;
                    }));
                    return acc;
                }, []));

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 40;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);

                    if (closest) {
                        closest.data.data[that._getMetric().accessor] = closest.data.data[closest.data.key];
                        that._tooltip.html(that.tooltip(closest.data.data)).transition().duration(that._options.animation.tooltip).style("left", mx + opt.tooltip.offset[0] + "px").style("top", my + opt.tooltip.offset[1] + "px").style("opacity", 1);

                        drawCanvas$8(ctx, res, opt);
                        highlightNode$6(ctx, opt, closest.data.c, closest[0], closest[1]);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                        drawCanvas$8(ctx, res, opt);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                    drawCanvas$8(ctx, res, opt);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(DefaultOptions$2, _userOpt);
        }
    }]);
    return Stream;
}(AbstractStackedCartesianChartWithAxes);

var drawCanvas$10 = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var curve = line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).context(context);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            context.save();
            var color = n.c;
            var hslColorSpace = hsl(color);
            hslColorSpace.opacity = n.alpha;

            interpolateCurve(opt.plots.curve, [curve]);
            context.beginPath();
            curve(n.values);
            context.lineWidth = opt.plots.strokeWidth;
            context.strokeStyle = color;
            context.stroke();
            context.restore();
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

var highlightLine = function highlightLine(context, state, opt, highlighted) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    var curve = line().x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    }).context(context);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            context.save();

            var color = n.c;
            var hslColorSpace = hsl(color);
            hslColorSpace.opacity = n.key === highlighted.key ? n.alpha : 0.2;
            context.strokeStyle = hslColorSpace;

            interpolateCurve(opt.plots.curve, [curve]);
            context.beginPath();
            curve(n.values);
            context.lineWidth = opt.plots.strokeWidth;
            context.stroke();
            context.restore();
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

var highlightNode$8 = function highlightNode(context, opt, datum, x, y) {
    context.save();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.highlightNodeColor ? opt.plots.highlightNodeColor : getTransparentColor(datum.c, 0.9);
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.arc(x, y, 6, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.closePath();

    context.restore();
};

var animateStates$10 = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$10(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var DefaultOptions$3 = {
    chart: {
        type: 'line_multi'
    },
    plots: {
        curve: 'linear',
        highlightNodeColor: '#F03E1E',
        strokeWidth: 3,
        showDots: false,
        dotRadius: 4
    }
};

var MultiLine = function (_AbstractStackedCarte) {
    inherits(MultiLine, _AbstractStackedCarte);

    function MultiLine(canvasId, _userOptions) {
        classCallCheck(this, MultiLine);
        return possibleConstructorReturn(this, (MultiLine.__proto__ || Object.getPrototypeOf(MultiLine)).call(this, canvasId, _userOptions));
    }

    createClass(MultiLine, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var initialState = this.previousState ? this.previousState : this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    alpha: 0,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: _this2._options.chart.innerHeight,
                            data: e.data
                        };
                    })
                };
            });

            var finalState = this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: 1,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: e.y,
                            data: e.data
                        };
                    })
                };
            });

            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$10(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                that._voronoi = applyVoronoi(ctx, opt, res.reduce(function (acc, p) {
                    acc = acc.concat(p.values);
                    return acc;
                }, []));

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 100;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);
                    if (closest) {
                        closest.data.data[that._getMetric().accessor] = closest.data.data[closest.data.key];

                        that._tooltip.html(that.tooltip(closest.data.data)).transition().duration(that._options.animation.tooltip).style("left", mx + that._options.tooltip.offset[0] + "px").style("top", my + that._options.tooltip.offset[1] + "px").style("opacity", 1);

                        highlightLine(ctx, res, opt, closest.data);
                        highlightNode$8(ctx, opt, closest.data.c, closest[0], closest[1]);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                        drawCanvas$10(ctx, res, opt);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);

                    drawCanvas$10(ctx, res, opt);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(DefaultOptions$3, _userOpt);
        }
    }]);
    return MultiLine;
}(AbstractStackedCartesianChartWithAxes);

var GroupedOptions = {
    animation: {
        duration: {
            layout: 500
        }
    },
    chart: {
        type: 'bar_grouped'
    },
    plots: {
        stackLayout: false,
        stackMethod: Stacks.Zero,
        opacity: 1,
        barLabel: {
            enabled: true,
            color: 'black'
        },
        metricLabel: {
            enabled: true,
            color: 'black',
            offset: 10
        }
    }
};

var StackedOptions$1 = {
    animation: {
        duration: {
            layout: 500
        }
    },
    chart: {
        type: 'bar_grouped'
    },
    plots: {
        stackLayout: true,
        stackMethod: Stacks.Zero,
        opacity: 1,
        barLabel: {
            enabled: true,
            color: 'black'
        },
        metricLabel: {
            enabled: true,
            color: 'black',
            offset: 10
        }
    }
};

var ExpandedOptions$1 = {
    animation: {
        duration: {
            layout: 500
        }
    },
    chart: {
        type: 'bar_grouped'
    },
    plots: {
        stackLayout: true,
        stackMethod: Stacks.Expand,
        opacity: 1,
        barLabel: {
            enabled: true,
            color: 'black'
        },
        metricLabel: {
            enabled: true,
            color: 'black',
            offset: 10
        }
    }
};

var drawCanvas$12 = function drawCanvas(context, state) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            var color = getTransparentColor(n.c, 1);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = n.values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var b = _step2.value;

                    context.save();
                    context.beginPath();
                    context.fillStyle = color;
                    context.rect(b.x, b.y, b.w, b.h);
                    context.fill();
                    context.restore();
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

var animateStates$12 = function animateStates(initialState, finalState, duration, context, opt) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$12(context, interpolateParticles(t), opt);

            if (t === 1) {
                batchRendering.stop();
                // final state as result
                resolve(interpolateParticles(t));
            }
        });
    });
};

var drawHiddenCanvas$2 = function drawHiddenCanvas(context, state) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    var colorMap = new Map();

    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {

                for (var _iterator2 = n.values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var b = _step2.value;

                    var color = genColorByIndex(i);

                    context.beginPath();
                    context.fillStyle = color;
                    context.rect(b.x, b.y, b.w, b.h);
                    context.fill();
                    i++;

                    colorMap.set(color, b);
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

    return colorMap;
};

var StackedBar = function (_AbstractStackedCarte) {
    inherits(StackedBar, _AbstractStackedCarte);

    function StackedBar(canvasId, _userOptions) {
        classCallCheck(this, StackedBar);

        var _this = possibleConstructorReturn(this, (StackedBar.__proto__ || Object.getPrototypeOf(StackedBar)).call(this, canvasId, _userOptions));

        _this.stackSwitched = false;
        _this.colorMap;
        return _this;
    }

    createClass(StackedBar, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var seriesNum = this._data.nested.length;
            var band = this._options.data.x.scale.bandwidth();
            var barWidth = band / seriesNum;

            var initialGroupLayout = function initialGroupLayout(d, i) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data) + barWidth * i,
                            y: _this2._options.chart.innerHeight,
                            w: barWidth,
                            h: 0,
                            data: e.data
                        };
                    })
                };
            };

            var initialStackLayout = function initialStackLayout(d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: _this2._getMetric().scale(e.y0),
                            w: band,
                            h: 0,
                            data: e.data
                        };
                    })
                };
            };

            var mapGroupLayout = function mapGroupLayout(d, i) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data) + barWidth * i,
                            y: e.y,
                            w: barWidth,
                            h: _this2._options.chart.innerHeight - e.y,
                            data: e.data
                        };
                    })
                };
            };

            var mapStackLayout = function mapStackLayout(d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data),
                            y: _this2._getMetric().scale(e.y0),
                            w: band,
                            h: _this2._getMetric().scale(e.y1) - _this2._getMetric().scale(e.y0),
                            data: e.data
                        };
                    })
                };
            };

            // stacked => x and width => grouped (y and height)
            var stackToGroup = function stackToGroup(d, i) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data) + barWidth * i,
                            y: _this2._getMetric().scale(e.y0),
                            w: barWidth,
                            h: _this2._getMetric().scale(e.y1) - _this2._getMetric().scale(e.y0),
                            data: e.data
                        };
                    })
                };
            };

            // grouped => y and height => stacked (x and width)
            var groupToStack = function groupToStack(d, i) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    alpha: _this2._options.plots.opacity,
                    values: d.values.map(function (e) {
                        return {
                            key: d.key,
                            x: _this2._x(e.data) + barWidth * i,
                            y: _this2._getMetric().scale(e.y0),
                            w: barWidth,
                            h: _this2._getMetric().scale(e.y1) - _this2._getMetric().scale(e.y0),
                            data: e.data
                        };
                    })
                };
            };

            var initialState = this.previousState ? this.previousState : this._options.plots.stackLayout === true ? this._data.nested.map(initialStackLayout) : this._data.nested.map(initialGroupLayout);

            var finalState = this._options.plots.stackLayout === true ? this._data.nested.map(mapStackLayout) : this._data.nested.map(mapGroupLayout);

            if (this.stackSwitched) {
                // reset stack layout dirty checker
                this.stackSwitched = false;

                var intrimState = this._options.plots.stackLayout === false ? this._data.nested.map(groupToStack) : this._data.nested.map(stackToGroup);

                animateStates$12(initialState, intrimState, 500, this._frontContext, this._options).then(function () {
                    _this2.update();
                });

                this.previousState = intrimState;
            } else {
                animateStates$12(initialState, finalState, this._options.animation.duration.update, this._frontContext, this._options).then(function (res) {
                    _this2.colorMap = drawHiddenCanvas$2(_this2._hiddenContext, res);

                    var that = _this2;

                    // shadow color?
                    /**
                     * callback for when the mouse moves across the overlay
                     */
                    function mouseMoveHandler() {
                        // get the current mouse position
                        var _mouse = mouse(this),
                            _mouse2 = slicedToArray(_mouse, 2),
                            mx = _mouse2[0],
                            my = _mouse2[1];
                        // This will return that pixel's color


                        var col = that._hiddenContext.getImageData(mx * that._canvasScale, my * that._canvasScale, 1, 1).data;
                        //Our map uses these rgb strings as keys to nodes.
                        var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                        var closest = that.colorMap.get(colString);

                        if (closest) {
                            closest.data[that._getMetric().accessor] = closest.data[closest.key];

                            that._tooltip.html(that.tooltip(closest.data)).transition().duration(that._options.animation.tooltip).style("left", mx + that._options.tooltip.offset[0] + "px").style("top", my + that._options.tooltip.offset[1] + "px").style("opacity", 1);
                        } else {
                            that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                        }
                    }

                    function mouseOutHandler() {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                    }

                    that._frontCanvas.on('mousemove', mouseMoveHandler);
                    that._frontCanvas.on('mouseout', mouseOutHandler);

                    that._listeners.call('rendered');
                });

                // cache finalState as the initial state of next animation call
                this.previousState = finalState;
            }
        }
    }, {
        key: 'options',
        value: function options(userOpt) {
            if (userOpt && userOpt.plots && userOpt.plots.stackLayout !== this._options.plots.stackLayout) {
                this.stackSwitched = true;
            }

            return get$2(StackedBar.prototype.__proto__ || Object.getPrototypeOf(StackedBar.prototype), 'options', this).call(this, userOpt);
        }
    }, {
        key: '_updateLayout',
        value: function _updateLayout(opt) {
            this.options(opt);
            this.update();
        }
    }, {
        key: 'stackLayout',
        value: function stackLayout() {
            this._updateLayout(StackedOptions$1);
        }
    }, {
        key: 'expandLayout',
        value: function expandLayout() {
            this._updateLayout(ExpandedOptions$1);
        }
    }, {
        key: 'groupedLayout',
        value: function groupedLayout() {
            this._updateLayout(GroupedOptions);
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(GroupedOptions, _userOpt);
        }
    }]);
    return StackedBar;
}(AbstractStackedCartesianChartWithAxes);

var CoronaOptions = {
    chart: {
        type: 'corona',
        margin: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    plots: {
        levels: 0, //How many levels or inner circles should there be drawn
        levelColor: '#CDCDCD',
        levelLabelColor: '#737373',
        levelLabelPosition: 'top', //'top', 'bottom', 'right'
        levelLabel: null,

        axisLabel: null,
        axisLabelColor: '#737373',
        axisLabelOffset: 15, //How much farther than the radius of the outer circle should the labels be placed

        highlightStrokeColor: '#000000',
        highlightNodeColor: '#F03E1E',
        highlightLabelColor: '#000000',

        strokeOpacity: 0,
        strokeWidth: 4, //The width of the stroke around each blob

        areaOpacity: 0.35, //The opacity of the area of the blob,
        gradientArea: true,

        drawBoundary: true,
        boundaryOffset: 10,
        boundaryOpacity: 0.5,
        boundaryGradient: ['white', '#eb3ba6'],

        innerRadiusRatio: 0.4,
        outerRadiusMargin: 10,

        stackLayout: false, // stack areas
        stackMethod: Stacks.Zero,
        isArea: true //If true the area and stroke will follow a round path (cardinal-closed),
    }
};

var getGridLevels = function getGridLevels(opt) {
    var levels = opt.data.y[0].ticksTier + 1;

    if (isNumber$1(opt.plots.levels) && isFinite$1(opt.plots.levels) && parseInt(opt.plots.levels) > 0) {
        levels = parseInt(opt.plots.levels);
    }

    return levels;
};

var getRadius = function getRadius(opt) {
    var outerRadius = Math.min(opt.chart.innerWidth / 2, opt.chart.innerHeight / 2) - opt.plots.outerRadiusMargin;
    var innerRadius = outerRadius * opt.plots.innerRadiusRatio;

    return [innerRadius, outerRadius];
};

var drawGridArc = function drawGridArc(context, opt) {
    var _getRadius = getRadius(opt),
        _getRadius2 = slicedToArray(_getRadius, 2),
        innerRadius = _getRadius2[0],
        outerRadius = _getRadius2[1];

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);
    var levels = getGridLevels(opt);

    var gridArc = arc().innerRadius(function (d) {
        return (outerRadius - innerRadius) / levels * (d - 1) + innerRadius;
    }).outerRadius(function (d) {
        return (outerRadius - innerRadius) / levels * d + innerRadius;
    }).startAngle(0).endAngle(2 * Math.PI).context(context);

    for (var i = 1; i < levels + 1; i++) {
        context.beginPath();
        context.strokeStyle = opt.plots.levelColor;
        gridArc(i);
        context.stroke();
    }

    context.restore();
};

var formatter = format(".1f");

var drawGridLabel = function drawGridLabel(context, state, opt) {
    if (state.length <= 0) {
        return;
    }

    var _getRadius = getRadius(opt),
        _getRadius2 = slicedToArray(_getRadius, 2),
        innerRadius = _getRadius2[0],
        outerRadius = _getRadius2[1];

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var levels = getGridLevels(opt);

    var labelScale = linear$2().domain([0, levels]).range(state[0].range).nice();

    var getLabel = function getLabel(i) {
        var label = labelScale(i) > 0 && labelScale(i) < 1 ? formatter(labelScale(i)) : Math.round(labelScale(i));

        return opt.plots.levelLabel && isFunction(opt.plots.levelLabel) ? opt.plots.levelLabel(label) : label;
    };

    switch (opt.plots.levelLabelPosition) {
        case 'bottom':
            for (var i = 0; i <= levels; i++) {
                context.textAlign = "center";
                context.textBaseline = 'top';
                context.fillStyle = opt.plots.levelLabelColor;
                context.fillText(getLabel(i), 0, i * ((outerRadius - innerRadius) / levels) + innerRadius);
            }

            break;
        case 'right':
        case 'top':
        default:
            for (var _i = 0; _i <= levels; _i++) {
                context.textAlign = "center";
                context.textBaseline = 'ideographic';
                context.fillStyle = opt.plots.levelLabelColor;
                context.fillText(getLabel(_i), 0, -_i * ((outerRadius - innerRadius) / levels) - innerRadius);
            }

            break;
    }

    context.restore();
};

var getAxisLabel = function getAxisLabel(opt, d, i) {
    return opt.plots.axisLabel && isFunction(opt.plots.axisLabel) ? opt.plots.axisLabel(d, i) : d;
};

var drawAxisLabel = function drawAxisLabel(context, opt) {
    var axisNum = 6;
    var axisScale = linear$2().domain([0, axisNum]).range([0, 2 * Math.PI]);

    var _getRadius = getRadius(opt),
        _getRadius2 = slicedToArray(_getRadius, 2),
        innerRadius = _getRadius2[0],
        outerRadius = _getRadius2[1];

    var axes = opt.data.x.values;
    var axesLength = axes.length;

    if (axesLength < axisNum) {
        axisNum = axesLength;
    }

    var mapToAxis = linear$2().domain([0, axisNum]).range([0, axesLength]).nice();

    var toText = function toText(i) {
        return Math.ceil(mapToAxis(i));
    };

    for (var i = 1; i < axisNum; i++) {
        drawCircularText(context, getAxisLabel(opt, axes[toText(i)], toText(i)) + '', 14, 'Oswald', opt.plots.axisLabelColor, opt.chart.width / 2, opt.chart.height / 2, outerRadius + opt.plots.axisLabelOffset, axisScale(i), 5);
    }
};

var drawGradientBoundary = function drawGradientBoundary(context, state, opt) {
    if (opt.plots.drawBoundary === false) {
        return;
    }

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var _getRadius = getRadius(opt),
        _getRadius2 = slicedToArray(_getRadius, 2),
        innerRadius = _getRadius2[0],
        outerRadius = _getRadius2[1];

    var Offset = opt.plots.boundaryOffset;

    var boundary = arc().innerRadius(outerRadius).outerRadius(outerRadius + Offset).startAngle(0).endAngle(2 * Math.PI).context(context);

    context.beginPath();

    var gradient = context.createRadialGradient(0, 0, outerRadius, 0, 0, outerRadius + Offset);

    gradient.addColorStop(0, opt.plots.boundaryGradient[0]);
    gradient.addColorStop(1, opt.plots.boundaryGradient[1]);
    context.fillStyle = gradient;
    context.globalAlpha = opt.plots.boundaryOpacity;
    boundary();
    // context.arc(x, y, outerRadius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
};

var drawArea$2 = function drawArea(context, state, opt) {
    var _getRadius = getRadius(opt),
        _getRadius2 = slicedToArray(_getRadius, 2),
        innerRadius = _getRadius2[0],
        outerRadius = _getRadius2[1];

    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            var shape = opt.plots.stackLayout === true ? radialArea().curve(curveCardinalClosed).angle(function (d) {
                return d.angle;
            }).innerRadius(function (d) {
                return d.r0;
            }).outerRadius(function (d) {
                return d.r1;
            }).context(context) : radialArea().curve(curveCardinalClosed).angle(function (d) {
                return d.angle;
            }).innerRadius(innerRadius).outerRadius(function (d) {
                return d.r;
            }).context(context);

            context.beginPath();

            if (opt.plots.gradientArea === true) {
                context.fillStyle = radialGradient(context, n.c, n.alpha, opt.chart.width / 2, opt.chart.height / 2, innerRadius, outerRadius);
            } else {
                context.fillStyle = getTransparentColor(n.c, n.alpha);
            }
            shape(n.values);
            context.fill();

            context.lineWidth = opt.plots.strokeWidth;
            context.strokeStyle = getTransparentColor(n.c, n.strokeAlpha);
            context.stroke();
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

    context.restore();
};

var drawLine$2 = function drawLine(context, state, opt) {
    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            var shape = opt.plots.stackLayout === true ? radialLine().curve(curveLinearClosed).angle(function (d) {
                return d.angle;
            }).radius(function (d) {
                return d.r1;
            }).context(context) : radialLine().curve(curveLinearClosed).angle(function (d) {
                return d.angle;
            }).radius(function (d) {
                return d.r;
            }).context(context);

            context.beginPath();
            context.strokeStyle = getTransparentColor(n.c, n.strokeAlpha);
            context.lineWidth = opt.plots.strokeWidth;
            shape(n.values);
            context.stroke();
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

    context.restore();
};

var drawCanvas$14 = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    drawGridArc(context, opt);
    drawGridLabel(context, state, opt);
    drawAxisLabel(context, opt);
    // drawMonths(context, opt);
    // drawHistogram(context, state, opt);
    // drawChord(context, state, opt);

    if (opt.plots.isArea === true) {
        drawArea$2(context, state, opt);
    } else {
        drawLine$2(context, state, opt);
    }

    drawGradientBoundary(context, state, opt);
};

var getLevelLabel = function getLevelLabel(opt, label) {
    return opt.plots.levelLabel && isFunction(opt.plots.levelLabel) ? opt.plots.levelLabel(label) : label;
};

var highlight = function highlight(context, opt, datum) {
    context.save();
    context.translate(opt.chart.width / 2, opt.chart.height / 2);

    context.beginPath();
    context.setLineDash([5, 5]);
    context.strokeStyle = opt.plots.highlightStrokeColor;

    context.arc(0, 0, datum.d.r, 0, 2 * Math.PI, false);

    context.stroke();
    context.restore();
    context.closePath();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.highlightNodeColor ? opt.plots.highlightNodeColor : datum.c;
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.arc(datum.x, datum.y, 6, 2 * Math.PI, false);
    context.fill();
    context.stroke();

    context.closePath();

    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = opt.plots.axisLabelColor;
    drawCircularText(context, getAxisLabel(opt, datum.label, 1) + '', 14, 'Oswald', opt.plots.highlightLabelColor, opt.chart.width / 2, opt.chart.height / 2, datum.d.r + 10, datum.d.angle, 5);

    context.restore();

    var lineOffset = 8;
    context.save();
    context.beginPath();
    context.textBaseline = 'alphabetic';
    context.textAlign = 'center'; // Ensure we draw in exact center
    context.fillStyle = opt.plots.highlightLabelColor;
    context.fillText(getLevelLabel(opt, datum.metric), opt.chart.width / 2, opt.chart.height / 2 - lineOffset);
    context.fillText(datum.s, opt.chart.width / 2, opt.chart.height / 2 + lineOffset);
    context.restore();
};

var animateStates$14 = function animateStates(initialState, finalState, duration, context, opt, dataRange) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$14(context, interpolateParticles(t), opt, dataRange);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var Corona = function (_AbstractStackedCarte) {
    inherits(Corona, _AbstractStackedCarte);

    function Corona(canvasId, _userOptions) {
        classCallCheck(this, Corona);
        return possibleConstructorReturn(this, (Corona.__proto__ || Object.getPrototypeOf(Corona)).call(this, canvasId, _userOptions));
    }

    createClass(Corona, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var _getRadius = getRadius(this._options),
                _getRadius2 = slicedToArray(_getRadius, 2),
                innerRadius = _getRadius2[0],
                outerRadius = _getRadius2[1];

            var dataRange = [this._data.minY, this._data.maxY];
            var radiusScale = linear$2().domain(dataRange.map(function (d) {
                return _this2._getMetric().scale(d);
            })).range([innerRadius, outerRadius]);

            var rawRadiusScale = radiusScale.copy().domain(dataRange);

            var initialState = this.previousState ? this.previousState : this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    range: dataRange,
                    alpha: 0,
                    strokeAlpha: _this2._options.plots.strokeOpacity,
                    values: d.values.map(function (e, i) {
                        return {
                            key: d.key,
                            angle: Math.PI * 2 * i / d.values.length,
                            r: innerRadius,
                            r0: innerRadius,
                            r1: innerRadius,
                            data: e.data,
                            d: e
                        };
                    })
                };
            });

            var finalState = this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    range: dataRange,
                    alpha: _this2._options.plots.areaOpacity,
                    strokeAlpha: _this2._options.plots.strokeOpacity,
                    values: d.values.map(function (e, i) {
                        return {
                            key: d.key,
                            angle: Math.PI * 2 * i / d.values.length,
                            r: radiusScale(e.y),
                            r0: rawRadiusScale(e.y0),
                            r1: rawRadiusScale(e.y1),
                            data: e.data,
                            d: e
                        };
                    })
                };
            });
            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$14(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                that._voronoi = applyVoronoi(ctx, opt, res.reduce(function (acc, p) {
                    acc = acc.concat(p.values.map(function (d) {
                        return {
                            s: p.key,
                            label: that._getDimensionVal(d.data),
                            metric: d.data[p.key],
                            x: d.r * Math.sin(d.angle) + opt.chart.width / 2,
                            y: opt.chart.height - (d.r * Math.cos(d.angle) + opt.chart.height / 2),
                            c: p.c,
                            d: d,
                            data: d.data
                        };
                    }));
                    return acc;
                }, []));

                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];

                    var QuadtreeRadius = 30;
                    // use the new diagram.find() function to find the Voronoi site
                    // closest to the mouse, limited by max distance voronoiRadius
                    var closest = that._voronoi.find(mx, my, QuadtreeRadius);
                    if (closest) {
                        var fadeOpacity = 0.1;

                        var optCopy = cloneDeep$1(opt);
                        optCopy.plots.levelColor = getTransparentColor(optCopy.plots.levelColor, fadeOpacity);
                        optCopy.plots.strokeOpacity = 0;

                        drawCanvas$14(ctx, res.map(function (d) {
                            var p = d;
                            p.alpha = d.key === closest.data.s ? 0.4 : fadeOpacity;

                            p.strokeAlpha = d.key === closest.data.s ? 1 : 0;

                            return p;
                        }), optCopy);

                        highlight(ctx, opt, closest.data);
                    } else {
                        drawCanvas$14(ctx, finalState, opt);
                    }
                }

                function mouseOutHandler() {
                    drawCanvas$14(ctx, finalState, opt);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);

                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'stackLayout',
        value: function stackLayout() {
            this._options.plots.stackLayout = true;
            this._options.plots.stackMethod = Stacks.Zero;

            this.update();
        }
    }, {
        key: 'expandLayout',
        value: function expandLayout() {
            this._options.plots.stackLayout = true;
            this._options.plots.stackMethod = Stacks.Expand;

            this.update();
        }
    }, {
        key: 'groupedLayout',
        value: function groupedLayout() {
            this._options.plots.stackLayout = false;

            this.update();
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(CoronaOptions, _userOpt);
        }
    }]);
    return Corona;
}(AbstractStackedCartesianChart);

var RadarOptions = {
    chart: {
        type: 'radar',
        margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    },
    plots: {
        levels: 0, //How many levels or inner circles should there be drawn
        levelColor: '#CDCDCD',
        levelLabelColor: '#737373',
        levelLabelPosition: 'top', //'top', 'bottom', 'right'
        levelLabel: null,

        axisLabel: null,
        axisLabelColor: '#737373',
        axisLabelOffset: 10, //How much farther than the radius of the outer circle should the labels be placed

        highlightStrokeColor: '#000000',
        highlightNodeColor: 'green',
        highlightLabelColor: '#000000',

        strokeOpacity: 1,
        strokeWidth: 4, //The width of the stroke around each blob

        drawBoundary: true,
        boundaryOffset: 10,
        boundaryOpacity: 0.5,
        boundaryGradient: ['white', '#eb3ba6'],

        innerRadiusRatio: 0.4,
        outerRadiusMargin: 60
    }
};

var Radar = function (_Corona) {
    inherits(Radar, _Corona);

    function Radar(canvasId, _userOptions) {
        classCallCheck(this, Radar);
        return possibleConstructorReturn(this, (Radar.__proto__ || Object.getPrototypeOf(Radar)).call(this, canvasId, _userOptions));
    }

    createClass(Radar, [{
        key: 'options',
        value: function options(_userOpt) {
            get$2(Radar.prototype.__proto__ || Object.getPrototypeOf(Radar.prototype), 'options', this).call(this, _userOpt);

            this._options.plots.isArea = false;
            this._options.plots.stackLayout = false;

            return this._options;
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(RadarOptions, _userOpt);
        }
    }]);
    return Radar;
}(Corona);

var drawCanvas$16 = function drawCanvas(context, state, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();

    context.translate(opt.chart.width / 2, opt.chart.height / 2);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = state[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var d = _step.value;

            context.fillStyle = d.c;
            context.globalAlpha = d.alpha;
            context.strokeWidth = 1;
            context.strokeStyle = 'white';

            var gridArc = arc().startAngle(function (d) {
                return d.startAngle;
            }).endAngle(function (d) {
                return d.endAngle;
            }).innerRadius(0).outerRadius(function (d) {
                return d.r;
            }).context(context);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = d.values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var e = _step2.value;

                    gridArc(e);
                    context.fill();
                    context.stroke();
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

    context.restore();
};

var animateStates$16 = function animateStates(initialState, finalState, duration, context, opt) {
    return new Promise(function (resolve, reject) {
        var interpolateParticles = interpolateArray(initialState, finalState);

        var batchRendering = timer(function (elapsed) {
            var t = Math.min(1, cubicInOut(elapsed / duration));

            drawCanvas$16(context, interpolateParticles(t), opt);

            if (t === 1) {
                batchRendering.stop();
                resolve(interpolateParticles(t));
            }
        });
    });
};

var RoseOpt = {
    chart: {
        type: 'rose'
    },

    plots: {
        innerRadiusRatio: 0,
        outerRadiusMargin: 60,
        stackLayout: false, // stack areas
        stackMethod: Stacks.Zero
    }
    /**
     *
     *"Death is a great price to pay for a red rose," cried the Nightingale,
     * "and Life is very dear to all. It is pleasant to sit in the green wood,
     * and to watch the Sun in his chariot of gold, and the Moon in her chariot of pearl.
     * Sweet is the scent of the hawthorn, and sweet are the bluebells that hide in the valley,
     * and the heather that blows on the hill. Yet love is better than Life, and what is the heart
     * of a bird compared to the heart of a man?"
     *
     * @author Oscar Wilde <The Nightingale And The Rose>
     */
};
var Rose = function (_AbstractStackedCarte) {
    inherits(Rose, _AbstractStackedCarte);

    function Rose(canvasId, _userOptions) {
        classCallCheck(this, Rose);
        return possibleConstructorReturn(this, (Rose.__proto__ || Object.getPrototypeOf(Rose)).call(this, canvasId, _userOptions));
    }

    createClass(Rose, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            var _getRadius = getRadius(this._options),
                _getRadius2 = slicedToArray(_getRadius, 2),
                innerRadius = _getRadius2[0],
                outerRadius = _getRadius2[1];

            var dataRange = [this._data.minY, this._data.maxY];
            var radiusScale = linear$2().domain(dataRange.map(function (d) {
                return _this2._getMetric().scale(d);
            })).range([20, outerRadius]);

            var initialState = this.previousState ? this.previousState : this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    alpha: 0,
                    strokeAlpha: _this2._options.plots.strokeOpacity,
                    values: d.values.map(function (e, i) {
                        var angleScale = linear$2().domain([0, d.values.length]).range([0, 2 * Math.PI]);

                        return {
                            key: d.key,
                            startAngle: angleScale(i),
                            endAngle: angleScale(i + 1),
                            r: 0,
                            data: e.data
                        };
                    })
                };
            });

            var finalState = this._data.nested.map(function (d) {
                return {
                    key: d.key,
                    c: _this2._c(d),
                    s: d.key,
                    alpha: _this2._options.plots.areaOpacity,
                    strokeAlpha: _this2._options.plots.strokeOpacity,
                    values: d.values.map(function (e, i) {
                        var angleScale = linear$2().domain([0, d.values.length]).range([0, 2 * Math.PI]);

                        return {
                            key: d.key,
                            startAngle: angleScale(i),
                            endAngle: angleScale(i + 1),
                            r: radiusScale(e.y),
                            data: e.data
                        };
                    })
                };
            });
            // cache finalState as the initial state of next animation call
            this.previousState = finalState;

            var that = this;
            var ctx = that._frontContext;
            var opt = that._options;

            animateStates$16(initialState, finalState, opt.animation.duration.update, ctx, opt).then(function (res) {
                // that._voronoi = applyVoronoi(ctx, opt, finalState.reduce((acc, p)=>{
                //     acc = acc.concat(p.values.map(d=>{
                //         return {
                //             s: p.key,
                //             label: that._getDimensionVal(d.data),
                //             metric: d.data[p.key],
                //             x: d.r * Math.sin(d.angle) + opt.chart.width / 2,
                //             y: opt.chart.height - (d.r * Math.cos(d.angle) + opt.chart.height / 2),
                //             c: p.c,
                //             d: d,
                //             data: d.data
                //         }
                //     }));
                //     return acc;
                // }, []));


            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOpt) {
            return createCartesianStackedOpt(RoseOpt, _userOpt);
        }
    }]);
    return Rose;
}(AbstractStackedCartesianChart);

var noevent = function () {
  event.preventDefault();
  event.stopImmediatePropagation();
};

var nodrag = function (view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
};

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function () {
      selection.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
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

var constant$9 = function (x) {
  return function () {
    return x;
  };
};

var BrushEvent = function (target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
};

function nopropagation$1() {
  event.stopImmediatePropagation();
}

var noevent$1 = function () {
  event.preventDefault();
  event.stopImmediatePropagation();
};

var MODE_DRAG = { name: "drag" };
var MODE_SPACE = { name: "space" };
var MODE_HANDLE = { name: "handle" };
var MODE_CENTER = { name: "center" };

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

var XY = {
  name: "xy",
  handles: ["n", "e", "s", "w", "nw", "ne", "se", "sw"].map(type),
  input: function input(xy) {
    return xy;
  },
  output: function output(xy) {
    return xy;
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
function defaultFilter() {
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





function brushY() {
  return brush$1(Y);
}

function brush$1(dim) {
  var extent = defaultExtent,
      filter = defaultFilter,
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

  brush.move = function (group, selection) {
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
            selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent),
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
            selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent),
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
        selection = local$1(this).selection;

    if (selection) {
      group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]);

      group.selectAll(".handle").style("display", null).attr("x", function (d) {
        return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
      }).attr("y", function (d) {
        return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
      }).attr("width", function (d) {
        return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize;
      }).attr("height", function (d) {
        return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize;
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
        selection = state.selection,
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
      state.selection = selection = [[w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]], [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]];
    } else {
      w0 = selection[0][0];
      n0 = selection[0][1];
      e0 = selection[1][0];
      s0 = selection[1][1];
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

      nodrag(event.view);
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

      if (state.selection) selection = state.selection; // May be set by brush.move!
      if (lockX) w1 = selection[0][0], e1 = selection[1][0];
      if (lockY) n1 = selection[0][1], s1 = selection[1][1];

      if (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) {
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
      if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
      if (empty$1(selection)) state.selection = null, redraw.call(that);
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
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$9([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
  };

  brush.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$9(!!_), brush) : filter;
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

var TextOffset = 5;

var drawHorizontalLabel = function drawHorizontalLabel(context, node, opt) {
    if (node.attr('dimension')) {
        context.save();

        context.translate(node.attr('x'), node.attr('y'));

        context.textBaseline = 'middle';
        context.strokeStyle = 'rgba(255,255,255, 0.7)';
        context.fillStyle = opt.plots.barLabel.color;
        context.lineWidth = 4;

        if (+node.attr('metric') < 0) {
            context.textAlign = "end";

            context.strokeText(node.attr('dimension'), node.attr('width') - TextOffset, node.attr('height') / 2);
            context.fillText(node.attr('dimension'), node.attr('width') - TextOffset, node.attr('height') / 2);
        } else {

            context.textAlign = "bottom";
            context.strokeText(node.attr('dimension'), TextOffset, node.attr('height') / 2);
            context.fillText(node.attr('dimension'), TextOffset, node.attr('height') / 2);
        }

        context.restore();
    }
};

var drawMetricLabel = function drawMetricLabel(context, node, opt) {
    if (node.attr('metric')) {
        context.save();

        context.translate(node.attr('x'), node.attr('y'));

        context.textBaseline = 'middle';
        context.fillStyle = opt.plots.metricLabel.color;
        context.lineWidth = 4;

        if (+node.attr('metric') < 0) {
            context.textAlign = "end";
            context.fillText(node.attr('metric'), -opt.plots.metricLabel.offset, node.attr('height') / 2);
        } else {
            context.textAlign = "start";
            context.fillText(node.attr('metric'), +node.attr('width') + opt.plots.metricLabel.offset, +node.attr('height') / 2);
        }

        context.restore();
    }
};

var drawCanvas$18 = function drawCanvas(context, selection, opt) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    selection.each(function (d) {
        context.save();

        var node = select(this);
        context.beginPath();
        context.fillStyle = node.attr('fill');
        context.globalAlpha = node.attr('opacity');
        context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        context.fill();

        context.restore();

        drawHorizontalLabel(context, node, opt);
        if (opt.plots.metricLabel.enabled === true) drawMetricLabel(context, node, opt);
    });
};

var drawHiddenRects$2 = function drawHiddenRects(context, selection) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    var colorMap = new Map();

    selection.each(function (d, i) {
        context.save();

        var node = select(this);
        var color = genColorByIndex(i + 1);
        context.beginPath();
        context.fillStyle = color;
        context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        context.fill();

        context.restore();

        colorMap.set(color, d);
    });

    return colorMap;
};

var brushResizePath = function brushResizePath(height) {
    return function (d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 2;

        return "M" + .5 * x + "," + y + "A6,6 0 0 " + e + " " + 6.5 * x + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + .5 * x + "," + 2 * y + "Z" + "M" + 2.5 * x + "," + (y + 8) + "V" + (2 * y - 8) + "M" + 4.5 * x + "," + (y + 8) + "V" + (2 * y - 8);
    };
};

var DefaultOpt$1 = {
    chart: { type: 'bar_horizontal' },
    plots: {
        barLabel: {
            enabled: false,
            color: 'black'
        },
        metricLabel: {
            enabled: false,
            color: 'black',
            offset: 10
        },

        miniBarWidth: 50

    }
};

var miniWidth = function miniWidth(opt) {
    return opt.chart.width - opt.plots.miniBarWidth;
};

var BottomAxisOffset = 10;
var InitialBrushHeight = 200;

var HorizontalBar = function (_AbstractBasicCartesi) {
    inherits(HorizontalBar, _AbstractBasicCartesi);

    function HorizontalBar(canvasId, userOpt) {
        classCallCheck(this, HorizontalBar);
        return possibleConstructorReturn(this, (HorizontalBar.__proto__ || Object.getPrototypeOf(HorizontalBar)).call(this, canvasId, userOpt));
    }

    createClass(HorizontalBar, [{
        key: '_animate',
        value: function _animate() {
            var _this2 = this;

            this._getDimension().scale.range([0, this._options.chart.innerHeight]);
            this.drawMiniSvg(this._data);
            this.drawMainBars(this._data.filter(function (d) {
                return _this2._x(d) < InitialBrushHeight;
            }));
        }
    }, {
        key: 'drawMiniSvg',
        value: function drawMiniSvg(data) {
            var _this3 = this;

            var width = this._options.plots.miniBarWidth;
            var height = this._options.chart.innerHeight;

            var miniX = miniWidth(this._options);

            this.miniSvg = this._container.append('g').attr('width', width).attr('height', height).attr("transform", "translate(" + miniX + "," + this._options.chart.margin.top + ")");

            var miniXScale = this._getDimension().scale.copy();
            var miniYScale = linear$2().domain(extent(data, this._getMetricVal)).range([0, this._options.plots.miniBarWidth]);

            var h = miniXScale.bandwidth();
            var y = function y(d) {
                return miniYScale(_this3._getMetricVal(d));
            };
            var x = this._x;

            var dataUpdate = this.miniSvg.selectAll('.mini').data(data);
            var dataJoin = dataUpdate.enter();
            var dataRemove = dataUpdate.exit();

            dataRemove.remove();
            dataUpdate.attr('width', y).attr("y", x).attr("height", h);
            dataJoin.append("rect").attr('class', 'mini').attr('fill', '#e0e0e0').attr('opacity', 1).attr("x", 0).attr("y", x).attr("height", h).attr('width', y);

            this.brushGroup = this.miniSvg.append('g').attr('class', 'brush');

            var brush = brushY().extent([[0, 0], [miniX, this._options.chart.innerHeight]]);

            var handleOffset = -this._options.plots.miniBarWidth - this._options.plots.miniBarWidth / 4;

            var handle = this.brushGroup.selectAll(".custom-handle").data([{ type: "w" }, { type: "e" }]).enter().append("path").attr("class", "custom-handle").attr("stroke", "#000").attr("stroke-width", 1).attr("cursor", "ns-resize").attr("d", brushResizePath(this._options.plots.miniBarWidth)).attr('transform', 'rotate(90) translate(0,' + handleOffset + ')');

            var brushMove = function brushMove() {
                var s = event.selection;

                if (s === null) {
                    handle.attr("display", "none");
                } else {
                    handle.attr("display", null).attr("transform", function (d, i) {
                        return "rotate(90) translate(" + [s[i], handleOffset] + ")";
                    });
                }

                _this3.miniSvg.selectAll('.mini').attr('fill', function (d) {
                    var metric = _this3._getMetricVal(d);

                    if (s[0] <= (d = x(d)) && d <= s[1]) {
                        return metric > 0 ? '#addd8e' : '#fdbb84';
                    } else {
                        return '#e0e0e0';
                    }
                }).classed('selected', function (d) {
                    return s[0] <= (d = x(d)) && d <= s[1];
                });

                var data = _this3.miniSvg.selectAll('.selected').data();
                _this3.drawMainBars(data);
                _this3.updateAxis(data);
            };

            brush.on("start brush end", brushMove);

            this.brushGroup.call(brush);
            this.brushGroup.call(brush.move, [0, InitialBrushHeight]);
        }
    }, {
        key: '_makeMetricScale',
        value: function _makeMetricScale(data) {
            var yExtent = extent(data, this._getMetricVal);

            var tickedRange = void 0;
            if (yExtent[1] <= 0 || yExtent[0] >= 0) {
                // only negative or only positive
                tickedRange = tickRange(yExtent, this._options.yAxis[0].ticks, this._options.yAxis[0].tier);
            } else {
                // both positive and negative
                var boundary = Math.max(Math.abs(yExtent[0]), yExtent[1]);
                tickedRange = tickRange([-boundary, boundary], this._options.yAxis[0].ticks, this._options.yAxis[0].tier);
            }

            var mainWidth = this._options.chart.innerWidth - this._options.plots.miniBarWidth;

            return linear$2().domain([tickedRange[0], tickedRange[1]]).range([0, mainWidth]);
        }
    }, {
        key: 'updateAxis',
        value: function updateAxis(data) {
            var bottomAxis = axisBottom().scale(this._makeMetricScale(data));

            if (!this.bottomAxis) {
                this.bottomAxis = this._container.append("g").attr("class", "x axis").attr("transform", "translate(" + this._options.chart.margin.left + "," + (this._options.chart.innerHeight + BottomAxisOffset) + ")");
            }

            this.bottomAxis.call(bottomAxis);
            this.bottomAxis.select('.domain').style('opacity', 0);

            this._container.select(".x.axis").transition().duration(50).call(bottomAxis);
        }
    }, {
        key: 'drawMainBars',
        value: function drawMainBars(data) {
            var _this4 = this;

            var drawCanvasInTransition = function drawCanvasInTransition() {
                return function (t) {
                    drawCanvas$18(_this4._frontContext, _this4._detachedContainer.selectAll('.bar'), _this4._options);
                };
            };

            var xScale = band().domain(data.map(function (d) {
                return _this4._getDimensionVal(d);
            })).range([0, this._options.chart.innerHeight - BottomAxisOffset - 5]).paddingInner(.1);

            var yScale = this._makeMetricScale(data);
            var mainWidth = this._options.chart.innerWidth - this._options.plots.miniBarWidth;

            var h = xScale.bandwidth();
            var x = function x(d) {
                return xScale(_this4._getDimensionVal(d));
            };
            var w = void 0;
            var y = void 0;
            var colorScale = this._color.copy().domain(yScale.domain());

            var yExtent = extent(data, this._getMetricVal);

            if (yExtent[0] >= 0) {
                w = function w(d) {
                    return yScale(_this4._getMetricVal(d));
                };
                y = function y(d) {
                    return yScale(0);
                };

                if (this._options.color.type === 'divergent') {
                    colorScale.domain([-yScale.domain()[1], Math.abs(yScale.domain()[1])]);
                }
            } else if (yExtent[1] <= 0) {
                w = function w(d) {
                    return mainWidth - yScale(_this4._getMetricVal(d));
                };
                y = function y(d) {
                    return yScale(_this4._getMetricVal(d));
                };

                if (this._options.color.type === 'divergent') {
                    colorScale.domain([yScale.domain()[0], Math.abs(yScale.domain()[0])]);
                }
            } else {
                w = function w(d) {
                    return Math.abs(mainWidth / 2 - yScale(_this4._getMetricVal(d)));
                };
                y = function y(d) {
                    return _this4._getMetricVal(d) > 0 ? mainWidth / 2 : mainWidth / 2 - w(d);
                };
            }

            var c = function c(d) {
                return colorScale(_this4._getMetricVal(d));
            };

            var dataUpdate = this._detachedContainer.selectAll('.bar').data(data);
            var dataJoin = dataUpdate.enter();
            var dataRemove = dataUpdate.exit();

            var exitTransition = transition().duration(this._options.animation.duration.remove).each(function () {
                dataRemove.transition().attr("width", 0).tween("remove.rects", drawCanvasInTransition);

                dataRemove.remove();
            });

            var updateTransition = exitTransition.transition().duration(this._options.animation.duration.update).each(function () {
                dataUpdate.attr('dimension', _this4._getDimensionVal).attr('metric', _this4._getMetricVal).transition("update-rect-transition").delay(function (d, i) {
                    return i / _this4._data.length * _this4._options.animation.duration.update;
                }).attr('fill', c).attr('x', y).attr('width', w).attr("y", x).attr("height", h).tween("update.rects", drawCanvasInTransition);
            });

            var enterTransition = updateTransition.transition().duration(this._options.animation.duration.update).each(function () {
                dataJoin.append("rect").attr('class', 'bar').attr('fill', c).attr('opacity', 1).attr("x", y).attr("y", x).attr('width', 0).attr('dimension', _this4._getDimensionVal).attr('metric', _this4._getMetricVal).attr("height", h).transition().delay(function (d, i) {
                    return i / _this4._data.length * _this4._options.animation.duration.update;
                }).attr('width', w).tween("append.rects", drawCanvasInTransition);
            });

            var that = this;
            enterTransition.on('end', function () {
                var colorMap = drawHiddenRects$2(_this4._hiddenContext, _this4._detachedContainer.selectAll('.bar'));

                // shadow color?
                /**
                 * callback for when the mouse moves across the overlay
                 */
                function mouseMoveHandler() {
                    // get the current mouse position
                    var _mouse = mouse(this),
                        _mouse2 = slicedToArray(_mouse, 2),
                        mx = _mouse2[0],
                        my = _mouse2[1];
                    // This will return that pixel's color


                    var col = that._hiddenContext.getImageData(mx * that._canvasScale, my * that._canvasScale, 1, 1).data;
                    //Our map uses these rgb strings as keys to nodes.
                    var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                    var node = colorMap.get(colString);

                    if (node) {
                        that._tooltip.html(that.tooltip(node)).transition().duration(that._options.animation.tooltip).style("left", mx + that._options.tooltip.offset[0] + "px").style("top", my + that._options.tooltip.offset[1] + "px").style("opacity", 1);
                    } else {
                        that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                    }
                }

                function mouseOutHandler() {
                    that._tooltip.transition().duration(that._options.animation.tooltip).style("opacity", 0);
                }

                that._frontCanvas.on('mousemove', mouseMoveHandler);
                that._frontCanvas.on('mouseout', mouseOutHandler);
                that._listeners.call('rendered');
            });
        }
    }, {
        key: 'createOptions',
        value: function createOptions(_userOptions) {
            return createCartesianOpt(DefaultOpt$1, _userOptions);
        }
    }]);
    return HorizontalBar;
}(AbstractBasicCartesianChart);

exports.version = version;
exports.Bar = Bar;
exports.Pie = Pie;
exports.Area = Area;
exports.Line = Line;
exports.Scatter = Scatter;
exports.StackedArea = StackedArea;
exports.Stream = Stream;
exports.MultiLine = MultiLine;
exports.StackedBar = StackedBar;
exports.Corona = Corona;
exports.Radar = Radar;
exports.Rose = Rose;
exports.HorizontalBar = HorizontalBar;
exports.Stacks = Stacks;
exports.processCartesianData = processCartesianData;
exports.processStackedData = processStackedData;
exports.AbstractBasicCartesianChart = AbstractBasicCartesianChart;
exports.AbstractBasicCartesianChartWithAxes = AbstractBasicCartesianChartWithAxes;
exports.AbstractCartesianChart = AbstractCartesianChart;
exports.AbstractStackedCartesianChart = AbstractStackedCartesianChart;
exports.AbstractStackedCartesianChartWithAxes = AbstractStackedCartesianChartWithAxes;
exports.createCartesianOpt = createCartesianOpt;
exports.createCartesianStackedOpt = createCartesianStackedOpt;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vizart-basic.standalone.js.map
