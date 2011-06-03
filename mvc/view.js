/**
 * A View is an object that interacts with the DOM.
 */
goog.provide("mvc.View");

goog.require("mvc.Model");

goog.require("goog.ui.Component");

/**
 * @constructor
 */
mvc.View = function(model, opt_domHelper) {
    goog.ui.Component.call(this, opt_domHelper);

    this.model = model;
};
goog.inherits(mvc.View, goog.ui.Component);


// mvc.View.prototype.
