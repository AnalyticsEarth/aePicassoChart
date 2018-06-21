(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.picasso = factory());
}(this, (function () { 'use strict';

  var ARG_LENGTH = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
  };

  var SEGMENT_PATTERN = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

  var NUMBER = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

  function parseValues(args) {
    var numbers = args.match(NUMBER);
    return numbers ? numbers.map(Number) : [];
  }

  /**
   * parse an svg path data string. Generates an Array
   * of commands where each command is an Array of the
   * form `[command, arg1, arg2, ...]`
   *
   * https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation
   * @ignore
   *
   * @param {string} path
   * @returns {array}
   */
  function parse(path) {
    var data = [];
    var p = ('' + path).trim();

    // A path data segment (if there is one) must begin with a "moveto" command
    if (p[0] !== 'M' && p[0] !== 'm') {
      return data;
    }

    p.replace(SEGMENT_PATTERN, function (_, command, args) {
      var type = command.toLowerCase();
      args = parseValues(args);

      // overloaded moveTo
      if (type === 'm' && args.length > 2) {
        data.push([command].concat(args.splice(0, 2)));
        type = 'l';
        command = command === 'm' ? 'l' : 'L';
      }

      // Ignore invalid commands
      if (args.length < ARG_LENGTH[type]) {
        return '';
      }

      data.push([command].concat(args.splice(0, ARG_LENGTH[type])));

      // The command letter can be eliminated on subsequent commands if the
      // same command is used multiple times in a row (e.g., you can drop the
      // second "L" in "M 100 200 L 200 100 L -100 -200" and use
      // "M 100 200 L 200 100 -100 -200" instead).
      while (args.length >= ARG_LENGTH[type] && args.length && ARG_LENGTH[type]) {
        data.push([command].concat(args.splice(0, ARG_LENGTH[type])));
      }

      return '';
    });
    return data;
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
   * Work around for https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8438884/
   * @ignore
   */
  function supportsSvgPathArgument(window) {
    var canvas = window.document.createElement('canvas');
    var g = canvas.getContext('2d');
    var p = new window.Path2D('M0 0 L1 1');
    g.strokeStyle = 'red';
    g.lineWidth = 1;
    g.stroke(p);
    var imgData = g.getImageData(0, 0, 1, 1);
    return imgData.data[0] === 255; // Check if pixel is red
  }

  function rotatePoint(point, angle) {
    var nx = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    var ny = point.y * Math.cos(angle) + point.x * Math.sin(angle);
    point.x = nx;
    point.y = ny;
  }

  function translatePoint(point, dx, dy) {
    point.x += dx;
    point.y += dy;
  }

  function polyFillPath2D(window) {
    if (!window) {
      return;
    }
    if (window.Path2D && supportsSvgPathArgument(window)) {
      return;
    }

    /**
       * Crates a Path2D polyfill object
       * @constructor
       * @ignore
       * @param {String} path
       */

    var Path2D = function () {
      function Path2D(path) {
        classCallCheck(this, Path2D);

        this.segments = [];
        if (path && path instanceof Path2D) {
          var _segments;

          (_segments = this.segments).push.apply(_segments, toConsumableArray(path.segments));
        } else if (path) {
          this.segments = parse(path);
        }
      }

      createClass(Path2D, [{
        key: 'addPath',
        value: function addPath(path) {
          if (path && path instanceof Path2D) {
            var _segments2;

            (_segments2 = this.segments).push.apply(_segments2, toConsumableArray(path.segments));
          }
        }
      }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
          this.segments.push(['M', x, y]);
        }
      }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
          this.segments.push(['L', x, y]);
        }
      }, {
        key: 'arc',
        value: function arc(x, y, r, start, end, ccw) {
          this.segments.push(['AC', x, y, r, start, end, !!ccw]);
        }
      }, {
        key: 'arcTo',
        value: function arcTo(x1, y1, x2, y2, r) {
          this.segments.push(['AT', x1, y1, x2, y2, r]);
        }
      }, {
        key: 'closePath',
        value: function closePath() {
          this.segments.push(['Z']);
        }
      }, {
        key: 'bezierCurveTo',
        value: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
          this.segments.push(['C', cp1x, cp1y, cp2x, cp2y, x, y]);
        }
      }, {
        key: 'quadraticCurveTo',
        value: function quadraticCurveTo(cpx, cpy, x, y) {
          this.segments.push(['Q', cpx, cpy, x, y]);
        }
      }, {
        key: 'rect',
        value: function rect(x, y, width, height) {
          this.segments.push(['R', x, y, width, height]);
        }
      }]);
      return Path2D;
    }();

    var cFill = window.CanvasRenderingContext2D.prototype.fill;
    var cStroke = window.CanvasRenderingContext2D.prototype.stroke;

    function buildPath(canvas, segments) {
      var endAngle = void 0;
      var startAngle = void 0;
      var largeArcFlag = void 0;
      var sweepFlag = void 0;
      var endPoint = void 0;
      var angle = void 0;
      var x = void 0;
      var x1 = void 0;
      var y = void 0;
      var y1 = void 0;
      var r = void 0;
      var b = void 0;
      var w = void 0;
      var h = void 0;
      var pathType = void 0;
      var centerPoint = void 0;
      var cpx = void 0;
      var cpy = void 0;
      var qcpx = void 0;
      var qcpy = void 0;
      var ccw = void 0;
      var currentPoint = { x: 0, y: 0 };

      // Reset control point if command is not cubic
      if (pathType !== 'S' && pathType !== 's' && pathType !== 'C' && pathType !== 'c') {
        cpx = null;
        cpy = null;
      }

      if (pathType !== 'T' && pathType !== 't' && pathType !== 'Q' && pathType !== 'q') {
        qcpx = null;
        qcpy = null;
      }

      canvas.beginPath();
      for (var i = 0; i < segments.length; ++i) {
        var s = segments[i];
        pathType = s[0];
        switch (pathType) {
          case 'm':
            x += s[1];
            y += s[2];
            canvas.moveTo(x, y);
            break;
          case 'M':
            x = s[1];
            y = s[2];
            canvas.moveTo(x, y);
            break;
          case 'l':
            x += s[1];
            y += s[2];
            canvas.lineTo(x, y);
            break;
          case 'L':
            x = s[1];
            y = s[2];
            canvas.lineTo(x, y);
            break;
          case 'H':
            x = s[1];
            canvas.lineTo(x, y);
            break;
          case 'h':
            x += s[1];
            canvas.lineTo(x, y);
            break;
          case 'V':
            y = s[1];
            canvas.lineTo(x, y);
            break;
          case 'v':
            y += s[1];
            canvas.lineTo(x, y);
            break;
          case 'a':
          case 'A':
            if (pathType === 'a') {
              x += s[6];
              y += s[7];
            } else {
              x = s[6];
              y = s[7];
            }

            r = s[1];
            // s[2] = 2nd radius in ellipse, ignore
            // s[3] = rotation of ellipse, ignore
            largeArcFlag = s[4];
            sweepFlag = s[5];
            endPoint = { x: x, y: y };
            // translate all points so that currentPoint is origin
            translatePoint(endPoint, -currentPoint.x, -currentPoint.y);

            // angle to destination
            angle = Math.atan2(endPoint.y, endPoint.x);

            // rotate points so that angle is 0
            rotatePoint(endPoint, -angle);

            b = endPoint.x / 2;
            // var sweepAngle = Math.asin(b / r);

            centerPoint = { x: 0, y: 0 };
            centerPoint.x = endPoint.x / 2;
            if (sweepFlag && !largeArcFlag || !sweepFlag && largeArcFlag) {
              centerPoint.y = Math.sqrt(r * r - b * b);
            } else {
              centerPoint.y = -Math.sqrt(r * r - b * b);
            }
            startAngle = Math.atan2(-centerPoint.y, -centerPoint.x);
            endAngle = Math.atan2(endPoint.y - centerPoint.y, endPoint.x - centerPoint.x);

            // rotate back
            startAngle += angle;
            endAngle += angle;
            rotatePoint(endPoint, angle);
            rotatePoint(centerPoint, angle);

            // translate points
            translatePoint(endPoint, currentPoint.x, currentPoint.y);
            translatePoint(centerPoint, currentPoint.x, currentPoint.y);

            canvas.arc(centerPoint.x, centerPoint.y, r, startAngle, endAngle, !sweepFlag);
            break;
          case 'C':
            cpx = s[3]; // Last control point
            cpy = s[4];
            x = s[5];
            y = s[6];
            canvas.bezierCurveTo(s[1], s[2], cpx, cpy, x, y);
            break;
          case 'c':
            canvas.bezierCurveTo(s[1] + x, s[2] + y, s[3] + x, s[4] + y, s[5] + x, s[6] + y);
            cpx = s[3] + x; // Last control point
            cpy = s[4] + y;
            x += s[5];
            y += s[6];
            break;
          case 'S':
            if (cpx === null || cpx === null) {
              cpx = x;
              cpy = y;
            }

            canvas.bezierCurveTo(2 * x - cpx, 2 * y - cpy, s[1], s[2], s[3], s[4]);
            cpx = s[1]; // last control point
            cpy = s[2];
            x = s[3];
            y = s[4];
            break;
          case 's':
            if (cpx === null || cpx === null) {
              cpx = x;
              cpy = y;
            }

            canvas.bezierCurveTo(2 * x - cpx, 2 * y - cpy, s[1] + x, s[2] + y, s[3] + x, s[4] + y);
            cpx = s[1] + x; // last control point
            cpy = s[2] + y;
            x += s[3];
            y += s[4];
            break;
          case 'Q':
            qcpx = s[1]; // last control point
            qcpy = s[2];
            x = s[3];
            y = s[4];
            canvas.quadraticCurveTo(qcpx, qcpy, x, y);
            break;
          case 'q':
            qcpx = s[1] + x; // last control point
            qcpy = s[2] + y;
            x += s[3];
            y += s[4];
            canvas.quadraticCurveTo(qcpx, qcpy, x, y);
            break;
          case 'T':
            if (qcpx === null || qcpx === null) {
              qcpx = x;
              qcpy = y;
            }
            qcpx = 2 * x - qcpx; // last control point
            qcpy = 2 * y - qcpy;
            x = s[1];
            y = s[2];
            canvas.quadraticCurveTo(qcpx, qcpy, x, y);
            break;
          case 't':
            if (qcpx === null || qcpx === null) {
              qcpx = x;
              qcpy = y;
            }
            qcpx = 2 * x - qcpx; // last control point
            qcpy = 2 * y - qcpy;
            x += s[1];
            y += s[2];
            canvas.quadraticCurveTo(qcpx, qcpy, x, y);
            break;
          case 'z':
          case 'Z':
            canvas.closePath();
            break;
          case 'AC':
            // arc
            x = s[1];
            y = s[2];
            r = s[3];
            startAngle = s[4];
            endAngle = s[5];
            ccw = s[6];
            canvas.arc(x, y, r, startAngle, endAngle, ccw);
            break;
          case 'AT':
            // arcTo
            x1 = s[1];
            y1 = s[2];
            x = s[3];
            y = s[4];
            r = s[5];
            canvas.arcTo(x1, y1, x, y, r);
            break;
          case 'R':
            // rect
            x = s[1];
            y = s[2];
            w = s[3];
            h = s[4];
            canvas.rect(x, y, w, h);
            break;
          default:
          // throw new Error(`${pathType} is not implemented`); ?
        }

        currentPoint.x = x;
        currentPoint.y = y;
      }
    }

    window.CanvasRenderingContext2D.prototype.fill = function fill() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var fillRule = 'nonzero';
      if (args.length === 0 || args.length === 1 && typeof args[0] === 'string') {
        cFill.apply(this, args);
        return;
      }
      if (arguments.length === 2) {
        fillRule = args[1];
      }
      var path = args[0];
      buildPath(this, path.segments);
      cFill.call(this, fillRule);
    };

    window.CanvasRenderingContext2D.prototype.stroke = function stroke(path) {
      if (!path) {
        cStroke.call(this);
        return;
      }
      buildPath(this, path.segments);
      cStroke.call(this);
    };

    window.Path2D = Path2D;
  }

  if (typeof window !== 'undefined') {
    polyFillPath2D(window);
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

  var about = { version: '0.9.0' };

  var mixins = [];

  function add(mixin) {
    mixins.push(mixin);
  }

  function list() {
    return mixins;
  }

  /**
   * Initilize a new dock configuration
   * @private
   * @param {object} [settings] - Settings object
   * @returns {object} A dock configuration instance
   * @example
   * let instance = dockConfig({
   *  dock: 'left',
   *  displayOrder: 2,
   *  prioOrder: 1,
   *  requiredSize: () => 33,
   *  minimumLayoutMode: 'L',
   *  show: true
   * });
   */
  function dockConfig() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _settings$dock = settings.dock,
        dock = _settings$dock === undefined ? '' : _settings$dock,
        _settings$displayOrde = settings.displayOrder,
        displayOrder = _settings$displayOrde === undefined ? 0 : _settings$displayOrde,
        _settings$prioOrder = settings.prioOrder,
        prioOrder = _settings$prioOrder === undefined ? 0 : _settings$prioOrder,
        _settings$requiredSiz = settings.requiredSize,
        requiredSize = _settings$requiredSiz === undefined ? function () {
      return 0;
    } : _settings$requiredSiz,
        minimumLayoutMode = settings.minimumLayoutMode,
        _settings$show = settings.show,
        show = _settings$show === undefined ? true : _settings$show;

    /**
     * @private
     */

    var fn = function fn() {};

    /**
     * Takes a function that returns the required size of a component.
     * The return value of the function can either be a number representing the required size in the dock direction
     * or an object with a `size` and `edgeBleed` property.
     * @param {function} [calcFn] - Function to calculate the required size of a component
     * @returns {function|this} If no parameter is passed, the current requiredSize function is return. Else the current context is returns to allow chaining.
     * @example
     * dockConfig.requireSize(() => 150); // Require a size of 150 in the dock direction
     *
     * dockConfig.requireSize(() => ({
     *  size: 150,
     *  edgeBleed: {
     *    left: 50,
     *    right: 50
     *  }
     * })); // Require a size of 150 in the dock direction and a bleed size of 50 to the left and right dock direction
     */
    fn.requiredSize = function requiredSizeFn(calcFn) {
      if (typeof calcFn === 'function') {
        requiredSize = calcFn;
        return this;
      }
      return requiredSize;
    };

    /**
     * Set the dock direction, supported values are left | right | top | bottom. Any other value will be interpreted as center dock.
     * @param {string} [d=''] - Dock direction
     * @returns {this} The current context
     * @example
     * dockConfig.dock('left');
     */
    fn.dock = function dockFn(d) {
      if (typeof d === 'undefined') {
        return dock;
      }
      dock = d;
      return this;
    };

    /**
     * The `displayOrder` property is used by the layout engine to lay out components.
     * Components are interpreted in the ascending order of the `displayOrder` value. The layout engine apply the value in two ways,
     * the first is the order in which components are rendererd. The second is the area components are laid out in
     * when they have a direction, i.e. docked to either top, bottom, left or right.
     *
     * If docked at the same area, the component with a higher `displayOrder` will be rendered
     * on top of the component with a lower `displayOrder`. It can be seen as defining a z-index.
     * A lower `displayOrder` also means that a component will be laid out first in a given direction,
     * i.e. laid out closer to the central area (non-directional area) then a component with a higher `displayOrder`.
     * It can in this case be seen as the x-index or y-index.
     * @param {number} [order=0] - The display order
     * @returns {this} The current context
     * @example
     * dockConfig.displayOrder(99);
     */
    fn.displayOrder = function displayOrderFn(order) {
      if (typeof order === 'undefined') {
        return displayOrder;
      }
      displayOrder = order;
      return this;
    };

    /**
     * The `prioOrder` property is used to define the order in which components are added to the layout engine,
     * this is done before any components are laid out. When there is not enough space to add any more components
     * to a given area, all components not all ready added, are then discarded. The `prioOrder` is interpreted
     * in the ascending order. Such that a lower value is added to the layout engine first.
     * @param {number} [order=0] - The prio order
     * @returns {this} The current context
     * @example
     * dockConfig.prioOrder(-1);
     */
    fn.prioOrder = function prioOrderFn(order) {
      if (typeof order === 'undefined') {
        return prioOrder;
      }
      prioOrder = order;
      return this;
    };

    /**
     * Ger or set the minimumLayoutMode
     * @param {string|object} [s] - The minimum layout mode
     * @returns {string|object|this} If no parameter is passed the current context is returned, else the current layout mode.
     * @example
     * dockConfig.minimumLayoutMode('L');
     * dockConfig.minimumLayoutMode({ width: 'S', height: 'L' });
     */
    fn.minimumLayoutMode = function minimumLayoutModeFn(s) {
      if (typeof s === 'undefined') {
        return minimumLayoutMode;
      }
      minimumLayoutMode = s;
      return this;
    };

    /**
     * Set the component visibility. If false the component is not added to the layout engine.
     * @param {boolean} [s=true] - Toggle visibility
     * @returns {this} The current context
     */
    fn.show = function showFn(s) {
      if (typeof s === 'undefined') {
        return show;
      }
      show = !!s;
      return this;
    };

    return fn;
  }

  function roundRect(rect) {
    rect.x = Math.ceil(rect.x);
    rect.y = Math.ceil(rect.y);
    rect.width = Math.ceil(rect.width);
    rect.height = Math.ceil(rect.height);
  }

  function getRect(container, settings) {
    var containerRect = {
      x: 0, y: 0, width: 0, height: 0
    };
    var logicalContainerRect = {
      x: 0, y: 0, width: 0, height: 0
    };

    // Check input object for size
    if (typeof container.getBoundingClientRect === 'function') {
      var boundingRect = container.getBoundingClientRect();
      containerRect.width = boundingRect.width;
      containerRect.height = boundingRect.height;
    } else {
      containerRect.width = container.width || 0;
      containerRect.height = container.height || 0;
    }

    // Check settings defintion for size
    if (typeof settings.size !== 'undefined') {
      containerRect.width = isNaN(settings.size.width) ? containerRect.width : settings.size.width;
      containerRect.height = isNaN(settings.size.height) ? containerRect.height : settings.size.height;
    }

    if (typeof settings.logicalSize !== 'undefined') {
      logicalContainerRect.width = isNaN(settings.logicalSize.width) ? containerRect.width : settings.logicalSize.width;
      logicalContainerRect.height = isNaN(settings.logicalSize.height) ? containerRect.height : settings.logicalSize.height;
      logicalContainerRect.align = isNaN(settings.logicalSize.align) ? 0.5 : Math.min(Math.max(settings.logicalSize.align, 0), 1);
      logicalContainerRect.preserveAspectRatio = settings.logicalSize.preserveAspectRatio;
    } else {
      logicalContainerRect.width = containerRect.width;
      logicalContainerRect.height = containerRect.height;
      logicalContainerRect.preserveAspectRatio = false;
    }

    roundRect(logicalContainerRect);
    roundRect(containerRect);

    return [logicalContainerRect, containerRect];
  }

  function resolveLayout(container, settings) {
    return getRect(container, settings);
  }

  function resolveSettings(s) {
    var settings = {
      logicalSize: {
        preserveAspectRatio: false
      },
      center: {
        minWidthRatio: 0.5,
        minHeightRatio: 0.5,
        minWidth: 0,
        minHeight: 0
      }
    };

    extend(true, settings, s);

    settings.center.minWidthRatio = Math.min(Math.max(settings.center.minWidthRatio, 0), 1); // Only accept value between 0-1
    settings.center.minHeightRatio = Math.min(Math.max(settings.center.minHeightRatio, 0), 1); // Only accept value between 0-1
    settings.center.minWidth = Math.max(settings.center.minWidth, 0); // Consider <= 0 to be falsy and fallback to ratio
    settings.center.minHeight = Math.max(settings.center.minHeight, 0); // Consider <= 0 to be falsy and fallback to ratio

    return settings;
  }

  function isNumber(v) {
    return typeof v === 'number' && !isNaN(v);
  }

  function notNumber(value) {
    return typeof value !== 'number' || isNaN(value);
  }

  function getMinMax(points) {
    var num = points.length;
    var xMin = NaN;
    var xMax = NaN;
    var yMin = NaN;
    var yMax = NaN;

    for (var i = 0; i < num; i++) {
      xMin = isNaN(xMin) ? points[i].x : Math.min(xMin, points[i].x);
      xMax = isNaN(xMax) ? points[i].x : Math.max(xMax, points[i].x);
      yMin = isNaN(yMin) ? points[i].y : Math.min(yMin, points[i].y);
      yMax = isNaN(yMax) ? points[i].y : Math.max(yMax, points[i].y);
    }
    return [xMin, yMin, xMax, yMax];
  }

  /**
   * @ignore
   * @param {oject} line
   * @returns {point[]} Array of points
   */
  function lineToPoints(line) {
    var x1 = line.x1 || 0;
    var y1 = line.y1 || 0;
    var x2 = line.x2 || 0;
    var y2 = line.y2 || 0;
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }

  /**
   * @ignore
   * @param {oject} rect
   * @returns {point[]} Array of points
   */
  function rectToPoints(rect) {
    return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
  }

  function pointsToRect(points) {
    var _getMinMax = getMinMax(points),
        _getMinMax2 = slicedToArray(_getMinMax, 4),
        xMin = _getMinMax2[0],
        yMin = _getMinMax2[1],
        xMax = _getMinMax2[2],
        yMax = _getMinMax2[3];

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin,
      height: yMax - yMin
    };
  }

  function pointsToCircle(points, r) {
    return {
      cx: points[0].x,
      cy: points[0].y,
      r: r
    };
  }

  function pointsToLine(points) {
    return {
      x1: points[0].x,
      y1: points[0].y,
      x2: points[1].x,
      y2: points[1].y
    };
  }

  /**
   * @ignore
   * @param {oject}
   * @returns {string} Type of geometry
   */
  function getShapeType(shape) {
    var _ref = shape || {},
        x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height,
        x1 = _ref.x1,
        x2 = _ref.x2,
        y1 = _ref.y1,
        y2 = _ref.y2,
        cx = _ref.cx,
        cy = _ref.cy,
        r = _ref.r,
        vertices = _ref.vertices;

    if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
      return 'circle';
    } else if (isNumber(x1) && isNumber(x2) && isNumber(y1) && isNumber(y2)) {
      return 'line';
    } else if (isNumber(x) && isNumber(y) && isNumber(width) && isNumber(height)) {
      return 'rect';
    } else if (isNumber(x) && isNumber(y)) {
      return 'point';
    } else if (Array.isArray(vertices)) {
      return 'polygon';
    }
    return null;
  }

  function validateComponent(component) {
    var expectedProperties = ['resize'];

    expectedProperties.forEach(function (p) {
      if (typeof component[p] !== 'function') {
        throw new Error('Component is missing required function "' + p + '"');
      }
    });
  }

  function cacheSize(c, reducedRect, containerRect) {
    if (typeof c.cachedSize === 'undefined') {
      var size = c.config.requiredSize()(reducedRect, containerRect);
      if ((typeof size === 'undefined' ? 'undefined' : _typeof(size)) === 'object') {
        c.cachedSize = Math.ceil(size.size);
        c.edgeBleed = size.edgeBleed;
      } else {
        c.cachedSize = Math.ceil(size);
      }
    }
    return c.cachedSize;
  }

  function validateReduceRect(logicalContainerRect, reducedRect, settings) {
    // Absolute value for width/height should have predence over relative value
    var minReduceWidth = Math.min(settings.center.minWidth, logicalContainerRect.width) || Math.max(logicalContainerRect.width * settings.center.minWidthRatio, 1);
    var minReduceHeight = Math.min(settings.center.minHeight, logicalContainerRect.height) || Math.max(logicalContainerRect.height * settings.center.minHeightRatio, 1);
    return reducedRect.width >= minReduceWidth && reducedRect.height >= minReduceHeight;
  }

  function reduceDocRect(reducedRect, c) {
    switch (c.config.dock()) {
      case 'top':
        reducedRect.y += c.cachedSize;
        reducedRect.height -= c.cachedSize;
        break;
      case 'bottom':
        reducedRect.height -= c.cachedSize;
        break;
      case 'left':
        reducedRect.x += c.cachedSize;
        reducedRect.width -= c.cachedSize;
        break;
      case 'right':
        reducedRect.width -= c.cachedSize;
        break;
      default:
    }
  }
  function addEdgeBleed(currentEdgeBleed, c) {
    var edgeBleed = c.edgeBleed;
    if (!edgeBleed) {
      return;
    }
    currentEdgeBleed.left = Math.max(currentEdgeBleed.left, edgeBleed.left || 0);
    currentEdgeBleed.right = Math.max(currentEdgeBleed.right, edgeBleed.right || 0);
    currentEdgeBleed.top = Math.max(currentEdgeBleed.top, edgeBleed.top || 0);
    currentEdgeBleed.bottom = Math.max(currentEdgeBleed.bottom, edgeBleed.bottom || 0);
  }
  function reduceEdgeBleed(logicalContainerRect, reducedRect, edgeBleed) {
    if (reducedRect.x < edgeBleed.left) {
      reducedRect.width -= edgeBleed.left - reducedRect.x;
      reducedRect.x = edgeBleed.left;
    }
    var reducedRectRightBoundary = logicalContainerRect.width - (reducedRect.x + reducedRect.width);
    if (reducedRectRightBoundary < edgeBleed.right) {
      reducedRect.width -= edgeBleed.right - reducedRectRightBoundary;
    }
    if (reducedRect.y < edgeBleed.top) {
      reducedRect.height -= edgeBleed.top - reducedRect.y;
      reducedRect.y = edgeBleed.top;
    }
    var reducedRectBottomBoundary = logicalContainerRect.height - (reducedRect.y + reducedRect.height);
    if (reducedRectBottomBoundary < edgeBleed.bottom) {
      reducedRect.height -= edgeBleed.bottom - reducedRectBottomBoundary;
    }
  }

  function reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c, settings) {
    var newReduceRect = extend({}, reducedRect);
    var newEdgeBeed = extend({}, edgeBleed);
    reduceDocRect(newReduceRect, c);
    addEdgeBleed(newEdgeBeed, c);
    reduceEdgeBleed(logicalContainerRect, newReduceRect, newEdgeBeed);

    var isValid = validateReduceRect(logicalContainerRect, newReduceRect, settings);
    if (!isValid) {
      return false;
    }

    reduceDocRect(reducedRect, c);
    addEdgeBleed(edgeBleed, c);
    return true;
  }

  function reduceLayoutRect(logicalContainerRect, components, hiddenComponents, settings) {
    var reducedRect = {
      x: logicalContainerRect.x,
      y: logicalContainerRect.y,
      width: logicalContainerRect.width,
      height: logicalContainerRect.height
    };
    var edgeBleed = {
      left: 0, right: 0, top: 0, bottom: 0
    };

    var sortedComponents = components.slice();
    sortedComponents.sort(function (a, b) {
      return a.config.prioOrder() - b.config.prioOrder();
    }); // lower prioOrder will have higher prio

    for (var i = 0; i < sortedComponents.length; ++i) {
      var c = sortedComponents[i];
      cacheSize(c, reducedRect, logicalContainerRect);

      if (!reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c, settings)) {
        sortedComponents.splice(i, 1);
        hiddenComponents.push(c.instance);
        --i;
      }
    }

    var filteredUnsortedComps = components.filter(function (c) {
      return sortedComponents.indexOf(c) !== -1;
    });
    components.length = 0;
    components.push.apply(components, toConsumableArray(filteredUnsortedComps));
    reduceEdgeBleed(logicalContainerRect, reducedRect, edgeBleed);
    return reducedRect;
  }

  function appendScaleRatio(rect, outerRect, logicalContainerRect, containerRect) {
    var scaleRatio = {
      x: containerRect.width / logicalContainerRect.width,
      y: containerRect.height / logicalContainerRect.height
    };
    var margin = {
      left: 0,
      top: 0
    };

    if (logicalContainerRect.preserveAspectRatio) {
      var xLessThenY = scaleRatio.x < scaleRatio.y;
      // To preserve the aspect ratio, take the smallest ratio and apply in both directions to "meet" the size of the container
      var minRatio = Math.min(scaleRatio.x, scaleRatio.y);
      scaleRatio.x = minRatio;
      scaleRatio.y = minRatio;
      var area = xLessThenY ? 'height' : 'width';
      var spread = (containerRect[area] - logicalContainerRect[area] * scaleRatio.x) * logicalContainerRect.align;
      margin.left = xLessThenY ? 0 : spread;
      margin.top = xLessThenY ? spread : 0;
    }

    rect.scaleRatio = scaleRatio;
    rect.margin = margin;
    outerRect.scaleRatio = scaleRatio;
    outerRect.margin = margin;
    logicalContainerRect.scaleRatio = scaleRatio;
    logicalContainerRect.margin = margin;
  }

  function boundingBox(rects) {
    var _ref;

    var points = (_ref = []).concat.apply(_ref, toConsumableArray(rects.map(rectToPoints)));
    return pointsToRect(points);
  }

  function positionComponents(components, logicalContainerRect, reducedRect, containerRect) {
    var vRect = {
      x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height
    };
    var hRect = {
      x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height
    };

    var referencedComponents = {};

    components.sort(function (a, b) {
      if (/^@/.test(b.config.dock())) {
        return -1;
      } else if (/^@/.test(a.config.dock())) {
        return 1;
      }
      return a.config.displayOrder() - b.config.displayOrder();
    }).forEach(function (c) {
      var outerRect = {};
      var rect = {};
      var d = c.config.dock();
      switch (d) {
        case 'top':
          outerRect.height = rect.height = c.cachedSize;
          outerRect.width = logicalContainerRect.width;
          rect.width = vRect.width;
          outerRect.x = logicalContainerRect.x;
          rect.x = vRect.x;
          outerRect.y = rect.y = vRect.y - c.cachedSize;

          vRect.y -= c.cachedSize;
          vRect.height += c.cachedSize;
          break;
        case 'bottom':
          outerRect.x = logicalContainerRect.x;
          rect.x = vRect.x;
          outerRect.y = rect.y = vRect.y + vRect.height;
          outerRect.width = logicalContainerRect.width;
          rect.width = vRect.width;
          outerRect.height = rect.height = c.cachedSize;

          vRect.height += c.cachedSize;
          break;
        case 'left':
          outerRect.x = rect.x = hRect.x - c.cachedSize;
          outerRect.y = logicalContainerRect.y;
          rect.y = hRect.y;
          outerRect.width = rect.width = c.cachedSize;
          outerRect.height = logicalContainerRect.height;
          rect.height = hRect.height;

          hRect.x -= c.cachedSize;
          hRect.width += c.cachedSize;
          break;
        case 'right':
          outerRect.x = rect.x = hRect.x + hRect.width;
          outerRect.y = logicalContainerRect.y;
          rect.y = hRect.y;
          outerRect.width = rect.width = c.cachedSize;
          outerRect.height = logicalContainerRect.height;
          rect.height = hRect.height;

          hRect.width += c.cachedSize;
          break;
        default:
          outerRect.x = rect.x = reducedRect.x;
          outerRect.y = rect.y = reducedRect.y;
          outerRect.width = rect.width = reducedRect.width;
          outerRect.height = rect.height = reducedRect.height;
      }
      if (/^@/.test(d)) {
        var refs = d.split(',').map(function (r) {
          return referencedComponents[r.replace('@', '')];
        }).filter(function (r) {
          return !!r;
        });
        if (refs.length > 0) {
          outerRect = boundingBox(refs.map(function (r) {
            return r.outerRect;
          }));
          rect = boundingBox(refs.map(function (r) {
            return r.rect;
          }));
        }
      } else if (c.key) {
        referencedComponents[c.key] = { // store the size of this component
          rect: rect,
          outerRect: outerRect
        };
      }
      appendScaleRatio(rect, outerRect, logicalContainerRect, containerRect);
      c.instance.resize(rect, outerRect, logicalContainerRect);
      c.cachedSize = undefined;
    });
  }

  function checkShowSettings(components, hiddenComponents, settings, logicalContainerRect) {
    var layoutModes = settings.layoutModes || {};
    for (var i = 0; i < components.length; ++i) {
      var c = components[i];
      var minimumLayoutMode = c.config.minimumLayoutMode();
      var show = c.config.show();
      if (show && (typeof minimumLayoutMode === 'undefined' ? 'undefined' : _typeof(minimumLayoutMode)) === 'object') {
        show = layoutModes[minimumLayoutMode.width] && layoutModes[minimumLayoutMode.height] && logicalContainerRect.width >= layoutModes[minimumLayoutMode.width].width && logicalContainerRect.height >= layoutModes[minimumLayoutMode.height].height;
      } else if (show && minimumLayoutMode !== undefined) {
        show = layoutModes[minimumLayoutMode] && logicalContainerRect.width >= layoutModes[minimumLayoutMode].width && logicalContainerRect.height >= layoutModes[minimumLayoutMode].height;
      }
      if (!show) {
        components.splice(i, 1);
        hiddenComponents.push(c.instance);
        --i;
      }
    }
  }

  /**
   * @typedef {object} dock-layout-settings
   * @property {object} [size] - Physical size. Defaults to the container element.
   * @property {number} [size.width] - Width in pixels
   * @property {number} [size.height]- Height in pixels
   * @property {object} [logicalSize] - Logical size
   * @property {number} [logicalSize.width] - Width in pixels
   * @property {number} [logicalSize.height] - Height in pixels
   * @property {boolean} [logicalSize.preserveAspectRatio=false] - If true, takes the smallest ratio of width/height between logical and physical size ( physical / logical )
   * @property {number} [logicalSize.align=0.5] - Normalized value between 0-1. Defines how the space around the scaled axis is spread in the container, with 0.5 meaning the spread is equal on both sides. Only applicable if preserveAspectRatio is set to true
   * @property {object} [center] - Define how much space the center dock area requires
   * @property {number} [center.minWidthRatio=0.5] - Value between 0 and 1
   * @property {number} [center.minHeightRatio=0.5] - Value between 0 and 1
   * @property {number} [center.minWidth] - Width in pixels
   * @property {number} [center.minHeight] - Height in pixels
   * @property {object<string, {width: number, height: number}>} [layoutModes] Dictionary with named sizes
   */

  function dockLayout(initialSettings) {
    var components = [];
    var hiddenComponents = [];
    var settings = resolveSettings(initialSettings);

    var docker = function docker() {};

    docker.addComponent = function addComponent(component, key) {
      validateComponent(component);
      docker.removeComponent(component);

      // component.dockConfig can be undefined, a function or an object:
      // if undefined: use default values from dockConfig()
      // if function: use the function
      // if object: wrap in dockConfig() function
      components.push({
        instance: component,
        key: key,
        config: typeof component.dockConfig === 'function' ? component.dockConfig : dockConfig(component.dockConfig)
      });
    };

    docker.removeComponent = function removeComponent(component) {
      var idx = components.map(function (c) {
        return c.instance;
      }).indexOf(component);
      if (idx > -1) {
        components.splice(idx, 1);
      }
    };

    docker.layout = function layout(container) {
      var _resolveLayout = resolveLayout(container, settings),
          _resolveLayout2 = slicedToArray(_resolveLayout, 2),
          logicalContainerRect = _resolveLayout2[0],
          containerRect = _resolveLayout2[1];

      checkShowSettings(components, hiddenComponents, settings, logicalContainerRect);
      var reduced = reduceLayoutRect(logicalContainerRect, components, hiddenComponents, settings);
      positionComponents(components, logicalContainerRect, reduced, containerRect);
      return {
        visible: components.map(function (c) {
          return c.instance;
        }),
        hidden: hiddenComponents
      };
    };

    docker.settings = function settingsFn(s) {
      settings = resolveSettings(s);
    };

    return docker;
  }

  function detectTouchSupport(e) {
    if ('ontouchstart' in e && 'ontouchend' in e) {
      return true;
    }
    return false;
  }

  function isTouchEvent(e) {
    return !!e.changedTouches;
  }

  function isValidTapEvent(e, eventInfo) {
    var isTouch = isTouchEvent(e);
    var ee = isTouch ? e.changedTouches[0] : e;
    var dt = Date.now() - eventInfo.time;
    var dx = isNaN(eventInfo.x) ? 0 : Math.abs(ee.clientX - eventInfo.x);
    var dy = isNaN(eventInfo.y) ? 0 : Math.abs(ee.clientY - eventInfo.y);

    return (e.button === 0 || isTouch) && !eventInfo.multiTouch && dx <= 12 && dy <= 12 && dt <= 300;
  }

  // import types from './types';

  /**
   * @ignore
   * @param {Array<data-source>} dataSources
   * @param {any} { logger }
   * @returns {function}
   */
  function datasets(dataSources, _ref) {
    var types = _ref.types,
        logger = _ref.logger;

    var data = {};

    var sets = [];
    if (!Array.isArray(dataSources)) {
      logger.warn('Deprecated: "data-source" configuration"');
      sets.push(dataSources);
    } else {
      sets.push.apply(sets, toConsumableArray(dataSources));
    }

    sets.forEach(function (d, i) {
      var datasetFactory = types(d.type);
      if (datasetFactory) {
        var key = d.key || i;
        var dataset = datasetFactory({
          key: key,
          data: d.data,
          config: d.config
        });
        data[d.key || i] = dataset;
      }
    });

    /**
     * Returns the `dataset` which has `key` as identifier
     * @ignore
     * @param {string} key - The dataset identifier
     * @returns {dataset}
     */
    var fn = function fn(key) {
      if (key) {
        return data[key];
      }
      return data[Object.keys(data)[0]];
    };
    return fn;
  }

  var pi = Math.PI,
      tau = 2 * pi,
      epsilon = 1e-6,
      tauEpsilon = tau - epsilon;

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
      else if (!(l01_2 > epsilon)) ;

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
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
              if (Math.abs(t01 - 1) > epsilon) {
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
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
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
      else if (da > epsilon) {
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

  function constant (x) {
    return function constant() {
      return x;
    };
  }

  var abs = Math.abs;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var max = Math.max;
  var min = Math.min;
  var sin = Math.sin;
  var sqrt = Math.sqrt;

  var epsilon$1 = 1e-12;
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
        lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
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
        d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
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
        cornerRadius = constant(0),
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
      if (!(r1 > epsilon$1)) context.moveTo(0, 0);

      // Or is it a circle or annulus?
      else if (da > tau$1 - epsilon$1) {
          context.moveTo(r1 * cos(a0), r1 * sin(a0));
          context.arc(0, 0, r1, a0, a1, !cw);
          if (r0 > epsilon$1) {
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
                rp = ap > epsilon$1 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
                rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
                rc0 = rc,
                rc1 = rc,
                t0,
                t1;

            // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
            if (rp > epsilon$1) {
              var p0 = asin(rp / r0 * sin(ap)),
                  p1 = asin(rp / r1 * sin(ap));
              if ((da0 -= p0 * 2) > epsilon$1) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
              if ((da1 -= p1 * 2) > epsilon$1) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
            }

            var x01 = r1 * cos(a01),
                y01 = r1 * sin(a01),
                x10 = r0 * cos(a10),
                y10 = r0 * sin(a10);

            // Apply rounded corners?
            if (rc > epsilon$1) {
              var x11 = r1 * cos(a11),
                  y11 = r1 * sin(a11),
                  x00 = r0 * cos(a00),
                  y00 = r0 * sin(a00);

              // Restrict the corner radius according to the sector angle.
              if (da < pi$1) {
                var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                    ax = x01 - oc[0],
                    ay = y01 - oc[1],
                    bx = x11 - oc[0],
                    by = y11 - oc[1],
                    kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                    lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
                rc0 = min(rc, (r0 - lc) / (kc - 1));
                rc1 = min(rc, (r1 - lc) / (kc + 1));
              }
            }

            // Is the sector collapsed to a line?
            if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

            // Does the sector’s outer ring have rounded corners?
            else if (rc1 > epsilon$1) {
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
            if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

            // Does the sector’s inner ring (or point) have rounded corners?
            else if (rc0 > epsilon$1) {
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
      return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant(+_), arc) : innerRadius;
    };

    arc.outerRadius = function (_) {
      return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant(+_), arc) : outerRadius;
    };

    arc.cornerRadius = function (_) {
      return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant(+_), arc) : cornerRadius;
    };

    arc.padRadius = function (_) {
      return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant(+_), arc) : padRadius;
    };

    arc.startAngle = function (_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), arc) : startAngle;
    };

    arc.endAngle = function (_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), arc) : endAngle;
    };

    arc.padAngle = function (_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), arc) : padAngle;
    };

    arc.context = function (_) {
      return arguments.length ? (context = _ == null ? null : _, arc) : context;
    };

    return arc;
  }

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

  function curveLinear (context) {
    return new Linear(context);
  }

  function x(p) {
    return p[0];
  }

  function y(p) {
    return p[1];
  }

  function line () {
    var x$$1 = x,
        y$$1 = y,
        defined = constant(true),
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
      return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant(+_), line) : x$$1;
    };

    line.y = function (_) {
      return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant(+_), line) : y$$1;
    };

    line.defined = function (_) {
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), line) : defined;
    };

    line.curve = function (_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
    };

    line.context = function (_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
    };

    return line;
  }

  function area () {
    var x0 = x,
        x1 = null,
        y0 = constant(0),
        y1 = y,
        defined = constant(true),
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
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), x1 = null, area) : x0;
    };

    area.x0 = function (_) {
      return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), area) : x0;
    };

    area.x1 = function (_) {
      return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : x1;
    };

    area.y = function (_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), y1 = null, area) : y0;
    };

    area.y0 = function (_) {
      return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), area) : y0;
    };

    area.y1 = function (_) {
      return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant(+_), area) : y1;
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
      return arguments.length ? (defined = typeof _ === "function" ? _ : constant(!!_), area) : defined;
    };

    area.curve = function (_) {
      return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
    };

    area.context = function (_) {
      return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
    };

    return area;
  }

  function descending (a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function identity (d) {
    return d;
  }

  function pie () {
    var value = identity,
        sortValues = descending,
        sort = null,
        startAngle = constant(0),
        endAngle = constant(tau$1),
        padAngle = constant(0);

    function pie(data) {
      var i,
          n = data.length,
          j,
          k,
          sum = 0,
          index = new Array(n),
          arcs = new Array(n),
          a0 = +startAngle.apply(this, arguments),
          da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
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
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
    };

    pie.sortValues = function (_) {
      return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
    };

    pie.sort = function (_) {
      return arguments.length ? (sort = _, sortValues = null, pie) : sort;
    };

    pie.startAngle = function (_) {
      return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
    };

    pie.endAngle = function (_) {
      return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
    };

    pie.padAngle = function (_) {
      return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
    };

    return pie;
  }

  var slice = Array.prototype.slice;

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

  function curveBasis (context) {
    return new Basis(context);
  }

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

  function _point$2(that, x, y) {
    var x1 = that._x1,
        y1 = that._y1,
        x2 = that._x2,
        y2 = that._y2;

    if (that._l01_a > epsilon$1) {
      var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
          n = 3 * that._l01_a * (that._l01_a + that._l12_a);
      x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
      y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
    }

    if (that._l23_a > epsilon$1) {
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

  function curveNatural (context) {
    return new Natural(context);
  }

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

  function curveStep (context) {
    return new Step(context, 0.5);
  }

  function stepBefore(context) {
    return new Step(context, 0);
  }

  function stepAfter(context) {
    return new Step(context, 1);
  }

  function none (series, order) {
    if (!((n = series.length) > 1)) return;
    for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
      s0 = s1, s1 = series[order[i]];
      for (j = 0; j < m; ++j) {
        s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
      }
    }
  }

  function none$1 (series) {
    var n = series.length,
        o = new Array(n);
    while (--n >= 0) {
      o[n] = n;
    }return o;
  }

  function stackValue(d, key) {
    return d[key];
  }

  function stack () {
    var keys = constant([]),
        order = none$1,
        offset = none,
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
      return arguments.length ? (keys = typeof _ === "function" ? _ : constant(slice.call(_)), stack) : keys;
    };

    stack.value = function (_) {
      return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
    };

    stack.order = function (_) {
      return arguments.length ? (order = _ == null ? none$1 : typeof _ === "function" ? _ : constant(slice.call(_)), stack) : order;
    };

    stack.offset = function (_) {
      return arguments.length ? (offset = _ == null ? none : _, stack) : offset;
    };

    return stack;
  }

  function stackOffsetExpand (series, order) {
    if (!((n = series.length) > 0)) return;
    for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
      for (y = i = 0; i < n; ++i) {
        y += series[i][j][1] || 0;
      }if (y) for (i = 0; i < n; ++i) {
        series[i][j][1] /= y;
      }
    }
    none(series, order);
  }

  function stackOffsetDiverging (series, order) {
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
  }

  function stackOffsetSilhouette (series, order) {
    if (!((n = series.length) > 0)) return;
    for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
      for (var i = 0, y = 0; i < n; ++i) {
        y += series[i][j][1] || 0;
      }s0[j][1] += s0[j][0] = -y / 2;
    }
    none(series, order);
  }

  function stackOffsetWiggle (series, order) {
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
    none(series, order);
  }

  function ascending (series) {
    var sums = series.map(sum);
    return none$1(series).sort(function (a, b) {
      return sums[a] - sums[b];
    });
  }

  function sum(series) {
    var s = 0,
        i = -1,
        n = series.length,
        v;
    while (++i < n) {
      if (v = +series[i][1]) s += v;
    }return s;
  }

  function stackOrderInsideOut (series) {
    var n = series.length,
        i,
        j,
        sums = series.map(sum),
        order = none$1(series).sort(function (a, b) {
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
  }

  function stackOrderReverse (series) {
    return none$1(series).reverse();
  }

  function registryFactory(parentRegistry) {
    var defaultValue = void 0;
    var reg = {};
    var parent = parentRegistry || {
      get: function get() {
        return undefined;
      },
      has: function has() {
        return false;
      },
      default: function _default() {
        return undefined;
      }
    };

    defaultValue = parent.default();

    /**
     * @private
     * @param {string} key
     * @param {any} value
     * @throws {TypeError} Key must be a non-empty string
     * @returns {boolean} False if the given key already exists, true otherwise
     * @example
     * var r = registry();
     * r.add( "marker", function(args) {
     *   return new markers[args.type](args);
     * });
     *
     */
    function add(key, value) {
      if (!key || typeof key !== 'string') {
        throw new TypeError('Invalid argument: key must be a non-empty string');
      }
      if (key in reg) {
        return false;
      }
      reg[key] = value;
      return true;
    }

    function get(key) {
      return reg[key] || parent.get(key);
    }

    function has(key) {
      return !!reg[key] || parent.has(key);
    }

    function remove(key) {
      var d = reg[key];
      delete reg[key];
      return d;
    }

    function getKeys() {
      return Object.keys(reg);
    }

    function getValues() {
      return Object.keys(reg).map(function (key) {
        return reg[key];
      });
    }

    function deflt(d) {
      if (typeof d !== 'undefined') {
        defaultValue = d;
      }
      return defaultValue;
    }

    /**
     * @alias registry
     * @interface
     * @param {string} key
     * @param {any} value
     */
    function registry(key, value) {
      if (typeof value !== 'undefined') {
        return add(key, value);
      }
      return get(key || defaultValue);
    }

    registry.add = add;
    registry.get = get;
    registry.has = has;
    registry.remove = remove;
    registry.getKeys = getKeys;
    registry.getValues = getValues;
    registry.default = deflt;
    registry.register = add; // deprecated

    return registry;
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

  function identity$1 (x) {
    return x;
  }

  var prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

  function formatLocale (locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
        currency = locale.currency,
        decimal = locale.decimal,
        numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$1,
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

  function formatter(pattern, thousand, decimal) {
    var locale = void 0,
        d3format = void 0;

    /**
     * Format a value according to the specified pattern created at construct
     * @private
     *
     * @param  {Number} value   The number to be formatted
     * @return {String}         [description]
     */
    function format$$1(value) {
      return d3format(value);
    }

    /**
      * Set the locale for the formatter
      *
      * @param  {Object} args   Locale object for formatting
      * @return {Undefined}      Returns nothing
      */
    format$$1.locale = function localeFn(settings) {
      locale = formatLocale(settings);
      d3format = locale.format(pattern);

      return this;
    };

    /**
     * Resets the formatter using format.locale
     * @ignore
     */
    function reset() {
      format$$1.locale({
        decimal: decimal || '.',
        thousands: thousand || ',',
        grouping: [3],
        currency: ['$', '']
      });
    }
    reset();

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
    format$$1.format = function formatFn(p, v, t, d) {
      if (t || d) {
        thousand = t;
        decimal = d;
        reset();
      }
      return locale.format(p)(v);
    };

    /**
     * Change the pattern on existing formatter
     *
     * @param  {String} p     Pattern (optional)
     * @return {String}       Returns the pattern
     */
    format$$1.pattern = function patternFn(p) {
      if (p) {
        pattern = p;
        d3format = locale.format(p);
      }
      return pattern;
    };

    return format$$1;
  }

  var t0 = new Date(),
      t1 = new Date();

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
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
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

  function formatter$1(pattern) {
    // eslint-disable-line import/prefer-default-export
    var locale = formatLocale$1({
      dateTime: '%x, %X',
      date: '%-m/%-d/%Y',
      time: '%-I:%M:%S %p',
      periods: ['AM', 'PM'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    });

    var d3format = locale.format(pattern);

    /**
     * Format a value according to the specified pattern created at construct
     *
     * @param  {Date} value   The number to be formatted
     * @return {String}         [description]
     * @private
     */
    function format(value) {
      return d3format(value);
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
      return locale.format(p)(v);
    };

    /**
     * Set the locale for the formatter
     *
     * @param  {Object} args   Locale object for formatting
     * @return {Undefined}      Returns nothing
     */
    format.locale = function localeFn() {
      locale = formatLocale$1.apply(undefined, arguments);
      d3format = locale.format(pattern);

      return this;
    };

    /**
     * Parse a string to a date according to a pattern
     *
     * @param  {String} p   Pattern
     * @param  {String} v   Value
     * @return {Date}     Date
     */
    format.parse = function parse(p, v) {
      return locale.parse(p)(v);
    };

    /**
     * Returns a parser that parses strings to date according to the pattern
     *
     * @param  {String} p   Pattern
     * @return {Function}   Parser
     */
    format.parsePattern = function parsePattern(p) {
      return locale.parse(p);
    };

    return format;
  }

  var formatterRegistry = registryFactory();

  formatterRegistry('d3-number', formatter);
  formatterRegistry('d3-time', formatter$1);

  // TODO - decide whether usage of .call() is appropriate when invoking accessors, if yes then arrow functions are not allowed!

  var getFormatter = function getFormatter(data) {
    if (typeof data.formatter === 'function') {
      return data.formatter();
    }
    var f = data.formatter || {};
    return formatterRegistry(f.type || 'd3-number')(f.format || '');
  };

  var accessors = {
    id: function id(data) {
      return data.source + '/' + (data.key || data.title);
    },
    key: function key(data) {
      return String(data.key || data.title);
    },
    tags: function tags(data) {
      return data.tags;
    },
    min: function min(data) {
      return data.min;
    },
    max: function max(data) {
      return data.max;
    },
    type: function type(data) {
      return data.type;
    },
    title: function title(data) {
      return String(data.title);
    },
    values: function values(data) {
      return data.values;
    },
    value: function value(v) {
      return v;
    },
    label: function label(v) {
      return v;
    },
    formatter: function formatter(data) {
      return getFormatter(data);
    }
  };

  /**
   * Create a new field with default settings
   * @ignore
   * @return {field} Data field
   */
  function field(data) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$id = _ref.id,
        _id = _ref$id === undefined ? accessors.id : _ref$id,
        _ref$key = _ref.key,
        _key = _ref$key === undefined ? accessors.key : _ref$key,
        _ref$min = _ref.min,
        _min = _ref$min === undefined ? accessors.min : _ref$min,
        _ref$max = _ref.max,
        _max = _ref$max === undefined ? accessors.max : _ref$max,
        _ref$type = _ref.type,
        _type = _ref$type === undefined ? accessors.type : _ref$type,
        _ref$tags = _ref.tags,
        _tags = _ref$tags === undefined ? accessors.tags : _ref$tags,
        _ref$title = _ref.title,
        _title = _ref$title === undefined ? accessors.title : _ref$title,
        _ref$values = _ref.values,
        values = _ref$values === undefined ? accessors.values : _ref$values,
        _ref$value = _ref.value,
        value = _ref$value === undefined ? accessors.value : _ref$value,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? accessors.label : _ref$label,
        _ref$formatter = _ref.formatter,
        _formatter = _ref$formatter === undefined ? accessors.formatter : _ref$formatter;

    /**
     * @alias field
     */
    var f = {

      /**
       * Returns this field's id
       * @returns {string}
       */
      id: function id() {
        return _id(data);
      },

      /**
       * Returns this field's key
       * @returns {string}
       */
      key: function key() {
        return _key(data);
      },

      /**
       * Returns the input data
       * @returns {any}
       */
      raw: function raw() {
        return data;
      },
      /**
       * Returns the tags.
       * @return {Array<string>}
       */
      tags: function tags() {
        return _tags(data);
      },

      /**
       * Returns this field's type: 'dimension' or 'measure'.
       * @return {string}
       */
      type: function type() {
        return _type(data);
      },

      /**
       * Returns the min value of this field.
       * @return {number}
       */
      min: function min() {
        return _min(data);
      },

      /**
       * Returns the max value of this field.
       * @return {number}
       */
      max: function max() {
        return _max(data);
      },

      /**
       * Returns this field's title.
       * @return {string}
       */
      title: function title() {
        return _title(data);
      },

      /**
       * Returns the values of this field.
       * @return {Array<datum-extract>}
       */
      items: function items() {
        return values(data);
      },

      /**
       * Returns a formatter adapted to the content of this field.
       */
      formatter: function formatter() {
        return _formatter(data);
      },

      value: value,
      label: label
    };

    return f;
  }

  var OFFSETS = {
    diverging: stackOffsetDiverging,
    none: none,
    silhouette: stackOffsetSilhouette,
    expand: stackOffsetExpand,
    wiggle: stackOffsetWiggle
  };

  var ORDERS = {
    ascending: ascending,
    insideout: stackOrderInsideOut,
    none: none$1,
    reverse: stackOrderReverse
  };

  function stacked(data, config, ds) {
    var stackIds = {};
    var stackFn = config.stackKey;
    var valueFn = config.value;
    var startProp = config.startProp || 'start';
    var endProp = config.endProp || 'end';
    var offset = config.offset || 'none';
    var order = config.order || 'none';
    var valueRef = config.valueRef || '';

    var maxStackCount = 0;

    var valueFields = {};

    for (var i = 0; i < data.items.length; i++) {
      var p = data.items[i];
      var sourceField = valueRef ? p[valueRef] : null;
      if (sourceField && sourceField.source) {
        var ff = (sourceField.source.key || '') + '/' + sourceField.source.field;
        if (!valueFields[ff]) {
          valueFields[ff] = sourceField.source;
        }
      }
      var sid = stackFn(p);
      stackIds[sid] = stackIds[sid] || { items: [] };
      stackIds[sid].items.push(p);

      maxStackCount = Math.max(maxStackCount, stackIds[sid].items.length);
    }

    var keys = Array.apply(null, { length: maxStackCount }).map(Number.call, Number); // eslint-disable-line
    var matrix = Object.keys(stackIds).map(function (sid) {
      return stackIds[sid].items;
    });

    var d3Stack = stack().keys(keys).value(function (s, key) {
      return s[key] ? valueFn(s[key]) : 0;
    }).order(ORDERS[order]).offset(OFFSETS[offset]);

    var series = d3Stack(matrix);
    var values = [];

    for (var _i = 0; _i < series.length; _i++) {
      var serie = series[_i];
      for (var s = 0; s < serie.length; s++) {
        var range = serie[s];
        var item = serie[s].data[serie.key];
        if (!item) {
          continue;
        }
        item[startProp] = { value: range[0] };
        item[endProp] = { value: range[1] };
        values.push(range[0], range[1]);
      }
    }

    var stackedFields = Object.keys(valueFields).map(function (f) {
      var dSource = ds(valueFields[f].key);
      return dSource ? dSource.field(valueFields[f].field) : null;
    }).filter(function (f) {
      return !!f;
    });

    var field$$1 = field({
      title: stackedFields.map(function (f) {
        return f.title();
      }).join(', '),
      min: Math.min.apply(Math, values),
      max: Math.max.apply(Math, values),
      type: 'measure',
      formatter: stackedFields[0] ? stackedFields[0].formatter : undefined
    });
    data.fields.push(field$$1);
  }

  function extract(dataConfig) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var extracted = {
      // items: [],
      // fields: [],
      // source: null,
      // value: null,
      // label: null,
      // children: null,
      // root: null,
      // graph: null
    };

    var logger = opts.logger;

    if (Array.isArray(dataConfig)) {
      // if data is an array, assume it's manual data input -> normalize
      extracted.items = dataConfig.map(function (v) {
        return { value: v, label: String(v) };
      });
    } else if (dataConfig) {
      if ('collection' in dataConfig) {
        return data.collection(dataConfig.collection);
      }
      var source = data.dataset ? data.dataset(dataConfig.source) : null;
      var valueFn = dataConfig.value || function (d) {
        return d;
      };
      var labelFn = dataConfig.label || function (d) {
        return d;
      };
      if (dataConfig.groupBy || dataConfig.mapTo) {
        // DEPRECATION
        logger.warn('Deprecated "data" configuration', dataConfig);
        extracted.items = [];
      } else if (dataConfig.hierarchy) {
        extracted.root = source.hierarchy ? source.hierarchy(dataConfig.hierarchy) : null;
      } else if (dataConfig.items) {
        extracted.items = dataConfig.items.map(function (v) {
          return { value: valueFn(v), label: String(labelFn(v)) };
        });
      } else if (dataConfig.extract) {
        var extractionsConfigs = Array.isArray(dataConfig.extract) ? dataConfig.extract : [dataConfig.extract];
        extracted.items = [];
        var sourceFields = [];
        extractionsConfigs.forEach(function (cfg) {
          var _extracted$items;

          var s = cfg.source ? data.dataset(cfg.source) : source;
          if (!s) {
            return;
          }
          (_extracted$items = extracted.items).push.apply(_extracted$items, toConsumableArray(s.extract(cfg)));
          if (typeof cfg.field !== 'undefined') {
            sourceFields.push(s.field(cfg.field));
          }
        });
        if (sourceFields.length) {
          extracted.fields = sourceFields;
        }
        if (dataConfig.amend && Array.isArray(dataConfig.amend)) {
          var _extracted$items2;

          (_extracted$items2 = extracted.items).push.apply(_extracted$items2, toConsumableArray(dataConfig.amend));
        }
      } else if (typeof dataConfig.field !== 'undefined' && source) {
        var f = source.field(dataConfig.field);
        if (f) {
          if (!extracted.fields) {
            extracted.fields = [];
          }
          extracted.fields.push(f);
          if (!('value' in dataConfig)) {
            valueFn = f.value || function (v) {
              return v;
            };
            labelFn = f.label || function (v) {
              return v;
            };
            extracted.value = valueFn;
          }
          extracted.items = f.items().map(function (v) {
            return { value: valueFn(v), label: String(labelFn(v)), source: { field: dataConfig.field } };
          });
          // TODO - add source: { key: dataConfig.source, field: dataConfig.field, data: v }
        }
      } else if (dataConfig.fields) {
        dataConfig.fields.forEach(function (obj) {
          var s = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.source ? data.dataset(obj.source) : source;
          if (!s) {
            return;
          }
          var f = void 0;
          if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.field !== 'undefined') {
            f = s.field(obj.field);
          } else {
            f = s.field(obj);
          }
          if (f) {
            if (!extracted.fields) {
              extracted.fields = [];
            }
            extracted.fields.push(f);
          }
        });
      }

      if (extracted.items && dataConfig.map) {
        extracted.items = extracted.items.map(dataConfig.map);
      }
    }

    if (dataConfig && dataConfig.stack) {
      stacked(extracted, dataConfig.stack, data.dataset);
    }
    if (dataConfig && !Array.isArray(dataConfig) && typeof dataConfig.sort === 'function' && extracted.items) {
      extracted.items = extracted.items.sort(dataConfig.sort);
    }
    return extracted;
  }

  function create(config, d, opts) {
    var extractor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : extract;

    var collections = {};

    (config || []).forEach(function (cfg) {
      if (!cfg.key) {
        throw new Error('Data collection is missing "key" property');
      }
      if (_typeof(cfg.data) === 'object' && 'collection' in cfg.data) {
        throw new Error('Data config for collections may not reference other collections');
      }
      collections[cfg.key] = extractor(cfg.data, d, opts);
    });

    var fn = function fn(key) {
      var k = void 0;
      var cfg = void 0;
      if (typeof key === 'string') {
        k = key;
      } else if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        k = key.key;
        cfg = key;
      }
      if (!(k in collections)) {
        throw new Error('Unknown data collection: ' + k);
      }
      var coll = collections[k];
      if (cfg) {
        if (cfg.fields && cfg.fields.filter) {
          var filtered = coll.fields.filter(cfg.fields.filter);
          if (coll.fields.length !== filtered.length) {
            coll = extend(coll, { fields: filtered });
          }
        }
      }

      return coll;
    };

    return fn;
  }

  function create$1(options, data, deps) {
    var extractor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : extract;

    if (options.data) {
      var d = extractor(options.data, data, deps);
      if (d && d.fields && d.fields[0]) {
        // TODO Have some magic to handle and merge formatters from multiple sources
        return d.fields[0].formatter();
      }
    }

    var formatterType = void 0;
    if (options.formatter) {
      formatterType = options.formatter + '-' + (options.type || 'number');
    } else {
      formatterType = options.type || 'd3-number';
    }

    if (deps.formatter.has(formatterType)) {
      var f = deps.formatter.get(formatterType)(options.format || '');
      return f;
    }

    throw new Error('Formatter of type \'' + formatterType + '\' was not found');
  }

  function builder(obj, data, deps) {
    var formatters = {};
    for (var f in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, f)) {
        formatters[f] = create$1(obj[f], data, deps);
      }
    }
    return formatters;
  }

  function getOrCreateFormatter(v, formatters, data, deps) {
    var f = void 0;
    if (typeof v === 'string' && formatters[v]) {
      // return by name
      f = formatters[v];
    } else if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && 'formatter' in v && formatters[v.formatter]) {
      // return by { formatter: "name" }
      f = formatters[v.formatter];
    } else if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && 'type' in v && formatters[v.type]) {
      // return by { formatter: "name" }
      f = formatters[v.type];
    }

    return f || create$1(v, data, deps);
  }

  function ascending$1 (a, b) {
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
      return ascending$1(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending$1);
  var bisectRight = ascendingBisect.right;

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

  var array$1 = Array.prototype;

  var map$2 = array$1.map;
  var slice$2 = array$1.slice;

  var implicit = { name: "implicit" };

  function ordinal(range) {
    var index = map$1(),
        domain = [],
        unknown = implicit;

    range = range == null ? [] : slice$2.call(range);

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
      return arguments.length ? (range = slice$2.call(_), scale) : range.slice();
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

  function define (constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend$1(parent, definition) {
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

  define(Rgb, rgb, extend$1(Color, {
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

  define(Hsl, hsl, extend$1(Color, {
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
      t0$1 = 4 / 29,
      t1$1 = 6 / 29,
      t2 = 3 * t1$1 * t1$1,
      t3 = t1$1 * t1$1 * t1$1;

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

  define(Lab, lab, extend$1(Color, {
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
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0$1;
  }

  function lab2xyz(t) {
    return t > t1$1 ? t * t * t : t2 * (t - t0$1);
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

  define(Hcl, hcl, extend$1(Color, {
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

  define(Cubehelix, cubehelix, extend$1(Color, {
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

  function constant$2 (x) {
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

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function (a, b) {
      return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
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
      return b == null || t === "boolean" ? constant$2(b) : (t === "number" ? number$1 : t === "string" ? (c = color(b)) ? (b = c, rgb$1) : string : b instanceof color ? rgb$1 : b instanceof Date ? date : Array.isArray(b) ? array$2 : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number$1)(a, b);
  }

  function interpolateRound (a, b) {
    return a = +a, b -= a, function (t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var rho = Math.SQRT2;

  function constant$3 (x) {
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
        interpolate$$1 = value,
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
      return arguments.length ? (domain = map$2.call(_, number$2), rescale()) : domain.slice();
    };

    scale.range = function (_) {
      return arguments.length ? (range$$1 = slice$2.call(_), rescale()) : range$$1.slice();
    };

    scale.rangeRound = function (_) {
      return range$$1 = slice$2.call(_), interpolate$$1 = interpolateRound, rescale();
    };

    scale.clamp = function (_) {
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function (_) {
      return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
    };

    return rescale();
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

  function threshold() {
    var domain = [0.5],
        range$$1 = [0, 1],
        n = 1;

    function scale(x) {
      if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
    }

    scale.domain = function (_) {
      return arguments.length ? (domain = slice$2.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : domain.slice();
    };

    scale.range = function (_) {
      return arguments.length ? (range$$1 = slice$2.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : range$$1.slice();
    };

    scale.invertExtent = function (y) {
      var i = range$$1.indexOf(y);
      return [domain[i - 1], domain[i]];
    };

    scale.copy = function () {
      return threshold().domain(domain).range(range$$1);
    };

    return scale;
  }

  function applyFormat(formatter) {
    return typeof formatter === 'undefined' ? function (t) {
      return t;
    } : function (t) {
      return formatter(t);
    };
  }

  function clamp(val) {
    return Math.max(0, Math.min(1, val));
  }

  function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  }

  function minorTicksGenerator(count, start, end) {
    var r = Math.abs(start - end);
    var interval = r / (count + 1);
    var ticks = [];
    for (var i = 1; i <= count; i++) {
      var v = i * interval;
      ticks.push(start < end ? start + v : start - v);
    }
    return ticks;
  }

  function appendMinorTicks(majorTicks, minorCount, scale) {
    if (majorTicks.length === 1) {
      return majorTicks;
    }

    var ticks = majorTicks.concat([]);

    for (var i = 0; i < majorTicks.length; i++) {
      var start = majorTicks[i];
      var end = majorTicks[i + 1];

      if (i === 0 && start !== scale.start()) {
        // Before and after first major tick
        ticks.push.apply(ticks, toConsumableArray(minorTicksGenerator(minorCount, start, end)));
        start -= end - start;
        end = majorTicks[i];
        ticks.push.apply(ticks, toConsumableArray(minorTicksGenerator(minorCount, start, end)));
      } else if (i === majorTicks.length - 1 && end !== scale.end()) {
        // After last major tick
        end = start + (start - majorTicks[i - 1]);
        ticks.push.apply(ticks, toConsumableArray(minorTicksGenerator(minorCount, start, end)));
      } else {
        ticks.push.apply(ticks, toConsumableArray(minorTicksGenerator(minorCount, start, end)));
      }
    }

    return ticks.filter(function (t) {
      return t >= scale.min() && t <= scale.max();
    });
  }

  /**
  * Generate ticks based on a distance, for each 100th unit, one additional tick may be added
  * @private
  * @param  {Number} distance       Distance between each tick
  * @param  {Number} scale         The scale instance
  * @param  {Number} [minorCount=0]     Number of tick added between each distance
  * @param  {Number} [unitDivider=100]   Number to divide distance with
  * @return {Array}               Array of ticks
  */
  function looseDistanceBasedGenerator(_ref) {
    var distance = _ref.distance,
        scale = _ref.scale,
        _ref$minorCount = _ref.minorCount,
        minorCount = _ref$minorCount === undefined ? 0 : _ref$minorCount,
        _ref$unitDivider = _ref.unitDivider,
        unitDivider = _ref$unitDivider === undefined ? 100 : _ref$unitDivider,
        _ref$formatter = _ref.formatter,
        formatter = _ref$formatter === undefined ? undefined : _ref$formatter;

    var step = !notNumber(unitDivider) && !notNumber(distance) ? Math.max(distance / unitDivider, 2) : 2;
    var count = Math.min(1000, Math.round(step)); // safe guard against huge numbers
    var majorTicks = scale.ticks(count);
    if (majorTicks.length <= 1) {
      majorTicks = scale.ticks(count + 1);
    }

    var ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;
    ticks.sort(function (a, b) {
      return a - b;
    });

    var ticksFormatted = ticks.map(applyFormat(formatter));

    return ticks.map(function (tick, i) {
      var position = scale(tick);
      return {
        position: position,
        start: position,
        end: position,
        label: ticksFormatted[i],
        value: tick,
        isMinor: majorTicks.indexOf(tick) === -1
      };
    });
  }

  /**
  * Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
  * Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.
  * @private
  * @param  {Number} distance       Distance between each tick
  * @param  {Number} scale         The scale instance
  * @param  {Number} [minorCount=0]     Number of tick added between each distance
  * @param  {Number} [unitDivider=100]   Number to divide distance with
  * @return {Array}               Array of ticks
  */
  function tightDistanceBasedGenerator(_ref2) {
    var distance = _ref2.distance,
        scale = _ref2.scale,
        _ref2$minorCount = _ref2.minorCount,
        minorCount = _ref2$minorCount === undefined ? 0 : _ref2$minorCount,
        _ref2$unitDivider = _ref2.unitDivider,
        unitDivider = _ref2$unitDivider === undefined ? 100 : _ref2$unitDivider,
        _ref2$formatter = _ref2.formatter,
        formatter = _ref2$formatter === undefined ? undefined : _ref2$formatter;

    var step = !notNumber(unitDivider) && !notNumber(distance) ? Math.max(distance / unitDivider, 2) : 2;
    var count = Math.min(1000, Math.round(step)); // safe guard against huge numbers
    var n = count > 10 ? 10 : count;
    scale.nice(n);

    var majorTicks = scale.ticks(count);
    var ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;
    ticks.sort(function (a, b) {
      return a - b;
    });

    var ticksFormatted = ticks.map(applyFormat(formatter));

    return ticks.map(function (tick, i) {
      var position = scale(tick);
      return {
        position: position,
        start: position,
        end: position,
        label: ticksFormatted[i],
        value: tick,
        isMinor: majorTicks.indexOf(tick) === -1
      };
    });
  }

  function ticksByCount(_ref3) {
    var count = _ref3.count,
        minorCount = _ref3.minorCount,
        scale = _ref3.scale,
        formatter = _ref3.formatter;

    return scale.ticks((count - 1) * minorCount + count).map(function (tick, i) {
      var position = scale(tick);
      return {
        position: position,
        start: position,
        end: position,
        label: formatter(tick),
        isMinor: i % (minorCount + 1) !== 0,
        value: tick
      };
    });
  }

  function ticksByValue(_ref4) {
    var values = _ref4.values,
        scale = _ref4.scale,
        _ref4$formatter = _ref4.formatter,
        formatter = _ref4$formatter === undefined ? function (v) {
      return v;
    } : _ref4$formatter;

    return values.sort(function (a, b) {
      return (isObject(a) ? a.value : a) - (isObject(b) ? b.value : b);
    }).filter(function (v, i, ary) {
      var val = isObject(v) ? v.value : v;
      return val <= scale.max() && val >= scale.min() && ary.indexOf(v) === i;
    }).map(function (v) {
      var value = isObject(v) ? v.value : v;
      var position = scale(value);
      return {
        position: position,
        value: value,
        label: isObject(v) && typeof v.label !== 'undefined' ? v.label : formatter(value),
        isMinor: false,
        start: isObject(v) && !isNaN(v.start) ? clamp(scale(v.start)) : position, // TODOHandle end < start?
        end: isObject(v) && !isNaN(v.end) ? clamp(scale(v.end)) : position // TODO Handle start > end?
      };
    });
  }

  function forceTicksAtBounds(ticks, scale, formatter) {
    var ticksP = ticks.map(function (t) {
      return t.position;
    });
    var range = scale.range();

    if (ticksP.indexOf(range[0]) === -1) {
      ticks.splice(0, 0, {
        position: range[0],
        start: range[0],
        end: range[0],
        label: formatter(scale.start()),
        isMinor: false,
        value: scale.start()
      });
    } else if (ticks[0] && ticks[0].isMinor) {
      ticks[0].isMinor = false; // Convert to major tick
    }

    var lastTick = ticks[ticks.length - 1];
    if (ticksP.indexOf(range[1]) === -1) {
      ticks.push({
        position: range[1],
        start: range[1],
        end: range[1],
        label: formatter(scale.end()),
        isMinor: false,
        value: scale.end()
      });
    } else if (lastTick && lastTick.isMinor) {
      lastTick.isMinor = false; // Convert to major tick
    }
  }

  function generateContinuousTicks(_ref5) {
    var settings = _ref5.settings,
        scale = _ref5.scale,
        distance = _ref5.distance,
        formatter = _ref5.formatter;

    var ticks = void 0;
    var minorCount = settings.minorTicks && !notNumber(settings.minorTicks.count) ? Math.min(100, settings.minorTicks.count) : 0;

    if (Array.isArray(settings.ticks.values)) {
      var values = settings.ticks.values.filter(function (v) {
        return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? !notNumber(v.value) : !notNumber(v);
      });
      ticks = ticksByValue({ values: values, scale: scale.copy(), formatter: formatter });
    } else if (!notNumber(settings.ticks.count)) {
      var count = Math.min(1000, settings.ticks.count);
      ticks = ticksByCount({
        count: count, minorCount: minorCount, scale: scale.copy(), formatter: formatter
      });
    } else {
      var tickGen = settings.ticks.tight ? tightDistanceBasedGenerator : looseDistanceBasedGenerator;
      ticks = tickGen({
        distance: distance,
        minorCount: minorCount,
        unitDivider: settings.ticks.distance,
        scale: scale,
        formatter: formatter
      });

      if (settings.ticks.forceBounds) {
        forceTicksAtBounds(ticks, scale, formatter);
      }
    }

    return ticks;
  }

  function generateDiscreteTicks(_ref6) {
    var scale = _ref6.scale;

    var domain = scale.domain();
    var values = domain;
    var dataItems = scale.data().items;
    var labels = scale.labels ? scale.labels() : values;
    var bandwidth = scale.bandwidth();

    return values.map(function (d, i) {
      var start = scale(d);
      return {
        position: start + bandwidth / 2,
        label: '' + labels[i],
        data: dataItems ? dataItems[i] : undefined,
        start: start,
        end: start + bandwidth
      };
    });
  }

  function resolveSettings$1() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var stngs = {};

    Object.keys(defaultSettings).forEach(function (key) {
      var type = _typeof(settings[key]);

      if (type === 'function') {
        stngs[key] = settings[key](context);
      } else if (type === 'undefined') {
        stngs[key] = defaultSettings[key];
      } else {
        stngs[key] = settings[key];
      }
    });

    return stngs;
  }

  var DEFAULT_SETTINGS = {
    min: NaN,
    max: NaN,
    expand: NaN,
    include: [],
    invert: false
  };

  var DEFAULT_TICKS_SETTINGS = {
    tight: false,
    forceBounds: false,
    values: undefined,
    count: NaN,
    distance: 100
  };

  var DEFAULT_MINORTICKS_SETTINGS = {
    count: NaN
  };

  /**
   * @typedef {object} scale--linear
   * @property {string} [type='linear']
   * @property {number} [expand] - Expand the output range
   * @property {boolean} [invert=false] - Invert the output range
   * @property {number[]} [include] - Include specified numbers in the output range
   * @property {object} [ticks]
   * @property {boolean} [ticks.tight = false]
   * @property {boolean} [ticks.forceBounds = false]
   * @property {number} [ticks.distance = 100]  - Approximate distance between each tick
   * @property {number[]|object[]} [ticks.values] - If set, ticks are no longer generated but instead equal to this set
   * @property {number} [ticks.count]
   * @property {object} [minorTicks]
   * @property {number} [minorTicks.count = 3]
   * @property {number} [min] - Set an explicit minimum value
   * @property {number} [max] - Set an explicit maximum value
   */

  function getMinMax$1(settings, fields) {
    var min = +settings.min;
    var max = +settings.max;
    var fieldMin = 0;
    var fieldMax = 1;
    if (fields && fields[0]) {
      var minValues = fields.map(function (m) {
        return m.min();
      }).filter(function (v) {
        return !isNaN(v);
      });
      var maxValues = fields.map(function (m) {
        return m.max();
      }).filter(function (v) {
        return !isNaN(v);
      });
      fieldMin = minValues.length ? Math.min.apply(Math, toConsumableArray(minValues)) : Number.NaN;
      fieldMax = maxValues.length ? Math.max.apply(Math, toConsumableArray(maxValues)) : Number.NaN;

      if (isNaN(fieldMin) || isNaN(fieldMax)) {
        fieldMin = -1;
        fieldMax = 1;
      } else if (fieldMin === fieldMax && fieldMin === 0) {
        fieldMin = -1;
        fieldMax = 1;
      } else if (fieldMin === fieldMax && fieldMin) {
        fieldMin -= Math.abs(fieldMin * 0.1);
        fieldMax += Math.abs(fieldMax * 0.1);
      } else if (!isNaN(settings.expand)) {
        var range = fieldMax - fieldMin;
        fieldMin -= range * settings.expand;
        fieldMax += range * settings.expand;
      }

      if (Array.isArray(settings.include)) {
        var i = settings.include.filter(function (n) {
          return !isNaN(n);
        });
        fieldMin = Math.min.apply(Math, toConsumableArray(i).concat([fieldMin]));
        fieldMax = Math.max.apply(Math, toConsumableArray(i).concat([fieldMax]));
      }
    }

    return {
      mini: !isNaN(min) ? min : fieldMin,
      maxi: !isNaN(max) ? max : fieldMax
    };
  }

  function initNormScale(normScale, scale) {
    if (normScale.instance) {
      return;
    }
    normScale.instance = scale.copy();
    normScale.instance.domain([scale.start(), scale.end()]);
    normScale.instance.clamp(true);
    normScale.instance.range(normScale.invert ? [1, 0] : [0, 1]);
  }
  /**
   * @alias scaleLinear
   * @private
   * @param { object } settings
   * @param { field[] } [fields]
   * @return { linear }
   */

  function scaleLinear$$1() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var d3Scale = linear$1();
    var normScale = { instance: null, invert: false };
    var ctx = { data: data, resources: resources };
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS, ctx);
    stgns.ticks = resolveSettings$1(settings.ticks, DEFAULT_TICKS_SETTINGS, ctx);
    stgns.minorTicks = resolveSettings$1(settings.minorTicks, DEFAULT_MINORTICKS_SETTINGS, ctx);
    var tickCache = void 0;

    /**
     * @alias linear
     * @private
     * @param { Object } value
     * @return { number }
     */
    function fn(v) {
      if (notNumber(v)) {
        return NaN;
      }
      return d3Scale(v);
    }

    fn.data = function () {
      return data;
    };

    /**
     * {@link https://github.com/d3/d3-scale#continuous_invert }
     * @param { number } value The inverted value
     * @return { number } The inverted scaled value
     */
    fn.invert = function invert(value) {
      return d3Scale.invert(value);
    };

    /**
     * {@link https://github.com/d3/d3-scale#continuous_rangeRound }
     * @param { number[] } values Range values
     * @return { linear } The instance this method was called on
     */
    fn.rangeRound = function rangeRound(values) {
      d3Scale.rangeRound(values);
      return fn;
    };

    /**
     * {@link https://github.com/d3/d3-scale#continuous_clamp }
     * @param { boolean } [ value=true ] TRUE if clamping should be enabled
     * @return { linear } The instance this method was called on
     */
    fn.clamp = function clamp() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      d3Scale.clamp(value);
      return fn;
    };

    /**
     * Get cached ticks (if any)
     * @return { number | undefined }
     */
    fn.cachedTicks = function fnCachedTicks() {
      return tickCache;
    };

    /**
     * Clear the tick cache
     * @return {number | undefined}
     */
    fn.clearTicksCache = function fnClearTicks() {
      tickCache = undefined;
      return this;
    };

    /**
     * {@link https://github.com/d3/d3-scale#continuous_ticks }
     * @param { Object } input Number of ticks to generate or an object passed to tick generator
     * @return { number[] | Object } Array of ticks or any type the custom tick generator returns
     */
    fn.ticks = function ticks(input) {
      if (input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
        input.settings = input.settings || {};
        // TODO Discontinue support for custom ticks settings as argument
        input.settings = extend(true, {}, stgns, input.settings);
        input.scale = fn;
        tickCache = generateContinuousTicks(input);
        return tickCache;
      }

      tickCache = d3Scale.ticks(input);
      return tickCache;
    };

    /**
     * {@link https://github.com/d3/d3-scale#continuous_nice }
     * @param { number } count
     * @return { linear } The instance this method was called on
     */
    fn.nice = function nice(count) {
      d3Scale.nice(count);

      return fn;
    };

    // TODO Support this?
    fn.tickFormat = function tickFormat(count, format) {
      return d3Scale.tickFormat(count, format);
    };

    // TODO Support this?
    fn.interpolate = function interpolate(func) {
      d3Scale.interpolate(func);
      return fn;
    };

    /**
     * @param { number[] } [values] Set or Get domain values
     * @return { linear | Number[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
     */
    fn.domain = function domain(values) {
      if (arguments.length) {
        d3Scale.domain(values);
        if (normScale.instance) {
          normScale.instance.domain([fn.start(), fn.end()]);
        }
        return fn;
      }
      return d3Scale.domain();
    };

    /**
     * @param { number[] } [values] Set or Get range values
     * @return { linear | number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
     */
    fn.range = function range(values) {
      if (arguments.length) {
        d3Scale.range(values);

        return fn;
      }
      return d3Scale.range();
    };

    /**
     * Get the first value of the domain
     * @return { number }
     */
    fn.start = function start() {
      return fn.domain()[0];
    };

    /**
     * Get the last value of the domain
     * @return { number }
     */
    fn.end = function end() {
      return fn.domain()[this.domain().length - 1];
    };

    /**
     * Get the minimum value of the domain
     * @return { number }
     */
    fn.min = function min() {
      return Math.min(this.start(), this.end());
    };

    /**
     * Get the maximum value of the domain
     * @return { number }
     */
    fn.max = function max() {
      return Math.max(this.start(), this.end());
    };

    /**
     * Divides the domain and range into uniform segments, based on start and end value
     * @param  { number } segments The number of segments
     * @return { function } The instance this method was called on
     * @example
     * let s = linear();
     * s.domain([0, 10]);
     * s.range([0, 1]);
     * s.classify( 2 );
     * s.domain(); // [10, 5, 5, 0]
     * s.range(); // [0.75, 0.75, 0.25, 0.25]
     */
    fn.classify = function classify(segments) {
      var valueRange = (fn.start() - fn.end()) / segments,
          domain = [fn.end()],
          range = [],
          samplePos = valueRange / 2;

      for (var i = 0; i < segments; i++) {
        var lastVal = domain[domain.length - 1] || 0,
            calIntervalPos = lastVal + valueRange,
            calSamplePos = lastVal + samplePos,
            sampleColValue = fn(calSamplePos);

        domain.push.apply(domain, [calIntervalPos, calIntervalPos]);
        range.push.apply(range, [sampleColValue, sampleColValue]);
      }
      domain.pop();
      fn.domain(domain);
      fn.range(range);

      return fn;
    };

    fn.copy = function copy() {
      var cop = scaleLinear$$1(settings, data, resources);
      cop.domain(fn.domain());
      cop.range(fn.range());
      cop.clamp(d3Scale.clamp());
      return cop;
    };

    /**
     * @param {number} d - A domain value
     * @return {number} A normalized range output given in range 0-1
     * @example
     * const scale = scaleLinear().domain([0, 10]).range([0, 10000]);
     * scale.norm(5); // Returns 0.5
     * scale(5); // Returns 5000
     *
     * scale.domain([0, 2, 10]);
     * scale.norm(5); // Returns 0.5
     */
    fn.norm = function norm(d) {
      initNormScale(normScale, fn);

      return normScale.instance(d);
    };

    /**
     * @param {number} d - A normalized value in range 0-1
     * @return {number} A corresponding domain value
     * @example
     * const scale = scaleLinear().domain([0, 10]).range([0, 10000]);
     * scale.normInvert(0.5); // Returns 5
     * scale.invert(5000); // Returns 5
     */
    fn.normInvert = function norm(t) {
      initNormScale(normScale, fn);

      return normScale.instance.invert(t);
    };

    var _getMinMax = getMinMax$1(stgns, data ? data.fields : []),
        mini = _getMinMax.mini,
        maxi = _getMinMax.maxi;

    fn.domain([mini, maxi]);
    fn.range(stgns.invert ? [1, 0] : [0, 1]);
    normScale.invert = stgns.invert;

    return fn;
  }

  var DEFAULT_SETTINGS$1 = {
    padding: 0,
    paddingInner: NaN,
    paddingOuter: NaN,
    align: 0.5,
    invert: false,
    maxPxStep: NaN
  };

  /**
   * @typedef {object} scale--band
   * @property {string} [type='band']
   * @property {number} [padding] - {@link https://github.com/d3/d3-scale#band_padding}
   * @property {number} [paddingInner] - {@link https://github.com/d3/d3-scale#band_paddingInner}
   * @property {number} [paddingOuter] - {@link https://github.com/d3/d3-scale#band_paddingOuter}
   * @property {number} [align] - {@link https://github.com/d3/d3-scale#band_align}
   * @property {boolean} [invert=false] - Invert the output range
   * @property {number} [maxPxStep] - Explicitly limit the bandwidth to a pixel value
   * @property {function} [label] - Callback label function, applied on each datum
   * @property {function} [value] - Callback value function, applied on each datum
   */

  /**
   * @alias scaleBand
   * @memberof picasso
   * @private
   * @param { Object } settings
   * @param { fields[] } [fields]
   * @param { dataset } [dataset]
   * @return { band }
   */

  function scaleBand$$1() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /**
     * An augmented {@link https://github.com/d3/d3-scale#_band|d3 band scale}
     * @alias band
     * @private
     * @kind function
     * @param { Object } value
     * @return { number }
     */
    var band$$1 = band();
    var ctx = { data: data, resources: resources };
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$1, ctx);
    var items = data.items || [];
    var domainToDataMapping = {};
    var values = [];
    var labels = [];

    // I would like to define this outside of scaleBand but it cause the documentation to be in the wrong order
    function augmentScaleBand(band$$1, settings) {
      // eslint-disable-line no-shadow
      band$$1.data = function () {
        return data;
      };

      band$$1.datum = function (domainValue) {
        return items[domainToDataMapping[domainValue]];
      };

      /**
       * Get the first value of the domain
       * @return { number }
       */
      band$$1.start = function start() {
        return band$$1.domain()[0];
      };

      /**
       * Get the last value of the domain
       * @return { number }
       */
      band$$1.end = function end() {
        return band$$1.domain()[band$$1.domain().length - 1];
      };

      band$$1.labels = function () {
        return labels;
      };

      /**
       * Generate discrete ticks
       * @return {Object[]} Array of ticks
       */
      band$$1.ticks = function ticks() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        input.scale = band$$1;
        return generateDiscreteTicks(input, settings.trackBy || 'label');
      };
    }
    augmentScaleBand(band$$1, settings);

    /**
     * if required creates a new scale with a restricted range
     * so that step size is at most maxPxStep
     * otherwise it returns itself
     * @param { number } size
     * @return { band }
     */
    band$$1.pxScale = function pxScale(size) {
      var max = stgns.maxPxStep;
      if (isNaN(max)) {
        return band$$1;
      }
      var n = band$$1.domain().length;
      var sizeRelativeToStep = Math.max(1, n - band$$1.paddingInner() + 2 * band$$1.paddingOuter());

      if (sizeRelativeToStep * max >= size) {
        return band$$1;
      }

      var newBand = band$$1.copy();
      newBand.type = band$$1.type;
      augmentScaleBand(newBand, settings);
      var t = sizeRelativeToStep * max / size;
      var offset = (1 - t) * band$$1.align();
      newBand.range(stgns.invert ? [t + offset, offset] : [offset, t + offset]);

      return newBand;
    };

    var valueFn = typeof settings.value === 'function' ? settings.value : function (d) {
      return d.datum.value;
    };
    var labelFn = typeof settings.label === 'function' ? settings.label : function (d) {
      return d.datum.label;
    };

    for (var i = 0; i < items.length; i++) {
      var arg = extend({ datum: items[i] }, ctx);
      var v = valueFn(arg, i);
      if (values.indexOf(v) === -1) {
        values.push(v);
        labels.push(labelFn(arg, i));
        domainToDataMapping[v] = i;
      }
    }

    band$$1.domain(values);
    band$$1.range(stgns.invert ? [1, 0] : [0, 1]);

    band$$1.padding(isNaN(stgns.padding) ? 0 : stgns.padding);
    if (!isNaN(stgns.paddingInner)) {
      band$$1.paddingInner(stgns.paddingInner);
    }
    if (!isNaN(stgns.paddingOuter)) {
      band$$1.paddingOuter(stgns.paddingOuter);
    }
    band$$1.align(isNaN(stgns.align) ? 0.5 : stgns.align);

    return band$$1;
  }

  var DEFAULT_TICKS_SETTINGS$1 = {
    depth: 0
  };

  function keyGen(node, valueFn, ctx) {
    return node.ancestors().map(function (a) {
      return valueFn(extend({ datum: a.data }, ctx));
    }).reverse().slice(1) // Delete root node
    .toString();
  }

  function flattenTree(rootNode, settings, ctx) {
    var ticksDepth = settings.ticks.depth;
    var valueFn = settings.value;
    var labelFn = settings.label;
    var values = [];
    var labels = [];
    var items = {};
    var ticks = [];
    var expando = 0;
    if (!rootNode) {
      return {
        values: values, labels: labels, items: items, ticks: ticks
      };
    }

    rootNode.eachAfter(function (node) {
      if (node.depth > 0) {
        var key = keyGen(node, valueFn, ctx);
        var leaves = node.leaves() || [node]; // If leaf node returns itself
        var value = valueFn(extend({ datum: node.data }, ctx));
        var label = labelFn(extend({ datum: node.data }, ctx));
        var isBranch = Array.isArray(node.children);

        var item = {
          key: key,
          count: leaves.length,
          value: value,
          label: label,
          leftEdge: keyGen(leaves[0], valueFn, ctx),
          rightEdge: keyGen(leaves[Math.max(leaves.length - 1, 0)], valueFn, ctx),
          node: node
          // isTick: ticksDepth === null ? !isBranch : node.depth === ticksDepth
        };

        if (isBranch) {
          values.push('SPACER_' + expando + '_SPACER');
          expando++;
        } else {
          values.push(key);
          labels.push(label);
        }

        if (ticksDepth <= 0 && !isBranch || node.depth === ticksDepth) {
          ticks.push(item);
        }

        items[key] = item;
      }
    });

    var spill = rootNode.height - 1;
    if (spill > 0) {
      values.splice(-spill);
    }

    return {
      values: values, labels: labels, items: items, ticks: ticks
    };
  }

  /**
   * @typedef {object} scale-hBand.settings
   * @private
   * @property {number} [padding=0] - Exposes {@link https://github.com/d3/d3-scale#band_padding}
   * @property {boolean} [paddingOuter=0] - Exposes {@link https://github.com/d3/d3-scale#band_paddingOuter}
   * @property {number[]} [paddingInner=0] - Exposes {@link https://github.com/d3/d3-scale#band_paddingInner}
   * @property {object} [align=0.5] - Exposes {@link https://github.com/d3/d3-scale#band_align}
   * @property {boolean} [invert=false] - Invert the output range
   */

  /**
    * Hierarchical band scale, that is an augmented band scale, that takes hierarchical data as input
   * @alias scaleHierarchicalBand
   * @private
   * @param { Object } settings
   * @param { fields[] } [fields]
   * @param { dataset } [dataset] - With a root property that is an instance of D3.js Hierarchy
   * @return { h-band }
   */

  function scaleHierarchicalBand() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var ctx = { data: data, resources: resources };
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$1, ctx);
    stgns.ticks = resolveSettings$1(settings.ticks, DEFAULT_TICKS_SETTINGS$1, ctx);
    stgns.value = typeof settings.value === 'function' ? settings.value : function (d) {
      return d.datum.value;
    };
    stgns.label = typeof settings.label === 'function' ? settings.label : function (d) {
      return d.datum.value;
    };

    var bandInstance = scaleBand$$1(stgns);

    var _flattenTree = flattenTree(data.root, stgns, ctx),
        values = _flattenTree.values,
        labels = _flattenTree.labels,
        items = _flattenTree.items,
        ticks = _flattenTree.ticks;

    /**
     * @alias h-band
     * @private
     * @kind function
     * @param { Object[] } value - Array where each value is a reference to a node, going from depth 1 to n.
     * @return { number }
     */


    var hBand = function fn(val) {
      var strVal = String(val);
      var item = items[strVal];
      if (item) {
        return bandInstance(stgns.invert ? item.rightEdge : item.leftEdge);
      }

      return bandInstance(strVal);
    };

    extend(true, hBand, bandInstance);

    /**
     * Wrapped {@link https://github.com/d3/d3-scale#band_bandwidth}
     * @param { Object[] } [val] - Array where each value is a reference to a node, going from depth 1 to n. If omitted, bandwidth for the leaf nodes is return.
     * @return { number }
     */

    hBand.bandwidth = function bandwidth(val) {
      var item = items[String(val)];
      var bw = bandInstance.bandwidth();
      if (item && !item.isLeaf) {
        var left = hBand(item.leftEdge);
        var right = hBand(item.rightEdge);
        return Math.abs(left - right) + bw;
      }
      return bw;
    };

    /**
     * Wrapped {@link https://github.com/d3/d3-scale#band_step}
     * @param { Object[] } [val] - Array where each value is a reference to a node, going from depth 1 to n. If omitted, step size for the leaf nodes is return.
     * @return { number }
     */
    hBand.step = function step(val) {
      var item = items[String(val)];
      var leafCount = item ? item.count : 1;
      var stepSize = bandInstance.step();
      stepSize *= leafCount;
      return stepSize;
    };

    /**
     * @return { dataset }
     */
    hBand.data = function () {
      return data;
    };

    /**
     * Return datum for a given node
     * @param { Object[] } val - Array where each value is a reference to a node, going from depth 1 to n.
     * @return { Object } The datum
     */
    hBand.datum = function (val) {
      var item = items[String(val)];
      if (item) {
        return item.node.data;
      }
      return null;
    };

    hBand.copy = function () {
      return scaleHierarchicalBand(settings, data, resources);
    };

    /**
     * @return { Object[] } Labels for each leaf node
     */
    hBand.labels = function () {
      return labels;
    };

    /**
     * Generate discrete ticks
     * @return { Object[] } Ticks for each leaf node
     */
    hBand.ticks = function () {
      // eslint-disable-line arrow-body-style
      return ticks.map(function (item) {
        var start = hBand(item.key);
        var bandwidth = hBand.bandwidth(item.key);
        return {
          position: start + bandwidth / 2,
          label: item.label,
          data: item.node.data,
          start: start,
          end: start + bandwidth
        };
      });
    };

    var orgPxScale = bandInstance.pxScale;
    hBand.pxScale = function pxScale(size) {
      bandInstance = orgPxScale(size);
      return hBand;
    };

    hBand.domain(values);

    return hBand;
  }

  var minAccessor = function minAccessor(v) {
    return v.min();
  };
  var maxAccessor = function maxAccessor(v) {
    return v.max();
  };

  /**
   * Calculate the min/max value based on various inputs.
   *
   * Provided min/max setting takes presedence over all other inputs. If not provided, the respective values are calculated
   * from the given arr input, where each item in the array is expected to have a min/max accessor.
   *
   * @private
   * @param {object} [settings]
   * @param {number} [settings.min] The minimum value. Defaults to 0 if not provided.
   * @param {number} [settings.max] The maximum value. Defaults to 1 if not provided.
   * @param {object} [arr]
   * @returns { object[] } An array containing the min and max values.
   *
   * @example
   * minmax(); // [0, 1]
   *
   * minmax({}, [
   * { min: () => 13, max: () => 15 },
   * { min: () => NaN, max: () => 17 },
   * ]); // [13, 17]
   *
   * minmax({ min: -5, max: 4 }, [
   * { min: () => -20, max: () => 15 },
   * ]); // [-5, 4]
   */
  function minmax(settings, arr) {
    // const definedMin = settings && typeof settings.min !== 'undefined';
    // const definedMax = settings && typeof settings.max !== 'undefined';
    var definedMin = settings && !isNaN(settings.min);
    var definedMax = settings && !isNaN(settings.max);

    var min = definedMin ? +settings.min : 0;
    var max = definedMax ? +settings.max : 1;

    if (arr && arr.length) {
      if (!definedMin) {
        var arrMin = arr.map(minAccessor).filter(isNumber);
        min = arrMin.length ? Math.min.apply(Math, toConsumableArray(arrMin)) : min;
      }

      if (!definedMax) {
        var arrMax = arr.map(maxAccessor).filter(isNumber);
        max = arrMax.length ? Math.max.apply(Math, toConsumableArray(arrMax)) : max;
      }
    }

    return [min, max];
  }

  var DEFAULT_SETTINGS$2 = {
    domain: [],
    range: [],
    invert: false,
    min: NaN,
    max: NaN
  };

  function generateDomain(range, min, max) {
    var len = range.length;
    if (len === 2) {
      return [min, max];
    }
    var domain = [];
    var part = (max - min) / (len - 1);

    domain.push(min);
    for (var i = 1; i < len - 1; i++) {
      domain.push(min + part * i);
    }
    domain.push(max);

    return domain;
  }

  /**
   * @typedef {object} scale--sequential-color
   * @property {string} [type='sequential-color']
   * @property {string[]} [range] - CSS color values of the output range
   * @property {boolean} [invert=false] - Invert range
   * @property {number} [min] - Set an explicit minimum value
   * @property {number} [max] - Set an explicit maximum value
   */

  /**
   * @alias scaleSequentialColor
   * @private
   * @param { Object } [settings] Settings for this scale. If both range and domain are specified, they have to fulfill range.length === domain.length, otherwise they will be overriden.
   * @param { number[] } [settings.domain] Numeric values indicating stop limits between start and end values.
   * @param { color[] } [settings.range] CSS color values indicating stop colors between start and end values.
   * @param { field[] } [fields] Fields to dynamically calculate the domain extent.
   * @return { sequentialColor }
   *
   * @example
   * picasso.scaleSequentialColor({
   *  range: ['red', '#fc6', 'green'],
   *  domain: [-40, 0, 100]
   * });
   */

  function scaleSequentialColor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var s = scaleLinear$$1(settings, data, resources).clamp(true).interpolate(rgb$1);
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$2, { data: data, resources: resources });
    var isDomain = Array.isArray(stgns.domain) && stgns.domain.length;
    var isRange = Array.isArray(stgns.range) && stgns.range.length;

    /**
     * @alias sequentialColor
     * @private
     * @kind function
     * @param { Object } v Object containing a 'value' property
     * @return { string } The blended color
     */
    var fn = s;

    extend(true, fn, s);

    var _minmax = minmax(stgns, data ? data.fields : []),
        _minmax2 = slicedToArray(_minmax, 2),
        min = _minmax2[0],
        max = _minmax2[1];

    var num = isDomain ? stgns.domain.length : -1;
    var DEFAULT_COLORS = resources.theme ? resources.theme.palette('sequential', num > 0 ? num : 2) : [];

    var range = isRange ? stgns.range : DEFAULT_COLORS;
    fn.range(stgns.invert ? range.slice().reverse() : range.slice());
    fn.domain(isDomain ? stgns.domain : generateDomain(fn.range(), min, max));

    return fn;
  }

  // const DEFAULT_COLORS = ['rgb(180,221,212)', 'rgb(34, 83, 90)'];

  var DEFAULT_SETTINGS$3 = {
    domain: [],
    range: [],
    invert: false,
    min: NaN,
    max: NaN,
    nice: false
  };

  function generateDomain$1(range, min, max) {
    var len = range.length;
    if (len === 2) {
      return [min + (max - min) / 2];
    }
    var domain = [];
    var part = (max - min) / len;

    for (var i = 1; i < len; i++) {
      domain.push(min + part * i);
    }
    return domain;
  }

  function getBreaks(domain) {
    var ret = [];
    for (var i = 0; i < domain.length - 1; i++) {
      ret.push((domain[i] + domain[i + 1]) / 2);
    }
    return ret;
  }

  function generateRange(domain, colors, min, max) {
    min = domain[0];
    max = domain && domain.length >= 2 ? domain[domain.length - 1] : max;
    var seq = scaleSequentialColor().domain([min, max]).range(colors);
    var values = [min].concat(toConsumableArray(getBreaks(domain)), [max]);
    return values.map(function (v) {
      return seq(v);
    });
  }

  function generateNiceDomain(range, min, max) {
    var numPoints = range.length === 2 ? 10 : Math.max(1, range.length);
    var lin = linear$1().domain([min, max]).nice(numPoints);
    var domain = lin.ticks(numPoints);

    if (!range || !range.length) {
      return domain;
    }

    // remove values from endpoints
    var num = Math.max(0, range.length - 1);
    while (domain.length > num) {
      if (domain[0] - min <= max - domain[domain.length - 1]) {
        domain.shift();
      } else {
        domain.pop();
      }
    }

    return domain;
  }

  /**
   * @typedef {object} scale--threshold-color
   * @property {string} [type='threshold-color']
   * @property {number[]} [domain] Values defining the thresholds
   * @property {string[]} [range] - CSS color values of the output range
   * @property {boolean} [invert=false] - Invert range
   * @property {number} [min] - Set an explicit minimum value
   * @property {number} [max] - Set an explicit maximum value
   * @property {boolean} [nice=false] If set to true, will generate 'nice' domain values. Ignored if domain is set.
   */

  /**
   * @alias scaleThresholdColor
   * @private
   * @param { object } [settings] Settings for this scale. If both domain and range are specified, they have to fulfill domain.length === range.length + 1,  otherwise they will be overriden.
   * @param { number[] } [settings.domain] Values defining the thresholds.
   * @param { color[] } [settings.range] CSS color values of the output range.
   * @param { boolean } [settings.nice=false] If set to true, will generate 'nice' domain values. Ignored if domain is set.
   * @param { number } [settings.min] Minimum value to generate domain extent from. Ignored if domain is set.
   * @param { number } [settings.max] Maximum value to generate domain extend from. Ignored if domain is set.
   * @param { field[] } [fields] Fields to dynamically calculate the domain extent from. Ignored if min/max are set.
   * @return { thresholdColor }
   *
   * @example
   * let t = threshold({
   *   range: ['black', 'white'],
   *   domain: [25,50,75],
   *   max: 100,
   *   min: 0
   * });
   * t.domain(); // [25,50,75]
   * t.range(); // Generates from colors and domain: ['rgb(0,0,0)','rgb(85,85,85)','rgb(170,170,170)','rgb(255,255,255)']
   */

  function scaleThresholdColor() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var d3Scale = threshold();
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$3, { data: data, resources: resources });
    var isDomain = Array.isArray(stgns.domain) && stgns.domain.length;
    var isRange = Array.isArray(stgns.range) && stgns.range.length;

    /**
     * @alias thresholdColor
     * @private
     * @param { object } v Object literal containing a 'value' property.
     * @return { string } A CSS color from the scale's range.
     */
    function fn(v) {
      if (notNumber(v)) {
        return NaN;
      }
      return d3Scale(v);
    }

    Object.keys(d3Scale).forEach(function (key) {
      return fn[key] = d3Scale[key];
    });

    var fields = data.fields;

    var _minmax = minmax(stgns, fields),
        _minmax2 = slicedToArray(_minmax, 2),
        min = _minmax2[0],
        max = _minmax2[1];

    var num = isDomain ? stgns.domain.length : -1;
    var DEFAULT_COLORS = resources.theme ? resources.theme.palette('sequential', num > 0 ? num : 2) : [];

    var range = isRange ? stgns.range : DEFAULT_COLORS;
    var domain = [];

    if (isDomain) {
      domain = stgns.domain;
    } else if (stgns.nice) {
      domain = generateNiceDomain(range, min, max);
    } else {
      domain = [min + (max - min) / 2];
    }

    if (range.length > domain.length + 1) {
      // Generate limits from range
      domain = generateDomain$1(range, min, max);
    } else if (range.length < domain.length + 1) {
      // Generate additional colors
      range = generateRange(domain, range, min, max);
    }

    fn.data = function () {
      return data;
    };

    fn.range(stgns.invert ? range.slice().reverse() : range);
    fn.domain(domain);

    return fn;
  }

  var DEFAULT_SETTINGS$4 = {
    domain: [],
    range: []
  };

  /**
   * @alias scaleOrdinal
   * @private
   * @param { Object } settings
   * @param { field[] } [fields]
   * @param { dataset } data
   * @return { ordinal }
   */
  function ordinal$1() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /**
     * An augmented {@link https://github.com/d3/d3-scale#_ordinal|d3 ordinal scale}
     * @private
     * @alias ordinal
     * @param { Object }
     * @return { number }
     */
    var fn = ordinal();

    var ctx = { data: data, resources: resources };
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$4, ctx);

    var valueFn = typeof settings.value === 'function' ? settings.value : function (d) {
      return d.datum.value;
    };
    var labelFn = typeof settings.label === 'function' ? settings.label : function (d) {
      return d.datum.label;
    };
    var items = data.items || [];
    var domainToDataMapping = {};
    var values = [];
    var labels = [];

    for (var i = 0; i < items.length; i++) {
      var arg = extend({ datum: items[i] }, ctx);
      var v = valueFn(arg, i);
      if (values.indexOf(v) === -1) {
        values.push(v);
        labels.push(labelFn(arg, i));
        domainToDataMapping[v] = i;
      }
    }

    fn.data = function () {
      return data;
    };

    fn.labels = function () {
      return labels;
    };

    fn.label = function (domainValue) {
      return labels[values.indexOf(domainValue)];
    };

    fn.datum = function (domainValue) {
      return items[domainToDataMapping[domainValue]];
    };

    fn.range(stgns.range);

    if (Array.isArray(stgns.domain) && stgns.domain.length) {
      fn.domain(stgns.domain);
    } else {
      fn.domain(values);
    }
    return fn;
  }

  var DEFAULT_SETTINGS$5 = {
    domain: [],
    range: [],
    unknown: undefined
  };

  var DEFAULT_EXPLICIT_SETTINGS = {
    domain: [],
    range: [],
    override: false
  };

  /**
   * @typedef {object} scale--categorical-color
   * @property {string} [type='categorical-color']
   * @property {string[]} [range=false] - CSS color values of the output range
   * @property {string} [unknown] - {@link https://github.com/d3/d3-scale#ordinal_unknown}
   * @property {object} [explicit] - Explicitly bind values to an output
   * @property {object[]} [explicit.domain[]] - Values to bind
   * @property {string[]} [explicit.range[]] - Output range
   */

  /**
   * An ordinal scale with the output range set to default colors, as defined by *scaleCategorical.range*
   * @alias scaleCategorical
   * @private
   * @param { Object } settings
   * @param { field[] } [fields]
   * @param { dataset } [dataset]
   * @return { ordinal }
   */
  function scaleCategorical() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var resources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var s = ordinal$1(settings, data, resources);
    var theme = resources.theme;
    var stgns = resolveSettings$1(settings, DEFAULT_SETTINGS$5, { data: data, resources: resources });
    stgns.explicit = resolveSettings$1(settings.explicit, DEFAULT_EXPLICIT_SETTINGS, { data: data, resources: resources });

    var range = void 0;
    if (!Array.isArray(stgns.range) || stgns.range.length === 0) {
      range = theme ? theme.palette('categorical', s.domain().length).slice() : [];
    } else {
      range = stgns.range.slice();
    }

    if (stgns.unknown) {
      s.unknown(stgns.unknown);
    } else if (theme && theme.palette('unknown')) {
      var un = theme.palette('unknown');
      s.unknown(un[0]);
    }

    if (Array.isArray(stgns.explicit.domain) && stgns.explicit.domain.length) {
      var domain = s.domain().slice();
      var explicitDomain = stgns.explicit.domain;
      var explicitRange = Array.isArray(stgns.explicit.range) ? stgns.explicit.range : [];

      // duplicate range values to cover entire domain
      var numCopies = Math.floor(domain.length / range.length);
      for (var i = 1; i < numCopies + 1; i *= 2) {
        range = range.concat(range);
      }

      if (stgns.explicit.override) {
        for (var _i = 0; _i < explicitDomain.length; _i++) {
          var index = domain.indexOf(explicitDomain[_i]);
          if (index > -1) {
            range[index] = explicitRange[_i];
          }
        }
      } else {
        // inject explicit colors
        var order = explicitDomain.map(function (d, i) {
          return [domain.indexOf(d), d, explicitRange[i]];
        }).sort(function (a, b) {
          return a[0] - b[0];
        });
        order.forEach(function (v) {
          var idx = domain.indexOf(v[1]);
          if (idx !== -1) {
            range.splice(idx, 0, v[2]);
          }
        });
      }

      // cutoff excess range values
      range.length = domain.length;
    }

    s.range(range);
    return s;
  }

  var scaleRegistry = registryFactory();

  scaleRegistry('linear', scaleLinear$$1);
  scaleRegistry('band', scaleBand$$1);
  scaleRegistry('h-band', scaleHierarchicalBand);
  scaleRegistry('sequential-color', scaleSequentialColor);
  scaleRegistry('threshold-color', scaleThresholdColor);
  scaleRegistry('categorical-color', scaleCategorical);

  function getTypeFromMeta(fields) {
    var types = fields.map(function (field) {
      return field.type() === 'dimension' ? 'band' : 'linear';
    });
    return types.indexOf('linear') !== -1 ? 'linear' : 'band';
  }

  function deduceScaleTypeFromData(data) {
    if (data.root) {
      return 'h-band';
    }

    if (data.fields && data.fields[0]) {
      return getTypeFromMeta(data.fields);
    }
    return 'linear';
  }

  function create$2(options, d, deps) {
    var dataSourceConfig = options.data;
    if (options.source) {
      // DEPRECATION
      deps.logger.warn('Deprecated: Scale data source configuration');
      dataSourceConfig = {
        extract: []
      };
      (Array.isArray(options.source) ? options.source : [options.source]).forEach(function (source) {
        dataSourceConfig.extract.push({
          field: source
        });
      });
    }

    var data = extract(dataSourceConfig, d, deps);
    var type = options.type || deduceScaleTypeFromData(data);
    var s = void 0;

    if (type === 'color') {
      if (data.fields && data.fields[0] && data.fields[0].type() === 'dimension') {
        type = 'categorical-color';
      } else {
        type = 'sequential-color';
      }
    }

    if (deps.scale.has(type)) {
      s = deps.scale.get(type);
      s = s(options, data, { theme: deps.theme, logger: deps.logger });
      s.type = type;
    }
    return s;
  }

  function getOrCreateScale(v, scales, d, deps) {
    var s = void 0;
    if (typeof v === 'string' && scales[v]) {
      // return by name
      s = scales[v];
    } else if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && 'scale' in v && scales[v.scale]) {
      // return by { scale: "name" }
      s = scales[v.scale];
    }

    return s || create$2(v, d, deps);
  }

  function builder$1(obj, d, deps) {
    var scales = {};
    for (var s in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, s)) {
        scales[s] = create$2(obj[s], d, deps);
      }
    }
    return scales;
  }

  /**
   * Utility functions
   */

  var util = {};

  util.isObject = function isObject(arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
  };

  util.isNumber = function isNumber(arg) {
    return typeof arg === 'number';
  };

  util.isUndefined = function isUndefined(arg) {
    return arg === void 0;
  };

  util.isFunction = function isFunction(arg) {
    return typeof arg === 'function';
  };

  /**
   * EventEmitter class
   */

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  var nodeEventEmitter = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function (n) {
    if (!util.isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  EventEmitter.prototype.emit = function (type) {
    var er, handler, len, args, i, listeners;

    if (!this._events) this._events = {};

    // If there is no 'error' event listener then throw.
    if (type === 'error' && !this._events.error) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw Error('Uncaught, unspecified "error" event.');
      }
      return false;
    }

    handler = this._events[type];

    if (util.isUndefined(handler)) return false;

    if (util.isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          len = arguments.length;
          args = new Array(len - 1);
          for (i = 1; i < len; i++) {
            args[i - 1] = arguments[i];
          }handler.apply(this, args);
      }
    } else if (util.isObject(handler)) {
      len = arguments.length;
      args = new Array(len - 1);
      for (i = 1; i < len; i++) {
        args[i - 1] = arguments[i];
      }listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++) {
        listeners[i].apply(this, args);
      }
    }

    return true;
  };

  EventEmitter.prototype.addListener = function (type, listener) {
    var m;

    if (!util.isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events) this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener) this.emit('newListener', type, util.isFunction(listener.listener) ? listener.listener : listener);

    if (!this._events[type])
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;else if (util.isObject(this._events[type]))
      // If we've already got an array, just append.
      this._events[type].push(listener);else
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (util.isObject(this._events[type]) && !this._events[type].warned) {
      var m;
      if (!util.isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;

        if (util.isFunction(console.error)) {
          console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
        }
        if (util.isFunction(console.trace)) console.trace();
      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function (type, listener) {
    if (!util.isFunction(listener)) throw TypeError('listener must be a function');

    var fired = false;

    function g() {
      this.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    g.listener = listener;
    this.on(type, g);

    return this;
  };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener = function (type, listener) {
    var list, position, length, i;

    if (!util.isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events || !this._events[type]) return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener || util.isFunction(list.listener) && list.listener === listener) {
      delete this._events[type];
      if (this._events.removeListener) this.emit('removeListener', type, listener);
    } else if (util.isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }

      if (this._events.removeListener) this.emit('removeListener', type, listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function (type) {
    var key, listeners;

    if (!this._events) return this;

    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }

    listeners = this._events[type];

    if (util.isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else if (Array.isArray(listeners)) {
      // LIFO order
      while (listeners.length) {
        this.removeListener(type, listeners[listeners.length - 1]);
      }
    }
    delete this._events[type];

    return this;
  };

  EventEmitter.prototype.listeners = function (type) {
    var ret;
    if (!this._events || !this._events[type]) ret = [];else if (util.isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    var ret;
    if (!emitter._events || !emitter._events[type]) ret = 0;else if (util.isFunction(emitter._events[type])) ret = 1;else ret = emitter._events[type].length;
    return ret;
  };

  var EventEmitter$1 = {
    /**
     * Function used to add event handling to objects passed in.
     * @private
     * @param {Object} obj Object instance that will get event handling.
     */
    mixin: function mixin(obj) {
      Object.keys(nodeEventEmitter.prototype).forEach(function (key) {
        obj[key] = nodeEventEmitter.prototype[key];
      });
      nodeEventEmitter.init(obj);
      return obj;
    }
  };

  function scrollApi() {
    var min = 0;
    var max = 0;
    var start = 0;
    var viewSize = 0;
    start = start || min;

    /**
     * The scroll api
     * @private
     * @alias scroll
     */
    var s = {
      /**
       * Move the current scroll
       * @param {number} value
       * @emits update
       */
      move: function move(value) {
        this.moveTo(start + value);
      },


      /**
       * Change the current scroll to a specific value
       * @param {number} value
       * @emits update
       */
      moveTo: function moveTo(value) {
        var newStart = Math.max(min, Math.min(max - viewSize, value));
        if (start !== newStart) {
          start = newStart;
          s.emit('update');
        }
      },


      /**
       * Update scroll settings
       * @param {number} [settings.min]
       * @param {number} [settings.max]
       * @param {number} [settings.viewSize]
       * @emits update
       */
      update: function update(settings) {
        var triggerUpdate = false;
        var _settings$min = settings.min;
        min = _settings$min === undefined ? min : _settings$min;
        var _settings$max = settings.max;
        max = _settings$max === undefined ? max : _settings$max;

        if (settings.viewSize !== undefined && settings.viewSize !== viewSize) {
          viewSize = settings.viewSize;
          triggerUpdate = true;
        }

        // update scroll to be within the new bounds
        var newStart = Math.max(min, Math.min(max - viewSize, start));
        if (start !== newStart) {
          start = newStart;
          triggerUpdate = true;
        }

        if (triggerUpdate) {
          s.emit('update');
        }
      },


      /**
       * Get the current scroll state
       * @return {object} with min, max, start & viewSize
       */
      getState: function getState() {
        return {
          min: min, max: max, start: start, viewSize: viewSize
        };
      }
    };

    EventEmitter$1.mixin(s);

    return s;
  }

  function createOrUpdate(options, oldApi) {
    var min = options.min || 0;
    var max = options.max || 0;
    var viewSize = options.viewSize || 0;

    var s = oldApi || scrollApi();
    s.update({ min: min, max: max, viewSize: viewSize });

    return s;
  }

  function builder$2(obj, oldScrollApis) {
    var scrollApis = {};
    for (var n in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, n)) {
        scrollApis[n] = createOrUpdate(obj[n], oldScrollApis ? oldScrollApis[n] : null);
      }
    }
    return scrollApis;
  }

  function getOrCreateScrollApi(v, scrollApis) {
    if (!scrollApis[v]) {
      scrollApis[v] = scrollApi();
    }
    return scrollApis[v];
  }

  function index(boundaries, point, after) {
    var i = 0;
    while (i < boundaries.length && point > boundaries[i]) {
      ++i;
    }
    if (boundaries[i] === point && after) {
      ++i;
    }
    return i;
  }

  function contains(boundaries, point) {
    var len = boundaries.length;

    for (var i = 1; i < len; i += 2) {
      if (boundaries[i - 1] <= point && point <= boundaries[i]) {
        return true;
      }
    }
    return false;
  }

  function rangeCollection() {
    var boundaries = [];

    function fn() {}

    fn.add = function (range) {
      var _boundaries;

      var min = range.min;
      var max = range.max;

      var i0 = index(boundaries, min);
      var i1 = index(boundaries, max, true);

      var args = [i0, i1 - i0];
      if (i0 % 2 === 0) {
        args.push(min);
      }
      if (i1 % 2 === 0) {
        args.push(max);
      }

      var before = boundaries.join(',');
      (_boundaries = boundaries).splice.apply(_boundaries, args);
      var after = boundaries.join(',');
      return before !== after;
    };

    fn.remove = function (range) {
      var _boundaries2;

      var min = range.min;
      var max = range.max;

      var i0 = index(boundaries, min);
      var i1 = index(boundaries, max, true);

      var args = [i0, i1 - i0];
      if (i0 % 2 === 1) {
        args.push(min);
      }
      if (i1 % 2 === 1) {
        args.push(max);
      }
      var before = boundaries.join(',');
      (_boundaries2 = boundaries).splice.apply(_boundaries2, args);
      var after = boundaries.join(',');
      return before !== after;
    };

    fn.set = function (range) {
      var before = boundaries.join(',');
      boundaries = [];
      if (Array.isArray(range)) {
        range.forEach(fn.add);
      } else {
        fn.add(range);
      }
      var after = boundaries.join(',');
      return before !== after;
    };

    fn.clear = function () {
      var before = boundaries.length > 0;
      boundaries = [];
      return before;
    };

    fn.containsValue = function (value) {
      return contains(boundaries, value);
    };

    fn.containsRange = function (range) {
      var min = range.min;
      var max = range.max;

      var i0 = index(boundaries, min, true);
      var i1 = index(boundaries, max);

      return i0 === i1 && i1 % 2 === 1;
    };

    fn.toggle = function (range) {
      if (fn.containsRange(range)) {
        return fn.remove(range);
      }
      return fn.add(range);
    };

    fn.ranges = function () {
      var collection = [];
      for (var i = 1; i < boundaries.length; i += 2) {
        collection.push({
          min: boundaries[i - 1],
          max: boundaries[i]
        });
      }
      return collection;
    };

    return fn;
  }

  function valueCollection() {
    var values = [];
    function vc() {}

    vc.add = function (value) {
      if (values.indexOf(value) === -1) {
        values.push(value);
        return true;
      }
      return false;
    };

    vc.remove = function (value) {
      var idx = values.indexOf(value);
      if (idx !== -1) {
        values.splice(idx, 1);
        return true;
      }
      return false;
    };

    vc.contains = function (value) {
      return values.indexOf(value) !== -1;
    };

    vc.values = function () {
      return values.slice();
    };

    vc.clear = function () {
      return values = [];
    };

    vc.toString = function () {
      return values.join(';');
    };

    return vc;
  }

  function add$1(_ref) {
    var items = _ref.items,
        collection = _ref.collection,
        vc = _ref.vc;

    var changedMap = {};
    var changed = [];
    var key = void 0;
    var values = void 0;

    for (var i = 0, num = items.length; i < num; i++) {
      key = items[i].key;
      if (!collection[key]) {
        collection[key] = vc();
      }
      values = items[i].values || [items[i].value];
      for (var vi = 0; vi < values.length; vi++) {
        if (collection[key].add(values[vi])) {
          changedMap[key] = changedMap[key] || [];
          changedMap[key].push(values[vi]);
        }
      }
    }

    var keys = Object.keys(changedMap);
    for (var _i = 0, _num = keys.length; _i < _num; _i++) {
      key = keys[_i];
      changed.push({ id: key, values: changedMap[key] });
    }

    return changed;
  }

  function remove(_ref2) {
    var items = _ref2.items,
        collection = _ref2.collection;

    var changedMap = {};
    var changed = [];
    var key = void 0;
    var values = void 0;

    for (var i = 0, num = items.length; i < num; i++) {
      key = items[i].key;
      if (!collection[key]) {
        continue;
      }
      values = items[i].values || [items[i].value];
      for (var vi = 0; vi < values.length; vi++) {
        if (collection[key].remove(values[vi])) {
          changedMap[key] = changedMap[key] || [];
          changedMap[key].push(values[vi]);
        }
      }
    }

    var keys = Object.keys(changedMap);
    for (var _i2 = 0, _num2 = keys.length; _i2 < _num2; _i2++) {
      key = keys[_i2];
      changed.push({ id: key, values: changedMap[key] });
    }

    return changed;
  }

  function collectUnique(items) {
    var filteredSet = {};
    var key = void 0;
    var values = void 0;

    for (var i = 0, num = items.length; i < num; i++) {
      key = items[i].key;
      values = items[i].values || [items[i].value];
      if (!filteredSet[key]) {
        filteredSet[key] = [];
      }
      for (var vi = 0; vi < values.length; vi++) {
        var idx = filteredSet[key].indexOf(values[vi]);
        if (idx === -1) {
          filteredSet[key].push(values[vi]);
        }
      }
    }

    return filteredSet;
  }

  function createValueCollection(_ref3) {
    var key = _ref3.key,
        collection = _ref3.collection,
        obj = _ref3.obj,
        fn = _ref3.fn,
        value = _ref3.value;

    if (!collection[key]) {
      collection[key] = fn();
    }
    obj[key] = obj[key] || [];
    obj[key].push(value);
    collection[key].add(value);
  }

  function toggle(_ref4) {
    var items = _ref4.items,
        values = _ref4.values,
        vc = _ref4.vc;

    var addedMap = {};
    var removedMap = {};
    var added = [];
    var removed = [];
    var filteredSet = collectUnique(items);
    var key = void 0;
    var value = void 0;
    var fs = void 0;

    var setKeys = Object.keys(filteredSet);
    for (var i = 0, num = setKeys.length; i < num; i++) {
      key = setKeys[i];
      fs = filteredSet[key];

      for (var k = 0, len = fs.length; k < len; k++) {
        value = fs[k];
        if (!values[key] || !values[key].contains(value)) {
          createValueCollection({
            key: key,
            value: value,
            collection: values,
            obj: addedMap,
            fn: vc
          });
        } else if (values[key] && values[key].contains(value)) {
          removedMap[key] = removedMap[key] || [];
          removedMap[key].push(value);
          values[key].remove(value);
        }
      }
    }

    var addedKeys = Object.keys(addedMap);
    for (var _i3 = 0, _num3 = addedKeys.length; _i3 < _num3; _i3++) {
      key = addedKeys[_i3];
      added.push({ id: key, values: addedMap[key] });
    }

    var removedKeys = Object.keys(removedMap);
    for (var _i4 = 0, _num4 = removedKeys.length; _i4 < _num4; _i4++) {
      key = removedKeys[_i4];
      removed.push({ id: key, values: removedMap[key] });
    }

    return [added, removed];
  }

  function diff(old, current) {
    var changed = [];
    var keys = Object.keys(old);
    var key = void 0;
    var changedValues = void 0;
    var filterFn = function filterFn(v) {
      return current[key].indexOf(v) === -1;
    };

    for (var i = 0, num = keys.length; i < num; i++) {
      key = keys[i];
      if (!current[key]) {
        changed.push({ id: key, values: old[key] });
      } else {
        changedValues = old[key].filter(filterFn);
        if (changedValues.length) {
          changed.push({ id: key, values: changedValues });
        }
      }
    }

    return changed;
  }

  function set$2(_ref5) {
    var items = _ref5.items,
        vCollection = _ref5.vCollection,
        vc = _ref5.vc;

    var addedMap = {};
    var filteredSet = collectUnique(items);
    var added = [];
    var removed = [];
    var key = void 0;

    var oldMap = {};
    var vcKeys = Object.keys(vCollection);
    for (var i = 0, num = vcKeys.length; i < num; i++) {
      key = vcKeys[i];
      oldMap[key] = vCollection[key].values().slice();
      delete vCollection[key];
    }

    var createValueCollectionFn = function createValueCollectionFn(value) {
      if (!vCollection[key] || !vCollection[key].contains(value)) {
        createValueCollection({
          key: key,
          value: value,
          collection: vCollection,
          obj: addedMap,
          fn: vc
        });
      }
    };

    var fsKeys = Object.keys(filteredSet);
    for (var _i5 = 0, _num5 = fsKeys.length; _i5 < _num5; _i5++) {
      key = fsKeys[_i5];
      filteredSet[key].forEach(createValueCollectionFn);
    }

    removed = diff(oldMap, addedMap);
    added = diff(addedMap, oldMap);

    return [added, removed];
  }

  function applyAliases(items, aliases) {
    if (!Object.keys(aliases).length) {
      return items;
    }
    var len = items.length;
    var its = Array(len);
    for (var i = 0; i < len; i++) {
      its[i] = items[i].key in aliases ? extend({}, items[i], { key: aliases[items[i].key] }) : items[i];
    }
    return its;
  }

  function intercept(handlers, items, aliases) {
    var its = applyAliases(items, aliases);
    return handlers && handlers.length ? handlers.reduce(function (value, interceptor) {
      return interceptor(value);
    }, its) : its;
  }

  function toCamelCase(s) {
    return s.replace(/(-[a-z])/g, function ($1) {
      return $1.toUpperCase().replace('-', '');
    });
  }

  function toSnakeCase(s) {
    return s.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
  }

  function updateRange(items, action, _ref6) {
    var ranges = _ref6.ranges,
        interceptors = _ref6.interceptors,
        rc = _ref6.rc,
        aliases = _ref6.aliases;

    var inter = action + 'Ranges';
    var its = intercept(interceptors[inter], items, aliases);
    var changed = false;
    its.forEach(function (item) {
      var key = item.key;
      if (!ranges[key]) {
        ranges[key] = rc();
      }
      if (action === 'set') {
        changed = ranges[key][action](item.ranges || item.range) || changed;
      } else {
        var rangeValues = item.ranges || [item.range];
        for (var i = 0; i < rangeValues.length; i++) {
          changed = ranges[key][action](rangeValues[i]) || changed;
        }
      }
    });

    return changed;
  }

  function brush() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref7$vc = _ref7.vc,
        vc = _ref7$vc === undefined ? valueCollection : _ref7$vc,
        _ref7$rc = _ref7.rc,
        rc = _ref7$rc === undefined ? rangeCollection : _ref7$rc;

    var activated = false;
    var ranges = {};
    var values = {};
    var aliases = {};
    var interceptors = {
      addValues: [],
      removeValues: [],
      toggleValues: [],
      setValues: [],
      addRanges: [],
      setRanges: [],
      removeRanges: [],
      toggleRanges: []
    };

    var getState = function getState() {
      var state = {
        values: {},
        ranges: {}
      };
      Object.keys(values).forEach(function (key) {
        state.values[key] = values[key].values();
      });
      Object.keys(ranges).forEach(function (key) {
        state.ranges[key] = ranges[key].ranges();
      });
      return state;
    };

    var links = {
      ls: [],
      clear: function clear() {
        this.ls.forEach(function (b) {
          return b.clear();
        });
      },
      start: function start() {
        this.ls.forEach(function (b) {
          return b.start();
        });
      },
      end: function end() {
        this.ls.forEach(function (b) {
          return b.end();
        });
      },
      update: function update() {
        var s = getState();
        this.ls.forEach(function (b) {
          return b._state(s);
        });
      },
      updateValues: function updateValues() {
        var s = getState();
        this.ls.forEach(function (b) {
          return b._state({
            values: s.values
          });
        });
      },
      updateRanges: function updateRanges() {
        var s = getState();
        this.ls.forEach(function (b) {
          return b._state({
            ranges: s.ranges
          });
        });
      }
    };

    /**
     * A brush context
     * @alias brush
     * @interface
     */
    var fn = {};

    /**
     * Link this brush to another brush instance.
     *
     * When linked, the `target` will receive updates whenever this brush changes.
     * @param {brush} target - The brush instance to link to
     */
    fn.link = function (target) {
      if (fn === target) {
        throw new Error('Can\'t link to self');
      }
      links.ls.push(target);
      target._state(getState());
    };

    fn._state = function (s) {
      if (!s) {
        return getState();
      }
      if (s.values) {
        var arr = [];
        Object.keys(s.values).forEach(function (key) {
          if (!values[key] || s.values[key].join(';') !== values[key].toString()) {
            arr.push({
              key: key,
              values: s.values[key]
            });
          }
        });
        Object.keys(values).forEach(function (key) {
          if (!s.values[key]) {
            arr.push({
              key: key,
              values: []
            });
          }
        });
        if (arr.length) {
          fn.setValues(arr);
        }
      }
      if (s.ranges) {
        var _arr = [];
        Object.keys(s.ranges).forEach(function (key) {
          if (!ranges[key] || s.ranges[key].join(';') !== ranges[key].toString()) {
            _arr.push({
              key: key,
              ranges: s.ranges[key]
            });
          }
        });
        Object.keys(ranges).forEach(function (key) {
          if (!s.ranges[key]) {
            _arr.push({
              key: key,
              ranges: []
            });
          }
        });
        if (_arr.length) {
          fn.setRanges(_arr);
        }
      }
      return undefined;
    };

    /**
     * Starts this brush context
     *
     * Starts this brush context and emits a 'start' event if it is not already started.
     * @emits brush#start
     */
    fn.start = function () {
      if (!activated) {
        activated = true;
        fn.emit('start');
        links.start();
      }
    };

    /**
     * Ends this brush context
     *
     * Ends this brush context and emits an 'end' event if it is not already ended.
     * @emits brush#start
     */
    fn.end = function () {
      if (!activated) {
        return;
      }
      activated = false;
      ranges = {};
      values = {};
      fn.emit('end');
      links.end();
    };

    /**
     * Checks if this brush is activated
     *
     * Returns true if started, false otherwise
     * @return {boolean}
     */
    fn.isActive = function () {
      return activated;
    };

    /**
     * Clears this brush context
     */
    fn.clear = function () {
      var removed = fn.brushes().filter(function (b) {
        return b.type === 'value' && b.brush.values().length;
      }).map(function (b) {
        return { id: b.id, values: b.brush.values() };
      });
      var hasChanged = Object.keys(ranges).length > 0 || removed.length;
      ranges = {};
      values = {};
      if (hasChanged) {
        fn.emit('update', [], removed); // TODO - do not emit update if state hasn't changed
        links.clear();
      }
    };

    /**
     * Returns all brushes within this context
     * @return {object}
     */
    fn.brushes = function () {
      var result = [];
      result = result.concat(Object.keys(ranges).map(function (key) {
        return {
          type: 'range',
          id: key,
          brush: ranges[key]
        };
      }));

      result = result.concat(Object.keys(values).map(function (key) {
        return {
          type: 'value',
          id: key,
          brush: values[key]
        };
      }));

      return result;
    };

    /**
     * Adds a primitive value to this brush context
     *
     * If this brush context is not started, a 'start' event is emitted.
     * If the state of the brush changes, ie. if the added value does not already exist, an 'update' event is emitted.
     *
     * @param {string} key  An identifier that represents the data source of the value
     * @param {string|number} value The value to add
     * @emits brush#start
     * @emits brush#update
     * @example
     * brush.addValue('countries', 'Sweden');
     * brush.addValue('/qHyperCube/qDimensionInfo/0', 3);
     */
    fn.addValue = function (key, value) {
      fn.addValues([{ key: key, value: value }]);
    };

    /**
     * @param {object[]} items Items to add
     */
    fn.addValues = function (items) {
      var its = intercept(interceptors.addValues, items, aliases);
      var added = add$1({
        vc: vc,
        collection: values,
        items: its
      });

      fn.emit('add-values', its);

      if (added.length) {
        if (!activated) {
          activated = true;
          fn.emit('start');
        }
        fn.emit('update', added, []);
        links.updateValues();
      }
    };

    /**
     * @param {object[]} items Items to set
     */
    fn.setValues = function (items) {
      var its = intercept(interceptors.setValues, items, aliases);
      var changed = set$2({
        items: its,
        vCollection: values,
        vc: vc
      });

      fn.emit('set-values', its);

      if (changed[0].length > 0 || changed[1].length > 0) {
        if (!activated) {
          activated = true;
          fn.emit('start');
        }
        fn.emit('update', changed[0], changed[1]);
        links.updateValues();
      }
    };

    /**
     * Removes a primitive values from this brush context
     *
     * If the state of the brush changes, ie. if the removed value does exist, an 'update' event is emitted.
     *
     * @param  {string} key  An identifier that represents the data source of the value
     * @param  {string|number} value The value to remove
     * @example
     * brush.removeValue('countries', 'Sweden');
     */
    fn.removeValue = function (key, value) {
      fn.removeValues([{ key: key, value: value }]);
    };

    /**
     * @param {object[]} items Items to remove
     */
    fn.removeValues = function (items) {
      var its = intercept(interceptors.removeValues, items, aliases);
      var removed = remove({
        collection: values,
        items: its
      });

      fn.emit('remove-values', its);

      if (removed.length) {
        fn.emit('update', [], removed);
        links.updateValues();
        // TODO - emit 'end' event if there are no remaining active brushes
      }
    };

    /**
     * Add and remove values in a single operation
     * almost the same as calling addValues and removeValues but only triggers one 'update' event
     *
     * If the state of the brush changes, an 'update' event is emitted.
     *
     * @param {object[]} addItems Items to add
     * @param {object[]} removeItems Items to remove
     */
    fn.addAndRemoveValues = function (addItems, removeItems) {
      var addIts = intercept(interceptors.addValues, addItems, aliases);
      var removeIts = intercept(interceptors.removeValues, removeItems, aliases);
      var added = add$1({
        vc: vc,
        collection: values,
        items: addIts
      });
      var removed = remove({
        collection: values,
        items: removeIts
      });

      fn.emit('add-values', addIts);
      fn.emit('remove-values', removeIts);

      if (added.length || removed.length) {
        if (!activated) {
          activated = true;
          fn.emit('start');
        }
        fn.emit('update', added, removed);
        links.updateValues();
      }
    };

    /**
     * Toggles a primitive value in this brush context
     *
     * If the given value exist in this brush context, it will be removed. If it does not exist it will be added.
     *
     * @param  {string} key  An identifier that represents the data source of the value
     * @param  {string|number} value The value to toggle
     * @example
     * brush.toggleValue('countries', 'Sweden');
     */
    fn.toggleValue = function (key, value) {
      fn.toggleValues([{ key: key, value: value }]);
    };

    /**
     * @param {object[]} items Items to toggle
     */
    fn.toggleValues = function (items) {
      var its = intercept(interceptors.toggleValues, items, aliases);
      var toggled = toggle({
        items: its,
        values: values,
        vc: vc
      });

      fn.emit('toggle-values', its);

      if (toggled[0].length > 0 || toggled[1].length > 0) {
        if (!activated) {
          activated = true;
          fn.emit('start');
        }
        fn.emit('update', toggled[0], toggled[1]);
        links.updateValues();
      }
    };

    /**
     * Checks if a certain value exists in this brush context
     *
     * Returns true if the values exists for the provided key, returns false otherwise.
     *
     * @param  {string} key  An identifier that represents the data source of the value
     * @param  {string|number} value The value to check for
     * @return {boolean}
     * @example
     * brush.addValue('countries', 'Sweden');
     * brush.containsValue('countries', 'Sweden'); // true
     * brush.toggleValue('countries', 'Sweden'); // remove 'Sweden'
     * brush.containsValue('countries', 'Sweden'); // false
     */
    fn.containsValue = function (key, value) {
      var k = aliases[key] || key;
      if (!values[k]) {
        return false;
      }
      return values[k].contains(value);
    };

    /**
     * Adds a numeric range to this brush context
     *
     * @param {string} key - An identifier that represents the data source of the range
     * @param {object} range - The range to add to this brush
     * @param {number} range.min - Min value of the range
     * @param {number} range.max - Max value of the range
     * @example
     * brush.addRange('Sales', { min: 20, max: 50 });
     */
    fn.addRange = function (key, range) {
      fn.addRanges([{ key: key, range: range }]);
    };

    /**
     * @see {brush.addRange}
     * @param {object[]} items - Items containing the ranges to remove
     * @param {string} items[].key
     * @param {object} items[].range
     */
    fn.addRanges = function (items) {
      var changed = updateRange(items, 'add', {
        ranges: ranges,
        rc: rc,
        interceptors: interceptors,
        aliases: aliases
      });

      if (!changed) {
        return;
      }

      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', [], []);
      links.updateRanges();
    };

    /**
     * Removes a numeric range from this brush context
     *
     * @param {string} key - An identifier that represents the data source of the range
     * @param {object} range - The range to remove from this brush
     * @param {number} range.min - Min value of the range
     * @param {number} range.max - Max value of the range
     */
    fn.removeRange = function (key, range) {
      fn.removeRanges([{ key: key, range: range }]);
    };

    /**
     * @see {brush.removeRange}
     * @param {object[]} items - Items containing the ranges to remove
     */
    fn.removeRanges = function (items) {
      var changed = updateRange(items, 'remove', {
        ranges: ranges,
        rc: rc,
        interceptors: interceptors,
        aliases: aliases
      });

      if (!changed) {
        return;
      }

      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', [], []);
      links.updateRanges();
    };

    /**
     * Sets a numeric range to this brush context
     *
     * Overwrites any active ranges identified by `key`
     *
     * @param {string} key - An identifier that represents the data source of the range
     * @param {object} range - The range to set on this brush
     * @param {number} range.min - Min value of the range
     * @param {number} range.max - Max value of the range
     */
    fn.setRange = function (key, range) {
      fn.setRanges([{ key: key, range: range }]);
    };

    /**
     * @see {brush.setRange}
     * @param {object[]} items - Items containing the ranges to set
     */
    fn.setRanges = function (items) {
      var changed = updateRange(items, 'set', {
        ranges: ranges,
        rc: rc,
        interceptors: interceptors,
        aliases: aliases
      });

      if (!changed) {
        return;
      }

      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', [], []);
      links.updateRanges();
    };

    /**
     * Toggles a numeric range in this brush context
     *
     * Removes the range if it's already contained within the given identifier,
     * otherwise the given range is added to the brush.
     *
     * @param {string} key - An identifier that represents the data source of the range
     * @param {object} range - The range to toggle in this brush
     * @param {number} range.min - Min value of the range
     * @param {number} range.max - Max value of the range
     */
    fn.toggleRange = function (key, range) {
      fn.toggleRanges([{ key: key, range: range }]);
    };

    /**
     * @see {brush.toggleRange}
     * @param {object[]} items - Items containing the ranges to toggle
     */
    fn.toggleRanges = function (items) {
      var changed = updateRange(items, 'toggle', {
        ranges: ranges,
        rc: rc,
        interceptors: interceptors,
        aliases: aliases
      });

      if (!changed) {
        return;
      }

      if (!activated) {
        activated = true;
        fn.emit('start');
      }
      fn.emit('update', [], []);
      links.updateRanges();
    };

    /**
     * Checks if a value is contained within a range in this brush context
     *
     * Returns true if the values exists for the provided key, returns false otherwise.
     *
     * @param  {string} key - An identifier that represents the data source of the value
     * @param  {number} value - The value to check for
     * @return {boolean}
     * @example
     * brush.addRange('Sales', { min: 10, max: 50 });
     * brush.containsRangeValue('Sales', 30); // true
     * brush.containsRangeValue('Sales', 5); // false
     */
    fn.containsRangeValue = function (key, value) {
      var k = aliases[key] || key;
      if (!ranges[k]) {
        return false;
      }
      return ranges[k].containsValue(value);
    };

    /**
     * Checks if a range segment is contained within this brush context
     *
     * Returns true if the range segment exists for the provided key, returns false otherwise.
     *
     * @param {string} key - An identifier that represents the data source of the value
     * @param {object} range - The range to check for
     * @param {number} range.min - Min value of the range
     * @param {number} range.max - Max value of the range
     * @return {boolean}
     * @example
     * brush.addRange('Sales', { min: 10, max: 50 });
     * brush.containsRange('Sales', { min: 15, max: 20 }); // true - the range segment is fully contained within [10, 50]
     * brush.containsRange('Sales', { min: 5, max: 20 }); // false - part of the range segment is outside [10, 50]
     * brush.containsRange('Sales', { min: 30, max: 80 }); // false - part of the range segment is outside [10, 50]
     */
    fn.containsRange = function (key, range) {
      var k = aliases[key] || key;
      if (!ranges[k]) {
        return false;
      }
      return ranges[k].containsRange(range);
    };

    fn.containsMappedData = function (d, props, mode) {
      var status = [];
      var keys = Object.keys(d);
      var key = void 0;
      var item = void 0;
      var source = void 0;
      var value = void 0;

      for (var i = 0, num = keys.length; i < num; i++) {
        key = keys[i];
        if (key === 'value') {
          item = d;
          status[i] = { key: '', i: i, bool: false };
        } else if (key === 'source') {
          continue;
        } else {
          item = d[key];
          status[i] = { key: key, i: i, bool: false };
        }
        source = item.source && item.source.field;
        if (typeof source === 'undefined') {
          continue;
        }
        if (typeof item.source.key !== 'undefined') {
          source = item.source.key + '/' + source;
        }

        if (source in aliases) {
          source = aliases[source];
        }

        value = item.value;
        if (ranges[source]) {
          status[i].bool = Array.isArray(value) ? ranges[source].containsRange({ min: value[0], max: value[1] }) : ranges[source].containsValue(value);
        } else if (values[source] && values[source].contains(value)) {
          status[i].bool = true;
        }
      }

      if (props) {
        status = status.filter(function (b) {
          return props.indexOf(b.key) !== -1;
        });
        if (mode === 'and') {
          return !!status.length && !status.some(function (s) {
            return s.bool === false;
          });
        } else if (mode === 'xor') {
          return !!status.length && status.some(function (s) {
            return s.bool;
          }) && status.some(function (s) {
            return s.bool === false;
          });
        }
        // !mode || mode === 'or'
        return status.some(function (s) {
          return s.bool;
        });
      }
      return status.some(function (s) {
        return s.bool;
      });
    };

    /**
     * Adds an event interceptor
     *
     * @param {string} name Name of the event to intercept
     * @param {function} ic Handler to call before event is triggered
     * @example
     * brush.intercept('add-values', items => {
     *  console.log('about to add the following items', items);
     *  return items;
     * });
     */
    fn.intercept = function (name, ic) {
      var s = toCamelCase(name);
      if (!interceptors[s]) {
        return;
      }
      interceptors[s].push(ic);
    };

    /**
     * Removes an interceptor
     *
     * @param {string} name Name of the event to intercept
     * @param {function} ic Handler to remove
     */
    fn.removeInterceptor = function (name, ic) {
      var s = toCamelCase(name);
      if (!interceptors[s]) {
        return;
      }
      var idx = interceptors[s].indexOf(ic);
      if (idx !== -1) {
        interceptors[s].splice(idx, 1);
      }
    };

    /**
     * Removes all interceptors
     *
     * @param {string} [name] Name of the event to remove interceptors for. If not provided, removes all interceptors.
     */
    fn.removeAllInterceptors = function (name) {
      var toRemove = [];
      if (name) {
        var s = toCamelCase(name);
        if (interceptors[s] && interceptors[s].length) {
          toRemove.push({ name: name, handlers: interceptors[s] });
        }
      } else {
        Object.keys(interceptors).forEach(function (n) {
          if (interceptors[n].length) {
            toRemove.push({ name: toSnakeCase(n), handlers: interceptors[n] });
          }
        });
      }

      toRemove.forEach(function (ic) {
        var interceptorHandlers = ic.handlers.slice();
        interceptorHandlers.forEach(function (handler) {
          return fn.removeInterceptor(ic.name, handler);
        });
      });
    };

    /**
     * Adds an alias to the given key
     *
     * @param {string} key - Value to be replaced
     * @param {string} alias - Value to replace key with
     * @example
     * brush.addKeyAlias('BadFieldName', 'Region');
     * brush.addValue('BadFieldName', 'Sweden'); // 'BadFieldName' will be stored as 'Region'
     * brush.containsValue('Region', 'Sweden'); // true
     * brush.containsValue('BadFieldName', 'Sweden'); // true
     */
    fn.addKeyAlias = function (key, alias) {
      aliases[key] = alias;
    };

    /**
     * Removes an alias
     *
     * This will only remove the key to alias mapping for new manipulations of the brush,
     * no changes will be made to the current state of this brush.
     *
     * @param {string} key - Value to remove as alias
     * @example
     * brush.removeKeyAlias('BadFieldName');
     */
    fn.removeKeyAlias = function (key) {
      delete aliases[key];
    };

    EventEmitter$1.mixin(fn);

    return fn;
  }

  /**
   * Triggered when this brush is activated
   * @event brush#start
   * @type {string}
   */

  /**
   * Triggered when this brush is updated
   * @event brush#update
   * @type {string}
   * @param {Array<object>} added - The added items
   * @param {Array<object>} removed - The removed items
   */

  /**
   * Triggered when this brush is deactivated
   * @event brush#end
   * @type {string}
   */

  var reg = registryFactory();

  var typeMixins = registryFactory();
  var mixins$1 = [];

  function list$1(type) {
    return mixins$1.concat(typeMixins.get(type) || []);
  }

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var pi$2 = Math.PI;

  var tau$2 = 2 * Math.PI,
      amplitude = 1,
      period = 0.3;

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

  /* globals window */

  function nodeId(node, i) {
    if (node.data) {
      return node.data.value;
    } else if (node.type === 'text') {
      return node.text;
    }
    return i;
  }

  function tween(_ref, _ref2, config) {
    var old = _ref.old,
        current = _ref.current;
    var renderer = _ref2.renderer;

    var ticker = void 0;
    // let staticNodes = [];
    var toBeUpdated = [];
    var entered = { nodes: [], ips: [] };
    var exited = { nodes: [], ips: [] };
    var updated = { nodes: [], ips: [] };
    var stages = [];
    var trackBy = config.trackBy || nodeId;

    var tweener = {
      start: function start() {
        var ids = {};
        old.forEach(function (node, i) {
          var id = trackBy(node, i);
          ids[id] = node;
        });
        current.forEach(function (node, i) {
          var id = trackBy(node, i);
          if (ids[id]) {
            updated.ips.push(object(ids[id], node));
            updated.nodes.push(node);
            toBeUpdated.push(ids[id]);
            ids[id] = false;
          } else {
            entered.nodes.push(node);
            entered.ips.push(object({
              r: 0.001,
              opacity: 0
            }, node));
          }
        });
        Object.keys(ids).forEach(function (key) {
          if (ids[key]) {
            exited.nodes.push(ids[key]);
            exited.ips.push(object(ids[key], extend({}, ids[key], { r: 0.0001, opacity: 0 })));
          }
        });
        if (exited.ips.length) {
          stages.push({
            easing: cubicInOut,
            duration: 200,
            tweens: exited.ips,
            nodes: [].concat(toBeUpdated)
          });
        }
        if (updated.ips.length) {
          stages.push({
            easing: cubicInOut,
            duration: 400,
            tweens: updated.ips,
            nodes: []
          });
        }
        if (entered.ips.length) {
          stages.push({
            easing: elasticOut,
            duration: 1200,
            tweens: entered.ips,
            nodes: [].concat(toConsumableArray(updated.nodes))
          });
        }
        // console.log(stages);
        if (stages.length) {
          stages[0].started = Date.now();
          if (typeof window !== 'undefined') {
            ticker = window.requestAnimationFrame(tweener.tick);
          }
        }
      },
      tick: function tick() {
        var currentStage = stages[0];
        if (!currentStage) {
          tweener.stop();
        }
        if (!currentStage.started) {
          currentStage.started = Date.now();
        }
        var t = (Date.now() - currentStage.started) / currentStage.duration;
        var currentNodes = [];
        var tweenedNodes = currentStage.tweens.map(function (ip) {
          return ip(currentStage.easing(Math.min(1, t)));
        });
        currentNodes.push.apply(currentNodes, toConsumableArray(tweenedNodes));
        currentNodes.push.apply(currentNodes, toConsumableArray(currentStage.nodes));
        // currentNodes.push(...staticNodes);
        // stages.slice(1).forEach(stage => currentNodes.push(...stage.nodes));
        renderer.render(currentNodes);
        if (t >= 1) {
          // staticNodes.push(...currentStage.nodes);
          stages.shift();
          if (!stages.length) {
            tweener.stop();
          }
        }
        if (ticker) {
          ticker = window.requestAnimationFrame(tweener.tick);
        }
      },
      stop: function stop() {
        if (ticker) {
          window.cancelAnimationFrame(ticker);
          ticker = false;
        }
      }
    };

    return tweener;
  }

  var GLOBAL_DEFAULTS = {
    fontFamily: 'Arial',
    fontSize: '13px',
    color: '#595959',
    backgroundColor: '#ffffff',
    stroke: '#000000',
    strokeWidth: 0,
    $fill: '#333333'
  };

  var REF_RX = /^\$/;

  function isPrimitive(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return type !== 'object' && type !== 'function' && type !== 'undefined';
  }

  /**
   * @callback datum-accessor
   * @param {datum-extract} d
   */

  /**
   * @typedef {object} datum-config
   * @property {string} [scale]
   * @property {datum-accessor} fn
   * @property {string} ref - A reference to a datum-extract property
   */

  /**
   * @typedef {string|datum-config|datum-accessor} datum-string
   */

  /**
   * @typedef {number|datum-config|datum-accessor} datum-number
   */

  /**
   * Normalizes property settings
   *
   * @ignore
   * @export
   * @param {any} settings
   * @param {any} defaults
   * @param {any} chart
   * @returns {any}
   */
  function normalizeSettings(settings, defaults$$1, chart) {
    var composition = extend({}, settings);
    var defs = extend({}, defaults$$1);
    Object.keys(composition).forEach(function (key) {
      defs[key] = {};
      var v = composition[key];
      var vType = typeof v === 'undefined' ? 'undefined' : _typeof(v);
      if (typeof v === 'function') {
        defs[key].fn = v;
      } else if (isPrimitive(v)) {
        var defaultValue = defaults$$1[key];
        if (typeof defaultValue === 'string' && REF_RX.test(defaultValue)) {
          defaultValue = GLOBAL_DEFAULTS[defaultValue];
        }
        var defaultType = typeof defaultValue === 'undefined' ? 'undefined' : _typeof(defaultValue);
        if (defaultType === 'undefined') {
          // if property has no default, assign provided value
          defs[key] = v;
        } else {
          // assign provided value if it's of same type as default, otherwise use default
          defs[key] = defaultType === vType ? v : defaultValue;
        }
      } else if (v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
        if (typeof v.fn === 'function') {
          defs[key].fn = v.fn;
        }
        if (typeof v.scale !== 'undefined') {
          defs[key].scale = chart.scale(v.scale);
        }
        if (typeof v.ref === 'string') {
          defs[key].ref = v.ref;
        }
      }
    });

    Object.keys(defaults$$1).forEach(function (key) {
      if (key in composition) {
        // don't process same props again
        return;
      }
      var v = defaults$$1[key];
      var defaultType = typeof v === 'undefined' ? 'undefined' : _typeof(v);
      if (defaultType === 'string' && REF_RX.test(v)) {
        defs[key] = GLOBAL_DEFAULTS[v];
      } else {
        defs[key] = v;
      }
    });

    return defs;
  }

  function resolveForItem(context, normalized) {
    var ret = {};
    var keys = Object.keys(normalized);
    var len = keys.length;
    var fallbackData = context.datum;
    var datum = context.datum;
    var dataContext = context.data && context.data.items;
    var idx = dataContext ? dataContext.indexOf(datum) : -1;
    for (var i = 0; i < len; i++) {
      var key = keys[i];
      var normalizedProp = normalized[key];
      var exists = (typeof datum === 'undefined' ? 'undefined' : _typeof(datum)) === 'object' && typeof normalizedProp !== 'undefined';
      var hasExplicitDataProp = exists && typeof normalizedProp.ref === 'string';
      var hasImplicitDataProp = exists && key in datum;
      var propData = hasExplicitDataProp ? datum[normalizedProp.ref] : hasImplicitDataProp ? datum[key] : fallbackData; // eslint-disable-line
      if (isPrimitive(normalizedProp)) {
        ret[key] = normalizedProp;
      } else if (exists && normalizedProp.fn) {
        // callback function
        if (normalizedProp.scale) {
          context.scale = normalizedProp.scale;
        }
        ret[key] = normalizedProp.fn.call(null, context, idx);
      } else if (exists && normalizedProp.scale && propData) {
        ret[key] = normalizedProp.scale(propData.value);
        if (normalizedProp.scale.bandwidth) {
          ret[key] += normalizedProp.scale.bandwidth() / 2;
        }
      } else if (hasExplicitDataProp && propData) {
        ret[key] = propData.value;
      } else if (normalizedProp.fn) {
        ret[key] = normalizedProp.fn.call(null, context, idx);
      } else {
        ret[key] = normalizedProp;
      }
    }
    return ret;
  }

  function updateScaleSize(object, path, size) {
    var o = object[path];
    if (o && o.scale && o.scale.pxScale) {
      o.scale = o.scale.pxScale(size);
    } else if (o && o.pxScale) {
      object[path] = o.pxScale(size);
    }
  }

  function scaleWithSize(scale, size) {
    return scale.pxScale ? scale.pxScale(size) : scale;
  }

  var externals = {
    normalizeSettings: normalizeSettings,
    resolveForItem: resolveForItem,
    updateScaleSize: updateScaleSize
  };

  function settingsResolver (resources) {
    var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : externals;

    var cache = {};

    function resolve(_ref) {
      var data = _ref.data,
          settings = _ref.settings,
          _ref$defaults = _ref.defaults,
          defaults = _ref$defaults === undefined ? {} : _ref$defaults,
          scaled = _ref.scaled;

      var norm = cache.norm = deps.normalizeSettings(settings, defaults, resources.chart);

      var res = {
        scale: resources.chart.scale,
        formatter: resources.chart.formatter
      };

      if (scaled) {
        Object.keys(scaled).forEach(function (key) {
          if (norm[key]) {
            deps.updateScaleSize(norm, key, scaled[key]);
          }
        });
      }

      var resolved = [];

      if (data && Array.isArray(data.items)) {
        for (var i = 0, len = data.items.length; i < len; i++) {
          var context = {
            datum: data.items[i],
            data: data,
            resources: res
          };
          var obj = deps.resolveForItem(context, cache.norm);
          obj.data = data.items[i];
          resolved.push(obj);
        }
      } else {
        var _context = {
          data: data,
          resources: res
        };
        var _obj = deps.resolveForItem(_context, cache.norm);
        return {
          settings: cache.norm,
          item: _obj
        };
      }

      return {
        settings: cache.norm,
        items: resolved
      };
    }

    return {
      resolve: resolve
    };
  }

  /**
   * Flatten the array of nodes by removing any containers as they do not support styling, thus unable to brush them.
   * @param {array} nodes
   * @ignore
   */
  function reduceToLeafNodes() {
    var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return nodes.reduce(function (ary, node) {
      if (Array.isArray(node.children)) {
        return ary.concat(reduceToLeafNodes(node.children));
      }
      ary.push(node);
      return ary;
    }, []);
  }

  function styler(obj, _ref) {
    var context = _ref.context,
        data = _ref.data,
        style = _ref.style;

    var brusher = obj.chart.brush(context);
    var dataProps = data;
    var active = style.active || {};
    var inactive = style.inactive || {};
    var styleProps = [];
    Object.keys(active).forEach(function (key) {
      styleProps.push(key);
    });

    Object.keys(inactive).forEach(function (key) {
      if (styleProps.indexOf(key) === -1) {
        styleProps.push(key);
      }
    });

    var activeNodes = [];
    var globalActivation = false; // track when we need to loop through all nodes, not just the active ones

    var update = function update() {
      // TODO - render nodes only once, i.e. don't render for each brush, update nodes for all brushes and then render
      var nodes = reduceToLeafNodes(obj.nodes);
      var len = nodes.length;
      var nodeData = void 0;
      var globalChanged = false;

      var _loop = function _loop(i) {
        // TODO - update only added and removed nodes
        nodeData = nodes[i].data;
        if (!nodeData) {
          return 'continue';
        }

        if (!nodes[i].__style) {
          nodes[i].__style = {};
          styleProps.forEach(function (s) {
            nodes[i].__style[s] = nodes[i][s]; // store original value
          });
        }

        var isActive = brusher.containsMappedData(nodeData, dataProps);
        var activeIdx = activeNodes.indexOf(nodes[i]);
        var changed = false;
        if (isActive && activeIdx === -1) {
          // activated
          activeNodes.push(nodes[i]);
          changed = true;
        } else if (!isActive && activeIdx !== -1) {
          // was active
          activeNodes.splice(activeIdx, 1);
          changed = true;
        }
        if (changed || globalActivation) {
          styleProps.forEach(function (s) {
            if (isActive && s in active) {
              nodes[i][s] = active[s];
            } else if (!isActive && s in inactive) {
              nodes[i][s] = inactive[s];
            } else {
              if (!nodes[i].__style) {
                nodes[i].__style = nodes[i].__style || {};
                styleProps.forEach(function (ss) {
                  nodes[i].__style[ss] = nodes[i][ss]; // store original value
                });
              }
              nodes[i][s] = nodes[i].__style[s];
            }
          });
          globalChanged = true;
        }
      };

      for (var i = 0; i < len; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }
      globalActivation = false;
      return globalChanged;
    };

    var onStart = function onStart() {
      var nodes = reduceToLeafNodes(obj.nodes);
      var len = nodes.length;

      var _loop2 = function _loop2(i) {
        nodes[i].__style = nodes[i].__style || {};
        styleProps.forEach(function (s) {
          nodes[i].__style[s] = nodes[i][s]; // store original value
          if (s in inactive) {
            nodes[i][s] = inactive[s];
          }
        });
      };

      for (var i = 0; i < len; i++) {
        _loop2(i);
      }
      globalActivation = true;
      activeNodes.length = 0;
      obj.renderer.render(obj.nodes);
    };

    var onEnd = function onEnd() {
      var nodes = reduceToLeafNodes(obj.nodes);
      var len = nodes.length;

      var _loop3 = function _loop3(i) {
        if (nodes[i].__style) {
          Object.keys(nodes[i].__style).forEach(function (s) {
            nodes[i][s] = nodes[i].__style[s];
          });
          nodes[i].__style = undefined;
        }
      };

      for (var i = 0; i < len; i++) {
        _loop3(i);
      }
      activeNodes.length = 0;
      obj.renderer.render(obj.nodes);
    };
    var onUpdate = function onUpdate() /* added, removed */{
      var changed = update();
      if (changed) {
        obj.renderer.render(obj.nodes);
      }
    };

    var externalUpdate = function externalUpdate() {
      activeNodes.length = 0;
      globalActivation = true;
      update();
    };

    brusher.on('start', onStart);
    brusher.on('end', onEnd);
    brusher.on('update', onUpdate);

    function cleanUp() {
      brusher.removeListener('start', onStart);
      brusher.removeListener('end', onEnd);
      brusher.removeListener('update', onUpdate);
    }

    return {
      isActive: function isActive() {
        return brusher.isActive();
      },

      update: externalUpdate,
      cleanUp: cleanUp
    };
  }

  function brushDataPoints(_ref2) {
    var dataPoints = _ref2.dataPoints,
        action = _ref2.action,
        chart = _ref2.chart,
        trigger = _ref2.trigger;

    if (!trigger) {
      return;
    }

    var dataProps = trigger.data || [''];

    var rangeBrush = {
      items: [],
      actionFn: 'toggleRanges'
    };
    var valueBrush = {
      items: [],
      actionFn: 'toggleValues'
    };

    if (['add', 'remove', 'set', 'toggle'].indexOf(action) !== -1) {
      rangeBrush.actionFn = action + 'Ranges';
      valueBrush.actionFn = action + 'Values';
    }

    var _loop4 = function _loop4(i) {
      var dataPoint = dataPoints[i];
      if (!dataPoint) {
        return 'continue';
      }
      dataProps.forEach(function (p) {
        var d = dataPoint && !p ? dataPoint : dataPoint[p];
        if (d) {
          var it = { key: d.source.field };
          if (typeof d.source.key !== 'undefined') {
            it.key = d.source.key + '/' + d.source.field;
          }
          if (Array.isArray(d.value)) {
            it.range = { min: d.value[0], max: d.value[1] };
            rangeBrush.items.push(it);
          } else {
            it.value = d.value;
            valueBrush.items.push(it);
          }
        }
      });
    };

    for (var i = 0; i < dataPoints.length; i++) {
      var _ret4 = _loop4(i);

      if (_ret4 === 'continue') continue;
    }

    trigger.contexts.forEach(function (c) {
      if (rangeBrush.items.length) {
        chart.brush(c)[rangeBrush.actionFn](rangeBrush.items);
      } else {
        chart.brush(c)[valueBrush.actionFn](valueBrush.items); // call action even if there are items to potentially clear what is currently in the brush
      }
    });
  }

  function brushFromSceneNodes(_ref3) {
    var nodes = _ref3.nodes,
        action = _ref3.action,
        chart = _ref3.chart,
        trigger = _ref3.trigger;

    var dataPoints = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var nodeData = node.data;
      if (nodeData !== null) {
        dataPoints.push(nodeData);
      }
    }

    brushDataPoints({
      dataPoints: dataPoints,
      action: action,
      chart: chart,
      trigger: trigger
    });
  }

  function resolveEvent(_ref4) {
    var collisions = _ref4.collisions,
        t = _ref4.t,
        config = _ref4.config,
        action = _ref4.action;

    var brushCollisions = [];
    var resolved = false;

    if (collisions.length > 0) {
      brushCollisions = collisions;
      resolved = true;

      if (t.propagation === 'stop') {
        brushCollisions = [collisions[collisions.length - 1]];
      }
    }

    var nodes = brushCollisions.map(function (c) {
      return c.node;
    });
    brushFromSceneNodes({
      nodes: nodes,
      action: action,
      chart: config.chart,
      data: config.data,
      trigger: t
    });

    return resolved;
  }

  function touchSingleContactPoint(e, rect) {
    if (e.changedTouches.length !== 1) {
      return null;
    }

    return {
      x: e.changedTouches[0].clientX - rect.left,
      y: e.changedTouches[0].clientY - rect.top
    };
  }

  function singleContactPoint(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function resolveCollisions(e, t, renderer) {
    var rect = renderer.element().getBoundingClientRect();
    var p = isTouchEvent(e) ? touchSingleContactPoint(e, rect) : singleContactPoint(e, rect);

    if (p === null || p.x < 0 || p.y < 0 || p.x > rect.width || p.y > rect.height) {
      // TODO include radius in this check?
      return [];
    }

    if (t.touchRadius > 0 && isTouchEvent(e)) {
      p = {
        cx: p.x,
        cy: p.y,
        r: t.touchRadius // TODO Use touch event radius/width value (Need to handle dpi scaling as well)
      };
    }

    return renderer.itemsAt(p);
  }

  function resolveAction(action, e, def) {
    if (action) {
      if (typeof action === 'function') {
        return action(e);
      }
      return action;
    }
    return def;
  }

  function resolveTapEvent(_ref5) {
    var e = _ref5.e,
        t = _ref5.t,
        config = _ref5.config;

    var collisions = resolveCollisions(e, t, config.renderer);

    return resolveEvent({
      collisions: collisions, t: t, config: config, action: resolveAction(t.action, e, 'toggle')
    });
  }

  function resolveOverEvent(_ref6) {
    var e = _ref6.e,
        t = _ref6.t,
        config = _ref6.config;

    var collisions = resolveCollisions(e, t, config.renderer);

    return resolveEvent({
      collisions: collisions, t: t, config: config, action: resolveAction(t.action, e, 'set')
    });
  }

  /* eslint camelcase: 1 */

  var isReservedProperty = function isReservedProperty(prop) {
    return ['on', 'preferredSize', 'created', 'beforeMount', 'mounted', 'resize', 'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeUnmount', 'beforeDestroy', 'destroyed', 'defaultSettings', 'data', 'settings', 'formatter', 'scale', 'chart', 'dockConfig', 'mediator', 'style', 'resolver', 'registries', '_DO_NOT_USE_getInfo'].some(function (name) {
      return name === prop;
    });
  };

  function prepareContext(ctx, definition, opts) {
    var _definition$require = definition.require,
        require = _definition$require === undefined ? [] : _definition$require;

    var mediatorSettings = definition.mediator || {};
    var settings = opts.settings,
        formatter = opts.formatter,
        scale = opts.scale,
        data = opts.data,
        renderer = opts.renderer,
        chart = opts.chart,
        dockConfig = opts.dockConfig,
        mediator = opts.mediator,
        instance = opts.instance,
        style = opts.style,
        registries = opts.registries,
        resolver = opts.resolver,
        update = opts.update,
        _DO_NOT_USE_getInfo = opts._DO_NOT_USE_getInfo;

    // TODO add setters and log warnings / errors to console

    Object.defineProperty(ctx, 'settings', {
      get: settings
    });
    Object.defineProperty(ctx, 'data', {
      get: data
    });
    Object.defineProperty(ctx, 'formatter', {
      get: formatter
    });
    Object.defineProperty(ctx, 'scale', {
      get: scale
    });
    Object.defineProperty(ctx, 'mediator', {
      get: mediator
    });
    Object.defineProperty(ctx, 'style', {
      get: style
    });
    Object.defineProperty(ctx, 'registries', {
      get: registries
    });

    // TODO _DO_NOT_USE_getInfo is a temporary solution to expose info from a component
    // It should replace ASAP with a proper solution.
    // The only component activaly in need of it is the legend-cat
    if (_DO_NOT_USE_getInfo) {
      ctx._DO_NOT_USE_getInfo = _DO_NOT_USE_getInfo;
    }

    Object.keys(definition).forEach(function (key) {
      if (!isReservedProperty(key)) {
        // Add non-lifecycle methods to the context
        if (typeof definition[key] === 'function') {
          ctx[key] = definition[key].bind(ctx);
        } else {
          ctx[key] = definition[key];
        }
      }
    });

    // Add properties to context
    require.forEach(function (req) {
      if (req === 'renderer') {
        Object.defineProperty(ctx, 'renderer', {
          get: renderer
        });
      } else if (req === 'chart') {
        Object.defineProperty(ctx, 'chart', {
          get: chart
        });
      } else if (req === 'dockConfig') {
        Object.defineProperty(ctx, 'dockConfig', {
          get: dockConfig
        });
      } else if (req === 'instance') {
        Object.defineProperty(ctx, 'instance', {
          get: instance
        });
      } else if (req === 'update' && update) {
        Object.defineProperty(ctx, 'update', {
          get: update
        });
      } else if (req === 'resolver') {
        Object.defineProperty(ctx, 'resolver', {
          get: resolver
        });
      }
    });

    Object.keys(mediatorSettings).forEach(function (eventName) {
      ctx.mediator.on(eventName, mediatorSettings[eventName].bind(ctx));
    });
  }

  function updateDockConfig(config, settings) {
    config.displayOrder = settings.displayOrder;
    config.dock = settings.dock;
    config.prioOrder = settings.prioOrder;
    config.minimumLayoutMode = settings.minimumLayoutMode;
    config.show = settings.show;
    return config;
  }

  function setUpEmitter(ctx, emitter, settings) {
    // Object.defineProperty(ctx, 'emitter', )
    Object.keys(settings.on || {}).forEach(function (event) {
      ctx.eventListeners = ctx.eventListeners || [];
      var listener = settings.on[event].bind(ctx);
      ctx.eventListeners.push({ event: event, listener: listener });
      emitter.on(event, listener);
    });
    ctx.emit = function (name) {
      for (var _len = arguments.length, event = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        event[_key - 1] = arguments[_key];
      }

      return emitter.emit.apply(emitter, [name].concat(event));
    };
  }

  // First render
  // preferredSize -> resize -> beforeRender -> render -> mounted

  // Normal update
  // beforeUpdate -> preferredSize -> resize -> beforeRender -> render -> updated

  // Update without relayout
  // beforeUpdate -> beforeRender -> render -> updated

  // TODO support es6 classes
  function componentFactory(definition) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _definition$defaultSe = definition.defaultSettings,
        defaultSettings = _definition$defaultSe === undefined ? {} : _definition$defaultSe,
        _definition$_DO_NOT_U = definition._DO_NOT_USE_getInfo,
        _DO_NOT_USE_getInfo = _definition$_DO_NOT_U === undefined ? function () {
      return {};
    } : _definition$_DO_NOT_U;

    var _chart = options.chart,
        container = options.container,
        _mediator = options.mediator,
        _registries = options.registries,
        theme = options.theme,
        renderer = options.renderer;

    var config = options.settings || {};
    var emitter = EventEmitter$1.mixin({});
    var _settings = extend(true, {}, defaultSettings, config);
    var _data = [];
    var _scale = void 0;
    var _formatter = void 0;
    var element = void 0;
    var size = void 0;
    var _style = void 0;
    var _resolver = settingsResolver({
      chart: _chart
    });

    var brushArgs = {
      nodes: [],
      chart: _chart,
      config: _settings.brush || {},
      renderer: null
    };
    var brushTriggers = {
      tap: [],
      over: []
    };
    var brushStylers = [];
    var componentMixins = list$1(_settings.type);
    var definitionContext = {};
    var instanceContext = extend({}, config, componentMixins.filter(function (mixinName) {
      return !isReservedProperty(mixinName);
    }));

    // Create a callback that calls lifecycle functions in the definition and config (if they exist).
    function createCallback(method) {
      var defaultMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      return function cb() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var inDefinition = typeof definition[method] === 'function';
        var inConfig = typeof config[method] === 'function';

        var returnValue = void 0;
        if (inDefinition) {
          var _definition$method;

          returnValue = (_definition$method = definition[method]).call.apply(_definition$method, [definitionContext].concat(args));
        }
        if (typeof config[method] === 'function') {
          var _config$method;

          returnValue = (_config$method = config[method]).call.apply(_config$method, [instanceContext].concat(args));
        }
        if (!inDefinition && !inConfig) {
          returnValue = defaultMethod.call.apply(defaultMethod, [definitionContext].concat(args));
        }
        componentMixins.forEach(function (mixin) {
          if (mixin[method]) {
            var _mixin$method;

            (_mixin$method = mixin[method]).call.apply(_mixin$method, [instanceContext].concat(args));
          }
        });
        return returnValue;
      };
    }

    var preferredSize = createCallback('preferredSize', function () {
      return 0;
    });
    var resize = createCallback('resize', function (_ref) {
      var inner = _ref.inner;
      return inner;
    });
    var created = createCallback('created');
    var beforeMount = createCallback('beforeMount');
    var mounted = createCallback('mounted');
    var beforeUnmount = createCallback('beforeUnmount');
    var beforeUpdate = createCallback('beforeUpdate');
    var updated = createCallback('updated');
    var beforeRender = createCallback('beforeRender');
    var beforeDestroy = createCallback('beforeDestroy');
    var destroyed = createCallback('destroyed');
    var render = definition.render; // Do not allow overriding of this function

    var addBrushStylers = function addBrushStylers() {
      if (_settings.brush) {
        (_settings.brush.consume || []).forEach(function (b) {
          if (b.context && b.style) {
            brushStylers.push(styler(brushArgs, b));
          }
        });
      }
    };

    var addBrushTriggers = function addBrushTriggers() {
      if (_settings.brush) {
        (_settings.brush.trigger || []).forEach(function (t) {
          if (t.on === 'over') {
            brushTriggers.over.push(t);
          } else {
            brushTriggers.tap.push(t);
          }
        });
      }
    };

    Object.defineProperty(brushArgs, 'data', {
      get: function get$$1() {
        return _data;
      }
    });

    var rendString = _settings.renderer || definition.renderer;
    var rend = rendString ? renderer || _registries.renderer(rendString)() : renderer || _registries.renderer()();
    brushArgs.renderer = rend;

    var _dockConfig = {
      requiredSize: function requiredSize(inner, outer) {
        return preferredSize({
          inner: inner,
          outer: outer,
          dock: _dockConfig.dock
        });
      }
    };
    updateDockConfig(_dockConfig, _settings);

    var appendComponentMeta = function appendComponentMeta(node) {
      node.key = _settings.key;
      node.element = rend.element();
    };

    var fn = function fn() {};

    fn.dockConfig = _dockConfig;

    // Set new settings - will trigger mapping of data and creation of scale / formatter.
    fn.set = function () {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (opts.settings) {
        _settings = extend(true, {}, defaultSettings, opts.settings);
        updateDockConfig(_dockConfig, _settings);
      }

      if (_settings.scale) {
        _scale = _chart.scale(_settings.scale);
      }

      if (_settings.data) {
        _data = extract(_settings.data, { dataset: _chart.dataset, collection: _chart.dataCollection }, { logger: _chart.logger() }, _chart.dataCollection);
      } else if (_scale) {
        _data = _scale.data();
      } else {
        _data = [];
      }

      if (typeof _settings.formatter === 'string') {
        _formatter = _chart.formatter(_settings.formatter);
      } else if (_typeof(_settings.formatter) === 'object') {
        _formatter = _chart.formatter(_settings.formatter);
      } else if (_scale && _scale.data().fields) {
        _formatter = _scale.data().fields[0].formatter();
      }

      _style = theme.style(_settings.style || {});
    };

    fn.resize = function (inner, outer) {
      var newSize = resize({
        inner: inner,
        outer: outer
      });
      if (newSize) {
        rend.size(newSize);
        size = newSize;
      } else {
        rend.size(inner);
        size = inner;
      }
      instanceContext.rect = inner;
    };

    fn.getRect = function () {
      return instanceContext.rect;
    };

    var getRenderArgs = function getRenderArgs() {
      var renderArgs = rend.renderArgs ? rend.renderArgs.slice(0) : [];
      renderArgs.push({
        data: _data
      });
      return renderArgs;
    };

    fn.beforeMount = beforeMount;

    fn.beforeRender = function () {
      beforeRender({
        size: size
      });
    };

    var currentNodes = void 0;

    fn.render = function () {
      var nodes = brushArgs.nodes = render.call.apply(render, [definitionContext].concat(toConsumableArray(getRenderArgs())));
      rend.render(nodes);
      currentNodes = nodes;
    };

    fn.hide = function () {
      fn.unmount();
      rend.size({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
      rend.clear();
    };

    fn.beforeUpdate = function () {
      beforeUpdate({
        settings: _settings,
        data: _data
      });
    };

    var currentTween = void 0;
    fn.update = function () {
      if (currentTween) {
        currentTween.stop();
      }
      var nodes = brushArgs.nodes = render.call.apply(render, [definitionContext].concat(toConsumableArray(getRenderArgs())));

      // Reset brush stylers and triggers
      brushStylers.forEach(function (b) {
        return b.cleanUp();
      });
      brushStylers.length = 0;
      brushTriggers.tap = [];
      brushTriggers.over = [];

      if (_settings.brush) {
        addBrushStylers();
        addBrushTriggers();
      }

      brushStylers.forEach(function (bs) {
        if (bs.isActive()) {
          bs.update();
        }
      });

      if (currentNodes && _settings.animations && _settings.animations.enabled) {
        currentTween = tween({
          old: currentNodes,
          current: nodes
        }, { renderer: rend }, _settings.animations);
        currentTween.start();
      } else {
        rend.render(nodes);
      }
      currentNodes = nodes;
    };

    fn.updated = updated;

    fn.destroy = function () {
      fn.unmount();
      beforeDestroy(element);
      rend.destroy();
      destroyed();
      element = null;
    };

    /**
     * Update active nodes. For now this can be used as a way update and apply brushing on nodes.
     * Ex: if a component have changed the nodes since its initial render.
     * @param {Nodes[]} nodes
     * @deprecated
     * @ignore
     */
    var updateNodes = function updateNodes(nodes) {
      brushArgs.nodes = nodes;
      brushStylers.forEach(function (bs) {
        if (bs.isActive()) {
          bs.update();
        }
      });
      rend.render(nodes);
    };

    // Set contexts, note that the definition and instance need different contexts (for example if they have different 'require' props)
    prepareContext(definitionContext, definition, {
      settings: function settings() {
        return _settings;
      },
      data: function data() {
        return _data;
      },
      scale: function scale() {
        return _scale;
      },
      formatter: function formatter() {
        return _formatter;
      },
      renderer: function renderer() {
        return rend;
      },
      chart: function chart() {
        return _chart;
      },
      dockConfig: function dockConfig() {
        return _dockConfig;
      },
      mediator: function mediator() {
        return _mediator;
      },
      instance: function instance() {
        return instanceContext;
      },
      style: function style() {
        return _style;
      },
      update: function update() {
        return updateNodes;
      },
      registries: function registries() {
        return _registries;
      },
      resolver: function resolver() {
        return _resolver;
      }
    });

    prepareContext(instanceContext, config, {
      settings: function settings() {
        return _settings;
      },
      data: function data() {
        return _data;
      },
      scale: function scale() {
        return _scale;
      },
      formatter: function formatter() {
        return _formatter;
      },
      renderer: function renderer() {
        return rend;
      },
      chart: function chart() {
        return _chart;
      },
      dockConfig: function dockConfig() {
        return _dockConfig;
      },
      mediator: function mediator() {
        return _mediator;
      },
      style: function style() {
        return _style;
      },
      _DO_NOT_USE_getInfo: _DO_NOT_USE_getInfo.bind(definitionContext)
    });

    fn.getBrushedShapes = function getBrushedShapes(context, mode, props) {
      var shapes = [];
      if (_settings.brush && _settings.brush.consume) {
        var brusher = _chart.brush(context);
        var sceneNodes = rend.findShapes('*');
        _settings.brush.consume.filter(function (t) {
          return t.context === context;
        }).forEach(function (consume) {
          for (var i = 0; i < sceneNodes.length; i++) {
            var node = sceneNodes[i];
            if (node.data && brusher.containsMappedData(node.data, props || consume.data, mode)) {
              appendComponentMeta(node);
              shapes.push(node);
              sceneNodes.splice(i, 1);
              i--;
            }
          }
        });
      }
      return shapes;
    };

    fn.findShapes = function (selector) {
      var shapes = rend.findShapes(selector);
      for (var i = 0, num = shapes.length; i < num; i++) {
        appendComponentMeta(shapes[i]);
      }

      return shapes;
    };

    fn.shapesAt = function (shape) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var items = rend.itemsAt(shape);
      var shapes = void 0;

      if (opts && opts.propagation === 'stop' && items.length > 0) {
        shapes = [items.pop().node];
      } else {
        shapes = items.map(function (i) {
          return i.node;
        });
      }

      for (var i = 0, num = shapes.length; i < num; i++) {
        appendComponentMeta(shapes[i]);
      }

      return shapes;
    };

    fn.brushFromShapes = function (shapes) {
      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      trigger.contexts = Array.isArray(trigger.contexts) ? trigger.contexts : [];
      var action = trigger.action || 'toggle';

      brushFromSceneNodes({
        nodes: shapes,
        action: action,
        trigger: trigger,
        chart: _chart,
        data: brushArgs.data
      });
    };

    fn.mount = function () {
      element = rend.element && rend.element() ? element : rend.appendTo(container);

      if (_settings.brush) {
        addBrushStylers();
        addBrushTriggers();
      }

      setUpEmitter(instanceContext, emitter, config);
      setUpEmitter(definitionContext, emitter, definition);
    };

    fn.mounted = function () {
      return mounted(element);
    };

    fn.unmount = function () {
      [instanceContext, definitionContext].forEach(function (ctx) {
        (ctx.eventListeners || []).forEach(function (_ref2) {
          var event = _ref2.event,
              listener = _ref2.listener;

          emitter.removeListener(event, listener);
        });
      });
      brushTriggers.tap = [];
      brushTriggers.over = [];
      brushStylers.forEach(function (bs) {
        bs.cleanUp();
      });
      brushStylers.length = 0;
      beforeUnmount();
    };

    fn.onBrushTap = function (e) {
      brushTriggers.tap.forEach(function (t) {
        if (resolveTapEvent({ e: e, t: t, config: brushArgs }) && t.globalPropagation === 'stop') {
          _chart.toggleBrushing(true);
        }
      });
    };

    fn.onBrushOver = function (e) {
      brushTriggers.over.forEach(function (t) {
        if (resolveOverEvent({ e: e, t: t, config: brushArgs }) && t.globalPropagation === 'stop') {
          _chart.toggleBrushing(true);
        }
      });
    };

    /**
     * Expose definition on instance
     * @private
     * @experimental
     */
    fn.def = definitionContext;

    /**
     * Expose instanceCtx on "instance"
     * @private
     * @experimental
     */
    fn.ctx = instanceContext;

    fn.renderer = function () {
      return rend;
    };

    fn.set({ settings: config });
    created();

    return fn;
  }

  function mediator() {
    var instance = {};
    EventEmitter$1.mixin(instance);
    return instance;
  }

  function add$3(v1, v2) {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y
    };
  }

  function sub(v1, v2) {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    };
  }

  function scalarMultiply(v, s) {
    return {
      x: v.x * s,
      y: v.y * s
    };
  }

  function distanceX(v1, v2) {
    return v1.x - v2.x;
  }

  function distanceY(v1, v2) {
    return v1.y - v2.y;
  }

  function sqrDistance(v1, v2) {
    return Math.pow(distanceX(v1, v2), 2) + Math.pow(distanceY(v1, v2), 2);
  }

  function distance(v1, v2) {
    return Math.sqrt(sqrDistance(v1, v2));
  }

  function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  function projectOnto(v1, v2) {
    var m = dot(v1, v2) / dot(v2, v2) || 1;
    return {
      x: v2.x * m,
      y: v2.y * m
    };
  }

  function rotate(v, radians) {
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { x: 0, y: 0 };

    var cos = Math.cos(radians);
    var sin = Math.sin(radians);

    var t1 = sub(v, origin);

    var t2 = {
      x: cos * t1.x - sin * t1.y,
      y: sin * t1.x + cos * t1.y
    };

    return add$3(t2, origin);
  }

  var EPSILON = 1e-12;

  function closestPointToLine(start, end, p) {
    var startToPoint = sub(p, start);
    var startToEnd = sub(end, start);
    var pointOnLine = add$3(projectOnto(startToPoint, startToEnd), start);
    return pointOnLine;
  }

  function isPointOnLine(start, end, p) {
    return distance(start, p) + distance(end, p) - distance(start, end) < EPSILON;
  }

  function lineHasNoLength(line) {
    return line.x1 === line.x2 && line.y1 === line.y2;
  }

  function rectHasNoSize(rect) {
    return rect.width <= 0 || rect.height <= 0;
  }

  function circleHasNoSize(circle) {
    return circle.r <= 0;
  }

  function toFewEdges(polygon) {
    return polygon.edges.length <= 2;
  }

  /**
   * @private
   */

  var NarrowPhaseCollision = function () {
    function NarrowPhaseCollision() {
      classCallCheck(this, NarrowPhaseCollision);
    }

    createClass(NarrowPhaseCollision, null, [{
      key: 'testCirclePoint',

      /**
       * Test if a Circle contains a point. If so, returns true and false otherwise.
       * Circle muse have a radius greater then 0.
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @param {object} point
       * @param {number} point.x - x-coordinate
       * @param {number} point.y - y-coordinate
       * @return {boolean} true if circle contains point
       */
      value: function testCirclePoint(circle, point) {
        if (circleHasNoSize(circle)) {
          return false;
        }

        var center = { x: circle.cx, y: circle.cy };
        var sqrDist = sqrDistance(center, point);

        if (sqrDist <= Math.pow(circle.r, 2)) {
          return true;
        }
        return false;
      }

      /**
       * Test if a Circle collide with a rectangle. If so, returns true and false otherwise.
       * Circle muse have a radius greater then 0.
       * Rectangle must have a width and height greather then 0.
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @return {boolean} true if circle collide with rectangle
      */

    }, {
      key: 'testCircleRect',
      value: function testCircleRect(circle, rect) {
        if (rectHasNoSize(rect) || circleHasNoSize(circle)) {
          return false;
        }
        var rX = rect.width / 2;
        var rY = rect.height / 2;
        var rcX = rect.x + rX;
        var rcY = rect.y + rY;
        var r = circle.r;
        var cx = circle.cx;
        var cy = circle.cy;
        var dX = Math.abs(cx - rcX);
        var dY = Math.abs(cy - rcY);

        if (dX > rX + r || dY > rY + r) {
          return false;
        }

        if (dX <= rX || dY <= rY) {
          return true;
        }

        var sqrDist = Math.pow(dX - rX, 2) + Math.pow(dY - rY, 2);

        return sqrDist <= Math.pow(r, 2);
      }

      /**
       * Test if a Circle collide with a line segment. If so, returns true and false otherwise.
       * Circle muse have a radius greater then 0.
       * Line must have a length greater then 0.
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @return {boolean} true if circle collide with line
      */

    }, {
      key: 'testCircleLine',
      value: function testCircleLine(circle, line) {
        if (circleHasNoSize(circle) || lineHasNoLength(line)) {
          return false;
        }

        var _lineToPoints = lineToPoints(line),
            _lineToPoints2 = slicedToArray(_lineToPoints, 2),
            p1 = _lineToPoints2[0],
            p2 = _lineToPoints2[1];

        if (NarrowPhaseCollision.testCirclePoint(circle, p1) || NarrowPhaseCollision.testCirclePoint(circle, p2)) {
          return true;
        }

        var center = { x: circle.cx, y: circle.cy };
        var pointOnLine = closestPointToLine(p1, p2, center);
        var dist = sqrDistance(pointOnLine, center);

        return dist <= Math.pow(circle.r, 2) && isPointOnLine(p1, p2, pointOnLine);
      }

      /**
       * Test if a Circle collide with another Circle. If so, returns true and false otherwise.
       * Both circles muse have a radius greater then 0.
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @return {boolean} true if circle collide with circle
      */

    }, {
      key: 'testCircleCircle',
      value: function testCircleCircle(circle1, circle2) {
        if (circleHasNoSize(circle1) || circleHasNoSize(circle2)) {
          return false;
        }

        var dx = circle1.cx - circle2.cx;
        var dy = circle1.cy - circle2.cy;
        var sqrDist = Math.pow(dx, 2) + Math.pow(dy, 2);

        if (sqrDist <= Math.pow(circle1.r + circle2.r, 2)) {
          return true;
        }
        return false;
      }

      /**
       * Test if a Circle collide with Polygon. If so, returns true and false otherwise.
       * Circle muse have a radius greater then 0.
       * Polygon must contain at least 2 vertices
       * @param {object} circle
       * @param {number} circle.cx - center x-coordinate
       * @param {number} circle.cy - center y-coordinate
       * @param {number} circle.r - circle radius
       * @param {object} polygon
       * @param {Array} polygon.vertices - Array of vertices
       * @param {object} polygon.vertices.vertex
       * @param {number} polygon.vertices.vertex.x - x-coordinate
       * @param {number} polygon.vertices.vertex.y - y-coordinate
       * @param {Array} polygon.edges - Array of edges
       * @param {Array} polygon.edges.edge - Array of points
       * @param {object} polygon.edges.edge.point
       * @param {number} polygon.edges.edge.point.x - x-coordinate
       * @param {number} polygon.edges.edge.point.y - y-coordinate
       * @return {boolean} true if circle collide with polygon
      */

    }, {
      key: 'testCirclePolygon',
      value: function testCirclePolygon(circle, polygon) {
        // TODO handle polygon that is a straight line, current impl will interrept it is a true, if radius is extended onto any of the edges
        if (toFewEdges(polygon) || circleHasNoSize(circle)) {
          return false;
        }

        var center = { x: circle.cx, y: circle.cy };
        if (NarrowPhaseCollision.testPolygonPoint(polygon, center)) {
          return true;
        }

        var num = polygon.edges.length;

        for (var i = 0; i < num; i++) {
          var edge = pointsToLine(polygon.edges[i]);
          if (NarrowPhaseCollision.testCircleLine(circle, edge)) {
            return true;
          }
        }

        return false;
      }

      /**
       * Test if a Polygon contains a Point. If so, returns true and false otherwise.
       * Polygon must contain at least 2 vertices
       * @param {object} polygon
       * @param {Array} polygon.vertices - Array of vertices
       * @param {object} polygon.vertices.vertex
       * @param {number} polygon.vertices.vertex.x - x-coordinate
       * @param {number} polygon.vertices.vertex.y - y-coordinate
       * @param {Array} polygon.edges - Array of edges
       * @param {Array} polygon.edges.edge - Array of points
       * @param {object} polygon.edges.edge.point
       * @param {number} polygon.edges.edge.point.x - x-coordinate
       * @param {number} polygon.edges.edge.point.y - y-coordinate
       * @param {object} point
       * @param {number} point.x - x-coordinate
       * @param {number} point.y - y-coordinate
       * @return {boolean} true if polygon conatins point
      */

    }, {
      key: 'testPolygonPoint',
      value: function testPolygonPoint(polygon, point) {
        // TODO handle polygon that is a straight line, current impl gives a non-deterministic output, that is depending on number of vertices
        if (toFewEdges(polygon) || !NarrowPhaseCollision.testRectPoint(polygon.boundingRect(), point)) {
          return false;
        }

        var even = true;
        var num = polygon.vertices.length;
        var rayStart = { x: polygon.xMin - 1, y: point.y };

        for (var i = 0; i < num - 1; i++) {
          var edge = pointsToLine(polygon.edges[i]);
          if (!(edge.y1 < point.y && edge.y2 < point.y) && !(edge.y1 > point.y && edge.y2 > point.y)) {
            // filterout any edges that does not cross the ray
            even = NarrowPhaseCollision.testLineLine(edge, pointsToLine([rayStart, point])) ? !even : even;
          }
        }
        return !even;
      }

      /**
       * Test if a Polygon collider with a line. If so, returns true and false otherwise.
       * Polygon must contain at least 3 edges.
       * Line must have length greater then 0.
       * @param {object} polygon
       * @param {Array} polygon.vertices - Array of vertices
       * @param {object} polygon.vertices.vertex
       * @param {number} polygon.vertices.vertex.x - x-coordinate
       * @param {number} polygon.vertices.vertex.y - y-coordinate
       * @param {Array} polygon.edges - Array of edges
       * @param {Array} polygon.edges.edge - Array of points
       * @param {object} polygon.edges.edge.point
       * @param {number} polygon.edges.edge.point.x - x-coordinate
       * @param {number} polygon.edges.edge.point.y - y-coordinate
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @return {boolean} true if polygon collider with line
      */

    }, {
      key: 'testPolygonLine',
      value: function testPolygonLine(polygon, line) {
        // TODO handle polygon that is a straight line, current impl gives a non-deterministic output, that is depending on number of vertices
        if (toFewEdges(polygon)) {
          return false;
        }

        for (var i = 0, num = polygon.edges.length; i < num; i++) {
          var edge = pointsToLine(polygon.edges[i]);
          if (NarrowPhaseCollision.testLineLine(line, edge)) {
            return true;
          }
        }

        var _lineToPoints3 = lineToPoints(line),
            _lineToPoints4 = slicedToArray(_lineToPoints3, 2),
            p1 = _lineToPoints4[0],
            p2 = _lineToPoints4[1];

        return NarrowPhaseCollision.testPolygonPoint(polygon, p1) || NarrowPhaseCollision.testPolygonPoint(polygon, p2);
      }

      /**
       * Test if a Polygon collider with a rectangle. If so, returns true and false otherwise.
       * Polygon must contain at least 3 edges.
       * Rectangle must width and height greater then 0.
       * @param {object} polygon
       * @param {Array} polygon.vertices - Array of vertices
       * @param {object} polygon.vertices.vertex
       * @param {number} polygon.vertices.vertex.x - x-coordinate
       * @param {number} polygon.vertices.vertex.y - y-coordinate
       * @param {Array} polygon.edges - Array of edges
       * @param {Array} polygon.edges.edge - Array of points
       * @param {object} polygon.edges.edge.point
       * @param {number} polygon.edges.edge.point.x - x-coordinate
       * @param {number} polygon.edges.edge.point.y - y-coordinate
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @return {boolean} true if polygon collider with rect
      */

    }, {
      key: 'testPolygonRect',
      value: function testPolygonRect(polygon, rect) {
        // TODO handle polygon that is a straight line, current impl gives a non-deterministic output, that is depending on number of vertices
        if (toFewEdges(polygon)) {
          return false;
        }

        for (var i = 0, num = polygon.edges.length; i < num; i++) {
          var edge = pointsToLine(polygon.edges[i]);
          if (NarrowPhaseCollision.testRectLine(rect, edge)) {
            return true;
          }
        }

        var _rectToPoints = rectToPoints(rect),
            _rectToPoints2 = slicedToArray(_rectToPoints, 4),
            p1 = _rectToPoints2[0],
            p2 = _rectToPoints2[1],
            p3 = _rectToPoints2[2],
            p4 = _rectToPoints2[3];

        return NarrowPhaseCollision.testPolygonPoint(polygon, p1) || NarrowPhaseCollision.testPolygonPoint(polygon, p2) || NarrowPhaseCollision.testPolygonPoint(polygon, p3) || NarrowPhaseCollision.testPolygonPoint(polygon, p4);
      }

      /**
       * Test if a Rectangle collide with another rectangle. If so, returns true and false otherwise.
       * Both rectangles must have a width and height greather then 0.
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @return {boolean} true if rectangle collide with rectangle
      */

    }, {
      key: 'testRectRect',
      value: function testRectRect(rect1, rect2) {
        if (rectHasNoSize(rect1) || rectHasNoSize(rect2)) {
          return false;
        }

        return rect1.x <= rect2.x + rect2.width && rect2.x <= rect1.x + rect1.width && rect1.y <= rect2.y + rect2.height && rect2.y <= rect1.y + rect1.height;
      }

      /**
       * Test if a Rectangle contains a Point. If so, returns true and false otherwise.
       * Rectangle must have a width and height greather then 0.
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @param {object} point
       * @param {number} point.x - x-coordinate
       * @param {number} point.y - y-coordinate
       * @return {boolean} true if rectangle contains point
      */

    }, {
      key: 'testRectPoint',
      value: function testRectPoint(rect, point) {
        if (rectHasNoSize(rect)) {
          return false;
        }

        return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
      }

      /**
       * Test if a Rectangle collider with a line. If so, returns true and false otherwise.
       * Rectangle must have a width and height greather then 0.
       * Line must have length greater then 0.
       * @param {object} rect
       * @param {number} rect.x - x-coordinate
       * @param {number} rect.y - y-coordinate
       * @param {number} rect.width - width
       * @param {number} rect.height - height
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @return {boolean} true if rectangle collide with line
      */

    }, {
      key: 'testRectLine',
      value: function testRectLine(rect, line) {
        if (lineHasNoLength(line) || rectHasNoSize(rect)) {
          return false;
        }

        var _lineToPoints5 = lineToPoints(line),
            _lineToPoints6 = slicedToArray(_lineToPoints5, 2),
            p1 = _lineToPoints6[0],
            p2 = _lineToPoints6[1];

        if (NarrowPhaseCollision.testRectPoint(rect, p1) || NarrowPhaseCollision.testRectPoint(rect, p2)) {
          return true;
        }

        var rectEdges = rectToPoints(rect);
        var num = rectEdges.length;
        for (var i = 0; i < num; i++) {
          var edge = pointsToLine([rectEdges[i], rectEdges[i !== 3 ? i + 1 : 0]]);
          if (NarrowPhaseCollision.testLineLine(edge, line)) {
            return true;
          }
        }
        return false;
      }

      /**
       * Test if a Line collider with another line. If so, returns true and false otherwise.
       * Both lines must have length greater then 0.
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @return {boolean} true if line collide with line
      */

    }, {
      key: 'testLineLine',
      value: function testLineLine(line1, line2) {
        var _lineToPoints7 = lineToPoints(line1),
            _lineToPoints8 = slicedToArray(_lineToPoints7, 2),
            p1 = _lineToPoints8[0],
            p2 = _lineToPoints8[1];

        var _lineToPoints9 = lineToPoints(line2),
            _lineToPoints10 = slicedToArray(_lineToPoints9, 2),
            p3 = _lineToPoints10[0],
            p4 = _lineToPoints10[1];

        var dx1 = distanceX(p2, p1);
        var dy1 = distanceY(p2, p1);
        var dx2 = distanceX(p4, p3);
        var dy2 = distanceY(p4, p3);
        var dx3 = distanceX(p1, p3);
        var dy3 = distanceY(p1, p3);
        var ub = dy2 * dx1 - dx2 * dy1;
        var uat = dx2 * dy3 - dy2 * dx3;
        var ubt = dx1 * dy3 - dy1 * dx3;
        var t1 = void 0;
        var t2 = void 0;

        if (dx1 === 0 && dy1 === 0) {
          // Line segment has no length
          return false;
        }

        if (dx2 === 0 && dy2 === 0) {
          // Line segment has no length
          return false;
        }

        if (ub === 0) {
          if (uat === 0 && ubt === 0) {
            // COINCIDENT;
            if (dx1 === 0) {
              if (dy1 === 0) {
                // p1 = p2
                return p1.x === p2.x && p1.y === p2.y;
              }
              t1 = distanceY(p3, p1) / dy1;
              t2 = distanceY(p4, p1) / dy1;
            } else {
              t1 = (p3.x - p1.x) / dx1;
              t2 = (p4.x - p1.x) / dx1;
            }
            if (t1 < 0 && t2 < 0 || t1 > 1 && t2 > 1) {
              return false;
            }
            return true;
          }
          return false; // PARALLEL;
        }
        var ua = uat / ub;
        ub = ubt / ub;
        if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
          return true;
        }
        return false;
      }

      /**
       * Test if a Line contains a Point. If so, returns true and false otherwise.
       * Line must have length greater then 0.
       * @param {object} line
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {number} line.x1 - x-coordinate
       * @param {number} line.y1 - y-coordinate
       * @param {object} point
       * @param {number} point.x - x-coordinate
       * @param {number} point.y - y-coordinate
       * @return {boolean} true if line contains point
      */

    }, {
      key: 'testLinePoint',
      value: function testLinePoint(line, point) {
        if (lineHasNoLength(line)) {
          return false;
        }

        var _lineToPoints11 = lineToPoints(line),
            _lineToPoints12 = slicedToArray(_lineToPoints11, 2),
            p1 = _lineToPoints12[0],
            p2 = _lineToPoints12[1];

        return isPointOnLine(p1, p2, point);
      }
    }]);
    return NarrowPhaseCollision;
  }();

  var VARIABLE_RX = /^\$/;
  var EXTEND = '@extend';

  function throwCyclical(s) {
    throw new Error('Cyclical reference for "' + s + '"');
  }

  function res(style, references, path) {
    if (typeof style === 'string') {
      var value = references[style];
      if (path.indexOf(style) !== -1) {
        throwCyclical(style);
      }
      if (VARIABLE_RX.test(value)) {
        path.push(style);
        return res(value, references, path);
      }
      return value;
    }
    var computed = style;
    var refs = extend(true, {}, references, style);
    var s = {};

    if (style[EXTEND]) {
      var extendFrom = style[EXTEND];
      if (path.indexOf(extendFrom) !== -1) {
        throwCyclical(extendFrom);
      }
      var pext = path.slice();
      pext.push(extendFrom);
      computed = extend(true, {}, res(refs[extendFrom], references, pext), style);
    }

    Object.keys(computed).forEach(function (key) {
      var p = path.slice();
      if (key === EXTEND || VARIABLE_RX.test(key)) {
        return;
      }
      s[key] = computed[key];
      var value = s[key];
      if (VARIABLE_RX.test(value) && value in refs) {
        if (path.indexOf(value) !== -1) {
          throwCyclical(value);
        }
        p.push(value);
        value = refs[value];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
          s[key] = res(value, refs, p);
        } else if (VARIABLE_RX.test(value) && value in refs) {
          s[key] = res(value, refs, p);
        } else {
          s[key] = value;
        }
      } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        s[key] = res(value, refs, p);
      }
    });
    return s;
  }

  /**
   * Resolve style references
   * @private
   * @param {style-object} style
   * @param {style-object} references
   * @returns {object} The resolved style
   * @example
   * resolve({
   *   label: '$label--big'
   * }, {
   *   '$size--m': '12px',
   *   '$label--big': {
   *     fontFamily: 'Arial',
   *     fontSize: '$size--m'
   *   }
   * }); // { label: { fontFamily: 'Arial', fontSize: '12px' } }
   */
  function resolve(style, references) {
    return res(style, references, []);
  }

  function themeFn() {
    var _style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var palettes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var pals = {};
    var setPalettes = function setPalettes(p) {
      p.forEach(function (palette) {
        var pal = Array.isArray(palette.colors[0]) ? palette.colors : [palette.colors];
        pals[palette.key] = {
          colors: pal,
          sizes: pal.map(function (colors) {
            return colors ? colors.length : 0;
          })
        };
      });
    };

    var getPalette = function getPalette(key, num) {
      var palette = pals[key];
      if (!palette) {
        return [];
      }
      var sizes = palette.sizes;
      // find the first color set containing at least 'num' colors
      for (var i = 0; i < sizes.length; i++) {
        if (num <= sizes[i]) {
          return palette.colors[i];
        }
      }
      return palette.colors[sizes.length - 1];
    };

    /**
     * Theme API
     * @private
     * @experimental
     */
    var theme = {
      /**
       * Get an array of colors
       * @param {string} name - Name of the color palette
       * @param {number} [num] - The minimum number of colors to get from the palette
       */
      palette: function palette(name, num) {
        return getPalette(name, num);
      },

      setPalettes: setPalettes,

      /**
       * Resolve style references
       * @param {style-object} s - Object containing
       */
      style: function style(s) {
        return resolve(s, _style);
      }
    };

    setPalettes(palettes);

    return theme;
  }

  /**
   * @typedef {object} component-settings
   * @property {string} type - Component type (ex: axis, point, ...)
   * @property {function} [preferredSize] - Function returning the preferred size
   * @property {function} [created]
   * @property {function} [beforeMount]
   * @property {function} [mounted]
   * @property {function} [beforeUpdate]
   * @property {function} [updated]
   * @property {function} [beforeRender]
   * @property {function} [beforeDestroy]
   * @property {function} [destroyed]
   * @property {brush-setting} [brush] see [brushing](./brushing.md)
   * @property {number} [displayOrder = 0]
   * @property {number} [prioOrder = 0]
   * @property {boolean} [show = true] If the component should be rendered
   * @property {string | {width: string, height: string}} [minimumLayoutMode] Refer to layout sizes defined by layoutModes in dockLayout
   * @property {string} [dock] left, right, top or bottom
   * @property {string} [scale] Named scale. Will be provided to the component if it ask for it.
   * @property {string} [formatter] Named formatter. Fallback to create formatter from scale. Will be provided to the component if it ask for it.
   */

  var isReservedProperty$1 = function isReservedProperty(prop) {
    return ['on', 'created', 'beforeMount', 'mounted', 'resize', 'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy', 'destroyed', 'data', 'settings'].some(function (name) {
      return name === prop;
    });
  };

  function addComponentDelta(shape, containerBounds, componentBounds) {
    var dx = containerBounds.left - componentBounds.left;
    var dy = containerBounds.top - componentBounds.top;
    var type = getShapeType(shape);
    var deltaShape = extend(true, {}, shape);

    switch (type) {
      case 'circle':
        deltaShape.cx += dx;
        deltaShape.cy += dy;
        break;
      case 'polygon':
        for (var i = 0, num = deltaShape.vertices.length; i < num; i++) {
          var v = deltaShape.vertices[i];
          v.x += dx;
          v.y += dy;
        }
        break;
      case 'line':
        deltaShape.x1 += dx;
        deltaShape.y1 += dy;
        deltaShape.x2 += dx;
        deltaShape.y2 += dy;
        break;
      case 'point':
      case 'rect':
        deltaShape.x += dx;
        deltaShape.y += dy;
        break;
      default:
        break;
    }

    return deltaShape;
  }

  function chartFn(definition, context) {
    /**
     * @typedef {object} chart-definition
     */
    var element = definition.element,
        _definition$data = definition.data,
        data = _definition$data === undefined ? [] : _definition$data,
        _definition$settings = definition.settings,
        settings = _definition$settings === undefined ? {} : _definition$settings,
        _definition$on = definition.on,
        on = _definition$on === undefined ? {} : _definition$on;


    var registries = context.registries;
    var logger = context.logger;
    var theme = themeFn(context.style, context.palettes);

    var chartMixins = list();
    var listeners = [];
    /**
     * @alias chart
     * @interface
     */
    var instance = extend({}, definition, chartMixins.filter(function (mixinName) {
      return !isReservedProperty$1(mixinName);
    }));
    var mediator$$1 = mediator();
    var currentComponents = []; // Augmented components
    var visibleComponents = [];

    var currentScales = null; // Built scales
    var currentFormatters = null; // Built formatters
    var currentScrollApis = null; // Build scroll apis
    var currentInteractions = [];

    var dataset = function dataset() {};
    var dataCollection = function dataCollection() {};
    var brushes = {};
    var stopBrushing = false;

    var createComponent = function createComponent(compSettings, container) {
      var componentDefinition = registries.component(compSettings.type);
      var compInstance = componentFactory(componentDefinition, {
        settings: compSettings,
        chart: instance,
        mediator: mediator$$1,
        registries: registries,
        theme: theme,
        container: container
      });
      return {
        instance: compInstance,
        settings: extend(true, {}, compSettings),
        key: compSettings.key,
        hasKey: typeof compSettings.key !== 'undefined'
      };
    };

    // Create a callback that calls lifecycle functions in the definition and config (if they exist).
    function createCallback(method) {
      var defaultMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      return function cb() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var inDefinition = typeof definition[method] === 'function';

        var returnValue = void 0;
        if (inDefinition) {
          var _definition$method;

          returnValue = (_definition$method = definition[method]).call.apply(_definition$method, [instance].concat(args));
        } else {
          returnValue = defaultMethod.call.apply(defaultMethod, [instance].concat(args));
        }
        chartMixins.forEach(function (mixin) {
          if (mixin[method]) {
            var _mixin$method;

            (_mixin$method = mixin[method]).call.apply(_mixin$method, [instance].concat(args));
          }
        });
        return returnValue;
      };
    }

    var findComponent = function findComponent(componentInstance) {
      for (var i = 0; i < currentComponents.length; i++) {
        if (currentComponents[i].instance === componentInstance) {
          return currentComponents[i];
        }
      }
      return null;
    };

    var findComponentIndexByKey = function findComponentIndexByKey(key) {
      for (var i = 0; i < currentComponents.length; i++) {
        var currComp = currentComponents[i];
        if (currComp.hasKey && currComp.key === key) {
          return i;
        }
      }
      return -1;
    };

    var layout = function layout(components) {
      var dockLayout$$1 = dockLayout(settings.dockLayout);
      components.forEach(function (c) {
        dockLayout$$1.addComponent(c.instance, c.key);
      });

      var _dockLayout$layout = dockLayout$$1.layout(element),
          visible = _dockLayout$layout.visible,
          hidden = _dockLayout$layout.hidden;

      return {
        visible: visible.map(function (v) {
          return findComponent(v);
        }),
        hidden: hidden.map(function (h) {
          return findComponent(h);
        })
      };
    };

    var moveToPosition = function moveToPosition(comp, index) {
      var el = comp.instance.renderer().element();
      if (isNaN(index) || !el || !element || !element.childNodes) {
        return;
      }
      var nodes = element.childNodes;
      var i = Math.min(nodes.length - 1, Math.max(index, 0));
      var node = nodes[i];
      if (element.insertBefore && typeof node !== 'undefined') {
        element.insertBefore(el, nodes[i]);
      }
    };

    var created = createCallback('created');
    var beforeMount = createCallback('beforeMount');
    var mounted = createCallback('mounted');
    var beforeUpdate = createCallback('beforeUpdate');
    var updated = createCallback('updated');
    var beforeRender = createCallback('beforeRender');
    var beforeDestroy = createCallback('beforeDestroy');
    var destroyed = createCallback('destroyed');

    var set$$1 = function set$$1(_data, _settings) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          partialData = _ref.partialData;

      var _settings$formatters = _settings.formatters,
          formatters = _settings$formatters === undefined ? {} : _settings$formatters,
          _settings$scales = _settings.scales,
          scales = _settings$scales === undefined ? {} : _settings$scales,
          _settings$scroll = _settings.scroll,
          scroll = _settings$scroll === undefined ? {} : _settings$scroll;


      dataset = datasets(_data, { logger: logger, types: registries.data });
      if (!partialData) {
        Object.keys(brushes).forEach(function (b) {
          return brushes[b].clear();
        });
      }
      if (_settings.palettes) {
        theme.setPalettes(_settings.palettes);
      }
      dataCollection = create(_settings.collections, { dataset: dataset }, { logger: logger });
      currentScales = builder$1(scales, { dataset: dataset, collection: dataCollection }, { scale: registries.scale, theme: theme, logger: logger });
      currentFormatters = builder(formatters, { dataset: dataset, collection: dataCollection }, { formatter: registries.formatter, theme: theme, logger: logger });
      currentScrollApis = builder$2(scroll, currentScrollApis);
    };

    var render = function render() {
      var _settings2 = settings,
          _settings2$components = _settings2.components,
          components = _settings2$components === undefined ? [] : _settings2$components;


      beforeRender();

      set$$1(data, settings);

      currentComponents = components.map(function (compSettings) {
        return createComponent(compSettings, element);
      });

      var _layout = layout(currentComponents),
          visible = _layout.visible,
          hidden = _layout.hidden;

      visibleComponents = visible;

      hidden.forEach(function (comp) {
        comp.instance.hide();
        comp.visible = false;
      });

      visible.forEach(function (comp) {
        return comp.instance.beforeMount();
      });
      visible.forEach(function (comp) {
        return comp.instance.mount();
      });
      visible.forEach(function (comp) {
        return comp.instance.beforeRender();
      });

      visible.forEach(function (comp) {
        return comp.instance.render();
      });
      visible.forEach(function (comp) {
        return comp.instance.mounted();
      });
      visible.forEach(function (comp) {
        comp.visible = true;
      });
    };

    function setInteractions() {
      var interactions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var current = {};
      var newKeys = interactions.filter(function (it) {
        return !!it.key;
      }).map(function (it) {
        return it.key;
      });
      currentInteractions.forEach(function (cit) {
        if (cit.key && newKeys.indexOf(cit.key) !== -1) {
          // keep old instance
          current[cit.key] = cit;
        } else {
          cit.destroy();
        }
      });
      currentInteractions = interactions.map(function (intSettings) {
        var intDefinition = intSettings.key && current[intSettings.key] ? current[intSettings.key] : registries.interaction(intSettings.type)(instance, mediator$$1, element);
        intDefinition.set(intSettings);
        return intDefinition;
      });
    }

    var componentsFromPoint = function componentsFromPoint(p) {
      var br = element.getBoundingClientRect();
      var x = 'clientX' in p ? p.clientX : p.x;
      var y = 'clientY' in p ? p.clientY : p.y;
      var tp = { x: x - br.left, y: y - br.top };
      var ret = [];
      visibleComponents.forEach(function (c) {
        var r = c.instance.getRect();
        if (NarrowPhaseCollision.testRectPoint(r, tp)) {
          ret.push(c);
        }
      });
      return ret;
    };

    // Browser only
    var mount = function mount() {
      element.innerHTML = '';

      render();

      Object.keys(on).forEach(function (key) {
        var listener = on[key].bind(instance);
        element.addEventListener(key, listener);
        listeners.push({
          key: key,
          listener: listener
        });
      });

      var eventInfo = {};
      var onTapDown = function onTapDown(e) {
        if (e.touches) {
          eventInfo.x = e.touches[0].clientX;
          eventInfo.y = e.touches[0].clientY;
          eventInfo.multiTouch = e.touches.length > 1;
        } else {
          eventInfo.x = e.clientX;
          eventInfo.y = e.clientY;
          eventInfo.multiTouch = false;
        }
        eventInfo.time = Date.now();
        eventInfo.comps = componentsFromPoint(eventInfo);
      };

      var onBrushTap = function onBrushTap(e) {
        var comps = eventInfo.comps || componentsFromPoint(e);
        if (comps.every(function (c) {
          return c.instance.def.disableTriggers;
        })) {
          return;
        }

        if (e.type === 'touchend') {
          e.preventDefault();
        }
        if (!isValidTapEvent(e, eventInfo)) {
          return;
        }

        for (var i = comps.length - 1; i >= 0; i--) {
          var comp = comps[i];
          comp.instance.onBrushTap(e);
          if (stopBrushing) {
            stopBrushing = false;
            break;
          }
        }
      };

      var onBrushOver = function onBrushOver(e) {
        var comps = componentsFromPoint(e);
        for (var i = comps.length - 1; i >= 0; i--) {
          var comp = comps[i];
          comp.instance.onBrushOver(e);
          if (stopBrushing) {
            stopBrushing = false;
            break;
          }
        }
      };

      var brushEventList = [];

      brushEventList.push({ key: 'mousedown', listener: onTapDown });
      brushEventList.push({ key: 'mouseup', listener: onBrushTap });

      if (detectTouchSupport(element)) {
        brushEventList.push({ key: 'touchstart', listener: onTapDown });
        brushEventList.push({ key: 'touchend', listener: onBrushTap });
      }

      brushEventList.push({ key: 'mousemove', listener: onBrushOver });

      brushEventList.forEach(function (event) {
        element.addEventListener(event.key, event.listener);
        listeners.push(event);
      });
      setInteractions(settings.interactions);
    };

    var unmount = function unmount() {
      listeners.forEach(function (_ref2) {
        var key = _ref2.key,
            listener = _ref2.listener;
        return element.removeEventListener(key, listener);
      });
      setInteractions();
    };

    /**
     * Update the chart with new settings and / or data
     * @param {chart-definition} [chart] - Chart definition
     */
    instance.update = function () {
      var newProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var partialData = newProps.partialData;

      if (newProps.data) {
        data = newProps.data;
      }
      if (newProps.settings) {
        settings = newProps.settings;
        setInteractions(newProps.settings.interactions);
      }

      beforeUpdate();

      set$$1(data, settings, { partialData: partialData });

      var _settings3 = settings,
          formatters = _settings3.formatters,
          scales = _settings3.scales,
          _settings3$components = _settings3.components,
          components = _settings3$components === undefined ? [] : _settings3$components;

      var _loop = function _loop(i) {
        var currComp = currentComponents[i];
        // TODO warn when there is no key
        if (!components.some(function (c) {
          return currComp.hasKey && currComp.key === c.key;
        })) {
          // Component is removed
          currentComponents.splice(i, 1);
          currComp.instance.destroy();
        }
      };

      for (var i = currentComponents.length - 1; i >= 0; i--) {
        _loop(i);
      }

      // Let the "components" array determine order of components
      currentComponents = components.map(function (comp) {
        var idx = findComponentIndexByKey(comp.key);
        if (idx === -1) {
          // Component is added
          return createComponent(comp, element);
        }
        // Component is (potentially) updated
        currentComponents[idx].updateWith = {
          formatters: formatters,
          scales: scales,
          data: data,
          settings: comp
        };
        return currentComponents[idx];
      });

      currentComponents.forEach(function (comp) {
        if (comp.updateWith) {
          comp.instance.set(comp.updateWith);
        }
      });
      currentComponents.forEach(function (comp) {
        if (comp.updateWith) {
          comp.instance.beforeUpdate();
        }
      });

      var toUpdate = [];
      var toRender = [];
      if (partialData) {
        currentComponents.forEach(function (comp) {
          if (comp.updateWith && comp.visible) {
            toUpdate.push(comp);
          }
        });
      } else {
        var _layout2 = layout(currentComponents),
            visible = _layout2.visible,
            hidden = _layout2.hidden; // Relayout


        visibleComponents = visible;

        visible.forEach(function (comp) {
          if (comp.updateWith && comp.visible) {
            toUpdate.push(comp);
          } else {
            toRender.push(comp);
          }
        });

        hidden.forEach(function (comp) {
          comp.instance.hide();
          comp.visible = false;
          delete comp.updateWith;
        });
      }

      toRender.forEach(function (comp) {
        return comp.instance.beforeMount();
      });
      toRender.forEach(function (comp) {
        return comp.instance.mount();
      });

      toRender.forEach(function (comp) {
        return comp.instance.beforeRender();
      });
      toUpdate.forEach(function (comp) {
        return comp.instance.beforeRender();
      });

      toRender.forEach(function (comp) {
        return comp.instance.render();
      });
      toUpdate.forEach(function (comp) {
        return comp.instance.update();
      });

      // Ensure that displayOrder is keept, only do so on re-layout update.
      // Which is only the case if partialData is false.
      if (!partialData) {
        visibleComponents.forEach(function (comp, i) {
          return moveToPosition(comp, i);
        });
      }

      toRender.forEach(function (comp) {
        return comp.instance.mounted();
      });
      toUpdate.forEach(function (comp) {
        return comp.instance.updated();
      });

      visibleComponents.forEach(function (comp) {
        delete comp.updateWith;
        comp.visible = true;
      });

      updated();
    };

    /**
     * Destroy the chart instance.
     */
    instance.destroy = function () {
      beforeDestroy();
      currentComponents.forEach(function (comp) {
        return comp.instance.destroy();
      });
      currentComponents = [];
      unmount();
      delete instance.update;
      delete instance.destroy;
      destroyed();
    };

    /**
     * Get all shapes associated with the provided context
     * @param {string} context The brush context
     * @param {string} mode Property comparasion mode.
     * @param {Array<string>} props Which specific data properties to compare
     * @param {string} key Which component to get shapes from. Default gives shapes from all components.
     * @return {Array<object>} Array of objects containing shape and parent element
     */
    instance.getAffectedShapes = function (ctx) {
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'and';
      var props = arguments[2];
      var key = arguments[3];

      var shapes = [];
      currentComponents.filter(function (comp) {
        return key === undefined || key === null || comp.key === key;
      }).forEach(function (comp) {
        shapes.push.apply(shapes, toConsumableArray(comp.instance.getBrushedShapes(ctx, mode, props)));
      });
      return shapes;
    };

    /**
     * Get all nodes matching the provided selector
     * @param {string} selector CSS selector [type, attribute, universal, class]
     * @returns {Array<SceneNode>} Array of objects containing matching nodes
     *
     * @example
     * chart.findShapes('Circle') // [<CircleNode>, <CircleNode>]
     * chart.findShapes('Circle[fill="red"][stroke!="black"]') // [CircleNode, CircleNode]
     * chart.findShapes('Container Rect') // [Rect, Rect]
     */
    instance.findShapes = function (selector) {
      var shapes = [];
      visibleComponents.forEach(function (c) {
        shapes.push.apply(shapes, toConsumableArray(c.instance.findShapes(selector)));
      });
      return shapes;
    };

    /**
     * Get components overlapping a point.
     * @param {point} p - Point with x- and y-cooridnate. The coordinate is relative to the browser viewport.
     * @returns {Array<component-context>} Array of component contexts
     */
    instance.componentsFromPoint = function (p) {
      return componentsFromPoint(p).map(function (comp) {
        return comp.instance.ctx;
      });
    };

    /**
     * Get all nodes colliding with a geometrical shape (circle, line, rectangle, point, polygon).
     *
     * The input shape is identified based on the geometrical attributes in the following order: circle => line => rectangle => point => polygon.
     * Note that not all nodes on a scene have collision detection enabled.
     * @param {line|rect|point|circle} shape - A geometrical shape. Coordinates are relative to the top-left corner of the chart instance container.
     * @param {object} opts - Options
     * @param {object[]} [opts.components] - Array of components to include in the lookup. If no components are specified, all components will be included.
     * @param {string} [opts.components[].component.key] - Component key
     * @param {string} [opts.components[].component.propagation] - if set to `stop`, will start lookup on top visible shape and propagate downwards until a shape is found.
     * @param {string} [opts.propagation] - if set to `stop`, will start lookup on top visible component and propagate downwards until a component has at least a match.
     * @returns {Array<SceneNode>} Array of objects containing colliding nodes
     *
     * @example
     * chart.shapesAt(
     *  {
     *    x: 0,
     *    y: 0,
     *    width: 100,
     *    height: 100
     *  },
     *  {
     *    components: [
     *      { key: 'key1', propagation: 'stop' },
     *      { key: 'key2' }
     *    ],
     *    propagation: 'stop'
     *  }
     * );
     */
    instance.shapesAt = function (shape) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var result = [];
      var containerBounds = element.getBoundingClientRect();
      var comps = visibleComponents; // Assume that visibleComponents is ordererd according to displayOrder

      if (Array.isArray(opts.components) && opts.components.length > 0) {
        var compKeys = opts.components.map(function (c) {
          return c.key;
        });
        comps = visibleComponents.filter(function (c) {
          return compKeys.indexOf(c.key) !== -1;
        }).map(function (c) {
          return {
            instance: c.instance,
            opts: opts.components[compKeys.indexOf(c.key)]
          };
        });
      }

      for (var i = comps.length - 1; i >= 0; i--) {
        var c = comps[i];
        var componentBounds = c.instance.renderer().element().getBoundingClientRect();
        var deltaShape = addComponentDelta(shape, containerBounds, componentBounds);
        var shapes = c.instance.shapesAt(deltaShape, c.opts);
        var stopPropagation = shapes.length > 0 && opts.propagation === 'stop';

        result.push.apply(result, toConsumableArray(shapes));

        if (result.length > 0 && stopPropagation) {
          return result;
        }
      }
      return result;
    };

    /**
     * Brush data by providing a collection of data bound shapes.
     * @param {SceneNode[]} shapes - An array of data bound shapes.
     * @param {object} config - Options
     * @param {Array<object>} opts.components - Array of components to include in the lookup.
     * @param {string} [opts.components.component.key] - Component key
     * @param {Array<string>} [opts.components.component.contexts] - Name of the brushing contexts to affect
     * @param {Array<string>} [opts.components.component.data] - The mapped data properties to add to the brush
     * @param {string} [opts.components.component.action] - Type of action to respond with
     *
     * @example
     * const shapes = chartInstance.shapesAt(...);
     * const config = {
     *  components:[
     *    {
     *      key: 'key1',
     *      contexts: ['myContext'],
     *      data: [''],
     *      action: 'add'
     *    }
     *  ]
     * };
     * chartInstance.brushFromShapes(shapes, config);
     */
    instance.brushFromShapes = function (shapes) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { components: [] };

      var configKeys = config.components.map(function (conf) {
        return conf.key;
      });
      visibleComponents.forEach(function (c) {
        var configIndex = configKeys.indexOf(c.key);
        if (configIndex !== -1) {
          var compShapes = [];
          for (var i = 0, num = shapes.length; i < num; i++) {
            var shape = shapes[i];
            if (shape.key === c.key) {
              compShapes.push(shape);
            }
          }
          c.instance.brushFromShapes(compShapes, config.components[configIndex]);
        }
      });
    };

    /**
     * @param {string} name - Name of scroll api
     * @returns {scroll}
     */
    instance.scroll = function scroll() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      return getOrCreateScrollApi(name, currentScrollApis);
    };

    /**
     * Get
     * @param {string} key - Get the dataset identified by `key`
     * @returns {dataset}
     */
    instance.dataset = function (key) {
      return dataset(key);
    };

    instance.dataCollection = function (key) {
      return dataCollection(key);
    };

    /**
     * Get the all registered scales
     * @returns {Array<scale>} Array of scales
     */
    instance.scales = function scales() {
      return currentScales;
    };

    /**
     * Get the all registered formatters
     * @returns {Array<formatter>} Array of formatters
     */
    instance.formatters = function formatters() {
      return currentFormatters;
    };

    /**
     * Get or create brush context for this chart
     * @param {string} name - Name of the brush context. If no match is found, a new brush context is created and returned.
     * @returns {brush}
     */
    instance.brush = function brushFn() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      if (!brushes[name]) {
        brushes[name] = brush();
      }
      return brushes[name];
    };

    /**
     * Get or create a scale for this chart
     * @param {string|object} v - Scale reference or scale options
     * @returns {scale}
     * @example
     * instance.scale('nameOfMyScale'); // Fetch an existing scale by name
     * instance.scale({ scale: 'nameOfMyScale' }); // Fetch an existing scale by name
     * instance.scale({ source: '0/1', type: 'linear' }); // Create a new scale
     */
    instance.scale = function scale(v) {
      return getOrCreateScale(v, currentScales, { dataset: dataset, collection: dataCollection }, { scale: registries.scale, theme: theme, logger: logger });
    };

    /**
     * Get or create a formatter for this chart
     * @param {string|object} v - Formatter reference or formatter options
     * @returns {formatter}
     * @example
     * instance.formatter('nameOfMyFormatter'); // Fetch an existing formatter by name
     * instance.formatter({ formatter: 'nameOfMyFormatter' }); // Fetch an existing formatter by name
     * instance.formatter({ type: 'q' }); // Fetch an existing formatter by type
     * instance.formatter({
     *  formatter: 'd3',
     *  type: 'number',
     *  format: '1.0.%'
     * }); // Create a new formatter
     */
    instance.formatter = function formatter(v) {
      return getOrCreateFormatter(v, currentFormatters, { dataset: dataset, collection: dataCollection }, { formatter: registries.formatter, theme: theme, logger: logger });
    };

    /**
     * @param {boolean} [val] - Toggle brushing on or off. If value is omitted, a toggle action is applied to the current state.
     */
    instance.toggleBrushing = function toggleBrushing(val) {
      if (typeof val !== 'undefined') {
        stopBrushing = val;
      } else {
        stopBrushing = !stopBrushing;
      }
    };

    /**
     * Get a component context
     * @param {string} key - Component key
     * @returns {component-context} Component context
     */
    instance.component = function (key) {
      var idx = findComponentIndexByKey(key);
      if (idx !== -1) {
        return currentComponents[idx].instance.ctx;
      }
      return undefined;
    };

    instance.logger = function () {
      return logger;
    };

    instance.theme = function () {
      return theme;
    };

    /**
     * Get the all interactions instances
     * @name chart.interactions
     * @type {object}
     * @example
     * chart.interactions.instances; // Array of all interaction instances
     * chart.interactions.on(); // Toggle on all interactions instances
     * chart.interactions.off(); // Toggle off all interactions instances
     */
    Object.defineProperty(instance, 'interactions', {
      get: function get$$1() {
        return (/** @lends chart.interactions */{
            /** @type Array<interaction> */
            instances: currentInteractions,
            /** Enable all interaction instances */
            on: function on() {
              currentInteractions.forEach(function (i) {
                return i.on();
              });
            },

            /** Disable all interaction instances */
            off: function off() {
              currentInteractions.forEach(function (i) {
                return i.off();
              });
            }
          }
        );
      }
    });

    created();

    if (element) {
      beforeMount();
      mount(element);
      mounted(element);
      instance.element = element;
    }

    return instance;
  }

  chartFn.mixin = add; // Expose mixin registering function

  var rendererRegistry = function rendererRegistry(reg) {
    var f = registryFactory(reg);
    f.prio = function (p) {
      return p ? f.default(p[0]) : [f.default()];
    };
    f.types = function () {
      return f.getKeys();
    };
    return f;
  };

  // import * as mixins from './component-mixins';

  var componentRegistry = registryFactory();

  // export default function componentFactory(parentRegistry) {
  //   const reg = registry(parentRegistry);

  //   function component(name, definition) {
  //     if (definition) {
  //       reg.register(name, definition);
  //     }
  //     return reg.get(name);
  //   }
  //   component.mixin = mixins.add;

  //   return component;
  // }

  function findField(query, _ref) {
    var cache = _ref.cache;

    if (typeof query === 'number') {
      return cache.fields[query];
    }

    // Find by key first
    for (var i = 0; i < cache.fields.length; i++) {
      if (cache.fields[i].key() === query) {
        return cache.fields[i];
      }
    }
    // find by title
    for (var _i = 0; _i < cache.fields.length; _i++) {
      if (cache.fields[_i].title() === query) {
        return cache.fields[_i];
      }
    }
    return null;
  }

  var filters = {
    numeric: function numeric(values) {
      return values.filter(function (v) {
        return typeof v === 'number' && !isNaN(v);
      });
    }
  };

  var unfilteredReducers = {
    sum: function sum(values) {
      return values.reduce(function (a, b) {
        return a + b;
      }, 0);
    }
  };

  // function isPrimitive(x) {
  //   const type = typeof x;
  //   return (type !== 'object' && type !== 'function');
  // }

  /**
   * [reducers description]
   * @type {Object}
   * @private
   */
  var reducers = {
    first: function first(values) {
      return values[0];
    },
    last: function last(values) {
      return values[values.length - 1];
    },
    min: function min(values) {
      var filtered = filters.numeric(values);
      return !filtered.length ? NaN : Math.min.apply(null, filtered);
    },
    max: function max(values) {
      var filtered = filters.numeric(values);
      return !filtered.length ? NaN : Math.max.apply(null, filtered);
    },
    sum: function sum(values) {
      var filtered = filters.numeric(values);
      return !filtered.length ? NaN : filtered.reduce(function (a, b) {
        return a + b;
      }, 0);
    },
    avg: function avg(values) {
      var filtered = filters.numeric(values);
      var len = filtered.length;
      return !len ? NaN : unfilteredReducers.sum(filtered) / len;
    }
  };

  function normalizeProperties(cfg, dataset, dataProperties, main) {
    // console.log('======', cfg, main, dataset);
    var props = {};
    var mainField = main.field || (typeof cfg.field !== 'undefined' ? dataset.field(cfg.field) : null);
    Object.keys(dataProperties).forEach(function (key) {
      var pConfig = dataProperties[key];
      var prop = props[key] = {};
      if (['number', 'string', 'boolean'].indexOf(typeof pConfig === 'undefined' ? 'undefined' : _typeof(pConfig)) !== -1) {
        prop.type = 'primitive';
        prop.value = pConfig;
      } else if (typeof pConfig === 'function') {
        prop.type = 'function';
        prop.value = pConfig;
        prop.label = pConfig;
        prop.field = mainField;
      } else if ((typeof pConfig === 'undefined' ? 'undefined' : _typeof(pConfig)) === 'object') {
        if (pConfig.fields) {
          prop.fields = pConfig.fields.map(function (ff) {
            return normalizeProperties(cfg, dataset, { main: ff }, main).main;
          });
        } else if (typeof pConfig.field !== 'undefined') {
          prop.type = 'field';
          prop.field = dataset.field(pConfig.field);
          prop.value = prop.field.value;
          prop.label = prop.field.label;
        } else if (mainField) {
          prop.value = mainField.value;
          prop.label = mainField.label;
          prop.field = mainField;
        }

        if (typeof pConfig.filter === 'function') {
          prop.filter = pConfig.filter;
        }
        if (typeof pConfig.value !== 'undefined') {
          prop.value = pConfig.value;
        }
        if (typeof pConfig.label !== 'undefined') {
          prop.label = pConfig.label;
        }
        if (typeof pConfig.reduce === 'function') {
          prop.reduce = pConfig.reduce;
        } else if (pConfig.reduce) {
          prop.reduce = reducers[pConfig.reduce];
        } else if (prop.field && prop.field.reduce) {
          prop.reduce = typeof prop.field.reduce === 'string' ? reducers[prop.field.reduce] : prop.field.reduce;
        }
      }
    });

    return props;
  }

  /*
  example of configuration input
  cfg = {
    field: 'State', // the 'top level' values are extracted from field state
    value: d => d.qText, // the value of the output
    props: { // additional data properties ammended to each item
      a: 3, // constant value
      b: d => d.qElemNumber, // function will receive the original field value
      c: {
        field: 'Country', // reference to another field
        value: d => d.qText // extract the qText value from the referenced field
      },
      d: {
        value: d => d.qRow //  extract qRow from field 'State'
      }
    }
  }

  // output
  [{
    value: 'CA', source: { field: 'State' },
    a: { value: 3 },
    b: { value: 26, source: 'State' },
    c: { value: 'USA', source: 'Country' },
    d: { value: 131, source: 'State' }
  },
  ...]
  */
  function getPropsInfo(cfg, dataset) {
    // console.log('222', cfg);
    var _normalizeProperties = normalizeProperties(cfg, dataset, {
      main: {
        value: cfg.value, label: cfg.label, reduce: cfg.reduce, filter: cfg.filter
      }
    }, {}),
        main = _normalizeProperties.main;

    var props = normalizeProperties(cfg, dataset, cfg.props || {}, main);
    return { props: props, main: main };
  }

  // collect items that have been grouped and reduce per group and property
  function collect(trackedItems, _ref2) {
    var main = _ref2.main,
        propsArr = _ref2.propsArr,
        props = _ref2.props;

    var dataItems = [];
    var mainFormatter = main.field.formatter() || function (v) {
      return v;
    };
    var propsFormatters = {};
    propsArr.forEach(function (prop) {
      propsFormatters[prop] = props[prop].field ? props[prop].field.formatter() : function (v) {
        return v;
      };
    });
    dataItems.push.apply(dataItems, toConsumableArray(trackedItems.map(function (t) {
      var mainValues = t.items.map(function (item) {
        return item.value;
      });
      var mainReduce = main.reduce;
      var ret = {
        value: mainReduce ? mainReduce(mainValues) : mainValues,
        source: t.items[0].source
      };
      ret.label = mainFormatter(ret.value);
      propsArr.forEach(function (prop) {
        var values = [];
        values = t.items.map(function (item) {
          return item[prop].value;
        });
        var reduce = props[prop].reduce;
        ret[prop] = {
          value: reduce ? reduce(values) : values
        };
        ret[prop].label = String(propsFormatters[prop](ret[prop].value));
        if (t.items[0][prop].source) {
          ret[prop].source = t.items[0][prop].source;
        }
      });
      return ret;
    })));

    return dataItems;
  }

  function track(_ref3) {
    var cfg = _ref3.cfg,
        itemData = _ref3.itemData,
        obj = _ref3.obj,
        target = _ref3.target,
        tracker = _ref3.tracker,
        trackType = _ref3.trackType;

    var trackId = trackType === 'function' ? cfg.trackBy(itemData) : itemData[cfg.trackBy];
    var trackedItem = tracker[trackId];
    if (!trackedItem) {
      trackedItem = tracker[trackId] = {
        items: [],
        id: trackId
      };
      target.push(trackedItem);
    }
    trackedItem.items.push(obj);
  }

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

  function extract$1(config, dataset) {
    var cfgs = Array.isArray(config) ? config : [config];
    var dataItems = [];
    cfgs.forEach(function (cfg) {
      if (typeof cfg.field !== 'undefined') {
        (function () {
          var f = dataset.field(cfg.field);
          var sourceKey = dataset.key();
          if (!f) {
            throw Error('Field \'' + cfg.field + '\' not found');
          }

          var _getPropsInfo = getPropsInfo(cfg, dataset),
              props = _getPropsInfo.props,
              main = _getPropsInfo.main;

          var propsArr = Object.keys(props);

          var track$$1 = !!cfg.trackBy;
          var trackType = _typeof(cfg.trackBy);
          var tracker = {};
          var trackedItems = [];

          var items = f.items();
          var mapped = [];

          var _loop = function _loop(idx) {
            var mainCell = items[idx];
            var exclude = main.filter && !main.filter(mainCell);
            if (exclude) {
              return 'continue';
            }
            var ret = datumExtract(main, mainCell, { key: sourceKey });

            // loop through all props that need to be mapped and
            // assign 'value' and 'source' to each property
            propsArr.forEach(function (prop) {
              var p = props[prop];
              var propCell = p.field ? p.field.items()[idx] : mainCell;
              ret[prop] = datumExtract(p, propCell, { key: sourceKey });
            });

            // collect items based on the trackBy value
            // items with the same trackBy value are placed in an array and reduced later
            if (track$$1) {
              track({
                cfg: cfg,
                itemData: mainCell,
                obj: ret,
                target: trackedItems,
                tracker: tracker,
                trackType: trackType
              });
            }

            mapped.push(ret);
          };

          for (var idx = 0; idx < items.length; idx++) {
            var _ret2 = _loop(idx);

            if (_ret2 === 'continue') continue;
          }

          // reduce if items have been grouped
          if (track$$1) {
            dataItems.push.apply(dataItems, toConsumableArray(collect(trackedItems, {
              main: main,
              propsArr: propsArr,
              props: props
            })));
          } else {
            dataItems.push.apply(dataItems, mapped);
          }
        })();
      }
    });
    return dataItems;
  }

  var filters$1 = {
    numeric: function numeric(values) {
      return values.filter(function (v) {
        return typeof v === 'number' && !isNaN(v);
      });
    }
  };

  function createFields(_ref) {
    var source = _ref.source,
        data = _ref.data,
        cache = _ref.cache,
        config = _ref.config;

    var headers = void 0;
    var content = data;
    var parse = config && config.parse;
    if (Array.isArray(data[0])) {
      // assume 2d matrix of data
      if (parse && parse.headers === false) {
        headers = data[0].map(function (v, i) {
          return i;
        });
      } else {
        headers = data[0];
        content = data.slice(1);
      }
    } else {
      headers = Object.keys(data[0]);
    }

    var rowFn = !!parse && typeof parse.row === 'function' && parse.row;
    var flds = headers;

    if (parse && typeof parse.fields === 'function') {
      flds = parse.fields(flds.slice());
    } else {
      flds = headers.map(function (h) {
        return {
          key: h,
          title: h
        };
      });
    }

    var fieldValues = void 0;
    if (Array.isArray(data[0])) {
      fieldValues = flds.map(function () {
        return [];
      });
    } else {
      fieldValues = {};
      flds.forEach(function (f) {
        fieldValues[f.key] = [];
      });
    }

    for (var r = 0; r < content.length; r++) {
      var row = rowFn ? rowFn(content[r], r, flds) : content[r];
      if (!row) {
        continue;
      }
      if (Array.isArray(row)) {
        for (var c = 0; c < flds.length; c++) {
          fieldValues[c].push(row[c]);
        }
      } else {
        for (var _c = 0; _c < flds.length; _c++) {
          fieldValues[flds[_c].key].push(row[flds[_c].key]);
        }
      }
    }
    var fv = Array.isArray(fieldValues) ? function (i) {
      return fieldValues[i];
    } : function (i) {
      return fieldValues[flds[i].key];
    };
    for (var _c2 = 0; _c2 < flds.length; _c2++) {
      var values = fv(_c2);
      var numericValues = filters$1.numeric(values);
      var isMeasure = numericValues.length > 0;
      var type = isMeasure ? 'measure' : 'dimension';
      var min = isMeasure ? Math.min.apply(Math, toConsumableArray(numericValues)) : NaN;
      var max = isMeasure ? Math.max.apply(Math, toConsumableArray(numericValues)) : NaN;

      cache.fields.push(field(extend({
        source: source,
        key: _c2,
        title: flds[_c2].title,
        values: values,
        min: min,
        max: max,
        type: type
      }, flds[_c2]), {
        value: flds[_c2].value,
        label: flds[_c2].label
      }));
    }
  }

  var dsv = function dsv(_ref2) {
    var data = _ref2.data,
        config = _ref2.config;

    var rows = data.split('\n');
    var row0 = rows[0];
    var row1 = rows[1];
    var delimiter = ',';
    if (config && config.parse && config.parse.delimiter) {
      delimiter = config.parse.delimiter;
    } else if (row0) {
      // guess delimiter
      var guesses = [/,/, /\t/, /;/];
      for (var i = 0; i < guesses.length; i++) {
        var d = guesses[i];
        if (row0 && row1) {
          if (d.test(row0) && d.test(row1) && row0.split(d).length === row1.split(d).length) {
            delimiter = d;
            break;
          }
        } else if (d.test(row0)) {
          delimiter = d;
        }
      }
    }
    return rows.map(function (row) {
      return row.split(delimiter);
    });
  };

  var parseData = function parseData(_ref3) {
    var source = _ref3.source,
        data = _ref3.data,
        cache = _ref3.cache,
        config = _ref3.config;

    if (!data) {
      return;
    }
    var dd = data;

    if (typeof dd === 'string') {
      // assume dsv
      dd = dsv({ data: data, config: config });
    }

    if (!Array.isArray(dd)) {
      return; // warn?
    }

    createFields({
      data: dd,
      cache: cache,
      source: source,
      config: config
    });
  };

  /**
   * Create a new dataset with default settings
   * @private
   * @return {dataset}
   */
  function ds() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _key = _ref4.key,
        data = _ref4.data,
        config = _ref4.config;

    var cache = {
      fields: []
    };

    /**
     * @alias dataset
     * @interface
     */
    var dataset = {
      /**
       * Get the key identifying this dataset
       * @returns {string}
       */
      key: function key() {
        return _key;
      },

      /**
       * Get the raw data
       * @returns {any}
       */
      raw: function raw() {
        return data;
      },

      /**
       * Find a field within this dataset
       * @param {string} query - The field to find
       * @returns {field}
       */
      field: function field$$1(query) {
        return findField(query, {
          cache: cache,
          matrix: data
        });
      },

      /**
       * Get all fields within this dataset
       * @returns {Array<field>}
       */
      fields: function fields() {
        return cache.fields.slice();
      },

      /**
       * Extract data items from this dataset
       * @param {data-extract-config} config
       * @returns {Array<datum-extract>}
       */
      extract: function extract(cfg) {
        return extract$1(cfg, dataset, cache);
      },

      /**
       * @returns {null}
       */
      hierarchy: function hierarchy() {
        return null;
      }
    };

    parseData({
      key: _key, data: data, config: config, cache: cache
    });

    return dataset;
  }

  ds.util = {
    normalizeConfig: getPropsInfo,
    collect: collect,
    track: track
  };

  var dataRegistry = registryFactory();

  dataRegistry.default('matrix');

  dataRegistry('matrix', ds);

  dataRegistry('default', ds); // deprecated

  /**
   * Manages event handlers for native events
   * @private
   */
  function native(chart, mediator, element) {
    var instance = { chart: chart, mediator: mediator, element: element };
    var nativeEvents = [];
    var settings = void 0;
    var itKey = void 0;
    var isOn = true;

    /**
     * Set default settings
     * @private
     */
    function setDefaultSettings(newSettings) {
      itKey = newSettings.key;
      settings = newSettings;
      settings.events = settings.events || [];
      if (settings.enable === undefined) {
        settings.enable = true;
      }
    }

    /**
     * Add native events based on settings
     * @private
     */
    function addEvents() {
      if (typeof settings.enable === 'function') {
        settings.enable = settings.enable.bind(instance)();
      }
      if (!settings.enable) {
        return; // interaction is disabled
      }
      Object.keys(settings.events).forEach(function (key) {
        var listener = settings.events[key].bind(instance);
        element.addEventListener(key, listener);
        nativeEvents.push({ key: key, listener: listener });
      });
    }

    /**
     * Removes all added native events
     * @private
     */
    function removeAddedEvents() {
      // remove added native events
      nativeEvents.forEach(function (_ref) {
        var key = _ref.key,
            listener = _ref.listener;

        element.removeEventListener(key, listener);
      });
      nativeEvents = [];
    }

    return {
      /**
       * Getter for the key.
       * @private
       */
      get key() {
        return itKey;
      },
      /**
       * Updates this with new settings
       * @private
       * @param {object} newSettings
       * @param {string} [newSettings.type] - The interaction type. Is 'native' for this component
       * @param {boolean|function} [newSettings.enable=true] - Should the interactions defined here be enabled or not.
       * This is only run when adding event handlers. In effect at startup, update or during on/off.
       * It does not run during every event loop.
       * @param {array} [newSettings.gestures] - The keys in this object is the names of native events
       * that should be added to the chart element and they should all point to function which
       * will be the corresponding event handler.
       */
      set: function set(newSettings) {
        setDefaultSettings(newSettings);
        removeAddedEvents();
        if (isOn) {
          addEvents();
        }
      },

      /**
       * Turns off interactions
       * @private
       */
      off: function off() {
        isOn = false;
        removeAddedEvents();
      },

      /**
       * Turns off interactions
       * @private
       */
      on: function on() {
        isOn = true;
        if (nativeEvents.length === 0) {
          addEvents();
        }
      },

      /**
       * Destroys and unbinds all event handlers
       * @private
       */
      destroy: function destroy() {
        removeAddedEvents();
        instance = null;
        settings = null;
      }
    };
  }

  var reg$1 = registryFactory();

  reg$1('native', native);

  /**
   * Short-hand for max(min())
   *
   * @param {number} min Minimum allowed value
   * @param {number} max Maximum allowed value
   * @param {number} value The actual value to cap
   * @ignore
   */
  function cap(min, max, value) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Resolve a diff, i.e. resolveDiff(0.2, 0.6, 1, 100) = 20
   *
   * @param {object} params parameters
   * @param {number} params.start Normalized start value
   * @param {number} params.end Normalized end value
   * @param {number} params.minPx The minimum number of pixels
   * @param {number} params.maxPx Maximum number of pixels, i.e. the width or height
   * @ignore
   */
  function resolveDiff(_ref) {
    var start = _ref.start,
        end = _ref.end,
        _ref$minPx = _ref.minPx,
        minPx = _ref$minPx === undefined ? 0.1 : _ref$minPx,
        _ref$maxPx = _ref.maxPx,
        maxPx = _ref$maxPx === undefined ? 1 : _ref$maxPx;

    var high = Math.max(start, end);
    var low = Math.min(start, end);
    var highModified = cap(-0.1, 1.2, high);
    var lowModified = cap(-0.1, 1.2, low);

    var wantedDiff = highModified * maxPx - lowModified * maxPx;
    var actualDiff = Math.max(minPx, wantedDiff);
    var startModifier = (actualDiff - wantedDiff) / 2;
    var actualLow = lowModified * maxPx - startModifier;

    return {
      actualDiff: actualDiff,
      startModifier: startModifier,
      actualLow: actualLow
    };
  }

  function box(_ref) {
    var _extend;

    var item = _ref.item,
        boxWidth = _ref.boxWidth,
        boxPadding = _ref.boxPadding,
        rendwidth = _ref.rendwidth,
        rendheight = _ref.rendheight,
        flipXY = _ref.flipXY;

    var x = 'x';
    var y = 'y';
    var width = 'width';
    var height = 'height';
    var calcwidth = rendwidth;
    var calcheight = rendheight;

    if (flipXY) {
      x = 'y';
      y = 'x';
      width = 'height';
      height = 'width';
      calcwidth = rendheight;
      calcheight = rendwidth;
    }

    var _resolveDiff = resolveDiff({
      start: item.start, end: item.end, minPx: item.box.minHeightPx, maxPx: calcheight
    }),
        actualDiff = _resolveDiff.actualDiff,
        actualLow = _resolveDiff.actualLow;

    return extend({}, item.box, (_extend = {
      type: 'rect'
    }, defineProperty(_extend, x, (boxPadding + item.major) * calcwidth), defineProperty(_extend, y, actualLow), defineProperty(_extend, height, actualDiff), defineProperty(_extend, width, boxWidth * calcwidth), defineProperty(_extend, 'data', item.data || {}), defineProperty(_extend, 'collider', {
      type: null
    }), _extend));
  }

  function verticalLine(_ref2) {
    var _extend2;

    var item = _ref2.item,
        from = _ref2.from,
        to = _ref2.to,
        boxCenter = _ref2.boxCenter,
        rendwidth = _ref2.rendwidth,
        rendheight = _ref2.rendheight,
        flipXY = _ref2.flipXY;

    var x1 = 'x1';
    var y1 = 'y1';
    var x2 = 'x2';
    var y2 = 'y2';
    var calcwidth = rendwidth;
    var calcheight = rendheight;

    if (flipXY) {
      x1 = 'y1';
      y1 = 'x1';
      x2 = 'y2';
      y2 = 'x2';
      calcwidth = rendheight;
      calcheight = rendwidth;
    }

    return extend({}, item.line, (_extend2 = {
      type: 'line'
    }, defineProperty(_extend2, y2, Math.floor(from * calcheight)), defineProperty(_extend2, x1, boxCenter * calcwidth), defineProperty(_extend2, y1, Math.floor(to * calcheight)), defineProperty(_extend2, x2, boxCenter * calcwidth), defineProperty(_extend2, 'data', item.data || {}), defineProperty(_extend2, 'collider', {
      type: null
    }), _extend2));
  }

  function horizontalLine(_ref3) {
    var _extend3;

    var item = _ref3.item,
        key = _ref3.key,
        position = _ref3.position,
        width = _ref3.width,
        boxCenter = _ref3.boxCenter,
        rendwidth = _ref3.rendwidth,
        rendheight = _ref3.rendheight,
        flipXY = _ref3.flipXY;

    var x1 = 'x1';
    var y1 = 'y1';
    var x2 = 'x2';
    var y2 = 'y2';
    var calcwidth = rendwidth;
    var calcheight = rendheight;

    if (flipXY) {
      x1 = 'y1';
      y1 = 'x1';
      x2 = 'y2';
      y2 = 'x2';
      calcwidth = rendheight;
      calcheight = rendwidth;
    }

    var halfWidth = width / 2;

    return extend({ type: 'line' }, item[key], (_extend3 = {}, defineProperty(_extend3, y1, Math.floor(position * calcheight)), defineProperty(_extend3, x1, (boxCenter - halfWidth) * calcwidth), defineProperty(_extend3, y2, Math.floor(position * calcheight)), defineProperty(_extend3, x2, (boxCenter + halfWidth) * calcwidth), defineProperty(_extend3, 'r', halfWidth * calcwidth), defineProperty(_extend3, 'cx', boxCenter * calcwidth), defineProperty(_extend3, 'cy', position * calcheight), defineProperty(_extend3, 'width', width * calcwidth), defineProperty(_extend3, 'data', item.data || {}), defineProperty(_extend3, 'collider', {
      type: null
    }), _extend3));
  }

  function buildShapes(_ref4) {
    var width = _ref4.width,
        height = _ref4.height,
        flipXY = _ref4.flipXY,
        resolved = _ref4.resolved,
        keys = _ref4.keys;

    // if (!settings || !settings.major || !settings.major.scale || !settings.minor || !settings.minor.scale) {
    //   return [];
    // }

    var output = [];

    var major = null;
    var items = resolved.major.items;

    var _loop = function _loop(i, len) {
      var d = items[i].data;
      var children = [];

      var majorVal = null;
      var majorEndVal = null;

      if (typeof resolved.major.settings.binStart !== 'undefined') {
        // if start and end is defined
        majorVal = resolved.major.items[i].binStart;
        majorEndVal = resolved.major.items[i].binEnd;
        major = resolved.major.settings.binStart.scale;
      } else {
        major = resolved.major.settings.major.scale;
        majorVal = major ? resolved.major.items[i].major : 0;
      }

      var bandwidth = 0;
      if (!major) {
        bandwidth = 1;
      } else if (major.bandwidth) {
        bandwidth = major.bandwidth();
        majorVal -= bandwidth / 2;
      } else {
        bandwidth = majorEndVal - majorVal;
      }

      var item = extend({}, {
        major: majorVal,
        majorEnd: majorEndVal
      }, resolved.minor.items[i]);

      keys.forEach(function (key) {
        return item[key] = resolved[key].items[i];
      });

      var maxMajorWidth = flipXY ? height : width;
      var boxWidth = Math.min(bandwidth * item.box.width, isNaN(item.box.maxWidthPx) ? maxMajorWidth : item.box.maxWidthPx / maxMajorWidth);
      var boxPadding = (bandwidth - boxWidth) / 2;
      var boxCenter = boxPadding + item.major + boxWidth / 2;

      var rendwidth = width;
      var rendheight = height;

      if (item.box.show && isNumber(item.start) && isNumber(item.end)) {
        children.push(box({
          item: item, boxWidth: boxWidth, boxPadding: boxPadding, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
        }));
      }

      if (item.line.show && isNumber(item.min) && isNumber(item.start)) {
        children.push(verticalLine({
          item: item, from: item.min, to: item.start, boxCenter: boxCenter, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
        }));
      }

      if (item.line.show && isNumber(item.max) && isNumber(item.end)) {
        children.push(verticalLine({
          item: item, from: item.max, to: item.end, boxCenter: boxCenter, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
        }));
      }

      if (item.median.show && isNumber(item.med)) {
        children.push(horizontalLine({
          item: item, key: 'median', position: item.med, width: boxWidth, boxCenter: boxCenter, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
        }));
      }

      if (item.whisker.show) {
        var whiskerWidth = boxWidth * item.whisker.width;

        if (isNumber(item.min)) {
          children.push(horizontalLine({
            item: item, key: 'whisker', position: item.min, width: whiskerWidth, boxCenter: boxCenter, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
          }));
        }

        if (isNumber(item.max)) {
          children.push(horizontalLine({
            item: item, key: 'whisker', position: item.max, width: whiskerWidth, boxCenter: boxCenter, rendwidth: rendwidth, rendheight: rendheight, flipXY: flipXY
          }));
        }
      }

      var container = {
        type: 'container',
        data: d,
        collider: { type: 'bounds' },
        children: children
      };

      output.push(container);
    };

    for (var i = 0, len = items.length; i < len; i++) {
      _loop(i, len);
    }

    return output;
  }

  /**
   * Resolve a complex object using the built-in resolver from this.resolver in component
   * @ignore
   */
  function complexResolver(_ref) {
    var keys = _ref.keys,
        data = _ref.data,
        defaultSettings = _ref.defaultSettings,
        style = _ref.style,
        settings = _ref.settings,
        width = _ref.width,
        height = _ref.height,
        resolver = _ref.resolver;

    var defaults$$1 = extend(true, {}, defaultSettings || {}, style || {});
    var scaled = {
      major: settings.orientation === 'horizontal' ? height : width,
      minor: settings.orientation === 'horizontal' ? width : height
    };

    var majorSettings = settings.major;

    var majorResolved = void 0;

    if ((typeof majorSettings === 'undefined' ? 'undefined' : _typeof(majorSettings)) === 'object' && _typeof(majorSettings.ref) === 'object' && typeof majorSettings.ref.start !== 'undefined' && typeof majorSettings.ref.end !== 'undefined') {
      // temporary backwards compatibility
      majorResolved = resolver.resolve({
        data: data,
        defaults: {
          start: 0,
          end: 1
        },
        scaled: scaled,
        settings: extend(true, {}, {
          binStart: { scale: settings.major.scale, ref: settings.major.ref.start },
          binEnd: { scale: settings.major.scale, ref: settings.major.ref.end }
        })
      });
    } else if ((typeof majorSettings === 'undefined' ? 'undefined' : _typeof(majorSettings)) === 'object' && typeof majorSettings.binStart !== 'undefined' && typeof majorSettings.binEnd !== 'undefined') {
      majorResolved = resolver.resolve({
        data: data,
        defaults: {
          start: 0,
          end: 1
        },
        scaled: scaled,
        settings: extend(true, {}, {
          binStart: { scale: settings.major.scale, ref: 'binStart' },
          binEnd: { scale: settings.major.scale, ref: 'binEnd' }
        }, settings.major)
      });
    } else {
      majorResolved = resolver.resolve({
        data: data,
        scaled: scaled,
        defaults: {
          major: 0.5
        },
        settings: {
          major: settings.major
        }
      });
    }

    var minorSettings = settings.minor || {};

    var minorResolved = resolver.resolve({
      data: data,
      defaults: {
        start: 0,
        end: 1
      },
      scaled: scaled,
      settings: extend(true, {}, {
        start: { scale: minorSettings.scale, ref: 'start' },
        end: { scale: minorSettings.scale, ref: 'end' },
        min: { scale: minorSettings.scale, ref: 'min' },
        max: { scale: minorSettings.scale, ref: 'max' },
        med: { scale: minorSettings.scale, ref: 'med' }
      }, minorSettings)
    });

    var key = void 0;
    var ext = {
      major: majorResolved,
      minor: minorResolved
    };

    for (var ki = 0, len = keys.length; ki < len; ki++) {
      key = keys[ki];
      ext[key] = resolver.resolve({
        data: data,
        defaults: defaults$$1[key],
        settings: settings[key],
        scaled: scaled
      });
    }

    return ext;
  }

  var DEFAULT_DATA_SETTINGS = {
    line: {
      show: true,
      stroke: '#000',
      strokeWidth: 1
    },
    median: {
      show: true,
      stroke: '#000',
      strokeWidth: 1
    },
    whisker: {
      show: true,
      stroke: '#000',
      strokeWidth: 1,
      fill: '',
      type: 'line',
      width: 1
    },
    box: {
      show: true,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      width: 1,
      maxWidthPx: undefined,
      minWidthPx: 1,
      minHeightPx: 1
    }
  };

  var dataKeys = Object.keys(DEFAULT_DATA_SETTINGS);

  var component = {
    require: ['chart', 'resolver'],
    defaultSettings: {
      settings: {},
      data: {},
      style: {
        box: '$shape',
        line: '$shape-guide',
        whisker: '$shape-guide',
        median: '$shape-guide--inverted'
      }
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
      this.state = {};
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render(_ref) {
      var data = _ref.data;
      var _rect = this.rect,
          width = _rect.width,
          height = _rect.height;


      var flipXY = this.settings.settings.orientation === 'horizontal';

      var style = this.style,
          resolver = this.resolver;


      var resolved = complexResolver({
        keys: dataKeys,
        data: data,
        defaultSettings: DEFAULT_DATA_SETTINGS,
        style: style,
        settings: this.settings.settings,
        width: width,
        height: height,
        resolver: resolver
      });

      var settings = resolved.settings,
          items = resolved.items;


      var shapes = buildShapes({
        items: items,
        settings: settings,
        width: width,
        height: height,
        flipXY: flipXY,
        resolved: resolved,
        keys: dataKeys
      });

      return shapes;
    }
  };

  function box$1(picasso) {
    picasso.component('box', component);
    picasso.component('box-marker', component); // temporary backwards compatibility - DEPRECATED
  }

  /**
   * @typedef {object} component--box
   * @property {string} type - "box"
   * @property {component--box~data} data - Box data
   * @property {component--box~settings} settings - Box settings
   * @example
   * {
   *   type: "box",
   *   data: {
   *    mapTo: {
   *      min: { source: "/qHyperCube/qMeasureInfo/0" },
   *      start: { source: "/qHyperCube/qMeasureInfo/1" },
   *      med: { source: "/qHyperCube/qMeasureInfo/2" },
   *      end: { source: "/qHyperCube/qMeasureInfo/3" },
   *      max: { source: "/qHyperCube/qMeasureInfo/4" },
   *    },
   *    groupBy: {
   *      source: "/qHyperCube/qDimensionInfo/0"
   *    }
   *  },
   *  settings: {
   *    major: {
   *      scale: { source: "/qHyperCube/qDimensionInfo/0" }
   *    },
   *    minor: {
   *      scale: { source: ["/qHyperCube/qMeasureInfo/0",
   *               "/qHyperCube/qMeasureInfo/1",
   *               "/qHyperCube/qMeasureInfo/2",
   *               "/qHyperCube/qMeasureInfo/3",
   *               "/qHyperCube/qMeasureInfo/4"] }
   *    }
   *  }
   * }
   */

  /**
   * @typedef {object} component--box~settings
   * @property {object} major
   * @property {string} major.scale - The scale to use along the major axis
   * @property {string|component--box~settings~majorReference} [major.ref='self'] - Reference to the data property along the major axis
   * @property {object} minor
   * @property {string} minor.scale - The scale to use along the minor axis
   * @property {string} [orientation='vertical']
   * @property {object} [box]
   * @property {boolean} [box.show=true]
   * @property {string} [box.fill='#fff']
   * @property {string} [box.stroke='#000']
   * @property {number} [box.strokeWidth=1]
   * @property {number} [box.width=1]
   * @property {number} [box.maxWidthPx=100]
   * @property {number} [box.minWidthPx=1]
   * @property {number} [box.minHeightPx=1]
   * @property {object} [line]
   * @property {boolean} [line.show=true]
   * @property {string} [stroke='#000']
   * @property {number} [strokeWidth=1]
   * @property {object} [whisker]
   * @property {boolean} [whisker.show=true]
   * @property {string} [whisker.stroke='#000']
   * @property {number} [whisker.strokeWidth=1]
   * @property {number} [whisker.width=1]
   * @property {object} [median]
   * @property {number} [median.show=true]
   * @property {number} [median.stroke='#000']
   * @property {number} [median.strokeWidth=1]
   */

  /**
   * @typedef {object} component--box~settings~majorReference
   * @property {string} start - Reference to the data property of the start value along the major axis
   * @property {string} end - Reference to the data property of the end value along the major axis
   */

  /**
   * @typedef {object} component--box~data
   * @property {number} [min] - min
   * @property {number} [max] - max
   * @property {number} [start] - start
   * @property {number} [end] - end
   * @property {number} [med] - med
   */

  /**
   * A list of supported attributes in lower camelCase notation mapped to corresponding kebab-case notation.
   * The kebab-case notations are a sub-set of SVG attributes (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute).
   * @ignore
   */
  var mappedAttributes = {
    fill: 'fill',
    stroke: 'stroke',
    opacity: 'opacity',
    strokeWidth: 'stroke-width',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    baseline: 'dominant-baseline', // Special case where we have defined our own attribute name
    dominantBaseline: 'dominant-baseline',
    anchor: 'text-anchor', // Special case where we have defined our own attribute name
    textAnchor: 'text-anchor',
    maxWidth: 'maxWidth',
    transform: 'transform',
    strokeDasharray: 'stroke-dasharray',
    id: 'id'
  };

  /**
   * Takes a target object and assign each supported attribute from a source object to that target.
   * Each supported attributes is converted to a mapped kebab-case notation.
   * @ignore
   *
   * @param {object} target - Target object on which to assign mapped attribute values
   * @param {object} source - Source object
   */
  function assignMappedAttribute(target, source) {
    Object.keys(mappedAttributes).forEach(function (key) {
      var sourceValue = source[key];
      if (typeof sourceValue !== 'undefined') {
        var mappedKey = mappedAttributes[key];
        target[mappedKey] = sourceValue;
      }
    });
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--circle
   */
  function circle$1(options) {
    return {
      type: 'circle',
      fill: 'black',
      cx: options.x,
      cy: options.y,
      r: options.size / 2,
      collider: {
        type: 'circle'
      }
    };
  }

  function pointsToPath(points) {
    var close = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var d = '';

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (i === 0) {
        d += 'M' + p.x + ' ' + p.y;
      } else {
        d += 'L' + p.x + ' ' + p.y;
      }

      d += ' ';
    }

    if (close) {
      d += 'Z';
    }

    return d;
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--diamond
   */
  function diamond$1(options) {
    var size = options.size;
    var left = options.x - size / 2;
    var top = options.y - size / 2;
    var points = [{ x: left, y: top + size / 2 }, { x: left + size / 2, y: top }, { x: left + size, y: top + size / 2 }, { x: left + size / 2, y: top + size }, { x: left, y: top + size / 2 }];

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  function generateCrossPoints(x, y, size, barWidth) {
    var r = size / 2;
    var innerLeft = x - barWidth / 2;
    var innerTop = y - barWidth / 2;
    var left = x - r;
    var top = y - r;

    return [{ x: innerLeft, y: innerTop }, // Top
    { x: innerLeft, y: top }, { x: innerLeft + barWidth, y: top }, { x: innerLeft + barWidth, y: innerTop }, // Right
    { x: left + size, y: innerTop }, { x: left + size, y: innerTop + barWidth }, { x: innerLeft + barWidth, y: innerTop + barWidth }, // Bottom
    { x: innerLeft + barWidth, y: top + size }, { x: innerLeft, y: top + size }, { x: innerLeft, y: innerTop + barWidth }, // Left
    { x: left, y: innerTop + barWidth }, { x: left, y: innerTop }];
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--cross
   * @property {number} [width] - Width of the diagonals
   */
  function cross$3(options) {
    var x = options.x;
    var y = options.y;
    var r = options.size / 2;
    var width = isNaN(options.width) ? r / 2 : options.width;
    var barWidth = Math.min(width, r);

    var points = generateCrossPoints(x, y, options.size, barWidth);

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  /**
   * Get x1, y1, x2, y2 point from angle
   * Source: {@link https://codepen.io/NV/pen/jcnmK}
   * @private
   *
   * @param  {number} angle Radians
   * @return {object}       Point with x1, y2, x2, y2.
   */
  function angleToPoints(angle) {
    var segment = Math.floor(angle / Math.PI * 2) + 2;
    var diagonal = (0.5 * segment + 0.25) * Math.PI;
    var op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2);
    var x = op * Math.cos(angle);
    var y = op * Math.sin(angle);

    return {
      x1: x < 0 ? 1 : 0,
      y1: y < 0 ? 1 : 0,
      x2: x >= 0 ? x : x + 1,
      y2: y >= 0 ? y : y + 1
    };
  }

  /**
   * Turns degrees into radians
   * @private
   *
   * @param  {number} degrees Degrees
   * @return {number}         Radians
   */
  function toRadians(d) {
    return -d / 180 * Math.PI;
  }

  /**
   * Get x1, y1, x2, y2 point from degree
   * @private
   *
   * @param  {number} d Degree
   * @return {object}   Point with x1, y2, x2, y2.
   */
  function degreesToPoints(d) {
    return angleToPoints(toRadians(d));
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--saltire
   * @property {number} [width] - Width of the diagonals
   */
  function saltire(options) {
    var radians = toRadians(45);
    var r = options.size / 2;
    var width = isNaN(options.width) ? r / 2 : options.width;
    var barWidth = Math.min(width, r);
    var adjustedSize = options.size;

    // Adjust for the barwidth and rotation angle, so that the visual part is always inside the symbol area
    var h = Math.sin(Math.asin(-radians)) * (barWidth / 2);
    var c = r / Math.sin(-radians);
    adjustedSize += (c - r) * 2;
    adjustedSize -= h * 2;

    var centroid = { x: options.x, y: options.y };
    var points = generateCrossPoints(options.x, options.y, adjustedSize, barWidth).map(function (p) {
      return rotate(p, radians, centroid);
    });

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--square
   */
  function square$1(options) {
    var size = options.size;

    return {
      type: 'rect',
      fill: 'black',
      x: options.x - size / 2,
      y: options.y - size / 2,
      width: size,
      height: size
    };
  }

  var DIRECTION_TO_ANGLE = {
    up: 0,
    down: 180,
    left: 90,
    right: -90
  };

  /**
   * @extends symbol-config
   * @typedef {object} symbol--triangle
   * @property {string} [direction='up'] - Direction of the triangle ('up'|'down'|'left'|'right')
   */
  function triangle$1(options) {
    var size = options.size;
    var p = { x: options.x, y: options.y };
    var directionAngle = DIRECTION_TO_ANGLE[options.direction] || 0;
    var halfSize = size / 2;
    var left = options.x - halfSize;
    var top = options.y - halfSize;
    var points = [{ x: left, y: top + size }, { x: left + halfSize, y: top }, { x: left + size, y: top + size }, { x: left, y: top + size }];

    var radians = toRadians(directionAngle);
    points = points.map(function (pp) {
      return rotate(pp, radians, p);
    });

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--line
   * @property {string} [direction='horizontal'] - Direction of line ('horizontal'|'vertical').
   */
  function line$1(options) {
    var isVertical = options.direction === 'vertical';
    var r = options.size / 2;
    var x = options.x;
    var y = options.y;

    return {
      type: 'line',
      stroke: 'black',
      strokeWidth: 1,
      x1: x - (isVertical ? 0 : r),
      y1: y - (isVertical ? r : 0),
      x2: x + (isVertical ? 0 : r),
      y2: y + (isVertical ? r : 0)
    };
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--star
   * @property {number} [points=5] - Number of points on the star
   * @property {number} [startAngle=90] - Start drawing angle
   * @property {number} [innerRadius=size/2] - Size of the star core. My not exceed size of symbol.
   */
  function star$1(options) {
    var size = options.size;
    var points = [];
    var outerRadius = size / 2;
    var drawPoints = options.points || 5;
    var innerRadius = Math.min(options.innerRadius || size / 2, size) / 2;
    var startAngle = isNaN(options.startAngle) ? 90 : options.startAngle;
    var angle = 360 / drawPoints;

    for (var i = 1; i <= drawPoints; i++) {
      var pAngle = angle * i + startAngle;
      var radians = toRadians(pAngle);
      var innerRadians = toRadians(pAngle + angle / 2);
      var y = Math.sin(radians);
      var x = Math.cos(radians);
      var iy = Math.sin(innerRadians);
      var ix = Math.cos(innerRadians);

      points.push({
        x: options.x + x * outerRadius,
        y: options.y + y * outerRadius
      });

      points.push({
        x: options.x + ix * innerRadius,
        y: options.y + iy * innerRadius
      });
    }

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--n-polygon
   * @property {object} [sides=6] - Number of sides on the regular polygon
   * @property {object} [startAngle=0] - Start drawing angle
   */
  function nPolygon(options) {
    var points = [];
    var radius = options.size / 2;
    var drawPoints = Math.max(isNaN(options.sides) ? 6 : options.sides, 3);
    var angle = 360 / drawPoints;
    var startAngle = isNaN(options.startAngle) ? 0 : options.startAngle;

    for (var i = 1; i <= drawPoints; i++) {
      var radians = toRadians(angle * i + startAngle);
      var y = Math.sin(radians);
      var x = Math.cos(radians);
      points.push({
        x: options.x + x * radius,
        y: options.y + y * radius
      });
    }

    return {
      type: 'path',
      fill: 'black',
      d: pointsToPath(points)
    };
  }

  /**
   * @extends symbol-config
   * @typedef {object} symbol--bar
   * @property {string} [direction='horizontal'] - Direction of bar ('horizontal'|'vertical').
   */
  function bar(options) {
    var p = { x: options.x, y: options.y };
    var isVertical = options.direction === 'vertical';
    var r = options.size / 2;
    var width = r / 2;
    var halfWidth = width / 2;

    var points = [{ x: p.x - r, y: p.y + halfWidth }, { x: p.x - r, y: p.y - halfWidth }, { x: p.x + r, y: p.y - halfWidth }, { x: p.x + r, y: p.y + halfWidth }];

    if (isVertical) {
      var radians = toRadians(90);
      points = points.map(function (pp) {
        return rotate(pp, radians, p);
      });
    }

    var rect = pointsToRect(points);
    rect.type = 'rect';
    rect.fill = 'black';
    rect.collider = { type: 'rect' };

    return rect;
  }

  var reg$2 = registryFactory();

  reg$2.add('circle', circle$1);
  reg$2.add('diamond', diamond$1);
  reg$2.add('saltire', saltire);
  reg$2.add('square', square$1);
  reg$2.add('triangle', triangle$1);
  reg$2.add('line', line$1);
  reg$2.add('star', star$1);
  reg$2.add('n-polygon', nPolygon);
  reg$2.add('cross', cross$3);
  reg$2.add('bar', bar);

  function createRectCollider(_ref) {
    var x = _ref.x,
        y = _ref.y,
        size = _ref.size;

    var r = size / 2;
    return {
      type: 'rect',
      x: x - r,
      y: y - r,
      width: size,
      height: size
    };
  }

  function applyOpts(obj) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Object.keys(opts).forEach(function (key) {
      if (typeof mappedAttributes[key] !== 'undefined' && key !== 'transform') {
        obj[key] = opts[key];
      }
    });
  }

  /**
   * Factory function for symbols.
   * Options object is passed to symbols function.
   * @private
   * @param {symbol--bar|symbol--circle|symbol--cross|symbol--diamond|symbol--line|symbol--n-polygon|symbol--saltire|symbol--square|symbol--star|symbol--triangle} options - Options definition may contain any of the supported display-object attributes
   * @returns {object} A node definition
   */
  function create$3() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO handle reserverd properties x, y, size, data, etc..
    var fn = reg$2.get(options.type);
    if (fn) {
      var s = fn(options);
      if (!s.collider) {
        s.collider = createRectCollider(options);
      }

      applyOpts(s, options);

      if (typeof options.data !== 'undefined') {
        s.data = options.data;
      }

      return s;
    }
    return fn;
  }

  /**
   * Mandatory symbol config
   * @typedef {object} symbol-config
   * @property {object} options - Options definition may contain any of the supported display-object attributes
   * @property {string} options.type - Type of symbol
   * @property {number} options.x - x-coordinate
   * @property {number} options.y - y-coordinate
   * @property {number} options.size
   * @property {object} [options.data]
   */

  var DEFAULT_ERROR_SETTINGS = {
    errorShape: {
      shape: 'saltire',
      width: 2,
      size: 0.5,
      fill: '#333',
      stroke: '#333',
      strokeWidth: 0
    }
  };

  /**
    * @typedef {object}
    * @alias component--point.settings
    */
  var DEFAULT_DATA_SETTINGS$1 = {
    /** Type of shape
     * @type {datum-string=} */
    shape: 'circle',
    label: '',
    /** Fill color
     * @type {datum-string=} */
    fill: '#333',
    /** Stroke color
     * @type {datum-string=} */
    stroke: '#ccc',
    /** Stroke width
     * @type {datum-number=} */
    strokeWidth: 0,
    /** Opacity of shape
     * @type {datum-number=} */
    opacity: 1,
    /** Normalized x coordinate
     * @type {datum-number=} */
    x: 0.5,
    /** Normalized y coordinate
     * @type {datum-number=} */
    y: 0.5,
    /** Normalized size of shape
     * @type {datum-number=} */
    size: 1,
    strokeDasharray: ''
  };

  /**
    * @typedef {object}
    * @alias component--point.settings.sizeLimits
    */
  var SIZE_LIMITS = {
    /** Maximum size of shape, in pixels
     * @type {number=} */
    maxPx: 10000,
    /** Minimum size of shape, in pixels
     * @type {number=} */
    minPx: 1,
    /** Maximum size relative linear scale extent
     * @type {number=} */
    maxRelExtent: 0.1,
    /** Minimum size relative linear scale extent
     * @type {number=} */
    minRelExtent: 0.01,
    /** Maximum size relative discrete scale banwidth
     * @type {number=} */
    maxRelDiscrete: 1,
    /** Minimum size relative discrete scale banwidth
     * @type {number=} */
    minRelDiscrete: 0.1
  };

  function getPxSpaceFromScale(s, space) {
    if (s && typeof s.bandwidth === 'function') {
      // some kind of ordinal scale
      return {
        isBandwidth: true,
        value: Math.max(1, s.bandwidth() * space)
      };
    }
    return {
      isBandwidth: false,
      value: Math.max(1, space)
    };
  }

  function getPointSizeLimits(x, y, width, height, limits) {
    var xSpacePx = getPxSpaceFromScale(x ? x.scale : undefined, width, limits);
    var ySpacePx = getPxSpaceFromScale(y ? y.scale : undefined, height, limits);
    var maxSizePx = Math.min(xSpacePx.value * limits[xSpacePx.isBandwidth ? 'maxRelDiscrete' : 'maxRelExtent'], ySpacePx.value * limits[ySpacePx.isBandwidth ? 'maxRelDiscrete' : 'maxRelExtent']);
    var minSizePx = Math.min(xSpacePx.value * limits[xSpacePx.isBandwidth ? 'minRelDiscrete' : 'minRelExtent'], ySpacePx.value * limits[ySpacePx.isBandwidth ? 'minRelDiscrete' : 'minRelExtent']);
    var min = Math.max(1, Math.floor(minSizePx));
    var max = Math.max(1, Math.floor(maxSizePx));
    return {
      min: min, max: max, maxGlobal: limits.maxPx, minGlobal: limits.minPx
    };
  }

  function createDisplayPoints(dataPoints, _ref, pointSize, shapeFn) {
    var width = _ref.width,
        height = _ref.height;

    return dataPoints.filter(function (p) {
      return !isNaN(p.x + p.y);
    }).map(function (p) {
      var s = notNumber(p.size) ? DEFAULT_ERROR_SETTINGS.errorShape : p;
      var size = pointSize.min + s.size * (pointSize.max - pointSize.min);
      var shapeSpec = {
        type: s.shape === 'rect' ? 'square' : s.shape,
        label: p.label,
        x: p.x * width,
        y: p.y * height,
        fill: s.fill,
        size: Math.min(pointSize.maxGlobal, Math.max(pointSize.minGlobal, size)),
        stroke: s.stroke,
        strokeWidth: s.strokeWidth,
        strokeDasharray: s.strokeDasharray,
        opacity: s.opacity
      };
      if (s === p.errorShape) {
        shapeSpec.width = s.width;
      }
      var shape = shapeFn(shapeSpec);

      shape.data = p.data;
      return shape;
    });
  }

  var component$1 = {
    require: ['chart', 'resolver'],
    defaultSettings: {
      settings: {},
      data: {},
      animations: {
        enabled: false,
        trackBy: function trackBy(node) {
          return node.data.value;
        }
      },
      style: {
        item: '$shape'
      }
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render(_ref2) {
      var data = _ref2.data;

      var resolved = this.resolver.resolve({
        data: data,
        defaults: extend({}, DEFAULT_DATA_SETTINGS$1, this.style.item),
        settings: this.settings.settings,
        scaled: {
          x: this.rect.width,
          y: this.rect.height
        }
      });
      var _rect = this.rect,
          width = _rect.width,
          height = _rect.height;

      var limits = extend({}, SIZE_LIMITS, this.settings.settings.sizeLimits);
      var points = resolved.items;
      var pointSize = getPointSizeLimits(resolved.settings.x, resolved.settings.y, width, height, limits);
      return createDisplayPoints(points, this.rect, pointSize, this.settings.shapeFn || create$3);
    }
  };

  /**
   * @typedef {object} component--point
   */

  /**
   * @type {string}
   * @memberof component--point
   */
  var type = 'point';

  function pointMarker(picasso) {
    picasso.component(type, component$1);

    picasso.component('point-marker', component$1); // temporary backwards compatibility - DEPRECATED
  }

  /**
   * @typedef {object}
   * @alias component--pie-settings
   */
  var DEFAULT_DATA_SETTINGS$2 = {
    /** Start angle of the pie, in radians
     * @type {number=} */
    startAngle: 0,
    /** End angle of the pie, in radians
     * @type {number=} */
    endAngle: 2 * Math.PI,
    /**
     * @typedef {object}
     */
    slice: {
      label: '',
      /** Absolute value of the slice's arc length
       * @type {number=} */
      arc: 1,
      /** Visibility of the slice
       * @type {boolean=} */
      show: true,
      /** Fill color of the slice
       * @type {string=} */
      fill: '#333',
      /** Stroke color of the slice
       * @type {string=} */
      stroke: '#ccc',
      /** Stroke width of the slice
       * @type {number=} */
      strokeWidth: 1,
      /** Opacity of the slice
       * @type {number=} */
      opacity: 1,
      /** Inner radius of the slice
       * @type {number=} */
      innerRadius: 0,
      /** Outer radius of the slice
       * @type {number=} */
      outerRadius: 0.8,
      /** Corner radius of the slice, in pixels
       * @type {number=} */
      cornerRadius: 0,
      /** Radial offset of the slice
       * @type {number=} */
      offset: 0
    }
  };

  /**
   * @typedef {object} component--pie
   * @property {string} [type='pie']
   * @example
   * {
   *   type: 'pie',
   *   data: {
   *     extract: {
   *       field: 'Region',
   *       props: {
   *         num: { field: 'Population' }
   *       }
   *     }
   *   },
   *   settings: {
   *     startAngle: Math.PI / 2,
   *     endAngle: -Math.PI / 2,
   *     slice: {
   *       arc: { ref: 'num' },
   *       fill: 'green',
   *       stroke: 'red',
   *       strokeWidth: 2,
   *       innerRadius: 0.6,
   *       outerRadius 0.8,
   *       opacity: 0.8,
   *       offset: 0.2
   *     }
   *   }
   * }
   */

  function offsetSlice(centroid, offset, outerRadius, innerRadius) {
    var _centroid = slicedToArray(centroid, 2),
        vx = _centroid[0],
        vy = _centroid[1];

    var vlen = Math.sqrt(vx * vx + vy * vy);
    vx /= vlen;
    vy /= vlen;
    var diff = outerRadius - innerRadius;
    return { x: vx * offset * diff, y: vy * offset * diff };
  }

  function createDisplayPies(arcData, _ref, slices, sum) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;

    var arcGen = arc();
    var center = { x: x + width / 2, y: y + height / 2 };
    var innerRadius = Math.min(width, height) / 2;
    var outerRadius = Math.min(width, height) / 2;
    var cornerRadius = outerRadius / 100;
    return arcData.map(function (a, i) {
      var slice = slices[i];
      slice.type = 'path';
      var or = outerRadius * slice.outerRadius;
      var ir = innerRadius * slice.innerRadius;
      arcGen.innerRadius(ir);
      arcGen.outerRadius(or);
      arcGen.cornerRadius(cornerRadius * slice.cornerRadius);
      slice.d = arcGen(a);
      var centroid = arcGen.centroid(a);
      var offset = slice.offset ? offsetSlice(centroid, slice.offset, or, ir) : { x: 0, y: 0 };
      slice.transform = 'translate(' + offset.x + ', ' + offset.y + ') translate(' + center.x + ', ' + center.y + ')';
      slice.desc = {
        share: a.value / sum,
        slice: {
          start: a.startAngle,
          end: a.endAngle,
          innerRadius: ir,
          outerRadius: or,
          offset: { x: center.x + offset.x, y: center.y + offset.y }
        }
      };

      return slice;
    });
  }

  function arcValue(stngs, item) {
    if (stngs.slice && 'arc' in stngs.slice) {
      return item.arc;
    }
    return item.data.value;
  }

  var pieComponent = {
    require: ['chart', 'resolver'],
    defaultSettings: {
      settings: {
        startAngle: 0,
        endAngle: 2 * Math.PI,
        padAngle: 0,
        slice: {}
      },
      style: {
        slice: '$shape'
      },
      data: {}
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render(_ref2) {
      var data = _ref2.data;

      var arcValues = [];
      var slices = [];
      var stngs = this.settings.settings;

      var _resolver$resolve = this.resolver.resolve({
        data: data,
        defaults: extend({}, DEFAULT_DATA_SETTINGS$2.slice, this.style.slice),
        settings: stngs.slice
      }),
          items = _resolver$resolve.items;

      var sum = 0;
      for (var i = 0, len = items.length; i < len; i++) {
        var val = arcValue(stngs, items[i]);
        if (val > 0) {
          arcValues.push(val);
          slices.push(items[i]);
          sum += val;
        }
      }

      var pieGen = pie().sortValues(null);
      pieGen.startAngle(stngs.startAngle);
      pieGen.endAngle(stngs.endAngle);
      pieGen.padAngle(stngs.padAngle);
      var arcData = pieGen(arcValues);

      return createDisplayPies(arcData, extend({}, this.rect, { x: 0, y: 0 }), slices, sum);
    }
  };

  function pie$1(picasso) {
    picasso.component('pie', pieComponent);
  }

  /**
   * Create a crispifier
   * @ignore
   *
   * @param  {Object} [crispMap] Optional crispmap if you need custom crisping.
   * @return {Function}          crispItem function
   *
   * @example
   * import { crispifierFactory } from "core/crispifier";
   *
   * let crispify = crispifierFactory(customCrispMap);
   *
   * // For a single item
   * crispify(myItem);
   *
   * // For multiple items
   * crispify.multiple(myArrayOfItems);
   */
  function crispifierFactory(crispMap) {
    // Define the crispMap
    if (crispMap === undefined) {
      crispMap = {};

      crispMap.line = {
        append: ['x1', 'x2', 'y1', 'y2'],
        round: [],
        condition: function condition(item) {
          return item.x1 === item.x2 || item.y1 === item.y2;
        },
        conditionAppend: function conditionAppend(item) {
          return item.strokeWidth % 2 !== 0;
        }
      };

      crispMap.rect = {
        append: ['x', 'y'],
        round: ['width', 'height'],
        condition: function condition() {
          return true;
        },
        conditionAppend: function conditionAppend(item) {
          return item.strokeWidth % 2 !== 0;
        }
      };
    }

    // Re-map the crispmap
    Object.keys(crispMap).forEach(function (type) {
      var self = crispMap[type];

      self.items = [];

      self.append.forEach(function (toAppend) {
        self.items.push({
          key: toAppend,
          type: 'append'
        });
      });

      self.round.forEach(function (toAppend) {
        self.items.push({
          key: toAppend,
          type: 'round'
        });
      });
    });

    /**
     * Crispify a single item
     * @ignore
     * @param  {Object} item  Item with renderer variables such as X, Y, and type.
     * @return {Undefined}    Returns nothing, modifies the original item instead
     */
    function crispItem(item) {
      if (crispMap[item.type] && crispMap[item.type].condition(item)) {
        var self = crispMap[item.type];
        var doAppend = self.conditionAppend === undefined || self.conditionAppend(item);

        self.items.forEach(function (i) {
          var rounded = Math.round(item[i.key]);
          var diff = item[i.key] - rounded;
          item[i.key] = rounded;

          if (doAppend && i.type === 'append') {
            if (diff > 0) {
              item[i.key] += 0.5;
            } else {
              item[i.key] -= 0.5;
            }
          }
        });
      }
    }

    /**
     * Crispify multiple items
     * @ignore
     *
     * @param  {Array} items  Array of objects to crispify
     * @return {Undefined}    Returns nothing, modifies the original item instead
     */
    crispItem.multiple = function (items) {
      return items.forEach(function (item) {
        return crispItem(item);
      });
    };

    return crispItem;
  }

  var crispifier = crispifierFactory();

  var Transposer = function () {
    /**
     * @private
     */
    function Transposer() {
      classCallCheck(this, Transposer);

      this.reset();

      this.push.apply(this, arguments);
    }

    /**
     * Evaluate a key for a transposed coordinate
     *
     * @param  {String} key   Key
     * @return {String}         Actual key
     */


    createClass(Transposer, [{
      key: 'transposeCoordinate',


      /**
       * Transpose a coordinate according to this.flipXY and
       * the available rendering area
       *
       * @param  {String} key        The key of the coordinate to transpose
       * @param  {Number} coordinate The coordinate
       * @return {Number}            The actual location of the coordinate
       */
      value: function transposeCoordinate(key, coordinate, flipXY) {
        if (typeof coordinate === 'number' && isFinite(coordinate)) {
          var firstChar = key.substring(0, 1);

          if (firstChar === 'x' || key === 'cx') {
            return coordinate * this.width;
          } else if (key === 'width') {
            return coordinate * this.width;
          } else if (key === 'r') {
            return coordinate * (!flipXY ? this.width : this.height);
          } else if (firstChar === 'y' || key === 'cy') {
            return coordinate * this.height;
          } else if (key === 'height') {
            return coordinate * this.height;
          }
        }

        return coordinate;
      }

      /**
       * Push an item into the storage of the transposer
       *
       * @param  {Object} items An item to be drawed
       * @return {Object}       Can be chained
       */

    }, {
      key: 'push',
      value: function push() {
        var _storage;

        (_storage = this.storage).push.apply(_storage, arguments);
        return this;
      }
    }, {
      key: 'processItem',
      value: function processItem(item) {
        var newItem = {};
        var flipXY = typeof item.flipXY !== 'undefined' ? item.flipXY : this.flipXY;
        var crisp = typeof item.crisp !== 'undefined' ? item.crisp : this.crisp;

        if (item.fn && typeof item.fn === 'function') {
          var width = flipXY ? this.height : this.width;
          var height = flipXY ? this.width : this.height;

          item = item.fn({ width: width, height: height, flipXY: flipXY });

          var objectKeys = Object.keys(item);

          for (var ki = 0, kl = objectKeys.length; ki < kl; ki++) {
            var key = objectKeys[ki];
            var nkey = Transposer.evaluateKey(key, flipXY);
            newItem[nkey] = item[key];
          }
        } else {
          var _objectKeys = Object.keys(item);

          for (var _ki = 0, _kl = _objectKeys.length; _ki < _kl; _ki++) {
            var _key = _objectKeys[_ki];
            var _nkey = Transposer.evaluateKey(_key, flipXY);
            var nval = this.transposeCoordinate(_nkey, item[_key], flipXY);
            newItem[_nkey] = nval;
          }
        }

        if (crisp) {
          crispifier(newItem);
        }

        return newItem;
      }

      /**
       * Get the output of the transposer
       *
       * @return {Array}   Array of objects
       */

    }, {
      key: 'output',
      value: function output() {
        var items = [];

        for (var i = 0, l = this.storage.length; i < l; i++) {
          var newItem = this.processItem(this.storage[i]);

          items.push(newItem);
        }

        return items;
      }

      /**
       * Reset the transposer
       *
       * @return {Undefined}  Does not return anything
       */

    }, {
      key: 'reset',
      value: function reset() {
        this.storage = [];
        this.flipXY = false;
        this.crisp = false;

        this.width = 0;
        this.height = 0;
      }
    }], [{
      key: 'evaluateKey',
      value: function evaluateKey(key, flipXY) {
        if (flipXY) {
          var firstChar = key.substring(0, 1);
          var rest = key.substring(1);

          if (firstChar === 'x') {
            return 'y' + rest;
          } else if (firstChar === 'y') {
            return 'x' + rest;
          } else if (key === 'cx') {
            return 'cy';
          } else if (key === 'cy') {
            return 'cx';
          } else if (key === 'width') {
            return 'height';
          } else if (key === 'height') {
            return 'width';
          }
        }

        return key;
      }
    }]);
    return Transposer;
  }();

  function transposer() {
    for (var _len = arguments.length, items = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      items[_key2] = arguments[_key2];
    }

    return new (Function.prototype.bind.apply(Transposer, [null].concat(items)))();
  }

  /**
   * Generate array of lines (ticks) from scale
   *
   * @param {object} scale - A scale supplied by the chart
   * @param {object} settings - The settings object from the grid line component
   * @param {object} rect - The rect containing width and height to renderer in
   * @returns {array} - Returns an array of ticks
   * @ignore
   */
  function lineGen(scale, distance) {
    if (!scale || !distance) {
      return [];
    }
    return scale.cachedTicks && scale.cachedTicks() || scale.ticks({ distance: distance });
  }

  var gridLineComponent = {
    created: function created() {},


    require: ['chart', 'renderer'],
    defaultSettings: {
      displayOrder: 0,
      style: { // Theming style
        ticks: '$guide-line',
        minorTicks: '$guide-line--minor'
      }
    },

    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;

      this.blueprint = transposer();

      this.blueprint.width = this.rect.width;
      this.blueprint.height = this.rect.height;
      this.blueprint.x = this.rect.x;
      this.blueprint.y = this.rect.y;
      this.blueprint.crisp = true;
    },
    render: function render() {
      var _this = this;

      // Setup scales
      this.x = this.settings.x ? this.chart.scale(this.settings.x) : null;
      this.y = this.settings.y ? this.chart.scale(this.settings.y) : null;
      updateScaleSize(this, 'x', this.rect.width);
      updateScaleSize(this, 'y', this.rect.height);

      // Return an empty array to abort rendering when no scales are available to renderer
      if (!this.x && !this.y) {
        return [];
      }

      this.settings.ticks = extend({ show: true }, this.style.ticks, this.settings.ticks || {});
      this.settings.minorTicks = extend({ show: false }, this.style.minorTicks, this.settings.minorTicks || {});

      // Setup lines for X and Y
      this.lines = {
        x: [],
        y: []
      };

      // Use the lineGen function to generate appropriate ticks
      this.lines.x = lineGen(this.x, this.rect.width);
      this.lines.y = lineGen(this.y, this.rect.height);

      // Set all Y lines to flipXY by default
      // This makes the transposer flip them individually
      this.lines.y = this.lines.y.map(function (i) {
        return extend(i, { flipXY: true });
      });

      // Define a style that differs between major and minor ticks.
      var style = {};

      // Loop through all X and Y lines
      [].concat(toConsumableArray(this.lines.x), toConsumableArray(this.lines.y)).forEach(function (p) {
        style = p.isMinor ? _this.settings.minorTicks : _this.settings.ticks;

        // If the style's show is falsy, don't renderer this item (to respect axis settings).
        if (style.show) {
          // Use the transposer to handle actual positioning
          _this.blueprint.push({
            type: 'line',
            x1: p.position,
            y1: 0,
            x2: p.position,
            y2: 1,
            stroke: style.stroke || 'black',
            strokeWidth: typeof style.strokeWidth !== 'undefined' ? style.strokeWidth : 1,
            flipXY: p.flipXY || false // This flips individual points (Y-lines)
          });
        }
      });

      return this.blueprint.output();
    }
  };

  /**
   * @typedef {object} component--grid-line-settings
   * @property {object} x
   * @property {string} x.scale - The scale to use along x
   * @property {object} y
   * @property {string} y.scale - The scale to use along y
   * @property {object} [ticks]
   * @property {boolean} [ticks.show=true]
   * @property {string} [ticks.stroke='black']
   * @property {number} [ticks.strokeWidth='1']
   * @property {object} [minorTicks]
   * @property {boolean} [minorTicks.show=true]
   * @property {string} [minorTicks.stroke='black']
   * @property {number} [minorTicks.strokeWidth='1']
   */

  function gridLine(picasso) {
    picasso.component('grid-line', gridLineComponent);
  }

  /**
   * Return a D property for a SVG path to get a direction marker
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} r - Radius
   * @param {string} [d='bottom'] - Direction
   * @returns {string} - Finished D property
   * @ignore
   */
  function directionMarker(x, y, r) {
    var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bottom';

    r *= 0.8;
    if (d === 'left' || d === 'right') {
      var right = d === 'right';
      return '\n      M ' + x + ' ' + (y - r) + '\n      A ' + r * 1.25 + ' ' + r * 1.25 + ', 0, 1, ' + (right ? 0 : 1) + ', ' + x + ' ' + (y + r) + '\n      L ' + (right ? x + r : x - r) + ' ' + y + ' Z\n    ';
    }
    var bottom = d === 'bottom';
    return '\n    M ' + (x - r) + ' ' + y + '\n    A ' + r * 1.25 + ' ' + r * 1.25 + ', 0, 1, ' + (bottom ? 1 : 0) + ', ' + (x + r) + ' ' + y + '\n    L ' + x + ' ' + (bottom ? y + r : y - r) + ' Z\n  ';
  }

  function directionTriangle(x, y, r) {
    var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'bottom';

    r *= 0.75;
    if (d === 'left' || d === 'right') {
      var right = d === 'right';
      x += right ? r * 1.5 : -(r * 1.5);
      return '\n      M ' + x + ' ' + (y - r) + '\n      L ' + x + ' ' + (y + r) + '\n      L ' + (right ? x + r : x - r) + ' ' + y + ' Z\n    ';
    }
    var bottom = d === 'bottom';
    y += bottom ? r * 1.5 : -(r * 1.5);
    return '\n    M ' + (x - r) + ' ' + y + '\n    L ' + (x + r) + ' ' + y + '\n    L ' + x + ' ' + (bottom ? y + r : y - r) + ' Z\n  ';
  }

  /**
   * Handle out of bound shapes
   * Does not return anything, modifies "items" property instead (should be re-considered)
   *
   * @param {object} oob - Out of bounds object from parent
   * @param {object} settings - Settings object from parent
   * @param {object[]} items - Array of all items (for collision detection)
   * @ignore
   */
  function oobManager(_ref) {
    var blueprint = _ref.blueprint,
        oob = _ref.oob,
        settings = _ref.settings,
        items = _ref.items;

    var oobKeys = Object.keys(oob);
    var style = settings.style.oob || {};

    var _loop = function _loop(i, len) {
      var key = oobKeys[i];
      var value = oob[key];

      if (value.length > 0) {
        var position = key.charAt(1);
        var flipXY = key.charAt(0) === 'y';

        var xPadding = style.padding.x + style.width;
        var yPadding = style.padding.y + style.width;
        var direction = 'bottom';

        if (flipXY) {
          direction = position === '1' ? 'bottom' : 'top';
        } else {
          direction = position === '1' ? 'right' : 'left';
        }

        var indicator = blueprint.processItem({
          fn: function fn(_ref2) {
            var width = _ref2.width,
                height = _ref2.height;
            /* eslint no-loop-func: 0 */
            var x = position * width + (position === '1' ? -xPadding : xPadding);
            var y = flipXY ? yPadding : height - yPadding;

            if (style.type === 'arc') {
              return {
                type: 'path',
                d: directionMarker(flipXY ? y : x, flipXY ? x : y, style.width, direction),
                x: x,
                y: y,
                stroke: style.stroke,
                fill: style.fill,
                strokeWidth: style.strokeWidth || 0
              };
            }

            return {
              type: 'circle',
              cx: x,
              cy: y,
              r: style.width,
              stroke: style.stroke,
              fill: style.fill,
              strokeWidth: style.strokeWidth || 0,
              opacity: style.opacity,
              data: value
            };
          },
          flipXY: flipXY
        });

        var x = indicator.cx || indicator.x;
        var y = indicator.cy || indicator.y;

        var text = {
          type: 'text',
          text: value.length || '',
          x: x - style.width * 0.4,
          y: y + style.width * 0.4,
          fontFamily: style.text.fontFamily,
          fontSize: style.width * 1.3 + 'px',
          stroke: style.text.stroke,
          fill: style.text.fill,
          strokeWidth: style.text.strokeWidth || 0,
          opacity: style.text.opacity
        };

        var triangle = {
          type: 'path',
          d: directionTriangle(x, y, style.width, direction),
          x: x,
          y: y,
          stroke: style.triangle.stroke,
          fill: style.triangle.fill,
          strokeWidth: style.triangle.strokeWidth || 0,
          opacity: style.triangle.opacity
        };

        items.push(indicator, text, triangle);
      }
    };

    for (var i = 0, len = oobKeys.length; i < len; i++) {
      _loop(i, len);
    }
  }

  function refLabelDefaultSettings() {
    return {
      fill: '#000',
      fontFamily: 'Arial',
      fontSize: '12px',
      opacity: 1,
      maxWidth: 1,
      maxWidthPx: 9999,
      padding: 5,
      background: {
        fill: '#fff',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 0.5
      }
    };
  }

  /**
   * Converts a numerical OR string value to a normalized value
   *
   * @param {string|number} align -Description how to align (Numerical from 0-1 or 'top', 'left', 'center', 'middle', 'bottom' or 'right')
   * @returns {number} - Normalized value 0...1
   * @ignore
   */
  function alignmentToNumber(align) {
    if (typeof align === 'undefined') {
      return 0;
    } else if (typeof align === 'number' && isFinite(align)) {
      return align;
    } else if (typeof align === 'string') {
      switch (align) {
        case 'center':
        case 'middle':
          return 0.5;
        case 'bottom':
        case 'right':
          return 1;
        case 'top':
        case 'left':
        default:
          return 0;
      }
    }

    return 0;
  }

  /**
   * Create line and label (if applicable)
   * Does not return anything, modifies "items" property instead (should be re-considered)
   *
   * @param {object} p - Current point
   * @param {object} style - Applicable line styling
   * @param {object} settings - Settings object derived from parent
   * @param {object[]} items - Array of all items (for collision detection)
   * @ignore
   */
  function createLineWithLabel(_ref) {
    var chart = _ref.chart,
        blueprint = _ref.blueprint,
        renderer = _ref.renderer,
        p = _ref.p,
        settings = _ref.settings,
        items = _ref.items;

    var doesNotCollide = true;
    var line = false;
    var rect = false;
    var label = false;
    var value = false;
    var style = extend(true, {}, settings.style.line, p.line || {});

    // Use the transposer to handle actual positioning
    line = blueprint.processItem({
      type: 'line',
      x1: p.position,
      y1: 0,
      x2: p.position,
      y2: 1,
      stroke: style.stroke || 'black',
      strokeWidth: style.strokeWidth || 1,
      flipXY: p.flipXY || false // This flips individual points (Y-lines)
    });

    if (p.label) {
      var item = extend(true, refLabelDefaultSettings(), settings.style.label || {}, { fill: style.stroke }, p.label);
      var formatter = void 0;
      var measuredValue = {
        width: 0,
        height: 0
      };
      var valueString = '';

      if (typeof p.formatter === 'string') {
        formatter = chart.formatter(p.formatter);
      } else if (_typeof(p.formatter) === 'object') {
        formatter = chart.formatter(p.formatter);
      } else if (typeof p.scale !== 'undefined' && p.scale.data) {
        // TODO - Add support for array as source into formatter
        var scaleData = p.scale.data() && p.scale.data().fields;
        formatter = scaleData && scaleData[0] ? scaleData[0].formatter() : null;
      }

      if (formatter) {
        valueString = ' (' + formatter(p.value) + ')';
      } else if (p.scale) {
        valueString = ' (' + p.value + ')';
      }

      if (valueString) {
        measuredValue = renderer.measureText({
          text: valueString,
          fontFamily: item.fontFamily,
          fontSize: item.fontSize
        });
      }

      // Measure the label text
      var measuredLabel = renderer.measureText({
        text: item.text || '',
        fontFamily: item.fontFamily,
        fontSize: item.fontSize
      });

      var measured = {
        width: measuredLabel.width + measuredValue.width,
        height: Math.max(measuredLabel.height, measuredValue.height)
      };

      var labelPadding = item.padding;

      // let anchor = item.anchor === 'end' ? 'end' : 'start';

      var align = alignmentToNumber(p.flipXY ? item.vAlign : item.align);
      var vAlign = alignmentToNumber(p.flipXY ? item.align : item.vAlign);

      var calcWidth = Math.min(1 + measured.width + labelPadding * 2, item.maxWidth * blueprint.width, item.maxWidthPx);
      var calcHeight = measured.height + labelPadding * 2;

      var rectWidth = p.flipXY ? calcHeight : calcWidth;
      var rectHeight = p.flipXY ? calcWidth : calcHeight;

      rect = blueprint.processItem({
        fn: function fn(_ref2) {
          var width = _ref2.width,
              height = _ref2.height;

          var x = p.position * width - (p.flipXY ? calcHeight : calcWidth) * (1 - align);
          x = p.flipXY ? x : Math.max(x, 0);
          var y = Math.max(Math.abs(vAlign * height - rectHeight * vAlign), 0);
          return {
            type: 'rect',
            x: x,
            y: y,
            width: p.flipXY ? rectWidth : Math.min(rectWidth, blueprint.width - x),
            height: rectHeight,
            stroke: item.background.stroke,
            strokeWidth: item.background.strokeWidth,
            fill: item.background.fill,
            opacity: item.background.opacity
          };
        },
        flipXY: p.flipXY || false // This flips individual points (Y-lines)
      });

      if (rect.x < -1 || rect.x + rect.width > blueprint.width + 1 || rect.y < -1 || rect.y + rect.height > blueprint.height + 1) {
        // do not create labels if out of bounds
        rect = undefined;
      } else {
        // Labels are just basic objects attached to a corner of a rect,
        // and this rect needs to already be processed
        // so there is no blueprint.processItem required here
        label = {
          type: 'text',
          text: item.text || '',
          fill: item.fill,
          opacity: item.opacity,
          fontFamily: item.fontFamily,
          fontSize: item.fontSize,
          x: rect.x + labelPadding,
          y: rect.y + rect.height / 2 + measured.height / 3,
          maxWidth: rect.width - labelPadding * 2 - measuredValue.width,
          anchor: 'start'
        };

        if (valueString) {
          value = {
            type: 'text',
            text: valueString || '',
            fill: item.fill,
            opacity: item.opacity,
            fontFamily: item.fontFamily,
            fontSize: item.fontSize,
            x: label.x + 3 + (rect.width - (measuredValue.width + labelPadding * 2)),
            y: label.y
          };
        }

        // Detect collisions with other labels/rects or lines
        for (var i = 0, len = items.length; i < len; i++) {
          var curItem = items[i];

          if (curItem.type === 'rect') {
            // We only detect rects here, since rects are always behind labels,
            // and we wouldn't want to measure text one more time
            if (NarrowPhaseCollision.testRectRect(rect, curItem)) {
              doesNotCollide = false;
            }
          } else if (curItem.type === 'line') {
            // This will only collide when flipXY are the same for both objects,
            // So it only collides on objects on the same "axis"
            if (p.flipXY === curItem.flipXY && NarrowPhaseCollision.testRectLine(rect, curItem)) {
              doesNotCollide = false;
            }
          }
        }
      }
    }

    // Always push the line,
    // but this is done after collision detection,
    // because otherwise it would collide with it's own line
    items.push(line);

    // Only push rect & label if we haven't collided and both are defined
    if (doesNotCollide && rect && label) {
      items.push(rect, label);
      if (value) {
        items.push(value);
      }
    }
  }

  function createOobData(line) {
    var data = {
      value: line.value
    };

    if (line.label) {
      data.label = line.label.text;
    }

    return data;
  }

  function filterUndefinedValue(line) {
    return typeof line.value !== 'undefined';
  }

  /**
   * @typedef {object} component--ref-line
   * @experimental
   * @property {refline-generic-style} [style=refline-generic-style] - x coordinate
   * @property {object} lines - X & Y Lines
   * @property {reflines-x[]} [lines.x=refline-line[]] - lines along X
   * @property {reflines-y[]} [lines.y=refline-line[]] - lines along Y
   */

  /**
   * @typedef {object} component--ref-line.style
   * @property {refline-oob-style} [oob=component--ref-line.style.oob] - Style for out of bounds object (oob)
   * @property {refline-line} [line=refline-line] - Generic style for lines
   * @property {refline-line-label} [label=refline-line-label] - Generic style for labels
   */

  /**
   * @typedef {object} component--ref-line.style.oob
   * @property {boolean} [show=true] - Show out of bounds items
   * @property {string} [type=undefined] - EXPERIMENTAL:  Set this to 'arc' for an experimental out of bounds shape (only works with SVG)
   * @property {number} [width=10] - Width of the out of bounds object
   * @property {string} [fill='#1A1A1A'] - Fill color of the OOB object
   * @property {string} [stroke='transparent'] - Stroke of the OOB object
   * @property {number} [strokeWidth=0] - Stroke width of the OOB object
   * @property {number} [opacity=1] - Opacity of the OOB object
   * @property {refline-generic-text} [text=refline-generic-text] - Text configuration for out of bounds
   * @property {refline-generic-object} [triangle=refline-generic-object] - The triangle in OOB
   * @property {object} [padding] - Padding on X
   * @property {number} [padding.x=28] - Padding on X
   * @property {number} [padding.y=5] - Padding on X
   */

  /**
   * @typedef {object} component--ref-line.generic-text
   * @property {string} [text=''] - Text (if applicable)
   * @property {string} [fontSize='12px'] - Font size (if applicable)
   * @property {string} [fontFamily='Arial'] - Font family
   * @property {string} [fill='#fff'] - Fill color
   * @property {string} [stroke='transparent'] - Stroke
   * @property {number} [strokeWidth=0] - Stroke width
   * @property {number} [opacity=1] - Opacity
   */

  /**
   * @typedef {object} component--ref-line.line
   * @property {number} value - The value of the reference line. If a scale is specified, it is applied.
   * @property {Scale} [scale=undefined] - Scale to use (if undefined will use normalized value 0-1)
   * @property {refline-generic-object} [line=refline-generic-object] - The style of the line
   * @property {refline-line-label} [label=refline-line-label] - The label style of the line
   */

  /**
   * @typedef {object} component--ref-line.line-label
   * @property {number} padding=5 - Padding inside the label
   * @property {string} [text=''] - Text
   * @property {string} [fontSize='12px'] - Font size
   * @property {string} [fontFamily='Arial'] - Font family
   * @property {string} [stroke='transparent'] - Stroke
   * @property {number} [strokeWidth=0] - Stroke width
   * @property {number} [opacity=1] - Opacity
   * @property {number|string} [align=0] - Alignment property left to right (0 = left, 1 = right). Also supports string ('left', 'center', 'middle', 'right')
   * @property {number|string} [vAlign=0] - Alignment property top to bottom (0 = top, 1 = bottom). Also supports string ('top', 'center', 'middle', 'bottom')
   * @property {number} [maxWidth=1] - The maximum relative width to the width of the rendering area (see maxWidthPx below aswell)
   * @property {number} [maxWidthPx=9999] - The maximum width in pixels.
   * @property {refline-line-label-background} [background=refline-line-label-background] - The background style (rect behind text)
   */

  /**
   * @example
   * // Labels will be rendered with the maximum size of the smallest value of maxWidth and maxWidthPx size, so you may specify maxWidth 0.8 but maxWidthPx 100 and will never be over 100px and never over 80% of the renderable area.
   */

  /**
   * @typedef {object} component--ref-line.line-label-background
   * @property {string} [fill='#fff'] - Fill color
   * @property {string} [stroke='transparent'] - Stroke
   * @property {number} [strokeWidth=0] - Stroke width
   * @property {number} [opacity=0.5] - Opacity
   */

  /**
   * @typedef {object} component--ref-line.generic-object
   * @property {string} [fill='#fff'] - Fill color
   * @property {string} [stroke='transparent'] - Stroke
   * @property {number} [strokeWidth=0] - Stroke width
   * @property {number} [opacity=1] - Opacity
   */

  var refLineComponent = {
    require: ['chart', 'renderer', 'dockConfig'],
    defaultSettings: {
      displayOrder: 0,
      style: {
        oob: {
          show: true,
          width: 10,
          fill: '#1A1A1A',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1,
          text: {
            fontFamily: 'Arial',
            stroke: 'transparent',
            fill: '#fff',
            strokeWidth: 0,
            opacity: 1
          },
          triangle: {
            fill: '#4D4D4D',
            stroke: 'transparent',
            strokeWidth: 0,
            opacity: 1
          },
          padding: {
            x: 28,
            y: 5
          }
        },
        line: {
          stroke: '#000'
        },
        label: {
          strokeWidth: 0
        }
      }
    },

    preferredSize: function preferredSize() {
      return 30;
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;

      this.blueprint = transposer();

      this.blueprint.width = this.rect.width;
      this.blueprint.height = this.rect.height;
      this.blueprint.x = this.rect.x;
      this.blueprint.y = this.rect.y;
      this.blueprint.crisp = true;
    },
    render: function render() {
      var _this = this;

      var settings = this.settings;

      // Setup lines for X and Y
      this.lines = {
        x: [],
        y: []
      };

      this.lines.x = settings.lines && settings.lines.x || [];
      this.lines.y = settings.lines && settings.lines.y || [];

      if (this.lines.x.length === 0 && this.lines.y.length === 0) {
        return [];
      }

      var oob = {
        x0: [],
        x1: [],
        y0: [],
        y1: []
      };

      // Convert a value to an actual position using the scale
      this.lines.x = this.lines.x.filter(filterUndefinedValue).map(function (line) {
        if (line.scale) {
          var scale = _this.chart.scale(line.scale);
          return extend(line, { scale: scale, position: scale(line.value) });
        }

        return extend(line, { position: line.value });
      });
      // Set all Y lines to flipXY by default
      // This makes the transposer flip them individually
      this.lines.y = this.lines.y.filter(filterUndefinedValue).map(function (line) {
        if (line.scale) {
          var scale = _this.chart.scale(line.scale);
          return extend(line, { scale: scale, position: scale(line.value), flipXY: true });
        }

        return extend(line, { position: line.value, flipXY: true });
      });

      // Move out of bounds lines (OOB) to separate rendering
      this.lines.x = this.lines.x.filter(function (line) {
        if (line.position < 0 || line.position > 1) {
          oob['x' + (line.position > 1 ? 1 : 0)].push(createOobData(line));
          return false;
        }
        return true;
      });

      this.lines.y = this.lines.y.filter(function (line) {
        if (line.position < 0 || line.position > 1) {
          oob['y' + (line.position > 1 ? 1 : 0)].push(createOobData(line));
          return false;
        }
        return true;
      });

      var items = [];

      // Loop through all X and Y lines
      [].concat(toConsumableArray(this.lines.x), toConsumableArray(this.lines.y)).forEach(function (p) {
        var show = p.show === true || typeof p.show === 'undefined';

        if (show) {
          // Create line with labels
          createLineWithLabel({
            chart: _this.chart, blueprint: _this.blueprint, renderer: _this.renderer, p: p, settings: settings, items: items
          });
        }
      });

      // Handle out of bounds
      if (settings.style.oob.show) {
        oobManager({
          blueprint: this.blueprint, oob: oob, settings: settings, items: items
        });
      }

      return items;
    }
  };

  function refLine(picasso) {
    picasso.component('ref-line', refLineComponent);
  }

  function appendStyle(struct, buildOpts) {
    extend(struct, buildOpts.style);
    var halfWidth = struct.strokeWidth / 2;

    if (buildOpts.align === 'top') {
      struct.y1 -= halfWidth;
      struct.y2 -= halfWidth;
    } else if (buildOpts.align === 'bottom') {
      struct.y1 += halfWidth;
      struct.y2 += halfWidth;
    } else if (buildOpts.align === 'left') {
      struct.x1 -= halfWidth;
      struct.x2 -= halfWidth;
    } else if (buildOpts.align === 'right') {
      struct.x1 += halfWidth;
      struct.x2 += halfWidth;
    }
  }

  function buildLine(buildOpts) {
    var struct = {
      type: 'line',
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      collider: {
        type: null
      }
    };

    if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
      struct.x1 = buildOpts.innerRect.x - buildOpts.outerRect.x;
      struct.x2 = buildOpts.innerRect.width + buildOpts.innerRect.x;
      struct.y1 = struct.y2 = buildOpts.align === 'top' ? buildOpts.innerRect.height - buildOpts.padding : buildOpts.padding;
    } else {
      struct.x1 = struct.x2 = buildOpts.align === 'left' ? buildOpts.innerRect.width - buildOpts.padding : buildOpts.padding;
      struct.y1 = buildOpts.innerRect.y - buildOpts.outerRect.y;
      struct.y2 = buildOpts.innerRect.height + buildOpts.innerRect.y;
    }

    appendStyle(struct, buildOpts);

    return struct;
  }

  function checkText(text) {
    return typeof text === 'string' || typeof text === 'number' ? text : '-';
  }

  function appendStyle$1(struct, buildOpts) {
    ['fill', 'fontSize', 'fontFamily'].forEach(function (style) {
      struct[style] = buildOpts.style[style];
    });
  }

  function clampEnds(struct, buildOpts) {
    if (buildOpts.tilted || buildOpts.stepSize) {
      return;
    }

    var outerBoundaryMultipler = 0.75;
    if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
      var leftBoundary = 0;
      var rightBoundary = buildOpts.outerRect.width;
      var textWidth = Math.min(buildOpts.maxWidth * outerBoundaryMultipler / 2, buildOpts.textRect.width / 2);
      var leftTextBoundary = struct.x - textWidth;
      var rightTextBoundary = struct.x + textWidth;
      if (leftTextBoundary < leftBoundary) {
        struct.anchor = 'start';
        struct.x = buildOpts.innerRect.x - buildOpts.outerRect.x;
        struct.maxWidth *= outerBoundaryMultipler;
      } else if (rightTextBoundary > rightBoundary) {
        struct.anchor = 'end';
        struct.x = buildOpts.innerRect.width + buildOpts.innerRect.x;
        struct.maxWidth *= outerBoundaryMultipler;
      }
    } else {
      var topBoundary = 0;
      var bottomBoundary = buildOpts.outerRect.height;
      var textHeight = buildOpts.maxHeight / 2;
      var topTextBoundary = struct.y - textHeight;
      var bottomTextBoundary = struct.y + textHeight;
      if (topTextBoundary < topBoundary) {
        struct.y = buildOpts.innerRect.y - buildOpts.outerRect.y;
        struct.baseline = 'text-before-edge';
      } else if (bottomTextBoundary > bottomBoundary) {
        struct.y = buildOpts.innerRect.height + (buildOpts.innerRect.y - buildOpts.outerRect.y);
        struct.baseline = 'text-after-edge';
      }
    }
  }

  function appendPadding(struct, buildOpts) {
    if (buildOpts.align === 'top') {
      struct.y -= buildOpts.padding;
    } else if (buildOpts.align === 'bottom') {
      struct.y += buildOpts.padding + buildOpts.maxHeight;
    } else if (buildOpts.align === 'left') {
      struct.x -= buildOpts.padding;
    } else if (buildOpts.align === 'right') {
      struct.x += buildOpts.padding;
    }
  }

  function appendTilting(struct, buildOpts) {
    if (buildOpts.tilted) {
      var r = -buildOpts.angle;
      var radians = r * (Math.PI / 180);

      if (buildOpts.align === 'bottom') {
        struct.x -= buildOpts.maxHeight * Math.sin(radians) / 2;
        struct.y -= buildOpts.maxHeight;
        struct.y += buildOpts.maxHeight * Math.cos(radians) / 2;
      } else {
        struct.x -= buildOpts.maxHeight * Math.sin(radians) / 3;
      }

      struct.transform = 'rotate(' + r + ', ' + struct.x + ', ' + struct.y + ')';
      struct.anchor = buildOpts.align === 'bottom' === buildOpts.angle < 0 ? 'start' : 'end';

      // adjustForEnds
      var textWidth = Math.cos(radians) * buildOpts.maxWidth;
      if (buildOpts.align === 'bottom' === buildOpts.angle < 0) {
        // right
        var rightBoundary = buildOpts.outerRect.width - buildOpts.paddingEnd;
        var rightTextBoundary = struct.x + textWidth;
        if (rightTextBoundary > rightBoundary) {
          struct.maxWidth = (rightBoundary - struct.x - 10) / Math.cos(radians);
        }
      } else {
        // left
        var leftBoundary = buildOpts.paddingEnd;
        var leftTextBoundary = struct.x - textWidth;
        if (leftTextBoundary < leftBoundary) {
          struct.maxWidth = (struct.x - leftBoundary - 10) / Math.cos(radians);
        }
      }
    }
  }

  function bandwidthCollider(tick, struct, buildOpts) {
    if (buildOpts.align === 'bottom' || buildOpts.align === 'top') {
      var tickCenter = tick.position * buildOpts.innerRect.width;
      var leftBoundary = tickCenter + (buildOpts.innerRect.x - buildOpts.outerRect.x - buildOpts.stepSize / 2);
      struct.collider = {
        type: 'rect',
        x: leftBoundary,
        y: 0,
        width: leftBoundary < 0 ? buildOpts.stepSize + leftBoundary : buildOpts.stepSize, // Adjust collider so that it doesnt extend onto neighbor collider
        height: buildOpts.innerRect.height
      };
    } else {
      var _tickCenter = tick.position * buildOpts.innerRect.height;
      var topBoundary = _tickCenter + (buildOpts.innerRect.y - buildOpts.outerRect.y - buildOpts.stepSize / 2);
      struct.collider = {
        type: 'rect',
        x: 0,
        y: topBoundary,
        width: buildOpts.innerRect.width,
        height: topBoundary < 0 ? buildOpts.stepSize + topBoundary : buildOpts.stepSize // Adjust collider so that it doesnt extend onto neighbor collider
      };
    }

    // Clip edges of the collider, should not extend beyoned the outerRect
    var collider = struct.collider;
    collider.x = Math.max(collider.x, 0);
    collider.y = Math.max(collider.y, 0);
    var widthClip = collider.x + collider.width - (buildOpts.outerRect.x + buildOpts.outerRect.width);
    collider.width = widthClip > 0 ? collider.width - widthClip : collider.width;
    var heightClip = collider.y + collider.height - (buildOpts.outerRect.y + buildOpts.outerRect.height);
    collider.height = heightClip > 0 ? collider.height - heightClip : collider.height;
  }

  function boundsCollider(tick, struct) {
    struct.collider = {
      type: 'polygon',
      vertices: [{ x: struct.boundingRect.x, y: struct.boundingRect.y }, { x: struct.boundingRect.x + struct.boundingRect.width, y: struct.boundingRect.y }, { x: struct.boundingRect.x + struct.boundingRect.width, y: struct.boundingRect.y + struct.boundingRect.height }, { x: struct.boundingRect.x, y: struct.boundingRect.y + struct.boundingRect.height }]
    };
  }

  function tiltedCollider(tick, struct, buildOpts) {
    var radians = buildOpts.angle * (Math.PI / 180);
    var halfWidth = Math.max(buildOpts.stepSize / 2, struct.boundingRect.height / 2); // Handle if bandwidth is zero
    var startAnchor = struct.anchor === 'start';
    var em = struct.anchor === 'end' && radians < 0;
    var sp = struct.anchor === 'start' && radians >= 0;
    var y = struct.boundingRect.y + (sp || em ? struct.boundingRect.height : 0);
    // Generate starting points at bandwidth boundaries
    var points = [{ x: struct.x - halfWidth, y: y }, { x: struct.x + halfWidth, y: y }].map(function (p) {
      return rotate(p, radians, { x: struct.x, y: struct.y });
    }); // Rotate around center point to counteract labels rotation

    // Append points to wrap polygon around label
    var margin = 10; // extend slightly to handle single char labels better
    var leftPoint = {
      x: startAnchor ? struct.boundingRect.x + struct.boundingRect.width + margin : struct.boundingRect.x - margin,
      y: struct.boundingRect.y + struct.boundingRect.height
    };

    var rightPoint = {
      x: startAnchor ? struct.boundingRect.x + struct.boundingRect.width + margin : struct.boundingRect.x - margin,
      y: struct.boundingRect.y
    };

    var orderedPoints = radians >= 0 ? [leftPoint, rightPoint] : [rightPoint, leftPoint];
    points.push.apply(points, orderedPoints);

    struct.collider = {
      type: 'polygon',
      vertices: points
    };
  }

  function appendCollider(tick, struct, buildOpts) {
    if (buildOpts.layered || !buildOpts.stepSize) {
      boundsCollider(tick, struct);
    } else if (buildOpts.tilted) {
      tiltedCollider(tick, struct, buildOpts);
    } else {
      bandwidthCollider(tick, struct, buildOpts);
    }
  }

  function appendBounds(struct, buildOpts) {
    struct.boundingRect = buildOpts.textBounds(struct);
  }

  function wiggle(buildOpts, isVertical) {
    var a = isNaN(buildOpts.style.align) ? 0.5 : Math.min(Math.max(buildOpts.style.align, 0), 1);
    var w = 0;
    if (buildOpts.tilted) {
      w = buildOpts.stepSize * a;
    } else {
      var size = isVertical ? buildOpts.textRect.height : buildOpts.textRect.width;
      w = Math.max(0, buildOpts.stepSize - size) * a;
    }

    return w;
  }

  function buildNode(tick, buildOpts) {
    var struct = {
      type: 'text',
      text: checkText(tick.label),
      x: 0,
      y: 0,
      maxWidth: buildOpts.maxWidth,
      maxHeight: buildOpts.maxHeight
    };

    if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
      struct.x = tick.start * buildOpts.innerRect.width + (buildOpts.innerRect.x - buildOpts.outerRect.x) + wiggle(buildOpts, false);
      struct.y = buildOpts.align === 'top' ? buildOpts.innerRect.height : 0;
      struct.anchor = buildOpts.stepSize ? 'start' : 'middle';

      struct.x += isNaN(buildOpts.style.offset) ? 0 : +buildOpts.style.offset;
    } else {
      struct.y = tick.start * buildOpts.innerRect.height + (buildOpts.innerRect.y - buildOpts.outerRect.y) + wiggle(buildOpts, true);
      struct.x = buildOpts.align === 'left' ? buildOpts.innerRect.width : 0;
      struct.anchor = buildOpts.align === 'left' ? 'end' : 'start';
      struct.baseline = buildOpts.stepSize ? 'text-before-edge' : 'central';

      struct.y += isNaN(buildOpts.style.offset) ? 0 : +buildOpts.style.offset;
    }

    appendStyle$1(struct, buildOpts);
    clampEnds(struct, buildOpts);
    appendPadding(struct, buildOpts);
    appendTilting(struct, buildOpts);
    appendBounds(struct, buildOpts);
    appendCollider(tick, struct, buildOpts);

    return struct;
  }

  function appendStyle$2(struct, buildOpts) {
    extend(struct, buildOpts.style);
  }

  function appendPadding$1(struct, buildOpts) {
    if (buildOpts.align === 'top') {
      struct.y1 -= buildOpts.padding;
      struct.y2 -= buildOpts.padding;
    } else if (buildOpts.align === 'bottom') {
      struct.y1 += buildOpts.padding;
      struct.y2 += buildOpts.padding;
    } else if (buildOpts.align === 'left') {
      struct.x1 -= buildOpts.padding;
      struct.x2 -= buildOpts.padding;
    } else if (buildOpts.align === 'right') {
      struct.x1 += buildOpts.padding;
      struct.x2 += buildOpts.padding;
    }
  }

  function adjustForEnds(struct, buildOpts) {
    var halfWidth = struct.strokeWidth / 2;

    if (struct.x1 === buildOpts.innerRect.width) {
      // outer end tick
      struct.x1 -= halfWidth;
      struct.x2 -= halfWidth;
    } else if (struct.x1 === 0) {
      // outer start tick
      struct.x1 += halfWidth;
      struct.x2 += halfWidth;
    } else if (struct.y1 === buildOpts.innerRect.height) {
      struct.y1 -= halfWidth;
      struct.y2 -= halfWidth;
    } else if (struct.y1 === 0) {
      struct.y1 += halfWidth;
      struct.y2 += halfWidth;
    }
  }

  function buildNode$1(tick, buildOpts) {
    var struct = {
      type: 'line',
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      collider: {
        type: null
      }
    };

    if (buildOpts.align === 'top' || buildOpts.align === 'bottom') {
      struct.x1 = struct.x2 = tick.position * buildOpts.innerRect.width + (buildOpts.innerRect.x - buildOpts.outerRect.x);
      struct.y1 = buildOpts.align === 'top' ? buildOpts.innerRect.height : 0;
      struct.y2 = buildOpts.align === 'top' ? struct.y1 - buildOpts.tickSize : struct.y1 + buildOpts.tickSize;
    } else {
      struct.y1 = struct.y2 = tick.position * buildOpts.innerRect.height + (buildOpts.innerRect.y - buildOpts.outerRect.y);
      struct.x1 = buildOpts.align === 'left' ? buildOpts.innerRect.width : 0;
      struct.x2 = buildOpts.align === 'left' ? struct.x1 - buildOpts.tickSize : struct.x1 + buildOpts.tickSize;
    }

    appendStyle$2(struct, buildOpts);
    appendPadding$1(struct, buildOpts);
    adjustForEnds(struct, buildOpts);
    return struct;
  }

  function isMajorTick(tick) {
    return !tick.isMinor;
  }

  function isVerticalLabelOverlapping(_ref) {
    var majorTicks = _ref.majorTicks,
        measureText = _ref.measureText,
        rect = _ref.rect;

    var size = rect.height;
    var textHeight = measureText('M').height;
    if (majorTicks.length < 2) {
      return false;
    }

    var d = size * Math.abs(majorTicks[0].position - majorTicks[1].position);
    if (d < textHeight) {
      return true;
    }

    return false;
  }

  function isHorizontalLabelOverlapping(_ref2) {
    var majorTicks = _ref2.majorTicks,
        measureText = _ref2.measureText,
        rect = _ref2.rect,
        state = _ref2.state;

    /*
     * Currently isn't any good way of doing a accurate measurement on size available (bandWidth * width) for labels.
     * It's a lifecycle limitation as components docked either left or right can affect the width available after the calculation is done.
     * <number of components docked left/right> * <width of components> => Less accurate ===> Can result in only ellips char rendered as labels.
     */
    var m = state.labels.activeMode === 'layered' ? 2 : 1;
    var size = rect.width;
    var tickSize = majorTicks.map(function (tick) {
      return tick.label;
    }).map(function (l) {
      return '' + l.slice(0, 1) + (l.length > 1 ? '…' : '');
    }) // Measure the size of 1 chars + the ellips char.
    .map(measureText).map(function (r) {
      return r.width;
    });
    for (var i = 0; i < majorTicks.length; ++i) {
      var tick = majorTicks[i];
      var d1 = m * size * Math.abs(tick.start - tick.end);
      var d2 = tickSize[i];
      if (d1 < d2) {
        return true;
      }
    }
    return false;
  }

  function shouldAutoTilt(_ref3) {
    var majorTicks = _ref3.majorTicks,
        measure = _ref3.measure,
        rect = _ref3.rect,
        state = _ref3.state,
        settings = _ref3.settings;

    var glyphCount = settings.labels.maxGlyphCount;
    var m = state.labels.activeMode === 'layered' ? 2 : 1;
    var magicSizeRatioMultipler = 0.7; // So that if less the 70% of labels are visible, toggle on tilt
    var ellipsCharSize = measure('…').width; // include ellipsed char in calc as it's generally large then the char it replaces
    var size = rect.width;
    var maxLabelWidth = 0;
    var d1 = 0;

    if (!isNaN(glyphCount)) {
      var minBandwidth = majorTicks.reduce(function (prev, curr) {
        return Math.min(Math.abs(curr.start - curr.end), prev);
      }, Infinity);
      d1 = m * size * minBandwidth;
      maxLabelWidth = measure('M').width * magicSizeRatioMultipler * glyphCount;
      if (maxLabelWidth + ellipsCharSize > d1) {
        return true;
      }
    } else {
      for (var i = 0; i < majorTicks.length; i++) {
        var tick = majorTicks[i];
        var label = tick.label;
        var width = measure(label).width * (label.length > 1 ? magicSizeRatioMultipler : 1);
        d1 = m * size * Math.abs(tick.start - tick.end);
        if (width + ellipsCharSize > d1) {
          return true;
        }
      }
    }

    return false;
  }

  function isTiltedLabelOverlapping(_ref4) {
    var majorTicks = _ref4.majorTicks,
        measureText = _ref4.measureText,
        rect = _ref4.rect,
        bleedSize = _ref4.bleedSize,
        angle = _ref4.angle;

    if (majorTicks.length < 2) {
      return false;
    } else if (angle === 0) {
      return true; // TODO 0 angle should be considered non-tilted
    }
    var absAngle = Math.abs(angle);
    var size = rect.width - bleedSize;
    var stepSize = size * Math.abs(majorTicks[0].position - majorTicks[1].position);
    var textHeight = measureText('M').height;
    var reciprocal = 1 / stepSize; // 1 === Math.sin(90 * (Math.PI / 180))
    var distanceBetweenLabels = Math.sin(absAngle * (Math.PI / 180)) / reciprocal;

    return textHeight > distanceBetweenLabels;
  }

  function isToLarge(_ref5) {
    var rect = _ref5.rect,
        state = _ref5.state,
        majorTicks = _ref5.majorTicks,
        measure = _ref5.measure,
        horizontal = _ref5.horizontal;

    if (horizontal) {
      return isHorizontalLabelOverlapping({
        majorTicks: majorTicks,
        measureText: measure,
        rect: rect,
        state: state
      });
    }

    return isVerticalLabelOverlapping({
      majorTicks: majorTicks,
      measureText: measure,
      rect: rect,
      state: state
    });
  }

  function getClampedValue(_ref6) {
    var value = _ref6.value,
        maxValue = _ref6.maxValue,
        minValue = _ref6.minValue,
        range = _ref6.range,
        modifier = _ref6.modifier;

    if (!isNaN(range) && !isNaN(modifier)) {
      value = range * modifier;
    }

    if (value > maxValue) {
      value = maxValue;
    }

    if (value < minValue) {
      value = minValue;
    }

    return value;
  }

  function getSize(_ref7) {
    var isDiscrete = _ref7.isDiscrete,
        rect = _ref7.rect,
        formatter = _ref7.formatter,
        measureText = _ref7.measureText,
        scale = _ref7.scale,
        settings = _ref7.settings,
        state = _ref7.state;

    var size = 0;
    var edgeBleed = {
      left: 0, top: 0, right: 0, bottom: 0
    };
    var _settings$labels = settings.labels,
        maxValue = _settings$labels.maxLengthPx,
        minValue = _settings$labels.minLengthPx;


    if (settings.labels.show) {
      var align = settings.align;
      var horizontal = align === 'top' || align === 'bottom';
      var distance = horizontal ? rect.width : rect.height;
      var majorTicks = scale.ticks({
        settings: settings,
        distance: distance,
        formatter: formatter
      }).filter(isMajorTick);

      var measure = function measure(text) {
        var m = measureText({
          text: text,
          fontSize: settings.labels.fontSize,
          fontFamily: settings.labels.fontFamily
        });
        m.width = getClampedValue({ value: m.width, maxValue: maxValue, minValue: minValue });
        return m;
      };

      if (isDiscrete && horizontal && settings.labels.mode === 'auto') {
        if (shouldAutoTilt({
          majorTicks: majorTicks, measure: measure, rect: rect, state: state, settings: settings
        })) {
          state.labels.activeMode = 'tilted';
        } else {
          state.labels.activeMode = 'horizontal';
        }
      }

      if (isDiscrete && state.labels.activeMode !== 'tilted' && isToLarge({
        rect: rect, state: state, majorTicks: majorTicks, measure: measure, horizontal: horizontal
      })) {
        var toLargeSize = Math.max(rect.width, rect.height); // used to hide the axis
        return { size: toLargeSize, isToLarge: true };
      }

      var sizeFromTextRect = void 0;
      if (state.labels.activeMode === 'tilted') {
        var radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180); // angle in radians
        sizeFromTextRect = function sizeFromTextRect(r) {
          return getClampedValue({ value: r.width, maxValue: maxValue, minValue: minValue }) * Math.sin(radians) + r.height * Math.cos(radians);
        };
      } else if (horizontal) {
        sizeFromTextRect = function sizeFromTextRect(r) {
          return r.height;
        };
      } else {
        sizeFromTextRect = function sizeFromTextRect(r) {
          return getClampedValue({ value: r.width, maxValue: maxValue, minValue: minValue });
        };
      }

      var labels = void 0;
      if (horizontal && state.labels.activeMode !== 'tilted') {
        labels = ['M'];
      } else if (!isNaN(settings.labels.maxGlyphCount)) {
        var label = '';
        for (var i = 0; i < settings.labels.maxGlyphCount; i++) {
          label += 'M';
        }
        labels = [label];
      } else {
        labels = majorTicks.map(function (tick) {
          return tick.label;
        });
      }
      var tickMeasures = labels.map(measure);
      var labelSizes = tickMeasures.map(sizeFromTextRect);
      var textSize = Math.max.apply(Math, toConsumableArray(labelSizes).concat([0]));
      size += textSize;
      size += settings.labels.margin;

      if (state.labels.activeMode === 'layered') {
        size *= 2;
      }

      if (state.labels.activeMode === 'tilted') {
        var extendLeft = settings.align === 'bottom' === settings.labels.tiltAngle >= 0;
        var _radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180); // angle in radians
        var h = measureText('M').height;
        var maxWidth = (textSize - h * Math.cos(_radians)) / Math.sin(_radians);
        var labelWidth = function labelWidth(r) {
          return Math.min(maxWidth, r.width) * Math.cos(_radians) + r.height;
        };
        var adjustByPosition = function adjustByPosition(s, i) {
          var pos = majorTicks[i] ? majorTicks[i].position : 0;
          if (extendLeft) {
            return s - pos * rect.width;
          }
          return s - (1 - pos) * rect.width;
        };
        var bleedSize = Math.min(settings.labels.maxEdgeBleed, Math.max.apply(Math, toConsumableArray(tickMeasures.map(labelWidth).map(adjustByPosition)).concat([0]))) + settings.paddingEnd;
        var bleedDir = extendLeft ? 'left' : 'right';
        edgeBleed[bleedDir] = bleedSize;

        if (isDiscrete && isTiltedLabelOverlapping({
          majorTicks: majorTicks, measureText: measureText, rect: rect, bleedSize: bleedSize, angle: settings.labels.tiltAngle
        })) {
          return { size: Math.max(rect.width, rect.height), isToLarge: true };
        }
      }
    }

    return { size: size, edgeBleed: edgeBleed };
  }

  function tickSpacing(settings) {
    var spacing = 0;
    spacing += settings.paddingStart;
    spacing += settings.line.show ? settings.line.strokeWidth : 0;
    spacing += settings.ticks.show ? settings.ticks.margin : 0;
    return spacing;
  }

  function tickMinorSpacing(settings) {
    return settings.line.strokeWidth + settings.minorTicks.margin;
  }

  function labelsSpacing(settings) {
    var spacing = 0;
    spacing += settings.ticks.show ? settings.ticks.tickSize : 0;
    spacing += tickSpacing(settings) + settings.labels.margin;
    return spacing;
  }

  function calcActualTextRect(_ref) {
    var style = _ref.style,
        measureText = _ref.measureText,
        tick = _ref.tick;

    return measureText({
      text: tick.label,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily
    });
  }

  function majorTicks(ticks) {
    return ticks.filter(function (t) {
      return !t.isMinor;
    });
  }

  function minorTicks(ticks) {
    return ticks.filter(function (t) {
      return t.isMinor;
    });
  }

  function tickBuilder(ticks, buildOpts) {
    return ticks.map(function (tick) {
      return buildNode$1(tick, buildOpts);
    });
  }

  function tickBandwidth(scale, tick) {
    return tick ? Math.abs(tick.end - tick.start) : scale.bandwidth();
  }

  function labelBuilder(ticks, buildOpts, tickFn) {
    return ticks.map(function (tick) {
      tickFn(tick);
      var label = buildNode(tick, buildOpts);
      label.data = tick.data;
      return label;
    });
  }

  function layeredLabelBuilder(ticks, buildOpts, settings, tickFn) {
    var padding = buildOpts.padding;
    var spacing = labelsSpacing(settings);
    return ticks.map(function (tick, i) {
      tickFn(tick);
      var padding2 = spacing + buildOpts.maxHeight + settings.labels.margin;
      buildOpts.layer = i % 2;
      buildOpts.padding = i % 2 === 0 ? padding : padding2;
      var label = buildNode(tick, buildOpts);
      label.data = tick.data;
      return label;
    });
  }

  function filterOverlappingLabels(labels, ticks) {
    var isOverlapping = function isOverlapping(l1, l2) {
      // eslint-disable-line arrow-body-style
      var rect1 = l1.boundingRect;
      var rect2 = l2.boundingRect;

      return NarrowPhaseCollision.testRectRect(rect1, rect2);
    };

    for (var i = 0; i <= labels.length - 1; i++) {
      for (var k = i + 1; k <= Math.min(i + 5, i + (labels.length - 1)); k++) {
        // TODO Find a better way to handle exteme/layered labels then to iterare over ~5 next labels
        if (labels[i] && labels[k] && isOverlapping(labels[i], labels[k])) {
          if (k === labels.length - 1) {
            // On collition with last label, remove current label instead
            labels.splice(i, 1);
            if (ticks) {
              ticks.splice(i, 1);
            }
          } else {
            labels.splice(k, 1);
            if (ticks) {
              ticks.splice(k, 1);
            }
          }
          k--;
          i--;
        }
      }
    }
  }

  function discreteCalcMaxTextRect(_ref2) {
    var measureText = _ref2.measureText,
        settings = _ref2.settings,
        innerRect = _ref2.innerRect,
        scale = _ref2.scale,
        tilted = _ref2.tilted,
        layered = _ref2.layered,
        tick = _ref2.tick;

    var h = measureText({
      text: 'M',
      fontSize: settings.labels.fontSize,
      fontFamily: settings.labels.fontFamily
    }).height;

    var bandwidth = tickBandwidth(scale, tick);

    var textRect = { width: 0, height: h };
    if (settings.align === 'left' || settings.align === 'right') {
      textRect.width = innerRect.width - labelsSpacing(settings) - settings.paddingEnd;
    } else if (layered) {
      textRect.width = bandwidth * innerRect.width * 2;
    } else if (tilted) {
      var radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180);
      textRect.width = (innerRect.height - labelsSpacing(settings) - settings.paddingEnd - h * Math.cos(radians)) / Math.sin(radians);
    } else {
      textRect.width = bandwidth * innerRect.width;
    }

    textRect.width = getClampedValue({ value: textRect.width, maxValue: settings.labels.maxLengthPx, minValue: settings.labels.minLengthPx });

    return textRect;
  }

  function continuousCalcMaxTextRect(_ref3) {
    var measureText = _ref3.measureText,
        settings = _ref3.settings,
        innerRect = _ref3.innerRect,
        ticks = _ref3.ticks,
        tilted = _ref3.tilted,
        layered = _ref3.layered;

    var h = measureText({
      text: 'M',
      fontSize: settings.labels.fontSize,
      fontFamily: settings.labels.fontFamily
    }).height;

    var textRect = { width: 0, height: h };
    if (settings.align === 'left' || settings.align === 'right') {
      textRect.width = innerRect.width - labelsSpacing(settings) - settings.paddingEnd;
    } else if (layered) {
      textRect.width = innerRect.width / majorTicks(ticks).length * 0.75 * 2;
    } else if (tilted) {
      var radians = Math.abs(settings.labels.tiltAngle) * (Math.PI / 180);
      textRect.width = (innerRect.height - labelsSpacing(settings) - settings.paddingEnd - h * Math.cos(radians)) / Math.sin(radians);
    } else {
      textRect.width = innerRect.width / majorTicks(ticks).length * 0.75;
    }

    textRect.width = getClampedValue({ value: textRect.width, maxValue: settings.labels.maxLengthPx, minValue: settings.labels.minLengthPx });

    return textRect;
  }

  function getStepSizeFn(_ref4) {
    var innerRect = _ref4.innerRect,
        scale = _ref4.scale,
        settings = _ref4.settings,
        tick = _ref4.tick;

    var size = settings.align === 'top' || settings.align === 'bottom' ? innerRect.width : innerRect.height;
    var bandwidth = tickBandwidth(scale, tick);
    return size * bandwidth;
  }

  function nodeBuilder(isDiscrete) {
    var calcMaxTextRectFn = void 0;
    var filterLabels = false;

    function continuous() {
      calcMaxTextRectFn = continuousCalcMaxTextRect;
      filterLabels = true;
      return continuous;
    }

    function discrete() {
      calcMaxTextRectFn = discreteCalcMaxTextRect;
      return discrete;
    }

    function build(_ref5) {
      var settings = _ref5.settings,
          scale = _ref5.scale,
          innerRect = _ref5.innerRect,
          outerRect = _ref5.outerRect,
          measureText = _ref5.measureText,
          ticks = _ref5.ticks,
          state = _ref5.state,
          textBounds = _ref5.textBounds;

      var nodes = [];
      var major = majorTicks(ticks);
      var minor = minorTicks(ticks);
      var buildOpts = {
        innerRect: innerRect,
        align: settings.align,
        outerRect: outerRect
      };
      var tilted = state.labels.activeMode === 'tilted';
      var layered = state.labels.activeMode === 'layered';
      var majorTickNodes = void 0;

      if (settings.line.show) {
        buildOpts.style = settings.line;
        buildOpts.padding = settings.paddingStart;

        nodes.push(buildLine(buildOpts));
      }
      if (settings.ticks.show) {
        buildOpts.style = settings.ticks;
        buildOpts.tickSize = settings.ticks.tickSize;
        buildOpts.padding = tickSpacing(settings);

        majorTickNodes = tickBuilder(major, buildOpts);
      }
      if (settings.labels.show) {
        var padding = labelsSpacing(settings);
        buildOpts.style = settings.labels;
        buildOpts.padding = padding;
        buildOpts.tilted = tilted;
        buildOpts.layered = layered;
        buildOpts.angle = settings.labels.tiltAngle;
        buildOpts.paddingEnd = settings.paddingEnd;
        buildOpts.textBounds = textBounds;
        var tickFn = function tickFn(tick) {
          var maxSize = calcMaxTextRectFn({
            measureText: measureText, settings: settings, innerRect: innerRect, ticks: ticks, scale: scale, tilted: tilted, layered: layered, tick: tick
          });
          buildOpts.maxWidth = maxSize.width;
          buildOpts.maxHeight = maxSize.height;
          buildOpts.textRect = calcActualTextRect({ tick: tick, measureText: measureText, style: buildOpts.style });
          buildOpts.stepSize = getStepSizeFn({
            innerRect: innerRect, scale: scale, ticks: ticks, settings: settings, tick: tick
          });
        };

        var labelNodes = [];
        if (layered && (settings.align === 'top' || settings.align === 'bottom')) {
          labelNodes = layeredLabelBuilder(major, buildOpts, settings, tickFn);
        } else {
          labelNodes = labelBuilder(major, buildOpts, tickFn);
        }

        // Remove labels (and paired tick) that are overlapping
        if (filterLabels && !buildOpts.tilted) {
          filterOverlappingLabels(labelNodes, majorTickNodes);
        }

        nodes.push.apply(nodes, toConsumableArray(labelNodes));
      }

      if (settings.minorTicks && settings.minorTicks.show && minor.length > 0) {
        buildOpts.style = settings.minorTicks;
        buildOpts.tickSize = settings.minorTicks.tickSize;
        buildOpts.padding = tickMinorSpacing(settings);

        nodes.push.apply(nodes, toConsumableArray(tickBuilder(minor, buildOpts)));
      }

      if (majorTickNodes) {
        nodes.push.apply(nodes, toConsumableArray(majorTickNodes));
      }

      return nodes;
    }

    continuous.build = build;
    discrete.build = build;

    return isDiscrete ? discrete() : continuous();
  }

  // const DEFAULT_LAYOUT_SETTINGS = { // TODO create dis and con specific settings
  //   anchor: 'auto', // TODO re-name from align..
  //   // orientation: 'auto', // TODO impl. v/h/auto
  //   // direction: 'auto', // TODO impl. left/right/top/bottom/auto
  //   padding: { // TODO use dock layout margin instead..
  //     start: 0,
  //     end: 10
  //   },
  //   maxGlyphCount: NaN,
  //   maxEdgeBleed: Infinity
  //   // labelMode: 'auto' // TODO move here? auto, horizontal, layered
  // };

  /**
   * Discrete axis settings
   * @typedef {object}
   * @alias component--axis-discrete
   */
  var DEFAULT_DISCRETE_SETTINGS = {
    /**
     * @typedef {object}
     */
    labels: {
      /** Toggle labels on/off
      * @type {boolean=} */
      show: true,
      /** Tilting angle in degrees. Capped between -90 and 90. Only applicable when labels are in `tilted` mode.
      * @type {number=} */
      tiltAngle: 40,
      /** Control the amount of space (in pixels) that labes can occupy outside their docking area. Only applicable when labels are in `tilted` mode.
      * @type {number=} */
      maxEdgeBleed: Infinity,
      /** Space in pixels between the tick and label.
      * @type {number=} */
      margin: 4,
      /** Max length of labels in pixels
      * @type {number=} */
      maxLengthPx: 150,
      /** Min length of labels in pixels. Labels will always at least require this much space
      * @type {number=} */
      minLengthPx: 0,
      /** Control how labels arrange themself. Availabe modes are `auto`, `horizontal`, `layered` and `tilted`. When set to `auto` the axis determines the best possible layout in the current context.
      * @type {string=} */
      mode: 'auto',
      /** When only a sub-set of data is available, ex. when paging. This property can be used to let the axis estimate how much space the labels will consume, allowing it to give a consistent space estimate over the entire dataset when paging.
      * @type {number=} */
      maxGlyphCount: NaN,
      /** Align act as a slider for the text bounding rect over the item bandwidth, given that the item have a bandwidth. Except when labels are tilted, then the align is a pure align that shifts the position of the label anchoring point.
      * @type {number=} */
      align: 0.5,
      /** Offset in pixels along the axis direction.
      * @type {number=} */
      offset: 0
    },
    /**
     * @typedef {object}
     */
    ticks: {
      /** Toggle ticks on/off
      * @type {boolean=} */
      show: false,
      /** Space in pixels between the ticks and the line.
      * @type {number=} */
      margin: 0,
      /** Size of the ticks in pixels.
      * @type {number=} */
      tickSize: 4
    },
    /**
     * @typedef {object}
     */
    line: {
      /** Toggle line on/off
      * @type {boolean=} */
      show: false
    },
    /** Padding in direction perpendicular to the axis
      * @type {number=} */
    paddingStart: 0,
    /** Padding in direction perpendicular to the axis
      * @type {number=} */
    paddingEnd: 10,
    /** Set the anchoring point of the axis. Avaialable options are `auto/left/right/bottom/top`. In `auto` the axis determines the best option. The options are restricted based on the axis orientation, a vertical axis may only anchor on `left` or `right`
      * @type {string=} */
    align: 'auto'
  };

  /**
   * Continuous axis settings
   * @typedef {object}
   * @alias component--axis-continuous
   */
  var DEFAULT_CONTINUOUS_SETTINGS = {
    /**
     * @typedef {object}
     */
    labels: {
      /** Toggle labels on/off
      * @type {boolean=} */
      show: true,
      /** Space in pixels between the tick and label.
      * @type {number=} */
      margin: 4,
      /** Max length of labels in pixels
      * @type {number=} */
      maxLengthPx: 150,
      /** Min length of labels in pixels. Labels will always at least require this much space
      * @type {number=} */
      minLengthPx: 0,
      /** Align act as a slider for the text bounding rect over the item bandwidth, given that the item have a bandwidth.
      * @type {number=} */
      align: 0.5,
      /** Offset in pixels along the axis direction.
      * @type {number=} */
      offset: 0
    },
    /**
     * @typedef {object}
     */
    ticks: {
      /** Toggle ticks on/off
      * @type {boolean=} */
      show: true,
      /** Space in pixels between the ticks and the line.
      * @type {number=} */
      margin: 0,
      /** Size of the ticks in pixels.
      * @type {number=} */
      tickSize: 8
    },
    /**
     * @typedef {object}
     */
    minorTicks: {
      /** Toggle minor-ticks on/off
      * @type {boolean=} */
      show: false,
      /** Size of the ticks in pixels.
      * @type {number=} */
      tickSize: 3,
      /** Space in pixels between the ticks and the line.
      * @type {number=} */
      margin: 0
    },
    /**
     * @typedef {object}
     */
    line: {
      /** Toggle line on/off
      * @type {boolean=} */
      show: true
    },
    /** Padding in direction perpendicular to the axis
      * @type {number=} */
    paddingStart: 0,
    /** Padding in direction perpendicular to the axis
      * @type {number=} */
    paddingEnd: 10,
    /** Set the anchoring point of the axis. Avaialable options are `auto/left/right/bottom/top`. In `auto` the axis determines the best option. The options are restricted based on the axis orientation, a vertical axis may only anchor on `left` or `right`
      * @type {string=} */
    align: 'auto'
  };

  function calcRequiredSize(_ref) {
    var isDiscrete = _ref.isDiscrete,
        rect = _ref.rect,
        formatter = _ref.formatter,
        measureText = _ref.measureText,
        scale = _ref.scale,
        settings = _ref.settings,
        state = _ref.state;

    var size = 0;

    var _getLabelSize = getSize({
      isDiscrete: isDiscrete,
      rect: rect,
      formatter: formatter,
      measureText: measureText,
      scale: scale,
      settings: settings,
      state: state
    }),
        labelSize = _getLabelSize.size,
        edgeBleed = _getLabelSize.edgeBleed,
        isToLarge = _getLabelSize.isToLarge;

    size += labelSize;

    if (isToLarge) {
      return { size: size };
    }

    if (settings.ticks.show) {
      size += settings.ticks.margin;
      size += settings.ticks.tickSize;
    }
    if (settings.minorTicks && settings.minorTicks.show) {
      var minorTicksSize = settings.minorTicks.margin + settings.minorTicks.tickSize;
      if (minorTicksSize > size) {
        size = minorTicksSize;
      }
    }
    if (settings.line.show) {
      size += settings.line.strokeWidth;
    }
    size += settings.paddingStart;
    size += settings.paddingEnd;

    return { size: size, edgeBleed: edgeBleed };
  }

  function alignTransform(_ref) {
    var align = _ref.align,
        inner = _ref.inner;

    if (align === 'left') {
      return { x: inner.width + inner.x };
    } else if (align === 'right' || align === 'bottom') {
      return inner;
    }
    return { y: inner.y + inner.height };
  }

  function resolveAlign(align, dock) {
    var horizontal = ['top', 'bottom'];
    var vertical = ['left', 'right'];
    if (horizontal.indexOf(align) !== -1 && vertical.indexOf(dock) === -1) {
      return align;
    } else if (vertical.indexOf(align) !== -1 && horizontal.indexOf(dock) === -1) {
      return align;
    }
    return dock; // Invalid align, return current dock as default
  }

  /**
   * @ignore
   * @param {object} context - The component context
   */
  function resolveLocalSettings(_ref2) {
    var state = _ref2.state,
        style = _ref2.style,
        settings = _ref2.settings;

    var defaultStgns = extend(true, {}, state.isDiscrete ? DEFAULT_DISCRETE_SETTINGS : DEFAULT_CONTINUOUS_SETTINGS, style);
    var localStgns = extend(true, {}, defaultStgns, settings.settings);

    var dock = settings.dock || state.defaultDock;
    localStgns.dock = dock;
    localStgns.align = resolveAlign(settings.settings.align, dock);
    localStgns.labels.tiltAngle = Math.max(-90, Math.min(localStgns.labels.tiltAngle, 90));

    return localStgns;
  }

  function updateActiveMode(state, settings, isDiscrete) {
    var mode = settings.labels.mode;

    if (!isDiscrete || !state.isHorizontal) {
      return 'horizontal';
    }

    if (mode === 'auto') {
      return state.labels.activeMode;
    } else if (['layered', 'tilted'].indexOf(settings.labels.mode) !== -1 && ['top', 'bottom'].indexOf(settings.dock) !== -1) {
      return mode;
    }
    return 'horizontal';
  }

  var axisComponent = {
    require: ['chart', 'renderer', 'dockConfig'],
    defaultSettings: {
      displayOrder: 0,
      prioOrder: 0,
      settings: {},
      style: {
        labels: '$label',
        ticks: '$guide-line',
        minorTicks: '$guide-line--minor',
        line: '$guide-line'
      }
    },
    created: function created() {
      // State is a representation of properties that are private to this component defintion and may be modified by only in this context.
      this.state = {
        isDiscrete: !!this.scale.bandwidth,
        isHorizontal: false,
        labels: {
          activeMode: 'horizontal'
        },
        ticks: [],
        innerRect: {
          width: 0, height: 0, x: 0, y: 0
        },
        outerRect: {
          width: 0, height: 0, x: 0, y: 0
        },
        defaultDock: undefined,
        concreteNodeBuilder: undefined,
        settings: undefined
      };

      if (this.state.isDiscrete) {
        this.state.defaultDock = 'bottom';
      } else {
        this.state.defaultDock = 'left';
      }

      this.setState(this.settings);
    },
    setState: function setState() {
      this.state.isDiscrete = !!this.scale.bandwidth;
      this.state.settings = resolveLocalSettings(this);

      this.state.concreteNodeBuilder = nodeBuilder(this.state.isDiscrete);

      this.dockConfig.dock = this.state.settings.dock; // Override the dock setting (TODO should be removed)

      this.state.isHorizontal = this.state.settings.align === 'top' || this.state.settings.align === 'bottom';
      this.state.labels.activeMode = updateActiveMode(this.state, this.state.settings, this.state.isDiscrete);
    },
    preferredSize: function preferredSize(opts) {
      var formatter = this.formatter,
          state = this.state,
          scale = this.scale;


      var distance = this.state.isHorizontal ? opts.inner.width : opts.inner.height;

      this.state.pxScale = scaleWithSize(scale, distance);

      var reqSize = calcRequiredSize({
        isDiscrete: this.state.isDiscrete,
        rect: opts.inner,
        formatter: formatter,
        measureText: this.renderer.measureText,
        scale: this.state.pxScale,
        settings: this.state.settings,
        state: state
      });

      return reqSize;
    },
    beforeUpdate: function beforeUpdate() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var settings = opts.settings;

      this.setState(settings);
    },
    resize: function resize(opts) {
      var inner = opts.inner,
          outer = opts.outer;


      var extendedInner = extend({}, inner, alignTransform({
        align: this.state.settings.align,
        inner: inner
      }));

      var finalOuter = outer || extendedInner;
      extend(this.state.innerRect, extendedInner);
      extend(this.state.outerRect, finalOuter);

      return outer;
    },
    beforeRender: function beforeRender() {
      var scale = this.scale,
          formatter = this.formatter;


      var distance = this.state.isHorizontal ? this.state.innerRect.width : this.state.innerRect.height;

      this.state.pxScale = scaleWithSize(scale, distance);
      this.state.ticks = this.state.pxScale.ticks({
        distance: distance,
        formatter: formatter
      });
    },
    render: function render() {
      var state = this.state;


      var nodes = [];
      nodes.push.apply(nodes, toConsumableArray(this.state.concreteNodeBuilder.build({
        settings: this.state.settings,
        scale: this.state.pxScale,
        innerRect: this.state.innerRect,
        outerRect: this.state.outerRect,
        measureText: this.renderer.measureText,
        textBounds: this.renderer.textBounds,
        ticks: this.state.ticks,
        state: state
      })));

      crispifier.multiple(nodes);

      return nodes;
    }
  };

  /**
   * @typedef {object} component--axis
   */

  /**
   * @type {string}
   * @memberof component--axis
   */

  var type$1 = 'axis';

  function axis(picasso) {
    picasso.component(type$1, axisComponent);
  }

  function parseTitle(text, join, scale) {
    var title = '';
    if (typeof text === 'function') {
      title = text();
    } else if (typeof text === 'string') {
      title = text;
    } else if (scale) {
      var data = scale.data();
      var titles = (data.fields || []).map(function (field) {
        return field.title();
      });
      title = titles.join(join);
    }

    return title;
  }

  function getTextAnchor(dock, anchor) {
    var val = 'middle';
    if (dock === 'left') {
      if (anchor === 'top') {
        val = 'end';
      } else if (anchor === 'bottom') {
        val = 'start';
      }
    } else if (dock === 'right') {
      if (anchor === 'top') {
        val = 'start';
      } else if (anchor === 'bottom') {
        val = 'end';
      }
    } else if (anchor === 'left') {
      val = 'start';
    } else if (anchor === 'right') {
      val = 'end';
    }
    return val;
  }

  function generateTitle(_ref) {
    var title = _ref.title,
        definitionSettings = _ref.definitionSettings,
        dock = _ref.dock,
        rect = _ref.rect,
        measureText = _ref.measureText,
        style = _ref.style;

    var struct = {
      type: 'text',
      text: title,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      anchor: getTextAnchor(dock, definitionSettings.anchor),
      baseline: 'alphabetical'
    };

    extend(struct, style.text);
    var textRect = measureText(struct);

    if (dock === 'top' || dock === 'bottom') {
      var x = rect.width / 2;
      if (definitionSettings.anchor === 'left') {
        x = definitionSettings.paddingLeft || 0;
      } else if (definitionSettings.anchor === 'right') {
        x = rect.width - (definitionSettings.paddingRight || 0);
      }

      struct.x = x;
      struct.y = dock === 'top' ? rect.height - definitionSettings.paddingStart : definitionSettings.paddingStart + textRect.height;
      struct.dy = dock === 'top' ? -(textRect.height / 6) : -(textRect.height / 3);
      struct.maxWidth = rect.width * 0.8;
    } else {
      var y = rect.height / 2;
      if (definitionSettings.anchor === 'top') {
        y = definitionSettings.paddingStart;
      } else if (definitionSettings.anchor === 'bottom') {
        y = rect.height - definitionSettings.paddingStart;
      }

      struct.y = y;
      struct.x = dock === 'left' ? rect.width - definitionSettings.paddingStart : definitionSettings.paddingStart;
      struct.dx = dock === 'left' ? -(textRect.height / 3) : textRect.height / 3;
      var rotation = dock === 'left' ? 270 : 90;
      struct.transform = 'rotate(' + rotation + ', ' + (struct.x + struct.dx) + ', ' + (struct.y + struct.dy) + ')';
      struct.maxWidth = rect.height * 0.8;
    }

    if (!isNaN(definitionSettings.maxLengthPx)) {
      struct.maxWidth = Math.min(struct.maxWidth, definitionSettings.maxLengthPx);
    }

    return struct;
  }

  /**
   * @typedef {object} component--text
   * @property {string} [type='text']
   * @property {string|function} text
   * @property {component--text-settings} settings - Text settings
   * @example
   * {
   *  type: 'text',
   *  text: 'my title',
   *  dock: 'left',
   *  settings: {
   *    anchor: 'left',
   *    style: {
   *      fill: 'red'
   *    }
   *  }
   * }
   */

  /**
   * @typedef {object} component--text-settings
   * @property {number} [paddingStart=5]
   * @property {number} [paddingEnd=5]
   * @property {number} [paddingLeft=0]
   * @property {number} [paddingRight=0]
   * @property {string} [anchor='center'] - Where to v- or h-align the text. Supports `left`, `right`, `top`, `bottom` and `center`
   * @property {string} [join=', '] - String to add when joining titles from multiple sources
   * @property {number} [maxLengthPx] - Limit the text length to this value in pixels
   */
  var textComponent = {
    require: ['renderer', 'chart'],
    defaultSettings: {
      dock: 'bottom',
      displayOrder: 0,
      prioOrder: 0,
      settings: {
        paddingStart: 5,
        paddingEnd: 5,
        paddingLeft: 0,
        paddingRight: 0,
        anchor: 'center',
        join: ', ',
        maxLengthPx: NaN
      },
      style: {
        text: '$title'
      }
    },

    created: function created() {
      this.rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

      this.definitionSettings = this.settings.settings;

      var text = this.settings.text;
      var join = this.definitionSettings.join;
      this.title = parseTitle(text, join, this.scale);
    },
    preferredSize: function preferredSize() {
      var height = this.renderer.measureText({
        text: this.title,
        fontSize: this.style.text.fontSize,
        fontFamily: this.style.text.fontFamily
      }).height;
      return height + this.definitionSettings.paddingStart + this.definitionSettings.paddingEnd;
    },
    beforeRender: function beforeRender(opts) {
      extend(this.rect, opts.size);
    },
    render: function render() {
      var title = this.title,
          definitionSettings = this.definitionSettings,
          rect = this.rect;

      var nodes = [];
      nodes.push(generateTitle({
        title: title,
        dock: this.settings.dock,
        definitionSettings: definitionSettings,
        rect: rect,
        measureText: this.renderer.measureText,
        style: this.style
      }));
      return nodes;
    },
    beforeUpdate: function beforeUpdate(opts) {
      if (opts.settings) {
        extend(this.settings, opts.settings);
        this.definitionSettings = opts.settings.settings;
      }
      var text = this.settings.text;
      var join = this.definitionSettings.join;
      this.title = parseTitle(text, join, this.scale);
    }
  };

  function text(picasso) {
    picasso.component('text', textComponent);
  }

  /**
   * @typedef {object} component--scrollbar
   * @private
   */

  /**
   * @typedef {object} component--scrollbar.settings
   * @property {boolean} [backgroundColor = '#eee']
   * @property {boolean} [thumbColor = '#ccc']
   * @property {boolean} [width = 16]
   */

  function start(_scrollbar, pos) {
    var dock = _scrollbar.settings.dock;
    var invert = _scrollbar.settings.settings.invert;
    var horizontal = dock === 'top' || dock === 'bottom';
    var lengthAttr = horizontal ? 'width' : 'height';
    var length = _scrollbar.rect[lengthAttr];
    var scroll = _scrollbar.chart.scroll(_scrollbar.settings.scroll);
    var currentMove = void 0;

    {
      // local scope to allow reuse of variable names later
      var offset = pos[horizontal ? 'x' : 'y'];
      if (invert) {
        offset = length - offset;
      }
      var scrollState = scroll.getState();

      currentMove = {
        startOffset: offset,
        startScroll: scrollState.start,
        swipe: false
      };

      // Detect swipe start outsize the thumb & change startScroll to jump the scroll there.
      var scrollPoint = offset / length * (scrollState.max - scrollState.min) + scrollState.min;
      if (scrollPoint < scrollState.start) {
        currentMove.startScroll = scrollPoint;
      } else if (scrollPoint > scrollState.start + scrollState.viewSize) {
        currentMove.startScroll = scrollPoint - scrollState.viewSize;
      }
    }

    var update = function update(p) {
      var offset = p[horizontal ? 'x' : 'y'];
      if (invert) {
        offset = length - offset;
      }
      if (!currentMove.swipe) {
        if (Math.abs(currentMove.startOffset - offset) <= 1) {
          return;
        }
        currentMove.swipe = true;
      }

      var scrollState = scroll.getState();
      var scrollMove = (offset - currentMove.startOffset) / length * (scrollState.max - scrollState.min);
      var scrollStart = currentMove.startScroll + scrollMove;
      scroll.moveTo(scrollStart);
    };
    var end = function end(p) {
      var offset = p[horizontal ? 'x' : 'y'];
      if (invert) {
        offset = length - offset;
      }
      var scrollState = scroll.getState();
      if (currentMove.swipe) {
        var scrollMove = (offset - currentMove.startOffset) / length * (scrollState.max - scrollState.min);
        var scrollStart = currentMove.startScroll + scrollMove;
        scroll.moveTo(scrollStart);
      } else {
        var scrollCenter = offset / length * (scrollState.max - scrollState.min) + scrollState.min;
        var _scrollStart = scrollCenter - scrollState.viewSize / 2;
        scroll.moveTo(_scrollStart);
      }
    };

    return {
      update: update,
      end: end
    };
  }

  function getLocalPos(event, renderer) {
    var containerRect = renderer.element().getBoundingClientRect();
    return {
      x: event.center.x - containerRect.left,
      y: event.center.y - containerRect.top
    };
  }

  var scrollbarComponent = {
    require: ['chart', 'renderer'],
    on: {
      panStart: function panStart(event) {
        var pos = getLocalPos(event, this.renderer);
        var startPos = {
          x: pos.x - event.deltaX,
          y: pos.y - event.deltaY
        };
        this.currentMove = start(this, startPos);
        this.currentMove.update(pos);
      },
      panMove: function panMove(event) {
        if (!this.currentMove) {
          return;
        }
        var pos = getLocalPos(event, this.renderer);
        this.currentMove.update(pos);
      },
      panEnd: function panEnd(event) {
        if (!this.currentMove) {
          return;
        }
        var pos = getLocalPos(event, this.renderer);
        this.currentMove.end(pos);
        this.currentMove = null;
      },
      panCancel: function panCancel() {
        this.currentMove = null;
      },
      tap: function tap(event) {
        var pos = getLocalPos(event, this.renderer);
        var move = start(this, pos);
        move.end(pos);
      }
    },
    defaultSettings: {
      settings: {
        backgroundColor: '#eee',
        thumbColor: '#ccc',
        width: 16 // 32 for touch
      }
    },
    created: function created() {
      this.rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    },

    preferredSize: function preferredSize(rect) {
      var scrollState = this.chart.scroll(this.settings.scroll).getState();
      // hide the scrollbar if it is not possible to scroll
      if (scrollState.viewSize >= scrollState.max - scrollState.min) {
        var toLargeSize = Math.max(rect.width, rect.height);
        return toLargeSize;
      }
      return this.settings.settings.width;
    },

    resize: function resize(opts) {
      var inner = opts.inner;
      this.rect = inner;
      return inner;
    },

    render: function render(h) {
      var _style;

      var dock = this.settings.dock;
      var invert = this.settings.settings.invert;
      var horizontal = dock === 'top' || dock === 'bottom';
      var lengthAttr = horizontal ? 'width' : 'height';

      var _rect = this.rect;
      var length = _rect[lengthAttr];

      var scrollState = this.chart.scroll(this.settings.scroll).getState();
      var thumbStart = length * (scrollState.start - scrollState.min) / (scrollState.max - scrollState.min);
      var thumbRange = length * scrollState.viewSize / (scrollState.max - scrollState.min);

      if (invert) {
        thumbStart = length - thumbStart - thumbRange;
      }

      return h('div', {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          background: this.settings.settings.backgroundColor,
          pointerEvents: 'auto'
        }
      }, [].concat(h('div', {
        class: {
          scroller: true
        },
        style: (_style = {
          position: 'absolute'
        }, defineProperty(_style, horizontal ? 'left' : 'top', thumbStart + 'px'), defineProperty(_style, horizontal ? 'top' : 'left', '25%'), defineProperty(_style, horizontal ? 'height' : 'width', '50%'), defineProperty(_style, lengthAttr, Math.max(1, thumbRange) + 'px'), defineProperty(_style, 'background', this.settings.settings.thumbColor), _style)
      })));
    },

    renderer: 'dom'
  };

  function scrollbar(picasso) {
    picasso.component('scrollbar', scrollbarComponent);
  }

  var TARGET_SIZE = 5;
  var VERTICAL = 0;
  var HORIZONTAL = 1;

  function buildLine$1(_ref) {
    var h = _ref.h,
        isVertical = _ref.isVertical,
        value = _ref.value,
        pos = _ref.pos,
        align = _ref.align,
        borderHit = _ref.borderHit,
        state = _ref.state;

    var isAlignStart = align !== 'end';
    var alignStart = { left: '0', top: '0' };
    var alignEnd = { right: '0', bottom: '0' };
    var alignStyle = isAlignStart ? alignStart : alignEnd;
    var start = 0;
    var width = '100%';
    var height = '100%';

    if (state.targetRect && state.settings.bubbles.align === 'start') {
      width = state.targetRect.x + state.targetRect.width + 'px';
      height = state.targetRect.y + state.targetRect.height + 'px';
    } else if (state.targetRect && state.settings.bubbles.align === 'end') {
      start = isVertical ? state.targetRect.x : state.targetRect.y;
      width = state.rect.width - start + 'px';
      height = state.rect.height - start + 'px';
    }

    if (!isAlignStart) {
      pos -= borderHit;
    }

    // edge
    return h('div', {
      on: {
        mouseover: function mouseover() {
          this.children[0].elm.style.backgroundColor = '#000';
          this.children[0].elm.style[isVertical ? 'height' : 'width'] = '2px';
        },
        mouseout: function mouseout() {
          this.children[0].elm.style.backgroundColor = state.style.line.stroke;
          this.children[0].elm.style[isVertical ? 'height' : 'width'] = '1px';
        }
      },
      attrs: {
        'data-value': value
      },
      style: {
        cursor: isVertical ? 'ns-resize' : 'ew-resize',
        position: 'absolute',
        left: isVertical ? start + 'px' : pos + 'px',
        top: isVertical ? pos + 'px' : start + 'px',
        height: isVertical ? borderHit + 'px' : height,
        width: isVertical ? width : borderHit + 'px',
        pointerEvents: 'auto'
      }
    }, [
    // line
    h('div', {
      style: extend({
        backgroundColor: state.style.line.stroke,
        position: 'absolute',
        height: isVertical ? 1 + 'px' : '100%',
        width: isVertical ? '100%' : 1 + 'px'
      }, alignStyle)
    })]);
  }

  function buildBubble(_ref2) {
    var _style;

    var h = _ref2.h,
        isVertical = _ref2.isVertical,
        label = _ref2.label,
        otherValue = _ref2.otherValue,
        idx = _ref2.idx,
        pos = _ref2.pos,
        align = _ref2.align,
        state = _ref2.state;

    var isAlignStart = align !== 'end';
    var isOutside = state.settings.bubbles.placement === 'outside';
    var outside = 'none';
    var bubbleDock = void 0;
    if (isVertical) {
      bubbleDock = isAlignStart ? 'left' : 'right';
      if (isOutside) {
        outside = isAlignStart ? 'translate(-100%,  0px)' : 'translate(100%,  0px)';
      }
    } else {
      bubbleDock = isAlignStart ? 'top' : 'bottom';
      if (isOutside) {
        outside = isAlignStart ? 'translate(0px, -100%)' : 'translate(0px,  100%)';
      }
    }

    // bubble wrapper
    return h('div', {
      style: (_style = {
        position: 'absolute'
      }, defineProperty(_style, bubbleDock, '0'), defineProperty(_style, isVertical ? 'top' : 'left', pos + 'px'), defineProperty(_style, 'transform', outside), _style)
    }, [
    // bubble
    h('div', {
      attrs: {
        'data-other-value': otherValue,
        'data-idx': idx
      },
      style: extend({
        position: 'relative',
        borderRadius: state.style.bubble.borderRadius + 'px',
        border: state.style.bubble.strokeWidth + 'px solid ' + state.style.bubble.stroke,
        backgroundColor: state.style.bubble.fill,
        color: state.style.bubble.color,
        fontFamily: state.style.bubble.fontFamily,
        fontSize: state.style.bubble.fontSize,
        padding: '4px 8px',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '150px',
        minWidth: '50px',
        minHeight: '1em',
        pointerEvents: 'auto',
        transform: isVertical ? 'translate(0,-50%)' : 'translate(-50%,0)'
      })
    }, [label])]);
  }

  function buildArea(_ref3) {
    var h = _ref3.h,
        isVertical = _ref3.isVertical,
        top = _ref3.top,
        height = _ref3.height,
        color = _ref3.color,
        on = _ref3.on,
        opacity = _ref3.opacity;

    return h('div', {
      style: {
        backgroundColor: color,
        opacity: opacity,
        position: 'absolute',
        left: isVertical ? 0 : top + 'px',
        top: isVertical ? top + 'px' : 0,
        height: isVertical ? height + 'px' : '100%',
        width: isVertical ? '100%' : height + 'px',
        pointerEvents: 'auto'
      },
      on: on
    }, []);
  }

  function buildRange(_ref4) {
    var borderHit = _ref4.borderHit,
        els = _ref4.els,
        isVertical = _ref4.isVertical,
        state = _ref4.state,
        vStart = _ref4.vStart,
        vEnd = _ref4.vEnd,
        idx = _ref4.idx;

    var targetOffset = 0;
    if (state.targetRect) {
      targetOffset = isVertical ? state.targetRect.y : state.targetRect.x;
    }
    var hasScale = !!state.scale;
    var start = hasScale ? state.scale.norm(vStart) * state.size : vStart;
    var end = hasScale ? state.scale.norm(vEnd) * state.size : vEnd;
    var height = Math.abs(start - end);
    var top = Math.min(start, end) + targetOffset;
    var bottom = top + height;

    if (state.targetRect) {
      var target = state.targetFillRect || state.targetRect;
      var targetSize = isVertical ? target.height : target.width;
      var targetStart = hasScale ? state.scale.norm(vStart) * targetSize : vStart;
      var targetEnd = hasScale ? state.scale.norm(vEnd) * targetSize : vEnd;
      var targetHeight = Math.abs(targetStart - targetEnd);
      var targetTop = Math.min(targetStart, targetEnd);
      var targetArea = {
        h: state.h,
        isVertical: isVertical,
        top: targetTop,
        height: targetHeight,
        color: state.style.target.fill,
        opacity: state.style.target.opacity
      };
      if (state.style.target.opacity < 0.8) {
        targetArea.on = {
          mouseover: function mouseover() {
            this.elm.style.opacity = state.style.target.opacity + 0.1;
          },
          mouseout: function mouseout() {
            this.elm.style.opacity = state.style.target.opacity;
          }
        };
      }
      els.push(state.h('div', {
        style: {
          position: 'absolute',
          left: target.x + 'px',
          top: target.y + 'px',
          height: target.height + 'px',
          width: target.width + 'px'
        }
      }, [buildArea(targetArea)]));
    }

    // active range area
    // els.push(buildArea({
    //   h: state.h,
    //   isVertical,
    //   top,
    //   height,
    //   color: state.settings.fill
    // }));

    els.push(buildLine$1({
      h: state.h,
      isVertical: isVertical,
      borderHit: borderHit,
      value: start < end ? vStart : vEnd,
      pos: top,
      align: 'start',
      state: state
    }));

    els.push(buildLine$1({
      h: state.h,
      isVertical: isVertical,
      borderHit: borderHit,
      value: start < end ? vEnd : vStart,
      pos: bottom,
      align: 'end',
      state: state
    }));

    var bubbles = state.settings.bubbles;
    if (bubbles && bubbles.show) {
      var fontSize = bubbles.fontSize;
      var fontFamily = bubbles.fontFamily;
      var fill = bubbles.fill;
      var style = {
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: fill
      };

      var range = [vStart, vEnd];
      els.push(buildBubble({
        h: state.h,
        isVertical: isVertical,
        align: bubbles.align,
        style: style,
        idx: idx,
        otherValue: start < end ? vEnd : vStart,
        label: '' + state.format(start < end ? vStart : vEnd, range),
        pos: top,
        state: state
      }));

      els.push(buildBubble({
        h: state.h,
        isVertical: isVertical,
        align: bubbles.align,
        style: style,
        idx: idx,
        otherValue: start < end ? vStart : vEnd,
        label: '' + state.format(start < end ? vEnd : vStart, range),
        pos: bottom,
        state: state
      }));
    }
  }

  function getMoveDelta(state) {
    var posDelta = state.active.limitHigh - state.active.end;
    var negDelta = state.active.limitLow - state.active.start;
    var delta = state.current - state.start;
    if (delta < 0) {
      delta = Math.max(delta, negDelta);
    } else {
      delta = Math.min(delta, posDelta);
    }

    return delta;
  }

  function nodes(state) {
    if (!state.active) {
      return [];
    }
    var vStart = state.start;
    var vEnd = state.current;
    if (state.active.idx !== -1) {
      if (state.active.mode === 'foo') {
        vStart = Math.min(state.active.start, state.active.end);
        vEnd = Math.max(state.active.start, state.active.end);
      } else if (state.active.mode === 'modify') {
        vStart = Math.min(state.start, state.current);
        vEnd = Math.max(state.start, state.current);
      } else {
        var delta = getMoveDelta(state);
        vStart = state.active.start + delta;
        vEnd = state.active.end + delta;
      }
    }

    var els = [];

    var isVertical = state.direction === VERTICAL;

    // add all other ranges
    state.ranges.forEach(function (r, i) {
      if (i !== state.active.idx) {
        buildRange({
          borderHit: TARGET_SIZE,
          els: els,
          isVertical: isVertical,
          state: state,
          vStart: Math.min(r.min, r.max),
          vEnd: Math.max(r.min, r.max),
          idx: i
        });
      }
    });

    // add active range
    buildRange({
      borderHit: TARGET_SIZE,
      els: els,
      isVertical: isVertical,
      state: state,
      vStart: vStart,
      vEnd: vEnd,
      idx: state.active.idx
    });

    return els;
  }

  function rangelimits(state) {
    return {
      min: state.scale.min(),
      max: state.scale.max()
    };
  }

  function areaLimits(state) {
    return {
      min: 0,
      max: state.direction ? state.rect.width : state.rect.height
    };
  }

  function findActive(state, value, limits) {
    var rs = state.ranges;
    var i = void 0;
    var activeIdx = -1;
    for (i = 0; i < rs.length; i++) {
      if (rs[i].min <= value && value <= rs[i].max) {
        activeIdx = i;
        limits.min = i ? rs[i - 1].max : limits.min;
        limits.max = i + 1 < rs.length ? rs[i + 1].min : limits.max;
        break;
      } else if (value < rs[i].min) {
        limits.max = rs[i].min;
        limits.min = i ? rs[i - 1].max : limits.min;
        break;
      }
    }
    if (activeIdx === -1 && rs.length && i >= rs.length) {
      limits.min = rs[rs.length - 1].max;
    }

    var activeRange = void 0;

    if (activeIdx !== -1) {
      activeRange = {
        idx: activeIdx,
        start: rs[activeIdx].min,
        end: rs[activeIdx].max,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'foo'
      };
    }
    state.active = activeRange;
  }

  function startArea(_ref) {
    var state = _ref.state,
        e = _ref.e,
        renderer = _ref.renderer,
        ranges = _ref.ranges,
        targetSize = _ref.targetSize;

    if (state.started) {
      return;
    }
    var x = e.center.x - e.deltaX;
    var y = e.center.y - e.deltaY;
    var target = document.elementFromPoint(x, y);
    if (!renderer.element().contains(target)) {
      target = null;
    }

    var tempState = {
      started: true
    };

    state.offset = renderer.element().getBoundingClientRect();
    state.ranges = ranges(state);
    var relX = x - state.offset.left; // coordinate relative renderer
    var relY = y - state.offset.top;
    var startPoint = e.center[state.cssCoord.coord] - e[state.cssCoord.pos] - state.offset[state.cssCoord.offset];
    var relStart = e.center[state.cssCoord.coord] - state.offset[state.cssCoord.offset];
    var v = relStart;
    var vStart = startPoint;

    tempState.start = startPoint;
    tempState.current = relStart;

    var rs = state.ranges;
    var limits = areaLimits(state);
    var i = void 0;
    var activeIdx = -1;
    if (target && target.hasAttribute('data-idx')) {
      activeIdx = parseInt(target.getAttribute('data-idx'), 10);
      limits.min = activeIdx > 0 ? rs[activeIdx - 1].max : limits.min;
      limits.max = activeIdx + 1 < rs.length ? rs[activeIdx + 1].min : limits.max;
    } else {
      for (i = 0; i < rs.length; i++) {
        if (rs[i].min <= vStart && vStart <= rs[i].max) {
          activeIdx = i;
          limits.min = i ? rs[i - 1].max : limits.min;
          limits.max = i + 1 < rs.length ? rs[i + 1].min : limits.max;
          break;
        } else if (vStart < rs[i].min) {
          limits.max = rs[i].min;
          limits.min = i ? rs[i - 1].max : limits.min;
          break;
        }
      }
      if (activeIdx === -1 && rs.length && i >= rs.length) {
        limits.min = rs[rs.length - 1].max;
      }
    }

    if (activeIdx === -1 && !state.multi) {
      tempState.ranges = [];
      limits.min = 0;
      limits.max = state.direction ? state.rect.width : state.rect.height;
    }
    var activeRange = void 0;

    if (activeIdx !== -1) {
      activeRange = {
        idx: activeIdx,
        start: rs[activeIdx].min,
        end: rs[activeIdx].max,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'move'
      };

      if (target && target.hasAttribute('data-other-value')) {
        tempState.start = parseFloat(target.getAttribute('data-other-value'));
        activeRange.mode = 'modify';
      } else {
        var pxStart = activeRange.start;
        var pxEnd = activeRange.end;
        if (Math.abs(startPoint - pxStart) <= targetSize) {
          tempState.start = activeRange.end;
          activeRange.mode = 'modify';
        } else if (Math.abs(startPoint - pxEnd) <= targetSize) {
          tempState.start = activeRange.start;
          activeRange.mode = 'modify';
        }
      }
    } else {
      activeRange = {
        idx: -1,
        start: vStart,
        end: v,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'current'
      };
    }

    tempState.active = activeRange;

    if (activeRange.mode !== 'modify' && state.targetRect && !NarrowPhaseCollision.testRectPoint(state.targetRect, { x: relX, y: relY })) ; else {
      Object.keys(tempState).forEach(function (key) {
        return state[key] = tempState[key];
      });
    }
  }

  function start$1(_ref2) {
    var state = _ref2.state,
        e = _ref2.e,
        renderer = _ref2.renderer,
        ranges = _ref2.ranges,
        targetSize = _ref2.targetSize;

    if (state.started) {
      return;
    }
    var x = e.center.x - e.deltaX;
    var y = e.center.y - e.deltaY;
    var target = document.elementFromPoint(x, y);
    if (!renderer.element().contains(target)) {
      target = null;
    }

    var tempState = {
      started: true
    };

    state.offset = extend({}, renderer.element().getBoundingClientRect());
    var relX = x - state.offset.left; // coordinate relative renderer
    var relY = y - state.offset.top;
    state.offset.left += state.targetRect ? state.targetRect.x : 0; // make offset relative to targetRect
    state.offset.top += state.targetRect ? state.targetRect.y : 0;
    state.ranges = ranges(state, state.fauxBrushInstance || state.brushInstance);
    var startPoint = e.center[state.cssCoord.coord] - e[state.cssCoord.pos] - state.offset[state.cssCoord.offset];
    var relStart = e.center[state.cssCoord.coord] - state.offset[state.cssCoord.offset];
    tempState.current = state.scale.normInvert(relStart / state.size);
    tempState.start = state.scale.normInvert(startPoint / state.size);

    var rs = state.ranges;
    var limits = rangelimits(state);
    var i = void 0;
    var activeIdx = -1;
    if (target && target.hasAttribute('data-idx')) {
      activeIdx = parseInt(target.getAttribute('data-idx'), 10);
      limits.min = activeIdx > 0 ? rs[activeIdx - 1].max : limits.min;
      limits.max = activeIdx + 1 < rs.length ? rs[activeIdx + 1].min : limits.max;
    } else {
      for (i = 0; i < rs.length; i++) {
        if (rs[i].min <= tempState.start && tempState.start <= rs[i].max) {
          activeIdx = i;
          limits.min = i ? rs[i - 1].max : limits.min;
          limits.max = i + 1 < rs.length ? rs[i + 1].min : limits.max;
          break;
        } else if (tempState.start < rs[i].min) {
          limits.max = rs[i].min;
          limits.min = i ? rs[i - 1].max : limits.min;
          break;
        }
      }
      if (activeIdx === -1 && rs.length && i >= rs.length) {
        limits.min = rs[rs.length - 1].max;
      }
    }

    if (activeIdx === -1 && !state.multi) {
      tempState.ranges = [];
      limits.min = state.scale.min();
      limits.max = state.scale.max();
    }
    var activeRange = void 0;

    if (activeIdx !== -1) {
      activeRange = {
        idx: activeIdx,
        start: rs[activeIdx].min,
        end: rs[activeIdx].max,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'move'
      };

      if (target && target.hasAttribute('data-other-value')) {
        tempState.start = parseFloat(target.getAttribute('data-other-value'));
        activeRange.mode = 'modify';
      } else {
        var pxStart = state.scale.norm(activeRange.start) * state.size;
        var pxEnd = state.scale.norm(activeRange.end) * state.size;
        if (Math.abs(startPoint - pxStart) <= targetSize) {
          tempState.start = activeRange.end;
          activeRange.mode = 'modify';
        } else if (Math.abs(startPoint - pxEnd) <= targetSize) {
          tempState.start = activeRange.start;
          activeRange.mode = 'modify';
        }
      }
    } else {
      activeRange = {
        idx: -1,
        start: tempState.start,
        end: tempState.current,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'current'
      };
    }

    tempState.active = activeRange;

    if (activeRange.mode !== 'modify' && state.targetRect && !NarrowPhaseCollision.testRectPoint(state.targetRect, { x: relX, y: relY })) ; else {
      Object.keys(tempState).forEach(function (key) {
        return state[key] = tempState[key];
      });
    }
  }
  function end(state, ranges) {
    state.started = false;
    state.ranges = ranges(state, state.fauxBrushInstance || state.brushInstance);
    var limits = rangelimits(state);
    findActive(state, state.current, limits);
  }

  function endArea(state, ranges) {
    state.started = false;
    state.ranges = ranges(state);
    var limits = areaLimits(state);
    findActive(state, state.current, limits);
  }

  function move(state, e) {
    var relY = e.center[state.cssCoord.coord] - state.offset[state.cssCoord.offset];
    var rel = relY / state.size;
    var v = state.scale.normInvert(rel);
    state.current = Math.max(Math.min(v, state.active.limitHigh), state.active.limitLow);
  }

  function moveArea(state, e) {
    var rel = e.center[state.cssCoord.coord] - state.offset[state.cssCoord.offset];

    state.current = Math.max(Math.min(rel, state.active.limitHigh), state.active.limitLow);
  }

  function render(state) {
    state.renderer.render(nodes(state));
  }

  function ranges(state, brush$$1) {
    if (!brush$$1 || !brush$$1.isActive()) {
      return [];
    }

    var sourceData = state.scale.data();
    var sourceFields = sourceData ? sourceData.fields || [] : [];
    var sources = sourceFields.map(function (field) {
      return field.id();
    });
    var rangeBrush = brush$$1.brushes().filter(function (f) {
      return f.type === 'range' && sources.indexOf(f.id) !== -1;
    })[0];

    if (!rangeBrush) {
      return [];
    }

    return rangeBrush.brush.ranges();
  }

  function setRanges(state) {
    var rs = state.ranges.map(function (r) {
      return { min: r.min, max: r.max };
    });
    if (state.active.idx !== -1) {
      if (state.active.mode === 'modify') {
        rs[state.active.idx].min = Math.min(state.start, state.current);
        rs[state.active.idx].max = Math.max(state.start, state.current);
      } else {
        var delta = getMoveDelta(state);
        rs[state.active.idx].min += delta;
        rs[state.active.idx].max += delta;
      }
    } else {
      rs.push({
        min: Math.min(state.start, state.current),
        max: Math.max(state.start, state.current)
      });
    }

    var scaleData = state.scale.data();
    if (scaleData && scaleData.fields) {
      scaleData.fields.forEach(function (field) {
        if (state.fauxBrushInstance) {
          var ordRS = ranges(state, state.fauxBrushInstance);
          var oldValues = state.findValues(ordRS);
          var values = state.findValues(rs);

          var addedValues = values.filter(function (v) {
            return oldValues.indexOf(v) === -1;
          });
          var removedValues = oldValues.filter(function (v) {
            return values.indexOf(v) === -1;
          });

          var addItems = addedValues.map(function (v) {
            return { key: field.id(), value: v };
          });
          var removeItems = removedValues.map(function (v) {
            return { key: field.id(), value: v };
          });

          state.brushInstance.addAndRemoveValues(addItems, removeItems);

          state.fauxBrushInstance.setRange(field.id(), rs);
        } else {
          state.brushInstance.setRange(field.id(), rs);
        }
      });
    }
  }

  function findClosest(value, scale) {
    var name = void 0;
    var minDist = Infinity;
    var domain = scale.domain();
    var halfBandwidth = scale.bandwidth() / 2;
    for (var i = 0; i < domain.length; ++i) {
      var d = Math.abs(value - halfBandwidth - scale(domain[i]));
      if (d < minDist) {
        minDist = d;
        name = domain[i];
      }
    }
    return name;
  }

  function findClosestLabel(value, scale) {
    var ticks = scale.ticks();
    var idx = scale.domain().indexOf(findClosest(value, scale));
    return idx !== -1 ? ticks[idx].label : '-';
  }

  function rangesOverlap(r1, r2) {
    return Math.min.apply(Math, toConsumableArray(r1)) <= Math.max.apply(Math, toConsumableArray(r2)) && Math.max.apply(Math, toConsumableArray(r1)) >= Math.min.apply(Math, toConsumableArray(r2));
  }

  function findValues(rangesValues, scale) {
    var domain = scale.domain();
    var scaleRange = scale.range();
    var values = [];
    rangesValues.forEach(function (range) {
      if (!rangesOverlap(scaleRange, [range.min, range.max])) {
        return;
      }
      var startIdx = domain.indexOf(findClosest(range.min, scale));
      var endIdx = domain.indexOf(findClosest(range.max, scale));
      values.push.apply(values, domain.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1)); /* eslint prefer-spread:0 */
    });

    return values;
  }

  function resolveNodeBounds(targetNodes) {
    var points = targetNodes.reduce(function (ary, node) {
      ary.push.apply(ary, toConsumableArray(rectToPoints(node.bounds)));
      return ary;
    }, []);
    return pointsToRect(points);
  }

  function resolveTarget(ctx) {
    var resolved = {
      targetRect: null,
      targetFillRect: null,
      scale: null,
      size: null
    };
    var stngs = ctx.settings.settings;
    var target = stngs.target ? ctx.chart.component(stngs.target.component) : null;
    var targetNodes = stngs.target && stngs.target.selector ? ctx.chart.findShapes(stngs.target.selector) : [];
    var targetFillNodes = stngs.target && stngs.target.fillSelector ? ctx.chart.findShapes(stngs.target.fillSelector) : [];
    if (targetNodes.length > 0) {
      var bounds = resolveNodeBounds(targetNodes);
      resolved.size = bounds[ctx.state.direction === VERTICAL ? 'height' : 'width'];
      resolved.scale = scaleWithSize(ctx.chart.scale(stngs.scale), resolved.size);
      resolved.targetRect = bounds;
      if (targetFillNodes.length > 0) {
        var fillBounds = resolveNodeBounds(targetFillNodes);
        resolved.targetFillRect = fillBounds;
      }
    } else if (target && target.rect) {
      resolved.targetRect = {
        x: target.rect.x - ctx.state.rect.x,
        y: target.rect.y - ctx.state.rect.y,
        width: target.rect.width,
        height: target.rect.height
      };
    }

    return resolved;
  }

  /**
   * @typedef {object} component--brush-range-settings
   * @property {string} brush - Brush context to apply changes to
   * @property {string} scale - Scale to extract data from
   * @property {string} [direction=vertical] - Rendering direction [horizontal|vertical]
   * @property {object} [bubbles]
   * @property {boolean} [bubbles.show=true] - True to show label bubble, false otherwise
   * @property {string} [bubbles.align=start] - Where to anchor bubble [start|end]
   * @property {object} [target]
   * @property {string} [target.component] - Render matching overlay on target component
   * @property {string} [target.selector] - Instead of targeting a component, target one or more shapes
   * @property {string} [target.fillSelector] - Target a subset of the selector as fill area. Only applicable if `selector` property is set
   */

  /**
   * @typedef {object} component--brush-range-style
   * @property {object} [bubble]
   * @property {string} [bubble.fontSize]
   * @property {string} [bubble.fontFamily]
   * @property {string} [bubble.fill]
   * @property {string} [bubble.color]
   * @property {string} [bubble.stroke]
   * @property {number} [bubble.strokeWidth]
   * @property {number} [bubble.borderRadius]
   * @property {object} [line]
   * @property {string} [line.stroke]
   * @property {number} [line.strokeWidth]
   * @property {object} [target]
   * @property {string} [target.fill]
   * @property {number} [target.strokeWidth]
   * @property {number} [target.opacity]
   */

  var brushRangeComponent = {
    require: ['chart', 'settings', 'renderer'],
    defaultSettings: {
      settings: {
        bubbles: {
          show: true,
          align: 'start'
        }
      },
      style: {
        bubble: '$label-overlay',
        line: '$shape-guide--inverted',
        target: '$selection-area-target'
      }
    },
    renderer: 'dom',
    on: {
      rangeStart: function rangeStart(e) {
        this.start(e);
      },
      rangeMove: function rangeMove(e) {
        this.move(e);
      },
      rangeEnd: function rangeEnd(e) {
        this.end(e);
      },
      rangeClear: function rangeClear(e) {
        this.clear(e);
      }
    },
    created: function created() {
      this.state = {};
    },
    beforeRender: function beforeRender(opts) {
      this.state.rect = opts.size;
    },
    render: function render(h) {
      var stngs = this.settings.settings;
      this.state.direction = stngs.direction === 'vertical' ? VERTICAL : HORIZONTAL;
      var offset = this.renderer.element().getBoundingClientRect();
      var size = this.state.rect[this.state.direction === VERTICAL ? 'height' : 'width'];
      var scale = scaleWithSize(this.chart.scale(stngs.scale), size);

      var target = resolveTarget(this);
      scale = target.scale ? target.scale : scale;
      this.state.targetRect = target.targetRect;
      this.state.targetFillRect = target.targetFillRect;
      this.state.size = target.size === null ? size : target.size;

      this.state.settings = stngs;
      this.state.style = this.style;
      this.state.offset = offset;
      this.state.brush = stngs.brush;
      this.state.brushInstance = this.chart.brush(this.state.brush);
      this.state.renderer = this.renderer;
      this.state.multi = !!stngs.multiple;
      this.state.h = h;
      this.state.cssCoord = {
        offset: this.state.direction === VERTICAL ? 'top' : 'left',
        coord: this.state.direction === VERTICAL ? 'y' : 'x',
        pos: this.state.direction === VERTICAL ? 'deltaY' : 'deltaX'
      };

      if (!{}.hasOwnProperty.call(scale, 'norm')) {
        // Non-linear scale if norm method is unavailable
        this.state.scale = scaleLinear$$1();
        this.state.scale.data = scale.data;
        this.state.format = function (v, r) {
          if (!rangesOverlap(scale.range(), r)) {
            return '-';
          }
          return findClosestLabel(v, scale);
        };
        this.state.fauxBrushInstance = brush();
        this.state.findValues = function (valueRanges) {
          return findValues(valueRanges, scale);
        };
      } else {
        this.state.fauxBrushInstance = null;
        this.state.findValues = null;
        this.state.scale = scale;
        var scaleData = this.state.scale.data();
        if (scaleData && scaleData.fields && scaleData.fields[0]) {
          this.state.format = scaleData.fields[0].formatter();
        }
      }
      return [];
    },
    start: function start$$1(e) {
      start$1({
        e: e,
        state: this.state,
        renderer: this.renderer,
        ranges: ranges,
        targetSize: TARGET_SIZE
      });
    },
    end: function end$$1() {
      if (!this.state.started) {
        return;
      }
      end(this.state, ranges);
      render(this.state);
    },
    move: function move$$1(e) {
      if (!this.state.started) {
        return;
      }
      move(this.state, e);
      setRanges(this.state);
      render(this.state);
    },
    clear: function clear() {
      if (this.state.fauxBrushInstance) {
        this.state.fauxBrushInstance.clear();
      }
      this.state.renderer.render([]);
    }
  };

  function render$1(state) {
    state.renderer.render(nodes(state));
  }

  function ranges$1(state) {
    return state.rc.ranges();
  }

  function shapesFromRange(state, brushRange) {
    var shapeAt = {
      x: state.direction ? brushRange.min + state.rect.x : state.rect.x,
      y: state.direction ? state.rect.y : brushRange.min + state.rect.y,
      width: state.direction ? brushRange.max - brushRange.min : state.rect.width + state.rect.x,
      height: state.direction ? state.rect.height + state.rect.y : brushRange.max - brushRange.min
    };
    return state.chart.shapesAt(shapeAt, state.settings.brush);
  }

  function brushFromShape(state, newShapes) {
    state.chart.brushFromShapes(newShapes, state.settings.brush);
  }

  function setRanges$1(state) {
    var rs = state.ranges.map(function (r) {
      return { min: r.min, max: r.max };
    });

    if (state.active.idx !== -1) {
      if (state.active.mode === 'modify') {
        rs[state.active.idx].min = Math.min(state.start, state.current);
        rs[state.active.idx].max = Math.max(state.start, state.current);
      } else {
        var delta = getMoveDelta(state);
        rs[state.active.idx].min = state.active.start + delta;
        rs[state.active.idx].max = state.active.end + delta;
      }
    } else {
      rs.push({
        min: Math.min(state.start, state.current),
        max: Math.max(state.start, state.current)
      });
    }

    state.rc.set(rs);

    var shapes = [];
    rs.forEach(function (range) {
      shapes.push.apply(shapes, toConsumableArray(shapesFromRange(state, range)));
    });

    brushFromShape(state, shapes);
  }

  function getBubbleLabel(state, value, range) {
    var min = Math.min.apply(Math, toConsumableArray(range));
    var max = Math.max.apply(Math, toConsumableArray(range));
    var shapeAt = {
      x: state.direction ? min + state.rect.x : state.rect.x,
      y: state.direction ? state.rect.y : min + state.rect.y,
      width: state.direction ? max - min : state.rect.width + state.rect.x,
      height: state.direction ? state.rect.height + state.rect.y : max - min
    };

    var shapes = state.chart.shapesAt(shapeAt, state.settings.brush);

    if (shapes.length === 0) {
      return '-';
    }

    var labelShape = shapes.reduce(function (s0, s1) {
      // Min value
      var bounds0 = s0.bounds;
      var bounds1 = s1.bounds;

      if (value === min) {
        if (bounds0[state.cssCoord.coord] <= bounds1[state.cssCoord.coord]) {
          return s0;
        }
        return s1;
      }

      // Max value
      if (bounds0[state.cssCoord.coord] + bounds0[state.cssCoord.area] >= bounds1[state.cssCoord.coord] + bounds1[state.cssCoord.area]) {
        return s0;
      }
      return s1;
    });

    var compConfig = state.settings.brush.components.reduce(function (c0, c1) {
      return c0.key === labelShape.key ? c0 : c1;
    });

    if (typeof state.settings.bubbles.label === 'function') {
      return state.settings.bubbles.label(labelShape.data);
    } else if (Array.isArray(compConfig.data) && compConfig.data.length) {
      return labelShape.data[compConfig.data[0]].label;
    }

    return labelShape.data && labelShape.data.label ? labelShape.data.label : '-';
  }

  /**
   * @typedef {object} component--brush-area-dir-settings
   * @property {object} brush
   * @property {array} brush.components
   * @property {object} brush.components[].key - Component key
   * @property {object} brush.components[].contexts[] - Brush context to apply changes to
   * @property {object} [brush.components[].data] - Data reference
   * @property {object} [brush.components[].action] - Type of brush action
   * @property {string} [direction=vertical] - Rendering direction [horizontal|vertical]
   * @property {object} [bubbles]
   * @property {boolean} [bubbles.show=true] - True to show label bubble, false otherwise
   * @property {string} [bubbles.align=start] - Where to anchor bubble [start|end]
   * @property {function} [bubbles.label] - Callback function for the labels
   * @property {object} [target]
   * @property {string} [target.component] - Render matching overlay on target component
   */

  /**
   * @typedef {object} component--brush-area-dir-style
   * @property {object} [bubble]
   * @property {string} [bubble.fontSize]
   * @property {string} [bubble.fontFamily]
   * @property {string} [bubble.fill]
   * @property {string} [bubble.color]
   * @property {string} [bubble.stroke]
   * @property {number} [bubble.strokeWidth]
   * @property {number} [bubble.borderRadius]
   * @property {object} [line]
   * @property {string} [line.stroke]
   * @property {number} [line.strokeWidth]
   * @property {object} [target]
   * @property {string} [target.fill]
   * @property {number} [target.strokeWidth]
   * @property {number} [target.opacity]
   */

  var brushAreaDirectionalComponent = {
    require: ['chart', 'settings', 'renderer'],
    defaultSettings: {
      settings: {
        bubbles: {
          show: true,
          align: 'start'
        }
      },
      style: {
        bubble: '$label-overlay',
        line: '$shape-guide--inverted',
        target: '$selection-area-target'
      }
    },
    renderer: 'dom',
    on: {
      areaStart: function areaStart(e) {
        this.start(e);
      },
      areaMove: function areaMove(e) {
        this.move(e);
      },
      areaEnd: function areaEnd(e) {
        this.end(e);
      },
      areaClear: function areaClear(e) {
        this.clear(e);
      }
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
      this.state = {};
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render(h) {
      this.state.rect = this.rect;

      var stngs = this.settings.settings;
      var direction = stngs.direction === 'vertical' ? VERTICAL : HORIZONTAL;
      var size = this.state.rect[direction === VERTICAL ? 'height' : 'width'];
      var offset = this.renderer.element().getBoundingClientRect();

      var target = stngs.target ? this.chart.component(stngs.target.component) : null;
      if (target && target.rect) {
        this.state.targetRect = {
          x: target.rect.x - this.rect.x,
          y: target.rect.y - this.rect.y,
          width: target.rect.width,
          height: target.rect.height
        };
      } else {
        this.state.targetRect = null;
      }
      this.state.style = this.style;
      this.state.chart = this.chart;
      this.state.direction = direction;
      this.state.settings = stngs;
      this.state.offset = offset;
      this.state.rc = rangeCollection();
      this.state.renderer = this.renderer;
      this.state.multi = !!stngs.multiple;
      this.state.h = h;
      this.state.size = size;
      this.state.cssCoord = {
        offset: this.state.direction === VERTICAL ? 'top' : 'left',
        coord: this.state.direction === VERTICAL ? 'y' : 'x',
        pos: this.state.direction === VERTICAL ? 'deltaY' : 'deltaX',
        area: this.state.direction === VERTICAL ? 'height' : 'width'
      };

      this.state.format = function getFormat(v, r) {
        return getBubbleLabel(this, v, r);
      };

      return [];
    },
    start: function start(e) {
      startArea({
        e: e,
        state: this.state,
        renderer: this.renderer,
        ranges: ranges$1,
        targetSize: TARGET_SIZE
      });
    },
    end: function end$$1() {
      if (!this.state.started) {
        return;
      }
      endArea(this.state, ranges$1);
      render$1(this.state);
    },
    move: function move$$1(e) {
      if (!this.state.started) {
        return;
      }
      moveArea(this.state, e);
      setRanges$1(this.state);
      render$1(this.state);
    },
    clear: function clear() {
      if (this.state.rc) {
        this.state.rc.clear();
      }
      this.state.renderer.render([]);
    }
  };

  function rangeBrush(picasso) {
    picasso.component('brush-range', brushRangeComponent);
    picasso.component('brush-area-dir', brushAreaDirectionalComponent);
  }

  var FILL = '#ccc';
  var OPACITY = 1;

  function ranges$2(state) {
    var brush = state.brush;
    if (!brush || !brush.isActive()) {
      return [];
    }

    var sourceData = state.scale.data();
    var sourceFields = sourceData ? sourceData.fields || [] : [];
    var sources = sourceFields.map(function (field) {
      return field.id();
    });
    var rangeBrush = brush.brushes().filter(function (f) {
      return f.type === 'range' && sources.indexOf(f.id) !== -1;
    })[0];

    if (!rangeBrush) {
      return [];
    }

    return rangeBrush.brush.ranges();
  }

  function shapes(state) {
    var isVertical = state.direction === 'vertical';
    var size = state.rect[isVertical ? 'height' : 'width'];
    var otherSize = state.rect[isVertical ? 'width' : 'height'];
    return ranges$2(state).map(function (range) {
      var start = state.scale(range.min) * size;
      var end = state.scale(range.max) * size;
      var low = Math.min(start, end);
      var s = Math.abs(start - end);
      return {
        type: 'rect',
        fill: state.fill,
        opacity: state.opacity,
        x: isVertical ? 0 : low,
        width: isVertical ? otherSize : s,
        y: isVertical ? low : 0,
        height: isVertical ? s : otherSize
      };
    });
  }

  function onStart(state) {
    state.renderer.render(shapes(state));
  }

  function onUpdate(state) {
    state.renderer.render(shapes(state));
  }

  function onEnd(state) {
    state.renderer.render(shapes(state));
  }

  function setup(state, brush, scale, renderer) {
    state.brush = brush;

    if (!brush) {
      return;
    }

    function start() {
      onStart(state);
    }

    function update() {
      onUpdate(state);
    }

    function end() {
      onEnd(state);
    }

    brush.on('start', start);
    brush.on('update', update);
    brush.on('end', end);

    state.start = start;
    state.update = update;
    state.end = end;
    state.brush = brush;
    state.scale = scale;
    state.renderer = renderer;
  }

  function teardown(state) {
    if (state.brush) {
      state.brush.removeListener('start', state.start);
      state.brush.removeListener('update', state.update);
      state.brush.removeListener('end', state.end);
    }

    state.start = undefined;
    state.update = undefined;
    state.end = undefined;
    state.brush = undefined;
    state.scale = undefined;
    state.renderer = undefined;
  }

  /**
   * @typedef {object} component--range
   */

  /**
   * @typedef {object} component--range.settings
   * @property {string} brush - Name of brush instance
   * @property {string} scale - Name of a scale
   * @property {string} [direction='horizontal'] - Direction of the brush
   * @property {string} [fill='#ccc'] - Fill color
   * @property {number} [opacity=1] - Layer opacity
   */

  var rangeComponent = {
    require: ['chart', 'settings', 'renderer'],
    defaultSettings: {
      settings: {}
    },
    preferredSize: function preferredSize() {
      return 50;
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
      this.state = {};
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render() {
      var stngs = this.settings.settings;
      var brush = this.chart.brush(stngs.brush);
      var direction = stngs.direction || 'horizontal';
      var distance = direction === 'horizontal' ? this.rect.width : this.rect.height;
      var scale = scaleWithSize(this.chart.scale(stngs.scale), distance);

      teardown(this.state);
      setup(this.state, brush, scale, this.renderer);

      this.state.rect = this.rect;
      this.state.fill = stngs.fill || FILL;
      this.state.opacity = typeof stngs.opacity !== 'undefined' ? stngs.opacity : OPACITY;
      this.state.direction = direction;

      return shapes(this.state);
    },
    beforeDestroy: function beforeDestroy() {
      teardown(this.state);
    }
  };

  function rangeBrush$1(picasso) {
    picasso.component('range', rangeComponent);
  }

  function getPoint(rendererBounds, event) {
    var eventOffsetX = event.center.x;
    var eventOffsetY = event.center.y;
    return {
      x: eventOffsetX - rendererBounds.left,
      y: eventOffsetY - rendererBounds.top
    };
    // return {
    //   x: Math.min(Math.max(eventOffsetX - rendererBounds.left, 0), rendererBounds.width),
    //   y: Math.min(Math.max(eventOffsetY - rendererBounds.top, 0), rendererBounds.height)
    // };
  }

  function withinThreshold(p, state, settings) {
    var startPoint = state.points[0];
    var sqrDist = sqrDistance(p, startPoint);
    return sqrDist < Math.pow(settings.settings.snapIndicator.threshold, 2);
  }

  function appendToPath(state, p) {
    if (state.path.d == null) {
      state.path.d = 'M' + p.x + ' ' + p.y + ' ';
    } else {
      state.path.d += 'L' + p.x + ' ' + p.y + ' ';
    }
    state.points.push(p);
  }

  function render$2(state, renderer) {
    var nodes = [state.startPoint, state.path, state.snapIndicator].filter(function (node) {
      return node.visible;
    });

    renderer.render(nodes);
  }

  function setSnapIndictor(_ref) {
    var state = _ref.state,
        _ref$start = _ref.start,
        start = _ref$start === undefined ? null : _ref$start,
        _ref$end = _ref.end,
        end = _ref$end === undefined ? null : _ref$end;

    if (start !== null) {
      state.snapIndicator.x1 = start.x;
      state.snapIndicator.y1 = start.y;
    }
    if (end !== null) {
      state.snapIndicator.x2 = end.x;
      state.snapIndicator.y2 = end.y;
    }
  }

  function showSnapIndicator(state, show) {
    state.snapIndicator.visible = show;
  }

  function setStartPoint(state, p) {
    state.startPoint.cx = p.x;
    state.startPoint.cy = p.y;
  }

  function getComponentDelta(chart, rendererBounds) {
    var chartBounds = chart.element.getBoundingClientRect();
    return {
      x: rendererBounds.left - chartBounds.left,
      y: rendererBounds.top - chartBounds.top
    };
  }

  function doLineBrush(state, chart) {
    if (state.active) {
      var p1 = state.points[state.points.length - 2];
      var p2 = state.points[state.points.length - 1];
      state.lineBrushShape.x1 = p1.x + state.componentDelta.x;
      state.lineBrushShape.y1 = p1.y + state.componentDelta.y;
      state.lineBrushShape.x2 = p2.x + state.componentDelta.x;
      state.lineBrushShape.y2 = p2.y + state.componentDelta.y;

      var shapes = chart.shapesAt(state.lineBrushShape, { components: state.brushConfig });
      chart.brushFromShapes(shapes, { components: state.brushConfig });
    }
  }

  function doPolygonBrush(state, chart) {
    if (state.active) {
      var dx = state.componentDelta.x;
      var dy = state.componentDelta.y;
      var vertices = state.points.map(function (p) {
        return {
          x: p.x + dx,
          y: p.y + dy
        };
      });

      var shapes = chart.shapesAt({ vertices: vertices }, { components: state.brushConfig });
      chart.brushFromShapes(shapes, { components: state.brushConfig });
    }
  }

  function initPath(stgns) {
    return {
      visible: true,
      type: 'path',
      d: null,
      fill: stgns.fill,
      stroke: stgns.stroke,
      strokeWidth: stgns.strokeWidth,
      opacity: stgns.opacity,
      strokeDasharray: stgns.strokeDasharray,
      collider: {
        type: null
      }
    };
  }

  function initSnapIndicator(stgns) {
    return {
      visible: false,
      type: 'line',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      strokeDasharray: stgns.strokeDasharray,
      stroke: stgns.stroke,
      strokeWidth: stgns.strokeWidth,
      opacity: stgns.opacity,
      collider: {
        type: null
      }
    };
  }

  function initStartPoint(stgns) {
    return {
      visible: true,
      type: 'circle',
      cx: 0,
      cy: 0,
      r: stgns.r,
      fill: stgns.fill,
      opacity: stgns.opacity,
      stroke: stgns.stroke,
      strokeWidth: stgns.strokeWidth,
      collider: {
        type: null
      }
    };
  }

  function getBrushConfig(settings) {
    return settings.settings.brush.components.map(function (b) {
      return {
        key: b.key,
        contexts: b.contexts || ['lassoBrush'],
        data: b.data || [''],
        action: b.action || 'add'
      };
    });
  }

  function endBrush(state, chart) {
    state.brushConfig.forEach(function (config) {
      config.contexts.forEach(function (context) {
        chart.brush(context).end();
      });
    });
  }

  function resetState() {
    return {
      points: [],
      active: false,
      path: null,
      snapIndicator: null,
      startPoint: null,
      rendererBounds: null,
      componentDelta: null,
      brushConfig: null,
      lineBrushShape: {
        x1: 0, y1: 0, x2: 0, y2: 0 // Keep a single shape instance to avoid instantiating a new object on each lookup
      } };
  }

  /**
   * @typedef {object} component--brush-lasso
   */

  /**
   * @typedef {object} component--brush-lasso-settings
   * @property {object} [lasso] - Lasso style settings
   * @property {string} [lasso.fill='transparent']
   * @property {string} [lasso.stroke='black']
   * @property {number} [lasso.strokeWidth=2]
   * @property {number} [lasso.opacity=0.7]
   * @property {number} [lasso.strokeDasharray]
   * @property {object} [snapIndicator] - Snap indicator settings
   * @property {number} [snapIndicator.threshold=75] - The distance in pixel to show the snap indicator, if less then threshold the indicator is dispalyed
   * @property {string} [snapIndicator.strokeDasharray='5, 5']
   * @property {string} [snapIndicator.stroke='black']
   * @property {number} [snapIndicator.strokeWidth=2]
   * @property {number} [snapIndicator.opacity=0.5]
   * @property {object} [startPoint] - Start point style settings
   * @property {number} [startPoint.r=10] - Circle radius
   * @property {string} [startPoint.stroke='green']
   * @property {number} [startPoint.strokeWidth=1]
   * @property {number} [startPoint.opacity=1]
   * @property {object} [brush]
   * @property {object[]} brush.components - Array of components to brush on.
   * @property {string} [brush.components[].component.key] - Component key
   * @property {string[]} [brush.components[].component.contexts=['brushLasso']] - Name of the brushing contexts to affect
   * @property {string[]} [brush.components[].component.data=['']] - The mapped data properties to add to the brush
   * @property {string} [brush.components[].component.action='add'] - Type of action to respond with
   */

  var brushLassoComponent = {
    require: ['chart', 'renderer', 'settings'],
    defaultSettings: {
      displayOrder: 0,
      settings: {
        brush: {
          components: []
        },
        snapIndicator: {
          threshold: 75,
          strokeDasharray: '5, 5',
          stroke: 'black',
          strokeWidth: 2,
          opacity: 0.5
        },
        lasso: {
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 2,
          opacity: 0.7,
          strokeDasharray: '20, 10'
        },
        startPoint: {
          r: 10,
          fill: 'green',
          stroke: 'black',
          strokeWidth: 1,
          opacity: 1
        }
      }
    },
    on: {
      lassoStart: function lassoStart(e) {
        this.start(e);
      },
      lassoEnd: function lassoEnd(e) {
        this.end(e);
      },
      lassoMove: function lassoMove(e) {
        this.move(e);
      },
      lassoCancel: function lassoCancel() {
        this.cancel();
      }
    },
    created: function created() {
      this.state = resetState();
    },
    start: function start(e) {
      this.state.active = true;
      this.state.path = initPath(this.settings.settings.lasso);
      this.state.snapIndicator = initSnapIndicator(this.settings.settings.snapIndicator);
      this.state.startPoint = initStartPoint(this.settings.settings.startPoint);
      this.state.rendererBounds = this.renderer.element().getBoundingClientRect();
      this.state.componentDelta = getComponentDelta(this.chart, this.state.rendererBounds);
      this.state.brushConfig = getBrushConfig(this.settings);

      var p = getPoint(this.state.rendererBounds, e);

      appendToPath(this.state, p);
      setSnapIndictor({ state: this.state, start: p });
      setStartPoint(this.state, p);
    },
    move: function move(e) {
      if (!this.state.active) {
        return;
      }

      var p = getPoint(this.state.rendererBounds, e);

      if (withinThreshold(p, this.state, this.settings)) {
        showSnapIndicator(this.state, true);
      } else {
        showSnapIndicator(this.state, false);
      }

      appendToPath(this.state, p);
      setSnapIndictor({ state: this.state, end: p });
      render$2(this.state, this.renderer);

      doLineBrush(this.state, this.chart);
    },
    end: function end(e) {
      if (!this.state.active) {
        return;
      }

      showSnapIndicator(this.state, false);
      var p = getPoint(this.state.rendererBounds, e);
      var shouldSnap = withinThreshold(p, this.state, this.settings);

      if (shouldSnap) {
        doPolygonBrush(this.state, this.chart);
      }

      this.state = resetState();
      this.renderer.render([]);
    },
    cancel: function cancel() {
      if (!this.state.active) {
        return;
      }
      endBrush(this.state, this.chart);
      this.state = resetState();
      this.renderer.render([]);
    },
    render: function render() {
      // Do nothing
    }
  };

  function lassoBrush(picasso) {
    picasso.component('brush-lasso', brushLassoComponent);
  }

  var LINE_HEIGHT = 1.5;
  var PADDING = 4;
  // const DOUBLE_PADDING = PADDING * 2;

  function cbContext(node, chart) {
    return {
      node: node,
      data: node.data,
      scale: chart.scale,
      formatter: chart.formatter,
      dataset: chart.dataset
    };
  }

  function placeTextInRect(rect, text, opts) {
    var label = {
      type: 'text',
      text: text,
      maxWidth: opts.rotate ? rect.height : rect.width,
      x: 0,
      y: rect.y,
      dx: 0,
      dy: 0,
      fill: opts.fill,
      anchor: opts.rotate ? 'end' : 'start',
      baseline: 'alphabetical',
      fontSize: opts.fontSize + 'px',
      fontFamily: opts.fontFamily
    };

    var textMetrics = opts.textMetrics;

    if (rect.width < opts.fontSize || rect.height < textMetrics.height) {
      return false;
    }

    if (opts.rotate) {
      var wiggleHor = Math.max(0, rect.width - textMetrics.height / (LINE_HEIGHT * 0.8));
      var wiggleVert = Math.max(0, rect.height - textMetrics.width);
      label.x = rect.x + textMetrics.height / LINE_HEIGHT + opts.align * wiggleHor;
      label.y = rect.y + opts.justify * wiggleVert;
      label.transform = 'rotate(-90, ' + (label.x + label.dx) + ', ' + (label.y + label.dy) + ')';
    } else {
      var wiggleWidth = Math.max(0, rect.width - textMetrics.width);
      var wiggleHeight = Math.max(0, rect.height - textMetrics.height / (LINE_HEIGHT * 0.8)); // 0.8 - MAGIC NUMBER - need to figure out why this works the best
      label.x = rect.x + opts.align * wiggleWidth;
      label.y = rect.y + textMetrics.height / LINE_HEIGHT + opts.justify * wiggleHeight;
    }

    return label;
  }

  function limitBounds(bounds, view) {
    var minY = Math.max(0, Math.min(bounds.y, view.height));
    var maxY = Math.max(0, Math.min(bounds.y + bounds.height, view.height));
    var minX = Math.max(0, Math.min(bounds.x, view.width));
    var maxX = Math.max(0, Math.min(bounds.x + bounds.width, view.width));
    bounds.x = minX;
    bounds.width = maxX - minX;
    bounds.y = minY;
    bounds.height = maxY - minY;
  }

  function pad$1(bounds, padding) {
    bounds.x += padding;
    bounds.width -= padding * 2;
    bounds.y += padding;
    bounds.height -= padding * 2;
  }

  function getBarRect(_ref) {
    var bar = _ref.bar,
        view = _ref.view,
        direction = _ref.direction,
        position = _ref.position,
        _ref$padding = _ref.padding,
        padding = _ref$padding === undefined ? PADDING : _ref$padding;

    var bounds = {};
    extend(bounds, bar);

    if (!position || position === 'inside') ; else if (direction === 'up' || direction === 'down') {
      var start = Math.max(0, Math.min(bar.y, view.height));
      var end = Math.max(0, Math.min(bar.y + bar.height, view.height));

      if (position === 'outside' && direction === 'up' || position === 'opposite' && direction === 'down') {
        bounds.y = 0;
        bounds.height = start;
      } else if (position === 'outside' && direction === 'down' || position === 'opposite' && direction === 'up') {
        bounds.y = end;
        bounds.height = view.height - end;
      }
    } else {
      var _start = Math.max(0, Math.min(bar.x, view.width));
      var _end = Math.max(0, Math.min(bar.x + bar.width, view.width));

      if (position === 'outside' && direction === 'left' || position === 'opposite' && direction === 'right') {
        bounds.x = 0;
        bounds.width = _start;
      } else if (position === 'outside' && direction === 'right' || position === 'opposite' && direction === 'left') {
        bounds.x = _end;
        bounds.width = view.width - _end;
      }
    }

    limitBounds(bounds, view);
    pad$1(bounds, padding);

    return bounds;
  }

  function findBestPlacement(_ref2) {
    var direction = _ref2.direction,
        fitsHorizontally = _ref2.fitsHorizontally,
        measured = _ref2.measured,
        node = _ref2.node,
        orientation = _ref2.orientation,
        placementSettings = _ref2.placementSettings,
        rect = _ref2.rect;
    var barRect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBarRect;

    var largest = void 0;
    var bounds = void 0;
    var placement = void 0;
    var testBounds = void 0;
    var p = void 0;
    var boundaries = [];
    for (p = 0; p < placementSettings.length; p++) {
      placement = placementSettings[p];
      testBounds = barRect({
        bar: node.localBounds,
        view: rect,
        direction: direction,
        position: placement.position
      });
      boundaries.push(testBounds);
      largest = !p || testBounds.height > largest.height ? testBounds : largest;

      if (orientation === 'v' && (fitsHorizontally && testBounds.height > measured.height * LINE_HEIGHT || !fitsHorizontally && testBounds.height > measured.width)) {
        bounds = testBounds;
        break;
      } else if (orientation === 'h' && testBounds.height > measured.height && testBounds.width > measured.width) {
        bounds = testBounds;
        break;
      }
    }

    // fallback strategy - place the text in the largest rectangle
    if (!bounds) {
      bounds = largest;
      p = boundaries.indexOf(bounds);
    }
    placement = placementSettings[p];

    return { bounds: bounds, placement: placement };
  }

  function placeInBars(_ref3) {
    var chart = _ref3.chart,
        targetNodes = _ref3.targetNodes,
        rect = _ref3.rect,
        fitsHorizontally = _ref3.fitsHorizontally,
        collectiveOrientation = _ref3.collectiveOrientation;
    var findPlacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : findBestPlacement;
    var placer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : placeTextInRect;

    var labels = [];
    var label = void 0;
    var target = void 0;
    var node = void 0;
    var text = void 0;
    var justify = void 0;
    var bounds = void 0;
    var fill = void 0;
    var measured = void 0;
    var direction = void 0;
    var lblStngs = void 0;
    var placement = void 0;
    var placements = void 0;
    var arg = void 0;
    var orientation = void 0;

    for (var i = 0, len = targetNodes.length; i < len; i++) {
      bounds = null;
      target = targetNodes[i];
      node = target.node;
      arg = cbContext(node, chart);
      direction = target.direction;
      orientation = direction === 'left' || direction === 'right' ? 'h' : 'v';
      for (var j = 0; j < target.texts.length; j++) {
        text = target.texts[j];
        if (!text) {
          continue;
        }

        lblStngs = target.labelSettings[j];
        measured = target.measurements[j];
        placements = lblStngs.placements;

        var bestPlacement = findPlacement({
          direction: direction,
          fitsHorizontally: fitsHorizontally,
          lblStngs: lblStngs,
          measured: measured,
          node: node,
          orientation: orientation,
          placements: placements,
          placementSettings: target.placementSettings[j],
          rect: rect
        });

        bounds = bestPlacement.bounds;
        placement = bestPlacement.placement;

        if (bounds && placement) {
          justify = placement.justify;
          fill = typeof placement.fill === 'function' ? placement.fill(arg, i) : placement.fill;

          if (direction === 'up') {
            justify = 1 - justify;
          }
          if (placement.position === 'opposite') {
            justify = 1 - justify;
          }

          label = placer(bounds, text, {
            fill: fill,
            justify: orientation === 'h' ? placement.align : justify,
            align: orientation === 'h' ? justify : placement.align,
            fontSize: lblStngs.fontSize,
            fontFamily: lblStngs.fontFamily,
            textMetrics: measured,
            rotate: !(collectiveOrientation === 'h' || fitsHorizontally)
          });

          if (label) {
            labels.push(label);
          }
        }
      }
    }

    return labels;
  }

  function precalculate(_ref4) {
    var nodes = _ref4.nodes,
        rect = _ref4.rect,
        chart = _ref4.chart,
        labelSettings = _ref4.labelSettings,
        placementSettings = _ref4.placementSettings,
        settings = _ref4.settings,
        renderer = _ref4.renderer;

    var labelStruct = {};
    var targetNodes = [];
    var target = void 0;
    var fitsHorizontally = true;
    var hasHorizontalDirection = false;
    var node = void 0;
    var text = void 0;
    var bounds = void 0;
    var measured = void 0;
    var lblStng = void 0;
    var direction = void 0;

    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      bounds = node.localBounds;
      if (!NarrowPhaseCollision.testRectRect(bounds, rect)) {
        continue;
      }
      var arg = cbContext(node, chart);

      target = {
        node: node,
        texts: [],
        measurements: [],
        labelSettings: [],
        placementSettings: []
        // direction: 'up'
      };

      for (var j = 0; j < labelSettings.length; j++) {
        lblStng = labelSettings[j];
        text = typeof lblStng.label === 'function' ? lblStng.label(arg, i) : '';
        if (!text) {
          continue; // eslint-ignore-line
        }
        direction = typeof settings.direction === 'function' ? settings.direction(arg, i) : settings.direction || 'up';
        hasHorizontalDirection = hasHorizontalDirection || direction === 'left' || direction === 'right';

        labelStruct.fontFamily = lblStng.fontFamily;
        labelStruct.fontSize = lblStng.fontSize + 'px';
        labelStruct.text = text;

        measured = renderer.measureText(labelStruct);
        target.measurements.push(measured);
        target.texts.push(text);
        target.labelSettings.push(lblStng);
        target.placementSettings.push(placementSettings[j]);
        target.direction = direction;
        fitsHorizontally = fitsHorizontally && measured.width <= bounds.width - PADDING * 2;
      }

      targetNodes.push(target);
    }

    return {
      targetNodes: targetNodes,
      fitsHorizontally: fitsHorizontally,
      hasHorizontalDirection: hasHorizontalDirection
    };
  }

  /**
   * @typedef {object} component--labels~label-strategy
   *
   */

  /**
   * @typedef {object} component--labels~label-strategy.settings
   * @property {string|function} [direction='up'] - The direction in which the bars are growing: 'up', 'down', 'right' or 'left'.
   * @property {string} [fontFamily='Arial']
   * @property {number} [fontSize=12]
   * @property {Array<object>} labels
   * @property {string|function} labels[].label - The text value
   * @property {Array<object>} labels[].placements
   * @property {string} labels[].placements[].position - 'inside' | 'outside' | 'opposite'
   * @property {number} [labels[].placements[].justify=0] - Placement of the label along the direction of the bar
   * @property {number} [labels[].placements[].align=0.5] - Placement of the label along the perpendicular direction of the bar
   * @property {string} [labels[].placements[].fill='#333'] - Color of the label
   */

  function bars(_ref5) {
    var settings = _ref5.settings,
        chart = _ref5.chart,
        nodes = _ref5.nodes,
        rect = _ref5.rect,
        renderer = _ref5.renderer,
        style = _ref5.style;
    var placer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : placeInBars;

    var defaults = extend({
      fontSize: 12,
      fontFamily: 'Arial',
      align: 0.5,
      justify: 0,
      fill: '#333'
    }, style.label);

    defaults.fontSize = parseInt(defaults.fontSize, 10);

    var labelSettings = settings.labels.map(function (labelSetting) {
      return extend({}, defaults, settings, labelSetting);
    });

    var placementSettings = settings.labels.map(function (labelSetting) {
      return labelSetting.placements.map(function (placement) {
        return extend({}, defaults, settings, labelSetting, placement);
      });
    });

    var _precalculate = precalculate({
      nodes: nodes,
      chart: chart,
      renderer: renderer,
      settings: settings,
      rect: rect,
      labelSettings: labelSettings,
      placementSettings: placementSettings
    }),
        fitsHorizontally = _precalculate.fitsHorizontally,
        hasHorizontalDirection = _precalculate.hasHorizontalDirection,
        targetNodes = _precalculate.targetNodes;

    return placer({
      chart: chart,
      targetNodes: targetNodes,
      stngs: settings,
      rect: rect,
      fitsHorizontally: fitsHorizontally,
      collectiveOrientation: hasHorizontalDirection ? 'h' : 'v'
    });
  }

  function pad$2(bounds, padding) {
    bounds.x += padding;
    bounds.width -= padding * 2;
    bounds.y += padding;
    bounds.height -= padding * 2;
  }

  // assume 0 <= angle < (PI / 2)
  function getLineCircleIntersection(radius, offset, angle) {
    var x = offset.x,
        y = offset.y;


    if (x * x + y * y > radius * radius) {
      return null;
    }

    var dx = Math.sin(angle);
    var dy = Math.cos(angle);
    var D = x * dy - y * dx;

    var d = radius * radius - D * D;
    if (d < 0) {
      return null;
    }
    var sqrtD = Math.sqrt(d);
    return {
      x: D * dy + dx * sqrtD,
      y: -(D * dx) + dy * sqrtD
    };
  }

  // assume 0 <= angle < (PI * 2)
  function getRectFromCircleIntersection(_ref) {
    var radius = _ref.radius,
        size = _ref.size,
        angle = _ref.angle;
    var width = size.width,
        height = size.height;

    var lineOffset = { x: width / 2, y: height / 2 };
    var section = Math.floor(angle / (Math.PI / 2));
    var intersection = void 0;
    var offset = void 0;
    switch (section) {
      case 0:
        intersection = getLineCircleIntersection(radius, lineOffset, angle);
        if (!intersection) {
          return null;
        }
        intersection.y *= -1;
        offset = { x: -width, y: 0 };
        break;
      case 1:
        intersection = getLineCircleIntersection(radius, lineOffset, Math.PI - angle);
        if (!intersection) {
          return null;
        }
        offset = { x: -width, y: -height };
        break;
      case 2:
        intersection = getLineCircleIntersection(radius, lineOffset, angle - Math.PI);
        if (!intersection) {
          return null;
        }
        intersection.x *= -1;
        offset = { x: 0, y: -height };
        break;
      case 3:
        intersection = getLineCircleIntersection(radius, lineOffset, 2 * Math.PI - angle);
        if (!intersection) {
          return null;
        }
        intersection.x *= -1;
        intersection.y *= -1;
        offset = { x: 0, y: 0 };
        break;
      default:
        throw new Error('invalid angle');
    }
    var bounds = {
      x: intersection.x + offset.x,
      y: intersection.y + offset.y,
      width: width,
      height: height
    };
    return bounds;
  }

  function getHorizontalInsideSliceRect(_ref2) {
    var slice = _ref2.slice,
        padding = _ref2.padding,
        measured = _ref2.measured;
    var start = slice.start,
        end = slice.end,
        innerRadius = slice.innerRadius,
        outerRadius = slice.outerRadius;

    var middle = (start + end) / 2;

    var size = {
      width: measured.width + padding * 2,
      height: measured.height + padding * 2
    };

    var PI2 = Math.PI * 2;
    middle = (middle % PI2 + PI2) % PI2; // normalize

    var bounds = getRectFromCircleIntersection({
      radius: outerRadius,
      size: size,
      angle: middle
    });

    if (!bounds) {
      return null;
    }

    bounds.baseline = 'top';

    var startLine = {
      x1: 0, y1: 0, x2: Math.sin(start) * outerRadius, y2: -Math.cos(start) * outerRadius
    };
    if (NarrowPhaseCollision.testRectLine(bounds, startLine)) {
      return null;
    }
    var endLine = {
      x1: 0, y1: 0, x2: Math.sin(end) * outerRadius, y2: -Math.cos(end) * outerRadius
    };
    if (NarrowPhaseCollision.testRectLine(bounds, endLine)) {
      return null;
    }
    var circle = { cx: 0, cy: 0, r: innerRadius };
    if (NarrowPhaseCollision.testCircleRect(circle, bounds)) {
      return null;
    }

    pad$2(bounds, padding);

    return bounds;
  }

  // TODO: this case can support a justify setting
  function getRotatedInsideSliceRect(_ref3) {
    var slice = _ref3.slice,
        measured = _ref3.measured,
        padding = _ref3.padding;
    var start = slice.start,
        end = slice.end,
        innerRadius = slice.innerRadius,
        outerRadius = slice.outerRadius;


    var maxWidth = outerRadius - innerRadius - padding * 2;
    var size = end - start;
    if (size < Math.PI) {
      var x = (measured.height / 2 + padding) / Math.tan(size / 2);
      if (x > innerRadius) {
        maxWidth = outerRadius - x - padding * 2;
      }
    }
    if (maxWidth < 0) {
      return null;
    }

    var middle = (start + end) / 2;
    var PI2 = Math.PI * 2;
    middle = (middle % PI2 + PI2) % PI2; // normalize
    var r = outerRadius - padding;
    var bounds = {
      x: Math.sin(middle) * r,
      y: -Math.cos(middle) * r,
      width: maxWidth,
      height: measured.height
    };
    if (middle < Math.PI) {
      bounds.angle = middle - Math.PI / 2;
      bounds.anchor = 'end';
    } else {
      bounds.angle = middle + Math.PI / 2;
      bounds.anchor = 'start';
    }
    return bounds;
  }

  function getRotatedOusideSliceRect(_ref4) {
    var slice = _ref4.slice,
        measured = _ref4.measured,
        padding = _ref4.padding,
        view = _ref4.view;
    var start = slice.start,
        end = slice.end,
        outerRadius = slice.outerRadius,
        offset = slice.offset;

    var r = outerRadius + padding;
    var size = end - start;
    if (size < Math.PI) {
      var minR = (measured.height / 2 + padding) / Math.tan(size / 2);
      if (minR > r) {
        return null;
      }
    }
    var middle = (start + end) / 2;
    var PI2 = Math.PI * 2;
    middle = (middle % PI2 + PI2) % PI2; // normalize
    var x = Math.sin(middle) * r;
    var y = -Math.cos(middle) * r;

    var maxWidth = measured.width;
    var v = middle % Math.PI;
    if (v > Math.PI / 2) {
      v = Math.PI - v;
    }
    if (Math.cos(v) > 0.001) {
      var edge = y < 0 ? view.y : view.y + view.height;
      var d = Math.abs(edge - offset.y);
      var w = d / Math.cos(v) - Math.tan(v) * (measured.height / 2) - padding * 2 - outerRadius;
      if (w < maxWidth) {
        maxWidth = w;
      }
    }
    if (Math.sin(v) > 0.001) {
      var _edge = x < 0 ? view.x : view.x + view.width;
      var _d = Math.abs(_edge - offset.x);
      var _w = _d / Math.sin(v) - measured.height / 2 / Math.tan(v) - padding * 2 - outerRadius;
      if (_w < maxWidth) {
        maxWidth = _w;
      }
    }

    if (maxWidth <= 0) {
      return 0;
    }

    var bounds = {
      x: x,
      y: y,
      width: maxWidth,
      height: measured.height
    };
    if (middle < Math.PI) {
      bounds.angle = middle - Math.PI / 2;
      bounds.anchor = 'start';
    } else {
      bounds.angle = middle + Math.PI / 2;
      bounds.anchor = 'end';
    }
    return bounds;
  }

  function getHorizontalOusideSliceRect(_ref5) {
    var slice = _ref5.slice,
        measured = _ref5.measured,
        padding = _ref5.padding,
        view = _ref5.view;
    var start = slice.start,
        end = slice.end,
        outerRadius = slice.outerRadius,
        offset = slice.offset;

    var r = outerRadius + padding + measured.height / 2;

    var middle = (start + end) / 2;
    var PI2 = Math.PI * 2;
    middle = (middle % PI2 + PI2) % PI2; // normalize
    var maxWidth = measured.width;
    var x = Math.sin(middle) * r;
    var y = -Math.cos(middle) * r;

    if (middle < Math.PI) {
      var w = Math.abs(view.x + view.width - (x + offset.x));
      if (w < maxWidth) {
        maxWidth = w;
      }
    } else {
      var _w2 = Math.abs(view.x - (x + offset.x));
      if (_w2 < maxWidth) {
        maxWidth = _w2;
      }
    }

    var bounds = {
      x: x,
      y: y,
      width: maxWidth,
      height: measured.height
    };
    if (middle < Math.PI) {
      bounds.anchor = 'start';
    } else {
      bounds.anchor = 'end';
    }
    return bounds;
  }

  function cbContext$1(node, chart) {
    return {
      node: node,
      data: node.data,
      scale: chart.scale,
      formatter: chart.formatter,
      dataset: chart.dataset
    };
  }

  function placeTextOnPoint(rect, text, opts) {
    var label = {
      type: 'text',
      text: text,
      maxWidth: rect.width,
      x: rect.x,
      y: rect.y + (rect.baseline === 'top' ? rect.height / 2 : 0),
      fill: opts.fill,
      anchor: rect.anchor || 'start',
      baseline: 'middle',
      fontSize: opts.fontSize + 'px',
      fontFamily: opts.fontFamily
    };

    if (!isNaN(rect.angle)) {
      var angle = rect.angle * (360 / (Math.PI * 2));
      label.transform = 'rotate(' + angle + ', ' + label.x + ', ' + label.y + ')';
    }

    return label;
  }

  function getSliceRect(_ref6) {
    var slice = _ref6.slice,
        direction = _ref6.direction,
        position = _ref6.position,
        padding = _ref6.padding,
        measured = _ref6.measured,
        view = _ref6.view;
    var start = slice.start,
        end = slice.end,
        innerRadius = slice.innerRadius,
        offset = slice.offset;


    var bounds = void 0;
    var s = void 0;
    switch (position) {
      case 'into':
        if (direction === 'rotate') {
          bounds = getRotatedInsideSliceRect({ slice: slice, measured: measured, padding: padding });
        } else {
          bounds = getHorizontalInsideSliceRect({ slice: slice, measured: measured, padding: padding });
        }
        break;
      case 'inside':
        s = {
          start: start,
          end: end,
          innerRadius: 0,
          outerRadius: innerRadius
        };
        if (direction === 'rotate') {
          bounds = getRotatedInsideSliceRect({ slice: s, measured: measured, padding: padding });
        } else {
          bounds = getHorizontalInsideSliceRect({ slice: s, measured: measured, padding: padding });
        }
        break;
      case 'outside':
        if (direction === 'rotate') {
          bounds = getRotatedOusideSliceRect({
            slice: slice, measured: measured, padding: padding, view: view
          });
        } else {
          bounds = getHorizontalOusideSliceRect({
            slice: slice, measured: measured, padding: padding, view: view
          });
        }
        break;
      default:
        throw new Error('not implemented');
    }
    if (bounds) {
      bounds.x += offset.x;
      bounds.y += offset.y;
    }
    return bounds;
  }

  function findBestPlacement$1(_ref7) {
    var direction = _ref7.direction,
        measured = _ref7.measured,
        node = _ref7.node,
        placementSettings = _ref7.placementSettings,
        rect = _ref7.rect;
    var sliceRect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getSliceRect;

    for (var p = 0; p < placementSettings.length; p++) {
      var placement = placementSettings[p];
      var bounds = sliceRect({
        slice: node.desc.slice,
        view: rect,
        direction: direction,
        position: placement.position,
        measured: measured,
        padding: placement.padding
      });

      if (!bounds) {
        continue;
      }

      return { bounds: bounds, placement: placement };
    }
    return { bounds: null, placement: null };
  }

  /**
   * @typedef {object} component--labels~slices-label-strategy
   *
   */

  /**
   * @typedef {object} component--labels~slices-label-strategy.settings
   * @property {string|function} [direction='horizontal'] - The direction of the text: 'horizontal' or 'rotated'.
   * @property {string} [fontFamily='Arial']
   * @property {number} [fontSize=12]
   * @property {Array<object>} labels
   * @property {string|function} labels[].label - The text value
   * @property {Array<object>} labels[].placements
   * @property {string} [labels[].placements[].position='into'] - 'inside' | 'into' | 'outside' (outside is not implmented yet)
   * @property {string} [labels[].placements[].fill='#333'] - Color of the label
   */

  function slices(_ref8) {
    var settings = _ref8.settings,
        chart = _ref8.chart,
        nodes = _ref8.nodes,
        rect = _ref8.rect,
        renderer = _ref8.renderer,
        style = _ref8.style;
    var findPlacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : findBestPlacement$1;
    var placer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : placeTextOnPoint;

    var defaults = extend({
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#333',
      padding: 4,
      position: 'into'
    }, style.label);

    defaults.fontSize = parseInt(defaults.fontSize, 10);

    var labelSettings = settings.labels.map(function (labelSetting) {
      return extend({}, defaults, settings, labelSetting);
    });

    var placementSettings = settings.labels.map(function (labelSetting) {
      return labelSetting.placements.map(function (placement) {
        return extend({}, defaults, settings, labelSetting, placement);
      });
    });

    var labelStruct = {};
    var labels = [];
    var firstOutsideBounds = null;
    var previousOutsideBounds = null;

    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      var arg = cbContext$1(node, chart);

      for (var j = 0; j < labelSettings.length; j++) {
        var lblStngs = labelSettings[j];
        var text = typeof lblStngs.label === 'function' ? lblStngs.label(arg, i) : '';
        if (!text) {
          continue;
        }
        var direction = typeof lblStngs.direction === 'function' ? lblStngs.direction(arg, i) : lblStngs.direction || 'horizontal';

        labelStruct.fontFamily = lblStngs.fontFamily;
        labelStruct.fontSize = lblStngs.fontSize + 'px';
        labelStruct.text = text;

        var measured = renderer.measureText(labelStruct);

        var bestPlacement = findPlacement({
          direction: direction,
          lblStngs: lblStngs,
          measured: measured,
          node: node,
          placementSettings: placementSettings[j],
          rect: rect
        });

        var bounds = bestPlacement.bounds;
        var placement = bestPlacement.placement;

        if (bounds && placement) {
          if (placement.position === 'outside') {
            if (!firstOutsideBounds) {
              firstOutsideBounds = bounds;
            } else if (firstOutsideBounds.anchor === bounds.anchor && NarrowPhaseCollision.testRectRect(firstOutsideBounds, bounds)) {
              continue;
            }
            if (previousOutsideBounds && previousOutsideBounds.anchor === bounds.anchor && NarrowPhaseCollision.testRectRect(previousOutsideBounds, bounds)) {
              continue;
            }
            previousOutsideBounds = bounds;
          }

          var fill = typeof placement.fill === 'function' ? placement.fill(arg, i) : placement.fill;

          var label = placer(bounds, text, {
            fill: fill,
            fontSize: lblStngs.fontSize,
            fontFamily: lblStngs.fontFamily,
            textMetrics: measured
          });

          if (label) {
            labels.push(label);
          }
        }
      }
    }

    return labels;
  }

  var LINE_HEIGHT$1 = 1.2;
  var CIRCLE_FACTOR = 0.9;

  function cbContext$2(node, chart) {
    return {
      node: node,
      data: node.data,
      scale: chart.scale,
      formatter: chart.formatter,
      dataset: chart.dataset
    };
  }

  function placeTextInRect$1(rect, text, opts) {
    var label = {
      type: 'text',
      text: text,
      maxWidth: rect.width,
      x: 0,
      y: rect.y,
      dx: 0,
      dy: 0,
      fill: opts.fill,
      anchor: 'start',
      baseline: 'alphabetical',
      fontSize: opts.fontSize + 'px',
      fontFamily: opts.fontFamily
    };

    var textMetrics = opts.textMetrics;

    if (rect.width < opts.fontSize) {
      return false;
    }

    var wiggleWidth = Math.max(0, rect.width - textMetrics.width);
    label.x = rect.x + opts.align * wiggleWidth;
    label.y = rect.y + textMetrics.height / LINE_HEIGHT$1;

    return label;
  }

  function getRectFromCircle(_ref) {
    var cx = _ref.cx,
        cy = _ref.cy,
        r = _ref.r;

    return {
      type: 'circle',
      bounds: { cx: cx, cy: cy, r: r }
    };
  }
  function getSliceBounds(slice) {
    var EPSILON = 1e-12;
    var start = slice.start,
        end = slice.end,
        innerRadius = slice.innerRadius,
        outerRadius = slice.outerRadius,
        offset = slice.offset;

    if (Math.abs(start + 2 * Math.PI - end) > EPSILON) {
      return { type: null, bounds: null };
    }
    var r = innerRadius !== 0 ? innerRadius : outerRadius;
    return getRectFromCircle({ cx: offset.x, cy: offset.y, r: r });
  }

  function getBounds(node) {
    if (node.desc && node.desc.slice) {
      return getSliceBounds(node.desc.slice);
    }
    if (node.type === 'circle') {
      return getRectFromCircle(node.attrs);
    }
    if (node.type === 'rect') {
      return { type: 'rect', bounds: node.bounds };
    }
    // defualt to node.bounds ?
    return { type: null, bounds: null };
  }

  /**
   * @typedef {object} component--labels~rows-label-strategy
   *
   */

  /**
   * @typedef {object} component--labels~rows-label-strategy.settings
   * @property {string} [fontFamily='Arial']
   * @property {number} [fontSize=12]
   * @property {number} [justify=0.5]
   * @property {number} [padding=4]
   * @property {Array<object>} labels
   * @property {string|function} labels[].label - The text value
   * @property {number} [labels[].align=0.5]
   * @property {string|function} [labels[].fill='#333']
   */

  function rows(_ref2) {
    var settings = _ref2.settings,
        chart = _ref2.chart,
        nodes = _ref2.nodes,
        renderer = _ref2.renderer,
        style = _ref2.style;
    var placer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : placeTextInRect$1;

    var defaults = extend({
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#333',
      padding: 4,
      align: 0.5,
      justify: 0.5
    }, style.label);

    defaults.fontSize = parseInt(defaults.fontSize, 10);

    var rowSettings = extend({}, defaults, settings);

    var labelSettings = settings.labels.map(function (labelSetting) {
      return extend({}, rowSettings, labelSetting);
    });

    var labelStruct = {};
    var labels = [];

    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      var arg = cbContext$2(node, chart);

      var _getBounds = getBounds(node),
          type = _getBounds.type,
          bounds = _getBounds.bounds;

      if (!bounds) {
        continue;
      }

      var totalHeight = 0;
      var measurements = [];
      var texts = [];

      var maxHeight = type === 'circle' ? 2 * bounds.r * CIRCLE_FACTOR : bounds.height;
      totalHeight += rowSettings.padding;
      var j = void 0;
      for (j = 0; j < labelSettings.length; j++) {
        var lblStngs = labelSettings[j];
        var text = typeof lblStngs.label === 'function' ? lblStngs.label(arg, i) : '';
        if (!text) {
          continue;
        }

        labelStruct.fontFamily = lblStngs.fontFamily;
        labelStruct.fontSize = lblStngs.fontSize + 'px';
        labelStruct.text = text;
        var measured = renderer.measureText(labelStruct);
        totalHeight += measured.height + lblStngs.padding;
        if (totalHeight > maxHeight) {
          break;
        }
        texts.push(text);
        measurements.push(measured);
      }

      var labelCount = j;
      var wiggleHeight = Math.max(0, maxHeight - totalHeight);
      var currentY = void 0;
      if (type === 'circle') {
        currentY = bounds.cy - bounds.r * CIRCLE_FACTOR;
      } else {
        currentY = bounds.y;
      }
      currentY += rowSettings.justify * wiggleHeight + rowSettings.padding;

      for (j = 0; j < labelCount; j++) {
        var _lblStngs = labelSettings[j];
        var rect = void 0;
        if (type === 'circle') {
          var maxYDistToCenter = Math.max(Math.abs(currentY - bounds.cy), Math.abs(currentY + measurements[j].height - bounds.cy));
          var halfWidth = Math.sqrt(bounds.r * bounds.r - maxYDistToCenter * maxYDistToCenter);
          rect = {
            x: bounds.cx - halfWidth + rowSettings.padding,
            y: currentY,
            width: 2 * halfWidth - 2 * rowSettings.padding,
            height: measurements[j].height
          };
        } else {
          rect = {
            x: bounds.x + rowSettings.padding,
            y: currentY,
            width: bounds.width - 2 * rowSettings.padding,
            height: measurements[j].height
          };
        }

        currentY += measurements[j].height + rowSettings.padding;
        var fill = typeof _lblStngs.fill === 'function' ? _lblStngs.fill(arg, i) : _lblStngs.fill;
        var label = placer(rect, texts[j], {
          fill: fill,
          align: _lblStngs.align,
          fontSize: _lblStngs.fontSize,
          fontFamily: _lblStngs.fontFamily,
          textMetrics: measurements[j]
        });
        if (label) {
          labels.push(label);
        }
      }
    }

    return labels;
  }

  var strategies = {
    bar: bars,
    slice: slices,
    rows: rows
  };

  /**
   * @typedef {object} component--labels
   * @property {string} [type='labels']
   */

  /**
   * @typedef {object} component--labels.settings
   * @property {Array<object>} sources
   * @property {string} sources[].component
   * @property {string} sources[].selector
   * @property {component--labels~label-strategy} sources[].strategy
   */

  function strategy(_ref, fn) {
    var chart = _ref.chart,
        source = _ref.source,
        rect = _ref.rect,
        renderer = _ref.renderer,
        style = _ref.style;

    var component = chart.component(source.component);
    if (!component) {
      return [];
    }
    var nodes = chart.findShapes(source.selector).filter(function (n) {
      return n.key === source.component;
    });

    return fn({
      chart: chart,
      settings: source.strategy.settings,
      nodes: nodes,
      rect: {
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height
      },
      renderer: renderer,
      style: style
    });
  }

  var labelsComponent = {
    require: ['chart', 'renderer', 'settings'],
    defaultSettings: {
      settings: {},
      style: {
        label: '$label'
      }
    },
    created: function created() {
      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render() {
      var _this = this;

      var stngs = this.settings.settings;
      var labels = [];

      (stngs.sources || []).forEach(function (source) {
        if (source.strategy && strategies[source.strategy.type] && source.component) {
          labels.push.apply(labels, toConsumableArray(strategy({
            chart: _this.chart,
            rect: _this.rect,
            renderer: _this.renderer,
            source: source,
            style: _this.style
          }, strategies[source.strategy.type])));
        }
      });

      return labels;
    }
  };

  function labels(picasso) {
    picasso.component('labels', labelsComponent);
  }

  /**
   * @typedef {object}
   * @alias component--legend-cat.settings
   */
  var DEFAULT_SETTINGS$6 = {
    /**
     * @typedef {object=}
     */
    layout: {
      /**
       * Maximum number of columns (vertical) or rows (horizontal)
       * @type {number=}
       */
      size: 1,
      /**
       * Layout direction. Either `'ltr'` or `'rtl'`
       * @type {string=}
       */
      direction: 'ltr',
      /** Initial scroll offset
       * @type {number=} */
      scrollOffset: 0
    },
    /**
     * Settings applied per item
     * @typedef {object=}
     */
    item: {
      /** Whether to show the current item
       * @type {boolean=} */
      show: true,
      justify: 0.5,
      align: 0.5,
      /**
       * @typedef {object=} */
      label: {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#595959',
        /** Word break rule, how to apply line break if label text overflows its maxWidth property. Either `'break-word'` or `'break-all'`
         * @type {string=} */
        wordBreak: 'none',
        /** Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak)
         * @type {number=} */
        maxLines: 2,
        /** Maximum width of label, in px
         * @type {number=} */
        maxWidth: 136,
        lineHeight: 1.2
      },
      /**
       * @typedef {object=} */
      shape: {
        /**
         * @type {string=} */
        type: 'square',
        /**
         * @type {number=} */
        size: 12
      }
    },
    /**
     * @typedef {object=} */
    title: {
      /** Whether to show the title
       * @type {boolean=} */
      show: true,
      /** Title text. Defaults to the title of the provided data field
       * @type {string=} */
      text: undefined,
      /** Horizontal alignment of the text. Allowed values are `'start'`, `'middle'` and `'end'`
       * @type {string}
       */
      anchor: 'start',
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#595959',
      /** Word break rule, how to apply line break if label text overflows its maxWidth property. Either `'break-word'` or `'break-all'`
       * @type {string=} */
      wordBreak: 'none',
      /** Max number of lines allowed if label is broken into multiple lines, is only appled when `wordBreak` is not set to `'none'`
       * @type {number=} */
      maxLines: 2,
      /** Maximum width of title, in px
       * @type {number=} */
      maxWidth: 156,
      lineHeight: 1.25
    },
    /**
     * @typedef {object=} */
    navigation: {
      /**
       * @typedef {object=} */
      button: {
        /**
         * @type {object<string, boolean>=} */
        class: undefined,
        /**
         * @type {function} */
        content: undefined
      }
    }
  };

  /**
   * Resolve settings based on input, defaults, and data
   *
   * @ignore
   * @param {legendComponent} comp - The component instance
   */
  function resolveSettings$2(comp) {
    var domain = comp.scale.domain();
    var data = { items: [] };
    if (comp.scale.type === 'threshold-color') {
      var fields = comp.scale.data().fields;
      var sourceField = fields[0];
      var formatter = function formatter(v) {
        return String(v);
      };

      if (comp.settings.formatter) {
        formatter = comp.chart.formatter(comp.settings.formatter);
      } else if (sourceField) {
        formatter = sourceField.formatter();
      }

      for (var i = 0; i < domain.length - 1; i++) {
        var it = {
          value: domain[i],
          label: formatter(domain[i]) + ' - < ' + formatter(domain[i + 1])
        };
        if (sourceField) {
          it.source = {
            field: sourceField.id()
          };
        }
        data.items.push(it);
      }

      var orientation = comp.settings.dock === 'top' || comp.settings.dock === 'bottom' ? 'horizontal' : 'vertical';

      if (orientation === 'vertical') {
        data.items.reverse();
      }
    } else {
      var _labels = comp.scale.labels ? comp.scale.labels() : null;
      data.items = domain.map(function (d, idx) {
        var datum = comp.scale.datum ? extend({}, comp.scale.datum(d)) : { value: d };
        if (comp.scale.datum) {
          datum = extend({}, comp.scale.datum(d));
          datum.value = d;
        }

        if (comp.scale.label) {
          datum.label = comp.scale.label(d);
        } else if (_labels) {
          datum.label = _labels[idx];
        }

        return datum;
      });
    }

    var title = comp.resolver.resolve({
      data: {
        fields: comp.scale.data().fields
      },
      defaults: extend(true, {}, DEFAULT_SETTINGS$6.title, comp.style.title),
      settings: comp.settings.settings.title
    });

    var layout = comp.resolver.resolve({
      data: {
        fields: comp.scale.data().fields
      },
      defaults: DEFAULT_SETTINGS$6.layout,
      settings: comp.settings.settings.layout
    });

    var labels = comp.resolver.resolve({
      data: data,
      defaults: extend(true, {}, DEFAULT_SETTINGS$6.item.label, comp.style.item.label),
      settings: (comp.settings.settings.item || {}).label
    });

    var shapeSettings = extend(true, {}, (comp.settings.settings.item || {}).shape);

    if (typeof shapeSettings.fill === 'undefined' && comp.settings.scale) {
      shapeSettings.fill = {
        scale: comp.settings.scale
      };
    }

    var symbols = comp.resolver.resolve({
      data: data,
      defaults: extend(true, {}, DEFAULT_SETTINGS$6.item.shape, comp.style.item.shape),
      settings: shapeSettings
    });

    var items = comp.resolver.resolve({
      data: data,
      defaults: extend(true, {}, {
        show: DEFAULT_SETTINGS$6.item.show
      }),
      settings: {
        show: (comp.settings.settings.item || {}).show
      }
    });

    function range(item, i) {
      var v = item.data.value;
      var next = domain[i + 1];
      item.data.value = [v, next];
    }

    if (comp.scale.type === 'threshold-color') {
      var _orientation = comp.settings.dock === 'top' || comp.settings.dock === 'bottom' ? 'horizontal' : 'vertical';

      if (_orientation === 'vertical') {
        items.items.reverse().forEach(range);
        items.items.reverse();
      } else {
        items.items.forEach(range);
      }
    }

    return {
      title: title,
      labels: labels,
      symbols: symbols,
      items: items,
      layout: layout
    };
  }

  /* eslint no-mixed-operators:0 */

  function placeTextInRect$2(rect, label, opts) {
    var textMetrics = opts.textMetrics;

    if (rect.height < textMetrics.height) {
      return false;
    }

    var wiggleWidth = Math.max(0, rect.width - textMetrics.width);
    label.baseline = 'hanging';
    var wiggleHeight = Math.max(0, rect.height - textMetrics.height);
    label.x = rect.x + opts.align * wiggleWidth;
    label.y = rect.y + opts.justify * wiggleHeight;

    return label;
  }

  function wiggleSymbol(container, size, opts) {
    var wiggleWidth = Math.max(0, container.width - size);
    var wiggleHeight = Math.max(0, container.height - size);

    return {
      x: container.x + size / 2 + opts.align * wiggleWidth,
      y: container.y + size / 2 + opts.justify * wiggleHeight
    };
  }

  function createRenderItem(_ref) {
    var _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        y = _ref.y,
        item = _ref.item,
        globalMetrics = _ref.globalMetrics,
        _ref$symbolFn = _ref.symbolFn,
        symbolFn = _ref$symbolFn === undefined ? create$3 : _ref$symbolFn,
        _ref$direction = _ref.direction,
        direction = _ref$direction === undefined ? 'ltr' : _ref$direction;

    var label = item.label.displayObject;
    var labelBounds = item.label.bounds;
    var symbolItem = item.symbol.meta;
    var rtl = direction === 'rtl';

    var labelRect = {
      x: rtl ? x + globalMetrics.maxLabelBounds.width : x + globalMetrics.maxSymbolSize + globalMetrics.spacing,
      y: y,
      width: globalMetrics.maxLabelBounds.width,
      height: Math.max(globalMetrics.maxSymbolSize, globalMetrics.maxLabelBounds.height)
    };

    var wiggled = wiggleSymbol({
      x: rtl ? x + globalMetrics.maxLabelBounds.width + globalMetrics.spacing : x,
      y: y,
      width: globalMetrics.maxSymbolSize,
      height: labelRect.height
    }, symbolItem.size, {
      align: typeof symbolItem.align === 'undefined' ? 0.5 : symbolItem.align,
      justify: typeof symbolItem.justify === 'undefined' ? 0.5 : symbolItem.justify
    });

    var symbol = symbolFn(extend({}, symbolItem, wiggled));

    delete symbol.collider;

    label.anchor = rtl ? 'end' : 'start';

    placeTextInRect$2(labelRect, label, {
      textMetrics: labelBounds,
      fontSize: parseInt(label.fontSize, 10),
      align: 0.0,
      justify: 0.5
    });

    var container = {
      type: 'container',
      data: item.label.displayObject.data,
      children: [symbol, label],
      collider: {
        type: 'rect',
        x: x,
        y: y,
        width: globalMetrics.maxItemBounds.width,
        height: globalMetrics.maxItemBounds.height
      }
    };

    return {
      item: container,
      metrics: labelRect
    };
  }

  function _getItemsToRender(_ref2, rect, _ref3) {
    var viewRect = _ref2.viewRect;
    var itemized = _ref3.itemized,
        _ref3$create = _ref3.create,
        create = _ref3$create === undefined ? createRenderItem : _ref3$create,
        parallels = _ref3.parallels;

    var direction = itemized.layout.direction;
    var globalMetrics = itemized.globalMetrics;
    var legendItems = itemized.items;
    var isHorizontal = itemized.layout.orientation === 'horizontal';
    var s = 0;

    var renderItems = [];
    var fixedHeight = globalMetrics.maxItemBounds.height;
    var fixedWidth = globalMetrics.maxItemBounds.width;
    var rowHeight = itemized.layout.margin.vertical + fixedHeight;
    var columnWidth = itemized.layout.margin.horizontal + fixedWidth;
    var x = rect.x;
    var y = rect.y;

    var shift = viewRect.x - rect.x;

    for (var i = 0; i < legendItems.length; i++) {
      var renderItem = create({
        y: y,
        x: direction === 'rtl' ? viewRect.x + shift + viewRect.width - fixedWidth - (x - rect.x) : x,
        item: legendItems[i],
        globalMetrics: globalMetrics,
        direction: direction
      });

      if (isHorizontal && x >= viewRect.x - fixedWidth || !isHorizontal && y >= viewRect.y - fixedHeight) {
        renderItems.push(renderItem.item);
      }

      s++;
      if (s >= parallels) {
        s = 0;
        if (isHorizontal) {
          x += columnWidth; // next column
          y = rect.y; // reset y to first row
        } else {
          y += rowHeight; // next row
          x = rect.x; // reset x to first column
        }
      } else if (isHorizontal) {
        y += rowHeight; // next row
      } else {
        x += columnWidth; // next column
      }

      if (!isHorizontal && y > viewRect.y + viewRect.height) {
        break;
      } else if (isHorizontal && x > viewRect.x + viewRect.width) {
        break;
      }
    }
    return renderItems;
  }

  function _itemize(_ref4, renderer) {
    var resolved = _ref4.resolved,
        dock = _ref4.dock;

    var label = void 0;
    var items = [];
    var item = void 0;
    var sourceItems = resolved.items.items;
    var sourceSymbols = resolved.symbols.items;
    var sourceLabels = resolved.labels.items;

    var maxSymbolSize = 0;
    var maxLabelWidth = 0;
    var maxLabelHeight = 0;

    for (var i = 0; i < sourceItems.length; i++) {
      if (sourceItems[i].show === false) {
        continue;
      }

      label = extend({}, sourceLabels[i], { // create the displayObject here in order to measure it
        type: 'text',
        fontSize: parseInt(sourceLabels[i].fontSize, 10) + 'px',
        text: typeof sourceLabels[i].text !== 'undefined' ? sourceLabels[i].text : sourceLabels[i].data.label || ''
      });

      item = {
        symbol: {
          // can't create a displayObject here due to need to wiggle the center position of the symbol later on,
          // just store the object needed later on
          meta: sourceSymbols[i]
        },
        label: {
          displayObject: label,
          bounds: renderer.textBounds(label)
        }
      };

      items.push(item);

      maxSymbolSize = Math.max(sourceSymbols[i].size, maxSymbolSize);
      maxLabelWidth = Math.max(item.label.bounds.width, maxLabelWidth);
      maxLabelHeight = Math.max(item.label.bounds.height, maxLabelHeight);
    }

    return {
      items: items,
      globalMetrics: {
        spacing: 8,
        maxSymbolSize: maxSymbolSize,
        maxItemBounds: {
          height: Math.max(maxSymbolSize, maxLabelHeight),
          width: maxSymbolSize + 8 + maxLabelWidth
        },
        maxLabelBounds: {
          width: maxLabelWidth,
          height: maxLabelHeight
        }
      },
      layout: {
        margin: {
          vertical: typeof resolved.layout.item.vertical !== 'undefined' ? resolved.layout.item.vertical : 8,
          horizontal: typeof resolved.layout.item.horizontal !== 'undefined' ? resolved.layout.item.horizontal : 8
        },
        mode: resolved.layout.item.mode,
        size: resolved.layout.item.size,
        orientation: dock === 'top' || dock === 'bottom' ? 'horizontal' : 'vertical',
        direction: resolved.layout.item.direction,
        scrollOffset: resolved.layout.item.scrollOffset
      }
    };
  }

  function _extent(itemized, parallels) {
    var count = itemized.items.length;
    var size = Math.ceil(count / parallels);
    var property = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
    var margin = property === 'width' ? 'horizontal' : 'vertical';
    return itemized.globalMetrics.maxItemBounds[property] * size + (size - 1) * itemized.layout.margin[margin];
  }

  function _spread(itemized, parallels) {
    var size = parallels;
    var property = itemized.layout.orientation === 'horizontal' ? 'height' : 'width';
    var margin = property === 'width' ? 'horizontal' : 'vertical';
    return itemized.globalMetrics.maxItemBounds[property] * size + // expected vertical size of items
    (size - 1) * itemized.layout.margin[margin]; // expected spacing between items
  }

  function _parallelize(availableExtent, availableSpread, itemized) {
    var count = itemized.items.length;
    var extentProperty = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
    var margin = extentProperty === 'width' ? 'horizontal' : 'vertical';
    var extentInPx = itemized.globalMetrics.maxItemBounds[extentProperty] * count + (count - 1) * itemized.layout.margin[margin];
    var numNeeded = Math.ceil(extentInPx / availableExtent);

    if (availableSpread != null) {
      var spreadProperty = itemized.layout.orientation === 'horizontal' ? 'height' : 'width';
      var numAllowed = Math.floor(availableSpread / (4 + itemized.globalMetrics.maxItemBounds[spreadProperty]));
      numNeeded = Math.min(numNeeded, numAllowed);
    }

    var numInput = isNaN(itemized.layout.size) ? 1 : itemized.layout.size;
    return Math.max(1, Math.min(numNeeded, numInput));
  }

  function itemRendererFactory (legend, _ref5) {
    var _ref5$onScroll = _ref5.onScroll,
        onScroll = _ref5$onScroll === undefined ? function () {} : _ref5$onScroll;

    var itemized = void 0;
    var parallels = void 0;
    var viewRect = void 0;
    var containerRect = void 0;
    var _offset = null;
    var overflow = 0;

    var api = {
      itemize: function itemize(obj) {
        itemized = _itemize(obj, legend.renderer);
        _offset = _offset === null && !isNaN(itemized.layout.scrollOffset) ? itemized.layout.scrollOffset : _offset; // Set the initial offset
      },
      getItemsToRender: function getItemsToRender(obj) {
        viewRect = obj.viewRect;
        overflow = api.getContentOverflow(viewRect);
        var ext = api.extent();
        _offset = Math.max(0, Math.min(_offset, overflow));

        containerRect = extend({}, viewRect);

        var offsetProperty = api.orientation() === 'horizontal' ? 'x' : 'y';
        containerRect[offsetProperty] -= _offset;
        containerRect[offsetProperty === 'x' ? 'width' : 'height'] = ext;

        return _getItemsToRender(obj, containerRect, { itemized: itemized, parallels: parallels });
      },
      parallelize: function parallelize(availableExtent, availableSpread) {
        parallels = _parallelize(availableExtent, availableSpread, itemized);
        return parallels;
      },
      hasContentOverflow: function hasContentOverflow() {
        var property = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
        return _extent(itemized, parallels) > viewRect[property];
      },
      getContentOverflow: function getContentOverflow() {
        var rect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : viewRect;

        var property = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
        return Math.max(0, _extent(itemized, parallels) - rect[property]);
      },
      getNextSize: function getNextSize() {
        // TODO - calculate the actual size to next item to ensure alignment
        var property = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
        var margin = property === 'width' ? 'horizontal' : 'vertical';
        return itemized.globalMetrics.maxItemBounds[property] + itemized.layout.margin[margin];
      },
      getPrevSize: function getPrevSize() {
        // TODO - calculate the actual size to next item to ensure alignment
        var property = itemized.layout.orientation === 'horizontal' ? 'width' : 'height';
        var margin = property === 'width' ? 'horizontal' : 'vertical';
        return itemized.globalMetrics.maxItemBounds[property] + itemized.layout.margin[margin];
      },
      hasNext: function hasNext() {
        if (api.orientation() === 'horizontal') {
          return viewRect.x + viewRect.width < containerRect.x + containerRect.width;
        }
        return viewRect.y + viewRect.height < containerRect.y + containerRect.height;
      },
      hasPrev: function hasPrev() {
        if (api.orientation() === 'horizontal') {
          return containerRect.x < viewRect.x;
        }
        return containerRect.y < viewRect.y;
      },
      next: function next() {
        api.scroll(-api.getNextSize());
      },
      prev: function prev() {
        api.scroll(api.getPrevSize());
      },
      scroll: function scroll(delta) {
        var current = Math.max(0, Math.min(overflow, _offset - delta));
        if (current === _offset) {
          return;
        }
        _offset = current;
        onScroll();
      },
      offset: function offset() {
        return _offset;
      },
      orientation: function orientation() {
        return itemized.layout.orientation;
      },
      direction: function direction() {
        return itemized.layout.direction;
      },
      extent: function extent() {
        return _extent(itemized, parallels);
      }, // total amount of space along orientation
      spread: function spread() {
        return _spread(itemized, parallels);
      } // total amount of space perpendicular to orientation
    };

    return api;
  }

  var DIR = {
    up: '\u25B2',
    right: '\u25B6',
    down: '\u25BC',
    left: '\u25C0'
  };

  function _itemize$1(_ref) {
    var dock = _ref.dock,
        navigation = _ref.navigation;

    return {
      layout: {
        orientation: dock === 'top' || dock === 'bottom' ? 'vertical' : 'horizontal'
      },
      navigation: navigation
    };
  }

  function btn(h, _ref2) {
    var size = _ref2.size,
        isActive = _ref2.isActive,
        direction = _ref2.direction,
        nav = _ref2.nav,
        attrs = _ref2.attrs;

    var c = {};
    var content = '';
    if (nav && nav.button) {
      if (typeof nav.button.class === 'function') {
        c = nav.button.class({ direction: direction });
      } else if (nav.button.class) {
        c = nav.button.class;
      }
      if (typeof nav.button.content === 'function') {
        content = nav.button.content(h, { direction: direction });
      }
    }
    var style = {
      width: size + 'px',
      minWidth: size + 'px',
      height: size + 'px'
    };

    if (!Object.keys(c).length) {
      // if no classes are set, add some basic styling
      style.border = '0';
      style.background = 'none';
    }
    var attrsMerged = attrs;
    attrsMerged.disabled = !isActive ? 'disabled' : undefined;

    return h('button', {
      class: c,
      style: style,
      attrs: attrsMerged
    }, [content || h('span', {
      style: {
        pointerEvents: 'none'
      }
    }, [DIR[direction]])]);
  }

  function _render(renderer, _ref3, itemized, legend) {
    var rect = _ref3.rect,
        itemRenderer = _ref3.itemRenderer;

    if (!renderer || !renderer.renderArgs) {
      return;
    }
    renderer.size(rect);
    var h = renderer.renderArgs[0];

    var isVertical = itemized.layout.orientation === 'vertical'; // orientation of the navigation (not the legend)
    var isRtl = itemRenderer.direction() === 'rtl';

    var hasNext = itemRenderer.hasNext();
    var hasPrev = itemRenderer.hasPrev();

    if (!hasPrev && !hasNext) {
      renderer.render([]);
      return;
    }

    var buttonSize = 32;

    var order = isVertical ? ['right', 'left'] : ['down', 'up'];
    if (isRtl) {
      order.reverse();
    }

    var nodes = [h('div', {
      style: {
        position: 'relative',
        display: 'flex',
        'flex-direction': isVertical ? 'column' : 'row',
        'justify-content': 'center',
        height: '100%',
        pointerEvents: 'auto'
      }
    }, [btn(h, {
      size: buttonSize,
      isActive: hasNext,
      direction: order[0],
      attrs: {
        'data-action': 'next',
        'data-component-key': legend.settings.key
      },
      nav: itemized.navigation
    }), btn(h, {
      size: buttonSize,
      isActive: hasPrev,
      direction: order[1],
      attrs: {
        'data-action': 'prev',
        'data-component-key': legend.settings.key
      },
      nav: itemized.navigation
    })])];
    renderer.render(nodes);
  }

  function navigationRendererFactory (legend) {
    var itemized = void 0;

    var nav = {
      itemize: function itemize(obj) {
        itemized = _itemize$1(obj);
      },
      render: function render(obj) {
        return _render(nav.renderer, obj, itemized, legend);
      },
      extent: function extent() {
        return 32;
      },
      spread: function spread() {
        return 64;
      }
    };

    return nav;
  }

  function _itemize$2(_ref, legend) {
    var resolved = _ref.resolved;

    if (resolved.title.item.show === false) {
      return null;
    }
    var t = extend({}, resolved.title.item, {
      type: 'text'
    });

    if (resolved.layout.item.direction === 'rtl') {
      if (!t.anchor || t.anchor === 'start') {
        t.anchor = 'end';
      } else if (t.anchor === 'end') {
        t.anchor = 'start';
      }
    }

    if (typeof resolved.title.settings.text === 'undefined') {
      var fields = legend.scale.data().fields;
      t.text = fields && fields[0] ? fields[0].title() : '';
    }

    return {
      displayObject: t,
      bounds: legend.renderer.textBounds(t)
    };
  }

  function _render$1(_ref2, renderer, itemized) {
    var rect = _ref2.rect;

    if (!renderer) {
      return;
    }
    var nodes = [];
    renderer.size(rect);
    if (itemized) {
      var align = {
        start: 0,
        end: rect.width,
        middle: rect.width / 2
      };
      nodes.push(extend({}, itemized.displayObject, {
        x: align[itemized.displayObject.anchor] || 0,
        y: 0,
        baseline: 'hanging'
      }));
    }
    renderer.render(nodes);
  }

  function titleRendererFactory (legend) {
    var itemized = void 0;

    var api = {
      itemize: function itemize(obj) {
        itemized = _itemize$2(obj, legend);
      },
      render: function render(obj) {
        _render$1(obj, api.renderer, itemized);
      },
      spread: function spread() {
        return itemized ? itemized.bounds.height * 1.25 : 0;
      },
      extent: function extent() {
        return itemized ? itemized.bounds.width : 0;
      }
    };

    return api;
  }

  /* eslint no-mixed-operators:0 */

  function layout(rect, display, orientation, _ref) {
    var itemRenderer = _ref.itemRenderer,
        navigationRenderer = _ref.navigationRenderer,
        titleRenderer = _ref.titleRenderer,
        _ref$isPreliminary = _ref.isPreliminary,
        isPreliminary = _ref$isPreliminary === undefined ? false : _ref$isPreliminary;

    var title = void 0;
    var content = void 0;
    var navigation = void 0;
    var preferredSize = 0;

    var paddedRect = {
      x: display.spacing,
      y: display.spacing,
      width: rect.width - 2 * display.spacing,
      height: rect.height - 2 * display.spacing
    };

    title = {
      x: paddedRect.x,
      y: paddedRect.y,
      width: paddedRect.width,
      height: titleRenderer.spread()
    };

    if (orientation === 'horizontal') {
      // const titleAtTop = false;
      // if (titleAtTop) { // this might be a nicer layout sometimes
      //   // |------------------|
      //   // |title             |
      //   // |------------|-----|
      //   // |content     | nav |
      //   // |------------|-----|

      //   // available space for items without navigation UI
      //   const availableExtentForItems = paddedRect.width;
      //   const availableSpreadForItems = paddedRect.height - (title.y + title.height) + 8;
      //   const isRtl = itemRenderer.direction() === 'rtl';
      //   itemRenderer.parallelize(availableExtentForItems, isPreliminary ? undefined : availableSpreadForItems);

      //   const navigationSize = itemRenderer.extent() > availableExtentForItems ? navigationRenderer.extent() : 0;
      //   content = {
      //     x: paddedRect.x,
      //     y: title.y + title.height,
      //     width: paddedRect.width - navigationSize,
      //     height: availableSpreadForItems
      //   };
      //   navigation = {
      //     x: content.x + content.width,
      //     y: title.y + title.height,
      //     width: navigationSize,
      //     height: paddedRect.height - (title.y + title.height) + 8
      //   };

      //   if (isRtl) { // switch navigation and content
      //     navigation.x = content.x;
      //     content.x = navigation.x + navigation.width;
      //     // totalContent.x = navigation.x;
      //   }
      //   preferredSize = title.height + Math.max(navigationRenderer.spread(), itemRenderer.spread());
      // } else {
      // |-----|------------|-----|
      // |title|content     | nav |
      // |-----|------------|-----|

      title = {
        x: paddedRect.x,
        y: paddedRect.y,
        width: titleRenderer.extent(),
        height: titleRenderer.spread()
      };

      // available space for items without navigation UI
      var availableExtentForItems = paddedRect.width - title.width - (title.width ? display.spacing : 0);
      var availableSpreadForItems = paddedRect.height;
      itemRenderer.parallelize(availableExtentForItems, isPreliminary ? undefined : availableSpreadForItems);

      var navigationSize = itemRenderer.extent() > availableExtentForItems ? navigationRenderer.extent() : 0;
      var spread = itemRenderer.spread();
      var navigationSpread = navigationSize ? navigationRenderer.spread() : 0;
      content = {
        x: title.x + title.width + (title.width ? display.spacing : 0),
        y: paddedRect.y + Math.max(0, (navigationSpread - spread) / 2),
        width: paddedRect.width - navigationSize - title.width - (navigationSize ? display.spacing : 0) - (title.width ? display.spacing : 0),
        height: availableSpreadForItems
      };
      navigation = {
        x: content.x + content.width + (navigationSize ? display.spacing : 0),
        y: paddedRect.y,
        width: navigationSize,
        height: paddedRect.height
      };

      title.y = content.y;

      var isRtl = itemRenderer.direction() === 'rtl';
      if (isRtl) {
        // switch title, content and navigation
        navigation.x = paddedRect.x;
        content.x = navigation.x + navigation.width + (navigation.width ? display.spacing : 0);
        title.x = content.x + content.width + (title.width ? display.spacing : 0);
      }
      preferredSize = Math.max(title.height, navigationSpread, itemRenderer.spread());
      // }
    } else {
      // |------------|
      // |title       |
      // |------------|
      // |content     |
      // |------------|
      // |navigation  |
      // |------------|

      var _availableExtentForItems = paddedRect.height - title.height - (title.height ? display.spacing : 0);
      var _availableSpreadForItems = paddedRect.width;
      itemRenderer.parallelize(_availableExtentForItems, isPreliminary ? undefined : _availableSpreadForItems);

      var _navigationSize = itemRenderer.extent() > _availableExtentForItems ? navigationRenderer.extent() : 0;
      navigation = {
        x: paddedRect.x,
        y: paddedRect.y + paddedRect.height - _navigationSize,
        width: paddedRect.width,
        height: _navigationSize
      };

      content = {
        x: paddedRect.x,
        y: title.y + title.height + (title.height ? display.spacing : 0),
        width: paddedRect.width,
        height: paddedRect.height - title.height - (title.height ? display.spacing : 0) - navigation.height - (navigation.height ? display.spacing : 0)
      };

      preferredSize = Math.max(titleRenderer.extent(), _navigationSize ? navigationRenderer.spread() : 0, itemRenderer.spread());
    }

    content = extend({}, rect, {
      x: rect.x + content.x,
      y: rect.y + content.y,
      width: content.width,
      height: content.height
    });

    navigation.x += rect.x;
    navigation.y += rect.y;

    title.x += rect.x;
    title.y += rect.y;

    return {
      title: extend({}, rect, title),
      content: extend({}, rect, content),
      navigation: extend({}, rect, navigation),
      orientation: orientation,
      preferredSize: preferredSize
    };
  }

  function update(comp) {
    comp.state.resolved = resolveSettings$2(comp);
    comp.titleRenderer.itemize({
      resolved: comp.state.resolved,
      dock: comp.settings.dock || 'center'
    });
    comp.itemRenderer.itemize({
      resolved: comp.state.resolved,
      dock: comp.settings.dock || 'center'
    });
    comp.navigationRenderer.itemize({
      resolved: comp.state.resolved,
      dock: comp.settings.dock || 'center',
      navigation: comp.settings.settings.navigation
    });

    comp.state.display = {
      spacing: 8
    };
  }

  function _preferredSize(comp, size) {
    var s = 0;
    var dock = comp.settings.dock || 'center';
    var orientation = dock === 'top' || dock === 'bottom' ? 'horizontal' : 'vertical';
    var d = comp.state.display;
    var tempLayout = layout(size.inner, d, orientation, {
      itemRenderer: comp.itemRenderer,
      navigationRenderer: comp.navigationRenderer,
      titleRenderer: comp.titleRenderer,
      isPreliminary: true
    });
    s += d.spacing; // start padding in both vertical and horizontal mode
    s += tempLayout.preferredSize;
    s += d.spacing; // end padding in both vertical and horizontal mode
    return s;
  }

  function _render$2(legend) {
    var rect = legend.rect,
        settings = legend.settings,
        state = legend.state,
        itemRenderer = legend.itemRenderer,
        navigationRenderer = legend.navigationRenderer,
        titleRenderer = legend.titleRenderer;

    var orientation = settings.dock === 'top' || settings.dock === 'bottom' ? 'horizontal' : 'vertical';
    var l = layout(rect, state.display, orientation, {
      itemRenderer: itemRenderer,
      navigationRenderer: navigationRenderer,
      titleRenderer: titleRenderer
    });

    legend.renderer.size(l.content);

    // l.content.x = 0;
    // l.content.y = 0;

    // l.navigation.x += rect.x;
    // l.navigation.y += rect.y;

    // l.title.x += rect.x;
    // l.title.y += rect.y;

    var contentItems = itemRenderer.getItemsToRender({
      viewRect: extend({}, l.content, { x: 0, y: 0 })
    });

    navigationRenderer.render({
      rect: l.navigation,
      itemRenderer: itemRenderer
    });

    titleRenderer.render({
      rect: l.title
    });

    legend.state.views = {
      layout: l
    };

    return contentItems;
  }

  var component$2 = {
    require: ['chart', 'settings', 'renderer', 'update', 'resolver', 'registries'],
    defaultSettings: {
      settings: {},
      style: {
        item: {
          label: '$label',
          shape: '$shape'
        },
        title: '$title'
      }
    },
    mounted: function mounted(renderElement) {
      if (renderElement && renderElement.parentElement) {
        this.navigationRenderer.renderer.appendTo(renderElement.parentElement);
        this.titleRenderer.renderer.appendTo(renderElement.parentElement);
      }
      this.navigationRenderer.render({
        rect: this.state.views.layout.navigation,
        itemRenderer: this.itemRenderer
      });

      this.titleRenderer.render({
        rect: this.state.views.layout.title
      });
    },
    beforeUnmount: function beforeUnmount() {
      this.navigationRenderer.renderer.clear();
      this.titleRenderer.renderer.clear();
    },

    on: {
      panstart: function panstart() {
        if (this.state.interaction.started) {
          return;
        }
        var contentOverflow = this.itemRenderer.getContentOverflow();
        if (!contentOverflow) {
          return;
        }
        this.state.interaction.started = true;
        this.state.interaction.delta = 0;
      },
      panmove: function panmove(e) {
        if (!this.state.interaction.started) {
          return;
        }
        var delta = this.itemRenderer.orientation() === 'horizontal' ? (this.itemRenderer.direction() === 'rtl' ? -1 : 1) * e.deltaX : e.deltaY;
        this.itemRenderer.scroll(delta - this.state.interaction.delta);
        this.state.interaction.delta = delta;
      },
      panend: function panend() {
        this.state.interaction.started = false;
      },
      scroll: function scroll(delta) {
        this.itemRenderer.scroll(-delta);
      },
      next: function next() {
        this.itemRenderer.next();
      },
      prev: function prev() {
        this.itemRenderer.prev();
      }
    },
    created: function created() {
      var _this = this;

      this.rect = {
        x: 0, y: 0, width: 0, height: 0
      };
      this.state = {
        interaction: {}
      };
      this.onScroll = function () {
        var items = _render$2(_this);
        _this.update(items);
      };
      this.itemRenderer = itemRendererFactory(this, {
        onScroll: this.onScroll
      });
      this.navigationRenderer = navigationRendererFactory(this);
      this.titleRenderer = titleRendererFactory(this);
      this.navigationRenderer.renderer = this.registries.renderer('dom')();
      this.titleRenderer.renderer = this.registries.renderer()();
      update(this);
    },
    preferredSize: function preferredSize(obj) {
      return _preferredSize(this, obj);
    },
    beforeUpdate: function beforeUpdate() {
      update(this);
    },
    beforeRender: function beforeRender(opts) {
      this.rect = opts.size;
    },
    render: function render() {
      return _render$2(this);
    },
    beforeDestroy: function beforeDestroy() {
      this.navigationRenderer.renderer.destroy();
      this.titleRenderer.renderer.destroy();
    },
    _DO_NOT_USE_getInfo: function _DO_NOT_USE_getInfo() {
      return {
        offset: this.itemRenderer.offset()
      };
    }
  };

  /**
   * @typedef {object} component--legend-cat
   * @property {string} scale
   */

  /**
   * @type {string}
   * @memberof component--legend-cat
   */
  var type$2 = 'legend-cat';

  function categoricalLegend(picasso) {
    picasso.component(type$2, component$2);
  }

  function applyAlignJustify(ctx, node) {
    var wiggle = 0;
    var cmd = {
      type: ctx.state.isVertical ? 'justify' : 'align',
      coord: ctx.state.isVertical ? 'y' : 'x',
      pos: ctx.state.isVertical ? 'height' : 'width',
      fn: ctx.state.isVertical ? 'requiredHeight' : 'requiredWidth'
    };

    wiggle = ctx.state.rect[cmd.pos] - ctx.state.legend.length() - ctx.state.title[cmd.fn]();
    wiggle *= Math.min(1, Math.max(ctx.stgns[cmd.type], 0));
    node[cmd.coord] += wiggle;
  }

  function generateStopNodes(ctx) {
    var fillScale = ctx.state.legend.fillScale;
    var majorScale = ctx.state.legend.majorScale;
    var stops = fillScale.domain().map(function (d) {
      return {
        type: 'stop',
        color: fillScale(d),
        offset: Math.min(1, Math.max(0, majorScale.norm(d)))
      };
    });

    return stops.sort(function (a, b) {
      return a.offset - b.offset;
    });
  }

  function createTitleNode(ctx) {
    var state = ctx.state;
    var settings = ctx.stgns;
    var isTickLeft = state.ticks.anchor === 'left';
    var isTickTop = state.ticks.anchor === 'top';
    var x = state.rect.x;
    var y = state.rect.y;
    var textAnchor = 'start';

    if (state.title.anchor === 'left') {
      x += state.title.requiredWidth() - settings.title.padding;
      y += state.title.textMetrics.height;
      y += isTickTop ? state.rect.height - state.title.textBounds.height : 0;
      textAnchor = 'end';
    } else if (state.title.anchor === 'right') {
      x += state.legend.length();
      x += settings.title.padding;
      y += state.title.textMetrics.height;
      y += isTickTop ? state.rect.height - state.title.textBounds.height : 0;
    } else if (state.title.anchor === 'top') {
      x += isTickLeft ? state.rect.width : 0;
      y += state.title.textMetrics.height;
      textAnchor = isTickLeft ? 'end' : 'start';
    }

    var node = {
      tag: 'legend-title',
      type: 'text',
      x: x,
      y: Math.min(y, state.rect.y + state.rect.height),
      text: settings.title.text,
      fill: settings.title.fill,
      fontSize: settings.title.fontSize,
      fontFamily: settings.title.fontFamily,
      maxWidth: settings.title.maxLengthPx,
      maxLines: settings.title.maxLines,
      wordBreak: settings.title.wordBreak,
      hyphens: settings.title.hyphens,
      lineHeight: settings.title.lineHeight,
      anchor: textAnchor
    };

    applyAlignJustify(ctx, node);
    return node;
  }

  function createLegendRectNode(ctx, stops) {
    var state = ctx.state;
    var settings = ctx.stgns;
    var container = state.rect;
    var x = container.x;
    var y = container.y;
    var width = state.isVertical ? settings.size : state.legend.length();
    var height = state.isVertical ? state.legend.length() : settings.size;

    if (state.ticks.anchor === 'left') {
      x += state.rect.width - settings.size;
    } else if (state.ticks.anchor === 'top') {
      y += state.rect.height - settings.size;
    }

    if (state.title.anchor === 'top') {
      y += state.title.requiredHeight();
    } else if (state.title.anchor === 'left') {
      x += state.title.requiredWidth();
    }

    var node = {
      type: 'rect',
      x: x,
      y: y,
      width: width,
      height: height,
      fill: {
        type: 'gradient',
        stops: stops,
        degree: state.isVertical ? 90 : 180
      }
    };

    applyAlignJustify(ctx, node);
    return node;
  }

  function createTickNodes(ctx, legendNode) {
    var state = ctx.state;
    var settings = ctx.stgns;
    var anchor = 'start';
    var rangeSelectorRect = {
      type: 'rect',
      x: legendNode.x,
      y: legendNode.y,
      width: state.isVertical ? 0 : legendNode.width,
      height: state.isVertical ? legendNode.height : 0,
      fill: 'transparent'
    };

    var nodes = state.ticks.values.map(function (tick) {
      var x = 0;
      var y = 0;
      var dx = 0;
      var dy = 0;

      if (state.isVertical) {
        y = legendNode.y + legendNode.height * tick.pos;
        dy = tick.pos === 1 ? -(tick.textMetrics.height / 5) : tick.textMetrics.height;
      } else {
        x = legendNode.x + legendNode.width * tick.pos;
      }

      if (state.ticks.anchor === 'right') {
        x = legendNode.x + settings.size + settings.tick.padding;

        rangeSelectorRect.x = legendNode.x + legendNode.width;
      } else if (state.ticks.anchor === 'left') {
        x = legendNode.x - settings.tick.padding;
        anchor = 'end';
      } else if (state.ticks.anchor === 'top') {
        y = legendNode.y - settings.tick.padding;
        dy -= tick.textMetrics.height * 0.25;
        anchor = tick.pos === 0 ? 'start' : 'end';
      } else if (state.ticks.anchor === 'bottom') {
        y = legendNode.y + legendNode.height + settings.tick.padding;
        dy = tick.textMetrics.height * 0.8;
        anchor = tick.pos === 0 ? 'start' : 'end';

        rangeSelectorRect.y = legendNode.y + legendNode.height;
      }

      var node = {
        type: 'text',
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        text: tick.label,
        fontSize: settings.tick.fontSize,
        fontFamily: settings.tick.fontFamily,
        fill: settings.tick.fill,
        maxWidth: state.isVertical ? settings.tick.maxLengthPx : Math.min(settings.tick.maxLengthPx, state.legend.length() / 2),
        anchor: anchor,
        textBoundsFn: ctx.renderer.textBounds
      };

      return node;
    });

    return {
      type: 'container',
      id: 'legend-seq-ticks',
      children: [].concat(toConsumableArray(nodes), [rangeSelectorRect])
    };
  }

  function resolveAnchor(dock, anchor, map) {
    var mapped = map[dock];
    if ((typeof mapped === 'undefined' ? 'undefined' : _typeof(mapped)) === 'object') {
      if (mapped.valid.indexOf(anchor) !== -1) {
        return anchor;
      }
      return mapped.default;
    }

    return map.default;
  }

  function resolveTickAnchor(settings) {
    var dock = settings.dock;
    var anchor = settings.settings.tick.anchor;

    var dockAnchorMap = {
      left: { valid: ['left', 'right'], default: 'left' },
      right: { valid: ['left', 'right'], default: 'right' },
      top: { valid: ['top', 'bottom'], default: 'top' },
      bottom: { valid: ['top', 'bottom'], default: 'bottom' },
      default: 'right'
    };

    return resolveAnchor(dock, anchor, dockAnchorMap);
  }

  function resolveTitleAnchor(settings) {
    var dockAnchorMap = {
      left: { valid: ['top'], default: 'top' },
      right: { valid: ['top'], default: 'top' },
      top: { valid: ['left', 'right'], default: 'left' },
      bottom: { valid: ['left', 'right'], default: 'left' },
      default: 'top'
    };

    var dock = settings.dock;
    var anchor = settings.settings.title.anchor;

    return resolveAnchor(dock, anchor, dockAnchorMap);
  }

  function initRect(ctx, size) {
    var rect = {
      x: 0, y: 0, width: 0, height: 0
    };
    var padding = ctx.stgns.padding;
    rect.x = padding.left;
    rect.y = padding.top;
    rect.width = size.width - padding.left - padding.right;
    rect.height = size.height - padding.top - padding.bottom;

    return rect;
  }

  function getTicks(ctx, majorScale) {
    var values = majorScale.domain();
    var labels = values;
    var labelFn = ctx.stgns.tick.label;
    if (!labelFn && ctx.formatter) {
      labelFn = ctx.formatter;
    } else if (!labelFn && majorScale.data().fields) {
      labelFn = majorScale.data().fields[0].formatter();
    }
    if (typeof labelFn === 'function') {
      labels = values.map(labelFn).map(String);
    }

    var ticks = values.map(function (value, i) {
      var label = labels[i];
      return {
        value: value,
        label: label,
        pos: majorScale.norm(parseFloat(value, 10)),
        textMetrics: ctx.renderer.measureText({
          text: label,
          fontSize: ctx.stgns.tick.fontSize,
          fontFamily: ctx.stgns.tick.fontFamily
        })
      };
    });

    return ticks;
  }

  function initState(ctx) {
    var isVertical = ctx.settings.dock !== 'top' && ctx.settings.dock !== 'bottom';
    var titleStgns = ctx.stgns.title;

    var fillScale = ctx.chart.scale(ctx.stgns.fill);
    var majorScale = ctx.chart.scale(ctx.stgns.major);
    var tickValues = getTicks(ctx, majorScale);
    var tickAnchor = resolveTickAnchor(ctx.settings);

    if (typeof titleStgns.text === 'undefined') {
      var fields = majorScale.data().fields;
      titleStgns.text = fields && fields[0] ? fields[0].title() : '';
    }

    var titleTextMetrics = ctx.renderer.measureText({
      text: titleStgns.text,
      fontSize: titleStgns.fontSize,
      fontFamily: titleStgns.fontFamily
    });

    var titleTextBounds = ctx.renderer.textBounds({
      text: titleStgns.text,
      fontSize: titleStgns.fontSize,
      fontFamily: titleStgns.fontFamily,
      maxLines: titleStgns.maxLines,
      maxWidth: titleStgns.maxLengthPx,
      wordBreak: titleStgns.wordBreak,
      hyphens: titleStgns.hyphens,
      lineHeight: titleStgns.lineHeight
    });

    var state = {
      isVertical: isVertical,
      nodes: [],
      title: {
        anchor: resolveTitleAnchor(ctx.settings),
        textMetrics: titleTextMetrics,
        textBounds: titleTextBounds,
        requiredWidth: function requiredWidth() {
          if (!titleStgns.show) {
            return 0;
          }
          var w = titleTextBounds.width;
          var mw = titleStgns.maxLengthPx;
          if (!isVertical) {
            w += titleStgns.padding;
            mw += titleStgns.padding;
          }
          return Math.min(w, mw, state.rect.width);
        },
        requiredHeight: function requiredHeight() {
          if (!titleStgns.show) {
            return 0;
          }
          var h = titleTextBounds.height;
          if (isVertical) {
            h += titleStgns.padding;
          }
          return Math.min(h, state.rect.height);
        }
      },
      ticks: {
        values: tickValues,
        anchor: tickAnchor,
        length: Math.min(Math.max.apply(Math, toConsumableArray(tickValues.map(function (t) {
          return t.textMetrics.width;
        }))), ctx.stgns.tick.maxLengthPx),
        requiredHeight: function requiredHeight() {
          return tickAnchor === 'top' ? Math.max.apply(Math, toConsumableArray(state.ticks.values.map(function (t) {
            return t.textMetrics.height;
          }))) + ctx.stgns.tick.padding : 0;
        },
        height: Math.max.apply(Math, toConsumableArray(tickValues.map(function (t) {
          return t.textMetrics.height;
        })))
      },
      legend: {
        fillScale: fillScale,
        majorScale: majorScale,
        length: function length() {
          var pos = isVertical ? 'height' : 'width';
          var fnPos = isVertical ? 'requiredHeight' : 'requiredWidth';
          var len = Math.min(state.rect[pos], state.rect[pos] * ctx.stgns.length) - state.title[fnPos]();
          return Math.max(0, Math.min(len, ctx.stgns.maxLengthPx));
        }
      }
    };

    return state;
  }

  /**
   * @typedef {object} component--legend-seq
   * @property {string} fill - Reference to definition of sequential color scale
   * @property {string} major - Reference to definition of linear scale
   * @property {number} [size=15] - Size in pixels of the legend, if vertical is the width and height otherwise
   * @property {number} [length=1] - A value in the range 0-1 indicating the length of the legend node
   * @property {number} [maxLengthPx=250] - Max length in pixels
   * @property {number} [align=0.5] - A value in the range 0-1 indicating horizontal alignment of the legend's content. 0 aligns to the left, 1 to the right.
   * @property {number} [justify=0] - A value in the range 0-1 indicating vertical alignment of the legend's content. 0 aligns to the top, 1 to the bottom.
   * @property {object} [padding]
   * @property {number} [padding.left=5]
   * @property {number} [padding.right=5]
   * @property {number} [padding.top=5]
   * @property {number} [padding.bottom=5]
   * @property {object} [tick]
   * @property {function} [tick.label] - Function applied to all tick values, returned values are used as labels
   * @property {string} [tick.fill='#595959']
   * @property {string} [tick.fontSize='12px']
   * @property {string} [tick.fontFamily='Arial']
   * @property {number} [tick.maxLengthPx=150] - Max length in pixels
   * @property {string} [tick.anchor='right'] - Where to anchor the tick in relation to the legend node, supported values are [top, bottom, left and right]
   * @property {number} [tick.padding=5] - padding in pixels to the legend node
   * @property {object} [title] - Title settings
   * @property {boolean} [title.show=true] - Toggle title on/off
   * @property {string} [title.text=''] - Title text. Defaults to the title of the provided data field
   * @property {string} [title.fill='#595959']
   * @property {string} [title.fontSize='12px']
   * @property {string} [title.fontFamily='Arial']
   * @property {number} [title.maxLengthPx=100] - Max length in pixels
   * @property {number} [title.padding=5] - padding in pixels to the legend node
   * @property {string} [title.anchor='top'] - Where to anchor the title in relation to the legend node, supported values are [top, left and right]
   * @property {string} [title.wordBreak='none'] - How overflowing title is handled, if it should insert line breaks at word boundries (break-word) or character boundries (break-all)
   * @property {string} [title.hyphens='auto'] - How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak)
   * @property {number} [title.maxLines=2] - Number of allowed lines if title contains line breaks (only applicable with wordBreak)
   * @property {number} [title.lineHeight=1.2] - A multiplier defining the distance between lines (only applicable with wordBreak)
   */

  var legendDef = {
    require: ['chart', 'settings', 'renderer'],
    defaultSettings: {
      displayOrder: 0,
      dock: 'right',
      settings: {
        size: 15,
        length: 0.5,
        maxLengthPx: 250,
        align: 0.5,
        justify: 0,
        padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
        },
        tick: {
          label: null,
          fill: '#595959',
          fontSize: '12px',
          fontFamily: 'Arial',
          maxLengthPx: 100,
          anchor: null, // Use default based on dock
          padding: 5
        },
        title: {
          show: true,
          text: undefined,
          fill: '#595959',
          fontSize: '12px',
          fontFamily: 'Arial',
          maxLengthPx: 100,
          padding: 5,
          maxLines: 2,
          wordBreak: 'none',
          lineHeight: 1.2,
          hyphens: 'auto',
          anchor: null // Use default based on dock
        }
      }
    },
    preferredSize: function preferredSize(opts) {
      var state = this.state;
      state.rect = initRect(this, opts.inner);

      // Init with size of legend
      var prefSize = this.stgns.size;

      // Append paddings
      var paddings = state.isVertical ? this.stgns.padding.left + this.stgns.padding.right : this.stgns.padding.top + this.stgns.padding.bottom;
      prefSize += paddings;

      // Append tick size
      var maxSize = Math.max(opts.inner.width, opts.inner.height);
      if (state.ticks.anchor === 'left' || state.ticks.anchor === 'right') {
        var tHeight = state.ticks.values.reduce(function (sum, t) {
          return sum + t.textMetrics.height;
        }, 0);
        if (tHeight > this.state.legend.length()) {
          return maxSize;
        }
        prefSize += state.ticks.length;
      } else {
        var tWidth = state.ticks.length;
        if (tWidth > this.state.legend.length()) {
          return maxSize;
        }
        prefSize += Math.max.apply(Math, toConsumableArray(state.ticks.values.map(function (t) {
          return t.textMetrics.height;
        })));
      }
      prefSize += this.stgns.tick.padding;

      // Append or use title size
      if (this.stgns.title.show) {
        if (state.title.anchor === 'left' || state.title.anchor === 'right') {
          prefSize = Math.max(state.title.textBounds.height + paddings, prefSize);
        } else {
          prefSize = Math.max(prefSize, state.title.requiredWidth() + paddings);
        }
      }

      this.state.preferredSize = prefSize;
      return prefSize;
    },
    created: function created() {
      this.stgns = this.settings.settings;

      this.state = initState(this);
    },
    beforeUpdate: function beforeUpdate(opts) {
      this.stgns = opts.settings.settings;

      this.state = initState(this);
    },
    beforeRender: function beforeRender(opts) {
      this.state.nodes = [];
      this.state.rect = initRect(this, opts.size);

      if (this.stgns.title.show) {
        var titleNode = createTitleNode(this);
        this.state.nodes.push(titleNode);
      }

      var stopNodes = generateStopNodes(this);
      var rectNode = createLegendRectNode(this, stopNodes);
      var tickNodes = createTickNodes(this, rectNode);

      var targetNode = { // The target node enables range selection component to limit its range to a specific area
        id: 'legend-seq-target',
        type: 'container',
        children: [rectNode, tickNodes]
      };

      this.state.nodes.push(targetNode);
    },
    render: function render() {
      return this.state.nodes;
    }
  };

  function sequentialLegend(picasso) {
    picasso.component('legend-seq', legendDef);
  }

  var CURVES = {
    step: curveStep,
    stepAfter: stepAfter,
    stepBefore: stepBefore,
    linear: curveLinear,
    basis: curveBasis,
    cardinal: curveCardinal.tension(0),
    catmullRom: curveCatmullRom,
    monotonex: monotoneX,
    monotoney: monotoneY,
    natural: curveNatural
  };

  /**
   * @typedef {object}
   * @alias component--line-settings
   */
  var SETTINGS = {
    /**
     * @typedef {object}
     */
    coordinates: {
      /**
       * @type {number} */
      minor: 0.5,
      /**
       * @type {number} */
      major: 0.5,
      /**
       * @type {number=} */
      layerId: 0
    },
    /**
     * @type {string=} */
    orientation: 'horizontal',
    /**
     * @typedef {object} */
    layers: {
      /**
       * @type {string=} */
      curve: 'linear',
      /**
       * @type {boolean=} */
      show: true,
      /**
       * @typedef {object} */
      line: {
        /**
         * @type {string=} */
        stroke: '#ccc',
        /**
         * @type {number=} */
        strokeWidth: 1,
        /**
         * @type {string=} */
        strokeDasharray: undefined,
        /**
         * @type {number=} */
        opacity: 1,
        /**
         * @type {boolean=} */
        show: true
      },
      /**
       * @typedef {object} */
      area: {
        /**
         * @type {string=} */
        fill: '#ccc',
        /**
         * @type {number=} */
        opacity: 0.8,
        /**
         * @type {boolean=} */
        show: true
      }
    }
  };

  function createDisplayLayer(points, _ref) {
    var generator = _ref.generator,
        item = _ref.item,
        data = _ref.data;
    var fill = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var path = generator(points);
    var d = {
      type: 'path',
      d: path,
      opacity: item.opacity,
      stroke: item.stroke,
      strokeWidth: item.strokeWidth,
      fill: fill || item.fill,
      data: data
    };

    if (item.strokeDasharray) {
      d.strokeDasharray = item.strokeDasharray;
    }

    return d;
  }

  function createDisplayLayers(layers, _ref2) {
    var width = _ref2.width,
        height = _ref2.height,
        missingMinor0 = _ref2.missingMinor0,
        stngs = _ref2.stngs;

    var nodes = [];
    var layerStngs = stngs.layers || {};
    layers.forEach(function (layer) {
      var lineObj = layer.lineObj,
          layerObj = layer.layerObj,
          areaObj = layer.areaObj,
          points = layer.points;


      var areaGenerator = area();
      var lineGenerator = void 0;
      var secondaryLineGenerator = void 0;
      var minor = { size: height, p: 'y' };
      var major = { size: width, p: 'x' };
      if (stngs.orientation === 'vertical') {
        var temp = extend(true, {}, major);
        major = extend(true, {}, minor);
        minor = extend(true, {}, temp);
      }

      areaGenerator[major.p](function (d) {
        return d.major * major.size;
      }) // eslint-disable-line no-unexpected-multiline
      [minor.p + '1'](function (d) {
        return d.minor * minor.size;
      }) // eslint-disable-line no-unexpected-multiline
      [minor.p + '0'](function (d) {
        return d.minor0 * minor.size;
      }) // eslint-disable-line no-unexpected-multiline
      .defined(function (d) {
        return typeof d.minor === 'number' && !isNaN(d.minor);
      }).curve(CURVES[layerObj.curve === 'monotone' ? 'monotone' + major.p : layerObj.curve]);
      lineGenerator = areaGenerator['line' + minor.p.toUpperCase() + '1']();
      secondaryLineGenerator = areaGenerator['line' + minor.p.toUpperCase() + '0']();

      // area layer
      if (layerStngs.area && areaObj.show !== false) {
        nodes.push(createDisplayLayer(points, {
          data: layer.firstPoint,
          item: areaObj,
          generator: areaGenerator
        }));
      }

      // main line layer
      if (lineObj && lineObj.show !== false) {
        nodes.push(createDisplayLayer(points, {
          data: layer.firstPoint,
          item: lineObj,
          generator: lineGenerator
        }, 'none'));

        // secondary line layer, used only when rendering area
        if (!missingMinor0 && layerStngs.area && areaObj.show !== false) {
          nodes.push(createDisplayLayer(points, {
            data: layer.firstPoint,
            item: lineObj,
            generator: secondaryLineGenerator
          }, 'none'));
        }
      }
    });

    return nodes;
  }

  function resolve$1(_ref3) {
    var data = _ref3.data,
        stngs = _ref3.stngs,
        rect = _ref3.rect,
        resolver = _ref3.resolver,
        style = _ref3.style;
    var width = rect.width,
        height = rect.height;

    var coordinates = resolver.resolve({
      data: data,
      defaults: SETTINGS.coordinates,
      settings: stngs.coordinates || {},
      scaled: {
        major: stngs.orientation === 'vertical' ? height : width,
        minor: stngs.orientation === 'vertical' ? width : height
      }
    });

    // collect points into layers
    var layerIds = {};
    var numLines = 0;
    for (var i = 0; i < coordinates.items.length; i++) {
      var p = coordinates.items[i];
      var lid = p.layerId;
      layerIds[lid] = layerIds[lid] || {
        order: numLines++, id: lid, items: [], firstPoint: p.data
      };
      layerIds[lid].items.push(p);
    }

    var metaLayers = Object.keys(layerIds).map(function (lid) {
      return layerIds[lid];
    });
    var layersData = { items: metaLayers.map(function (layer) {
        return layer.firstPoint;
      }) };
    var layerStngs = stngs.layers || {};

    var layersResolved = resolver.resolve({
      data: layersData,
      defaults: {
        curve: SETTINGS.layers.curve, show: SETTINGS.layers.show
      },
      settings: {
        curve: layerStngs.curve,
        show: layerStngs.show
      }
    });

    var linesResolved = resolver.resolve({
      data: layersData,
      defaults: extend({}, SETTINGS.layers.line, style.line),
      settings: layerStngs.line
    });

    var areasResolved = resolver.resolve({
      data: layersData,
      defaults: extend({}, SETTINGS.layers.area, style.area),
      settings: layerStngs.area
    });

    return {
      coordinates: coordinates,
      metaLayers: metaLayers,
      layers: layersResolved,
      lines: linesResolved,
      areas: areasResolved
    };
  }

  function calculateVisibleLayers(opts) {
    var _resolve = resolve$1(opts),
        metaLayers = _resolve.metaLayers,
        coordinates = _resolve.coordinates,
        layers = _resolve.layers,
        lines = _resolve.lines,
        areas = _resolve.areas;

    var visibleLayers = [];
    metaLayers.forEach(function (layer, ix) {
      var layerObj = layers.items[ix];
      if (layerObj.show === false) {
        return;
      }

      var values = [];
      var points = [];
      var point = void 0;
      var pData = void 0;
      for (var i = 0; i < layer.items.length; i++) {
        point = layer.items[i];
        pData = point.data;
        if (isNaN(point.major)) {
          continue;
        }
        if (opts.missingMinor0) {
          point.minor0 = coordinates.settings.minor.scale ? coordinates.settings.minor.scale(pData.minor0 ? pData.minor0.value : 0) : 0;
        }
        if (!isNaN(point.minor)) {
          values.push(point.minor);
        }
        points.push(point);
      }

      var median = values.sort(function (a, b) {
        return a - b;
      })[Math.floor((values.length - 1) / 2)];

      visibleLayers.push({
        layerObj: layerObj,
        lineObj: lines.items[ix],
        areaObj: areas.items[ix],
        median: median,
        points: points,
        firstPoint: layer.firstPoint
      });
    });

    return visibleLayers;
  }

  var lineMarkerComponent = {
    require: ['chart', 'resolver'],
    defaultSettings: {
      style: {
        area: '$shape',
        line: '$shape-outline'
      }
    },
    created: function created() {
      this.stngs = this.settings.settings || {};
    },
    beforeRender: function beforeRender(_ref4) {
      var size = _ref4.size;

      this.rect = size;
    },
    render: function render(_ref5) {
      var data = _ref5.data;
      var _rect = this.rect,
          width = _rect.width,
          height = _rect.height;

      var missingMinor0 = !this.stngs.coordinates || typeof this.stngs.coordinates.minor0 === 'undefined';

      var visibleLayers = calculateVisibleLayers({
        data: data,
        stngs: this.stngs,
        rect: this.rect,
        resolver: this.resolver,
        style: this.style,
        missingMinor0: missingMinor0
      });

      visibleLayers.sort(function (a, b) {
        return a.median - b.median;
      });

      // generate visuals
      return createDisplayLayers(visibleLayers, {
        width: width,
        height: height,
        missingMinor0: missingMinor0,
        stngs: this.stngs
      });
    }
  };

  /**
   * @typedef {object} component--line
   */

  /**
   * @type {string}
   * @memberof component--line
   */
  var type$3 = 'line';

  function pointMarker$1(picasso) {
    picasso.component(type$3, lineMarkerComponent);
  }

  /**
   * @typedef {object} component--brush-area-brush
   * @property {string} key - Component key
   * @property {string[]} [contexts] - Name of the brushing contexts to affect
   * @property {string[]} [data] - The mapped data properties to add to the brush
   * @property {string} [action='set'] - Type of action to respond with
   */

  /**
    * @typedef {object}
    * @alias component--brush-area-settings
    */
  var DEFAULT_SETTINGS$7 = {
    /**
     * @type {object}
     */
    brush: {
      /**
      * @type {Array<component--brush-area-brush>}
      */
      components: []
    }
  };

  /**
   * Transform the incoming event into point in the local coordinate system. That is the coordinate system of the component.
   * @private
   * @param {object} ctx - Context
   * @param {object} event - Incoming event, either native event or hammer event
   * @param {boolean} clamp - True to clamp the point inside the component bounds
   * @returns {point}
   */
  function getLocalPoint(ctx, event) {
    var clamp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var x = void 0;
    var y = void 0;

    if (_typeof(event.center) === 'object') {
      x = event.center.x;
      y = event.center.y;
    } else {
      x = event.clientX;
      y = event.clientY;
    }

    var localX = x - ctx.state.boundingRect.left;
    var localY = y - ctx.state.boundingRect.top;

    return {
      x: clamp ? Math.max(0, Math.min(localX, ctx.rect.width)) : localX,
      y: clamp ? Math.max(0, Math.min(localY, ctx.rect.height)) : localY
    };
  }

  /**
   * Transform a local point into a point in the chart coordinate system.
   * @private
   * @param {object} ctx - Context
   * @param {object} p - Point to transform
   * @returns {point}
   */
  function localToChartPoint(ctx, p) {
    return {
      x: p.x + ctx.rect.x,
      y: p.y + ctx.rect.y
    };
  }

  /**
   * Extract and apply default brush configuration.
   * @private
   * @param {object} settings
   * @returns {object[]} An Array of brush configurations
   */
  function getBrushConfig$1(settings) {
    return settings.settings.brush.components.map(function (b) {
      return {
        key: b.key,
        contexts: b.contexts,
        data: b.data,
        action: b.action || 'set'
      };
    });
  }

  /**
   * End all active brush contexts.
   * @private
   * @param {oject} state
   * @param {object} chart - Chart instance
   */
  function doEndBrush(state, chart) {
    state.brushConfig.forEach(function (config) {
      if (Array.isArray(config.contexts)) {
        config.contexts.forEach(function (context) {
          chart.brush(context).end();
        });
      }
    });
  }

  /**
   * Convert two points into a rectangle.
   * @private
   * @param {point} p0
   * @param {point} p1
   * @returns {rect}
   */
  function toRect(p0, p1) {
    var xMin = Math.min(p0.x, p1.x);
    var yMin = Math.min(p0.y, p1.y);
    var xMax = Math.max(p0.x, p1.x);
    var yMax = Math.max(p0.y, p1.y);

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin,
      height: yMax - yMin
    };
  }

  /**
   * Perform a brush on the given area.
   * @private
   * @param {object} ctx
   */
  function doAreaBrush(ctx) {
    if (ctx.state.active) {
      var start = localToChartPoint(ctx, ctx.state.start);
      var end = localToChartPoint(ctx, ctx.state.end);

      var shapes = ctx.chart.shapesAt(toRect(start, end), { components: ctx.state.brushConfig });
      ctx.chart.brushFromShapes(shapes, { components: ctx.state.brushConfig });
    }
  }

  function render$3(ctx) {
    ctx.renderer.render([extend({ type: 'rect' }, toRect(ctx.state.start, ctx.state.end), ctx.style.area)]);
  }

  function resetState$1() {
    return {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      active: false
    };
  }

  var definition = {
    require: ['chart', 'renderer'],
    defaultSettings: {
      displayOrder: 99,
      settings: DEFAULT_SETTINGS$7,
      style: {
        area: '$selection-area-target'
      }
    },
    on: {
      areaStart: function areaStart(e) {
        this.start(e);
      },
      areaMove: function areaMove(e) {
        this.move(e);
      },
      areaEnd: function areaEnd(e) {
        this.end(e);
      },
      areaCancel: function areaCancel() {
        this.cancel();
      }
    },
    created: function created() {
      this.state = resetState$1();
    },
    preferredSize: function preferredSize() {
      return 0;
    },
    render: function render() {},
    beforeRender: function beforeRender(_ref) {
      var size = _ref.size;

      this.rect = size;
    },
    start: function start(e) {
      this.state.boundingRect = this.renderer.element().getBoundingClientRect();
      var p = getLocalPoint(this, e, false);

      // Require event to be inside the component bounds
      if (!NarrowPhaseCollision.testRectPoint({
        x: 0, y: 0, width: this.rect.width, height: this.rect.height
      }, p)) {
        return;
      }

      this.state.brushConfig = getBrushConfig$1(this.settings);
      this.state.start = getLocalPoint(this, e);
      this.state.active = true;
    },
    move: function move(e) {
      if (!this.state.active) {
        return;
      }

      this.state.end = getLocalPoint(this, e);

      doAreaBrush(this);
      render$3(this);
    },
    end: function end() {
      if (!this.state.active) {
        return;
      }

      this.state = resetState$1();
      this.renderer.render([]);
    },
    cancel: function cancel() {
      if (!this.state.active) {
        return;
      }
      doEndBrush(this.state, this.chart);
      this.state = resetState$1();
      this.renderer.render([]);
    }
  };

  function areaBrush(picasso) {
    picasso.component('brush-area', definition);
  }

  var components = [box$1, pointMarker, pie$1, gridLine, refLine, axis, text, scrollbar, rangeBrush, rangeBrush$1, lassoBrush, labels, categoricalLegend, sequentialLegend, pointMarker$1, areaBrush];

  var Node = function () {
    /**
     * @private
     */
    function Node(type) {
      classCallCheck(this, Node);

      this._parent = null;
      this._children = [];
      this._ancestors = null;
      this.type = type;
      this.data = null;
    }

    /**
     * Detaches this node from its parent, if such exists.
     * @returns {Node}
     */


    createClass(Node, [{
      key: "detach",
      value: function detach() {
        if (this._parent) {
          this._parent.removeChild(this);
        }
        return this;
      }

      /**
       * Parent of this node.
       * @readonly
       * @type {Node}
       */

    }, {
      key: "equals",


      /**
       *
       * @returns {Boolean}
       */
      value: function equals(n) {
        var children = this.children;
        var nChildren = n.children;
        if (children.length !== nChildren.length) {
          return false;
        }
        // Requires deterministic child order
        for (var i = 0; i < children.length; i++) {
          if (!children[i].equals(nChildren[i])) {
            return false;
          }
        }
        return true;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          type: this.type,
          children: this.children.map(function (ch) {
            return ch.toJSON();
          })
        };
      }
    }, {
      key: "parent",
      get: function get$$1() {
        return this._parent;
      }

      /**
       * Checks whether this node is a branch.
       *
       * True if this node has children, false otherwise.
       * @readonly
       * @type {Boolean}
       */

    }, {
      key: "isBranch",
      get: function get$$1() {
        return this._children && this._children.length;
      }

      /**
       * Children of this node.
       * @readonly
       * @type {Node[]}
       */

    }, {
      key: "children",
      get: function get$$1() {
        return this._children;
      }

      /**
       * Ancestors of this node, including parent.
       * @readonly
       * @type {Node[]}
       */

    }, {
      key: "ancestors",
      get: function get$$1() {
        if (!this._ancestors) {
          var p = this._parent;
          this._ancestors = p ? [p].concat(p.ancestors) : [];
        }

        return this._ancestors;
      }

      /**
       * Descendants of this node.
       * @readonly
       * @type {Node[]}
       */

    }, {
      key: "descendants",
      get: function get$$1() {
        var r = [],
            i = void 0,
            len = void 0,
            c = void 0;

        for (i = 0, len = this._children.length; i < len; i++) {
          c = this._children[i];
          r.push(c);

          if (c._children.length) {
            r = r.concat(c.descendants);
          }
        }
        return r;
      }
    }]);
    return Node;
  }();

  /**
   * Construct a new GeoRect instance
   * @private
   */

  var GeoRect = function () {
    function GeoRect() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$x = _ref.x,
          x = _ref$x === undefined ? 0 : _ref$x,
          _ref$y = _ref.y,
          y = _ref$y === undefined ? 0 : _ref$y,
          _ref$width = _ref.width,
          width = _ref$width === undefined ? 0 : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === undefined ? 0 : _ref$height,
          _ref$minWidth = _ref.minWidth,
          minWidth = _ref$minWidth === undefined ? 0 : _ref$minWidth,
          _ref$minHeight = _ref.minHeight,
          minHeight = _ref$minHeight === undefined ? 0 : _ref$minHeight;

      classCallCheck(this, GeoRect);

      this.set({
        x: x, y: y, width: width, height: height, minWidth: minWidth, minHeight: minHeight
      });
    }

    createClass(GeoRect, [{
      key: 'set',
      value: function set$$1() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$x = _ref2.x,
            x = _ref2$x === undefined ? 0 : _ref2$x,
            _ref2$y = _ref2.y,
            y = _ref2$y === undefined ? 0 : _ref2$y,
            _ref2$width = _ref2.width,
            width = _ref2$width === undefined ? 0 : _ref2$width,
            _ref2$height = _ref2.height,
            height = _ref2$height === undefined ? 0 : _ref2$height,
            _ref2$minWidth = _ref2.minWidth,
            minWidth = _ref2$minWidth === undefined ? 0 : _ref2$minWidth,
            _ref2$minHeight = _ref2.minHeight,
            minHeight = _ref2$minHeight === undefined ? 0 : _ref2$minHeight;

        this.type = 'rect';

        if (width >= 0) {
          this.x = x;
          this.width = Math.max(width, minWidth);
        } else {
          this.x = x + Math.min(width, -minWidth);
          this.width = -Math.min(width, -minWidth);
        }

        if (height >= 0) {
          this.y = y;
          this.height = Math.max(height, minHeight);
        } else {
          this.y = y + Math.min(height, -minHeight);
          this.height = -Math.min(height, -minHeight);
        }
      }

      /**
       * @param {point} p
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(p) {
        return NarrowPhaseCollision.testRectPoint(this, p);
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        var line = pointsToLine(points);
        return NarrowPhaseCollision.testRectLine(this, line);
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        var rect = pointsToRect(points);
        return NarrowPhaseCollision.testRectRect(this, rect);
      }

      /**
       * @param {circle} c
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(c) {
        return NarrowPhaseCollision.testCircleRect(c, this);
      }

      /**
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        return NarrowPhaseCollision.testPolygonRect(polygon, this);
      }

      /**
       * Get the points
       * @returns {point[]}
       */

    }, {
      key: 'points',
      value: function points() {
        return [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }, { x: this.x, y: this.y + this.height }];
      }
    }]);
    return GeoRect;
  }();

  function create$4() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeoRect, [null].concat(args)))();
  }

  /**
   * Construct a new GeoCircle instance
   * @private
   */

  var GeoCircle = function () {
    function GeoCircle() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$cx = _ref.cx,
          cx = _ref$cx === undefined ? 0 : _ref$cx,
          _ref$cy = _ref.cy,
          cy = _ref$cy === undefined ? 0 : _ref$cy,
          _ref$r = _ref.r,
          r = _ref$r === undefined ? 0 : _ref$r,
          _ref$minRadius = _ref.minRadius,
          minRadius = _ref$minRadius === undefined ? 0 : _ref$minRadius;

      classCallCheck(this, GeoCircle);

      this.set({
        cx: cx, cy: cy, r: r, minRadius: minRadius
      });
    }

    createClass(GeoCircle, [{
      key: 'set',
      value: function set$$1() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$cx = _ref2.cx,
            cx = _ref2$cx === undefined ? 0 : _ref2$cx,
            _ref2$cy = _ref2.cy,
            cy = _ref2$cy === undefined ? 0 : _ref2$cy,
            _ref2$r = _ref2.r,
            r = _ref2$r === undefined ? 0 : _ref2$r,
            _ref2$minRadius = _ref2.minRadius,
            minRadius = _ref2$minRadius === undefined ? 0 : _ref2$minRadius;

        this.type = 'circle';
        this.cx = cx;
        this.cy = cy;
        this.r = Math.max(r, minRadius);
        this.vector = { x: this.cx, y: this.cy };
      }

      /**
       * @param {point} p
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(p) {
        return NarrowPhaseCollision.testCirclePoint(this, p);
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        var line = pointsToLine(points);

        return NarrowPhaseCollision.testCircleLine(this, line);
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        var rect = pointsToRect(points);

        return NarrowPhaseCollision.testCircleRect(this, rect);
      }

      /**
       * @param {circle} c
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(c) {
        return NarrowPhaseCollision.testCircleCircle(this, c);
      }

      /**
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        return NarrowPhaseCollision.testCirclePolygon(this, polygon);
      }

      /**
       * Get the points
       * @returns {point[]}
       */

    }, {
      key: 'points',
      value: function points() {
        return [{
          x: this.cx,
          y: this.cy
        }];
      }
    }]);
    return GeoCircle;
  }();

  function create$5() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeoCircle, [null].concat(args)))();
  }

  /**
   * Construct a new GeoLine instance
   * @private
   */

  var GeoLine = function () {
    function GeoLine() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$x = _ref.x1,
          x1 = _ref$x === undefined ? 0 : _ref$x,
          _ref$y = _ref.y1,
          y1 = _ref$y === undefined ? 0 : _ref$y,
          _ref$x2 = _ref.x2,
          x2 = _ref$x2 === undefined ? 0 : _ref$x2,
          _ref$y2 = _ref.y2,
          y2 = _ref$y2 === undefined ? 0 : _ref$y2,
          _ref$tolerance = _ref.tolerance,
          tolerance = _ref$tolerance === undefined ? 0 : _ref$tolerance;

      classCallCheck(this, GeoLine);

      this.set({
        x1: x1, y1: y1, x2: x2, y2: y2, tolerance: tolerance
      });
    }

    createClass(GeoLine, [{
      key: 'set',
      value: function set$$1() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$x = _ref2.x1,
            x1 = _ref2$x === undefined ? 0 : _ref2$x,
            _ref2$y = _ref2.y1,
            y1 = _ref2$y === undefined ? 0 : _ref2$y,
            _ref2$x2 = _ref2.x2,
            x2 = _ref2$x2 === undefined ? 0 : _ref2$x2,
            _ref2$y2 = _ref2.y2,
            y2 = _ref2$y2 === undefined ? 0 : _ref2$y2,
            _ref2$tolerance = _ref2.tolerance,
            tolerance = _ref2$tolerance === undefined ? 0 : _ref2$tolerance;

        this.type = 'line';
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.tolerance = Math.max(0, Math.round(tolerance));

        this.vectors = this.points();
        this.zeroSize = x1 === x2 && y1 === y2;
      }

      /**
       * @param {point} p
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(p) {
        if (this.tolerance > 0) {
          var c = { cx: p.x, cy: p.y, r: this.tolerance };
          return NarrowPhaseCollision.testCircleLine(c, this);
        }
        return NarrowPhaseCollision.testLinePoint(this, p);
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        var line = pointsToLine(points);
        return NarrowPhaseCollision.testLineLine(this, line);
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        var rect = pointsToRect(points);
        return NarrowPhaseCollision.testRectLine(rect, this);
      }

      /**
       * @param {circle} c
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(c) {
        return NarrowPhaseCollision.testCircleLine(c, this);
      }

      /**
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        return NarrowPhaseCollision.testPolygonLine(polygon, this);
      }

      /**
       * Get the points
       * @returns {point[]}
       */

    }, {
      key: 'points',
      value: function points() {
        return [{ x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 }];
      }
    }]);
    return GeoLine;
  }();

  function create$6() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeoLine, [null].concat(args)))();
  }

  function close(vertices) {
    var first = vertices[0];
    var last = vertices[vertices.length - 1];

    if (first.x !== last.x || first.y !== last.y) {
      vertices.push(first);
    }
  }

  function removeDuplicates(vertices) {
    for (var i = 0; i < vertices.length - 1; i++) {
      var v0 = vertices[i];
      var v1 = vertices[i + 1];
      if (v0.x === v1.x && v0.y === v1.y) {
        vertices.splice(i, 1);
        i--;
      }
    }
  }

  /**
   * Construct a new GeoPolygon instance
   * @private
   */

  var GeoPolygon = function () {
    function GeoPolygon() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$vertices = _ref.vertices,
          vertices = _ref$vertices === undefined ? [] : _ref$vertices;

      classCallCheck(this, GeoPolygon);

      this.set({ vertices: vertices });
    }

    /**
     * Set the vertices.
     * If vertices doesn't close the polygon, a closing vertice is appended.
     * @param {object} input An object with a vertices property
     * @param {point[]} [input.vertices=[]] Vertices are represented as an array of points.
     */


    createClass(GeoPolygon, [{
      key: 'set',
      value: function set$$1() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$vertices = _ref2.vertices,
            vertices = _ref2$vertices === undefined ? [] : _ref2$vertices;

        this.type = 'polygon';
        this.vertices = vertices.slice();
        this.edges = [];

        removeDuplicates(this.vertices);

        if (this.vertices.length <= 2) {
          return;
        }

        close(this.vertices);

        this.xMin = NaN;
        this.yMin = NaN;
        this.xMax = NaN;
        this.yMax = NaN;

        for (var i = 0; i < this.vertices.length; i++) {
          if (i < this.vertices.length - 1) {
            this.edges.push([this.vertices[i], this.vertices[i + 1]]);
          }

          this.xMin = isNaN(this.xMin) ? this.vertices[i].x : Math.min(this.xMin, this.vertices[i].x);
          this.xMax = isNaN(this.xMax) ? this.vertices[i].x : Math.max(this.xMax, this.vertices[i].x);
          this.yMin = isNaN(this.yMin) ? this.vertices[i].y : Math.min(this.yMin, this.vertices[i].y);
          this.yMax = isNaN(this.yMax) ? this.vertices[i].y : Math.max(this.yMax, this.vertices[i].y);
        }

        this._bounds = null;
        this._boundingRect = null;
      }

      /**
       * Check if a point is inside the area of the polygon.
       * Supports convex, concave and self-intersecting polygons (filled area).
       * @param {point} point
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(point) {
        return NarrowPhaseCollision.testPolygonPoint(this, point);
      }

      /**
       * Check if circle is inside the area of the polygon.
       * Supports convex, concave and self-intersecting polygons (filled area).
       * @param {circle} circle
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(circle) {
        return NarrowPhaseCollision.testCirclePolygon(circle, this);
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        return NarrowPhaseCollision.testPolygonLine(this, pointsToLine(points));
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        return NarrowPhaseCollision.testPolygonRect(this, pointsToRect(points));
      }

      /**
       * Check if polygon intersects another polygon.
       * Supports convex, concave and self-intersecting polygons (filled area).
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        // This is a unoptimized solution and should be replaced by a more efficient algorithm.
        if (!NarrowPhaseCollision.testRectRect(this.boundingRect(), polygon.boundingRect())) {
          return false;
        }

        var intersects = false;
        for (var i = 0, len = this.edges.length; i < len; i++) {
          intersects = NarrowPhaseCollision.testPolygonLine(polygon, pointsToLine(this.edges[i]));
          if (intersects === true) {
            break;
          }
        }
        return intersects;
      }

      /**
       * Get the points
       * @returns {point[]}
       */

    }, {
      key: 'points',
      value: function points() {
        return this.vertices;
      }

      /**
       * Get the bounds of the polygon, as an array of points
       * @returns {point[]}
       */

    }, {
      key: 'bounds',
      value: function bounds() {
        if (!this._bounds) {
          this._bounds = [{ x: this.xMin, y: this.yMin }, { x: this.xMax, y: this.yMin }, { x: this.xMax, y: this.yMax }, { x: this.xMin, y: this.yMax }];
        }

        return this._bounds;
      }

      /**
       * Get the bounding rect of the polygon
       * @returns {rect}
       */

    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        if (!this._boundingRect) {
          this._boundingRect = {
            x: this.xMin,
            y: this.yMin,
            width: this.xMax - this.xMin,
            height: this.yMax - this.yMin
          };
        }
        return this._boundingRect;
      }
    }]);
    return GeoPolygon;
  }();

  /**
  * Construct a new GeoPolygon instance
  * @param {object} input An object with a vertices property
  * @param {point[]} [input.vertices=[]] Vertices are represented as an array of points.
  * @returns {GeoPolygon} GeoPolygon instance
  * @private
  */


  function create$7() {
    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeoPolygon, [null].concat(a)))();
  }

  function pointsAreNotEqual(p0, p1) {
    return p0.x !== p1.x || p0.y !== p1.y;
  }

  /**
   * Construct a new GeoPolyline instance
   * @private
   */

  var GeoPolyline = function () {
    function GeoPolyline() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$points = _ref.points,
          points = _ref$points === undefined ? [] : _ref$points;

      classCallCheck(this, GeoPolyline);

      this.set({ points: points });
    }

    createClass(GeoPolyline, [{
      key: 'set',
      value: function set$$1() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref2$points = _ref2.points,
            points = _ref2$points === undefined ? [] : _ref2$points;

        this.type = 'polyline';
        this.segments = [];
        this._points = points.slice();

        if (this._points.length > 1) {
          for (var i = 0, len = this._points.length - 1; i < len; i++) {
            if (pointsAreNotEqual(this._points[i], this._points[i + 1])) {
              this.segments.push({
                x1: this._points[i].x,
                y1: this._points[i].y,
                x2: this._points[i + 1].x,
                y2: this._points[i + 1].y
              });
            }
          }
        }
      }

      /**
       * @param {point} point
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(point) {
        return this.segments.some(function (line) {
          return NarrowPhaseCollision.testLinePoint(line, point);
        });
      }

      /**
       * @param {circle} circle
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(circle) {
        return this.segments.some(function (line) {
          return NarrowPhaseCollision.testCircleLine(circle, line);
        });
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        var testLine = pointsToLine(points);
        return this.segments.some(function (line) {
          return NarrowPhaseCollision.testLineLine(line, testLine);
        });
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        var rect = pointsToRect(points);
        return this.segments.some(function (line) {
          return NarrowPhaseCollision.testRectLine(rect, line);
        });
      }

      /**
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        // This is a unoptimized solution and should be replaced by a more efficient algorithm.
        return this.segments.some(function (line) {
          return NarrowPhaseCollision.testPolygonLine(polygon, line);
        });
      }

      /**
       * Get the points
       * @returns {point[]}
       */

    }, {
      key: 'points',
      value: function points() {
        return this._points;
      }
    }]);
    return GeoPolyline;
  }();

  function create$8() {
    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeoPolyline, [null].concat(a)))();
  }

  var reg$3 = registryFactory();

  reg$3.add('rect', create$4);
  reg$3.add('circle', create$5);
  reg$3.add('line', create$6);
  reg$3.add('polygon', create$7);
  reg$3.add('polyline', create$8);

  function create$9(type, input) {
    // eslint-disable-line import/prefer-default-export
    return reg$3.get(type)(input);
  }

  /**
   * @typedef {object} rect
   * @property {number} x - X-coordinate
   * @property {number} y - Y-coordinate
   * @property {number} width - Width
   * @property {number} height - Height
   */

  /**
   * @typedef {object} line
   * @property {number} x1 - Start x-coordinate
   * @property {number} y1 - Start y-coordinate
   * @property {number} x2 - End x-coordinate
   * @property {number} y2 - End y-coordinate
   */

  /**
   * @typedef {object} point
   * @property {number} x - X-coordinate
   * @property {number} y - Y-coordinate
   */

  /**
   * @typedef {object} circle
   * @property {number} cx - Center x-coordinate
   * @property {number} cy - Center y-coordinate
   * @property {number} r - Circle radius
   */

  /**
   * @typedef {object} polygon
   * @property {Array<point>} points - Array of connected points
   */

  /**
   * @typedef {object} polyline
   * @property {Array<point>} points - Array of connected points
   */

  /**
   * @typedef {object} path
   * @property {string} d - Path definition
   */

  /**
   * Construct a new GeometryCollection instance
   * @private
    */

  var GeometryCollection = function () {
    function GeometryCollection() {
      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      classCallCheck(this, GeometryCollection);

      this.set(collection);
    }

    createClass(GeometryCollection, [{
      key: 'set',
      value: function set$$1() {
        var _this = this;

        var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.geometries = [];
        collection.forEach(function (geo) {
          var geoInstance = create$9(geo.type, geo);
          if (geoInstance) {
            _this.geometries.push(geoInstance);
          }
        });
      }

      /**
       * @param {point} p
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'containsPoint',
      value: function containsPoint(p) {
        return this.geometries.some(function (geo) {
          return geo.containsPoint(p);
        });
      }

      /**
       * @param {point[]} points - Line start and end point as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsLine',
      value: function intersectsLine(points) {
        return this.geometries.some(function (geo) {
          return geo.intersectsLine(points);
        });
      }

      /**
       * @param {point[]} points - Rect vertices as an array of points
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsRect',
      value: function intersectsRect(points) {
        return this.geometries.some(function (geo) {
          return geo.intersectsRect(points);
        });
      }

      /**
       * @param {circle} c
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(c) {
        return this.geometries.some(function (geo) {
          return geo.intersectsCircle(c);
        });
      }

      /**
       * @param {GeoPolygon} polygon
       * @returns {boolean} True if there is an intersection, false otherwise
       */

    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        return this.geometries.some(function (geo) {
          return geo.intersectsPolygon(polygon);
        });
      }
    }]);
    return GeometryCollection;
  }();

  function create$a() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GeometryCollection, [null].concat(args)))();
  }

  var Matrix = function () {
    /**
     * Creates a matrix with identity values.
     * @private
     */
    function Matrix() {
      classCallCheck(this, Matrix);

      this._elements = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

      this._stack = [];
    }

    /**
     * Creates a new matrix with a copy of the current values.
     */


    createClass(Matrix, [{
      key: 'clone',
      value: function clone() {
        var mt = new Matrix();
        return mt.multiply(this);
      }

      /**
      * Sets the matrix values
      * @param {Number[][]} arr A 3x3 array.
      */

    }, {
      key: 'set',
      value: function set$$1(arr) {
        this._elements = arr;
        return this;
      }

      /**
      * Saves the current matrix values to a stack.
      */

    }, {
      key: 'save',
      value: function save() {
        this._stack.push(this.elements);
        return this;
      }

      /**
      * Sets the current matrix values to the last ones saved on to the stack.
      */

    }, {
      key: 'restore',
      value: function restore() {
        if (this._stack.length) {
          this._elements = this._stack.pop(); // TODO - use a copy instead
        }
        return this;
      }

      /**
      * Adds a scalar value to each element in the matrix.
      * @param {Number} value
      */

    }, {
      key: 'add',
      value: function add(value) {
        // assume scalar
        var i = void 0,
            j = void 0;
        for (i = 0; i < this._elements.length; i++) {
          for (j = 0; j < this._elements[i].length; j++) {
            this._elements[i][j] += value;
          }
        }
        return this;
      }

      /**
      * Translates the current matrix along the x and y axis.
      * @param {Number} x
      * @param {Number} y
      */

    }, {
      key: 'translate',
      value: function translate(x, y) {
        this.multiply([[1, 0, x], [0, 1, y], [0, 0, 1]]);
        return this;
      }

      /**
      * Rotates the current matrix.
      * @param {Number} radianAngle Angle in radians.
      */

    }, {
      key: 'rotate',
      value: function rotate(radianAngle) {
        var cos = Math.cos(-radianAngle),
            sin = Math.sin(-radianAngle);
        this.multiply([[cos, sin, 0], [-sin, cos, 0], [0, 0, 1]]);
        return this;
      }

      /**
      *
      * If value is a number; multiplies each element in the matrix by the given value.
      * If value is a matrix; multiplies the two matrices.
      * @param {Number|Array|Matrix} value
      */

    }, {
      key: 'multiply',
      value: function multiply(value) {
        var i = void 0,
            j = void 0,
            m = void 0,
            k = void 0;
        if (value instanceof Matrix) {
          value = value._elements;
        }
        if (Array.isArray(value)) {
          // matrix multiplication
          m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
          for (i = 0; i < this._elements.length; i++) {
            // row
            for (j = 0; j < this._elements[i].length; j++) {
              // column
              for (k = 0; k < 3; k++) {
                // row
                m[i][j] += this._elements[i][k] * value[k][j];
              }
            }
          }
          this._elements = m;
        } else {
          // scalar multiplication
          for (i = 0; i < this._elements.length; i++) {
            for (j = 0; j < this._elements[i].length; j++) {
              this._elements[i][j] *= value;
            }
          }
        }
        return this;
      }

      /**
      * Scales the matrix along x and y axis.
      * @param {Number} x The value to scale the matrix with along the x direction
      * @param {Number} [y=x] The value to scale the matrix with along the y direction.
      */

    }, {
      key: 'scale',
      value: function scale(x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

        // if ( arguments.length < 2 || typeof y === "undefined" ) {
        //  y = x;
        // }

        this.multiply([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
        return this;
      }

      /**
       * Multiples the matrix with the supplied transformation values
       * @param {Number} a Horizontal scaling
       * @param {Number} b Horizontal skewing
       * @param {Number} c Vertical skewing
       * @param {Number} d Vertical scaling
       * @param {Number} e Horizontal moving
       * @param {Number} f Vertical scaling
       */

    }, {
      key: 'transform',
      value: function transform(a, b, c, d, e, f) {
        this.multiply([[a, c, e], [b, d, f], [0, 0, 1]]);

        return this;
      }

      /**
      * Gets the value of the determinant.
      * @return {Number}
      */

    }, {
      key: 'determinant',
      value: function determinant() {
        var a = this._elements[0][0],
            b = this._elements[0][1],
            c = this._elements[0][2],
            d = this._elements[1][0],
            e = this._elements[1][1],
            f = this._elements[1][2],
            g = this._elements[2][0],
            h = this._elements[2][1],
            i = this._elements[2][2],
            p = 0;

        p = a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;

        return p;
      }

      /**
      * Inverts the matrix.
      */

    }, {
      key: 'invert',
      value: function invert() {
        var dt = this.determinant(),
            a = this._elements[0][0],
            b = this._elements[0][1],
            c = this._elements[0][2],
            d = this._elements[1][0],
            e = this._elements[1][1],
            f = this._elements[1][2],
            g = this._elements[2][0],
            h = this._elements[2][1],
            k = this._elements[2][2];

        this._elements = [[e * k - f * h, c * h - b * k, b * f - c * e], [f * g - d * k, a * k - c * g, c * d - a * f], [d * h - e * g, g * b - a * h, a * e - b * d]];

        this.multiply(1 / dt); // TODO - handle when dt === 0 ?
        return this;
      }

      /**
      * Transposes the elements of the matrix.
      */

    }, {
      key: 'transpose',
      value: function transpose() {
        var m = Object.create(this._elements); // ?
        this._elements = [[m[0][0], m[1][0], m[2][0]], [m[0][1], m[1][1], m[2][1]], [m[0][2], m[1][2], m[2][2]]];
        return this;
      }

      /**
      * Resets the inner elements of the matrix to identity values.
      */

    }, {
      key: 'identity',
      value: function identity() {
        this._elements = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        return this;
      }
    }, {
      key: 'toString',
      value: function toString() {
        return '' + this._elements.map(function (r) {
          return r.join('\t');
        }).join('\n');
      }
    }, {
      key: 'isIdentity',
      value: function isIdentity() {
        var m = this._elements;
        return m[0][0] === 1 && m[0][1] === 0 && m[0][2] === 0 && m[1][0] === 0 && m[1][1] === 1 && m[1][2] === 0 && m[2][0] === 0 && m[2][1] === 0 && m[2][2] === 1;
      }

      /**
       * Transforms the given point by this matrix and returns a new point
       */

    }, {
      key: 'transformPoint',
      value: function transformPoint(p) {
        var vec = [p.x, p.y, 1],
            i = void 0,
            j = void 0,
            e = this._elements,
            m = [0, 0, 0];
        for (i = 0; i < this._elements.length; i++) {
          // row
          for (j = 0; j < this._elements[i].length; j++) {
            // column
            m[i] += vec[j] * e[i][j];
          }
        }

        return { x: m[0], y: m[1] };
      }

      /**
       * Transforms the given points by this matrix and returns the new points
       */

    }, {
      key: 'transformPoints',
      value: function transformPoints(array) {
        var vec = void 0,
            i = void 0,
            j = void 0,
            k = void 0,
            m = void 0,
            e = this._elements,
            ret = [];

        for (k = 0; k < array.length; k++) {
          vec = [array[k].x, array[k].y, 1];
          m = [0, 0, 0];

          for (i = 0; i < this._elements.length; i++) {
            // row
            for (j = 0; j < this._elements[i].length; j++) {
              // column
              m[i] += vec[j] * e[i][j];
            }
          }
          ret.push({ x: m[0], y: m[1] });
        }
        return ret;
      }
    }, {
      key: 'elements',
      get: function get$$1() {
        var m = this._elements;
        return [[m[0][0], m[0][1], m[0][2]], [m[1][0], m[1][1], m[1][2]], [m[2][0], m[2][1], m[2][2]]];
      }
    }]);
    return Matrix;
  }();

  var transformRegEx = /(translate|scale|rotate|matrix)\(([0-9,.eE+-\s]+)(?:,|\s?)+\)/g;

  function parseTransform(transform) {
    var m = void 0,
        commands = [];
    while ((m = transformRegEx.exec(transform)) !== null) {
      // eslint-disable-line no-cond-assign
      var argsStr = m[2].trim();
      var args = argsStr.indexOf(',') === -1 ? argsStr.split(' ') : argsStr.split(',');

      commands.push({
        cmd: m[1],
        args: args.filter(function (a) {
          return a.trim().length > 0;
        }).map(function (a) {
          return Number(a);
        })
      });
    }

    return commands;
  }

  function resolveRotateCmd(matrix, transform) {
    var radians = transform.args[0] * (Math.PI / 180);

    if (transform.args.length > 2) {
      var x = transform.args[1];
      var y = transform.args[2];
      matrix.translate(x, y);
      matrix.rotate(radians);
      matrix.translate(-x, -y);
    } else if (transform.args.length === 1) {
      matrix.rotate(radians);
    }
  }

  function resolveScaleCmd(matrix, transform) {
    var x = transform.args[0];
    var y = isNaN(transform.args[1]) ? transform.args[0] : transform.args[1];
    matrix.scale(x, y);
  }

  function resolveTranslateCmd(matrix, transform) {
    var x = transform.args[0];
    var y = isNaN(transform.args[1]) ? 0 : transform.args[1];
    matrix.translate(x, y);
  }

  function resolveMatrixCmd(matrix, transform) {
    if (transform.args.length >= 6) {
      matrix.transform.apply(matrix, toConsumableArray(transform.args));
    }
  }

  function resolveTransform(t, matrix) {
    var transforms = parseTransform(t);
    var transform = void 0;

    for (var i = 0, len = transforms.length; i < len; i++) {
      transform = transforms[i];

      if (transform.cmd === 'rotate') {
        resolveRotateCmd(matrix, transform);
      } else if (transform.cmd === 'scale') {
        resolveScaleCmd(matrix, transform);
      } else if (transform.cmd === 'matrix') {
        resolveMatrixCmd(matrix, transform);
      } else if (transform.cmd === 'translate') {
        resolveTranslateCmd(matrix, transform);
      }
    }
  }

  /* eslint-disable no-useless-escape */

  var SELECTOR_MAPS = {
    type: /^\w[\w-]+/,
    attr: /^\[\w(?:[\w\._-]+)?(?:[!]?=['\"][\w\s*#_-]*['\"])?\]/,
    universal: /^(\*)/,
    tag: /^\.(\w+)/
  };

  var FILTERS = {
    type: function type(c, objects) {
      // eslint-disable-line arrow-body-style
      return objects.filter(function (o) {
        var type = o.type;

        if (type) {
          return type.toLowerCase() === c.toLowerCase();
        }
        return false;
      });
    },

    attr: function attr(_attr, operator, value, objects) {
      // eslint-disable-line arrow-body-style
      return objects.filter(function (o) {
        var v = o.attrs[_attr];

        if (!operator) {
          // TODO handle undefined differently for != operator? As display object may very well have a default rendering color
          return typeof v !== 'undefined';
        } else if (typeof v === 'undefined') {
          return false;
        }

        switch (operator) {
          case '=':
            return value === String(v);
          case '!=':
            return value !== String(v);
          default:
            return false;
        }
      });
    },

    universal: function universal(objects) {
      return objects;
    },

    tag: function tag(c, objects) {
      // eslint-disable-line arrow-body-style
      return objects.filter(function (o) {
        var tag = o.tag;
        if (tag) {
          return tag.indexOf(c.replace('.', '')) !== -1;
        }
        return false;
      });
    }
  };

  /**
  * Filters out objects of given type and value
  * @ignore
  * @example
  * filter(
  *   {type:'type', value:'Circle'},
  *   [new Circle(), new Rectangle()]
  * )
  * // [Circle]
  * @param {Object} token
  * @param {Array} objects
  * @returns {Object[]} Objects that fulfill the type and value
  */
  function filter(token, objects) {
    if (!objects || !objects.length || !token || typeof FILTERS[token.type] !== 'function') {
      return [];
    }

    switch (token.type) {
      case 'type':
        return FILTERS[token.type](token.value, objects);
      case 'attr':
        return FILTERS[token.type](token.attribute, token.operator, token.attributeValue, objects);
      case 'universal':
        return FILTERS[token.type](objects);
      case 'tag':
        return FILTERS[token.type](token.value, objects);
      default:
        return [];
    }
  }

  /**
  * Tokenizes a string into supported selectors
  * @ignore
  *
  * @example
  * tokenize("Circle[color='red']")
  *
  * @param {String} s
  */
  function tokenize(s) {
    var groups = [];
    var sub = void 0;
    var info = void 0;
    var match = void 0;
    var validSelector = void 0;

    s.split(/\s*,\s*/).forEach(function (group) {
      group = group.trim();
      sub = [];
      var selectorMapsIterator = function selectorMapsIterator(key) {
        match = group.match(SELECTOR_MAPS[key]);
        if (match) {
          validSelector = true;
          group = group.slice(match[0].length);
          info = {
            type: key,
            value: match[0]
          };

          if (key === 'attr') {
            // extract parts of attribute from e.g. [color='red'] => (color, =, red)
            match = match[0].match(/\[(\w[\w\._-]+)?(?:([!]?=)['\"]([\w\s#_-]*)['\"])?\]/);
            info.attribute = match[1];
            info.operator = match[2];
            info.attributeValue = match[3];
          }
          sub.push(info);
        }
      };
      while (group) {
        validSelector = false;

        match = group.match(/^\s*([>+~]|\s)\s*/);
        if (match) {
          validSelector = true;
          sub.push({
            type: ' ',
            value: match[0]
          });
          group = group.slice(match[0].length);
        }

        Object.keys(SELECTOR_MAPS).forEach(selectorMapsIterator);

        if (sub && sub.length && groups.indexOf(sub) < 0) {
          groups.push(sub);
        }

        if (!validSelector) {
          break;
        }
      }
    });
    return groups;
  }

  function find(s, object) {
    var result = [];
    var groupResults = [];
    var groups = void 0;
    var descendants = void 0;

    if (object.isBranch) {
      groups = tokenize(s);
      descendants = object.descendants;

      var tokens = void 0;

      var _loop = function _loop(gi, glen) {
        tokens = groups[gi];

        var levels = [];
        var filtered = descendants.slice();
        var hasRemainder = false;
        tokens.reverse().forEach(function (token) {
          if (token.type === ' ') {
            levels.push(filtered);
            filtered = descendants.slice();
            hasRemainder = false;
            return;
          }

          filtered = filter(token, filtered);
          hasRemainder = true;
        });

        if (hasRemainder) {
          levels.push(filtered);
        }

        var selected = levels[0].filter(function (node) {
          var ancestor = node.parent;
          var idx = void 0;

          for (var _i = 1; _i < levels.length; _i++) {
            idx = levels[_i].indexOf(ancestor);
            while (ancestor && idx < 0) {
              ancestor = ancestor.parent;
              idx = levels[_i].indexOf(ancestor);
            }
            if (idx < 0) {
              return false;
            }
          }
          return true;
        });

        groupResults.push(selected);
      };

      for (var gi = 0, glen = groups.length; gi < glen; gi++) {
        _loop(gi, glen);
      }

      for (var i = 0, len = groupResults.length; i < len; i++) {
        for (var ni = 0, nlen = groupResults[i].length; ni < nlen; ni++) {
          if (result.indexOf(groupResults[i][ni]) < 0) {
            result.push(groupResults[i][ni]);
          }
        }
      }
    }

    return result || [];
  }

  var nodeSelector = {
    find: find
  };

  function appendDpi(points, dpi) {
    for (var i = 0, len = points.length; i < len; i++) {
      points[i].x /= dpi;
      points[i].y /= dpi;
    }
  }

  function geometryToDef(geometry, dpi, mvm) {
    var type = geometry.type;
    var points = mvm ? mvm.transformPoints(geometry.points()) : geometry.points();
    appendDpi(points, dpi);
    var def = null;

    if (type === 'rect' || type === 'bounds') {
      def = pointsToRect(points);
      def.type = type;
    } else if (type === 'circle') {
      def = pointsToCircle(points, geometry.r);
      def.type = type;
    } else if (type === 'line') {
      def = pointsToLine(points);
      def.type = type;
    } else if (type === 'polygon' || type === 'polyline') {
      var path = pointsToPath(points, type === 'polygon');
      def = {
        type: 'path',
        d: path
      };
    }

    return def;
  }

  /**
   * @ignore
   * @returns {object} Returns a node definition of the collider
   */
  function colliderToShape(node, dpi) {
    var collider = node.collider();

    if (collider && collider.fn) {
      var mvm = node.modelViewMatrix;
      var isCollection = collider.type === 'collection';

      if (isCollection) {
        var children = collider.fn.geometries.map(function (geometry) {
          return geometryToDef(geometry, dpi, mvm);
        });

        return {
          type: 'container',
          children: children
        };
      }

      return geometryToDef(collider.fn, dpi, mvm);
    }

    return null;
  }

  /**
   * Read-only object representing a node on the scene.
   */

  var SceneNode = function () {
    function SceneNode(node) {
      var _this = this;

      classCallCheck(this, SceneNode);

      this._bounds = node.boundingRect ? function () {
        var withTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        return node.boundingRect(withTransform);
      } : function () {
        return {
          x: 0, y: 0, width: 0, height: 0
        };
      };
      this._attrs = node.attrs;
      this._type = node.type;
      this._data = node.data;
      this._dpi = node.stage ? node.stage.dpi : 1;
      this._collider = function () {
        return colliderToShape(node, _this._dpi);
      };
      this._desc = node.desc;
      this._tag = node.tag;
    }

    /**
     * Node type
     * @type {string}
     */


    createClass(SceneNode, [{
      key: 'type',
      get: function get$$1() {
        return this._type;
      }

      /**
       * Get the associated data
       * @type {any}
       */

    }, {
      key: 'data',
      get: function get$$1() {
        return this._data;
      }

      /**
       * Node attributes
       * @type {object}
       */

    }, {
      key: 'attrs',
      get: function get$$1() {
        return this._attrs;
      }

      /**
       * Element the scene is attached to
       * @type {HTMLElement}
       * @private
       */

    }, {
      key: 'element',
      set: function set$$1(e) {
        this._element = e;
      }

      /**
       * Element the scene is attached to
       * @type {HTMLElement}
       */
      ,
      get: function get$$1() {
        return this._element;
      }

      /**
      * Key of the component this shape belongs to
      * @type {string}
      * @private
      */

    }, {
      key: 'key',
      set: function set$$1(k) {
        this._key = k;
      }

      /**
      * Key of the component this shape belongs to
      * @type {string}
      */
      ,
      get: function get$$1() {
        return this._key;
      }

      /**
       * Bounding rectangle of the node. After any transform has been applied, if any, but excluding scaling transform related to devicePixelRatio.
       * Origin is in the top-left corner of the scene element.
       * @type {rect}
       */

    }, {
      key: 'bounds',
      get: function get$$1() {
        var bounds = this._bounds();
        bounds.x /= this._dpi;
        bounds.y /= this._dpi;
        bounds.width /= this._dpi;
        bounds.height /= this._dpi;
        return bounds;
      }

      /**
       * Bounding rectangle of the node withing it's local coordinate system.
       * Origin is in the top-left corner of the scene element.
       * @type {rect}
       */

    }, {
      key: 'localBounds',
      get: function get$$1() {
        var bounds = this._bounds(false);
        return bounds;
      }

      /**
       * Collider of the node. Transform on the node has been applied to the collider shape, if any, but excluding scaling transform related to devicePixelRatio.
       * Origin is in the top-left corner of the scene element.
       *
       * If node has no collider, null is returned.
       * @type {line|rect|circle|path}
       */

    }, {
      key: 'collider',
      get: function get$$1() {
        return this._collider();
      }

      /**
       * Node description
       * @type {object}
       */

    }, {
      key: 'desc',
      get: function get$$1() {
        return this._desc;
      }

      /**
       * Node tag
       * @type {string}
       */

    }, {
      key: 'tag',
      get: function get$$1() {
        return this._tag;
      }
    }]);
    return SceneNode;
  }();

  function create$b() {
    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(SceneNode, [null].concat(a)))();
  }

  var Collision = function () {
    function Collision(node) {
      classCallCheck(this, Collision);

      this._node = create$b(node);
      this._parent = null;
      this._input = null;
    }

    createClass(Collision, [{
      key: 'node',
      get: function get$$1() {
        return this._node;
      }
    }, {
      key: 'parent',
      set: function set$$1(p) {
        this._parent = p;
      },
      get: function get$$1() {
        return this._parent;
      }
    }, {
      key: 'input',
      set: function set$$1(i) {
        this._input = i;
      },
      get: function get$$1() {
        return this._input;
      }
    }]);
    return Collision;
  }();

  function create$c() {
    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Collision, [null].concat(a)))();
  }

  function appendParentNode(node, collision) {
    var p = node.parent;

    if (p && p.type !== 'stage') {
      collision.parent = create$c(p);

      var pp = p.parent;
      if (pp && pp.type !== 'stage') {
        appendParentNode(pp, collision.parent);
      }
    }
  }

  function appendInputShape(shape, collisions) {
    for (var i = 0, len = collisions.length; i < len; i++) {
      collisions[i].input = shape;
    }
  }

  function resolveFrontChildCollision(node, type, input) {
    var num = node.descendants.length;

    for (var i = num - 1; i >= 0; i--) {
      var desc = node.descendants[i];
      var collider = desc._collider;

      if (collider && collider.fn[type](input)) {
        var collision = create$c(desc);

        appendParentNode(desc, collision);

        return collision;
      }
    }
    return null;
  }

  function resolveBoundsCollision(node, type, input) {
    var collider = node._collider.fn;
    var transformedInput = input;

    if (Array.isArray(input.vertices)) {
      transformedInput = create$7(input); // TODO Shouldn't have to do this here, currently its beacause a collision algorithm optimization, i.e. caching of polygon bounds
    }

    if (collider[type](transformedInput)) {
      var c = create$c(node);

      appendParentNode(node, c);

      return c;
    }
    return null;
  }

  function resolveGeometryCollision(node, type, input) {
    var transformedInput = {};
    if (node.modelViewMatrix) {
      if (Array.isArray(input)) {
        // Rect or Line
        transformedInput = node.inverseModelViewMatrix.transformPoints(input);
      } else if (!isNaN(input.r)) {
        // Circle
        var p = { x: input.cx, y: input.cy };

        var _node$inverseModelVie = node.inverseModelViewMatrix.transformPoint(p);

        transformedInput.cx = _node$inverseModelVie.x;
        transformedInput.cy = _node$inverseModelVie.y;

        transformedInput.r = input.r;
      } else if (Array.isArray(input.vertices)) {
        // Polygon
        transformedInput.vertices = node.inverseModelViewMatrix.transformPoints(input.vertices);
      } else {
        // Point
        transformedInput = node.inverseModelViewMatrix.transformPoint(input);
      }
    } else {
      transformedInput = input;
    }

    if (Array.isArray(transformedInput.vertices)) {
      transformedInput = create$7(transformedInput); // TODO Shouldn't have to do this here, currently its beacause a collision algorithm optimization, i.e. caching of polygon bounds
    }

    var collider = node._collider.fn;
    if (collider[type](transformedInput)) {
      var c = create$c(node);

      appendParentNode(node, c);

      return c;
    }

    return null;
  }

  function resolveCollision(node, intersectionType, input) {
    var collider = node._collider;
    if (collider === null) {
      return null;
    }

    if (collider.type === 'frontChild') {
      return resolveFrontChildCollision(node, intersectionType, input);
    } else if (collider.type === 'bounds') {
      return resolveBoundsCollision(node, intersectionType, input);
    }

    return resolveGeometryCollision(node, intersectionType, input);
  }

  function findAllCollisions(nodes, intersectionType, ary, input) {
    var num = nodes.length;
    for (var i = 0; i < num; i++) {
      var node = nodes[i];

      var collision = resolveCollision(node, intersectionType, input);

      if (collision) {
        ary.push(collision);
      }

      // Only traverse children if no match is found on parent and it doesnt have any custom collider
      if (node.children && !collision && !node._collider) {
        findAllCollisions(node.children, intersectionType, ary, input);
      }
    }
  }

  function hasCollision(nodes, intersectionType, input) {
    var num = nodes.length;
    for (var i = 0; i < num; i++) {
      var node = nodes[i];

      var collision = resolveCollision(node, intersectionType, input);

      if (collision !== null) {
        return true;
      }

      if (node.children && !node._collider) {
        return hasCollision(node.children, intersectionType, input);
      }
    }
    return false;
  }

  function resolveShape(shape) {
    var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var type = getShapeType(shape);
    var _shape = {};

    switch (type) {
      case 'circle':
        _shape.cx = shape.cx * ratio;
        _shape.cy = shape.cy * ratio;
        _shape.r = shape.r;
        return ['intersectsCircle', _shape];
      case 'rect':
        _shape = rectToPoints(shape).map(function (p) {
          return scalarMultiply(p, ratio);
        });
        return ['intersectsRect', _shape];
      case 'line':
        _shape = lineToPoints(shape).map(function (p) {
          return scalarMultiply(p, ratio);
        });
        return ['intersectsLine', _shape];
      case 'point':
        _shape = scalarMultiply(shape, ratio);
        return ['containsPoint', _shape];
      case 'polygon':
        _shape.vertices = shape.vertices.map(function (vertex) {
          return scalarMultiply(vertex, ratio);
        });
        return ['intersectsPolygon', _shape];
      default:
        return [];
    }
  }

  function resolveCollionsOnNode(node, shape) {
    var _resolveShape = resolveShape(shape, node.dpi),
        _resolveShape2 = slicedToArray(_resolveShape, 2),
        intersectionType = _resolveShape2[0],
        _shape = _resolveShape2[1];

    var collisions = [];

    if (intersectionType) {
      findAllCollisions([node], intersectionType, collisions, _shape);
      appendInputShape(shape, collisions);
    }
    return collisions;
  }

  function hasCollisionOnNode(node, shape) {
    var _resolveShape3 = resolveShape(shape, node.dpi),
        _resolveShape4 = slicedToArray(_resolveShape3, 2),
        intersectionType = _resolveShape4[0],
        _shape = _resolveShape4[1];

    return hasCollision([node], intersectionType, _shape);
  }

  /**
   * @typedef {object} node-def
   * @property {string} type
   * @property {string|gradient-def} [fill] - {@link https://www.w3.org/TR/fill-stroke-3/#fill-shorthand}
   * @property {string|gradient-def} [stroke] - {@link https://www.w3.org/TR/fill-stroke-3/#propdef-stroke}
   * @property {number} [strokeWidth] - {@link https://www.w3.org/TR/fill-stroke-3/#propdef-stroke-width}
   * @property {string|number[]} [strokeDasharray] - {@link https://www.w3.org/TR/fill-stroke-3/#propdef-stroke-dasharray}
   * @property {number} [opacity] - {@link https://www.w3.org/TR/css-color-4/#propdef-opacity}
   * @property {string} [transform] - {@link https://www.w3.org/TR/SVG/coords.html#TransformAttribute}
   * @property {object} [data] - Data object, may contain any properties
   * @property {object} [desc] - Meta-data object, may contain any properties
   * @property {string} [tag] - White-space seperated list of tags
   * @property {string} [id] - Unique identifier of the node
   * @property {object} [collider]
   */

  var DisplayObject = function (_Node) {
    inherits(DisplayObject, _Node);

    function DisplayObject(type) {
      classCallCheck(this, DisplayObject);

      var _this = possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this, type));

      _this._stage = null;
      _this._collider = null;
      _this._attrs = {};
      _this._node = null;
      return _this;
    }

    createClass(DisplayObject, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.node = v;

        var data = v.data,
            desc = v.desc,
            tag = v.tag;


        assignMappedAttribute(this.attrs, v);

        if (typeof data !== 'undefined') {
          this.data = data;
        }

        if ((typeof desc === 'undefined' ? 'undefined' : _typeof(desc)) === 'object') {
          this.desc = extend(true, {}, desc);
        }

        if (typeof tag === 'string') {
          this.tag = tag;
        }
      }
    }, {
      key: 'collider',
      value: function collider(opts) {
        if (typeof opts === 'undefined') {
          return this._collider;
        }

        if (Array.isArray(opts)) {
          this._collider = {
            fn: create$a(opts),
            type: 'collection'
          };
          return this._collider;
        }

        var _opts$type = opts.type,
            type = _opts$type === undefined ? null : _opts$type;

        var c = { type: type };

        if (!type) {
          this._collider = null;
        } else if (this._collider && this._collider.type === type) {
          this._collider.fn.set(opts);
        } else if (type === 'frontChild') {
          this._collider = c;
        } else if (type === 'bounds') {
          c.fn = create$9('rect', opts);
          this._collider = c;
        } else if (['line', 'rect', 'circle', 'polygon', 'polyline'].indexOf(type) !== -1) {
          c.fn = create$9(type, opts);
          this._collider = c;
        }

        return this._collider;
      }
    }, {
      key: 'findShapes',
      value: function findShapes(selector) {
        return nodeSelector.find(selector, this).map(function (node) {
          return create$b(node);
        });
      }
    }, {
      key: 'getItemsFrom',
      value: function getItemsFrom(shape) {
        return resolveCollionsOnNode(this, shape);
      }
    }, {
      key: 'containsPoint',
      value: function containsPoint(p) {
        return hasCollisionOnNode(this, p);
      }
    }, {
      key: 'intersectsLine',
      value: function intersectsLine(line) {
        return hasCollisionOnNode(this, line);
      }
    }, {
      key: 'intersectsRect',
      value: function intersectsRect(rect) {
        return hasCollisionOnNode(this, rect);
      }
    }, {
      key: 'intersectsCircle',
      value: function intersectsCircle(circle) {
        return hasCollisionOnNode(this, circle);
      }
    }, {
      key: 'intersectsPolygon',
      value: function intersectsPolygon(polygon) {
        return hasCollisionOnNode(this, polygon);
      }
    }, {
      key: 'resolveLocalTransform',
      value: function resolveLocalTransform() {
        var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix();

        if (typeof this.attrs.transform !== 'undefined') {
          resolveTransform(this.attrs.transform, m);
        }
        this.modelViewMatrix = m.clone();
      }
    }, {
      key: 'resolveGlobalTransform',
      value: function resolveGlobalTransform() {
        var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix();

        var a = this.ancestors;

        if (a.length > 0) {
          for (var i = a.length - 1; i >= 0; i--) {
            a[i].resolveLocalTransform(m);
            m = a[i].modelViewMatrix;
          }
        }

        this.resolveLocalTransform(m);
      }

      /**
       * Returns the value of attribute a.
       * @private
       * @param a
       * @returns {*} The value of attribute a.
       */

    }, {
      key: 'attr',
      value: function attr(a) {
        return this.attrs[a];
      }
    }, {
      key: 'equals',
      value: function equals(d) {
        var attrs = this.attrs;
        var attrKeys = Object.keys(attrs);
        var dAttrs = d.attrs;
        var dAttrKeys = Object.keys(dAttrs);
        if (attrKeys.length !== dAttrKeys.length) {
          return false;
        }
        for (var i = 0; i < attrKeys.length; i++) {
          var key = attrKeys[i];
          if (!Object.hasOwnProperty.call(dAttrs, key)) {
            return false;
          }
          if (attrs[key] !== dAttrs[key]) {
            return false;
          }
        }

        return get(DisplayObject.prototype.__proto__ || Object.getPrototypeOf(DisplayObject.prototype), 'equals', this).call(this, d);
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {
        var json = get(DisplayObject.prototype.__proto__ || Object.getPrototypeOf(DisplayObject.prototype), 'toJSON', this).call(this);
        json.attrs = this.attrs;
        return json;
      }
    }, {
      key: 'attrs',
      get: function get$$1() {
        return this._attrs;
      }
    }, {
      key: 'stage',
      get: function get$$1() {
        if (this._parent && !this._stage) {
          // lazy evaluation
          this._stage = this._parent.stage;
        } else if (!this._parent && this._stage !== this) {
          this._stage = null;
        }
        return this._stage;
      }
    }, {
      key: 'modelViewMatrix',
      set: function set$$1(m) {
        this._mvm = m;
        this._imvm = null;
      },
      get: function get$$1() {
        return this._mvm;
      }
    }, {
      key: 'inverseModelViewMatrix',
      get: function get$$1() {
        this._imvm = this._imvm ? this._imvm : this._mvm.clone().invert();
        return this._imvm;
      }
    }, {
      key: 'node',
      set: function set$$1(n) {
        this._node = n;
      },
      get: function get$$1() {
        return this._node;
      }
    }]);
    return DisplayObject;
  }(Node);

  var NodeContainer = function (_Node) {
    inherits(NodeContainer, _Node);

    function NodeContainer() {
      classCallCheck(this, NodeContainer);
      return possibleConstructorReturn(this, (NodeContainer.__proto__ || Object.getPrototypeOf(NodeContainer)).apply(this, arguments));
    }

    createClass(NodeContainer, [{
      key: 'addChild',
      value: function addChild(c) {
        if (!c || !(c instanceof Node)) {
          throw new TypeError('Expecting a Node as argument, but got ' + c);
        }

        if (c === this) {
          throw new Error('Can not add itself as child!');
        }

        if (c._children && c._children.length && this.ancestors.indexOf(c) >= 0) {
          throw new Error('Can not add an ancestor as child!');
        }

        if (c._parent && c._parent !== this) {
          c._parent.removeChild(c);
        }

        // *
        // really expensive for large arrays
        var indx = this._children.indexOf(c); // if child already exists -> remove it, and the push it in last
        if (indx >= 0) {
          this._children.splice(indx, 1);
        }
        // * /

        this._children.push(c);
        c._parent = this;
        c._ancestors = null;

        return this;
      }
    }, {
      key: 'addChildren',
      value: function addChildren(children) {
        var i = void 0,
            num = children ? children.length : 0;
        for (i = 0; i < num; i++) {
          this.addChild(children[i]);
        }
        return this;
      }

      /**
       * Removes given child node from this node.
       * @private
       * @param {Node} c
       * @returns {Node} This object, for chaining purposes.
       */

    }, {
      key: 'removeChild',
      value: function removeChild(c) {
        var indx = this._children.indexOf(c);
        if (indx >= 0) {
          this._children.splice(indx, 1);
          c._parent = null;
          c._ancestors = null;
        }
        return this;
      }
    }, {
      key: 'removeChildren',
      value: function removeChildren(children) {
        var i = void 0,
            num = void 0;
        if (!this._children) {
          return this;
        }
        if (children) {
          num = children.length;
          for (i = 0; i < num; i++) {
            this.removeChild(children[i]);
          }
        } else {
          while (this._children.length) {
            this.removeChild(this._children[0]);
          }
        }
        return this;
      }
    }]);
    return NodeContainer;
  }(Node);

  /**
   * @extends node-def
   * @typedef {object} node--container-def
   * @property {node-def[]} children - Array of child nodes
   */

  var NC = NodeContainer.prototype;

  function reCalcBoundingRect(c, child) {
    var includeTransform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (typeof child.bounds !== 'undefined') {
      var _child$bounds = child.bounds(includeTransform),
          _child$bounds2 = slicedToArray(_child$bounds, 3),
          p0 = _child$bounds2[0],
          p2 = _child$bounds2[2];

      var xMin = p0.x,
          yMin = p0.y;
      var xMax = p2.x,
          yMax = p2.y;


      var _xMax = isNaN(c._boundingRect.width) ? xMax : Math.max(xMax, c._boundingRect.width + c._boundingRect.x);
      var _yMax = isNaN(c._boundingRect.height) ? yMax : Math.max(yMax, c._boundingRect.height + c._boundingRect.y);

      c._boundingRect.x = isNaN(c._boundingRect.x) ? xMin : Math.min(xMin, c._boundingRect.x);
      c._boundingRect.y = isNaN(c._boundingRect.y) ? yMin : Math.min(yMin, c._boundingRect.y);
      c._boundingRect.width = _xMax - c._boundingRect.x;
      c._boundingRect.height = _yMax - c._boundingRect.y;
    }
  }

  var Container = function (_DisplayObject) {
    inherits(Container, _DisplayObject);

    function Container() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, Container);
      var _s$type = s.type,
          type = _s$type === undefined ? 'container' : _s$type;

      var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, type));

      _this.set(s);
      _this._boundingRect = {};
      return _this;
    }

    createClass(Container, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'set', this).call(this, v);

        var collider = v.collider;

        var opts = extend({
          type: null
        }, collider);

        get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'collider', this).call(this, opts);
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var num = this.children.length;
        this._boundingRect = {};

        for (var i = 0; i < num; i++) {
          reCalcBoundingRect(this, this.children[i], includeTransform);
        }
        return extend({
          x: 0, y: 0, width: 0, height: 0
        }, this._boundingRect);
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var rect = this.boundingRect(includeTransform);

        return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
      }
    }, {
      key: 'addChild',
      value: function addChild(c) {
        var r = NC.addChild.call(this, c);

        if (this._collider && this._collider.type === 'bounds') {
          reCalcBoundingRect(this, c, true);
          var opts = extend({
            type: 'bounds', x: 0, y: 0, width: 0, height: 0
          }, this._boundingRect);
          get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'collider', this).call(this, opts);
        }

        return r;
      }
    }, {
      key: 'addChildren',
      value: function addChildren(children) {
        var r = NC.addChildren.call(this, children);
        var num = children.length;

        if (this._collider && this._collider.type === 'bounds' && num > 0) {
          for (var i = 0; i < num; i++) {
            reCalcBoundingRect(this, children[i], true);
          }
          var opts = extend({
            type: 'bounds', x: 0, y: 0, width: 0, height: 0
          }, this._boundingRect);
          get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'collider', this).call(this, opts);
        }

        return r;
      }
    }, {
      key: 'removeChild',
      value: function removeChild(c) {
        c._stage = null;
        var desc = c.descendants,
            num = desc ? desc.length : 0,
            i = void 0;
        // remove reference to stage from all descendants
        for (i = 0; i < num; i++) {
          desc[i]._stage = null;
        }

        NC.removeChild.call(this, c);

        if (this._collider && this._collider.type === 'bounds') {
          var opts = extend(this.boundingRect(true), { type: 'bounds' });
          get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'collider', this).call(this, opts);
        }

        return this;
      }
    }, {
      key: 'removeChildren',
      value: function removeChildren(children) {
        NC.removeChildren.call(this, children);

        if (this._collider && this._collider.type === 'bounds') {
          var opts = extend(this.boundingRect(true), { type: 'bounds' });
          get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'collider', this).call(this, opts);
        }

        return this;
      }
    }]);
    return Container;
  }(DisplayObject);


  function create$d() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Container, [null].concat(s)))();
  }

  var Stage = function (_Container) {
    inherits(Stage, _Container);

    function Stage(dpi) {
      classCallCheck(this, Stage);

      var _this = possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, 'stage'));

      _this._stage = _this;
      _this._dpiRatio = dpi || 1;
      return _this;
    }

    createClass(Stage, [{
      key: 'dpi',
      get: function get$$1() {
        return this._dpiRatio;
      }
    }]);
    return Stage;
  }(Container);


  function create$e() {
    for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Stage, [null].concat(a)))();
  }

  /**
   * @typedef {object} gradient-def
   * @property {string} type
   * @property {object[]} stops
   * @property {string} [stops[].type=linearGradient] - radialGradient|linearGradient
   * @property {string} stops[].color - {@link https://www.w3.org/TR/SVG/types.html#DataTypeColor}
   * @property {string} [stops[].opacity=1] - {@link https://www.w3.org/TR/css-color-4/#propdef-opacity}
   * @property {number} stops[].offset - {@link https://www.w3.org/TR/SVG/pservers.html#StopElementOffsetAttribute}
   * @property {number} [degree] - Gradient rotation angle
   */

  /**
   * @typedef {object} node--gradient-item-def
   * @property {string} id - Gradient identifier
   * @property {number} x1 - {@link https://www.w3.org/TR/SVG/pservers.html#LinearGradientElementX1Attribute}
   * @property {number} y1 - {@link https://www.w3.org/TR/SVG/pservers.html#LinearGradientElementY1Attribute}
   * @property {number} x2 - {@link https://www.w3.org/TR/SVG/pservers.html#LinearGradientElementX2Attribute}
   * @property {number} y2 - {@link https://www.w3.org/TR/SVG/pservers.html#LinearGradientElementY2Attribute}
   * @property {number} offset - {@link https://www.w3.org/TR/SVG/pservers.html#StopElementOffsetAttribute}
   * @property {object} style - {@link https://www.w3.org/TR/SVG/styling.html#StyleAttribute}
   */

  var NC$1 = NodeContainer.prototype;

  var allowedAttrs = ['x1', 'x2', 'y1', 'y2', 'id', 'offset', 'style'];

  var GradientItem = function (_DisplayObject) {
    inherits(GradientItem, _DisplayObject);

    function GradientItem() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, GradientItem);
      var _s$type = s.type,
          type = _s$type === undefined ? 'container' : _s$type;

      var _this = possibleConstructorReturn(this, (GradientItem.__proto__ || Object.getPrototypeOf(GradientItem)).call(this, type));

      _this.set(s);
      _this._boundingRect = {};
      return _this;
    }

    createClass(GradientItem, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        get(GradientItem.prototype.__proto__ || Object.getPrototypeOf(GradientItem.prototype), 'set', this).call(this, v);

        var attrs = this.attrs;

        var attrKey = '';

        for (var i = 0, len = allowedAttrs.length; i !== len; i++) {
          attrKey = allowedAttrs[i];

          if (v[attrKey]) {
            attrs[attrKey] = v[attrKey];
          }
        }
      }
    }, {
      key: 'addChild',
      value: function addChild(c) {
        var r = NC$1.addChild.call(this, c);

        return r;
      }
    }, {
      key: 'addChildren',
      value: function addChildren(children) {
        var r = NC$1.addChildren.call(this, children);

        return r;
      }
    }, {
      key: 'removeChild',
      value: function removeChild(c) {
        c._stage = null;
        var desc = c.descendants,
            num = desc ? desc.length : 0,
            i = void 0;
        // remove reference to stage from all descendants
        for (i = 0; i < num; i++) {
          desc[i]._stage = null;
        }

        NC$1.removeChild.call(this, c);

        return this;
      }
    }, {
      key: 'removeChildren',
      value: function removeChildren(children) {
        NC$1.removeChildren.call(this, children);

        return this;
      }
    }]);
    return GradientItem;
  }(DisplayObject);


  function create$f() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(GradientItem, [null].concat(s)))();
  }

  /**
   * @extends node-def
   * @typedef {object} node--rect-def
   * @property {number} x - {@link https://www.w3.org/TR/SVG/shapes.html#RectElementXAttribute}
   * @property {number} y - {@link https://www.w3.org/TR/SVG/shapes.html#RectElementYAttribute}
   * @property {number} width - {@link https://www.w3.org/TR/SVG/shapes.html#RectElementWidthAttribute}
   * @property {number} height- {@link https://www.w3.org/TR/SVG/shapes.html#RectElementHeightAttribute}
   */

  var Rect = function (_DisplayObject) {
    inherits(Rect, _DisplayObject);

    function Rect() {
      classCallCheck(this, Rect);

      var _this = possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, 'rect'));

      _this.set.apply(_this, arguments);
      return _this;
    }

    createClass(Rect, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _v$x = v.x,
            x = _v$x === undefined ? 0 : _v$x,
            _v$y = v.y,
            y = _v$y === undefined ? 0 : _v$y,
            _v$width = v.width,
            width = _v$width === undefined ? 0 : _v$width,
            _v$height = v.height,
            height = _v$height === undefined ? 0 : _v$height,
            collider = v.collider;

        var opts = extend({
          type: 'rect', x: x, y: y, width: width, height: height
        }, collider);

        get(Rect.prototype.__proto__ || Object.getPrototypeOf(Rect.prototype), 'set', this).call(this, v);
        get(Rect.prototype.__proto__ || Object.getPrototypeOf(Rect.prototype), 'collider', this).call(this, opts);

        if (width >= 0) {
          this.attrs.x = x;
          this.attrs.width = width;
        } else {
          this.attrs.x = x + width;
          this.attrs.width = -width;
        }

        if (height >= 0) {
          this.attrs.y = y;
          this.attrs.height = height;
        } else {
          this.attrs.y = y + height;
          this.attrs.height = -height;
        }
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var p = rectToPoints(this.attrs);
        var pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(p) : p;

        var _getMinMax = getMinMax(pt),
            _getMinMax2 = slicedToArray(_getMinMax, 4),
            xMin = _getMinMax2[0],
            yMin = _getMinMax2[1],
            xMax = _getMinMax2[2],
            yMax = _getMinMax2[3];

        return {
          x: xMin,
          y: yMin,
          width: xMax - xMin,
          height: yMax - yMin
        };
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var rect = this.boundingRect(includeTransform);

        return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
      }
    }]);
    return Rect;
  }(DisplayObject);


  function create$g() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Rect, [null].concat(s)))();
  }

  /**
   * @extends node-def
   * @typedef {object} node--circle-def
   * @property {number} cx - {@link https://www.w3.org/TR/SVG/shapes.html#CircleElementCXAttribute}
   * @property {number} cy - {@link https://www.w3.org/TR/SVG/shapes.html#CircleElementCYAttribute}
   * @property {number} r - {@link https://www.w3.org/TR/SVG/shapes.html#CircleElementRAttribute}
   */

  var Circle = function (_DisplayObject) {
    inherits(Circle, _DisplayObject);

    function Circle() {
      classCallCheck(this, Circle);

      var _this = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, 'circle'));

      _this.set.apply(_this, arguments);
      return _this;
    }

    createClass(Circle, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _v$cx = v.cx,
            cx = _v$cx === undefined ? 0 : _v$cx,
            _v$cy = v.cy,
            cy = _v$cy === undefined ? 0 : _v$cy,
            _v$r = v.r,
            r = _v$r === undefined ? 0 : _v$r,
            collider = v.collider;

        var opts = extend({
          type: 'circle', cx: cx, cy: cy, r: r
        }, collider);

        get(Circle.prototype.__proto__ || Object.getPrototypeOf(Circle.prototype), 'set', this).call(this, v);
        get(Circle.prototype.__proto__ || Object.getPrototypeOf(Circle.prototype), 'collider', this).call(this, opts);

        this.attrs.cx = cx;
        this.attrs.cy = cy;
        this.attrs.r = r;
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // TODO Handle Circle bounds correctly for a circle transformed to an non axis aligned ellipse/circle
        // Current solution only rotate the bounds, giving a larger boundingRect if rotated
        var p = this.bounds(includeTransform);

        return {
          x: p[0].x,
          y: p[0].y,
          width: p[2].x - p[0].x,
          height: p[2].y - p[0].y
        };
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // TODO Handle Circle bounds correctly for a circle transformed to an non axis aligned ellipse/circle
        var _attrs = this.attrs,
            cx = _attrs.cx,
            cy = _attrs.cy,
            rX = _attrs.r,
            rY = _attrs.r;

        var x = cx - rX;
        var y = cy - rY;
        var w = rX * 2;
        var h = rY * 2;
        var p = [{ x: x, y: y }, { x: x + w, y: y }, { x: x + w, y: y + h }, { x: x, y: y + h }];

        if (includeTransform && this.modelViewMatrix) {
          p = this.modelViewMatrix.transformPoints(p);

          var _getMinMax = getMinMax(p),
              _getMinMax2 = slicedToArray(_getMinMax, 4),
              xMin = _getMinMax2[0],
              yMin = _getMinMax2[1],
              xMax = _getMinMax2[2],
              yMax = _getMinMax2[3];

          w = xMax - xMin;
          h = yMax - yMin;

          return [{ x: xMin, y: yMin }, { x: xMin + w, y: yMin }, { x: xMin + w, y: yMin + h }, { x: xMin, y: yMin + h }];
        }

        return p;
      }
    }]);
    return Circle;
  }(DisplayObject);


  function create$h() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Circle, [null].concat(s)))();
  }

  /**
   * @extends node-def
   * @typedef {object} node--line-def
   * @property {number} x1 - {@link https://www.w3.org/TR/SVG/shapes.html#LineElementX1Attribute}
   * @property {number} y1 - {@link https://www.w3.org/TR/SVG/shapes.html#LineElementY1Attribute}
   * @property {number} x2 - {@link https://www.w3.org/TR/SVG/shapes.html#LineElementX2Attribute}
   * @property {number} y2 - {@link https://www.w3.org/TR/SVG/shapes.html#LineElementY2Attribute}
   */

  var Line = function (_DisplayObject) {
    inherits(Line, _DisplayObject);

    function Line() {
      classCallCheck(this, Line);

      var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, 'line'));

      _this.set.apply(_this, arguments);
      return _this;
    }

    createClass(Line, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _v$x = v.x1,
            x1 = _v$x === undefined ? 0 : _v$x,
            _v$y = v.y1,
            y1 = _v$y === undefined ? 0 : _v$y,
            _v$x2 = v.x2,
            x2 = _v$x2 === undefined ? 0 : _v$x2,
            _v$y2 = v.y2,
            y2 = _v$y2 === undefined ? 0 : _v$y2,
            collider = v.collider;

        get(Line.prototype.__proto__ || Object.getPrototypeOf(Line.prototype), 'set', this).call(this, v);
        this.attrs.x1 = x1;
        this.attrs.y1 = y1;
        this.attrs.x2 = x2;
        this.attrs.y2 = y2;

        var defaultCollider = {
          type: 'line',
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        };
        get(Line.prototype.__proto__ || Object.getPrototypeOf(Line.prototype), 'collider', this).call(this, extend(defaultCollider, collider));
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var p = lineToPoints(this.attrs);

        if (includeTransform && this.modelViewMatrix) {
          p = this.modelViewMatrix.transformPoints(p);
        }

        var _getMinMax = getMinMax(p),
            _getMinMax2 = slicedToArray(_getMinMax, 4),
            xMin = _getMinMax2[0],
            yMin = _getMinMax2[1],
            xMax = _getMinMax2[2],
            yMax = _getMinMax2[3];

        var hasSize = xMin !== xMax || yMin !== yMax;

        return {
          x: xMin,
          y: yMin,
          width: hasSize ? Math.max(1, xMax - xMin) : 0,
          height: hasSize ? Math.max(1, yMax - yMin) : 0
        };
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var rect = this.boundingRect(includeTransform);
        return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
      }
    }]);
    return Line;
  }(DisplayObject);


  function create$i() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Line, [null].concat(s)))();
  }

  var PI_X2 = Math.PI * 2;

  /**
   * Implementation of F.6.5 https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
   * @ignore
   * @param {number} rx - Arc x-radius
   * @param {number} ry - Arc y-radius
   * @param {number} rotation - Arc rotation in degrees (0-360)
   * @param {boolean} largeArcFlag
   * @param {boolean} sweepFlag
   * @param {number} endX - X-coordinate for end of arc
   * @param {number} endY - Y-coordinate for end of arc
   * @param {number} startX - X-coordinate for start of arc
   * @param {number} startY - Y-coordinate for start of arc
   * @returns {object}
   */
  function arcToCenter(rx, ry, rotation, largeArcFlag, sweepFlag, endX, endY, startX, startY) {
    var startAngle = void 0;
    var endAngle = void 0;
    var sweepAngle = void 0;
    var cx = void 0;
    var cy = void 0;
    var radiusRatio = void 0;

    var rad = toRadians(rotation % 360);

    // F.6.5.1
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    var hdx = (startX - endX) / 2;
    var hdy = (startY - endY) / 2;

    var x1d = cos * hdx + sin * hdy;
    var y1d = cos * hdy - sin * hdx;

    // F.6.6
    rx = Math.abs(rx);
    ry = Math.abs(ry);

    radiusRatio = Math.pow(x1d, 2) / Math.pow(rx, 2) + Math.pow(y1d, 2) / Math.pow(ry, 2);
    if (radiusRatio > 1) {
      radiusRatio = Math.sqrt(radiusRatio);
      rx *= radiusRatio;
      ry *= radiusRatio;
    }

    // F.6.5.2
    var rxry = rx * ry;
    var rxy1d = rx * y1d;
    var ryx1d = ry * x1d;
    var den = Math.pow(rxy1d, 2) + Math.pow(ryx1d, 2);
    var num = Math.pow(rxry, 2) - den;

    var frac = Math.sqrt(Math.max(num / den, 0));

    if (largeArcFlag === sweepFlag) {
      frac = -frac;
    }

    var cxd = frac * (rxy1d / ry);
    var cyd = frac * -(ryx1d / rx);

    // F.6.5.3
    var mx = (startX + endX) / 2;
    var my = (startY + endY) / 2;
    cx = cos * cxd - sin * cyd + mx;
    cy = sin * cxd + cos * cyd + my;

    // F.6.5.6 clockwise angle
    var ux = (x1d - cxd) / rx;
    var uy = (y1d - cyd) / ry;
    var vx = (-x1d - cxd) / rx;
    var vy = (-y1d - cyd) / ry;
    startAngle = Math.atan2(uy, ux);
    startAngle += startAngle < 0 ? PI_X2 : 0;
    endAngle = Math.atan2(vy, vx);
    endAngle += endAngle < 0 ? PI_X2 : 0;

    sweepAngle = endAngle - startAngle;

    if (!sweepFlag && startAngle < endAngle) {
      sweepAngle -= PI_X2;
    } else if (sweepFlag && endAngle < startAngle) {
      sweepAngle += PI_X2;
    }

    sweepAngle %= PI_X2;

    return {
      startAngle: startAngle,
      sweepAngle: sweepAngle,
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry
    };
  }

  /**
   * Measure the flatnass of a cubic bezier curve
   * @ignore
   * @param {point} s - Start point
   * @param {point} cp1 - First control point
   * @param {point} cp2 - Second control point
   * @param {point} e - End point
   */
  function flatness(s, cp1, cp2, e) {
    var ux = Math.abs(s.x + cp2.x - (cp1.x + cp1.x));
    var uy = Math.abs(s.y + cp2.y - (cp1.y + cp1.y));
    var vx = Math.abs(cp1.x + e.x - (cp2.x + cp2.x));
    var vy = Math.abs(cp1.y + e.y - (cp2.y + cp2.y));

    return ux + uy + vx + vy;
  }

  function mid(p0, p1) {
    return {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2
    };
  }

  function interpolate(t, s, cp1, cp2, e) {
    var td = 1 - t;
    var t0 = Math.pow(td, 3) * s;
    var t1 = 3 * Math.pow(td, 2) * t * cp1;
    var t2 = 3 * td * Math.pow(t, 2) * cp2;
    var t3 = Math.pow(t, 3) * e;

    return t0 + t1 + t2 + t3;
  }

  /**
   * Recursive subdivision of a curve using de Casteljau algorithm.
   * Splits the curve into multiple line segments where each segments is choosen based on a level of flatness.
   * @ignore
   * @param {point} s - Start point
   * @param {point} cp1 - First control point
   * @param {point} cp2 - Second control point
   * @param {point} e - End point
   * @param {array} points - Initial set of points
   * @returns {point[]} Array of points
   */
  function toPoints(s, cp1, cp2, e) {
    var points = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    if (flatness(s, cp1, cp2, e) <= 10) {
      // Poor man's Set
      if (points.indexOf(s) === -1) {
        points.push(s);
      }
      if (points.indexOf(e) === -1) {
        points.push(e);
      }
      return points;
    }

    var t = 0.5;

    var m0 = mid(s, cp1);
    var m1 = mid(cp1, cp2);
    var m2 = mid(cp2, e);

    var b = { // Split curve at point
      x: interpolate(t, s.x, cp1.x, cp2.x, e.x),
      y: interpolate(t, s.y, cp1.y, cp2.y, e.y)
    };

    var q0 = mid(m0, m1); // New cp2 for left curve
    var q1 = mid(m1, m2); // New cp1 for right curve

    toPoints(s, m0, q0, b, points); // left curve
    toPoints(b, q1, m2, e, points); // Right curve

    return points;
  }

  function toCubic(s, cp, e) {
    var cp1x = s.x + 2 / 3 * (cp.x - s.x);
    var cp1y = s.y + 2 / 3 * (cp.y - s.y);
    var cp2x = e.x + 2 / 3 * (cp.x - e.x);
    var cp2y = e.y + 2 / 3 * (cp.y - e.y);
    var cp1 = { x: cp1x, y: cp1y };
    var cp2 = { x: cp2x, y: cp2y };

    return { cp1: cp1, cp2: cp2 };
  }

  /**
   * Recursive subdivision of a curve using de Casteljau algorithm.
   * Splits the curve into multiple line segments where each segments is choosen based on a level of flatness.
   * @ignore
   * @param {point} s - Start point
   * @param {point} cp - Control point
   * @param {point} e - End point
   * @returns {point[]} Array of points
   */
  function toPoints$1(s, cp, e) {
    var _toCubic = toCubic(s, cp, e),
        cp1 = _toCubic.cp1,
        cp2 = _toCubic.cp2;

    return toPoints(s, cp1, cp2, e);
  }

  /**
   * Transform an arc to a set of points a long the arc.
   * Specifiction F.6 (https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes)
   * @ignore
   * @param {array} s - Segments
   * @param {number} startX - X-coordinate for start of arc
   * @param {number} startY - Y-coordinate for start of arc
   */
  function arcToPoints(s, startX, startY) {
    var points = [];
    var largeArcFlag = !!s[4]; // F.6.3
    var sweepFlag = !!s[5]; // F.6.3
    var rotation = s[3];
    var endX = s[6];
    var endY = s[7];
    var rx = s[1];
    var ry = s[2];
    var cx = void 0;
    var cy = void 0;
    var sweepAngle = void 0;
    var startAngle = void 0;

    if (s[0] === 'a') {
      endX += startX;
      endY += startY;
    }

    // F.6.2
    if (startX === endY && startY === endY) {
      return points;
    }

    // Given no radius, threat as lineTo command
    if (!rx || !ry) {
      points.push({ x: endX, y: endY });
      return points;
    }

    // Approximation of perimeter
    var _arcToCenter = arcToCenter(rx, ry, rotation, largeArcFlag, sweepFlag, endX, endY, startX, startY);

    cx = _arcToCenter.cx;
    cy = _arcToCenter.cy;
    rx = _arcToCenter.rx;
    ry = _arcToCenter.ry;
    sweepAngle = _arcToCenter.sweepAngle;
    startAngle = _arcToCenter.startAngle;
    var p = Math.abs(sweepAngle * Math.sqrt((Math.pow(rx, 2) + Math.pow(ry, 2)) / 2));

    // Generate a point every 10th pixel. Scaling of the node should probably be included in this calculation
    var res = Math.ceil(p / 10);
    var resAngle = sweepAngle / res;

    for (var k = 1; k <= res; k++) {
      var deltaAngle = resAngle * k;
      var radians = (startAngle + deltaAngle) % PI_X2;
      var cos = Math.cos(radians);
      var sin = Math.sin(radians);
      // F.6.3 https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
      points.push({
        x: cx + cos * rx + -sin * cos,
        y: cy + sin * ry + cos * sin
      });
    }

    // points.push({ x: cx, y: cy });

    return points;
  }

  /**
   * Converts a SVG path data string into a set of points.
   * @ignore
   * @param {string} path
   * @returns {Array<point[]>} Array of points
   */
  function pathToPoints(path) {
    var commands = parse(path);
    var segments = [];
    var points = [];
    var x = 0; // Current point
    var y = 0;
    var cpx = null; // Last control point on a cubic curve
    var cpy = null;
    var qcpx = null; // Last control point on a quad curve
    var qcpy = null;

    for (var i = 0; i < commands.length; ++i) {
      var cmd = commands[i];
      var pathType = cmd[0];

      // Reset control point if command is not cubic
      if (pathType !== 'S' && pathType !== 's' && pathType !== 'C' && pathType !== 'c') {
        cpx = null;
        cpy = null;
      }

      if (pathType !== 'T' && pathType !== 't' && pathType !== 'Q' && pathType !== 'q') {
        qcpx = null;
        qcpy = null;
      }

      switch (pathType) {
        case 'm':
          if (points.length) {
            segments.push(points.splice(0));
          }
        // Fall through
        case 'l':
          // eslint-disable-line no-fallthrough
          x += cmd[1];
          y += cmd[2];
          points.push({ x: x, y: y });
          break;
        case 'M':
          if (points.length) {
            segments.push(points.splice(0));
          }
        // Fall through
        case 'L':
          // eslint-disable-line no-fallthrough
          x = cmd[1];
          y = cmd[2];
          points.push({ x: x, y: y });
          break;
        case 'H':
          x = cmd[1];
          points.push({ x: x, y: y });
          break;
        case 'h':
          x += cmd[1];
          points.push({ x: x, y: y });
          break;
        case 'V':
          y = cmd[1];
          points.push({ x: x, y: y });
          break;
        case 'v':
          y += cmd[1];
          points.push({ x: x, y: y });
          break;
        case 'a':
          points.push.apply(points, toConsumableArray(arcToPoints(cmd, x, y)));
          x += cmd[6];
          y += cmd[7];
          break;
        case 'A':
          points.push.apply(points, toConsumableArray(arcToPoints(cmd, x, y)));
          x = cmd[6];
          y = cmd[7];
          break;
        case 'c':
          points.push.apply(points, toConsumableArray(toPoints({ x: x, y: y }, { x: cmd[1] + x, y: cmd[2] + y }, { x: cmd[3] + x, y: cmd[4] + y }, { x: cmd[5] + x, y: cmd[6] + y })));
          cpx = cmd[3] + x; // Last control point
          cpy = cmd[4] + y;
          x += cmd[5];
          y += cmd[6];
          break;
        case 'C':
          points.push.apply(points, toConsumableArray(toPoints({ x: x, y: y }, { x: cmd[1], y: cmd[2] }, { x: cmd[3], y: cmd[4] }, { x: cmd[5], y: cmd[6] })));
          cpx = cmd[3]; // Last control point
          cpy = cmd[4];
          x = cmd[5];
          y = cmd[6];
          break;
        case 's':
          if (cpx === null || cpx === null) {
            cpx = x;
            cpy = y;
          }

          points.push.apply(points, toConsumableArray(toPoints({ x: x, y: y }, { x: 2 * x - cpx, y: 2 * y - cpy }, { x: cmd[1] + x, y: cmd[2] + y }, { x: cmd[3] + x, y: cmd[4] + y })));
          cpx = cmd[1] + x; // last control point
          cpy = cmd[2] + y;
          x += cmd[3];
          y += cmd[4];
          break;
        case 'S':
          if (cpx === null || cpx === null) {
            cpx = x;
            cpy = y;
          }

          points.push.apply(points, toConsumableArray(toPoints({ x: x, y: y }, { x: 2 * x - cpx, y: 2 * y - cpy }, { x: cmd[1], y: cmd[2] }, { x: cmd[3], y: cmd[4] })));
          cpx = cmd[1]; // last control point
          cpy = cmd[2];
          x = cmd[3];
          y = cmd[4];
          break;
        case 'Q':
          points.push.apply(points, toConsumableArray(toPoints$1({ x: x, y: y }, { x: cmd[1], y: cmd[2] }, { x: cmd[3], y: cmd[4] })));

          qcpx = cmd[1]; // last control point
          qcpy = cmd[2];
          x = cmd[3];
          y = cmd[4];
          break;
        case 'q':
          points.push.apply(points, toConsumableArray(toPoints$1({ x: x, y: y }, { x: cmd[1] + x, y: cmd[2] + y }, { x: cmd[3] + x, y: cmd[4] + y })));

          qcpx = cmd[1] + x; // last control point
          qcpy = cmd[2] + y;
          x += cmd[3];
          y += cmd[4];
          break;
        case 'T':
          if (qcpx === null || qcpx === null) {
            qcpx = x;
            qcpy = y;
          }

          qcpx = 2 * x - qcpx; // last control point
          qcpy = 2 * y - qcpy;
          points.push.apply(points, toConsumableArray(toPoints$1({ x: x, y: y }, { x: qcpx, y: qcpy }, { x: cmd[1], y: cmd[2] })));

          x = cmd[1];
          y = cmd[2];
          break;
        case 't':
          if (qcpx === null || qcpx === null) {
            qcpx = x;
            qcpy = y;
          }

          qcpx = 2 * x - qcpx; // last control point
          qcpy = 2 * y - qcpy;
          points.push.apply(points, toConsumableArray(toPoints$1({ x: x, y: y }, { x: qcpx, y: qcpy }, { x: cmd[1] + x, y: cmd[2] + y })));
          x += cmd[1];
          y += cmd[2];
          break;
        case 'z':
        case 'Z':
          points.push({ x: points[0].x, y: points[0].y });
          break;
        default:
        // Do nothing
      }
    }

    segments.push(points.splice(0));

    return segments;
  }

  function flatten2d(ary) {
    var newAry = [];
    var a = void 0;
    var len = ary.length;
    for (var i = 0; i < len; i++) {
      a = ary[i];
      for (var k = 0; k < a.length; k++) {
        newAry.push(a[k]);
      }
    }

    return newAry;
  }

  /**
   * @extends node-def
   * @typedef {object} node--path-def
   * @property {string} d - {@link https://www.w3.org/TR/SVG/paths.html#DAttribute}
   */

  function isClosed(points) {
    if (points.length < 2) {
      return false;
    }
    var p0 = points[0];
    var p1 = points[points.length - 1];

    return p0.x === p1.x && p0.y === p1.y;
  }

  var Path$1 = function (_DisplayObject) {
    inherits(Path, _DisplayObject);

    function Path() {
      classCallCheck(this, Path);

      var _this = possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this, 'path'));

      _this.set.apply(_this, arguments);
      return _this;
    }

    createClass(Path, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        get(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), 'set', this).call(this, v);
        this.segments = [];
        this.points = [];
        this.attrs.d = v.d;

        if (v.collider) {
          get(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), 'collider', this).call(this, v.collider);
        } else if (v.d) {
          var col = [];
          this.segments = pathToPoints(v.d);
          this.segments.forEach(function (segment) {
            if (segment.length <= 1) ; else if (isClosed(segment)) {
              col.push({
                type: 'polygon',
                vertices: segment
              });
            } else {
              col.push({
                type: 'polyline',
                points: segment
              });
            }
          });

          get(Path.prototype.__proto__ || Object.getPrototypeOf(Path.prototype), 'collider', this).call(this, col);
        }
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!this.points.length) {
          this.segments = this.segments.length ? this.segments : pathToPoints(this.attrs.d);
          this.points = flatten2d(this.segments);
        }

        var pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(this.points) : this.points;

        var _getMinMax = getMinMax(pt),
            _getMinMax2 = slicedToArray(_getMinMax, 4),
            xMin = _getMinMax2[0],
            yMin = _getMinMax2[1],
            xMax = _getMinMax2[2],
            yMax = _getMinMax2[3];

        return {
          x: xMin || 0,
          y: yMin || 0,
          width: xMax - xMin || 0,
          height: yMax - yMin || 0
        };
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var rect = this.boundingRect(includeTransform);

        return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
      }
    }]);
    return Path;
  }(DisplayObject);


  function create$j() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Path$1, [null].concat(s)))();
  }

  /**
   * @extends node-def
   * @typedef {object} node--text-def
   * @property {string} text
   * @property {number} x - {@link https://www.w3.org/TR/SVG/text.html#TextElementXAttribute}
   * @property {number} y - {@link https://www.w3.org/TR/SVG/text.html#TextElementYAttribute}
   * @property {number} [dx] - {@link https://www.w3.org/TR/SVG/text.html#TextElementDXAttribute}
   * @property {number} [dy] - {@link https://www.w3.org/TR/SVG/text.html#TextElementDYAttribute}
   * @property {string} [fontSize] - {@link https://www.w3.org/TR/SVG/text.html#FontPropertiesUsedBySVG}
   * @property {string} [fontFamily] - {@link https://www.w3.org/TR/SVG/text.html#FontPropertiesUsedBySVG}
   * @property {rect} [boundingRect] - Explicitly set the bounding rectangle of the node. Has predence over textBoundsFn
   * @property {function} [textBoundsFn] - Implicitly set the bounding rectangle of the node, the function must return an object with x, y, width and height attributes
   * @property {string} [baseline] - Alias for dominantBaseline
   * @property {string} [dominantBaseline] - {@link https://www.w3.org/TR/SVG/text.html#BaselineAlignmentProperties}
   * @property {string} [anchor] - Alias for textAnchor
   * @property {string} [textAnchor] - {@link https://www.w3.org/TR/SVG/text.html#TextAnchorProperty}
   * @property {string} [wordBreak] - Word-break option
   * @property {number} [maxWidth] - Maximum allowed text width
   * @property {number} [maxHeight] - Maximum allowed text height. If both maxLines and maxHeight are set, the property that results in the fewest number of lines is used
   * @property {number} [maxLines] - Maximum number of lines allowed
   * @property {number} [lineHeight=1.2] - Line height
   */

  var Text = function (_DisplayObject) {
    inherits(Text, _DisplayObject);

    function Text() {
      classCallCheck(this, Text);

      var _this = possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, 'text'));

      _this.set.apply(_this, arguments);
      return _this;
    }

    createClass(Text, [{
      key: 'set',
      value: function set$$1() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _v$x = v.x,
            x = _v$x === undefined ? 0 : _v$x,
            _v$y = v.y,
            y = _v$y === undefined ? 0 : _v$y,
            _v$dx = v.dx,
            dx = _v$dx === undefined ? 0 : _v$dx,
            _v$dy = v.dy,
            dy = _v$dy === undefined ? 0 : _v$dy,
            textBoundsFn = v.textBoundsFn,
            text = v.text,
            collider = v.collider,
            boundingRect = v.boundingRect;


        get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'set', this).call(this, v);
        get(Text.prototype.__proto__ || Object.getPrototypeOf(Text.prototype), 'collider', this).call(this, collider);
        this.attrs.x = x;
        this.attrs.y = y;
        this.attrs.dx = dx;
        this.attrs.dy = dy;
        this.attrs.text = text;
        if (boundingRect) {
          this._boundingRect = boundingRect;
        } else if (typeof textBoundsFn === 'function') {
          this._boundingRect = textBoundsFn(this.attrs);
        }
      }
    }, {
      key: 'boundingRect',
      value: function boundingRect() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!this._boundingRect) {
          return {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          };
        }

        var p = rectToPoints(this._boundingRect);
        var pt = includeTransform && this.modelViewMatrix ? this.modelViewMatrix.transformPoints(p) : p;

        var _getMinMax = getMinMax(pt),
            _getMinMax2 = slicedToArray(_getMinMax, 4),
            xMin = _getMinMax2[0],
            yMin = _getMinMax2[1],
            xMax = _getMinMax2[2],
            yMax = _getMinMax2[3];

        return {
          x: xMin,
          y: yMin,
          width: xMax - xMin,
          height: yMax - yMin
        };
      }
    }, {
      key: 'bounds',
      value: function bounds() {
        var includeTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var rect = this.boundingRect(includeTransform);

        return [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }];
      }
    }]);
    return Text;
  }(DisplayObject);


  function create$k() {
    for (var _len = arguments.length, s = Array(_len), _key = 0; _key < _len; _key++) {
      s[_key] = arguments[_key];
    }

    return new (Function.prototype.bind.apply(Text, [null].concat(s)))();
  }

  var reg$4 = registryFactory();

  reg$4.add('rect', create$g);
  reg$4.add('circle', create$h);
  reg$4.add('text', create$k);
  reg$4.add('line', create$i);
  reg$4.add('path', create$j);
  reg$4.add('stage', create$e);
  reg$4.add('container', create$d);
  reg$4.add('defs', create$f);
  reg$4.add('linearGradient', create$f);
  reg$4.add('radialGradient', create$f);
  reg$4.add('stop', create$f);

  function create$l(type, input) {
    // eslint-disable-line import/prefer-default-export
    return reg$4.get(type)(input);
  }

  /**
   * Creates a context. Input an array of strings that should be inherited by the context.
   * @private
   *
   * @param  {Array}  [whitelist=[]]  An array of whitelisted string keys to inherit
   * @return {Function}               A context function
   */
  function contextFactory() {
    var whitelist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var states = [{}];

    /**
     * Returns the current context as an object. The object is mutable.
     * @private
     *
     * @return {Object}   Current context
     */
    function context() {
      // Returns the current context, the last in the stack.
      var item = states[states.length - 1];
      return item;
    }

    /**
     * Call context.save() to save the current context and move down the stack.
     *
     * @param  {Object} [item={}]   Optional item to save.
     * @return {Object}             The current context, just as context()
     */
    context.save = function save() {
      var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var current = context();
      var obj = {};
      var key = '';

      // Only inherit whitelisted properties
      for (var i = 0; i < whitelist.length; i++) {
        key = whitelist[i];
        if (typeof current[key] !== 'undefined') {
          obj[key] = current[key];
        }
      }

      // Extend the new object with the saved item
      extend(obj, item);

      // Push it to the stack
      states.push(obj);

      // Return the new current context
      return context();
    };

    /**
     * Restore the previous context. Returns the context.
     *
     * @return {Undefined}   Returns nothing
     */
    context.restore = function restore() {
      // Remove the last element from the stack
      states.splice(states.length - 1, 1);
    };

    return context;
  }

  var styleContext = contextFactory(['stroke', 'fill', 'strokeWidth', 'opacity', 'fontFamily', 'fontSize', 'baseline']);

  function doEvent(state, listeners) {
    if (!Array.isArray(listeners)) {
      return;
    }

    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i](state);
    }
  }

  function updateState(state, index, nodes) {
    state.node = nodes[index];
    state.index = index;
  }

  function traverse(items, parent, matrix, on) {
    var disabled = false;
    var state = {
      siblings: items,
      node: null,
      index: 0
    };
    for (var i = 0, len = items.length; i < len; i++) {
      updateState(state, i, items);
      doEvent(state, on.create);

      disabled = typeof state.node.disabled === 'function' ? state.node.disabled() : state.node.disabled;
      if (disabled) {
        continue;
      }

      // Save the current style context to be able to inherit styles
      state.node = styleContext.save(state.node);

      var displayNode = create$l(state.node.type, state.node);
      if (displayNode) {
        if (state.node.transform) {
          matrix.save();
          resolveTransform(state.node.transform, matrix);
        }

        if (!matrix.isIdentity()) {
          displayNode.modelViewMatrix = matrix.clone();
        }

        parent.addChild(displayNode);
        if (state.node.children) {
          traverse(state.node.children, displayNode, matrix, on);
        }

        if (state.node.transform) {
          matrix.restore();
        }
      }

      // Revert to previous style context
      styleContext.restore();
    }
  }

  function scene(_ref) {
    var items = _ref.items,
        stage = _ref.stage,
        dpi = _ref.dpi,
        _ref$on = _ref.on,
        on = _ref$on === undefined ? {} : _ref$on;

    if (!stage) {
      stage = create$l('stage', dpi);
    }

    traverse(items, stage, new Matrix(), on);

    return stage;
  }

  var LINEBREAK_REGEX = /\n+|\r+|\r\n/;
  var WHITESPACE_REGEX = /\s/;
  var HYPHEN_REGEX = /[a-zA-Z\u00C0-\u00F6\u00F8-\u00FF\u00AD]/;
  var NO_BREAK = 0;
  var MANDATORY = 1;
  var BREAK_ALLOWED = 2;

  function includesLineBreak(c) {
    if (typeof c === 'string') {
      return c.search(LINEBREAK_REGEX) !== -1;
    }
    return String(c).search(LINEBREAK_REGEX) !== -1;
  }

  function includesWhiteSpace(c) {
    return c.search(WHITESPACE_REGEX) !== -1;
  }

  function hyphenationAllowed(c) {
    /* Latin character set. Excluding numbers, sign and symbol characters, but including soft hyphen */
    return c.search(HYPHEN_REGEX) !== -1;
  }

  function resolveBreakOpportunity(chunk, i, chunks, mandatory, noBreakAllowed) {
    if (mandatory.some(function (fn) {
      return fn(chunk, i, chunks);
    })) {
      return MANDATORY;
    }
    if (noBreakAllowed.some(function (fn) {
      return fn(chunk, i, chunks);
    })) {
      return NO_BREAK;
    }

    return BREAK_ALLOWED;
  }

  function cleanEmptyChunks(chunks) {
    if (chunks[0] === '') {
      chunks.shift();
    }
    if (chunks[chunks.length - 1] === '') {
      chunks.pop();
    }
  }

  function clamp$1(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function condition(reverse, index, length) {
    if (reverse) {
      return index >= 0;
    }
    return index < length;
  }

  function stringTokenizer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        string = _ref.string,
        _ref$separator = _ref.separator,
        separator = _ref$separator === undefined ? '' : _ref$separator,
        _ref$reverse = _ref.reverse,
        reverse = _ref$reverse === undefined ? false : _ref$reverse,
        _ref$measureText = _ref.measureText,
        measureText = _ref$measureText === undefined ? function (text) {
      return { width: text.length, height: 1 };
    } : _ref$measureText,
        _ref$mandatoryBreakId = _ref.mandatoryBreakIdentifiers,
        mandatoryBreakIdentifiers = _ref$mandatoryBreakId === undefined ? [includesLineBreak] : _ref$mandatoryBreakId,
        _ref$noBreakAllowedId = _ref.noBreakAllowedIdentifiers,
        noBreakAllowedIdentifiers = _ref$noBreakAllowedId === undefined ? [] : _ref$noBreakAllowedId,
        _ref$suppressIdentifi = _ref.suppressIdentifier,
        suppressIdentifier = _ref$suppressIdentifi === undefined ? [includesWhiteSpace, includesLineBreak, function (chunk) {
      return chunk === '';
    }] : _ref$suppressIdentifi,
        _ref$hyphenationIdent = _ref.hyphenationIdentifiers,
        hyphenationIdentifiers = _ref$hyphenationIdent === undefined ? [hyphenationAllowed] : _ref$hyphenationIdent;

    var chunks = String(string).split(separator);
    cleanEmptyChunks(chunks);
    var length = chunks.length;
    var position = reverse ? length : -1; // Set init position 1 step before or after to make first next call go to first position

    function peek(peekAt) {
      var i = clamp$1(peekAt, 0, length - 1);
      var chunk = chunks[i];
      var textMeasure = measureText(chunk);
      var opportunity = resolveBreakOpportunity(chunk, i, chunks, mandatoryBreakIdentifiers, noBreakAllowedIdentifiers);

      return {
        index: i,
        value: chunk,
        breakOpportunity: opportunity,
        suppress: suppressIdentifier.some(function (fn) {
          return fn(chunk, i, chunks);
        }),
        hyphenation: hyphenationIdentifiers.some(function (fn) {
          return fn(chunk, i, chunks);
        }),
        width: textMeasure.width,
        height: textMeasure.height,
        done: false
      };
    }

    function next(jumpToPosition) {
      if (isNaN(jumpToPosition)) {
        if (reverse) {
          position--;
        } else {
          position++;
        }
      } else {
        position = clamp$1(jumpToPosition, 0, length - 1);
      }

      if (condition(reverse, position, length)) {
        return peek(position);
      }
      return { done: true };
    }

    return {
      next: next,
      peek: peek,
      length: length
    };
  }

  var DEFAULT_LINE_HEIGHT = 1.2;
  var HYPHENS_CHAR = '\u2010';
  var ELLIPSIS_CHAR = '…';

  function resolveMaxAllowedLines(node, measuredLineHeight) {
    var maxHeight = node.maxHeight;
    var maxLines = Math.max(node.maxLines, 1) || Infinity;

    if (isNaN(maxHeight)) {
      return maxLines;
    }

    var lineHeight = node.lineHeight || DEFAULT_LINE_HEIGHT;
    var calcLineHeight = measuredLineHeight * lineHeight;

    return Math.max(1, Math.min(Math.floor(maxHeight / calcLineHeight), maxLines));
  }

  function initState$1(node, measureText) {
    return {
      lines: [],
      line: '',
      width: 0,
      maxLines: resolveMaxAllowedLines(node, measureText(node.text).height),
      maxWidth: node.maxWidth,
      hyphens: {
        enabled: node.hyphens === 'auto',
        char: HYPHENS_CHAR,
        metrics: measureText(HYPHENS_CHAR)
      }
    };
  }

  function newLine(state) {
    state.lines.push(state.line);
    state.line = '';
    state.width = 0;
  }

  function appendToLine(state, token) {
    state.line += token.value;
    state.width += token.width;
  }

  function insertHyphenAndJump(state, token, iterator) {
    if (token.width > state.maxWidth) {
      return token;
    }

    var startIndex = token.index;

    for (var i = 1; i < 5; i++) {
      var pairToken = iterator.peek(token.index - 1);

      if (!token.hyphenation || !pairToken.hyphenation || token.index === 0) {
        return token;
      } else if (state.width + state.hyphens.metrics.width <= state.maxWidth) {
        state.line += state.hyphens.char;
        return token;
      } else if (state.line.length === 1) {
        return token;
      }

      token = iterator.next(startIndex - i);
      state.line = state.line.slice(0, -1);
      state.width -= token.width;
    }

    return token;
  }

  function breakSequence(state, token, measureText) {
    var charTokenIterator = stringTokenizer({
      string: token.value,
      measureText: measureText
    });

    while (state.lines.length < state.maxLines) {
      var charToken = charTokenIterator.next();
      if (charToken.done) {
        break;
      } else if (state.width + charToken.width > state.maxWidth && charToken.breakOpportunity === BREAK_ALLOWED && state.line.length > 0) {
        charToken = state.hyphens.enabled ? insertHyphenAndJump(state, charToken, charTokenIterator) : charToken;
        newLine(state);
        appendToLine(state, charToken);
      } else {
        appendToLine(state, charToken);
      }
    }
  }

  function breakAll(node, measureText) {
    var text = node.text;
    var iterator = stringTokenizer({
      string: text,
      separator: '',
      measureText: measureText,
      noBreakAllowedIdentifiers: [function (chunk, i) {
        return i === 0;
      }]
    });
    var state = initState$1(node, measureText);
    var reduced = true;

    while (state.lines.length < state.maxLines) {
      var token = iterator.next();

      if (token.done) {
        newLine(state);
        reduced = false;
        break;
      } else if (token.breakOpportunity === MANDATORY) {
        newLine(state);
      } else if (state.width + token.width > state.maxWidth && token.breakOpportunity === BREAK_ALLOWED) {
        if (token.suppress) {
          // Token is suppressable and can be ignored
          state.width += token.width;
        } else {
          token = state.hyphens.enabled ? insertHyphenAndJump(state, token, iterator) : token;
          newLine(state);
          appendToLine(state, token);
        }
      } else {
        appendToLine(state, token);
      }
    }

    return {
      lines: state.lines,
      reduced: reduced
    };
  }

  function breakWord(node, measureText) {
    var text = node.text;
    var iterator = stringTokenizer({
      string: text,
      separator: /(\s|-|\u2010)/,
      measureText: measureText
    });
    var state = initState$1(node, measureText);
    var reduced = true;

    while (state.lines.length < state.maxLines) {
      var token = iterator.next();

      if (token.done) {
        newLine(state);
        reduced = false;
        break;
      } else if (token.breakOpportunity === MANDATORY) {
        newLine(state);
      } else if (state.width + token.width > state.maxWidth && token.breakOpportunity === BREAK_ALLOWED) {
        if (token.suppress) {
          // Token is suppressable and can be ignored
          newLine(state);
        } else if (token.width > state.maxWidth) {
          // Single sequence is wider then maxWidth, break sequence into multiple lines
          breakSequence(state, token, measureText);
        } else {
          newLine(state);
          appendToLine(state, token);
        }
      } else {
        appendToLine(state, token);
      }
    }

    return {
      lines: state.lines,
      reduced: reduced
    };
  }

  function generateLineNodes(result, item, lineHeight) {
    var container = { type: 'container', children: [] };

    if (typeof item.id !== 'undefined') {
      // TODO also inherit data attribute and more?
      container.id = item.id;
    }

    var currentY = 0;

    result.lines.forEach(function (line, i) {
      var node = extend({}, item);
      node.text = line;
      node._lineBreak = true; // Flag node as processed to avoid duplicate linebreak run

      if (result.reduced && i === result.lines.length - 1) {
        node.text += ELLIPSIS_CHAR;
      } else {
        delete node.maxWidth;
      }
      node.dy = isNaN(node.dy) ? currentY : node.dy + currentY;
      currentY += lineHeight;
      container.children.push(node);
    });

    return container;
  }

  function shouldLineBreak(item) {
    // If type text and not already broken into lines
    return item.type === 'text' && !item._lineBreak;
  }

  function wrappedMeasureText(node, measureText) {
    return function (text) {
      return measureText({
        text: text,
        fontSize: node.fontSize,
        fontFamily: node.fontFamily
      });
    };
  }

  function resolveLineBreakAlgorithm(node) {
    var WORDBREAK = {
      'break-all': breakAll,
      'break-word': breakWord
    };

    return WORDBREAK[node.wordBreak];
  }

  /**
   * Apply wordBreak rules to text nodes.
   * @ignore
   * @param {function} measureText
   * @returns {function} Event function to convert a text node into multiple nodes
   */
  function onLineBreak(measureText) {
    return function (state) {
      var item = state.node;
      if (shouldLineBreak(item)) {
        var wordBreakFn = resolveLineBreakAlgorithm(item);
        if (!wordBreakFn) {
          return;
        }

        var tm = measureText(item);
        if (tm.width <= item.maxWidth && !includesLineBreak(item.text)) {
          return;
        }

        var lineHeight = tm.height * (item.lineHeight || DEFAULT_LINE_HEIGHT);
        var result = wordBreakFn(item, wrappedMeasureText(item, measureText));

        state.node = generateLineNodes(result, item, lineHeight); // Convert node to container
      }
    };
  }

  function ellipsText(_ref, measureText) {
    var text = _ref.text,
        fontSize = _ref['font-size'],
        fontFamily = _ref['font-family'],
        maxWidth = _ref.maxWidth;
    // eslint-disable-line import/prefer-default-export
    text = typeof text === 'string' ? text : '' + text;
    if (maxWidth === undefined) {
      return text;
    }
    var textWidth = measureText({ text: text, fontSize: fontSize, fontFamily: fontFamily }).width;
    if (textWidth <= maxWidth) {
      return text;
    }

    var min = 0;
    var max = text.length - 1;
    while (min <= max) {
      var reduceIndex = Math.floor((min + max) / 2);
      var reduceText = text.substr(0, reduceIndex) + ELLIPSIS_CHAR;
      textWidth = measureText({ text: reduceText, fontSize: fontSize, fontFamily: fontFamily }).width;
      if (textWidth <= maxWidth) {
        min = reduceIndex + 1;
      } else {
        // textWidth > maxWidth
        max = reduceIndex - 1;
      }
    }
    return text.substr(0, max) + ELLIPSIS_CHAR;
  }

  /**
   * Currently some browsers, IE11 and Edge confirmed, doesn't support the dominant-baseline svg-attribute and
   * the browser that does, have different implementations. Thus giving an unpredictable result when rendering'
   * text and predicting it's position (ex. in collision detection).
   *
   * To supplement and the aid in aligning/positioning text with various items, this function can be used
   * to follow a common heuristic across supported renderers.
   * @ignore
   * @param {object} textNode
   * @param {string|number} [textNode['font-size']=0] - String in px format or number
   * @param {string} [textNode['dominant-baseline']] - If baseline is omitted dominant-baseline is used
   * @param {string} [textNode.baseline]
   * @returns {number} Delta-y required to adjust for baseline
   */
  function baselineHeuristic(textNode) {
    var baseline = textNode.baseline || textNode['dominant-baseline'];
    var dy = 0;

    var fontSize = parseInt(textNode.fontSize || textNode['font-size'], 10) || 0;

    switch (baseline) {
      case 'hanging':
        dy = fontSize * 0.75;
        break;
      case 'text-before-edge':
        dy = fontSize * 0.85;
        break;
      case 'middle':
        dy = fontSize * 0.25;
        break;
      case 'central':
        dy = fontSize * 0.35;
        break;
      case 'mathemetical':
        dy = fontSize / 2;
        break;
      case 'text-after-edge':
      case 'ideographic':
        dy = -fontSize * 0.2;
        break;
      default:
        dy = 0;
        break;
    }

    return dy;
  }

  var heightMeasureCache = {},
      widthMeasureCache = {},
      canvasCache = void 0;

  function measureTextWidth(_ref) {
    var text = _ref.text,
        fontSize = _ref.fontSize,
        fontFamily = _ref.fontFamily;

    var match = widthMeasureCache[text + fontSize + fontFamily];
    if (match !== undefined) {
      return match;
    }
    canvasCache = canvasCache || document.createElement('canvas');
    var g = canvasCache.getContext('2d');
    g.font = fontSize + ' ' + fontFamily;
    var w = g.measureText(text).width;
    widthMeasureCache[text + fontSize + fontFamily] = w;
    return w;
  }

  function measureTextHeight(_ref2) {
    var fontSize = _ref2.fontSize,
        fontFamily = _ref2.fontFamily;

    var match = heightMeasureCache[fontSize + fontFamily];

    if (match !== undefined) {
      return match;
    }
    var text = 'M';
    var height = measureTextWidth({ text: text, fontSize: fontSize, fontFamily: fontFamily }) * 1.2;
    heightMeasureCache[fontSize + fontFamily] = height;
    return height;
  }

  /**
   * @private
   * @param {object} opts
   * @param {string} opts.text - Text to measure
   * @param {string} opts.fontSize - Font size with a unit definition, ex. 'px' or 'em'
   * @param {string} opts.fontFamily - Font family
   * @return {object} Width and height of text in pixels
   * @example
   * measureText({
   *  text: 'my text',
   *  fontSize: '12px',
   *  fontFamily: 'Arial'
   * }); // returns { width: 20, height: 12 }
   */
  function measureText(_ref3) {
    var text = _ref3.text,
        fontSize = _ref3.fontSize,
        fontFamily = _ref3.fontFamily;
    // eslint-disable-line import/prefer-default-export
    var w = measureTextWidth({ text: text, fontSize: fontSize, fontFamily: fontFamily });
    var h = measureTextHeight({ fontSize: fontSize, fontFamily: fontFamily });
    return { width: w, height: h };
  }

  /**
   * Calculates the bounding rectangle of a text node.
   * The bounding rectangle is a approximate of the "em square" seen here (http://www.w3resource.com/html5-canvas/html5-canvas-text.php)
   * @ignore
   * @param {object} attrs - Text node definition
   * @param {number} [attrs.x] - X-coordinate
   * @param {number} [attrs.y] - Y-coordinate
   * @param {number} [attrs.dx] - Delta x-coordinate
   * @param {number} [attrs.dy] - Delta y-coordinate
   * @param {string} [attrs.anchor] - Text anchor
   * @param {number} [attrs.maxWidth] - Maximum allowed text width
   * @return {object} The bounding rectangle
   */
  function calcTextBounds(attrs) {
    var measureFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : measureText;

    var fontSize = attrs['font-size'] || attrs.fontSize;
    var fontFamily = attrs['font-family'] || attrs.fontFamily;
    var textMeasure = measureFn({ text: attrs.text, fontFamily: fontFamily, fontSize: fontSize });
    var calWidth = Math.min(attrs.maxWidth || textMeasure.width, textMeasure.width); // Use actual value if max is not set
    var x = attrs.x || 0;
    var y = attrs.y || 0;
    var dx = attrs.dx || 0;
    var dy = (attrs.dy || 0) + baselineHeuristic(attrs);

    var boundingRect = {
      x: 0,
      y: y + dy - textMeasure.height * 0.75, // Magic number for alphabetical baseline
      width: calWidth,
      height: textMeasure.height
    };

    var anchor = attrs['text-anchor'] || attrs.anchor;

    if (anchor === 'middle') {
      boundingRect.x = x + dx - calWidth / 2;
    } else if (anchor === 'end') {
      boundingRect.x = x + dx - calWidth;
    } else {
      boundingRect.x = x + dx;
    }

    return boundingRect;
  }

  /**
   * Calculates the bounding rectangle of a text node. Including any line breaks.
   * @ignore
   * @param {object} node
   * @param {string} node.text - Text to measure
   * @param {number} [node.x=0] - X-coordinate
   * @param {number} [node.y=0] - Y-coordinate
   * @param {number} [node.dx=0] - Delta x-coordinate
   * @param {number} [node.dy=0] - Delta y-coordinate
   * @param {string} [node.anchor='start'] - Text anchor
   * @param {string} [node.fontSize] - Font size
   * @param {string} [node.fontFamily] - Font family
   * @param {string} [node['font-size']] - Font size
   * @param {string} [node['font-family']] - Font family
   * @param {string} [node.wordBreak] - Word-break option
   * @param {number} [node.maxWidth] - Maximum allowed text width
   * @param {number} [node.maxHeight] - Maximum allowed text height. If both maxLines and maxHeight are set, the property that results in the fewest number of lines is used
   * @param {number} [node.maxLines] - Maximum number of lines allowed.
   * @param {number} [node.lineHeight=1.2] - Line height
   * @param {function} [measureFn] - Optional text measure function
   * @return {object} The bounding rectangle
   */
  function textBounds(node) {
    var measureFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : measureText;

    var lineBreakFn = resolveLineBreakAlgorithm(node);
    if (lineBreakFn) {
      var fontSize = node['font-size'] || node.fontSize;
      var fontFamily = node['font-family'] || node.fontFamily;
      var resolvedLineBreaks = lineBreakFn(node, function (text) {
        return measureFn({ text: text, fontFamily: fontFamily, fontSize: fontSize });
      });
      var nodeCopy = extend({}, node);
      var maxWidth = 0;
      var widestLine = '';
      for (var i = 0, len = resolvedLineBreaks.lines.length; i < len; i++) {
        var line = resolvedLineBreaks.lines[i];
        line += i === len - 1 && resolvedLineBreaks.reduced ? ELLIPSIS_CHAR : '';
        var width = measureFn({ text: line, fontSize: fontSize, fontFamily: fontFamily }).width;
        if (width >= maxWidth) {
          maxWidth = width;
          widestLine = line;
        }
      }
      nodeCopy.text = widestLine;
      var bounds = calcTextBounds(nodeCopy, measureFn);
      var lineHeight = node.lineHeight || DEFAULT_LINE_HEIGHT;
      bounds.height = bounds.height * resolvedLineBreaks.lines.length * lineHeight;

      return bounds;
    }

    return calcTextBounds(node, measureFn);
  }

  /**
   * Get or create a gradient
   * @ignore
   * @param  {Object} g        Canvas 2d context
   * @param  {Object} shape    Current shape (for width/height properties)
   * @param  {Object} gradient The gradient properties
   * @return {Object}          A canvas compatible radial or linear gradient object
   */
  function createCanvasGradient(g, shape, gradient) {
    var orientation = gradient.orientation,
        degree = gradient.degree,
        _gradient$stops = gradient.stops,
        stops = _gradient$stops === undefined ? [] : _gradient$stops;


    var newGradient = null;

    if (orientation === 'radial') {
      var width = shape.width || 0;
      var height = shape.height || 0;

      var theX = shape.x !== undefined ? shape.x : shape.cx;
      var theY = shape.y !== undefined ? shape.y : shape.cy;

      newGradient = g.createRadialGradient(theX + width / 2, theY + height / 2, 1, theX + width / 2, theY + height / 2, shape.r || Math.max(shape.width, shape.height) / 2);
    } else {
      var points = degreesToPoints(degree);

      var _width = shape.width || shape.r * 2;
      var _height = shape.height || shape.r * 2;

      var _theX = shape.x !== undefined ? shape.x : shape.cx - shape.r;
      var _theY = shape.y !== undefined ? shape.y : shape.cy - shape.r;

      newGradient = g.createLinearGradient(_theX + points.x1 * _width, _theY + points.y1 * _height, _theX + points.x2 * _width, _theY + points.y2 * _height);
    }

    for (var i = 0, len = stops.length; i < len; i++) {
      var stop = stops[i];
      newGradient.addColorStop(stop.offset, stop.color);
    }

    return newGradient;
  }

  /**
   * @typedef {object} renderer-container-def
   * @property {number} [x] - x-coordinate
   * @property {number} [y] - y-coordinate
   * @property {number} [width] - Width
   * @property {number} [height] - Height
   * @property {object} [scaleRatio]
   * @property {number} [scaleRatio.x] - Scale ratio on x-axis
   * @property {number} [scaleRatio.y] - Scale ratio on y-axis
   * @property {object} [margin]
   * @property {number} [margin.left] - Left margin
   * @property {number} [margin.top] - Top margin
   */

  /**
   * Create the renderer box
   * @private
   * @param {renderer-container-def} [opts]
   * @returns {renderer-container-def} A svg renderer instance
   */
  function createRendererBox() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height,
        scaleRatio = _ref.scaleRatio,
        margin = _ref.margin;

    var box = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      scaleRatio: {
        x: 1,
        y: 1
      },
      margin: {
        left: 0,
        top: 0
      }
    };

    box.x = isNaN(x) ? box.x : x;
    box.y = isNaN(y) ? box.y : y;
    box.width = isNaN(width) ? box.width : width;
    box.height = isNaN(height) ? box.height : height;
    if (typeof scaleRatio !== 'undefined') {
      box.scaleRatio.x = isNaN(scaleRatio.x) ? box.scaleRatio.x : scaleRatio.x;
      box.scaleRatio.y = isNaN(scaleRatio.y) ? box.scaleRatio.y : scaleRatio.y;
    }
    if (typeof margin !== 'undefined') {
      box.margin.left = isNaN(margin.left) ? 0 : margin.left;
      box.margin.top = isNaN(margin.top) ? 0 : margin.top;
    }

    return box;
  }

  /**
   * Base renderer factory
   * @private
   */
  function create$m() {
    /**
    * @interface
    * @alias renderer
    */
    var renderer = {
      /**
      * Get the element this renderer is attached to
      * @returns {HTMLElement}
      */
      element: function element() {},

      /**
       * Get the root element of the renderer
       * @returns {HTMLElement}
       */
      root: function root() {},

      /**
      * @param {HTMLElement} element - Element to attach renderer to
      * @returns {HTMLElement} Root element of the renderer
      */
      appendTo: function appendTo() {},

      /**
       * @param {node-def[]} nodes - Nodes to render
       * @returns {boolean} True if the nodes where rendered, otherwise false
       */
      render: function render() {
        return false;
      },

      /**
       * Get nodes renderer at area
       * @param {point|circle|rect|line|polygon} geometry - Get nodes that intersects with geometry
       * @returns {SceneNode[]}
       */
      itemsAt: function itemsAt() {
        return [];
      },

      /**
       * Get all nodes matching the provided selector
       * @param {string} selector CSS selector [type, attribute, universal, class]
       * @returns {SceneNode[]} Array of objects containing matching nodes
       */
      findShapes: function findShapes() {
        return [];
      },

      /**
       * Clear all child elements from the renderer root element
       * @returns {renderer} The renderer instance
       */
      clear: function clear() {},

      /**
       * Remove the renderer root element from its parent element
       */
      destory: function destory() {},

      /**
       * Set or Get the size definition of the renderer container.
       * @param {renderer-container-def} [opts] - Size definition
       * @returns {renderer-container-def} The current size definition
       */
      size: function size() {},

      /**
       * @function
       * @param {object} opts
       * @param {string} opts.text - Text to measure
       * @param {string} opts.fontSize - {@link https://www.w3.org/TR/SVG/text.html#FontPropertiesUsedBySVG}
       * @param {string} opts.fontFamily - {@link https://www.w3.org/TR/SVG/text.html#FontPropertiesUsedBySVG}
       * @returns {object} Width and height of text
       * @example
       * measureText({
       *  text: 'my text',
       *  fontSize: '12px',
       *  fontFamily: 'Arial'
       * }); // returns { width: 20, height: 12 }
       */
      measureText: measureText,

      /**
       * Calculates the bounding rectangle of a text node. Including any potential line breaks.
       * @function
       * @param {node--text-def} node
       * @return {rect} The bounding rectangle
       */
      textBounds: textBounds
    };

    return renderer;
  }

  var reg$5 = registryFactory();

  function toLineDash(p) {
    if (Array.isArray(p)) {
      return p;
    } else if (typeof p === 'string') {
      if (p.indexOf(',') !== -1) {
        return p.split(',');
      }
      return p.split(' ');
    }
    return [];
  }

  function dpiScale(g) {
    var dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
    var backingStorePixelRatio = g.webkitBackingStorePixelRatio || g.mozBackingStorePixelRatio || g.msBackingStorePixelRatio || g.oBackingStorePixelRatio || g.backingStorePixelRatio || 1;
    return dpr / backingStorePixelRatio;
  }

  function resolveMatrix(p, g) {
    g.setTransform(p[0][0], p[1][0], p[0][1], p[1][1], p[0][2], p[1][2]);
  }

  function applyContext(g, s, shapeToCanvasMap) {
    var computed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var computedKeys = Object.keys(computed);

    for (var i = 0, len = shapeToCanvasMap.length; i < len; i++) {
      var cmd = shapeToCanvasMap[i];

      var shapeCmd = cmd[0];
      var canvasCmd = cmd[1];
      var convertCmd = cmd[2];

      if (shapeCmd in s.attrs && !(canvasCmd in computed) && g[canvasCmd] !== s.attrs[shapeCmd]) {
        var val = convertCmd ? convertCmd(s.attrs[shapeCmd]) : s.attrs[shapeCmd];
        if (typeof g[canvasCmd] === 'function') {
          g[canvasCmd](val);
        } else {
          g[canvasCmd] = val;
        }
      }
    }

    for (var _i = 0, _len = computedKeys.length; _i < _len; _i++) {
      var key = computedKeys[_i];
      g[key] = computed[key];
    }
  }

  function renderShapes(shapes, g, shapeToCanvasMap) {
    for (var i = 0, len = shapes.length; i < len; i++) {
      var shape = shapes[i];
      var computed = {};
      g.save();

      // Gradient check
      if (shape.attrs && (shape.attrs.fill || shape.attrs.stroke)) {
        if (shape.attrs.fill && _typeof(shape.attrs.fill) === 'object' && shape.attrs.fill.type === 'gradient') {
          computed.fillStyle = createCanvasGradient(g, shape.attrs, shape.attrs.fill);
        }
        if (shape.attrs.stroke && _typeof(shape.attrs.stroke) === 'object' && shape.attrs.stroke.type === 'gradient') {
          computed.strokeStyle = createCanvasGradient(g, shape.attrs, shape.attrs.stroke);
        }
      }

      applyContext(g, shape, shapeToCanvasMap, computed);

      if (shape.modelViewMatrix) {
        resolveMatrix(shape.modelViewMatrix.elements, g);
      }

      if (reg$5.has(shape.type)) {
        reg$5.get(shape.type)(shape.attrs, {
          g: g,
          doFill: 'fill' in shape.attrs && shape.attrs.fill !== 'none',
          doStroke: 'stroke' in shape.attrs && shape.attrs['stroke-width'] !== 0
        });
      }
      if (shape.children) {
        renderShapes(shape.children, g, shapeToCanvasMap);
      }
      g.restore();
    }
  }

  /**
   * Create a new canvas renderer
   * @typedef {function} canvasRendererFactory
   * @param {function} sceneFn - Scene factory
   * @returns {renderer} A canvas renderer instance
   */
  function renderer() {
    var sceneFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : scene;

    var el = void 0;
    var scene$$1 = void 0;
    var hasChangedRect = false;
    var rect = createRendererBox();
    var shapeToCanvasMap = [['fill', 'fillStyle'], ['stroke', 'strokeStyle'], ['opacity', 'globalAlpha'], ['globalAlpha', 'globalAlpha'], ['stroke-width', 'lineWidth'], ['stroke-dasharray', 'setLineDash', toLineDash]];

    var canvasRenderer = create$m();

    canvasRenderer.element = function () {
      return el;
    };

    canvasRenderer.root = function () {
      return el;
    };

    canvasRenderer.appendTo = function (element) {
      if (!el) {
        el = element.ownerDocument.createElement('canvas');
        el.style.position = 'absolute';
        el.style['-webkit-font-smoothing'] = 'antialiased';
        el.style['-moz-osx-font-smoothing'] = 'antialiased';
        el.style.pointerEvents = 'none';
      }

      element.appendChild(el);

      return el;
    };

    canvasRenderer.render = function (shapes) {
      if (!el) {
        return false;
      }

      var g = el.getContext('2d');
      var dpiRatio = dpiScale(g);
      var scaleX = rect.scaleRatio.x;
      var scaleY = rect.scaleRatio.y;

      if (hasChangedRect) {
        el.style.left = Math.round(rect.margin.left + rect.x * scaleX) + 'px';
        el.style.top = Math.round(rect.margin.top + rect.y * scaleY) + 'px';
        el.style.width = Math.round(rect.width * scaleX) + 'px';
        el.style.height = Math.round(rect.height * scaleY) + 'px';
        el.width = Math.round(rect.width * dpiRatio * scaleX);
        el.height = Math.round(rect.height * dpiRatio * scaleY);
      }

      var sceneContainer = {
        type: 'container',
        children: shapes
      };

      if (dpiRatio !== 1 || scaleX !== 1 || scaleY !== 1) {
        sceneContainer.transform = 'scale(' + dpiRatio * scaleX + ', ' + dpiRatio * scaleY + ')';
      }

      var newScene = sceneFn({
        items: [sceneContainer],
        dpi: dpiRatio,
        on: {
          create: [onLineBreak(canvasRenderer.measureText)]
        }
      });
      var hasChangedScene = scene$$1 ? !newScene.equals(scene$$1) : true;

      var doRender = hasChangedRect || hasChangedScene;
      if (doRender) {
        canvasRenderer.clear();
        renderShapes(newScene.children, g, shapeToCanvasMap);
      }

      hasChangedRect = false;
      scene$$1 = newScene;
      return doRender;
    };

    canvasRenderer.itemsAt = function (input) {
      return scene$$1 ? scene$$1.getItemsFrom(input) : [];
    };

    canvasRenderer.findShapes = function (selector) {
      return scene$$1 ? scene$$1.findShapes(selector) : [];
    };

    canvasRenderer.clear = function () {
      if (el) {
        el.width = el.width;
      }
      scene$$1 = null;

      return canvasRenderer;
    };

    canvasRenderer.size = function (opts) {
      if (opts) {
        var newRect = createRendererBox(opts);

        if (JSON.stringify(rect) !== JSON.stringify(newRect)) {
          hasChangedRect = true;
          rect = newRect;
        }
      }

      return rect;
    };

    canvasRenderer.destroy = function () {
      if (el) {
        if (el.parentElement) {
          el.parentElement.removeChild(el);
        }
        el = null;
      }
      scene$$1 = null;
    };

    return canvasRenderer;
  }

  function register$1(type, renderFn) {
    reg$5.add(type, renderFn);
  }

  function render$4(rect, _ref) {
    var g = _ref.g,
        doFill = _ref.doFill,
        doStroke = _ref.doStroke;

    g.beginPath();
    g.rect(rect.x, rect.y, rect.width, rect.height);
    if (doFill) {
      g.fill();
    }
    if (doStroke) {
      g.stroke();
    }
  }

  function render$5(circle, _ref) {
    var g = _ref.g,
        doFill = _ref.doFill,
        doStroke = _ref.doStroke;

    g.beginPath();
    g.moveTo(circle.cx + circle.r, circle.cy);
    g.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2, false);
    if (doFill) {
      g.fill();
    }
    if (doStroke) {
      g.stroke();
    }
  }

  function render$6(line, _ref) {
    var g = _ref.g,
        doStroke = _ref.doStroke;

    g.beginPath();
    g.moveTo(line.x1, line.y1);
    g.lineTo(line.x2, line.y2);
    if (doStroke) {
      g.stroke();
    }
  }

  // Source: https://en.wikipedia.org/wiki/Bi-directional_text and http://www.unicode.org/Public/6.0.0/ucd/UnicodeData.txt
  // 3 types of strong direction characters: L (strong left-to-right), R(strong right-to-left, Hebrew) and AL(strong right-to-left, Arabic language)
  var rangesOfLChars = '[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0-\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376-\u037D\u0386\u0388-\u03F5\u03F7-\u0482\u048A-\u0589\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u097F\u0982-\u09B9\u09BD-\u09C0\u09C7-\u09CC\u09CE-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u0A03-\u0A39\u0A3E-\u0A40\u0A59-\u0A6F\u0A72-\u0A74\u0A83-\u0AB9\u0ABD-\u0AC0\u0AC9-\u0ACC\u0AD0-\u0AE1\u0AE6-\u0AEF\u0B02-\u0B39\u0B3D-\u0B3E\u0B40\u0B47-\u0B4C\u0B57-\u0B61\u0B66-\u0B77\u0B83-\u0BBF\u0BC1-\u0BCC\u0BD0-\u0BF2\u0C01-\u0C3D\u0C41-\u0C44\u0C58-\u0C61\u0C66-\u0C6F\u0C7F-\u0CB9\u0CBD-\u0CCB\u0CD5-\u0CE1\u0CE6-\u0D40\u0D46-\u0D4C\u0D4E-\u0D61\u0D66-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E4F-\u0EB0\u0EB2-\u0EB3\u0EBD-\u0EC6\u0ED0-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u102C\u1031\u1038\u103B-\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083-\u1084\u1087-\u108C\u108E-\u109C\u109E-\u135A\u1360-\u138F\u13A0-\u13F4\u1401-\u167F\u1681-\u169A\u16A0-\u1711\u1720-\u1731\u1735-\u1751\u1760-\u1770\u1780-\u17B6\u17BE-\u17C5\u17C7-\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u18A8\u18AA-\u191C\u1923-\u1926\u1929-\u1931\u1933-\u1938\u1946-\u19DA\u1A00-\u1A16\u1A19-\u1A55\u1A57\u1A61\u1A63-\u1A64\u1A6D-\u1A72\u1A80-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B6A\u1B74-\u1B7C\u1B82-\u1BA1\u1BA6-\u1BA7\u1BAA-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2-\u1C2B\u1C34-\u1C35\u1C3B-\u1C7F\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1DBF\u1E00-\u1FBC\u1FBE\u1FC2-\u1FCC\u1FD0-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FFC\u200E\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E-\u214F\u2160-\u2188\u2336-\u237A\u2395\u249C-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2CE4\u2CEB-\u2CEE\u2D00-\u2D70\u2D80-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u31BA\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DB5\u4E00-\uA48C\uA4D0-\uA60C\uA610-\uA66E\uA680-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA925\uA92E-\uA946\uA952-\uA97C\uA983-\uA9B2\uA9B4-\uA9B5\uA9BA-\uA9BB\uA9BD-\uAA28\uAA2F-\uAA30\uAA33-\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2-\uABE4\uABE6-\uABE7\uABE9-\uABEC\uABF0-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDC]';
  var rangesOfRChars = '[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u07C0-\u07EA\u07F4-\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB4F]';
  var rangesOfALChars = '[\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u070D\u0710\u0712-\u072F\u074D-\u07A5\u07B1\uFB50-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]';
  // let rangesOfNChars = '[\u0009-\u000D\u001C-\u0022\u0026-\u002A\u003B-\u0040\u005B-\u0060\u007B-\u007E\u0085\u00A1\u00A6-\u00A9\u00AB-\u00AC\u00AE-\u00AF\u00B4\u00B6-\u00B8\u00BB-\u00BF\u00D7\u00F7\u02B9-\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u02FF\u0374-\u0375\u037E-\u0385\u0387\u03F6\u058A\u0606-\u0607\u060E-\u060F\u06DE\u06E9\u07F6-\u07F9\u0BF3-\u0BF8\u0BFA\u0C78-\u0C7E\u0F3A-\u0F3D\u1390-\u1399\u1400\u1680\u169B-\u169C\u17F0-\u180A\u180E\u1940-\u1945\u19DE-\u19FF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD-\u200A\u2010-\u2029\u2035-\u2043\u2045-\u205F\u207C-\u207E\u208C-\u208E\u2100-\u2101\u2103-\u2106\u2108-\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u213A-\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189-\u2211\u2214-\u2335\u237B-\u2394\u2396-\u2487\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B59\u2CE5-\u2CEA\u2CF9-\u2CFF\u2E00-\u3004\u3008-\u3020\u3030\u3036-\u3037\u303D-\u303F\u309B-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D-\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE-\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA673\uA67E-\uA67F\uA700-\uA721\uA788\uA828-\uA82B\uA874-\uA877\uFD3E-\uFD3F\uFDFD\uFE10-\uFE19\uFE30-\uFE4F\uFE51\uFE54\uFE56-\uFE5E\uFE60-\uFE61\uFE64-\uFE68\uFE6B\uFF01-\uFF02\uFF06-\uFF0A\uFF1B-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE2-\uFFE4\uFFE8-\uFFFD]';
  var rangesOfLRgExp = new RegExp(rangesOfLChars);
  var rangesOfRRgExp = new RegExp(rangesOfRChars);
  var rangesOfALRgExp = new RegExp(rangesOfALChars);
  // let rangesOfNRgExp = new RegExp(rangesOfNChars);
  // let lrm = String.fromCharCode(8206); // left-to-right marker
  // let rlm = String.fromCharCode(8207); // right-to-left marker

  function isLtrChar(c) {
    return rangesOfLRgExp.test(c);
  }

  function isRtlChar(c) {
    return rangesOfRRgExp.test(c) || rangesOfALRgExp.test(c);
  }

  function detectTextDirection(s) {
    var n = s ? s.length : 0,
        i = void 0,
        c = void 0;
    for (i = 0; i < n; i++) {
      c = s[i];
      if (isLtrChar(c)) {
        return 'ltr';
      }
      if (isRtlChar(c)) {
        return 'rtl';
      }
    }
    return 'ltr';
  }

  var textAnchorRTLMap = {
    start: 'end',
    end: 'start',
    center: 'center',
    middle: 'middle'
  };

  /* let flippedTextAnchor = true;
  let detected = false;
  export function detectRtlSvgSupport(ns, ownerDoc) {
    if (!detected) {
      const body = ownerDoc.body;
      if (body) {
        const rtlTestSVG = ownerDoc.createElementNS(ns, 'svg');
        const textNode = ownerDoc.createElementNS(ns, 'text');
        const group = ownerDoc.createElementNS(ns, 'g');

        rtlTestSVG.setAttribute('xmlns', ns);
        rtlTestSVG.setAttribute('style', 'position: absolute; width: 100px; height: 100px; top: -100px; left: 0px');

        textNode.setAttribute('text-anchor', 'start');
        textNode.setAttribute('direction', 'rtl');
        textNode.setAttribute('font-size', '14px');
        textNode.setAttribute('x', 50);
        textNode.setAttribute('y', 50);
        textNode.textContent = 'ثعبان';

        group.appendChild(textNode);
        rtlTestSVG.appendChild(group);
        body.appendChild(rtlTestSVG);

        flippedTextAnchor = textNode.getBoundingClientRect().left < 50;
        body.removeChild(rtlTestSVG);
      }
    }
    detected = true;
  } */

  function flipTextAnchor(value, dir) {
    if (dir === 'rtl') {
      return textAnchorRTLMap[value];
    }
    return value;
  }

  function render$7(t, _ref) {
    var g = _ref.g;

    var text = ellipsText(t, measureText);

    g.font = t['font-size'] + ' ' + t['font-family'];
    g.canvas.dir = detectTextDirection(t.text);
    var textAlign = t['text-anchor'] === 'middle' ? 'center' : t['text-anchor'];
    g.textAlign = flipTextAnchor(textAlign, g.canvas.dir);

    var bdy = baselineHeuristic(t);

    g.fillText(text, t.x + t.dx, t.y + t.dy + bdy);
  }

  function render$8(path, _ref) {
    var g = _ref.g,
        doStroke = _ref.doStroke,
        doFill = _ref.doFill;

    var p = new Path2D(path.d);
    if (doFill) {
      g.fill(p);
    }
    if (doStroke) {
      g.stroke(p);
    }
  }

  register$1('rect', render$4);
  register$1('circle', render$5);
  register$1('line', render$6);
  register$1('path', render$8);
  register$1('text', render$7);

  function rendererComponent(picasso) {
    picasso.renderer('canvas', renderer);
  }

  function diff$1(from, to) {
    var added = [];
    var items = void 0;
    var removed = [];
    var updatedNew = [];
    var updatedOld = [];
    var fromIds = void 0;
    var toIds = void 0;
    var idMapper = function idMapper(a) {
      return a.id;
    };
    var nodeMapper = function nodeMapper(node, i) {
      var id = void 0;
      if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object') {
        if ('id' in node) {
          id = node.id;
        } else {
          id = i;
        }
      } else {
        id = node;
      }
      return {
        content: node,
        id: id + '__' + (node.type || '')
      };
    };

    if (!from.isTree) {
      from = from.map(nodeMapper);
    }

    to = to.map(nodeMapper);

    fromIds = from.map(idMapper);
    toIds = to.map(idMapper);
    // TODO - handle duplicate values

    // added = to.filter( v => fromIds.indexOf( v.id ) < 0 );
    // updatedNew = to.filter( v => fromIds.indexOf( v.id ) >= 0 );
    // removed = from.filter( v => toIds.indexOf( v.id ) < 0 );
    // updatedOld = from.filter( v => toIds.indexOf( v.id ) >= 0 );

    for (var i = 0, len = to.length; i < len; i++) {
      var idx = fromIds.indexOf(to[i].id);
      if (idx === -1) {
        added.push(to[i]);
      } else {
        updatedNew.push(to[i]);
      }
    }

    for (var _i = 0, _len = from.length; _i < _len; _i++) {
      var _idx = toIds.indexOf(from[_i].id);
      if (_idx === -1) {
        removed.push(from[_i]);
      } else {
        updatedOld.push(from[_i]);
      }
    }

    for (var _i2 = 0, _len2 = added.length; _i2 < _len2; _i2++) {
      if (added[_i2].content.children) {
        added[_i2].diff = diff$1([], added[_i2].content.children);
        added[_i2].children = added[_i2].diff.updatedNew.concat(added[_i2].diff.added);
        added[_i2].children.isTree = true;
      }
    }

    for (var _i3 = 0, _len3 = updatedNew.length; _i3 < _len3; _i3++) {
      updatedNew[_i3].diff = diff$1(updatedOld[_i3].children || [], updatedNew[_i3].content.children || []);
      updatedNew[_i3].object = updatedOld[_i3].object;
      updatedNew[_i3].children = updatedNew[_i3].diff.items;
    }

    items = updatedNew.concat(added);

    added.isTree = true;
    removed.isTree = true;
    updatedNew.isTree = true;
    updatedOld.isTree = true;
    items.isTree = true;

    return {
      added: added,
      updatedNew: updatedNew,
      updatedOld: updatedOld,
      removed: removed,
      items: items
    };
  }

  function createNodes(nodes, parent, create) {
    for (var i = 0, len = nodes.length; i < len; i++) {
      nodes[i].object = create(nodes[i].content.type, parent);
    }
  }

  function destroyNodes(nodes, destroy) {
    for (var i = 0, len = nodes.length; i < len; i++) {
      if (nodes[i].object !== null && typeof nodes[i].object !== 'undefined') {
        destroy(nodes[i].object);
        nodes[i].object = null;
      }
    }
  }

  function updateNodes(nodes, creator, maintainer, destroyer) {
    var item = void 0;
    for (var i = 0, len = nodes.length; i < len; i++) {
      item = nodes[i];
      if (item.object !== null && typeof item.object !== 'undefined') {
        maintainer(item.object, item.content);
        if (item.diff) {
          createNodes(item.diff.added, item.object, creator);
          destroyNodes(item.diff.removed, destroyer);
          updateNodes(item.diff.items, creator, maintainer, destroyer);
        }
      }
    }
  }

  function createTree(oldItems, newItems, root, creator, maintainer, destroyer) {
    var d = diff$1(oldItems, newItems);

    createNodes(d.added, root, creator);
    destroyNodes(d.removed, destroyer);
    updateNodes(d.items, creator, maintainer, destroyer);

    return d.items;
  }

  var svgNs = 'http://www.w3.org/2000/svg';

  var creator = function creator(type, parent) {
    if (!type || typeof type !== 'string') {
      throw new Error('Invalid type: ' + type);
    }

    var el = parent.ownerDocument.createElementNS(svgNs, type === 'container' ? 'g' : type);

    parent.appendChild(el);
    return el;
  };

  var destroyer = function destroyer(el) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };

  var maintainer = function maintainer(element, item) {
    for (var attr in item.attrs) {
      if (attr === 'text') {
        element.setAttribute('style', 'white-space: pre');
        element.textContent = ellipsText(item.attrs, measureText);
        var dir = detectTextDirection(item.attrs.text);
        if (dir === 'rtl') {
          element.setAttribute('direction', 'rtl');
          element.setAttribute('dir', 'rtl');
          element.setAttribute('text-anchor', flipTextAnchor(element.getAttribute('text-anchor'), dir));
        }
      } else if (item.type === 'text' && (attr === 'dy' || attr === 'dominant-baseline')) {
        var dy = +element.getAttribute(attr) || 0;
        var val = 0;
        if (attr === 'dominant-baseline') {
          val = baselineHeuristic(item.attrs);
        } else {
          val = item.attrs[attr];
        }
        element.setAttribute('dy', val + dy);
      } else {
        element.setAttribute(attr, item.attrs[attr]);
      }
    }

    if (typeof item.data === 'string' || typeof item.data === 'number' || typeof item.data === 'boolean') {
      element.setAttribute('data', item.data);
    } else if (_typeof(item.data) === 'object' && item.data !== null) {
      for (var d in item.data) {
        if (typeof item.data[d] === 'string' || typeof item.data[d] === 'number' || typeof item.data[d] === 'boolean') {
          element.setAttribute('data-' + d, item.data[d]);
        }
      }
    }
  };

  var TreeItemRenderer = function () {
    /**
     * Constructor
     * @private
     * @param  {TreeCreator} treeCreator - Function used to create the DOM tree..
     * @param  {SVGCreator} nodeCreator - Function used to create nodes.
     * @param  {SVGMaintainer} nodeMaintainer - Function used to update nodes.
     * @param  {SVGDestroyer} nodeDestroyer - Function used to destroy nodes.
     */
    function TreeItemRenderer(treeCreator, nodeCreator, nodeMaintainer, nodeDestroyer) {
      classCallCheck(this, TreeItemRenderer);

      this.create = treeCreator;
      this.nodeCreator = nodeCreator;
      this.nodeMaintainer = nodeMaintainer;
      this.nodeDestroyer = nodeDestroyer;
    }

    createClass(TreeItemRenderer, [{
      key: 'render',
      value: function render(newItems, root) {
        return this.create([], newItems, root, this.nodeCreator, this.nodeMaintainer, this.nodeDestroyer);
      }
    }]);
    return TreeItemRenderer;
  }();

  function tree() {
    return new TreeItemRenderer(createTree, creator, maintainer, destroyer);
  }

  /* eslint import/prefer-default-export: 0 */

  /**
   * Hash an object
   * Modified version of Java's HashCode function
   * Source: {@link http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/}
   * @ignore
   *
   * @param  {Object} item Item to hash
   * @return {String}      Unique hash id
   */
  function hashObject(item) {
    var hash = 0;
    var i = void 0;
    var chr = void 0;
    var len = void 0;

    item = JSON.stringify(item);

    if (item.length === 0) {
      return hash;
    }

    for (i = 0, len = item.length; i < len; i++) {
      chr = item.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash &= hash; // Convert to 32bit integer
    }

    return hash;
  }

  var gradients = [];
  var gradientHashMap = {};

  /**
   * If this attr (fill or stroke) has a gradient, apply it.
   * @ignore
   * @param  {Object} item Item with item[attr]
   * @param  {String} attr The attribute to search for gradient (fill or stroke)
   * @param  {String} url  URL for handling base href
   */
  function checkGradient() {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fill';
    var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var gradientHash = hashObject(item[attr]);
    var gradientId = '';

    if (gradientHashMap[gradientHash] !== undefined) {
      gradientId = gradientHashMap[gradientHash];
    } else {
      var _item$attr = item[attr],
          orientation = _item$attr.orientation,
          degree = _item$attr.degree,
          _item$attr$stops = _item$attr.stops,
          stops = _item$attr$stops === undefined ? [] : _item$attr$stops;

      var gradient = {};

      if (degree === undefined) {
        degree = 90;
      }

      // Default to linear
      if (orientation === 'radial') {
        gradient.type = 'radialGradient';
      } else {
        gradient = degreesToPoints(degree);
        gradient.type = 'linearGradient';
      }

      gradient.id = 'picasso-gradient-' + gradientHash;
      gradient.children = stops.map(function (_ref) {
        var offset = _ref.offset,
            color = _ref.color,
            opacity = _ref.opacity;
        return {
          type: 'stop',
          offset: offset * 100 + '%',
          style: 'stop-color:' + color + ';stop-opacity:' + (opacity || 1)
        };
      });

      gradients.push(gradient);
      gradientHashMap[gradientHash] = gradient.id;
      gradientId = gradient.id;
    }

    return 'url(' + url + '#' + gradientId + ')';
  }

  /**
   * Reset the gradients between rendering
   * @ignore
   */
  function resetGradients() {
    gradients = [];
    gradientHashMap = {};
  }

  function onGradient(state) {
    var url = '';
    if (typeof window !== 'undefined') {
      url = window.location.href.split('#')[0];
    }

    var item = state.node;
    if (item.fill && _typeof(item.fill) === 'object' && item.fill.type === 'gradient') {
      item.fill = checkGradient(item, 'fill', url);
    }

    if (item.stroke && _typeof(item.stroke) === 'object' && item.stroke.type === 'gradient') {
      item.stroke = checkGradient(item, 'stroke', url);
    }
  }

  function createDefsNode() {
    return {
      type: 'defs',
      children: gradients,
      disabled: function disabled() {
        return gradients.length === 0;
      }
    };
  }

  /**
   * Create a new svg renderer
   * @typedef {function} svgRendererFactory
   * @param {function} treeFactory - Node tree factory
   * @param {string} ns - Namespace definition
   * @param {function} sceneFn - Scene factory
   * @returns {renderer} A svg renderer instance
   */
  function renderer$1() {
    var treeFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : tree;
    var ns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : svgNs;
    var sceneFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : scene;

    var tree$$1 = treeFn();
    var el = void 0;
    var group = void 0;
    var hasChangedRect = false;
    var rect = createRendererBox();
    var scene$$1 = void 0;

    var svg = create$m();

    svg.element = function () {
      return el;
    };

    svg.root = function () {
      return group;
    };

    svg.appendTo = function (element) {
      if (!el) {
        el = element.ownerDocument.createElementNS(ns, 'svg');
        el.style.position = 'absolute';
        el.style['-webkit-font-smoothing'] = 'antialiased';
        el.style['-moz-osx-font-smoothing'] = 'antialiased';
        el.style.pointerEvents = 'none';
        el.setAttribute('xmlns', ns);
        group = element.ownerDocument.createElementNS(ns, 'g');
        group.style.pointerEvents = 'auto';
        el.appendChild(group);
      }

      element.appendChild(el);

      return el;
    };

    svg.render = function (nodes) {
      if (!el) {
        return false;
      }

      var scaleX = rect.scaleRatio.x;
      var scaleY = rect.scaleRatio.y;

      if (hasChangedRect) {
        el.style.left = Math.round(rect.margin.left + rect.x * scaleX) + 'px';
        el.style.top = Math.round(rect.margin.top + rect.y * scaleY) + 'px';
        el.setAttribute('width', Math.round(rect.width * scaleX));
        el.setAttribute('height', Math.round(rect.height * scaleY));
      }

      resetGradients();

      var sceneContainer = {
        type: 'container',
        children: Array.isArray(nodes) ? [].concat(toConsumableArray(nodes), [createDefsNode()]) : nodes
      };

      if (scaleX !== 1 || scaleY !== 1) {
        sceneContainer.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
      }

      var newScene = sceneFn({
        items: [sceneContainer],
        on: {
          create: [onGradient, onLineBreak(svg.measureText)]
        }
      });
      var hasChangedScene = scene$$1 ? !newScene.equals(scene$$1) : true;

      var doRender = hasChangedRect || hasChangedScene;
      if (doRender) {
        svg.clear();
        tree$$1.render(newScene.children, group);
      }

      hasChangedRect = false;
      scene$$1 = newScene;
      return doRender;
    };

    svg.itemsAt = function (input) {
      return scene$$1 ? scene$$1.getItemsFrom(input) : [];
    };

    svg.findShapes = function (selector) {
      return scene$$1 ? scene$$1.findShapes(selector) : [];
    };

    svg.clear = function () {
      if (!group) {
        return svg;
      }
      scene$$1 = null;
      var g = group.cloneNode(false);
      el.replaceChild(g, group);
      group = g;
      return svg;
    };

    svg.destroy = function () {
      if (el && el.parentElement) {
        el.parentElement.removeChild(el);
      }
      el = null;
      group = null;
    };

    svg.size = function (opts) {
      if (opts) {
        var newRect = createRendererBox(opts);

        if (JSON.stringify(rect) !== JSON.stringify(newRect)) {
          hasChangedRect = true;
          rect = newRect;
        }
      }

      return rect;
    };

    return svg;
  }

  function rendererComponent$1(picasso) {
    picasso.renderer('svg', renderer$1);
  }

  function vnode(sel, data, children, text, elm) {
      var key = data === undefined ? undefined : data.key;
      return { sel: sel, data: data, children: children,
          text: text, elm: elm, key: key };
  }

  var array$3 = Array.isArray;
  function primitive(s) {
      return typeof s === 'string' || typeof s === 'number';
  }

  function createElement(tagName) {
      return document.createElement(tagName);
  }
  function createElementNS(namespaceURI, qualifiedName) {
      return document.createElementNS(namespaceURI, qualifiedName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(elm) {
      return elm.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function getTextContent(node) {
      return node.textContent;
  }
  function isElement(node) {
      return node.nodeType === 1;
  }
  function isText(node) {
      return node.nodeType === 3;
  }
  function isComment(node) {
      return node.nodeType === 8;
  }
  var htmlDomApi = {
      createElement: createElement,
      createElementNS: createElementNS,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      getTextContent: getTextContent,
      isElement: isElement,
      isText: isText,
      isComment: isComment
  };

  function isUndef(s) {
      return s === undefined;
  }
  function isDef(s) {
      return s !== undefined;
  }
  var emptyNode = vnode('', {}, [], undefined, undefined);
  function sameVnode(vnode1, vnode2) {
      return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
  }
  function isVnode(vnode$$1) {
      return vnode$$1.sel !== undefined;
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i,
          map = {},
          key,
          ch;
      for (i = beginIdx; i <= endIdx; ++i) {
          ch = children[i];
          if (ch != null) {
              key = ch.key;
              if (key !== undefined) map[key] = i;
          }
      }
      return map;
  }
  var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
  function init$1(modules, domApi) {
      var i,
          j,
          cbs = {};
      var api = domApi !== undefined ? domApi : htmlDomApi;
      for (i = 0; i < hooks.length; ++i) {
          cbs[hooks[i]] = [];
          for (j = 0; j < modules.length; ++j) {
              var hook = modules[j][hooks[i]];
              if (hook !== undefined) {
                  cbs[hooks[i]].push(hook);
              }
          }
      }
      function emptyNodeAt(elm) {
          var id = elm.id ? '#' + elm.id : '';
          var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
          return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
      }
      function createRmCb(childElm, listeners) {
          return function rmCb() {
              if (--listeners === 0) {
                  var parent_1 = api.parentNode(childElm);
                  api.removeChild(parent_1, childElm);
              }
          };
      }
      function createElm(vnode$$1, insertedVnodeQueue) {
          var i,
              data = vnode$$1.data;
          if (data !== undefined) {
              if (isDef(i = data.hook) && isDef(i = i.init)) {
                  i(vnode$$1);
                  data = vnode$$1.data;
              }
          }
          var children = vnode$$1.children,
              sel = vnode$$1.sel;
          if (sel === '!') {
              if (isUndef(vnode$$1.text)) {
                  vnode$$1.text = '';
              }
              vnode$$1.elm = api.createComment(vnode$$1.text);
          } else if (sel !== undefined) {
              // Parse selector
              var hashIdx = sel.indexOf('#');
              var dotIdx = sel.indexOf('.', hashIdx);
              var hash = hashIdx > 0 ? hashIdx : sel.length;
              var dot = dotIdx > 0 ? dotIdx : sel.length;
              var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
              var elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
              if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
              if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
              for (i = 0; i < cbs.create.length; ++i) {
                  cbs.create[i](emptyNode, vnode$$1);
              }if (array$3(children)) {
                  for (i = 0; i < children.length; ++i) {
                      var ch = children[i];
                      if (ch != null) {
                          api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                      }
                  }
              } else if (primitive(vnode$$1.text)) {
                  api.appendChild(elm, api.createTextNode(vnode$$1.text));
              }
              i = vnode$$1.data.hook; // Reuse variable
              if (isDef(i)) {
                  if (i.create) i.create(emptyNode, vnode$$1);
                  if (i.insert) insertedVnodeQueue.push(vnode$$1);
              }
          } else {
              vnode$$1.elm = api.createTextNode(vnode$$1.text);
          }
          return vnode$$1.elm;
      }
      function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
          for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (ch != null) {
                  api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
              }
          }
      }
      function invokeDestroyHook(vnode$$1) {
          var i,
              j,
              data = vnode$$1.data;
          if (data !== undefined) {
              if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode$$1);
              for (i = 0; i < cbs.destroy.length; ++i) {
                  cbs.destroy[i](vnode$$1);
              }if (vnode$$1.children !== undefined) {
                  for (j = 0; j < vnode$$1.children.length; ++j) {
                      i = vnode$$1.children[j];
                      if (i != null && typeof i !== "string") {
                          invokeDestroyHook(i);
                      }
                  }
              }
          }
      }
      function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
          for (; startIdx <= endIdx; ++startIdx) {
              var i_1 = void 0,
                  listeners = void 0,
                  rm = void 0,
                  ch = vnodes[startIdx];
              if (ch != null) {
                  if (isDef(ch.sel)) {
                      invokeDestroyHook(ch);
                      listeners = cbs.remove.length + 1;
                      rm = createRmCb(ch.elm, listeners);
                      for (i_1 = 0; i_1 < cbs.remove.length; ++i_1) {
                          cbs.remove[i_1](ch, rm);
                      }if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                          i_1(ch, rm);
                      } else {
                          rm();
                      }
                  } else {
                      api.removeChild(parentElm, ch.elm);
                  }
              }
          }
      }
      function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
          var oldStartIdx = 0,
              newStartIdx = 0;
          var oldEndIdx = oldCh.length - 1;
          var oldStartVnode = oldCh[0];
          var oldEndVnode = oldCh[oldEndIdx];
          var newEndIdx = newCh.length - 1;
          var newStartVnode = newCh[0];
          var newEndVnode = newCh[newEndIdx];
          var oldKeyToIdx;
          var idxInOld;
          var elmToMove;
          var before;
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              if (oldStartVnode == null) {
                  oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
              } else if (oldEndVnode == null) {
                  oldEndVnode = oldCh[--oldEndIdx];
              } else if (newStartVnode == null) {
                  newStartVnode = newCh[++newStartIdx];
              } else if (newEndVnode == null) {
                  newEndVnode = newCh[--newEndIdx];
              } else if (sameVnode(oldStartVnode, newStartVnode)) {
                  patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                  oldStartVnode = oldCh[++oldStartIdx];
                  newStartVnode = newCh[++newStartIdx];
              } else if (sameVnode(oldEndVnode, newEndVnode)) {
                  patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newEndVnode = newCh[--newEndIdx];
              } else if (sameVnode(oldStartVnode, newEndVnode)) {
                  patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                  api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                  oldStartVnode = oldCh[++oldStartIdx];
                  newEndVnode = newCh[--newEndIdx];
              } else if (sameVnode(oldEndVnode, newStartVnode)) {
                  patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                  api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newStartVnode = newCh[++newStartIdx];
              } else {
                  if (oldKeyToIdx === undefined) {
                      oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                  }
                  idxInOld = oldKeyToIdx[newStartVnode.key];
                  if (isUndef(idxInOld)) {
                      api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                      newStartVnode = newCh[++newStartIdx];
                  } else {
                      elmToMove = oldCh[idxInOld];
                      if (elmToMove.sel !== newStartVnode.sel) {
                          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                      } else {
                          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                          oldCh[idxInOld] = undefined;
                          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                      }
                      newStartVnode = newCh[++newStartIdx];
                  }
              }
          }
          if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
              if (oldStartIdx > oldEndIdx) {
                  before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                  addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
              } else {
                  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
              }
          }
      }
      function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
          var i, hook;
          if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
              i(oldVnode, vnode$$1);
          }
          var elm = vnode$$1.elm = oldVnode.elm;
          var oldCh = oldVnode.children;
          var ch = vnode$$1.children;
          if (oldVnode === vnode$$1) return;
          if (vnode$$1.data !== undefined) {
              for (i = 0; i < cbs.update.length; ++i) {
                  cbs.update[i](oldVnode, vnode$$1);
              }i = vnode$$1.data.hook;
              if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode$$1);
          }
          if (isUndef(vnode$$1.text)) {
              if (isDef(oldCh) && isDef(ch)) {
                  if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
              } else if (isDef(ch)) {
                  if (isDef(oldVnode.text)) api.setTextContent(elm, '');
                  addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
              } else if (isDef(oldCh)) {
                  removeVnodes(elm, oldCh, 0, oldCh.length - 1);
              } else if (isDef(oldVnode.text)) {
                  api.setTextContent(elm, '');
              }
          } else if (oldVnode.text !== vnode$$1.text) {
              api.setTextContent(elm, vnode$$1.text);
          }
          if (isDef(hook) && isDef(i = hook.postpatch)) {
              i(oldVnode, vnode$$1);
          }
      }
      return function patch(oldVnode, vnode$$1) {
          var i, elm, parent;
          var insertedVnodeQueue = [];
          for (i = 0; i < cbs.pre.length; ++i) {
              cbs.pre[i]();
          }if (!isVnode(oldVnode)) {
              oldVnode = emptyNodeAt(oldVnode);
          }
          if (sameVnode(oldVnode, vnode$$1)) {
              patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
          } else {
              elm = oldVnode.elm;
              parent = api.parentNode(elm);
              createElm(vnode$$1, insertedVnodeQueue);
              if (parent !== null) {
                  api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
                  removeVnodes(parent, [oldVnode], 0, 0);
              }
          }
          for (i = 0; i < insertedVnodeQueue.length; ++i) {
              insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
          }
          for (i = 0; i < cbs.post.length; ++i) {
              cbs.post[i]();
          }return vnode$$1;
      };
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var attributes = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      var xlinkNS = 'http://www.w3.org/1999/xlink';
      var xmlNS = 'http://www.w3.org/XML/1998/namespace';
      var colonChar = 58;
      var xChar = 120;
      function updateAttrs(oldVnode, vnode) {
          var key,
              elm = vnode.elm,
              oldAttrs = oldVnode.data.attrs,
              attrs = vnode.data.attrs;
          if (!oldAttrs && !attrs) return;
          if (oldAttrs === attrs) return;
          oldAttrs = oldAttrs || {};
          attrs = attrs || {};
          // update modified attributes, add new attributes
          for (key in attrs) {
              var cur = attrs[key];
              var old = oldAttrs[key];
              if (old !== cur) {
                  if (cur === true) {
                      elm.setAttribute(key, "");
                  } else if (cur === false) {
                      elm.removeAttribute(key);
                  } else {
                      if (key.charCodeAt(0) !== xChar) {
                          elm.setAttribute(key, cur);
                      } else if (key.charCodeAt(3) === colonChar) {
                          // Assume xml namespace
                          elm.setAttributeNS(xmlNS, key, cur);
                      } else if (key.charCodeAt(5) === colonChar) {
                          // Assume xlink namespace
                          elm.setAttributeNS(xlinkNS, key, cur);
                      } else {
                          elm.setAttribute(key, cur);
                      }
                  }
              }
          }
          // remove removed attributes
          // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
          // the other option is to remove all attributes with value == undefined
          for (key in oldAttrs) {
              if (!(key in attrs)) {
                  elm.removeAttribute(key);
              }
          }
      }
      exports.attributesModule = { create: updateAttrs, update: updateAttrs };
      exports.default = exports.attributesModule;
      
  });

  var snabbdomAttributes = unwrapExports(attributes);
  var attributes_1 = attributes.attributesModule;

  var _class = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      function updateClass(oldVnode, vnode) {
          var cur,
              name,
              elm = vnode.elm,
              oldClass = oldVnode.data.class,
              klass = vnode.data.class;
          if (!oldClass && !klass) return;
          if (oldClass === klass) return;
          oldClass = oldClass || {};
          klass = klass || {};
          for (name in oldClass) {
              if (!klass[name]) {
                  elm.classList.remove(name);
              }
          }
          for (name in klass) {
              cur = klass[name];
              if (cur !== oldClass[name]) {
                  elm.classList[cur ? 'add' : 'remove'](name);
              }
          }
      }
      exports.classModule = { create: updateClass, update: updateClass };
      exports.default = exports.classModule;
      
  });

  var snabbdomClass = unwrapExports(_class);
  var _class_1 = _class.classModule;

  var style = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
      var nextFrame = function nextFrame(fn) {
          raf(function () {
              raf(fn);
          });
      };
      function setNextFrame(obj, prop, val) {
          nextFrame(function () {
              obj[prop] = val;
          });
      }
      function updateStyle(oldVnode, vnode) {
          var cur,
              name,
              elm = vnode.elm,
              oldStyle = oldVnode.data.style,
              style = vnode.data.style;
          if (!oldStyle && !style) return;
          if (oldStyle === style) return;
          oldStyle = oldStyle || {};
          style = style || {};
          var oldHasDel = 'delayed' in oldStyle;
          for (name in oldStyle) {
              if (!style[name]) {
                  if (name[0] === '-' && name[1] === '-') {
                      elm.style.removeProperty(name);
                  } else {
                      elm.style[name] = '';
                  }
              }
          }
          for (name in style) {
              cur = style[name];
              if (name === 'delayed' && style.delayed) {
                  for (var name2 in style.delayed) {
                      cur = style.delayed[name2];
                      if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                          setNextFrame(elm.style, name2, cur);
                      }
                  }
              } else if (name !== 'remove' && cur !== oldStyle[name]) {
                  if (name[0] === '-' && name[1] === '-') {
                      elm.style.setProperty(name, cur);
                  } else {
                      elm.style[name] = cur;
                  }
              }
          }
      }
      function applyDestroyStyle(vnode) {
          var style,
              name,
              elm = vnode.elm,
              s = vnode.data.style;
          if (!s || !(style = s.destroy)) return;
          for (name in style) {
              elm.style[name] = style[name];
          }
      }
      function applyRemoveStyle(vnode, rm) {
          var s = vnode.data.style;
          if (!s || !s.remove) {
              rm();
              return;
          }
          var name,
              elm = vnode.elm,
              i = 0,
              compStyle,
              style = s.remove,
              amount = 0,
              applied = [];
          for (name in style) {
              applied.push(name);
              elm.style[name] = style[name];
          }
          compStyle = getComputedStyle(elm);
          var props = compStyle['transition-property'].split(', ');
          for (; i < props.length; ++i) {
              if (applied.indexOf(props[i]) !== -1) amount++;
          }
          elm.addEventListener('transitionend', function (ev) {
              if (ev.target === elm) --amount;
              if (amount === 0) rm();
          });
      }
      exports.styleModule = {
          create: updateStyle,
          update: updateStyle,
          destroy: applyDestroyStyle,
          remove: applyRemoveStyle
      };
      exports.default = exports.styleModule;
      
  });

  var snabbdomStyle = unwrapExports(style);
  var style_1 = style.styleModule;

  var eventlisteners = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      function invokeHandler(handler, vnode, event) {
          if (typeof handler === "function") {
              // call function handler
              handler.call(vnode, event, vnode);
          } else if ((typeof handler === "undefined" ? "undefined" : _typeof(handler)) === "object") {
              // call handler with arguments
              if (typeof handler[0] === "function") {
                  // special case for single argument for performance
                  if (handler.length === 2) {
                      handler[0].call(vnode, handler[1], event, vnode);
                  } else {
                      var args = handler.slice(1);
                      args.push(event);
                      args.push(vnode);
                      handler[0].apply(vnode, args);
                  }
              } else {
                  // call multiple handlers
                  for (var i = 0; i < handler.length; i++) {
                      invokeHandler(handler[i]);
                  }
              }
          }
      }
      function handleEvent(event, vnode) {
          var name = event.type,
              on = vnode.data.on;
          // call event handler(s) if exists
          if (on && on[name]) {
              invokeHandler(on[name], vnode, event);
          }
      }
      function createListener() {
          return function handler(event) {
              handleEvent(event, handler.vnode);
          };
      }
      function updateEventListeners(oldVnode, vnode) {
          var oldOn = oldVnode.data.on,
              oldListener = oldVnode.listener,
              oldElm = oldVnode.elm,
              on = vnode && vnode.data.on,
              elm = vnode && vnode.elm,
              name;
          // optimization for reused immutable handlers
          if (oldOn === on) {
              return;
          }
          // remove existing listeners which no longer used
          if (oldOn && oldListener) {
              // if element changed or deleted we remove all existing listeners unconditionally
              if (!on) {
                  for (name in oldOn) {
                      // remove listener if element was changed or existing listeners removed
                      oldElm.removeEventListener(name, oldListener, false);
                  }
              } else {
                  for (name in oldOn) {
                      // remove listener if existing listener removed
                      if (!on[name]) {
                          oldElm.removeEventListener(name, oldListener, false);
                      }
                  }
              }
          }
          // add new listeners which has not already attached
          if (on) {
              // reuse existing listener or create new
              var listener = vnode.listener = oldVnode.listener || createListener();
              // update vnode for listener
              listener.vnode = vnode;
              // if element changed or added we add all needed listeners unconditionally
              if (!oldOn) {
                  for (name in on) {
                      // add listener if element was changed or new listeners added
                      elm.addEventListener(name, listener, false);
                  }
              } else {
                  for (name in on) {
                      // add listener if new listener added
                      if (!oldOn[name]) {
                          elm.addEventListener(name, listener, false);
                      }
                  }
              }
          }
      }
      exports.eventListenersModule = {
          create: updateEventListeners,
          update: updateEventListeners,
          destroy: updateEventListeners
      };
      exports.default = exports.eventListenersModule;
      
  });

  var snabbdomEventlisteners = unwrapExports(eventlisteners);
  var eventlisteners_1 = eventlisteners.eventListenersModule;

  var vnode_1 = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      function vnode(sel, data, children, text, elm) {
          var key = data === undefined ? undefined : data.key;
          return { sel: sel, data: data, children: children,
              text: text, elm: elm, key: key };
      }
      exports.vnode = vnode;
      exports.default = vnode;
      
  });

  unwrapExports(vnode_1);
  var vnode_2 = vnode_1.vnode;

  var is = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });
      exports.array = Array.isArray;
      function primitive(s) {
          return typeof s === 'string' || typeof s === 'number';
      }
      exports.primitive = primitive;
      
  });

  unwrapExports(is);
  var is_1 = is.array;
  var is_2 = is.primitive;

  var h_1 = createCommonjsModule(function (module, exports) {

      Object.defineProperty(exports, "__esModule", { value: true });

      function addNS(data, children, sel) {
          data.ns = 'http://www.w3.org/2000/svg';
          if (sel !== 'foreignObject' && children !== undefined) {
              for (var i = 0; i < children.length; ++i) {
                  var childData = children[i].data;
                  if (childData !== undefined) {
                      addNS(childData, children[i].children, children[i].sel);
                  }
              }
          }
      }
      function h(sel, b, c) {
          var data = {},
              children,
              text,
              i;
          if (c !== undefined) {
              data = b;
              if (is.array(c)) {
                  children = c;
              } else if (is.primitive(c)) {
                  text = c;
              } else if (c && c.sel) {
                  children = [c];
              }
          } else if (b !== undefined) {
              if (is.array(b)) {
                  children = b;
              } else if (is.primitive(b)) {
                  text = b;
              } else if (b && b.sel) {
                  children = [b];
              } else {
                  data = b;
              }
          }
          if (is.array(children)) {
              for (i = 0; i < children.length; ++i) {
                  if (is.primitive(children[i])) children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i], undefined);
              }
          }
          if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
              addNS(data, children, sel);
          }
          return vnode_1.vnode(sel, data, children, text, undefined);
      }
      exports.h = h;
      exports.default = h;
      
  });

  var h$1 = unwrapExports(h_1);
  var h_2 = h_1.h;

  var patch = init$1([snabbdomAttributes, snabbdomClass, snabbdomStyle, snabbdomEventlisteners]);

  function renderer$2() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _opts$createElement = opts.createElement,
        createElement = _opts$createElement === undefined ? document.createElement.bind(document) : _opts$createElement;


    var el = void 0;
    var rect = createRendererBox();
    var vnode = void 0;

    var dom = create$m();

    dom.element = function () {
      return el;
    };

    dom.root = function () {
      return el;
    };

    dom.appendTo = function (element) {
      if (!el) {
        el = createElement('div');
        el.style.position = 'absolute';
        el.style['-webkit-font-smoothing'] = 'antialiased';
        el.style['-moz-osx-font-smoothing'] = 'antialiased';
        el.style.pointerEvents = 'none';
      }

      element.appendChild(el);

      return el;
    };

    dom.render = function (nodes) {
      if (!el) {
        return false;
      }

      var scaleX = rect.scaleRatio.x;
      var scaleY = rect.scaleRatio.y;

      el.style.left = Math.round(rect.margin.left + rect.x * scaleX) + 'px';
      el.style.top = Math.round(rect.margin.left + rect.y * scaleY) + 'px';
      el.style.width = Math.round(rect.width * scaleX) + 'px';
      el.style.height = Math.round(rect.height * scaleY) + 'px';

      var node = h$1('div', {}, Array.isArray(nodes) ? nodes : [nodes]);

      if (vnode) {
        patch(vnode, node);
      } else {
        patch(el, node);
      }
      vnode = node;

      return true;
    };

    dom.renderArgs = [h$1]; // Arguments to render functions using the DOM renderer

    dom.clear = function () {
      if (el) {
        var first = el.firstChild;

        while (first) {
          el.removeChild(first);
          first = el.firstChild;
        }
        vnode = null;
      }

      return dom;
    };

    dom.destroy = function () {
      if (el && el.parentElement) {
        el.parentElement.removeChild(el);
      }
      el = null;
      vnode = null;
    };

    dom.size = function (inner) {
      if (inner) {
        rect = createRendererBox(inner);
      }
      return rect;
    };

    return dom;
  }

  function rendererComponent$2(picasso) {
    picasso.renderer('dom', renderer$2);
  }

  var renderers = [rendererComponent$1, rendererComponent, rendererComponent$2];

  var scales = [];

  var LOG_LEVEL = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4
  };

  var loggerFn = function loggerFn() {
    var _LOG_FN;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$level = _ref.level,
        level = _ref$level === undefined ? LOG_LEVEL.OFF : _ref$level,
        _ref$pipe = _ref.pipe,
        pipe = _ref$pipe === undefined ? console : _ref$pipe;

    var currentlevel = level;

    var LOG_FN = (_LOG_FN = {}, defineProperty(_LOG_FN, LOG_LEVEL.OFF, function () {}), defineProperty(_LOG_FN, LOG_LEVEL.ERROR, function () {
      return pipe.error.apply(pipe, arguments);
    }), defineProperty(_LOG_FN, LOG_LEVEL.WARN, function () {
      return pipe.warn.apply(pipe, arguments);
    }), defineProperty(_LOG_FN, LOG_LEVEL.INFO, function () {
      return pipe.info.apply(pipe, arguments);
    }), defineProperty(_LOG_FN, LOG_LEVEL.DEBUG, function () {
      return pipe.log.apply(pipe, arguments);
    }), _LOG_FN);

    var log = function log(lev) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!lev || currentlevel < lev) {
        return;
      }

      (LOG_FN[lev] || LOG_FN[LOG_LEVEL.DEBUG]).apply(undefined, args);
    };

    /**
     * @typedef {object} logger
     * @private
     */

    return (/** @lends logger */{
        /**
         * Log a message
         * @param {number} lev - The log level
         * @param {...any} args
         * @kind function
         */
        log: log,

        /**
         * Log an error message
         * @param {...any} args
         */
        error: function error() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return log.apply(undefined, [LOG_LEVEL.ERROR].concat(args));
        },

        /**
         * Log a warning message
         * @param {...any} args
         */
        warn: function warn() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return log.apply(undefined, [LOG_LEVEL.WARN].concat(args));
        },

        /**
         * Log an info message
         * @param {...any} args
         */
        info: function info() {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return log.apply(undefined, [LOG_LEVEL.INFO].concat(args));
        },

        /**
         * Log a debug message
         * @param {...any} args
         */
        debug: function debug() {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return log.apply(undefined, [LOG_LEVEL.DEBUG].concat(args));
        },

        /**
         * Set the current log level
         * @param {number} lev - The log level
         */
        level: function level(lev) {
          if (typeof lev === 'number') {
            currentlevel = lev;
          }
          return currentlevel;
        },

        LOG_LEVEL: LOG_LEVEL
      }
    );
  };

  var palettes = [{
    key: 'categorical',
    colors: [['#a54343', '#d76c6c', '#ec983d', '#ecc43d', '#f9ec86', '#cbe989', '#70ba6e', '#578b60', '#79d69f', '#26a0a7', '#138185', '#65d3da'] // breeze colors
    ]
  }, {
    key: 'diverging',
    colors: [['#3d52a1', '#3a89c9', '#77b7e5', '#b4ddf7', '#e6f5fe', '#ffe3aa', '#f9bd7e', '#ed875e', '#d24d3e', '#ae1c3e']]
  }, {
    key: 'sequential',
    colors: [['rgb(180,221,212)', 'rgb(34, 83, 90)']]
  }];

  /* eslint quote-props: 0 */
  var style$1 = {
    // -- FOUNDATION --
    // fonts
    '$font-family': "'Source Sans Pro', Arial, sans-serif",
    '$font-size': '12px',
    '$line-height': '16px',
    '$font-size--l': '16px',

    // base grays
    '$gray-100': '#ffffff',
    '$gray-98': '#f9f9f9',
    '$gray-95': '#f2f2f2',
    '$gray-90': '#e6e6e6',
    '$gray-35': '#595959',
    '$gray-30': '#4d4d4d',
    '$gray-25': '#404040',
    '$gray-20': '#333333',

    // borders
    '$border-95': 'rgba(255, 255, 255, 0.05)',
    '$border-90': 'rgba(255, 255, 255, 0.1)',
    '$border-80': 'rgba(255, 255, 255, 0.2)',
    '$border-20': 'rgba(0, 0, 0, 0.2)',
    '$border-10': 'rgba(0, 0, 0, 0.1)',
    '$border-5': 'rgba(0, 0, 0, 0.05)',

    // primary colors
    '$primary-blue': '#3F8AB3',
    '$primary-green': '#6CB33F',
    '$primary-red': '#DC423F',
    '$primary-orange': '#EF960F',

    // spacing
    '$spacing--s': 4,
    '$spacing': 8,
    '$spacing--l': 12,
    // -------------------------

    // -- ALIASES --
    '$font-color': '$gray-35',
    '$font-color--inverted': '$gray-90',
    '$guide-color': '$gray-90',
    '$guide-color--inverted': '$gray-35',
    '$border': '$border-80',
    '$border--inverted': '$border-10',
    // -------------------------

    // -- MIXINS --
    // data points
    '$shape': { // data shape
      fill: '$primary-blue',
      strokeWidth: 1,
      stroke: '$border'
    },

    '$shape-outline': { // data shape which usually does not have a fill, e.g. the line in a linechart
      stroke: '$primary-blue',
      strokeWidth: 2
    },

    '$shape-guide': { // lines that somehow belongs to a data shape, e.g. whiskers in a boxplot
      stroke: '$guide-color',
      strokeWidth: 1
    },

    '$shape-guide--inverted': {
      '@extend': '$shape-guide',
      stroke: '$guide-color--inverted'
    },

    '$label': {
      fontSize: '$font-size',
      fontFamily: '$font-family',
      fill: '$font-color'
    },

    '$label--inverted': {
      '$extend': '$label',
      fill: '$font-color--inverted'
    },

    // user interface
    '$label-overlay': { // e.g. selection range bubble
      fontSize: '$font-size--l',
      fontFamily: '$font-family',
      fill: '$gray-100', // background fill
      color: '$font-color',
      stroke: '$guide-color--inverted',
      strokeWidth: 1,
      borderRadius: 4
    },

    '$title': {
      '@extend': '$label',
      fontSize: '$font-size--l'
    },

    '$guide-line': {
      strokeWidth: 1,
      stroke: '$guide-color'
    },

    '$guide-line--minor': {
      strokeWidth: 1,
      stroke: '$gray-95' // needs alias
    },

    '$padding--s': {
      left: '$spacing--s',
      right: '$spacing--s',
      top: '$spacing--s',
      bottom: '$spacing--s'
    },

    '$padding': {
      left: '$spacing',
      right: '$spacing',
      top: '$spacing',
      bottom: '$spacing'
    },

    '$selection-area-target': {
      fill: '$primary-green',
      strokeWidth: 0,
      opacity: 0.2
    }
  };

  function usePlugin(plugin) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var api = arguments[2];

    plugin(api, options);
  }

  function pic() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var registries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var logger = loggerFn(config.logger);

    /**
     * @lends picassojs
     */
    var regis = {
      // -- registries --
      /**
       * Component registry
       * @type {registry}
       */
      component: registryFactory(registries.component),
      /**
       * Data registry
       * @type {registry}
       */
      data: registryFactory(registries.data),
      /**
       * Formatter registry
       * @type {registry}
       */
      formatter: registryFactory(registries.formatter),
      /**
       * Interaction registry
       * @type {registry}
       */
      interaction: registryFactory(registries.interaction),
      /**
       * Renderer registry
       * @type {registry}
       */
      renderer: rendererRegistry(registries.renderer),
      /**
       * Scale registry
       * @type {registry}
       */
      scale: registryFactory(registries.scale),
      /**
       * Symbol registry
       * @type {registry}
       * @private
       */
      symbol: registryFactory(registries.symbol),
      // -- misc --
      /**
       * log some some stuff
       * @type {logger}
       * @private
       */
      logger: logger
    };

    if (config.renderer && config.renderer.prio) {
      regis.renderer.default(config.renderer.prio[0]);
    }

    /**
     * picasso.js entry point
     * @experimental
     * @entry
     * @alias picassojs
     * @param {object} cfg
     * @param {object} cfg.renderer
     * @param {Array<string>} cfg.renderer.prio
     * @param {object} cfg.logger
     * @param {number} cfg.logger.level
     * @param {object} cfg.style
     * @param {Array<object>} cfg.palettes
     * @returns {picassojs}
     */
    function picassojs() {
      var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var cc = {
        palettes: config.palettes.concat(cfg.palettes || []),
        style: extend({}, config.style, cfg.style),
        logger: cfg.logger || config.logger,
        renderer: cfg.renderer || config.renderer
      };
      return pic(cc, regis);
    }

    /**
     * @callback picassojs~plugin
     * @param {picassojs~registries} registries
     * @param {object} options
     */

    /**
     * @param {picassojs~plugin} plugin
     * @param {object} [options]
     */
    picassojs.use = function (plugin) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return usePlugin(plugin, options, regis);
    };

    /**
     * @param {chart-definition} definition
     * @returns {chart}
     */
    picassojs.chart = function (definition) {
      return chartFn(definition, {
        registries: regis,
        logger: logger,
        style: config.style,
        palettes: config.palettes
      });
    };
    picassojs.config = function () {
      return config;
    };

    Object.keys(regis).forEach(function (key) {
      picassojs[key] = regis[key];
    });

    /**
     * picasso.js version
     * @type {string}
     */
    picassojs.version = about.version;

    return picassojs;
  }

  var p = pic({
    renderer: {
      prio: ['svg', 'canvas']
    },
    logger: {
      level: 0
    },
    style: style$1,
    palettes: palettes
  }, {
    component: componentRegistry,
    data: dataRegistry,
    formatter: formatterRegistry,
    interaction: reg$1,
    renderer: rendererRegistry(),
    scale: scaleRegistry
  });

  components.forEach(p.use);
  renderers.forEach(p.use);
  scales.forEach(p.use);

  return p;

})));
//# sourceMappingURL=picasso.js.map
