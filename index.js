import jQuery from 'jquery';
import wpNavMenu from './src/entry';

if ( jQuery ) {
	/**
	 * jQuery method to initialize menus.
	 *
	 * @memberOf jQuery.fn
	 *
	 * @param {Object} options Menu options.
	 * @return {jQuery} Chainable jQuery collection.
	 */
	jQuery.fn.cedaroNavMenu = function( options ) {
		return this.each(function() {
			const menu = wpNavMenu( this, options );
			menu.initialize();
		});
	};
}

/**
 * Export the method for instantiating a new menu.
 */
module.exports = wpNavMenu;
