import $ from '../src/query';
import test from 'tape';

test( 'empty selector', function( t ) {
	t.plan( 1 );
	t.equal( $().length, 0 );
});

test( 'element selector', function( t ) {
	t.plan( 2 );
	const div = document.createElement( 'div' );
	const $div = $( div );
	t.equal( $div.length, 1 );
	t.equal( $div[0], div );
});

test( 'tag selector', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	const $items = $( 'li' );
	t.equal( $items.length, 2 );
});

test( 'class selector', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li class="menu-item"><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	const $items = $( '.menu-item' );
	t.equal( $items.length, 1 );
});

test( 'instance as selector', function( t ) {
	t.plan( 1 );
	const $expected = $( document.createElement( 'div' ) );
	const $actual = $( $expected );
	t.equal( $actual, $expected );
});

test( '$.find', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	const $items = $( 'ul' ).find( 'li' );
	t.equal( $items.length, 2 );
});
