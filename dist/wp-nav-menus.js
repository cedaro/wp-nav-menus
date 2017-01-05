/**
 * wp-nav-menus.js
 * https://github.com/cedaro/wp-nav-menus
 *
 * @copyright Copyright (c) 2016 Cedaro, LLC
 * @license MIT
 * @version 1.0.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cedaroNavMenu = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
	wpNavMenu = require( './src/entry' );

if ( jQuery ) {
	/**
	 * jQuery method to initialize menus.
	 *
	 * @memberOf jQuery.fn
	 *
	 * @param {Object} options Menu options.
	 * @return {jQuery} Chainable jQuery collection.
	 */
	jQuery.fn.cedaroNavMenu = function( options ) {
		return this.each(function() {
			var menu = wpNavMenu( this, options );
			menu.initialize();
		});
	};
}

/**
 * Export the method for instantiating a new menu.
 */
module.exports = wpNavMenu;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/entry":2}],2:[function(require,module,exports){
(function (global){
"use strict";
var l10n,
	$ = require( './query' ),
	customizerPartials = {},
	NavMenu = require( './nav-menu.js' ),
	wp = (typeof window !== "undefined" ? window['wp'] : typeof global !== "undefined" ? global['wp'] : null);

// Merge global localized strings.
l10n = $.extend({
	collapseSubmenu: 'Collapse submenu',
	expandSubmenu: 'Expand submenu'
}, global._cedaroNavMenuL10n );

/**
 * Initialize a partial placement in the customizer.
 *
 * Managing menus in the customizer causes the placement to be replaced for
 * each change, so it needs to be reinitialized each time to ensure submenus
 * are accessible.
 *
 * @param {wp.customize.selectiveRefresh.Placement} placement Partial placement.
 */
function initializeCustomizePlacement( placement ) {
	var addedMenu, removedMenu;

	if ( ! ( placement.partial.id in customizerPartials ) ) {
		return;
	}

	removedMenu = customizerPartials[ placement.partial.id ];
	removedMenu.destroy();

	// Initialize the new placement.
	addedMenu = new NavMenu( placement.container[0], removedMenu.options );
	addedMenu.initialize();

	// Synchronize expanded states from the removed menu.
	placement.removedNodes.find( '.' + removedMenu.options.expandedMenuItemClass ).each(function() {
		placement.container
			.find( '#' + this.id )
			.find( '> .{class}, > a .{class}'.replace( /{class}/g, removedMenu.options.submenuToggleClass ) )
			.trigger( 'click' );
	});
}

/**
 * Selective refresh support in the customizer.
 */
if ( wp && 'customize' in wp ) {
	wp.customize.bind( 'preview-ready', function() {
		wp.customize.selectiveRefresh.bind( 'partial-content-rendered', initializeCustomizePlacement );
	});
}

/**
 * Create a new menu object.
 *
 * @param {string|Element} el      Selector or HTML element.
 * @param {object}         options Menu options.
 * @return {NavMenu}               Nav menu instance.
 */
module.exports = function( el, options ) {
	var menu,
		partialId;

	// Fail gracefully in unsupported browsers.
	if ( ! ( 'addEventListener' in global ) ) {
		return;
	}

	options = options || {};
	options.l10n = options.l10n || {};

	// Merge global localized strings.
	$.extend( options.l10n, l10n );

	menu = new NavMenu( el, options );

	// Attempt to detect the partial id in the customizer and store a
	// reference so it can be cleaned up during a selective refresh.
	partialId = menu.el.getAttribute( 'data-customize-partial-id' );
	if ( partialId ) {
		customizerPartials[ partialId ] = menu;
	}

	return menu;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./nav-menu.js":3,"./query":4}],3:[function(require,module,exports){
"use strict";
var $ = require ( './query' ),
	document = window.document;

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
function NavMenu( el, options ) {
	var menu = this;

	this.el = $( el )[0];
	this.options = $.extend( {}, NavMenu.defaults, options );
	this.el.setAttribute( 'data-nav-menu-options', JSON.stringify( this.options ) );

	// Automatically bind all event handlers.
	Object.keys( Object.getPrototypeOf( this ) ).filter(function( key ) {
		return 'function' === typeof menu[ key ] && 0 === key.indexOf( 'on' );
	}).forEach(function( key ) {
		menu[ key ] = menu[ key ].bind( menu );
	});
}

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

NavMenu.prototype = {
	_initialized: false,
	_hasExpandedSubmenu: false,
	_hoverTimeouts: [],
	_touchStarted: false,
	_viewportWidth: null,

	/**
	 * Initialize the menu.
	 *
	 * @return {this}
	 */
	initialize: function() {
		var menu = this;

		if ( this._initialized ) {
			return;
		}

		this._initialized = true;

		// Ensure every menu item has an id to manage the hover state timeouts.
		this.$items = $( 'li', this.el ).each(function( el ) {
			el.id = $.getUid( el, 'menu-item' );
		});

		this.$submenus = $( 'li ul', this.el ).each(function( el ) {
			el.setAttribute( 'aria-expanded', 'false' );
		});

		if ( false !== this.options.submenuToggleInsert ) {
			this.insertSubmenuToggleButtons();
		}

		document.addEventListener( 'click', this.onDocumentClick, true );
		this.el.addEventListener( 'click', this.onSubmenuToggleClick, false );

		if ( 'hover' === this.options.submenuToggleMode /*&& 'disable' !== this.options.breakpoint*/ ) {
			this.el.addEventListener( 'touchstart', this.onMenuLinkTouchStart, false );
			this.el.addEventListener( 'mouseover', this.onMenuItemMouseEnter, false );
			this.el.addEventListener( 'mouseout', this.onMenuItemMouseLeave, false );
		}

		// Use capturing mode to support event delegation.
		// @link https://developer.mozilla.org/en-US/docs/Web/Events/blur#Event_delegation
		this.el.addEventListener( 'focus', this.onMenuLinkFocus, true );
		this.el.addEventListener( 'blur', this.onMenuLinkBlur, true );

		// Expand current submenus on initialization.
		if (
			menu.options.expandCurrentItem &&
			( 'click' === menu.options.submenuToggleMode || menu.isMobile() )
		) {
			this.$items.filter(function( el ) {
				return el.classList.contains( 'current-menu-item' ) || el.classList.contains( 'current-menu-ancestor' );
			}).each(function( el ) {
				menu.expandSubmenu( el );
			});
		}

		return this;
	},

	/**
	 * Destroy the menu.
	 *
	 * Cleans up delegated event listeners.
	 *
	 * @todo Consider removing toggle buttons.
	 */
	destroy: function() {
		document.removeEventListener( 'click', this.onDocumentClick, true );
		this.el.removeEventListener( 'click', this.onSubmenuToggleClick, false );
		this.el.removeEventListener( 'mouseover', this.onMenuItemMouseEnter, false );
		this.el.removeEventListener( 'mouseout', this.onMenuItemMouseLeave, false );
		this.el.removeEventListener( 'focus', this.onMenuLinkFocus, true );
		this.el.removeEventListener( 'blur', this.onMenuLinkBlur, true );
	},

	/**
	 * Whether the menu is in mobile mode.
	 *
	 * @return {boolean}
	 */
	isMobile: function() {
		if ( 'disable' === this.options.breakpoint ) {
			return true;
		}

		return this.getViewportWidth() < this.options.breakpoint;
	},

	/**
	 * Collapse the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	collapseSubmenu: function( menuItem ) {
		var button = this.getSubmenuToggle( menuItem ),
			$submenu = $( '.sub-menu', menuItem );

		menuItem.classList.remove( this.options.expandedMenuItemClass );

		if ( button ) {
			button.classList.remove( this.options.expandedSubmenuToggleClass );
			button.setAttribute( 'aria-expanded', 'false' );
			$( '.screen-reader-text', button )[0].innerHTML = this.options.l10n.expandSubmenu || 'Expand submenu';
		}

		if ( $submenu.length ) {
			$submenu[0].classList.remove( this.options.expandedSubmenuClass );
			$submenu[0].setAttribute( 'aria-expanded', 'false' );
		}
	},

	/**
	 * Collapse all submenus.
	 */
	collapseAllSubmenus: function() {
		var menu = this;

		this.$items.each(function( el ) {
			el.classList.remove( menu.options.activeMenuItemClass );
			menu.collapseSubmenu( el );
		});
	},

	/**
	 * Collapse submenus in branches that don't contain the focused element.
	 *
	 * @param {Element} focusedEl Element that has focus.
	 */
	collapseUnrelatedSubmenus: function( focusedEl ) {
		var menu = this;

		this.$items.each(function( el ) {
			if ( ! el.contains( focusedEl ) ) {
				el.classList.remove( menu.options.activeMenuItemClass );
				menu.collapseSubmenu( el );
			}
		});
	},

	/**
	 * Expand the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	expandSubmenu: function( menuItem ) {
		var button = this.getSubmenuToggle( menuItem ),
			$submenu = $( '.sub-menu', menuItem );

		menuItem.classList.add( this.options.activeMenuItemClass );

		if ( ! this.hasSubmenu( menuItem ) ) {
			return;
		}

		menuItem.classList.add( this.options.expandedMenuItemClass );

		if ( button ) {
			button.classList.add( this.options.expandedSubmenuToggleClass );
			button.setAttribute( 'aria-expanded', 'true' );
			$( '.screen-reader-text', button )[0].innerHTML = this.options.l10n.collapseSubmenu || 'Collapse submenu';
		}

		if ( $submenu.length ) {
			$submenu[0].classList.add( this.options.expandedSubmenuClass );
			$submenu[0].setAttribute( 'aria-expanded', 'true' );
		}
	},

	/**
	 * Retrieve the viewport width.
	 *
	 * @return {number}
	 */
	getViewportWidth: function() {
		return this._viewportWidth || Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
	},

	/**
	 * Set the viewport width.
	 *
	 * @param  {number} width Width of the viewport.
	 * @return {this}
	 */
	setViewportWidth: function( width ) {
		this._viewportWidth = parseInt( width, 10 );
		return this;
	},

	/**
	 * Retrieve the submenu toggle button from a menu item.
	 *
	 * @param  {Element} menuItem Menu item element.
	 * @return {Element}
	 */
	getSubmenuToggle: function( menuItem ) {
		return $( '.' + this.options.submenuToggleClass, menuItem )[0];
	},

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
	hasSubmenu: function ( menuItem ) {
		return $( '.sub-menu', menuItem ).length > 0; //classList.contains( 'menu-item-has-children' );
	},

	/**
	 * Insert toggle buttons in menu items that contain a submenu.
	 */
	insertSubmenuToggleButtons: function() {
		var button, span,
			menu = this;

		button = document.createElement( 'button' );
		button.setAttribute( 'class', menu.options.submenuToggleClass );
		button.setAttribute( 'aria-expanded', 'false' );

		span = document.createElement( 'span' );
		span.setAttribute( 'class', 'screen-reader-text' );
		span.innerHTML = this.options.l10n.expandSubmenu || 'Expand submenu';

		button.appendChild( span );

		this.$submenus.each(function( submenu ) {
			var buttonInstance = button.cloneNode( true );

			// Assign an id to each submenu to use in ARIA attributes.
			if ( ! submenu.id ) {
				submenu.id = $.getUid( submenu, 'sub-menu' );
			}

			buttonInstance.setAttribute( 'aria-controls', submenu.id );

			if ( 'append' !== menu.options.submenuToggleInsert ) {
				// Insert the toggle button before the submenu element.
				submenu.parentElement.insertBefore( buttonInstance, submenu );
				return;
			}

			// Append the toggle button to the parent item anchor element.
			// This should primarily be used for backward compatibility.
			$( submenu.parentElement.children ).each(function( el ) {
				if ( 'A' === el.nodeName ) {
					el.appendChild( buttonInstance );
					return false;
				}
			});
		});
	},

	isSubmenuExpanded: function( menuItem ) {
		return menuItem.classList.contains( this.options.expandedMenuItemClass );
	},

	/**
	 * Toggle the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	toggleSubmenu: function( menuItem ) {
		if ( this.isSubmenuExpanded( menuItem ) ) {
			this.collapseSubmenu( menuItem );
		} else {
			this.expandSubmenu( menuItem );
		}
	},

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
	onDocumentClick: function( e ) {
		// Don't do this in click mode or on mobile.
		if ( 'click' === this.options.submenuToggleMode || this.isMobile() ) {
			return;
		}

		if ( this.el === e.target || ! this.el.contains( e.target ) ) {
			this.collapseAllSubmenus();
		}
	},

	/**
	 * Handle clicks on submenu toggle buttons.
	 *
	 * Delegated to the menu element, so need to ensure the click is on a
	 * toggle button before handling it.
	 *
	 * @param {MouseEvent} e Mouse event object.
	 */
	onSubmenuToggleClick: function( e ) {
		var menuItem,
			button = $( e.target ).closest( '.' + this.options.submenuToggleClass, this.el );

		// Bail if this isn't a click on a toggle button.
		if ( ! button ) {
			return;
		}

		e.preventDefault();

		menuItem = $( e.target ).closest( 'li', this.el );
		this.toggleSubmenu( menuItem );
	},

	/**
	 * Handle touchstart events on menu links.
	 *
	 * On touch devices, make the first click open a submenu if there isn't a
	 * clickable toggle button available. Otherwise, the submenus wouldn't be
	 * accessible on touch devices.
	 *
	 * @param {TouchEvent} e Touch event object.
	 */
	onMenuLinkTouchStart: function( e ) {
		var button, target;

		// Bail if this isn't a touchstart on the anchor element.
		if ( ! $.isElementOrDescendant( e.target, 'A', this.el ) ) {
			return;
		}

		target = $( e.target ).closest( 'li', this.el );

		// Bail if a target couldn't be found.
		if ( ! target ) {
			return;
		}

		// Bail if there isn't a submenu in this item or it's already expanded.
		if ( ! this.hasSubmenu( target ) || this.isSubmenuExpanded( target ) ) {
			return;
		}

		button = this.getSubmenuToggle( target );

		// Expand the submenu and disable the click event if a clickable toggle
		// button isn't available.
		if ( ! $.isClickable( button ) ) {
			e.stopImmediatePropagation();
			e.preventDefault();
			this.expandSubmenu( target );
			this.collapseUnrelatedSubmenus( e.target );
		} else {
			this._touchStarted = true;
		}
	},

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
	onMenuItemMouseEnter: function( e ) {
		var related, target,
			isTouchEvent = this._touchStarted,
			menu = this;

		// Reset the touch started flag.
		this._isTouchStarted = false;

		target = $( e.target ).closest( 'li', this.el );
		related = $( e.relatedTarget ).closest( 'li', this.el );

		/*
		 * Bail if a target couldn't be found, or if the cursor is already in
		 * the target element. Handling mouseover events like this mimics
		 * mousenter behavior.
		 */
		if ( ! target || related === target ) {
			return;
		}

		// Clear the timeout to hide a submenu when re-entering an item.
		$( e.target ).up( 'li', this.el ).each(function( el ) {
			clearTimeout( menu._hoverTimeouts[ el.id ] );
			el.classList.add( menu.options.activeMenuItemClass );
		});

		// Bail if there isn't a submenu in this item or it's already expanded.
		if ( ! this.hasSubmenu( target ) || this.isSubmenuExpanded( target ) ) {
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
		if ( ! isTouchEvent || ! $.isElementOrDescendant( e.target, 'A', this.el ) ) {
			// Don't expand on mobile to prevent the menu from jumping.
			if ( ! this.isMobile() ) {
				this.expandSubmenu( target );
			}
		}
	},

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
	onMenuItemMouseLeave: function( e ) {
		var menu = this,
			isMobile = menu.isMobile();

		$( e.target ).up( 'li', this.el ).filter(function( el ) {
			return el !== e.relatedTarget && ! el.contains( e.relatedTarget );
		}).each(function( el ) {
			el.classList.remove( menu.options.activeMenuItemClass );

			// Bail in mobile mode to prevent the menu from jumping.
			if ( isMobile ) {
				return;
			}

			menu._hoverTimeouts[ el.id ] = setTimeout(function() {
				menu.collapseSubmenu( el );
			}, menu.options.hoverTimeout );
		});
	},

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
	onMenuLinkFocus: function( e ) {
		var button, $parents,
			menu = this;

		// Collapse unrelated submenus except in mobile mode.
		if ( 'click' !== menu.options.submenuToggleMode && ! menu.isMobile() ) {
			menu.collapseUnrelatedSubmenus( e.target );
		}

		$parents = $( e.target ).parents( 'li', menu.el ).each(function( el ) {
			el.classList.add( menu.options.activeMenuItemClass );
		});

		// Bail if the target menu item doesn't have a submenu.
		if ( ! menu.hasSubmenu( $parents[ 0 ] ) ) {
			return;
		}

		button = this.getSubmenuToggle( $parents[0] );

		/*
		 * Expand the submenu if a toggle button isn't visible.
		 *
		 * Also expands parents since keyboards can access elements positioned
		 * off-screen, so reverse tabbing through a menu needs to make sure
		 * parents are visible.
		 */
		if ( ! button || ! $.isVisible( button ) ) {
			$parents.each(function( el ) {
				menu.expandSubmenu( el );
			});
		}
	},

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
	onMenuLinkBlur: function( e ) {
		var menu = this;

		// Remove the activeMenuItemClass from the parent menu items.
		$( e.target ).parents( 'li', menu.el ).each(function( el ) {
			el.classList.remove( menu.options.activeMenuItemClass );
		});

		// Bail if the relatedTarget event is null.
		if ( ! e.relatedTarget ) {
			return;
		}

		// Disable on mobile to prevent the menu from jumping while tabbing
		// through menu items and toggle buttons.
		if ( 'click' === menu.options.submenuToggleMode || menu.isMobile() ) {
			return;
		}

		menu.collapseUnrelatedSubmenus( e.relatedTarget );
	}
};

module.exports = NavMenu;

},{"./query":4}],4:[function(require,module,exports){
"use strict";
var _ = require( './utils' );

function Query( selector, context ) {
	var i, length;

	if ( selector instanceof Query ) {
		return selector;
	}

	if ( ! selector ) {
		return this;
	}

	context = context || document;
	if ( context.length ) {
		context = context[0];
	}

	if ( 'string' === typeof selector ) {
		selector = context.querySelectorAll( selector );
	}

	if ( selector && selector.nodeType ) {
		this.length = 1;
		this[0] = selector;
	} else {
		selector = Array.prototype.slice.call( selector );
		length = this.length = selector.length;

		for ( i = 0; i < length; i++ ) {
			this[ i ] = selector[ i ];
		}
	}
}

_.extend( Query.prototype, {
	length: 0,

	closest: function( selector, context ) {
		var el = this[0];
		context = context || document.body;

		while ( el && el !== context ) {
			if ( _.matches( el, selector ) ) {
				return el;
			}

			el = el.parentElement;
		}

		return null;
	},

	each: function( callback ) {
		_.each( this, callback );
		return this;
	},

	filter: function( callback ) {
		return query( Array.prototype.filter.call( this, callback ) );
	},

	/**
	 * @todo Improve performance: http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/
	 */
	find: function( selector ) {
		return query( this[0].querySelectorAll( selector ) );
	},

	parents: function( selector, context ) {
		var el = this[0],
			parents = [];

		context = context || document.body;

		while ( el && el.parentElement && el.parentElement !== context ) {
			if ( _.matches( el.parentElement, selector ) ) {
				parents.push( el.parentElement );
			}
			el = el.parentElement;
		}

		return query( parents );
	},

	up: function( selector, context ) {
		var items = Array.prototype.slice.call( this.parents( selector, context ) );

		if ( _.matches( this[0], selector ) ) {
			items.unshift( this[0] );
		}

		return query( items );
	}
});

function query( selector, context ) {
	return new Query( selector, context );
}

module.exports = _.extend( query, _, {
	isClickable: function( el ) {
		var styles;

		if ( ! el ) {
			return false;
		}

		styles = window.getComputedStyle( el );
		return 'none' !== styles.display && 'none' !== styles.pointerEvents;
	},

	isElementOrDescendant: function( el, tagName, container ) {
		return tagName === el.nodeName || null !== query( el ).closest( tagName, container );
	},

	isVisible: function( el ) {
		return el && 'none' !== window.getComputedStyle( el ).display;
	}
});

},{"./utils":5}],5:[function(require,module,exports){
"use strict";
function each( items, callback ) {
	var i,
		length = items.length;

	for ( i = 0; i < length; i++ ) {
		if ( false === callback.call( items[i], items[i], i ) ) {
			break;
		}
	}
}

function extend( target ) {
	var i = 0,
		length = arguments.length;

	target = target || {};

	while ( ++i < length ) {
		if ( ! arguments[ i ] ) {
			continue;
		}

		for ( var key in arguments[ i ] ) {
			if ( arguments[ i ].hasOwnProperty( key ) ) {
				target[ key ] = arguments[ i ][ key ];
			}
		}
	}

	return target;
}

function generateUniqueId( prefix ) {
	prefix = prefix || '';
	if ( '' !== prefix ) {
		prefix += '-';
	}
	return prefix + Math.random().toString( 36 ).slice( 2, 15 );
}

function getUniqueId( el, prefix ) {
	if ( el.id ) {
		return el.id;
	}

	return generateUniqueId( prefix );
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
function matches( el, selector ) {
	var fn = el && (
		el.matches ||
		el.webkitMatchesSelector ||
		el.mozMatchesSelector ||
		el.msMatchesSelector ||
		el.oMatchesSelector
	);

	return !! fn && fn.call( el, selector );
}

module.exports = {
	each: each,
	extend: extend,
	getUid: getUniqueId,
	matches: matches
};

},{}]},{},[1])(1)
});