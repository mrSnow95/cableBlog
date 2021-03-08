---
title: Optimizing Code Performance and control flow with Async
date: 2021-02-05
use_math: true
---

Async handling its what makes Node.js a powerful tool but also a confusing one. With C++, Java, C# and other OO languages, we were used to sync operations. Like:

```javascript
console.log('Starting calculation...');
var result = 4 + 2;
console.log('The result is', result);
```

Often, callbacks are used when operations are executed in the background and jump back into our code’s control flow asynchronously at a later point in time:


```javascript

console.log('Starting calculation...');
startExpensiveCalculation(5, 4, function(err, result) {
if (!err) {
    console.log('The result is', result);
}
});

```
If those asynchronous background operations bring forth a more complex callback behaviour, they might be implemented as an event emitter:

```javascript
console.log('Starting calculation...');
calculation = Calculator.start(5, 4);

calculation.on('error', function(err) {
    console.log('An error occured:', err);
});

calculation.on('interim result', function(result) {
    console.log('Received interim result:', result);
});

calculation.on('done', function(result) {
    console.log('Received final result:', result);
});

```

Handling expensive operations asynchronously in the background, especially if they are IO-bound, is an important key to making Node.js applications perform efficiently - reading a large file or writing a lot of records to a database will always be a costly procedure, but handling it asynchronously at least ensures that the other parts of our application won’t be blocked while that procedure is going on. Nevertheless, there is often potential for optimization within our own code and its control flow

**Executing expensive async background tasks in Parallel**

Let’s consider an example where our application queries several different remote web services, presenting the retrieved data on the console.

We are not going to query real remote web services, instead we will write a very simple Node.js HTTP server that will serve as a dummy web service. Our web server doesn’t really do anything
significant, and therefore we will make it react to requests a bit slower than neccessary, in order to simulate a real web service that has a certain workload - as you will see, this makes it easier for us to show the performance gain in our own code optimizations.

Create a new project folder and create a file server.js with the following content:

```javascript

'use strict';

var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(request, response) {

    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query;
    var id = querystring.parse(query)['id'];

    var result = {
        'pathname': pathname,
        'id': id,
        'value': Math.floor(Math.random() * 100)
    };

    setTimeout(function() {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(result));
    }, 2000 + Math.floor(Math.random() * 1000));

})
 
 server.listen(8080 , () => {
    console.log('Echo Server listening on port 8080');

 })
```
This gives us a very simple “echo” server - if we request the URL http://localhost:8080/getUser?id=4, we receive {"pathname":"/getUser","id":"4","value":67} as the response. This is good enough
to give us the simulation of a remote webservice API to play around with.

But alas, it’s a slow webservice! Someone didn’t do his optimization homework, and we now have to deal with an API where every response takes between 2 to 3 seconds (this is simulated with the setTimeout construct on lines 19-22).

This allows to show how different request patterns will result in different runtime characteristics. 



We will now write a Node.js client for this webserver. This client will make two consecutive requests to the server, and print the output for both requests on the command line:

```javascript
'use strict';

var request = require('request');

request.get(
  'http://localhost:8080/getUserName?id=1234',
  function(err, res, body) {
    var result = JSON.parse(body);
    var name = result.value;
    
    request.get(
      'http://localhost:8080/getUserStatus?id=1234',
      function(err, res, body) {
        var result = JSON.parse(body);
        var status = result.value;
        
        console.log('The status of user', name, 'is', status);
      });
    
  });

```

This is probably the most straight-forward solution. We start the first request, wait for it to finish, print the result, then start the second request, wait for it to finish, and print that result, too.

How long does that take? Let’s see:

```bash
$ time node client.js
The status of user 62 is 68
real 0m5.810s
user 0m0.172s
sys 0m0.033s

```

Not surprisingly, it takes around 5-6 seconds, because we only start the second request after the first request has been completed, and each request takes around 2-3 seconds.

We can’t do anything about the terribly slow remote webservice, but our own code isn’t exactly optimal either. Our two requests don’t inherently depend on each other, and yet, we are executing
them serially.

Of course starting these requests in parallel is simple, because both are asynchronous operations:

```javascript
'use strict';

var request = require('request');

var name, status;

request.get(
  'http://localhost:8080/getUserName?id=1234',
  function(err, res, body) {
  var result = JSON.parse(body);
  name = result.value;
});

request.get(
 'http://localhost:8080/getUserStatus?id=1234',
 function(err, res, body) {
 var result = JSON.parse(body);
 status = result.value;
});

console.log('The status of user', name, 'is', status);

```

Actually ....... That’s not going to work - console.log will execute within the first event loop iteration while the request callbacks are triggered in later iterations. Mh, how about…

```javascript
'use strict';

var request = require('request');

var name, status;

request.get(
  'http://localhost:8080/getUserName?id=1234',
  function(err, res, body) {
    var result = JSON.parse(body);
    name = result.value;
});

request.get(
  'http://localhost:8080/getUserStatus?id=1234',
  function(err, res, body) {
  var result = JSON.parse(body);
  status = result.value;

  console.log('The status of user', name, 'is', status);
});

```

No, that’s not good either: We start both request in parallel, but we have no guarantee that they will finish at the same time. We risk printing

```bash
The status of user undefined is 69

```
if the second request finishes earlier than the first. Well, looks like we need some additional code to synchronize our finished calls. How about this:

