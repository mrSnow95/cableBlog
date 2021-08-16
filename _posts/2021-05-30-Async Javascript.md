---
title: Async Javascript
date: 2021-05-30
use_math: true
---

Computer programs, such as scientific simulations, are CPU Bound: they run continuously, with no pause, until they have computed their result. The web, however, is pratically asynchronous. This means that they often have to stop computing while waiting for data to arrive or for some event to occur. JavaScript programs in a web browser are typically event-driven, meaning that they wait for the user to click or tap before they actually do anything. And JavaScript-based servers typically wait for client requests to arrive over the network before they do anything.

Async programming is commonplace in JavaScript. Promises are objects that represent the not-yet- available result of an asynchronous operation. The keywords async and await provide new syntax that simplifies asynchronous programming by allowing you to structure your Promise based code as if it was synchronous. Finally, asynchronous iterators and the for/await loop allow you to work with streams of asynchronous events using simple loops that appear synchronous.

Ironically, even though JavaScript provides these features for working with asynccode, there are no built-in features that are themselves asynchronous. 

**Asynchronous Programming with Callbacks**:

Fundamentally, async programming in JS is done with callbacks. A callback is a function that you write and then pass to some other function. That other function then invokes (“calls back”) your function when some condition is met or some (asynchronous) event occurs. The invocation of the callback function you provide notifies you of the condition or event, and sometimes, the invocation will include function arguments that provide additional details. 

**Timers** 

One of the simplest kinds of asynchrony is when you want to run some code after a certain amount of time has elapsed. 

```javascript
setTimeout(checkForUpdates, 60000);
```

The first argument to setTimeout() is a function and the second is a time interval measured in milliseconds. In the preceding code, a hypothetical checkForUpdates() function will be called 1 minute after the setTimeout() call. checkForUpdates() is a callback function that your program might define, and setTimeout() is the function that you invoke to register your callback function and specify under what asynchronous conditions it should be invoked.

To run repeatedly

```javascript
let updateIntervalId = setInterval(checkForUpdates, 60000);

function stopCheckingForUpdates() {
    clearInterval(updateIntervalId);
}
```

**Events**

Client-side JavaScript programs are event driven: rather than running some kind of predetermined computation, they typically wait for the user to do something and then respond to the user’s actions. The web browser generates an event when the user presses a key on the keyboard, moves the mouse, clicks a mouse button, or touches a touchscreen device. Event-driven JavaScript programs register callback functions for specified types of events in specified contexts, and the web browser invokes those functions whenever the specified events occur. These callback functions are called event handlers or event listeners, and they are registered with addEventListener():

```javascript

// Ask the web browser to return an object representing the HTML
// <button> element that matches this CSS selector
let okay = document.querySelector('#confirmUpdateDialog button.okay');
// Now register a callback function to be invoked when the user // clicks on that button.
okay.addEventListener('click', applyUpdate);

```

applyUpdate() is a callback function that we assume is implemented somewhere else. The call to document.querySelector() returns an object that represents a single specified element in the web page. We call addEventListener() on that element to register our callback. Then the first argument to addEventListener() is a string that specifies the kind of event we’re interested in—a mouse click or touchscreen tap. If the user clicks or taps on that specific element of the web page, then the browser will invoke our applyUpdate() callback function, passing an object that includes details (the time, the mouse pointer coordinates...) .

**Network Events**

Another common source of async in JS are network requests. JavaScript running in the browser can fetch data from a web server with code like this:

```javascript
function getCurrentVersionNumber(versionCallback) { 
    let request = new XMLHttpRequest();
    request.open("GET", "http://www.example.com/api/version"); 
    request.send();
    // Register a callback that will be invoked when the response arrives
    request.onload = function() {
        if (request.status === 200) {
            // If HTTP status is good, get version number and call callback.
            let currentVersion = parseFloat(request.responseText); 
            versionCallback(null, currentVersion);
        } else {
            // Otherwise report an error to the callback 
            versionCallback(response.statusText, null);
        } 
    }
    // Register another callback that will be invoked for network errors
    request.onerror = request.ontimeout = e => { versionCallback(e.type, null); }; 
}
```

Client-side JavaScript code can use the XMLHttpRequest class and a callback functions to make HTTP requests and asynchronously handle the server’s response when it arrives. The getCurrentVersionNumber() function defined here  makes an HTTP request and defines event handlers that will be invoked when the server’s response is received or when a timeout or other error causes the request to fail.

The code example above does not call addEventListener(). For most web APIs, event handlers can be defined by invoking addEventListener() on the object generating the event and passing the name of the event of interest along with the callback function. Typically, though, you can also register a single event listener by assigning it directly to a property of the object. Assigning functions to the onload, onerror, and ontimeout properties. By convention, event listener properties like these always have names that begin with on. addEventListener() is the more flexible technique because it allows for multiple event handlers.

**Callbacks and Events in Node**

The Node.js server-side JavaScript environment is deeply asynchronous and defines many APIs that use callbacks and events. The default API for reading the contents of a file, for example, is asynchronous and invokes a callback function when the contents of the file have been read:

