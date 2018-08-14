/**
 * wp-nav-menus.js
 * https://github.com/cedaro/wp-nav-menus
 *
 * @copyright Copyright (c) 2016 Cedaro, LLC
 * @license MIT
 * @version 2.0.0
 */
this["cedaroNavMenu"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = __webpack_require__(5);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Query(selector) {
	var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	if (selector instanceof Query) {
		return selector;
	}

	if (!selector) {
		return this;
	}

	if (context.length) {
		context = context[0];
	}

	if ('string' === typeof selector) {
		selector = context.querySelectorAll(selector);
	}

	if (selector && selector.nodeType) {
		this.length = 1;
		this[0] = selector;
	} else {
		selector = Array.prototype.slice.call(selector);
		var length = this.length = selector.length;

		for (var i = 0; i < length; i++) {
			this[i] = selector[i];
		}
	}
}

_utils2.default.extend(Query.prototype, {
	length: 0,

	closest: function closest(selector) {
		var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

		var el = this[0];

		while (el && el !== context) {
			if (_utils2.default.matches(el, selector)) {
				return el;
			}

			el = el.parentElement;
		}

		return null;
	},

	each: function each(callback) {
		_utils2.default.each(this, callback);
		return this;
	},

	filter: function filter(callback) {
		return query(Array.prototype.filter.call(this, callback));
	},

	/**
  * @todo Improve performance: http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/
  */
	find: function find(selector) {
		return query(this[0].querySelectorAll(selector));
	},

	parents: function parents(selector) {
		var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

		var el = this[0];
		var parents = [];

		while (el && el.parentElement && el.parentElement !== context) {
			if (_utils2.default.matches(el.parentElement, selector)) {
				parents.push(el.parentElement);
			}

			el = el.parentElement;
		}

		return query(parents);
	},

	up: function up(selector, context) {
		var items = Array.prototype.slice.call(this.parents(selector, context));

		if (_utils2.default.matches(this[0], selector)) {
			items.unshift(this[0]);
		}

		return query(items);
	}
});

function query(selector, context) {
	return new Query(selector, context);
}

exports.default = _utils2.default.extend(query, _utils2.default, {
	isClickable: function isClickable(el) {
		if (!el) {
			return false;
		}

		var styles = window.getComputedStyle(el);
		return 'none' !== styles.display && 'none' !== styles.pointerEvents;
	},

	isElementOrDescendant: function isElementOrDescendant(el, tagName, container) {
		return tagName === el.nodeName || null !== query(el).closest(tagName, container);
	},

	isVisible: function isVisible(el) {
		return el && 'none' !== window.getComputedStyle(el).display;
	}
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _entry = __webpack_require__(3);

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_jquery2.default) {
	/**
  * jQuery method to initialize menus.
  *
  * @memberOf jQuery.fn
  *
  * @param {Object} options Menu options.
  * @return {jQuery} Chainable jQuery collection.
  */
	_jquery2.default.fn.cedaroNavMenu = function (options) {
		return this.each(function () {
			var menu = (0, _entry2.default)(this, options);
			menu.initialize();
		});
	};
}

/**
 * Export the method for instantiating a new menu.
 */
module.exports = _entry2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function() { module.exports = this["jQuery"]; }());

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (el) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	// Fail gracefully in unsupported browsers.
	if (!('addEventListener' in global)) {
		return;
	}

	options.l10n = options.l10n || {};

	// Merge global localized strings.
	_query2.default.extend(options.l10n, l10n);

	var menu = new _navMenu2.default(el, options);

	// Attempt to detect the partial id in the customizer and store a
	// reference so it can be cleaned up during a selective refresh.
	var partialId = menu.el.getAttribute('data-customize-partial-id');
	if (partialId) {
		customizerPartials[partialId] = menu;
	}

	return menu;
};

var _query = __webpack_require__(0);

var _query2 = _interopRequireDefault(_query);

var _navMenu = __webpack_require__(6);

var _navMenu2 = _interopRequireDefault(_navMenu);