```javascript
'use strict';

var request = require('request');

var name, status;
var firstHasFinished, secondHasFinished = false;

request.get(
  'http://localhost:8080/getUserName?id=1234',
  function(err, res, body) {
  var result = JSON.parse(body);
  name = result.value;
  markFinished('first');
});

request.get(
  'http://localhost:8080/getUserStatus?id=1234',
  function(err, res, body) {
  var result = JSON.parse(body);
  status = result.value;
  markFinished('second');
});

function markFinished(step) {
  if (step == 'first') {
    firstHasFinished = true;
  }

  if (step == 'second') {
    secondHasFinished = true;
  }

  if (firstHasFinished && secondHasFinished) {
  console.log('The status of user', name, 'is', status);
}

```
What if we need to synchronize dozens or hundreds of operations? We could use an array where we store the state of each operation… no, this whole thing doesn’t feel right.

async to the rescue, I say!

async is a clever little module that makes managing complex control flows in our code a breeze.

After installing the module via npm install async, we can write our client like this:

```javascript
'use strict';

var request = require('request');
var async = require('async');

var name, status;

var getUsername = function(callback) {
  request.get(
    'http://localhost:8080/getUserName?id=1234',
    function(err, res, body) {
      var result = JSON.parse(body);
      callback(err, result.value);
    });
};

var getUserStatus = function(callback) {
  request.get(
    'http://localhost:8080/getUserStatus?id=1234',
    function (err, res, body) {
      var result = JSON.parse(body);
      callback(err, result.value);
    });
};

async.parallel([getUsername, getUserStatus], function(err, results) {
  console.log('The status of user', results[0], 'is', results[1]);
});

```

Let’s analyze what we are doing here.

On line 4, we load the async library. We then wrap our requests into named functions. These
functions will be called with a callback parameter. Inside our functions, we trigger this callback when our operation has finished - in this case, when the requests have been answered.

We call the callbacks with two parameters: an error object (which is null if no errors occured), and the result value.

We use the parallel method of the async object and pass an array of all the functions we want to run in parallel. Additionally, we pass a callback function which expect two parameters, err and results.

async.parallel will trigger this callback as soon as the slowest of the parallel operations has finished (and called its callback), or as soon as one of the operations triggers its callback with an error.

Let’s see what this does to the total runtime of our script:

```bash
$ time node client.js
The status of user 95 is 54

real 0m3.176s
user 0m0.240s
sys 0m0.044s
```

As one would expect, the total runtime of our own code matches the runtime of one request because both requests are started in parallel and will finish roughly at the same time.

**Optimizing Code structure with async**


Sometimes we want to run operations in series. This is of course possible by putting method calls into the callback functions of previous method calls, but the code quickly becomes ugly if you do this with a lot of methods.

We can use async.series to achieve the same control flow with much cleaner code.


Just as with async.parallel, we can use async.series to collect the results of each step and do something with them once all steps have finished. This is again achieved by passing the result of each step to the callback each step triggers, and by providing a callback function to the async.series call which will receive an array of all results:

```javascript

'use strict';

var request = require('request');
var async = require('async');

var url = 'http://localhost:8080/';

async.series([
    
    function(callback) {
      request.get(url + 'getUserName?id=1234', function(err, res, body) {
        callback(null, 'Name: ' + JSON.parse(body).value);
      });
    },
    
    function(callback) {
      request.get(url + 'getUserStatus?id=1234', function(err, res, body) {
        callback(null, 'Status: ' + JSON.parse(body).value);
      });
    },
    
    function(callback) {
      request.get(url + 'getUserCountry?id=1234', function(err, res, body) {
        callback(null, 'Country: ' + JSON.parse(body).value);
      });
    },
    
    function(callback) {
      request.get(url + 'getUserAge?id=1234', function(err, res, body) {
        callback(null, 'Age: ' + JSON.parse(body).value);
      });
    }
  
  ],
  
  function(err, results) {
    for (var i=0; i < results.length; i++) {
      console.log(results[i]);
    }
  }

);

```
In case that one of the series steps passes a non-null value to its callback as the first parameter, the series is immediately stopped, and the final callback is triggered with the results that have been collected to far, and the err parameter set to the error value passed by the failing step.

async.waterfall is similar to async.series, as it executes all steps in series, but it also enables us to access the results of a previous step in the step that follows:

```javascript
'use strict';

var request = require('request');
var async = require('async');

var url = 'http://localhost:8080/';

async.waterfall([
    
    function(callback) {
      request.get(url + 'getSessionId', function(err, res, body) {
        callback(null, JSON.parse(body).value);
      });
    },
    
    function(sId, callback) {
      request.get(url + 'getUserId?sessionId=' + sId, function(err, res, body) {
        callback(null, sId, JSON.parse(body).value);
      });
    },
    
    function(sId, uId, callback) {
      request.get(url + 'getUserName?userId=' + uId, function(err, res, body) {
        callback(null, JSON.parse(body).value, sId);
      });
    }
  
  ],
  
  function(err, name, sId) {
    console.log('Name:', name);
    console.log('SessionID:', sId);
  }

);

```


Note how for each step function,callback is passed as the last argument. It follows a list of arguments for each parameter that is passed by the previous function, minus the error argument which each step function always passes as the first parameter to the callback function.

Also note the difference in the final callback: instead of results, it too expects a list of result values, passed by the last waterfall step.

async provides several other interesting methods which help us to bring order in our control flow and allows us to orchestrate tasks in an efficient manner :)

