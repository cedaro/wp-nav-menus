var $ = require( '../src/query' );
var test = require( 'tape' );

test( 'empty selector', function( t ) {
	t.plan( 1 );
	t.equal( $().length, 0 );
});

test( 'element selector', function( t ) {
	t.plan( 2 );
	var div = document.createElement( 'div' );
	var $div = $( div );
	t.equal( $div.length, 1 );
	t.equal( $div[0], div );
});

test( 'tag selector', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	var $items = $( 'li' );
	t.equal( $items.length, 2 );
});

test( 'class selector', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li class="menu-item"><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	var $items = $( '.menu-item' );
	t.equal( $items.length, 1 );
});

test( 'instance as selector', function( t ) {
	t.plan( 1 );
	var $expected = $( document.createElement( 'div' ) );
	var $actual = $( $expected );
	t.equal( $actual, $expected );
});

test( '$.find', function( t ) {
	t.plan( 1 );
	document.body.innerHTML = '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>';
	var $items = $( 'ul' ).find( 'li' );
	t.equal( $items.length, 2 );
});