var _wp = __webpack_require__(7);

var _wp2 = _interopRequireDefault(_wp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var customizerPartials = {};

// Merge global localized strings.
var l10n = _query2.default.extend({
	collapseSubmenu: 'Collapse submenu',
	expandSubmenu: 'Expand submenu'
}, global._cedaroNavMenuL10n);

/**
 * Initialize a partial placement in the customizer.
 *
 * Managing menus in the customizer causes the placement to be replaced for
 * each change, so it needs to be reinitialized each time to ensure submenus
 * are accessible.
 *
 * @param {wp.customize.selectiveRefresh.Placement} placement Partial placement.
 */
function initializeCustomizePlacement(placement) {
	if (!(placement.partial.id in customizerPartials)) {
		return;
	}

	var removedMenu = customizerPartials[placement.partial.id];
	removedMenu.destroy();

	// Initialize the new placement.
	var addedMenu = new _navMenu2.default(placement.container[0], removedMenu.options);
	addedMenu.initialize();

	// Synchronize expanded states from the removed menu.
	placement.removedNodes.find('.' + removedMenu.options.expandedMenuItemClass).each(function () {
		placement.container.find('#' + this.id).find('> .{class}, > a .{class}'.replace(/{class}/g, removedMenu.options.submenuToggleClass)).trigger('click');
	});
}

/**
 * Selective refresh support in the customizer.
 */
if (_wp2.default && 'customize' in _wp2.default) {
	_wp2.default.customize.bind('preview-ready', function () {
		_wp2.default.customize.selectiveRefresh.bind('partial-content-rendered', initializeCustomizePlacement);
	});
}

/**
 * Create a new menu object.
 *
 * @param {string|Element} el      Selector or HTML element.
 * @param {object}         options Menu options.
 * @return {NavMenu}               Nav menu instance.
 */
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function each(items, callback) {
	var length = items.length;

	for (var i = 0; i < length; i++) {
		if (false === callback.call(items[i], items[i], i)) {
			break;
		}
	}
}

function extend(target) {
	var length = arguments.length;
	var i = 0;

	target = target || {};

	while (++i < length) {
		if (!arguments[i]) {
			continue;
		}

		for (var key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				target[key] = arguments[i][key];
			}
		}
	}

	return target;
}

function generateUniqueId() {
	var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	if ('' !== prefix) {
		prefix += '-';
	}

	return prefix + Math.random().toString(36).slice(2, 15);
}

function getUniqueId(el, prefix) {
	if (el.id) {
		return el.id;
	}

	return generateUniqueId(prefix);
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
function matches(el, selector) {
	var fn = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);

	return !!fn && fn.call(el, selector);
}

