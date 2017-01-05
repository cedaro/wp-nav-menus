var _ = require( './utils' );

function Query( selector, context ) {
	var i, length;

	if ( selector instanceof Query ) {
		return selector;
	}

	if ( ! selector ) {
		return this;
	}

	context = context || document;
	if ( context.length ) {
		context = context[0];
	}

	if ( 'string' === typeof selector ) {
		selector = context.querySelectorAll( selector );
	}

	if ( selector && selector.nodeType ) {
		this.length = 1;
		this[0] = selector;
	} else {
		selector = Array.prototype.slice.call( selector );
		length = this.length = selector.length;

		for ( i = 0; i < length; i++ ) {
			this[ i ] = selector[ i ];
		}
	}
}

_.extend( Query.prototype, {
	length: 0,

	closest: function( selector, context ) {
		var el = this[0];
		context = context || document.body;

		while ( el && el !== context ) {
			if ( _.matches( el, selector ) ) {
				return el;
			}

			el = el.parentElement;
		}

		return null;
	},

	each: function( callback ) {
		_.each( this, callback );
		return this;
	},

	filter: function( callback ) {
		return query( Array.prototype.filter.call( this, callback ) );
	},

	/**
	 * @todo Improve performance: http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/
	 */
	find: function( selector ) {
		return query( this[0].querySelectorAll( selector ) );
	},

	parents: function( selector, context ) {
		var el = this[0],
			parents = [];

		context = context || document.body;

		while ( el && el.parentElement && el.parentElement !== context ) {
			if ( _.matches( el.parentElement, selector ) ) {
				parents.push( el.parentElement );
			}
			el = el.parentElement;
		}

		return query( parents );
	},

	up: function( selector, context ) {
		var items = Array.prototype.slice.call( this.parents( selector, context ) );

		if ( _.matches( this[0], selector ) ) {
			items.unshift( this[0] );
		}

		return query( items );
	}
});

function query( selector, context ) {
	return new Query( selector, context );
}

module.exports = _.extend( query, _, {
	isClickable: function( el ) {
		var styles;

		if ( ! el ) {
			return false;
		}

		styles = window.getComputedStyle( el );
		return 'none' !== styles.display && 'none' !== styles.pointerEvents;
	},

	isElementOrDescendant: function( el, tagName, container ) {
		return tagName === el.nodeName || null !== query( el ).closest( tagName, container );
	},

	isVisible: function( el ) {
		return el && 'none' !== window.getComputedStyle( el ).display;
	}
});
