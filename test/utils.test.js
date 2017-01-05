var _ = require( '../src/utils' );
var test = require( 'tape' );

test( '_.each', function( t ) {
	t.plan( 4 );

	var i = 0;
	var items = [ 'a', 'b', 'c' ];

	_.each( items, function( item, index ) {
		t.equal( item, items[ index ] );
	});

	_.each( items, function( item, index ) {
		i++;
		return false;
	});

	t.equal( i, 1, 'returning false in the callback should break the loop' );
});

test( '_.extend', function( t ) {
	t.plan( 5 );

	var a = { value: 1 };
	var b = { value: 2 };
	var c = { value: 3, added: true };

	var d = _.extend( null, a );
	t.deepEqual( d, a );

	_.extend( a, b, c );
	t.equal( a.value, 3 );
	t.equal( a.added, true );

	var e = _.extend( {}, b, c );
	t.equal( b.value, 2 );
	t.equal( e.value, 3 );
});