exports.default = {
	each: each,
	extend: extend,
	getUid: getUniqueId,
	matches: matches
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _query = __webpack_require__(0);

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavMenu = function () {
	/**
  * Create a menu instance.
  *
  * @class NavMenu
  *
  * @param {Element|string} el                                 HTML element or selector.
  * @param {object}         options                            Menu options.
  * @param {string}         options.activeMenuItemClass        HTML class for active menu items.
  * @param {number}         options.breakpoint                 Breakpoint to switch between mobile and full site mode.
  * @param {boolean}        options.expandCurrentItem          Whether to expand the current menu item on initial load.
  * @param {string}         options.expandedMenuItemClass      HTML class applied to the menu item that contains an expanded submenu.
  * @param {string}         options.expandedSubmenuClass       HTML class applied to expanded submenus.
  * @param {string}         options.expandedSubmenuToggleClass HTML class applied to submenu toggle buttons when the submenu is expanded.
  * @param {number}         options.hoverTimeout               Delay in milliseconds before hiding submenus.
  * @param {object}         options.l10n                       Localized strings specific to this instance.
  * @param {string}         options.submenuToggleClass         HTML class for submenu toggle buttons.
  * @param {string}         options.submenuToggleInsert        Where to insert submenu toggle buttons. Defaults to before the submenu.
  * @param {string}         options.submenuToggleMode          Mode for displaying submenus.
  */
	function NavMenu(el, options) {
		var _this = this;

		_classCallCheck(this, NavMenu);

		this._initialized = false;
		this._hasExpandedSubmenu = false;
		this._hoverTimeouts = [];
		this._touchStarted = false;
		this._viewportWidth = null;

		this.el = (0, _query2.default)(el)[0];
		this.options = _query2.default.extend({}, NavMenu.defaults, options);
		this.el.setAttribute('data-nav-menu-options', JSON.stringify(this.options));

		// Automatically bind all event handlers.
		Object.getOwnPropertyNames(NavMenu.prototype).filter(function (key) {
			return 'function' === typeof _this[key] && 0 === key.indexOf('on');
		}).forEach(function (key) {
			_this[key] = _this[key].bind(_this);
		});
	}

	/**
  * Initialize the menu.
  *
  * @return {this}
  */


	_createClass(NavMenu, [{
		key: 'initialize',
		value: function initialize() {
			var _this2 = this;

			if (this._initialized) {
				return;
			}

			this._initialized = true;

			// Ensure every menu item has an id to manage the hover state timeouts.
			this.$items = (0, _query2.default)('li', this.el).each(function (el) {
				return el.id = _query2.default.getUid(el, 'menu-item');
			});

			this.$submenus = (0, _query2.default)('li ul', this.el).each(function (el) {
				return el.setAttribute('aria-expanded', 'false');
			});

			if (false !== this.options.submenuToggleInsert) {
				this.insertSubmenuToggleButtons();
			}

			document.addEventListener('click', this.onDocumentClick, true);
			this.el.addEventListener('click', this.onSubmenuToggleClick, false);

			if ('hover' === this.options.submenuToggleMode /*&& 'disable' !== this.options.breakpoint*/) {
					this.el.addEventListener('touchstart', this.onMenuLinkTouchStart, false);
					this.el.addEventListener('mouseover', this.onMenuItemMouseEnter, false);
					this.el.addEventListener('mouseout', this.onMenuItemMouseLeave, false);
				}

			// Use capturing mode to support event delegation.
			// @link https://developer.mozilla.org/en-US/docs/Web/Events/blur#Event_delegation
			this.el.addEventListener('focus', this.onMenuLinkFocus, true);
			this.el.addEventListener('blur', this.onMenuLinkBlur, true);

			// Expand current submenus on initialization.
			if (this.options.expandCurrentItem && ('click' === this.options.submenuToggleMode || this.isMobile())) {
				this.$items.filter(function (el) {
					return el.classList.contains('current-menu-item') || el.classList.contains('current-menu-ancestor');
				}).each(function (el) {
					return _this2.expandSubmenu(el);
				});
			}

			return this;
		}

		/**
   * Destroy the menu.
   *
   * Cleans up delegated event listeners.
   *
   * @todo Consider removing toggle buttons.
   */

	}, {
		key: 'destroy',
		value: function destroy() {
			document.removeEventListener('click', this.onDocumentClick, true);
			this.el.removeEventListener('click', this.onSubmenuToggleClick, false);
			this.el.removeEventListener('mouseover', this.onMenuItemMouseEnter, false);
			this.el.removeEventListener('mouseout', this.onMenuItemMouseLeave, false);
			this.el.removeEventListener('focus', this.onMenuLinkFocus, true);
			this.el.removeEventListener('blur', this.onMenuLinkBlur, true);
		}

		/**
   * Whether the menu is in mobile mode.
   *
   * @return {boolean}
   */

	}, {
		key: 'isMobile',
		value: function isMobile() {
			if ('disable' === this.options.breakpoint) {
				return true;
			}

			return this.getViewportWidth() < this.options.breakpoint;
		}

		/**
   * Collapse the submenu in a menu item.
   *
   * @param {Element} menuItem Menu item element.
   */

	}, {
		key: 'collapseSubmenu',
		value: function collapseSubmenu(menuItem) {
			var button = this.getSubmenuToggle(menuItem);
			var $submenu = (0, _query2.default)('.sub-menu', menuItem);

			menuItem.classList.remove(this.options.expandedMenuItemClass);

			if (button) {
				button.classList.remove(this.options.expandedSubmenuToggleClass);
				button.setAttribute('aria-expanded', 'false');
				(0, _query2.default)('.screen-reader-text', button)[0].innerHTML = this.options.l10n.expandSubmenu || 'Expand submenu';
			}

			if ($submenu.length) {
				$submenu[0].classList.remove(this.options.expandedSubmenuClass);
				$submenu[0].setAttribute('aria-expanded', 'false');
			}
		}

		/**
   * Collapse all submenus.
   */

	}, {
		key: 'collapseAllSubmenus',
		value: function collapseAllSubmenus() {
			var _this3 = this;

			this.$items.each(function (el) {
				el.classList.remove(_this3.options.activeMenuItemClass);
				_this3.collapseSubmenu(el);
			});
		}

		/**
   * Collapse submenus in branches that don't contain the focused element.
   *
   * @param {Element} focusedEl Element that has focus.
   */

	}, {
		key: 'collapseUnrelatedSubmenus',
		value: function collapseUnrelatedSubmenus(focusedEl) {
			var _this4 = this;

			this.$items.each(function (el) {
				if (!el.contains(focusedEl)) {
					el.classList.remove(_this4.options.activeMenuItemClass);
					_this4.collapseSubmenu(el);
				}
			});
		}

		/**
   * Expand the submenu in a menu item.
   *
   * @param {Element} menuItem Menu item element.
   */

	}, {
		key: 'expandSubmenu',
		value: function expandSubmenu(menuItem) {
			var button = this.getSubmenuToggle(menuItem);
			var $submenu = (0, _query2.default)('.sub-menu', menuItem);

			menuItem.classList.add(this.options.activeMenuItemClass);

			if (!this.hasSubmenu(menuItem)) {
				return;
			}

			menuItem.classList.add(this.options.expandedMenuItemClass);

			if (button) {
				button.classList.add(this.options.expandedSubmenuToggleClass);
				button.setAttribute('aria-expanded', 'true');
				(0, _query2.default)('.screen-reader-text', button)[0].innerHTML = this.options.l10n.collapseSubmenu || 'Collapse submenu';
			}

			if ($submenu.length) {
				$submenu[0].classList.add(this.options.expandedSubmenuClass);
				$submenu[0].setAttribute('aria-expanded', 'true');
			}
		}

		/**
   * Retrieve the viewport width.
   *
   * @return {number}
   */

	}, {
		key: 'getViewportWidth',
		value: function getViewportWidth() {
			return this._viewportWidth || Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		}

		/**
   * Set the viewport width.
   *
   * @param  {number} width Width of the viewport.
   * @return {this}
   */

	}, {
		key: 'setViewportWidth',
		value: function setViewportWidth(width) {
			this._viewportWidth = parseInt(width, 10);
			return this;
		}

		/**
   * Retrieve the submenu toggle button from a menu item.
   *
   * @param  {Element} menuItem Menu item element.
   * @return {Element}
   */

	}, {
		key: 'getSubmenuToggle',
		value: function getSubmenuToggle(menuItem) {
			return (0, _query2.default)('.' + this.options.submenuToggleClass, menuItem)[0];
		}

		/**
   * Whether a menu item has a submenu.
   *
   * WordPress adds the 'menu-item-has-children' class to menu items even when
   * the children are hidden with a depth restriction, so we have to query for
   * the submenu to see if it exists.
   *
   * @param  {Element}  menuItem Menu item element.
   * @return {Boolean}
   */

	}, {
		key: 'hasSubmenu',
		value: function hasSubmenu(menuItem) {
			return (0, _query2.default)('.sub-menu', menuItem).length > 0; //classList.contains( 'menu-item-has-children' );
		}

		/**
   * Insert toggle buttons in menu items that contain a submenu.
   */

	}, {
		key: 'insertSubmenuToggleButtons',
		value: function insertSubmenuToggleButtons() {
			var _this5 = this;

			var button = document.createElement('button');
			button.setAttribute('class', this.options.submenuToggleClass);
			button.setAttribute('aria-expanded', 'false');

			var span = document.createElement('span');
			span.setAttribute('class', 'screen-reader-text');
			span.innerHTML = this.options.l10n.expandSubmenu || 'Expand submenu';

			button.appendChild(span);

			this.$submenus.each(function (submenu) {
				var buttonInstance = button.cloneNode(true);

				// Assign an id to each submenu to use in ARIA attributes.
				if (!submenu.id) {
					submenu.id = _query2.default.getUid(submenu, 'sub-menu');
				}

				buttonInstance.setAttribute('aria-controls', submenu.id);

				if ('append' !== _this5.options.submenuToggleInsert) {
					// Insert the toggle button before the submenu element.
					submenu.parentElement.insertBefore(buttonInstance, submenu);
					return;
				}

				// Append the toggle button to the parent item anchor element.
				// This should primarily be used for backward compatibility.
				(0, _query2.default)(submenu.parentElement.children).each(function (el) {
					if ('A' === el.nodeName) {
						el.appendChild(buttonInstance);
						return false;
					}
				});
			});
		}
	}, {
		key: 'isSubmenuExpanded',
		value: function isSubmenuExpanded(menuItem) {
			return menuItem.classList.contains(this.options.expandedMenuItemClass);
		}

		/**
   * Toggle the submenu in a menu item.
   *
   * @param {Element} menuItem Menu item element.
   */

	}, {
		key: 'toggleSubmenu',
		value: function toggleSubmenu(menuItem) {
			if (this.isSubmenuExpanded(menuItem)) {
				this.collapseSubmenu(menuItem);
			} else {
				this.expandSubmenu(menuItem);
			}
		}

		/**
   * Collapse all submenus when clicking outside the menu.
   *
   * On touch devices without toggle buttons, tapping a link will expand
   * the submenu. It's not possible to close it without clicking another link
   * with a submenu, which leads back to the initial problem.
   *
   * Submenus also won't be collapsed when the keyboard is used to focus
   * an element and a click occurs outside the menu.
   */

	}, {
		key: 'onDocumentClick',
		value: function onDocumentClick(e) {
			// Don't do this in click mode or on mobile.
			if ('click' === this.options.submenuToggleMode || this.isMobile()) {
				return;
			}

			if (this.el === e.target || !this.el.contains(e.target)) {
				this.collapseAllSubmenus();
			}
		}

		/**
   * Handle clicks on submenu toggle buttons.
   *
   * Delegated to the menu element, so need to ensure the click is on a
   * toggle button before handling it.
   *
   * @param {MouseEvent} e Mouse event object.
   */

	}, {
		key: 'onSubmenuToggleClick',
		value: function onSubmenuToggleClick(e) {
			var button = (0, _query2.default)(e.target).closest('.' + this.options.submenuToggleClass, this.el);

			// Bail if this isn't a click on a toggle button.
			if (!button) {
				return;
			}

			e.preventDefault();

			var menuItem = (0, _query2.default)(e.target).closest('li', this.el);
			this.toggleSubmenu(menuItem);
		}

		/**
   * Handle touchstart events on menu links.
   *
   * On touch devices, make the first click open a submenu if there isn't a
   * clickable toggle button available. Otherwise, the submenus wouldn't be
   * accessible on touch devices.
   *
   * @param {TouchEvent} e Touch event object.
   */

	}, {
		key: 'onMenuLinkTouchStart',
		value: function onMenuLinkTouchStart(e) {
			// Bail if this isn't a touchstart on the anchor element.
			if (!_query2.default.isElementOrDescendant(e.target, 'A', this.el)) {
				return;
			}

			var target = (0, _query2.default)(e.target).closest('li', this.el);

			// Bail if a target couldn't be found.
			if (!target) {
				return;
			}

			// Bail if there isn't a submenu in this item or it's already expanded.
			if (!this.hasSubmenu(target) || this.isSubmenuExpanded(target)) {
				return;
			}

			var button = this.getSubmenuToggle(target);

			// Expand the submenu and disable the click event if a clickable toggle
			// button isn't available.
			if (!_query2.default.isClickable(button)) {
				e.stopImmediatePropagation();
				e.preventDefault();
				this.expandSubmenu(target);
				this.collapseUnrelatedSubmenus(e.target);
			} else {
				this._touchStarted = true;
			}
		}

		/**
   * Handle mouseenter events on menu items.
   *
   * When the mouse enters a menu item:
   * - Add an 'is-active' class to the menu item to aid in styling. Using
   *   the class should prevent needing to use :hover, which can cause
   *   double tap issues on touch devices.
   * - Expand the submenu if not on mobile. The toggle button should be
   *   used to control submenus on mobile.
   *
   * Mimics mouseenter, but is delegated to the menu element instead of
   * being bound to each item. The actual mouseenter event cannot be
   * delegated.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter
   * @link http://stackoverflow.com/a/22444819
   * @link https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW7
   * @link https://patrickhlauke.github.io/touch/tests/results/
   *
   * @param {MouseEvent} e Mouse event object.
   */

	}, {
		key: 'onMenuItemMouseEnter',
		value: function onMenuItemMouseEnter(e) {
			var _this6 = this;

			var isTouchEvent = this._touchStarted;

			// Reset the touch started flag.
			this._isTouchStarted = false;

			var target = (0, _query2.default)(e.target).closest('li', this.el);
			var related = (0, _query2.default)(e.relatedTarget).closest('li', this.el);

			/*
    * Bail if a target couldn't be found, or if the cursor is already in
    * the target element. Handling mouseover events like this mimics
    * mousenter behavior.
    */
			if (!target || related === target) {
				return;
			}

			// Clear the timeout to hide a submenu when re-entering an item.
			(0, _query2.default)(e.target).up('li', this.el).each(function (el) {
				clearTimeout(_this6._hoverTimeouts[el.id]);
				el.classList.add(_this6.options.activeMenuItemClass);
			});

			// Bail if there isn't a submenu in this item or it's already expanded.
			if (!this.hasSubmenu(target) || this.isSubmenuExpanded(target)) {
				return;
			}

			/*
    * If a submenu has been expanded by a focus event, hovering over
    * unrelated menu items won't collapse the submenu. This should only
    * happen when the keyboard is used to focus a link, then the mouse is
    * used to interact with the menu. It's an edge case an may not be worth
    * the performance impact of looping through every item on mouseenter to
    * collapse unrelated submenus.
    */
			// if ( ! this.isMobile() ) {
			// 	this.collapseUnrelatedSubmenus( target );
			// }

			/*
    * If this event was triggered by a touchstart event and the target is
    * an anchor element, don't open the submenu to prevent it from flashing
    * before the link is followed. Also prevents a double tap from being
    * required on iOS.
    */
			if (!isTouchEvent || !_query2.default.isElementOrDescendant(e.target, 'A', this.el)) {
				// Don't expand on mobile to prevent the menu from jumping.
				if (!this.isMobile()) {
					this.expandSubmenu(target);
				}
			}
		}

		/**
   * Handle mouseleave events on menu items.
   *
   * When the mouse leaves a menu item, collapse submenus  and remove the
   * 'is-active' class for any menu items that no longer have the cursor
   * hovering over them.
   *
   * Mimics mouseleave, but is delegated to the menu element instead of
   * being bound to each item.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/Events/mouseleave
   *
   * @param {MouseEvent} e Moust event object.
   */

	}, {
		key: 'onMenuItemMouseLeave',
		value: function onMenuItemMouseLeave(e) {
			var _this7 = this;

			var isMobile = this.isMobile();

			(0, _query2.default)(e.target).up('li', this.el).filter(function (el) {
				return el !== e.relatedTarget && !el.contains(e.relatedTarget);
			}).each(function (el) {
				el.classList.remove(_this7.options.activeMenuItemClass);

				// Bail in mobile mode to prevent the menu from jumping.
				if (isMobile) {
					return;
				}

				_this7._hoverTimeouts[el.id] = setTimeout(function () {
					_this7.collapseSubmenu(el);
				}, _this7.options.hoverTimeout);
			});
		}

		/**
   * Handle the focus event on elements within the menu.
   *
   * Aids keyboard navigation by:
   * - Collapsing submenus in unrelated items to prevent submenus from
   *   overlapping in full screen mode. This is not done in mobile mode to
   *   prevent the menu from jumping when tabbing through items.
   * - Adding an 'is-active' class to ancestor menu items when any
   *   descendant is focused.
   * - Expanding a submenu when an element (link or toggle button) in the
   *   parent menu item receives focus.
   *
   * @param {FocusEvent} e Focus event object.
   */

	}, {
		key: 'onMenuLinkFocus',
		value: function onMenuLinkFocus(e) {
			var _this8 = this;

			// Collapse unrelated submenus except in mobile mode.
			if ('click' !== this.options.submenuToggleMode && !this.isMobile()) {
				this.collapseUnrelatedSubmenus(e.target);
			}

			var $parents = (0, _query2.default)(e.target).parents('li', this.el).each(function (el) {
				el.classList.add(_this8.options.activeMenuItemClass);
			});

			// Bail if the target menu item doesn't have a submenu.
			if (!this.hasSubmenu($parents[0])) {
				return;
			}

			var button = this.getSubmenuToggle($parents[0]);

			/*
    * Expand the submenu if a toggle button isn't visible.
    *
    * Also expands parents since keyboards can access elements positioned
    * off-screen, so reverse tabbing through a menu needs to make sure
    * parents are visible.
    */
			if (!button || !_query2.default.isVisible(button)) {
				$parents.each(function (el) {
					return _this8.expandSubmenu(el);
				});
			}
		}

		/**
   * Close submenus when focus leaves the containing item.
   *
   * Aids keyboard navigation in full screen mode by preventing multiple
   * expanded submenus from overlapping when tabbing through items.
   *
   * The relatedTarget property isn't available in some browsers for focus
   * events, so it's not possible to grab the focused element in a blur
   * event handler. For that reason, unrelated submenus are also collapsed in
   * onMenuLinkFocus.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget
   *
   * @todo Blur events sent when clicking outside the element the event is
   *       bound to also send null for the relatedTarget. This prevents
   *       clicking anywhere else in the document from collapsing the submenu.
   *
   * @param {FocusEvent} e Focus event object.
   */

	}, {
		key: 'onMenuLinkBlur',
		value: function onMenuLinkBlur(e) {
			var _this9 = this;

			// Remove the activeMenuItemClass from the parent menu items.
			(0, _query2.default)(e.target).parents('li', this.el).each(function (el) {
				el.classList.remove(_this9.options.activeMenuItemClass);
			});

			// Bail if the relatedTarget event is null.
			if (!e.relatedTarget) {
				return;
			}

			// Disable on mobile to prevent the menu from jumping while tabbing
			// through menu items and toggle buttons.
			if ('click' === this.options.submenuToggleMode || this.isMobile()) {
				return;
			}

			this.collapseUnrelatedSubmenus(e.relatedTarget);
		}
	}]);

	return NavMenu;
}();

NavMenu.defaults = {
	breakpoint: 768, // disable
	expandCurrentItem: false,
	hoverTimeout: 50,
	l10n: {},
	submenuToggleInsert: '', // default|append|false
	submenuToggleMode: 'hover', // hover|click; @todo hover-tap?

	// Configurable HTML classes.
	activeMenuItemClass: 'is-active',
	expandedMenuItemClass: 'is-sub-menu-open',
	expandedSubmenuClass: 'is-open',
	expandedSubmenuToggleClass: 'is-open',
	submenuToggleClass: 'sub-menu-toggle'
};

exports.default = NavMenu;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]; }());

/***/ })
/******/ ]);