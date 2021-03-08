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