import html from './fixtures/nav-menu.html';
import NavMenu from '../src/nav-menu.js';
import test from 'tape';

function triggerTouch( target, type ) {
	const e = document.createEvent( 'CustomEvent' );
	e.initCustomEvent( type, true, true, {} );
	return target.dispatchEvent( e );
}

test( 'set menu._touchStarted when tapping a link or link descendant with a clickable toggle button', function( t ) {
	t.plan( 4 );

	document.body.innerHTML = html;
	const menu = new NavMenu( '.menu' );
	menu.initialize();

	const menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	const menuLink = menuItem.querySelector( 'a' );
	const result = triggerTouch( menuLink, 'touchstart' );
	t.equal( result, true );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );
	t.equal( menu._touchStarted, true );
});

test( 'expand submenu on touchstart if the toggle button is not clickable', function( t ) {
	t.plan( 4 );

	document.body.innerHTML = html;
	const menu = new NavMenu( '.menu' );
	menu.initialize();

	const menuItem = document.getElementById( 'menu-item-1' );
	t.equal( menu.isSubmenuExpanded( menuItem ), false );

	const submenuToggleButton = menu.getSubmenuToggle( menuItem );
	submenuToggleButton.style.display = 'none';

	const menuLink = menuItem.querySelector( 'a' );
	const result = triggerTouch( menuLink, 'touchstart' );
	t.equal( result, false );
	t.equal( menu.isSubmenuExpanded( menuItem ), true );
	t.equal( menu._touchStarted, false );
});
