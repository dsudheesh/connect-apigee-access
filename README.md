Express Session Apigee Cache
============================
Provides a session store functionality using Apigee cache. This is mainly useful for express apps using express-session module and running on Apigee cloud.

## Installation

npm install express-session-apigee-cache

## Usage
```
var session = require('express-session');
var ApigeeStore = require('express-session-apigee-cache')(session);

var options = {
  cache: "<name of the cache to use>",
  prefix: "<prefix>",
  ttl: 300,
}
app.use(session({
   store: new ApigeeStore(options),
   secret: 'keyboard cat'
}));
```
