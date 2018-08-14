# Changelog

## 2.0.0 - 2018-08-14

* Switched from Browserify to webpack.
* Refactored to use ES6 syntax.

The previous version used a UMD wrapper to support multiple environments, but some scripts caused compatibility issues by overriding global `require` or `define` methods that prevented wp-nav-menus.js from working properly, so the UMD wrapper has been removed to try to prevent conflicts from external scripts.

## 1.0.0

* First release.
