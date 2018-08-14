function each( items, callback ) {
	const length = items.length;

	for ( let i = 0; i < length; i++ ) {
		if ( false === callback.call( items[ i ], items[ i ], i ) ) {
			break;
		}
	}
}

function extend( target ) {
	const length = arguments.length;
	let i = 0;

	target = target || {};

	while ( ++i < length ) {
		if ( ! arguments[ i ] ) {
			continue;
		}

		for ( let key in arguments[ i ] ) {
			if ( arguments[ i ].hasOwnProperty( key ) ) {
				target[ key ] = arguments[ i ][ key ];
			}
		}
	}

	return target;
}

function generateUniqueId( prefix = '' ) {
	if ( '' !== prefix ) {
		prefix += '-';
	}

	return prefix + Math.random().toString( 36 ).slice( 2, 15 );
}

function getUniqueId( el, prefix ) {
	if ( el.id ) {
		return el.id;
	}

	return generateUniqueId( prefix );
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
function matches( el, selector ) {
	const fn = el && (
		el.matches ||
		el.webkitMatchesSelector ||
		el.mozMatchesSelector ||
		el.msMatchesSelector ||
		el.oMatchesSelector
	);

	return !! fn && fn.call( el, selector );
}

export default {
	each: each,
	extend: extend,
	getUid: getUniqueId,
	matches: matches
};
