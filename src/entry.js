import $ from './query';
import NavMenu from './nav-menu';
import wp from 'wp';

const customizerPartials = {};

// Merge global localized strings.
const l10n = $.extend({
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
	if ( ! ( placement.partial.id in customizerPartials ) ) {
		return;
	}

	const removedMenu = customizerPartials[ placement.partial.id ];
	removedMenu.destroy();

	// Initialize the new placement.
	const addedMenu = new NavMenu( placement.container[0], removedMenu.options );
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
	wp.customize.bind( 'preview-ready', () => {
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
export default function( el, options = {} ) {
	// Fail gracefully in unsupported browsers.
	if ( ! ( 'addEventListener' in global ) ) {
		return;
	}

	options.l10n = options.l10n || {};

	// Merge global localized strings.
	$.extend( options.l10n, l10n );

	const menu = new NavMenu( el, options );

	// Attempt to detect the partial id in the customizer and store a
	// reference so it can be cleaned up during a selective refresh.
	const partialId = menu.el.getAttribute( 'data-customize-partial-id' );
	if ( partialId ) {
		customizerPartials[ partialId ] = menu;
	}

	return menu;
}
