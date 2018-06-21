(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.picassoQ = factory());
}(this, (function () { 'use strict';

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

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * Resolves the value at the given JSON path
   * @private
   * @param  {String} path [description]
   * @param  {Object} obj  [description]
   * @return {Object}      [description]
   *
   * @example
   * let path = "/path/to/paradise";
   * let obj = {
   *   path: {
   *     to: { paradise: "heaven"},
   *     from: {...}
   *   }
   * };
   * resolve( path, obj ); // "heaven"
   */
  function resolve(path, obj) {
    if (path.charAt(0) === '/') {
      path = path.substring(1);
    }
    var arr = path.split('/');
    var subpath = void 0;
    var container = obj;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '*' && Array.isArray(container)) {
        var carr = [];
        subpath = arr.slice(i + 1).join('/');
        for (var c = 0; c < container.length; c++) {
          var v = resolve(subpath, container[c]);
          // v.forEach(_ => _._parent = container[c]);
          if (Array.isArray(v)) {
            carr.push.apply(carr, toConsumableArray(v));
          } else {
            carr.push(v);
          }
        }
        return carr;
        // return container.map(v => resolve(arr.slice(i + 1).join('/'), v));
      } else if (!arr[i] && Array.isArray(container)) {
        var _carr = new Array(container.length);
        subpath = arr.slice(i + 1).join('/');
        for (var _c = 0; _c < container.length; _c++) {
          _carr[_c] = resolve(subpath, container[_c]);
        }
        return _carr;
        // return container.map(v => resolve(arr.slice(i + 1).join('/'), v));
      } else if (arr[i] in container) {
        container = container[arr[i]];
      }
    }

    return container;
  }

  function getKPath(fieldIdx, cube) {
    var idx = fieldIdx;
    var numDimz = cube.qDimensionInfo.length;
    var numMeas = cube.qMeasureInfo.length;
    var order = cube.qEffectiveInterColumnSortOrder;
    if (idx < numDimz && order) {
      idx = order.indexOf(idx);
    } else if (idx >= numDimz && order && numMeas > 1 && order.indexOf(-1) !== -1) {
      idx = order.indexOf(-1);
    }
    var s = '/qData/*/qSubNodes';
    var depth = Math.max(0, Math.min(idx, numDimz));
    var i = 0;
    for (; i < depth; i++) {
      // traverse down to specified depth
      s += '/*/qSubNodes';
    }
    if (fieldIdx >= numDimz) {
      // if the depth is a pseudo level, pick the given pseudo dimension, and then traverse down to leaf level (value nodes)
      if (numMeas > 1) {
        s += '/' + (fieldIdx - numDimz) + '/qSubNodes'; // pick pseudo dimension (measure)
        ++i;
        // traverse to value nodes
        for (; i <= numDimz; i++) {
          s += '/*/qSubNodes';
        }
      } else {
        s += '/' + (fieldIdx - numDimz);
      }
    }
    return s;
  }

  function getAttrPath(s, attrIdx, attrDimIdx) {
    if (typeof attrIdx === 'number') {
      return s + '/*/qAttrExps/qValues/' + attrIdx;
    }
    if (typeof attrDimIdx === 'number') {
      return s + '/*/qAttrDims/qValues/' + attrDimIdx;
    }
    return s;
  }

  function getPathToFieldItems(field, _ref) {
    var cache = _ref.cache,
        cube = _ref.cube;

    if (!field) {
      return '';
    }
    var fieldIdx = cache.fields.indexOf(field);
    var attrIdx = void 0;
    var attrDimIdx = void 0;
    if (fieldIdx === -1) {
      for (var i = 0; i < cache.attributeDimensionFields.length; i++) {
        attrDimIdx = cache.attributeDimensionFields[i] ? cache.attributeDimensionFields[i].indexOf(field) : -1;
        if (attrDimIdx !== -1) {
          fieldIdx = i;
          break;
        }
      }
    }
    if (fieldIdx === -1) {
      for (var _i = 0; _i < cache.attributeExpressionFields.length; _i++) {
        attrIdx = cache.attributeExpressionFields[_i] ? cache.attributeExpressionFields[_i].indexOf(field) : -1;
        if (attrIdx !== -1) {
          fieldIdx = _i;
          break;
        }
      }
    }
    return getAttrPath(getKPath(fieldIdx, cube), attrIdx >= 0 ? attrIdx : undefined, attrDimIdx >= 0 ? attrDimIdx : undefined);
  }

  function getTreePath(field, _ref2) {
    var cache = _ref2.cache,
        cube = _ref2.cube;

    var s1 = getPathToFieldItems(field, { cache: cache, cube: cube });
    var s2 = s1.replace(/qSubNodes/g, 'children');
    var s3 = s2.replace(/children$/g, 'children/*');
    return s3.replace(/qData\/\*/, '');
  }

  function augment(config, dataset, cache, deps) {
    var rootPath = '/qStackedDataPages/*/qData';
    var cube = dataset.raw();

    var root = resolve(rootPath, cube);
    if (!root || !root[0]) {
      return null;
    }

    var h = hierarchy(root[0], config.children || function (node) {
      return node.qSubNodes;
    });

    var height = h.height;
    var propDefs = [];

    var _loop = function _loop(i) {
      var _deps$normalizeConfig = deps.normalizeConfig(config, dataset),
          props = _deps$normalizeConfig.props,
          main = _deps$normalizeConfig.main;

      var propsArr = Object.keys(props);
      propDefs[i] = { propsArr: propsArr, props: props, main: main };
      var currentField = null;
      var isRoot = i === 0;
      if (i > 0) {
        var idx = cube.qEffectiveInterColumnSortOrder[i - 1];
        // if (idx === -1) { // pseudo
        //   let childIdx = node.parent.children.indexOf(node);
        //   idx = cube.qDimensionInfo.length + childIdx; // measure field
        // }
        if (i > cube.qEffectiveInterColumnSortOrder.length) {
          idx = cube.qDimensionInfo.length;
        }

        currentField = cache.fields[idx];
      }
      var currentItemsPath = currentField ? getTreePath(currentField, { cube: cube, cache: cache }) : rootPath;

      propsArr.forEach(function (prop) {
        var pCfg = props[prop];
        var arr = pCfg.fields ? pCfg.fields : [pCfg];
        arr.forEach(function (p) {
          if (p.field) {
            var fieldPath = getTreePath(p.field, { cube: cube, cache: cache });
            if (fieldPath === currentItemsPath) {
              p.isSame = true;
            } else if (isRoot) {
              p.isDescendant = true;
              p.path = fieldPath + '/data';
            } else {
              var isDescendant = fieldPath.match(/\//g).length > currentItemsPath.match(/\//g).length;
              var pathToNode = '';
              if (isDescendant) {
                pathToNode = fieldPath.replace(currentItemsPath, '').replace(/^\/\*/, '') + '/data';
              } else {
                pathToNode = Math.ceil((currentItemsPath.match(/\//g).length - fieldPath.match(/\//g).length) / 2);
              }
              p.isDescendant = isDescendant;
              p.path = pathToNode;
            }
          }
        });
      });
    };

    for (var i = 0; i <= height; i++) {
      _loop(i);
    }

    var originalData = [];
    var expando = 0;
    h.each(function (node) {
      var currentOriginal = originalData[expando++] = node.data;
      var propsArr = propDefs[node.depth].propsArr;
      var props = propDefs[node.depth].props;
      var main = propDefs[node.depth].main;

      node.data = {
        value: typeof main.value === 'function' ? main.value(currentOriginal) : currentOriginal
      };
      propsArr.forEach(function (prop) {
        var pCfg = props[prop];
        var arr = pCfg.fields ? pCfg.fields : [pCfg];
        var coll = void 0;
        if (pCfg.fields) {
          coll = [];
        }
        arr.forEach(function (p) {
          var fn = function fn(v) {
            return v;
          };
          var value = void 0;
          if (p.type === 'primitive') {
            value = p.value;
          } else {
            if (typeof p.value === 'function') {
              fn = function fn(v, n) {
                return p.value(v, n);
              };
            }
            if (!p.field) {
              value = currentOriginal;
            } else if (p.isSame) {
              value = currentOriginal;
            } else if (p.isDescendant) {
              value = resolve(p.path, node);
              if (Array.isArray(value)) {
                value = value.map(fn);
                fn = p.reduce || function (v) {
                  return v.join(', ');
                };
              }
            } else if (p.path) {
              // ancestor
              var num = p.path || 0;
              var it = node;
              for (var i = 0; i < num; i++) {
                it = it.parent;
              }
              value = it.data.value;
            }
          }
          if (pCfg.fields) {
            coll.push(fn(value, node));
          } else {
            node.data[prop] = {
              value: fn(value, node)
            };
            if (p.source) {
              node.data[prop].source = { field: p.source };
            }
          }
        });

        // reduce row if multiple fields
        if (coll) {
          node.data[prop] = {
            value: typeof pCfg.value === 'function' ? pCfg.value(coll, node) : coll
          };
        }
      });
    });

    return h;
  }

  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;

  var isArray = function isArray(arr) {
  	if (typeof Array.isArray === 'function') {
  		return Array.isArray(arr);
  	}

  	return toStr.call(arr) === '[object Array]';
  };

  var isPlainObject = function isPlainObject(obj) {
  	if (!obj || toStr.call(obj) !== '[object Object]') {
  		return false;
  	}

  	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  	// Not own constructor property must be Object
  	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
  		return false;
  	}

  	// Own properties are enumerated firstly, so to speed up,
  	// if last one is own, then all properties are own.
  	var key;
  	for (key in obj) {/**/}

  	return typeof key === 'undefined' || hasOwn.call(obj, key);
  };

  var extend = function extend() {
  	var options, name, src, copy, copyIsArray, clone;
  	var target = arguments[0];
  	var i = 1;
  	var length = arguments.length;
  	var deep = false;

  	// Handle a deep copy situation
  	if (typeof target === 'boolean') {
  		deep = target;
  		target = arguments[1] || {};
  		// skip the boolean and the target
  		i = 2;
  	}
  	if (target == null || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && typeof target !== 'function') {
  		target = {};
  	}

  	for (; i < length; ++i) {
  		options = arguments[i];
  		// Only deal with non-null/undefined values
  		if (options != null) {
  			// Extend the base object
  			for (name in options) {
  				src = target[name];
  				copy = options[name];

  				// Prevent never-ending loop
  				if (target !== copy) {
  					// Recurse if we're merging plain objects or arrays
  					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
  						if (copyIsArray) {
  							copyIsArray = false;
  							clone = src && isArray(src) ? src : [];
  						} else {
  							clone = src && isPlainObject(src) ? src : {};
  						}

  						// Never move original objects, clone them
  						target[name] = extend(deep, clone, copy);

  						// Don't bring in undefined values
  					} else if (typeof copy !== 'undefined') {
  						target[name] = copy;
  					}
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  };

  function getFieldAccessor(field, page, deps) {
    if (!field) {
      return -1;
    }
    var cache = deps.cache;
    var fieldIdx = cache.fields.indexOf(field);
    var attrIdx = -1;
    var attrDimIdx = -1;
    if (fieldIdx === -1) {
      for (var i = 0; i < cache.wrappedFields.length; i++) {
        attrDimIdx = cache.wrappedFields[i].attrDims.map(function (v) {
          return v.instance;
        }).indexOf(field);
        attrIdx = cache.wrappedFields[i].attrExps.map(function (v) {
          return v.instance;
        }).indexOf(field);
        if (attrDimIdx !== -1 || attrIdx !== -1) {
          fieldIdx = i;
          break;
        }
      }
    }

    fieldIdx -= page.qArea.qLeft;
    if (fieldIdx < 0 || fieldIdx >= page.qArea.qWidth) {
      // throw new Error('Field out of range');
      return -1;
    }

    var path = 'row[' + fieldIdx + ']';

    if (attrDimIdx >= 0) {
      return Function('row', 'return ' + path + '.qAttrDims.qValues[' + attrDimIdx + '];'); // eslint-disable-line no-new-func
    } else if (attrIdx >= 0) {
      return Function('row', 'return ' + path + '.qAttrExps.qValues[' + attrIdx + '];'); // eslint-disable-line no-new-func
    }

    return Function('row', 'return ' + path + ';'); // eslint-disable-line no-new-func
  }

  // TODO - handle 'other' value
  // const specialTextValues = {
  //   '-3': (meta) => {
  //     if ('othersLabel' in meta) {
  //       return meta.othersLabel;
  //     }
  //     return '';
  //   }
  // };

  function datumExtract(propCfg, cell, _ref) {
    var key = _ref.key;

    var datum = {
      value: typeof propCfg.value === 'function' ? propCfg.value(cell) : typeof propCfg.value !== 'undefined' ? propCfg.value : cell // eslint-disable-line no-nested-ternary
    };

    datum.label = typeof propCfg.label === 'function' ? propCfg.label(cell) : typeof propCfg.label !== 'undefined' ? String(propCfg.label) : String(datum.value); // eslint-disable-line no-nested-ternary

    if (propCfg.field) {
      datum.source = {
        key: key,
        field: propCfg.field.key()
      };
    }

    return datum;
  }

  function cellToValue(_ref2) {
    var cache = _ref2.cache,
        f = _ref2.f,
        mainCell = _ref2.mainCell,
        p = _ref2.p,
        prop = _ref2.prop,
        page = _ref2.page,
        rowIdx = _ref2.rowIdx,
        row = _ref2.row,
        sourceKey = _ref2.sourceKey,
        target = _ref2.target,
        targetProp = _ref2.targetProp;

    var propCell = mainCell;
    if (p.field && p.field !== f) {
      var propCellFn = getFieldAccessor(p.field, page, { cache: cache });
      if (propCellFn === -1) {
        return;
      }
      propCell = extend({ qRow: rowIdx }, propCellFn(row));
    }
    target[targetProp] = datumExtract(p, propCell, { key: sourceKey }, prop);
  }

  function extract(config, dataset, cache, util) {
    var cfgs = Array.isArray(config) ? config : [config];
    var dataItems = [];
    cfgs.forEach(function (cfg) {
      if (typeof cfg.field !== 'undefined') {
        var cube = dataset.raw();
        var sourceKey = dataset.key();
        var f = _typeof(cfg.field) === 'object' ? cfg.field : dataset.field(cfg.field);

        var _util$normalizeConfig = util.normalizeConfig(cfg, dataset),
            props = _util$normalizeConfig.props,
            main = _util$normalizeConfig.main;

        var propsArr = Object.keys(props);

        var track = !!cfg.trackBy;
        var trackType = _typeof(cfg.trackBy);
        var tracker = {};
        var trackedItems = [];
        var items = [];

        cube.qDataPages.forEach(function (page) {
          var fn = getFieldAccessor(f, page, { cache: cache });
          if (fn === -1) {
            return;
          }
          page.qMatrix.forEach(function (row, i) {
            var rowIdx = page.qArea.qTop + i;
            var mainCell = extend({ qRow: rowIdx }, fn(row));
            var ret = datumExtract(main, mainCell, { key: sourceKey });
            var exclude = main.filter && !main.filter(mainCell);
            if (exclude) {
              return;
            }

            // loop through all props that need to be mapped and
            // assign 'value' and 'source' to each property
            propsArr.forEach(function (prop) {
              var p = props[prop];
              var arr = p.fields || [p];

              if (p.fields) {
                ret[prop] = [];
              }
              arr.forEach(function (pp, fidx) {
                cellToValue({
                  cache: cache,
                  f: f,
                  mainCell: mainCell,
                  p: pp,
                  prop: prop,
                  props: props,
                  page: page,
                  rowIdx: rowIdx,
                  row: row,
                  sourceKey: sourceKey,
                  target: p.fields ? ret[prop] : ret,
                  targetProp: p.fields ? fidx : prop
                });
              });
              // if (!track && p.fields) {
              //   const fieldValues = ret[prop].map(v => v.value);
              //   ret[prop] = {
              //     value: typeof p.reduce === 'function' ? p.reduce(fieldValues) : fieldValues
              //   };
              // }
              if (p.fields) {
                var fieldValues = ret[prop].map(function (v) {
                  return v.value;
                });
                var fieldLabels = ret[prop].map(function (v) {
                  return v.label;
                });
                ret[prop] = {
                  value: typeof p.value === 'function' ? p.value(fieldValues) : typeof p.value !== 'undefined' ? p.value : fieldValues // eslint-disable-line no-nested-ternary
                };
                ret[prop].label = typeof p.label === 'function' ? p.label(fieldLabels) : typeof p.label !== 'undefined' ? String(p.label) : String(ret[prop].value); // eslint-disable-line no-nested-ternary
              }
            });

            // collect items based on the trackBy value
            // items with the same trackBy value are placed in an array and reduced later
            if (track) {
              util.track({
                cfg: cfg,
                itemData: mainCell,
                obj: ret,
                target: trackedItems,
                tracker: tracker,
                trackType: trackType
              });
            }

            items.push(ret);
          });
        });

        // reduce if items have been grouped
        if (track) {
          dataItems.push.apply(dataItems, toConsumableArray(util.collect(trackedItems, {
            main: main,
            propsArr: propsArr,
            props: props
          })));
        } else {
          dataItems.push.apply(dataItems, items);
        }
      }
    });
    return dataItems;
  }

  function flattenTree(children, steps, arrIndexAtTargetDepth) {
    var arr = [];
    if (!children || !children.length) {
      return arr;
    }
    if (steps <= 0) {
      var nodes = arrIndexAtTargetDepth >= 0 ? [children[arrIndexAtTargetDepth]] : children;
      arr.push.apply(arr, toConsumableArray(nodes));
    } else {
      for (var i = 0; i < children.length; i++) {
        if (children[i].children && children[i].children.length) {
          arr.push.apply(arr, toConsumableArray(flattenTree(children[i].children, steps - 1, arrIndexAtTargetDepth)));
        }
      }
    }
    return arr;
  }

  function treeAccessor(sourceDepth, targetDepth, arrIndexAtTargetDepth) {
    if (sourceDepth === targetDepth) {
      return function (d) {
        return d;
      };
    }
    if (sourceDepth > targetDepth) {
      // traverse upwards
      var steps = Math.max(0, Math.min(100, sourceDepth - targetDepth));
      var path = [].concat(toConsumableArray(Array(steps))).map(String.prototype.valueOf, 'parent').join('.');
      return Function('node', 'return node.' + path + ';'); // eslint-disable-line no-new-func
    }
    if (targetDepth > sourceDepth) {
      // flatten descendants
      var _steps = Math.max(0, Math.min(100, targetDepth - sourceDepth));
      return function (node) {
        return flattenTree(node.children, _steps - 1, arrIndexAtTargetDepth);
      };
    }
    return false;
  }

  function findField(query, _ref) {
    var cache = _ref.cache;

    if (typeof query === 'number') {
      return cache.fields[query];
    }

    var allFields = cache.allFields;
    if (typeof query === 'function') {
      for (var i = 0; i < allFields.length; i++) {
        if (query(allFields[i])) {
          return allFields[i];
        }
      }
      return false;
    } else if (typeof query === 'string') {
      for (var _i = 0; _i < allFields.length; _i++) {
        if (allFields[_i].key() === query || allFields[_i].title() === query) {
          return allFields[_i];
        }
      }
    } else if (query && allFields.indexOf(query) !== -1) {
      // assume 'query' is a field instance
      return query;
    }

    throw Error('Field not found: ' + query);
  }

  var DIM_RX = /^qDimensionInfo(?:\/(\d+))?/;
  var M_RX = /^\/?qMeasureInfo\/(\d+)/;
  var ATTR_EXPR_RX = /\/qAttrExprInfo\/(\d+)/;
  var ATTR_DIM_RX = /\/qAttrDimInfo\/(\d+)/;

  function getFieldDepth(field, _ref) {
    var cube = _ref.cube;

    if (!field) {
      return -1;
    }
    var key = field.key();
    var isFieldDimension = false;
    var fieldIdx = -1; // cache.fields.indexOf(field);
    var attrIdx = -1;
    var attrDimIdx = -1;
    var fieldDepth = -1;
    var pseudoMeasureIndex = -1;
    var measureIdx = -1;
    var remainder = key;

    var treeOrder = cube.qEffectiveInterColumnSortOrder;

    if (DIM_RX.test(remainder)) {
      isFieldDimension = true;
      fieldIdx = +DIM_RX.exec(remainder)[1];
      remainder = key.replace(DIM_RX, '');
    }

    if (M_RX.test(remainder)) {
      if (cube.qMode === 'K') {
        pseudoMeasureIndex = +M_RX.exec(remainder)[1];
      } else if (treeOrder && treeOrder.indexOf(-1) !== -1) {
        pseudoMeasureIndex = +M_RX.exec(remainder)[1];
        measureIdx = 0;
      } else {
        measureIdx = +M_RX.exec(remainder)[1];
      }
      remainder = remainder.replace(M_RX, '');
    }

    if (remainder) {
      if (ATTR_DIM_RX.exec(remainder)) {
        attrDimIdx = +ATTR_DIM_RX.exec(remainder)[1];
      } else if (ATTR_EXPR_RX.exec(remainder)) {
        attrIdx = +ATTR_EXPR_RX.exec(remainder)[1];
      }
    }

    if (isFieldDimension) {
      fieldDepth = treeOrder ? treeOrder.indexOf(fieldIdx) : fieldIdx;
    } else if (treeOrder && treeOrder.indexOf(-1) !== -1) {
      // if pseudo dimension exists in sort order
      fieldDepth = treeOrder.indexOf(-1); // depth of pesudodimension
    } else {
      // assume measure is at the bottom of the tree
      fieldDepth = cube.qDimensionInfo.length - (cube.qMode === 'K' ? 0 : 1);
    }

    return {
      fieldDepth: fieldDepth + 1, // +1 due to root node
      pseudoMeasureIndex: pseudoMeasureIndex,
      measureIdx: measureIdx,
      attrDimIdx: attrDimIdx,
      attrIdx: attrIdx
    };
  }

  function getFieldAccessor$1(sourceDepthObject, targetDepthObject) {
    var nodeFn = treeAccessor(sourceDepthObject.fieldDepth, targetDepthObject.fieldDepth, targetDepthObject.pseudoMeasureIndex);
    var valueFn = void 0;

    if (targetDepthObject.measureIdx >= 0) {
      valueFn = function valueFn(node) {
        return node.data.qValues[targetDepthObject.measureIdx];
      };
    } else {
      valueFn = function valueFn(node) {
        return node.data;
      };
    }
    var attrFn = void 0;

    if (targetDepthObject.attrDimIdx >= 0) {
      attrFn = function attrFn(data) {
        return data.qAttrDims.qValues[targetDepthObject.attrDimIdx];
      };
    } else if (targetDepthObject.attrIdx >= 0) {
      attrFn = function attrFn(data) {
        return data.qAttrExps.qValues[targetDepthObject.attrIdx];
      };
    }

    return {
      nodeFn: nodeFn,
      attrFn: attrFn,
      valueFn: valueFn
    };
  }

  function datumExtract$1(propCfg, cell, _ref2) {
    var key = _ref2.key;

    var datum = {
      value: typeof propCfg.value === 'function' ? propCfg.value(cell) : typeof propCfg.value !== 'undefined' ? propCfg.value : cell // eslint-disable-line no-nested-ternary
    };

    datum.label = typeof propCfg.label === 'function' ? propCfg.label(cell) : typeof propCfg.label !== 'undefined' ? String(propCfg.label) : String(datum.value); // eslint-disable-line no-nested-ternary

    if (propCfg.field) {
      datum.source = {
        key: key,
        field: propCfg.field.key()
      };
    }

    return datum;
  }

  function extract$1(config, dataset, cache, util) {
    var cfgs = Array.isArray(config) ? config : [config];
    var dataItems = [];
    cfgs.forEach(function (cfg) {
      if (typeof cfg.field !== 'undefined') {
        var _ret = function () {
          var cube = dataset.raw();
          var rootPath = cube.qMode === 'K' ? '/qStackedDataPages/*/qData' : '/qTreeDataPages/*';
          var childNodes = cube.qMode === 'K' ? 'qSubNodes' : 'qNodes';
          var root = resolve(rootPath, cube);
          if (!root || !root[0]) {
            return {
              v: void 0
            };
          }
          var sourceKey = dataset.key();
          var f = _typeof(cfg.field) === 'object' ? cfg.field : dataset.field(cfg.field);

          var _util$normalizeConfig = util.normalizeConfig(cfg, dataset),
              props = _util$normalizeConfig.props,
              main = _util$normalizeConfig.main;

          var propsArr = Object.keys(props);
          if (!cache.tree) {
            cache.tree = hierarchy(root[0], function (node) {
              return node[childNodes];
            });
          }
          var itemDepthObject = getFieldDepth(f, { cube: cube, cache: cache });

          var _getFieldAccessor = getFieldAccessor$1({ fieldDepth: 0 }, itemDepthObject),
              nodeFn = _getFieldAccessor.nodeFn,
              attrFn = _getFieldAccessor.attrFn,
              valueFn = _getFieldAccessor.valueFn;

          propsArr.forEach(function (prop) {
            var pCfg = props[prop];
            var arr = pCfg.fields ? pCfg.fields : [pCfg];
            arr.forEach(function (p) {
              if (p.field) {
                if (p.field === f) {
                  p.isSame = true;
                } else {
                  var depthObject = getFieldDepth(p.field, { cube: cube, cache: cache });
                  var accessors = getFieldAccessor$1(itemDepthObject, depthObject);
                  p.accessor = accessors.nodeFn;
                  p.valueAccessor = accessors.valueFn;
                  p.attrAccessor = accessors.attrFn;
                }
              }
            });
          });

          var track = !!cfg.trackBy;
          var trackType = _typeof(cfg.trackBy);
          var tracker = {};
          var trackedItems = [];

          var items = nodeFn(cache.tree);
          var mapped = [];

          var _loop = function _loop(i) {
            var item = items[i];
            var itemData = attrFn ? attrFn(valueFn(item)) : valueFn(item);
            var exclude = main.filter && !main.filter(itemData);
            if (exclude) {
              return 'continue';
            }
            var ret = datumExtract$1(main, itemData, { key: sourceKey });
            propsArr.forEach(function (prop) {
              var pCfg = props[prop];
              var arr = pCfg.fields || [pCfg];
              var coll = void 0;
              if (pCfg.fields) {
                coll = [];
              }
              arr.forEach(function (p) {
                var fn = void 0;
                var value = void 0;
                if (p.type === 'primitive') {
                  value = p.value;
                } else {
                  if (typeof p.value === 'function') {
                    // accessor function
                    fn = p.value;
                  }
                  if (p.accessor) {
                    value = p.accessor(item);
                    if (Array.isArray(value)) {
                      // propably descendants
                      value = value.map(p.valueAccessor);
                      if (p.attrAccessor) {
                        value = value.map(p.attrAccessor);
                      }
                      if (fn) {
                        value = value.map(fn);
                        fn = null;
                      }
                      value = p.reduce ? p.reduce(value) : value;
                    } else {
                      value = p.attrAccessor ? p.attrAccessor(p.valueAccessor(value)) : p.valueAccessor(value);
                    }
                  } else {
                    value = itemData;
                  }
                }
                if (pCfg.fields) {
                  coll.push(fn ? fn(value) : value);
                } else {
                  ret[prop] = {
                    value: fn ? fn(value) : value
                  };
                  ret[prop].label = String(ret[prop].value);
                  if (p.field) {
                    ret[prop].source = { field: p.field.key(), key: sourceKey };
                  }
                }
              });
              if (coll) {
                ret[prop] = {
                  value: typeof pCfg.value === 'function' ? pCfg.value(coll) : coll
                };
                ret[prop].label = String(ret[prop].value);
              }
            });
            // collect items based on the trackBy value
            // items with the same trackBy value are placed in an array and reduced later
            if (track) {
              util.track({
                cfg: cfg,
                itemData: itemData,
                obj: ret,
                target: trackedItems,
                tracker: tracker,
                trackType: trackType
              });
            }
            mapped.push(ret);
          };

          for (var i = 0; i < items.length; i++) {
            var _ret2 = _loop(i);

            if (_ret2 === 'continue') continue;
          }
          // reduce if items have been grouped
          if (track) {
            dataItems.push.apply(dataItems, toConsumableArray(util.collect(trackedItems, {
              main: main,
              propsArr: propsArr,
              props: props
            })));
          } else {
            dataItems.push.apply(dataItems, mapped);
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    });
    return dataItems;
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var format_min = createCommonjsModule(function (module) {
    /*! javascript-number-formatter - v1.1.11 - http://mottie.github.com/javascript-number-formatter/ * © ecava */
    !function (a, b) {
      "function" == typeof undefined && undefined.amd ? undefined([], b) : module.exports = b();
    }(commonjsGlobal, function () {
      return function (a, b) {
        if (!a || isNaN(+b)) return b;var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m = a.length,
            n = a.search(/[0-9\-\+#]/),
            o = n > 0 ? a.substring(0, n) : "",
            p = a.split("").reverse().join(""),
            q = p.search(/[0-9\-\+#]/),
            r = m - q,
            s = a.substring(r, r + 1),
            t = r + ("." === s || "," === s ? 1 : 0),
            u = q > 0 ? a.substring(t, m) : "";if (a = a.substring(n, t), b = "-" === a.charAt(0) ? -b : +b, c = b < 0 ? b = -b : 0, d = a.match(/[^\d\-\+#]/g), e = d && d[d.length - 1] || ".", f = d && d[1] && d[0] || ",", a = a.split(e), b = b.toFixed(a[1] && a[1].length), b = +b + "", h = a[1] && a[1].lastIndexOf("0"), j = b.split("."), (!j[1] || j[1] && j[1].length <= h) && (b = (+b).toFixed(h + 1)), k = a[0].split(f), a[0] = k.join(""), g = a[0] && a[0].indexOf("0"), g > -1) for (; j[0].length < a[0].length - g;) {
          j[0] = "0" + j[0];
        } else 0 === +j[0] && (j[0] = "");if (b = b.split("."), b[0] = j[0], i = k[1] && k[k.length - 1].length) {
          for (l = b[0], p = "", r = l.length % i, m = l.length, t = 0; t < m; t++) {
            p += l.charAt(t), !((t - r + 1) % i) && t < m - i && (p += f);
          }b[0] = p;
        }return b[1] = a[1] && b[1] ? e + b[1] : "", d = b.join(""), "0" !== d && "" !== d || (c = !1), o + ((c ? "-" : "") + d) + u;
      };
    });
  });

  function escapeRegExp(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  }

  var SIprefixes = {
    3: 'k',
    6: 'M',
    9: 'G',
    12: 'T',
    15: 'P',
    18: 'E',
    21: 'Z',
    24: 'Y',
    '-3': 'm',
    '-6': 'μ',
    '-9': 'n',
    '-12': 'p',
    '-15': 'f',
    '-18': 'a',
    '-21': 'z',
    '-24': 'y'
  },
      percentage = /%$/,

  //    scientific = /e[\+\-][0-9]+/,
  radix = /^\(r(0[2-9]|[12]\d|3[0-6])\)/i,
      oct = /^\(oct\)/i,
      dec = /^\(dec\)/i,
      hex = /^\(hex\)/i,
      bin = /^\(bin\)/i,
      rom = /^\(rom\)/i,
      functional = /^(\(rom\)|\(bin\)|\(hex\)|\(dec\)|\(oct\)|\(r(0[2-9]|[12]\d|3[0-6])\))/i,
      prec = /#|0/g;

  function formatRadix(value, fradix, pattern, decimal) {
    value = value.toString(fradix);
    if (pattern[1] === pattern[1].toUpperCase()) {
      value = value.toUpperCase();
    }
    if (value.length - value.indexOf('.') > 10) {
      // limit to 10 decimal places
      value = value.slice(0, value.indexOf('.') + 11);
    }

    return value.replace('.', decimal || '.');
  }

  // value must be an integer
  // value must not be in scientific notation
  function formatRoman(value, pattern) {
    var i = void 0,
        s = '',
        v = Number(String(value).slice(-3)),
        nThousands = (value - v) / 1000,
        decimal = [0, 1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900].reverse(),
        numeral = ['0', 'I', 'IV', 'V', 'IX', 'X', 'XL', 'L', 'XC', 'C', 'CD', 'D', 'CM'].reverse();

    while (v > 0) {
      for (i = 0; i < decimal.length; i++) {
        if (decimal[i] <= v) {
          s += numeral[i];
          v -= decimal[i];
          break;
        }
      }
    }

    for (i = 0; i < nThousands; i++) {
      s = 'M' + s;
    }

    if (pattern[1] !== pattern[1].toUpperCase()) {
      s = s.toLowerCase();
    }
    return s;
  }

  function formatFunctional(value, pattern, d) {
    var temp = void 0;
    if (radix.test(pattern)) {
      value = formatRadix(value, Number(/\d{2}/.exec(pattern)[0]), pattern, d);
    } else if (oct.test(pattern)) {
      value = formatRadix(value, 8, pattern, d);
    } else if (dec.test(pattern)) {
      value = formatRadix(value, 10, pattern, d);
    } else if (hex.test(pattern)) {
      value = formatRadix(value, 16, pattern, d);
    } else if (bin.test(pattern)) {
      value = formatRadix(value, 2, pattern, d);
    } else if (rom.test(pattern)) {
      temp = '';
      if (value < 0) {
        temp = '-';
        value = -value;
      }
      value = Math.floor(value);
      if (value === 0) {
        value = '0';
      } else if (value <= 500000) {
        // limit in engine
        value = formatRoman(value, pattern);
        value = temp + value;
      } else {
        value = pattern + temp + value.toExponential(0); // to return same result as engine
      }
    }

    return value;
  }

  function escape(value, flags, justStr) {
    var str = escapeRegExp(value);
    if (justStr) {
      return str;
    }
    return new RegExp(str || '', flags);
  }

  function createRegExp(thousand, decimal) {
    if (decimal) {
      decimal = escapeRegExp(decimal);
    }
    if (thousand) {
      thousand = escapeRegExp(thousand);
    }
    return new RegExp('(?:[#0]+' + thousand + ')?[#0]+(?:' + decimal + '[#0]+)?');
  }

  function getAbbreviations(localeInfo, listSeparator) {
    if (!localeInfo || !localeInfo.qNumericalAbbreviation) {
      return SIprefixes;
    }

    var abbreviations = {};
    var abbrs = localeInfo.qNumericalAbbreviation.split(listSeparator);

    abbrs.forEach(function (abbreviation) {
      var abbreviationTuple = abbreviation.split(':');
      if (abbreviationTuple.length === 2) {
        abbreviations[abbreviationTuple[0]] = abbreviationTuple[1];
      }
    });

    return abbreviations;
  }

  function preparePattern(o, t, d) {
    var parts = void 0,
        lastPart = void 0,
        pattern = o.pattern,
        numericPattern = void 0,
        prefix = void 0,
        postfix = void 0,
        groupTemp = void 0,
        decTemp = void 0,
        temp = void 0,
        regex = void 0;

    if (pattern.indexOf('A') >= 0) {
      // abbreviate SI
      pattern = pattern.replace('A', '');
      o.abbreviate = true;
    }

    // extract the numeric part from the pattern
    regex = createRegExp(t, d);
    numericPattern = pattern.match(regex);
    numericPattern = numericPattern ? numericPattern[0] : '';
    prefix = numericPattern ? pattern.substr(0, pattern.indexOf(numericPattern)) : pattern;
    postfix = numericPattern ? pattern.substring(pattern.indexOf(numericPattern) + numericPattern.length) : '';

    if (!numericPattern) {
      numericPattern = pattern ? '#' : '##########';
    }

    if (t && t === d) {
      // ignore grouping if grouping separator is same as decimal separator
      // extract decimal part
      parts = numericPattern.split(d);
      lastPart = parts.pop();
      numericPattern = parts.join('') + d + lastPart;
      t = '';
    }

    // formatting library does not support multiple characters as separator (nor +-).
    // do a temporary replacement
    groupTemp = t;
    t = /,/.test(d) ? '¤' : ',';
    if (groupTemp) {
      numericPattern = numericPattern.replace(escape(groupTemp, 'g'), t);
    }

    decTemp = d;
    d = '.';
    if (decTemp) {
      numericPattern = numericPattern.replace(escape(decTemp, 'g'), d);
    }

    temp = numericPattern.match(/#/g);
    temp = temp ? temp.length : 0;

    var splitPattern = pattern.split(decTemp);
    var matchPrecisionResult = void 0;
    if (splitPattern[1]) {
      matchPrecisionResult = splitPattern[1].match(prec);
    }

    o.prefix = prefix || '';
    o.postfix = postfix || '';
    o.pattern = pattern;
    o.maxPrecision = matchPrecisionResult ? matchPrecisionResult.length : 2;
    o.percentage = percentage.test(pattern);
    o.numericPattern = numericPattern || '';
    o.numericRegex = new RegExp(escape(t, null, true) + '|' + escape(d, null, true), 'g');
    o.groupTemp = groupTemp;
    o.decTemp = decTemp;
    o.t = t;
    o.d = d;
    o.temp = temp;
  }

  var NumberFormatter = function () {
    /**
     * @name NumberFormatter
     * @constructs
     * @param {Object} localeInfo
     * @param {String} pattern
     * @param {String} [thousand]
     * @param {String} [decimal]
     * @param {String} [type]
     */
    function NumberFormatter(localeInfo, pattern, thousand, decimal, type) {
      classCallCheck(this, NumberFormatter);

      this.localeInfo = localeInfo;
      this.pattern = pattern;
      this.thousandDelimiter = thousand || ',';
      this.decimalDelimiter = decimal || '.';
      this.type = type || 'numeric';

      // FIXME qListSep?
      // this.patternSeparator = this.localeInfo && this.localeInfo.qListSep ? this.localeInfo.qListSep : ';';
      this.patternSeparator = ';';

      this.abbreviations = getAbbreviations(localeInfo, this.patternSeparator);

      this.prepare();
    }

    createClass(NumberFormatter, [{
      key: 'clone',
      value: function clone() {
        var n = new NumberFormatter(this.localeInfo, this.pattern, this.thousandDelimiter, this.decimalDelimiter, this.type);
        n.subtype = this.subtype;
        return n;
      }

      /**
       * Formats a number according to a specific pattern.
       * Use # for optional numbers and 0 for padding.
       * @param {Number} value Number to format.
       * @param {String} [pattern] The pattern to apply.
       * @param {String} [t] Grouping separator.
       * @param {String} [d] Decimal delimiter.
       * @example
       * format(10, "0") // 10;
       * format(10, "#") // 10;
       * format(10, "##.#") // 10;
       * format(10, "##.0") // 10.0;
       * format(10, "000") // 010;
       * format(10.123, "0.0") // 10.1;
       * format(10.123, "0.00##") // 10.123; // at least 2 decimals, never more than 4
       * format(123456789, "#,###") // 123,456,789;
       * format(123456789, "####-####", "-") // 1-2345-6789;
       * format(10000, "#A") // 10k,  A -> SI abbreviation
       * format(1234567, "#.###A") // 1.235M;
       * format(0.0001, "#.#A") // 0.1m;
       *
       * format(0.257, "0.0%") // 25.7%; // will multiply by 100
       * format(9876, "$#,###") // $9,876;
       * format(-9876, "$#,###;$(#,###)") // $(9,876); // use ; for alternative formatting for negative values
       * format(10, "(r16)") // a; // radix 16
       * format(15, "(hex)") // f; // same as (r16)
       * format(15, "(HEX)") // F;
       * format(10, "(bin)") // 1010; // same as (r02)
       * format(10, "(oct)") // 12; // same as (r08)
       */

    }, {
      key: 'format',
      value: function format(value, pattern, t, d) {
        this.prepare(pattern, t, d);
        return this.formatValue(value);
      }
    }, {
      key: 'prepare',
      value: function prepare(pattern, t, d) {
        var prep = void 0;

        if (typeof pattern === 'undefined') {
          pattern = this.pattern;
        }
        if (typeof t === 'undefined') {
          t = this.thousandDelimiter;
        }
        if (typeof d === 'undefined') {
          d = this.decimalDelimiter;
        }

        if (!pattern) {
          this._prepared = { pattern: false };
          return;
        }

        this._prepared = {
          positive: {
            d: d,
            t: t,
            abbreviate: false,
            isFunctional: false,
            prefix: '',
            postfix: ''
          },
          negative: {
            d: d,
            t: t,
            abbreviate: false,
            isFunctional: false,
            prefix: '',
            postfix: ''
          },
          zero: {
            d: d,
            t: t,
            abbreviate: false,
            isFunctional: false,
            prefix: '',
            postfix: ''
          }
        };
        prep = this._prepared;

        pattern = pattern.split(this.patternSeparator);
        prep.positive.pattern = pattern[0];
        prep.negative.pattern = pattern[1];
        prep.zero.pattern = pattern[2];
        if (functional.test(pattern[0])) {
          prep.positive.isFunctional = true;
        }
        if (!pattern[1]) {
          prep.negative = false;
        } else if (functional.test(pattern[1])) {
          prep.negative.isFunctional = true;
        }
        if (!pattern[2]) {
          prep.zero = false;
        } else if (functional.test(pattern[2])) {
          prep.zero.isFunctional = true;
        }

        if (!prep.positive.isFunctional) {
          preparePattern(prep.positive, t, d);
        }
        if (prep.negative && !prep.negative.isFunctional) {
          preparePattern(prep.negative, t, d);
        }
        if (prep.zero && !prep.zero.isFunctional) {
          preparePattern(prep.zero, t, d);
        }
      }
    }, {
      key: 'formatValue',
      value: function formatValue(value) {
        var prep = this._prepared,
            temp = void 0,
            exponent = void 0,
            abbr = '',
            absValue = void 0,
            num = void 0,
            sciValue = '',
            d = void 0,
            t = void 0,
            i = void 0,
            numericPattern = void 0,
            decimalPartPattern = void 0,
            original = value;

        if (isNaN(value)) {
          return '' + original;
        }

        value = +value;

        if (prep.pattern === false) {
          return value.toString();
        }

        if (value === 0 && prep.zero) {
          prep = prep.zero;
          return prep.pattern;
        } else if (value < 0 && prep.negative) {
          prep = prep.negative;
          value = -value;
        } else {
          prep = prep.positive;
        }
        d = prep.d;
        t = prep.t;

        if (prep.isFunctional) {
          value = formatFunctional(value, prep.pattern, d);
        } else {
          if (prep.percentage) {
            value *= 100;
          }

          if (prep.abbreviate) {
            var abbrArray = Object.keys(this.abbreviations).map(function (key) {
              return parseInt(key, 10);
            }).sort(function (a, b) {
              return a - b;
            });
            var lowerAbbreviation = void 0;
            var upperAbbreviation = abbrArray[0];
            i = 0;
            exponent = Number(Number(value).toExponential().split('e')[1]);

            while (upperAbbreviation <= exponent && i < abbrArray.length) {
              i++;
              upperAbbreviation = abbrArray[i];
            }

            if (i > 0) {
              lowerAbbreviation = abbrArray[i - 1];
            }

            var suggestedAbbrExponent = void 0;

            // value and lower abbreviation is for values above 10, use the lower (move to the left <==)
            if (lowerAbbreviation && exponent > 0 && lowerAbbreviation > 0) {
              suggestedAbbrExponent = lowerAbbreviation;
              // value and lower abbreviation is for values below 0.1 (move to the right ==>)
            } else if (exponent < 0 && lowerAbbreviation < 0 || !lowerAbbreviation) {
              // upper abbreviation is also for values below 0.1 and precision allows for using the upper abbreviation(move to the right ==>)
              if (upperAbbreviation < 0 && upperAbbreviation - exponent <= prep.maxPrecision) {
                suggestedAbbrExponent = upperAbbreviation;
                // lower abbrevaition is smaller than exponent and we can't get away with not abbreviating
              } else if (lowerAbbreviation <= exponent && !(upperAbbreviation > 0 && -exponent <= prep.maxPrecision)) {
                // (move to left <==)
                suggestedAbbrExponent = lowerAbbreviation;
              }
            }
            if (suggestedAbbrExponent) {
              abbr = this.abbreviations[suggestedAbbrExponent];
              value /= Math.pow(10, suggestedAbbrExponent);
            }
          }

          absValue = Math.abs(value);
          temp = prep.temp;
          numericPattern = prep.numericPattern;
          decimalPartPattern = numericPattern.split(d)[1];

          if (this.type === 'I') {
            value = Math.round(value);
          }
          num = value;

          if (!decimalPartPattern && numericPattern.slice(-1)[0] === '#') {
            if (absValue >= Math.pow(10, temp) || absValue < 1 || absValue < 1e-4) {
              if (value === 0) {
                value = '0';
              } else if (absValue < 1e-4 || absValue >= 1e20) {
                // engine always formats values < 1e-4 in scientific form, values >= 1e20 can only be represented in scientific form
                value = num.toExponential(Math.max(1, Math.min(14, temp)) - 1);
                value = value.replace(/\.?0+(?=e)/, '');
                sciValue = '';
              } else {
                value = value.toPrecision(Math.max(1, Math.min(14, temp)));
                if (value.indexOf('.') >= 0) {
                  value = value.replace(value.indexOf('e') < 0 ? /0+$/ : /\.?0+(?=e)/, '');
                  value = value.replace('.', d);
                }
              }
            } else {
              numericPattern += d;
              temp = Math.max(0, Math.min(20, temp - Math.ceil(Math.log(absValue) / Math.log(10))));
              for (i = 0; i < temp; i++) {
                numericPattern += '#';
              }

              value = format_min(numericPattern, value);
            }
          } else if (absValue >= 1e15 || absValue > 0 && absValue <= 1e-14) {
            value = absValue ? absValue.toExponential(15).replace(/\.?0+(?=e)/, '') : '0';
          } else {
            var wholePart = Number(value.toFixed(Math.min(20, decimalPartPattern ? decimalPartPattern.length : 0)).split('.')[0]);
            var wholePartPattern = numericPattern.split(d)[0];
            wholePartPattern += d;

            value = format_min(wholePartPattern, wholePart) || '0';

            if (decimalPartPattern) {
              var nDecimals = Math.max(0, Math.min(14, decimalPartPattern.length)); // the length of e.g. 0000#####
              var nZeroes = decimalPartPattern.replace(/#+$/, '').length;
              var decimalPart = (this.type === 'I' ? 0 : absValue % 1).toFixed(nDecimals).slice(2).replace(/0+$/, ''); // remove trailing zeroes

              for (i = decimalPart.length; i < nZeroes; i++) {
                decimalPart += '0';
              }

              if (decimalPart) {
                value += d + decimalPart;
              }
            } else if (wholePart === 0) {
              // to avoid "-" being prefixed to value
              num = 0;
            }
          }

          value = value.replace(prep.numericRegex, function (m) {
            if (m === t) {
              return prep.groupTemp;
            } else if (m === d) {
              return prep.decTemp;
            }
            return '';
          });
          if (num < 0 && !/^-/.test(value)) {
            value = '-' + value;
          }
        }

        return prep.prefix + value + sciValue + abbr + prep.postfix;
      }
    }], [{
      key: 'getStaticFormatter',
      value: function getStaticFormatter() {
        return {
          prepare: function prepare() {},
          formatValue: function formatValue(v) {
            return '' + v;
          }
        };
      }
    }]);
    return NumberFormatter;
  }();

  function numberFormatFactory() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(NumberFormatter, [null].concat(args)))();
  }

  function formatter(pattern, thousand, decimal, qType, localeInfo) {
    var qformat = numberFormatFactory(localeInfo, pattern, thousand, decimal, qType);

    /**
     * Format a value according to the specified pattern created at construct
     *
     * @param  {Number} value   The number to be formatted
     * @return {String}         [description]
     */
    function format(value) {
      return qformat.formatValue(value);
    }

    /**
      * Format a value according to a specific pattern
      * that is not the one specified in the constructor
      *
      * @param  {String} p   Pattern
      * @param  {Number} v   Value
      * @param  {String} t   Thousand
      * @param  {String} d   Decimal
      * @return {String}     Formatted value
      */
    format.format = function formatFn(p, v, t, d) {
      return qformat.format(v, p, t, d);
    };

    /**
      * Change the pattern on existing formatter
      *
      * @param  {String} p     Pattern (optional)
      * @return {String}       Returns the pattern
      */
    format.pattern = function patternFn(p) {
      if (p) {
        qformat.pattern = p;
        qformat.prepare();
      }
      return qformat.pattern;
    };

    /**
     * Set the locale for the formatter
     *
     * @param  {Object} args   Locale object for formatting
     * @return {Undefined}      Returns nothing
     */
    /* format.locale = function( ...args ) {
      locale = formatLocale( ...args );
      d3format = locale.format( pattern );
       return this;
    }; */

    return format;
  }

  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var DAYS_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function pad(s, n) {
    for (var i = s.length; i < n; i++) {
      s = '0' + s;
    }
    return s;
  }

  function parseDate(d, twelveFormat) {
    var h = d.getHours();
    var day = d.getDay() - 1;
    if (twelveFormat) {
      h %= 12;
      if (!h) {
        // h == 0 -> 12
        h = 12;
      }
    }

    if (day < 0) {
      day = 6;
    }

    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: day,
      date: d.getDate(),
      h: h,
      m: d.getMinutes(),
      s: d.getSeconds(),
      f: d.getMilliseconds(),
      t: d.getHours() >= 12 ? 'pm' : 'am'
    };
  }

  function getRemainder(value) {
    var s = value.toString().split('.');
    if (s[1]) {
      s = Number('0.' + s[1]);
    } else {
      return 0;
    }
    return s;
  }

  function parseIntervalDays(days) {
    var d = days;
    var h = 24 * getRemainder(d);
    var m = 60 * getRemainder(h);
    var s = 60 * getRemainder(m);
    var ms = 1000 * getRemainder(s);

    return {
      d: Math.floor(d),
      h: Math.floor(h),
      m: Math.floor(m),
      s: Math.floor(s),
      f: Math.round(ms)
    };
  }

  function parseInterval(days, pattern) {
    var units = parseIntervalDays(days),
        d = units.d,
        h = units.h,
        m = units.m,
        s = units.s,
        f = units.f,
        w = 0,
        date = void 0;

    if (/w+|t+/gi.test(pattern)) {
      date = new Date(1899, 11, 30 + Math.floor(days), 0, 0, 24 * 60 * 60 * (days - Math.floor(days)));
      if (isNaN(date.getTime())) {
        date = null;
      }
    }

    if (!/D+/gi.test(pattern)) {
      h += d * 24;
    }
    if (!/h+/gi.test(pattern)) {
      m += h * 60;
    }
    if (!/m+/gi.test(pattern)) {
      s += m * 60;
    }
    if (/w+/gi.test(pattern)) {
      w = date ? date.getDay() - 1 : 0;
      if (w < 0) {
        w = 6;
      }
    }

    var someT = '';
    if (date) {
      someT = date.getHours() >= 12 ? 'pm' : 'am';
    }

    return {
      year: 0,
      month: 0,
      day: w,
      date: d,
      h: h,
      m: m,
      s: s,
      f: f,
      t: someT
    };
  }

  function getMasks(inst, d) {
    return {
      'Y+|y+': {
        Y: '' + Number(('' + d.year).slice(-2)),
        YY: pad(('' + d.year).slice(-2), 2),
        YYY: pad(('' + d.year).slice(-3), 3),
        def: function def(m) {
          // default
          return pad('' + d.year, m.length);
        }
      },
      'M+': {
        M: d.month + 1,
        MM: pad('' + (d.month + 1), 2),
        MMM: inst.locale_months_abbr[d.month],
        def: inst.locale_months[d.month]
      },
      'W+|w+': {
        W: d.day,
        WW: pad('' + d.day, 2),
        WWW: inst.locale_days_abbr[d.day],
        def: inst.locale_days[d.day]
      },
      'D+|d+': {
        D: d.date,
        def: function def(m) {
          return pad('' + d.date, m.length);
        }
      },
      'h+|H+': {
        h: d.h,
        def: function def(m) {
          return pad('' + d.h, m.length);
        }
      },
      'm+': {
        m: d.m,
        def: function def(m) {
          return pad('' + d.m, m.length);
        }
      },
      's+|S+': {
        s: d.s,
        def: function def(m) {
          return pad('' + d.s, m.length);
        }
      },
      'f+|F+': {
        def: function def(m) {
          var f = '' + d.f,
              n = m.length - f.length;
          if (n > 0) {
            for (var i = 0; i < n; i++) {
              f += '0';
            }
          } else if (n < 0) {
            f = f.slice(0, m.length);
          }
          return f;
        }
      },
      't{1,2}|T{1,2}': {
        def: function def(m) {
          var t = d.t;
          if (m[0].toUpperCase() === m[0]) {
            t = t.toUpperCase();
          }
          t = t.slice(0, m.length);
          return t;
        }
      }
    };
  }

  var DateFormatter = function () {
    /**
     * @name DateFormatter
     * @constructs
     * @param {Object} localeInfo
     * @param {String} pattern
     */
    function DateFormatter(localeInfo, pattern, qtype) {
      classCallCheck(this, DateFormatter);

      var info = localeInfo || {};

      if (!info.qCalendarStrings) {
        info.qCalendarStrings = {
          qLongDayNames: DAYS,
          qDayNames: DAYS_ABBR,
          qLongMonthNames: MONTHS,
          qMonthNames: MONTHS_ABBR
        };
      }

      this.localeInfo = info;
      this.locale_days = info.qCalendarStrings.qLongDayNames.slice();
      this.locale_days_abbr = info.qCalendarStrings.qDayNames.slice();
      this.locale_months = info.qCalendarStrings.qLongMonthNames.slice();
      this.locale_months_abbr = info.qCalendarStrings.qMonthNames.slice();

      if (!pattern) {
        var _patternMap;

        var patternMap = (_patternMap = {}, defineProperty(_patternMap, TYPES.TIME, info.qTimeFmt || 'hh:mm:ss'), defineProperty(_patternMap, TYPES.DATE, info.qDateFmt || 'YYYY-MM-DD'), defineProperty(_patternMap, TYPES.DATE_TIME, info.qTimestampFmt || 'YYYY-MM-DD hh:mm:ss'), _patternMap);

        pattern = patternMap[qtype];
      }

      this.pattern = pattern;
    }

    createClass(DateFormatter, [{
      key: 'clone',
      value: function clone() {
        var n = new DateFormatter(this.localeInfo, this.pattern);
        n.subtype = this.subtype;
        return n;
      }

      /**
       * Formats a date according to given pattern
       * @param {Date} date The date to format.
       * @param {String} pattern The desired format of the date
       * var d = new Date(2013, 8, 15, 13, 55, 40, 987);
       * var n = new DateFormatter();
       * @example
       * m.format( d, 'YYYY-MM-DD hh:mm:ss.ffff') // 2013-08-15 13:55:40.9870
       * m.format( d, 'h:m:s tt') // 1:55:40 pm
       * m.format( d, 'h:m:s TT') // 1:55:40 PM
       * m.format( d, 'M/D/YYYY') // 8/15/2013
       * m.format( d, 'WWWW DD MMM') // Thursday 15 Aug
       * m.format( d, 'WWW DD MMMM @ hh:mm:ss') // Thu 15 August @ 13:55:40
       */

    }, {
      key: 'format',
      value: function format(date, pattern) {
        // Fallback pattern is set in constructor
        if (!pattern) {
          pattern = this.pattern ? this.pattern : 'YYYY-MM-DD hh:mm:ss';
        }

        pattern = pattern.replace(/\[.+]|\[|]/g, '');
        var hasTwelveFlag = /t+/ig.test(pattern);
        var parsedDate = void 0;

        if (date instanceof Date) {
          parsedDate = parseDate(date, hasTwelveFlag);
        } else {
          if (date < 0) {
            // parseInterval don't support for negative values
            date = -date;
            pattern = '-' + pattern;
          }
          parsedDate = parseInterval(date, pattern);
        }
        // remove [] and everything inside it

        var masks = getMasks(this, parsedDate);

        var masksArr = [];
        for (var mask in masks) {
          if (Object.prototype.hasOwnProperty.call(masks, mask)) {
            masksArr.push(mask);
          }
        }
        var dateTimeRegex = new RegExp(masksArr.join('|'), 'g');

        var result = pattern.replace(dateTimeRegex, function (m) {
          var r = void 0;
          var mask = void 0;
          for (mask in masks) {
            if (Object.prototype.hasOwnProperty.call(masks, mask)) {
              r = new RegExp(mask);
              if (r.test(m)) {
                break;
              }
            }
          }
          if (!r) {
            return '';
          }
          var value = void 0;
          for (var submask in masks[mask]) {
            if (submask === m || submask.toLowerCase() === m) {
              value = masks[mask][submask];
              if (typeof value === 'undefined') {
                value = masks[mask][submask.toLowerCase()];
              }
              break;
            }
          }
          if (typeof value === 'undefined') {
            value = masks[mask].def;
          }

          if (typeof value === 'function') {
            value = value(m);
          }
          return value;
        });
        return result;
      }
    }]);
    return DateFormatter;
  }();

  function dateFormatFactory() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(DateFormatter, [null].concat(args)))();
  }

  function QlikTimeToDate(value) {
    return new Date(1899, 11, 30 + Math.floor(value), 0, 0, 0, 1000 * 24 * 60 * 60 * (value - Math.floor(value)));
  }

  var TYPES = {
    AUTO: 'U',
    INTEGER: 'I',
    NUMBER: 'R',
    FIXED_TO: 'F',
    MONEY: 'M',
    DATE: 'D',
    TIME: 'T',
    DATE_TIME: 'TS',
    INTERVAL: 'IV'
  };

  function formatter$1(pattern) {
    var qtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'TS';
    var localeInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var qformat = dateFormatFactory(localeInfo, pattern, qtype);

    /**
     * Prepare a value according to the specified qtype
     *
     * @param  {Number} value The value to be formatted
     * @return {Number}       The converted value (if applied)
     */
    function prepare(value) {
      if (qtype !== TYPES.INTERVAL) {
        return QlikTimeToDate(value);
      }
      return value;
    }

    /**
     * Format a value according to the specified pattern created at construct
     *
     * @param  {Date} value   The number to be formatted
     * @return {String}         [description]
     */
    function format(value) {
      value = prepare(value);
      return qformat.format(value);
    }

    /**
      * Format a value according to a specific pattern
      * that is not the one specified in the constructor
      *
      * @param  {String} p   Pattern
      * @param  {Date} v   Value
      * @return {String}     Formatted value
      */
    format.format = function formatFn(p, v) {
      v = prepare(v);
      return qformat.format(v, p);
    };

    /**
     * Set the locale for the formatter
     *
     * @param  {Object} args   Locale object for formatting
     * @return {Undefined}      Returns nothing
     */
    format.locale = function locale(li) {
      qformat = dateFormatFactory(li, pattern, qtype);

      return this;
    };

    /**
     * Get or set the QType
     *
     * @param  {String} nqt New qType (optional)
     * @return {String}     Current qtype
     */
    format.qtype = function qtypeFn(nqt) {
      if (nqt !== undefined) {
        qtype = nqt;
      }
      return qtype;
    };

    return format;
  }

  function createFromMetaInfo(meta, localeInfo) {
    if (meta && meta.qNumFormat && ['D', 'T', 'TS', 'IV'].indexOf(meta.qNumFormat.qType) !== -1) {
      return formatter$1(meta.qNumFormat.qFmt, meta.qNumFormat.qType, localeInfo);
    }
    var pattern = '#';
    var thousand = localeInfo && typeof localeInfo.qThousandSep !== 'undefined' ? localeInfo.qThousandSep : ',';
    var decimal = localeInfo && typeof localeInfo.qDecimalSep !== 'undefined' ? localeInfo.qDecimalSep : '.';
    var type = 'U';
    var isAuto = meta && !!meta.qIsAutoFormat;
    if (meta && meta.qNumFormat) {
      pattern = meta.qNumFormat.qFmt || pattern;
      thousand = meta.qNumFormat.qThou || thousand;
      decimal = meta.qNumFormat.qDec || decimal;
      type = meta.qNumFormat.qType || type;
      isAuto = isAuto && ['M'].indexOf(meta.qNumFormat.qType) === -1;
    } else {
      isAuto = true;
    }

    if (isAuto) {
      pattern = '#' + decimal + '##A';
      type = 'U';
    }

    return formatter(pattern, thousand, decimal, type, localeInfo);
  }

  function qField() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        meta = _ref.meta,
        _id = _ref.id,
        _key = _ref.key,
        localeInfo = _ref.localeInfo,
        fieldExtractor = _ref.fieldExtractor,
        value = _ref.value,
        _type = _ref.type;

    var values = void 0;

    var valueFn = value || (_type === 'dimension' ? function (d) {
      return d.qElemNo;
    } : function (d) {
      return d.qValue;
    });
    var labelFn = function labelFn(d) {
      return d.qText || '';
    };
    var reduce = _type === 'dimension' ? 'first' : 'avg';
    var _formatter = createFromMetaInfo(meta, localeInfo);

    var f = {
      id: function id() {
        return _id;
      },
      key: function key() {
        return _key;
      },
      raw: function raw() {
        return meta;
      },
      title: function title() {
        return meta.qFallbackTitle || meta.label;
      },
      type: function type() {
        return _type;
      },
      items: function items() {
        if (!values) {
          values = fieldExtractor(f);
        }
        return values;
      },
      min: function min() {
        return meta.qMin;
      },
      max: function max() {
        return meta.qMax;
      },
      value: valueFn,
      label: labelFn,
      reduce: reduce,
      formatter: function formatter$$1() {
        return _formatter;
      },
      tags: function tags() {
        return meta.qTags;
      }
    };

    return f;
  }

  function _hierarchy() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var dataset = arguments[1];
    var cache = arguments[2];
    var deps = arguments[3];

    var cube = dataset.raw();
    if (cube.qMode !== 'K') {
      return null;
    }
    return augment(config, dataset, cache, deps);
  }

  function createFields(path, obj, prefix, parentKey, opts) {
    return (obj[path] || []).map(function (meta, i) {
      var fieldKey = '' + (parentKey ? parentKey + '/' : '') + path + '/' + i;
      var f = {
        instance: qField(Object.assign({
          id: '' + (prefix ? prefix + '/' : '') + fieldKey,
          key: fieldKey,
          meta: meta
        }, opts))
      };
      f.attrDims = createFields('qAttrDimInfo', meta, prefix, fieldKey, Object.assign({}, opts, { value: function value(v) {
          return v.qElemNo;
        }, type: 'dimension' }));
      f.attrExps = createFields('qAttrExprInfo', meta, prefix, fieldKey, Object.assign({}, opts, { value: function value(v) {
          return v.qNum;
        }, type: 'measure' }));
      f.measures = createFields('qMeasureInfo', meta, prefix, fieldKey, Object.assign({}, opts, { value: function value(v) {
          return v.qValue;
        }, type: 'measure' }));
      return f;
    });
  }

  function q() {
    var _cache$wrappedFields, _cache$wrappedFields2;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _key = _ref.key,
        data = _ref.data,
        _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config;

    var cache = {
      fields: [],
      wrappedFields: [],
      allFields: []
    };

    var cube = data;
    if (!cube) {
      throw new Error('Missing "data" input');
    }

    if (!cube.qDimensionInfo) {
      throw new Error('The "data" input is not recognized as a hypercube');
    }

    var deps = q.util;

    var opts = {
      cache: cache,
      cube: cube,
      localeInfo: config.localeInfo,
      fieldExtractor: null,
      pages: null
    };

    var dataset = {
      key: function key() {
        return _key;
      },
      raw: function raw() {
        return cube;
      },
      field: function field(query) {
        return findField(query, opts);
      },
      fields: function fields() {
        return cache.fields.slice();
      },
      extract: function extract$$1(extractionConfig) {
        return opts.extractor(extractionConfig, dataset, cache, deps);
      },
      hierarchy: function hierarchy(hierarchyConfig) {
        return _hierarchy(hierarchyConfig, dataset, cache, deps);
      },
      _cache: function _cache() {
        return cache;
      }
    };

    if (cube.qMode === 'K' || cube.qMode === 'T' || !cube.qMode && cube.qNodesOnDim) {
      opts.extractor = extract$1;
      opts.pages = cube.qMode === 'K' ? cube.qStackedDataPages : cube.qTreeDataPages;
    } else if (cube.qMode === 'S') {
      opts.extractor = extract;
      opts.pages = cube.qDataPages;
    } else {
      opts.ectractor = function () {
        return [];
      }; // TODO - throw unsupported error?
    }

    opts.fieldExtractor = function (f) {
      return opts.extractor({ field: f }, dataset, cache, deps);
    };

    var dimAcc = cube.qMode === 'S' ? function (d) {
      return d.qElemNumber;
    } : undefined;
    var measAcc = cube.qMode === 'S' ? function (d) {
      return d.qNum;
    } : undefined;

    (_cache$wrappedFields = cache.wrappedFields).push.apply(_cache$wrappedFields, toConsumableArray(createFields('qDimensionInfo', cube, _key, '', Object.assign({}, opts, { value: dimAcc, type: 'dimension' }))));
    (_cache$wrappedFields2 = cache.wrappedFields).push.apply(_cache$wrappedFields2, toConsumableArray(createFields('qMeasureInfo', cube, _key, '', Object.assign({}, opts, { value: measAcc, type: 'measure' }))));

    cache.fields = cache.wrappedFields.map(function (f) {
      return f.instance;
    });

    var traverse = function traverse(arr) {
      arr.forEach(function (f) {
        cache.allFields.push(f.instance);
        traverse(f.measures);
        traverse(f.attrDims);
        traverse(f.attrExps);
      });
    };

    traverse(cache.wrappedFields);

    return dataset;
  }

  var LAYOUT_TO_PROP = [['qHyperCube', 'qHyperCubeDef'], ['qTreeData', 'qTreeDataDef'], ['qDimensionInfo', 'qDimensions'], ['qMeasureInfo', 'qMeasures'], ['qAttrDimInfo', 'qAttributeDimensions'], ['qAttrExprInfo', 'qAttributeExpressions']];

  var DIM_RX$1 = /\/qDimensionInfo(?:\/(\d+))?/;
  var M_RX$1 = /\/qMeasureInfo\/(\d+)/;
  var ATTR_DIM_RX$1 = /\/qAttrDimInfo\/(\d+)(?:\/(\d+))?/;
  var ATTR_EXPR_RX$1 = /\/qAttrExprInfo\/(\d+)/;
  var HC_RX = /\/?qHyperCube/;
  var TD_RX = /\/?qTreeData/;

  var SHORTEN_HC = function SHORTEN_HC(path) {
    return '' + path.substr(0, path.indexOf('/qHyperCubeDef') + 14);
  }; // 14 = length of '/qHyperCubeDef'
  var SHORTEN_TD = function SHORTEN_TD(path) {
    return '' + path.substr(0, path.indexOf('/qTreeDataDef') + 13);
  }; // 13 = length of '/qTreeDataDef'

  function extractFieldFromId(id, layout) {
    var path = id;
    var dimensionIdx = -1;
    var measureIdx = -1;
    var pathToCube = '';
    var shortenizer = function shortenizer(p) {
      return p;
    };
    if (HC_RX.test(id)) {
      pathToCube = '' + path.substr(0, path.indexOf('qHyperCube') + 10); // 10 = length of 'qHyperCube'
      shortenizer = SHORTEN_HC;
    } else if (TD_RX.test(id)) {
      pathToCube = '' + path.substr(0, path.indexOf('qTreeData') + 9); // 9 = length of 'qTreeData'
      shortenizer = SHORTEN_TD;
    }

    var shortenPath = true;

    if (DIM_RX$1.test(id)) {
      dimensionIdx = +DIM_RX$1.exec(id)[1];
    }

    if (M_RX$1.test(id)) {
      measureIdx = +M_RX$1.exec(id)[1];
    }

    if (ATTR_DIM_RX$1.test(id)) {
      measureIdx = -1;
      dimensionIdx = 0;
      var attrCol = +ATTR_DIM_RX$1.exec(path)[2];
      if (!isNaN(attrCol)) {
        dimensionIdx = attrCol;
        path = path.replace(/\/\d+$/, '');
      }
      shortenPath = false;
    }

    if (ATTR_EXPR_RX$1.test(id)) {
      // depends on number of measures + number of attr expressions
      // in dimensions and measures before this one
      var offset = measureIdx;
      measureIdx = 0;
      if (layout) {
        var hc = resolve(pathToCube, layout);

        // offset by number of measures
        measureIdx += (hc.qMeasureInfo || []).length;

        // offset by total number of attr expr in dimensions
        // (assuming attr expr in dimensions are ordered first)
        if (dimensionIdx > -1) {
          measureIdx = hc.qDimensionInfo.slice(0, dimensionIdx).reduce(function (v, dim) {
            return v + dim.qAttrExprInfo.length;
          }, measureIdx);
          dimensionIdx = -1;
        } else {
          measureIdx = hc.qDimensionInfo.reduce(function (v, dim) {
            return v + dim.qAttrExprInfo.length;
          }, measureIdx);
          // offset by total number of attr expr in measures before 'index'
          measureIdx = hc.qMeasureInfo.slice(0, offset).reduce(function (v, meas) {
            return v + meas.qAttrExprInfo.length;
          }, measureIdx);
        }

        // offset by the actual column value for the attribute expression itself
        measureIdx += +ATTR_EXPR_RX$1.exec(path)[1];
      }
    }

    LAYOUT_TO_PROP.forEach(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          v = _ref2[0],
          prop = _ref2[1];

      path = path.replace(v, prop);
    });

    if (shortenPath) {
      path = shortenizer(path);
    }

    if (path && path[0] !== '/') {
      path = '/' + path;
    }

    return {
      measureIdx: measureIdx,
      dimensionIdx: dimensionIdx,
      path: path
    };
  }

  /**
   * Helper method to generate suitable QIX selection methods and parameters based on a brush instance.
   * @alias brush
   * @memberof picasso.q
   * @param {brush} brush A brush instance
   * @param {object} [opts]
   * @param {boolean} [opts.byCells=false] Whether to prefer selection by row index.
   * @param {string} [opts.primarySource] Field source to extract row indices from. If not specified, indices from first source are used.
   * @param {object} [layout] QIX data layout. Needed only when brushing on attribute expressions, to be able to calculate the measure index.
   * @return {object[]} An array of relevant selections
   */
  function qBrush(brush) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var layout = arguments[2];

    var byCells = opts.byCells;
    var primarySource = opts.primarySource;
    var selections = [];
    var methods = {};
    var isActive = brush.isActive();
    var hasValues = false;
    brush.brushes().forEach(function (b) {
      var info = extractFieldFromId(b.id, layout);
      if (b.type === 'range' && info.measureIdx > -1 && info.dimensionIdx > -1) {
        var ranges = b.brush.ranges();
        if (ranges.length) {
          hasValues = true;
          if (!methods.multiRangeSelectTreeDataValues) {
            methods.multiRangeSelectTreeDataValues = {
              path: info.path,
              ranges: []
            };
          }
          ranges.forEach(function (range) {
            return methods.multiRangeSelectTreeDataValues.ranges.push({
              qMeasureIx: info.measureIdx,
              qDimensionIx: info.dimensionIdx,
              qRange: {
                qMin: range.min,
                qMax: range.max,
                qMinInclEq: true,
                qMaxInclEq: true
              }
            });
          });
        }
      } else {
        if (b.type === 'range' && info.measureIdx > -1) {
          var _ranges = b.brush.ranges();
          if (_ranges.length) {
            hasValues = true;
            if (!methods.rangeSelectHyperCubeValues) {
              methods.rangeSelectHyperCubeValues = {
                path: info.path,
                ranges: []
              };
            }
            _ranges.forEach(function (range) {
              return methods.rangeSelectHyperCubeValues.ranges.push({
                qMeasureIx: info.measureIdx,
                qRange: {
                  qMin: range.min,
                  qMax: range.max,
                  qMinInclEq: true,
                  qMaxInclEq: true
                }
              });
            });
          }
        }
        if (b.type === 'range' && info.dimensionIdx > -1) {
          var _ranges2 = b.brush.ranges();
          if (_ranges2.length) {
            hasValues = true;
            if (!methods.selectHyperCubeContinuousRange) {
              methods.selectHyperCubeContinuousRange = {
                path: info.path,
                ranges: []
              };
            }
            _ranges2.forEach(function (range) {
              return methods.selectHyperCubeContinuousRange.ranges.push({
                qDimIx: info.dimensionIdx,
                qRange: {
                  qMin: range.min,
                  qMax: range.max,
                  qMinInclEq: true,
                  qMaxInclEq: false
                }
              });
            });
          }
        }
        if (b.type === 'value' && info.dimensionIdx > -1) {
          if (byCells) {
            if (!methods.selectHyperCubeCells) {
              methods.selectHyperCubeCells = {
                path: info.path,
                cols: []
              };
            }

            methods.selectHyperCubeCells.cols.push(info.dimensionIdx);
            if (b.id === primarySource || !primarySource && !methods.selectHyperCubeCells.values) {
              methods.selectHyperCubeCells.values = b.brush.values().map(function (s) {
                return +s;
              }).filter(function (v) {
                return !isNaN(v);
              });
              hasValues = !!methods.selectHyperCubeCells.values.length;
            }
          } else {
            var values = b.brush.values().map(function (s) {
              return +s;
            }).filter(function (v) {
              return !isNaN(v);
            });
            hasValues = !!values.length;
            selections.push({
              params: [info.path, info.dimensionIdx, values, false],
              method: 'selectHyperCubeValues'
            });
          }
        }
      }
    });

    if (!hasValues && isActive) {
      return [{
        method: 'resetMadeSelections',
        params: []
      }];
    }

    if (methods.rangeSelectHyperCubeValues) {
      selections.push({
        method: 'rangeSelectHyperCubeValues',
        params: [methods.rangeSelectHyperCubeValues.path, methods.rangeSelectHyperCubeValues.ranges, [], true]
      });
    }

    if (methods.selectHyperCubeContinuousRange) {
      selections.push({
        method: 'selectHyperCubeContinuousRange',
        params: [methods.selectHyperCubeContinuousRange.path, methods.selectHyperCubeContinuousRange.ranges]
      });
    }

    if (methods.selectHyperCubeCells) {
      selections.push({
        method: 'selectHyperCubeCells',
        params: [methods.selectHyperCubeCells.path, methods.selectHyperCubeCells.values, methods.selectHyperCubeCells.cols]
      });
    }

    if (methods.multiRangeSelectTreeDataValues) {
      selections.push({
        method: 'multiRangeSelectTreeDataValues',
        params: [methods.multiRangeSelectTreeDataValues.path, methods.multiRangeSelectTreeDataValues.ranges]
      });
    }

    return selections;
  }

  function initialize(picasso) {
    q.util = picasso.data('matrix').util;
    picasso.data('q', q);
    picasso.formatter('q-number', formatter);
    picasso.formatter('q-time', formatter$1);
  }

  initialize.qBrushHelper = qBrush; // deprecated
  initialize.selections = qBrush;

  return initialize;

})));
//# sourceMappingURL=picasso-q.js.map
