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
goog.provide("mvc.Model");
goog.provide("mvc.Model.EventType");

goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");

goog.require("goog.net.XhrIo");
goog.require("goog.json");

/**
 * Model object.
 *
 * @constructor
 */
mvc.Model = function(attributes) {
    goog.events.EventTarget.call(this);

    this.attributes = attributes || {};
    this.id = this.attributes[this.idAttribute];

    this.changed = false;
};
goog.inherits(mvc.Model, goog.events.EventTarget);


mvc.Model.prototype.base_url = null;


mvc.Model.prototype.idAttribute = "id";


/**
 * getUrl
 */
mvc.Model.prototype.getUrl = function() {
    var url = this.base_url;
    if (this.id) {
        url += (url.charAt(url.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    }

    return url;
};

/**
 * isEqual needs to compare two objects, arrays, literals to see if they
 * contain the same value.
 *
 * @private
 */
mvc.isEqual = function(a, b) {
    return a == b;
};


/**
 * Get the value of an 
 */
mvc.Model.prototype.get = function(attr) {
    return this.attributes[attr];
};


mvc.Model.prototype.set = function(attr, value) {
    this.attributes[attr] = value;
    if (attr == this.idAttribute)
        this.id = value;

    this.changed = true;
};


mvc.Model.prototype.update = function(attrs) {
    // when saving models the response may not contain anything. Ignore
    // these update requests.
    if (!attrs)
        return;

    var now = this.attributes;
    var updatedAttributes = {};
    var changed = false;

    for (var attr in attrs) {
        var val = attrs[attr];
        if (!mvc.isEqual(now[attr], val)) {
            now[attr] = updatedAttributes[attr] = val;
            changed = true;
        }
    }

    if (changed) {
        if (this.idAttribute in updatedAttributes)
            this.id = updateAttributes[this.idAttribute];

        this.changed = true;
        this.dispatchEvent(new mvc.Model.ChangeEvent(updatedAttributes));
    }
};


/**
 * Interact with the data on the server. We can save or fetch the data.
 */
mvc.Model.prototype.save = function(opt_success, opt_error) {
    var model = this;

    var save_callback = function(event) {
        var xhr = event.target;
        if (xhr.isSuccess()) {
            var resp_data = goog.json.parse(xhr.getResponseText());
            model.changed = false;
            model.update(resp_data);
            if (opt_success)
                opt_succes(model, resp_data, xhr)
        } else {
            if (opt_error)
                opt_error(model, xhr);
        }
    };

    goog.net.XhrIo.send(
        model.getUrl(),
        save_callback,
        "POST",
        goog.json.serialize(model.attributes),
        {"Content-Type": "application/json"}
    );
};


/**
 *
 */
mvc.Model.prototype.fetch = function(opt_success, opt_error) {
    var fetch_callback = function(event) {
        var xhr = event.target;
        if (xhr.isSuccess()) {
            var resp_data = goog.json.parse(xhr.getResponseText());
            this.changed = false;
            this.update(resp_data);
            if (opt_success)
                opt_success(this, resp_data)
        } else {
            if (opt_error)
                opt_error(this, xhr);
        }
    };
    goog.net.XhrIo.send(this.url, fetch_callback, "GET");
};


/**
 * Events.
 *
 * @constructor
 */
mvc.Model.ChangeEvent = function(attributes) {
    goog.events.Event.call(this, "change");

    this.attributes = attributes;
};
goog.inherits(mvc.Model.ChangeEvent, goog.events.Event);


mvc.Model.EventType = {
    CHANGE: "change"
};
