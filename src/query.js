import _ from './utils';

function Query( selector, context = document ) {
	if ( selector instanceof Query ) {
		return selector;
	}

	if ( ! selector ) {
		return this;
	}

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
		const length = this.length = selector.length;

		for ( let i = 0; i < length; i++ ) {
			this[ i ] = selector[ i ];
		}
	}
}

_.extend( Query.prototype, {
	length: 0,

	closest: function( selector, context = document.body ) {
		let el = this[0];

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

	parents: function( selector, context = document.body ) {
		let el = this[0];
		const parents = [];

		while ( el && el.parentElement && el.parentElement !== context ) {
			if ( _.matches( el.parentElement, selector ) ) {
				parents.push( el.parentElement );
			}

			el = el.parentElement;
		}

		return query( parents );
	},

	up: function( selector, context ) {
		const items = Array.prototype.slice.call( this.parents( selector, context ) );

		if ( _.matches( this[0], selector ) ) {
			items.unshift( this[0] );
		}

		return query( items );
	}
});

function query( selector, context ) {
	return new Query( selector, context );
}

export default _.extend( query, _, {
	isClickable: function( el ) {
		if ( ! el ) {
			return false;
		}

		const styles = window.getComputedStyle( el );
		return 'none' !== styles.display && 'none' !== styles.pointerEvents;
	},

	isElementOrDescendant: function( el, tagName, container ) {
		return tagName === el.nodeName || null !== query( el ).closest( tagName, container );
	},

	isVisible: function( el ) {
		return el && 'none' !== window.getComputedStyle( el ).display;
	}
});
