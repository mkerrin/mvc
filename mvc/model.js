/**
 *
 */
goog.provide("mvc.model");
goog.provide("mvc.model.Model");
goog.provide("mvc.model.EventType");

goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");

/**
 * @constructor
 */
mvc.model.ChangeEvent = function(attributes) {
    goog.events.Event.call(this, "change");

    this.attributes = attributes;
};
goog.inherits(mvc.model.ChangeEvent, goog.events.Event);


mvc.model.EventType = {
    CHANGE: mvc.model.ChangeEvent
};


/**
 * @constructor
 */
mvc.model.Model = function(attributes, options) {
    goog.events.EventTarget.call(this);

    this.attributes = attributes || {};

    this.changed = false;
};
goog.inherits(mvc.model.Model, goog.events.EventTarget);


/**
 * @private
 */
mvc.model.isEqual = function(a, b) {
    return a == b;
};


mvc.model.Model.prototype.get = function(attr) {
    return this.attributes[attr];
};


mvc.model.Model.prototype.set = function(attrs, options) {
    if (!attrs)
	return this;

    options || (options = {});

    var now = this.attributes;
    var updatedAttributes = {};

    for (var attr in attrs) {
	var val = attrs[attr];
	if (!mvc.model.isEqual(now[attr], val)) {
	    now[attr] = updatedAttributes[attr] = val;
	}
    }

    if (updatedAttributes && !options.silent) {
	this.changed = true;
	this.dispatchEvent(new mvc.model.ChangeEvent(updatedAttributes));
    }
};
