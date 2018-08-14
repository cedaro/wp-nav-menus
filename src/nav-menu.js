import $ from './query';

class NavMenu {
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
	constructor ( el, options ) {
		this._initialized = false;
		this._hasExpandedSubmenu = false;
		this._hoverTimeouts = [];
		this._touchStarted = false;
		this._viewportWidth = null;

		this.el = $( el )[0];
		this.options = $.extend( {}, NavMenu.defaults, options );
		this.el.setAttribute( 'data-nav-menu-options', JSON.stringify( this.options ) );

		// Automatically bind all event handlers.
		Object.getOwnPropertyNames( NavMenu.prototype ).filter( key => {
			return 'function' === typeof this[ key ] && 0 === key.indexOf( 'on' );
		}).forEach( key => {
			this[ key ] = this[ key ].bind( this );
		});
	}

	/**
	 * Initialize the menu.
	 *
	 * @return {this}
	 */
	initialize() {
		if ( this._initialized ) {
			return;
		}

		this._initialized = true;

		// Ensure every menu item has an id to manage the hover state timeouts.
		this.$items = $( 'li', this.el ).each( el => el.id = $.getUid( el, 'menu-item' ) );

		this.$submenus = $( 'li ul', this.el ).each( el => el.setAttribute( 'aria-expanded', 'false' ) );

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
			this.options.expandCurrentItem &&
			( 'click' === this.options.submenuToggleMode || this.isMobile() )
		) {
			this.$items.filter( el => {
				return el.classList.contains( 'current-menu-item' ) || el.classList.contains( 'current-menu-ancestor' );
			}).each( el => this.expandSubmenu( el ) );
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
	destroy() {
		document.removeEventListener( 'click', this.onDocumentClick, true );
		this.el.removeEventListener( 'click', this.onSubmenuToggleClick, false );
		this.el.removeEventListener( 'mouseover', this.onMenuItemMouseEnter, false );
		this.el.removeEventListener( 'mouseout', this.onMenuItemMouseLeave, false );
		this.el.removeEventListener( 'focus', this.onMenuLinkFocus, true );
		this.el.removeEventListener( 'blur', this.onMenuLinkBlur, true );
	}

	/**
	 * Whether the menu is in mobile mode.
	 *
	 * @return {boolean}
	 */
	isMobile() {
		if ( 'disable' === this.options.breakpoint ) {
			return true;
		}

		return this.getViewportWidth() < this.options.breakpoint;
	}

	/**
	 * Collapse the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	collapseSubmenu( menuItem ) {
		const button = this.getSubmenuToggle( menuItem );
		const $submenu = $( '.sub-menu', menuItem );

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
	}

	/**
	 * Collapse all submenus.
	 */
	collapseAllSubmenus() {
		this.$items.each( el => {
			el.classList.remove( this.options.activeMenuItemClass );
			this.collapseSubmenu( el );
		});
	}

	/**
	 * Collapse submenus in branches that don't contain the focused element.
	 *
	 * @param {Element} focusedEl Element that has focus.
	 */
	collapseUnrelatedSubmenus( focusedEl ) {
		this.$items.each( el => {
			if ( ! el.contains( focusedEl ) ) {
				el.classList.remove( this.options.activeMenuItemClass );
				this.collapseSubmenu( el );
			}
		});
	}

	/**
	 * Expand the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	expandSubmenu( menuItem ) {
		const button = this.getSubmenuToggle( menuItem );
		const $submenu = $( '.sub-menu', menuItem );

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
	}

	/**
	 * Retrieve the viewport width.
	 *
	 * @return {number}
	 */
	getViewportWidth() {
		return this._viewportWidth || Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
	}

	/**
	 * Set the viewport width.
	 *
	 * @param  {number} width Width of the viewport.
	 * @return {this}
	 */
	setViewportWidth( width ) {
		this._viewportWidth = parseInt( width, 10 );
		return this;
	}

	/**
	 * Retrieve the submenu toggle button from a menu item.
	 *
	 * @param  {Element} menuItem Menu item element.
	 * @return {Element}
	 */
	getSubmenuToggle( menuItem ) {
		return $( '.' + this.options.submenuToggleClass, menuItem )[0];
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
	hasSubmenu( menuItem ) {
		return $( '.sub-menu', menuItem ).length > 0; //classList.contains( 'menu-item-has-children' );
	}

	/**
	 * Insert toggle buttons in menu items that contain a submenu.
	 */
	insertSubmenuToggleButtons() {
		const button = document.createElement( 'button' );
		button.setAttribute( 'class', this.options.submenuToggleClass );
		button.setAttribute( 'aria-expanded', 'false' );

		const span = document.createElement( 'span' );
		span.setAttribute( 'class', 'screen-reader-text' );
		span.innerHTML = this.options.l10n.expandSubmenu || 'Expand submenu';

		button.appendChild( span );

		this.$submenus.each( submenu => {
			const buttonInstance = button.cloneNode( true );

			// Assign an id to each submenu to use in ARIA attributes.
			if ( ! submenu.id ) {
				submenu.id = $.getUid( submenu, 'sub-menu' );
			}

			buttonInstance.setAttribute( 'aria-controls', submenu.id );

			if ( 'append' !== this.options.submenuToggleInsert ) {
				// Insert the toggle button before the submenu element.
				submenu.parentElement.insertBefore( buttonInstance, submenu );
				return;
			}

			// Append the toggle button to the parent item anchor element.
			// This should primarily be used for backward compatibility.
			$( submenu.parentElement.children ).each( el => {
				if ( 'A' === el.nodeName ) {
					el.appendChild( buttonInstance );
					return false;
				}
			});
		});
	}

	isSubmenuExpanded( menuItem ) {
		return menuItem.classList.contains( this.options.expandedMenuItemClass );
	}

	/**
	 * Toggle the submenu in a menu item.
	 *
	 * @param {Element} menuItem Menu item element.
	 */
	toggleSubmenu( menuItem ) {
		if ( this.isSubmenuExpanded( menuItem ) ) {
			this.collapseSubmenu( menuItem );
		} else {
			this.expandSubmenu( menuItem );
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
	onDocumentClick( e ) {
		// Don't do this in click mode or on mobile.
		if ( 'click' === this.options.submenuToggleMode || this.isMobile() ) {
			return;
		}

		if ( this.el === e.target || ! this.el.contains( e.target ) ) {
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
	onSubmenuToggleClick( e ) {
		const button = $( e.target ).closest( '.' + this.options.submenuToggleClass, this.el );

		// Bail if this isn't a click on a toggle button.
		if ( ! button ) {
			return;
		}

		e.preventDefault();

		const menuItem = $( e.target ).closest( 'li', this.el );
		this.toggleSubmenu( menuItem );
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
	onMenuLinkTouchStart( e ) {
		// Bail if this isn't a touchstart on the anchor element.
		if ( ! $.isElementOrDescendant( e.target, 'A', this.el ) ) {
			return;
		}

		const target = $( e.target ).closest( 'li', this.el );

		// Bail if a target couldn't be found.
		if ( ! target ) {
			return;
		}

		// Bail if there isn't a submenu in this item or it's already expanded.
		if ( ! this.hasSubmenu( target ) || this.isSubmenuExpanded( target ) ) {
			return;
		}

		const button = this.getSubmenuToggle( target );

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
	onMenuItemMouseEnter( e ) {
		const isTouchEvent = this._touchStarted;

		// Reset the touch started flag.
		this._isTouchStarted = false;

		const target = $( e.target ).closest( 'li', this.el );
		const related = $( e.relatedTarget ).closest( 'li', this.el );

		/*
		 * Bail if a target couldn't be found, or if the cursor is already in
		 * the target element. Handling mouseover events like this mimics
		 * mousenter behavior.
		 */
		if ( ! target || related === target ) {
			return;
		}

		// Clear the timeout to hide a submenu when re-entering an item.
		$( e.target ).up( 'li', this.el ).each( el => {
			clearTimeout( this._hoverTimeouts[ el.id ] );
			el.classList.add( this.options.activeMenuItemClass );
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
	onMenuItemMouseLeave( e ) {
		const isMobile = this.isMobile();

		$( e.target ).up( 'li', this.el ).filter( el => {
			return el !== e.relatedTarget && ! el.contains( e.relatedTarget );
		}).each( el => {
			el.classList.remove( this.options.activeMenuItemClass );

			// Bail in mobile mode to prevent the menu from jumping.
			if ( isMobile ) {
				return;
			}

			this._hoverTimeouts[ el.id ] = setTimeout( () => {
				this.collapseSubmenu( el );
			}, this.options.hoverTimeout );
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
	onMenuLinkFocus( e ) {
		// Collapse unrelated submenus except in mobile mode.
		if ( 'click' !== this.options.submenuToggleMode && ! this.isMobile() ) {
			this.collapseUnrelatedSubmenus( e.target );
		}

		const $parents = $( e.target ).parents( 'li', this.el ).each( el => {
			el.classList.add( this.options.activeMenuItemClass );
		});

		// Bail if the target menu item doesn't have a submenu.
		if ( ! this.hasSubmenu( $parents[ 0 ] ) ) {
			return;
		}

		const button = this.getSubmenuToggle( $parents[0] );

		/*
		 * Expand the submenu if a toggle button isn't visible.
		 *
		 * Also expands parents since keyboards can access elements positioned
		 * off-screen, so reverse tabbing through a menu needs to make sure
		 * parents are visible.
		 */
		if ( ! button || ! $.isVisible( button ) ) {
			$parents.each( el =>  this.expandSubmenu( el ) );
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
	onMenuLinkBlur( e ) {
		// Remove the activeMenuItemClass from the parent menu items.
		$( e.target ).parents( 'li', this.el ).each( el => {
			el.classList.remove( this.options.activeMenuItemClass );
		});

		// Bail if the relatedTarget event is null.
		if ( ! e.relatedTarget ) {
			return;
		}

		// Disable on mobile to prevent the menu from jumping while tabbing
		// through menu items and toggle buttons.
		if ( 'click' === this.options.submenuToggleMode || this.isMobile() ) {
			return;
		}

		this.collapseUnrelatedSubmenus( e.relatedTarget );
	}
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

export default NavMenu;
