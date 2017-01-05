var fs = require( 'fs' );
var NavMenu = require( '../src/nav-menu.js' );
var test = require( 'tape' );

var html = fs.readFileSync( __dirname + '/fixtures/nav-menu.html', 'utf-8' );

function triggerMouse( target, type, relatedTarget ) {
	var e = document.createEvent( 'MouseEvent' );
	e.initMouseEvent( type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, relatedTarget );
	return target.dispatchEvent( e );
}

test( 'collapse submenu when clicking outside the menu', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
	menu.expandSubmenu( menuItem );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );

	triggerMouse( document, 'click' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
});

test( 'toggle submenu when clicking a toggle button', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	var submenuToggleButton = menu.getSubmenuToggle( menuItem );
	triggerMouse( submenuToggleButton, 'click' );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );

	triggerMouse( submenuToggleButton, 'click' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
});

test( 'toggle active menu item when the mouse enters or leaves the menu item', function( t ) {
	t.plan( 4 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { hoverTimeout: 0 } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), false );

	triggerMouse( menuItem, 'mouseover' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), true );

	var menuLink = menuItem.querySelector( 'a' );
	triggerMouse( menuLink, 'mouseout', menuItem );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), true, 'the menu item should remain active when the mouse is over it' );

	triggerMouse( menuItem, 'mouseout' );
	t.equal( menuItem.classList.contains( NavMenu.defaults.activeMenuItemClass ), false );
});

test( 'toggle submenu when the mouse enters or leaves a menu item', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { hoverTimeout: 0 } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	triggerMouse( menuItem, 'mouseover' );
	t.equal( menu.isSubmenuExpanded( menuItem ), true, 'the submenu should expand on mouseover' );

	triggerMouse( menuItem, 'mouseout' );

	setTimeout(function () {
		t.equal( menu.isSubmenuExpanded( menuItem ), false, 'the submenu should collapse on mouseout' );
	}, 100 );
});

test( 'don\'t expand submenus on mouseover after a touchstart event on a link', function( t ) {
	t.plan( 3 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu', { hoverTimeout: 0 } );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	menu._isTouchStarted = true;
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	var menuLink = menuItem.querySelector( 'a' );
	triggerMouse( menuLink, 'mouseover', menuItem );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
	t.equal( menu._isTouchStarted, false, '_touchStarted should be reset in the mouseover handler' );
});

test.skip( 'don\'t expand submenus on mouseover on mobile devices', function( t ) {

});

test.skip( 'submenu collapses after hover timeout', function( t ) {

});

test.skip( 'don\'t expand submenus on mouseover when toggle mode is set to click', function( t ) {

});
