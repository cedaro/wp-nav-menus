var fs = require( 'fs' );
var NavMenu = require( '../src/nav-menu.js' );
var test = require( 'tape' );

var html = fs.readFileSync( __dirname + '/fixtures/nav-menu.html', 'utf-8' );

function triggerFocus( target, type ) {
	var e = document.createEvent( 'CustomEvent' );
	e.initCustomEvent( type, true, true, {} );
	return target.dispatchEvent( e );
}

test( 'set active menu item when focusing a child element', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { hoverTimeout: 0 } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), false );

	var menuLink = menuItem.querySelector( 'a' );
	triggerFocus( menuLink, 'focus' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), true );
});

test( 'remove active menu class when focus leaves a menu item', function( t ) {
	t.plan( 1 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { submenuToggleInsert: false } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	menuItem.classList.add( NavMenu.defaults.activeMenuItemClass );

	var menuLink = menuItem.querySelector( 'a' );
	triggerFocus( menuLink, 'blur' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), false );
});

test( 'expand submenu when focusing related link', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { submenuToggleInsert: false } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	var menuLink = menuItem.querySelector( 'a' );
	triggerFocus( menuLink, 'focus' );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );
});

test( 'collapse submenu when focus leaves an item', function( t ) {
	t.plan( 2 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { submenuToggleInsert: false } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	menu.expandSubmenu( menuItem );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );

	menu.onMenuLinkBlur({
		type: 'blur',
		target: menuItem.querySelector( 'a' ),
		relatedTarget: menu.el
	});

	t.equal( menu.isSubmenuExpanded( menuItem ), false );
});

test.skip( 'collapse unrelated submenus when focusing a link or button', function( t ) {

});
