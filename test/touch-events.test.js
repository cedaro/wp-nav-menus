var fs = require( 'fs' );
var NavMenu = require( '../src/nav-menu.js' );
var test = require( 'tape' );

var html = fs.readFileSync( __dirname + '/fixtures/nav-menu.html', 'utf-8' );

function triggerTouch( target, type ) {
	var e = document.createEvent( 'CustomEvent' );
	e.initCustomEvent( type, true, true, {} );
	return target.dispatchEvent( e );
}

test( 'set menu._touchStarted when tapping a link or link descendant with a clickable toggle button', function( t ) {
	t.plan( 4 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	var menuLink = menuItem.querySelector( 'a' );
	var result = triggerTouch( menuLink, 'touchstart' );
	t.equal( result, true );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
	t.equal( menu._touchStarted, true );
});

test( 'expand submenu on touchstart if the toggle button is not clickable', function( t ) {
	t.plan( 4 );

	document.body.innerHTML = html;
	var menu = new NavMenu( '.menu' );
	menu.initialize();

	var menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	var submenuToggleButton = menu.getSubmenuToggle( menuItem );
	submenuToggleButton.style.display = 'none';

	var menuLink = menuItem.querySelector( 'a' );
	var result = triggerTouch( menuLink, 'touchstart' );
	t.equal( result, false );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );
	t.equal( menu._touchStarted, false );
});
