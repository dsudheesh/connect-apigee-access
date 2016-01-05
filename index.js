var debug = require('debug')('express-session-apigee-cache');
var apigee = require('apigee-access');
var util = require('util');
var noop = function(){};

module.exports = function(session) {
  var Store = session.Store;

  function ApigeeStore(options) {
    if (!(this instanceof ApigeeStore)) {
      throw new TypeError("Cannot call ApigeeStore constructor as a function");
    }

    if (!options.cache) {
      throw new Error("Cache name not specified.");
    }

    Store.call(this, options);
    this.cache = apigee.getCache(options.cache);
    this.prefix = options.prefix == null ? 'sess:' : options.prefix;
    this.ttl = options.ttl;
  }

  util.inherits(ApigeeStore, Store);

  ApigeeStore.prototype.get = function (sid, fn) {
    var store = this;
    var psid = store.prefix+sid;
    if (!fn) fn = noop;

    store.cache.get(psid,function(err, data) {
      if (err) {
        return fn(err);
      }
      if (!data) {
        return fn(err);
      }

      var result;
      try {
        result = JSON.parse(data);
      }
      catch (er) {
        return fn(er);
      }
      debug("Retrieved session %s", sid);
      return fn(err, result);
    });
  };

  ApigeeStore.prototype.set = function (sid, sess, fn) {
    var store = this;
    var psid = store.prefix+sid;
    if (!fn) fn = noop;

    var jsess;
    try {
        jsess = JSON.stringify(sess);
    }
    catch (er){
        return fn(err);
    }

    store.cache.put(psid, jsess, store.ttl, function(err){
      if (err) {
        return fn(err);
      }
      debug("Session %s stored", sid);
      return fn(null);
    });
  };

  ApigeeStore.prototype.destroy = function (sid, fn) {
    var store = this;
    var psid = store.prefix+sid;
    if (!fn) fn = noop;

    store.cache.remove(psid, function (err){
      if (err) {
        return fn(err);
      }
      debug("Deleted session %s", sid);
      return fn(null);
    });
  };

  return ApigeeStore;
}
