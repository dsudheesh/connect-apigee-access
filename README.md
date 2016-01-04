Connect Apigee Access
============================
Provides a session store functionality using Apigee cache. This is mainly useful for express apps using express-session module and running on Apigee cloud.

## Installation

npm install connect-apigee-access

## Usage
```
var session = require('express-session');
var ApigeeStore = require('connect-apigee-access')(session);

var options = {
  cache: <name of the cache to use>,
  prefix: "<prefix>",
  ttl: 300,
}
app.use(session({
   store: new ApigeeStore(options),
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false
}));
```
