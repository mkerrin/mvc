/**
 * A View is an object that interacts with the DOM.
 */
goog.provide("mvc.view.View");

goog.require("mvc.model.Model");

goog.require("goog.ui.Component");

/**
 * @constructor
 */
mvc.view.View = function(model, opt_domHelper) {
    goog.ui.Component.call(this, opt_domHelper);

    this.model = model;
};
goog.inherits(mvc.view.View, goog.ui.Component);


mvc.view.View.prototype.