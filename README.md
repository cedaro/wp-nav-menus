# wp-nav-menus.js

> Accessible, mobile-friendly navigation menus in WordPress incorporating best practices from modern default themes.

## Features

### Zero dependencies

Modern browser APIs are used to query the DOM, so no other dependencies are required. However, a small wrapper is provided if you're already loading jQuery and want to use it to initialize your menus.

### Touch Support

Attempts to work around the double tap issue common on iOS by preventing submenus from expanding on tap.

However, if a visible toggle button isn't available, the first tap will open the submenu to ensure it's accessible on touch devices. The second touch follows the link.

### Keyboard Support

Tabbing through menu items will automatically apply the same classes used to style menus for mouse and touch events, so you can ensure submenus are always accessible.

### Accessibility

Buttons are automatically inserted in each parent menu item to toggle visibility of the submenu. When initialized, unique IDs are generated for each submenu so `aria-controls` attributes can be added to the toggle buttons.

The toggle buttons and submenus both receive `aria-expanded` attributes that are updated when expanding or collapsing a submenu.

### Customizer Integration

Automatically integrates with the Selective Refresh API in the WordPress customizer.

When managing menus in the customizer, the HTML for the entire menu is replaced with each change. If the menu isn't reinitialized, the preview won't look or behave like it does on the front end.

With `wp-nav-menus.js`, menu events are automatically cleaned up and reinitialized after each selective refresh. Expanded menu states are remembered using a technique similar to Twenty Fifteen.

### Internationalization

The strings in `wp-nav-menus.js` can be globally localized with `wp_localize_script()`, or menu-specific strings can be passed as options when initializing a new menu.

### Style

Design menus however you like.

`wp-nav-menus.js` adds HTML classes to menu items that can be used to show or hide submenus and highlight active menu items without worrying about the input device (mouse, touch, keyboard).


## Usage

### Download

Save one of the scripts from the `/dist` directory to your theme.

### Enqueue

Enqueue and localize the script in `functions.php`:

```php
<?php
wp_enqueue_script(
	'wp-nav-menus',
	get_theme_file_uri( '/assets/js/vendor/wp-nav-menus.js' ),
	array(),
	'1.0.0',
	true
);

wp_localize_script( 'wp-nav-menus', '_cedaroNavMenuL10n', array(
	'collapseSubmenu' => esc_html__( 'Collapse submenu' ),
	'expandSubmenu'   => esc_html__( 'Expand submenu' ),
) );
```

### Initialize

Initialize the menu in a JavaScript file:

```js
var navMenu = cedaroNavMenu( '.menu' );
navMenu.initialize();
```

Or using jQuery:

```js
$( '.menu' ).cedaroNavMenu();
```

*Ensure the selector is the container that used for the partial in the customizer to automatically support Selective Refresh.*


## Alternatives

* [mo.js](https://github.com/themefoundation/mo-js) by Alex Mansfield
