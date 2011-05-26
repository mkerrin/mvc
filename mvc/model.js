/**
 * a Model is an object that contains attributes. When a model is updated
 * a ChangeEvent is triggered.
 *
 * API:
 *
 * Model.changed
 * Model.attributes
 * Model.update(newattributes)
 *
 * Model.save()
 * Model.fetch()
 */
goog.provide("mvc.model");
goog.provide("mvc.model.Model");
goog.provide("mvc.model.EventType");

goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");

goog.require("goog.net.XhrIo");
goog.require("goog.json");

/**
 * @constructor
 */
mvc.model.ChangeEvent = function(attributes) {
    goog.events.Event.call(this, "change");

    this.attributes = attributes;
};
goog.inherits(mvc.model.ChangeEvent, goog.events.Event);


mvc.model.EventType = {
    CHANGE: "change"
};


/**
 * @constructor
 */
mvc.model.Model = function(attributes) {
    goog.events.EventTarget.call(this);

    this.attributes = attributes || {};

    this.changed = false;
};
goog.inherits(mvc.model.Model, goog.events.EventTarget);


/**
 *
 */
mvc.model.Model.prototype.url = null;


/**
 * isEqual needs to compare two objects, arrays, literals to see if they
 * contain the same value.
 *
 * @private
 */
mvc.model.isEqual = function(a, b) {
    return a == b;
};


mvc.model.Model.prototype.get = function(attr) {
    return this.attributes[attr];
};


mvc.model.Model.prototype.set = function(attr, value) {
    this.attributes[attr] = value;
    this.changed = true;
};


mvc.model.Model.prototype.update = function(attrs) {
    if (!attrs)
        return this;

    var now = this.attributes;
    var updatedAttributes = {};

    for (var attr in attrs) {
        var val = attrs[attr];
        if (!mvc.model.isEqual(now[attr], val)) {
            now[attr] = updatedAttributes[attr] = val;
        }
    }

    if (updatedAttributes) {
        this.changed = true;
        this.dispatchEvent(new mvc.model.ChangeEvent(updatedAttributes));
    }
};


/**
 * Interact with the data on the server. We can save or fetch the data.
 */
mvc.model.Model.prototype.save = function(opt_success, opt_error) {
    var model = this;

    var save_callback = function(event) {
        var xhr = event.target;
        if (xhr.isSuccess()) {
            var resp_data = goog.json.parse(xhr.getResponseText());
            model.update(resp_data);
            model.changed = false;
            if (opt_success)
                opt_succes(model, resp_data, xhr)
        } else {
            if (opt_error)
                opt_error(model, xhr);
        }
    };

    goog.net.XhrIo.send(
        model.url,
        save_callback,
        "POST",
        goog.json.serialize(model.attributes),
        {"Content-Type": "application/json"}
    );
};


/**
 *
 */
mvc.model.Model.prototype.fetch = function(opt_success, opt_error) {
    var fetch_callback = function(event) {
        var xhr = event.target;
        if (xhr.isSuccess()) {
            var resp_data = goog.json.parse(xhr.getResponseText());
            this.update(resp_data);
            this.changed = false;
            if (opt_success)
                opt_success(this, resp_data)
        } else {
            if (opt_error)
                opt_error(this, xhr);
        }
    };
    goog.net.XhrIo.send(this.url, fetch_callback, "GET");
};