```javascript

const fs = require("fs"); // The "fs" module has filesystem-related APIs 
let options = { 
    // An object to hold options for our program
    // default options would go here
};
    // Read a configuration file, then call the callback function
let cb = (err, text) => { 
    if (err) {
    // If there was an error, display a warning, but continue
        console.warn("Could not read config file:", err); 
    }
    else{
    // Otherwise, parse the file contents and assign to the options object
        Object.assign(options, JSON.parse(text));
    }
    // In either case, we can now start running the program
    startProgram(options);
}    

fs.readFile("config.json", "utf-8", cb);

```

Node’s fs.readFile() function takes a two-parameter callback as its last argument. It reads the specified file asynchronously and then invokes the callback. If the file was read successfully, it passes the file contents as the second callback argument. If there was an error, it passes the error as the first callback argument.


Node also defines a number of event-based APIs. The following function shows how to make an HTTP request for the contents of a URL in Node. It has two layers of asynchronous code handled with event listeners. Notice that Node uses an on() method to register event listeners instead of addEventListener():

```javascript
const https = require("https");
    // Read the text content of the URL and asynchronously pass it to the callback.
function getText(url, callback) {
    // Start an HTTP GET request for the URL 
    request = https.get(url);
    // Register a function to handle the "response" event.
    request.on("response", response => {
        // The response event means that response headers have been received 
        let httpStatus = response.statusCode;
            
        // The body of the HTTP response has not been received yet.
        // So we register more event handlers to to be called when it arrives. 
        response.setEncoding("utf-8"); // We're expecting Unicode text
        let body = ""; // which we will accumulate here.
        // This event handler is called when a chunk of the body is ready
        response.on("data", chunk => { body += chunk; });
        // This event handler is called when the response is complete
        response.on("end", () => { 
            if (httpStatus === 200) { 
                callback(null, body);
                // If the HTTP response was good
                // Pass response body to the callback
            }
            else {
                callback(httpStatus, null);
            } 
        });
    });
    // We also register an event handler for lower-level network errors
    request.on("error", (err) => { 
        callback(err, null)
    }) 
}
```

**Promises**

A Promise is an object that represents the result of an asynchronous computation. That result may or may not be ready yet, and the Promise API is intentionally vague about this: there is no way to synchronously get the value of a Promise; you can only ask the Promise to call a callback function when the value is ready. If you are defining an asynchronous API , but want to make it Promise-based, omit the callback argument, and instead return a Promise object. The caller can then register one or more callbacks on this Promise object, and they will be invoked when the asynchronous computation is done.

At the simplest level, Promises are just an alternative way of working with callbacks. However, there are practical benefits to using them. One real problem with callback- based asynchronous programming is that it is common to end up with callbacks inside callbacks inside callbacks, with lines of code so highly indented that it is diffi‐ cult to read. Promises allow this kind of nested callback to be re-expressed as a more linear Promise chain that tends to be easier to read and easier to reason about.


Promises seem simple at first, and the basic use case for Promises is, in fact, straightforward and simple. But they can become confusing for anything beyond the simplest use cases. Promises are a powerful idiom for asynchronous programming, but it's necessary to understand them deeply to use them correctly and confidently


**Using Promises**

One of the most important benefits of Promises is that they provide a natural way to express a sequence of asynchronous operations as a linear chain of then() method invocations, without having to nest each operation within the callback of the previous one. Here, for example, is a hypothetical Promise chain:

```javascript
fetch(documentURL) // Make an HTTP request
    .then(response => response.json()) // Ask for the JSON body of the response 
    .then(document => { // When we get the parsed JSON
        return render(document); // display the document to the user 
    })  
    .then(rendered => {         // When we get the rendered document
        cacheInDatabase(rendered);   // cache it in the local database.
    })
    .catch(error => handle(error)); // Handle any errors that occur  
```

Another example:

```javascript
fetch("/api/user/profile").then(response => {
        // When the promise resolves, we have status and headers 
        if (response.ok && response.headers.get("Content-Type") === "application/json") {
            // What can we do here? We don't actually have the response body yet.
        } 
    });
```

When the Promise returned by fetch() is fulfilled, it passes a Response object to the function you passed to its then() method. This response object gives you access to request status and headers, and it also defines methods like text() and json(), which give you access to the body of the response in text and JSON-parsed forms, respectively. But although the initial Promise is fulfilled, the body of the response may not yet have arrived. So these text() and json() methods for accessing the body of the response themselves return Promises. Here’s a naive way of using fetch() and the response.json() method to get the body of an HTTP response:

```javascript
fetch("/api/user/profile").then(response => {
     response.json().then( profile => { // Ask for the JSON-parsed body
        // When the body of the response arrives, it will be automatically 
        // parsed as JSON and passed to this function
        displayUserProfile(profile);
    }); 
});
```

This is a naive way to use Promises because we nested them, like callbacks, which defeats the purpose. The preferred idiom is to use Promises in a sequential chain with code like this:

```javascript
 fetch("/api/user/profile")
        .then(response => {
            return response.json(); 
        })
        .then(profile => {
            displayUserProfile(profile);
});
```
Let’s look at the method invocations in this code, ignoring the arguments that are passed to the methods:

```javascript
    fetch().then().then()
```

**Promises in Parallel**

Sometimes we want to execute a number of asynchronous operations in parallel. The function Promise.all() can do this. Promise.all() takes an array of Promise objects as its input and returns a Promise. The returned Promise will be rejected if any of the input Promises are rejected. Otherwise, it will be fulfilled with an array of the fulfillment values of each of the input Promises. So, for example, if you want to fetch the text content of multiple URLs, you could use code like this:

```javascript
// We start with an array of URLs
const urls = [ /* zero or more URLs here */ ];
// And convert it to an array of Promise objects
promises = urls.map(url => fetch(url).then(r => r.text())); // Now get a Promise to run all those Promises in parallel 
Promise.all(promises)
       .then(bodies => { /* do something with the array of strings */ }) 
       .catch(e => console.error(e));

```

Promise.all() is slightly more flexible than described before. The input array can contain both Promise objects and non-Promise values. If an element of the array is not a Promise, it is treated as if it is the value of an already fulfilled Promise and is simply copied unchanged into the output array.

The Promise returned by Promise.all() rejects when any of the input Promises is rejected. This happens immediately upon the first rejection and can happen while other input Promises are still pending. In ES2020, Promise.allSettled() takes an array of input Promises and returns a Promise, just like Promise.all() does. But Promise.allSettled() never rejects the returned Promise, and it does not fulfill that Promise until all of the input Promises have settled. The Promise resolves to an array of objects, with one object for each input Promise. Each of these returned objects has a status property set to “fulfilled” or “rejected.” If the status is “fulfilled”, then the object will also have a value property that gives the fulfillment value. And if the status is “rejected”, then the object will also have a reason property that gives the error or rejection value of the corresponding Promise:

```javascript
Promise.allSettled([Promise.resolve(1), Promise.reject(2), 3]).then(results => {
    results[0] // => { status: "fulfilled", value: 1 }
    results[1] // => { status: "rejected", reason: 2 }
    results[2] // => { status: "fulfilled", value: 3 }
});

```

Promise.all() makes it easy to run an arbitrary number of Promises in parallel. And Promise chains make it easy to express a sequence of a fixed number of Promises. Running an arbitrary number of Promises in sequence is trickier, however. Suppose, for example, that you have an array of URLs to fetch, but that to avoid overloading your network, you want to fetch them one at a time. If the array is of arbitrary length and unknown content, you can’t write out a Promise chain in advance, so you need to build one dynamically, with code like this:


```javascript
function fetchSequentially(urls) {
    // We'll store the URL bodies here as we fetch them 
    const bodies = [];
    // Here's a Promise-returning function that fetches one body
    function fetchOne(url) { 
        return fetch(url)
                .then(response => response.text())
                .then(body => {
    // We save the body to the array, and we're purposely 
    // omitting a return value here (returning undefined) 
                    bodies.push(body);
            }); 
    }
    // Start with a Promise that will fulfill right away (with value undefined)
    let p = Promise.resolve(undefined);
    // Now loop through the desired URLs, building a Promise chain
    // of arbitrary length, fetching one URL at each stage of the chain 
    for(url of urls) {
            p = p.then(() => fetchOne(url));
    }
    // When the last Promise in that chain is fulfilled, then the
    // bodies array is ready. So let's return a Promise for that
    // bodies array. Note that we don't include any error handlers: 
    // we want to allow errors to propagate to the caller.
    return p.then(() => bodies);
}
```

Now: 

```javascript
function promiseSequence(inputs, promiseMaker) {
        // Make a private copy of the array that we can modify
        inputs = [...inputs];
        // Here's the function that we'll use as a Promise callback 
        // This is the pseudorecursive magic that makes this all work. 
        function handleNextInput(outputs) {
            if (inputs.length === 0) {
            // If there are no more inputs left, then return the array 
            // of outputs, finally fulfilling this Promise and all the 
            // previous resolved-but-not-fulfilled Promises.
                return outputs;
            } else {
            // If there are still input values to process, then we'll
            // return a Promise object, resolving the current Promise
            // with the future value from a new Promise.
                let nextInput = inputs.shift(); 
                // Get the next input value, return promiseMaker(nextInput) 
                // compute the next output value,
                // Then create a new outputs array with the new output value
                .then(output => outputs.concat(output))
                // Then "recurse", passing the new, longer, outputs array .then(handleNextInput);
                // Start with a Promise that fulfills to an empty array and use // the function above as its callback.
                return Promise.resolve([]).then(handleNextInput);
            }
        }
}

  // Given a URL, return a Promise that fulfills to the URL body text
function fetchBody(url) { return fetch(url).then(r => r.text()); } 
// Use it to sequentially fetch a bunch of URL bodies 
promiseSequence(urls, fetchBody)
.then(bodies => { /* do something with the array of strings */ }) .catch(console.error);

```