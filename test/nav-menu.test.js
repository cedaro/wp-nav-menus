import html from './fixtures/nav-menu.html';
import NavMenu from '../src/nav-menu.js';
import test from 'tape';

test( 'constructor', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );

	t.equal( menu.el, document.querySelector( '.menu' ) );
	t.deepEqual( menu.options, NavMenu.defaults );
	t.deepEqual( JSON.parse( menu.el.getAttribute( 'data-nav-menu-options' ) ), NavMenu.defaults );
});

test( 'menu item ids generated on initialization', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	var menuItem = document.querySelector( '.menu-item-without-id' );

	t.notOk( menuItem.id );
	menu.initialize();
	t.ok( menuItem.id );
});

test( 'submenu toggle buttons inserted on initialization', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );

	t.notOk( document.querySelector( '.sub-menu-toggle' ) );
	menu.initialize();
	t.ok( document.querySelector( '.sub-menu-toggle' ) );
});

test( 'is mobile', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );

	t.equal( menu.setViewportWidth( 1024 ).isMobile(), false );
	t.equal( menu.setViewportWidth( 320 ).isMobile(), true );
});

test( 'is mobile when breakpoint is disabled', function( t ) {
	t.plan( 1 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { breakpoint: 'disable' } );

	t.equal( menu.setViewportWidth( 1024 ).isMobile(), true );
});

test( 'menu item has submenu', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );

	var menuItem = document.querySelector( '.menu-item-without-submenu' );
	t.equal( menu.hasSubmenu( menuItem ), false );

	menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.hasSubmenu( menuItem ), true );
});

test( 'toggle submenus', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	menu.toggleSubmenu( menuItem );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );

	menu.toggleSubmenu( menuItem );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
});

test( 'expand and collapse submenu', function( t ) {
	t.plan( 12 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	var submenuToggleButton = menuItem.querySelector( '.' + NavMenu.defaults.submenuToggleClass );
	var submenu = menuItem.querySelector( '.sub-menu' );

	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), false );
	t.equal( menuItem.classList.contains( NavMenu.defaults.expandedMenuItemClass ), false );
	t.equal( submenuToggleButton.classList.contains( NavMenu.defaults.expandedSubmenuToggleClass ), false );
	t.equal( submenu.classList.contains( NavMenu.defaults.expandedSubmenuClass ), false );

	menu.expandSubmenu( menuItem );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), true );
	t.equal( menuItem.classList.contains( NavMenu.defaults.expandedMenuItemClass ), true );
	t.equal( submenuToggleButton.classList.contains( NavMenu.defaults.expandedSubmenuToggleClass ), true );
	t.equal( submenu.classList.contains( NavMenu.defaults.expandedSubmenuClass ), true );

	menu.collapseSubmenu( menuItem );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), true );
	t.equal( menuItem.classList.contains( NavMenu.defaults.expandedMenuItemClass ), false );
	t.equal( submenuToggleButton.classList.contains( NavMenu.defaults.expandedSubmenuToggleClass ), false );
	t.equal( submenu.classList.contains( NavMenu.defaults.expandedSubmenuClass ), false );
});

test( 'aria expanded attributes', function( t ) {
	t.plan( 6 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	var submenuToggleButton = menuItem.querySelector( '.' + NavMenu.defaults.submenuToggleClass );
	var submenu = menuItem.querySelector( '.sub-menu' );

	t.equal( submenuToggleButton.getAttribute( 'aria-expanded' ), 'false' );
	t.equal( submenu.getAttribute( 'aria-expanded' ), 'false' );

	menu.expandSubmenu( menuItem );
	t.equal( submenuToggleButton.getAttribute( 'aria-expanded' ), 'true' );
	t.equal( submenu.getAttribute( 'aria-expanded' ), 'true' );

	menu.collapseSubmenu( menuItem );
	t.equal( submenuToggleButton.getAttribute( 'aria-expanded' ), 'false' );
	t.equal( submenu.getAttribute( 'aria-expanded' ), 'false' );
});

test( 'aria controls attribute on toggle button matches submenu id', function( t ) {
	t.plan( 1 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.querySelector( '.menu-item-has-children' );
	var submenuToggleButton = menuItem.querySelector( '.sub-menu-toggle' );
	var submenu = menuItem.querySelector( '.sub-menu' );

	t.equal( submenuToggleButton.getAttribute( 'aria-controls' ), submenu.id );
});
